import https from 'https';
import { logger } from './logger.js';

const GITHUB_API_URL = 'https://api.github.com/repos/elbruno/md-to-slides/releases';
const REPO_OWNER = 'elbruno';
const REPO_NAME = 'md-to-slides';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'md2slides-cli/1.0.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    https.get(url, options, (res) => {
      let data = '';

      if (res.statusCode === 404) {
        reject(new Error('Repository not found'));
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error('Invalid JSON response from GitHub'));
        }
      });
    }).on('error', reject);
  });
}

export async function getLatestRelease() {
  try {
    const url = `${GITHUB_API_URL}/latest`;
    const release = await makeRequest(url);

    return {
      tag: release.tag_name || 'unknown',
      version: release.tag_name?.replace(/^v/, '') || 'unknown',
      name: release.name || 'Release',
      prerelease: release.prerelease || false,
      downloadUrl: getDownloadUrl(release.tag_name),
      createdAt: release.created_at,
      publishedAt: release.published_at
    };
  } catch (err) {
    logger.debug(`GitHub API error: ${err.message}`);
    throw new Error('Could not fetch latest release from GitHub. Check your internet connection.');
  }
}

export async function getAllReleases() {
  try {
    const url = `${GITHUB_API_URL}?per_page=30`;
    const releases = await makeRequest(url);

    return releases
      .filter(r => !r.prerelease)
      .map(r => ({
        tag: r.tag_name,
        version: r.tag_name?.replace(/^v/, ''),
        name: r.name,
        downloadUrl: getDownloadUrl(r.tag_name),
        publishedAt: r.published_at
      }));
  } catch (err) {
    logger.debug(`GitHub API error: ${err.message}`);
    throw new Error('Could not fetch releases from GitHub. Check your internet connection.');
  }
}

export function getDownloadUrl(tag) {
  return `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/download/${tag}/presentation-skill.tar.gz`;
}

export function compareVersions(current, latest) {
  const parseCurrent = current?.split('.').map(Number) || [0, 0, 0];
  const parseLatest = latest?.split('.').map(Number) || [0, 0, 0];

  for (let i = 0; i < 3; i++) {
    if ((parseLatest[i] || 0) > (parseCurrent[i] || 0)) {
      return -1;
    }
    if ((parseLatest[i] || 0) < (parseCurrent[i] || 0)) {
      return 1;
    }
  }

  return 0;
}
