# constellation-cursor

**Role**: Cursor plugin for Constellation code intelligence platform.

## Plugin Structure

```
.cursor-plugin/
├── plugin.json              Plugin manifest (name: constellation, v1.0.0)
└── marketplace.json         Registry listing (category: development)

mcp.json                     MCP server config → @constellationdev/mcp (stdio)

hooks/
├── hooks.json               Hook definitions (sessionStart + preToolUse prompt hook)
├── session-start.sh         Injects code_intel awareness at session start
└── prompts/
    └── session-start.txt    Prompt text for session start hook

rules/                       2 rules (.mdc files)
├── compact-preservation.mdc Preserve insights during compaction (alwaysApply)
└── code-intelligence.mdc    Response formatting with structural analysis (alwaysApply)

agents/                      3 autonomous agents
├── source-scout.md          Codebase exploration (readonly)
├── impact-investigator.md   Change risk assessment
└── dependency-detective.md  Dependency health (readonly)

skills/                      7 skills (6 command-replacements + 1 troubleshooting)
├── status/SKILL.md          /constellation:status — API connectivity check
├── diagnose/SKILL.md        /constellation:diagnose — Full health check
├── impact/SKILL.md          /constellation:impact — Symbol change impact analysis
├── deps/SKILL.md            /constellation:deps — File dependency analysis
├── unused/SKILL.md          /constellation:unused — Dead code finder
├── architecture/SKILL.md    /constellation:architecture — Codebase architecture overview
└── constellation-troubleshooting/
    ├── SKILL.md             Troubleshooting guide (keyword-triggered)
    └── references/
        └── error-codes.md   Complete error code reference
```

## Key Concepts

**Pure declarative plugin** — No package.json, no build step, no tests. All components are Markdown files with YAML frontmatter. Validation is manual (invoke skills in Cursor).

**Single MCP tool** — All API calls flow through `mcp_constellation_code_intel`. Skills and agents write JavaScript code blocks using an injected `api` object.

**Hooks + rules** — A `sessionStart` command hook injects code_intel awareness into every session. A `preToolUse` prompt hook (LLM-evaluated) intercepts Grep/Glob calls and nudges the agent toward code_intel for structural queries. Rules (.mdc files) provide additional persistent guidance: `compact-preservation` ensures insights survive compaction, and `code-intelligence` shapes response formatting.

**Skills as commands** — All 6 analysis skills use `disable-model-invocation: true` to preserve explicit-only invocation behavior via `/constellation:<name>` slash commands.

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

### Skills

YAML frontmatter fields: `name`, `description`, `disable-model-invocation` (optional)

```yaml
---
name: skill-name
description: What it does and when to trigger
disable-model-invocation: true
---
```

- `disable-model-invocation: true` — Explicit invocation only (for command replacements)
- Without it — Agent auto-triggers based on description keyword matching

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

### Adding a Skill

1. Create `skills/<name>/SKILL.md`
2. Add frontmatter: `name`, `description`
3. Add `disable-model-invocation: true` if it should only be explicitly invoked
4. Write the skill content including JavaScript code blocks using `api.*` methods
5. Add reference docs in `skills/<name>/references/` if needed

### Adding an Agent

1. Create `agents/<name>.md`
2. Add frontmatter: `name`, `description` with `<example>` trigger blocks, optional `readonly: true`
3. Include tool restriction in prompt body: "You have access to ONLY these tools: ..."
4. Write system prompt with responsibilities, API usage, output format
5. Include tiered error handling section (MCP unavailable → API error → query error)

### Testing

No automated tests. Validate manually:

```
/constellation:status
/constellation:diagnose
/constellation:impact <symbol> <file>
/constellation:deps <file> [--reverse]
/constellation:unused [kind]
/constellation:architecture
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
