import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { StateManager } from './lib/state-manager';
import { SkillParser } from './lib/skill-parser';

export class WorkflowProvider implements vscode.TreeDataProvider<WorkflowStep> {
  private _onDidChangeTreeData: vscode.EventEmitter<WorkflowStep | undefined | null | void> = new vscode.EventEmitter<WorkflowStep | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<WorkflowStep | undefined | null | void> = this._onDidChangeTreeData.event;

  constructor(private stateManager: StateManager, private skillsPath: string) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: WorkflowStep): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: WorkflowStep): Promise<WorkflowStep[]> {
    if (element) {
      return [];
    }

    try {
      const state = await this.stateManager.load();
      if (!state.session.activeSkill) {
        return [new WorkflowStep('No active skill', vscode.TreeItemCollapsibleState.None)];
      }

      const skillFile = path.join(this.skillsPath, state.session.activeSkill, 'SKILL.md');
      
      try {
        const skillContent = await fs.readFile(skillFile, 'utf8');
        const steps = SkillParser.parseSteps(skillContent);

        return steps.map((step, index) => {
          let icon = undefined;

          if (index < state.workflow.stepIndex) {
            icon = new vscode.ThemeIcon('check');
          } else if (index === state.workflow.stepIndex) {
            icon = new vscode.ThemeIcon('play'); 
          } else {
            icon = new vscode.ThemeIcon('circle-outline');
          }

          return new WorkflowStep(
            step.name,
            vscode.TreeItemCollapsibleState.None,
            icon,
            index === state.workflow.stepIndex
          );
        });
      } catch (err) {
         return [new WorkflowStep(`Skill file not found: ${state.session.activeSkill}`, vscode.TreeItemCollapsibleState.None)];
      }
    } catch (e) {
      return [new WorkflowStep('Error loading workflow', vscode.TreeItemCollapsibleState.None)];
    }
  }
}

class WorkflowStep extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly iconPath?: vscode.ThemeIcon,
    public readonly active?: boolean
  ) {
    super(label, collapsibleState);
    this.contextValue = 'step';
    if (active) {
      this.description = '(Active)';
    }
  }
}
