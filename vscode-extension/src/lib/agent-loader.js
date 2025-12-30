import fs from 'fs';
import path from 'path';

/**
 * Parse YAML frontmatter from agent markdown file
 * @param {string} content - Markdown content with frontmatter
 * @returns {Object} Parsed frontmatter
 */
export function parseAgentFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]+?)\n---/);
  if (!match) return {};

  const yaml = match[1];
  const result = {};

  // Parse name
  const nameMatch = yaml.match(/^name:\s*(.+)$/m);
  if (nameMatch) {
    result.name = nameMatch[1].trim();
  }

  // Parse expertise array
  const expertiseMatch = yaml.match(/^expertise:\s*\n((?:\s+-\s+.+\n?)+)/m);
  if (expertiseMatch) {
    result.expertise = expertiseMatch[1]
      .split('\n')
      .map((line) => line.replace(/^\s*-\s*/, '').trim())
      .filter(Boolean);
  }

  // Parse activation_keywords array
  const keywordsMatch = yaml.match(/^activation_keywords:\s*\n((?:\s+-\s+.+\n?)+)/m);
  if (keywordsMatch) {
    result.activation_keywords = keywordsMatch[1]
      .split('\n')
      .map((line) => line.replace(/^\s*-\s*/, '').trim())
      .filter(Boolean);
  }

  // Parse complexity_threshold
  const thresholdMatch = yaml.match(/^complexity_threshold:\s*(\w+)$/m);
  if (thresholdMatch) {
    result.complexity_threshold = thresholdMatch[1].trim();
  }

  return result;
}

/**
 * Load all agent definitions from a directory
 * @param {string} agentsDir - Path to agents directory
 * @returns {Array<{name: string, keywords: string[], expertise: string[], threshold: string}>}
 */
export function loadAgentDefinitions(agentsDir) {
  if (!fs.existsSync(agentsDir)) {
    return [];
  }

  const agents = [];
  const files = fs.readdirSync(agentsDir).filter((f) => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(agentsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatter = parseAgentFrontmatter(content);

    agents.push({
      name: frontmatter.name || path.basename(file, '.md'),
      keywords: frontmatter.activation_keywords || [],
      expertise: frontmatter.expertise || [],
      threshold: frontmatter.complexity_threshold || 'medium',
    });
  }

  return agents;
}
