#!/bin/bash
# SessionStart hook: Inject Constellation code_intel awareness into the session context.
# Reads prompt text from prompts/session-start.txt and returns it as additional_context.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROMPT_FILE="$SCRIPT_DIR/prompts/session-start.txt"

# Consume stdin (required by hooks protocol)
cat > /dev/null

if [ -f "$PROMPT_FILE" ]; then
  CONTEXT=$(cat "$PROMPT_FILE")
  jq -n --arg ctx "$CONTEXT" '{"additional_context": $ctx}'
else
  echo '{}'
fi
