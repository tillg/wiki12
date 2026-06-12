---
source: https://geta12.com/docs/2025.06/ext5/expression/expression-docs/index.html
category: expression
docid: expression-docs
scraped: 2026-06-12
---

# Expressions

## Introduction

Expressions are a solution for displaying field values as read-only information.
Besides single values, e.g. for read-only table cells in Form Repeats, they can also be used to create complex composites.
For example, it is possible to merge multiple field values into a single cell or to add formatting instructions.
For this purpose, an Expression can be defined using a specific syntax described below.

## Installation

The package is provided as a NPM package containing ES5 CommonJS modules and can be installed using npm with the following command:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm install @com.mgmtp.a12.expression/expression-core ``` |
```

## Usage

The `Expression` package initially is used not only by `Overview` and `Form Engine`, but also by any A12 application
as a standalone module.

Usage

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 ``` | ``` import { type ModelPath } from "@com.mgmtp.a12.base/base-model-api"; import { type Localizer } from "@com.mgmtp.a12.utils/utils-localization"; import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade"; import { ExpressionBuilder, ExpressionInterpreter } from "@com.mgmtp.a12.expression/expression-core"; import { type DocumentModel, type EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade"; import { type FieldInstanceValue, type GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";  interface ResolverParams { 	document: GroupInstance; 	documentModel: DocumentModel; 	localizer: Localizer; 	fieldFormatter(path: ModelPath, value: FieldInstanceValue | object): string; }  export const createResolver = (resolverParams: ResolverParams) => { 	const { document, documentModel, localizer, fieldFormatter } = resolverParams; 	const valueGetter = (path: EntityInstancePath) => 		new DocumentServiceFactory().getDocumentService().getAssignedObject(document, path) ?? null;  	return (expression: string): string => 		ExpressionInterpreter.format({ 			documentModel, 			rootPath: [], 			localizer, 			valueGetter, 			expressionTree: ExpressionBuilder.build(expression), 			fieldFormatter: (path) => fieldFormatter(path, valueGetter(path)) 		}); }; ``` |
```

To create a simple Expression resolver, these following information needs to be provided:

* `document` and `documentModel`: the A12 document and its corresponding Document Model to resolve the actual value
* `localizer`: the A12 localizer to resolve multilingual texts
* `fieldFormatter`: the callback to get the string presentation for a field. It should be based on Overview/Form Engine’s Converter,
  or on the Kernel at least.

## Modules

There are three main public modules: `ExpressionBuilder`, `ExpressionInterpreter`, and `ExpressionOutput`.

|  |  |
| --- | --- |
|  | Since the Expression package is still in development phase with version under 1.0.0, therefore the following APIs are not stable and can be changed anytime even in minor/patch versions. |

### ExpressionBuilder

Expression package exposes `ExpressionBuilder.build` function for building the [abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (AST)
from the raw string which could be useful in some customization cases. It receives two following parameters:

* `expression`: the string needs to be parsed
* `context` *(optional)*: contains additional information for the builder.

ExpressionBuilder API

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 ``` | ``` import { type ModelPath } from "@com.mgmtp.a12.base/base-model-api"; import { type Expression } from "@com.mgmtp.a12.expression/expression-core"; import { type FieldInstanceValue } from "@com.mgmtp.a12.kernel/kernel-md-facade";  export namespace ExpressionBuilder { 	export function build(expression: string, context?: Context): Expression.RootNode {}  	export interface Context { 		/** 		 * The function is used to parse the right-hand-side operand 		 * of the CaseOperation comparison. 		 */ 		valueParser: ValueParser; 		/** 		 * The path to the scope of the expression. 		 * 		 * @example 		 * In the context of DomainPerson above, instead of: 		 * `kontext (PersonalInfo) {kontext (Address) { [Country] } }` 		 * One can write: `kontext (Address) { [Country] }` 		 * and specify rootPath = [{elementName: "PersonalInfo"}] 		 * 		 */ 		rootPath: ModelPath; 	}  	export type ValueParser = (path: ModelPath, uiValue: string) => FieldInstanceValue; } ``` |
```

**Example:**
The expression

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` kontext(PersonalInfo) {     [ LastName ] " " [FirstName] } ``` |
```

will be transformed into the following AST:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 ``` | ``` {   "type": "root",   "children": [     {       "type": "group",       "name": "PersonalInfo",       "children": [         {           "type": "field",           "name": "LastName"         },         {           "type": "string",           "content": " "         },         {           "type": "field",           "name": "FirstName"         }       ]     }   ] } ``` |
```

### ExpressionInterpreter

`ExpressionInterpreter` is the primary module where the expression AST (usually comes from the `ExpressionBuilder`)
is transformed into the HTML string format.
It receives an object with the following interface as the only parameter:

ExpressionInterpreter parameters

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 ``` | ``` export namespace ExpressionInterpreter { 	export interface Parameters { 		/** 		 * The expression AST to evaluate should come from the ExpressionBuilder 		 */ 		readonly expressionTree: Expression.RootNode;  		/** 		 * The path to the expression scope 		 */ 		readonly rootPath: EntityInstancePath;  		/** 		 * The callback to format the field value 		 */ 		fieldFormatter(path: EntityInstancePath): string;  		/** 		 * The callback usually used in CaseOperation 		 * to resolve the actual field value before performing the comparison 		 */ 		valueGetter(path: EntityInstancePath): FieldInstanceValue | object | undefined;  		/** 		 * The list of string to be ignored html escaping 		 */ 		readonly ignoreFieldTextPatterns?: string[];  		/** 		 * The corresponding Document Model 		 */ 		readonly documentModel: DocumentModel;  		/** 		 * The localizer to format the MultilingualTextNode 		 */ 		readonly localizer: Localizer;  		/** 		 * Whether <p> tags in the expression should be omitted or not 		 * @default false 		 */ 		readonly noMarkup?: boolean; 	} } ``` |
```

**Example:**
With the above AST and suitable parameter, here is the output of `ExpressionInterpreter.format` function:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` <div>     <p>John Doe</p> </div> ``` |
```

### ExpressionOutput

`ExpressionOutput` is a React component wrapping the `ExpressionInterpreter` which recommends for Expression users
when integrating HTML output to applications, to avoid using
[React’s dangerouslySetInnerHTML](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml) property.

Besides the `ExpressionInterpreter.Parameters`, `ExpressionOutput` component can receive two optional properties:

* `asSpan`: wrap the output by a `span` instead of the `div` as default.
* `className`: the additional CSS class name.

|  |  |
| --- | --- |
|  | Using formatted Expressions for any titles and/or labels will break [accessibility](https://geta12.com/docs/PLASMA/accessibility/index.html)! |

|  |  |
| --- | --- |
|  | The Expression team also has the plan to use a better third-party library to render React components for this security reason even though the HTML is already sanitized by [dompurify](https://www.npmjs.com/package/dompurify) library. |

## Language

An expression can be considered as a list of `elements`, each of them can be a `Token`, `Value` or `Operation` element.

### Token

A `Token` can be:

* `NewLine`: represent by two newline characters (`\n\n`), uses to break the current text flow.
* `NewParagraph`: represent by three newline characters `(\n\n\n`), similar to the `NewLine` token but gives more spaces.

### Value

The `Value` element can be belong to one of the following types:

| Value type | Syntax | Description |
| --- | --- | --- |
| `StringValue` | `"<string_value>"`  E.g. `"Fullname:"` | The string value is surrounded by the **double quotes** |
| `FieldValue` | `[<FieldName>]`  E.g. `[FirstName]` | The field name is surrounded by **square brackets** and no quotes.  `FieldValue` is only available inside the `GroupOperation` context, and the referencing FieldName should be the name of a directed field inside the corresponding Document Model Group. This syntax will be resolved by the actual field value by **ExpressionInterpreter’s fieldFormatter** parameter. |
| `MultilingualTextValue` | `(<locale_1>:"<text_1>",<locale_2>:"<text_2>",…​)`  E.g. `(en: "women", de: "frauen", fr: "femmes")` | A **comma**-separated list of the localized pairs separated by **colons** is surrounded by **parentheses**. Each pair contains a locale identifier and its corresponding localized text.  The final value is resolved by converting the list into Localizables and then passing it to **ExpressionInterpreter’s localizer** parameter. |

### Operation

#### GroupOperation

`GroupOperation` is the way to access nested Document Model Element in Expression language.

**Syntax:**

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` kontext ( <group_name> [, delimiter = <delimiter_string>] ) { <list_of_elements> } ``` |
```

Any kind of `element` can be put inside the curly brackets even other GroupOperations as long as they are followed by the document model structure.

**Example:**

Given the below simplified document model structure:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` ├ RootGroup └─┬ PersonalInfo   ├── FirstName  ("John")   ├── LastName   ("Doe")   ├── IsMale     (true)   ├── BirthYear  (1950)   └─┬ Address     └─┬ Country  ("USA")       └ City     ("New York") ``` |
```

Then a small personal description `John Doe from New York, USA` can be shown with:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` kontext (PersonalInfo) {   [FirstName] " " [LastName]   " from "   kontext (Address) {    [City] ", "[Country]   } } ``` |
```

**Group delimiter**

By default, the result of a group operation for repeatable groups will be concatenated together without any delimiter.
However, an customized delimiter can be useful in some cases, e.g, extend the above example so a person can have multiple addresses:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` ├ RootGroup └─┬ PersonalInfo   ...   └─┬ Address[5]     └─┬ (Country, City)  ("USA", "New York")       └ (Country, City)  ("Germany", "Berlin") ``` |
```

So to represent multiple addresses, instead of the default behavior `New York (USA)Berlin (Germany)`, the users can use delimiter option
to create a better result `New York (USA), Berlin (Germany)` with this expression:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` kontext (PersonalInfo) {   kontext (Address, delimiter = ", ") {    [City] " (" [Country] ")"   } } ``` |
```

#### CaseOperation

`CaseOperation` basically is branching statements in Expression language.

**Syntax:**

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` case [<field_name>] <operator> <string_value> { <list_of_elements> } ``` |
```

* `<field_name>` is the name of a valid field in the current scope, wrapped in square brackets.
* `<operator>` currently only supports equality operator `"="` or `"!="`.
* `<string_value>` is the string representation of comparing value. The actual value is parsed based on the corresponding type of
  `<field_name>` field via [`ExpressionBuilder.Context.valueParser`](#_expressionbuilder) before the comparison.
  By default, if not provided `valueParser`, only raw string value will be used to compare so it may not work properly
  with some kinds of DocumentModel’s FieldType, e.g. `DateType`, `DateTimeType`, `DateRangeType`, etc.
* `<list_of_elements>`, like `GroupOperation` can be any kind of Expression `Element`.

The below table shows the default format of some FieldTypes used by Overview and Form Engine concerning English- and German-based locale:

| FieldType | English-based locale | German-based locale |
| --- | --- | --- |
| `NumberType` | `"3,141.59"` | `"3.141,59"` |
| `TimeType` | `"09:15 PM"` | `"21:15"` |
| `DateType` | `"05/20/2020"` | `"20.05.2020"` |
| `DateTimeType` | `"05/20/2020 09:15 PM"` | `"20.05.2020 21:15"` |
| `BooleanType` | `"true"` or `"false"` | |
| `ConfirmType` | `"true"` or `""` | |
| `EnumerationType` | The string value from `fieldType` field of corresponding Document Model | |

|  |  |
| --- | --- |
|  | `DateRangeType` field comparisons are not supported yet. |

**Example:**

Re-using the document model in `GroupOperation` section, the below expression shows how to add a title before the
last name:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` kontext (PersonalInfo) {   case [IsMale] = "true"  { "Mr." }   case [IsMale] != "true" { "Mrs." }   [LastName] } ``` |
```

### Markdown support

Internally, the [marked](https://www.npmjs.com/package/marked) library is used to parse the Markdown string into
raw HTML string (before sanitizing) so an expression can be markdown-compatible by wrapping Markdown-specific characters
under double quotes as [StringValue](#_value).

**Example:**

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` "**Bold Text**" "*Italic Text*" "~~StrikeThrough~~" "My name is: **" [FirstName] "**" " " "*" [LastName] "*" ``` |
```

will be rendered:

**Bold Text**

*Italic Text*

StrikeThrough

My name is: **John** *Doe*

|  |  |
| --- | --- |
|  | For a complete overview of Markdown’s syntax, see [here](https://daringfireball.net/projects/markdown/syntax). |

|  |  |
| --- | --- |
|  | Only Markdown is interpreted inside of Expressions. HTML is and was never supported. |

### Grammar

To sum up, the whole grammar of Expression language is written in [ANTLR](https://www.antlr.org/) format as below
(actually the Expression lexer and parser are created by the ANTLR library based on this declaration):

Grammar.g4

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 ``` | ``` grammar Expression;  program 	: element* EOF 	;  element 	: tokenElement 	| valueElement 	| operationElement 	;  tokenElement 	: NEWPARAGRAPH 	| NEWLINE 	;  valueElement 	: stringValue 	| fieldValue 	| multilingualValue 	;  stringValue: QUOTE_STRING;  fieldValue: '[' fieldName ']';  operationElement 	: groupOperation 	| caseOperation 	;  groupOperation: 'kontext' '(' fieldName delimiterOption ')' '{' element+ '}';  delimiterOption: (',' 'delimiter' '=' stringValue)?;  caseOperation: 'case' fieldValue operator stringValue '{' element+ '}';  operator: '!=' | '=';  multilingualValue: '(' localizedTexts ')';  localizedTexts: localizedText (',' localizedText)*;  localizedText: locale ':' stringValue;  locale: localeChar+;  localeChar     : CHAR     | DIGIT     | UNDERSCORE     ;  fieldName: fieldNameChar+;  fieldNameChar 	: CHAR 	| DIGIT 	| UNDERSCORE 	| DASH 	;  CHAR: [A-Za-z];  DIGIT: [0-9];  DASH: '-';  UNDERSCORE: '_';  QUOTE_STRING : '"' ( '\\"' | . | [\n\r\t] )*? '"';  NEWPARAGRAPH : '\n'([ \t]*'\n')([ \t]*'\n')+;  NEWLINE: '\n'[ \t]*'\n';  SKIPPED_WHITESPACE: [ \t\r\n] -> skip;  INVALID: . ; ``` |
```

## API Documentation

The complete API documentation can be found [here](https://geta12.com/docs/2025.06/ext5/expression/expression-docs/assets/generated/typedoc/index.html).

## Migration Instructions

### 2025.06

#### Breaking Changes

##### Migration to ESM

The npm artifact `@com.mgmtp.a12.expression/expression-core` was migrated
from CommonJS to [ESM](https://nodejs.org/api/esm.html#modules-ecmascript-modules).
When using Node `22.12+` and modern build tools, there should be no changes necessary to your bundler setup.

|  |  |
| --- | --- |
|  | If your tests depend on mocking/stubbing Expression API, consult the documentation of your test runner on how to work with ES modules. |

Migrating your own application to ESM is not required, but recommended. Consult the documentation of your bundler for specifics.

Some third-party libraries aren’t fully compatible, especially their TypeScript declaration files.
When integrating the new ESM version of Expression, this can lead to compiler errors.

Therefore, we offer some patches to overcome some issues with third-party libraries including:
[dompurify](https://www.npmjs.com/package/dompurify), and [antlr4](https://www.npmjs.com/package/antlr4).
Please consult the Widgets' Patch Instructions to learn how to apply them.

##### Updating to ES2024

The javascript output of the npm artifacts was updated from `ES2020` to `ES2024` to be able to use latest language features.
When using supported browsers, there is no change necessary. If support for older browsers is required, make sure to include necessary polyfills.

##### React 19 upgrade

We dropped the support for React 18 and older and now require React 19 as our peerDependency.
This means you have to perform the React 19 migration, which is described in great detail in the official
[React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide). They have codemods that should make the transition straightforward.
