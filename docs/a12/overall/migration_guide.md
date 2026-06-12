---
source: https://geta12.com/docs/2025.06/ext5/overall/migration_guide/index.html
category: overall
docid: migration_guide
scraped: 2026-06-12
---

# Migrating to Latest A12 Release Line

This documentation will help you to go through the migration process. It describes one of the ways to successfully migrate your project to the newest A12 version.

* The [Migration Guide](#migration_guide) explains the general process of how to upgrade models, server, and client in an A12 project.
* The [Automatic Source Code Refactoring](#automatic_refactoring) chapter (introduced in 2024.06) describes the usage of automatic code refactoring tooling to automatize some aspects of A12 migration process.
* The section [Migration to 2025.06](#migration_current) highlights the most important changes in 2025.06.
  It summarizes the usage of the automatic code refactoring tools and describes the steps, which are required for a successful migration to this overall version of A12.
* If something looks unclear, there are the [FAQs](#faqs).
* Feel free to discuss at [A12 Discourse → Migration Category](https://discourse.geta12.com/c/migration/26).

|  |  |
| --- | --- |
|  | Please share with us your experience, so we can improve this guide and make the migration easier. |

## Overview

A12 consists of many different components that are managed by different teams. This creates a rather complex dependency graph. Therefore, a good first step is to have a look at the different component dependencies. The following graph is based on the [Project Template](https://geta12.com/docs/PROJECT_TEMPLATE/project-template-documentation/index.html) dependencies and contains only a subset of A12 components.

![a12 components graph](https://geta12.com/docs/2025.06/ext5/overall/migration_guide/assets/a12-components-graph.png)

Figure 1. A12 components dependency overview graph

With this overview you should be able to easily identify the chain of necessary component updates that may occur by updating version of a single A12 component.

|  |  |
| --- | --- |
|  | Keep in mind that all artifacts of an A12 component need to have the same version. This especially applies for A12 components that have frontend and backend artifacts. To identify an A12 component with frontend and backend libraries, please have a look at the dependency overview graph. |

|  |  |
| --- | --- |
|  | Every artifact contains its component affiliation under the scope (@com.mgmtp.a12.<component\_name>) or group id (com.mgmtp.a12.<component\_name>). |

## Migration Guide

This guide aims to describe, how the overall migration can be done and assumes an upgrade of an A12 based project with server and client parts.

### Preparation

* Check the [Release Table](https://geta12.com/#/releases/releases-overview)

  + Find the A12 overall release, you want to upgrade to. The latest versions for each component are listed in the respective release line.
  + If you have to upgrade multiple A12 overall versions, we recommend upgrading one by one and not skipping over any major versions (minor and patch versions can be skipped).
    For example to upgrade from 2023.06 → 2025.06, it is necessary to migrate these versions: 2024.06 and 2025.06:

    - Check the release line 2024.06, apply all breaking changes and fix upcoming issues.
    - Check the release line 2025.06, apply all breaking changes and fix upcoming issues.

|  |  |
| --- | --- |
|  | Migration is only supported from versions that were released before your target version.  As a result, migration from 2024.06-ext8 (released on November 10th 2025) is not supported as the 2025.06-ext2 version was release on October 31st 2025. |

* To get more information about a specific A12 component, you can look into its documentation **Migration Instructions** section. Links to the migration instructions chapters for every component can be found in the [Links section](#component_links).
* For a successful project migration you need to update the following: models, server, and client.
  We recommend to start with model updates. The order of migration for frontend and backend parts does not matter.

### Model Migration

Every A12 model comes with its own model versions. These versions are bound to the overall A12 version. You need to update all models, which are used.
In the SME for 2025.06 you will not be able to open models with version 2024.06 and older. Proper model versions are listed in the release table mentioned above if you hover over the SME version in the release line.

|  |  |
| --- | --- |
|  | As new features are added and Model versions move forward the Simple Model Editor may not recognize the Model version and therefore block migration.  Manually rolling back the Model Version is not supported but is possible as long as new Modeling Features added in your current release are not used.  1. Check the [Release Table](https://geta12.com/#/releases/releases-overview) to find model versions for an older release in your current release line. 2. Manually change the Model Version. 3. Try to migrate the models using the target Simple Model Editor.  For example rolling Form Model Versions back from `37.2.1` to `37.2.0` will allow the models to be migrated from the 2024.06-ext8 release line to 2025.06-ext2. |

#### Tools

There are two options:

1. **SME** - distributed via the [A12 Installer](https://docs.geta12.com/installer/).

   * Install the version of the Modeling Environment which corresponds to the A12 version you want to upgrade to.
   * Consider creating a backup of your models before starting the migration.
   * Open the folder containing your models in the SME.
   * Error "Some models are not compatible with current SME version" is shown.
   * After clicking "Resolve all issues" and confirming the migration, all models will be updated.
   * Additionally, you should know about the [Migration Rules](https://geta12.com/docs/overall/preview_app/index.html#migration_rules) when migrating a modeling environment workspace.
2. **Command-Line Tools**

   * Each component responsible for models provides a command-line tool to upgrade its corresponding models.
   * All command-line tools can be downloaded from Artifactory. See the following overview of available migration tools with links, where you can find more information on how to use them.

| Model | CLI Migration Tool |
| --- | --- |
| Document Model | [Data Model Migration Tool](https://geta12.com/docs/kernel/kernel-documentation-dev/index.html#model_migration_tool) |
| Relationship Model | [Relationship Model Migration Tool](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#relationship-migration) |
| Form Model | [Form Model Migration Tool](https://geta12.com/docs/form_engine/formengine-documentation-bundle/index.html#%2Fmigration%2Fform-model) |
| Overview Model | [Overview Model Migration Tool](https://geta12.com/docs/overview_engine/overviewengine-dev-docs/index.html#_migration_tool) |
| Tree Model | [Tree Model Migration Tool](https://geta12.com/docs/tree_engine/treeengine-dev-docs/index.html#_model_migration_tool) |
| Application Model | [Application Model Migration Tool](https://geta12.com/docs/client/client-documentation-bundle/index.html#/migration/application-model) |
| Content Model | [Content Model Migration Tool](https://geta12.com/docs/content_engine/contentengine-dev-docs/index.html#/_content_model_migration) |
| Print Model | [Print Model Migration Tool](https://geta12.com/docs/print_engine/print-technical-documentation/index.html#/_migration_tool) |

#### After Model Migration

With a breaking release it may be possible that some modeling aspects (rules, computation…​) have been changed. You need to check the component release page and migration instructions to review particular changes.
See [Migration to latest A12 Overall Version](#migration_current) for actual information.

### Code Migration

After you have migrated your models, it is necessary to migrate the code base. In 2024.06 we introduced automatic source code refactoring for applying breaking changes in your code.
These cover changes on client-side as well as on server-side. In 2025.06 we enhanced this idea even more.
See [Automatic Source Code Refactoring](#automatic_refactoring) chapter for more information and detailed instructions.

#### Server Migration

##### Update Dependencies

* Update the A12 dependencies according to the versions in the release table for the overall version you want to upgrade to.
* The file where versions are defined depends on the build tool you are using:

  + Maven - update your `pom.xml`.
  + Gradle - update dependencies which are usually located in `settings.gradle` file.

|  |  |
| --- | --- |
|  | For more information please look into [Gradle documentation](https://docs.gradle.org/current/userguide/dependency_constraints.html). Next to this documentation there are separate pages for [downgrading](https://docs.gradle.org/current/userguide/dependency_downgrade_and_exclude.html) and [aligning](https://docs.gradle.org/current/userguide/dependency_version_alignment.html). You can also check similar topics in the left menu, it is handy to know. |

* Check and update [A12 dependencies](https://geta12.com/#/releases/releases-overview) (Base, Kernel, Data Services, Workflows, …​).
* Check other [third-party dependencies](#_technology_updates) (Spring, Spring Boot, Jackson, …​).

#### Client Migration

For automatic code refactoring of frontend we use [Hypermod](https://github.com/hypermod-io/hypermod-community) (formerly known as: Codemods/Codeshift).
See [Migration Instructions](https://geta12.com/docs/client/client-documentation-bundle/index.html#_migration_instructions) of Client and how they use codemods based on Hypermod.

Available codemod artifacts are listed in the section about [Migration to 2025.06](#_available_hypermod_codemods).

##### Update & Install Dependencies

* Update the A12 dependencies in `package.json` according to the versions in the release table for the overall version you want to upgrade to.

|  |  |
| --- | --- |
|  | Components with multiple artifacts use the same version for all artifacts. |

* Run `npm install`.
* Check peer dependencies issues and update third-party dependencies. Try to fix all issues and run `npm install` again.
* Update your code according to the migration instructions.
* Do not forget to update the Application Models, which could be part of the `client` (depending on the project structure).

#### Compile & Build

* Compile the project.
* If the project has not compiled, follow the errors and fix them. If the issue is caused by an A12 dependency please check the respective documentation.
* After successful compilation, run the project.
* New errors can appear. Please continue with processing of breaking and deprecated changes.

|  |  |
| --- | --- |
|  | If you think that a breaking change is not covered by the components' migration instructions, please reach out to us via the usual communication channels (e.g. creating bug tickets, Discourse, Support Portal). |

## Automatic Source Code Refactoring

### Motivation

A12 upgrades take a significant amount of time and project resources.
It results in projects struggling with upgrades and being afraid of performing them at all.

We recommend projects to upgrade regularly. Therefore, we strive to prepare for upgrades through understanding breaking changes, upgrading our own projects, reviewing existing documentation, and writing new documentation and migration guides.
To reduce the efforts for projects upgrading, we evaluated options to save time on code level. It is possible to apply a subset of breaking changes automatically through the usage of source code refactoring tools.

After research and evaluation we have decided to use [Hypermod](https://github.com/hypermod-io/hypermod-community) (formerly known as: Codemods/Codeshift) for frontend components.

### Advantages of Automated Source Code Refactoring

OpenRewrite and Hypermod apply the same transformation rules across your entire codebase in a single run.
This brings a few practical advantages over doing the work by hand:

* **Less manual effort**: Renaming imports, updating method signatures, and adjusting call sites across hundreds of files is tedious work that these tools handle in seconds.
* **Fewer mistakes**: A find-and-replace session across a large project almost always misses an edge case or introduces a typo. Automated rules do not get tired or overlook files.
* **Uniform results**: Every module in your project ends up following the same updated patterns, rather than depending on which developer touched which file.
* **Easier reviews**: Because the transformations are deterministic, reviewers can focus on the handful of manual changes instead of sifting through thousands of mechanical edits.

### How to Apply It in A12?

Since A12 2024.06 component teams try to cover every suitable breaking change by a transformation rule and provide these out-of-the-box. The collection of those rules can be downloaded by a developer and executed by running a single command, which will apply these changes to the codebase automatically.

These changes could be,

* import paths changed for library specific classes and functions;
* class and method names changed;
* method signatures changed; or
* the way how to use a class or method has changed.

You can run codemod rules per component.

### Usage of Hypermod for Frontend Components

Hypermod is a library which provides functionalities to refactor large codebases. Its focus is on writing so-called codemods for JavaScript and TypeScript refactoring. Generally, Hypermod can be used for any file type because of its more abstract structure.

A12 components provide codemods, which contain rules for automatic code refactoring of suitable breaking changes. These codemods are bundled into artifacts and released.

#### Execute Codemods

For Kernel and Workflows components, the structure for installing a codemod artifact and executing it is as follows:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx '@com.mgmtp.a12.<component>/<component>-codemod@<component-version>' <path-to-your-frontend-sources> --target-version <component-version> ``` |
```

For other components, the general structure for installing a codemod artifact and executing it is as follows:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx '@com.mgmtp.a12.<component>/<component>-codemod@<component-version>' <component-version> <path-to-your-frontend-tsconfig> ``` |
```

#### Examples

Run kernel-codemod

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx '@com.mgmtp.a12.kernel/kernel-codemod@30.7.1' client --target-version 30 ``` |
```

Run workflows-codemod

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx '@com.mgmtp.a12.workflows/workflows-codemod@12.2.2' client --target-version 12 ``` |
```

Run base-codemod

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx '@com.mgmtp.a12.base/base-codemod@29.2.0' 29.2.0 client\tsconfig.json ``` |
```

Run client-codemod

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx '@com.mgmtp.a12.client/client-codemod@16.2.0' 16.2.0 client\tsconfig.json ``` |
```

Run dataservices-codemod

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx '@com.mgmtp.a12.dataservices/dataservices-codemod@38.3.5' 38.3.5 client\tsconfig.json ``` |
```

Run diagrameditor-codemod

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx '@com.mgmtp.a12.diagrameditor/diagrameditor-codemod@3.2.1' 3.2.1 client\tsconfig.json ``` |
```

Run formengine-codemod

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx '@com.mgmtp.a12.formengine/formengine-codemod@38.3.1' 38.3.1 client\tsconfig.json ``` |
```

Run overviewengine-codemod

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx '@com.mgmtp.a12.overviewengine/overviewengine-codemod@38.2.0' 38.2.0 client\tsconfig.json ``` |
```

Run treeengine-codemod

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx '@com.mgmtp.a12.treeengine/treeengine-codemod@10.2.0' 10.2.0 client\tsconfig.json ``` |
```

Run print-engine-codemod

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx '@com.mgmtp.a12.print/print-engine-codemod@3.2.2' 3.2.2 client\tsconfig.json ``` |
```

Run uaa-authentication-client-codemod

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx '@com.mgmtp.a12.uaa/uaa-authentication-client-codemod@9.3.1' 9.3.1 client\tsconfig.json ``` |
```

Run notificationcenter-codemod

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx '@com.mgmtp.a12.notificationcenter/notificationcenter-codemod@3.2.2' 3.2.2 client\tsconfig.json ``` |
```

|  |  |
| --- | --- |
|  | The order in which the codemods are executed matters. Kernel and Workflows shall be run first. Then the `client-codemod` will apply the most amount of breaking changes. |

## Migration to 2025.06-ext4

|  |  |
| --- | --- |
|  | This section is based on the experiences of upgrading TPS projects (Project Template, Project Information, Load Test Apps) as well as on an analysis of breaking changes.  For details you need to go to the migration instructions of all components, which you use in your project. |

### Known Issues

#### Monitored-Properties Endpoint Missing Authorization Policy

Data Services introduced a new endpoint `/api/monitored-properties` that is used by the engines to retrieve query related configuration.

If your project is overriding the `mgmtp.a12.uaa.authentication.unsecured.urls` property and uses the `uaa-authorization-introspector` library you will most likely run into the following error on server start up:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` 2026-01-23 06:33:44,205 [  restartedMain] [ERROR] o.s.boot.SpringApplication               : Application run failed java.lang.RuntimeException: Please configure authorization policy for these endpoints: [/api/monitored-properties] 	at com.mgmtp.a12.uaa.authorization.introspection.EndpointIntrospector.process(EndpointIntrospector.java:87) 	at com.mgmtp.a12.uaa.authorization.introspection.AuthorizationIntrospectionStartup.initializeApplication(AuthorizationIntrospectionStartup.java:41) 	at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:103) 	at java.base/java.lang.reflect.Method.invoke(Method.java:580) 	at org.springframework.context.event.ApplicationListenerMethodAdapter.doInvoke(ApplicationListenerMethodAdapter.java:383) 	at org.springframework.context.event.ApplicationListenerMethodAdapter.processEvent(ApplicationListenerMethodAdapter.java:255) 	at org.springframework.context.event.ApplicationListenerMethodAdapter.onApplicationEvent(ApplicationListenerMethodAdapter.java:174) 	at org.springframework.context.event.SimpleApplicationEventMulticaster.doInvokeListener(SimpleApplicationEventMulticaster.java:185) ``` |
```

To solve this issue it is necessary to extend the aforementioned UAA property by adding `/api/monitored-properties` to the unsecured-urls:

application.properties

```
mgmtp.a12.uaa.authentication.unsecured.urls=<OTHER UNSECURED URLS>,/api/monitored-properties
```

## Migration to 2025.06-ext2

|  |  |
| --- | --- |
|  | This section is based on the experiences of upgrading TPS projects (Project Template, Project Information, Load Test Apps) as well as on an analysis of breaking changes.  For details you need to go to the migration instructions of all components, which you use in your project. |

### Npm Configuration for External Developers

|  |  |
| --- | --- |
|  | This change only affects developers, which are building against the getA12 artifactory. |

With the introduction of the new Query Model a new artifact is necessary to be added to the `.npmrc` configuration.
This artifact is used by the Overview Engine implicitly to resolve such Query Models and handle them properly.

This will allow you to build A12 2025.06-ext2 projects that use the Overview Engine.

Add the following scoped package to your `.npmrc` configuration:

Additional Package

```
@com.mgmtp.a12.querymodel:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
```

Therefore, your `.npmrc` configuration should look like the following.

~/.npmrc

```
registry=https://registry.npmjs.org/

//artifacts.geta12.com/artifactory/api/npm/a12-npm/:_authToken = <IDENTITY TOKEN>
//artifacts.geta12.com/artifactory/api/npm/a12-npm/:always-auth = true
//artifacts.geta12.com/artifactory/api/npm/a12-npm/:email = <EMAIL>

@com.mgmtp.a12.base:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.client:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.dataservices:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.devtools:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.diagrameditor:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.dml:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.formengine:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.kernel:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.overviewengine:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.projecttemplate:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.treeengine:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.tutorial:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.uaa:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.utils:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.widgets:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.workflows:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.expression:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.print:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.contentengine:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.enablements:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.dml:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.datadistribution:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.notificationcenter:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.migrationtool:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.relationshipengine:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.crud:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
@com.mgmtp.a12.querymodel:registry=https://artifacts.geta12.com/artifactory/api/npm/a12-npm/
```

For more detailed information about the Npm configuration check out the documentation about [accessing A12 Npm Artifacts](https://geta12.com/docs/OVERALL/access_artifacts/index.html#_npm_2).

### Known Issues

#### Tree Engine Model Version Mismatch

When using Tree Engine version 10.1.0, you may experience errors related to the Tree Engine and model version. In Redux DevTools you may see:

```
UNSUPPORTED_MODEL_VERSION: Model [type: tree, id: ...] is specified in version '10.1.0' which does not satisfy the defined version range '10.1.0-pre.1'.
```

The browser console may also show TreeEngine errors such as missing ModelsState.

This is caused by an incorrect modelVersion configuration shipped with the Tree Engine in 2025.06-ext2. The engine expects version 10.1.0-pre.1 instead of the stable 10.1.0.
This issue is fixed in Tree Engine 10.1.1, please use that version instead.

#### Missing Authentication in SecurityContext During Reindexing

During server initialization, specifically in the re-indexing phase, event listeners may run into a missing authentication in the SecurityContext. Calls to:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` SecurityContextHolder.getContext().getAuthentication() ``` |
```

can return null, which may lead to errors if the authentication or principal is accessed. This typically manifests as batch indexing failures with errors indicating that `Authentication.getPrincipal()` cannot be invoked.
This issue occurs when multiple document models are present. If only a single model is configured, the authentication is correctly available as superUser.

This issue is fixed in Data Services 38.1.2.

#### `formatValue` No Longer Returns `modelId`

The internal behavior of the Overview Engine’s `formatValue` function has changed and no longer includes the `modelId` in its returned value.

This change was introduced unintentionally as part of work to support heterogeneity.
During this change, the logic for resolving the conversion configuration was updated, and the `modelId` no longer falls back to the super document model when it is undefined.

This unintended breaking change will be reverted in 2025.06-ext4.

#### TypeScript Compile Errors Due to Incompatible `react-draggable` Versions

TypeScript compilation may fail with multiple duplicate identifier errors originating from `react-draggable` type definitions.
The issue is caused by conflicting transitive dependencies in Widgets: `widgets-core` depends on `react-draggable@4.5.0`, while `react-rnd` pulls in `react-draggable@4.4.6.
As a result, incompatible type definitions are loaded multiple times, leading to TypeScript compile errors.

As a workaround, the following override can be added to package.json to force a single compatible version of react-draggable:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` { "overrides": { "react-draggable": "4.4.6" } } ``` |
```

This issue will be fixed in Widgets version xx.x.x.

#### Initial Width of Sidebar Widget Not Applied

The initial minimized width of the sidebar, defined via `applicationFrame.sidebar.expandedWidth`, is ignored.
Instead, the sidebar width is determined by the content of the tab when first opened.

This regression was caused by the `useSideBarExpandedWidth` hook returning an empty string in this scenario.
Resizing within the defined boundaries (`subResizableOptions`) still works after opening.

This issue will be fixed in 2025.06-ext4.

#### Tree Engine: Context Menu Does Not Work With Multi-Select

When multi-selection is enabled in Tree Engine, the entries in the context menu cannot be clicked anymore.
This issue was introduced in 2025.06-ext2 by an unintended change related to the readonly mode feature.

This issue will be fixed in Tree Engine 10.1.2.

#### Custom Conditions Using Deprecated Factory Method No Longer Work

Custom conditions implemented using the deprecated `ICustomConditionFactory#createCustomCondition` method may no longer work after upgrading to 2025.06. At runtime, the following error is thrown:

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` An error occurred while evaluation the data check: Custom condition 'EmailNotUnique' for rule '/Person/PersonalData/check_email_exists' missing. com.mgmtp.a12.kernel.core.rt.a12internal.ValidatorException: Custom condition 'EmailNotUnique' for rule '/Person/PersonalData/check_email_exists' missing. ``` |
```

As a workaround, switch to the `ICustomConditionFactory#createCustomConditionV2` method for your implementation.

This issue will be fixed in Kernel version 30.6.0 (2025.06-ext4).

#### Sorting by Fields of Outgoing To-1 Relationships No Longer Works

Sorting a list of documents by fields in a to-1 relationship target document or link property document no longer works after upgrading to 2025.06. This was previously supported for CDM overviews using the Solr/CDD index based solution in 2024.06, but is not yet supported with the new Query API.

For example, if TestCases have a to-1 relationship to TestSuites, sorting the list of TestCases by the TestSuite title is not possible.

A fix for this issue is currently being analyzed and will be delivered as soon as possible.

## Migration to 2025.06

|  |  |
| --- | --- |
|  | This section is based on the experiences of upgrading TPS projects (Project Template, Project Information, Load Test Apps) as well as on an analysis of breaking changes.+ For details you need to go to the migration instructions of all components, which you use in your project. |

|  |  |
| --- | --- |
|  | Starting with 2025.06-ext5, we will no longer provide support for OpenRewrite usage. If you are migrating to 2025.06-ext4, it would still be available [here](https://geta12.com/docs/2025.06/ext4/overall/migration_guide#automatic_refactoring). |

### Models

#### Workspace Data

Workspace Data is initial data for an A12 application that can be used for demonstration or testing purposes during the application development process. It is designed for small-scale, non-critical data scenarios and represented by documents, links, attachments as well as user files in the workspace.
This feature ensures consistency within the modeling environment after deployment. It eliminates old models, data, roles and users, allowing the modeler to preview the current state of the Workspace.
Even if the Document Model changes and data is present, the modeler can continue incremental modeling.
Please read more about Workspace Data in the [modeling documentation](https://geta12.com/docs/sme/sme-data-ba-docs/index.html).

#### Layout Enforcement

For Workspace Data and for Resource Management, the SME Workspace Explorer enforces some layouting rules that restrict the way in which new files and folders can be created, as well as how elements can be moved and renamed.
The following folder names are reserved/created by the SME and cannot be used for other purposes:

* data

  + documents
  + links
  + attachments
* resources

  + themes

If your workspace directory contains any of these reserved folder names, you will need to rename them.

Find out more in the documentation of the SME about [Layout Enforcement](https://geta12.com/docs/sme-ba-docs/index.html#layout_enforcement).

#### Three Value Logic Handling of Boolean (removing deprecation)

In A12 2024.06 we deprecated the two value logic of Booleans. This deprecation has been removed now. The logic behind a boolean is now interpreted in the same way within all A12 components and fully supported now.
In all engines booleans are treated by a three value logic (no value, false, true) as default.

### Technology Updates

A12 2025.06 includes all necessary updates to technologies and third-party dependencies. Upgrading to the latest versions of these technologies provides both us and projects using A12 the opportunity to benefit from new features, as well as the latest security patches and bug fixes. Each A12 overall release is supported for two years. A12 2025.06 will be supported until the end of June 2027. We must ensure that all our technologies are supported at least until that date.
See the overview of the currently used technologies and their corresponding version in following table. The most important changes are described in Frontend and Backend sections.

| Technology | Version |
| --- | --- |
| Java | 21 |
| Gradle | 8.5 |
| Spring | Spring Core » 6.2.6  Spring Boot » 3.4.5  Spring Data » 3.4.5  Spring Security » 6.2.6 |
| Jackson | 2.19.0 |
| React | 19.1.0 |
| TypeScript | 5.8.2 |

### Frontend

#### React

We have upgraded React 18 to React 19. Please have a look at the [Migration Instructions in our Widget showcase](https://www.mgm-tp.com/a12.htmlshowcase/38.0.0/#/get-started/migration-instructions/migration-notes) and
[Migration Instructions of Client](https://geta12.com/docs/client/client-documentation-bundle/index.html#_react_19)

Please be aware that we have not upgraded Redux and Redux-saga. The consequence of this is that we do not use officially supported combination of React and Redux.
We decided for this to avoid many breaking changes. Switch to Redux 5 would require dropping typescript-fsa library and, as a consequence, rewriting all custom middlewares and custom sagas in all projects. We will consider updating to Redux 5 with the next major release.

The older react-redux package does not “expect” to be paired with the React 19, causing the conflict here, which leads to warning while building. You can get rid of the warning by one of:

* using the overrides property to specifically allow this version/range in your package.json (as described in [Migration Instructions of Client](https://geta12.com/docs/client/client-documentation-bundle/index.html#_react_19)
* build with --legacy-peer-deps flag
  `npm install --legacy-peer-deps`

|  |  |
| --- | --- |
|  | The second way will ignore all kinds of peer dependency issues, which is probably not what you want. Therefore we recommend the first approach using overrides. |

#### Ecma Script Modules

A12 frontend artifacts have been migrated from CommonJS Modules to Ecma Script Modules (ESM). ESM is standard nowadays. It brings better performance and optimized loading in modern browsers and JavaScript environments. It as well improves modularity, code maintenance and efficiency.

We have migrated all frontend artifacts but Project Template. We decided to switch the Project Template to ESM next year and stay on CommonJS until then. If you want to switch your project
to ESM already now, get in touch with TPS.

#### TypeScript

We upgraded TypeScript from 5.3.3 to 5.8.2. However, what is more important about this upgrade is how we will maintain it over the next two years. In the past, we stuck with an exact version of TypeScript for the entire support period of each release. Now, that will change. Moving forward, we will update TypeScript with security patches and minor releases in our extended releases, but we will not adopt newly introduced types. This approach will ensure that A12 remains fully compatible with the latest versions of modern browsers and JavaScript environments.

#### Styled-components

We upgraded styled components from version 5 to 6. However, styled-components have been put to maintenance mode, therefore we have started searching for alternatives.

### Backend

#### Query API

The biggest breaking change in A12 2025.06 is introduction of Query API. Data services are providing data retrieval APIs for growing number of components and client projects. Those require a different data retrieval patterns and often had different ideas about sorting, paging, etc. This has lead to more and more JSON-RPC methods being added to DS which had different functionality (different filtering, sorting, paging requirements) and different responses:

* Single document ( GET\_DOCUMENT )
* Paged list of documents ( LIST\_DOCUMENTS, LIST\_CDDS )
* Paged list of documents that are merged into 1 document (target and link documents of LIST\_LINKS )
* Boiler-template links - possible link templates with partial metadata (Template for ADD\_LINK is a response of LIST\_CANDIDATES )
* Not paged list of root or leaf documents of self-referencing Relationship Model ( LIST\_TERMINATING\_LINKS )
* Not paged list of documents ( LOAD\_DOCUMENT\_GRAPH )

Furthermore, all of above-mentioned APIs are using 2 different underlying technologies (DB and Solr) in different ways which exposes different features i.e.: LIST\_LINKS is resolved by SQL Select statement while LIST\_CDDS can be achieved only by Solr query on preprocessed data. And the most complex one, LIST\_DOCUMENTS, requires Solr and DB cooperation and is sensitive on the data consistency in both of the systems.
Supporting an ever-growing number of methods for different use cases is very costly and does not scale effectively. New components and client projects should get a single API to retrieve the data from Data Services.

Therefore, A12 introduces the Query API in 2025.06 to tackle all data retrieval related requirements and improve performance.

Please see [Data Services Query API Documentation](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#_query_api) and [Data Services Migration Instructions](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#_migration_instructions).

#### DocumentV2 API

Another breaking change with big impact is the use of DocumentV2 (Kernel) in all other affected A12 components. With the old IDocument interface, it was rather inconvenient and inefficient to access and update data in documents, particularly in case of repeatable groups and in general when subgroups were processed.
The DocumentV2 API, including associated utility methods, aims to improve this.

The old IDocument interface is still available, as well as the conversion between IDocument and DocumentV2, however we recommend to switch to new interface immediately.

Please read more about DocumentV2 API in [Kernel documentation](https://geta12.com/docs/kernel/kernel-documentation-dev/index.html#document_api_v2_java).

#### Java

Support of Java 17 was dropped. A12 2025.06 uses Java 21 both for compiling as well as in runtime. It led to necessary upgrade version of spring. Please find exact version of spring in the table above.
When upgrading Java and Spring, please have a look at the release notes from [Spring Boot](https://github.com/spring-projects/spring-boot/releases), [Spring Framework](https://github.com/spring-projects/spring-framework/releases), and [Spring Security](https://github.com/spring-projects/spring-security/releases).

#### Dropping H2, Solr, Oracle

Because of Query API, we have dropped support of H2, we rely fully on Postgres, so we dropped support of Oracle. As well the SOLR was removed and replaced by Postgres.

#### CIB7 instead of Camunda

Due to licensing and support running out, we had to drop Camunda 7 CE from our Workflows component. We have analyzed alternatives, and we have
chosen CIB 7. [CIB 7](https://cibseven.org/en/) is a stable replacement of Camunda that we want to rely on.

We have replaced all Camunda dependencies with their CIB 7 equivalents.
We have provided scripts for migrating imports and Gradle build scripts as well as detailed migration notes.

Please have a look at the [Workflows documentation](https://geta12.com/docs/workflows/dev-docs/index.html#_query_api) for more information about CIB 7.

### Known Issues

#### Slow Performance When Importing Models

Importing models may take significantly longer than previously, with performance degrading as the number of fields or enumeration labels in document models increases.
Compared to 2024.06, model import time can regress from seconds to several minutes when using 2025.06 with the same model set.
This regression is caused by model indexing introduced in Data Services 38.0.0 as a prerequisite for efficient querying.
During model creation, each field is now analyzed to determine whether it is relevant for indexing, which increases processing time.

There is currently no workaround available. Improvements to the model indexing performance are being analyzed.

### Outlook on A12 2026.06

As already mentioned above: Some big breaking changes will come in 2026.06. We will have to upgrade Redux from version 4 to version 5. We will as well
upgrade React-redux and redux-saga. It will lead to the necessary drop of typescript-fsa library and this will lead to rewriting all custom middlewares
and custom sagas in all projects.

We will also switch the Project Template to ESM which will lead to necessary patches of some libraries like react-dnd.

## FAQs

### Is It Better Migrate to the Next Release or to the Newest Version?

Upgrading to the newest version will give you the guarantee that you are done with upgrading until a new A12 version is released, and the following upgrade will be easier. Migrating only to the next version is always easier – you need to process less changes. A12 TPS team recommends upgrading to the newest A12 version and then upgrading regularly.

From version **2024.06** on, A12 will only support the migration from the previous breaking release. More information can be found in the [Migration Guide](#migration_guide) section.

### Where to Find Examples and Help?

* [A12 Discourse → Migration Category](https://discourse.geta12.com/c/migration/26)
* Every A12 component documentation has a section **Migration Instructions**, where you can find what you should update for the respective component.
* In case you can not find a solution for your issue in the documentation, feel free to ask TPS.

### Will TPS Support Me?

Yes. In the past TPS has been doing the upgrades of the projects very closely with project developers. Nowadays TPS acts rather as consultants. If you have any issues, please first try to find it in available sources.
If you cannot find it, we are ready to help. For details on reaching our team, please visit our [support page on GetA12](https://geta12.com/#/support/support-overview).

### Is It Better to Migrate Models With SME or With Command Line Tools?

Both approaches have advantages and disadvantages. The SME gives you the option to migrate all types of models at once. The command line tools give you the option to call the model migration steps separately with scripts and easily see the logs in case of problems.

## Links to the Components Migration Instructions

* [User Authentication and Authorization](https://geta12.com/docs/uaa/uaa-documentation-src/index.html#_migration_instructions)
* [Widgets](https://www.mgm-tp.com/a12.htmlshowcase/#/get-started/migration-instructions/migration-notes)
* [Client](https://geta12.com/docs/client/client-documentation-bundle/index.html#_migration_instructions)
* [Localization](https://geta12.com/docs/utils_localization/utils-localization-documentation-bundle/index.html#_migration_instructions)
* [Overview Engine](https://geta12.com/docs/overview_engine/overviewengine-dev-docs/index.html#_migration_instructions)
* [Tree Engine](https://geta12.com/docs/tree_engine/treeengine-dev-docs/index.html#_migration_instructions)
* [Form Engine](https://geta12.com/docs/form_engine/formengine-documentation-bundle/index.html#_migration_instructions)
* [Content Engine](https://geta12.com/docs/content_engine/contentengine-dev-docs/index.html#_2025_06)
* [Print Engine](https://geta12.com/docs/print_engine/print-technical-documentation/index.html#_migration_instructions)
* [Kernel](https://geta12.com/docs/kernel/kernel-documentation-dev/index.html#_migration_instructions)
* [Data Services](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#migration-notes)
* [Workflows](https://geta12.com/docs/workflows/dev-docs/index.html#anchor-migration-instructions)
* [Helm Stack Charts](https://geta12.com/docs/build_and_deployment/a12-stack/index.html#_migration_instructions)
* [Notification Center](https://geta12.com/docs/notification_center/notificationcenter-documentation/index.html#notification-center-migration-instructions)
