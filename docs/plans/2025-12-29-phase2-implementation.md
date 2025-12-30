# Phase 2: Gemini CLI Integration - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans OR superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Integrate SupremePower framework with Gemini CLI through native MCP extension and smart wrapper script.

**Architecture:** Hybrid approach - full-featured Gemini CLI extension using Model Context Protocol (MCP) for explicit workflows, plus optional smart wrapper script for automatic agent activation. Shares Phase 1 orchestration core.

**Tech Stack:** TypeScript, Node.js 18+, MCP SDK (@modelcontextprotocol/sdk), Jest, Zod

---

## Task 1: Initialize Extension Repository Structure

**Files:**
- Create: `gemini-extension.json`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `README.md`

**Step 1: Write test for extension manifest validation**

Create: `tests/unit/extension/manifest.test.js`

```javascript
import { describe, it, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';

describe('Extension Manifest', () => {
  it('gemini-extension.json should exist and be valid JSON', () => {
    const manifestPath = path.join(process.cwd(), 'gemini-extension.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const content = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(content);

    expect(manifest.name).toBe('supremepower');
    expect(manifest.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('should define MCP server configuration', () => {
    const manifestPath = path.join(process.cwd(), 'gemini-extension.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    expect(manifest.mcpServers).toBeDefined();
    expect(manifest.mcpServers.supremepower).toBeDefined();
    expect(manifest.mcpServers.supremepower.command).toBe('node');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/extension/manifest.test.js`
Expected: FAIL with "gemini-extension.json should exist"

**Step 3: Create extension manifest**

Create: `gemini-extension.json`

```json
{
  "name": "supremepower",
  "version": "2.0.0",
  "description": "Universal skills and agent framework for coding agents",
  "author": "SupremePower",
  "mcpServers": {
    "supremepower": {
      "command": "node",
      "args": ["mcp-server/dist/server.js"],
      "cwd": "${extensionPath}",
      "timeout": 5000
    }
  }
}
```

**Step 4: Create package.json**

Create: `package.json`

```json
{
  "name": "supremepower-gemini",
  "version": "2.0.0",
  "description": "SupremePower extension for Gemini CLI",
  "type": "module",
  "main": "mcp-server/dist/server.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "NODE_OPTIONS=--experimental-vm-modules jest",
    "test:watch": "NODE_OPTIONS=--experimental-vm-modules jest --watch",
    "test:coverage": "NODE_OPTIONS=--experimental-vm-modules jest --coverage"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@jest/globals": "^29.7.0",
    "@types/node": "^20.0.0",
    "jest": "^29.7.0",
    "typescript": "^5.3.0"
  }
}
```

**Step 5: Create TypeScript config**

Create: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./mcp-server/dist",
    "rootDir": "./mcp-server/src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true
  },
  "include": ["mcp-server/src/**/*"],
  "exclude": ["node_modules", "tests", "mcp-server/dist"]
}
```

**Step 6: Create .gitignore**

Create: `.gitignore`

```
node_modules/
mcp-server/dist/
*.log
.DS_Store
coverage/
```

**Step 7: Run test to verify it passes**

Run: `npm install && npm test -- tests/unit/extension/manifest.test.js`
Expected: PASS

**Step 8: Commit**

```bash
git add gemini-extension.json package.json tsconfig.json .gitignore tests/
git commit -m "feat: initialize Gemini extension repository structure"
```

---

## Task 2: Set Up MCP Server Skeleton (TDD)

**Files:**
- Create: `mcp-server/src/server.ts`
- Create: `tests/unit/mcp-server/server.test.js`

**Step 1: Write failing test for MCP server initialization**

Create: `tests/unit/mcp-server/server.test.js`

```javascript
import { describe, it, expect, jest } from '@jest/globals';

