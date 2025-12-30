# SupremePower Framework

Universal skills and agent orchestration system for AI coding assistants.

## Overview

SupremePower brings disciplined software development workflows—Test-Driven Development, systematic debugging, code review, and planning—to AI coding environments through a library of 14 battle-tested skills and 13 specialized agent personas.

**Key Principle:** Skills invoke agents through natural language context hints and explicit conditions, ensuring the right expertise is activated for each task.

## Supported Platforms

SupremePower integrates with multiple AI coding platforms through platform-specific adapters that share a common core framework:

| Platform | Integration Type | Status | Installation |
|----------|------------------|--------|--------------|
| **[Gemini CLI](docs/platforms/gemini-cli.md)** | MCP Extension | ✅ Complete | Native extension with slash commands |
| **[Claude Code](docs/platforms/claude-code.md)** | Plugin | ✅ Complete | Marketplace plugin with hooks |
| **[Codex](docs/platforms/codex.md)** | CLI Tools | ✅ Complete | Fetch-and-follow bootstrap |
| **[OpenCode](docs/platforms/opencode.md)** | Plugin | ✅ Complete | Custom tools integration |

**Choose your platform above for detailed installation and usage guides.**

## Quick Start by Platform

### Gemini CLI

```bash
# Install extension
gemini extensions install https://github.com/abudhahir/superpowers

# Use skills via slash commands
/brainstorm "new feature design"
/tdd
/sp:agents
```

**[→ Full Gemini CLI Guide](docs/platforms/gemini-cli.md)**

### Claude Code

```bash
# Install from marketplace
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace

# Use skills via Skill tool
## Skills are automatically available
```

**[→ Full Claude Code Guide](docs/platforms/claude-code.md)**

### Codex

```bash
# Clone and bootstrap
git clone https://github.com/abudhahir/superpowers ~/.codex/superpowers
~/.codex/superpowers/.codex/superpowers-codex bootstrap

# Skills are now available in Codex
```

**[→ Full Codex Guide](docs/platforms/codex.md)**

### OpenCode

```bash
# Install to OpenCode plugins
git clone https://github.com/abudhahir/superpowers ~/.config/opencode/superpowers

# Skills available via use_skill tool
```

**[→ Full OpenCode Guide](docs/platforms/opencode.md)**

## Skills Library

All platforms share 14 Superpowers skills:

### Process Skills
- **brainstorming** - Design exploration through dialogue before coding
- **writing-plans** - Create detailed implementation plans with TDD steps
- **executing-plans** - Execute multi-step plans with checkpoints
- **subagent-driven-development** - Delegate tasks to parallel subagents

### Testing & Quality
- **test-driven-development** - RED-GREEN-REFACTOR methodology
- **systematic-debugging** - Scientific debugging approach with hypotheses
- **verification-before-completion** - Pre-commit verification checklist

### Collaboration
- **requesting-code-review** - Structured review requests with context
- **receiving-code-review** - Review feedback integration workflow
- **finishing-a-development-branch** - Branch completion and cleanup

### Tools
- **using-git-worktrees** - Isolated workspace creation for parallel work
- **dispatching-parallel-agents** - Multi-agent task coordination
- **using-superpowers** - Meta-skill for discovering and using skills
- **writing-skills** - TDD methodology for creating new skills

**[→ Detailed Skill Reference](docs/skills-reference.md)**

## Agent Personas

13 specialized agents activate automatically based on context and complexity:

### Architecture & Design
- **Frontend Architect** - React, Vue, Angular, UI/UX patterns, state management
- **Backend Architect** - APIs, microservices, system design, data flow
- **System Architect** - Distributed systems, scalability, infrastructure decisions

### Development Specialists
- **JavaScript Expert** - Modern JS/TS, Node.js, npm ecosystem, tooling
- **Python Expert** - Python best practices, Django, FastAPI, data science
- **Database Specialist** - SQL, NoSQL, query optimization, schema design

