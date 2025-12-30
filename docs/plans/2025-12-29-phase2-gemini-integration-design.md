# Phase 2 Design: Gemini CLI Integration

**Status:** Design Complete
**Date:** December 29, 2025
**Phase:** 2 of 3
**Goal:** Integrate SupremePower framework with Gemini CLI through native extension and smart automation

---

## Executive Summary

Phase 2 delivers SupremePower integration for Gemini CLI using a hybrid approach: a full-featured native extension plus an optional smart wrapper for automatic agent activation. This brings the complete Superpowers methodology (14 skills) and 13 specialized agents to Gemini CLI users with both explicit and automatic workflows.

**Key Achievement:** Users can invoke skills via slash commands (`/brainstorm`, `/tdd`) for explicit workflows, or use the wrapper script (`gemini-sp`) for automatic agent activation based on message complexity.

---

## Architecture Overview

### Core Components

1. **Gemini CLI Extension** (`supremepower-gemini`)
   - Native Gemini extension using Model Context Protocol (MCP)
   - Provides slash commands, MCP tools, and prompts
   - Manages skills, agents, and configuration
   - Installed via: `gemini extensions install https://github.com/superclaude-org/supremepower-gemini`

2. **Smart Wrapper Script** (`gemini-sp`)
   - Optional shell script for automatic agent injection
   - Pre-processes messages before calling `gemini`
   - Smart detection: only activates for complex requests
   - Respects extension configuration

3. **Shared Orchestration Core**
   - Phase 1 JavaScript modules (context parser, agent matcher, etc.)
   - Used by both extension and wrapper
   - Single source of truth for orchestration logic

### User Experience Flows

- **Explicit mode**: `/sp:with frontend-architect "help with React component"`
- **Automatic mode**: `gemini-sp "help with React component"` (wrapper handles orchestration)
- **Skill invocation**: `/brainstorm "Phase 3 features"` or `/tdd`

---

## Extension Structure

### Directory Layout

```
supremepower-gemini/                # GitHub repository
├── gemini-extension.json           # Extension manifest
├── README.md                       # Installation, usage
├── package.json                    # Node.js dependencies
├── tsconfig.json                   # TypeScript config
│
├── mcp-server/                     # MCP server implementation
│   ├── server.ts                   # Main server entry
│   ├── tools/                      # MCP tool handlers
│   │   ├── activate-agents.ts
│   │   ├── get-agent-persona.ts
│   │   ├── list-skills.ts
│   │   ├── fetch-skills.ts
│   │   └── auto-agent-create.ts
│   └── prompts/                    # MCP prompts (if exposureMode=prompts)
│       ├── brainstorming.ts
│       ├── tdd.ts
│       └── ...
│
├── commands/                       # TOML slash commands
│   ├── analyze.toml
│   ├── with.toml
│   ├── agents.toml
│   ├── config.toml
│   ├── status.toml
│   ├── auto-agent-create.toml
│   └── skills/                     # Auto-generated from core/skills/
│       ├── brainstorming.toml
│       ├── test-driven-development.toml
│       └── ...
│
├── scripts/                        # Wrapper and utilities
│   ├── gemini-sp                   # Smart wrapper script
│   └── install.sh                  # Post-install setup
│
├── core/                           # Phase 1 orchestration (copied)
│   ├── orchestration/
│   │   ├── context-parser.js
│   │   ├── conditional-evaluator.js
│   │   ├── agent-matcher.js
│   │   └── index.js
│   ├── agents/                     # 13 built-in agents
│   │   ├── frontend-architect.md
│   │   ├── backend-architect.md
│   │   └── ...
│   └── skills/                     # 14 built-in Superpowers skills
│       ├── brainstorming/
│       ├── test-driven-development/
│       ├── systematic-debugging/
│       └── ...
│
├── lib/                            # Shared utilities
│   ├── config.ts                   # Config management
│   ├── logger.ts                   # Logging utilities
│   ├── persona-injector.ts         # Persona formatting
│   └── detection.ts                # Complexity heuristics
│
└── tests/                          # Test pyramid
    ├── unit/
    ├── integration/
    └── e2e/
```

### User's Local Directory

```
~/.supremepower/
├── config.json                     # Main configuration
├── skills/                         # Custom/override skills
│   └── my-custom-skill/
│       └── SKILL.md
├── agents/                         # Custom agents
│   ├── kubernetes-expert.md
│   └── ios-swiftui-specialist.md
└── logs/                           # Logs and debugging
    ├── orchestration.log
    ├── error.log
    └── crash-2025-12-29.log
```

---

## Slash Commands

