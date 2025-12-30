# Phase 3 Design: SupremePower Active Workflow Engine

**Date:** 2025-12-30
**Status:** Design Approved
**Target Platform:** VS Code (Extension) + GitHub Copilot + CLI

## Executive Summary

Phase 3 transforms SupremePower from a passive CLI tool into an **Active Workflow Engine** embedded directly in the developer's IDE. By creating a shared state layer, we unify the CLI and VS Code experience, allowing users to drive complex workflows (like TDD or Debugging) through Chat, UI buttons, or Terminal commands while keeping GitHub Copilot's context perfectly synchronized.

**Core Philosophy:** "The State is the Truth." Whether you advance a step via `/sp next` in the terminal or by clicking a button in VS Code, the engine updates the global state, which instantly reconfigures GitHub Copilot's instructions to match your current task.

---

## 1. System Architecture

The system relies on a **Shared State Architecture** ensuring all tools see the same reality.

```mermaid
graph TD
    User((User))

    subgraph "VS Code IDE"
        Ext[VS Code Extension]
        Chat[Copilot Chat (@supremepower)]
        Sidebar[Workflow Sidebar]
    end

    subgraph "Core System"
        StateMgr[State Manager Lib]
        StateFile[/.supremepower/state.json]
    end

    subgraph "Context Bridge"
        CtxGen[Context Generator]
        BaseInstr[/.github/copilot-instructions.md]
        DeltaInstr[/.github/supremepower-active.md]
    end

    subgraph "CLI"
        CLI[Gemini/SP CLI]
    end

    User -->|Interacts| Ext
    User -->|Interacts| CLI
    
    Ext -->|Reads/Writes| StateMgr
    CLI -->|Reads/Writes| StateMgr
    Chat -->|Reads/Writes| StateMgr
    
    StateMgr -->|Persists| StateFile
    StateFile -->|Triggers Update| CtxGen
    
    CtxGen -->|Writes| DeltaInstr
    
    GitHubCopilot -->|Reads| BaseInstr
    GitHubCopilot -->|Reads| DeltaInstr
```

