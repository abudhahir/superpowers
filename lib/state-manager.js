import fs from 'fs/promises';

export class StateManager {
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

  async update(partialState) {
    const currentState = await this.load();
    const newState = {
      ...currentState,
      ...partialState,
      workflow: { ...currentState.workflow, ...(partialState.workflow || {}) },
      session: { ...currentState.session, ...(partialState.session || {}) },
      agents: { ...currentState.agents, ...(partialState.agents || {}) }
    };
    await fs.writeFile(this.statePath, JSON.stringify(newState, null, 2));
    return newState;
  }
}