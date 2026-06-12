---
source: https://geta12.com/docs/2025.06/ext5/relationship_engine/relationshipengine-dev-docs/index.html
category: relationship_engine
docid: relationshipengine-dev-docs
scraped: 2026-06-12
---

# Relationship Engine & CDM

## Introduction

The *Relationship Engine* package provides an extension that allows users to manage relationships between Document Models in the Client.

A general documentation describing the basic concepts of the Relationship feature can be found in the mgm A12 overall documentation.

It also provides the Simple Composed Data Model (SCDM) extension which is currently an experimental feature that builds on the relationships extension and the new documentGraph extension and provides an optimized UI for editing sets of documents in the context of a certain use case of the target application.

## Getting Started

### Installation

Relationship Engine & CDM is provided as a npm package containing ES5 CommonJS modules. Run the following command to install:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm install @com.mgmtp.a12.relationshipengine/relationshipengine-core ``` |
```

### Setup

#### Relationship Engine

Using basic relationships requires adapting your client application setup in the following way, adding the relationship data provider, sagas and reducers:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 ``` | ``` import { RelationshipFactories, RelationshipReducers } from "@com.mgmtp.a12.relationshipengine/relationshipengine-core";  export function setup(model: ApplicationModel): ApplicationSetup { 	const dataHandlers: DataHandler[] = [ 		RelationshipFactories.createRelationshipDataProvider() 		/* ...others */ 	];  	return ApplicationFactories.createApplicationSetup({ 		// ...other props 		model, 		modelLoader: createPlatformServerModelLoader(), 		dataHandlers, 		customSagas: [...RelationshipFactories.createSagas({ dataHandlers }) /* ...others */], 		dataReducers: [ 			...RelationshipReducers.dataReducers 			// ...others 		] 	}); } ``` |
```

To easily enable displaying and editing relationships in the application ui, we recommend using the `CRUDViews.FormEngineView` which supports the integration of the Relationship Engine by default.

Your viewProvider could look like the following, providing the CRUD views:

src/main/viewFactory.tsx

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 ``` | ``` import React from "react";  import { FrameFactories, type View } from "@com.mgmtp.a12.client/client-core"; import { CRUDViews } from "@com.mgmtp.a12.crud/crud-core";  export function viewProvider(componentName: string): React.ComponentType<View> { 	return FrameFactories.viewProvider(componentName) || crudViewProvider(componentName) || Placeholder; }  const crudViewProvider = createCRUDViewProvider();  function createCRUDViewProvider(): (componentName: string) => React.ComponentType<View> | undefined { 	const components: { [name: string]: React.ComponentType<View> | undefined } = { 		FormCRUD: CRUDViews.FormEngineView, 		OverviewCRUD: CRUDViews.OverviewEngineView 	};  	return function provider(name) { 		return components[name]; 	}; }  function Placeholder(): React.ReactNode { 	return <div>ERROR: NO COMPONENT FOUND</div>; } ``` |
```

#### SCDM

SCDM requires some global application setup configuration for the following properties:

* Middlewares / Sagas
* Reducers
* DataProvider

Please see the following code for an example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 ``` | ``` import { 	cddDataHolderReducerExtension, 	cddReducers, 	cdmSagas, 	createCddDataProvider, 	createCdmMiddlewares, 	dgReducerFactory } from "@com.mgmtp.a12.relationshipengine/relationshipengine-core";  export function setup(model: ApplicationModel): ApplicationSetup { 	return ApplicationFactories.createApplicationSetup({ 		// ...other props 		model, 		modelLoader: createPlatformServerModelLoader(), 		dataHandlers: [createCddDataProvider() /*others */], 		additionalMiddlewares: [...createCdmMiddlewares() /* others*/], 		customSagas: [...cdmSagas() /* others*/], 		dataReducers: [ 			...dgReducerFactory(cddDataHolderReducerExtension), 			...cddReducers 			// other, 		] 	}); } ``` |
```

|  |  |
| --- | --- |
|  | The scdm feature requires that the model graph is loaded during the initialization of your client application. Please refer to the [Client Documentation](https://geta12.com/docs/CLIENT/client-documentation-bundle/index.html) for more info. |

|  |  |
| --- | --- |
|  | The CDM middlewares replace the ones provided by the Form Engine extension with `createFormEngineMiddlewares()`. Make sure that you either include one or the other, but not both!  The same is true for the `cdmSagas`, which already incorporate the functionality of the `formEngineSagas` from the form engine package. So again, only include one of them! |

## Features

### Relationship Engine

The Relationship Engine visualizes links and candidates of a relationship according to the configuration of the Relationship UI configuration.

#### Relationship UI Configuration

The Relationship UI configuration is the melting pot of all models and UI components used to display a relationship. A typical model looks like the following:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 ``` | ``` { 	"name": "ProductBrand-UiConfig-1", 	"metaInformation": { 		"version": "1.0.0" 	}, 	"relationshipName": "ProductBrand", 	"targetRole": "Brand", 	"components": [ 		{ 			"id": "1", 			"name": "DropDownSelection", 			"models": [ 				{ 					"modelType": "overview", 					"name": "ProductBrand-Brand-LinkOverview", 					"use": "link" 				}, 				{ 					"modelType": "overview", 					"name": "BrandLink-overview", 					"use": "candidate" 				}, 				{ 					"modelType": "form", 					"name": "ProductBrand-LinkForm", 					"use": "link" 				} 			] 		} 	] } ``` |
```

It consists of..

* a unique name
* the name of the referenced Relationship model
* the side of the relationship which shall be displayed (called "target role")
* a list of component configurations used to visualize the relationship

Each component configuration contains..

* a unique component ID
* the ID of the View which shall be rendered (see [Views](#/relationships/view))
* a list of models which are required to render the view
* additional properties which may be required by individual views

In general only the first component of the list is rendered by the engine, but individual views allow a reference to another component (see [Table List](#/relationships/table-list) as an example).

#### Views

A relationship can be displayed in several variants. Four views are provided by default, but projects can define their own UI.

Every default view requires an Overview Model for links and an Overview Model for candidates since the related documents are based on different result Document Models.

##### Drop Down Selection

A drop down selection allows the selection of a single link. Candidates are displayed in a drop down list, the selected link is shown in the input field.
By default, only the first 10 relevant candidates are shown, the remaining candidates will be displayed by clicking the "See More" button.

|  |  |
| --- | --- |
|  | * If no default sorting is specified, the candidate list is sorted by `__meta/createdAt` in descending order. * Case is ignored during sorting (`ignoreCase` is set to true). |

To provide a better modeling experience we have decided to reuse Overview Models for this component. The field value of the first overview column is used to display the link / candidate document.

![Drop Down Selection](https://geta12.com/docs/2025.06/ext5/relationship_engine/relationshipengine-dev-docs/assets/images/drop_down.png)

Use `"name": "DropDownSelection"` in the UI configuration to present your relationship like this.
The view requires the following models:

| modelType | use | Description |
| --- | --- | --- |
| "overview" | "link" | Overview Model to display link documents (the field value of the first overview column is used) |
| "overview" | "candidate" | Overview Model to display candidate documents (the field value of the first overview column is used) |
| "form" | "link" | Form Model describing the form used to modify the link document.  The form is shown when adding new links or by pressing the edit button. If no link Document Model is specified for the relationship, this Form Model is not required. Please bind this view to a form control when using the Form Engine integration. |

##### Dual Pane Selection

With the dual pane selection users can manage multiple links for a document. All candidates are shown on the left, links are shown on the right side. Added links are highlighted green, removed links red. As soon as the changes are saved, the highlighting will be cleared.

The list of candidates can be filtered, sorted and paginated while the link table can only be paginated.
The sorting behavior for the candidate list is similar to the [Drop Down Selection](#_drop_down_selection).
Furthermore, it’s not possible to add custom row actions to the overview tables and the content box cannot be customized using the Overview Model.

![Dual Pane Selection](https://geta12.com/docs/2025.06/ext5/relationship_engine/relationshipengine-dev-docs/assets/images/dual_pane.png)

Use `"name": "DualPaneSelection"` in the UI configuration to present your relationship like this.
The view requires the following models:

| modelType: | use: | Description |
| --- | --- | --- |
| "overview" | "link" | Overview Model to display link documents |
| "overview" | "candidate" | Overview Model to display candidate documents |
| "form" | "link" | Form Model describing the form used to modify the link document.  The form is shown when adding new links or by pressing the edit button. If no link Document Model is specified for the relationship, this Form Model is not required. Please bind this view to a form custom screen element when using the Form Engine integration. |

##### Table List

Some use cases may focus on a plain table listing the links without modifying them directly. The table list can be used for these scenarios.

Use `"name": "TableList"` in the UI configuration to present your relationship like this.
The view requires the following models:

| modelType | use | Description |
| --- | --- | --- |
| "overview" | "link" | Overview Model to display link documents |
| "overview" | "candidate" | Overview Model to display candidate documents |

For the table list an additional property "editComponent" can be specified in the "props" section of the component configuration. If another component configuration in the Relationship UI configuration exists with the ID given in the properties value, an edit button is displayed. When the button is clicked, the referenced edit component is displayed.

As an example, the following Relationship UI configuration …

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 ``` | ``` { 	"name": "ProductBrand-UiConfig-1", 	"metaInformation": { 		"version": "1.0.0" 	}, 	"relationshipName": "ProductBrand", 	"targetRole": "Product", 	"components": [ 		{ 			"id": "1", 			"name": "TableList", 			"linkPageSize": 2, 			"candidatePageSize": 3, 			"models": [ 				{ 					"modelType": "overview", 					"name": "ProductBrand-Product-LinkOverview", 					"use": "link" 				}, 				{ 					"modelType": "overview", 					"name": "ProductLink-overview", 					"use": "candidate" 				} 			], 			"props": { 				"editComponent": "2" 			} 		}, 		{ 			"id": "2", 			"name": "DualPaneSelection", 			"models": [ 				{ 					"modelType": "overview", 					"name": "ProductBrand-Product-LinkOverview", 					"use": "link" 				}, 				{ 					"modelType": "overview", 					"name": "ProductLink-overview", 					"use": "candidate" 				}, 				{ 					"modelType": "form", 					"name": "ProductBrand-LinkForm", 					"use": "link" 				} 			], 			"candidatePageSize": 3 		} 	] } ``` |
```

… will show a table list with edit button which will open a dual pane selection ..

![Table List Modal](https://geta12.com/docs/2025.06/ext5/relationship_engine/relationshipengine-dev-docs/assets/images/table_list_modal.png)

Sorting and Filtering the listed links is not supported in the default table list.

Please bind this view to a form custom screen element when using the Form Engine integration.

|  |  |
| --- | --- |
|  | The relationship feature currently does not support multiple different usages of the same Relationship Model. For example you can not have multiple bindings for the same Relationship Model and use different Overview Models (with different settings). There is always only one configuration used for querying the candidates and the links respectively. This means that if you use two relationship components together (like shown above), they will always use the paging, sorting & filtering settings of the first component. If an optional setting is left empty in the first component, its default value will be used. |

##### Custom UI (Experimental)

In addition to the default views mentioned above, projects can provide their own UI. To do so, they have to specify an own component provider as Relationship Engine property. The provider receives a component configuration and returns a React component providing one of the following interfaces:

* **ListProps** - Provides properties required to show links in a readonly list. Views should use this interface to provide a UI similar to the table list.
* **SingleSelectionProps** - Provides properties required to render a UI for the selection of a single link. Views should use this interface to provide a UI similar to the drop down selection.
* **MultiSelectionProps** - Provides properties required to render a UI for the selection of multiple links at the same time. Views should use this interface to provide a UI similar to dual pane selection.

We consider customization of the components to be an experimental feature at the moment.

##### Custom Localization

All labels rendered by components of the relationship extension can be localized.

The extension comes with a localizer service, that can be created via a factory. It has to be configured among the application’s localizer services to localize all multilingual texts defined in the Relationship Model and UI configuration.

If a particular label shall be localized independently of the model definition, the key can be overwritten by defining an own localizer service. The following keys are available:

* `relationship.ui-configuration.<name of the ui configuration>.<id of the custom component>.dual-pane.available-items.title` - Title of the candidate table in Dual Pane
* `relationship.ui-configuration.<name of the ui configuration>.<id of the custom component>.selected-items.title` - Title of the link table in Dual Pane
* `relationship.relationshipModel.<name of the relationship>.<name of the role>.labels` - The display label of a relationship role

The localization keys of static texts, which are not defined by models, are provided by the constant `RELATIONSHIP_RESOURCE_KEYS` which is located in `extensions/relationship`. This constant provides the keys as well as the documentation of their usage.

#### Link Form

A link between entities can have its own properties, e.g. the amount of a product in a bundle or the production site of a product for a brand.

Those properties need to be defined in a link Document Model and the respective UI requires a link Form Model.

If the link Form Model is provided in the Relationship UI configuration, then on creating a new link, a Form Engine will be shown in a modal, where the user can enter values for the link properties.

![Link Form Modal](https://geta12.com/docs/2025.06/ext5/relationship_engine/relationshipengine-dev-docs/assets/images/link_form_modal.png)

The shown Form Engine has some limitations, as it cannot be customized via properties and engine options.

#### Form Engine Integration

In most cases the Relationship Engine shall be integrated into a form. To do so, a custom Form Model map (RelationshipFormModelMap) has to be used by the Form Engine view.

If the map finds a custom screen element having a matching binding configuration of type "relationship", a relationship UI configuration is expected as configuration. This model is used to render the Relationship Engine. The CRUD Form Engine view supports this integration by default.

Please note that properties of the bound custom screen element / custom cell defined in the Form Model (e.g. a custom screen element title) are not considered by the Relationship Engine. If you intend to use the custom screen element title to structure your screen, please wrap the bound element with an additional section having the desired title.

##### Custom Form Engine

If you want to customize your Form Engine view (e.g. via the `FormModelMap`), you will have to integrate the Relationship Engine yourself as the CRUD extension does not support customization. You can achieve this by passing the `RelationshipFormModelMap` to the Form Engine component.

Take a look at the following code for an example:

Relationship Engine integration

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 ``` | ``` import React from "react";  import { FormEngineViews, DefaultFormModelMap } from "@com.mgmtp.a12.formengine/formengine-core"; import { RelationshipFormModelMap } from "@com.mgmtp.a12.relationshipengine/relationshipengine-core";  type RelationshipFormEngineViewProps = Omit<FormEngineViews.FormEngineProps, "widgetMap" | "formModelMap">;  export function RelationshipFormEngineView(props: RelationshipFormEngineViewProps): React.ReactNode { 	return ( 		<FormEngineViews.FormEngine 			{...props} 			formModelMap={{ 				...DefaultFormModelMap, 				...RelationshipFormModelMap 				// add your own customization here 			}} 		/> 	); } ``` |
```

When adding your own customization to the `FormModelMap`, be sure to return the correct default component as shown in the following example:

Customized FormModelMap

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 ``` | ``` import React from "react";  import { type FormModel, DefaultFormModelMap, type FormModelMap } from "@com.mgmtp.a12.formengine/formengine-core"; import { RelationshipFormModelMap } from "@com.mgmtp.a12.relationshipengine/relationshipengine-core";  export const CustomFormModelMap: FormModelMap = { 	...DefaultFormModelMap, 	...RelationshipFormModelMap, 	Screen: { component: CustomScreen }, 	CustomScreenElement: { component: CustomScreenElement } };  function CustomScreen(props: FormModelMap.FormModelComponentProps<FormModel.Screen>): React.ReactNode { 	// render custom screen conditionally 	const condition = props.modelElement.id === "customScreen";  	if (condition) { 		return <div>Custom screen</div>; 	}  	// fallback to the Screen from the DefaultFormModelMap 	return <DefaultFormModelMap.Screen.component {...props} />; }  function CustomScreenElement( 	props: FormModelMap.FormModelComponentProps<FormModel.CustomScreenElement> ): React.ReactNode { 	// render custom screen element conditionally 	const condition = props.modelElement.id === "customScreenElement";  	if (condition) { 		return <div>Custom screen element</div>; 	}  	// The RelationshipFormModelMap already provides a custom screen element, 	// so it has to be returned (instead of the one from the DefaultFormModelMap) 	return <RelationshipFormModelMap.CustomScreenElement.component {...props} />; } ``` |
```

#### Model Overview

When modeling relationships a lot of models are involved. This section should provide a short overview to put you back on track. As example we focus on the Relationship between products and brands. In a brand form assigned products shall be managed via a dual pane selection.

![Model Overview for Relationships](https://geta12.com/docs/2025.06/ext5/relationship_engine/relationshipengine-dev-docs/assets/images/model_overview.png)

Before the introduction of the Relationship feature it was possible to define:

* A **Document Model** "Product" describing the properties of a product
* A **Form Model** "Product Form" showing a form to enter the product properties
* An **Overview Model** "Product Overview" showing products in a table

The same applies to brands.

It was not possible to model a connection between these entities.

From now on we can use a **Relationship Model** "ProductBrand" to define this connection. In our example the model specifies that multiple products are assigned to a brand and only one brand can be assigned to a product. If additional fields shall be defined for this Relationship, another Document Model "ProductBrand" can be referenced. It is called **"Link Document Model"** in this context.

The dual pane selection requires two Overview Models - one to define the candidate table (based on the "Product" Document Model) and one to define the link table. Link result documents are a combination of fields defined in the "Product" Document Model and fields defined in the **Link Document Model**. To reference this combination in the Overview Model another Document Model is required: The **Link Result Document Model**. It can be generated from the platform server.

If a **Link Document Model** is referenced in the **Relationship Model**, an additional Form Model is required for a form to modify the link document. It is called "ProductBrand Form" in the overview above.

The **Relationship UI configuration** references the view, the used overview / Form Models and the **Relationship Model** to show. To integrate the relationship directly in the form, the Relationship UI configuration is defined as a **binding configuration** in the "Brand Form" Form Model.

#### Fields projection

Fields projection are partially supported by the relationship bindings, including the loading of candidates and links table.
However, the link document fields shall not be projected and the binding will request a full document in all cases.
Customization of projected fields can be done via the Server Connector middlewares and should be done in a cautious approach to avoid removing the mandatory fields.
Please consult Data Services documentation for more details.

### Simple Composed Data Model

|  |  |
| --- | --- |
|  | Customizing of Form Model elements (by way of the FormModelMap) does not work in combination with CDM. Trying to do so might result in errors. |

#### Preparation

The modeling of SCDM is based on

* Multiple Document Models: Used for the individual entities (domain models) and the aggregate (CDM)
* A single Form Model: Used to model the form UI
* Multiple Bindings: Configuration of the relationship UI components and placement inside the form
* Multiple Overview Models: Configuration of the links and candidate columns

All models are regular A12 models. The CDM and the Form Model use annotations and existing features in a slightly extended way to allow the modeling of a CDM (form).

Please refer to the Business Analyst documentation for a detailed description on how to create CDMs.

#### View component

The SCDM connected view via Form Engine is offered by default via the `CRUDViews.FormEngineView` component. However, in case CRUD is not used, a manual registration of `FormModelMap` and `cddAdapter` should be taken care.

##### Registration

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` export function FormEngineWithRelationship(props: View): React.JSX.Element { 	const stateProps = useSelector((state: object) => { 		const activity = ActivitySelectors.activityById(props.activityId)(state); 		if (!activity) { 			return; 		} 		const adaptedState = cddActivityStateAdapter(activity)(state); 		return FormEngineStateAdapter.mapStateToProps(adaptedState, { ...props, formModelMap: CustomFormModelMap }); 	}); 	const dispatch = useDispatch();  	const dispatchProps = FormEngineActions.mapDispatchToProps(dispatch, props);  	return <FormEngineViews.FormEngineTpl {...props} {...stateProps} {...dispatchProps} />; }  const CustomFormModelMap: FormModelMap = { 	...DefaultFormModelMap, 	...RelationshipFormModelMap }; ``` |
```

##### View Customization

The SCDM exposes a `componentProvider` API as a way to customizing its components, e.g.: `DualPaneSelection`, `TableList`. In order to make a customized component, instead of using `RelationshipFormModelMap`, the `createRelationshipFormModelMap` shall be called as follows

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 ``` | ``` const CustomFormModelMap: FormModelMap = { 	...DefaultFormModelMap, 	...createRelationshipFormModelMap({ 		componentProvider: config => { 			if (config.name === "DualPaneSelection") { 				return { type: "MultiSelection", component: CustomDualPane }; 			} else if (config.name === "TableList") { 				return { type: "List", component: CustomTableList }; 			} 			return undefined; 		} 	}) };  function CustomDualPane(props: RelationshipViews.MultiSelectionProps) { 	const assignments = React.useMemo(() => { 		if (props.assignments.loadingState !== "loaded") { 			return props.assignments; 		} 		return { ...props.assignments, data: [...props.assignments.data].reverse() }; 	}, [props.assignments]);  	return <DualPaneSelection {...props} assignments={assignments} />; }  function CustomTableList(props: RelationshipViews.ListProps) { 	const items = React.useMemo(() => { 		if (!props.items || props.items.loadingState !== "loaded") { 			return props.items; 		} 		return { ...props.items, data: [...props.items.data].reverse() }; 	}, [props.items]); 	return <TableList {...props} items={items} />; } ``` |
```

|  |  |
| --- | --- |
|  | SCDM APIs are under experimental stage and subject to be changed even in a minor release. Therefore, customizations to the view components should be done in a cautious approach, e.g.: in the `CustomDualPane` example, a change to ordering of the `assignments` array are safe, but removing/adding an item from/to `assignments` are not recommended and should always be avoided. |

#### Fields projection

Fields projection are not supported by CDM bindings. However, the candidates table which is re-used from the normal binding does have support for the fields projection hence can be customized.

### Relationship Engine & CDM Actions

For the current stage, Relationship Engine & CDM actions are internal, it is not encouraged
for developers have access to these actions.

### Custom RequestSelectorMap

|  |  |
| --- | --- |
|  | This API is marked as experimental. Breaking changes **might** happen even in minor releases. |

The `RequestSelectorMap` can be used to customize how the Relationship Engine & CDM produces Data Services Query API requests.
A `DefaultRequestSelectorMap` is shipped, but it is possible to inject a custom map to tweak queries and mutations without involving internal logic.

#### What it controls

The map exposes selector factories that return JSON-RPC request objects. Relationship & CDM use these exclusively for server calls:

* Queries

  + `loadCandidates` – load candidate documents for a relationship
  + `loadLinks` – load link documents for a relationship
  + `loadDocumentGraph` – load the document graph for the CDM
* Mutations

  + `addDocument`, `modifyDocument`, `deleteDocument` – document CRUD
  + `addLink`, `modifyLink`, `deleteLink` – link CRUD

All mutation builders return selectors, so it is possible to access app state within each selector (e.g.: the locale can be derived via `LocaleSelectors.locale()(state)).

#### Injecting a custom map

You can inject a custom implementation into both providers:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` // Provide the custom map to the Relationship data provider RelationshipFactories.createRelationshipDataProvider({ requestSelectorMap: CustomRequestSelectorMap }); ``` |
```

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` // Provide the same custom map to the CDM data provider createCddDataProvider({ requestSelectorMap: CustomRequestSelectorMap }); ``` |
```

#### Example: add a default sort for queries

The following example adds a default sort to `loadCandidates`/`loadLinks` when none is provided, while delegating all other behavior to the default implementation.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 ``` | ``` import { Query } from "@com.mgmtp.a12.dataservices/dataservices-access"; import { 	createCddDataProvider, 	DefaultRequestSelectorMap, 	RelationshipFactories, 	type RequestSelectorMap } from "@com.mgmtp.a12.relationshipengine/relationshipengine-core";  /**  * Extend the default RequestSelectorMap with small tweaks.  *  * - Add a default sort to loadCandidates/loadLinks when none is provided.  * - Keep all other behaviors (including locale resolution for document mutations) intact by  *   spreading the DefaultRequestSelectorMap.  */ export const CustomRequestSelectorMap: RequestSelectorMap = { 	...DefaultRequestSelectorMap, 	loadCandidates: (config) => { 		const customSort: Query.Order[] = config.sort?.length 			? config.sort 			: [ 					{ 						field: "/product/sku", 						direction: Query.Direction.DESC, 						ignoreCase: false, 						nullHandling: Query.NullHandling.NULLS_LAST 					} 				]; 		return DefaultRequestSelectorMap.loadCandidates({ ...config, sort: customSort }); 	}, 	loadLinks: (config) => { 		let constraint = config.constraint; 		if (config.targetDocumentModel === "Contract-document") { 			const mustBeActive: Query.ExactMatchOperator = { 				operator: Query.OPERATORS.EXACT_MATCH_OPERATOR, 				field: "/contract/status", 				value: "ACTIVE" 			}; 			constraint = constraint 				? { operator: Query.OPERATORS.AND_OPERATOR, operands: [constraint, mustBeActive] } 				: mustBeActive; 		} 		return DefaultRequestSelectorMap.loadLinks({ ...config, constraint }); 	} }; ``` |
```

|  |  |
| --- | --- |
|  | Always spread `DefaultRequestSelectorMap` when customizing. |

#### Request Filters

This customization approach can also be used in combination with the RequestFilter API (described in the [Data Services documentation](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#json-rpc-modifying-requests)), for example to use your own operation methods.
Customizing the `RequestFilter` alone would not be enough when the method replacement needs some context (e.g. only overriding methods in certain conditions). Using the `RequestSelectorMap` could then be used to provide this context down for the filter to use.

## API Documentation

The API documentation can be found [here](https://geta12.com/docs/2025.06/ext5/relationship_engine/relationshipengine-dev-docs/assets/generated/typedoc/index.html).

## Migration Instructions

### 2025.06

|  |  |
| --- | --- |
|  | Please have a look at [Migration to latest A12](https://geta12.com/docs/OVERALL/migration_guide/index.html) chapter for an explanation of general steps. |

#### Migration to ESM

The npm artifact `@com.mgmtp.a12.relationshipengine/relationshipengine-core` was migrated
from CommonJS to [ESM](https://nodejs.org/api/esm.html#modules-ecmascript-modules).
When using Node `22.12+` and modern build tools, there should be no changes necessary to your bundler setup.

|  |  |
| --- | --- |
|  | If your tests depend on mocking/stubbing Relationship Engine API, consult the documentation of your test runner on how to work with ES modules. |

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

#### Remove the option to enable Query API

Since the Data Services Query API is integrated by default, the option to enable Query API have been removed.

Register Relationship Engine 2.0.0

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` import { RelationshipFactories, createCddDataProvider } from "@com.mgmtp.a12.relationshipengine/relationshipengine-core";  // appsetup.ts const dataHandlers: DataHandler[] = [     ...otherDataHandlers,     createCddDataProvider(),     RelationshipFactories.createRelationshipDataProvider(), ]; ``` |
```

#### Replace `cddDataProvider` by `createCddDataProvider()`

The `cddDataProvider` has been moved to internal. Use `createCddDataProvider()` instead.

#### Removal of Quadro Pane

In 2025.06, the **Quadro Pane** is completely removed.
For more details, refer to 2024.06 documentation.

#### Customizing the Progress Indicator After Client Container API Removal

Since the Client Container API has been removed in this release,
customizing the progress indicators requires wrapping the desired React component with the `ProgressIndicatorContextProvider`, as shown below:

Customizing the Progress Indicator After Client Container API Removal

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 ``` | ``` // Before import { Container } from "@com.mgmtp.a12.client/client-core/lib/core/configuration/index.js";  Container.config.rebind(Container.identifier.UISettings).toConstantValue({ 	progressIndicatorDelay: 500, 	progressIndicatorDisableFastAppear: true, 	progressIndicatorLabelKey: "a12.progressIndicator.label" });  // After import { type Container } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/base-props.js"; import { ProgressIndicatorContextProvider } from "@com.mgmtp.a12.relationshipengine/relationshipengine-core";  export const RelationshipComponent: React.FC<Container> = (props) => { 	return ( 		<ProgressIndicatorContextProvider 			progressIndicatorDelay={500} 			progressIndicatorDisableFastAppear={true} 			progressIndicatorLabelKey={"a12.progressIndicator.label"}> 			{props.children} 		</ProgressIndicatorContextProvider> 	); }; ``` |
```

#### Sorting behavior

From 2025.06 version, sorting behavior for the candidate list is changed.

* Case is ignored during sorting (`ignoreCase` is set to true).
* If no default sorting is specified, the candidate list is sorted by `__meta/createdAt` in descending order.
