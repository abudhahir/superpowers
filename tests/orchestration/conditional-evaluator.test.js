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

  // Critical Bug #1: Mixed pattern handling
  it('extracts both bullet and inline patterns together', () => {
    const content = `
      If working with: authentication → security-engineer

      Additional rules:
      - database → database-specialist
    `;

    const result = extractConditionalBlocks(content);

    expect(result).toHaveLength(2);
    expect(result[0].condition).toBe('database');
    expect(result[0].agents).toEqual(['database-specialist']);
    expect(result[1].condition).toBe('authentication');
    expect(result[1].agents).toEqual(['security-engineer']);
  });

  // Critical Bug #2: Numeric agent names
  it('supports numeric characters in agent names', () => {
    const content = `
      If working with:
      - authentication → security-engineer-v2
      - testing → test-agent1 + test-agent2
    `;

    const result = extractConditionalBlocks(content);

    expect(result).toHaveLength(2);
    expect(result[0].condition).toBe('authentication');
    expect(result[0].agents).toEqual(['security-engineer-v2']);
    expect(result[1].condition).toBe('testing');
    expect(result[1].agents).toEqual(['test-agent1', 'test-agent2']);
  });

  // Edge case: null/undefined input validation
  it('handles null and undefined input gracefully', () => {
    expect(extractConditionalBlocks(null)).toEqual([]);
    expect(extractConditionalBlocks(undefined)).toEqual([]);
    expect(extractConditionalBlocks('')).toEqual([]);
  });

  // Edge case: numeric characters in inline patterns
  it('supports numeric characters in inline pattern agent names', () => {
    const content = 'When working with: database v2 → backend-architect-v2 + db-specialist-1';

    const result = extractConditionalBlocks(content);

    expect(result).toHaveLength(1);
    expect(result[0].agents).toEqual(['backend-architect-v2', 'db-specialist-1']);
  });
});
