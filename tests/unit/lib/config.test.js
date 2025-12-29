import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('Configuration Management', () => {
  let testConfigPath;

  beforeEach(() => {
    testConfigPath = path.join(os.tmpdir(), '.supremepower-test');
    process.env.SUPREMEPOWER_CONFIG_PATH = testConfigPath;
  });

  afterEach(() => {
    if (fs.existsSync(testConfigPath)) {
      fs.rmSync(testConfigPath, { recursive: true });
    }
  });

  it('should create default config if none exists', async () => {
    const { loadConfig } = await import('../../../mcp-server/dist/lib/config.js');

    const config = await loadConfig();

    expect(config.version).toBe('2.0.0');
    expect(config.orchestration.agentActivationThreshold).toBe(8);
    expect(config.skills.exposureMode).toBe('commands');
  });

  it('should save and load config correctly', async () => {
    const { loadConfig, saveConfig } = await import('../../../mcp-server/dist/lib/config.js');

    const config = await loadConfig();
    config.orchestration.agentActivationThreshold = 10;

    await saveConfig(config);
    const reloaded = await loadConfig();

    expect(reloaded.orchestration.agentActivationThreshold).toBe(10);
  });

  it('should validate config structure', async () => {
    const { validateConfig } = await import('../../../mcp-server/dist/lib/config.js');

    const validConfig = {
      version: '2.0.0',
      orchestration: { agentActivationThreshold: 8 },
      skills: { exposureMode: 'commands' },
      agents: { personaDetail: 'full' },
      display: { showActivatedAgents: true },
      wrapper: { enabled: true },
    };

    expect(() => validateConfig(validConfig)).not.toThrow();

    const invalidConfig = { version: '1.0.0' };
    expect(() => validateConfig(invalidConfig)).toThrow();
  });
});
