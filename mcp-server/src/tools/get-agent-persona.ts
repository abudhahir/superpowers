import fs from 'fs/promises';
import path from 'path';
import { loadConfig } from '../lib/config.js';

interface GetAgentPersonaInput {
  agentName: string;
}

/**
 * Handle get_agent_persona MCP tool request
 *
 * Reads and returns the full content of an agent markdown file.
 * Searches in both built-in (core/agents) and custom agents paths.
 *
 * @param args - Tool arguments containing agentName
 * @returns MCP tool result with agent persona content or error message
 */
export async function handleGetAgentPersona(args: any) {
  const input = args as GetAgentPersonaInput;
  const config = await loadConfig();

  // Define search paths: custom agents first (shadowing), then built-in
  const searchPaths: string[] = [];

  // Add custom agents path if configured
  if (config.agents.customAgentsPath) {
    const customPath = config.agents.customAgentsPath.replace('~', process.env.HOME || '');
    searchPaths.push(customPath);
  }

  // Add built-in agents path
  const builtInPath = path.join(process.cwd(), 'core', 'agents');
  searchPaths.push(builtInPath);

  // Try to find and read the agent file
  for (const searchPath of searchPaths) {
    const agentPath = path.join(searchPath, `${input.agentName}.md`);

    try {
      const content = await fs.readFile(agentPath, 'utf8');
      return {
        content: [{
          type: 'text' as const,
          text: content,
        }],
      };
    } catch (error: any) {
      // If file not found, try next path
      if (error.code === 'ENOENT') {
        continue;
      }
      // For other errors (permissions, etc.), throw
      throw error;
    }
  }

  // Agent not found in any search path
  return {
    content: [{
      type: 'text' as const,
      text: `Agent not found: ${input.agentName}\n\nSearched in:\n${searchPaths.map(p => `- ${p}`).join('\n')}`,
    }],
  };
}
