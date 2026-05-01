'use strict';

/**
 * beforeMCPExecution: auto-allow Constellation code_intel MCP calls (read-only graph queries).
 * Cross-platform replacement for allow-constellation-mcp.sh (no bash/jq).
 */

const readline = require('readline');

const ALLOW_MESSAGE =
	'Constellation tools are read-only code intelligence queries — auto-approved.';

async function readStdin() {
	let input = '';
	const rl = readline.createInterface({ input: process.stdin, terminal: false });
	for await (const line of rl) input += line;
	return input;
}

async function main() {
	const raw = await readStdin();
	let data;
	try {
		data = raw ? JSON.parse(raw) : {};
	} catch {
		process.stdout.write(JSON.stringify({ permission: 'ask' }));
		return;
	}

	const toolName = typeof data.tool_name === 'string' ? data.tool_name : '';
	if (/code_intel/i.test(toolName)) {
		process.stdout.write(
			JSON.stringify({
				permission: 'allow',
				agent_message: ALLOW_MESSAGE,
			})
		);
	} else {
		process.stdout.write(JSON.stringify({ permission: 'ask' }));
	}
}

main().catch(() => {
	process.stdout.write(JSON.stringify({ permission: 'ask' }));
});
