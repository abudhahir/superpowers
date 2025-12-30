# Installation Guide

Complete guide to installing SupremePower for Gemini CLI.

## Prerequisites

Before installing SupremePower, ensure you have:

1. **Gemini CLI** - Version 1.0.0 or later
   ```bash
   gemini --version
   ```

2. **Git** - For GitHub-based installation
   ```bash
   git --version
   ```

3. **Node.js 18+** - Typically included with Gemini CLI
   ```bash
   node --version
   ```

## Installation Methods

### Method 1: Install from GitHub (Recommended)

Install the latest version directly from GitHub:

```bash
gemini extensions install https://github.com/superclaude-org/supremepower-gemini
```

The installation process will:
1. Clone the repository
2. Install npm dependencies
3. Build the TypeScript code
4. Run post-install setup script
5. Register the MCP server

### Method 2: Install Specific Version

To install a specific version or branch:

```bash
# Install specific version tag
gemini extensions install https://github.com/superclaude-org/supremepower-gemini --ref=v2.0.0

# Install from specific branch
gemini extensions install https://github.com/superclaude-org/supremepower-gemini --ref=main
```

### Method 3: Local Development Installation

For development or testing:

```bash
# Clone repository
git clone https://github.com/superclaude-org/supremepower-gemini.git
cd supremepower-gemini

# Install dependencies
npm install

# Build project
npm run build

# Link as local extension
gemini extensions link .
```

## Post-Installation Setup

After installation, the post-install script automatically:

### 1. Creates Directory Structure

```
~/.supremepower/
├── config.json          # Configuration file
├── skills/             # Custom skills directory
├── agents/             # Custom agents directory
└── logs/               # Log files
```

### 2. Initializes Configuration

Default configuration is created at `~/.supremepower/config.json`:

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

### 3. Offers Wrapper Script Installation

The script will prompt:

```
Would you like to install the gemini-sp wrapper script? (y/n)
```

If you choose 'y', it will:
- Copy `scripts/gemini-sp` to a directory in your PATH
- Make it executable
- Allow automatic agent orchestration

Suggested installation locations:
- `~/.local/bin/gemini-sp` (Linux/macOS, user-specific)
- `/usr/local/bin/gemini-sp` (system-wide, requires sudo)

## Verify Installation

### 1. Check Extension Status

```bash
gemini extensions list
```

You should see:
```
supremepower (v2.0.0) - Active
  Universal skills and agent framework for coding agents
```

### 2. Test Slash Commands

Start Gemini CLI and try:

```bash
gemini
```

Then in Gemini CLI:
```
/sp:agents
```

Expected output:
```
Available Agents:
- frontend-architect: Frontend architecture and React/Vue/Angular expertise
- backend-architect: Backend systems, APIs, and microservices
- system-architect: Distributed systems and architecture decisions
- javascript-expert: Modern JavaScript/TypeScript expertise
- python-expert: Python development and frameworks
- database-specialist: Database design and optimization
- testing-specialist: Testing strategies and frameworks
- performance-engineer: Performance optimization and profiling
- security-engineer: Security analysis and best practices
- devops-engineer: CI/CD, containerization, deployment
- api-specialist: API design and integration
- code-reviewer: Code quality and best practices
- technical-writer: Documentation and technical writing
```

### 3. Test Skill Invocation

```bash
/sp:status
```

Expected output:
```
SupremePower Status:
- Version: 2.0.0
- Skills loaded: 14
- Agents loaded: 13
- Config path: ~/.supremepower/config.json
- MCP server: Active
```

### 4. Test Wrapper Script (if installed)

```bash
gemini-sp --help
```

Or try a test query:
```bash
gemini-sp "What is the best way to structure a React component?"
```

## Configuration Options

After installation, you can customize behavior by editing `~/.supremepower/config.json` or using:

```bash
/sp:config
```

See [Configuration Reference](configuration.md) for all available options.

## Updating SupremePower

### Update to Latest Version

```bash
gemini extensions update supremepower
```

This will:
1. Pull latest changes from GitHub
2. Reinstall dependencies if needed
3. Rebuild TypeScript
4. Preserve your custom configuration

### Update to Specific Version

