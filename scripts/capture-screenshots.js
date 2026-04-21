const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureScreenshot(htmlPath, outputPath, deckName, previewSlide = 1) {
  console.log(`Capturing screenshot for ${deckName} (slide ${previewSlide})...`);
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1920, height: 1080 });
  
  const fileUrl = `file://${htmlPath.replace(/\\/g, '/')}`;
  const targetUrl = previewSlide > 1 ? `${fileUrl}#/${previewSlide}` : fileUrl;
  
  await page.goto(targetUrl, { waitUntil: 'networkidle0' });
  
  // Wait for Reveal.js to initialize
  await page.waitForSelector('.reveal', { timeout: 5000 });
  await page.waitForFunction(
    expectedSlide => {
      const counter = document.getElementById('slide-counter');
      return counter && counter.textContent.trim().startsWith(`${expectedSlide} /`);
    },
    { timeout: 5000 },
    previewSlide
  );
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Capture screenshot
  await page.screenshot({ 
    path: outputPath, 
    fullPage: false,
    type: 'png'
  });
  
  await browser.close();
  console.log(`Screenshot saved to ${outputPath}`);
}

async function main() {
  const examplesDir = path.join(__dirname, '..', 'examples');
  const screenshotsDir = path.join(__dirname, '..', 'docs', 'screenshots');
  
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  const examples = [
    { name: 'minimal-talk', dir: 'minimal-talk', title: 'Minimal Talk', previewSlide: 2 },
    { name: 'technical-talk', dir: 'technical-talk', title: 'Technical Talk' },
    { name: 'executive-pitch', dir: 'executive-pitch', title: 'Executive Pitch' },
    { name: 'workshop', dir: 'workshop-tutorial', title: 'Workshop Tutorial' }
  ];
  
  for (const example of examples) {
    const htmlPath = path.join(examplesDir, example.dir, 'slides.html');
    
    if (!fs.existsSync(htmlPath)) {
      console.log(`Skipping ${example.name}: ${htmlPath} does not exist`);
      continue;
    }
    
    const outputPath = path.join(screenshotsDir, `${example.name}-preview.png`);
    
    try {
      await captureScreenshot(htmlPath, outputPath, example.title, example.previewSlide);
    } catch (error) {
      console.error(`Error capturing ${example.name}:`, error.message);
    }
  }
  
  console.log('Screenshot capture complete!');
}

main().catch(console.error);
