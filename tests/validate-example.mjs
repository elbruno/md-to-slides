#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function resolveCliPath(candidate, fallback) {
  if (!candidate) {
    return fallback;
  }

  return path.isAbsolute(candidate) ? candidate : path.resolve(process.cwd(), candidate);
}

const [exampleInputArg, exampleHtmlArg] = process.argv.slice(2);

const paths = {
  exampleInput: resolveCliPath(exampleInputArg, path.join(repoRoot, "examples", "minimal-talk", "input.md")),
  exampleHtml: resolveCliPath(exampleHtmlArg, path.join(repoRoot, "examples", "minimal-talk", "slides.html")),
  minimalFixture: path.join(repoRoot, "tests", "fixtures", "minimal-deck.md"),
  edgeFixture: path.join(repoRoot, "tests", "fixtures", "edge-cases.md"),
};

const results = [];
const failures = [];

function check(name, fn) {
  try {
    fn();
    results.push(`PASS ${name}`);
  } catch (error) {
    failures.push({ name, message: error.message });
    results.push(`FAIL ${name}: ${error.message}`);
  }
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function normalizeText(value) {
  return value.replace(/\r\n/g, "\n").trimEnd() + "\n";
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countMatches(value, pattern) {
  const matches = value.match(pattern);
  return matches ? matches.length : 0;
}

function extractMatch(value, pattern, label) {
  const match = value.match(pattern);
  assert.ok(match, `Missing ${label}`);
  return match;
}

function parseAttributes(value) {
  const attributes = {};

  for (const match of value.matchAll(/([:\w-]+)(?:="([^"]*)")?/g)) {
    attributes[match[1]] = match[2] ?? "";
  }

  return attributes;
}

function parseDeckMarkdown(markdown) {
  const normalized = normalizeText(markdown);
  const frontMatterMatch = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
  assert.ok(frontMatterMatch, "Missing YAML front matter");

  const frontMatter = {};
  for (const line of frontMatterMatch[1].split("\n")) {
    if (!line.trim()) {
      continue;
    }

    const separatorIndex = line.indexOf(":");
    assert.ok(separatorIndex > 0, `Invalid front matter line: ${line}`);
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    frontMatter[key] = value;
  }

  const body = normalized.slice(frontMatterMatch[0].length).trim();
  const slides = body
    .split(/\n---\n/g)
    .map((slide) => slide.trim())
    .filter(Boolean)
    .map((slide) => {
      const directiveMatch = slide.match(/^<!--\s*slide:type=([a-z-]+)\s*-->\n?/);
      const type = directiveMatch ? directiveMatch[1] : "content";
      const withoutDirective = directiveMatch ? slide.slice(directiveMatch[0].length).trim() : slide;
      const notesMatch = withoutDirective.match(/\n\?\?\? notes\n([\s\S]*)$/);
      const content = notesMatch ? withoutDirective.slice(0, notesMatch.index).trim() : withoutDirective.trim();
      const notes = notesMatch ? notesMatch[1].trim() : "";
      const headingMatch = content.match(/^#{1,6}\s+(.+)$/m);

      return {
        type,
        content,
        notes,
        heading: headingMatch ? headingMatch[1].trim() : "",
      };
    });

  return { frontMatter, slides, raw: normalized };
}

function parseSlidesHtml(html) {
  const slidesContainer = extractMatch(
    html,
    /<div class="slides">\s*([\s\S]*?)\s*<\/div>\s*<div class="deck-progress"/,
    "slides container",
  )[1];

  const slides = [];
  const sectionPattern = /<section\b([^>]*)>([\s\S]*?)<\/section>/g;

  for (const match of slidesContainer.matchAll(sectionPattern)) {
    const attributes = parseAttributes(match[1]);
    const className = attributes.class ?? "";
    const innerHtml = match[2];
    const headingMatch = innerHtml.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/);
    const notesMatch = innerHtml.match(/<aside\b[^>]*class="[^"]*\bnotes\b[^"]*"[^>]*>\s*([\s\S]*?)<\/aside>/);
    const type =
      attributes["data-slide-type"] ??
      className
        .split(/\s+/)
        .find((token) => token.endsWith("-slide"))
        ?.replace(/-slide$/, "") ??
      "content";

    slides.push({
      type,
      className,
      classes: className.split(/\s+/).filter(Boolean),
      innerHtml,
      heading: headingMatch ? stripTags(headingMatch[1]) : "",
      notesHtml: notesMatch ? notesMatch[1].trim() : "",
      fragmentCount: countMatches(innerHtml, /class="[^"]*\bfragment\b[^"]*"/g),
    });
  }

  return slides;
}

class FakeClassList {
  constructor(initialValue = "") {
    this.values = new Set(initialValue.split(/\s+/).filter(Boolean));
  }

  add(...tokens) {
    for (const token of tokens) {
      this.values.add(token);
    }
  }

  remove(...tokens) {
    for (const token of tokens) {
      this.values.delete(token);
    }
  }

  contains(token) {
    return this.values.has(token);
  }

  toggle(token, force) {
    if (force === true) {
      this.values.add(token);
      return true;
    }

    if (force === false) {
      this.values.delete(token);
      return false;
    }

    if (this.values.has(token)) {
      this.values.delete(token);
      return false;
    }

    this.values.add(token);
    return true;
  }
}

class FakeElement {
  constructor({ id = null, tagName = "DIV", className = "", textContent = "", innerHTML = "", dataset = {}, children = [] } = {}) {
    this.id = id;
    this.tagName = tagName.toUpperCase();
    this.classList = new FakeClassList(className);
    this.textContent = textContent;
    this.innerHTML = innerHTML;
    this.dataset = { ...dataset };
    this.style = {};
    this.hidden = false;
    this.attributes = new Map();
    this.listeners = new Map();
    this.children = [];
    this.parentElement = null;
    this.selectorMap = new Map();
    this.selectorMapAll = new Map();

    if (id) {
      this.attributes.set("id", id);
    }
    if (className) {
      this.attributes.set("class", className);
    }

    for (const child of children) {
      this.appendChild(child);
    }
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  setAttribute(name, value) {
    const normalizedValue = String(value);
    this.attributes.set(name, normalizedValue);

    if (name === "id") {
      this.id = normalizedValue;
    }

    if (name === "class") {
      this.classList = new FakeClassList(normalizedValue);
    }

    if (name.startsWith("data-")) {
      const key = name
        .slice(5)
        .replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
      this.dataset[key] = normalizedValue;
    }
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  addEventListener(type, handler) {
    const handlers = this.listeners.get(type) ?? [];
    handlers.push(handler);
    this.listeners.set(type, handlers);
  }

  dispatchEvent(event) {
    const normalizedEvent = typeof event === "string" ? { type: event } : event;
    normalizedEvent.target ??= this;
    normalizedEvent.currentTarget = this;

    for (const handler of this.listeners.get(normalizedEvent.type) ?? []) {
      handler.call(this, normalizedEvent);
    }

    return true;
  }

  click() {
    this.dispatchEvent({
      type: "click",
      preventDefault() {},
    });
  }

  querySelector(selector) {
    if (this.selectorMap.has(selector)) {
      return this.selectorMap.get(selector);
    }

    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    if (this.selectorMapAll.has(selector)) {
      return [...this.selectorMapAll.get(selector)];
    }

    const matches = [];
    for (const child of this.children) {
      if (selector.startsWith(".") && child.classList.contains(selector.slice(1))) {
        matches.push(child);
      } else if (selector.startsWith("#") && child.id === selector.slice(1)) {
        matches.push(child);
      } else if (/^[a-z0-9-]+$/i.test(selector) && child.tagName === selector.toUpperCase()) {
        matches.push(child);
      }

      matches.push(...child.querySelectorAll(selector));
    }

    return matches;
  }
}

class FakeSlide extends FakeElement {
  constructor(slide) {
    super({ tagName: "SECTION", className: slide.className, dataset: { slideType: slide.type } });
    this.headingNode = new FakeElement({ tagName: "H2", textContent: slide.heading });
    this.notesNode = new FakeElement({ tagName: "ASIDE", className: "notes", innerHTML: slide.notesHtml });
    this.fragments = Array.from({ length: slide.fragmentCount }, () => new FakeElement({ className: "fragment" }));

    this.selectorMap.set("h1, h2, h3", this.headingNode);
    this.selectorMap.set("aside.notes", this.notesNode);
    this.selectorMapAll.set(".fragment", this.fragments);
  }
}

function createSpeakerDocument() {
  const ids = [
    "speaker-theme",
    "speaker-current-title",
    "speaker-current-notes",
    "speaker-slide-count",
    "speaker-elapsed",
    "speaker-next-title",
    "speaker-fragments",
  ];
  const elements = new Map();
  const body = { innerHTML: "" };

  return {
    title: "",
    body,
    write(value) {
      body.innerHTML = value;
      for (const id of ids) {
        if (!elements.has(id)) {
          elements.set(
            id,
            new FakeElement({
              id,
              tagName: id === "speaker-theme" ? "STYLE" : "DIV",
            }),
          );
        }
      }
    },
    close() {},
    getElementById(id) {
      return elements.get(id) ?? null;
    },
  };
}

function createRuntimeHarness(script, slides) {
  const slideNodes = slides.map((slide) => new FakeSlide(slide));
  const slidesContainer = new FakeElement({ className: "slides", children: slideNodes });
  const progressContainer = new FakeElement({ className: "deck-progress" });
  const progressBar = new FakeElement({ id: "deck-progress-bar", tagName: "SPAN" });
  progressContainer.appendChild(progressBar);

  const counter = new FakeElement({ id: "slide-counter", tagName: "SPAN", textContent: `1 / ${slides.length}` });
  const themeToggle = new FakeElement({ id: "theme-toggle", tagName: "BUTTON", textContent: "Dark" });
  const speakerButton = new FakeElement({ id: "speaker-view", tagName: "BUTTON", textContent: "Notes" });
  const root = new FakeElement({ className: "reveal", dataset: { deckTitle: slides[0]?.heading ?? "" }, children: [slidesContainer] });
  const body = new FakeElement({ tagName: "BODY", dataset: { theme: "dark" } });
  const documentElement = new FakeElement({ tagName: "HTML" });
  const localStorageState = new Map();
  let intervalId = 0;

  root.selectorMap.set(".slides", slidesContainer);

  const elementById = {
    "deck-progress-bar": progressBar,
    "slide-counter": counter,
    "theme-toggle": themeToggle,
    "speaker-view": speakerButton,
  };

  const documentListeners = new Map();
  const windowListeners = new Map();

  const documentObject = {
    body,
    documentElement,
    fullscreenElement: null,
    querySelector(selector) {
      if (selector === ".reveal") {
        return root;
      }

      return null;
    },
    querySelectorAll(selector) {
      if (selector === ".slides > section") {
        return slideNodes;
      }

      return [];
    },
    getElementById(id) {
      return elementById[id] ?? null;
    },
    addEventListener(type, handler) {
      const handlers = documentListeners.get(type) ?? [];
      handlers.push(handler);
      documentListeners.set(type, handlers);
    },
    dispatchEvent(typeOrEvent, eventOverride = {}) {
      const event = typeof typeOrEvent === "string" ? { type: typeOrEvent, ...eventOverride } : typeOrEvent;
      for (const handler of documentListeners.get(event.type) ?? []) {
        handler.call(this, event);
      }
      return true;
    },
    exitFullscreen() {
      this.fullscreenElement = null;
      return Promise.resolve();
    },
  };

  documentElement.requestFullscreen = () => {
    documentObject.fullscreenElement = documentElement;
    return Promise.resolve();
  };

  const historyObject = {
    replaceState(_state, _title, hash) {
      windowObject.location.hash = hash;
    },
  };

  const windowObject = {
    document: documentObject,
    location: { hash: "" },
    localStorage: {
      getItem(key) {
        return localStorageState.has(key) ? localStorageState.get(key) : null;
      },
      setItem(key, value) {
        localStorageState.set(key, String(value));
      },
    },
    addEventListener(type, handler) {
      const handlers = windowListeners.get(type) ?? [];
      handlers.push(handler);
      windowListeners.set(type, handlers);
    },
    dispatchEvent(typeOrEvent, eventOverride = {}) {
      const event = typeof typeOrEvent === "string" ? { type: typeOrEvent, ...eventOverride } : typeOrEvent;
      for (const handler of windowListeners.get(event.type) ?? []) {
        handler.call(this, event);
      }
      return true;
    },
    open() {
      const speakerWindow = {
        closed: false,
        document: createSpeakerDocument(),
      };
      this.lastSpeakerWindow = speakerWindow;
      return speakerWindow;
    },
    setInterval(handler) {
      intervalId += 1;
      this.intervals.set(intervalId, handler);
      return intervalId;
    },
    clearInterval(id) {
      this.intervals.delete(id);
    },
    intervals: new Map(),
  };

  const context = vm.createContext({
    Array,
    Buffer,
    Date,
    Map,
    Math,
    Promise,
    console,
    CustomEvent: class CustomEvent {
      constructor(type, init = {}) {
        this.type = type;
        this.detail = init.detail;
      }
    },
    document: documentObject,
    history: historyObject,
    parseInt,
    window: windowObject,
  });

  vm.runInContext(script, context, { filename: "minimal-talk-runtime.js" });

  return {
    counter,
    documentObject,
    progressBar,
    slideNodes,
    themeToggle,
    speakerButton,
    windowObject,
    fireKey(key) {
      const event = {
        type: "keydown",
        key,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        preventDefault() {
          this.defaultPrevented = true;
        },
      };

      documentObject.dispatchEvent(event);
      return event;
    },
    fireHashChange(hash) {
      windowObject.location.hash = hash;
      windowObject.dispatchEvent({ type: "hashchange" });
    },
  };
}

function activeSlideIndex(slideNodes) {
  return slideNodes.findIndex((slide) => slide.classList.contains("is-active"));
}

function visibleFragmentCount(slide) {
  return slide.fragments.filter((fragment) => fragment.classList.contains("visible")).length;
}

const exampleInput = readText(paths.exampleInput);
const exampleHtml = readText(paths.exampleHtml);
const minimalFixture = readText(paths.minimalFixture);
const edgeFixture = readText(paths.edgeFixture);

const minimalDeck = parseDeckMarkdown(minimalFixture);
const edgeDeck = parseDeckMarkdown(edgeFixture);
const htmlSlides = parseSlidesHtml(exampleHtml);
const inlineScript = extractMatch(exampleHtml, /<script>\s*([\s\S]*?)\s*<\/script>\s*<\/body>/, "inline runtime")[1];
const expectedSlideTypes = minimalDeck.slides.map((slide) => slide.type);

check("minimal fixture matches the shipped minimal source", () => {
  assert.equal(normalizeText(minimalFixture), normalizeText(exampleInput));
});

check("minimal fixture keeps the expected three-slide contract", () => {
  assert.equal(minimalDeck.frontMatter.contract, "presentation-skill/v1");
  assert.equal(minimalDeck.frontMatter.title, "Ship a clear talk");
  assert.equal(minimalDeck.slides.length, 3);
  assert.equal(minimalDeck.slides[0].type, "title");
  assert.equal(minimalDeck.slides[2].type, "closing");
  assert.ok(minimalDeck.slides.every((slide) => slide.heading), "Each slide should start with a heading");
  assert.equal(minimalDeck.slides.filter((slide) => slide.notes).length, 2, "Expected notes coverage on the first two slides");
});

check("edge-case fixture covers the current v1 authoring surface", () => {
  assert.equal(edgeDeck.frontMatter.contract, "presentation-skill/v1");
  assert.ok(edgeDeck.slides.length >= 5, "Expected at least five slides in the edge fixture");
  assert.ok(edgeDeck.slides.some((slide) => slide.type === "code"), "Missing code slide coverage");
  assert.ok(edgeDeck.slides.some((slide) => slide.type === "two-column"), "Missing two-column slide coverage");
  assert.ok(edgeDeck.slides.some((slide) => slide.type === "demo-transition"), "Missing demo-transition coverage");
  assert.ok(edgeDeck.slides.some((slide) => slide.type === "closing"), "Missing closing slide coverage");
  assert.ok(/```[a-z0-9]+\n/i.test(edgeDeck.raw), "Missing fenced code block");
  assert.ok(/\| Check \| Expectation \|/.test(edgeDeck.raw), "Missing table coverage");
  assert.ok(/!\[[^\]]+\]\([^)]+\)/.test(edgeDeck.raw), "Missing image with alt text coverage");
  assert.ok(/\[[^\]]+\]\(https?:\/\/[^\)]+\)/.test(edgeDeck.raw), "Missing link coverage");
  assert.ok(/°/.test(edgeDeck.raw) && /€/.test(edgeDeck.raw) && /→/.test(edgeDeck.raw) && /🚀/.test(edgeDeck.raw), "Missing special character coverage");
  assert.ok(/^\s{2}- /m.test(edgeDeck.raw) && /^\s{4}- /m.test(edgeDeck.raw), "Missing nested list coverage");
  assert.ok(countMatches(edgeDeck.raw, /\?\?\? notes/g) >= 4, "Expected repeated speaker notes coverage");
});

check("example HTML keeps the file-level contract", () => {
  assert.ok(exampleHtml.startsWith("<!DOCTYPE html>"), "Missing HTML5 doctype");
  assert.match(exampleHtml, /<html lang="en">/);
  assert.match(exampleHtml, /<meta charset="utf-8">/);
  assert.match(exampleHtml, /<meta name="description" content="[^"]+">/);
  assert.match(exampleHtml, new RegExp(`<title>${escapeRegex(minimalDeck.frontMatter.title)}<\\/title>`));
  assert.match(exampleHtml, /<body data-theme="dark">/);
  assert.match(exampleHtml, /<style>[\s\S]*<\/style>/);
  assert.match(exampleHtml, /<script>[\s\S]*<\/script>/);
  assert.ok(!/{{|{%/.test(exampleHtml), "Found unresolved template markers");
  assert.ok(Buffer.byteLength(exampleHtml, "utf8") <= 5 * 1024 * 1024, "slides.html exceeds 5 MB");
});

check("example HTML keeps the expected slide structure", () => {
  assert.equal(htmlSlides.length, minimalDeck.slides.length);
  assert.deepEqual(
    htmlSlides.map((slide) => slide.type),
    expectedSlideTypes,
  );
  assert.ok(htmlSlides.every((slide) => slide.heading), "Each rendered slide should expose a heading");
  assert.ok(htmlSlides[0].classes.includes("title-slide"), "First slide should keep the title-slide treatment");
  assert.match(htmlSlides[0].innerHtml, new RegExp(escapeRegex(minimalDeck.frontMatter.speaker)));
  assert.match(htmlSlides[0].innerHtml, new RegExp(escapeRegex(minimalDeck.frontMatter.event)));
  assert.equal(htmlSlides[0].heading, minimalDeck.frontMatter.title);
  assert.ok(htmlSlides[1].classes.includes("content-slide"), "Second slide should keep the content-slide treatment");
  assert.match(htmlSlides[1].innerHtml, /class="split-layout"/);
  assert.match(htmlSlides[1].innerHtml, /class="checklist"/);
  assert.match(htmlSlides[1].innerHtml, /class="code-panel"/);
  assert.ok(htmlSlides[1].fragmentCount >= 2, "Expected fragment coverage on the middle slide");
  assert.match(htmlSlides[1].innerHtml, new RegExp(`<pre><code>[\\s\\S]*title: ${escapeRegex(minimalDeck.frontMatter.title)}`));
  assert.ok(htmlSlides[2].classes.includes("closing-slide"), "Third slide should keep the closing-slide treatment");
  assert.match(htmlSlides[2].innerHtml, /class="closing-panel"/);
  assert.match(htmlSlides[2].innerHtml, /href="#\/1"/);
  assert.ok(htmlSlides.every((slide) => slide.notesHtml), "Every slide should keep presenter notes");
});

check("example HTML keeps the presentation chrome", () => {
  assert.match(exampleHtml, /id="theme-toggle"/);
  assert.match(exampleHtml, /id="speaker-view"/);
  assert.match(
    exampleHtml,
    new RegExp(`id="slide-counter"[^>]*>\\s*1\\s*\\/\\s*${minimalDeck.slides.length}\\s*<\\/span>`),
  );
  assert.match(exampleHtml, /id="deck-progress-bar"/);
  assert.match(exampleHtml, new RegExp(`data-deck-title="${escapeRegex(minimalDeck.frontMatter.title)}"`));
  assert.match(exampleHtml, new RegExp(`<strong>${escapeRegex(minimalDeck.frontMatter.title)}<\\/strong>`));
});

check("runtime initializes the first slide and chrome state", () => {
  const runtime = createRuntimeHarness(inlineScript, htmlSlides);
  assert.ok(runtime.windowObject.Reveal, "Expected the inline runtime to expose a Reveal-like API");
  assert.equal(runtime.windowObject.Reveal.getTotalSlides(), htmlSlides.length);
  assert.equal(runtime.windowObject.Reveal.getIndices().h, 0);
  assert.equal(activeSlideIndex(runtime.slideNodes), 0);
  assert.equal(runtime.counter.textContent, "1 / 3");
  assert.equal(runtime.progressBar.style.width, "0%");
  assert.equal(runtime.windowObject.location.hash, "#/1");
});

check("runtime advances across slides and fragments", () => {
  const runtime = createRuntimeHarness(inlineScript, htmlSlides);

  runtime.fireKey("ArrowRight");
  assert.equal(activeSlideIndex(runtime.slideNodes), 1);
  assert.equal(runtime.counter.textContent, "2 / 3");
  assert.equal(runtime.windowObject.location.hash, "#/2");

  const fragmentTotal = runtime.slideNodes[1].fragments.length;
  assert.ok(fragmentTotal >= 2, "Expected the middle slide to keep multiple fragments");

  for (let index = 0; index < fragmentTotal; index += 1) {
    runtime.fireKey("PageDown");
    assert.equal(activeSlideIndex(runtime.slideNodes), 1);
    assert.equal(visibleFragmentCount(runtime.slideNodes[1]), index + 1);
  }

  runtime.fireKey(" ");
  assert.equal(activeSlideIndex(runtime.slideNodes), 2);
  assert.equal(runtime.counter.textContent, "3 / 3");
  assert.equal(runtime.progressBar.style.width, "100%");
  assert.equal(runtime.windowObject.location.hash, "#/3");
});

check("runtime supports back, home, end, and hash navigation", () => {
  const runtime = createRuntimeHarness(inlineScript, htmlSlides);

  runtime.fireKey("End");
  assert.equal(activeSlideIndex(runtime.slideNodes), 2);

  runtime.fireKey("ArrowLeft");
  assert.equal(activeSlideIndex(runtime.slideNodes), 1);

  runtime.fireKey("Home");
  assert.equal(activeSlideIndex(runtime.slideNodes), 0);

  runtime.fireHashChange("#/2");
  assert.equal(activeSlideIndex(runtime.slideNodes), 1);
  assert.equal(runtime.counter.textContent, "2 / 3");
  assert.equal(runtime.windowObject.Reveal.getIndices().h, 1);
});

check("runtime toggles theme and fullscreen", () => {
  const runtime = createRuntimeHarness(inlineScript, htmlSlides);

  runtime.fireKey("t");
  assert.equal(runtime.documentObject.body.dataset.theme, "light");

  runtime.fireKey("F");
  assert.equal(runtime.documentObject.fullscreenElement, runtime.documentObject.documentElement);

  runtime.fireKey("f");
  assert.equal(runtime.documentObject.fullscreenElement, null);
});

check("runtime opens speaker view with notes and next-slide preview", () => {
  const runtime = createRuntimeHarness(inlineScript, htmlSlides);

  runtime.fireKey("s");

  const speakerWindow = runtime.windowObject.lastSpeakerWindow;
  assert.ok(speakerWindow, "Speaker view did not open");
  assert.match(speakerWindow.document.title, new RegExp(escapeRegex(htmlSlides[0].heading)));
  assert.equal(speakerWindow.document.getElementById("speaker-current-title").textContent, htmlSlides[0].heading);
  assert.equal(speakerWindow.document.getElementById("speaker-next-title").textContent, htmlSlides[1].heading);
  assert.equal(speakerWindow.document.getElementById("speaker-slide-count").textContent, "Slide 1 of 3");
  assert.match(speakerWindow.document.getElementById("speaker-current-notes").innerHTML, /one source file in/i);
  assert.match(speakerWindow.document.getElementById("speaker-theme").textContent, /body\{/);
});

for (const line of results) {
  console.log(line);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} validation check(s) failed.`);
  process.exit(1);
}

console.log(`\nValidated ${results.length} checks for the minimal example deck.`);
