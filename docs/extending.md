# Extending SupremePower

Complete guide to creating custom skills and agents for SupremePower framework.

## Table of Contents

- [Custom Skills](#custom-skills)
- [Custom Agents](#custom-agents)
- [Testing Your Extensions](#testing-your-extensions)
- [Sharing Extensions](#sharing-extensions)
- [Best Practices](#best-practices)

## Custom Skills

Skills are markdown files with YAML frontmatter that guide the AI through specific workflows.

### Skill File Structure

```
~/.supremepower/skills/my-skill/
├── SKILL.md          # Required: Main skill content
├── example.md        # Optional: Examples
└── reference.md      # Optional: Additional reference material
```

### Creating a Custom Skill

**Step 1: Create skill directory**

```bash
mkdir -p ~/.supremepower/skills/my-custom-skill
```

**Step 2: Create SKILL.md with frontmatter**

```markdown
---
name: my-custom-skill
description: Use when implementing microservices with event-driven architecture
---

# My Custom Skill

## Overview

This skill guides you through designing and implementing event-driven microservices using domain-driven design principles.

## When to Use

Use this skill when:
- Building distributed systems with loose coupling
- Implementing event sourcing or CQRS patterns
- Designing microservice communication patterns

## Workflow

### Phase 1: Domain Modeling

1. **Identify Bounded Contexts**
   - List all business capabilities
   - Group related capabilities
   - Define context boundaries

2. **Define Domain Events**
   - What significant things happen in your system?
   - What state changes need to be communicated?

### Phase 2: Service Design

[Detailed steps...]

## Conditional Agent Activation

IF user_message contains "microservices" OR "event-driven" OR "domain-driven"
THEN ACTIVATE backend-architect, system-architect
CONFIDENCE high

IF user_message contains "kafka" OR "event bus"
THEN ACTIVATE devops-engineer
CONFIDENCE medium

## Related Skills

- **brainstorming** - Use first to explore requirements
- **writing-plans** - Use after design to create implementation plan
- **systematic-debugging** - Use when debugging distributed systems

## Examples

### Example 1: E-commerce Order Processing

[Detailed example...]
```

### YAML Frontmatter Requirements

```yaml
---
name: skill-name                 # REQUIRED: Lowercase, hyphens only
description: Use when...         # REQUIRED: Start with "Use when", max 500 chars
---
```

**Frontmatter Rules:**

1. **Name Requirements:**
   - Lowercase letters, numbers, hyphens only
   - No spaces, underscores, or special characters
   - Should be descriptive and unique
   - Examples: `microservices-design`, `react-performance`, `sql-optimization`

2. **Description Requirements:**
   - MUST start with "Use when" or "Use this skill when"
   - Describe TRIGGERS, not workflow (symptoms, not process)
   - Max 500 characters (< 1024 bytes total frontmatter)
   - Examples:
     - ✅ "Use when implementing microservices with event-driven architecture"
     - ✅ "Use when optimizing React component rendering performance"
     - ❌ "This skill teaches you how to..." (describes workflow, not trigger)
     - ❌ "Microservices design skill" (no "Use when")

### Conditional Agent Blocks

Explicitly activate agents based on keywords:

```markdown
## Conditional Agent Activation

IF user_message contains "performance" OR "slow" OR "latency"
THEN ACTIVATE performance-engineer
CONFIDENCE high

IF user_message contains "database" AND "optimization"
THEN ACTIVATE database-specialist, performance-engineer
CONFIDENCE high

WHEN user_message contains "security"
THEN ACTIVATE security-engineer
CONFIDENCE medium
```

**Syntax:**
- `IF` / `WHEN` - Condition keyword
- `contains "keyword"` - Keyword match (case-insensitive)
- `OR` / `AND` - Logical operators
- `THEN ACTIVATE agent-name` - Agent to activate
- `CONFIDENCE high|medium|low` - Activation confidence

### Platform-Specific Considerations

#### Gemini CLI

Skills automatically available as:
- `/skills:my-custom-skill` - Full command
- Can create alias in `commands/my-alias.toml` if desired

#### Claude Code

Skills discovered automatically from:
1. `~/.claude/skills/` (personal - highest priority)
2. Plugin's `skills/` directory (superpowers - fallback)

Use `Skill` tool to invoke.

#### Codex

Use via CLI:
```bash
~/.codex/superpowers/.codex/superpowers-codex use-skill my-custom-skill
```

#### OpenCode

Skills discovered from:
1. `.opencode/skills/` (project - highest priority)
2. `~/.config/opencode/skills/` (personal)
3. Plugin's `skills/` directory (superpowers - fallback)

Use `use_skill` custom tool.

## Custom Agents

Agents are markdown files with YAML frontmatter that define specialized personas.

### Agent File Structure

```
~/.supremepower/agents/
├── blockchain-specialist.md
├── flutter-expert.md
└── data-scientist.md
```

### Creating a Custom Agent

**Step 1: Create agent file**

```bash
mkdir -p ~/.supremepower/agents
cd ~/.supremepower/agents
```

**Step 2: Create agent definition**

```markdown
---
name: blockchain-specialist
expertise:
  - Solidity smart contract development
  - Ethereum and EVM-compatible chains
  - Web3.js and ethers.js integration
  - Gas optimization techniques
  - Smart contract security auditing
  - DeFi protocol design
activation_keywords:
  - blockchain
  - solidity
  - ethereum
  - smart contract
  - web3
  - DeFi
  - NFT
  - ERC20
  - ERC721
complexity_threshold: medium
---

# Blockchain Specialist

You are an expert blockchain developer specializing in Ethereum and EVM-compatible smart contract development.

## Expertise

**Smart Contract Development:**
- Solidity best practices and design patterns
- Gas optimization strategies
- Security auditing and vulnerability assessment
- Upgradeable contract architectures (proxy patterns)
- Testing frameworks (Hardhat, Truffle, Foundry)

**DeFi Protocols:**
- Automated Market Makers (AMMs)
- Lending and borrowing protocols
- Yield farming and staking mechanisms
- Oracle integration (Chainlink, Band Protocol)

**Web3 Integration:**
- Frontend integration with Web3.js / ethers.js
- Wallet connection (MetaMask, WalletConnect)
- Event listening and transaction management
- IPFS for decentralized storage

## Working Principles

1. **Security First**
   - Always consider reentrancy attacks
   - Validate all inputs rigorously
   - Use checks-effects-interactions pattern
   - Implement access control properly

2. **Gas Efficiency**
   - Minimize storage operations
   - Use events for data that doesn't need on-chain storage
   - Batch operations when possible
   - Choose efficient data structures

3. **Testing Rigor**
   - Unit tests for all functions
   - Integration tests for contract interactions
   - Fuzz testing for edge cases
   - Mainnet fork testing before deployment

4. **Documentation Standards**
   - NatSpec comments for all public functions
   - Document security assumptions
   - Explain complex logic with inline comments
   - Maintain deployment and upgrade documentation

## Integration with Skills

This agent works best with:

- **test-driven-development** - Write security-focused tests first
- **systematic-debugging** - Debug transaction failures and gas issues
- **requesting-code-review** - Security audit before deployment
- **brainstorming** - Design DeFi protocol architecture

## Response Format

When activated:

1. **Assess the request** - Security implications, gas considerations
2. **Provide Solidity code** - With security comments
3. **Explain trade-offs** - Security vs gas vs complexity
4. **Recommend testing** - Specific test cases for this code
5. **Security warnings** - Potential vulnerabilities to watch

## Example Activation

**User Query:** "Help me implement an ERC20 token with staking rewards"

**Response Structure:**
1. Outline staking mechanism (time-weighted rewards, withdrawal penalties)
2. Provide Solidity implementation with security comments
3. Explain reentrancy protection for withdraw()
4. Recommend Hardhat test cases
5. Warn about precision loss in reward calculation
6. Suggest oracle for APY calculation if needed
```

### Agent Frontmatter Requirements

```yaml
---
name: agent-name                    # REQUIRED: Lowercase, hyphens
expertise:                          # REQUIRED: List of expertise areas
  - Expertise area 1
  - Expertise area 2
activation_keywords:                # REQUIRED: Keywords for auto-activation
  - keyword1
  - keyword2
complexity_threshold: medium        # REQUIRED: low|medium|high
---
```

**Field Descriptions:**

- **name**: Unique identifier (lowercase, hyphens only)
- **expertise**: List of specific knowledge areas (3-10 items)
- **activation_keywords**: Keywords that trigger this agent (5-15 keywords)
- **complexity_threshold**: How complex a query must be to activate this agent
  - `low`: Activates for simple questions
  - `medium`: Activates for moderate complexity
  - `high`: Only activates for complex architectural questions

### Agent Activation Scoring

The orchestration engine scores agents based on keyword matches:

```
Score = (number of matching keywords in user message)

If score >= activation_threshold:
  Activate agent
```

Default thresholds:
- `low`: 1 match
- `medium`: 2 matches
- `high`: 3 matches

### Platform-Specific Agent Loading

#### Gemini CLI

Custom agents loaded from:
- `~/.supremepower/agents/` (configured in config.json)

Verify with:
```bash
/sp:agents
# Shows built-in + custom agents
```

#### Claude Code

Agents implicit in skill content. Custom agents via:
1. Add YAML frontmatter to custom skill
2. Reference agent in conditional blocks
3. Skill content itself acts as agent persona

#### Codex

Agents selected manually through skill choice. No automatic activation.

#### OpenCode

Custom agents loaded from:
- `~/.config/opencode/superpowers/agents/`

## Testing Your Extensions

### Test Custom Skills

**Manual Testing:**

1. **Gemini CLI:**
   ```bash
   /skills:my-custom-skill
   ```

2. **Claude Code:**
   ```
   Use the Skill tool with my-custom-skill
   ```

3. **Codex:**
   ```bash
   ~/.codex/superpowers/.codex/superpowers-codex use-skill my-custom-skill
   ```

4. **OpenCode:**
   ```
   Use use_skill tool with my-custom-skill
   ```

**Validation Checklist:**

- [ ] YAML frontmatter is valid (test with `cat skill/SKILL.md | head -10`)
- [ ] Name uses only lowercase and hyphens
- [ ] Description starts with "Use when"
- [ ] Conditional blocks have correct syntax
- [ ] Skill provides clear step-by-step guidance
- [ ] Examples are concrete and helpful
- [ ] Referenced agents exist

### Test Custom Agents

**Verify Agent Loaded:**

```bash
# Gemini CLI
/sp:agents | grep my-agent-name

# Check activation
/sp:analyze "message with my agent keywords"
```

**Validation Checklist:**

- [ ] YAML frontmatter is valid
- [ ] All required fields present (name, expertise, activation_keywords, complexity_threshold)
- [ ] Keywords are specific and relevant
- [ ] Agent persona is detailed and actionable
- [ ] Working principles are clear
- [ ] Integration with skills is documented

## Sharing Extensions

### Share Via Git Repository

**Step 1: Create repository**

```bash
cd ~/.supremepower
git init
git add skills/ agents/
git commit -m "My SupremePower extensions"
git remote add origin https://github.com/yourname/supremepower-extensions
git push -u origin main
```

**Step 2: Document your extensions**

Create `README.md`:

```markdown
# My SupremePower Extensions

Custom skills and agents for [domain].

## Skills

- **skill-name** - Use when [trigger]

## Agents

- **agent-name** - Expert in [domain]

## Installation

### Gemini CLI
\`\`\`bash
/skills:fetch-skills https://github.com/yourname/supremepower-extensions
\`\`\`

### Other Platforms
\`\`\`bash
git clone https://github.com/yourname/supremepower-extensions

# Symlink skills
ln -s ~/supremepower-extensions/skills ~/.supremepower/skills/

# Symlink agents
ln -s ~/supremepower-extensions/agents ~/.supremepower/agents/
\`\`\`
```

### Publish to npm (Optional)

For advanced users, publish as npm package:

```json
{
  "name": "@yourname/supremepower-extensions",
  "version": "1.0.0",
  "description": "SupremePower extensions for [domain]",
  "files": ["skills/", "agents/"],
  "keywords": ["supremepower", "skills", "agents"]
}
```

### Contribute to Main Repository

Submit pull request to add your extensions to the main SupremePower repository:

1. Fork https://github.com/abudhahir/superpowers
2. Add your skills/agents to appropriate directories
3. Update documentation
4. Submit PR with clear description

## Best Practices

### Skill Design

**DO:**
- ✅ Focus on workflows, not just information
- ✅ Break complex tasks into clear steps
- ✅ Provide concrete examples
- ✅ Include conditional agent activation
- ✅ Link to related skills
- ✅ Test with real use cases

**DON'T:**
- ❌ Create skills that are just information dumps
- ❌ Make skills too generic (e.g., "programming skill")
- ❌ Forget to test YAML frontmatter syntax
- ❌ Use special characters in skill names
- ❌ Exceed 500 characters in description

### Agent Design

**DO:**
- ✅ Define specific expertise areas
- ✅ Use precise activation keywords
- ✅ Provide concrete working principles
- ✅ Include example response structure
- ✅ Document integration with skills
- ✅ Test activation with various queries

**DON'T:**
- ❌ Create overly broad agents (e.g., "programming expert")
- ❌ Use generic keywords (e.g., "code", "help")
- ❌ Forget to set appropriate complexity threshold
- ❌ Duplicate existing agent capabilities
- ❌ Omit required frontmatter fields

### Naming Conventions

**Skills:**
- `domain-action` pattern (e.g., `react-optimization`, `sql-migration`)
- Descriptive and specific
- 2-4 words maximum

**Agents:**
- `domain-role` pattern (e.g., `blockchain-specialist`, `flutter-expert`)
- Reflects expertise area
- 2-3 words maximum

### Documentation Standards

**Required Documentation:**
- Overview/purpose
- When to use
- Step-by-step workflow
- Examples (minimum 1, preferably 2-3)
- Related skills/agents
- Platform-specific notes (if any)

**Optional but Recommended:**
- Troubleshooting section
- Advanced usage tips
- Integration patterns
- FAQs

## Examples Repository

See [github.com/abudhahir/supremepower-extensions](https://github.com/abudhahir/supremepower-extensions) for community-contributed examples:

- **Domain-Specific Skills:**
  - `kubernetes-deployment` - K8s deployment workflows
  - `graphql-schema-design` - GraphQL API design
  - `machine-learning-pipeline` - ML pipeline creation

- **Specialized Agents:**
  - `rust-systems-engineer` - Rust systems programming
  - `data-scientist` - ML and data analysis
  - `ios-developer` - SwiftUI and iOS patterns

## Getting Help

- **Documentation**: [Main README](../README.md)
- **Platform Guides**: [docs/platforms/](platforms/)
- **GitHub Discussions**: [Ask questions](https://github.com/abudhahir/superpowers/discussions)
- **GitHub Issues**: [Report bugs](https://github.com/abudhahir/superpowers/issues)

---

**Ready to create your first custom skill or agent? Start with the templates above and test on your preferred platform!**
