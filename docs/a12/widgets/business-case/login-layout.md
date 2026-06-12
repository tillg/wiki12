---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/business-case/login-layout
widget: business-case/login-layout
scraped: 2026-06-12
---

# Widgets/Business case/Login layout

Login Layout

The **Login Layout** is a set of Widgets which provides a basic layout for login pages.

The main component **LoginLayout** equips some useful properties like `backgroundImage`, `fullscreen` or `mobile` to achieve the common use-cases.

In addition, under the same name namespace, we provide other convenient components, e.g. `Headline`, `Logo`, `Form`, `Footer`... Please see the below example how those components are organized to create a practical login form.

![The A12 application logo](images/a12p_bap_logo_mobile.svg)

Log in to A12

Username

Password

*Error*

Password is required

Language

English (USA)German (Germany)

Login

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

LoginContainerProps

Property

Type

Description

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

`secondary`

`boolean`

Specify whether the Container is secondary or not.

`style`

`CSSProperties`

Additional styles.

LoginFooterProps

Property

Type

Description

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

`style`

`CSSProperties`

Additional styles.

LoginFormItemProps

Property

Type

Description

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

`style`

`CSSProperties`

Additional styles.

LoginFormProps

Property

Type

Description

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

`style`

`CSSProperties`

Additional styles.

LoginHeadlineProps

Property

Type

Description

`ariaLevel`

`number`

Specify the headline aria-level.

**@default** 1

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

`style`

`CSSProperties`

Additional styles.

LoginLayoutProps

Property

Type

Description

`backgroundImage`

`string`

Url or base64 string for background image.

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`fullscreen`

`boolean`

Specify whether the login layout will display fullscreen or not.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`mobile`

`boolean`

Specify whether the login layout will display in mobile mode or not.

`noGutter`

`boolean`

Specify whether the login container has space around or not.

**@default** false

`style`

`CSSProperties`

Additional styles.

LoginLogoProps

Property

Type

Description

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

`style`

`CSSProperties`

Additional styles.

Theming configuration

The following theme variables can be used to customize the component:

```
1"loginLayout": {
2    "container": {
3        "background": "#fff",
4        "padding": "64px 64px 0 64px",
5        "secondaryBackground": "#f7fafc",
6        "spacingBottom": "64px",
7        "top": "20%",
8        "width": "378px"
9    },
10    "logo": {
11        "marginBottom": "40px",
12        "maxHeight": "56px",
13        "minHeight": "24px",
14        "width": "252px"
15    },
16    "headline": {
17        "color": "#333",
18        "fontFamily": "\"Open Sans\", sans-serif",
19        "fontSize": "1.25rem",
20        "fontWeight": 700,
21        "lineHeight": "normal",
22        "marginBottom": "32px"
23    },
24    "formItem": {
25        "marginBottom": "16px",
26        "labelColor": "#333"
27    },
28    "footer": {
29        "margin": "24px 0 0 0 ",
30        "itemMargin": "0 0 24px 0"
31    },
32    "background": {
33        "color": "#fff",
34        "position": "center",
35        "repeat": "no-repeat",
36        "size": "cover",
37        "padding": "0 24px"
38    },
39    "mobile": {
40        "margin": "0 auto",
41        "padding": "40px 40px 0 40px",
42        "spacingBottom": "40px"
43    },
44    "beforeAfterHeight": "24px"
45}
```

*content\_copy*
