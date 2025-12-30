import * as fs from 'fs/promises';
import { watch, FSWatcher } from 'fs';
import { EventEmitter } from 'events';

interface State {
  session: { id: string | null; activeSkill: string | null };
  workflow: { currentStep: string; stepIndex: number; completedSteps: string[]; context: any };
  agents: { active: string[]; overrides: any };
}

export class StateManager {
  private statePath: string;
  private defaultState: State;
  private watcher: FSWatcher | null = null;
  private events: EventEmitter = new EventEmitter();

  constructor(statePath: string) {
    this.statePath = statePath;
    this.defaultState = {
      session: { id: null, activeSkill: null },
      workflow: { currentStep: 'IDLE', stepIndex: 0, completedSteps: [], context: {} },
      agents: { active: [], overrides: {} }
    };
  }

  public onStateChanged(callback: (state: State) => void) {
    this.events.on('changed', callback);
    if (!this.watcher) {
      this.startWatching();
    }
  }

  private startWatching() {
    try {
      this.watcher = watch(this.statePath, async (event) => {
        if (event === 'change') {
          const state = await this.load();
          this.events.emit('changed', state);
        }
      });
    } catch (e) {
      console.error('Failed to start watching state file', e);
    }
  }

  async load(): Promise<State> {
    try {
      const data = await fs.readFile(this.statePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return this.defaultState;
    }
  }

  async update(partialState: any): Promise<State> {
    const currentState = await this.load();
    const newState = {
      ...currentState,
      ...partialState,
      workflow: { ...currentState.workflow, ...(partialState.workflow || {}) },
      session: { ...currentState.session, ...(partialState.session || {}) },
      agents: { ...currentState.agents, ...(partialState.agents || {}) }
    };
    await fs.writeFile(this.statePath, JSON.stringify(newState, null, 2));
    this.events.emit('changed', newState);
    return newState;
  }

  dispose() {
    if (this.watcher) {
      this.watcher.close();
    }
  }
}