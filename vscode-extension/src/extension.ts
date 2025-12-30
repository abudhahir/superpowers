import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs/promises';
import { StateManager } from './lib/state-manager';
import { SkillParser } from './lib/skill-parser';
import { ContextGenerator } from './lib/context-generator';
import { WorkflowProvider } from './workflow-provider';
import { StatusBar } from './status-bar';
import { TddWatcher } from './watchers/tdd-watcher';
import { registerChatParticipant } from './chat/participant';

export async function activate(context: vscode.ExtensionContext) {
  const homeDir = os.homedir();
  const statePath = path.join(homeDir, '.supremepower', 'state.json');
  const skillsPath = path.join(homeDir, '.supremepower', 'skills');
  const stateManager = new StateManager(statePath);

  const workflowProvider = new WorkflowProvider(stateManager, skillsPath);
  vscode.window.registerTreeDataProvider('supremepower-workflow', workflowProvider);

  const statusBar = new StatusBar();
  const tddWatcher = new TddWatcher(stateManager);
  tddWatcher.start();

  registerChatParticipant(context, stateManager, skillsPath);

  stateManager.onStateChanged((newState) => {
    statusBar.update(newState);
    workflowProvider.refresh();
  });

  // Initial load
  try {
    const initialState = await stateManager.load();
    statusBar.update(initialState);
  } catch (e) {
    console.error('Failed to load initial state', e);
  }

  async function updateCopilotContext(state: any, stepInstructions: string) {
    if (vscode.workspace.workspaceFolders) {
      const repoRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
      const copilotPath = path.join(repoRoot, '.github', 'supremepower-active.md');
      const delta = ContextGenerator.generateDelta(state, stepInstructions);
      
      try {
        await fs.mkdir(path.dirname(copilotPath), { recursive: true });
        await fs.writeFile(copilotPath, delta, 'utf8');
      } catch (e: any) {
        vscode.window.showErrorMessage(`Failed to update Copilot context: ${e.message}`);
      }
    }
  }

  let nextStepCmd = vscode.commands.registerCommand('supremepower.nextStep', async () => {
    try {
      const state = await stateManager.load();
      if (!state.session.activeSkill) {
        vscode.window.showErrorMessage('No active skill session.');
        return;
      }

      const skillFile = path.join(skillsPath, state.session.activeSkill, 'SKILL.md');
      const skillContent = await fs.readFile(skillFile, 'utf8');
      const steps = SkillParser.parseSteps(skillContent);
      const nextIndex = state.workflow.stepIndex + 1;

      if (nextIndex >= steps.length) {
        await stateManager.update({
          workflow: { ...state.workflow, currentStep: 'COMPLETED', stepIndex: nextIndex }
        });
        vscode.window.showInformationMessage('Workflow complete!');
      } else {
        const nextStep = steps[nextIndex];
        const newState = await stateManager.update({
          workflow: { ...state.workflow, currentStep: nextStep.name, stepIndex: nextIndex }
        });
        vscode.window.showInformationMessage(`Advanced to: ${nextStep.name}`);
        
        await updateCopilotContext(newState, nextStep.context.join('\n'));
      }
    } catch (e: any) {
      vscode.window.showErrorMessage(`Error: ${e.message}`);
    }
  });

  let previousStepCmd = vscode.commands.registerCommand('supremepower.previousStep', async () => {
    try {
      const state = await stateManager.load();
      if (!state.session.activeSkill) {
        vscode.window.showErrorMessage('No active skill session.');
        return;
      }

      if (state.workflow.stepIndex <= 0) {
        vscode.window.showInformationMessage('Already at the first step.');
        return;
      }

      const skillFile = path.join(skillsPath, state.session.activeSkill, 'SKILL.md');
      const skillContent = await fs.readFile(skillFile, 'utf8');
      const steps = SkillParser.parseSteps(skillContent);
      const prevIndex = state.workflow.stepIndex - 1;

      const prevStep = steps[prevIndex];
      const newState = await stateManager.update({
        workflow: { ...state.workflow, currentStep: prevStep.name, stepIndex: prevIndex }
      });
      vscode.window.showInformationMessage(`Moved back to: ${prevStep.name}`);
      
      await updateCopilotContext(newState, prevStep.context.join('\n'));
    } catch (e: any) {
      vscode.window.showErrorMessage(`Error: ${e.message}`);
    }
  });

  let startSkillCmd = vscode.commands.registerCommand('supremepower.startSkill', async () => {
    const skill = await vscode.window.showInputBox({ prompt: 'Enter skill name' });
    if (skill) {
      const skillFile = path.join(skillsPath, skill, 'SKILL.md');
      try {
        const skillContent = await fs.readFile(skillFile, 'utf8');
        const steps = SkillParser.parseSteps(skillContent);
        const firstStep = steps[0];
        
        const newState = await stateManager.update({
          session: { activeSkill: skill, id: Date.now().toString() },
          workflow: { currentStep: firstStep.name, stepIndex: 0, completedSteps: [], context: {} }
        });
        
        vscode.window.showInformationMessage(`Started skill: ${skill}`);
        await updateCopilotContext(newState, firstStep.context.join('\n'));
      } catch (e: any) {
        vscode.window.showErrorMessage(`Failed to start skill: ${e.message}`);
      }
    }
  });

  let showMenuCmd = vscode.commands.registerCommand('supremepower.showMenu', async () => {
    const items = [
      { label: 'Next Step', command: 'supremepower.nextStep' },
      { label: 'Previous Step', command: 'supremepower.previousStep' },
      { label: 'Start Skill', command: 'supremepower.startSkill' }
    ];
    const selection = await vscode.window.showQuickPick(items);
    if (selection) {
      vscode.commands.executeCommand(selection.command);
    }
  });

  context.subscriptions.push(nextStepCmd, previousStepCmd, startSkillCmd, showMenuCmd, statusBar, tddWatcher);
}

export function deactivate() {}