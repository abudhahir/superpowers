export class ContextGenerator {
  static generateDelta(state, stepInstructions) {
    return `
# SupremePower Active State
**Current Phase:** ${state.workflow.currentStep}
**Active Agents:** ${state.agents.active.join(', ')}

## Instructions for Current Step
${stepInstructions}
    `.trim();
  }
}
