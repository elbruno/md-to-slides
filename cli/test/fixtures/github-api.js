// Mock GitHub releases API response
export const mockGitHubRelease = {
  tag_name: 'v1.0.0',
  name: 'Release v1.0.0',
  draft: false,
  prerelease: false,
  created_at: '2026-04-22T10:00:00Z',
  published_at: '2026-04-22T10:00:00Z',
  assets: [
    {
      name: 'presentation-skill-v1.0.0.tar.gz',
      url: 'https://github.com/elbruno/md-to-slides/releases/download/v1.0.0/presentation-skill-v1.0.0.tar.gz',
      browser_download_url: 'https://github.com/elbruno/md-to-slides/releases/download/v1.0.0/presentation-skill-v1.0.0.tar.gz',
      size: 15234,
      content_type: 'application/gzip'
    }
  ]
};

export const mockGitHubReleaseV101 = {
  ...mockGitHubRelease,
  tag_name: 'v1.0.1',
  name: 'Release v1.0.1',
  assets: [
    {
      ...mockGitHubRelease.assets[0],
      name: 'presentation-skill-v1.0.1.tar.gz',
      url: 'https://github.com/elbruno/md-to-slides/releases/download/v1.0.1/presentation-skill-v1.0.1.tar.gz',
      browser_download_url: 'https://github.com/elbruno/md-to-slides/releases/download/v1.0.1/presentation-skill-v1.0.1.tar.gz'
    }
  ]
};

// Mock config file structure
export const mockConfig = {
  version: '1.0.0',
  lastCheck: new Date().toISOString(),
  installations: {
    '.copilot/skills/presentation-skill': {
      installedVersion: '1.0.0',
      installedAt: new Date().toISOString(),
      source: 'npm'
    }
  },
  preferences: {
    checkUpdates: true,
    autoBackup: true,
    logLevel: 'info'
  }
};

// Mock installation directory structure
export const mockInstallationStructure = {
  'skill/contract.md': '# Presentation Skill Contract\nTest content',
  'templates/reveal-base.html': '<html><!-- reveal base --></html>',
  'templates/theme.css': 'body { color: #000; }',
  'examples/minimal-talk/input.md': '# Example\nTest',
  'examples/minimal-talk/slides.html': '<html><!-- slides --></html>',
  'README.md': '# md-to-slides\nTest readme'
};

// Required files for validation
export const requiredInstallationFiles = [
  'skill/contract.md',
  'templates/reveal-base.html',
  'templates/theme.css',
  'examples/'
];

// Mock error responses
export const mockErrorResponses = {
  networkError: new Error('Network error: Could not reach GitHub'),
  permissionError: new Error('EACCES: Permission denied'),
  notFoundError: new Error('ENOTFOUND: Could not resolve domain'),
  invalidHashError: new Error('Hash mismatch: Downloaded file does not match expected SHA256')
};
