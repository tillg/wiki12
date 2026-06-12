---
source: https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/index.html
category: sme
docid: sme-mm-ba-docs
scraped: 2026-06-12
---

# Modeling an A12 Document to A12 Document Mapping

This documentation is intended for a business analyst audience.

|  |  |
| --- | --- |
|  | The Mapping feature, the models and the editors are an experimental feature. It must be enabled in the SME Tool Settings before use; see [Enabling Experimental Module Types](https://geta12.com/docs/sme/sme-ba-docs/index.html#enabling_experimental_modules). |

## Introduction and Concepts

The Mapping Model Editor is part of the Simple Model Editor (SME) and enables domain experts and analysts to create and modify Mapping Models for business applications.
The Mapping Model orchestrates the transfer of data between A12 documents.
It defines which types of documents can be used and the type of the resulting document.
The data transfer happens in four steps:

1. Selection of source documents and the target document (Custom Code)
2. The selected Documents are joined together.
   Whether invalid documents should be neglected or used as they are, can be defined with [Skip Document Validation](#txt:mappingmodel:skipDocumentValidation).
3. Precomputations are executed in this joined document (Precomputation Model)
4. Data is transferred from the Joined Precomputation Document into the target document (Structural Mapping Model)

Actions taken with the filled target document after data transfer must be handled by Custom Code.
For example, the document may be persisted in a database or used as a response in an endpoint.

The mapping focuses on one target document, but the data can be taken from many source documents of many types.

The Mapping Model Editor allows you to create and edit Mapping, Precomputation and Structural Mapping Models.
Although all three models are modeled within the Mapping Model Editor, the models are saved separately on the file system as JSON files.
This separation allows Precomputation and Structural Mapping Models to be reused in different Mapping Models.

### Example Mapping Process

A very simplified business requirement could be the summation of the values of Fields `A` and `B` of a source document and filling the result into Field `SumOfAAndB` of a target document.

![mappingprocess 01 goal](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/mappingprocess_01_goal.png)

Figure 1. Simple Data Transfer Goal

To achieve this, a Computation Rule for the summation and a helper Field for the result is needed.
Both are created in the **Precomputation Model** in a new Root Group, in this example named "HelperFields".
The Field Mapping from `/HelperFields/SumOfAAndB` to `/Target/SumOfAAndB` is defined in a **Structural Mapping Model**.
Finally, the **Mapping Model** contains the references to these two models and the Target Document Model (Target\_DM) as well as the Source, which is in this example only Source\_DM with Repetitions = 1 and Name = Source.

When the mapping process is executed, this will result in the data steps sketched in [Figure 2](#fig:mappingprocess_02_datasteps):

1. Select Documents: The source and target documents are selected by custom code.
   In this example there is one source document with `A` = 1 and `B` = 2.
   And a target document with `OtherData` = "Some data".
2. Join Documents: These documents are both valid and filled into the **Joined Precomputation Model** structure to give the **Joined Precomputation Document**.
3. Do Precomputation: The Computations of the Joined Precomputation Model are executed.
   In this example, the result of the summation is written into the helper Field `SumOfAAndB`.
4. Fill Target: Data of the computed Joined Precomputation Document is filled into the target document.
   In this example, the content of the helper Field `SumOfAAndB` is written into the target Field `SumOfAAndB`.

![mappingprocess 02 datasteps](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/mappingprocess_02_datasteps.png)

Figure 2. Results of the Data Steps in the Mapping Process, Each Violet Box Is an A12 Document

|  |  |
| --- | --- |
|  | The original target document is used as starting point for the data step 4 (see above). As a consequence, it is not possible to compute directly into the final target document. Use a helper Field to store the Computation result and a Field Mapping to transfer it to the correct target Field.  However, it is possible to use data of the original target document in the Precomputations. The Target Document Model is part of the Joined Precomputation Model, but it is not a part of the Structural Mapping Source Model.  All data that shall be filled into the target document must be present outside the Target Document Model part of the Joined Precomputation Model. |

The whole data transfer is defined by three models:

Mapping Model
:   Determines what type of and how many source documents can be used. It also defines the type of the target document.
    It must reference a Structural Mapping Model and can reference a Precomputation Model.

Precomputation Model
:   Reflects the business requirements to bring the data into the right shape.
    This could be aggregations, conditional selections or data type adjustments.
    They can be expressed as Computation Rules with the Kernel Language.
    Helper Fields must be used to temporarily store the adjusted data.

    These additional helper Fields and Computation Rules are defined in the Precomputation Model; a special type of Additive Document Model.

    It is used in the data step 3 shown in [Figure 2](#fig:mappingprocess_02_datasteps) above.

Structural Mapping Model
:   Defines where to and which data is filled into the target document.
    The data can stem from any of the source documents or from the helper Fields defined in the Precomputation Model.
    It is used in the data step 4 shown in [Figure 2](#fig:mappingprocess_02_datasteps) above.

|  |  |
| --- | --- |
|  | The Mapping Model defines what data can be used, the Precomputation Model brings the data in the right shape, the Structural Mapping Model in the right place. |

![mappingprocess 03 models](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/mappingprocess_03_models.png)

Figure 3. Model Types Involved in the Mapping Process

The following sections will describe the editors for these models in detail.
You can also find a [Worked Example](#txt:mapping:workedexample) and shorter [Mapping Recipes](#txt:mapping:recipes) covering individual use cases/mapping requirements.

### Model Prerequisites

There are some general aspects to consider for the models that are used in the Mapping Process:

1. Roles must be aligned within the Mapping, Precomputation, Structural Mapping Model and the Target Document Model. Also make sure they are in the same order.
2. Locales should be consistent within the set of models.
   A warning is shown, if the Source and Precomputation Models do not contain all the locales that are supported in the Target Document Model.
   The locale that is used to invoke the created Mapper should be included in all models so that Formal and Validation Rule messages can be produced.
3. Type Definition mode must be the same in Source, Target and Precomputation Models; either local or imported.
4. Heterogeneity is not handled by the generated Mapper Code. The documents handed to the generated Mapper must match the type that is defined as Source Model. Necessary type adoptions must be done by Custom Code.

### When Does No Data Transfer Happen

Which data is transferred into the target document depends on a number of factors.

1. In the Source Document Models:
   If [Skip Document Validation](#txt:mappingmodel:skipDocumentValidation) is activated for the respective Source in the Mapping Model, then any document is accepted as a document for this Source.
   Any data that can be read into the Document Model structure, can be transferred.
   By default, [Skip Document Validation](#txt:mappingmodel:skipDocumentValidation) is deactivated.
   In this case, the documents are validated according to the Document Model.
   Only valid documents, regarding Formal and Rule Validations, are accepted as source documents.
   If a Validation Error occurs, the whole document is excluded from the mapping.
2. In the Precomputation Model:
   A helper Field and a Computation Rule can be added to the Precomputation Model.
   In combination with a Field Mapping from the helper Field to the target Field, a selection of data can be achieved.
3. In the Structural Mapping Model:
   A data transfer happens only if the Source Field instance is filled.

   A new repetition is only added to the target document if at least one subordinate Field Mapping transfers data.
   No empty repetitions are created in the target document.

   A Set of Field Mappings with `Find matching Repetition in the Target Document` is only executed, if the Lookup Source Field is filled.

### Data Priorities and Validity

If `Find matching Repetition in the Target Document` is used and data is already present in the target document, then this data is overwritten without further notice.

If two Field Mappings would write into the same Field instance (same repetition) during a mapping process, then only the first value is written to the target document.
A warning is reported for the respective Field instance, if a subsequent Field Mapping writes again into this Field instance.

See [What Happens if Data Is Already Present?](#txt:mapping:we_datapriority) for an example with data.

The initial target document is not validated.
Only the Fields that are referenced (directly or indirectly) in Precomputations are checked for Formal Validation errors.

The data transfer to the target Fields happens regardless of the validity of the value in the target or the source Field.
While the Structural Mapping Model editor ensures that the Field types are comparable, there might be a stricter Data Configuration in the target Document Model; for example a lower MaxValue for Number Fields or a stricter Pattern for String Fields.
The transferred data will then be formally invalid in the target document.

The Computations of the Precomputation step only accept formally valid data.
If the computed value does not match the Data Configuration of the respective computed Field, the consecutive Computations using this value are NOT executed.
But the computed value itself will be mapped into the target.

## Installation

The Mapping Model Editor is part of the Simple Model Editor. For advice on the installation of the Simple Model Editor, refer to the "Quick Start Guide" on getA12 under "Modeling".

### Migrating Existing Models to a New Version of the Tools

It might be necessary to migrate existing Mapping Models in case a new version of the Simple Model Editor and thus Mapping Model Editor has been installed.

In most cases, the Simple Model Editor can handle updating versions itself. For more information, refer to the documentation of the Simple Model Editor.

## Editor Functions

### Opening the Mapping Model Editor

To access the Mapping Model Editor, open a Workspace in the Simple Model Editor (SME).
All models contained in the Workspace are displayed in the SME Workspace Explorer.
Mapping Models are recognized by the SME and are indicated with the "Ma" icon.

![workspace explorer](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workspace_explorer.png)

Figure 4. SME Workspace Explorer Containing Mapping Models

To open the Mapping Model Editor for an existing model, click the entry in the Workspace Explorer.

To create a new Mapping Model, use the "ADD" button in the header of the Workspace Explorer or the context menu of a folder, and select "Mapping Model".

![add mapping model](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/add-mapping-model.png)

Figure 5. Add a New Mapping Model

A modal will be displayed to define the mandatory model settings: **Folder** and **Name**.

![add mapping model modal](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/add-mapping-model-modal.png)

Figure 6. Enter Initial Model Settings for New Mapping Model

The **Name** of the model must be unique within the Workspace.

Locales and Roles should match those of the Target Model and be listed in the same order.

|  |  |
| --- | --- |
|  | Ensure that Roles are always aligned with those of the Target Document Model and listed in the exact same order. |

### Mapping Model Contents

The Mapping Model Editor interface is shown in [Figure 7](#fig:mapping-model-content).

![mapping model content](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/mapping-model-content.png)

Figure 7. Mapping Model Editor - Mapping Screen

#### Settings

The Settings screen contains the following elements:

Name
:   The name of the Mapping Model. It must use only letters, digits, hyphens, underscores, and periods. The name must not start with "xml" and must be at most 100 characters long.

    The model name must be unique within the Workspace and is synchronized with the filename by the editor.

Model Version
:   Shows the version of the opened model.

Description
:   Multiline text providing additional information about the data transfer specified by the Mapping Model.

Locales
:   A list of locales supported by the model. Each locale is represented by a row in the table.

    At least one locale must be entered. Only locale codes according to ISO 639 alpha-2 or alpha-3 are allowed. A region code may be added after an underscore, such as de\_DE or de\_CH.

    All locales must be included in the list of locales of the Target Document Model.

Roles
:   A list of Roles can be maintained in this table.
    It should be aligned with the Roles of the Target Document Model.

Annotations
:   An Annotation is a name-value pair that can be added to the model.
    Applications using the Mapping Model can access these Annotations and use them in custom implementations.

#### Mappings

The Mapping screen contains the following elements:

Target Model
:   Select the Model from the dropdown list that defines the type of documents into which data will be transferred.
    The following model types will be offered:

    * Document Model
    * Combined Document Model
    * Transformed Document Model

Source Models
:   A list of Document Models that define the possible types of documents from which data can be drawn. Up to 99 Source Models can be listed. Use the ADD button or click an entry to define:

    Model
    :   Select the Model from the dropdown list that defines the type of documents that can be used as source documents.
        The following model types will be offered:

        * Document Model
        * Composed Document Model
        * Combined Document Model
        * Transformed Document Model

    Repetitions
    :   Defines the Repeatability of the Include. This is the maximum number of documents of this type that can be handled in the mapping process.

    Name
    :   The source model will be included under this name in the **Joined Precomputation Model**. It acts as an alias, for example, when using models of different versions or if documents of the same type should have a different role in the mapping (Custom Code required). The name must be unique within the Joined Precomputation Model. No Root Group of the Target Model can have this name.

        |  |  |
        | --- | --- |
        |  | Double-check the **Precomputation Model** after changing the name, as any additional helper Fields or Computations might be misplaced and have different semantics after the name change. |

Skip Document Validation
:   Defines, whether the source documents are fully validated (Formal and Rule based Validation) before being used for the data transfer. Documents that are not fully valid will be ignored by the data transfer process if this setting is not activated.

    Precomputation Model
    :   The Precomputation Model defines additional Fields or Computations that will be used in the mapping process. It is optional.

        Select an existing **Additive Model** from the dropdown list or create one with the ADD button (plus icon). The selected model can be edited using the EDIT button (pen icon), which opens the [Editor for the Precomputation Model](#txt:precomputation:editor).

    Structural Mapping Model
    :   The Structural Mapping Model defines which and how data is transferred from the **Joined Precomputation Document** into the target document. It is mandatory.

        Select an existing **Structural Mapping Model** from the dropdown list or create one with the ADD button (plus icon). The selected model can be edited via the EDIT button (pen icon), which opens the [Editor for the Structural Mapping Model](#txt:smm:editor).

|  |  |
| --- | --- |
|  | Ensure that the Precomputation Model has the exact same Roles in the same order as the Target Document Model. Roles can be set when creating the Precomputation Model. |

|  |  |
| --- | --- |
|  | The Structural Mapping Model can be created automatically by checking `Create Field Mappings automatically`. This is helpful if the Source and Target Document Models are similar, such as in a model migration.  A Field Mapping is automatically created for each Field that has the same path in both the Source and Target Document Models.  Fields can be excluded from automatic Field Mapping generation by setting the Annotation `_NO_FIELD_MAPPING_GENERATION` on the respective Field or its parent Groups in the Target Document Model.  If a data transformation is needed for a Field, create a helper Field as a sibling to the original Field in the Precomputation Model. Assign a common suffix to all such helper Fields and save the suffix in an Annotation `_SMM_Generator_Field_Name_Suffix` in the Precomputation Model.  For example, if there is a Field *DeductedAmount* in Group *TaxDeduction*, and it has two fractional digits in the Source Model but none in the Target Model, the DeductionAmount should be rounded to a whole number. Create a helper Field *DeductedAmount\_Transformed* in *TaxDeduction* after adding Group *TaxDeduction* to the Precomputation Model. Create a Computation *DeductedAmount\_Transformed\_Comp* with Precondition `FieldFilled(TaxDeduction)` and Calculation `RoundAccounting(TaxDeduction, 0)`.  An Annotation with name `_SMM_Generator_Field_Name_Suffix` and value `_Transformed` is added to the Precomputation Model.  When creating a new Structural Mapping Model and checking `Create Field Mappings automatically`, a Field Mapping between the helper Field *DeductedAmount\_Transformed* and Target Field *DeductedAmount* is created, instead of a Field Mapping between the Source Field *DeductedAmount* and Target Field *DeductedAmount*. |

### Validation

When opening or saving a Mapping Model, a full consistency check is performed. Among other things, it verifies that:

* The names of the Source Models do not collide with the names of the Root Groups in the Target Model.
* Joining the Target, Source, and Precomputation Model with the listed settings results in a valid Document Model.
* Computation Rules defined in the Precomputation Model refer to Fields that exist in the Joined Precomputation Model.
* The Fields used in the Structural Mapping Model exist in the Structural Mapping Source Model and the Target Model, respectively, and have the correct repeatability.

|  |  |
| --- | --- |
|  | Clicking the VALIDATE ALL button in the SME Workspace Explorer only checks that the referenced models exist in the workspace and that the Source Names are unique among each other. The full consistency check described above is only performed when opening or saving the Mapping Model. After changing any of the Target, Source, Precomputation, or Structural Mapping models in a different context, the respective Mapping Models should be checked manually. |

## Editor for the Precomputation Model

A **Precomputation Model** is an **Additive Document Model**, that is referenced in a **Mapping Model**.
Any existing **Additive Document Model** can be selected in the Mapping Model Editor.

When clicking the Edit button in the Precomputation Model section of the Mapping Model, the Additive Document Model Editor opens.
The joined Target and Source Models, as defined in the Mapping Model, are shown as the **Reference Document Model**.
The Additive Document Model Editor displays the complete **Joined Precomputation Model**; however, only the altered or additional model elements are persisted in the Additive Document Model.

If the Additive Document Model is referenced in at least one Mapping or Combination Model, then it can be opened directly from the SME Workspace Explorer.
A dialog is shown, if more than one reference exists.
The editor is opened in the context of the selected Combination or Mapping Model.
An error is shown, if no such reference exists.

### Sidebar

In the sidebar of the Additive Document Model Editor, the name of the Additive Document Model is displayed at the top. Four menus can be accessed:

* Model Tree
* Settings
* Type Definitions
* Rule Contradictions

Below the menus, the following buttons are available:

* Cancel
* Save
* Save As

The menus as well as saving a model will be described in the subsequent chapters.

### Model Tree

The *Model Tree* is the central editor component for the design of Additive Document Models. Here, the altered or additional elements such as Groups, Fields, and Rules can be added, edited, deleted, and viewed.

![model tree](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/ameditor/model-tree.png)

Figure 8. Model Tree and Field Editor of the Document Modeling Module

The elements show the following background colors:

* grey: Element of the **Reference Document Model** (Info on mouse over reads "reference").
* green: Element that exists in the Reference Document Model and the Additive Document Model. Some of its properties can be **overwritten** with the Additive Document Model (Info on mouse over reads "overwritten").
* none: Element that is defined in the Additive Document Model only. (Info on mouse over reads "additive").

Each element represents a *node* in the Model Tree.
All nodes are placed below a *virtual Model Tree node*.
The node actions of the virtual Model Tree node allow adding and pasting elements at the root level of the model. The virtual Model Tree node is not saved to the model file.

![model tree node](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/ameditor/model-tree-node.png)

Figure 9. Virtual Model Tree Node and Actions Available on Model Root Level

#### Element Editors

To open a node in the tree, click it with the left mouse button. Its corresponding Element Editor will open on the right.
See [Model Element Editors](#txt:additive:detail-dialogs) for further documentation on the different Element Editors.

In the bottom right of each Element Editor, buttons to apply changes to the element ("APPLY") or discard changes ("CANCEL") are displayed.

#### Order of Elements

By default, **additive** elements are added at the end of the parent Group.
However, if an element is overwritten by the Additive Document Model, this element can serve as an *Anchor* for other additive elements.
When an element is overwritten, it is possible to drag and drop other elements above it.

There is modeling support in the SME to add Groups as Anchor elements to the Additive Document Model. But due to the different overwriting semantics (see above), such support is not available for Fields and Rules.

When the elements of the Additive Document Model are added to the Reference Document Model, the mechanism goes through the list of root Groups and the children of the Group until it finds an element with the same name in the Reference Document Model.
If an element is found, all previous additive elements are added in their order directly above the overwritten element.
The mechanism then searches for the next matching element in the Reference Document Model and adds all intermittent elements directly above the overwritten element.

#### Actions

Actions in the Model Tree are primarily found in the context menu of the respective element nodes, accessible using the three-dot icon or by right-clicking each row.

![context menu group](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/ameditor/context-menu-group.png)

Figure 10. Context Menu Containing Node Actions for a Group

In the subheader, multi-select actions are available which can be toggled by the multi-select button.

##### Expand and Collapse

Single nodes such as Groups, multi-selects, and attachments can be expanded and collapsed via the arrow icon to the left of the element name.

It is possible to expand or collapse all elements of the model via the virtual Model Tree node.

Additionally, it is possible to expand or collapse all elements inside a specific node via the node actions "Expand All" and "Collapse All" in the node’s context menu.

##### Add an Element

All additions or modifications made in the editor are persisted in the **Additive Document Model**.
The **Reference Document Model** is not changed.
To modify an element of the Reference Document Model, it must first be added to the Additive Document Model. When the Additive Document Model is joined with the Reference Model, the original element in the Reference Document Model is overwritten. The Model Tree displays the resulting joined Document Model.
This leads to two different ways of adding elements to the Additive Document Model tree:

1. **"Add to ADM"** or **"Add to ADM with children"** in the context menu of **Reference Document Model Elements** (see [Figure 10](#fig:additive:context-menu)).
   This copies the respective element and the parent groups to the Additive Document Model.
   "Add to ADM with children" is available for Groups, Includes, Attachments, and Multi-Selects, and adds all child elements to the Additive Document Model as well.

   All added elements will **overwrite** the respective elements in the Reference Document Model.
   Some of their attributes can be modified in the Detail Editor.

   They are shown with a green background.
2. **"Add"** or **"Add sibling"** section of the context menu of **Additive Document Model Elements** (including the virtual Model Tree root element; see [Figure 9](#fig:additive:model-tree-root-menu))
   This adds a new element to the Additive Document Model, which has no counterpart in the current Reference Document Model.
   At the root level, only Groups, Attachments, and Multi-Selects can be added. Unlike regular Document Models, Includes cannot be added at the root level.
   All other elements can only be children of an existing Group.

   To add an element at the root level, use the context menu of the virtual Model Tree node.
   To add an element as a child of an existing Group, use the Group’s context menu.
   Alternatively, elements can be added below existing elements. Use the context menu of the target element and choose the element type in the "Add sibling" section.
   If a Validation or Computation Rule is added below a Field, the Error/Computed Field of the new Rule is prefilled with the target Field.

##### Copy and Paste

Copying a single node of the **Additive Document Model** is possible via its context menu.
Pasting is only possible into a Group that is part of the **Additive Document Model** (either a Group or the virtual Root Node).
There are several considerations when pasting elements:

* Copy & Paste of Group nodes will also copy all child elements of the Group.
* Copy & Paste of elements inside their original parent Group (or at the top level) will result in renaming, as they cannot have the same names as the original elements. The copied elements will have a `_COPY` suffix appended.
* Renaming also applies when elements are copied into a group that already contains elements with the same names.
* It is possible to copy several elements at once by multi-selecting before copying.
* Copy & Paste of single Rules can quickly result in errors. The Fields that the Rule refers to must be reachable from the position of the copied Rule.
* Copy & Paste of Includes will only copy the Include. To copy the content of an included model, use the "Insert from DM" action.

The *Paste* action is only active if the target, whether the virtual root or any other node, is a valid target for the copied content. For example, it is not possible to paste a Field at the root level.

##### Cut and Paste

*Cut and Paste* works similarly to *Copy and Paste*. When the *Cut* action is used instead of the *Copy* action, the selected element(s) are moved to the target destination instead of creating a copy. Consequently, this action is only available for elements that do **not** occur in the **Reference Document Model**.

##### Insert from DM

This action allows inserting a copy of all elements of another Document Model as children to the respective group node or at the root level when using the action in the virtual Model Tree node.
The group structure of the original model is preserved.
All includes of the source Document Model are resolved when inserting.

##### Delete

Deleting an element of the **Additive Document Model** is possible via its context menu.
Elements that have a corresponding element in the Reference Document Model (overwritten elements) have the action "Remove from ADM", while elements present only in the Additive Document Model have the action "Delete".

When attempting to delete a Field that is used as an Error Field in one or more Validation Rules, a confirmation dialog enables choosing between deleting only the Field or deleting the Field and the associated Validation Rule(s).

Similarly, attempting to delete a Computed Field triggers a confirmation dialog that enables choosing between deleting only the Field or deleting the Field and the associated Computation Rule(s).

All elements of the **Additive Document Model** can be removed by using the "Delete all additive elements" action in the context menu of the virtual root node.

##### Multi-Selection and Bulk Operations

To toggle the multi-selection mode of the Model Tree, use the toggle button in the subheader.

![toggle multi select](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/ameditor/toggle-multi-select.png)

Figure 11. Use This Button to Switch Between Single and Multi-Selection Mode

In multi-selection mode, an additional column appears in the Model Tree.
It contains checkboxes to select individual nodes as well as a checkbox to select all elements in the column header.

Selecting an element that contains child elements, such as Groups, always selects all children as well. It is possible to deselect individual children of a selected parent node. In this case, the state of the checkbox switches from "selected" (checkmark) to "indeterminate" (square).

As soon as at least one node is selected in the Model Tree, bulk operations become active, while all non-bulk operations become inactive. The only exception is the paste action at the root level and at node level.

Depending on the selected elements (whether they are elements in the **Reference Document Model**, the **Additive Document Model**, or both), the following bulk operations are available: Copy, Cut, Delete, and [Ad Hoc Testing](https://geta12.com/docs/SME/sme-dm-ba-docs/index.html#txt:adhoc_testing).

Using the toggle button again will hide the multi-selection column. If nodes are selected, a confirmation modal will appear, since hiding the multi-selection column will also remove the multi-selection.

##### Move

Elements such as Fields and Groups can be moved from one Group to another by dragging selected elements and dropping them on the target Group.
The selected elements must be part of the **Additive Document Model**.
The target must be a Group or the virtual root node of the **Additive Document Model**, or a Group added from the Reference Document Model.
Elements that exist only in the **Reference Document Model** can neither be moved nor be targets.

Multiple elements can be moved if selected via multi-selection.

When moving a Field that is used in at least one Validation or Computation Rule, the SME displays a dialog with the option to perform a refactoring operation that renames the Field references in these Rules. Similarly, when moving a Rule, a dialog offers the option to adapt the paths of Field references in the Rule according to its new location.

#### Additive Elements Only

In the header of the Model Tree, the switch "Additive Elements Only" is present.
If activated, only the elements of the **Additive Document Model** are shown. These may be elements uniquely added to the **Additive Document Model** or added from the **Reference Document Model**.

#### Search and Filter

In the header of the Model Tree, it is possible to filter the Model Tree by element types and search for element names.

Initially, all elements are displayed. Deselect element types to filter the Model Tree. An indicator on the filter icon will show if the view is currently filtered.

To search for elements by name, use the search field. Only elements that partially match the input will be displayed. To reset the view, clear the search field.

The reset button next to the filter button will reset the view by removing any element filters and search criteria.

### Settings

In the Settings menu, model-wide settings can be configured.

![model settings](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/ameditor/model-settings.png)

Figure 12. The Model Settings

Name
:   The name of the Additive Document Model. The name must fulfill certain conventions: Only letters, digits, hyphens, underscores, and periods are allowed. Furthermore, the name must not start with "xml" and must be at most 100 characters long.
    The model name must be unique within the Workspace and is synchronized with the filename by the editor.

Reference Model
:   Description of how the current Reference Document Model was built.
    In the context of a Mapping Model, it reads "Joined Target and Source Models of <Mapping Model Name>".

Locales
:   This field stores a list of locales for the **Additive Document Model**. Each locale is represented by a row in the table. At least one locale must be entered. All locales of the **Reference Document Model** must be present.
    Only locale codes according to ISO 639 alpha-2 or alpha-3 are allowed. It is possible to add a region code after an underscore, such as de\_DE or de\_CH.
    The editor displays a separate input field for every country code where multilingual inputs are possible, e.g., for error messages, labels, descriptions, etc.
    If a locale is deleted from this list, a warning will be shown indicating that all texts set up for that locale will also be deleted.
    For more information about locales, see the [Languages section in the Document Model documentation](https://geta12.com/docs/SME/sme-dm-ba-docs/index.html#txt:intro:languages).

Annotations
:   An Annotation is a name-value pair that can be added to the model.
    Applications using the Additive Document Model can access these Annotations and use them in custom implementations.

### Type Definitions

In the Type Definitions menu, Type Definitions can be viewed, added, edited, and deleted.
Type Definitions can either be defined for the **Additive Document Model** or introduced via an include or import into the **Additive Document Model**.

Type Definitions defined in the **Reference Document Model** are also shown in the list and have a grey background.
The context menu for locally defined Type Definitions shows actions to "Add to ADM" or "Remove from ADM." Clicking these will add or remove the Type Definition from the **Additive Document Model**.
This modeling support is helpful when the same Additive Document Model is used for many different Reference Document Models.

Only Type Definitions defined in the Additive Document Model can be edited or deleted.

For information on what *Type Definitions* are and how they work, please refer to the [Type Definitions section in the Document Model documentation](https://geta12.com/docs/SME/sme-dm-ba-docs/index.html#txt:reference:type-definitions).

### Rule Contradictions

While each Rule and Computation is checked for validity during editing, it is possible that multiple Rules or Formal Validation settings contradict each other.
The Rule Contradiction Report considers not only the Additive Document Model but also the **Joined Model**.

For more information, please refer to the [Rule Contradiction section in the Document Model documentation](https://geta12.com/docs/SME/sme-dm-ba-docs/index.html#txt:rule_contradictions).

### Refactoring Support

Currently, no refactoring support is provided for Additive Document Models.
This means that changes in the Reference Document Model might break the Additive Document Model, or changes to the Additive Document Model might break subsequent models (Mapping Models, Combinations).

### Model Element Editors

The general functionalities of the Element Editors are similar to those of the Document Model Detail Editors. For further documentation, see the [Document Model documentation](https://geta12.com/docs/SME/sme-dm-ba-docs/index.html#txt:editor:detail-dialogs).

## Editor for the Structural Mapping Model

A **Structural Mapping Model** describes the data transfer of Field values from a source to a target document.
The editor can be opened from the [Mapping Model Editor](#txt:mappingmodel:editor).

If the Structural Mapping Model is referenced in at least one Mapping Model, then it can be opened directly from the SME Workspace Explorer.
A dialog is shown, if more than one reference exists.
The editor is opened in the context of the selected Mapping Model.
An error is shown, if no such reference exists.

### Sidebar

In the sidebar of the Structural Mapping Model Editor, the name of the Structural Mapping Model is displayed on the top.

Two menus can be accessed:

* Mappings
* Settings

Below the menus, the following buttons are available:

* Cancel
* Save

The menus as well as saving a model will be described in the subsequent chapters.

### Mappings

The *Mappings* menu is the central editor component for the design of Structural Mapping Models.

![smm mappings](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/smmeditor/smm-mappings.png)

Figure 13. Structural Mapping Model Editor

On the right side of the editor, the **Structural Mapping Source** is shown as a hierarchical tree.
The tree contains the Groups, Includes, Multi-Selects, Attachments and Fields of the **Joined Source and Precomputation Models** as defined by the Mapping Model.
Note that it differs from the **Joined Precomputation Model** as it does not contain the Target Model.

On the left side of the editor, the **Structural Mapping Target** is shown as hierarchical tree.
The tree contains the Groups, Includes, Multi-Selects, Attachments and Fields of the **Target Model** defined in the Mapping Model.
The additional columns of the tree show:

Clear
:   A checkbox for each Group of the Target Model.
    If it is checked, the Group including all its content is deleted **if** a data transfer is performed into one of its subordinate Fields during the Mapping.
    **The Group is cleared only once and only if a data transfer occurs.**
    All repetitions and all subgroups are deleted.
    The checkboxes of subordinate Groups are also checked and deactivated, if an ancestor Group is to be cleared. This happens to make the behavior transparent to the modeler.

Mapping Blocks
:   Field Mappings are grouped together into Mapping Blocks.
    The Mapping Blocks are executed left to right at runtime.
    Use the Move action of the Field Mappings to create new Mapping Blocks.
    Mapping Blocks that are empty will automatically be removed from the model.

    Field Mappings
    :   Represented by a transparent element with a turquoise border and the relative source Field path as text.
        Each Field Mapping defines the data transfer from a source to a target Field.

    Set of Field Mappings
    :   All Field Mappings within a repeatable target Group are grouped into a Set according to their **Source Group** and the **Mapping Block**.
        This means that within each Mapping Block there is a Set of Field Mappings for each combination of repeatable Target Group and connected Source Group.

        A Set of Field Mappings is visualized by a filled turquoise header element.
        It shows a symbol, that represents how the repetition in the target document is selected, and the relative path of the Source Group.
        All Field Mappings below the header element belong to this Set of Field Mappings.
        The elements show only the relative path to reflect the nested structure. Hover above an element to see the full path.
        If the Source Group is the same as the one of the encapsulation Set of Field Mappings, then the path is shown as "./"

        If Field Mappings from different subordinate Source Groups are present within a parent Target Group, then the turquoise header element is as wide as all the subordinate elements.
        This visualizes that the various subordinate Field Mappings will transfer data into the same parent Group repetition.
        For example, when the mapping in [Figure 14](#fig:smm:subordinate) is executed, one repetition of *Persons* for each *RSVP* repetition will be created. It will contain the person’s *Name*. The first repetition of the subordinate Group *Drinks* will contain the selected *WelcomeDrink* (if one selected). The following repetitions of the Group *Drinks* will contain the further selected *DrinkWishes*. The *WelcomeDrink* and the *DrinkWishes* of one person are always transferred together into the same repetition of *Persons*.

        ![smm subordinate rs](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/smmeditor/smm-subordinate-rs.png)

        Figure 14. Grouped Sets of Field Mappings

        The Sets of Field Mappings are executed at runtime as they are shown in the editor from "left to right".
        For the example above, the first repetition of *Drinks* will always contain the *WelcomeDrink*.

        The header element for the Set of Field Mappings will be created automatically. Just add the Field Mappings.

#### Actions

Actions for rows and elements of the two trees can be found in the context menu of the respective row or element. It can be accessed via the three dot icon or a right click.
There are actions available for rows that represent Groups, Multi-Selects and Attachments, and for each element of the Structural Mapping Model.

![smm contextmenu tooltip](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/smmeditor/smm-contextmenu-tooltip.png)

Figure 15. Context Menu And Info Text

##### Expand and Collapse

Rows for Groups, Multi-Selects, and Attachments can be expanded and collapsed using the arrow icon left of the element name.

It is possible to expand or collapse all elements of the model using the virtual Model Tree node.

In addition, it is possible to expand or collapse all elements inside a specific node using the node actions "Expand All" and "Collapse All" in the node’s context menu.

##### Edit

The symbol in the turquoise header elements that are shown in the rows of repeatable Groups or Multi-Selects shows, how the target repetition of this Group is selected for the Field Mappings that are subordinate to it.
The **Edit** button in the header element’s context menu opens the following dialog.

![smm edit rs dialog](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/smmeditor/smm-edit-rs-dialog.png)

Figure 16. Into Which Repetition of the Target Document Should the Source Data Be Mapped?

In this dialog, it can be specified how the target repetition will be selected:

Target Group
:   A read-only display of the path of the repeatable Group for which the repetition is to be selected.

Source Group
:   The list of possible Groups of the Structural Mapping Source Model.
    Only the Source Group, that is assigned to the next higher ancestral Target Group, itself and all its subgroups up to the first branching of the paths of subordinate elements are listed. Subordinate elements are Field Mappings, assigned Source Groups or Lookup Source Fields.
    See section [Modeling Support](#txt:smm:modelingsupport).
    For each repetition of the selected repeatable Group or for the selected non-repeatable Group itself, a new repetition of the shown target repeatable Group is created.
    See [Why Is the Source Group Important?](#txt:mapping:we_sourcegroup) for an example with data.

For each Repetition of the Source Group
:   Select, whether a new repetition shall be added or an existing repetition shall be used.
    If `Find matching Repetition in the Target Document` is selected, the editor displays inputs for the **Lookup Source Field** and **Lookup Target Field**, which are mandatory in this case.
    During runtime, the Mapper then tries to find a repetition in the target document, where the Lookup Target Field has the same value as the Lookup Source Field.
    If there is no such repetition, a new repetition is created and the value of the Lookup Source Field is written into the Lookup Target Field.
    If the Lookup Field is empty in the Source repetition, no repetition is created.

Lookup Source Field
:   Only for `Find matching Repetition in the Target Document`: A list of possible Fields of the Structural Mapping Source Model that identifies a matching repetition.

Lookup Target Field
:   Only for `Find matching Repetition in the Target Document`: A list of possible Fields of the Target Model that identifies a matching repetition.

The suggestions of possible values in this dialog are dynamic.
Only options that are valid in the context of the other settings are shown.
That means, after selecting a **Source Group** the list in **Lookup Source Field** might change. And vice versa, once a **Lookup Source Field** is selected, the suggestions in **Source Group** are limited. To get the full lists, reset the other settings.

##### Move

The transparent elements with the turquoise border represent the individual Field Mappings.
The **Move** button in their context menu opens the following dialog.

![move field mapping](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/smmeditor/move-field-mapping.png)

Figure 17. Move Field Mapping

It lists all Mapping Blocks, into which the Field Mapping could be moved without invalidating the Structural Mapping Model.
Mapping Blocks that have a corresponding Field Mapping already, are not shown.
The current Mapping Block of the Field Mapping is selected initially.

##### Delete

All elements have a **Delete** button in their context menu.
If the deletion is confirmed in the following dialog, the respective element, all subordinate and any obsolete element is deleted as well.

#### New Model

In a new Structural Mapping Model, the **Mappings** column of the Model Tree is initially empty.
Field Mapping can be created by dragging a Field from the **Joined Source and Precomputation Models** on the right side of the editor onto a row of the **Structural Mapping Target** tree on the left side of the editor.

#### Search and Filter

In the header of both trees, it is possible to filter for elements that are Mapped or Unmapped and do a search on element by names.

![search filter](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/smmeditor/search-filter.png)

Figure 18. Filter and Full Text Search

Initially, all elements are displayed. De-select entries to filter the respective tree. An indicator on the filter icon will show if the view is currently filtered.

To search for elements by their name, use the search field. Only elements which (partially) match the input will be displayed. To reset the view, clear the search field.

The reset button next to the filter button will reset the view by removing any filter for elements and any search.

### Settings

In the Settings menu, model-wide settings can be made.

![model settings](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/smmeditor/model-settings.png)

Figure 19. The Model Settings View

Name
:   The name of the Structural Mapping Model. It needs to fulfill certain conventions: Only letters, digits, hyphens, underscores and periods are allowed.
    Furthermore, the name of the model must not start with "xml" and must be at most 100 characters long.

    The model name must be unique within the Workspace and is synchronized with the filename by the editor.

Annotations
:   An Annotation is a name-value pair that can be added to the model.
    The application that uses the model can access those Annotations and can use them within custom implementations.

### Modeling Support

To support the modeling, the editor only suggests/allows options that lead to a valid Structural Mapping Model.

We start with the following Structural Mapping Model:

![smm modelsupport start](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/smmeditor/smm-modelsupport-start.png)

Figure 20. Initial Structural Mapping Model

#### During Field Mapping Creation

The editor will only create valid Field Mappings.

|  |  |
| --- | --- |
|  | **NO** Field Mapping will be created when:  * dropping a repeatable Source on a non-repeatable Target Field (eg *A* onto *T*) * dropping a Field with an [incompatible type](#txt:smm:validationFieldMapping) |

When creating a new Field Mapping, the editor walks through the repetition layers of the target Field and checks, if a fitting [Set of Field Mappings](#txt:smm:setoffieldmappings) already exists.
A new Set of Field Mappings or a new Mapping Block will be created automatically when:

* there is no existing Set of Field Mappings, where the created Field Mapping would fit into
* the Target Field is a Lookup Field or has a Field Mapping assigned already
* the Source Field is not a child of the Source Group that was assigned to the next highest repeatable Target Group

This new Set of Field Mappings will be created from as low in the source hierarchy as possible.
So that:

* The data of the source is structurally held together as much as possible
* The most Field Mappings are possible in the same Mapping Block

If this leads to a conflict, the editor tries the parent Group of the source Field.
If this leads to a conflict as well, a new Mapping Block is created.

Starting with the model in [Figure 20](#fig:smm:modelsupport-start), dropping *A* onto *V* and *G* onto *X* will not result in a new Mapping Block, as the structure fits into the selected Source Groups. The resulting model looks as the following:

![smm modelsupport step1](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/smmeditor/smm-modelsupport-step1.png)

Figure 21. Structural Mapping Model With More Fitting Field Mappings

Dropping also (1) *E* on *X*, (2) *C* on *X* and (3) *B* on *V* will result in the following:

![smm modelsupport step2](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/smmeditor/smm-modelsupport-step2.png)

Figure 22. Structural Mapping Model With Field Mappings That Cannot Be in One Mapping Block

1. Because there is already a Field Mapping for *X* defined with a Source Field from the same Source Group, a new Mapping Block is created. All repetition layers have to be treated again.
2. The Field Mapping for *C* fits into both Mapping Blocks, but it is always added to the first matching.
   It can be moved to the same Mapping Block as *E* with the Move action in its context menu.
3. Since there is a Field Mapping already for *V* in the first Mapping Block, the new Field Mapping for *B* will be added to the second Mapping Block, as it fits there. No new Mapping Block is created.

#### In the Edit Dialog

When [editing](#txt:smm:edittargetrepetition) how the target repetition of a repeatable Target Group should be determined, only valid options for the Source Group are shown.

The list of possible Source Groups depends on the structure of the Source Model and the Field Mappings already present in the respective Mapping Block.
Only the Source Group, that is assigned to the next higher ancestral Target Group, itself and all its subgroups up to the first branching of the paths of subordinate elements are listed. Subordinate elements are Field Mappings, assigned Source Groups or Lookup Source Fields.

If the model changes, so does the list of possible Source Groups.
For the example Source Model in [Figure 20](#fig:smm:modelsupport-start) this is explained in the following table.

Table 1. Alterations to the Starting Model in [Initial Structural Mapping Model](#fig:smm:modelsupport-start)


| Step | Consecutive Changes | Possible Source Groups for `/Target/RepTarget/SubRepTarget/` | Reason |
| --- | --- | --- | --- |
| 1 | Take model of [Figure 20](#fig:smm:modelsupport-start) | * /Source1/ * /Source1/NonRep1/ | 1. `/Source1/` is assigned to the parent repeatable Group. It is the highest listed Group. 2. The lowest selected Field of the Source is the Lookup Field `/Source1/NonRep1/Index`, hence, `/Source1/NonRep1/` is the lowest listed Group. |
| 2 | Remove Lookup Field `/Source1/NonRep1/Index` | * /Source1/ * /Source1/NonRep1/ * /Source1/NonRep1/Com1/ * /Source1/NonRep1/Com1/Com2/ * /Source1/NonRep1/Com1/Com2/Br2/ | 1. `/Source1/` is assigned to the parent repeatable Group. It is the highest listed Group. 2. The lowest selected Field of the Source is in the Field Mapping for *H*, hence, `/Source1/NonRep1/Com1/Com2/Br2/` is the lowest listed Group. |
| 3 | Add Field Mapping for `/Source1/NonRep1/Com1/Com2/Br1/G` | * /Source1/ * /Source1/NonRep1/ * /Source1/NonRep1/Com1/ * /Source1/NonRep1/Com1/Com2/ | 1. `/Source1/` is assigned to the parent repeatable Group. It is the highest listed Group. 2. The lowest common Group of the Source Fields used in Field Mappings is `/Source1/NonRep1/Com1/Com2/`, hence, it is the lowest listed Group. |
| 4 | Change Source Group assigned for `/Target/RepTarget/SubRepTarget/` to `/Source1/NonRep1/Com1/Com2` |  |  |
| 5 | Change Source Group assigned for `/Target/RepTarget/` to `/Source1/NonRep1/Com1/` | * /Source1/NonRep1/Com1/ * /Source1/NonRep1/Com1/Com2/ | 1. `/Source1/NonRep1/Com1/` is assigned to the parent repeatable Group. It is the highest listed Group. 2. The lowest common Group of the Source Fields used in Field Mappings is `/Source1/NonRep1/Com1/Com2/`, hence, it is the lowest listed Group. |

|  |  |
| --- | --- |
|  | As can be seen in the table above, it is not possible to create crossing Source Group assignments or Field Mappings. This is why step 4 must be done before step 5. After step 3, `/Source1/NonRep1/Com1/` is not an available option for `/Target/RepTarget/`. |

+
Helper Fields must be used if a structural change is required. See [Restructure Data Across Repetition Layers](#txt:mapping:we_restructuredata).

![smm modelsupport step3](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/smmeditor/smm-modelsupport-step3.png)

Figure 23. Structural Mapping Model With [Applied Alterations](#txt:smm:modelingsupport-edit-alterations)

|  |  |
| --- | --- |
|  | Starting with [Figure 23](#fig:smm:modelsupport-step3) and dropping *A* onto *V* will create a new Mapping Block. |

If instead of step 3, the Source Group for `/Target/RepTarget/SubRepTarget/` is changed to `/Source1/NonRep1/Com1/Com2/Br2` and the Field Mapping for *G* added afterward, then the following output would result:

![smm modelsupport step4](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/smmeditor/smm-modelsupport-step4.png)

Figure 24. Different Source Group for `/Target/RepTarget/SubRepTarget/` Results in New Mapping Block for Added Field Mapping

|  |  |
| --- | --- |
|  | While the resulting document for [Figure 21](#fig:smm:modelsupport-step1) would contain only one repetition for `/Target/RepTarget/SubRepTarget/` with both values *H* and *G*, the document for [Figure 24](#fig:smm:modelsupport-step4) would contain two repetitions (the first containing *H* in *Y*, the second *G* in *X*.) |

#### In the Move Dialog

In the current editor, it is not always possible to differentiate visually, whether two Field Mappings shown side-by-side are just in different Sets of Field Mappings or in different Mapping Blocks.
But the [Move Dialog](#txt:smm:moveFieldMapping), accessible from the Field Mapping’s context menu, shows the current Mapping Block for each Field Mapping.
It is possible to select another Mapping Block therein.
Only Mapping Blocks to which the Field Mapping can be added in a valid way are shown.

### Validation

Upon opening or saving a Structural Mapping Model, a full Validation is performed.
During this, the consistency between the Source, Target and the Structural Mapping Model is checked.
If possible, the inconsistencies are shown on the respective element in the Target Model tree.

The Structural Mapping Source or the Target Model may change in a way that makes the Structural Mapping Model invalid.
This can happen if the Mapping, the Precomputation or the involved Document Models change.
If the resulting errors cannot be fixed in the current Structural Mapping Model editor context, a dialog is shown to delete the respective elements of the Structural Mapping Model.

In general, the editor only allows changes to the Structural Mapping Model that lead to a valid state. See [Modeling Support](#txt:smm:modelingsupport) for more details.

|  |  |
| --- | --- |
|  | When using the "Validate" button in the SME Workspace Explorer, only the Structural Mapping Model itself is checked for internal validity. The full validation described above is **not** done. |

#### Field Mapping Type Compatibility Check

In general, the Source and Target Field’s Data Type and Data Type Configuration should be the same.

However, some exceptions are allowed:

1. it is possible to map a String Field to an Enumeration Field and vice versa
2. it is possible to map a Number Field to a String Field

The following Field Mappings are not allowed (examples):

1. String with `Line Breaks Permitted` = true to an Enumeration Field or a String Field with `Line Breaks Permitted` = false
2. Number Fields where the Target has a larger `Min. Decimal Places` value or a smaller `Max. Decimal Places` value than the Source
3. Number with checked `Zero Allowed` or `Leading Zeros Allowed` in the Source but not in the Target
4. Date Fragments or Date Ranges with different formats

|  |  |
| --- | --- |
|  | It is not assured, that every value that is formally valid in the Source is also formally valid in the Target.  Formal Validation Errors might occur due to different String Patterns, Min or Max Values, or Min or Max Lengths.  Moreover, Rule Based Validation in the Target Document Model might also render the resulting document invalid. |

### Refactoring Support

Currently, no refactoring support is provided for Structural Mapping Models.
This means, that changes in any of the Source, Target or Precomputation Model as well as the Mapping Model might break the Structural Mapping Model.

## Worked Example

Hurray, we are planning a big dinner party!

To ease our planning, we set up an A12 web application, where our invited guests entered their arrival time, food and drink wishes.
Each guest filled out the RSVP form, and we have an A12 document for each in our database.
Three examples are shown below.

![RSVP DM and doc.png](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/RSVP_DM_and_doc.png)

Figure 25. Document Model Structure of RSVP\_DM (Left Tree) and Three Example Documents

For the detailed planning, we need different views on this data:

1. A simple list of all the participants and their arrival time, so we know how many chairs we need
2. The Food Wishes grouped by *DishName*, so it is easier to order at a restaurant
3. A list of all the items that were ordered, so we can set up a shopping list

The following sections show how to model these requirements by taking the Precomputation and the Structural Mapping Model into account.
The mapping features and potential pitfalls are explained along the use case.

|  |  |
| --- | --- |
|  | As this documentation is about the A12 Mapping feature, we use it despite the fact that it might not be the best modeling solution in each case. The Overview Engine is better suited to show an up-to-date attendance list online. But if you are throwing a 90ies motto party and want to be nostalgic, then you might want to print the list. The Mapping shown here and a Print Model would then be the right solution. |

### Consolidate Data of Different Source Documents Into a Repeatable Target Group

First of all, we want a list of guests and their arrival time, so we can plan the reception.
That means, we want to extract some data from all RSVP documents and fill it into one repetition of one document.

![ConsolidateData Goal](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/ConsolidateData_Goal.png)

Figure 26. Planned Data Consolidation From Source Document Model RSVP\_DM (Left) to Target Document Model ParticipantOverview\_DM (Right)

After creating a Mapping Model in the SME and setting ParticipantOverview\_DM as the Target Model and RSVP\_DM as a Source Model (Name is RSVP, Repetitions is 50), the Structural Mapping Model can be created.
The first **Field Mapping** for *RSVP\_ID* can be added by dragging it from the right side of the Structural Mapping Editor **Structural Mapping Source** to the left side.

![ConsolidateData SMM FirstElement](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/ConsolidateData_SMM_FirstElement.png)

Figure 27. Structural Mapping Model With First Field Mapping

Since the target Field *RSVP\_ID* is within a repeatable Group, it must be determined into which repetition the data should be filled.
The plus icon symbolises, that a new repetition is created for each repetition in the Structural Mapping Source.
In this case, this means for each RSVP document that is handed to the Mapper, one new repetition in the target document is created.

![ConsolidateData SMM AllFieldMappings](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/ConsolidateData_SMM_AllFieldMappings.png)

Figure 28. Structural Mapping Model With Field Mappings

Since all the Source Fields are within the same repeatable ancestral Group (*RSVP* [50]) and there are no additional repetition layers in between, the data of these Fields can be mapped without further settings.
Please take note of the Paths shown for the Field Mappings above. They are shown as paths relative to the Source Group that was assigned to the repeatable target Group.
Hovering above a Field Mapping shows the complete path.

After executing the Mapping with the [example data above](#fig:mmwe:exampledata), we get the following result:

![ConsolidateData SMM AllFieldMappings out1](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/ConsolidateData_SMM_AllFieldMappings-out1.png)

Figure 29. Resulting Document for the Mappings Shown Above

This matches our [goal](#fig:mmwe:ConsolidateData_Goal) and shows one repetition entry for each participant with their *Name* and *ArrivalTime*.

### Restructure Data Across Repetition Layers

For planning and serving the food, it would be great to have the food wishes not structured by person, but by course and dish.
So we would like to restructure the data in the following way:

![RSVP DM to CoursePlan DM restructuring](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/RSVP_DM_to_CoursePlan_DM_restructuring.png)

Figure 30. Planned Data Restructuring From Source Document Model RSVP\_DM (Left) to Target Document Model CoursePlan\_DM (Right)

In [the sketch above](#fig:mmwe:restructuring-goal), the arrows cross each other, because we want to transfer data from the lowest to the highest repeatability level while also filling the intermediate levels.
In order to do so, we need a helper Field and a Computation Rule to bring the guest’s *Name* next to the *DishName*.
Then, the repetition layers in the Source and Target are structurally parallel. (In a graph of the Document Models with the Groups sorted non-repeatable to repeatable, [like above](#fig:mmwe:restructuring-goal), there are no crossing arrows anymore.)
This can be modeled with a **Precomputation Model**. It holds all the data manipulations we need before transferring the data into a new structure.

After adding a Precomputation Model using the Add button in the Mapping Model Editor, the **Additive Document Model Editor** opens and the Joined Source and Target Document Models that were selected in the Mapping Model are shown as the **Reference Model**.

We want to add a new Field into the Group *FoodWishes*.
But there is no action to add a Field or Rule in the context menu for the respective node in the Model Tree yet.
We need to add the Group to the **Additive Model** before we can add a Field or Rule. Clicking "Add to ADM" adds the Group to the Additive Model.

![RSVP PC AddingFoodWishesGroupToADM](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/RSVP_PC_AddingFoodWishesGroupToADM.png)

Figure 31. Before Adding a New Field or Rule to an Existing Group, the Group Must Be Added to the Additive Document Model

After doing so, a Field *PersonName* and a respective Computation Rule can be added. The Computation Rule can be seen [below](#fig:mmwe:RSVP_PC_PersonNameAdded).

![RSVP PC PersonNameAdded](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/RSVP_PC_PersonNameAdded.png)

Figure 32. Precomputation Model With Added Helper Field and Computation Rule

With the data manipulation step defined, we can now specify the data transfer in the **Structural Mapping Model**.
After adding a new Structural Mapping Model using the Add button in the Mapping Model Editor, the Structural Mapping Model Editor opens.
It shows the Joined Source Document Model on the right, including the added helper Field, and the Target Document Model on the left.
By dragging and dropping Fields from the Source to the Target Model Tree, we can create Field Mappings.
Doing so for *PersonName* creates the [following view](#fig:mmwe:CoursePlan_SMM_step1).

![CoursePlan SMM step1](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/CoursePlan_SMM_step1.png)

Figure 33. Field Mapping for PersonName Added to Structural Mapping Model

For each repetition layer of the Target Model element it must be defined, how the correct repetition of the document shall be selected.
The editor automatically creates the respective elements for each repeatable Group of the Target Model element.
Since there are no Index Fields defined, the automatic suggestion sets "Add New Repetition" for each repetition layer.
The automatic suggestion also tries to conserve the original data structure. So the first level of repeatability of the Target (*Courses*) is connected to the first level of repeatability of the Source (*RSVP*).
But this might not be the intended behavior.
By right-clicking on the respective element or opening its specific context menu using the three dot button, the [Edit Dialog](#txt:smm:edittargetrepetition) can be opened.
Here, the connection between the repetition layers of the Target and the Source can be modeled.

#### Why Is the Source Group Important?

Depending on the selected Source Group in the [Edit Dialog](#txt:smm:edittargetrepetition), the internal structure of the source data can be retained or dissolved.
When taking the [example data](#fig:mmwe:exampledata) above as the starting point, a Precomputed Document with three instances of the Group *RSVP* is created. The first contains one, the second two and the third contains three instances of the Group *FoodWishes*.
There are two repetition layers in the Precomputed Document; *RSVP* and *FoodWishes*.

There are three repetition layers in the Target Document Model: *Courses*, *Dishes*, and *WhoOrdered*.
For each it has to be determined, how the target repetition is determined.

There are different modeling alternatives to connect the two repetition layers of the Source and Target:

![DifferentSourceGroupExample](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/DifferentSourceGroupExample.png)

Figure 34. Three Modeling Options With Different Source Groups

In each modeling option above "Append New Repetition" is selected. So for each repetition of the selected Source Group a new repetition is created in the Target Group.
However, the outcome is quite different, as modeling option 1 and 2 retain the inner data structure and option 3 dissolves the first repetition layer (Group *RSVP*).
The resulting Target documents for each option will be discussed below.

![DifferentSourceGroupExample out1](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/DifferentSourceGroupExample_out1.png)

Figure 35. Output Document of Modeling Option 1

As you can see in [Figure 35](#fig:mmwe:differentsourcegroupexample-out1), there are as many repetitions of the Group *Courses* as there are repetitions of *RSVP* in the Precomputed Document.
The number of repetitions of *FoodWishes* is transferred to *Dishes*.
No new structure is added to *WhoOrdered*, hence there is only one repetition for each *Dishes* repetition.

![DifferentSourceGroupExample out2](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/DifferentSourceGroupExample_out2.png)

Figure 36. Output Document of Modeling Option 2

In [Figure 36](#fig:mmwe:differentsourcegroupexample-out2) it can be seen, that the data structuring regarding the *FoodWishes* was transferred to *WhoOrdered*.
So there are again as many repetitions of the Group *Courses* as there are repetitions of *RSVP* in the Precomputed Document.
Since this repeatability is now "used up", only one repetition of *Dishes* is created for each *Courses*.
The number of repetitions of *FoodWishes* is now transferred to *WhoOrdered*.
There are as many repetitions of *WhoOrdered* as there were repetitions of *FoodWishes*.

![DifferentSourceGroupExample out3](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/DifferentSourceGroupExample_out3.png)

Figure 37. Output Document of Modeling Option 3

While both repetition layers of the Precomputed Document are retained in modeling options 1 and 2, this is not the case for option 3.
In [Figure 37](#fig:mmwe:differentsourcegroupexample-out3), one cannot tell which repetition of *WhoOrdered* stemmed from which repetition of *RSVP* of the Precomputed Document.
The repetition layer of *RSVP* was dissolved.

|  |  |
| --- | --- |
|  | In the example in [Figure 37](#fig:mmwe:differentsourcegroupexample-out3) the number of repetitions in *Courses* exceeds the repeatability of the Group. This would lead to an error and the abortion of the mapping process. The modeler has to make sure, that the actually occurring number of repetitions in the documents match the repeatability of the Target Model’s Groups. |

To rephrase the behavior of the Mapper:
In modeling option 1 the mapper starts with the first repetition of *RSVP* and creates the first repetition for *Courses*. Then it takes the first repetition of *FoodWishes* to create a new repetition for *Dishes*. It stays in the same repetition of *FoodWishes* while creating a repetition of *WhoOrdered*.
*Dishes* and *WhoOrdered* are connected to the same repetition of *FoodWishes*.
This can be seen by the "./" shown in the header element for *WhoOrdered*, it shows that it refers to the same Source Group as the parent Set of Field Mappings.
After all the repetitions of *FoodWishes* are processed, the second repetition of *RSVP* is treated.

In modeling option 2 the mapper starts with the first repetition of *RSVP* and creates the first repetition for *Courses* but stays in this repetition also for *Dishes*. It then goes through the repetitions of *FoodWishes* to fill *WhoOrdered*.
Here *Courses* and *Dishes* are connected to the same repetition of *RSVP*.
This can be seen by the "./" shown for *Dishes*, it refers to the same Source Group as *Courses*.

In modeling option 3 the mapper starts with the first repetition of *RSVP*, but it is not directly connected to a Target Group.
So the mapper goes directly into the first repetition of *FoodWishes*.
It then takes this repetition to create a new repetition in *Courses*, *Dishes* and *WhoOrdered* alike.
Here *Courses* and *Dishes* and *WhoOrdered* are all connected to the same repetition of *FoodWishes*.
This can be seen by the "./" shown for *Dishes* and *WhoOrdered*.

### Group Data by a Field Value

As can be seen in [Figure 37](#fig:mmwe:differentsourcegroupexample-out3), there is one repetition in *Courses* for each person who ordered something with exactly one repetition in the subordinate Groups.
But in order to have a structured overview, the data should be clustered by the *Course*.
And have the information about the course and the dish.

This can be achieved by setting `Find matching Repetition in the Target Document` using the Edit action in the context menu.

|  |  |
| --- | --- |
|  | Only Fields that have no Field Mapping in the current Mapping Block and have a compatible type to the selected **Lookup Source Field** are shown in the **Lookup Target Field** dropdown. Similarly, once a Lookup Target Field is selected, only matching Fields are shown in the Lookup Source Field dropdown. |

|  |  |
| --- | --- |
|  | None of the subordinate Field Mappings are executed if the Lookup Field is empty in the Source repetition. |

![EditDialogClusterByCourse](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/EditDialogClusterByCourse.png)

Figure 38. Settings to Cluster Data by Course (Because a Lookup Target Field Is Selected, Not All Fields Within Group FoodWhishes Are Offered as Lookup Source Field)

After saving this change, the output document would be the following:

![GroupingDataByFieldValue out1](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/GroupingDataByFieldValue_out1.png)

Figure 39. Output Document After Changing to `Find Matching Repetition in the Target Document` for Course

In a similar way, the settings for *Dishes* should be changed.

![EditDialogClusterByDishName](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/EditDialogClusterByDishName.png)

Figure 40. Settings to Cluster Data by DishName

The resulting Structural Mapping Model is shown in the [screenshot](#fig:mmwe:GroupingDataByFieldValue_SMM) below.

![GroupingDataByFieldValue SMM](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/GroupingDataByFieldValue_SMM.png)

Figure 41. Structural Mapping Model to Cluster Data by Course and DishName

This yields the following output document:

![GroupingDataByFieldValue out2](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/GroupingDataByFieldValue_out2.png)

Figure 42. Output Document After Changing to `Find Matching Repetition in the Target Document` Also for Dish

The courses and the two orders for "Pasta" are now grouped together.
The data is restructured according to our goal in the [sketch above](#fig:mmwe:restructuring-goal).

### Filter Data According to a Field Value

We want to order the main course from our favorite restaurant.
This means we need a list that only contains the information of the main course food wishes.

Since this selection is data-dependent, we need to define it in the **Precomputation Model**.
We can either create a new Precomputation Model or use the existing. For simplicity, the existing one is amended.
There we can define the following Computed Fields as siblings to *DishName* in Group *FoodWishes* :

| Computed Field | Precondition | Calculation |
| --- | --- | --- |
| ExternalOrder\_PersonName | [Course] == "Main" | [../PersonalData/Name] |
| ExternalOrder\_DishName | [Course] == "Main" | [DishName] |

This means, that only for the Main course these Fields are filled.
These computed Fields can be used in the Structural Mapping Model.

A new Target Document Model (ExternalOrder\_DM) and a new Mapping Model is with the following Structural Mapping Model is created:

![FilterDataByFieldValue smm](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/FilterDataByFieldValue-smm.png)

Figure 43. Adopted Structural Mapping Model to Use the Filtered Data

Executing this mapping using the [example data](#fig:mmwe:exampledata) yields the following output:

![FilterDataByFieldValue out1](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/FilterDataByFieldValue-out1.png)

Figure 44. Filtered Data Output After the Mapping

For more general information on how data can be selected, see [When Does No Data Transfer Happen](#txt:mapping:datasteering).

### What Happens if Data Is Already Present?

In [Consolidate Data of Different Source Documents Into a Repeatable Target Group](#txt:mapping:we_consolidate) we modeled a Mapper to compile a basic information overview.
Using the [example data](#fig:mmwe:exampledata) it yields the following output:

![ConsolidateData SMM AllFieldMappings out1](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/ConsolidateData_SMM_AllFieldMappings-out1.png)

Figure 45. Resulting Document With First Batch of Example Data

If we get more responses from our guests, we want to **add** this information to our existing list.
For example the following responses should be added:

![we datapriority in2](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/we_datapriority-in2.png)

Figure 46. Additional Responses

If the output document above ([Figure 45](#fig:mmwe:we_datapriority-out1)) is used as the initial target document and the mapper is run again with the additional responses ([Figure 46](#fig:mmwe:we_datapriority-in2)) as source documents, then we get the following output:

![we datapriority out2](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/we_datapriority-out2.png)

Figure 47. Resulting Document With Second Batch of Example Data

Since we used `Append new Repetition in the Target Document`, a new repetition is created for each new source document.
The initial data is kept unchanged.
But this might not be reasonable here.
Since we have unique *RSVP\_ID* values per guest, we can actually **update** the existing repetition for "Marguerite DuBuque".
`Find matching Repetition in the Target Document` can be used in combination with *RSVP\_ID* as the Lookup Field.
The Structural Mapping Model then is the following:

![we datapriority smm3](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/we_datapriority-smm3.png)

Figure 48. Structural Mapping Model to Update Existing Repetitions

|  |  |
| --- | --- |
|  | The existing Field Mapping for *RSVP\_ID* must be removed before the Target Field can be used as Lookup Target Field. |

If the first output document ([Figure 45](#fig:mmwe:we_datapriority-out1)) is used as the initial target document and the mapper is now run with the additional responses ([Figure 46](#fig:mmwe:we_datapriority-in2)) as source documents, then we get the following output:

![we datapriority out3](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/we_datapriority-out3.png)

Figure 49. Resulting Document With Second Batch of Example Data and Altered Structural Mapping Model

1. The Mapper found an entry for *RSVP\_ID* = "OC103T" and updated the information in this repetition.
2. For *RSVP\_ID* = "HX979K", no repetition was found and the respective data was added.
3. The third source document contains again data for *RSVP\_ID* = "OC103T".
   A warning is produced because the data is different from what was written in (1.).
   The Field instance of *ArrivalAt* is **not** touched again.

|  |  |
| --- | --- |
|  | A warning is produced if data is to be mapped into the same Field instance (same target repetition) and the data is different.  This is generally considered a modeling mistake.  Add a respective helper Field and Computation Rule to the Precomputation Model to make the Lookup Field or data Field unique. If the Lookup Field is empty in the Source, then none of the Field Mappings in the respective set of Field Mappings is executed.  It should be explicitly determined by the modeler which data shall be transferred. |

|  |  |
| --- | --- |
|  | Each time the Mapper is run and a target repetition is found where the Lookup Field values match, then  * Data that was already present in the initial target document is overwritten.    Data that was added externally or written during a previous Mapper run is overwritten. * Only the first Field Mapping for a Field Instance writes data.    Data that was written during the current Mapper run is untouched.    A warning is reported listing all subsequent Field Mappings that would write a different value into the same Field instance. |

### Consolidate Data of Different Groups Into One Repeatable Group

To give our friendly bar staff an overview of all the drinks that were ordered, we want to compile the following document:

![we consolidategroups goal](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/we_consolidategroups-goal.png)

Figure 50. Planned Data Consolidation From Source Document Model RSVP\_DM (Left) to Target Document Model AllDrinksPerPerson\_DM (Right)

As can be seen in [Figure 50](#fig:mmwe:we_consolidategroups-goal), we bring data of a non-repeatable and a repeatable source Group together.
This would work similarly for any number of non-repeatable and/or repeatable groups.

After dragging and dropping all the Source Fields on the respective Target Fields, we get the following Structural Mapping Model:

![we consolidategroups step1](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/we_consolidategroups-step1.png)

Figure 51. Initial Structural Mapping Model After Drag&Drop

Because the automatically selected Source Groups for the *Drinks* repetition layer would conflict each other, they are placed into two different Mapping Blocks.
`/RSVP/` and `/RSVP/DrinkWishes` cannot be used as Source Groups for the same Target Group in one Mapping Block because the first is an ancestor of the second. The resolution of repetition layers would be ambiguous in this case.

Executing this model with the sample data in [Figure 25](#fig:mmwe:exampledata) would give the following result:

![we consolidategroups out1](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/we_consolidategroups-out1.png)

Figure 52. Output Document for [Figure 51](#fig:mmwe:we_consolidategroups-step1)

[Output Document for Figure 51](#fig:mmwe:we_consolidategroups-out1) has one repetition per *RSVP* document because there are two Mapping Blocks in [Initial Structural Mapping Model After Drag&Drop](#fig:mmwe:we_consolidategroups-step1) and each of them specifies to `Append new Repetition in the Target Document` for *Persons*.

Right now we cannot move the Field Mapping for *DrinkName* over to the other Mapping Block.
We must first change the Source Group assigned to *Drinks* in the first Mapping Block to *Arrival*.

![we consolidategroups step2](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/we_consolidategroups-step2.png)

Figure 53. Structural Mapping Model After Adopting the Source Group and Moving the Field Mapping

[Structural Mapping Model After Adopting the Source Group and Moving the Field Mapping](#fig:mmwe:we_consolidategroups-step2) leads to the correct output as shown in [Figure 54](#fig:mmwe:we_consolidategroups-out2).

![we consolidategroups out2](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/we_consolidategroups-out2.png)

Figure 54. Output Document for [Figure 53](#fig:mmwe:we_consolidategroups-step2)

Note, that the *WelcomeDrink* is always added first, if there was one selected.
The order of the repetitions in the target document reflects the order of the sets of Field Mappings in the editor.
See also [Order of the Target Repetitions](#txt:mapping:we_dataorder).

### Split Data of One Source Repetition Into Different Target Repetitions

To get an overview of all the items (food, drinks, nibbles) that were requested, we want to restructure the data as shown in [Planned Data Consolidation From Source Document Model RSVP\_DM (Left) to Target Document Model TotalFoodAndDrinks\_DM (Right)](#fig:mmwe:we_dataorder-goal).
For each of the entries *DishName*, *DrinkName*, *Nibbles* a new repetition in *Items* should be created.
This means, that the pairs of *DrinkName* and *Nibbles*, that are in one repetition of the Source document, should be split into separate repetitions in the Target document.

![we dataorder goal](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/we_dataorder-goal.png)

Figure 55. Planned Data Consolidation From Source Document Model RSVP\_DM (Left) to Target Document Model TotalFoodAndDrinks\_DM (Right)

After dragging and dropping the Source onto the Target Fields, the following Structural Mapping Model would result:

![we dataorder1](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/we_dataorder1.png)

Figure 56. Initial Structural Mapping Model

Executing this model with the sample data in [Figure 25](#fig:mmwe:exampledata) would give the following result:

![we dataorder out1](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/we_dataorder-out1.png)

Figure 57. Output Document for [Figure 56](#fig:mmwe:we_dataorder1)

In there, *DrinkName* and *Nibbles* are kept together.
The Structural Mapping Model editor tries to group Field Mappings from the same Source Group into one set of Field Mappings for the same Target Group.
But this is not according to our requirement.
Use the [Move](#txt:smm:moveFieldMapping) action in the context menu for the Field Mapping for *Nibbles* to move this to a new Mapping Block.

![we dataorder2](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/we_dataorder2.png)

Figure 58. Structural Mapping Model After Moving the Field Mapping for *Nibbles* to a New Mapping Block

Executing this model with the sample data in [Document Model Structure of RSVP\_DM (Left Tree) and Three Example Documents](#fig:mmwe:exampledata) would give the following result:

![we dataorder out2](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/we_dataorder-out2.png)

Figure 59. Output Document for [Figure 58](#fig:mmwe:we_dataorder2)

Now there is one repetition for each value.
Note, that there is no empty repetition for the "missing" Nibble for the "Still Water".
New repetitions are only created if a value is transferred into this repetition.

### Order of the Target Repetitions

The order of the data in the Target document is determined by the order of:

1. the Mapping Blocks (left to right)
2. the sets of Field Mappings (left to right)
3. the repetitions of the assigned Source Group (as defined in the source documents)

By moving the Field Mapping for *Nibbles* into a new Mapping Block, there are two Mapping Blocks in [Figure 58](#fig:mmwe:we_dataorder2).
The first contains the Field Mappings for *DishName* and *DrinkName*, while the second contains the Field Mapping for *Nibbles*.
Note, that there is currently no visual difference between sets of Field Mappings and Mapping Blocks in the editor.
Use the [Move Dialog](#txt:smm:moveFieldMapping) to see the current Mapping Block of a Field Mapping.

This leads to the following data order when executing this Mapping:

1. The first Mapping Block (with Field Mappings for *DishName* and *DrinkName*) is executed.
2. For the Repeatable Target Group *Items* exist two sets of Field Mappings in the first Mapping Block. The left most is executed first (data from Source Group *FoodWishes* is transferred first).
3. All instances of *FoodWishes* in the Joined Precomputation Document (the Structural Mapping Source) are processed.

   So the values "Tom yum", "Café e cornetto", "Pasta", "Chocolate with churros", "Pasta" and "Fries" are transferred.
4. For the Repeatable Target Group *Items* exist two sets of Field Mappings in the first Mapping Block. After the left most was executed, the second one is executed (data from Source Group *DrinkWishes* is transferred).
5. All instances of *DrinkWishes* in the Joined Precomputation Document (the Structural Mapping Source) are processed.

   So the values "Daiquiri", "Espresso Martini", "Virgin Colada", "Still Water", "Virgin Gin Tonic" are transferred.
6. After the first Mapping Block was executed, the second one is executed.
7. For the Repeatable Target Group *Items* exists one set of Field Mappings in the second Mapping Block. It is executed (data from Source Group *DrinkWishes* is transferred).
8. All instances of *DrinkWishes* in the Joined Precomputation Document (the Structural Mapping Source) are processed.

   So the values "French Toast Bites", "Crisps", "Crisps", "Pretzel sticks" are transferred.

While this output fulfills our business requirement already, we might want to have a different order: First all drinks, then all the food.
To achieve this, we move the Field Mapping for *DishName* to the second Mapping Block. (We could also create a new third Mapping Block but the result would not be different in this example.)

![we dataorder3](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/we_dataorder3.png)

Figure 60. Output Document for [Figure 58](#fig:mmwe:we_dataorder2)

Executing this model with the sample data in [Document Model Structure of RSVP\_DM (Left Tree) and Three Example Documents](#fig:mmwe:exampledata) would give the following result:

![we dataorder out3](https://geta12.com/docs/2025.06/ext5/sme/sme-mm-ba-docs/assets/workedexample/we_dataorder-out3.png)

Figure 61. Output Document for [Figure 60](#fig:mmwe:we_dataorder3)

## Mapping Recipes

The following section showcases frequently used mapping scenarios at an abstract level.

### How to Steer Which Data Is Transferred

Which data is transferred into the target document depends on a number of factors.
Those can also be used to selectively exclude data from the transfer.

1. With the Source Document Models:
   Only valid documents, regarding Formal and Rule Validations, are accepted as source documents.
   Adding specific Validation Rules to the source Document Models can be used to exclude whole source documents from the mapping.
2. With the Precomputation Model:
   If a value should only be transferred depending on data of the (other) source or the initial target document, a helper Field and a Computation should be added to the Precomputation Model.
   The whole power of the Kernel Language can be used to specify the condition that must be met.
   The Calculation term then just needs to reference the original source Field.

   For an example see the [worked example](#txt:mapping:we_datafiltering).
3. With the Structural Mapping Model:
   A data transfer happens only if the Source Field instance is filled.
   It is not possible to transfer an `empty` value to the target document.

   Similarly, a new repetition is only added if at least one subordinate Field Mapping transfers data.
   No empty repetitions are created in the target document.

### Transferring Data From a Non-Repeatable Into a Non-Repeatable Group

* Source has Repetitions = 1 in Mapping Model
* and Group is non-repeatable in the Source Document Model itself.
* Target Fields have no layer of repeatability.

Create Field Mapping simply via Drag & Drop in the Structural Mapping Model. No Precomputation needed.

### Transferring Data From a Repeatable Into a Non-Repeatable Group

* Source has Repetitions > 1 in Mapping Model
* or Group is repeatable in the Source Document Model itself.
* Target Fields have no layer of repeatability.

Define the data aggregation in the Precomputation Model.
Add a new non-repeatable root Group and respective helper Fields and Computation Rules there.

Create Field Mapping by dragging & dropping the created helper Fields to the respective target Fields.

### Transferring Data From a Repeatable Into a Repeatable Group

* Source has Repetitions >= 1 in Mapping Model
* or Group is repeatable in the Source Document Model itself.
* there is at least one layer of repeatability in the target document.

Create Field Mapping simply via Drag & Drop.
Precomputation is only needed if not all repetitions in the sources shall be treated individually.

|  |  |
| --- | --- |
|  | The number of repetition layers in the Structural Mapping Source and the Structural Mapping Target does **not** have to be equal. It is possible to "jump repeatability levels".  See the [Worked Example](#txt:mapping:we_sourcegroup). |

### Adding Data to Matching Repetitions of the Target Document

* two repeatable Groups are in the Source
* one repeatable Group is in the Target Model

#### Matching by a Common Field (Index Field)

This is the standard use case of the Structural Mapping.
After creating the first Field Mapping in the Structural Mapping Model, open the [Edit Dialog](#txt:smm:edittargetrepetition) for the appropriate Target repetition layer and select `Find matching Repetition in the Target Document` as well as the Lookup Fields in the Source and Target Groups.
Note, that they all must be of matching types.

|  |  |
| --- | --- |
|  | If the Lookup Fields are both defined as Index Fields in the respective Document Models, they are automatically recognized as LookUp Fields.  But they do not have to be defined as Index Fields. |

#### Matching by Source Repetition Index

Create a helper Field in the Precomputation Model for each source Group.
Add a Computation Rule with calculation `CurrentRepetition(RuleGroup)`.

Add a Number Field to the targeted repeatable group in the Target Document Model (not the Precomputation Model). No computation is needed.

Follow the recipe [Matching by a Common Field (Index Field)](#txt:recipes:MatchByLookUpField) and select the helper Fields as Lookup Fields.

Note that different or empty values in the initial target document are ignored.
Repetitions where the helper Field has values like '0' or '-1' will stay untouched.
But if a value in the initial target document coincides with a source repetition’s index, then values in this repetition might be changed.
To make sure that all repetitions of the sources are transferred without changing initial target data, use a dedicated helper Field in the Target Document Model. (Do not switch to `Append new Repetition in the Target Document`.)

#### Matching by Target Repetition Index

Create a helper Field in the Precomputation Model for each source Group.
Add a Computation Rule with calculation `CurrentRepetition(RuleGroup)` .

Add a Number Field to the targeted repeatable Group in the Target Document Model (not the Precomputation Model).
Add a Computation Rule with calculation `CurrentRepetition(RuleGroup)`.
Assure, that the helper Fields are correctly computed before the Mapper is invoked. (Take extra care if the helper Field is marked as `Transient`.)
The Mapper does **not** perform Computations on the initial Target document.

Follow the recipe [Matching by a Common Field (Index Field)](#txt:recipes:MatchByLookUpField) and select the helper Fields as Lookup Fields.

### Transferring Data While Conserving the Inner Structure

This is the standard behavior of the Mapper.
Create the Field Mappings as usual.
Make sure that the paths leading to the Field Mapping elements add only the correct relative parts to the total path of the Source Field.

### Transferring Data and Breaking up the Inner Structure

Data of the same Source-substructure should be transferred into different repetitions of the target repeatable group.

Different Mapping Blocks for the sets of Field Mappings that belong together are needed:

1. Create the Field Mapping of the first set as usual.
2. Create the Field Mapping of the next set as usual.
3. Select "Move" from the context menu of the last added Field Mapping. In the following dialog select `Create new Mapping Block`.
4. Add the following Field Mappings. Move them to the correct Mapping Block if necessary.

|  |  |
| --- | --- |
|  | A new Mapping Block is automatically created if two Fields from the same innermost Source repeatable Group are dropped onto the same row of the Structural Mapping Target tree. |

### Order of Repetitions in the Target Document

The Mapping Blocks are executed from left to right as seen in the editor.
If data of different Source Groups is mapped into the same Target Group within the same Mapping Block, then the order is defined by the order of the elements in the Structural Mapping Model.
The Mappings, as seen in the editor, are executed from left to right.

If the Field Mappings were not modeled in the right order, then they can be repositioned with the [Move](#txt:smm:moveFieldMapping) action in their context menu.
Moreover, new Mapping Blocks can be created with this action.

See [Order of the Target Repetitions](#txt:mapping:we_dataorder) for an example with data.
