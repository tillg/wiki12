---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/experimental/slider
widget: experimental/slider
scraped: 2026-06-12
---

# Experimental/Slider

Slider

The **Slider** Widget is an input component that can be used to provide a range of values along a bar.

Basic

You can use the `marks` property to specify the value marks.

Use the `onChange` property to handle selected value and set it to the `value` property.

Use `leftLabel` and `rightLabel` properties to set additional labels for the **Slider**.

To customize each **mark**:

* Use the `label` property to change the mark's label.
* Use the `disabled` property to disable the mark.

Simple Slider

Start

0°C

20°C

40°C

60°C

80°C

100°C

End

*code**center\_focus\_weak**bug\_report*

Graphic Label

To add a graphic before the label, you can pass it to the `labelGraphic` property.

*info*

Graphic Label

Start

0°C

20°C

40°C

60°C

80°C

100°C

End

*code**center\_focus\_weak**bug\_report*

Readonly and Disabled

By providing the `readonly` property or the `disabled` property, you can make the**Slider** readonly or disabled.

Readonly

0°C

20°C

40°C

60°C

80°C

100°C

Readonly with value

0°C

20°C

40°C

60°C

80°C

100°C

Disabled

0°C

20°C

40°C

60°C

80°C

100°C

*code**center\_focus\_weak**bug\_report*

Error Message

You can add an error message to the **Slider** by using the `errorMessage` property.

Error message

*Error*

This is an error message

0°C

20°C

40°C

60°C

80°C

100°C

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

SliderMark

Property

Type

Description

`disabled`

`boolean`

Specifies if the mark is disabled.

`label`

`string`

The label of the slider mark.

`value*`

`string`

Corresponding value of the mark that will be returned when onChange is fired.

SliderProps

Property

Type

Description

`className`

`string`

Additional css class names.

`disabled`

`boolean`

Specifies whether the input is disabled.

`error`

`boolean`

Error state for the input widget.

`errorMessage`

`ReactNode`

Additional element that will be shown as the Error message for the input.

`fitToParent`

`boolean`

Make input's width fits to parent's width.

**@default** true

`hideLabel`

`boolean`

Visually hides the label while keeping it accessible to screen readers.
Requires a `label` to be provided. The label text will still be announced by assistive technologies.

**@default** false

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`info`

`boolean`

Info state for the input widget.

`infoMessage`

`ReactNode`

Additional element that will be shown as the Info message for the input.

`label`

`ReactNode`

The input widget's label.

`labelGraphic`

`ReactNode`

Additional element that will be shown on the left of the input's label.

`leftLabel`

`string`

A label to show on the left of the slider, normally used for indicating left-most value.

`marks*`

`SliderMark[]`

An array that contains all marks of the slider.

`readonly`

`boolean`

Specifies whether the input is readonly.

`rightLabel`

`string`

A label to show on the right of the slider, normally used for indicating right-most value.

`style`

`CSSProperties`

Additional styles.

`value`

`string`

The currently selected value.

`onChange`

`(value: string) => void`

A handler function that will be fired when the mouse is released.

**@param** value – `SliderMark` 's value

Theming configuration

The following theme variables can be used to customize the component:

```
1"slider": {
2    "label": {
3        "color": "#333",
4        "disabledColor": "#e2e6e9",
5        "fontFamily": "\"Open Sans\", sans-serif",
6        "fontWeight": 400,
7        "fontSize": "0.75rem",
8        "top": "16px"
9    },
10    "fill": {
11        "height": "2px",
12        "background": "#e2e6e9",
13        "hoverBackground": "#00589f",
14        "leftActiveBackground": "#00589f",
15        "leftBG": "#a9b3bc",
16        "leftDisabledBackground": "#e2e6e9",
17        "leftFocusBackground": "#d50075"
18    },
19    "tick": {
20        "background": "#e2e6e9",
21        "borderRadius": "1px",
22        "hoverBackground": "#00589f",
23        "leftActiveBackground": "#00589f",
24        "leftBackground": "#a9b3bc",
25        "leftDisabledBackground": "#e2e6e9",
26        "leftFocusBackground": "#d50075",
27        "width": "1px",
28        "height": "12px",
29        "top": "-5px"
30    },
31    "thumb": {
32        "activeBackground": "#00589f",
33        "thumbBackground": "#00589f",
34        "borderRadius": "50% 50% 18% 50%",
35        "disabledBackground": "#e2e6e9",
36        "focusBackground": "#d50075",
37        "size": "18px",
38        "hoverBackground": "#00589f",
39        "invalidBackground": "#c62828",
40        "readonlyBackground": "#a9b3bc",
41        "transformOrigin": "79% -31%",
42        "transformRotate": "45deg"
43    },
44    "container": {
45        "invalidMarginBottom": "4px",
46        "horizontalPadding": "8px",
47        "paddingTop": "6px",
48        "height": "24px"
49    },
50    "wrapper": {
51        "gap": "4px"
52    }
53}
```

*content\_copy*
