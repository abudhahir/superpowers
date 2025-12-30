# SupremePower for Gemini CLI

Universal skills and agent framework bringing Superpowers methodology to Gemini CLI.

## Features

- **14 Superpowers Skills** - All skills accessible via `/skills:*` commands plus 5 short aliases
- **13 Specialized Agents** - Automatic activation based on context and complexity
- **6 Management Commands** - Agent control via `/sp:*` commands (agents, analyze, with, config, status, auto-agent-create)
- **Hybrid Workflows** - Explicit slash commands or automatic orchestration
- **Native Integration** - Uses Gemini CLI's MCP extension system with 5 MCP tools
- **Smart Wrapper** - Automatic agent selection with `gemini-sp` command (optional)
- **Flexible Configuration** - JSON-based config at `~/.supremepower/config.json`

## Quick Start

### Installation

```bash
# Install from GitHub
gemini extensions install https://github.com/superclaude-org/supremepower-gemini

# Verify installation
gemini
/sp:agents
```

### Basic Usage

**Invoke skills with short aliases:**
```bash
/brainstorm "Phase 3 features"
/tdd
/plan "authentication system"
/debug
/implement
```

**Or use full skill names:**
```bash
/skills:brainstorming "Phase 3 features"
/skills:test-driven-development
/skills:writing-plans "authentication system"
/skills:systematic-debugging
```

**Manage agents:**
```bash
/sp:agents                           # List available agents
/sp:analyze "your message"           # Preview agent activation
/sp:with frontend-architect "help"   # Force specific agent
/sp:config                           # View/edit configuration
/sp:status                           # Show system status
/sp:auto-agent-create                # Create custom agent
```

**Use smart wrapper for automatic orchestration:**
```bash
gemini-sp "help me build a React component with TypeScript"
# Agents automatically activated based on complexity and keywords
```

## Documentation

