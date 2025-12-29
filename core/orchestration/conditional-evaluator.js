/**
 * Extract conditional agent activation rules from skill content
 * @param {string} content - Skill markdown content
 * @returns {Array<{condition: string, agents: string[]}>}
 */
export function extractConditionalBlocks(content) {
  if (!content || typeof content !== 'string') {
    return [];
  }

  // Pattern: "If working with: condition → agent-name" or "- condition → agent-name"
  // Also supports: "When working with:"
  // Supports multiple agents: "agent1 + agent2"

  const conditionals = [];

  // Match bullet-style patterns: "- condition → agent-name"
  const bulletPattern = /-\s*([^→\n]+)→\s*([a-z0-9-]+(?:\s*\+\s*[a-z0-9-]+)*)/gi;
  let match;

  while ((match = bulletPattern.exec(content)) !== null) {
    const condition = match[1].trim();
    const agentsString = match[2].trim();

    // Split multiple agents by +
    const agents = agentsString
      .split('+')
      .map((a) => a.trim())
      .filter(Boolean);

    conditionals.push({
      condition,
      agents,
    });
  }

  // Also try inline patterns: "If/When working with: condition → agent"
  // Must be on same line (no newlines in condition)
  const inlinePattern =
    /(?:if|when)\s+working\s+with[:\s]+([^→]+)→\s+([a-z0-9-]+(?:\s*\+\s*[a-z0-9-]+)*)/gi;

  while ((match = inlinePattern.exec(content)) !== null) {
    const condition = match[1].trim();
    const agentsString = match[2].trim();

    // Skip if condition contains newline or starts with bullet (matching bullet list by accident)
    if (match[1].includes('\n') || condition.startsWith('-')) continue;

    // Split multiple agents by +
    const agents = agentsString
      .split('+')
      .map((a) => a.trim())
      .filter(Boolean);

    conditionals.push({
      condition,
      agents,
    });
  }

  return conditionals;
}
