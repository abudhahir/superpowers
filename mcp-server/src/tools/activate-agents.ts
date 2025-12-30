// @ts-ignore - JS module without types
import { analyzeSkillAndActivateAgents } from '../../../lib/index.js';
// @ts-ignore - JS module without types
import { loadAgentDefinitions } from '../../../lib/agent-loader.js';
import { loadConfig } from '../lib/config.js';
import { formatPersonas } from '../lib/persona-injector.js';
import { logOrchestration, logError } from '../lib/logger.js';
import path from 'path';

interface ActivateAgentsInput {
  userMessage: string;
  forceAgents?: string[];
}

/**
 * Handle activate_agents MCP tool request
 *
 * This is the core integration between Phase 1 orchestration and Gemini CLI.
 * It loads agents, runs orchestration, and formats personas for injection.
 *
 * @param args - Tool arguments containing userMessage and optional forceAgents
 * @returns MCP tool result with formatted personas text
 */
export async function handleActivateAgents(args: any) {
  const input = args as ActivateAgentsInput;

  try {
    const config = await loadConfig();

    // Load built-in agents from core/agents directory
    const builtInAgentsPath = path.join(process.cwd(), 'core', 'agents');
    const agents = loadAgentDefinitions(builtInAgentsPath);

    // Load custom agents if configured
    if (config.agents.customAgentsPath) {
      const customPath = config.agents.customAgentsPath.replace('~', process.env.HOME || '');
      try {
        const customAgents = loadAgentDefinitions(customPath);
        agents.push(...customAgents);
      } catch (error) {
        // Custom agents directory doesn't exist or is not readable - that's ok
        // Continue with just built-in agents
      }
    }

    let activatedAgentNames: string[];

    if (input.forceAgents && input.forceAgents.length > 0) {
      // Force specific agents - bypass orchestration
      activatedAgentNames = input.forceAgents;
    } else {
      // Run Phase 1 orchestration to automatically select agents
      // Note: In Task 7, we don't have skill content yet (that's Task 8-9)
      // For now, we pass empty skill content and rely on userMessage matching
      const skillContent = '';
      const result = analyzeSkillAndActivateAgents(skillContent, input.userMessage, agents);

      // If no agents were activated from orchestration (because skill content is empty),
      // fall back to direct keyword matching against userMessage
      if (result.activatedAgents.length === 0) {
        const userMessageLower = input.userMessage.toLowerCase();
        activatedAgentNames = agents
          .filter((agent: any) =>
            agent.keywords.some((keyword: string) =>
              userMessageLower.includes(keyword.toLowerCase())
            )
          )
          .map((agent: any) => agent.name);
      } else {
        activatedAgentNames = result.activatedAgents;
      }
    }

    // Get full agent objects for activated agents
    const activatedAgents = agents.filter((a: any) => activatedAgentNames.includes(a.name));

    // Format personas using configured detail level
    const personaDetail = config.agents.personaDetail || 'full';
    const personasText = formatPersonas(activatedAgents, personaDetail);

    // Log orchestration details
    await logOrchestration({
      message: input.userMessage,
      activatedAgents: activatedAgentNames,
      timestamp: new Date().toISOString(),
    });

    // Return MCP tool result
    return {
      content: [{
        type: 'text' as const,
        text: personasText,
      }],
    };
  } catch (error) {
    await logError('Orchestration failed', error as Error);
    throw error;
  }
}
