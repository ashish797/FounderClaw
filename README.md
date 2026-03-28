# founderclaw

Ashish's [founderclaw](https://github.com/ashish797/founderclaw) adapted for [OpenClaw](https://github.com/openclaw/openclaw).

29 opinionated skills that turn your AI agent into a virtual engineering team — CEO, Designer, Eng Manager, Release Manager, Doc Engineer, QA, and Security Officer.

A complete 1:1 port of [founderclaw](https://github.com/ashish797/founderclaw). Nothing skipped.

## What's different from original founderclaw

| Original founderclaw | founderclaw |
|---|---|
| Claude Code slash commands (`/qa`, `/ship`) | OpenClaw SKILL.md skills (triggered by description) |
| Compiled browse binary (headless Chromium) | OpenClaw's built-in browser tool |
| Codex CLI integration | OpenClaw sub-agent spawning |
| `~/.claude/skills/` | `~/.agents/skills/` |
| `AskUserQuestion` tool | Conversational prompting |
| Claude Code hooks (PreToolUse) | Instruction-based safety rules |
| Telemetry & update checks | None (clean) |

## Skills

### Strategy & Planning
| Skill | Description |
|---|---|
| office-hours | Structured brainstorming — Startup (6 forcing questions) or Builder mode. Saves a design doc. |
| plan-ceo-review | CEO/founder-mode plan review — scope expansion, strategy, ambition check |
| plan-eng-review | Eng manager architecture review — data flow, diagrams, edge cases, test coverage |
| plan-design-review | Designer's eye plan review — UI/UX gaps before implementation |
| autoplan | Auto-review pipeline — runs CEO, design, and eng reviews in sequence |

### Code Quality
| Skill | Description |
|---|---|
| review | Pre-landing PR review — SQL safety, race conditions, LLM trust boundaries, scope drift |
| investigate | Systematic debugging — root cause first, 3-strike hypothesis testing, regression tests |
| codex (second-opinion) | Independent sub-agent review — Review, Challenge (adversarial), or Consult mode |

### Design
| Skill | Description |
|---|---|
| design-consultation | Design system creation — typography, color, layout, spacing. Creates DESIGN.md. |
| design-review | Visual QA — spacing, hierarchy, consistency, accessibility checks |
| design-shotgun | Rapid visual exploration — generates 3 design variants for comparison |

### Shipping
| Skill | Description |
|---|---|
| ship | Ship workflow — detect base, merge, test, review diff, bump VERSION, CHANGELOG, PR |
| land-and-deploy | Land PR and deploy — merge, tag, deploy, verify |
| canary | Post-deploy canary monitoring — watch for errors after release |

### Quality Assurance
| Skill | Description |
|---|---|
| qa | Systematic QA testing + iterative bug fixing — before/after health scores |
| qa-only | QA report only (no fixing) — structured report with screenshots and repro steps |
| benchmark | Performance benchmarking — before/after comparisons, regression detection |

### Safety
| Skill | Description |
|---|---|
| careful | Destructive command guardrails — warns before rm -rf, force-push, DROP TABLE |
| freeze | Restrict edits to a directory — blocks changes outside scope |
| guard | Full safety — combines careful + freeze for maximum protection |
| unfreeze | Clear the freeze boundary — allows edits everywhere again |

### Documentation & Retrospectives
| Skill | Description |
|---|---|
| document-release | Generate release notes, changelogs, and documentation from commits |
| retro | Weekly engineering retrospective — commit analysis, work patterns, trends |

### Security
| Skill | Description |
|---|---|
| cso | Chief Security Officer — OWASP + STRIDE audit, vulnerability scanning |

## Install

### Method 1: Chat Command (easiest)

Just tell your OpenClaw agent:

> "install founderclaw"

That's it. The agent clones the repo, symlinks all skills, builds the browser binary. Non-destructive — never overwrites your existing skills.

Also works: "setup founderclaw", "get founderclaw skills", "add founderclaw for openclaw"

**Update:** "update founderclaw"
**Uninstall:** "uninstall founderclaw"

### Method 2: Terminal (technical)

```bash
curl -fsSL https://raw.githubusercontent.com/ashish797/YC-World/main/install.sh | bash
```

Or clone manually:
```bash
git clone --depth 1 https://github.com/ashish797/YC-World.git ~/.agents/skills/founderclaw
cd ~/.agents/skills/founderclaw && bash install.sh
```

**Non-destructive:** never overwrites existing skills. Skips any skill name that already exists in `~/.agents/skills/`.

### Method 3: ClawHub (coming soon)

```bash
clawhub install founderclaw
```

## Uninstall

Chat: "uninstall founderclaw"
Terminal: `bash ~/.agents/skills/founderclaw/uninstall.sh`

Both remove all symlinks and the repo. Your other skills stay untouched.

## Browser (browse)

The browse skill is a **headless Chromium browser** — fast, persistent session, structured snapshots, diff mode, responsive testing. Compiles to a single binary using Bun + Playwright.

**Auto-built on install** if Bun is available. Requires `CONTAINER=1` in Docker environments.

## Setup & Utilities

| Skill | Description |
|---|---|
| connect-chrome | Launch real Chrome with Side Panel — watch every action in real time |
| setup-browser-cookies | Import cookies from Chrome/Firefox/Edge for authenticated testing |
| setup-deploy | Configure deployment platform (Vercel, Fly, Render, Heroku, etc.) |
| founderclaw-upgrade | Self-update to latest version |

## License

MIT — same as [founderclaw](https://github.com/ashish797/founderclaw/blob/main/LICENSE).
