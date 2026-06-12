---
source: https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/index.html
category: overall
docid: modeling_tutorial_workflows
scraped: 2026-06-12
---

# Tutorial: Workflows Modeling

## Prerequisites

Before you start this tutorial, you should have completed the following training course(s) and tutorials.
For more details on what topics are covered, please follow the links.

* [A12 Fundamentals Training](https://geta12.com/#/trainings/training-ba-modeler#modeling-fundamentals-training)
* [Relationship Modeling Tutorial](https://geta12.com/docs/overall/modeling_tutorial_relationships/index.html)

|  |  |
| --- | --- |
|  | This tutorial describes the integration of BPMN and DMN Models with other A12 Models in your project.  For more information on BPMN and DMN Modeling, check out the links provided in the Workflows Documentation under [Further Resources](https://geta12.com/docs/workflows/ba-docs/index.html#further-resources). |

This tutorial focuses on the integration of BPMN models into your application using the Element Templates provides by Workflows and the relevant documentation is linked below.
The terminology used in this tutorial is explained in the documentation, but we’ve also included a glossary of terms:

* [Workflow Modeling documentation](https://geta12.com/docs/workflows/ba-docs/index.html)
* [Glossary in Workflows Documentation](https://geta12.com/docs/workflows/ba-docs/index.html#_glossary)

This tutorial uses the [installer](https://geta12.com/installer/) which you can download from geta12.com.

|  |  |
| --- | --- |
|  | Please ensure your installer version matches this tutorial. |

|  |  |
| --- | --- |
|  | This tutorial uses the Camunda Modeler provided in the installer.  Camunda Modelers from other sources may differ or need to be configured. See [Provided Element Templates](https://geta12.com/docs/workflows/ba-docs/index.html#anchor-provided-element-templates) in the Workflows Documentation for more information. |

## Use-case

I want to allow end users to complete a certification quiz.
Once they have completed the certification quiz, the quiz should be marked.
After the quiz has been marked, the mark should be visible with the certification quiz.

As markers sometimes make a mistake, the end user should be able to request that their quiz is re-marked.
When the quiz is re-marked, the marker should only see the certification quiz that the end user submitted.
Any previous marks should be hidden from the marker, so they are not influenced by them.

The end user can then complete the certification process by accepting the mark that they have received.

![Workflow Overview](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Workflow_Overview.png)

Figure 1. Use-case schema

## End Result

At the end of this tutorial, you will be able to deploy your models so that you can:

* Start a Workflows Process the controls the completion and marking of a Certification Quiz from an Overview
* Modify Document Models so that Certification and Marking Documents may be created and modified in the Process
* Modify Form Models so that they can be used to control the Process
* Use Delegates to automatically link Certification and Marking Documents
* Use Delegates to update a Status Field so that Validation Rules can be triggered based on the context

The end result will be similar to the with-workflows workspace.

If you need to check your work as you do the tutorial, please refer to the expandable sections at the end of each step:

**Click here to see what your project should look like by now**

You can find a list of models that you created as well as fullscreen pictures of each step to guide you.

## Essentials of Workflow Modeling

### What Can I Do With Workflows?

Workflows provides an integration of Business Process Model and Notation (BPMN) and Decision Model and Notation (DMN) capabilities into A12, enabling both the graphical modeling and the execution of server-side workflows.

When the BPMN Models are executed by the process engine the behavior of the application depends on the modeling choices that you expressed in the BPMN and DMN models.

This can include:

* Displaying the same Document using different Form Models depending on the current step of the process
* Determining the next step of the process based on Field Values in the Document
* Setting the status of a Document
* Managing Relationship Links between Documents

#### BPMN Models

The Camunda Modeler provided with the [installer](https://geta12.com/#/releases/installer) comes with Element Templates for:

* User Tasks
* Service Tasks
* Message Throw Events

These Element Templates simplify modeling so that the integration of BPMN Models with existing models is achievable without in-depth knowledge of BPMN Modeling with the Camunda Modeler.

##### User Tasks

User Tasks can be used to load a Document and display that Document in view defined by a Form Model.
This means that modelers can define the Fields, Validation Rules and Computation Rules for this Document as normal, in the Document Model.

When the Document is loaded in the Application, the UI that you see is defined by the Form Model.
As a result, all the features that you are familiar with in your application will be provided in the Workflows context per-default.

Button events that are used to move the process forward can also be used to trigger a Validation of the current data before the process leaves the Task.

##### Service Tasks

Service Tasks can be used to trigger Delegates.
A range of Delegates are provided by Workflows that allow you to perform different tasks automatically:

* Create and modify Documents
* Create, modify and delete Relationship Links
* Read Field Values and write them into process variables
* Send Emails

These Delegates can be modeled using an Element Template specifically designed for the Delegate that you choose.

|  |  |
| --- | --- |
|  | Modifying the value of a status Field allows you to create a range of effects.  * This status can be referenced in Validation or Computation Rules that you model so that Rules can only be triggered when the status Field has a specific value. * This status can be used for Attribute-Based Access Control (ABAC). |

##### Message Throw Events

An Element Template is provided for Message Throw Events to allow a Message that contains all process variables to be quickly modeled.

##### Exclusive Gateways

As Field Values can be written into process variables, this means that the next step in the process can depend on Field Values (and other process variables).

#### DMN Models

DMN Decision Tables provide the logic for evaluating process variables.
By writing Field Values into process variables using a Workflows Delegate, you can effectively reference Field Values from your Document in DMN Models.

This can be used in a number of different ways, for example:

* The Document status depends on the current status Field Value (and other process variables)
* The next step in the process depends on Field Values (and other process variables)

|  |  |
| --- | --- |
|  | Process Variables can be combined from a wide range of sources and services |

### How Can I Apply Workflows to Different Use-Cases?

Workflows can be applied to any use-case where well-defined business processes should be executed.

Workflows provide Delegates and Element Templates that cover a range of standard integration requirements.
This means that the majority of business processes can be easily integrated into your application.

|  |  |
| --- | --- |
|  | Using Workflows **does not** lead to any restriction on the Model Elements can be used in the BPMN Models.  However, certain combinations of Model Elements need to be used with care as documented in [Current BPMN Limitations](https://geta12.com/docs/workflows/ba-docs/index.html#Modeling-limitations). |

Workflows currently allows integration of the following A12 Models into a process:

* Document Models

  + including Heterogeneous Subtypes
* Form Models
* Overview Models
* Relationship Models
* Composed Document Models (CDMs)

  + including Form and Overview Models that reference CDMs

### What Do Workflows Look Like in the UI?

Workflows provide a TaskList View that can be used in the Application Model.
The TaskList allows Workflows specific Events to be used.

In addition, the Documents shown in an Overview in the TaskList View will be filtered based on the following criteria:

* Documents must be used in an incomplete process
* The process must be waiting at a User Task

This means that Documents are only shown in an Overview in the TaskList View when the end user needs to work on them.

The Form Model that will be used to display the Document will be determined by the Process logic defined in the BPMN Model.

#### Example

Let’s consider a process where invoices are prepared for customers:

* The billing department knows the customer’s details.
* The workman knows what services were provided.
* A supervisor needs to check the invoice

Three different Documents of the same type are visible in the Overview as they are waiting at different User Tasks in the process.

Table 1. Documents in the Overview


| Document Model | Document ID | User Task | Form Model Referenced in Task |
| --- | --- | --- | --- |
| Invoice\_DM | Invoice\_DM/11 | Enter Customer Details | Invoice\_CustomerDetails\_FM |
| Invoice\_DM | Invoice\_DM/22 | Enter Services Provided | Invoice\_Services\_FM |
| Invoice\_DM | Invoice\_DM/33 | Review Invoice | Invoice\_Review\_FM |

Clicking on each Document caused a different Form Models to be rendered which is specific for the Task that needs to be completed.

### How Do Workflows Compare to Other A12 Models?

In general, Workflows allow the integration of new model types, BPMN and DMN models, into your application.
As such it is not easy to compare Workflows to other A12 Models.

The following table highlights where similar functionality can be found in A12 Models

Table 2. Workflows Functionality in other A12 Models


| Workflows Functionality | Comparable A12 Functionality | Model | Comparison |
| --- | --- | --- | --- |
| Event - startProcess | Event - add | Overview Model | "startProcess" starts a new process instance in the process engine.  When the process contains a Task that uses "User Task Creating A New Document" or "Create Document Delegate Template", "startProcess" works similarly to "add" as a new Document will be created which can be displayed in the Overview.  In contrast to "add", the Form will not be opened per-default. |
| Event - proceed | Event - event\_submit | Form Model | Like "event\_submit", "proceed" saves the Document and closes the current Form Model scene.  "proceed" causes the process to leave the User Task. |
| setStatusDelegate | Initial Value or Dependent Fields | Form Model | Like Initial Value or Dependent Fields, the setStatusDelegate can set the Value of a non-computed Field.  However, Initial Values are limited to new Documents and Dependencies need to be triggered by a Field Value change in the Form.  The setStatusDelegate changes the Field Value directly in the Database. As a result, this value is already set to the desired value when the Document is loaded into the Form. |
| Delegates for Relationship Links | Bindings | Form Model | Bindings allow Relationship Links to be manually managed in a Form by the end user.  The Delegates for Relationship Links allow Relationship Links to be modified via a process. |
| DMN Decision Tables | Computation Tables | Document Model | Like Computation Tables, DMN Decision Tables describe the conditions under which a certain result should be returned.  In contrast to Computation Rules which can only reference Fields and Field Values from the current Document Model, DMN Decision Tables reference process variables that can be created from a wide range of sources and services. |
| User Task Form keys | Match Conditions | Application Model | Match Conditions define which (Form) Model should be used in the current activity.  User Task Form keys allow the Form Model to be specified for each User Task in the Process.  As a result, different Form Models can be loaded for the same Document in the same activity under the same Match Conditions. |

## Step-by-Step Instructions

### Step 1: Plan Your Workflow

When planning the Workflow that you want to add to your application, the integration of the BPMN and DMN Models with other Models must be considered.

For example, when you add a User Task to your BPMN diagram, you will need to model:

* A Document Model

  + Fields for Workflows Metadata
* A Form Model

  + A Form Model Event to complete the User Task

|  |  |
| --- | --- |
|  | When using the Preview App, the file structure in your workspace is important. All models should be created in a folder called "models".  BPMN and DMN Models should be added to a subfolder of "models" called "workflows". |

|  |  |
| --- | --- |
|  | From Step 2 onwards, BPMN Model is built up step-by-step to allow each new feature to be tested in the Preview Application.  The intermediate BPMN Models therefore show fewer model elements than planned.  See [How to Test and Troubleshoot Your Models](#Workflows_TestAndTroubleshoot) for more details on how to test your models. |

#### Step 1a: Certification Process

![End Result Certification](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/End_Result_Certification.png)

Figure 2. BPMN Model of the Certification Process

Based on the requirements stated in the [Use-case](#Workflows_usecase) the Certification process contains:

* A User Task to take the Certification Test
* A User Task to check the Marks that were given
* Message Events to communicate with the [Step 1c: Marking Process](#Workflows_step1_Marking)
* Service Tasks to update a Status Field

  |  |  |
  | --- | --- |
  |  | This is similar to using a State Machine |

  + Users can see the status of their process
  + Validation Rules can reference this Status Field

Table 3. Models and Model Elements in the Certification Process


| Model Type and Name | Key Model Elements | Notes |
| --- | --- | --- |
| BPMN | Certification | User Task | Take Certification Test | Create a new document to persist data |
| User Task | Final Decision | Access an existing document |
| Message Event | Pass information on the document that is being worked on |
| Call Activity | Set Status | Update Field Value, see [Step 1b: Status Change Process](#Workflows_step1_Status) |
| Document Model | Certification\_DM | Certification Test Questions | Fields need to be added so the user can enter their answers |
| Status Field | Match Field Values between the Service Task and Data Type Configuration  Ensure Status Field is visible to the Workflows process  3 Status Field Values are planned |
| Workflows Meta Data | Technical Fields must be added |
| Form Model | Certification\_FM | Controls | Controls must be added to enter answers |
| Event | The User Task must be completed |
| Form Model | CertificationMarked\_FM | Binding | The data from the linked Marking Document must be visualized |
| Event | The User Task must be completed |
| Event | A message may be sent to request re-marking |
| Overview Model | CertificationTaskList\_OM | Columns | Display Field Values from the Documents lists |
| Event | The Document must be created and the Workflows process started |

#### Step 1b: Status Change Process

![End Result Status](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/End_Result_Status.png)

Figure 3. BPMN Model of the Status Change Process

The Status process allows a Field in the Document Model to be updated with a new value.
This Field value can then be displayed to the end user so that they can see whether their certification test is waiting to be marked, marked or accepted.

As a result, the Status process contains:

* A Service Task to synchronize the process variables with the Field values in the Document
* A Business Rule Task to determine the new Status Field value
* A Service Task to update a Status Field

|  |  |
| --- | --- |
|  | Separating the [Step 1b: Status Change Process](#Workflows_step1_Status) from the [Step 1a: Certification Process](#Workflows_step1_Certification) simplifies the Certification process and helps readability. |

Table 4. Models and Model Elements in the Certification Process


| Model Type and Name | Key Model Elements | Notes |
| --- | --- | --- |
| BPMN | Marking | Service Task | Sync Fields | Update process variables value using values from Fields in the Document Model with the annotation `availableInProcessAs` |
| Business Rule Task | Decide Status (Optional) | Evaluate the process variables based on a DMN Table and output the new Status Field value |
| Service Task | Set Status | Update Field Value |
| DMN (Optional) | Decision Table | Decision Status | Decision Logic to determine the new Status Field Value |

|  |  |
| --- | --- |
|  | The Document Reference will be passed to the Service Process when it is called.  The Document Models and Documents will be created in separate processes. |

#### Step 1c: Marking Process

![End Result Marking](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/End_Result_Marking.png)

Figure 4. BPMN Model of the Marking Process

The Marking Process allows the user to view some data from the linked Certification Document and then give a mark.
As a result, the Marking Process contains

* A Service Task to create a new Marking Document
* Service Tasks to link the Marking Document with the Certification Document
* Service Tasks to update a Status Field
* A User Task to give the mark
* Message Events to communicate with the [Step 1a: Certification Process](#Workflows_step1_Certification)

Table 5. Models and Model Elements in the Marking Process


| Model Type and Name | Key Model Elements | Notes |
| --- | --- | --- |
| BPMN | Marking | Service Task | Create Approval Doc | Create a new document to persist data |
| Service Task | Create Link to History (Optional) | 1:n Relationship that allows multiple Marking Documents to be linked with the Certification Document |
| Service Task | Link Approval Doc | 1:1 Relationship that allows one Marking Documents to be linked with the Certification Document |
| Service Task | Re-Link Mark | Replace the currently linked Marking Document with a new Document |
| Service Task | Set Status | Update Field Value |
| User Task | Give a Mark | Access an existing document and update it |
| Message Event | Pass information on the document that is being worked on |
| Document Model | Mark\_DM | Marks | Fields need to be added so the user can enter the mark that the Certification Test should receive |
| Status Field | Match Field Values between the Service Task and Data Type Configuration  Ensure Status Field is visible to the Workflows process  1 Status Field Value is planned |
| Validation Rule | Ensure that a Mark is given |
| Workflows Meta Data | Technical Fields must be added |
| Form Model | Mark\_FM | Controls | Controls must be added to enter marks |
| Event | The User Task must be completed |
| Overview Model | MarkTaskList\_OM | Columns | Display Field Values from the Documents lists |
| Relationship Model | CertificationMark | 1:1 Relationship between Mark\_DM and Certification\_DM | Link the Mark Document with the respective Certification Document that was created to the in the [Step 1a: Certification Process](#Workflows_step1_Certification) |
| Relationship Model | CertificationMark (Optional) | 1:n Relationship between Mark\_DM and Certification\_DM | Link multiple Mark Documents with the respective Certification Document that was created to the in the [Step 1a: Certification Process](#Workflows_step1_Certification) |

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

![End Result](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/End_Result.png)

Figure 5. BPMN Model to Be Used in Final Step

### Step 2: Start a Workflow Process

In this Step we will create an executable process so that you can:

* Start a Task
* Create a new Document
* Edit the Document in a User Task

in the Preview App.

#### Step 2a: Model an Executable Process

![Step2 1 ExecutableProcess](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_1_ExecutableProcess.png)

Figure 6. Setting the Process to be "Executable"

|  |  |
| --- | --- |
|  | All BPMN and DMN Models are added to a subfolder of "models" called "workflows" so to ensure that this workspace is compatible with the Preview App. |

* Create a new BPMN Model in the Camunda Modeler.
* Add a Pool to the BPMN Model as planned in Step 1, [Step 1a: Certification Process](#Workflows_step1_Certification).
* Click on the Pool.

  + Check the "Executable" checkbox.
  + Set the "Process ID" to a semantic name with no underscores.
    We will set it to "Certification".

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["Start a Process From an Overview"](https://geta12.com/docs/workflows/ba-docs/index.html#start-process-overview). |

#### Step 2b: Create a New Document in the User Task

![Step2 2 UserTask](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_2_UserTask.png)

Figure 7. Applying the "User Task Creating A New Document" Template to a User Task

* Use the Simple Model Editor to model Certification\_DM as planned in Step 1, [Step 1a: Certification Process](#Workflows_step1_Certification).

  + Model at least one Field that represents a certification question.
  + (Optional) Add more Fields and Validation Rules to make a complex certification quiz.
* Use the Simple Model Editor to model Certification\_FM as planned in Step 1, [Step 1a: Certification Process](#Workflows_step1_Certification).

  + (Optional) Use the "Build Screens From Fields" to quickly create a Form Model which references all Fields in Certification\_DM.
* Switch to the Camunda Modeler.
* Add a User Task to the Flow in the Certification Pool.

  + Add a Task to the BPMN Model.
  + Use the settings to change the element to a User Task.
* Add the "User Task Creating A New Document" Template.

  + Click on the User Task.
  + Click "Select" in the "Template" section of the Properties Panel.
  + Select the "User Task Creating A New Document" Template from the list provided.
* Configure the User Task by adding the Output Document Reference.

  + Let’s call the Process Variable for the Document Reference, "NewCertification" by entering "NewCertification" in the field labeled "Process Variable Name For New Document Reference".
* Reference your Form Model in the "Forms" section.

  + Select "Embedded or External Task Forms" in the "Type" field.
  + Copy the Form Model name, "Certification\_FM", into the "Form key" field.
* Save your BPMN Model.

|  |  |
| --- | --- |
|  | If you cannot assign the template, please check the [Tutorial prerequisites](#Workflows_prerequisites). |

|  |  |
| --- | --- |
|  | Copy and Paste references to A12 Models to avoid typos. |

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["User Task Creating A New Document"](https://geta12.com/docs/workflows/ba-docs/index.html#user-task-new-doc). |

#### Step 2c: Add Workflows Metadata Fields to Document Model

![Step2 3 WFMetadata](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_3_WFMetadata.png)

Figure 8. Including Workflows Metadata

* Add the Workflows Metadata to your workspace.

  + Download the Workflows Metadata from the
    [Workflows Documentation](https://geta12.com/docs/workflows/ba-docs/index.html#anchor-metadata-include).
  + Move the Workflows Metadata file into the "models" folder of your workspace.
  + Switch to the Simple Model Editor.
  + Click on "Reload Workspace" in the "Workspace Explorer" of your Simple Model Editor.
* Open WorkflowsMetadata\_DM and check the "Roles" displayed in "Settings" match those that you are using in your Workspace
* Include the Workflows Metadata in Certification\_DM.

  + Open Certification\_DM in the Simple Model Editor.
  + Right-click or use the "Open Menu" Button to add an Include to a Group.
  + Select "WorkflowsMetadata\_DM" as the "Document Model".
  + Apply the changes and Save the Document Model.

|  |  |
| --- | --- |
|  | As we are referencing this Document Model in a Relationship Model, the Include may **not** be added to the Document Model root. |

|  |  |
| --- | --- |
|  | The include must be called exactly A12WF.  This is the default name when adding the Include. You should **not** change the "Name" of the Include. |

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["Metadata Include"](https://geta12.com/docs/workflows/ba-docs/index.html#anchor-metadata-include). |

#### Step 2d: Add "proceed" Action to Form Model

![Step2 4 FMProceed](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_4_FMProceed.png)

Figure 9. Modeling a "proceed" Button Event

* Open Certification\_FM in the Simple Model Editor.
* Add a Button to the Footer.

  + Click on "Settings".
  + Select the "Subheader and Footer" tab.
  + Add a Button to the Footer.
* Configure the Button.

  + Enter a "Name" and select the "Event" in "Button Functions", "Type".
  + Click on "Button Functions", "Event" and type "proceed" into the Field.
  + Continue modeling the Button as normal.
  + Apply the changes and Save the Form Model.

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["Complete a User Task"](https://geta12.com/docs/workflows/ba-docs/index.html#anchor-proceed-event). |

#### Step 2e: Add "startProcess\_<ProcessID>" Action to Overview Model

![Step2 5 OMStartProcess](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_5_OMStartProcess.png)

Figure 10. Modeling a "startProcess" Button Event

* Use the Simple Model Editor to model CertificationTaskList\_OM as planned in Step 1, [Step 1a: Certification Process](#Workflows_step1_Certification).

  + Model at least one Column that references a Field Value.
  + (Recommended) Add Columns that reference Metadata Fields.

    - Task ID
    - Creation Date
* Add a Button to the Subheader.

  + Click on "Custom Actions".
  + Add a Button to the Subheader.
* Configure the Button.

  + Select "Button" in "Action Type".
  + Click on "Button Functions", "Event" and type "startProcess\_Certification" into the Field.
  + Continue modeling the Button as normal.
  + Apply the changes and Save the Overview Model.

|  |  |
| --- | --- |
|  | The Button event syntax is `startProcess_<PROCESS_ID>`.  The `<PROCESS_ID>` must exactly match the Process ID that you defined in [Step 2a: Model an Executable Process](#Workflows_step2a) |

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["Start a Process From an Overview"](https://geta12.com/docs/workflows/ba-docs/index.html#start-process-overview). |

#### Step 2f: Add Task List to Application Model

![Step2 6 AMTaskList](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_6_AMTaskList.png)

Figure 11. Adding the Module to the Application Model

* Open PreviewApp\_AM in the Simple Model Editor.
* Add a Module by clicking "Add" in the "Modules" section.

  + Enter a "Name" for the Module and the "Menu".
  + Add the following Activity Descriptor:

    ```
    {
      "view": "TaskList",
      "model": "Certification_DM",
      "module": "CertificationTaskList"
    }
    ```
  + Add Labels for each locale.
* Add a Flow by clicking "Add" in the "Flow" section.

  + Enter "TaskFlow" as the "Name".
* Add the Overview Scene by clicking "Add" in the "Scenes" section.

  + Enter a "Name" for the Scene.
  + Add Match Conditions that match the Activity Descriptor above:

    Table 6. Match Conditions for Overview Scene


    | Key | Must Equal | Is Set |
    | --- | --- | --- |
    | model | Certification\_DM |  |
    | module | CertificationTaskList |  |
    | instance |  | false |
* Add two Scene Changes by clicking "Add" in the "On Enter" section.

  1. Add a Scene Change and select "REGION\_CLEAR" in "Type".

     + Enter "MasterDetail" in the "Layout" "Name".
  2. Add a Scene Change and select "VIEW\_ADD" in "Type".

     + Enter "OverviewEngine" in the "Name".
     + Click "Add" in the "Models" section.
     + Select "Overview" as the "Model Type".
     + Select "CertificationTaskList\_OM" as the "Name".
     + Apply all the changes and Save the Application Model.

|  |  |
| --- | --- |
|  | The Task List will display Documents from running Process Instances where the Process Instance is waiting at a User Task.  All other Documents that reference the Certification\_DM will be filtered out and not displayed. |

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["Overview Scene"](https://geta12.com/docs/workflows/ba-docs/index.html#anchor-overview-scene). |

#### Step 2g: Enable Workflows in the Preview Application

![Step2 7 workspace](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_7_workspace.png)

Figure 12. Enabling Workflows in "workspace.json"

* Open your Workspace in your File Explorer.
* Open the File "workspace.json".

  |  |  |
  | --- | --- |
  |  | "workspace.json" is created automatically when you create a new Workspace using the Preview App Control.  "workspace.json" is saved as a sibling of the "models" folder. |
* Add "enableWorkflows": true to file so that the contents of "workspace.json" is as follows:

  ```
  {
      "enableWorkflows": true
  }
  ```

|  |  |
| --- | --- |
|  | You can save all your models and start testing what you have modeled so far. See [How to Test and Troubleshoot Your Models](#Workflows_TestAndTroubleshoot) for more details. |

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

BPMN Model, Certification\_DM, Certification\_FM, CertificationTaskList\_OM, PreviewApp\_AM

![Step2StartAWorkflowProcess](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2StartAWorkflowProcess.png)

Figure 13. BPMN Model With a Single User Task

![Step2 Pool](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_Pool.png)

Figure 14. Certification Pool in BPMN Model

![Step2 UserTask](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_UserTask.png)

Figure 15. "User Task Creating A New Document" Creating the New Document at the Start of the Process

![Step2 CertificationDM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_CertificationDM.png)

Figure 16. Certification\_DM

![Step2 CertificationFM 1](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_CertificationFM_1.png)

Figure 17. Subheader and Footer on Certification\_FM

![Step2 CertificationFM 2](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_CertificationFM_2.png)

Figure 18. proceed Event in Subheader and Footer on Certification\_FM

![Step2 CertificationOM 1](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_CertificationOM_1.png)

Figure 19. CertificationTaskList\_OM

![Step2 CertificationOM 2](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_CertificationOM_2.png)

Figure 20. Custom Actions on CertificationTaskList\_OM

![Step2 CertificationOM 3](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_CertificationOM_3.png)

Figure 21. startProcess Event in Custom Actions on CertificationTaskList\_OM

![Step2 PreviewApp AM 1](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_PreviewApp_AM_1.png)

Figure 22. PreviewApp\_AM

![Step2 PreviewApp AM 2](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_PreviewApp_AM_2.png)

Figure 23. Module on PreviewApp\_AM

![Step2 PreviewApp AM 3](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_PreviewApp_AM_3.png)

Figure 24. Flow in Module on PreviewApp\_AM

![Step2 PreviewApp AM 4](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_PreviewApp_AM_4.png)

Figure 25. Scene in Flow in Module on PreviewApp\_AM

![Step2 PreviewApp AM 5](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_PreviewApp_AM_5.png)

Figure 26. REGION\_CLEAR Scene Change in Scene in Flow in Module on PreviewApp\_AM

![Step2 PreviewApp AM 6](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_PreviewApp_AM_6.png)

Figure 27. VIEW\_ADD Scene Change in Scene in Flow in Module on PreviewApp\_AM

![Step2 workflowsjson](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step2_workflowsjson.png)

Figure 28. workflows.json in the Workspace Folder

### Step 3: Update Status

In this step we will use Service Tasks to update the status of our Document automatically.

This is required if you want to use the Context-Based Validation Rules that we plan to add in [Step 6](#Workflows_step6).

#### Step 3a: Model a Call Activity for Status Updates

![Step3 1 UpdateStatus](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step3_1_UpdateStatus.png)

Figure 29. Modeling a Call Activity

* Switch to the Camunda Modeler.
* Model an executable Status Change Process as planned in [Step 1b: Status Change Process](#Workflows_step1_Status).

  + (Optional) Create a new BPMN Model for the Status Change Process.
  + Add a Pool for the Status Change Process.
  + Click on the Pool.

    - Check the "Executable" checkbox.
    - Set the "Process ID" to a semantic name with no underscores.
      We will set it to "StatusChange".
* Add a Call Activity to the Flow in the Certification Pool.

  + Add a Task to the BPMN Model.
  + Use the settings to change the element to a Call Activity.
  + Add the following setting to the "Called element" section of the Properties Panel.

    - Select "BPMN" as the "Type".
    - Add the Status Change Process ID, "StatusChange" to the "Called element" field.
    - Pass the Process Variable "NewCertification" that we created in [Step 2b: Create a New Document in the User Task](#Workflows_step2b) to the Status Change Process by either selecting "Propagate all variables" or by using "In Mappings".
* Save your BPMN Model.

#### Step 3b: Make Fields Available to Process

![Step3 2 Annotations](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step3_2_Annotations.png)

Figure 30. Annotating Fields

* Switch to the Simple Model Editor and open Certification\_DM.
* Add a Status Field to the Document Model as planned in, [Step 1a: Certification Process](#Workflows_step1_Certification).

  |  |  |
  | --- | --- |
  |  | As the Set Status Process will be called three times in the final process, I recommend modeling an Enumeration Field with at least three different values. |
* Add an annotation to the Status Field.

  + Click "Add" in the "Annotations" section of the Field Editor.
  + Enter "availableInProcessAs" as the "Name".
  + Enter "CertificationStatus" as the "Value".
* (Optional) Add Annotations to any other Fields that should be synchronized.
* Apply the changes and Save the Document Model.

|  |  |
| --- | --- |
|  | The Value of the Status Field will now be saved as a Process Variable with the Name "CertificationStatus" under a range of conditions.  Please check the documentation for more information. |

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["Synchronize Field Values"](https://geta12.com/docs/workflows/ba-docs/index.html#anchor-cbr-synchronize-values). |

#### Step 3c: Sync Field Values to Process Variables

![Step3 3 SyncFields](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step3_3_SyncFields.png)

Figure 31. Applying the "Sync Available Fields Delegate Template" to a Service Task

* Add the Service Task to Sync the Field Values as planned in [Step 1b: Status Change Process](#Workflows_step1_Status).

  + Add a Task to the BPMN Model.
  + Use the settings to change the element to a Service Task.
* Add the "Sync Available Fields Delegate Template".

  + Click on the Service Task.
  + Click "Select" in the "Template" section of the Properties Panel.
  + Select the "Sync Available Fields Delegate Template" from the list provided.
* Configure the Service Task by adding our Document Reference.

  + Reference the Process Variable, NewCertification, as an expression by entering "${NewCertification}".

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["Sync Available Fields Delegate Template"](https://geta12.com/docs/workflows/ba-docs/index.html#sync-available-fields-delegate-template). |

#### Step 3d: Set Status Field Value

![Step3 4 SetStatusTemplate](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step3_4_SetStatusTemplate.png)

Figure 32. Applying the "Set Status Delegate Template" to a Service Task

* Add the Service Task to Set the Status as planned in [Step 1b: Status Change Process](#Workflows_step1_Status).

  + Add a Task to the BPMN Model.
  + Use the settings to change the element to a Service Task.
* Add the "Set Status Delegate Template".

  + Click on the Service Task.
  + Click "Select" in the "Template" section of the Properties Panel.
  + Select the "Set Status Delegate Template" from the list provided.
* Configure the Service Task by adding the following information.

  + Reference the Process Variable, NewCertification, as an expression by entering "${NewCertification}" to the "Document Reference".
  + Enter the "New Value" as a String (fixed value) or an Expression (see optional DMN Modeling).
  + Copy the Status Field Path from the Document Model and paste it into the "Path to Field".
* (Optional) Model a DMN Model and add a Business Rule Task to determine the Status Field Value.

  + Use the Process Variables you have including the Field Values that you have just synchronized to determine the new Field Value.
  + Output a Result Variable to be used in the "New Value" setting of the Service Task.
* Save your BPMN Model.

|  |  |
| --- | --- |
|  | Adding the optional Business Rule Task and DMN Model will make [Step 6](#Workflows_step6) quicker and easier. |

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["Set Status Delegate Template"](https://geta12.com/docs/workflows/ba-docs/index.html#set-status-delegate-template). |

|  |  |
| --- | --- |
|  | You can save all your models and start testing what you have modeled so far. See [How to Test and Troubleshoot Your Models](#Workflows_TestAndTroubleshoot) for more details. |

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

No new models

![Step3UpdateStatus](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step3UpdateStatus.png)

Figure 33. BPMN Model With Separate Process for Status Updates

![Step3 Sync](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step3_Sync.png)

Figure 34. "Sync Available Fields Delegate Template" in Status Change Process

![Step3 CertificationDM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step3_CertificationDM.png)

Figure 35. Status Field on Certification\_DM

![Step3 DMN](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step3_DMN.png)

Figure 36. Optional DMN Model to Determine the Status Field Value Using Two Synchronized Field Values

![Step3 BusinessRule](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step3_BusinessRule.png)

Figure 37. Optional Business Rule Task to Output the New Status Field Value as a Process Variable

![Step3 BPMN](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step3_BPMN.png)

Figure 38. "Set Status Delegate Template" Referencing Process Variable from Optional DMN Model

### Step 4: Trigger Marking Process

In this step we will use Message Events to automatically trigger a second process when the Certification reaches a certain point.

|  |  |
| --- | --- |
|  | You have already performed many of the modeling steps needed to complete this step in [Step 2](#Workflows_step2). As a result, the step-by-step guide in this section will focus on the modeling steps that are new or different. |

#### Step 4a: Model Throw and Catch Events

![Step4 1 ThrowEvent](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step4_1_ThrowEvent.png)

Figure 39. Applying the "Template For Message Throw Event" to a Message Throw Event

* Add the Message Intermediate Throw Event to Certification as planned in [Step 1a: Certification Process](#Workflows_step1_Certification).

  + Add an Intermediate Event to the BPMN Model.
  + Use the settings to change the element to a Message Intermediate Throw Event.
* Add the "Template for Message Throw Event".

  + Click on the Message Intermediate Throw Event.
  + Click "Select" in the "Template" section of the Properties Panel.
  + Select the "Template for Message Throw Event" from the list provided.
* Configure the Message Throw Event.

  + Enter a "Message Name to correlate" in the "Inputs" section of the Properties Panel.
    Let’s enter "ToMarking" into the "Value" field.

    |  |  |
    | --- | --- |
    |  | This Template throws all the current Process Variables as part of the Message.  As a result, the Process Variable, "NewCertification", will be present in the Marking Process. This will be useful in [Step5](#Workflows_step5) when we want to link the two documents. |

Adding a Message Intermediate Catch Event will cause the Certification Process to wait until it receives the message to proceed.

|  |  |
| --- | --- |
|  | Process instances that are waiting at a User Task are visible in the Task Overview that you modeled in [Step 2](#Workflows_step2).  Process instances that are waiting at any other BPMN Model element will not be displayed in the Task Overview. |

* Add the Message Intermediate Catch Event to Certification as planned in [Step 1a: Certification Process](#Workflows_step1_Certification).

  + Add an Intermediate Event to the BPMN Model.
  + Use the settings to change the element to a Message Intermediate Catch Event.
* Configure the Message Catch Event.

  + Select "Create new…​" as the "Global message reference" in "Message" section of the Properties Pane.
  + Let’s enter "FromMarking" into the "Name" field.

We can now repeat these steps for the Message Events planned in [Step 1c: Marking Process](#Workflows_step1_Marking).

* Model an executable Marking Process.

  + (Optional) Create a new BPMN Model for the Marking Process.
  + Add a Pool for the Marking Process.
  + Click on the Pool.

    - Check the "Executable" checkbox.
    - Set the "Process ID" to a semantic name with no underscores.
      We will set it to "Marking".
* Model the Message Start Event in the Marking Process.

  + Add the "ToMarking" as the "Message Name" to match the Message Intermediate Throw Event from the Certification Process.
* Model the Message Intermediate Throw Event using the "Template for Message Throw Event" in the Marking Process.

  + Enter "FromMarking" in the "Message Name to correlate" in the "Inputs" section of the Properties Panel.
    This name matches the Message Intermediate Catch Event from the Certification Process.

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["Template For Message Throw Event"](https://geta12.com/docs/workflows/ba-docs/index.html#message-event-template). |

#### Step 4b: Add a Task to Create a Document

![Step4 2 CreateDocTemplate](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step4_2_CreateDocTemplate.png)

Figure 40. Applying the "Create Document Delegate Template" to a Service Task

The Document, Form and Overview Model should be modeled as planned in [Step 1c: Marking Process](#Workflows_step1_Marking).

* Switch to the Simple Model Editor.
* Model Mark\_DM.
* Model Mark\_FM.

  + Add the proceed Action on the Form as you did in [Step 2d: Add "proceed" Action to Form Model](#Workflows_step2d).
* Model Mark\_OM.

|  |  |
| --- | --- |
|  | As we are starting the new process instance using a Message Start Event, you do **not** need to model the startProcess Event that you did previously. |

Now that the preparation is done, we can integrate these models into the Workflow.

* Switch to the Camunda Modeler.
* Add the Service Task to Create the Approval Document as planned in [Step 1c: Marking Process](#Workflows_step1_Marking).

  + Add a Task to the BPMN Model.
  + Use the settings to change the element to a Service Task.
* Add the "Create Document Delegate Template".

  + Click on the Service Task.
  + Click "Select" in the "Template" section of the Properties Panel.
  + Select the "Create Document Delegate Template" from the list provided.
* Configure the Service Task by adding the following information.

  + Reference the Document Model by entering "Mark\_DM" as the "Document Model Name".
  + Let’s call the Process Variable for this new Document, "NewMark" by entering "NewMark" in the field labeled "Process Variable Name For New Document Reference".

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["Create Document Delegate Template"](https://geta12.com/docs/workflows/ba-docs/index.html#create-document-delegate-template). |

#### Step 4c: Modify the Existing Document in a User Task

![Step4 3 UserTask](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step4_3_UserTask.png)

Figure 41. Applying the "User Task With Input Document" Template to a User Task

* Add the User Task to Give a Mark.

  + Add a Task to the BPMN Model.
  + Use the settings to change the element to a User Task.
* Add the "User Task With Input Document" Template.

  + Click on the User Task.
  + Click "Select" in the "Template" section of the Properties Panel.
  + Select the "User Task With Input Document" Template from the list provided.
* Configure the User Task by adding the Input Document Reference.

  + Reference the Process Variable, NewMark, as an expression by entering "${NewMark}".
* Reference your Form Model in the "Forms" section.

  + Select "Embedded or External Task Forms" in the "Type" field.
  + Copy the Form Model name, "Mark\_FM", into the "Form key" field.
* Save your BPMN Model.

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["User Task With Input Document"](https://geta12.com/docs/workflows/ba-docs/index.html#user-task-existing-doc). |

#### Step 4d: Add Task List to Application Model

![Step4 4 AMTaskList](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step4_4_AMTaskList.png)

Figure 42. Adding the Module to the Application Model

Adding the Task List for the Marking Process is very similar to the steps that you followed in [Step 2f: Add Task List to Application Model](#Workflows_step2f).

|  |  |
| --- | --- |
|  | Copying the existing Task might save some time as the Modules are so similar. If you do this, make sure to adapt:  * Module Names and Labels * Activity Descriptor * Scene Name and Match Conditions * Overview Model in the VIEW\_ADD Scene Change |

* Open PreviewApp\_AM in the Simple Model Editor.
* Add a Module by clicking "Add" in the "Modules" section.

  + Enter a "Name" for the Module and the "Menu".
  + Add the following Activity Descriptor:

    ```
    {
      "view": "TaskList",
      "model": "Mark_DM",
      "module": "MarkTaskList"
    }
    ```
  + Add Labels for each locale.
* Add a Flow by clicking "Add" in the "Flow" section.

  + Enter "TaskFlow" as the "Name".
* Add the Overview Scene by clicking "Add" in the "Scenes" section.

  + Enter a "Name" for the Scene.
  + Add Match Conditions that match the Activity Descriptor above:

    Table 7. Match Conditions for Overview Scene


    | Key | Must Equal | Is Set |
    | --- | --- | --- |
    | model | Mark\_DM |  |
    | module | MarkTaskList |  |
    | instance |  | false |
* Add two Scene Changes by clicking "Add" in the "On Enter" section.

  1. Add a Scene Change and select "REGION\_CLEAR" in "Type".

     + Enter "MasterDetail" in the "Layout" "Name".
  2. Add a Scene Change and select "VIEW\_ADD" in "Type".

     + Enter "OverviewEngine" in the "Name".
     + Click "Add" in the "Models" section.
     + Select "Overview" as the "Model Type".
     + Select "MarkTaskList\_OM" as the "Name".
     + Apply all the changes and Save the Application Model.

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["Overview Scene"](https://geta12.com/docs/workflows/ba-docs/index.html#anchor-overview-scene). |

|  |  |
| --- | --- |
|  | You can save all your models and start testing what you have modeled so far. See [How to Test and Troubleshoot Your Models](#Workflows_TestAndTroubleshoot) for more details. |

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

Mark\_DM, Mark\_FM, MarkTaskList\_OM

![Step4TriggerMarking](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step4TriggerMarking.png)

Figure 43. BPMN Model With Message Events to Trigger the Marking Process

![Step4 Throw](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step4_Throw.png)

Figure 44. "Template For Message Throw Event" to Trigger Marking Process

![Step4 Catch](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step4_Catch.png)

Figure 45. Message Catch Event at the Start of the Marking Process

![Step4 ServiceTask](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step4_ServiceTask.png)

Figure 46. "Create Document Delegate Template" to Create the Marking Document

![Step4 UserTask](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step4_UserTask.png)

Figure 47. "User Task With Input Document" to Give the Mark

![Step4 MarkDM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step4_MarkDM.png)

Figure 48. Mark\_DM with Workflows Metadata

![Step4 MarkFM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step4_MarkFM.png)

Figure 49. Mark\_FM with proceed Action

![Step4 MarkOM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step4_MarkOM.png)

Figure 50. MarkTaskList\_OM

![Step4 PreviewAM 1](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step4_PreviewAM_1.png)

Figure 51. PreviewApp\_AM

![Step4 PreviewAM 2](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step4_PreviewAM_2.png)

Figure 52. Module on PreviewApp\_AM

![Step4 PreviewAM 3](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step4_PreviewAM_3.png)

Figure 53. Flow in Module on PreviewApp\_AM

![Step4 PreviewAM 4](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step4_PreviewAM_4.png)

Figure 54. Scene in Flow in Module on PreviewApp\_AM

![Step4 PreviewAM 5](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step4_PreviewAM_5.png)

Figure 55. VIEW\_ADD Scene Change in Scene in Flow in Module on PreviewApp\_AM

### Step 5: Link Doc with Relationship

The documents from the two processes should be linked so that the Mark that is given clearly relates to a specific Certification Quiz.

In this step, you will create the Relationship Model to allow this and use the Workflows Templates so that the Links are automatically created.

#### Step 5a: Create the Relationship Model

![Step5 1 RM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step5_1_RM.png)

Figure 56. Modeling "CertificationMark"

* Model the Relationship Models as planned in [Step 1c: Marking Process](#Workflows_step1_Marking).
* Model CertificationMark.

  + Set the Model up to be a 1:1 Relationship.
  + Add the following Roles.

    - Certification referencing Certification\_DM, Multiplicity = 1.
    - Mark referencing Mark\_DM, Multiplicity = 1.
* Apply the changes, save your Relationship model and generate the Document Models.

#### Step 5b: Link the Documents

![Step5 2 LinkTemplate](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step5_2_LinkTemplate.png)

Figure 57. Applying the "Create Relationship Link Delegate Template" to a Service Task

* Switch to the Camunda Modeler.
* Add the Service Task to Link the Approval Document as planned in [Step 1c: Marking Process](#Workflows_step1_Marking).

  + Add a Task to the BPMN Model.
  + Use the settings to change the element to a Service Task.
* Add the "Create Relationship Link Delegate Template".

  + Click on the Service Task.
  + Click "Select" in the "Template" section of the Properties Panel.
  + Select the "Create Relationship Link Delegate Template" from the list provided.
* Configure the Service Task by adding the following information.

  + Reference the Relationship Model by entering "CertificationMark" as the "Relationship Model".
  + Add the Certification Document Reference by entering the expression with the process variable, "${NewCertification}", into "Source Document Reference".
  + Match this Document with the correct role in the Relationship Model by entering "Certification" into "Source Role".
  + Add the Mark Document Reference by entering the expression with the process variable, "${NewMark}", into "Target Document Reference".
  + Match this Document with the correct role in the Relationship Model by entering "Mark" into "Target Role".
  + Let’s call the Process Variable for this new Link "NewMarkLinkID" by entering "NewMarkLinkID" in the field labeled "Process Variable Name For New Link ID".
* Save your BPMN Model.

|  |  |
| --- | --- |
|  | As Relationship Links in are flat and have no direction in A12, the assignment of Source and Target is not significant.  However, the Document Reference must match the Document Model for that Role:  * Source Document Reference matches the Document Model used in the Source Role. * Target Document Reference matches the Document Model used in the Target Role. |

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["Create Relationship Link Delegate Template"](https://geta12.com/docs/workflows/ba-docs/index.html#create-relationship-link-delegate-template). |

#### Step 5c: Model a Binding to View the Linked Data

![Step5 3 Binding](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step5_3_Binding.png)

Figure 58. Modeling a Binding on "Mark\_FM"

* Switch to the Simple Model Editor.
* Add a Binding to Mark\_FM.

  + Select the Table List Component.
  + Set "Has Edit Modal" to "no".
  + Model the Selected Items Overview Model so that the Marker can see answers to the Certification Questions in the Table List.
  + Apply the changes and save your Form Model.

#### Step 5d: Add an Extra User Task to Check Mark

![Step5 4 CheckMark](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step5_4_CheckMark.png)

Figure 59. Applying the "User Task With Input Document" Template to a User Task

* Make a copy of Certification\_FM so that we can check the Mark as planned in [Step 1a: Certification Process](#Workflows_step1_Certification).

  + Copy Certification\_FM and name the copy CertificationMarked\_FM.
  + Set the Certification Quiz Controls to be read-only.
  + Add another Table List Binding as you did in [Step 5c: Model a Binding to View the Linked Data](#Workflows_step5c).
* Switch to the Camunda Modeler.
* Add a User Task to check the Mark using the "User Task With Input Document" as you did in [Step 4c: Modify the Existing Document in a User Task](#Workflows_step4c)

  + Add a Task to the BPMN Model.
  + Use the settings to change the element to a User Task.
* Add the "User Task With Input Document" Template.

  + Click on the User Task.
  + Click "Select" in the "Template" section of the Properties Panel.
  + Select the "User Task With Input Document" Template from the list provided.
* Configure the User Task by adding the Input Document Reference.

  + Reference the Process Variable, NewCertification, as an expression by entering "${NewCertification}".
* Reference your Form Model in the "Forms" section.

  + Select "Embedded or External Task Forms" in the "Type" field.
  + Add the Form Model name that you just created, "CertificationMarked\_FM", into the "Form key" field.
* Save your BPMN Model.

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["User Task With Input Document"](https://geta12.com/docs/workflows/ba-docs/index.html#user-task-existing-doc). |

|  |  |
| --- | --- |
|  | You can save all your models and start testing what you have modeled so far. See [How to Test and Troubleshoot Your Models](#Workflows_TestAndTroubleshoot) for more details. |

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

CertificationMark, CertificationMarked\_FM with the respective \\_\_\_generated Document Models and Binding Overview Models

![Step5LinkDocWithRelationship](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step5LinkDocWithRelationship.png)

Figure 60. BPMN Model With Tasks to Create and Check a Relationship Link

![Step5 RM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step5_RM.png)

Figure 61. CertificationMark Relationship Model

![Step5 LinkDoc](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step5_LinkDoc.png)

Figure 62. "Create Relationship Link Delegate Template" to Link the Certification and Mark Documents

![Step5 FinalDecision](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step5_FinalDecision.png)

Figure 63. "User Task With Input Document" to Display the Mark

![Step5 MarkFM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step5_MarkFM.png)

Figure 64. Mark\_FM with a Table List Binding

![Step5 CertificationMarkedFM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step5_CertificationMarkedFM.png)

Figure 65. CertificationMarked\_FM with a Table List Binding

### Step 6: Context-Based Validation

In this step you will update link Validation Rules to the Status Field Value.
As you can update the Status Field Value automatically in the Workflows process, this allows you to integrate a State Machine into the Workflow.

For example, when the Status Field Value is "A", Field A must be filled.

|  |  |
| --- | --- |
|  | The "Set Status Delegate Template" does **not** trigger a Full Validation of the Document.  By referencing the Status Field Value in Validation Rules and then automatically setting the Status Field Value you will probably create an invalid Document. This is by design so that the Validation Rules can be triggered in the next User Task.  Invalid Documents should be resolved as soon as possible. This normally means modeling a User Task directly after the Service Task. |

#### Step 6a: Add Additional Status Changes in Certification Process

![Step6 1 StatusChanges](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step6_1_StatusChanges.png)

Figure 66. Modeling Additional Status Changes

If you chose to add the optional Business Rule Task and DMN Model in [Step 3](#Workflows_step3) and have planned for three different status values in your Document Model and DMN Model you can simply copy and paste the Call Activity.

|  |  |
| --- | --- |
|  | If not, please ensure that you can set three different values. You could also achieve this using:  * Inputs on the Call Activity. * "Set Status Delegate Template" in Service Tasks instead of the Call Activity.   This is described in more detail in the [next step](#Workflows_step6b). |

* Add Tasks to perform the three Status Field Value changes planned in [Step 1a: Certification Process](#Workflows_step1_Certification).

  + Copy and Paste the Set Status Call Activity that you have already modeled and let the Business Rule Task and DMN Model work their magic.

#### Step 6b: Add Status Change to Marking Process

![Step6 2 StatusChangeMarking](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step6_2_StatusChangeMarking.png)

Figure 67. Applying the "Set Status Delegate Template" to a Service Task

* Add the Service Task to Set the Status as planned in [Step 1c: Marking Process](#Workflows_step1_Marking).

  + Add a Task to the BPMN Model.
  + Use the settings to change the element to a Service Task.
* Add the "Set Status Delegate Template".

  + Click on the Service Task.
  + Click "Select" in the "Template" section of the Properties Panel.
  + Select the "Set Status Delegate Template" from the list provided.
* Configure the Service Task by adding the following information.

  + Reference the Process Variable, NewMark, as an expression by entering "${NewMark}" to the "Document Reference".
  + Enter a "New Value" as a String (fixed value).
    Let’s set the Value to be "ToMark".
  + Copy the Status Field Path from the Document Model and paste it into the "Path to Field".
* Click "Async before" in the "Async Properties".
* Save your BPMN Model.

|  |  |
| --- | --- |
|  | Setting the Asynchronous Continuations to before creates a "savepoint" in the process.  Whilst the process will roll-back to this point in the case of an error, changes to Documents will not be reverted. |

#### Step 6c: Model Context-Based Validation Rules

![Step6 3 ValidationRule](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step6_3_ValidationRule.png)

Figure 68. Modeling a Validation Rule

As planned in [Step 1c: Marking Process](#Workflows_step1_Marking), we need to model a Validation Rule to ensure that a mark is given.

* Switch to the Simple Model Editor.
* Open Mark\_DM and model the Validation Rule.

  + Set the Mark Field as the Error Field.
  + Add the Condition to ensure that the Mark is filled.

    ```
    [Status/Status] == "ToMark" And FieldNotFilled(Mark)
    ```
  + Enter an Error Message for each locale.
  + Apply the changes and save your Document Model.

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["Context-Based Validation Rules"](https://geta12.com/docs/workflows/ba-docs/index.html#anchor-cbr-context-based-validation-rules). |

|  |  |
| --- | --- |
|  | You can save all your models and start testing what you have modeled so far. See [How to Test and Troubleshoot Your Models](#Workflows_TestAndTroubleshoot) for more details. |

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

![Step6ContextBasedValidation](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step6ContextBasedValidation.png)

Figure 69. BPMN Model With Status Changes for Context-Based Validation

![Step6 CallActivity](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step6_CallActivity.png)

Figure 70. Copy of Set Status Call Activity

![Step6 SetStatus](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step6_SetStatus.png)

Figure 71. "Set Status Delegate Template" used to set the Status Field Value to "ToMark"

![Step6 MarkDM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step6_MarkDM.png)

Figure 72. Validation Rule on Mark\_DM

### Step 7: Loops and Errors

So far the tutorial has shown you how to model a "happy path".
The Certification Quiz is complete, the Mark is given and with that all the processes come to an end.

This step is concerned with a deviation from the "happy path".
This means modeling the functionality to allow a user to request that their Certification Quiz is remarked.

There are a number of different ways to create a loop back.
For example, you could choose to:

1. Send a Message from the User Task.
2. Use Process Variables to set the Path at an Exclusive Gateway.

You have already Synchronised Field Value to Process Variables in [Step 3](#Workflows_step3) so that you could use them in the Process.
In addition, the Field Values that are available to the Process are also synchronised when saving a User Task.
As a result, let’s focus on option 1.

#### Step 7a: Send a Message to Request Re-Marking

![Step7 1 UserTaskMessage](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step7_1_UserTaskMessage.png)

Figure 73. Adding a Message Boundary Event

* Switch to the Camunda Modeler.
* Add a Message Boundary Event to the Final Decision Task as planned in [Step 1a: Certification Process](#Workflows_step1_Certification).

  + Add an Intermediate Event to the BPMN Model.
  + Use the settings to change the element to a Message Boundary Event.
* Configure the Message Catch Event.

  + Select "Create new…​" as the "Global message reference" in "Message" section of the Properties Panel.
  + Let’s enter "Remark" into the "Name" field.
* Model the Gateway and Flow so that the Process Loops back.

  + Add an Exclusive Gateway after the first User Task, Take Certification Test.
  + Add a Flow that connects the Message Boundary Event to the Gateway.
    This will mean that the Marking Process is triggered again.

This Message Boundary Event can catch a message that we send from the User Task.
This means you need to add an Action to the Form Model referenced in this User Task that sends the message.

* Switch to the Simple Model Editor and open CertificationMarked\_FM.
* Model a Button to send the message.

  + Add a Button to the Model.
* Configure the Button.

  + Enter a "Name" and select the "Event" in "Button Functions", "Type".
  + Click on "Button Functions", "Event" and type "sendMessage" into the Field.
  + Continue modeling the Button as normal.
  + Expand the Annotations section at the bottom of the Button Editor and click "Add".

    - Enter "messageName" into the "Name" Field.
    - Enter the message that you modeled in the Boundary Event, "Remark" as the "Value".
  + Apply the changes and Save the Form Model.

|  |  |
| --- | --- |
|  | Sending a Message from the Form does not lead to the Form being saved or validated.  This modeling solution should not be used when the end user is expected to change a Field Value. |

|  |  |
| --- | --- |
|  | The Caution above is the reason why we haven’t modeled a Context-Based Validation Rule for the Certification Process.  If the Document was invalid when the Remark message was sent, an incident would be raised the next time the Workflows Metadata were updated. |

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["Send a Message From a Form"](https://geta12.com/docs/workflows/ba-docs/index.html#anchor-send-message-event). |

#### Step 7b: Add an Error Event

![Step7 2 Error](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step7_2_Error.png)

Figure 74. Adding an Error Boundary Event

As the Marking Process is triggered again, a second Marking Document will be linked with the Certification Document.
This will cause an incident as the Relationship Model specifies a 1:1 Relationship.

Rather than change the Relationship Model, let’s raise an Error, catch it and then change the Linked Documents using the "Re-link Document Delegate Template".

* Switch to the Camunda Modeler.

  + Add an Error Boundary Event to the Link Approval Doc Task as planned in [Step 1c: Marking Process](#Workflows_step1_Marking).
  + Add an Intermediate Event to the BPMN Model.
  + Use the settings to change the element to an Error Boundary Event.
* Configure the Error Boundary Event.

  + Select "Create new…​" as the "Global error reference" in "Error" section of the Properties Panel.
  + Let’s enter "Link Limit Reached" into the "Name" field.
  + Enter "LinkLimitReachedError" in the "Code" field.

|  |  |
| --- | --- |
|  | This Error Code is generated by Workflows when the Link Limit is reached and requires no extra coding. |

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["BPMN Errors"](https://geta12.com/docs/workflows/ba-docs/index.html#anchor-bpmn-errors). |

#### Step 7c: Re-Link Documents

![Step7 3 RelinkTemplate](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step7_3_RelinkTemplate.png)

Figure 75. Applying the "Re-link Document Delegate Template" to a Service Task

We need the existing Link ID to be able to re-Link the Documents.
By the time the Error is raised, the Service Task has already overwritten the existing value of NewMarkLinkID, the Process Variable we defined in [Step 5b](#Workflows_step5b).
As a result, we need to copy it before that happens.

* Add an Output to copy the Process Variable.

  + Click on "Final Decision".
  + Add an Output and enter "ExistingMarkLinkID" as the "Process variable name".
  + Reference the NewMarkLinkID using the expression "${NewMarkLinkID}" in the "Value" field.

You can now model the Service Task.

* Add the Service Task to Re-Link the Approval Document as planned in [Step 1c: Marking Process](#Workflows_step1_Marking).

  + Add a Task to the BPMN Model.
  + Connect the Task to the Error Boundary Event and join the Flows with an Exclusive Gateway.
  + Use the settings to change the element to a Service Task.
* Add the "Re-link Document Delegate Template".

  + Click on the Service Task.
  + Click "Select" in the "Template" section of the Properties Panel.
  + Select the "Re-link Document Delegate Template" from the list provided.
* Configure the Service Task by adding the following information.

  + Add the existing Link ID by entering the expression with the process variable, "${ExistingMarkLinkID}", into "Link ID".
  + Reference the Relationship Model by entering "CertificationMark" as the "Relationship Model".
  + Add the Certification Document Reference by entering the expression with the process variable, "${NewCertification}", into "Source Document Reference".
  + Match this Document with the correct role in the Relationship Model by entering "Certification" into "Source Role".
  + Add the Mark Document Reference by entering the expression with the process variable, "${NewMark}", into "Target Document Reference".
  + Match this Document with the correct role in the Relationship Model by entering "Mark" into "Target Role".
  + Let’s use the same output variable for our Link and call the Process Variable for this new Link "NewMarkLinkID" by entering "NewMarkLinkID" in the field labeled "Process Variable Name For New Link ID".
* Save your BPMN Model.

|  |  |
| --- | --- |
|  | This is documented in the Workflow Modeling documentation under ["Re-link Document Delegate Template"](https://geta12.com/docs/workflows/ba-docs/index.html#relink-document-delegate-template). |

#### Step 7d: Model a History of Marks (optional)

![Step7 4 LinkToHistory](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step7_4_LinkToHistory.png)

Figure 76. Applying the "Create Relationship Link Delegate Template" to a Service Task

If you want to see a history of all the Marks that have been given, model a 1:n Relationship Model as planned in [Step 1c: Marking Process](#Workflows_step1_Marking).

Now you can follow the steps in [Step 5: Link Doc with Relationship](#Workflows_step5) to:

* Add the "Create Relationship Link Delegate Template" to a Service Task.
* Add Bindings to the Form Model.

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

![Step7LoopsAndErrors](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step7LoopsAndErrors.png)

Figure 77. BPMN Model With Re-Marking Loop and Delegate Error

![Step7 Remark](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step7_Remark.png)

Figure 78. Message Boundary Event with the Name "Remark"

![Step7 CertificationFM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step7_CertificationFM.png)

Figure 79. sendMessage Event on CertificationMarked\_FM

![Step7 Error](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step7_Error.png)

Figure 80. Error Boundary Event when the Link Limit is Reached

![Step7 Output](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step7_Output.png)

Figure 81. Output to Copy the Link ID Process Variable

![Step7 Relink](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step7_Relink.png)

Figure 82. "Re-link Document Delegate Template" on Service Task

![Step7 RM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step7_RM.png)

Figure 83. Optional Relationship Model CertificationMarkHistory

![Step7 History](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step7_History.png)

Figure 84. Optional "Create Relationship Link Delegate Template" on Service Task

![Step7 CertificationFM 2](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Step7_CertificationFM_2.png)

Figure 85. Optional Binding on CertificationMarked\_FM

### How to Test and Troubleshoot Your Models

You can new test your models to make sure that everything is working perfectly.

* Open the Preview App Control and select your workspace in the drop-down menu.

|  |  |
| --- | --- |
|  | Process Instances are not persisted when you stop and restart the Preview App.  Documents are also cleared from the database each time the Preview App is restarted. If you want to retain any test data, you can save it in your Workspace by clicking on the "Replace Workspace Data" button in the Workspace Explorer of the Simple Model Editor.  This allows you to preserve documents, attachments and links. Process Instances cannot be preserved in the Workspace in this manner.  Check the [Simple Model Editor documentation](https://geta12.com/docs/sme/sme-ba-docs/index.html) for more information. |

* Start your workspace using the Preview App Control and log in (admin:a12).

  |  |  |
  | --- | --- |
  |  | If the Preview App does not start, check your BPMN Model for errors.  Sources of errors include:  + The Process cannot be completed.  - Flows are not attached.   - Conditions after an Exclusive Gateway have not been modeled. + Service Tasks do not have a Template.  - As a result, the Service task does not call a Delegate. + Message Events do not have a Message. |

  |  |  |
  | --- | --- |
  |  | If the process engine does not start, check that you have adapted the "workspace.json" as described in [Step 2g: Enable Workflows in the Preview Application](#Workflows_step2g).  You can use the expert mode to check what the Preview App Control is starting. |
* (If necessary) Connect the Simple Model Editor to the server using the "Configure Server Connection" tab in the top right-hand corner (admin:a12).
* (If necessary) Deploy your workspace and refresh your browser tab.

  |  |  |
  | --- | --- |
  |  | As the Modules have been added to the Application Model, we only need to re-deploy models from the Simple Model Editor in the case that we have made changes.  Changes to the BPMN and DMN Models can be deployed directly from the Camunda Modeler. |
* (Optional) Open another browser tab and log into the Camunda Cockpit.

  |  |  |
  | --- | --- |
  |  | You can check the status of Process Instances using the Camunda Cockpit. Please refer to the [Workflows Documentation](https://geta12.com/docs/workflows/ba-docs/index.html#_using_the_camunda_cockpit) for more details. |
* Click on the Certification module in your application and apply for certification by clicking on the startProcess Action that you added in [Step 2: Start a Workflow Process](#Workflows_step2).

  |  |  |
  | --- | --- |
  |  | There is a short delay when starting a process for the first time. When you click on the startProcess button in the Overview for a second time, the process instance will be created significantly faster. |

  + Click on the new row that has been added to the Overview.
  + Enter your data and Click on the proceed Action that you added in [Step 2: Start a Workflow Process](#Workflows_step2).
* Switch to Marking module and check that new row has been added to the Overview due to the Events and Tasks that you added in [Step 4: Trigger Marking Process](#Workflows_step4).

  + Click on the new row to open the Form Model that you created in [Step 4: Trigger Marking Process](#Workflows_step4).
  + Check the Certification Quiz data in the Binding that you added to the Form Model in [Step 5: Link Doc with Relationship](#Workflows_step5).
  + Use the proceed Action to submit the mark.
* Switch back to the Certification module.

  + Click on the Document to open the Form that you added in [Step 5: Link Doc with Relationship](#Workflows_step5) and use the Binding to check the mark.
  + Check that the Certification Status has been updated as modeled in [Step 6: Context-Based Validation](#Workflows_step6).
  + Click on the proceed Action to end the Process Instance.
* Repeat the Testing Process.

  + Try and submit the Marking Form without adding a mark.
    Ensure that the Context-Based Validation Rule tht you modeled in [Step 6: Context-Based Validation](#Workflows_step6) is triggered.
  + Loop back using the sendMessage Action that you added in [Step 7: Loops and Errors](#Workflows_step7).
    Ensure that the Relationship Link is updated.
* (Optional) Use a Master Detail Module Model to quickly add a "normal" Overview for the Certification and Marking Documents.

  |  |  |
  | --- | --- |
  |  | The TaskList Overviews that you added to the Application Model are filtered. |

  + Check that the Status is updated correctly at all stages of the process.

**Click here to see what your project should look like by now.**

![Testing Cockpit3Processes](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Testing_Cockpit3Processes.png)

Figure 86. Three running processes in the Camunda Cockpit

![Testing CertificationOM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Testing_CertificationOM.png)

Figure 87. Certification TaskList

![Testing CertificationFM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Testing_CertificationFM.png)

Figure 88. Entering Certification Data

![Testing MarkingFM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Testing_MarkingFM.png)

Figure 89. Giving a Mark

![Testing CertificationMarkedFM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_workflows/assets/Testing_CertificationMarkedFM.png)

Figure 90. Checking the Mark in the Certification Process

## Glossary

Please check the Glossary in the
[Workflows Documentation](https://geta12.com/docs/workflows/ba-docs/index.html#_glossary)
for more information.
