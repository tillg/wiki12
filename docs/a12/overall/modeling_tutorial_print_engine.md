---
source: https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/index.html
category: overall
docid: modeling_tutorial_print_engine
scraped: 2026-06-12
---

# Tutorial: Print Modeling

## Prerequisites

The target audience for this tutorial are business analysts. Some prior knowledge of the tools is assumed.
Before you start this tutorial, you should have completed the following training course(s) and tutorials. For more details on what topics are covered, please follow the links.

* [A12 Fundamentals Training](https://geta12.com/#/trainings/training-ba-modeler#modeling-fundamentals-training)
* [Basic Modeling Tutorial](https://geta12.com/docs/overall/modeling_tutorial_basics/index.html)

The tutorial focuses on modeling with the ***Print Model Editor***, which is included within the SME.
The relevant documentation is linked below.
The terminology used in this tutorial is explained in the documentation, but we’ve also included a glossary of terms in case you forget what a specific term means:

* [Document Modeling documentation](https://geta12.com/docs/sme/sme-dm-ba-docs/index.html)
* [Form Modeling documentation](https://geta12.com/docs/sme/sme-fm-ba-docs/index.html)
* [Print Modeling documentation](https://geta12.com/docs/print_engine/print-modeling-documentation/index.html)
* [Print Model Glossary](#PrintModel_Glossary).

This tutorial uses the [installer](https://geta12.com/installer/) which you can download from geta12.com.

|  |  |
| --- | --- |
|  | Please ensure your installer version matches this tutorial. |

## Use-case

I want to be able to create a PDF document so that I can send my customer their invoice.
The PDF document needs to include data from my application and standardized elements from a template.
The template must be able to adapt to the data from my application so that the end result looks professional.
I should be able to define which data is used and how it is grouped so that I can show:

* All the products in the order as a list
* The billing address
* The delivery address
* The payment method.

I would also like to be able to view a preview of my final PDF document so that I can check the PDF document and save it locally.

![Use-case](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Use_Case_Schema.png)

Figure 1. Use-case schema

## End Result

At the end of this tutorial, you will be able to combine your ***Print Model*** with local data so that you can:

* View a preview of your invoice PDF document in the ***Print Model Preview***.
* Create new test data using the Form Model Preview.
* Check that the layout set in the *Print Model* looks professional when combined with different data from the application.
* Save PDF documents that you generated in the *Print Model Preview*.

If you need to check your work as you do the tutorial, please refer to the expandable sections at the end of each step:

**Click here to see what your project should look like by now**

You can find a list of models that you created as well as fullscreen pictures of each step to guide you.

## Essentials of Print Modeling

As you have just read, we will combine data from our application with a *Print Model* to allow us to create a PDF document.
This means that we will need to create a few models that define our data structure and allow data entry.

As the A12 Installer adds both the modeling tools and a folder of workspaces to the installation folder, we can save some time by using some of these pre-existing models.
We will use the Basic Workspace containing the Document Model "Invoice\_DM" and the Form Model "Invoice\_FM" as a starting point in this tutorial.
As you know from your Fundamentals training or from the [Basic Modeling Tutorial](https://geta12.com/docs/overall/modeling_tutorial_basics/index.html), Document and Form Models can be created and edited using the Simple Model Editor.

These models and the test data we can create using these models in the Simple Model Editor will then be combined with a *Print Model* as shown in the following schema.

We will then use the *Print Model Preview* to create the final PDF document.
As we will be using a new model, the *Print Model*, and the *Print Model Editor* in the SME, let’s clear up any questions you might have about Print Models before we start with the step-by-step modeling guide.

![Interaction Models](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Interaction_Models.png)

Figure 2. Interaction of Models

### What Can I Do With a Print Model

*Print Models* allow modelers to create a template for PDF documents.
A wide range of ***Print Model Elements*** can be added to *Print Models* so that data from the application can be combined with standardized content in the template.

Content that comes from data saved in your application is referred to as ***dynamic content***.
The standardized content in the template is referred to as ***pre-determined content***.
You can then define the layout of these *Print Model Elements* as well as the styling of the *dynamic* and *pre-determined content* in the resulting PDF document.

Furthermore, you can use small calculations, for example, to concatenate different fields to be displayed as one element.

The *Print Model Editor* is the dedicated model editor that enables you to easily create *Print Models* as well as edit already existing *Print Models*.
Furthermore, a preview of the PDF document that results from combining the *Print Model* with data from your A12 application is possible.

### How Can I Apply Print Models to Different Use-Cases?

This tutorial demonstrates the core functionality of *Print Models*:

* adding *dynamic* and *pre-determined content* to *Print Model Elements*
* setting the layout of these elements
* styling the content

*Print Models* can be used for a wide range or use-cases by following the same modeling steps.

* *Dynamic content* can be added to the *Print Model* from one or more Document Models from your application.
* *Pre-determined content* can be tailored to each individual use-case so that you can, for example, easily add your company logo and details to your *Print Model*.
* The layout of the *Print Model Elements* can be freely set to suit your use-case.
* The styling of the content may also be determined by the modeler to ensure that it suits the use-case.

### What Does a Print Model Look Like in the UI?

*Print Models* are not seen in the application. Instead, *Print Models* are used to create a PDF document based on *pre-determined content* and *dynamic content* that the user has entered into the application.

The output of a *Print Model* is a PDF document that can be generated using test data in the *Print Model Preview* and saved locally. Alternatively, you can use the ***Print Engine*** to combine data from your application’s database with your *Print Model*.

### How Does the Print Model Compare to Other A12 Models?

*Print Models* are similar to Form Models as we can model the layout and styling of *dynamic* and *pre-determined content*.

As you saw at the beginning of [Essentials of Print Modeling](#Print_Essentials), *Print Models* can use the same data source as Form Models.
In other words, data saved as Documents referencing a specific Document Model in your database may be used by both *Print Models* and Form Models.
In the case of Form Models, this data is displayed to the user in the application in Controls using the layout that we modeled.
In the case of *Print Models*, the data forms the *dynamic content* that can be added to the PDF document.

Equally, *Print Model Elements* are similar to Screen Elements that you are familiar with in a Form Model, as the modeler uses these elements to set the layout.
*Print Model Elements* may also be nested to allow more complex layouts to be modeled.
In contrast to the Screen Elements of a Form Model, *Print Model Elements* do not exist on a grid but may be freely placed using drag and drop in the Editor Stage of the Print Model Editor.

Table 1. Form Model vs Print Model


|  | **Form Model** | **Print Model** |
| --- | --- | --- |
| Content | Data from one or more Document Models.  Labels may be added to the Screen Elements.  In addition, Text and Expression Cells may also be used to add pre-determined content | Data from one or more Document Models.  In addition, *pre-determined content* may be added to the *Print Model Elements*. |
| Structure | Form Models have one or more screens.  Each screen has header and footer areas which may contain labels or action buttons.  Labels and action buttons may be modeled for the whole Form or for each screen individually. | Print Models have one or more ***Segments***.  When you add a new *Segment*, you start a new page and define the page orientation. Depending on how much content you add, each *Segment* will therefore result in one or more DIN-A4 pages in the PDF document.  ***Sections*** are optional containers for elements that result in headers, footers or both in the resulting PDF document. As *Sections* can be specified for either the first page or for all pages we can model a cover page for our PDF document with different content. |
| Layout | The layout of a Form is defined through the nested structure of Sections and Control Grids.  This automatically defines the font size of the labels and allows data to be grouped.  Columns can then be modeled for Multi-Column Sections and Control Grids that allow data to be presented side by side. Form models work with a grid of 12 columns to simplify modeling.  This means that Forms can be resized in your application to allow display on different devices and screen sizes and the elements are resized automatically. | The layout of the PDF document is defined by adding *Print Model Elements* to *Segments*. Furthermore, *Area*, *Bounding Box* and *Horizontal Line* elements may be added to create a nested structure.  The text styling may be modeled for each *Print Model Element*.  *Print Model Elements* may be freely added to the *Print Model* in the ***Editor Stage*** of the *Print Model Editor*. There are no restrictions on the number or relative sizing of columns.  The result is a WYSIWYG Model that outputs a PDF document to DIN-A4 pages. |
| Repeatable Fields and Groups | Repeatable Fields and Groups are represented in the Form Model by Repeats.  Modelers may choose between three different visualizations out-of-the-box which allow different data entry options.  The modeler can freely decide how many columns to show in the list view of the Repeat. | One option to represent Repeatable Fields and Groups in the *Print Model* is by using ***Table Elements***. Other options would be Area and List Elements.  The modeler can add one or more columns to the *Table Element* to visualize some or all of the data in the repeatable group. |

Finally, the preview functions in the Form Model Editor and the *Print Model Editor* allow modelers to evaluate their models before they are used in a productive application.
However, in contrast to the Form Model Preview, which allows modelers to enter data and either import or export this as a json file, the *Print Model Preview* must be provided with the *dynamic content* in the form of an appropriately structured json file.

## Step-by-Step Instructions

### Step 1: Prepare your Workspace

In order to show you Print Modeling with the minimum effort, we’re going to extend models used in the "basic" workspace that came with the installer.
This means you will need to:

* Make a copy of this workspace.
* Add some fields to the Document Model.
* Update Invoice\_FM with the newly added fields.
* Use the Form Model Preview to enter the test data.
* Export the test data from the Preview as a json file.

Let’s start by planning the fields that will need to be added.

#### Step 1a: Plan Your Fields

Most of the *dynamic content* that we will use has already been modeled in the following Document Models from the "basic" workspace:

* Invoice\_DM which references the following Document Models as [includes](https://geta12.com/docs/sme/sme-dm-ba-docs/index.html#includes)

  + Addresses\_DM
  + Order\_DM
  + PaymentInfo\_DM

The majority of the data shown in the [use-case](#Print_Model_Usecase) has already been modeled in these Document Models:

Table 2. Elements of Invoice\_DM that have already been modeled


| Element in Use-case | Document Model | Document Model referenced as include | Path to Group |
| --- | --- | --- | --- |
| Billing Address | Invoice\_DM | Address\_DM | /Invoice/Addresses/BillingAddress |
| Delivery Address | Invoice\_DM | Address\_DM | /Invoice/Addresses/ShippingAddress |
| List of ordered Products | Invoice\_DM | Order\_DM | /Invoice/Order/OrderInformation |
| Payment Info | Invoice\_DM | PaymentInfo\_DM | /Invoice/PaymentInfo |

We will model some additional fields to these Document Models in [Step 1b](#PrintModel_text_Step1b) so that we can show you a few more *Print Model* features.

Table 3. Extra fields that will be modeled


| Element in Use-case | Document Model | Document Model referenced as include | Path to Field |
| --- | --- | --- | --- |
| Invoice Number | Invoice\_DM | Order\_DM | /Invoice/Order/InvoiceNumber |
| Payment Info Deadline | Invoice\_DM | PaymentInfo\_DM | /Invoice/PaymentInfo/PaymentTime/Deadline |

This will mean that we can add the Invoice Number to the header of the PDF document.
The logo of the company placing the order will be shown in the billing address section of the PDF document.
Finally, we will add the deadline to the Delivery Terms and Conditions at the bottom of the Invoice.

#### Step 1b: Copy "basic" Workspace

![Text Step1b](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step1b.png)

Figure 3. Copy "basic" Workspace using the Preview App Control

* Start the Preview App Control.
* Select the "basic" Workspace using the drop-down menu.
* Click on the "Copy selected workspace" button (highlighted pink in screenshot above).
* Choose a location for the copy of the workspace and give it a name. In this tutorial it will be called "Tutorials - Print".
* Click save

You can now open this new workspace using your Simple Model Editor.

#### Step 1c: Edit "Order\_DM"

![Text Step1c](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step1c.png)

Figure 4. "InvoiceNumber" Field modeled in the "Order" Group

* Open "Order\_DM" by clicking on it in the Workspace Explorer.
* Right-click on the Group "Order".
* Add a new Number Field "InvoiceNumber" as the first field.
* Set the Label to "Invoice Number".
* Apply the changes and save your model.

#### Step 1d: Edit "PaymentInfo\_DM"

![Text Step1d](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step1d.png)

Figure 5. "Deadline" Field modeled in the "PaymentTime" Group

* Open "PaymentInfo\_DM" by clicking on it in the Workspace Explorer.
* Add a new Group "PaymentTime".
* Add a Field "Deadline" with the Data Type "Date Range".
* Set the Label to "Deadline".
* Set the "Required" checkbox and the Format "YYYY-MM-DD/YYYY-MM-DD".
* Apply the changes and save your model.

#### Step 1e: Edit Your Form Model "Invoice\_FM"

![Text Step1e](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step1e.png)

Figure 6. Company Logo added to "Invoice\_FM"

As we will use the Form Model Preview to enter and save test data, we now need to add the new elements of the Document Model that we created in [Step 1c](#PrintModel_text_Step1c) and [Step 1d](#PrintModel_text_Step1d) to the Form Model.

|  |  |
| --- | --- |
|  | As Invoice\_DM includes Address\_DM, Order\_DM and PaymentInfo\_DM, these fields will have been automatically added to this Document Model.  The paths to the new Fields in "Invoice\_DM" are shown in the table in [Step 1a](#PrintModel_text_Step1a). |

* Drag and drop the Field "InvoiceNumber" into the Control Grid “OrderControls”.
* Drag and drop the Field "Deadline" into the Control Grid “PaymentInfoControls”.
* Save the changes to your Form Model.

#### Step 1f: Input and Save Your Test Data

![Text Step1f](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step1f.png)

Figure 7. Form Model Preview of "Invoice\_FM" with test data

|  |  |
| --- | --- |
|  | Test Data will be saved in the "data" folder.  This data can be used in the Preview App and is also compatible with the Print Model Preview. |

The final preparation step is to create test data that we can use in the *Print Model Preview*.
This test data will be the *dynamic content* in the PDF document.
If we create new test data, this will change the output of the *Print Model Preview*.
We can save a test data json file by entering data into the Form Model Preview and Exporting the Data to File.

* Open the Form Model Preview.
* Fill out the Form.

  + Add a billing address and a different shipping address.
  + Add a preferred delivery date and time.
  + Add at least two items to the order.
    We will display this data in a table and as a pie chart so the more items you add, the better this will be.
  + Choose a payment method and complete the relevant payment details including the new data about when the invoice should be paid.
* Export the data by clicking on the "Data" tab, which is part of the side-menu, and selecting "Save".

|  |  |
| --- | --- |
|  | The virtual folder "data" and its subfolders "attachments", "documents" and "links" are always visible in your workspace but they may exist virtually.  If this folder has never been used before, clicking on "Save" in the Form Model Preview will add the relevant folders to your workspace.  Your test data will be saved in the "documents" folder and a green "Document saved" toast will be shown with the document id. |

We use this test data in [Step 7: View your Print Model in the Print Model Editor Preview](#PrintModel_text_Step7).

**Click here to see what your project should look like by now.**

The Document and Form Models were updated to allow the following test data to be created in this step:

Order\_DM, PaymentInfo\_DM, Invoice\_FM, Test Data json file with random id

![Step1a InvoiceNumber](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step1a_InvoiceNumber.png)

Figure 8. Number Field "InvoiceNumber" in the "Order" Group of the Order\_DM

![Step1b Deadline](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step1b_Deadline.png)

Figure 9. Date Range field "Deadline" in the Group "PaymentTime"

![Step1c InvoiceFM](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step1c_InvoiceFM.png)

Figure 10. Form Model "Invoice\_FM" with new Controls.

![Step1d FMPreview1](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step1d_FMPreview1.png)

Figure 11. Form Model Preview showing the first screen of the Invoice form.

![Step1e FMPreview2](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step1e_FMPreview2.png)

Figure 12. Form Model Preview showing the second screen of the Invoice form.

![Step1f FMPreviewExport](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step1f_FMPreviewExport.png)

Figure 13. Save the test data to the folder, "data", in your workspace.

### Step 2: Plan Your Print Model

So far, we have prepared the *dynamic content* of the PDF document by adding fields to our Document Model "Invoice\_DM" and generating test data.
Now, we think about how this data should be structured in the resulting PDF template.

[How Does the Print Model Compare to Other A12 Models?](#PrintModel_to_other_A12_Models) compares the *Print Model* to the Form Model so let’s base our layout on the layout we see in "Invoice FM".
We will model two *Segments* so that we have at least two pages in our PDF document matching the pages that you saw in the [Use-case](#Print_Model_Usecase):

1. Cover sheet
2. Invoice details that will be similar to "Invoice\_FM"

We will also add two *Sections*:

1. *Section* that will only be displayed on the cover sheet.

   * This will not have any content and will serve to overwrite the other section.
2. *Section* that will be displayed on the remaining pages of the resulting PDF document.

   * Header with information about the company that created the invoice, the invoice number and issue date
   * Footer with the page number

![Step2a PrintModelPlan](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step2a_PrintModelPlan.png)

Figure 14. *Print Model* structure

If you are eager to know more about *Segments* and *Section* take a look at [Print Model Editor documentation for *Segments*](https://geta12.com/docs/print_engine/print-modeling-documentation/index.html#ModelSegment)

### Step 3: Start Print Modeling

Now that we have created our test data and made a plan for the Print Model, it’s time to get started.
We will start by setting up the Print Model so that we can:

* Use dynamic content in the pdf (the data that you produced in [Step 1f](#PrintModel_text_Step1f)).
* Use the Text Styles so that the pdf matches our Project design scheme.

#### Step 3a: Create Your "Invoice\_PM"

![Text Step3a](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step3a.png)

Figure 15. Create Your New *Print Model* "Invoice\_PM"

We can now start modeling the *Print Model*.

* Click on the "+" button (Add Button) in your ***Workspace Explorer***.
* Choose the *Print Model*.
* Select the folder were you want to save this model, we will choose "models".
* Name the *Print Model* "Invoice\_PM" and save it.
* Add the Locals *en* and *de*.
* Add the Roles *tester* and *reviewer*.
* Click on *OK* and the *Print Model Editor* will open.

#### Step 3b: Add Document Model References

![Text Step3b](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step3b.png)

Figure 16. Add Document Model References to "Invoice\_PM"

The *Print Model* opens and the ***General Tab*** is selected per-default in the *Print Model Editor*.

The next step is to link your *Print Model* with an A12 Document Models to allow the inclusion of *dynamic content*.

* Go to the ***Schema Tab***, it’s the second tab on the left-hand side of the *Print Model Editor*.
* Click on "Document Model References".
* Select the Document Model "Invoice\_DM" using the drop-down menu
* Add it to the references by clicking on the "+ ADD" button.

After we add the ***Document Model References*** to the *Print Model* we can add an optional "Alias".
This can be used to make it clearer for what purpose this A12 Document Model is used.

|  |  |
| --- | --- |
|  | The drop-down menu is filled with all the Document Models in the current Workspace.  You can reference additional Document Models by repeating the process above. |

#### Step 3c: Create Your Text Styles

![Text Step3c](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step3c.png)

Figure 17. Text Styles used on "Invoice\_PM"

While the *PME* comes with a "Default Text Style", we can add multiple custom text styles in the ***Text Styles Tab*** by clicking the "Add New Text Style" button in the right lower corner.

For each newly created text style, we can choose between different semantics, three different fonts, font size, and line spacing.
Let’s add the following text styles:

Table 4. Text Styles


| Name | Semantic | Font | Font Size | Line Height |
| --- | --- | --- | --- | --- |
| Cover Sheet | Headline 1 | Noto Sans Mono | 20 | 30 |
| Invoice | Headline 2 | Noto Sans Mono | 14 | 21 |
| Invoice Text | Paragraph | Noto Sans Mono | 10 | 15 |

* Click on the "Text Style" tab, it’s the third tab on the left-hand side.
* Click the "Add New Text Style" button.
* Click on "New Text Style" that you just created.
* Enter the text style settings for the text style "Cover Sheet".
* Repeat this process for the text styles "Invoice" and "Invoice Text".

All the changes we make are saved by the *PME* but are not automatically committed to the *Print Model*.
This means that if we are happy with our changes, we need to commit them to the saved *Print Model*.

* Open the ***Commit changes Tab***, it’s the last tab on the left-hand side of the *Print Model Editor*.
* Push the "COMMIT SELECTED CHANGES AND TRUNCATE HISTORY" button.

All the changes will be committed and saved in the *Print Model*.

**Click here to see what your project should look like by now.**

The Print Model with Document Model References and Text Styles was created in this step:

Invoice\_PM

![Step3a GeneralTab](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step3a_GeneralTab.png)

Figure 18. "General" Tab showing Model name and Roles.

![Step3b SchemaTab](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step3b_SchemaTab.png)

Figure 19. "Schema" Tab showing reference to "Invoice\_DM" in the Document Model References.

![Step3c TextStyleCoverSheet](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step3c_TextStyleCoverSheet.png)

Figure 20. "Text Styles" Tab showing the Text style "Cover Sheet"

![Step3d TextStyleInvoice](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step3d_TextStyleInvoice.png)

Figure 21. "Text Styles" Tab showing the Text style "Invoice"

![Step3e TextStyleInvoiceText](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step3e_TextStyleInvoiceText.png)

Figure 22. "Text Styles" Tab showing the Text style "Invoice Text"

### Step 4: Create Your Sections

In [Step 2](#PrintModel_text_Step2) we thought about how to structure our *Print Model*. We planned to add two *Segments* and two *Sections*.

As *Sections* block off parts of the page for the header or footer, it is useful to model these first so that we can add them to the *Segments* immediately.

|  |  |
| --- | --- |
|  | You can model the *Segments* and *Sections* in any order.  However, adding *Sections* to *Segments* after you have started adding other *Print Model Elements* will mean that you have to rearrange these elements if they overlap with the new *Section*. |

We can add *Sections* that we will use as headers on our *Segments* depending on their orientation and usage using the ***Sections Tab***.
Let’s add the following *Sections* based on our plan from [Step 2](#PrintModel_text_Step2):

Table 5. Sections


| Name | Type |
| --- | --- |
| Cover Sheet | Portrait (the first option) |
| Invoice main data | Portrait Remaining (the second option) |

#### Step 4a: Cover Sheet Section

![Text Step4a](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step4a.png)

Figure 23. Cover Sheet Section on "Invoice\_PM"

* Click on the "Section" tab, it’s the fifth tab on the left-hand side.
* Click the first "ADD" button to add a Portrait *Section*.
* Set the Section title to "Cover Sheet"

The Section can now be edited on the *Editor Stage* to the right.

In the *Editor Stage* we can now decide if the *Section* will have a header, a footer or both.
We can model how much space the header and footer will have.
For the Cover Sheet Section, we decided against a header and a footer.

* Make the header and footer as small as possible using drag and drop.

#### Step 4b: Invoice Main Data Section

![Text Step4b](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step4b.png)

Figure 24. Invoice Main Data Section on "Invoice\_PM"

* Now, click the second "ADD" button in the "Section" tab to add a Portrait Remaining *Section*.
* Set the title to "Invoice main data".
* Adjust the size of the header by drag-and-drop, e.g. 4 cm from the top of the page.
* Adjust the size of the footer by drag-and-drop, e.g. 29 cm from the top of the page.

|  |  |
| --- | --- |
|  | "Invoice main data" is a ***Section for all pages*** that will be displayed on every page of the resulting PDF, including the first page.  We hid this *Section* by creating the "Cover Sheet" *Section*.  If you want to have a special *Section* just for the first page of the PDF, you can use the same approach as first page *Sections* are prioritized over "remaining" *Sections*. |

For the "Invoice main data" *Section*, we decided to add a header and a footer.
Furthermore, we now can add, move and delete ***Print Model Elements*** by dragging from the ***Element Library***, ![Text Step4b ElementLibrary](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step4b_ElementLibrary.png), onto the *Stage* of the *Section*.

Table 6. Elements of the Header in the Invoice Main Data Section


| Element | Field in Invoice\_DM | Field Type | Other Information |
| --- | --- | --- | --- |
| Image | - | - | Image of the company logo of the company sending the invoice |
| Text | - | - | Field for Company Name of the company sending the invoice |
| Text | - | - | Field for Company Address of the company sending the invoice |
| Text | /Invoice/Order/OrderingDate | Date | Field for ordering date |
| Text | /Invoice/Order/InvoiceNumber | Number | Field for invoice number |
| Text | - | - | Field for Page Number |
| Line | - | - | Separation line |

#### Step 4c: Add a Static Logo

![Text Step4c](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step4c.png)

Figure 25. Multi-Store Logo in the Invoice Main Data Section

* Open the *Element Library* by clicking on the icon, ![Text Step4b ElementLibrary](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step4b_ElementLibrary.png), in the top left-hand corner of the *Editor Stage*.
* Drag and drop an ***Image Element*** into the left-hand side of the *Section* header.
* Double-click the *Image Element*, to open the ***Detail View***.

Here we can decide if we want to include a pre-determined attachment or include an image as a Field. We plan to use a pre-determined image as this should be the same for all invoices.

* Select the "Image source type" "Attachment".
* Click on the Attachment picker to select a logo from your file system.
* Set a suitable height and width.
* Add the alternative text "Company Logo".

|  |  |
| --- | --- |
|  | The Alternative Text is mandatory to fulfill accessibility requirements. |

* Drag and drop the image into the perfect position.

You can see the size of the *Print Model Element* and distance to the page edges at the top of the *Editor Stage*.

As you drag and drop, the distances will be shown to you.

Fine adjustment can be achieved by typing the desired distances into the boxes at the top of the *Editor Stage*.

#### Step 4d: Add the Company Name and Address

![Text Step4d](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step4d.png)

Figure 26. Company Name and Address in the Invoice Main Data Section

Now we want to add the name and address of the company sending the invoice into the Section.

* Click on the *Element Library*.
* Drag and drop a ***Text Element*** into the *Section*.
* Double-click the *Element* to open the *Detail View*.
* Add the company name as static text in the ***Rich Text Editor***.

To add formatting options, the static text has to be selected in the *Rich Text Editor*, and then we can set the selected text to be bold, italic, underlined as well as the font and background colors.
Additionally, the *Text \_Element* is configurable using border properties and a subset of the text properties.
\* Chose the "Invoice" Text Style that we created earlier in [Step 3c](#PrintModel_text_Step3c).

* Repeat the steps above for the address of the company sending the invoice.
* Use the Text Style "Invoice Text".

#### Step 4e: Add the Ordering Date and Invoice Number

![Text Step4e](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step4e.png)

Figure 27. Ordering Date and Invoice Number in the Invoice Main Data Section

In the next step, we want to include the ordering date in the Section.
To do this, we will need to include *dynamic content* from the Field "OrderingDate".

* Once again, drag and drop a *Text Element* into the *Section* and open the *Details View*.
* Add a static text "Order Date:", as we did above.
* Press enter to start a new line.
* Add a ***Field Element*** by clicking on the "Field" Button, ![Text Step4e FieldElement](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step4e_FieldElement.png), in the *Details View*.

By adding a *Field Element* a different *Details View* is opened. In this view the Document Model and Field Instance can be set.

* Set "Invoice\_DM" as the Document Model.
* Navigate to "OrderingDate" by clicking on the group "Order" and set this as the Field by clicking on "OrderingDate".
* Collapse the group "Order" by clicking on it again.
* Set the Field Type to Date.
* Set the Date Format to dd/MM/YY
* Click "Back" and set the Text Style to "Invoice Text".
* Drag-and-drop a second *Text Element* onto the *Editor Stage*
* Add the text "Invoice Number:".
* Add the *Field Element* for the "InvoiceNumber" as you just did.

|  |  |
| --- | --- |
|  | There is no need to choose a Field Type for a Number Field |

* Once again, set the Text Style to "Invoice Text".

#### Step 4f: Add a Separation Line

![Text Step4f](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step4f.png)

Figure 28. Separation Line in the Invoice Main Data Section

As we are thinking about structure, we might want to add a separation line in the *Section* header.

* Click on the Element Library and drag and drop a ***Line Element*** into the *Section*.
* Open the *Detail View*.
* Customize the border width, border style and border color.

#### Step 4g: Add a Page Numbers to the Footer

![Text Step4g](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step4g.png)

Figure 29. Page Numbers in the Invoice Main Data Section

The last element we want to add is a ***Page number Element***.
We will add this to the footer area of the *Section*.

* Click on the *Element Library* and drag and drop a *Text Element* into the *Sections* footer area.
* Open the *Detail View*.
* Add the *Page number Element* in the *Rich Text Editor* by clicking the "Page Number" Button above the *Rich Text Editor*.
* Set the Text Style to "Invoice Text" and the Alignment to "Center".

|  |  |
| --- | --- |
|  | We added the page number only to the "Invoice main data" *Section*. Therefore, the "Cover Sheet" *Section* will not have a page number.  If we would like to also display a page number on the first page, we would need to add it separately to the "Cover Sheet" *Section*. |

* Commit your changes to the *Print Model*.

**Click here to see what your project should look like by now.**

These are the *Sections* you created in this step:

Cover Sheet, Invoice main data

These are the *Elements* you added to "Invoice main data" in this step:

1 x *Image Element*, 4 x *Text Elements*, 2 x *Field Elements* 1 x *Line Element*

![Step4a CoverSheet](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step4a_CoverSheet.png)

Figure 30. "Cover Sheet" *Section*

![Step4b InvoiceLogo](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step4b_InvoiceLogo.png)

Figure 31. Static Logo on the "Invoice main data" *Section*.

![Step4c CompanyName](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step4c_CompanyName.png)

Figure 32. Company Name on the "Invoice main data" *Section*.

![Step4d CompanyAddress](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step4d_CompanyAddress.png)

Figure 33. Company Address on the "Invoice main data" *Section*.

![Step4e OrderDate](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step4e_OrderDate.png)

Figure 34. Order Date on the "Invoice main data" *Section*.

![Step4f InvoiceNumber](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step4f_InvoiceNumber.png)

Figure 35. Invoice Number on the "Invoice main data" *Section*.

![Step4f SeparationLine](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step4f_SeparationLine.png)

Figure 36. Separation Line on the "Invoice main data" *Section*.

![Step4g PageNumber](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step4g_PageNumber.png)

Figure 37. Page Number on the "Invoice main data" *Section*.

### Step 5: Cover Sheet Segment

In [Step 2](#PrintModel_text_Step2) we planned to have two pages.
New pages are created by adding *Segments* in the ["Segments" Tab](https://geta12.com/docs/print_engine/print-modeling-documentation/index.html#ModelSegment/).
We will start by adding a *Segment* for the Cover Sheet.

|  |  |
| --- | --- |
|  | As we have already created *Sections*, the orientation of the *Segments* need to match.  In our case, we will create Portrait *Segments* to match the *Sections* we created in [Step 4](#PrintModel_text_Step4). |

#### Step 5a: Create Your Cover Sheet Segment

![Text Step5a](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step5a.png)

Figure 38. Cover Sheet Segment used on "Invoice\_PM"

* Click on the "Segment" tab, it’s the fourth tab on the left-hand side.
* Add "Cover Sheet Segment" as the title of the *Segment* at the bottom of the left-hand panel.
* Select the Portrait page orientation.
  As this is the default, you do not need to do anything.
* Push the "+ ADD" button to add the *Segment*.

Now we want to include the following Elements and the corresponding Fields of the Invoice\_DM in the "Cover Sheet Segment" *Segment*:

| Element | Field in Invoice\_DM | Text |
| --- | --- | --- |
| Text | /Invoice/Addresses/BillingAddress/Company | Invoice for *Field Element* |
| Text | /Invoice/Addresses/BillingAddress/FirstName | Dear, *Field Element* thank you for ordering from Multi-Store company. We hope everything is to your complete satisfaction. If you have any further questions, our customer service will be happy to help you. |
| Line | - | - |
| Text | - | Below, you will find a chart that sums up the quantity of your ordered items. |
| Pie Diagram | /Invoice/Order/OrderInformation/Product (Labels) |  |
| /Invoice/Order/OrderInformation/Quantity (Values) |

#### Step 5b: Add Text and Line Elements to Your Cover Sheet Segment

![Text Step5b](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step5b.png)

Figure 39. Text and Line Elements on the "Cover Sheet Segment" used on "Invoice\_PM"

* Open the *Editor Stage* by double-clicking on "Cover Sheet Segment" or by using the "Open Editor" button to the right of the name.

Adding *Text, Field* and *Line Elements* to a *Segment*, is similar to adding *Elements* to Sections.
Please view the detailed instructions in [Step 4e](#PrintModel_text_Step4e) and [Step 4f](#PrintModel_text_Step4f) if you need a reminder.

* Add the *Text, Line and Field Elements* from the table.
* Set the following Text Styles (from top to bottom):

  + "Cover Sheet"
  + "Invoice"
  + "Invoice Text"
* Set the Alignment of all the Text Elements to "Center".

#### Step 5c: Add a Pie Diagram to Your Cover Sheet Segment

![Text Step5c](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step5c.png)

Figure 40. Pie Diagram on the "Cover Sheet Segment" used on "Invoice\_PM"

After we have inserted all the *Elements* that we have already used, we can now add a new *Element*, the ***Pie Diagram Element***.

* Click on the Element Library and drag and drop the *Pie Diagram Element* into the "Cover Sheet Segment" and open the *Detail View*.
* Click on "Edit" next to the "Title" field and add "Order Overview" as the title to the chart.
* Set a sensible width and height.
  We set it to be 13 x 13 cm.
* Set "Invoice\_DM" as the Document Model reference.
* Set "OrderInformation" as the repeatable group by expanding the Group "Order" and clicking on "OrderInformation".
* Set the Field "Quantity" for the "Field with value" as the number field that should be displayed in our *Pie Chart Element*.
* Set the Field "Product" for the "Field for label" as the names of the values in the *Pie Chart Element*.
* Commit your changes to the *Print Model*

**Click here to see what your project should look like by now.**

These are the *Segments* you created in this step:

Cover Sheet Segment

These are the *Elements* you created in this step:

1 x *Line Element*, 3 x *Text Elements*, 2 x *Field Elements*, 1 x *Pie Chart Element*

![Step5a TopTextElement](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step5a_TopTextElement.png)

Figure 41. Top *Text Element* on the "Cover Sheet Segment" *Segment*.

![Step5b MiddleTextElement](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step5b_MiddleTextElement.png)

Figure 42. Middle *Text Element* on the "Cover Sheet Segment" *Segment*.

![Step5c LineElement](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step5c_LineElement.png)

Figure 43. *Line Element* on the "Cover Sheet Segment" *Segment*.

![Step5d BottomTextElement](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step5d_BottomTextElement.png)

Figure 44. Bottom *Text Element* on the "Cover Sheet Segment" *Segment*.

![Step5e PieChart](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step5e_PieChart.png)

Figure 45. *Pie Chart Element* on the "Cover Sheet Segment" *Segment*.

### Step 6: Order Information Segment

After we created the *Segment* for the "Cover Sheet Segment", we can now model the *Segment* for the "Order Information".
This will contain the details of the Invoice including a table that shows all the ordered products.

#### Step 6a: Create your Order Information Segment

![Text Step6a](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step6a.png)

Figure 46. "Order Information" Segment used on "Invoice\_PM"

* Add a new *Segment*, "Order Information" as we did in [Step 5a](#PrintModel_text_Step5a).
* Enter "Order Information" as the title of the Segment at the bottom of the *Segment* Tab.
* Select the Portrait page orientation. As this is the default, you do not need to do anything.
* Push the "+ ADD" button to add the *Segment*.

We will include the following Elements and the corresponding Fields of the Invoice\_DM in the "Order Information" *Segment*:

| Element | Field in Invoice\_DM | Text |
| --- | --- | --- |
| Text | In /Invoice/Addresses/BillingAddress  * FormOfAddress * FirstName * LastName * Company * Street * Nr * PostalCode * City | Billing Address  *Field Elements* |
| Text | In /Invoice/Addresses/ShippingAddress  * FormOfAddress * FirstName * LastName * Company * Street * Nr * PostalCode * City | Delivery Address  *Field Elements* |
| Text | In /Invoice/Order/DeliveryOptions  * PrefDeliveryDaysOptions * DeliveryFrom * DeliveryTo | Preferred Delivery Day  *Field Element*  Preferred Delivery Time  *Field Element* - *Field Element* |
| Text | In Invoice/PaymentInfo  * MethodOfPayment | Method of Payment *Field Element* |
| Table | In /Invoice/Order/OrderInformation  * Quantity * Product * ProductType * Price * TotalPriceProduct | - |
| Table Layout | In /Invoice/Order  * TotalPrice * ShippingCosts * TotalPriceWithShippingCosts * TotalPriceWithDiscount | Total price of ordered products *Field Element*  Shipping costs *Field Element*  Total price of order *Field Element*  Total price with discount *Field Element* |
| Image | - | - |
| Text | In /Invoice/PaymentInfo/PaymentTime  * Deadline | Delivery terms and conditions  Payment must be made between the  *Field Element* |

#### Step 6b: Add Text Elements above the Table

![Text Step6b](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step6b.png)

Figure 47. Text Elements above the Table on "Order Information" Segment

* Open the *Editor Stage* by double-clicking on "Order Information" or by using the "Open Editor" button to the right of the name.
* Add *Text Elements* and *Field Elements* for Billing Address, Delivery Address, Preferred Delivery Day/time and Method of Payment as we did for [Step 4e](#PrintModel_text_Step4e) and [Step 5b](#PrintModel_text_Step5b).

  + Use the Text Style "Invoice Text"
  + Use bold text for the static text.

|  |  |
| --- | --- |
|  | When adding multiple *Field Elements*  1. Select the Field. 2. Click Back (at the bottom of the Editor). 3. Enter a space, carriage return or text as appropriate. 4. Enter the next *Field Element*. |

Since a different delivery address is not always used, we want to hide this *Text Element* if all nested entities are empty.

* Open the *Details View* of the *Text Element* for the delivery address.
* Select the "Hide this element if all nested entities are empty" confirm button.

Additionally, we want to create a border around the four *Text Elements*.

* Open the *Details View* for the *Text Element* "Billing Address".
* Under "Border Properties"

  + Set the border width to "1".
  + Set the border style to "Solid".
  + Select a border color.
* Repeat the steps above for each *Text Element*:

  + Billing Address
  + Delivery Address
  + Preferred Delivery Day/Time
  + Method of Payment

#### Step 6c: Add Table Element Showing All Products

![Text Step6c](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step6c.png)

Figure 48. Table Element showing all Products on "Order Information" Segment

The next step is to insert an overview of all ordered products into the "Order Information" *Segment*.

* Click on the *Element Library*.
* Drag and drop a ***Table Element*** into the *Segment*.
* Open the *Detail View* of the *Table Element*.

In the *Detail View* we can set plenty of properties, which will be explained step by step now.

* First, select "Invoice\_DM" as the Document Model reference.
* Select the Repeatable Group "OrderInformation" as the Repeatable Group reference.

After choosing the Document Model and the Repeatable Group, we will add the Fields that should be displayed in the *Table Element*.

* Add a Table Column by clicking on the "ADD" button for the Repeat under the Group selection.

After adding a Table Column, we will be presented with a new *Details View*.

* Select "Field" for the Element type.
* Select "Quantity" as a Label for the column that will display the quantity of the ordered items.
* Click the "Edit" button next to the "Width" field and enter 15% as the width.

|  |  |
| --- | --- |
|  | In the end, the sum of all column widths may not be greater than 100%. |

* Select "Quantity" as the referenced Field that should be displayed in this column.

If we’d like, we could set a Field Type and a Suffix, but for this column, it is not necessary.

|  |  |
| --- | --- |
|  | Setting a Suffix can be necessary, for example, for Number Fields. |

* Click "Back" at the bottom of this editor.
* Repeat the previous steps for the remaining fields Product, ProductType, Price and TotalPriceProduct.

In the end, we should have five Table Columns as described in [Step 6a](#PrintModel_text_Step6a).

Additionally, we can set some General Properties like the Max row count.
This indicates how many rows should be displayed in the *Table Element*.

* Click the "Edit" button next to the "Max row count" field.
* Set the Max row count to 100.

The last properties we can set are the Header and Body Properties as well as the Border Properties.
For the Header and Body of the table, we can decide which Text Style should be used, what color the text should have, and if there should be a background color.
These settings are individual and can be set as desired. We used the following properties:

Table 7. Table Properties


|  | Text Style | Style | Text Color | Background Color |
| --- | --- | --- | --- | --- |
| Header Properties | "Invoice" | bold | black | pale blue |
| Body Properties | "Invoice Text" | - | black | very pale blue |

* Set the Table Properties by clicking on the "Edit" button next to the relevant setting.

We did not set any Border Properties.

#### Step 6d: Add Table Layout Element Showing Total Prices

![Text Step6d](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step6d.png)

Figure 49. Table Layout Element showing Total Prices on "Order Information" Segment

After we finished the *Table Element* which presents all the ordered items, we can now think of a way to display more information.
For example, we could show the total price of all products, the shipping cost, the total price of the order, and, of course, the total price of the order after a discount.
To structure these fields, we can introduce the ***Table Layout Element***, which is a way to create a table without using a Repeatable Group.

|  |  |
| --- | --- |
|  | The *Table Layout Element* is a pure structural element that is currently only compatible with *Text Elements*. *Text Elements* need to be inserted after the *Table Layout Element* is created. |

* Click on the *Element Library* and drag and drop a *Table Layout Element* into the *Segment*.
* Open the *Detail View*.

In the *Detail View*, we can set plenty of properties, which will be explained step by step now.

Firstly, we can decide how many rows and columns should be displayed in the *Table Layout Element*.
Since we want to display four fields that should have labels, we set up four rows and two columns.

* Set the number of rows to 4.
* Set the number of columns to 2.

Now the columns and rows have a default width, height, and alignment.

If we want to change the default setting, we can make some changes in the "Row Options" and "Column Options".
For this use case, we would only like to introduce some changes to the "Column Option".

You can add column options to the *Table Layout Element* via the "ADD" button.

* Click the "ADD" button and then "Edit" to model the first Column Options.

  + Set the Index to 1.
  + Click "Edit" next to the "Width" field and set the width to 70%.
  + Set the "Vertical Alignment" to "Middle".
* Click the "ADD" button and then "Edit" again to model the second Column Options

  + Set the Index to 2.
  + Click "Edit" next to the "Width" field and set the width to 30%.
  + Set the "Vertical Alignment" to "Middle".

|  |  |
| --- | --- |
|  | The sum of column widths should be 100%. |

* Set some border properties, as we did in [Step 6b](#PrintModel_text_Step6b).

After the pure structural *Table Layout Element* is completed, we want to fill the columns with some fields and text.

* Hover over the columns in the *Editor Stage* and a "+" button appears.
* Click the button and add "Text" as the content type.
* Click the "Edit" button, and edit the *Text Element*.

  + Add static text to the rows in the first column.
  + Add *Field Elements* to the rows in the second column.
  + Set Text Styling for each *Text Element* to "Invoice Text" as we did before.

#### Step 6e: Add Image and Text Elements At the Bottom

![Text Step6e](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Text_Step6e.png)

Figure 50. Table Layout Element showing Total Prices on "Order Information" Segment

Now that we have finished the *Table Layout Element*, let’s insert an ending image to express our thanks.
This *Image Element* can be inserted like we did before.

Finally, we want to insert a *Text Element* that displays the Date Range when the payment has to be made.

* Add a *Text Element* into the *Segment* as we did before.
* Add a *Field Element* as we did before.
* Set the field type to "Date Range".

The layout of the date range is a default layout.
If we want to change the layout, we can insert a date format for the start date and the end date.
Also, we can decide which date separator should be used.

* Add a date format "dd/MM/YY" for the start date and the end date.
* Add a date separator "-".
* Commit your changes to the *Print Model*.

**Click here to see what your project should look like by now.**

These are the *Segments* you created in this step:

Order Information

These are the *Elements* you created in this step:

1 x *Table Element*, 13 x *Text Elements*, 25 x *Field Elements*, 1 x *Table Layout Elements* 1 x *Image Element*

![Step6a BillingAddress](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step6a_BillingAddress.png)

Figure 51. *Text Element* showing the Billing Address.

![Step6b DeliveryAddress](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step6b_DeliveryAddress.png)

Figure 52. *Text Element* showing the Delivery Address which is hidden is the *Field Elements* are empty.

![Step6c TableElement](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step6c_TableElement.png)

Figure 53. *Table Element* showing the Ordered Products.

![Step6d TableElementProperties](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step6d_TableElementProperties.png)

Figure 54. Header and Body Properties of the *Table Element*.

![Step6e TableLayoutAdd](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step6e_TableLayoutAdd.png)

Figure 55. Add *Text Elements* as content into the columns of the *Table Layout Element* via the "+" button.

![Step6f TableLayoutEdit](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step6f_TableLayoutEdit.png)

Figure 56. Edit *Text Elements* via the "Edit" button.

![Step6g TableLayout](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step6g_TableLayout.png)

Figure 57. Set static text as a label for the left column and the corresponding *Field Elements* for the right column of the *Table Layout Element*.

![Step6h Thanks](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step6h_Thanks.png)

Figure 58. Insert *Image Element* to express your thanks.

![Step6i Deadline](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step6i_Deadline.png)

Figure 59. *Field Element* to show the Deadline for Payment.

### Step 7: View your Print Model in the Print Model Editor Preview

After finishing modeling the Print Model, we want to take a look at the resulting PDF.
Therefore, we already generated our [test data](#PrintModel_text_Step1f).
This test data will be the data that will be shown based on the structure we created through our Print Model.

* Click on the "Print" button in the right upper corner to open the Print Model Preview.
* After the Print Model Editor Preview is opened, we choose the test data using the "Test Document2 drop-down menu in the upper left-hand corner.
* Select your test data from [Step 1f](#PrintModel_text_Step1f).

|  |  |
| --- | --- |
|  | If we have multiple test data prepared, we can decide which one we want to see and switch between them. |

|  |  |
| --- | --- |
|  | You may only select Test Documents that have been saved as Workspace Data as described in [Step 1f](#PrintModel_text_Step1f). |

Now we can see the preview of a PDF based on our Print Model with the generated test data as input.
In this Preview we can decide if we want to see pending changes, which means all changes that have not been committed will be seen in the preview.

In the end, your Print Model Preview should look similar to this:

![Step7a Upload](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step7a_Upload.png)

Figure 60. Choosing the test data over the *Upload Test Document* Button

![Step7b Page1](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step7b_Page1.png)

Figure 61. First page of the generated Print Model in the Print Model Preview

![Step7c Page2](https://geta12.com/docs/2025.06/ext5/overall/modeling_tutorial_print_engine/assets/Step7c_Page2.png)

Figure 62. Second page of the generated Print Model in the Print Model Preview

|  |  |
| --- | --- |
|  | If you are not happy with how the Print Model is displayed in the resulting PDF, you can always go back and make changes that will be displayed in the preview. |

|  |  |
| --- | --- |
|  | The Preview is only working if an Element with a field reference was added to the Print Model. |

## Glossary

| Term | Description |
| --- | --- |
| **Commit change Tab** | In the Commit Changes tab, the pending changes of the Print Model can be committed and thus finalized. The top of this tab shows the change history, a list of changes made in the editor. To commit the changes the user can make a selection in the change list and then click the COMMIT SELECTED CHANGES AND TRUNCATE HISTORY button. |
| **Detail View** | The Detail View allows the editing of the properties of a specific element. The specific form is determined by the type of the selected element. The Detail View has no Save button, since every change is saved automatically to the commit history. |
| **Document Model Reference** | Is the Document Model which is used as the data structure. |
| **Editor Stage** | The Editor Stage is the main view for editing the Print Model elements contained in a specific Model Segment, Section, Area element or Bounding Box element. This view allows you to place, move and delete Print Model elements either in a WYSIWYG way or by editing the respective values directly. New elements can be added by opening the Element Library by clicking the button on the top-left of the stage. |
| **Element Library** | Is the part of the Print Model Editor where a modeler is presented with all Print Model Elements. The modeller can drag those Elements onto the Editor Stage. |
| **Field Element** | The Field element can insert the content of a Document Model Field instance into the resulting PDF document. The field instance is selected with the path property, evaluated and returned as a formatted string. |
| **General Tab** | In the General tab, the meta information of the model can be edited. |
| **Image Element** | The Image element inserts an image into the resulting PDF. The image data can be inserted from two different sources, attachment or Field. |
| **Line Element** | The Line element inserts a horizontal line into the resulting PDF document, which functions analog to the HTML <hr> element. The properties of the horizontal line element are determined by its Border Properties. |
| **Page Number Element** | The Page Number element inserts the current page number into the resulting PDF document. |
| **Pie Charts Element** | The Pie Chart Elements insert a chart representation of repeatable Field instances into the resulting PDF document. The chart will be generated as an image and inserted into the PDF document. It displays a pie distribution chart based on a single set of values. |
| **Print Model** | Print Models function as templates for generating PDF documents from A12 Platform data. Print Models are a way to visualize data from a Document Model in a UI interface. |
| **Print Model Editor** | Is an Editor to create and edit Print Models. |
| **Print Model Editor Overview** | In this view the user can create a new Print Model, change a Print Models name, print, duplicate or select a Print Model for editing. |
| **Print Model Elements** | Print Model elements provide content to the resulting PDF document. They are added to the Print Model by adding them to either a Model Segment, a Section or a container element like an Area or a Bounding Box. |
| **Print Model Preview** | In this screen the resulting PDF preview will be displayed. The pdf will automatically reload, once the respective Print Model receives changes. Since only committed changes are merged into the Print Model, the preview only reloads after committing changes. The toggle at the top of the preview can be used to generate the preview with pending changes, which will re-render the PDF with every change made in the editor view. |
| **Section for all pages** | Is a Section that will be applied to all pages of the resulting PDF. |
| **Rich Text Editor** | Is the Editor in a Text Element which is used to style and edit text. |
| **Sample Workspaces** | Contain some sample models and data included in the installation. The sample workspaces can be found in the Workspaces folder in the root installation directory. |
| **Schema Tab** | In the Schema tab, the model references of the Print Model can be edited. The Print Model can reference Document Models to allow for the inclusion of dynamic content based on the A12 Platform. An alias can be set for Document Model References, that allows for easier distinction of the referenced Models. Additionally, Print Model References can be set, to allow for the inclusion of template segments. |
| **Section** | Sections are optional containers for elements that result in headers and footers in the resulting PDF document. |
| **Section for all pages** | Is a Section that will be applied to all pages of the resulting PDF. |
| **Section for first page** | Is a Section that will be applied to first page of a PDF only. |
| **Sections Tab** | In the Section tab, sections can be created, edited and deleted. Each combination of Page Orientation and Section Usage properties have a specific slot listed in the Section tab. After creation, the title of the section can be set and the Editor Stage can be opened by clicking the section itself or the corresponding Open Editor button. |
| **Segment** | A Segment is a container for elements that each result in one or more DIN-A4 pages in the PDF document. Each segment starts on a new page and defines the page orientation of these pages. |
| **Segment Tab** | In the Segment tab, segments can be created, edited, reordered and deleted. To edit a segment’s title, the Open Settings can be clicked. To open the Editor Stage to edit the segment’s content, the segment itself or the corresponding Open Editor button can be clicked. To add a new segment, a title and page orientation must be set in the bottom of the Segment tab and the Add button must be clicked. |
| **Table Element** | The Table element inserts a table into the resulting PDF, which points to a selected repeatable group in a referenced Document Model. Each row of the resulting table corresponds to one instance of the repeatable group. The Table can have any number of columns, but needs at least one column to be displayed correctly. Each column can have a title, which will be displayed in the header. There are two different ways, the columns content can be generated. It can be created either by a Field or an Expression. |
| **Table Layout Element** | The Table Layout element inserts a static table into the resulting PDF document, which provides a static layout to its contents. The number of columns and rows in a Table Layout element are defined by its Number of Rows and Number of Column properties. These properties can be edited in the detail view of the element. |
| **Text Element** | The Text element displays text in the resulting PDF. The content of the Text element can consist of static text and dynamic inline insertions of Field, Calculation and Page Number elements. |
| **Text Style Tab** | In the Text Styles tab, Text Styles can be created, edited and removed. The upper part of the Text Styles tab displays an example of the current Text Style, for which the properties can be edited below. A newly created Print Model comes with a default Text Style which cannot be deleted. |
