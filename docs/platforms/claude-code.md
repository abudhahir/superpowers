# SupremePower for Claude Code

Complete guide to using SupremePower with Claude Code through the native plugin system.

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

- Claude Code CLI or Desktop installed
- Node.js 14+ (for plugin system)
- Git (for GitHub installation)

### Install from Marketplace

```bash
# Add the marketplace
/plugin marketplace add obra/superpowers-marketplace

# Install superpowers
/plugin install superpowers@superpowers-marketplace
```

### Install Specific Version

```bash
/plugin install superpowers@superpowers-marketplace --version=4.0.3
```

### Install from Local Development

For plugin developers:

```bash
# Enable local dev in ~/.claude/settings.json
{
  "enabledPlugins": {
    "superpowers@superpowers-dev": true
  }
}

# Clone to local directory
git clone https://github.com/obra/superpowers ~/superpowers
```

### Post-Installation

The plugin automatically:
1. Registers with Claude Code's plugin system
2. Injects SessionStart hook for automatic skill loading
3. Makes all 14 Superpowers skills available via `Skill` tool

### Verify Installation

Start a new session and ask:

```
Do you have superpowers?
```

Claude should confirm superpowers are active and list available skills.

### Update Plugin

```bash
/plugin update superpowers@superpowers-marketplace
```

### Uninstall

```bash
/plugin uninstall superpowers@superpowers-marketplace

# Optional: remove custom skills
rm -rf ~/.claude/skills
```

## Quick Start

### Basic Workflow

1. **Start a conversation** in Claude Code
2. **Superpowers automatically activated** via SessionStart hook
3. **Invoke skills as needed**:
   ```
   Use the brainstorming skill to help me design an authentication system
   ```
4. **Agents activate implicitly** based on skill content hints
5. **Follow the skill workflow** (e.g., TDD guides RED-GREEN-REFACTOR)

### Your First Skill

```
Use the brainstorming skill to explore implementing a user profile feature with avatar upload
```

The skill will:
- Ask clarifying questions about requirements
- Explore design alternatives
- Consider trade-offs and constraints
- Produce a design document
- Implicitly activate System Architect and relevant specialists

### How Skills Activate

Claude Code skills are **context-based**. You don't call slash commands; instead:

1. **Explicit request**: "Use the test-driven-development skill"
2. **Implicit detection**: Claude recognizes when a skill applies based on context
3. **Tool invocation**: Claude uses the `Skill` tool to load content

## Using Skills

### Available Skills

All 14 Superpowers skills are automatically available:

**Process Skills:**
- `brainstorming` - Design exploration through dialogue
- `writing-plans` - Create implementation plans
- `executing-plans` - Execute multi-step plans
- `subagent-driven-development` - Delegate to parallel subagents

**Testing & Quality:**
- `test-driven-development` - RED-GREEN-REFACTOR methodology
- `systematic-debugging` - Scientific debugging approach
- `verification-before-completion` - Pre-commit verification

**Collaboration:**
- `requesting-code-review` - Structured review requests
- `receiving-code-review` - Review feedback integration
- `finishing-a-development-branch` - Branch completion

**Tools:**
- `using-git-worktrees` - Isolated workspace creation
- `dispatching-parallel-agents` - Multi-agent coordination
- `using-superpowers` - Meta-skill (auto-loaded at session start)
- `writing-skills` - TDD methodology for creating skills

### How to Invoke Skills

**Explicit Request:**
```
Use the test-driven-development skill to help me implement user search
```

**Ask About Skills:**
```
What skills do you have for debugging?
```

**Let Claude Decide:**
```
I need to fix a bug where profile avatars don't load
```
Claude recognizes this as a debugging task and loads `systematic-debugging` automatically.

### Skills Namespace

- **Superpowers skills**: `superpowers:skill-name`
- **Personal skills**: `skill-name` (from `~/.claude/skills/`)
- **Priority**: Personal skills override superpowers skills when names match

### Skill Invocation via Tool

Claude uses the built-in `Skill` tool:

