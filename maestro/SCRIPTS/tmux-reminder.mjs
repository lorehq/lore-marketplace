// Tmux Reminder — warn when long-running commands run outside tmux.
// Converted from tmux-reminder.sh. Hook: PostToolUse(Bash).
// Respects MAESTRO_ENABLE_ECC_QUALITY_GATES (default: enabled).

import { readFileSync } from "fs";

try {
  const gate = (process.env.MAESTRO_ENABLE_ECC_QUALITY_GATES || "").toLowerCase();
  if (["0", "false", "no", "off", "disabled"].includes(gate)) process.exit(0);

  if (process.env.TMUX) process.exit(0);

  const input = JSON.parse(readFileSync("/dev/stdin", "utf8"));
  const tool = input.tool_name || "";
  if (tool !== "Bash") process.exit(0);

  const command = input.tool_input?.command || "";
  if (!command) process.exit(0);

  if (/\b(test|build|lint|typecheck|watch|serve|dev|run-evals|long|benchmark)\b/i.test(command)) {
    console.log(JSON.stringify({
      additionalContext: "ECC reminder: this shell is not in tmux. For long-running commands, use tmux to avoid losing progress on disconnects."
    }));
  }
} catch {
  // Exit silently on errors
}
