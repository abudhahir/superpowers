import * as vscode from 'vscode';
import { StateManager } from './lib/state-manager';

export class WorkflowStatusBar {
    private statusBarItem: vscode.StatusBarItem;

    constructor(private stateManager: StateManager) {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'supremepower.nextStep'; // Default to next step for quick access
        this.update();
    }

    async update() {
        try {
            const state = await this.stateManager.load();
            if (state.session.activeSkill && state.workflow.currentStep && state.workflow.currentStep !== 'IDLE') {
                this.statusBarItem.text = `$(rocket) SP: ${state.workflow.currentStep}`;
                this.statusBarItem.tooltip = `Skill: ${state.session.activeSkill}\nStep: ${state.workflow.stepIndex + 1}\nClick to advance`;
                this.statusBarItem.show();
            } else {
                this.statusBarItem.hide();
            }
        } catch (error) {
            this.statusBarItem.hide();
        }
    }
    
    dispose() {
        this.statusBarItem.dispose();
    }
}
