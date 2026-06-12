---
source: https://geta12.com/docs/2025.06/ext5/cms/cms-dev-docs/index.html
category: cms
docid: cms-dev-docs
scraped: 2026-06-12
---

# Content Management System for Developers

|  |  |
| --- | --- |
|  | This documentation belongs to an **A12 Enterprise Component** which is not part of the Open Source offering (A12 Community Edition). Please feel free to browse the documentation and learn more about how you can use this A12 component in your project. Learn more about the benefits from an A12 Enterprise Subscription on [the Editions & Licensing page](https://geta12.com/#/editions-licensing). |

## Introduction

The A12 Content Management System (CMS) is a lightweight application module that can be integrated into A12 applications.
It enables content managers to create, publish and maintain pages with meta data and content, and organize them in a hierarchy.
And it provides components and API to render these pages as well as to use the page hierarchy to render navigation for the end users.

The Content Management System uses the Content Engine and the Content Model Editor - lower level components, which can also be used for other purposes, and which are documented separately.

## Getting Started

### Installation

#### Client side

Content Management System includes multiple npm packages and depends on Content Engine as well as other A12 components.
First, install the Content Engine packages:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm install @com.mgmtp.a12.contentengine/contentengine-core @com.mgmtp.a12.contentengine/contentengine-editor ``` |
```

Next, install the Content Management System packages:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm install @com.mgmtp.a12.cms/cms-management-types @com.mgmtp.a12.cms/cms-server-connector @com.mgmtp.a12.cms/cms-management @com.mgmtp.a12.cms/cms-viewer ``` |
```

Replace <version> with the specific version of the package you want to use. At that time, the latest version is {revnumber}.

In addition, it is necessary to install other A12 packages as peer dependencies of the Content Engine,
such as Base, Widgets, Client, and others.

#### Server side

Next, add the contentengine-core package as a dependency in your build.gradle file. Specify the correct group, name, and version of the package.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` dependencies {     implementation 'com.mgmtp.a12.contentengine:contentengine-core:<version>'     // other dependencies } ``` |
```

Replace <version> with the specific version of the package you want to use. At that time, the latest version is {revnumber}.

### Setup

The following sections provide the necessary information to set up for Management and Viewers modules in two separate client applications.
THe project want to have both modules in the same application can follow the instructions for both modules with additional steps to combine them.

#### Setup Management module

The following setup assumes that project already has the proper A12 Client setup and the Management module is installed.

##### Register element libraries

To use the Management module, register the necessary (editor) element libraries in your application.

Configure appsetup.ts

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 ``` | ``` import { EditorElementLibraryRegistry } from "@com.mgmtp.a12.contentengine/contentengine-editor"; import { ModuleRegistryProvider } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js"; import { 	ContentManagementFactories, 	FragmentEditorElementLibrary, 	ManagementEditorElementLibrary } from "@com.mgmtp.a12.cms/cms-management";  export function setup() { 	// Add Management modules 	[ 		ContentManagementFactories.createPagesModule(), 		ContentManagementFactories.createFragmentsModule(), 		ContentManagementFactories.createAssetsModule() 	].forEach((module) => ModuleRegistryProvider.getInstance().addModule(module));  	// Register element libraries 	EditorElementLibraryRegistry.get() 		.addEntry(ManagementEditorElementLibrary.get()) 		.addEntry(FragmentEditorElementLibrary.get());  	// other configurations } ``` |
```

##### Register view components

To use the Management module, register the necessary element libraries in your application.

Configure view provider

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 ``` | ``` import * as React from "react";  import { type View } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js"; import { FrameFactories } from "@com.mgmtp.a12.client/client-core/lib/core/frame/index.js"; import { type ViewComponentMap, type ViewComponentProvider } from "@com.mgmtp.a12.contentengine/contentengine-core"; import { 	PagesTree, 	DynamicPageForm, 	ContentEditorForm, 	DYNAMIC_PAGE_FORM_VIEW_NAME, 	CONTENT_EDITOR_FORM_VIEW_NAME, 	PAGE_MANAGEMENT_TREE_VIEW_NAME, 	FRAGMENT_EDITOR_FORM_VIEW_NAME } from "@com.mgmtp.a12.cms/cms-management";  export function createViewProvider() { 	const additionalViewProvider = createAdditionalViewProvider();  	return (componentName: string): React.ComponentType<View> => 		additionalViewProvider(componentName) || 		FrameFactories.viewProvider(componentName) || 		(() => <div>ERROR: NO CONTAINER FOUND</div>); }  function createAdditionalViewProvider(): ViewComponentProvider { 	const components: ViewComponentMap = { 		[FRAGMENT_EDITOR_FORM_VIEW_NAME]: (props) => <ContentEditorForm {...props} fragment />, 		[CONTENT_EDITOR_FORM_VIEW_NAME]: (props) => <ContentEditorForm {...props} />, 		[PAGE_MANAGEMENT_TREE_VIEW_NAME]: (props) => <PagesTree {...props} />, 		[DYNAMIC_PAGE_FORM_VIEW_NAME]: (props) => <DynamicPageForm {...props} />  		// other view components 	};  	return (name) => components[name]; } ``` |
```

##### Register layout provider

The Management module requires two layouts: `CMSApplicationFrame` and `CMSToolAreaLayout`. CMS provides them by using `withCMSLayout` to wrap a layout provider:

Configure layout provider

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` import { withCMSLayout } from "@com.mgmtp.a12.cms/cms-management"; import { FrameFactories, type FrameViews } from "@com.mgmtp.a12.client/client-core/lib/core/frame/index.js";  export const MainPage = (): React.JSX.Element => { 	const rootRegionRef = React.useMemo(() => [], []); 	const RegionUi = React.useMemo(() => FrameFactories.regionUiProvider(rootRegionRef), [rootRegionRef]);  	// const layoutProvider = your layoutProvider here... 	return <RegionUi {...regionUiProps} layoutProvider={withCMSLayout(layoutProvider)} />; }; ``` |
```

In case your `ApplicationFrame` has custom frameLayoutProps, the customization should be extracted and passed again into `withCMSLayout`

Configure layout provider with custom frameLayoutProps

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` export const MainPageWithCustomFrameLayout = (): React.JSX.Element => { 	const rootRegionRef = React.useMemo(() => [], []); 	const RegionUi = React.useMemo(() => FrameFactories.regionUiProvider(rootRegionRef), [rootRegionRef]);  	// const frameLayoutProps = your custom frame layout props here... 	const frameLayoutProps = customFrameLayoutProps;  	const layoutProviderWithCMS: FrameViews.LayoutProvider = React.useMemo( 		() => withCMSLayout(layoutProvider, frameLayoutProps), 		[frameLayoutProps] 	);  	return <RegionUi {...regionUiProps} layoutProvider={layoutProviderWithCMS} />; }; ``` |
```

#### Setup Viewer module

##### Register element library

To use the Viewer module, register the necessary element libraries in your application.

Configure appsetup.ts

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` import { ViewerElementLibrary } from "@com.mgmtp.a12.cms/cms-viewer"; import { ElementLibraryRegistry } from "@com.mgmtp.a12.contentengine/contentengine-core";  export function setup() { 	// Register element libraries 	ElementLibraryRegistry.get().addEntry(ViewerElementLibrary.get()); 	// other configurations } ``` |
```

##### Register initial action

The viewer need to call to the server to get the initial pages to render the viewer.
It could be done along with model graph fetching or separately. Here is the example of how to do it after logging in:

Fetch pageGraph and add Page Modules

```
|  |  |
| --- | --- |
| ```   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49  50  51  52  53  54  55  56  57  58  59  60  61  62  63  64  65  66  67  68  69  70  71  72  73  74  75  76  77  78  79  80  81  82  83  84  85  86  87  88  89  90  91  92  93  94  95  96  97  98  99 100 101 102 103 104 ``` | ``` import { createBrowserHistory } from "history"; import type { SagaIterator } from "redux-saga"; import { all, put, call, takeLatest } from "typed-redux-saga";  import { UaaActions } from "@com.mgmtp.a12.uaa/uaa-authentication-client"; import { ModelGraph } from "@com.mgmtp.a12.dataservices/dataservices-access"; import { NotificationActions } from "@com.mgmtp.a12.client/client-core/lib/core/notification/index.js"; import { ModelActions, type ApplicationModel } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js"; import { ConnectorLocator, type RestServerConnector } from "@com.mgmtp.a12.utils/utils-connector/lib/main/index.js"; import { createPlatformServerModelLoader } from "@com.mgmtp.a12.client/client-core/lib/extensions/modelLoader/index.js"; import { 	ApplicationActions, 	ApplicationFactories, 	ModuleRegistryProvider } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js"; import { 	PageGraph, 	ContentViewerActions, 	PathRegistryProvider, 	ContentViewerFactories, 	ContentViewerDeepLinkFactories } from "@com.mgmtp.a12.cms/cms-viewer";  export function setup() { 	// other configurations  	return ApplicationFactories.createApplicationSetup({ 		model: ProjectAppModel, 		dataHandlers: [ 			/** can be empty unless project has specific data loading logic */ 		], 		modelLoader: createPlatformServerModelLoader(), 		// other application configurations... 		customSagas: [ 			// other sagas... 			watchLoggedInSaga 		] 	}); }  // export for root application component to synchronize URL history export const appHistory = createBrowserHistory({ window });  function* watchLoggedInSaga(): SagaIterator { 	yield* takeLatest(UaaActions.loggedIn, function* () { 		try { 			yield* put(ApplicationActions.setBusy(true));  			const serverConnector = ConnectorLocator.getInstance().getServerConnector() as RestServerConnector;  			// Fetching page graph along with model graph 			const { modelGraph, pageGraph } = yield* all({ 				modelGraph: call(() => 					serverConnector.fetchData(ModelGraph.build(true)).then((r) => r.json() as Promise<ModelGraph>) 				), 				pageGraph: call(PageGraph.build) 			});  			// Initialize PathRegistryProvider 			PathRegistryProvider.get().initialize(pageGraph.rootPages);  			// Set page graph 			yield* put(ContentViewerActions.setPageGraph(pageGraph));  			const moduleRegistry = ModuleRegistryProvider.getInstance();  			// Add module for each response page 			pageGraph.rootPages.forEach((page) => { 				moduleRegistry.addModule(ContentViewerFactories.createPageModule(page, pageGraph.metaAppModels)); 			});  			// Add not found module 			moduleRegistry.addModule(ContentViewerFactories.createNotFoundModule());  			// Add custom deep link module 			moduleRegistry.addModule( 				ContentViewerFactories.createDeepLinkModule({ 					locationManager: ContentViewerDeepLinkFactories.createLocationManager(appHistory), 					deepLinkCoder: ContentViewerDeepLinkFactories.createDeepLinkCoder( 						ContentViewerDeepLinkFactories.createDefaultPageCoder() 					), 					applyTriggers: [ModelActions.setModelGraph, ContentViewerActions.setLink] 				}) 			);  			// Set regular model graph and release busy state 			yield* all([put(ModelActions.setModelGraph(modelGraph)), put(ApplicationActions.setBusy(false))]); 		} catch (e) { 			const error = e as Response; 			const body = error;  			yield* put( 				NotificationActions.add({ 					severity: "error", 					title: { key: "server.connection.failed" }, 					message: { key: "any", defaults: { en: JSON.stringify(body, undefined, 2) } } 				}) 			);  			throw error; 		} 	}); } ``` |
```

#### Setup Server side

##### Import Management models

The Management module exposes the necessary models to be imported in the server side via npm packages
that need to be added into application.properties:

Import Management models

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.dataservices.initialization.import.models.path=...,file:${<path-to-management-models>}/models ``` |
```

Please replace `<path-to-management-models>` with the actual path to the Management models inside `node_modules` folder, e.g.
`<root>/node_modules/@com.mgmtp.a12.cms/cms-management/resources`

##### Add scan packages

Add `com.mgmtp.a12.cms` to the scanBasePackages array within the `@DataServicesApplication` annotation.
This ensures that Spring will scan the specified package for components, configurations, and services.

Add scan package

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` import org.springframework.boot.SpringApplication;  import com.mgmtp.a12.dataservices.DataServicesApplication;  @DataServicesApplication(scanBasePackages = { "com.mgmtp.a12.dataservices", "com.mgmtp.a12.contentengine" }) public class ProjectServerApplication { 	public static void main(String[] args) { 		new SpringApplication(ProjectServerApplication.class).run(args).start(); 	} } ``` |
```

## Features

|  |  |
| --- | --- |
|  | This section is under development. |

### RequestSelectorMap

|  |  |
| --- | --- |
|  | This API is marked as experimental. Breaking changes **might** happen even in minor releases. |

The `RequestSelectorMap` can be used to customize the requests of the default data providers of the Management modules.
The modules internally uses a default variant of this map, but you can provide your own implementation containing your customizations.
Then it will be used in place of the default one.

For example, customizing the way the Data Provider loads a single document can look like this:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 ``` | ``` /**  * Here, requests for loading documents are customized with another parameter.  * Instead of reusing the default, you could also create your own.  */ export const CustomRequestSelectorMap: RequestSelectorMap = { 	...DefaultRequestSelectorMap, 	loadDocument(config) { 		return (state) => { 			const defaultRequest = DefaultRequestSelectorMap.loadDocument(config)(state);  			return { 				...defaultRequest, 				params: { 					...defaultRequest.params, 					additionalParam: "customValue" 				} 			}; 		}; 	} };  /**  * Then you can now use the `CustomRequestSelectorMap` when creating the Pages/Fragments modules for the CMS.  * <project>/client/src/modules/index.ts  */  export const ALL_MODULES = [ 	// other modules... 	ContentManagementFactories.createPagesModule({ requestSelectorMap: CustomRequestSelectorMap }), 	ContentManagementFactories.createFragmentsModule({ requestSelectorMap: CustomRequestSelectorMap }) ]; ``` |
```

Note that it is mandatory to spread the `DefaultRequestSelectorMap` when customizing.

This customization approach can also be used in combination with the RequestFilter API
(described in the [Data Services documentation](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#json-rpc-modifying-requests)),
for example to use your own operation methods.
Customizing the `RequestFilter` alone would not be enough when the method replacement needs some context
(e.g. only overriding methods in certain conditions). Using the `RequestSelectorMap` could then be used to provide this context down for the filter to use.

## API Documentation

API documentations can be found here:

* [Management Type Definitions API documentation](https://geta12.com/docs/2025.06/ext5/cms/cms-dev-docs/assets/generated/typedoc/management-types/index.html)
* [Utility Server Connector API documentation](https://geta12.com/docs/2025.06/ext5/cms/cms-dev-docs/assets/generated/typedoc/server-connector/index.html)
* [Content Management API documentation](https://geta12.com/docs/2025.06/ext5/cms/cms-dev-docs/assets/generated/typedoc/management/index.html)
* [Content Viewer API documentation](https://geta12.com/docs/2025.06/ext5/cms/cms-dev-docs/assets/generated/typedoc/viewer/index.html)

## Migration Instructions

### 2025.06-ext2

#### Breaking Changes

##### Drop /pagegraph endpoint

Thanks to the new Data Services Query API, the old `/pagegraph` endpoint has been removed along with the related
`com.mgmtp.a12.cms/cms-core` Java package. In the Client side, all you need to do is to replace the
server connector call with a PageGraph.build directly as following:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 ``` | ``` // Previous import { PageGraph } from "@com.mgmtp.a12.cms/cms-server-connector";  const { modelGraph, pageGraph } = yield* all({ 	modelGraph: call(() => serverConnector.fetchData(ModelGraph.build(true)).then((r) => r.json() as Promise<ModelGraph>)), 	pageGraph: call(() => serverConnector.fetchData(PageGraph.build()).then((r) => r.json()) as Promise<PageGraph>) });  // Now  import { PageGraph } from "@com.mgmtp.a12.cms/cms-viewer";  const { modelGraph, pageGraph } = yield* all({ 	modelGraph: call(() => serverConnector.fetchData(ModelGraph.build(true)).then((r) => r.json() as Promise<ModelGraph>)), 	pageGraph: call(PageGraph.build) }); ``` |
```

### 2025.06

|  |  |
| --- | --- |
|  | Please have a look at [Migration to latest A12](https://geta12.com/docs/OVERALL/migration_guide/index.html) chapter for an explanation of general steps. |

#### Breaking Changes

##### Migration to ESM

The npm artifact `@com.mgmtp.a12.cms/cms-viewer`, `@com.mgmtp.a12.cms/cms-server-connector`, `@com.mgmtp.a12.cms/cms-management`, `@com.mgmtp.a12.cms/cms-management-types` were migrated
from CommonJS to [ESM](https://nodejs.org/api/esm.html#modules-ecmascript-modules).
When using Node `22.12+` and modern build tools, there should be no changes necessary to your bundler setup.

|  |  |
| --- | --- |
|  | If your tests depend on mocking/stubbing CMS or CE API, consult the documentation of your test runner on how to work with ES modules. |

Migrating your own application to ESM is not required, but recommended. Consult the documentation of your bundler for specifics.

##### Updating to ES2024

The javascript output of the npm artifacts was updated from `ES2020` to `ES2024` to be able to use latest language features.
When using supported browsers, there is no change necessary. If support for older browsers is required, make sure to include necessary polyfills.

##### React 19 upgrade

We dropped the support for React 18 and older and now require React 19 as our peerDependency.
This means you have to perform the React 19 migration, which is described in great detail in the official
[React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide). They have codemods that should make the transition straightforward.

Additionally, we have decided to not also include a Redux update, to minimize the migration effort.
The "react-redux" library does not have React 19 as a peerDependency, but still works fine with it.
One solution is to override the dependency in your package.json. You also have to update the corresponding "@types/react-redux" typings to at least 7.1.34.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` { 	"overrides": { 		"react-redux": { 			"react": "^19" 		} 	}, 	"devDependencies": { 		"@types/react-redux": "^7.1.34" 	} } ``` |
```

##### Styled-components v6 upgrade

We dropped the support for `styled-components` v5 and now require v6 as our peerDependency.
Please refer to the [styled-components guide](https://styled-components.com/docs/faqs#what-do-i-need-to-do-to-migrate-to-v6) and Widgets migration notes for more information.

### Migration Tool

Unlike other engine model migrations, the models in CMS are stored inside the running server
instead of being persisted in the project repository. Therefore, migrating these models requires a different approach.

To migrate those models, first install or update the CMS migration tool:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm install --save-dev @com.mgmtp.a12.cms/cms-model-migration ``` |
```

Then run the following command to perform the migration

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx cms-model-migration --api-endpoint <api-endpoint> --auth-method <method> --username <username> --password <password> ``` |
```

Where:

* `<api-endpoint>` is your server’s API endpoint (usually ends with `/api`).
* `<method>` can be `basic` or `header`.

If using the `basic` method, provide the `<username>` and `<password>` of a user with at least `MODEL_READ` and `MODEL_UPDATE` permissions.

If using the `header` method, omit `--username` and `--password`, and instead specify `--auth-header` with the value
of the `Authorization` request header to be used in subsequent requests.

Use the `--help` (alias `-h`) flag to view all available options.

*Examples*

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx cms-model-migration --api-endpoint http://localhost:9090/api --auth-method basic --username admin --password admin ``` |
```
