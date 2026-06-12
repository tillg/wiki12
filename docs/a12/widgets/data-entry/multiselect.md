---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-entry/multiselect
widget: data-entry/multiselect
scraped: 2026-06-12
---

# Widgets/Data entry/Multiselect

Multiselect

The **Multiselect** Widget is an input component that allows users to choose multiple items from a list.

It uses the **Text Field**, therefore it also inherits some general features from the Text Field such as states, messages, helper text,... Visit the [showcase](#/widgets/data-entry/text-field) to see more behaviors.

Basic

By default, the list of items will be opened when the input is focused on. To prevent this behavior, you can set the `openOnFocus` property to `false`.

You can use the `labelGraphic` property to add a graphic before the label text.

The `disabled` and `readonly` properties can be used to disable the Multiselect or make it readonly.

*info*

Multiselect with a graphic label, Please select or start typing

1 Entries1

*clear*

*expand\_more*


Readonly, Please select or start typing

0 Entries0


Disabled with value, Please select or start typing

1 Entries1

*expand\_more*

*code**center\_focus\_weak**bug\_report*

Hide the Select All option

As demonstrated in [Basic](#/widgets/data-entry/multiselect#basic), the select all items option is visible by default. However, you can disable it by setting the `enableSelectAllOption` to **false**. It is recommended to use this property when the Multiselect enforces a limit on how many items can be selected.

In the showcase below, the **All** option is not displayed and you can select up to 3 items.

Please select or start typing

1 Entries1

*clear*

*expand\_more*

*code**center\_focus\_weak**bug\_report*

Messages

Different types of messages can be shown by using the various message properties: `infoMessage`, `errorMessage`, and `warningMessage`. A single message or multiple can be shown based on your use case.

Info message, Please select or start typing

*infoInformation*

This is an info message

1 Entries1

*clear*

*expand\_more*


Warning message, Please select or start typing

*warningWarning*

This is a warning message

1 Entries1

*clear*

*expand\_more*


Error message, Please select or start typing

*Error*

This is an error message

1 Entries1

*clear*

*expand\_more*

*code**center\_focus\_weak**bug\_report*

Additional Customizations

You can use `tooltips` or `helperText` to provide users with additional information.

To simplify the appearance of the Multiselect, it's also possible to hide the label. The recommended way of doing this to support **accessibility** is to set `hideLabel` to true while still passing a descriptive label text to the `label` property.

Multiselect with many customizations, Please select or start typing

1 Entries1

*clear*

*expand\_more*

*infoHint: Tooltip*

*warningWarning: Tooltip*

This is a Multiselect with a hidden label, helper text, and tooltips.

*infoHint: Tooltip*

*warningWarning: Tooltip*

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

Types

* `MultiselectProps.FilteringHandler = (searchText: string, items: MultiselectProps.Items) => MultiselectProps.Items`
* `MultiselectProps.GroupingHandler = (items: MultiselectProps.Items, selectedItems: MultiselectProps.Item[]) => MultiselectProps.ItemGroup`
* `MultiselectProps.Items = MultiselectProps.Item[] | MultiselectProps.ItemGroup`
* `MultiselectProps.JoiningHandler = (selectedItems: MultiselectProps.Item[], items: MultiselectProps.Items, dropdownClosed: boolean) => string`
* `MultiselectProps.SortingHandler = (items: MultiselectProps.Items) => MultiselectProps.Items`

MultiselectProps.Item

Property

Type

Description

`ariaChecked`

`"true" | "false" | "mixed"`

aria-checked attribute.

`children`

`DropDownItem[]`

Whether a dropdown item contains a list of DropdownItem inside.

`className`

`string`

Additional css class names.

`disabled`

`boolean`

Whether a dropdown item should be disabled.

`graphic`

`ReactNode`

A graphic element (e.g. icon) that is placed in front of the `label` .

`hideLabel`

`boolean`

If set to true, the label will still be rendered but it won't be displayed.
This will save space but still support Accessibility.

`id*`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`isEmptyValue`

`boolean`

Whether a dropdown item represents an empty value.

`label*`

`string`

Label of dropdown item.

`secondaryText`

`ReactNode`

An additional text that is placed below the `label` .

`selected`

`boolean`

Whether a dropdown item should be selected.

`style`

`CSSProperties`

Additional styles.

`tabIndex`

`number`

tabindex attribute.

**@default** -1 if `children` is defined or `disabled` is true

`title`

`string`

title attribute.

`value`

`string`

Specifies the value of a DropdownItem that should get selected.
If the value does not exist, the `selected` item will be set dependent on the `label` and id or `selected` .

MultiselectProps.ItemGroup

Property

Type

Description

`selectedItems*`

`Item[]`

An array of the items that are currently selected.

`unselectedItems*`

`Item[]`

An array of the items that are currently NOT selected.

MultiselectProps

Property

Type

Description

`ariaDescribedby`

`string`

aria-describedby attribute for input

`breakTooltipsToNewLine`

`boolean`

Break tooltips in new line or not.

**@default** false

`className`

`string`

Additional css class names.

`disabled`

`boolean`

Whether the Multiselect should be disabled.

`enableSelectAllOption`

`boolean`

Specifies whether the select all items option is shown in the dropdown.

**@default** true

`errorMessage`

`ReactNode`

The error message(s) that will be shown in the text-line error message.

`filteringHandler`

`FilteringHandler`

Handles filtering items when the user types on the input.

**@default** compare not case sensitive.

`groupingHandler`

`GroupingHandler`

Handles grouping selected and unselected items to different groups.

`helperText`

`ReactNode`

Can be used to provide additional information that will display under the input.

`hideLabel`

`boolean`

Can be used in conjunction with the label prop to hide the label while still following accessibility best practices.

**@default** false

`hintTemplate`

`string`

Informational text displayed above the Multiselect items when the Multiselect is open.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`infoMessage`

`ReactNode`

The info message(s) that will be shown in the text-line warning message.

`inputProps`

`HTMLProps<HTMLInputElement>`

Additional props that will be placed at the real HTML Input Element.

`inputRef`

`RefCallback<HTMLInputElement> | RefObject<HTMLInputElement>`

The reference of the input field.

`items*`

`Items`

The items that will be available as options inside the Multiselect dropdown.

`joiningHandler`

`JoiningHandler`

Handles joining selected items to show on the input.

**@default** selections are displayed in the input as comma-separated list.

`label`

`ReactNode`

Label for the Multiselect input.

`labelGraphic`

`ReactNode`

Additional element will be shown on the left of the label of Multiselect.

`mobile`

`boolean`

If set to true, the Multiselect will appear as a modal while selecting options.

`mobileHeadingTitle`

`ReactNode`

The title for the Multiselect modal if the 'mobile' prop is set to true.

`openOnFocus`

`boolean`

Whether the list of items should open when focusing the input.

**@default** true

`placeholder`

`string`

The placeholder text for the input that will be displayed if no values are selected.

`readonly`

`boolean`

Whether the Multiselect should be readonly.

`selectAllText`

`string`

Text that displays inside the 'select all items' option.

`sortingHandler`

`SortingHandler`

Handles sorting items.

**@default** alphanumerical

`style`

`CSSProperties`

Additional styles.

`tooltips`

`ReactNode`

Additional Tooltip for the input widget.

`warningMessage`

`ReactNode`

The warning message(s) that will be shown in the text-line warning message.

`onChange`

`(selectedItems: Item[]) => void`

Handler function when the value of the input is changed.

`onItemCheck`

`(value: boolean, item: Item, event: ChangeEvent<HTMLInputElement>) => void`

Handler function when a Multiselect dropdown item checkbox is checked/unchecked.

`onItemClick`

`(item: Item, event?: MouseEvent<Element, MouseEvent>) => void`

Handler function when a Multiselect dropdown item is clicked.

Theming configuration

The **Multiselect** includes a [Text Field](#/widgets/data-entry/text-field#text-field-theme-configuration) and a [Dropdown](#/widgets/navigation/dropdown#dropdown-theme-configuration) that contains [Checkbox](#/widgets/data-entry/checkbox#checkbox-theme-configuration) options, therefore it inherits the style configurations of those components.

Additionally, the component provides built-in theme variables that can be used to customize itself:

```
1"multiselect": {
2    "dropdown": {
3        "divider": "1px solid #a9b3bc",
4        "dividerGap": "8px",
5        "firstItemFontWeight": 700,
6        "margin": "2px 0 0 0"
7    },
8    "readonlyCounterColor": "#f1f2f4",
9    "disabledCounterColor": "#e2e6e9"
10}
```

*content\_copy*
