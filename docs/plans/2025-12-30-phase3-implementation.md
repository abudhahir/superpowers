# Phase 3: Core Engine Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the shared state and context generation core for the Phase 3 Active Workflow Engine.

**Architecture:** A shared `state.json` file serves as the source of truth, managed by a `StateManager`. A `SkillParser` extracts steps from Markdown, and a `ContextGenerator` produces dynamic instructions for GitHub Copilot.

**Tech Stack:** Node.js, Jest, Markdown

---

### Task 1: Create State Manager Persistence

**Files:**
- Create: `lib/state-manager.js`
- Test: `tests/unit/lib/state-manager.test.js`

**Step 1: Write the failing test**

```javascript
const { StateManager } = require('../../../lib/state-manager');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');

describe('StateManager', () => {
  let tempDir;
  let statePath;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sp-state-test-'));
    statePath = path.join(tempDir, 'state.json');
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('should initialize with default state if file does not exist', async () => {
    const manager = new StateManager(statePath);
    const state = await manager.load();
    expect(state.workflow.currentStep).toBe('IDLE');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest tests/unit/lib/state-manager.test.js`
Expected: FAIL with "StateManager is not a constructor"

**Step 3: Write minimal implementation**

```javascript
const fs = require('fs/promises');

class StateManager {
  constructor(statePath) {
    this.statePath = statePath;
    this.defaultState = {
      session: { id: null, activeSkill: null },
      workflow: { currentStep: 'IDLE', stepIndex: 0, completedSteps: [], context: {} },
      agents: { active: [], overrides: {} }
    };
  }

  async load() {
    try {
      const data = await fs.readFile(this.statePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return this.defaultState;
    }
  }
}

module.exports = { StateManager };
```

**Step 4: Run test to verify it passes**

Run: `npx jest tests/unit/lib/state-manager.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/state-manager.js tests/unit/lib/state-manager.test.js
git commit -m "feat: implement basic StateManager load functionality"
```

---

### Task 2: Implement State Updates with Persistence

**Files:**
- Modify: `lib/state-manager.js`
- Modify: `tests/unit/lib/state-manager.test.js`

**Step 1: Write the failing test**

```javascript
  it('should save and reload updated state', async () => {
    const manager = new StateManager(statePath);
    await manager.update({ workflow: { currentStep: 'RED_PHASE' } });
    
    const secondManager = new StateManager(statePath);
    const state = await secondManager.load();
    expect(state.workflow.currentStep).toBe('RED_PHASE');
  });
```

**Step 2: Run test to verify it fails**

Run: `npx jest tests/unit/lib/state-manager.test.js`
Expected: FAIL with "manager.update is not a function"

**Step 3: Write minimal implementation**

```javascript
  async update(partialState) {
    const currentState = await this.load();
    const newState = {
      ...currentState,
      ...partialState,
      workflow: { ...currentState.workflow, ...partialState.workflow },
      session: { ...currentState.session, ...partialState.session },
      agents: { ...currentState.agents, ...partialState.agents }
    };
    await fs.writeFile(this.statePath, JSON.stringify(newState, null, 2));
    return newState;
  }
```

**Step 4: Run test to verify it passes**

Run: `npx jest tests/unit/lib/state-manager.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/state-manager.js tests/unit/lib/state-manager.test.js
git commit -m "feat: implement state updates and persistence"
```

---

### Task 3: Implement Skill Parser (Markdown to Steps)

**Files:**
- Create: `lib/skill-parser.js`
- Test: `tests/unit/lib/skill-parser.test.js`

**Step 1: Write the failing test**

```javascript
const { SkillParser } = require('../../../lib/skill-parser');

describe('SkillParser', () => {
  it('should extract steps from markdown headers', () => {
    const markdown = `
# TDD
## Red-Green-Refactor
### RED - Write Failing Test
Write a test.
### GREEN - Pass
Write code.
    `;
    const steps = SkillParser.parseSteps(markdown);
    expect(steps[0].name).toBe('RED - Write Failing Test');
    expect(steps[1].name).toBe('GREEN - Pass');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest tests/unit/lib/skill-parser.test.js`
Expected: FAIL with "SkillParser is not defined"

**Step 3: Write minimal implementation**

```javascript
class SkillParser {
  static parseSteps(markdown) {
    const steps = [];
    const lines = markdown.split('\n');
    let currentStep = null;

    for (const line of lines) {
      if (line.startsWith('### ')) {
        if (currentStep) steps.push(currentStep);
        currentStep = { name: line.replace('### ', '').trim(), context: [] };
      } else if (currentStep && line.trim()) {
        currentStep.context.push(line);
      }
    }
    if (currentStep) steps.push(currentStep);
    return steps;
  }
}

module.exports = { SkillParser };
```

**Step 4: Run test to verify it passes**

Run: `npx jest tests/unit/lib/skill-parser.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/skill-parser.js tests/unit/lib/skill-parser.test.js
git commit -m "feat: implement basic skill markdown parser"
```

---

### Task 4: Implement Context Generator (Delta Bridge)

**Files:**
- Create: `lib/context-generator.js`
- Test: `tests/unit/lib/context-generator.test.js`

**Step 1: Write the failing test**

```javascript
const { ContextGenerator } = require('../../../lib/context-generator');

describe('ContextGenerator', () => {
  it('should generate delta instructions from state', () => {
    const state = {
      workflow: { currentStep: 'RED_PHASE' },
      agents: { active: ['security-engineer'] }
    };
    const stepInstructions = "Write a failing test.";
    const delta = ContextGenerator.generateDelta(state, stepInstructions);
    expect(delta).toContain('RED_PHASE');
    expect(delta).toContain('security-engineer');
    expect(delta).toContain('Write a failing test.');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest tests/unit/lib/context-generator.test.js`
Expected: FAIL with "ContextGenerator is not defined"

**Step 3: Write minimal implementation**

```javascript
class ContextGenerator {
  static generateDelta(state, stepInstructions) {
    return `
# SupremePower Active State
**Current Phase:** ${state.workflow.currentStep}
**Active Agents:** ${state.agents.active.join(', ')}

## Instructions for Current Step
${stepInstructions}
    `.trim();
  }
}

module.exports = { ContextGenerator };
```

**Step 4: Run test to verify it passes**

Run: `npx jest tests/unit/lib/context-generator.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/context-generator.js tests/unit/lib/context-generator.test.js
git commit -m "feat: implement delta instruction generator"
```
