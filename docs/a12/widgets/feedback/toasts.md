---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/feedback/toasts
widget: feedback/toasts
scraped: 2026-06-12
---

# Widgets/Feedback/Toasts/Toast

Toast

The **Toast** widget is used to give feedback to users after an action has taken place.

Basic

To display elements like **header, footer and message**, you can use the `header`, `footer` and`message` properties. In addition, there are four Toast variants: info (default), success, warning, and error. You can change it by setting the `variant` property.

Toast variant

Info

Success

Warning

Error

*info*

Error

*close*

Toast widget has the following variants: info (default), success, warning, and error.

Update laterUpdate now

*code**center\_focus\_weak**bug\_report*

Combination

You can customize the icon by adding the `icon` property.

You can add a collapse button by using the `collapse` property to handle the content being passed.

*public*

*Collapsible toast with html content*

*close*

This is a div tag

This is a p tag contains an [anchor tag](https://example.com)

**This is a strong tag**
Todo List:

* Task 1
* Task 2
* Task 3

[READ LESS](#)

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

Types

* `ToastType = "temporary" | "permanent"`

ToastProps

Property

Type

Description

`className`

`string`

Additional css class names.

`collapse`

`ReactNode`

Collapse button

`contentHeight`

`number`

Define a fixed height for Toast Content

`duration`

`number`

Duration until timeout

**@default** 3000

**Note:** Only works if the `type` is "temporary" and `ToastTemplateProps.onClose` callback is provided.

`focusOnMount`

`boolean`

Set focus on the Toast when it has finished rendering

**@default** true

`footer`

`ReactNode`

Footer to display.

`header`

`ReactNode`

Header to display.

`icon`

`ReactNode`

Customize the icon.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`message`

`ReactNode`

Message to display.

`style`

`CSSProperties`

Additional styles.

`type`

`ToastType`

Specifies if the toast is permanent or temporary

* "temporary": Automatically invokes the `ToastTemplateProps.onClose` callback after the specified `duration` .
* "permanent": Remains visible until explicitly closed by the user or programmatically.

**@default** "temporary"

`variant`

`Variant`

Specifies the toast's variant.

**@default** "info"

`wrapperRef`

`RefCallback<HTMLDivElement>`

The reference of the element wrapping the main content if one exists.

`onClose`

`void`

Invoked when the toast is closed.

**Note:** This handler is required when using a `temporary` toast with a `ToastProps.duration` .

Theming configuration

The following theme variables can be used to customize the component:

```
1"toast": {
2    "actions": {
3        "closeButton": {
4            "fontSize": "1.5rem"
5        },
6        "padding": "4px 8px",
7        "width": "48px"
8    },
9    "body": {
10        "background": "#fff",
11        "border": "1px solid transparent",
12        "boxShadow": "2px 2px 2px 0 rgba(22,25,29,0.4)",
13        "minWidth": "98px",
14        "maxWidth": "432px"
15    },
16    "collapse": {
17        "padding": "8px 0 0"
18    },
19    "color": {
20        "error": "#c62828",
21        "info": "#0277bd",
22        "success": "#2e7d32",
23        "warning": "#fcce34"
24    },
25    "content": {
26        "padding": "0 16px 16px"
27    },
28    "footer": {
29        "minHeight": "48px",
30        "padding": "0 16px 16px"
31    },
32    "graphic": {
33        "boxShadow": "2px 2px 2px 0 rgba(22,25,29,0.4)",
34        "minHeight": "48px",
35        "padding": "16px 0 0 0",
36        "width": "48px"
37    },
38    "message": {
39        "color": "#333",
40        "fontFamily": "\"Open Sans\", sans-serif",
41        "fontSize": "0.75rem",
42        "lineHeight": 1.45
43    },
44    "title": {
45        "color": "#333",
46        "fontFamily": "\"Open Sans\", sans-serif",
47        "fontSize": "0.75rem",
48        "fontWeight": 700,
49        "lineHeight": 1.45,
50        "padding": "16px 0 16px 16px"
51    },
52    "variantIcon": {
53        "color": {
54            "info": "#fff",
55            "error": "#fff",
56            "success": "#fff",
57            "warning": "#16191d"
58        },
59        "fontSize": "1.5rem"
60    }
61}
```

*content\_copy*
