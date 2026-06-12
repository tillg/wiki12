---
source: https://geta12.com/docs/2025.06/ext5/form_engine/formengine-documentation-bundle/index.html
category: form_engine
docid: formengine-documentation-bundle
scraped: 2026-06-12
---

# Form Engine

## Introduction

This is the documentation for the Form Engine.

Please refer to the [Overall Documentation](https://geta12.com/docs/OVERALL/what_is_a12/index.html#_engines) for general information about engines.

Looking for modeler or analyst documentation? Please have a look at the [Form Model Editor Documentation](https://geta12.com/docs/SME/sme-fm-ba-docs/index.html).

Do you want to integrate the Form Engine into your Client application? Please consult the Chapter [Integration](#form-engine_integration). The Form Engine package provides dedicated integration components.

## Form Engine

The A12 Form Engine is an interpreter of A12 Form Models, which in turn rely on A12 Document Models.

Engine behavior can be customized by the application using configuration parameters, provider code, and custom widgets (React components).

Project custom widgets are treated the same as existing internal widgets. They have full access to the internal runtime model of the engine.

The provided npm packages contain plain JavaScript code, but all sources as well as source maps for TypeScript are provided in order to enable a good debugging experience of the engine code. None of the code is obfuscated and therefore human-readable.

### Artifacts

The public API of the Form Engine library is provided via the following artifacts:

npm packages:

* @com.mgmtp.a12.formengine/formengine-core: Contains the core functionality of the Form Engine
* @com.mgmtp.a12.formengine/formengine-content-elements: Experimental package providing form related content elements for content models
* @com.mgmtp.a12.formengine/formengine-content-elements-editor: Experimental package providing editor UI components for the content elements
* @com.mgmtp.a12.formengine/formengine-model-migration: Provides the Form Model migration tool

Java artifacts:

* com.mgmtp.a12.formengine:formengine-model: Contains the Java representation of the Form Model, as well as serialization and validation functionality for Form Models
* com.mgmtp.a12.formengine:computation-relevancy-analyzer: A CLI tool that analyzes and validates form computation dependencies

### Getting Started

The Form Engine is provided as a npm package containing ES2024 ES modules. Therefore, it can be used like any other JavaScript component:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm install --save-dev @com.mgmtp.a12.formengine/formengine-core ``` |
```

After that, you can start integrating the Form Engine into your application. Here is a minimal, but fully functional and self-contained example:

```
|  |  |
| --- | --- |
| ```   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49  50  51  52  53  54  55  56  57  58  59  60  61  62  63  64  65  66  67  68  69  70  71  72  73  74  75  76  77  78  79  80  81  82  83  84  85  86  87  88  89  90  91  92  93  94  95  96  97  98  99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118 119 120 121 122 123 ``` | ``` import type { ReactNode } from "react"; import { createRoot } from "react-dom/client"; import { connect, Provider } from "react-redux"; import { applyMiddleware, legacy_createStore as createStore } from "redux";  import type { 	DefaultDispatchProps, 	DefaultOwnProps, 	DefaultStateProps, 	EngineState, 	FormModel, 	ScrollHandlerProps } from "@com.mgmtp.a12.formengine/formengine-core"; import { 	createCombinedReducer, 	createEmptyDocument, 	createEngineMiddlewares, 	createEngineStore, 	defaultMapDispatchToProps, 	defaultMapStateToProps, 	defaultValueParser, 	FormEngineRenderer, 	ScrollHandler, 	unmarshallFormModel } from "@com.mgmtp.a12.formengine/formengine-core"; import { 	DocumentServiceFactory, 	GeneratedCodeAccessorFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js"; import { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js"; import { ConsoleLoggingStrategy, Settings } from "@com.mgmtp.a12.utils/utils-logging"; import { LogLevel } from "@com.mgmtp.a12.utils/utils-logging/api.js";  Settings.LogStrategy = new ConsoleLoggingStrategy(console, LogLevel.LOG);  const mountPoint = window.document.createElement("div"); window.document.body.appendChild(mountPoint);  loadModels().then(({ formModelAsJson, documentModelAsString, validationCode }) => { 	// unmarshall models 	const documentModel = new DocumentServiceFactory() 		.getDocumentModelSerializer() 		.deserialize(documentModelAsString);  	const validatorProvider = new GeneratedCodeAccessorFactory().createScriptAccessor(validationCode);  	const formModel = unmarshallFormModel( 		formModelAsJson, 		documentModel, 		defaultValueParser(documentModel) 	);  	// create and initialize store 	const document = createEmptyDocument(documentModel, formModel); 	const initialState = createEngineStore({ 		data: { document }, 		locale: Locale.fromString("en_US") as Locale, 		models: { 			formModel, 			documentModel, 			validatorProvider 		} 	});  	const storeEnhancer = applyMiddleware(...createEngineMiddlewares()); 	const EngineReducer = createCombinedReducer(initialState); 	const store = createStore(EngineReducer, initialState, storeEnhancer);  	const root = createRoot(mountPoint);  	// render 	root.render( 		<Provider store={store}> 			<ScrollHandlerConnected> 				<EngineConnected /> 			</ScrollHandlerConnected> 		</Provider> 	); }); const EngineConnected = connect< 	DefaultStateProps, 	DefaultDispatchProps, 	DefaultOwnProps, 	EngineState >( 	defaultMapStateToProps, 	defaultMapDispatchToProps )(FormEngineRenderer);  const ScrollHandlerConnected = connect< 	ScrollHandlerProps, 	{}, 	{ children?: ReactNode }, 	EngineState >(function mapStateToProps(state) { 	return { 		uiState: state.ui, 		models: state.models 	}; })(ScrollHandler);  // Example of loading models function loadModels(): Promise<{ 	formModelAsJson: FormModel; 	documentModelAsString: string; 	validationCode: string; }> { 	const formModelPromise = fetch(`models/formModel.json`).then( 		response => response.json() as Promise<FormModel> 	);  	const documentModelPromise = fetch(`models/documentModel.json`).then(response => response.text());  	const validatorProviderPromise = fetch(`models/validation.js`).then(response => response.text());  	return Promise.all([formModelPromise, documentModelPromise, validatorProviderPromise]).then( 		([formModelAsJson, documentModelAsString, validationCode]) => ({ 			formModelAsJson, 			documentModelAsString, 			validationCode 		}) 	); } ``` |
```

#### Prerequisites

The Form Engine uses TypeScript, React and Redux as underlying technologies. This documentation often refers to React and Redux concepts, and it is assumed that you are familiar with them. Please contact mgm training or your team lead if this is not the case.

### Architecture

The Form Engine runtime follows the general Redux architecture. Therefore, it consists of two major parts, which are strictly separated: view and behavior.

![Redux](https://geta12.com/docs/2025.06/ext5/form_engine/formengine-documentation-bundle/assets/images/form-engine/Redux.svg)

The behavior part defines and manages the state of the Form Engine. It is implemented as a Redux middleware and defines how event-actions lead to state changes.

The view part displays the state and forwards UI events (user input) back to the behavior part. It is implemented as a Redux connected React component and defines how a given state (and configuration) manifests itself in the (React virtual) DOM. It also defines which actions are dispatched as a consequence of UI (DOM) events.

The following image gives an overview about the architecture of the Form Engine:

![Architecture](https://geta12.com/docs/2025.06/ext5/form_engine/formengine-documentation-bundle/assets/images/form-engine/Architecture.svg)

1. The Redux state holds the current state of the engine. It contains information about the UI-state (validation messages, location, ect.), data, and models. ([State](#form-engine_state))
2. The selectors return parts from the state and are used to create the props for the renderer.
3. The renderer traverses the Form Model and uses React components to render. Render components can be replaced by customizing the component map. It contains entry per Form Model element. The component has access to all models, data, and configuration. ([Rendering](#form-engine_rendering))
4. The `DispatchConfiguration` maps an UI-event to an event-action. ([Events and Actions](#form-engine_events_and_actions))
5. Event-actions are processed in middlewares, which dispatch command-actions to trigger a state change. ([Events and Actions](#form-engine_events_and_actions))
6. Command-actions are handled in reducers, which change the state. ([Events and Actions](#form-engine_events_and_actions))

#### View

The view of the Form Engine (lower half in the diagram) is exposed as a model-driven React component, which needs to be connected to a Redux store. Connected means that it depends on Redux as its higher-level infrastructure. Model-driven means that it relies on A12 Models and Documents.

User interactions are propagated as event callback functions from the internal React components into the connect infrastructure where they are translated to Redux actions.

The internal React components only contain short-lived, pure UI state like "date picker opened".

The view is separated into several components to allow customizing and modularization:

* **FormModelMap:** Assignment of Form Model elements to React components that render them. These React components have a common props API that includes the Form Model element, the event callbacks and the general engine configuration.
* **Engine ContentBox:** React component that renders the `ContentBox` of the Engine.
* **Engine ScrollHandler:** React component that renders a `ScrollHandler` which takes care of focusing elements and scrolling to them.

#### Behavior

The behavior of the engine consists of its runtime configuration that is defined by the Redux state, and its dynamic behavior is implemented as Redux functions, i.e. actions, middleware, reducer, and selectors.

The *state* represents all significant properties of the engine’s domain, e.g. data, selection state and validation state. Therefore, its structure is aligned to the engine domain.
Note: Pure UI state has no meaning outside the respective UI component and is kept in its React state. Therefore, the engine does not provide any access to this kind of state.

The engine *actions* are divided into two types: *events* and *commands*.

[Events](#form-engine_events_and_actions_events) signal that something has happened in the UI, triggered by a user interaction. For example a click on a button or typing into an input.
They are handled by middlewares and will never change the state directly. They can be dispatched by users, for example "Events.addRow" when a repeat row should
be added programmatically. You are also encouraged to listen to them, for example to "Events.eventButton" to get notified about a button click.

[Commands](#form-engine_events_and_actions_commands) are used to directly modify the Redux state. They are dispatched by other Events/Commands and are usually implemented in reducers. Users are encouraged
to dispatch them, for example "Commands.setDisabled" to disable the UI, but are **NOT** encouraged to listen to them. Which commands are dispatched in what order
and by what user interaction is considered an implementation detail and a change is not considered breaking.

The *middlewares* serve two purposes:

* based on the state, it translates an event into one or more commands
* it is a convenient extension point to customize engine behavior.

The *reducers* contain the code to mutate the state. It is primarily a technical necessity. However, it is important to know that the reducers must be adapted to different store structures.

The *selectors* are used to select different properties from the state. Like reducers, they must be aligned to the store structure, e.g. to the Client where for example models are kept in a different structure. In addition, selectors can be used when the data or models cannot be stored in the standard way, e.g. in case of lazy loading or dynamic transformation of models and data.

**Why is the state kept as pure data?**

This is necessary for the Redux state change detection and rendering. It also allows easy replacement of any part of the state without dependencies to additional code.

**Why are actions separated into events and commands?**

This helps to understand the engine’s runtime behavior better, because you can rely on the effect of actions only creating other actions or changing the state. This makes maintenance, customizing, and debugging easier.

It also serves as a reminder not to listen to commands when you want to react to some user interaction. Which event is dispatched by what user interaction is fixed. Which commands are dispatched as a result might change and should not be relied on.

**Why are middlewares, reducers, and selectors used?**

Short answer: Client is based on Redux.

Using Redux to implement engine behavior allows a frictionless integration into existing Redux based architectures like Client:

* The state that drives the engine’s UI can simply be controlled and modified using Redux means. Without such infrastructure, the state is either intrinsic to the engine (not a viable solution) - or a state merge must be conducted which can become error-prone and might need to deal with ambiguous situations.
* Parts of middleware, reducer, and selectors can be replaced by own implementations to achieve custom behavior and different ways of data handling like dynamic transformations and lazy loading.

The usage of pure data structures for all state also makes complex state changes more robust and flexible, because there is no risk of stale data, invalid references, and memory leaks. This ultimately makes customizing the engine behavior simpler, also without Client.

### Engine State

When the state for the Form Engine is created it is initialized from the given configuration. If no configuration is given a default state is used. At any given moment, the Form Engine state is defined by

* [Data state](#form-engine_state_data-state)

  + document
  + dirty
  + attachment state (loading state, thumbnails, ids)
* Models
* [UI state](#form-engine_state_ui-state)

  + validation state
  + dirty
  + form location
  + repeat state
  + enablements
  + correction mode and validation bar state
  + auxiliary state like backups, section (collapsing) state
* [Locale state](#form-engine_state_locale-state)

#### Data State

The data state contains information about the [document](#form-engine_state_data-state_document) and the [dirty state](#form-engine_state_data-state_dirty-state) of the document.

##### Document

The document is the central object of interest in the Form Engine. The entire purpose of the Form Engine is to mutate a single document.

The same data document object is stored and mutated in-memory – even across different Screens of a form.

Almost all user and API activities lead to changes of field values or custom type values (e.g. attachments) and nesting structures (groups). However, the document must always be changed through the supplied Redux actions in order to ensure proper conversion and validation.

The current UI representation of the Form Engine is mainly controlled by field values – either directly by the values shown in inputs or indirectly by "dependencies" (see [Form Model Editor documentation](https://geta12.com/docs/SME/sme-fm-ba-docs/index.html) for details about dependencies).

The values in the document are stored as JavaScript data types, i.e. `string`, `number`, `boolean`, `Date` or `object`, depending on the A12 Document Model types:

| A12 Type | JavaScript Type |
| --- | --- |
| Boolean | boolean |
| Confirm | true |
| Custom | object |
| Date | Date with time set to 00:00:00 |
| Date Time | Date with milliseconds set to 000 |
| Time | Date with date 1970-01-01 |
| Date Fragment | Date with time set to 00:00:00 and missing parts taken from 2000-01-01 (or <baseYear>-01-01, if a base year is set in the Document Model) |
| Enumeration | string (codes) |
| Number | number |
| String | string |

Absent values are either not stored or represented by the JavaScript `null` value. A not stored value is treated as `null`.

|  |  |
| --- | --- |
|  | JavaScript `Date` values are always stored in the time zone, that is specified in the Document Model. You must take this into account when calculating with dates. |

###### Input Controls

The user can only change value in the document by using input controls. For String, Date/Time (input controls), and Number fields, the value is written when the input contains a parse-able value (according to Kernel basic type check) and the user leaves the input ("on blur"). For Boolean, Enumeration, and Date/Time (pickers), the value is written when the user selects or changes any value.

For custom types this behavior is similar but a group will change instead of a field. For an attachment this will happen after its successful upload.

###### Repeats

For Detached Repeat and Inline Repeats, all value changes and row operations (add, move, remove) are directly applied to the document. This has also implications on the validation behavior, because the validation is always conducted on the current document (or parts of it). See validation behavior for details.

Detached Repeat Detail Screens provide a cancel option to undo changes that are done within this Screen. For this, the Form Engine keeps backups of the document, which then are used to rollback the changes. In case of nested Repeats, each Repeat holds its own backup. Therefore, canceling changes in a Repeat Detail Screen will undo all changes made after entering the Detail Screen, including changes applied to nested Repeats and **changes made by API**.

###### API Behavior

Applications can change the document, but they must use the provided engine actions to ensure proper updates of the UI state. By default, every single change event triggers validation and computation.

If you want to change multiple values at once, you must call validation and computations yourself using the A12 kernel-facade API. After that, you must update the Form Engine data and validation state.

##### Dirty State

The data dirty state signals that the document has changed in the past. It is initialized with false and will turn true, when a value changes on a top-level Screen or when changes on a Detached Repeat Detail Screen are committed. The default behavior will never change the value back to false even when the document is later changed back to the initial one and technically the data is not dirty any longer. However, it is possible to set the value with the Command `setDataDirty(dirty: boolean)`.

Changes on a Detached Repeat Detail Screen, that are not committed yet, are tracked by a separate dirty state for the Screen (see [Dirty State](#form-engine_state_ui-state_form-location_dirty-state)).

#### UI State

##### Dirty State

The UI dirty state signals that UI contained data that was not directly synchronized with the document. This applies to conversion errors where the syntactically incorrect value cannot be written back into the document. The default behavior never changes the value back to false even when the conversion error is resolved. However, it is possible to set the value with the Command `setUIDirty(dirty: boolean)`.

In addition, if the option `earlyDetectDirtyControl` is enabled and some value is touched (changed but not submitted), the UI dirty state will turn also true.

##### Validation State

The sum of all validation (and conversion) errors that are present in the current Screen resembles the validation state.

Each message refers to an "error element". The error element defines the repeatability to which the message refers. The message also contains the element where the message is displayed inside the form.

Every validation message belongs to a validation rule that can be triggered by the referred elements.

###### UI

For the following descriptions, note that the visibility of individual fields is dependent on multiple aspects:

* Their container elements being visible and not collapsed (sections)
* Field and group dependencies that can declare the field or one of its parent groups as *not relevant*. Non-relevant elements are hidden and not considered for validation.
* The control of the field being located on a different screen than the currently selected one.

From within the UI, the validation state can be changed in several ways:

* Changing a Field value: A single field is validated. All changes resulting from computations and/or dependencies for this field that are visible on the current Screen will also be validated. The validation results for all validated fields are replaced in the validation state.
* Leaving a repeat row: All currently visible fields of the row are validated. The validation results for these fields are replaced in the validation state.
* Leaving a repeat: All currently visible fields of the repeat rows are validated. The validation results for these fields are replaced in the validation state.
* Triggering an event/navigation button:

  + With partial validation: All currently visible fields on the Screen are validated. The validation results for these fields are replaced in the validation state.
  + With full validation: All relevant fields in the document are validated, independently of their visibility in the UI. The result replaces the previous validation state.

|  |  |
| --- | --- |
|  | Because validation after a field value change only considers the visible fields, field changes that violate for example a validation rule will not result in an error for that field, if it is currently not visible, e.g. when a dependent field changes on another Screen. However, if a changed field contained validation messages, they will be cleared, even if the field is not visible on the current Screen. |

###### API

Full validation is triggered by events.

See ([Validation and Computation](#form-engine_validation-computation)) for API functions related to validation.

##### Form Location State

The current visible form segment and the corresponding repeatable element inside the document define the form location. The repeatable element is only relevant for Detached Repeat Detail Screens.

The repeat state stored for the form location contains the data-related ui state of the location’s repeats, including:

* the current page of the repeat
* information about a new row
* information about the expanded embedded repeat row

The form location can be thought as a path of `(form segment, index)` tuples.

To distinguish between existing rows and rows being created you have to evaluate the `RepeatState` of the `Repeat`.
You can do this by using the following code:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 ``` | ``` import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js"; import type { EngineState } from "@com.mgmtp.a12.formengine/formengine-core"; import { UiStateSelectors } from "@com.mgmtp.a12.formengine/formengine-core";  export function newRow(state: EngineState): boolean { 	const screenLocation = UiStateSelectors.screenLocationStack()(state); 	const currentLocationPath = UiStateSelectors.currentScreenLocation()(state).locationPath;  	/** 	 * The current location screenLocation[screenLocation.length - 1] is the 	 * DetachedRepeat-DetailScreen. 	 * Therefore to evaluate the RepeatState of the parent 	 * repeat we need to evaluate the parent screenLocation: 	 * screenLocation[screenLocation.length - 2] 	 */ 	const repeatInstanceState = screenLocation[screenLocation.length - 2].repeatInstanceState;  	/** 	 * For a DetachedRepeat the location path to the DetailScreen is always the 	 * path to the parent repeat (parentRepeatPath) plus the name of the 	 * DetailScreen: parentRepeatPath/DetailScreenName 	 * 	 * This means to get the Form Model path of the parent repeat we need to 	 * slice the last segment from the current location path. 	 */ 	const repeatModelPath = currentLocationPath.slice(0, currentLocationPath.length - 1);  	const repeatStateEntry = repeatInstanceState 		? repeatInstanceState[ModelPath.toString(repeatModelPath)] 		: undefined;  	return repeatStateEntry?.newRow?.rowState === "workingOn"; } ``` |
```

The default location is the first top level Screen of the form.

When changing the underlying data externally and the current location is inside a Detached Repeat, you must ensure that the location is still valid. The location will not be reset.

|  |  |
| --- | --- |
|  | In correction mode the form location is empty. |

###### UI

When navigating between top level Screens using navigation buttons, a respective event-action is dispatched.

When entering a Detached Repeat Detail Screen, a new path element is added to the form location, consisting of the path to the Detached Repeat’s Detail Screen and the row index.

When leaving a Detached Repeat by applying or canceling the change, the last path element is removed from the form location.

###### API

The current Screen location can be set by command-actions. This allows to change to a top level Screen by name as well as Detached Repeat Detail Screens. Note: In case of manual Screen changes you have to take care of the UI state yourself. This may include e.g. backups and validation state.

Screen change intents from the UI are signaled to the store by event-actions. You can also emit the same events to "remote control" the engine.

###### Dirty State

The dirty state of the current form location indicates that some data in the current Screen changed. It will only be set for Detached Repeat Detail Screens and will turn true, when a value changes on the Screen itself or when changes on a nested Detail Screen are committed. The default behavior never sets the value to false even when the changes are reverted. However, it is possible to set the value with the command `changeScreenState`.

This information is used in Detached Repeat Detail Screens to evaluate the enablement of the commit button and whether dirty handling is necessary when clicking the cancel button:

* ***Commit button*:** If the Screen is not dirty and `detachedRepeatCommitButtonEnablement` is set to "HIDDEN" or "DISABLED" in the Form Model, the commit button will be rendered as hidden or disabled. If the Screen is dirty, the commit button will be shown and enabled.
* ***Cancel button*:** If the Screen is dirty, there will be a confirmation dialog when leaving the Detail Screen via the cancel button. This behavior can be disabled in the engine configuration by setting `disableDirtyHandlingForDetachedRepeat` to true.

|  |  |
| --- | --- |
|  | The dirty state of the current form location is only set for Detached Repeat Detail Screens. |

##### Repeat State

The repeat state stores the data-independent ui state of all repeats of the form.

###### UI

In the ui this ui state can be changed via various ui elements:

* The sorting state can be changed by clicking on the header of a sortable repeat column.
* The filter row can be opened via a filter button in the header.
* The filters itself can be edited via the inputs of the filter row.

###### API

The data-independent repeat state of a single repeat or for all repeats can be set by command-actions.

##### Enablement State

|  |  |
| --- | --- |
|  | These settings must not be used to enforce authorization or any kind of system security. |

The Form Engine UI as a whole can be set

* `editable` or `readonly`: In readonly mode, the data document can be browsed but not changed
* `enabled` or `disabled`: In disabled mode, all interaction (even browsing) is suppressed

The combination of these states form the global enablement state.

###### Models

* Model elements that support the readonly flag can be (statically) set readonly.
* Readonly and hidden (due to not being relevant) can be set dynamically depending on a field’s value using dependent element. See section [Rendering](#form-engine_rendering) for the behavior of container components and Repeats.

###### UI

There is some special UI behavior regarding the readonly state:

* ***Repeats*:** No rows can be added, removed, moved, or cloned. Repeat rows can be opened but not altered in any way.
* ***Buttons*:** Buttons are hidden, except they are configured with "show readonly" in the model.

###### API

The global state can be set by command-actions.

##### Section State

The rendered form can contain collapsible sections in its various Screens and its nested Repeat structures. The initial collapsed state of such a section is defined in the Form Model, but the user can toggle the collapsed state.

The EngineState contains a map to keep track of the current collapsed state of all collapsible sections.

Performing a full validation on the form might reveal to the user that the form contains an invalid field. In the validation bar above the form, links are provided to jump to the different instances of this invalid field.
Such a field instance could be hidden inside a currently collapsed section. When the user clicks on the link, the "correction mode" is entered and the form location is changed to the position of the value. Therefore, the section map is backed up and a special section map is used in order to ensure that the input of the field instance is shown by expanding all relevant collapsible sections.
When leaving the correction mode, the original section state is restored from the backup.

##### Correction Mode and Validation Bar State

These states are not directly related to the validation state. They represent rather the UI state of the components that treat the validation state.

The correction mode state is only given in correction mode. It contains a backup of the last form location state before entering the correction mode as well as the information whether the correction mode screen has to be displayed.

The validation bar state contains information related to the validation bar expansion and last shown issue.

|  |  |
| --- | --- |
|  | In mobile mode (phone) the correction mode state will never show the correction mode screen. Therefore, the value will always be false. For further information please refer to the [Validation](#form-engine_validation-computation_validation) section. |

|  |  |
| --- | --- |
|  | For more information on how to set initial values for the ui state please refer to [Initial UI Slice](#form-engine_integration_client_customization_initial-ui-slice). |

#### Locale State

The locale is used to translate texts for labels, hints and validation messages.

##### API

The locale can be changed with the Command `setLocale(locale: Locale)`.

#### Attachments

To be able to work with Attachments, the Form Engine provides the AttachmentLoader API for up- and downloading files.
When utilizing attachments in your form models, an implementation of this interface must be provided to the Form Engine sagas within your application setup.

|  |  |
| --- | --- |
|  | Without passing a loader, trying to work with attachments in your form models will log an error message and ignore any actions. |

##### Setup

To configure working with attachments, simply pass a loader implementation in the `FormEngineSagaOptions` when setting up the Form Engine Sagas like so:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 ``` | ``` // or use the default implementation 'platformAttachmentLoader' const yourAttachmentLoaderImplementation: AttachmentLoader = /* your impl here */  ApplicationFactories.createApplicationSetup({     // ...other props     customSagas: [         // ...other sagas         ...formEngineSagas({ attachmentLoader: yourAttachmentLoaderImplementation }),     ] }); ``` |
```

##### AttachmentLoader

The `AttachmentLoader` interface provides a way to define how files are turned into `Attachment` objects during upload and how download links are created from `Attachment` objects during download.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` export interface AttachmentLoader { 	uploadFiles( 		files: AttachmentFile[], 		documentDescriptor: DocumentDescriptor, 		abortSignal: AbortSignal 	): Promise<(Attachment | Localizable)[]>;  	retrieveDownloadLink(attachment: Attachment, documentDescriptor: DocumentDescriptor): Promise<string>; } ``` |
```

###### Uploading Files

Apart from the JS file objects that should be uploaded and their corresponding document path, the loader has also access to the id of the current document of the Form Engine and the corresponding model name.
It also receives an `AbortSignal`, which can be passed to any fetch call, allowing an upload request to be cancelable. However, you could also choose to omit this signal on purpose, effectively disabling the ability to cancel a request at all.

This method should always resolve to a list of either:

* an `Attachment` object OR
* a `Localizable` object describing why the upload failed

###### Retrieving the Download Link

Note that the loader is responsible for *retrieving* the download link for a given attachment. The internal Form Engine saga will then trigger the actual download from it.
In the same way as for uploading, this method also gets access to the document id and model name, in case your retrieval logic depends on them.

This method should resolve to a string which points to a downloadable resource.

|  |  |
| --- | --- |
|  | It is important that your loader always resolves to a list with the same length as the given input list. For example, if your own upload logic fails to upload a specific file, in the list, it must not be omitted in the result list. Instead, an error Localizable should be created for it. |

Please note that the Form Engine provides some default error keys for attachments already, which can be found in the [RESOURCE\_KEYS](#form-engine_resourceKeys). When using the platform loader, the Form Engine will use the error information returned by the server to create the Localizable, if it exists. For unknown errors, a fallback Localizable will be used.

##### Default AttachmentLoader Implementations

By default, the Form Engine offers an implementations of an `AttachmentLoader` that uploads files to an A12 Services backend.

This loader will perform JSON RPC requests when uploading files and returns `Attachment` objects containing ids which reference the uploaded files. Because of this behavior, this mode of attachment handling is also called "reference mode".
For downloading attachments, this implies that the loader must initiate another request to the backend to fetch the download link.

##### Functionality

When interacting with the attachments UI in the form, the Form Engine will dispatch actions, which are then handled by an internal saga registered as part of the Form Engine Sagas.
This saga will then call the `AttachmentLoader` implementation and afterwards dispatch the correct value change (based on whether single or multiple files were uploaded, or if there were any errors returned by the loader).

##### Selecting the DocumentDescriptor

By default, the Form Engine saga tries to extract the id and the model name from the document inside the default DataHolder of the form activity directly. To customize this, this selector can be overwritten like this:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 ``` | ``` ApplicationFactories.createApplicationSetup({     customSagas: [ 		// other sagas...         ...formEngineSagas({ 			documentDescriptorSelector( 				state: object, 				activityId: string, 				documentPath: EntityInstancePath 			) { 				// your custom logic  				return { 					documentModelName: "", 					documentId: "" 				} 			} 		})     ] }); ``` |
```

The selector gets the id of the activity and the path to the attachment and should return the correct metadata for the document that contains it.

### Validation and Computation

The Form Engine ensures the correctness of entered data in two steps:

* *Conversion:* Translation between string (UI) and typed (document)
* *Validation:* Check of higher-level and business rules

|  |  |
| --- | --- |
|  | When using validation, the versions of the generated validation code and the validation runtime must match, see [Getting Started Using Code Generated By Kernel At Runtime](https://geta12.com/docs/kernel/kernel-documentation-dev/index.html#_getting_started_using_code_generated_by_kernel_at_runtime). |

#### Converter

The document stores all values as JavaScript data types. The UI only handles strings, therefore, all values need to be parsed before they can be written to the document. They need to be formatted as strings before they can be displayed in the UI. The default behavior of the Form Engine is to use the Kernel’s validation module, which provides APIs for this purpose.

|  |  |
| --- | --- |
|  | The values for Document Model fields of type 'enumeration' cannot be converted with the Kernel validation module. For formatting, they must be passed to the `Localizer` instead. That is why the defaultConverter factory function requires a localizer (provider) as a parameter. |

##### API

Applications can configure the built-in converter, e.g. by changing the date format or by providing date formats for additional locales.

Applications can also provide their own converter. The custom converter can

* parse and format depending on the field, the value and the whole Form Engine state
* adapt the behavior of the default converter

#### Validation

By default the Form Engine validates data from the document in the following scenarios:

| Validation Type | Trigger | Description |
| --- | --- | --- |
| Field Validation | Changing a field value | Validates the changed field + all fields changed via computations and/or dependencies |
| Partial Validation (of a Screen) | * Leaving a Detached Repeat Detail Screen * Clicking a button, that triggers a partial validation | Validates the current Screen |
| Partial Validation (of a Repeat) | Leaving an Inline/Embedded Repeat | Validates all rows of the Repeat |
| Partial Validation (of a Repeat row) | * Leaving a row of an Inline/Embedded Repeat * Closing an Embedded Repeat row | Validates the current Repeat row |
| Full Validation | Clicking a button, that triggers a full validation | Validates the whole document |

The partial validation of Repeat tables and Repeat rows can be disabled by setting the option `disableRepeatValidationOnLeaving` to true in the `MiddlewareOptions`.

The field validation occurs after writing the values, i.e. the document can contain invalid data.

##### Implementation

The Form Engine uses the Kernel’s validation as defined in the fields and rules inside the Document Model. Depending on the validation type, the Form Engine provides a document and a list of relevant field/group instances to the Kernel to express which data should be considered during the validation.

###### Relevant Data for Validation

The list of relevant instances is created based on the current document. This process considers field/group instances from within already existing data contexts of the document. That means:

* Elements, that are not nested in any repeatable group, will always be considered, because non-repeatable contexts do not need to be explicitly initialized.
* Elements, that are nested in a repeatable group, will only be considered if the instance of the repeatable group itself has already been initialized. I.e. elements from non-existing Repeat rows will not be considered.

This data is further categorized by two different notions of relevancy to determine whether it is relevant for the current validation.

###### Data-Relevance

The data-relevance of a field/group instance is defined by the modeled dependencies and describes whether this data is relevant at all. Whenever an instance is marked as non-relevant via dependencies it is not supposed to be validated in any situation.

|  |  |
| --- | --- |
|  | A field validation may consider data, that is marked as non-relevant by a dependency if it is changed via a computation. This is considered a modeling error. Neither computations nor dependencies are supposed to change values of non-relevant fields or groups. |

###### UI-Relevance

The UI-relevance of a field/group instance describes whether this data is relevant for a specific part of the UI, i.e. for the current Screen, Repeat table or Repeat row.

A field/group instance is usually considered as UI-relevant for current UI element if

* it is data-relevant and
* the UI element contains either a Control or Inline Repeat column referencing this instance.

|  |  |
| --- | --- |
|  | Indexed Controls with a semantic index also implicitly reference the index field of the underlying group. Therefore, this instance of the index field is considered as UI-relevant as well. |

###### Special Behavior for Collapsed Sections

Controls and Inline Repeat columns from collapsed Sections are ignored for the determination of the set of UI-relevant data.

###### Special Behavior for Repeats

If an element is considered as UI-relevant in all existing rows of an Inline/Embedded Repeat, the Form Engine replaces the individual document paths to these instances by a wildcard path to this element, i.e. a path with index 0 for the repeatable group. Such a wildcard path indicates that all repeatable instances of an element should be considered during the validation. This enables the execution of validation rules that require all possible instances.

Example: Given an Inline Repeat referencing the group `/root/G1/G2` and a column referencing the field `/root/G1/G2/F` on a Screen with the data context `/root[1]/G1[5]`.

* If `F` is UI-relevant in every row of this Inline Repeat, the Form Engine will consider the wildcard path `/root[1]/G1[5]/G2[0]/F[1]` as UI-relevant.
* If `F` is not UI-relevant in the second row, the Form Engine will only consider individual paths as UI-relevant: `/root[1]/G1[5]/G2[1]/F[1]`, `/root[1]/G1[5]/G2[3]/F[1]`, …​

###### Usage of the Kernel API

The following table describes how the Kernel API is used and which parameters are provided by the Form Engine.

| Validation Type | Used Kernel function | Input Document | Input Field List |
| --- | --- | --- | --- |
| Field Validation | [`validatePart`](https://geta12.com/docs/kernel/kernel-documentation-dev/assets/doc/typescript/interfaces/Document_model_and_document_facade.DocumentRtService.html#validatepart) | The whole document | all changed field/group instances |
| Partial Validation (of a Screen) | [`validatePart`](https://geta12.com/docs/kernel/kernel-documentation-dev/assets/doc/typescript/interfaces/Document_model_and_document_facade.DocumentRtService.html#validatepart) | The whole document | all UI-relevant field/group instances of the Screen |
| Partial Validation (of a Repeat) | [`validatePart`](https://geta12.com/docs/kernel/kernel-documentation-dev/assets/doc/typescript/interfaces/Document_model_and_document_facade.DocumentRtService.html#validatepart) | The whole document | all UI-relevant field/group instances of the Repeat |
| Partial Validation (of a Repeat Row) | [`validatePart`](https://geta12.com/docs/kernel/kernel-documentation-dev/assets/doc/typescript/interfaces/Document_model_and_document_facade.DocumentRtService.html#validatepart) | The whole document | all UI-relevant field/group instances of the Repeat row |
| Full Validation | [`validateFull`](https://geta12.com/docs/kernel/kernel-documentation-dev/assets/doc/typescript/interfaces/Document_model_and_document_facade.DocumentRtService.html#validatefull) | The document filtered by data-relevance | (not applicable) |

|  |  |
| --- | --- |
|  | It is essential that applications perform a full validation of the data (preferably on the server) at some point in the application process, because the Form Engine does not enforce it. |

##### API

A full validation of all data can be triggered by emitting a command-action. If the validation result contains issues (either warnings or errors), the engine will show a validation bar at the top of the content box. This bar enables the user to navigate directly to inputs that are associated with issues. Using this kind of navigation disables the normal navigation concept (entering and leaving of Screens) and forces the engine into correction mode. In correction mode navigating is only possible by the validation bar. After leaving the correction mode the normal navigation concept is enabled again.

|  |  |
| --- | --- |
|  | The validation bar is optimized for mobile usage. Therefore, the user has a different experience on mobile devices (phones) and other devices. For mobile devices a modal overlay is used to enable the user to navigate to different issues and the amount of information given at a time is reduced. For other devices a dedicated Screen is used for all information about issues. |

##### UI

From within the UI, the validation is triggered by the following events:

* *Field value changes:* The field is validated. Additionally, all fields that were changed via computations and/or dependencies and are visible on the current Screen are also validated. Note that while changes on non-visible fields will never create validation messages for them, existing validation messages will be removed.
* *Trying to leave a Screen:* Validate editable fields. The result replaces the previous validation state. Fields in repeatable sub-groups are not validated!
* *Leaving a row in an Inline Repeat or Embedded Repeat:* The visible fields inside this row are validated
* *Leaving an Inline Repeat or Embedded Repeat table:* The visible fields inside the table are validated
* *Full validation:* Validate the whole document and offer to enter correction mode.

When the set of editable fields is computed, invisibility due to the *not relevant* setting in dependent field/group, dependent control definitions and the collapsed state of sections are taken into account.

Changes in Detached Repeat Detail Screens can only be kept if the validation state is empty, i.e. there are no validation errors on the current Screen.

Nested Detached Repeat Screens can be opened even if there are errors on the current Screen.

Navigation between top level Screens using navigation buttons and event buttons also supports full validation and partial validation. In this case, it has to be enabled in the Form Model.

#### Computation

Kernel computations defined in the Document Model are evaluated on every value change event in the UI along with validation.

Note that only Kernel computations are supported, i.e. you cannot replace or customize computations. Furthermore, for the validation triggered by computations, the default implementation is used. If you want to have custom computations, you have to implement them outside of the Form Engine by tracking document changes.

The computation is conducted as follows:

* the changed value is written to the document and validated (see above, validation)
* a computation is conducted
* each computed value is written to the document and validated (see above, validation)
* values that could not be computed, are reset and validated (see above, validation)
* if no value could be computed, the document stays unchanged

### Form Engine Actions

UI Events, triggered by an interaction of the user with the UI, are processed in the `DispatchConfiguration`, which dispatches an Event Action for each UI Event.
The `DispatchConfiguration` can be customized by connecting the view in the `mapDispatchToProps` method. In this way it is possible to overwrite the default behavior by dispatching custom actions or adapting the payload of an existing Event Action.

#### Commands and Events

##### Events

All UI Events trigger the dispatching of a Redux action. The behavior, which gets triggered by these events, can be changed by registering custom middlewares, when the store is created.

The following table describes what each actions does in the Form-Engine and what user interaction leads to the action. For a detailed description, including the specific payloads, please refer to the
[API documentation](https://geta12.com/docs/2025.06/ext5/form_engine/formengine-documentation-bundle/assets/typedoc/modules/back-end_store.Events.html).

| Action | Description | Dispatched by |
| --- | --- | --- |
| **Events** | | |
| valueChange | triggers validations, dependencies/computations and updates the document | submitting of most inputs, except for attachments, multi-selects and multi file uploads |
| parseError | updates the validation messages | all inputs after the Conversion-API reports a parse error |
| attachmentValueChange | same as "Events.valueChange", but for attachments | Events.Attachments.uploadAttachments |
| multiSelectValueChange | same as "Events.valueChange", but for multi-selects | submitting of multi-select inputs |
| navigationButton | changes screens after a successful validation | a navigation button click |
| eventButton | no usage, lets users react to button clicks | Events.eventButtonTriggered |
| eventButtonTriggered | dispatches "Events.eventButton" after a successful validation | an event button click |
| inputTouched | updates the dirty state | most inputs after a input was modified, but not submitted |
| collapseSection | expand/collapse a section | a collapsible section click |
| **Events.Attachments** | | |
| downloadAttachment | triggers the download of an attachment | the attachment input, the "download" repeat row event, inline or embedded repeat with the "multiFileUpload" property |
| cancelUploadAttachments | cancels an ongoing attachment upload | the attachment input, inline or embedded repeat with the "multiFileUpload" property |
| uploadAttachments | upload an attachment | the attachment input, inline or embedded repeat with the "multiFileUpload" property |
| **Events.Repeat** | | |
| leaveDetachedRepeatRow | restores the previous screen when leaving a detached repeat | the cancel or commit button in a detached repeat detail screen |
| closeEmbeddedRepeatRow | closes the expanded row, adds it to the repeat and potentially validates, based on MiddlewareOption.disableRepeatValidationOnLeaving | the close button in an expanded row in an embedded repeat |
| leaveRepeatRow | restores the repeat state and potentially validates, based on MiddlewareOption.disableRepeatValidationOnLeaving | an inline or embedded repeat row losing focus and the focus remaining inside the repeat |
| leaveRepeatTable | restores the repeat state and potentially validates, based on MiddlewareOption.disableRepeatValidationOnLeaving | an inline or embedded repeat losing focus |
| addRow | adds a row, sets initial values, triggers computation and validation | the repeat add button |
| enterRow | opens the detached repeat screen or expands the row after creating a backup | the edit button on a row in a detached or embedded repeat |
| changeColumnWidth | updates the column width state | a change in the width of a resizable column |
| removeRow | removes a row, triggers computation and validation | the remove button on a row |
| moveRowTriggered | moves a row by a fixed delta in a repeat | the move-up or move-down button on a row |
| cloneRowTriggered | copies a row, triggers computation and validation | the copy button on a row |
| changePage | switches to a new page in the repeat | a new page being selected |
| sortingChange | sets the sorting state of a repeat | a click on the column header |
| showFilter | opens the filter menu of a repeat | the filter button |
| filterValueChange | updates the filter value for a specific column | a submit of the filter inputs |
| filterParseError | marks the filter inputs with an error | filters after the Conversion-API reports a parse error |
| clearFilters | clears all filter inputs | the clear filter button |
| customRowAction | no usage, lets users react to button clicks | a custom row action button |
| multiFileUpload | same as "Events.valueChange", but for multi file upload repeat | inline or embedded repeat with the "multiFileUpload" property |
| **Events.CorrectionMode** | | |
| revalidate | triggers a full validation | the validate button |
| exitCorrectionMode | restores the old screen from the backup | the exit button |
| goToElement | shows the relevant screen and focuses the element | a link to an issue, the goToIssue button in the quick-access-menu |
| **Events.CorrectionMode.CorrectionView** | | |
| show | shows a detailed overview over all issues | the expand/collapse button in the quick-access-menu |
| showDetails | expand/collapse the details view for an issue | the show/hide details button |
| **Events.CorrectionMode.ValidationBar** | | |
| expand | expand/collapse the issue in the validation bar | the expand/collapse message |
| showMessage | sets the message to be shown in the validation bar | the message pagination button |

##### Commands

All changes to the state are also triggered by Redux actions. However, it is not recommended to listen to these actions directly. What Commands are dispatched at what time and in what order is considered
an implementation detail and may change any time in a non-breaking way. The more robust way to react to state changes - especially data (document) changes - is to directly compare states.

It is possible to register custom reducers to take care about how information is stored. But be aware that the Form Engine components always need the store in a special structure to be able to render!

The following table shows an overview of all Commands. For a detailed description, including the specific payloads, please refer to the
[API documentation](https://geta12.com/docs/2025.06/ext5/form_engine/formengine-documentation-bundle/assets/typedoc/modules/back-end_store.Commands.html).

| Action | Description | State Change |
| --- | --- | --- |
| **Commands** | | |
| setDocument | sets the current document | "document" in the "data" slice |
| setMessageState | localizes and sets all validation messages | "messages" in the "ui" slice |
| setMessageStateEntry | sets a validation message for a specific element identified by a document path | "messages" at "path" in the "ui" slice |
| setSectionsCollapsed | sets collapsed state of all sections | "sectionState" in the "ui" slice |
| setLocationStack | sets all screen locations at once | "screenLocation" in the "ui" slice |
| changeScreen | change to a screen by name | "screenLocation" and "repeatStaticState" in the "ui" slice |
| changeScreenState | change any UI state of a specific screen identified by an index | "screenLocation" at "index" in the "ui" slice |
| setDisabled | disable the UI | "disabled" in the "ui" slice |
| setReadonly | set the UI to readonly | "readonly" in the "ui" slice |
| setDataDirty | set the data dirty | "dirty" in the "ui" slice |
| setUIDirty | set the UI dirty | "dirty" in the "ui" slice |
| setColumnWidth | sets the width of a specific column identified by a model path | "columnWidths" at "path" in the "ui" slice |
| setLocale | sets the locale | "locale" in the root state |
| setModels | sets all models | "models" in the root state |
| pushBackup | fills the backup with a document/validation messages | "backup" in the "ui" slice |
| dropBackup | drops the backup | "backup" in the "ui" slice |
| validateFull | performs a full validation | [[1]](#whyNotEvent) |
| validatePart | performs a partial validation | [[1]](#whyNotEvent) |
| pushScreen | pushes a screen and its repeat state onto a stack | "screenLocation" and "repeatStaticState" in the "ui" slice |
| dropScreen | drops the current screen from the stack | "screenLocation" in the "ui" slice |
| changeRepeatStaticStateEntry | sets the data-independent state of a specific repeat identified by a model path | "repeatStaticState" at "path" in the "ui" slice |
| changeRepeatInstanceStateEntry | sets the data-related state of a specific repeat identified by a model path | "repeatInstanceState" at "path" in the "ui" slice |
| setRepeatStaticState | sets the whole data-independent state of all repeats | "repeatStaticState" in the "ui" slice |
| **Commands.CorrectionMode** | | |
| setValidationBarState | sets the messages and UI state of the validation bar | "validationBar" in the "ui" slice |
| setCorrectionScreenState | sets the UI state of the correction screen | "correctionScreen" in the "ui" slice |
| setCorrectionModeBackup | backup the screen state before entering the correction mode | "correctionModeBackup" in the "ui" slice |
| restoreCorrectionModeBackup | restore the correction mode backup | almost all properties in the "ui" slice |

|  |  |
| --- | --- |
| 1 | The line between Commands/Events is blurred here. They are implemented in middlewares, have side effects and do not modify state directly. But they are also not linked to specific UI events. |

#### Client Actions

The commands and events are specific to the engine and aren’t aware of the context it belongs to.
This can be a problem when multiple instances of an engine are required, resulting in conflict between instances.
Therefore, the `FormEngineActions` namespace exists to allow adding context to the core’s events and commands, e.g. `activityId` and other Client’s related information.

The action FormEngineActions.event is used to wrap events while the action FormEngineActions.command is used to wrap commands.

#### Dispatch an Engine Action

In a usual A12 application, the engine runtime will not be able to react if only a bare event or command action is dispatched.
Those events or commands, which can be seen on Redux Devtool, are usually nested in a Client action. To add these wrapper actions,
you can also adapt the default dispatch with the adapter functions `FormEngineActions.dispatchAdapterFactory` (events) and `FormEngineActions.commandDispatch` (commands).

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 ``` | ``` // Middleware export const customMiddleware: Middleware = api => () => () => { 	const formEngineEvent = FormEngineActions.dispatchAdapterFactory(api.dispatch, "MY_ACTIVITY_ID"); 	// ...other logic 	formEngineEvent( 		Events.collapseSection({ 			path: ModelPath.fromString("/Group/Field1"), 			collapse: true 		}) 	); };  // Saga export function* customSagaHandler(): SagaGenerator<void> { 	// ...other logic 	yield* put( 		FormEngineActions.command({ 			activityId: "MY_ACTIVITY_ID", 			engineEvent: Commands.changeScreen({ screenName: "MyScreen" }) 		}) 	); }  // View export function CustomView(props: View): React.JSX.Element { 	const dispatch = useDispatch(); 	const formEngineCommand = FormEngineActions.commandDispatch(dispatch, props.activityId); 	formEngineCommand(Commands.setReadonly(true)); 	// ...other logic 	return <></>; } ``` |
```

#### Listen to an Engine Action

Similarly, to handle an event dispatched by the engine, it is necessary to assert the Client action before checking the event, as follows:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 ``` | ``` import type { AnyAction, Middleware } from "redux"; import { takeLatest, type SagaGenerator } from "typed-redux-saga"; import type { Action } from "typescript-fsa";  import { 	Events, 	FormEngineActions, 	type EngineState } from "@com.mgmtp.a12.formengine/formengine-core"; // convenience type helper type EventButtonAction = Action<Events.EventButtonPayload>;  // your implementation declare function handleOnEvent(name: string): void; declare function handleAction(action: EventButtonAction): void;  // Middleware export const onEventButtonClickedMiddleware: Middleware<{}, EngineState> = () => next => action => { 	if ( 		FormEngineActions.event.match(action) && 		Events.eventButton.match(action.payload.engineEvent) 	) { 		const event = action.payload.engineEvent; 		handleOnEvent(event.payload.name); 	} 	return next(action); };  // Saga export function* onEventButtonClickedSaga(): SagaGenerator<void> { 	yield* takeLatest<Action<FormEngineActions.FormEngineEventActions<EventButtonAction>>>( 		(action: AnyAction) => { 			return ( 				FormEngineActions.event.match(action) && 				Events.eventButton.match(action.payload.engineEvent) 			); 		}, 		action => handleAction(action.payload.engineEvent) 	); } ``` |
```

### Rendering

A12 uses React for rendering. This has some noticeable side effects for application.
The browser DOM is controlled by React. Therefore, applications may not directly alter the DOM, e.g. by setting attributes or adding elements.

The package contains three React view components, a [FormEngine](#form-engine_rendering_formengine), a [ContentBox](#form-engine_rendering_contentbox), and a [ScrollHandler](#form-engine_rendering_scrollhandler) which have to be connected to the store in order to archive the full behavior. In the example in chapter [Integration](#form-engine_integration) it is shown how they all can be connected and put together.

#### HTML ID Generation

For the purpose of browser-based automated testing, every form element’s HTML element has the HTML ID attribute set. The HTML ID is derived from the Form and Document Model element’s IDs. The default behavior for all elements that are directly representing a model element is:

`` optional-prefix`"-a12-"`ID-of-form-model-element ``

However, some types deviate from this behavior. See [HTML ID Schema](#form-engine_rendering_html_id_schema) for details.

##### Data Attributes

In addition to the HTML ID, some elements have the attribute `data-role` set by the Form Engine for better testing support. See [Data Roles](#form-engine_rendering_data_roles) for details.

Most Form Model elements are rendered using A12 Widgets which have data-role attributes on their own.

#### Form Engine

The inner most component is the `FormEngine` which takes care of rendering the actual form, without header and footer. This section is about how the different Form Model elements are rendered.

##### Hiding Behavior of Container Model Elements

If all children model elements of the container model element (i.e. `Section`, `ControlGrid`, or `ButtonPanel`) are hidden, then the container model element is also considered hidden.

###### Rendering of Hidden Model Elements

React components of model elements that are hidden are not rendered (removed from the DOM). They are **not** hidden using CSS.

##### Containers

###### Section

Sections and collapsible sections are rendered as an `HTML DIV` element.

The section title is rendered using the `Typography` widget, while the size depends on the current Aria Level of the component.

A section with multiple columns is rendered using the `SizeContainer` widget.

###### Screen

Screens are basically generic containers like Sections, but the Form Engine only renders the current Screen, i.e. the Screen that is on top of the location stack.

###### Control Grid

The content of a `ControlGrid` is rendered using the `SizeContainer` widget. The layout is applied using a lookup table. Note that the mapping can result in invalid `SizeContainer` configurations.

##### Controls

Each `Control` is rendered using Widgets, depending on the field data type and control configuration:

| A12 Data Type / Field Setting | Control Setting | Widget |
| --- | --- | --- |
| String | secret | TextLine (password) |
| String | linebreaksPermitted | TextArea |
| String | suggestions | Autocomplete |
| Number |  | TextLine |
| Date |  | TextLine + DatePicker |
| DateTime |  | TextLine + DateTimePicker |
| Time |  | TextLine + TimePicker |
| DateFragment |  | TextLine |
| DateRange |  | TextLine + DateRangePicker |
| Boolean | boolean\_select | Select |
| Boolean | checkbox | Checkbox |
| Boolean | switch | Switch |
| Boolean | switch with values | Switch |
| Boolean | full | RadioGroup + Radio |
| Boolean | inline | RadioGroup + Radio |
| Confirm | checkbox | Checkbox |
| Conform | switch | Switch |
| Confirm | switch with values | Switch |
| Enumeration | full | RadioGroup + Radio |
| Enumeration | inline | inline RadioGroup + Radio |
| Enumeration | compact | Select |
| Enumeration | autocomplete | Autocomplete |
| Multi-Select | autocomplete | Autocomplete |
| Multi-Select | full | CheckboxGroup |
| Multi-Select | inline | CheckboxGroup |
| Attachment Custom Type |  | FileUpload |

For Boolean, the checked state of the `Checkbox`, `Switch` and `Radio` widgets is bound to the values `true` and `false`. This means, that the value can not be reset to `null` in the ui. This is only possible with the exposition `boolean_select`, which best represents the three-value-logic that comes with the boolean field data type.

All Controls are always rendered inside of a control grid.

Controls that are bound to hidden model elements (fields) are not rendered.

|  |  |
| --- | --- |
|  | Limitation: A control based on a required enumeration field having the exposition 'compact' and an initial value does not show the empty option. Therefore, if the field behind the control contains `null` (e.g. set by the action `Commands.setDocument`), the control will show the first enumeration option as selected. |

###### External Enumeration

An external enumeration can be rendered as an autocomplete control or as a select control.

The `ExternalEnumerationProvider`, which delivers the enumeration values, needs to be provided via the `Config` prop when setting up the Form Engine React component and when creating the engines middlewares using `createEngineMiddlewares`.

Example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 ``` | ``` /**  * Registration in the Config object which is handed  * to thew view as props  */ export const config: Partial<Config> = { 	externalEnumerationProvider: emptyExternalEnumerationProvider };  /**  * Registration in the engine middlewares by calling  * 'createEngineMiddlewares' with the provider.  */ export const formEngineMiddlewares = createEngineMiddlewares({ 	externalEnumerationProvider: emptyExternalEnumerationProvider }); ``` |
```

An external enumeration can be configured in the Form Model, so that adding new custom values, in addition to the values offered by the provider is possible.
An additional value is written to the document without conversion. It is your responsibility to handle the added custom value, e.g. adding the value to the provided values by the `ExternalEnumerationProvider`.

To determine, if the entered value is a custom value or one of the provided values, the values are compared, ignoring the case by default. There is a second configuration option available in the Form Model to make this comparison case-sensitive.

##### Repeats

Overview tables of `Detached Repeats`, `Inline Repeats` and `Embedded Repeats` are rendered using the `Table` widget.

Inputs of fields in `Inline Repeats` are rendered using the same widgets as for Controls, but labels are omitted.

Detail Screens of `Detached Repeats` are rendered as Screens. In addition the Repeat buttons are rendered into the `ActionContentBox` footer.

The inputs for `Embedded Repeats` are rendered using the `ExpandableRow` widget.

Repeats inherit the enablement state of the associated repeatable group.

##### API

The component `FormEngineRenderer` receives the state, the event handlers, and the config as props. By modifying these props, you can modify the appearance and behavior of the `FormEngine` component.
The `Config` object has the two properties `formModelMap` and `widgetMap` which can be used to customize the appearance. In the `FormModelMap` each element from the Form Model is mapped to one React component. In the `WidgetMap` each UI widget type (Select, ActionContentbox, Button etc.) is mapped to a React component. You can overwrite parts of the map to integrate your custom widgets.

#### ContentBox

The `ContentBox` is wrapped around the `FormEngine` and contains the header and footer with the modelled buttons.

##### API

The `ContentBox` rendering can be customized via the `WidgetMap` API in the Form Engine `Config` by providing, for instance, a custom `ActionContentbox` implementation.

#### ScrollHandler

The most outer part is the `ScrollHandler`, which takes care of focusing elements and scrolling the page so that focused elements are visible on the Screen, whenever the Screen is entered or left.
To be more precise:

* Top-Level-Screen → Detail-Screen
* Top-Level-Screen → Correction-Screen
* Detail-Screen → Top-Level-Screen
* Detail-Screen → Detail-Screen (Entering)
* Detail-Screen → Detail-Screen (Leaving)
* Detail-Screen → Correction-Screen
* Correction-Screen → Top-Level-Screen
* Correction-Screen → Detail-Screen
* Correction-Screen → Field

The `ScrollHandler` uses the HTML-Ids to focus elements. If you use a prefix, you need to pass it to the `ScrollHandler` as well as to the `FormEngine`.

|  |  |
| --- | --- |
|  | Controls and columns will only be focussed if their underlying HTML element (that contains the `uiId` property in its `id` attribute) is either:  * an `input`, `select` and `textarea` element or * a `div` element with the `data-role` attribute set to `"text-output"`  When customizing inputs, make sure to pass the `uiID` property to an element that fulfills these constraints. Otherwise, the focus behavior will not work correctly for these elements (for example when trying to "jump" to an error field from the validation bar). |

#### Buttons

##### Kinds of Buttons

* **EventButton:** Triggers a generic event identified by a name (string). The event has to be handled by the application.
* **NavigationButton:** Navigates to the given Screen (also supports previous and next). If the validate options is set, the button will trigger a partial validation and only proceed when the validation yields a valid result.

##### Button Panels

Button Panels are screen elements, which can be placed next to ControlGrids, Sections or Repeats.

They can contain any number of buttons.

##### Sub-Header and Footer Buttons

Each form has a sub-header and footer box, where you can place buttons, which are shown on every Screen.

Each Screen has a sub-header and footer box, where you can place buttons, which will be shown in addition to the form buttons if you are on that Screen.

|  |  |
| --- | --- |
|  | Detached Repeat Screens are also Screens, but here two additional rules apply:  * the footer is reserved for the Detached Repeat buttons * navigation buttons do not work |

Each button can either be in a major or minor area of the sub-header or footer, which affects the position and order of the buttons.
In general, major and minor buttons are rendered according to the [Plasma guidelines](https://geta12.com/docs/PLASMA/plasma-concept-documentation/index.html#_major_and_minor_area).
Inside one of these areas, buttons defined for the form are rendered before the buttons defined for the screen.

The exception are **NavigationButtons** in the sub-header, where all buttons are rendered next to each
other in the navigation menu. Here, all form and screen buttons are grouped together, with form buttons in front. In one group,
major buttons are rendered before minor buttons. See the following image for an example:

![Sub-Header Navigation Buttons](https://geta12.com/docs/2025.06/ext5/form_engine/formengine-documentation-bundle/assets/images/form-engine/Subheader_Navigation_Buttons.png)

#### HTML ID Schema

This is a comprehensive collection of the different HTML IDs generated by the Form Engine.

| Model Element | React Element | DOM Element | Generated ID |
| --- | --- | --- | --- |
| Control | Control | container DIV | a12-{field-name}-{field-ID}(-{occurrence})?(-input{index})?-group |
|  |  | error DIV | a12-{field-name}-{field-ID}(-{occurrence})?(-input{index})?-error |
|  |  | input | a12-{field-name}-{field-ID}(-{occurrence})?(-input{index})? |
|  |  | select | a12-{field-name}-{field-ID}(-{occurrence})?(-input{index})? |
|  |  | label | a12-{field-name}-{field-ID}(-{occurrence})?(-input{index})?-label |
| Button | Button | button | a12-{ui-ID} |
| TopLevelScreen | TopLevelScreen | child container DIV | case-{ui-ID} |
| Section | Section | container DIV | a12-{ui-ID} |
| ControlGrid | ControlGrid | container DIV | a12-{ui-ID} |
| Row | Row | container DIV | a12-{ui-ID} |
| Row Title | Row | container DIV | a12-{ui-ID of belonging row}-title-row |
| TextCell | TextCell | container DIV | a12-{ui-ID}-content |
| ExpressionCell | ExpressionCell | container DIV | a12-{ui-ID}-expression |
| DetachedRepeat | DetachedRepeat | container DIV | a12-{ui-ID} |
|  | Button (Add) | button (add) | a12-add-button-{ui-ID} |
| DetachedRepeat-DetailScreen | DetachedRepeat-DetailScreen | child container DIV | case-a12-{ui-ID} |
|  | DetachedRepeat-DetailViewButtons | button (apply) | a12-(add/edit)-apply-button-{ui-ID} |
|  |  | button (cancel) | a12-(add/edit)-cancel-button-{ui-ID} |
|  |  | button (return) | a12-return-button-{ui-ID} |
| InlineRepeat | InlineRepeat | container DIV | a12-{ui-ID} |
|  | Button (Add) | button (add) | a12-add-button-{ui-ID} |
|  | InlineRepeatCell | error | a12-{ui-ID}-cell-{rowIndex}-error |
|  |  | container SPAN | a12-{ui-ID}-cell-{rowIndex}-controls |
|  |  | input | a12-{ui-ID}-cell-{rowIndex} |
|  |  | select | a12-{ui-ID}-cell-{rowIndex} |
|  |  | filter | a12-{ui-ID}-filter |
|  |  | filter from | a12-{ui-ID}-filter-from |
|  |  | filter to | a12-{ui-ID}-filter-to |
|  |  | filter empty | a12-{ui-ID}-filter-empty |
|  |  | filter boolean true | a12-{ui-ID}-filter-yes |
|  |  | filter boolean false | a12-{ui-ID}-filter-no |
|  |  | filter confirm true | a12-{ui-ID}-filter-yes |
|  | MultiAttachmentUpload | input | a12-{ui-ID}-multi-attachment-upload |
| EmbeddedRepeat | EmbeddedRepeat | container DIV | a12-{ui-ID} |
|  | Button (Add) | button (add) | a12-add-button-{ui-ID} |
| EmbeddedRepeat-ExpandedRow | Expanded Row | container DIV | a12-{ui-ID}-expandedrow-{rowIndex} |
|  | Button (close) | button (close) | a12-close-button-{ui-ID} |
|  | MultiAttachmentUpload | input | a12-{ui-ID}-multi-attachment-upload |

| expression | source |
| --- | --- |
| ui-ID | UI Model |
| field-name | Document Model |
| field-ID | Document Model |
| index | runtime |
| occurrence | runtime |

#### Data Roles

Following `data-role` values are set by the Form Engine to certain HTML elements rendered for the respective Form Model element:

| Form Model element | HTML element | data-role |
| --- | --- | --- |
| Detached Repeat | outmost div | repeat-detached |
|  | table container div | repeat-content |
| Embedded Repeat | outmost div | repeat-embedded |
|  | table container div | repeat-content |
| Inline Repeat | outmost div | repeat-inline |
|  | table container div | repeat-content |
| Screen | outmost div | screen |
| Detached Repeat Detail Screen | outmost div | screen-detached-repeat-detail |
| Button Panel | outmost div | button-panel |
| Custom Cell | outmost div | custom-cell |
| Custom Screen Element | outmost div | custom-screen-element |

### Integration

This chapter describes how the Form Engine can be integrated into applications.

* [Setting up the Form Engine in the Client](#form-engine_integration_client_setup)
* [The Integration of the Form Engine State in Activities](#form-engine_integration_client_form_engine_and_activities)
* [Customization](#form-engine_integration_client_customization)
* [Non-Redux Applications](#form-engine_integration_non-redux)

#### Client Integration

This part will explain the steps which are necessary to use the Form Engine in a Client application using the Form Engine Client extension.

A basic understanding of Client concepts is required. Details can be found in the [Client Documentation](https://geta12.com/docs/CLIENT/client-documentation-bundle/index.html).

The extension provides different view components:

* `FormEngineViews.FormEngine`: A connected component that consists of a composition of the FormEngineRenderer, the ContentBoxRenderer and the ScrollHandler. The view can be customized by providing the engine configuration props and the props of the components in the composition.
* `FormEngineViews.FormEngineTpl`: The same as the FormEngine component above, except it is not connected. It is meant to be connected to the redux store by yourself, which gives you more possibilities to customize. The chapter [Customization](#form-engine_integration_client_customization) contains more information about how to connect the engine.
* `FormEngineViews.ScrollHandler`: A connected ScrollHandler component that can be used for a custom Form Engine composition. This view can be used to activate the scrolling behavior. It is not needed if you use the standard `FormEngineViews.FormEngine`, but in case you connect the Form Engine yourself you need to wrap the `ScrollHandler` around it.

It also comes with middlewares, sagas, and DataReducers to store and modify the state of the Form Engine correctly in the Client environment.

##### Appsetup

The following steps are necessary in the appsetup to integrate the extension:

* call `createFormEngineMiddlewares` and add the returned middlewares to the `additionalMiddlewares`

  |  |  |
  | --- | --- |
  |  | If you need to customize your middlewares (like setting up an external enumeration provider), you have to pass your `MiddlewareOptions` directly. Do not call `createEngineMiddlewares` separately, as the engine middlewares need to be wrapped to receive the correct state. `createFormEngineMiddlewares` does this automatically. |
* add `formEngineSagas` to the `customSagas`
* add `formEngineDataReducers` to the activity DataReducers
* add a new instance of a `PlatformSingleDocumentDataLoader` to the `dataHandlers` in order to load single documents from a data services backend

Please refer to the API documentation to get further information about the different parts.

#### State Integration

##### Initializing of an Activity

The following image shows how an activity, which should be used to display a Form Engine, is initialized.

![image](https://geta12.com/docs/2025.06/ext5/form_engine/formengine-documentation-bundle/assets/images/form-engine/initializing_of_an_activity.svg)

1. The saga from the Form Engine extension listens to the *push-action* that belongs to a scene with a modelType `form`.
2. The saga merges the default initial UI state with the provided partial ui state in the `slices.uiState` property and triggers an internal action to set the UI state.
3. The internal action is handled by the normal middlewares and reducers.
4. In the end the newly created activity contains the default DataHolder, that contains the loaded data and a complete UI state slice.

##### Updating of an Activity

The following image shows the interaction between Form Engine and the Client. It is assumed that the activity is already initialized.

![image](https://geta12.com/docs/2025.06/ext5/form_engine/formengine-documentation-bundle/assets/images/form-engine/bfe_and_activities.svg)

1. The Client state contains all information which are necessary to render the Form Engine for a specific form

   * an activity holding the document (data.document prop) and the Form Engine UI state (slices.ui prop) in its default DataHolder
   * the Form Model and Document Model
   * the locale
2. When connecting the view the internal Form Engine state is created by using the *FormEngineSelectors*.
3. The renderer traverses the Form Model and uses React components to render.
4. Event-actions which are dispatched by the Form Engine are wrapped in a Client action by the *Event-Action Dispatch Adapter*. The new action contains, next to the original event-action, the activity-id. This is necessary to be able to map changes in the back-end to the activity which contains the engine state.
5. The Client action is handled by the *Middleware-Adapter*. This adapter calls all middlewares from the Form Engine with the wrapped event-action.
6. For each event-action, one or more command-actions are dispatched by the Form Engine middlewares.
7. If the command-action signals a data change (e.g. `setDocument`), the corresponding *ActivityAction* is dispatched by the *Middleware-Adapter*.
8. If the command-action signals a UI-state change, a Client action which wraps the command-action is dispatched by the *Middleware-Adapter*.
9. The Client action is treated be the *UI-state Reducer Adapter*, which extracts the wrapped command-action and gives it to the UI-state reducer of the Form Engine.
10. The UI-state reducer of the Form Engine changes the given state and returns it to the *engine Reducer Adapter* which then changes the ui slice in the slices property of the default DataHolder in the activity.

#### Customization

This section will describe the different possibilities to customize the Form Engine inside the Client. It is recommended to read the chapter about [the interaction of activities and the Form Engine](#form-engine_integration_client_form_engine_and_activities) before.

##### Read-only Form Engine

One often required customization of the Form Engine is to use it in a static read-only mode, where only read-only operations can be performed in the form.

This can be achieved most easily by providing a pre-initialized ui slice (`{ uiState: { readonly: true } }`) to the `slices` property in the payload of the `create` Redux action, when creating a new activity. Alternatively, you could set readonly in the ui state in the `mapStateToProps` mapping, when connecting the Form Engine component yourself.

When the form activity is already present, you can achieve the same thing by dispatching a `setReadonly` Redux action after the Form Engine activity was created.

See [Connecting a Custom View](#form-engine_integration_client_customization_connecting-a-custom-view) for more details.

##### View

###### Customizing the Standard View

The standard view can be customized via props. The props consist of the `View` props as for every view and in addition the Form Engine `Config` props.

The `View` props are the standard view props, containing the activity id. The `Config` props come from the Form Engine and include properties like `cardView`, `timeMode` or `enablements`. Please refer to the [API Documentation](https://geta12.com/docs/2025.06/ext5/form_engine/formengine-documentation-bundle/assets/typedoc/index.html) for further information.

Via the `Config` props you can also provide custom implementations of the `FormModelMap` and `WidgetMap`. This enables you to use custom Widgets. You can find more information about this in the Section [Rendering](#form-engine_tutorials_rendering).

The following code shows a customization example:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` export function formEngineViewsComponentProvider(props: View): JSX.Element { 	return <FormEngineViews.FormEngine {...props} cardView={true} />; } ``` |
```

###### Initial UI Slice

Another high-level way to customize the Form Engine view is to create the Form Engine activity with a pre-initialized ui state. This can be achieved by providing an initial `ui` slice to the `slices` property of the `create` action payload.

|  |  |
| --- | --- |
|  | It is not necessary to use the createUIState function from the Form Engine in order to set initial values for the ui state, because it is not necessary to provide the entire ui state. If the createUIState function is used, you need to provide a non-empty screenLocation. Otherwise, an error will be thrown by the Form Engine. |

Or you could modify the `slices` property in a DataReducer for the Form Engine activity default DataHolder.

In this ui slice values for the Form Engine’s `EngineStore.UIState` properties can be provided. With this, you can e.g. set the Form Engine to disabled or readonly, or you can modify the collapsed state of collapsible sections. You could even change the initial screen location, i.e. show the detail screen of a detached repeat as the initial screen. See the [API Documentation](https://geta12.com/docs/2025.06/ext5/form_engine/formengine-documentation-bundle/assets/typedoc/index.html) for all available properties.

Creating the Form Engine activity with the action shown in the following example would give you an initially disabled Form Engine:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` const initialUiSlice: Partial<EngineStore.UIState> = { 	disabled: true };  export const createAction = ActivityActions.create({ 	activityDescriptor: { model: "form", instance: "1" }, 	slices: { 		ui: initialUiSlice 	} }); ``` |
```

###### Connecting a Custom View

This section describes how you can connect the Form Engine by yourself.
When you connect the Form Engine you can use the unconnected `FormEngineViews.FormEngineTpl` component as a basis.

The Client stores the needed information for the Form Engine in a different structure in the state than the Form Engine requires it. When connecting the Form Engine, you need to map the Client state to the engine state with a `mapStateToProps` mapping.

In a `mapDispatchToProps` mapping the UI events occurring in the Form Engine need to be mapped to the respective redux actions.

To connect the component, which means creating and using the mapped props, two helper functions are provided:

* `FormEngineStateAdapter.mapStateToProps` to map the state props.
* `FormEngineActions.mapDispatchToProps` to map the dispatch props. This function internally already uses a dispatch adapter which takes an event-action from the Form Engine and creates a Client wrapper action which includes the activity id next to the event-action.

Connecting is only necessary if you want to adjust the mapping of state props or if you want to adjust the handling of UI events.

###### Complete Example

The following code shows an example of how to connect your Form Engine.

In this example the ui state of the Form Engine is statically set to readonly and the payload of the `Events.navigationButton` is adapted so that the validation property is always "full", independent of the information from the Form Model.

|  |  |
| --- | --- |
|  | When using validation, the versions of the generated validation code and the validation runtime must match, see [Getting Started Using Code Generated By Kernel At Runtime](https://geta12.com/docs/kernel/kernel-documentation-dev/index.html#_getting_started_using_code_generated_by_kernel_at_runtime). |

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 ``` | ``` import type { JSX } from "react"; import { useDispatch, useSelector } from "react-redux";  import type { View } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js"; import type { 	Config, 	DefaultDispatchProps, 	DefaultStateProps } from "@com.mgmtp.a12.formengine/formengine-core"; import { 	Events, 	FormEngineActions, 	FormEngineStateAdapter, 	FormEngineViews } from "@com.mgmtp.a12.formengine/formengine-core";  type StateProps = Partial<DefaultStateProps>;  export type OwnProps = View & Partial<Config>;  export function CustomFormEngineView( 	props: StateProps & DefaultDispatchProps & OwnProps ): JSX.Element { 	// default mappings created via helper functions 	const defaultStateProps = useSelector(state => 		FormEngineStateAdapter.mapStateToProps(state, props) 	);  	const dispatch = useDispatch(); 	const defaultDispatchProps = FormEngineActions.mapDispatchToProps(dispatch, props);  	// customizing the state prop mapping 	const customStateProps: Partial<DefaultStateProps> = { 		...defaultStateProps, 		state: defaultStateProps.state 			? { 					...defaultStateProps.state, 					ui: { 						...defaultStateProps.state.ui, 						readonly: true // set the form engine readonly 					} 				} 			: undefined 	};  	// customizing the dispatch prop mapping 	const customDispatchProps: Partial<DefaultDispatchProps> = { 		...defaultDispatchProps, 		eventHandlers: { 			...defaultDispatchProps.eventHandlers, 			onNavigationButton(target: string, validation: "full" | "partial"): void { 				/** 				 * Set the validation property always to full instead of taking 				 * the information from the form model 				 */ 				dispatch( 					Events.navigationButton({ 						target, 						validation: "full" 					}) 				); 			} 		} 	};  	// using the mapped props to connect the form engine template 	return ( 		<FormEngineViews.FormEngineTpl {...props} {...customStateProps} {...customDispatchProps} /> 	); } ``` |
```

###### Config

Whether you connect your Form Engine component yourself or use the already connected one, you can always also adjust the `Config` props, like it is described [here](#form-engine_integration_client_customization_customizing-the-standard-view).

###### ActivityContext

The Client API provides an ActivityContext which can be used to propagate the id of a view’s activity within a custom view component.

The Form Engine views provided by the Client library set this context internally, making it available for customizations.

##### Middlewares or Sagas

You can register custom middlewares and sagas in your application which react to actions coming from the Form Engine. As the Client always wraps these actions into a `FormEngineAction`, you need to match them first and then match the original action.

#### Non-Redux Applications

For any React application that has no Redux infrastructure, you can create and hold a private Redux store and configure it as usual. In order to interact with the outside React realm, you can pass respective parts of the configuration from outside.

##### Example

The following code shows a minimal example to setup your own store and connect the engine components.

First you have to load your models:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 ``` | ``` // Example of loading models function loadModels(): Promise<{ 	formModelAsJson: FormModel; 	documentModelAsString: string; 	validationCode: string; }> { 	const formModelPromise = fetch(`models/formModel.json`).then( 		response => response.json() as Promise<FormModel> 	);  	const documentModelPromise = fetch(`models/documentModel.json`).then(response => response.text());  	const validatorProviderPromise = fetch(`models/validation.js`).then(response => response.text());  	return Promise.all([formModelPromise, documentModelPromise, validatorProviderPromise]).then( 		([formModelAsJson, documentModelAsString, validationCode]) => ({ 			formModelAsJson, 			documentModelAsString, 			validationCode 		}) 	); } ``` |
```

Then you need to unmarshall the Document Model and create a `IGeneratedCodeAccessor` with your validation code.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` 	// unmarshall models 	const documentModel = new DocumentServiceFactory() 		.getDocumentModelSerializer() 		.deserialize(documentModelAsString);  	const validatorProvider = new GeneratedCodeAccessorFactory().createScriptAccessor(validationCode); ``` |
```

Furthermore, the Form Engine uses an in-memory representation of the Form Model, which extends the persistence Form Model by some information which are needed to render the form more efficient. Because of this you have to unmarshall the Form Model using the function `unmarshallFormModel`:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` 	const formModel = unmarshallFormModel( 		formModelAsJson, 		documentModel, 		defaultValueParser(documentModel) 	); ``` |
```

After that you can create and initialize your store with your models:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 ``` | ``` 	// create and initialize store 	const document = createEmptyDocument(documentModel, formModel); 	const initialState = createEngineStore({ 		data: { document }, 		locale: Locale.fromString("en_US") as Locale, 		models: { 			formModel, 			documentModel, 			validatorProvider 		} 	});  	const storeEnhancer = applyMiddleware(...createEngineMiddlewares()); 	const EngineReducer = createCombinedReducer(initialState); 	const store = createStore(EngineReducer, initialState, storeEnhancer); ``` |
```

At last you need to connect the components and render your engine

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 ``` | ``` 	const root = createRoot(mountPoint);  	// render 	root.render( 		<Provider store={store}> 			<ScrollHandlerConnected> 				<EngineConnected /> 			</ScrollHandlerConnected> 		</Provider> 	); const EngineConnected = connect< 	DefaultStateProps, 	DefaultDispatchProps, 	DefaultOwnProps, 	EngineState >( 	defaultMapStateToProps, 	defaultMapDispatchToProps )(FormEngineRenderer);  const ScrollHandlerConnected = connect< 	ScrollHandlerProps, 	{}, 	{ children?: ReactNode }, 	EngineState >(function mapStateToProps(state) { 	return { 		uiState: state.ui, 		models: state.models 	}; })(ScrollHandler); ``` |
```

The whole code should then look like this:

```
|  |  |
| --- | --- |
| ```   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49  50  51  52  53  54  55  56  57  58  59  60  61  62  63  64  65  66  67  68  69  70  71  72  73  74  75  76  77  78  79  80  81  82  83  84  85  86  87  88  89  90  91  92  93  94  95  96  97  98  99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 ``` | ``` import type { ReactNode } from "react"; import { createRoot } from "react-dom/client"; import { connect, Provider } from "react-redux"; import { applyMiddleware, legacy_createStore as createStore } from "redux";  import type { 	DefaultDispatchProps, 	DefaultOwnProps, 	DefaultStateProps, 	EngineState, 	FormModel, 	ScrollHandlerProps } from "@com.mgmtp.a12.formengine/formengine-core"; import { 	createCombinedReducer, 	createEmptyDocument, 	createEngineMiddlewares, 	createEngineStore, 	defaultMapDispatchToProps, 	defaultMapStateToProps, 	defaultValueParser, 	FormEngineRenderer, 	ScrollHandler, 	unmarshallFormModel } from "@com.mgmtp.a12.formengine/formengine-core"; import { 	DocumentServiceFactory, 	GeneratedCodeAccessorFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js"; import { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js"; import { ConsoleLoggingStrategy, Settings } from "@com.mgmtp.a12.utils/utils-logging"; import { LogLevel } from "@com.mgmtp.a12.utils/utils-logging/api.js";  Settings.LogStrategy = new ConsoleLoggingStrategy(console, LogLevel.LOG);  const mountPoint = window.document.createElement("div"); window.document.body.appendChild(mountPoint);  loadModels().then(({ formModelAsJson, documentModelAsString, validationCode }) => { 	// unmarshall models 	const documentModel = new DocumentServiceFactory() 		.getDocumentModelSerializer() 		.deserialize(documentModelAsString);  	const validatorProvider = new GeneratedCodeAccessorFactory().createScriptAccessor(validationCode); 	// create and initialize store 	const document = createEmptyDocument(documentModel, formModel); 	const initialState = createEngineStore({ 		data: { document }, 		locale: Locale.fromString("en_US") as Locale, 		models: { 			formModel, 			documentModel, 			validatorProvider 		} 	});  	const storeEnhancer = applyMiddleware(...createEngineMiddlewares()); 	const EngineReducer = createCombinedReducer(initialState); 	const store = createStore(EngineReducer, initialState, storeEnhancer); 	const root = createRoot(mountPoint);  	// render 	root.render( 		<Provider store={store}> 			<ScrollHandlerConnected> 				<EngineConnected /> 			</ScrollHandlerConnected> 		</Provider> 	); }); const EngineConnected = connect< 	DefaultStateProps, 	DefaultDispatchProps, 	DefaultOwnProps, 	EngineState >( 	defaultMapStateToProps, 	defaultMapDispatchToProps )(FormEngineRenderer);  const ScrollHandlerConnected = connect< 	ScrollHandlerProps, 	{}, 	{ children?: ReactNode }, 	EngineState >(function mapStateToProps(state) { 	return { 		uiState: state.ui, 		models: state.models 	}; })(ScrollHandler); // Example of loading models function loadModels(): Promise<{ 	formModelAsJson: FormModel; 	documentModelAsString: string; 	validationCode: string; }> { 	const formModelPromise = fetch(`models/formModel.json`).then( 		response => response.json() as Promise<FormModel> 	);  	const documentModelPromise = fetch(`models/documentModel.json`).then(response => response.text());  	const validatorProviderPromise = fetch(`models/validation.js`).then(response => response.text());  	return Promise.all([formModelPromise, documentModelPromise, validatorProviderPromise]).then( 		([formModelAsJson, documentModelAsString, validationCode]) => ({ 			formModelAsJson, 			documentModelAsString, 			validationCode 		}) 	); } ``` |
```

### Localization

The Form Engine uses the A12 localization API. This enables extending and overriding the default texts that the Form Engine brings via their corresponding localization keys.

|  |  |
| --- | --- |
|  | The Form Engine only provides default texts for `en` and `de`. For every other locale it is necessary to provide the texts on your own. This can be achieved by providing the texts in the models or by using the A12 localization API. |

#### Localizer

It is possible to provide your own `Localizer` to the Form Engine.

The custom localizer function must be passed to the Form Engine middlewares via the `MiddlewareOptions` as a `Provider<Localizer>` function. Furthermore, the Form Engine expects a surrounding `LocalizerContext` react context which then also provides this `Localizer` to the Form Engine react components.

Finally, when the `defaultConverter` from the Form Engine default API is used to create a `Converter`, it must also receive a `Provider<Localizer>` function as a parameter.

#### Keys

##### Static Resource Keys

For most static resources like validation bar texts the keys are provided by the constant `RESOURCE_KEYS` which is located in `back-end/localization`. This constant provides the keys as well as the documentation of their usage.

###### Attachment Error Keys

The only static keys, that are not defined in `RESOURCE_KEYS`, are the keys for attachment errors that might happen during uploading when using the platform loader implementation. These keys are defined in the Data Services repository (please refer to the [API documentation](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#link-references) of Data Services for more information).

##### Model Element Keys

For model element like controls and fields the keys are dynamically generated. Therefore, no constant exists that provides the keys. However, the schema for generating this kind of key is:

| Element | Key |
| --- | --- |
| Content Box Title | `uiModel.{model-name}.header.label` |
| Bread Crumbs, Validation Bar Elements, Section | `uiModel.{model-name}.({path-to-element})+.title` |
| Button Label, Expression Cell | `uiModel.{model-name}.({path-to-element})+.label` |
| Button Description | `uiModel.{model-name}.({path-to-element})+.description` |
| Text Cell | `uiModel.{model-name}.({path-to-element})+.content` |
| Button Label (of built-in buttons) | `uiModel.{model-name}.({path-to-element})+.buttonLabel.{type}`  `uiModel.{model-name}.defaults.buttonLabel.{type}`  Type is one of the values of `FormModel.RepeatButtonLabelEnum` in lower case. |
| Control Label | `uiModel.{model-name}.({form-model-path-to-element})+.label`  `documentModel.label.{model-name}.({document-model-path-to-element})+` |
| Control Hint | `uiModel.{model-name}.({form-model-path-to-element})+.hint`  `documentModel.hint.{model-name}.({document-model-path-to-element})+` |
| Row Action Label | `uiModel.{model-name}.({form-model-path-to-element})+.rowActions.{event}.label` |
| Row Action Description | `uiModel.{model-name}.({form-model-path-to-element})+.rowActions.{event}.description` |
| Row Action Confirmation | `uiModel.{model-name}.({form-model-path-to-element})+.rowActions.{event}.confirmation` |
| Row Action Confirmation Title | `uiModel.{model-name}.({form-model-path-to-element})+.rowActions.{event}.confirmationTitle` |
| Overview Column Title | `uiModel.{model-name}.({form-model-path-to-element})+.label`  `documentModel.label.{model-name}.({document-model-path-to-element})+` |
| Overview Column Hint | `uiModel.{model-name}.({form-model-path-to-element})+.hint`  `documentModel.hint.{model-name}.({document-model-path-to-element})+` |
| Multi File Upload Description | `uiModel.{model-name}.({form-model-path-to-element})+.multiFileUpload.description` |
| Multi File Upload Button Text | `uiModel.{model-name}.({form-model-path-to-element})+.multiFileUpload.buttonText` |
| Multi File Upload Helper Text | `uiModel.{model-name}.({form-model-path-to-element})+.multiFileUpload.helperText` |
| Boolean Label for Boolean Filter,  Boolean Label for Confirm Filter | `documentModel.{model-name}.({path-to-element})+.{value}`  `{{value}}` |
| Enumeration Label for Enumeration Filter | `documentModel.enumValues.{model-name}.({path-to-element})+.{enumeration-value}` |
| Suffix | `documentModel.{model-name}.{path-to-element}+.suffix` |

### Customization

This chapter covers how you can use the API to customize the behavior and appearance of the Form Engine.

The following sections describe, how to:

* [modify the configuration options](#form-engine_tutorials_configuration_options)
* [customize the default conversion and validation behavior](#form-engine_tutorials_conversion_and_validation)
* [customize the default behavior of the engine by adapting the DispatchConfiguration or middlewares](#form-engine_tutorials_behavior)
* [customize the rendering](#form-engine_tutorials_rendering)
* [setup custom event handling with buttons and RowActions](#form-engine_tutorials_event_handling)
* [customize the enablement of buttons and RowActions](#form-engine_tutorials_button_enablement)
* [create a custom data provider for loading form data](#form-engine_tutorials_data_provider)
* [customize selectors](#form-engine_tutorials_selectors)

#### Modifying Configuration Options

The following code shows how the `Config` can be adapted and then passed to the connected components.
In the example the properties `cardView` and `uiIdPrefix` are set.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 ``` | ``` import type { ComponentType, JSX, ReactNode } from "react"; import { connect } from "react-redux";  import type { 	Config, 	DefaultDispatchProps, 	DefaultOwnProps, 	DefaultStateProps, 	EngineState, 	ScrollHandlerProps } from "@com.mgmtp.a12.formengine/formengine-core"; import { 	defaultMapDispatchToProps, 	defaultMapStateToProps, 	FormEngineRenderer, 	ScrollHandler } from "@com.mgmtp.a12.formengine/formengine-core";  export function Engine(props: { readonly uiIdPrefix?: string }): JSX.Element { 	// Setup the Config 	const config: Partial<Config> = { 		uiIdPrefix: props.uiIdPrefix, 		cardView: true 	};  	// Put all together and hand the config via props to the components 	return ( 		<ScrollHandlerConnected uiIdPrefix={props.uiIdPrefix}> 			<EngineConnected config={config} /> 		</ScrollHandlerConnected> 	); }  /**  * Create the connected components.  * It is important that the ScrollHandler receives the same uiIdPrefix than the FormEngine  */ const ScrollHandlerConnected: ComponentType<{ 	readonly uiIdPrefix?: string; 	readonly children?: ReactNode; }> = connect<ScrollHandlerProps, {}, { readonly uiIdPrefix?: string }, EngineState>( 	function mapStateToProps(state) { 		return { 			uiState: state.ui, 			models: state.models 		}; 	} )(ScrollHandler);  const EngineConnected = connect< 	DefaultStateProps, 	DefaultDispatchProps, 	DefaultOwnProps, 	EngineState >( 	defaultMapStateToProps, 	defaultMapDispatchToProps )(FormEngineRenderer); ``` |
```

#### Conversion and Validation

##### Custom Converter

This section is about how you can change the default behavior of the converter.

The conversion functionality is provided by the utils-localization library of A12. It contains a conversion API that can be customized in various ways that are described by the respective documentation of this library.

For the integration into the Form Engine, a key aspect must be considered: A customized conversion must always be provided to both Form Engine view and Form Engine middlewares.

On the view level (i.e. for react components), this is automatically achieved by providing the respective `LocalizerContext` that wraps the client and/or Form Engine components.
A customized conversion object would need to be passed to this context.

The same customized conversion object also needs to be passed to the Form Engine middlewares within the `MiddlewareOptions` parameter to the `createEngineMiddlewares` factory function.

#### Behavior Customization

There are different ways to customize the behavior of the engine. You can configure the `DispatchConfiguration` and add custom middlewares or reducers.
This part shows a small example for the first two options.

##### Customizing DispatchConfiguration

Every UI-Event is handled by the `DispatchConfiguration`, which dispatches an event-action. You can overwrite parts of this configuration. It is mandatory to spread the `defaultMapDispatchToProps` into the map object. The following example will modify the default behavior for the `onNavigationButton` event. In this code the event-action `navigationButton` is always called with `validate = true` and `options = { validation: "full" }`, independent of the modelled button.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 ``` | ``` import { connect } from "react-redux"; import type { Dispatch } from "redux";  import type { 	DefaultDispatchProps, 	DefaultOwnProps, 	DefaultStateProps, 	EngineState } from "@com.mgmtp.a12.formengine/formengine-core"; import { 	defaultMapDispatchToProps, 	defaultMapStateToProps, 	Events, 	FormEngineRenderer } from "@com.mgmtp.a12.formengine/formengine-core";  export const EngineConnected = connect< 	DefaultStateProps, 	DefaultDispatchProps, 	DefaultOwnProps, 	EngineState >(defaultMapStateToProps, function mapDispatchToProps(dispatch: Dispatch): DefaultDispatchProps { 	const defaultDispatchProps = defaultMapDispatchToProps(dispatch); 	return { 		eventHandlers: { 			...defaultDispatchProps.eventHandlers, 			onNavigationButton(target: string): void { 				dispatch( 					Events.navigationButton({ 						target, 						validation: "full" 					}) 				); 			} 		} 	}; })(FormEngineRenderer); ``` |
```

##### Custom Middleware

The following tutorial shows how a middleware for the event-action `eventButton` can be written and registered.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 ``` | ``` import type { Middleware, MiddlewareAPI } from "redux"; import { actionCreatorFactory } from "typescript-fsa";  import type { EngineState, FormModel } from "@com.mgmtp.a12.formengine/formengine-core"; import { 	Events, 	ModelSelectors, 	findElementByFormModelPath } from "@com.mgmtp.a12.formengine/formengine-core";  export const onEventButtonClickedMiddleware: Middleware<{}, EngineState> = 	api => next => action => { 		if (Events.eventButton.match(action)) { 			handleEvent(api, action.payload); 		} 		return next(action); 	};  function handleEvent(api: MiddlewareAPI, { name, buttonPath }: Events.EventButtonPayload): void { 	// 1. make sure that the event matches our expectation & that the button contains the desired annotation 	if ("my_event" === name && buttonPath !== undefined) { 		const formModelButton = findElementByFormModelPath( 			ModelSelectors.formModel()(api.getState()), 			buttonPath 		); 		if (formModelButton !== undefined) { 			const annotations = (formModelButton as FormModel.ButtonType).annotations; 			const parameterAnnotation = annotations?.find( 				annotation => "my_parameter" === annotation.name 			); 			if (parameterAnnotation !== undefined) { 				const parameter = parameterAnnotation.value; 				// 2. execute custom logic that is supposed to be executed in case my annotated button was clicked 				api.dispatch(myEvent({ parameter })); 				return; 			} 		} 	} } ``` |
```

#### Rendering

This chapter contains examples of how the rendering can be customized using the `FormModelMap` or `WidgetMap`. The Form Engine internally uses default variants of those maps but you can provide your own map implementations containing your customizations as Form Engine props. Then these will be used in place of the default ones.

The `FormModelMap` allows customizations on the level of Form Model elements. You can use it, when you want to render something completely custom in place of a whole Form Model element and not just want to change some details.

The `WidgetMap` enables you to customize the rendering on a low level by providing a way to replace the React components provided by the Widgets library and used in the Form Engine rendering with your custom widgets. You can use it when you want to change the details of the rendering of Form Model elements or even non-model elements like the content box.

##### Customizing Specific Elements

In most cases you want to change only certain instances of an element. This could be e.g. only the input rendered for a certain field. To achieve this, you should use the annotations that can be defined for specific Form Model elements in the modeling tool.

You can e.g. add an annotation with a certain name to a specific control. Then you could only render your custom component for elements that have an annotation with this name. Otherwise the default component would be rendered.

|  |  |
| --- | --- |
|  | If you want to use model-level information inside the WidgetMap, you can wrap a React context around the respective element in the FormModelMap. |

Next to the name, you can also define an annotation value. The value is not required but could be used to further customize the custom component with specific prop values, which could be encoded in the annotation value.

##### FormModelMap

This example creates a custom `FormModelMap`, which renders instead of a section an image, if the FormModel element contains a special annotation.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 ``` | ``` import type { FormModel, FormModelMap } from "@com.mgmtp.a12.formengine/formengine-core"; import { DefaultFormModelMap } from "@com.mgmtp.a12.formengine/formengine-core";  export const CustomFormModelMap: FormModelMap = { 	...DefaultFormModelMap, 	Section: { 		component(props: FormModelMap.FormModelComponentProps<FormModel.Section>) { 			if (props.modelElement.annotations && props.modelElement.annotations[0].name === "image") { 				const value = props.modelElement.annotations[0].value; 				return <img src={`images/${value}`} height="200px" />; 			} else { 				return <DefaultFormModelMap.Section.component {...props} />; 			} 		} 	} }; ``` |
```

To register your custom `FormModelMap` you need to put it in your `Config`. It is mandatory to spread the `DefaultFormModelMap` into the map object. In the tutorial [Configuration Options](#form-engine_tutorials_configuration_options) is an example about how to adapt and use a custom `Config`.

|  |  |
| --- | --- |
|  | Although the menu entries in the form sub header navigation menu are created based on the navigation buttons placed in the Form Model and Screen sub header boxes, it is not possible to customize those menu entries using the 'NavigationButton' entry of the Form Model map. |

|  |  |
| --- | --- |
|  | The Form Model Map entry *FieldOverviewColumn* is only used in *Inline Repeats*. A customization of such field overview columns in *Detached Repeats* and *Embedded Repeats* is currently not possible. |

###### Enablement of Custom Form Model Elements

To take into account, if a custom Form Model element should be hidden, disabled or read-only, you can check the corresponding status using the following API functions:

* Enablements.isDisabled
* Enablements.isHidden
* Enablements.isReadonly

In the above example of a custom section these functions could be used to hide the rendered image, if the section should be hidden (e.g. by using a dependent control). The following code shows how to achieve this behavior:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 ``` | ``` import type { FormModel, FormModelMap } from "@com.mgmtp.a12.formengine/formengine-core"; import { 	DefaultFormModelMap, 	Enablements, 	UiStateSelectors } from "@com.mgmtp.a12.formengine/formengine-core";  export const CustomFormModelMap: FormModelMap = { 	...DefaultFormModelMap, 	Section: { 		component(props: FormModelMap.FormModelComponentProps<FormModel.Section>) { 			if (props.modelElement.annotations && props.modelElement.annotations[0].name === "image") { 				const state = props.config.renderOptions.state; 				const currentScreenLocation = UiStateSelectors.currentScreenLocation()(state); 				const dataContext = currentScreenLocation.path;  				const isSectionHidden = Enablements.isHidden({ 					formModelElement: props.modelElement, 					state, 					dataContext 				});  				const value = props.modelElement.annotations[0].value;  				return isSectionHidden ? null : <img src={`images/${value}`} height="200px" />; 			} else { 				return <DefaultFormModelMap.Section.component {...props} />; 			} 		} 	} }; ``` |
```

##### WidgetMap

In this example a custom `WidgetMap` is created, which renders an additional button next to the `TextLineStateless` widget, if the corresponding FormModel element contains a special annotation.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 ``` | ``` import type { JSX } from "react"; import { createContext, useContext } from "react";  import type { FormModelMap, WidgetMap } from "@com.mgmtp.a12.formengine/formengine-core"; import { 	FormModel, 	DefaultFormModelMap, 	DefaultWidgetMap } from "@com.mgmtp.a12.formengine/formengine-core"; import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.view.js"; import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view.js"; import type { TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-line/main/template/text-line.tpl.api.js";  const CustomInputContext = createContext<{ 	formModelElement?: FormModel.Control | FormModel.BasicScreenElement; }>({});  export const CustomWidgetMap: WidgetMap = { 	...DefaultWidgetMap, 	TextLineStateless: (props: TextLineStatelessProps) => { 		const customInputContext = useContext(CustomInputContext); 		const element = customInputContext.formModelElement; 		if ( 			element === undefined || 			!FormModel.Control.isInstance(element) || 			element.annotations === undefined 		) { 			return <DefaultWidgetMap.TextLineStateless {...props} />; 		}  		const annotation = element.annotations[0]; 		if (annotation.name === "showHelpText") { 			return <TextLineWithButton {...props} />; 		}  		return <DefaultWidgetMap.TextLineStateless {...props} />; 	} };  export const FormModelMapForWidgetMap: FormModelMap = { 	...DefaultFormModelMap, 	Control: { 		component: (props: FormModelMap.FormModelComponentProps<FormModel.Control>) => { 			return ( 				/** 				 * Wrapping the context around the Control component is 				 * necessary, because we want to access the annotations in 				 * the CustomWidgetMap. Therefore we need access to the current 				 * formModelElement, that is provided by this context. 				 */ 				<CustomInputContext.Provider value={{ formModelElement: props.modelElement }}> 					<DefaultFormModelMap.Control.component {...props} /> 				</CustomInputContext.Provider> 			); 		} 	} };  function TextLineWithButton(props: TextLineStatelessProps): JSX.Element { 	return ( 		<DefaultWidgetMap.TextLineStateless 			{...props} 			addonAfter={ 				<> 					{props.addonAfter} 					{ 						<Button 							icon={<Icon>help</Icon>} 							onClick={() => { 								/* do something */ 							}} 						/> 					} 				</> 			} 		/> 	); } ``` |
```

It is mandatory to spread the `DefaultWidgetMap` into the map object.

To access the annotation of the FormModel element, it is necessary to provide a custom context, which makes this information available to the widget. This `CustomInputContext` has to be wrapped around the associated entry in the `FormModelMap`. Therefore it is necessary to register both maps - the custom `WidgetMap` and the custom `FormModelMap` - in your `Config`.

If you do not need to access the FormModel element, you can omit the additional context and the `FormModelMap`.

|  |  |
| --- | --- |
|  | The customization of a widget will only take effect, if the widget is rendered directly by the Form Engine. For example, the `TextLineStateless` widget renders a `Label` widget internally. This `Label` cannot be customized by providing your own `Label` widget in the map, but only through the corresponding property of the containing widget - in this case the `TextLineStateless`. |

##### Input Customization

If you want to customize an input you can either overwrite the `Control` or `FieldOverviewColumn` entry in the `FormModelMap` or you overwrite individual widgets in the `WidgetMap`.

The Form Engine provides API functions to simplify the customization of inputs.

The following selectors exist currently:

* `UiStateSelectors.InputLocalization.labelLocalizables`
* `UiStateSelectors.InputLocalization.placeholderLocalizables`
* `UiStateSelectors.InputLocalization.hintLocalizables`
* `UiStateSelectors.InputLocalization.helperTextLocalizables`
* `UiStateSelectors.InputLocalization.suffixTextLocalizables`
* `ModelSelectors.FormModelSelectors.suffix`

Please refer to the [API documentation](https://geta12.com/docs/2025.06/ext5/form_engine/formengine-documentation-bundle/assets/typedoc/index.html) for details about Input Localization and Form Model Selectors.

In addition to the selectors we provide the React component `ValidationMessages` which renders either a single validation message or a list of messages. This component can be set at the respective widget prop to render the validation message container.
Furthermore, you can use `renderTooltips`, which renders an error, warning, and hint tooltip depending on the given input.

You can find in-depth examples in the devapp directory of the Form Engine repository under:

* `devapp\src\customizations\custom-control.tsx`
* `devapp\src\customizations\custom-input-as-widget.tsx`
* `devapp\src\customizations\custom-widgets.tsx`

#### Custom Event Handling With Buttons and Row Actions

This chapter contains examples of how annotated event buttons or custom Row Action buttons can be used to trigger project-specific functionality.

##### Event Buttons

###### Form Model

An annotation must be added to a Form Model button. It can be any event button, e.g. in the form subheader / footer, the Screen subheader / footer,
a Button Panel or a even custom Repeat Row Action. In this example a form footer button is used.

![Footer box with annotated event button](https://geta12.com/docs/2025.06/ext5/form_engine/formengine-documentation-bundle/assets/images/form-engine/annotatedButton.PNG)

Whenever this button is clicked by the user, the `DispatchConfiguration.onEventButton()` function is called and an `eventButton` action is dispatched. The action payload contains the event name and a `ModelPath` to the button.
In case of Row Actions, a `customRowAction` action would be dispatched instead. This action contains the event name, the path to the affected row (a `DocumentPath`) and the path to the affected Repeat (a `ModelPath`).

###### Customized Event Handling

In order to add custom event handling logic, an additional `onEventButtonClickedMiddleware` must be implemented and registered.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 ``` | ``` import type { Middleware, MiddlewareAPI } from "redux"; import { actionCreatorFactory } from "typescript-fsa";  import type { EngineState, FormModel } from "@com.mgmtp.a12.formengine/formengine-core"; import { 	Events, 	ModelSelectors, 	findElementByFormModelPath } from "@com.mgmtp.a12.formengine/formengine-core";  export const onEventButtonClickedMiddleware: Middleware<{}, EngineState> = 	api => next => action => { 		if (Events.eventButton.match(action)) { 			handleEvent(api, action.payload); 		} 		return next(action); 	};  function handleEvent(api: MiddlewareAPI, { name, buttonPath }: Events.EventButtonPayload): void { 	// 1. make sure that the event matches our expectation & that the button contains the desired annotation 	if ("my_event" === name && buttonPath !== undefined) { 		const formModelButton = findElementByFormModelPath( 			ModelSelectors.formModel()(api.getState()), 			buttonPath 		); 		if (formModelButton !== undefined) { 			const annotations = (formModelButton as FormModel.ButtonType).annotations; 			const parameterAnnotation = annotations?.find( 				annotation => "my_parameter" === annotation.name 			); 			if (parameterAnnotation !== undefined) { 				const parameter = parameterAnnotation.value; 				// 2. execute custom logic that is supposed to be executed in case my annotated button was clicked 				api.dispatch(myEvent({ parameter })); 				return; 			} 		} 	} } ``` |
```

##### Custom Row Actions

In order to add logic for a custom Row Action button, an additional `onRowActionClickedMiddleware` must be implemented and registered.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 ``` | ``` import type { Middleware } from "redux"; import { actionCreatorFactory } from "typescript-fsa";  import type { EngineState } from "@com.mgmtp.a12.formengine/formengine-core"; import { Events } from "@com.mgmtp.a12.formengine/formengine-core"; import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";  export const onRowActionClickedMiddleware: Middleware<{}, EngineState> = api => next => action => { 	if (Events.Repeat.customRowAction.match(action)) { 		const eventName = action.payload.eventName; 		const rowPath = action.payload.rowPath;  		// execute custom logic that is supposed to be executed in case a custom row action button was clicked 		if (eventName === "my-custom-row-action") { 			api.dispatch(myEvent({ eventName, rowPath })); 		} 	} 	return next(action); }; ``` |
```

Whenever a Row Action is executed in an Embedded Repeat, the currently expanded row gets collapsed. You need to take care of this collapsing yourself when you have custom Row Actions in an Embedded Repeat. The following code shows an example of how to achieve this:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 ``` | ``` import type { Middleware } from "redux"; import { actionCreatorFactory } from "typescript-fsa";  import type { EngineState } from "@com.mgmtp.a12.formengine/formengine-core"; import { Commands, Events, UiStateSelectors } from "@com.mgmtp.a12.formengine/formengine-core"; import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";  export const onRowActionClickedMiddleware: Middleware<{}, EngineState> = api => next => action => { 	if (Events.Repeat.customRowAction.match(action)) { 		const eventName = action.payload.eventName; 		const rowPath = action.payload.rowPath; 		const repeatFormModelPath = action.payload.repeatFormModelPath;  		const currentScreenLocation = UiStateSelectors.currentScreenLocation()(api.getState()); 		const repeatStateEntry = UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)( 			api.getState() 		);  		api.dispatch( 			Commands.changeRepeatInstanceStateEntry({ 				locationPath: currentScreenLocation.locationPath, 				repeatFormModelPath: repeatFormModelPath, 				entry: { 					...repeatStateEntry, 					expandedRowPath: undefined 				} 			}) 		);  		api.dispatch(myEvent({ eventName, rowPath })); 	} 	return next(action); }; ``` |
```

#### Custom Enablement for Event, Navigation and Row Action Buttons

The Form Engine provides two maps to configure the enablement of event, navigation and Row Action buttons. The maps can be set via the `enablements` property in the `Config` object of the engine. Refer to [Modifying the configuration options](#form-engine_tutorials_configuration_options) to see how this `Config` property can be modified and passed to the engine.

The following sections will describe the structure of the maps and show some examples.

##### Enablement Map for Event and Navigation Buttons

The structure of the enablement map for event and navigation buttons looks like this:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` { 	[buttonName]: { 		disabled?: boolean 		hidden?: boolean 	} } ``` |
```

The "buttonName" defines the name of the button for which the enablement should be set. This name needs to be unique in one Form Model otherwise all buttons with this name will get the defined enablement.
The button will be disabled (hidden), if "disabled" ("hidden") is set to true and enabled (visible) if "disabled" ("hidden") is set to false.
If nothing is defined for a button, then the engine logic will take place, which will for example:

* disable buttons if the engine is disabled
* hide buttons if the engine is readonly and the button scope in the model is set to "HIDDEN\_IN\_READONLY\_MODE"

The custom enablement logic will always win over the engine logic.

The map should only be recalculated if values are changed which affect the outcome of the map. Furthermore you should only list these buttons for which you need a different enablement than the default behavior would create, to prevent the maps of becoming too big.
The following code shows an example of the creation and adaption of such a map.
The button "Submit" in this example should only be enabled if the engine is dirty.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 ``` | ``` export function CustomButtonEnablementEngine(): JSX.Element { 	const dirty = useSelector(state => DataSelectors.dirty()(state as EngineState));  	const config: Partial<Config> = useMemo( 		() => ({ 			enablements: { 				byButtonName: { 					["submit"]: { 						disabled: !dirty 					} 				} 			} 		}), 		[dirty] 	); 	return <FormEngineComponent config={config} />; } ``` |
```

###### Enablement Map for Row Action Buttons

The structure of the enablement map for Row Action buttons looks like this:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 ``` | ``` { 	[repeatName]: { 		[event]: { 			[rowIndex]: { 				disabled?: boolean 				hidden?: boolean 			}  		} 	} } ``` |
```

The "repeatName" defines the name of the Repeat for which the enablement for Row Action buttons should be set.
"Event" is the name of the event, for which the enablement should be set.
An enablement can be set for the whole Repeat, by setting the rowIndex to 0
or for one certain row by setting the rowIndex to the number of the row.
Mind that the row index follows the Kernel logic, where the first row has the index 1.
The specification of an enablement for one certain row (rowIndex > 0) will always overrule any specification made for the whole Repeat (rowIndex=0).

You can also set the enablement for the default Row Action buttons (delete, copy, move, edit/view). The event names for them are defined in the enumeration `DefaultRepeatButtonNames`.

#### Custom Model Elements

The FormModelMap provides two special extension points for custom UI with complete own semantics:

* CustomScreenElement: A custom element that can be placed inside a Screen, a Multi Column Section or a Section. It must handle an ID to output a unique HTML ID. Optionally a title, styles, annotations and a height can be passed to the element.
* CustomCell: A custom element that can only be placed inside of a Row of a ControlGrid. It must handle an ID. Optionally annotations, offset and span can be passed to the element.

Both elements need to be implemented by the consumer. To achieve this, a custom FormModelMap needs to be implemented which provides rendering code for the custom model elements:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` const CustomFormModelMap: FormModelMap = {     ...DefaultFormModelMap,     CustomCell: {         component: (props: FormModelMap.FormModelComponentProps<FormModel.CustomCell>) => {             return <MyCustomCell />;         }     },     CustomScreenElement : {         component: (props: FormModelMap.FormModelComponentProps<FormModel.CustomScreenElement >) => {             return <MyCustomScreenElement />;         }     } } ``` |
```

The custom FormModelMap can then be passed via the Config object to the Form Engine.

|  |  |
| --- | --- |
|  | The Form Engine will render a placeholder component if no custom component for CustomScreenElement or CustomCell is provided in the FormModelMap.  It should be noted that these custom model elements have no predefined behavior. This means that information like the hidden, readonly and disabled status must be retrieved by the custom component itself. There are already API functionalities available to compute this kind of information, as described in [Enablement of custom Form Model Elements](#form-engine_tutorials_rendering_enablements). |

#### Custom Form Data Provider

The Form Engine comes with a Client extension that provides two built-in data providers:

* the one resulting from calling the `createEmptyDocumentDataProvider` factory function. It can be used to create a new document when loading data in the "new instance" case.
* the `platformSingleDocumentDataProvider` which can be used for loading documents for existing instances and for saving or updating documents. It is meant to be used together with a Data Services backend.

But there are use cases, where those data providers are not sufficient and a custom solution is needed, e.g. when working with a custom backend.

The following code listing gives a detailed example for a custom data provider implementation.

```
|  |  |
| --- | --- |
| ```   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49  50  51  52  53  54  55  56  57  58  59  60  61  62  63  64  65  66  67  68  69  70  71  72  73  74  75  76  77  78  79  80  81  82  83  84  85  86  87  88  89  90  91  92  93  94  95  96  97  98  99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127 128 129 130 131 132 133 134 135 136 137 138 139 140 141 142 143 144 145 146 147 148 149 150 151 152 153 154 155 156 157 158 159 160 161 162 163 164 165 166 167 168 169 170 171 172 173 174 175 176 177 178 179 180 181 182 183 184 185 186 187 188 189 190 191 192 193 194 195 196 197 198 199 200 201 202 203 204 205 206 207 208 209 210 211 212 213 214 215 216 217 218 219 220 221 222 223 224 225 226 227 228 229 230 231 232 233 234 235 236 237 238 239 240 241 242 243 244 245 246 247 248 249 250 251 252 253 254 255 256 257 258 259 260 261 262 263 264 265 266 267 268 269 270 271 272 273 274 275 276 277 278 279 280 281 282 283 284 285 286 287 288 289 290 291 292 293 294 295 296 297 298 299 300 301 302 303 304 305 306 307 308 309 310 311 312 313 314 315 316 317 318 319 320 321 322 323 324 325 326 327 328 329 330 331 332 333 334 335 336 337 338 339 340 341 342 343 344 345 346 347 348 349 350 351 352 353 354 355 356 357 358 359 360 361 362 363 364 365 366 367 368 369 370 371 ``` | ``` import { call, put, select, type SagaGenerator } from "typed-redux-saga";  import { 	Activity, 	ActivityActions, 	ActivitySagas, 	ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js"; import { NEW_INSTANCE_IDENTIFIER } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js"; import type { DataProvider } from "@com.mgmtp.a12.client/client-core/lib/core/data/index.js"; import type { Model } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js"; import { 	extractModelsInScenePayload, 	ModelSagas, 	ReferencedModel } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js"; import type { FormModel } from "@com.mgmtp.a12.formengine/formengine-core"; import { 	createEmptyDocument, 	FormActivity, 	isFormModel, 	preProcessDocument } from "@com.mgmtp.a12.formengine/formengine-core"; import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js"; import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";  // The kernel document service to be used for parsing and formatting of the dates in the document. const documentService = new DocumentServiceFactory().getDocumentService();  export const mySingleDocumentDataProvider: DataProvider = { 	name: "MySingleDocumentDataProvider",  	/* 	 * This data provider should be considered during activity data loading, when 	 * 	 * - the activity descriptor has an instance defined (__NEW__ or concrete 	 * instance), which gives the hint that the activity manages a single 	 * document and not a list of documents 	 * 	 * - and in the application model or DynamicConfiguration there is a 	 * VIEW_ADD directive applying for the current activity, in which a form 	 * model is defined, which gives the hint that a Form Engine might be used 	 * as ViewComponent for the activity. 	 * NOTE: the form model should be defined "directly" in the scene, therefore we check the `direct` property as well 	 */ 	canHandle({ activityId, activities, action }: DataProvider.CanHandleConfig): boolean { 		const instance = activities[activityId]?.descriptor.instance; 		const { modelsInScene } = extractModelsInScenePayload(action) ?? {};  		return ( 			instance !== undefined && 			(modelsInScene?.some( 				r => 					r.direct && 					(ReferencedModel.isLoaded(r) 						? r.model.header.modelType 						: ReferencedModel.isNotLoaded(r) 							? r.model.modelType 							: undefined) === "form" 			) ?? 				false) 		); 	},  	*provideData(config: DataProvider.ProvideDataConfig): SagaGenerator<void> { 		const { activityId, dataHolders } = config;  		// prevent data handling, when the activity doesn't exist anymore. 		const activity = yield* select(ActivitySelectors.activityById(activityId)); 		if (activity === undefined) { 			throw new Error(`No activity found for id ${activityId}.`); 		}  		// The instance we checked in canHandle shouldn't suddenly be missing. 		if (activity.descriptor.instance === undefined) { 			throw new Error( 				`Expected instance is missing in the descriptor of activity with id ${activityId}.` 			); 		}  		// The form engine expects the document in the activity's default data 		// holder. This data holder should be present. 		const defaultDataHolder = dataHolders.find( 			Activity.DataHolder.hasDescriptor(activity.descriptor) 		); 		if (defaultDataHolder === undefined) { 			throw new Error(`No default DataHolder found for activityId ${activityId}`); 		}  		switch (config.operation) { 			case "load": 				{ 					// We wait for the models to be loaded, since we need the 					// document model to parse the dates in the document and the 					// form model for determining the preprocessing mode. 					// It is possible to achieve parallel loading of models and 					// data by moving this call after the document request. 					const [formModel, documentModelAndValidationCode] = yield* call(waitForModels, activity);  					// The validation code is extracted from the loaded document model 					const { generatedCodeAccessor: validatorProvider, ...documentModel } = 						documentModelAndValidationCode;  					let document: GroupInstance;  					if (activity.descriptor.instance === NEW_INSTANCE_IDENTIFIER) { 						// Creating a new document  						// The new document with initial values and rows as 						// defined in the form model. 						document = { 							id: NEW_INSTANCE_IDENTIFIER, 							modelId: documentModel.header.id, 							...createEmptyDocument(documentModel, formModel) 						};  						// Via this flag from the client application setup any 						// preprocessing of a new document can be skipped 						// regardless of the preprocessing mode defined in the 						// form model 						if (config.details.preComputeNewDocuments === false) { 							yield* put(ActivityActions.setData({ activityId, data: { document } })); 							return; 						} 					} else { 						// Loading an existing document  						// Here follows some dummy code for the example. Replace with real request code. 						type MyLoadDocumentResponse = { 							readonly docRef: string; 							readonly documentModelName: string; 							readonly document: object; 						};  						// replace with your document loading code 						const documentRequest: Promise<MyLoadDocumentResponse> = Promise.resolve( 							{} as unknown as MyLoadDocumentResponse 						); 						const documentResponse = yield* call(() => documentRequest);  						const { document: loadedDocument, docRef, documentModelName } = documentResponse;  						// The serialized date strings in the document are parsed to Date objects 						document = { 							...documentService.parseDates(loadedDocument, documentModelAndValidationCode), 							id: docRef, 							modelId: documentModelName 						}; 					}  					// The preprocessing defined in the form model is executed 					// for the document. This can be computations only, 					// computations and dependency evaluation, or no 					// preprocessing. And it can differ for new or existing 					// documents. 					const preProcessingResult = preProcessDocument({ 						document, 						isNewInstance: activity.descriptor.instance === NEW_INSTANCE_IDENTIFIER, 						models: { 							formModel, 							documentModel, 							validatorProvider 						} 					});  					// Handling of computation errors that might have occurred 					// during the preprocessing 					if (preProcessingResult.messages) { 						const error: ActivityActions.ErrorPayload = { 							activityId, 							operationType: "loading", 							error: { 								errorCode: "INTERNAL_CLIENT_ERROR", 								message: 									"At least one computation failed during the initial computation for the document.", 								computationErrorMessages: preProcessingResult.messages 							} 						}; 						yield* put(ActivityActions.error(error)); 					}  					// The activity default data holder is updated with the 					// loaded data and the loading state set to loaded. 					yield* put( 						ActivityActions.setData({ 							activityId, 							data: { document: preProcessingResult.document } 						}) 					); 				} 				break;  			case "save": 				{ 					const { updateActivityData, saving } = config.details;  					const { data: oldData, datasourceActivityId } = defaultDataHolder; 					if (oldData === undefined) { 						throw new Error("Cannot handle empty data"); 					}  					if (!FormActivity.Data.SingleDocumentData.isInstance(oldData)) { 						throw new Error("Activity does not contain suitable data!"); 					}  					const [formModel, documentModel] = yield* call(waitForModels, activity);  					// We remove all field and group instances from the document 					// which currently are "notRelevant" according to the form 					// model dependencies 					const relevantData = { 						...oldData, 						document: FormActivity.Data.filterDataByRelevance(oldData.document, { 							documentModel, 							formModel 						}) 					};  					// We transform the date values in the document to the 					// kernel string representation. modelId and id are not part 					// of the document model and would lead to errors during the 					// formatting so they are removed before. 					const { modelId, id, ...documentWithoutModelAndDocumentId } = relevantData.document; 					const docForServer = documentService.formatDates( 						documentWithoutModelAndDocumentId, 						documentModel 					);  					type MyAddDocumentResponse = { 						readonly docRef: string; 					};  					let data: object | undefined;  					if (activity.descriptor.instance === NEW_INSTANCE_IDENTIFIER) { 						// replace with your document persistence code 						const addDocumentRequest: ( 							docForServer: object 						) => Promise<MyAddDocumentResponse> = () => 							Promise.resolve({} as unknown as MyAddDocumentResponse);  						const addDocumentResponse = yield* call(() => addDocumentRequest(docForServer));  						// The instance id returned from the persistence code is 						// set in the document 						data = { document: { ...relevantData.document, id: addDocumentResponse.docRef } }; 					} else { 						// replace with your document modification code 						const modifyDocumentRequest: Promise<void> = Promise.resolve();  						yield* call(() => modifyDocumentRequest);  						data = relevantData; 					}  					if (data !== undefined) { 						// The data is updated in the data source activity 						if (datasourceActivityId !== undefined) { 							yield* put( 								ActivityActions.setData({ 									activityId: datasourceActivityId, 									data 								}) 							); 						}  						// The data is updated in the activity from the data provider configuration 						if (updateActivityData) { 							yield* put(ActivityActions.setData({ activityId, data })); 						} 					}  					// The activity data save operation is finalized by 					// dispatching a respective action from the data provider 					// configuration. This could be e.g. save.done or 					// commit.done from the ActivityActions. 					yield* put( 						saving.done({ 							instance: 								"document" in data && Activity.Data.Document.isInstance(data.document) 									? data.document.id 									: undefined 						}) 					);  					// In case there is some related activity, e.g. parent, 					// which shows the saved document among others, e.g. an 					// overview, this related activity can now be reloaded like 					// this. 					const relatedActivityId = datasourceActivityId ?? activity.initiatingActivityId; 					if (relatedActivityId) { 						yield* put(ActivityActions.reloadData({ activityId: relatedActivityId })); 					} 				} 				break;  			case "delete": 				{ 					const { instanceId } = config.details;  					const childActivity = yield* select( 						ActivitySelectors.childActivityByInstanceId(activity, instanceId) 					);  					const activityInstance = childActivity ? childActivity.descriptor.instance : instanceId;  					// It might be necessary to cancel child activities before 					// the activity data is deleted. 					if (childActivity) { 						yield* put( 							ActivityActions.cancelRequested({ 								activityIds: [childActivity.id] 							}) 						); 						const cancelled = yield* call(ActivitySagas.waitForResponseCancelRequested); 						if (!cancelled) { 							return; 						} 					}  					if (defaultDataHolder.data === undefined) { 						throw new Error(`Cannot handle empty data"`); 					}  					if (activityInstance === undefined) { 						throw new Error("Instance must be set"); 					}  					// replace with your document deletion code 					const deleteDocumentRequest: (docRef: string) => Promise<void> = () => Promise.resolve(); 					yield* call(() => deleteDocumentRequest(activityInstance));  					// It might be necessary to trigger a reload of the activity 					// data to reflect the deleted data state in the ui. 					yield* put(ActivityActions.reloadData({ activityId: activity.id })); 				} 				break;  			default: 				throw new Error("Unknown operation"); 		} 	} };  /**  * Saga to wait until the form model and its referenced document model for the  * form engine activity are loaded by the client.  */ function* waitForModels( 	activity: Activity ): SagaGenerator<[FormModel, Model.DocumentAndValidationModel]> { 	const models = yield* call(() => ModelSagas.waitForModelsLoaded(activity.id));  	const formModel = models.find(isFormModel); 	if (formModel === undefined) { 		throw new Error("Expected a form model to be present."); 	}  	const documentModelReference = formModel.header.modelReferences?.find( 		({ modelType }) => modelType === "document" 	); 	const documentModelAndValidationCode = models.find( 		(model): model is Model.DocumentAndValidationModel => 			model.header.id === documentModelReference?.reference 	); 	if (documentModelAndValidationCode === undefined) { 		throw new Error("Expected to find the referenced document model"); 	}  	return [formModel, documentModelAndValidationCode]; } ``` |
```

#### Custom SelectorMap

|  |  |
| --- | --- |
|  | This API is marked as experimental. Breaking changes **might** happen even in minor releases. |

The `SelectorMap` can be used to customize certain state access of the Form Engine. The Form Engine internally uses a default variant of this map, but you can provide your own implementation containing your customizations as a prop for Form Engine View Component. Then it will be used in place of the default one.

For example, customizing the way the Form Engine selects attachment thumbnails can look like this:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 ``` | ``` import { DefaultSelectorMap, type SelectorMap } from "@com.mgmtp.a12.formengine/formengine-core";  /**  * The default selector looks up thumbnails by id  *  * Here, we use the content property of attachments instead.  * If it does not exist, we fall back to the default selector.  */ export const CustomSelectorMap: SelectorMap = { 	...DefaultSelectorMap, 	attachmentThumbnail(attachment) { 		return state => 			attachment.content?.startsWith("data:image/") 				? attachment.content 				: DefaultSelectorMap.attachmentThumbnail(attachment)(state); 	} }; ``` |
```

Note that it is mandatory to spread the `DefaultSelectorMap` when customizing (similar to `WidgetMap` and `FormModelMap`).

#### Custom RequestSelectorMap

|  |  |
| --- | --- |
|  | This API is marked as experimental. Breaking changes **might** happen even in minor releases. |

The `RequestSelectorMap` can be used to customize the requests of the PlatformDataProvider of the Form Engine. The Form Engine internally uses a default variant of this map, but you can provide your own implementation containing your customizations. Then it will be used in place of the default one.

For example, customizing the way the Data Provider loads a single document can look like this:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 ``` | ``` import { 	DefaultRequestSelectorMap, 	type RequestSelectorMap } from "@com.mgmtp.a12.formengine/formengine-core";  /**  * Here, requests for loading documents are customized with another parameter.  * Instead of reusing the default, you could also create your own.  */ export const CustomRequestSelectorMap: RequestSelectorMap = { 	...DefaultRequestSelectorMap, 	load(config) { 		return state => { 			const defaultRequest = DefaultRequestSelectorMap.load(config)(state); 			return { 				...defaultRequest, 				params: { 					...defaultRequest.params, 					additionalParam: "customValue" 				} 			}; 		}; 	} }; ``` |
```

Note that it is mandatory to spread the `DefaultRequestSelectorMap` when customizing (similar to `WidgetMap` and `FormModelMap`).

This customization approach can also be used in combination with the RequestFilter API (described in the [Data Services documentation](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#json-rpc-modifying-requests)), for example to use your own operation methods.
Customizing the `RequestFilter` alone would not be enough when the method replacement needs some context (e.g. only overriding methods in certain conditions). Using the `RequestSelectorMap` could then be used to provide this context down for the filter to use.

### Accessibility Support

#### Structure

ARIA roles and levels are used to provide a clear and accessible HTML structure of the form.

To make clear that the Form Engine displays a form, its content box has the respective role "form" and an aria-label which will have the localized label of the model.

Titles displayed in the Form Engine have an aria-level and the role "heading".
The aria-level of the Form Engine’s content box title can be defined in the engine configuration. It should reflect the hierarchy level of the Form Engine within the whole application. It is also the base aria-level from which the aria-levels of deeper nested titles are derived.

The structure inside a form is created by the structuring elements of the Form Model like sections or control grids. If labels are defined on those elements, the resulting titles receive an aria-level and the role "heading". The aria-level increases with the nesting level of elements with visible titles. This means also that using such elements just for structuring and not providing a label will not increase the aria-level for further nested elements. Furthermore, to prevent a conflicting parallel structure, no HTML header tags are used for the element titles.

#### Inputs

To make input fields accessible, the labels are connected to the respective inputs via the "for"-attribute.

The labels can be modeled visually hidden, but still readable for screen readers for the following components:

* String Control - single line
* String Control - text area
* Number Control
* Boolean Control
* Confirm Control
* Date Control
* DateTime Control
* Time Control
* Enum Control - compact
* Enum Control - full
* Enum Control - inline
* Enum Control - autocomplete
* Attachment Control
* Inline Repeat:

  + All Controls from above (label is always hidden)

## API Documentation

The API documentation can be found [here](https://geta12.com/docs/2025.06/ext5/form_engine/formengine-documentation-bundle/assets/typedoc/index.html).

## Breaking Change Management

The Form Engine library follows the general [A12 breaking change interpretation](https://geta12.com/docs/overall/breaking_change_management), but has the following exceptions:

* Adding new keys to the localization resource key objects is not considered a breaking change.

  Otherwise, it would not be possible to provide overridable default translations for texts in components introduced with new optional features.

  Compile errors resulting from this should point consumers to missing translations in locales without default translations.
* Adding new mandatory properties to the type DispatchConfiguration is not considered a breaking change, as it is expected that consumers customizing the dispatch configuration always spread the properties of the DispatchConfiguration returned by calling defaultMapDispatchToProps, which would include the new properties.
* Adding new mandatory properties to the types `FormModelMap`, `WidgetMap`, or `SelectorMap` is not considered a breaking change, as it is expected that consumers creating custom maps of these types always first spread the corresponding default map (`DefaultFormModelMap`, `DefaultWidgetMap`, or `DefaultSelectorMap`), which would include the new properties.
* The package `@com.mgmtp.a12.formengine/form-model-generator` is part of the A12 modeling tools and not supported for project use. It does not follow the A12 breaking change management policy.

## Migration Instructions

The following sections contain migration instructions, starting from Form Engine 37.0.0 (2024.06) to the latest version. For the migration from older versions, please refer to the Form Engine documentation of A12 version 2024.06.

|  |  |
| --- | --- |
|  | The complete list of changes for the A12 Form Engine can be found in the [changelog](https://geta12.com/#/releases/releases-overview/form-engine). |

### General Migration

Before starting with the component migration, please have a look at the [Migration to latest A12](https://geta12.com/docs/overall/migration_guide/index.html) chapter about general upgrade steps.

### Form Model Migration

To migrate your Form Models, first install or update the migration tool with

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm install -g @com.mgmtp.a12.formengine/formengine-model-migration ``` |
```

Then run the following command to perform the migration:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` formengine-model-migration <path to form model file> -b ``` |
```

Note that if the given path points to a directory instead, it will be searched recursively for Form Models to migrate. In case you do not have your Form Models under version control, you can set the optional `-b` flag to create backups of your models. Use the `-h` flag to display all available options.

|  |  |
| --- | --- |
|  | It is essential that only valid models are migrated, e.g. models that do not contain consistency problems. Migrating models with problems might lead to undefined behavior. |

### 2025.06-ext2

#### Breaking Changes

##### Content of Events.Attachments.UploadAttachmentsPayload changed

The content of the `UploadAttachmentsPayload` was changed at runtime. The property `formModelElementPath` incorrectly contained a model path to the Document Model element before. This has now been corrected, so that the payload contains a model path to the Form Model element from now on. For simple attachments this is the path to the attachment Control and for multi file upload Repeats this is the path to the Repeat.

If you are listening for this action and your code depends on the value of the `formModelElementPath` property, you need to adapt your code accordingly. The path to the Document Model element is still available in the action payload via the `files` property, where every file contains a document path to the attachment.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` import { Action } from "typescript-fsa";  import { Events } from "@com.mgmtp.a12.formengine/formengine-core/lib/back-end/store/index.js";  function handleAction(action: Action<Events.Attachments.UploadAttachmentsPayload>) { 	// before 	const attachmentModelPath = action.payload.formModelElementPath;  	// after (please note, that this is a document path instead of a model path) 	const attachmentDocumentPath = action.payload.files.at(0)?.attachmentPath;  	// do something with the path }; ``` |
```

#### Deprecation

##### Property formModelRepeatPath of the interface Events.Attachments.UploadAttachmentsPayload

The property `formModelRepeatPath` has been deprecated with Form Engine 38.1.0. This property is only used for multi file uploads. In this case it contains the same information as the property `formModelElementPath` and is therefore redundant.

The property can simply be removed from the payload.

### 2025.06

#### Breaking Changes

##### Integration of Dependencies

The versions of the A12 dependencies have been increased. Please see documentation of the respective components for further migration instructions.

##### UIState Slice Is Now Created On-Demand

Until now, the Form Engine initialized the default DataHolder of a pushed activity with a slice that holds the default UIState. Since this release, the Form Engine reducer will resolve the UIState itself when it doesn’t exist yet.
As a result, this means that when opening a new form, querying the redux state for the UIState slice will return `undefined` (until an action reaches the reducer that will actually set something in there).

In case you have custom reducers that expect the UIState to exist, make sure to handle this case by creating the default UIState yourself like so:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` import { createUIState } from "@com.mgmtp.a12.formengine/formengine-core/lib/back-end/store/index.js";  export const myReducer: ActivityReducers.DataReducer = { 	reduce(dhs, action, defaultDh) {  		// when necessary 		createUIState(/* partial ui state */) 	} }; ``` |
```

##### Typing For EngineStore.SortingState Was Changed

The property `orderPath` of the interface `EngineStore.SortingState` was changed from `string` to `ModelPath`. This change was done to prevent runtime errors due to passing of arbitrary strings (that are not valid ModelPaths).
Additionally, it aligns the typing of the state with the typing of the action that sets it, `Events.Repeat.sortingChange`.

In case you are affected by this change (for example when setting up a custom initial UI state), use the `ModelPath` API to create a valid path like so:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` // old orderPath: "form/model/path/to/sorted/column"  // new import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model";  orderPath: ModelPath.fromString("form/model/path/to/sorted/column") ``` |
```

In case your code already used a `ModelPath` before, and you had to convert it into a `string`, you can remove the conversion entirely.

##### Import For CorrectionModeItem Was Changed

The import for the type `CorrectionModeItem` was changed to resolve a dependency cycle. If necessary, update your import path accordingly:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` // old import { CorrectionModeItem } from "@com.mgmtp.a12.formengine/formengine-core/lib/view/internal/components/form-engine/correction-mode/CorrectionModeItem";  // new import { CorrectionModeItem } from "@com.mgmtp.a12.formengine/formengine-core/lib/back-end/store"; ``` |
```

###### Codemod command

A codemod command is provided to rewrite the affected import statements. Make sure to review the changes after running it.

To run the command, run `npx @com.mgmtp.a12.formengine/formengine-codemod moveCorrectionModeItem <tsConfigDirectory>`.

##### Type-Only Exports Are Now Marked As Such

A12 Form Engine now correctly exports all type-only APIs using the `type` keyword, which can improve bundling. While there is no change in functionality, this may be a breaking change for some of your import statements, depending on how you create type aliases.

Consider the following example:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` import { DispatchConfiguration } from "@com.mgmtp.a12.formengine/formengine-core/lib/view";  // creating a type alias type RepeatConfig = DispatchConfiguration.Repeat;  // different syntax, same result! import RepeatConfig = DispatchConfiguration.Repeat ``` |
```

Using the second syntax (creating a type alias via the `import` keyword) will not work anymore for the following APIs:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` import { DispatchConfiguration, FormModelMap } from "@com.mgmtp.a12.formengine/formengine-core/lib/view"; ``` |
```

To migrate these cases, simply use the first syntax instead (creating a type alias via the `type` keyword).

###### Codemod command

A codemod command is provided to rewrite all affected import statements. Make sure to review the changes after running it.

To run the command, run `npx @com.mgmtp.a12.formengine/formengine-codemod imports <tsConfigDirectory>`.

##### EnableLegacyBooleanHandling Removed

Following its deprecation, the flag `enableLegacyBooleanHandling` was removed without replacement. As a consequence, Boolean values will now use three-value logic (true, false and null). For two-value logic, use Confirms instead.

Please also refer to its [deprecation note](https://geta12.com/docs/2024.06/ext0/FORM_ENGINE/formengine-documentation-bundle/index.html#_boolean_value_handling) for migration instructions.

##### PlatformSingleDocumentDataProvider Uses Query API By Default

The `PlatformSingleDocumentDataProvider` now uses the [Query API of A12 Data Services](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#_query_api) by default. Consequently, the experimental option to enable it was removed. If necessary, simply remove it from your configuration.

##### React 19

We dropped the support for React 18 and older and now require React 19 as our peerDependency. This means you have to perform the React 19 migration, which is described in great detail in the official [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide). They have codemods that should make the transition straightforward.

Additionally, we have decided to not also include a Redux update, to minimize the migration effort. The "react-redux" library does not have React 19 as a peerDependency, but still works fine with it. One solution is to override the dependency in your package.json. You also have to update the corresponding "@types/react-redux" typings to at least 7.1.34.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` { 	"overrides": { 		"react-redux": { 			"react": "^19" 		} 	}, 	"devDependencies": { 		"@types/react-redux": 7.1.34 	} } ``` |
```

##### Drop Java 17 Support

The java libraries of A12 Form Engine are now compiled with and for Java 21.

##### Embedded Attachments API removed

Following its deprecation, the `embeddedAttachmentLoader` (and corresponding localization keys) was removed without a direct replacement. Instead, consider using the `platformAttachmentLoader` or writing your own `AttachmentLoader` implementation.

###### Restoring Embedded Attachments via Customization

|  |  |
| --- | --- |
|  | Embedding attachments in documents directly (e.g. by using base64 encoding) can lead to performance problems (depending on the file size). |

While not recommended, the functionality of embedding attachments into documents can technically be restored by using the new `SelectorMap` customization API of the Form Engine.
Generally, the following steps need to be taken:

* Implement an `AttachmentLoader` that embeds files directly into the document (for example, by encoding files into base64 strings). An example for this can be found in the Devapp of the Form Engine.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` import { formEngineSagas } from "@com.mgmtp.a12.formengine/formengine-core/lib/client-extensions";  const customEmbeddedAttachmentLoader = /* impl here */  // when registering sagas in your application setup formEngineSagas({ 	attachmentLoader: customEmbeddedAttachmentLoader }) ``` |
```

* In your own `SelectorMap`, customize the `attachmentThumbnail` selector to read thumbnails from the attachment itself instead of looking into the state.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 ``` | ``` import { 	DefaultSelectorMap, 	type SelectorMap } from "@com.mgmtp.a12.formengine/formengine-core/lib/view";  // like for the WidgetMap, make sure to always spread the default map! export const CustomSelectorMap: SelectorMap = { 	...DefaultSelectorMap, 	attachmentThumbnail(attachment) { 		return state => 			attachment.content?.startsWith("data:image/") 				? attachment.content 				: undefined; 	} }; ``` |
```

By default, the thumbnail selector assumes that thumbnails for attachments can be queried from the state by their id.
Since we customized the AttachmentLoader to encode the binary data into the attachment group itself (as a data URI inside the content field), we can just extract that field.

Note that only data URIs for images are actually returned to prevent broken image errors (the browser can not display non-image data inside an image tag).

* Customize the FormEngine view component and pass your `SelectorMap` (in the same way as `WidgetMap` or `FormModelMap`).

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` import { FormEngineViews } from "@com.mgmtp.a12.formengine/formengine-core/lib/client-extensions";  const customConfig: Partial<Config> = { 	selectorMap: CustomSelectorMap,  	// WidgetMap, FormModelMap and more... };  function CustomFormEngine(props: View) { 	return ( 		<FormEngineViews.FormEngine {...props} {...customConfig} /> 	); } ``` |
```

##### AttachmentLoader interface changed

Previously, deleting attachments was implemented as "uploading a null file", causing the implementers of the `uploadFiles` method to specifically handle `null` values.
Now, the `AttachmentLoader` interface was changed to better support deletion of attachments. Specifically:

* the `uploadFiles` method does not allow uploading `null` anymore, only `File` objects.
* a new, optional method `deleteFile` method is introduced that can be implemented if necessary.

|  |  |
| --- | --- |
|  | Note that the actual value change in the document is not influenced by implementing the `deleteFile` method! Regardless of whether that method exists or not, deleting an attachment in the Form Engine will **always** trigger a value change that sets an empty attachment object into the document.  Logic implemented in `deleteFile` is only intended for "deletion requests" to a server. |

###### Migration path

The migration effort depends on whether your `AttachmentLoader` implementation needs to handle attachment deletion (e.g. by performing a request).

If not, remove any logic from your `uploadFiles` method that handles `null` values. The Form Engine will only call `uploadFiles` when actually uploading something, so the file parameter will always be a javascript `File` object.
If your `AttachmentLoader` previously handled `null` values in any other way (e.g. performing some request like `/api/delete`), move this logic to the new `deleteFile` method instead.

##### Remove option to customize engineStateSelector in Form Engine middlewares

With Form Engine 37.0.0, we [deprecated](https://geta12.com/docs/2024.06/ext0/FORM_ENGINE/formengine-documentation-bundle/index.html#_enginestateselector_api) the customization of the Form Engine middlewares with a custom engineStateSelector. This API is now removed without replacement as it was broken and became obsolete since the Form Engine now depends on Client. The FormEngineSelectors itself are not deprecated or removed.

##### Remove unused Events.restoreBackup action

This action was removed since it had no effect in the Form Engine. If you dispatched it, check if it was used in sagas, middlewares or reducers on your side and potentially copy the action. If not, it can be removed.

##### Hidden texts changed for Attachment Input

In the past the Attachment input received hidden texts for different parts of the input component. These texts always contained the name of the uploaded file, so that it can be read by the screen reader.

To improve accessibility the text was changed to either

* "Download <File Name>" or
* "Replace <File Name>"

depending on the default action of the input. Furthermore, these texts are now provided via

* the `title` property of the `DefaultFileUpload` widget (if the exposition is set to "File Preview")
* the `title` property of the link in the `DefaultFileUpload` widget (if the exposition is set to "Compact")

In the past they were set on multiple separate properties at the same time. The following table gives an overview of how the properties have changed:

| Widget | Property | Before | After (Exposition: File Preview) | After (Exposition: Compact) |
| --- | --- | --- | --- | --- |
| ResponsiveImageContainer | alt | **<File Name>** | empty string | empty string |
|  | title | **<File Name>** | *not used* | *not used* |
| DefaultFileUpload | placeholderIconTitle | **<File Name>** | *not used* | *not used* |
|  | title | *not used* | **Action hint + <File Name>** | empty string |
|  | fileOptions.linkProps.title | *not used* | *not used* | **Action hint + <File Name>** |

If you are customizing the affected properties of either the `ResponsiveImageContainer` or the `DefaultFileUpload` widget, please check whether your custom implementation needs to be adapted.

##### Migration to ESM

The npm artifacts `@com.mgmtp.a12.formengine/formengine-core`, `@com.mgmtp.a12.formengine/formengine-model-migration` and `@com.mgmtp.a12.formengine/form-model-generator` were migrated from CommonJS to [ESM](https://nodejs.org/api/esm.html#modules-ecmascript-modules). When using Node `22.12+` and modern build tools, there should be no changes necessary to your bundler setup.

Migrating your own application to ESM is not required, but recommended. Consult the documentation of your bundler for specifics.

##### Updating to ES2024

The javascript output of the npm artifacts was updated from `ES2020` to `ES2024` to be able to use latest language features. When using supported browsers, there is no change necessary. If support for older browsers is required, make sure to include necessary polyfills.
