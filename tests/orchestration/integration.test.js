import { describe, it, expect } from '@jest/globals';
import { analyzeSkillAndActivateAgents } from '../../core/orchestration/index.js';

describe('analyzeSkillAndActivateAgents', () => {
  const agents = [
    {
      name: 'security-expert',
      keywords: ['security', 'auth', 'encryption'],
    },
    {
      name: 'database-expert',
      keywords: ['database', 'sql', 'query'],
    },
    {
      name: 'frontend-expert',
      keywords: ['frontend', 'ui', 'react'],
    },
  ];

  it('integrates hint extraction and agent scoring', () => {
    const skillContent = `
      This skill requires security expertise for authentication.
      Consider the encryption implications.
    `;
    const userMessage = 'Help me with the task';

    const result = analyzeSkillAndActivateAgents(skillContent, userMessage, agents);

    expect(result.hints.direct).toContain('security');
    expect(result.hints.subtle).toContain('the encryption implications');
    expect(result.activatedAgents).toContain('security-expert');
    expect(result.scores['security-expert']).toBeGreaterThan(8);
  });

  it('processes conditional blocks and activates matching agents', () => {
    const skillContent = `
      If working with:
      - React components → frontend-expert
      - database queries → database-expert
    `;
    const userMessage = 'I need help with React components';

    const result = analyzeSkillAndActivateAgents(skillContent, userMessage, agents);

    expect(result.conditionals).toHaveLength(2);
    expect(result.activatedAgents).toContain('frontend-expert');
    expect(result.scores['frontend-expert']).toBe(20);
  });

  it('combines hints and conditionals for comprehensive scoring', () => {
    const skillContent = `
      This requires database optimization knowledge.
      Consider the query performance.

      If working with:
      - SQL optimization → database-expert
    `;
    const userMessage = 'Help me optimize SQL queries';

    const result = analyzeSkillAndActivateAgents(skillContent, userMessage, agents);

    // Should get points from: direct hint (10), subtle hint (5), conditional (20) = 35
    expect(result.scores['database-expert']).toBe(35);
    expect(result.activatedAgents).toContain('database-expert');
  });

  it('returns empty activatedAgents when no agents meet threshold', () => {
    const skillContent = `
      This is a simple skill with no specific expertise required.
    `;
    const userMessage = 'Help me with a task';

    const result = analyzeSkillAndActivateAgents(skillContent, userMessage, agents);

    expect(result.activatedAgents).toEqual([]);
    expect(result.hints.direct).toEqual([]);
    expect(result.conditionals).toEqual([]);
  });

  it('returns all extracted data including hints, conditionals, and scores', () => {
    const skillContent = `
      Requires frontend architecture knowledge.
      If working with: React → frontend-expert
    `;
    const userMessage = 'Working with React';

    const result = analyzeSkillAndActivateAgents(skillContent, userMessage, agents);

    expect(result).toHaveProperty('activatedAgents');
    expect(result).toHaveProperty('hints');
    expect(result).toHaveProperty('conditionals');
    expect(result).toHaveProperty('scores');
    expect(Array.isArray(result.activatedAgents)).toBe(true);
    expect(typeof result.scores).toBe('object');
  });
});
