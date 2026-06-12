---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-display/interactive-tile
widget: data-display/interactive-tile
scraped: 2026-06-12
---

# Widgets/Data display/Interactive tile

Interactive Tile

An **Interactive Tile** is a button-like component that allows user to freely define the content area. It is ideal for showcasing various types of content in a more visualized and scannable format.

This Widget offers two variants: `primary`, and `secondary`. Each variant will have three additional states:

* `active`: The activated tile will have a specific color.
* `disabled`: The disabled tile will have a specific color and will not be clickable.
* `selected`: The selected tile will display a checkmark icon in the top-right corner.

Basic

*accessibility\_new*

Interactive Tile

Primary

*accessibility\_new*

Interactive Tile

Primary Active

*check\_circle*

*accessibility\_new*

Interactive Tile

Primary Selected

*accessibility\_new*

Interactive Tile

Primary Disabled

*accessibility\_new*

Interactive Tile

Secondary

*accessibility\_new*

Interactive Tile

Secondary Active

*check\_circle*

*accessibility\_new*

Interactive Tile

Secondary Selected

*accessibility\_new*

Interactive Tile

Secondary Disabled

*code**center\_focus\_weak**bug\_report*

Accessibility

For better accessibility, it is necessary to provide alternative text for some interactive tiles including icons. The text can be set via the `aria-label` attribute within `htmlAttributes`.

If the widget is intended to be used as a **, you should add the `htmlAttributes` property with `role: "link"` to set the correct semantics for accessibility.

*check\_circle*

*accessibility\_new*

Interactive TilePrimary Selected

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

InteractiveTileProps

Property

Type

Description

`active`

`boolean`

Specifies whether the tile is activated. If it is true, the tile will have a specific color at:

* Background color on `primary` tile.
* Text color on `secondary` tile.

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`dataRole`

`string`

data-role attribute.

`disableAriaLabel`

`boolean`

Specifies whether to disable the aria-label attribute.
When set to `true` and interaction hint is enabled, a `HiddenText` for title will be displayed instead.

`disabled`

`boolean`

Specifies whether the tile is disabled.

`htmlAttributes`

`HTMLAttributes<HTMLElement>`

Additional HTML attributes that can be passed to the tile.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`primary`

`boolean`

Specifies whether the tile is a primary tile.

`secondary`

`boolean`

Specifies whether the tile is a secondary tile.

**Note:** If neither the `primary` nor `secondary` is specified, the tile is still styled as a secondary tile.

`selected`

`boolean`

Specifies whether the tile is selected.
If a tile is selected, a checkmark icon will appear in its top-right corner.

`style`

`CSSProperties`

Additional styles.

`tabIndex`

`number`

Specifies the tabIndex attribute for the tile.

`title`

`string`

Specifies the title attribute that will be shown when hovering the tile.

`onBlur`

`(event: FocusEvent<HTMLElement>) => void`

Blur handler for the tile.

**@param** event – HTML focus event.

`onClick`

`(event: MouseEvent<HTMLElement>) => void`

Click handler for the tile.

**@param** event – HTML mouse event.

`onFocus`

`(event: FocusEvent<HTMLElement>) => void`

Focus handler for the tile.

**@param** event – HTML focus event

`onKeyDown`

`(event: KeyboardEvent<HTMLElement>) => void`

Key down handler for the tile.

**@param** event – HTML key event.

`onKeyUp`

`(event: KeyboardEvent<HTMLElement>) => void`

Key up handler for the tile.

**@param** event – HTML key event.

`onMouseDown`

`(event: MouseEvent<HTMLElement>) => void`

Mouse down handler for the tile.

**@param** event – HTML mouse event.

`onMouseLeave`

`(event: MouseEvent<HTMLElement>) => void`

Mouse leave handler for the tile.

**@param** event – HTML mouse event.

`onMouseOver`

`(event: MouseEvent<HTMLElement>) => void`

Mouse over handler for the tile.

**@param** event – HTML mouse event.

Theming configuration

The following theme variables can be used to customize the component:

