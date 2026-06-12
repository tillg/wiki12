---
source: https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/index.html
category: sme
docid: sme-om-ba-docs
scraped: 2026-06-12
---

# Overview Modeling

This documentation is intended for a business analyst audience. Some prior knowledge of the tools is assumed.

## The Overview Model

The Overview Model is a user interface model designed to present lists and tables.
While forms are primarily used to collect data from users, business applications often require tables to display selected aspects of datasets in an organized manner, as illustrated in [Overview Table for Listing Products](#fig:overviewmodel:Overview-table-example).
This is the primary purpose of the Overview Model.

![OverviewTableExample](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/OverviewTableExample.png)

Figure 1. Overview Table for Listing Products

## Creating a New Overview Model

To add a new Overview Model, first select a Workspace within the SME.
Click the ***Open Workspace*** button to browse to the directory where all project-related models are saved.

![OpenWorkspace](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/OpenWorkspace.png)

Figure 2. Open a Workspace

Alternatively, you may select a recent workspace.

Next, click ***Add/Overview Model***.

![AddOverviewModel](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/AddOverviewModel.png)

Figure 3. Add New Overview Model

A dialog will be displayed with the following fields:

* ***Folder:*** The location where the new model will be saved.
* ***Name:*** The name of the new model, which should match the file name.
* ***Document Model:*** The referenced Document Model. Use the drop-down to select one from the Workspace.
* ***Locales:*** The list of supported locales. Use commas to separate locales, for example, "en, de".
* ***Roles:*** The roles that can access this model.

Locales and Roles are added automatically after selecting the ***Document Model***.
Click the ***OK*** button; Name, Locales, and Roles will be pre-filled in [Model Settings](#model-settings), and the Document Model will be set in [General Settings](#general-settings).

![AddOverviewDialog](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/AddOverviewDialog.png)

Figure 4. New Overview Dialog

### Model Settings

In the **Model Settings** tab, **Name**, **Locales**, and **Roles** are filled from the **Add Dialog**.

**Model Version** is based on the SME version and cannot be changed.

![OverviewHeaderInfo](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/OverviewHeaderInfo.png)

Figure 5. Overview Header Details

#### Locales

For a multilingual application, the supported locales can be defined as part of the model settings. Click the **ADD** button in the **Locales** section to add new locales. The default value is "en" for English. Additional country codes can be added for multilingual support by using the locale code (for example, "en\_GB", "en\_US", etc.).

![Locales](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/Locales.png)

Figure 6. Locales

#### Labels and Subtitles

![LabelAndSubtitleInOverviewEngine](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/LabelAndSubtitleInOverviewEngine.png)

Figure 7. Label and Subtitle in Overview Engine

The label is displayed in the header at the top of the table. It is also used as the table’s aria-label for accessibility.
The subtitle is the small text below the label.

Label and subtitle are multilingual, so for each locale the corresponding value can be specified.

Checking the **Hide Label** checkbox will only hide the model label at the header. The aria-label of the table will still be available.

![LabelsAndSubtitles](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/LabelsAndSubtitles.png)

Figure 8. Multilingual Labels and Subtitles

|  |  |
| --- | --- |
|  | If there is no label or it is hidden, then **Label**, **Subtitle**, and **[Number of Entries](#_number_of_entries)** will not be shown. |

#### Roles and Annotations

The roles that you can assign to your model are taken from a YAML file in the Workspace. If you have created your Workspace using the Preview App Control, this file is in the "user" folder and is called "access-rights.yaml". If no valid YAML file is visible to the SME, then the drop-down will be blank and the assignment of roles is optional.

An Annotation is a name-value pair that can be added to the model and some model elements. The application that contains the Overview Model can access those Annotations and use them within a custom implementation, for example, to show all fields that have an Annotation in boldface.

To apply an Annotation, fill in the inline repeat with name/value pairs.

![Annotations](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/Annotations.png)

Figure 9. Adding an Annotation

### Overview

The **Overview** tab contains the following sections:

* General Settings
* Columns
* Default Sorting
* Features
* Styles

![TabOverview](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/TabOverview.png)

Figure 10. Tab Overview

#### General Settings

The Overview Model can be based on a Document Model or a Query Model.
By default, the Overview Model is based on a Document Model and a drop-down ***Document Model*** is shown.
All Document, Combined Document and Composed Document Models of the Workspace are listed.

![DocumentModel](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/DocumentModel.png)

Figure 11. Document Model Reference

It is also possible to model the Overview Model based on a Query Model.

|  |  |
| --- | --- |
|  | Usage of a Query Model and the Query Model itself are an experimental feature. |

To use a Query Model, select `Use a Query Model as Reference`.
A drop-down ***Query Model*** is shown that lists all Query Models of the Workspace.

![QueryModel](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/QueryModel.png)

Figure 12. Query Model Reference

It is possible to create a new Query Model by clicking the ADD button (plus icon) next to the drop-down.
Via this button, a Query Model that fits to the Overview Model will be created.

![AddReferenceQueryModel](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/AddReferenceQueryModel.png)

Figure 13. Add Reference Query Model

When creating a new Query Model, the Document Model referenced in the Overview Model is prefilled as Target Document Model.

If the "Create Query based on Overview Model" switch is turned on, the created Query Model will contain the following information from the Overview Model:

1. Fields included in Result Set for the Target Document Model Element; derived from the Column definitions of the Overview Model
2. Paging specification
3. Sorting specification; derived from the Default Sorting of the Overview Model

The created Query Model is opened directly in the Query Model Editor while the Overview Model Editor is still open in the background.

It is also possible to edit a selected Query Model by clicking the EDIT button (pen icon) next to the drop-down.

The Overview Model Editor will suggest only Fields for reference in Columns and Expressions, that are marked as In Result in the Query Model.

|  |  |
| --- | --- |
|  | The Fields in Result Set of the Query Model will be overwritten by the Overview Engine at runtime according to the Fields used in the Overview Model and those specified by the developer. The Paging and Sorting specifications of the Query Model will be overwritten by the Overview Engine with the settings of the Overview Model and according to the end user interaction.  If the Query Model specifies 'Exclude All Root Documents', then the result is not digestible for the Overview Engine. Such Query Models cannot be used without Custom Code. |

The selected Query Model will be used at runtime by the Overview Engine and end users will only see documents, that are results of the query.
It is not possible for an end user to remove restrictions placed by the Query Model.
However, it is possible to add more Filters (Constraints) to the query and to limit the documents listed in the overview further.
These additional Filters can be set by the end user or by a developer.

For more information about the Query Model please refer to the [Query Modeling Documentation](https://geta12.com/docs/sme/sme-qm-ba-docs/index.html).

#### Columns

Click the **ADD** button in this section to open a detached repeat screen and add a new column.

![Columns](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/Columns.png)

Figure 14. Columns

There are two column types: [Reference Column](#reference-column) and [Expression Column](#expression-column).
By default, the ADD screen will display a Reference Column. To add an Expression Column, change **Column Type** to **expression**.

|  |  |
| --- | --- |
|  | Fields whose data is shown in the Overview must be indexed. Using fields with the Annotation "indexed" = "false" in [Element Reference](#element-reference), [Dynamic Suffix](#column-dynamic-suffix), or [Expression](#_expression) will lead to an error in the Simple Model Editor. |

##### Reference Column

A Reference Column defines which field from the Document Model will display via **Element Reference**.
In addition to the [Common Settings](#column-common-settings), it has special features based on its data type:

* **Sortable**: for non-multi-select types
* **Display Mode**: for attachment or multi-select groups only
* **Suffix** and **Summary**: for number fields only

###### Element Reference

A drop-down called **Element Reference** is populated with non-repeatable fields from the Document Model in a group/field structure as shown below:

![ElementReference](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ElementReference.png)

Figure 15. Selecting

Because data from fields in repeats are not unique, the Overview Model cannot use fields from repeatable groups as Element References.

|  |  |
| --- | --- |
|  | For data type multi-select, the child field may be an enumeration or a string (for external enumeration). Since Overview Engine does not support external enumeration yet, multi-select with string field is not supported either. |

###### Sortable

There is a checkbox for determining if the column should be sortable. If selected, **Preferred Sorting** is set to **Ascending** by default and can be changed to **Descending** from the drop-down. Case is ignored during sorting (`ignoreCase` is set to true).

![Sortable](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/Sortable.png)

Figure 16. Sortable Checkbox and Preferred Sorting

|  |  |
| --- | --- |
|  | Sortable is not allowed for data type multi-select. |

###### Display Mode

This option is for attachment or multi-select only. The attachment can be displayed as:

* **Preview**: display supported images. For other file types, an icon will be shown instead.
* **Icon with file name**: display file icon and file name.
* **Icon**: display file icon with file name shown as title.
* **File name**: display file name only.

The multi-select can be displayed as:

* **Default**: display as a bullet list when [row height](#row-height-and-action-column-width) is not set. Otherwise, it will be a comma-separated list.
* **Comma Separated**: always display as a comma-separated list.

![ColumnDisplayMode](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ColumnDisplayMode.png)

Figure 17. Display Mode

###### Suffix

![Suffix](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/Suffix.png)

Figure 18. Suffix

This optional configuration is for number fields only.
The Suffix is multilingual and will be displayed after the number fields in the overview column.
If these number fields appear in the filter, the suffix will be applied for the filter too.

There are two ways to configure a suffix:

* **Static suffix**: fill suffix value for each locale and make sure **Use Dynamic Suffix** is unchecked.
  In this way, all rows in the Overview Engine will have the same suffix.

![SuffixInOverviewTableAndFilter](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/SuffixInOverviewTableAndFilter.png)

Figure 19. Static Suffix in Overview Table and Filter

* **Dynamic suffix**: once **Use Dynamic Suffix** is checked, an enumeration field can be selected to be used as the suffix.

![DynamicSuffix](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/DynamicSuffix.png)

Figure 20. Use Dynamic Suffix

In this way, each row can have a different suffix. In the example below, the user can see the salary payment together with the referenced currency.

![DynamicSuffixInOverviewTableAndFilter](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/DynamicSuffixInOverviewTableAndFilter.png)

Figure 21. Dynamic Suffix in Overview Table and Filter

It is possible to pick a dynamic suffix as a filter condition. Only one suffix is allowed to be selected per filter.

|  |  |
| --- | --- |
|  | * The summary row will not work with the dynamic suffix. * The referenced enumeration field will not appear as an independent filter option once configured as a dynamic suffix. |

###### Summary

![ColumnSummary](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ColumnSummary.png)

Figure 22. Summary

Similar to suffix, this configuration is for number fields only.
A summary row will appear at the footer of the overview table.
Check **Show sum of all entries** checkbox to show the sum of the column on the summary row.

![SummaryRowInOverviewTable](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/SummaryRowInOverviewTable.png)

Figure 23. Sum of All Entries on the Summary Row

|  |  |
| --- | --- |
|  | If no column enables this feature, the summary row will not appear. |

##### Expression Column

![ExpressionColumn](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ExpressionColumn.png)

Figure 24. Expression Column

An Expression Column is a way to merge multiple field values into a single cell or to add formatting instructions.
In the image above, the Expression Column can display *Full Name* as a combination of *FirstName* and *LastName*.
Here is the result of the *FullnameExpression* in the Overview Engine:

![ExpressionColumnInOE](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ExpressionColumnInOE.png)

Figure 25. Expression Column in Overview Engine

|  |  |
| --- | --- |
|  | Sortable is not available for the Expression Column. |

To configure an Expression Column, define its **Name**, **Expression**, and other [Common Settings](#column-common-settings).

###### Name

The expression name is displayed at the first cell of the column row, with a small icon beside it.
The name is useful to distinguish it from other columns.

![ColumnExpressionName](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ColumnExpressionName.png)

Figure 26. Expression Name

###### Expression

To define an expression, it is required to understand:

* Document Model structure
* [Expression Language](https://geta12.com/docs/EXPRESSION/expression-docs/index.html#language)

In the example *Full Name*, the *FirstName* and *LastName* belong to the group *People*.

![ExampleDocumentModelStructure](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ExampleDocumentModelStructure.png)

Figure 27. Document Model Structure

So the [GroupOperation](https://geta12.com/docs/EXPRESSION/expression-docs/index.html#_groupoperation) is used here to access them.

![ExpressionField](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ExpressionField.png)

Figure 28. Expression for Displaying Full Name

To display a space between *FirstName* and *LastName*, put the space inside double quotes.

|  |  |
| --- | --- |
|  | Currently, there is no suggestion when typing into the expression field. |

If the content in the expression is not correct, an error will appear with helpful details to fix it.

![ExpressionError](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ExpressionError.png)

Figure 29. Incorrect Expression

##### Common Settings

###### ID

The internal ID for the column is displayed here only in case it might be required for testing purposes; otherwise, it holds no value for the user.

###### Pin Direction

Pin direction is used to make a column pinned on the left or right when the user scrolls the overview. By pinning a column, its width will always be a fixed value (in pixels).

SME will re-arrange the columns so that the left pinned columns are always at the beginning of the column list, and the right pinned ones are at the end.

![ColumnPinDirection](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ColumnPinDirection.png)

Figure 30. Columns Order with Pin Direction

###### Width

The column width can be defined by setting a decimal number starting with 0.3. Steps of 0.1 can be used.
The default setting for the column width is 1.0. When using the default plasma styling, 1.0 is equivalent to 150 pixels.
Accordingly, a width of 0.5 is equivalent to 75 pixels and 2.5 is equivalent to 375 pixels.

For non-pinned columns, the value defines a minimum width.
If there is more space available, all non-pinned columns will grow proportionally according to their width ratio.

For pinned columns, the value defines a fixed width. Pinned columns will not grow if more space is available, nor shrink if less space is available.
Therefore, please define a sensible size for the pinned column, so that it will not get bigger than the table itself.
Do not overuse the pinned column since it will always be visible and consume space in the table.

For more details, please consult the [Table API](https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-display/table/api) from Widgets showcase.

###### Fixed Width

By default, column widths in Overview Engine are responsive, expanding to fill the remaining space based on their defined values in the model.
Therefore, a column’s width may be different depending on the browser resolution.
However, if fixed width is enabled for the column, the column width will be fixed at `width` \* 150px (`width` is the value defined in the model).

Fixed width is always used if the column is pinned.

###### Column Header

Column header can have **Icon** and **Label** to display in three modes: icon only, text only, or a combination of icon and text.

* To display icon only, define the icon, then check the **Hide Label** checkbox. The column label will be used as icon title.
* To display text only, do not define the icon, and make sure the **Hide Label** checkbox is not checked.
* To display the combination of icon and text, define the icon, label, and do not check the **Hide Label** checkbox.

To specify an icon, fill the icon name or choose from the icon picker in the **Icon** field.

For [Reference Column](#reference-column), the multilingual labels are automatically filled from the Document Model containing the selected field in the [Element Reference](#element-reference).

![ColumnHeaderForReferenceColumn](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ColumnHeaderForReferenceColumn.png)

Figure 31. Icon and Multilingual Labels in Reference Column

Click the edit button in this repeat to open a detached repeat screen which displays the default label that is set in the Document Model.
Overwrite this label with a new value by typing into the **value** field on this detached repeat screen.

![EditColumnLabel](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/EditColumnLabel.png)

Figure 32. Editing the Reference Column Labels

For [Expression Column](#expression-column), just enter values in the **Value** fields in the **Label** section.

![ColumnHeaderForExpressionColumn](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ColumnHeaderForExpressionColumn.png)

Figure 33. Icon and Multilingual Labels in Expression Column

|  |  |
| --- | --- |
|  | * For accessibility certification, if only the icon is displayed, a label should be defined and then hidden using the **Hide Label** checkbox, so that screen readers can read the column name properly. * The [Material Icons website](https://fonts.google.com/icons?icon.set=Material+Icons) can be used for easier searching. However, if there is an icon which is new and not found in our picker, please do not use it. |

###### Alignment

For each column, horizontal and vertical alignments can be set. By default, vertical alignments of header and content cells are Middle and Top, respectively.
The horizontal alignment is **Right** for columns with **Number** data type and **Left** otherwise.

![Alignment](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/Alignment.png)

Figure 34. Alignment

|  |  |
| --- | --- |
|  | For the multi-select column, Overview Engine may render a bullet list for the default [Display Mode](#_display_mode), which does not look nice when combined with center or right horizontal alignment. Currently, there is no nice graphical solution nor a professional necessity. However, please be aware SME does not forbid this option. |

###### Styles

The **Styles** section allows adding styles for the header and content cells. Note that styles must first be set in [Styles](#styles) in order to be available to choose here.

![ColumnStyles](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ColumnStyles.png)

Figure 35. Column Styles

#### Default Sorting

Default Sorting is the list of [sortable](#sortable) columns and their respective preferred sorting, which is used for sorting the table’s content at the first load of the Overview Engine.

To add a column to Default Sorting, first make sure that it is sortable, then click the **Add** button below the section **Default Sorting**.
A drop-down will list the sortable columns; select one to add.

![DefaultSorting](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/DefaultSorting.png)

Figure 36. Default Sorting

|  |  |
| --- | --- |
|  | * The Overview Engine only displays the sort icon (the up or down arrow) for the first item in the Default Sorting. * If no default sorting is specified, results are sorted by `__meta/createdAt` in descending order. |

#### Features

![OverviewFeatures](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/OverviewFeatures.png)

Figure 37. Main Overview Engine Features: Multi-Selection, Button, Search, Filter Bar, and Filter Button

##### Multi-Selection

###### Enable Multi-Selection

This checkbox enables the **Multi-Selection** feature and shows additional available settings.

![EnableMultiSelection](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/EnableMultiSelection.png)

Figure 38. Enable Multi-Selection

|  |  |
| --- | --- |
|  | Multi-Selection must be further configured in [Subheader](#txt:detail:button) to display in the application. |

###### Display Multi-Selection

This drop-down defines the display of the Multi-Selection panel, with three options:

* **Collapsible (Collapsed):** The panel is collapsible and collapsed initially. This is the default value.
* **Collapsible (Expanded):** The panel is collapsible and expanded initially.
* **Non-Collapsible:** The panel is not collapsible. Multi-Selection checkboxes are always visible.

![DisplayMultiSelection](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/DisplayMultiSelection.png)

Figure 39. Display Multi-Selection

###### Display Counter

This drop-down defines the display of the selected document counter, with two options:

* **Simple:** The Multi-Selection panel contains the counter when expanded. This is the default value.
* **None:** The counter is always hidden.

![DisplayCounter](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/DisplayCounter.png)

Figure 40. Display Counter

###### Interactive Area

This drop-down defines the interactive area of the Multi-Selection in the UI, with two options:

* **Checkbox and Row:** The checkbox and the entire row are clickable to select or deselect the document.
* **Checkbox only:** Only the checkbox is clickable to select or deselect the document.

![selectionarea](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/selectionarea.png)

Figure 41. Interactive Area

###### Actions for Multi-Selection

This section defines the actions that can be applied to selected documents. These actions are shown like Subheader/Footer buttons but are contained in the Multi-Selection panel.

Clicking the **ADD** button opens a detached repeat screen to configure the action’s details.

![ActionMultiSelection](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ActionMultiSelection.png)

Figure 42. Action for Multi-Selection

|  |  |
| --- | --- |
|  | The configuration of Actions for Multi-Selection is similar to the [Subheader](#_subheader_button) or [Footer](#_footer) button’s configuration. An event is linked to the button to perform bulk operations. The **delete\_selected** event, which removes all multi-selected rows, is selectable from the dropdown. |

###### Confirmation Text

Closing the Multi-Selection panel will clear selected rows. To warn the user, use the **Display confirmation before clearing selected rows** checkbox. This checkbox is checked by default.

The dialog uses the multilingual titles and messages below. If both fields are empty, the default engine value is used.

![ConfirmationTextMultiSelection](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ConfirmationTextMultiSelection.png)

Figure 43. Confirmation Text of Multi-Selection

##### Search and Filters

###### Show Full Text Search

Checking this option will make Overview Engine display the text-only search bar. It is checked by default.

![ShowFullTextSearch](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ShowFullTextSearch.png)

Figure 44. Show Full Text Search

|  |  |
| --- | --- |
|  | When entering "and the" into the Full Text Search, the Overview Engine performs the following request:  ``` "constraint":{"operator":"simple_search","value":"and the"} ```  on any indexed field.  For more details about default search behavior, please refer to [Simple Search](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html##simple-search-operator). |

###### Enable Filter

If this option is set, the field filtering feature will be enabled for the Overview Engine. In consequence, the ***Filter Configuration*** section will be shown in the Overview Model Editor for further configurations.

![EnableFilter](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/EnableFilter.png)

Figure 45. Show Filter

|  |  |
| --- | --- |
|  | If the Searching and/or Filtering feature is checked, it needs to be further configured in [Subheader](#txt:detail:button) in order to be displayed in the application. |

##### Filter Configuration

![FilterConfiguration](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/FilterConfiguration.png)

Figure 46. Filter Configuration

###### Show Filter Button

This option is enabled by default. When this checkbox is checked, the filter button will be displayed in the desktop mode.

|  |  |
| --- | --- |
|  | * The filter button will always be displayed in the mobile mode. * If the option is unchecked, [Preset Filters](https://geta12.com/docs/OVERVIEW_ENGINE/overviewengine-dev-docs/index.html#_preset_filters) should be set by developers. |

###### Show Filter Bar

This option is enabled by default. If the option is unchecked, the filter bar will not be displayed.

###### Filter Mode

It defines which fields users can filter, with three options in a drop-down:

* ***All Columns from Overview Model:*** use field references of all columns in the ***Overview Model***.
* ***All Fields from Document Model:*** use all fields in the content of ***Document Model***.
* ***All Fields from Document Model + Meta Data:*** use all fields in the ***Document Model***, include meta data fields.
* ***Custom Selection of Fields:*** new inline repeat will be displayed to add/remove/reorder fields manually. A repeat item contains two properties:

  + ***Subtype:*** select a *Subtype* from the drop-down list. The list contains all subtype models from the referenced ***Supertype Model*** available in the workspace.
  + ***Field Reference:*** select a field from the drop-down list. The list contains fields from the ***Document Model***. If a *Subtype* is selected, the list will only contain fields that are not included in the referenced ***Supertype Model***.

![FilterConfiguration wSubtype](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/FilterConfiguration_wSubtype.png)

Figure 47. Example of Filter Configuration with Subtype

|  |  |
| --- | --- |
|  | * Fields whose data should be available in the filter must be indexed. * Field filtering supports nearly all repeatable and non-repeatable fields  + Attachments and multi-select based-on string fields are not supported. * The field label which the filter uses should be the label which ***Overview Model*** configures. If not, the filter will use the label in ***Document Model***.   If a field has no label and no column label, the Overview Engine will show an empty string in the filter selector. * Fields from Subtypes of a referenced *Supertype Document Model* are only supported when the ***Filter Mode*** is set to ***Custom Selection of Fields***. The available *Subtypes* in the workspace will be offered and the respective fields must be specified. |

###### Section Data

![SectionInOE](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/SectionInOE.png)

Figure 48. Section in Filter Selector

The section in the Filter Selector is used to group relevance filters. Section Data is optional and only displayed when ***Show Filter Button*** is checked.

A section requires a multilingual label and a list of fields defined in [***Filter Mode***](#filter_mode).

![SectionData](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/SectionData.png)

Figure 49. Section Data

|  |  |
| --- | --- |
|  | * Adding one field into two different sections is not allowed. * If a field is not added into any section, it will be shown in the section ***Other***. |

###### Filter String Fields

By default, Overview Engine displays a string field in Filter Selector by a simple text box.

![FilterDisplayNormalStringFieldstInOE](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/FilterDisplayNormalStringFieldstInOE.png)

Figure 50. Normal string field in Filter Selector

Enabling ***Filter String Fields with Multi-Select*** will make the configured string field display as multi-select when filtering.

![FilterDisplayStringAsMultiSelectInOE](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/FilterDisplayStringAsMultiSelectInOE.png)

Figure 51. Display string field as multi-select in Overview Engine

###### Filter Normal String Fields

There are two behaviors to perform filtering on string fields: ***Exact match search*** and ***Simple search***. The default behavior is exact match search.

* An [Exact match search](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#_exact_match_operator) looks for the exact value provided for the current string field, with or without case sensitivity. Substring or partial matching is not available.
* The [Simple search](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#simple-search-operator) uses a case-insensitive substring match algorithm to search the current string field.

To use Simple search, find this string field in the Document Model and add the ***enable\_approximate\_match\_search*** annotation.

![enable approximate match search](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/enable_approximate_match_search.png)

Figure 52. Annotation ***enable\_approximate\_match\_search*** in Document Model

When this annotation is not set, the exact match search is applied. The ***enable\_case\_insensitive\_search*** annotation can be used to enable ***case-insensitive*** results in the filter. If not, the case-sensitive is set as ***true*** by default.

|  |  |
| --- | --- |
|  | There is a difference between Search and Filter and how the Overview Engine makes use of the Simple search operator.  A Simple search in the Filter only applies to one field, while a Simple search in the Search bar applies to all indexed fields. As described, this field has been marked with the annotation ***enable\_approximate\_match\_search*** in the corresponding string field in the Document Model.  The Overview Engine will split the search term for filtering on whitespace and composes the following request, for example, with term "and the" for a Field called "Title":  ``` "constraint":{"operator":"and","value": [{"operator":"simple_search","fields":["/Title"],"value":"and"}, {"operator":"simple_search","fields":["/Title"],"value":"the"}]} ``` |

###### Filter String Fields with Multi-Select

When this feature is enabled, the Overview Engine displays a list of options instead of a simple text input. This list is paginated by Paging Size. There is a ***Load more*** link that appears at the end of the list to load the next page.
If Paging Size is large enough, all options will be loaded, and the ***Load more*** link will be hidden.

![FilterStringFieldsWithMultiSelect](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/FilterStringFieldsWithMultiSelect.png)

Figure 53. Filter String Fields with Multi-Select

The behavior for filtering string fields with multi-select is based on **exact match search** with case-sensitive **true**.

##### Paging Behavior

There are two options for Paging Behavior: **Pagination** or **Infinite Scrolling**.

* **Pagination**: This is the default option. Enter a value for **Paging Size**, then in the Overview Engine, a drop-down called **Page Size** indicates the number of rows shown on a page. If the application’s data entries exceed this limit, navigation buttons are added automatically. The default value for Paging Size is 50.

![Pagination](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/Pagination.png)

Figure 54. Pagination

* **Infinite Scrolling**: With this option, the table loads more rows as users scroll down. Infinite scrolling can replace pagination in tables to provide better UI/UX in some cases. This option requires [**Row Height** and **Action Column Width**](#row-height-and-action-column-width).

![InfiniteScrolling](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/InfiniteScrolling.png)

Figure 55. Infinite Scrolling

|  |  |
| --- | --- |
|  | * Since Data Services support pagination but not offset/limit, the Overview Engine calculates the page size and page number when Infinite Scrolling is enabled. See [Overview Engine documentation](https://geta12.com/docs/OVERVIEW_ENGINE/overviewengine-dev-docs/index.html#infinite-scroll) for Developers for more details. * Page Size must not exceed the `query.pageRequest.pageSizeLimit` from [Data Services' Query Configuration](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#query-configuration); otherwise, an error will be returned from Data Services. To resolve this, either reduce the configured Page Size for Overview or increase the Data Services' `query.pageRequest.pageSizeLimit`. * The same problem occurs when page number is larger than the `query.pageRequest.pageNumberLimit` of [Data Services' Query Configuration](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#query-configuration). Increase the Data Services configuration to resolve it. |

##### Row Height and Action Column Width

![RowHeightAndActionColumnWidth](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/RowHeightAndActionColumnWidth.png)

Figure 56. Row Height and Action Column Width

* **Row Height**: Specify a fixed height for the rows. It should be larger than a button height (32px in the default theme).

When content is too long, an ellipsis (…​) is displayed to indicate that the content was cut. For multi-select, a comma is used to separate the list instead of a bullet list. When hovering over the cell, a tooltip is shown to display the full content.

![EllipsisWithFixedRowHeight](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/EllipsisWithFixedRowHeight.png)

Figure 57. Ellipsis for Fixed Row Height

* **Action Column Width**: The maximum width of the action column when all buttons are displayed.

|  |  |
| --- | --- |
|  | If the **Action Column Width** is not large enough to display all buttons, they will be cut off.  * For **Infinite Scrolling**, explicitly set the **Action Column Width** to ensure all buttons are visible. * For **Pagination**, specifying the **Action Column Width** is not required. If it is not set, the action column automatically adjusts its width to fit all buttons. |

##### Columns Resize

![OverviewColumnsResize](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/OverviewColumnsResize.png)

Figure 58. Columns Resize

Check the **Enable Columns Resize** checkbox to make columns resizable. Note that this disables the responsive feature of columns, meaning all columns will have fixed width.

The action column is not resizable, since its width always depends on its children.

For more details, refer to [Resizable Columns Table](https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-display/table/advanced#resizable-columns) in the Widgets showcase.

##### Number of Entries

To show how many entries are displayed in the overview table, check the **Show Number of Entries** checkbox.

![NumberOfEntries](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/NumberOfEntries.png)

Figure 59. Configuration for Number of Entries

A number will appear next to the label.

![NumberOfEntriesExample](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/NumberOfEntriesExample.png)

Figure 60. Number of Entries in the Overview Table

|  |  |
| --- | --- |
|  | If there is no [label](#labels) or it is hidden, both the label and number of entries will not be shown. |

#### Styles

The **Styles** section is collapsed by default.
It contains a repeat to add a list of logical style names defined in this model, which can be used to apply custom CSS.
For these styles, there are many [Helper Classes](https://www.mgm-tp.com/a12.htmlshowcase/#/basics/helper-classes) listed in the Widgets Showcase.

First, list all styles of the Overview Engine by adding an entry for each one.

![OverviewStyles](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/OverviewStyles.png)

Figure 61. Overview Styles

These styles are then available for applying to the individual controls on the Overview Model.

![OverviewStylesUse](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/OverviewStylesUse.png)

Figure 62. Apply Styles

### Custom Actions

The **Custom Actions** tab contains sub-sections which define:

* Row Actions, Default Row Action, Title for Interactive Rows, and Context Menu
* Minor and major buttons for the Subheader and Footer
* Position for [Multi-Selection](#_multi_selection), [Search and Filters](#_search_and_filters)

#### Row Action Group

![RowActionGroup](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/RowActionGroup.png)

Figure 63. Row Action Group

The Row Action Group is a container for buttons in each row of the table. Buttons can be defined in Row Action or Context Menu.

##### Row Action

Clicking the **ADD** button in this section opens a detached repeat screen for entering the details for each row action button.

![RowActions](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/RowActions.png)

Figure 64. Row Action Settings

###### Event

Select or enter the event to be linked to the row action. The default event is **delete** and this is available to select.

###### Confirmation Text

A row action button can have multilingual confirmation, including title and messages, which will be used for a confirmation dialog that appears after clicking this button. This is especially useful in the case of a delete button. The Overview Engine will not show the confirmation dialog if both title and message are missing.

###### Button Styling

Next, configure the row action button style by using the Priority drop-down and Destructive toggle switch.

![ButtonStyling](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ButtonStyling.png)

Figure 65. Button Styling

* Priority: defines the style (Secondary or Primary) of the button.
* Destructive: sets color. If Destructive is set, the corresponding button will be red. This is useful to amplify the action, for example, a red Delete button.

All row action buttons will appear as Secondary and non-destructive by default.

Consult the [Plasma documentation](https://geta12.com/docs/PLASMA/plasma-concept-documentation/index.html#_buttons_2) and the [Widgets Showcase](https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/general/buttons/button) for guidelines on button styling.

![ButtonPreview](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ButtonPreview.png)

Figure 66. Button Styles in Widgets Showcase

###### Icon

To specify an icon, enter the icon name in the icon picker (the Icon field), then select an icon accordingly.

![IconPicker](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/IconPicker.png)

Figure 67. Finding Icon Using IconPicker

|  |  |
| --- | --- |
|  | The [Material Icons website](https://fonts.google.com/icons?icon.set=Material+Icons) can be used for easier searching. However, if there is an icon which is new and not found in our picker, please do not use it. |

###### Label and Description

The Label is the text displayed inside a button, while Description is shown when a button is hovered. Both are multilingual texts and can be configured separately.

Either a label or an icon is necessary for the button to be displayed properly.

|  |  |
| --- | --- |
|  | For accessibility, the aria-label is generated based on Label and Description. For example, if the given Label and Description are "label" and "description" respectively, the button’s aria-label will be "label - description". |

###### Hide Label

By default, Hide Label is not enabled.

When this option is set, the button will be displayed as icon only.

* If Description is not defined, then Label will be shown when hovering the button.
* The defined Label (which is hidden) will be used as the list item text when users right-click on the row.
  If Label is empty, the Overview Engine will use Description as the list item text.

###### Styles

If a row action button has custom styles, define them by using specified [Styles](#styles) in the Overview tab.

##### Context Menu

Clicking the **ADD** button in this section opens a detached repeat screen for entering the details for each group of context menu.

Define the group name and set multilingual labels for the context menu group.

Then add actions for each group. This is similar to adding Row Actions, but without Priority, Destructive, and Hide Label.

![ContextMenu](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/ContextMenu.png)

Figure 68. Context Menu

#### Default Row Action

This section defines what happens after clicking a row.
The Custom Row Action checkbox is not checked by default, and the row action is View/Edit.

![DefaultRowAction](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/DefaultRowAction.png)

Figure 69. Default Row Action

To customize the row action, check this checkbox, then enter a custom event that can be handled in the application embedding this model.

#### Title for Interactive Rows

When hovering over an interactive row, a title will appear to let users know some information, such as what happens when clicking the row. This multilingual title is also used for accessibility.

![TitleForInteractiveRows](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/TitleForInteractiveRows.png)

Figure 70. Title for Interactive Rows

|  |  |
| --- | --- |
|  | If the row is not interactive, for example, if it is disabled or the Overview Engine is disabled, its title will be empty. |

#### Subheader

![SubheaderOverview](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/SubheaderOverview.png)

Figure 71. Subheader Section

By clicking the **ADD** button, a detached repeat screen is opened to create a respective action type: Button, Search, Filter, or Multi-Selection.

![SubheaderActionType](https://geta12.com/docs/2025.06/ext5/sme/sme-om-ba-docs/assets/SubheaderActionType.png)

Figure 72. Choose Type for Subheader Action

|  |  |
| --- | --- |
|  | There is only one action of each Search, Filter, or Multi-Selection allowed across the Subheader. |

##### Subheader Button

If the action type is Button, additional configurations will be shown.

Define an event that is linked to the button. The add event is selectable by default. Type the event name into the autocomplete to define a custom event.

Button configuration is similar to [Row Action](#row-action).

#### Footer

The available elements for Footer are Button only, and its configuration is similar to [Row Action](#row-action).

## Refactoring

The Simple Model Editor supports automatic refactoring for Overview Models.
When you rename, move, or delete elements that are referenced elsewhere, the tool identifies affected references and presents options for updating them.

For detailed information about refactoring capabilities, workflow, and actions, refer to the [Refactoring Support](https://geta12.com/docs/sme/sme-ba-docs/index.html#refactoring_support) section in the SME Tool Documentation.

### Overview Model Specific Refactoring

Overview Model refactoring handles references within Overview Models when columns, filters, or actions are modified.
The following elements and reference types are supported:

#### Supported Operations

Overview Model refactoring supports the following operations:

* Deleting or renaming columns
* Modifying default sorting configuration
* Deleting filter fields
* Enabling or disabling feature buttons
* Modifying style references

#### Reference Types

The following reference types are tracked and updated during Overview Model refactoring:

| Reference Type | Description |
| --- | --- |
| Column Element References | References from columns to Document Model fields. |
| Default Sorting | References to columns used in default sorting configuration. Columns removed from the model or marked as non-sortable are removed from default sorting. |
| Filter Field References | References to fields used in filter configuration. |
| Style References | References from columns to style definitions. |
| Event References | References in row actions, context menu actions, and toolbar buttons. |
| Query Model References | References to Query Models used as data sources. |
| Document Model References | References to primary and sub-document models. |

#### Example: Deleting a Column

Consider an Overview Model with:

* A column named `statusColumn` configured as sortable
* Default sorting configured to sort by `statusColumn`

When you delete `statusColumn`:

1. Save the Overview Model.
2. The refactoring dialog displays the affected default sorting reference.
3. Choose one of the following actions:

   * **Commit**: Remove the column from the default sorting configuration.
   * **Edit**: Select a different column for default sorting.
4. The model saves with your selected changes applied.

#### Example: Disabling a Feature

When you disable features such as multi-selection or search:

1. The refactoring system detects associated buttons and configurations.
2. The refactoring dialog displays the affected elements.
3. Feature-related buttons are removed from the configuration.

For information about enabling or disabling Overview Model refactoring, see [Enabling Within-Model Refactoring](https://geta12.com/docs/sme/sme-ba-docs/index.html#enabling_refactoring) in the SME Tool Documentation.
