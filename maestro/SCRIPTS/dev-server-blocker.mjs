// Dev Server Blocker — block dev servers from running in agent sessions.
// Converted from dev-server-blocker.sh. Hook: PreToolUse(Bash).
// Respects MAESTRO_ENABLE_ECC_QUALITY_GATES (default: enabled).

import { readFileSync } from "fs";

const gate = (process.env.MAESTRO_ENABLE_ECC_QUALITY_GATES || "").toLowerCase();
if (["0", "false", "no", "off", "disabled"].includes(gate)) {
  console.log(JSON.stringify({ decision: "allow" }));
  process.exit(0);
}

const input = JSON.parse(readFileSync("/dev/stdin", "utf8"));
const tool = input.tool_name || "";
if (tool !== "Bash") {
  console.log(JSON.stringify({ decision: "allow" }));
  process.exit(0);
}

const command = input.tool_input?.command || "";
if (!command) {
  console.log(JSON.stringify({ decision: "allow" }));
  process.exit(0);
}

const devServerPattern = /(?:^|\s)(?:(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?(?:dev|start|serve|watch)|next\s+dev|vite(?:\s|$)|webpack-dev-server|astro\s+dev)/i;

if (devServerPattern.test(command)) {
  console.log(JSON.stringify({
    decision: "deny",
    reason: `ECC quality gate: blocked dev server command. Run build/test/lint/typecheck only in this agent session. Start dev servers in a separate terminal, or disable via MAESTRO_ENABLE_ECC_QUALITY_GATES=0.`
  }));
  process.exit(0);
}

console.log(JSON.stringify({ decision: "allow" }));
