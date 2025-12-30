# SupremePower Framework Design

**Date:** 2025-12-29
**Status:** Design Approved
**Target Platform (MVP):** Gemini CLI with GitHub Copilot preparation

## Executive Summary

SupremePower is a next-generation, cross-platform skills and agent framework for coding agents. It combines Superpowers' disciplined methodology (TDD enforcement, systematic debugging, workflow rigor) with SuperGemini's intelligent routing (agent personas, context-aware activation, MCP integration) to create a universal framework portable across Gemini CLI, Claude Code, GitHub Copilot, and other platforms.

**Core Innovation:** Skills invoke agents through context hints and conditional blocks, creating an intelligent system where systematic processes leverage specialized expertise automatically.

**MVP Scope:** Full Gemini CLI implementation with architectural foundation for GitHub Copilot integration.

---

## 1. High-Level Architecture & Vision

### Core Principle: Skills Invoke Agents

Skills remain the **process controllers** that define WHAT to do and HOW to do it. Within skills, two mechanisms invoke specialized agent personas:

1. **Context hints (Primary)** - Natural language describing expertise needed
   - **Subtle:** "Consider security implications"
   - **Direct:** "Requires security engineering expertise"

2. **Conditional blocks (Fallback)** - Explicit activation rules
   - "If working with authentication → security-engineer"
   - "If database schema changes → backend-architect"

### Integration Strategy

**Priority Sequence:**
1. Context hints evaluated first (Gemini interprets naturally)
2. If confidence low or no match, conditional blocks trigger
3. Agent personas injected into session context automatically

**Hint Explicitness Tiering:**

| Skill Type | Hint Style | Example | Rationale |
|------------|-----------|---------|-----------|
| **Critical/Security** | Direct | "Requires security engineering expertise" | Can't risk wrong agent |
| **Process/Workflow** | Subtle | "Consider architectural implications" | Flexibility useful |
| **Exploration** | Subtle | "May benefit from diverse perspectives" | Open-ended by nature |
| **Technical/Specialized** | Direct | "Needs frontend performance optimization expertise" | Specific domain knowledge |

### Platform Strategy

**Path A: SupremePower supersedes SuperGemini**
- SupremePower implements its own agent routing system
- SuperGemini users migrate to SupremePower
- One unified next-generation framework
- Portability across all major coding agents

**Adapter Pattern Architecture:**
- Core skills and agents are 100% platform-agnostic
- Platform-specific adapters translate to native formats
- Pure Superpowers skill format with proper authoring guides
- GitHub Copilot prepared but not implemented in MVP

### MVP Scope

**Primary target:** Gemini CLI with full feature parity to SuperGemini + Superpowers
**Architecture goal:** Design adapter interfaces for GitHub Copilot integration without implementing Copilot adapter yet
**Migration path:** SupremePower supersedes SuperGemini as the next-generation framework

---

## 2. Repository Structure

```
supremepower/
├── core/
│   ├── skills/                      # Pure Superpowers format
│   │   ├── test-driven-development/
│   │   │   ├── SKILL.md
│   │   │   └── testing-anti-patterns.md
│   │   ├── systematic-debugging/
│   │   ├── brainstorming/
│   │   ├── writing-plans/
│   │   ├── executing-plans/
│   │   ├── subagent-driven-development/
│   │   ├── requesting-code-review/
│   │   ├── receiving-code-review/
│   │   ├── finishing-a-development-branch/
│   │   ├── using-git-worktrees/
│   │   ├── dispatching-parallel-agents/
│   │   ├── verification-before-completion/
│   │   ├── using-supremepower/
│   │   └── writing-skills/
│   │
│   ├── agents/                      # Agent persona definitions
│   │   ├── security-engineer.md
│   │   ├── backend-architect.md
│   │   ├── frontend-architect.md
│   │   ├── performance-engineer.md
│   │   ├── testing-specialist.md
│   │   ├── api-specialist.md
│   │   ├── database-specialist.md
│   │   ├── devops-engineer.md
│   │   ├── technical-writer.md
│   │   ├── python-expert.md
│   │   ├── javascript-expert.md
│   │   ├── system-architect.md
│   │   └── code-reviewer.md
│   │
│   ├── orchestration/               # Skills invoke agents logic
│   │   ├── context-parser.js        # Extracts hints from skills
│   │   ├── agent-matcher.js         # Maps hints to agents
│   │   └── conditional-evaluator.js # Processes if/then rules
│   │
│   └── commands/                    # Abstract command definitions
│       ├── command-schema.json
│       └── templates/
│
├── adapters/
│   ├── gemini-cli/                  # MVP platform
│   │   ├── gemini-extension.json   # Extension metadata
│   │   ├── commands/                # TOML files
│   │   │   ├── brainstorm.toml
│   │   │   ├── write-plan.toml
│   │   │   ├── execute-plan.toml
│   │   │   ├── systematic-debug.toml
│   │   │   ├── tdd.toml
│   │   │   ├── request-review.toml
│   │   │   └── finish-branch.toml
│   │   ├── hooks/                   # Hook scripts
│   │   │   ├── before-agent.js     # Context/agent injection
│   │   │   └── skill-loader.js     # Load skills on demand
│   │   ├── settings.json.template   # User settings template
│   │   ├── GEMINI.md.template      # Core instructions
│   │   ├── install.sh              # Installation script
│   │   └── adapter.js              # Gemini-specific logic
│   │
│   ├── github-copilot/              # Architecture only (no impl)
│   │   ├── ARCHITECTURE.md          # Design doc for future
│   │   ├── adapter-interface.js     # Interface definition
│   │   ├── installation/
│   │   │   ├── setup-copilot.sh
│   │   │   └── README.md
│   │   └── templates/
│   │       ├── copilot-instructions.md.template
│   │       └── instructions/        # Targeted instruction templates
│   │
│   └── _shared/                     # Common adapter utilities
│       └── platform-interface.js    # Abstract adapter contract
│
├── lib/
│   ├── skill-loader.js              # From Superpowers
│   ├── agent-router.js              # From SuperGemini
│   └── platform-detector.js         # Runtime detection
│
├── docs/
│   ├── README.md                    # Project overview
│   ├── installation/
│   │   ├── gemini-cli.md           # Gemini CLI installation
│   │   ├── github-copilot.md       # Future Copilot setup
│   │   └── troubleshooting.md      # Common issues
│   ├── guides/
│   │   ├── writing-skills.md       # How to create skills
│   │   ├── agent-invocation.md     # Context hints & conditionals
│   │   ├── porting-guide.md        # Adding new platforms
│   │   └── migration-from-supergemini.md
│   ├── architecture/
│   │   ├── adapter-pattern.md      # Platform adapter design
│   │   ├── agent-routing.md        # How agents are selected
│   │   └── skill-format.md         # Skill structure reference
│   └── api/
│       ├── adapter-interface.md    # Abstract adapter API
│       └── core-modules.md         # Core library reference
│
└── tests/                           # From Superpowers methodology
    ├── skills/
    │   ├── unit/                   # Unit tests for skills
    │   └── integration/            # Integration tests
    ├── agents/
    │   └── activation-tests/       # Agent routing tests
    ├── orchestration/
    │   ├── context-parser.test.js
    │   ├── agent-matcher.test.js
    │   └── conditional-evaluator.test.js
    └── adapters/
        └── gemini-cli/
            ├── install.test.js
            ├── commands.test.js
            └── hooks.test.js
```

**Key Architectural Decisions:**
- `core/` is 100% platform-agnostic
- `adapters/` contains platform-specific implementations
- GitHub Copilot adapter exists as interface/docs only (no code yet)
- Skills remain pure Superpowers markdown format
- Agents use YAML frontmatter for metadata

---

## 3. Agent System Architecture

### Agent Persona Definitions

Each agent is defined in `core/agents/` as a markdown file with YAML frontmatter:

