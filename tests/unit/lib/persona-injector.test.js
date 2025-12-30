import { describe, it, expect } from '@jest/globals';

describe('Persona Injector', () => {
  const mockAgents = [
    {
      name: 'frontend-architect',
      expertise: ['React', 'Vue', 'State management'],
      principles: ['Component composition', 'Performance-first'],
    },
    {
      name: 'performance-engineer',
      expertise: ['Optimization', 'Profiling'],
      principles: ['Measure first', 'Profile in production'],
    },
  ];

  it('should format single agent persona', async () => {
    const { formatPersonas } = await import('../../../mcp-server/dist/lib/persona-injector.js');

    const result = formatPersonas([mockAgents[0]], 'full');

    expect(result).toContain('# Active Expert Personas');
    expect(result).toContain('## Frontend Architect');
    expect(result).toContain('React');
    expect(result).toContain('Component composition');
  });

  it('should format multiple agent personas', async () => {
    const { formatPersonas } = await import('../../../mcp-server/dist/lib/persona-injector.js');

    const result = formatPersonas(mockAgents, 'full');

    expect(result).toContain('Frontend Architect');
    expect(result).toContain('Performance Engineer');
  });

  it('should support minimal persona detail', async () => {
    const { formatPersonas } = await import('../../../mcp-server/dist/lib/persona-injector.js');

    const full = formatPersonas([mockAgents[0]], 'full');
    const minimal = formatPersonas([mockAgents[0]], 'minimal');

    expect(minimal.length).toBeLessThan(full.length);
    expect(minimal).toContain('Frontend Architect');
  });
});
