---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-entry/rich-text-editor
widget: data-entry/rich-text-editor
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

Basic

The `DefaultRichTextEditor` is capable of quite a lot! You have the standard properties found across much of the Widgets library such as `helperText` which can be used to add additional information under the editor, `labelGraphic` for adding a graphic image next to the editor's label, and `hideLabel` for hiding the label of the editor.

Do note, however, that if you use `hideLabel`, you should still give your editor a descriptive label text to support accessibility best practices.

There are also properties like `minHeight`, `maxHeight`, and `autoExpand` for controlling the height of the editor, `readOnly` and `disabled` for modifying the state of the editor.

Of course, the real power of the editor shines when you start to take advantage of its various plugins. The editor below utilizes the **Static Toolbar Plugin** to enable font italics, bolding, underlining, strikethrough, and a number of other formatting options.

To view more information on how the Static Toolbar works as well as see our other ready-made plugins, be sure to check out our [full list of plugins](#/widgets/data-entry/rich-text-editor/pre-built-plugins).

Editable

Readonly

Disabled

Auto expand


Set min-Height to 50px

Set max-Height to 200px

*info*

Basic Default Rich Text Editor

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

Example Helper Text. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

*code**center\_focus\_weak**bug\_report*

Combination

We've already mentioned that it's possible to create and add your own [plugins](#/widgets/data-entry/rich-text-editor/plugin-creation) to the editor. For your convenience, however, we've also provided pre-defined plugins inside of the `DefaultRichTextEditor` that you can easily use by configuring properties.

* `outputConfig`: Displays HTML output from the editor (demoed below).
* `mentionPluginConfig`: Adds a mention feature for tagging ([learn more](#/widgets/data-entry/rich-text-editor/pre-built-plugins#mentions-plugin)). The trigger character is **@** by default.
* `linkPluginConfig`: Provides custom link detection ([learn more](#/widgets/data-entry/rich-text-editor/pre-built-plugins#links-plugin)). This example shows you how to create a link with custom term. For example, type **A12W-123** will become a link and refer to <https://example.com/A12W-123>. You can also type anything in link format, e.g. "google.com"
* `spellCheckPluginConfig`: Provides a custom spell checking and allows you to apply styles to indicate misspellings ([learn more](#/widgets/data-entry/rich-text-editor/pre-built-plugins#spell-check-plugin)). For instance, when you type **javescript** or **developr**, it will be highlighted as an misspelled word. Hovering over it will give you the option of adding that word to the dictionary.
* `tooltipPluginConfig`: Displays tooltips when terms you've specified are detected ([learn more](#/widgets/data-entry/rich-text-editor/pre-built-plugins#tooltip-plugin)). In this example, **example** is a matched word which renders a tooltip when hovering over it.

For convenient debugging, we also provide the **Tree View Plugin** to visualize the editor’s internal node tree in real time. To play around with it, simply check the **Enable Tree View Plugin** option below.

Enable Tree View Plugin

*info*

Editor with HTML Output

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

As you make changes to the editor's content, the HTML output will appear below.

*code**center\_focus\_weak**bug\_report*
