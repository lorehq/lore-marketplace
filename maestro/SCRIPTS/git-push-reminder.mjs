// Git Push Reminder — remind about unpushed commits when session ends.
// Converted from git-push-reminder.sh. Hook: Stop.
// Respects MAESTRO_ENABLE_ECC_QUALITY_GATES (default: enabled).

import { readFileSync } from "fs";
import { execSync } from "child_process";

try {
  const gate = (process.env.MAESTRO_ENABLE_ECC_QUALITY_GATES || "").toLowerCase();
  if (["0", "false", "no", "off", "disabled"].includes(gate)) process.exit(0);

  const input = JSON.parse(readFileSync("/dev/stdin", "utf8"));
  const cwd = process.env.CLAUDE_PROJECT_DIR || input.cwd || ".";
  const opts = { encoding: "utf8", cwd };

  execSync("git rev-parse --is-inside-work-tree", opts);
  execSync("git rev-parse --abbrev-ref --symbolic-full-name @{upstream}", opts);

  const ahead = execSync("git rev-list --count @{upstream}..HEAD", opts).trim();
  const count = parseInt(ahead, 10);

  if (count > 0) {
    console.log(JSON.stringify({
      additionalContext: `ECC reminder: branch is ahead of upstream by ${count} commit(s). Run git push when your verification is complete.`
    }));
  }
} catch {
  // Exit silently — not a git repo, no upstream, or command failed
}
