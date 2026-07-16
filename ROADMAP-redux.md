# Redux Implementation Roadmap

This roadmap describes a practical, incremental plan to add Redux (Redux Toolkit + React-Redux) to the Employee Management Portal.

## Goal
Move app data and UI state to a centralized Redux store using Redux Toolkit, enable predictable data flow, and prepare for async logic and tests.

## Quick setup
- Install packages:

```bash
npm install @reduxjs/toolkit react-redux
```

## Phases

1. Add dependencies (15–30m)
   - Install `@reduxjs/toolkit` and `react-redux` (see Quick setup).
   - Add `redux-devtools-extension` only if needed for older setups (RTK includes devtools support).

2. Create store and config (30–60m)
   - Add `src/store/index.js` (or `store.js`) that configures the store with `configureStore`.
   - Enable Redux DevTools and add `serializableCheck: false` only if necessary.

3. Define feature slices (1–3 hours)
   - Create slices under `src/store/slices/`:
      - `employeesSlice.js` — employees list, CRUD reducers, selectors.
      - `announcementsSlice.js` — announcements state.
      - `leaveSlice.js` — leave requests state.
      - `dashboardSlice.js` — dashboard stats, widgets, cached metrics.
      - `uiSlice.js` — modals, loading states, form errors.
   - Use `createSlice` + exported actions and selectors.

4. Migrate static data to initial state (30–60m)
   - Move data from `src/data/*.js` into slices as initialState or create thunks that load them.
   - Keep source files during transition; remove after verifying behavior.

5. Connect Provider in `src/main.jsx` (10–20m)
   - Wrap the app with `<Provider store={store}>` and verify the app boots.

6. Replace component state with selectors & dispatch (1–3 hours)
   - Update `EmployeeDirectoryView.jsx`, `EmployeeFormModal.jsx`, `AnnouncementsView.jsx`, `LeaveManagerView.jsx`, `DashboardView.jsx` to use `useSelector` and `useDispatch`.
   - Gradually replace local state: start with read-only lists, then forms, then CRUD flows.

7. Implement async thunks (1–2 hours)
   - Use `createAsyncThunk` for simulated API calls or for real endpoints.
   - Add pending/fulfilled/rejected handlers to slices.

8. Add selectors & memoization (30–60m)
   - Add reselect-like memoized selectors where needed (RTK Query optional for advanced caching).

9. Middleware, logging & devtools (15–30m)
   - Add middleware only if needed (logger, analytics). Keep store simple by default.

10. Tests & docs (2–4 hours)
   - Add unit tests for reducers and thunks.
   - Update README or `ROADMAP.md` with migration notes.

## Suggested PR size and checkpoints
- PR 1: Install packages + `src/store/index.js` + Provider wiring.
- PR 2: `employeesSlice` + connect `EmployeeDirectoryView` reads.
- PR 3: `EmployeeFormModal` CRUD + thunks.
- PR 4: Remaining slices + tests + docs.

## Tips
- Migrate incrementally: prefer many small PRs over one big change.
- Keep `src/data/*.js` as read-only fixtures until slices are stable.
- Use `createEntityAdapter` from RTK for normalized entity lists.

---

If you'd like, I can create the `src/store` scaffold and implement the first slice next.
