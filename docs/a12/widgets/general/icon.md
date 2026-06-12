---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/general/icon
widget: general/icon
scraped: 2026-06-12
---

# Widgets/General/Icon

Icon

The **Icon** Widget is the component that will display an icon from any icon font that supports [ligatures*open\_in\_new*](http://alistapart.com/article/the-era-of-symbol-fonts/ "Leave Page").

Basic

To use the **Icon** Widget, you can pass the name of an icon from [Material Icons*open\_in\_new*](https://fonts.google.com/icons?icon.set=Material+Icons "Leave Page") as the `children` property.

The value of `title` property will display as a tooltip of icon. And for better support A11y, the icon will also get this value as a hidden text.

*reply\_allReply all**editEdit**saveSave**deleteDelete**mailMail to*

*code**center\_focus\_weak**bug\_report*

Big Icon

Set `size` property to **big**, the `Icon` will have a bigger font size.

*reply\_allReply all**editEdit**saveSave**deleteDelete**mailMail to*

*code**center\_focus\_weak**bug\_report*

Variants

There are four Icon variants besides the default: `info`, `success`, `warning`, and `error`. You can change it by setting `variant` property.

**Info:** *infoInfo*

**Success:** *check\_circleSuccess*

**Warning:** *warningWarning*

**Error:** *Error*

*code**center\_focus\_weak**bug\_report*

Themes

Icon has 4 themes: `filled`, `outlined`, `rounded` and `custom`. The default theme is `filled`.

The `filled`, `outlined` and `rounded` themes are using filled, outlined and rounded [Material Icons*open\_in\_new*](https://material.io/resources/icons "Leave Page").

**Filled:***star\_rateFilled start rate**send\_and\_archiveFilled send and archive*

**Outlined:***star\_rateOutlined start rate**send\_and\_archiveOutlined send and archive*

**Rounded:***star\_rateRounded start rate**send\_and\_archiveRounded send and archive*

*code**center\_focus\_weak**bug\_report*

Custom Icons

You can create your custom font by using [IcoMoon App*open\_in\_new*](https://icomoon.io/app "Leave Page"), but make sure that you enable `Ligatures` feature so that you can use the `children` property.

*Clear Filter**Error**Edit Outline**Insert Below**Insert Above**Insert As Child**Check**Error Collapsed**Warning Collapsed**And**Or**Datatype Audio**Datatype Default**Datatype Image**Datatype PDF**Datatype Spreadsheet**Datatype Text**Datatype Video**Settings Panel Opened**Settings Panel Closed**Delete Hint**Unpin**Version*

*code**center\_focus\_weak**bug\_report*

With Mapping Context

Icon Mapping Context provides a way to replace a specific icon by another one.

The below example replace "info" with "report\_problem" and "help" with "help\_center".

`{ originalIcon: "info", mappedIcon: "report_problem", theme: "filled" }`

`{ originalIcon: "help", mappedIcon: "help_center", theme: "outlined" },`

*report\_problemInfo**help\_centerHelp*

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

Types

* `IconTheme = "filled" | "outlined" | "rounded" | "custom"`

IconMappingDefinition

Property

Type

Description

`mappedIcon*`

`string`

The icon that will be shown.

`originalIcon*`

`string`

The icon will be replaced.

`theme`

`IconTheme`

Specifies theme for the icon.

IconProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`dataRole`

`string`

data-role attribute.

`htmlAttributes`

`HTMLAttributes<HTMLElement>`

Additional props that will be placed at the DOM element.
It should be used in case a user wants to access to native DOM properties but there's no property allows to do that.

`iconRef`

`RefCallback<HTMLElement>`

The ref to the icon.

`iconTheme`

`IconTheme`

Icon theme to use for rendering the icon.

* `filled` : Solid filled icons from Material Icons
* `outlined` : Outlined/stroke-based icons from Material Icons
* `rounded` : Rounded corner variant from Material Icons
* `custom` : Custom icon implementations

**@default** 'filled'

See [filled*open\_in\_new*](https://fonts.google.com/icons?selected=Material+Icons&icon.style=Filled "Leave Page")

See [outlined*open\_in\_new*](https://fonts.google.com/icons?selected=Material+Icons&icon.style=Outlined "Leave Page")

See [custom*open\_in\_new*](#/widgets/general/icon#custom-icons "Leave Page")

**@remarks** The 'rounded' theme option was added to support Material Icons rounded variant.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`showTitleAsTooltip`

`boolean`

If true, the title will be shown as a tooltip, otherwise, it will not be shown but still be able to read it by screen readers.

**@default** true

`size`

`"big" | "medium"`

Defines the font-size of the icon.

**@default** medium

`style`

`CSSProperties`

Additional styles.

`title`

`string`

Specifies the title attribute for the icon.

`variant`

`"info" | "error" | "warning" | "success"`

Variant of the icon.

**@default** no variant

`onClick`

`(event: MouseEvent) => void`

A callback will be triggered when the icon is clicked by mouse.

Theming configuration

The following theme variables can be used to customize the component:

```
1"icon": {
2    "color": "#333",
3    "variant": {
4        "success": "#2e7d32",
5        "info": "#0277bd",
6        "error": "#c62828",
7        "warning": "#ad7d04"
8    },
9    "fontSize": "1.125rem",
10    "bigFontSize": "1.5rem"
11}
```

*content\_copy*
