---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-display/pagination
widget: data-display/pagination
scraped: 2026-06-12
---

# Widgets/Data display/Pagination

Pagination

The **Pagination** Widget allows users to select a specific page from a range of pages.

Basic

The `Pagination` requires the following properties:

* `pageCount`: The total number of pages
* `currentPage`: The currently selected page
* `onPageChanged`: The method to call when user change the page
* `pageLabelTemplate`: Define how the label is displayed. In this example, this property is set as `{page} of {total}`.

Show disabled state

*first\_page**navigate\_before*

Page

1 of 122 of 123 of 124 of 125 of 126 of 127 of 128 of 129 of 1210 of 1211 of 1212 of 12

*navigate\_next**last\_page*

*code**center\_focus\_weak**bug\_report*

Alignment

By using the `alignment` property, you can make the `Pagination` float `left` or `right`.

*first\_page**navigate\_before*

Page

1 / 122 / 123 / 124 / 125 / 126 / 127 / 128 / 129 / 1210 / 1211 / 1212 / 12

*navigate\_next**last\_page*

*first\_page**navigate\_before*

Page

1 / 122 / 123 / 124 / 125 / 126 / 127 / 128 / 129 / 1210 / 1211 / 1212 / 12

*navigate\_next**last\_page*

*code**center\_focus\_weak**bug\_report*

Simple Variant

This example shows the `Pagination` when the `type` property is set to `simple`. It is recommended for using in a dark background.

*arrow\_left*

3 of 12

*arrow\_right*

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

PaginationProps

Property

Type

Description

`alignment`

`"right" | "left"`

Specifies whether the Pagination has an alignment.

`className`

`string`

Additional css class names.

`currentPage*`

`number`

Specifies the current page number.
It has to be a positive integer that is not bigger than the `pageCount` .

`disabled`

`boolean`

Specifies whether the Pagination is disabled.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`nextButtonProps`

`ButtonProps`

Specifies the additional props for the "Next page" button.

`pageCount*`

`number`

Specifies the total number of pages.

`pageLabelTemplate*`

`string`

Specifies the page's label template.
For example: `"{page} / {total}"` .

`previousButtonProps`

`ButtonProps`

Specifies the additional props for the "Previous page" button.

`style`

`CSSProperties`

Additional styles.

`type`

`"default" | "simple"`

Specifies the type of the Pagination.

**@default** default

`onPageChanged*`

`(page: number) => void`

Handler function when the page changed.

Theming configuration

Since the **Pagination** is a combination of the [Button](#/widgets/general/buttons/button#buttons-theme-configuration) and [Select](#/widgets/data-entry/select#select-theme-configuration) widgets, it inherits the style configurations of those components.

Additionally, the component provides built-in theme variables that can be used to customize itself:

```
1"pagination": {
2    "buttonIconFontSize": "1.5rem",
3    "select": {
4        "arrow": {
5            "color": "#00589f",
6            "disabledColor": "#a9b3bc",
7            "fontSize": "1.125rem",
8            "iconWidth": "24px"
9        },
10        "background": "#ebf1f7",
11        "title": {
12            "activeBorder": "2px solid #00589f",
13            "border": {
14                "radius": "2px",
15                "width": "2px"
16            },
17            "focusBorder": "2px solid #d50075",
18            "height": "calc(8px + 1rem)",
19            "hoverBorder": "2px solid #00589f"
20        },
21        "width": "calc(32px + 3.25rem)"
22    },
23    "simple": {
24        "border": "1px solid #fff",
25        "borderRadius": "2px",
26        "button": {
27            "active": {
28                "background": "rgba(0,0,0,0.2)",
29                "border": "2px solid #fff"
30            },
31            "color": "#fff",
32            "disabledColor": "#fff",
33            "focus": {
34                "background": "rgba(0,0,0,0.2)",
35                "border": "2px solid #fff",
36                "color": "#fff"
37            },
38            "hover": {
39                "background": "rgba(0,0,0,0.2)",
40                "border": "2px solid #fff"
41            },
42            "iconFontSize": "1.5rem",
43            "padding": "4px 0"
44        },
45        "color": "#fff",
46        "label": {
47            "fontFamily": "\"Open Sans\", sans-serif",
48            "fontSize": "0.75rem",
49            "margin": "0 4px",
50            "minWidth": "40px"
51        }
52    }
53}
```

*content\_copy*
