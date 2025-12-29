import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { z } from 'zod';

const ConfigSchema = z.object({
  version: z.string(),
  orchestration: z.object({
    agentActivationThreshold: z.number(),
    detectionSensitivity: z.enum(['low', 'medium', 'high']).optional(),
    fallbackToLLM: z.boolean().optional(),
    maxAgentsPerRequest: z.number().optional(),
  }),
  skills: z.object({
    exposureMode: z.enum(['commands', 'prompts', 'both']),
    generateAliases: z.boolean().optional(),
    customSkillsPath: z.string().optional(),
  }),
  agents: z.object({
    customAgentsPath: z.string().optional(),
    personaDetail: z.enum(['full', 'minimal']).optional(),
    autoCreate: z.object({
      enabled: z.boolean(),
      confirmBeforeSave: z.boolean(),
      template: z.string(),
    }).optional(),
  }),
  display: z.object({
    showActivatedAgents: z.boolean(),
    verbose: z.boolean().optional(),
    logPath: z.string().optional(),
  }),
  wrapper: z.object({
    enabled: z.boolean(),
    complexity: z.object({
      minWordCount: z.number(),
      requireKeywords: z.boolean(),
      checkCodeBlocks: z.boolean(),
    }).optional(),
  }),
});

type Config = z.infer<typeof ConfigSchema>;

const DEFAULT_CONFIG: Config = {
  version: '2.0.0',
  orchestration: {
    agentActivationThreshold: 8,
    detectionSensitivity: 'medium',
    fallbackToLLM: true,
    maxAgentsPerRequest: 3,
  },
  skills: {
    exposureMode: 'commands',
    generateAliases: true,
    customSkillsPath: '~/.supremepower/skills',
  },
  agents: {
    customAgentsPath: '~/.supremepower/agents',
    personaDetail: 'full',
    autoCreate: {
      enabled: true,
      confirmBeforeSave: true,
      template: 'standard',
    },
  },
  display: {
    showActivatedAgents: true,
    verbose: false,
    logPath: '~/.supremepower/logs',
  },
  wrapper: {
    enabled: true,
    complexity: {
      minWordCount: 50,
      requireKeywords: true,
      checkCodeBlocks: true,
    },
  },
};

function getConfigPath(): string {
  if (process.env.SUPREMEPOWER_CONFIG_PATH) {
    return path.join(process.env.SUPREMEPOWER_CONFIG_PATH, 'config.json');
  }
  return path.join(os.homedir(), '.supremepower', 'config.json');
}

export async function loadConfig(): Promise<Config> {
  const configPath = getConfigPath();

  try {
    const content = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(content);
    return validateConfig(config);
  } catch (error) {
    // Config doesn't exist, create default
    await saveConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
}

export async function saveConfig(config: Config): Promise<void> {
  validateConfig(config);

  const configPath = getConfigPath();
  const dir = path.dirname(configPath);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
}

export function validateConfig(config: unknown): Config {
  return ConfigSchema.parse(config);
}

export function getDefaultConfig(): Config {
  return { ...DEFAULT_CONFIG };
}
