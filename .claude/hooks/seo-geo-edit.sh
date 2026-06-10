#!/usr/bin/env bash
# PreToolUse hook (Edit|Write|MultiEdit): when the target file is part of the SEO
# system, inject a reminder so the agent follows the project `seo-geo` skill.
set -euo pipefail

input="$(cat)"
file="$(printf '%s' "$input" | jq -r '.tool_input.file_path // ""' 2>/dev/null || true)"

# Match SEO-relevant files regardless of absolute vs relative path.
if [[ "$file" =~ (^|/)seo/ \
   || "$file" =~ (^|/)messages/.*\.json$ \
   || "$file" =~ (^|/)app/robots\.ts$ \
   || "$file" =~ (^|/)app/sitemap\.ts$ ]]; then
  msg="You are editing an SEO/GEO file. Follow the project skill \"seo-geo\" (invoke it via the Skill tool if not already loaded): respect the SeoPageContract rules, keep title/description/h1 globally unique, wire FAQ/PAA across all required files, and run \`pnpm seo:check\` after the change."
  jq -nc --arg ctx "$msg" \
    '{hookSpecificOutput:{hookEventName:"PreToolUse",additionalContext:$ctx}}'
fi
exit 0
