import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { StateManager } from '../../../lib/state-manager.js';
import { SkillParser } from '../../../lib/skill-parser.js';
import { ContextGenerator } from '../../../lib/context-generator.js';

export async function handleNextStep() {
  const homeDir = os.homedir();
  const statePath = process.env.SUPREMEPOWER_CONFIG_PATH 
    ? path.join(process.env.SUPREMEPOWER_CONFIG_PATH, 'state.json')
    : path.join(homeDir, '.supremepower', 'state.json');
  
  const repoRoot = process.cwd();
  const skillsPath = path.join(homeDir, '.supremepower', 'skills');
  const copilotPath = path.join(repoRoot, '.github', 'supremepower-active.md');

  const stateManager = new StateManager(statePath);
  const state = await stateManager.load();

  if (!state.session.activeSkill) {
    return {
      content: [{ type: 'text' as const, text: 'Error: No active skill session.' }],
      isError: true,
    };
  }

  const skillName = state.session.activeSkill;
  const skillFile = path.join(skillsPath, skillName, 'SKILL.md');

  try {
    const skillContent = await fs.readFile(skillFile, 'utf8');
    const steps = SkillParser.parseSteps(skillContent);
    const nextIndex = state.workflow.stepIndex + 1;

    let responseText = '';

    if (nextIndex >= steps.length) {
      await stateManager.update({
        workflow: { ...state.workflow, currentStep: 'COMPLETED', stepIndex: nextIndex }
      });
      responseText = 'Workflow complete!';
    } else {
      const nextStep = steps[nextIndex];
      await stateManager.update({
        workflow: { ...state.workflow, currentStep: nextStep.name, stepIndex: nextIndex }
      });
      responseText = `Advanced to step: ${nextStep.name}`;
      
      // Update the context bridge (delta file)
      const stepInstructions = nextStep.context.join('\n');
      const delta = ContextGenerator.generateDelta(state, stepInstructions);
      await fs.mkdir(path.dirname(copilotPath), { recursive: true });
      await fs.writeFile(copilotPath, delta, 'utf8');
    }

    return {
      content: [{ type: 'text' as const, text: responseText }],
      isError: false,
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }
}
