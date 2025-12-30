# SupremePower for Gemini CLI

Complete guide to using SupremePower with Gemini CLI through native MCP extension.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Slash Commands](#slash-commands)
- [Management Commands](#management-commands)
- [Smart Wrapper](#smart-wrapper)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Extending](#extending)
- [Troubleshooting](#troubleshooting)

## Installation

### Prerequisites

- Gemini CLI installed
- Node.js 18+ (included with Gemini CLI)
- Git (for GitHub installation)

### Install from GitHub

```bash
gemini extensions install https://github.com/abudhahir/superpowers
```

### Install Specific Version

```bash
gemini extensions install https://github.com/abudhahir/superpowers --ref=v2.0.0
```

### Post-Installation

The extension automatically:
1. Creates `~/.supremepower/` directory
2. Copies default configuration to `~/.supremepower/config.json`
3. Offers to install `gemini-sp` wrapper script

### Verify Installation

```bash
# In Gemini CLI
/sp:agents
```

Should list all 13 available agents.

### Update Extension

```bash
gemini extensions update supremepower
```

### Uninstall

```bash
gemini extensions uninstall supremepower

# Optional: remove user data
rm -rf ~/.supremepower
```

## Quick Start

### Basic Workflow

1. **Start a conversation** in Gemini CLI
2. **Invoke a skill** using slash commands:
   ```
   /brainstorm "authentication system design"
   ```
3. **Relevant agents activate automatically** based on skill context
4. **Follow the skill workflow** (e.g., brainstorming asks questions, TDD guides RED-GREEN-REFACTOR)

### Your First Skill

```bash
# Try the brainstorming skill
/brainstorm "user profile feature with avatar upload"
```

The skill will:
- Ask clarifying questions about requirements
- Explore design alternatives
- Consider trade-offs and constraints
- Produce a design document
- Automatically activate System Architect and relevant specialists

## Slash Commands

SupremePower provides 25 slash commands organized into three categories:

### Short Aliases (5 commands)

Quick access to frequently-used skills:

| Command | Full Name | Description |
|---------|-----------|-------------|
| `/brainstorm` | brainstorming | Interactive design exploration |
| `/tdd` | test-driven-development | RED-GREEN-REFACTOR cycle |
| `/plan` | writing-plans | Create implementation plans |
| `/debug` | systematic-debugging | Scientific debugging workflow |
| `/implement` | subagent-driven-development | Delegate to parallel subagents |

### Full Skill Names (14 commands)

All skills accessible via `/skills:*` namespace:

```bash
/skills:brainstorming "topic"
/skills:test-driven-development
/skills:writing-plans "feature"
/skills:executing-plans
/skills:systematic-debugging
/skills:subagent-driven-development
/skills:requesting-code-review
/skills:receiving-code-review
/skills:finishing-a-development-branch
/skills:using-git-worktrees "branch-name"
/skills:verification-before-completion
/skills:dispatching-parallel-agents
/skills:using-superpowers
/skills:writing-skills "skill-name"
```

### Management Commands (6 commands)

Control agents and configuration via `/sp:*` namespace:

| Command | Description | Usage |
|---------|-------------|-------|
| `/sp:agents` | List all available agents | `/sp:agents` |
| `/sp:analyze <message>` | Preview which agents would activate | `/sp:analyze "optimize React performance"` |
| `/sp:with <agent> <message>` | Force specific agent activation | `/sp:with frontend-architect "help with hooks"` |
| `/sp:auto-agent-create` | Interactive agent creator | `/sp:auto-agent-create` |
| `/sp:config [key] [value]` | View/edit configuration | `/sp:config` or `/sp:config orchestration.agentActivationThreshold 6` |
| `/sp:status` | Show system status | `/sp:status` |

## Management Commands

### List Agents

```bash
/sp:agents
```

Shows all 13 agents with expertise areas and activation keywords.

### Preview Agent Activation

```bash
/sp:analyze "I need to optimize our database queries for the user search feature"
```

Returns which agents would activate (Database Specialist, Performance Engineer) and why.

### Force Specific Agent

```bash
/sp:with security-engineer "review this authentication flow"
```

Activates Security Engineer regardless of automatic detection.

### Create Custom Agent

```bash
/sp:auto-agent-create
```

Interactive wizard that:
1. Asks for domain/expertise
2. Suggests activation keywords
3. Generates agent definition
4. Saves to `~/.supremepower/agents/`

### Configuration Management

```bash
# View full config
/sp:config

# View specific section
/sp:config orchestration

# Update specific value
/sp:config orchestration.agentActivationThreshold 6

# Edit interactively
/sp:config edit
```

### System Status

```bash
/sp:status
```

Shows:
- Extension version
- MCP server status
- Number of agents loaded (built-in + custom)
- Number of skills loaded (built-in + custom)
- Configuration file location
- Last update check

## Smart Wrapper

Optional `gemini-sp` wrapper for automatic agent activation.

### Installation

During extension install, choose "Yes" when prompted, or manually:

```bash
sudo ln -s ~/.supremepower/bin/gemini-sp /usr/local/bin/gemini-sp
```

### Usage

```bash
# Use wrapper instead of gemini directly
gemini-sp "help me build a React component with TypeScript and error boundaries"
```

### How It Works

The wrapper:
1. **Analyzes message complexity** using heuristics:
   - Word count threshold (default: 50 words)
   - Technical keywords detection
   - Code blocks presence
   - File paths presence

2. **Activates agents automatically** if complexity threshold met

3. **Passes through** to normal Gemini CLI for simple queries

### Configure Wrapper

Edit `~/.supremepower/config.json`:

```json
{
  "wrapper": {
    "enabled": true,
    "complexity": {
      "minWordCount": 50,
      "requireKeywords": true,
      "checkCodeBlocks": true
    }
  }
}
```

## Configuration

SupremePower uses JSON configuration at `~/.supremepower/config.json`.

### Configuration Sections

#### Orchestration

```json
{
  "orchestration": {
    "agentActivationThreshold": 8,
    "detectionSensitivity": "medium",
    "fallbackToLLM": true,
    "maxAgentsPerRequest": 3
  }
}
```

- **agentActivationThreshold**: Minimum score to activate agent (lower = more agents)
- **detectionSensitivity**: `low` | `medium` | `high` - How aggressively to detect agent needs
- **fallbackToLLM**: Use LLM for agent selection if keyword matching fails
- **maxAgentsPerRequest**: Maximum agents to activate simultaneously

#### Skills

```json
{
  "skills": {
    "exposureMode": "commands",
    "generateAliases": true,
    "customSkillsPath": "~/.supremepower/skills"
  }
}
```

- **exposureMode**: `commands` | `prompts` | `both` - How to expose skills
- **generateAliases**: Create short command aliases
- **customSkillsPath**: Directory for custom skills

#### Agents

```json
{
  "agents": {
    "customAgentsPath": "~/.supremepower/agents",
    "personaDetail": "full",
    "autoCreate": {
      "enabled": true,
      "confirmBeforeSave": true,
      "template": "standard"
    }
  }
}
```

- **customAgentsPath**: Directory for custom agents
- **personaDetail**: `full` | `minimal` - How much persona text to inject
- **autoCreate.enabled**: Enable `/sp:auto-agent-create` command
- **autoCreate.confirmBeforeSave**: Prompt before saving new agents

#### Display

```json
{
  "display": {
    "showActivatedAgents": true,
    "verbose": false,
    "logPath": "~/.supremepower/logs"
  }
}
```

- **showActivatedAgents**: Display which agents activated
- **verbose**: Show debug information
- **logPath**: Where to write logs

#### Wrapper

```json
{
  "wrapper": {
    "enabled": true,
    "complexity": {
      "minWordCount": 50,
      "requireKeywords": true,
      "checkCodeBlocks": true
    }
  }
}
```

### Environment Variables

Override config location:

```bash
export SUPREMEPOWER_CONFIG_PATH=~/my-custom-path
```

## Usage Examples

### Example 1: Test-Driven Development

```bash
/tdd
```

Then describe your feature:
```
I need to implement a user search function that filters by name and email
```

The skill guides you through:
1. **RED**: Write failing test
2. **GREEN**: Implement minimal code to pass
3. **REFACTOR**: Clean up while tests stay green
4. Repeat for each requirement

**Activated agents:** Testing Specialist (automatically)

### Example 2: Systematic Debugging

```bash
/debug
```

Then describe the bug:
```
Users report that profile avatars don't load after uploading
```

The skill leads you through:
1. **Reproduce**: Confirm the bug
2. **Hypothesize**: What could cause this?
3. **Test hypothesis**: Add logging, check network
4. **Iterate**: Rule out causes systematically
5. **Fix**: Apply minimal fix
6. **Verify**: Confirm bug is resolved

**Activated agents:** Debugging specialists based on domain

### Example 3: Planning Then Implementing

```bash
# Step 1: Create a plan
/plan "OAuth2 integration with Google and GitHub"

# Step 2: Execute the plan
/skills:subagent-driven-development

# References the plan from Step 1
# Dispatches fresh subagent per task
# Reviews after each task
```

**Activated agents:** System Architect (planning), Backend Architect, Security Engineer (implementation)

### Example 4: Code Review Workflow

```bash
# After completing a feature
/skills:requesting-code-review

# Prompts for git SHAs
# Dispatches code-reviewer subagent
# Returns strengths and issues categorized by severity

# If issues found
/skills:receiving-code-review

# Helps process feedback systematically
# Distinguishes valid concerns from preferences
```

### Example 5: Custom Agent for Domain

```bash
# Create a blockchain specialist
/sp:auto-agent-create

# Interactive prompts:
# Domain? "blockchain and smart contracts"
# Keywords? "solidity, ethereum, web3, DeFi"
# Expertise? "Solidity best practices, gas optimization, security audits"

# Agent saved to ~/.supremepower/agents/blockchain-specialist.md
# Now activates automatically for blockchain queries
```

## Extending

### Add Custom Skills

1. **Create skill directory:**
   ```bash
   mkdir -p ~/.supremepower/skills/my-skill
   ```

2. **Create SKILL.md:**
   ```markdown
   ---
   name: my-custom-skill
   description: Use when you need to do X, Y, or Z
   ---

   # My Custom Skill

   ## Overview
   [Detailed instructions for the AI...]

   ## Conditional Blocks
   IF user_message contains "keyword"
   THEN ACTIVATE agent-name
   CONFIDENCE high
   ```

3. **Use your skill:**
   ```bash
   /skills:my-custom-skill
   ```

### Add Custom Agents

1. **Create agent file:**
   ```bash
   mkdir -p ~/.supremepower/agents
   ```

2. **Create agent definition:**
   ```markdown
   ---
   name: my-custom-agent
   expertise:
     - Domain expertise 1
     - Domain expertise 2
   activation_keywords:
     - keyword1
     - keyword2
   complexity_threshold: medium
   ---

   # My Custom Agent

   You are an expert in [domain].

   ## Working Principles
   - Principle 1
   - Principle 2

   ## Integration with Skills
   This agent works best with:
   - skill-name-1 for [purpose]
   - skill-name-2 for [purpose]
   ```

3. **Verify agent loaded:**
   ```bash
   /sp:agents
   # Should show your custom agent
   ```

### Share Custom Skills/Agents

1. **Export to git repository:**
   ```bash
   cd ~/.supremepower
   git init
   git add skills/ agents/
   git commit -m "My custom SupremePower extensions"
   git remote add origin <your-repo-url>
   git push
   ```

2. **Others can install via:**
   ```bash
   # In Gemini CLI
   /skills:fetch-skills <your-repo-url>
   ```

## Troubleshooting

### MCP Server Not Starting

**Symptom:** `/sp:agents` returns "MCP server not available"

**Solutions:**

1. Check MCP server status:
   ```bash
   /sp:status
   ```

2. Rebuild MCP server:
   ```bash
   cd ~/.gemini/extensions/supremepower
   npm install
   npm run build
   ```

3. Check logs:
   ```bash
   tail -f ~/.supremepower/logs/mcp-server.log
   ```

### Slash Commands Not Found

**Symptom:** `/skills:brainstorming` returns "Unknown command"

**Solutions:**

1. Verify extension installed:
   ```bash
   gemini extensions list
   ```

2. Reinstall extension:
   ```bash
   gemini extensions uninstall supremepower
   gemini extensions install https://github.com/abudhahir/superpowers
   ```

### Agents Not Activating

**Symptom:** Skills run but no agents mentioned

**Solutions:**

1. Check activation threshold:
   ```bash
   /sp:config orchestration.agentActivationThreshold
   ```

2. Lower threshold (more aggressive):
   ```bash
   /sp:config orchestration.agentActivationThreshold 4
   ```

3. Preview what would activate:
   ```bash
   /sp:analyze "your message here"
   ```

### Custom Skills Not Loading

**Symptom:** `/skills:my-custom-skill` not found

**Solutions:**

1. Verify file structure:
   ```bash
   ls -la ~/.supremepower/skills/my-custom-skill/
   # Should show SKILL.md
   ```

2. Check YAML frontmatter syntax:
   ```bash
   head -n 10 ~/.supremepower/skills/my-custom-skill/SKILL.md
   # Must have valid YAML between --- markers
   ```

3. Restart Gemini CLI to reload skills

### Configuration Not Persisting

**Symptom:** Changes via `/sp:config` don't persist

**Solutions:**

1. Check config file permissions:
   ```bash
   ls -la ~/.supremepower/config.json
   # Should be writable by your user
   ```

2. Verify config file valid JSON:
   ```bash
   cat ~/.supremepower/config.json | jq .
   # Should parse without errors
   ```

3. Check environment variable:
   ```bash
   echo $SUPREMEPOWER_CONFIG_PATH
   # Should be empty or point to valid directory
   ```

### Performance Issues

**Symptom:** Slow response times, high CPU usage

**Solutions:**

1. Reduce max agents:
   ```bash
   /sp:config orchestration.maxAgentsPerRequest 1
   ```

2. Use minimal persona detail:
   ```bash
   /sp:config agents.personaDetail minimal
   ```

3. Disable wrapper complexity detection:
   ```bash
   /sp:config wrapper.enabled false
   ```

## Advanced Topics

### Multiple Skill Chaining

Combine skills for complex workflows:

```bash
# Design → Plan → Implement → Review
/brainstorm "payment processing system"
# [Answer questions, get design doc]

/plan "implement design from brainstorming session"
# [Get step-by-step plan]

/implement
# [Execute plan with subagents]

/skills:requesting-code-review
# [Get code review]
```

### Git Worktree Isolation

Use worktrees for parallel development:

```bash
/skills:using-git-worktrees feature/new-auth

# Creates isolated worktree at .worktrees/feature/new-auth
# All changes isolated from main development
# When done:

/skills:finishing-a-development-branch
# Guides through merge, PR, or cleanup
```

### Subagent Parallelization

Dispatch independent tasks to parallel subagents:

```bash
/skills:subagent-driven-development

# Reads plan file
# For each task:
#   1. Dispatch implementer subagent
#   2. Dispatch spec reviewer
#   3. Dispatch code quality reviewer
#   4. Fix any issues found
#   5. Move to next task
```

## Integration with Other Tools

### VS Code Integration

Use Gemini CLI extension in VS Code terminal:

1. Install Gemini CLI VS Code extension
2. Open integrated terminal
3. Run SupremePower slash commands
4. Agents activate with VS Code context

### GitHub Actions

Use in CI/CD for automated reviews:

```yaml
- name: Review PR with SupremePower
  run: |
    gemini-sp "Review PR #${{ github.event.pull_request.number }}"
```

### Pre-commit Hooks

Add verification step:

```bash
# .git/hooks/pre-commit
#!/bin/bash
gemini /skills:verification-before-completion
```

## Getting Help

- **GitHub Issues**: [Report bugs](https://github.com/abudhahir/superpowers/issues)
- **Discussions**: [Ask questions](https://github.com/abudhahir/superpowers/discussions)
- **Documentation**: [All platform guides](../)

## See Also

- [Main README](../../README.md) - Multi-platform overview
- [Skills Reference](../skills-reference.md) - All 14 skills
- [Agents Reference](../agents-reference.md) - All 13 agents
- [Extending Guide](../extending.md) - Custom skills and agents
- [Architecture](../architecture.md) - Framework design

---

**Ready to get started? Try `/brainstorm "your project idea"` in Gemini CLI!**
