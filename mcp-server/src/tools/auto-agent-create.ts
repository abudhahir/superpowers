import fs from 'fs/promises';
import path from 'path';
import { loadConfig } from '../lib/config.js';

interface AutoAgentCreateInput {
  purpose: string;
}

/**
 * Handle auto_agent_create MCP tool request
 *
 * Generates a new agent based on the purpose description:
 * - Creates kebab-case agent name from purpose
 * - Extracts relevant keywords for activation
 * - Generates agent markdown with YAML frontmatter
 * - Saves to custom agents directory (if confirmBeforeSave is false)
 *
 * @param args - Tool arguments containing purpose description
 * @returns MCP tool result with generated agent content
 */
export async function handleAutoAgentCreate(args: any) {
  const input = args as AutoAgentCreateInput;
  const config = await loadConfig();

  // Generate agent name from purpose (kebab-case)
  const agentName = generateAgentName(input.purpose);

  // Extract keywords from purpose
  const keywords = extractKeywords(input.purpose);

  // Determine complexity threshold based on purpose wording
  const complexityThreshold = determineComplexity(input.purpose);

  // Generate expertise list from purpose
  const expertise = generateExpertise(input.purpose);

  // Create agent content with YAML frontmatter
  const agentContent = `---
name: ${agentName}
expertise:
${expertise.map(e => `  - ${e}`).join('\n')}
activation_keywords:
${keywords.map(k => `  - ${k}`).join('\n')}
complexity_threshold: ${complexityThreshold}
---

# ${capitalizeWords(input.purpose)} Persona

You are a specialized agent focused on ${input.purpose.toLowerCase()}.

## Core Expertise

${expertise.map(e => `**${e}:**\n- [Specific skill or knowledge area]\n- [Specific skill or knowledge area]\n- [Specific skill or knowledge area]`).join('\n\n')}

## Approach

When activated, you should:

1. **Analyze Requirements**: Understand the specific needs related to ${input.purpose.toLowerCase()}
2. **Apply Best Practices**: Leverage industry standards and proven patterns
3. **Provide Guidance**: Offer clear, actionable recommendations
4. **Ensure Quality**: Focus on maintainability, scalability, and performance

## Communication Style

- Clear and concise explanations
- Practical examples and code samples when relevant
- Step-by-step guidance for complex tasks
- Proactive identification of potential issues

## Activation Context

You are activated when the user's request involves:
${keywords.slice(0, 5).map(k => `- ${k}`).join('\n')}

Always verify you understand the requirements before proceeding with implementation.
`;

  // Save agent if configured to do so
  if (config.agents.autoCreate?.enabled && !config.agents.autoCreate?.confirmBeforeSave) {
    if (config.agents.customAgentsPath) {
      const customPath = config.agents.customAgentsPath.replace('~', process.env.HOME || '');
      await fs.mkdir(customPath, { recursive: true });

      const agentPath = path.join(customPath, `${agentName}.md`);
      await fs.writeFile(agentPath, agentContent, 'utf8');
    }
  }

  return {
    content: [{
      type: 'text' as const,
      text: agentContent,
    }],
  };
}

/**
 * Generate kebab-case agent name from purpose description
 */
function generateAgentName(purpose: string): string {
  return purpose
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Extract relevant keywords from purpose for activation
 */
function extractKeywords(purpose: string): string[] {
  const keywords: string[] = [];

  // Split purpose into words and filter out common stop words
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'help', 'development', 'expert',
    'specialist', 'engineer', 'developer', 'architect', 'senior', 'junior',
  ]);

  const words = purpose
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  // Add significant words as keywords
  for (const word of words) {
    if (!keywords.includes(word)) {
      keywords.push(word);
    }
  }

  // Extract common technology names and frameworks (case-sensitive)
  const techPatterns = [
    /\b(React|Vue|Angular|Svelte|Next\.js|Nuxt)\b/g,
    /\b(Node\.js|Express|Fastify|Koa)\b/g,
    /\b(TypeScript|JavaScript|Python|Java|Rust|Go|C\+\+)\b/g,
    /\b(PostgreSQL|MySQL|MongoDB|Redis|DynamoDB)\b/g,
    /\b(Docker|Kubernetes|AWS|GCP|Azure)\b/g,
    /\b(GraphQL|REST|gRPC|WebSocket)\b/g,
    /\b(Jest|Mocha|Cypress|Playwright)\b/g,
    /\b(Webpack|Vite|Rollup|esbuild)\b/g,
  ];

  for (const pattern of techPatterns) {
    const matches = purpose.match(pattern);
    if (matches) {
      for (const match of matches) {
        if (!keywords.includes(match.toLowerCase())) {
          keywords.push(match);
        }
      }
    }
  }

  return keywords.slice(0, 15); // Limit to 15 keywords
}

/**
 * Determine complexity threshold based on purpose wording
 */
function determineComplexity(purpose: string): 'low' | 'medium' | 'high' {
  const lowIndicators = ['basic', 'simple', 'beginner', 'introduction', 'getting started'];
  const highIndicators = ['senior', 'advanced', 'expert', 'architect', 'optimization', 'performance', 'security', 'scale'];

  const lowerPurpose = purpose.toLowerCase();

  for (const indicator of highIndicators) {
    if (lowerPurpose.includes(indicator)) {
      return 'high';
    }
  }

  for (const indicator of lowIndicators) {
    if (lowerPurpose.includes(indicator)) {
      return 'low';
    }
  }

  return 'medium';
}

/**
 * Generate expertise list from purpose
 */
function generateExpertise(purpose: string): string[] {
  const expertise: string[] = [];

  // Extract significant phrases (2-4 words)
  const words = purpose.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    // Try 3-word phrases first
    if (i + 2 < words.length) {
      const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      if (isSignificantPhrase(phrase)) {
        expertise.push(capitalizeWords(phrase));
      }
    }
    // Try 2-word phrases
    if (i + 1 < words.length) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      if (isSignificantPhrase(phrase) && expertise.length < 5) {
        expertise.push(capitalizeWords(phrase));
      }
    }
  }

  // If we didn't extract enough, add individual significant words
  if (expertise.length < 3) {
    const keywords = extractKeywords(purpose);
    for (const keyword of keywords.slice(0, 5 - expertise.length)) {
      expertise.push(capitalizeWords(keyword));
    }
  }

  return expertise.slice(0, 5); // Limit to 5 expertise items
}

/**
 * Check if a phrase is significant (not all stop words)
 */
function isSignificantPhrase(phrase: string): boolean {
  const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with']);
  const words = phrase.toLowerCase().split(/\s+/);
  return words.some(word => !stopWords.has(word) && word.length > 2);
}

/**
 * Capitalize first letter of each word
 */
function capitalizeWords(text: string): string {
  return text
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