### Skills Commands (Auto-generated)

**Full namespaced:**
- `/sp:brainstorming` - Interactive design exploration
- `/sp:writing-plans` - Create implementation plans
- `/sp:test-driven-development` - TDD methodology
- `/sp:systematic-debugging` - Scientific debugging approach
- `/sp:subagent-driven-development` - Execute plans with subagents
- `/sp:executing-plans` - Plan execution with checkpoints
- `/sp:requesting-code-review` - Request code review
- `/sp:receiving-code-review` - Handle review feedback
- `/sp:finishing-a-development-branch` - Complete branch workflow
- `/sp:using-git-worktrees` - Create isolated workspaces
- `/sp:verification-before-completion` - Pre-commit verification
- `/sp:dispatching-parallel-agents` - Parallel task execution
- `/sp:writing-skills` - Create new skills

**Convenient aliases:**
- `/brainstorm` → `/sp:brainstorming`
- `/plan` → `/sp:writing-plans`
- `/tdd` → `/sp:test-driven-development`
- `/debug` → `/sp:systematic-debugging`
- `/implement` → `/sp:subagent-driven-development`

### Orchestration Commands

- `/sp:analyze <message>` - Show which agents would activate (dry-run)
- `/sp:with <agents> <message>` - Force specific agents for request
- `/sp:agents` - List available agents with expertise
- `/sp:status` - Show last orchestration details (debugging dashboard)

### Management Commands

- `/sp:config show` - View all configuration
- `/sp:config get <key>` - Get specific setting
- `/sp:config set <key> <value>` - Update setting
- `/sp:config reset` - Reset to defaults
- `/sp:fetch-skills <repo-url>` - Pull skills from GitHub/GitLab
- `/sp:auto-agent-create <purpose>` - Generate custom agent for domain

### MCP Tools (Called by Gemini)

- `supremepower__activate_agents` - Core orchestration logic
- `supremepower__get_agent_persona` - Retrieve agent details
- `supremepower__list_skills` - Query available skills

---

## Configuration System

### Configuration File Schema

**Location:** `~/.supremepower/config.json`

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

### Configuration Options

**Skills Exposure Mode:**
- `"commands"` (default) - TOML slash commands
- `"prompts"` - MCP prompts using Gemini's native prompt system
- `"both"` - Dual exposure for maximum flexibility

**Detection Sensitivity:**
- `"low"` - Only very complex requests trigger orchestration
- `"medium"` (default) - Balanced heuristics
- `"high"` - Most requests trigger orchestration

**Persona Detail:**
- `"full"` (default) - Complete agent expertise and principles
- `"minimal"` - Condensed version for token efficiency

---

## Smart Wrapper Script

### Purpose

Optional automation layer for users who want "just works" agent activation without explicit commands.

### Script Behavior

```bash
# User runs:
gemini-sp "help me build a React component with hooks"

# Script execution:
1. Detect if complex request (complexity heuristics)
2. If complex: Run orchestration (analyze skills + activate agents)
3. If orchestration fails: Retry with fallback logic
4. If still fails: Show warning, continue without agents
5. Inject agent personas into prompt
6. Call real `gemini` CLI with enhanced prompt
```

### Smart Detection Heuristics (Hybrid Approach)

**Primary: Complexity Heuristics**
- Message length > 50 words
- Contains technical keywords (React, API, database, performance, etc.)
- Multiple questions or sentences
- Contains code blocks or file paths

**Fallback: LLM Classification**
- If heuristics are uncertain (edge case)
- Quick LLM pre-call: "Does this need specialized help? yes/no"
- More accurate but adds latency
- Only used when heuristics can't decide

### Pass-through Cases (No Orchestration)

- Slash commands: `/sp:*`, `/brainstorm`, etc. (handled by extension)
- Simple queries: "what's the weather", "hello"
- Interactive mode: user already in `gemini` session

### Configuration Respect

- Reads `~/.supremepower/config.json`
- Uses same threshold, agents, skills as extension
- Single source of truth for all settings

---

## Agent Persona Injection

### Injection Format

When agents are activated, their personas are injected with rich context:

```markdown
# Active Expert Personas

The following specialized experts are available to assist with this request:

## Frontend Architect
**Expertise:** UI/UX architecture, React, Vue, Angular, state management
**Working Principles:**
- Component composition over inheritance
- Performance-first design decisions
- Accessibility as a core requirement
- Progressive enhancement strategies
**Focus areas for this request:** React component design, state management

## Performance Engineer
**Expertise:** Performance optimization, profiling, benchmarking
**Working Principles:**
- Measure first, optimize second
- Profile in production-like environments
- Focus on user-perceived performance
**Focus areas for this request:** Component rendering optimization

---

[User's original message]
```

