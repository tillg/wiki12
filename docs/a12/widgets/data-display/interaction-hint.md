---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-display/interaction-hint
widget: data-display/interaction-hint
scraped: 2026-06-12
---

# Widgets/Data display/Interaction hint

Interaction Hint

The **Interaction Hint** is designed to enhance the accessibility and usability of interactive elements for users who rely on keyboard controls or screen readers. Its primary purpose is to provide immediate, clear, and contextual information about the functionality of buttons, links, and other interactive elements through the `title` attribute. This ensures that all users, regardless of their input method, can easily understand the purpose and action of each element.

The `InteractionHintConfigProvider` centralizes settings that control the behavior of Interaction Hint through the `enableInteractionHint` configuration.
By default, the hint is deactivated in all interactive elements. If needed, this behavior can be enabled for interactive elements by setting `enableInteractionHint = true`. This ensures that when users interact with elements via keyboard navigation, hovering, or tabbing, the default browser tooltip is suppressed, preventing redundancy and improving compatibility with assistive technologies.

Basic

This example showcases how the **Interaction Hint** can effectively replace the traditional `title` attribute for an interactive element. When the element is hovered over or focused on, the hint appears, offering users clear and accessible information about its purpose and function.

For accessibility purposes, the value of the `title` attribute is transferred to the `aria-label`. This ensures that screen readers announce both the content of the element and the interaction hint, providing a more complete user experience.

Warning

*warning*

**NOTE**

**Interaction Hint** is only recommended for interactive elements, such as buttons, links or element with `role="button"` or `role="link"`.

*edit*

*code**center\_focus\_weak**bug\_report*

Type

There are four Interaction Hint types besides the default: `info`, `success`, `warning`, and `error`. You can change it by setting `variant` property.

Info Hint:*info*

Success Hint:*check\_circle*

Warning Hint:*warning*

Error Hint:*error*

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

Types

* `InteractionHintComponentConfig = undefined`
* `InteractionHintComponentConfigMap = undefined`
* `InteractionHintComponentKey = undefined`
* `InteractionHintConfig = InteractionHintVerticalConfig`
* `InteractionHintPosition = "left" | "right"`

InteractionHintBaseConfig

Property

Type

Description

`enabled`

`boolean`

Enable or disable interaction hint for this specific component instance.

**@default** false

`followCursor`

`boolean`

Enable or disable interaction hint for this specific component instance.
No effects when the hint is disabled.

**@default** false

`hideArrow`

`boolean`

When enabled, the hint will follow the cursor during hover instead of being anchored to the element.
No effects when the hint is disabled.

**@default** false

InteractionHintBehavior

Property

Type

Description

`followCursor`

`boolean`

Enable or disable interaction hint for this specific component instance.
No effects when the hint is disabled.

**@default** false

`hideArrow`

`boolean`

When enabled, the hint will follow the cursor during hover instead of being anchored to the element.
No effects when the hint is disabled.

**@default** false

InteractionHintProps

Property

Type

Description

`className`

`string`

Additional css class names.

`focusable`

`boolean`

Specifies whether the reference element is focusable.

**@default** true

`followCursor`

`boolean`

Enable or disable interaction hint for this specific component instance.
No effects when the hint is disabled.

**@default** false

`hideArrow`

`boolean`

When enabled, the hint will follow the cursor during hover instead of being anchored to the element.
No effects when the hint is disabled.

**@default** false

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`position`

`InteractionHintPosition`

Position of the hint relative to the reference element.

`referenceElementRef*`

`RefObject<HTMLElement | "null">`

The trigger element that has the provided title.

`style`

`CSSProperties`

Additional styles.

`title`

`ReactNode`

The title of the element

`variant`

`"error" | "warning" | "success" | "hint"`

Variant of the interaction hint.

**@default** undefined

InteractionHintVerticalConfig

Property

Type

Description

`enabled`

`boolean`

Enable or disable interaction hint for this specific component instance.

**@default** false

`followCursor`

`boolean`

Enable or disable interaction hint for this specific component instance.
No effects when the hint is disabled.

**@default** false

`hideArrow`

`boolean`

When enabled, the hint will follow the cursor during hover instead of being anchored to the element.
No effects when the hint is disabled.

**@default** false

`position`

`InteractionHintPosition`

Position of the hint relative to the reference element.
Used by list-based components (e.g., accordion, flyout menu, sliding menu)
to align the hint without covering the element's text content.

Theming configuration

The following theme variables can be used to customize the component:

```
1"interactionHint": {
2    "containerMaxWidth": "472px",
3    "margin": "0 16px",
4    "arrow": {
5        "background": "#fff",
6        "border": "2px solid #d50075",
7        "boxShadow": "2px 2px 2px 0 rgba(22,25,29,0.4)",
8        "size": 12
9    },
10    "border": "1px solid  #d50075",
11    "content": {
12        "background": "#fff",
13        "textColor": "#333",
14        "border": "2px solid #d50075",
15        "borderRadius": "2px",
16        "boxShadow": "1px 2px 2px 0 rgba(22,25,29,0.4)",
17        "fontFamily": "\"Open Sans\", sans-serif",
18        "fontSize": "0.75rem",
19        "padding": "4px 8px"
20    },
21    "iconFontSize": "1.25rem",
22    "variants": {
23        "hint": {
24            "background": "#fff",
25            "color": "#0277bd",
26            "contentColor": "#333"
27        },
28        "success": {
29            "background": "#fff",
30            "color": "#2e7d32",
31            "contentColor": "#333"
32        },
33        "warning": {
34            "background": "#fef6db",
35            "color": "#fcce34",
36            "contentColor": "#16191d"
37        },
38        "error": {
39            "background": "#fbeaea",
40            "color": "#c62828"
41        }
42    },
43    "color": "#0277bd"
44}
```

*content\_copy*
