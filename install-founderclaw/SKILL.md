---
name: install-founderclaw
description: >
  Install FounderClaw — a complete multi-agent system for OpenClaw.
  Adds 6 agents (CEO + 5 departments), 29 skills, structured workspace,
  tool policies, and model configuration. This modifies openclaw.json and
  restarts the gateway. Requires user permission.
  Triggered by: "install founderclaw", "setup founderclaw", "get founderclaw",
  "add founderclaw", "install the engineering team".
---

# Install FounderClaw

You are installing a complete multi-agent system. This is NOT a skill install — it modifies the OpenClaw gateway config, adds agents, and restarts. Be calm, be clear, ask before doing anything.

## Rules
- Never rush. One step at a time.
- Explain before doing. Ask before modifying.
- Batch your messages. Don't send 24 rapid-fire updates.
- If something fails, say so clearly. Don't pretend it worked.

## Step 1: Explain what FounderClaw is

Tell the user:

> **FounderClaw** is a multi-agent engineering team for OpenClaw.
>
> It installs:
> - **29 skills** (code review, QA, design, security, debugging, shipping...)
> - **6 agents** — a CEO that orchestrates 5 departments:
>   - 🎯 **CEO** — talks to you, makes decisions, delegates work
>   - 📐 **Strategy** — product thinking, design, architecture
>   - 🚀 **Shipper** — code review, deployment, releases
>   - 🔍 **Tester** — QA, browser testing, bug detection
>   - 🛡️ **Safety** — security audits, guardrails
>   - 📊 **Observer** — debugging, retrospectives, second opinions
> - **Structured workspace** — shared projects + private department desks
> - **Tool policies** — each agent only gets the tools it needs
>
> **This will modify your OpenClaw config** (`openclaw.json`) and restart the gateway. Your existing agents are NOT removed — the 6 FounderClaw agents are added alongside them.
>
> Ready to proceed?

Wait for confirmation.

## Step 2: Ask for model configuration

Tell the user:

> FounderClaw uses 3 model tiers. Which models should I use?
>
> You have these available: (list from agents.defaults.models in config)
>
> Pick one for each:
> - **Fast** — quick tasks (Shipper, Safety) — e.g., haiku, gpt-4o-mini
> - **Best** — deep thinking (CEO, Strategy, Observer) — e.g., sonnet, gpt-4
> - **Vision** — image analysis (Tester, spawned sub-agents) — e.g., mimo-v2-omni
>
> Or say "use defaults" and I'll use your current primary model for all.

Wait for their choices. Record them.

## Step 3: Clone and install files

Tell the user:

> Installing FounderClaw files. This creates skills and workspace. Non-destructive.

Run:

```bash
# Clone
git clone --single-branch --depth 1 https://github.com/ashish797/FounderClaw.git ~/.agents/skills/founderclaw 2>&1

# Symlink skills
cd ~/.agents/skills/founderclaw
INSTALLED=0
for skill_dir in */; do
    [ ! -f "$skill_dir/SKILL.md" ] && continue
    skill_name=$(basename "$skill_dir")
    target=~/.agents/skills/"$skill_name"
    [ -e "$target" ] && continue
    ln -sf "$(pwd)/$skill_dir" "$target"
    INSTALLED=$((INSTALLED + 1))
done

# Create workspace
if [ ! -d ~/.openclaw/founderclaw ]; then
    cp -r ~/.agents/skills/founderclaw/workspace-template ~/.openclaw/founderclaw
    echo "WORKSPACE_CREATED"
else
    echo "WORKSPACE_EXISTS"
fi

# Build browse (optional)
if command -v bun >/dev/null 2>&1; then
    cd ~/.agents/skills/founderclaw/browse
    bun install --silent 2>/dev/null
    bun build src/cli.ts --compile --outfile dist/browse 2>/dev/null
    [ -x dist/browse ] && echo "BROWSE_BUILT" || echo "BROWSE_FAILED"
else
    echo "BROWSE_SKIPPED"
fi

echo "FILES_DONE:$INSTALLED"
```

Report:
> ✅ $INSTALLED skills installed
> ✅ Workspace created at ~/.openclaw/founderclaw/
> ✅/⚠ Browse binary status

## Step 4: Ask for multi-agent config permission

This is the critical step. NEVER skip it.

Tell the user:

