# Specification

## Summary
**Goal:** Update the Locked-in Goals card layout so the “Check in” button is smaller and aligned on the same row opposite the stats text.

**Planned changes:**
- Adjust the Locked-in Goals goal card layout to place a smaller “Check in” button right-aligned on the same horizontal row as the stats text, with the 7-day ticker remaining above.
- Refactor the CheckInTicker rendering so the stats block can be positioned alongside the button without duplicating stats logic, keeping existing values/formatting and loading behavior intact.
- Ensure the stats/button row remains responsive on narrow widths (no overlap; readable wrapping if needed) while preserving the existing “Check in” click behavior.

**User-visible outcome:** On each Locked-in Goals card, the 7-day ticker stays on top, and the stats appear on the left with a smaller “Check in” button on the right in the same row, remaining readable on small screens.
