---
source: https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/index.html
category: overview_engine
docid: overviewengine-dev-docs
scraped: 2026-06-12
---

# Overview Engine

## Introduction

Overview Engine includes model driven UI components based on Widgets library. It provides a convenient way to set up a full-featured Overview view through models configurations and programming interfaces.

This documentation describes in details about features and the integration of Overview Engine into an existing product.

## Getting Started

### Installation

Overview Engine is provided as a npm package in ECMAScript modules (ESM) format. Run the following command to install Overview Engine:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm install @com.mgmtp.a12.overviewengine/overviewengine-core ``` |
```

### Setup

#### Register Overview Engine module

The registration process of Overview Engine is quite simple, it is only required to Overview Engine module and the Application sagas
factory that can not be delivered by the module itself.

Setup the Overview Engine module

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 ``` | ``` import { DirtyHandlingFactories } from "@com.mgmtp.a12.client/client-core/dirtyHandling"; import { OverviewEngineFactories } from "@com.mgmtp.a12.overviewengine/overviewengine-core"; import { ApplicationFactories, type ApplicationSetup, ModuleRegistryProvider } from "@com.mgmtp.a12.client/client-core";  export function setup(): ApplicationSetup { 	ModuleRegistryProvider.getInstance().addModule(OverviewEngineFactories.createModule());  	return ApplicationFactories.createApplicationSetup({ 		...otherConfigurations, 		overridePlatformSagas: [ 			...OverviewEngineFactories.createApplicationSagas(), 			...DirtyHandlingFactories.createSagas() 		] 	}); } ``` |
```

#### Register Overview Engine in non-modular way

However, in case the Overview engine module is not a preferable way to setup the application, Overview Engine’s factories also allow registering in a non-modular way as below:

Setup the Overview Engine in non-modular way

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 ``` | ``` import { type Middleware } from "redux";  import { DirtyHandlingFactories } from "@com.mgmtp.a12.client/client-core/dirtyHandling"; import { OverviewEngineFactories } from "@com.mgmtp.a12.overviewengine/overviewengine-core"; import { 	type Module, 	type DataLoader, 	type DataHandler, 	type DataProvider, 	ApplicationFactories, 	type ActivityReducers, 	type ApplicationSetup, 	ModuleRegistryProvider } from "@com.mgmtp.a12.client/client-core";  export function setup(): ApplicationSetup { 	projectModules.forEach((module) => ModuleRegistryProvider.getInstance().addModule(module));  	const dataHandlers: DataHandler[] = [ 		...projectDataLoaders,  		createEmptyDocumentDataProvider(), 		RelationshipFactories.createRelationshipDataProvider(), 		...OverviewEngineFactories.createDataProviders(), 		new PlatformSingleDocumentDataLoader(localeProvider) 	];  	return ApplicationFactories.createApplicationSetup({ 		...otherConfigurations, 		dataHandlers, 		overridePlatformSagas: [ 			...OverviewEngineFactories.createApplicationSagas(), 			...DirtyHandlingFactories.createSagas() 		], 		additionalMiddlewares: [...OverviewEngineFactories.createMiddlewares(), ...otherMiddlewares], 		dataReducers: [...OverviewEngineFactories.createDataReducers(), ...otherDataReducers] 	}); } ``` |
```

### OverviewEngine component

`OverviewEngine` is the main React component that is used to render an Overview Engine. The props of `OverviewEngine` can belong to one of the following interfaces:

* `OverviewEngine.PaginatedProps`: is used to define paginated Overview Engines. See further details [here](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/view_overview-engine.OverviewEngine.PaginatedProps.html).
* `OverviewEngine.InfiniteScrollProps`: is used when infinite-scrolling is enabled. See further details [here](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/view_overview-engine.OverviewEngine.InfiniteScrollProps.html).

The following snippet presents the above interfaces in details, specifying properties with their corresponding functions:

OverviewEngine Props

```
|  |  |
| --- | --- |
| ```   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49  50  51  52  53  54  55  56  57  58  59  60  61  62  63  64  65  66  67  68  69  70  71  72  73  74  75  76  77  78  79  80  81  82  83  84  85  86  87  88  89  90  91  92  93  94  95  96  97  98  99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127 128 129 130 131 132 133 134 135 ``` | ``` export namespace OverviewEngine { 	export type Props = PaginatedProps | InfiniteScrollProps;  	export interface InfiniteScrollProps extends CommonProps { 		/** 		 * The data that is rendered in overview engine. 		 * As this is for infinite-scroll mode, the data can be discontinuous, having empty elements in the middle 		 */ 		readonly data: (JSONDocument | undefined)[];  		/** 		 * To control infinite-scroll feature 		 */ 		readonly infiniteScrollOptions: OverviewEngineApi.InfiniteScrollOptions; 	}  	export interface PaginatedProps extends CommonProps { 		/** 		 * The data that is rendered in overview engine. 		 */ 		readonly data: JSONDocument[]; 	}  	export interface CommonProps extends Container { 		/** 		 * The document model which overview model links to 		 */ 		readonly documentModel: DocumentModel;  		/** 		 * Sub document models which overview model links to 		 */ 		readonly subDocumentModels?: DocumentModel[];  		/** 		 * The UI model which is used to render overview engine 		 */ 		readonly overviewModel: OverviewModel;  		/** 		 * If given, the id document of current active row 		 */ 		readonly activeRowId?: string;  		/** 		 * This map is to define state for row actions 		 */ 		readonly rowActionState?: OverviewEngineApi.RowActionState;  		/** 		 * The callback controls the style (e.g: interactive,...) of a row 		 */ 		readonly rowStyling?: RowStyleGetter<JSONDocument>;  		/** 		 * To specify aria-level for content box 		 */ 		readonly ariaLevel?: number;  		/** 		 * To enable the card view of the overview table. Useful on small screens. 		 */ 		readonly cardView?: boolean;  		/** 		 * To display overview engine as an embedded element. 		 */ 		readonly embedded?: boolean;  		/** 		 * Event handlers that is used in overview engine 		 */ 		readonly eventHandlers?: OverviewEngineApi.EventHandlers;  		/** 		 * A map of components is used to override the components in the overview engine 		 * The components are expected to have rendering logic based on the overview model, overview engine state and so on 		 * If not given, the {@link DefaultComponentMap} will be used 		 */ 		readonly componentMap?: ComponentMap;  		/** 		 * A map of Widgets components used in the overview engine 		 * These components are expected to focus on the UI, therefore, they are recommended when some UI customizations need to be applied. 		 * If not given, the {@link DefaultWidgetMap} will be used 		 */ 		readonly widgetMap?: WidgetMap;  		/** 		 * @experimental 		 */ 		readonly selectorMap?: SelectorMap;  		/** 		 * The results of statistical operation for each column 		 */ 		readonly summaryResult?: OverviewEngineApi.SummaryResult;  		/** 		 * A property which defines the id prefix for Overview Engine component. 		 */ 		readonly uiIdPrefix?: string;  		/** 		 * A property defines the time mode (12h or 24h) which is used in the date time and time picker 		 */ 		readonly timeMode?: TimePickerProps.ClockMode; 		/** 		 * A property which defines the thumbnail map 		 */ 		readonly thumbnails?: Record<string, string>;  		/** 		 * UI State 		 */ 		readonly uiState?: UiState;  		/** 		 * The total number of documents 		 */ 		readonly totalDocumentsCount?: number;  		/** 		 * The accessibility configurations 		 */ 		readonly accessibilityConfigurations?: OverviewEngineApi.AccessibilityConfigurations;  		/** 		 * @experimental 		 * Reflect the loading state of a Client activity directly to the engine. 		 * This is an experimental feature, so use it with caution. 		 */ 		readonly loadingState?: "without" | "missing" | "loading" | "loaded" | "error"; 	} } ``` |
```

### Query Model integration

Overview Engine can obtain their data according to either

* a Document Model directly referenced in the Overview Model
* a Query Model that contains constraints, sorting information and a reference to a Document Model

Both strategies can be configured in the Overview Model Editor, so switching between them requires no client-side code changes.

#### Document Model Reference

Use this when the overview does not require additional logic beyond what the document model already provides. The engine keeps the document reference as-is, so no extra constraints are injected into the query request. The selector [OverviewEngineSelectors.modelsState()](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/functions/client-extensions_internal_selectors.OverviewEngineSelectors.modelsState.html) resolves this document model immediately and skips any Query Model lookup.

#### Query Model Reference

When the Overview Model references a Query Model, that Query Model becomes the authoritative place to store Base Constraints.

The selector [OverviewEngineSelectors.modelsState()](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/functions/client-extensions_internal_selectors.OverviewEngineSelectors.modelsState.html) can still resolve the document model for compatibility, but now also augments the result with the referenced Query Model.

The Target Document Model specified in the Query Model will be taken as basis for the overview.
Most engine behavior remains unchanged.
But the queries constructed by the engine will take the Query Model into account.
This is outlined in the following sections.

##### Fulltext Search & Filtering

The engine always merges `queryModel.content.constraint` with the respective constraints created for the Fulltext Search and active Filters using an `AND` operator.
This ensures base filtering defined in the Query Model is always applied, regardless of user- or developer-defined Fulltext Searches or Filters.

##### Field Filters & Enumerated String Loaders

Field Filters append their operands to the Query Model’s constraint with an `AND` operator, so ad-hoc UI Filters are applied on top of the Base Query constraint.

For enumerated string filter, the search requests reuse the same merged logic as above, keeping candidate lists aligned with the Base Query constraint.

##### Field Projection

Regardless of the referencing strategy, the engine always uses the column definitions of the Overview Model to compute the resulting Query’s field projection. This guarantees that only necessary Fields are requested from the server.

