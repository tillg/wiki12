---
source: https://geta12.com/docs/2025.06/ext5/transformer/transformer-documentation/index.html
category: transformer
docid: transformer-documentation
scraped: 2026-06-12
---

# Transformer

|  |  |
| --- | --- |
|  | This documentation belongs to an A12 Enterprise Component which is not part of the Open Source offering (A12 Community Edition). Please feel free to browse the documentation and learn more about how you can use this A12 component in your project. Learn more about the benefits from an A12 Enterprise Subscription on [the Editions & Licensing page](https://geta12.com/#/editions-licensing). |

## Introduction

The Transformer provides a Java library and a CLI tool to assist in the transformation between XMLs and A12 documents.

For this purpose, the Transformer offers the following functionalities:

* Transformation of **XML Schemas**, into **Document Models**.
* Transformation between **XMLs** and **A12 documents** based on **transformation models**.

### Terminology

| No | Term | Definition |
| --- | --- | --- |
| 1 | A12DocumentToXmlTransformer | A subcomponent of the Transformer that transforms A12 documents into XML documents. |
| 2 | Artifact | An artifact is any product, byproduct, or deliverable part of the software. For example a docker image, a npm, or a jar package/library. |
| 3 | Simple Model Editor (SME) | Simple Model Editor (SME) is the application used to prepare all the related models (Application, Form, Overview Models, and screens). |
| 4 | Transformer | The entire project and its subcomponents. |
| 5 | XML Schema Definition (XSD) | An XML Schema describes the structure of an XML document. |
| 6 | XmlSchemaValidator | A subcomponent of the Transformer that validates XML documents against XSDs. |
| 7 | XmlToA12Transformer | A subcomponent of the Transformer that transforms XML documents into A12 documents. |
| 8 | XsdToA12ModelTransformer | A subcomponent of the Transformer that transforms XSDs into Document Models. |

### Architecture

The Transformer’s architecture is composed of the following subcomponents, which are described in more detail in Chapter [Functionality](#_functionality).

1. **XsdToA12ModelTransformer**: A CLI tool that generates a Document Model based on XSD documents. To provide the generated
   model to the application, the CLI tool can be executed during the build time. For further information, refer to Section
   [XsdToA12ModelTransformer](#_model_transformer).
2. **A12DocumentToXmlTransformer**: A Java library that can be integrated into A12 applications to generate an XML document based on an A12
   document. This library is intended to be used at runtime. For further information, refer to Section [A12DocumentToXmlTransformer](#_document_transformer).
3. **XmlToA12Transformer**: A Java library that can be integrated into an A12 application to generate A12 documents from provided
   XML documents. This library must be executed during the runtime of the A12 application. For further information, refer to Section [XmlToA12Transformer](#_xml_transformer).
4. **XmlSchemaValidator**: A Java library that can be integrated into an A12 application to validate whether an XML document
   conforms to a provided XSD. For further information, refer to Section [XmlSchemaValidator](#_xmlSchemaValidator).

[Figure 1](#_architecture_figure) illustrates how the Transformer components are applied and interact with each other.

![transformer architecture overview](https://geta12.com/docs/2025.06/ext5/transformer/transformer-documentation/assets/transformer_architecture_overview.svg)

Figure 1. Transformer Architecture Overview

As shown in the figure, the Transformer can be used in different scenarios:

**Scenario 1**: An A12 application needs to import an *XML* and make it available as an *A12 document*:

* This is achieved by converting the *XSD* to which the *XML* conforms into a *Document Model*
  using the *XsdToA12ModelTransformer* during build time.
  Afterward, at runtime, the *XML* can be transformed into an *A12 document* that conforms to the generated *Document Model*.

**Scenario 2**: An A12 application needs to export data to an *XML* conforming to a specific *XSD*.

* First, the target *XSD* must be converted into a *Document Model* using the *XsdToA12ModelTransformer*. Next, the data to
  be exported must be made available as an *A12 document* that corresponds to the converted *Document Model*. This step is done
  by the client of the Transformer. Finally, the *A12 document* can be transformed into the target *XML* using the *A12DocumentToXmlTransformer*.

## Functionality

In this section the functionality of the Transformer components are described.

### XsdToA12ModelTransformer

#### Description

The XsdToA12ModelTransformer enables the transformation of XSDs into Document Models.
You can use the CLI tool to perform the transformation at build time or call the transformation API from your Java code at runtime.

#### Command Line Tool

The available commands of the CLI tool are described below:

* **check**: This mode is recommended to test if all features of the source XSDs are supported.
  Therefore, it creates a report stating which features are not supported.
  In addition, it will generate a Document Model based on the supported XSD features which could be seen as a preview
  Document Model.
* **generate-model**: In contrast to **check**, this mode just generates a Document Model without an unsupported feature report.
  It will fail, if features of the source XSDs are not supported.
* **get-config-model**: This mode generates the transformer configuration model template to help users prepare their transformation configuration files.
  The generated model can be used with SME to create proper configuration files.

##### API

To transform XSDs into Document Models, the XsdToA12ModelTransformer the corresponding jar file must be executed using the following command:

check Mode

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` java -cp <transformer config jar> -jar <transformer cli application jar> \ check <parameter list> ``` |
```

generate-model Mode

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` java -cp <transformer config jar> -jar <transformer cli application jar> \ generate-model <parameter list> ``` |
```

get-config-model Mode

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` java -jar <transformer cli application jar> \ get-config-model \ --output-dir <value> ``` |
```

##### Configuration

This section describes how to configure the XsdToA12Transformer and a tutorial on how to set up a Gradle task to utilize the XsdToA12ModelTransformer CLI tool.

|  |  |
| --- | --- |
|  | The configuration encompasses the following two aspects:  * **Configuration parameters**: Single value parameters that can be specified through the CLI as well as in the config file.   See setting *Cmd* described in section [Configuration Settings](#_xsdtoa12modeltransformer_configuration_settings). * **Configuration settings**: Complex possibilities to configure the transformer.   Can only be specified in the config file, not in the CLI.   These configuration settings are **NOT** applicable to command `get-config-model`. |

###### Configuration Parameters

The tables below list the available configuration parameters for each command.

**Configuration Parameters for `check` and `generate-model`**

For each parameter, the table shows the CLI argument, the corresponding specifier to be used in the config file,
a short description, and whether the parameter is required when running the XsdToA12ModelTransformer or not.

|  |  |
| --- | --- |
|  | If a parameter is specified through the CLI as well as in the config file, the CLI value is used. |

|  |  |  |  |
| --- | --- | --- | --- |
| CLI Parameter | Config File Parameter | Description | Required |
| `--xsd-dir` | `xsdDir` | The path to the directory containing the input XSDs for the transformation. | yes |
| `--output-dir` | `outputDir` | The directory to store the output Document Model. | yes |
| `--main-xsd` | `mainXsd` | Name of the main XSD file in the XSD directory. | yes - *must be specified in the config file, but can be overridden by the CLI argument!* |
| `--root-element` | `rootElement` | Name of the root element in the main XSD. | yes - *must be specified in the config file, but can be overridden by the CLI argument* |
| `--roles` | `roles` | Set of roles to be used in the generated Document Model. | yes |
| `--gen-doc-model-name` | `genDocModelName` | Name of the generated Document Model. | yes |
| `--transform-config` | *Can not be specified in the config file!* | A path to a configuration file that includes the **configuration settings**. The value can be either a path in the local filesystem, or a relative path inside the application’s classpath. The configuration settings are further described in subsection [Configuration Settings](#_xsdtoa12modeltransformer_configuration_settings). | no |
| `--allow-remote-xsd` | `allowRemoteXsd` | Allows downloading referenced XSDs from the internet. If this flag is not enabled, it will not be possible to validate or process XSD files that import or include other XSDs via remote URLs. | no |
| `--cl-xmls-dir` | `clXmlsDir` | The directory containing XML code lists. These files follow the XSD genericode specification and are referenced in the transformed XSDs. Currently, the XsdToA12ModelTransformer can only process xoev-specific code lists. | no |
| `--minimal` | `minimal` | A flag; if true, a model without extra annotations is generated. | no |
| `--external-type-defs` | `externalTypeDefs` | Allow external type definitions. | no |
| `--all-root-elements` | *Can not be specified in the config file!* | Activates the [Root Element Batch Transformation](#_root_element_batch_transformation). | no |
| `--skip-consistency-check` | `skipConsistencyCheck` | Skip consistency check and force Document Model creation even when A12 Kernel consistency issues are present. When set, a warning notification is logged, and the model is generated regardless of consistency errors. | no |
| `--verbose` | *Can not be specified in the config file!* | Enables detailed logging output (DEBUG log level) | no |

Root Element Batch Transformation

If the `--all-root-elements` configuration parameter is specified, all root elements defined in `main-xsd` are used for the transformation.
For each root element, a separate Document Model is generated.
The models are named using the following pattern: `<gen-doc-model-name>_<root-element-name>.json`.
In this case parameter `--root-element` is ignored.

|  |  |
| --- | --- |
|  | The term *root element* refers to all `<xs:element>` definitions directly one level below the `<xs:schema>` element of an XSD. |

**Configuration Parameters for `get-config-model`**

| Parameter | Description | Required |
| --- | --- | --- |
| `--output-dir` | The directory where the transformer configuration model template will be generated. This template can be used with SME to create proper transformation configuration files. | yes |

###### Configuration Settings

The configuration settings are specified in the config file passed through the `--transform-config` CLI argument.

The configuration file passed as the `transformConfig` contains additional information required for the transformation between
XSDs and Document Models.

The configuration file matches the A12 Model format as follows:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` {   "header": {     "id": "<Your chosen model id>",     "modelType": "transformer"   },   "content": {     ...   } } ``` |
```

**Header Attributes**

| Attribute | Description | Required |
| --- | --- | --- |
| `id` | The transformation configuration model id. | yes |
| `modelType` | Must be set to "transformer". | yes |
| `modelVersion` | Must be set to the transformer lib version | yes |
| `locales` | List of locales to be used in the transformed Document Models. | no |
| `labels` | List of labels to be used in the transformed Document Models. | no |
| `annotations` | List of annotations to be used in the transformed Document Models.  You can configure roles by adding an annotation with key `roles` and a comma-separated list of roles as the value. | no |

|  |  |
| --- | --- |
|  | The attributes `locales`, `labels`, and `annotations` are copied from the transformer config header to the header of the transformed Document Model. If you specify the `roles` annotation in the transformer config header, it will be overridden by roles specified via the CLI arguments or in the `Cmd` section of the `content`. |

**Content Attributes**

| Setting | Description |
| --- | --- |
| `TypeMapping` | Maps XSD types to Document Model field types (e.g., "string" to "StringType", "boolean" to "BooleanType"). See [[\_supported\_type\_mappings\_]](#_supported_type_mappings_) for supported mappings.  - For advanced customization of field type properties beyond simple type mapping, see [[\_overriding\_default\_type\_mapping\_behavior]](#_overriding_default_type_mapping_behavior). |
| `CodeLists` | Configuration for handling code lists in the XSDs. The following aspects can be configured:  - *CodeIdentifiers* = List of ColumnIds. Determines the columns in code list XML files, whose values are transformed to Enum values.  - *ValueIdentifiersDe* = List of ColumnIds. Determines the columns in code list XML files, whose values are transformed to german Enum labels.  - *ValueIdentifiersEn* = List of ColumnIds. Determines the columns in code list XML files, whose values are transformed to english Enum labels.  - *ElementNamesInXsd* = Name of the XSD element that contains the actual code value. This element is contained in the Complex Type that represents the code type.  - *UriVersionList* = Map defines which default version Ids to be used for which code list URIs. These default Ids are only applied if no version Id is specified for a code list complex type. |
| `DeletePaths` | List of Document Model paths that should not be contained in the transformed Document Model. The paths can point to either fields or groups. |
| `Configuration` | Allows to specify  - the configurations `version` and  - the `timeZone` used in the generated Document Models, and  - the `supportedCharactersTypeInXsd` **or** `supportedCharacters` to define the set of supported characters for string field  validation.  See [[\_supported\_characters\_configuration\_]](#_supported_characters_configuration_). |
| `PatternErrors` | List of patterns and corresponding locale-based error messages.  + **Two mapping strategies are supported:**  + 1. **Pattern Name Mapping**: Use XS pattern enum names (e.g., `XS_ANY_URI_PATTERN`, `XS_G_YEAR`)  + 2. **Regex Pattern Mapping**: Use the actual regex pattern string (e.g., `\\d{14}`, `-?([0-9]{4,})…​`)  + Both can be used simultaneously; regex-based messages override pattern name-based messages for the same locale.  + Error messages are provided via `errors`: an array of objects `{ "locale": "<lang>", "text": "<message>" }` (e.g. `de`, `en`).  + **Available pattern names for XS types**: `XS_NC_NAME`, `XS_G_YEAR_MONTH`, `XS_G_YEAR`, `XS_G_MONTH_DAY`, `XS_G_DAY`, `XS_G_MONTH`, `XS_LANGUAGE`, `XS_ANY_URI_PATTERN`  *If you don’t configure the localized error for any languages, the error label would fall back to the default German error text of that error.* |
| `EnumLabels` | Configuration to override enumeration labels of EnumValues instances using locale-based replacements;  + Each entry contains:  + `value`: the value of an EnumValue instance whose label must be overridden  + `replacements`: an array of objects `{ "locale": "<lang>", "text": "<label>" }` forming the final label set.  *If you don’t configure the localized label for any languages, the label would fall back to the value of the enum.*  *If you only configure the label for a subset of languages, the other languages would fall back to the label value of `de`.*  - `typeDefinitionId`: (optional) allows to restrict the label replacement to a specific EnumerationType by providing its typeDefinitionId  - `enumFieldPath`: (optional) allows to restrict the label replacement to a specific EnumerationType by providing its enumFieldPath  *`typeDefinitionId` and `enumFieldPath` can NOT be specified simultaneously!*  *When neither `typeDefinitionId` nor `enumFieldPath` is specified for a label replacement entry, the replacement applies to all matching enumeration labels.*  *If multiple `EnumLabels` entries match the same enum value, only the first one (lowest index in the configuration array) is applied.* |
| `Cmd` | Specify configuration parameters, see section [Configuration Parameters](#_xsdtoa12modeltransformer_input_parameters) for the available parameter list. |
| `RenamePaths` | Allows to rename the name of elements in the transformed Document Model; A single renaming entry contains the following properties:  - `OriginalPath` = original path to the element whose name must be renamed  - `NewElementName` = new name of the element  *Note: The original name is added as an annotation to the renamed element!* |

The configuration settings are specified as an A12 document, thus, it can be managed using the SME.
Because this file contains significant information for the transformation process, it must be maintained in collaboration with the Transformer team.

|  |  |  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | The Document Model has length restriction on their field and group names, described as follows:   | Type | Maximum length (characters) | | --- | --- | | Group name | 60 | | Field name | 200 | | Validation Rule Name | 100 |   If your XSD element name exceeds those limits, the transformer `check` command will throw an error. To resolve this issue, you can rename the affected element using the `RenamePaths` configuration.  ``` |  |  | | --- | --- | | ``` 1 2 3 4 5 6 7 8 ``` | ``` {     "RenamePaths": [         {           "OriginalPath": "/a12Root/LongXSDElementNameWhichHas60Characters",           "NewElementName": "ShortenedElementName"         }     ] } ``` | ``` |

An example configuration file is shown below:

```
|  |  |
| --- | --- |
| ```   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49  50  51  52  53  54  55  56  57  58  59  60  61  62  63  64  65  66  67  68  69  70  71  72  73  74  75  76  77  78  79  80  81  82  83  84  85  86  87  88  89  90  91  92  93  94  95  96  97  98  99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127 128 129 130 131 132 133 134 135 136 137 138 139 140 141 142 143 144 145 146 147 ``` | ``` {   "header": {     "id": "TransformationConfiguration",     "modelType": "transformer"   },   "content": {     "TypeMapping": [       { "xsdType": "anyType", "a12Type": "StringType" }     ],     "CodeLists": {       "CodeIdentifiers": [         //corresponds to `<Column Id="enumValues" ...>` defined in the code list xml         { "value": "enumValues" }       ],       "ValueIdentifiersDe": [         //corresponds to `<Column Id="germanEnumLabels" ...>` defined in the code list xml         { "value": "germanEnumLabels" }       ],       "ValueIdentifiersEn": [         //corresponds to `<Column Id="englishEnumLabels" ...>` defined in the code list xml         { "value": "englishEnumLabels" }       ],       "ElementNamesInXsd": [         // corresponds to `<xs:element name="codeElementName" .../>` defined in the code complexType         { "value": "codeElementName" }       ],       "UriVersionList": [         {           /* if in the code complexType the attribute listVersionID is not set for the given code list URI, then version "2023-12" is used */           "uri": "urn:xoev-de:xnachweis:codeliste:sprachen-iso-639-1",           "version": "2023-12"         }       ]     },     "DeletePaths": [         //paths pointing to groups and fields that would be initially generated based on the input XSDs but are deleted in the final Document Model         {           "path": "/path/to/FieldToBeDeleted"         },         {           "path": "/path/to/GroupToBeDeleted"         }     ],     "RenamePaths": [         {           // performs renaming element "/some/path/OriginalElementName" to "/some/path/SomeNewElementName"           "OriginalPath": "/some/path/OriginalElementName",           "NewElementName": "SomeNewElementName"         }     ],     "Configuration": {       // version of the configuration file       "version": "15.12.2024",       // used as the time zone of the generated Document Models       "timeZone": "UTC",        // Supported Characters Configuration       // Option 1: Reference an XSD simple type that contains a pattern facet       // The transformer will search for this type in the main XSD and all included schemas       "supportedCharactersTypeInXsd": "datatypeC"        // Option 2: Directly specify a regex pattern (uncomment to use instead of Option 1)       // "supportedCharacters": "[a-zA-Z0-9\\s]"        // Note: If both are specified, the transformation will fail with the error message: _"Both **supportedCharacters** and       // **supportedCharactersTypeInXsd** were provided. Exactly one of them must be set."_     },     "PatternErrors": [       {         // Regex Pattern Mapping: corresponds to `<xs:pattern value="\\d{14}"/>`         "pattern": "\\d{14}",         "errors": [           { "locale": "de", "text": "Bitte geben Sie einen validen Leika-Schlüssel ein." },           { "locale": "en", "text": "Please enter a valid Leika key." }         ]       },       {         // Pattern Name Mapping: for xs:gYear type         "pattern": "XS_G_YEAR",         "errors": [           { "locale": "de", "text": "Bitte geben Sie ein gültiges Jahr ein (Format: YYYY)." },           { "locale": "en", "text": "Please enter a valid year (format: YYYY)." }         ]       },       {         // Pattern Name Mapping: for xs:anyURI type         "pattern": "XS_ANY_URI_PATTERN",         "errors": [           { "locale": "de", "text": "Bitte geben Sie eine gültige URI ein." },           { "locale": "en", "text": "Please enter a valid URI." }         ]       }     ],     "EnumLabels": [         /*         This results in the following EnumerationType change in the transformed Document Model         for all EnumerationValues with value "exampleEnumValue":         "EnumerationType": {"values": [{                 "value": "exampleEnumValue",                 "label": [                   {"locale": "de", "text": "Neues Enum Label"},                   {"locale": "en", "text": "New Enum Label"}                 ]         }]}          */         {           "value": "exampleEnumValue",           "replacements": [             { "locale": "de", "text": "Neues Enum Label" },             { "locale": "en", "text": "New Enum Label" }           ]         },         // this will only replace the labels for the EnumerationValue "enumValueRenamedByEnumFieldPath"         // in the EnumerationType located at "/path/to/EnumerationType/enumField"         {           "value": "enumValueRenamedByEnumFieldPath",           "replacement": [             { "locale": "de", "text": "Neues Enum Label" },             { "locale": "en", "text": "New Enum Label" }           ],           "enumFieldPath": "/path/to/EnumerationType/enumField"         },         // this will only replace the labels for the EnumerationValue "enumValueRenamedByTypeDefinitionId"         // in the EnumerationType with the typeDefinitionId "urn_de_fim_codeliste_dokumenttyp_4_0"         {           "value": "enumValueRenamedByTypeDefinitionId",           "replacement": [             { "locale": "de", "text": "Neues Enum Label" },             { "locale": "en", "text": "New Enum Label" }           ],           "typeDefinitionId": "urn_de_fim_codeliste_dokumenttyp_4_0"         }     ],     "Cmd": {         "xsdDir": "path/to/xsdDir",         "outputDir": "path/to/output",         "allowRemoteXsd": true,         "clXmlsDir": "path/to/clXmlsDir",         "mainXsd": "example_main_xsd",         "rootElement": "ExampleRootElement",         "minimal": true,         "roles": "admin, freigebendestelle, redakteur, pruefer",         "genDocModelName": "example_document_model",         "externalTypeDefs": true     }   } } ``` |
```

**Supported Type Mappings**

Supported type mappings between XSD types and Document Model field types for use in transformation configuration files.

| Document Model Field Type | Supported XSD Type |
| --- | --- |
| DateType | xs:date |
| TimeType | xs:time |
| DateTimeType | xs:dateTime |
| EnumerationType | xs:string |
| NumberType | xs:decimal, xs:integer, xs:long, xs:int, xs:short, xs:byte, xs:nonNegativeInteger, xs:positiveInteger, xs:nonPositiveInteger, xs:negativeInteger, xs:unsignedLong, xs:unsignedInt, xs:unsignedShort, xs:unsignedByte, xs:float, xs:double |
| StringType | xs:string, |
| StringWithXsPatternType | xs:gYearMonth, xs:gYear, xs:gMonthDay, xs:gDay, xs:gMonth, xs:anyURI, xs:ID, xs:IDREF, xs:language |
| BooleanType | xs:boolean |
| EnumForBooleanType | No restriction. |
| EnumForStringType | Any type with a custom pattern. |
| ConfirmType | No restriction. |

**Supported Characters Configuration**

Two configuration options are available:

1. **`supportedCharactersTypeInXsd`**: Specify the name of an XSD simple type that contains a pattern facet.
   The transformer will extract the pattern from this type and generate the list of supported characters.
   This type can be defined in the main XSD or in any included XSD schema via `<xs:include>`.
2. **`supportedCharacters`**: Directly provide a regex pattern string.
   The transformer will match all characters in the Basic Multilingual Plane (BMP) against this pattern to generate the list of supported characters.

|  |  |
| --- | --- |
|  | If both are provided, the transformation will fail with the error message: *"Both **supportedCharacters** and **supportedCharactersTypeInXsd** were provided. Exactly one of them must be set."* |

**Usage Notes**:

* The specified simple type must contain a `<xs:pattern>` facet in its restriction.
* The transformer searches recursively through all included schemas to find the specified type.

**Example with `supportedCharactersTypeInXsd`**:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` {   "Configuration": {     "version": "15.12.2024",     "timeZone": "UTC",     "supportedCharactersTypeInXsd": "datatypeC"   } } ``` |
```

This will search for a simple type named `datatypeC` in the main XSD and all included schemas, extract its pattern, and generate the supported characters list.

**Example with `supportedCharacters`**:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` {   "Configuration": {     "version": "15.12.2024",     "timeZone": "UTC",     "supportedCharacters": "[a-zA-Z0-9\\s]"   } } ``` |
```

This will directly use the provided regex pattern to generate the list of supported characters (letters, digits, and whitespace).

**Overriding Default Type Mapping Behavior**

Beyond simple type mapping, you can customize the field type properties for each XSD type mapping.
This allows precise control over how XSD types are transformed into Document Model field types.

For each Document Model field type, you can specify nested configuration objects with type-specific properties:

| Document Model Field Type | Supported Properties |
| --- | --- |
| StringType | `pattern`, `minLength`, `maxLength`, `lineBreaksPermitted`, `alphabeticalSorting` |
| NumberType | `minValue`, `maxValue`, `minFractionalDigits`, `maxFractionalDigits`, `minIntegerDigits`, `maxIntegerDigits`, `leadingZerosAllowed`, `positivesOnly`, `zeroNotAllowed`, `trait` |
| EnumerationType | `alphabeticalSorting` |

|  |  |  |  |
| --- | --- | --- | --- |
|  | Multiple Type Mappings With the Same XSD Type  If you define multiple `TypeMapping` entries with the same `xsdType`, only the **first matching entry** in the list will be applied. Subsequent entries with the same `xsdType` will be ignored.  Example:  ``` |  |  | | --- | --- | | ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` {   "TypeMapping": [     {       "xsdType": "string",       "a12Type": "StringType",       "StringType": {         "maxLength": 100       }     },     {       "xsdType": "string",     // This entry will be IGNORED       "a12Type": "StringType",       "StringType": {         "maxLength": 500       }     }   ] } ``` | ```  In this example, all XSD `string` types will be transformed with `maxLength: 100`. The second mapping is never applied because the first one already matches `xsdType: "string"`.  **Best Practice:** Ensure each `xsdType` appears only once in your `TypeMapping` list to avoid confusion. |

**Common Use Cases**

Use Case 1: Mapping xs:long to StringType With Pattern Validation

When an XSD type like `xs:long` needs to be mapped as a string with pattern validation (e.g., for phone numbers or IDs):

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` {   "xsdType": "long",   "a12Type": "StringType",   "StringType": {     "pattern": "[0-9]{1,19}",     "minLength": 1,     "maxLength": 19   } } ``` |
```

Use Case 2: Mapping Unsupported XSD Patterns to A12-Supported Patterns

When your XSD uses patterns that are not fully supported by A12, you can override them with supported equivalents:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` {   "xsdType": "CustomDatePattern",   "a12Type": "StringType",   "StringType": {     "pattern": "[0-9]{4}-[0-9]{2}-[0-9]{2}",     "minLength": 10,     "maxLength": 10   } } ``` |
```

Use Case 3: Percentage Values With Constraints

Define a percentage type with specific decimal precision and value range:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` {   "xsdType": "PercentageType",   "a12Type": "NumberType",   "NumberType": {     "minValue": 0,     "maxValue": 100,     "maxFractionalDigits": 2,     "positivesOnly": true   } } ``` |
```

**Additional Examples**

Basic StringType Override

Override line breaks permission for multi-line text types:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` {   "xsdType": "TextMitZeilenumbruechen",   "a12Type": "StringType",   "StringType": {     "lineBreaksPermitted": true   } } ``` |
```

Advanced StringType With Pattern and Length Constraints

Define a custom email type with pattern validation:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` {   "xsdType": "EmailType",   "a12Type": "StringType",   "StringType": {     "pattern": "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",     "minLength": 5,     "maxLength": 100,     "lineBreaksPermitted": false   } } ``` |
```

NumberType With Value Constraints

Define a price type with decimal precision and range:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` {   "xsdType": "PriceType",   "a12Type": "NumberType",   "NumberType": {     "minValue": 0,     "maxValue": 999999.99,     "minFractionalDigits": 2,     "maxFractionalDigits": 2,     "leadingZerosAllowed": false,     "positivesOnly": true   } } ``` |
```

EnumerationType With Sorting

Enable alphabetical sorting for enumeration values:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` {   "xsdType": "StatusEnum",   "a12Type": "EnumerationType",   "EnumerationType": {     "alphabeticalSorting": true   } } ``` |
```

Overriding Built-in XSD Types

You can override how built-in XSD types like `gYear` or `integer` are transformed:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` {   "xsdType": "gYear",   "a12Type": "StringType",   "StringType": {     "pattern": "[0-9]{4}",     "minLength": 4,     "maxLength": 4   } } ``` |
```

|  |  |
| --- | --- |
|  | When using type mapping overrides:  * The configuration object name must match the `a12Type` value (e.g., if `a12Type` is `"StringType"`, use `"StringType": { …​ }`) * All properties are optional - only specify the properties you want to customize * Properties not specified will use the transformer’s default behavior * Pattern strings must be properly escaped (use `\\` for backslash in JSON) * Numeric values (`minValue`, `maxValue`) can be integers or decimals depending on your requirements |

##### Set Up a Gradle Task for the XsdToA12ModelTransformer

To simplify the use of the XsdToA12ModelTransformer, the CLI tool execution can be implemented as a Gradle task.
A snippet of a `build.gradle` file configuring such a task is shown below:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 ``` | ``` configurations {     modelTransformer     configFiles }  dependencies {     modelTransformer "com.mgmtp.a12.transformer:transformer-xsdtomodel-cmd:<version>"     configFiles "com.mgmtp.a12.transformer:transformer-config:<version>" }  // define the paths where the input XSD files are located def xzufiXsdPath = "src/test/resources/multilayer/xzufi" def outputPath = layout.buildDirectory.dir('generated-models')  tasks.register('transformXzufiXsdToA12DocumentModel', JavaExec) {     group = 'xsd-to-a12-doc-model-transformer'     description = 'This task transforms the provided Xzufi XSDs to a Document Model'      dependsOn(         configurations.named('configFiles'), configurations.named('modelTransformer')     )     inputs.files(         configurations.modelTransformer, configurations.configFiles     )     inputs.dir("${xzufiXsdPath}/xsd")     inputs.dir("${xzufiXsdPath}/genericode")     outputs.dir("${outputPath.get().asFile.getPath()}/xzufi")     classpath(configurations.modelTransformer,             configurations.configFiles)      main "org.springframework.boot.loader.launch.JarLauncher"     args "check",             "--transform-config", "config/xzufi-config.json",             "--xsd-dir", "${xzufiXsdPath}/xsd",             "--cl-xmls-dir", "${xzufiXsdPath}/genericode",             "--output-dir", "${outputPath.get().asFile.getPath()}/xzufi",             "--main-xsd", "xzufi-transfer",             "--root-element", "leistung" }  tasks.register('getTransformerConfigModel', JavaExec) {     group = 'xsd-to-a12-doc-model-transformer'     description = 'This task generates the transformer configuration model template for use with SME'      dependsOn(         configurations.named('modelTransformer')     )     inputs.files(         configurations.modelTransformer     )     outputs.dir("${outputPath.get().asFile.getPath()}/config-model")     classpath(configurations.modelTransformer)      main "org.springframework.boot.loader.launch.JarLauncher"     args "get-config-model",             "--output-dir", "${outputPath.get().asFile.getPath()}/config-model" }  tasks.named('processResources') {     finalizedBy(tasks.named('transformXzufiXsdToA12DocumentModel')) } ``` |
```

#### Java API

The XsdToA12ModelTransformer can also be used programmatically via its Java API.

##### API

The Java interface for the XsdToA12ModelTransformer is defined as follows:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 ``` | ``` public interface IXmXsdToModelTransformer {    ...  	/** 	 * Transforms XSD schema to Document Model using in memory resources. 	 * 	 * @param transformationConfig the transformation configuration 	 * @param inputResources the input resources, including XSD schema, Codelist, etc. ({@link XmResourceType}) 	 * @param notificationConsumer the notification consumer 	 * 	 * @return the transformation result 	 */ 	XmResult transform( 			TransformerConfigModel transformationConfig, 			Collection<XmResource> inputResources, 			Consumer<RankedNotification> notificationConsumer 	);  	/** 	 * Transforms XSD schema to Document Model using in memory resources. 	 * 	 * @param transformationConfig JSON string of transformation config model 	 * @param inputResources the input resources, including XSD schema, Codelist, etc. ({@link XmResourceType}) 	 * @param notificationConsumer the notification consumer 	 * 	 * @return the transformation result 	 */ 	default XmResult transform( 			String transformationConfig, 			Collection<XmResource> inputResources, 			Consumer<RankedNotification> notificationConsumer 	) {     ...     } } ``` |
```

Parameters:

* `transformationConfig`: You can either provide the transformation configuration as a `TransformerConfigModel` instance or as a JSON string.
  Please find more details about the configuration in section [Configuration Settings](#_xsdtoa12modeltransformer_configuration_settings).
* `inputResources`: A collection of input resources, including XSD schemas and code lists files.
  Each resource is represented as an `XmResource` instance, which includes the resource type (`XmResourceType`) and the actual content as text.
* `notificationConsumer`: A consumer for handling notifications during the transformation process.

Return Value:

* `XmResult`: The result of the transformation, which includes the generated Document Model and JSON files for Type Definitions (Code List related) if any.

##### Example Usage

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 ``` | ``` import com.mgmtp.a12.transformer.xsdtodocm.XsdToModelTransformFactory;  public class Sample {     public static void main(String[] args) {         IXmXsdToModelTransformer transformer = new XsdToModelTransformFactory().createTransformer();         NotificationReceiver notificationReceiver = new NotificationReceiver();         String configJsonContent = """             {               "header": {                 "id": "TransformationConfiguration",                 "modelType": "transformer"               },               "content": {                 "EnumLabels": [],                 "Cmd": {                   "mainXsd": "sample",                   "rootElement": "rootElement",                   "genDocModelName": "sample",                   "roles": "admin"                 }               }             }             """;         String sampleXSDContent = """             <?xml version="1.0" encoding="UTF-8"?>             <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"                       elementFormDefault="qualified">                 <xs:element name="rootElement">                     <xs:complexType>                         <xs:sequence>                             <xs:element name="subElement" type="xs:string"/>                         </xs:sequence>                     </xs:complexType>                 </xs:element>             </xs:schema>             """;         List<XmResource> resources = List.of(XmResource.builder()                 .type(XmResourceType.XSD)                 .name("sample")                 .content(sampleXSDContent)             .build());          XmResult result = transformer.transform(configJsonContent, resources, notificationReceiver);     } } ``` |
```

#### XSD Discovery Feature

The XSD Discovery feature helps you understand your XSD schemas by extracting useful metadata about types, elements, and validation rules.
Use this feature when you need to explore a new XSD schema or prepare transformation configurations.

##### What Information Can You Discover?

The discovery feature extracts:

* **Type Information**: All simple types defined in your XSD with their names and base types
* **Root Elements**: All possible root elements you can use for transformation
* **Validation Patterns**: Regex patterns used for field validation with the fields they apply to
* **Element Paths**: Complete hierarchy of all elements in the generated model
* **Enumeration Values**: All enumeration values with their locations in the model

##### How to Use Discovery

Use the discovering transformer API to extract metadata from your XSD:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 ``` | ``` import com.mgmtp.a12.transformer.xsdtodocm.XsdToModelTransformFactory; import com.mgmtp.a12.transformer.xsdtodocm.IXmDiscoveringTransformer; import com.mgmtp.a12.transformer.xsdtodocm.XmResource; import com.mgmtp.a12.transformer.xsdtodocm.XmResourceType; import com.mgmtp.a12.transformer.xsdtodocm.XmDiscoveringResult; import com.mgmtp.a12.transformer.xsdtodocm.XmConfigInfo; import java.util.List;  // Create discovering transformer IXmDiscoveringTransformer transformer = new XsdToModelTransformFactory().createTransformerWithDiscovery();  // Prepare transformation configuration as JSON string String transformationConfig = """ {   "header": {     "id": "MyModelConfig",     "version": "1.0"   },   "content": {     "Cmd": {       "mainXsd": "schema.xsd",       "rootElement": "RootElement",       "roles": "admin",       "genDocModelName": "MyModel"     }   } } """;  // Prepare input resources (XSD files) List<XmResource> inputResources = List.of(     XmResource.builder()                 .type(XmResourceType.XSD)                 .name("sample")                 .content("sampleXSDContent")     .build() );  // Run discovery XmDiscoveringResult result = transformer.discover(transformationConfig, inputResources, notificationConsumer); XmConfigInfo configInfo = result.getConfigInfo();  // Now you can explore the discovered information ``` |
```

##### What Can You Do With Discovered Information?

###### Find Available Root Elements

If you’re not sure which root element to use:

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` List<String> rootElements = configInfo.getRootElements(); // Shows all valid root elements from your XSD ``` |
```

###### Explore Type Definitions

See all custom types and their default Document Model field type mappings:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` for (var type : configInfo.getSimpleTypes()) {     System.out.println("Type: " + type.getName());     System.out.println("  - Base type: " + type.getXsType());     System.out.println("  - Maps to: " + type.getDefaultMapping()); } ``` |
```

###### Find Validation Patterns

See which fields have regex validation and what patterns they use:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` for (var entry : configInfo.getPatternFields().entrySet()) {     System.out.println("Pattern: " + entry.getKey());     System.out.println("  - Used by fields: " + entry.getValue()); } ``` |
```

###### Browse Element Hierarchy

Get the complete list of all element paths in the generated model:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` for (String path : configInfo.getElementPaths()) {     System.out.println(path); } ``` |
```

###### List Enumeration Values

See all enumeration values and where they’re used:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` for (var entry : configInfo.getEnumValues().entrySet()) {     System.out.println("Value: " + entry.getKey());     System.out.println("  - Field path: " + entry.getValue().getFieldPaths()); } ``` |
```

##### Common Use Cases

Use XSD Discovery to:

* **Explore unfamiliar XSD schemas** before starting configuration
* **Generate configuration file templates** with valid type mappings
* **Document your schema structure** automatically
* **Validate configuration files** against actual schema structure
* **Build schema editors** with auto-completion support

##### Important Notes

* The `discover()` method is specifically designed to extract configuration metadata from your XSD schema
* Discovery automatically disables schema validation checks to extract as much metadata as possible, even from incomplete schemas
* If you don’t provide a valid root element, you’ll still get discovery results with the available root elements listed, but other discovery information will be limited
* Discovery is only available through the Java API via `IXmDiscoveringTransformer`, not through the CLI tool
* The discovering transformer returns `XmDiscoveringResult` which extends `XmResult` and includes the `configInfo` field

### A12DocumentToXmlTransformer

#### Description

The A12DocumentToXmlTransformer serves the purpose of transforming A12 documents into XML documents at runtime by providing a Java library.
Besides the transformation of whole A12 documents, it is possible to consider only document parts for the generation of the output XML.
This is further described in Section [Considering Only Sub-Models for Transformation](#_consider_sub_part_transformation).

#### API

To use the A12DocumentToXmlTransformer API, the following steps must be performed:

1. Instantiate a `DocumentXmlTransformConfig` object.
   The members of the class `DocumentXmlTransformConfig` and their usage are described in Section [Configuration](#_A12DocumentToXmlTransformer_configuration).
2. Instantiate an `IDocumentXmlTransform` object using the `DocumentXmlTransformFactory` and passing the `config` variable.
3. Perform the transformation by calling `IDocumentXmlTransform.transform()` and passing the input A12 document using a `java.io.Reader` object.
   Additionally, a `NotificationReceiver` instance must be passed to the call, allowing notifications generated by the transformer to be received and acted upon.
   It also requires a `Locale` object to localize error messages.
   The call to `IDocumentXmlTransform.transform()` returns the content of the transformed XML document as a String.
4. You can provide your own ResourceBundle for localization in any languages by create your own properties files.
   Below is an example of such a properties file:

resources/doc2xml/locale/message\_en.properties

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 ``` | ``` # Model reference errors error.model.not.used=Model ''{0}'' is not used in Document Model ''{1}'' error.model.deserialize.failed=Document Model cannot be deserialized: {0}  # State errors error.state.invalid=Invalid state: {0}  # Transformer errors error.transformer.secure.processing=The TransformerFactory does not support secure processing error.transformer.corrupt.xml=The created XML is corrupt  # Validation errors error.validation.failed=XML is not valid. See log file for more details: {0} error.xml.cannot.load=XML ''{0}'' cannot be loaded  # Transformation errors error.transformation.to.string.representation=Could not transform to String representation: {0}  # Renderer errors error.renderer.not.found=Factory cannot find renderer for type: {0}  # Document errors error.document.unknown.format=Unknown document format: {0}  # Info info.no.xsd.validation.performed=No xsd validation has been performed. ``` |
```

The following code snippet demonstrates the steps to use the A12DocumentToXmlTransformer library:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 ``` | ``` import com.mgmtp.a12.transformer.doctoxml.DocumentXmlTransformConfig; import com.mgmtp.a12.transformer.doctoxml.DocumentXmlTransformFactory; import com.mgmtp.a12.transformer.doctoxml.IDocumentXmlTransform; import java.io.Reader; import java.io.InputStreamReader; import com.mgmtp.a12.transformer.common.NotificationReceiver;  // Step 1: Setting up the transformer configuration DocumentXmlTransformConfig config  = DocumentXmlTransformConfig.builder() 				.modelsDir("xflb") 				.modelId("") 				.refModelId("XFLB-generated") 				.schemaPath("multilayer/xoev_xflb/xsd/xflb-foerderleistungen.xsd") 				.customRootPath("foerderleistungen.antwort.foerderleistung.000002/antwort/ergebnisFoerderleistung") 				.customRootType("xflb:Foerderleistungsbeschreibung") 				.skipValidation(skipValidation) 				.documentFormat(docFormat) 				.locale(Locale.GERMAN) 				.build();  // Step 2: Constructing an IDocumentXmlTransform instance IDocumentXmlTransform transformer = new DocumentXmlTransformFactory().createMultiLayerTransformer(config);  // Step 3: Performing the transformation Reader a12DocumentReader = new BufferedReader( 		new InputStreamReader( 				Thread.currentThread().getContextClassLoader().getResourceAsStream(path), 				StandardCharsets.UTF_8         ) ); String outputXML = transformer.transform(     a12DocumentReader,     new NotificationReceiver() ); ``` |
```

#### Configuration

The configuration of the transformation process from A12 documents to XML documents is done by instantiating and passing a
`DocumentXmlTransformConfig` object to the `IDocumentXmlTransform` instance.
The following members can be specified:

| Member | Description |
| --- | --- |
| `modelsDir` | Directory containing the main Document Model and further referenced models. |
| `modelId` | ID of the main model |
| `refModelId` | Specifies a sub-model wrapped by the main Document Model. In the transformation step, only the elements of this sub-model are used. This is further described in Section This is further described in Section [Considering Only Sub-Models for Transformation](#_consider_sub_part_transformation). |
| `documentFormat` | Format of the Document Model (JSON or XML). |
| `schemaPath` | Path to the XSD schema used to validate the output XML document. |
| `customRootPath` | XPath in the XSD against which the output XML is validated. |
| `customRootType` | Type of the specified `customRootPath` |
| `skipValidation` | Specifies whether the output XML document should be validated against the provided XSD. |
| `locale` | Locale used for localization of error messages. |

#### Considering Only Sub-Models for Transformation

![sub model referencing](https://geta12.com/docs/2025.06/ext5/transformer/transformer-documentation/assets/sub_model_referencing.svg)

Figure 2. Example Transformation Scenario in Pseudocode

Besides transforming entire A12 documents, it is possible to convert only parts of them to XML.
[Figure 2](#_sub_model_referencing_figure) depicts an example scenario containing Document Models and an A12 document shown in pseudocode.
In this scenario, a **Main Document Model** exists, which references a **Sub Document Model**.
The transformer’s input is a **A12 document** corresponding to the **Main Document Model**.
However, the requirement in this scenario is to generate XML based solely on the **address** contained in the document that corresponds to the **Sub Document Model**.
To achieve this, a reference to the **Sub Document Model** is passed as the *refModelId* to the **A12DocumentToXmlTransformer**,
together with the **Main Document Model** as the *modelId*.
Therefore, the transformer only considers the **address** element of the input **A12 document** when generating the output **XML**.

### XmlToA12Transformer

#### Description

The XmlToA12Transformer component allows the transformation of XML documents into A12 documents at runtime by providing a Java library.

#### API

To use the XmlToA12Transformer API, the following steps must be performed:

* Instantiate an `IXdXmlDocumentTransform` object using the `XdXmlDocumentTransformFactory`
* Perform the transformation by calling `IXdXmlDocumentTransform.transform()`

##### Step 1: Instantiating the IXdXmlDocumentTransform

Instantiate an `IXdXmlDocumentTransform` object using the `XdXmlDocumentTransformFactory` and passing the following
parameters:

* `modelPath`: Path to the directory containing the main Document Model and further referenced Document Models.
* `minimalModelPath`: Path to a so-called minimal Document Model, which does not contain additional annotations, in contrast to the model located in `modelPath`.
  This minimal model is used for validation of the output A12 document.
* `modelId`: ID of the main Document Model.
  In both directories `modelPath` and `minimalModelPath` a model must be contained with this ID.
* `locale` (optional): Locale used for localization of info/error messages.
  If not specified, the default locale is used (`Locale
  .ENGLISH`).

  + You can provide your own ResourceBundle for localization in any languages by create your own properties files.
    Below is an example of such a properties file:

resources/xml2doc/locale/message\_en.properties

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 ``` | ``` error.model.deserialize.failed=Document Model cannot be deserialized: {0} error.unknown.field.type=Encountered unknown field data type '{0}' error.validation.invalid=Document is not valid error.field.not.found.cannot.convert=Field '{0}' was not found, therefore the value cannot be converted. error.ifield.group.not.found=No iField was found matching the multi/single select group {0} error.no.resource.available=No resource available at path: {0} error.invalid.params=The given parameters are not valid. error.null.pointer={0} must not be null.  info.validation.not.performed=No document validation has been done info.validation.valid=Document is valid ``` |
```

##### Step 2: Performing the Transformation

Perform the transformation by calling `IXdXmlDocumentTransform.transform()` and passing the following parameters:

* `xmlReader`: The input XML document, passed as a `java.io.Reader` object.
* `validate`: A flag specifying if the output A12 document should be validated against the previously configured Document Model.
* `notificationConsumer`: A `java.util.function.Consumer` instance to handle notifications that occur during the transformation process.

The following code snippet demonstrates the steps to use the XmlToA12Transformer library:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 ``` | ``` import java.util.ArrayList; import com.mgmtp.a12.transformer.xmltodoc.IXdXmlDocumentTransform; import com.mgmtp.a12.transformer.xmltodoc.XdXmlDocumentTransformFactory; import java.io.Reader; import java.io.BufferedReader; import java.io.InputStreamReader; import java.io.FileInputStream; import java.nio.charset.StandardCharsets; import com.mgmtp.a12.model.notification.RankedNotification; import java.util.Collection; import java.util.function.Consumer; import com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2; import com.mgmtp.a12.model.notification.Severity;  // Step 1: Constructing the IXdXmlDocumentTransform instance String modelPath = "xflb"; String minimalModelPath = "xflb_minimal"; String modelId = "XFLB_DM"; IXdXmlDocumentTransform transformer = new XdXmlDocumentTransformFactory()     .createTransformer(         modelPath,         minimalModelPath,         modelId,         Locale.GERMAN     );  // Step 2: Performing the transformation Reader inputXmlReader = new BufferedReader(     new InputStreamReader(         new FileInputStream("xflb.xml"),         StandardCharsets.UTF_8     ) ); Collection<RankedNotification> transformationNotifications = new ArrayList<>(); Consumer<RankedNotification> notificationConsumer = transformationNotifications::add; DocumentV2 doc = transformer.transform(     inputXmlReader,     true,     notificationConsumer );  if (transformationNotifications.stream()     .anyMatch(notification -> Severity.ERROR.equals(notification.getSeverity()))) {     // react to transformation errors } ``` |
```

### XmlSchemaValidator

#### Description

The XmlSchemaValidator allows validation of an XML document against a provided XSD.

#### API

To use the XmlSchemaValidator API, the following steps must be performed:

1. Using the `XmlValidatorFactory`, instantiate an `IXmlValidator` object.
   A path to the XSD used for validation is passed as a parameter during instantiation.
2. Perform the validation of an XML document by executing `IXmlValidator.validate()` and passing the XML document, as a `Reader`
   or `InputStream`, to be validated.
   A specific XML path can be specified to restrict validation to a subset of the XML content, and a `Locale` to localize error messages to the specified language.

If you don’t provide a Locale, `Locale.ENGLISH` is used default.

You can provide your own ResourceBundle for localization in any languages by create your own properties files. Below is an example of such a properties file:

resources/xmlschemavalidator/locale/message\_en.properties

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` error.root.path.missing=For partial validation the path must be present in the XML: {0} error.sax.secure.processing=SAXParserFactory implementation does not support secure processing error.path.invalid=Invalid path ''{0}'' ``` |
```

The call to `IXmlValidator.validate()` returns an `XmlValidationResult` object, which contains data about the validation result.
For example, the method `XmlValidationResult.ok()` returns whether the provided XML document conforms to the XSD.

The following code snippet demonstrates the utilization of the XmlSchemaValidator:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 ``` | ``` import com.mgmtp.a12.transformer.schemavalidator.IXmlValidator; import com.mgmtp.a12.transformer.schemavalidator.XmlValidatorFactory; import java.io.InputStreamReader; import java.io.Reader; import java.io.FileInputStream; import java.nio.charset.StandardCharsets; import java.util.Locale; import com.mgmtp.a12.transformer.schemavalidator.XmlValidationResult;  // Step 1: Constructing a validator instance and passing the XSD used for validation String xsdPath = "path/to/example.xsd"; IXmlValidator iXmlValidator = XmlValidatorFactory.getValidator(xsdPath);  // Step 2: Reading and validating an XML document Reader xmlInputReader = new InputStreamReader(     new FileInputStream("path/to/input.xml"),     StandardCharsets.UTF_8 ); XmlValidationResult xmlValidationResult = iXmlValidator.validate(xmlInputReader, Locale.GERMAN);   if (xmlValidationResult.ok()) {     // Continue if the XML is valid } ``` |
```

## Deployment & Configuration

### Artifacts

To utilize the Transformer components, the following Gradle dependency statements must be added to the application’s `build.gradle` file:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` dependencies {     // XsdToA12ModelTransformer dependency     implementation("com.mgmtp.a12.transformer:transformer-xsdtomodel-cmd:<version>")      // A12DocumentToXmlTransformer dependency     implementation("com.mgmtp.a12.transformer:transformer-doctoxml:<version>")      // XmlToA12Transformer dependency     implementation("com.mgmtp.a12.transformer:transformer-xmltodoc:<version>") } ``` |
```

## API Documentation

### JavaDoc

* [Transformer javadoc](https://geta12.com/docs/2025.06/ext5/transformer/transformer-documentation/assets/javadoc/index.html)

## Migration Instructions

### 2025.06-ext.4

Version: 2.1.0

#### Breaking Changes

##### Extended Support for XSD Numeric Types

The XsdToA12ModelTransformer now supports all XSD numeric types, including `xs:float` and `xs:double`.
This extends support to all numeric types.

**Supported Numeric Types:**

All XSD numeric types are now supported: `xs:decimal`, `xs:integer`, `xs:long`, `xs:int`, `xs:short`, `xs:byte`, `xs:nonNegativeInteger`, `xs:positiveInteger`, `xs:nonPositiveInteger`, `xs:negativeInteger`, `xs:unsignedLong`, `xs:unsignedInt`, `xs:unsignedShort`, `xs:unsignedByte`, `xs:float`, and `xs:double`.

##### Enhanced TypeMapping Configuration With Additional Field Type Properties

The `TypeMapping` configuration has been significantly enhanced to allow users to override default type mappings with complete control over field type properties.

###### What Changed

Previously, `TypeMapping` only supported basic overrides:

* `stringLineBreaksPermitted` - a boolean flag for StringType
* `enumerationAlphabeticalSorting` - a boolean flag for EnumerationType

Now, you can define complete field type configurations for:

* **StringType** - with properties like `pattern`, `minLength`, `maxLength`, `lineBreaksPermitted`, `alphabeticalSorting`, etc.
* **NumberType** - with properties like `minValue`, `maxValue`, `minFractionalDigits`, `maxFractionalDigits`, `leadingZerosAllowed`, `positivesOnly`, `zeroNotAllowed`, etc.
* **EnumerationType** - with properties like `alphabeticalSorting`

This allows you to customize the behavior of XSD types when they are mapped to Document Model field types, overriding default transformations.

Old Format (Deprecated)

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` {   "TypeMapping": [     {       "xsdType": "TextMitZeilenumbruechen",       "a12Type": "StringType",       "stringLineBreaksPermitted": true     },     {       "xsdType": "StatusEnum",       "a12Type": "EnumerationType",       "enumerationAlphabeticalSorting": true     }   ] } ``` |
```

New Format (Required)

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` {   "TypeMapping": [     {       "xsdType": "TextMitZeilenumbruechen",       "a12Type": "StringType",       "StringType": {         "lineBreaksPermitted": true       }     },     {       "xsdType": "StatusEnum",       "a12Type": "EnumerationType",       "EnumerationType": {         "alphabeticalSorting": true       }     }   ] } ``` |
```

###### Migration Steps

1. Locate all `TypeMapping` entries in your configuration files
2. Replace `stringLineBreaksPermitted` with `"StringType": { "lineBreaksPermitted": <value> }`
3. Replace `enumerationAlphabeticalSorting` with `"EnumerationType": { "alphabeticalSorting": <value> }`
4. Optionally, add additional field type properties as needed to customize the transformation behavior

##### Removing the Attribute Namespaces Out of the Transformation Configuration File

The attribute `Namespaces` has been removed out of the config file.
Now Transformer can automatically detect the declared namespaces within the schema and document files.
Now you **must** remove it before using Transformer.

##### PatternErrors and EnumLabels Locale-Based Format Migration

The configuration entries `PatternErrors` and `EnumLabels` have been updated to support multi-locale text values.
Previously, error messages and enumeration label replacements were provided using single string properties:

* `errorDE` / `errorEn` for pattern-based validation error messages
* `replacement` for enumeration label overrides

These are now replaced by locale-aware arrays for consistency with A12’s internationalization model:

* Pattern error messages use `errors`: an array of objects `{ "locale": "<lang>", "text": "<message>" }`
* Enumeration label overrides use `replacements`: an array of objects `{ "locale": "<lang>", "text": "<label>" }`

###### PatternErrors Configuration Changes

Old

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` {   "PatternErrors": [     {       "pattern": "\\d{14}",       "errorDE": "Bitte geben Sie einen validen Leika-Schlüssel ein.",       "errorEn": "Please enter a valid Leika key."     }   ] } ``` |
```

New

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` {   "PatternErrors": [     {       "pattern": "\\d{14}",       "errors": [         {           "locale": "de",           "text": "Bitte geben Sie einen validen Leika-Schlüssel ein."         },         {           "locale": "en",           "text": "Please enter a valid Leika key."         }       ]     }   ] } ``` |
```

###### EnumLabels Configuration Changes

Besides the change to locale-aware replacements, the property to specify the enum value has been renamed from `label` to `value`.

Old

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` {   "EnumLabels": [     {       "label": "exampleEnumValue",       "replacement": "Neues Enum Label"     }   ] } ``` |
```

New

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` {   "EnumLabels": [     {       "value": "exampleEnumValue",       "replacements": [         {           "locale": "de",           "text": "Neues Enum Label"         },         {           "locale": "en",           "text": "New Enum Label"         }       ]     }   ] } ``` |
```

###### Migration Steps

1. Replace `errorDE`/`errorEn` with an `errors` array of locale/text objects.
2. Replace string `replacement` values with an `replacements` array of locale/text objects.
3. Ensure each locale code matches the configuration document’s locales.
4. If only one locale existed previously (for example, `errorDE`), create an array with a single object.
5. Rename each occurrence of `label` to `value` in `EnumLabels`.
6. Validate the updated configuration using the transformer `check` command.

*Note*: Existing transformer behavior for other configuration sections remains unchanged.

##### Configuration Parameters mainXsd and rootElement Are Required in the Transformation Configuration of XsdToA12ModelTransformer

###### What Changed

In the transformation model, the parameters `mainXsd` and `rootElement` under the `Cmd` section are now mandatory.
If the transformation model missing these parameters is used with the XsdToA12ModelTransformer, the transformation will fail.

###### Migration Steps

The parameters `mainXsd` and `rootElement` must be added to the transformation configuration file under the `Cmd` section as shown below:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` {   "header": {...},   "content": {       "Cmd": {         "mainXsd": "example.xsd",         "rootElement": "exampleRootElement"       }   } } ``` |
```

#### Feature Changes

##### XSD Discovery API

A new optional discovery feature is available to extract metadata from XSD schemas (types, root elements, validation patterns, etc.)

###### What Changed

New factory method: `XsdToModelTransformFactory.createTransformerWithDiscovery()`

Results include schema metadata in: `XmDiscoveringResult.getConfigInfo()`

This is a new optional feature.
Your existing code continues to work without changes.

###### Example Usage

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` // Use discovery transformer instead of standard one IXmDiscoveringTransformer transformer = new XsdToModelTransformFactory().createTransformerWithDiscovery();  // Use discover() method to extract metadata XmDiscoveringResult result = transformer.discover(transformationConfig, inputResources, notificationConsumer);  // Access discovered metadata XmConfigInfo info = result.getConfigInfo(); if (info != null) {     List<String> rootElements = info.getRootElements();     Collection<XmConfigInfo.XmXsdSimpleType> types = info.getSimpleTypes(); } ``` |
```

For complete documentation, see the [XSD Discovery Feature](#_xsd_discovery_feature) section.

##### Localized Error Messages

Now, error messages are loaded from ResourceBundles on the classpath.
Supported languages: English (`en`, default), German (`de`), and any other you add.
If no locale is provided, English is used by default.

|  |  |
| --- | --- |
| Locale | Bundle file name (classpath) |
| English | `locale/{doc2xml|xml2doc|xmlschemavalidator}/message_en.properties` |
| German | `locale/{doc2xml|xml2doc|xmlschemavalidator}/message_de.properties` |

###### DocumentToXmlTransformer

When creating the `DocumentXmlTransformConfig`, specify the desired `Locale` as follows:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 ``` | ``` DocumentXmlTransformConfig config = DocumentXmlTransformConfig.builder() 				.modelsDir("...") 				.modelId("...") 				.refModelId("...") 				.schemaPath("...") 				.customRootPath("...") 				.customRootType("...") 				.skipValidation(skipValidation) 				.documentFormat(docFormat) 				.locale(Locale.GERMAN) 				.build(); ``` |
```

For complete documentation, see the [A12DocumentToXmlTransformer](#_document_transformer) section.

###### XmlToDocumentTransformer

`XdXmlDocumentTransformFactory.createTransformer(…​)` method now supports Locale parameter to localize transformation messages (default as `Locale.ENGLISH`)

For complete documentation, see the [XmlToA12Transformer](#_xml_transformer) section.

###### XmlSchemaValidator

`IXmlValidator.validate(…​)` methods now support Locale parameter to localize validation messages (default as `Locale.ENGLISH`)

For complete documentation, see the [XmlSchemaValidator](#_xmlSchemaValidator) section.

##### Enhanced Error Message Localization for XS Pattern Types

The error message handling for XSD built-in types (xs:ID, xs:anyURI, xs:gYear, etc.) has been enhanced to support more flexible configuration-based localization.

###### What Changed

Previously, validation error messages for standard XSD types with patterns (like `xs:gYear`, `xs:anyURI`, `xs:ID`) were hardcoded in German with a generic format.

Now, you can configure custom, localized error messages in two ways:

1. **By Pattern Name** - Using the enum constant name (e.g., `XS_ANY_URI_PATTERN`, `XS_G_YEAR`)
2. **By Regex Pattern** - Using the actual regex pattern string

Both approaches can be used simultaneously, and the system will merge them intelligently (regex-based messages override pattern name-based messages for the same locale).

###### Examples Configuration

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 ``` | ``` {   "PatternErrors": [     {       "pattern": "XS_G_YEAR",       "errors": [         {           "locale": "de",           "text": "Bitte geben Sie ein gültiges Jahr ein (Format: YYYY)"         },         {           "locale": "en",           "text": "Please enter a valid year (format: YYYY)"         }       ]     },     {       "pattern": "-?([0-9]{4,})(Z|[+-][0-9]{2}:[0-9]{2})?",       "errors": [         {           "locale": "de",           "text": "Jahr im Format YYYY mit optionaler Zeitzone eingeben"         },         {           "locale": "en",           "text": "Enter year in YYYY format with optional timezone"         }       ]     }   ] } ``` |
```

### 2025.06-ext.3

Version: 2.0.1

#### Renamed XFLB-Related Annotations in Converted Transformation Document Model

All XFLB prefixes have been replaced with XSD in the converted Transformation Document Model.
Please use our new command-line tool or library to regenerate Document Models from XSDs.

### 2025.06-ext.2

Version: 2.0.0

#### Transformation Configuration Model Migration

The Transformation Configuration Model has been updated to adapt to the A12 Model standard.
You need to migrate existing Transformation Configuration file to the new format.
The following changes have been made:

* **Old**

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 ``` | ``` {   "TypeMapping": [     {       "xsdType": "string",       "a12Type": "StringType"     }   ],   "Cmd": {     "mainXsd": "mainXsdName",     "rootElement": "RootElement",     "genDocModelName": "docModelName",     "roles": "admin"   } } ``` |
```

* **New**

Wrap the existing content in the `content` property and add a `header` property as shown below:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` {   "header": {     "id": "TransformationConfiguration",     "modelType": "transformer"   },   "content": {     "TypeMapping": [       {         "xsdType": "string",         "a12Type": "StringType"       }     ],     "Cmd": {       "mainXsd": "mainXsdName",       "rootElement": "RootElement",       "genDocModelName": "docModelName",       "roles": "admin"     }   } } ``` |
```
