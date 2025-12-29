/**
 * Match keywords against text case-insensitively
 * @param {string} text - Text to search in
 * @param {string[]} keywords - Keywords to search for
 * @returns {boolean} True if any keyword matches
 */
export function matchesKeywords(text, keywords) {
  if (!keywords || keywords.length === 0) {
    return false;
  }

  const lowerText = text.toLowerCase();

  return keywords.some((keyword) => {
    const lowerKeyword = keyword.toLowerCase();
    return lowerText.includes(lowerKeyword);
  });
}

/**
 * Score and select agents based on hints, conditionals, and user message
 * @param {{direct: string[], subtle: string[]}} hints - Context hints
 * @param {Array<{condition: string, agents: string[]}>} conditionals - Conditional blocks
 * @param {string} userMessage - User's message
 * @param {Array<{name: string, keywords: string[]}>} agents - Available agents
 * @returns {{activatedAgents: string[], scores: Object}}
 */
export function scoreAndSelectAgents(hints, conditionals, userMessage, agents) {
  const scores = {};

  // Initialize scores to 0
  agents.forEach((agent) => {
    scores[agent.name] = 0;
  });

  // Score based on direct hints (10 points each)
  hints.direct.forEach((hint) => {
    agents.forEach((agent) => {
      if (matchesKeywords(hint, agent.keywords)) {
        scores[agent.name] += 10;
      }
    });
  });

  // Score based on subtle hints (5 points each)
  hints.subtle.forEach((hint) => {
    agents.forEach((agent) => {
      if (matchesKeywords(hint, agent.keywords)) {
        scores[agent.name] += 5;
      }
    });
  });

  // Score based on conditionals (20 points each)
  conditionals.forEach((conditional) => {
    // Check if condition matches user message
    const conditionKeywords = conditional.condition.toLowerCase().split(/\s+/);
    const userMessageLower = userMessage.toLowerCase();

    // Check if any significant words from condition appear in user message
    const hasMatch = conditionKeywords.some((word) => {
      // Skip very short words (like "a", "in", "of", etc.)
      if (word.length <= 2) return false;
      return userMessageLower.includes(word);
    });

    if (hasMatch) {
      // Award points to all agents in this conditional
      conditional.agents.forEach((agentName) => {
        if (scores.hasOwnProperty(agentName)) {
          scores[agentName] += 20;
        }
      });
    }
  });

  // Select agents with score > 8
  const activatedAgents = agents
    .filter((agent) => scores[agent.name] > 8)
    .map((agent) => agent.name);

  return {
    activatedAgents,
    scores,
  };
}
