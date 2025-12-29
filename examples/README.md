# SupremePower Framework Examples

This directory contains working examples demonstrating how to use the SupremePower framework for agent orchestration and skill analysis.

## Available Examples

### basic-usage.js

A comprehensive demonstration of the core orchestration API, showing how to:

1. **Load agent definitions** from the `core/agents/` directory
2. **Analyze skill content** to extract context hints and conditionals
3. **Activate appropriate agents** based on user messages and skill context
4. **Display analysis results** including scores, hints, and activated agents

**Run the example:**

```bash
node examples/basic-usage.js
```

**What it demonstrates:**

- Loading all agent definitions using `loadAgentDefinitions()`
- Reading skill content (uses `brainstorming` skill as example)
- Analyzing skills with `analyzeSkillAndActivateAgents()`
- Examining context hints (direct and subtle)
- Understanding conditional blocks
- Viewing agent activation scores
- Testing multiple user messages to see routing behavior

**Expected output:**

The example will show:
- List of loaded agents
- Skill content preview
- Detected context hints (direct and subtle)
- Conditional blocks found in the skill
- Activated agents with scores
- Top-scoring agents ranked by relevance
- Multiple test scenarios with different user messages

## Understanding the Output

### Context Hints

The framework extracts two types of context hints from skills:

- **Direct hints**: Explicit agent invocations (e.g., "Ask frontend-architect...")
- **Subtle hints**: Natural language references to expertise areas

### Conditional Blocks

Skills can contain conditional activation rules:

```markdown
**If** working with React components:
- Activate frontend-architect for component design
- Consider performance-engineer for optimization
```

The framework parses these and evaluates them against the user message.

### Agent Scores

Each agent receives a score based on:
- Keyword matches in the user message
- Context hints in the skill content
- Conditional block activation

Agents with scores above a threshold are activated.

## Using the API in Your Code

### Basic Setup

```javascript
import { analyzeSkillAndActivateAgents, loadAgentDefinitions } from 'supremepower';

// Load agents
const agents = loadAgentDefinitions('./core/agents');

// Analyze a skill
const result = analyzeSkillAndActivateAgents(
  skillContent,
  userMessage,
  agents
);

// Access results
console.log('Activated agents:', result.activatedAgents);
console.log('Context hints:', result.hints);
console.log('Scores:', result.scores);
```

### Integration with Skills

The framework is designed to work seamlessly with Superpowers-format skills:

1. Skills remain standard markdown with YAML frontmatter
2. Add context hints naturally in the content
3. Use conditional blocks for explicit routing
4. The framework handles agent activation automatically

## Next Steps

- Explore the `core/orchestration/` directory for implementation details
- Read `docs/plans/2025-12-29-supremepower-design.md` for architecture
- Check `tests/orchestration/` for comprehensive test examples
- See `core/agents/` for agent definition format

## Contributing

When adding new examples:

1. Make them executable with `#!/usr/bin/env node`
2. Include comprehensive comments explaining each step
3. Use the actual framework APIs (import from `../lib/index.js`)
4. Test with `node examples/your-example.js`
5. Document the example in this README
