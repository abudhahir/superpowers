import { describe, it, expect } from '@jest/globals';
import {
  matchesKeywords,
  scoreAndSelectAgents,
} from '../../core/orchestration/agent-matcher.js';

describe('matchesKeywords', () => {
  it('matches keywords case-insensitively', () => {
    const text = 'This involves Security and Authentication work';
    const keywords = ['security', 'auth'];

    const result = matchesKeywords(text, keywords);

    expect(result).toBe(true);
  });

  it('returns false when no keywords match', () => {
    const text = 'This is about frontend development';
    const keywords = ['database', 'backend'];

    const result = matchesKeywords(text, keywords);

    expect(result).toBe(false);
  });

  it('handles empty keywords array', () => {
    const text = 'Some text here';
    const keywords = [];

    const result = matchesKeywords(text, keywords);

    expect(result).toBe(false);
  });

  it('handles partial word matches', () => {
    const text = 'Authentication system';
    const keywords = ['auth'];

    const result = matchesKeywords(text, keywords);

    expect(result).toBe(true);
  });
});

describe('scoreAndSelectAgents', () => {
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

  it('scores agents based on direct hints (10 points each)', () => {
    const hints = {
      direct: ['security expertise', 'authentication flows'],
      subtle: [],
    };
    const conditionals = [];
    const userMessage = 'Please help with the task';

    const result = scoreAndSelectAgents(hints, conditionals, userMessage, agents);

    expect(result.scores['security-expert']).toBe(20); // 2 direct hints * 10
    expect(result.activatedAgents).toContain('security-expert');
  });

  it('scores agents based on subtle hints (5 points each)', () => {
    const hints = {
      direct: [],
      subtle: ['database performance', 'query optimization'],
    };
    const conditionals = [];
    const userMessage = 'Please help with the task';

    const result = scoreAndSelectAgents(hints, conditionals, userMessage, agents);

    expect(result.scores['database-expert']).toBe(10); // 2 subtle hints * 5
    expect(result.activatedAgents).toContain('database-expert');
  });

  it('scores agents based on conditionals (20 points each)', () => {
    const hints = { direct: [], subtle: [] };
    const conditionals = [
      {
        condition: 'Working with React components',
        agents: ['frontend-expert'],
      },
    ];
    const userMessage = 'I need help with React components';

    const result = scoreAndSelectAgents(hints, conditionals, userMessage, agents);

    expect(result.scores['frontend-expert']).toBe(20); // 1 conditional match * 20
    expect(result.activatedAgents).toContain('frontend-expert');
  });

  it('combines all scoring sources correctly', () => {
    const hints = {
      direct: ['security expertise'],
      subtle: ['authentication patterns'],
    };
    const conditionals = [
      {
        condition: 'security implementation',
        agents: ['security-expert'],
      },
    ];
    const userMessage = 'I need to implement security features';

    const result = scoreAndSelectAgents(hints, conditionals, userMessage, agents);

    // 1 direct (10) + 1 subtle (5) + 1 conditional (20) = 35
    expect(result.scores['security-expert']).toBe(35);
    expect(result.activatedAgents).toContain('security-expert');
  });

  it('only activates agents with score > 8', () => {
    const hints = {
      direct: [],
      subtle: ['database'], // Only 5 points
    };
    const conditionals = [];
    const userMessage = 'Please help';

    const result = scoreAndSelectAgents(hints, conditionals, userMessage, agents);

    expect(result.scores['database-expert']).toBe(5);
    expect(result.activatedAgents).not.toContain('database-expert');
  });

  it('returns empty array when no agents meet threshold', () => {
    const hints = { direct: [], subtle: [] };
    const conditionals = [];
    const userMessage = 'Some unrelated message';

    const result = scoreAndSelectAgents(hints, conditionals, userMessage, agents);

    expect(result.activatedAgents).toEqual([]);
  });
});
