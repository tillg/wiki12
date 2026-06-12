---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/navigation/menu
widget: navigation/menu
scraped: 2026-06-12
---

# Widgets/Navigation/Menu/Flyout menu

Flyout Menu

The **Flyout Menu** Widget comes with `horizontal` and `vertical` variants for you to fit your menus and menu items with different use cases.

Horizontal Menu

In horizontal mode, the items will be shown from left to right and will be condensed when there is no more space. Set the `type` property to `horizontal` to enable this feature.

* *dvr*

  1

  *expand\_more Open submenu*
* 2
* *more\_horiz*

*code**center\_focus\_weak**bug\_report*

Horizontal Menu With Group

Lists of menu items can now have both regular items and groups of items with the newly defined type `MenuItemType[]`. It is a union type created by combining `MenuItem` and `MenuGroup`.

You must ensure that you use the properties below correctly so that the menu groups can work as expected.

* `type` **(required)**: This property only has one value `group`, and it is handy for distinguishing a group from a regular item.
* `items` **(required)**: This property define a list of menu items within a group, it must be used wherever **type** is specified.
* `label`: This property defines the group label. When specified, it serves as a tooltip when hovering over the group divider in the non-condensed view and as a sub-header in the condensed view.

**Note:** If you want to hide the group title in the horizontal flyout menu, do not provide a label for the group.

* *dvr*

  1

  *expand\_more Open submenu*
* *more\_horiz*

*code**center\_focus\_weak**bug\_report*

Vertical Menu

In vertical mode, the items will be shown from top to bottom, and both the text and icons of the menu items will be shown. Set the `type` property to `vertical` to enable this feature.

In addition, the menu can be collapsed to save space by setting the `collapsed` property to `true`. If this setting is applied, the text of the menu items will be hidden, and only their placeholders will be shown. The placeholder here is the provided icon or the first letter of the label. **Be aware that**, if the label of multiple items start with the same character, their placeholders will be the same and difficult to distinguish.

