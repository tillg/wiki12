---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-entry/rich-text-editor/pre-built-plugins
widget: data-entry/rich-text-editor/pre-built-plugins
scraped: 2026-06-12
---

# Widgets/Data entry/Rich text editor

Rich Text Editor

The **Rich Text Editor** Widget is a highly performant and accessible text editor. It ships with a **RichTextEditor** as well as a **DefaultRichTextEditor**.

The **DefaultRichTextEditor** is more accessible for beginners to work with because it's built on top of the **RichTextEditor** and takes care of the most essential nodes and plugins for you. For more detailed instructions on how to use the **DefaultRichTextEditor**, check out the [combination section](#/widgets/data-entry/rich-text-editor/default#combination).

Regardless of which one you choose, both the **RichTextEditor** and **DefaultRichTextEditor** are highly configurable. We provide several preexisting nodes and plugins as well as the ability to [create your own plugins](#/widgets/data-entry/rich-text-editor/plugin-creation).

The **Rich Text Editor** was built on top of the **Text Field** and for this reason, it inherits several general features from the Text Field such as states, messages, helper text, etc. Visit [Text Field](#/widgets/data-entry/text-field) to see these common features demoed.

Warning

*warning*

**NOTE**

* To use the standard theme for Rich Text Editor, you need to import the CSS file:

  `import "@com.mgmtp.a12.widgets/widgets-core/lib/rich-text-editor/main/themes/rich-text-editor.css";`
* To see more customization and theming configuration, visit [Theming*open\_in\_new*](https://lexical.dev/docs/getting-started/theming "Leave Page").

* Default
* *more\_horiz*

Static Toolbar Plugin

The Static Toolbar plugin uses the `staticToolbarButtons` property for configuration. Inside of `staticToolbarButtons` property you can define the structure you'd like your toolbar to have.

You can create toolbar items by using the following built-in functions:

* `createInlineButton`: Creates a button that handles interactions related to inline items.
* `createBlockButton`: Creates a button that handles interactions related to block items.
* `createButtonGroup`: Creates a group button that group other buttons into 1 group.

We also provide pre-built buttons for a number of common functionalities:

* Bolding via the `BoldButton`.
* Italics via the `ItalicButton`.
* Underlines via the `UnderlineButton`.
* Bulleted and numbered lists via the `BulletListButton` and `NumberListButton`.
* List indents via the `IndentDecreaseButton` and `IndentDecreaseButton`.
* Text alignment via the `AlignButtonGroup`.
* Separator elements via the `Separator`.

Some buttons need to be used alongside certain plugins in order to work correctly. Those plugins have already been added to the `DefaultRichTextEditor`.

* The `createInlineButton` needs the `TextFormatPlugin`.
* The `BulletListButton`, `NumberListButton`, `IndentDecreaseButton`, and `IndentIncreaseButton` require the presence of the `ListPlugin`.

* *format\_bold*
* *format\_italic*
* *format\_underline*
* *text\_format*
* *list*
* *format\_list\_numbered*
* *format\_indent\_decrease*
* *format\_indent\_increase*
* *format\_align\_left*
* *code*

Type anything...

*code**center\_focus\_weak**bug\_report*

Mentions Plugin

The Mentions plugin can help you to easily add mention tags to your editor. When users type the **@** key, they'll be prompted with a list of suggestions. These suggestions come from the array passed into the `suggestions` property of the `MentionPlugin` component.

To filter suggestions as the user types, you can pass a function with custom logic to `onSearchChange`.

Enter the @ character

*code**center\_focus\_weak**bug\_report*

Links Plugin

The **Links** plugin is our recommended solution for detecting links. A useful feature of this plugin is that it allows you to use **regex** to detect `customTerms` and apply links to them. This could be useful if you often work with things that have a common format such as project tickets.

The link plugin will highlight common links. For example, [example.com](http://example.com), <https://example.com>, etc.
[A12W-1234](https://example.com/A12W-1234), [A12W-2345](https://example.com/A12W-2345) are links which are detected via customTerms.

*code**center\_focus\_weak**bug\_report*

Spell Check Plugin

If words are spelled incorrectly within the editor, the Spell Check plugin can help you apply styles to indicate the misspellings. If a word has incorrectly been identified as misspelled, hovering over said word will give you the option of adding it to the `dictionary`.

This can be useful for words such as names that may often be incorrectly identified as misspellings. To test this plugin, enter 'developr' or 'javescript' (without the quotes) to see an example of a word being identified as a misspelling.

Warning

*warning*

**NOTE**

You need to define the logic for determining whether a word is misspelled or not.

Enter developr, developrr or javescript

*code**center\_focus\_weak**bug\_report*

Tooltip Plugin

The Tooltip plugin allows you add tooltips that appear when certain `customTerms` are entered into the editor. In the example below, we've configured it so that a tooltip appears when you type 'example'.

You can pass `"focus"` to the `triggerMode` property so that the tooltip appears automatically while the editor is focused (as we've done below). Otherwise, the `triggerMode` will default to `"hover"` and a tooltip will only appear if you hover over one of the `customTerms`.

Warning

*warning*

**NOTE**

If you want to display a tooltip for a specific text node, add the `editorThemeClasses.withDefaultTooltip` class to the node and provide `customTerms` without the regex.

Enter 'example'.

*code**center\_focus\_weak**bug\_report*
