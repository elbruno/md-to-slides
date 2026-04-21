#!/bin/bash

# md-to-slides installation script for macOS/Linux/WSL
# Downloads the latest main branch and installs to .copilot/skills/presentation-skill/

set -e

SKILL_NAME="presentation-skill"
REPO="elbruno/md-to-slides"
INSTALL_DIR=".copilot/skills/$SKILL_NAME"

echo "📦 Installing $SKILL_NAME..."

# Create temporary directory for download
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Download latest main branch as tarball
echo "⬇️  Downloading $REPO from main branch..."
curl -sL "https://github.com/$REPO/archive/main.tar.gz" -o "$TEMP_DIR/main.tar.gz"

# Extract tarball
echo "📂 Extracting files..."
cd "$TEMP_DIR"
tar xz -f main.tar.gz

# Create install directory
echo "📍 Setting up installation directory..."
mkdir -p "$INSTALL_DIR"

# Copy skill components
echo "📋 Copying skill components..."
cp -r "md-to-slides-main/skill"/* "$INSTALL_DIR/"
cp -r "md-to-slides-main/templates" "$INSTALL_DIR/"
cp -r "md-to-slides-main/examples" "$INSTALL_DIR/"

# Validate installation
echo "✅ Validating installation..."
required_files=(
  "$INSTALL_DIR/SKILL.md"
  "$INSTALL_DIR/contract.md"
  "$INSTALL_DIR/templates"
  "$INSTALL_DIR/examples"
)

missing_files=0
for file in "${required_files[@]}"; do
  if [ ! -e "$file" ]; then
    echo "❌ Missing: $file"
    missing_files=$((missing_files + 1))
  fi
done

if [ $missing_files -gt 0 ]; then
  echo "❌ Installation failed: $missing_files required files are missing"
  exit 1
fi

echo ""
echo "✨ Installation successful!"
echo ""
echo "📖 Next steps:"
echo "  1. Open GitHub Copilot or Claude Code in your editor"
echo "  2. Reference the presentation skill in your requests:"
echo "     'Use the presentation skill to create a deck about...'"
echo ""
echo "📍 Skill installed at: $INSTALL_DIR"
echo "📚 Documentation: $INSTALL_DIR/SKILL.md"
echo "📂 Examples: $INSTALL_DIR/examples/"
echo ""
