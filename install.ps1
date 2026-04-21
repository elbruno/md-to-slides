# md-to-slides installation script for Windows PowerShell
# Run as: powershell -ExecutionPolicy Bypass -File install.ps1
# Downloads the latest main branch and installs to .copilot\skills\presentation-skill\

$ErrorActionPreference = "Stop"

$SkillName = "presentation-skill"
$Repo = "elbruno/md-to-slides"
$InstallDir = ".copilot\skills\$SkillName"
$TempDir = [System.IO.Path]::GetTempPath() + [System.IO.Path]::GetRandomFileName()
New-Item -ItemType Directory -Path $TempDir | Out-Null

trap {
  Remove-Item $TempDir -Recurse -Force -ErrorAction SilentlyContinue
  throw $_
}

Write-Host "📦 Installing $SkillName..." -ForegroundColor Green

# Download latest main branch as zip
Write-Host "⬇️  Downloading $Repo from main branch..." -ForegroundColor Cyan
$ZipUrl = "https://github.com/$Repo/archive/main.zip"
$ZipPath = "$TempDir\main.zip"
Invoke-WebRequest -Uri $ZipUrl -OutFile $ZipPath -UseBasicParsing | Out-Null

# Extract zip
Write-Host "📂 Extracting files..." -ForegroundColor Cyan
Expand-Archive -Path $ZipPath -DestinationPath $TempDir -Force

# Create install directory
Write-Host "📍 Setting up installation directory..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null

# Copy skill components
Write-Host "📋 Copying skill components..." -ForegroundColor Cyan
$SourceDir = "$TempDir\md-to-slides-main"
Copy-Item -Path "$SourceDir\skill\*" -Destination $InstallDir -Recurse -Force
Copy-Item -Path "$SourceDir\templates" -Destination $InstallDir -Recurse -Force
Copy-Item -Path "$SourceDir\examples" -Destination $InstallDir -Recurse -Force

# Validate installation
Write-Host "✅ Validating installation..." -ForegroundColor Cyan
$RequiredFiles = @(
  "$InstallDir\SKILL.md",
  "$InstallDir\contract.md",
  "$InstallDir\templates",
  "$InstallDir\examples"
)

$MissingFiles = 0
foreach ($File in $RequiredFiles) {
  if (-not (Test-Path $File)) {
    Write-Host "❌ Missing: $File" -ForegroundColor Red
    $MissingFiles++
  }
}

if ($MissingFiles -gt 0) {
  Write-Host "❌ Installation failed: $MissingFiles required files are missing" -ForegroundColor Red
  exit 1
}

# Cleanup
Remove-Item $TempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✨ Installation successful!" -ForegroundColor Green
Write-Host ""
Write-Host "📖 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Open GitHub Copilot or Claude Code in your editor"
Write-Host "  2. Reference the presentation skill in your requests:"
Write-Host "     'Use the presentation skill to create a deck about...'"
Write-Host ""
Write-Host "📍 Skill installed at: $InstallDir"
Write-Host "📚 Documentation: $InstallDir\SKILL.md"
Write-Host "📂 Examples: $InstallDir\examples"
Write-Host ""