### Quality & Operations
- **Testing Specialist** - Unit tests, integration tests, TDD, test frameworks
- **Performance Engineer** - Optimization, profiling, benchmarking, bottleneck analysis
- **Security Engineer** - Vulnerability analysis, secure coding, authentication
- **DevOps Engineer** - CI/CD, Docker, Kubernetes, deployment automation

### Integration & Documentation
- **API Specialist** - REST, GraphQL, API design, integration patterns
- **Code Reviewer** - Code quality, best practices, maintainability analysis
- **Technical Writer** - Documentation, API docs, tutorials, user guides

**[→ Detailed Agent Reference](docs/agents-reference.md)**

## How It Works

### 1. Platform-Agnostic Core

All platforms share the same core framework:

```
core/
├── orchestration/    # Agent activation logic
│   ├── context-parser.js         # Extract hints from skill content
│   ├── conditional-evaluator.js  # Parse IF/WHEN blocks
│   └── agent-matcher.js          # Keyword-based scoring
├── agents/           # 13 agent definitions (markdown)
└── skills/           # 14 skills library (markdown)

lib/
├── index.js          # Core orchestration API
├── agent-loader.js   # Agent definition loader
└── skills-core.js    # Skill discovery and parsing
```

### 2. Platform Adapters

Each platform has a specific integration layer:

- **Gemini CLI**: MCP server with 5 tools + TOML slash commands
- **Claude Code**: Plugin with SessionStart hooks + native Skill tool
- **Codex**: CLI tool with fetch-and-follow bootstrap
- **OpenCode**: Plugin with custom tools integration

### 3. Agent Activation

Skills contain natural language hints that trigger agent activation:

```markdown
## Architecture Design

When building React components, consider:
- Component composition patterns
- State management architecture
- Performance optimization strategies

This activates the **Frontend Architect** agent.
```

Or explicit conditional blocks:

```markdown
IF user_message contains "performance" OR "optimization" OR "slow"
THEN ACTIVATE performance-engineer
CONFIDENCE high
```

## Architecture Principles

### Platform Independence
- **Core framework is platform-agnostic** - Works anywhere JavaScript runs
- **Adapters are platform-specific** - Handle platform integration details
- **Clean separation** - Core has zero platform dependencies

### Shared Skills and Agents
- **One skills library** - All platforms use the same 14 skills
- **One agent system** - All platforms use the same 13 agents
- **Consistent workflows** - Same methodology across platforms

### Extensibility
- **Custom skills** - Add domain-specific skills in `~/.supremepower/skills/`
- **Custom agents** - Create specialized agents in `~/.supremepower/agents/`
- **Platform adapters** - Add new platform integrations

**[→ Architecture Deep Dive](docs/architecture.md)**

## Platform Comparison

| Feature | Gemini CLI | Claude Code | Codex | OpenCode |
|---------|-----------|-------------|-------|----------|
| Agent Activation | MCP tools | Skill content hints | Manual invocation | Custom tools |
| Slash Commands | Native TOML | N/A | N/A | N/A |
| Skills Access | `/skills:*` commands | Skill tool | CLI commands | use_skill tool |
| Configuration | JSON config file | Plugin settings | Environment vars | Plugin config |
| Auto-orchestration | Smart wrapper | SessionStart hook | Bootstrap | Plugin loader |
| Custom Agents | Interactive creator | File-based | File-based | File-based |
| Installation | Native extension | Marketplace plugin | Git clone + CLI | Git clone + plugin |

## Extending SupremePower

### Add Custom Skills

Create a new skill in `~/.supremepower/skills/my-skill/SKILL.md`:

```markdown
---
name: my-custom-skill
description: Use when you need to do X, Y, or Z
---

# My Custom Skill

## Overview
[Skill instructions...]

## Conditional Blocks
IF user_message contains "keyword"
THEN ACTIVATE agent-name
```

### Add Custom Agents

