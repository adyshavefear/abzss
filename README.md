# ABZSS — Abyss System

> A database development CLI, starting with Oracle and APEX.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

---

## What is ABZSS?

ABZSS (pronounced *Abyss*) brings together Oracle connections, queries, SQL execution, object diagnostics, and APEX exports. Git, Docker, and editor commands remain available as supporting tools.

## Oracle and APEX

Configure connections in `~/.abzssrc.json` or your project's `.abzssrc.json`. Local profiles replace global profiles with the same name. Passwords come from environment variables; keep credentials out of Git.

```json
{
  "connections": {
    "dev": {
      "user": "APP_USER",
      "connectString": "localhost:1521/FREEPDB1",
      "passwordEnv": "ABZ_DEV_PASSWORD"
    }
  }
}
```

If SQL Developer or SQLcl already uses Oracle Net, run `abz db aliases` and use one of the listed aliases as the profile's `connectString`. ABZSS uses the directory set in `TNS_ADMIN` or, when unset, looks for `~/Oracle/network/admin/tnsnames.ora`. The alias list reads local configuration without opening a database session. Basic SQL Developer connections can also be represented as `host:port/service`.

In Bash, enter the password without adding it to your shell history:

```bash
read -rs -p 'Oracle password: ' ABZ_DEV_PASSWORD
export ABZ_DEV_PASSWORD
abz db doctor --connection dev
abz db ping --connection dev
abz db query --connection dev --file query.sql
abz db run --connection dev --file change.sql --execute
abz db invalid --connection dev --schema APP_USER
abz db errors --connection dev --schema APP_USER
abz db health --connection dev
abz apex inspect --connection dev
abz apex inspect 100 --connection dev
abz apex export --connection dev --app 100 --output f100.sql
```

Without `--connection`, ABZSS uses the `default` profile. The legacy `oracle` configuration is still supported and takes precedence in that case. Without `passwordEnv`, a profile uses `ABZ_ORACLE_PASSWORD`. Add profiles with their own password variables for other environments.

- `db doctor` shows the local Oracle Net directory, checks the profile and password configuration, and opens an Oracle session. It exits with code 1 on failure and uses the driver error to suggest what to check for TNS, network, listener, service, or authentication problems.
- `db ping` reports the authenticated user, database, container, service, and current schema.
- `db health` reports tablespace utilization and counts user sessions by status for the connected instance. It runs SELECTs and requires read access to `DBA_TABLESPACE_USAGE_METRICS` and `SYS.V_$SESSION`. Use a profile with those specific grants.
- `db query` accepts SELECT statements, uses a read-only transaction, and returns up to 1,000 rows as JSON. This version does not support pagination; use filters for larger result sets.
- `db run` accepts **one SQL statement or PL/SQL block per file**. It supports a trailing SQL semicolon (`;`) and `/` on the final line for PL/SQL. It does not interpret SQL*Plus/SQLcl scripts, `&` substitutions, `@` commands, or files containing multiple independent statements.
- `--execute` authorizes actual execution. DML is committed on success; errors trigger a rollback. **DDL and explicit commits inside PL/SQL cannot be undone by this rollback.** Use an account with minimal privileges and check the displayed target before running commands.
- `db invalid` lists invalid objects visible to the connection. `db errors` shows visible compilation errors with line and position. Both default to the connected user, accept `--schema` with the exact owner name as stored in Oracle (usually uppercase), and exit with code 1 when they find rows. The reports can be used as checks after a deployment.
- APEX requires access to its views and the `APEX_EXPORT` package in the correct workspace context. Exports produce a single SQL file, never overwrite an existing file, and should be reviewed before committing to version control.
- Connections have a 10-second connection timeout and a 30-second timeout per database call. The driver uses Thin mode; older databases or environments requiring Thick mode/Oracle Client are not supported in this version.

