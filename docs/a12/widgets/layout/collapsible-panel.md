---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/layout/collapsible-panel
widget: layout/collapsible-panel
scraped: 2026-06-12
---

# Widgets/Layout/Collapsible panel

Collapsible Panel

The **Collapsible Panel** Widget is a container that holds other controls and provides an easy expansion/collapse mechanism.
Besides, there is also the [Typography](#/widgets/utils/typography) Widget that provides all features of the **Collapsible Panel** and in addition allows creating a visual hierarchy.

Basic

*keyboard\_arrow\_down*

Title

 - Data available

Our A12 Widgets mission is to provide a wide range of web components that follow a consistent and attractive design and interaction concept (Plasma) to support business applications running on desktop, tablet and smart phone supporting keyboard, mouse and touch input. The components provide an easy to use, well documented, strongly typed API and are extendable and customizable.

*code**center\_focus\_weak**bug\_report*

Addons

Use the `addons` property to display elements on the right side.

You can also set the property `swapAddonsPosition` to swap the positions of the addons and collapsed icon (arrow icon).

Swap icon and addons positions

*keyboard\_arrow\_right*

Title

*print*

*code**center\_focus\_weak**bug\_report*

Accessibility

To better support accessibility, we have provided `role` and `ariaLevel` properties.
These properties aren't assigned any values by default.

In this example, we set the `role` to `heading` and the `ariaLevel` to `2`.

*keyboard\_arrow\_down*

Title with role and ariaLevel

Example of role and aria-level in CollapsiblePanel

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

CollapsiblePanelProps

Property

Type

Description

`addons`

`ReactNode`

Additional information that will be placed at the end of the `title` .

`ariaLevel`

`number`

Define the aria level of title by the integer number

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`info`

`string`

Additional information that will be printed next to the title.

`role`

`string`

Value of role attribute, in order to support Accessibility.

See [Roles*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles "Leave Page")

`style`

`CSSProperties`

Additional styles.

`swapAddonsPosition`

`boolean`

Whether the position of addons will be swapped with the collapsed icon (arrow icon).

`title`

`ReactNode`

The title of the CollapsiblePanel.

`onClick*`

`void`

Is called when the panel is clicked.

Theming configuration

The following theme variables can be used to customize the component:

```
1"collapsiblePanel": {
2    "addons": {
3        "gap": "8px"
4    },
5    "content": {
6        "color": "#333"
7    },
8    "fontFamily": "\"Open Sans\", sans-serif",
9    "fontSize": "0.75rem",
10    "icon": {
11        "color": "inherit",
12        "fontSize": "1.5rem",
13        "focusColor": "#fff"
14    },
15    "indicator": {
16        "backgroundColor": "transparent",
17        "borderRadius": "12px",
18        "fontSize": "calc(1rem * 1.2)",
19        "marginRight": "4px",
20        "width": "auto",
21        "top": "calc((1.125rem - 1.5rem) * 0.5)",
22        "left": "calc(0px - 1.5rem - 4px)"
23    },
24    "label": {
25        "marginLeft": "calc(1.5rem + 4px)"
26    },
27    "labelInfo": {
28        "fontStyle": "italic",
29        "fontWeight": "400"
30    },
31    "minHeight": "36px",
32    "title": {
33        "backgroundColor": "#ebf1f7",
34        "color": "#00589f",
35        "fontSize": "0.875rem",
36        "fontWeight": 700,
37        "padding": "8px 16px",
38        "activeBackgroundColor": "transparent",
39        "activeBoxShadow": "inset 0 0 0 2px #00589f",
40        "hoverBackgroundColor": "transparent",
41        "hoverBoxShadow": "inset 0 0 0 2px #00589f",
42        "focusByTab": {
43            "backgroundColor": "#d50075",
44            "color": "#fff",
45            "border": "1px dotted #00589f"
46        }
47    }
48}
```

*content\_copy*
