---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-display/counter
widget: data-display/counter
scraped: 2026-06-12
---

# Widgets/Data display/Counter

Counter

The **Counter** Widget is a label widget designed in a compact format to display a numerical amount of its connected element.

Basic

The Counter provides the `value` property that receives a number or a string and can display a decimal number string correctly. If the `value` is `undefined`, it will display the `placeholder` property instead.

It also provides the `overflowCount` property to display the overflow value along with an additional "**+**" mark when the `value` property gets over the limit of the declared `overflowCount`.

For better **Accessibility**, you can use the `hiddenDescription` property to describe the Counter. It will be read by screen readers before reading the counter's value.

This example shows how the Counter works when the `value` property is: `undefined`, a `number`, a `string`, and more than the `overflowCount` value.

Counter with an undefined value --- Entries--- Counter with a number value 12 Entries12 Counter with a decimal number value 0.12 Entries0.12 Counter with an overflow value 99+ Entries99+

*code**center\_focus\_weak**bug\_report*

Variants

This example shows all variants of the Counter, including the `default`, `secondary`, `constructive`, and `destructive` types.

12 Entries1212 Entries1212 Entries1212 Entries12

*code**center\_focus\_weak**bug\_report*

Addons & Animations

To customize the Counter with additional elements along with the `value`, you can make use of the `addonBefore` and `addonAfter` properties. We've also added increment and decrement buttons so that you can see what the different counter animations look like.

minusplus

*check*12 Entries12

*code**center\_focus\_weak**bug\_report*

Interactive

To make the Counter become an interactive element, please set the `interactive` property to `true`. It's recommended to set the `title` property if the Counter is `interactive`.

If the widget is intended to change the role, you can add the `htmlAttributes` property with an appropriate role.

Warning

*warning*

**NOTE**

Interactive Counter should not be used inside an interactive element since it causes accessibility issues, confuses user behavior, and leads to issue with HTML syntax.

*check*12 Entries1212 Entries12*close*

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

CounterProps

Property

Type

Description

`addonAfter`

`ReactNode`

Specifies an addon element that will be placed after the `value` .
For example: Icon widget

`addonBefore`

`ReactNode`

Specifies an addon element that will be placed before the `value` .
For example: Icon widget

`className`

`string`

Additional css class names.

`dataRole`

`string`

data-role attribute.

`hiddenDescription`

`string`

Specifies the hidden information to describe the counter. It will be read by screen readers before reading counter value.

`htmlAttributes`

`HTMLAttributes<HTMLElement>`

Additional props that will be placed at the DOM element.
It should be used in case a user wants to access to native DOM properties but there's no property allows to do that.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`interactive`

`boolean`

Specifies whether the Counter is interactive or not.

**@default** false

`overflowCount`

`number`

Specifies the max value that should be shown.

`placeholder`

`string`

Specifies the placeholder text that will be shown when the `value` is undefined.

`secondary`

`boolean`

Specifies whether the Counter is secondary or not.

**@default** false

`style`

`CSSProperties`

Additional styles.

`title`

`string`

Specifies the hint text that will be shown on mouse over event.

`type`

`"default" | "constructive" | "destructive"`

Specifies the variant of the Counter.

**@default** default

`value`

`string | number`

Specifies the value to show in the counter.

`onMouseLeave`

`(event: MouseEvent<HTMLElement>) => void`

Mouse leave handler for counter.

**@param** event – HTML mouse event.

`onMouseOver`

`(event: MouseEvent<HTMLElement>) => void`

Mouse over handler for counter.

**@param** event – HTML mouse event.

Theming configuration

The following theme variables can be used to customize the component:

```
1"counter": {
2    "borderRadius": "8px",
3    "color": "#333",
4    "fontFamily": "\"Open Sans\", sans-serif",
5    "fontSize": "0.75rem",
6    "fontWeight": 600,
7    "padding": "0 5px",
8    "iconMargin": "2px",
9    "background": {
10        "default": "#b7c0c7",
11        "constructive": "#297a24",
12        "destructive": "#c62828"
13    },
14    "variantColor": "#fff",
15    "timing": ".5s",
16    "secondary": {
17        "focusColor": "#d50075",
18        "hoverColor": "#00589f",
19        "activeColor": "#d50075"
20    },
21    "focus": {
22        "backgroundColor": "#d50075",
23        "color": "#fff"
24    },
25    "hover": {
26        "backgroundColor": "#00589f",
27        "color": "#fff"
28    },
29    "active": {
30        "backgroundColor": "#00589f",
31        "color": "#fff"
32    }
33}
```

*content\_copy*
