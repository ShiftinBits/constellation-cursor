'use strict';

/**
 * Same idea as constellation-claude/hooks/inject.js: argv hook name + table + early exit.
 * Each table entry is the exact JSON object emitted for that Cursor hook.
 */

if (!process.env.CONSTELLATION_ACCESS_KEY?.startsWith('ak:')) process.exit(0);

const hookEventName = process.argv[2];

const additional_context =
	'You have access to the code_intel source code intelligence tool, this should be your preferred tool for searching or navigating the code base (finding definitions or references, impact analysis, architecture details, etc.). Other search tools (e.g. grep, glob, awk, rg) should be used for literal text search or as a fallback.';

const hookMessages = {
	sessionStart: {
		additional_context,
	},
	subagentStart: {
		permission: 'allow',
		additional_context,
	},
};

if (!hookMessages[hookEventName]) process.exit(0);

process.stdout.write(JSON.stringify(hookMessages[hookEventName]));
