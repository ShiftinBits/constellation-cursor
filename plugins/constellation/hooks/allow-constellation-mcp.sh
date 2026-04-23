#!/bin/bash
# beforeMCPExecution hook: Auto-allow all Constellation MCP tools.
# Constellation tools are read-only (code intelligence queries against a graph DB).
# This prevents Cursor from prompting for approval on every code_intel call.

INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // ""')

if echo "$TOOL_NAME" | grep -qi 'constellation'; then
  jq -n '{
    "permission": "allow",
    "agent_message": "Constellation tools are read-only code intelligence queries — auto-approved."
  }'
else
  # Pass through — let Cursor handle approval for non-constellation tools
  echo '{"permission": "ask"}'
fi
