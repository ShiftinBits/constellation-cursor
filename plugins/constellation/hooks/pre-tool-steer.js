'use strict';

/**
 * preToolUse: steer toward code_intel before Shell (grep-like commands), Grep, or Glob.
 * Maps constellation-claude/hooks/inject.js (PreToolUse + Grep|Glob) and bash.js (PreToolUse + Bash).
 * Cursor input: tool_name + tool_input (e.g. tool_input.command for Shell).
 * Output: permission + agent_message (preToolUse schema — not additional_context).
 * Every exit path writes valid JSON so Cursor never sees empty hook stdout.
 */

const ALLOW_ONLY = JSON.stringify({ permission: 'allow' });

function allowOnly() {
	process.stdout.write(ALLOW_ONLY);
}

if (!process.env.CONSTELLATION_ACCESS_KEY?.startsWith('ak:')) {
	allowOnly();
	process.exit(0);
}

const readline = require('readline');

const TRIGGER_REGEX = /\b(?:grep|rg|glob|awk|findstr)\b/i;

const REMINDER =
	'Use the code_intel tool before other tools for searching or navigating the codebase. Other search tools (e.g. grep, glob, awk, rg) should be used for literal text search or as a fallback.';

async function readStdin() {
	let input = '';
	const rl = readline.createInterface({ input: process.stdin, terminal: false });
	for await (const line of rl) input += line;
	return input;
}

function shouldRemind(data) {
	const name = data.tool_name || '';
	if (name === 'Grep' || name === 'Glob') return true;
	if (name === 'Shell') {
		const command = (data.tool_input && data.tool_input.command) || '';
		return Boolean(command && TRIGGER_REGEX.test(command));
	}
	return false;
}

async function main() {
	const raw = await readStdin();
	let data;
	try {
		data = JSON.parse(raw);
	} catch {
		allowOnly();
		return;
	}

	if (!shouldRemind(data)) {
		allowOnly();
		return;
	}

	process.stdout.write(
		JSON.stringify({
			permission: 'allow',
			agent_message: REMINDER,
		})
	);
}

main();
