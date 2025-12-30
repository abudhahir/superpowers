import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('SupremePower extension is now active!');

  let nextStepCmd = vscode.commands.registerCommand('supremepower.nextStep', () => {
    vscode.window.showInformationMessage('Advancing to next step...');
    // TODO: Call StateManager and ContextBridge
  });

  let prevStepCmd = vscode.commands.registerCommand('supremepower.previousStep', () => {
    vscode.window.showInformationMessage('Going back to previous step...');
  });

  let startSkillCmd = vscode.commands.registerCommand('supremepower.startSkill', async () => {
    const skill = await vscode.window.showInputBox({ prompt: 'Enter skill name' });
    if (skill) {
      vscode.window.showInformationMessage(`Starting skill: ${skill}`);
    }
  });

  context.subscriptions.push(nextStepCmd, prevStepCmd, startSkillCmd);
}

export function deactivate() {}
