# End-to-End Tests for Gemini CLI Integration

This directory contains end-to-end tests that validate the complete user workflow with Gemini CLI and the SupremePower extension.

## Overview

E2E tests verify:
- Slash command invocation (`/brainstorm`, `/write-plan`, `/execute-plan`)
- Wrapper script execution (`gemini-sp`)
- MCP tool invocation via Gemini CLI
- Extension configuration and loading
- Error handling and performance

## Prerequisites

These tests require a complete Gemini CLI environment:

1. **Gemini CLI installed**
   ```bash
   npm install -g @google/generative-ai-cli
   ```

2. **SupremePower extension installed**
   ```bash
   cd /path/to/supremepower
   gemini extension install .
   ```

3. **Extension configured**
   - Ensure `~/.gemini/config.json` includes SupremePower
   - Verify MCP server is properly configured

4. **Environment setup**
   - Gemini CLI available in PATH
   - Extension loaded and active
   - API credentials configured

## Running E2E Tests

### Skip by Default

E2E tests are **skipped by default** using `it.skip()` because they require the full Gemini CLI environment. This prevents integration tests from failing in environments where Gemini CLI is not installed.

### Running in CI

To run E2E tests in a CI environment:

1. **Install dependencies:**
   ```bash
   npm install -g @google/generative-ai-cli
   gemini extension install .
   ```

2. **Configure environment:**
   ```bash
   export GEMINI_API_KEY="your-api-key"
   ```

3. **Remove skip:**
   - Edit `tests/e2e/gemini-cli.test.js`
   - Change `it.skip` to `it` for tests you want to run

4. **Run tests:**
   ```bash
   npm test tests/e2e/
   ```

### Running Locally

To run E2E tests on your local machine:

1. **Ensure Gemini CLI is installed:**
   ```bash
   gemini --version
   ```

2. **Verify extension is loaded:**
   ```bash
   gemini extension list
   # Should show: supremepower
   ```

3. **Remove skip from specific tests:**
   ```javascript
   // Change from:
   it.skip('should invoke brainstorming skill', async () => {

   // To:
   it('should invoke brainstorming skill', async () => {
   ```

4. **Run E2E tests:**
   ```bash
   npm test tests/e2e/
   ```

## Test Structure

### Slash Command Tests
- Validate `/brainstorm`, `/write-plan`, `/execute-plan` commands
- Verify skill content is properly injected
- Test command argument parsing

### Wrapper Script Tests
- Test `gemini-sp` wrapper script
- Verify agent activation workflow
- Validate persona injection

### MCP Tool Tests
- Direct tool invocation via Gemini CLI
- Test all 5 MCP tools
- Verify tool responses

### Configuration Tests
- Validate extension configuration loading
- Test custom agents/skills paths
- Verify config file structure

### Error Handling Tests
- Missing Gemini CLI
- Extension not loaded
- Invalid commands
- MCP server failures

### Performance Tests
- Agent activation timing
- Concurrent request handling
- Response time validation

## Test Timeouts

E2E tests have extended timeouts (30 seconds) to account for:
- Gemini CLI startup time
- API request latency
- MCP server initialization
- Extension loading

## Debugging Failed Tests

If E2E tests fail:

1. **Check Gemini CLI installation:**
   ```bash
   which gemini
   gemini --version
   ```

2. **Verify extension is loaded:**
   ```bash
   gemini extension list
   gemini extension status supremepower
   ```

3. **Check MCP server logs:**
   ```bash
   # Logs location depends on Gemini CLI configuration
   tail -f ~/.gemini/logs/supremepower.log
   ```

4. **Test MCP server directly:**
   ```bash
   node mcp-server/dist/server.js
   ```

5. **Validate configuration:**
   ```bash
   cat ~/.gemini/config.json
   ```

## Integration vs E2E Tests

**Integration Tests** (`tests/integration/`):
- Run by default with `npm test`
- Test compiled TypeScript output
- No external dependencies
- Fast execution (< 5 seconds)

**E2E Tests** (`tests/e2e/`):
- Skipped by default
- Require full Gemini CLI environment
- Test complete user workflow
- Slower execution (30+ seconds)

## CI Configuration Example

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Install Gemini CLI
        run: npm install -g @google/generative-ai-cli

      - name: Build extension
        run: npm run build

      - name: Install extension
        run: gemini extension install .

      - name: Configure Gemini CLI
        run: |
          mkdir -p ~/.gemini
          echo '{"extensions": ["supremepower"]}' > ~/.gemini/config.json
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}

      - name: Enable E2E tests
        run: |
          # Remove .skip from test cases
          sed -i 's/it\.skip/it/g' tests/e2e/gemini-cli.test.js

      - name: Run E2E tests
        run: npm test tests/e2e/
```

## Adding New E2E Tests

When adding new E2E tests:

1. **Use `it.skip` by default:**
   ```javascript
   it.skip('should test new feature', async () => {
     // Test implementation
   }, 30000);
   ```

2. **Add appropriate timeout:**
   - Default Jest timeout: 5 seconds
   - E2E tests: 30 seconds
   - Long-running tests: 60 seconds

3. **Include cleanup:**
   ```javascript
   afterEach(async () => {
     // Clean up temporary files
     await fs.rm(tempDir, { recursive: true, force: true });
   });
   ```

4. **Document prerequisites:**
   - Required environment setup
   - Expected Gemini CLI version
   - Configuration requirements

5. **Add to appropriate test suite:**
   - Slash commands: "Slash Command Integration"
   - Wrapper script: "Wrapper Script Integration"
   - MCP tools: "MCP Tool Invocation via Gemini CLI"
   - Configuration: "Extension Configuration"
   - Errors: "Error Handling"
   - Performance: "Performance"

## Future Improvements

Potential enhancements for E2E testing:

1. **Automated skip removal:**
   - Script to enable/disable E2E tests
   - Environment variable to control skipping

2. **Mock Gemini CLI:**
   - Simulate Gemini CLI without full installation
   - Faster E2E test execution

3. **Test fixtures:**
   - Pre-configured Gemini CLI environments
   - Sample projects for testing

4. **Visual regression:**
   - Test CLI output formatting
   - Verify persona display

5. **Load testing:**
   - Test with large agent sets
   - Validate performance at scale

## Support

For issues with E2E tests:
- Check [GitHub Issues](https://github.com/obra/supremepower/issues)
- Review [Gemini CLI documentation](https://github.com/google/generative-ai-cli)
- Contact maintainers
