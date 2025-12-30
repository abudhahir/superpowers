import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

describe('Logger', () => {
  let testLogPath;

  beforeEach(() => {
    testLogPath = path.join(os.tmpdir(), '.supremepower-test-logs');
    process.env.SUPREMEPOWER_LOG_PATH = testLogPath;
  });

  afterEach(async () => {
    try {
      await fs.rm(testLogPath, { recursive: true });
    } catch (error) {
      // Ignore if directory doesn't exist
    }
    delete process.env.SUPREMEPOWER_LOG_PATH;
  });

  it('should write error logs', async () => {
    const { logError } = await import('../../../mcp-server/dist/lib/logger.js');

    await logError('Test error message');

    const errorLog = path.join(testLogPath, 'logs', 'error.log');
    const content = await fs.readFile(errorLog, 'utf8');

    expect(content).toContain('Test error message');
  });

  it('should write orchestration logs when verbose', async () => {
    // Create a config with verbose enabled
    const configPath = path.join(testLogPath, 'config.json');
    const configDir = path.dirname(configPath);

    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(configPath, JSON.stringify({
      version: '2.0.0',
      orchestration: { agentActivationThreshold: 8 },
      skills: { exposureMode: 'commands' },
      agents: {},
      display: { showActivatedAgents: true, verbose: true },
      wrapper: { enabled: true }
    }), 'utf8');

    process.env.SUPREMEPOWER_CONFIG_PATH = testLogPath;

    const { logOrchestration } = await import('../../../mcp-server/dist/lib/logger.js');

    await logOrchestration({ message: 'test', agents: ['frontend-architect'] });

    const orchLog = path.join(testLogPath, 'logs', 'orchestration.log');
    const content = await fs.readFile(orchLog, 'utf8');

    expect(content).toContain('frontend-architect');
  });

  it('should not write orchestration logs when verbose is false', async () => {
    // Create a config with verbose disabled
    const configPath = path.join(testLogPath, 'config.json');
    const configDir = path.dirname(configPath);

    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(configPath, JSON.stringify({
      version: '2.0.0',
      orchestration: { agentActivationThreshold: 8 },
      skills: { exposureMode: 'commands' },
      agents: {},
      display: { showActivatedAgents: true, verbose: false },
      wrapper: { enabled: true }
    }), 'utf8');

    process.env.SUPREMEPOWER_CONFIG_PATH = testLogPath;

    const { logOrchestration } = await import('../../../mcp-server/dist/lib/logger.js');

    await logOrchestration({ message: 'test', agents: ['frontend-architect'] });

    const orchLog = path.join(testLogPath, 'logs', 'orchestration.log');

    // File should not exist
    await expect(fs.access(orchLog)).rejects.toThrow();
  });

  it('should write crash logs with date in filename', async () => {
    const { logCrash } = await import('../../../mcp-server/dist/lib/logger.js');

    const testError = new Error('Test crash');
    await logCrash(testError);

    const date = new Date().toISOString().split('T')[0];
    const crashLog = path.join(testLogPath, 'logs', `crash-${date}.log`);
    const content = await fs.readFile(crashLog, 'utf8');

    expect(content).toContain('CRASH');
    expect(content).toContain('Test crash');
  });
});
