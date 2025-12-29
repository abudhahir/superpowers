// @ts-ignore - JS module without types
import { findSkillsInDir } from '../../../lib/skills-core.js';
import { loadConfig } from '../lib/config.js';
import path from 'path';

/**
 * Handle list_skills MCP tool request
 *
 * Lists all available skills from both built-in (core/skills) and custom skills paths.
 * Returns a formatted markdown list with skill names and descriptions.
 *
 * @param args - Tool arguments (empty object, no parameters required)
 * @returns MCP tool result with formatted skills list
 */
export async function handleListSkills(args: any) {
  const config = await loadConfig();

  let allSkills: any[] = [];

  // Load built-in skills from core/skills
  const builtInPath = path.join(process.cwd(), 'core', 'skills');
  const builtInSkills = findSkillsInDir(builtInPath, 'built-in');
  allSkills.push(...builtInSkills);

  // Load custom skills if configured
  if (config.skills.customSkillsPath) {
    const customPath = config.skills.customSkillsPath.replace('~', process.env.HOME || '');
    try {
      const customSkills = findSkillsInDir(customPath, 'custom');
      allSkills.push(...customSkills);
    } catch (error) {
      // Custom skills directory doesn't exist or is not readable - that's ok
      // Continue with just built-in skills
    }
  }

  // Sort skills by name
  allSkills.sort((a, b) => a.name.localeCompare(b.name));

  // Format as markdown
  let markdown = '## Available Skills\n\n';

  if (allSkills.length === 0) {
    markdown += 'No skills found.\n';
  } else {
    // Group by source type
    const builtIn = allSkills.filter(s => s.sourceType === 'built-in');
    const custom = allSkills.filter(s => s.sourceType === 'custom');

    if (builtIn.length > 0) {
      markdown += '### Built-in Skills\n\n';
      for (const skill of builtIn) {
        markdown += `- **${skill.name}**`;
        if (skill.description) {
          markdown += `: ${skill.description}`;
        }
        markdown += '\n';
      }
      markdown += '\n';
    }

    if (custom.length > 0) {
      markdown += '### Custom Skills\n\n';
      for (const skill of custom) {
        markdown += `- **${skill.name}**`;
        if (skill.description) {
          markdown += `: ${skill.description}`;
        }
        markdown += '\n';
      }
      markdown += '\n';
    }
  }

  markdown += `\nTotal: ${allSkills.length} skill${allSkills.length !== 1 ? 's' : ''}\n`;

  return {
    content: [{
      type: 'text' as const,
      text: markdown,
    }],
  };
}
