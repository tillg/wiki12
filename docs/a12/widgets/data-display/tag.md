---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-display/tag
widget: data-display/tag
scraped: 2026-06-12
---

# Widgets/Data display/Tag

Tag

The **Tag** Widget is a component that is designed for items that need to be labeled, categorized, or organized using keywords that describe them.

Basic

The **Tag** Widget could contain anything such as text, link, icon and more. This is done by setting the `children` property within the **Tag**. To group tags with a gap between each tag, those tags need to be wrapped inside the **TagGroup**.

In addition, you can customize the tag's content. In this example, we pass the **div** element and apply a red color style to the text.

Tag

[Tag linked with a long link](https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-display/tag)

Tag with really long text. velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt minim culpa cillum excepteur

Tag with a div

Tag with an Icon *delete*

*code**center\_focus\_weak**bug\_report*

Extended Tag

Besides the basic one, the appearance of a **Tag** can be extended by using the `icon` and `color` properties.

*touch\_app*

Touch

*keyboard*

Steam Punk Gaming Mechanical Keyboard Round Retro Keycap Backlit Wired Keyboards

*mouse*

Mouse

*phone\_android*

Android phone

BlackBerry phone

*phone\_iphone*

iOS phone

Windows phone

Linux desktop

*desktop\_mac*

macOS desktop

*desktop\_windows*

Windows desktop

*code**center\_focus\_weak**bug\_report*

Removable Tag

You can create a removable **Tag** by setting the `removable` property to true. When the remove button is active, clicking it will trigger the event defined by the `onRemove` property.
To disable the remove button, set the `disabledRemoveButton` property to true.

Warning

*warning*

**NOTE**

To fully support accessibility, each **Tag** should have its own `id`. It will be used to generate IDs for inner elements; such as the name, remove button, etc. These IDs will be linked to the **aria-labelledby** attribute, allowing screen readers to provide complete information to users.

HP Envy x360 13

*close*Remove tag

*laptop*

Lenovo Yoga 9i

*close*Remove tag

*laptop*

Dell XPS 17 9720

*close*Remove tag

*laptop*

Lenovo IdeaPad Flex 5 2-in-1 Chromebook

*close*Remove tag

MacBook Pro 2022

*close*Remove tag

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

TagProps

Property

Type

Description

`children*`

`ReactNode`

The content of tag.

`className`

`string`

Additional css class names.

`color`

`string`

Color for tag.

`disabledRemoveButton`

`boolean`

Disable remove button in removable tag.

`icon`

`ReactNode`

Icon for tag.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`noWaiAria`

`boolean`

If set to true, will exclude the wai-aria attributes from Tag, so screen reader can not reach the Tag.

`removable`

`boolean`

The close button will be displayed.

`style`

`CSSProperties`

Additional styles.

`tabIndex`

`number`

TabIndex for tag and remove button.

`wrapperRef`

`RefCallback<HTMLDivElement>`

The reference of the element wrapping the main content if one exists.

`onClick`

`(event: MouseEvent<HTMLElement>) => void`

Triggered when clicking on Tag.

`onKeyDown`

`(event: KeyboardEvent<HTMLElement>) => void`

Key down handler for Tag.

**@param** event – HTML key event.

`onMouseDown`

`(key: string, event: MouseEvent<HTMLElement>) => void`

Triggered when interact by mouse.

`onRemove`

`void`

Fire when the remove button is clicked.

**Note:** Only works if `removable` is set to true.

Theming configuration

The following theme variables can be used to customize the component:

```
1"tag": {
2    "backgroundColor": "#fff",
3    "borderRadius": "0.75rem",
4    "content": {
5        "border": "1px solid #a9b3bc",
6        "color": {
7            "default": "#333",
8            "focus": "#d50075",
9            "hover": "#00589f",
10            "active": "#00589f"
11        },
12        "focusBorderColor": "#d50075",
13        "fontFamily": "\"Open Sans\", sans-serif",
14        "fontSize": "0.75rem",
15        "lineHeight": "1rem",
16        "padding": "3px 8px",
17        "linkColor": "#00589f"
18    },
19    "exitTransition": {
20        "margin": "0 0 8px 2px",
21        "duration": "0.2s"
22    },
23    "group": {
24        "margin": "0 8px 8px 0"
25    },
26    "icon": {
27        "backgroundColor": "#b7c0c7",
28        "color": "#fff",
29        "size": "24px",
30        "fontSize": "0.875rem",
31        "contentPaddingLeft": "28px"
32    },
33    "minHeight": "24px",
34    "removable": {
35        "contentPaddingRight": "28px",
36        "closeButton": {
37            "fontSize": "0.875rem",
38            "size": "24px",
39            "padding": "0 4px"
40        }
41    }
42}
```

*content\_copy*