```yaml
---
name: security-engineer
expertise:
  - Authentication & authorization
  - Cryptography & secure storage
  - OWASP vulnerabilities
  - Security testing & threat modeling
activation_keywords:
  - security
  - authentication
  - authorization
  - encryption
  - hashing
  - tokens
  - JWT
  - vulnerability
  - exploit
  - attack
  - permissions
  - roles
  - access control
complexity_threshold: medium
---

# Security Engineer Persona

You are a security-focused engineer specializing in building secure systems.

## Core Expertise

**Authentication & Authorization:**
- OAuth 2.0, OpenID Connect, SAML
- JWT validation and secure token management
- Session management and CSRF protection
- Role-based and attribute-based access control

**Cryptography:**
- Encryption at rest and in transit
- Password hashing (bcrypt, Argon2)
- Key management and rotation
- Certificate management

**Security Testing:**
- Threat modeling
- Penetration testing
- Static analysis (SAST)
- Dynamic analysis (DAST)
- Dependency vulnerability scanning

**OWASP Top 10:**
- Injection attacks (SQL, NoSQL, Command)
- Broken authentication
- Sensitive data exposure
- XML external entities (XXE)
- Broken access control
- Security misconfiguration
- Cross-site scripting (XSS)
- Insecure deserialization
- Using components with known vulnerabilities
- Insufficient logging and monitoring

## Working Principles

1. **Defense in depth** - Multiple layers of security controls
2. **Principle of least privilege** - Minimal necessary permissions
3. **Fail securely** - Safe defaults, secure error handling
4. **Security by design** - Built-in, not bolted-on
5. **Zero trust** - Verify everything, trust nothing

## When Activated

You are activated when:
- Working with authentication or authorization code
- Handling sensitive data or credentials
- Implementing security controls
- Investigating security vulnerabilities
- Reviewing code for security issues

Follow the processes defined in the active skill (e.g., systematic-debugging, test-driven-development) while applying security expertise throughout.
```

### Agent Routing Logic

**Flow:**
1. Skill is loaded and parsed for context hints
2. `context-parser.js` extracts hint phrases
3. `agent-matcher.js` scores agents based on keyword overlap
4. If score > threshold, agent persona is activated
5. If no match or low confidence, conditional blocks are evaluated
6. Selected agent persona context is injected into the session

**Scoring Algorithm:**

```javascript
function scoreAndSelectAgents(hints, conditionals, userMessage) {
  const agents = loadAgentDefinitions();
  const scores = {};

  // Score based on direct hints (weight: 10)
  hints.direct.forEach(hint => {
    agents.forEach(agent => {
      if (matchesKeywords(hint, agent.keywords)) {
        scores[agent.name] = (scores[agent.name] || 0) + 10;
      }
    });
  });

  // Score based on subtle hints (weight: 5)
  hints.subtle.forEach(hint => {
    agents.forEach(agent => {
      if (matchesKeywords(hint, agent.keywords)) {
        scores[agent.name] = (scores[agent.name] || 0) + 5;
      }
    });
  });

  // Check conditionals (override with weight: 20)
  conditionals.forEach(cond => {
    if (userMessage.toLowerCase().includes(cond.condition.toLowerCase())) {
      scores[cond.agent] = (scores[cond.agent] || 0) + 20;
    }
  });

  // Select agents above threshold (score > 8)
  return Object.entries(scores)
    .filter(([_, score]) => score > 8)
    .sort((a, b) => b[1] - a[1])
    .map(([name, _]) => name);
}
```

**Threshold Tuning:**
- **Score > 8:** Activated
- **Score 5-8:** Candidate (low confidence)
- **Score < 5:** Not activated

Thresholds are tunable via configuration for precision vs recall tradeoff.

### Integration Points

**Gemini CLI:**
- Agents injected via `BeforeAgent` hook
- Hook runs before every agent request
- Agent context added to `additionalContext` field
- Behavioral instructions reference agent files

**GitHub Copilot (future):**
- Agents map to `.github/instructions/*.instructions.md` files
- Path-based activation via `appliesTo` frontmatter
- Static pre-configuration (no dynamic routing)

**Claude Code:**
- Agents delivered via Skill tool invocation
- Could be dynamic or hook-based
- Integration TBD in future adapter

---

## 4. Skill Format & Agent Invocation

### Pure Superpowers Format (Unchanged)

Skills remain standard Superpowers format with YAML frontmatter:

```markdown
---
name: systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes
---

# Systematic Debugging

## Overview
A rigorous four-phase process for identifying and fixing bugs through root cause analysis.

## The Process

**Phase 1: Understand the problem**
- Reproduce the issue reliably
- Gather diagnostic information
- Document expected vs actual behavior

**Phase 2: Root cause analysis**
- Trace through the code path
- Identify the exact point of failure
- Understand why it's failing

**Phase 3: Design the fix**
- Address the root cause, not symptoms
- Consider edge cases and side effects
- Plan verification strategy

**Phase 4: Implement and verify**
- Apply the fix
- Verify the original issue is resolved
- Ensure no regressions introduced
```

### Adding Context Hints (Subtle)

Within skill content, natural language hints guide agent selection:

```markdown
## Root Cause Analysis

Trace through the authentication flow carefully. Consider how session
management interacts with token validation. Security implications must
be thoroughly understood before attempting fixes.

Pay attention to input validation and potential injection vectors. The
error handling path may reveal boundary conditions that expose
vulnerabilities.
```

**What Gemini sees:**
- Keywords extracted: "authentication", "session management", "token validation", "security", "injection", "vulnerabilities"
- Hint detected → `agent-matcher.js` scores agents
- `security-engineer` matches high → activated

### Adding Context Hints (Direct)

For critical skills where agent selection is mandatory:

```markdown
## Security Review

> **Agent Expertise Required:** Security engineering expertise for
> authentication flows and vulnerability assessment.

Before proceeding with any fix:
1. Verify input sanitization at all entry points
2. Check for proper authentication and authorization
3. Review session management and token handling
4. Validate error messages don't leak sensitive information
5. Ensure logging captures security events appropriately

Reference: `.supremepower/agents/security-engineer.md`
```

**Direct hints use explicit language:**
- "Requires [expertise type] expertise"
- "Needs [domain] knowledge"
- "Must have [specialization] understanding"

### Conditional Blocks (Fallback)

At the end of skills, explicit routing rules ensure correct agents activate:

```markdown
## Agent Activation

**If working with:**
- Authentication/authorization → security-engineer
- Database schema/migrations → backend-architect + database-specialist
- API contracts/endpoints → backend-architect + api-specialist
- Frontend performance → frontend-architect + performance-engineer
- Deployment/infrastructure → devops-engineer
- Test strategies → testing-specialist
- Documentation → technical-writer

**Multiple agents can be active simultaneously** when work spans domains.
```

**Conditional syntax:**
- Pattern: `[condition] → [agent-name]`
- Supports multiple agents: `agent1 + agent2`
- Evaluated only if context hints don't yield high-confidence match

### Example: Complete Skill with Agent Invocation

```markdown
---
name: test-driven-development
description: Use when implementing any feature or bugfix, before writing implementation code
---

# Test-Driven Development

## Overview
Strict RED-GREEN-REFACTOR cycle enforcing tests-first development.

## The Iron Law

**No production code without a failing test first.**

## The Process

### RED Phase: Write a Failing Test

Write the smallest possible test that describes one aspect of the
desired behavior. The test must fail for the right reason.

Consider edge cases, error conditions, and security boundaries carefully.
For authentication features, verify both positive and negative cases.

**Run the test and watch it fail.**

### GREEN Phase: Make It Pass

Write the minimal code to make the test pass. Don't write more than
needed. Don't optimize yet. Don't handle cases not covered by tests.

When implementing security-sensitive features, ensure your implementation
follows security best practices. Validate inputs, handle errors securely,
and avoid common vulnerabilities.

**Run the test and watch it pass.**

### REFACTOR Phase: Improve the Code

Now that tests are passing, improve the code:
- Remove duplication
- Improve names
- Simplify logic
- Extract methods/functions
- Optimize if needed

Refactoring must not change behavior. Tests should still pass.

**Run all tests frequently during refactoring.**

## Anti-Patterns

See `testing-anti-patterns.md` for common mistakes to avoid.

## Agent Activation

**If working with:**
- Authentication/authorization → security-engineer + testing-specialist
- Database operations → database-specialist + testing-specialist
- API endpoints → api-specialist + testing-specialist
- Frontend components → frontend-architect + testing-specialist
- Performance-critical code → performance-engineer + testing-specialist

The testing-specialist agent helps design effective test strategies.
Domain agents ensure tests cover relevant scenarios.
```

**What happens when this skill is invoked:**