### Design Decisions

1. **Rich context** - Full agent expertise + principles (not just "you are frontend-architect")
2. **Relevant focus** - Orchestration highlights which aspects are relevant to user's message
3. **Clear separation** - Markdown formatting separates persona context from user message
4. **Multiple agents** - When multiple agents activate, all personas included

### Token Optimization

- Only include activated agents (not all 13)
- Truncate agent descriptions if token budget tight
- Config option: `personaDetail: "full" | "minimal"`

---

## Auto-Agent-Create Feature

### Command

`/sp:auto-agent-create <purpose/domain>`

### Functionality

```bash
# Example usage:
/sp:auto-agent-create "Kubernetes deployment expert"
/sp:auto-agent-create "iOS SwiftUI specialist"
/sp:auto-agent-create "PostgreSQL query optimizer"

# Process:
1. Takes user's purpose description
2. Uses Gemini to generate agent definition based on:
   - Purpose/domain specified
   - Template from built-in agents
   - Keywords and expertise areas relevant to domain
3. Creates agent.md file in ~/.supremepower/agents/
4. Agent immediately available for activation
```

### Generated Agent Format

```markdown
---
name: kubernetes-deployment-expert
expertise:
  - Kubernetes cluster management
  - Deployment strategies
  - Helm charts and manifests
  - Container orchestration
  - Service mesh configuration
activation_keywords:
  - kubernetes
  - k8s
  - deployment
  - helm
  - pod
  - container
complexity_threshold: high
---

# Kubernetes Deployment Expert

You are a specialist in Kubernetes deployment and orchestration...

[Content generated by Gemini based on purpose]
```

### Configuration

```json
{
  "agents": {
    "autoCreate": {
      "enabled": true,
      "confirmBeforeSave": true,
      "template": "standard"
    }
  }
}
```

---

## Error Handling and Graceful Degradation

### Failure Scenarios

**Skill Loading Fails**
- Log error to `~/.supremepower/logs/error.log`
- Try fallback: Use only embedded skills (skip custom)
- If still fails: Show warning, proceed without skills
- Warning: `[Warning: Skill loading failed, agents disabled for this request]`

**Agent Matching Fails**
- Retry with simplified logic (skip conditionals, use only keywords)
- If still fails: Fallback to no agents
- Log detailed error with stack trace
- Warning: `[Warning: Agent activation failed, continuing without specialized agents]`

**LLM Fallback Fails** (smart detection)
- Don't block user - assume it's complex
- Proceed with orchestration
- Log timeout for metrics
- No warning (silent fallback to safe default)

**MCP Server Crashes**
- Gemini CLI handles restart automatically
- Extension logs crash details
- User sees: "Tool temporarily unavailable, retrying..."
- Slash commands queue until server recovers

**Config File Corrupt**
- Show clear error: "Config file corrupt at line X"
- Offer: "Reset to defaults? [y/n]" or "Edit with /sp:config edit"
- Until fixed: Use built-in defaults
- Extension remains functional

### Logging Strategy

- Error logs: `~/.supremepower/logs/error.log`
- Orchestration logs: `~/.supremepower/logs/orchestration.log` (if verbose=true)
- Crash dumps: `~/.supremepower/logs/crash-YYYY-MM-DD.log`

---

## Request Flow

### Flow 1: Automatic Mode (Wrapper)

```
User: gemini-sp "build a React component with state management"
  ↓
1. Wrapper receives message
  ↓
2. Complexity detection (heuristics)
   - Length: 47 words ✗
   - Keywords: "React", "component", "state management" ✓
   - Decision: COMPLEX → Run orchestration
  ↓
3. Load configuration (~/.supremepower/config.json)
  ↓
4. Load skills (embedded + custom from ~/.supremepower/skills/)
  ↓
5. Load agents (built-in + custom from ~/.supremepower/agents/)
  ↓
6. Run orchestration (Phase 1 core):
   - Extract context hints from skills
   - Parse conditional blocks
   - Score agents against user message
   - Result: [frontend-architect: 15, javascript-expert: 12]
  ↓
7. Inject personas (rich format with principles)
  ↓
8. Call: gemini [enhanced prompt with personas + user message]
  ↓
9. Gemini responds (with agent expertise)
  ↓
10. Display: "[Agents: frontend-architect, javascript-expert]\n[Gemini's response]"
```

### Flow 2: Explicit Mode (Slash Command)

