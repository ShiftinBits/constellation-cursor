# <img src="https://constellationdev.io/cursor.svg" height="30"> Constellation Plugin for Cursor

[![MCP Server](https://img.shields.io/badge/mcp-@constellationdev/mcp-black.svg?logo=modelcontextprotocol)](https://github.com/ShiftinBits/constellation-mcp) [![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-3DA639?logo=opensourceinitiative&logoColor=white)](LICENSE)

While Constellation's MCP server provides raw code intelligence capabilities, this plugin enhances your Cursor experience with:

| Feature | Benefit |
|---------|---------|
| **Slash Commands** | Quick access to common workflows |
| **Contextual Skills** | Cursor automatically loads relevant knowledge when needed |
| **Event Hooks** | Injects code intelligence awareness at session/subagent start and steers search tools toward `code_intel` |
| **Intelligent Rules** | Persistent guidance to prefer structural analysis over text search |

## Features

### Slash commands

These workflows are defined as markdown in [`commands/`](plugins/constellation/commands/) (each file has `name` + `description` frontmatter). Invoke them with `/constellation-<name>`:

| Command | Description |
|---------|-------------|
| `/constellation-status` | Check API connectivity and authentication (`api.ping`) |
| `/constellation-diagnose` | Quick health check including project metrics (`api.getArchitectureOverview`) |
| `/constellation-impact <symbol> <file>` | Analyze blast radius before changing a symbol |
| `/constellation-deps <file> [--reverse]` | Map dependencies or find what depends on a file |
| `/constellation-unused` | Discover orphaned exports and dead code |
| `/constellation-architecture` | Get a high-level overview of your codebase structure |

### Contextual skills

These live under [`skills/`](plugins/constellation/skills/) as `SKILL.md` files. Cursor can load them automatically when your question matches the skill description (for example troubleshooting and error codes):

| Skill | Triggers when you ask about… |
|-------|------------------------------|
| **constellation-troubleshooting** | Error codes, connectivity, MCP issues, indexing, failed commands |

### Hooks

Configured in [`hooks/hooks.json`](plugins/constellation/hooks/hooks.json). Cursor matches on the **event** name; there are no separate hook “ids” in the manifest beyond what each entry does:

| Event | Type | Implementation | Behavior |
|-------|------|----------------|----------|
| `sessionStart` | Command | `node ./hooks/inject.js sessionStart` | Injects code_intel awareness at the start of a session (when `CONSTELLATION_ACCESS_KEY` is set) |
| `subagentStart` | Command | `node ./hooks/inject.js subagentStart` (matcher: `.*`) | Same guidance as session start, for Task subagents (when `CONSTELLATION_ACCESS_KEY` is set) |
| `beforeMCPExecution` | Command | `node ./hooks/allow-constellation-mcp.js` (matcher: `constellation`) | Auto-allows `code_intel` MCP calls; defers approval for other tools |
| `preToolUse` | Command | `node ./hooks/pre-tool-steer.js` (matcher: `Shell`, `Grep`, `Glob`) | Before those tools, nudges toward `code_intel` (Shell only when the command looks like grep/rg/etc.) |

### Rules

Persistent guidance that enhances every interaction:

| Rule | Behavior |
|------|----------|
| **compact-preservation** | Preserves Constellation insights during context compaction |
| **code-intelligence** | Enhances responses with dependency awareness and impact-conscious suggestions |

## Installation

### Prerequisites

1. **Constellation Account** (see [Constellation](https://app.constellationdev.io))
2. **Project indexed** in Constellation
3. **Access key** configured

### Quick Start

In Cursor:
```bash
/add-plugin Constellation
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `AUTH_ERROR` | Check `CONSTELLATION_ACCESS_KEY` is set correctly, use `constellation auth` CLI command to set |
| `PROJECT_NOT_INDEXED` | Run `constellation index --full` in your project |
| Commands or skills not appearing | Restart Cursor or verify the plugin is installed and paths resolve |

## Documentation

- [Constellation Documentation](https://docs.constellationdev.io) — Full platform documentation
- [MCP Server](https://github.com/shiftinbits/constellation-mcp) — Underlying MCP server
- [Cursor Plugins](https://cursor.com/docs/plugins) — Plugin development guide

## License

GNU Affero General Public License v3.0 (AGPL-3.0)

Copyright © 2026 ShiftinBits Inc.

See [LICENSE](LICENSE) file for details.