```
1"interactiveTile": {
2    "borderRadius": "4px",
3    "fontFamily": "\"Open Sans\", sans-serif",
4    "fontSize": "0.75rem",
5    "fontWeight": 400,
6    "minHeight": "32px",
7    "textTransform": "unset",
8    "primary": {
9        "background": "#00589f",
10        "border": "2px solid transparent",
11        "boxShadow": "none",
12        "color": "#fff",
13        "padding": "0 16px",
14        "icon": {
15            "color": "inherit"
16        },
17        "activated": {
18            "background": "#d50075",
19            "color": "#fff",
20            "padding": "0 16px",
21            "icon": {
22                "color": "inherit"
23            },
24            "interaction": {
25                "focus": {
26                    "background": "#fff",
27                    "border": "2px solid #d50075",
28                    "color": "#d50075",
29                    "outline": "1px dotted #00589f",
30                    "textDecoration": "none"
31                },
32                "hover": {
33                    "background": "#fff",
34                    "border": "2px solid #00589f",
35                    "color": "#00589f",
36                    "textDecoration": "none"
37                }
38            }
39        },
40        "selected": {
41            "background": "#00589f",
42            "color": "#fff",
43            "padding": "0 16px",
44            "icon": {
45                "color": "inherit",
46                "fontSize": "1rem",
47                "right": "8px",
48                "top": "8px"
49            },
50            "interaction": {
51                "focus": {
52                    "background": "#fff",
53                    "border": "2px solid #d50075",
54                    "color": "#d50075",
55                    "outline": "1px dotted #00589f",
56                    "textDecoration": "none"
57                },
58                "hover": {
59                    "background": "#fff",
60                    "border": "2px solid #00589f",
61                    "color": "#00589f",
62                    "textDecoration": "none"
63                }
64            }
65        },
66        "disabled": {
67            "boxShadow": "none",
68            "border": "2px solid #e2e6e9",
69            "background": "#e2e6e9",
70            "color": "#a9b3bc",
71            "padding": "0 16px",
72            "icon": {
73                "color": "inherit"
74            }
75        },
76        "interaction": {
77            "focus": {
78                "background": "#fff",
79                "border": "2px solid #d50075",
80                "color": "#d50075",
81                "outline": "1px dotted #00589f",
82                "textDecoration": "none"
83            },
84            "hover": {
85                "background": "#fff",
86                "border": "2px solid #00589f",
87                "color": "#00589f",
88                "textDecoration": "none"
89            }
90        }
91    },
92    "secondary": {
93        "background": "#ebf1f7",
94        "border": "2px solid transparent",
95        "borderRadius": "16px",
96        "color": "#00589f",
97        "padding": "0 16px",
98        "icon": {
99            "color": "inherit"
100        },
101        "activated": {
102            "background": "#ebf1f7",
103            "color": "#d50075",
104            "padding": "0 16px",
105            "icon": {
106                "color": "inherit"
107            },
108            "interaction": {
109                "focus": {
110                    "background": "#ebf1f7",
111                    "border": "2px solid #d50075",
112                    "color": "#d50075",
113                    "outline": "1px dotted #00589f",
114                    "textDecoration": "none"
115                },
116                "hover": {
117                    "background": "#ebf1f7",
118                    "border": "2px solid #00589f",
119                    "color": "#00589f",
120                    "textDecoration": "none"
121                }
122            }
123        },
124        "selected": {
125            "background": "#ebf1f7",
126            "color": "#00589f",
127            "padding": "0 16px",
128            "icon": {
129                "color": "inherit",
130                "fontSize": "1rem",
131                "right": "8px",
132                "top": "8px"
133            },
134            "interaction": {
135                "focus": {
136                    "background": "#ebf1f7",
137                    "border": "2px solid #d50075",
138                    "color": "#d50075",
139                    "outline": "1px dotted #00589f",
140                    "textDecoration": "none"
141                },
142                "hover": {
143                    "background": "#ebf1f7",
144                    "border": "2px solid #00589f",
145                    "color": "#00589f",
146                    "textDecoration": "none"
147                }
148            }
149        },
150        "disabled": {
151            "background": "transparent",
152            "border": "2px solid #a9b3bc",
153            "boxShadow": "none",
154            "color": "#a9b3bc",
155            "padding": "0 16px",
156            "icon": {
157                "color": "inherit"
158            }
159        },
160        "interaction": {
161            "focus": {
162                "background": "#ebf1f7",
163                "border": "2px solid #d50075",
164                "color": "#d50075",
165                "outline": "1px dotted #00589f",
166                "textDecoration": "none"
167            },
168            "hover": {
169                "background": "#ebf1f7",
170                "border": "2px solid #00589f",
171                "color": "#00589f",
172                "textDecoration": "none"
173            }
174        }
175    }
176}
```

*content\_copy*
