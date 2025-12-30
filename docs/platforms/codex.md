# SupremePower for Codex

Complete guide to using SupremePower with OpenAI Codex through CLI tools.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Using Skills](#using-skills)
- [Using Agents](#using-agents)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Extending](#extending)
- [Troubleshooting](#troubleshooting)
- [Integration Tips](#integration-tips)
- [Getting Help](#getting-help)

## Installation

### Prerequisites

- OpenAI Codex access
- Node.js 14+ (for CLI tool)
- Git (for installation)
- Shell access (bash, zsh, etc.)

### Quick Install

Tell Codex:

```
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.codex/INSTALL.md
```

### Manual Installation

#### Step 1: Clone Repository

```bash
mkdir -p ~/.codex/superpowers
git clone https://github.com/obra/superpowers.git ~/.codex/superpowers
```

#### Step 2: Create Personal Skills Directory

```bash
mkdir -p ~/.codex/skills
```

#### Step 3: Update AGENTS.md

Add to `~/.codex/AGENTS.md`:

```markdown
## Superpowers System

<EXTREMELY_IMPORTANT>
You have superpowers. Superpowers teach you new skills and capabilities. RIGHT NOW run: `~/.codex/superpowers/.codex/superpowers-codex bootstrap` and follow the instructions it returns.
</EXTREMELY_IMPORTANT>
```

### Verify Installation

Test the CLI tool:

```bash
~/.codex/superpowers/.codex/superpowers-codex bootstrap
```

Should display:
- Bootstrap instructions
- List of available skills (14 superpowers skills)
- Auto-loaded `using-superpowers` skill content
- Usage instructions

### Update

```bash
cd ~/.codex/superpowers
git pull
```

### Uninstall

```bash
rm -rf ~/.codex/superpowers

# Optional: remove personal skills
rm -rf ~/.codex/skills

# Optional: remove from AGENTS.md
# Edit ~/.codex/AGENTS.md and remove superpowers section
```

## Quick Start

### Basic Workflow

1. **Start a Codex session**
2. **Run bootstrap** (Codex should do this automatically if AGENTS.md configured):
   ```
   Run ~/.codex/superpowers/.codex/superpowers-codex bootstrap
   ```
3. **Skills are now available** - invoke them manually
4. **Load specific skills** as needed:
   ```
   Run ~/.codex/superpowers/.codex/superpowers-codex use-skill superpowers:brainstorming
   ```
5. **Follow the skill workflow**

### Your First Skill

Tell Codex:

```
Run ~/.codex/superpowers/.codex/superpowers-codex use-skill superpowers:brainstorming
```

Then engage with the skill:

```
Help me design a user profile feature with avatar upload
```

The skill will:
- Ask clarifying questions about requirements
- Explore design alternatives
- Consider trade-offs and constraints
- Produce a design document

### Understanding the CLI Tool

The `superpowers-codex` CLI provides three commands:

**1. bootstrap** - Complete initialization
```bash
~/.codex/superpowers/.codex/superpowers-codex bootstrap
```
- Shows update notification if available
- Displays bootstrap instructions
- Lists all available skills
- Auto-loads `using-superpowers` skill

**2. use-skill** - Load specific skill
```bash
~/.codex/superpowers/.codex/superpowers-codex use-skill superpowers:brainstorming
```
- Loads skill content
- Displays skill header and description
- Shows skill directory for reference files

**3. find-skills** - List available skills
```bash
~/.codex/superpowers/.codex/superpowers-codex find-skills
```
- Lists personal skills (priority)
- Lists superpowers skills
- Shows descriptions
- Explains naming conventions

## Using Skills

### Available Skills

All 14 Superpowers skills:

**Process Skills:**
- `brainstorming` - Design exploration through dialogue
- `writing-plans` - Create implementation plans
- `executing-plans` - Execute multi-step plans
- `subagent-driven-development` - Delegate tasks (limited in Codex - see note)

**Testing & Quality:**
- `test-driven-development` - RED-GREEN-REFACTOR methodology
- `systematic-debugging` - Scientific debugging approach
- `verification-before-completion` - Pre-commit verification

**Collaboration:**
- `requesting-code-review` - Structured review requests (limited in Codex)
- `receiving-code-review` - Review feedback integration
- `finishing-a-development-branch` - Branch completion

**Tools:**
- `using-git-worktrees` - Isolated workspace creation
- `dispatching-parallel-agents` - Multi-agent coordination (limited in Codex)
- `using-superpowers` - Meta-skill (auto-loaded via bootstrap)
- `writing-skills` - TDD methodology for creating skills

### How to Invoke Skills

**Via Bootstrap** (recommended at session start):
```
Run ~/.codex/superpowers/.codex/superpowers-codex bootstrap
```

**Via Specific Skill**:
```
Run ~/.codex/superpowers/.codex/superpowers-codex use-skill superpowers:test-driven-development
```

**Via Personal Skill**:
```
Run ~/.codex/superpowers/.codex/superpowers-codex use-skill my-custom-skill
```

### Skills Namespace

- **Superpowers skills**: `superpowers:skill-name`
- **Personal skills**: `skill-name` (from `~/.codex/skills/`)
- **Priority**: Personal skills override superpowers skills when names match

### Find Skills

```
Run ~/.codex/superpowers/.codex/superpowers-codex find-skills
```

Output format:
```
Available skills:
==================

my-personal-skill
  Use when you need custom functionality

superpowers:brainstorming
  Use when beginning any creative work - creating features, building components, adding functionality, or modifying behavior

superpowers:test-driven-development
  Use when implementing any feature or bugfix, before writing implementation code

[... additional skills ...]

Usage:
  superpowers-codex use-skill <skill-name>   # Load a specific skill
```

## Using Agents

### Agent Support in Codex

**Important Limitation**: Codex does not have native subagent orchestration like Claude Code. Agent activation works differently:

**What Works:**
- **Implicit expertise**: Skills contain guidance that shapes Codex behavior
- **Manual role-setting**: You can tell Codex "act as a Frontend Architect"
- **Context hints**: Skills reference agent expertise, influencing responses

**What Doesn't Work:**
- **Automatic agent activation**: No automated detection and persona injection
- **Subagent dispatch**: Skills requiring `Task` tool won't dispatch subagents
- **Parallel agents**: No concurrent agent execution

### Available Agent Personas

13 specialized agents (available as reference, not automated):

**Architecture & Design:**
- Frontend Architect - React, Vue, state management
- Backend Architect - APIs, microservices, data flow
- System Architect - Distributed systems, scalability

**Development Specialists:**
- JavaScript Expert - Modern JS/TS, Node.js
- Python Expert - Python, Django, FastAPI
- Database Specialist - SQL, NoSQL, optimization

**Quality & Operations:**
- Testing Specialist - Unit tests, TDD
- Performance Engineer - Optimization, profiling
- Security Engineer - Vulnerability analysis
- DevOps Engineer - CI/CD, Docker, Kubernetes

**Integration & Documentation:**
- API Specialist - REST, GraphQL, integration
- Code Reviewer - Code quality analysis
- Technical Writer - Documentation, tutorials

### Manual Agent Activation

**Approach 1: Direct Instruction**
```
Act as a Frontend Architect. Help me design a React component library with TypeScript.
```

**Approach 2: Via Skills**
```
Run ~/.codex/superpowers/.codex/superpowers-codex use-skill superpowers:test-driven-development
```
The skill contains guidance that shapes Codex behavior toward testing expertise.

**Approach 3: Load Agent Definition**
```
Read the agent definition from ~/.codex/superpowers/core/agents/frontend-architect.md and adopt that persona
```

### Tool Mapping for Codex

Skills written for Claude Code reference tools Codex doesn't have:

**Mapping:**
- `TodoWrite` → `update_plan` or manual task tracking
- `Task` with subagents → "Tell user subagents not available, do work directly"
- `Skill` tool → `~/.codex/superpowers/.codex/superpowers-codex use-skill`
- `Read`, `Write`, `Edit`, `Bash` → Use native Codex tools

Skills automatically include adaptation guidance for Codex.

## Configuration

### Environment Variables

**CODEX_SUPERPOWERS_PATH** - Override default location:
```bash
export CODEX_SUPERPOWERS_PATH=~/my-custom-path
```

**NODE_PATH** - Ensure Node.js modules accessible:
```bash
export NODE_PATH=~/.codex/superpowers/node_modules:$NODE_PATH
```

### CLI Tool Configuration

The CLI tool (`superpowers-codex`) uses:

**Paths:**
- Superpowers skills: `~/.codex/superpowers/skills/`
- Personal skills: `~/.codex/skills/`
- Bootstrap file: `~/.codex/superpowers/.codex/superpowers-bootstrap.md`

**Behavior:**
- Max depth for skill search: 2 levels (personal), 1 level (superpowers)
- Shadowing: Personal skills override superpowers skills
- Frontmatter parsing: Uses `skills-core.js` shared module

### Personal Skills Directory

Create custom skills in `~/.codex/skills/`:

```bash
mkdir -p ~/.codex/skills/my-skill
```

Skills in this directory automatically take priority over superpowers skills.

### No Configuration File

Unlike Gemini CLI, Codex integration doesn't use a config file. Configuration is implicit in:
- Directory structure (`~/.codex/superpowers/`, `~/.codex/skills/`)
- AGENTS.md bootstrap instructions
- Environment variables (optional)

## Usage Examples

### Example 1: Test-Driven Development

```
Run ~/.codex/superpowers/.codex/superpowers-codex use-skill superpowers:test-driven-development
```

Then:
```
I need to implement a user search function that filters by name and email
```

Codex guides you through:
1. **RED**: Write failing test
   ```javascript
   test('searches users by name', () => {
     expect(searchUsers('Alice')).toContain('Alice Smith');
   });
   ```
2. **GREEN**: Implement minimal code to pass
3. **REFACTOR**: Clean up while tests stay green
4. Repeat for each requirement

### Example 2: Systematic Debugging

```
Run ~/.codex/superpowers/.codex/superpowers-codex use-skill superpowers:systematic-debugging
```

Then:
```
Users report that profile avatars don't load after uploading
```

Codex leads you through:
1. **Reproduce**: Confirm the bug exists
2. **Hypothesize**: List possible causes
3. **Test hypothesis**: Add logging, check network
4. **Iterate**: Rule out causes systematically
5. **Fix**: Apply minimal fix
6. **Verify**: Confirm bug resolved

### Example 3: Planning a Feature

```
Run ~/.codex/superpowers/.codex/superpowers-codex use-skill superpowers:writing-plans
```

Then:
```
Plan OAuth2 integration with Google and GitHub
```

Creates detailed plan with:
- Architecture decisions
- Step-by-step implementation
- Test requirements
- Integration points

**Note**: `executing-plans` and `subagent-driven-development` skills have limited functionality in Codex (no subagent dispatch).

### Example 4: Design Exploration

```
Run ~/.codex/superpowers/.codex/superpowers-codex use-skill superpowers:brainstorming
```

Then:
```
Help me design an authentication system with social login and 2FA
```

Codex:
- Asks clarifying questions
- Explores design alternatives
- Considers security implications
- Produces architecture document

### Example 5: Git Worktree Setup

```
Run ~/.codex/superpowers/.codex/superpowers-codex use-skill superpowers:using-git-worktrees
```

Then:
```
Create a worktree for feature/new-auth
```

Codex:
- Creates isolated worktree at `.worktrees/feature/new-auth/`
- Sets up branch structure
- Explains workflow benefits
- Provides cleanup instructions

## Extending

### Add Custom Skills

1. **Create skill directory:**
   ```bash
   mkdir -p ~/.codex/skills/my-custom-skill
   ```

2. **Create SKILL.md:**
   ```markdown
   ---
   name: my-custom-skill
   description: Use when you need to do X, Y, or Z
   ---

   # My Custom Skill

   ## Overview
   [Detailed instructions for Codex...]

   ## When to Use
   This skill applies when:
   - Condition 1
   - Condition 2

   ## Workflow
   1. Step 1
   2. Step 2
   3. Step 3

   ## Tool Mapping for Codex
   This skill references these tools:
   - Use native Codex tools for file operations
   - Manual task tracking instead of TodoWrite
   ```

3. **Use your skill:**
   ```
   Run ~/.codex/superpowers/.codex/superpowers-codex use-skill my-custom-skill
   ```

### Add Supporting Files

Skills can include additional files:

```bash
~/.codex/skills/my-skill/
├── SKILL.md          # Main skill content (required)
├── examples.md       # Usage examples
├── reference.md      # API reference
└── scripts/          # Helper scripts
    └── helper.sh
```

Reference them in SKILL.md:
```markdown
See examples.md in this skill directory for detailed usage.
Helper scripts are available in scripts/ subdirectory.
```

### Frontmatter Requirements

**Required fields:**
```yaml
---
name: skill-name
description: Use when [triggers/symptoms]
---
```

**Rules:**
- Only `name` and `description` fields allowed
- Max 1024 characters total for frontmatter
- Description should start with "Use when..."
- Use hyphens in name (no spaces, no special chars)

### Testing Custom Skills

1. **Verify file structure:**
   ```bash
   ~/.codex/superpowers/.codex/superpowers-codex find-skills
   ```

2. **Load and test:**
   ```bash
   ~/.codex/superpowers/.codex/superpowers-codex use-skill my-custom-skill
   ```

3. **Verify Codex follows guidance:**
   Engage with skill and observe behavior.

### Share Custom Skills

1. **Create git repository:**
   ```bash
   cd ~/.codex/skills
   git init
   git add my-custom-skill/
   git commit -m "Add custom skill"
   git remote add origin <your-repo-url>
   git push
   ```

2. **Others can install:**
   ```bash
   cd ~/.codex/skills
   git clone <your-repo-url>/my-custom-skill
   ```

## Troubleshooting

### CLI Tool Not Found

**Symptom:** `command not found: superpowers-codex`

**Solutions:**

1. Use full path:
   ```bash
   ~/.codex/superpowers/.codex/superpowers-codex bootstrap
   ```

2. Add to PATH (optional):
   ```bash
   echo 'export PATH="$HOME/.codex/superpowers/.codex:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   ```

3. Create alias:
   ```bash
   alias sp-codex='~/.codex/superpowers/.codex/superpowers-codex'
   ```

### Skills Not Found

**Symptom:** `Error: Skill "my-skill" not found`

**Solutions:**

1. List available skills:
   ```bash
   ~/.codex/superpowers/.codex/superpowers-codex find-skills
   ```

2. Check file structure:
   ```bash
   ls ~/.codex/skills/my-skill/
   # Should show SKILL.md
   ```

3. Verify skill exists:
   ```bash
   cat ~/.codex/skills/my-skill/SKILL.md
   # Should have valid YAML frontmatter
   ```

### CLI Script Not Executable

**Symptom:** `Permission denied`

**Solutions:**

```bash
chmod +x ~/.codex/superpowers/.codex/superpowers-codex
```

### Node.js Errors

**Symptom:** `SyntaxError: Cannot use import statement outside a module`

**Solutions:**

1. Check Node.js version:
   ```bash
   node --version
   # Should be v14+ (v18+ recommended for ES modules)
   ```

2. Update Node.js:
   ```bash
   # Via nvm
   nvm install 18
   nvm use 18

   # Via package manager
   # ... depends on OS
   ```

3. Verify ES module support:
   ```bash
   node --input-type=module -e "import fs from 'fs'; console.log('OK')"
   # Should print: OK
   ```

### Frontmatter Parsing Errors

**Symptom:** Skill loads but metadata missing

**Solutions:**

1. Verify YAML syntax:
   ```bash
   head -n 10 ~/.codex/skills/my-skill/SKILL.md
   ```

2. Check frontmatter format:
   ```yaml
   ---
   name: skill-name
   description: Use when...
   ---
   ```

3. Ensure no extra fields:
   Only `name` and `description` allowed.

### Bootstrap Not Running Automatically

**Symptom:** Codex doesn't know about superpowers

**Solutions:**

1. Check AGENTS.md:
   ```bash
   cat ~/.codex/AGENTS.md
   # Should contain superpowers bootstrap instructions
   ```

2. Manually run bootstrap:
   ```
   Run ~/.codex/superpowers/.codex/superpowers-codex bootstrap
   ```

3. Update AGENTS.md per installation instructions

### Personal Skills Not Overriding

**Symptom:** Superpowers skill loads instead of personal skill

**Solutions:**

1. Use bare name (not `superpowers:` prefix):
   ```bash
   # Correct (checks personal first)
   ~/.codex/superpowers/.codex/superpowers-codex use-skill brainstorming

   # Wrong (forces superpowers)
   ~/.codex/superpowers/.codex/superpowers-codex use-skill superpowers:brainstorming
   ```

2. Verify personal skill exists:
   ```bash
   ls ~/.codex/skills/brainstorming/SKILL.md
   ```

## Integration Tips

### Session Initialization

Add to shell startup (`.bashrc`, `.zshrc`):

```bash
# Auto-bootstrap superpowers for Codex
alias codex-init='~/.codex/superpowers/.codex/superpowers-codex bootstrap'
```

Then run `codex-init` at session start.

### Git Integration

Use with git hooks:

```bash
# .git/hooks/pre-commit
#!/bin/bash
codex "Run verification-before-completion skill to check staged changes"
```

### CI/CD Integration

Use in automation:

```yaml
# GitHub Actions example
- name: Review code with Codex
  run: |
    codex "Load requesting-code-review skill and review PR #${{ github.event.pull_request.number }}"
```

### Multi-Platform Projects

Superpowers works across platforms:

- **Claude Code**: Native plugin with automatic activation
- **Gemini CLI**: MCP extension with slash commands
- **OpenCode**: Plugin with custom tools
- **Codex**: CLI tools (this guide)

All share the same 14 skills and 13 agents.

### Editor Integration

Use in editor terminals:

- **VS Code**: Run `superpowers-codex` commands in integrated terminal
- **Vim/Neovim**: Call via `:!` shell commands
- **Emacs**: Use `M-x shell-command`

### Task Automation

Create helper scripts:

```bash
#!/bin/bash
# ~/bin/codex-tdd
~/.codex/superpowers/.codex/superpowers-codex use-skill superpowers:test-driven-development
```

```bash
#!/bin/bash
# ~/bin/codex-debug
~/.codex/superpowers/.codex/superpowers-codex use-skill superpowers:systematic-debugging
```

## Getting Help

### Documentation

- **[Main README](../../README.md)** - Multi-platform overview
- **[Skills Reference](../skills-reference.md)** - All 14 skills detailed
- **[Agents Reference](../agents-reference.md)** - All 13 agents detailed
- **[Extending Guide](../extending.md)** - Custom skills and agents
- **[Architecture](../architecture.md)** - Framework design

### Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/obra/superpowers/issues)
- **Discussions**: [Ask questions and share experiences](https://github.com/obra/superpowers/discussions)
- **Blog**: [https://blog.fsck.com/2025/10/27/skills-for-openai-codex/](https://blog.fsck.com)

### Other Platforms

- **[Gemini CLI Guide](gemini-cli.md)** - Full-featured MCP extension
- **[Claude Code Guide](claude-code.md)** - Native plugin integration
- **[OpenCode Guide](opencode.md)** - Plugin for OpenCode.ai

## Advanced Topics

### Understanding the CLI Architecture

**Components:**
1. **superpowers-codex** - Node.js script (`#!/usr/bin/env node`)
2. **skills-core.js** - Shared module for skill discovery and parsing
3. **Skills directory** - 14 Superpowers skills in `skills/`
4. **Personal directory** - User skills in `~/.codex/skills/`

**Flow:**
1. CLI script invoked with command (`bootstrap`, `use-skill`, `find-skills`)
2. `skills-core.js` functions called for skill operations
3. Skills discovered recursively with frontmatter extraction
4. Content stripped of frontmatter and returned
5. Output formatted for Codex consumption

### Skill Discovery Algorithm

**Priority order:**
1. Personal skills (`~/.codex/skills/`) - checked first
2. Superpowers skills (`~/.codex/superpowers/skills/`) - fallback

**Search depth:**
- Personal: 2 levels deep
- Superpowers: 1 level deep (flat namespace)

**Shadowing:**
If `~/.codex/skills/brainstorming/SKILL.md` exists, it overrides `~/.codex/superpowers/skills/brainstorming/SKILL.md`.

### Update Checking

The bootstrap command checks for updates:

```javascript
skillsCore.checkForUpdates(superpowersRepoDir)
```

Displays warning if local install is behind remote:
```
⚠️  Your superpowers installation is behind the latest version.
To update, run: `cd ~/.codex/superpowers && git pull`
```

### Performance Considerations

**Token usage:**
- Bootstrap: ~8000 tokens (all skills listed + using-superpowers loaded)
- Single skill: ~800-1500 tokens (varies by skill)
- Find skills: ~2000 tokens (all skills listed)

**Recommendation:**
- Use `bootstrap` at session start (comprehensive)
- Use `use-skill` for specific workflows (targeted)
- Use `find-skills` when exploring available skills

### Limitations vs Other Platforms

**What Codex lacks:**
- Automatic agent activation
- Subagent orchestration
- Native Skill tool (must use CLI)
- SessionStart hooks
- Plugin system

**What Codex has:**
- Same 14 skills
- CLI tool for skill access
- Personal skills shadowing
- Shared skills-core module
- Bootstrap system

**Workarounds:**
- Manual agent invocation via prompts
- Skills adapted for single-agent workflow
- CLI provides skill access
- AGENTS.md provides session initialization

## See Also

- **[Codex Blog Post](https://blog.fsck.com/2025/10/27/skills-for-openai-codex/)** - Original announcement
- **[Gemini CLI Guide](gemini-cli.md)** - Compare full-featured implementation
- **[Claude Code Guide](claude-code.md)** - Compare native plugin approach
- **[Testing Guide](../testing.md)** - Integration testing methodology

---

**Ready to get started? Run: `~/.codex/superpowers/.codex/superpowers-codex bootstrap`**
