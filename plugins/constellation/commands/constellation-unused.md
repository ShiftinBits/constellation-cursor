---
name: constellation-unused
description: Find orphaned/dead code that is exported but never imported
---

**IMPORTANT: Do NOT invoke any skills or other commands. Directly call the MCP tool specified below.**

Find exported code that is never imported or used anywhere in the codebase.

**Arguments:**
- `<kind-filter>`: Optional filter by symbol kind (function, class, type, interface, variable) - replace this placeholder with the desired kind or leave empty for no filter

**Construct the API call:**
- If `<kind-filter>` is empty or not provided: call with no filter
- If `<kind-filter>` contains a kind: pass it as an array element

Call the `code_intel` tool:

```javascript
// <kind-filter> = user's argument (may be empty)
const kindFilter = "<kind-filter>".trim();
const params = kindFilter ? { filterByKind: [kindFilter] } : {};
const result = await api.findOrphanedCode(params);
return result;
```

Replace `<kind-filter>` with one of: function, class, type, interface, variable, or leave empty for all kinds.

**If orphaned code is found**, present:
1. **Summary**: Total count of orphaned exports, broken down by kind (function, class, etc.)
2. **Files with Most Orphans**: Group results by file, sorted by count (show top 20)
3. **For Each File**: List the orphaned symbol names, kinds, and line numbers

**Recommendations to include:**
- Review each orphaned export to confirm it's truly unused
- Some may be entry points or dynamically imported
- Consider removing confirmed dead code to reduce maintenance burden
- Focus on files with multiple orphans first

**If no orphans found**, congratulate the user on a clean codebase.

**If error**, explain the error and provide guidance from the error response.
