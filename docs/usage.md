# Usage Guide

Comprehensive guide to using SupremePower with Gemini CLI.

## Table of Contents

- [Slash Commands](#slash-commands)
- [Management Commands](#management-commands)
- [Wrapper Script](#wrapper-script)
- [Workflow Examples](#workflow-examples)
- [Custom Skills and Agents](#custom-skills-and-agents)
- [Advanced Usage](#advanced-usage)

## Slash Commands

SupremePower provides 14 Superpowers skills as slash commands.

### Development Workflow Skills

#### `/brainstorm` - Interactive Design Exploration

Explore requirements, design options, and implementation approaches before coding.

**Usage:**
```bash
/brainstorm "authentication system for multi-tenant app"
```

**What it does:**
- Asks clarifying questions about requirements
- Explores multiple design approaches
- Considers trade-offs and constraints
- Produces design document for implementation

**Auto-activated agents:** System Architect, relevant domain specialists

---

#### `/plan` - Write Implementation Plan

Create detailed, step-by-step implementation plan with success criteria.

**Usage:**
```bash
/plan "OAuth2 integration with Google and GitHub"
```

**What it does:**
- Breaks down task into concrete steps
- Identifies dependencies and risks
- Defines success criteria and testing approach
- Creates structured plan document

**Output:** Markdown plan with numbered steps, ready for `/execute-plan`

---

#### `/execute-plan` - Execute Implementation Plan

Execute a multi-step plan with verification checkpoints.

**Usage:**
```bash
/execute-plan
# Prompts for plan file or paste plan content
```

**What it does:**
- Loads plan from file or input
- Executes each step sequentially
- Verifies success before proceeding
- Reports progress and blocks

**Best for:** Large features broken into 5+ steps

---

#### `/tdd` - Test-Driven Development

Follow Red-Green-Refactor cycle for robust code.

**Usage:**
```bash
/tdd
# Then describe the feature to implement
```

**What it does:**
1. **RED:** Write failing test first
2. **GREEN:** Implement minimal code to pass
3. **REFACTOR:** Clean up while keeping tests green
4. Repeat for each requirement

**Auto-activated agents:** Testing Specialist

---

#### `/implement` - Subagent-Driven Development

Delegate independent tasks to parallel subagents.

**Usage:**
```bash
/implement "implement user profile page with edit functionality"
```

**What it does:**
- Analyzes task for parallelizable subtasks
- Creates specialized subagents for each
- Coordinates parallel execution
- Integrates results

**Best for:** Features with 3+ independent components

---

#### `/debug` - Systematic Debugging

Methodical debugging workflow for complex issues.

**Usage:**
```bash
/debug
# Then describe the bug symptoms
```

**What it does:**
1. Gather symptoms and reproduce steps
2. Form hypotheses
3. Test hypotheses systematically
4. Identify root cause
5. Implement and verify fix

**Auto-activated agents:** Relevant domain specialists based on error type

---

### Code Review Skills

#### `/request-review` - Request Code Review

Request thorough code review with specific focus areas.

**Usage:**
```bash
/request-review "authentication module"
# Optionally specify focus: security, performance, maintainability
```

**What it does:**
- Reviews code for quality, best practices, potential bugs
- Checks architecture and design patterns
- Suggests improvements
- Highlights security concerns

**Auto-activated agents:** Code Reviewer, Security Engineer (if security focus)

---

#### `/receive-review` - Process Review Feedback

Systematically process and respond to code review feedback.

**Usage:**
```bash
/receive-review
# Paste review comments
```

**What it does:**
- Categorizes feedback (critical, important, suggestion)
- Helps prioritize fixes
- Guides implementation of suggestions
- Tracks resolution of each item

---

### Git Workflow Skills

#### `/finish-branch` - Complete Development Branch

Guides completion of development work before merging.

**Usage:**
```bash
/finish-branch
```

**What it does:**
- Verifies all tests pass
- Checks for uncommitted changes
- Reviews commits for quality
- Offers merge, PR, or cleanup options

---

#### `/worktrees` - Manage Git Worktrees

Work on multiple branches simultaneously with git worktrees.

**Usage:**
```bash
/worktrees
# Interactive prompts for creating/managing worktrees
```

**What it does:**
- Creates isolated worktrees for features
- Manages multiple worktrees
- Cleans up when done

**Best for:** Working on feature while main branch progresses

---

### Quality Assurance Skills

#### `/verify` - Verification Before Completion

Verify work before claiming it's complete.

**Usage:**
```bash
/verify
```

**What it does:**
- Runs all relevant tests
- Checks build succeeds
- Verifies functionality manually
- Confirms all acceptance criteria met

**Use before:** Marking tasks complete, creating PRs, merging

---

#### `/parallel` - Dispatch Parallel Agents

Coordinate multiple independent tasks across agents.

**Usage:**
```bash
/parallel
# Describe multiple tasks
```

**What it does:**
- Identifies independent tasks
- Creates specialized agent for each
- Executes in parallel
- Coordinates results

**Best for:** 2+ tasks with no shared state or dependencies

---

### Meta Skills

#### `/using-superpowers` - Find and Use Skills

Meta-skill for discovering which skill to use.

**Usage:**
```bash
/using-superpowers "I need to implement a new feature"
```

**What it does:**
- Analyzes your need
- Recommends appropriate skill
- Explains when to use each skill

---

#### `/write-skill` - Create New Skills

Create new custom skills following TDD methodology.

**Usage:**
```bash
/write-skill "domain-specific skill name"
```

**What it does:**
- Guides skill creation process
- Follows TDD for skills (pressure testing)
- Creates SKILL.md with frontmatter
- Tests with baseline scenarios

---

## Management Commands

Commands under `/sp:*` namespace for managing SupremePower.

### `/sp:agents` - List Available Agents

**Usage:**
```bash
/sp:agents
```

**Output:**
```
Available Agents:
- frontend-architect: Frontend architecture and React/Vue/Angular expertise
- backend-architect: Backend systems, APIs, and microservices
- system-architect: Distributed systems and architecture decisions
...
```

---

### `/sp:analyze` - Preview Agent Activation

**Usage:**
```bash
/sp:analyze "I need to optimize React rendering performance"
```

**Output:**
```
Complexity Score: 12
Activated Agents:
- frontend-architect (confidence: high)
- performance-engineer (confidence: high)

Reasoning:
- Keywords detected: "React", "rendering", "performance"
- Complexity above threshold (8)
- Frontend + performance domain overlap
```

Use this to understand which agents will activate before sending message.

---

### `/sp:with` - Force Specific Agent

**Usage:**
```bash
/sp:with frontend-architect "help me design this component"
```

**What it does:**
- Forces activation of specified agent
- Bypasses automatic detection
- Useful for explicit expert consultation

---

### `/sp:config` - View/Edit Configuration

**View current config:**
```bash
/sp:config
```

**View specific section:**
```bash
/sp:config orchestration
```

**Set specific value:**
```bash
/sp:config orchestration.agentActivationThreshold 6
```

**Edit full config:**
```bash
/sp:config edit
# Opens config in editor
```

See [Configuration Reference](configuration.md) for all options.

---

### `/sp:status` - System Status

**Usage:**
```bash
/sp:status
```

**Output:**
```
SupremePower Status:
- Version: 2.0.0
- Skills loaded: 14
- Agents loaded: 13
- Custom skills: 2
- Custom agents: 1
- Config path: ~/.supremepower/config.json
- MCP server: Active
- Wrapper installed: Yes
```

---

### `/sp:auto-agent-create` - Create Custom Agent

**Usage:**
```bash
/sp:auto-agent-create
```

**Interactive prompts:**
1. Agent name (e.g., "blockchain-specialist")
2. Description and expertise areas
3. Activation keywords
4. Save location

**What it does:**
- Analyzes project context
- Suggests specialization based on codebase
- Creates agent markdown file
- Registers for automatic activation

---

## Wrapper Script

The `gemini-sp` wrapper enables automatic agent orchestration.

### Basic Usage

Instead of:
```bash
gemini "your message"
```

Use:
```bash
gemini-sp "your message"
```

### How It Works

1. **Complexity Analysis:**
   - Word count (default threshold: 50 words)
   - Keyword detection (technical terms)
   - Code block presence
   - Calculates complexity score

2. **Agent Selection:**
   - If complexity >= threshold, analyze for agents
   - Match keywords to agent specializations
   - Select top N agents (default: 3 max)

3. **Prompt Enhancement:**
   - Injects agent personas into system prompt
   - Preserves original user message
   - Sends enhanced prompt to Gemini CLI

4. **Fallback:**
   - If orchestration fails, passes message through unchanged
   - Logs warning but continues

### Complexity Thresholds

**Default behavior:**
- Simple queries (< 50 words, no keywords): No agents
- Medium queries (50+ words OR keywords): Automatic agents
- Complex queries (100+ words + keywords): Multiple agents

**Customize thresholds:**
```bash
/sp:config wrapper.complexity.minWordCount 30
/sp:config wrapper.complexity.requireKeywords false
```

### Examples

**Simple query - no agents:**
```bash
gemini-sp "What is JavaScript?"
# Passes through directly
```

**Medium query - agents activated:**
```bash
gemini-sp "How do I optimize React component rendering for large lists?"
# Activates: frontend-architect, performance-engineer
```

**Complex query - multiple agents:**
```bash
gemini-sp "I need to design a microservices architecture for an e-commerce platform \
with high availability, handling 10k requests/sec, using Node.js backends, \
React frontend, PostgreSQL database, and Redis caching. Need CI/CD pipeline too."
# Activates: system-architect, backend-architect, frontend-architect, devops-engineer
```

### Slash Command Passthrough

Slash commands automatically pass through:
```bash
gemini-sp /tdd
# Equivalent to: gemini /tdd
```

---

## Workflow Examples

### Example 1: Building a New Feature

**Step 1: Brainstorm**
```bash
/brainstorm "user authentication with OAuth2"
```

**Step 2: Plan**
```bash
/plan "implement OAuth2 based on brainstorm results"
```

**Step 3: Execute with TDD**
```bash
/tdd
# Implement each component following Red-Green-Refactor
```

**Step 4: Verify**
```bash
/verify
```

**Step 5: Request Review**
```bash
/request-review "OAuth2 implementation" --focus=security
```

**Step 6: Finish**
```bash
/finish-branch
```

---

### Example 2: Debugging Production Issue

**Step 1: Start debugging**
```bash
/debug
```
Describe symptoms: "API returns 500 errors intermittently under load"

**Step 2: Systematic investigation**
Follow debug workflow:
- Gather logs and metrics
- Reproduce issue
- Form hypotheses
- Test each hypothesis

**Agents activated:** Backend Architect, Performance Engineer, DevOps Engineer

**Step 3: Fix and verify**
```bash
/verify
```

**Step 4: Request review**
```bash
/request-review "rate limiting fix" --focus=performance
```

---

### Example 3: Parallel Feature Development

**Step 1: Identify parallel tasks**
```bash
/parallel
```
Tasks:
- "Implement user profile API endpoint"
- "Create profile editing UI component"
- "Add profile image upload to S3"

**Step 2: Execution**
System creates 3 subagents:
- Backend specialist for API
- Frontend specialist for UI
- DevOps specialist for S3 integration

**Step 3: Integration**
Merge results and verify integration

---

### Example 4: Custom Agent for Domain

**Scenario:** Working on blockchain dApp

**Step 1: Create custom agent**
```bash
/sp:auto-agent-create
```
- Name: blockchain-specialist
- Keywords: solidity, smart contract, ethereum, web3
- Expertise: Solidity, testing with Hardhat, gas optimization

**Step 2: Use in queries**
```bash
gemini-sp "Help me optimize gas costs in this smart contract"
# Auto-activates: blockchain-specialist
```

---

## Custom Skills and Agents

### Creating Custom Skills

**Manual creation:**

1. Create directory:
   ```bash
   mkdir -p ~/.supremepower/skills/my-skill
   ```

2. Create SKILL.md:
   ```markdown
   ---
   name: my-skill
   description: Use when working on domain-specific task
   ---

   # My Custom Skill

   ## Workflow

   1. Step one
   2. Step two
   3. Step three

   ## Context Hints

   When working on X, consider Y and Z.

   ## Conditional Blocks

   IF user_message contains "keyword"
   THEN ACTIVATE agent-name
   CONFIDENCE high
   ```

3. Verify:
   ```bash
   /sp:status
   # Should show "Custom skills: 1"
   ```

**Using the skill:**
```bash
# If exposureMode is "commands"
/my-skill

# If exposureMode is "prompts"
gemini-sp "I need to work on X"  # Automatically loaded
```

---

### Creating Custom Agents

**Method 1: Auto-create (recommended)**
```bash
/sp:auto-agent-create
# Interactive prompts
```

**Method 2: Manual creation**

1. Create file:
   ```bash
   nano ~/.supremepower/agents/my-agent.md
   ```

2. Define agent:
   ```markdown
   # Agent: My Domain Specialist

   ## Role
   Expert in [domain area]

   ## Expertise
   - Skill area 1
   - Skill area 2
   - Skill area 3

   ## Activation Keywords
   keyword1, keyword2, keyword3, keyword4

   ## Persona
   You are a specialist in [domain]. When activated, you should:
   - Provide expert guidance on [topic]
   - Consider [specific factors]
   - Follow [best practices]
   ```

3. Verify:
   ```bash
   /sp:agents
   # Should list your custom agent
   ```

4. Test activation:
   ```bash
   /sp:analyze "message with keyword1"
   # Should show your agent activated
   ```

---

## Advanced Usage

### Environment Variables

**Override config path:**
```bash
export SUPREMEPOWER_CONFIG_PATH=~/my-project/.supremepower
gemini-sp "query"
```

**Enable debug logging:**
```bash
export SUPREMEPOWER_DEBUG=1
gemini-sp "query"
```

---

### Configuration Profiles

Create multiple config profiles for different projects:

**Setup:**
```bash
# Project 1: aggressive agent use
cp ~/.supremepower/config.json ~/.supremepower/config-aggressive.json
# Edit: agentActivationThreshold = 4

# Project 2: minimal agent use
cp ~/.supremepower/config.json ~/.supremepower/config-minimal.json
# Edit: agentActivationThreshold = 15
```

**Usage:**
```bash
# Use aggressive profile
export SUPREMEPOWER_CONFIG_PATH=~/.supremepower
ln -sf config-aggressive.json ~/.supremepower/config.json
gemini-sp "query"

# Use minimal profile
ln -sf config-minimal.json ~/.supremepower/config.json
gemini-sp "query"
```

---

### Logging and Debugging

**Enable verbose logging:**
```bash
/sp:config display.verbose true
/sp:config display.logPath "~/.supremepower/logs"
```

**View logs:**
```bash
tail -f ~/.supremepower/logs/supremepower.log
```

**Log format:**
```
[2025-12-30 10:30:45] [INFO] Analyzing message complexity
[2025-12-30 10:30:45] [DEBUG] Word count: 67, Keywords: 5, Score: 12
[2025-12-30 10:30:45] [INFO] Activating agents: frontend-architect, performance-engineer
[2025-12-30 10:30:46] [INFO] Enhanced prompt sent to Gemini CLI
```

---

### Combining with Gemini CLI Features

**Use with Gemini session context:**
```bash
gemini --context=project-docs
/plan "new feature based on docs"
```

**Use with file attachments:**
```bash
gemini --attach=src/component.tsx
gemini-sp "optimize this React component"
# Agents analyze attached code
```

---

### Tips and Best Practices

**1. Start with explicit commands, graduate to wrapper:**
- Learn skills with slash commands first
- Once familiar, use wrapper for automatic orchestration

**2. Use `/sp:analyze` to preview:**
- Before complex queries, preview agent activation
- Adjust message or config if unexpected agents activate

**3. Custom agents for repeated domains:**
- If working on same technology stack, create custom agent
- More precise activation than generic agents

**4. Adjust threshold per project:**
- Complex codebases: lower threshold (6-7)
- Simple projects: higher threshold (10-12)

**5. Combine skills:**
```bash
/brainstorm "feature X"
# Copy output
/plan "implement feature X based on brainstorm"
# Copy output
/execute-plan
```

**6. Use wrapper for exploratory questions:**
```bash
gemini-sp "What's the best approach for real-time updates in React?"
# Automatic agent selection based on keywords
```

**7. Use slash commands for disciplined workflows:**
```bash
/tdd
# Forces TDD discipline
```

---

## Next Steps

- Explore [Configuration Reference](configuration.md) for all config options
- Check [Troubleshooting Guide](troubleshooting.md) if issues arise
- Experiment with custom skills and agents
- Share your custom skills/agents with the community
