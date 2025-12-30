#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { StateManager } from '../lib/state-manager.js';
import { SkillParser } from '../lib/skill-parser.js';
import { ContextGenerator } from '../lib/context-generator.js';

async function main() {
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  const statePath = process.env.SP_STATE_PATH || path.join(homeDir, '.supremepower', 'state.json');
  const repoRoot = process.env.SP_REPO_ROOT || process.cwd();
  const skillsPath = process.env.SP_SKILLS_PATH || path.join(homeDir, '.supremepower', 'skills');
  const copilotPath = path.join(repoRoot, '.github', 'supremepower-active.md');

  const stateManager = new StateManager(statePath);
  const state = await stateManager.load();

  if (!state.session.activeSkill || state.workflow.currentStep === 'IDLE') {
    return;
  }

  const skillName = state.session.activeSkill;
  const skillFile = path.join(skillsPath, skillName, 'SKILL.md');

  try {
    const skillContent = await fs.readFile(skillFile, 'utf8');
    const steps = SkillParser.parseSteps(skillContent);
    const currentStep = steps[state.workflow.stepIndex] || { name: state.workflow.currentStep, context: [] };
    const stepInstructions = currentStep.context.join('\n');

    const delta = ContextGenerator.generateDelta(state, stepInstructions);

    await fs.mkdir(path.dirname(copilotPath), { recursive: true });
    await fs.writeFile(copilotPath, delta, 'utf8');
  } catch (error) {
    console.error(`Error updating context bridge: ${error.message}`);
    process.exit(1);
  }
}

main();
