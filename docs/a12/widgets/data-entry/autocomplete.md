---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-entry/autocomplete
widget: data-entry/autocomplete
scraped: 2026-06-12
---

# Widgets/Data entry/Autocomplete

Autocomplete

The **Autocomplete** Widget is an input component enhanced by a panel of suggested options and text autocompletion. The suggested options of an autocomplete could be a set of static data (see [Predefined options](#/widgets/data-entry/autocomplete#predefined-options)) or dynamic data (see [Asynchronous requests](#/widgets/data-entry/autocomplete#asynchronous-requests)).

The **Autocomplete** was built on top of the **Text Field** and for this reason, it inherits several general features from the **Text Field** such as states, messages, helper text, etc. Visit the [Text Field](#/widgets/data-entry/text-field) showcase to see these common features demoed.

Predefined options

In this showcase, the **Autocomplete** receives an array of predefined items as the source for autocompletion. When you start typing, the list will show matches that start with the typed input, sorted by alphabetical order, followed by the middle matches, un-ordered.

You can also set a pre-selected value by `initialValue` property. When the input contains any text, the clear button appears to allow quick removal.

Programming Language, Please select or start typing

*close*

*expand\_more*

*code**center\_focus\_weak**bug\_report*

Hide the Clear Button

As demonstrated in [Predefined options](#/widgets/data-entry/autocomplete#predefined-options), the clear button is visible by default. However, you can disable it by setting `enableClearButton` to **false**.

Programming Language, Please select or start typing

*expand\_more*

*code**center\_focus\_weak**bug\_report*

Grouped items

You can group the options by nesting a set of options to one item as its children.

Grouped Items, Please select or start typing

*expand\_more*

*code**center\_focus\_weak**bug\_report*

Asynchronous requests

The **Autocomplete** Widget provides a `loading` property for you to handle asynchronous cases such as loading items on open, or loading new items on search.

Selected value will display here:

Asynchronous, Please select or start typing

*expand\_more*

*code**center\_focus\_weak**bug\_report*

Adding item

The **Autocomplete** Widget also allows to add new items to the list when having the `allowAddingNewItem` property. To differentiate between capital and lowercase letters of items' label, set `caseSensitive` to true.

Adding custom value, Please select or start typing

*expand\_more*

*code**center\_focus\_weak**bug\_report*

With Link Items

The **Autocomplete** Widget also allows to add a list of [Link](#/widgets/general/link) items to the list by using the `links` property.

Assignee, Not assigned

*account\_circle*

*close*

*expand\_more*

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

AutocompleteProps

Property

Type

Description

`allowAddingNewItem`

`boolean`

Allow the user to enter and submit a new value if set to true.

`ariaDescribedby`

`string`

aria-describedby attribute for the input.

`ariaLabelledby`

`string`

aria-labelledby attribute for the dropdown content wrapper in case of extended autocomplete with grouped items.
This attribute is defined to make screen readers read the label, validation messages or additional
information (e.g: tooltip) of the autocomplete.

**@deprecated** since 32.2.0, use `BaseInputProps.ariaDescribedby` instead

`breakTooltipsToNewLine`

`boolean`

Break tooltips in new line or not.

**@default** false

`caseSensitive`

`boolean`

If caseSensitive is set, only existing items having a label written in corresponding case are selected.

`className`

`string`

Additional css class names.

`disabled`

`boolean`

Specifies whether the input is disabled.

`dropdownFooter`

`ReactNode`

To display element(s) at the bottom of the dropdown for extended functionality such as loading more items.

`enableClearButton`

`boolean`

Specifies whether the clear button is shown.

**@default** true

`error`

`boolean`

Error state for the input widget.

`errorMessage`

`ReactNode`

Additional element that will be shown as the Error message for the input.

`helperText`

`ReactNode`

Additional content displayed below the inputs.

`hideLabel`

`boolean`

Visually hides the label while keeping it accessible to screen readers.
Requires a `label` to be provided. The label text will still be announced by assistive technologies.

**@default** false

`hintTemplate*`

`string`

The template for the hint text.
You need to provide placeholders for number of item shown and number of item
in total, and it should follow this template: `"{count} of {total} options shown"` .

If you want to not show the hint, just set its value to an empty string.

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

`initiallyExpanded`

`boolean`

Specify whether the dropdown is displayed or not at the initial rendering.

`initialValue`

`string | DropDownItem`

The initial value for the input field that you want to make as pre-selected value.
It should be an existing item from the source.

`inputPlaceHolder`

`string`

Placeholder text for the input of the Autocomplete.

`inputProps`

`HTMLProps<HTMLInputElement>`

Additional props that will be placed at the real HTML Input Element.

`inputRef`

`RefCallback<HTMLInputElement>`

Get ref of input inside autocomplete.

**@param** ref – the input element reference.

`items*`

`string[] | DropDownItem[]`

An array of strings to use as the source of autocompletion.

`itemsWrapperClassName`

`string`

Additional css class names which wrap items.

`label`

`ReactNode`

The input widget's label.

`labelGraphic`

`ReactNode`

Additional element that will be shown on the left of the input's label.

`lightBackground`

`boolean`

Uses the light color for background.

`links`

`ReactNode[]`

Links to be displayed on top of the dropdown items.

`loading`

`boolean`

If true, the Progress Indicator is shown.

`loadingLabel`

`ReactNode`

Label of the Progress Indicator.

`mobileTriggerElement`

`ReactNode`

The element to override the TextLine which triggers open the autocomplete on mobile.

**@default** TextLine

`openOnFocus`

`boolean`

Whether the list of items would be opened when focusing the input.

**@default** true

`prefixes`

`ReactNode`

Elements that get rendered at the beginning of input.

`readonly`

`boolean`

Specifies whether the input is readonly.

`searchResult`

`string[] | DropDownItem[]`

@deprecated. Will be removed in 33.0.0.

`selectedItemPosition`

`SelectedItemPosition`

Initial position of the selected item.

**@default** "bottom"

`style`

`CSSProperties`

Additional styles.

`suffixes`

`ReactNode`

Elements that get rendered before the select button, and after the clear button, if it gets rendered.

`tooltips`

`ReactNode`

Additional Tooltip for the input widget.

`value`

`string | DropDownItem`

The selected item of the autocomplete from outside.

`warning`

`boolean`

Warning state for the input widget.

`warningMessage`

`ReactNode`

Additional element that will be shown as the Warning message for the input.

`wrapperRef`

`RefCallback<HTMLDivElement>`

The reference of the element wrapping the main content if one exists.

`closeAndResetOption`

`(handler: void) => void`

Returns a handler for closing the list of items and reset selected option.
It's handy to use with `links` where the dropdown can be intentionally closed based on the user's needs

**@param** handler – a callback to execute the close and reset operation.

`onDropdownClose`

`void`

Returns a handler that is triggered right after the dropdown is closed.

`onSearch`

`(value: string) => void`

A function is used to filter items by the given text.
It should also be used in case the autocomplete contains grouped items.

**@param** value – Text to be searched

`onValueChange`

`(value: string | DropDownItem) => void`

Function to call when selected item changed.

Theming configuration

The **Autocomplete** is a combination of the [Text Field](#/widgets/data-entry/text-field#text-field-theme-configuration) and [Dropdown](#/widgets/navigation/dropdown#dropdown-theme-configuration) widgets, so it inherits the style configurations of those components.

Additionally, the component provides built-in theme variables that can be used to customize itself:

```
1"autocomplete": {
2    "dropdown": {
3        "loadingMinHeight": "48px",
4        "margin": "2px 0 0 0"
5    }
6}
```

*content\_copy*
