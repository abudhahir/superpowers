import { describe, it, expect } from '@jest/globals';
import { extractContextHints } from '../../core/orchestration/context-parser.js';

describe('extractContextHints', () => {
  describe('direct hints', () => {
    it('extracts "requires X expertise" pattern', () => {
      const content = `
        This task requires security engineering expertise for handling
        authentication flows.
      `;

      const result = extractContextHints(content);

      expect(result.direct).toContain('security engineering');
    });

    it('extracts "needs X knowledge" pattern', () => {
      const content = `
        Implementation needs database optimization knowledge to handle
        the query performance requirements.
      `;

      const result = extractContextHints(content);

      expect(result.direct).toContain('database optimization');
    });

    it('extracts multiple direct hints', () => {
      const content = `
        Requires security expertise for auth.
        Also needs frontend architecture knowledge for the UI.
      `;

      const result = extractContextHints(content);

      expect(result.direct).toHaveLength(2);
      expect(result.direct).toContain('security');
      expect(result.direct).toContain('frontend architecture');
    });

    it('handles "requires X understanding" pattern', () => {
      const content = 'Requires deep understanding of distributed systems.';

      const result = extractContextHints(content);

      expect(result.direct).toContain('deep understanding of distributed systems');
    });
  });

  describe('subtle hints', () => {
    it('extracts "consider X" pattern', () => {
      const content = 'Consider security implications of this approach.';

      const result = extractContextHints(content);

      expect(result.subtle).toContain('security implications of this approach');
    });

    it('extracts "understand X" pattern', () => {
      const content = 'Understand the performance characteristics before proceeding.';

      const result = extractContextHints(content);

      expect(result.subtle).toContain('the performance characteristics before proceeding');
    });

    it('extracts "analyze X" pattern', () => {
      const content = 'Analyze the database query patterns for optimization.';

      const result = extractContextHints(content);

      expect(result.subtle).toContain('the database query patterns for optimization');
    });

    it('handles multiple subtle hints', () => {
      const content = `
        Consider the API design patterns.
        Understand how caching affects consistency.
        Analyze the error handling approach.
      `;

      const result = extractContextHints(content);

      expect(result.subtle.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('edge cases', () => {
    it('returns empty arrays for content with no hints', () => {
      const content = 'This is just regular text with no special patterns.';

      const result = extractContextHints(content);

      expect(result.direct).toEqual([]);
      expect(result.subtle).toEqual([]);
    });

    it('handles empty content', () => {
      const result = extractContextHints('');

      expect(result.direct).toEqual([]);
      expect(result.subtle).toEqual([]);
    });

    it('trims whitespace from extracted hints', () => {
      const content = 'Requires   authentication   expertise   for this.';

      const result = extractContextHints(content);

      expect(result.direct[0]).not.toMatch(/^\s+|\s+$/);
    });
  });
});
