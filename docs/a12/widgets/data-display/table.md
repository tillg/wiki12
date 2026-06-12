---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-display/table
widget: data-display/table
scraped: 2026-06-12
---

# Widgets/Data display/Table

Table

The **Table** Widget is a presentational component that visualizes a data set in fully customizable rows and columns. It's often used to embed structured data in a way such that users can easily scan and look for patterns and insights. A **Table** can include:

* A corresponding visualization
* Navigation
* Tools to query and manipulate data

Please have a look at the [Multiselect Table](#/examples/multiselect-table) where we already implemented some features as an example.

* basic
* advanced
* API

Basic

A **Table** has two important properties you should take note of:

* `data`: let you define the data that should be displayed as rows in the table.
* `columns`: let you define the columns of the table. Each column is of type `BaseColumnType` which lets you specify the column's label, width, alignments, pinning and so forth.

Other key properties you'll frequently use are `width`, `fixedWidth`, `pinning` and `actionColumn`.

The default value of `width` is **1.0**, but other decimal values (up to 2 decimal places) can also be passed; **0.5** or **1.3**, for example.

Normally the widths of the various columns are calculated automatically based on the table's width, the **width** property of each column and the total number of columns.

However, for columns where `fixedWidth` is set to **true**, a fixed width of **width\*150px** will be applied. Unlike normal columns, those with fixed widths will NOT shrink/expand as the width of the table changes. By default, columns have `fixedWidth` set to **false**, except for pinned columns where its set to **true**.

Speaking of pinned columns, when screen space is limited it may not be possible for all of your columns to display at once without scrolling. If some of your columns are particularly important, you can prioritize them to display without scrolling by setting their `pinning` property to **true**.

If you need to include some type of actions in your table such as editing or deleting, you can use an `actionColumn` (or multiple action columns).

The example below uses many features of the Table widget:

* Pinned Column, Column Width and Column Alignment
* Action Column
* Select & Sort
* Row Highlighting

Select all/ Deselect all

ID

First name

Last name

*emailEmail*

Status

Action

Select 2

2

Paul

Walters

[*email* paul.walters@yahoo.com](mailto: paul.walters@yahoo.com "E-mail")

Active

*edit**delete*

Select 1

1

Lola

Sporer

[*email* lola.sporer@gmail.com](mailto: lola.sporer@gmail.com "E-mail")

Active

*edit**delete*

Select 3

3

Malcolm

Spencer

[*email* malcolm.spencer@hotmail.com](mailto: malcolm.spencer@hotmail.com "E-mail")

Active

*edit**delete*

Select 5

5

Naomi

Jones

[*email* naomi.jones@yahoo.com](mailto: naomi.jones@yahoo.com "E-mail")

Active

*edit**delete*

Select 4

4

Christopher

Kunde

[*email* christopher.kunde@gmail.com](mailto: christopher.kunde@gmail.com "E-mail")

Active

*edit**delete*

*code**center\_focus\_weak**bug\_report*

Expandable

The example below optimizes the Table widget with additional contents for the Header Row and Body Rows.

You can trigger the Filter Header Cell to display the filters for the Body's data. These filters have been added to this example by creating the `headFilterContentRenderer` of the `componentRenderers` property.

You can also expand each Row to see the additional content. These additional contents are made of `TableTemplate.BodyRow`, `TableTemplate.ExpandableRow`, `TableTemplate.ExpandableRowBody` and `TableTemplate.ExpandableRowFooter` as the `additionalContentRenderer`inside the `componentRenderers` property. Also, the `footContentRenderer` and `footRowRenderer` of `componentRenderers` property has also been used to create the Footer.

Besides, additional features have also been added to make this example feel more alive:

* [Pagination](#/widgets/data-display/pagination) widget has been used to navigate between pages of the table.
* Action Column
* Select & Sort
* Row Highlighting

Warning

*warning*

**NOTE**

The recommended way of supporting **accessibility** for the expandable table is to pass the `buttonAttributes` and `title` properties into the Icon Button that triggers opening/closing the expandable row. For the sake of clarity, let's look at an example:

* Set `buttonAttributes` to `{"aria-expanded"=true/false}` when the Icon Button is clicked/not clicked.
* Set `title` to `open/close` when the Icon Button is clicked/not clicked.

Action

Dessert name

Calories

Fat

Carbs

Protein

Price ($)

*filter\_list*

Action

Additional content of row*keyboard\_arrow\_up*

Frozen yoghurt

159

6

24

4

3.99

*edit**delete*

Additional content of row*keyboard\_arrow\_up*

Ice cream sandwich

237

9

37

4.3

4.99

*edit**delete*

Additional content of row*keyboard\_arrow\_up*

Eclair

262

16

24

6

3.79

*edit**delete*

Additional content of row*keyboard\_arrow\_up*

Cupcake

305

3.7

67

4.3

2.5

*edit**delete*

Additional content of row*keyboard\_arrow\_up*

Gingerbread

356

16

49

3.9

1.5

*edit**delete*

*first\_page**navigate\_before*

Page

1 / 32 / 33 / 3

*navigate\_next**last\_page*

*code**center\_focus\_weak**bug\_report*

Column Grouping

In some cases that you need to create a multi-column table, you can make any Column expand across its Sub-columns by passing the `subColumns` property to its data. The Table allows to nest its Columns to upmost 3 levels. To further customize the header Cell of the spanned Column, please use the `headCellGroupRenderer` provided in the `componentRenderers` property.

Each spanned Column will have the following behaviors:

* The `horizontalAlignment` and `verticalAlignment` properties are centered by default and have no effect on its `subColumns`.
* The following properties will be ignored:
  + `sortable`
  + `sortDirections`
  + `width`
  + `fixedWidth`
  + specific `horizontalAlignment`: `{body, foot}`
  + specific `verticalAlignment`: `{body, foot}`
* The `pinning` only works for the **first-level** column-span.

**Accessibility reminder:** Because of the complicated HTML structure of grouped columns, the screen readers will not be able to provide an accurate mapping for the contents of the Table's headers and cells. We DO NOT recommend using Table with spanned Columns for accessibility usage.

In this example, besides of the multi-columns, additional features have also been added to make it more alive:

* Pinned columns
* Select & Sort
* Row Highlighting

Name

Profile

Username

Phone

Date of Birth

Address

E-address

Email

Website

Home Address

Street

City

Company

Name

Business

Laverna Kassulke

Vincenzo\_Lehner92

1-474-606-6696 x346

Sat Apr 29 1978

[*email*Pattie14@yahoo.com](mailto:Pattie14@yahoo.com "E-mail")

[https://bustling-wallaby.info*open\_in\_new*](https://bustling-wallaby.info "Leave Page")

Corine Courts

East Jack

Batz, Gulgowski and Jerde

engineer leading-edge architectures

Aaliyah Corkery

Iris.Pfannerstill87

1-904-956-3680

Sat Nov 29 1947

[*email*Ramona\_Pouros89@hotmail.com](mailto:Ramona_Pouros89@hotmail.com "E-mail")

[https://authorized-lox.name/*open\_in\_new*](https://authorized-lox.name/ "Leave Page")

Woodlands Avenue

Edland

Turner Group

drive vertical infrastructures

Laverne Johnston

Elise.Lehner51

442.745.3751

Sun Mar 09 1952

[*email*Jesus.Boyer59@hotmail.com](mailto:Jesus.Boyer59@hotmail.com "E-mail")

[https://perfumed-rosemary.com*open\_in\_new*](https://perfumed-rosemary.com "Leave Page")

Westgate

Vernonstad

Bayer - Labadie

streamline scalable initiatives

Elda Trantow Sr.

Jill.OHara

798.506.5324 x42248

Wed Jun 09 2004

[*email*Iliana.Sauer@hotmail.com](mailto:Iliana.Sauer@hotmail.com "E-mail")

[https://bleak-council.biz/*open\_in\_new*](https://bleak-council.biz/ "Leave Page")

Klocko Estates

Hintzchester

Dibbert - Lindgren

streamline robust markets

Wendell Price

Dexter\_Donnelly98

559.611.5564 x6367

Thu Jan 12 1956

[*email*Hunter.Streich@hotmail.com](mailto:Hunter.Streich@hotmail.com "E-mail")

[https://personal-baseboard.name*open\_in\_new*](https://personal-baseboard.name "Leave Page")

Melinda Flat

South Horaciohaven

Runte - Paucek

incubate strategic methodologies

*code**center\_focus\_weak**bug\_report*

Row Grouping

This example makes use of the **TableRowsGroup** widget that is recommended to use when the table requires grouping rows.

The `data` property used in the TableRowsGroup is a set of **RowsGroup** which contain the following properties:

* `head`: the title of the group.
* `subRows`: rows that should be grouped.
* `ariaLabel`: should be used to make screen readers recognize and read it as a group by setting the value the same as the `head` property.
* `collapsed`: to hide or show corresponding sub rows.

To collapse/expand a row group, you can customize the row group header by using `rowGroupHeaderRenderer` with an action button which is responsible for updating the row corresponding to the `collapsed` state.

Warning

*warning*

**NOTE**

In this example, we follow A11Y requirements by using the [Link](#/widgets/general/link) Widget with appropriate ARIA attributes, such as `role="button"` and `aria-expanded="true/false"`. This ensures compliance with hover, tab focus, and semantic standards.Additionally, accessibility in custom components using `rowGroupHeaderRenderer` can be enhanced by:

* Set `linkAttributes` to `{"aria-expanded": true/false}` depending on the collapsed state of the row.
* Set `title` to `Expand group/Collapse group` depending on the collapsed state of the row.

Dessert name

Calories

Fat

Carbs

Protein

Dessert name

Calories

Fat

Carbs

Protein

[*expand\_more*Frozen dessert](# "Collapse group")

Frozen yoghurt

159

6

24

4

Ice cream sandwich

237

9

37

4.3

[*expand\_more*Pastry](# "Collapse group")

Eclair

262

16

24

6

Cupcake

305

3.7

67

4.3

Gingerbread

356

16

49

3.9

[*expand\_more*Candy](# "Collapse group")

Jelly Bean

375

0

94

0

Lollipop

392

0.2

98

0

Marshmallow

318

0

81

2

Nougat

360

19

9

37

[*expand\_more*Biscuit](# "Collapse group")

KitKat

518

26

65

7

Oreo

437

18

63

4

[*expand\_more*Other](# "Collapse group")

Honeycomb

408

3.2

87

6.5

*code**center\_focus\_weak**bug\_report*

Cross Tabulation

To create a Cross Tabulation similar to the following example, please define the columns as usual and set `verticalHeader` to the one that is expected to be a vertical header. That column will be pinned left by default. Once `verticalHeader` property is set, the other left side pin would be considered as a vertical header as well.

A vertical header is actually a normal column filled with body cell content but has the same styling as the horizontal header, so it could only be sorted vertically.

It is recommended to also use the `cellHiglighting` property for Cross Tabulation to make the corresponding Header Cells highlighted when hovering over the Body Cells.

Dessert name

Calories

Fat

Carbs

Protein

Frozen yoghurt

159

6

24

4

Ice cream sandwich

237

9

37

4.3

Eclair

262

16

24

6

Cupcake

305

3.7

67

4.3

Gingerbread

356

16

49

3.9

Honeycomb

408

3.2

87

6.5

Jelly Bean

375

0

94

0

KitKat

518

26

65

7

Lollipop

392

0.2

98

0

Marshmallow

318

0

81

2

Nougat

360

19

9

37

Oreo

437

18

63

4

*code**center\_focus\_weak**bug\_report*

Customizations

The Table offers many options for customization.

In this example:

* The *Status* Column has been configured as `subInfo` to mark the cells of that column as sub-info areas. You can do this by setting the `subInfo` property of any Column to `true`.
* There are 3 Row variants: selected, success, and disabled.
* Cells in the *Description* Column have been configured as **secondaryCell** to mark them as secondary info. You can do this by setting the `useSecondaryColor` of the `cellStyling` property to `true`.

Status

Dessert name

Calories

Fat

Description

Success,

*checkSuccess*

*check\_circleSuccess*

Frozen yoghurt

159

6

Frozen yogurt is a frozen product containing the same basic ingredients as ice cream, but contains live bacterial cultures.

Selected row, *pendingPending*

Ice cream sandwich

237

9

An ice cream sandwich is a frozen dessert consisting of ice cream between two biscuits, skins, wafers, or cookies.

*pendingPending*

Eclair

262

16

An éclair is a pastry made with choux dough filled with a cream and topped with a flavored icing.

*pendingPending*

Cupcake

305

3.7

A cupcake is a small cake designed to serve one person, which may be baked in a small thin paper or aluminum cup.

*pendingPending*

Gingerbread

356

16

Gingerbread refers to a broad category of baked goods, typically flavored with ginger, cloves, nutmeg, and cinnamon and sweetened with honey, sugar, or molasses.

*blockDisable*

*cancelFailed*

Jelly Bean

375

0

Jelly beans are small bean shaped sugar candies with soft candy shells and thick gel interiors.

*code**center\_focus\_weak**bug\_report*

Accessibility

`componentRenderers` property lets you customize the table's rendered. When providing custom components, ensure accessibility is preserved by including the appropriate ARIA attributes and roles.

To expose row data to the screen reader (e.g. reading the row ID when an action button is focused), include it in the button's `title` or use a `HiddenText` linked via button's `aria-describedby`/`aria-labelledby`. See the Checkbox and Action Column in the example below.

Select all/ Deselect all

ID

First name

Last name

*emailEmail*

Status

Action

Select 2

2

Paul

Walters

[*email* paul.walters@yahoo.com](mailto: paul.walters@yahoo.com "E-mail")

Active

*edit**delete*

Select 1

1

Lola

Sporer

[*email* lola.sporer@gmail.com](mailto: lola.sporer@gmail.com "E-mail")

Active

*edit**delete*

Select 3

3

Malcolm

Spencer

[*email* malcolm.spencer@hotmail.com](mailto: malcolm.spencer@hotmail.com "E-mail")

Active

*edit**delete*

Select 5

5

Naomi

Jones

[*email* naomi.jones@yahoo.com](mailto: naomi.jones@yahoo.com "E-mail")

Active

*edit**delete*

Select 4

4

Christopher

Kunde

[*email* christopher.kunde@gmail.com](mailto: christopher.kunde@gmail.com "E-mail")

Active

*edit**delete*

*code**center\_focus\_weak**bug\_report*