```
Skill(skill="superpowers:brainstorming")
```

You don't call this directly - Claude invokes it when appropriate.

## Using Agents

### How Agents Activate

Claude Code doesn't have explicit agent invocation. Instead, agents activate **implicitly** through:

1. **Skill content hints**: Skills contain context that triggers specialized behavior
2. **Natural language patterns**: Keywords and complexity detection
3. **Task analysis**: Claude recognizes when specialized expertise needed

### Available Agents

13 specialized agent personas:

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

### Agent Activation Examples

**Implicit Activation via Skills:**
```
Use the test-driven-development skill
```
Automatically activates **Testing Specialist** persona.

**Implicit Activation via Keywords:**
```
Help me optimize these database queries - they're taking 5 seconds
```
Automatically activates **Database Specialist** and **Performance Engineer** personas.

**Checking Active Behavior:**
```
What expertise are you applying to this task?
```

## Configuration

### Plugin Configuration

Claude Code plugin settings in `.claude-plugin/plugin.json`:

```json
{
  "name": "superpowers",
  "description": "Core skills library for Claude Code: TDD, debugging, collaboration patterns, and proven techniques",
  "version": "4.0.3",
  "author": {
    "name": "Jesse Vincent",
    "email": "jesse@fsck.com"
  }
}
```

### SessionStart Hook

The plugin automatically injects the `using-superpowers` skill at session start via hooks:

**Hook Configuration** (`hooks/hooks.json`):
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "\"${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd\" session-start.sh"
          }
        ]
      }
    ]
  }
}
```

This ensures superpowers are always available without manual activation.

### Personal Skills Directory

Create custom skills in `~/.claude/skills/`:

```bash
mkdir -p ~/.claude/skills/my-skill
```

Skills in this directory automatically override superpowers skills with matching names.

### Environment Variables

No environment variables needed - Claude Code manages plugin configuration internally.

## Usage Examples

### Example 1: Test-Driven Development

```
Use the test-driven-development skill to implement a user search function
```

Claude guides you through:
1. **RED**: Write failing test
   ```javascript
   test('searches users by name', () => {
     expect(searchUsers('Alice')).toContain('Alice Smith');
   });
   ```
2. **GREEN**: Implement minimal code to pass
3. **REFACTOR**: Clean up while tests stay green
4. Repeat for each requirement

**Activated behavior**: Testing Specialist expertise applied throughout.

### Example 2: Systematic Debugging

```
Use the systematic-debugging skill. Users report that profile avatars don't load after uploading.
```

Claude leads you through:
1. **Reproduce**: Confirm the bug exists
2. **Hypothesize**: "Could be: upload path wrong, CORS issue, cache problem"
3. **Test hypothesis**: Add logging, check network tab
4. **Iterate**: Rule out causes systematically
5. **Fix**: Apply minimal fix
6. **Verify**: Confirm bug resolved

**Activated behavior**: Debugging expertise with domain-specific knowledge.

### Example 3: Planning Then Implementing

```
Use the writing-plans skill to plan OAuth2 integration with Google and GitHub
```

Creates detailed plan with:
- Architecture decisions
- Step-by-step implementation
- Test requirements
- Integration points

Then:
```
Use the subagent-driven-development skill to execute this plan
```

Dispatches subagents for each task with review checkpoints.

**Activated behavior**: System Architect (planning), Backend Architect + Security Engineer (implementation).

### Example 4: Code Review Workflow

```
Use the requesting-code-review skill
```

Claude:
- Prompts for git commit range
- Dispatches code-reviewer subagent
- Returns categorized findings (blockers, improvements, nits)

Then:
```
Use the receiving-code-review skill
```

Claude:
- Helps process feedback systematically
- Distinguishes valid concerns from preferences
- Guides implementation of fixes

### Example 5: Git Worktree Isolation

```
Use the using-git-worktrees skill for a new feature branch
```

Claude:
- Creates isolated worktree at `.worktrees/feature-name/`
- Sets up branch structure
- Explains workflow benefits

All changes isolated from main development. When done:

```
Use the finishing-a-development-branch skill
```

Claude guides through merge, PR creation, or cleanup.

## Extending

### Add Custom Skills

1. **Create skill directory:**
   ```bash
   mkdir -p ~/.claude/skills/my-custom-skill
   ```

2. **Create SKILL.md:**
   ```markdown
   ---
   name: my-custom-skill
   description: Use when you need to do X, Y, or Z
   ---

   # My Custom Skill

   ## Overview
   [Detailed instructions for Claude...]

   ## When to Use
   This skill applies when:
   - Condition 1
   - Condition 2

   ## Workflow
   [Step-by-step process...]
   ```

3. **Use your skill:**
   ```
   Use my-custom-skill to help with this task
   ```

### Add Supporting Files

Skills can include additional files:

```bash
~/.claude/skills/my-skill/
├── SKILL.md          # Main skill content (required)
├── examples.md       # Usage examples
├── reference.md      # API reference
└── scripts/          # Helper scripts
    └── helper.sh
