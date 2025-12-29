/**
 * Extract context hints from skill content
 * @param {string} content - Skill markdown content
 * @returns {{direct: string[], subtle: string[]}}
 */
export function extractContextHints(content) {
  if (!content || typeof content !== 'string') {
    return { direct: [], subtle: [] };
  }

  // Direct hints: "requires X expertise", "needs Y knowledge", "requires Z understanding"
  // For expertise/knowledge: capture text between trigger and keyword
  // For understanding: capture text including "understanding" and beyond until period
  const expertisePattern = /(?:requires?|needs?)\s+([^.]+?)\s+(?:expertise|knowledge)/gi;
  const understandingPattern = /(?:requires?|needs?)\s+((?:[^.]*understanding[^.]*))/gi;

  // Subtle hints: "consider X", "understand Y", "analyze Z"
  // Match until sentence boundary (period, comma, newline)
  const subtlePattern = /(?:consider|understand|analyze)\s+([^.,\n]+)/gi;

  const direct = [];
  const subtle = [];

  // Extract direct hints - expertise/knowledge patterns
  let match;
  while ((match = expertisePattern.exec(content)) !== null) {
    direct.push(match[1].trim());
  }

  // Extract direct hints - understanding pattern
  while ((match = understandingPattern.exec(content)) !== null) {
    direct.push(match[1].trim());
  }

  // Extract subtle hints
  while ((match = subtlePattern.exec(content)) !== null) {
    subtle.push(match[1].trim());
  }

  return { direct, subtle };
}
