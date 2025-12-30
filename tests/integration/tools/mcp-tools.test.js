/**
 * Integration tests for MCP tools
 *
 * Tests all 4 new MCP tools following TDD methodology:
 * - get_agent_persona
 * - list_skills
 * - fetch_skills
 * - auto_agent_create
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { handleGetAgentPersona } from '../../../mcp-server/dist/tools/get-agent-persona.js';
import { handleListSkills } from '../../../mcp-server/dist/tools/list-skills.js';
import { handleFetchSkills } from '../../../mcp-server/dist/tools/fetch-skills.js';
import { handleAutoAgentCreate } from '../../../mcp-server/dist/tools/auto-agent-create.js';

describe('MCP Tools Integration Tests', () => {
  let tempDir;
  let customAgentsPath;
  let customSkillsPath;

  beforeEach(async () => {
    // Create temporary directories for custom agents and skills
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mcp-test-'));
    customAgentsPath = path.join(tempDir, 'agents');
    customSkillsPath = path.join(tempDir, 'skills');

    await fs.mkdir(customAgentsPath, { recursive: true });
    await fs.mkdir(customSkillsPath, { recursive: true });

    // Set environment variables to override config paths
    process.env.SUPREMEPOWER_CONFIG_PATH = tempDir;

    // Create test config
    const configPath = path.join(tempDir, 'config.json');
    const testConfig = {
      version: '2.0.0',
      orchestration: {
        agentActivationThreshold: 8,
      },
      skills: {
        exposureMode: 'commands',
        customSkillsPath,
      },
      agents: {
        customAgentsPath,
        personaDetail: 'full',
        autoCreate: {
          enabled: true,
          confirmBeforeSave: false,
          template: 'standard',
        },
      },
      display: {
        showActivatedAgents: true,
      },
      wrapper: {
        enabled: true,
      },
    };
    await fs.writeFile(configPath, JSON.stringify(testConfig, null, 2));
  });

  afterEach(async () => {
    // Clean up temporary directory
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
    delete process.env.SUPREMEPOWER_CONFIG_PATH;
  });

  describe('get_agent_persona', () => {
    it('should return full agent persona content for existing agent', async () => {
      // Use built-in agent from core/agents
      const result = await handleGetAgentPersona({
        agentName: 'api-specialist',
      });

      assert.ok(result.content);
      assert.strictEqual(result.content.length, 1);
      assert.strictEqual(result.content[0].type, 'text');

      const text = result.content[0].text;
      assert.ok(text.includes('---'));
      assert.ok(text.includes('name: api-specialist'));
      assert.ok(text.includes('expertise:'));
      assert.ok(text.includes('activation_keywords:'));
    });

    it('should return error message for non-existent agent', async () => {
      const result = await handleGetAgentPersona({
        agentName: 'nonexistent-agent',
      });

      assert.ok(result.content);
      assert.strictEqual(result.content.length, 1);
      assert.strictEqual(result.content[0].type, 'text');
      assert.ok(result.content[0].text.includes('Agent not found'));
    });

    it('should load custom agent from customAgentsPath', async () => {
      // Create a custom agent
      const customAgent = `---
name: custom-test-agent
expertise:
  - Testing
activation_keywords:
  - test
complexity_threshold: low
---

# Custom Test Agent

This is a test agent.
`;
      await fs.writeFile(
        path.join(customAgentsPath, 'custom-test-agent.md'),
        customAgent
      );

      const result = await handleGetAgentPersona({
        agentName: 'custom-test-agent',
      });

      assert.ok(result.content);
      assert.strictEqual(result.content[0].type, 'text');
      assert.ok(result.content[0].text.includes('Custom Test Agent'));
    });
  });

  describe('list_skills', () => {
    it('should return formatted list of all available skills', async () => {
      const result = await handleListSkills({});

      assert.ok(result.content);
      assert.strictEqual(result.content.length, 1);
      assert.strictEqual(result.content[0].type, 'text');

      const text = result.content[0].text;
      // Should include some built-in skills
      assert.ok(text.includes('brainstorming'));
      assert.ok(text.includes('test-driven-development'));
      assert.ok(text.includes('systematic-debugging'));

      // Should be formatted as markdown list
      assert.ok(text.includes('##'));
      assert.ok(text.includes('-'));
    });

    it('should include both built-in and custom skills', async () => {
      // Create a custom skill
      const skillDir = path.join(customSkillsPath, 'custom-skill');
      await fs.mkdir(skillDir, { recursive: true });
      const customSkill = `---
name: custom-skill
description: A custom test skill
---

# Custom Skill

Test content.
`;
      await fs.writeFile(path.join(skillDir, 'SKILL.md'), customSkill);

      const result = await handleListSkills({});

      const text = result.content[0].text;
      assert.ok(text.includes('custom-skill'));
      assert.ok(text.includes('A custom test skill'));
    });

    it('should handle missing or invalid skill frontmatter gracefully', async () => {
      // Create skill with invalid frontmatter
      const skillDir = path.join(customSkillsPath, 'bad-skill');
      await fs.mkdir(skillDir, { recursive: true });
      await fs.writeFile(
        path.join(skillDir, 'SKILL.md'),
        '# No Frontmatter Skill\n\nContent without frontmatter.'
      );

      const result = await handleListSkills({});

      // Should still return successfully, just skip bad skill
      assert.ok(result.content);
      assert.strictEqual(result.content[0].type, 'text');
    });
  });

  describe('fetch_skills', () => {
    it('should clone repo and copy skills to custom path', async () => {
      // This test uses a real git repository for integration testing
      // Using superpowers main repo as it has known skills structure
      const result = await handleFetchSkills({
        repoUrl: 'https://github.com/obra/superpowers.git',
      });

      assert.ok(result.content);
      assert.strictEqual(result.content[0].type, 'text');

      const text = result.content[0].text;
      assert.ok(text.includes('Successfully fetched'));
      assert.ok(text.match(/\d+ skill/)); // Should mention number of skills

      // Verify skills were actually copied
      const skillDirs = await fs.readdir(customSkillsPath);
      assert.ok(skillDirs.length > 0);
    });

    it('should return error for invalid git URL', async () => {
      const result = await handleFetchSkills({
        repoUrl: 'https://invalid-url-that-does-not-exist.com/repo.git',
      });

      assert.ok(result.content);
      const text = result.content[0].text;
      assert.ok(text.includes('Error') || text.includes('Failed'));
    });

    it('should handle repo without skills directory', async () => {
      // Use a repo that doesn't have a skills directory
      const result = await handleFetchSkills({
        repoUrl: 'https://github.com/modelcontextprotocol/quickstart-resources.git',
      });

      assert.ok(result.content);
      const text = result.content[0].text;
      // Should handle gracefully - either error or zero skills
      assert.ok(text.includes('0 skill') || text.includes('No skills') || text.includes('Error'));
    });
  });

  describe('auto_agent_create', () => {
    it('should generate agent from purpose description', async () => {
      const result = await handleAutoAgentCreate({
        purpose: 'Help with Rust development and cargo tooling',
      });

      assert.ok(result.content);
      assert.strictEqual(result.content[0].type, 'text');

      const text = result.content[0].text;
      // Should have YAML frontmatter
      assert.ok(text.includes('---'));
      assert.ok(text.includes('name:'));
      assert.ok(text.includes('expertise:'));
      assert.ok(text.includes('activation_keywords:'));

      // Should include rust-related content
      assert.ok(text.toLowerCase().includes('rust'));
    });

    it('should create kebab-case agent name from purpose', async () => {
      const result = await handleAutoAgentCreate({
        purpose: 'Machine Learning Model Training Expert',
      });

      const text = result.content[0].text;
      // Name should be kebab-case
      assert.ok(text.match(/name: [a-z-]+/));
      // Should not have uppercase or spaces in name
      assert.ok(!text.match(/name: [A-Z ]/));
    });

    it('should extract relevant keywords from purpose', async () => {
      const result = await handleAutoAgentCreate({
        purpose: 'GraphQL API development with Apollo Server',
      });

      const text = result.content[0].text;
      assert.ok(text.includes('activation_keywords:'));
      assert.ok(text.toLowerCase().includes('graphql'));
      assert.ok(text.toLowerCase().includes('apollo'));
    });

    it('should save agent to custom agents path when confirmBeforeSave is false', async () => {
      const result = await handleAutoAgentCreate({
        purpose: 'TypeScript testing with Jest',
      });

      const text = result.content[0].text;

      // Extract agent name from content
      const nameMatch = text.match(/name: ([a-z-]+)/);
      assert.ok(nameMatch);
      const agentName = nameMatch[1];

      // Verify file was created
      const agentPath = path.join(customAgentsPath, `${agentName}.md`);
      const fileExists = await fs.access(agentPath).then(() => true).catch(() => false);
      assert.ok(fileExists, `Agent file should exist at ${agentPath}`);
    });

    it('should set appropriate complexity threshold', async () => {
      const result = await handleAutoAgentCreate({
        purpose: 'Senior database optimization specialist',
      });

      const text = result.content[0].text;
      assert.ok(text.includes('complexity_threshold:'));
      // Should be medium or high based on "Senior" and "specialist"
      assert.ok(text.match(/complexity_threshold: (medium|high)/));
    });
  });
});