### 1.1 Shared State Manager
A lightweight Node.js library (`@supremepower/state`) responsible for:
*   **Persistence:** Reading/writing `.supremepower/state.json`.
*   **Validation:** Ensuring valid state transitions (e.g., can't go to Green before Red).
*   **Broadcasting:** Emitting events when state changes (via file watching).

**State Schema (`state.json`):**
```json
{
  "session": {
    "id": "uuid-v4",
    "startTime": "2025-12-30T10:00:00Z",
    "activeSkill": "test-driven-development"
  },
  "workflow": {
    "currentStep": "RED_PHASE",
    "stepIndex": 0,
    "completedSteps": [],
    "context": {
      "featureName": "AuthRetry",
      "testFile": "src/auth.test.ts"
    }
  },
  "agents": {
    "active": ["security-engineer", "testing-specialist"],
    "overrides": {}
  }
}
```

### 1.2 VS Code Extension ("The Pilot")
The primary UI for Phase 3.
*   **Sidebar Provider:** Renders the current skill's steps as a tree view.
    *   *Visuals:* Checkmarks for done, "Spinner" for active, Gray for pending.
*   **Chat Participant (`@supremepower`):**
    *   "Let's start TDD for the login feature." -> Initializes State.
    *   "I'm done." -> Validates and advances State.
*   **Status Bar:** "SP: TDD (Red)" -> Click to open menu.

### 1.3 Context Generator (Copilot Bridge)
Automatically maintains the files GitHub Copilot reads.
*   **Base (Static):** `.github/copilot-instructions.md`
    *   Contains: Project-wide rules (Code Style, "Always use TDD").
*   **Delta (Dynamic):** `.github/supremepower-active.md`
    *   Contains: **Active Agent Persona** + **Current Step Instructions**.
    *   *Example Update:* When moving to "Green Phase", this file is wiped and replaced with "You are now in Green Phase. Write minimal code to pass the test. Do not refactor yet."

---

## 2. Interaction Models ("All of the Above")

We support three concurrent interaction modes. Users can mix and match.

### Mode A: Chat-Driven (Natural Language)
*   **User:** `@supremepower I want to debug the auth service.`
*   **System:**
    1.  Parses intent -> Loads `systematic-debugging` skill.
    2.  Detects domain -> Activates `security-engineer` + `backend-architect`.
    3.  Updates State -> `state.json`.
    4.  Updates Context -> `supremepower-active.md` (Security Persona + Debug Phase 1 Instructions).
    5.  **Response:** "I've set up the debugging session. Phase 1: Reproduce the issue. What are you seeing?"

### Mode B: UI-Driven (Visual)
*   **User:** Opens "SupremePower" sidebar.
*   **Action:** Clicks "Start TDD".
*   **Visual:** Tree view shows TDD steps. "Red Phase" is highlighted.
*   **Action:** User clicks "Run Tests" button next to the step.
*   **System:** Executes `npm test` in the integrated terminal.

### Mode C: Command-Driven (Keyboard/CLI)
*   **User:** `Cmd+Shift+P` -> `SupremePower: Next Step` OR Terminal -> `sp next`.
*   **System:** Advances state to "Green Phase".
*   **Effect:** Copilot context instantly updates. The next time the user types in the editor, Copilot suggests implementation code instead of test code.

---

## 3. Automation & Triggers (Hybrid)

We use a "Heuristic + Confirmation" model to automate state transitions without losing control.

### 3.1 File Watchers
The extension watches relevant files based on the active skill.
*   *Scenario:* TDD / Red Phase.
*   *Trigger:* User saves `*.test.ts`.
*   *Action:* Extension detects file save.
*   *Heuristic:* "User modified a test file in Red Phase."
*   *Response:* Shows a non-intrusive toast notification: "Tests updated. Run verification?" with buttons [Run Tests] [Advance Phase].

### 3.2 Task Runner
Skills can define tasks that the extension can execute.
*   **Definition:** In `SKILL.md` (parsed) or `SKILL.toml` (sidecar).
*   **Execution:** specific VS Code Terminal (`SupremePower Tasks`).
*   **Validation:** Checks exit code. If `0`, prompts to advance.

---

## 4. Implementation Plan

### Step 1: Core Library (`@supremepower/core`)
*   Refactor existing orchestration logic into a standalone package.
*   Implement `StateManager` class (Read/Write JSON).
*   Implement `SkillParser` (Markdown -> Structured Steps).

### Step 2: Context Generator
*   Create `ContextManager` class.
*   Implement `generateActiveContext(state)` function.
*   *Deliverable:* CLI tool that updates `.github/supremepower-active.md` when state changes.

### Step 3: VS Code Extension (Basic)
*   Scaffold new extension.
*   Implement `TreeDataProvider` for the Sidebar.
*   Implement `StatusBarItem`.
*   Connect to `StateManager` (read-only for now).

### Step 4: Chat Participant & Commands
*   Implement `@supremepower` chat handler.
*   Implement command palette actions (`Next`, `Prev`, `Start`).
*   Connect to `StateManager` (write access).

### Step 5: Automation & Polish
*   Implement File Watchers.
*   Implement Task Runner (Terminal integration).
*   Add "Dynamic Prompt Injection" (injecting agent personas into Copilot Chat hidden context).

---

## 5. Skill Definition Protocol (v2)

To support "Active" features without breaking the "Pure Markdown" philosophy, we use **Convention over Configuration**.

### 5.1 Structure Mapping
*   `# Title` -> **Skill Name**.
*   `## Header 2` -> **Phase/Stage**.
*   `### Header 3` -> **Step**.
*   `code block (bash/sh)` -> **Executable Task**.

### 5.2 Smart Context
The text immediately following a header is the **Instruction Context** for that step.
*   *Example:*
    ```markdown
    ### RED - Write Failing Test
    Write one minimal test...
    ```
*   *Engine Behavior:* When entering "RED" step, the engine extracts "Write one minimal test..." and injects it into `.github/supremepower-active.md`.

---

## 6. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| **State Desync** | File watcher on `state.json` ensures specific "last-write-wins" or atomic updates. |
| **Copilot Latency** | Context files are small (< 2KB). Updates are near-instant. |
| **User Confusion** | UI Sidebar always shows "Where am I?" clearly. |
| **Over-Automation** | All transitions default to "Ask First" (Hybrid model). |

