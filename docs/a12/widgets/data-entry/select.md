---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-entry/select
widget: data-entry/select
scraped: 2026-06-12
---

# Widgets/Data entry/Select

Select

The **Select** Widget is used to render a native browser select element, which allows the user to select one item from a dropdown. The available options can be passed in via the`items` property. After the user selects a value, the function passed to `onValueChanged` will run and it can be used to set the `value` property.

Basic

You can use the `labelGraphic` property to add a graphic before the label text.

*info*

Select with label graphic

AvocadoChestnutDragon fruitGrapeGrapefruitJackfruitPomegranatePeachRambutanStarfruitMangoAppleOrangeTangerineDurianStrawberryBananaBlueberryRaspberriesCherryMangosteenGuavaMelonWater MelonKiwiPineappleLychee

*code**center\_focus\_weak**bug\_report*

States & Messages

The `errorMessage`, `warningMessage`, and `infoMessage` properties can be used to modify the state of the **Select** and display different messages (one or multiple messages can be shown at once).

If you'd like to alter the state/styles of the Select without displaying any messages, you can use the `info`, `error`, and `warning` properties.

Do note, that if you use one of the props that display a message, you don't need to use its accompanying state property. For example, if you display a message using `errorMessage`, error state/styles are applied automatically and the `error` property becomes unnecessary.

If the dropdown contains an empty value item through `isEmptyValue` property, that item will be shown with specific styling in select input.

In addition, the `disabled` and `readonly` properties can be used to make the entire **Select** disabled or read-only. It's also possible to disable individual items by setting the `disabled` property of an item to **true**.

Info

AvocadoChestnutDragon fruitGrapeGrapefruitJackfruitPomegranatePeachRambutanStarfruitMangoAppleOrangeTangerineDurianStrawberryBananaBlueberryRaspberriesCherryMangosteenGuavaMelonWater MelonKiwiPineappleLychee


Warning

AvocadoChestnutDragon fruitGrapeGrapefruitJackfruitPomegranatePeachRambutanStarfruitMangoAppleOrangeTangerineDurianStrawberryBananaBlueberryRaspberriesCherryMangosteenGuavaMelonWater MelonKiwiPineappleLychee


Error

AvocadoChestnutDragon fruitGrapeGrapefruitJackfruitPomegranatePeachRambutanStarfruitMangoAppleOrangeTangerineDurianStrawberryBananaBlueberryRaspberriesCherryMangosteenGuavaMelonWater MelonKiwiPineappleLychee


Info message

*infoInformation*

Info message

AvocadoChestnutDragon fruitGrapeGrapefruitJackfruitPomegranatePeachRambutanStarfruitMangoAppleOrangeTangerineDurianStrawberryBananaBlueberryRaspberriesCherryMangosteenGuavaMelonWater MelonKiwiPineappleLychee


Warning messages

*warningWarning*

* Warning 1
* Warning 2
* Warning 3

AvocadoChestnutDragon fruitGrapeGrapefruitJackfruitPomegranatePeachRambutanStarfruitMangoAppleOrangeTangerineDurianStrawberryBananaBlueberryRaspberriesCherryMangosteenGuavaMelonWater MelonKiwiPineappleLychee


Error message

*Error*

Error message

AvocadoChestnutDragon fruitGrapeGrapefruitJackfruitPomegranatePeachRambutanStarfruitMangoAppleOrangeTangerineDurianStrawberryBananaBlueberryRaspberriesCherryMangosteenGuavaMelonWater MelonKiwiPineappleLychee


Select with Empty Value Item

EmptyAvocadoChestnutDragon fruitGrapeGrapefruitJackfruitPomegranatePeachRambutanStarfruitMangoAppleOrangeTangerineDurianStrawberryBananaBlueberryRaspberriesCherryMangosteenGuavaMelonWater MelonKiwiPineappleLychee


Disabled Select

AvocadoChestnutDragon fruitGrapeGrapefruitJackfruitPomegranatePeachRambutanStarfruitMangoAppleOrangeTangerineDurianStrawberryBananaBlueberryRaspberriesCherryMangosteenGuavaMelonWater MelonKiwiPineappleLychee


Readonly Select

AvocadoChestnutDragon fruitGrapeGrapefruitJackfruitPomegranatePeachRambutanStarfruitMangoAppleOrangeTangerineDurianStrawberryBananaBlueberryRaspberriesCherryMangosteenGuavaMelonWater MelonKiwiPineappleLychee

*code**center\_focus\_weak**bug\_report*

Additional Customizations

The Select's items can have `children`. This allows you to easily organize related items into option groups.

The `tooltips` and `helperText` properties can be used to provide users with additional information. If you do use tooltips, it's recommended to ensure accessibility by adding the ids of the tooltips to the `ariaDescribedby` property so that screen readers can read them.