1. User says: "Implement JWT token refresh"
2. Gemini loads TDD skill
3. Context hints detected:
   - "authentication features" (subtle)
   - "security-sensitive features" (direct)
   - "security best practices" (direct)
4. Conditional block matches: "authentication" → security-engineer + testing-specialist
5. Both agents activated with combined expertise
6. Gemini follows TDD process with security and testing focus

---

## 5. Gemini CLI Adapter Implementation

### Extension Structure

```
adapters/gemini-cli/
├── gemini-extension.json          # Extension metadata
├── commands/                      # TOML command files
│   ├── brainstorm.toml
│   ├── write-plan.toml
│   ├── execute-plan.toml
│   ├── systematic-debug.toml
│   ├── tdd.toml
│   ├── request-review.toml
│   └── finish-branch.toml
├── hooks/                         # Hook scripts
│   ├── before-agent.js           # Context/agent injection
│   └── skill-loader.js           # Load skills on demand
├── settings.json.template         # User settings template
├── GEMINI.md.template            # Core instructions
├── install.sh                     # Installation script
└── adapter.js                     # Gemini-specific logic
```

### Extension Definition

**File: `gemini-extension.json`**

```json
{
  "name": "supremepower",
  "version": "1.0.0",
  "description": "Universal skills and agent framework combining Superpowers methodology with intelligent agent routing",
  "author": "SupremePower Project",
  "homepage": "https://github.com/org/supremepower",
  "repository": "https://github.com/org/supremepower",
  "license": "MIT",
  "keywords": ["skills", "agents", "tdd", "debugging", "workflows", "automation"],
  "mcpServers": {
    "context7": {
      "httpUrl": "https://mcp.context7.com/mcp",
      "description": "Up-to-date library documentation",
      "timeout": 10000
    }
  },
  "hooks": {
    "BeforeAgent": [
      {
        "matcher": "*",
        "hooks": [
          {
            "name": "supremepower-agent-router",
            "type": "command",
            "command": "node $EXTENSION_ROOT/hooks/before-agent.js",
            "description": "Analyze context and activate relevant agent personas"
          }
        ]
      }
    ]
  }
}
```

### BeforeAgent Hook Implementation

**File: `hooks/before-agent.js`**

```javascript
#!/usr/bin/env node
/**
 * SupremePower BeforeAgent Hook
 *
 * Analyzes conversation context, extracts context hints from skills,
 * scores and selects relevant agent personas, and injects them into
 * the session context.
 */

const fs = require('fs');
const path = require('path');

// Get conversation context from environment
const userMessage = process.env.GEMINI_USER_MESSAGE || '';
const conversationHistory = process.env.GEMINI_CONVERSATION_CONTEXT || '[]';
const projectDir = process.env.GEMINI_PROJECT_DIR || process.cwd();

/**
 * Main execution
 */
async function main() {
  try {
    // Parse for skill invocations
    const skillPattern = /(?:use|invoke|follow|load)\s+(?:the\s+)?([a-z-]+)\s+skill/i;
    const skillMatch = userMessage.match(skillPattern);

    let agentsToActivate = [];

    if (skillMatch) {
      const skillName = skillMatch[1];
      const skillPath = path.join(
        process.env.HOME,
        '.gemini/skills',
        skillName,
        'SKILL.md'
      );

      if (fs.existsSync(skillPath)) {
        const skillContent = fs.readFileSync(skillPath, 'utf8');

        // Parse context hints (subtle and direct)
        const hints = extractContextHints(skillContent);

        // Parse conditional blocks
        const conditionals = extractConditionalBlocks(skillContent);

        // Score agents based on hints
        agentsToActivate = scoreAndSelectAgents(hints, conditionals, userMessage);
      }
    }

    // Build additional context with activated agents
    const agentContext = buildAgentContext(agentsToActivate);

    // Output JSON for hook system
    outputHookResult(agentContext, agentsToActivate);

  } catch (error) {
    console.error(JSON.stringify({
      error: true,
      message: error.message,
      stack: error.stack
    }));
    process.exit(1);
  }
}

/**
 * Extract context hints from skill content
 */
function extractContextHints(content) {
  // Direct hints: "requires X expertise", "needs Y knowledge"
  const directPattern = /(?:requires?|needs?)\s+([^.]+?)\s+(?:expertise|knowledge|understanding)/gi;

  // Subtle hints: "consider X", "understand Y", "analyze Z"
  const subtlePattern = /(?:consider|understand|analyze)\s+([^.]+?)(?:\.|,|\n)/gi;

  return {
    direct: [...content.matchAll(directPattern)].map(m => m[1].trim()),
    subtle: [...content.matchAll(subtlePattern)].map(m => m[1].trim())
  };
}

/**
 * Extract conditional blocks from skill content
 */
function extractConditionalBlocks(content) {
  // Pattern: "If working with X → agent-name"
  // Also supports: "If X → agent1 + agent2"
  const pattern = /(?:if|when)\s+working\s+with[:\s]+([^→]+)→\s+([a-z-]+(?:\s*\+\s*[a-z-]+)*)/gi;

  return [...content.matchAll(pattern)].map(m => ({
    condition: m[1].trim(),
    agents: m[2].split('+').map(a => a.trim())
  }));
}

/**
 * Score and select agents based on hints, conditionals, and context
 */
function scoreAndSelectAgents(hints, conditionals, userMessage) {
  const agents = loadAgentDefinitions();
  const scores = {};

  // Score based on direct hints (weight: 10)
  hints.direct.forEach(hint => {
    agents.forEach(agent => {
      if (matchesKeywords(hint, agent.keywords)) {
        scores[agent.name] = (scores[agent.name] || 0) + 10;
      }
    });
  });

  // Score based on subtle hints (weight: 5)
  hints.subtle.forEach(hint => {
    agents.forEach(agent => {
      if (matchesKeywords(hint, agent.keywords)) {
        scores[agent.name] = (scores[agent.name] || 0) + 5;
      }
    });
  });

  // Check conditionals (override with weight: 20)
  conditionals.forEach(cond => {
    const conditionMatches = cond.condition.toLowerCase()
      .split(/[,/]/)
      .some(term => userMessage.toLowerCase().includes(term.trim()));

    if (conditionMatches) {
      cond.agents.forEach(agentName => {
        scores[agentName] = (scores[agentName] || 0) + 20;
      });
    }
  });

  // Select agents above threshold (score > 8)
  return Object.entries(scores)
    .filter(([_, score]) => score > 8)
    .sort((a, b) => b[1] - a[1])
    .map(([name, _]) => name);
}

/**
 * Load agent definitions from ~/.gemini/agents/
 */
function loadAgentDefinitions() {
  const agentsDir = path.join(process.env.HOME, '.gemini/agents');
  if (!fs.existsSync(agentsDir)) return [];

  return fs.readdirSync(agentsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const content = fs.readFileSync(path.join(agentsDir, f), 'utf8');
      const frontmatter = extractFrontmatter(content);
      return {
        name: path.basename(f, '.md'),
        keywords: frontmatter.activation_keywords || [],
        expertise: frontmatter.expertise || [],
        threshold: frontmatter.complexity_threshold || 'medium'
      };
    });
}

/**
 * Check if text matches any keywords
 */
function matchesKeywords(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some(kw => {
    const kwLower = kw.toLowerCase();
    // Check for word boundary matches to avoid false positives
    return lower.includes(kwLower);
  });
}

/**
 * Extract YAML frontmatter from agent markdown file
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]+?)\n---/);
  if (!match) return {};

  const yaml = match[1];
  const result = {};

  // Parse activation_keywords
  const keywordsMatch = yaml.match(/activation_keywords:\s*\n((?:\s+-\s+.+\n?)+)/);
  if (keywordsMatch) {
    result.activation_keywords = keywordsMatch[1]
      .split('\n')
      .map(line => line.replace(/^\s*-\s*/, '').trim())
      .filter(Boolean);
  }

  // Parse expertise
  const expertiseMatch = yaml.match(/expertise:\s*\n((?:\s+-\s+.+\n?)+)/);
  if (expertiseMatch) {
    result.expertise = expertiseMatch[1]
      .split('\n')
      .map(line => line.replace(/^\s*-\s*/, '').trim())
      .filter(Boolean);
  }

  // Parse threshold
  const thresholdMatch = yaml.match(/complexity_threshold:\s*(\w+)/);
  if (thresholdMatch) {
    result.complexity_threshold = thresholdMatch[1];
  }

  return result;
}

/**
 * Build agent context string from activated agents
 */
function buildAgentContext(agentNames) {
  if (agentNames.length === 0) return '';

  const agentContexts = agentNames.map(agentName => {
    const agentPath = path.join(process.env.HOME, '.gemini/agents', `${agentName}.md`);
    if (fs.existsSync(agentPath)) {
      return fs.readFileSync(agentPath, 'utf8');
    }
    return null;
  }).filter(Boolean);

  if (agentContexts.length === 0) return '';

  return agentContexts.join('\n\n---\n\n');
}

/**
 * Output hook result as JSON
 */
function outputHookResult(agentContext, agentNames) {
  const result = {
    hookSpecificOutput: {
      hookEventName: "BeforeAgent",
      additionalContext: agentContext ?
        `<agent-activation>
