---
name: constellation:impact
description: Analyze the impact of changing a symbol or file
---

**IMPORTANT: Do NOT invoke any skills or other commands. Directly call the MCP tool specified below.**

Analyze the impact of changing the specified symbol.

**Arguments:**
- `<symbol-name>`: Symbol name (required)
- `<file-path>`: File path (optional, helps disambiguate)

Replace `<symbol-name>` and `<file-path>` with the user's provided values.

If no symbol name is provided, ask the user what symbol they want to analyze.

Call `mcp_constellation_code_intel` with this code parameter:

```javascript
const result = await api.impactAnalysis({
  symbolName: "<symbol-name>",
  filePath: "<file-path>" || undefined,
  depth: 3
});
return result;
```

**If successful**, present:
1. **Symbol**: Name, kind (function/class/etc), and location
2. **Risk Assessment**: Risk level (low/medium/high/critical) and score
3. **Impact Scope**: Number of files and symbols affected, whether it's a public API
4. **Direct Dependents**: Top 10 files that directly depend on this symbol
5. **Test Coverage**: Percentage from result.data.breakdown.testCoverage
6. **Recommendations**: From result.data.recommendations

**If high or critical risk**, emphasize caution and suggest reviewing dependents before making changes.

**If error**, explain the error and provide guidance from the error response.
