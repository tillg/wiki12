---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-display/card
widget: data-display/card
scraped: 2026-06-12
---

# Widgets/Data display/Card

Card

The **Card** Widget is a component that is designed to display content and actions for a single topic.

They should be easy to scan for relevant and actionable information. Elements, like texts and images, should be placed on them in a way that clearly indicates hierarchy.

Basic

Card layouts can vary to support the types of content they contain. The following elements are commonly found among that variety.

* `Card` hold all card elements, and their size is determined by the space those elements occupy. Card elevation is expressed by the container.
* `Card.Media` includes an image to reinforce the content.
* `Card.Content` supports a wide variety of content, including text, action buttons, links, and more.

**Height range:** min: 60px, max: 300px

![Kiwi](images/DF757_01-001.png)

Lorem ipsum amet esse veniam dolore in elit id proident reprehenderit

Action 1Action 2

*code**center\_focus\_weak**bug\_report*

Primary Action

Often a card allow users to interact with the entirety of its surface to trigger its main action, be it an expansion, a link to another screen or some other behavior. The action area of the card can be specified by wrapping its contents in a `Card.ActionArea` component.

Besides, a card can also offer supplemental actions which should stand detached from the main action area in order to avoid event overlap, such as wrapping a `Card.Media` in a `Card.ActionArea` component.

![Kiwi](images/DF757_01-001.png)

Lorem ipsum amet esse veniam dolore in elit id proident reprehenderit

Action 1Action 2

*favoriteFavorite*[*shareShare*](#/examples/gallery "Share")

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

CardProps.ActionAreaProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`style`

`CSSProperties`

Additional styles.

`useLinkRole`

`boolean`

This property is used to add role="link" to Card to support accessibility.

**@deprecated** from 35.0.0, the role="link" attribute will be defined inside widget.

**@default** true

`onClick`

`(event: MouseEvent<HTMLElement>) => void`

Click handler for ActionArea.

**@param** event – HTML mouse event.

`onKeyDown`

`(event: KeyboardEvent<HTMLElement>) => void`

Key down handler for ActionArea.

**@param** event – HTML key event.

CardProps.ContentProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`style`

`CSSProperties`

Additional styles.

CardProps.MediaProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`style`

`CSSProperties`

Additional styles.

CardProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`style`

`CSSProperties`

Additional styles.

Theming configuration

The following theme variables can be used to customize the component:

```
1"card": {
2    "childMargin": "4px 4px 0",
3    "firstChildMargin": "0 0 4px 0",
4    "media": {
5        "backgroundColor": "#f7fafc",
6        "maxHeight": "300px",
7        "minHeight": "52px",
8        "padding": "4px 4px"
9    },
10    "actionArea": {
11        "activeBorder": "2px solid #00589f",
12        "focusBorder": "2px solid #d50075",
13        "focusBoxShadow": "none",
14        "hoverBorder": "2px solid #00589f"
15    },
16    "content": {
17        "fontFamily": "\"Open Sans\", sans-serif",
18        "fontSize": "0.75rem"
19    }
20}
```

*content\_copy*
