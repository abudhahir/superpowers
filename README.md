# SupremePower Framework

Universal skills and agent framework for coding agents.

## Overview

SupremePower combines Superpowers' disciplined methodology with SuperGemini's intelligent agent routing, creating a portable framework across Gemini CLI, Claude Code, GitHub Copilot, and other platforms.

## Core Innovation

Skills invoke agents through context hints and conditional blocks:
- **Context hints**: Natural language describing needed expertise (subtle or direct)
- **Conditional blocks**: Explicit activation rules (if/then patterns)
- **Pure Superpowers format**: Skills remain standard markdown with YAML frontmatter

## Status

✅ **Phase 1: Foundation - COMPLETE**

Core components implemented and tested:
- **Orchestration Engine**: Context parsing, conditional evaluation, agent matching
- **Agent System**: 13 specialized agents with keyword-based activation
- **Skills Library**: Ported Superpowers skills with agent hints
- **Test Coverage**: 44 tests passing, 100% coverage on core modules

See `docs/phase1-summary.md` for complete implementation details.

## Quick Start

```javascript
import { analyzeSkillAndActivateAgents, loadAgentDefinitions } from 'supremepower';

// Load agents
const agents = loadAgentDefinitions('./core/agents');

// Analyze skill and activate agents
const result = analyzeSkillAndActivateAgents(
  skillContent,
  userMessage,
  agents
);

console.log('Activated agents:', result.activatedAgents);
```

See `examples/` directory for working demonstrations.

## Installation

Development installation:

```bash
npm install
npm test
```

Production package coming in Phase 2.

## Documentation

- **Overview**: `docs/phase1-summary.md` - Phase 1 implementation summary
- **Design**: `docs/plans/2025-12-29-supremepower-design.md` - Architecture and design decisions
- **Implementation**: `docs/plans/2025-12-29-supremepower-implementation.md` - Detailed implementation plan
- **Examples**: `examples/README.md` - Working code examples

## License

MIT
