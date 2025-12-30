interface Step {
  name: string;
  context: string[];
}

export class SkillParser {
  static parseSteps(markdown: string): Step[] {
    const steps: Step[] = [];
    const lines = markdown.split('\n');
    let currentStep: Step | null = null;

    for (const line of lines) {
      if (line.trim().startsWith('### ')) {
        if (currentStep) steps.push(currentStep);
        currentStep = { name: line.replace('### ', '').trim(), context: [] };
      } else if (currentStep && line.trim()) {
        currentStep.context.push(line.trim());
      }
    }
    if (currentStep) steps.push(currentStep);
    return steps;
  }
}