- [Installation Guide](docs/installation.md) - Complete setup instructions
- [Usage Guide](docs/usage.md) - Detailed command examples and workflows
- [Configuration Reference](docs/configuration.md) - All config options explained
- [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions

## Available Skills

All 14 Superpowers skills included with short aliases and full names:

| Skill | Short Alias | Full Command | Description |
|-------|-------------|--------------|-------------|
| Brainstorming | `/brainstorm` | `/skills:brainstorming` | Interactive design exploration and requirements gathering |
| Test-Driven Development | `/tdd` | `/skills:test-driven-development` | Red-Green-Refactor methodology for robust code |
| Writing Plans | `/plan` | `/skills:writing-plans` | Create detailed implementation plans |
| Executing Plans | - | `/skills:executing-plans` | Execute multi-step implementation plans |
| Systematic Debugging | `/debug` | `/skills:systematic-debugging` | Methodical debugging workflow |
| Subagent-Driven Development | `/implement` | `/skills:subagent-driven-development` | Delegate independent tasks to subagents |
| Requesting Code Review | - | `/skills:requesting-code-review` | Request thorough code review |
| Receiving Code Review | - | `/skills:receiving-code-review` | Process review feedback systematically |
| Finishing Development Branch | - | `/skills:finishing-a-development-branch` | Complete and merge development work |
| Using Git Worktrees | - | `/skills:using-git-worktrees` | Manage parallel development with git worktrees |
| Verification Before Completion | - | `/skills:verification-before-completion` | Verify work before claiming completion |
| Dispatching Parallel Agents | - | `/skills:dispatching-parallel-agents` | Coordinate multiple independent tasks |
| Using Superpowers | - | `/skills:using-superpowers` | Meta-skill for finding and using skills |
| Writing Skills | - | `/skills:writing-skills` | Create new skills with TDD methodology |

## Management Commands

Control agents and configuration with `/sp:*` commands:

| Command | Description |
|---------|-------------|
| `/sp:agents` | List all available agents with their expertise areas |
| `/sp:analyze <message>` | Preview which agents would activate for a message |
| `/sp:with <agent> <message>` | Force activation of specific agent |
| `/sp:auto-agent-create` | Create custom agent interactively |
| `/sp:config [key] [value]` | View or edit configuration |
| `/sp:status` | Show system status and diagnostics |

## Available Agents

13 specialized agents automatically activated based on context:

### Architecture & Design
- **Frontend Architect** - React, Vue, Angular, UI/UX patterns
- **Backend Architect** - APIs, microservices, system design
- **System Architect** - Distributed systems, scalability, architecture decisions

### Development Specialists
- **JavaScript Expert** - Modern JS/TS, Node.js, npm ecosystem
- **Python Expert** - Python best practices, Django, FastAPI, data science
- **Database Specialist** - SQL, NoSQL, query optimization, schema design

### Quality & Operations
- **Testing Specialist** - Unit tests, integration tests, TDD, test frameworks
- **Performance Engineer** - Optimization, profiling, benchmarking
- **Security Engineer** - Vulnerability analysis, secure coding, auth
- **DevOps Engineer** - CI/CD, Docker, K8s, deployment automation

### Integration & Documentation
- **API Specialist** - REST, GraphQL, API design, integration patterns
- **Code Reviewer** - Code quality, best practices, maintainability
- **Technical Writer** - Documentation, API docs, user guides

## How It Works

### 1. Skills with Agent Hints

Skills contain context hints that trigger agent activation:

```markdown
## Context Hints

When working on frontend architecture, consider:
- Component design patterns
- State management architecture
- Performance optimization strategies

This naturally activates the **Frontend Architect** agent.
```

### 2. Conditional Agent Blocks

Skills can explicitly activate agents with conditions:

```markdown
## Conditional Blocks

IF user_message contains "React" OR "component" OR "frontend"
THEN ACTIVATE frontend-architect
CONFIDENCE high
```

### 3. Automatic Orchestration

The `gemini-sp` wrapper analyzes message complexity:
- Word count threshold (default: 50 words)
- Technical keywords detection
- Code block presence
- Complexity score calculation

When threshold met, agents are automatically activated and injected into the prompt.

## Configuration

Configuration stored in `~/.supremepower/config.json`:

```json
{
  "version": "2.0.0",
  "orchestration": {
    "agentActivationThreshold": 8,
    "detectionSensitivity": "medium"
  },
  "skills": {
    "exposureMode": "commands",
    "customSkillsPath": "~/.supremepower/skills"
  },
  "agents": {
    "customAgentsPath": "~/.supremepower/agents",
    "autoCreate": {
      "enabled": true,
      "confirmBeforeSave": true
    }
  },
  "display": {
    "showActivatedAgents": true,
    "verbose": false
  },
  "wrapper": {
    "enabled": true,
    "complexity": {
      "minWordCount": 50,
      "requireKeywords": true
    }
  }
}
```

See [Configuration Reference](docs/configuration.md) for complete details.

## Examples

### Example 1: Automatic Agent Activation

```bash
gemini-sp "I need to optimize our React app's rendering performance. \
The component tree is deep and we're seeing lag on user interactions."
```

**Activated agents:** Frontend Architect, Performance Engineer

### Example 2: Explicit Skill Invocation

```bash
# Use short alias
/tdd

# Or use full command name
/skills:test-driven-development

# Both activate Testing Specialist agent automatically
# and guide through Red-Green-Refactor cycle
```

### Example 3: Custom Agent Creation

```bash
/sp:auto-agent-create
# Interactive prompt to create domain-specific agent
# Analyzes project context to suggest specializations
# Saves to ~/.supremepower/agents/
```

### Example 4: Agent Management

```bash
# List all available agents
/sp:agents

# Preview which agents would activate for a message
/sp:analyze "optimize database queries"

# Force specific agent regardless of auto-detection
/sp:with database-specialist "help with indexing"

# View current configuration
/sp:config

# Check system status
/sp:status
```

## Development

### Project Structure

```
supremepower-gemini/
├── core/                  # Core framework
│   ├── agents/           # Agent definitions (13 agents)
│   ├── skills/           # Superpowers skills (14 skills)
│   └── orchestration/    # Orchestration engine
├── mcp-server/           # Gemini CLI MCP server
│   └── src/
│       ├── server.ts     # Main MCP server
│       └── lib/          # Libraries (config, agent-loader)
├── commands/             # Slash commands (TOML format)
│   └── sp/              # Management commands
├── scripts/              # Utilities
│   ├── gemini-sp        # Smart wrapper script
│   ├── wrapper-lib.js   # Wrapper orchestration logic
│   └── install.sh       # Post-install setup
└── docs/                # Documentation
```

### Running Tests

```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Building

```bash
npm run build           # Compile TypeScript
npm run dev            # Watch mode for development
```

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Roadmap

### Phase 2 (Current)
- Gemini CLI integration via MCP
- Slash command system
- Smart wrapper script
- Configuration management

### Phase 3 (Planned)
- GitHub Copilot adapter
- VS Code extension
- Multi-platform CLI tool
- Enhanced agent learning

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- GitHub Issues: [Report bugs or request features](https://github.com/superclaude-org/supremepower-gemini/issues)
- Documentation: [docs/](docs/)
- Examples: [examples/](examples/)

## Acknowledgments

Built on:
- **Superpowers** - Disciplined development methodology by Anthropic
- **SuperGemini** - Agent orchestration concepts
- **MCP SDK** - Model Context Protocol by Anthropic
