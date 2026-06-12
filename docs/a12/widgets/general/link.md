---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/general/link
widget: general/link
scraped: 2026-06-12
---

# Widgets/General/Link

Link

The **Link** Widget represents the primary way to allow users to navigate around your application, by rendering a fully accessible anchor tag with the proper href.

Basic

If a link does not need to be strongly visible, then the helper class for a regular font weight can be used. In addition, you can put an icon within a link to indicate what type of link it is. If you need to set values for the anchor tag used internally by the `Link` widget, you can do so using the `linkAttributes` property.

Warning

*warning*

**NOTE**

Besides navigating to an href, a **Link** can trigger an interactive event through the `onClick` property.
To enhance accessibility semantics, it is recommended to set the `useAsButton` to true. This will add a `role="button"` to the link and allowing the event to be triggered by the Enter or Spacebar.
For more details, please refer to the [Combination Toast](#/widgets/feedback/toasts/toast#combination).

[basic link](https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/general/link)

[link with regular font weight](https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/general/link)

[*check\_circle* link with icon](#)

*code**center\_focus\_weak**bug\_report*

External Link

An `ExternalLink` will have a default `target` attribute of `_blank`, that points to a target page on another domain from the domain it's published on.

[External Link*open\_in\_new*](https://example.com "Leave Page")

*code**center\_focus\_weak**bug\_report*

Mailto Link

A `MailtoLink` receives an email address via the `to` property instead of `href`.

[*email*Karl Karlsen](mailto:example@gmail.com "E-mail")

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

LinkProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`href`

`string`

Specifies the linked document, resource, or location.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`linkAttributes`

`AnchorHTMLAttributes<HTMLAnchorElement>`

Additional props that will be placed at the real link (anchor) attributes element.
It should be used in case the user want to access to native DOM properties of the original link element but there's no property allows to do that.
For instance, `linkAttributes={{ "aria-disabled": true}}`

`style`

`CSSProperties`

Additional styles.

`target`

`string`

Specifies where to open the linked document.

`title`

`string`

Title of the link.

`useAsButton`

`boolean`

To support accessibility, the link should have better semantics if it triggers an interactive function rather than navigating to an `href` .
If set to true, a `role="button"` will be added and the link can be used as a button.

`wrapperRef`

`RefCallback<HTMLAnchorElement>`

The reference of the element wrapping the main content if one exists.

`onClick`

`(event: MouseEvent<HTMLAnchorElement>) => void`

Handle event when click on the link.

Theming configuration

The following theme variables can be used to customize the component:

```
1"link": {
2    "backgroundSize": "calc(100% - 1px) calc(0.1 * 1rem)",
3    "color": "#00589f",
4    "visitedColor": "#00589f",
5    "fontFamily": "\"Open Sans\", sans-serif",
6    "fontSize": "0.75rem",
7    "fontWeight": 700,
8    "icon": {
9        "fontSize": "0.75rem",
10        "verticalAlign": "-2px",
11        "margin": "0 1px"
12    },
13    "transitionTiming": "0.3s",
14    "active": {
15        "backgroundImage": {
16            "backgroundColor": "#00589f",
17            "backgroundImage": "linear-gradient(#00589f, #00589f)"
18        },
19        "color": "#00589f",
20        "textDecoration": "none"
21    },
22    "hover": {
23        "backgroundImage": {
24            "backgroundColor": "#00589f",
25            "backgroundImage": "linear-gradient(#00589f, #00589f)"
26        },
27        "color": "#00589f",
28        "textDecoration": "none"
29    },
30    "focus": {
31        "backgroundImage": {
32            "backgroundColor": "#d50075",
33            "backgroundImage": "linear-gradient(#d50075, #d50075)"
34        },
35        "color": "#d50075",
36        "outline": "1px dotted #00589f",
37        "textDecoration": "none"
38    }
39}
```

*content\_copy*
