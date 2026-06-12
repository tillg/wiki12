---
source: https://geta12.com/docs/2025.06/ext5/crud/crud-dev-docs/index.html
category: crud
docid: crud-dev-docs
scraped: 2026-06-12
---

# CRUD

## Introduction

The CRUD package contains a client extension which provides components to specifically resemble a [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) UI.

It is useful for analysts / modelers during development phase. It is totally OK to use it in production **as long as it is used as a drop-in component without any customizing**.

## Getting Started

### Installation

The CRUD extension is provided as npm package containing ES5 CommonJS modules. Run the following command to install:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm install @com.mgmtp.a12.crud/crud-core ``` |
```

### Setup

#### Setup application

To use the CRUD extension in you client application, you only need to register a middleware and some sagas in the application setup as shown below. They can be obtained via the `CRUDFactories`.

Setting up the CRUD extension in a client application

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` import { type Middleware } from "redux"; import { type SagaIterator } from "redux-saga";  import { ApplicationFactories, type ApplicationSetup } from "@com.mgmtp.a12.client/client-core"; import { CRUDFactories } from "@com.mgmtp.a12.crud/crud-core";  export function setup(): ApplicationSetup { 	return ApplicationFactories.createApplicationSetup({ 		...otherConfigurations, 		additionalMiddlewares: [...otherMiddlewares, CRUDFactories.createCRUDMiddleware()], 		customSagas: [...otherPlatformSagas, ...CRUDFactories.createSagas()] 	}); } ``` |
```

To make the CRUD Views available, adapt the viewProvider of your application. Then you can refer to the view component names, e.g. "OverviewCRUD", in the VIEW\_ADD directives of your application model.

Providing CRUD views

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 ``` | ``` import React from "react";  import { FrameFactories, type View } from "@com.mgmtp.a12.client/client-core"; import { CRUDFactories } from "@com.mgmtp.a12.crud/crud-core"; import { FormEngineViews } from "@com.mgmtp.a12.formengine/formengine-core";  export function createViewProvider() { 	const formEngineViewProvider = createFormEngineViewProvider();  	return function viewProvider(componentName: string): React.ComponentType<View> { 		return ( 			FrameFactories.viewProvider(componentName) || 			// Provides view component named "OverviewCRUD" 			CRUDFactories.createCRUDRenderer(componentName) || 			// Provides view component named "FormEngine" 			formEngineViewProvider(componentName) || 			Placeholder 		); 	}; }  function createFormEngineViewProvider(): (componentName: string) => React.ComponentType<View> | undefined { 	const components: { [name: string]: React.ComponentType<View> | undefined } = { 		FormEngine(props) { 			return <FormEngineViews.FormEngine {...props} />; 		} 	};  	return function formEngineProvider(name) { 		return components[name]; 	}; }  function Placeholder(): React.ReactNode { 	return <div>ERROR: NO CONTAINER FOUND</div>; } ``` |
```

## Features

The components which are needed to resemble the CRUD UI are:

* The Overview Engine CRUD view from this CRUD extension
* The Form Engine view from the client extension of the form engine package.
* CRUD Sagas and a CRUD Middleware from this CRUD extension

### Overview Component

The Overview Engine view, available via `CRUDFactories.createCRUDRenderer` with the name "OverviewCRUD", is already connected to the store and is pre-configured for the CRUD functionality. It needs the CRUD Sagas to be registered in the application setup, which provide CRUD specific Redux backend functionality.

The OverviewCRUD view handles via the CRUD sagas the following CRUD events from the Overview Model:

* **add:** Initiate an Activity to add a new document
* **delete:** Delete the selected document, which will try to cancel the current detail activity if it has the same instance with the selected document.

Clicking on an overview row triggers the default row action of selecting and opening the document in the Form Engine view. Custom default row actions are not supported by the CRUD extension.

### Form Component

The Form Engine view is also provided as a connected component. It requires the CRUD middleware to be registered in the application setup in order to provide the CRUD functionality.

For the basic Form Engine functionality, a middleware, a saga and special reducers need to be registered in the application setup. Please consult the [Form Engine Documentation](https://geta12.com/docs/ENGINES/formengine-documentation-bundle/index.html#_migration_instructions) for more details.

The Form Engine view handles via the CRUD middleware the following CRUD events from the Form Model:

* **CRUD::SAVE:** Saves the current data of the Activity
* **event\_submit / event\_save:** Commit the current Activity
* **event\_cancel:** Cancel the current Activity

The submit/save events will also trigger a *full validation* in the A12 Form Engine. Note that the further behavior depends on the configured DataProviders, DataLoaders and DataEditors. See [Client Documentation](https://geta12.com/docs/CLIENT/client-documentation-bundle/index.html).

The CRUD extension via the `CRUDViews` namespace also provides the `FormEngineView`, a basic drop-in Form Engine view which has built-in support for rendering relationship ui components.

The CRUD Engines must be used together in order to work correctly.

### Customizing Not Supported

This extension combines a set of features to provide a functionality which is mostly useful for analysts / modelers.

In case you need a different look or behavior, please use the components provided by the overview engine and form engine that are meant for customization.

The CRUD extension exports the namespace `EventNames`, which contains constants for event names of the typical crud events described above and we recommend to use those instead of hard coding the crud event name strings into your custom component.

## API Documentation

The API documentation can be found [here](https://geta12.com/docs/2025.06/ext5/crud/crud-dev-docs/assets/generated/typedoc/index.html).

## Migration Instructions

### 2025.06

Please have a look at [Migration to latest A12](https://geta12.com/docs/OVERALL/migration_guide/index.html) chapter
for an explanation of general steps.

#### Migration to ESM

The npm artifact `@com.mgmtp.a12.crud/crud-core` was migrated
from CommonJS to [ESM](https://nodejs.org/api/esm.html#modules-ecmascript-modules).
When using Node `22.12+` and modern build tools, there should be no changes necessary to your bundler setup.

|  |  |
| --- | --- |
|  | If your tests depend on mocking/stubbing CRUD API, consult the documentation of your test runner on how to work with ES modules. |

Migrating your own application to ESM is not required, but recommended. Consult the documentation of your bundler for specifics.

#### Updating to ES2024

The javascript output of the npm artifacts was updated from `ES2020` to `ES2024` to be able to use latest language features.
When using supported browsers, there is no change necessary. If support for older browsers is required, make sure to include necessary polyfills.

#### React 19 upgrade

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

#### Remove `onDocumentClick` and `onDocumentDoubleClick` callbacks for `OverviewCRUD` component

CRUDViews.OverviewCRUD is now switched to the new OverviewEngine’s ViewComponent, this results in the 2 callbacks
`onDocumentClick` and `onDocumentDoubleClick` no longer available. Refer to OverviewEngine’s migration instruction for more details.
