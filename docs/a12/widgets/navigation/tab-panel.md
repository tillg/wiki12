---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/navigation/tab-panel
widget: navigation/tab-panel
scraped: 2026-06-12
---

# Widgets/Navigation/Tab panel

Tab Panel

The **Tab Panel** Widget makes it easy to explore and switch between different views that are related and at the same level of hierarchy. It contains a list of tabs and their corresponding content.

Basic

Define the list of tabs by using the `tabs` property. Each tab is specified by `TabPanelTemplateProps.TabProps`.

A tab item can have the following states:

* `selected`: The currently active tab.
* `highlighted`: Visually emphasizes a tab with distinct styling, useful for drawing the user’s attention to a specific item.
* `disabled`: The tab is not interactive.

In the example below, the selected state is initially visible on the 1st tab and can be seen on other interactive tabs after you click them. The 3rd tab is highlighted and the 4th is disabled.

To display content above the tabs, use the `header` property. Besides that, **Tab Panel** also has a template `TabPanelTemplate.PanelHeader` that provides you a convenient way to create the header with `heading` and `suffixes` elements. In the example below, we display a title and a close button by using that template.

Warning

*warning*

**NOTE**

To fully support accessibility:

* You should pass an `id` to `TabPanel` and each tab should have its own `title`.
* When using a tab with Badge, you should set the `id` of Badge to be the same value as the `ariaDescribedby` property to ensure the screen reader can read the Badge's information.

* Navigation*navigation*
* Search*search*, 9 Info notifications9
* Calendar*event\_note*
* Feedback*feedback*
* *more\_horiz*

Tab Panel

*close*

Navigation Panel

*code**center\_focus\_weak**bug\_report*

Horizontal Tab Panel

**Tab Panel** supports two orientations: **vertical** (default) and **horizontal**, which can be set using the `orientation` property. This example demonstrates the horizontal orientation.

* Navigation*navigation*
* Search*search*, 9 Info notifications9
* Calendar*event\_note*
* Feedback*feedback*
* *more\_horiz*

*close*

Panel 1

*code**center\_focus\_weak**bug\_report*

Accessibility

By default, the **Tab Panel** will keep the focus on tab item after selecting. However, in certain scenarios, such as improving accessibility for screen reader users, it is better to move the focus to the panel area after a tab is selected. You can enable this behavior by setting the `focusOnPanelAfterSelect` property to **true**.

* Navigation*navigation*
* Search*search*, 9 Info notifications9
* Calendar*event\_note*
* Feedback*feedback*
* *more\_horiz*

Tab Panel

*close*

Navigation Panel

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

Types

* `TabPanelOrientation = "vertical" | "horizontal"`

TabPanelProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`enableA11YMobileDesignOnSubTab`

`boolean`

Enables the mobile design for better accessibility on sub tab menu, which opened by a condensed tab.

**@default** true

`focusOnPanelAfterSelect`

`boolean`

When set to true, selecting a tab item will set focus to the panel element instead of keeping focus on that tab item

**@default** false

`header`

`ReactNode`

The header of tab content.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`orientation`

`TabPanelOrientation`

The orientation of the tab panel.

**@default** "vertical"

`style`

`CSSProperties`

Additional styles.

`tabListAriaLabel`

`string`

Sets a custom aria-label for the tab list.
By default, this attribute's value are:

* English: "main navigation"
* German: "Hauptnavigation"

`tabs*`

`TabProps[]`

Array of Tab List.

`value`

`string`

Specifies the value of a Tab List that should get selected.

`wrapperRef`

`RefCallback<HTMLElement>`

The reference of the element wrapping the main content if one exists.

`onClose`

`void`

Callback that is called when the tab is closed.

`onSelect`

`(tab: TabProps) => void`

Callback that is called when the tab is clicked.

TabPanelTemplateProps.BaseProps

Property

Type

Description

`className`

`string`

Additional css class names.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`style`

`CSSProperties`

Additional styles.

TabPanelTemplateProps.PanelHeaderProps

