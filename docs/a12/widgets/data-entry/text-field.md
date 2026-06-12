---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-entry/text-field
widget: data-entry/text-field
scraped: 2026-06-12
---

# Widgets/Data entry/Text field

Text Field

The **Text Field** (previously called **Text Line**) Widget is a controlled component that allows users to type text and handle click, keyboard and value changed event. This widget also supports accessibility and provides additional functionalities such as affixes, add-ons, and helper text.

Basic

Basic Text Field, Type something here

*code**center\_focus\_weak**bug\_report*

States

There are five variants beside the default: `info`, `warning`, `error`, `readonly`, and `disabled`.

The `infoMessage`, `warningMessage` and `errorMessage` properties can also be used to display different messages (one or multiple messages can be shown at once).

Info state


Warning state


Error state


Info Message

*infoInformation*

This is an info message


Warning Message

*warningWarning*

This is a warning message


Error Message

*Error*

This is an error message


Readonly with value


Disabled with value

*code**center\_focus\_weak**bug\_report*

Additional Customizations

This example combines some of the features that the `Text Field` widget provides altogether, including:

* `labelGraphic` - placed on the left of the input's label.
* `addonBefore` - placed on the left of the input.
* `prefixes` - placed inside the input, on the left.
* `suffixes` - placed inside the input, on the right.
* `addonAfter` - placed on the right of the input.
* `helperText` - placed below the input.
* `textAlignment` - the alignment of the text.

The widget also provides the `TextAffix` component that allows you to display the given text as a prefix or suffix. See the second example for more details.

Warning

*warning*

**NOTE**

To fully support accessibility, each **tooltip** or **affix** should have its own `id`. That `id` should be passed in as a value of the `ariaDescribedby` property.

Text aligned right

*search*

*info*

Combination

9+ Entries9+

*close*

*keyboard\_arrow\_down*

*infoHint: Tooltip*

*warningWarning: Tooltip*

*search*

Aliquip deserunt velit aliquip deserunt velit aliquip. Velit aliquip deserunt velit aliquip deserunt minim culpa cillum.

*infoHint: Tooltip*

*warningWarning: Tooltip*


Text Affix

mmol/l

*code**center\_focus\_weak**bug\_report*

Buffered Text Field

You can make a Stateful Text Field by using the higher-order components (HOC) `BufferedInput` and `HTMLInputAdapter` to wrap the `TextField`.

Unlike the **TextField** component which requires you to control its value and manually update the component any time the value is changed, the **BufferedTextField** below is a stateful component which has its value handled internally.

In addition to sharing most of the same functionalities as the **Text Field**, the BufferedTextField also allows you to provide an initial value via the `initialValue` property. Business logic can be handled using the `onValueSubmit` property, which is fired whenever the input loses focus.

While values normally update when blur events occurs, a useful feature these HOCs provide is allowing you to trigger a value change when pressing the ENTER key. This provides you with additional flexibility and can be enabled via the usage of the optional `submitOnEnter` property.

Stateful TextLine using BufferedInput

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

TextAffixProps

Property

Type

Description

`children*`

`string`

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

`truncate`

`boolean`

If true, the content will be truncated when it's too long.

TextLineStatelessProps

Property

Type

Description

`addonAfter`

`ReactNode | ReactNode[]`

Specifies the addons that will be placed after the input wrapper.

`addonBefore`

`ReactNode | ReactNode[]`

Specifies the addons that will be placed before the input wrapper.

`ariaDescribedby`

`string`

aria-describedby attribute for the input.

`autoComplete`

`string`

Specifies whether autocomplete is enabled.

`autoFocus`

`boolean`

Specifies whether the input should automatically get focus after rendering.

**@default** false

`className`

`string`

Additional css class names.

`customInputProps`

`CustomInputProps`

Additional non-standard props that will be added to the real HTML Input Element.

`customInputWrapperProps`

`Omit<HTMLProps<HTMLDivElement>, "ref" | "as">`

Additional props that will be placed at the Wrapper of the real HTML Input Element.

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

`helperTextRef`

`RefCallback<HTMLDivElement>`

The reference of the helper text.

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

`inputWrapperRef`

`RefCallback<HTMLDivElement>`

The reference of the input wrapper.

`label`

`ReactNode`

The input widget's label.

`labelGraphic`

`ReactNode`

Additional element that will be shown on the left of the input's label.

`labelRef`

`RefCallback<HTMLLabelElement>`

The reference of the label.

`placeholder`

`string`

Specifies the placeholder that is shown in the input when it's empty.

`prefixes`

`ReactNode | ReactNode[]`

Specifies the prefixes that will be placed in front of the html-input.

`readonly`

`boolean`

Specifies whether the input is readonly.

`role`

`string`

Specifies the role attribute for the input wrapper, in order to support Accessibility.

See [Roles*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles "Leave Page")

`spellCheck`

`boolean`

Specifies whether spellCheck is enabled.

`style`

`CSSProperties`

Additional styles.

`suffixes`

`ReactNode | ReactNode[]`

Specifies the suffixes that will be placed at the end of the html-input.

`textAlignment`

`"right" | "left"`

Specifies the text alignment.

**@default** left

`tooltips`

`ReactNode`

Additional Tooltip for the input widget.

`value`

`string`

Value of the input.

`warning`

`boolean`

Warning state for the input widget.

`warningMessage`

`ReactNode`

Additional element that will be shown as the Warning message for the input.

`onBlur`

`(ev: FocusEvent<HTMLInputElement>) => void`

Handler function when the input is blurred.

`onChange`

`(ev: ChangeEvent<HTMLInputElement>) => void`

Handler function when the value of the input is changed.

`onClick`

`(event: MouseEvent) => void`

The click handler for the input field.

`onDoubleClick`

`(event: MouseEvent<HTMLInputElement>) => void`

The handler that will be invoked when the input field is clicked twice.

`onFocus`

`(ev: FocusEvent<HTMLInputElement>) => void`

Handler function when the input is focused.

`onInput`

`(event: ChangeEvent<HTMLInputElement>) => void`

The input event is fired when the value has been changed.

`onKeyDown`

`(ev: KeyboardEvent<HTMLInputElement>) => void`

The key down handler for the input.

`onKeyUp`

`(ev: KeyboardEvent<HTMLInputElement>) => void`

The key up handler for the input.

`onWrapperClick`

`(event: MouseEvent<HTMLElement>) => void`

A callback will be triggered when the input wrapper has been clicked.

`onWrapperKeyDown`

`(event: KeyboardEvent<HTMLElement>) => void`

The key down handler for the input wrapper.

`onWrapperKeyPress`

`(event: KeyboardEvent<HTMLElement>) => void`

The key press handler for the input wrapper.

`onWrapperMouseDown`

`(event: MouseEvent<HTMLElement>) => void`

Mouse down handler for the input wrapper.

Theming configuration

The following theme variables can be used to customize the component:

```
1"textLine": {
2    "textSuffix": {
3        "background": "#e2e6e9",
4        "fontSize": "0.75rem",
5        "minWidth": "32px",
6        "padding": "0 4px"
7    }
8}
```

*content\_copy*