> **Now the important part.** I need to add 6 agents to your OpenClaw config.
>
> This will:
> - Add 6 new agents to `agents.list` in your openclaw.json
> - Each agent gets its own workspace and skill filter
> - Your existing agents (main, mc.dev, etc.) are NOT affected
> - The gateway will restart
>
> **Agents I'll add:**
> | ID | Name | Workspace | Model |
> |---|---|---|---|
> | founderclaw-main | CEO | ~/.openclaw/founderclaw/ceo | {best-model} |
> | fc-strategy | Strategy | ~/.openclaw/founderclaw/strategy-dept | {best-model} |
> | fc-shipper | Shipper | ~/.openclaw/founderclaw/shipping-dept | {fast-model} |
> | fc-tester | Tester | ~/.openclaw/founderclaw/testing-dept | {vision-model} |
> | fc-safety | Safety | ~/.openclaw/founderclaw/security-dept | {fast-model} |
> | fc-observer | Observer | ~/.openclaw/founderclaw/history-dept | {best-model} |
>
> Proceed?

Wait for "yes".

## Step 5: Apply multi-agent config

Use `gateway config.patch` to add the agents. Build the JSON from the user's model choices.

```json
{
  "agents": {
    "list": [
      {
        "id": "founderclaw-main",
        "name": "FounderClaw CEO",
        "workspace": "~/.openclaw/founderclaw/ceo",
        "model": { "primary": "{best-model}" }
      },
      {
        "id": "fc-strategy",
        "name": "Strategy",
        "workspace": "~/.openclaw/founderclaw/strategy-dept",
        "model": { "primary": "{best-model}" },
        "skills": ["office-hours", "plan-ceo-review", "plan-eng-review", "plan-design-review", "design-consultation", "design-review", "design-shotgun", "autoplan"]
      },
      {
        "id": "fc-shipper",
        "name": "Shipper",
        "workspace": "~/.openclaw/founderclaw/shipping-dept",
        "model": { "primary": "{fast-model}" },
        "skills": ["review", "ship", "land-and-deploy", "canary", "benchmark", "document-release"]
      },
      {
        "id": "fc-tester",
        "name": "Tester",
        "workspace": "~/.openclaw/founderclaw/testing-dept",
        "model": { "primary": "{vision-model}" },
        "skills": ["qa", "qa-only", "browse", "setup-browser-cookies", "connect-chrome"]
      },
      {
        "id": "fc-safety",
        "name": "Safety",
        "workspace": "~/.openclaw/founderclaw/security-dept",
        "model": { "primary": "{fast-model}" },
        "skills": ["cso", "careful", "freeze", "guard", "unfreeze"]
      },
      {
        "id": "fc-observer",
        "name": "Observer",
        "workspace": "~/.openclaw/founderclaw/history-dept",
        "model": { "primary": "{best-model}" },
        "skills": ["investigate", "retro", "codex"]
      }
    ]
  }
}
```

Replace `{best-model}`, `{fast-model}`, `{vision-model}` with the user's choices.

Apply via `gateway config.patch`. The gateway will restart.

## Step 6: Confirm installation

After restart, tell the user:

> **FounderClaw installed!**
>
> ✅ 29 skills in `~/.agents/skills/`
> ✅ 6 agents configured (CEO + 5 departments)
> ✅ Workspace at `~/.openclaw/founderclaw/`
> ✅ Tool policies applied
> ✅ Models configured
>
> **Your existing agents are untouched.**
>
> **Quick start:**
> - Say "what skills do you have?" to see all 29
> - Say "I have an idea" to start office-hours
> - Say "review my code" for a code review
> - Say "test this site" for QA
> - Say "install founderclaw" to update in the future
>
> **Documentation:** https://founderclaw.hashqy.com

## Uninstall

When user says "uninstall founderclaw":

> This will:
> - Remove all FounderClaw skill symlinks
> - Delete `~/.agents/skills/founderclaw/`
> - Remove the 6 FounderClaw agents from your config
> - **Keep** `~/.openclaw/founderclaw/` workspace (your project data)
> - Gateway will restart
>
> Proceed?

If yes:

```bash
# Remove symlinks
for link in ~/.agents/skills/*; do
    [ -L "$link" ] || continue
    target=$(readlink "$link")
    echo "$target" | grep -q "founderclaw" && rm "$link"
done
rm -rf ~/.agents/skills/founderclaw
echo "Skills removed"
```

Then remove agents from config via `gateway config.patch` (remove the 6 FounderClaw entries from agents.list).

## Update

When user says "update founderclaw":

```bash
cd ~/.agents/skills/founderclaw
git stash 2>/dev/null
git fetch origin
git reset --hard origin/main
echo "Updated to $(git log --oneline -1)"
```

No config changes needed — just update the files.
