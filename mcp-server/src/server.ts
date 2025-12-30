import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { handleActivateAgents } from './tools/activate-agents.js';
import { handleGetAgentPersona } from './tools/get-agent-persona.js';
import { handleListSkills } from './tools/list-skills.js';
import { handleFetchSkills } from './tools/fetch-skills.js';
import { handleAutoAgentCreate } from './tools/auto-agent-create.js';
import { handleNextStep } from './tools/next-step.js';

export function createMCPServer() {
  const serverInfo = {
    name: 'supremepower',
    version: '2.0.0',
  };

  const server = new McpServer(serverInfo);

  // Register activate_agents tool
  server.registerTool('activate_agents', {
    description: 'Analyze user message and activate appropriate agents',
  }, handleActivateAgents);

  // Register get_agent_persona tool
  server.registerTool('get_agent_persona', {
    description: 'Get the full persona content for a specific agent',
  }, handleGetAgentPersona);

  // Register list_skills tool
  server.registerTool('list_skills', {
    description: 'List all available skills from built-in and custom sources',
  }, handleListSkills);

  // Register fetch_skills tool
  server.registerTool('fetch_skills', {
    description: 'Clone a git repository and copy skills to custom skills directory',
  }, handleFetchSkills);

  // Register auto_agent_create tool
  server.registerTool('auto_agent_create', {
    description: 'Automatically generate a new agent based on purpose description',
  }, handleAutoAgentCreate);

  // Register next_step tool
  server.registerTool('next_step', {
    description: 'Advance to the next step in the active workflow',
  }, handleNextStep);

  return {
    name: serverInfo.name,
    version: serverInfo.version,
    listTools: () => ['activate_agents', 'get_agent_persona', 'list_skills', 'fetch_skills', 'auto_agent_create', 'next_step'],
    server,
  };
}

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const { server } = createMCPServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
