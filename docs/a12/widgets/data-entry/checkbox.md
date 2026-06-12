---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-entry/checkbox
widget: data-entry/checkbox
scraped: 2026-06-12
---

# Widgets/Data entry/Checkbox

Checkbox

The **Checkbox** Widget is an input component that allows the user to make a binary choice.

Basic

By default, a **Checkbox** includes a checkbox and label. Additionally, you can use the `labelGraphic` property to add an extra graphic, which appears to the left of the label.

Default

*info*

Checkbox with label graphic

Long checkbox label. Estibulum ac [link*open\_in\_new*](https://example.com "Leave page") sit amet quam vehicula elementum sed sit amet dui. Nulla porttitor accumsan tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; [Widgets](#) velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.

*code**center\_focus\_weak**bug\_report*

States

There are five **Checkbox** variants besides the default: `info`, `warning`, `error`, `readonly` and `disabled`.

Having `infoMessage`, `warningMessage`, and `errorMessage` properties will display along a message for the corresponding state.

Info state

Warning state

Error state

**With message:**

*infoInformation*

This is an info message

Info state with message


*warningWarning*

This is a warning message

Warning state with message


*Error*

This is an error message

Error state with message


**With tooltips (recommended when showing state's messages in a limited space):**

Info state with tooltip*infoHint: Tooltip*

Warning state with tooltip*warningWarning: Tooltip*

Error state with tooltip*Error: Tooltip*

**Readonly:**

Readonly state

Readonly state (checked)

**Disabled:**

Disabled state

Disabled state (checked)

*code**center\_focus\_weak**bug\_report*

Checkbox Group

The **CheckboxGroup** is used to group together a set of **Checkbox**. It also supports the `labelGraphic` property, allowing you to add an extra graphic to the main label group.

To display all Checkboxes in CheckboxGroup on one line, set the `inline` property to true.

Checkbox Group

Option 1

Option 2

Option 3

*info*

Checkbox Group with label graphic

Option 1

Option 2

Option 3

Inline Checkbox Group

Option 1

Option 2

Option 3

*code**center\_focus\_weak**bug\_report*

Indeterminate

Indeterminate: This type of checkbox supports an additional third state known as partially checked.

One common use of an indeterminate checkbox can be found where a single indeterminate checkbox is used to represent and control the state of an entire group of nested options. And, each option in the group can be individually turned on or off with a dual state checkbox (checked / unchecked).

* If all options in the group are checked, the overall state is represented by the indeterminate checkbox displaying as checked.
* If some of the options in the group are checked, the overall state is represented with the indeterminate checkbox displaying as partially checked.
* If none of the options in the group are checked, the overall state of the group is represented with the indeterminate checkbox displaying as not checked.

The user can use the indeterminate checkbox to change all options in the group with a single action:

* Checking the overall checkbox checks all options in the group.
* Unchecking the overall checkbox will uncheck all options in the group.

**Checkbox.Indeterminate** has all the Checkbox's properties with the same usage.

**De/Select all**

Apple

Orange

Pear

*code**center\_focus\_weak**bug\_report*

Helper Text

Use `helperText` property to display an additional text below the input.

Checkbox with Helper Text

This is helper text. Lorem ipsum dolor sit amet.

Checkbox Group with Helper Text

Option 1

Option 2

Option 3

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor

*code**center\_focus\_weak**bug\_report*

Accessibility

The recommended way of hiding the label while still supporting **accessibility** is to set `hideLabel` to **true** while still passing a descriptive label text to the `label` property.
Also the `title` property should be set along with the hidden label.

The `ariaControls` property should always be set for the **Checkbox.Indeterminate**.
Value of `ariaControls` has to contain the list of controlled checkbox ids.

For example:
**Checkbox.Indeterminate** controls 2 checkboxes: **Apple** (id is *apple*), and **Pear** (id is *pear*). Value of `ariaControls` should be **"apple pear"**.

De/Select all

Apple

Pear

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* This API section only displays some of the most remarkable properties of the **Checkbox** widget. To find a full set of properties, please make use of an IDE to explore the Widget's source code.
* `prop*` is required.
* `prop` is deprecated.

Checkbox

CheckboxProps

Property

Type

Description

`ariaControls`

`string`

Return ids of the set of checkboxes controlled by the indeterminate checkbox.

`ariaDescribedby`

`string`

aria-describedby attribute for the input.

`breakTooltipsToNewLine`

`boolean`

Break tooltips in new line or not.

**@default** false

`checked*`

`boolean`

Returns if the checkbox is checked.

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

`helperText`

`ReactNode`

Additional content displayed below the inputs.

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

`inputProps`

`HTMLProps<HTMLInputElement>`

Additional props that will be placed at the real HTML Input Element.

`inputRef`

`RefCallback<HTMLInputElement>`

Reference of the Checkbox.

**@param** instance – the input element instance.

`label`

`ReactNode`

The input widget's label.

`labelGraphic`

`ReactNode`

Additional element that will be shown on the left of the input's label.

`onBlur`

`FocusEvent<HTMLInputElement>`

Handler function when the input is blurred.

`onFocus`

`FocusEvent<HTMLInputElement>`

Handler function when the input is focused.

`readonly`

`boolean`

Specifies whether the input is readonly.

`style`

`CSSProperties`

Additional styles.

`tabIndex`

`number`

tabIndex of the checkbox.

`title`

`string`

Title property to show the checkbox's name (hint text) on checkbox's on mouse over event.

`tooltips`

`ReactNode`

Additional Tooltip for the input widget.

`warning`

`boolean`

Warning state for the input widget.

`warningMessage`

`ReactNode`

Additional element that will be shown as the Warning message for the input.

`onChange*`

`(value: boolean, event: ChangeEvent<HTMLInputElement>) => void`

Handler function when the checkbox is changed.

IndeterminateCheckboxProps

Property

Type

Description

`ariaControls`

`string`

Return ids of the set of checkboxes controlled by the indeterminate checkbox.

`ariaDescribedby`

`string`

aria-describedby attribute for the input.

`breakTooltipsToNewLine`

`boolean`

Break tooltips in new line or not.

**@default** false

`buttonRef`

`RefCallback<HTMLButtonElement>`

Reference of the Indeterminate Checkbox.

**@param** instance – the button element instance

`checked*`

`boolean | "mixed"`

Returns if the checkbox is checked.

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

`helperText`

`ReactNode`

Additional content displayed below the inputs.

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

`inputProps`

`HTMLProps<HTMLButtonElement>`

Additional props that will be placed at the real HTML Input Element.

`label`

`ReactNode`

The input widget's label.

`labelGraphic`

`ReactNode`

Additional element that will be shown on the left of the input's label.

`onBlur`

`FocusEvent<HTMLButtonElement>`

Handler function when the input is blurred.

`onFocus`

`FocusEvent<HTMLButtonElement>`

Handler function when the input is focused.

`readonly`

`boolean`

Specifies whether the input is readonly.

`style`

`CSSProperties`

Additional styles.

`tabIndex`

`number`

tabIndex of the checkbox.

`title`

`string`

Title property to show the checkbox's name (hint text) on checkbox's on mouse over event.

`tooltips`

`ReactNode`

Additional Tooltip for the input widget.

`warning`

`boolean`

Warning state for the input widget.

`warningMessage`

`ReactNode`

Additional element that will be shown as the Warning message for the input.

`onChange*`

`(value: boolean, event: MouseEvent) => void`

Handler function when the checkbox is changed.

Checkbox Group

CheckboxGroupProps

Property

Type

Description

`ariaDescribedby`

`string`

aria-describedby attribute for the input.

`breakTooltipsToNewLine`

`boolean`

Break tooltips in new line or not.

**@default** false

`children`

`ReactNode`

The component's content.

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

`helperText`

`ReactNode`

Additional content displayed below the inputs.

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

`inline`

`boolean`

Display all items inline.

`label`

`ReactNode`

The input widget's label.

`labelGraphic`

`ReactNode`

Additional element that will be shown on the left of the input's label.

`readonly`

`boolean`

Specifies whether the input is readonly.

`style`

`CSSProperties`

Additional styles.

`tooltips`

`ReactNode`

Additional Tooltip for the input widget.

`warning`

`boolean`

Warning state for the input widget.

`warningMessage`

`ReactNode`

Additional element that will be shown as the Warning message for the input.

`wrapperRef`

`RefCallback<HTMLDivElement> | RefObject<HTMLDivElement>`

The reference of the group wrapper.

`onValueChanged`

`(value: string) => void`

Handler function when the checkbox value is changed.

CheckboxItemProps

Property

Type

Description

`ariaControls`

`string`

Return ids of the set of checkboxes controlled by the indeterminate checkbox.

`ariaDescribedby`

`string`

aria-describedby attribute for the input.

`breakTooltipsToNewLine`

`boolean`

Break tooltips in new line or not.

**@default** false

`className`

`string`

Additional css class names.

`disabled`

`boolean`

Specifies whether the input is disabled.

`error`

`boolean`

Error state for the input widget.

`fitToParent`

`boolean`

Make input's width fits to parent's width.

**@default** true

`helperText`

`ReactNode`

Additional content displayed below the inputs.

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

`inputProps`

`HTMLProps<HTMLInputElement>`

Additional props that will be placed at the real HTML Input Element.

`inputRef`

`RefCallback<HTMLInputElement>`

The reference of the input field.

`label`

`ReactNode`

The input widget's label.

`labelGraphic`

`ReactNode`

Additional element that will be shown on the left of the input's label.

`onBlur`

`FocusEvent<HTMLInputElement>`

Handler function when the input is blurred.

`onFocus`

`FocusEvent<HTMLInputElement>`

Handler function when the input is focused.

`readonly`

`boolean`

Specifies whether the input is readonly.

`selected`

`boolean`

Specifies whether the CheckboxGroup Item is selected.

`style`

`CSSProperties`

Additional styles.

`tabIndex`

`number`

tabIndex of the checkbox.

`title`

`string`

Title property to show the checkbox's name (hint text) on checkbox's on mouse over event.

`tooltips`

`ReactNode`

Additional Tooltip for the input widget.

`value*`

`string`

The value of the CheckboxGroup Item.

`warning`

`boolean`

Warning state for the input widget.

`onChange`

`(ev: ChangeEvent<HTMLInputElement>) => void`

Handler function when the CheckboxGroup Item is changed.

Theming configuration

The following theme variables can be used to customize the component:

```
1"checkbox": {
2    "active": {
3        "border": "2px solid #00589f",
4        "checkedBG": "#00589f"
5    },
6    "background": "#fff",
7    "borderRadius": "0",
8    "checked": {
9        "background": "#333",
10        "border": "2px solid #fff",
11        "invalidBorderColor": "#c62828",
12        "margin": "2px 0 0 2px"
13    },
14    "disabled": {
15        "background": "#e2e6e9",
16        "border": "1px solid #a9b3bc",
17        "checkedBG": "#a9b3bc",
18        "checkedBorderColor": "#a9b3bc"
19    },
20    "error": {
21        "border": "1px solid #c62828",
22        "checkedBG": "#c62828"
23    },
24    "focus": {
25        "border": "2px solid #d50075",
26        "checkedBG": "#d50075"
27    },
28    "hover": {
29        "border": "2px solid #00589f",
30        "checkedBG": "#00589f"
31    },
32    "info": {
33        "border": "1px solid #0277bd",
34        "checkedBG": "#0277bd"
35    },
36    "indeterminateBackground": "#333",
37    "inputHeight": "20px",
38    "label": {
39        "color": "inherit",
40        "fontFamily": "\"Open Sans\", sans-serif",
41        "fontSize": "0.75rem",
42        "fontWeight": 400,
43        "lineHeight": "20px",
44        "maxWidth": "100%",
45        "verticalAlign": "top"
46    },
47    "readOnly": {
48        "background": "#e2e6e9",
49        "border": "1px solid #7F8C9B",
50        "checkedBG": "#7F8C9B",
51        "checkedBorderColor": "#7F8C9B"
52    },
53    "single": {
54        "fieldControlPadding": "0 0 2px 0",
55        "minHeight": "32px",
56        "padding": "2px 0 0 0"
57    },
58    "warning": {
59        "border": "1px solid #ad7d04",
60        "checkedBG": "#ad7d04"
61    }
62}
```

*content\_copy*
