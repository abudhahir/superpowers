import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('activate_agents MCP Tool Integration', () => {
  let testConfigPath;

  beforeEach(() => {
    testConfigPath = path.join(os.tmpdir(), '.supremepower-integration-test');
    process.env.SUPREMEPOWER_CONFIG_PATH = testConfigPath;
  });

  afterEach(() => {
    if (fs.existsSync(testConfigPath)) {
      fs.rmSync(testConfigPath, { recursive: true });
    }
  });

  it('should activate agents automatically for React component with hooks request', async () => {
    const { handleActivateAgents } = await import('../../../mcp-server/dist/tools/activate-agents.js');

    const result = await handleActivateAgents({
      userMessage: 'Create a React component with hooks for user authentication',
    });

    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.content[0].type).toBe('text');

    const text = result.content[0].text;

    // Should contain agent activation information
    expect(text).toContain('Active Expert Personas');

    // Should activate frontend-architect for React/component work
    expect(text.toLowerCase()).toMatch(/frontend|react|component/);
  });

  it('should activate specific agents when forceAgents is provided', async () => {
    const { handleActivateAgents } = await import('../../../mcp-server/dist/tools/activate-agents.js');

    const result = await handleActivateAgents({
      userMessage: 'Help me with something',
      forceAgents: ['backend-architect', 'database-specialist'],
    });

    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.content[0].type).toBe('text');

    const text = result.content[0].text;

    // Should contain both forced agents
    expect(text).toContain('Backend Architect');
    expect(text).toContain('Database Specialist');
  });

  it('should return empty result when no agents are activated', async () => {
    const { handleActivateAgents } = await import('../../../mcp-server/dist/tools/activate-agents.js');

    const result = await handleActivateAgents({
      userMessage: 'simple greeting',
      forceAgents: [],
    });

    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.content[0].type).toBe('text');

    const text = result.content[0].text;
    // Should be empty or minimal when no agents activated
    expect(text.length).toBeLessThan(100);
  });
});
