import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { StateManager } from '../lib/state-manager';
import { SkillParser } from '../lib/skill-parser';

export function registerChatParticipant(context: vscode.ExtensionContext, stateManager: StateManager, skillsPath: string) {
  const handler: vscode.ChatRequestHandler = async (request, context, stream, token) => {
    const prompt = request.prompt.toLowerCase();

    try {
      if (prompt.includes('status') || prompt.includes('where am i')) {
        await handleStatus(stateManager, stream);
      } else if (prompt.includes('next') || prompt.includes('advance')) {
        await handleNext(stateManager, skillsPath, stream);
      } else if (prompt.includes('start')) {
        await handleStart(prompt, stateManager, skillsPath, stream);
      } else {
        stream.markdown('I can help you manage your development workflow. Try commands like:\n\n');
        stream.markdown('- **Start TDD**: Begin a Test-Driven Development session.\n');
        stream.markdown('- **Next**: Advance to the next step.\n');
        stream.markdown('- **Status**: See current phase and active agents.');
      }
    } catch (err: any) {
      stream.markdown(`\n\n**Error:** ${err.message}`);
    }
    
    return { metadata: { command: '' } };
  };

  const participant = vscode.chat.createChatParticipant('supremepower.chat', handler);
  participant.iconPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'icon.svg'));
  context.subscriptions.push(participant);
}

async function handleStatus(stateManager: StateManager, stream: vscode.ChatResponseStream) {
  const state = await stateManager.load();
  if (!state.session.activeSkill) {
    stream.markdown('SupremePower is currently **Idle**.');
  } else {
    stream.markdown(`**Active Skill:** ${state.session.activeSkill}\n`);
    stream.markdown(`**Current Phase:** ${state.workflow.currentStep}\n`);
    if (state.agents.active.length > 0) {
      stream.markdown(`**Active Agents:** ${state.agents.active.join(', ')}`);
    }
  }
}

async function handleNext(stateManager: StateManager, skillsPath: string, stream: vscode.ChatResponseStream) {
  const state = await stateManager.load();
  if (!state.session.activeSkill) {
    stream.markdown('No active session to advance. Use "Start [skill]" to begin.');
    return;
  }

  // We reuse the command logic by executing it, but for Chat we might want to be explicit
  // For simplicity, let's call the command which handles the logic and UI updates
  await vscode.commands.executeCommand('supremepower.nextStep');
  stream.markdown('Advanced to the next step.');
}

async function handleStart(prompt: string, stateManager: StateManager, skillsPath: string, stream: vscode.ChatResponseStream) {
  // Extract skill name "start [skill]"
  const parts = prompt.split('start');
  const skillNameCandidate = parts[1]?.trim();

  if (!skillNameCandidate) {
    stream.markdown('Please specify a skill name, e.g., "Start TDD".');
    return;
  }

  // Basic fuzzy match or direct check
  // In a real app, we'd list available skills.
  // For now, assume user knows the folder name or we try to match it.
  
  // Try to find the skill directory
  try {
    const availableSkills = await fs.readdir(skillsPath);
    const matchedSkill = availableSkills.find(s => s.toLowerCase() === skillNameCandidate.toLowerCase() || 
                                                 s.toLowerCase().includes(skillNameCandidate.toLowerCase()));

    if (matchedSkill) {
      // Start the skill
      // We can't pass arguments to the command easily if it uses InputBox.
      // So we'll implement the start logic here directly.
      
      const skillFile = path.join(skillsPath, matchedSkill, 'SKILL.md');
      const skillContent = await fs.readFile(skillFile, 'utf8');
      const steps = SkillParser.parseSteps(skillContent);
      const firstStep = steps[0];

      await stateManager.update({
        session: { activeSkill: matchedSkill, id: Date.now().toString() },
        workflow: { currentStep: firstStep.name, stepIndex: 0, completedSteps: [], context: {} }
      });
      
      stream.markdown(`Started skill: **${matchedSkill}**\n`);
      stream.markdown(`**Step 1:** ${firstStep.name}\n`);
      stream.markdown(firstStep.context.join('\n'));
    } else {
        stream.markdown(`Could not find skill matching "${skillNameCandidate}". Available skills: ${availableSkills.join(', ')}`);
    }
  } catch (e: any) {
    stream.markdown(`Error accessing skills: ${e.message}`);
  }
}
