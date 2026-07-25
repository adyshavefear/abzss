# ABZSS — Abyss System

> Uma plataforma de automação para desenvolvedores que transforma o terminal na sua central de comando.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

---

## O que é o ABZSS

ABZSS (lê-se *Abyss*) não é apenas mais uma CLI. É uma **plataforma modular de automação e assistência ao desenvolvedor**, construída para crescer ao longo de anos sem que seu núcleo precise ser reescrito.

A ideia central: o terminal já é onde desenvolvedores passam boa parte do dia — rodando comandos, gerenciando repositórios, subindo containers, escrevendo código. O ABZSS quer ser a camada inteligente que une automação do sistema operacional, integração com ferramentas de desenvolvimento e Inteligência Artificial em um único lugar, sem sair do terminal.

```bash
abz doctor              # diagnostica o ambiente
abz git review           # revisa o estado do repositório Git
abz open vscode           # abre o projeto (ou um caminho) no VS Code
abz docker status          # verifica se o Docker está instalado e rodando
abz ask "explique esse erro de SQL"    # (planejado)
abz clean                                # (planejado)
abz apex deploy                           # (planejado)
abz plugin install oracle-apex             # (planejado)
```

## Filosofia

Três princípios guiam toda decisão de arquitetura e código no ABZSS:

- **Automação inteligente** — tarefas repetitivas devem ser eliminadas, não documentadas.
- **Arquitetura modular** — nenhum módulo novo deve exigir alterar o núcleo existente.
- **Código limpo e escalável** — construído para ser mantido por uma equipe, não só por uma pessoa.

Nenhuma decisão é tomada pensando apenas no presente. Cada peça do sistema é implementada já prevendo integrações futuras.

## Para quem é

O ABZSS é pensado para desenvolvedores e equipes que:

- Trabalham fortemente pelo terminal e querem automatizar o ambiente de desenvolvimento.
- Usam múltiplas ferramentas no dia a dia (Git, Docker, VS Code, bancos Oracle, Oracle APEX) e querem orquestrá-las de um lugar só.
- Querem IA integrada ao fluxo de trabalho — não como um chat separado, mas como parte do próprio CLI.
- Valorizam arquitetura limpa e extensibilidade a longo prazo, em vez de scripts descartáveis.

## Agentes de IA (planejado)

O ABZSS terá dois agentes com responsabilidades bem separadas. Essa fase está pausada no momento — ver seção **Status atual**.

### Assistant Agent
Responsável por explicar código, tirar dúvidas, interpretar erros e ensinar tecnologias (SQL, PL/SQL, JavaScript, Node, Oracle APEX). **Nunca modifica arquivos** — é somente consultivo.

### Clean Agent
Responsável por refatoração, padronização, nomenclatura, organização e boas práticas (SOLID, Clean Code). **Pode modificar arquivos**, mas sempre mediante aprovação explícita do usuário antes de qualquer alteração.

## Arquitetura

O projeto segue Clean Architecture, com separação estrita de responsabilidades entre camadas:

```
abzss/
├── bin/                 # Entry points executáveis (Oclif)
├── src/
│   ├── commands/        # Comandos Oclif — apenas parsing, sem lógica de negócio
│   ├── core/             # Contratos (interfaces), erros customizados, event bus
│   ├── services/         # Regras de negócio — orquestram core + integrations
│   ├── integrations/     # Adapters externos (Git, Docker, Oracle, APEX, VS Code)
│   ├── agents/            # Assistant Agent, Clean Agent, abstração de provedor de IA
│   ├── cli/ui/            # Formatação de terminal (Chalk, Ora)
│   ├── hooks/              # Hooks Oclif (ex: banner ASCII ao rodar sem comando)
│   ├── plugins/           # Sistema de plugins carregáveis dinamicamente
│   ├── config/            # Configuração validada com Zod (global + por projeto)
│   ├── prompts/           # Templates de prompt para os agentes de IA
│   └── templates/         # Scaffolds de geração de código
├── test/
└── docs/
```

O princípio central: `services/` nunca depende diretamente de `integrations/` — depende de uma interface definida em `core/contracts/`. Trocar a forma como o ABZSS fala com o Docker, por exemplo, nunca deveria exigir tocar em mais de um arquivo. Cada integração segue o mesmo fluxo: **contrato → adapter → service → printer → command**.