```

Reference them in SKILL.md:
```markdown
See examples.md for detailed usage examples.
Helper scripts are available in the scripts/ directory.
```

### Testing Custom Skills

Use the `writing-skills` skill to create well-tested skills:

```
Use the writing-skills skill to create a new skill for handling GraphQL schema migrations
```

Follows TDD methodology:
1. **RED Phase**: Test baseline behavior WITHOUT skill
2. **GREEN Phase**: Write skill, verify compliance
3. **REFACTOR Phase**: Close loopholes, improve clarity

### Share Custom Skills

1. **Create git repository:**
   ```bash
   cd ~/.claude/skills
   git init
   git add my-custom-skill/
   git commit -m "Add custom skill"
   git remote add origin <your-repo-url>
   git push
   ```

2. **Others can install via:**
   ```bash
   cd ~/.claude/skills
   git clone <your-repo-url>/my-custom-skill
   ```

## Troubleshooting

### Plugin Not Loading

**Symptom:** "Do you have superpowers?" returns negative

**Solutions:**

1. Verify plugin installed:
   ```bash
   /plugin list
   # Should show: superpowers@superpowers-marketplace
   ```

2. Check plugin enabled:
   ```bash
   cat ~/.claude/settings.json
   # Should have superpowers in enabledPlugins
   ```

3. Reinstall plugin:
   ```bash
   /plugin uninstall superpowers@superpowers-marketplace
   /plugin install superpowers@superpowers-marketplace
   ```

### Skills Not Activating

**Symptom:** Claude doesn't use skills when appropriate

**Solutions:**

1. **Be explicit**: "Use the test-driven-development skill"

2. **Check skill availability**:
   ```
   What skills do you have available?
   ```

3. **Verify SessionStart hook**: Look for superpowers context in session start

### Custom Skills Not Found

**Symptom:** "Use my-custom-skill" returns "Skill not found"

**Solutions:**

1. Verify file structure:
   ```bash
   ls -la ~/.claude/skills/my-custom-skill/
   # Should show SKILL.md
   ```

2. Check YAML frontmatter syntax:
   ```bash
   head -n 10 ~/.claude/skills/my-custom-skill/SKILL.md
   # Must have valid YAML between --- markers
   ```

3. Verify frontmatter fields:
   ```yaml
   ---
   name: my-custom-skill
   description: Use when...
   ---
   ```
   Only `name` and `description` fields allowed. Max 1024 chars total.

### Hook Not Injecting

**Symptom:** `using-superpowers` skill not loaded at session start

**Solutions:**

1. Check hook file exists:
   ```bash
   ls ~/.claude/plugins/superpowers/hooks/session-start.sh
   ```

2. Verify hook registered:
   ```bash
   cat ~/.claude/plugins/superpowers/hooks/hooks.json
   ```

3. Check hook permissions:
   ```bash
   chmod +x ~/.claude/plugins/superpowers/hooks/session-start.sh
   ```

### Subagents Not Working

**Symptom:** Subagent skills fail to dispatch

**Solutions:**

1. **Check Task tool availability**:
   ```
   What tools do you have for creating subagents?
   ```

2. **Verify subagent skills**: These require Task tool:
   - `subagent-driven-development`
   - `dispatching-parallel-agents`
   - `requesting-code-review`

3. **Use current session**: If Task tool unavailable, Claude does work directly

### Performance Issues

**Symptom:** Slow responses, high token usage

**Solutions:**

1. **Use specific skills**: Instead of letting Claude choose, be explicit:
   ```
   Use the test-driven-development skill
   ```

2. **Avoid loading large skills repeatedly**: Skills are injected each use

3. **Use compact context**: For long sessions, start fresh periodically

## Integration Tips

### With VS Code

Use Claude Code extension in VS Code:

1. Install Claude Code VS Code extension
2. Open command palette (Cmd/Ctrl+Shift+P)
3. Select "Claude Code: Chat"
4. Skills and agents work automatically

### With Git Hooks

Add verification to pre-commit:

```bash
# .git/hooks/pre-commit
#!/bin/bash

