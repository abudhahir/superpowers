import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { handleActivateAgents } from './tools/activate-agents.js';

export function createMCPServer() {
  const serverInfo = {
    name: 'supremepower',
    version: '2.0.0',
  };

  const server = new McpServer(serverInfo);

  // Register activate_agents tool with real implementation
  server.registerTool('activate_agents', {
    description: 'Analyze user message and activate appropriate agents',
  }, handleActivateAgents);

  server.registerTool('get_agent_persona', {
    description: 'Get agent persona details',
  }, async () => ({
    content: [{ type: 'text', text: 'Not implemented' }],
  }));

  server.registerTool('list_skills', {
    description: 'List available skills',
  }, async () => ({
    content: [{ type: 'text', text: 'Not implemented' }],
  }));

  return {
    name: serverInfo.name,
    version: serverInfo.version,
    listTools: () => ['activate_agents', 'get_agent_persona', 'list_skills'],
    server,
  };
}

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const { server } = createMCPServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
