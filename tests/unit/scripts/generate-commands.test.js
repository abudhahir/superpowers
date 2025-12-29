import { describe, it, expect, beforeAll } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Command Generation', () => {
  beforeAll(async () => {
    // Run the generation script before tests
    const { generateCommands } = await import('../../../scripts/generate-commands.js');
    await generateCommands();
  });

  it('should generate TOML commands for all skills', async () => {
    const commandsDir = path.join(__dirname, '../../../commands/skills');
    const files = fs.readdirSync(commandsDir);

    // Check for some key skills
    expect(files).toContain('brainstorming.toml');
    expect(files).toContain('test-driven-development.toml');
    expect(files).toContain('systematic-debugging.toml');
    expect(files).toContain('writing-plans.toml');
  });

  it('should create valid TOML with skill content', () => {
    const commandFile = path.join(__dirname, '../../../commands/skills/brainstorming.toml');
    const content = fs.readFileSync(commandFile, 'utf8');

    expect(content).toContain('description');
    expect(content).toContain('[[context]]');
    expect(content).toContain('type = "file"');
    expect(content).toContain('path = "skills/brainstorming/SKILL.md"');
  });

  it('should include description from frontmatter', () => {
    const commandFile = path.join(__dirname, '../../../commands/skills/brainstorming.toml');
    const content = fs.readFileSync(commandFile, 'utf8');

    // Should contain the description from the skill's frontmatter
    expect(content).toMatch(/description = ".+"/);
  });

  it('should generate commands for all skills in skills directory', () => {
    const skillsDir = path.join(__dirname, '../../../skills');
    const commandsDir = path.join(__dirname, '../../../commands/skills');

    const skillDirs = fs.readdirSync(skillsDir).filter(f => {
      const skillFile = path.join(skillsDir, f, 'SKILL.md');
      return fs.existsSync(skillFile);
    });

    const commandFiles = fs.readdirSync(commandsDir).filter(f => f.endsWith('.toml'));

    // Should have a TOML file for each skill
    expect(commandFiles.length).toBe(skillDirs.length);
  });
});
