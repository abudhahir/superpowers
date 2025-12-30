#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { StateManager } from '../lib/state-manager.js';
import { SkillParser } from '../lib/skill-parser.js';
import { execSync } from 'child_process';

async function main() {
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  const statePath = process.env.SP_STATE_PATH || path.join(homeDir, '.supremepower', 'state.json');
  const skillsPath = process.env.SP_SKILLS_PATH || path.join(homeDir, '.supremepower', 'skills');

  const stateManager = new StateManager(statePath);
  const state = await stateManager.load();

  if (!state.session.activeSkill) {
    console.error('No active skill session.');
    process.exit(1);
  }

  const skillName = state.session.activeSkill;
  const skillFile = path.join(skillsPath, skillName, 'SKILL.md');

  try {
    const skillContent = await fs.readFile(skillFile, 'utf8');
    const steps = SkillParser.parseSteps(skillContent);
    const nextIndex = state.workflow.stepIndex + 1;

    if (nextIndex >= steps.length) {
      console.log('Workflow complete!');
      await stateManager.update({
        workflow: { ...state.workflow, currentStep: 'COMPLETED', stepIndex: nextIndex }
      });
    } else {
      const nextStep = steps[nextIndex];
      await stateManager.update({
        workflow: { ...state.workflow, currentStep: nextStep.name, stepIndex: nextIndex }
      });
      console.log(`Advanced to step: ${nextStep.name}`);
    }

    // Trigger the context bridge to update Copilot files
    const bridgePath = path.resolve(path.dirname(import.meta.url.replace('file://', '')), 'sp-context-bridge.js');
    execSync(`node ${bridgePath}`, {
      env: { ...process.env, SP_STATE_PATH: statePath, SP_SKILLS_PATH: skillsPath },
      stdio: 'inherit'
    });

  } catch (error) {
    console.error(`Error advancing workflow: ${error.message}`);
    process.exit(1);
  }
}

main();
