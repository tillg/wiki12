---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-entry/icon-picker
widget: data-entry/icon-picker
scraped: 2026-06-12
---

# Widgets/Data entry/Icon picker

Icon Picker

The **Icon Picker** Widget is an input component that allows users to pick an icon from either [Material Icons*open\_in\_new*](https://fonts.google.com/icons?icon.set=Material+Icons "Leave Page") or Widget's [Custom Icons](#/widgets/general/icon#custom-icons).

It inherits some general features from the **Text Field** such as states, messages, helper text, etc. Visit the [Text Field showcase](#/widgets/data-entry/text-field) to learn more.

Basic

Use the `selectedIcon` and `onChange` properties to update the icon you chose.

The *view\_list* icon that is displayed next to the input will redirect you to the [Material Icons*open\_in\_new*](https://fonts.google.com/icons?icon.set=Material+Icons "Leave Page") page where you can easily explore more icons. Do note, however, that some of the newer icons may not yet be available for our picker, so please be sure to double check your selection.

Basic, Type an icon or select one

*expand\_more*

*view\_list*

Selected Icon:

* **Name:**
* **Theme:**

*code**center\_focus\_weak**bug\_report*

Space Saving

In order to save space for the icon container, you can set the `saveSpaceMode` property to true so that the icon label is not displayed. By default, the **IconPicker** will automatically switch to save space mode if its width is less than **208px**.

Space saving, Type an icon or select one

*expand\_more*

*view\_list*

Selected Icon:

* **Name:**
* **Theme:**

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* This API section only displays some of the most remarkable properties of the **Icon Picker** widget. To find a full set of properties, please make use of an IDE to explore the Widget's source code.
* `prop*` is required.
* `prop` is deprecated.

IconPickerProps

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

`hintTemplate`

`string`

The template for the hint text.
You need to provide placeholders for number of icons shown and number of icons in total.
It should follow this template: `"{count} of {total} icons shown"` .

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

`onBlur`

`FocusEvent<HTMLInputElement>`

Handler function when the input is blurred.

`onClick`

`MouseEvent`

The click handler for the input field.

`onDoubleClick`

`MouseEvent<HTMLInputElement>`

The handler that will be invoked when the input field is clicked twice.

`onFocus`

`FocusEvent<HTMLInputElement>`

Handler function when the input is focused.

`onInput`

`ChangeEvent<HTMLInputElement>`

The input event is fired when the value has been changed.

`onKeyDown`

`KeyboardEvent<HTMLInputElement>`

The key down handler for the input.

`onKeyUp`

`KeyboardEvent<HTMLInputElement>`

The key up handler for the input.

`onWrapperClick`

`MouseEvent<HTMLElement>`

A callback will be triggered when the input wrapper has been clicked.

`onWrapperKeyDown`

`KeyboardEvent<HTMLElement>`

The key down handler for the input wrapper.

`onWrapperKeyPress`

`KeyboardEvent<HTMLElement>`

The key press handler for the input wrapper.

`onWrapperMouseDown`

`MouseEvent<HTMLElement>`

Mouse down handler for the input wrapper.

`openOnFocus`

`boolean`

Whether the list of items should be opened when focusing the input.

**@default** true

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

`saveSpaceMode`

`boolean`

If set to true, the icon item will be displayed without the label in order to save space.
By default, IconPicker will automatically change to save space mode if the width of the picker is less than 208px.

`selectedIcon`

`Icon`

Initially selected icon.

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

`onChange*`

`(icon?: Icon) => void`

Callback will be triggered when an icon is selected.
The param icon will be 'undefined' if click on clear button.

`onIconClick`

`(icon: Icon) => void`

Handle event when clicking on an icon.

Theming configuration

The **Icon Picker** is a combination of a [Text Field](#/widgets/data-entry/text-field#text-field-theme-configuration) and a [Dropdown](#/widgets/navigation/dropdown#dropdown-theme-configuration) that contains a list of [Icon](#/widgets/general/icon#icon-theme-configuration) widgets, so it inherits the style configurations of those components.

Additionally, the component provides built-in theme variables that can be used to customize itself:

```
1"iconPicker": {
2    "containerMargin": "4px 0 0 0",
3    "inputSelectedIconColor": "#333",
4    "item": {
5        "hoverColor": "#00589f",
6        "icon": {
7            "fontSize": "1.125rem",
8            "size": "24px"
9        },
10        "label": {
11            "fontSize": "0.625rem",
12            "width": 32
13        },
14        "padding": "16px 4px 8px"
15    },
16    "selectedItem": {
17        "color": "#333",
18        "icon": {
19            "backgroundColor": "#00589f",
20            "color": "#fff"
21        }
22    },
23    "smallContainerIconPadding": "4px 4px"
24}
```

*content\_copy*
