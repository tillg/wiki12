---
source: https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/index.html
category: sme
docid: sme-cmm-ba-docs
scraped: 2026-06-12
---

# Creating an A12 Document by Using a Combination Model

This documentation is intended for a business analyst audience.

|  |  |
| --- | --- |
|  | The Combination feature, the models and the editors are an experimental feature. It must be enabled in the SME Tool Settings before use; see [Enabling Experimental Module Types](https://geta12.com/docs/sme/sme-ba-docs/index.html#enabling_experimental_modules). |

## Introduction and Concepts

The Combination Model Editor is part of the Simple Model Editor (SME) and enables domain experts and analysts to create and modify Combination Models for business applications.
The Combination Model defines how an existing Base Document Model is altered by adding, decorating or selecting Document Model Elements to create a new A12 Document Model.
The Combination, in form of its resulting Document Model, can be used like any other Document Model in the SME: to build a Form or Overview Model, to define a Mapping Model or to be used as Base Model in another Combination Model.
In the SME and this documentation, the Combination Model and the resulting Combined Document Model are used synonymously.
For Modelers, these are just the two sides of the same coin.

### Example Use Cases

The Combination Model can be used to manage business logic in one place and reuse it in different domains.
It can be compared with Type Definitions and Includes.
Take the following example Document Models:

![introduction 01](https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/assets/introduction_01.png)

Figure 1. Example Document Models CustomerIndividual\_DM and CustomerCompany\_DM

The four address blocks are equal.
Moreover, the Fields *Country*, *BornIn* and *RegisteredIn* should allow the end user to select a country from a predefined list.
If the list of countries is to be modified later, we want to do this only once in our application.
Otherwise, this could lead to inconsistencies, let alone that it would be tedious.
This is why A12 allows you to extract common Type Definitions into a single model and provide a single source of truth.
Equally, entire structures of Fields and Rules can be reused in the form of Includes.

![introduction 02](https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/assets/introduction_02.png)

Figure 2. Centralizing Business Logic into Type Definitions, Includes and Additive Document Models

On the left-hand side of [Figure 2](#fig:combination_usecases2) the common part of CustomerIndividual\_DM and CustomerCompany\_DM are extracted into a Type Definition and a Document Model.
These can then be referenced as Includes in the domain models.

On the right-hand side of [Figure 2](#fig:combination_usecases2) the common Rule *ShippingRestrictions* of CustomerIndividual\_DM and CustomerCompany\_DM is extracted into an Additive Document Model.

This Additive Document Model can then be used in different Combinations.
The Combination can be compared to the canvas-and-layers-approach of graphic and photo editors (see [Figure 3](#fig:combination_usecases3)):
The Base Document Model acts as the canvas.
Different Additive Document Models can be placed on top of this canvas.
They have a transparent background, so for the Additive Document Model, the canvas (the Base Document Model), is visible and the elements therein can be referenced in the Additive Document Model.

![introduction 03](https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/assets/introduction_03.png)

Figure 3. Combinations Sketched as Stack of Layers

To describe the Combination Modeling, the following terms are used:

Base Document Model
:   A Document Model or a different Combined Document Model, that is the basis on which the Combination Steps act.

Combination Step
:   Combination Steps can be of type Addition, Selection, Decoration For Fields or Decoration For Groups.
    An Addition adds a set of further elements once onto the Reference Model.
    Selection allows you to remove elements from the Reference Model.
    Decoration adds a set of further elements in a regular manner multiple times to the Reference Model.

Reference Model
:   In the Additive Document Model editor, a Reference Model is shown as read-only elements.
    In the Selection Model Editor, the Reference Model is shown as the model tree with checkboxes.
    In the first Combination Step, the Base Document Model is the Reference Model.
    In the second Combination Step, the result of the first Combination Step is the Reference Model.
    And so on.

Context Model
:   Because the Additive Document Model and the Selection Model reference elements of the Reference Model, the Additive Document Model and the Selection Model cannot be edited on their own.
    To open their editor, a Reference Model is needed.
    This Reference Model is determined by the previous Combination Steps.
    The Combination Model thus provides the context for editing these models.
    Any Combination Model that has the Additive Document Model or the Selection Model in any of its Combination Steps can be the Context Model.
    If more than one Combination Model exists in the Workspace that references to be opened Selection or Additive Document Model, then a dialog is shown that lists all the possible Context Models.

### Comparison of Includes and Additive Document Models

#### Includes

1. Includes are self-contained, valid units of Groups, Fields and Rules.
2. Rules can only reference Fields that are within the Include.
3. Includes can be placed in different structural contexts with different repeatabilities into the same Host model.
4. The absolute paths and the Repeatability of the Fields defined in the to-be-included Document Model depend on the structure of the Host Document Model.

#### Additive Document Models

1. Additive Document Models can contain Rules that reference Fields not contained in the model and might thus not be valid on their own.
2. Rules can reference any Field of the Reference Model.
3. Additive Document Models are added as a single layer above a Reference Model.
   If Fields of the Reference Model are referenced, they must be at the same absolute path in all the Reference Models to which the Additive Document Model is added.
4. Fields defined in an Additive Document Model will always be present at the same absolute path in all Combinations where the Additive Document Model is used.

#### Comparison

When comparing the elements in [Figure 2](#fig:combination_usecases2), you can see:

1. Address\_DM is a stand-alone and valid Document Model.
   If you click the Validate All button of the SME Workspace Explorer, it will be validated and potential errors reported.

   ShippingRules\_AdM is not a valid Document Model, because the Rule *ShippingRestrictions* references the Fields *IsVIPCustomer* and *ShippingAddress/Country* which are not contained in ShippingRules\_AdM.
   Consequently, Additive Document Models are not validated with the Validate All button of the SME Workspace Explorer.
   They cannot be opened on their own but need a Context Model.
2. The Rule *CorrectCodePattern* defined in Address\_DM can only reference the Fields of the Document Model.
   Rule *ShippingRestrictions* cannot be moved alone into an Include, as the to-be-included Document Model would not "see" the needed Fields of the Host model.
3. Address\_DM is included twice in both models CustomerIndividual\_DM and CustomerCompany\_DM.
   In CustomerCompany\_DM it is included with different Repeatabilities.
   Although defined only once, the Rule *CorrectCodePattern* exists twice in CustomerCompany\_DM and could have different semantics.
   On the contrary, *ShippingRestriction* can never be added more than once to a Base Model.

#### How to Decide on an Approach

Includes and Additive Document Models are two different strategies to centralize business logic.
Key questions to decide for an approach are (fragment = Document Model elements that are reused in Include or Additive Document Model):

1. Is the fragment used stand-alone to create documents in the database or show forms of them? If so, Includes must be used.
2. Is there a Rule in the fragment, that references a Field outside the fragment? If so, Additive Document Modeling must be used.
3. Will the fragment be used multiple times in one Host model or with different Repeatabilities? If so, Includes must be used.

Many business requirements can be solved with either approach.
Technical requirements, model structure clearness or modeling preferences might give the final decision.

You could restructure the Document Models in [Figure 2](#fig:combination_usecases2) to allow you to encapsulate the needed Fields together with the Rule *ShippingRestriction* into one Document Model and then include this into the two models CustomerIndividual\_DM and CustomerCompany\_DM.
But if the number of parallel types grows (CustomerCompanySE\_DM, CustomerCompanyNonEU\_DM, CustomerCompany\_ASEAN\_DM, …​) and more and differently applied Rules are added, the Additive Modeling Approach will be much clearer.

If a set of Fields and Rules is only to be added once to a Document Model, it would be possible to add those as an Include or an Additive Document Model.
This could limit modeling flexibility, because the Fields would always have the same path.
If for example the *BillingAddress* would be modeled as an Additive Document Model, it would not be possible to rename the structure to *MainOffice* in CustomerCompany\_DM.
However, this loss in flexibility might also be an advantage, as it would keep the two models CustomerCompany\_DM and CustomerIndividual\_DM alike. Modeling mistakes are then less likely.

And of course: It is possible to use Includes in Additive Document Models and to Include Combined Document Models.

### Model Prerequisites

There are some general aspects to consider for the models that are used in the Combination:

1. Locales should be consistent within the set of models.
2. Currently only local Type Definitions are supported. Either in the respective model or via an Include. The use of Type Definition Models is currently not supported.

## Installation

The Combination Model Editor is part of the Simple Model Editor. For advice on the installation of the Simple Model Editor, refer to the "Quick Start Guide" on getA12 under "Modeling".

### Migrating Existing Models to a New Version of the Tools

It might be necessary to migrate existing Combination Models in case a new version of the Simple Model Editor and thus Combination Model Editor has been installed.

In most cases, the Simple Model Editor can handle updating versions itself. For more information, refer to the documentation of the Simple Model Editor.

## Editor Functions

### Open the Combined Document Model Editor

To access the Combined Document Model Editor, open a Workspace in the Simple Model Editor (SME).
All models that are contained in it are displayed in the Workspace Explorer of the SME.
Combined Document Models will be recognized as such by the SME, the respective icon "Cm" will be displayed next to them.

![workspace explorer](https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/assets/workspace_explorer.png)

Figure 4. SME Workspace Explorer containing Combined Document Models, among others

To open the Combined Document Model Editor for an existing model, click on the entry in the Workspace Explorer.

To create a new Combined Document Model, use the "ADD" button in the header of the Workspace Explorer or in the context menu of a folder and select "Combined Document Model".

![add combination model](https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/assets/add-combination-model.png)

Figure 5. Add a New Combined Document Model

A modal will then be displayed to define the most important model settings: **Folder** and **Name**.

![add combination model modal](https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/assets/add-combination-model-modal.png)

Figure 6. Enter Initial Model Settings for New Combined Document Model

The **Name** of the model must be unique in the Workspace.

The same Locales as in the Base Model should be added here.
They will be prefilled when selecting a Base Model from the dropdown.

### Combination Model Contents

The Combination Model Editor can be seen in [Figure 7](#fig:combination-model-content).

![combination model content](https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/assets/combination-model-content.png)

Figure 7. Combination Model Editor - Combination Screen

#### Combination

The Combination Screen contains the following elements:

Base Document Model
:   Select a (Combined or Transformed) Document Model from the dropdown list.
    The first Combination Step will act on this model.
    It is used as Reference Model in the editor of the first Combination Step.

Combination Steps
:   A list of up to 99 steps determining the composition of the Combined Document Model.
    Use the ADD button to add a new entry.
    The entries can be reordered or deleted.

    Type
    :   Combination Steps can be of type Addition, Selection, Decoration For Fields, or Decoration For Groups.
        An Addition adds a set of further elements once onto the Reference Model.
        Selection allows you to remove elements from the Reference Model.
        Decoration adds a set of further elements in a regular manner multiple times to the Reference Model.

    Addition
    :   A mandatory Field for Combination Steps of type Addition.
        Select an Additive Document Model from the dropdown or add a new model to the workspace.
        Clicking the Pen button opens the [Editor for the Additive Document Model](#txt:additivemodel:editor).
        The Reference Model shown in this editor is the Base Model with all previous Combination Steps applied.

    Selection
    :   A mandatory Field for Combination Steps of type Selection, Decoration For Fields, or Decoration For Groups.
        Select a Selection Model from the dropdown or add a new model to the workspace.
        Clicking the Pen button opens the [Editor for the Selection Model](#txt:selectionmodel:editor).
        The Reference Model shown in this editor is the Base Model with all previous Combination Steps applied.

    Decoration
    :   A mandatory Field for Combination Steps of type Decoration For Fields or Decoration For Groups.
        More information about the Decoration process can be found [here](#txt:decoration:mechanism).

        Select a Document Model from the dropdown or add a new model to the workspace.
        Clicking the Pen button opens the regular Document Model editor.
        The following rules are not enforced within the opened Document Model editor but only on return to the Combination Model Editor or when selecting a Document Model:

        * Decoration For Field: the Document Model must contain exactly one Root Group with a Field named 'Field' (the Anchor Field).
          Siblings of this Field must have the string 'Field' in their name.
        * Decoration For Group: the Document Model must contain exactly one Root Group with an empty sub-Group named 'Group' (the Anchor Group).
          Siblings of this Group must have the string 'Group' in their name.

    Validate
    :   The button with the two checkmarks allows you to validate all Combination Steps up to the result of the current Combination Step.
        It allows you to find modeling errors in complex modeling scenarios.

#### Settings

The Settings Screen contains the following elements:

Name
:   The name of the Combined Document Model.
    It needs to fulfill certain conventions: Only letters, digits, hyphens, underscores and periods are allowed.
    Furthermore, the name of the model must not start with "xml" and must be at most 100 characters long.

    The model name must be unique within the Workspace and is synchronized with the filename by the editor.

Model Version
:   Shows the version of the opened model.

Description
:   Multiline text to give more information about the Combined Document Model.

Locales
:   A list of locales supported by the model. Each locale is represented by a row in the table.
    At least one locale must be entered.
    Note that only locale codes according to ISO 639 alpha-2 or alpha-3 are allowed. It is possible to add a region code after an underline, such as de\_DE, de\_CH and so on.
    The listed Locales will be the Locales of the Combined Document Model.

Labels
:   These fields store a list of labels for the model, one for each specified locale.

    The labels can be used as a localizable representation of the model itself in a list of different models. For example, in a model repository. The label will also be used in the variant selection modal for example, when using the A12 feature "Heterogeneity".

    The listed Labels will be the Labels of the Combined Document Model.

Roles
:   A list of Roles can be maintained in this table.
    The listed Roles will be the Roles of the Combined Document Model.

Annotations
:   An Annotation is a name-value pair that can be added to the model.
    The application that uses the Combined Document Model can access those Annotations and can use them within custom implementations.
    It is possible to add new Annotations, but Annotations that exist after the last Combination Step cannot be overwritten with a differing value.

### Validation

Upon opening or saving a Combination Model, a Validation of the resulting Combined Document Model is done.

|  |  |
| --- | --- |
|  | Only the result of the last Combination Step must be valid. It might be the case, that previous Combination Steps lead to invalid Document Models and an error is shown in the respective sub-editors for the Combination Steps.  For example: In one Combination Step a Field is added. This Field is used in a second Combination Step as the Error Field of a Validation Rule.  If the Combination Steps are (accidentally) swapped, the result of the then first Combination Step would be invalid, as there would be a Validation Rule in the resulting Document Model, that references a non-existing Field. This Field would only be added in the then second Combination Step. Validating the then first Combination Step would lead to an error, while the whole Combined Document Model is valid. |

## Editor for the Additive Document Model

The Additive Document Model editor needs a Context Model to support the editing.
Combination and Mapping Models can act as Context Models.

If the Additive Document Model is referenced in a Combination Model in one of the Combination Steps, then the editor can be opened by clicking the Edit button next to the Additive Document Model dropdown.
The Additive Document Model editor will show the resulting Combined Document Model up to the previous Combination Step (or the Base Document Model) as the **Reference Document Model**.

If the Additive Document Model is referenced in a Mapping Model as the Precomputation Model, then the editor can be opened by clicking the Edit button next to the Precomputation Model dropdown.
The joined Target and Source Models, as defined in the Mapping Model, are shown as the **Reference Document Model**.

The Additive Document Model editor shows the result of the Addition to the Reference Document Model, however, only the altered or additional model elements are persisted in the Additive Document Model.

### Addition Mechanism

The Addition process starts with the Reference Document Model.
Its elements and model settings are the basis for the resulting Document Model.
New elements like Fields, Groups and Rules can be freely added to it.

In order to integrate these new elements at the correct place into the existing Reference Document Model structure, it is possible to transfer the respective part of the Group structure of the Reference Document Model into the Additive Document Model.
If the Additive Document Model is added to a Reference Document Model, where these Groups are present (like the one used to create the Additive Document Model), the respective Group is shown as **overwritten** and has the properties as defined in the Reference Document Model.
If the Additive Document Model is added to a Reference Document Model that does not contain the respective Groups, then they appear as any other new **additive** Model elements and the properties as defined in the Additive Document Model are used.
The most important of these properties is the Repeatability.
If the same Additive Document Model is used in different contexts, then one should take extra care when changing the Repeatability of Groups in the Reference Document Model.

#### Properties of Overwritten Elements

In order to guarantee that Documents of the Reference Document Model are formally valid also in the resulting Combined Document Model, it is **not possible to change**:

1. the existence of Groups
2. the Repeatability of Groups
3. the existence of Fields
4. the Field Type Definition of Fields

   1. the connection to a Type Definition
   2. the Field Type (String, Number, …​)
   3. the Type Configuration (for example: String Pattern, String Maximal Length, Number Minimal Value)
   4. the Requiredness of Fields

However, it is **possible to change**:

1. Validation Rules
2. Computation Rules

| Element Type | Property | Taken From |
| --- | --- | --- |
| Group | Repeatability | Reference Model |
| Field | Field Type Configuration | Reference Model |
| Validation Rule | Rule Condition | Additive Model |
| Validation Rule | Rule Error Field | Additive Model |
| Validation Rule | Rule Message | Additive Model |
| Validation Rule | Rule Condition | Additive Model |
| Computation Rule | Computed Field | Additive Model |
| Computation Rule | Computation Alternatives | Additive Model |

#### Order of Elements

By default, **additive** elements are added at the end of the parent Group.
However, if an element is overwritten by the Additive Document Model, this element can serve as an Anchor for other elements of the Additive Document Model.
When an element is overwritten, it is possible to drag and drop other elements above it.

There is modeling support in the SME to add Groups as Anchor elements to the Additive Document Model. But due to the different overwriting semantics (see above), no such support exists for Fields or Rules.

When the elements of the Additive Document Model are added to the Reference, the mechanism goes through the list of root-Groups/children of the Group until it finds an element with the same name in the Reference Document Model.
If an element is found, all previous additive elements are added in their order directly above the overwritten element.
The mechanism then searches for the next matching element in the Reference Document Model and adds all intermittent elements directly above the overwritten element.

### Sidebar

In the sidebar of the Additive Document Model Editor, the name of the Additive Document Model is displayed at the top.
Next to it, the icon for the Context Model is shown.
On hover, the name and Description of the Context Model is shown.

Four menus can be accessed:

* Model Tree
* Settings
* Type Definitions
* Rule Contradictions

Below the menus, the following buttons are available:

* Cancel
* Save

The menus as well as saving a model will be described in the subsequent chapters.

### Model Tree

The *Model Tree* is the central editor component for the design of Additive Document Models. Here, the altered or additional elements such as Groups, Fields and Rules can be added, edited, deleted and viewed.

![model tree](https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/assets/cmeditor/model-tree.png)

Figure 8. Model Tree and Field Editor of the Document Modeling Module

The elements show the following background colors:

* grey: Element of the **Reference Document Model** (Info on mouse over reads "reference").
* green: Element that exists in the Reference Document Model and the Additive Document Model. Some of its properties can be **overwritten** with the Additive Document Model (Info on mouse over reads "overwritten").
* none: Element that is defined in the Additive Document Model only. (Info on mouse over reads "additive").

Each element represents a *node* in the Model Tree.
They are all placed below a *virtual Model Tree node*.
The node actions of the virtual Model Tree node allow you to add and paste elements on root level of the model. The virtual Model Tree node will not be saved to the model file.

![model tree node](https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/assets/cmeditor/model-tree-node.png)

Figure 9. Virtual Model Tree Node and Actions Available on Model Root Level

#### Element Editors

To open a node in the tree, click on it using the left mouse button. Then, its corresponding Element Editor is opened on the right.
Refer to [Editors for Model Elements](#txt:additive:detail-dialogs) for additional documentation on the different Element Editors.

In the bottom right of each Element Editor, buttons to apply the changes to the element ("APPLY") or discard the changes to the element ("CANCEL") are displayed.

#### Actions

Actions in the Model Tree can mainly be found in the context menu of the respective element nodes which can be accessed via the three dot icon or a right click on each row.

![context menu group](https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/assets/cmeditor/context-menu-group.png)

Figure 10. Context Menu Containing Node Actions for a Group

In the subheader, multi-select actions are available which can be toggled by the multi-select button.

##### Expand and Collapse

Single nodes such as groups, multi-selects and attachments, can be expanded and collapsed via the arrow icon left of the element name.

It is possible to expand or collapse all elements of the model via the virtual Model Tree node.

In addition, it is possible to expand or collapse all elements inside a specific node via the node actions "Expand All" and "Collapse All" in the node’s context menu.

##### Add an Element

All additions or modifications made in the editor are persisted in the **Additive Document Model**.
The **Reference Document Model** is not changed.
In order to modify an element of the Reference Document Model, it must first be added to Additive Document Model. When the Additive Document Model is joined with the Reference Model, the original element in the Reference Document Model is overwritten. The Model Tree shows the resulting joined Document Model.
This leads to two different ways of adding elements to the Additive Document Model tree:

1. **"Add to ADM"** or **"Add to ADM with children"** in the context menu of **Reference Document Model Elements** (see [Figure 10](#fig:additive:context-menu)).
   This copies the respective element and the parent groups to the Additive Document Model.
   "Add to ADM with children" is available for Groups, Includes, Attachments and Multi-Selects and adds all child elements to the Additive Document Model as well.
   All the added elements will **overwrite** the respective elements in the Reference Document Model.
   Some of their attributes can be modified in the Detail Editor.
   They are shown with a green background.
2. **"Add"** or **"Add sibling"** section of the context menu of **Additive Document Model Elements** (including the virtual Model Tree root element; see [Figure 9](#fig:additive:model-tree-root-menu))
   This adds a new element to the Additive Document Model, which has no counterpart in the current Reference Document Model.
   On root level, only Groups, Attachments and Multi-Selects can be added.
   Contrary to regular Document Models, Includes cannot be added on root level.
   All other elements can only be children of an existing Group.

   To add an element on root level, use the context menu of the virtual Model Tree node.
   To add an element as child of an existing Group, use the Group’s context menu.
   Alternatively, elements can be added below existing elements. Use the context menu of the target element and choose the element type inside the "Add sibling" section.
   If a Validation or Computation Rule is added below a Field, the Error/Computed Field of the new Rule is prefilled with the target Field.

##### Copy and Paste

Copying a single node of the **Additive Document Model** is possible via its context menu.
Pasting is only possible into a Group that is part of the **Additive Document Model** (either a Group or the virtual Root Node).
There are a number of things to consider when pasting elements:

* Copy & Paste of Group nodes will also copy all the child elements of the Group.
* Copy & Paste of elements inside their original parent Group (or on the top level) will result in renaming as they cannot have the same names as the original elements. The copied elements will have a `_COPY` suffix appended.
* Renaming also applies when elements are copied into a group that already contains elements with the same names.
* It is possible to copy several elements at once by doing a multi-selection before copying.
* Copy & Paste of single Rules can quickly result in errors. The Fields that the Rule refers to must be reachable from the position of the copied Rule.
* Copy & Paste of Includes will only copy the Include, to copy the content of an included model use the "Insert from DM" action.

The *Paste* action is only active if the target, be it the virtual root or any other node, is a valid target for the copied content. For example, it is not possible to paste a Field onto the root level.

##### Cut and Paste

*Cut and Paste* works in similar fashion as *Copy and Paste*. When the *Cut* action is used instead of the *Copy* action, the selected element(s) will be moved to the target destination instead of a copy of the selected element(s) being created.
Consequently, this action is only available for elements that do **not** occur in the **Reference Document Model**.

##### Insert from DM

With this action, it is possible to insert a copy of all elements of another Document Model as children to the respective group node or on root level when using the action in the virtual Model Tree node.
The group structure of the original model will be preserved.
All includes of the source Document Model will be resolved when inserting.

##### Delete

Deleting an element of the **Additive Document Model** is possible via its context menu.
Elements that have a corresponding element in the Reference Document Model (overwritten elements) have the action "Remove from ADM" while elements that are only present in the Additive Document Model have the action "Delete".

On an attempt to delete a Field that is used as an Error Field in one or more Validation Rules, a confirmation dialog enables choosing between deleting only the field and deleting the field as well as the Validation Rule(s) for this field.

Similarly, an attempt to delete a Computed Field triggers the display of a confirmation dialog that enables choosing between deleting only the Field and deleting the Field as well as the Computation Rule(s) for this Field.

All elements of the **Additive Document Model** can be removed by using the "Delete all additive elements" action in the context menu of the virtual root node.

##### Multi-Selection and Bulk Operations

To toggle the multi-selection mode of the Model Tree, use the toggle button in the subheader.

![toggle multi select](https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/assets/cmeditor/toggle-multi-select.png)

Figure 11. Use This Button to Switch Between Single and Multi-Selection Mode

In the multi-selection mode, an additional column will appear in the Model Tree.
It contains checkboxes to select single nodes as well as a checkbox to select all elements in the column header.

Selecting an element that contains child elements such as groups always selects all children as well. It is possible to de-select single children of a selected parent node. Then, the state of the checkbox will switch from "selected" (checkmark) to "indeterminate" (square).

As soon as at least one node has been selected in the Model Tree, the bulk operations become active, while all non-bulk operations become inactive.
The only exception to this is the paste action on root level as well as on node level.

Depending on the selected elements (whether they are elements in the **Reference Document Model**, the **Additive Document Model** or both), the following bulk operations are available: Copy, Cut, Delete, and
[Ad Hoc Testing](https://geta12.com/docs/SME/sme-dm-ba-docs/index.html#txt:adhoc_testing).

Using the toggle button again will hide the multi-selection column. If nodes are selected, a confirmation modal will appear, since hiding the multi-selection column will remove the multi-selection as well.

##### Move

Elements like Fields and Groups can be moved from one Group to another by dragging selected elements and dropping them on the target group.
The selected elements must be elements of the **Additive Document Model**.
The target must be a Group or the virtual root node of the **Additive Document Model** or a Group that was added from the Reference Document Model.
Elements that only exist in the **Reference Document Model** can neither be moved nor be targets.

Multiple elements can be moved if they are selected via the multi-selection.

When moving a Field that is used in at least one Validation or Computation Rule, the SME displays a dialog with the option to perform a refactoring operation that renames the Field references in these Rules. Similarly, when moving a Rule, a dialog offers the option to adapt the paths of Field references in this Rule according to its new location.

#### Additive Elements Only

In the header of the Model Tree, the switch "Additive Elements Only" is present.
If it is activated, only the elements of the **Additive Document Model** are shown.
This could be elements that are uniquely added to the **Additive Document Model** or added from the **Reference Document Model**.

#### Search and Filter

In the header of the Model Tree, it is possible to filter the Model Tree by element types and do a search on element names.

Initially, all elements are displayed. De-select element types to filter the Model Tree. An indicator on the filter icon will show if the view is currently filtered.

To search for elements by their name, use the search field. Only elements which (partially) match the input will be displayed. To reset the view, clear the search field.

The reset button next to the filter button will reset the view by removing any filter for elements and any search.

### Settings

In the Settings menu, model-wide settings can be made.

![model settings](https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/assets/cmeditor/model-settings.png)

Figure 12. Model Settings Screen

Name
:   The name of the Additive Document Model.
    The name needs to fulfill certain conventions: Only letters, digits, hyphens, underscores and periods are allowed.
    Furthermore, the name must not start with "xml" and must be at most 100 characters long.

    The model name must be unique within the Workspace and is synchronized with the filename by the editor.

Model Version
:   Shows the version of the opened model.

Description
:   Multiline text to give more information about the Additive Document Model.

Reference Model
:   Description of how the current Reference Document Model was built.
    In the context of a Mapping Model, it reads "Joined Target and Source Models of <Mapping Model Name>".
    In the context of a Combination Model, it reads "<Combination Model Name> Combination Up To Step <n>".

Locales
:   This field stores a list of locales for the **Additive Document Model**. Each locale is represented by a row in the table.
    At least one locale must be entered.
    All locales of the **Reference Document Model** must be present.

    Note that only locale codes according to ISO 639 alpha-2 or alpha-3 are allowed. It is possible to add a region code after an underscore, such as de\_DE, de\_CH and so on.

    The editor will show a separate input field for every given country code where multilingual inputs are possible, for example, for error messages, labels, and descriptions.

    If a locale is deleted from this list, a warning will be shown mentioning that all texts that have been set up for that locale will also be deleted.

    For more information about locales see the [Languages section in the Document Model documentation](https://geta12.com/docs/SME/sme-dm-ba-docs/index.html#txt:intro:languages).

Annotations
:   An Annotation is a name-value pair that can be added to the model in the model settings and all model elements.
    The application that uses the Additive Document Model can access those Annotations and can use them within custom implementations.

### Type Definitions

In the Type Definitions menu, Type Definitions can be viewed, added, edited and deleted.
Type definitions can either be defined for the **Additive Document Model** or be introduced via an include or import into the **Additive Document Model**.

Type Definitions defined in the **Reference Document Model** are also shown in the list and have a grey background.
The context menu for the locally defined ones shows actions to "Add to ADM"/"Remove from ADM".
Clicking those will add or remove the Type Definition also to the **Additive Document Model**.
This modeling support is helpful when the same Additive Document Model shall be used for many different Reference Document Models.

Only Type Definitions that have been defined in the Additive Document Model can be edited or deleted.

For information on what *Type Definitions* are and how they work, refer to the [Type Definitions section in the Document Model documentation](https://geta12.com/docs/SME/sme-dm-ba-docs/index.html#txt:reference:type-definitions).

### Rule Contradictions

While each Rule and Computation is checked for validity during editing it is possible that multiple Rules or Formal Validation settings contradict each other.
The Rule Contradiction Report takes not just the Additive Document Model but the **Joined Model** into account.

For more information, refer to the [Rule Contradiction section in the Document Model documentation](https://geta12.com/docs/SME/sme-dm-ba-docs/index.html#txt:rule_contradictions).

### Refactoring Across Models

Currently, no refactoring support is provided for Additive Document Models.
This means, that changes in the Reference Document model might break the Additive Document Model, or changes to the Additive Document Model might break subsequent models (Mapping Models, Combinations).

### Editors for Model Elements

The general functionalities of the element editors are alike the Document Model Detail Editors, for which documentation can be found in the [Document Model documentation](https://geta12.com/docs/SME/sme-dm-ba-docs/index.html#txt:editor:detail-dialogs).

## Editor for the Selection Model

The Selection Model editor needs a Context Model to support the editing.
Combination Models can act as Context Models.

If the Selection Model is referenced in a Combination Model in one of the Combination Steps, then the editor can be opened by clicking the Edit button next to the Selection Model dropdown.
The Selection Model editor will show the resulting Combined Document Model up to the previous Combination Step (or the Base Document Model) as the **Reference Document Model**.

The specification can be done and reviewed in detail in the [Selection Specification](#txt:selectionmodel:specification) screen.

But for most use-cases, the [Selected Elements](#txt:selectionmodel:selection) screen is sufficient and gives an easier entry point to Selection Modeling.

If a Group is empty after the Selection process, then it will be removed in the resulting model.
If elements of an Include are selected out, then the Include is converted into a regular Group in the resulting model.

If a Field is unselected but was the Index Field of a Group, then this property will be removed from the Group.
Other adaptations are not done.
Rules are not adapted or automatically removed if their Computed or Error Field is removed.

Note that the Selection Model can specify (even with a full absolute path) elements that are not present in the current Reference Model.
This allows you to use the Selection Model more flexibly in different contexts.
However, the missing refactoring support, when an element is renamed or moved in the Reference Model, is less obvious.
Modelers are advised to check the Selection Models after renaming or moving elements in the Base or any Additive Document Model.

### Sidebar

In the sidebar of the Selection Model Editor, the name of the Selection Model is displayed at the top.
Next to it, the icon for the Context Model is shown.
On hover, the name and Description of the Context Model is shown.

Three menus can be accessed:

* Selected Elements
* Selection Specification
* Settings

Below the menus, the following buttons are available:

* Cancel
* Save As
* Save

The menus as well as saving a model will be described in the subsequent chapters.

### Selected Elements

![model tree](https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/assets/semeditor/model-tree.png)

Figure 13. Model Tree Showing the Selection State of the Reference Model Elements

This screens shows the *Model Tree* of the Reference Model.
The status of the checkboxes of the Fields, Validation or Computation Rules indicates, whether the element will be part of the resulting Combined Document Model or not.

Checking a checkbox adds the element to the Selected list of the respective element type.
If the element’s full path was specified in the Unselected list, then this specification will be removed.

Unchecking a checkbox adds the element to the Unselected list of the respective element type.
If the element’s full path was specified in the Selected list, then this specification will be removed.

Be aware that there is no clean-up mechanism for wildcards or Path Specifications that identify Groups.
It is recommended to start modeling in this screen and adjust the Path Specifications if needed afterward in the [Selection Specification](#txt:selectionmodel:specification) screen.

This screen serves as a Preview as it shows all elements that will be in the resulting Combined Document Model with a checked checkbox.
The checked state might stem from the Default, the use of a wildcard, the specification of a full path or from checking the respective box in this screen.

#### Search and Filter

In the header of the Model Tree, it is possible to filter the Model Tree by element types and do a search on element names.

Initially, all elements are displayed. De-select element types to filter the Model Tree. An indicator on the filter icon will show if the view is currently filtered.

To search for elements by their name, use the search field. Only elements which (partially) match the input will be displayed. To reset the view, clear the search field.

The reset button next to the filter button will reset the view by removing any filter for elements and any search.

### Selection Specification

![selection specification](https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/assets/semeditor/selection-specification.png)

Figure 14. Selection Specifications Screen with detailed Selection Specifications

For each element category, Fields, Validation Rules and Computation Rules, it can be specified if those elements should all be Selected or Unselected per Default.
Next, Path Specifications can be given to Select or Unselect elements.
The Path Specifications can contain wildcards:

1. for the Group the element resides in
   For example "/\*/MyElement" will find all elements with name MyElement in any Group.
   To state only "/\*/" is not allowed, since this is the purpose of the Default.
   It is not supported yet to give partial Group paths like "/Customer/\*/FirstName".
2. for the prefix of the name
   For example "/\*/\*Date" would match all elements with names ending on "Date", like "/Person/BirthDate" and "/Person/Addresses/MoveInDate".
3. for the suffix of the name
   For example "/\*/Date\*" would match all elements with names beginning with "Date", like "/Person/DateOfBirth" and "/Person/Addresses/DateOfRegistration".

The corresponding Group structure is automatically added to the result.
However, if a Group is empty after the Selection process is finished, then it is removed.
If elements of an Include are selected out, then the Include is converted into a regular Group in the resulting model.
If a Field is unselected but was the Index Field of a Group, then this property will be removed from the Group.

### Selection Mechanism

The Selection process consists of the following Selection Steps that are done for each category (Fields, Validation Rules and Computation Rules):

* if default = Selected:

  1. all elements of the respective category are added to the result (matching specificity 0)
  2. all elements of the respective category that *match* a Path Specification for **Unselected** Entities are removed from the result
  3. all elements of the respective category that *match* a Path Specification for **Selected** Entities are added again to the result
* if default = Unselected:

  1. all elements of the respective category that *match* a Path Specification for **Selected** Entities are added the result
  2. all elements of the respective category that *match* a Path Specification for **Unselected** Entities are removed again from the result

An element *matches* a Path Specification if one of the following conditions is met.
The number indicates the matching specificity (see below).
The conditions are listed from low to high specificity:

1. the path of an ancestral Group is identical
   "/RG/G1/" (with trailing /) matches e.g. elements with path "/RG/G1/F3", "/RG/G1/F33", "/RG/G1/R3", "/RG/G1/G2/F3" or "/RG/G1/G2/G4/F3" (all subelements of /RG/G1)
2. the path of the parent Group is identical
   "/RG/G1/" (with trailing /) matches e.g. elements with path "/RG/G1/F3", "/RG/G1/F33", "/RG/G1/R3", but not "/RG/G1/G2/F3" or "/RG/G1/G2/G4/F3" (all children of /RG/G1)
3. the beginning of the element’s name is identical
   "/**/F**" matches e.g. elements with path "/RG/G1/G2/F3", "/RG/G1/F33", "/RG/G1/F3" or "/RG/G1/G2/G4/F3" but not "/RG/G1/R3"
4. the beginning of the given group’s child’s name is identical
   "/RG/G1/F\*" matches e.g. elements with path "/RG/G1/F3", "/RG/G1/F33" but not "/RG/G1/R3", "/RG/G1/G2/F3" or "/RG/G1/G2/G4/F3"
5. the end of the element’s name is identical
   "/**/F**" matches e.g. elements with path "/RG/G1/G2/F3", "/RG/G1/F33", "/RG/G1/R3", "/RG/G1/F3" or "/RG/G1/G2/G4/F3"
6. the end of the given group’s child’s name is identical
   "/RG/G1/\*3" matches e.g. elements with path "/RG/G1/F3", "/RG/G1/F33" or "/RG/G1/R3", but not "/RG/G1/G2/F3" or "/RG/G1/G2/G4/F3"
7. the elements name is identical
   "/\*/F3" matches e.g. elements with path "/RG/G1/G2/F3", "/RG/G1/F3", "/RG/G1/G2/G4/F3"
8. the path is identical
   "/RG/G1/G2/F3" matches only an element with path "/RG/G1/G2/F3"

However, the *match* is neglected, if the matching specificity is lower than the specificity of the previous selection step.
This means, that a concrete Path Specification in the previous Selection Step beats a fuzzy Path Specification in the next Selection Step.
Examples can be seen in the Table below

| Default | Path Specification for Selected Entities | Path Specification for Unselected Entities | Result |
| --- | --- | --- | --- |
| Unselected | "/RG/G1/F3" (specificity 8) | "/RG/G1/" (specificity 1) | "/RG/G1/F3" is present |
| Unselected | "/RG/G1/" (specificity 1) | "/RG/G1/F3" (specificity 8) | "/RG/G1/F3" is missing |
| Unselected | "/RG/G1/\*3" (specificity 6) | "/RG/G1/F\*" (specificity 4) | "/RG/G1/F3" is present |
| Unselected | "/RG/G1/F\*" (specificity 4) | "/RG/G1/\*3" (specificity 6) | "/RG/G1/F3" is missing |
| Selected (specificity 0) | "/RG/G1/\*3" (specificity 6) | "/RG/G1/F\*" (specificity 4) | "/RG/G1/F3" is present |
| Selected (specificity 0) | "/RG/G1/F\*" (specificity 4) | "/RG/G1/\*3" (specificity 6) | "/RG/G1/F3" is missing |

In Selection Models that are used for Decorations For Groups, the element specification work also for Groups; in other selections this would result in an empty Group that will be removed.

### Settings

In the Settings menu, model-wide settings can be made.

![model settings](https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/assets/semeditor/model-settings.png)

Figure 15. Model Settings Screen

Name
:   The name of the Selection Model.
    The name needs to fulfill certain conventions: Only letters, digits, hyphens, underscores and periods are allowed.
    Furthermore, the name must not start with "xml" and must be at most 100 characters long.

    The model name must be unique within the Workspace and is synchronized with the filename by the editor.

Model Version
:   Shows the version of the opened model.

Description
:   Multiline text to give more information about the Selection Model.

Reference Model
:   Description of how the current Reference Document Model was built.
    In the context of a Combination Model, it reads "<Combination Model Name> Combination Up To Step <n>".

Annotations
:   An annotation is a name-value pair that can be added to the model.

### Refactoring Across Models

Currently, no refactoring support is provided for Selection Models.
This means, that changes in the Reference Document Model are not reflected in the Selection Specifications.

## Decoration Mechanism

With the Decoration mechanism, a fixed set of Groups, Fields, Computation and Validation Rules is added to a Reference Model.
The Decoration Model, which contains the to-be-added elements, acts like a stamp, that imprints the same structure multiple times onto the Reference Model.

Combination Steps of Type Decoration must specify a Selection Model and a Document Model for Decoration.
The Decoration Model defines which elements are to be added, the Selection Model specifies around which Reference Model elements those should be added.

Note that if elements are added to a Group that was an Include in the Reference Model, then this connection will be removed and turned into a regular Group.

It is possible to decorate Fields or Groups.

### Decoration For Fields

Combination Steps of Type 'Decoration For Fields' allow you to add the elements of the Document Model for Decoration systematically around the Fields, that are specified by the Selection Model.

NOTE
:   Only Fields, that are not marked as Transient are taken into account.

The Document Model for Decoration must contain exactly one Root Group with a Field named 'Field'.
This Field is called the Anchor Field.
Siblings of this Field must have the string 'Field' in their name.
All other elements, including the Root Group, of the Document Model can have custom names.

An example for a suitable Document Model can be seen in the following figure.

![DocumentModelForDecorationForFields](https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/assets/decoration/DocumentModelForDecorationForFields.png)

Figure 16. Document Model For Decoration For Fields

For each non-transient Field selected by the Selection Model, the following steps are done:

1. The names of the elements of the Document Model for Decoration are adopted according to the name of the selected Field.

   If the Field 'Firstname' is to be decorated, then the subgroup in [Figure 16](#fig:decoration:decoModelForFields) would be called 'Firstname\_Proofing'.

   If this new name duplicates the name of an existing sibling, an error is shown in the Combination Model editor.
2. The paths are adopted according to this new name in Validation and Computation Rules (Error Field, Error Messages, Error Condition, Computed Field, Preconditions, Calculations)
3. If any Field of the Document Model for Decoration has the Annotation `_take_reference_configuration`, then the Data Type and the Type Configuration is copied from the selected Reference Model Field to this Field.
   Other properties like Labels, Annotations or Descriptions are not transferred.

   This can be used to formulate Type-dependent Rules.
   An error is shown in the Combination Model editor, if a Field is decorated with a Rule, that does not match the Fields Data Type.

After this preparation step, the elements are added to the Reference Model around the selected Field.
The internal structure of the Root Group of the Document Model for Decoration is conserved regarding the Anchor Field:
Any element, that was a sibling above the Anchor Field, will be a sibling above the selected Field.

Annotations of the Anchor Field will be copied to the selected Field.
If both have an Annotation with the same name, those must have the same value. Otherwise, an error is shown.

### Decoration For Groups

Combination Steps of Type 'Decoration For Groups' allow you to add the elements of the Document Model for Decoration systematically around the Groups, that are specified by the Selection Model.

|  |  |
| --- | --- |
|  | In the Selection Model the Path Specification "/RG/Group1/" is synonym to "/RG/Group1/\*" and means "decorate all subgroups of /RG/Group1". Path Specification "/RG/Group1" (without the trailing /) means "decorate group /RG/Group1". Empty Groups can be selected and decorated.  Modelers are advised to select the to-be-decorated Groups first in the [Selected Elements](#txt:selectionmodel:selection) screen and then adopt the Group Paths if needed in the [Selection Specification](#txt:selectionmodel:specification) screen. |

The Document Model for Decoration must contain exactly one Root Group with a Group named 'Group'.
This Group is called the Anchor Group.
It must be empty.
Siblings of this Group must have the string 'Group' in their name.
All other elements, including the Root Group, of the Document Model can have custom names.

An example for a suitable Document Model can be seen in the following figure.

![DocumentModelForDecorationForGroups](https://geta12.com/docs/2025.06/ext5/sme/sme-cmm-ba-docs/assets/decoration/DocumentModelForDecorationForGroups.png)

Figure 17. Document Model For Decoration For Groups

For each Group selected by the Selection Model, the following steps are done:

1. The names of the elements of the Document Model for Decoration are adopted according to the name of the selected Group.

   If the Group 'PersonInformation' is to be decorated, then the first Field in [Figure 17](#fig:decoration:decoModelForGroups) would be called 'UIHelper\_PersonInformationIsGDPRProtected'.

   If this new name duplicates the name of an existing sibling, an error is shown in the Combination Model editor.
2. The paths are adopted according to this new name in Validation and Computation Rules (Error Field, Error Messages, Error Condition, Computed Field, Preconditions, Calculations)

After this preparation step, the elements are added to the Reference Model around the selected Group.
The internal structure of the Root Group of the Document Model for Decoration is conserved regarding the Anchor Group:
Any element, that was a sibling above the Anchor Group, will be a sibling above the selected Group.

Annotations of the Anchor Group will be copied to the selected Group.
If both have an Annotation with the same name, those must have the same value. Otherwise, an error is shown.

### Validation

Note that the structure and the naming rules are not validated in the Document Model for Decoration itself, but only once it is referenced in a Combination Model.
Any modeling inconsistencies, like naming collisions, mismatching Data Types or duplicated Annotation names, that arise from this usage, will be shown in the Combination Model editor.