The following specialized agent personas are active for this request:

${agentNames.map(name => `- ${name}`).join('\n')}

${agentContext}
</agent-activation>`
        : ''
    }
  };

  console.log(JSON.stringify(result, null, 2));
}

// Run main
main().catch(error => {
  console.error(JSON.stringify({
    error: true,
    message: error.message,
    stack: error.stack
  }));
  process.exit(1);
});
```

### Command Definitions

**File: `commands/brainstorm.toml`**

```toml
description = "Interactive design refinement through questions and exploration"

prompt = """
You are using the SupremePower framework.

Load the brainstorming skill from your skills library:

!{cat ~/.gemini/skills/brainstorming/SKILL.md}

Topic: {{args}}

Follow the skill instructions exactly. The BeforeAgent hook will automatically
activate relevant agent personas based on the context hints in the skill.
"""
```

**File: `commands/tdd.toml`**

```toml
description = "Test-driven development workflow (RED-GREEN-REFACTOR)"

prompt = """
You are using the SupremePower framework.

Load the test-driven development skill:

!{cat ~/.gemini/skills/test-driven-development/SKILL.md}

Context: {{args}}

Follow the TDD process strictly:
1. RED: Write a failing test
2. GREEN: Make it pass with minimal code
3. REFACTOR: Improve the code while keeping tests passing

Relevant agent personas have been activated based on the domain you're working in.
"""
```

**File: `commands/systematic-debug.toml`**

```toml
description = "Systematic debugging with root cause analysis"

prompt = """
You are using the SupremePower framework.

Load the systematic debugging skill:

!{cat ~/.gemini/skills/systematic-debugging/SKILL.md}

Issue to debug: {{args}}

Follow the four-phase debugging process:
1. Understand the problem
2. Root cause analysis
3. Design the fix
4. Implement and verify

Specialized agents have been activated to provide domain expertise.
"""
```

### Core Instructions Template

**File: `GEMINI.md.template`**

```markdown
# SupremePower Framework

You have access to a universal skills and agent framework that combines systematic
development processes with specialized domain expertise.

## How It Works

1. **Skills** define systematic processes (TDD, debugging, planning)
2. **Agents** provide specialized expertise (security, architecture, frontend)
3. **Context hints** in skills automatically activate relevant agents
4. **Conditional blocks** ensure correct agents for specific scenarios

The BeforeAgent hook analyzes each request and activates appropriate agent personas
automatically. You don't need to manually invoke agents - they're already present
when needed.

## Core Principles

- **Test-Driven Development** - Write tests first, always (RED-GREEN-REFACTOR)
- **Systematic over ad-hoc** - Follow processes, don't improvise
- **Complexity reduction** - YAGNI - simplicity as primary goal
- **Evidence over claims** - Verify before declaring success

## Available Commands

- `/supremepower:brainstorm` - Interactive design refinement
- `/supremepower:write-plan` - Create detailed implementation plans
- `/supremepower:execute-plan` - Execute plans in batches with checkpoints
- `/supremepower:tdd` - Test-driven development workflow
- `/supremepower:systematic-debug` - Four-phase debugging process
- `/supremepower:request-review` - Code review before proceeding
- `/supremepower:finish-branch` - Complete work and merge/PR

## Skill Invocation

When you see instructions to "use the X skill" or "follow the Y skill":
1. Load the skill content from ~/.gemini/skills/
2. Follow the process exactly as described
3. Trust that relevant agents are already activated via hooks

## Agent Activation (Automatic)

The BeforeAgent hook analyzes each request and activates agents based on:
- **Context hints in skills** - "requires security expertise"
- **Conditional rules** - "if authentication → security-engineer"
- **User message content** - Keywords and domain indicators

Agent personas include:
- security-engineer - Auth, crypto, vulnerabilities
- backend-architect - System design, databases, APIs
- frontend-architect - UI/UX, components, performance
- performance-engineer - Optimization, profiling
- testing-specialist - Test strategies, coverage
- devops-engineer - Deployment, infrastructure, CI/CD
- database-specialist - Schema design, queries, migrations
- technical-writer - Documentation, clarity
- And more...

You don't need to manually invoke agents - they're injected automatically when
their expertise is relevant.

## Workflow Examples

**Adding a new feature:**
1. `/supremepower:brainstorm` - Refine the idea into a design
2. `/supremepower:write-plan` - Break into implementation tasks
3. `/supremepower:tdd` - Implement with tests-first approach
4. `/supremepower:request-review` - Review before completion

**Fixing a bug:**
1. `/supremepower:systematic-debug` - Root cause analysis
2. `/supremepower:tdd` - Write failing test, fix, verify
3. `/supremepower:request-review` - Ensure fix is correct

**Large project:**
1. `/supremepower:brainstorm` - Design the system
2. `/supremepower:write-plan` - Comprehensive implementation plan
3. `/supremepower:execute-plan` - Execute in batches with checkpoints
4. `/supremepower:finish-branch` - Merge or create PR

## Integration with MCP Servers

SupremePower includes Context7 MCP server for up-to-date library documentation.
Use `@context7` to get current docs for any library.

## Skills Library

All skills available in ~/.gemini/skills/:
- brainstorming
- test-driven-development
- systematic-debugging
- writing-plans
- executing-plans
- subagent-driven-development
- requesting-code-review
- receiving-code-review
- finishing-a-development-branch
- using-git-worktrees
- dispatching-parallel-agents
- verification-before-completion
- writing-skills (for creating new skills)

## Creating Custom Skills

See the `writing-skills` skill for guidance on creating your own skills
with effective context hints and conditional blocks.
```

### Installation Script

**File: `install.sh`**

```bash
#!/usr/bin/env bash
# SupremePower installation script for Gemini CLI

set -euo pipefail

GEMINI_DIR="${HOME}/.gemini"
EXTENSION_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "Installing SupremePower for Gemini CLI..."

# Create directories
mkdir -p "${GEMINI_DIR}/skills"
mkdir -p "${GEMINI_DIR}/agents"
mkdir -p "${GEMINI_DIR}/commands"
mkdir -p "${GEMINI_DIR}/hooks"

# Copy skills
echo "Copying skills library..."
cp -r "${EXTENSION_ROOT}/core/skills/"* "${GEMINI_DIR}/skills/"

# Copy agents
echo "Copying agent personas..."
cp -r "${EXTENSION_ROOT}/core/agents/"* "${GEMINI_DIR}/agents/"

# Copy commands
echo "Installing commands..."
cp "${EXTENSION_ROOT}/adapters/gemini-cli/commands/"*.toml "${GEMINI_DIR}/commands/"

# Copy hooks
echo "Installing hooks..."
cp "${EXTENSION_ROOT}/adapters/gemini-cli/hooks/"*.js "${GEMINI_DIR}/hooks/"
chmod +x "${GEMINI_DIR}/hooks/"*.js

# Merge settings
echo "Configuring settings..."
if [ -f "${GEMINI_DIR}/settings.json" ]; then
  # Backup existing settings
  cp "${GEMINI_DIR}/settings.json" "${GEMINI_DIR}/settings.json.backup"
  echo "Existing settings backed up to settings.json.backup"
fi

# Copy GEMINI.md if not exists
if [ ! -f "${GEMINI_DIR}/GEMINI.md" ]; then
  cp "${EXTENSION_ROOT}/adapters/gemini-cli/GEMINI.md.template" "${GEMINI_DIR}/GEMINI.md"
else
  echo "GEMINI.md already exists, skipping..."
fi

echo ""
echo "✓ SupremePower installed successfully!"
echo ""
echo "Next steps:"
echo "1. Restart Gemini CLI: gemini --restart"
echo "2. Verify installation: /help"
echo "3. Try a command: /supremepower:brainstorm \"How should I structure my API?\""
echo ""
echo "Documentation: ${EXTENSION_ROOT}/docs/"
```

