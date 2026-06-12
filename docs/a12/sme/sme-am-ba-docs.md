---
source: https://geta12.com/docs/2025.06/ext5/sme/sme-am-ba-docs/index.html
category: sme
docid: sme-am-ba-docs
scraped: 2026-06-12
---

# Application Modeling

This documentation is intended for a business analyst audience.
Some prior knowledge of the tools is assumed.

|  |  |
| --- | --- |
|  | For modelers using the Preview Application it is recommended to reference the [Master Detail Module Model](https://geta12.com/docs/sme/sme-mdmm-ba-docs/index.html) in the Application Model under [Model References](#AppModelSettingsModelReferences). |

|  |  |
| --- | --- |
|  | Creating a new Workspace using the Preview App Control results in a Workspace with a single Application Model. The order of Modules in the Main Menu of the Application can be easily defined in the Application Model.  The use of multiple Application Models is not fully supported by the Preview Application. There is no possibility to set the order of Modules from different Application Models in the Preview Application.  Applications based on the Project Template do not have this restriction. |

## Introduction and Concepts

The Application Model defines the “macroscopic” UI aspects of an application.
It allows modelers to define which **View** is used to display and edit data of one type.
Commonly this means configuring an A12 Engine with a specific Model as a concrete View.

You can see examples of how the Application Model works by using the Preview App.
There is an Application Frame which contains the Navigation and Content elements.

The Navigation element contains the main menu for switching between Modules.
In the "basic" Sample Workspace, you can navigate to the following Modules:

* Welcome
* Persons
* Companies
* Invoices

Clicking on any of these Modules causes content to be loaded below the Navigation element.
There are two different examples of Engines interpreting a set of Models in the "basic" Workspace:

1. Clicking on the "Welcome" Module

   * A Content Model is interpreted by the Content Engine
2. Clicking on the "Persons", "Companies" or "Invoices" Modules

   * An Overview Model is interpreted by the Overview Engine

The layout that is used to arrange multiple views is also defined in the Application Model.
For example, the "Persons", "Companies" and "Invoices" Modules in the "basic" Workspace display two different views in the MasterDetail layout:

1. Initially, a single View is added when displaying the Overview Model
2. Adding a new Document or clicking on an existing entry in the Overview causes another View to be added to the Master Detail Layout.
   This leads to the Overview and Form Models being displayed side-by-side.

### Default Layouts

The Client provides the following layouts by default which can be used in the Application Model:

* ApplicationFrame
* MasterDetail
* Dashboard
* Stack
* Null

#### Application Frame

This layout is only intended to be used for the root region of the application. It is responsible for rendering a header, a main menu for navigation, an optional sidebar and a content.

#### Master Detail

The Master Detail Layout arranges views side-by-side - there are a maximum of two views visible at the same time.

#### Dashboard

In this layout all views are arranged in tiles which are positioned in rows and columns using the layout settings.

#### Stack

In this layout only one view is visible at a time and views are stacked on top of each other.

#### Null

In this layout all views are rendered without any layout next to each other.

## Basic Editor Functions

The Application Model Editor consists of the two screens "Application" and "Model Settings".

### Application Screen

The Application Model is a heavily nested model.
The Application Model Editor mirrors this structure.
An overview of the nested structure of the Application screen of the Application Model Editor is shown here:

|  |  |
| --- | --- |
|  | The Editor Sections marked in **bold** are edited in a nested section. |

* Region
* Initial Activity
* **Modules**

  + Menu
  + Child Menu
  + **Flows**

    - **Scenes**

      * Match Conditions
      * **Scene Change**

        + Layout Constraints
        + Models
      * **Cases**

        + On Enter
        + On Exit

### Model Settings Screen

#### Name

The Application Model name needs to fulfill certain conventions:
Only letters, digits, hyphens, underscores and periods are allowed.
Furthermore, the name of the model must not start with "xml" and must be at most 100 characters long.

The model name must be unique in the Workspace and it must match its filename.

|  |  |
| --- | --- |
|  | When creating a new Workspace with the Preview App Control, an Application Model is added to the "models" Folder with the name "PreviewApp\_AM". |

#### Version

The version of the Application Model.

#### Description

A description of the model, for example its purpose and editing history.

#### Locales

This field stores a list of locales for the model. Each locale is represented by a row in the table.

#### Labels

The Application Model Labels are shown in the Header of the Preview Application and can be referenced using the relevant header API in the Applications.

#### Roles

The roles that you can assign to your model are taken from a .yaml file in the Workspace.
These roles define which users can view the Application Model in your Application.

If you have created your Workspace using the Preview App Control, this file is in the "user" folder and is called "access-rights.yaml".

If no valid yaml file is visible to the SME, then the drop-down will be blank and the assignment of roles is optional.

#### Annotations

You can apply Annotations to the Application Model so that the resulting application can access those Annotations and use them within the custom implementation.

A list of Annotations as name/value pairs can be modeled.

#### Model References

Model References may be added that allow modelers to reference a Master Detail Module Model.
The references will lead to a new Module with a Master Detail Layout.
The Module will be added after any Modules defined on the Application Screen of the Application Model.

|  |  |
| --- | --- |
|  | References to the Master Detail Module Model are designed to work with the Preview Application.  Such references should not be used in Application Models used with the Project Template. |

|  |  |
| --- | --- |
|  | Modules created by referencing a Master Detail Module Model will not be initially shown in the Preview Application.  These Modules will only be shown after the Workspace is redeployed from the SME. |

Model Type
:   The type of model that is being referenced. The selection "module-masterdetail" creates a new Module with a Master Detail Layout.

Reference
:   The reference to the Model. The selection is filtered so that only Master Detail Module Models in the currently opened Workspace will be offered.

### Refactoring Support

For a general description of the refactoring feature, see the [Refactoring Support](https://geta12.com/docs/SME/sme-ba-docs/index.html#_refactoring_support) documentation. The following tables show what action triggers a refactoring and what properties might be affected.

#### Within the Model

| Action | Affected Properties |
| --- | --- |
| Renaming/Deletion of a (Sub-)Region | Default Region, Scene Change Directives |
| Renaming/Deletion of a Scene | Prior Scene in Different Scenes |
| Renaming/Deletion of Cases | Default Case in the current Scene |

#### Across Models

| Action | Affected Properties |
| --- | --- |
| Renaming of Master Detail Module Model | Model References in the Model Settings |
| Renaming of Form/Overview/Document/Tree/Content Model | Models in Scene Change Directive |

## Editors for Model Elements

### Application Screen

#### Region

Name
:   The Name of this Region.

|  |  |
| --- | --- |
|  | Any value may be entered. The suggestions, APP, CONTENT, SIDEBAR and MODAL, are defaults. |

##### Layout

Name
:   The Name of this Layout.
    The Client provides the following layouts by default and these values may be entered here:

    * ApplicationFrame
    * MasterDetail
    * Dashboard
    * Stack
    * Null

|  |  |
| --- | --- |
|  | Any value may be entered. The suggestions, ApplicationFrame, MasterDetail, Dashboard, Stack, Null, are defaults. |

|  |  |
| --- | --- |
|  | The Region > Layout > Name is equivalent to the Subregion > Layout |

|  |  |
| --- | --- |
|  | The name "ApplicationFrame" is added by default to the PreviewApp\_AM Application Model that is generated when creating a new workspace with the Preview App Control. |

Settings
:   Optional Settings can be added as a JSON object.
    For example:

    `{"<setting key>": "<setting value>", "<boolean setting key>": <true or false>}`

    The ApplicationFrame layout can be configured using the following settings:

    * `disableCollapsingSub`:
      If this option is set to true, then the button to trigger a collapsing and expanding of the sidebar is hidden.
    * `initialSubExpanded`:
      If this property is set to false the sidebar will be initially collapsed.
      If the property is not set or set to true the sidebar will be initially expanded.
    * `initialSubExpandedState`:
      This optional property can either be `minimized` or `maximized`.
      If this property is not set, the sidebar will have a normal size.
      If this property is set to `minimized` the sidebar will have an extended size and if the property is set to `maximized` the sidebar will be maximized over the whole screen.

##### Subregion

Name
:   The name of the Subregion which acts as an identifier and must be unique among siblings.

|  |  |
| --- | --- |
|  | Any value may be entered. The suggestions, APP, CONTENT, SIDEBAR and MODAL, are defaults. |

Layout
:   The Layout for this Subregion.
    The Client provides the following layouts by default:

    * ApplicationFrame
    * MasterDetail
    * Dashboard
    * Stack
    * Null

|  |  |
| --- | --- |
|  | Any value may be entered. The suggestions, ApplicationFrame, MasterDetail, Dashboard, Stack, Null, are defaults. |

Default Region
:   A Default Region may be selected from the Region and Subregions that have already been defined.

|  |  |
| --- | --- |
|  | The Default Region is used in the following areas of the Application Model if no other Region is specified:  * View Add Directives * Region Clear Directives |

#### Initial Activity

The Initial Activity defines what is shown when the user enters the application.
In the installer workspaces, a content page is shown as a landing page.
There, the Initial Activity Descriptor matches a [Scene](#ApplicationModuleFlowScene) in the "Welcome" [Module](#ApplicationModule) with the matching [Activity Descriptor](#ModuleActivityDescriptor).

##### Initial Activity Descriptor

|  |  |
| --- | --- |
|  | The [Activity Descriptor](#ModuleActivityDescriptor) defined for the Module is expressed as key-value pairs. |

Key
:   The Key is used to describe the variable name used in the Activity Descriptor.

|  |  |
| --- | --- |
|  | Any value may be entered. The suggestions, instance, model, module, engine and menuEntry, are commonly used values or defaults. |

Value
:   The Value sets the value that is expected for the given Key.

Skip data loading
:   The Initial Activity specified by the Initial Activity Descriptor loads data by default.
    If this is not required or wanted, set this option.
    This setting is ignored if no Initial Activity Descriptor is set.

### Modules

[Application](#ApplicationScreenEditor) >
Modules

A Module is a functional domain of the application.
A Module may be represented in the application by a "Main Menu Entry" that will trigger a [Flow](#ApplicationModuleFlow) when the user clicks on it.

Name
:   The name of the Module which acts as an identifier and must be unique among siblings.
    Note that there can be various Modules with different content which express the same behavior.

#### Menu

Name
:   The Name of this Menu.
    Leave empty, if the Module should not have a Menu Entry in the Navigation element.
    Additional menu data like the Activity Descriptor, Child Menus and Roles are not saved in that case.

Activity Descriptor
:   The Activity Descriptor specifies which Activity gets started when the Menu Entry is selected.
    Leave empty, if the menu item should not start an Activity.

|  |  |
| --- | --- |
|  | Ignored if no Menu Name is specified. |

Skip data Loading
:   The initial activity specified by the descriptor loads data by default.
    If this is not required or wanted, set this option.

|  |  |
| --- | --- |
|  | Ignored if no Activity Descriptor is set. |

Label
:   The Label shown for the Menu Entry.
    This Label can be entered for each locale that has been set up for the Application Model.

|  |  |
| --- | --- |
|  | Ignored if no Menu Name is specified. |

Roles
:   The roles that you can assign to each Menu (or Child Menu) are taken from a .yaml file in the Workspace.
    These roles define which users can view this Menu (or Child Menu) in your Application.

    If no valid yaml file is visible to the SME, then the drop-down will be blank and the assignment of roles is optional.

    If no roles are defined, then by default all users may view this Menu (or Child Menu).

#### Child Menu

Adding Child Menus will create a Flyout Menu by default.
The Child Menus have similar settings to Module Menus.
Check the [Menu](#ModuleMenu) section of the Module documentation for more details on these settings.

### Flows

[Application](#ApplicationScreenEditor) >
[Modules](#ApplicationModule) >
Flows

A Flow is a UI interaction bracket which divides the user interaction into discrete parts.
These parts are described by [Scenes](#ApplicationModuleFlowScene) in the Flow.

Name
:   The Name of the Flow which acts as an identifier and must be unique among siblings.

### Scenes

[Application](#ApplicationScreenEditor) >
[Modules](#ApplicationModule) >
[Flows](#ApplicationModuleFlow) >
Scenes

Scenes represent a specific UI.
The Match Conditions describe when this Scene should be displayed.
When these conditions are met, the appropriate [Scene Change](#ApplicationModuleFlowSceneSceneChange) is carried out and the UI is reconfigured.

Name
:   The Name of the Scene which acts as an identifier and must be unique among siblings.
    Note that the name is not responsible for deciding which Scene gets active at runtime.

Description
:   This is used to provide a detailed description.
    Currently, it is only used for documentation purposes.

Prior Scene
:   The Name of the Scene that must have been shown directly before this Scene.
    This setting acts like an additional Match Condition when evaluating whether this Scene is selected or not.

    As a result, this Scene is only active if its Match Conditions evaluate to true for the Descriptor of the current Activity and the Prior Scene matches the Scene from which this Scene was initiated, for example via a button or row click.

    In other, more technical, words, a scene with a defined Prior Scene can only be active, if the following 3 conditions are met:

    1. It’s Match Conditions match an Activity
    2. That Activity is linked to a Prior Activity with the initiatingActivityId property
    3. The Prior Scene’s Match Conditions match that Prior Activity.

Default Case
:   Name of a Case that should be treated as default.

#### Match Conditions

Key
:   The Key defines the property to be evaluated in the Match Condition.

|  |  |
| --- | --- |
|  | Any value may be entered. The suggestions, instance, model, module, engine and menuEntry, are commonly used values or defaults. |

Must Equal
:   The property defined by the Key must equal a (constant) value specified here.

|  |  |
| --- | --- |
|  | Any value may be entered. If the key 'model' is set, a model name must be entered. However, the input is not treated as a model reference selection, so later changes to the model name will not be automatically refactored. |

Is Set
:   The property defined by the Key must be set.

### Scene Change

[Application](#ApplicationScreenEditor) >
[Modules](#ApplicationModule) >
[Flows](#ApplicationModuleFlow) >
Scenes

The Scene Change contains the directives that should be executed either:

* When the scene is entered
* When leaving the scene.

|  |  |
| --- | --- |
|  | Leaving a scene does not mean "when the Activity goes away", but rather "when it and another Scene (following the current Scene) is active" |

#### On Enter / On Exit

[Application](#ApplicationScreenEditor) >
[Modules](#ApplicationModule) >
[Flows](#ApplicationModuleFlow) >
[Scenes](#ApplicationModuleFlowSceneSceneChange) >
On Enter / On Exit

Type
:   Selection between "REGION\_CLEAR" and "VIEW\_ADD"

| Type | Meaning |
| --- | --- |
| REGION\_CLEAR | Clears all previous Views from a Region.  May be used to select a new Layout for the Region. |
| VIEW\_ADD | Adds a view to a certain Region using the current Layout.  Views are always added to the end of the View list of the Region. |

Region
:   Defines to which Region the view should be added.
    You may select from the list of Regions provided on the [Application Screen](#ApplicationScreenEditor).
    If this selection is blank, the Default Region as defined on the [Application Screen](#ApplicationScreenEditor) is used.

##### "REGION\_CLEAR" selected

Name
:   Sets the Layout for the Region.

|  |  |
| --- | --- |
|  | Any value may be entered. The suggestions, ApplicationFrame, MasterDetail, Dashboard, Stack, Null, are defaults. |

Settings
:   Settings may be used to further define the Layout.
    For example, defining the rows and columns for a dashboard Layout.

    Example for a Dashboard Layout

    ```
    {
      "rows": [
        {
          "columns": [
            {
              "width": { "sm": 3, "md": 4, "lg": 9 }
            },
            {
              "width": { "sm": 1, "md": 2, "lg": 3 },
              "rows": [
                {
                  "columns": [
                    {
                      "width": { "sm": 4, "md": 6, "lg": 12 }
                    }
                  ]
                },
                {
                  "columns": [
                    {
                      "width": { "sm": 4, "md": 6, "lg": 12 }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
    ```

    The above example results in a dashboard like this when lg space is available:

    ```
    |------------|
    |        |   |
    |        |---|
    |        |   |
    |------------|
    ```

##### "VIEW\_ADD" selected

Name
:   It specifies the UI component by name that is to be shown in the respective View.
    The Name is resolved during View rendering by looking for a match among the UI components registered in the application code.

|  |  |
| --- | --- |
|  | Any value may be entered. The suggestions, OverviewEngine, FormEngine, TreeEngine, GenericCaseMenu, are defaults. |

Configuration
:   Contains optional configuration for the View that was chosen.

Load Data
:   This flag may be used to load data without having any A12 Models.

Constraints Type
:   A Constraints Type, "MasterDetail" may be specified.

    Selecting "MasterDetail" will hide the Constraints and display the Preferred Width to allow a simplified definition of Constraints for the Master Detail Layout.

Constraints
:   Contains configurable constraints for the layout that was chosen.

Preferred Width
:   This setting is shown in combination with the Constraint Type "MasterDetail".

    This is for defining the preferred display width of an added view in the Master Detail Layout.
    This can be a number from 1 to 11.
    If left empty, the available space is equally shared between the master and detail view which is equivalent to Preferred Width = 6.

###### Models

A12 Models may be specified which will define which type of data can be loaded and / or which UI Model should be used for this View.

Model Type
:   The Model Type is specified from the list of Model Types:

    * Form
    * Overview
    * Document
    * Tree

Name
:   The Model Name is selected based on the List of Models in the current Workspace with the matching Model Type.

Document Model
:   The relevant Document Model may be specified for Model Type = "Form" or "Tree".

    |  |  |
    | --- | --- |
    |  | The Document Model should be set in the "VIEW\_ADD" Scene Change in the case of Heterogeneity. This allows the detailed specification of the (subType) Document Model that determines that the UI Model specified in the "Name" column should be used. |

### Cases

[Application](#ApplicationScreenEditor) >
[Modules](#ApplicationModule) >
[Flows](#ApplicationModuleFlow) >
[Scenes](#ApplicationModuleFlowSceneSceneChange) >
Cases

The Case describes the directives that should be carried out when a case is met.

Name
:   The Name of the Case which acts as an identifier and must be unique among siblings.

Label
:   A label which is typically shown in the sidebar menu.
    This Label can be entered for each locale that has been set up for the Application Model.

#### On Enter

[Application](#ApplicationScreenEditor) >
[Modules](#ApplicationModule) >
[Flows](#ApplicationModuleFlow) >
[Scenes](#ApplicationModuleFlowSceneSceneChange) >
[Cases](#ApplicationModuleFlowSceneCase) >
On Enter

The settings for Cases On Enter are the same as those used for Scene Change On Enter.
Please check the [On Enter](#ApplicationModuleFlowSceneSceneChangeOnEnter) documentation for Scene Changes for more details.

Note that there is no On Exit directive for Cases as they are mutually exclusive and cannot have a "relationship" between them.
The condition for On Exit (which would be "another Case (following the current Case) is active" here) is therefore never satisfiable.

## Glossary

| Term | Description |
| --- | --- |
| Activity | An activity can be seen as a bracket around user interactions, other terms for this concept are "use-case" (taken from requirement engineering) and "transaction" (as used in databases and back-end systems). Typical use-cases are:  * Overview: showing a list of business objects as a result of a search.   Typical user interactions are: scrolling/paging, sorting, filtering, refining search criteria. * Editing a business object like using a form. |
| Application Frame | The A12 UI/UX team has defined a specific structure for the Plasma design that is called Application Frame. It consists of four distinguished elements:  * Application Header * Navigation * Context (Sidebar) * Content |
| Application Header | Application Header displays, for example, a company logo, the selected locale, and the user and role information. |
| Case | Cases can be used to allow different detail views of the same data, e.g. Forms showing different parts of a Document. By default, a sub navigation is added in the Sidebar Region to allow the user to switch between these Views. |
| Content Element | Content or Content Elements show, for example, the Engines in specific layouts, e.g., a Master Detail Layout in the Application Frame. |
| Context (Sidebar) | The Context or Sidebar displays additional information, context-related actions, and allows for sub navigation in the Application Frame, e.g. switching between cases. |
| Directives | Directives are executed when a Scene or Case is entered or left. These Directives lead to changes in the Layout of a Region and the Views shown within it. |
| Engine | An Engine is a run-time component that interprets a UI Model. |
| Flow | A UI interaction bracket, i.e. it divides the user interaction into discrete parts. Think of it as a micro-workflow on the client side. A Flow contains usually many Scenes that are handled by Activities and are connections between these Activities and the View assignments in Regions. |
| Layout | A Layout manages multiple Views. Layout Rules can be used to allow alternative Layouts to be offered based on, for example, the available screen space. |
| Master Detail Layout | The Master Detail Layout is a specific UI solution to enable users getting an overview and working with a large set of business objects. |
| Menu Entry | A Menu Entry is shown in the Navigation Element of the Application Frame. |
| Module | A Module is a high level building block of the application and directly accessible via the main menu. It consists mainly of:  * Menu Entry (optional) * Flows with Scenes |
| Navigation Element | Navigation or Navigation Elements are shown the main menu in the Application Frame. |
| Region | The Application Model defines a tree of Regions and each Region has an assigned Layout.  There is always one top-level Region in the Application Model.  If it has the ApplicationFrame layout then it resembles the classical application frame with the content and sidebar regions. |
| Scene | A Scene represents a single, specific UI configuration. |
| View | A View is an identifiable Content part.  For example, two Views are shown side-by-side in a Master Detail Layout. One View shows the overview of documents. The Other View shows a single document. |

## Refactoring

The Simple Model Editor supports automatic refactoring for Application Models.
When you rename or delete elements that are referenced elsewhere, the tool identifies affected references and presents options for updating them.

For detailed information about refactoring capabilities, workflow, and actions, refer to the [Refactoring Support](https://geta12.com/docs/sme/sme-ba-docs/index.html#refactoring_support) section in the SME Tool Documentation.

### Model-Specific Refactoring

Refactoring handles references within Application Models when regions, scenes, or model references are modified.
The following elements and reference types are supported:

#### Supported Operations

Refactoring supports the following operations:

* Renaming or deleting regions
* Modifying scene references
* Updating UI model references in view descriptors
* Updating Document Model references

#### Reference Types

The following reference types are tracked and updated during refactoring:

| Reference Type | Description |
| --- | --- |
| Region References | References to regions in default region settings and scene entry/exit directives. Regions are displayed hierarchically with breadcrumb-style paths. |
| Scene References | References to prior scenes within scene transitions. A scene cannot reference itself. |
| Case References | References to default cases within scenes. Cases are collected across all modules, flows, and scenes. |
| UI Model References | References to Form Models, Overview Models, and other UI models in view descriptors. The available models are filtered based on the model type specified in the descriptor. |
| Document Model References | References to Document Models and Combination Models in view configuration. |
| Model Header References | External model references declared in the Application Model header. |

#### Example: Deleting a Region

Consider an Application Model with:

* A region named `TestRegion`
* The default region set to `TestRegion`
* A scene with an `onEnter` directive targeting `TestRegion`

When you delete `TestRegion`:

1. Save the Application Model.
2. The refactoring dialog displays the affected references:

   * Default region reference
   * Scene directive region reference
3. Choose one of the following actions for each reference:

   * **Commit**: Clear the reference.
   * **Edit**: Select a different region.
   * **Ignore**: Keep the deleted region reference (results in invalid state).
4. The model saves with your selected changes applied.

#### Example: Renaming a Region

When you rename a region:

1. Save the Application Model.
2. The refactoring dialog displays all references to the renamed region.
3. Choose one of the following actions:

   * **Commit**: Update the reference to the new region name.
   * **Edit**: Select a different region.
   * **Ignore**: Keep the old region name (results in invalid state).
4. The model saves with your selected changes applied.

#### Cross-Model References

Application Models reference external models including:

* Form Models for view descriptors
* Overview Models for list views
* Tree Models for hierarchical views
* Document Models for data binding

When you rename an external model that is referenced, the refactoring system updates:

* View descriptor model names
* Document Model references in view configuration
* Model references declared in the header

For information about enabling or disabling refactoring, see [Enabling Within-Model Refactoring](https://geta12.com/docs/sme/sme-ba-docs/index.html#enabling_refactoring) in the SME Tool Documentation.
