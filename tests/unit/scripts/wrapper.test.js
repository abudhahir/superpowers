import { describe, it, expect } from '@jest/globals';

describe('Wrapper Script', () => {
  it('should detect slash commands and pass through', async () => {
    const { shouldOrchestrate } = await import('../../../scripts/wrapper-lib.js');

    expect(shouldOrchestrate('/brainstorm "test"')).toBe(false);
    expect(shouldOrchestrate('/sp:analyze test')).toBe(false);
  });

  it('should detect complex messages', async () => {
    const { shouldOrchestrate } = await import('../../../scripts/wrapper-lib.js');

    const simple = 'hello';
    const complex = 'help me build a React component with TypeScript, performance optimization, and testing with Jest';

    expect(shouldOrchestrate(simple)).toBe(false);
    expect(shouldOrchestrate(complex)).toBe(true);
  });

  it('should build enhanced prompt with agent personas', async () => {
    const { buildEnhancedPrompt } = await import('../../../scripts/wrapper-lib.js');

    const personas = '# Frontend Architect\nExpertise: React, Vue';
    const userMessage = 'help with React';

    const result = buildEnhancedPrompt(personas, userMessage);

    expect(result).toContain('Frontend Architect');
    expect(result).toContain('help with React');
  });
});
