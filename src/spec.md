# Specification

## Summary
**Goal:** Fix the “Welcome to LockedIn!” goal library popup close/cancel behavior, make the popup mobile-responsive, and ensure the header logo always navigates to the appropriate homepage.

**Planned changes:**
- Repair the popup’s cancel/close handling so it reliably dismisses the dialog without triggering goal creation or the “Add goals” flow.
- Ensure the popup can be dismissed via its close control and via common dialog dismiss actions (e.g., click outside / Escape where supported) without console errors.
- Update the popup layout to be mobile-responsive (small viewport-friendly sizing, no clipped content, appropriate scrolling, and accessible actions).
- Make the header’s top-left logo consistently clickable and route users to the correct home destination (Dashboard home when authenticated; public HomePage when unauthenticated).

**User-visible outcome:** Users can dismiss the welcome goal library popup reliably (including on mobile), and clicking the app logo always returns them to the correct homepage experience based on authentication state.
