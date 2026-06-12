---
source: https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/index.html
category: overall
docid: modeling_tutorial_super1
scraped: 2026-06-12
---

# Tutorial: How To Put It Together

## Prerequisites

Before you start this tutorial, you should have completed the following training course(s) and tutorials.
For more details on what topics are covered, please follow the links.

* [A12 Fundamentals Training](https://geta12.com/#/trainings/training-ba-modeler#modeling-fundamentals-training)
* [Tutorial - Heterogeneity Modeling](https://geta12.com/docs/overall/modeling_tutorial_heterogeneity/index.html)
* [Tutorial - Relationship Modeling](https://geta12.com/docs/overall/modeling_tutorial_relationships/index.html)
* [Tutorial - Tree Modeling](https://geta12.com/docs/overall/modeling_tutorial_tree/index.html)

This tutorial focuses on using the skills from the three tutorials above in one workspace and the relevant documentation is linked below:

* [Heterogeneity documentation](https://geta12.com/docs/overall/heterogeneity/index.html)
* [Relationship Modeling documentation](https://geta12.com/docs/overall/relationships_for_bas/index.html)
* [Tree Modeling documentation](https://geta12.com/docs/sme/sme-tm-ba-docs/index.html)
* [Form Modeling - Binding documentation](https://geta12.com/docs/sme/sme-binding-ba-docs/index.html)

This tutorial uses the "**tutorial**" workspace in the [installer](https://geta12.com/installer/) which you can download from geta12.com.
You can find it under `..\workspaces\further_example_and_tutorial_workspaces`.
Simply open that folder with the Simple Model Editor.

|  |  |
| --- | --- |
|  | Please ensure your installer version matches this tutorial. |

|  |  |
| --- | --- |
|  | The "**tutorial**" workspace is not displayed by default in the drop-down menu of the Preview App Control. Use the "Select Workspace from File System" button on the right-hand side of the drop-down menu to select it. |

|  |  |
| --- | --- |
|  | Once you have selected the "**tutorial**" workspace in the drop-down menu of the Preview App Control you can make a copy of it.  You can then make a fresh copy each time you want to complete the tutorial. |

## Use-case

The prerequisite tutorials all had a use-case based on employees and teams.
This use-case can also be seen in the "advanced" workspace that is included in the A12 installer.

The same ideas can easily be applied to a product catalog, where there are products that fall into different categories to make a product catalog.
If you open the "e-commerce" workspace included in the A12 installer, then you can see how this use-case was modeled in A12, too.

As these use-cases have already been modeled for you, let’s work with a slightly different use-case.

I run a successful enterprise software company and want to be able to keep track of our clients, the projects that they have with us and also which people are currently working on which projects.
I want to be able to add a project to a specific client and then assign people to the project.
As my clients can be legal entities or natural people, I want to be able to select this and then enter different data depending on what type of client they are.

I also have a range of different people working for me including employees, freelancers and interns.
I would like to view all these people on one overview but also be able to store a range of different data depending on whether they are an employee, a freelancer or an intern.

![UseCase](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/UseCase.png)

Figure 1. Use-case schema

## End Result

At the end of this tutorial, you will be able to complete the following modeling tasks and deploy your models in the "**tutorial**" workspace so that you can:

| Modeling Task | Tutorial | Result in Workspace |
| --- | --- | --- |
| Set the *Subtypes* of the client | Heterogeneity | You can create a new client as a Legal Entity or as a Natural Person and view these in the Client module.  (Clients of both types are grouped.) |
| Set the *Subtypes* of the person | Heterogeneity | You can create a new person as an Employee, a Freelancer or as an Intern and view these people in the People module.  (People of all three types are grouped.) |
| Create Relationship Models and Bindings | Relationships | You can select a client for a project and choose the people working on the project. |
| Model an Additional Link Field to store the project specific role | Relationships | You can assign a project specific role to a person. |
| Create a Tree Model using the two relationships | Tree | You can view the Clients, Projects and People in a tree and view the hierarchical structure. |
| Model specific actions for the nodes | Tree | You can create projects as children of clients. You can also create people as children of projects. |
| Display additional information in child node | Tree | The project specific roles are also shown in the tree. |

As you can see, this is quite a lot of work!
No need to worry though because we have a plan, and we have already created the document, form and overview models that you will need for this tutorial so that you only need to model the items listed above.

The aim of this tutorial is to put ideas together that you have learned about in other tutorials and training sessions.
If you didn’t understand any of the terms used here, I recommend looking back at the relevant tutorial.

If you need to check your work as you do the tutorial, please refer to the expandable sections at the end of each step:

**Click here to see what your project should look like by now**

You can find a list of models that you created as well as fullscreen pictures of each step to guide you.

## Step-by-Step Instructions

### Step 1: What Has Already Been Provided?

#### Step 1a: Open the **Tutorial** Workspace

![Text 1a](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_1a.png)

Figure 2. Open the workspace in the Simple Model Editor

As we mentioned, we have set you quite a big task here.
The first thing that you need to do is open the **tutorial** workspace and familiarize yourself with the workspace.

As you can see, we’ve already modeled all the Document and Form Models needed for this tutorial.

As with all the other installer workspaces, the locales "en" and "de" are used in all the models to maintain labels in English and German.
This means that you should add both of these locales to any other models you create.
You will then have the option to add labels in English and German.

|  |  |
| --- | --- |
|  | If you don’t want to add the extra German labels, just leave them blank and the workspace will then default to the English labels. |

#### Step 1b: What Works, What Doesn’t?

![Text 1b](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_1b.png)

Figure 3. Open the workspace in the PAC

You can open the workspace using the Preview App Control and can open the Client, Project and People Overviews.

There are a few problems though.

1. You can’t add any new documents to the Client or People Modules, as we’re missing the annotations ([Step 2](#Super1Step2) and [3](#Super1Step3)).
2. We can add new projects, but we cannot link these with clients or add people to the projects ([Step 5](#Super1Step5) and [6](#Super1Step6)).
3. The Client Tree module cannot be opened as the Tree Model is missing ([Step 7](#Super1Step7), [8](#Super1Step8) and [9](#Super1Step9)).

|  |  |
| --- | --- |
|  | If you validate the workspace you will see an error message next to the PreviewApp\_AM.  Don’t worry, we’ll get to it. |

So let’s dive in and model a functional workspace.

### Step 2: Plan Your *Supertypes* and *Subtypes*

#### Step 2a: Which Document Models Need a *Supertype*?

To make the Client and People Module function, we need to add some annotations to the *Supertype* model.
The use-case says that we want to be able to add clients as either legal entities or as natural persons.
In addition, we want to be able to add people who work for our successful enterprise software company as either employees, freelancers or interns.

Let’s have a look at the models that have been prepared and see if the naming convention and information on the Document Models give us any clues as to how they should be used.

#### Step 2b: Find the *Supertype* and *Subtype* Document Models for Legal Entities and Natural People

![Text 2a](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_2a.png)

Figure 4. Client\_DM

You can see that there are four models with Client at the start of their name in the Simple Model Editor.

You learned in the [Heterogeneity Modeling Tutorial](https://geta12.com/docs/overall/modeling_tutorial_heterogeneity/index.html) that we need to have a *Supertype* model and *Subtype* models which share a common data structure.
In addition, you saw how you can use an include to ensure that the shared data is modeled consistently.
We can see from the naming convention that we have:

* Two Document Models that will be SubTypes of Client\_DM

  + ClientLegalEntity\_DM
  + ClientNaturalPerson\_DM
* One Document Model used as an include

  + ClientSharedData\_DM

When you open each of the models, you can see that they have a shared data structure with an included "SharedData" group nested in the "Client" root group.
In addition, there is an additional "LegalEntityData" group on ClientLegalEntity\_DM.

This Document Model also has the Labels, en = "Legal Entity" de = "Juristische Einheit", which you can see in the model settings.
These labels will be displayed in the Variant Dialogue

Similarly, ClientNaturalPerson\_DM is labeled "Natural Person" and has an additional "NaturalPersonData" group.

It should now be clear that we are planning to use ClientLegalEntity\_DM and ClientNaturalPerson\_DM as the *Subtype* models and Client\_DM as the *Supertype* model.

#### Step 2c: Find the *Supertype* and *Subtype* Document Models for Employees, Freelancers and Interns

![Text 2b](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_2b.png)

Figure 5. People\_DM

If you examine the five Document Models with People at the start of their name in the Simple Model Editor, you will see that the same naming convention has been used.
You can therefore see that we have:

* Three Document Models that will be SubTypes of People\_DM

  + PeopleEmployee\_DM
  + PeopleFreelancer\_DM
  + PeopleIntern\_DM
* One Document Model used as an include

  + PeopleSharedData\_DM

### Step 3: Model the Annotations

#### Step 3a: Add Annotations to the *Supertype*, Client\_DM

![Text 3a](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_3a.png)

Figure 6. Annotations on Client\_DM

Please navigate to the settings of Client\_DM using the Workspace Explorer on the left.

* Click on the "Client\_DM" Document Model and then select "Settings" in the sidebar on the left-hand side of the editor.
* Add the abstract and subTypes annotations to the "Annotations" section.

If you’re not sure how the annotations should be added you can look back at the heterogeneity tutorial, read the documentation or look at the screenshots at the end of this step.

#### Step 3b: Add annotations to the *Supertype*, People\_DM

![Text 3b](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_3b.png)

Figure 7. Annotations on People\_DM

Once this is complete, navigate to the settings of People\_DM and repeat the process.

* Click on the "People\_DM" Document Model and then select "Settings" in the sidebar on the left-hand side of the editor.
* Add the abstract and subTypes annotations to the "Annotations" section.

Once again, you can compare your work to the screenshots at the end of this step.

#### Step 3c: Check Your Work in the Data Modeling Perspective

![Text 3c](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_3c.png)

Figure 8. A Model Graph Diagram in the Data Modeling Perspective

You can check your work by modeling a Model Graph Diagram.
A new Model Graph Diagram can be created in the Workspace Explorer, just like any other Model.

* Click "Add" in the Workspace Explorer and select "Model Graph Diagram".
* Choose a folder and give the Model Graph Diagram a name.
* Set the "Initial Document Models" to "Custom Selection".
* Click on the "models" Folder to select all the Document Models in your Workspace.
* Click "Ok".

The "Model Graph Diagram" will open in the "Data Modeling Perspective".

If you don’t see arrows connecting your Subtypes to your Supertypes, go back and check the annotations.

|  |  |
| --- | --- |
|  | Make sure that there are not any spaces in the comma-separated list of Document Models. |

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

ModelGraph

Annotations were added to Client\_DM and People\_DM.

![Step 3 1 Client annotations](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_3_1_Client_annotations.png)

Figure 9. Annotations on Client\_DM

![Step 3 2 People annotations](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_3_2_People_annotations.png)

Figure 10. Annotations on People\_DM

![Step 3 3 ModelGraphDiagram](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_3_3_ModelGraphDiagram.png)

Figure 11. A Model Graph Diagram in the Data Modeling Perspective showing all the Document Models in the Workspace in a customized layout.

### Step 4: Plan Your Relationships

![UseCase](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/UseCase.png)

Figure 12. Use-case schema

The use-case shows that we have a relationship between clients and projects, where each project has a single client.
This means that we need to model a 1:n relationship.
In other words, where only one client (any instance of ClientLegalEntity\_DM or ClientNaturalPerson\_DM) can be linked to a single instance of the Project Document Model.
However, an unlimited number of projects may be linked to a single instance of the Client\_DM Document Model group.

We also need a second Relationship Model, so that people can be added to the projects.
For this relationship we need to add an Additional Link Field.
Fortunately, the Document and Form Models for this Additional Link Field have already been modeled.

If you click on ProjectPeople\_LinkFields\_DM in the Workspace Explorer, you will see a very simple Document Model with one field for entering a project specific role.
We can use this when setting up the relationship between projects and people.

As people can be assigned to multiple projects and a single project can have multiple people working on it, we need to model an n:n relationship with a Link Document Model.

### Step 5: Create the Relationship Model

#### Step 5a: Create the ClientProject Relationship Model

![Text 5a](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_5a.png)

Figure 13. ClientProject

* Click on "Add" in the Workspace Explorer and add the relationship between client and project.
  Let’s call this ClientProject.
* Don’t forget to enter "en, de" in the Locales field so that we can continue to use both locales in the workspace.
* Model the Relationship Model as planned in [Step 4](#Super1Step4).
* Assign the roles Client and Project as you did in the [Relationship Model Tutorial](https://geta12.com/docs/overall/modeling_tutorial_relationships/index.html).

|  |  |
| --- | --- |
|  | Select the *Supertype* model for the heterogeneous parts of the relationship so that all *Subtype* Documents may be used in links.  In this case, you should select the Client\_DM *Supertype* model.  Remember, if you check the "User Determined Order" button for the Project role, you will be able to order the Projects in the Tree using drag and drop. |

* Click on "Save" and then "Generate Document Models" in the bottom left-hand corner.

#### Step 5b: Create the ProjectPeople Relationship Model

![Text 5b](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_5b.png)

Figure 14. ProjectPeople

Once you have finished, please create a second relationship.

* Click on "Add" in the Workspace Explorer and add the relationship between the projects and people.
  Let’s call this ProjectPeople.
* Don’t forget to select the Document Model for the Additional Link Field, as we planned in [Step 4](#Super1Step4).

#### Step 5c: Check Your Work in the Data Modeling Perspective

![Text 5c](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_5c.png)

Figure 15. Relationships represented as Edges in the Model Graph Diagram

You can now check your work by looking at the Model Graph Diagram that you modeled in [Step 3c: Check Your Work in the Data Modeling Perspective](#Super1Step3c).

* One Edge should connect Client\_DM and Project\_DM.
* Another Edge should connect Project\_DM and People\_DM.
* A dashed Edge should connect the ProjectPeople Edge with ProjectPeople\_LinkFields\_DM.

|  |  |
| --- | --- |
|  | As mentioned before, if you check the "User Determined Order" button for the People role, you will be able to order the People in the Tree using drag and drop. |

* Click on "Save" and then "Generate Document Models" in the bottom left-hand corner.

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

ClientProject, ProjectPeople,

ClientProject\_Client\_\_\_generated, ClientProject\_Project\_\_\_generated, ProjectPeople\_Project\_\_\_generated and ProjectPeople\_People\_\_\_generated

![Step 5 1 ClientProject](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_5_1_ClientProject.png)

Figure 16. ClientProject

![Step 5 2 ProjectPeople](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_5_2_ProjectPeople.png)

Figure 17. ProjectPeople

![Step 5 3 ModelGraphDiagram](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_5_3_ModelGraphDiagram.png)

Figure 18. A Model Graph Diagram in the Data Modeling Perspective showing the Relationship Models connecting the Document Models.

### Step 6: Create the Binding in the Form Model

We will be able to use the buttons in the tree to create sibling and child nodes as well as using drag and drop to reorganise them.
However, we want to be able to link a person with multiple projects.
We therefore need to manage these links to multiple projects with a Binding.
For completeness, we can then use two Bindings on the Project\_FM Form Model to manage both relationships.

As ClientProject is a 1:n relationship, we can only select one client for each project.
This means that we should model a Drop Down Selection in the Binding for the ClientProject relationship.

In contrast, the ProjectPeople relationship should be maintained using a Dual Pane Selection so that we can add multiple people to a project.

#### Step 6a: Add Drop Down Selection to Project\_FM

![Text 6a](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_6a.png)

Figure 19. DropDown\_Client Binding

Please start adding the Bindings in Project\_FM on Screen 1.

* Right-click on the first screen element in the Form Model to add the Binding or use the drag and drop functionality.
* Choose the Relationship and Target Role.
  These will both be pre-selected if you used drag and drop.
* Choose a Drop Down Selection from the drop-down menu in the Bindings Editor.

You should be familiar with this process from the Relationship Modeling tutorial, but if you need help, you can compare your work with the screenshots at the end of this step.

#### Step 6b: Add Dual Pane Selection to Project\_FM

![Text 6b](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_6b.png)

Figure 20. DualPane\_People Binding

Once this Binding has been modeled, go on modeling the DualPane\_People Binding.
We will include the Additional Link Field in the selected items overview so that the project specific role will be displayed for the linked documents in the Dual Pane component.

* Right-click on the first screen element in the Form Model to add the Binding or use the drag and drop functionality.
* Choose the Relationship and Target Role.
  The Relationship will be pre-selected if you used drag and drop.
* Don’t forget to include the Additional Link Field information.
* As you added the link Document Model to the Relationship Model in [Step 5](#Super1Step5), add "/relationship/ProjectPeople\_LinkFields/Role" as one of the columns in the selected items overview.

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

No new models were created.
The Bindings DropDown\_Client and DualPane\_People were modeled on Project\_FM.

![Step 6 1 DropDown Client](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_6_1_DropDown_Client.png)

Figure 21. Creation of the DropDown\_Client Binding

![Step 6 2 DualPane People](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_6_2_DualPane_People.png)

Figure 22. Creation of the DualPane\_People Binding

### Step 7: Create the Tree Model

#### Step 7a: Plan Columns for the Tree

As we did before in the tree tutorial, we need to make a plan.
When looking through the fields on the Document Models, we can quickly see that clients, projects and people all have a name field which can be used as a column in the tree.
As this field is present for all levels of the tree, we can set this to be the hierarchical column.

Here’s an overview of the fields on the Document Models that I am planning to model in the tree.

| Column in Tree | Client\_DM | Project\_DM | ProjectPeople\_LinkFields\_DM | People\_DM |
| --- | --- | --- | --- | --- |
| Name | Name | Name |  | FirstName |
| Type of Client | Type |  |  |  |
| Project Start |  | StartDate |  |  |
| Project End |  | EndDate |  |  |
| Project Budget |  | Budget |  |  |
| Role in Project |  |  | Role |  |

#### Step 7b: Add Columns, Subheader Buttons and Labels

![Text 7b](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_7b.png)

Figure 23. Columns and Hierarchical Column on Client\_TM

* Model the tree as you did in the [Tree Modeling Tutorial](https://geta12.com/docs/overall/modeling_tutorial_tree/index.html).
* Add the columns shown above and choose a hierarchical column.
* As the Name column is our hierarchical column, let’s model it with a width of 2 and pin it to the left-hand side.
* Switch to the Custom Actions tab and add an add button and Expand All Popup to the Minor Subheader section.
* To activate the Expand All Popup, switch back to the Tree tab and check the "Enable Expand/Collapse The Whole Tree" checkbox.
* Navigate to the "Model Settings" tab and add the labels to the Tree Model.

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

Client\_TM

![Step 7 1 Name column](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_7_1_Name_column.png)

Figure 24. Name column of Client\_TM

![Step 7 2 columns](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_7_2_columns.png)

Figure 25. Columns of Client\_TM

![Step 7 3 custom Actions](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_7_3_custom_Actions.png)

Figure 26. Custom Actions of Client\_TM

![Step 7 4 Model Settings](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_7_4_Model_Settings.png)

Figure 27. Model Settings of Client\_TM

### Step 8: Add the Node Types With Specific Actions

#### Step 8a: Plan Buttons for Node Types

As before, we now need to add the node types to the tree, and we can model specific row action buttons for each node type.

As a result of the heterogeneity in People, we have two different ways to model the add child node button.
Firstly, we can model an "insert", "as child" button with no Document Model.
This means that the Variant Dialogue will be shown, just like when you add a document to the People overview.

Alternatively, we can model three separate buttons, one for each of the *Subtypes*.
These buttons can be grouped together in the context menu so that they do not take up too much space.

|  |  |
| --- | --- |
|  | The "insert", "above/below" buttons that are used to add sibling nodes always require a Document Model and therefore must be modeled for each individual *Subtype*. |

As our tree structure is very rigid, we can plan to add the following buttons for the nodes.

| Tree Level | Event event\_delete\_node | Insert as child | Context Menu |
| --- | --- | --- | --- |
| Client | Yes | Project\_DM |  |
| Project | Yes | no Document model - heterogeneous People | add below - Project\_DM  add child - PeopleEmployee\_DM  add child - PeopleFreelancer\_DM  add child - PeopleIntern\_DM |
| People | Yes |  | add below - PeopleEmployee\_DM  add below - PeopleFreelancer\_DM  add below - PeopleIntern\_DM |

#### Step 8b: Add the Nodes Types

![Text 8b](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_8b.png)

Figure 28. Node Types on Client\_TM

* Add the three node types using the three Document Models, Client\_DM, Project\_DM and People\_DM, as you did in the [Tree Model Tutorial](https://geta12.com/docs/overall/modeling_tutorial_tree/index.html).
* Map the columns according to the plan that we made in [Step 7a](#Super1Step7a).
* Child Relationships should be added to the Client\_DM node type (ClientProject) and the Project\_DM node type (ProjectPeople).

#### Step 8c: Add the Buttons

![Text 8c](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_8c.png)

Figure 29. Buttons for Project Node on Client\_TM

The buttons should now be added to the "Actions" or "Context Menu" sections.
When modeling the actions to insert people, you can either leave the Document Model field blank to model a heterogeneous add button or choose a specific *Subtype* model.

|  |  |
| --- | --- |
|  | If the Document Model field is blank then, when you use the add button, the Variant Dialogue will appear to allow the user to choose which *Subtype* should be created. |

Both of these options are shown in the screenshots at the end of this step and the finished tutorial.
As mentioned above, we modeled the heterogeneous add button as an action and created the add buttons for specific *Subtype* models in the context menu.

* Add the buttons planned in [Step 8a](#Super1Step8a).

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

No new models were created.
Node Types were added to Client\_TM.

![Step 8 1 Client node](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_8_1_Client_node.png)

Figure 30. Client\_DM node of Client\_TM

![Step 8 2 Project node](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_8_2_Project_node.png)

Figure 31. Project\_DM node of Client\_TM

![Step 8 3 Project node context menu](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_8_3_Project_node_context_menu.png)

Figure 32. Project\_DM node Context Menu of Client\_TM

![Step 8 4 People](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_8_4_People.png)

Figure 33. People\_DM node of Client\_TM

### Step 9: Add Additional Information to Child Node Type and Finish the Tree Model

#### Step 9a: Map the Additional Link Field

![Text 9a](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_9a.png)

Figure 34. Add Additional Link Field to Project Node on Client\_TM

To display the additional information in the tree, we need to add this to the Child Relationship Configurations for the Project node type.

* Select the Project\_DM node type in Client\_TM.
* Click on "ProjectPeople" in the Child Relationship Configurations.
* Click on "Add" in the "Columns Mapping" section and select the "RoleInProject" column and the element "/ProjectPeople\_LinkFields/Role" from the drop-down menus.
* Click on "Apply" to enter these changes and then click on "Apply" again to return to the main Tree Model Editor.

#### Step 9b: Select a Root

![Text 9b](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_9b.png)

Figure 35. Select Root for Client\_TM

The last thing we need to model in the Tree Model is to select a Root node for the tree.

* Select "Client\_DM → ClientProject" from the drop-down menu.
* Save the Tree Model.

#### Step 9c: Add the Tree Model to the Application Model

![Text 9c](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Text_9c.png)

Figure 36. Select Client\_TM under Models in the Client Tree Module

As we provided a workspace for, we added the modules already to the PreviewApp\_AM.
As a result, you don’t need to create a Master Detail Module Model as we have done in previous tutorials.
You do, however, need to add the Tree Model to the PreviewApp\_AM.

* Select this model in the Workspace Explorer.
* Open the ClientTreeModule in the list of "Modules"
* Select the ClientTreeModuleFlow in the "Flows" section.
* Click on the ClientTreeModuleOverview under "Scenes"
* Choose "VIEW\_ADD" from the list of "On Enter" Scene Changes.
* You can now select the Tree Model that we just created from the drop-down list in the "Models" section.
* Click apply four times and then save, and you’re finished!

You can now test your models to make sure that everything is working perfectly.

* Either reopen the workspace with the Preview App Control or deploy the models in the Simple Model Editor and refresh the webpage.

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

No new models were created.
Client\_TM was updated and added to the PreviewApp\_AM.

![Step 9 1 Project node](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_9_1_Project_node.png)

Figure 37. Columns Mapping in Child Relationship Configurations on Client\_TM

![Step 9 2 appinstaller](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Step_9_2_appinstaller.png)

Figure 38. Adding Client\_TM to the PreviewApp\_AM

## How to Test and Troubleshoot Your Models

You should be able to start the Preview App and add clients, projects and people to the Client tree to complete the use case.

|  |  |
| --- | --- |
|  | If you want to retain this test data, you can save it in your Workspace by clicking on the "Replace Workspace Data" button in the Workspace Explorer of the Simple Model Editor.  Check the [Simple Model Editor documentation](https://geta12.com/docs/sme/sme-ba-docs/index.html) for more information. |

![Testing 1](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_super1/assets/Testing_1.png)

If the Tree Model doesn’t load, please check that you have added the Tree Model to the PreviewApp\_AM correctly ([Step 9c](#Super1Step9)).
