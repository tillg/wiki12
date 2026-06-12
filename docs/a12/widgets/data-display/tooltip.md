---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-display/tooltip
widget: data-display/tooltip
scraped: 2026-06-12
---

# Widgets/Data display/Tooltip

Tooltip

The **Tooltip** Widget is a component that will be displayed upon tapping and holding a screen element (on mobile) or hovering over it (desktop).

Basic Tooltip

A short text:*editTooltip*

A long text:*editTooltip*

Disabled:*editTooltip*

*code**center\_focus\_weak**bug\_report*

Desktop View on Mobile

By default, a mobile tooltip is displayed as a modal with an overlay. However, you can display it as a desktop-like tooltip by using the `useDesktopView` property. Check the example below on mobile view to see the difference.

Warning

*warning*

**NOTE**

Using this variant does not fully support **accessibility** on mobile devices.

*editTooltip*

*code**center\_focus\_weak**bug\_report*

Type

Besides the basic `Tooltip`, we also provide 4 different types: `HintTooltip`, `SuccessTooltip`, `WarningTooltip`, and `ErrorTooltip`.

Hint Tooltip:*infoHint: Tooltip*

Success Tooltip:*check\_circleSuccess: Tooltip*

Warning Tooltip:*warningWarning: Tooltip*

Error Tooltip:*Error: Tooltip*

*code**center\_focus\_weak**bug\_report*

Invert Tooltip

It is recommended to invert the trigger button on a dark background for better contrast.

With the basic `Tooltip`, you must provide an [Invert Icon Button](#/widgets/general/buttons/button#invert-icon-buttons). With variant tooltips (`HintTooltip`, `SuccessTooltip`, `WarningTooltip`, and `ErrorTooltip`), you can set the `invert` property to `true` to enable this feature.

*editInvert tooltip**infoHint: Tooltip**check\_circleSuccess: Tooltip**warningWarning: Tooltip**Error: Tooltip*

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

BaseTooltipProps

Property

Type

Description

`className`

`string`

Additional css class names.

`dataRole`

`string`

data-role attribute.

`disabled`

`boolean`

Disable the tooltip.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`invert`

`boolean`

Specifies whether the trigger button of Hint, Success, Warning or Error Tooltip has inverted style for better contrast on the dark background.

`style`

`CSSProperties`

Additional styles.

`text*`

`ReactNode`

The text to display when the mouse hovers over/clicks the element.

`useDesktopView`

`boolean`

Specifies whether to use the desktop view on mobile devices.

TooltipProps

Property

Type

Description

`children*`

`ReactElement`

Children element passed by users.

`className`

`string`

Additional css class names.

`dataRole`

`string`

data-role attribute.

`disabled`

`boolean`

Disable the tooltip.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`invert`

`boolean`

Specifies whether the trigger button of Hint, Success, Warning or Error Tooltip has inverted style for better contrast on the dark background.

`style`

`CSSProperties`

Additional styles.

`text`

`ReactNode`

The text to display when the mouse hovers over/clicks the element.

`useDesktopView`

`boolean`

Specifies whether to use the desktop view on mobile devices.

`variant`

`"error" | "warning" | "success" | "hint"`

Variant of tooltip.

**@default** undefined

Types

* `HintTooltipProps = BaseTooltipProps`

Types

* `SuccessTooltipProps = BaseTooltipProps`

Types

* `WarningTooltipProps = BaseTooltipProps`

Types

* `ErrorTooltipProps = BaseTooltipProps`

Theming configuration

The **Tooltip** inherits the style configuration of the [Modal Notification](#/widgets/feedback/modal-notification#modal-notification-theme-configuration) widget when displaying on touch devices (mobile, tablet).

Additionally, the component provides built-in theme variables that can be used to customize itself:

```
1"tooltip": {
2    "activeColor": "#00589f",
3    "arrow": {
4        "background": "#fff",
5        "border": "2px solid #d50075",
6        "boxShadow": "2px 2px 2px 0 rgba(22,25,29,0.4)"
7    },
8    "color": "#0277bd",
9    "containerMaxWidth": "500px",
10    "content": {
11        "background": "#fff",
12        "border": "2px solid #d50075",
13        "borderRadius": "2px",
14        "boxShadow": "1px 2px 2px 0 rgba(22,25,29,0.4)",
15        "fontFamily": "\"Open Sans\", sans-serif",
16        "fontSize": "0.75rem",
17        "padding": "16px 16px"
18    },
19    "darkColor": "#fff",
20    "error": {
21        "background": "#fbeaea",
22        "color": "#c62828"
23    },
24    "focusColor": "#d50075",
25    "hint": {
26        "background": "#fff",
27        "color": "#0277bd",
28        "contentColor": "#333"
29    },
30    "hoverColor": "#00589f",
31    "iconFontSize": "1.25rem",
32    "nextToLabelMargin": "0 0 4px 0",
33    "success": {
34        "background": "#fff",
35        "color": "#2e7d32",
36        "contentColor": "#333"
37    },
38    "typesQuantity": 4,
39    "warning": {
40        "background": "#fef6db",
41        "color": "#fcce34",
42        "contentColor": "#16191d"
43    }
44}
```

*content\_copy*
