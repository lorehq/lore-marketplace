# CloudNative Starter

Comprehensive development bundle providing structured agents, skills, and rules for professional software engineering workflows.

## Attribution

Adapted from [cloudnative-co/claude-code-starter-kit](https://github.com/cloudnative-co/claude-code-starter-kit) (MIT License).

## What's Included

- **8 rules** -- coding style, git workflow, testing, security, performance, patterns, agent orchestration, automation hooks
- **25 skills** -- 11 reference skills + 14 user-invocable workflow skills (converted from commands)
- **9 agents** -- architect, planner, tdd-guide, code-reviewer, security-reviewer, build-error-resolver, e2e-runner, refactor-cleaner, doc-updater
- **9 hook scripts** across 4 events -- pre-tool-use (safety net, doc blocker, push review, tmux guard), post-tool-use (console.log warning, auto-format, PR logging), pre-compact (auto-commit checkpoint), stop (debug logging reminder)

## Changes from Original

### Format
- Converted to Lore bundle format (manifest.json, RULES/, SKILLS/, AGENTS/)
- Added YAML frontmatter with `description` to all rules (required by Lore)
- Added YAML frontmatter with `name`, `description`, `user-invocable` to skills converted from commands

### Removed
- `model: opus` from all agents (platform-specific, not portable)
- Installer infrastructure (setup.sh, wizard, profiles, i18n, lib)
- Claude Code memory files and settings configs
- Model selection guidance from performance rule (platform-specific)
- Hooks dropped as non-portable: auto-update (infrastructure), memory-persistence (Lore has its own), statusline (Claude Code-specific), strategic-compact (/compact is Claude-specific)

### Hooks Converted
- 12 Claude Code hooks (hooks.json format with inline bash) converted to 9 Node.js ES module scripts (.mjs)
- Each behavior is a separate script file (one behavior per file)
- `safety-net` rewritten from cc-safety-net binary dependency to standalone JS logic
- `tmux-hooks` converted to `tmux-guard.mjs` — blocks dev servers, warns on long-running commands outside tmux

### Generalized
- Platform-specific path references (`~/.claude/agents/`, `~/.claude/commands/`) removed or made generic
- Slash command syntax (`/compact`, `/verify`) replaced with workflow descriptions
- References to Claude Code-specific features (settings.json hooks, TodoWrite) generalized

### Upgraded
- Commands converted to user-invocable skills with proper frontmatter and workflow descriptions
- Thin agent-wrapper commands (e2e, plan, tdd) expanded into proper skills with pre-conditions, inputs/outputs, and success criteria
- `project-guidelines-example` converted from filled-in example to a skill about HOW to write project guidelines
- `strategic-compact` rewritten as platform-agnostic `strategic-context` (manage context window proactively)

## License

MIT (same as original)
