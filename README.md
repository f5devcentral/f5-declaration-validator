# Welcome to f5-declaration-validator

This is the exploration of using external tools to validate F5 ATC declartions for use in other tools and programmitic means.

The idea is to provide a tool/function that will validate ANY f5 declaration.  A simple javascript package/function/library that could be easily integrated into any other project.

code-name: vera (italian for "true")

- [Welcome to f5-declaration-validator](#welcome-to-f5-declaration-validator)
  - [Research](#research)
  - [Solution](#solution)
  - [Usage](#usage)
  - [Commands](#commands)
  - [`f5dv commands`](#f5dv-commands)
  - [`f5dv help [COMMAND]`](#f5dv-help-command)
  - [`f5dv service`](#f5dv-service)
  - [`f5dv validate [DEC]`](#f5dv-validate-dec)
  - [`f5dv version`](#f5dv-version)
  - [examples](#examples)
    - [validate as3 declaration](#validate-as3-declaration)
  - [Future Enhancements](#future-enhancements)
    - [_not prioritized_](#not-prioritized)
  - [ATC declaration validation code references](#atc-declaration-validation-code-references)
  - [AVJ engine](#avj-engine)
  - [vscode-json-languageservice engine](#vscode-json-languageservice-engine)
  - [Linting - Extended Diagnostics](#linting---extended-diagnostics)
  - [AS3 Linting Rules](#as3-linting-rules)
    - [Orphaned Objects](#orphaned-objects)
    - [IP Address input validation](#ip-address-input-validation)
    - [Certificate/key in declaration body](#certificatekey-in-declaration-body)
  - [TerraForm TASKS integration info](#terraform-tasks-integration-info)
  - [support](#support)

## Research

Two different packages are explored within this tool.  

The first is AJV (<https://github.com/ajv-validator/ajv>), which is what the F5 Automated ToolChain (ATC) currently utilize as part of the core code of those projects.

The second package is **vscode-json-languageservice** (<https://github.com/microsoft/vscode-json-languageservice>), which is an abstraction of what VSCode is using to provide this functionality.  This method is recommended by ATC for external user declaration validation (<https://clouddocs.f5.com/products/extensions/f5-appsvcs-extension/latest/userguide/validate.html>).

## Solution

This projects contributes the following;

- JS/TS library
  - "validate" function, which will accept a json string, attempt to discover ATC declaration type and validate it against the appropriate schema
- A REST API
  - /validate - endpoint that will also validate an ATC declaration using above function
  - /info - endpoint for providing information about the project/package
    - Any unknown api endpoint request will get redirected here
    - Also includes a listing of all api endpoints for quick visibility

## Usage

<!-- usage -->
```sh-session
$ npm install -g f5-declaration-validator
$ f5dv COMMAND
running command...
$ f5dv (--version|-v)
f5-declaration-validator/1.1.0 linux-x64 node-v16.14.0
$ f5dv --help [COMMAND]
USAGE
  $ f5dv COMMAND
...
```
<!-- usagestop -->

## Commands

<!-- commands -->
- [`f5dv commands`](#f5dv-commands)
- [`f5dv help [COMMAND]`](#f5dv-help-command)
- [`f5dv service`](#f5dv-service)
- [`f5dv validate [DEC]`](#f5dv-validate-dec)
- [`f5dv version`](#f5dv-version)

## `f5dv commands`

list all the commands

```bash
USAGE
  $ f5dv commands [--json] [-h] [--hidden] [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help         Show CLI help.
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --hidden           show hidden commands
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  list all the commands
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v2.1.0/src/commands/commands.ts)_

## `f5dv help [COMMAND]`

Display help for f5dv.

```bash
USAGE
  $ f5dv help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for f5dv.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.11/src/commands/help.ts)_

## `f5dv service`

start F5 ATC declaration REST API Service

```bash
USAGE
  $ f5dv service [-h] [-p <value>] [-c <value>] [-k <value>]

FLAGS
  -c, --cert=<value>  path to cert
  -h, --help          Show CLI help.
  -k, --key=<value>   path to cert-key
  -p, --port=<value>  [default: 3030] port to run service on

DESCRIPTION
  start F5 ATC declaration REST API Service
```

_See code: [dist/commands/service.ts](https://github.com/DumpySquare/f5-declaration-validator/blob/v1.1.0/dist/commands/service.ts)_

## `f5dv validate [DEC]`

validate F5 ATC declaration

```bash
USAGE
  $ f5dv validate [DEC] [--json] [-h] [-f <value>]

FLAGS
  -f, --file=<value>  f5 atc declaration file
  -h, --help          Show CLI help.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  validate F5 ATC declaration
```

_See code: [dist/commands/validate.ts](https://github.com/DumpySquare/f5-declaration-validator/blob/v1.1.0/dist/commands/validate.ts)_

## `f5dv version`

```bash
USAGE
  $ f5dv version
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v1.0.4/src/commands/version.ts)_
<!-- commandsstop -->

## examples

### validate as3 declaration

```bash

```

## Future Enhancements

### _not prioritized_

- Extended schema "linting/recommendations"
  - See linting section
- Telemetry
- CLI for consumption flexibility and git action integration
- containerize for orchestration
- Round out support for DO/TS and even DWAF
- Host in F5 Distributed Cloud?
- UI?
  - paste declaration and see the output
- SWAGGER file?

## ATC declaration validation code references

- The once available as3 declaration validator
  - <https://github.com/F5Networks/f5-appsvcs-extension/tree/f105a6aee2a92c0ddbe6c8595be5983bc222c3d6/AS3-schema-validator>
- DO validator code:
  - <https://github.com/F5Networks/f5-declarative-onboarding/blob/master/src/lib/ajvValidator.js>
- TS validator code:
  - <https://github.com/F5Networks/f5-telemetry-streaming/blob/master/src/lib/declarationValidator.js>
- CF validator code;
  - <https://github.com/F5Networks/f5-cloud-failover-extension/blob/master/src/nodejs/validator.js>

## AVJ engine

The struggle with this approach is the following;

- Custom schema references are not supported
- Would require each project to expose directly library api functions
  - Not part of the current delivery and support module
- Some of the ATC projects may limited by legacy code versions

Some advantages;

- utilizes the same underlying schema validation project as original tools
- options for pre-compiling schema/functions for faster project instantiation and execution
- smallest footprint

## vscode-json-languageservice engine

As described by the articles below, this method works in VSCode for ALL ATC declarations

<https://clouddocs.f5.com/products/extensions/f5-appsvcs-extension/latest/userguide/validate.html>
<https://clouddocs.f5.com/products/extensions/f5-declarative-onboarding/latest/validate.html>
<https://clouddocs.f5.com/products/extensions/f5-telemetry-streaming/latest/validate.html>

If you look at the issues in the vscode-json-languageservice repo you will see they have done good amount of work to get many different tricky schema things to validate, which is part of why vscode is so popular.

Some negatives to this approach;

- larger external dependencies and code base

The benefits;

- We know this works for ATC declarations in VSCode
  - My testing with this method does not seem to work with DO/TS but we are researching this
    - There is a DO schema bug (fix pending in next release)
    - validation works in vscode, but not directly through this project #125
      - <https://github.com/microsoft/vscode-json-languageservice/issues/125>
- provides very nice errors and error line pointers
- I **think** this method can be extended to provide "linting" like inspection to the declaration also
  - See linting section

## Linting - Extended Diagnostics

The idea here is to extend the json validation with linting daignostics to provide insights on recommended/not-recommneded configuration options/combinations

For example;  If a certificate body is found in a declaration.  While it is technically supported, it is recommended to manage certs through a secret store the declration should reference

- extending schema validation with suggestions #126
  - <https://github.com/microsoft/vscode-json-languageservice/issues/126>

## AS3 Linting Rules

### Orphaned Objects

Detect if AS3 object has been created, but not refereced

### IP Address input validation

-**pending Greg feedback**-

### Certificate/key in declaration body

Detect if certificate/key detected in declartion body and suggest using a secret store

## TerraForm TASKS integration info

One need is to integrate this tool with TerraForm Tasks to provide more planning intelligence.  Documentation on how to do this is blow.

During discussions someone asked if we could bake this into the TF provider and not have to have an external service?

- Blog: Terraform Cloud Run Tasks Beta Now Available
  - <https://www.hashicorp.com/blog/terraform-cloud-run-tasks-beta-now-available>
- Terraform Cloud Run Tasks
  - <https://www.terraform.io/cloud-docs/workspaces/settings/run-tasks>
- Terraform Cloud Run Tasks API
  - <https://www.terraform.io/cloud-docs/api-docs/run-tasks>
- Terraform Cloud Run Tasks Integration
  - <https://www.terraform.io/cloud-docs/integrations/run-tasks>

## support

This project is open source and community supported.  Any questions, comments, and/or feature requests please open an issue.
