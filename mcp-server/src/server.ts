import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { handleActivateAgents } from './tools/activate-agents.js';
import { handleGetAgentPersona } from './tools/get-agent-persona.js';
import { handleListSkills } from './tools/list-skills.js';
import { handleFetchSkills } from './tools/fetch-skills.js';
import { handleAutoAgentCreate } from './tools/auto-agent-create.js';

export function createMCPServer() {
  const serverInfo = {
    name: 'supremepower',
    version: '2.0.0',
  };

  const server = new McpServer(serverInfo);

  // Register activate_agents tool
  server.registerTool('activate_agents', {
    description: 'Analyze user message and activate appropriate agents',
    inputSchema: z.object({
      userMessage: z.string().describe('The user message to analyze for agent activation'),
      forceAgents: z.array(z.string()).optional().describe('Force specific agents to be activated'),
    }),
  }, handleActivateAgents);

  // Register get_agent_persona tool
  server.registerTool('get_agent_persona', {
    description: 'Get the full persona content for a specific agent',
    inputSchema: z.object({
      agentName: z.string().describe('The name of the agent to retrieve'),
    }),
  }, handleGetAgentPersona);

  // Register list_skills tool
  server.registerTool('list_skills', {
    description: 'List all available skills from built-in and custom sources',
    inputSchema: z.object({}),
  }, handleListSkills);

  // Register fetch_skills tool
  server.registerTool('fetch_skills', {
    description: 'Clone a git repository and copy skills to custom skills directory',
    inputSchema: z.object({
      repoUrl: z.string().url().describe('Git repository URL to fetch skills from'),
    }),
  }, handleFetchSkills);

  // Register auto_agent_create tool
  server.registerTool('auto_agent_create', {
    description: 'Automatically generate a new agent based on purpose description',
    inputSchema: z.object({
      purpose: z.string().describe('Description of the agent purpose (e.g., "GraphQL API development with Apollo")'),
    }),
  }, handleAutoAgentCreate);

  return {
    name: serverInfo.name,
    version: serverInfo.version,
    listTools: () => ['activate_agents', 'get_agent_persona', 'list_skills', 'fetch_skills', 'auto_agent_create'],
    server,
  };
}

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const { server } = createMCPServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
