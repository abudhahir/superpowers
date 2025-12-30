# SupremePower Active Engine (Phase 3)

> **The engine that drives your AI coding assistants.**

This branch implements the **Active Workflow Engine**, a shared state system that synchronizes your development context across:
*   **VS Code** (Visual Sidebar, Chat)
*   **Terminal** (CLI commands)
*   **GitHub Copilot** (Dynamic Instructions)

## Why?

Passive markdown instructions are okay, but they don't know *when* you are done with a task. The Active Engine tracks your state (e.g., "TDD: Red Phase") and **force-feeds** the exact right instructions to Copilot at the right time.

## Key Features

1.  **Shared State Core:** A JSON-based source of truth (`~/.supremepower/state.json`) that all tools read/write.
2.  **Context Bridge:** Automatically generates `.github/supremepower-active.md` to tell Copilot exactly what to do next.
3.  **VS Code Extension:** A visual sidebar showing your progress through a skill (e.g., TDD steps).
4.  **CLI Automation:** Run `sp next` to advance the workflow from the terminal.

## Quick Start

1.  **Install the Extension:**
    ```bash
    cd vscode-extension
    npm install
    npm run compile
    # Open in VS Code (F5)
    ```

2.  **Start a Skill:**
    *   VS Code: `Cmd+Shift+P` -> `SP: Start Skill...` -> `tdd`
    *   CLI: `/supremepower:tdd` (if integrated)

3.  **Code with Copilot:**
    *   Copilot now knows you are in the "Red Phase" and will help you write a failing test.

4.  **Advance:**
    *   VS Code: Click "Next Step"
    *   CLI: Run `sp next`
    *   Copilot now knows you are in "Green Phase" and helps you pass the test.