```
User in Gemini CLI: /sp:with frontend-architect "optimize this component"
  ↓
1. Gemini CLI routes to extension MCP server
  ↓
2. MCP tool handler: supremepower__activate_specific_agents
  ↓
3. Load agent: frontend-architect.md
  ↓
4. Format persona (rich injection)
  ↓
5. Return to Gemini as tool result
  ↓
6. Gemini processes with agent context
  ↓
7. Response includes frontend-architect expertise
```

### Flow 3: Skill Invocation

```
User: /brainstorm "Phase 3 features"
  ↓
1. Command alias resolves to /sp:brainstorming
  ↓
2. Extension loads: core/skills/brainstorming/SKILL.md
  ↓
3. Parses skill content (markdown with agent hints)
  ↓
4. Skill content injected into Gemini prompt
  ↓
5. Gemini follows brainstorming methodology
  ↓
6. Interactive dialogue begins (per skill instructions)
```

---

## Testing Strategy

### Full Test Pyramid

**Level 1: Unit Tests (Fast - Jest)**
- ✅ Phase 1 orchestration modules (44 existing tests)
- **New for Phase 2:**
  - MCP tool handlers (activate_agents, get_agent_persona, etc.)
  - Wrapper script detection logic (complexity heuristics)
  - Configuration management (read/write/validate)
  - Persona injection formatting
  - Auto-agent-create prompt generation
  - **Target:** 30+ new unit tests

**Level 2: Integration Tests (Medium - Jest + Node)**
- Extension MCP server startup/shutdown
- Slash command invocation (TOML → handler execution)
- Config file read/write with slash commands
- Skills loading (embedded + local override)
- Agents loading (built-in + custom)
- Auto-agent-create end-to-end (prompt → file creation)
- **Target:** 15+ integration tests

**Level 3: E2E Tests (Slow - Real Gemini CLI)**
- Spawn `gemini` process with extension installed
- Send test messages via wrapper script
- Verify agent activation in responses
- Test slash commands: `/brainstorm`, `/tdd`, `/sp:analyze`
- Verify orchestration with real skills
- Check subtle indicator output `[Agents: frontend-architect]`
- **Target:** 10+ E2E tests

### Test Infrastructure

```
tests/
├── unit/                       # Fast unit tests
│   ├── orchestration/          # Phase 1 tests (existing)
│   ├── mcp-handlers/           # New MCP tool tests
│   └── wrapper/                # Wrapper script tests
├── integration/                # Integration tests
│   ├── extension/              # Extension loading
│   └── config/                 # Config management
└── e2e/                        # End-to-end tests
    ├── gemini-cli/             # Real Gemini CLI tests
    └── helpers/                # Test utilities
```

### Coverage Target

- Overall coverage: > 80% on new code
- Critical paths: 100% coverage (orchestration, error handling)
- TDD methodology: RED → GREEN → REFACTOR for all new features

---

## Installation and Setup

### Installation Flow

**Step 1: Install Extension from GitHub**

```bash
# Install from main branch (latest)
gemini extensions install https://github.com/superclaude-org/supremepower-gemini

# Or install specific version
gemini extensions install https://github.com/superclaude-org/supremepower-gemini --ref=v2.0.0

# Or install pre-release
gemini extensions install https://github.com/superclaude-org/supremepower-gemini --pre-release
```

**Step 2: Post-Install Setup (Automatic)**

Extension runs setup script on first load:
1. Creates `~/.supremepower/` directory
2. Copies default `config.json`
3. Creates `skills/`, `agents/`, `logs/` subdirectories
4. Installs wrapper script to PATH (asks user for permission)
5. Shows welcome message with next steps

**Step 3: Verify Installation**

```bash
# In Gemini CLI
/sp:agents                  # List available agents
/brainstorm                 # Test skill alias
/sp:config show             # View configuration

# Test wrapper (if installed)
gemini-sp "help me build a React app"
```

### Optional: Manual Wrapper Install

If user declined auto-install:

```bash
# Link wrapper manually
ln -s ~/.gemini/extensions/supremepower/scripts/gemini-sp ~/.local/bin/gemini-sp
```

### Update Extension

```bash
gemini extensions update supremepower
# Or update all
gemini extensions update --all
```

### Uninstall

```bash
gemini extensions uninstall supremepower
# Optional: Remove user data
rm -rf ~/.supremepower
```

---

## Success Criteria

Phase 2 is complete when all these criteria are met:

### Core Functionality

