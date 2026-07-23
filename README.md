abzss
=================

Plataforma de automação e assistência ao desenvolvedor via CLI


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/abzss.svg)](https://npmjs.org/package/abzss)
[![Downloads/week](https://img.shields.io/npm/dw/abzss.svg)](https://npmjs.org/package/abzss)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g abzss
$ abz COMMAND
running command...
$ abz (--version)
abzss/0.0.0 linux-x64 node-v24.18.0
$ abz --help [COMMAND]
USAGE
  $ abz COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`abz hello PERSON`](#abz-hello-person)
* [`abz hello world`](#abz-hello-world)
* [`abz help [COMMAND]`](#abz-help-command)
* [`abz plugins`](#abz-plugins)
* [`abz plugins add PLUGIN`](#abz-plugins-add-plugin)
* [`abz plugins:inspect PLUGIN...`](#abz-pluginsinspect-plugin)
* [`abz plugins install PLUGIN`](#abz-plugins-install-plugin)
* [`abz plugins link PATH`](#abz-plugins-link-path)
* [`abz plugins remove [PLUGIN]`](#abz-plugins-remove-plugin)
* [`abz plugins reset`](#abz-plugins-reset)
* [`abz plugins uninstall [PLUGIN]`](#abz-plugins-uninstall-plugin)
* [`abz plugins unlink [PLUGIN]`](#abz-plugins-unlink-plugin)
* [`abz plugins update`](#abz-plugins-update)

## `abz hello PERSON`

Say hello

```
USAGE
  $ abz hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ abz hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/adyshavefear/abzss/blob/v0.0.0/src/commands/hello/index.ts)_

## `abz hello world`

Say hello world

```
USAGE
  $ abz hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ abz hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/adyshavefear/abzss/blob/v0.0.0/src/commands/hello/world.ts)_

## `abz help [COMMAND]`

Display help for abz.

```
USAGE
  $ abz help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for abz.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/6.2.53/src/commands/help.ts)_

## `abz plugins`

List installed plugins.

```
USAGE
  $ abz plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ abz plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.84/src/commands/plugins/index.ts)_

## `abz plugins add PLUGIN`

Installs a plugin into abz.

```
USAGE
  $ abz plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into abz.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the ABZ_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the ABZ_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ abz plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ abz plugins add myplugin

  Install a plugin from a github url.

    $ abz plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ abz plugins add someuser/someplugin
```

## `abz plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ abz plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ abz plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.84/src/commands/plugins/inspect.ts)_

## `abz plugins install PLUGIN`

Installs a plugin into abz.

```
USAGE
  $ abz plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into abz.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the ABZ_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the ABZ_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ abz plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ abz plugins install myplugin

  Install a plugin from a github url.

    $ abz plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ abz plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.84/src/commands/plugins/install.ts)_

## `abz plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ abz plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ abz plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.84/src/commands/plugins/link.ts)_

## `abz plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ abz plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ abz plugins unlink
  $ abz plugins remove

EXAMPLES
  $ abz plugins remove myplugin
```

## `abz plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ abz plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.84/src/commands/plugins/reset.ts)_

## `abz plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ abz plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ abz plugins unlink
  $ abz plugins remove

EXAMPLES
  $ abz plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.84/src/commands/plugins/uninstall.ts)_

## `abz plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ abz plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ abz plugins unlink
  $ abz plugins remove

EXAMPLES
  $ abz plugins unlink myplugin
```

## `abz plugins update`

Update installed plugins.

```
USAGE
  $ abz plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.84/src/commands/plugins/update.ts)_
<!-- commandsstop -->