# Use Claude to verify before commit
claude-code "Use verification-before-completion skill to check staged changes"
```

### With CI/CD

Use in GitHub Actions:

```yaml
- name: Review PR with SupremePower
  run: |
    claude-code "Use requesting-code-review skill for PR #${{ github.event.pull_request.number }}"
```

### With Testing Frameworks

Integrate TDD skill into test workflow:

```bash
# Run tests with TDD guidance
npm test -- --watch --onFailure "claude-code 'Use test-driven-development skill to fix failing tests'"
```

### Multi-Platform Projects

Combine with other platforms:

- **Gemini CLI**: Use for quick CLI interactions
- **Codex**: Bootstrap for OpenAI Codex compatibility
- **OpenCode**: Plugin for OpenCode.ai integration

All share the same 14 skills and 13 agents.

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
- **Blog**: [https://blog.fsck.com](https://blog.fsck.com)

### Other Platforms

- **[Gemini CLI Guide](gemini-cli.md)** - MCP extension with slash commands
- **[Codex Guide](codex.md)** - CLI tools for OpenAI Codex
- **[OpenCode Guide](opencode.md)** - Plugin for OpenCode.ai

## Advanced Topics

### Understanding SessionStart Hooks

The plugin injects content at session start using hooks:

1. **Hook triggers**: On session startup, resume, clear, compact
2. **Script runs**: `hooks/session-start.sh` executes
3. **Content injected**: `using-superpowers` skill loaded as context
4. **Result**: Claude always knows about superpowers

### Personal Skills Shadowing

Personal skills override superpowers skills:

```bash
# If both exist:
~/.claude/skills/brainstorming/SKILL.md          # Used (personal)
~/.claude/plugins/superpowers/skills/brainstorming/SKILL.md  # Ignored
```

Use this to customize built-in skills.

### Token Efficiency

Skills are loaded on-demand, but be mindful:

- **using-superpowers**: ~800 tokens (auto-loaded)
- **brainstorming**: ~1200 tokens
- **test-driven-development**: ~1500 tokens
- **systematic-debugging**: ~1000 tokens

**Tip**: Use specific skills rather than loading multiple exploratory skills.

### Skill Development Workflow

Follow TDD for skill creation:

1. **Run pressure test**: Test Claude WITHOUT skill
2. **Document rationalizations**: Where Claude cuts corners
3. **Write skill**: Address specific failure modes
4. **Verify compliance**: Test Claude WITH skill
5. **Close loopholes**: Refine based on testing

See `skills/writing-skills/SKILL.md` for complete methodology.

## See Also

- **[Gemini CLI Guide](gemini-cli.md)** - Full feature comparison
- **[Testing Guide](../testing.md)** - Integration test infrastructure
- **[CLAUDE.md](../../CLAUDE.md)** - Project instructions for contributors

---

**Ready to get started? Just ask: "Use the brainstorming skill to help me design [your project idea]"**
