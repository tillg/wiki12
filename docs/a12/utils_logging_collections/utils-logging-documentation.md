---
source: https://geta12.com/docs/2025.06/ext5/utils_logging_collections/utils-logging-documentation/index.html
category: utils_logging_collections
docid: utils-logging-documentation
scraped: 2026-06-12
---

# Logging

The package `@com.mgmtp.a12.utils/utils-logging` contains a logging framework dependency to be used with JavaScript (ECMA Script >= 5) or TypeScript >= 2.4.

## How to Log

To capture log messages just import/require `LoggerFactory` to obtain a logger.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` import { LoggerFactory } from "@com.mgmtp.a12.utils/utils-logging"; ``` |
```

In your code obtain a logger and start logging:

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` const myLogger = LoggerFactory.getLogger("my-namespace"); myLogger.log("I", "can", "log", "something"); ``` |
```

|  |  |
| --- | --- |
|  | Logger is obtained for a certain namespace and instance is created the first time when a logger is obtained. Any subsequent call with the same namespace will return the same logger instance. |

### Logger Interface

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` interface Logger { 	error(message?: any, ...optionalParams: any[]): void; 	info(message?: any, ...optionalParams: any[]): void; 	log(message?: any, ...optionalParams: any[]): void; 	trace(message?: any, ...optionalParams: any[]): void; 	warn(message?: any, ...optionalParams: any[]): void; } ``` |
```

### Log Levels

|  |  |
| --- | --- |
| **TRACE** = 1 | Most detailed severity. Messages logged at that level should provide context when investigating log records with a severity of warn or error. |
| **LOG** = 2 | Messages at that level should provide diagnosis information helpful to technical staff |
| **INFO** = 3 | Messages at that level should provide information about regular events happening in the application and/or library. For error analysis, those can be taken into account to see whether normal operations took place or not in regard to the error circumstance. |
| **WARN** = 4 | Messages at that level should make aware that some irregularity is encountered. From an application level point of view an example would be the be loss of network access and thus buffering of data locally until the connection is usable again. |
| **ERROR** = 5 | Messages at that level should signal that a certain operation cannot proceed and no failover is possible. |

## How to Process Data

By default the library employs the `lib/strategy/DiscardStrategy.d.ts` which just discards any log.

### Examples

#### Minimal

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` // Assuming your namespaces are separated by DOT import { Settings, ConsoleLoggingStrategy } from "@com.mgmtp.a12.utils/utils-logging"; Settings.LogStrategy = new ConsoleLoggingStrategy(console, undefined, {     filterNamespace: (nameSpace: string) => nameSpace.indexOf(".internal.") === -1; }); // Done! ``` |
```

#### Advanced

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` import { Settings, ConsoleLoggingStrategy } from "@com.mgmtp.a12.utils/utils-logging" import { LogLevel } from "@com.mgmtp.a12.utils/utils-logging/api"; const generalLogger = new ConsoleLoggingStrategy(console, undefined, {     filterNamespace: (nameSpace: string) => nameSpace.indexOf(".internal.") === -1; }); Settings.LogStrategy = {     digest(namespace: string, level: LogLevel, date: Date, message?: any, ...optionalParams: any[]): void {         // Implement any desired behavior here         switch(namespace)         {             // ....             case "my.namespace":             // Do something special, send to backend, etc.             break;             // ....             default: generalLogger.digest(namespace, level, date, message, ...optionalParams);             break;         }     } } // Done! ``` |
```

#### Namespace Specific Configuration

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 ``` | ``` import { Settings, ConsoleLoggingStrategy, MultiLoggingStrategy } from "@com.mgmtp.a12.utils/utils-logging" import { LogLevel, LoggingStrategy } from "@com.mgmtp.a12.utils/utils-logging/api";  // Config could be stored anywhere const config = {     "my.cool.namespace": LogLevel.INFO,     "my.other.cool.namespace": LogLevel.TRACE }; const strategies: LoggingStrategy[] = Object.keys(config).reduce(     (a, configKey) => {         // For each custom logLevel namespace, add a console         // logger which has a local logLevel         a.push(new ConsoleLoggingStrategy(console, config[configKey], {             filterNamespace: ns => ns !== configKey         }));         return a;     },     [] );  Settings.LogStrategy = new MultiLoggingStrategy(     ...strategies,     // Add default strategy and filter out all specific namespaces     new ConsoleLoggingStrategy(console, undefined, {         filterNamespace: ns => config.hasOwnProperty(ns)     }) ); // Done! ``` |
```

#### Determine Whether the Current Settings Are in the Default State

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` import { Settings, ConsoleLoggingStrategy } from "@com.mgmtp.a12.utils/utils-logging" const isDefaultStrategy = Settings.DefaultStrategy === Settings.LogStrategy; const isDefaultLogLevel = Settings.DefaultLogLevel === Settings.LogLevel; // Done! ``` |
```

#### Determine if a Specific logLevel Is Currently Active

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` import { Settings} from "@com.mgmtp.a12.utils/utils-logging" import { LogLevel } from "@com.mgmtp.a12.utils/utils-logging/api" const isInfoActive = Settings.isActive(LogLevel.INFO); // Done! ``` |
```

Out of the box this library is shipping with four distinct logger factories:

* `ConsoleLoggingStrategy` which delegates to console if a log message meets or exceeds a certain local severity or - by default - the globally configured logLevel
* `BaseConsoleLoggingStrategy` which delegates to console anyways
* `MinLogLevelLoggingStrategy` which delegates to another logging strategy if a log message meets or exceeds a certain local severity or - by default - the global configured logLevel
* `MultiLoggingStrategy` which delegates to multiple instances of logging strategy

With those implementations you can start right away with console.
As a more advanced use case you might want to consider to defer processing of log data to a remote location. For this you can simply write a logging strategy which takes care of serializing data and handling remote communication.

## Breaking Change Management

The utils-logging package follows the general [A12 breaking change interpretation](https://geta12.com/docs/overall/breaking_change_management).

## Migration Instructions

### 2025.06-ext4

#### Deprecation

#### Deep import paths of A12 Logging npm package

Nested imports from the npm package `@com.mgmtp.a12.utils/utils-logging` (e.g. `@com.mgmtp.a12.utils/utils-logging/lib/strategy/ConsoleStrategies.js`)
are now deprecated in favor of top-level imports to avoid unnecessary breaking changes and reduce ongoing maintenance effort.

The ability to use the old-style ("long") imports will be removed in the next breaking release.

To migrate, first install or update the codemod with your preferred package manager, e.g. with `pnpm`:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` pnpm install -g @com.mgmtp.a12.utils/utils-logging-codemod ``` |
```

Then run the specific recipe:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` utils-logging-codemod preferTopLevel <path to directory with tsconfig.json>  // or as a single command pnpx @com.mgmtp.a12.utils/utils-logging-codemod preferTopLevel <path to directory with tsconfig.json> ``` |
```

For further details, run the codemod with the `--help` flag.

### 2025.06

#### Breaking Changes

#### Migration to ESM

The npm artifact `@com.mgmtp.a12.utils/utils-logging` was migrated from CommonJS to [ESM](https://nodejs.org/api/esm.html#modules-ecmascript-modules). When using Node `22.12+` and modern build tools, there should be no changes necessary to your bundler setup.

Migrating your own application to ESM is not required, but recommended. Consult the documentation of your bundler for specifics.

#### Updating to ES2024

The javascript output of the npm artifact was updated from `ES2020` to `ES2024` to be able to use latest language features. When using supported browsers, there is no change necessary. If support for older browsers is required, make sure to include necessary polyfills.

#### Removed Deprecated API

The deprecated API `initLoggingSystem` was removed. As a replacement, use the Settings singleton to set your logging strategy directly, as described in the API documentation: `Settings.LogStrategy = <your strategy>;`.

#### Removed Possibility to set Settings in Global Scope

In previous version it was possible to specify `Settings` by setting a global value named "@com.mgmtp.a12/logging" on the window object. This is now removed without a replacement.
Please use the `Settings` singleton to configure any logging settings.
