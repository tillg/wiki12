---
source: https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/index.html
category: workflows
docid: ba-docs
scraped: 2026-06-12
---

# Workflow Modeling

## Introduction

A12 Workflows (A12WF) provides an integration of Business Process Model and Notation (BPMN) and Decision Model and Notation (DMN) capabilities into A12, enabling both the graphical modeling and the execution of server-side workflows.

This allows modeling the business-level behavior of entire A12 applications. The focus is on semi-automated, long-running workflows that involve multiple roles and complex authorization rules. Such authorization rules are defined and executed using [*UAA*](https://geta12.com/docs/UAA/uaa-documentation-src/index.html).

|  |  |
| --- | --- |
|  | This documentation describes the integration of BPMN and DMN Models with other A12 Models in your project. For more information on BPMN and DMN Modeling, please refer to [Further Resources](#further-resources). |

Integrated modeling capabilities include process steps performed by humans and machines, the connections between them, and business rules triggering different process paths. For automated process steps, several automations are provided out of the box, e.g., to send an email or to link two documents.

Custom automations can be implemented against a well-defined API and then used by modelers. Additionally, custom code can react to provided events such as a task being completed.

All of this is achieved by connecting the third-party CIB 7 process engine to the A12 stack. To this end, A12 Workflows provides a tailored, A12-aware CIB 7 service as well as extensions for [*Data Services*](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html) and [*Client*](https://geta12.com/docs/CLIENT/client-documentation-bundle/index.html).

|  |  |
| --- | --- |
|  | Workflows supports CIB 7 only. However the BPMN models are still modeled with the Camunda Modeler. |

|  |  |
| --- | --- |
|  | Use the Camunda Modeler that comes with the [installer](https://geta12.com/#/releases/installer) to ensure that BPMN and DMN Models are compatible. |

### Current Limitations

* No eventual consistency guarantees yet for communication between CIB 7 and Data Services.
* Document Models used for workflows **still need metadata as include for now** and must be exactly named **A12WF**:

  + A document can only be referenced by a single *User Task* at a time (because metadata is populated directly in the document).
  + Thus, parallel *User Tasks* *cannot* reference the same document.
* CIB 7 must be protected in production because it does not integrate UAA authorization.

### CIB 7 Cockpit

CIB 7 provides an admin interface which shows:

* Deployed BPMN models
* Deployed DMN models
* Running process instances

  + Execution status of each instance
  + Incidents (errors) of each instance
  + Values of process variables of each instance
* …​and more

|  |  |
| --- | --- |
|  | The CIB 7 Cockpit is a vital tool for troubleshooting as incidents clearly show:  * the task which triggered the incident * the current values of process variables  The modeling of this specific task can then be checked based and the process variables compared to the expected values. |

#### Using the CIB 7 Cockpit

|  |  |
| --- | --- |
|  | If you start CIB 7 via Gradle, CIB 7 Cockpit might not work properly. |

* With CIB 7 running, go to <http://localhost:8088/camunda/>
* Log in with your credentials (user : password):

  Preview App
  :   admin : a12

  Project Template
  :   Please speak to your development team.
      No default log in credentials exist.
      Log in credentials must be added by a developer.

|  |  |
| --- | --- |
|  | Make sure that the admin role exists. |

![Welcome screen of CIB 7 Cockpit](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/cockpit-welcome.png)

Figure 1. Welcome screen of CIB 7 Cockpit

* Click on Cockpit (on the left) to see statistics of the current engine state.

![Overview screen of CIB 7 Cockpit](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/cockpit-overview.png)

Figure 2. Overview screen of CIB 7 Cockpit

* Let’s click on running process instances (on the left) to get a detailed overview.

![Overview of running process instances](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/cockpit-running-process-instances.png)

Figure 3. Overview of running process instances

Here, only one of the shown process models has running instances and also some incidents.

* Click on the process definition to see more details.

![Running instances and incidents for a selected process model](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/cockpit-process-model-overview.png)

Figure 4. Running instances and incidents for a selected process model

Here, you can see how the running instances are distributed.

1. In this case, all 92 instances are at the first user task, but 6 of them have an incident (error).
2. If you deployed multiple versions of the model, make sure to select the desired version at the top left under "Definition Version".
3. In this case, all 92 instances are running on the current version.
4. By clicking on a process instance in the list at the bottom, you can get interesting details for troubleshooting:

* Click on a specific process instance to see more details.

![Details about a running process instance](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/cockpit-process-instance-details.png)

Figure 5. Details about a running process instance

Here, you have several options for troubleshooting.

1. Check whether process variables exist as expected and have the expected values.
2. Get the stacktrace for incidents.
3. Change values of process variables via the UI.
4. Delete variables (but you *cannot* create new ones).

### Further Resources

|  |  |
| --- | --- |
|  | Some resources are still linked to the Camunda Docs, either because CIB 7 still misses the respective documentation or some resources are generally about modeling. |

* [Camunda best practices](https://docs.camunda.io/docs/components/best-practices/modeling/creating-readable-process-models/) (see under "Modeling")
* [CIB 7 quickstart](https://docs.cibseven.org/get-started/quick-start/)
* [BPMN element reference](https://camunda.com/bpmn/reference/)
* [BPMN examples (good vs not so good)](https://camunda.com/bpmn/examples/)
* [Camunda Modeler](https://camunda.com/download/modeler/)
* [CIB 7 Cockpit](https://docs.cibseven.org/manual/2.0/webapps/cockpit/)
* [Camunda Dealing with Exceptions](https://docs.camunda.io/docs/8.7/components/best-practices/development/understanding-transaction-handling-c7/)
* [From 'Bad Smells' to Best Practices and Patterns](https://www.researchgate.net/publication/280547761_Refactoring_BPMN_Models_From_'Bad_Smells'_to_Best_Practices_and_Patterns/)

## Overview of Integration Possibilities

Successful modeling and integration of Workspaces that make use of Workflows includes a number of extra considerations compared to a standard CRUD use-case:

* Correct configuration of your application
* Valid BPMN Model(s)
* Document Models used in a Task must be able to store process metadata

  + Field Values used in the Process must be correctly annotated
* Form Model actions must be configured to move the process token accordingly
* Overview Model actions must be configured to start process as well as creating new Documents

### Configuring your Application

#### Preview App

To use the preview app to model a workflow, a *workspace* must be set up.
You can review the `with-workflows` workspace as an example.

A workspace for workflows must include the following in the `workspace.json`:

* `"enableWorkflows": true`
* Email server configuration, if you want to use the [`sendEmailDelegate`](#anchor-provided-delegates)

A `workspace.json` may look as follows:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` {   "activeTheme": "flat",   "workspaceTitle": "My Workflows Workspace",   "enableWorkflows": true,   "themes": [],   "environmentVariables": {     "preview-app-workflows": {       "MGMTP_A12_WORKFLOWS_ENGINE_DELEGATES_EMAIL_HOST": "add-email.host",       "MGMTP_A12_WORKFLOWS_ENGINE_DELEGATES_EMAIL_USER": "add-user",       "MGMTP_A12_WORKFLOWS_ENGINE_DELEGATES_EMAIL_PASSWORD": "add-password",       "MGMTP_A12_WORKFLOWS_ENGINE_DELEGATES_EMAIL_FROM": "add-sender-email-address",       "MGMTP_A12_WORKFLOWS_ENGINE_DELEGATES_EMAIL_PORT": "587",       "MGMTP_A12_WORKFLOWS_ENGINE_DELEGATES_EMAIL_STARTTLS_ENABLED": "true",       "MGMTP_A12_WORKFLOWS_ENGINE_DELEGATES_EMAIL_LOGIN_ENABLED": "true",       "MGMTP_A12_WORKFLOWS_ENGINE_DELEGATES_EMAIL_KEEP_ALIVE_TIMEOUT": "300"     }   } } ``` |
```

#### Project Template

Please make sure to use the
[Workflows Variant](https://geta12.com/docs/PROJECT_TEMPLATE/project-template-documentation/index.html#_workflows_2)
of the Project Template.

### Integration of BPMN Models

The official Camunda website provides an overview of [supported BPMN elements](https://camunda.com/de/bpmn/bpmn-2-0-symbol-reference/).

|  |  |
| --- | --- |
|  | The Camunda 7 and CIB 7 documentation are currently similar. Camunda’s documentation offers more information about some modeling aspect as well as we still use the Camunda Modeler. The term Camunda in this documentation refers the Camunda Modeler. CIB 7 is the actual process engine that processes the modeled BPMN models. |

In principle, A12WF supports all BPMN elements that Camunda supports.
[*Element Templates*](#anchor-provided-element-templates) have been added to the Camunda Modeler that you can download with the A12 installer from
[geta12.com](https://geta12.com/#/releases/installer).
These templates minimize the risk of modeling errors when integrating BPMN Models in your application.

If you face an issue in your modeling, refer to troubleshooting with the [CIB 7 Cockpit](#anchor-bpmn-troubleshooting).

#### Current BPMN Limitations

##### Parallel Tasks

|  |  |
| --- | --- |
|  | Parallel *Tasks* cannot reference the same document.  In other words, a document can only be referenced by one *User Task* at a time. |

##### Signal Events

|  |  |
| --- | --- |
|  | Signal Events cannot be triggered via user interactions. |

##### Conditional Boundary Events

A12 Workflows generally supports using *Conditional (Boundary) Events* (see also [CIB 7 Manual: Conditional Events](https://docs.cibseven.org/manual/2.0/reference/bpmn20/events/conditional-events/)).

*Conditional (Boundary) Events* may listen to process variables from document fields annotated with **availableInProcessAs** (see [Synchronize Field Values](#anchor-cbr-synchronize-values)). However, be aware of the pitfalls below.

###### Pitfalls

1. When ending a *User Task* via any *Boundary Event*, please be aware that the UI will not be reloaded out of the box, as it does when completing a task via the `proceed` form event.
2. *Conditional Boundary Events* should react to external data changes only. In other words, changes made by a user while working on the user task should not trigger the *Conditional Boundary Event*.

   * The reason is that completing a task via the UI also causes a data change. If this task completion triggers the boundary event, the engine will try to complete the task which was already deleted by the *Conditional Boundary Event*, causing flaky errors (race conditions).

|  |  |
| --- | --- |
|  | Camunda Modeler versions <5.12.0 has a bug which prevents setting event types for conditional events. If affected, please upgrade to a more recent A12 Installer version. |

#### Camunda Element Templates

Camunda provides the possibility to create *Element Templates* which provide tailored views on BPMN elements.

By linking one these *Element Templates*, the properties panel for that element is adapted so that the modeler has a made-to-measure view of the settings that need to be made.

|  |  |
| --- | --- |
|  | Workflows provides [*Element Templates*](#anchor-provided-element-templates) to support model integration.  These Templates include tailored views and simple validation of the settings. |

For instance, an *Element Template* for a *Service Task* calling a certain delegate would show only the relevant properties for that delegate:

* The reference to the delegate is pre-set
* The input parameter names are pre-defined

The modeler only needs to provide the input values.
In certain cases, the input value is validated.
For example, if an expression must be entered to reference a process variable, the input is validated to ensure the correct syntax is used.

*Element Templates* greatly improve the integration of models by saving time and reducing errors by manual inputs.

|  |  |
| --- | --- |
|  | General information about Camunda *Element Templates* can be found in [Camunda Docs: Element Templates](https://docs.camunda.io/docs/components/modeler/desktop-modeler/element-templates/about-templates/). |

##### Provided Element Templates

The Camunda Modeler which comes with the A12 Installer includes *Element Templates* for:

1. all our [delegates](#anchor-provided-delegates),
2. the two supported user tasks,

   1. [User Task Creating A New Document](#user-task-new-doc)
   2. [User Task With Input Document](#user-task-existing-doc)
3. and [Message Throw Events](#message-event-template).

|  |  |
| --- | --- |
|  | The Camunda documentation includes information on both Camunda 7 and Camunda 8. Please be aware of the differences between these versions when referring to the documentation. |

##### Custom Element Templates

To create custom element templates, please refer to:

* [Camunda Docs: Element Template Configuration](https://docs.camunda.io/docs/components/modeler/desktop-modeler/element-templates/configuring-templates/)
* [Camunda Docs: Element Template Definition](https://docs.camunda.io/docs/components/modeler/desktop-modeler/element-templates/c7-defining-templates/)
* [Camunda Docs: Applying Element Templates](https://docs.camunda.io/docs/components/modeler/desktop-modeler/element-templates/using-templates/)

#### User Tasks

There are two cases that are currently supported with the [*Element Templates*](#anchor-provided-element-templates):

* A *User Task* creates a new document.
* A *User Task* works on an existing document.

#### Service Tasks

*Service Tasks* run code without human intervention.

Typically, they trigger one of the [provided delegates](#anchor-provided-delegates).
These delegates are predefined automations for *Service Tasks*.

The settings for the following delegates can be made using the [*Element Templates*](#anchor-provided-element-templates) provided.

For more details about the usage of delegates, please check
[CIB 7 docs](https://docs.cibseven.org/manual/2.0/user-guide/process-engine/delegation-code/).

|  |  |
| --- | --- |
|  | Projects can implement custom delegates and *Element Templates*. |

Table 1. Provided Delegates


| Template | Inputs | Outputs | Description |
| --- | --- | --- | --- |
| [Set Status Delegate Template](#set-status-delegate-template) | `documentReference,  pathToField,  [repetitions, ]  newValue` | - | Update the status (optionally, with the given repetitions) in the given document. |
| [Sync Available Fields Delegate Template](#sync-available-fields-delegate-template) | `documentReferences` | - | Fetches the current values of `availableInProcessAs`-annotated fields of the given documents as process variables. |
| [Send Email Delegate Template](#send-email-delegate-template) | `recipients,  [cc, ]  subject,  message` | - | Sends an email to one or more recipients. |
| [Create Document Delegate Template](#create-document-delegate-template) | `documentModelName` | `newDocRef` | Creates a new empty document of the given document model. |
| [Create Relationship Link Delegate Template](#create-relationship-link-delegate-template) | `relationshipModel,  sourceRole,  sourceDocRef,  targetRole,  targetDocRef` | `newLinkId` | Creates a link between the two given documents. |
| [Delete Relationship Link Delegate Template](#delete-relationship-link-delegate-template) | `id,  relationshipModel,  sourceRole,  sourceDocRef,  targetRole,  targetDocRef` | - | Deletes the link with the given ID between the two given documents. |
| [Re-link Document Delegate Template](#relink-document-delegate-template) | `id,  relationshipModel,  sourceRole,  sourceDocRef,  targetRole,  targetDocRef` | `newLinkId` | Replace the current link with a new link, having a new ID. |

|  |  |
| --- | --- |
|  | The inputs and outputs listed in [Provided Delegates](#anchor-provided-delegates) are correctly applied when using the [*Element Templates*](#anchor-provided-element-templates) provided.  The delegates may be used without the templates by adding the input and output variables to the service task manually. |

#### BPMN Errors

In CIB 7, you can use *Error Events* to react to errors that occur in a process, which are called BPMN Errors (see also [CIB 7 Docs on BPMN Errors](https://docs.cibseven.org/manual/2.0/reference/bpmn20/events/error-events/)).

We also provide a few custom BPMN Errors which can occur in some of our delegates.
You can react to them by using *Error Boundary Events* on the respective *Service Task*.
For this *Boundary Event*, create a new global error reference, give it a name, and set the code property to the respective BPMN Error code.

![Example for an ErrorBoundaryEvent](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/error-boundary-event-example.png)

Figure 6. Example for an ErrorBoundaryEvent

Table 2. Error Codes for Specific Delegates


| BPMN Error Code | Related Delegates | Description |
| --- | --- | --- |
| SendEmailError | `sendEmailDelegate` | This error is thrown when an email could not be sent via the delegate, e.g. because the mail server was not reached. |
| RelationshipLinkageError | `createRelationshipLinkDelegate`,  `deleteRelationshipLinkDelegate`,  `relinkDocumentDelegate` | This error is thrown when a relationship link could not be created, modified or deleted, e.g. because the given relationship model was not found. |
| LinkLimitReachedError | `createRelationshipLinkDelegate` | This error is thrown in case the new link would break the upper bound, see also [Relationship Model Documentation](https://geta12.com/docs/overall/relationships_for_bas/index.html#_relationship_model_editor). |

#### Asynchronous Continuations

On most BPMN elements, you will find `Asynchronous continuations` in the properties panel.

These represent a **"savepoint"** in the process.
If an error occurs, CIB 7 will revert to the last "savepoint".

|  |  |
| --- | --- |
|  | User tasks are savepoints by default. Service tasks are not. |

![Property panel with asynchronous continuation before](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/bpmn-asynchronous-before.png)

Figure 7. Property Panel With Asynchronous Continuation Before

Asynchronous continuations
:   Savepoints can be set to `Before` or `After`:

    * `Asynchronous before`

      + Sets a "savepoint" before the element.
      + Example: if a *Gateway* is "asynchronous before", CIB 7 cannot roll back to any element before the *Gateway* even if its evaluation fails.
    * `Asynchronous after`

      + Sets a "savepoint" after the element.
      + Example: if a *Service Task* is "asynchronous after", CIB 7 cannot fall back past this point and this service task will not be repeated.

|  |  |
| --- | --- |
|  | If a *User Task* does not have an asynchronous continuation specified, CIB 7 can fall back into the wait state of that user task if a subsequent step fails. |

|  |  |
| --- | --- |
|  | As a modeler, you should always keep `exclusive` checked.  Asynchronous continuations modeled using one of the provided [*Element Templates*](#anchor-provided-element-templates) are set to `exclusive`. |

#### Occupied Process Variable Names

The following process variable names are fixed and therefore shouldn’t be used as output or input variable name in *User Tasks* or *Service Tasks*:

* `newDocRef`
* `initiator`
* `documentReference`
* `newLinkId`
* Names of delegate inputs (see [Provided Delegates](#anchor-provided-delegates))

### Document Models

#### Metadata Include

|  |  |
| --- | --- |
|  | Workflows metadata is currently maintained separately from *Document Metadata*. |

You must add [`WorkflowsMetadata_DM.json`](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/files/WorkflowsMetadata_DM.json) as an include in all documents models that are used in a workflow. The include can be on any level but must be called exactly `A12WF`.

At runtime, this metadata connects a document to a *User Task* of a running process instance.

The metadata is manipulated every time a *User Task* is created, assigned, completed, or aborted.

The metadata mainly contains the following information:

* The name of the process model,
* the process instance ID,
* the business key for this process instance,
* the initiator, who started this process instance,
* the name and the id of the current *User Task*,
* the assignee of the current *User Task*,
* the name of the *Form Model* linked to a *User Task*.

|  |  |
| --- | --- |
|  | The String data used in Workflows metadata will be validated to ensure that the characters used are included in the [Supported Characters](https://geta12.com/docs/sme/sme-dm-ba-docs/index.html#txt:reference:supported-characters) defined in the Document Model.  Modeling a restricted set of Supported Characters can lead to formal validation errors when adding or updating the Workflows Metadata which prevents the Document from being saved. |

#### Context-Based Validation Rules

In order to allow successful validation of "intermediate documents" that are built up in a process, modelers must write ***context-based validation rules***.
The idea is that, in different stages of a process, different validation rules should become active.

|  |  |
| --- | --- |
|  | Full validation is performed on all documents by default, including when working on a task or completing a task. |

|  |  |
| --- | --- |
|  | To reduce modeling effort, the status should be an enumeration and *[categories](https://geta12.com/docs/sme/sme-dm-ba-docs/index.html#_enumeration_categories)* can be used to group multiple enumeration values into one category.  This way, you can define "stages of validation", where each category represents one such stage. In each stage, different validation rules apply. |

##### Example

Consider a simple model with three fields:

Table 3. Simple Model


| Field | Data Type | Data Type Constraints |
| --- | --- | --- |
| Name | String | - |
| DateOfBirth | Date | - |
| Status | Enumeration | Category = "RuleCategory"   | Enumeration Value | RuleCategory | | --- | --- | | StartingStatus | Start | | NameMustBeFilled | BothRules | | DateOfBirthMustBeFilled | BothRules | |

The "Status" Field can take three values as shown in the table above.

Let’s add the following Validation Rules:

Table 4. Rule Modeled in Simple Model


| Rule | Error Field | Error Condition |
| --- | --- | --- |
| NameIsFilled | Name | `[Status → RuleCategory] == "BothRules" AND FieldNotFilled(Name)` |
| DateOfBirthIsFilled | DateOfBirth | `[Status] == "DateOfBirthMustBeFilled" AND FieldNotFilled(DateOfBirth)` |

In the process shown in [Different Validation Rules Triggered Through Context Changes](#bpmn-status-based-validation), the following Context-Based Validation occurs:

1. The Status is set to "NameMustBeFilled".
2. The User completes the Name in the User Task "Enter Name".

   1. If the Name is left empty, the Rule "NameIsFilled" fires as the RuleCategory of "NameMustBeFilled" == "BothRules".
   2. If the Date of Birth is left empty, no rule fires.
3. The Status is set to "DateOfBirthMustBeFilled".

   1. If the Name is left empty, the Rule "NameIsFilled" fires as the RuleCategory of "DateOfBirthMustBeFilled" == "BothRules".
   2. If the Date of Birth is left empty, the Rule "DateOfBirthIsFilled" fires.

![Different Validation Rules Triggered Through Context Changes](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/bpmn-status-based-validation.png)

Figure 8. Different Validation Rules Triggered Through Context Changes

#### Synchronize Field Values

Field values can be synchronized from a document to its corresponding *User Task* in CIB 7.

To do this, you need to annotate the desired fields with `availableInProcessAs` and provide the desired *Process Variable* name.

With automatic synchronization enabled, synchronization takes place whenever the document payload changes. It does *not* trigger if only A12 Workflows metadata is modified. So among others, synchronization happens when…​

* a *User Task* is saved.
* a *User Task* is completed via the `proceed` event.
* a *User Task* is assigned to a user.
* the document is changed externally, e.g., via code.

|  |  |
| --- | --- |
|  | Only fields can be synchronized to CIB 7 for the time being. For repeated fields, the last found value will be synchronized. |

### Form Models

A Workflows process can load a specific Form Model for a specific User Task.
When a heterogeneous subType Document is used, a Form Model can also be modeled for each specific subType.

Table 5. Supported Events in Form Models


| Event | Action Type | Purpose |
| --- | --- | --- |
| [`proceed`](#anchor-proceed-event) | Button | Completes the current user task. |
| [`sendMessage`](#anchor-send-message-event) | Button | Triggers a *Message Event* in CIB 7. |

### Overview Models

Overviews in the context of A12 Workflows represent **task lists**.

A task list can show tasks of one or more process models.
A heterogeneous task list overview may also be modeled.

An entry in a task list is a currently active *User Task* in a currently running *Process Instance*.

The overview model **must reference a document model which includes our `WorkflowsMetadata_DM.json`**.

|  |  |
| --- | --- |
|  | We don’t deliver an overview component out of the box, so **the following depends on the project’s overview implementation**. However, **it describes the most common situation**. |

Table 6. Supported Events in Overview Models


| Event | Action Type | Purpose |
| --- | --- | --- |
| [`startProcess_<PROCESS_ID>`](#start-process-overview) | Button | Starts a new instance of process model `<PROCESS_ID>`.  (Must match the process ID in the BPMN model) |
| [`startProcess_<PROCESS_ID>_<SUBTYPE_NAME>`](#start-process-overview-heterogen) | Button | Starts a new instance of process model `<PROCESS_ID>` with the subtype name `<SUBTYPE_NAME>`. |
| [`claim`](#assign-task-user) | Row Action | Assigns a task to the current user.  `…​/A12WF/Task/Assignee` will be set to the current username. |

|  |  |
| --- | --- |
|  | The following Events are **not** supported in task lists:  * `add` * `delete` |

### Application Models

#### Overview Scene

To model an activity that shows a *task overview*, you must take care of the following:

1. You must add `"view": "TaskList"` (as before) to the activity descriptor in the SME.
2. You must add `"model": "<YOUR_PROCESS_DOCUMENT_MODEL_NAME>`, e.g. `"model": "DomainOrder"`.

   * When working with CDMs, the root Document Model must be referenced.
3. You must call the containing *flow* exactly `"TaskFlow"`.

![Example Application Model](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/Appmodel-example.png)

4. In the `VIEW_ADD` directive, make sure the name matches the name of the registered overview component.

   * In the Preview App, it is `OverviewEngine`, if you haven’t defined a custom React component for registering custom event handlers.
   * If you decide to define a custom task overview component, as described in the [Integration Step-by-Step Guide](https://geta12.com/docs/workflows/dev-docs/index.html#anchor-cbr-integration-step-by-step), then the name in the VIEW\_ADD` directive must match the view name in your view provider.

#### Form Scenes

Generally, you should *not* model scenes for forms because we generate these Application Model fragments at runtime.

The only exceptions to this are if you want to model a heterogeneous *task overview* or one for a CDM, since these scenes are not generated.

##### Heterogeneous Task Overviews

Heterogeneous *task overviews* show tasks of different process models which refer to subtype document models of the same supertype document model.

For more information on heterogeneity modeling in A12, see [Modeling Heterogeneous Data](https://geta12.com/docs/overall/heterogeneity/index.html)
& [Tutorial for Heterogeneity Modeling](https://geta12.com/docs/overall/modeling_tutorial_heterogeneity/index.html).

In this case, you must add the scenes for your subtype document models to the `TaskFlow` in your appmodel.
The match conditions for these scenes must be set as follows:

| Match Condition Key | Property | Value |
| --- | --- | --- |
| instance | is set | true |
| model | must equal | <YOUR\_SUPERTYPE\_DOCUMENT\_MODEL\_NAME> |
| formKey | must equal | <YOUR\_FORM\_MODEL\_NAME\_BEING\_THE\_USER\_TASK\_FORM\_KEY> |

![Example Match Conditions for a heterogeneous Form Scene](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/heterogeneous_scene_match_conditions_example.png)

To this scene you must add a scene change for *On Enter* having the following properties:

| Property | Value |
| --- | --- |
| Type | VIEW\_ADD |
| Name | FormEngine |
| Constraints Type | MasterDetail |
| Model Type | Form |
| Model Name | <YOUR\_FORM\_MODEL\_NAME> |

![Example Scene Change for a Form Scene](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/heterogeneous_scene_view_add_example.png)

##### CDM Task Overviews

The form scenes for showing a CDM-based form in *task overviews* can be modeled with the following match conditions:

| Match Condition Key | Property | Value |
| --- | --- | --- |
| instance | is set | true |
| model | must equal | <YOUR\_ROOT\_DOCUMENT\_MODEL\_NAME> |
| view | must equal | TaskList |

![Example Match Conditions for a CDM-based Form Scene](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/cdm_scene_match_conditions_example.png)

To this scene you must add a scene change for *On Enter* having the following properties:

| Property | Value |
| --- | --- |
| Type | VIEW\_ADD |
| Name | FormEngine |
| Model Type | Form |
| Model Name | <YOUR\_CDM\_BASED\_FORM\_MODEL\_NAME> |

![Example Scene Change for a Form Scene](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/cdm_scene_view_add_example.png)

You must model the Form Scenes for Child Activities similarly.
For more information, see [CDM Child Activity Form Scenes](https://geta12.com/docs/OVERALL/relationships_for_bas/index.html#_setup_of_master_detail_module_with_heterogeneous_child_activity).

#### Example

See [vacation-appmodel.json](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/files/vacation-appmodel.json) as an example.

### RBAC Modeling

|  |  |
| --- | --- |
|  | RBAC = role-based access control. |

While modelers can achieve *certain* CRUD use cases using RBAC, this model-based authorization mechanism is not suitable for workflows-related use cases.

#### Limitations of RBAC Modeling

* RBAC only enables access rules on model level
* You cannot show proper task lists

  + Example: if a user is supposed to see their own contract, they can see all contracts

|  |  |
| --- | --- |
|  | Use cases relevant for workflows (e.g. "I can see only my own vacation requests in the task list") can be achieved with ABAC (attribute-based access control). ABAC is currently not model-based. |

### CDM Integration

Workflows supports opening CDM-based forms from a *task overview*.

Let’s assume we have the following models to work with:

* Document Model `Team_DM` as root Document Model of the CDM
* Document Model `Employee_DM`
* Relationship Model `TeamEmployee_RM` defining the relationship between `Team_DM` and `Employee_DM`

  + A team can have up to 10 employees
  + An employee can only be in one team
* Composed Document Model `TeamEmployee_CDM`

|  |  |
| --- | --- |
|  | The root Document Model must include our [Workflows Metadata](#anchor-metadata-include). |

The following steps describe how to set up Overview Model, Form Model and App Model:

* In the [CDM](https://geta12.com/docs/OVERALL/relationships_for_bas/index.html#_simple_composed_data) `TeamEmployee_CDM`, make sure that the root Document Model for the annotation field `cdm.queryRoot` in the CDM’s model settings is defined correctly. In our example this would be `cdm.queryRoot: Team_DM`.
* Create an [Overview Model](https://geta12.com/docs/OVERALL/relationships_for_bas/index.html#_cdms_and_regular_overviews_or_trees) that references the CDM. In our example this would be `TeamPerson_CDM`.
* Create a [Form Model referencing the CDM](https://geta12.com/docs/OVERALL/relationships_for_bas/index.html#_modeling_a_form_model_for_a_cdm). In our example, the form model can be called `TeamEmployee_CFM` and would reference `TeamPerson_CDM`.
* Create an [App Model for CDMs](https://geta12.com/docs/OVERALL/relationships_for_bas/index.html#appmodel_link).

  + For Workflows, you must [adjust the Overview Scene](#anchor-overview-scene).
  + You must also model the [Form Scenes for CDM task overviews](#anchor-cdm-task-overviews).

## Integration of Specific Tasks

The following functionality can be modeled into your application.
The integration of specific Tasks or Events in the BPMN Model with A12 Models requires modelers to make changes in multiple models.
The models and model settings that are relevant are highlighted for each specific function.

|  |  |
| --- | --- |
|  | The following modeling steps assume that the BPMN Model is valid. |

### Start a Process From an Overview

#### BPMN Model

* The BPMN Model must contain an executable process.

|  |  |
| --- | --- |
|  | The default Process ID should be changed to a semantic name, e.g. VacationProcess.  The Process ID is found in the Pool Properties. |

|  |  |
| --- | --- |
|  | Underscores should be removed from the Process ID as underscores have a specific meaning, see [Start a Process Using a Specific Subtype Document](#start-process-overview-heterogen). |

#### Overview Model

A process can be started using an event modeled in the Subheader of an Overview.
This is similar to adding new documents with the "add" event in the Overview.
In this case, a Task Document needs to be created and saved in the database and a Process started in the CIB 7 Engine.

The Overview Model must reference a Document Model which includes the Workflows Metadata.

* Model an Event button in the Custom Actions tab of the Overview Model
* Enter the Event: `startProcess_<PROCESS_ID>`

  |  |  |
  | --- | --- |
  |  | The Overview Model Editor does not show this event per-default. This event must be manually entered. |

  |  |  |
  | --- | --- |
  |  | This event will try to start a new instance of the process model `<PROCESS_ID>`.  The `<PROCESS_ID>` must exactly match an executable Process ID from your BPMN Model. Check your models to avoid typos. |

  Example
  :   `startProcess_ContractChange` will start an instance of a BPMN model with *Process ID* `ContractChange`.

Depending on the project’s implementation of the overview component, the process ID may be set via an annotation rather than via the event name after an underscore (same approach as in the [sendMessage event](#anchor-send-message-event)).

### Start a Process Using a Specific Subtype Document

This allows modeling multiple buttons on a heterogeneous *task overview*, where each button will start a process with the respective subtype.
The same process will be used in the CIB 7 Engine.
By specifying the Document Type, different Fields and Rules can be modeled on the Document Model as well as unique Form Models.

#### BPMN Model

* The BPMN Model must contain an executable process.

  |  |  |
  | --- | --- |
  |  | Underscores should be removed from the Process ID as underscores are used to separate the `<PROCESS_ID>` from the `<SUBTYPE_NAME>`. |

  |  |  |
  | --- | --- |
  |  | The Event will create the process variable, `subtype`. |
* A *Business Rule Task* should be used immediately after the Start Event to create a process variable based on the `subtype`.
  The process variable value should define:

  + A `formKey` to be referenced in a [User Task](#user-task-new-doc)
  + A `documentModelName` to be used with the [Create Document Delegate Template](#create-document-delegate-template)

#### Overview Model

The Overview Model must reference a Document Model which includes the Workflows Metadata.

The Document Model referenced by the Overview Model should be the supertype of any specific subtype Document Models that you are using.

|  |  |
| --- | --- |
|  | As with other heterogeneous Overviews, the path to the Fields referenced in the Overview Model must be consistent between the supertype and subtype Document Models. |

* Model an Event button in the Custom Actions tab of the Overview Model

  |  |  |
  | --- | --- |
  |  | Use multiple event in the Overview Model to allow the end-user to start a process using multiple different subtype Documents. |
* Enter the Event: `startProcess_<PROCESS_ID>_<SUBTYPE_NAME>`

  |  |  |
  | --- | --- |
  |  | The Overview Model Editor does not show this event per-default. This event must be manually entered. |

  |  |  |
  | --- | --- |
  |  | This event will try to start a new instance of the process model `<PROCESS_ID>`.  The `<PROCESS_ID>` must exactly match an executable Process ID from your BPMN Model. Check your models to avoid typos. |

  + The Event will create the process variable `subtype` with the value `<SUBTYPE_NAME>`.

    Example
    :   Let’s assume we have a supertype **Person** with subtypes **Employee** and **Freelancer**. `startProcess_PersonRegistration_employee` will start an instance of a BPMN model with *Process ID* `PersonRegistration`.
        The process variable, `subtype` will have the value "employee".
        A *Business Rule Task* in the corresponding BPMN model and reference a valid *DMN Table* can then be used to create a further process variable setting, for example, the correct `formKey` of a given subtype.

|  |  |
| --- | --- |
|  | Please avoid modeling an error case, which would allow creating an instance of an abstract supertype Document Model.  This error could happen when you model a button in your Overview Model that sends a `startProcess` event which would open up the Form Model that is based on the supertype Document Model. If the *DMN Table* is modeled in a way that it would open a Form Model based on the supertype Document Model, an instance of the supertype Document Model would be created in the backend.  In the example below, the abstract supertype **Person** can be created.  Decision Table Faulty Modeling example  Figure 9. Decision Table Modeling Which Attempts Creation of an Abstract Supertype |

### Assign Task to Current User

#### Overview Model

The Overview Model must reference a Document Model which includes the Workflows Metadata.

* Model a Row Action in the Custom Actions tab of the Overview Model
* Enter the Event: `claim`

  |  |  |
  | --- | --- |
  |  | The Overview Model Editor does not show this event per-default. This event must be manually entered. |

  + Assigns a task to the current user
  + This means that the field `…​/A12WF/Task/Assignee` will be set to the current username

    |  |  |
    | --- | --- |
    |  | The assignee can be shown in a task list by adding the column `…​/A12WF/Task/Assignee` to the Overview Model. |

|  |  |
| --- | --- |
|  | The value of `…​/A12WF/Task/Assignee` may, depending on project configuration, influence task access.  This is only possible using ABAC which is not model-based. |

### User Task Creating A New Document

#### Form Model

The Form Model must reference a Document Model which includes the Workflows Metadata.

|  |  |
| --- | --- |
|  | Initial Values set in the Form Model will have no effect as the Form Model opens an existing Document in this User Task.  The existing Document contains values for metadata and Workflows metadata fields. |

Events should be modeled to allow end-users to control the process from the Form.
This can include:

* Leaving the User task and moving the process token forward, see [Complete a User Task](#anchor-proceed-event).
* Sending a Message to trigger a message boundary event, see [Send a Message From a Form](#anchor-send-message-event).

#### BPMN Model

Model a User Task and apply the "User Task Creating A New Document" Template.

##### Output Document Reference

Process Variable Name For New Document Reference
:   This Process Variable will be used to reference this specific Document at all further steps in the process.

##### Forms

Type
:   Select "Embedded or External Task Forms".

Form key
:   Enter the Form Model Name.

    |  |  |
    | --- | --- |
    |  | If the process has been started specifying a Document Type, [Start a Process Using a Specific Subtype Document](#start-process-overview-heterogen), reference the `formKey` process variable that you created as an expression.  Example  If the Result variable from the *Business Rule Task* was "resultingFormKey", you would enter the expression `${resultingFormKey}` |

##### Example Model

See first user task in [UserTaskInputOutputExample.bpmn](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/bpmn/UserTaskInputOutputExample.bpmn).

|  |  |
| --- | --- |
|  | In the example model above, you could access the new Document Reference as `${myRequestDocRef}` in the rest of the process. |

### Complete a User Task

A Button may be modeled on the Form Model which causes the current user task to be completed.

#### Form Model

* Model an Event button
* Enter the Event: `proceed`

  |  |  |
  | --- | --- |
  |  | The Form Model Editor does not show this event per-default. This event must be manually entered. |

  + Saves the current Document.
  + Closes the currently open Form (equivalent to `event_submit`)
  + Completes the current user task.

    |  |  |
    | --- | --- |
    |  | Full validation is performed on all documents in the backend by default. The following Button Setting is strongly recommended:  Validation Mode: `Full Validation`  This will ensure the equivalent frontend validation is triggered and that error messages are presented to the end-user appropriately. |

##### Example

![Form button event 'proceed'](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/modeling-proceed-event.png)

Figure 10. Form Model Button with Event 'proceed'

### Send a Message From a Form

A Button may be modeled on the Form Model which causes a Message to be sent in the Workflow process.

#### Form Model

* Model an Event button
* Enter the Event: `sendMessage`

  |  |  |
  | --- | --- |
  |  | The Form Model Editor does not show this event per-default. This event must be manually entered. |

  |  |  |
  | --- | --- |
  |  | The `sendMessage` event triggers a Message Event in CIB 7. |
* Add an annotation:

  Name: `messageName`

  Value: Enter the Message that can be entered in to the Message Boundary Event.

Clicking on this Button in the application will trigger a Message Event in the BPMN Model using the value that you entered in the annotation.

|  |  |
| --- | --- |
|  | The value of the annotation must match the Message Event name in your BPMN model. |

|  |  |
| --- | --- |
|  | Sending a Message does not save the current Document. |

|  |  |
| --- | --- |
|  | Workflows updates the Document Metadata when leaving the User Task. If the validation of the Document fails, the Process cannot leave the User Task.  This can occur when using the [Set Status Delegate Template](#set-status-delegate-template) if [Context-Based Validation Rules](#anchor-cbr-context-based-validation-rules) have been "activated" by the new status field value and the necessary data changes have not been entered and saved. |

##### Example

The event should be modeled on your form model button in the SME:

![Form button event 'sendMessage'](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/modeling-sendmessage-event_1.png)

Figure 11. Form Model Button With Event 'sendMessage'

![Annotation 'messageName'](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/modeling-sendmessage-event_2.png)

Figure 12. 'messageName' Annotation on Form Model Button With Event 'sendMessage'

Next, model the corresponding message catch event in your BPMN model. The event name must match exactly (`CANCEL_ORDER_MESSAGE`):

![BPMN message catch event](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/modeling-sendmessage-event-bpmn.png)

Figure 13. Message Boundary Event for Above Button Event

### User Task With Input Document

Input Documents that have been created in the current process can be referenced using a process variable.

Processes which specify input Documents that were not created in the current process are not achievable with pure modeling because there is no way to model which Document References should be used.

|  |  |
| --- | --- |
|  | You can use a [User Task Creating A New Document](#user-task-new-doc) or a [Create Document Delegate Template](#create-document-delegate-template) to create the Documents that you need. |

#### Form Model

The Form Model must reference a Document Model which includes the Workflows Metadata.

|  |  |
| --- | --- |
|  | Initial Values set in the Form Model will have no effect as the Form Model opens an existing Document in this User Task. |

Events should be modeled to allow end-users to control the process from the Form.
This can include:

* Leaving the User task and moving the process token forward, see [Complete a User Task](#anchor-proceed-event).
* Sending a Message to trigger a message boundary event, see [Send a Message From a Form](#anchor-send-message-event).

#### BPMN Model

Model a User Task and apply the "User Task With Input Document" Template.

##### Input Document Reference

Document Reference Variable
:   Enter the Document Reference for the Document that you want to open.

    |  |  |
    | --- | --- |
    |  | The `Document Reference Variable` will normally be an expression referencing the process variable that you created when modeling a [User Task Creating A New Document](#user-task-new-doc) or using a [Create Document Delegate Template](#create-document-delegate-template) |

##### Forms

Type
:   Select "Embedded or External Task Forms".

Form key
:   Enter the Form Model Name.

    |  |  |
    | --- | --- |
    |  | The Document Model referenced by the Form Model must match the Document Model Name saved in the Document Metadata that you specified in the `Document Reference Variable`. |

    |  |  |
    | --- | --- |
    |  | If the process has been started specifying a Document Type, [Start a Process Using a Specific Subtype Document](#start-process-overview-heterogen), reference the `formKey` process variable that you created as an expression.  Example  If the Result variable from the *Business Rule Task* was "resultingFormKey", you would enter the expression `${resultingFormKey}` |

##### Example Model

See second user task in [UserTaskInputOutputExample.bpmn](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/bpmn/UserTaskInputOutputExample.bpmn).

|  |  |
| --- | --- |
|  | In the example model above, `${myRequestDocRef}` refers to a *Process Variable* that was created in the first User Task. |

### Set Status Delegate Template

The `setStatusDelegate` allows a single Field Value to be updated.

|  |  |
| --- | --- |
|  | A full validation of the Document is not performed. |

As the entire Document will not be validated when updating this single Field Value, this delegate can be used to prepare the document for a (User) Task in which [Context-Based Validation Rules](#anchor-cbr-context-based-validation-rules) is used.

#### Document Model

The Document Model must contain the Field whose value will be changed.

|  |  |
| --- | --- |
|  | Model an Enumeration Field so that only the internal values defined in the Document Model may be used.  Categories may also be modeled when using the Data Type, Enumeration, which allows grouping of [Context-Based Validation Rules](#anchor-cbr-context-based-validation-rules). |

#### BPMN Model

Model a Service Task and apply the "Set Status Delegate Template" Template.

##### Delegate Inputs

Document Reference
:   Enter the Document Reference for the Document whose status Field Value should be changed.

New Value
:   Enter the new Field Value as a string constant or expression.

    |  |  |
    | --- | --- |
    |  | When the delegate sets the value of a Field, the Field value will be validated.  This means that the New Value of an Enumeration Field must exactly match one of Values in the "Value" column of Enumeration Values for the specified Field. |

Path To Field
:   Enter the path to the Field that you want to update.

    |  |  |
    | --- | --- |
    |  | The path must be the absolute path of the Field. |

    |  |  |
    | --- | --- |
    |  | You can copy and paste the path after opening the Field in the Simple Model Editor. |

Repetitions
:   (Optional) Enter the index of the repeatable field you want to update.

    |  |  |
    | --- | --- |
    |  | The Repetitions must be specified for each term in the path. The comma-seperated list of Repetitions is evaluated in the same order as the terms in the path.  Example  If the Path to the Field is "/Application/Vacation/Status", the default setting is "1,1,1".  If the Group "Vacation" is repeatable and we want to edit the 3rd repetition, the Repetitions should be set to "1,3,1". |

##### Example Models

[SetStatusDelegate.bpmn](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/bpmn/SetStatusDelegate.bpmn)

[SetStatusDelegateWithRepetitions.bpmn](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/bpmn/SetStatusDelegateWithRepetitions.bpmn)

### Sync Available Fields Delegate Template

The `syncAvailableFieldsDelegate` fetches the current values of `availableInProcessAs`-annotated fields of the given documents as process variables.
Multiple document references may be used to update the process variables from a range of documents in a single step.

|  |  |
| --- | --- |
|  | `availableInProcessAs`-annotated fields which have not yet been saved in the Document will be saved as process variables with the value `null`. |

#### Document Model

Fields whose Field Values should be maintained as process variables must be annotated using `availableInProcessAs`.

The value of annotation sets the process variable name.

|  |  |
| --- | --- |
|  | Take care to use unique process variable names. The `syncAvailableFieldsDelegate` will overwrite existing process variables and, in the case of non-unique process variable names, only save the last value.  The [Occupied Process Variable Names](#anchor-occupied-process-variable-names) may not be used. |

#### BPMN Model

Model a Service Task and apply the "Sync Available Fields Delegate Template" Template.

##### Delegate Inputs

Document Reference/s
:   Enter the Document Reference for the Document whose `availableInProcessAs`-annotated fields should be read and saved as process variables.

    Multiple Document References can be modeled as a comma-separated string or input list.

##### Example Model

[SyncAvailableFields.bpmn](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/bpmn/SyncAvailableFields.bpmn)

### Send Email Delegate Template

The `sendEmailDelegate` sends an email using the mail server and settings defined in the `workspace.json` or Project Template. See [Preview App](#preview-app-setup) or [Project Template](#project-template-setup) for more information.

A BPMN Error Code, [Send Email Error](#send-email-error) is provided to handle errors with the mail server.

|  |  |
| --- | --- |
|  | The delegate inputs for the `sendEmailDelegate` accept process variables or string data.  Please ensure that the necessary Field Values have been annotated using `availableInProcessAs` and are up-to-date ([Sync Available Fields Delegate Template](#sync-available-fields-delegate-template)). |

#### BPMN Model

Model a Service Task and apply the "Send Email Delegate Template" Template.

##### Delegate Inputs

Recipients
:   Enter the recipients' email address or addresses.
    Multiple email addresses can be added as a comma-separated string.

Subject
:   Enter the Subject of the email.

Message
:   Enter the message body.

    |  |  |
    | --- | --- |
    |  | For the `message`, you may want to use [Freemarker](https://freemarker.apache.org/docs/dgui_quickstart_basics.html).  This allows you to include the values of process variables by using expressions such as `${orderTotal}`. See the provided example model. |

Cc
:   (Optional) Enter addresses which should be in cc.
    Multiple email addresses can be added as a comma-separated string.

##### Example Model

[SendEmail.bpmn](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/bpmn/SendEmail.bpmn)

#### Send Email Error

This error is thrown when an email could not be sent via the delegate, e.g. because the mail server was not reached.

Model an Error Boundary Event for the Service Task that uses the [Send Email Delegate Template](#send-email-delegate-template).

##### Error

Global error reference
:   Choose "Create new …​" or select a pre-defined Name from the list.

Name
:   The Name for the Error in the Model.

Code
:   SendEmailError

|  |  |
| --- | --- |
|  | All other settings are optional. |

### Create Document Delegate Template

|  |  |
| --- | --- |
|  | A full validation of the created Document is not performed. |

The `createDocumentDelegate` creates a new empty document of the given document model.
Its document reference is temporarily stored inside the `newDocRef` variable.
The Create Document Delegate Template provides the outputs to map the document reference to a process variable.
Required fields of a document can be set to required, when they should be mandatory in the first *User Task* in a Workflows process independently from being created by `createDocumentDelegate` in a *Service Task* or [User Task creating a new document](#user-task-new-doc).

|  |  |
| --- | --- |
|  | Use the [User Task creating a new document](#user-task-new-doc) when the end-user should immediately enter data, and this delegate when other (service) tasks should be performed first. |

#### Document Model

The Document Model must include the Workflows Metadata.

#### BPMN Model

Model a Service Task and apply the "Create Document Delegate Template" Template.

##### Delegate Inputs

Document Model Name
:   Enter the name of the Document Model for which you want to create a new Document.

    |  |  |
    | --- | --- |
    |  | If the process has been started specifying a Document Type, [Start a Process Using a Specific Subtype Document](#start-process-overview-heterogen), reference the `documentModelName` process variable that you created as an expression.  Example  If the Result variable from the *Business Rule Task* was "resultingDocumentModelName", you would enter the expression `${resultingDocumentModelName}` |

##### Delegate Output

Process Variable Name For New Document Reference
:   This Process Variable will be used to reference this specific Document at all further steps in the process.

##### Example Model

[CreateDocument.bpmn](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/bpmn/CreateDocument.bpmn)

### Create Relationship Link Delegate Template

The `createRelationshipLinkDelegate` creates a link between the two given documents.
The ID of this link is temporarily stored inside the `newLinkId` variable.
The Create Relationship Link Delegate Template provides the outputs to map the document reference to a process variable.

#### Document Model

The Document is not saved when creating or modifying Relationship Links.
However, specifying input Documents that were not created in the current process is not achievable with pure modeling because there is no way to model which Document References should be used.

As a result, the Documents that should be linked will normally be created in the process.
This means that the Document Model(s) referenced in the Relationship Model will normally include the Workflows Metadata.

#### Relationship Model

A Relationship Model must be modeled.

#### BPMN Model

Model a Service Task and apply the "Create Relationship Link Delegate Template" Template.

|  |  |
| --- | --- |
|  | Relationship Links are completely flat in A12. As both the Source and Target Roles are specifically modeled in the Template and not derived from the context you are currently working in, it does not matter which Document is the "Source" and which is the "Target". |

##### Delegate Inputs

Relationship Model
:   Enter the name of the Relationship Model for which you want to create a new Link.

Source Document Reference
:   Enter the Document Reference for the Document that you want to link.

    |  |  |
    | --- | --- |
    |  | The Document must reference the Document Model referenced in the Source Role. |

Source Role
:   The name of one of the Roles in the Relationship Model.

Target Document Reference
:   Enter the Document Reference for the other Document that you want to link.

    |  |  |
    | --- | --- |
    |  | The Document must reference the Document Model referenced in the Target Role. |

Target Role
:   The name of one of the other Role in the Relationship Model.

##### Delegate Output

Process Variable Name For New Link ID
:   This Process Variable will be used to reference this specific Link at all further steps in the process.

##### Example Model

[CreateRelationshipLink.bpmn](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/bpmn/CreateRelationshipLink.bpmn)

#### Relationship Linkage Error

This error is thrown when a relationship link could not be created, modified or deleted, e.g. because the given relationship model was not found.

Model an Error Boundary Event for the Service Task that uses the [Create Relationship Link Delegate Template](#create-relationship-link-delegate-template).

##### Error

Global error reference
:   Choose "Create new …​" or select a pre-defined Name from the list.

Name
:   The Name for the Error in the Model.

Code
:   RelationshipLinkageError

|  |  |
| --- | --- |
|  | All other settings are optional. |

|  |  |
| --- | --- |
|  | The values of the Delegate output will be set as `Null`. This new value may overwrite existing process variables with the same name. |

#### Link Limit Reached Error

This error is thrown in case the new link would break the upper bound, see also [Relationship Model Documentation](https://geta12.com/docs/overall/relationships_for_bas/index.html#_relationship_model_editor).

Model an Error Boundary Event for the Service Task that uses the [Create Relationship Link Delegate Template](#create-relationship-link-delegate-template).

##### Error

Global error reference
:   Choose "Create new …​" or select a pre-defined Name from the list.

Name
:   The Name for the Error in the Model.

Code
:   LinkLimitReachedError

|  |  |
| --- | --- |
|  | All other settings are optional. |

|  |  |
| --- | --- |
|  | The values of the Delegate output will be set as `Null`. This new value may overwrite existing process variables with the same name. |

### Delete Relationship Link Delegate Template

The `deleteRelationshipLinkDelegate` deletes the link with the given ID between the two given documents.
As with other references to specific elements in the database, this normally means that the Relationship Link was created in the process and the Link ID has been stored as a process variable.
For example, the Relationship Link has been created using the [Create Relationship Link Delegate Template](#create-relationship-link-delegate-template).

#### BPMN Model

Model a Service Task and apply the "Delete Relationship Link Delegate Template" Template.

##### Delegate Inputs

The modeling is as described in the [Create Relationship Link Delegate Template](#create-relationship-link-delegate-template) with the following exception:

Link ID
:   Enter the ID of the Link to be deleted.
    For example, the Process Variable defined as the Delegate Output of the [Create Relationship Link Delegate Template](#create-relationship-link-delegate-template).

    |  |  |
    | --- | --- |
    |  | The other delegate inputs describe the Documents, Roles and Relationship Model of the Link that should be deleted. |

##### Example Model

[DeleteRelationshipLink.bpmn](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/bpmn/DeleteRelationshipLink.bpmn)

#### Relationship Linkage Error

The Relationship Linkage Error be modeled for Service Tasks using the "Delete Relationship Link Delegate Template". Please see [Relationship Linkage Error](#relationship-linkage-error).

### Re-link Document Delegate Template

The `relinkDocumentDelegate` can be used to delete an existing link and create a new link in a single service task.
The pre-existing Link ID and the IDs of the two documents to be linked should be available as process variables.
For example, the Relationship Link has been created using the [Create Relationship Link Delegate Template](#create-relationship-link-delegate-template).

#### BPMN Model

Model a Service Task and apply the "Re-link Document Delegate Template" Template.

##### Delegate Inputs

The modeling is as described in the [Create Relationship Link Delegate Template](#create-relationship-link-delegate-template) with the following exception:

Link ID
:   Enter the ID of the Link to be deleted.
    For example, the Process Variable defined as the Delegate Output of the [Create Relationship Link Delegate Template](#create-relationship-link-delegate-template).

    |  |  |
    | --- | --- |
    |  | The other delegate inputs describe the Documents, Roles and Relationship Model of the Link that should be created. |

    |  |  |
    | --- | --- |
    |  | The Roles and Relationship Model of the relationship that you are re-linking must be consistent. |

##### Delegate Outputs

Process Variable Name For New Link ID
:   This Process Variable will be used to reference this specific Link at all further steps in the process.

    |  |  |
    | --- | --- |
    |  | The process variable referenced in the Delegate Inputs may be re-used in the Delegate Outputs by entering the process variable name in "Process Variable Name For New Link ID". This will overwrite the value in the process variable with the new Link ID. |

##### Example Model

[RelinkDocument.bpmn](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/bpmn/RelinkDocument.bpmn)

#### Relationship Linkage Error

The Relationship Linkage Error be modeled for Service Tasks using the "Re-link Document Delegate Template". Please see [Relationship Linkage Error](#relationship-linkage-error).

### Template For Message Throw Event

The Template For Message Throw Event creates a message event definition which gets all the current process variables and sends the process variables and their values as part of the message.

#### BPMN Model

Model an Intermediate Message Event and apply the "Template For Message Throw Event" Template.

##### Inputs

Local variable assignment
:   This is set to "On" per-default.

Assignment type
:   This is set to "String or expression" per-default.

Value
:   This is the name of the Message that can be entered in to the Message Catch Event.

|  |  |
| --- | --- |
|  | The Message will only be received if an executable Process:  * Has a Message Catch Event that references the Message "Value" * Has a process which is "waiting" for this message.   For example:  + A Message Start Event   + A Process which has reached an Event Based Gateway where one of the Events is a Message Catch Event |

## Cookbook

This section provides common use cases and possible solutions for modelers.

#### Status Change Use Case

**Use case:** A status field has to be kept up to date in a document, e.g., some business-related status like order placed, order canceled, order paid.

##### Proposed Solution

We suggest two solutions, one for *data-driven* and one for *process-driven* status changes.

Both rely on *Message Events* but determine the status in different ways.

###### Changing a Status Using Message Events

* Whenever a status should be changed, *Message Events* are thrown to trigger a process that handles changing the status.
* This process calls the `SetStatusDelegate` to update the status.
* For more info on *Message Events* and correlation in CIB 7, see [CIB 7 Docs: Message Events](https://docs.cibseven.org/manual/2.0/reference/bpmn20/events/message-events/).

###### Data-Driven Status Changes

* Which status is to set depends on data of the Document Model.
* This could be implemented by a *DMN Task* in the status handling process which operates on the document data.
* For example, the status should be set to 'in\_progress' if certain document fields are not empty anymore.

**Details for the data-driven case**

* An example for a process that uses *Message Events* to trigger a separate *Pool* which handles status changes is the [SetStatusDataDrivenProcess](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/bpmn/SetStatusDataDrivenProcess.bpmn).
* This process determines the status based on document data in a *DMN Task*: [DecideOnStatusToSet](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/bpmn/DecideOnStatusToSet.dmn).
* After the *Start Event*, a *Message Throw Event* occurs that correlates to the *Message* `STATUS_UPDATED`. This triggers the second *Pool* when [correlated](#anchor-correlation).
* The second *Pool*, when started, determines the status to set with the help of the *DMN Task* and then calls the `SetStatusDelegate` to update the status.
* This *Pool* is always executed in parallel to the other *Pool* — without interrupting, having `n` instances for `n` *Message Events* as the *Catch Event* is a *Start Event* here.
* The main *Pool* later throws another *Message Events* correlating to the same *Message* as before. This triggers another instance of the second *Pool*.
* The *DMN Task* operates on document data. In this example, we assume two annotated document fields: `approval` and `cost`. Those variables are passed in the correlation as explained in [How to Correlate Messages](#anchor-correlation). In this example, if an approval is given (`true`) and the cost are only 200, the `successStatus` is chosen.

![Example Process SetStatusDataDrivenProcess](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/setStatusDataDrivenProcess.png)

![Example decision table DecideOnStatusToSet](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/decideOnStatusToSet.png)

###### Process-Driven Status Changes

* Process-driven means the status depends on the path a process takes.
* The status handling process serves as a state diagram.
* For example, the status should be set to `IN_PROGRESS` after a certain *User Task*, or to `ACCEPTED` after a certain flow after a *Gateway* is taken.

**Details for the process-driven case**

* Another example of a process using *Message Events* to handle status changes is the [SetStatusStateDrivenProcess](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/bpmn/SetStatusStateDrivenProcess.bpmn).
* This process does not work with a *DMN Task*. Instead, the second *Pool* represents a state diagram.
* Therefore, each *Message Throw Event* correlates to a respective *Message Catch Event*, having `n` *Messages* instead of one like in the example above.
* After the *Start Event*, a *Message Event* throws the *Message* called 'STATUS\_INITIAL' to write the status 'INITIAL' into the document.
* The related *Message Catch Event* calls the ´SetStatusDelegate´ inside an *Execution Listener*. This is done instead of having a separate *Service Task* to reduce the amount of elements.
* The status is changed depending on the process path, which leads to only allowing valid state transitions.

  + For example, if the second *Pool* waits at the first *Message Catch Event* 'Status set initial', it is not possible to set the status to 'DECLINED'.
  + This is because even if the *Message* for setting the status to 'DECLINED' is thrown, it cannot be picked up because the second *Pool* is not ready to receive it.
  + The *Message* therefore would be lost, to ensure only valid status transitions.
* The correlation for *Messages* is explained in [How to Correlate Messages](#anchor-correlation).

![Example Process SetStatusStateDrivenProcess](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/setStatusStateDrivenProcess.png)

##### How to Correlate Messages

In CIB 7, *Messages* need to be correlated to send the *Message* to the correct recipient.

As *Message* correlation requires code, we provide an [*Element Template*](#anchor-provided-element-templates) for the *Message Throw Event*.

![_Element Template_ for Message Correlation](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/correlation_element_template.png)

To use it…​

1. Set the *Message* name to correlate as an input,
2. create a *Message Catch Event* with the same *Message* name.

|  |  |
| --- | --- |
|  | For sake of simplicity, this template forwards all *Process Variables* of the sending process to the receiving process. |

|  |  |
| --- | --- |
|  | The sending process must have a business key because this is used to correlate the *Message*. |

##### Adaptability

You can adjust these solutions in several ways:

* The separate *Pools* can be defined in separate BPMN models.
* The status can be determined in a *DMN Task* or *Service Task*.
* The dotted lines that link the *Message Events* are optional.

##### Alternative

An alternative is using *Conditional Events* to trigger a process handling the status change:

* Whenever a *Process Variable* is modified, the event is triggered.

  + As the *Process Variable* is the trigger here, it must be kept updated.
* For more info about *Conditional (Boundary) Events* in A12 Workflows, see [Conditional Boundary Events](#anchor-cbe).

![Example process StatusChangeOnDocumentProcess](https://geta12.com/docs/2025.06/ext5/workflows/ba-docs/assets/images/status-change-on-document-process.png)

## Glossary

| Term | Description |
| --- | --- |
| Decision table (from DMN) | See [CIB 7 Docs: DMN Table](https://docs.cibseven.org/manual/latest/reference/dmn/decision-table/) for more info. |
| Delegate | Delegates are pieces of code you can call from Service Tasks to be executed at a certain point in the process, passing process variables as input. |
| Delegate Expression | Delegate expressions are used for identifying the specific Delegate to be invoked (an expression for the delegate name). |
| Document Reference (docRef) | Unique identifier for a document, e.g. `Contract/143be3e9-32bc-4d57-a155-ba1f89eba93a`. |
| Element Template | Element templates are a way to extend the Camunda Modeler with domain-specific diagram elements, such as service and user tasks.  Applying an element template configures the diagram element with pre-defined values for BPMN properties, input/output mappings, and extension properties. |
| Event | Events in BPMN represent things that happen. A process can react to events (catching event) as well as emit events (throwing event).  For example, a catching message event makes the token continue as soon as a message is received. |
| Gateway | See [CIB 7 Docs: Gateways](https://docs.cibseven.org/manual/2.0/reference/bpmn20/gateways/) for more info. |
| Payload | All non-metadata fields in a Document Model. |
| Task | Tasks are the basic elements of BPMN processes. These are atomic units of work composed to create a meaningful result. |
| Task document | A document which has task-level metadata filled in (`/A12WF/Task` and `/A12WF/TaskDefinition`). |
| Process | A process defines steps which should happen in a specific order or flow.  The steps which make up a process are Tasks, Gateways, Events and Subprocesses. |
| Process document | A document which has process-level metadata filled in (`/A12WF/Process` and `/A12WF/ProcessDefinition`). |
| Subprocess | Subprocesses are element containers that allow defining common functionality. This allows you to create a "process within a process" that can be called multiple times. |
| Workflows metadata (or metadata) | All fields contained in our `WorkflowsMetadata_DM.json` model. |
