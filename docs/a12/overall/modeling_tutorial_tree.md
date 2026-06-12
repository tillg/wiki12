---
source: https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/index.html
category: overall
docid: modeling_tutorial_tree
scraped: 2026-06-12
---

# Tutorial: Tree Modeling

## Prerequisites

Before you start this tutorial, you should have completed the following training course(s) and tutorials.
For more details on what topics are covered, please follow the links.

* [A12 Fundamentals Training](https://geta12.com/#/trainings/training-ba-modeler#modeling-fundamentals-training)
* [Relationship Modeling Tutorial](https://geta12.com/docs/overall/modeling_tutorial_relationships/index.html)

This tutorial focuses on tree models and the relevant documentation is linked below.
The terminology used in this tutorial is explained in the documentation, so we strongly recommend reading this first in the [Tree Terminology](https://geta12.com/docs/sme/sme-tm-ba-docs/index.html#_tree_terminology) section.
If you forget what a specific term means, we’ve also included a glossary of terms:

* [Tree Model documentation](https://geta12.com/docs/sme/sme-tm-ba-docs/index.html#_the_tree_model)
* [Relationship Model documentation](https://geta12.com/docs/overall/relationships_for_bas/index.html)
* [Form Modeling - Binding documentation](https://geta12.com/docs/sme/sme-binding-ba-docs/index.html)
* [Glossary of Tree Terminology](#Tree_Glossary)

This tutorial uses the [installer](https://geta12.com/installer/) which you can download from geta12.com.

|  |  |
| --- | --- |
|  | Please ensure your installer version matches this tutorial. |

## Use-case

I want to be able to show how the different departments, teams and working groups in my organization are organized.
I want to be able to view and organize this information in a tree structure like the one shown in the picture below.
Furthermore, I want to be able to create new departments, teams and working groups within the tree structure and drag and drop these to re-organize them.

I have a rigid structure in my organization where teams operate in departments and working groups operate in teams.
It would be ideal if the user was presented with different options depending on if they were adding a department, team or working group.
This would avoid errors and, for example, prevent a user from adding a working group directly to a department.

![Tree Overview](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Tree_Overview.png)

Figure 1. Use-case schema

## End Result

At the end of this tutorial, you will be able to deploy your models so that you can:

* View departments, teams and working groups in the tree with a hierarchical structure
* Organize the information using the relationship UI components in the detail form, or by simply dragging and dropping the nodes in the correct place
* Expand and collapse the nodes in the tree
* Add new departments, teams and working groups using buttons in the subheader or in the row

The end result will be similar to what you see in "Teams as Tree" menu item of the advanced workspace.

If you need to check your work as you do the tutorial, please refer to the expandable sections at the end of each step:

**Click here to see what your project should look like by now**

You can find a list of models that you created as well as fullscreen pictures of each step to guide you.

## Essentials of Tree Modeling

You may have noticed some differences between the use-case and the end result sections.
This is largely because the end result uses some specific terminology that you should understand when using Tree Models.
So, before we get started with the step-by-step modeling guide, let’s clear up any questions you might have about Tree Models.

### What Can I Do With a Tree Model?

#### Display Data From Multiple Document Model Types

The Tree Model is a UI model which displays a list of data.
Unlike the Overview Model, which is built on a single Document Model, the Tree Model can be built on multiple Document Models, referred to as ***nodes types***, which are connected by Relationship Models.
The Tree Engine is then used to display the ***hierarchical structure*** that was modeled in the Tree Model.
The user can then view the individual instances of the *node types*, referred to as ***nodes***, in the tree.

#### Create *Hierarchical Structure* by Defining *Parent* and *Child* Roles

The *hierarchical structure* is created by dividing the two roles in the respective Relationship Models into ***parent*** and ***child*** roles.
Looking back at the use-case, this means that Department A is the *parent* of Team X and that Working Group 1 is the *child* of Team X.
Once the *parent* and *child* roles have been defined, the starting point or ***root*** of the Tree Model is then set.
In the use-case, the root is the *parent* role in the DepartmentTeam Relationship Model, i.e. the departments.

#### Create *Children* and *Siblings* of Different Types

***Siblings*** are *children* of the same *parent* node.
These can be instances of the same Document Model.
For example, if there are multiple teams in one, the teams would be *siblings* of each other.
Alternatively, multiple *Child* relationships may be added to the *parent* node.
This allows *children* and *siblings* of different types to be created.

This is shown in the picture below, where Working Group 1 and Employee 1 are *siblings*.

|  |  |
| --- | --- |
|  | To extend the use-case to allow employees to be added to teams, a second *Child* relationship, TeamEmployee, would need to be added to the team *node* and another *node type* would need to be created for the employees. |

![Text What is tree](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_What_is_tree.png)

Figure 2. Overview of Tree Terminology

### How Can I Apply a Tree Model to Different Use-Cases?

The Tree Model can be applied to a wide range of use-cases.
The only limitations are:

1. There should be at least one relationship which requires a *hierarchical structure*.
2. The *nodes types* should be connected by Relationship Models. *Nodes* that cannot be linked to the *root* will not be displayed in the tree.

The columns shown in the tree can be set individually for each individual *node*.
This includes displaying data from *Additional Link Fields* in the *child* node.
Tree Models can also be used with heterogeneous *Supertype* and *Subtype* Document Models.

### What Does a Tree Model Look Like in the UI?

Data from fields from the individual *nodes* is mapped to columns in the tree using ***Columns Mapping*** options on each *node type*.
A ***Hierarchical Column*** is then selected from the list of columns on the tree.
The data in this column is then indented depending on the *node’s* level in the tree.
The "Name" column has been selected as the *hierarchical column* in the picture below.

![Text How UI tree](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_How_UI_tree.png)

Figure 3. The Tree in the Preview Application

In addition to the normal subheader and row action button options that you know from the Overview Model, the row actions may be modeled separately for each *node type* in the Tree Model.
This can be seen in the above picture, where each node has a different combination of buttons in the row.

#### Ordering of Siblings

By default, *siblings* will be arranged in the order that the links were created.
To allow the siblings to be dragged and dropped into a user determined order, you must set "Orderable" flag in the "Related Entities" section of the Relationship Model.
And check "Enable Drag And Drop" in Features section of the Tree pane of the Tree Model and "Allow Drag" in each node type configuration.
If these flags are not set, then the user will not be able to reorder siblings.

|  |  |
| --- | --- |
|  | The "Orderable" flag should be set for the child role in the relationship.  In the use-case, you could allow re-ordering of the Teams in the tree by setting the "Orderable" flag for the role, "Team", in the Relationship Model, "DepartmentTeam" |

### How Does a Tree Model Compare to Other A12 Models?

Whilst the Tree Model is similar to the Overview Model, the Tree Model is significantly more complex and has a number of extra modeling options.
The differences are summarized in the table below.

Table 1. Overview Model vs Tree Model


|  | Overview Model | Tree Model |
| --- | --- | --- |
| Number of Document Models | Limited to 1 Document Model (may be a heterogeneous *Supertype*). | A Document Model is attached to each *node type* in the Tree Model. Multiple Document Models may therefore be used. |
| *Hierarchical Structure* | No, only one level | Yes, shown in *Hierarchical Column*. The data in this column is indented depending on the level of the *node* in the tree. |
| Standard Subheader Options | Add, Search, Filter and Multi-select | Add, Multi-select, Expand / Collapse all nodes and Paste |
| Row Action Buttons, Context Menu and Default Row Action | Same configurations for all rows. | Buttons can be individually modeled for each node type. |
| Predefined Row Action Buttons | Delete | Insert as *child*, Insert above (as *sibling*), Insert below (as *sibling*), Add link(s), Delete link, Delete *Node*, Expand Sub-tree, Collapse Sub-tree, Copy *Node*, Copy *Node* and *Children*, Cut *Node*, Paste |

## Step-by-Step Instructions

### Step 1: Plan Your Tree

In the picture shown in the use-case, there are nodes and connections linking the nodes in the tree.
As discussed in ["What Can I Do With a Tree Model?"](#What_can_I_do_Tree), the nodes will be defined by Document Models and the connections between the nodes by Relationship Models.
We will then define the *parent* and *child* roles for each relationship so that the *hierarchical structure* can be shown in the Tree Model.

In the picture shown in the [Use-case](#Tree_usecase), Department A is the parent of Team X whilst Working Group 1 is the child of Team X.
There are two methods that can be used to model the above tree structure using A12.

1. A self-referencing relationship which references one common Document Model.
2. Three separate Document Models (one each for departments, teams and working groups) and two Relationship Models connecting them (DepartmentTeam and TeamWorkingGroup).

The first option requires significantly fewer models but comes with several disadvantages.

When using a self-referencing relationship, the rigid structure of three levels, departments, teams and working groups is lost as the number of levels is effectively unlimited.
In addition, we cannot prevent the user from adding a department as a child of a working group, as no distinction can be made between these two instances of the same Document Model.

The second option allows us to set a rigid three level structure and prevent the user from, for example, adding a department as a child of a working group.
As a result, we will model the tree using three separate Document Models and use two Relationship Models.
We will also be able to model different row action buttons for each of these levels, which will allow the user to easily and correctly add new departments, teams and working groups.

The fields that we plan to model on the Document Models are as follows:

| Field Type | Department\_DM | Team\_DM | WorkingGroup\_DM |
| --- | --- | --- | --- |
| String | Department Name | Team Name | Working Group Name |
| String | Head of Department | Team Leader | Working Group Leader |
| String | Location | Location | Location |

You might have noticed that this plan and use-case is an extension to the [Relationship Modeling Tutorial](https://geta12.com/docs/overall/modeling_tutorial_relationships/index.html).
Please feel free to add models to that workspace rather than starting from a blank workspace.
Just look out for the notes at the start of a new step which will give you more information about using the previous workspace.

### Step 2: Model the Document and Form Models

![Text 2](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_2.png)

Figure 4. Department\_DM

|  |  |
| --- | --- |
|  | If you have already completed the [Relationship Modeling Tutorial](https://geta12.com/docs/overall/modeling_tutorial_relationships/index.html) then you can use this workspace as a starting point.  Rather than starting from scratch, you can add the new Team Leader field to Team\_DM and Team\_FM that you modeled previously. |

Now that we know what we’re going to do, we need to create the Document Models.
This should be done using the Simple Model Editor using the skills you learned in the Fundamentals training.

* Model Document Models for the employee and team.

You can add as many fields as you like to the Document Models.
The fields that will be used in this tutorial are shown in the table [Step 1](#Tree_step1).

|  |  |
| --- | --- |
|  | As the Document Models are very similar, I recommend modeling the first Document Model and then using the copy button to model the other two Document Models. |

* Model a Form Model for each Document Model.
* Model save and cancel buttons at the bottom of the form.

|  |  |
| --- | --- |
|  | Form Models are not required by the Tree Model to display hierarchical data. We are simply creating them, so that we can add data. |

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

Department\_DM, Team\_DM, WorkingGroup\_DM, Department\_FM, Team\_FM, WorkingGroup\_FM

![Step2 1 DeptDM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step2_1_DeptDM.png)

Figure 5. Department\_DM

![Step2 2 TeamDM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step2_2_TeamDM.png)

Figure 6. Team\_DM

![Step2 3 WorkGroupDM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step2_3_WorkGroupDM.png)

Figure 7. WorkingGroup\_DM

![Step2 4 DepartmentFM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step2_4_DepartmentFM.png)

Figure 8. Department Form

![Step2 5 TeamFM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step2_5_TeamFM.png)

Figure 9. Team Form

![Step2 6 WorkGroupFM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step2_6_WorkGroupFM.png)

Figure 10. Working Group Form

### Step 3: Create the Relationship Models

![Text 3](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_3.png)

Figure 11. DepartmentTeam

|  |  |
| --- | --- |
|  | If you have already completed the [Relationship Modeling Tutorial](https://geta12.com/docs/overall/modeling_tutorial_relationships/index.html), do not delete or edit the TeamEmployee Relationship Model if you are extending the workspace from the relationships tutorial.  Instead, create new Relationship Models for the relationships between the departments, teams and working groups. |

The next step is to create the Relationship Model.
If you’ve not done this before, we recommend reading the [Relationship Model documentation](https://geta12.com/docs/overall/relationships_for_bas/index.html) and the [Relationship Modeling Tutorial](https://geta12.com/docs/overall/modeling_tutorial_relationships/index.html).
We are going to model two relationships, one between Department\_DM and Team\_DM and a second between Team\_DM and WorkingGroup\_DM.

* Click on "ADD" in the Workspace Explorer and choose "Relationship Model".
* Complete the Folder, Name, Locales and Roles and click "OK".

We can now add the roles "Department" and "Team" in the "Related Entities" section.

* Click on the "Add" button.
* Enter "Team" in both the "Label" "Role" fields.
* Select the Team\_DM Document Model using the drop-down menu and check the "unbounded" checkbox to set the multiplicity to "n".
* This role is now complete, so click "Add" / "Apply".
* Click "Add" to complete the second role using the Department\_DM Document Model.
* Model the "Department" role as above, this time using a multiplicity of 1.
* Saved the Relationship Model and use the "Generate Document Models" button to create the additional Document Models required for the relationship.

You can model the second (1:n) relationship, TeamWorkingGroup.

|  |  |
| --- | --- |
|  | As mentioned in ["What Does a Tree Model Look Like in the UI?"](#What_does_look_UI_Tree), you must set "Orderable" flag in the "Related Entities" section of the Relationship Model to allow the siblings to be dragged and dropped into a new order.  Please remember to apply this setting to roles in the relationships that you plan to use as *child node types* in the Tree Model.  This means that for Team\_DM, you need to check this box for the role,"Team", in the Relationship Model, "DepartmentTeam". |

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

DepartmentTeam, TeamWorkingGroup,

DepartmentTeam\_Department\_\_\_generated, DepartmentTeam\_Team\_\_\_generated, TeamWorkingGroup\_Team\_\_\_generated, TeamWorkingGroup\_WorkingGroup\_\_\_generated

|  |  |
| --- | --- |
|  | "Orderable" has not been modeled |

![Step3 1 DeptTeam](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step3_1_DeptTeam.png)

Figure 12. DepartmentTeam

![Step3 2 TeamWG](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step3_2_TeamWG.png)

Figure 13. TeamWorkingGroup

### Step 4: Create the Tree Model

We now have the Document and Relationship Models that we will reference when modeling the Tree Model.

* Click on "Add" in the Workspace Explorer and choose "Tree Model".
* Complete the Folder, Name (Organization\_TM), Locales and Roles and click "OK".

|  |  |
| --- | --- |
|  | If you save your progress before you complete Step 4, the Simple Model Editor might detect an invalid form.  You haven’t necessarily made a mistake. If the error message is still displayed after completing Step 4, you need to check each part of this step again to find your modeling mistake. |

##### Add the Columns

![Text 4a 1](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_4a_1.png)

Figure 14. Columns on Organization\_TM

The next step is to add the columns to the tree.

* Click on the "Add" button in the columns section.
* Assign a name and label to the column.
  Let’s start with the "Name" column.
* Click apply and continue adding columns until you have added the following 5 columns:

  + Name
  + Head of Department
  + Team Leader
  + Working Group Leader
  + Location

##### Select the Hierarchical Column

![Text 4a 2](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_4a_2.png)

Figure 15. Columns on Organization\_TM

We now need to choose a Hierarchical Column from the drop-down list of columns that have added.
The hierarchical column is the column that is used to show the tree structure.
The schematic shown in the use-case description showed a tree with Department A, Team X and Working Group 1.
The tree structure is therefore best seen using the data from the different Name fields that we planned in [Step 1](#Tree_step1).

* Select the column, "Name" in the drop-down, "Hierarchical Column".

|  |  |
| --- | --- |
|  | The columns that we have added will be displayed from left to right in the order that we added them.  The hierarchical column is not pinned to a particular position by the Tree Model.  I suggest ensuring that the Name column is at the top of the columns list using the small arrows on the right hand side so that this is the first column. |

![Tree Overview](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Tree_Overview.png)

#### Step 4a: Add Department Node Type

We now need to add three node types so that we can add the data from the three Document Models to these columns.

* Click on the "Add" button under Node Types.
* Select the Document Model "Department\_DM" from the drop-down "Document Model Reference".

##### Map the Columns

![Text 4a 3](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_4a_3.png)

Figure 16. Columns Mapping for Department Node Type

We can now assign the data from the Document Model to the columns that we created.

* Click on the "Add" button under Columns Mapping.
* Select the column "Name".
* Match the columns to the elements from the Document Model.
  In this case, assign the element, `/Department/Name`.
* Continue mapping the columns until you have mapped the following 3 columns:

  + Name
  + Head of Department
  + Location

##### Add Relationship to Child Relationship Configurations

![Text 4a 4](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_4a_4.png)

Figure 17. Child Relationship Configurations for Department Node Type

The Relationship Model that links the nodes is the next thing that we need to add.
This is done under the Child Relationship Configurations.

* Click on the "Add" button under "Child Relationship Configurations".
* Select the Relationship Name, "DepartmentTeam", from the drop-down menu.
* Set the Parent Role.
  As we want departments to be the parents of teams, the Role,"Department" should be set in the "Parent Role" drop-down menu.
* Click on "Apply" (or "Commit") to close the Child Relationship Configurations.

|  |  |
| --- | --- |
|  | The Columns Mapping section shown on this screen relates to fields from Link Document Models that will be shown in the child node.  In this case, the information would be shown in the rows where teams are shown.  As we have not modeled any Additional Link Fields, we can skip this. |

##### Add Actions to the Department Node Type

![Text 4a 5](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_4a_5.png)

Figure 18. Actions for Department Node Type

The last setting to add to the node type are the actions.
These row action buttons are similar to the row actions used in an Overview Model, however, specific row actions can be added for each type of node.

You should be familiar with modeling a delete button for a row from the Fundamentals training.
We can also add some extra actions to the rows of a tree that are specific to Tree Models.
These include a button to insert a node as a child, event\_add\_link and event\_delete\_link.

|  |  |
| --- | --- |
|  | The event\_delete\_link only deletes the links to the parents of this node.  As a result, we do not need to model it on the Department node. |

Let’s add the following buttons to the Department rows.

| Type | Event | Position | Document Model | Icon | Function |
| --- | --- | --- | --- | --- | --- |
| event | event\_delete\_node |  |  | delete | Delete this node |
| insert |  | as\_child | Team\_DM | insert\_as\_child | Add a new Team node that will be a child of this Department node |

|  |  |
| --- | --- |
|  | An event\_delete\_node action will be added to each *node type* per default. |

* Click on the "Add" button under the Actions section.
* Select the type, "event" from the drop-down menu.
* Select the event, "event\_delete\_node" from the drop-down menu that appears on the right-hand side.
* Model labels and other visual settings as you would for other buttons, for example, in the Form Model.
* Click "Commit" (or "Apply") to close the Action editor.
* Repeat the process to add the second action from the table above.
* Once you have added these two actions to the node, click "Apply" to close the node settings.

As the department documents are the base level of the tree, we can already assign a root to the tree.

* Select the Department\_DM → DepartmentTeam Document Model and Relationship Model combination in the drop-down menu "Root".

**Click here to see what your project should look like by now.**

These are the models that you created in this step:
Team\_TM

![Step4a 1 Tree](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step4a_1_Tree.png)

Figure 19. Team\_TM, edit Tree

![Step4a 2 DepartmentNode](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step4a_2_DepartmentNode.png)

Figure 20. Team\_TM, edit Department node

![Step4a 3 DepartmentChildRel](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step4a_3_DepartmentChildRel.png)

Figure 21. Team\_TM, edit Department Child Relationship Configurations

#### Step 4b: Add Team Node Type

##### Map Columns and Add Child Relationship Configurations for Team Node Type

![Text 4b 1](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_4b_1.png)

Figure 22. Columns Mapping and Add Child Relationship Configurations for Team Node Type

We also need to add node types for both the Team\_DM and the WorkingGroup\_DM.

* Click on "Add" in the "Node Types" section and repeat the process from [Step 4a](#Tree_step4a) starting with Team\_DM.
* Select the Document Model Reference and add the columns as before.
  Don’t forget to choose the column for Team Leaders this time.
* Complete the Child Relationship Configurations as before, this time using the TeamWorkingGroup relationship.

##### Add Action Buttons and a Context Menu to Team Node Type

![Text 4b 2](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_4b_2.png)

Figure 23. Actions and Context Menu for Team Node Type

We’re going to add multiple buttons to this node so let’s add a delete button as before and then model the rest of the buttons in the context menu to prevent the row from becoming overfilled.

* Model the "event\_delete\_node" as shown in [step 4a](#Tree_step4a).

We now need to add the rest of the actions to a context menu. We will also group the buttons within the context menu, so they are easier to use.

* Click on "Add" in the "Context Menu" section.
* Create a group for links by entering the name "Links" and leaving the Type field empty.
* Add the title "Manage Link".
* Add the action from the table below by clicking on the Add button in the "Actions" section and modeling the action as before.

| Type | Event | Position | Document Model | Icon | Label |
| --- | --- | --- | --- | --- | --- |
| event | event\_delete\_link |  |  | link\_off | Delete Link to Department |

* Once you have added these actions, click "Apply" to return to the Node Type editor.
* Click on "Add" in the Context Menu section again to model a second group there.
* Enter the name "AddNodes" and select "Add" in the Type field.
* Set the title as "Add Nodes" and then add the actions listed in the following table as before.

| Type | Event | Position | Document Model | Icon | Label |
| --- | --- | --- | --- | --- | --- |
| insert |  | below | Team\_DM | insert\_below | Insert Team |
| insert |  | as\_child | WorkingGroup\_DM | insert\_as\_child | Insert Working Group |

* Once you have entered the actions to the context menu, click "Apply" to return to the Node Type editor.
* Click on "Add" to return to the Tree editor.

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

These are the models created in this step
:   Team\_TM

![Step4b 1 Tree](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step4b_1_Tree.png)

Figure 24. Team\_TM, edit Tree

![Step4b 2 TeamNode](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step4b_2_TeamNode.png)

Figure 25. Team\_TM, edit Team node

![Step4b 3 TeamChildRel](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step4b_3_TeamChildRel.png)

Figure 26. Team\_TM, edit Team Child Relationship Configurations

![Step4b 4 TeamContextLinks](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step4b_4_TeamContextLinks.png)

Figure 27. Team\_TM, edit Team Context Menu, Links group

![Step4b 5 TeamContextAdds](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step4b_5_TeamContextAdds.png)

Figure 28. Team\_TM, edit Team Context Menu, Add Nodes group

#### Step 4c: Add Working Group Node Type

##### Map Columns and Add Child Relationship Configurations for Working Group Node Type

![Text 4c 1](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_4c_1.png)

Figure 29. Columns Mapping and Add Child Relationship Configurations for Working Group Node Type

Finally, let’s add the Working Group node.
I imagine that you know what you’re doing by now, but you can refer back to the previous steps if you need a quick reminder.

* Click on add and chose the Document Model (WorkingGroup\_DM) and map the columns as in [Step 4a](#Tree_step4a) and [4b](#Tree_step4b).

Don’t forget to choose the column for Working Group Leaders this time.

|  |  |
| --- | --- |
|  | As Working Groups are the last level, we don’t need to add anything to Child Relationship Configurations, so leave this area blank. |

##### Add Action Buttons and a Context Menu to Working Group Node Type

![Text 4c 2](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_4c_2.png)

Figure 30. Actions and Context Menu for Working Group Node Type

Let’s keep the buttons simple on this node.

* Simply model the following buttons in the Actions section.

| Type | Event | Position | Document Model | Icon | Function |
| --- | --- | --- | --- | --- | --- |
| event | event\_delete\_node |  |  | delete | Delete this node |
| insert |  | below | WorkingGroup\_DM | insert\_below | Add a new working group node that will be a sibling, i.e. Have the same parent team node |
| event | event\_delete\_link |  |  | link\_off | Delete the link to the parent of this node |

* Click on "Apply" to exit the Node Type editor and return to the Tree editor.

**Click here to see what your project should look like by now.**

These are the models that you created in this step:
Team\_TM

![Step4c 1 Tree](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step4c_1_Tree.png)

Figure 31. Team\_TM, edit Tree

![Step4c 2 WGNode](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step4c_2_WGNode.png)

Figure 32. Team\_TM, edit Working Group node

#### Step 4d: Complete the Tree

![Text 4d](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_4d.png)

Figure 33. Subheader buttons on Tree

|  |  |
| --- | --- |
|  | If you are working with models based on the relationships tutorial, you can add Employee\_DM as a node type to the Tree. This node type should be modeled like the working group node type as the employees have no children in the tree.  Don’t forget to add the TeamEmployee Relationship Model to the Child Relationship Configurations on the team node type.  Please note, this will now mean that you can add employees to teams. To be able to add employees to departments and working groups, two new relationships need to be created and then added to their respective nodes under Child Relationship Configurations. |

We need to add some actions to the subheader of the tree before it is completed. This will allow us to add root nodes, in this case, departments, to the tree.

* Switch to the Custom Actions tab.
* Add an "event\_add\_root\_node" button to the subheader.
  This is modeled in the same way as when you add buttons to an Overview Model.
* Click on "Add" again to add the "Expand All PopUp".
* Once you have done this, switch back to the Tree tab and check the box "Enable Expand/Collapse The Whole Tree" near the bottom of the page.
* Finally, switch to the Model Settings tab and add a Label.
* We can now save the Tree Model.

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

Team\_TM

![Step4d 1 CustomActions](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step4d_1_CustomActions.png)

Figure 34. Team\_TM, Custom Actions

![Step4d 2 ModelSettings](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step4d_2_ModelSettings.png)

Figure 35. Team\_TM, Model Settings

### Step 5: Use Master Detail Module Model to Create the Module With the Tree

![Text 5](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_5.png)

Figure 36. Organization\_MDM

|  |  |
| --- | --- |
|  | If you are working with models based on the relationships tutorial, and you added Employee\_DM to the tree in the previous step, you will now need to add the Form Model in the Form Mapping stage below. |

You’re now ready to add the Tree Model to a new module.

* Click on "ADD" in the Workspace Explorer and choose "Master Detail Module Model".
* Complete the Folder, Name (Organization\_MDM), Locales and Roles and click "OK".
* Select the Type "Tree" using the radio buttons.
* Use the drop-down menu to select the Tree Model we just created in [Step 4](#Tree_step4), "Organization\_TM".

The Document Models are already added to the Form Mapping section.

* Select the Form Models from [Step 2](#Tree_step2) using the drop-down menus in this section.
* Finally, click on the Model Settings tab at the top and add a Main Menu Label.
* Save the Master Detail Module Model.

The Master Detail Module model can now be added to the App Model.

* Click on the PreviewApp\_AM and navigate to the Model Settings tab.
* Click on the Add button in the Model References section at the bottom.
* Select "module-masterdetail" and the Organization\_MDM model that we just created using the two drop down menus.
* Save the model, and you have a working Tree Model that you can add data to!

You can now test your models to make sure that everything is working perfectly.
You can jump down to the [Testing section](#Tree_test) to try out your model.

|  |  |
| --- | --- |
|  | The next steps are not required, but they do add functionality to the Tree Model.  By completing [Step 6](#Tree_step6) and [Step 7](#Tree_step7), you will be able to edit the links to a document by clicking on an action button in the Tree. |

**Click here to see what your project should look like by now.**

These are the models that you created in this step:
Organization\_MDM

![Step5 1 MDM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step5_1_MDM.png)

Figure 37. Organization\_MDM

![Step5 2 App](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step5_2_App.png)

Figure 38. Add Organization\_MDM to PreviewApp\_AM

![Step5 3 PreviewApp](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step5_3_PreviewApp.png)

Figure 39. Test Model in Preview App Controller

### Step 6: Create Form Models to Manage Links Between Nodes

In the [Relationship Modeling Tutorial](https://geta12.com/docs/overall/modeling_tutorial_relationships/index.html), you learnt how to manage the links between documents using Bindings on the Form Model.
The same Bindings can be integrated into the Tree Model.
To achieve this, we need to add a button to a node to edit or delete the links and create a new Form Model which we can add the Bindings to.
Let’s start by creating these Form Models.

When the user clicks on the new buttons in the tree, we don’t want to edit the whole form, but just the links.
This means that we need to model a new Form Model where the Bindings are shown but the data fields are not shown.

As we have two relationships, we will need two Form Models which will be shown when we click on a button on the Department or Team node.

##### Create a Form Model to Manage Teams Linked to a Department

![Text 6a](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_6a.png)

Figure 40. Department\_Links\_FM

Let’s create a form to maintain the links of a department first.

* In the Simple Model Editor, create a new Form Model called Department\_Links\_FM and set the Document Model to be Department\_DM as before.
* Add Save and Cancel buttons to the footer and save the blank Form Model.

##### Add Bindings to the Blank Department\_Links\_FM

![Text 6b](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_6b.png)

Figure 41. Binding on Department\_Links\_FM

Now add a Dual Pane Selection in the "Department\_Links\_FM".

* Add a new Binding by dragging and dropping "DepartmentTeam" into the first screen as you did in [Relationship Modeling Tutorial](https://geta12.com/docs/overall/modeling_tutorial_relationships/index.html).
* Select "Dual Pane Selection" using the "Component Type" drop-down menu.
* Create new Overview Models using the add buttons next to the Available Items Overview and Selected Items Overview fields.

##### Create a Form Model to Working Groups Linked to a Team

![Text 6c](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_6c.png)

Figure 42. Team\_Links\_FM

* Repeat this process for the second link form, "Team\_Links\_FM", and this time set the Document Model to be Team\_DM.
* Once again, create a blank Form Model with Save and Cancel buttons.

##### Add Bindings to the Blank Team\_Links\_FM

![Text 6d](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_6d.png)

Figure 43. Binding on Department\_Links\_FM

Add a Dual Pane Selection, this time to the "Team\_Links\_FM".

* Create a new Binding by dragging and dropping "TeamWorkingGroup" from the Data Models Section into the first screen.
* Select "Dual Pane Selection" using the "Component Type" drop-down menu.
* Create new Overview Models using the add buttons next to the Available Items Overview and Selected Items Overview fields.

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

Department\_Links\_FM, Team\_Links\_FM

![Step6 1 Department Link Binding](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step6_1_Department_Link_Binding.png)

Figure 44. Department\_Links\_FM with Binding in the Simple Model Editor

![Step6 2 Team Link Binding](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step6_2_Team_Link_Binding.png)

Figure 45. Team\_Links\_FM with Bindings in the Simple Model Editor

### Step 7: Add Actions to Tree Model and Update the Master Detail Module Model

To use the Form Models that we created in [Step 6](#Tree_step6) in the Tree Model, we now need to add Actions to the Node Types in the Tree Model and add the Form Models to the Master Detail Module Model.

##### Add Action to Department Node Type

![Text 7a](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_7a.png)

Figure 46. Edit Links Action on Department Node Type

* Open the Tree Model that you created in [Step 4](#Tree_step4).
* Select the Node Type with the Document Model Reference, "Department\_DM".
* Scroll down to the Actions section and click on the "Add" button.
* Create the new button by adding the information shown in the table below to the form.
  This is the same process that you used for creating Actions in [Step 4](#Tree_step4).

| Type | Event | Position | Document Model | Icon | Function |
| --- | --- | --- | --- | --- | --- |
| event | event\_add\_link |  |  | insert\_link | Add child nodes using a relationship UI component that you will be familiar with from the Relationship Model documentation and tutorial |

##### Add Action to Team Node Type

![Text 7b](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_7b.png)

Figure 47. Edit Links Action on Department Node Type

The same button should be added to the Team Node.

* Click "Apply" to return to the Tree Model Editor and select the Node Type with the Document Model Reference, "Team\_DM".
* Scroll down to the Context Menu section and click on the "Links" group that we created before.
* Click the "Add" button under the Actions section and create the new button by adding the information shown in the table below to the form.
* Save the changes to the Tree Model.

| Type | Event | Position | Document Model | Icon | Function |
| --- | --- | --- | --- | --- | --- |
| event | event\_add\_link |  |  | insert\_link | Add child nodes using a relationship UI component that you will be familiar with from the Relationship Model documentation and tutorial |

##### Add Form Models to the Master Detail Module Model

![Text 7c](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Text_7c.png)

Figure 48. Link Form Models in Master Detail Module Model

The last step is to add the Form Models to the Master Detail Module Model.

* Select "Organization\_MDM" from the Workspace Explorer that we created in [Step 5](#Tree_step5).
* Remove the Tree Model from the drop-down menu by clicking on the "X" on the right-hand side.
* Then re-select "Organization\_TM" in the drop-down menu.

When you do this, you will see that "Department\_DM" and "Team\_DM" have been added to the list of Relationship Editors.

* Add the Form Models that we created in [Step 6](#Tree_step6) to the Relationship Editor section.
* As in [Step 5](#Tree_step5), the Form Models from [Step 2](#Tree_step2) should be added to the Form Mapping.

You’re now finished and can test your models.

**Click here to see what your project should look like by now.**

These are the models that you created in this step:

No new models were created

![Step7 1 Department Link Action](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step7_1_Department_Link_Action.png)

Figure 49. Add Links Action on Department Node

![Step7 2 Team Link Action](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step7_2_Team_Link_Action.png)

Figure 50. Add Links Action in Context Menu on Team Node

![Step7 3 MDM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Step7_3_MDM.png)

Figure 51. Relationship Editors on Master Detail Module Model

## How to Test and Troubleshoot Your Models

* Start your workspace using the Preview App Control and log in (admin:a12).
* Connect your Workspace to the server using the "Configure Server Connection" tab in the top right-hand corner in the Simple Model Editor (admin:a12).
* Deploy your workspace and refresh your browser tab.
* Navigate to the module that you added in [Step 5](#Tree_step5) and updated in [Step 7](#Tree_step7).
  The module will have the label that you added to the Main Menu Label section of the Model Settings Tab in the Master Detail Module Model.
* Add the three nodes from the use-case schema.

  1. Add the department using the add buttons we modeled in the subheader of the tree.
  2. Create a team node by clicking on the insert as child button in the department node.
  3. Create a working group by clicking on the insert as child button in the team node.

![Testing 1](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Testing_1.png)

Further Departments, Teams and Working Groups may be added using the insert below, insert as child and add buttons that we created in [Step 4](#Tree_step4).
You can then manage the links between nodes using the edit link buttons we created in [Step 7](#Tree_step7), as shown in the Figure below.

|  |  |
| --- | --- |
|  | If you want to retain this test data, you can save it in your Workspace by clicking on the "Replace Workspace Data" button in the Workspace Explorer of the Simple Model Editor.  Check the [Simple Model Editor documentation](https://geta12.com/docs/sme/sme-ba-docs/index.html) for more information. |

|  |  |
| --- | --- |
|  | Don’t worry if teams or working groups seem to disappear when you delete links to them.  They are still there and can be re-added using the edit link buttons. |

![Testing 2](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_tree/assets/Testing_2.png)

Figure 52. Edit Linked Working Groups using Edit Link Button on Team Node

If you selected "Orderable" in the roles of the Relationship Models, you will be able to reorder the documents in the tree using drag and drop.

There are also several options that can be used to change the look of the tree.

* Change the relative width of the columns (Tree model → Tree tab → Columns → edit column and change width)
* Add the node action buttons to a context menu (Tree model → Tree tab → Node Types → remove actions from Actions section and add them to Context menu section)
* Change the size of the detail screen (Master Detail Module model → Master Detail tab → Form width → enter a number between 1 and 11. The default is 6)

|  |  |
| --- | --- |
|  | Did you use the models from the relationship tutorial and successfully integrate the employee data into this tree?  If so, congratulations!  You have used the Document, Form and Relationship Models that you modeled in the previous tutorial and integrated them into the Tree model. You added Employee\_DM as an extra node to the tree in [Step 5](#Tree_step5). You also added the TeamEmployee Relationship Model to the child activities in the Team node so that employees can be added to teams.  If you enjoyed this, you can see all this and more in ["How to put it together"](https://geta12.com/docs/overall/modeling_tutorial_super1/index.html). |

## Glossary

| Term | Description |
| --- | --- |
| **Binding** | Used to integrate relationships into the Form Engine. The Binding allows configuring a UI for linking documents to a single "main" document to be modeled. |
| **Child** | The term Child is used to describe nodes or documents relative to each other. The Child is the role in a relationship or document in the tree that is one level further from to the starting point of the tree, the root. |
| **Hierarchical Column** | The Hierarchical Column is a special column in the tree. The tree structure is then shown in the Hierarchical Column by indenting the data in this column depending on the node type that it belongs to. It has an arrow button to expand/collapse the children of the node. |
| **Link** | An instance of a Relationship Model; specifies the connection between an instance of one role of the relationship and an instance of the other role of the relationship. In the case of a tree, this is the connection between a node in the tree and the nodes directly above and below it in the tree structure. |
| **Nodes and Node Types** | Node types in A12 trees are always assumed by Document Models. The connection between node types in the tree is taken from Relationship Models, in which the respective Document Models filled roles. For a tree, the two roles in a relationship need to be divided into parent and child roles. The node is then the document in the tree that is linked to either parent nodes, child nodes or both. |
| **Parent** | The term Parent is used to describe nodes or documents relative to each other. The Parent is the role in a relationship or document in the tree that is one level closer to the starting point of the tree, the root. |
| **Relationship Model** | Determines which Document Models are linked, along with some other parameters. |
| **Role** | This refers to a role in the Relationship Model. It is used to identify the part that a document plays in the link to another document. |
| **Root** | This is the starting point of the hierarchical structure in the tree. The root is therefore a node that does not have a parent. |
| **Sibling** | Children of the same parent are called siblings. |
| **Target Role** | Links to this role can be edited and viewed in a Relationship UI Component like the Dual Pane Selection. |
| **Tree Model** | The Tree Model is an A12 UI model which focuses on showing lists of data in a hierarchical structure based on relationships between the entities. |
