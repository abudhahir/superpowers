#!/usr/bin/env bash
set -euo pipefail

echo "=== SupremePower Extension Installation ==="
echo

# Create user directory
SUPREMEPOWER_DIR="$HOME/.supremepower"
echo "Creating SupremePower directory: $SUPREMEPOWER_DIR"
mkdir -p "$SUPREMEPOWER_DIR"/{skills,agents,logs}

# Copy default config if doesn't exist
if [ ! -f "$SUPREMEPOWER_DIR/config.json" ]; then
  echo "Creating default configuration..."
  cat > "$SUPREMEPOWER_DIR/config.json" <<'EOF'
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
EOF
fi

# Ask about wrapper script installation
echo
echo "Would you like to install the gemini-sp wrapper script for automatic agent activation?"
read -p "(y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  INSTALL_PATH="$HOME/.local/bin"
  mkdir -p "$INSTALL_PATH"

  EXTENSION_PATH="$(pwd)"
  ln -sf "$EXTENSION_PATH/scripts/gemini-sp" "$INSTALL_PATH/gemini-sp"

  echo "Wrapper script installed to: $INSTALL_PATH/gemini-sp"
  echo
  echo "Make sure $INSTALL_PATH is in your PATH:"
  echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
fi

echo
echo "=== Installation Complete ==="
echo
echo "Next steps:"
echo "  1. Restart Gemini CLI to load the extension"
echo "  2. Try: /brainstorm 'test the extension'"
echo "  3. Try: /sp:agents (list available agents)"
echo "  4. Try: gemini-sp 'help me build a React app' (if wrapper installed)"
echo
echo "Documentation: https://github.com/superclaude-org/supremepower-gemini"
