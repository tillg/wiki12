---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/navigation/dropdown
widget: navigation/dropdown
scraped: 2026-06-12
---

# Widgets/Navigation/Dropdown

Dropdown

The **Dropdown** Widget presents a list of options from which a user can select one or several options. A selected option can represent a value in a form, or can be used as an action to filter or sort existing content.

Basic

By default, you can use the up/down arrow keys to move between the Dropdown's items when focusing on the Dropdown.

The Dropdown also provides a footer to display additional elements that provide extended functionality such as loading more items. To enable this feature, use the `footer` property.

In addition, if you'd like to have a lighter background, you can use the `lightBackground` property.

Light Background

10 of 10 options shown

Empty item

Armchair

Bean bag

Disabled item

Chair

Desk

Pocker table

Rocking chair

Sideboard

Waterbed

[Load More](#)

*code**center\_focus\_weak**bug\_report*

Items With Graphic

To display an icon along with the label, define the `graphic` property in DropdownItem.

To display items horizontally, set the `horizontal` property to true. In this mode, you can use both left/right arrow keys and up/down arrow keys to move between the Dropdown's items. You can go to the [Icon Picker](#/widgets/data-entry/icon-picker) widget to see how the horizontal Dropdown is used.

Horizontal Mode

25 of 25 options shown

*vertical\_align\_top*

Top

*vertical\_align\_center*

Middle

*vertical\_align\_bottom*

Bottom

*format\_align\_center*

Center

*format\_align\_justify*

Justify

*format\_align\_left*

Left

*format\_align\_right*

Right

*format\_indent\_decrease*

Decrease

*format\_indent\_increase*

Increase

*translate*

Translate

*visibility*

Visibility

*visibility\_off*

Invisibility

*view\_array*

view array

*view\_column*

View column

*view\_day*

View day

*view\_headline*

View headline

*view\_list*

View list

*view\_module*

View module

*view\_quilt*

View quitl

*view\_stream*

View stream

*view\_week*

View week

*view\_agenda*

View agenda

*code**center\_focus\_weak**bug\_report*

Extended

It's considered extended when an item contains another list of DropdownItem.

Light Background

10 of 10 options shown

Cost Report

Cost Report with The A12 widget library is part of the A12 Business Application Platform.

Costs

… *chevron\_right* General Data with Our A12 Widgets mission is to provide a wide range of web components that follow a consistent and attractive design and interaction concept (Plasma) to support business applications running on desktop, tablet and smart phone supporting keyboard, mouse and touch input. The components provide an easy to use, well documented, strongly typed API and are extendable and customizable.

Insurance Company

… *chevron\_right* General Data

Client with Our A12 Widgets mission is to provide a wide range of web components that follow a consistent and attractive design and interaction concept (Plasma) to support business applications running on desktop, tablet and smart phone supporting keyboard, mouse and touch input. The components provide an easy to use, well documented, strongly typed API and are extendable and customizable.

… *chevron\_right* Partner

Insurance Company

… *chevron\_right* Partner

Disabled item

… *chevron\_right* Disabled secondary text

Offer

Coverage

Clauses

Policy

Coverage

Clauses

*code**center\_focus\_weak**bug\_report*

With Link Items

You can add a list of [Link](#/widgets/general/link) Widgets to the `links` property to provide additional items with functionalities to the **Dropdown**.

Light Background

[*add* Assign to me](#)

[*person\_remove* Remove assignment](#)

John Doe

Paul Walters

Lola Sporer

Malcolm Spencer

Naomi Jones

Christoper Kunde

Katelynn Schmidt

Hubert Davis

Vito Spencer

Kathryn Bernier

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

Types

* `SelectedItemPosition = "top" | "middle" | "bottom"`

DropDownItem

Property

Type

Description

`ariaChecked`

`"true" | "false" | "mixed"`

aria-checked attribute.

`children`

`DropDownItem[]`

Whether a dropdown item contains a list of DropdownItem inside.

`className`

`string`

Additional css class names.

`disabled`

`boolean`

Whether a dropdown item should be disabled.

`graphic`

`ReactNode`

A graphic element (e.g. icon) that is placed in front of the `label` .

`hideLabel`

`boolean`

If set to true, the label will still be rendered but it won't be displayed.
This will save space but still support Accessibility.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`isEmptyValue`

`boolean`

Whether a dropdown item represents an empty value.

`label*`

`string`

Label of dropdown item.

`secondaryText`

`ReactNode`

An additional text that is placed below the `label` .

`selected`

`boolean`

Whether a dropdown item should be selected.

`style`

`CSSProperties`

Additional styles.

`tabIndex`

`number`

tabindex attribute.

**@default** -1 if `children` is defined or `disabled` is true

`title`

`string`

title attribute.

`value`

`string`

Specifies the value of a DropdownItem that should get selected.
If the value does not exist, the `selected` item will be set dependent on the `label` and id or `selected` .

DropDownProps

Property

Type

Description

`ariaLabelledby`

`string`

aria-labelledby attribute for the dropdown content wrapper.

`className`

`string`

Additional css class names.

`footer`

`ReactNode`

To display element(s) at the bottom for extended functionality such as loading more items.

`hint`

`string`

Displays how many items match the searched keywords.

`horizontal`

`boolean`

Display items in horizontal.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`items*`

`DropDownItem[]`

List of DropDownItem.

`keysToSelectItem`

`string[]`

Keys to select an item.

**@default** ENTER

`lightBackground`

`boolean`

Uses the light color for background.

`links`

`ReactNode[]`

List of links that will be displayed on top of `items` .

`selectedItem`

`DropDownItem`

Defines the selected item.

`selectedItemPosition`

`SelectedItemPosition`

initial position of selected item.

**@default** "bottom"

`selectItemKeys`

`number[]`

Keycode to select an item.

**@default** ENTER

**@deprecated** since 32.3.0 because event.keycode is deprecated. Use `keysToSelectItem` instead.

`style`

`CSSProperties`

Additional styles.

`tabIndex`

`number`

Defines the tabindex attribute.

**@default** 0

`touch`

`boolean`

Whether the dropdown is in touch mode or not.

**@deprecated** since 32.0.0 because touch is detected inside of Dropdown, don't need this prop anymore.

`wrapperRef`

`RefCallback<HTMLDivElement>`

The reference of the element wrapping the main content if one exists.

`onBlur`

`(event: FocusEvent<HTMLElement>) => void`

Handle event when blurring the dropdown.

`onClick`

`(item: DropDownItem, event: MouseEvent<HTMLElement>) => void`

Handle event when an item is selected by mouse.

**@deprecated** from 29.0.0. Use `onSelectedItemChange` instead.

`onKeyDown`

`(event: KeyboardEvent<HTMLElement>) => void`

Handle event when pressing keyboard on the dropdown wrapper.

`onKeyPress`

`(event: KeyboardEvent<HTMLElement>) => void`

Handle event when a key has been pressed.

`onMouseDown`

`(item: DropDownItem, event: MouseEvent<HTMLElement>) => void`

Handle event when triggering mousedown on an item.

`onPreselectedItemChange`

`(preselectedItem: DropDownItem | undefined) => void`

Trigger when the pre-selected item is changed.
For example, when pressing up/down arrow key.

`onPreselectedLinkChange`

`(preselectedLinkPosition: number | undefined) => void`

Trigger when the pre-selected link is changed.
For example, when pressing up/down arrow key.

`onScroll`

`(event: UIEvent<HTMLElement>) => void`

Handle event when the DropDown is scrolled.

`onSelectedItemChange`

`(selectedItem: DropDownItem | undefined) => void`

Trigger when the selected item is changed - clicking/press Enter on an item.

`onWrapperMouseDown`

`(event: MouseEvent<HTMLElement>) => void`

Handle event when triggering mousedown on the dropdown wrapper.

Theming configuration

The following theme variables can be used to customize the component:

```
1"dropdown": {
2    "background": "#f1f2f4",
3    "boxShadow": "0 1px 2px 0 rgba(22,25,29,0.4)",
4    "outline": "1px solid #becfe2",
5    "contentMaxHeight": "252px",
6    "fontFamily": "\"Open Sans\", sans-serif",
7    "graphic": {
8        "lineHeight": "16px",
9        "margin": "4px 8px 4px 0"
10    },
11    "hint": {
12        "height": "auto",
13        "minHeight": "24px",
14        "padding": "2px 8px",
15        "background": "#f7fafc",
16        "color": "#333",
17        "fontSize": "0.75rem"
18    },
19    "horizontal": {
20        "item": {
21            "activeColor": "#00589f",
22            "graphic": {
23                "fontSize": "1.125rem",
24                "size": "24px"
25            },
26            "hover": {
27                "color": "#00589f"
28            },
29            "label": {
30                "fontSize": "0.625rem",
31                "width": "36px"
32            },
33            "padding": "8px 4px"
34        },
35        "selectedItem": {
36            "background": "#00589f",
37            "color": "#333",
38            "graphicColor": "#fff"
39        }
40    },
41    "item": {
42        "active": {
43            "border": "2px solid #00589f",
44            "color": "#333"
45        },
46        "border": "none",
47        "borderBottom": "1px solid #e2e6e9",
48        "color": "#333",
49        "disabledColor": "#a9b3bc",
50        "extended": {
51            "minHeight": "48px",
52            "fontWeight": 600
53        },
54        "focusBorder": "1px dotted #16191d",
55        "focusPreselectBorder": "2px solid #00589f",
56        "focusPreselectOutline": "1px dotted #00589f",
57        "fontSize": "0.75rem",
58        "hover": {
59            "border": "2px solid #00589f",
60            "color": "#333"
61        },
62        "lineHeight": "1rem",
63        "minHeight": "24px",
64        "padding": "4px 8px",
65        "preselect": {
66            "background": "#00589f",
67            "color": "#fff"
68        },
69        "empty": {
70            "color": "#616f7c",
71            "fontStyle": "italic",
72            "hover": {
73                "color": "#616f7c"
74            }
75        }
76    },
77    "lightBG": "#fff",
78    "link": {
79        "item": {
80            "active": {
81                "border": "2px solid #00589f",
82                "backgroundImage": {
83                    "backgroundColor": "#00589f",
84                    "backgroundImage": "linear-gradient(#00589f, #00589f)"
85                },
86                "color": "#00589f",
87                "textDecoration": "none"
88            },
89            "border": "none",
90            "borderBottom": "1px solid #e2e6e9",
91            "color": "#333",
92            "focusBorder": "1px dotted #16191d",
93            "focusPreselectBorder": "2px solid #00589f",
94            "fontSize": "0.75rem",
95            "hover": {
96                "border": "2px solid #00589f",
97                "backgroundImage": {
98                    "backgroundColor": "#00589f",
99                    "backgroundImage": "linear-gradient(#00589f, #00589f)"
100                },
101                "color": "#00589f",
102                "textDecoration": "none"
103            },
104            "lineHeight": "1rem",
105            "minHeight": "24px",
106            "padding": "4px 8px",
107            "preselect": {
108                "background": "#00589f",
109                "backgroundImage": {
110                    "backgroundColor": "#fff",
111                    "backgroundImage": "linear-gradient(#fff, #fff)"
112                },
113                "color": "#fff"
114            },
115            "transitionTiming": "0.3s"
116        },
117        "wrapper": {
118            "borderBottom": "1px solid #e2e6e9",
119            "touchBorderBottom": "1px solid #a9b3bc"
120        }
121    },
122    "secondaryText": {
123        "color": "#333",
124        "disabledColor": "#a9b3bc",
125        "fontSize": "0.625rem",
126        "margin": "2px 0 0 0"
127    },
128    "section": {
129        "background": "#ebf1f7",
130        "color": "#333",
131        "fontSize": "0.75rem",
132        "fontWeight": 700
133    },
134    "touch": {
135        "itemPadding": "16px 8px",
136        "minHeight": "48px",
137        "secondaryTextMargin": "4px 0 0 0"
138    },
139    "footer": {
140        "horizontalAlignment": "center",
141        "background": "#f7fafc",
142        "minHeight": "32px",
143        "padding": "2px 8px"
144    }
145}
```

*content\_copy*
