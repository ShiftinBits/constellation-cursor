# constellation-cursor

**Role**: Cursor team marketplace + single plugin (`constellation`) for Constellation code intelligence.

## Repo Layout

```
.cursor-plugin/
├── marketplace.json         Team marketplace (name: constellation-plugins)
└── plugin.json              Top-level manifest mirror

plugins/constellation/       The actual plugin (source: ./plugins/constellation in marketplace.json)
├── .cursor-plugin/plugin.json   Plugin manifest (name: constellation)
├── mcp.json                 MCP server config → @constellationdev/mcp (stdio)
├── hooks/                   Hook scripts (Node.js, cross-platform)
├── commands/                6 slash commands (/constellation-*)
├── rules/                   2 alwaysApply rules (.mdc)
└── skills/                  1 contextual skill
```

All paths below are **relative to `plugins/constellation/`**.

## Plugin Structure

```
hooks/
├── hooks.json               Hook definitions (sessionStart, subagentStart, beforeMCPExecution, preToolUse)
├── inject.js                sessionStart / subagentStart context (gated on CONSTELLATION_ACCESS_KEY starting with ak:)
├── pre-tool-steer.js        preToolUse for Shell|Grep|Glob — Shell only when command matches grep/rg/glob/awk/findstr
└── allow-constellation-mcp.js  beforeMCPExecution auto-approve for Constellation MCP (matcher: constellation)

commands/                    6 slash commands (filename = slash id)
├── constellation-status.md
├── constellation-diagnose.md
├── constellation-impact.md
├── constellation-deps.md
├── constellation-unused.md
└── constellation-architecture.md

rules/                       2 rules (.mdc)
├── compact-preservation.mdc Preserve insights during compaction (alwaysApply)
└── code-intelligence.mdc    Response formatting with structural analysis (alwaysApply)

skills/                      1 contextual skill (auto-triggered from description keywords)
└── constellation-troubleshooting/
    ├── SKILL.md             Troubleshooting guide
    └── references/
        └── error-codes.md   Complete error code reference
```

## Key Concepts

**Pure declarative plugin** — No package.json/build/tests in the plugin itself. Components are Markdown plus `hooks.json` / `mcp.json`. Validation is handled by running slash commands in Cursor.

**Single MCP tool** — All API calls flow through `code_intel`. Slash commands and the skill use JavaScript snippets with an injected `api` object.

**Hooks** — All hooks are Node scripts. `inject.js` is dispatched twice via argv (`sessionStart`, `subagentStart`) using a hook-name → message table (mirrors `constellation-claude/hooks/inject.js`). `pre-tool-steer.js` matches `Shell|Grep|Glob`; for Shell it parses `tool_input.command` against `/\b(?:grep|rg|glob|awk|findstr)\b/i` (mirrors `constellation-claude/hooks/bash.js`). `allow-constellation-mcp.js` returns `{permission: "allow"}` for Constellation MCP and `{permission: "ask"}` otherwise. All hooks no-op unless `CONSTELLATION_ACCESS_KEY` starts with `ak:`. See [Cursor Hooks](https://cursor.com/docs/hooks).

**Rules vs commands vs skills** —
- **Rules** (`.mdc`): always-on guidance.
- **Commands** (`commands/*.md` with `name` + `description`): explicit `/constellation-<name>` workflows.
- **Skills** (`skills/*/SKILL.md`): description-keyword auto-loading. Add `disable-model-invocation: true` for explicit-only.

## Component Patterns

### Rules (`rules/*.mdc`)

```yaml
---
description: What this rule does
alwaysApply: true        # always injected
# alwaysApply: false + description → agent decides relevance
# globs: src/**/*.ts     → apply only when matching files in context
---
```

### Commands (`commands/*.md`)

```yaml
---
name: constellation-<topic>   # must match filename so /constellation-<topic> resolves
description: What it does
---
```

Body: instructions + `code_intel` / `api.*` snippets.

### Skills (`skills/<name>/SKILL.md`)

```yaml
---
name: skill-name
description: When to trigger (keywords matter for auto-loading)
# disable-model-invocation: true  → explicit invocation only
---
```

## Development

### Add a rule
1. Create `rules/<name>.mdc`
2. Frontmatter: `description`, `alwaysApply`, optional `globs`

### Add a slash command
1. Create `commands/constellation-<topic>.md`
2. Frontmatter: `name: constellation-<topic>`, `description`
3. Document arguments and embed `api.*` code

### Add a skill
1. Create `skills/<name>/SKILL.md` (+ optional `references/`)
2. Frontmatter: `name`, `description`, optional `disable-model-invocation: true`



In Cursor (manual smoke test):
```
/constellation-status
/constellation-diagnose
/constellation-impact <symbol> <file>
/constellation-deps <file> [--reverse]
/constellation-unused [--kind]
/constellation-architecture
```

## Environment

```bash
constellation auth                    # Configure CONSTELLATION_ACCESS_KEY
constellation index --full            # Index project
constellation index --full --force    # Force reindex
```

## Error Codes

| Code | Cause | Fix |
|------|-------|-----|
| `AUTH_ERROR` | Missing/invalid API key | `constellation auth` |
| `PROJECT_NOT_INDEXED` | Project needs indexing | `constellation index --full` |
| `SYMBOL_NOT_FOUND` | Typo or stale index | Broader search or re-index |
| `API_UNREACHABLE` | API not running | Check network / API URL in `constellation.json` |

See `plugins/constellation/skills/constellation-troubleshooting/references/error-codes.md` for the full reference.
