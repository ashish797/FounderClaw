---
name: install-founderclaw
description: >
  Install FounderClaw — 29 skills, multi-agent engineering team for OpenClaw.
  Non-destructive install. Requires permission for multi-agent config.
  Triggered by: "install founderclaw", "setup founderclaw", "get founderclaw",
  "add founderclaw", "install the engineering team".
---

# Install FounderClaw

You are the installer. Guide the user through a clean, professional install.

## Pre-flight

Check if already installed:

```bash
if [ -d ~/.agents/skills/founderclaw ]; then
    echo "ALREADY_INSTALLED"
    ls ~/.agents/skills/founderclaw/*/SKILL.md 2>/dev/null | wc -l
else
    echo "NOT_INSTALLED"
fi
```

If already installed:
> FounderClaw is already installed with X skills. Want me to update it?
> - Yes → run update flow
> - No → show what's installed

If not installed, proceed.

## Step 1: Explain what will happen

Tell the user:

> **FounderClaw** — a multi-agent engineering team for OpenClaw.
> 
> Here's what I'll do:
> 1. Clone FounderClaw to `~/.agents/skills/founderclaw/`
> 2. Symlink 29 skills to `~/.agents/skills/`
> 3. Create workspace at `~/.openclaw/founderclaw/` (CEO + 5 departments)
> 4. Build the headless browser (if Bun is available)
> 
> **What this modifies:**
> - Adds skills to `~/.agents/skills/` (won't overwrite existing ones)
> - Creates workspace directory (won't overwrite if exists)
> - Modifies `AGENTS.md` to add proactive skill suggestions
> 
> **What this does NOT modify:**
> - Your existing OpenClaw config (openclaw.json)
> - Your existing agents or channels
> - Your existing workspace files
> 
> Proceed?

Wait for user confirmation.

## Step 2: Install skills

```bash
git clone --single-branch --depth 1 https://github.com/ashish797/FounderClaw.git ~/.agents/skills/founderclaw
cd ~/.agents/skills/founderclaw

INSTALLED=0
SKIPPED=0
for skill_dir in */; do
    [ ! -f "$skill_dir/SKILL.md" ] && continue
    skill_name=$(basename "$skill_dir")
    target=~/.agents/skills/"$skill_name"
    if [ -e "$target" ] || [ -L "$target" ]; then
        SKIPPED=$((SKIPPED + 1))
    else
        ln -sf "$(pwd)/$skill_dir" "$target"
        INSTALLED=$((INSTALLED + 1))
    fi
done
echo "Installed: $INSTALLED skills, Skipped: $SKIPPED (already existed)"
```

## Step 3: Create workspace

```bash
if [ ! -d ~/.openclaw/founderclaw ]; then
    cp -r ~/.agents/skills/founderclaw/workspace-template ~/.openclaw/founderclaw
    echo "Workspace created at ~/.openclaw/founderclaw/"
    echo "  CEO + 5 departments + company config"
else
    echo "Workspace already exists at ~/.openclaw/founderclaw/"
fi
```

## Step 4: Build browse (optional)

```bash
if command -v bun >/dev/null 2>&1; then
    cd ~/.agents/skills/founderclaw/browse
    bun install --silent 2>/dev/null
    bun build src/cli.ts --compile --outfile dist/browse 2>/dev/null
    [ -x dist/browse ] && echo "✓ Browse binary built" || echo "⚠ Browse build failed"
fi
```

## Step 5: Update AGENTS.md

```bash
WORKSPACE="${HOME}/.openclaw/workspace"
if [ -f "$WORKSPACE/AGENTS.md" ]; then
    if ! grep -q "FOUNDERCLAW" "$WORKSPACE/AGENTS.md" 2>/dev/null; then
        echo "" >> "$WORKSPACE/AGENTS.md"
        echo "# FounderClaw Skills" >> "$WORKSPACE/AGENTS.md"
        echo "FounderClaw installed. 29 skills available. Say 'what skills do you have?' to list them." >> "$WORKSPACE/AGENTS.md"
    fi
fi
```

## Step 6: Multi-agent config (REQUIRES PERMISSION)

This step modifies `openclaw.json` and restarts the gateway. NEVER do this without explicit permission.

Tell the user:

> **Optional: Multi-agent setup**
> 
> FounderClaw works best with 6 agents:
> - **FounderClaw Main** (CEO) — orchestrates everything
> - **Strategy** — product thinking, design
> - **Shipper** — code review, deployment
> - **Tester** — QA, browser testing
> - **Safety** — security, guardrails
> - **Observer** — debugging, retrospectives
> 
> This will:
> - Add 6 agents to your `openclaw.json`
> - Each agent has its own workspace under `~/.openclaw/founderclaw/`
> - Your existing agents are NOT affected
> - The gateway will restart
> 
> Want me to set this up?
> - **Yes** → I'll add the agents and restart
> - **No** → Skills still work individually (just no multi-agent orchestration)
> - **Later** → You can run this again anytime

If user says Yes, apply the config:

```json5
// This gets added to agents.list via config.patch
{
  id: "founderclaw-main",
  name: "FounderClaw Main",
  workspace: "~/.openclaw/founderclaw/ceo",
  skills: ["office-hours", "plan-ceo-review", "plan-eng-review", "plan-design-review",
           "design-consultation", "design-review", "design-shotgun", "autoplan",
           "review", "ship", "land-and-deploy", "canary", "benchmark",
           "document-release", "qa", "qa-only", "browse", "setup-browser-cookies",
           "connect-chrome", "cso", "careful", "freeze", "guard", "unfreeze",
           "investigate", "retro", "codex", "gstack-upgrade", "setup-deploy",
           "install-founderclaw"]
},
{
  id: "fc-strategy",
  name: "Strategy",
  workspace: "~/.openclaw/founderclaw/strategy-dept",
  skills: ["office-hours", "plan-ceo-review", "plan-eng-review", "plan-design-review",
           "design-consultation", "design-review", "design-shotgun", "autoplan"]
},
{
  id: "fc-shipper",
  name: "Shipper",
  workspace: "~/.openclaw/founderclaw/shipping-dept",
  skills: ["review", "ship", "land-and-deploy", "canary", "benchmark", "document-release"]
},
{
  id: "fc-tester",
  name: "Tester",
  workspace: "~/.openclaw/founderclaw/testing-dept",
  skills: ["qa", "qa-only", "browse", "setup-browser-cookies", "connect-chrome"]
},
{
  id: "fc-safety",
  name: "Safety",
  workspace: "~/.openclaw/founderclaw/security-dept",
  skills: ["cso", "careful", "freeze", "guard", "unfreeze"]
},
{
  id: "fc-observer",
  name: "Observer",
  workspace: "~/.openclaw/founderclaw/history-dept",
  skills: ["investigate", "retro", "codex"]
}
```

## Step 7: Report

Summarize what was installed:

> **FounderClaw installed!**
> 
> ✅ 29 skills in `~/.agents/skills/`
> ✅ Workspace at `~/.openclaw/founderclaw/`
> ✅ Multi-agent config: [Yes/No]
> ✅ Browse binary: [Built/Not built]
> 
> **Quick start:**
> - Say "what skills do you have?" to see all 29
> - Say "I have an idea" to start office-hours
> - Say "review my code" for a code review
> - Say "test this site" for QA
> 
> **Documentation:** https://github.com/ashish797/FounderClaw

## Update Flow

If user says "update founderclaw":

```bash
cd ~/.agents/skills/founderclaw
git stash 2>/dev/null
git fetch origin
git reset --hard origin/main
echo "Updated to $(git log --oneline -1)"
```

## Uninstall Flow

If user says "uninstall founderclaw":

> This will:
> - Remove all FounderClaw skill symlinks
> - Delete `~/.agents/skills/founderclaw/`
> - Keep `~/.openclaw/founderclaw/` workspace (your project data)
> - NOT touch your openclaw.json config
> 
> Proceed?

If yes:

```bash
for link in ~/.agents/skills/*; do
    [ -L "$link" ] || continue
    target=$(readlink "$link")
    echo "$target" | grep -q "founderclaw" && rm "$link"
done
rm -rf ~/.agents/skills/founderclaw
echo "FounderClaw removed. Workspace preserved at ~/.openclaw/founderclaw/"
```
