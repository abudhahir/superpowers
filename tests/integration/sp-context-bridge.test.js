import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('sp-context-bridge CLI', () => {
  let tempDir;
  let statePath;
  let copilotPath;
  let skillPath;

  beforeEach(async () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sp-bridge-test-'));
    statePath = path.join(tempDir, '.supremepower', 'state.json');
    copilotPath = path.join(tempDir, '.github', 'supremepower-active.md');
    skillPath = path.join(tempDir, 'skills', 'tdd', 'SKILL.md');

    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    fs.mkdirSync(path.dirname(copilotPath), { recursive: true });
    fs.mkdirSync(path.dirname(skillPath), { recursive: true });

    // Setup dummy skill
    fs.writeFileSync(skillPath, '# TDD\n### RED\nWrite test.');
    
    // Setup state
    fs.writeFileSync(statePath, JSON.stringify({
      session: { activeSkill: 'tdd' },
      workflow: { currentStep: 'RED', stepIndex: 0 },
      agents: { active: ['tester'] }
    }));
  });

  afterEach(async () => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should update copilot instructions based on state', () => {
    const scriptPath = path.resolve('.worktrees/phase3-active-engine/scripts/sp-context-bridge.js');
    
    // Ensure the directory exists even if file doesn't yet
    fs.mkdirSync(path.dirname(scriptPath), { recursive: true });

    execSync(`node ${scriptPath}`, {
      env: {
        ...process.env,
        SP_STATE_PATH: statePath,
        SP_REPO_ROOT: tempDir,
        SP_SKILLS_PATH: path.join(tempDir, 'skills')
      },
      stdio: 'pipe'
    });

    const content = fs.readFileSync(copilotPath, 'utf8');
    expect(content).toContain('RED');
    expect(content).toContain('Write test.');
    expect(content).toContain('tester');
  });
});
