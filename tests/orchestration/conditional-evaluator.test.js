import { describe, it, expect } from '@jest/globals';
import { extractConditionalBlocks } from '../../core/orchestration/conditional-evaluator.js';

describe('extractConditionalBlocks', () => {
  it('extracts simple condition → agent pattern', () => {
    const content = `
      ## Agent Activation

      If working with:
      - authentication → security-engineer
    `;

    const result = extractConditionalBlocks(content);

    expect(result).toHaveLength(1);
    expect(result[0].condition).toBe('authentication');
    expect(result[0].agents).toEqual(['security-engineer']);
  });

  it('extracts multiple agents with + separator', () => {
    const content = `
      If working with:
      - authentication → security-engineer + testing-specialist
    `;

    const result = extractConditionalBlocks(content);

    expect(result[0].agents).toEqual(['security-engineer', 'testing-specialist']);
  });

  it('extracts multiple conditions', () => {
    const content = `
      If working with:
      - authentication → security-engineer
      - database schema → backend-architect + database-specialist
      - UI components → frontend-architect
    `;

    const result = extractConditionalBlocks(content);

    expect(result).toHaveLength(3);
    expect(result[1].condition).toBe('database schema');
    expect(result[1].agents).toHaveLength(2);
  });

  it('handles "when working with" variant', () => {
    const content = 'When working with: authentication → security-engineer';

    const result = extractConditionalBlocks(content);

    expect(result).toHaveLength(1);
  });

  it('handles multiple conditions separated by /', () => {
    const content = 'If working with: auth/authorization/tokens → security-engineer';

    const result = extractConditionalBlocks(content);

    expect(result[0].condition).toBe('auth/authorization/tokens');
  });

  it('returns empty array for no conditionals', () => {
    const content = 'Regular content with no conditional blocks.';

    const result = extractConditionalBlocks(content);

    expect(result).toEqual([]);
  });
});
