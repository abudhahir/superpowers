import { extractContextHints } from './context-parser.js';
import { extractConditionalBlocks } from './conditional-evaluator.js';
import { scoreAndSelectAgents } from './agent-matcher.js';

/**
 * Analyze skill content and activate appropriate agents
 * @param {string} skillContent - The skill markdown content
 * @param {string} userMessage - User's message/request
 * @param {Array<{name: string, keywords: string[]}>} agents - Available agents
 * @returns {{activatedAgents: string[], hints: {direct: string[], subtle: string[]}, conditionals: Array, scores: Object}}
 */
export function analyzeSkillAndActivateAgents(skillContent, userMessage, agents) {
  // Step 1: Extract context hints
  const hints = extractContextHints(skillContent);

  // Step 2: Extract conditional blocks
  const conditionals = extractConditionalBlocks(skillContent);

  // Step 3: Score and select agents
  const { activatedAgents, scores } = scoreAndSelectAgents(
    hints,
    conditionals,
    userMessage,
    agents
  );

  return {
    activatedAgents,
    hints,
    conditionals,
    scores,
  };
}
