# SupremePower for OpenCode

Complete guide to using SupremePower with OpenCode.ai through the plugin system.

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

- [OpenCode.ai](https://opencode.ai) installed
- Node.js 14+ (for ES modules)
- Git (for installation)

### Quick Install

Tell OpenCode:

```
Clone https://github.com/obra/superpowers to ~/.config/opencode/superpowers, then create directory ~/.config/opencode/plugin, then symlink ~/.config/opencode/superpowers/.opencode/plugin/superpowers.js to ~/.config/opencode/plugin/superpowers.js, then restart opencode.
```

### Manual Installation

#### Step 1: Install Superpowers

```bash
mkdir -p ~/.config/opencode/superpowers
git clone https://github.com/obra/superpowers.git ~/.config/opencode/superpowers
```

#### Step 2: Register Plugin

OpenCode discovers plugins from `~/.config/opencode/plugin/`. Create a symlink:

```bash
mkdir -p ~/.config/opencode/plugin
ln -sf ~/.config/opencode/superpowers/.opencode/plugin/superpowers.js ~/.config/opencode/plugin/superpowers.js
```

**Alternative: Project-Local Installation**

For project-specific installation:

```bash
# In your OpenCode project
mkdir -p .opencode/plugin
ln -sf ~/.config/opencode/superpowers/.opencode/plugin/superpowers.js .opencode/plugin/superpowers.js
```

#### Step 3: Restart OpenCode

Restart OpenCode to load the plugin. Superpowers will automatically activate.

### Verify Installation

Ask OpenCode:

```
Do you have superpowers?
```

Should confirm superpowers are active and show available tools: `use_skill` and `find_skills`.

Or use:

```
use find_skills tool
```

Should list all 14 available superpowers skills.

### Update

```bash
cd ~/.config/opencode/superpowers
git pull
```

Restart OpenCode to load updates.

### Uninstall

```bash
# Remove plugin symlink
rm ~/.config/opencode/plugin/superpowers.js

# Remove superpowers
rm -rf ~/.config/opencode/superpowers

# Optional: remove personal skills
rm -rf ~/.config/opencode/skills

# Optional: remove project skills
rm -rf .opencode/skills  # In project directory
```

## Quick Start

### Basic Workflow

1. **Start OpenCode** - Plugin auto-activates via hooks
2. **Skills are available** - Use `use_skill` and `find_skills` tools
3. **Invoke skills as needed**:
   ```
   use use_skill tool with skill_name: "superpowers:brainstorming"
   ```
4. **Follow the skill workflow**
5. **Agents activate implicitly** based on skill content

### Your First Skill

```
use use_skill tool with skill_name: "superpowers:brainstorming"
```

Then engage:

```
Help me design a user profile feature with avatar upload
```

The skill will:
- Ask clarifying questions about requirements
- Explore design alternatives
- Consider trade-offs and constraints
- Produce a design document
- Implicitly activate System Architect and relevant specialists

### How It Works

**Automatic Context Injection:**
1. Plugin registers with OpenCode
2. `session.created` event triggers
3. Plugin injects `using-superpowers` skill content
4. Two custom tools become available: `use_skill` and `find_skills`
5. Skills persist across context compaction

**Compaction Resilience:**
- Plugin listens for `session.compacted` events
- Automatically re-injects core superpowers bootstrap
- Skills loaded via `use_skill` are inserted as user messages with `noReply: true`
- They survive compaction without needing reload

## Using Skills

### Available Skills

All 14 Superpowers skills:

**Process Skills:**
- `brainstorming` - Design exploration through dialogue
- `writing-plans` - Create implementation plans
- `executing-plans` - Execute multi-step plans
- `subagent-driven-development` - Delegate to subagents (via @mention)

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
- `dispatching-parallel-agents` - Multi-agent coordination (via @mention)
- `using-superpowers` - Meta-skill (auto-loaded at session start)
- `writing-skills` - TDD methodology for creating skills

### How to Invoke Skills

**Via use_skill Tool:**
```
use use_skill tool with skill_name: "superpowers:test-driven-development"
```

**Find Available Skills:**
```
use find_skills tool
```

**Let OpenCode Choose:**
```
I need to implement a feature using TDD
```
OpenCode recognizes TDD context and may invoke `use_skill` automatically.

### Skills Namespace

**Priority order:**
1. **Project skills**: `project:skill-name` (from `.opencode/skills/`)
2. **Personal skills**: `skill-name` (from `~/.config/opencode/skills/`)
3. **Superpowers skills**: `superpowers:skill-name` (from plugin)

**Naming:**
- `project:my-skill` - Forces project skill lookup
- `my-skill` - Searches project → personal → superpowers
- `superpowers:brainstorming` - Forces superpowers skill lookup

**Shadowing:**
Project skills override personal skills, which override superpowers skills when names match.

### List Skills

```
use find_skills tool
```

Output format:
```
Available skills:

project:my-project-skill
  Use when working with project-specific patterns
  Directory: /path/to/project/.opencode/skills/my-project-skill

my-personal-skill
  Use when you need custom functionality
  Directory: /home/user/.config/opencode/skills/my-personal-skill

superpowers:brainstorming
  Use when beginning any creative work
  Directory: /home/user/.config/opencode/superpowers/skills/brainstorming

[... additional skills ...]
```

## Using Agents

### How Agents Activate

OpenCode doesn't have explicit agent invocation. Agents activate **implicitly** through:

1. **Skill content hints**: Skills contain context that shapes behavior
2. **Natural language patterns**: Keywords in queries
3. **@mention subagents**: OpenCode's native subagent system

**Example:**
```
use use_skill tool with skill_name: "superpowers:test-driven-development"
```
The skill content includes testing expertise guidance, effectively activating **Testing Specialist** behavior.

### Available Agents

13 specialized agent personas (activated implicitly):

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

### OpenCode Subagents

Skills that require subagents use OpenCode's @mention system:

**From skill content:**
```
When delegating tasks, use OpenCode's @mention system to invoke subagents.
```

**Your usage:**
```
@implementer please implement the authentication module from the plan
@reviewer please review the authentication code
```

### Tool Mapping for OpenCode

Skills written for Claude Code reference tools OpenCode may not have:

**Mapping:**
- `TodoWrite` → `update_plan` (OpenCode native)
- `Task` with subagents → `@mention` syntax (OpenCode native)
- `Skill` tool → `use_skill` custom tool (provided by plugin)
- `Read`, `Write`, `Edit`, `Bash` → Use native OpenCode tools

The plugin automatically includes mapping guidance when loading skills.

## Configuration

### Plugin Configuration

The plugin (`superpowers.js`) configures automatically:

**Paths:**
- Project skills: `.opencode/skills/` (current project)
- Personal skills: `~/.config/opencode/skills/`
- Superpowers skills: `~/.config/opencode/superpowers/skills/`

**Tools registered:**
- `use_skill` - Load and read a specific skill
- `find_skills` - List all available skills

**Hooks:**
- `session.created` - Inject bootstrap on new session
- `session.compacted` - Re-inject bootstrap after compaction

### Personal Skills Directory

Create custom skills in `~/.config/opencode/skills/`:

```bash
mkdir -p ~/.config/opencode/skills/my-skill
```

Skills here override superpowers skills with matching names.

### Project Skills Directory

Create project-specific skills in `.opencode/skills/`:

```bash
# In your OpenCode project
mkdir -p .opencode/skills/my-project-skill
```

**Priority**: Project > Personal > Superpowers

### Environment Variables

No environment variables needed - OpenCode manages configuration internally.

### Skill Search Depth

The plugin searches skills recursively:
- **Project skills**: Max 3 levels deep
- **Personal skills**: Max 3 levels deep
- **Superpowers skills**: Max 3 levels deep

Allows nested organization:
```
~/.config/opencode/skills/
├── frontend/
│   ├── react-patterns/SKILL.md
│   └── vue-patterns/SKILL.md
└── backend/
    └── api-design/SKILL.md
```

## Usage Examples

### Example 1: Test-Driven Development

```
use use_skill tool with skill_name: "superpowers:test-driven-development"
```

Then:
```
I need to implement a user search function that filters by name and email
```

OpenCode guides you through:
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
use use_skill tool with skill_name: "superpowers:systematic-debugging"
```

Then:
```
Users report that profile avatars don't load after uploading
```

OpenCode leads you through:
1. **Reproduce**: Confirm the bug exists
2. **Hypothesize**: List possible causes
3. **Test hypothesis**: Add logging, check network
4. **Iterate**: Rule out causes systematically
5. **Fix**: Apply minimal fix
6. **Verify**: Confirm bug resolved

### Example 3: Planning with Subagents

```
use use_skill tool with skill_name: "superpowers:writing-plans"
```

Then:
```
Plan OAuth2 integration with Google and GitHub
```

Creates detailed plan. Then:

```
use use_skill tool with skill_name: "superpowers:subagent-driven-development"
```

Then:
```
@implementer please implement step 1 of the plan
@reviewer please review the implementation
```

OpenCode dispatches subagents per task with review checkpoints.

### Example 4: Design Exploration

```
use use_skill tool with skill_name: "superpowers:brainstorming"
```

Then:
```
Help me design an authentication system with social login and 2FA
```

OpenCode:
- Asks clarifying questions
- Explores design alternatives
- Considers security implications
- Produces architecture document

### Example 5: Code Review Workflow

```
use use_skill tool with skill_name: "superpowers:requesting-code-review"
```

OpenCode:
- Prompts for git commit range
- Uses @mention to invoke code-reviewer subagent
- Returns categorized findings

Then:
```
use use_skill tool with skill_name: "superpowers:receiving-code-review"
```

OpenCode:
- Helps process feedback systematically
- Distinguishes valid concerns from preferences
- Guides implementation of fixes

## Extending

### Add Custom Skills

1. **Create skill directory:**
   ```bash
   mkdir -p ~/.config/opencode/skills/my-custom-skill
   ```

2. **Create SKILL.md:**
   ```markdown
   ---
   name: my-custom-skill
   description: Use when you need to do X, Y, or Z
   ---

   # My Custom Skill

   ## Overview
   [Detailed instructions for OpenCode...]

   ## When to Use
   This skill applies when:
   - Condition 1
   - Condition 2

   ## Workflow
   1. Step 1
   2. Step 2
   3. Step 3

   ## Tool Mapping for OpenCode
   This skill uses these tools:
   - update_plan for task tracking
   - @mention for subagents
   - Native file tools
   ```

3. **Use your skill:**
   ```
   use use_skill tool with skill_name: "my-custom-skill"
   ```

### Add Project Skills

1. **Create project skill directory:**
   ```bash
   # In your OpenCode project
   mkdir -p .opencode/skills/my-project-skill
   ```

2. **Create SKILL.md:**
   ```markdown
   ---
   name: my-project-skill
   description: Use when working with this project's specific patterns
   ---

   # My Project Skill

   ## Project Context
   This skill is specific to [project name].

   [Project-specific guidance...]
   ```

3. **Use your skill:**
   ```
   use use_skill tool with skill_name: "project:my-project-skill"
   ```

### Add Supporting Files

Skills can include additional files:

```bash
~/.config/opencode/skills/my-skill/
├── SKILL.md          # Main skill content (required)
├── examples.md       # Usage examples
├── reference.md      # API reference
└── tools/            # Helper tools
    └── helper.py
```

Reference them in SKILL.md:
```markdown
See examples.md in this skill directory for detailed usage.
Helper tools are available in tools/ subdirectory.
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

1. **List skills:**
   ```
   use find_skills tool
   ```
   Should show your custom skill.

2. **Load skill:**
   ```
   use use_skill tool with skill_name: "my-custom-skill"
   ```
   Should display skill content.

3. **Verify behavior:**
   Engage with skill and observe OpenCode follows guidance.

### Share Custom Skills

1. **Create git repository:**
   ```bash
   cd ~/.config/opencode/skills
   git init
   git add my-custom-skill/
   git commit -m "Add custom skill"
   git remote add origin <your-repo-url>
   git push
   ```

2. **Others can install:**
   ```bash
   cd ~/.config/opencode/skills
   git clone <your-repo-url>/my-custom-skill
   ```

## Troubleshooting

### Plugin Not Loading

**Symptom:** `use_skill` and `find_skills` tools not available

**Solutions:**

1. Check plugin file exists:
   ```bash
   ls ~/.config/opencode/superpowers/.opencode/plugin/superpowers.js
   ```

2. Check symlink:
   ```bash
   ls -l ~/.config/opencode/plugin/superpowers.js
   # Should point to superpowers.js
   ```

3. Check OpenCode logs:
   ```bash
   opencode run "test" --print-logs --log-level DEBUG
   ```
   Look for: `service=plugin path=file:///.../superpowers.js loading plugin`

4. Verify Node.js:
   ```bash
   node --version
   # Should be v14+ (v18+ recommended)
   ```

### Skills Not Found

**Symptom:** `use_skill` returns "Skill not found"

**Solutions:**

1. List available skills:
   ```
   use find_skills tool
   ```

2. Check file structure:
   ```bash
   ls ~/.config/opencode/superpowers/skills/
   # Should show skill directories
   ```

3. Verify SKILL.md exists:
   ```bash
   ls ~/.config/opencode/superpowers/skills/brainstorming/SKILL.md
   ```

4. Check personal/project skills:
   ```bash
   ls ~/.config/opencode/skills/
   ls .opencode/skills/  # In project
   ```

### Tools Not Working

**Symptom:** `use_skill` or `find_skills` fail to execute

**Solutions:**

1. Verify plugin loaded:
   ```
   Do you have superpowers?
   ```
   Should confirm plugin active.

2. Check plugin code:
   ```bash
   cat ~/.config/opencode/plugin/superpowers.js
   # Should be valid JavaScript
   ```

3. Test plugin manually:
   ```bash
   node --input-type=module -e "import('file://$HOME/.config/opencode/plugin/superpowers.js').then(m => console.log(Object.keys(m)))"
   ```

4. Check OpenCode version:
   ```bash
   opencode --version
   # Requires recent version with plugin support
   ```

### Context Not Injecting

**Symptom:** Superpowers not available at session start

**Solutions:**

1. Check session.created hook:
   Look in OpenCode logs for hook execution.

2. Verify using-superpowers skill exists:
   ```bash
   ls ~/.config/opencode/superpowers/skills/using-superpowers/SKILL.md
   ```

3. Restart OpenCode:
   ```bash
   # Kill OpenCode process and restart
   ```

4. Manually load bootstrap:
   ```
   use use_skill tool with skill_name: "superpowers:using-superpowers"
   ```

### Personal Skills Not Overriding

**Symptom:** Superpowers skill loads instead of personal skill

**Solutions:**

1. Use bare name (not `superpowers:` prefix):
   ```
   # Correct (checks personal first)
   use use_skill tool with skill_name: "brainstorming"

   # Wrong (forces superpowers)
   use use_skill tool with skill_name: "superpowers:brainstorming"
   ```

2. Verify personal skill exists:
   ```bash
   ls ~/.config/opencode/skills/brainstorming/SKILL.md
   ```

3. Check skill name matches exactly (case-sensitive)

### Subagents Not Responding

**Symptom:** @mention doesn't invoke subagents

**Solutions:**

1. Verify OpenCode supports subagents:
   ```
   What subagent capabilities do you have?
   ```

2. Use correct @mention syntax:
   ```
   @implementer please implement this feature
   ```

3. Check OpenCode version:
   Subagents require recent OpenCode version.

## Integration Tips

### With Git Hooks

Add verification to pre-commit:

```bash
# .git/hooks/pre-commit
#!/bin/bash
opencode "Use verification-before-completion skill to check staged changes"
```

### With CI/CD

Use in GitHub Actions:

```yaml
- name: Review PR with OpenCode
  run: |
    opencode "Use requesting-code-review skill for PR #${{ github.event.pull_request.number }}"
```

### With Testing Frameworks

Integrate TDD skill:

```bash
# Run tests with TDD guidance
npm test -- --watch --onFailure "opencode 'Use test-driven-development skill to fix failing tests'"
```

### Multi-Platform Projects

Superpowers works across platforms:

- **Gemini CLI**: MCP extension with slash commands
- **Claude Code**: Native plugin with automatic activation
- **Codex**: CLI tools for OpenAI Codex
- **OpenCode**: Plugin with custom tools (this guide)

All share the same 14 skills and 13 agents.

### Editor Integration

Use OpenCode in editors:

- **VS Code**: OpenCode extension available
- **Vim/Neovim**: Call via terminal
- **Emacs**: Use M-x shell-command

### Project Templates

Create project templates with skills:

```bash
# Template project
my-template/
├── .opencode/
│   ├── plugin/
│   │   └── superpowers.js -> ~/.config/opencode/superpowers/.opencode/plugin/superpowers.js
│   └── skills/
│       └── project-patterns/
│           └── SKILL.md
└── ...
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
- **OpenCode Docs**: [https://opencode.ai/docs/](https://opencode.ai/docs/)

### Other Platforms

- **[Gemini CLI Guide](gemini-cli.md)** - Full-featured MCP extension
- **[Claude Code Guide](claude-code.md)** - Native plugin integration
- **[Codex Guide](codex.md)** - CLI tools for OpenAI Codex

## Advanced Topics

### Understanding the Plugin Architecture

**Components:**
1. **superpowers.js** - ES module plugin for OpenCode
2. **skills-core.js** - Shared module for skill discovery (also used by Codex)
3. **Custom tools** - `use_skill` and `find_skills` registered with OpenCode
4. **Event handlers** - `session.created` and `session.compacted` hooks

**Flow:**
1. OpenCode discovers plugin from `~/.config/opencode/plugin/`
2. Plugin registers tools and event handlers
3. On session start, `session.created` event triggers
4. Plugin injects `using-superpowers` skill content
5. Tools become available for skill loading
6. On compaction, plugin re-injects bootstrap (compact version)

### Message Insertion Pattern

When you use `use_skill`, the plugin:

1. Resolves skill path (project > personal > superpowers)
2. Loads skill content
3. Strips frontmatter
4. Inserts as user message with `noReply: true`
5. Returns "Launching skill: [name]"

**Why `noReply: true`?**
- Prevents OpenCode from generating immediate response
- Content persists as user message
- Survives context compaction
- Maintains context throughout session

### Compaction Resilience

Long sessions may trigger context compaction:

1. OpenCode emits `session.compacted` event
2. Plugin detects event
3. Re-injects bootstrap (compact version to save tokens)
4. Core superpowers functionality maintained

**Compact bootstrap:**
- Shorter tool mapping description
- Essential information only
- ~60% fewer tokens than full bootstrap

### Skill Priority Resolution

**Algorithm:**
1. Check for `project:` prefix → search `.opencode/skills/` only
2. Check for `superpowers:` prefix → search superpowers only
3. No prefix → search in order:
   - `.opencode/skills/` (project)
   - `~/.config/opencode/skills/` (personal)
   - `superpowers/skills/` (superpowers)
4. Return first match found

**Shadowing example:**
```
.opencode/skills/tdd/SKILL.md                    # Priority 1
~/.config/opencode/skills/tdd/SKILL.md           # Priority 2
~/.config/opencode/superpowers/skills/test-driven-development/SKILL.md  # Priority 3
```

Use `use_skill` with `skill_name: "tdd"` → loads project skill.

### Performance Considerations

**Token usage:**
- Bootstrap (full): ~1200 tokens
- Bootstrap (compact): ~700 tokens
- Single skill: ~800-1500 tokens (varies by skill)
- Find skills: ~2000 tokens (all skills listed)

**Optimization tips:**
- Skills persist via `noReply: true` messages
- Only load skills you need
- Use `find_skills` sparingly (token-heavy)
- Rely on auto-injected bootstrap for discovery

### Testing Infrastructure

The plugin includes automated tests:

```bash
# Run all tests
./tests/opencode/run-tests.sh --integration --verbose

# Run specific test
./tests/opencode/run-tests.sh --test test-tools.sh
```

**Tests verify:**
- Plugin loading
- Skills-core library functionality
- Tool execution (`use_skill`, `find_skills`)
- Skill priority resolution
- Proper isolation with temp HOME

### Differences from Other Platforms

**vs Gemini CLI:**
- OpenCode: Custom tools (`use_skill`, `find_skills`)
- Gemini: Slash commands (`/skills:*`, `/sp:*`)

**vs Claude Code:**
- OpenCode: Explicit tool invocation
- Claude: Implicit skill activation via Skill tool

**vs Codex:**
- OpenCode: Plugin with hooks and tools
- Codex: CLI tool with manual invocation

**Commonalities:**
- Same 14 skills
- Same 13 agents
- Shared `skills-core.js` module
- Same frontmatter format
- Same shadowing logic

## See Also

- **[OpenCode Docs](https://opencode.ai/docs/)** - Official OpenCode documentation
- **[Plugin API](https://opencode.ai/docs/plugins)** - OpenCode plugin development
- **[Gemini CLI Guide](gemini-cli.md)** - Compare full-featured implementation
- **[Testing Guide](../testing.md)** - Integration testing methodology

---

**Ready to get started? Ask: "use find_skills tool" to see all available skills!**
