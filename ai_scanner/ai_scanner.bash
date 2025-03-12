#!/bin/bash

# In GitLab CI:
# - Get diff of current commit: git diff-tree -p $CI_COMMIT_SHA
# - Get changed files: git diff-tree --no-commit-id --name-only -r $CI_COMMIT_SHA
# DIFF_CONTENT=$(git diff-tree -p $CI_COMMIT_SHA)
# CODE_CONTENT=$(git diff-tree --no-commit-id --name-only -r $CI_COMMIT_SHA | xargs files-to-prompt)

DIFF_CONTENT=$(cat git.diff)
CODE_CONTENT=$(files-to-prompt simple_app/todo-app.ts simple_app/todo-types.ts simple_app/index.html)


# sed must be escaped, therefore replace placeholders using awk.
# use gawk with mac, awk with linux
awk -v diff="$DIFF_CONTENT" -v code="$CODE_CONTENT" '{
  gsub(/\{\{diff-of-code\}\}/, diff)
  gsub(/\{\{code-files\}\}/, code)
  print
}' ai-coding-meta-review.xml | \
llm -o temperature 0 -m openrouter/qwen/qwen-2.5-coder-32b-instruct:free
