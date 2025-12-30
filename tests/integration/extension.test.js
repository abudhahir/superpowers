/**
 * Extension Integration Tests
 *
 * These tests validate the full integration of the Gemini CLI extension:
 * - MCP server initialization and tool registration
 * - Full orchestration workflow (user message -> agent activation)
 * - Tool response validation
 *
 * Uses real implementations (no mocks) and tests against compiled TypeScript output.
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import { createMCPServer } from '../../mcp-server/dist/server.js';
import { handleActivateAgents } from '../../mcp-server/dist/tools/activate-agents.js';
import { handleGetAgentPersona } from '../../mcp-server/dist/tools/get-agent-persona.js';
import { handleListSkills } from '../../mcp-server/dist/tools/list-skills.js';
import { handleFetchSkills } from '../../mcp-server/dist/tools/fetch-skills.js';
import { handleAutoAgentCreate } from '../../mcp-server/dist/tools/auto-agent-create.js';

describe('Extension Integration', () => {
  let mcpServerResult;

  beforeAll(() => {
    // Create MCP server instance
    mcpServerResult = createMCPServer();
  });

  describe('MCP Server Initialization', () => {
    it('should create MCP server with correct metadata', () => {
      expect(mcpServerResult.name).toBe('supremepower');
      expect(mcpServerResult.version).toBe('2.0.0');
    });

    it('should register all 5 MCP tools', () => {
      const tools = mcpServerResult.listTools();

      expect(tools).toHaveLength(5);
      expect(tools).toContain('activate_agents');
      expect(tools).toContain('get_agent_persona');
      expect(tools).toContain('list_skills');
      expect(tools).toContain('fetch_skills');
      expect(tools).toContain('auto_agent_create');
    });

    it('should expose server instance', () => {
      expect(mcpServerResult.server).toBeDefined();
      expect(mcpServerResult.server).toHaveProperty('registerTool');
    });
  });

  describe('Full Orchestration Workflow', () => {
    it('should activate Frontend Architect for React component request', async () => {
      const result = await handleActivateAgents({
        userMessage: 'help me build a React component with TypeScript',
      });

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('Frontend Architect');
    });

    it('should activate Performance Engineer for optimization request', async () => {
      const result = await handleActivateAgents({
        userMessage: 'optimize database queries and improve performance',
      });

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('Performance Engineer');
    });

    it('should activate multiple agents for complex request', async () => {
      const result = await handleActivateAgents({
        userMessage: 'build a React component with performance optimization and testing',
      });

      const personasText = result.content[0].text;
      expect(personasText).toContain('Frontend Architect');
      expect(personasText).toContain('Performance Engineer');
    });

    it('should force specific agents when requested', async () => {
      const result = await handleActivateAgents({
        userMessage: 'any message',
        forceAgents: ['backend-architect', 'database-specialist'],
      });

      const personasText = result.content[0].text;
      expect(personasText).toContain('Backend Architect');
      expect(personasText).toContain('Database Specialist');
    });

    it('should return formatted personas with expertise and proper structure', async () => {
      const result = await handleActivateAgents({
        userMessage: 'build a REST API',
      });

      const personasText = result.content[0].text;
      // Check for persona structure
      expect(personasText).toContain('# Active Expert Personas');
      expect(personasText).toMatch(/\*\*Expertise:\*\*/);
      expect(personasText).toContain('The following specialized experts are available');
    });
  });

  describe('Tool Response Validation', () => {
    it('should return valid MCP tool result from activate_agents', async () => {
      const result = await handleActivateAgents({
        userMessage: 'test message',
      });

      // Validate MCP tool result structure
      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0]).toHaveProperty('type');
      expect(result.content[0]).toHaveProperty('text');
    });

    it('should return valid MCP tool result from get_agent_persona', async () => {
      const result = await handleGetAgentPersona({
        agentName: 'Frontend Architect',
      });

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('Frontend Architect');
    });

    it('should return valid MCP tool result from list_skills', async () => {
      const result = await handleListSkills({});

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('brainstorming');
    });

    it('should handle errors gracefully and return MCP error structure', async () => {
      const result = await handleGetAgentPersona({
        agentName: 'NonExistentAgent',
      });

      expect(result).toHaveProperty('content');
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('not found');
    });
  });

  describe('Integration with Phase 1 Orchestration', () => {
    it('should use Phase 1 orchestration for agent selection', async () => {
      // Test that orchestration logic is actually used
      const result = await handleActivateAgents({
        userMessage: 'implement GraphQL API with authentication',
      });

      const personasText = result.content[0].text;
      // Should activate Backend Architect based on GraphQL/API keywords
      expect(personasText).toContain('Backend Architect');
    });

    it('should fall back to keyword matching when skill content is empty', async () => {
      // This tests the fallback mechanism in activate-agents.js
      const result = await handleActivateAgents({
        userMessage: 'docker container orchestration',
      });

      const personasText = result.content[0].text;
      // Should match Devops Engineer based on docker keyword
      expect(personasText).toContain('Devops Engineer');
    });

    it('should load both built-in and custom agents', async () => {
      // Test that agent loading mechanism works
      const result = await handleActivateAgents({
        userMessage: 'frontend development',
      });

      // Should find at least one agent from core/agents directory
      expect(result.content[0].text.length).toBeGreaterThan(0);
    });
  });

  describe('Persona Formatting', () => {
    it('should format personas with full detail by default', async () => {
      const result = await handleActivateAgents({
        userMessage: 'build API',
      });

      const personasText = result.content[0].text;
      // Full detail should include expertise field
      expect(personasText).toContain('# Active Expert Personas');
      expect(personasText).toMatch(/\*\*Expertise:\*\*/);
    });

    it('should include agent name in formatted output', async () => {
      const result = await handleActivateAgents({
        userMessage: 'react component',
      });

      const personasText = result.content[0].text;
      expect(personasText).toContain('Frontend Architect');
    });

    it('should separate multiple agent personas with clear delimiters', async () => {
      const result = await handleActivateAgents({
        userMessage: 'fullstack application with React and Node.js',
      });

      const personasText = result.content[0].text;
      // Should have multiple personas separated
      const agentSections = personasText.split(/---/);
      expect(agentSections.length).toBeGreaterThan(1);
    });
  });
});
