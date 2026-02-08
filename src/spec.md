# Specification

## Summary
**Goal:** Make the Welcome Goal Library modal’s goal template list scrollable for newly logged-in users so they can browse and select any goal.

**Planned changes:**
- Update `GoalLibraryModal` layout so only the goal list region scrolls (with a fixed/sticky header/tabs and footer action buttons).
- Ensure scrolling works via mouse wheel/trackpad (desktop) and vertical swipe (touch) inside the modal.
- Prevent background page scrolling while the modal is open, and ensure selecting goals does not unintentionally close the modal.

**User-visible outcome:** When the Welcome Goal Library modal opens, users can smoothly scroll through the full list of goal templates within the modal and select any goal, while the modal header and action buttons remain visible.
