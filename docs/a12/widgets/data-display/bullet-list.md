---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-display/bullet-list
widget: data-display/bullet-list
scraped: 2026-06-12
---

# Widgets/Data display/Bullet list/Ordered list

Ordered List

The **BulletList.Ordered** Widget defines a list of items defined using the **BulletList.Item** element in which the order of the items matters. The ordering is shown by a numbering scheme, using Arabic numbers, letters, roman numerals, etc.

Default

1. Lorem ipsum
2. Duis aute irure dolor in reprehenderit
3. Excepteur sint occaecat
4. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident
5. Ut enim ad minim veniam

*code**center\_focus\_weak**bug\_report*

Types

There are four Ordered List types besides the default: `decimal-leading-zero`, `lower-roman`, `upper-roman`, and `lower-alpha`. You can change it by setting the `type` property.

1. Lorem ipsum
2. Duis aute irure dolor in reprehenderit
3. Excepteur sint occaecat

1. Lorem ipsum
2. Duis aute irure dolor in reprehenderit
3. Excepteur sint occaecat

1. Lorem ipsum
2. Duis aute irure dolor in reprehenderit
3. Excepteur sint occaecat

1. Lorem ipsum
2. Duis aute irure dolor in reprehenderit
3. Excepteur sint occaecat

*code**center\_focus\_weak**bug\_report*

Inline

You can set the `inline` property to `true` to display the list in one line.

1. Lorem ipsum
2. Duis aute irure dolor in reprehenderit
3. Excepteur sint occaecat

1. Lorem ipsum
2. Duis aute irure dolor in reprehenderit
3. Excepteur sint occaecat
4. Lorem ipsum
5. Duis aute irure dolor in reprehenderit

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* This API section only displays some of the most remarkable properties of the **Ordered List** widget. To find a full set of properties, please make use of an IDE to explore the Widget's source code.
* `prop*` is required.
* `prop` is deprecated.

Types

* `BulletListProps.OrderedType = "decimal" | "decimal-leading-zero" | "lower-roman" | "upper-roman" | "lower-alpha"`

BulletListProps.ItemProps

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

BulletListProps.OrderedProps

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

`inline`

`boolean`

Whether display list inline or not.

**@default** false

`style`

`CSSProperties`

Additional styles.

`type`

`OrderedType`

List item's type.

**@default** decimal

`wrapperRef`

`RefCallback<HTMLOListElement>`

The reference of the element wrapping the main content if one exists.

Theming configuration

The following theme variables can be used to customize the component:

```
1"bulletList": {
2    "columnGap": "20px",
3    "padding": "0 0 0 32px",
4    "fontFamily": "\"Open Sans\", sans-serif",
5    "fontSize": "0.75rem",
6    "content": {
7        "color": "#333",
8        "lineHeight": "24px"
9    },
10    "item": {
11        "color": "#616f7c",
12        "fontWeight": 600,
13        "lineHeight": 1.2,
14        "padding": "0 4px 2px 0",
15        "overrideColor": "#7F8C9B"
16    },
17    "unorderedList": {
18        "noIndentPadding": "0 0 0 16px"
19    }
20}
```

*content\_copy*
