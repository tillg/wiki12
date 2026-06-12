---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/utils/typography
widget: utils/typography
scraped: 2026-06-12
---

# Widgets/Utils/Typography

Typography

The **Typography** Widget provides a way to define headers without using `h-tags`.

Setting the `level` for a given `Typography.Headline`, will apply appropriate styles to it. The `Typography.Headline` has **5 levels**, from 1 to 5.

There is also `ariaLevel` for accessibility, which can be set independently of the level used for styling purposes.

In addition, The **Typography** widget provides a `Typography.Section` which can be used to contain anything you'd like.

Basic

To display additional information after the headline, you can use the `info` property.

You can set the `divider` property to true to have a divider appear under each `Typography.Headline`.

Error

**

**ATTENTION**

Dividers won't appear if you're using the Flat Compact theme, regardless of whether the `divider` property is set to true.

Headline 1 with Divider

Headline 2 with Divider

- Additional data

Headline 3 with Divider

Headline 4 without Divider

Headline 5 without Divider

- Additional data

*code**center\_focus\_weak**bug\_report*

Custom

You can use the `htmlTag` property to override the default `div` tag used in `Typography.Headline`

The `addons` property allows for additional customization via displaying actions or other information at the end of the headline.

It’s also possible to build a collapsible headline using the `collapsible` & `collapsed` properties (and optionally `collapseIcon` & `expandIcon`).

If you do make your headline collapsible, it’s recommended to wrap any content below the headline inside of a `Typography.Body` element to help ensure the content maintains a consistent appearance.

# Headline 1 using h1 tag *public*Selected EN*arrow\_drop\_down*

Headline 2 using section tag

*public*Selected EN*arrow\_drop\_down*

*keyboard\_arrow\_right*

Collapsible Headline 3

*public*Selected EN*arrow\_drop\_down*

*add*

Collapsible Headline 4

- With custom collapse/expand icons

*public*Selected EN*arrow\_drop\_down*

Headline 5 with long title lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua

*public*Selected EN*arrow\_drop\_down*

*code**center\_focus\_weak**bug\_report*

Addons Position

You can set the property `swapAddonsPosition` to swap the positions of the addons and graphic icon (collapse or expand icon).

Furthermore, the property `iconVerticalAlignment` can be used to position the addons and collapse icon to `top`, `middle`, or `bottom` of the panel.

*home\_work*

**Collapsible Headline officia dolore eu**

*200$ Collapsible Headline est**1265,30$ Collapsible Headline Lorem aute velit incididunt*

*keyboard\_arrow\_right*

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

Types

* `BodyProps = BaseTypographyProps`
* `HeadlineTitleProps = Identifiable & Ref`
* `IconVerticalAlignment = "top" | "middle" | "bottom"`

BaseTypographyProps

Property

Type

Description

`alignment`

`"right" | "left" | "center"`

Specifies whether the typography has an alignment.

**@default** "left"

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`color`

`string`

Specifies whether the typography has a inline color

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`style`

`CSSProperties`

Additional styles.

HeadlineProps

Property

Type

Description

`addons`

`ReactNode`

Displays actions or other information after the headline.

`alignment`

`"right" | "left" | "center"`

Specifies whether the typography has an alignment.

**@default** "left"

`ariaLevel`

`number`

Aria level used for accessibility.

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`collapsed`

`boolean`

Specifies whether the collapsible typography is collapsed.

`collapseIcon`

`ReactNode`

Default icon for collapsing for the typography.

**@default** `keyboard_arrow_down`

`collapsible`

`boolean`

Specifies whether the typography is collapsible.

`color`

`string`

Specifies whether the typography has a inline color

`divider`

`boolean`

Specifies whether the typography has a divider.

`expandIcon`

`ReactNode`

Default icon for expanding for the typography.

**@default** `keyboard_arrow_right`

`htmlTag`

`string`

Define specific HTML tag for the headline

**@default** "div"

**Note:** Since every element inside this HTML tag is "div", htmlTag should be a block element, otherwise there'll be a syntax error.

`iconVerticalAlignment`

`IconVerticalAlignment`

Specifies where the `addons` and graphic icon ( `expandIcon` or `collapseIcon` ) will be positioned vertically.

