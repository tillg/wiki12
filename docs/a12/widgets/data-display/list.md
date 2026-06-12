---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-display/list
widget: data-display/list
scraped: 2026-06-12
---

# Widgets/Data display/List

List

The **List** Widget is a component that displays as a continuous, vertical indexes of text or images. They are composed of items containing primary and supplemental actions, which are represented by icons and text.

Basic

To give the **List** a border, set the `border` property to `true`.

If you'd like to have a divider between list items, pass the `divider` property to the **List** or the individual **List.Item** you want to have dividers.

The example below adds a divider between the interactive and non-interactive items. We also use the `selected`, `readonly`, and `disabled` properties to set state for the list items.

* List Item
* List Item
* List Item
* List Item
* List Item

*code**center\_focus\_weak**bug\_report*

List Elements

If you'd like the item to display more information, you can use these properties:

* `secondaryText`: to display a secondary text. By default, it will be placed below the item text. To swap its position and the text, you can pass the `flipped` property to the `List` or respective `List.Item`.
* `graphic`: to display an element before the text. Pass the `paddedLeft` property to the `List` to make the item which doesn't have a graphic align with the others.
* `meta`: to display an element after the text. Pass the `paddedRight` property to the `List` to make the item which doesn't have a graphic align with the others.

In addition, you can make the list items look like a group by adding a `List.SubHeader`. By default, the sub header doesn't a have background. To make it stand out from the list, set `fill` to `true`.

Secondary Text Position

Default

Flipped

Graphic

None

Icon

Text

Meta

None

Icon

Text

* List Item

  Secondary text
* List Item

  Secondary text
* List Item

  Secondary text
* List Item without graphic or meta

  Secondary text
* Sub header
* List Item

  Secondary text
* List Item

  Secondary text
* List Item

  Secondary text
* List Item without graphic or meta

  Secondary text

*code**center\_focus\_weak**bug\_report*

Item With Progress Bar

