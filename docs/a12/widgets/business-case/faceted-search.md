---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/business-case/faceted-search
widget: business-case/faceted-search
scraped: 2026-06-12
---

# Widgets/Business case/Faceted search/Filter bar

Filter Bar

The **Filter Bar** Widget is designed to group the **Filter** elements that represents the faceted search settings.
In cases where the width of the parent element is defined, the **Filter Bar** will truncate its **Filter** elements into new rows to fit the parent's width. When the total height of those rows exceeds the pre-defined height of the **Filter Bar**, it will display a toggle button at the bottom-right for you to expand/collapse the **Filter** elements.

You can specify whether the **Filter Bar** is collapsed initially by using the `initiallyCollapsed` property. By default, this property is set to **false**.

The **Filter** widget requires the `name` property to display the name of the filter. Potential filtering options can be shown by passing them to the `options` property. By default, options will be separated by the "," mark. You can customize this separator by using the `separator` property.

This example shows the **Filter Bar** widget wrapping most of the variants and customizations of the **Filter** widget.

Warning

*warning*

**NOTE**

To fully support accessibility, each **Filter** should have its own `id`. It will be used to generate IDs for inner elements; such as the name, action button, etc. These IDs will be linked to the **aria-labelledby** attribute, allowing screen readers to provide complete information to users.
For example: Indicate which **Filter** the action button belongs to when it receives focus.

Filter name Default FilterSelected option Inactive

*close*Delete filter:

Filter name Active FilterSelected option Option A, Option B

*close*Delete filter:

Filter name Disabled FilterSelected option Option A, Option B

*close*Delete filter:

Filter name Non-removable FilterSelected option Inactive

Filter name Active non-removable FilterSelected option Option A, Option B

Filter name Disabled non-removable FilterSelected option Option A, Option B

Filter name Filter with custom separatorSelected option Option A + Option B

*close*Delete filter:

*keyboard\_arrow\_up*

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

FilterBarMobileProps

Property

Type

Description

`actions`

`ReactNode`

Actions will be placed at the end of the bar.

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`disabled`

`boolean`

Specifies whether the Filter Bar is disabled.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`initialCollapsed`

`boolean`

Specifies whether the Filter Bar is collapsed initially.

**@default** false

`style`

`CSSProperties`

Additional styles.

FilterBarProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`disabled`

`boolean`

Specifies whether the Filter Bar is disabled.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`initialCollapsed`

`boolean`

Specifies whether the Filter Bar is collapsed initially.

**@default** false

`style`

`CSSProperties`

Additional styles.

FilterProps

Property

Type

Description

`active`

`boolean`

Specifies whether the filter is activated.
If true, the filter will have a border-left style.

`ariaExpanded`

`boolean`

Specifies whether the Filter should have the aria-expanded attribute.

`className`

`string`

Additional css class names.

`customAction`

`ReactNode`

The element that overrides the default action element.

`disabled`

`boolean`

Specifies whether the Filter is disabled.

`filterRef`

`RefCallback<HTMLDivElement>`

The reference of the Filter's wrapper.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`name*`

`ReactNode`

The name of the filter.

`nonRemovable`

`boolean`

If this property is set to true, the Filter will not have the close button.

`options`

`ReactNode`

The options of the filter.

`separator`

`ReactNode`

The separator between each `options` .

`style`

`CSSProperties`

Additional styles.

`onClick`

`(event: MouseEvent<HTMLElement>) => void`

The function that will be fired when clicking the Filter.

`onClose`

`void`

The function that will be fired when closing the Filter.

Theming configuration

The following theme variables can be used to customize the component:

```
1"filterBar": {
2    "background": "#f7fafc",
3    "padding": "0 24px",
4    "content": {
5        "maxHeight": "144px",
6        "padding": "0 1px 6px 1px",
7        "spacingBottom": "6px"
8    },
9    "action": {
10        "minHeight": "auto",
11        "padding": "6px calc(6px / 2)",
12        "width": "auto"
13    },
14    "mobile": {
15        "counter": {
16            "margin": "6px 8px 0 0",
17            "disabled": {
18                "background": "#a9b3bc",
19                "color": "#e2e6e9"
20            }
21        }
22    }
23},
24"filter": {
25    "background": "#fff",
26    "borderRadius": "4px",
27    "height": "40px",
28    "margin": "6px 8px 0 0",
29    "marginRight": "8px",
30    "maxWidth": "calc(100% - 8px)",
31    "options": {
32        "color": "#333",
33        "fontFamily": "\"Open Sans\", sans-serif",
34        "fontSize": "0.75rem",
35        "fontStyle": "italic",
36        "lineHeight": "16px",
37        "padding": "0 2px 0 0",
38        "disabledColor": "#a9b3bc"
39    },
40    "content": {
41        "padding": "0 8px 0 8px",
42        "maxWidth": "281px",
43        "minWidth": "56px",
44        "active": {
45            "color": "#00589f",
46            "border": "2px solid #00589f"
47        },
48        "hover": {
49            "color": "#00589f",
50            "border": "2px solid #00589f"
51        },
52        "focus": {
53            "color": "#d50075",
54            "border": "2px solid #d50075"
55        }
56    },
57    "indicator": {
58        "active": {
59            "width": "4px",
60            "background": "#0277bd",
61            "disabledBackground": "#a9b3bc",
62            "activeBackground": "#00589f",
63            "hoverBackground": "#00589f",
64            "focusBackground": "#d50075"
65        }
66    },
67    "name": {
68        "color": "#616f7c",
69        "fontFamily": "\"Open Sans\", sans-serif",
70        "fontSize": "0.625rem",
71        "lineHeight": "14px",
72        "text": {
73            "margin": "0 4px 0 0"
74        },
75        "arrow": {
76            "size": "3px",
77            "borderBottomColor": {
78                "default": "#7F8C9B",
79                "active": "#00589f",
80                "hover": "#00589f",
81                "focus": "#d50075"
82            }
83        }
84    },
85    "actionButton": {
86        "borderLeft": "none",
87        "icon": {
88            "fontSize": "1rem"
89        }
90    }
91},
92
```

*content\_copy*
