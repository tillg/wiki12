---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-entry/rich-text-editor/plugin-creation
widget: data-entry/rich-text-editor/plugin-creation
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

Lexical

The Widget Rich Text Editor was built on top of [Lexical*open\_in\_new*](https://lexical.dev/ "Leave Page"). To create customized features you'll need to understand core Lexical concepts such as [Editor State*open\_in\_new*](https://lexical.dev/docs/concepts/editor-state "Leave Page"), and [Nodes*open\_in\_new*](https://lexical.dev/docs/concepts/nodes "Leave Page"). For that reason, we recommend perusing the [Lexical Docs*open\_in\_new*](https://lexical.dev/docs/intro "Leave Page").

Creating Plugins

Nodes and plugins can be used to add customized features to the Widgets `DefaultRichTextEditor` and/or `RichTextEditor`.

At their core, Lexical Plugins are just React Components. If you're already comfortable with Lexical and are just looking for how to create Lexical plugins using React, we recommend taking a look at [this guide*open\_in\_new*](https://lexical.dev/docs/react/create_plugin "Leave Page").

Otherwise, we recommend taking some time to familiarize yourself with the following concepts before getting started:

* [Nodes*open\_in\_new*](https://lexical.dev/docs/concepts/nodes "Leave Page")
* [Node Overrides*open\_in\_new*](https://lexical.dev/docs/concepts/node-replacement "Leave Page")
* [Node Transforms*open\_in\_new*](https://lexical.dev/docs/concepts/transforms "Leave Page")
* [Listeners*open\_in\_new*](https://lexical.dev/docs/concepts/listeners "Leave Page")
* [Commands*open\_in\_new*](https://lexical.dev/docs/concepts/commands "Leave Page")
* [DOM Events*open\_in\_new*](https://lexical.dev/docs/concepts/dom-events "Leave Page")

Hyphen to En Dash Plugin

This plugin converts hyphens to en dashes.

Type a single hyphen (-) between 2 words to convert it to an en dash (–)

*code**center\_focus\_weak**bug\_report*

Text Color Changer Plugin

This plugin utilizes `decorators` (a type of node) to change the color of selected text within the editor. Decorators allow you to build complex features by using custom React components within the editor.

While decorators can be used to build features by outputting components from JavaScript, React, and other frameworks, for most simple features such as bolding or changing the color of text, we would recommend using the [Static Toolbar](#/widgets/data-entry/rich-text-editor/pre-built-plugins#static-toolbar-plugin) instead.

Warning

*warning*

**NOTE**

This is a simplified example that’s only meant to demonstrate how you’d you implement a custom feature using decorators. For that reason, some edge cases such as trying to undo actions using **ctrl/cmd + z** or changing the selected text may result in unexpected behaviors.

* *color\_lens*

Type some text, select it, and click the button in the toolbar to make it red!

*code**center\_focus\_weak**bug\_report*
