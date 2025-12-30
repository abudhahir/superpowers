# Phase 3: VS Code Extension Implementation Plan

> **Goal:** Create the "Pilot" VS Code extension that visualizes the SupremePower state and drives the workflow.

**Context:**
- Core Engine (StateManager, etc.) is implemented in `lib/`.
- Design: `docs/plans/2025-12-30-phase3-design.md`.

**Tech Stack:** TypeScript, VS Code Extension API.

---

### Task 1: Scaffold VS Code Extension

**Goal:** Initialize the extension project structure within the repository.

**Steps:**
1.  Create `vscode-extension/` directory.
2.  Initialize `package.json` for the extension.
3.  Configure `tsconfig.json`.
4.  Create basic `src/extension.ts`.
5.  Add build scripts.

**Verification:**
- `npm run compile` works.
- Extension can be loaded in VS Code (F5).

---

### Task 2: Integrate State Manager

**Goal:** Make the Core Engine logic available to the Extension.

**Steps:**
1.  Copy or symlink `lib/` (StateManager, SkillParser) to `vscode-extension/src/lib/` (or configure build to include it).
    *   *Decision:* Since `lib/` is ESM and VS Code often uses CommonJS (though supports ESM now), we might need a small adapter or ensure `tsconfig` handles it. For now, we will copy/adapt the code to TS in `src/lib/`.
2.  Create `src/lib/state-manager.ts` (Port of JS version).
3.  Create `src/lib/skill-parser.ts` (Port of JS version).

**Verification:**
- Unit tests for the TS versions of these classes.

---

### Task 3: Implement Sidebar Provider (Tree View)

**Goal:** Visual representation of the active skill and steps.

**Steps:**
1.  Create `src/workflow-provider.ts` implements `vscode.TreeDataProvider`.
2.  Register view in `package.json` (`viewsContainer`, `views`).
3.  Implement `getTreeItem` and `getChildren` to render steps from `state.json`.
4.  Add icons for states (Idle, Active, Done).

**Verification:**
- Sidebar shows "SupremePower" container.
- Mock state renders a tree of steps.

---

### Task 4: Implement Status Bar & Commands

**Goal:** Quick access and control.

**Steps:**
1.  Create `src/status-bar.ts`.
2.  Register commands: `supremepower.nextStep`, `supremepower.startSession`.
3.  Status bar shows "SP: [Phase] (Step)".
4.  Clicking status bar opens options.

**Verification:**
- Status bar appears.
- Commands trigger log outputs (for now).

---

### Task 5: Wiring & Automation

**Goal:** Connect UI to StateManager updates.

**Steps:**
1.  Extension activation loads `StateManager`.
2.  `Next Step` command calls `stateManager.update()`.
3.  Implement a file watcher on `state.json` (or internal event emitter) to refresh Tree View when state changes.

**Verification:**
- Changing state via CLI (`state.json`) updates Sidebar automatically.
- Clicking "Next" in VS Code updates `state.json`.