describe('MCP Server', () => {
  it('should create MCP server with correct name and version', async () => {
    // Dynamic import to avoid loading before test setup
    const { createMCPServer } = await import('../../../mcp-server/dist/server.js');

    const server = createMCPServer();

    expect(server).toBeDefined();
    expect(server.name).toBe('supremepower');
    expect(server.version).toBe('2.0.0');
  });

  it('should register basic tools on initialization', async () => {
    const { createMCPServer } = await import('../../../mcp-server/dist/server.js');

    const server = createMCPServer();
    const tools = server.listTools();

    expect(tools).toContain('activate_agents');
    expect(tools).toContain('get_agent_persona');
    expect(tools).toContain('list_skills');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test -- tests/unit/mcp-server/server.test.js`
Expected: FAIL with "cannot find module"

**Step 3: Create MCP server skeleton**

Create: `mcp-server/src/server.ts`

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

export function createMCPServer() {
  const server = new McpServer({
    name: 'supremepower',
    version: '2.0.0',
  });

  // Register placeholder tools
  server.registerTool('activate_agents', {
    description: 'Activate agents based on user message',
    inputSchema: {},
  }, async () => ({
    content: [{ type: 'text', text: 'Not implemented' }],
  }));

  server.registerTool('get_agent_persona', {
    description: 'Get agent persona details',
    inputSchema: {},
  }, async () => ({
    content: [{ type: 'text', text: 'Not implemented' }],
  }));

  server.registerTool('list_skills', {
    description: 'List available skills',
    inputSchema: {},
  }, async () => ({
    content: [{ type: 'text', text: 'Not implemented' }],
  }));

  return {
    name: server._name,
    version: server._version,
    listTools: () => ['activate_agents', 'get_agent_persona', 'list_skills'],
    server,
  };
}

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const { server } = createMCPServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
```

**Step 4: Run test to verify it passes**

Run: `npm run build && npm test -- tests/unit/mcp-server/server.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add mcp-server/ tests/
npm run build
git add mcp-server/dist/
git commit -m "feat: create MCP server skeleton with placeholder tools"
```

---

## Task 3: Copy Phase 1 Orchestration Core

**Files:**
- Copy: `core/` directory from main branch
- Copy: `lib/` directory (agent-loader, index)

**Step 1: Copy orchestration modules**

```bash
# From main branch
git show main:core/orchestration/context-parser.js > core/orchestration/context-parser.js
git show main:core/orchestration/conditional-evaluator.js > core/orchestration/conditional-evaluator.js
git show main:core/orchestration/agent-matcher.js > core/orchestration/agent-matcher.js
git show main:core/orchestration/index.js > core/orchestration/index.js
```

**Step 2: Copy agents and skills**

```bash
git show main:core/agents/ > core/agents/
git show main:core/skills/ > core/skills/
```

**Step 3: Copy lib modules**

```bash
git show main:lib/agent-loader.js > lib/agent-loader.js
git show main:lib/index.js > lib/index.js
```

**Step 4: Verify Phase 1 tests still pass**

Run: `npm test -- tests/orchestration/ tests/lib/`
Expected: All 44 Phase 1 tests PASS

**Step 5: Commit**

```bash
git add core/ lib/
git commit -m "chore: copy Phase 1 orchestration core and tests"
```

---

## Task 4: Implement Configuration Management (TDD)

**Files:**
- Create: `mcp-server/src/lib/config.ts`
- Create: `tests/unit/lib/config.test.js`

**Step 1: Write failing tests for config**

Create: `tests/unit/lib/config.test.js`

```javascript
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
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test -- tests/unit/lib/config.test.js`
Expected: FAIL with "cannot find module config.js"

**Step 3: Implement config management**

Create: `mcp-server/src/lib/config.ts`

```typescript
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
```

**Step 4: Run test to verify it passes**

Run: `npm run build && npm test -- tests/unit/lib/config.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add mcp-server/src/lib/config.ts tests/unit/lib/config.test.js
npm run build
git commit -m "feat: implement configuration management with validation"
```

---

## Task 5: Implement Complexity Detection Heuristics (TDD)

**Files:**
- Create: `mcp-server/src/lib/detection.ts`
- Create: `tests/unit/lib/detection.test.js`

**Step 1: Write failing tests for detection**

Create: `tests/unit/lib/detection.test.js`

```javascript
import { describe, it, expect } from '@jest/globals';

describe('Complexity Detection', () => {
  it('should detect complex messages based on length', async () => {
    const { detectComplexity } = await import('../../../mcp-server/dist/lib/detection.js');

    const shortMessage = 'hello world';
    const longMessage = 'help me build a React component with state management and hooks '.repeat(5);

    expect(detectComplexity(shortMessage).isComplex).toBe(false);
    expect(detectComplexity(longMessage).isComplex).toBe(true);
    expect(detectComplexity(longMessage).reasons).toContain('length');
  });

  it('should detect technical keywords', async () => {
    const { detectComplexity } = await import('../../../mcp-server/dist/lib/detection.js');

    const message = 'optimize the React component performance';
    const result = detectComplexity(message);

    expect(result.isComplex).toBe(true);
    expect(result.reasons).toContain('keywords');
    expect(result.keywords).toEqual(expect.arrayContaining(['React', 'performance']));
  });

  it('should detect code blocks', async () => {
    const { detectComplexity } = await import('../../../mcp-server/dist/lib/detection.js');

    const messageWithCode = 'Fix this code:\n```js\nfunction test() {}\n```';
    const result = detectComplexity(messageWithCode);

    expect(result.isComplex).toBe(true);
    expect(result.reasons).toContain('code-blocks');
  });

  it('should detect multiple questions', async () => {
    const { detectComplexity } = await import('../../../mcp-server/dist/lib/detection.js');

    const message = 'How do I use React hooks? What about performance? Should I use Redux?';
    const result = detectComplexity(message);

    expect(result.isComplex).toBe(true);
    expect(result.reasons).toContain('multiple-questions');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test -- tests/unit/lib/detection.test.js`
Expected: FAIL

**Step 3: Implement detection logic**

Create: `mcp-server/src/lib/detection.ts`

```typescript
const TECHNICAL_KEYWORDS = [
  'React', 'Vue', 'Angular', 'API', 'REST', 'GraphQL',
  'database', 'SQL', 'MongoDB', 'PostgreSQL',
  'performance', 'optimization', 'benchmark',
  'security', 'authentication', 'encryption',
  'deployment', 'CI/CD', 'Docker', 'Kubernetes',
  'testing', 'TDD', 'debugging',
  'TypeScript', 'JavaScript', 'Python', 'Node.js',
];

export interface ComplexityResult {
  isComplex: boolean;
  reasons: string[];
  keywords: string[];
  score: number;
}

export function detectComplexity(message: string, threshold: number = 3): ComplexityResult {
  const reasons: string[] = [];
  const keywords: string[] = [];
  let score = 0;

  // Check message length
  const wordCount = message.split(/\s+/).length;
  if (wordCount > 50) {
    reasons.push('length');
    score += 2;
  }

  // Check for technical keywords
  const foundKeywords = TECHNICAL_KEYWORDS.filter(keyword =>
    message.toLowerCase().includes(keyword.toLowerCase())
  );
  if (foundKeywords.length > 0) {
    reasons.push('keywords');
    keywords.push(...foundKeywords);
    score += foundKeywords.length;
  }

  // Check for code blocks
  if (/```[\s\S]*```/.test(message) || /`[^`]+`/.test(message)) {
    reasons.push('code-blocks');
    score += 3;
  }

  // Check for multiple questions
  const questionCount = (message.match(/\?/g) || []).length;
  if (questionCount > 1) {
    reasons.push('multiple-questions');
    score += 2;
  }

  // Check for file paths
  if (/\/[\w\-\.\/]+\.(js|ts|py|go|rs|java)/.test(message)) {
    reasons.push('file-paths');
    score += 1;
  }

  return {
    isComplex: score >= threshold,
    reasons,
    keywords,
    score,
  };
}
```

**Step 4: Run test to verify it passes**

Run: `npm run build && npm test -- tests/unit/lib/detection.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add mcp-server/src/lib/detection.ts tests/
npm run build
git commit -m "feat: implement complexity detection with heuristics"
```

---

## Task 6: Implement Persona Injection Formatter (TDD)

**Files:**
- Create: `mcp-server/src/lib/persona-injector.ts`
- Create: `tests/unit/lib/persona-injector.test.js`

**Step 1: Write failing tests**

Create: `tests/unit/lib/persona-injector.test.js`

```javascript
import { describe, it, expect } from '@jest/globals';

describe('Persona Injector', () => {
  const mockAgents = [
    {
      name: 'frontend-architect',
      expertise: ['React', 'Vue', 'State management'],
      principles: ['Component composition', 'Performance-first'],
    },
    {
      name: 'performance-engineer',
      expertise: ['Optimization', 'Profiling'],
      principles: ['Measure first', 'Profile in production'],
    },
  ];

  it('should format single agent persona', async () => {
    const { formatPersonas } = await import('../../../mcp-server/dist/lib/persona-injector.js');

    const result = formatPersonas([mockAgents[0]], 'full');

    expect(result).toContain('# Active Expert Personas');
    expect(result).toContain('## Frontend Architect');
    expect(result).toContain('React');
    expect(result).toContain('Component composition');
  });

  it('should format multiple agent personas', async () => {
    const { formatPersonas } = await import('../../../mcp-server/dist/lib/persona-injector.js');

    const result = formatPersonas(mockAgents, 'full');

    expect(result).toContain('Frontend Architect');
    expect(result).toContain('Performance Engineer');
  });

  it('should support minimal persona detail', async () => {
    const { formatPersonas } = await import('../../../mcp-server/dist/lib/persona-injector.js');

    const full = formatPersonas([mockAgents[0]], 'full');
    const minimal = formatPersonas([mockAgents[0]], 'minimal');

    expect(minimal.length).toBeLessThan(full.length);
    expect(minimal).toContain('Frontend Architect');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test -- tests/unit/lib/persona-injector.test.js`
Expected: FAIL

**Step 3: Implement persona injection**

Create: `mcp-server/src/lib/persona-injector.ts`

```typescript
interface Agent {
  name: string;
  expertise: string[];
  principles?: string[];
  focus?: string;
}

export function formatPersonas(
  agents: Agent[],
  detail: 'full' | 'minimal' = 'full'
): string {
  if (agents.length === 0) {
    return '';
  }

  const sections: string[] = ['# Active Expert Personas', ''];
  sections.push('The following specialized experts are available to assist with this request:');
  sections.push('');

  for (const agent of agents) {
    sections.push(`## ${toTitleCase(agent.name)}`);

    if (detail === 'full') {
      sections.push(`**Expertise:** ${agent.expertise.join(', ')}`);

      if (agent.principles && agent.principles.length > 0) {
        sections.push('**Working Principles:**');
        for (const principle of agent.principles) {
          sections.push(`- ${principle}`);
        }
      }

      if (agent.focus) {
        sections.push(`**Focus areas for this request:** ${agent.focus}`);
      }
    } else {
      // Minimal: just expertise
      sections.push(`Expertise: ${agent.expertise.slice(0, 3).join(', ')}`);
    }

    sections.push('');
  }

  sections.push('---');
  sections.push('');

  return sections.join('\n');
}

function toTitleCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
```

**Step 4: Run test to verify it passes**

Run: `npm run build && npm test -- tests/unit/lib/persona-injector.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add mcp-server/src/lib/persona-injector.ts tests/
npm run build
git commit -m "feat: implement persona injection formatter"
```

---

## Task 7: Implement MCP Tool - activate_agents (TDD)

**Files:**
- Create: `mcp-server/src/tools/activate-agents.ts`
- Modify: `mcp-server/src/server.ts`
- Create: `tests/integration/tools/activate-agents.test.js`

**Step 1: Write failing integration test**

Create: `tests/integration/tools/activate-agents.test.js`

```javascript
import { describe, it, expect } from '@jest/globals';

describe('activate_agents MCP Tool', () => {
  it('should activate agents based on user message', async () => {
    const { handleActivateAgents } = await import('../../../mcp-server/dist/tools/activate-agents.js');

    const result = await handleActivateAgents({
      userMessage: 'help me build a React component with hooks',
    });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('Frontend Architect');
  });

  it('should respect forceAgents parameter', async () => {
    const { handleActivateAgents } = await import('../../../mcp-server/dist/tools/activate-agents.js');

    const result = await handleActivateAgents({
      userMessage: 'any message',
      forceAgents: ['backend-architect', 'database-specialist'],
    });

    expect(result.content[0].text).toContain('Backend Architect');
    expect(result.content[0].text).toContain('Database Specialist');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test -- tests/integration/tools/activate-agents.test.js`
Expected: FAIL

**Step 3: Implement activate_agents handler**

Create: `mcp-server/src/tools/activate-agents.ts`

```typescript
import { analyzeSkillAndActivateAgents } from '../../../lib/index.js';
import { loadAgentDefinitions } from '../../../lib/agent-loader.js';
import { loadConfig } from '../lib/config.js';
import { formatPersonas } from '../lib/persona-injector.js';
import fs from 'fs/promises';
import path from 'path';

interface ActivateAgentsInput {
  userMessage: string;
  forceAgents?: string[];
}

export async function handleActivateAgents(input: ActivateAgentsInput) {
  const config = await loadConfig();

  // Load agents
  const builtInAgentsPath = path.join(process.cwd(), 'core', 'agents');
  const agents = loadAgentDefinitions(builtInAgentsPath);

  // Load custom agents if configured
  if (config.agents.customAgentsPath) {
    const customPath = config.agents.customAgentsPath.replace('~', process.env.HOME || '');
    try {
      const customAgents = loadAgentDefinitions(customPath);
      agents.push(...customAgents);
    } catch (error) {
      // Custom agents directory doesn't exist, that's ok
    }
  }

  let activatedAgentNames: string[];

  if (input.forceAgents && input.forceAgents.length > 0) {
    // Force specific agents
    activatedAgentNames = input.forceAgents;
  } else {
    // Run orchestration
    const skillContent = ''; // TODO: Load active skill if any
    const result = analyzeSkillAndActivateAgents(skillContent, input.userMessage, agents);
    activatedAgentNames = result.activatedAgents;
  }

  // Get full agent objects
  const activatedAgents = agents.filter(a => activatedAgentNames.includes(a.name));

  // Format personas
  const personaDetail = config.agents.personaDetail || 'full';
  const personasText = formatPersonas(activatedAgents, personaDetail);

  return {
    content: [{
      type: 'text',
      text: personasText,
    }],
  };
}
```

**Step 4: Update server.ts to use real handler**

Modify: `mcp-server/src/server.ts`

```typescript
import { handleActivateAgents } from './tools/activate-agents.js';
import { z } from 'zod';

// In createMCPServer():
server.registerTool(
  'activate_agents',
  {
    description: 'Analyze user message and activate appropriate agents',
    inputSchema: z.object({
      userMessage: z.string(),
      forceAgents: z.array(z.string()).optional(),
    }).shape,
  },
  handleActivateAgents
);
```

**Step 5: Run test to verify it passes**

Run: `npm run build && npm test -- tests/integration/tools/activate-agents.test.js`
Expected: PASS

**Step 6: Commit**

```bash
git add mcp-server/src/tools/ mcp-server/src/server.ts tests/
npm run build
git commit -m "feat: implement activate_agents MCP tool with orchestration"
```

---

## Task 8: Implement Remaining MCP Tools (TDD)

**Files:**
- Create: `mcp-server/src/tools/get-agent-persona.ts`
- Create: `mcp-server/src/tools/list-skills.ts`
- Create: `mcp-server/src/tools/fetch-skills.ts`
- Create: `mcp-server/src/tools/auto-agent-create.ts`
- Modify: `mcp-server/src/server.ts`
- Create: `tests/integration/tools/mcp-tools.test.js`

**Step 1: Write failing tests for all tools**

Create: `tests/integration/tools/mcp-tools.test.js`

```javascript
import { describe, it, expect } from '@jest/globals';

describe('get_agent_persona Tool', () => {
  it('should return agent details by name', async () => {
    const { handleGetAgentPersona } = await import('../../../mcp-server/dist/tools/get-agent-persona.js');

    const result = await handleGetAgentPersona({ agentName: 'frontend-architect' });

    expect(result.content[0].text).toContain('Frontend Architect');
    expect(result.content[0].text).toContain('expertise');
  });
});

describe('list_skills Tool', () => {
  it('should list all available skills', async () => {
    const { handleListSkills } = await import('../../../mcp-server/dist/tools/list-skills.js');

    const result = await handleListSkills({});

    expect(result.content[0].text).toContain('brainstorming');
    expect(result.content[0].text).toContain('test-driven-development');
  });
});

describe('fetch_skills Tool', () => {
  it('should fetch skills from remote repository', async () => {
    const { handleFetchSkills } = await import('../../../mcp-server/dist/tools/fetch-skills.js');

    // Mock - actual implementation would clone repo
    const result = await handleFetchSkills({
      repoUrl: 'https://github.com/test/skills'
    });

    expect(result.content[0].text).toContain('Skills fetched');
  });
});

describe('auto_agent_create Tool', () => {
  it('should generate agent definition from purpose', async () => {
    const { handleAutoAgentCreate } = await import('../../../mcp-server/dist/tools/auto-agent-create.js');

    const result = await handleAutoAgentCreate({
      purpose: 'Kubernetes deployment expert'
    });

    expect(result.content[0].text).toContain('kubernetes');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test -- tests/integration/tools/mcp-tools.test.js`
Expected: FAIL with "cannot find module"

**Step 3: Implement get-agent-persona tool**

Create: `mcp-server/src/tools/get-agent-persona.ts`

```typescript
import { loadAgentDefinitions } from '../../../lib/agent-loader.js';
import path from 'path';
import fs from 'fs/promises';

interface GetAgentPersonaInput {
  agentName: string;
}

export async function handleGetAgentPersona(input: GetAgentPersonaInput) {
  const agentsPath = path.join(process.cwd(), 'core', 'agents');
  const agents = loadAgentDefinitions(agentsPath);

  const agent = agents.find(a => a.name === input.agentName);

  if (!agent) {
    return {
      content: [{
        type: 'text',
        text: `Agent "${input.agentName}" not found.`,
      }],
    };
  }

  // Read full agent markdown file
  const agentFile = path.join(agentsPath, `${input.agentName}.md`);
  const content = await fs.readFile(agentFile, 'utf8');

  return {
    content: [{
      type: 'text',
      text: content,
    }],
  };
}
```

**Step 4: Implement list-skills tool**

Create: `mcp-server/src/tools/list-skills.ts`

```typescript
import fs from 'fs/promises';
import path from 'path';

export async function handleListSkills() {
  const skillsPath = path.join(process.cwd(), 'core', 'skills');
  const dirs = await fs.readdir(skillsPath);

  const skills = [];
  for (const dir of dirs) {
    const skillFile = path.join(skillsPath, dir, 'SKILL.md');
    try {
      const content = await fs.readFile(skillFile, 'utf8');
      const nameMatch = content.match(/^name:\s*(.+)$/m);
      const descMatch = content.match(/^description:\s*(.+)$/m);

      skills.push({
        name: nameMatch ? nameMatch[1] : dir,
        description: descMatch ? descMatch[1] : '',
        path: dir,
      });
    } catch (error) {
      // Skip if no SKILL.md
    }
  }

  const output = ['# Available Skills\n'];
  for (const skill of skills) {
    output.push(`## ${skill.name}`);
    output.push(skill.description);
    output.push('');
  }

  return {
    content: [{
      type: 'text',
      text: output.join('\n'),
    }],
  };
}
```

**Step 5: Implement fetch-skills tool**

Create: `mcp-server/src/tools/fetch-skills.ts`

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { loadConfig } from '../lib/config.js';

const execAsync = promisify(exec);

interface FetchSkillsInput {
  repoUrl: string;
}

export async function handleFetchSkills(input: FetchSkillsInput) {
  const config = await loadConfig();
  const customSkillsPath = config.skills.customSkillsPath?.replace('~', process.env.HOME || '');

  if (!customSkillsPath) {
    return {
      content: [{
        type: 'text',
        text: 'Error: customSkillsPath not configured',
      }],
    };
  }

  // Ensure directory exists
  await fs.mkdir(customSkillsPath, { recursive: true });

  // Clone to temporary directory
  const tempDir = path.join(customSkillsPath, '.temp-clone');
  try {
    await execAsync(`git clone ${input.repoUrl} ${tempDir}`);

    // Copy skills to custom path
    const skillsDir = path.join(tempDir, 'skills');
    const skills = await fs.readdir(skillsDir);

    let count = 0;
    for (const skill of skills) {
      const src = path.join(skillsDir, skill);
      const dest = path.join(customSkillsPath, skill);
      await fs.cp(src, dest, { recursive: true });
      count++;
    }

    // Cleanup
    await fs.rm(tempDir, { recursive: true, force: true });

    return {
      content: [{
        type: 'text',
        text: `Skills fetched successfully. ${count} skills installed to ${customSkillsPath}`,
      }],
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error fetching skills: ${error.message}`,
      }],
    };
  }
}
```

**Step 6: Implement auto-agent-create tool**

Create: `mcp-server/src/tools/auto-agent-create.ts`

```typescript
import fs from 'fs/promises';
import path from 'path';
import { loadConfig } from '../lib/config.js';

interface AutoAgentCreateInput {
  purpose: string;
}

export async function handleAutoAgentCreate(input: AutoAgentCreateInput) {
  const config = await loadConfig();

  if (!config.agents.autoCreate?.enabled) {
    return {
      content: [{
        type: 'text',
        text: 'Auto-agent-create is disabled in configuration',
      }],
    };
  }

  // Generate agent name from purpose
  const agentName = input.purpose
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  // Extract keywords from purpose
  const words = input.purpose.toLowerCase().split(/\s+/);
  const keywords = words.filter(w => w.length > 3);

  // Generate agent definition
  const agentContent = `---
name: ${agentName}
expertise:
  - ${input.purpose}
activation_keywords:
${keywords.map(k => `  - ${k}`).join('\n')}
complexity_threshold: medium
---

# ${input.purpose.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}

You are a specialist in ${input.purpose}.

## Core Expertise

[To be filled: Describe specific areas of expertise]

## Working Principles

- Focus on best practices in ${input.purpose}
- Provide clear, actionable guidance
- Consider both immediate and long-term solutions

## When to Activate

This agent should be activated when:
- User asks about ${input.purpose}
- Task involves ${keywords.slice(0, 3).join(', ')}
`;

  // Save to custom agents directory
  const customAgentsPath = config.agents.customAgentsPath?.replace('~', process.env.HOME || '');
  if (!customAgentsPath) {
    return {
      content: [{
        type: 'text',
        text: 'Error: customAgentsPath not configured',
      }],
    };
  }

  await fs.mkdir(customAgentsPath, { recursive: true });
  const agentFile = path.join(customAgentsPath, `${agentName}.md`);
  await fs.writeFile(agentFile, agentContent, 'utf8');

  return {
    content: [{
      type: 'text',
      text: `Agent created: ${agentName}\n\nSaved to: ${agentFile}\n\n${agentContent}`,
    }],
  };
}
```

**Step 7: Register tools in server.ts**

Modify: `mcp-server/src/server.ts`

```typescript
import { handleGetAgentPersona } from './tools/get-agent-persona.js';
import { handleListSkills } from './tools/list-skills.js';
import { handleFetchSkills } from './tools/fetch-skills.js';
import { handleAutoAgentCreate } from './tools/auto-agent-create.js';

// Register all tools
server.registerTool('get_agent_persona', {
  description: 'Get detailed information about a specific agent',
  inputSchema: z.object({ agentName: z.string() }).shape,
}, handleGetAgentPersona);

server.registerTool('list_skills', {
  description: 'List all available skills',
  inputSchema: z.object({}).shape,
}, handleListSkills);

server.registerTool('fetch_skills', {
  description: 'Fetch skills from a remote repository',
  inputSchema: z.object({ repoUrl: z.string() }).shape,
}, handleFetchSkills);

server.registerTool('auto_agent_create', {
  description: 'Generate a custom agent for a specific purpose',
  inputSchema: z.object({ purpose: z.string() }).shape,
}, handleAutoAgentCreate);
```

**Step 8: Run tests to verify they pass**

Run: `npm run build && npm test -- tests/integration/tools/mcp-tools.test.js`
Expected: PASS

**Step 9: Commit**

```bash
git add mcp-server/src/tools/ mcp-server/src/server.ts tests/
npm run build
git commit -m "feat: implement remaining MCP tools (get_agent_persona, list_skills, fetch_skills, auto_agent_create)"
```

---

## Task 9: Generate TOML Slash Commands for Skills

**Files:**
- Create: `commands/` directory structure
- Create: TOML files for each skill
- Create: `scripts/generate-commands.js`

**Step 1: Write test for command generation**

Create: `tests/unit/scripts/generate-commands.test.js`

```javascript
import { describe, it, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';

describe('Command Generation', () => {
  it('should generate TOML commands for all skills', async () => {
    const { generateCommands } = await import('../../../scripts/generate-commands.js');

    await generateCommands();

    const commandsDir = path.join(process.cwd(), 'commands', 'skills');
    const files = fs.readdirSync(commandsDir);

    expect(files).toContain('brainstorming.toml');
    expect(files).toContain('test-driven-development.toml');
  });

  it('should create valid TOML with skill content', async () => {
    const commandFile = path.join(process.cwd(), 'commands', 'skills', 'brainstorming.toml');
    const content = fs.readFileSync(commandFile, 'utf8');

    expect(content).toContain('description');
    expect(content).toContain('[[context]]');
    expect(content).toContain('type = "file"');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/scripts/generate-commands.test.js`
Expected: FAIL

**Step 3: Implement command generation script**

Create: `scripts/generate-commands.js`

```javascript
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function generateCommands() {
  const skillsDir = path.join(__dirname, '..', 'core', 'skills');
  const commandsDir = path.join(__dirname, '..', 'commands', 'skills');

  // Ensure commands directory exists
  await fs.mkdir(commandsDir, { recursive: true });

  const skillDirs = await fs.readdir(skillsDir);

  for (const skillDir of skillDirs) {
    const skillFile = path.join(skillsDir, skillDir, 'SKILL.md');

    try {
      const content = await fs.readFile(skillFile, 'utf8');

      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
      if (!frontmatterMatch) continue;

      const frontmatter = frontmatterMatch[1];
      const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
      const descMatch = frontmatter.match(/^description:\s*(.+)$/m);

      const name = nameMatch ? nameMatch[1].trim() : skillDir;
      const description = descMatch ? descMatch[1].trim() : '';

      // Generate TOML command
      const tomlContent = `description = "${description}"
prompt = """
I'm using the ${name} skill.

\${input}
"""

[[context]]
type = "file"
path = "core/skills/${skillDir}/SKILL.md"
`;

      const commandFile = path.join(commandsDir, `${skillDir}.toml`);
      await fs.writeFile(commandFile, tomlContent, 'utf8');
    } catch (error) {
      console.error(`Error processing skill ${skillDir}:`, error.message);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await generateCommands();
  console.log('Commands generated successfully');
}
```

**Step 4: Run generation script**

Run: `node scripts/generate-commands.js`
Expected: Commands generated in `commands/skills/`

**Step 5: Run test to verify it passes**

Run: `npm test -- tests/unit/scripts/generate-commands.test.js`
Expected: PASS

**Step 6: Add to package.json scripts**

Modify: `package.json`

```json
"scripts": {
  "generate:commands": "node scripts/generate-commands.js"
}
```

**Step 7: Commit**

```bash
git add commands/ scripts/generate-commands.js tests/ package.json
git commit -m "feat: generate TOML slash commands for all skills"
```

---

## Task 10: Create Skill Command Aliases

**Files:**
- Create: `commands/brainstorm.toml`
- Create: `commands/tdd.toml`
- Create: `commands/plan.toml`
- Create: `commands/debug.toml`
- Create: `commands/implement.toml`

**Step 1: Create alias commands**

Create each alias file pointing to the full skill:

`commands/brainstorm.toml`:
```toml
description = "Interactive design exploration (alias for brainstorming)"
prompt = """
I'm using the brainstorming skill to explore this topic.

${input}
"""

[[context]]
type = "file"
path = "core/skills/brainstorming/SKILL.md"
```

`commands/tdd.toml`:
```toml
description = "Test-Driven Development methodology"
prompt = """
I'm using the test-driven-development skill.

${input}
"""

[[context]]
type = "file"
path = "core/skills/test-driven-development/SKILL.md"
```

`commands/plan.toml`:
```toml
description = "Create implementation plan (alias for writing-plans)"
prompt = """
I'm using the writing-plans skill to create the implementation plan.

${input}
"""

[[context]]
type = "file"
path = "core/skills/writing-plans/SKILL.md"
```

`commands/debug.toml`:
```toml
description = "Systematic debugging (alias for systematic-debugging)"
prompt = """
I'm using the systematic-debugging skill.

${input}
"""

[[context]]
type = "file"
path = "core/skills/systematic-debugging/SKILL.md"
```

`commands/implement.toml`:
```toml
description = "Implement with subagents (alias for subagent-driven-development)"
prompt = """
I'm using the subagent-driven-development skill to execute this plan.

${input}
"""

[[context]]
type = "file"
path = "core/skills/subagent-driven-development/SKILL.md"
```

**Step 2: Test aliases exist**

Run: `ls commands/*.toml`
Expected: All alias files present

**Step 3: Commit**

```bash
git add commands/*.toml
git commit -m "feat: add convenient aliases for common skills (/brainstorm, /tdd, /plan, /debug, /implement)"
```

---

## Task 11: Create Management Slash Commands

**Files:**
- Create: `commands/sp/analyze.toml`
- Create: `commands/sp/with.toml`
- Create: `commands/sp/agents.toml`
- Create: `commands/sp/config.toml`
- Create: `commands/sp/status.toml`
- Create: `commands/sp/auto-agent-create.toml`

**Step 1: Create sp: prefixed commands**

Create: `commands/sp/analyze.toml`

```toml
description = "Analyze message to see which agents would activate"
prompt = """
I'll analyze this message to show which agents would be activated:

"${input}"

Let me check the orchestration logic...
"""

# This will call the MCP tool to do dry-run analysis
```

Create: `commands/sp/with.toml`

```toml
description = "Force specific agents for this request"
prompt = """
I'll activate the specified agents for this request.

Agents: ${agents}
Request: ${message}

Calling orchestration with forced agents...
"""
```

Create: `commands/sp/agents.toml`

```toml
description = "List all available agents"
prompt = """
Let me list all available agents with their expertise areas.
"""

# Calls list_skills MCP tool
```

Create: `commands/sp/config.toml`

```toml
description = "View or modify configuration"
prompt = """
Configuration management for SupremePower.

Command: ${command}
Key: ${key}
Value: ${value}

Managing configuration...
"""
```

Create: `commands/sp/status.toml`

```toml
description = "Show orchestration debugging information"
prompt = """
Let me show the last orchestration details for debugging.
"""
```

Create: `commands/sp/auto-agent-create.toml`

```toml
description = "Generate a custom agent for a specific domain"
prompt = """
I'll create a custom agent for: ${purpose}

Generating agent definition...
"""
```

**Step 2: Commit**

```bash
git add commands/sp/
git commit -m "feat: add management slash commands (/sp:analyze, /sp:with, /sp:agents, etc.)"
```

---

## Task 12: Implement Smart Wrapper Script (TDD)

**Files:**
- Create: `scripts/gemini-sp`
- Create: `tests/unit/scripts/wrapper.test.js`

**Step 1: Write tests for wrapper**

Create: `tests/unit/scripts/wrapper.test.js`

```javascript
import { describe, it, expect } from '@jest/globals';

describe('Wrapper Script', () => {
  it('should detect slash commands and pass through', async () => {
    const { shouldOrchestrate } = await import('../../../scripts/wrapper-lib.js');

    expect(shouldOrchestrate('/brainstorm "test"')).toBe(false);
    expect(shouldOrchestrate('/sp:analyze test')).toBe(false);
  });

  it('should detect complex messages', async () => {
    const { shouldOrchestrate } = await import('../../../scripts/wrapper-lib.js');

    const simple = 'hello';
    const complex = 'help me build a React component with state management and hooks';

    expect(shouldOrchestrate(simple)).toBe(false);
    expect(shouldOrchestrate(complex)).toBe(true);
  });

  it('should build enhanced prompt with agent personas', async () => {
    const { buildEnhancedPrompt } = await import('../../../scripts/wrapper-lib.js');

    const personas = '# Frontend Architect\nExpertise: React, Vue';
    const userMessage = 'help with React';

    const result = buildEnhancedPrompt(personas, userMessage);

    expect(result).toContain('Frontend Architect');
    expect(result).toContain('help with React');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/scripts/wrapper.test.js`
Expected: FAIL

**Step 3: Create wrapper library**

Create: `scripts/wrapper-lib.js`

```javascript
import { detectComplexity } from '../mcp-server/dist/lib/detection.js';
import { handleActivateAgents } from '../mcp-server/dist/tools/activate-agents.js';

export function shouldOrchestrate(command) {
  // Pass through slash commands
  if (command.trim().startsWith('/')) {
    return false;
  }

  // Detect complexity
  const result = detectComplexity(command);
  return result.isComplex;
}

export function buildEnhancedPrompt(personas, userMessage) {
  if (!personas || personas.trim() === '') {
    return userMessage;
  }

  return `${personas}\n${userMessage}`;
}

export async function orchestrateAndEnhance(userMessage) {
  try {
    const result = await handleActivateAgents({ userMessage });
    const personas = result.content[0].text;
    return buildEnhancedPrompt(personas, userMessage);
  } catch (error) {
    console.error('[gemini-sp] Orchestration failed:', error.message);
    return userMessage; // Fallback to original message
  }
}
```

**Step 4: Create wrapper script**

Create: `scripts/gemini-sp`

```bash
#!/usr/bin/env bash
set -euo pipefail

# Smart wrapper for Gemini CLI with SupremePower orchestration

USER_MESSAGE="$*"

# Quick check: if slash command, pass through
if [[ "$USER_MESSAGE" =~ ^/ ]]; then
  exec gemini "$@"
fi

# Check complexity and orchestrate if needed
NODE_SCRIPT="
import { orchestrateAndEnhance } from './scripts/wrapper-lib.js';
const enhanced = await orchestrateAndEnhance(process.argv[1]);
console.log(enhanced);
"

ENHANCED_PROMPT=$(node --input-type=module -e "$NODE_SCRIPT" "$USER_MESSAGE" 2>/dev/null)

if [ $? -eq 0 ] && [ -n "$ENHANCED_PROMPT" ]; then
  # Orchestration succeeded, use enhanced prompt
  exec gemini "$ENHANCED_PROMPT"
else
  # Orchestration failed, fallback to original
  echo "[Warning: Agent orchestration failed, continuing without agents]" >&2
  exec gemini "$USER_MESSAGE"
fi
```

**Step 5: Make script executable**

Run: `chmod +x scripts/gemini-sp`

**Step 6: Run tests to verify they pass**

Run: `npm test -- tests/unit/scripts/wrapper.test.js`
Expected: PASS

**Step 7: Commit**

```bash
git add scripts/gemini-sp scripts/wrapper-lib.js tests/
git commit -m "feat: implement smart wrapper script for automatic orchestration"
```

---

## Task 13: Add Logging and Error Handling

**Files:**
- Create: `mcp-server/src/lib/logger.ts`
- Create: `tests/unit/lib/logger.test.js`

**Step 1: Write tests for logger**

Create: `tests/unit/lib/logger.test.js`

```javascript
import { describe, it, expect, beforeEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('Logger', () => {
  let testLogPath;

  beforeEach(() => {
    testLogPath = path.join(os.tmpdir(), '.supremepower-test-logs');
    process.env.SUPREMEPOWER_LOG_PATH = testLogPath;
  });

  it('should write error logs', async () => {
    const { logError } = await import('../../../mcp-server/dist/lib/logger.js');

    await logError('Test error message');

    const errorLog = path.join(testLogPath, 'error.log');
    const content = fs.readFileSync(errorLog, 'utf8');

    expect(content).toContain('Test error message');
  });

  it('should write orchestration logs when verbose', async () => {
    const { logOrchestration } = await import('../../../mcp-server/dist/lib/logger.js');

    await logOrchestration({ message: 'test', agents: ['frontend-architect'] });

    const orchLog = path.join(testLogPath, 'orchestration.log');
    const content = fs.readFileSync(orchLog, 'utf8');

    expect(content).toContain('frontend-architect');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test -- tests/unit/lib/logger.test.js`
Expected: FAIL

**Step 3: Implement logger**

Create: `mcp-server/src/lib/logger.ts`

```typescript
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { loadConfig } from './config.js';

function getLogPath(filename: string): string {
  const logDir = process.env.SUPREMEPOWER_LOG_PATH ||
    path.join(os.homedir(), '.supremepower', 'logs');
  return path.join(logDir, filename);
}

async function ensureLogDir() {
  const logDir = path.dirname(getLogPath('dummy.log'));
  await fs.mkdir(logDir, { recursive: true });
}

export async function logError(message: string, error?: Error) {
  await ensureLogDir();
  const logPath = getLogPath('error.log');

  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n${error?.stack || ''}\n\n`;

  await fs.appendFile(logPath, logEntry, 'utf8');
}

export async function logOrchestration(details: any) {
  const config = await loadConfig();

  if (!config.display.verbose) {
    return; // Only log if verbose mode enabled
  }

  await ensureLogDir();
  const logPath = getLogPath('orchestration.log');

  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${JSON.stringify(details, null, 2)}\n\n`;

  await fs.appendFile(logPath, logEntry, 'utf8');
}

export async function logCrash(error: Error) {
  await ensureLogDir();
  const date = new Date().toISOString().split('T')[0];
  const logPath = getLogPath(`crash-${date}.log`);

  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] CRASH\n${error.stack}\n\n`;

  await fs.appendFile(logPath, logEntry, 'utf8');
}
```

**Step 4: Run test to verify it passes**

Run: `npm run build && npm test -- tests/unit/lib/logger.test.js`
Expected: PASS

**Step 5: Integrate logging into tools**

Modify: `mcp-server/src/tools/activate-agents.ts`

```typescript
import { logOrchestration, logError } from '../lib/logger.js';

// In handleActivateAgents:
try {
  // ... orchestration logic

  await logOrchestration({
    message: input.userMessage,
    activatedAgents: activatedAgentNames,
    timestamp: new Date().toISOString(),
  });

  return result;
} catch (error) {
  await logError('Orchestration failed', error);
  throw error;
}
```

**Step 6: Commit**

```bash
git add mcp-server/src/lib/logger.ts mcp-server/src/tools/ tests/
npm run build
git commit -m "feat: add logging and error handling utilities"
```

---

## Task 14: Create Installation Script

**Files:**
- Create: `scripts/install.sh`
- Modify: `gemini-extension.json` (add postInstall hook)

**Step 1: Create installation script**

Create: `scripts/install.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "=== SupremePower Extension Installation ==="
echo

# Create user directory
SUPREMEPOWER_DIR="$HOME/.supremepower"
echo "Creating SupremePower directory: $SUPREMEPOWER_DIR"
mkdir -p "$SUPREMEPOWER_DIR"/{skills,agents,logs}

# Copy default config if doesn't exist
if [ ! -f "$SUPREMEPOWER_DIR/config.json" ]; then
  echo "Creating default configuration..."
  cat > "$SUPREMEPOWER_DIR/config.json" <<'EOF'
{
  "version": "2.0.0",
  "orchestration": {
    "agentActivationThreshold": 8,
    "detectionSensitivity": "medium",
    "fallbackToLLM": true,
    "maxAgentsPerRequest": 3
  },
  "skills": {
    "exposureMode": "commands",
    "generateAliases": true,
    "customSkillsPath": "~/.supremepower/skills"
  },
  "agents": {
    "customAgentsPath": "~/.supremepower/agents",
    "personaDetail": "full",
    "autoCreate": {
      "enabled": true,
      "confirmBeforeSave": true,
      "template": "standard"
    }
  },
  "display": {
    "showActivatedAgents": true,
    "verbose": false,
    "logPath": "~/.supremepower/logs"
  },
  "wrapper": {
    "enabled": true,
    "complexity": {
      "minWordCount": 50,
      "requireKeywords": true,
      "checkCodeBlocks": true
    }
  }
}
EOF
fi

# Ask about wrapper script installation
echo
echo "Would you like to install the gemini-sp wrapper script for automatic agent activation?"
read -p "(y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  INSTALL_PATH="$HOME/.local/bin"
  mkdir -p "$INSTALL_PATH"

  EXTENSION_PATH="$(pwd)"
  ln -sf "$EXTENSION_PATH/scripts/gemini-sp" "$INSTALL_PATH/gemini-sp"

  echo "Wrapper script installed to: $INSTALL_PATH/gemini-sp"
  echo
  echo "Make sure $INSTALL_PATH is in your PATH:"
  echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
fi

echo
echo "=== Installation Complete ==="
echo
echo "Next steps:"
echo "  1. Restart Gemini CLI to load the extension"
echo "  2. Try: /brainstorm 'test the extension'"
echo "  3. Try: /sp:agents (list available agents)"
echo "  4. Try: gemini-sp 'help me build a React app' (if wrapper installed)"
echo
echo "Documentation: https://github.com/superclaude-org/supremepower-gemini"
```

**Step 2: Make script executable**

Run: `chmod +x scripts/install.sh`

**Step 3: Update extension manifest**

Modify: `gemini-extension.json`

```json
{
  "name": "supremepower",
  "version": "2.0.0",
  "description": "Universal skills and agent framework for coding agents",
  "author": "SupremePower",
  "postInstall": "bash scripts/install.sh",
  "mcpServers": {
    "supremepower": {
      "command": "node",
      "args": ["mcp-server/dist/server.js"],
      "cwd": "${extensionPath}",
      "timeout": 5000
    }
  }
}
```

**Step 4: Commit**

```bash
git add scripts/install.sh gemini-extension.json
git commit -m "feat: add installation script with post-install setup"
```

---

## Task 15: Write Integration and E2E Tests

**Files:**
- Create: `tests/integration/extension.test.js`
- Create: `tests/e2e/gemini-cli.test.js`

**Step 1: Write integration tests**

Create: `tests/integration/extension.test.js`

```javascript
import { describe, it, expect, beforeAll } from '@jest/globals';
import { createMCPServer } from '../../mcp-server/dist/server.js';

describe('Extension Integration', () => {
  let server;

  beforeAll(async () => {
    const result = createMCPServer();
    server = result.server;
  });

  it('should load all MCP tools', () => {
    const tools = server.listTools();

    expect(tools).toContain('activate_agents');
    expect(tools).toContain('get_agent_persona');
    expect(tools).toContain('list_skills');
    expect(tools).toContain('fetch_skills');
    expect(tools).toContain('auto_agent_create');
  });

  it('should handle full orchestration workflow', async () => {
    const { handleActivateAgents } = await import('../../mcp-server/dist/tools/activate-agents.js');

    const result = await handleActivateAgents({
      userMessage: 'help me build a React component with performance optimization',
    });

    expect(result.content[0].text).toContain('Frontend Architect');
    expect(result.content[0].text).toContain('Performance Engineer');
  });
});
```

**Step 2: Write E2E test (manual/CI only)**

Create: `tests/e2e/gemini-cli.test.js`

```javascript
import { describe, it, expect } from '@jest/globals';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('Gemini CLI E2E', () => {
  it.skip('should invoke skill via slash command', async () => {
    // This test requires Gemini CLI installed and extension loaded
    const { stdout } = await execAsync('echo "/brainstorm test" | gemini');

    expect(stdout).toContain('brainstorming');
  }, 30000);

  it.skip('should activate agents via wrapper', async () => {
    const { stdout } = await execAsync('gemini-sp "build a React component"');

    expect(stdout).toContain('Frontend Architect');
  }, 30000);
});
```

**Step 3: Run integration tests**

Run: `npm test -- tests/integration/`
Expected: PASS

**Step 4: Document E2E tests**

Create: `tests/e2e/README.md`

```markdown
# E2E Tests for Gemini CLI Integration

These tests require:
1. Gemini CLI installed
2. SupremePower extension installed
3. Extension loaded in Gemini CLI

Run with: `npm run test:e2e` (configure in CI only)
```

**Step 5: Commit**

```bash
git add tests/integration/ tests/e2e/
git commit -m "test: add integration and E2E tests for extension"
```

---

## Task 16: Create Comprehensive Documentation

**Files:**
- Create: `README.md`
- Create: `docs/installation.md`
- Create: `docs/usage.md`
- Create: `docs/configuration.md`
- Create: `docs/troubleshooting.md`

**Step 1: Create main README**

Create: `README.md`

```markdown
# SupremePower for Gemini CLI

Universal skills and agent framework bringing Superpowers methodology to Gemini CLI.

## Features

- **14 Superpowers Skills** - Brainstorming, TDD, systematic debugging, and more
- **13 Specialized Agents** - Automatic activation based on context
- **Hybrid Workflows** - Explicit slash commands or automatic orchestration
- **Custom Agents** - Create domain-specific agents with `/sp:auto-agent-create`
- **Native Integration** - Uses Gemini CLI's MCP extension system

## Quick Start

### Installation

```bash
gemini extensions install https://github.com/superclaude-org/supremepower-gemini
```

### Usage

**Invoke skills:**
```bash
/brainstorm "Phase 3 features"
/tdd
/plan "authentication system"
```

**Manage agents:**
```bash
/sp:agents                    # List available agents
/sp:analyze "your message"    # Preview agent activation
/sp:with frontend-architect "help with React"  # Force specific agent
```

**Automatic mode:**
```bash
gemini-sp "help me build a React component"
# Agents automatically activated based on complexity
```

## Documentation

- [Installation Guide](docs/installation.md)
- [Usage Guide](docs/usage.md)
- [Configuration Reference](docs/configuration.md)
- [Troubleshooting](docs/troubleshooting.md)

## Skills Available

All 14 Superpowers skills included:
- `/brainstorm` - Interactive design exploration
- `/tdd` - Test-driven development
- `/plan` - Implementation planning
- `/debug` - Systematic debugging
- `/implement` - Subagent-driven development
- And 9 more...

## Agents Available

13 specialized agents:
- Frontend Architect
- Backend Architect
- Performance Engineer
- Security Engineer
- And 9 more...

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT
```

**Step 2: Create installation guide**

Create: `docs/installation.md`

```markdown
# Installation Guide

## Prerequisites

- Gemini CLI installed
- Git installed (for GitHub installation)
- Node.js 18+ (included with Gemini CLI)

## Install from GitHub

```bash
gemini extensions install https://github.com/superclaude-org/supremepower-gemini
```

## Install Specific Version

```bash
gemini extensions install https://github.com/superclaude-org/supremepower-gemini --ref=v2.0.0
```

## Post-Installation

The extension will automatically:
1. Create `~/.supremepower/` directory
2. Copy default configuration
3. Offer to install wrapper script

## Verify Installation

```bash
# In Gemini CLI
/sp:agents
```

Should list all available agents.

## Update Extension

```bash
gemini extensions update supremepower
```

## Uninstall

```bash
gemini extensions uninstall supremepower
# Optional: remove user data
rm -rf ~/.supremepower
```
```

**Step 3: Create usage guide, configuration reference, and troubleshooting**

(Similar detailed markdown files for each)

**Step 4: Commit**

```bash
git add README.md docs/
git commit -m "docs: add comprehensive documentation (README, installation, usage, config, troubleshooting)"
```

---

## Final Steps

After completing all 16 tasks:

**Step 1: Run full test suite**

```bash
npm test
npm run test:coverage
```

**Expected:** All tests passing, >80% coverage

**Step 2: Build for distribution**

```bash
npm run build
```

**Step 3: Create Phase 2 summary document**

Create: `docs/phase2-summary.md` documenting implementation

**Step 4: Final commit and tag**

```bash
git add .
git commit -m "feat: complete Phase 2 Gemini CLI integration"
git tag v2.0.0
```

**Step 5: Push and create PR**

```bash
git push origin feature/phase2-gemini-integration
git push origin v2.0.0
# Create PR for review
```

---

## Execution Options

**Plan complete and saved to `docs/plans/2025-12-29-phase2-implementation.md`.**

**Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
