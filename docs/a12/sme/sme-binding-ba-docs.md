---
source: https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/index.html
category: sme
docid: sme-binding-ba-docs
scraped: 2026-06-12
---

# Form Modeling – Binding

This documentation is intended for a business analyst audience. Some prior knowledge of the tools is assumed.

## Bindings and Form Models

The UI configuration for displaying Relationship UI components within a form requires adding special elements called "*Bindings*" to an existing *Form Model*. Adding these elements is done within the [Form Modeling Module](https://geta12.com/docs/SME/sme-fm-ba-docs/index.html) (FMM) of the Simple Model Editor (SME).

The Bindings are shown in the Screen view of the FMM with their name and special icons that already hint to the configured relationship UI component. They can also be copied, pasted, moved to a different position, and deleted like other screen elements.

### Adding Bindings

Bindings can be added to the Screens of the Form Model at the same places where Sections could be added.

There are two ways to add Bindings:

* via the context menu of existing elements in the Form Model Tree
* via drag and drop of a Relationship Model from the list in the Data Models panel on the right side.

#### Via Context Menu

![add binding](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/add_binding.png)

Figure 1. Adding a New Binding via the Context Menu

The Form Model to which you want to add a Binding needs to reference a Document Model that takes up a role in the Relationship. If the Relationship uses a heterogeneous Supertype Document Model, the Form Model can also reference one of its Subtypes instead.

It will then be possible to create a link to the other role, the **Target Role**, in the Binding.

![add binding details](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/add_binding_details.png)

Figure 2. Select the Relationship and Target Role

#### Via Drag and Drop

When a Binding is added via drag and drop, the Relationship is prefilled based on the dragged Relationship Model.

The target role is prefilled with the role of the side in the Relationship Model that is **not** using the referenced Document Model of the open Form Model or one of its Supertypes. When both sides of the Relationship use such a Document Model, the target role needs to be filled by the user.

![add binding dnd](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/add_binding_dnd.png)

Figure 3. Adding a New Binding via Drag & Drop

|  |  |
| --- | --- |
|  | One current shortcoming is that when dragging an element from the Data Models view to the Screen view, container elements are not automatically expanded when hovering over them with the drag item.  This means the drag target currently needs to be already visible in the Screen view before starting the drag, which might require expanding any container elements manually beforehand. |

### Editing the Binding Content

There are 3 component types available that are productive: the Dropdown Selection, the Dual Pane Selection and the Table List.

![component types](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/component-types.png)

Figure 4. Component Types

The fields which are displayed in a Relationship UI can be determined during modeling.

Picking up an example mentioned above: In a **Person-Company** relationship, you might have a Form Model for **Person** and one for **Company**. If you add a Binding to the **Person** form, you can maintain links to a **Company** there. Hence, the role **Company** is the target role of the Binding in the **Person** form. It works vice versa as well: a Binding in the **Company** form can maintain links for the target role **Person**.

A Relationship UI component requires a special set of Overview Models: One to support the display of the available items (also "candidates") and one to display the selected items (also "links"). The Overview Model to display the available items needs to reference the Document Model of the target role of the Relationship. The Overview Model to display the selected items or links needs to reference the *generated* Document Model for the target role of the Relationship.

|  |  |
| --- | --- |
|  | Sorting is supported for available items only; it is not supported for selected items.  * If no default sorting is specified, the candidate list is sorted by `__meta/createdAt` in descending order. * Case is ignored during sorting (`ignoreCase` is set to true). |

The ***Available Items Page Size*** and the ***Selected Items Page Size*** are the page size of the available items and the selected items respectively.

* The ***Drop-Down*** needs only ***Available Items Page Size***.
* The ***Table List*** needs only ***Selected Items Page Size***.
* The ***Dual Pane*** needs both ***Available Items Page Size*** and ***Selected Items Page Size***.

If a page size is not set, the Binding view will display 10 items per page for the respective list.

|  |  |
| --- | --- |
|  | * Page size must not exceed the `query.pageRequest.pageSizeLimit` from [Data Services' Query Configuration](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#query-configuration); otherwise, an error will be returned from the Data Services. To resolve this, either the configured page size must be reduced, or the Data Services' `query.pageRequest.pageSizeLimit` must be increased. * Same problem occurs when page number is larger than the `query.pageRequest.pageNumberLimit` of [Data Services' Query Configuration](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#query-configuration). Increase the Data Services configuration to resolve it. |

You can create those Overview Models like any other Overview Model in the SME and then select them in the Binding Editor. The Binding Editor will only let you select an Overview Model which references the correct Document Models.

![binding view](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/binding_view.png)

Figure 5. Select/Edit Overview Models or Create New Ones

The Binding Editor can also support you in the creation of those specific Overview Models.
If you select "Add" (plus icon) for the available or selected items overview, a special Overview Model Editor will open up in a modal.

![add binding OME modal](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/add_binding_OME_modal.png)

Figure 6. New Overview Model as a Modal in the Binding Editor

The Document Model reference will be pre-filled depending on the Overview Model you intended to create. A model name will be suggested that follows the optional naming convention *RelationshipName\_TargetRoleName\_AvailableItemsOverview* or *RelationshipName\_TargetRoleName\_SelectedItemsOverview*, respectively. Roles and locales are pre-filled according to the referenced Document Model.

The settings you can make in this special Overview Model Editor will be limited to the settings that will be used for the display of the Binding, hence are available in the Relationship UI.

|  |  |
| --- | --- |
|  | Not all settings that can be made will be used in each Binding view type. |

You need to add at least one column to those Overview Models in order to save them. The target folder for saving is the folder in which the Form Model is located. An export will be triggered as well when saving the Overview Model as *Binding Overview Model*. The Overview Model has an identifier in the Workspace Explorer and the limited Overview Model Editor will also open if you open it from here. An information will be shown in which form(s) and Binding(s) the respective Overview Model is referenced.

![example infoBindingOverview](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/example_infoBindingOverview.png)

Figure 7. Binding Overview Model information toast

After the creation of a new Binding Overview Model in the Binding Editor for either the selected or available items overview, it will be automatically selected as reference.

If you selected an additional fields Document Model for your Relationship, you will need a Form Model in which those additional link fields can be maintained. This Form Model will have to reference the additional fields Document Model and must contain at least a button with some event to save. Again, the Binding Editor will only let you select Form Models which reference the correct Document Model.

|  |  |
| --- | --- |
|  | You can add columns of the additional link fields for the Selected Items Overview since the *\_\_generated* Document Model includes them. |

To edit the referenced Overview Model for available or selected items, click the "Edit" button (pencil icon).

![edit binding OME modal](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/edit_binding_OME_modal.png)

Figure 8. Edit Selected Overview Model for Binding

|  |  |
| --- | --- |
|  | The Edit button will be disabled when the Overview Model is empty or invalid. |

If you finished the settings for your desired Relationship UI, you can save the Binding Editor and then save the Form Model containing your Bindings.

|  |  |
| --- | --- |
|  | In the exported Form Model the configuration details of all Bindings are stored together in a hidden model header Annotation called "bindingConfiguration".  In the Form Model Screens `Custom Screen Elements` are inserted at the positions of the Binding elements.  The FMM does not support Bindings on Controls. |

### Built-in Relationship UI Components

#### Dropdown Selection

If the target role has a link constraint with an upper limit of 1, a drop-down can be used to maintain and display a link / selected item.

![binding editor for drop down](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/binding_editor_for_drop_down.png)

Figure 9. Binding Editor for DropDown Selection

The Dropdown Selection appears as a Control in the form with an autocomplete widget. In the Control, the currently linked document is displayed. In the drop-down, all available documents that can be linked are displayed. Selecting a different document from the drop-down removes a prior existing link since only one document can be linked in this case. Additional link fields can be displayed when clicking on the "Additional Properties" icon next to the arrow in the drop-down field.

![RM dropdown](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/RM_dropdown.png)

Figure 10. Dropdown Selection

Only the first column of the Available Items Overview or Selected Items Overview Models will be displayed. It can be either a reference field or an expression column. The Overview Models for available and selected item do not need to match, but be aware that this will lead to the fact that different information is displayed in the selection list than in the field (after a selection is made).

If no document is linked yet, all documents are listed as candidates in the drop-down list. If the user starts typing into the Control, a [Simple Search](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#simple-search-operator) is performed to filter the number of displayed documents. Note that this comes with benefits (match not just by the displayed text, but by all available fields of the document) and drawbacks (currently not all field types searchable).

In the example pictured below, which is taken from the e-Commerce sample Workspace for the Preview Application, a drop-down is available to assign a Brand to the Product that is displayed in the form.

![DropdownRel](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/DropdownRel.png)

Figure 11. A Drop-Down Embedded in a Form

When the Drop-Down Selection should be displayed next to other form inputs, a Multi-Column Section could be used.

#### Dual Pane Selection

If the target role has a link constraint with an upper limit > 1 or unbounded, a dual pane can be used to maintain and display links. On the left side, all available documents of the target role are displayed. A link can be created by clicking on the "+" icon in the row of the respective document. Documents that have already been linked to the document which is currently opened are displayed with a grey background.

![RM dualpane](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/RM_dualpane.png)

Figure 12. Dual Pane Selection

On the right side of the dual pane, all existent links of the currently opened document are displayed. The additional linked fields, if present, can be changed via the "Additional Properties" icon in the row of the respective document. Clicking on the "-" icon removes the link to this document.

![Dualpane](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/Dualpane.png)

Figure 13. A Dual Pane Embedded in a Form

There are a few settings for the dual pane:

* Height: Determines the total height of the dual pane without its labels in pixels

  + fix value
  + default: 328 px - enough to fit three candidate rows without a scrollbar if the form is displayed on a desktop screen
* Available Items Page Size: Determines the amount of rows per page of the available items.
* Selected Items Page Size: Determines the amount of rows per page of the selected items.
* Labels: Multilingual labels that are displayed above the available items or selected items table

  + The available locales are the ones from the Form Model settings.
  + If not modeled, the values for the labels are taken from the localizer resource bundles.

![binding editor for dual pane](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/binding_editor_for_dual_pane.png)

Figure 14. Binding Editor for Dual Pane Selection

The width of the dual pane dynamically takes up all available space. To scale the width of the dual pane, you can use a Multi-Column Section in the FMM around the dual pane section.

The columns which are displayed in a dual pane are determined by the columns of the Overview Models for the Available Items Overview or Selected Items Overview, respectively. Besides the columns, the following settings of the Overview Model will be used in a dual pane:

* all column settings
* show/hide filter and filter configuration
* styles
* placement of sub-header elements

|  |  |
| --- | --- |
|  | Filtering is not available for the selected items/links and that’s why the respective setting is not supported in the Binding Overview Model Editor. |

#### Table List

A read-only possibility to display links is a Table List. There, Relationship links that have already been created are displayed.

![RM tablelist](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/RM_tablelist.png)

Figure 15. Table List - Left: With Edit Button - Right: Without Edit Button

To have a Table List with an "Edit" button, select ***Has Edit Modal***, then the ***Edit Modal Component*** section will appear with a Dual Pane Selection as Component Type and according settings.

![RM BindingTableListEdit](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/RM_BindingTableListEdit.png)

Figure 16. Binding Editor for Table List With Edit Button

To customize this modal, there are a few settings for the TableList view under the section Edit Modal Properties:

* Width: Determines the width of the edit dialog in pixels.

  + fix value - If larger than the screen width, the dialog will be as wide as the screen width minus a small margin on both sides.
  + default: 1200 px
* Labels: Multilingual labels for the title and the cancel and close buttons of the Edit Dialog

  + The available locales are the ones from the Form Model settings.
  + If not modeled, default values will be used for the labels which are taken from the localizer resource bundles.

When ***Has Edit Modal*** is not selected, a Table List without an Edit button is embedded in a form.

![ListView](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/ListView.png)

Figure 17. A Table List Embedded in a Form

The columns which are displayed in the Table List are determined by the columns of the Overview Model for the Selected Items Overview.

### Labels in Relationship Views

In the Relationship Model as well as the Binding, different labels can be maintained that will be displayed above or in Relationship views. All labels are optional.

#### Dropdown Selection

The label of the target role, which is maintained in the Relationship Model, will be displayed above the drop-down:

![RM Label Dropdown](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/RM_Label_Dropdown.png)

#### Dual Pane Selection

The label of the target role, which is maintained in the Relationship Model, will be displayed above the dual pane. The labels maintained in the Binding will be displayed above the respective item list.

![RM Label DualPane](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/RM_Label_DualPane.png)

#### Table List

The label of the target role, which is maintained in the Relationship Model, will be displayed above the Table List.

![RM Label TableList](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/RM_Label_TableList.png)

#### Section Labels for Relationship Views

Instead of or in addition to the labels that are displayed above Relationship views, it is also possible to display Section labels. To achieve that, the Binding needs to be wrapped in another Section. The label of the wrapping Section can then be used to display another type of label above the Relationship view.

Examples for the Section label on top of the target role label are displayed below. If the target role label (maintained in the Relationship Model) is empty, only the Section label is displayed.

![RM Label Dropdown Wrapped](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/RM_Label_Dropdown_Wrapped.png)

Figure 18. Dropdown Selection with target role label and Section label

![RM Label DualPane Wrapped](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/RM_Label_DualPane_Wrapped.png)

Figure 19. Dual Pane Selection with target role label and Section label

![RM Label TableList Wrapped](https://geta12.com/docs/2025.06/ext5/sme/sme-binding-ba-docs/assets/RM_Label_TableList_Wrapped.png)

Figure 20. Table List with target role label and Section label

### Maintaining and Displaying Additional Link Fields in a Binding

To add or edit additional link fields, a modal is displayed. The content of the modal is determined by the Form Model which refers to the additional link fields' Document Model. If additional link fields are part of the Relationship, the respective Form Model has to be referenced in the Binding.

When adding a link, the modal to maintain the additional link fields automatically appears. To edit additional link fields for existing links, you can use the "Additional Properties" icon in the dual pane or drop-down. Additional link fields can be displayed in a selected items overview column in a dual pane or table view.
