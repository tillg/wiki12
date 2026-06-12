---
source: https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/index.html
category: content_engine
docid: contentengine-user-docs
scraped: 2026-06-12
---

# Content Modeling

This documentation is intended for a business analyst audience. Some prior knowledge of the tools is assumed.

The **Content Editor** offers a range of core functionalities designed to streamline the management of web content.
These functionalities provide users with the necessary tools to create, organize, configure, and publish pages efficiently.

## Introduction and Concepts

### Content Model

The Content Model is a UI model which focuses on presenting a web page or a section of a web page within an A12 application.
It shares the same structure as other models in the A12 platform with two root fields: `header` and `content`.
The `header` field includes metadata: `modelType`, `id`, `modelVersion`, `locales`, `labels`, and `annotations`.
The `modelType` for Content Models is set to `"content"`. The `content` field is nested and organized hierarchically,
allowing for complex structural definition of layout and web elements.
This model ensures consistency across different applications within the platform, facilitating the integration and
rendering of web content.

### Content Model Editor

The Content Editor is a web-based application designed to simplify the process of editing Content Models within the A12 platform.
Instead of dealing with raw JSON files, users can visually manage and configure the structure and properties of their content elements.

It allows users to add, delete, duplicate, and move elements within the structure tree, providing a dynamic and flexible content organization.
The editor also features a real-time preview, enabling users to see changes instantly.

Additionally, it allows for easy editing of each element’s configuration and properties, making content customization straightforward.
This robust tool integrates seamlessly into the A12 platform, making it an indispensable asset for content managers aiming to create and maintain high-quality web content efficiently.