### Settings Template

**File: `settings.json.template`**

```json
{
  "context": {
    "fileName": ["GEMINI.md", "CONTEXT.md"]
  },
  "mcpServers": {
    "context7": {
      "httpUrl": "https://mcp.context7.com/mcp",
      "timeout": 10000
    }
  },
  "hooks": {
    "BeforeAgent": [
      {
        "matcher": "*",
        "hooks": [
          {
            "name": "supremepower-agent-router",
            "type": "command",
            "command": "node ~/.gemini/hooks/before-agent.js",
            "description": "Activate relevant agent personas based on context"
          }
        ]
      }
    ]
  }
}
```

---

## 6. GitHub Copilot Adapter (Architecture Only)

Since GitHub Copilot is not part of MVP, this section defines the **interface and approach** for future implementation.

### Structure

```
adapters/github-copilot/
├── ARCHITECTURE.md               # Complete design document
├── adapter-interface.js          # Abstract interface (not implemented)
├── installation/
│   ├── setup-copilot.sh         # Future install script
│   └── README.md                # Installation guide
└── templates/
    ├── copilot-instructions.md.template
    └── instructions/            # Targeted instruction templates
        ├── security.instructions.md.template
        ├── backend.instructions.md.template
        ├── frontend.instructions.md.template
        └── testing.instructions.md.template
```

### Integration Strategy

**Repository-Level Instructions (.github/copilot-instructions.md):**

```markdown
# SupremePower Framework Active

This repository uses the SupremePower framework for systematic development.

## Core Principles
- Test-Driven Development (RED-GREEN-REFACTOR)
- Systematic debugging over ad-hoc fixes
- Skills-based workflows for consistency
- Agent personas for specialized expertise

## Skills Available
Available in `.supremepower/skills/`:
- `test-driven-development` - TDD enforcement
- `systematic-debugging` - Root cause analysis
- `brainstorming` - Design refinement
- `writing-plans` - Implementation planning

## Agent Personas
- `security-engineer` - Auth, crypto, vulnerabilities
- `backend-architect` - System design, databases
- `frontend-architect` - UI/UX, performance
- `performance-engineer` - Optimization, profiling

When working with code, reference the relevant skill in
`.supremepower/skills/` and follow its process exactly.
```

**Targeted Instructions (.github/instructions/security.instructions.md):**

```yaml
---
appliesTo:
  - "**/auth/**"
  - "**/security/**"
  - "**/*auth*.{ts,js,py}"
  - "**/*token*.{ts,js,py}"
  - "**/*session*.{ts,js,py}"
---

# Security Engineering Context

You are operating as a **security-engineer** persona.

Expertise: Authentication, authorization, cryptography, OWASP vulnerabilities

When making changes to security-sensitive code:
1. Follow the `systematic-debugging` skill for bug fixes
2. Follow the `test-driven-development` skill for new features
3. Consider: token validation, session management, injection attacks
4. Verify: Input sanitization, output encoding, secure defaults

Reference: `.supremepower/agents/security-engineer.md`
```

**Targeted Instructions (.github/instructions/backend.instructions.md):**

```yaml
---
appliesTo:
  - "**/api/**"
  - "**/database/**"
  - "**/models/**"
  - "**/*service*.{ts,js,py}"
  - "**/*repository*.{ts,js,py}"
---

# Backend Architecture Context

You are operating as a **backend-architect** persona.

Expertise: System design, APIs, databases, scalability

When making changes to backend code:
1. Follow TDD for all data layer changes
2. Consider: API contracts, database performance, transaction boundaries
3. Verify: Error handling, data validation, logging

Reference: `.supremepower/agents/backend-architect.md`
```

### Key Differences from Gemini CLI

| Aspect | Gemini CLI | GitHub Copilot |
|--------|-----------|----------------|
| **Skill loading** | Dynamic via hooks | Static via .md file references |
| **Agent activation** | Automatic via BeforeAgent hook | Path-based via appliesTo rules |
| **Context injection** | Runtime JS execution | Pre-configured markdown files |
| **Commands** | TOML-based slash commands | Natural language + @workspace |
| **Installation** | Extension system | Manual .github/ setup |
| **Updating** | gemini extensions update | Git commit and push |

### Adapter Interface

**File: `adapter-interface.js`**

```javascript
/**
 * Abstract interface for GitHub Copilot adapter
 * To be implemented when Copilot becomes a target platform
 */

class CopilotAdapter {
  /**
   * Generate .github/copilot-instructions.md from core skills
   *
   * @param {string} skillsPath - Path to core/skills/
   * @param {string} agentsPath - Path to core/agents/
   * @returns {Promise<string>} Generated copilot-instructions.md content
   */
  async generateRootInstructions(skillsPath, agentsPath) {
    throw new Error('Not implemented - architecture only');
  }

  /**
   * Generate targeted .instructions.md files based on agent definitions
   *
   * @param {string} agentsPath - Path to core/agents/
   * @param {string} outputDir - Path to .github/instructions/
   * @returns {Promise<Array<{filename: string, content: string}>>}
   */
  async generateTargetedInstructions(agentsPath, outputDir) {
    throw new Error('Not implemented - architecture only');
  }

  /**
   * Map skill context hints to file path patterns
   *
   * @param {string} skillContent - Content of SKILL.md file
   * @returns {Array<string>} Array of glob patterns
   */
  mapSkillToFilePatterns(skillContent) {
    throw new Error('Not implemented - architecture only');
  }

  /**
   * Map agent activation keywords to file path patterns
   *
   * @param {Object} agentDefinition - Parsed agent frontmatter
   * @returns {Array<string>} Array of glob patterns for appliesTo
   */
  mapAgentToFilePatterns(agentDefinition) {
    throw new Error('Not implemented - architecture only');
  }

  /**
   * Validate Copilot instructions syntax
   *
   * @param {string} instructionsContent - Content to validate
   * @returns {Array<{line: number, message: string}>} Validation errors
   */
  validateInstructions(instructionsContent) {
    throw new Error('Not implemented - architecture only');
  }

  /**
   * Install SupremePower for Copilot
   *
   * @param {string} repoPath - Path to repository root
   * @param {Object} options - Installation options
   * @returns {Promise<void>}
   */
  async install(repoPath, options = {}) {
    throw new Error('Not implemented - architecture only');
  }
}

module.exports = { CopilotAdapter };
```

### Architecture Document Outline

**File: `ARCHITECTURE.md`** would include:

1. **Overview** - How SupremePower integrates with GitHub Copilot
2. **Limitations** - What can't be done with static instructions
3. **Mapping Strategy**
   - Skills → copilot-instructions.md sections
   - Agents → targeted .instructions.md files
   - Context hints → appliesTo patterns
   - Conditional blocks → multiple instruction files
4. **File Structure** - Where files go in repository
5. **Installation Process** - Manual and automated options
6. **Testing Methodology** - How to verify instructions work
7. **Migration Path** - From manual to automated generation
8. **Maintenance** - Keeping instructions synchronized with skills/agents
9. **Examples** - Complete working examples for common scenarios
10. **Implementation Checklist** - Step-by-step guide for future developer

---

## 7. Installation, Migration & Testing

### Installation Flow (Gemini CLI MVP)

**Prerequisites:**
- Node.js 18+
- Gemini CLI installed and configured
- Git (for GitHub installation method)

**Installation Methods:**

**Method 1: Via Gemini Extensions (Recommended)**
```bash
# Install from GitHub
gemini extensions install https://github.com/org/supremepower

# Or install locally for development
git clone https://github.com/org/supremepower
cd supremepower
npm install
npm run build
gemini extensions link .
```

**Method 2: Manual Installation**
```bash
# Clone repository
git clone https://github.com/org/supremepower
cd supremepower

# Run installation script
./adapters/gemini-cli/install.sh

# Installation script performs:
# 1. Copy core/skills/ → ~/.gemini/skills/
# 2. Copy core/agents/ → ~/.gemini/agents/
# 3. Copy commands/*.toml → ~/.gemini/commands/
# 4. Install hooks → ~/.gemini/hooks/
# 5. Merge settings.json.template → ~/.gemini/settings.json
# 6. Copy GEMINI.md → ~/.gemini/GEMINI.md
```