On mobile, please use the [Sliding Menu](#/widgets/navigation/menu/sliding-menu) instead.

Collapsed

* *dvr*

  1

  *chevron\_right Open submenu*
* 2

  2
* 3

  3
* 4

  4 with very long label that will not fit in there

  *chevron\_right Open submenu*
* *settings*
* X

  X Menu
* Y

  Y Menu
* *screen\_lock\_portrait*

  Z Menu

  *chevron\_right Open submenu*

*code**center\_focus\_weak**bug\_report*

Scroll to Selected Item

For Vertical Menu, set the `scrollToSelectedItem` property to `true` to make the menu scroll to the selected item's position on page load.

* *dvr*

  1

  *chevron\_right Open submenu*
* 2

  2
* 3

  3
* 4

  4 with very long label that will not fit in there

  *chevron\_right Open submenu*
* A

  A Menu
* B

  B Menu
* C

  C Menu
* D

  D Menu
* 5

  5 Menu
* 6

  6 Menu
* 7

  7 Menu
* E

  E Menu
* F

  F Menu
* X

  X Menu
* T

  T Menu
* U

  U Menu
* V

  V Menu
* S

  S Menu
* Y

  Y Menu
* *screen\_lock\_portrait*

  Z Menu

*code**center\_focus\_weak**bug\_report*

Menu With Variants

The **Flyout Menu** also provides a set of variants to indicate the status of a menu item. You can use the `variant` property to select your desired status: `open`, `info`, `error`, `warning`, `inProgress`, or `done`. Once it is defined, a specific icon corresponding to that variant will be shown.

Vertical Menu

* *radio\_button\_unchecked*

  Open File - Open
* *more\_horiz*

*code**center\_focus\_weak**bug\_report*

Accessibility

Both the horizontal and vertical menus have a number of features to support accessibility.

By default, these hidden texts below will be read by screen readers:

* The condensed item has the text **" Further menuitems"**.
* The menu item which **has children** has the text **" Open submenu "**.
* On **mobile**:
  + The **selected** menu item which **has children** has the text **"Chosen level: "**.
  + The **selected** menu item has the text **"Current page: "**.
  + The **disabled** menu item has the text **"Inactive: "**.
* On **desktop**, screen reader will read based on `aria-current` attribute.

If the menu is used as a main menu of the page, set the `useAs` property to **main**, it will have an `aria-label` attribute with localized text. In this example, the localized text is:

* English: "Main navigation"
* German: "Hauptnavigation"

To customize the text, use [A11YLanguageContext](#/basics/accessibility).

In addition, you can use the `mainContainerLabel` property to customize the `aria-label` attribute without depending on `useAs="main"`.

If you pass a `title` to a **MenuItem**, that menu item will have a `title` and an `aria-label` attribute.

Disabled:

* **1** -> **1.3**
* **3**
* **4** -> **4.2**

A11y title in **1.3**, **3** and **4.2**


Selected: **4** -> **4.1** -> **4.1.2**

* A11y title in selected parents: **Chosen level: 4** and **Chosen level: 4.1**
* A11y title in selected child: **Current page: 4.1.2**

* *dvr*

  1

  *chevron\_right Open submenu*
* 2

  2
* 3

  3
* 4

  4 with very long label that will not fit in there

  *chevron\_right Open submenu*
* *settings*
* A

  A Menu
* B

  B Menu
* C

  C Menu
* D

  D Menu
* 5

  5 Menu
* 6

  6 Menu
* 7

  7 Menu
* E

  E Menu
* F

  F Menu
* X

  X Menu
* T

  T Menu
* U

  U Menu
* V

  V Menu
* S

  S Menu
* Y

  Y Menu
* *screen\_lock\_portrait*

  Z Menu

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* This API section only displays some of the most remarkable properties of the **Flyout Menu** widget. To find a full set of properties, please make use of an IDE to explore the Widget's source code.
* `prop*` is required.
* `prop` is deprecated.

FlyoutMenuProps

Property

Type

Description

`className`

`string`

Additional css class names.

`collapsed`

`boolean`

Will compact the view if true.

**Note:** Only works with the SlidingMenu or "vertical" FlyoutMenu.

`condensedBadge`

`ReactNode`

A badge to be displayed at the top-right of the 3-dot menu item in a responsive menu.

`disableCondensing`

`boolean`

If true, all items will expand to their inherent width.

**Note:** Only works with "horizontal" Flyout Menu.

**@deprecated** from 36.0.0. This property could cause unexpected bugs for layout if used.

`hoverDelay`

`number`

Specify the delay time when the submenu is shown by hovering on parent.

**Note:** Only works on non-touchable devices.

**@default** 100

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`items`

`MenuItemType[]`

List of menu items.

**Note:**

* `MenuItemType` is a union type created by combining `MenuItem` and `MenuGroup` , where MenuGroup can help group items together.
* `MenuGroup` is only used for Horizontal Flyout Menu.

`mainContainerLabel`

`string`

Specify aria-label attribute of the main container.

`scrollToSelectedItem`

`boolean`

Scrolls to selected item on loaded.

`style`

`CSSProperties`

Additional styles.

`subMenuAttributes`

`HTMLAttributes<HTMLUListElement>`

Specify HTML attributes for the sub-menu.

`type*`

`"horizontal" | "vertical"`

Whether the menu will be displayed horizontally or vertically.

`useAs`

`UseAs`

Whether the menu will be used as the main menu of the page or tab navigation.

If set to "main", the menu will be mentioned as a main menu and have an aria-label attribute which is defined locally.

* English: "Main navigation"
* German: "Hauptnavigation"

To customize the text, use A11YLanguageContext (see Accessibility in Widgets Showcase).

**NOTE:** If `mainContainerLabel` is defined then it will be used.

`wrapperRef`

`RefCallback<HTMLElement>`

The reference of the element wrapping the main content if one exists.

`onCondensed`

`(condensedItems: MenuItem[]) => void`

A callback will be returned with an array of condensed items.

MenuGroup

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

`items*`

`MenuItem[]`

List of items in a group.

**Note:** This prop must be specified along with `type` to define it as a group. `MenuItem.children` is not valid for a group.

`label`

`ReactNode`

Menu group's label.

`style`

`CSSProperties`

Additional styles.

`type*`

`group`

To distinguish it from the ordinary item.

MenuItem

Property

Type

Description

`additionalInfoIcon`

`ReactElement<IconProps, string | JSXElementConstructor<any>>`

An additional icon will display when SlidingMenu is expanded to replace `icon` .

**Note:** Only work with SlidingMenu or "vertical" FlyoutMenu.

`ariaLabel`

`string`

aria-label attribute of the menu item.
If this property is not defined, the `title` property will be used as the Item's aria-label.

`backwardItemProps`

`Omit<MenuItem, "children" | "items">`

Customize the properties of the backward navigation item displayed in the Sliding Menu.

**Note:**

* The backward item appears at the top of a sub-menu and allows users to navigate back to the parent menu.
* By default, the backward item inherits all properties from its parent item.
* Use this property to override specific properties (e.g., label, icon, onClick handler) for the backward item.
* The `children` and `items` properties cannot be customized as they are not applicable to backward navigation items.

`badge`

`ReactNode`

A badge to display at the top-right of item's label as the additional information or notification.

`children`

`MenuItem[]`

List of submenu.

**@deprecated** since 36.3.0. Use `items` instead

`className`

`string`

Additional css class names.

`counter`

`ReactElement<CounterProps, string | JSXElementConstructor<any>>`

A Counter to display at the end of item's label as the additional information.

`disabled`

`boolean`

If true, the item is disabled.

`icon`

`ReactNode`

An icon which is displayed as the placeholder of the item.
If not set, the first letter of `label` will display instead.

**Note:** If the `variant` is set, the icon from that property will take priority.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`items`

`MenuItemType[]`

List of items in sub-menu. It can contain both ordinary items and groups of items.

`label*`

`ReactNode`

Label of the menu item.

`labelHidden`

`boolean`

If true, the label will be hidden but still be used as the item text in condensed items.

**Note:** Only work with FlyoutMenu.

`selected`

`boolean`

Whether this element is selected.

`style`

`CSSProperties`

Additional styles.

`title`

`string`

Title of menu item.
To fully support accessibility with screen reader, a menu item should have a title if it has no `label` .

`variant`

`MenuItemVariant`

Variant of a menu item. There are 6 values: `open` , `info` , `error` , `warning` , `done` , and `inProgress` .
If it is defined, a specific icon corresponding to that variant will be displayed.

`onClick`

`(event: SyntheticEvent<HTMLElement>) => void`

Handle event when an item is selected by mouse.

**Note:**

* If the item has a sub-menu, this event will be triggered when clicking on the parent item to expand the sub-menu.
* To handle the click event on the backward item (when navigating back to the parent menu), use `backwardItemProps.onClick` instead.

Theming configuration

The following theme variables can be used to customize the component:

```
1"menu": {
2    "header": {
3        "item": {
4            "focus": {
5                "borderBottom": "2px solid #00589f"
6            }
7        }
8    },
9    "icon": {
10        "additional": {
11            "color": "#fff",
12            "fontSize": "1.25rem",
13            "height": "4px",
14            "padding": "4px 4px",
15            "variant": {
16                "error": "#c62828",
17                "info": "#0277bd",
18                "warning": "#fcce34",
19                "text": {
20                    "error": "#fff",
21                    "info": "#fff",
22                    "warning": "#16191d"
23                }
24            }
25        },
26        "status": {
27            "variant": {
28                "open": "#333",
29                "info": "#0277bd",
30                "error": "#c62828",
31                "warning": "#ad7d04",
32                "inProgress": "#0277bd",
33                "done": "#2e7d32"
34            }
35        },
36        "color": "#00589f",
37        "fontSize": "1.5rem",
38        "horizontalHeight": "20px",
39        "minWidth": "1.5rem",
40        "verticalColor": "#7F8C9B",
41        "verticalHeight": "20px"
42    },
43    "item": {
44        "disabledColor": "#a9b3bc",
45        "horizontal": {
46            "badge": {
47                "backgroundColor": {
48                    "warning": "#ad7d04"
49                }
50            },
51            "active": {
52                "borderBottom": "2px solid #00589f"
53            },
54            "hover": {
55                "borderBottom": "2px solid #00589f"
56            },
57            "focus": {
58                "border": "1px dotted #00589f",
59                "borderBottom": "2px solid #d50075"
60            },
61            "margin": "0 16px",
62            "selected": {
63                "active": {
64                    "background": "transparent",
65                    "border": "none",
66                    "borderBottom": "4px solid #fff",
67                    "borderRadius": "0",
68                    "color": "#fff"
69                },
70                "background": "transparent",
71                "border": "none",
72                "borderBottom": "2px solid #00589f",
73                "borderRadius": "0",
74                "color": "#00589f",
75                "disabledColor": "#a9b3bc",
76                "focus": {
77                    "background": "transparent",
78                    "border": "1px dotted #00589f",
79                    "borderBottom": "2px solid #d50075",
80                    "borderRadius": "0",
81                    "color": "#fff"
82                },
83                "hover": {
84                    "background": "transparent",
85                    "border": "none",
86                    "borderBottom": "2px solid #00589f",
87                    "borderRadius": "0",
88                    "color": "#00589f",
89                    "cursor": "pointer"
90                }
91            }
92        },
93        "placeholderDisabled": {
94            "background": "transparent",
95            "color": "#a9b3bc"
96        },
97        "subHorizontal": {
98            "active": {
99                "background": "#fff",
100                "border": "2px solid #00589f"
101            },
102            "focus": {
103                "background": "#fff",
104                "border": "2px solid #d50075",
105                "outline": "1px dotted #00589f"
106            },
107            "hover": {
108                "background": "#fff",
109                "border": "2px solid #00589f"
110            },
111            "selected": {
112                "activeBorderLeft": "4px solid #00589f",
113                "background": "#fff",
114                "borderLeft": "4px solid #00589f",
115                "textColor": "#00589f",
116                "focusBorderLeft": "4px solid #d50075",
117                "hoverBorderLeft": "4px solid #00589f",
118                "hover": {
119                    "borderBottom": "2px solid #00589f",
120                    "color": "#00589f",
121                    "cursor": "pointer"
122                }
123            }
124        },
125        "vertical": {
126            "active": {
127                "background": "#fff",
128                "border": "2px solid #00589f"
129            },
130            "borderBottom": "1px solid #e2e6e9",
131            "focus": {
132                "background": "#fff",
133                "border": "2px solid #d50075",
134                "outline": "1px dotted #00589f"
135            },
136            "hover": {
137                "background": "#fff",
138                "border": "2px solid #00589f"
139            },
140            "selected": {
141                "activeBorderLeft": "4px solid #00589f",
142                "background": "#fff",
143                "borderLeft": "4px solid #00589f",
144                "focusBorderLeft": "4px solid #d50075",
145                "hoverBorderLeft": "4px solid #00589f",
146                "hover": {
147                    "borderBottom": "4px solid #fff",
148                    "color": "#fff",
149                    "cursor": "pointer"
150                }
151            },
152            "icon": {
153                "status": {
154                    "variant": {
155                        "open": "#333",
156                        "info": "#0277bd",
157                        "error": "#c62828",
158                        "warning": "#ad7d04",
159                        "done": "#2e7d32"
160                    }
161                }
162            }
163        }
164    },
165    "link": {
166        "horizontalChildrenSpacing": "4px",
167        "minHeight": "48px",
168        "padding": "8px 16px",
169        "subHorizontalPadding": "8px 16px",
170        "vertical": {
171            "childrenSpacing": "16px",
172            "padding": "8px 16px"
173        },
174        "badgeRightPos": "-16px"
175    },
176    "label": {
177        "color": "#00589f",
178        "childrenSpacing": "0 4px 0 0",
179        "fontSize": "0.75rem",
180        "fontFamily": "\"Open Sans\", sans-serif",
181        "fontWeight": 600,
182        "textTransform": "uppercase",
183        "verticalColor": "#333"
184    },
185    "mainLayer": {
186        "horizontalBG": "#ebf1f7",
187        "horizontalPadding": "0 24px",
188        "verticalBG": "#f6fafe"
189    },
190    "mainMenu": {
191        "before": {
192            "background": "#cddeed"
193        },
194        "borderBottom": "none",
195        "borderTop": "none",
196        "mainLayer": {
197            "background": "#f6fafe"
198        },
199        "subLayer": {
200            "background": "#f6fafe"
201        },
202        "item": {
203            "color": "#00589f",
204            "fontSize": "0.875rem",
205            "textTransform": "none",
206            "active": {
207                "background": "transparent",
208                "border": "none",
209                "borderBottom": "2px solid #00589f",
210                "borderRadius": "0",
211                "color": "#00589f"
212            },
213            "background": "transparent",
214            "border": "none",
215            "borderBottom": "none",
216            "borderRadius": "0",
217            "disabledColor": "#a9b3bc",
218            "hover": {
219                "background": "transparent",
220                "border": "none",
221                "borderBottom": "2px solid #00589f",
222                "borderRadius": "0",
223                "color": "#00589f",
224                "cursor": "pointer"
225            },
226            "focus": {
227                "background": "transparent",
228                "border": "1px dotted #00589f",
229                "borderBottom": "2px solid #d50075",
230                "borderRadius": "0",
231                "color": "#00589f"
232            },
233            "selected": {
234                "active": {
235                    "background": "transparent",
236                    "border": "none",
237                    "borderBottom": "4px solid #fff",
238                    "borderRadius": "0",
239                    "color": "#fff"
240                },
241                "background": "transparent",
242                "border": "none",
243                "borderBottom": "2px solid #00589f",
244                "borderRadius": "0",
245                "color": "#333",
246                "disabledColor": "#a9b3bc",
247                "focus": {
248                    "background": "transparent",
249                    "border": "1px dotted #00589f",
250                    "borderBottom": "2px solid #00589f",
251                    "borderRadius": "0",
252                    "color": "#00589f"
253                },
254                "hover": {
255                    "background": "transparent",
256                    "border": "none",
257                    "borderBottom": "2px solid #00589f",
258                    "borderRadius": "0",
259                    "color": "#333",
260                    "cursor": "pointer"
261                }
262            }
263        }
264    },
265    "placeholder": {
266        "background": "transparent",
267        "color": "#00589f",
268        "fontSize": "1rem",
269        "fontStyle": "normal",
270        "fontWeight": 600,
271        "height": "calc(1.25rem + 8px)",
272        "width": "calc(1.25rem + 8px)"
273    },
274    "slidingMenu": {
275        "background": "#f6fafe",
276        "height": "calc(100% - 48px)"
277    },
278    "subLayer": {
279        "background": "#f6fafe",
280        "boxShadow": "0 1px 4px 0 rgba(22,25,29,0.4)",
281        "minWidth": "210px",
282        "verticalBG": "#f6fafe"
283    },
284    "tabNavigation": {
285        "borderBottom": "none",
286        "borderTop": "none",
287        "mainLayer": {
288            "background": "#fff"
289        },
290        "subLayer": {
291            "background": "#fff"
292        },
293        "item": {
294            "color": "#00589f",
295            "fontSize": "0.875rem",
296            "textTransform": "none",
297            "active": {
298                "background": "transparent",
299                "border": "none",
300                "borderBottom": "2px solid #00589f",
301                "borderRadius": "0",
302                "color": "#00589f"
303            },
304            "background": "transparent",
305            "border": "none",
306            "borderBottom": "none",
307            "borderRadius": "0",
308            "disabledColor": "#a9b3bc",
309            "hover": {
310                "background": "transparent",
311                "border": "none",
312                "borderBottom": "2px solid #00589f",
313                "borderRadius": "0",
314                "color": "#00589f",
315                "cursor": "pointer"
316            },
317            "focus": {
318                "background": "transparent",
319                "border": "1px dotted #00589f",
320                "borderBottom": "2px solid #d50075",
321                "borderRadius": "0",
322                "color": "#00589f"
323            },
324            "selected": {
325                "active": {
326                    "background": "transparent",
327                    "border": "none",
328                    "borderBottom": "4px solid #fff",
329                    "borderRadius": "0",
330                    "color": "#fff"
331                },
332                "background": "transparent",
333                "border": "none",
334                "borderBottom": "2px solid #00589f",
335                "borderRadius": "0",
336                "color": "#333",
337                "disabledColor": "#a9b3bc",
338                "focus": {
339                    "background": "transparent",
340                    "border": "1px dotted #00589f",
341                    "borderBottom": "2px solid #00589f",
342                    "borderRadius": "0",
343                    "color": "#00589f"
344                },
345                "hover": {
346                    "background": "transparent",
347                    "border": "none",
348                    "borderBottom": "2px solid #00589f",
349                    "borderRadius": "0",
350                    "color": "#333",
351                    "cursor": "pointer"
352                }
353            }
354        }
355    },
356    "triggerButton": {
357        "iconColor": "#00589f",
358        "iconFontSize": "1.5rem",
359        "badgeRightPos": "-8px",
360        "badgeTopPos": "-8px"
361    },
362    "group": {
363        "divider": {
364            "background": "#e2e6e9",
365            "padding": "0 2px",
366            "width": "1px"
367        },
368        "hover": {
369            "cursor": "pointer"
370        },
371        "background": "#f7fafc",
372        "fontSize": "0.75rem",
373        "fontWeight": "400",
374        "padding": "4px 16px"
375    }
376}
```

*content\_copy*
