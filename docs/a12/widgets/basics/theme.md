---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/basics/theme
widget: basics/theme
scraped: 2026-06-12
---

# Basics/Theme/Theming

Theming

The theme specifies color of the components, darkness of the surfaces, level of shadow, appropriate opacity of ink elements, etc.

Themes let you apply a consistent tone to your app. It allows you to customize all design aspects of your project in order to meet the specific needs of your business or brand.

Our Theme set consists of four themes: Default, Compact, Flat and Flat Compact. You can check the differences between each of them directly by toggling the "Theme Selector" button positioned on the top-right of our Showcase.

Theme variables

The base Widgets `theme` includes the following themable aspects:

* `.colors`

  This property defines the color palette of the Theme object.
* `.typography`

  This property defines the variables related to the Font of the Theme object, including Font Family, Font Size and Font Weight.
* `.spacing`

  This property defines the variables related to the Spacing of the Theme object.
* `.applicationStyles`

  This property defines the variables related to the overall styles of the Theme object, including shared input styles, label styles, and responsive breakpoints.
* `.focusStyles`

  This property defines the variables related to the focus styles of the Theme object.
* `.divisionLineStyles`

  This property defines the variables related to the styles of the dividers of the Theme object, including `bottomLine`, `initialLine`, `topLine` and `lineHeight`.
* `.baseInputStyles`

  This property defines the variables related to the Box-Shadow and Line Height styles of the input components inside the Theme object.
* `.components`

  This property defines the styling variables related to each of the Widget's component. Each of our Component showcase includes a **Theme Configuration** section for you to take a deeper look on each component's styling configuration values.

There are some differences between each of our `theme`:

* **Flat and Flat-Compact themes:** Our Flat themes has a explicit color design system comparing to the Default and Compact themes. Therefore, they have some additional `.colors` values, and a `.hoverStyles` property.
* **Compact and Flat-Compact themes:** Since they are named as "compact", the `.spacing` property will have a smaller range of values.

The following example represents our `theme` object of the current theme.

You can trigger the row action with Enter on a cell.

Property

Type

Value

*expand\_more*

theme

object

*expand\_more*

colors

, belongs totheme

object

primaryColor

, belongs tocolors

string

#fff

secondaryColor

, belongs tocolors

string

#ebf1f7

*expand\_more*

text

, belongs tocolors

object

color

, belongs totext

string

#333

secondaryColor

, belongs totext

string

#e2e6e9

secondaryColorDark

, belongs totext

string

#616f7c

invertedColor

, belongs totext

string

#fff

headlineColor

, belongs totext

string

#16191d

titleColor

, belongs totext

string

#202e5d

placeholderColor

, belongs totext

string

#4d4d4d

*expand\_more*

background

, belongs tocolors

object

primaryBackground

, belongs tobackground

string

#fff

secondaryBackground

, belongs tobackground

string

#f7fafc

tertiaryBackground

, belongs tobackground

string

#e2e6e9

interactiveBackground

, belongs tobackground

string

#f1f2f4

nonInteractiveBackground

, belongs tobackground

string

#f9fafb

invertedBackground

, belongs tobackground

string

#fff

groupBackground

, belongs tobackground

string

#ebf1f7

*expand\_more*

divider

, belongs tocolors

object

color

, belongs todivider

string

#e2e6e9

colorDark

, belongs todivider

string

#a9b3bc

colorLight

, belongs todivider

string

#fff

colorSubtle

, belongs todivider

string

#becfe2

*expand\_more*

interaction

, belongs tocolors

object

primaryInteractionColor

, belongs tointeraction

string

#00589f

secondaryInteractionColor

, belongs tointeraction

string

#00589f

*expand\_more*

active

, belongs tointeraction

object

color

, belongs toactive

string

#d50075

*center\_focus\_weak**bug\_report*

createTheme

We provide the `createTheme()` function for you to generate your own custom theme based on the options received. With the `theme` created by this function, you can pass it as a property to the `ThemeProvider`.

This function receives any incomplete `theme` object as its argument, and will deep merge that object to the Default theme.

You can pass along a `baseTheme` property to specify which `theme` variant you want to create upon: `"default"` (default), `"compact"`, `"flat"` or `"flat-compact"`.

The following example creates a custom theme based on the Flat-Compact theme and having the `colors.primaryColor` as `"red"`:

```
1import { createTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/create-theme";
2
3const theme = createTheme({
4  colors: { primaryColor: "red" },
5  baseTheme: "flat-compact"
6});
```

*content\_copy*

This function is used in the background of our Showcase's Upload Theme function. You can test your custom `theme` object directly in our Showcase by the following steps:

1. Create your own custom `theme` object and save it as a .JSON file
2. At our Showcase, please try to press the `LeftShift` and the `RightShift` keys at the same time, you can see a new "Upload Theme" button shows up in our Showcase's Header.
3. Click the "Upload Theme" button and upload your custom `theme` object .JSON file.

To find more examples on how you can make use of this function, please take a look at our [Use And Configure Widgets Style](#/get-started/use-and-configure-widgets-style) showcase.