References: [Oracle driver transactions](https://node-oracledb.readthedocs.io/en/stable/user_guide/txn_management.html) and [APEX export API](https://docs.oracle.com/en/database/oracle/application-express/19.2/aeapi/GET_APPLICATION_Function.html).

## Philosophy

Three principles guide architectural and implementation decisions in ABZSS:

- **Intelligent automation** — eliminate repetitive tasks instead of documenting them.
- **Modular architecture** — adding a module should not require changing the existing core.
- **Clean, scalable code** — build software that a team can maintain, rather than relying on a single person.

Decisions consider future integrations as well as current needs.

## Who is it for?

ABZSS is designed for developers and teams who:

- Work extensively in the terminal and want to automate their development environment.
- Use multiple tools daily (Git, Docker, VS Code, Oracle Database, Oracle APEX) and want to manage them from one place.
- Want AI integrated into their workflow as part of the CLI.
- Value clean architecture and long-term extensibility over disposable scripts.

## AI agents (planned)

ABZSS is planned to include two agents with distinct responsibilities. This phase is currently paused; see **Current status**.

### Assistant Agent

Explains code, answers questions, interprets errors, and teaches technologies such as SQL, PL/SQL, JavaScript, Node.js, and Oracle APEX. **Never modifies files**; it provides advice only.

### Clean Agent

Handles refactoring, consistency, naming, organization, and good practices such as SOLID and Clean Code. **May modify files**, but only after explicit user approval for any changes.

## Architecture

The project follows Clean Architecture, separating responsibilities across layers. The layout below includes planned modules:

```text
abzss/
├── bin/                 # Executable entry points (Oclif)
├── src/
│   ├── commands/        # Oclif commands and CLI input handling
│   ├── core/            # Contracts (interfaces); custom errors and event bus planned
│   ├── services/        # Business rules and orchestration
│   ├── integrations/    # External adapters (Git, Docker, Oracle, APEX, VS Code)
│   ├── agents/          # Planned: Assistant Agent, Clean Agent, AI provider abstraction
│   ├── cli/ui/          # Terminal output formatting
│   ├── hooks/           # Oclif hooks (e.g. ASCII banner when no command is given)
│   ├── plugins/         # Planned: dynamically loaded plugins
│   ├── config/          # Zod-validated global and project configuration
│   ├── prompts/         # Planned: prompt templates for AI agents
│   └── templates/       # Planned: code generation scaffolds
├── test/
└── docs/
```

The architectural goal is for services to depend on interfaces in `core/contracts/`, keeping external adapters replaceable. Some current services also create adapters directly. The general integration flow is **contract → adapter → service → printer → command**.

## Technology stack

| Layer | Technology | Rationale |
|---|---|---|
| Runtime | Node.js ≥ 18 | Widely used with a mature ecosystem |
| Language | TypeScript 5 (ESM) | Strong typing for long-term maintenance |
| CLI framework | Oclif (`@oclif/core` v4) | Native plugin support for future extensions |
| Terminal UI | Chalk | Colored output and visual feedback |
| Validation | Zod | Configuration validation with inferred types |
| Database | node-oracledb | Oracle Database access in Thin mode |
| AI (planned) | SDK abstraction through `agents/provider/` | Switch AI providers without rewriting agents |
| Tests | Mocha + Chai | Unit tests with fakes and test doubles |
| Lint | ESLint 9 (flat config) + Prettier | Consistent code style |

## Configuration

ABZSS merges configuration from two locations:

```text
~/.abzssrc.json           → global configuration (e.g. personal preferences)
./.abzssrc.json           → project-specific overrides, when present
```

Neither file is required. If both are absent, ABZSS uses its defaults. Store passwords in environment variables and keep local configuration out of version control.

## Current status

The project is in the MVP stage. Progress so far:

- [x] Folder structure and architectural foundations
- [x] CLI initialized with Oclif (`@oclif/core` v4, ESM, TypeScript 5)
- [x] `abz doctor` — environment diagnostics (Node.js, Git, configuration)
- [x] Zod-validated configuration (`.abzssrc.json`), global and per project
- [x] `abz git review` — current branch, staged, modified, and untracked files
- [x] `abz open vscode` — open the project or a specific path in VS Code
- [x] `abz docker status` — check Docker installation and daemon status
- [x] Named Oracle connections with passwords from environment variables
- [x] `abz db ping`, `query`, `run`, and `errors`
- [x] `abz apex inspect` and `export`
- [ ] `abz ask` — Assistant Agent (paused: requires an AI API budget)
- [ ] `abz clean` — Clean Agent (paused: same dependency)
- [ ] `abz docker restart` — container management (paused: awaiting a Docker test environment)
- [ ] Third-party plugin system
- [ ] `abz workflow run` — custom workflow automation

Database tests cover configuration, statement preparation, transaction handling, and the connection adapter using test doubles. Oracle and APEX integration still needs validation against a real database.

## Installation (development)

```bash
git clone https://github.com/adyshavefear/abzss.git
cd abzss
npm install
npm run build
./bin/run.js doctor
```

## Available commands

```bash
abz doctor                          # Environment diagnostics
abz git review                      # Current Git repository status
abz open vscode [path]              # Open the project or a path in VS Code
abz docker status                   # Check Docker installation and daemon
abz db ping --connection dev        # Test an Oracle connection
abz db query --connection dev --file query.sql
abz db run --connection dev --file change.sql --execute
abz db errors --connection dev      # List compilation errors
abz apex inspect --connection dev   # List APEX applications
abz apex inspect 100 --connection dev
abz apex export --connection dev --app 100 --output f100.sql
abz help                            # General help
abz plugins                         # List installed plugins
```

Commands marked as planned elsewhere in this README are not implemented yet.

## Tests

```bash
npm test
```

Runs the full Mocha + Chai suite, followed by ESLint on success. Tests use a mix of test doubles and environment checks; some existing diagnostics tests require tools such as Git to be available and executable. Database unit tests do not require a live Oracle instance.

## Contributing

New modules should follow SOLID, Clean Code, DRY, KISS, and loose coupling. Include relevant tests and pass lint (`npm test` runs both). Explain architectural decisions, including benefits, drawbacks, and alternatives, before implementation.

## License

MIT