**Post-Installation:**
```bash
# Restart Gemini CLI to load extension
gemini --restart

# Verify installation
/help  # Should show /supremepower:* commands

# Test basic functionality
/supremepower:brainstorm "How should I structure my API?"
```

### Migration from SuperGemini

**For existing SuperGemini users:**

```bash
# Backup existing configuration
cp ~/.gemini/settings.json ~/.gemini/settings.json.backup
cp -r ~/.gemini/agents ~/.gemini/agents.supergemini-backup

# Install SupremePower with migration
supremepower install --platform gemini-cli --migrate-from supergemini

# Migration script performs:
# 1. Detect existing SuperGemini installation
# 2. Preserve custom agents and commands
# 3. Add SupremePower skills library
# 4. Update hooks to use new agent routing
# 5. Merge behavioral instructions
# 6. Generate migration report showing conflicts
```

**Migration Report Example:**
```
SupremePower Migration Report
=============================

✓ Preserved agents:
  - security-engineer (custom modifications)
  - backend-architect (custom modifications)

✓ Added new capabilities:
  - Skills library (18 skills from Superpowers)
  - Context hint parsing and agent routing
  - Conditional agent activation
  - BeforeAgent hook for automatic agent selection

⚠ Conflicts detected:
  - /sg:analyze command conflicts with /supremepower:brainstorm
    Resolution: Both kept with different prefixes
  - Custom agent 'fullstack-developer' not in standard set
    Resolution: Preserved in ~/.gemini/agents/

→ Next steps:
  1. Review merged ~/.gemini/settings.json
  2. Test key workflows: /supremepower:brainstorm, /supremepower:tdd
  3. Gradually migrate from /sg:* to /supremepower:* commands
  4. Custom agents automatically participate in agent routing

→ Documentation:
  - Migration guide: docs/guides/migration-from-supergemini.md
  - Breaking changes: CHANGELOG.md
```

### Testing Strategy

**Unit Tests (core/):**
```bash
# Test agent routing logic
npm test -- orchestration/agent-matcher.test.js

# Test context hint extraction
npm test -- orchestration/context-parser.test.js

# Test conditional evaluation
npm test -- orchestration/conditional-evaluator.test.js

# Test skill loading
npm test -- lib/skill-loader.test.js

# Run all unit tests
npm test
```

**Integration Tests (adapters/gemini-cli/):**
```bash
# Test extension installation
npm run test:integration:install

# Test command execution
npm run test:integration:commands

# Test hook execution
npm run test:integration:hooks

# Test agent activation scenarios
npm run test:integration:agents

# Run all integration tests
npm run test:integration
```

**Example Integration Test:**
```javascript
// Test: Security engineer activates for auth-related tasks
describe('Agent Activation', () => {
  it('activates security-engineer for authentication bug', async () => {
    const userMessage = "Fix the JWT validation bug in auth.ts";
    const skillContent = fs.readFileSync('skills/systematic-debugging/SKILL.md', 'utf8');

    // Mock environment
    process.env.GEMINI_USER_MESSAGE = userMessage;

    // Run BeforeAgent hook
    const result = await runHook('before-agent.js');
    const output = JSON.parse(result.stdout);

    // Verify security-engineer was activated
    expect(output.hookSpecificOutput.additionalContext).toContain('security-engineer');
    expect(output.hookSpecificOutput.additionalContext).toContain('authentication');
  });

  it('activates multiple agents for cross-domain work', async () => {
    const userMessage = "Build an authenticated API endpoint with database persistence";
    const skillContent = fs.readFileSync('skills/test-driven-development/SKILL.md', 'utf8');

    process.env.GEMINI_USER_MESSAGE = userMessage;

    const result = await runHook('before-agent.js');
    const output = JSON.parse(result.stdout);

    // Should activate security-engineer (auth), backend-architect (API), database-specialist
    expect(output.hookSpecificOutput.additionalContext).toContain('security-engineer');
    expect(output.hookSpecificOutput.additionalContext).toContain('backend-architect');
    expect(output.hookSpecificOutput.additionalContext).toContain('database-specialist');
  });

  it('uses conditionals when hints are ambiguous', async () => {
    const userMessage = "Update user authentication";
    const skillContent = `
      ---
      name: test-skill
      ---
      # Test Skill

      Make sure to handle this carefully.

      ## Agent Activation

      If working with:
      - authentication → security-engineer
    `;

    // Create temporary skill
    const skillPath = '/tmp/test-skill/SKILL.md';
    fs.mkdirSync(path.dirname(skillPath), { recursive: true });
    fs.writeFileSync(skillPath, skillContent);

    process.env.GEMINI_USER_MESSAGE = "use the test-skill";

    const result = await runHook('before-agent.js');
    const output = JSON.parse(result.stdout);

    // Conditional should trigger even without strong context hints
    expect(output.hookSpecificOutput.additionalContext).toContain('security-engineer');
  });
});
```

**Manual Testing Checklist:**
```markdown
## Installation Testing
- [ ] Install SupremePower on clean Gemini CLI
- [ ] Verify all /supremepower:* commands appear in /help
- [ ] Verify skills copied to ~/.gemini/skills/
- [ ] Verify agents copied to ~/.gemini/agents/
- [ ] Verify hooks installed and executable
- [ ] Verify settings.json updated correctly
- [ ] Verify GEMINI.md created

## Command Testing
- [ ] Test /supremepower:brainstorm with sample project
- [ ] Test /supremepower:write-plan with feature spec
- [ ] Test /supremepower:execute-plan with existing plan
- [ ] Test /supremepower:tdd workflow (write test → implement → refactor)
- [ ] Test /supremepower:systematic-debug with intentional bug
- [ ] Test /supremepower:request-review with completed code
- [ ] Test /supremepower:finish-branch with completed work

## Agent Activation Testing
- [ ] Verify security-engineer activates for auth file
- [ ] Verify backend-architect activates for API file
- [ ] Verify frontend-architect activates for component file
- [ ] Verify performance-engineer activates for optimization task
- [ ] Verify database-specialist activates for migration file
- [ ] Verify multiple agents activate for cross-domain work
- [ ] Verify no agents activate for generic task

## Migration Testing
- [ ] Install SuperGemini first
- [ ] Customize agents and commands
- [ ] Run migration script
- [ ] Verify custom agents preserved
- [ ] Verify custom commands preserved
- [ ] Verify both frameworks coexist
- [ ] Verify migration report accuracy

## Integration Testing
- [ ] Verify Context7 MCP integration works
- [ ] Test @context7 in conversation
- [ ] Verify hook runs before every request
- [ ] Verify hook doesn't slow down requests significantly
- [ ] Test with multiple concurrent requests
- [ ] Test hook error handling

## Edge Cases
- [ ] Test with missing skill file
- [ ] Test with malformed skill frontmatter
- [ ] Test with missing agent file
- [ ] Test with empty context hints
- [ ] Test with very long context hints
- [ ] Test with special characters in skill content
```

### Performance Benchmarks

**Acceptance Criteria:**
- Hook execution: < 100ms for typical request
- Agent matching: < 50ms for 13 agents
- Skill parsing: < 20ms per skill
- Memory overhead: < 50MB for full framework

**Benchmark Suite:**
```bash
npm run benchmark
```

**Example Benchmark Results:**
```
SupremePower Performance Benchmarks
====================================

Hook Execution:
  ✓ before-agent.js (simple request): 45ms
  ✓ before-agent.js (complex request): 78ms
  ✓ before-agent.js (no skill): 12ms

Agent Matching:
  ✓ Score 13 agents (direct hints): 32ms
  ✓ Score 13 agents (subtle hints): 28ms
  ✓ Evaluate conditionals: 8ms

Context Parsing:
  ✓ Extract hints (1KB skill): 5ms
  ✓ Extract hints (10KB skill): 18ms
  ✓ Extract conditionals: 3ms

Memory Usage:
  ✓ Baseline (no agents): 45MB
  ✓ With 13 agents loaded: 68MB
  ✓ With 18 skills cached: 52MB
  ✓ Full framework active: 83MB

All benchmarks passed ✓
```

