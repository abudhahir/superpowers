/**
 * SupremePower Framework - Main Entry Point
 *
 * Universal skills and agent orchestration framework for coding agents.
 * Provides agent activation, skill analysis, and context-aware routing.
 */

// Orchestration - Main Integration
export { analyzeSkillAndActivateAgents } from '../core/orchestration/index.js';

// Orchestration - Individual Components
export { extractContextHints } from '../core/orchestration/context-parser.js';
export { extractConditionalBlocks } from '../core/orchestration/conditional-evaluator.js';
export {
  scoreAndSelectAgents,
  matchesKeywords,
} from '../core/orchestration/agent-matcher.js';

// Agent Loading and Management
export { loadAgentDefinitions, parseAgentFrontmatter } from './agent-loader.js';
