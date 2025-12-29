#!/usr/bin/env node

/**
 * Basic Usage Example - SupremePower Framework
 *
 * Demonstrates how to use the orchestration API to analyze skills
 * and activate appropriate agents based on context hints and conditionals.
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { analyzeSkillAndActivateAgents } from '../lib/index.js';
import { loadAgentDefinitions } from '../lib/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// ============================================================================
// Step 1: Load Agent Definitions
// ============================================================================

console.log('📋 Loading agent definitions...\n');

const agentsDir = join(rootDir, 'core', 'agents');
const agents = loadAgentDefinitions(agentsDir);

console.log(`Loaded ${agents.length} agents:`);
agents.forEach((agent) => {
  console.log(`  - ${agent.name} (${agent.keywords.length} keywords)`);
});
console.log();

// ============================================================================
// Step 2: Load Example Skill Content
// ============================================================================

console.log('📄 Loading skill content...\n');

// Load the brainstorming skill as an example
const skillPath = join(rootDir, 'skills', 'brainstorming', 'SKILL.md');
const skillContent = fs.readFileSync(skillPath, 'utf8');

// Show a preview of the skill
const skillLines = skillContent.split('\n').slice(0, 15);
console.log('Skill preview (first 15 lines):');
console.log('─'.repeat(60));
skillLines.forEach((line) => console.log(line));
console.log('─'.repeat(60));
console.log();

// ============================================================================
// Step 3: Example User Message (Frontend Task)
// ============================================================================

const userMessage =
  'I need to build a React component with state management for a user profile form';

console.log('💬 User message:');
console.log(`   "${userMessage}"\n`);

// ============================================================================
// Step 4: Analyze and Activate Agents
// ============================================================================

console.log('🔍 Analyzing skill and activating agents...\n');

const result = analyzeSkillAndActivateAgents(skillContent, userMessage, agents);

// ============================================================================
// Step 5: Display Results
// ============================================================================

console.log('📊 Analysis Results');
console.log('='.repeat(60));
console.log();

// Show context hints
console.log('Context Hints Detected:');
console.log(`  Direct hints: ${result.hints.direct.length}`);
result.hints.direct.forEach((hint) => {
  console.log(`    • "${hint.substring(0, 60)}..."`);
});
console.log(`  Subtle hints: ${result.hints.subtle.length}`);
result.hints.subtle.forEach((hint) => {
  console.log(`    • "${hint.substring(0, 60)}..."`);
});
console.log();

// Show conditional blocks
console.log(`Conditional Blocks Found: ${result.conditionals.length}`);
result.conditionals.forEach((cond, i) => {
  console.log(`  ${i + 1}. Condition: "${cond.condition.substring(0, 50)}..."`);
  console.log(`     Actions: ${cond.actions.length} action(s)`);
});
console.log();

// Show activated agents with scores
console.log('🎯 Activated Agents:');
if (result.activatedAgents.length === 0) {
  console.log('  (none)');
} else {
  result.activatedAgents.forEach((agentName) => {
    const score = result.scores[agentName] || 0;
    console.log(`  ✓ ${agentName} (score: ${score})`);
  });
}
console.log();

// Show top-scoring agents even if not activated
console.log('📈 Top Agent Scores:');
const sortedScores = Object.entries(result.scores)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5);

sortedScores.forEach(([name, score]) => {
  const isActivated = result.activatedAgents.includes(name);
  const marker = isActivated ? '✓' : ' ';
  console.log(`  ${marker} ${name}: ${score}`);
});
console.log();

console.log('='.repeat(60));
console.log('✅ Analysis complete!\n');

// ============================================================================
// Additional Example: Testing with Different User Messages
// ============================================================================

console.log('🧪 Testing with different user messages...\n');

const testMessages = [
  'Fix a security vulnerability in user authentication',
  'Optimize database queries for better performance',
  'Set up CI/CD pipeline with GitHub Actions',
];

testMessages.forEach((msg, i) => {
  console.log(`Test ${i + 1}: "${msg}"`);
  const testResult = analyzeSkillAndActivateAgents(skillContent, msg, agents);
  console.log(`  Activated: ${testResult.activatedAgents.join(', ') || 'none'}`);
  console.log();
});

console.log('─'.repeat(60));
console.log('💡 This demonstrates how the framework routes tasks to');
console.log('   appropriate agents based on context and keywords.\n');
