# SupremePower VS Code Extension ("The Pilot")

The SupremePower VS Code extension acts as the "Pilot" for your development session. It visualizes the current workflow state, allows for quick navigation, and seamlessly integrates with GitHub Copilot Chat.

## Installation

### From Source (Current)
1.  Navigate to the `vscode-extension` directory.
    ```bash
    cd vscode-extension
    ```
2.  Install dependencies.
    ```bash
    npm install
    ```
3.  Compile the extension.
    ```bash
    npm run compile
    ```
4.  Open the directory in VS Code.
    ```bash
    code .
    ```
5.  Press `F5` to launch a new Extension Development Host window with the extension loaded.

## Features

### 1. Active Workflow Sidebar
*   **Location:** Activity Bar (Rocket Icon).
*   **Function:** Displays the steps of the currently active skill (e.g., TDD, Debugging) in a tree view.
*   **Visuals:**
    *   ✅ **Checkmark:** Completed steps.
    *   ▶️ **Play Icon:** Current active step.
    *   ⚪ **Circle:** Pending steps.

### 2. Status Bar Integration
*   **Location:** Bottom right status bar.
*   **Display:** Shows the current skill and phase (e.g., `SP: TDD (Red Phase)`).
*   **Interaction:** Click the status bar item to open a quick menu with options to:
    *   Advance to Next Step
    *   Go to Previous Step
    *   Start a New Skill

### 3. Copilot Chat Participant (`@supremepower`)
Interact with SupremePower directly within GitHub Copilot Chat using the `@supremepower` handle.

**Supported Commands:**
*   `@supremepower status` (or "Where am I?"): Shows the active skill, current phase, and active agents.
*   `@supremepower start [skill]`: Starts a new session for the specified skill (e.g., `@supremepower start tdd`).
*   `@supremepower next`: Advances to the next step in the workflow.

### 4. TDD File Watcher
When using a TDD-based skill, the extension monitors your file saves.
*   **Trigger:** Saving a file ending in `.test.ts`, `.spec.js`, etc., while in the "Red Phase".
*   **Action:** Prompts you to:
    *   **Run Tests:** Opens a terminal and runs `npm test`.
    *   **Advance to Green:** Automatically moves the workflow to the implementation phase.

## Commands

Access these commands via the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`):

| Command ID | Title | Description |
| :--- | :--- | :--- |
| `supremepower.nextStep` | **SP: Next Step** | Advances the workflow to the next step. |
| `supremepower.previousStep` | **SP: Previous Step** | Returns to the previous step. |
| `supremepower.startSkill` | **SP: Start Skill...** | Prompts to select and start a new skill. |
| `supremepower.showMenu` | *(Internal)* | Shows the Quick Pick menu (used by Status Bar). |

## Integration with Copilot

The extension automatically manages the **Context Bridge**. whenever you change steps (via Sidebar, Chat, or Command), the extension:
1.  Updates the global `state.json`.
2.  Generates a "Delta" instruction set based on the new step.
3.  Writes this delta to `.github/supremepower-active.md`.

GitHub Copilot reads this file to understand exactly what you are doing *right now*, preventing it from suggesting code that contradicts your current workflow phase (e.g., suggesting implementation code when you are supposed to be writing a failing test).