If you'd like to remove information rather than add it, it's possible to hide the label while still following **accessibility** best practices. The recommended way of doing so is by setting `hideLabel` to true while still passing a descriptive label text to the `label` property.

Items inside of the **Select** are displayed vertically by default. If you'd prefer they display horizontally, you can configure the `Select` to use `horizontalMode`.

Items can also be configured to display graphics. The graphics will appear alongside the text in vertical mode, or above the text in horizontal mode ([just like the Dropdown widget](#/widgets/navigation/dropdown#items-with-graphic)).

Select with additional customizations

JavaJavascriptPythonC++KotlinPHPVSCodeIntelliJNetBeanDevC++SubLime Text

*Error: Tooltip*

This is a Select with a hidden label, helper text, and option groups.

*code**center\_focus\_weak**bug\_report*

Custom Select

While our standard **Select** Widget is simpler, it's possible that sometimes you'll need more control over customizations than it offers. When this is the case, we recommend using our **CustomSelect** widget.

There's two different ways to use our **CustomSelect**. The first is to convert a standard **Select** into a **CustomSelect** by setting the `useCustomView` property to `true`. Perhaps even easier, however, is to just use the **CustomSelect** component directly.

One thing to note while using the **CustomSelect** is that it's styled a bit differently than our standard **Select**. While the differences are subtle, it's worth keeping in mind so that your app can maintain a consistent UI.

To open the modal on **mobile** or the dropdown on **desktop**, you can press the **ENTER**, **SPACE**, **DOWN ARROW**, or **UP ARROW** keys. To close the modal/dropdown you can press the **ESC** key on mobile or the **ESC/TAB** keys on desktop.

In addition, similar to the standard [Select](#/widgets/data-entry/select#additional-customizations) widget, the **CustomSelect** can also use option groups to group related items.

Furthermore, it's also possible to override those open/close command keys by using the `keysToOpen` and `keysToClose` props. In the showcase below, you can use the **CTRL** key for opening, and the **DELETE** or **BACKSPACE** keys for closing.

Lastly, if the dropdown contains an empty value item through `isEmptyValue` property, that item will be shown with specific styling in both dropdown and select input.

Standard Custom Select, Please choose...


Custom Select with group options, Please choose...

This Custom Select also uses option groups to group related items.


Custom Select with custom open/close command keys, Please choose...


Custom Select with Empty Value Item, Please choose...

Select 'Empty' to see the empty value styling

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

Types

* `NativeSelectProps = Omit<SelectProps, customInputProps>`

CustomSelectProps

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

`className`

`string`

Additional css class names.

`dataRole`

`string`

data-role attribute.

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

`focusBack`

`boolean`

Focus back on the input when the list of item is closed.
When this prop is set to false, the focus will be lost after select an item or close the modal is closed on mobile devices.
To handle focus when the list of item is closed, you can use:

* On desktop: onSelect
* On Mobile: `onModalClose`

**@default** true

`helperText`

`ReactNode`

Additional content displayed below the inputs.

`hideLabel`

`boolean`

Visually hides the label while keeping it accessible to screen readers.
Requires a `label` to be provided. The label text will still be announced by assistive technologies.

**@default** false

`horizontalMode`

`boolean`

Whether the items will display in horizontal or not.
This property only work with customized select.

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

`items`

`SelectItem[]`

An array of options to use when the select is customized

`keysToClose`

`string[]`

Custom keys to close the modal on mobile or the dropdown on desktop.
The default keys will be overridden if this property is defined.

**@default** mobile: ["ESC"], desktop: ["ESC", "TAB"]

`keysToOpen`

`string[]`

Custom keys to open the modal on mobile or the dropdown on desktop.
The default keys will be overridden if this property is defined.

**@default** ["Space", "Arrow Down", "Arrow Up", "Enter"]

`label`

`ReactNode`

The input widget's label.

`labelGraphic`

`ReactNode`

Additional element that will be shown on the left of the input's label.

`modalProps`

`{ fullscreen: boolean, noGutter: boolean }`

Custom props for the modal on mobile.

**@default** true

`onBlur`

`FocusEvent<HTMLElement>`

Handler function when the input is blurred.

`onFocus`

`FocusEvent<HTMLElement>`

Handler function when the input is focused.

`onValueChanged`

`string`

Trigger when an item's state is changed.

`openOnFocus`

`boolean`

Whether the list of items would be opened when focusing the input.

**@default** false

`placeholder`

`string`

Text that will be displayed if no value is selected.

`readonly`

`boolean`

Specifies whether the input is readonly.

`selectRef`

`RefCallback<HTMLElement | HTMLSelectElement>`

The reference element of:

* The select input on Desktop
* The select wrapper element on Mobile.

`selectWrapperId`

`string`

The id for the select wrapper element.

`selectWrapperInModalRef`

`RefCallback<HTMLElement>`

The reference element of the select wrapper element inside the Modal on Mobile.

`showPrefixes`

`boolean`

Specifies whether the prefix is shown in the input.

**@default** true

`style`

`CSSProperties`

Additional styles.

`tooltips`

`ReactNode`

Additional Tooltip for the input widget.

`useCustomView`

`boolean`

Render a custom HTML structure instead of the native browser select tag.
The custom structure is a combination of the Tag Input and other widgets to demonstrate the select component.

`value`

`string`

The current selected value.

`warning`

`boolean`

Warning state for the input widget.

`warningMessage`

`ReactNode`

Additional element that will be shown as the Warning message for the input.

`onModalClose`

`void`

Callback when the modal is closed.

`onModalOpen`

`void`

Callback when the modal is opened.

`onSelect`

`(value: string) => void`

Trigger an onSelect even when a selection is made, additionally to the onChange event, doesn't matter if selection has changed or not
This function will be fired in case the select is customized

`onVisibilityChange`

`(isDropdownVisible: boolean) => void`

A callback function that will be triggered on desktop when the visibility of the Custom Select's dropdown changes.

**@param** isDropdownVisible – true if the dropdown is currently being shown, otherwise false.

SelectItem

Property

Type

Description

`children`

`DropDownItem[]`

Whether a dropdown item contains a list of DropdownItem inside.

`dataRole`

`string`

data-role attribute.

`disabled`

`boolean`

Whether a dropdown item should be disabled.

`graphic`

`ReactNode`

A graphic element (e.g. icon) that is placed in front of the `label` .

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`isEmptyValue`

`boolean`

Whether a dropdown item represents an empty value.

`label`

`string`

Label of dropdown item.

`value`

`string`

Specifies the value of a DropdownItem that should get selected.
If the value does not exist, the `selected` item will be set dependent on the `label` and id or `selected` .

SelectProps

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

`className`

`string`

Additional css class names.

`customInputProps`

`HTMLProps<HTMLInputElement>`

Additional props that will be placed at the real HTML Input Element.
Use this prop when `useCustomView` is true.

`dataRole`

`string`

data-role attribute.

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

`horizontalMode`

`boolean`

Whether the items will display in horizontal or not.
This property only work with customized select.

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

`HTMLProps<T>`

Additional props that will be placed at the real HTML Input Element.

`items*`

`SelectItem[]`

An array of options to use when the select is customized

`label`

`ReactNode`

The input widget's label.

`labelGraphic`

`ReactNode`

Additional element that will be shown on the left of the input's label.

`onBlur`

`FocusEvent<HTMLElement>`

Handler function when the input is blurred.

`onFocus`

`FocusEvent<HTMLElement>`

Handler function when the input is focused.

`placeholder`

`string`

Text that will be displayed if no value is selected.

`readonly`

`boolean`

Specifies whether the input is readonly.

`selectRef`

`RefCallback<HTMLElement | HTMLSelectElement>`

The reference element of:

* The select input on Desktop
* The select wrapper element on Mobile.

`style`

`CSSProperties`

Additional styles.

`tooltips`

`ReactNode`

Additional Tooltip for the input widget.

`useCustomView`

`boolean`

Render a custom HTML structure instead of the native browser select tag.
The custom structure is a combination of the Tag Input and other widgets to demonstrate the select component.

`value`

`string`

The current selected value.

`warning`

`boolean`

Warning state for the input widget.

`warningMessage`

`ReactNode`

Additional element that will be shown as the Warning message for the input.

`onValueChanged`

`(value: string) => void`

Trigger when an item's state is changed.

Theming configuration

Since the **Custom Select** has a [Dropdown](#/widgets/navigation/dropdown#dropdown-theme-configuration) widget, it inherits the style configuration of that component.

Additionally, the component provides built-in theme variables that can be used to customize itself:

```
1"select": {
2    "borderRadius": "4px",
3    "color": "#333",
4    "fontFamily": "\"Open Sans\", sans-serif",
5    "fontSize": "0.75rem",
6    "fontWeight": 400,
7    "height": "32px",
8    "arrowIcon": {
9        "color": "#7F8C9B",
10        "content": "\"\\e313\"",
11        "disabledColor": "#a9b3bc",
12        "fontSize": "1.5rem"
13    },
14    "title": {
15        "borderRadius": "4px",
16        "rightAlignPadding": "0 32px 0 16px"
17    },
18    "option": {
19        "active": {
20            "backgroundColor": "#00589f",
21            "color": "#fff"
22        },
23        "hover": {
24            "backgroundColor": "#00589f",
25            "color": "#fff"
26        }
27    },
28    "dropdown": {
29        "margin": "2px 0 0"
30    },
31    "empty": {
32        "color": "#616f7c",
33        "fontStyle": "italic"
34    }
35}
```

*content\_copy*
