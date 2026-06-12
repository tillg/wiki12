---
source: https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/index.html
category: sme
docid: sme-ba-docs
scraped: 2026-06-12
---

# Simple Model Editor (SME)

The Simple Model Editor (SME) is an integrated modeling environment for A12 models.
It enables business analysts to edit A12 models without viewing their JSON sources.

This documentation is for the standalone SME that is distributed via the A12 Installer. The behavior of the SME when run in a web browser may differ in some places.

## Installation and Start

### Prerequisites (Ubuntu)

* Ubuntu 22.04: an additional package needs to be installed manually: `sudo apt install libfuse2`
* If SME gets stuck in an endless loop while loading a Workspace, try installing the following packages: `sudo apt install xdg-desktop-portal xdg-desktop-portal-gtk`

### Installer (Recommended)

The SME is included in the A12 Installer. Refer to the documentation of the [A12 Installer](https://geta12.com/docs/OVERALL/installing_a12/index.html) for further information.

Start the SME from the shortcut in the A12 installation folder.

By default, the SME is started on the port `52064`. A default port is necessary for data that is stored between working sessions with the SME (for example, Recent Workspaces, last applied theme). If the port is not available, a warning will be shown and data from previous sessions is not available.

### Standalone

|  |  |
| --- | --- |
|  | This is an alternative to the recommended way using the installer and should only be used for special cases. |

The SME can also be downloaded as a standalone tool from the artifactory. In this case and depending on the operating system, there
are additional steps required:

Java must be installed and the Java command must be available from the command line.

#### Linux

* Extract `sme-app-linux.zip` and execute `simplemodeleditor`
* Execution rights need to be granted to the SME application manually

#### macOS

* Extract `sme-app-mac.zip` and execute `Simple Model Editor`
* Execution rights need to be granted to the SME application manually **recursively**
* Instead of starting the SME by a double click: right click, select "open" and then again select "open" in the dialog that appears.

#### Windows

* Extract `sme-app-windows.zip` and execute `Simple Model Editor.exe`
* NOTE: At least Windows 10 is required

### Web Application

A docker image with the name `sme-webapp` is available in the artifactory.

* Exposed http port: `8080`
* SME Backend Logfiles: `stdout`

Run the image with published port:

```
$ docker run -p 8080:8080 <sme-webapp-image>:<tag>
```

Even though the docker image only exposes a http port, the full functionality of the SME requires a [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts).
This can be achieved by configuring a reverse proxy outside the SME docker container.

To avoid timeouts during workspace validation, we recommend configuring increased proxy timeouts, for example:

```
nginx.ingress.kubernetes.io/proxy-read-timeout: "300"
nginx.ingress.kubernetes.io/proxy-send-timeout: "300"
```

## Navigation Overview

When starting the SME, the start page is displayed. From there, a Workspace can be opened.

![startpage](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/startpage.png)

Figure 1. The Simple Model Editor Start Page

Once a Workspace is opened, the Workspace Explorer is displayed on the left side of the window. It enables navigating through the models, resources and data contained in the Workspace as well as creating new models and data.

Besides the Workspace Explorer and the Home Screen, the SME offers further navigation options in the left sidebar.

![menu items](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/menu_items.png)

Figure 2. The Simple Model Editor Navigation Sidebar

The icons represent the following features (from top to bottom):

* Home Screen: enables opening a new Workspace or selecting a Recent Workspace
* Workspace Explorer: gives access to the models and data contained in the opened Workspace
* Data Modeling Perspective: offers the possibility to create [Model Graph Diagrams](https://geta12.com/docs/sme/sme-diagram-ba-docs/index.html) for Document and Relationship Models
* Global Search: enables searching for model elements across all models in the opened Workspace (under development)
* Plugins Overview (experimental): gives access to extend the SME with plugins for model editors, refer also to [Plugins Development Documentation](https://geta12.com/docs/sme/sme-dev-docs/index.html#_creating_plugins)

Furthermore, the version of the SME is displayed in the top right corner of the window. Clicking on it opens a modal with further information about the SME version as well as the model versions used in the SME.

![versioninfo](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/versioninfo.png)

Figure 3. The Simple Model Editor Version Information

Besides the version information, the Server Connection status is indicated. Clicking on the icon opens the Configure Server Connection dialog.

## SME Tool Settings

The SME Tool Settings can be accessed via the gear icon in the top right corner of the window, next to the Server Connection status.
The settings dialog allows configuring general application behavior as well as enabling recently added experimental features.

![SME ToolSettings](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/SME_ToolSettings.png)

Figure 4. The Simple Model Editor Tool Settings

### General Settings

* **Theme**: Select the visual theme for the Simple Model Editor.

### Enabling Experimental Module Types

Some model types in the Simple Model Editor are experimental and most recently added ones are disabled by default.
When a workspace contains models of an type that is not enabled, the models will not be recognized.
This may result in validation errors such as "Invalid reference" in models that reference these model types.

To enable the Modeling Module for an experimental model type:

1. Click on the gear icon in the top right corner to open **Settings**.
2. Locate the **Modeling** section.
3. Enable the desired Modeling Module.
4. Save the settings with the *Apply Settings* button and restart the Simple Model Editor for the change to take effect.

The following model types are recently added and their Modeling Modules are **disabled by default**:

* Combination Models
* Mapping Models
* Transformer Models
* Query Models

|  |  |
| --- | --- |
|  | After enabling or disabling Modeling Modules, save the settings and restart the Simple Model Editor. The tool suggests a restart in a modal after you save the settings, but you can cancel it. |

### Enabling Within-Model Refactoring

Within-model refactoring for each model type can be enabled or disabled in the Tool Settings.

To configure refactoring settings:

1. Click on the gear icon in the top right corner to open **Settings**.
2. Locate the **Experimental Features** section.
3. Toggle the refactoring setting for each model type.
4. Save the settings with the *Apply Settings* button.

The following options are available for enabling within-model refactoring:

* **Enable Document Model Refactoring**
* **Enable App Model Refactoring**
* **Enable Form Model Refactoring**
* **Enable Overview Model Refactoring**
* **Enable Tree Model Refactoring**

|  |  |
| --- | --- |
|  | Disabling within-model refactoring means you must manually update internal references when modifying model elements. This may lead to validation errors if references become invalid. |

## Open a Workspace

In the context of the Simple Model Editor, a Workspace is a folder in the file system that contains models, data and resources for A12 application development, or is designated to contain them. The SME defines a specific Workspace structure; see [Layout Enforcement](#_layout_enforcement).

After clicking on "*Open Workspace*", a Workspace folder in the file system can be selected. All folders and sub-folders containing models as well as [Workspace Data](https://geta12.com/docs/SME/sme-data-ba-docs/index.html), will be shown in the Workspace Explorer.

|  |  |
| --- | --- |
|  | Always open the **root folder** of a Workspace. Do not open a subfolder (for example, only a "models" subfolder) as if it were a Workspace. Opening a partial Workspace can lead to the following problems:  * Models outside the opened subfolder may reference elements inside it, and those references cannot be resolved. * The SME automatically creates certain files (such as `settings.yaml`) when they are not found in the Workspace. If you open only a subfolder, these files are created inside that subfolder. When you later open the full root Workspace, the duplicated files cause a "Workspace Items with Duplicate Names" error that blocks the Workspace. * Selection fields (for example, the roles selection in a Document Model) may appear empty because the relevant configuration files are located outside the opened subfolder.  If you encounter a "Workspace Items with Duplicate Names" error after having previously opened a partial Workspace, delete the automatically created files (such as `settings.yaml`) from the subfolder and then open the full root Workspace. |

### Recent Workspaces

Next to the option of selecting a Workspace from the file system, the start page of the SME offers up to five recent Workspaces for selection. Be aware of the following limitations to that feature:

* Due to the browser technologies used, we cannot obtain the complete path of the folder that is uploaded. This means that if you upload several folders with the same name, the entry is always overwritten.
* In the Electron application, we now always start the SME on the same port. If another application occupies the port, the Recent Workspaces are not available.
* If new versions of the SME are installed, the Recent Workspaces and the last set theme are retained. However, in the event that we have to change something internally, we have to delete old entries. In other words, we cannot guarantee that this data will be retained for every version.

## File System Access

The SME has file system access, that is, saving a model in its Model Editor in the SME will also persist the model in the file system in its original location. However, changes made to models, their location or the folder structure while a Workspace is open are not refreshed automatically in the SME. To get the changes into the SME, the reload button in the top right corner of the Workspace Explorer has to be clicked.

## Workspace Explorer

After opening a Workspace, the Workspace Explorer is displayed. It gives access to adding new models/files/folders or editing loaded models via their respective Model Editors.

Moreover, it enables creating and editing Documents and Links that constitute the Workspace Data of the Workspace for the Preview Application.

![workspace explorer](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/workspace_explorer.png)

Figure 5. The Workspace Explorer

Models and folders can be rearranged via drag and drop. The Workspace Explorer can be resized by dragging its right edge.

### Subheader Actions

The display of the Workspace Explorer can be toggled via the arrow icon in the left sidebar, closed via the X icon in the top right corner or maximized to span the entire window size by the maximize icon next to the X icon.

A new Workspace can be opened via the folder icon in the top right corner of the Workspace Explorer and the current Workspace can be reloaded via the reload button with the refresh icon.

![subheader top right](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/subheader_top_right.png)

Figure 6. Buttons to Reload the Current Workspace, Open a New Workspace, Expand the Workspace Explorer, Close the Workspace Explorer

Actions to expand or collapse all folders of the Workspace can be accessed via the menu icon.

![burger](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/burger.png)

Figure 7. Expand or Collapse All Folders of the Workspace

Via the *Add* button, new models or folders can be added. For more information on creating new models, refer to their respective modeling documentation that can also be found on getA12.

![add](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/add.png)

Figure 8. Add a New Model or Folder

The button *Validate* will trigger a validation of the Workspace.

The button *Deploy* is only active if a server connection is established. Refer to chapter [Workspace Deployment](#model_deployment) for more information.

The button *Diff* enables comparing two versions of a model. Refer to chapter [Model Diff](#model_diff) for more information.

Additionally, you can filter and search the content of the Workspace Explorer.

### Context Menu

A context menu is available for each editable model in the Workspace Explorer via the three-dots-icon or right click. It contains actions to delete a model - also from the hard drive - and copy a model. When copying a model, its destination in the Workspace can be changed and a new name has to be assigned.

A folder element can be renamed or deleted via the context menu. Furthermore, a new model can be created with the respective folder pre-selected.

### Modeling and Runtime Models

A12 Document Modeling provides features to store and manage business logic in one place and reference it in other models; for example Type Definitions, Includes and Combinations.
While modeling, the SME resolves and expands the respective references so that the modeler has a seamless modeling experience.
However, when using the models outside the A12 platform, they need to be exported as "Runtime Models".
In this export, all references are resolved, the model is fully expanded and contains a copy of all business logic.
This export is not dynamic anymore.
It can be used as it is and does not need any other models.

The exported model can be used in the Q12-Test Data Suite to systematically quality assure the modeled business logic.

The export function is available in the context menu of Document Models, Composed Document Models and Combination Models.

### Layout Enforcement

For [Workspace Data](https://geta12.com/docs/SME/sme-data-ba-docs/index.html) and for Resource Management, the Workspace Explorer enforces some layout rules that restrict the way in which new files and folders can be created, as well as how elements can be moved and renamed.

![workspacelayout](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/workspacelayout.png)

Figure 9. Workspace Layout

For each Workspace, the Workspace Explorer displays a `data` and a `resources` folder, even if the folders do not exist in the file system.
The folders are created on-demand automatically, and the Workspace Explorer prohibits creating folders with the names `data` or `resources` via the `Add` dialog as well as marks folders with this name at a different position in the Workspace as invalid. A Workspace that does not follow the layout rules is critically invalid and cannot be edited.

The `data` folder contains the Workspace Data of a Workspace, which includes Documents, Links, and Attachments. The `resources` folder contains resource files that may be used by the models of the Workspace. The difference between attachment and resource files is that attachment files are referenced from data, that is, Documents while resources files are directly referenced from models. Within the `resources` folder, there is a dedicated folder `themes` reserved that may contain theme files for the A12 applications. The SME is able to recognize theme files in this folder and offers them as selectable themes in the Model Editor Previews of Form and Content Models. The `themes` folder offers an import function via the context menu to import theme files.

The Workspace Data of a Workspace must be contained in the data folder. Documents, Links and Attachments contained in other folders of the Workspace are not considered as part of the Workspace Data. Consequently, the `Add` dialog of the Workspace Explorer does not allow selecting folders that contradict this rule when creating new Documents and Links.
On the other hand, the Layout Enforcement prohibits models and other, unwanted files and folders to be contained in the `data` folder.

The Workspace Explorer always displays three subfolders of the `data` folder, even if these do not exist in the file system. The folders are created on-demand if they are needed.

* The folder `documents` contains the Documents of the Workspace Data. It offers an import function to import JSON files as Documents.
* The folder `links` contains the Links of the Workspace Data.
* The folder `attachments` contains the files that are meant to be used as Attachments within the Workspace Data Documents.

Each of the three subfolders can have subfolders to organize the contained elements. The elements can be moved via drag&drop among these subfolders, but must never be dropped outside of the folder.

The SME automatically creates subfolders for Documents and Links based on the referenced Document and Relationship Model.

## Model and Data Editors

The Model Editors of the various model types can be accessed either by creating a new model using the *Add* button in the Workspace Explorer subheader or by clicking on the name of an existing model. Similarly, the SME supports adding and editing Workspace Data of an A12 application. The following domain entities (meaning models and data) are supported for editing in the SME:

* [Document Model](https://geta12.com/docs/SME/sme-dm-ba-docs/index.html)
* [Combined Document Model](https://geta12.com/docs/SME/sme-cmm-ba-docs/index.html)
* [Type Definition Model](https://geta12.com/docs/SME/sme-dm-ba-docs/index.html#_type_definition_model)
* [Relationship Model](https://geta12.com/docs/OVERALL/relationships_for_bas/index.html)
* [Model Graph Diagram](https://geta12.com/docs/sme/sme-diagram-ba-docs/index.html)
* [Mapping Model](https://geta12.com/docs/SME/sme-mm-ba-docs/index.html)
* [Query Model](https://geta12.com/docs/SME/sme-qm-ba-docs/index.html)
* [Form Model](https://geta12.com/docs/SME/sme-fm-ba-docs/index.html) & [Binding/Relationship UI](https://geta12.com/docs/SME/sme-binding-ba-docs/index.html)
* [Content Model](https://geta12.com/docs/content_engine/contentengine-user-docs/index.html)
* [Overview Model](https://geta12.com/docs/SME/sme-om-ba-docs/index.html)
* [Tree Model](https://geta12.com/docs/SME/sme-tm-ba-docs/index.html)
* [Print Model](https://geta12.com/docs/PRINT_ENGINE/print-modeling-documentation/index.html) & [Print Setting Model](https://geta12.com/docs/PRINT_ENGINE/print-modeling-documentation/index.html#PrintSetting) & [Print Typesetting Model](https://geta12.com/docs/PRINT_ENGINE/print-modeling-documentation/index.html#Typesetting)
* [Master Detail Module Model](https://geta12.com/docs/SME/sme-mdmm-ba-docs/index.html)
* [App Model](https://geta12.com/docs/SME/sme-am-ba-docs/index.html)
* Workspace Data [Documents](https://geta12.com/docs/SME/sme-data-ba-docs/index.html#_editing_documents) & [Links](https://geta12.com/docs/SME/sme-data-ba-docs/index.html#_editing_links)

Refer to the respective Model Editor’s documentation via the link for further information.

Some functionalities are shared among all model editors:

### Model Naming Conventions

For all models edited with the SME, the following naming conventions must hold and are enforced:

* Model names must be unique within each Workspace
* Model names must equal the name of the file they are contained in
* Model names must conform to the regular expression `^[_a-zA-Z][-_.a-zA-Z0-9]{0,99}$`. In other words, they:

  + must not be empty
  + must not exceed a length of 100 characters
  + must not contain spaces
  + may only contain lower- and uppercase letters, digits, hyphens, underscores, and dots.
  + must start with an underscore or a letter

Also refer to the [Model Naming Conventions](https://geta12.com/docs/overall/model_naming_conventions/index.html) from A12.

### Save and Cancel

The model can be saved via the "SAVE" button in the sidebar or footer.

It is possible to save the current state of the model without saving the changes to the currently opened model via "SAVE AS". This will create a new model. The name of the new model will have to be assigned during the "SAVE AS" process.

The Model Editor can be closed without saving via the "CANCEL" button. If unsaved changes are present, a confirmation modal will be displayed to confirm that changes shall be discarded.

### Deploy

UI Models can be directly deployed to an application if the SME is connected to a server. It is not needed to save the model before deploying it. "Deploy" will not trigger saving the model. Read more about deploying models in the SME in [Workspace Deployment](#model_deployment).

## Refactoring Support

The Simple Model Editor provides automatic refactoring capabilities that detect and update references when you modify model elements.
This prevents broken references and maintains model integrity during structural changes.

The refactoring support distinguishes between two types of operations:

* ***Cross-Model Refactoring***: Updates references in other models when a model is renamed or when elements referenced by other models change.
* ***Within-Model Refactoring***: Updates references inside a single model when you rename, move, or delete elements within that model.

### Cross-Model Refactoring

Cross-model refactoring handles references between different models.
This type of refactoring is always enabled and considered stable.

#### Renaming Models

When the name of a model is changed, other models referencing this model are adapted to reference the model by its new name.
The tool does not automatically save the adapted models, but displays a warning icon to highlight that the model has been changed and needs to be saved.
This feature is available for all models that can be edited in the SME.

#### External Reference Updates

When you modify elements in one model that are referenced by other models, the refactoring support detects these cross-model dependencies.
For example:

* Deleting a field in a Document Model that is referenced as a master field in a Form Model
* Renaming an Include that is referenced by other Document Models
* Modifying a Type Definition used by multiple Document Models

The refactoring dialog appears showing all affected models and their references, allowing you to review and apply the necessary updates.

### Within-Model Refactoring

|  |  |
| --- | --- |
|  | Within-model refactoring is an experimental feature. It can be enabled or disabled for each model type in the Tool Settings under Experimental Features; see [Enabling Within-Model Refactoring](#enabling_refactoring). |

Within-model refactoring handles references inside a single model.
When you rename, move, or delete elements that are referenced elsewhere within the same model, the tool identifies affected references and presents options for updating them.

The following model types support within-model refactoring:

* Document Model
* Form Model
* Overview Model
* Tree Model
* App Model

### Refactoring Workflow

When you save changes to a model that affect references, the refactoring support:

1. Detects structural changes such as renames, moves, or deletions.
2. Identifies all references affected by these changes.
3. Displays a refactoring dialog showing proposed updates.
4. Allows you to review each proposed change and select an action.
5. Applies confirmed changes when you proceed.

While some refactorings happen silently, most trigger a modal that summarizes the refactorings that can be applied.

![refactoring modal](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/refactoring_modal.png)

Figure 10. Refactoring Modal

The left side offers navigation between the models and their elements that are affected.
Elements are model specific but might be Fields in the case of Document Models or Screen Elements in case of Form Models.
The element is identified by a path of parent elements in their specific model.
The right side lists each refactoring.
Since different properties of an element can be affected, they are identified by a path to the property.

### Refactoring Actions

Delete Element Checkbox
:   Some changes, depending on the change and model type, give you the option to delete the whole element that is affected with a checkbox on top.
    While this checkbox is checked, the other options are hidden.

    |  |  |
    | --- | --- |
    |  | Checking the "Delete include '/People/PaymentInfo'" checkbox in [Refactoring Modal](#fig:refactoring_modal) and clicking apply will delete the Include from Person\_DM. |

    |  |  |
    | --- | --- |
    |  | You might have to uncheck it first to see the following options. |

Commit
:   Accept the new value for this property.
    A default value will always be set, that depends on the action that triggered the refactoring.
    Renaming a property will set the new value as default, deleting a property has an empty value as default.

    |  |  |
    | --- | --- |
    |  | The refactoring of the "modelAlias" from "PaymentInfo\_DM" to "Company\_DM" is committed in [Refactoring Modal](#fig:refactoring_modal). Clicking "Apply" will set this new value. |

Edit
:   Select a new value.
    Only valid values will be provided to you during editing.
    Once you edited a specific property, make sure to set the status back to "Commit".

    |  |  |
    | --- | --- |
    |  | To edit the "modelAlias" after refactoring in [Refactoring Modal](#fig:refactoring_modal) from "Company\_DM", click on "Edit". |

Ignore
:   Keep the old value and handle the refactoring manually after closing the dialog.
    Validation errors are expected if you choose this option.

    |  |  |
    | --- | --- |
    |  | In [Refactoring Modal](#fig:refactoring_modal) this will result in the "modalAlias" being set to "PaymentInfo\_DM". |

Delete
:   Delete a sub-element from its enclosing element.

    |  |  |
    | --- | --- |
    |  | The Delete button is not always offered.  An example of when the Delete button is offered is when a Screen is deleted, a Button that references this screen may be deleted from its ButtonPanel element. |

Cancel
:   Restore the previous state of the model.

    For example, if a model was renamed, this renaming will be reverted.
    Alternatively, if a property was changed, this change will be undone.

Apply
:   Apply the changes as defined in the Refactoring Dialog.

    |  |  |
    | --- | --- |
    |  | A warning will be shown if "Edit" is still selected. You should select "Commit", "Ignore" or "Delete". |

|  |  |
| --- | --- |
|  | This feature does not guarantee that every change will be fixed nor that the affected models are valid afterwards. |

### Model-Specific Refactoring

For details on supported operations, reference types, and examples for each model type, refer to the refactoring chapter in the respective model documentation:

* [Document Model Refactoring](https://geta12.com/docs/SME/sme-dm-ba-docs/index.html#dm_refactoring)
* [Form Model Refactoring](https://geta12.com/docs/SME/sme-fm-ba-docs/index.html#fm_refactoring)
* [Overview Model Refactoring](https://geta12.com/docs/SME/sme-om-ba-docs/index.html#om_refactoring)
* [Tree Model Refactoring](https://geta12.com/docs/SME/sme-tm-ba-docs/index.html#tm_refactoring)
* [App Model Refactoring](https://geta12.com/docs/SME/sme-am-ba-docs/index.html#am_refactoring)

### Best Practices

Follow these recommendations when working with refactoring:

* **Review before committing**: Always review proposed refactorings before applying them.
  Some automatic updates may not match your intended changes.
* **Use Edit for complex references**: When a reference should point to a different element than the tool suggests, use the Edit action to manually select the correct target.
* **Check validation after ignoring**: If you choose to ignore a refactoring, verify that the model passes validation.
  Ignored refactorings may result in broken references.
* **Save incrementally**: When making multiple structural changes, save after each major change.
  This makes the refactoring dialog easier to review and reduces the risk of unexpected cascading updates.
* **Keep backups**: Before performing large refactorings, consider creating a backup of your workspace.
  This allows you to restore the previous state if needed.

## Workspace Deployment

Within the A12 Modeling Environment, it is possible to deploy a Workspace with all its models, Workspace Data, Users, and Roles to the Data Services.

### Configure Server Connection

Before the deployment is enabled, the URL to a running application server must be entered. This is done by configuring the appropriate information in the Configure Server Connection:

![configure server connection](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/configure_server_connection.png)

Figure 11. Configure Server Connection

The configuration can be accessed via the 'Connector' icon. This is located in the top right-hand corner next to the version information and indicates the current connection status with a gray (inactive or not logged in) or green (logged in) marker.

To establish a Server Connection, a URL of a Data Services instance must be entered. The button next to the URL input enables testing whether the URL points to a running Data Services instance, which is reported in form of a success or error notification.

For deploying a Workspace or downloading and replacing the Workspace Data in the Modeling Environment, it is not required to be authenticated. Hence, to use these features it suffices to confirm and exit the dialog with the `Save URL` button.

The SME supports two types of authentication: Local and OpenID Connect.

For the local authentication:
Choose "Local" and enter the target server’s credentials. After pressing *Connect*, you will get feedback about whether the connection could be established,
and subsequent deploy requests should be almost instantaneous.

For the OpenID Connect authentication:
Choose "OIDC" and enter the target server’s URL as well as the OpenId Connect URL and the client.
After pressing *Connect*, a popup to login via OpenID Connect opens. After logging in, you will get feedback about whether the connection could be established,
and subsequent deploy requests should be almost instantaneous.

To change the authentication log out first by using the *Logout* button and connect as described above.

### Deploy and Download

There are two ways to deploy models to the connected server.

Once a server connection has been established, the *Deploy All* button in the Workspace Explorer subheader will become active. This deploys all models in the Workspace, along with the Workspace Data, Users, and Roles. The current state of your modeling environment will be cleared and replaced with the content of your Workspace. Therefore, if you have created data within your running application that you wish to keep, always trigger a download before deploying again. Use the menu that opens when you press the arrow button, which offers "Replace Workspace Data" as option to download data from a connected server.

The other way to deploy a model to the server is via the *Deploy* button inside each Model Editor (except for Data Model Editors, such as the Document and Relationship Model Editors). This button is especially useful for testing different UI model configurations, since saving the model first is not required before deployment using the *Deploy* button inside a Model Editor.

### Deployment Exclusions

For deploying a Workspace, it is possible to exclude certain Workspace items. This definition of *Deployment Exclusions* can be done in the *Settings* file within the Workspace Explorer, which is created by SME.

The *Settings* file allows you to specify which models, folders, or data should be excluded from deployment. To configure exclusions, open the *Settings* file and add the relevant items under the *Deployment Exclusions* section. The SME will then skip these items during the deployment process.

Excluded items will not be transferred to the connected server when deploying the Workspace. This feature is useful for omitting test models, drafts, or other items not intended for production deployment.

![deployment exclusions](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/deployment_exclusions.png)

Figure 12. Deployment Exclusions

Example configuration in the *Settings* file:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ```     exclusions:       - excluded: basic/models/Person_DM2       - excluded: basic/models/oldModel_FM ``` |
```

In this example, the models `Person_DM2` and `oldModel_FM` located in the `basic/models/` folder will be excluded from deployment and displayed with a special icon in the Workspace Explorer.

## Plugins

|  |  |
| --- | --- |
|  | The contents and functionality of third-party plugins are not verified by the SME. Installation and use of plugins is entirely at your own risk. Ensure plugins are from trusted sources and review their functionality before installation. |

|  |  |
| --- | --- |
|  | This feature is in an experimental state and currently only custom elements for the Content Model Editor can be registered. There is no dedicated marketplace to retrieve plugins yet, instead projects need to build and share them manually. |

Plugins can be installed to extend the functionality of the SME. The overview of the currently installed plugins shows which plugins have been installed and which plugins are active.

![plugins overview](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/plugins_overview.png)

Figure 13. Plugins Overview

To add a new plugin, the "Add Plugin" button prompts a file picker where the plugin archive can be selected. Uncheck the box at the beginning of each row to deactivate a plugin. The remove button at the end of each row deletes the plugin permanently from the SME. Each modification requires a reload to be effective, indicated by the "Reload SME" button, which will be revealed when necessary. It is possible to do multiple modifications before triggering a reload.

## Model Diff

|  |  |
| --- | --- |
|  | This feature is in an experimental state and only available for Document Models. It is not guaranteed that all model differences are shown correctly and the feature is not fully quality assured. |

The Model Diff feature enables you to compare different versions of a model. It can be triggered in two ways: The sub header actions of the Workspace Explorer contains a button with the label "DIFF". Alternatively, the feature can be triggered via the context menu entry "Diff to another model" for Workspace Explorer entries of supported model types. In the latter case, the model is already preselected for comparison.

![DiffTrigger](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/DiffTrigger.png)

Figure 14. How to Trigger the Model Diff Calculation

If the Model Diff feature has been triggered, a dialog appears that enables selecting the model versions which should be compared.
The Model Diff computes all changes that have occurred in a model from a certain *from* version to another *to* version.
The first row of the dialog enables selecting the "From" version. In the Model 1 autocomplete, a model must be selected from the available models in the Workspace. Only models of model types supporting the Model Diff feature are available.

Similarly, the second row enables selecting the "To" version. In the Model 2 autocomplete, the same or another model must be selected from the available models in the Workspace. Only models of the same model type as the selected Model 1 are available.
Note that in general, it is possible to select any model of the same type and the same model version for comparison. This also includes selecting models for comparison that have nothing in common. However, selecting different models of the Workspace Explorer for comparison is intended for projects, in which model versions are contained as different models in the same Workspace.

![DiffDialog](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/DiffDialog.png)

Figure 15. Selecting Model Versions to Compare

Alternatively, model versions can be selected from a Git history. This is especially intended for comparing Git versions of a single model in the Workspace Explorer. Hence, we recommend to select the same model in Model 1 and Model 2.
As a shortcut, the "Same model" checkbox can be checked.
Selecting a model for Model 1 or Model 2 enables the corresponding "Version" autocomplete. In this autocomplete, you first have to indicate the root folder of the project. This is due to the fact that the root folder of the project contains the versioning information of Git.
Afterwards, all versions of the selected model file are collected from the Git history and, once loaded, are available as autocomplete options. Additionally, the "working copy" — which is always the first entry of the version list in the Version autocomplete — can be selected. It describes the current state of the model, which is not necessarily identical to the latest version of the Git history. It may contain additional local changes.

The "DIFF" button in the bottom right corner of the dialog starts the comparison of the selected model versions.

![DiffExample](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/DiffExample.png)

Figure 16. Example for Delta View (Depicted Left) and Diff Editor (Depicted Right)

Once computed, the difference is displayed in the *Delta View* which contains a tree representation of all changes that have been calculated. The Delta View can be closed via the "X" button in the top right corner. Each row in the tree represents a changed model element. Model elements that can be identified via icons contain the icon (with tooltip) as identifier. Other model elements are identified via their labels.

If a model element is not contained in Model 1 but Model 2, the delta view depicts that it is *added* by a green highlighting.

If a model element is contained in Model 1 but not Model 2, the delta view depicts that it is *removed* by a red highlighting and a strikethrough label.

If a model element is contained both in Model 1 and in Model 2 and it has not been modified, it is not depicted in the delta view. Else, if it has been modified, the delta view depicts that it is *modified*. If the modified model element is composed of other model elements, the changes in these are depicted as a contained sub tree in the delta view. If the model element is not composed of other model elements, the old and new value are depicted next to each other in the Delta View. The old value is highlighted in the same way as a removed model element and the new value is highlighted in the same way as an added model element.

All Delta View entries for model elements that are directly added, removed, or modified can be clicked. This opens a form-based Diff Editor containing an additional, more detailed, representation of the change. This representation is based on the original form-based model editors but enriched with a highlighting for changed model elements.

## Keyboard Shortcuts

For the editors and modal dialogs (for example, create new model) the following keyboard shortcuts are available:

Editors:

| Action | Windows + Linux | macOS |
| --- | --- | --- |
| save | Ctrl + S | Cmd + S |
| save as | Ctrl + Shift + S | Cmd + Shift + S |
| cancel | Alt + W | Ctrl + W |
| navigate to tab 1 …​ <n> | Alt + <n> | Cmd + Ctrl + <n> |
| navigate to screen 1 …​ <n> | Alt + <n> | Ctrl + <n> |

Modal Dialogs:

| Action | Windows + Linux | macOS |
| --- | --- | --- |
| cancel | Escape | Escape |
| confirm | Enter or Ctrl + Enter | Enter or Cmd + Enter |

The SME desktop application supports zooming in and out in steps between 30% and 500% with Ctrl + mouse wheel.

## Model Version Issues and Migration

A12 follows the guidelines of Semantic Versioning, that is, all model versions have a specific schema. `8.1.0` is a valid example where `8` represents the *major*, `1` the *minor* and `0` the *patch version* number. Furthermore, versions may be marked as unstable, for example, `8.1.0-alpha.1`.

In case of models with version issues, that is, the actual model version does not match the model version supported by the SME,
the Workspace will be disabled and you will not be able to open any of the models. Your Workspace will expand only those paths that have models
with version issues, and a bar above the *Model Explorer* will provide you a list of models with version issues.

![ModelVersionIssuesBar](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/ModelVersionIssuesBar.png)

Figure 17. Model Version Issues Bar

The model version issues can be resolved by clicking *Resolve all Issues* below the issue list. This will update your models with version issues to the supported model versions of the SME.
Internally, the SME integrates the same model migration tools as the former A12 Model Updater.

![ResolveAllIssuesBar](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/ResolveAllIssuesBar.png)

Figure 18. Resolve All Version Issues

|  |  |
| --- | --- |
|  | In case the model version is newer than the version supported by the SME, you have to use a newer SME version. |

The supported model versions of the SME can be found, when clicking the SME Version in the top right corner.

## Modeling Support for Role-Based Access Control

Within SME the modeling of Role Based Access Control is supported. The SME will recognize and display the existence of a *Roles File* and a *Users File* within the opened Workspace. Hence, it is important that such files are located in the folder that is selected as Workspace if the modeling support is expected.

![Workspace withARyaml](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/Workspace_withARyaml.png)

Figure 19. Workspace With *Roles File*

As soon as a *Roles File* is available within the opened Workspace, the SME will support the modeler with a new role assignment for all A12 model types. Available roles from the file are selectable within the model settings / at creation time. Additional roles can be specified and added as well.

![Roles optionsBasedonARyaml](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/Roles_optionsBasedonARyaml.png)

Figure 20. Role Assignment for a Model

With that feature came another important change which is that as soon as the SME is not able to support the role assignment within the models, the role is not mandatory anymore and can be empty if no *Roles File* is available. On the other hand, if a *Roles File* is recognized by the SME, but there is no role assignment in the model, the following error will be shown and the model is displayed as invalid.

![Error noRole](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/Error_noRole.png)

Figure 21. Error for 'The Workspace Contains a Roles File Which Requires All Models to Have Roles Specified.'

If the situation is the other way around, meaning the model(s) contain roles but no *Roles File* is known to the SME, the following warning will be shown:

![Warning noARyaml](https://geta12.com/docs/2025.06/ext5/sme/sme-ba-docs/assets/Warning_noARyaml.png)

Figure 22. Warning for 'The Workspace Should Have a Roles File if Roles are Specified in the Model.'

In this case, the modeler is free to add any role as a string still.

Note that the SME will block the Workspace if multiple *Roles File* are present.

## Modeling Using Document Metadata

Document metadata is a set of meta information about documents that the dataservices component tracks when handling document creation and updates. Currently, this set consists of the following data:

|  |  |
| --- | --- |
| docRef | document reference - identifier of a specific document |
| modelRef | Document Model reference |
| modelVersion | the version of the referenced Document Model (currently not managed by dataservices) |
| creator | user that created the document |
| createdAt | timestamp of creation |
| modifier | user that last modified the document |
| modifiedAt | timestamp of last modification |

|  |  |
| --- | --- |
|  | Since the dataservices component updates these metadata fields automatically, they should be treated like computed fields. That is, they should only be used in readonly fashion. Any changes to these field’s values will not be saved. |

When working with UI models like Form, Overview or Tree Models, this metadata can also be referred to.

The SME automatically extends all Document Models with this set of metadata fields when using a UI model editor.
These fields can then be found in the top-level `__meta` group of the respective Document Model.
For CDMs, the `__meta` group is added to all parts of the composition that also represent an individual document.

The UI models can now refer to these fields in the same way as with regular fields. Overview Models can use them for columns, Form Models for controls or repeat columns and they can be used in expressions etc.

|  |  |
| --- | --- |
|  | The String data used in Document Metadata will be validated to ensure that the characters used are included in the [Supported Characters](https://geta12.com/docs/sme/sme-dm-ba-docs/index.html#txt:reference:supported-characters) defined in the Document Model.  Modeling a restricted set of Supported Characters can lead to formal validation errors when adding or updating the Document Metadata which prevent the Document from being saved. |