To show **List.Item** and **Button** with [Progress Bar](#/widgets/feedback/progress-bar#progress-bar), you can pass the completed percentage of the process to the `processedPercentage` property.

Click the button DOWNLOAD to see the progress bar.

* *folder*

  Photos

  Aug 5, 2007

  900 MB
* *folder*

  Travel

  Jan 24, 2018

  800 MB

Download

*code**center\_focus\_weak**bug\_report*

Combination

This example is a combination of all elements from the List, also demonstrates how to customize the theme for the **List** on your own.

For **Accessibility**:

* Because of semantic reasons, it is not recommended to use the list item as interactive wrapper with other interactive elements inside. Instead, the list item itself should not be interactive and the main action should be made available via button or icon button.
* If a list item has no `onClick` handler provided, it is considered non-interactive and should be explicitly marked with either the `readonly` or `disabled` property to properly indicate its state.

Warning

*warning*

**NOTE**

If there are any interactive elements in the `meta` or `graphic` of the list item, when hover or focus on these elements, the hover or focus style of the interactive list item will not be applied.

* *people*

  Interactive items

  *edit*
* *account\_circle*

  Project A

  Has event on item

  *delete*
* *account\_circle*

  Project B

  Has individual event on item & meta

  *delete*
* *people*

  Disabled items

  *edit*
* *account\_circle*

  Project C

  Has event but disabled

  *notifications*
* *account\_circle*

  Project D

  Disabled, no event

  *calendar\_today*
* *people*

  Read-Only item

  *edit*
* *account\_circle*

  Project E

  No event on item, but meta

  *download*
* *people*

  Additional Examples

  *edit*
* *info*

  Custom Action Button
* Schedule Meeting

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

ListItemProps

Property

Type

Description

`active`

`boolean`

Uses the active style.

`ariaLabel`

`string`

Specifies the aria-label attribute for the item.

`buttonSemantics`

`{ active: boolean, destructive: boolean, iconOnly: boolean, primary: boolean, secondary: boolean }`

Button semantic style properties for preserving button appearance in list items.
These properties are used when buttons are displayed as list items in popup menus.

`className`

`string`

Additional css class names.

`contentProps`

`Identifiable & Ref<HTMLDivElement>`

Additional properties for the content wrapper.

`dataRole`

`string`

data-role attribute.

`disabled`

`boolean`

Whether the item is disabled.

`divider`

`boolean | "light" | "dark"`

Whether a divider will be added below the item.

* `true` or `false` : Standard boolean divider behavior
* `"light"` : Light divider (1px, using divider.colorLight)
* `"dark"` : Dark divider (2px, using divider.colorDark)

`flipped`

`boolean`

Whether the position of `text` and `secondaryText` is reversed.

`graphic`

`ReactNode`

Displays an element before the text.

`graphicWrapperProps`

`DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>`

Additional properties for the graphic wrapper.

`htmlAttributes`

`HTMLAttributes<HTMLElement>`

Additional props that will be placed at the DOM element.
It should be used in case a user wants to access to native DOM properties but there's no property allows to do that.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`meta`

`ReactNode`

Displays an element after the text.

`processedPercentage`

`number`

Progressed percentage of the process.
This property specifies the width of Progress Bar component.
Recommend using when a user is in the action which needs to visualize the progression (ex: downloading, installing...).

`readonly`

`boolean`

Whether the item is readonly.

`secondaryText`

`ReactNode`

Displays the secondary information.

`selected`

`boolean`

Whether the item is being selected and indicates the current "pressed" state.

`style`

`CSSProperties`

Additional styles.

`tabIndex`

`number`

Specifies the tabIndex attribute for the item.

`text`

`ReactNode`

Displays the primary information.

`title`

`string`

Specifies the title attribute for the item.

`wrapperRef`

`RefCallback<HTMLLIElement>`

The reference of the element wrapping the main content if one exists.

`onClick`

`(event?: MouseEvent<HTMLElement, MouseEvent>) => void`

A callback that will be triggered when the item is clicked.

`onFocus`

`(event?: FocusEvent<HTMLElement, Element>) => void`

A callback that will be triggered when the item gets focus on.

`onKeyDown`

`(event: KeyboardEvent<HTMLElement>) => void`

A callback that will be triggered when a key is pressed.

`onKeyUp`

`(event: KeyboardEvent<HTMLElement>) => void`

A callback that will be triggered when a key is released.

`onMouseDown`

`(event?: MouseEvent<HTMLElement, MouseEvent>) => void`

A callback when pressing a mouse button over the item.

`onMouseEnter`

`(event?: MouseEvent<HTMLElement, MouseEvent>) => void`

A callback that will be triggered when the mouse pointer enters the item.

`onMouseLeave`

`(event?: MouseEvent<HTMLElement, MouseEvent>) => void`

A callback that will be triggered when the mouse pointer leaves the item.

`onMouseOver`

`(event?: MouseEvent<HTMLElement, MouseEvent>) => void`

A callback that will be triggered when moving the mouse pointer onto the item.

ListProps

Property

Type

Description

`ariaControls`

`string`

aria-control attribute for the list.

`ariaDescribedby`

`string`

aria-describedby attribute for the list.

`border`

`boolean`

Whether the list has a border.

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`dataRole`

`string`

data-role attribute.

`divider`

`boolean`

Whether a divider will be added below each item.

`flipped`

`boolean`

Whether the position of the text and secondary text is reversed.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`paddedLeft`

`boolean`

Whether the item's text should all be aligned with or without the graphic.

`paddedRight`

`boolean`

Whether the item which doesn't have a meta will be aligned with the others.

`role`

`string`

role attribute for the list.

`style`

`CSSProperties`

Additional styles.

`tabIndex`

`number`

tab-index attribute for the list.

`wrapperRef`

`RefCallback<HTMLUListElement>`

The reference of the element wrapping the main content if one exists.

`onKeyDown`

`(event: KeyboardEvent<HTMLElement>) => void`

A callback will be triggered on keydown event.

ListSubHeaderProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`divider`

`boolean`

Whether a divider will be added below the sub-header.

`fill`

`boolean`

Whether the sub-header has a background.

`graphic`

`ReactNode`

Additional icon will be shown on the left of the title.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`meta`

`ReactNode`

Additional icon will be shown on the right of the title.

`style`

`CSSProperties`

Additional styles.

`title`

`string`

Title of the sub-header.

`onClick`

`(event?: MouseEvent<HTMLElement, MouseEvent>) => void`

A handler for click event. If this property is passed, the sub-header will be interactive and have the hover and focus states.

`onKeyDown`

`(event: KeyboardEvent<HTMLElement>) => void`

A handler for key down event on the sub-header.

`onKeyUp`

`(event: KeyboardEvent<HTMLElement>) => void`

A handler for key up event on the sub-header.

Theming configuration

The following theme variables can be used to customize the component:

```
1"list": {
2    "background": "#fff",
3    "border": "1px solid #e2e6e9",
4    "dividerBorder": "1px solid #e2e6e9",
5    "dividerMargin": 0,
6    "fontFamily": "\"Open Sans\", sans-serif",
7    "item": {
8        "activeBorder": "2px solid #00589f",
9        "color": "#333",
10        "gap": "16px",
11        "buttonSemanticsGap": "4px",
12        "buttonSemanticsDivider": {
13            "light": "1px solid #fff",
14            "dark": "2px solid #becfe2"
15        },
16        "disabledColor": "#a9b3bc",
17        "focusBorder": "2px solid #d50075",
18        "focusOutline": "1px dotted #00589f",
19        "hoverBG": "#f1f2f4",
20        "hoverBorder": "2px solid #00589f",
21        "hoverTextDecoration": "none",
22        "padding": "8px 16px",
23        "readOnly": {
24            "color": "inherit"
25        },
26        "selected": {
27            "activeLeftBorder": "4px solid #00589f",
28            "background": "#fff",
29            "color": "inherit",
30            "focusLeftBorder": "4px solid #d50075",
31            "fontWeight": 400,
32            "hoverLeftBorder": "4px solid #00589f",
33            "leftBorder": "4px solid #00589f"
34        },
35        "spacing": "16px",
36        "graphic": {
37            "color": "inherit",
38            "iconColor": "inherit",
39            "iconFontSize": "1.5rem",
40            "placeholder": {
41                "background": "#4e5965",
42                "color": "#fff",
43                "fontSize": "1rem",
44                "height": "24px",
45                "lineHeight": "24px",
46                "width": "24px"
47            }
48        },
49        "meta": {
50            "color": "#616f7c",
51            "fontSize": "0.75rem",
52            "iconColor": "inherit"
53        },
54        "minHeight": "48px",
55        "text": {
56            "color": "inherit",
57            "fontSize": "0.875rem",
58            "fontWeight": 400
59        },
60        "secondaryText": {
61            "color": "inherit",
62            "fontSize": "0.75rem",
63            "fontWeight": 400,
64            "lineHeight": "1rem"
65        }
66    },
67    "subHeader": {
68        "color": "#333",
69        "fillBG": "#ebf1f7",
70        "fillColor": "#333",
71        "fontSize": "0.875rem",
72        "fontWeight": 700,
73        "height": "32px",
74        "minHeight": "32px",
75        "lineHeight": "1.5rem",
76        "padding": "0 16px",
77        "active": {
78            "background": "#fff"
79        },
80        "hover": {
81            "background": "#fff"
82        },
83        "focus": {
84            "background": "#fff"
85        }
86    }
87}
```

*content\_copy*
