# Phase 3: SupremePower Active Workflow Engine

**Status:** MVP Implemented
**Components:** Shared State Core, VS Code Extension, Context Bridge, CLI Integration

## Overview

Phase 3 transforms SupremePower into an **Active Workflow Engine** that synchronizes your development workflow across your IDE, Terminal, and AI Assistants (Copilot/Gemini).

It introduces a **Shared State** architecture:
- **CLI** (`sp next`) advances the workflow state.
- **VS Code Extension** visualizes steps and updates automatically.
- **GitHub Copilot** receives dynamic context updates (`.github/supremepower-active.md`) based on your current task.

## Installation (MVP)

### 1. Core & CLI Setup
The core engine is integrated into the `supremepower-gemini` package.

```bash
# Update extension
gemini extensions update supremepower

# Install context bridge (happens automatically via extension)
```

### 2. VS Code Extension
Currently in source form. To install:

```bash
cd .worktrees/phase3-active-engine/vscode-extension
npm install
npm run compile
# Then open in VS Code and press F5 to debug
```

## Usage Guide

### Starting a Skill
**VS Code:** Run command `SP: Start Skill...` -> Enter `tdd`.
**CLI:** Use existing slash commands `/supremepower:tdd`.

### Advancing Steps
**VS Code:** Click "Next Step" command (UI button coming soon).
**CLI:** Run `/sp:next` or `/supremepower:next` (via slash command).

### Copilot Integration
The system automatically maintains `.github/supremepower-active.md`.
**Configuration:** Ensure your `.github/copilot-instructions.md` includes a reference to it (or relies on Copilot picking it up from the `.github` folder).

## Architecture

```mermaid
[State JSON] <-> [VS Code Extension]
     ^                  |
     |                  v
[CLI/MCP Tools] -> [Context Bridge] -> [Copilot Files]
```

## Troubleshooting

- **State Desync:** If VS Code doesn't update, run the `Refresh` command (auto-refresh implemented on focus).
- **Missing Skills:** Ensure `~/.supremepower/skills` is populated.
