import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Extract YAML frontmatter from a skill file
 * @param {string} content - The file content
 * @returns {{name: string, description: string}}
 */
function extractFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
  if (!frontmatterMatch) return { name: '', description: '' };

  const frontmatter = frontmatterMatch[1];
  const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
  const descMatch = frontmatter.match(/^description:\s*["']?(.+?)["']?$/m);

  return {
    name: nameMatch ? nameMatch[1].trim() : '',
    description: descMatch ? descMatch[1].trim().replace(/^["']|["']$/g, '') : ''
  };
}

/**
 * Generate TOML command files for all skills
 */
export async function generateCommands() {
  const skillsDir = path.join(__dirname, '..', 'skills');
  const commandsDir = path.join(__dirname, '..', 'commands', 'skills');

  // Ensure commands directory exists
  await fs.mkdir(commandsDir, { recursive: true });

  try {
    const skillDirs = await fs.readdir(skillsDir);
    let generated = 0;
    let skipped = 0;

    for (const skillDir of skillDirs) {
      const skillFile = path.join(skillsDir, skillDir, 'SKILL.md');

      try {
        // Check if SKILL.md exists
        await fs.access(skillFile);
        const content = await fs.readFile(skillFile, 'utf8');

        // Extract frontmatter
        const { name, description } = extractFrontmatter(content);

        if (!name || !description) {
          console.warn(`Skipping ${skillDir}: missing name or description in frontmatter`);
          skipped++;
          continue;
        }

        // Generate TOML command
        const tomlContent = `description = "${description.replace(/"/g, '\\"')}"
prompt = """
I'm using the ${name} skill.

\${input}
"""

[[context]]
type = "file"
path = "skills/${skillDir}/SKILL.md"
`;

        const commandFile = path.join(commandsDir, `${skillDir}.toml`);
        await fs.writeFile(commandFile, tomlContent, 'utf8');
        generated++;
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.error(`Error processing skill ${skillDir}:`, error.message);
        }
        skipped++;
      }
    }

    console.log(`Generated ${generated} command files, skipped ${skipped}`);
  } catch (error) {
    console.error('Error generating commands:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await generateCommands();
  console.log('Commands generated successfully');
}
