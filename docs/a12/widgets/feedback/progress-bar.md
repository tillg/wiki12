---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/feedback/progress-bar
widget: feedback/progress-bar
scraped: 2026-06-12
---

# Widgets/Feedback/Progress bar

Progress Bar

The **Progress Bar** Widget is a graphical control element used to visualize the progression of an operation.

Progress Bar

The `percentage` property defines the width of the **Progress Bar**. When you pass a number that represents the progressed percentage to the `percentage` property, a running bar with the default background-color inherited from the wrapper element will be shown.

If the wrapper element does not have a background, the **Progress Bar** will have its own color (default is `colors.interaction.disabled.colorLight`).

In addition, see more examples of how the **Progress Bar** works with another Widget in the [Button](#/widgets/general/buttons/button#with-progress-bar) or [List](#/widgets/data-display/list#item-with-progress-bar)

Show Progress Bar

With Background:

No Background:

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

ProgressBarProps

Property

Type

Description

`className`

`string`

Additional css class names.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`percentage*`

`number`

Progressed percentage of the process

`style`

`CSSProperties`

Additional styles.

Theming configuration

The following theme variables can be used to customize the component:

```
1"progressBar": {
2    "background": "#f1f2f4",
3    "bufferBG": "#e2e6e9",
4    "fillBG": "inherit",
5    "transition": "width 1s ease-out"
6}
```

*content\_copy*
