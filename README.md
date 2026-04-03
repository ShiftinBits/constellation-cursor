# <img src="https://constellationdev.io/cursor.svg" height="30"> Constellation Plugin for Cursor

[![MCP Server](https://img.shields.io/badge/mcp-@constellationdev/mcp-black.svg?logo=modelcontextprotocol)](https://github.com/ShiftinBits/constellation-mcp) [![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-3DA639?logo=opensourceinitiative&logoColor=white)](LICENSE)

While Constellation's MCP server provides raw code intelligence capabilities, this plugin enhances your Cursor experience with:

| Feature | Benefit |
|---------|---------|
| **Slash Commands** | Quick access to common workflows |
| **Contextual Skills** | Cursor automatically loads relevant knowledge when needed |
| **Proactive Agents** | Cursor suggests analysis before you make risky changes |
| **Event Hooks** | Injects code intelligence awareness at session start |
| **Intelligent Rules** | Persistent guidance to prefer structural analysis over text search |

## Features

### Skills (Slash Commands)

Execute powerful analysis with simple slash commands:

| Command | Description |
|---------|-------------|
| `/constellation:status` | Check API connectivity and project indexing status |
| `/constellation:diagnose` | Quick health check for connectivity and authentication |
| `/constellation:impact <symbol> <file>` | Analyze blast radius before changing a symbol |
| `/constellation:deps <file> [--reverse]` | Map dependencies or find what depends on a file |
| `/constellation:unused` | Discover orphaned exports and dead code |
| `/constellation:architecture` | Get a high-level overview of your codebase structure |

### Contextual Skills

Cursor automatically activates specialized knowledge based on your questions:

| Skill | Triggers When You Ask About... |
|-------|-------------------------------|
| **constellation-troubleshooting** | Error codes, connectivity issues, debugging problems |

### Agents

Specialized AI agents for autonomous analysis:

| Agent | Purpose |
|-------|---------|
| **source-scout** | Explores and navigates codebase, discovers symbols and architectural patterns |
| **impact-investigator** | Proactively assesses risk before refactoring, renaming, or deleting code |
| **dependency-detective** | Detects circular dependencies and unhealthy coupling patterns |

**Example Trigger:**
```
You: "Rename AuthService to AuthenticationService"
Cursor: "Before renaming, let me analyze the potential impact..."
[Launches impact-investigator agent]
```

### Hooks

Event hooks fire at key lifecycle moments:

| Hook | Event | Type | Behavior |
|------|-------|------|----------|
| **session-start** | `sessionStart` | Command | Injects code_intel awareness into every new session |
| **prefer-code-intel** | `preToolUse` | Prompt | LLM-evaluates Grep/Glob calls and nudges toward code_intel for structural queries |

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
| Skills not appearing | Restart Cursor or check plugin path |

## Documentation

- [Constellation Documentation](https://docs.constellationdev.io) — Full platform documentation
- [MCP Server](https://github.com/shiftinbits/constellation-mcp) — Underlying MCP server
- [Cursor Plugins](https://cursor.com/docs/plugins) — Plugin development guide

## License

GNU Affero General Public License v3.0 (AGPL-3.0)

Copyright © 2026 ShiftinBits Inc.

See [LICENSE](LICENSE) file for details.
