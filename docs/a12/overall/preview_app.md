---
source: https://geta12.com/docs/2025.06/ext5/overall/preview_app/index.html
category: overall
docid: preview_app
scraped: 2026-06-12
---

# Preview App

As part of your installation of the Modeling Environment, the ***Preview App*** is available. The Preview App is a small, local A12 application, which runs on your PC and cannot be accessed e.g. via the internet.

The Preview App is a full stack A12 application, which consists of an A12 server and A12 client. The models (and data), which the Preview App will use, are determined by ***workspaces***. A workspace contains amongst others models that are loaded by the Preview App Control into the Preview App Server. This makes it possible to have different independent sets of models, that can be used in the Preview App and make it feel like separate sample applications.

Different Sample Workspaces are delivered by default: basic, advanced, e-commerce and with-workflows as well as a tutorial workspace, which is intended to be used as a basis for the [Tutorial: Put It All Together](https://geta12.com/docs/overall/modeling_tutorial_super1/index.html). It is possible to use those workspaces as basis to add one’s own models.

Please be aware that the Preview App is not intended to be used in production environments. It is a tool to test and showcase models created in the Modeling Environment. Its intention is to provide a quick way to see how models behave in an example A12 application but can not serve as a basis for a productive application nor is able to show all features of a project specific A12 application which make use of custom implementations or configurations. Please always keep in mind that A12 components offer further features beyond modeling capabilities.

## Preview App Control

The ***Preview App Control*** is a tool to start, stop and configure the Preview App.

![PA Control](https://geta12.com/docs/2025.06/ext5/overall/preview_app/assets/PA_Control.png)

Figure 1. Preview App Control

Select a workspace in the dropdown. All sample workspaces are available in the list. It is possible to add another workspace available in the file system to the list via the plus button.

![PA Control addWS](https://geta12.com/docs/2025.06/ext5/overall/preview_app/assets/PA_Control_addWS.png)

Figure 2. Preview App Control: Add Workspace

The copy button will create a copy of the currently selected workspace in a location that has to be selected by the user. A copy of a workspace could be used as a starting point for a custom workspace.

![PA Control copyWS](https://geta12.com/docs/2025.06/ext5/overall/preview_app/assets/PA_Control_copyWS.png)

Figure 3. Preview App Control: Copy Workspace

You can create a new empty workspace using the *New Workspace* button. Empty in the sense that it contains no domain-specific models. It will be created with the same folder structure as the sample workspaces and will come with a basic user setup, a sample welcome page (Content Model), and an App Model *PreviewApp\_AM.json* with the basic configurations to be used in the Preview App.

The *Start* button will run the Preview App using the models, workspace data and other resource files from the selected workspace. It will start an A12 server and client and, depending on the workspace, also the Camunda Engine for A12 Workflows, on default ports. If those default ports are already in use, they can be changed in the "Expert Mode" of the Preview App Control.

After triggering the start of the Preview App, the status display will switch to "Connecting". Once the Preview App has been successfully started, the status display will switch to "Online" and a new browser window or tab showing the login page of the Preview App will be opened.

![PA Control Connecting](https://geta12.com/docs/2025.06/ext5/overall/preview_app/assets/PA_Control_Connecting.png)

Figure 4. Preview App Control: Connecting

![PA Control Online](https://geta12.com/docs/2025.06/ext5/overall/preview_app/assets/PA_Control_Online.png)

Figure 5. Preview App Control: Online

While the Preview App is running, it can be stopped or restarted via the Preview App Control by the respective buttons. The Preview App will also be stopped by closing the Preview App Control. "Open in browser" will open a new browser window or tab showing the Preview App.

Use the button next to the workspace selection to toggle between *easy* and *expert mode*. It is only possible to toggle modes when the application is not running.

![PA Control expertModeSwitch](https://geta12.com/docs/2025.06/ext5/overall/preview_app/assets/PA_Control_expertModeSwitch.png)

Figure 6. Preview App Control: Switch between easy and expert mode

![PA Control expertMode](https://geta12.com/docs/2025.06/ext5/overall/preview_app/assets/PA_Control_expertMode.png)

Figure 7. Preview App Control: Expert Mode for a workflows workspace

In expert mode it is possible to change the ports on which each component runs. It is also possible to start, stop and restart each component separately. Expert mode also provides access to a log of each component, which can be useful for troubleshooting.

## Login Page

The Preview App will start at the login page. The following settings are possible on the login page

* Language: English or German (Deutsch)
* Theme: Select a plasma theme - Default, Compact, Flat or Flat Compact

[Plasma](https://geta12.com/docs/plasma/plasma-concept-documentation/index.html) is the design system used by A12. Plasma can be themed, which changes the look and feel of the application. Besides the "default" theme, the Preview App provides the "compact" theme which is a variation of the "default" theme, as well as the "flat" and "flat compact" theme which have a more modern look and showcase the theming capacities of plasma. More (technical) documentation on plasma theming can be found in the [Widget Showcase](https://www.mgm-tp.com/a12.htmlshowcase/#/) under Get Started → Use and Configure Plasma.

## Roles and Users

The Preview App uses the A12 User Authentication and Authorization. For more details, refer to its documentation under Developing → [UAA](https://geta12.com/docs/uaa/uaa-documentation-src/index.html). Please note that these are also used to connect to the server within the SME for model deployment within the modeling environment setup.

We distinguish between the end user application and the User Management application.
We established the latter to manage users and roles, the respective files are located in the `\auth` directory. These files can be edited manually, but the User Management application provides a user-friendly interface and upload functionality to do so.
The User Management can be started from the Expert Mode of the Preview App Control (see [Preview App Control: Expert Mode for a workflows workspace](#expertMode)).
When logged into the User Management, there are three User Management modules available:

![UserManagementModules](https://geta12.com/docs/2025.06/ext5/overall/preview_app/assets/UserManagementModules.png)

Figure 8. User Management for the Preview App

Within these modules the *usermanager* is able to create new roles with available access rights and assign them to existing or new users. The available access rights depend on the individual A12 components used to build the application, they are valid for the Preview App and should be treated as example implementation. Please note that access rights cannot be created or modified in this use case.

In the *Roles* Module an export of the role mapping is available which can be used to adjust the roles for the next start of the Preview App. The exported "roles.yaml" shall replace the already existing one in the workspace found in "\auth\roles.yaml". This workflow enables the modeler in the Modeling Environment to be supported during role based access right modeling in the SME. If changes have been made to roles and users, the Preview application will need to be restarted.
Please find a more detailed description of the modeling support in the general documentation about the [Simple Model Editor](https://geta12.com/docs/sme/sme-ba-docs/index.html) as well as in [Modeling Support for Role Based Access Control](https://geta12.com/docs/overall/comprehensive_features_rbac/index.html).

### User, Roles and Their Functions

| User | Role | Is authorized to: |
| --- | --- | --- |
| usermanager | userManagementAdmin | access the User Management modules (User Management, Roles Management, Access Rights Management) of the User Management to create, edit and delete Users and Roles. |
| enduser | tester | access the end user application modules to create, edit and delete Documents. |
| reader | reviewer | access the end user application modules to read existing Documents. |
| ba | modeler | create, edit and deploy models from SME to the Preview App and test them end-to-end. |
| admin | systemAdmin | access the end user application modules to create, edit and delete Documents as well as create, edit and deploy models from SME to the Preview App Server. In addition, the administrator can perform workflow actions. |

The password for every user in the Preview App and User Management is "a12". This is also true for newly created ones.

|  |  |
| --- | --- |
|  | There is a special Access Right "MODEL\_MANAGE", that allows a Role to add, change or read models even if the Role is not listed in the model. This Access Right is assigned to the Roles "modeler" and "systemAdmin". Hence, these Roles (and the Users "ba" and "admin") can work with the models although they are not listed in the model files. |

## Structure

The Preview App is structured into modules which appear like “main menu entries”.

![modules](https://geta12.com/docs/2025.06/ext5/overall/preview_app/assets/modules.png)

Figure 9. Modules

The sample workspaces initially display a “Welcome” page which will give you a brief introduction into the other modules of the workspace.
All the other modules contain a master-detail view: On the master view, you can see a list or tree of existing documents. Selecting a document opens a detail view of the document on the right side. It is also possible to add a new document via the “new” button.

![master details view](https://geta12.com/docs/2025.06/ext5/overall/preview_app/assets/master-details-view.png)

Figure 10. Master Detail View in the Preview App

## Workspaces

There are some sample workspaces containing some sample models and data included in the installation. The sample workspaces can be found in the **Workspaces** folder in the root installation directory.

An overview of the features included in the workspaces can be found [here](#_features_in_the_installer_workspace_models).

### Basic Workspace

The basic workspace contains three Master-Detail modules and the Dependencies module. The Dependencies module contains information on the exact product versions which are used in the Preview App.

The modules "Person" and "Company" are simple modules that are linked via a 1 – n (Company - Person) relationship. All available relationship ui components are showcased in those two modules.

The module "Invoice" shows the training example, which is used frequently in the A12 tools training for modellers. It is a simple form for an invoice with a billing and a shipping address, order and delivery dates, a product list and payment information. A lot of modeling features are used, also some advanced validation. Some parts are included to show a certain feature, and do not claim to be meaningful. The user perspective is shown in this menu and to understand the modeling perspective, the models can be opened with the respective tools.

### Advanced Workspace

Here you can see examples of more complex relationships with several levels and different types of relationships between "Person", "Team", "City" and "Country".
An example of heterogeneous data is available with the "People" overview, which displays both "Employees" and "Freelancers".
This heterogeneous data is also visible in the Relationship UI on the "Team" details form.

Moreover, the workspace includes the tree engine to display the entities in their hierarchical structure and Composed Data (CDMs) to formulate Rules and Computations across linked documents.

A Query Model is used to predefine a selection of Persons for the "Fulltime but unassigned" overview. Filter conditions that reach across Relationships are modeled.

A Print Model "City\_PM" that is based on the Document Model "City\_DM" is present.
It gives examples for many of the features you could use while creating a Print Model.
Find more information in the table below.

In order to create the pdf and the preview correctly, the Print Engine needs one Print Settings Model in the workspace.
Any custom fonts or images must be present in the "resources" folder of the workspace and can then be selected in the Print Model Editor.

The Print Model can be previewed using the documents for City\_DM that are present in the workspace.
Currently, there is no support for the Print Engine in the Preview App but you can preview the Print Models in the Print Model Editor.

### E-Commerce Workspace

The e-commerce workspace included serves as a showcase for many of the modeling features in the context of an e-commerce application.
This workspace is the only one that comes with Workspace Data.
Due to this, the startup of this workspace from the Preview App Control takes significantly longer compared to the other workspaces.

Examples of the following features are visible in this workspace:

#### Validation Rules

The ERP ID field is an example of the required field feature. It is also possible to make a field required based on the value of another field – for example Ingredients must be filled if the food product has the Allergens field filled.

Validation tests on repeats are also displayed in this workspace. Testing that the values in a repeat are unique can be seen when adding attributes for a product, all attribute names must be unique. Specifying that at least one value has been added to a repeat is another example of validation in a repeat – At least one author must be added for each book.

#### Computation Rules

An example of a string concatenation can be seen with the VariantFullERP\_ID. This is a computed field. It is made up of the product ERP ID concatenated to a 3 digit Variant ERP Suffix.

The current discount % field of the product is computed using the current price field and either the Old price if present, or the recommended price if present. Multiple preconditions are used in this computation.

The Number of Variants field in the product overview is calculated by counting the number of entries in the variants repeat for the product.

#### Expressions

The assigned attributes that are displayed in the variant repeat on the variant tab of the product page is generated using an expression. The expression concatenates all values in the attributes repeat into one string so that all assigned attributes as one value for a variant are displayed. Basic formatting can be added to the result of the expression like line breaks between values that are concatenated to make the result better readable. An Example of a product with variants can be seen in the ‘pears’ product.

#### Dependent Fields

Some of the fields for the Nutrition Facts are editable or read-only based on the Use Values Of Chemical Analysis boolean. The ‘Nutrition Fields’ are dependent on the value of the checkbox.

#### Ratio of Width of Master/Details Screens

Shown in the product module is the ‘BundlesFlow’ or ‘MoviesFlow’ for example where the ratio of the width is set to 4:8 (Overview : Form), so that there is more space for the product details. This is set in the App Model.
The brand module has no setting for the width in the App Model so the default ratio is used.

#### Errors and Warnings

Validation can result in either warnings or errors. The Validate button will trigger all the errors and warnings.

#### Tab Navigation

The product model contains multiple screens and navigation buttons in the model sub header. These navigation buttons are shown as tabs in the application, which allow the user of the application to navigate between screens.

#### Pinned Columns in the Overview

In the product food overview the first column is pinned.

#### Searching and Filtering

Full text search and powerful filtering is standard with the overview.
By setting the Annotation `indexed` = `false` in the respective Document Models, the modeler can fine tune the Search experience for the end user.

#### Different Types of Relationships

Brand-Product relationship is an example of a 1-n relationship.
Product-Order relationship is an example of an n-n relationship.

#### Different Relationship UI Components

Drop Down Selection – used to select a brand on the product page.
Dual Pane Selection – used to select a product on the bundle page.
Table List – used to display orders on the orders tab of the product page.

#### Placeholder

An example of a placeholder is visible on the ‘Customer’ details page, in the ‘Customer Number’ field.

#### Heterogeneity

Heterogeneity can be seen in the ProductCatalog where the products are displayed in a heterogeneous tree.

#### Modeling a Tree

An example of a tree is given in the ProductCatalog module. This tree displays heterogeneous data.

This workspace is fully modelled using the A12 modeling tools, and without any additional development work. The aim here is to show that it is possible to produce applications that are quite complex in A12 using modeling alone. Further complexity that cannot be achieved by modeling alone can be added by developers working with A12 APIs.

### Workflows Workspace

In this workspace you can test the power of the A12 workflows fully integrated in our preview application. There are examples in this showcase showing different features that are available in A12 workflows, these examples include a workflow called Vacation Request that is started from the Application module, in which an applicant can make an application for vacation. Submitting this application starts another process in the second Approval module, in which HR can approve or reject the application. The documents of both processes are linked by a relationship link. The All Applications module displays all open and completed vacation requests.

#### Required Workspace Configuration

To get the workflows working you have to define an email provider for workflows email delegation. Please edit the workspace.json file of this workspace and add missing information under environmentVariables > "camunda-engine" > "MGMTP\_A12\_WORKFLOWS\_CAMUNDA\_DELEGATES\_EMAIL\_ …​" . You have to add the host, some credentials and a from value that will present the email address you will receive your workflows email from.

If you are unsure about this step please ask your local IT support for help.

### Example and Tutorial Workspaces

#### Tutorial Workspace

This workspace serves as a starting point for the [Tutorial: Put It All Together](https://geta12.com/docs/overall/modeling_tutorial_super1/index.html).
This workspace contains the Document, Form and Overview Models required for this tutorial.
Full functionality is achieved by completing the tutorial.

The tutorial shows how the Document Models can be grouped using a Supertype and how Relationship and Tree Models can be used with these groups of models.

|  |  |
| --- | --- |
|  | This workspace is incomplete.  This workspace may be started in the Preview App Control with limited functionality.  The App Model in this workspace is invalid due to a missing reference. The missing reference is added in [Step 9](https://geta12.com/docs/overall/modeling_tutorial_super1/index.html#Super1Step9) of the tutorial |

#### Kernel Language Workspace

The Kernel Language Workspace provides a number of examples of Validation and Computation Rules.
There are two modules with business use-cases, "Invoice" and "Customers", and two modules with abstract examples, "Computation" and "Abstract Examples".
These are designed to help you visualize the function of certain A12 Kernel Language constructs.

The module "Invoice" features a Document Model with Computation and Validation Rules which is similar to that found in the Basic Workspace.
The focus in this module is on Computation Rules using the Filter Operator "Having".
You can find a number of examples at the bottom of the form.

The module "Customers" features a Document Model with Computation and Validation Rules which focus on Index Fields and using the Semantic Index.

The module "Computation" features a Document Model with Computation and Validation Rules which allows you to perform a range of calculations similar to those found on a pocket calculator.
The example is then extended to include calculations with different data types.
This includes Date Fields and String Fields.

The module "Abstract examples" features a number of examples to aid understanding of specific topics.
You can look at examples for showing you:

* When Predicate Language Constructs, for example `FieldFilled()`, are true
* When Predicate Language Constructs, for example `FieldValueIncludedInValueList ()`, are true
* Examples of Language Constructs using FieldLists
* How Parallel Iteration can be used in Repeatable Groups
* Examples of the Regular Expressions

## Features & Customizations

### Change Theme and Locale

The Preview app demonstrates how the theming and localization of an A12 application can be changed while it is running and a user is logged in.

|  |  |
| --- | --- |
|  | The Preview App supports only the locales `en` and `de`. These supported locales are fixed for the Preview App and cannot be changed or extended. If a different locale is used, the Preview App may not function correctly. |

### Application Title

Within the Preview App the modeler is able to change the application title via the Application Model. The Preview App will make use of the Labels you’ve defined for it and adds the respective release line.

![appmodel labels](https://geta12.com/docs/2025.06/ext5/overall/preview_app/assets/appmodel_labels.png)

Figure 11. Labels in App Model

![appmodel apptitle](https://geta12.com/docs/2025.06/ext5/overall/preview_app/assets/appmodel_apptitle.png)

Figure 12. Application Title with App Model Label and A12 Release Line

### Content Modeled Welcome Page

Each workspace contains a welcome page.
It is modeled in the Content Model `WelcomePage_CM.json` and integrated via the App Model.
It is opened automatically due to the Initial Activity settings in the App Model.

### Setting the `indexed` Annotation

One of the main improvements with QueryAPI is the new search index formation.
A search index is a specially structured, smaller database, that allows to quickly find the correct documents for a query.
It is also used to serve data for overviews and trees faster.
With the default settings, Data Services does not load the complete documents from the database but only the requested Fields directly from the search index.

If no action is taken, all Fields of the Document Models are indexed.
In order to improve the performance of data retrieval, it is recommended to limit the number of indexed Fields to your projects requirements.
Set an Annotation `indexed` = `false` to all the Fields that are not shown in trees or overviews and shall not be included in Fulltext Search or Filtering.
The Annotation must be set in the Document Model.
The Overview and Tree Model editors will warn the modeler, if a Field is selected in a column or Filter definition but has the Annotation `indexed` = `false`.

Find out more directly in the [Data Service developer documentation](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#_simple_search).

|  |  |
| --- | --- |
|  | If Heterogeneity is used, the Annotations must be consistently added in the SubTypes and the SuperTypes. |

As a rule of thumb: Less Fields marked with `indexed` = faster Search and Filtering for the enduser.

In previous version of A12 the Fulltext Search operated on **all** Fields of the Document Model.
Contrarily, the QueryAPI only operates on Fields that are not marked with the Annotation `indexed` =`false`.

Let’s take an example Document Model *Person* that contains the Fields *FirstName* and *PlaceOfResidence*.
For *PlaceOfResidence* the Annotation `indexed`=`false` is set.

Our Database contains two documents:

1. *Person1* with *FirstName* = "Alan" and *PlaceOfResidence* = "Paris"
2. *Person2* with *FirstName* = "Paris" and *PlaceOfResidence* = "Miami"

In previous versions of A12, a Fulltext Search for the term "Paris" would find both documents.
Now, the overview would only show the entry for *Person2*.

Since the Field *PlaceOfResidence* has the Annotation `indexed`=`false`, its values are not included in the search index and *Person1* is not a match for the Fulltext search term "Paris".

This new feature allows modelers to fine-tune the Search results for the end users.

The Fulltext Search is used in the Overview Engine and in the Relationship UI component DropDown.

|  |  |
| --- | --- |
|  | Please be aware, that the Annotations `enable_approximate_match_search` and `enable_case_insensitive_search` are still used by the Overview Engine.  Please keep those Annotations. |

### New Search Behavior In Standard A12 Applications

* Only Fields that are indexed are considered in the **Full Text Search** of overviews and DualPane Relationship UIs. Moreover, the autosuggestion in the DropDown Relationship UI also uses the Full Text Search.

  Set the Annotation `indexed` = `false` to Fields that should be excluded from indexing.

  This can be used to fine-tune the search results for the end users and only shown relevant results.

  This will improve the performance of the application.
* Only Fields of type String, Enumeration and Number are searchable.

  For Enumerations, the Label Texts in the locale of the running application are compared, not the value.
  This is because the end user only sees the Label Texts and not the value.

  Date/Time Fields can be searched as well, but results are dependent on the tokenization that can be customized by a developer.
  Moreover, the search is done on the saved value, not on what is displayed.
  Date and time values are usually localized. For example a timestamp shown in the en\_US locale as "06/01/2025 09:30 pm" will neither match a search for "09:30" nor for "06/01", as the internally saved value is "2025-06-01T21:30:00".
* Whitespaces in the Full Text Search term are considered as ´AND´ operator.

  For the [example above](#QSG:QueryAPI:indexed), the search term "Alan Paris" will not give any result, as there is no document, that contains **both** "Alan" in any of the indexed Fields
  **and** "Paris" in any of the indexed Fields
* The order of the search terms does not make a difference.

### New Filter Behavior In Standard A12 Applications

* Filters will only work for indexed Fields.
* The asterisk `*` can not be used as a term in Filters to retrieve all the Fields with any value.

### Showcase in Installer Workspaces

The Annotation `indexed` = `false` is set on the Field *Mayor* of the City Document Model in the advanced workspace.
You can have any value in this Field, but you will not be able to Filter or Search for it.

The Annotation `indexed` = `false` is set on most of the common Fields of the Products in the e-Commerce workspace.
However, all the Fields shown in the Filter Selector are indexed.

## Features in the Installer Workspace Models

### Features in the [Document Model](https://geta12.com/docs/sme/sme-dm-ba-docs/index.html)

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| *Feature* | | *Workspace* | *Model* | *Module* | *Further information* |
| **Field types** | String | Basic | Invoice\_DM | Invoice | /Invoice/Addresses/BillingAddress/FirstName |
|  | Number | Basic | Invoice\_DM | Invoice | /Invoice/Order/TotalPrice |
|  | Date | Basic | Invoice\_DM | Invoice | /Invoice/PaymentInfo/CreditCard/DueDate |
|  | Time | Basic | Invoice\_DM | Invoice | /Invoice/Order/DeliveryOptions/DeliveryFrom; /Invoice/Order/DeliveryOptions/DeliveryTo |
|  | DateTime | Workflows | WorkflowsMetadata\_DM | Workflows | /A12WF/Task/CreationDate |
|  | DateFragment | Basic | Person\_DM | Person | /People/Memberships/StartDate |
|  | DateRange | Basic | Person\_DM | Person | /People/Education/Time |
|  | Boolean | Basic | Invoice\_DM | Invoice | /Invoice/Addresses/DifferentShippingAddress |
|  | Enumeration | Basic | Invoice\_DM | Invoice | /Invoice/Addresses/BillingAddress/FormOfAddress |
|  | Confirm | Basic | Invoice\_DM | Invoice | /Invoice/Order/TermsAndConditions |
| **Validation language** | Validation rules | Basic | Invoice\_DM | Invoice | /Invoice/Order/OrderBeforeDelivery; /Invoice/Order/UniqueOrder … |
|  | Error | Basic | Invoice\_DM | Invoice | /Invoice/Addresses/BillingAddress/NamesFilledTogether |
|  | Warning | Basic | Invoice\_DM | Invoice | /Invoice/Order/NoOrderWarning |
|  | Info | Basic | Invoice\_DM | Invoice | /Invoice/Addresses/DifferentShippingAddressDiffers |
| **Other** | Includes | Basic | PersonCompany\_  Company\_\_\_generated |  | /target/Company (for relationship between Person and Company modules) |
|  | Attachment | Basic | Company\_DM | Company | /Company/CompanyDetails/CompanyLogo |
|  | Multi-Select | Advanced | Country\_DM | Country | /Country/SpokenLanguages |
|  | Index-field for repeatable groups | Basic | Invoice\_DM | Invoice | /Invoice/Order/OrderInformation/OrderNumber |
|  | Type Definition | Basic | Invoice\_DM | Invoice | /Invoice/Order/ProductTypeCustomSelect |
|  | Heterogeneity | Advanced | Person\_DM | Person | Settings: "subTypes" |
|  | Helper text | Basic | Invoice\_DM | Invoice | /Invoice/Order/SemIndex |
|  | Annotations | Basic | Company\_DM | Company | /Company/CompanyDetails/CompanyName |

### Features in the [Form Model](https://geta12.com/docs/sme/sme-fm-ba-docs/index.html)

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| *Feature* | | *Workspace* | *Model* | *Module* | *Further information* |
| **Model settings** | Read-only presentation | Basic | Invoice\_FM | Invoice | /Invoice/Order/TotalPrice |
|  | Different Read-only presentation on different levels | Basic | Invoice\_FM | Invoice | OverallOrder/BillingAddressControls |
|  | Suffix | Basic | Invoice\_FM | Invoice | /Invoice/Order/MaxPrice |
| **Buttons** | Hidden save button | Basic | Company\_FM | Company | Button "Save" |
|  | Disabled save button | Basic | Person\_FM | Person | Button "Save" |
|  | Navigation button | Basic | Invoice\_FM | Invoice | Footer ("Summary" on screen "Invoice", label is left empty on "OverallOrder" → screen label of "screen 1" has "Invoice" as Fallback) |
|  | Icon | Basic | Invoice\_FM | Invoice | Button "Save" |
| **Sections** | Collapsible section: default closed | Basic | Invoice\_FM | Invoice | Section "Order" → section "Validations" |
|  | Multi-column Section | Basic | Person\_FM | Person | Section "PersonalData" |
| **Grids** | Responsive Layout | Basic | Person\_FM | Person | Section "PersonalData" → grid "CG1" |
|  | Read-only presentation | Basic | Invoice\_FM | Invoice | Screen "OverallOrder" |
| **Control settings** | Hint | Basic | Invoice\_FM | Invoice | In Document Model: /Invoice/Order/SpecialOfferProduct → Description (External) |
|  | Placeholder Text | Basic | Invoice\_FM | Invoice | Section "Order" → grid "OrderControls2" → SpecialOfferProduct |
|  | Span settings for different screen sizes (lg, md, sm) | Basic | Invoice\_FM | Invoice | Section "Addresses" → section "BillingAddress" → grid "BillingAddressControls" → Company → edit control |
|  | Offset settings for different screen sizes (lg, md, sm) | Basic | Invoice\_FM | Invoice | Section "Order" → grid "OrderControls2" → TotalPrice → edit control |
| **Additional Settings** | Initial Value | Basic | Person\_FM | Person | /Person/Phone/Type |
|  | Secret | E Commerce | Order\_FM | Order | Section "Details"→Grid "DetailsGrid"→ OrderNumber |
|  | Position of Hint und Validation Messages: Default | Basic | Invoice\_FM | Invoice | Section "Order"→grid "DeliveryOptions"→PrefDeliveryOptions |
|  | Position of Hint und Validation Messages: Above Control | Basic | Invoice\_FM | Invoice | Section "Order"→grid "DeliveryOptions"→PrefDeliveryDay |
|  | Position of Hint und Validation Messages: Beside Control | Basic | Invoice\_FM | Invoice | Section "Order"→grid "DeliveryOptions"→PrefDeliveryTime |
| **Exposition** | Boolean: checkbox | Basic | Invoice\_FM | Invoice | Section addresses→grid "addressesControls→DifferentShippingAddress |
|  | Boolean: switch | Basic | Invoice\_FM | Invoice | Section "Order"→grid "delivery options"→ PrefDeliveryDay & PrefDeliveryTime |
|  | Boolean: switch-with-values | Basic | Invoice\_FM | Invoice | Section "Order"→grid "DeliveryOptions"→PrefDeliveryTime |
|  | Enumeration: compact | Basic | Invoice\_FM | Invoice | Section "Addresses" → section "ShippingAddress" → grid "ShippingAddressControls" → "FormOfAddress" |
|  | Enumeration: full | Advanced | Country\_FM | Country | Grid "CG1"→Continent |
|  | Enumeration: inline | Advanced | Country\_FM | Country | Grid "CG1"→Government |
|  | Multi-Select | Advanced | Country\_FM | Country | Grid "CG1" → "SpokenLanguages" |
|  | Area | Advanced | Country\_FM | Country | Grid "CG1"→ "Description" |
| **Other** | Date picker | Basic | Person\_FM | Person | Repeat "PersonalData" → field "DateOfBirth" |
|  | Time picker | Basic | Invoice\_FM | Invoice | Section "Order" → grid "OrderControls" → "DeliveryFrom", "DeliveryTo" |
|  | Default Action for attachments-download | E Commerce | ProductBook\_FM | ProductBook | ProductThumbnail |
|  | Default Action for attachments-replace | E Commerce | Customer\_FM | Customer | Photo |
|  | Pagination-List links | E Commerce | ProductFashion\_FM | ProductFashion | BrandDropdown |
| **Dependencies** | Hidden field | Basic | Invoice\_FM | Invoice | Triggered by field "DifferentShippingAddress" |
|  | Read-only field | Basic | Invoice\_FM | Invoice | Triggered by field "PrefDeliveryTime" |
|  | Hidden group | Basic | Invoice\_FM | Invoice | Triggered by field "MethodOfPayment" |
| **Repeats** | Inline, embedded, detached | Basic | Person\_FM | Person |  |
|  | Read-only representation | Basic | Invoice\_FM | Invoice | Screen "OverallOrder" |
|  | Column resize | Basic | Invoice\_FM | Invoice | Repeat "RepeatOrderInformation" |
|  | Initial empty row | Basic | Invoice\_FM | Invoice | Repeat "RepeatOrderInformation" |
|  | Properties for repeat entries (add, remove, reorder, copy) | Basic | Person\_FM | Person | Repeat "Membership" |
|  | Default row action | Basic | Person\_FM | Person | Repeat "Education" |
|  | Infinite scrolling | Basic | Person\_FM | Person | Repeat "Membership" |
|  | Different column widths | Basic | Invoice\_FM | Invoice | Repeat "RepeatOrderInformation" → Order Number, Quantity |
|  | Styling (alignment) of repeats | Basic | Person\_FM | Person | Repeat "Address": left + middle/ repeat "Education": center + middle |
|  | Fixed row height | Basic | Person\_FM | Person |  |
|  | Validation message as tooltip | Basic | Invoice\_FM | Invoice | Section "Order" → grid "OrderControls → repeat "OrderInformation" → "OrderNumber" |
|  | Number of empty rows | Basic | Person\_FM | Person | Repeat "Phones" |
|  | Filtering | Basic | Person\_FM | Person | Repeat "Education", "Membership" |
|  | Sorting | Basic | Person\_FM | Person | Repeat "Education", "Membership" |
| **Expressions** | Heading, Formatting, Lists, Labels, Case conditions | Advanced | City\_FM | Country | Seen as child of Country in country tree |
| **Bindings** | Dual Pane | Basic | Company\_FM | Company |  |
|  | Table | Basic | Company\_FM | Company |  |
|  | Dropdown | Basic | Company\_FM | Company |  |
|  | Additional Fields Form | Advanced | PersonEmployee\_FM | Company | TeamPersonTableList |

### Features in the [Overview Model](https://geta12.com/docs/sme/sme-om-ba-docs/index.html)

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| *Feature* | | *Workspace* | *Model* | *Module* | *Further information* |
| **General** | Search | Basic | Person\_OM | Person |  |
|  | Filter | Basic | Person\_OM | Person |  |
|  | Column resize | Basic | Person\_OM | Person |  |
|  | Amount of entries in the overview | E-Commerce | Product\_OM | Products | Part of old e-commerce Workspace |
|  | Default sorting on multiple levels | Advanced | PersonEmployee\_OM | Employee |  |
|  | Expressions | Advanced | City\_OM | City |  |
| **Table settings** | Infinite Scrolling | E-Commerce | Product\_OM | Products | Part of old e-commerce Workspace |
|  | Multi-selection | E-Commerce | ProductCatalogue | Products | Part of old e-commerce Workspace |
|  | Fixed Width | Basic | Person\_OM | Person |  |
|  | Alignment | Basic | Person\_OM | Person |  |
| **Column settings** | Sortability of columns | Basic | Person\_OM | Person | Columns: FirstName, LastName |
|  | Different column width | E-Commerce | Product\_OM | Products | Part of old e-commerce Workspace |
|  | Pin direction | E-Commerce | Product\_OM | Products | /ProductDetails/ProductThumbnailImages/ProductThumbnail (Part of old e-commerce Workspace) |
|  | Suffixes of amounts in overview | Basic | Invoice\_OM | Invoice |  |
|  | Row summary sum | Basic | Invoice\_OM | Invoice | Columns: TotalPriceWithDiscount |
| **Custom Actions** | Row Actions | Basic | Company\_OM | Company |  |
|  | Subheader/ footer buttons | Basic | Company\_OM | Company |  |
|  | Bulk Delete | Basic | Invoice\_OM | Invoice | Action for Multi-Select |
| **Filtering** | Menu: Groups | Basic | Person\_OM | Person |  |
|  | Mode: All Fields from DM | Basic | Person\_OM | Person |  |
|  | Mode: Custom Selection of fields | Basic | Company\_OM | Company |  |
|  | Mode: All Columns from Overview Model | Basic | Invoice\_OM | Invoice |  |

### Features in the [Relationship Model](https://geta12.com/docs/overall/relationships_for_bas/index.html)

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| *Feature* | | *Workspace* | *Model* | *Module* | *Further information* |
|  | Linked Document Model | Advanced | TeamPerson | Team |  |
|  | Unbounded (to n) relationship | Advanced | TeamPerson | Team |  |
|  | Bounded (to 1) relationship | Advanced | CityPerson | City |  |
|  | User determined order | Advanced | CountryCity | Country | Role: City → orderable |

### Features in the [Tree Model](https://geta12.com/docs/sme/sme-tm-ba-docs/index.html)

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| *Feature* | | *Workspace* | *Model* | *Module* | *Further information* |
| **General** | Multi-selection/ bulk operations | Advanced | Country\_TM | Country (Tree Engine) |  |
|  | Copy, paste and delete | Advanced | Country\_TM | Country (Tree Engine) |  |
|  | Drag and drop: expand on hover | Advanced | Country\_TM | Country (Tree Engine) |  |
|  | Drag and drop: do not expand on hover | Advanced | Team\_TM | Teams (Tree Engine) |  |
|  | Initial expansion | Advanced | Country\_TM | Country (Tree Engine) |  |
|  | Expand/collapse the whole tree | E-Commerce | ProductCatalogue | ProductCatalog | (Part of old e-commerce Workspace) |
|  | Virtual scrolling | E-Commerce | ProductCatalogue | ProductCatalog | (Part of old e-commerce Workspace) |
|  | Virtual root node | Advanced | Country\_TM | Country (Tree Engine) |  |
|  | Column resize | Advanced | Team\_TM | Teams (Tree Engine) |  |
|  | Fixed Width | Advanced | Team\_TM | Teams (Tree Engine) |  |
|  | Pin direction | Advanced | Team\_TM | Teams (Tree Engine) |  |
| **Column settings** | Different column width | Advanced | Country\_TM | Country (Tree Engine) |  |
|  | Alignment | Advanced | Country\_TM | Country (Tree Engine) | Horizontal: left, Vertical: middle |
|  | Comma-separated list | Advanced | Country\_TM | Country (Tree Engine) |  |
| **Custom Actions** | Row Actions | Advanced | Team\_TM | Teams (Tree Engine) | Node type: Team\_DM |
|  | Context Menu | Advanced | Team\_TM | Teams (Tree Engine) | Node type: Team\_DM |
|  | Subheader/ footer buttons | Advanced | Team\_TM | Teams (Tree Engine) |  |
| **Events** | Delete node | Advanced | Team\_TM | Teams (Tree Engine) | Node type: Team\_DM → Context Menu |
|  | Add link | Advanced | Team\_TM | Teams (Tree Engine) | Node type: Team\_DM → Actions |
|  | Delete link | Advanced | Team\_TM | Teams (Tree Engine) | Node type: Team\_DM → Context Menu |
|  | Expand subtree | Advanced | Team\_TM | Teams (Tree Engine) | Node type: Team\_DM → Context Menu |
|  | Collapse subtree | Advanced | Team\_TM | Teams (Tree Engine) | Node type: Team\_DM → Context Menu |
|  | Copy node | Advanced | Country\_TM | Country (Tree Engine) | Node type: Country\_DM → Context Menu |
|  | Copy node and children | Advanced | Country\_TM | Country (Tree Engine) | Node type: Country\_DM → Context Menu |
|  | Cut node | Advanced | Country\_TM | Country (Tree Engine) | Node type: Country\_DM → Context Menu |
|  | Paste node | Advanced | Country\_TM | Country (Tree Engine) | Node type: Country\_DM → Context Menu |
| **Inserts** | As child | Advanced | Country\_TM | Country (Tree Engine) | Node type: Country\_DM → Context Menu |

### Features in the [Print Model](https://geta12.com/docs/print_engine/print-modeling-documentation/index.html)

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| *Feature* | | *Workspace* | *Model* | *Module* | *Further information* |
| **General** | Segments | Advanced | City\_PM |  |  |
|  | Sections | Advanced | City\_PM |  |  |
|  | Watermarks | Advanced | City\_PM |  |  |
|  | Custom Fonts | Advanced | City\_PM |  | Set in the Print Settings Model |
|  | Hide Conditions | Advanced | City\_PM |  | CityInformation Segment |
| **Print Model Elements** | Text with static data | Advanced | City\_PM |  |  |
|  | Text with dynamic data | Advanced | City\_PM |  |  |
|  | Image | Advanced | City\_PM |  |  |
|  | Line | Advanced | City\_PM |  |  |
|  | Table | Advanced | City\_PM |  |  |
|  | Switch | Advanced | City\_PM |  |  |
|  | Pie Chart | Advanced | City\_PM |  |  |
|  | Expression | Advanced | City\_PM |  |  |
|  | Area | Advanced | City\_PM |  |  |
|  | Nested Area | Advanced | City\_PM |  |  |
|  | Bounding Box | Advanced | City\_PM |  |  |

### Features in the [Print Settings Model](https://geta12.com/docs/print_engine/print-modeling-documentation/index.html#PrintSetting)

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| *Feature* | | *Workspace* | *Model* | *Module* | *Further information* |
| **General** | Segments | Advanced | City\_PM |  | Arial and Montseerrat |

## Migration Rules

The main goal of Preview App is to preview how all models of a workspace work in combination. In contrast, it is not
suited as basis for development of real applications. Thus, the Preview App and its workspaces are not guaranteed
to be compatible with any other version of A12 including different -ext versions of the same release line.

Workspace Data and Models from previous versions can be carried over to a new release line.
The following describes how to achieve this:

* Create a new workspace using the Preview App Control or select a workspace that comes with the new A12 release.
* Copy the models to the workspace in the models folder.
* Copy Workspace Data to the workspace in the respective data folder.
* Migrate the models and documents by opening them in SME.
* Start the Preview App with the workspace.

As the Preview App is a full stack A12 application with a dedicated purpose, changes to it are implemented within our releases. In some cases, a change to the Preview App may break the user experience behaviour. However, no migration tool can handle these changes if the Preview App specific logic has been changed.

## Troubleshooting

If you encounter any issues with the Preview App or Preview App Control, please check the following known issues:

### Missing Locale `` en-US.UTF8` ``

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'dsDataSource' defined in class path resource [com/mgmtp/a12/dataservices/autoconfigure/DSEmbeddedPostgresDatasourceConfiguration.class]: Failed to instantiate [javax.sql.DataSource]: Factory method 'dsDataSource' threw exception with message: Process [/tmp/embedded-pg/PG-eeb889eb8aa39ea3cb783f5a8b3fbe01/bin/initdb, -A, trust, -U, postgres, -D, ../postgres/ds-embedded-postgres, -E, UTF-8, --lc-ctype=en_US.UTF-8] failed ``` |
```

[Data Services Troubleshooting](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#trouble_shooting)

## Glossary

| Term | Description |
| --- | --- |
| **1:n relationship** | A 1:n relationship is a relationship in which one role has the upper limit of 1 as multiplicity, while the other role has a multiplicity >1 or an unbounded multiplicity. |
| **Abstract** | An abstract Document Model cannot be instantiated and so the user cannot create new instances of this Document Model. This is controlled using annotations which can be set in the model settings of the supertype Document Model. This annotation can take the value true or false. When creating a new document in a heterogeneous context, such an abstract supertype (abstract = true) will not be offered in the variant dialogue. When no annotation is added the default behavior is that the supertype will be offered (abstract = false). |
| **Annotations** | An annotation is a name-value pair that can be added to the model in the model settings and all model elements. The application that uses the Document Model can access those annotations and can use them within custom implementation, e.g. to show all fields that have an annotation in bold face. In the model settings, at least one annotation is set which contains the roles for this model. The relevant annotations for heterogeneity are subTypes and abstract. |
| **BAP** | Business Application Platform. |
| **Binding** | Used to integrate relationships into the Form Engine. The Binding allows configuring a UI for linking documents to a single "main" document to be modeled. |
| **Calculation** | This describes the value that will be written in the Computed Field. |
| **Candidate** | Refers to the set of instances to which a link could be created. As of now, it is "all" the instances of the target role’s Document Model to which no link exists yet. Synonym to "Available Items". |
| **Child** | The term Child is used to describe nodes or documents relative to each other. The Child is the role in a relationship or document in the tree that is one level further from to the starting point of the tree, the root. |
| **Common Precondition** | A common precondition is a condition of the validation language which determines whether the computation is carried out at all. |
| **Computation Table** | Computation tables specify the computed value and consist of three columns: Common Precondition, Precondition and Calculation. |
| **Computed Field** | This is the Field where the result of a Computation Rule will be written. |
| **Control** | Controls are references to fields of the Document Model. For example, they can be defined in the form of text input fields or drop-down lists. |
| **Control Grid** | A Control Grid is the container for Controls and different types of Cells. A Control is never placed directly on a Screen - it always has to be placed inside a Control Grid to define its position, e.g. in a multi-column grid. A Control Grid is organized by columns and rows. A Control is always positioned in one cell, defined by column and row, thus all Controls have their exact positions within a grid and their alignment is controlled automatically. |
| **Data Modeler** | The retired tool previously used to create and edit Document Models in A12. |
| **Document Model** | In the Document Model you define which data should be collected. Validation and Computation Rules are also part of the Document Model. |
| **Drop Down Selection** | A relationship UI component, the best suitable if the target role has a multiplicity with an upper limit of 1. |
| **Dual Pane Selection** | A relationship UI component, the best suitable if the target role has multiplicity with an upper limit ≥ 2 or unbounded. |
| **Duplicable** | When Duplicable is selected, multiple links of the same type between the same two documents are allowed. |
| **Easy Mode** | One available view in the Preview App Control. A simple view allowing the user to start up the Preview App server and Preview App client and launch the Preview App with one click. |
| **Error Field** | The Error Field of a rule is the field on which the error is usually displayed on the A12 web interface. |
| **Error Level** | The Error Level defines how the occurrence of a rule is classified and should be interpreted. |
| **Error Message** | The Error Message or Error Text is the output in the event of an Error. |
| **Expert Mode** | One available view in the Preview App Control. A more complex view allowing the user to make certain selections and start/stop the Preview App server and Preview App client separately. |
| **Field Editor** | The Field Editor opens on the right-hand side in the Document Model Editor when a new field is initialized or an existing field gets selected. In the Field Editor, you can inspect and edit the field properties. |
| **Form Model** | A form displays details or properties of an entity document. Form Models are created in the Simple Model Editor with the Form Model Editor. |
| **Form Model Editor** | The tool that is used to create and edit Form Models in A12. This tool was introduced from the 2023.02 release onwards. |
| **Full Validation** | All Validation Rules are evaluated with the List of Relevant Fields including all Fields in the Document Model. |
| **Generated Document Model** | Relationship-specific Document Models that need to be generated using the Relationship Model Editor. They are used in the Overview Models for relationship UI components for the Selected Items Overview. |
| **Heterogeneity** | This is the principle that allows data of different types to be used in a unified way. This allows, for example, data of different types to be shown in the same list. In A12, this means that it is possible to model overviews that contain lists of heterogeneous data. |
| **Heterogeneous Overview** | This is the type of overview used to display different types to be shown in the same list. When the user chooses to add a new item to a heterogeneous overview, they must select which type of item they wish to add and should then be presented with the appropriate form to complete. For all fields that we intend to display in a heterogeneous overview, it is necessary that the path to those fields in the Document Models is identical. |
| **Hierarchical Column** | The Hierarchical Column is a special column in the tree. The tree structure is then shown in the Hierarchical Column by indenting the data in this column depending on the node type that it belongs to. It has an arrow button to expand/collapse the children of the node. |
| **Index Field** | For every Group, one Field can be specified as the Index Field. The Index Field is a required Field and must have a unique value. |
| **Iteration** | Iteration is the process of evaluating all the repeatably referenced Fields one-by-one. |
| **Language Construct** | Language Constructs evaluate their arguments (fields, field lists, groups, group lists, values, and value lists) according to a clearly defined set of rules. The arguments that a Language Construct accepts are defined in the Kernel Language documentation for each Language Construct. |
| **Link** | An instance of a Relationship Model; specifies the connection between an instance of one role of the relationship and an instance of the other role of the relationship. |
| **Link Constraints** | Properties of a relationship role; currently limited to multiplicity. |
| **Link Order** | The order in which links are displayed in the tree engine or relationship UI elements. |
| **List of Relevant Fields** | This is the List of Fields that are used by the Kernel when evaluating a Validation Rule. The Fields that are included in this list depend on the type of Validation and the specific interaction that the end user makes with the Form. |
| **Master Detail Model** | In the Master Detail Model you connect your Overview/Tree Model and respective Form Model(s). This Model is currently only used to test your models in the Preview App within your Modeling Environment and can be used as Model Reference in the PreviewApp\_AM. |
| **Master Detail View** | A description of one possible layout pattern in an A12 Application where you would have an overview or list of entity documents and clicking on one of these list items launches a form on part of the screen to show details of the selected item. |
| **Multiplicity** | Specifies the maximum number of instances of this role that can be linked to one instance of the other role; can be a number (upper limit) or unbounded. |
| **Nodes and Node Types** | Nodes types in A12 trees are always assumed by Document Models. The connection between node types in the tree is taken from Relationship Models, in which the respective Document Models filled roles. For a tree, the two roles in a relationship need to be divided into parent and child roles. The node is then the document in the tree that is linked to either parent nodes, child nodes or both. |
| **n:n relationship** | An n:n relationship is a relationship in which both roles have a multiplicity >1 or an unbounded multiplicity. |
| **Orderable** | When Orderable is selected, links that are displayed in a tree engine can be reordered manually in the UI. The links are shown in the same order in other relationship UI components. |
| **Overview Model** | An overview is a table or list of entity documents. Overview Models are created in the Simple Model Editor with the Overview Model Editor. |
| **Parallel Iteration** | Parallel Iteration allows Validation and Computation Rules to be evaluated based on the Values in the Index Fields of the Groups referenced in the Rules. |
| **Parent** | The term Parent is used to describe nodes or documents relative to each other. The Parent is the role in a relationship or document in the tree that is one level closer to the starting point of the tree, the root. |
| **Partial Validation** | Validation Rules that reference Fields in the List of Relevant Fields are evaluated using the List of Relevant Fields generated by the user interaction that triggered the Partial Validation. |
| **Path** | The path shows the data structure and provides part of the identity. |
| **Precondition** | A Precondition defines a case stating under which circumstances a computation is carried out. |
| **Preview App Control (PAC)** | With the Preview App Control you can start a local Preview App to test your models in an full stack A12 application. New workspaces are created with the Preview App Control and it offers a function for the deletion of the local database content for a respective workspace. |
| **PreviewApp\_AM** | The PreviewApp\_AM is initialized automatically when a new workspace is created. Do not make any changes to this model or delete it - that may render your workspace useless. The only change you can make to that model is to reference your Master Detail Models in there. This model was previously called "installer-appmodel". |
| **Regular Expression** | Used in the Document Model Editor to set constraints on string fields defined as Pattern. |
| **Relationship Model** | Determines which Document Models are linked, along with some other parameters. |
| **Relationship UI Component** | UI element in which relationship links can be edited and/or displayed: Drop Down Selection, Dual Pane Selection and Table List |
| **Role** | In the sense of the Relationship Model: The role is used to identify the part that a document plays in the link to another document. |
| **Root** | This is the starting point of the hierarchical structure in the tree. The root is therefore a node that does not have a parent. |
| **Rule Condition** | The Rule Condition defines when the Validation Rule should fire and the Error Message be shown. |
| **Self-Referencing Relationship** | Both roles are taken up by the same Document Model, thus making it possible to create links between instances of one Document Model. |
| **Sibling** | Children of the same parent are called siblings. |
| **Subtype** | A *Subtype* is one of the different data types which are grouped by the *Supertype*. In A12, it is an additional Document Model which is linked to a *Supertype* by an *Annotation*. The data from *Subtype* models can then be used as part of a heterogeneous overview. When creating a new document in a heterogeneous context a choice of all the *Subtypes* (and possibly the *Supertype*) will be offered. The *Subtype* Document Models contain some or all of the fields that can be found in the *Supertype* Document Model. Please ensure that the path to those fields in the Document Model is identical. Other fields may exist in the *Subtype* Document Models but these will not be displayed in the heterogeneous overview. |
| **Supertype** | The *Supertype* is used to group types of data and use it in a unified way. In A12 the *Supertype* is a Document Model (or sometimes a set of models) and the *Annotation* "subTypes" is used to show which Document Models should be grouped under the *Supertype*. The *Supertype* can then, for example, be referenced in an Overview Model so that the heterogeneous list of data can be viewed. If a *Supertype* is marked as *abstract* it will not be instantiated and as a result will not be offered when creating a new document in a heterogeneous context. |
| **Table List** | A relationship UI element in which links are displayed; read-only. |
| **Target Role** | A setting for the relationship UI elements maintained in the Binding Editor that determines which role of the links is shown and edited. |
| **Tree Model** | The Tree Model is an A12 UI model which focuses on showing lists of data in a hierarchical structure based on relationships between the entities. |
| **Unbounded** | The multiplicity of a role is unbounded if the maximum number of instances of this role that can be linked to one instance of the other role is unlimited. |
| **Upper Limit** | Specifies the maximum number of instances of this role that can be linked to one instance of the other role. |
| **Variant** | A variant is a *Supertype* or *Subtype* which is offered to the user when creating documents in a heterogeneous overview. For example, if a *Supertype* (*abstract* = *false*) has two *Subtypes*, then three variants will be offered. |
| **Workspace** | A new Workspace is created in the Preview App Control and a set of Sample Workspaces is available for each A12 release. Workspaces are displayed in the Simple Model Editor within the Workspace Explorer. All editable Model Types are represented as well as folders and a roles file. The Preview App will consider the whole set of files in a selected Workspace folder which is needed to run your application. |
