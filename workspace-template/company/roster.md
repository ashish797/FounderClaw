# Company Roster — FounderClaw

## Agents

| ID | Name | Emoji | Role | Model Tier | Workspace |
|---|---|---|---|---|---|
| yc-main | FounderClaw Main | 🎯 | CEO / Orchestrator | Best | ycworld/ceo/ |
| strategy | Strategy | 📐 | Product thinking, design | Best | ycworld/strategy-dept/ |
| shipper | Shipper | 🚀 | Code review, deploy | Fast | ycworld/shipping-dept/ |
| tester | Tester | 🔍 | QA, browser testing | Vision | ycworld/testing-dept/ |
| safety | Safety | 🛡️ | Security, guardrails | Fast | ycworld/security-dept/ |
| observer | Observer | 📊 | Debug, retro, second opinion | Best | ycworld/history-dept/ |

## Model Tiers

| Tier | Model | Use |
|---|---|---|
| Fast | (user configures) | Shipper, Safety — quick tasks |
| Best | (user configures) | CEO, Strategy, Observer — deep thinking |
| Vision | openrouter/xiaomi/mimo-v2-omni | Tester, spawned sub-agents |

## Skills per Department

| Department | founderclaw Skills | OpenClaw Built-in |
|---|---|---|
| CEO | all 29 + install-founderclaw | clawhub, skill-creator |
| Strategy | office-hours, plan-ceo-review, plan-eng-review, plan-design-review, design-consultation, design-review, design-shotgun, autoplan | — |
| Shipper | review, ship, land-and-deploy, canary, benchmark, document-release | github, gh-issues |
| Tester | qa, qa-only, browse, setup-browser-cookies, connect-chrome | video-frames |
| Safety | cso, careful, freeze, guard, unfreeze | healthcheck |
| Observer | investigate, retro, codex | summarize, session-logs |

## Tool Policy

See docs/ycworld-design.md for full tool policy matrix.
