/**
 * End-to-End Tests for Gemini CLI Integration
 *
 * These tests validate the full user workflow with Gemini CLI:
 * - Slash command invocation (/brainstorm, /write-plan, etc.)
 * - Wrapper script execution (gemini-sp)
 * - Extension loading and tool invocation
 *
 * IMPORTANT: These tests are SKIPPED by default as they require:
 * 1. Gemini CLI installed and available in PATH
 * 2. SupremePower extension installed in Gemini CLI
 * 3. Extension properly configured and loaded
 *
 * To run these tests in CI or locally:
 * 1. Install Gemini CLI: npm install -g @google/generative-ai-cli
 * 2. Install extension: gemini extension install supremepower
 * 3. Configure extension in ~/.gemini/config.json
 * 4. Remove .skip from test cases
 * 5. Run: npm test tests/e2e/
 */

import { describe, it, expect } from '@jest/globals';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

describe('Gemini CLI E2E Tests', () => {
  describe('Slash Command Integration', () => {
    it.skip('should invoke brainstorming skill via /brainstorm command', async () => {
      // This test requires Gemini CLI installed and extension loaded
      const { stdout } = await execAsync('echo "/brainstorm build a todo app" | gemini');

      // Verify that brainstorming skill content was injected
      expect(stdout).toContain('brainstorm');
      // Verify Gemini CLI processed the command
      expect(stdout.length).toBeGreaterThan(100);
    }, 30000);

    it.skip('should invoke writing-plans skill via /write-plan command', async () => {
      const { stdout } = await execAsync('echo "/write-plan implement user authentication" | gemini');

      expect(stdout).toContain('plan');
      expect(stdout.length).toBeGreaterThan(100);
    }, 30000);

    it.skip('should invoke executing-plans skill via /execute-plan command', async () => {
      // Create temporary plan file for testing
      const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gemini-e2e-'));
      const planPath = path.join(tempDir, 'test-plan.md');
      await fs.writeFile(planPath, '# Test Plan\n\n## Task 1: Create file\n\nCreate test.txt with content "hello"');

      try {
        const { stdout } = await execAsync(`echo "/execute-plan ${planPath}" | gemini`);

        expect(stdout).toContain('plan');
        expect(stdout.length).toBeGreaterThan(100);
      } finally {
        // Cleanup
        await fs.rm(tempDir, { recursive: true, force: true });
      }
    }, 30000);

    it.skip('should handle invalid slash command gracefully', async () => {
      const { stdout } = await execAsync('echo "/invalid-command test" | gemini');

      // Should return error or help message
      expect(stdout).toBeDefined();
    }, 30000);
  });

  describe('Wrapper Script Integration', () => {
    it.skip('should activate agents via gemini-sp wrapper', async () => {
      // This tests the wrapper script that calls activate_agents MCP tool
      const { stdout } = await execAsync('gemini-sp "build a React component"');

      // Should activate Frontend Architect
      expect(stdout).toContain('Frontend Architect');
      // Should include agent persona information
      expect(stdout).toContain('Role:');
      expect(stdout).toContain('Expertise:');
    }, 30000);

    it.skip('should pass through complex queries to agent activation', async () => {
      const { stdout } = await execAsync(
        'gemini-sp "build a REST API with Node.js, PostgreSQL, and implement JWT authentication"'
      );

      // Should activate multiple relevant agents
      expect(stdout).toContain('Backend Architect');
      expect(stdout).toContain('Database Engineer');
    }, 30000);

    it.skip('should handle empty message gracefully', async () => {
      try {
        await execAsync('gemini-sp ""');
        // Should either succeed with empty response or throw error
      } catch (error) {
        // Expected behavior - wrapper should handle empty input
        expect(error.message).toBeDefined();
      }
    }, 30000);
  });

  describe('MCP Tool Invocation via Gemini CLI', () => {
    it.skip('should invoke get_agent_persona tool', async () => {
      const { stdout } = await execAsync(
        'gemini tool invoke get_agent_persona --agentName "Frontend Architect"'
      );

      expect(stdout).toContain('Frontend Architect');
      expect(stdout).toContain('Role:');
    }, 30000);

    it.skip('should invoke list_skills tool', async () => {
      const { stdout } = await execAsync('gemini tool invoke list_skills');

      expect(stdout).toContain('brainstorming');
      expect(stdout).toContain('writing-plans');
      expect(stdout).toContain('executing-plans');
    }, 30000);

    it.skip('should invoke auto_agent_create tool', async () => {
      const { stdout } = await execAsync(
        'gemini tool invoke auto_agent_create --purpose "GraphQL API development with Apollo"'
      );

      expect(stdout).toContain('GraphQL');
      expect(stdout).toContain('Apollo');
    }, 30000);
  });

  describe('Extension Configuration', () => {
    it.skip('should load extension configuration from ~/.gemini/config.json', async () => {
      const configPath = path.join(os.homedir(), '.gemini', 'config.json');
      const configContent = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configContent);

      // Verify SupremePower extension is configured
      expect(config.extensions).toBeDefined();
      expect(config.extensions).toContain('supremepower');
    });

    it.skip('should use custom agents path if configured', async () => {
      // Test that custom agents are loaded when configured
      const { stdout } = await execAsync('gemini-sp "test custom agents"');

      // Should not fail even if custom path doesn't exist
      expect(stdout).toBeDefined();
    }, 30000);
  });

  describe('Error Handling', () => {
    it.skip('should handle Gemini CLI not installed', async () => {
      // Temporarily rename gemini binary to simulate not installed
      // This is a hypothetical test - actual implementation depends on CI setup
      try {
        const { stdout, stderr } = await execAsync('which gemini');
        expect(stdout).toContain('gemini');
      } catch (error) {
        expect(error.message).toContain('not found');
      }
    });

    it.skip('should handle extension not loaded', async () => {
      // Test behavior when extension is not properly loaded
      const { stdout } = await execAsync('gemini extension list');

      // Should show supremepower in extension list
      expect(stdout).toContain('supremepower');
    }, 30000);

    it.skip('should handle MCP server startup failure gracefully', async () => {
      // Test error handling when MCP server fails to start
      // This would require intentionally breaking the config
      try {
        await execAsync('gemini-sp "test"');
      } catch (error) {
        // Should fail gracefully with error message
        expect(error.message).toBeDefined();
      }
    }, 30000);
  });

  describe('Performance', () => {
    it.skip('should complete agent activation within reasonable time', async () => {
      const startTime = Date.now();

      await execAsync('gemini-sp "build React component"');

      const duration = Date.now() - startTime;
      // Should complete within 10 seconds
      expect(duration).toBeLessThan(10000);
    }, 30000);

    it.skip('should handle concurrent requests', async () => {
      // Test multiple simultaneous invocations
      const promises = [
        execAsync('gemini-sp "test 1"'),
        execAsync('gemini-sp "test 2"'),
        execAsync('gemini-sp "test 3"'),
      ];

      const results = await Promise.all(promises);

      // All should succeed
      results.forEach(result => {
        expect(result.stdout).toBeDefined();
      });
    }, 30000);
  });
});
