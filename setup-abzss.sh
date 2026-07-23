#!/usr/bin/env bash
set -e

echo "🔧 Montando estrutura do ABZSS..."

# --- bin/ (entry points do Oclif) ---
mkdir -p bin

# --- src/commands/ (obrigatório para o Oclif) ---
mkdir -p src/commands/apex
mkdir -p src/commands/docker
mkdir -p src/commands/git
mkdir -p src/commands/plugin
mkdir -p src/commands/workflow

# --- src/core/ ---
mkdir -p src/core/contracts
mkdir -p src/core/errors
mkdir -p src/core/events

# --- src/services/ ---
mkdir -p src/services/project-analysis
mkdir -p src/services/diagnostics
mkdir -p src/services/workflow

# --- src/integrations/ ---
mkdir -p src/integrations/vscode
mkdir -p src/integrations/git
mkdir -p src/integrations/docker
mkdir -p src/integrations/oracle
mkdir -p src/integrations/apex

# --- src/agents/ ---
mkdir -p src/agents/assistant
mkdir -p src/agents/clean
mkdir -p src/agents/provider

# --- src/cli/ui (camada de apresentação: chalk/ora) ---
mkdir -p src/cli/ui

# --- demais pastas de src/ ---
mkdir -p src/config
mkdir -p src/utils
mkdir -p src/types
mkdir -p src/prompts
mkdir -p src/templates

# --- tests/ ---
mkdir -p tests/unit
mkdir -p tests/integration

# --- docs/ ---
mkdir -p docs

# --- Arquivos .gitkeep para pastas vazias entrarem no Git ---
find src tests docs -type d -empty -exec touch {}/.gitkeep \;

echo "✅ Estrutura de pastas criada com sucesso."
echo ""
echo "Próximo passo: rodar 'npm init oclif' ou configurar package.json manualmente."
