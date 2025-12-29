import { detectComplexity } from '../mcp-server/dist/lib/detection.js';
import { handleActivateAgents } from '../mcp-server/dist/tools/activate-agents.js';

/**
 * Determines whether orchestration should be applied to a command
 *
 * @param {string} command - The user's command or message
 * @returns {boolean} True if orchestration should be applied, false otherwise
 */
export function shouldOrchestrate(command) {
  // Pass through slash commands
  if (command.trim().startsWith('/')) {
    return false;
  }

  // Detect complexity
  const result = detectComplexity(command);
  return result.isComplex;
}

/**
 * Builds an enhanced prompt by prepending agent personas to user message
 *
 * @param {string} personas - Formatted agent personas text
 * @param {string} userMessage - Original user message
 * @returns {string} Enhanced prompt with personas
 */
export function buildEnhancedPrompt(personas, userMessage) {
  if (!personas || personas.trim() === '') {
    return userMessage;
  }

  return `${personas}\n${userMessage}`;
}

/**
 * Orchestrates agent activation and builds enhanced prompt
 *
 * @param {string} userMessage - Original user message
 * @returns {Promise<string>} Enhanced prompt with activated agent personas
 */
export async function orchestrateAndEnhance(userMessage) {
  try {
    const result = await handleActivateAgents({ userMessage });
    const personas = result.content[0].text;
    return buildEnhancedPrompt(personas, userMessage);
  } catch (error) {
    console.error('[gemini-sp] Orchestration failed:', error.message);
    return userMessage; // Fallback to original message
  }
}
