---
name: install-founderclaw
description: >
  Install founderclaw — 29 opinionated skills for OpenClaw ported from
  Ashish's founderclaw. Installs with one command, non-destructive, auto-builds
  browser binary.
  Triggered by: "install founderclaw", "setup founderclaw", "get founderclaw skills",
  "install founderclaw", "add founderclaw", "port founderclaw to openclaw",
  "I want founderclaw for openclaw".
---

# Install founderclaw

You are the installer. Run the full install process below. Don't ask questions — just do it.

## Install Process

### Step 1: Check if already installed

```bash
if [ -d ~/.agents/skills/founderclaw ]; then
    echo "ALREADY_INSTALLED"
    # Show current version
    cd ~/.agents/skills/founderclaw && git log --oneline -1
else
    echo "NOT_INSTALLED"
fi
```

If already installed:
> founderclaw is already installed. Want me to update it instead?
> - Yes — run the update flow
> - No — show what's currently installed

If not installed, proceed to Step 2.

### Step 2: Clone

```bash
git clone --single-branch --depth 1 https://github.com/ashish797/YC-World.git ~/.agents/skills/founderclaw
```

### Step 3: Install skills

```bash
SKILLS_DIR=~/.agents/skills
FOUNDERCLAW_DIR=~/.agents/skills/founderclaw

for skill_dir in "$FOUNDERCLAW_DIR"/*/; do
    skill_name=$(basename "$skill_dir")
    [ ! -f "$skill_dir/SKILL.md" ] && continue
    
    target="$SKILLS_DIR/$skill_name"
    if [ -e "$target" ] || [ -L "$target" ]; then
        echo "  ⚠ $skill_name (already exists, skipping)"
    else
        ln -sf "$skill_dir" "$target"
        echo "  ✓ $skill_name"
    fi
done
```

### Step 4: Build browse binary (if Bun available)

```bash
if command -v bun >/dev/null 2>&1; then
    cd "$FOUNDERCLAW_DIR/browse"
    bun install --silent 2>/dev/null
    bun build src/cli.ts --compile --outfile dist/browse 2>/dev/null
    [ -x dist/browse ] && echo "  ✓ browse binary built" || echo "  ⚠ browse build skipped"
fi
```

### Step 5: Report

Count installed skills and report:

```bash
TOTAL=$(find "$FOUNDERCLAW_DIR" -name SKILL.md | wc -l)
LINKED=$(ls -la "$SKILLS_DIR" | grep founderclaw | wc -l)
echo ""
echo "Installed $LINKED of $TOTAL founderclaw skills."
echo "Skills are active immediately."
```

## Update Flow

If the user says "update founderclaw" or the skill is already installed:

```bash
cd ~/.agents/skills/founderclaw
git stash 2>/dev/null
git fetch origin
git reset --hard origin/main
echo "Updated to $(git log --oneline -1)"
```

## Uninstall Flow

If the user says "uninstall founderclaw" or "remove founderclaw":

```bash
for link in ~/.agents/skills/*; do
    [ -L "$link" ] || continue
    target=$(readlink "$link")
    echo "$target" | grep -q "founderclaw" && rm "$link" && echo "  ✗ $(basename $link)"
done
rm -rf ~/.agents/skills/founderclaw
echo "founderclaw removed."
```