Create a new agent in `~/.supremepower/agents/my-agent.md`:

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

[Detailed persona description...]
```

**[→ Complete Extension Guide](docs/extending.md)**

## Documentation

### Platform Guides
- **[Gemini CLI Guide](docs/platforms/gemini-cli.md)** - Installation, usage, slash commands, configuration
- **[Claude Code Guide](docs/platforms/claude-code.md)** - Plugin installation, skills usage, hooks
- **[Codex Guide](docs/platforms/codex.md)** - Bootstrap installation, CLI commands, workflows
- **[OpenCode Guide](docs/platforms/opencode.md)** - Plugin installation, custom tools, integration

### Reference
- **[Skills Reference](docs/skills-reference.md)** - All 14 skills with examples
- **[Agents Reference](docs/agents-reference.md)** - All 13 agents with expertise areas
- **[Architecture](docs/architecture.md)** - Framework design and integration patterns
- **[Extending Guide](docs/extending.md)** - Custom skills and agents creation

### Development
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to SupremePower
- **[Testing Guide](docs/testing.md)** - Testing infrastructure and methodology
- **[Platform Integration](docs/platform-integration.md)** - Add support for new platforms

## Project Structure

```
superpowers/
├── core/                          # Platform-agnostic framework
│   ├── orchestration/            # Agent activation engine
│   ├── agents/                   # 13 agent personas
│   └── skills/                   # 14 skills library
├── lib/                           # Core exports
│   ├── index.js                  # Orchestration API
│   ├── agent-loader.js           # Agent loading
│   └── skills-core.js            # Skill discovery
├── .claude-plugin/                # Claude Code adapter
├── .codex/                        # Codex adapter
├── .opencode/                     # OpenCode adapter
├── mcp-server/                    # Gemini CLI adapter (MCP)
├── commands/                      # Gemini CLI slash commands
├── scripts/                       # Gemini CLI wrapper
└── docs/                          # Documentation
    ├── platforms/                # Platform-specific guides
    ├── plans/                    # Implementation plans
    └── *.md                      # Reference docs
```

## Development

### Running Tests

```bash
npm install
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Building

```bash
npm run build           # Compile TypeScript (Gemini adapter)
npm run dev            # Watch mode
```

### Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Roadmap

### Phase 1 (Complete) ✅
- Platform-agnostic orchestration engine
- 13 agent personas with keyword-based activation
- 14 Superpowers skills library
- Claude Code plugin integration

### Phase 2 (Complete) ✅
- Gemini CLI MCP extension
- 25 slash commands (14 skills + 6 management + 5 aliases)
- Smart wrapper script with complexity detection
- JSON configuration management

### Phase 3 (Planned)
- GitHub Copilot adapter with instructions system
- VS Code extension
- Enhanced multi-agent collaboration patterns
- Agent learning and adaptation

### Phase 4 (Future)
- Cursor integration
- Windsurf integration
- Multi-platform CLI tool
- Agent marketplace

## Philosophy

SupremePower embodies disciplined software development:

- **Test-Driven Development** - Write tests first, always
- **Systematic Debugging** - Form hypotheses, test scientifically
- **Code Review** - Catch issues before they cascade
- **Planning** - Think before coding, document decisions
- **Worktrees** - Isolate work, reduce context switching

These workflows work because they're **universal principles**, not platform-specific tricks. SupremePower makes them accessible in any AI coding environment.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

Built on:
- **Superpowers** - Disciplined development methodology by Anthropic
- **MCP SDK** - Model Context Protocol by Anthropic
- **Community contributions** - Skills and agents from developers worldwide

## Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/abudhahir/superpowers/issues)
- **Discussions**: [Ask questions and share experiences](https://github.com/abudhahir/superpowers/discussions)
- **Documentation**: [docs/](docs/)

---

**Choose your platform above to get started, or read the [Architecture Guide](docs/architecture.md) to understand how SupremePower works.**
