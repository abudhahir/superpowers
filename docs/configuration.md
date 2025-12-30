# Configuration Reference

Complete reference for SupremePower configuration options.

## Table of Contents

- [Configuration File Location](#configuration-file-location)
- [Configuration Structure](#configuration-structure)
- [Orchestration Settings](#orchestration-settings)
- [Skills Settings](#skills-settings)
- [Agents Settings](#agents-settings)
- [Display Settings](#display-settings)
- [Wrapper Settings](#wrapper-settings)
- [Managing Configuration](#managing-configuration)
- [Environment Variables](#environment-variables)
- [Configuration Examples](#configuration-examples)

## Configuration File Location

**Default location:**
```
~/.supremepower/config.json
```

**Override with environment variable:**
```bash
export SUPREMEPOWER_CONFIG_PATH=/path/to/custom/location
```

The configuration directory will contain:
```
~/.supremepower/
├── config.json          # Main configuration
├── skills/             # Custom skills
├── agents/             # Custom agents
└── logs/               # Log files
```

## Configuration Structure

Complete default configuration:

```json
{
  "version": "2.0.0",
  "orchestration": {
    "agentActivationThreshold": 8,
    "detectionSensitivity": "medium",
    "fallbackToLLM": true,
    "maxAgentsPerRequest": 3
  },
  "skills": {
    "exposureMode": "commands",
    "generateAliases": true,
    "customSkillsPath": "~/.supremepower/skills"
  },
  "agents": {
    "customAgentsPath": "~/.supremepower/agents",
    "personaDetail": "full",
    "autoCreate": {
      "enabled": true,
      "confirmBeforeSave": true,
      "template": "standard"
    }
  },
  "display": {
    "showActivatedAgents": true,
    "verbose": false,
    "logPath": "~/.supremepower/logs"
  },
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

## Orchestration Settings

Controls agent activation behavior.

### `agentActivationThreshold`

**Type:** `number`
**Default:** `8`
**Range:** `0-20`

Complexity score threshold for automatic agent activation.

**How complexity is calculated:**
- Base score: 0
- +1 per 10 words in message
- +2 per technical keyword detected
- +3 if code block present
- +1 per question mark (inquiry detection)

**Threshold guidelines:**
- `0-4`: Very aggressive (agents on almost everything)
- `5-7`: Aggressive (agents on moderately complex queries)
- `8-10`: **Balanced (recommended)**
- `11-15`: Conservative (agents on complex queries only)
- `16+`: Very conservative (manual activation preferred)

**Example:**
```json
{
  "orchestration": {
    "agentActivationThreshold": 6
  }
}
```

**Via command:**
```bash
/sp:config orchestration.agentActivationThreshold 6
```

---

### `detectionSensitivity`

**Type:** `"low" | "medium" | "high"`
**Default:** `"medium"`

Sensitivity of keyword detection for agent matching.

**Options:**
- `"low"`: Exact keyword matches only
- `"medium"`: Keywords + common synonyms
- `"high"`: Keywords + synonyms + related terms

**Example:**

Query: "I need to make my app faster"

- **Low:** No agents (no exact keyword match)
- **Medium:** Performance Engineer (synonym: "faster" → "performance")
- **High:** Performance Engineer + Frontend/Backend Architect (related: "app" → "architecture")

**Setting:**
```json
{
  "orchestration": {
    "detectionSensitivity": "high"
  }
}
```

---

### `fallbackToLLM`

**Type:** `boolean`
**Default:** `true`

If agent matching fails or no agents activate, use Gemini's LLM to suggest agents.

**When enabled:**
- No keyword matches → Ask LLM to analyze and suggest agents
- Adds ~200ms latency but improves agent selection

**When disabled:**
- No keyword matches → No agents activated
- Faster but may miss relevant agents

**Setting:**
```json
{
  "orchestration": {
    "fallbackToLLM": false
  }
}
```

---

### `maxAgentsPerRequest`

**Type:** `number`
**Default:** `3`
**Range:** `1-5`

Maximum number of agents to activate per request.

**Considerations:**
- More agents = more comprehensive expertise
- More agents = longer prompts, higher token usage
- More agents = potential conflicting advice

**Recommended:**
- Simple projects: 1-2
- Medium projects: 2-3
- Complex projects: 3-4
- Avoid: 5+ (too much context)

**Setting:**
```json
{
  "orchestration": {
    "maxAgentsPerRequest": 2
  }
}
```

---

## Skills Settings

Controls how skills are exposed and loaded.

### `exposureMode`

**Type:** `"commands" | "prompts" | "both"`
**Default:** `"commands"`

How skills are made available to users.

**Options:**

**`"commands"` (recommended):**
- Skills available as slash commands only (`/tdd`, `/plan`, etc.)
- User explicitly invokes skills
- Clean, predictable behavior

**`"prompts"`:**
- Skills automatically loaded based on message analysis
- No slash commands needed
- Wrapper analyzes message and injects relevant skill content
- May activate multiple skills per query

**`"both"`:**
- Skills available both as commands and auto-loaded
- Maximum flexibility
- Higher token usage

**Example:**
```json
{
  "skills": {
    "exposureMode": "both"
  }
}
```

**Behavior with different modes:**

Query: "I want to implement a feature"

- **commands:** No automatic skill loading (use `/plan` or `/implement` explicitly)
- **prompts:** Auto-loads "writing-plans" and "subagent-driven-development" skills
- **both:** Skills available as commands + auto-loaded

---

### `generateAliases`

**Type:** `boolean`
**Default:** `true`

Generate shorter aliases for commonly-used commands.

**Generated aliases:**
- `/brainstorm` → `/bs`
- `/plan` → `/pl`
- `/tdd` → `/tdd` (already short)
- `/debug` → `/dbg`
- `/implement` → `/impl`
- `/verify` → `/vfy`

**Setting:**
```json
{
  "skills": {
    "generateAliases": false
  }
}
```

---

### `customSkillsPath`

**Type:** `string`
**Default:** `"~/.supremepower/skills"`

Directory for custom user-created skills.

Skills in this directory:
- Override core skills with same name (shadowing)
- Available via commands or prompts (based on exposureMode)
- Must follow SKILL.md format with YAML frontmatter

**Example:**
```json
{
  "skills": {
    "customSkillsPath": "~/my-project/.skills"
  }
}
```

**Via command:**
```bash
/sp:config skills.customSkillsPath "~/my-project/.skills"
```

---

## Agents Settings

Controls agent behavior and custom agents.

### `customAgentsPath`

**Type:** `string`
**Default:** `"~/.supremepower/agents"`

Directory for custom user-created agents.

Agents in this directory:
- Available alongside core agents
- Activated via keyword matching
- Must follow agent markdown format

**Setting:**
```json
{
  "agents": {
    "customAgentsPath": "~/my-project/.agents"
  }
}
```

---

### `personaDetail`

**Type:** `"full" | "minimal"`
**Default:** `"full"`

Level of detail in agent persona injection.

**`"full"`:**
- Complete agent persona (role, expertise, guidelines)
- ~300-500 tokens per agent
- Rich, detailed responses

**`"minimal"`:**
- Condensed persona (role + key expertise only)
- ~100-150 tokens per agent
- Saves tokens but less nuanced

**Example:**

**Full persona (frontend-architect):**
```
You are a Frontend Architect specialist with expertise in:
- React, Vue, Angular and modern component frameworks
- State management (Redux, MobX, Zustand, Recoil)
- Performance optimization and bundle size
- Responsive design and accessibility
- Frontend testing strategies

When activated, you should:
- Provide architecture guidance for frontend systems
- Consider scalability and maintainability
- Suggest modern best practices
- Focus on user experience and performance
```

**Minimal persona:**
```
Frontend Architect: React/Vue/Angular, state management, performance, a11y
```

**Setting:**
```json
{
  "agents": {
    "personaDetail": "minimal"
  }
}
```

---

### `autoCreate`

Settings for automatic agent creation feature.

#### `autoCreate.enabled`

**Type:** `boolean`
**Default:** `true`

Enable `/sp:auto-agent-create` command for creating agents.

**Setting:**
```json
{
  "agents": {
    "autoCreate": {
      "enabled": false
    }
  }
}
```

---

#### `autoCreate.confirmBeforeSave`

**Type:** `boolean`
**Default:** `true`

Prompt for confirmation before saving auto-created agent.

**When true:**
- Shows generated agent definition
- Asks "Save this agent? (y/n)"
- Allows editing before save

**When false:**
- Automatically saves without confirmation
- Faster but no review

**Setting:**
```json
{
  "agents": {
    "autoCreate": {
      "confirmBeforeSave": false
    }
  }
}
```

---

#### `autoCreate.template`

**Type:** `string`
**Default:** `"standard"`

Template to use for auto-created agents.

**Available templates:**
- `"standard"`: Full agent with all sections
- `"minimal"`: Condensed agent with essentials only
- Custom: Path to template file

**Setting:**
```json
{
  "agents": {
    "autoCreate": {
      "template": "minimal"
    }
  }
}
```

---

## Display Settings

Controls output and logging behavior.

### `showActivatedAgents`

**Type:** `boolean`
**Default:** `true`

Display which agents were activated in response.

**When true:**
```
[Agents activated: frontend-architect, performance-engineer]

Your response here...
```

**When false:**
```
Your response here...
```

**Setting:**
```json
{
  "display": {
    "showActivatedAgents": false
  }
}
```

---

### `verbose`

**Type:** `boolean`
**Default:** `false`

Enable verbose logging for debugging.

**When enabled:**
- Logs complexity calculation details
- Logs agent matching process
- Logs configuration loading
- Logs skill/agent file discovery

**Output location:** Determined by `logPath`

**Setting:**
```json
{
  "display": {
    "verbose": true
  }
}
```

---

### `logPath`

**Type:** `string`
**Default:** `"~/.supremepower/logs"`

Directory for log files.

**Log files created:**
- `supremepower.log`: Main log file
- `orchestration.log`: Agent activation decisions
- `errors.log`: Error messages only

**Setting:**
```json
{
  "display": {
    "logPath": "/tmp/supremepower-logs"
  }
}
```

---

## Wrapper Settings

Controls `gemini-sp` wrapper script behavior.

### `wrapper.enabled`

**Type:** `boolean`
**Default:** `true`

Enable wrapper script orchestration.

**When true:**
- `gemini-sp` performs complexity analysis and agent selection
- Enhances prompts with agent context

**When false:**
- `gemini-sp` acts as passthrough to `gemini`
- No orchestration (equivalent to calling `gemini` directly)

**Setting:**
```json
{
  "wrapper": {
    "enabled": false
  }
}
```

---

### `wrapper.complexity`

Settings for wrapper complexity analysis.

#### `complexity.minWordCount`

**Type:** `number`
**Default:** `50`
**Range:** `10-200`

Minimum word count to trigger agent activation.

**Guidelines:**
- `10-30`: Very aggressive (most queries get agents)
- `40-60`: **Balanced (recommended)**
- `70-100`: Conservative (longer queries only)
- `100+`: Very conservative (detailed queries only)

**Setting:**
```json
{
  "wrapper": {
    "complexity": {
      "minWordCount": 30
    }
  }
}
```

---

#### `complexity.requireKeywords`

**Type:** `boolean`
**Default:** `true`

Require technical keywords for agent activation (in addition to word count).

**When true:**
- Query must have keywords AND meet word count
- More precise agent activation

**When false:**
- Word count alone can trigger agents
- More aggressive activation

**Examples:**

Query: "I have a very long question about something very important and complex that requires detailed explanation and thorough analysis of many factors" (20 words, no keywords)

- **requireKeywords=true:** No agents (no keywords)
- **requireKeywords=false:** Agents activated (meets word count)

**Setting:**
```json
{
  "wrapper": {
    "complexity": {
      "requireKeywords": false
    }
  }
}
```

---

#### `complexity.checkCodeBlocks`

**Type:** `boolean`
**Default:** `true`

Consider presence of code blocks in complexity calculation.

**When true:**
- Code blocks add +3 to complexity score
- Queries with code more likely to activate agents

**When false:**
- Code blocks ignored in complexity
- Only word count and keywords matter

**Setting:**
```json
{
  "wrapper": {
    "complexity": {
      "checkCodeBlocks": false
    }
  }
}
```

---

## Managing Configuration

### Via Slash Commands

**View entire config:**
```bash
/sp:config
```

**View specific section:**
```bash
/sp:config orchestration
/sp:config skills
/sp:config agents
/sp:config display
/sp:config wrapper
```

**Set specific value:**
```bash
/sp:config orchestration.agentActivationThreshold 10
/sp:config skills.exposureMode "both"
/sp:config display.verbose true
```

**Edit in editor:**
```bash
/sp:config edit
# Opens config.json in $EDITOR
```

### Direct File Editing

**Edit with text editor:**
```bash
nano ~/.supremepower/config.json
```

**Validate JSON syntax:**
```bash
cat ~/.supremepower/config.json | jq .
```

**Reload configuration:**
Restart Gemini CLI or send any command to reload.

### Configuration Validation

Configuration is validated on load. Invalid values cause errors:

**Example errors:**
```
Error: agentActivationThreshold must be a number (got: "8")
Error: exposureMode must be one of: commands, prompts, both (got: "all")
Error: detectionSensitivity must be one of: low, medium, high (got: "ultra")
```

## Environment Variables

Override configuration via environment variables.

### `SUPREMEPOWER_CONFIG_PATH`

Override config directory location.

```bash
export SUPREMEPOWER_CONFIG_PATH=~/my-project/.supremepower
gemini-sp "query"
```

### `SUPREMEPOWER_DEBUG`

Enable debug mode (equivalent to `verbose: true`).

```bash
export SUPREMEPOWER_DEBUG=1
gemini-sp "query"
```

### `SUPREMEPOWER_AGENTS_DISABLED`

Disable all agent activation (testing/debugging).

```bash
export SUPREMEPOWER_AGENTS_DISABLED=1
gemini-sp "query"
# No agents activated regardless of config
```

---

## Configuration Examples

### Example 1: Aggressive Agent Use

For complex projects where you want agents on most queries:

```json
{
  "version": "2.0.0",
  "orchestration": {
    "agentActivationThreshold": 5,
    "detectionSensitivity": "high",
    "fallbackToLLM": true,
    "maxAgentsPerRequest": 4
  },
  "wrapper": {
    "enabled": true,
    "complexity": {
      "minWordCount": 30,
      "requireKeywords": false,
      "checkCodeBlocks": true
    }
  }
}
```

---

### Example 2: Conservative Agent Use

For simple projects or learning, minimize automatic agents:

```json
{
  "version": "2.0.0",
  "orchestration": {
    "agentActivationThreshold": 12,
    "detectionSensitivity": "low",
    "fallbackToLLM": false,
    "maxAgentsPerRequest": 2
  },
  "wrapper": {
    "enabled": true,
    "complexity": {
      "minWordCount": 80,
      "requireKeywords": true,
      "checkCodeBlocks": true
    }
  }
}
```

---

### Example 3: Command-Only Mode

Disable automatic orchestration, use explicit slash commands only:

```json
{
  "version": "2.0.0",
  "skills": {
    "exposureMode": "commands",
    "generateAliases": true
  },
  "wrapper": {
    "enabled": false
  },
  "display": {
    "showActivatedAgents": false
  }
}
```

---

### Example 4: Development/Debugging

Verbose logging, aggressive agents, detailed personas:

```json
{
  "version": "2.0.0",
  "orchestration": {
    "agentActivationThreshold": 6,
    "detectionSensitivity": "high",
    "fallbackToLLM": true,
    "maxAgentsPerRequest": 3
  },
  "agents": {
    "personaDetail": "full"
  },
  "display": {
    "showActivatedAgents": true,
    "verbose": true,
    "logPath": "~/.supremepower/logs"
  }
}
```

---

### Example 5: Performance-Optimized

Minimize token usage for cost savings:

```json
{
  "version": "2.0.0",
  "orchestration": {
    "agentActivationThreshold": 10,
    "maxAgentsPerRequest": 2
  },
  "agents": {
    "personaDetail": "minimal"
  },
  "skills": {
    "exposureMode": "commands"
  },
  "wrapper": {
    "enabled": false
  },
  "display": {
    "showActivatedAgents": false,
    "verbose": false
  }
}
```

---

## Configuration Migration

When upgrading SupremePower versions, configuration may need migration.

### Automatic Migration

On first run after upgrade:
```
Detected config version 1.0.0, current version is 2.0.0
Automatically migrating configuration...
Migration complete. Backup saved to: config.json.backup
```

### Manual Migration

If automatic migration fails:

1. **Backup current config:**
   ```bash
   cp ~/.supremepower/config.json ~/.supremepower/config.json.backup
   ```

2. **Reset to defaults:**
   ```bash
   rm ~/.supremepower/config.json
   gemini  # Triggers creation of default config
   ```

3. **Manually merge customizations:**
   Compare backup with new config and copy over custom values.

---

## Best Practices

1. **Start with defaults** - Understand baseline behavior before customizing
2. **Adjust threshold gradually** - Change by ±2 at a time, test behavior
3. **Use profiles** - Create config variants for different project types
4. **Log when debugging** - Enable verbose only when troubleshooting
5. **Backup before major changes** - Copy config.json before editing
6. **Validate JSON syntax** - Use `jq` to catch syntax errors
7. **Document customizations** - Add comments (JSON5) or separate notes
8. **Review periodically** - As project evolves, revisit config settings

---

## Troubleshooting Configuration

See [Troubleshooting Guide](troubleshooting.md) for common configuration issues.

**Quick checks:**
- JSON syntax valid? `cat ~/.supremepower/config.json | jq .`
- File permissions? `ls -l ~/.supremepower/config.json`
- Environment variable set? `echo $SUPREMEPOWER_CONFIG_PATH`
- Config reloaded? Restart Gemini CLI after edits
