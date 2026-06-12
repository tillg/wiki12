---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/layout/layout-grid
widget: layout/layout-grid
scraped: 2026-06-12
---

# Widgets/Layout/Layout grid/Template

Layout Grid

The **Layout Grid** Widget is a grid-based layout system with `Row` and `Column` placed inside the `Grid`. It's fully responsive and can be used to create a two-dimensional layout where you can flexibly align content in any way you see fit.

There are 4 grid breakpoints:

* `lg` (large) when the container's width is 992px or larger.
* `md` (medium) when the container's width is from 768px to 991px.
* `sm` (small) when the container's width is from 576px to 767px.
* `xs` (extra small) when the container's width is less than 576px.

There are twelve columns per row in the `lg`, `md` and `sm` sizes. At the `xs` breakpoint, there is always one column.

* basic
* advanced
* API

Breakpoints

This example uses custom breakpoints. The slider below will trigger the size changed based on that given breakpoints.

Drag this slider to directly manipulate the width:

**Current breakpoint:** sm

sm: 6-6-6-6; md: 12-6-6-12; lg: 2-4-3-3

Label 1

*infoHint: Tooltip*

Label 2

Label 3

Label 4

Label 5

Label 6

Label 7

Label 8


sm: 6-6-6; md: 6-6-6; lg: 3-6-3

Label 1

A single TextOutput

amet ullamco duis mollit irure ipsum dolore nulla sint proident ut amet minim non ea mollit ea incididunt reprehenderit elit ut excepteur consequat consequat ex cillum irure magna in aliquip quis laboris fugiat eu labore aliquip consectetur voluptate duis sunt et excepteur labore officia Lorem elit nostrud commodo duis velit

Label 2

Label 3

Label 4

Label 5

*code**center\_focus\_weak**bug\_report*

Optional Breakpoints

If no config is given for a certain size, the next largest size's information will be used. For instance, if no config is given for `md`, the calculation result of `lg` will be used.

Warning

*warning*

**NOTE**

* The breakpoint of a `Column` can also be optional.
* Which breakpoint is defined in the `size` of the `Column` should also be defined in the `breakpoints` of the `Grid`.

Optional Breakpoint

Enable SM Breakpoint

Enable MD Breakpoint

Width of Container

xs (200px)

sm (300px)

md (400px)

lg (750px)

lg: 4-8

Lorem ipsum dolor

duis esse adipisicing pariatur incididunt exercitation sint ut minim elit consectetur non et ullamco ut consectetur et consequat voluptate dolor

Lorem ipsum dolor

duis esse adipisicing pariatur incididunt exercitation sint ut minim elit consectetur non et ullamco ut consectetur et consequat voluptate dolor

lg: 4-4-4

Lorem ipsum dolor

duis esse adipisicing pariatur incididunt exercitation sint ut minim elit consectetur non et ullamco ut consectetur et consequat voluptate dolor

Lorem ipsum dolor

laboris in dolore cupidatat id fugiat do cillum amet ullamco adipisicing pariatur ullamco occaecat voluptate mollit laborum enim esse reprehenderit qui aliqua deserunt anim anim ad sit fugiat magna ullamco incididunt voluptate pariatur dolor magna cillum fugiat dolor nulla dolore commodo ullamco eu nostrud et ad non mollit sit voluptate

Lorem ipsum dolor

duis esse adipisicing pariatur incididunt exercitation sint ut minim elit consectetur non et ullamco ut consectetur et consequat voluptate dolor

*code**center\_focus\_weak**bug\_report*

Alignment

The `verticalAlignment` property makes the content to be aligned vertically.

It can be applied at:

* `LayoutGrid`: applies to all rows.
* `Row`: applies to a specific row.
* `Column`: applies to a specific column.

And it has the following values:

* `undefined` (default value): The Column will stretch as the Row's size.
* `top`: The Column will align at the top of the Row. The Column's height depends on its content.
* `middle`: The Column will align in the middle of the Row. The Column's height depends on its content.
* `bottom`: The Column will align at the bottom of the Row. The Column's height depends on its content.

Apply vertical alignment for:

Layout Grid

First Row

First Column


Vertical alignment value:

Default

Top

Middle

Bottom

Label A

*infoHint: Tooltip*

Label B

aliquip pariatur sunt voluptate excepteur nisi cillum Lorem consectetur esse sunt Lorem proident nisi ad incididunt pariatur id adipisicing consectetur ad culpa velit fugiat sit irure consequat irure incididunt voluptate reprehenderit irure aliquip fugiat occaecat incididunt nisi enim laborum enim irure Lorem et nisi duis et nostrud deserunt esse dolor

Label A

Checkbox

Label A

*infoHint: Tooltip*

Label B

aliquip pariatur sunt voluptate excepteur nisi cillum Lorem consectetur esse sunt Lorem proident nisi ad incididunt pariatur id adipisicing consectetur ad culpa velit fugiat sit irure consequat irure incididunt voluptate reprehenderit irure aliquip fugiat occaecat incididunt nisi enim laborum enim irure Lorem et nisi duis et nostrud deserunt esse dolor

Label A

*file\_upload*

*code**center\_focus\_weak**bug\_report*