The Content Editor can also be embedded into any application; however, the following documentation focuses on its
usage within the [Simple Model Editor application](https://geta12.com/docs/SME/sme-ba-docs/index.html).

![content editor full screen](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/content-editor-full-screen.png)

Figure 1. Content Model Editor

### Model Elements

At the heart of every Content Model are **Model Elements**, or simply **Elements** — the building blocks used to create structured content.
Each element represents a piece of content, like a button, image, section, or text block.

Think of each element like a Lego block: some elements hold content (like a [Paragraph](#configure-elements/paragraph) or [Image](#configure-elements/image))
while others hold other elements inside them (like a [Grid](#configure-elements/grid) that contains multiple rows
or a [Box](#configure-elements/box) can contain other elements).

Behind the scenes, these elements are stored in a format similar to how web pages are built using components.
Each element includes:

* **namespace** – A reverse domain string (e.g., `com.example.ui`) to group related elements and prevent name conflicts.
* **id** – A unique identifier for this specific element instance.
* **type** – What kind of element it is (e.g., text, image, button)
* **props** – The settings or details for that element (e.g., text value, image URL, color)
* **children** – Any other elements nested inside (e.g., a row might have columns as children)

The Content Editor provides a set of **default elements**. These are pre-defined, commonly used components that cover a wide range of layout and content needs — such as boxes, text blocks, images, buttons, grids, and inputs. These elements serve as the foundation for building interactive and visually organized content.

#### Basic Elements

The following section describes the **basic elements** available in the Content Editor, their purposes, and how they can be composed to form structured content models.

1. [Box](#configure-elements/box): The Box element is a versatile container that can hold various other elements and content.
2. [Grid](#configure-elements/grid): The Grid element is a versatile element designed to organize content in a structured grid format. It is particularly useful for creating responsive layouts where content needs to be arranged in rows and columns.
3. [Row](#configure-elements/row): The Row element is designed to define rows within the Grid element, providing structure and responsiveness to your layout. It allows you to specify how the content should be displayed across different screen sizes, ensuring a responsive design.
4. [Column](#configure-elements/column): The Column element is designed to define columns within the Grid element, providing structure and responsiveness to your layout.
5. [Paragraph](#configure-elements/paragraph): The Paragraph element is a primary element used for adding textual content to the page. It utilizes the Lexical library to provide a rich text editing experience.
6. [Heading](#configure-elements/heading): The Heading element is used to add headings to the page, helping structure the content and improve readability.
7. [Image](#configure-elements/image): The Image element is used to add and configure images within the page.
8. [Video](#configure-elements/video): The video element allows you to add and configure videos within the page.
9. [Ordered/Unordered/Item List](#configure-elements/ordered-unordered-item-list): Ordered and Unordered Lists, along with List Item elements, are essential for organizing and structuring content in a clear, hierarchical manner. These list elements help enhance readability and user experience by presenting information in a logical sequence or as grouped items.
10. [Link](#configure-elements/link): The Link element allows you to define and customize hyperlinks within your layout.
11. [Icon](#configure-elements/icon): The Icon element allows you to add and configure icons within the page.
12. [Button](#configure-elements/button): The Button element allows you to add and configure buttons within the page, along with Button Group and Button Group Container.
13. [Interactive Tile](#configure-elements/interactive-tile): The Interactive Tile element allows you to add and configure interactive tiles within the page.
14. [Table](#configure-elements/table): The Table element allows you to add and configure table within the page.
15. [Expandable](#configure-elements/expandable): The Expandable element provides collapsed and expanded content stages to present information in summarized and complete forms, respectively.

An element can contain other elements or itself as children. The relationship rules of the basic elements are defined in the codebase and summarized in the following table.

Table 1. Relationship rules of the basic elements


| Element label (internal identifier) | Children rule | Parent rule |
| --- | --- | --- |
| Add Row Action | Not allowed | Not allowed |
| Box | Any elements | Any elements |
| Button | Not allowed | Any elements |
| Button Group | **Group**(s), or **Conditional**(s), or **Button**(s) | **ButtonGroupContainer**, or **TableBodyCell** |
| Button Group Container | Exact 2 **ButtonGroup**(s) | Any elements |
| Cancel Action | Not allowed | Not allowed |
| Commit Action | Not allowed | Not allowed |
| Conditional | Any elements | Any elements |
| Delete Row Action | Not allowed | Not allowed |
| Expandable | A list of exact 1 **ExpandableCollapsed**(s), exact 1 **ExpandableExpanded**(s) in that order | Any elements |
| Collapsed (ExpandableCollapsed) | Exact 1 **ExpandableTitle**(s) | **Expandable** |
| Content (ExpandableContent) | Any elements | **ExpandableExpanded** |
| Expanded (ExpandableExpanded) | A list of exact 1 **ExpandableTitle**(s), exact 1 **ExpandableContent**(s) in that order | **Expandable** |
| Title (ExpandableTitle) | Any elements | **ExpandableCollapsed**, or **ExpandableExpanded** |
| Grid | **GridRow**(s), or **Group**(s), or **Conditional**(s) | Any elements |
| Column (GridColumn) | Except **GridColumn** | **GridRow** |
| Row (GridRow) | **GridColumn**(s) | **Grid**, or **GridColumn** |
| Repeatable Group (Group) | Not allowed | Any elements |
| Heading | Not allowed | Any elements |
| Icon | Not allowed | Any elements |
| Image | Not allowed | Any elements |
| Interactive Tile | Exact 1 **Box**(s) | Any elements |
| Link | Any elements | Any elements |
| List Item | Any elements | **OrderedList**, or **UnorderedList** |
| Message Box | Not allowed | Any elements |
| Numbered List (OrderedList) | **Group**(s), or **ListItem**(s), or **Conditional**(s), or **OrderedList**(s), or **UnorderedList**(s) | Any elements |
| Paragraph | Not allowed | Any elements |
| Save Action | Not allowed | Not allowed |
| Table | A list of exact 1 **TableHead**(s), exact 1 **TableBody**(s), exact 1 **TableFoot**(s) in that order | Any elements |
| Body (TableBody) | A list of **TableBodyRow**(s) in that order; A list of at most 1 **Group**(s) in that order | **Table** |
| Body Cell (TableBodyCell) | Any elements | **TableBodyRow** |
| Body Row (TableBodyRow) | Not allowed | **TableBody** |
| Foot (TableFoot) | At most 1 **TableFootRow**(s) | **Table** |
| Foot Cell (TableFootCell) | Any elements | **TableFootRow** |
| Foot Row (TableFootRow) | Not allowed | **TableFoot** |
| Head (TableHead) | At most 1 **TableHeadRow**(s) | **Table** |
| Head Cell (TableHeadCell) | Any elements | **TableHeadRow** |
| Head Row (TableHeadRow) | Not allowed | **TableHead** |
| Tooltip | Not allowed | Any elements |
| Bulleted List (UnorderedList) | **ListItem**(s), or **OrderedList**(s), or **UnorderedList**(s), or **Group**(s), or **Conditional**(s) | Any elements |
| Video | Not allowed | Any elements |

|  |  |
| --- | --- |
|  | The table head, body, and foot rows can contain the corresponding cells, but the insertion should be done via column insertion in the table settings instead.  The Group and Conditional elements are experimental features and may not work correctly in all cases. |

#### Form Elements

The following section describes the **form elements** available in the Content Editor, their purposes, and how they can be used to build interactive and user-friendly forms.

1. [Auto Complete](#configure-elements/autocomplete): The Auto Complete element allows users to input text with autocompletion based on predefined options.
2. [Checkbox](#configure-elements/checkbox): The Checkbox element allows users to toggle between two states of a field.
3. [Checkbox Group](#configure-elements/checkbox-group): The Checkbox Group element allows users to select multiple options from a predefined list via checkboxes.
4. [Date Picker](#configure-elements/date-picker): The Date Picker element allows users to either select dates and times from a picker dialog or input them manually.
5. [Multi Select](#configure-elements/multi-select): The Multi Select element allows users to select multiple options from a dropdown list of predefined values.
6. [Radio](#configure-elements/radio): The Radio element allows users to select a single option from a list of predefined values via radio buttons.
7. [Select](#configure-elements/select): The Select element allows users to choose an option from a dropdown list of predefined values.
8. [Switch](#configure-elements/switch): The Switch element allows users to toggle between two states of a field.
9. [Text Area](#configure-elements/text-area): The Text Area element allows users to input and edit multiple lines of text.
10. [Text Line](#configure-elements/text-line): The Text Line element allows users to input and edit a single line of text.
11. [Message Group Container](#configure-elements/message-group-container): The Message Group Container element is a technical element to configure the way validation messages are displayed within the container. The provided configuration is used to determine which validation messages should be displayed in a Message Group Display instead of the individual input elements.
12. [Message Group Display](#configure-elements/message-group-display): The Message Group Display element can be used to display validation messages in a common place instead of displaying them at each individual input element.

Table 2. Relationship rules of the form elements


| Element label (internal identifier) | Children rule | Parent rule |
| --- | --- | --- |
| Auto Complete | Not allowed | Any elements |
| Checkbox | Not allowed | Any elements |
| Checkbox Group | Not allowed | Any elements |
| Date Picker | Not allowed | Any elements |
| Multi Select | Not allowed | Any elements |
| Radio | Not allowed | Any elements |
| Select | Not allowed | Any elements |
| Switch | Not allowed | Any elements |
| Text Area | Not allowed | Any elements |
| Text Line | Not allowed | Any elements |
| Message Group Container | Any elements | Any elements |
| Message Group Display | Not allowed | Any elements |

## Basic Editor Functions

### Open the Content Model Editor

To access the Content Model Editor, open a Workspace in the Simple Model Editor.
If existing models need to be edited or viewed, they must be in the opened Workspace.
After opening a Workspace, all models contained within it are displayed in the Workspace Explorer of the SME.
Content Models will be recognized as such by the SME, with the respective purple icon **Ct** displayed next to them.

![open model editor](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/open-model-editor.png)

Figure 2. SME Workspace Explorer containing Content Model, among others

To create a new Content Model, use the "ADD" button in the header of the Workspace Explorer and select "Content Model".

![add new content model](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/add-new-content-model.jpg)

Figure 3. Add a New Content Model

A modal dialog will open that is similar to other model creation dialogs.

![new content model dialog](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/new-content-model-dialog.png)

Figure 4. Enter Initial Model Settings for New Content Model

### Sidebar

In the sidebar of the Content Model Editor, the name of the Content Model is displayed at the top. Three menus can be accessed:

* Model Tree
* Settings
* Preview

Below the menus, the following buttons are available:

* Deploy
* Cancel
* Save As
* Save

The menus as well as saving a model will be described in the subsequent chapters.

### Model Tree

The **Model Tree** is the central interface for editing and visualizing content models. It provides a structured, intuitive layout divided into three main views, each serving a specific purpose in the editing workflow:

* **Left Panel – Element Structure**:
  This panel displays the hierarchical structure of all elements in the content model.
  It functions like a tree view, allowing users to add, remove, duplicate, or rearrange elements.
  This is the main area for organizing the layout and relationships between elements.
  See the [Element Actions section](#element-actions) for more details.
* **Middle Panel – Canvas (WYSIWYG View)**:
  This is the live preview area where users can see how their content model will appear when rendered.
  It offers a "what you see is what you get" experience, helping users understand the visual impact of structural
  or content changes in real time.
* **Right Panel – Element Settings**:
  When an element is selected, this panel shows its configurable properties. Users can modify values such as text,
  image sources, layout behavior, styles, and more. It provides detailed control over the behavior and appearance of individual elements.

Together, these three panels offer a seamless experience for designing structured, interactive content.
The layout encourages experimentation and refinement, enabling users to build high-quality content models
without directly editing code or JSON.

![model tree](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/model-tree.jpg)

Figure 5. Model Tree

### Model Settings

Besides the common model settings such as **name** and **description**, the Content Model has specific settings that allow you to fine-tune its behavior and integration:

#### Document Model

The optional document model to which the content model is bound. When a document model is selected, the content model can leverage its structure and data fields to create dynamic, data-driven content.

Binding to a document model enables you to:

* Access document fields and display their values dynamically
* Create repeatable content sections based on document groups
* Build forms and data-driven interfaces
* Ensure type safety and validation through the document model schema

#### Base Group

The Base Group defines the starting point or "root context" within the document model from which the content model operates. This setting determines which portion of the document structure the content model will work with.

##### Understanding Base Group

Think of the Base Group as defining the **scope** or **context** for your content model:

* **Without Base Group** (empty): The content model operates at the document root level. All field references start from the top of the document structure.
* **With Base Group**: The content model operates within a specific branch of the document tree. Field references are relative to this group, making the content model reusable for different instances of the same group.

##### Practical Example

Consider a document model representing an e-commerce order with the following structure:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` /order   /customer     - name     - email   /items (repeatable group)     - productName     - quantity     - price     /shippingAddress (repeatable group)       - street       - city       - zipCode ``` |
```

**Scenario 1: No Base Group**

A content model without a base group would reference fields like:

* `/order/customer/name`
* `/order/customer/email`

To specify fields within the `items` group, you would use the Repeatable Group element to iterate over `/order/items`, and within that context, reference fields like:
\* `/order/items/productName`
\* `/order/items/quantity`
\* `/order/items/price`

This content model displays the entire order and must know the full document structure.

**Scenario 2: Base Group = `/order/items`**

A content model with base group `/order/items` would reference fields relative to the items group, so you can directly refer to the fields
inside that group without the need to wrap them in a Repeatable Group element.

* `/order/items/productName`
* `/order/items/quantity`

**Why is this useful?**

This content model becomes a **reusable template** for displaying any single order item. When the application renders this content model, it must provide a specific item instance (e.g., `/order[1]/items[2]`), and the content model will automatically display that item’s data. This is particularly powerful for:

* Creating list views where each item uses the same content model
* Building detail views for specific instances within a collection
* Separating concerns between container layouts and item templates
* Enabling content model reuse across different contexts

![model settings](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/model-settings.png)

Figure 6. Content Model Settings

|  |  |
| --- | --- |
|  | **Using Document-Bound Content Models**  Content models that reference a document model (either through binding to a Document Model or specifying a Base Group) cannot be used for standalone pages like the Welcome Page use case.  This is because the dynamic Content Engine works similarly to the Form Engine and requires a referencing document (e.g., from Overview Engine or Tree Engine) to resolve field bindings and render content correctly.  For standalone static pages without document context, use content models that are not bound to any document model. |

|  |  |
| --- | --- |
|  | **Runtime Requirements for Base Group**  If the **Base Group** is specified, the Content Engine will, at runtime, expect a corresponding concrete document path that aligns with that base group definition.  For example, when the base group is defined as `/product/items/addresses`, the Content Engine expects to receive a document path such as `/product[1]/items[2]/addresses[3]` to render the content model correctly.  The provided document path must:  * Match the base group structure exactly * Include all intermediate group indices * Point to a valid instance within the document  For more information, see the section [Binding to a Document Model](https://geta12.com/docs/content_engine/contentengine-dev-docs/index.html#binding-to-document-model) in the developer documentation. |

|  |  |
| --- | --- |
|  | **Preview Behavior with Base Group**  If the **Base Group** is specified, the Content Model Preview will always choose the first instance of every group in the sample document to render the preview.  For example, when the base group is defined as `/product/items/addresses`, then the portion of the document that is used for the preview will always be `/product[1]/items[1]/addresses[1]`.  This means the preview shows how the content model would render for the first address of the first item of the first product in your sample data. To test different instances, you would need to adjust your sample document or use the live application runtime. |

### Element Actions

#### Insert Element

Users can choose from a variety of elements such as text blocks, images, videos, and layout components.
To insert an element, users need to either:

* Right-click on the parent element where a new child element will be inserted and select "Insert as Child" from the context menu
* Right-click on a sibling element and select either "Insert Above" or "Insert Below" to place the new element relative to the selected sibling

|  |  |
| --- | --- |
|  | Each model starts with a root element. By default this is a **Box**, but other elements may also serve as the root. The root has strict rules:  * It cannot be reordered * No parent or sibling can be added to it * Replacing the root requires deleting it together with all its children and starting over  Because of these restrictions, it is important to choose the root element carefully before beginning the modeling process. |

Upon insertion, the new element will have a default configuration or placeholder that can be fine-tuned as needed.

![element right click menu](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/element-right-click-menu.png)

Figure 7. Right-Click Element Menu

|  |  |
| --- | --- |
|  | Not every element can be inserted into every type of parent element. For example, a Grid element can only contain Row elements, and a Row can only contain Column elements. This restriction ensures that the page structure remains logical and consistent with the design principles. |

#### Duplicate Element

Duplicating elements is useful for creating multiple instances of similar content without having to reconfigure each one manually.
Users can duplicate any element on the content page by right-clicking on the desired element and selecting "Duplicate" from the context menu.
The duplicated element will appear as the last sibling of the original, with all properties and configurations intact,
ready for further customization if needed.

#### Delete Element

Users can remove any element from the content page by right-clicking on the element and selecting "Delete" from the context menu.
Alternatively, users can delete an element using the top menu action bar after selecting the element.

Once selected, the element is immediately removed from the page, and the surrounding elements adjust accordingly to maintain the page layout.

|  |  |
| --- | --- |
|  | Deleting an element is an **irreversible** action. There are no undo actions or warning dialogs provided. |

#### Move Element

Moving elements allows users to rearrange the content on their pages to improve structure and flow.
Users can move elements by either:

* Right-clicking on the element and selecting "Move Up" or "Move Down" from the context menu
* Right-clicking on the element and selecting "Cut" to move it, then right-clicking on the target element and selecting either "Paste"/"Paste above"/"Paste below"
* Right-clicking on the element and selecting "Copy" to duplicate it, then right-clicking on the target element and selecting the proper paste action
* Using the drag-and-drop feature to move elements around

Alternatively, users can use the top menu action bar for these operations after selecting the element.

The Content Editor ensures that elements can only be moved to valid locations, preventing any violations of parent-child relationships.
For instance, a Grid element can only contain Row elements, and a Row can only contain Column elements.

### Live Preview

The Content Model Editor provides a **Live Preview** feature that allows you to instantly see the results of model changes as they are made.
Once the preview window is opened, it updates automatically whenever a valid modification is applied to the Content Model.
Reloading the page is only required if changes affect the underlying preview document itself.

#### Opening the Preview

The Preview window can be opened by clicking the **Preview** button in the sidebar.

![preview button](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/preview-button.png)

Figure 8. Preview Button

![preview window](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/preview-window.png)

Figure 9. Live Preview Window

#### Preview Controls

The left-hand menu of the Preview window provides the following functionalities:

| Name | Functionality |
| --- | --- |
| Width | Adjusts the Content Engine viewport to **extra small**, **small**, **medium**, or **large**, enabling convenient modeling of responsive layouts. |
| Theme | Switches between available Widget themes (**default**, **compact**, **flat**, **flat compact**) as well as any detected workspace themes. |
| Data | **(Available only when bound to a Document Model)** Displays data in JSON format via `Data > Show Data`. Allows choosing between a generated sample document (`Default`) or existing workspace document data. |
| Validate | Runs document model validation checks |

|  |  |
| --- | --- |
|  | * The preview updates automatically for valid changes * Reloading is not required unless changes directly influence the preview document * Invalid changes will not trigger updates until corrected * Themes can also be previewed directly inside the WYSIWYG editor by selecting the desired theme using the **Settings** button in the menu bar, without opening the Preview window  editor theme settings  Figure 10. Select Themes in Content Editor |

## Editors for Model Elements

This chapter describes all of the various Element Editors for the different model elements that can be edited in the Content Model Editor.

### Common Configurations

Before configuring specific elements, it is important to understand some basic features that are commonly used across different elements.

#### Width and Height

The width and height configuration allows you to control the dimensions of an element.
The UI for configuring width and height includes a number input field and a dropdown menu with options to set the values in different units.

* **Number Input**: Enter the width or height value. Only for numerical units (px, %).

  + You can use the arrow up/down keys to increase or decrease the value by one unit.
  + Press Command (Mac) or Control (Windows) while using the arrow keys to change the value by five units.
* **Dropdown Menu**: Choose the unit for the width or height value.

  + **auto**: Automatically adjust the width or height.
  + **px**: Set the width or height in pixels.
  + **%**: Set the width or height as a percentage of the containing element.
  + **fit-content** (for height only): Adjust the height to fit the content.

![width height config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/width-height-config.png)

Figure 11. Width and Height Configuration

|  |  |
| --- | --- |
|  | The arrow keys can be used in any number input field in the configuration panel, not only for width and height. |

#### Margin and Padding

The Margin and Padding settings control the spacing of an element — both inside and around it.

* **Margin** defines the space outside an element, separating it from surrounding elements.
* **Padding** defines the space inside an element, between its content and its border.

##### Example

This image illustrates how margin, border, padding, and content define the overall box layout of an element in CSS.

* The innermost blue box (162×354) represents the **content area** — where text, images, or other inner elements are displayed.
* Surrounding it is the **padding area** (green), which adds internal spacing between the content and the border.
  In this example, the padding values are 8px (top), 16px (right), 32px (bottom), and 16px (left) — starting from the top and moving clockwise.
* The orange band surrounding the padding is the **border** (3px thick), enclosing the element visually.
* The outermost peach-colored area is the **margin area** (8px on all sides), which adds space outside the element, separating it from neighboring elements.

![padding margin visualization](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/padding-margin-visualization.png)

Figure 12. Padding and Margin Visualization

##### Configuration

Both **padding** and **margin** share a configuration UI similar to **width** and **height**. By default, a single value applies to all sides.
When selecting **Custom**, separate input fields appear for **Top**, **Bottom**, **Left**, and **Right**, allowing fine-grained control for each side.

![padding margin config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/padding-margin-config.png)

Figure 13. Padding and Margin Configuration

##### Supported Units

The editor supports multiple CSS units for defining spacing values:

* **px** — fixed pixels, independent of container or font size.
* **%** — percentage relative to the **width** of the containing element, making layouts responsive.
* **rem** — relative to the root font size (for example, if the root font size is 16px, then 1rem = 16px).
* **auto** — available for margin only, allowing the browser to calculate spacing automatically (commonly used for centering elements, such as applying left and right margin to **auto**).

Different units can also be combined. For example, someone can apply 10px padding on top, and 5% padding on right.
Only zero or positive values are allowed for both padding and margin. Negative values are not supported.

#### Border

The border configuration allows you to add and customize borders for an element.
The UI includes options for setting the *style*, *color*, and *various dimensions* of the border.

* **Style**: Choose the style of the border.

  + **Solid**: A solid line border.
  + **Dashed**: A dashed line border.
  + **Dotted**: A dotted line border.
  + **None**: No border.
* **Width**: Set the width of the border.
* **Color**: Configure the color of the border.
* **Radius**: Set the border radius for rounded corners.

![border config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/border-config.png)

Figure 14. Border Configuration

#### Colors

The color configuration allows you to set the colors for text and background of an element. The UI includes options for selecting colors using a color picker.

* **Text Color**: Configure the color of the text.
* **Background Color**: Configure the background color of the element.

![initial color config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/initial-color-config.png)

Figure 15. Initial Color Configuration

When you click on the color option, the color picker UI opens, allowing you to select the desired color.

![expanded color config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/expanded-color-config.png)

Figure 16. Color Configuration

|  |  |
| --- | --- |
|  | You can specify colors using hexadecimal values, RGB, or select from a predefined palette. |

#### Background Image

The background image configuration allows you to set and adjust the background image of an element.
The UI includes various options to control the URL, repeat behavior, size, and position of the background image.

* **URL**: Enter the URL of the background image.
* **Repeat**: Choose how the background image should repeat.

  + **No**: The background image will not repeat.
  + **Yes**: The background image will repeat both horizontally and vertically.
  + **Horizontal**: The background image will repeat horizontally only.
  + **Vertical**: The background image will repeat vertically only.
* **Size**: Select the size of the background image.

  + **auto**: The background image will retain its original size.
  + **contain**: The background image will scale to fit within the element while maintaining its aspect ratio.
  + **cover**: The background image will scale to cover the entire element, potentially cropping the image.
* **Horizontal Position**: Set the horizontal position of the background image.

  + **left**: Align the background image to the left.
  + **center**: Center the background image horizontally.
  + **right**: Align the background image to the right.
* **Vertical Position**: Set the vertical position of the background image.

  + **top**: Align the background image to the top.
  + **center**: Center the background image vertically.
  + **bottom**: Align the background image to the bottom.

The last three properties (Horizontal Position, Vertical Position, and Size) also have "px" and "%" dropdown options to specify the values more explicitly.

![initial background image config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/initial-background-image-config.png)

Figure 17. Initial Background Image Configuration

|  |  |
| --- | --- |
|  | Ensure the URL is correct and accessible to display the background image properly. |

#### Shadow

The shadow settings configuration allows you to add and customize shadow effects for an element. The UI includes options for setting the style, color, and various dimensions of the shadow.

* **Style**: Choose the style of the shadow.

  + **Inside**: The shadow will appear inside the element.
  + **Outside**: The shadow will appear outside the element.
* **Color**: The color of the shadow.
* **Horizontal Offset**: The horizontal distance of the shadow from the element.
* **Vertical Offset**: The vertical distance of the shadow from the element.
* **Blur**: The blur radius of the shadow.
* **Spread**: The spread radius of the shadow.

The last four properties use the pixel unit for configuration.

![shadow config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/shadow-config.png)

Figure 18. Shadow Configuration

#### Event

The events configuration allows you to add event listeners to an element. The UI includes a list of available events that can be added to the element.

* **Event**: A list of available events that can be added to the element. This can be:

  + **Event name:** A string representing the event name.
  + **Event node:** A reference to a specific event node (See [Action element](#configure-elements/action-elements) section for more details).

|  |  |
| --- | --- |
|  | For event name, the project developer is responsible for handling the event logic. |

* **Confirmation:** An optional message that appears in a confirmation dialog when the event is triggered.

  + The user must confirm the action before the event is triggered. This is useful for destructive actions like deleting data.
  + The content of the confirmation dialog can be easily customized, including the *title*, *message*, confirm, and cancel *button labels*.

|  |  |
| --- | --- |
|  | Some of the events may not include a confirmation option. |

![event config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/event-config.png)

Figure 19. Event Configuration

### Basic Elements

#### Box Element

Besides [common configurations](#configure-elements/common), the Box element has specific configurations that allow you to fine-tune its layout and appearance:

* **Direction**: Set the layout direction (e.g., horizontal, vertical).
* **Distribution**: Choose how to distribute space between items (e.g., Start, Center, End).
* **Alignment**: Align items (e.g., Start/Top, Center/Middle, End/Bottom).
* **Gap**: Set the gap between items in pixels.
* **Wrap**: Choose whether items should wrap to the next line.
* **Overflow**: Define how to handle overflow content (e.g., Visible, Hidden, Scroll, Auto).

![box configuration layout](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/box-configuration-layout.png)

Figure 20. Box Element’s Layout Configuration

#### Grid Element

Besides [common configurations](#configure-elements/common), the Grid element has a few unique settings that allow you to customize the layout of the grid:

* **Cell Border**: Toggle the cell borders on or off to define the separation between grid cells.
* **Gutter**: Enable or disable gutter spacing between cells to adjust the space between grid items.
* **Fit to Parent**: Toggle to make the grid fit the parent container’s width.
* **Alignment**: Set the alignment of the grid content with options such as top, middle, and bottom alignment.

![grid config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/grid-config.png)

Figure 21. Grid Configuration

#### Row Element

The horizontal direction is divided into 12 imaginary units equally, allowing precise control over the layout.
For each screen size (large, medium, and small), there are three inputs for controlling the layout: Layout, Offsets, and Spans.
The input format should be a list of integer numbers from 1 to 12 inclusively, separated by spaces, e.g., `3 6 3`.

![grid row responsive config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/grid-row-responsive-config.png)

Figure 22. Row Responsive Configuration

* **Layout:**
  Specify the grouping of the 12 unit columns into larger layout columns for controlling the layout. For example:

  + Using `3 3 3 3` for the large layout input means four columns each taking up 3 units on large screens.
  + Using `6 6` for medium layout means two columns each taking up 6 units on medium screens.
* **Offsets:**
  Set the offset for each larger column to control the spacing.
  The offset value determines how many layout units to skip before placing the actual columns declared by the layout input.
  The default value for the offset is 0. For example:

If the layout is `3 3 3 3`, then offset `1 0` means the first actual column starts at the second `3-width-unit` column,
and the second column starts at the next `3-width-unit` column.

* **Spans:**
  Adjust the span for each larger column to manage how many units the larger column should cover.
  The span determines how much horizontal space a larger column will occupy. The default value for the span is 1.

These settings allow for precise control over how your content is displayed across various devices, ensuring an optimal viewing experience.

**Example 1:**

* Layout: `3 3 3 3`
* Offsets: `1 0`
* Spans: `1 2`

In this configuration, the row is divided into four equal segments, each taking up 3 wide units.
The offsets indicate that the first column starts at the second segment, skipping the first one due to the offset of 1.
The second column has offset 0, meaning it starts immediately after the first column.

The spans indicate that the first column spans 1 segment and the second column spans 2 segments.
As a result, "Box A" is placed at the second segment and spans 1 segment. "Box B" starts immediately after "Box A" and spans 2 units.

![grid row example 1](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/grid-row-example-1.png)

Figure 23. Row Example 1

**Example 2:**

* Layout: `3 3 3 3`
* Offsets: `0 1`
* Spans: `2 1`

The layout is the same as in the previous example, but the offsets and spans are different.

The offsets indicate that the first column has no offset, meaning it starts at the first segment.
The second column has an offset of 1 unit, meaning it skips the next segment and starts at the third one.

The spans indicate that the first column spans 2 segments and the second column spans 1 segment.

As a result, "Box C" is placed from the beginning and spans half of the available width,
while "Box D" is placed in the last segment and consumes the remaining width.

![grid row example 2](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/grid-row-example-2.png)

Figure 24. Row Example 2

#### Column Element

The Column configuration allows you to control the responsive behavior and dimensions of columns within your grid layout.
Below is the documentation for the height, width, and spacer column settings.

* **Height:** The height settings for each screen size
* **Width:** The width inputs for each screen size only enable when the Grid row layout is omitted
* **Padding:** Customize the padding for the top, bottom, left, and right sides of the column.
* **Spacer Column:** An indication that this column is just for spacing purposes. When enabled, this column will act as a spacer within the grid layout.
* **Alignment:** Set the alignment of the column content with options such as top, middle, and bottom alignment.

![grid column config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/grid-column-config.png)

Figure 25. Grid Column Configuration

#### Paragraph Element

Besides [common configurations](#configure-elements/common), the Paragraph can be edited directly using the rich text editor.
To edit the content of the paragraph element:

1. Hover over the paragraph element to reveal the edit button.
2. Click the edit button to activate the editing mode.
3. When in editing mode, the top menu will appear with all the formatting options.
4. Select the text and apply the desired formatting options using the top menu.

The paragraph element includes several common text formatting options:

* **Font Size**: Adjust the size of the text.

  + Available options include various pixel sizes (e.g., 12px, 14px, etc.).
* **Font Weight**: Choose the weight of the text.

  + Options include regular, bold, and other font weights.
* **Text Color**: Set the color of the text.

  + Use the color picker to select the desired text color.
* **Formatting**: Apply formatting options to the text.

  + Options include bold, italic, underline, strikethrough, and code.
* **Alignment**: Align the text within the paragraph.

  + Options include left, center, right, and justify.

![lexical toolbar](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/lexical-toolbar.png)

Figure 26. Paragraph Element Toolbar

#### Heading Element

It includes the same configuration options as the [Paragraph element](#configure-elements/paragraph),
with an additional dropdown menu for selecting the heading level.

|  |  |
| --- | --- |
|  | Anchor configuration  This is an advanced feature that *can only be used* by the [Content Management System (CMS)](https://geta12.com/docs/cms/cms-user-docs/index.html). For technical reasons, this configuration cannot be removed from the Heading element. This feature is not yet available for general use.  heading anchor config  Figure 27. Anchor Configuration |

#### Image Element

Besides the [common configurations](#configure-elements/common) such as dimensions, shadow, border and alt text, there are two ways to configure the image source:

Width, height, padding, and margin settings apply to the image’s container (an invisible box surrounding the image).
Increasing these dimensions enlarges the container; the image then scales to fit inside it while preserving its original aspect ratio.

|  |  |
| --- | --- |
|  | Images always keep their original aspect ratio and are scaled so they fit fully inside the container without cropping or distortion.  Valid value types you can set for the container’s width/height:  * Pixels (e.g. `320px`) – exact size. Pixel values take precedence when combined with percentages via responsive rules. * Percentages (e.g. `50%`, `120%`) – relative to the parent container. Values greater than `100%` enlarge the container beyond the parent; the image still scales proportionally inside that larger box. (Result: the container may overflow the layout; the image remains fully visible.) * `auto` – lets the container shrink or expand based on layout and the image’s intrinsic size (still capped by any parent constraints).  Padding and margin accept standard CSS units (px, rem, %, etc.). Percentage padding and margins are always calculated relative to the container’s width—even for vertical (top/bottom) values—per CSS specifications, which may be unexpected if you assume vertical percentages are based on height. |

* **Field reference**: (available only when binding to a document model) The Attachment group that contains the image attachment.
  In case of a missing or invalid field reference, the static URL will be used as a fallback.
* **Static URL**: The static URL of the image

![static source image config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/static-source-image-config.png)

Figure 28. Static Source Configuration

![dynamic source image config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/dynamic-source-image-config.png)

Figure 29. Dynamic Source Configuration

* **Alternate Text**: Provide a description of the image for accessibility purposes.
  This text will be read by screen readers and displayed when the image cannot be loaded.
* **Opacity**: Adjust the transparency of the image. A value of 1 is fully opaque, while 0 is fully transparent.

![image advanced config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/image-advanced-config.png)

Figure 30. Advanced Image Configuration

#### Video Element

Similar to the [Image element](#configure-elements/image), you can specify an absolute URL for the video source.

Besides the common settings, you can also configure the video element with the following attributes:

* **Title**: The title of the video element. This is used for accessibility purposes.
  A button at the end of the input field can be used to automatically fetch and fill the video title from the video metadata.

#### Ordered/Unordered/Item List Element

They share similar [common configurations](#configure-elements/common) to control margin, padding, and borders, providing a consistent approach to styling.
However, while Ordered and Unordered Lists can only contain other List elements or List Item elements,
List Item elements can contain any other element, including Paragraphs, Images, or even another list elements.
This flexibility allows for the creation of complex and content-rich list items that are easy to manage and style.

#### Link Element

Below are the details for each configuration setting available for the Link element.

* **URL:** The destination URL for the link. You must provide a valid URL starting with http:// or https://.
* **Label:** This is the text that will be displayed for the link. It is important to provide a clear and concise label to indicate the purpose of the link.
* **Dimensions:** The dimensions section allows you to set padding and margin for the link element
* **Open Link in New Tab**: to enable the link to open in a new browser tab. This is useful when you want to keep the current page open while the link is being viewed in a separate tab.

![link config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/link-config.png)

Figure 31. Link Element Configuration

#### Icon Element

Available configuration settings for the Icon element:

* **Icon:** The specific icon to be displayed. This can be selected from the *Icon Picker*.

![icon picker config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/icon-picker-config.png)

Figure 32. Icon Picker Configuration

* **Size:** The size of the icon. Options include `big`, `medium`, or any specific pixel value (e.g., `24px`).
* **Variant:** The style variant of the icon. Options include: `none` *(@default)* | `info` | `success` | `warning` | `error`
* **Title:** The HTML title attribute for the icon, which provides additional information when the user hovers over the icon.

![icon config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/icon-config.png)

Figure 33. Icon Element Configurations

#### Message Box Element

Available configuration settings for the Message Box element:

* **Message:** The content of the message box.
* **Variant:** The style variant of the message box. Options include: `error` *(@default)*, `info`, `success`, `warning`.
* **Icon:** The specific icon to be displayed. If not set, the Message Box will use the *default icon* corresponding to the *variant* config.

![message box config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/message-box-config.png)

Figure 34. Message Box Element Configurations

* **Initial focus:** Select "Yes" to enable invisible focus for this message box upon display. If multiple message boxes are shown,
  enable this option for **only one** to avoid focus conflicts.

![message box advanced config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/message-box-advanced-config.png)

Figure 35. Message Box Element Advanced Configurations

#### Button Elements

Beside [common configurations](#configure-elements/common) such as sizing, spacing, shadow, and border,
all the Button elements provide additional configurations to customize the button’s content, container, and behavior.

|  |  |
| --- | --- |
|  | **Why do we need three kinds of button elements?**  The Content Engine provides three distinct button element types to address different layout and organizational needs:  * **Button**: The fundamental interactive element for single actions. This element should **not be used standalone** but rather as a child of Button Group or Button Group Container to ensure consistent styling and layout management. * **Button Group**: A container for multiple related buttons that share a common context or workflow. This provides consistent spacing and visual grouping, making it clear to users that these actions are related (e.g., "Save", "Cancel", "Reset" buttons in a form). **This is the minimum recommended container for buttons.** * **Button Group Container**: A higher-level container that organizes multiple Button Groups into complex layouts. This is useful when you need to separate different categories of actions while maintaining consistent alignment (e.g., primary actions on the left, secondary actions on the right, or separating different functional areas in a toolbar).  This hierarchical structure is essential for maintaining consistent styling and behavior throughout your application. Always use Button Group (for single or multiple buttons) or Button Group Container (for complex layouts) rather than placing Button elements directly in your layout. |

##### Button Configurations

The Button element is the basic building block for interactive actions in your application.

|  |  |
| --- | --- |
|  | **Usage Recommendation:** It is not recommended to use Button elements as standalone elements in your layout due to the complexity of managing consistent spacing, alignment, and styling across different contexts. Instead, always place Button elements inside a **Button Group** and **Button Group Container** to ensure consistent visual presentation and maintainability.  Use standalone buttons only in exceptional cases where you have full control over the surrounding layout context. |

Available configuration settings for the Button element:

* **Click Event:** The most important functionality of a button is the event that it triggers when clicked.
  You can define your button’s click event with [event configuration](#_event).
* **Content:** Defines the visual and textual elements of the button.

  + **Label**: The primary text is displayed on the button.
  + **Hide Label**: A boolean option to hide the label, useful for icon-only buttons.
  + **Description**: A brief tooltip provides additional context when users hover over the button.
  + **Icon**: Allows specifying an icon to be displayed alongside the label or as a standalone element.
  + **Vertical**: Controls the button’s content flow within its container.

![button config section 1](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/button-config-section-1.png)

Figure 36. Button Content Configurations

* **Variant:** The visual style of the button.

  + **Type**: The type of button to render, `button`, `reset`, or `submit`.
  + **Primary**: The primary button style.
  + **Destructive**: A button style that indicates a destructive action.
  + **Invert**: A button style that inverts the default color scheme.
  + **Disabled**: A button that is not clickable.

![button config section 2](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/button-config-section-2.png)

Figure 37. Button Variant Configurations

##### Button Group Configurations

The Button Group element allows you to group multiple buttons together, providing a consistent layout and styling for related actions. Use this when you have 2-5 related buttons that should be visually connected (e.g., form actions, pagination controls, or toggle options).

* **Gap**: Defines the space between buttons in the group.

![button group config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/button-group-config.png)

Figure 38. Button Group Configurations

##### Button Group Container Configurations

The Button Group Container element allows you to organize two Button Groups together, providing a consistent layout and styling for related actions. Use this when you need to create complex toolbars or action bars with distinct sections (e.g., primary actions vs. secondary actions, left-aligned vs. right-aligned buttons, or separating different functional categories).

* **Gap**: Defines the space between buttons in the group.
* **Alignment**: Defines the alignment of the button groups within the container.

![button group container config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/button-group-container-config.png)

Figure 39. Button Group Container Configurations

#### Interactive Tile Element

The Interactive Tile element is a behavioral element similar to a button, designed for click interactions. Unlike the Button element, the Interactive Tile comes equipped with a **default box container** that serves as a visual container for your tile content.

|  |  |
| --- | --- |
|  | **Interactive Tile vs. Button:**  * **Interactive Tile**: A clickable element with a built-in box container. The container provides:  + Background styling capabilities   + Padding and spacing control   + Border and shadow options   + Full box model customization * **Button**: A pure behavioral element that requires a Button Group or Button Group Container for proper layout management.  Use Interactive Tile when you need a clickable card-like element with custom background, shadows, and visual styling. Use Button for standard action buttons in forms and toolbars. |

##### Using the Built-in Box Container

The Interactive Tile’s box container allows you to:

* Add background colors or images to create visually distinct tiles
* Apply padding to control the spacing between the tile’s border and its content
* Configure borders and shadows for depth and visual hierarchy
* Create card-like interfaces with rich visual styling

This makes Interactive Tile ideal for dashboard cards, navigation tiles, feature showcases, or any clickable area that needs to stand out visually from the rest of your interface.

##### Configuration Options

Available configuration options for the Interactive Tile element:

* **Click Event:** Same as button, you can define your interactive tile’s click event with [event configuration](#_event).
* **Title:** The title of the interactive tile.
* **Primary:** The primary tile style. When enabled, applies a predefined visual treatment for emphasis.
* **Margin:** Defines the [margin](#_margin_and_padding) around the tile to control spacing from adjacent elements.

|  |  |
| --- | --- |
|  | Since the Interactive Tile includes a box container, you can leverage all [common box configurations](#configure-elements/common) such as background, padding, border, and shadow to create rich, visually appealing clickable tiles without needing additional wrapper elements. |

![interactive tile config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/interactive-tile-config.png)

Figure 40. Interactive Tile Configurations

#### Table Elements

Beside [common configurations](#configure-elements/common) such as dimensions, shadow, and border, all the Table elements
provides additional configurations to customize the table’s behavior.

##### Table Configurations

* **Row click:** Defines the action triggered when clicking on a row with [event configuration](#_event).

![table config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/table-config.png)

Figure 41. Table Configurations

##### Column Configurations

###### Actions

Users can manage table columns with the following actions that can be triggered from row action buttons, pop-up menus, or right-click context menus:

* **Insert a Column**

  + Add a new column above or below the selected column using the pop-up items or by right-clicking the column header.
* **Move Up/Down**

  + Move a column up or down within the same pin direction using the pop-up items or by right-clicking the column header.
* **Reorder Columns**

  + Drag and drop columns to change their order within the same pin direction (`left`, `right`, or `none`).
* **Delete a Column**

  + Remove a selected column by clicking the "Delete" button in the column row.
* **Edit Column Properties**

  + Click the "Edit" button in the column row or use the inline row controls to modify the individual column properties that are described below.

###### Properties

* **Column Width:** Defines the column width as an integer or a decimal value with up to two decimal places
* **Pin Direction:** Sets whether the column is pinned (`left` or `right`) or unpinned (`none`).
* **Action Column:** Marks the column as an action column for special interaction elements (`true` or `false`).
* **Default Width:** The initial width of the column before user adjustments.
* **Min Width:** The minimum allowed width when resizing is enabled.
* **Fixed Width:** Determines how column width is calculated:

  + If `true`, width is computed as `width * 150px`.
  + If `false`, width is relative to the table’s overall width.
* **Alignment:** Controls horizontal and vertical text alignment within the column:

  + **General Alignment:** Applies to the entire column.
  + **Specific Alignment:** Can override general settings for the head, body, and foot cells individually.

![additional table column config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/additional-table-column-config.png)

Figure 42. Additional Column Configurations

##### Row Configurations

Table body rows can be managed like standard Content elements, allowing actions such as insert, duplicate, delete, reorder,
and move using the component tree panel on the left-hand side.

|  |  |
| --- | --- |
|  | For dynamic tables, where body rows are generated based on data, these row actions will not be available. |

For head and foot rows, certain actions are also restricted to ensure that the table contains at most one header and one footer row.

##### Cell Configurations

Users can provide a simple text value using the **Content** input or insert more complex elements,
such as paragraphs, images, and other content elements, inside the cell using the element insertion feature.

![table cell config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/table-cell-config.png)

Figure 43. Table Cell Configurations

#### Expandable Element

Besides [common configurations](#configure-elements/common) for margin and padding, the Expandable element has specific configurations that allow you to fine-tune its layout and appearance:

* **Initial status:** Set the initial appearance state of an expandable element. There are 2 available states: **Collapsed** (default) and **Expanded**.
* **Icon:** Set the appearance of collapsed and expanded icons.

  + **Collapsed icon:** Select the collapsed icon.
  + **Expanded icon:** Select the expanded icon.
  + **Alignment:** Align the collapsed and expanded icons to the right (default) or to the left of the expandable element.
  + **Size:** Select the size of collapsed and expanded icons to be medium (default), big or a custom value.

|  |  |
| --- | --- |
|  | Expandable sub-elements, i.e. Collapsed, Expanded, Title and Content, do not have any configurations. |

![expandable config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/expandable-config.png)

Figure 44. Expandable Element Configurations

Switching between collapsed and expanded states of an expandable element could be achieved in 2 ways:

* Selecting the corresponding element in the components tree
* In canvas, a switch button would appear when hovering over an expandable element. Selecting this switch button to toggle between the corresponding collapsed and expanded states.

![expandable switch button](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/expandable-switch-button.png)

Figure 45. Switch Button to Toggle Between the Collapsed and Expanded States of an Expandable Element

#### Repeatable Group Element

The Repeatable Group element allows binding content to a specific group in the document model, enabling structured data handling and dynamic content rendering.
It can duplicate its child elements based on the number of items in the selected group, making it ideal for lists, collections, or any repeatable data structures.

For example, suppose the document model defines a group called **Products** containing fields such as **Name**, **Description**, and **Price**.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` /Company   /Products     - Name     - Description     - Price ``` |
```

A Repeatable Group element can render each product’s details dynamically by repeating its child elements for every product in the group.

To use it, insert a Repeatable Group element into the desired position in the content tree.
In the configuration panel, select the corresponding Group Reference from the document model — for instance, `/products`.
Inside the Repeatable Group element, add child elements such as a Box container, then Paragraphs or Headings, and bind them to the fields within the selected group (e.g., bind a Heading to the **Name** field and a Paragraph to the **Description** field).

At runtime, if the Products group contains *four* products, the content inside the Repeatable Group element will be rendered *four* times — producing *four* boxes, each showing the respective product’s name and description.

In the editor, where actual data is unavailable, use the **Repeatability in Preview** option to define how many instances appear in the WYSIWYG view.
This helps visualize how the final output will look with real data. This setting affects **only the preview** — at runtime, **all group items** are rendered.

In the Content Preview, when the document is initially empty, the Repeatable Group elements **will not** display any content.
To visualize the repeated content, prepare a sample document and select it in the Content Preview (see Live Preview section).

##### Configuration Options

* **Group Reference**: The Group element in the bound Document model, used to narrow down the scope of the child elements.
  When a group reference is selected, the Content Model will only allow child elements that are compatible with the selected group.
  This ensures data integrity and prevents configuration errors.

|  |  |
| --- | --- |
|  | For backward compatibility, it is possible to select a non-repeatable group (i.e., a group with repeatability equal to one). However, this is unnecessary — child elements can be bound directly to fields of such a group without wrapping them in a Repeatable Group element. If a non-repeatable group is selected, the **Repeatability in Preview** option is hidden, and the WYSIWYG view always shows a **single** instance. |

* **Repeatability in Preview**: Defines how many instances of the child elements are displayed in the WYSIWYG editor.
  This setting is only for preview purposes and does not affect runtime rendering, where all items in the referenced group will be rendered.

|  |  |
| --- | --- |
|  | Changing the Group Reference may require reconfiguring child elements if their bindings become incompatible with the new group. |

#### Action Elements

Action Elements, unlike other elements, are designed to facilitate user interactions and trigger specific actions.
They are primarily used for the click events of the [Button element](#configure-elements/button)
or [Interactive tile element](#configure-elements/interactive-tile). The table below provides an overview of the available Action Elements and their configurations.

| Element | Description | Additional Configurations |
| --- | --- | --- |
| Save Action | Save the current data/changes to persist modifications | None |
| Commit Action | Submit the current data/changes and close the engine/activity | None |
| Cancel Action | Discard the current changes and revert to the previous state | None |
| Delete Row Action | Delete the current row/item for the current scoped group | None |
| Add Row Action | Add a new row/item for the current scoped group | **Group reference:** Defines the target group to which the new row/item will be added. This is required to specify where the new data should be inserted. |

|  |  |
| --- | --- |
|  | When using Delete Row Action, consider implementing confirmation dialogs to prevent accidental data loss. |

### Form Elements

#### Common Configurations for Form Elements

Form elements allow the user to work with data from an A12 document as well as displaying validation messages. Therefore, form elements require a valid Document Model reference.

Most form elements serve as inputs to modify data. These input elements mostly share the same set of configuration options.

##### Element Reference

All input elements require a reference to a Document Model element. This reference determines which element of the underlying Document Model can be modified by the respective input element.

The available options depend on

* the type of form element
* the available elements in the Document Model
* the data context of the input element

The data context of the Content Model is defined by the base group from the [model settings](#model-settings). The data context of a specific input element depends on this model setting and the nesting of this element inside [Repeatable Group](#configure-elements/repeatable-group) elements in the Content Model. A Document Model element will be considered as compatible with an input element if it is

* located directly inside the context group of the input element or any non-repeatable sub-group
* located in any ancestor group of the context group or any non-repeatable sub-group of this ancestor

|  |  |
| --- | --- |
|  | Consider this example of a Document Model with the structure:  * RootGroup (Non-repeatable)  + Field0  - Group1 (Non-repeatable)  * Field1     - Group2 (Repeatable)  * Field2       * NestedGroup1 (Non-repeatable)  + NestedField1       * NestedGroup2 (Repeatable)  + NestedField2     - Group3 (Repeatable)  * Field3  If an input element is defined in the context Group2, then  * Field0 * Field1 * Field2 * NestedField1  will be considered as compatible. NestedField2 and Field3 are not compatible, because they are defined in the context of repeatable groups that are neither the context group nor an ancestor of the context group. |

All compatible elements will be presented in a dropdown list for selection.

![element reference config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/element-reference-config.png)

Figure 46. Element Reference Configuration

##### Localized Texts

For each input several localized texts can be defined by adding entries to the given table:

* **Locale:** The locale for which the corresponding text should be used.
* **Text:** The text to be displayed.

![localized text config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/localized-text-config.png)

Figure 47. Localized Text Configuration

###### Label

The label will be shown above the input. If no label is defined in the Content Model, the label defined in the Document Model will be used as a fallback.

If the field is set to required in the Document Model, an asterisk will be shown next to the label by default. This behavior can be changed for each element individually (see [Show Asterisk](#configure-elements/form-elements-common/show-asterisk)).

In addition to the label text itself, there is an option to visually hide the defined label. For screen reader users, the label will still be available if this option is selected.

###### Hint

The hint will be displayed as an icon right next to the input. The corresponding text will be shown when hovering over the icon.

Similar to labels, the external description of the Document Model element will be used as a fallback if no hint text is defined in the Content Model.

###### Placeholder

Placeholder texts are only available for text input elements. The defined text will displayed in the input as long as no value has been entered.

##### Additional Settings

All input elements can be further configured via additional settings. Some of these settings are available for all elements while others depend on the specific input type and/or Document Model element type. This section only covers the common settings, while more specific settings are described in the sections of the respective elements.

![additional settings](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/additional-settings.png)

Figure 48. Additional Settings of an Input Element

###### Readonly

When this option is selected, the input will be set to read-only at runtime.

|  |  |
| --- | --- |
|  | Please note that inputs for computed fields will always be shown as read-only, regardless of this setting. |

###### Message Exposition

By default, validation messages will be displayed in a small message box above the input element. This can be changed to display messages in form of a tooltip icon instead.

###### Show Asterisk

This setting can be used to control whether an asterisk will be added to the label. There are three available options:

* Always: Always shows an asterisk for this element.
* If required: Only shows an asterisk if the referenced field is set to required in the Document Model.
* Never: Does not show an asterisk.

##### Annotations

All input elements support annotations, where every annotation consists of a name and an additional value.

This can be used to add information to model elements that can be used by developers to customize the annotated element.

![annotations config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/annotations-config.png)

Figure 49. Annotations of an Input Element

#### Auto Complete Element

The Auto Complete element supports references to:

* Enumeration fields
* String fields with a list of pre-defined suggestions in the Document Model

It does not require any specific configuration besides [common configurations for form elements](#configure-elements/form-elements-common).

#### Checkbox Element

The Checkbox element supports references to:

* Boolean fields
* Confirm fields

It does not require any specific configuration besides [common configurations for form elements](#configure-elements/form-elements-common).

#### Checkbox Group Element

The Checkbox Group element supports references to:

* Multi-select groups

It does not require any specific configuration besides [common configurations for form elements](#configure-elements/form-elements-common).

#### Date Picker Element

The Date Picker element supports references to:

* Date fields
* Date Time fields
* Time fields
* Date Fragment fields
* Date Range fields

Depending on the type and configuration of the referenced field, a picker button will be automatically shown inside the input to open the respective picker dialog.

No picker will be shown for

* Date Fragment fields
* Date Range fields if the format is set to something other than full dates in the Document Model

In these cases, users need to enter the date values manually.

Besides [common configurations for form elements](#configure-elements/form-elements-common), the Date Picker element also supports configuration of autocompletion behavior and the picker dialog:

* **Auto Complete:** A string that will be used by the browser to support autocompletion (e.g. "bday", "bday-day", "bday-month", "bday-year", "off", …​). Multiple values can be given in a space-separated list. See [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#value) for more details.
* **Date Picker Config:** Only available if the referenced field is of type Date, Date Time or Date Range.

  + **Min Year:** Either an absolute year (e.g. 2000) or a number of years relative to the current year (e.g. -5 for 5 years ago, +3 for 3 years in the future).
  + **Max Year:** Either an absolute year (e.g. 2000) or a number of years relative to the current year (e.g. -5 for 5 years ago, +3 for 3 years in the future).
  + **Absolute:** Whether the provided values for min and max year will be interpreted as absolute years or relative to the current year.
  + **Preselection Year:** Defines which year will be preselected in the picker dialog if no value has been entered yet.

![date picker config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/date-picker-config.png)

Figure 50. Date Picker Configuration

#### Multi Select Element

The Multi Select element supports references to:

* Multi-select groups

It does not require any specific configuration besides [common configurations for form elements](#configure-elements/form-elements-common).

#### Radio Element

The Radio element supports references to:

* Boolean fields
* Enumeration fields

Besides [common configurations for form elements](#configure-elements/form-elements-common), the Radio element provides an additional setting to configure its appearance:

* **Inline:** If this option is selected the radio buttons will be displayed horizontally instead of vertically.

![radio config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/radio-config.png)

Figure 51. Radio Configuration

#### Select Element

The Select element supports references to:

* Boolean fields
* Enumeration fields

It does not require any specific configuration besides [common configurations for form elements](#configure-elements/form-elements-common).

#### Switch Element

The Switch element supports references to:

* Boolean fields
* Confirm fields

Besides [common configurations for form elements](#configure-elements/form-elements-common), the Switch element provides additional settings to configure its labels:

* **Unchecked Label:** Displayed to the left of the input (unchecked position).
* **Checked Label:** Displayed to the right of the input (checked position).

![switch label config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/switch-label-config.png)

Figure 52. Switch Label Configuration

#### Text Area Element

The Text Area element supports references to:

* String fields
* Custom fields

Besides [common configurations for form elements](#configure-elements/form-elements-common), the Text Area element provides an additional setting to configure its behavior:

* **Auto Expand:** Whether the text area automatically expands vertically to fit its content.

![text area config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/text-area-config.png)

Figure 53. Text Area Configuration

#### Text Line Element

The Text Line element supports references to:

* String fields
* Number fields
* Custom fields

Besides [common configurations for form elements](#configure-elements/form-elements-common), the Text Line element provides additional settings to configure its appearance and behavior:

* **Suffix:** A localized text that will be displayed inside the text input. This can be used to indicate units, currencies, etc.
* **Truncate Suffix:** Whether longer suffix texts will be truncated.

![text line suffix](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/text-line-suffix.png)

Figure 54. Text Line Suffix Configuration

* **Auto Complete:** A string that will be used by the browser to support autocompletion (e.g. "name", "username", "email", "country", "off", …​). Multiple values can be given in a space-separated list. See [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#value) for more details.
* **Secret:** Whether the value of the input should be masked.

![text line config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/text-line-config.png)

Figure 55. Text Line Additional Settings

|  |  |
| --- | --- |
|  | The secret option only affects the display of the value in the input field. It does not provide any additional security for the stored value. |

#### Message Group Container Element

The Message Group Container element can be configured by adding references to any Fields, Groups, and Rules from the Document Model. All validation messages related to the referenced elements will be grouped together and can be displayed within a Message Group Display element, that is nested inside of the Message Group Container. Furthermore, these messages will not be displayed at individual input elements anymore.

Additionally, it can be configured whether the configuration will apply to all messages or if formal errors should be excluded. In this case, formal errors on referenced fields will still be displayed at the respective input elements.

![message group container config](https://geta12.com/docs/2025.06/ext5/content_engine/contentengine-user-docs/assets/images/message-group-container-config.png)

Figure 56. Message Group Container Configuration

|  |  |
| --- | --- |
|  | The configuration of the Message Group Container only applies to inputs and Message Group Display elements that  * are nested inside the container * but not nested in any additional Message Group Containers (in this case, only the configuration of the closest ancestor applies) |

#### Message Group Display Element

The Message Group Display element does not require any configuration. The behavior of this element is defined by its closest Message Group Container ancestor.
