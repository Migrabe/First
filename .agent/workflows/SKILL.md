---
description: Verify the correctness of prompt generation logic in index.html
---

1. [x] **Verify MJ Prompt Time Accent**: Ensure `state.timeOfDay.accent` is pushed to `desc` in `buildMidjourneyPrompt`. (Verified line 3905 — FIX APPLIED: was missing before)
2. [x] **Verify Flat Prompt AR**: Ensure `state.aspectRatio` and `state.resolution` are pushed to `parts` in `buildFlatPrompt`. (Verified line 3695)
3. [x] **Verify Render Boost Skip**: Ensure render boost configs are appended in `updateAll`, not inside builders. (Verified lines 4226-4231)
4. [x] **Verify Structured Consistency**: Ensure `MAX_CONSISTENCY_PREFIX` is prepended in `updateAll`. (Verified line 4236)
5. [x] **Verify MJ Quality**: Ensure `--q 1` is added if `state.quality` is truthy in `buildMidjourneyPrompt`. (Verified line 3948)
6. [x] **Verify JSON MJ Prompt**: Ensure `prompt_midjourney` is generated if `format === "midjourney"` in `buildJson`. (Verified line 3989)
7. [x] **Verify Count Params**: Ensure engine params are counted conditionally in `countParams`. (Verified line 4112)
8. [x] **Verify Gen4 Base Prompt**: Ensure `base_prompt` is replaced with `userPrompt` in `updateAll`. (Verified line 2955)
9. [x] **Verify OnRemove Tags**: Ensure `addTag` has callbacks for engine tags in `updateActiveTags`. (Verified line 4084)