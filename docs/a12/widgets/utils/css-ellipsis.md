---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/utils/css-ellipsis
widget: utils/css-ellipsis
scraped: 2026-06-12
---

# Widgets/Utils/Css ellipsis

CSS Ellipsis

The `CSS Ellipsis` widget is the A12 solution for truncating long texts. It uses `-webkit-line-clamp` to create the ellipsis, and it can automatically calculate the number of rows to clamp. The full content will be shown in a title attribute on hover by default, and it can also be customized to use a tooltip.

Warning

*warning*

**NOTE**

**This CSS solution has many technical limitations on the content in order for it to be properly truncated:**

* There should be no margin/padding for the content. CSS Ellipsis will remove the padding/margin of its children.
* The content should have the same line height throughout.
* BulletList truncation doesn't work on Safari at the moment. If your list consists of short length items, consider converting it to a comma separated list instead.
* The parent element should have a fixed height.

Basic

A `maxLine` property is provided in case the number of lines to show is known. In the first example, only two lines will be shown.

If no `maxLine` is given, the truncation will be calculated based on the parent element's size. In the second example the parent element's height is set to 60px.

In either case, a title with the full text content will be displayed on hover.

**First example with maxLine set to 2.** The A12 widget library is part of the A12 Business Application Platform. Our A12 Widgets mission is to provide a wide range of web components that follow a consistent and attractive design and interaction concept (Plasma) to support business applications running on desktop, tablet and smart phone supporting keyboard, mouse and touch input. The components provide an easy to use, well documented, strongly typed API and are extendable and customizable. A12 Plasma is a design system mainly addressing business applications, by providing a better usage efficiency and predefined interaction patterns for common business use cases: A12 Plasma.

**Second example with auto calculating ellipsis based on height.** The A12 widget library is part of the A12 Business Application Platform. Our A12 Widgets mission is to provide a wide range of web components that follow a consistent and attractive design and interaction concept (Plasma) to support business applications running on desktop, tablet and smart phone supporting keyboard, mouse and touch input. The components provide an easy to use, well documented, strongly typed API and are extendable and customizable. A12 Plasma is a design system mainly addressing business applications, by providing a better usage efficiency and predefined interaction patterns for common business use cases: A12 Plasma.

*code**center\_focus\_weak**bug\_report*

Ellipsis With Tooltip

Instead of showing the title on hover, a tooltip can be shown by setting `useTooltip` to true.

The `hint` variant is set by default, but if you'd like to customize the tooltip's appearance you can instead pass `success`, `warning` or `error` to the`tooltipVariant` property.

**Default (hint) tooltip**

The A12 widget library is part of the A12 Business Application Platform. Our A12 Widgets mission is to provide a wide range of web components that follow a consistent and attractive design and interaction concept (Plasma) to support business applications running on desktop, tablet and smart phone supporting keyboard, mouse and touch input. The components provide an easy to use, well documented, strongly typed API and are extendable and customizable. A12 Plasma is a design system mainly addressing business applications, by providing a better usage efficiency and predefined interaction patterns for common business use cases: A12 Plasma.

**Success tooltip**

The A12 widget library is part of the A12 Business Application Platform. Our A12 Widgets mission is to provide a wide range of web components that follow a consistent and attractive design and interaction concept (Plasma) to support business applications running on desktop, tablet and smart phone supporting keyboard, mouse and touch input. The components provide an easy to use, well documented, strongly typed API and are extendable and customizable. A12 Plasma is a design system mainly addressing business applications, by providing a better usage efficiency and predefined interaction patterns for common business use cases: A12 Plasma.

**Warning tooltip**

The A12 widget library is part of the A12 Business Application Platform. Our A12 Widgets mission is to provide a wide range of web components that follow a consistent and attractive design and interaction concept (Plasma) to support business applications running on desktop, tablet and smart phone supporting keyboard, mouse and touch input. The components provide an easy to use, well documented, strongly typed API and are extendable and customizable. A12 Plasma is a design system mainly addressing business applications, by providing a better usage efficiency and predefined interaction patterns for common business use cases: A12 Plasma.

**Error tooltip**

The A12 widget library is part of the A12 Business Application Platform. Our A12 Widgets mission is to provide a wide range of web components that follow a consistent and attractive design and interaction concept (Plasma) to support business applications running on desktop, tablet and smart phone supporting keyboard, mouse and touch input. The components provide an easy to use, well documented, strongly typed API and are extendable and customizable. A12 Plasma is a design system mainly addressing business applications, by providing a better usage efficiency and predefined interaction patterns for common business use cases: A12 Plasma.

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

CssEllipsisProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`domProps`

`HTMLProps<HTMLDivElement>`

Additional props that will be passed to the DOM Element.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`maxLine`

`number`

Maximum number of line to show.
If not specify, it will be calculated automatically. For calculation to work correct, the parent element height
need to be fixed, e.g. not changing when its content grow.

`style`

`CSSProperties`

Additional styles.

`tooltipVariant`

`"error" | "warning" | "success" | "hint"`

Define type of the tooltip.

**@default** hint

`useTooltip`

`boolean`

If true, a tooltip will be displayed on hover, rendering the same HTML markup that is passed in.

Theming configuration

This component has no theme configuration (yet).
