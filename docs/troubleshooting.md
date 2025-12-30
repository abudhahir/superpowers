# Troubleshooting Guide

Solutions to common issues with SupremePower for Gemini CLI.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Extension Not Loading](#extension-not-loading)
- [Commands Not Working](#commands-not-working)
- [Agents Not Activating](#agents-not-activating)
- [Wrapper Script Issues](#wrapper-script-issues)
- [Configuration Problems](#configuration-problems)
- [Performance Issues](#performance-issues)
- [Logging and Debugging](#logging-and-debugging)
- [Common Error Messages](#common-error-messages)
- [Getting Help](#getting-help)

## Installation Issues

### Extension Won't Install

**Symptom:** `gemini extensions install` fails with error

**Common causes:**
1. Gemini CLI version too old
2. Network connectivity issues
3. Git not installed
4. Permissions problems

**Solutions:**

**Check Gemini CLI version:**
```bash
gemini --version
```
Requires version 1.0.0 or later. Update if older:
```bash
# Check for updates
gemini update
```

**Check Git installation:**
```bash
git --version
```
If not installed:
```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt install git
```

**Check network connectivity:**
```bash
curl -I https://github.com
```

**Try manual installation:**
```bash
git clone https://github.com/superclaude-org/supremepower-gemini.git
cd supremepower-gemini
npm install
npm run build
gemini extensions link .
```

---

### Build Fails During Installation

**Symptom:** TypeScript compilation errors during `npm run build`

**Error messages:**
```
error TS2307: Cannot find module '@modelcontextprotocol/sdk'
error TS2304: Cannot find name 'structuredClone'
```

**Solutions:**

**Check Node.js version:**
```bash
node --version
```
Requires Node.js 18+. Update if older:
```bash
# Using nvm
nvm install 18
nvm use 18

# Or download from nodejs.org
```

**Clear npm cache and reinstall:**
```bash
cd ~/.gemini/extensions/supremepower
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run build
```

**Check for conflicting global packages:**
```bash
npm list -g --depth=0
```
Uninstall conflicting TypeScript versions:
```bash
npm uninstall -g typescript
```

---

### Post-Install Script Fails

**Symptom:** Installation succeeds but post-install script errors

**Error messages:**
```
Error: EACCES: permission denied, mkdir '~/.supremepower'
Error: Cannot create config directory
```

**Solutions:**

**Check home directory permissions:**
```bash
ls -ld ~
```

**Create directory manually:**
```bash
mkdir -p ~/.supremepower
chmod 755 ~/.supremepower
```

**Run post-install manually:**
```bash
cd ~/.gemini/extensions/supremepower
bash scripts/install.sh
```

---

## Extension Not Loading

### Extension Installed But Not Active

**Symptom:** `gemini extensions list` shows extension but it's inactive

**Check extension status:**
```bash
gemini extensions list
```

**Output indicates:**
```
supremepower (v2.0.0) - Inactive
```

**Solutions:**

**Enable extension:**
```bash
gemini extensions enable supremepower
```

**Check for errors in extension manifest:**
```bash
cat ~/.gemini/extensions/supremepower/gemini-extension.json | jq .
```

**Verify MCP server exists:**
```bash
ls -la ~/.gemini/extensions/supremepower/mcp-server/dist/server.js
```

If missing, rebuild:
```bash
cd ~/.gemini/extensions/supremepower
npm run build
```

**Restart Gemini CLI:**
```bash
# Exit completely and restart
gemini
```

---

### MCP Server Not Starting

**Symptom:** Extension active but slash commands not working

**Check MCP server logs:**
Gemini CLI should show MCP server startup in debug mode:
```bash
gemini --debug
```

Look for:
```
[MCP] Starting server: supremepower
[MCP] Server started successfully
```

**Test MCP server manually:**
```bash
cd ~/.gemini/extensions/supremepower
node mcp-server/dist/server.js
```

**Common errors:**

**"Cannot find module":**
```bash
cd ~/.gemini/extensions/supremepower
npm install
```

**"Unexpected token":**
TypeScript not compiled. Run:
```bash
npm run build
```

**Port already in use:**
Check for duplicate instances:
```bash
ps aux | grep "mcp-server"
kill <pid>
```

---

## Commands Not Working

### Slash Commands Not Recognized

**Symptom:** `/sp:agents` or other commands show "Unknown command"

**Verification steps:**

**1. Check extension is active:**
```bash
gemini extensions list
```
Should show "Active"

**2. Check MCP server is running:**
In Gemini CLI, check for errors in output

**3. Verify commands exist:**
```bash
ls ~/.gemini/extensions/supremepower/commands/sp/
```
Should list: `agents.toml`, `analyze.toml`, `config.toml`, etc.

**Solutions:**

**Reload extension:**
```bash
gemini extensions disable supremepower
gemini extensions enable supremepower
```

**Restart Gemini CLI completely**

**Check command format:**
Commands have specific namespace:
- `/sp:agents` (correct)
- `/agents` (incorrect - wrong namespace)
- `/sp agents` (incorrect - missing colon)

---

### Skill Commands Not Working

**Symptom:** `/brainstorm`, `/tdd`, etc. not recognized

**Check:**

**1. Skills directory exists:**
```bash
ls ~/.gemini/extensions/supremepower/core/skills/
```

**2. Config exposureMode:**
```bash
/sp:config skills.exposureMode
```

If set to `"prompts"`, skills are not exposed as commands. Change to `"commands"`:
```bash
/sp:config skills.exposureMode "commands"
```

**3. Command files generated:**
```bash
ls ~/.gemini/extensions/supremepower/commands/skills/
```

If empty, regenerate:
```bash
cd ~/.gemini/extensions/supremepower
npm run generate:commands
```

---

## Agents Not Activating

### No Agents Activate Automatically

**Symptom:** Using `gemini-sp` but no agents are activated

**Diagnostic steps:**

**1. Check wrapper is enabled:**
```bash
/sp:config wrapper.enabled
```

**2. Test agent analysis:**
```bash
/sp:analyze "I need help with React performance optimization"
```

Should show:
```
Complexity Score: 12
Activated Agents:
- frontend-architect
- performance-engineer
```

**3. Check activation threshold:**
```bash
/sp:config orchestration.agentActivationThreshold
```

**Common causes:**

**Threshold too high:**
Your message doesn't meet complexity threshold. Lower it:
```bash
/sp:config orchestration.agentActivationThreshold 6
```

**requireKeywords enabled but no keywords:**
```bash
/sp:config wrapper.complexity.requireKeywords false
```

**Wrapper disabled:**
```bash
/sp:config wrapper.enabled true
```

**Example with debugging:**
```bash
# Enable verbose logging
/sp:config display.verbose true

# Try query again
gemini-sp "help with React"

# Check logs
tail -f ~/.supremepower/logs/orchestration.log
```

---

### Wrong Agents Activate

**Symptom:** Agents activate but not the expected ones

**Example:**
Query about Python, but JavaScript Expert activates

**Causes:**

**1. Ambiguous keywords:**
Query: "I want to use async functions in my script"
- Could be JavaScript (`async/await`) or Python (`asyncio`)

**2. Detection sensitivity too high:**
```bash
/sp:config orchestration.detectionSensitivity "low"
```

**3. Agent keyword overlap:**
Check which agents match:
```bash
/sp:analyze "your query here"
```

**Solutions:**

**Use explicit agent forcing:**
```bash
/sp:with python-expert "help with async functions"
```

**Adjust detection sensitivity:**
- `"low"`: Exact matches only
- `"medium"`: Matches + synonyms
- `"high"`: Broad matching

**Create custom agent with specific keywords:**
```bash
/sp:auto-agent-create
# Define precise keywords for your use case
```

---

### Too Many Agents Activate

**Symptom:** 4-5 agents activate on simple queries

**Cause:** maxAgentsPerRequest too high or threshold too low

**Solutions:**

**Limit max agents:**
```bash
/sp:config orchestration.maxAgentsPerRequest 2
```

**Raise threshold:**
```bash
/sp:config orchestration.agentActivationThreshold 10
```

**Increase word count requirement:**
```bash
/sp:config wrapper.complexity.minWordCount 70
```

---

## Wrapper Script Issues

### `gemini-sp` Command Not Found

**Symptom:** `bash: gemini-sp: command not found`

**Causes:**
1. Wrapper script not installed
2. Not in PATH
3. Not executable

**Solutions:**

**Check if wrapper exists:**
```bash
ls -la ~/.local/bin/gemini-sp
# or
ls -la /usr/local/bin/gemini-sp
```

**Install wrapper:**
```bash
cd ~/.gemini/extensions/supremepower
cp scripts/gemini-sp ~/.local/bin/
chmod +x ~/.local/bin/gemini-sp
```

**Add to PATH (if using ~/.local/bin):**
```bash
# Add to ~/.bashrc or ~/.zshrc
export PATH="$HOME/.local/bin:$PATH"

# Reload shell
source ~/.bashrc  # or source ~/.zshrc
```

**Verify:**
```bash
which gemini-sp
```

---

### Wrapper Script Errors

**Symptom:** `gemini-sp` runs but shows errors

**Error: "node: command not found":**
Node.js not in PATH. Add to shell config:
```bash
export PATH="/usr/local/bin:$PATH"
```

**Error: "Cannot find module './scripts/wrapper-lib.js'":**
Wrapper script running from wrong directory. Edit wrapper script to use absolute paths:
```bash
nano ~/.local/bin/gemini-sp
```

Change:
```bash
import { orchestrateAndEnhance } from './scripts/wrapper-lib.js';
```

To:
```bash
SCRIPT_DIR="$HOME/.gemini/extensions/supremepower"
import { orchestrateAndEnhance } from '$SCRIPT_DIR/scripts/wrapper-lib.js';
```

**Error: "orchestrateAndEnhance is not a function":**
wrapper-lib.js not built or corrupt. Rebuild:
```bash
cd ~/.gemini/extensions/supremepower
npm run build
```

---

### Wrapper Not Orchestrating

**Symptom:** `gemini-sp` works but behaves same as `gemini` (no agents)

**Check:**

**1. Wrapper enabled in config:**
```bash
/sp:config wrapper.enabled
```

**2. Test orchestration directly:**
```bash
cd ~/.gemini/extensions/supremepower
node --input-type=module -e "
import { orchestrateAndEnhance } from './scripts/wrapper-lib.js';
const result = await orchestrateAndEnhance('help me optimize React performance');
console.log(result);
"
```

**3. Check for fallback:**
Wrapper may be failing and falling back. Check stderr:
```bash
gemini-sp "query" 2>&1 | grep Warning
```

**Solutions:**

**Check wrapper-lib.js exists and is valid:**
```bash
ls -la ~/.gemini/extensions/supremepower/scripts/wrapper-lib.js
node --check ~/.gemini/extensions/supremepower/scripts/wrapper-lib.js
```

**Rebuild if needed:**
```bash
cd ~/.gemini/extensions/supremepower
npm run build
```

---

## Configuration Problems

### Configuration Not Loading

**Symptom:** Changes to config.json not taking effect

**Causes:**
1. JSON syntax error
2. File permissions
3. Environment variable override
4. Config not reloaded

**Solutions:**

**Validate JSON syntax:**
```bash
cat ~/.supremepower/config.json | jq .
```

If errors, use JSON validator to find issue:
```bash
jq . ~/.supremepower/config.json
```

**Check file permissions:**
```bash
ls -l ~/.supremepower/config.json
```
Should be readable (644 or 755):
```bash
chmod 644 ~/.supremepower/config.json
```

**Check for environment variable override:**
```bash
echo $SUPREMEPOWER_CONFIG_PATH
```
If set, it's overriding default location

**Force reload:**
Restart Gemini CLI completely

---

### Configuration Validation Errors

**Symptom:** Errors when loading config

**Example errors:**
```
Error: agentActivationThreshold must be a number
Error: exposureMode must be one of: commands, prompts, both
```

**Solutions:**

**Check value types:**
- Numbers should be unquoted: `"agentActivationThreshold": 8`
- Strings should be quoted: `"exposureMode": "commands"`
- Booleans should be unquoted: `"enabled": true`

**Use /sp:config for safe edits:**
```bash
/sp:config orchestration.agentActivationThreshold 8
```
This validates before saving

**Reset to defaults if corrupt:**
```bash
mv ~/.supremepower/config.json ~/.supremepower/config.json.backup
# Restart Gemini CLI to create new default
```

---

### Config Path Issues

**Symptom:** Config created in wrong location

**Check effective config path:**
```bash
/sp:status
```
Shows "Config path: /actual/path/config.json"

**Override if needed:**
```bash
export SUPREMEPOWER_CONFIG_PATH=~/my-project/.supremepower
```

Add to shell config for persistence:
```bash
echo 'export SUPREMEPOWER_CONFIG_PATH=~/my-project/.supremepower' >> ~/.bashrc
```

---

## Performance Issues

### Slow Response Times

**Symptom:** Commands take 5+ seconds to respond

**Causes:**
1. Too many agents activated
2. Full personas (high token count)
3. LLM fallback enabled
4. Verbose logging

**Solutions:**

**Reduce max agents:**
```bash
/sp:config orchestration.maxAgentsPerRequest 2
```

**Use minimal personas:**
```bash
/sp:config agents.personaDetail "minimal"
```

**Disable LLM fallback:**
```bash
/sp:config orchestration.fallbackToLLM false
```

**Disable verbose logging:**
```bash
/sp:config display.verbose false
```

**Optimize for performance:**
```json
{
  "orchestration": {
    "maxAgentsPerRequest": 2,
    "fallbackToLLM": false
  },
  "agents": {
    "personaDetail": "minimal"
  },
  "display": {
    "verbose": false
  }
}
```

---

### High Token Usage

**Symptom:** Hitting token limits or high costs

**Causes:**
1. Too many agents per request
2. Full agent personas
3. Skills in "prompts" mode auto-loading

**Solutions:**

**Minimize token usage:**
```bash
/sp:config orchestration.maxAgentsPerRequest 1
/sp:config agents.personaDetail "minimal"
/sp:config skills.exposureMode "commands"
/sp:config display.showActivatedAgents false
```

**Use explicit commands instead of wrapper:**
Use `gemini` with slash commands instead of `gemini-sp` for simple queries

**Monitor token usage:**
Enable logging to track per-request tokens:
```bash
/sp:config display.verbose true
tail -f ~/.supremepower/logs/supremepower.log | grep "tokens"
```

---

## Logging and Debugging

### Enable Debug Logging

**Temporary (current session):**
```bash
export SUPREMEPOWER_DEBUG=1
gemini-sp "query"
```

**Permanent (in config):**
```bash
/sp:config display.verbose true
```

---

### View Logs

**Main log:**
```bash
tail -f ~/.supremepower/logs/supremepower.log
```

**Orchestration decisions:**
```bash
tail -f ~/.supremepower/logs/orchestration.log
```

**Errors only:**
```bash
tail -f ~/.supremepower/logs/errors.log
```

**Search logs:**
```bash
grep "frontend-architect" ~/.supremepower/logs/orchestration.log
grep "Error" ~/.supremepower/logs/supremepower.log
```

---

### Debug Agent Matching

**Test specific query:**
```bash
/sp:analyze "your query here"
```

**Check agent definitions:**
```bash
cat ~/.gemini/extensions/supremepower/core/agents/frontend-architect.md
```

**List all agents and keywords:**
```bash
grep "Keywords:" ~/.gemini/extensions/supremepower/core/agents/*.md
```

---

## Common Error Messages

### "Extension 'supremepower' not found"

**Cause:** Extension not installed or path wrong

**Solution:**
```bash
gemini extensions list
# If not listed:
gemini extensions install https://github.com/superclaude-org/supremepower-gemini
```

---

### "Cannot find module '@modelcontextprotocol/sdk'"

**Cause:** npm dependencies not installed

**Solution:**
```bash
cd ~/.gemini/extensions/supremepower
npm install
```

---

### "config.json: Unexpected token at position X"

**Cause:** JSON syntax error (trailing comma, missing quote, etc.)

**Solution:**
```bash
jq . ~/.supremepower/config.json
# Shows exact error location
```

Fix the syntax error or reset to defaults

---

### "agentActivationThreshold must be a number"

**Cause:** Config value has wrong type

**Solution:**
```json
// Wrong:
"agentActivationThreshold": "8"

// Correct:
"agentActivationThreshold": 8
```

---

### "EACCES: permission denied"

**Cause:** File/directory permission issue

**Solution:**
```bash
# Fix directory permissions
chmod 755 ~/.supremepower

# Fix file permissions
chmod 644 ~/.supremepower/config.json
```

---

### "MCP server timeout"

**Cause:** MCP server taking too long to start

**Solutions:**

**Increase timeout in gemini-extension.json:**
```json
{
  "mcpServers": {
    "supremepower": {
      "timeout": 10000
    }
  }
}
```

**Check for blocking operations:**
```bash
node --inspect mcp-server/dist/server.js
```

---

## Platform-Specific Issues

### macOS: "Operation not permitted"

**Cause:** macOS security restrictions

**Solution:**
Grant Gemini CLI full disk access in System Preferences → Security & Privacy → Privacy → Full Disk Access

---

### Linux: "bash: /usr/local/bin/gemini-sp: Permission denied"

**Cause:** Script not executable

**Solution:**
```bash
sudo chmod +x /usr/local/bin/gemini-sp
```

---

### Windows (WSL): Path issues

**Cause:** Windows vs WSL path confusion

**Solution:**
Ensure all paths use WSL format:
```bash
# Wrong:
/mnt/c/Users/...

# Right:
~/.supremepower/...
```

---

## Getting Help

If issues persist after trying these solutions:

### 1. Gather Diagnostic Information

```bash
# System info
uname -a
node --version
gemini --version

# Extension status
gemini extensions list

# Config
cat ~/.supremepower/config.json

# Logs
tail -n 50 ~/.supremepower/logs/errors.log
```

### 2. Search Existing Issues

[GitHub Issues](https://github.com/superclaude-org/supremepower-gemini/issues)

### 3. Open New Issue

Include:
- Operating system and version
- Node.js version
- Gemini CLI version
- Complete error message
- Steps to reproduce
- Diagnostic information from step 1

### 4. Community Support

- GitHub Discussions
- Project documentation
- Example code in `examples/` directory

---

## Quick Diagnostic Checklist

Run through this checklist for most issues:

```bash
# 1. Extension installed and active?
gemini extensions list

# 2. Config valid?
cat ~/.supremepower/config.json | jq .

# 3. MCP server built?
ls -la ~/.gemini/extensions/supremepower/mcp-server/dist/server.js

# 4. Commands exist?
ls ~/.gemini/extensions/supremepower/commands/sp/

# 5. Wrapper installed?
which gemini-sp

# 6. Logs show errors?
tail -n 20 ~/.supremepower/logs/errors.log

# 7. Config loading?
/sp:status

# 8. Agents available?
/sp:agents
```

If all checks pass but issues remain, enable debug logging and examine behavior step by step.
