# Specification

## Summary
**Goal:** Fix the Auto Planner “Save & Lock In” button so plans with custom durations can be saved and reliably locked in.

**Planned changes:**
- Add a backend canister method `createGoalWithCustomDuration(description, timeFrame, motivation, durationDays)` that persists the provided non-zero `durationDays`, returns the new goal id, and uses the same authorization checks as `createGoal`.
- Update the Auto Planner review save flow to call the correct backend method(s) and run the full sequence (create goal → add milestones/weekly tasks/daily tasks → lock in) without missing-method/actor errors.
- Improve save-state handling and user feedback: disable the button while saving, show a success toast and call `onSaveComplete()` on success, and show readable error toasts while resetting loading state on any failure.

**User-visible outcome:** Clicking “Save & Lock In” successfully creates and locks in the planned goal (including custom duration) and shows clear success/error feedback without getting stuck in a loading state.