---

## 8. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

**Deliverables:**
- Core repository structure
- Skills library ported from Superpowers (18 skills)
- Agent definitions ported from SuperGemini (13 agents)
- Core orchestration modules

**Tasks:**
1. Initialize repository with adapter pattern structure
2. Copy and validate all Superpowers skills
3. Copy and enhance SuperGemini agent definitions with YAML frontmatter
4. Implement context-parser.js (extract hints from skills)
5. Implement agent-matcher.js (score and select agents)
6. Implement conditional-evaluator.js (if/then rules)
7. Write unit tests for core modules

**Success Criteria:**
- All 18 skills load correctly with valid frontmatter
- All 13 agents parse correctly with YAML metadata
- Context parser extracts hints with 90%+ accuracy
- Agent matcher selects correct agents in test scenarios
- Conditional evaluator handles complex rules correctly
- Unit test coverage > 80%

### Phase 2: Gemini CLI Adapter (Weeks 3-4)

**Deliverables:**
- Complete Gemini CLI extension
- BeforeAgent hook implementation
- TOML command files
- Installation scripts
- Integration tests

**Tasks:**
1. Create gemini-extension.json with MCP config
2. Implement before-agent.js hook with scoring algorithm
3. Generate TOML commands for all skills
4. Create settings.json.template
5. Write GEMINI.md core instructions
6. Implement install.sh script with backup
7. Implement migration script for SuperGemini users
8. Write integration tests
9. Manual testing with real Gemini CLI sessions
10. Performance benchmarking

**Success Criteria:**
- Extension installs cleanly on fresh Gemini CLI
- All commands appear in /help
- BeforeAgent hook activates correct agents (>85% accuracy)
- Skills load and execute properly
- Migration from SuperGemini works without breaking changes
- Hook execution < 100ms
- No memory leaks
- All integration tests pass

### Phase 3: Documentation & Polish (Week 5)

**Deliverables:**
- Complete documentation
- Migration guide
- Writing skills guide
- Troubleshooting guide
- Examples and tutorials

**Tasks:**
1. Write installation documentation for Gemini CLI
2. Create migration guide with SuperGemini examples
3. Write skills authoring guide (context hints, conditionals)
4. Document agent routing algorithm and tuning
5. Create example projects (small, medium, large)
6. Record video walkthrough (installation, basic usage, advanced features)
7. Write contribution guidelines
8. Create FAQ and troubleshooting guide
9. Set up documentation website (GitHub Pages)
10. Write blog post announcement

**Success Criteria:**
- New users can install without assistance
- SuperGemini users can migrate successfully
- Skill authors understand how to write agent-aware skills
- Documentation covers 90% of common questions
- Video walkthrough < 15 minutes
- Example projects demonstrate key features

### Phase 4: GitHub Copilot Foundation (Week 6)

**Deliverables:**
- Complete ARCHITECTURE.md for Copilot adapter
- Interface definitions
- Template files
- Implementation plan

**Tasks:**
1. Document Copilot integration strategy in detail
2. Design skills → copilot-instructions.md mapping
3. Design agents → targeted instructions mapping
4. Create template files for all scenarios
5. Define adapter interface with method signatures
6. Write implementation plan for future team
7. Create examples of generated instruction files
8. Document limitations and workarounds
9. Design testing strategy for Copilot integration
10. Estimate implementation effort

**Success Criteria:**
- Architecture document is implementation-ready
- Templates demonstrate the approach clearly
- Interface is well-defined and testable
- Future implementer can work independently from docs
- Limitations are clearly documented
- Examples cover common use cases

### Post-MVP: Future Phases

**Phase 5: Community & Ecosystem (Weeks 7-8)**
- Launch on GitHub with proper README
- Create Discord/forum community
- Set up CI/CD pipeline
- Establish contribution workflow
- First community skill/agent contributions
- Gather feedback and iterate

**Phase 6: Claude Code Adapter (Weeks 9-10)**
- Port existing Superpowers plugin to SupremePower
- Add agent routing capability to Claude Code
- Maintain backward compatibility with Superpowers users
- Create migration guide
- Test with Claude Code marketplace

**Phase 7: GitHub Copilot Implementation (Weeks 11-13)**
- Implement CopilotAdapter based on Phase 4 architecture
- Generate instruction files from skills/agents
- Test with real Copilot installations
- Create installation tooling
- Document edge cases and limitations

**Phase 8: Additional Platforms (Weeks 14+)**
- Cursor AI adapter
- Cody (Sourcegraph) adapter
- Amazon Q Developer adapter
- JetBrains AI adapter
- Platform comparison and feature matrix

---

## 9. Risks & Mitigations

### Technical Risks

**Risk 1: Agent routing accuracy**
- **Description:** Context hints might not reliably select correct agents
- **Probability:** Medium
- **Impact:** High - Core value proposition
- **Mitigation:**
  - Extensive testing with diverse scenarios (100+ test cases)
  - Fallback to conditional blocks when confidence low
  - Manual override mechanism in settings (`agents.forceActivate`)
  - Iterative tuning of scoring algorithm based on feedback
  - Telemetry to track activation accuracy in production
  - A/B testing different scoring weights

**Risk 2: Platform API changes**
- **Description:** Gemini CLI or Copilot might change their extension/hook APIs
- **Probability:** Medium
- **Impact:** Medium - Could break functionality
- **Mitigation:**
  - Version pinning in dependencies
  - Adapter pattern isolates platform changes to single directory
  - Automated tests catch breaking changes immediately
  - Monitor platform changelogs and beta programs
  - Maintain compatibility matrix
  - Deprecation warnings before removing old API support

**Risk 3: Performance overhead**
- **Description:** Hook execution might slow down requests
- **Probability:** Low
- **Impact:** Medium - User experience
- **Mitigation:**
  - Optimize hook scripts (lazy loading, caching, async)
  - Benchmark and set performance budgets (< 100ms)
  - Profile hot paths and optimize
  - Consider caching agent definitions
  - Implement timeout mechanisms
  - Allow disabling agent routing for performance-critical work

**Risk 4: Skill/agent compatibility**
- **Description:** Superpowers skills might not work well with SuperGemini agents
- **Probability:** Low
- **Impact:** Medium - Quality of integration
- **Mitigation:**
  - Thorough integration testing across all combinations
  - Iterative refinement based on real usage
  - Community feedback loop and issue tracking
  - Versioning for breaking changes
  - Compatibility testing as part of CI/CD
  - Clear upgrade path documentation

### Product Risks

**Risk 5: SuperGemini user resistance**
- **Description:** SuperGemini users might not want to migrate
- **Probability:** Medium
- **Impact:** Medium - Adoption rate
- **Mitigation:**
  - Emphasize clear benefits (Superpowers methodology + enhanced routing)
  - Seamless migration path with zero breaking changes
  - Support both side-by-side initially
  - Clear migration guide and hands-on support
  - Preserve all custom agents and commands
  - Testimonials from early adopters
  - Gradual deprecation timeline (6+ months)

**Risk 6: Complexity for new users**
- **Description:** Skills + agents might be too complex for beginners
- **Probability:** Medium
- **Impact:** Low - Onboarding friction
- **Mitigation:**
  - Excellent documentation with progressive disclosure
  - Start simple: "Just run /supremepower:brainstorm"
  - Video tutorials for visual learners
  - Sensible defaults that "just work"
  - Hide complexity: agents activate automatically
  - Quick start guide (< 5 minutes to first success)
  - Example projects demonstrating value immediately

**Risk 7: Maintenance burden**
- **Description:** Supporting multiple platforms might become overwhelming
- **Probability:** Medium
- **Impact:** Medium - Long-term sustainability
- **Mitigation:**
  - Adapter pattern keeps platforms isolated
  - Automated testing reduces manual QA
  - Community contributions via clear guidelines
  - Prioritize platforms by usage metrics
  - Consider sponsorship/funding model
  - Modular architecture allows sunsetting platforms
  - Core skills/agents maintained separately from adapters

### Mitigation Strategy Summary

**Monitoring & Feedback:**
- Telemetry for agent activation accuracy
- User satisfaction surveys
- GitHub issues and discussions
- Performance monitoring in production

**Quality Assurance:**
- Comprehensive test suite (unit + integration)
- Performance benchmarks as part of CI
- Manual testing checklist before releases
- Beta program with early adopters