Property

Type

Description

`ariaLevel`

`number`

Specifies the aria level of the heading.

**@default** 2

`className`

`string`

Additional css class names.

`heading`

`ReactNode`

Heading will be placed at the start of header.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`style`

`CSSProperties`

Additional styles.

`suffixes`

`ReactNode[]`

Suffixes will be placed at the end of header.

TabPanelTemplateProps.TabProps

Property

Type

Description

`ariaDescribedby`

`string`

**@deprecated** since 34.6.0, use `ariaLabelledby` instead

Value of ariaDescribedby should be id of additional elements inside a Tab.
For example: Badge

`ariaLabelledby`

`string`

Value of ariaLabelledby should be id of additional elements inside a Tab.
For example: Badge

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`dataRole`

`string`

data-role attribute.

`disabled`

`boolean`

Whether the tab is disabled.

`highlighted`

`boolean`

Specifies whether the tab is highlighted. It is used to draw attention to a specific tab.

`icon`

`ReactNode`

Icon of the tab.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`orientation`

`"horizontal" | "vertical"`

The orientation of a tab.

**@default** "vertical"

`selected`

`boolean`

Specifies whether the tab is selected.

`style`

`CSSProperties`

Additional styles.

`title`

`string`

Title attribute.

`value*`

`string`

Value used to identify a tab.
If `BaseProps.id` is undefined, the value will be set as id.

`wrapperRef`

`RefCallback<HTMLElement>`

The reference of the element wrapping the main content if one exists.

`onClick`

`(event: SyntheticEvent<HTMLElement>) => void`

Handle event when a tab is selected by mouse.

Theming configuration

The following theme variables can be used to customize the component:

```
1"tabPanel": {
2    "tabs": {
3        "background": "#f6fafe",
4        "minWidth": "52px",
5        "minHeight": "52px",
6        "padding": "48px 0 0",
7        "horizontalPadding": "0"
8    },
9    "tab": {
10        "active": {
11            "background": "rgba(255,255,255,0.4)",
12            "borderColor": "#00589f",
13            "color": "#00589f"
14        },
15        "border": "2px solid transparent",
16        "color": "#00589f",
17        "disabled": {
18            "background": "transparent",
19            "color": "#a9b3bc"
20        },
21        "focus": {
22            "background": "rgba(255,255,255,0.4)",
23            "borderColor": "#d50075",
24            "color": "#d50075",
25            "margin": "0 1px"
26        },
27        "fontSize": "1.125rem",
28        "hover": {
29            "background": "rgba(255,255,255,0.4)",
30            "borderColor": "#00589f",
31            "color": "#00589f"
32        },
33        "minHeight": "48px",
34        "minWidth": "48px",
35        "selected": {
36            "activeBackground": "#fff",
37            "afterBackground": "#fff",
38            "background": "#00589f",
39            "borderLeftWidth": "4px",
40            "borderTopWidth": "4px",
41            "color": "#fff",
42            "focusBackground": "#fff",
43            "fontSize": "1.25rem",
44            "hoverBackground": "#fff"
45        },
46        "highlighted": {
47            "activeBackground": "#fff",
48            "afterBackground": "#00589f",
49            "background": "#fff",
50            "borderLeftWidth": "4px",
51            "borderTopWidth": "4px",
52            "borderColor": "#00589f",
53            "color": "#00589f",
54            "focusBackground": "#fff",
55            "fontSize": "1.25rem",
56            "hoverBackground": "#fff"
57        }
58    },
59    "background": "#ebf1f7",
60    "contentBorder": "8px solid #00589f",
61    "header": {
62        "addonGap": "0 8px",
63        "background": "#00589f",
64        "minHeight": "48px",
65        "padding": "0 8px",
66        "buttonColor": "#fff",
67        "heading": {
68            "color": "#fff",
69            "fontSize": "1.3rem",
70            "fontWeight": 600,
71            "padding": "0 40px 0 40px"
72        }
73    }
74}
```

*content\_copy*
