import * as vscode from 'vscode';

export class StatusBar {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBarItem.command = 'supremepower.showMenu';
    this.statusBarItem.text = '$(rocket) SP: Idle';
    this.statusBarItem.show();
  }

  update(state: any) {
    if (state.session.activeSkill) {
      this.statusBarItem.text = `$(rocket) SP: ${state.session.activeSkill} (${state.workflow.currentStep})`;
      this.statusBarItem.tooltip = `Active Skill: ${state.session.activeSkill}\nStep: ${state.workflow.currentStep}`;
    } else {
      this.statusBarItem.text = '$(rocket) SP: Idle';
      this.statusBarItem.tooltip = 'SupremePower is Idle';
    }
  }

  dispose() {
    this.statusBarItem.dispose();
  }
}