```bash
gemini extensions uninstall supremepower
gemini extensions install https://github.com/superclaude-org/supremepower-gemini --ref=v2.1.0
```

Note: Your configuration in `~/.supremepower/` is preserved during updates.

## Uninstalling

### Remove Extension Only

```bash
gemini extensions uninstall supremepower
```

This removes the extension but preserves your data in `~/.supremepower/`.

### Complete Removal

To remove everything including user data:

```bash
# Uninstall extension
gemini extensions uninstall supremepower

# Remove user data
rm -rf ~/.supremepower

# Remove wrapper script (if installed)
rm ~/.local/bin/gemini-sp
# or
sudo rm /usr/local/bin/gemini-sp
```

## Troubleshooting Installation

### Extension Won't Install

**Problem:** `gemini extensions install` fails with error

**Solutions:**
1. Check Gemini CLI version: `gemini --version` (requires 1.0.0+)
2. Check internet connection
3. Verify Git is installed: `git --version`
4. Try manual clone and link:
   ```bash
   git clone https://github.com/superclaude-org/supremepower-gemini.git
   cd supremepower-gemini
   npm install
   npm run build
   gemini extensions link .
   ```

### Build Fails During Installation

**Problem:** TypeScript compilation errors during `npm run build`

**Solutions:**
1. Ensure Node.js version is 18 or higher: `node --version`
2. Clear npm cache: `npm cache clean --force`
3. Remove node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

### MCP Server Not Starting

**Problem:** Extension installed but commands not working

**Solutions:**
1. Check Gemini CLI logs for MCP server errors
2. Verify gemini-extension.json exists in extension directory
3. Check that dist/server.js was built:
   ```bash
   ls -la ~/.gemini/extensions/supremepower/mcp-server/dist/
   ```
4. Manually test MCP server:
   ```bash
   cd ~/.gemini/extensions/supremepower
   node mcp-server/dist/server.js
   ```

### Permission Errors

**Problem:** Cannot create `~/.supremepower/` or install wrapper

**Solutions:**
1. Check home directory permissions:
   ```bash
   ls -ld ~
   ```
2. For wrapper script, use user-local directory:
   ```bash
   mkdir -p ~/.local/bin
   cp scripts/gemini-sp ~/.local/bin/
   chmod +x ~/.local/bin/gemini-sp
   export PATH="$HOME/.local/bin:$PATH"
   ```

### Configuration Not Loading

**Problem:** Changes to config.json not taking effect

**Solutions:**
1. Verify JSON syntax:
   ```bash
   cat ~/.supremepower/config.json | jq .
   ```
2. Check file permissions:
   ```bash
   ls -l ~/.supremepower/config.json
   ```
3. Restart Gemini CLI to reload configuration
4. Use `/sp:config` to verify current settings

## Platform-Specific Notes

### macOS

- Default install locations work out of the box
- For wrapper script, `~/.local/bin` recommended
- May need to add to PATH in `~/.zshrc`:
  ```bash
  export PATH="$HOME/.local/bin:$PATH"
  ```

### Linux

- Same as macOS
- If using system-wide install, requires sudo:
  ```bash
  sudo cp scripts/gemini-sp /usr/local/bin/
  sudo chmod +x /usr/local/bin/gemini-sp
  ```

### Windows (WSL)

- Install via WSL Ubuntu/Debian terminal
- Use Linux installation instructions
- Wrapper script works in WSL environment only

### Windows (Native)

- Gemini CLI Windows support may vary
- Check Gemini CLI documentation for Windows compatibility
- PowerShell alternative to bash wrapper may be needed

## Next Steps

After successful installation:

1. Read the [Usage Guide](usage.md) to learn all available commands
2. Review [Configuration Reference](configuration.md) to customize behavior
3. Try example workflows in the [Usage Guide](usage.md)
4. Create custom skills and agents as needed

## Getting Help

If you encounter issues not covered here:

1. Check [Troubleshooting Guide](troubleshooting.md)
2. Search [GitHub Issues](https://github.com/superclaude-org/supremepower-gemini/issues)
3. Open a new issue with:
   - Operating system and version
   - Node.js version (`node --version`)
   - Gemini CLI version (`gemini --version`)
   - Full error message
   - Steps to reproduce