If additional Fields beyond this default selection are needed, extend the request via the [Custom RequestSelectorMap](#request-selector-map).

##### Sorting & Pagination

The Sorting definition for the initial state of the Overview Engine is taken from the Overview Model.
If no Default Sorting is specified there, the respective settings of the Query Model is used.
If neither specifies a sorting, the engine will add a default sorting based on the \_\_meta/createdAt Field.

When the enduser interacts with the engine, this sorting is applied accordingly.

The Paging definition for the initial state of the Overview Engine is always determined from the Overview Model.
Either directly, if Pagination is chosen, or computed when [Infinite Scrolling](#infinite-scroll) is specified.
In both cases, the setting of the Query Model is neglected.

## Details

### Overview Engine component

`OverviewEngine` is the main React component that is used to render an Overview Engine. The props of `OverviewEngine` can belong to one of the following interfaces:

* `OverviewEngine.PaginatedProps`: is used to define paginated Overview Engines. See further details [here](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/view_overview-engine.OverviewEngine.PaginatedProps.html).
* `OverviewEngine.InfiniteScrollProps`: is used when infinite-scrolling is enabled. See further details [here](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/view_overview-engine.OverviewEngine.InfiniteScrollProps.html).

The following snippet presents the above interfaces in details, specifying properties with their corresponding functions:

OverviewEngine Props

```
|  |  |
| --- | --- |
| ```   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49  50  51  52  53  54  55  56  57  58  59  60  61  62  63  64  65  66  67  68  69  70  71  72  73  74  75  76  77  78  79  80  81  82  83  84  85  86  87  88  89  90  91  92  93  94  95  96  97  98  99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127 128 129 130 131 132 133 134 135 ``` | ``` export namespace OverviewEngine { 	export type Props = PaginatedProps | InfiniteScrollProps;  	export interface InfiniteScrollProps extends CommonProps { 		/** 		 * The data that is rendered in overview engine. 		 * As this is for infinite-scroll mode, the data can be discontinuous, having empty elements in the middle 		 */ 		readonly data: (JSONDocument | undefined)[];  		/** 		 * To control infinite-scroll feature 		 */ 		readonly infiniteScrollOptions: OverviewEngineApi.InfiniteScrollOptions; 	}  	export interface PaginatedProps extends CommonProps { 		/** 		 * The data that is rendered in overview engine. 		 */ 		readonly data: JSONDocument[]; 	}  	export interface CommonProps extends Container { 		/** 		 * The document model which overview model links to 		 */ 		readonly documentModel: DocumentModel;  		/** 		 * Sub document models which overview model links to 		 */ 		readonly subDocumentModels?: DocumentModel[];  		/** 		 * The UI model which is used to render overview engine 		 */ 		readonly overviewModel: OverviewModel;  		/** 		 * If given, the id document of current active row 		 */ 		readonly activeRowId?: string;  		/** 		 * This map is to define state for row actions 		 */ 		readonly rowActionState?: OverviewEngineApi.RowActionState;  		/** 		 * The callback controls the style (e.g: interactive,...) of a row 		 */ 		readonly rowStyling?: RowStyleGetter<JSONDocument>;  		/** 		 * To specify aria-level for content box 		 */ 		readonly ariaLevel?: number;  		/** 		 * To enable the card view of the overview table. Useful on small screens. 		 */ 		readonly cardView?: boolean;  		/** 		 * To display overview engine as an embedded element. 		 */ 		readonly embedded?: boolean;  		/** 		 * Event handlers that is used in overview engine 		 */ 		readonly eventHandlers?: OverviewEngineApi.EventHandlers;  		/** 		 * A map of components is used to override the components in the overview engine 		 * The components are expected to have rendering logic based on the overview model, overview engine state and so on 		 * If not given, the {@link DefaultComponentMap} will be used 		 */ 		readonly componentMap?: ComponentMap;  		/** 		 * A map of Widgets components used in the overview engine 		 * These components are expected to focus on the UI, therefore, they are recommended when some UI customizations need to be applied. 		 * If not given, the {@link DefaultWidgetMap} will be used 		 */ 		readonly widgetMap?: WidgetMap;  		/** 		 * @experimental 		 */ 		readonly selectorMap?: SelectorMap;  		/** 		 * The results of statistical operation for each column 		 */ 		readonly summaryResult?: OverviewEngineApi.SummaryResult;  		/** 		 * A property which defines the id prefix for Overview Engine component. 		 */ 		readonly uiIdPrefix?: string;  		/** 		 * A property defines the time mode (12h or 24h) which is used in the date time and time picker 		 */ 		readonly timeMode?: TimePickerProps.ClockMode; 		/** 		 * A property which defines the thumbnail map 		 */ 		readonly thumbnails?: Record<string, string>;  		/** 		 * UI State 		 */ 		readonly uiState?: UiState;  		/** 		 * The total number of documents 		 */ 		readonly totalDocumentsCount?: number;  		/** 		 * The accessibility configurations 		 */ 		readonly accessibilityConfigurations?: OverviewEngineApi.AccessibilityConfigurations;  		/** 		 * @experimental 		 * Reflect the loading state of a Client activity directly to the engine. 		 * This is an experimental feature, so use it with caution. 		 */ 		readonly loadingState?: "without" | "missing" | "loading" | "loaded" | "error"; 	} } ``` |
```

Mostly the component customization will be done at the Client level via view providers by extending/wrapping
[OverviewEngineFactories.ViewComponent](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/variables/client-extensions_internal_factories.OverviewEngineFactories.ViewComponent.html) component.
In that case, it needs to ensure that the `handleProgressIndicator` flag is handled properly. Consider the following example:

Re-setting handleProgressIndicator for custom views

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 ``` | ``` export function CustomOverviewView(props: View) { 	return <OverviewEngineFactories.ViewComponent {...props} uiIdPrefix="custom" />; }  CustomOverviewView.handleProgressIndicator = OverviewEngineFactories.ViewComponent.handleProgressIndicator;  const Views: { [name: string]: View.ViewComponent } = { 	CustomOverviewView: CustomOverviewView, 	OverviewCRUD: (props) => <CRUDViews.OverviewEngineView {...props} />, 	FormCRUD: (props) => <CRUDViews.FormEngineView {...props} /> };  export function viewProvider(componentName: string): View.ViewComponent { 	return Views[componentName]; } ``` |
```

Here the custom component re-uses the `OverviewEngineFactories.ViewComponent` component, which already sets `handleProgressIndicator` to true internally.
Therefore, it needs to also be set on the wrapped (custom) component when the default behavior should be kept.

### Overview Engine Actions

The engine *actions* are divided into two types: ***events*** and ***commands***.

**Events** signal that something has happened in the UI, triggered by a user interaction. For example click a button on a row.
They are handled by middlewares and will never change the state directly.
They can be dispatched by users, for example `Events.onFilterChanged` to apply specific filters to the **Overview Engine**.
Developers are also encouraged to listen to them, for example to `Events.onEventButtonClicked` to get notified about an event button being clicked.

**Commands** are used to directly modify the Redux state. They are dispatched by other *Events/Commands* and are usually implemented in reducers.
Users are encouraged to dispatch them, for example `Commands.setDisabled` to disable the UI, but are **NOT** encouraged to listen to them.
Which commands are dispatched in what order and by what user interaction is considered an implementation detail
and a change is not considered breaking.

**Why are actions separated into events and commands?**

This helps to understand the engine’s runtime behavior better, because you can rely on the effect of actions
only creating other actions or changing the state. This makes maintenance, customizing, and debugging easier.

It also serves as a reminder not to listen to commands when you want to react to user interactions.
Which event is dispatched by what user interaction is fixed. Which commands are dispatched as a result might change and should not be relied on.

#### Commands and Events

##### Events

All UI-Events trigger the dispatching of a Redux action. The behavior, which gets triggered by these events, can be changed by registering custom middlewares.
The following table describes what each action does and what user interaction leads to the action.

For a more details: action’s payloads, please refer to the [API documentation](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/modules/store_internal_actions.Events.html).

| **Event** | Description | Dispatched by |
| --- | --- | --- |
| onSearched | trigger a full text search | the full text search input |
| onInfiniteScrolled | update infinite scroll state | the scroll event of the table |
| onPageClicked | change the current page to a specific one | the pagination block to select a specific page |
| onNextPageClicked | change the current page to the next one | the pagination block to select the next page |
| onPreviousPageClicked | change the current page to the previous one | the pagination block to select the previous page |
| onFilterChanged | apply the filters | the apply button of the filter selector |
| onSorted | change the sorting column | click event on a column header |
| onMultiSelectionButtonClicked | toggle the multi-selection state | a click event on the collapse/expand multi-selection section |
| onOverallMultiSelectionButtonClicked | select all rows of the current page for multi-selection | a click event on checkbox in the multi-selection column header |
| onMultiSelectionCleared | deselect all multi-selected rows | after successfully apply a new filter or search |
| onRowsSelected | select row(s) for multi-selection | a click event on multi-selection checkbox of a row |
| onScrollToRow | programmatically scroll to a row | application code dispatching the event |
| onEventButtonClicked | no usage, lets users react to button clicks | a click event on a subheader/footer’s event button |
| onEventButtonClickedRequest | request a confirmation dialog if configured by the button | a click event on a subheader/footer’s event button |
| onRowButtonClicked | no usage, lets users react to button clicks | a click event on a row’s event button |
| onRowButtonClickedRequest | request a confirmation dialog if configured by the button | a click event on a row’s event button |
| onRowClicked | no usage, lets users react to button clicks | a click event on a row |
| onColumnWidthsChanged | resize the columns width | a resize event on resize handler between column’s headers |
| onDialogClosed | close the dialog | a close button of the dialog |
| onDialogConfirmed | confirm the dialog | a confirm button of the dialog |

##### Commands

All direct state changes are coming from these actions. However, it is not recommended to listen to these actions directly.
What **Commands** are dispatched at what time and in what order is considered an implementation detail and may change any time in a ***non-breaking way***.

It is possible to register custom reducers to take care about how information is stored.
But be aware that the engine components always need the store in a special structure to be able to render!

The following table shows an overview of all **Commands**.

For a detailed description, including the specific payloads, please refer to the [API documentation](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/modules/store_internal_actions.Commands.html).

| **Commands** | Description | State Change |
| --- | --- | --- |
| setDisabled | set disabled state for the engine | "disabled" in "uiState" |
| setDialog | set the dialog information | "dialog" in "uiState" |
| setColumnWidths | set the width of each table’s column | "columnWidths" in "uiState" |
| setRowState | set the row state | "rowState" in "uiState" |
| setExpandedMultiSelection | set expansion state of multi-selection panel | "expandedMultiSelection" in "uiState" |
| setQueryParameters | set query parameters | "searchString", "pagination", "scrolling", "sorting", "activeFilters" in "uiState" |

#### Client Actions

The commands and events are specific to the engine and are not aware of the context where it belongs to.
This can be a problem when multiple instances of an engine are required, resulting in conflict between instances.
Therefore, the `OverviewEngineActions` namespace exists to allow adding context to the core’s events and commands, e.g. `activityId` and other Client’s related information.

The following table shows an overview of every action. For a detailed description, including the specific payloads, please refer to the
[API documentation](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/modules/client-extensions_internal_actions.OverviewEngineActions.html).

| **Actions** | Description |
| --- | --- |
| OverviewEngineActions.createActivity | Action to create an Overview Engine activity with option to include initial UI state |
| OverviewEngineActions.event | A wrapper action for **Events** while also includes the `activityId` |
| OverviewEngineActions.command | A wrapper action for **Commands** while also includes the `activityId` |
| OverviewEngineActions.createEnumeratedStringDataHolder | Create a data holder for an enumerated string filter option view |
| OverviewEngineActions.enumeratedStringQueryParametersChanged | Trigger when the search input changed of the enumerated string filter option view |
| OverviewEngineActions.setEnumeratedStringCandidates | Trigger after receiving the data for enumerated string filter option view |

#### Dispatch an Engine Action

In a usual A12 application, the engine runtime will NOT be able to react if only a bare [event](#event-actions) or [command](#command-actions) action
is dispatched. Those events or commands, which can be seen on Redux Devtool, are usually nested in a [client action](#client-actions).
This internally allows some engine’s core features set to be seperated from being dependent on the activity.

Therefore, to control the engine’s runtime behaviors, it is necessary to be aware of this extra layer before dispatching an action.

dispatching-actions.ts

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` import { Events, Commands } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/store";  import { OverviewEngineActions } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/client-extensions";  // Middleware const customMiddleware: Middleware = (api) => (next) => (action) => { 	// ...other logics 	api.dispatch(OverviewEngineActions.event({         activityId: "MY_ACTIVITY_ID",         engineAction: Events.onFilterChanged({ activeFilters: [] }) 	})) }  // Saga function* customSagaHandler(): SagaGenerator<void> { 	// ...other logics 	yield put(OverviewEngineActions.command({         activityId: "MY_ACTIVITY_ID",         engineAction: Commands.setDisabled({ disabled: true }) 	})) } ``` |
```

#### Listen to an Engine Action

Similarly, to handle an event dispatched by the engine, it is necessary to assert the [client action](#client-actions)
before checking the [event](#event-actions), as follows:

handle-custom-row-action-saga.ts

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 ``` | ``` function* rowClickSaga(): SagaIterator<void> { 	yield* takeLatest((anyAction: AnyAction) => { 		return OverviewEngineActions.event.match(anyAction) && Events.onRowClicked.match(anyAction.payload.engineAction); 	}, handleRowButtonClick); }  function* handleRowButtonClick( 	action: Action<OverviewEngineActions.EventPayload<Action<Events.RowClickedPayload>>> ): SagaIterator<void> { 	const { documentId } = action.payload.engineAction.payload;  	yield* put( 		NotificationActions.add({ 			severity: "info", 			duration: 5000, 			title: { key: SHOWCASE_RESOURCE_KEYS.showcase.notifications.event.title }, 			message: { 				key: SHOWCASE_RESOURCE_KEYS.showcase.notifications.event.documentClickMessage, 				args: { 					instanceId: { type: "plain", value: documentId } 				} 			} 		}) 	); } ``` |
```

### Row

#### Active Row

In `OverviewEngine` component, the `activeRowId` prop is used to set a row active. The value passed to it should be `id` of the corresponding document.

The following example sets the row with id="0" to be active.

**Code**

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` 		<OverviewEngine {...otherProps} activeRowId="0" /> ``` |
```

**Result**

![active row](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/active-row.png)

Figure 1. Active row example

#### Row State

Overview Engine supports applying certain styles including `selected`, `disabled` and `useSecondaryColor` for certain rows.

##### API

[rowState](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/view_api.OverviewEngineApi.RowState.html) is used to control the visual state of rows in the table.
This interface is a map that allows setting the desired styles for certain rows as below:

RowState interface

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` export interface RowState { 	readonly [id: string]: { 		readonly selected?: boolean; 		readonly useSecondaryColor?: boolean; 		readonly disabled?: boolean; 	}; } ``` |
```

Each key in the map is the id of the document corresponding to a specific row. The value for the key is an object holding the styles applied to that row.
The object interface is as following:

* `selected`: specify whether the row should be selected or not. This is related to multi-selection feature.
* `useSecondaryColor`: specify if the row should have secondary color or not.
* `disabled`: specify if the row should be disabled or not.

The following example sets the rows with id values of 0, 1 and 2 to be `selected`, `disabled` and `useSecondaryColor`, respectively.

This is done by dispatching [Commands.setRowState](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/modules/store_internal_actions.Commands.html#setrowstate) to update uiState.rowState.

**Code:**

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` export const CustomMiddleWare: Middleware = (api) => (next) => (action) => { 	const result = next(action); 	const activityId = ActivitySelectors.latestActivity()(api.getState())?.id;  	if (conditionMatched && activityId) { 		api.dispatch( 			OverviewEngineActions.command({ 				activityId, 				engineAction: Commands.setRowState({ 					rowState: { 						"DomainProduct/selected-001": { selected: true }, 						"DomainProduct/disabled-002": { disabled: true }, 						"DomainProduct/secondary-003": { useSecondaryColor: true } 					} 				}) 			}) 		); 	}  	return result; }; ``` |
```

**Result:**

![row state](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/row-state.png)

Figure 2. Row state example

#### Event Handlers

There are two event handlers for rows that can be registered by using [eventHandlers](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/view_api.OverviewEngineApi.EventHandlers.html) prop:

* `onRowClick` is used to handle when a row is clicked. This callback receives two parameters:

  + `documentId` — document id of the row that is clicked.
  + `customEvent` — that can be defined in the [Default Row Action](https://geta12.com/docs/SME/sme-om-ba-docs/index.html#_default_row_action).

* `onRowsSelect` is used to control the multi-selection feature in Overview Engine. This is triggered when one or multiple rows are selected or deselected. It will be called with a parameter, which is an array of objects. Each object has two elements:

  + `documentId` — document id of the row that is clicked.
  + `selected` — the next expected selection state of this row.

### Row Action

#### Row Action State

Overview Engine also provides a way to apply certain styles including `hidden` and `disabled` to row action buttons.

##### API

The `rowActionState` prop in `OverviewEngine` is of type [RowActionState](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/view_api.OverviewEngineApi.RowActionState.html).
This interface supports users to define the state for row actions in all rows or only specific rows by providing two properties:

* `rowActions` is used for defining state for the desired row actions on all rows.
  It is a map that takes row actions' `event` as their key and the value is an object of type `RowActionState.IndividualRowActionState`.
* `rows` is used for mapping state to the desired actions on specific rows.
  Each key in the map is the id of the document and the value is the state applied to the row actions for that document.
  The value type of the map is another map interface with each key is the row actions' `event` and the value is of type `RowActionState.IndividualRowActionState`.

The structure of this interface is presented as follows:

RowActionState interface

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 ``` | ``` export interface RowActionState { 	/** 	 * To specify row action state for all rows 	 */ 	readonly rowActions?: { 		readonly [event: string]: RowActionState.IndividualRowActionState; 	};  	/** 	 * To specify row action state for each specific row 	 */ 	readonly rows?: { 		readonly [id: string]: { 			[event: string]: RowActionState.IndividualRowActionState; 		}; 	}; } ``` |
```

Both `rowActions` and `rows` specify the state by using instances of `RowActionState.IndividualRowActionState`.
This interface is shown as below:

IndividualRowActionState interface

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` namespace RowActionState { 	export interface IndividualRowActionState { 		readonly hidden?: boolean; 		readonly disabled?: boolean; 	} } ``` |
```

* `hidden` specifies whether the corresponding row action should be hidden.
* `disabled` defines if the corresponding row action should be disabled.

#### Examples

##### Apply State for All Rows

The below code shows how to make all *delete\_event* actions on all rows disabled.

**Code:**

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` 		<OverviewEngine 			{...otherProps} 			rowActionState={{ 				rowActions: { 					delete_event: { 						disabled: true 					} 				} 			}} 		/> ``` |
```

**Result:**

![row action state 1](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/row-action-state-1.png)

Figure 3. Styling actions on all rows

##### Apply State for Specific Rows

The following code makes *delete\_event* action on the rows with document ids 0 and 2 disabled.
Meanwhile, the *edit* button is also set to be disabled on the row with document id 2.

**Code:**

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` 		<OverviewEngine 			{...otherProps} 			rowActionState={{ 				rows: { 					0: { 						delete_event: { disabled: true } 					}, 					2: { 						delete_event: { disabled: true }, 						edit: { disabled: true } 					} 				} 			}} 		/> ``` |
```

**Result:**

![row action state 2](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/row-action-state-2.png)

Figure 4. Styling actions on specific rows

#### Event Handlers

The on-click event of a row action can be registered by [onRowButtonClick](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/view_api.OverviewEngineApi.EventHandlers.html#onrowbuttonclick-1)
in `eventHandlers` of `OverviewEngine`. On the event, the callback will be called with two parameters:

* `documentId` — document id of the row on which the action is clicked.
* `rowActionModel` — configuration of the clicked row action, which has type [Button](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/overview-model.OverviewModel.Button.html).

#### Row Actions in Right-Click Context Menu

Overview Engine also provides a built-in feature that helps end users interact with row actions easily by right-clicking on the row, instead of using row action buttons.

![right click context menu](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/right-click-context-menu.png)

Figure 5. Context menu by right clicking

### Button

Buttons, defined in an Overview Model, are displayed in the header, footer or multi-selection panel of the Overview Engine.
However, adding buttons in the Overview Model only renders them on the UI without registering any handler for on-click events.

Overview Engine supports registering the handlers by passing a callback into [onEventButtonClick](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/view_api.OverviewEngineApi.EventHandlers.html#onrowbuttonclick-1) of `eventHandlers` prop.
When triggered, the callback receives two parameters:

* `event` — event name of the button being clicked.
* `button` — configuration of the clicked [Button](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/overview-model.OverviewModel.Button.html).

|  |  |
| --- | --- |
|  | `onEventButtonClick` is used to register handlers for any buttons no matter if they are on header, footer or multi-selection panel |

### Searching

The API for searching in Overview Engine gives you full control over the functionality.
To implement search:

* [uiState.searchString](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/store_internal_store.UiState.html#searchstring) is used to specify the current search value.
* [eventHandlers.onSearch](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/view_api.OverviewEngineApi.EventHandlers.html#onsearch) callback inside the
  `eventHandlers` prop is triggered when focusing is on search input and Enter key is pressed or search button is clicked.
  It can also be done via the `OverviewEngineActions.event`, more details in the [Commands and Events](#_commands_and_events) section.

|  |  |
| --- | --- |
|  | Overview Engine performs a plain text string-based full text search using the Simple Search operator from Data Services. For further information, refer to the [Data Services documentation](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#simple-search-operator). |

### Field-Based Filtering

Overview Engine is equipped with a feature to search for documents based on field values.
This feature can be activated or deactivated in the Overview Model, details in [Overview Modelling documentation - Enable Filter](https://geta12.com/docs/SME/sme-om-ba-docs/index.html#_enable_filter).

#### Visualization of Filtering Feature

By default, there is a small button appears next to the Search input component: the **Filter Button**.

![filter button](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-button.png)

Figure 6. Filter Button

Click on this button to open the Filter Selector dialog, which shows the list of fields to configure the filter parameters.
The Apply button inside Filter Selector is responsible for triggering the filtering process, then the Filter Selector disappears and the Filter Bar is shown to display what is being filtered.

![filter visualization](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-visualization.png)

Figure 7. Visualization of Filtering Feature

Configure the Overview Model to show/hide the Filter Button/Filter Bar, see more details in [Overview Modelling documentation - Filter Configuration](https://geta12.com/docs/SME/sme-om-ba-docs/index.html#_filter_configuration).

##### Filter Selector

The left side of the dialog is a list of fields from the Document Model, a list of columns, or a custom list.
It is configured by the [Filter Mode](https://geta12.com/docs/SME/sme-om-ba-docs/index.html#filter_mode) in the Overview Model.
Use Filter Search input to quickly find a field.

The list of fields can be grouped by sections. In the image below, the Number section contains fields related to "number".
It is easy for end users to find relevant fields to apply filters.
Read [Overview Modelling documentation - Section Data](https://geta12.com/docs/SME/sme-om-ba-docs/index.html#_section_data) to know how to group fields as sections.

![filter selector](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-selector.png)

Figure 8. Filter selector

There is a checkbox inside each item of the list, which is used to mark the field to apply the filter.
When a field is checked, it becomes an ***active filter***.

###### Filter Option

When a field is selected, the right side of the dialog shows its Filter Option.
It can be a simple input; a combination of two inputs, a range of start and end values; or a list of options.
The visualization of the Filter Option is based on field data type, see more details in [supported data types](#/overview-engine/field-based-filtering/supported-data-types).
Below is a Filter Option for data type Number.

![filter option](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-option.png)

Figure 9. Filter option

If a filter option is set, it is automatically recognized as an active filter.

###### Apply Button

The Apply button is below the Filter Option.
It triggers the filtering process for ***all active filters*** of the Filter Selector, not only the displaying Filter Option.

##### Filter Bar

The Filter Bar is presented as a group of many small boxes below the Subheader of the Overview Engine.
Each box summarizes which field is being filtered with its parameters, and a delete button to remove the corresponding filter.

![filter bar with option view](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-bar-with-option-view.png)

Figure 10. Filter bar

###### Filter Option

Click to a box in the Filter Bar will open a Filter Option, which is similar to the [Filter Option](#filter-selectors-option) in the Filter Selector.

###### Apply Button

The Apply button in the Filter Option of the Filter Bar is responsible for applying the filter for the corresponding field only.
The other active filters are still kept.

Close the Filter Option without clicking the Apply button will discard the change for the corresponding filter.

#### Supported Data Types

##### String

###### Filter Normal String Fields

By default, the string filter options are visualized as a simple input for entering the filter value.
The string filter is an object with a string value.

Beside the input, there is a switch to search for *Empty* values.

![filter option string](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-option-string.png)

Figure 11. String Filter Option

There are three behaviors to perform filtering on string fields: ***Exact match search*** and ***Simple search***. The default behavior is exact match search.

* An [Exact match search](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#_exact_match_operator) looks for the exact value provided for the current string field, with or without case sensitivity. Substring or partial matching is not available.
* The [Simple search](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#simple-search-operator) uses a case-insensitive substring match algorithm to search the current string field.
* The [Undefined match](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#undefined-match-operator) looks for any empty value in the current string field.

To enable simple search, find the string field in the Document Model and add the ***enable\_approximate\_match\_search*** annotation with the value ***true***.
When filtering, the keyword will be split into words by whitespace and connected using the `and` operator. For example, if the keyword is *Tennisball Pack*, it will be split into *Tennisball* and *Pack*. Below is the operator in the query constraint that will be sent to the server:

Splitted keyword example

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 ``` | ``` {     "operator": "and",     "operands": [       {         "operator": "simple_search",         "fields": [           "/product/name"         ],         "value": "Tennisball"       },       {         "operator": "simple_search",         "fields": [           "/product/name"         ],         "value": "Pack"       }     ]   } ``` |
```

The query with this operator will look for documents containing both *Tennisball* and *Pack* in the `/product/name` field.

If the ***enable\_approximate\_match\_search*** annotation is not specified or explicitly set to ***false***, exact match search is applied by default. The default behavior for exact match search is `caseSensitive` ***true***. To enable ***case-insensitive*** search (`caseSensitive = false`), add the ***enable\_case\_insensitive\_search*** annotation with the value ***true*** into the string element in the Document Model.

###### Filter String Fields with Multi-Select

When [Filter String Fields with Multi-Select](https://geta12.com/docs/SME/sme-om-ba-docs/index.html#_filter_string_fields_with_multi_select) is enabled, the string filter options are shown as a list of options like multi-select or enumeration.

A select option is available to search for *Empty* values, which can be combined with other string value selections.

![filter option enumerated string](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-option-enumerated-string.png)

Figure 12. String Filter Option as Multi-Select

The behavior for filtering String Fields with Multi-Select is based on ***exact match search*** with `caseSensitive` ***true***.

With *Empty* option selected, it looks for any empty value in the current string field with the ***undefined match*** operator.

If multiple options are selected, the values are connected using the ***or*** operator.

##### Number

The number filter is an object with a start and an end value, both of type number.

The number filter options are visualized by default as two inputs, one for the start and one for the end value.

Beside the two inputs, there is a switch to search for *Empty* values.

![filter option number](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-option-number.png)

Figure 13. Number Filter Option

If *Empty* switch is turned on, the result filter would look for any empty value in the current number field.

If one of the two values is filled:

* The value is entered into start field: the result filter would be larger than or equal to the value.
* The value is entered into end field: the result filter would be less than or equal to the enter value.

It is not possible to enter a number range with the start value larger than the end value.

##### Boolean

The boolean filter is an object with just the value of type boolean.

The boolean filter options are visualized by default as three radio buttons:

* ***Yes*** for ***true***
* ***No*** for ***false***
* ***Empty*** for ***null***

![filter option boolean](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-option-boolean.png)

Figure 14. Boolean Filter Option

##### Confirm

The confirm filter is similar to the boolean filter, but with three radio button options: ***Yes*** and ***Empty***.

![filter option confirm](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-option-confirm.png)

Figure 15. Confirm Filter Option

##### Enumeration

The enumeration filter is an object with the property `selectedValues`, which is an array of string values corresponding to the values of the selected enumeration options.

The enumeration filter options are visualized by default as a checkbox list of the enumeration options with localized labels.

A select option is included to search for *Empty* values, which can be combined with other enumeration value selections.

![filter option enumeration](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-option-enumeration.png)

Figure 16. Enumeration Filter Option

##### Multi-Select

The multi-select filter is an object that have two properties:

* `selectedValues`: contains multi-select value selected by users. It is an array of string values corresponding to the values of the enumeration field `value` inside the multi-select group.
* `operation`: the operator that is supposed to be used with `selectedValues`. It is of type [FilterOperation](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/enums/view_api.FilterOperation.html) enum, which consists of two values `AND` and `OR`.

The multi-select filter options are visualized similarly to the enumeration filter, but with a Filter Operation button to set the operation. By default, the operation is `AND`.

A select option is available to search for *Empty* values, which can be combined with other multi-select value selections.

![filter option multi select](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-option-multi-select.png)

Figure 17. Multi-Select Filter Option

##### Date

The date filter is an object with a start and an end value, both of type Date.

The date filter options are visualized by default as two inputs, one for the start and one for the end value.
The start and end value are similar to the Number Filter Option, but the input is a date picker, or a combination of select elements.

![filter option date](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-option-date.png)

Figure 18. Date Filter Option - By Date Range

It is possible to filter by Month & Year Range (skipping the exact day) or only by Year Range (skipping the exact day and month).
Use the select element on top of the Date Filter Option to choose relevant mode. The default mode is Date Range. An *Empty* option is also available in this select dropdown to search for empty values.

![filter option date by month](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-option-date-by-month.png)

Figure 19. Date Filter Option - By Month & Year Range

![filter option date by year](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-option-date-by-year.png)

Figure 20. Date Filter Option - By Year Range

The resulting dates or date ranges are set as:

* Start value: first day of the month / year.
* End value: last day of the month / year.

![filter option date empty](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-option-date-empty.png)

Figure 21. Date Filter Option - Empty Values

No input is required for this option.

##### Time

The time filter visualization is similar to the number filter option, but the input is a time picker.

Beside the two inputs, there is a switch on top to search for *Empty* values.

![filter option time](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-option-time.png)

Figure 22. Time Filter Option

##### DateTime

The date time filter is similar to the date filter, with the difference, that the user can specify also the time here.

![filter option date time](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/filter-option-date-time.png)

Figure 23. Date Time Filter Option

There are 6 convenient input modes:

* Date Range
* Date & Time Range
* Time Range
* Month & Year Range
* Year Range
* *Empty*

The Date Range, Month & Year Range, and Year Range are similar to the Date Filter Option. The time of the start field is set as `00:00:00`, and the time of the end field is set as `23:59:59`.

* Date & Time Range: inputs are datetime pickers, both date and time can be set.
* Time Range: similar to Time Filter Option, but the date is set to today.

#### Hiding Empty Value Options

All filter option views provide an *Empty* switch or option to match `undefined` values. If you want to remove this choice from the UI, pass `hideEmptyValueOption` to the corresponding filter option view in the `componentMap`.

This flag is supported by the built-in views for String, Number, Boolean, Confirm, Enumeration, Multi-Select, Date, Time, and DateTime filters.

Hide the Empty option in filter views

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` const componentMap = {   ...DefaultComponentMap,   FilterOptionsViews: {     ...DefaultComponentMap.FilterOptionsViews,     StringFilterOptionsView: (props) => (       <DefaultComponentMap.FilterOptionsViews.StringFilterOptionsView         {...props}         hideEmptyValueOption       />     ),     DateFilterOptionsView: (props) => (       <DefaultComponentMap.FilterOptionsViews.DateFilterOptionsView         {...props}         hideEmptyValueOption       />     )   } }; ``` |
```

#### How Field-Based Filtering Works

After clicking the ***Apply*** button,
the `onFilterChange`
event is called with a `FilterMap` containing
an updated ***active filters***.
By default, this event will dispatch the `OverviewEngine/EVENT/onFilterChanged`
action and the `activeFilters` is kept in [uiState](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/store_internal_store.UiState.html).

|  |  |
| --- | --- |
|  | Each entry in the `FilterMap` can specify a `modelId` property, which indicates the model (main document model or a submodel) where the field to be filtered resides.  When `filterMode` is `"custom_list"`, use the `subModel` property in `FieldConfiguration` to filter a field in a submodel. This will result in the corresponding `modelId` in the filter data. If `subModel` is omitted, filtering applies to the current document model.  This mechanism is related to the [heterogeneity](https://geta12.com/docs/OVERALL/heterogeneity) feature in **A12**, allowing filters to target fields across different models and submodels. |

Then the default data provider (by [OverviewEngineFactories](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/modules/client-extensions_internal_factories.OverviewEngineFactories.html)) will use the `activeFilters` to create and send a search query to the server, which provides the documents displayed in the Overview Engine.

#### Controlling The Active Filters

Overview Engine supports preset filters, which are active filters that are set when the engine is initialized. Depending on requirements, modeler and developer can work together to define suitable preset filters.

* In Overview Engine, the developer can set whether filters are removable or non-removable.
* In Overview Model, the modeler can set whether the Filter Bar and Filter Button should be displayed.
* If the Overview Model references a query model, its constraint behaves like a preset filter, always applies alongside the active filters, is joined with them using the `AND` operator, and stays hidden from the Filter Selector or Filter Bar.

![preset filters](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/preset-filters.png)

Figure 24. Preset Filters with removable and non-removable filters

To build preset filters like that, Overview Engine needs to be initialized with an ***activeFilters*** list of type ***FilterMap*** and passed to the `uiState` of Overview Engine activity slices.
This can be done by registering a custom middleware in a module or in the application setup that intercepts `Activity.PUSH` actions and re-dispatches them with an initial filter configuration.
For example:

Create the preset filters

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 ``` | ``` const presetFilter: OverviewEngineApi.FilterMap = { 	"/product/name": { 		filterType: "String", 		criteria: { 			value: "board" 		}, 		nonRemovable: true // set nonRemovable = true if you want this filter cannot be removed 	}, 	"/product/inStock": { 		filterType: "Boolean", 		criteria: { 			value: true 		}, 		nonRemovable: true 	}, 	"/product/number": { 		filterType: "Number", 		criteria: { 			start: 100 		} 	}, 	"/product/logistics/weight/weightValue": { 		filterType: "Number" 	}, 	"/product/targetGroup": { 		filterType: "Enumeration", 		criteria: { 			selectedValues: ["women", "men"] 		} 	}, 	"/product/dateField": { 		filterType: "Date", 		type: "Date", 		criteria: { 			end: new Date() 		} 	} }; ``` |
```

Example Middleware

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 ``` | ``` import { isEqual } from "lodash-es"; import { type Middleware } from "redux";  import { type Activity, ActivityActions } from "@com.mgmtp.a12.client/client-core"; import { OverviewEngineActions, type OverviewEngineApi } from "@com.mgmtp.a12.overviewengine/overviewengine-core";  export const createPresetFilterMiddleware: ( 	presetFilter: OverviewEngineApi.FilterMap, 	targetDescriptor: Activity.Descriptor, 	skipInitialLoad?: boolean ) => Middleware = (presetFilter, targetDescriptor, skipInitialLoad) => () => (next) => (action) => { 	if (ActivityActions.push.match(action)) { 		const { activity } = action.payload;  		if (!isTargetOverviewActivity(activity, targetDescriptor) || !isSliceEmpty(activity)) { 			return next(action); 		}  		return next( 			OverviewEngineActions.createActivity( 				{ 					activityId: activity.id, 					activityDescriptor: activity.descriptor, 					loadingState: skipInitialLoad ? "without" : "missing" 				}, 				{ activeFilters: presetFilter } 			) 		); 	}  	return next(action); };  function isTargetOverviewActivity(activity: Activity, targetDescriptor: Activity.Descriptor) { 	return isEqual(activity.descriptor, targetDescriptor); }  function isSliceEmpty(activity: Activity) { 	return Object.keys(activity.dataHolders?.[0].slices ?? {}).length === 0; } ``` |
```

In ***FilterMap***, the key is the string based on *ModelPath* of the field, for example: *"/product/name"*, *"/product/number"*,…​ The value is a ***Filter.Options*** with ***filterType***, ***criteria*** and ***nonRemovable***. If ***nonRemovable*** is set, this filter cannot be removed from either Filter Bar or Filter Selector.

The middleware example above is only one way to create preset filters at activity creation time. If you need to update the active filters during normal usage of the activity, dispatch an engine action instead:

* Use the event `Events.onFilterChanged` when you want to apply a new `activeFilters` list through the standard filtering flow.
* Use the command `Commands.setQueryParameters` when you want to update `activeFilters` together with other query parameters such as search, pagination, scrolling, or sorting.

Remember to wrap these actions with `OverviewEngineActions.event` or `OverviewEngineActions.command` so the update is scoped to the correct activity. See [Dispatch an Engine Action](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/0300_overview_engine_actions.adoc#dispatch-engine-action) for the dispatching pattern.

#### Enumerated String Filtering

Enable [Filter String Fields with Multi-Select](https://geta12.com/docs/SME/sme-om-ba-docs/index.html#_filter_string_fields_with_multi_select) before using this feature.

This section will only focus on the customization in searching.

##### Event Handlers

The search enumerated string filter is handled by [onSearchEnumeratedStringField](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/view_api.OverviewEngineApi.EventHandlers.html#onsearchenumeratedstringfield) in `eventHandlers`.
By default this event will dispatch the `enumeratedStringQueryParametersChanged` action.
Then the [default sagas](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/variables/client-extensions_internal_factories.OverviewEngineFactories.createApplicationSagas.html) provided by [OverviewEngineFactories](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/modules/client-extensions_internal_factories.OverviewEngineFactories.html) will handle this action to load list candidates and keep them in `uiState.enumeratedStringFilterMap`.

A customization could be done by overriding the event `onSearchEnumeratedStringField`. The following steps must be followed:

* Create data holders for `uiState.enumeratedStringFilterMap` correctly by dispatching action `createEnumeratedStringDataHolder`.
  Each field has a separated data holder, which contains the list of candidates and the search value.
* Dispatch the action `setEnumeratedStringCandidates` to update the list of candidates into these data holders.

##### Customization Example

The below example illustrates how to customize the search enumerated string filter:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 ``` | ``` export const EnumerationStringFilterExample = (props: OverviewEngineFactories.ViewComponentProps) => { 	const { activityId } = props; 	const dispatch = useDispatch();  	const eventHandlers: OverviewEngineApi.EventHandlers = React.useMemo(() => { 		return { 			onSearchEnumeratedStringField(params: { fieldPath: string; keyword?: string; nextPage?: boolean }) { 				const { fieldPath, keyword = "", nextPage = false } = params;  				if (fieldPath === "product.externalNumber.system") { 					dispatch( 						customEnumeratedStringQuery({ 							activityId, 							fieldPath, 							keyword, 							nextPage 						}) 					); 				} else { 					dispatch( 						OverviewEngineActions.enumeratedStringQueryParametersChanged({ 							activityId, 							fieldPath, 							keyword, 							nextPage 						}) 					); 				} 			} 		}; 	}, [activityId, dispatch]); 	return <OverviewEngineFactories.ViewComponent {...props} eventHandlers={eventHandlers} />; };  export const customEnumeratedStringQuery = factory<OverviewEngineActions.EnumeratedStringQueryParametersChangedPayload>( 	"CUSTOM_ENUMERATED_STRING_QUERY" ); ``` |
```

The `customEnumeratedStringQuery` action should be handled by a saga:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 ``` | ``` function* customEnumeratedStringSearchingSaga(): SagaIterator<void> { 	yield* takeLatest((anyAction: AnyAction) => { 		return customEnumeratedStringQuery.match(anyAction); 	}, handleCustomEnumeratedStringSearching); }  function* handleCustomEnumeratedStringSearching( 	action: Action<OverviewEngineActions.EnumeratedStringQueryParametersChangedPayload> ): SagaIterator<void> { 	const { activityId, fieldPath, keyword, nextPage } = action.payload; 	const activity = yield* select(ActivitySelectors.activityById(activityId));  	if (!activity) { 		throw new Error(`No activity found for id ${activityId}.`); 	}  	// Find data holder for enumeratedStringFilterMap by current fieldPath 	const dataHolder = activity.dataHolders?.find( 		(dataHolder) => EnumeratedStringDataHolder.isInstance(dataHolder) && dataHolder.descriptor.fieldPath === fieldPath 	);  	if (!dataHolder) { 		// Create data holder if not exists 		yield* put( 			OverviewEngineActions.createEnumeratedStringDataHolder({ 				data: { fieldPath, keyword, candidates: [] }, 				activityId, 				descriptor: EnumeratedStringDataHolder.createDescriptor(fieldPath) 			}) 		); 	} else { 		// clean data holder before updating, no need to do it if using enumeratedStringQueryParametersChanged 		yield* put( 			OverviewEngineActions.setEnumeratedStringCandidates({ 				activityId, 				fieldPath, 				fullSize: 0, 				candidates: [] 			}) 		); 	}  	// Get list of candidates and ful size by keyword. 	const { candidates: newCandidates, fullSize } = yield* call(requestCandidates, fieldPath, keyword, nextPage);  	// Update the candidates and fullSize 	yield* put( 		OverviewEngineActions.setEnumeratedStringCandidates({ 			activityId, 			fieldPath, 			fullSize, 			candidates: newCandidates 		}) 	); }  async function requestCandidates( 	fieldPath: string, 	keyword: string, 	nextPage: boolean ): Promise<{ candidates: string[]; fullSize: number }> { 	const fullCandidates = ["barcode", "customized system number"]; 	const candidatesByKeyword = fullCandidates.filter((candidate) => candidate.includes(keyword));  	return Promise.resolve({ candidates: !nextPage ? candidatesByKeyword : [], fullSize: candidatesByKeyword.length }); } ``` |
```

Remember to register this saga for current module.

#### Result Page Customization

When there is no data for a given query (including searching and/or filtering), Overview Engine will show the default message "No results found" for clarification. It is straightforward to customize by overriding the default `TableBody` component, e.g:

Example

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` import { DefaultTableComponentRenderers } from "@com.mgmtp.a12.widgets/widgets-core"; import { 	type TableBody, 	OverviewEngine, 	DefaultComponentMap, 	useOverviewEngineContext } from "@com.mgmtp.a12.overviewengine/overviewengine-core";  const CustomTableBody: React.ComponentType<TableBody.Props> = (props) => { 	const data = useOverviewEngineContext((context) => context.data);  	if (data.length === 0) { 		return <div className="-u-flex -u-justify-center">No search results. Try again with another query</div>; 	}  	return <>{DefaultTableComponentRenderers.bodyRenderer(props)}</>; };  export const CustomOverviewEngineContainer: React.ComponentType<OverviewEngine.Props> = (engineProps) => { 	return <OverviewEngine {...engineProps} componentMap={{ ...DefaultComponentMap, TableBody: CustomTableBody }} />; }; ``` |
```

### Sorting

In Overview Engine, sorting is managed through state for consistent and customizable control:

* [uiState.sorting](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/store_internal_store.UiState.html#sorting): to define the current sorting state.
  Note that Overview Engine only displays the sort icon (↑ or ↓) for the first item in sorting array.
* [eventHandlers.onColumnClick](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/view_api.OverviewEngineApi.EventHandlers.html#oncolumnclick)
  callback: to subscribe to the change event of sorting state. This will be triggered when the column header is clicked.

|  |  |
| --- | --- |
|  | * Because the initial sorting state can be defined in Overview Model, the initial `sorting` passed to   `OverviewEngine` should be based on what is defined in Overview Model.   [OverviewEngineApi.Sorting.getInitialValue](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/functions/view_api.OverviewEngineApi.Sorting.getInitialValue.html)   is provided to get the initial sorting state from Overview Model. * If no default sorting is specified, results are sorted by `__meta/createdAt` in descending order. * Case is ignored during sorting (`ignoreCase` is set to true). |

### Multi-Selection

Overview Engine provides a **multi-selection** feature that allows users to select multiple rows and perform actions on those selected rows.

The **multi-selection area** is a dedicated part of each row that users can click to toggle the row’s selection state.
It is configurable through the model and supports the following options:

* **Rows and checkboxes** (default) — both row clicks and checkboxes can toggle selection.
* **Checkboxes only** — selection is managed exclusively via checkboxes.

Users can select rows in two ways:

* **Single selection**: Click on a row’s selection area to toggle its selection.
* **Range selection**: Hold Shift and click another row’s selection area to select a consecutive range of rows.

To enable it, first it is required to turn on the feature in the model. Please see the [SME docs](https://geta12.com/docs/SME/sme-om-ba-docs/index.html#_multi_selection) for more details about modelling it.
This section will only focus on the implementation aspect.

#### API

As mentioned before, one or multiple rows can be marked as selected by using [row state](#row/row-state) and listen to the event when one or multiple rows is selected by using [onRowsSelect](#row/event-handlers/onRowsSelect).

Besides, there are two other event handlers related to multi-selection:

* [onMultiSelectionClear](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/view_api.OverviewEngineApi.EventHandlers.html#onmultiselectionclear): This will be triggered when the selections are supposed to be cleared.
  Specifically, it is called when the filtering or searching changes or the multi-selection panel collapses while there are still selected rows.
* [onOverallMultiSelectionButtonClick](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/view_api.OverviewEngineApi.EventHandlers.html#onoverallmultiselectionbuttonclick): will be triggered when the overall multi-selection is clicked. It will be called with a parameter which is an object with two elements:

  + `affectedRowIds` — document ids of the rows that are affected.
  + `selected` — indicate whether these rows are selected or deselected.

#### Delete Multiple Documents

It is possible to delete multi-selected documents by modeling a button on multi-selection panel, see [SME docs](https://geta12.com/docs/SME/sme-om-ba-docs/index.html#_multi_selection), with the event name of `delete_selected`.
This feature only works with user roles that have the access right of `DOCUMENT_MULTI_DELETE`, see [Data Services docs](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#_data_services_authorization).

### Infinite Scroll

Overview Engine also supports infinite-scroll behavior.
When this feature is enabled, the table will load more rows as user keeps scrolling down.
This is an alternative to pagination in Overview Engine and can bring better UI/UX in some particular cases.

|  |  |
| --- | --- |
|  | The infinite-scroll feature only supports fixed height rows |

To enable infinite-scroll in Overview Engine, it should be specified in the model and configured in `OverviewEngine` component through public APIs.
For more details about modelling, please see the [SME docs](https://geta12.com/docs/SME/sme-om-ba-docs/index.html#_paging_behavior). This section only focuses on how to use the APIs.

|  |  |
| --- | --- |
|  | Since the height of the table body is fixed in infinite scrolling tables, the footer is always stuck at the bottom of the table body, even if the table rows are short. This is a non-covered edge case. |

![footer row infinite table](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/footer-row-infinite-table.png)

Figure 25. Footer at the bottom of the infinite table, leaving a space between it and body rows

#### API

To enable infinite-scrolling, the props passed to `OverviewEngine` component should be of the type [OverviewEngine.InfiniteScrollProps](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/view_overview-engine.OverviewEngine.InfiniteScrollProps.html).
This means that `data` prop can receive a discontinuous array and `infiniteScrollOptions` must be specified.

The `infiniteScrollOptions` prop is used for controlling the behavior.
It receives an object of type `OverviewEngineApi.InfiniteScrollOptions` which is similar to `InfiniteScrollOptions` in Widget.

`OverviewEngineApi.InfiniteScrollOptions` has the following fields:

* `rowCount`: receives the total number of rows.
* `rowLoadingStatus`: receives a callback to identify if a row is unloaded or loading or loaded.
  The callback takes the index of a row and should return `RowLoadingStatus` for the row.The callback receives the index of a row and should return the corresponding `RowLoadingStatus`.
* `loadData`: a callback that loads and updates data by creating a
  [DataOperation.ListDocuments.Query](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/client-extensions_internal_data-loader_data-loader.DataOperation.ListDocuments.Query.html)
  with the appropriate [DataOperation.ListDocuments.Paging](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/client-extensions_internal_data-loader_data-loader.DataOperation.ListDocuments.Paging.html) parameter.
  This callback will be triggered when more data need to be loaded. It receives an object parameter which contains the following fields:

  + `startPage`: indicating the number of page to start loading. ***This is 0-based***.
  + `endPage`: indicating the number of page (inclusive) to end loading. ***This is 0-based***.
* `threshold`: to specify when to pre-fetch data. A threshold **X** means that the next rows will start loading when a user scrolls within **X** last rows
* `minimumBatchSize`: minimum number of rows to be loaded at a time
* `loaderRef`: the React reference to the underlying `InfiniteLoader` from `react-virtualized`. It has a useful method `resetLoadMoreRowsCache` to reset the internal cache. This should be called when all the rows should be re-fetched.
* `overrideListProps`: to override the props of `react-virtualized` list rendered under the hood. There are some useful props such as `scrollToRow` and so on.

#### Configurations

Overview Engine provides configurations for the infinite scrolling behavior through `OverviewEngineFactories`.

These configurations control how infinite scrolling operates in the OverviewEngine:

* `pageSize`: Defines the number of rows to load per page. A larger `pageSize` reduces the number of requests but
  increases the amount of data loaded at once.
* `cachePages`: Specifies the number of pages to retain in the cache while scrolling. This optimizes performance by
  reducing the need to re-fetch data when scrolling back. The default value is **5**.

|  |  |
| --- | --- |
|  | OverviewEngine calculation  The number of documents per one load by `pageSize * ( endPage - startPage + 1 )`.  The total number of cached rows is calculated as `pageSize * cachePages`. |

Setup the Overview Engine infinite scroll configurations

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` import { DirtyHandlingFactories } from "@com.mgmtp.a12.client/client-core/dirtyHandling"; import { OverviewEngineFactories } from "@com.mgmtp.a12.overviewengine/overviewengine-core"; import { ApplicationFactories, type ApplicationSetup, ModuleRegistryProvider } from "@com.mgmtp.a12.client/client-core";  export function setup(): ApplicationSetup { 	ModuleRegistryProvider.getInstance().addModule( 		OverviewEngineFactories.createModule({ infiniteScroll: { pageSize: 50, cachePages: 4 } }) 	);  	return ApplicationFactories.createApplicationSetup({ 		...otherConfigurations, 		overridePlatformSagas: [ 			...OverviewEngineFactories.createApplicationSagas(), 			...DirtyHandlingFactories.createSagas() 		] 	}); } ``` |
```

### Localization

An application using Overview Engine has to provide a `LocalizerContext` instance from `util-localization-react` package.

The context can be initialized by using `DefaultLocalizerContextProvider`, or customized completely by passing
three parameters: `localizer`, `locale`, and `dataFormats` into `LocalizerContext`.

`localizer` receives an array of Localizables and returns resolved
string in regard to current `locale`. For more details, see [Utils localization documentation](https://geta12.com/docs/UTILS_LOCALIZATION/utils-localization-documentation-bundle/index.html).

#### API

Overview Engine offers two alternative localization approaches:

* In which the React hooks are available, [LocalizerHooks](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/modules/services_localization_internal_localizer-hooks.LocalizerHooks.html) namespace with four different hooks can be used:

  + `useLocalizedResource`: to translate Overview Engine resources via public `RESOURCE_KEYS`.
  + `useLocalizedOverviewElement`: to translate localized texts in Overview Model’s elements.
  + `useLocalizedFieldLabel`: to translate field labels in the Document Model.
  + `useLocalizedFieldValue`: to translate values of localizable fields (BooleanType, ConfirmType, EnumerationType).
* In which the React hooks are not available, [LocalizableFactory](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/modules/services_localization_internal_localizable-factory.LocalizableFactory.html) namespace with alternative functions can be used to create
  corresponding localizables.

#### Resource Keys

Resource keys are used to identify the document elements and UI elements that are localized. There are two kinds of resource keys: static resource keys and model element keys.

##### Static Resource Keys

Static resource keys are fixed and not changed. For example, the labels for `Confirm` and `Cancel` in confirmation dialog or input labels in filter option views are identified by static resource keys.

These keys are provided in the constant [`RESOURCE_KEYS`](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/variables/services_localization_internal_languages_keys.RESOURCE_KEYS.html) map and exported from [services/localization](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/modules/services_localization.html).

##### Model Element Keys

Model element keys are dynamically generated based on the model being used.
The following table summarizes the key formats:

| Element | Key |
| --- | --- |
| Table header label | `uiModel.{overview-model-name}.header.label` |
| Column header label | `uiModel.{overview-model-name}.columns.{column-id}.label` |
| Number column suffix | `uiModel.{overview-model-name}.columns.{column-id}.suffix` |
| Sub-header action | `uiModel.{overview-model-name}.subHeaderBox.actions.{button-event}.(label|title)` |
| Sub-header action confirmation | `uiModel.{overview-model-name}.subHeaderBox.actions.{button-event}.confirmation.(title|message)` |
| Footer action | `uiModel.{overview-model-name}.footerBox.actions.{button-event}.(label|title)` |
| Footer action confirmation | `uiModel.{overview-model-name}.footerBox.actions.{button-event}.confirmation.(title|message)` |
| Row action | `uiModel.{overview-model-name}.rowActionGroup.actions.{action-event}.(label|title)` |
| Context menu action | `uiModel.{overview-model-name}.contextMenu.actions.{action-event}.(label|title)` |
| Multi-selection action | `uiModel.{overview-model-name}.multiSelection.actions.{action-event}.(label|title)` |
| Multi-selection action confirmation | `uiModel.{overview-model-name}.multiSelection.actions.{button-event}.confirmation.(title|message)` |
| Multi-selection clear confirmation | `uiModel.{overview-model-name}.multiSelection.clearConfirmation.(title|message)` |
| Row action confirmation | `uiModel.{overview-model-name}.rowActionGroup.actions.{action-event}.confirmation.(title|message)` |
| Context action confirmation | `uiModel.{overview-model-name}.contextMenu.actions.{action-event}.confirmation.(title|message)` |
| Action group title | `uiModel.{overview-model-name}.contextMenu.groups.{group-name}` |
| Filter selector Other section label | `uiModel.{overview-model-name}.filterSelector.section.other` |

#### Customization

The following snippet demonstrates the way to modify a label of row action confirmation dialog in American English.

Localization Customization

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 ``` | ``` import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react"; import { OverviewEngine } from "@com.mgmtp.a12.overviewengine/overviewengine-core"; import { 	type Locale, 	defaultDataFormats, 	defaultValueConversion, 	defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization";  export const Application: React.ComponentType<{ engineProps: OverviewEngine.Props }> = ({ engineProps }) => { 	const localizerContextValue = React.useMemo(() => { 		const customResourceKeys = { overviewEngine: { rowAction: { confirmation: { ok: "Confirm" } } } };  		const locale: Locale = { language: "en", country: "US" }; 		const dataFormats = defaultDataFormats(locale); 		const conversion = defaultValueConversion(dataFormats); 		const localizer = defaultLocalizerFactory({ 			locale, 			dataFormats, 			conversion, 			translationSource: { en_US: customResourceKeys } 		});  		return { locale, dataFormats, localizer, conversion }; 	}, []);  	return ( 		<LocalizerContext.Provider value={localizerContextValue}> 			<OverviewEngine {...engineProps} /> 		</LocalizerContext.Provider> 	); }; ``` |
```

### Conversion

The Overview Engine utilizes the Conversion API from the utils-localization package to handle value conversions
between document data and rendered UI values, considering the current locale and data formats.

The utils-localization `ValueConversion` interface has two methods:

* `parseValue`: converts the rendered UI value to the document value.
* `formatValue`: converts the document value to the rendered UI value.

When rendering a document value, the Overview Engine calls the `formatValue` method of the contextual `conversion`,
which implements the `ValueConversion` interface and is extracted from `LocalizerContext`.
This method is provided with the value to be converted, along with relevant information such as
the document model name and the model path to the field or group.
Depending on the element type, additional information may be passed,
such as `minFractionalDigits` for `NumberType` elements and `format` for `DateType` elements.

Similarly, when parsing a value, the `parseValue` method is called with the similar parameters.

For more details, please refer to the utils-localization documentation.

To customize the conversion logic, you can provide a custom implementation of the Conversion API.
For example, to customize the format of a `DateType` field named `DateOfBirth` in the `PersonDM` document model:

Conversion customization

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 ``` | ``` import * as React from "react"; import { format } from "date-fns/format";  import { ModelPath } from "@com.mgmtp.a12.base/base-model-api"; import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react"; import { convertMomentToDateFnsFormat } from "@com.mgmtp.a12.widgets/widgets-core"; import { 	defaultDataFormats, 	type ValueConversion, 	defaultValueConversion, 	defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization";  export const LocalizationProvider: React.FC = () => { 	const locale = useProjectLocale();  	const localizerContextValue: LocalizerContext.Type = React.useMemo(() => { 		const dataFormats = defaultDataFormats(locale); 		const defaultConversion = defaultValueConversion(dataFormats);  		const conversion: ValueConversion = { 			...defaultConversion, 			formatValue(value, outputFormat) { 				if ( 					value instanceof Date && 					outputFormat.modelId === "PersonDM" && 					outputFormat.modelPath && 					ModelPath.equal(outputFormat.modelPath, targetFieldPath) 				) { 					// below is a date format using moment's format, to use with date-fns we can use the widgets utility 					return format(value, convertMomentToDateFnsFormat("dd MMM YYYY")); 				}  				return defaultConversion.formatValue(value, outputFormat); 			} 		};  		const localizer = defaultLocalizerFactory({ locale, conversion, dataFormats });  		return { locale, dataFormats, conversion, localizer }; 	}, [locale]);  	return <LocalizerContext.Provider value={localizerContextValue} />; }; ``` |
```

### Display Modes

Apart from the default look, Overview Engine can also be displayed in two other forms: `cardView` and `embedded`.

#### Card View

Once the card view mode is enabled, each row is displayed as a card. All cells in a row are rendered vertically instead of horizontally.
Therefore, this mode is appropriate for screens or containers that have limited width.

Card view mode can be turned on by setting `cardView` prop in `OverviewEngine` component to **true** .
Here is an example result:

![card view](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/card-view.png)

Figure 26. Card-view mode

#### Embedded

Sometimes, there is a need to have an Overview Engine inside another container. However, the default look is usually not suitable for this case. For example, `OverviewEngine` renders not only a table, but also a content-box, which may not look good if the container already renders its own content-box. Therefore, we provide this mode to help solve that situation.

Embedded mode can be enabled by turning on `embedded` prop in `OverviewEngine` component.
The following example demonstrates an embedded one:

![embedded](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/embedded.png)

Figure 27. Embedded mode

### Disability

Overview Engine can be disabled by turning on the `disabled` prop in `OverviewEngine` component:

![disabled](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/images/disabled.png)

Figure 28. Disabled

### Component Customization

The components rendered in Overview Engine are retrieved from the `componentMap` passed to `OverviewEngine`. This makes it possible to customize components in Overview Engine. If custom components are not defined, the default one in `DefaultComponentMap` will be used.

To be more specific, customizing a component usually involves two steps:

* Create a custom component.
* Register the custom component by putting it into `componentMap` map in `OverviewEngine` with the key corresponding to the component you want to customize.

### Show Number of Entries

Open the Overview Model in SME, then check the checkbox **Show Number Of Entries** to enable this feature.
Please refer to [Number of Entries](https://geta12.com/docs/SME/sme-om-ba-docs/index.html#_number_of_entries) session in SME documentation for more details.

Depending on the [Pagination Behavior](https://geta12.com/docs/SME/sme-om-ba-docs/index.html#_paging_behavior), the number of rows can be passed to the `OverviewEngine` via the `rowCount` field of the `pagination` or `infiniteScrollOptions` prop. Note that `rowCount` is optional, so just set it `undefined` before the server responds the real total number of rows.

|  |  |
| --- | --- |
|  | If there is no label, or it is hidden, both label and number of entries will not be shown. |

### Customize Row Styling

Row styling is a callback used by Overview Engine to query the style of a specific row. It receives an object parameter containing the row that would be rendered and its corresponding row index. Based on that, the callback should return an object of `RowStyles` type, which applies to the row.

`RowStyles`, which belongs to Widgets library, has the following structure:

RowStyles interface

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 ``` | ``` /**  * Collections of style values for the row  */ export interface RowStyles extends Styleable { 	title?: string; 	selected?: boolean; 	interactive?: boolean; 	disabled?: boolean; 	highlightVariant?: TableTemplateProps.TableHighlightVariant; 	highlighted?: boolean; 	disabledRightClickContextMenu?: boolean; }  export interface Styleable { 	/** 	 * Additional css class names. 	 */ 	readonly className?: string;  	/** 	 * Additional style. 	 */ 	readonly style?: React.CSSProperties; } ``` |
```

The following example demonstrates how to set interactive status of a specific row.

**Code:**

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` 		<OverviewEngine 			{...otherProps} 			rowStyling={({ row, rowIndex }) => { 				if (ProductDocument.isInstance(row) && rowIndex === 0) { 					return { interactive: false }; 				}  				return { interactive: true }; 			}} 		/> ``` |
```

### Engine Id Prefix

At the moment, model name, set in Overview Model header details, is used as id for different components (e.g. filter options, filter selector, search bar…​).

In case there are many engines of the same model on a screen, this leads to incorrect component identification. Since version 35.2.0, the introduction of `uiIdPrefix` property in `OverviewEngine` allows a flexible way to add a prefix to the engine id, which could eliminate the above issue.

### Custom Field Formatting

Since version 35.2.0, Overview Engine introduces an optional property called `fieldFormatter` to `ExpressionCell` and `ReferenceCell`. This supports the possibility to modify the format of a specific field.

The property is a callback that receives a parameter as an instance of `FieldFormatterParams` and return a string.

The following example demonstrates how to implement `fieldFormatter` property to customize field formatting.

Create a component with custom field formatter

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 ``` | ``` import React from "react"; import { format } from "date-fns/format";  import { convertMomentToDateFnsFormat } from "@com.mgmtp.a12.widgets/widgets-core"; import { 	OverviewEngine, 	useFieldFormatter, 	type ExpressionCell, 	DefaultComponentMap, 	type FieldFormatterParams } from "@com.mgmtp.a12.overviewengine/overviewengine-core";  export const CustomExpressionCell: React.FC<ExpressionCell.Props> = (props) => { 	const formatField = useFieldFormatter();  	const fieldFormatter = React.useCallback( 		(params: FieldFormatterParams) => { 			if (props.columnModel.id === "column-cff6a" && params.value instanceof Date) { 				// below is a date format using moment's format, to use with date-fns we can use the widgets utility 				return `${format(params.value, convertMomentToDateFnsFormat("MMM YYYY"))}`; 			}  			return formatField(params); 		}, 		[formatField, props.columnModel.id] 	);  	return <DefaultComponentMap.ExpressionCell {...props} fieldFormatter={fieldFormatter} />; }; ``` |
```

Override the corresponding component in component map

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` 	return ( 		<OverviewEngine {...otherProps} componentMap={{ ...DefaultComponentMap, ExpressionCell: CustomExpressionCell }} /> 	); ``` |
```

### Custom Time Format

Since version 36.1.0, there are two ways to change the time format (12h or 24h format) in the date time and time picker:

1. Use the `timeMode` (12h or 24h) property in `OverviewEngine` component.
2. Customize the `DateTimeFilterOptionsView` and/or `TimeFilterOptionsView` component from `FilterOptionsViews` in `componentMap` and provide the `timeMode` (12h or 24h) prop.

|  |  |
| --- | --- |
|  | The local props always have higher priority, thus `DateTimeFilterOptionsView` or `` TimeFilterOptionsView’s `timeMode `` can be able to override the global one from the `OverviewEngine`. |

|  |  |
| --- | --- |
|  | By default, the 12-hour format will be used. |

The following examples demonstrate how to customize the time mode using two different ways to show the 24h format:

Provide time mode in OverviewEngine component

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` import * as React from "react";  import { OverviewEngine } from "@com.mgmtp.a12.overviewengine/overviewengine-core";  export const CustomOverviewEngine: React.ComponentType<OverviewEngine.Props> = (props) => { 	return <OverviewEngine {...props} timeMode="24h" />; }; ``` |
```

Customize the DateTimeFilterOptionsView

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` export const CustomDateTimeFilterOptionsView: React.ComponentType<DateTimeFilterOptionsView.Props> = (props) => { 	return <DefaultComponentMap.FilterOptionsViews.DateTimeFilterOptionsView {...props} timeMode="24h" />; };  export const CustomOverviewEngine: React.ComponentType<OverviewEngine.Props> = (props) => { 	return ( 		<OverviewEngine 			{...props} 			componentMap={{ 				...DefaultComponentMap, 				FilterOptionsViews: { 					...DefaultComponentMap.FilterOptionsViews, 					DateTimeFilterOptionsView: CustomDateTimeFilterOptionsView 				} 			}} 		/> 	); }; ``` |
```

### Accessibility Configurations

In case the project has accessibility requirements, [`accessibilityConfigurations`](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/view_overview-engine.OverviewEngine.CommonProps.html#accessibilityconfigurations) property of `OverviewEngine` could be used to set accessibility-related features, including.

* `hasFootContent`: The Overview table footer only has aria-attributes when this property is set as `true`.

### Re-rendering Optimization

Re-rendering is part of any React component lifecycle, most of the time, it is good because your component will always "react" to any change that happens in your application. However, when rendering a big list, re-rendering can easily cause a bottleneck due to the constantly re-rendering of every component. Therefore, it is important to detect the bottleneck when performance is top of project’s priority.

There are multiple approaches to figure out the re-rendering:

1. React devtools: out of the box integration, install the extension then enable highlighting updates or profiling yourself. However, the tools is lacking of hooks supports nor details comparison on why the component is rendered, this sometimes lead to confusion on figuring out which component should be improved.
2. [@welldone-software/why-did-you-render](https://github.com/welldone-software/why-did-you-render): is a library which requires some knowledge about the build tools. Once integrated properly, the tools can show a lot of useful information on which props is changed on which hooks…​ which can help a lot with decision-making on what to be improved one by one.

#### What Are the Usual Causes of Re-Rendering in Overview Engine

##### Customized Component

1. Most if not all Overview Engine component are memoized via `React.memo`. Your custom component should also have it.
2. Avoid re-creating component passed into the component map.

BadCustomOverviewEngine.tsx

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 ``` | ``` /// Bad practice, this can lead to lots of mount/unmount with any change on the Redux store  function CustomOverviewEngine(props) {     const myState = useSelector(mySelector)      return (         <OverviewEngineFactories.ViewComponent             {...props}             componentMap={{                 TableBody: function CustomBody() {                     if(myState === true) {                         return <MyCustomBody />                     }                     return <DefaultComponentMap.TableBody />;                 }             }}         />     ); } ``` |
```

CustomOverviewEngine.tsx

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 ``` | ``` /// Best practice: ///  - Preventing CustomBody function from re-initialized ///  - Cherry pick only the needed state ///  - React.memo  function CustomOverviewEngine(props) {     const componentMap = React.useMemo(() => ({ TableBody: CustomBody }), [])     return <OverviewEngineFactories.ViewComponent {...props} componentMap={componentMap} />; }  const CustomBody = React.memo(function CustomBody(props) {     const myState = useSelector(mySelector)     if(myState === true) {         return <MyCustomBody />     }     return <DefaultComponentMap.TableBody {...props} />; }) ``` |
```

|  |  |
| --- | --- |
|  | The above examples is a blueprint which mean it can be applied to any generic React component that share the same component overriding pattern, this includes Overview Engine’s `ComponentMap`/`WidgetsMap` or Table Widget’s `componentRenderers`. |

##### Selectors

Selector can be a bottleneck for application when not implemented properly. A non-optimized one will always be triggered when an action is dispatched which will lead to the selector to be executed again. Refer to [`reselect` documentation](https://reselect.js.org/introduction/how-does-reselect-work) if interested.

##### Others

Reference type a.k.a. `objects` and `functions` recreation usually does not tax on the performance. However, when those are passed as a property into a component, changing/re-creating the reference will always lead to re-rendering. This can be solved with `React.useMemo` and `React.useCallback`.

### Custom SelectorMap

|  |  |
| --- | --- |
|  | This API is marked as experimental. Breaking changes **might** happen even in minor releases. |

The `SelectorMap` can be used to customize certain state access of the Overview Engine.
The Overview Engine internally uses a default variant of this map, but you can provide your own implementation
containing your customizations as a prop for Overview Engine View Component.
Then it will be used in place of the default one.

For example, customizing the way the Overview Engine selects attachment thumbnails can look like this:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 ``` | ``` import { 	DefaultSelectorMap, 	type SelectorMap } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/view/configuration/selector-map.js";  /**  * The default selector looks up thumbnails by id  *  * Here, we use the content property of attachments instead.  * If it does not exist, we fall back to the default selector.  */ const CustomSelectorMap: SelectorMap = { 	...DefaultSelectorMap, 	attachmentThumbnail: (attachment) => { 		return (state) => 			attachment.content?.startsWith("data:image/") 				? attachment.content 				: DefaultSelectorMap.attachmentThumbnail(attachment)(state); 	} } ``` |
```

Note that it is mandatory to spread the `DefaultSelectorMap` when customizing (similar to `WidgetMap` and `ComponentMap`).

### Overview Engine Data Loader

Overview Engine comes with a default A12 Server Connector that provides the data fetching/modifying logic based on
the A12 standard setup. However, in some cases, where A12 standard setup does not provide sufficient features or
extension points, developers would want to adapt either server-side or client-side code to fulfill their needs.

Generally, it would be simpler to adapt the server-side implementation.
However, in case adaption cannot be done on the server-side,
Overview Engine also offers a possibility to do it on the client-side.

#### Use Cases

There are several use cases that customizing the default Overview Engine Data Loader can come in handy:

* Have a connection to the Data Services instance but some minor adjustments are needed.
  For example: Applying custom filters conditions, custom sorting, modify fields projection, etc.
* Have no connection to Data Services instance. For example: In SME (Simple Model Editor) integration,
  most connections and data storage are done on the client-side.
* Have a connection to the backend server, but it is a completely different instance of Data Services.

#### Default Data Loader

Overview Engine comes with a default data loader that is used to query data from the A12 Data Services.
Any network request coming from the Overview Engine will have to go through this data loader, unless overridden.

When Overview Engine request for the data, the data loader will be called with the following parameters:

* `activityId`: The ID of the Overview Engine activity.
* `documentService`: The document service instance, used for processing documents after being fetched (e.g.: parsing dates).
* `documentModel` & `overviewModel` used by the engine.
* `queries`: A list of `DataOperation.Query` which will be transformed into a Data Services Query API request.

#### Query

`DataOperation.Query` represents a query operation in Overview Engine. It includes the following types:

* [DataOperation.ListDocuments.Query](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/client-extensions_internal_data-loader_data-loader.DataOperation.ListDocuments.Query.html): Lists all documents for the overview table.
* [DataOperation.ListStringFilterOptions.Query](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/client-extensions_internal_data-loader_data-loader.DataOperation.ListStringFilterOptions.Query.html): Lists candidates for enumerated string filter options.
* [DataOperation.Export.Query](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/client-extensions_internal_data-loader_data-loader.DataOperation.Export.Query.html): Exports the overview table.

Each query type may have different required/optional properties. Common properties include:

* `id`: Identifier for the query operation.
* `fields`: Optional list of fields to be projected in the query result.
* `constraint`: Optional constraint operator for the query.
* `sorting`: Optional sorting criteria for the result.
* `paging`: Pagination details, including page size and page numbers. Might request for multiple pages in one go.
* `aggregation`: Optional aggregation details, such as group-by and aggregate functions. Aggregation queries use the `entries` list as the result. With Query API, to avoid conflicts, split aggregation into a separate request while keeping common properties (e.g., constraint).

|  |  |
| --- | --- |
|  | The `DataOperation.Query` is specific to Overview Engine. While it aims to align with the Data Services Query API, they are not 100% identical. |

Below are several examples of how a query is created by Overview Engine:

List documents query

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 ``` | ``` const listDocumentsQuery: DataOperation.ListDocuments.Query = { 	id: "OverviewEngineDataProvider-0", 	type: "LIST_DOCUMENTS", 	paging: { 		pageNumbers: [0], 		pageSize: 10 	}, 	sort: [ 		{ 			field: "/Person/PersonalData/PlaceOfBirth", 			direction: Query.Direction.ASC, 			nullHandling: Query.NullHandling.NULLS_LAST, 			ignoreCase: true 		} 	], 	constraint: { 		operator: "or", 		operands: [ 			{ 				operator: "exact_match", 				field: "/Person/PersonalData/FirstName", 				value: "Aaron", 				caseSensitive: true 			}, 			{ 				operator: "exact_match", 				field: "/Person/PersonalData/FirstName", 				value: "Allen", 				caseSensitive: true 			} 		] 	}, 	fields: [ 		"/Person/PersonalData/FirstName", 		"/Person/PersonalData/LastName", 		"/Person/PersonalData/PlaceOfBirth", 		"/Person/PersonalData/Nationality", 		"/Person/PersonalData/Salary" 	], 	aggregation: { 		aggregations: [ 			{ 				field: "/Person/PersonalData/Salary", 				function: "sum" 			} 		], 		group: [ 			{ 				field: "/__meta/modelReference", 				alias: "model" 			} 		] 	} }; ``` |
```

List String Filter Options query

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 ``` | ``` const enumeratedStringFilterQuery: DataOperation.ListStringFilterOptions.Query = { 	id: "EnumeratedStringDataProvider-2", 	type: "LIST_STRING_FILTER_OPTIONS", 	paging: { 		pageNumber: 0, 		pageSize: 5 	}, 	constraint: { 		operator: "simple_search", 		fields: ["/Person/PersonalData/FirstName"], 		value: "Allen" 	}, 	aggregation: { 		aggregations: [ 			{ 				function: "count", 				field: "/Person/PersonalData/FirstName" 			} 		], 		group: [ 			{ 				field: "/Person/PersonalData/FirstName", 				alias: "name" 			} 		] 	} }; ``` |
```

Export query

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` const exportQuery: DataOperation.Export.Query = { 	id: "export", 	type: "EXPORT", 	sort: [ 		{ 			field: "/businessPartner/name", 			direction: Query.Direction.DESC, 			nullHandling: Query.NullHandling.NULLS_FIRST, 			ignoreCase: true 		} 	] }; ``` |
```

When a query is triggered by the Overview Engine, it is transformed into a [Data Services Query API](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#_query_api) request.
This transformation maps Overview Engine’s `DataOperation.Query` types and properties to the structure expected by the Data Services.

#### Query Result

After the request is sent and a response is received, the data loader maps the response back into the Overview Engine’s expected data structure,
[DataOperation.QueryResult](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/types/client-extensions_internal_data-loader_data-loader.DataOperation.QueryResult.html). This includes:

* Matching the response ID to the original query.
* Extracting the response’s `entries` into a `documents` list, processing the documents as needed (e.g., parsing dates).
* Extracting the `aggregationResult`, which is usually coming from a separate aggregation Query API request.
* Extracting `thumbnails` records as well as other information like `fullSize`.
* Handling the "Export" query result, which requires returning the `location` of the exported file instead of a list.

This transformation layer allows Overview Engine to remain decoupled from backend specifics, enabling extensibility and customization of query handling logic.

#### Customize Data Loader

Query API offers the power to control how the user receives the data, but the engine might not yet be able to cover all possibilities.
Therefore, it is crucial to allow developers to customize the default data loader behavior to fit their needs,
the OverviewEngineDataLoader is delivered to solve this exact problem.
Below are a few instances of how to modify the queries, created by the Overview Engine, with added customizations on top…​
Then process to re-use the default data loader implementation to avoid unnecessary code duplication.

##### Add Extra Filters

Add extra filter

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 ``` | ``` export const customFilterDataLoader: OverviewEngineDataLoader = { 	*provideData(params): SagaGenerator<DataOperation.ResultSet> { 		const { queries, documentModel } = params; 		const [query, ...otherQueries] = queries; 		let updatedQuery = query;  		if (DataOperation.ListDocuments.Query.isAssignableFrom(query) && documentModel.header.id === "ProductDM") { 			// Create a custom constraint to filter products without productType 			const customConstraint: Query.Operator = { 				operator: Query.OPERATORS.NOT_OPERATOR, 				operand: { operator: Query.OPERATORS.UNDEFINED_MATCH_OPERATOR, field: "/product/productType" } 			};  			updatedQuery = { 				...query, 				// Either extends the existing constraint or directly uses it if none exists 				constraint: query.constraint 					? { operator: Query.OPERATORS.AND_OPERATOR, operands: [query.constraint, customConstraint] } 					: customConstraint 			}; 		}  		return yield* call(maybeAsyncFnWrapper(OverviewEngineFactories.dataLoader.provideData), { 			...params, 			queries: [updatedQuery, ...otherQueries] 		}); 	} }; ``` |
```

##### Apply default constraints to enumerated string filter

Apply default constraints to enumerated string filter

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 ``` | ``` export const customEnumeratedStringFiltersDataLoader: OverviewEngineDataLoader = { 	*provideData(params): SagaGenerator<DataOperation.ResultSet> { 		const { queries, documentModel } = params; 		const [query, ...otherQueries] = queries; 		let updatedQuery = query;  		if ( 			DataOperation.ListStringFilterOptions.Query.isAssignableFrom(query) && 			documentModel.header.id === "ProductDM" 		) { 			// A valid candidate for the enumerated string options must be a person with an email address 			const withEmailFieldConstraint: Query.Operator = { 				operator: Query.OPERATORS.NOT_OPERATOR, 				operand: { operator: Query.OPERATORS.UNDEFINED_MATCH_OPERATOR, field: "/product/seller/email" } 			}; 			updatedQuery = { 				...query, 				// Either extends the existing constraint or directly uses it if none exists 				constraint: query.constraint 					? { operator: Query.OPERATORS.AND_OPERATOR, operands: [query.constraint, withEmailFieldConstraint] } 					: withEmailFieldConstraint 			}; 		}  		return yield* call(maybeAsyncFnWrapper(OverviewEngineFactories.dataLoader.provideData), { 			...params, 			queries: [updatedQuery, ...otherQueries] 		}); 	} }; ``` |
```

##### Enforce Default Sorting

Enforce default sorting

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 ``` | ``` export const customSortingDataLoader: OverviewEngineDataLoader = { 	*provideData(params): SagaGenerator<DataOperation.ResultSet> { 		const { queries, documentModel } = params; 		const [query, ...otherQueries] = queries; 		let updatedQuery = query;  		if (DataOperation.ListDocuments.Query.isAssignableFrom(query) && documentModel.header.id === "PersonDM") { 			updatedQuery = { 				...query, 				// Apply a custom default sorting, this could also be extended to emulate the multi-column sorting 				sort: query.sort ?? [ 					{ 						field: "/person/city", 						direction: Query.Direction.ASC, 						ignoreCase: false, 						nullHandling: Query.NullHandling.NULLS_LAST 					} 				] 			}; 		}  		return yield* call(maybeAsyncFnWrapper(OverviewEngineFactories.dataLoader.provideData), { 			...params, 			queries: [updatedQuery, ...otherQueries] 		}); 	} }; ``` |
```

##### Modify Fields Projection

Modify fields projection

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` export const customFieldsProjectionDataLoader: OverviewEngineDataLoader = { 	*provideData(params): SagaGenerator<DataOperation.ResultSet> { 		const { queries, documentModel } = params; 		const [query, ...otherQueries] = queries; 		let updatedQuery = query;  		if (DataOperation.ListDocuments.Query.isAssignableFrom(query) && documentModel.header.id === "BundleDM") { 			updatedQuery = { 				...query, 				// Extends the default selection of fields projection to include the "bundleType" 				// If not specified, all fields are returned 				fields: query.fields ? [...query.fields, "/bundle/bundleType"] : undefined 			}; 		}  		return yield* call(maybeAsyncFnWrapper(OverviewEngineFactories.dataLoader.provideData), { 			...params, 			queries: [updatedQuery, ...otherQueries] 		}); 	} }; ``` |
```

### Skip Initial Loading

To avoid triggering expensive and often irrelevant queries on initial view, the Overview Engine supports an option to defer data loading.
This is particularly useful for models with large datasets, where the default query (e.g. first page with sorting)
can cause performance issues due to how the Data Services processes large result sets.
Instead of loading data immediately, the Engine will wait for explicit user action—such as pressing
the search button or applying a filter—before sending a request.

To enable this feature, go the corresponding menu in the Application Model and check the `Skip data loading` checkbox.
For more information, refer to the [Application Model documentation](https://geta12.com/docs/SME/sme-am-ba-docs/index.html#ModuleMenu).

### Custom RequestSelectorMap

|  |  |
| --- | --- |
|  | This API is marked as experimental. Breaking changes **might** happen even in minor releases. |

The `RequestSelectorMap` can be used to customize how the Overview Engine produces Data Services Query API requests.
Overview Engine ships a default variant, but you can provide your own implementation containing your customizations.
Then it will be used in place of the default one.

For example, adding a default constraint for a specific model while delegating back to the default implementation can look like this:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 ``` | ``` /**  * Example: customize requests by wrapping the defaults.  *  * Always spread DefaultRequestSelectorMap and only override what you need.  */ export const customRequestSelectorMap: RequestSelectorMap = { 	...DefaultRequestSelectorMap,  	// Add a default constraint for a specific model, then delegate back to the default implementation 	loadListDocuments: (config) => { 		const { documentModel, query } = config;  		if (documentModel.header.id === "ProductDM") { 			const mustHaveSku: Query.Operator = { 				operator: Query.OPERATORS.NOT_OPERATOR, 				operand: { operator: Query.OPERATORS.UNDEFINED_MATCH_OPERATOR, field: "/product/sku" } 			};  			const updatedQuery: typeof query = { 				...query, 				constraint: query.constraint 					? { operator: Query.OPERATORS.AND_OPERATOR, operands: [query.constraint, mustHaveSku] } 					: mustHaveSku 			};  			return DefaultRequestSelectorMap.loadListDocuments({ ...config, query: updatedQuery }); 		}  		return DefaultRequestSelectorMap.loadListDocuments(config); 	} }; ``` |
```

Note that it is mandatory to spread the `DefaultRequestSelectorMap` when customizing (similar to `SelectorMap`, `WidgetMap`, and `ComponentMap`).

|  |  |
| --- | --- |
|  | See the API reference for [RequestSelectorMap](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/interfaces/client-extensions_internal_utils_request-selector-map.RequestSelectorMap.html) and the default implementation [DefaultRequestSelectorMap](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/variables/client-extensions_internal_utils_request-selector-map.DefaultRequestSelectorMap.html). |

Why does `loadListDocuments` return a list of requests instead of a single one?
Overview Engine supports requesting multiple pages in a single operation. Each requested page is mapped to one Query API request,
which allows the data loader to dispatch them concurrently and merge the results in order. Other methods build a single request.

#### Injecting a custom map

The map can be injected into an Overview Engine instance by using the data provider function or the generic `createModule` function

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` function setup() {     // Either 	OverviewEngineFactories.createModule({ 		requestSelectorMap: customRequestSelectorMap 	});      // Or directly configure it per data provider     dataHandlers = OverviewEngineFactories.createDataProviders(OverviewEngineFactories.dataLoader, { 		requestSelectorMap: customRequestSelectorMap 	});      // Rest... } ``` |
```

#### Request Filters

This customization approach can also be used in combination with the RequestFilter API (described in the [Data Services documentation](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#json-rpc-modifying-requests)), for example to use your own operation methods.
Customizing the `RequestFilter` alone would not be enough when the method replacement needs some context (e.g. only overriding methods in certain conditions). Using the `RequestSelectorMap` could then be used to provide this context down for the filter to use.

### Scroll to Row

Overview Engine provides the `Events.onScrollToRow` event to scroll the table to a specific row programmatically. This is useful for flows like "scroll to top", "jump to last edited item", or focusing a row after navigation.

The event accepts either a document reference or a row index. Optionally, `autoFocus` can be set to move keyboard focus to the target row after scrolling.

|  |  |
| --- | --- |
|  | When virtual scrolling is enabled, scrolling by `docRef` is not supported. Use `rowIndex` instead. |

#### Payload

`Events.onScrollToRow` accepts one of the following payloads:

* `{ rowIndex?: number, autoFocus?: boolean }`
* `{ docRef?: string, autoFocus?: boolean }`

#### Example

The following example adds a "Scroll to top" button that scrolls to the first row:

Dispatch scroll-to-row event

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 ``` | ``` /*  * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial  *  * Copyright (c) 2012-2026 mgm technology partners GmbH  *  * Dual License  * ------------  * This source file is part of the mgm A12 Platform and available under  * a choice of two different licenses:  *  * 1. Open-Source License - EUPL v1.2  *    You may redistribute and/or modify this file under the terms of the  *    European Union Public License, version 1.2 - see https://eupl.eu/.  *  * 2. Commercial License  *    Alternatively, you may obtain a commercial license from  *    mgm technology partners GmbH, that permits use of this software  *    under different terms (including support and maintenance services).  *  *    Please contact a12-license@mgm-tp.com for more information.  *  * You must select and comply with exactly one of the above license options.  *  * Warranty Disclaimer (applies to either option)  * ----------------------------------------------  * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,  * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE  * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.  */  import { useDispatch } from "react-redux";  import { Button } from "@com.mgmtp.a12.widgets/widgets-core"; import { Events, OverviewEngineActions } from "@com.mgmtp.a12.overviewengine/overviewengine-core";  export const ScrollToTopButton = (props: { activityId: string }) => { 	const { activityId } = props; 	const dispatch = useDispatch();  	const onClick = () => { 		dispatch( 			OverviewEngineActions.event({ 				activityId, 				engineAction: Events.onScrollToRow({ rowIndex: 0, autoFocus: true }) 			}) 		); 	};  	return <Button label="Scroll to top" onClick={onClick} />; }; ``` |
```

The event is handled by the engine and stored in `uiState.scrollToRow` until the view processes it. The view then acknowledges it internally so the request is cleared.

#### Pagination Behavior

When using pagination, `Events.onScrollToRow` with a `rowIndex` only operates on the currently visible page. It does not change the active page. This is by design — pagination state and scroll position are independent concerns.

If you need to scroll to a row on a different page, dispatch two actions sequentially:

1. A page-change action (e.g., `Events.onPageClicked`) to navigate to the target page.
2. `Events.onScrollToRow` with the desired `rowIndex` within that page.

|  |  |
| --- | --- |
|  | When using `docRef`, the engine resolves the row from the current page data. If the referenced document is not on the current page, the scroll request has no effect. |

## API Documentation

The API documentation can be found [here](https://geta12.com/docs/2025.06/ext5/overview_engine/overviewengine-dev-docs/assets/generated/typedoc/index.html).

## Migration Instructions

### 2025.06-ext4

#### Data Services configuration properties

Overview Engine now reads Data Services configuration properties from the Data Services slice (for example
`mgmtp.a12.dataservices.query.simpleSearch.minSearchableTokenSize`). In case the slice is missing, some UI
features (such as search and enumerated string filter options) may behave incorrectly and a warning is logged.

To enable the configuration lookup:

1. Add the Data Services configuration reducer during app setup.
2. Load the configuration once after the application is initialized.

Reducer map + configuration load

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` import { DataServicesReducerMap, loadDataServicesConfiguration } from "@com.mgmtp.a12.dataservices/dataservices-access";  const { store } = ApplicationFactories.createApplicationSetup({ 	// ... 	reducerMap: { ...DataServicesReducerMap } });  await loadDataServicesConfiguration(store); ``` |
```

If you are using the new composable setup, simply include the `withDataServicesConfigurationSlice` feature as a prerequisite of the `withOverviewEngine` feature:

Composable setup

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` import { withDataServicesConfigurationSlice } from "@com.mgmtp.a12.client/client-core/dataServicesAdapter"; import { withOverviewEngine } from "@com.mgmtp.a12.overviewengine/overviewengine-core";  const { store, initialActions } = createA12ApplicationSetup( 	combineFeatures( 		withDataServicesConfigurationSlice, 		withOverviewEngine, 		// ... 	)(initialConfig) ); ``` |
```

#### Deprecation of nested imports

Nested imports are deprecated in favor of top-level imports to avoid unnecessary breaking changes caused by moving or renaming internal files.
This makes the code more resilient to internal refactoring, provides a single consistent import path, and reduces ongoing maintenance effort.

Run the [codemod](#codemod) command below to migrate automatically:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx @com.mgmtp.a12.overviewengine/overviewengine-codemod prefer-top-level-imports ./client/tsconfig.json ``` |
```

#### Deprecation of top level OverviewModel entities

All top-level type exports from `overview-model.ts` are deprecated in favor of namespace-scoped exports under `OverviewModel`.
The following types and enums should now be accessed via the `OverviewModel` namespace:

| Deprecated export | New export |
| --- | --- |
| `Content` | `OverviewModel.Content` |
| `Configuration` | `OverviewModel.Configuration` |
| `ContextMenu` | `OverviewModel.ContextMenu` |
| `ActionGroup` | `OverviewModel.ActionGroup` |
| `ColumnRef` | `OverviewModel.ColumnRef` |
| `Styles` | `OverviewModel.Styles` |
| `Width` | `OverviewModel.Width` |
| `PinDirection` | `OverviewModel.PinDirection` |
| `Column` | `OverviewModel.Column` |
| `ReferenceColumn` | `OverviewModel.ReferenceColumn` |
| `Summary` | `OverviewModel.Summary` |
| `ExpressionColumn` | `OverviewModel.ExpressionColumn` |
| `BaseColumn` | `OverviewModel.BaseColumn` |
| `SubHeaderBox` | `OverviewModel.SubHeaderBox` |
| `FooterBox` | `OverviewModel.FooterBox` |
| `Element` | `OverviewModel.Element` |
| `BaseElement` | `OverviewModel.BaseElement` |
| `ButtonElement` | `OverviewModel.ButtonElement` |
| `MultiSelectionElement` | `OverviewModel.MultiSelectionElement` |
| `SearchElement` | `OverviewModel.SearchElement` |
| `FilterElement` | `OverviewModel.FilterElement` |
| `ElementType` | `OverviewModel.ElementType` |
| `SectionItem` | `OverviewModel.SectionItem` |
| `FilterConfiguration` | `OverviewModel.FilterConfiguration` |
| `FilterMode` | `OverviewModel.FilterMode` |
| `EnumeratedStringFilterConfiguration` | `OverviewModel.EnumeratedStringFilterConfiguration` |
| `FieldConfiguration` | `OverviewModel.FieldConfiguration` |
| `RowActionGroup` | `OverviewModel.RowActionGroup` |
| `ConfirmationText` | `OverviewModel.ConfirmationText` |
| `DefaultRowAction` | `OverviewModel.DefaultRowAction` |
| `Triggerable` | `OverviewModel.Triggerable` |
| `ContextMenuItem` | `OverviewModel.ContextMenuItem` |
| `Button` | `OverviewModel.Button` |
| `Annotated` | `OverviewModel.Annotated` |
| `Icon` | `OverviewModel.Icon` |
| `ColumnAlignment` | `OverviewModel.ColumnAlignment` |
| `ColumnStyles` | `OverviewModel.ColumnStyles` |
| `Alignment` | `OverviewModel.Alignment` |
| `HorizontalAlignment` | `OverviewModel.HorizontalAlignment` |
| `VerticalAlignment` | `OverviewModel.VerticalAlignment` |
| `MultiSelection` | `OverviewModel.MultiSelection` |
| `AttachmentDisplayMode` | `OverviewModel.AttachmentDisplayMode` |
| `MultiSelectDisplayMode` | `OverviewModel.MultiSelectDisplayMode` |
| `IconTheme` | `OverviewModel.IconTheme` |

**Migration example:**

Before

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` import { Content, Column, FilterMode, Button } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/overview-model.js";  const content: Content = { /* ... */ }; const column: Column = { /* ... */ }; const mode: FilterMode = FilterMode.ALL; ``` |
```

After

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` import { OverviewModel } from "@com.mgmtp.a12.overviewengine/overviewengine-core";  const content: OverviewModel.Content = { /* ... */ }; const column: OverviewModel.Column = { /* ... */ }; const mode: OverviewModel.FilterMode = OverviewModel.FilterMode.ALL; ``` |
```

#### Deprecation of Pagination type

The `Pagination` type is deprecated in favor of `PaginationState` for better naming clarity and consistency.

| Deprecated export | New export |
| --- | --- |
| `Pagination` | `PaginationState` |

**Migration example:**

Before

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` import { Pagination } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/store/index.js";  const pagination: Pagination = { pageNumber: 0, pageSize: 10 }; ``` |
```

After

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` import { PaginationState } from "@com.mgmtp.a12.overviewengine/overviewengine-core";  const pagination: PaginationState = { pageNumber: 0, pageSize: 10 }; ``` |
```

### 2025.06

|  |  |
| --- | --- |
|  | Please have a look at [Migration to latest A12](https://geta12.com/docs/OVERALL/migration_guide/index.html) chapter for an explanation of general steps. |

#### Migration to ESM

The npm artifacts `@com.mgmtp.a12.overviewengine/overviewengine-core` and `@com.mgmtp.a12.overviewengine/overviewengine-model-migration` were migrated
from CommonJS to [ESM](https://nodejs.org/api/esm.html#modules-ecmascript-modules).
When using Node `22.12+` and modern build tools, there should be no changes necessary to your bundler setup.

|  |  |
| --- | --- |
|  | If your tests depend on mocking/stubbing Overview Engine API, consult the documentation of your test runner on how to work with ES modules. |

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
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` { 	"overrides": { 		"react-redux": { 			"react": "^19" 		} 	}, 	"devDependencies": { 		"@types/react-redux": 7.1.34 	} } ``` |
```

#### Styled-components v6 upgrade

We dropped the support for `styled-components` v5 and now require v6 as our peerDependency.
Please refer to the [styled-components guide](https://styled-components.com/docs/faqs#what-do-i-need-to-do-to-migrate-to-v6) and Widgets migration notes for more information.

#### Breaking Changes

##### Change Infinity Scroll APIs

The interface of `UiState.scrolling` property of the `OverviewEngineState` has been changed in this release.

Old Scrolling

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` export interface Scrolling { 	readonly start: number; 	readonly numberOfRows: number; 	readonly visibleStart: number; // Range of visible rows - start point 	readonly visibleEnd: number; // Range of visible rows - end point } ``` |
```

It has been changed to support the new Query API paging feature.

New Scrolling

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` export interface Scrolling { 	readonly pageSize: number; 	readonly pageNumbers: number[]; 	readonly visibleStart: number; // Range of visible rows - start point 	readonly visibleEnd: number; // Range of visible rows - end point } ``` |
```

**Change in `InfiniteScrollOptions`**

The `loadData` callback of the `infiniteScrollOptions` prop in the `OverviewEngine` component now receives
a new object parameter which contains these following fields: `startPage` and `endPage`.

The new behavior is to load data for a specific range of pages, instead of loading data for a specific range of rows.

Old loadData callback

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` export interface InfiniteScrollOptions {     // ... other properties     loadData(start: number, numberOfRows: number): Promise<void>; } ``` |
```

New loadData callback

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` export interface InfiniteScrollOptions {     // ... other properties     loadData(params: { startPage: number; endPage: number; }): Promise<void>; } ``` |
```

Overview Engine will calculate the total number of items to load `pageSize * (endPage - startPage + 1)`.
More information can be found in the [Infinite Scroll](#infinite-scroll).

##### Query API integration

This version only ships Query API support; interfaces and functions that allow the non-Query API usage have been removed or replaced, including:

| Removed functions | Alternative |
| --- | --- |
| `OverviewEngineFactories.createModule({queryAPI: true})` | `OverviewEngineFactories.createModule({})` |
| `OverviewEngineFactories.createQueryAPIDataProviders` | `OverviewEngineFactories.createDataProviders` |
| `QueryAPIFieldBasedFiltering.toOperators` | `FieldBasedFiltering.toOperators` |
| `QueryAPIAggregation.AggregationResolver` | `AggregationResolver` |
| `QueryAPIAggregation.createSumAggregation` | `AggregationResolver.create` |

##### Fields projection

Follow the Query API integration, fields projection is now enabled by default, allow the engine to only load the relevant fields.
In case of needing additional fields, follow a look at the OverviewEngineDataLoader and its customization section to add more fields to the default list.

##### Remove OverviewEngineActions.updateEnumeratedStringDataHolder

The action `OverviewEngineActions.updateEnumeratedStringDataHolder` is no longer used and removed in this release as a consequence.

##### Use slash instead of dot for FilterMap fieldPath

The `fieldPath` in `FilterMap` used dot (`.`) as the separator, which is not compatible with ModelPath and Query API.
Now the separator is changed to slash (`/`).

FilterMap is used to define the [Preset Filter](#preset-filters) for the Overview Engine.

Old FilterMap

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` const presetFilter: OverviewEngineApi.FilterMap = { 	"product.name": { 		filterType: "String", 		criteria: { 			value: "board" 		}, 		nonRemovable: true 	}, 	"product.logistics.weight.weightValue": { 		filterType: "Number" 	} }; ``` |
```

It has to be transformed to use slash (`/`) to adapt with this change.

New FilterMap

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` const presetFilter: OverviewEngineApi.FilterMap = { 	"/product/name": { 		filterType: "String", 		criteria: { 			value: "board" 		}, 		nonRemovable: true 	}, 	"/product/logistics/weight/weightValue": { 		filterType: "Number" 	} }; ``` |
```

##### Embedded Attachments API removed

The embedded attachments related API has been removed, the engine now solely relies on the thumbnails slice to render the thumbnail.
Unless embedded attachment is used, it is expected to have no impact to the current setup. However, it case embedded attachment is used,
to restore functionality, the newly introduced [`selectorMap`](#/selector-map) will be used to remap the new default thumbnail accessing logic.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 ``` | ``` import { 	DefaultSelectorMap, 	type SelectorMap } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/view/configuration/selector-map.js";  const CustomSelectorMap: SelectorMap = { 	...DefaultSelectorMap, 	attachmentThumbnail: (attachment) => { 		return (state) => 			attachment.content?.startsWith("data:image/") 				? attachment.content 				: DefaultSelectorMap.attachmentThumbnail(attachment)(state); 	} } ``` |
```

By default, the thumbnail selector assumes that thumbnails for attachments can be queried from the thumbnails slice by their id.
However, for embedded attachment implementation, the image source can be simply accessed by directly read the `content` prop.

The `selectorMap` can then be passed into any OverviewEngine view component to override the default behavior.

##### Sorting behavior

From 2025.06 version, sorting behavior is changed.

* Case is ignored during sorting (`ignoreCase` is set to true).
* If no default sorting is specified, results are sorted by `__meta/createdAt` in descending order.

##### Drop deprecated APIs

###### OverviewEngineViewViews

The namespace `OverviewEngineViewViews` is no longer used and has been removed.
This change includes the removal of the following:

* `OverviewEngineViewViews.OverviewEngineView`
* `OverviewEngineViewViews.OverviewEngineViewProps`
* `ConnectedOverviewWrapperProps.onDocumentButtonClick`
* `ConnectedOverviewWrapperProps.onDocumentButtonDoubleClick`

More information can be found in the 2024.06’s deprecation section.

###### OverviewEngineState

The `OverviewEngineState` has been changed in this release. The following properties have been removed:

* `sorting`
* `filter`
* `rowState`

More information can be found in the 2024.06’s deprecation section.

###### OverviewEngine Props

Several properties of the OverviewEngine have been changed in this release. The following props have been removed:

* `rowState`
* `disabled`
* `searchString`
* `sorting`
* `pagination`
* `fieldBasedFiltering.activeFilters`
* `fieldBasedFiltering.enumeratedStringFilterMap`
* `fieldBasedFiltering.timeMode`

More information can be found in the 2024.06’s deprecation section.

|  |  |
| --- | --- |
|  | For `fieldBasedFiltering.timeMode`, the time mode customization can be done via the `timeMode` property of the **OverviewEngine** component. For more details, refer to [custom time format](#_custom_time_format). |

###### OverviewEngineActions

The `OverviewEngineActions` have been changed in this release. The following actions have been removed:

* `OverviewEngineActions.queryParametersChanged`
* `OverviewEngineActions.documentsSelectionChanged`
* `OverviewEngineActions.documentMultiSelectionClear`

More information can be found in the 2024.06’s deprecation section.

###### OverviewEngineSelectors

The `OverviewEngineSelectors` have been changed in this release. The following selectors have been removed:

* `OverviewEngineSelectors.getState`
* `OverviewEngineSelectors.getStateWithoutDefaults`

More information can be found in the 2024.06’s deprecation section.

##### Model Changes

###### Drop migration support for models before version 36.0.0

The migration tool no longer supports migration of Overview models before version 36.0.0.
If you need to migrate models from an older version, you need to migrate to version 36.0.0 first using the migration tool of that version.

###### Make `showFullTextSearch` optional

The field `showFullTextSearch` of the Overview Model `Configuration` interface has been changed from
a required boolean to an optional boolean.

Since `undefined` and `false` are both falsy, existing checks should continue to work without modification.
If more explicit handling is needed, use the nullish coalescing operator:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` const showFullTextSearch = overviewModel.content.configuration.showFullTextSearch ?? false; if (showFullTextSearch) {     // Logic when full text search is enabled } ``` |
```

###### Rename `fieldIDs` within `FilterConfiguration` to `fields` and change its type from an array of string to an array of object

This change applies to all `fieldIDs` within `FilterConfiguration`, including:

* `FilterConfiguration["fieldIDs"]`
* `SectionItem["fieldIDs"]`
* `EnumeratedStringFilterConfiguration["fieldIDs"]`

New Model Interface

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 ``` | ``` export interface SectionItem { 	// other properties 	readonly fields: ReadonlyArray<FieldConfiguration>; }  export interface FilterConfiguration { 	// other properties 	readonly fields?: ReadonlyArray<FieldConfiguration>; }  export interface EnumeratedStringFilterConfiguration { 	// other properties 	readonly fields: ReadonlyArray<FieldConfiguration>; }  export interface FieldConfiguration { 	readonly fieldID: string; } ``` |
```

### Migration Tool

To migrate Overview Model files, first install or update the migration tool with

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm install -g @com.mgmtp.a12.overviewengine/overviewengine-model-migration ``` |
```

Then run the following command to perform the migration

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` overview-model-migration <path to overview model file or directory> --backup ``` |
```

*Examples*

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` # file overview-model-migration my-overview-model.json --backup  # folder overview-model-migration . --backup ``` |
```

**Note**

* The minimum supported model version is 36.0.0. Models older than this must first be migrated to version 36.0.0 using that version’s migration tool.
* If `<path to overview model file or directory>` is a directory, the migration tool will recursively search for Overview Model files to migrate.
* If Overview Model files are not under version control, use `--backup` (alias `-b`) flag to create backups for model files. This flag is optional.
* Use `--help` (alias `-h`) flag to show all available options.

### Codemod

#### Introduction

The Overview Engine Codemod is a command-line tool for running automated code transformations (codemods) on TypeScript projects.
Codemods assist with codebase migrations by automatically applying breaking changes, deprecations, and API updates—reducing manual effort and minimizing human error during upgrades.

#### Installation

The codemod can be executed directly using `npx` or `pnpm dlx` without requiring a permanent installation:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx @com.mgmtp.a12.overviewengine/overviewengine-codemod@latest <recipe-id-or-version> <tsconfig-path> [options] ``` |
```

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` pnpm dlx @com.mgmtp.a12.overviewengine/overviewengine-codemod@latest <recipe-id-or-version> <tsconfig-path> [options] ``` |
```

#### Usage

The codemod supports two primary modes of operation:

1. **Recipe-based execution** — Run a specific codemod recipe by its identifier
2. **Version-based migration** — Run all applicable recipes for a target engine version

##### Running a Specific Recipe

To execute a single codemod recipe, provide the recipe identifier and the path to your TypeScript configuration:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx @com.mgmtp.a12.overviewengine/overviewengine-codemod@latest <recipe-id> <tsconfig-path> ``` |
```

Example: Running a specific recipe

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx @com.mgmtp.a12.overviewengine/overviewengine-codemod@latest rename-deprecated-props ./tsconfig.json ``` |
```

##### Migrating to a Target Version

To run all codemods applicable for migrating to a specific library version, provide the target version number instead of a recipe identifier:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx @com.mgmtp.a12.overviewengine/overviewengine-codemod@latest <target-version> <tsconfig-path> ``` |
```

The tool automatically identifies and executes all recipes whose supported version range includes the specified target version.

Example: Migrating to version 38.0.0

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx @com.mgmtp.a12.overviewengine/overviewengine-codemod@latest 38.0.0 ./tsconfig.json ``` |
```

##### Interactive Mode

For guided execution, use interactive mode to select recipes or specify the target version through prompts:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx @com.mgmtp.a12.overviewengine/overviewengine-codemod@latest --interactive ``` |
```

#### Arguments

| Argument | Description |
| --- | --- |
| `<recipe-id-or-version>` | Either the identifier of a specific codemod recipe to execute, or a target version number (e.g., `1.2.0`, `38.0.0`) to run all applicable recipes. Use `--list` to view available recipes and their supported versions. |
| `<tsconfig-path>` | Path to a `tsconfig.json` file or a directory containing one. Accepts both absolute and relative paths (relative to the current working directory). |

#### Options

| Option | Default | Description |
| --- | --- | --- |
| `--list`, `-l` | `false` | Lists all available codemod recipes along with their supported version ranges and descriptions. |
| `--interactive`, `-i` | `false` | Launches interactive mode, allowing you to select a recipe or specify a target version through guided prompts. |
| `--git-check` | `true` | Verifies that the git working directory is clean before execution. If uncommitted changes are detected, you will be prompted to confirm before proceeding. |
| `--help` | — | Displays CLI help information including usage syntax, available options, and examples. |

#### Examples

##### List Available Recipes

Display all available codemod recipes with their supported versions:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx @com.mgmtp.a12.overviewengine/overviewengine-codemod@latest --list ``` |
```

##### Run a Single Recipe

Execute a specific recipe on a project:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx @com.mgmtp.a12.overviewengine/overviewengine-codemod@latest prefer-top-level-imports ./client/tsconfig.json ``` |
```

##### Migrate to a Specific Version

Run all codemods required to migrate to version 38.0.0:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx @com.mgmtp.a12.overviewengine/overviewengine-codemod@latest 38.0.0 ./tsconfig.json ``` |
```

##### Skip Git Check

Run a codemod without verifying the git working directory state:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx @com.mgmtp.a12.overviewengine/overviewengine-codemod@latest 38.0.0 ./tsconfig.json --no-git-check ``` |
```

##### Interactive Mode

Launch the interactive interface for guided execution:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx @com.mgmtp.a12.overviewengine/overviewengine-codemod@latest -i ``` |
```

#### Post-Execution Recommendations

After running codemods, it is recommended to:

1. **Review the changes** — Codemods apply transformations based on pattern matching and may not cover all edge cases. Carefully review the generated diff before committing.
2. **Run linters and formatters** — Codemods do not automatically apply code formatting. Run your project’s linter (e.g., ESLint) and formatter (e.g., Prettier) to ensure code style consistency.
3. **Execute tests** — Run your test suite to verify that the transformations did not introduce regressions.
4. **Commit incrementally** — If running multiple recipes or migrating across versions, consider committing after each successful transformation for easier rollback if issues arise.