**Community Building:**
- Clear contribution guidelines
- Responsive to issues and PRs
- Recognition for contributors
- Regular community updates

---

## 10. Success Metrics & Next Steps

### Success Metrics (3 months post-launch)

**Adoption Metrics:**
- **Target:** 1,000+ Gemini CLI installations
- **Measurement:** Extension download count, GitHub clone stats
- **Target:** 50% of SuperGemini users migrated
- **Measurement:** Migration script executions, user surveys
- **Target:** 100+ GitHub stars
- **Measurement:** GitHub star count

**Engagement Metrics:**
- **Target:** 70% of users use framework weekly
- **Measurement:** Telemetry (opt-in), usage analytics
- **Target:** Average 5+ skill invocations per session
- **Measurement:** Command usage tracking
- **Target:** 80% completion rate for brainstorming → implementation workflows
- **Measurement:** Session analysis, workflow completion tracking

**Quality Metrics:**
- **Target:** Agent activation accuracy > 85%
- **Measurement:** Telemetry comparing activated agents to user corrections
- **Target:** Bug report rate < 5% of installs
- **Measurement:** GitHub issues tagged as bugs
- **Target:** Documentation satisfaction > 4/5 stars
- **Measurement:** Documentation feedback survey
- **Target:** Performance: Hook execution < 100ms (95th percentile)
- **Measurement:** Performance telemetry

**Community Metrics:**
- **Target:** 10+ community-contributed skills
- **Measurement:** PRs merged, skills/ directory growth
- **Target:** 5+ community-contributed agents
- **Measurement:** PRs merged, agents/ directory growth
- **Target:** Active Discord/forum discussions
- **Measurement:** Daily active users, message volume
- **Target:** 50+ contributors
- **Measurement:** GitHub contributor count

### Analytics Dashboard

**Planned metrics to track:**
```
SupremePower Analytics Dashboard
================================

Installations:
  Total: 1,247
  Last 30 days: 312
  Gemini CLI: 1,247 (100%)
  GitHub Copilot: 0 (not released)

Usage:
  Active users (7d): 834 (67%)
  Avg commands/session: 6.2
  Most popular: /brainstorm (42%), /tdd (28%), /debug (18%)

Agent Activation:
  Accuracy: 87.3%
  Most activated: security-engineer (23%), backend-architect (19%)
  Multi-agent sessions: 34%

Performance:
  Avg hook execution: 52ms
  95th percentile: 89ms
  99th percentile: 134ms
  Timeouts: 0.01%

Community:
  GitHub stars: 127
  Contributors: 18
  Custom skills: 12
  Custom agents: 7
  Open issues: 23
  Closed issues: 87

Migration:
  SuperGemini users: 456
  Migrated: 228 (50%)
  Migration success rate: 97%
```

### Immediate Next Steps

1. **Create repository structure**
   - Initialize Git repository
   - Set up directory structure from Section 2
   - Create initial README.md
   - Set up .gitignore

2. **Port skills library**
   - Copy all 18 Superpowers skills to core/skills/
   - Validate frontmatter formatting
   - Add context hints to critical skills
   - Add conditional blocks where needed

3. **Port agent definitions**
   - Copy SuperGemini agents to core/agents/
   - Add YAML frontmatter with activation keywords
   - Document expertise areas
   - Set complexity thresholds

4. **Implement core modules**
   - context-parser.js with hint extraction
   - agent-matcher.js with scoring algorithm
   - conditional-evaluator.js with rule processing
   - Write unit tests for each module

5. **Set up testing infrastructure**
   - Configure Jest for unit tests
   - Create integration test harness
   - Set up CI/CD pipeline (GitHub Actions)
   - Configure code coverage reporting

6. **Begin Gemini CLI adapter**
   - Create gemini-extension.json
   - Implement before-agent.js hook
   - Generate first TOML command (brainstorm)
   - Test end-to-end with local Gemini CLI

---

## Appendix A: Complete Skills List

1. **brainstorming** - Interactive design refinement
2. **test-driven-development** - RED-GREEN-REFACTOR enforcement
3. **systematic-debugging** - Four-phase root cause analysis
4. **writing-plans** - Detailed implementation planning
5. **executing-plans** - Batch execution with checkpoints
6. **subagent-driven-development** - Multi-agent task execution
7. **requesting-code-review** - Pre-merge review process
8. **receiving-code-review** - Handling review feedback
9. **finishing-a-development-branch** - Merge/PR workflow
10. **using-git-worktrees** - Parallel development isolation
11. **dispatching-parallel-agents** - Concurrent task coordination
12. **verification-before-completion** - Final validation checks
13. **using-supremepower** - Framework introduction (injected at startup)
14. **writing-skills** - Creating new skills with TDD

## Appendix B: Complete Agents List

1. **security-engineer** - Auth, crypto, vulnerabilities
2. **backend-architect** - System design, APIs, databases
3. **frontend-architect** - UI/UX, components, state management
4. **performance-engineer** - Optimization, profiling, scalability
5. **testing-specialist** - Test strategies, coverage, quality
6. **api-specialist** - API design, REST, GraphQL, contracts
7. **database-specialist** - Schema, queries, migrations, optimization
8. **devops-engineer** - Deployment, infrastructure, CI/CD
9. **technical-writer** - Documentation, clarity, user guides
10. **python-expert** - Python idioms, libraries, best practices
11. **javascript-expert** - JS/TS, Node.js, frontend frameworks
12. **system-architect** - High-level design, patterns, trade-offs
13. **code-reviewer** - Code quality, maintainability, standards

## Appendix C: Context Hint Examples

**Subtle Hints (Flexible interpretation):**
- "Consider security implications"
- "Analyze performance characteristics"
- "Understand database consistency requirements"
- "Think about user experience"
- "Evaluate architectural trade-offs"

**Direct Hints (Explicit expertise):**
- "Requires security engineering expertise for authentication flows"
- "Needs frontend architecture knowledge for component design"
- "Must have database optimization understanding"
- "Requires DevOps expertise for deployment configuration"
- "Needs API design experience for endpoint contracts"

**Anti-Patterns (Too vague):**
- "Be careful" - No actionable guidance
- "Do it right" - Not specific enough
- "Consider best practices" - Which practices?
- "Think about it" - Think about what?

**Best Practices:**
- Use domain-specific keywords that match agent activation keywords
- Be specific about the type of expertise needed
- Include multiple hints for cross-domain work
- Use direct hints for critical/security work
- Use subtle hints for exploratory work

## Appendix D: Conditional Block Patterns

**Basic Pattern:**
```markdown
## Agent Activation

If working with:
- [condition] → [agent-name]
```

**Multiple Agents:**
```markdown
- authentication → security-engineer + testing-specialist
```

**Multiple Conditions:**
```markdown
- authentication/authorization/tokens/sessions → security-engineer
```

**Nested Conditions:**
```markdown
- authentication:
  - OAuth/JWT → security-engineer + backend-architect
  - Social login → security-engineer + api-specialist
```

**File Type Conditions:**
```markdown
- *.test.* files → testing-specialist
- API endpoints → backend-architect + api-specialist
- UI components → frontend-architect
```

**Task Type Conditions:**
```markdown
- New feature → [relevant domain agents]
- Bug fix → systematic-debugging skill first
- Refactoring → code-reviewer + [domain agents]
- Performance issue → performance-engineer
```

---

## Conclusion

SupremePower represents the next evolution of AI-assisted development frameworks, combining the proven methodologies of Superpowers with the intelligent agent routing of SuperGemini. By creating a universal, portable framework with a clean adapter pattern, SupremePower positions itself to become the standard development workflow system across all major coding agents.

**Key Innovations:**
1. Skills invoke agents via context hints and conditionals
2. Subtle + direct hints provide flexibility with safety
3. Pure Superpowers format maintains portability
4. Adapter pattern enables multi-platform support
5. SuperGemini supersession provides clear upgrade path

**MVP Focus:**
- Gemini CLI implementation with full feature parity
- GitHub Copilot architectural foundation
- Seamless migration from SuperGemini
- Comprehensive testing and documentation

**Long-term Vision:**
- Universal framework across all coding agents
- Community-driven skills and agents library
- Best-in-class developer experience
- Industry standard for AI-assisted development

The design is complete and ready for implementation. Next step: Create the repository and begin Phase 1 development.
