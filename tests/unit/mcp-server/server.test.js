import { describe, it, expect, jest } from '@jest/globals';

describe('MCP Server', () => {
  it('should create MCP server with correct name and version', async () => {
    // Dynamic import to avoid loading before test setup
    const { createMCPServer } = await import('../../../mcp-server/dist/server.js');

    const server = createMCPServer();

    expect(server).toBeDefined();
    expect(server.name).toBe('supremepower');
    expect(server.version).toBe('2.0.0');
  });

  it('should register basic tools on initialization', async () => {
    const { createMCPServer } = await import('../../../mcp-server/dist/server.js');

    const server = createMCPServer();
    const tools = server.listTools();

    expect(tools).toContain('activate_agents');
    expect(tools).toContain('get_agent_persona');
    expect(tools).toContain('list_skills');
  });
});
