import { ContextGenerator } from '../../../lib/context-generator.js';

describe('ContextGenerator', () => {
  it('should generate delta instructions from state', () => {
    const state = {
      workflow: { currentStep: 'RED_PHASE' },
      agents: { active: ['security-engineer'] }
    };
    const stepInstructions = "Write a failing test.";
    const delta = ContextGenerator.generateDelta(state, stepInstructions);
    expect(delta).toContain('RED_PHASE');
    expect(delta).toContain('security-engineer');
    expect(delta).toContain('Write a failing test.');
  });
});
