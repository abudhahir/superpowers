import { describe, it, expect } from '@jest/globals';
import { loadAgentDefinitions, parseAgentFrontmatter } from '../../lib/agent-loader.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('parseAgentFrontmatter', () => {
  it('extracts name from frontmatter', () => {
    const content = `---
name: security-engineer
---
Content here`;

    const result = parseAgentFrontmatter(content);

    expect(result.name).toBe('security-engineer');
  });

  it('extracts expertise array', () => {
    const content = `---
name: test
expertise:
  - Authentication
  - Cryptography
---
Content`;

    const result = parseAgentFrontmatter(content);

    expect(result.expertise).toEqual(['Authentication', 'Cryptography']);
  });

  it('extracts activation_keywords array', () => {
    const content = `---
activation_keywords:
  - security
  - auth
  - crypto
---
Content`;

    const result = parseAgentFrontmatter(content);

    expect(result.activation_keywords).toEqual(['security', 'auth', 'crypto']);
  });

  it('extracts complexity_threshold', () => {
    const content = `---
complexity_threshold: high
---
Content`;

    const result = parseAgentFrontmatter(content);

    expect(result.complexity_threshold).toBe('high');
  });

  it('returns empty object for no frontmatter', () => {
    const content = 'Just content, no frontmatter';

    const result = parseAgentFrontmatter(content);

    expect(result).toEqual({});
  });
});

describe('loadAgentDefinitions', () => {
  it('loads agents from directory', () => {
    const agentsDir = path.join(__dirname, '../fixtures/agents');

    const agents = loadAgentDefinitions(agentsDir);

    expect(agents.length).toBeGreaterThan(0);
    expect(agents[0]).toHaveProperty('name');
    expect(agents[0]).toHaveProperty('keywords');
    expect(agents[0]).toHaveProperty('expertise');
  });

  it('maps activation_keywords to keywords field', () => {
    const agentsDir = path.join(__dirname, '../fixtures/agents');

    const agents = loadAgentDefinitions(agentsDir);
    const testAgent = agents.find((a) => a.name === 'test-agent');

    expect(testAgent.keywords).toContain('test');
    expect(testAgent.keywords).toContain('testing');
  });

  it('handles missing directory gracefully', () => {
    const agents = loadAgentDefinitions('/nonexistent/path');

    expect(agents).toEqual([]);
  });
});
