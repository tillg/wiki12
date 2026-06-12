---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-display/tree-table
widget: data-display/tree-table
scraped: 2026-06-12
---

# Widgets/Data display/Tree table

Tree Table

The **Tree Table** Widget displays hierarchical data in rows and columns. It is a combination of the [Table](#/widgets/data-display/table) and [Tree](#/widgets/data-display/tree).

* basic
* advanced
* API

Basic

You can handle events when the row or arrow button is clicked by passing corresponding handlers to the `rowEventHandlers` property.

* `onClick`: to handle an event when the row is clicked. For example, to update the selection state of a row.
* `onArrowClick`: to handle an event when the arrow button of a row is clicked. For example, to toggle the expanding/collapsing state of a node.

To set states for a specific row, you can use the `rowStyling` property that provides some variants on whether the row is interactive, selected, disabled or highlighted.

You can trigger the row action with Enter on a cell.

Folder

Date modified

Size

Owner

Group

Date Added

*expand\_more*

*computer*

My Computer

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*expand\_more*

*storage*

C:

, belongs toMy Computer

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*folder*

Non-interactive node

, belongs toC:

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*folder*

Temp

, belongs toC:

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*expand\_more*

*folder*

ZANS and quiet a long text, that it has to display multiline

, belongs toC:

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*expand\_more*

*folder*

System32

, belongs toZANS and quiet a long text, that it has to display multiline

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*insert\_drive\_file*

sasser.dll

, belongs toSystem32

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*blockDisable*

Disabled,

*insert\_drive\_file*

swap.sys

, belongs toC:

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*folder*

Locked

, belongs toC:

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*storage*

D:

, belongs toMy Computer

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*blockDisable*

Disabled,

*expand\_more*

*storage*

E:

, belongs toMy Computer

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*insert\_drive\_file*

autostart.bat

, belongs toE:

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*code**center\_focus\_weak**bug\_report*

Async

This example demonstrates how to create a Tree asynchronously. The fetch process will take a bit of time to show the hidden data. The loading icon will be shown during that time.

Folder

Date modified

Size

Owner

Group

Date Added

*chevron\_right*

*computer*

My Computer

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*code**center\_focus\_weak**bug\_report*

Accessibility

To fully support accessibility, the **TreeTable** should have its own `id`. It will be used to create an **id** for the **hidden text** that is placed in front of the interactive Tree Table for screen-readers. That id will be linked to the **aria-labelledby** attribute. In addition, you can link the external ids via the `ariaLabelledby` property.

If you'd like to add more hidden texts, you can use the `ariaLabel` property.

`componentRenderers` and the `Root` properties let you customize the Tree Table's rendered output. When providing custom components, ensure accessibility is preserved by including the appropriate ARIA attributes and roles.

To expose row data to the screen reader (e.g. reading the row ID when an action button is focused), include it in the button's `title` or use a `HiddenText` linked via button's `aria-describedby`/`aria-labelledby`. See the Remove Button in the example below.

You can trigger the row action with Enter on a cell.

Folder

Date modified

Size

Owner

Group

Date Added

Action

*expand\_more*

*computer*

My Computer

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*delete*

*expand\_more*

*storage*

C:

, belongs toMy Computer

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*delete*

*folder*

Non-interactive node

, belongs toC:

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*delete*

*folder*

Temp

, belongs toC:

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*delete*

*expand\_more*

*folder*

ZANS and quiet a long text, that it has to display multiline

, belongs toC:

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*delete*

*expand\_more*

*folder*

System32

, belongs toZANS and quiet a long text, that it has to display multiline

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*delete*

*insert\_drive\_file*

sasser.dll

, belongs toSystem32

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*delete*

*insert\_drive\_file*

swap.sys

, belongs toC:

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*delete*

*folder*

Locked

, belongs toC:

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*delete*

*storage*

D:

, belongs toMy Computer

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*delete*

*expand\_more*

*storage*

E:

, belongs toMy Computer

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*delete*

*insert\_drive\_file*

autostart.bat

, belongs toE:

2021-11-11

10024KB

Widgets

Software Engineer

2021-10-10

*delete*

*code**center\_focus\_weak**bug\_report*

Content Type Example

Provide all relevant examples of nodes and children in the initially collapsed and expandable states in combination with the following errors and warnings:

* The parent has a warning, the children have no issues
* The parent has an error, the children have no issues
* The parent has no issue, but the children have warnings
* The parent has no issue, but the children have errors
* The parent has a warning, the children have warnings
* The parent has an error, the children have errors

Edge cases:

* The parent has a warning, the children have errors
* The parent has an error, the children have errors
* The parent has a warning, the children have both
* The parent has an error, the children have both

State of errors or warnings

Folder

Date modified

Size

Owner

Group

Date Added

*expand\_more*

root

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*warningWarning found in entry*

*expand\_more*

Chart

, belongs toroot

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

Bar Chart

, belongs toChart

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

Line Chart

, belongs toChart

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

Pie Chart

, belongs toChart

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*Error*

*chevron\_right*

Comment Container

, belongs toroot

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*expand\_more*

Faceted Search

, belongs toroot

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*warningWarning found in entry*

Filter

, belongs toFaceted Search

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*warningWarning found in entry*

Filter Bar

, belongs toFaceted Search

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*warningWarning found in entry*

Filter Selector

, belongs toFaceted Search

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*expand\_more*

Menu

, belongs toroot

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*Error*

Flyout Menu

, belongs toMenu

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*Error*

Sliding Menu

, belongs toMenu

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*There are warnings for entries underneath*

*chevron\_right*

Notification

, belongs toroot

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*warningWarning found in entry*

*expand\_more*

Picker

, belongs toroot

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*Error*

Date Picker

, belongs toPicker

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*Error*

Time Picker

, belongs toPicker

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*Error*

*expand\_more*

Plugin Editor

, belongs toroot

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*warningWarning found in entry*

Link Plugin

, belongs toPlugin Editor

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*warningWarning found in entry*

Mention Plugin

, belongs toPlugin Editor

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*warningWarning found in entry*

SpellCheck Plugin

, belongs toPlugin Editor

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*warningWarning found in entry*

Static Toolbar Plugin

, belongs toPlugin Editor

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*There are errors for entries underneath*

*chevron\_right*

Tag

, belongs toroot

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*warningWarning found in entry*

*expand\_more*

Tooltip

, belongs toroot

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*warningWarning found in entry*

Hint

, belongs toTooltip

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*Error*

Warning

, belongs toTooltip

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*Error*

Error

, belongs toTooltip

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*There are errors for entries underneath*

*chevron\_right*

Input

, belongs toroot

2021-11-11

10025KB

Widgets

Software Engineer

2026-06-12

*code**center\_focus\_weak**bug\_report*