- ✅ Extension installs via `gemini extensions install <github-url>`
- ✅ All 14 Superpowers skills available as slash commands (`/brainstorm`, `/tdd`, etc.)
- ✅ Convenient aliases work (`/tdd`, `/implement`, `/brainstorm`, `/plan`, `/debug`)
- ✅ 13 built-in agents load and activate based on user messages
- ✅ Wrapper script (`gemini-sp`) provides automatic agent injection
- ✅ Configuration system works (file + slash commands)
- ✅ Custom agents can be created in `~/.supremepower/agents/`
- ✅ Custom skills can override built-ins from `~/.supremepower/skills/`
- ✅ `/sp:auto-agent-create` generates working agent definitions
- ✅ `/sp:fetch-skills` pulls skills from GitHub/GitLab repositories

### User Experience

- ✅ Subtle indicator shows activated agents: `[Agents: frontend-architect]`
- ✅ Orchestration completes in < 500ms (not blocking user)
- ✅ Error handling shows helpful messages, doesn't crash
- ✅ Extension updates work: `gemini extensions update supremepower`
- ✅ Skills exposure modes work: commands, prompts, both

### Testing

- ✅ All Phase 1 tests still passing (44 unit tests)
- ✅ 30+ new unit tests for MCP handlers and wrapper
- ✅ 15+ integration tests for extension features
- ✅ 10+ E2E tests with real Gemini CLI
- ✅ Test coverage > 80% on new code
- ✅ TDD methodology applied throughout

### Documentation

- ✅ README with installation, configuration, usage
- ✅ Example workflows for common use cases
- ✅ Troubleshooting guide for common issues
- ✅ API documentation for slash commands
- ✅ Configuration reference
- ✅ Contributing guide

---

## Future Enhancements (Phase 3+)

**Not in scope for Phase 2, but documented for future:**

1. **Agent Marketplace**
   - Community-driven agent registry
   - Browse/install agents: `/sp:agents:install <name>`
   - Rating and review system
   - Curated collections

2. **Enhanced Orchestration**
   - Agent dependency resolution
   - Multi-agent collaboration patterns
   - Context size optimization
   - Agent personas with memory/state

3. **GitHub Copilot Adapter**
   - Instructions template system
   - Skill rendering for Copilot format
   - Agent persona injection
   - Prove cross-platform portability

4. **NPM Package Distribution**
   - `npm install -g @supremepower/gemini-extension`
   - Easier updates and versioning
   - Alternative to GitHub installation

---

## Technical Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Integration approach | Hybrid (extension + wrapper) | Flexibility: explicit and automatic workflows |
| Extension mechanism | Gemini CLI native extensions | Official, supported, uses MCP protocol |
| Orchestration timing | Pre-prompt preprocessing | Simple, works with existing commands |
| Detection logic | Complexity heuristics + LLM fallback | Fast primary, accurate fallback |
| Skills exposure | Configurable (commands/prompts/both) | User preference, different use cases |
| Agent customization | User can add custom agents | Company-specific needs, extensibility |
| Configuration | Hybrid (file + slash commands) | Power users and casual users both served |
| Error handling | Graceful degradation with retry | Maximize reliability, transparent failures |
| Distribution | GitHub releases + repository | Native to Gemini, versioned, updateable |
| Testing | Full test pyramid | Quality assurance, catch regressions |

---

## Appendix: MCP Protocol Details

### MCP Server Definition

**File:** `gemini-extension.json`

```json
{
  "name": "supremepower",
  "version": "2.0.0",
  "description": "Universal skills and agent framework for coding agents",
  "mcpServers": {
    "supremepower": {
      "command": "node",
      "args": ["mcp-server/server.js"],
      "cwd": "${extensionPath}",
      "timeout": 5000
    }
  }
}
```

### MCP Tools Registration

**Example:** `activate_agents` tool

```typescript
server.registerTool(
  'activate_agents',
  {
    description: 'Analyze user message and activate appropriate agents',
    inputSchema: z.object({
      userMessage: z.string(),
      forceAgents: z.array(z.string()).optional(),
    }).shape,
  },
  async ({ userMessage, forceAgents }) => {
    // Load skills and agents
    // Run orchestration
    // Return activated agent personas
  },
);
```

### TOML Command Example

**File:** `commands/brainstorming.toml`

```toml
description = "Interactive design exploration through dialogue"
prompt = """
I'm going to use the brainstorming skill to explore this topic.

${input}
"""

[[context]]
type = "file"
path = "core/skills/brainstorming/SKILL.md"
```

---

**End of Phase 2 Design Document**

Phase 2 provides a complete Gemini CLI integration with both explicit skill invocation and automatic agent activation, bringing the full power of Superpowers methodology to Gemini users.
