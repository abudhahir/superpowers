import * as vscode from 'vscode';
import { StateManager } from '../lib/state-manager';

export class TddWatcher {
  private watcher: vscode.Disposable | null = null;

  constructor(private stateManager: StateManager) {}

  start() {
    this.watcher = vscode.workspace.onDidSaveTextDocument(async (document) => {
      if (this.isTestFile(document.fileName)) {
        await this.handleTestFileSave();
      }
    });
  }

  dispose() {
    if (this.watcher) {
      this.watcher.dispose();
    }
  }

  private isTestFile(fileName: string): boolean {
    return /\.(test|spec)\.(ts|js|jsx|tsx)$/.test(fileName);
  }

  private async handleTestFileSave() {
    try {
      const state = await this.stateManager.load();
      
      // Check if we are in TDD mode
      const isTdd = state.session.activeSkill?.toLowerCase().includes('tdd') || 
                    state.session.activeSkill?.toLowerCase().includes('test-driven');
      
      if (!isTdd) {
        return;
      }

      // Check if we are in Red Phase
      const stepName = state.workflow.currentStep.toLowerCase();
      if (stepName.includes('red') || stepName.includes('fail')) {
        const runAction = 'Run Tests';
        const advanceAction = 'Advance to Green';
        
        const selection = await vscode.window.showInformationMessage(
          'Tests updated in Red Phase. What would you like to do?',
          runAction,
          advanceAction
        );

        if (selection === runAction) {
            // In a real implementation, we would detect the test runner.
            // For now, we'll try running "npm test" in a terminal.
            this.runTests();
        } else if (selection === advanceAction) {
            await vscode.commands.executeCommand('supremepower.nextStep');
        }
      }
    } catch (error) {
      console.error('Error in TddWatcher:', error);
    }
  }

  private runTests() {
    const terminal = vscode.window.createTerminal('SupremePower Tests');
    terminal.show();
    terminal.sendText('npm test');
  }
}
