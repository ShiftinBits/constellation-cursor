# constellation-cursor

**Role**: Cursor plugin for Constellation code intelligence platform.

## Plugin Structure

```
.cursor-plugin/
├── plugin.json              Plugin manifest (name: constellation, v1.0.0)
└── marketplace.json         Registry listing (category: development)

mcp.json                     MCP server config → @constellationdev/mcp (stdio)

hooks/
├── hooks.json               Hook definitions (sessionStart, beforeMCPExecution, preToolUse)
├── session-start.sh         Injects code_intel awareness at session start
├── allow-constellation-mcp.sh Runs before Constellation MCP execution (matcher: constellation)
└── prompts/
    └── session-start.txt    Prompt text for session start hook

commands/                    6 slash commands (/constellation-*)
├── status.md
├── diagnose.md
├── impact.md
├── deps.md
├── unused.md
└── architecture.md

rules/                       2 rules (.mdc files)
├── compact-preservation.mdc Preserve insights during compaction (alwaysApply)
└── code-intelligence.mdc    Response formatting with structural analysis (alwaysApply)

agents/                      3 autonomous agents
├── source-scout.md          Codebase exploration (readonly)
├── impact-investigator.md   Change risk assessment
└── dependency-detective.md  Dependency health (readonly)

skills/                      1 contextual skill (auto-triggered from description keywords)
└── constellation-troubleshooting/
    ├── SKILL.md             Troubleshooting guide (keyword-triggered)
    └── references/
        └── error-codes.md   Complete error code reference
```

## Key Concepts

**Pure declarative plugin** — No package.json, no build step, no tests. Components are Markdown (plus `hooks.json` / `mcp.json`). Validation is manual (run slash commands and skills in Cursor).

**Single MCP tool** — All API calls flow through `mcp_constellation_code_intel`. Slash command specs in `commands/`, the troubleshooting skill, and agents use JavaScript snippets with an injected `api` object.

**Hooks + rules** — `sessionStart` runs `session-start.sh` to inject code_intel awareness. `beforeMCPExecution` runs `allow-constellation-mcp.sh` for Constellation MCP calls. A `preToolUse` prompt hook (LLM-evaluated) matches Grep/Glob and may steer structural questions toward `code_intel`. Rules (.mdc files): `compact-preservation` preserves insights across compaction; `code-intelligence` shapes response formatting.

**Slash commands vs skills** — The `/constellation-*` workflows are **commands**: one markdown file per command under `commands/` with `name` and `description` frontmatter. **Skills** under `skills/*/SKILL.md` are for contextual, description-driven loading (here: troubleshooting only). Add `disable-model-invocation: true` on a skill when it should be explicit-only.

## Component Patterns

### Rules

YAML frontmatter fields: `description`, `alwaysApply`, `globs` (optional)

```yaml
---
description: What this rule does
alwaysApply: true
---
```

- `alwaysApply: true` — Always injected into context
- `alwaysApply: false` + `description` — Agent decides based on relevance
- `globs` — Apply only when matching files are in context

### Slash commands (`commands/`)

YAML frontmatter fields: `name`, `description`

- `name` — Use the slash id (e.g. `constellation-status`) so `/constellation-status` resolves.
- Body — Instructions and `mcp_constellation_code_intel` / `api.*` snippets, same patterns as agents.

### Skills (`skills/`)

YAML frontmatter fields: `name`, `description`, `disable-model-invocation` (optional)

```yaml
---
name: skill-name
description: What it does and when to trigger
disable-model-invocation: true
---
```

- `disable-model-invocation: true` — Explicit invocation only
- Without it — Agent may auto-trigger from description keyword matching

### Agents

YAML frontmatter fields: `name`, `description` (with `<example>` trigger blocks), `readonly` (optional)

```yaml
---
name: agent-name
description: Purpose + <example> blocks showing when to trigger
readonly: true
---
```

- Agent reads `<example>` blocks to decide when to auto-delegate
- `readonly: true` — Restricts agent to read-only operations
- Tool restrictions are prompt-based (included in agent body text)

## Development

### Adding a Rule

1. Create `rules/<name>.mdc`
2. Add frontmatter: `description`, `alwaysApply` (true/false)
3. Write the rule content in markdown

### Adding a slash command

1. Create `commands/<topic>.md`
2. Add frontmatter: `name` (`constellation-<topic>`), `description`
3. Document arguments and embed the `mcp_constellation_code_intel` / `api.*` code the model should run

### Adding a skill

1. Create `skills/<name>/SKILL.md`
2. Add frontmatter: `name`, `description`
3. Add `disable-model-invocation: true` if it should only be explicitly invoked
4. Write the skill body (and optional `api.*` examples) plus `skills/<name>/references/` if needed

### Adding an Agent

1. Create `agents/<name>.md`
2. Add frontmatter: `name`, `description` with `<example>` trigger blocks, optional `readonly: true`
3. Include tool restriction in prompt body: "You have access to ONLY these tools: ..."
4. Write system prompt with responsibilities, API usage, output format
5. Include tiered error handling section (MCP unavailable → API error → query error)

### Testing

No automated tests. Validate manually:

```
/constellation-status
/constellation-diagnose
/constellation-impact <symbol> <file>
/constellation-deps <file> [--reverse]
/constellation-unused [kind]
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

See `skills/constellation-troubleshooting/references/error-codes.md` for full reference.