## Stack tecnológica

| Camada | Tecnologia | Motivo |
|---|---|---|
| Runtime | Node.js ≥ 18 | Padrão de mercado, ecossistema maduro |
| Linguagem | TypeScript 5 (ESM) | Tipagem forte para um projeto de longo prazo |
| Framework CLI | Oclif (`@oclif/core` v4) | Sistema de plugins nativo, essencial para `abz plugin install` |
| Terminal UI | Chalk | Output colorido e feedback visual |
| Validação | Zod | Configuração validada com inferência automática de tipos |
| IA | SDK abstraído via `agents/provider/` | Permite trocar de provedor de IA sem reescrever os agentes (planejado) |
| Testes | Mocha + Chai | Testes unitários com fakes/dublês, sem depender de ferramentas externas instaladas |
| Lint | ESLint 9 (flat config) + Prettier | Padrão consistente de código |

## Sistema de configuração

O ABZSS lê configuração de dois lugares, com merge entre eles:

```
~/.abzssrc.json          → configuração global (ex: preferências pessoais, futuras credenciais de IA)
./.abzssrc.json (projeto) → sobrescreve campos específicos para esse projeto, se existir
```

Nenhum dos dois é obrigatório — na ausência de ambos, o ABZSS usa valores padrão sensatos. Isso evita que dados sensíveis (como uma futura API key de IA) sejam versionados sem querer dentro de um repositório de projeto.

## Status atual

O projeto está em fase de MVP. Progresso até agora:

- [x] Estrutura de pastas e Clean Architecture definidas
- [x] CLI inicializado com Oclif (`@oclif/core` v4, ESM, TypeScript 5)
- [x] `abz doctor` — diagnóstico de ambiente (Node.js, Git, Configuração)
- [x] Sistema de configuração (`.abzssrc`) com Zod, global + por projeto
- [x] `abz git review` — branch atual, arquivos staged, modificados e não rastreados
- [x] `abz open vscode` — abre o projeto ou um caminho específico no VS Code
- [x] `abz docker status` — verifica instalação e daemon do Docker
- [ ] `abz ask` — Assistant Agent (pausado: depende de orçamento para API de IA)
- [ ] `abz clean` — Clean Agent (pausado: mesma dependência)
- [ ] `abz docker restart` — gerenciamento de containers (pausado: aguardando ambiente Docker para testes)
- [ ] Integrações: Oracle, Oracle APEX
- [ ] Sistema de plugins de terceiros
- [ ] `abz workflow run` — automação de workflows customizados

Todo comando implementado tem testes unitários (usando dublês/fakes das dependências externas, para não depender de ferramentas de terceiros estarem instaladas) e passa em lint sem erros.

## Instalação (desenvolvimento)

```bash
git clone https://github.com/adyshavefear/abzss.git
cd abzss
npm install
npm run build
./bin/run.js doctor
```

## Comandos disponíveis hoje

```bash
abz doctor                    # diagnóstico do ambiente (Node, Git, Configuração)
abz git review                 # estado atual do repositório Git
abz open vscode [caminho]       # abre o projeto (ou caminho) no VS Code
abz docker status                # verifica instalação e daemon do Docker
abz help                          # ajuda geral
abz plugins                        # lista plugins instalados
```

Todos os demais comandos mencionados neste README fazem parte do roadmap e ainda não estão implementados.

## Testes

```bash
npm test
```

Roda a suíte completa (Mocha + Chai) seguida de lint (ESLint). Todos os testes usam dublês das dependências externas (Git, Docker, VS Code), portanto rodam de forma consistente em qualquer máquina, mesmo sem essas ferramentas instaladas.

## Contribuindo

Todo módulo novo deve seguir SOLID, Clean Code, DRY, KISS e baixo acoplamento. Nenhuma implementação é aceita sem testes correspondentes e sem passar no lint (`npm test`, que já roda ambos). Decisões de arquitetura devem ser justificadas — vantagens, desvantagens e alternativas consideradas — antes de implementadas.

## Licença

MIT