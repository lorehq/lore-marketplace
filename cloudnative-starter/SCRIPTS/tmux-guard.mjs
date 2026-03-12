// Tmux Guard — block dev server starts and warn on long-running commands outside tmux.
// Translated from cloudnative-co/claude-code-starter-kit features/tmux-hooks.
// Original: two PreToolUse(Bash) matchers — hard deny for dev servers, soft warn for long tasks.

import { readFileSync } from "fs";

const input = JSON.parse(readFileSync("/dev/stdin", "utf8"));
const tool = input.tool_name || "";
if (tool !== "Bash") {
  console.log(JSON.stringify({ decision: "allow" }));
  process.exit(0);
}

const cmd = (input.tool_input || {}).command || "";

// --- Block dev server starts — must run in tmux for log access ---
const devServerPattern = /\b(npm run dev|pnpm(\s+run)?\s+dev|yarn dev|bun run dev)\b/;
if (devServerPattern.test(cmd)) {
  const match = cmd.match(devServerPattern)[0];
  console.log(JSON.stringify({
    decision: "deny",
    reason: [
      `Dev server must run in tmux for log access.`,
      `Use: tmux new-session -d -s dev "${match}"`,
      `Then: tmux attach -t dev`,
    ].join("\n"),
  }));
  process.exit(0);
}

// --- Warn on long-running commands outside tmux ---
if (!process.env.TMUX) {
  const longRunningPattern = /\b(npm\s+(install|test)|pnpm\s+(install|test)|yarn\s+(install|test)|bun\s+(install|test)|cargo\s+build|make|docker|pytest|vitest|playwright)\b/;
  if (longRunningPattern.test(cmd)) {
    process.stderr.write("[Hook] Consider running long-running commands in tmux for session persistence\n");
  }
}

console.log(JSON.stringify({ decision: "allow" }));
