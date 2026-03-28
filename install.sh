#!/bin/bash
# founderclaw installer — one command, non-destructive
# Usage: curl -fsSL https://raw.githubusercontent.com/ashish797/FounderClaw/main/install.sh | bash
# Or: bash install.sh

set -e

SKILLS_DIR="${HOME}/.agents/skills"
FOUNDERCLAW_DIR="${SKILLS_DIR}/founderclaw"
REPO_URL="https://github.com/ashish797/FounderClaw.git"

echo "=== founderclaw installer ==="
echo ""

# Check if already installed
if [ -d "$FOUNDERCLAW_DIR" ]; then
    echo "founderclaw already installed at $FOUNDERCLAW_DIR"
    echo "Updating..."
    cd "$FOUNDERCLAW_DIR" && git pull --quiet
    echo "Updated to latest."
else
    echo "Cloning to $FOUNDERCLAW_DIR..."
    git clone --single-branch --depth 1 "$REPO_URL" "$FOUNDERCLAW_DIR"
fi

# Create skills directory if it doesn't exist
mkdir -p "$SKILLS_DIR"

# Symlink each skill (skip if already exists — non-destructive)
echo ""
echo "Installing skills..."
INSTALLED=0
SKIPPED=0

for skill_dir in "$FOUNDERCLAW_DIR"/*/; do
    skill_name=$(basename "$skill_dir")
    
    # Skip non-skill directories
    [ ! -f "$skill_dir/SKILL.md" ] && continue
    
    target="$SKILLS_DIR/$skill_name"
    
    if [ -e "$target" ] || [ -L "$target" ]; then
        # Check if it's already our symlink
        if [ -L "$target" ] && [ "$(readlink "$target")" = "$skill_dir" ]; then
            echo "  ✓ $skill_name (already linked)"
        else
            echo "  ⚠ $skill_name (exists, skipping — not overwriting)"
            SKIPPED=$((SKIPPED + 1))
        fi
    else
        ln -sf "$skill_dir" "$target"
        echo "  ✓ $skill_name"
        INSTALLED=$((INSTALLED + 1))
    fi
done

# Add proactive rules to AGENTS.md if not already there
WORKSPACE="${HOME}/.openclaw/workspace"
AGENTS_MD="${WORKSPACE}/AGENTS.md"
FOUNDERCLAW_PROACTIVE="$FOUNDERCLAW_DIR/FOUNDERCLAW-PROACTIVE.md"

if [ -f "$AGENTS_MD" ] && ! grep -q "FOUNDERCLAW-PROACTIVE" "$AGENTS_MD" 2>/dev/null; then
    echo "" >> "$AGENTS_MD"
    echo "# FounderClaw Skills" >> "$AGENTS_MD"
    echo "" >> "$AGENTS_MD"
    echo "founderclaw is installed. Read \$FOUNDERCLAW_PROACTIVE for skill suggestions and proactive behavior rules." >> "$AGENTS_MD"
    echo "  ✓ Added proactive rules reference to AGENTS.md"
elif [ ! -f "$AGENTS_MD" ]; then
    echo "# AGENTS.md" > "$AGENTS_MD"
    echo "" >> "$AGENTS_MD"
    echo "founderclaw is installed. Read $FOUNDERCLAW_PROACTIVE for skill suggestions and proactive behavior rules." >> "$AGENTS_MD"
    echo "  ✓ Created AGENTS.md with proactive rules"
else
    echo "  ✓ AGENTS.md already has founderclaw reference"
fi

# Copy FounderClaw workspace template
WORKSPACE_DIR="${HOME}/.openclaw/founderclaw"
if [ ! -d "$WORKSPACE_DIR" ]; then
    echo ""
    echo "Creating FounderClaw workspace..."
    cp -r "$FOUNDERCLAW_DIR/workspace-template" "$WORKSPACE_DIR"
    echo "  ✓ FounderClaw workspace created at $WORKSPACE_DIR"
    echo "  ✓ CEO + 5 departments + company config"
else
    echo "  ✓ FounderClaw workspace already exists"
fi

# Build browse binary if bun is available
BROWSE_BIN="$FOUNDERCLAW_DIR/browse/dist/browse"
if [ ! -x "$BROWSE_BIN" ] && command -v bun >/dev/null 2>&1; then
    echo ""
    echo "Building browse binary (headless browser)..."
    cd "$FOUNDERCLAW_DIR/browse"
    bun install --silent 2>/dev/null
    bun build src/cli.ts --compile --outfile dist/browse 2>/dev/null
    if [ -x "$BROWSE_BIN" ]; then
        echo "  ✓ browse binary built successfully"
    else
        echo "  ⚠ browse binary build failed — run manually: cd $FOUNDERCLAW_DIR/browse && bun install && bun build src/cli.ts --compile --outfile dist/browse"
    fi
    cd - > /dev/null
elif [ -x "$BROWSE_BIN" ]; then
    echo "  ✓ browse binary already built"
fi

echo ""
echo "=== Done ==="
echo "  Installed: $INSTALLED new skills"
echo "  Skipped:   $SKIPPED (already existed)"
echo "  Total:     $(ls -d "$SKILLS_DIR"/*/ 2>/dev/null | wc -l) skills in $SKILLS_DIR"
echo ""
echo "Skills are active immediately — no restart needed."
echo "To uninstall: rm -rf $FOUNDERCLAW_DIR && find $SKILLS_DIR -type l -lname '$FOUNDERCLAW_DIR/*' -delete"
