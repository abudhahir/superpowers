import { jest } from '@jest/globals';
import { StateManager } from '../../../lib/state-manager.js';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

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

  it('should save and reload updated state', async () => {
    const manager = new StateManager(statePath);
    await manager.update({ workflow: { currentStep: 'RED_PHASE' } });

    const secondManager = new StateManager(statePath);
    const state = await secondManager.load();
    expect(state.workflow.currentStep).toBe('RED_PHASE');
  });
});