**@default** "top"

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`info`

`ReactNode`

Displays additional information after the headline.

`level*`

`"1" | "2" | "3" | "4" | "5"`

Level of the headline. Used for styling purpose only. This mean you can use an h6 and make it looks like an h1.

`style`

`CSSProperties`

Additional styles.

`swapAddonsPosition`

`boolean`

Whether the position of `addons` will be swapped with graphic icon ( `expandIcon` or `collapseIcon` ).

`titleProps`

`HeadlineTitleProps`

Used to offer additional functionality such as ids or refs.

`onCollapsingChange`

`(event: SyntheticEvent) => void`

Handler for when toggling the collapsed state.

SectionProps

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

`role`

`string`

Aria-role for the section

`style`

`CSSProperties`

Additional styles.

Theming configuration

The following theme variables can be used to customize the component:

```
1"typography": {
2    "wrapper": {
3        "minHeight": "32px",
4        "padding": "2px 0"
5    },
6    "graphic": {
7        "left": "10px",
8        "margin": "0 4px 0 0",
9        "iconSize": "1.5rem",
10        "iconBG": "#f7fafc",
11        "fontSize": "1.125rem"
12    },
13    "title": {
14        "padding": "0 8px 0 0"
15    },
16    "info": {
17        "fontWeight": 400
18    },
19    "addons": {
20        "minHeight": "32px"
21    },
22    "addon": {
23        "margin": "0 8px 0 0"
24    },
25    "section": {
26        "padding": "0px",
27        "margin": "0px",
28        "width": "100%"
29    },
30    "collapsible": {
31        "activeBG": "#00589f",
32        "activeColor": "#fff",
33        "focusBG": "#d50075",
34        "focusBorder": "1px dotted #fff",
35        "focusColor": "#fff",
36        "hoverBG": "#00589f",
37        "hoverColor": "#fff"
38    },
39    "body": {
40        "color": "#333",
41        "margin": "0 0 16px 0"
42    },
43    "headline1": {
44        "borderTop": "1px dotted #e2e6e9",
45        "wrapperBG": "transparent",
46        "font": "\"Open Sans\", sans-serif",
47        "fontWeight": 400,
48        "margin": "8px 0 0",
49        "padding": "0 0 8px 0",
50        "textTransform": "unset",
51        "color": "#21252c",
52        "fontSize": "2rem",
53        "height": "48px"
54    },
55    "headline2": {
56        "borderTop": "1px dotted #e2e6e9",
57        "wrapperBG": "transparent",
58        "font": "\"Open Sans\", sans-serif",
59        "fontWeight": 400,
60        "margin": "8px 0 0",
61        "padding": "0 0 8px 0",
62        "textTransform": "unset",
63        "color": "#2c323a",
64        "fontSize": "1.5rem",
65        "height": "36px"
66    },
67    "headline3": {
68        "borderTop": "1px dotted #e2e6e9",
69        "wrapperBG": "transparent",
70        "font": "\"Open Sans\", sans-serif",
71        "fontWeight": 400,
72        "margin": "8px 0 0",
73        "padding": "0 0 8px 0",
74        "textTransform": "unset",
75        "color": "#373e49",
76        "fontSize": "1.275rem",
77        "height": "28px"
78    },
79    "headline4": {
80        "borderTop": "1px dotted #e2e6e9",
81        "wrapperBG": "transparent",
82        "font": "\"Open Sans\", sans-serif",
83        "fontWeight": 400,
84        "margin": "8px 0 0",
85        "padding": "0 0 8px 0",
86        "textTransform": "unset",
87        "color": "#424b57",
88        "fontSize": "1.125rem",
89        "height": "24px"
90    },
91    "headline5": {
92        "borderTop": "1px dotted #e2e6e9",
93        "wrapperBG": "transparent",
94        "font": "\"Open Sans\", sans-serif",
95        "fontWeight": 400,
96        "margin": "8px 0 0",
97        "padding": "0 0 8px 0",
98        "textTransform": "unset",
99        "color": "#4d5766",
100        "fontSize": "1rem",
101        "height": "22px"
102    }
103}
```

*content\_copy*
