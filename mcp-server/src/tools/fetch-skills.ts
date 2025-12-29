import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import os from 'os';
import { loadConfig } from '../lib/config.js';

interface FetchSkillsInput {
  repoUrl: string;
}

/**
 * Handle fetch_skills MCP tool request
 *
 * Clones a git repository to a temporary directory, copies any skills
 * found in the repo to the custom skills path, and cleans up the temp directory.
 *
 * @param args - Tool arguments containing repoUrl
 * @returns MCP tool result with success message and count of skills copied
 */
export async function handleFetchSkills(args: any) {
  const input = args as FetchSkillsInput;
  const config = await loadConfig();

  // Ensure custom skills path is configured
  if (!config.skills.customSkillsPath) {
    return {
      content: [{
        type: 'text' as const,
        text: 'Error: customSkillsPath is not configured',
      }],
    };
  }

  const customSkillsPath = config.skills.customSkillsPath.replace('~', process.env.HOME || '');

  // Create temporary directory for cloning
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fetch-skills-'));

  try {
    // Clone the repository
    try {
      execSync(`git clone --depth 1 "${input.repoUrl}" "${tempDir}"`, {
        stdio: 'pipe',
        timeout: 60000, // 60 second timeout
      });
    } catch (error: any) {
      // Clean up temp directory
      await fs.rm(tempDir, { recursive: true, force: true });

      return {
        content: [{
          type: 'text' as const,
          text: `Error cloning repository: ${error.message}\n\nPlease verify the URL is correct and accessible.`,
        }],
      };
    }

    // Look for skills in common locations
    const possibleSkillsPaths = [
      path.join(tempDir, 'skills'),
      path.join(tempDir, 'core', 'skills'),
      path.join(tempDir, 'src', 'skills'),
    ];

    let skillsSourcePath: string | null = null;
    for (const possiblePath of possibleSkillsPaths) {
      try {
        const stat = await fs.stat(possiblePath);
        if (stat.isDirectory()) {
          skillsSourcePath = possiblePath;
          break;
        }
      } catch (error) {
        // Path doesn't exist, try next one
        continue;
      }
    }

    if (!skillsSourcePath) {
      // Clean up temp directory
      await fs.rm(tempDir, { recursive: true, force: true });

      return {
        content: [{
          type: 'text' as const,
          text: 'Error: No skills directory found in repository.\n\nLooked in: skills/, core/skills/, src/skills/',
        }],
      };
    }

    // Ensure custom skills directory exists
    await fs.mkdir(customSkillsPath, { recursive: true });

    // Copy skills from repo to custom skills path
    const entries = await fs.readdir(skillsSourcePath, { withFileTypes: true });
    let copiedCount = 0;

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const sourcePath = path.join(skillsSourcePath, entry.name);
        const destPath = path.join(customSkillsPath, entry.name);

        // Check if skill has SKILL.md file
        const skillFile = path.join(sourcePath, 'SKILL.md');
        try {
          await fs.access(skillFile);
          // SKILL.md exists, copy the entire directory
          await copyDirectory(sourcePath, destPath);
          copiedCount++;
        } catch (error) {
          // Not a valid skill directory, skip it
          continue;
        }
      }
    }

    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });

    return {
      content: [{
        type: 'text' as const,
        text: `Successfully fetched ${copiedCount} skill${copiedCount !== 1 ? 's' : ''} from ${input.repoUrl}\n\nSkills copied to: ${customSkillsPath}`,
      }],
    };
  } catch (error: any) {
    // Ensure temp directory is cleaned up on any error
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      // Ignore cleanup errors
    }

    return {
      content: [{
        type: 'text' as const,
        text: `Error fetching skills: ${error.message}`,
      }],
    };
  }
}

/**
 * Recursively copy a directory
 */
async function copyDirectory(source: string, destination: string): Promise<void> {
  await fs.mkdir(destination, { recursive: true });

  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destPath);
    } else {
      await fs.copyFile(sourcePath, destPath);
    }
  }
}
