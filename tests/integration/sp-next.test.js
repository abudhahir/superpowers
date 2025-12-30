import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('sp-next logic', () => {
  let tempDir;
  let statePath;
  let skillPath;

  beforeEach(async () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sp-next-test-'));
    statePath = path.join(tempDir, '.supremepower', 'state.json');
    skillPath = path.join(tempDir, 'skills', 'tdd', 'SKILL.md');

    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    fs.mkdirSync(path.dirname(skillPath), { recursive: true });

    // Setup skill with 2 steps
    fs.writeFileSync(skillPath, '# TDD\n### RED\nStep 1\n### GREEN\nStep 2');
    
    // Setup state at step 0
    fs.writeFileSync(statePath, JSON.stringify({
      session: { activeSkill: 'tdd' },
      workflow: { currentStep: 'RED', stepIndex: 0 },
      agents: { active: [] }
    }));
  });

  afterEach(async () => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should advance to next step', () => {
    const scriptPath = path.resolve('.worktrees/phase3-active-engine/scripts/sp-next.js');
    
    execSync(`node ${scriptPath}`, {
      env: {
        ...process.env,
        SP_STATE_PATH: statePath,
        SP_SKILLS_PATH: path.join(tempDir, 'skills')
      },
      stdio: 'pipe'
    });

    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    expect(state.workflow.stepIndex).toBe(1);
    expect(state.workflow.currentStep).toBe('GREEN');
  });
});
