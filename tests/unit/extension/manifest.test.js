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
