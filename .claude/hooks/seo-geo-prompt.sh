#!/usr/bin/env bash
# UserPromptSubmit hook: if the user's prompt is about SEO/GEO work, inject a
# reminder so the agent loads the project `seo-geo` skill before acting.
set -euo pipefail

input="$(cat)"
prompt="$(printf '%s' "$input" | jq -r '.prompt // ""' 2>/dev/null || true)"

# Case-insensitive keyword match (English + Chinese). Keep this list specific to
# SEO/GEO so normal prompts don't trigger it.
pattern='seo|geo|tdk|seomap|seo-map|sitemap|robots\.txt|robots|canonical|hreflang|json-ld|json ld|structured data|schema\.org|schema markup|faqpage|\bpaa\b|people also ask|llms\.txt|citab|perplexity|ai overview|ai search|generative engine|meta (title|description)|关键词|内链|外链|收录|排名|结构化数据|元描述|站点地图|爬虫|新增页面|加.{0,4}页面|新.{0,2}工具页|博客页'

shopt -s nocasematch
if [[ "$prompt" =~ $pattern ]]; then
  msg='This task involves SEO/GEO. Before editing, invoke the project skill "seo-geo" (Skill tool, skill: seo-geo) and follow its SEO Contract + GEO rules. The single source of truth is seo/seo-map.ts, and pnpm seo:check gates the build.'
  jq -nc --arg ctx "$msg" \
    '{hookSpecificOutput:{hookEventName:"UserPromptSubmit",additionalContext:$ctx}}'
fi
exit 0
