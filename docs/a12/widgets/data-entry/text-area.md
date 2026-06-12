---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-entry/text-area
widget: data-entry/text-area
scraped: 2026-06-12
---

# Widgets/Data entry/Text area

Text Area

The **Text Area** Widget is a controlled component that allows users to type multi-line text.

The **Text Area** was built on top of the **Text Field** and for this reason, it inherits several general features from the **Text Field** such as states, messages, helper text, etc. Visit the [Text Field](#/widgets/data-entry/text-field) showcase to see these common features demoed.

Basic

Basic Text Area, Type something here

*code**center\_focus\_weak**bug\_report*

Additional Customizations

This example combines some of the features that `TextAreaStateless` widget provides altogether, including:

* `labelGraphic` - placed on the left of the input's label.
* `addonBefore` - placed on the left of the input.
* `prefixes` - placed inside the input, on the left.
* `suffixes` - placed inside the input, on the right.
* `addonAfter` - placed on the right of the input.
* `helperText` - placed below the input.

The widget can also expand the input's height when the text gets longer. To enable this functionality, set the `autoExpand` property to `true`.

Warning

*warning*

**NOTE**

To fully support accessibility, each **tooltip** or **affix** should have its own `id`. That `id` should be passed in as a value of the `ariaDescribedby` property.

*search*

*info*

Addon Before

9+ Entries9+

mmol/l

*infoHint: Tooltip*

*warningWarning: Tooltip*

*search*

Aliquip deserunt velit aliquip deserunt velit aliquip. Velit aliquip deserunt velit aliquip deserunt minim culpa cillum.

*infoHint: Tooltip*

*warningWarning: Tooltip*

*code**center\_focus\_weak**bug\_report*

Buffered TextArea

You can make a Stateful Text Area by using the higher-order component (HOC) `BufferedInput` to wrap the `TextAreaStateless`.

Unlike the `TextAreaStateless` component which requires you to control its value and manually update the component any time the value is changed, the `BufferedTextArea` below is a stateful component which has its value handled internally.

In addition to sharing most of the same functionalities as the `TextAreaStateless`, the BufferedTextArea also allows you to provide an initial value via the `initialValue` property. Business logic can be handled using the `onValueSubmit` property, which is fired whenever the input loses focus.

Stateful TextArea using BufferedInput

Initial value

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

TextAreaStatelessProps

Property

Type

Description

`addonAfter`

`ReactNode | ReactNode[]`

Addons that will be placed after the input wrapper.

`addonBefore`

`ReactNode | ReactNode[]`

Addons that will be placed before the input wrapper.

`ariaActivedescendant`

`string`

The aria-activedescendant attribute for the input, in order to support Accessibility.

`ariaAutocomplete`

`"none" | "inline" | "list" | "both"`

The aria-autocomplete attribute for the input, in order to support Accessibility.

`ariaBusy`

`boolean`

**@deprecated** since 30.0.0

`ariaDescribedby`

`string`

aria-describedby attribute for the input.

`ariaExpanded`

`boolean`

The aria-expanded attribute for the input, in order to support Accessibility.

`ariaHaspopup`

`"true" | "false" | "menu" | "listbox" | "tree" | "grid" | "dialog"`

The aria-haspopup attribute for the input, in order to support Accessibility.

`ariaOwns`

`string`

The aria-owns attribute for the input, in order to support Accessibility.

`autoExpand`

`boolean`

Allows the input's height to expand when the text gets longer.

`autoFocus`

`boolean`

Specifies whether the input should automatically get focus after rendering.

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

`HTMLProps<HTMLTextAreaElement>`

Additional props that will be placed at the real HTML Input Element.

`inputRef`

`RefCallback<HTMLTextAreaElement>`

The reference of the input field.

`inputWrapperProps`

`HTMLAttributes<HTMLDivElement>`

Specifies the HTML properties for the textarea wrapper.

`inputWrapperRef`

`RefCallback<HTMLDivElement>`

The reference of the input wrapper.

`label`

`ReactNode`

The input widget's label.

`labelGraphic`

`ReactNode`

Additional element that will be shown on the left of the input's label.

`placeholder`

`string`

Specifies the placeholder that is shown in the input when it's empty.

`prefixes`

`ReactNode | ReactNode[]`

Prefixes that will be placed in front of the html-input.

`readonly`

`boolean`

Specifies whether the input is readonly.

`role`

`string`

The role attribute for the input wrapper, in order to support Accessibility.

`style`

`CSSProperties`

Additional styles.

`suffixes`

`ReactNode | ReactNode[]`

Suffixes that will be placed at the end of the html-input.

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

`wrapperStyle`

`CSSProperties`

Specifies styling for the wrapper.

`onBlur`

`(ev: FocusEvent<HTMLTextAreaElement>) => void`

Handler function when the input is blurred.

`onChange`

`(ev: ChangeEvent<HTMLTextAreaElement>) => void`

Handler function when the value of the input is changed.

`onClick`

`(event: MouseEvent) => void`

The event will be invoked when the real textarea has been clicked.

`onFocus`

`(ev: FocusEvent<HTMLTextAreaElement>) => void`

Handler function when the input is focused.

`onHeightChanged`

`(inputRef: HTMLTextAreaElement, newHeight: number) => void`

A callback will be triggered when the input's height has been changed.
**Note:** It works when `autoExpand` is enabled.

`onInput`

`(event: ChangeEvent<HTMLTextAreaElement>) => void`

The input event is fired when the value has been changed.

`onKeyDown`

`(event: KeyboardEvent<HTMLTextAreaElement>) => void`

The key down handler for the input.

Theming configuration

The following theme variables can be used to customize the component:

```
1"textArea": {
2    "affixHeight": "32px",
3    "autoExpand": {
4        "minHeight": "32px",
5        "height": "32px"
6    },
7    "height": "100px",
8    "maxHeight": "100px",
9    "minHeight": "32px",
10    "padding": "calc((32px - 0.75rem * 1.45)/2) 12px"
11}
```

*content\_copy*
