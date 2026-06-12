---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/experimental/supporting-panes-layout
widget: experimental/supporting-panes-layout
scraped: 2026-06-12
---

# Experimental/Supporting panes layout

Supporting Panes Layout

The **Supporting Panes Layout (SPL)** widgets divides content horizontally into *primary* and *secondary* panes:

* The **primary pane**, which takes up most of the body area, contains the main content.
* The **secondary (supporting) pane** provides additional supporting content to enhance context and understanding. This may include additional information, related data, contextual actions, and children in a parent-child relationship.

The **SPL** can be nested within itself or combined with other widgets, allowing for complex, multi-level designs.

Basic

We provide a set of components `SupportingPanesLayoutComponents` to build a Supporting Panes Layout.

* `SupportingPanesLayout` is a base container that wraps the primary and secondary panes.
* `PrimaryPane` element to contain the main content that should always be presented. Its width is flexible based on the available space.
* `SecondaryPane` element to define supporting content. The pane is resizable, and can be collapsed or expanded. There are certain properties that are helpful to control its behaviors:
  + `position`: Whether it will be displayed to the left or right side of the main content.
  + `widthConfig`: The pane's width can be altered when it is expanded or collapsed. By default, the pane will take up 25% of the entire layout.
  + `collapsed`: The collapse/expand state can be controlled externally with this. For example, by clicking a button.
  + `resizeOptions`: To enable the resize behavior, you have to define `minWidth` and `maxWidth` via this configuration.
  + `hide`: Whether the pane should be hidden or not.

If both `minWidth` and `widthConfig.collapsed` are specified for the **resize** behavior, the supporting pane will shrink until it reaches the minimum width, then jump back to the collapsed state.

Hovering over the gap between the supporting pane and primary pane will show the resize handle that you can drag, then the width of the pane will be gradually adjusted.

We also provide a feature that allows users to double-click the resize handler on the supporting pane to collapse, expand, or reset it to its default expanded width.

Secondary Pane

The Supporting Pane is a side panel that can be positioned either in front or behind the Primary Pane. It can contain anything that supports the interaction with the Primary Pane.

It could be a [Content Box](#/widgets/layout/content-box) with a [Menu](#/widgets/navigation/menu/flyout-menu#vertical-menu) or a **Form** here.

The pane will disappear if click the button below:

Hide Pane

*chevron\_left*

Primary Pane

The Primary Pane is where users can focus on and interact with the most important information. Regardless of whether the pane is standalone or with one or two supporting panes, it will take up the remaining free space.

You can display the amounts of data by putting a [Table](#/widgets/data-display/table), or [Tree Table](#/widgets/data-display/tree-table) here. Click a Table Row will probably open a detail form in the Supporting Pane.

Secondary Pane

The Supporting Pane is a side panel that can be positioned either in front or behind the Primary Pane. It can contain anything that supports the interaction with the Primary Pane.

It could be a [Content Box](#/widgets/layout/content-box) with a [Menu](#/widgets/navigation/menu/flyout-menu#vertical-menu) or a **Form** here.

The pane will disappear if click the button below:

Hide Pane

*chevron\_right*

*code**center\_focus\_weak**bug\_report*

Nested Layout

Another layout can be specified within the `PrimaryPane` to create multi-level design.

Secondary Pane

The A12 widget library is part of the A12 Business Application Platform. Our A12 Widgets mission is to provide a wide range of web components that follow a consistent and attractive design and interaction concept (Plasma) to support business applications running on desktop, tablet and smart phone supporting keyboard, mouse and touch input. The components provide an easy to use, well documented, strongly typed API and are extendable and customizable. A12 Plasma is a design system mainly addressing business applications, by providing a better usage efficiency and predefined interaction patterns for common business use cases: A12 Plasma.

*chevron\_left*

Nested Secondary Pane

Our A12 Widgets mission is to provide a wide range of web components that follow a consistent and attractive design and interaction concept (Plasma) to support business applications running on desktop, tablet and smart phone supporting keyboard, mouse and touch input. The components provide an easy to use, well documented, strongly typed API and are extendable and customizable.

*chevron\_left*

Nested Primary Pane

The A12 widget library is part of the A12 Business Application Platform.
Sit ut in ipsum tempor non dolor labore. Ex exercitation aute sit fugiat duis consectetur eu occaecat eiusmod sit.
Incididunt excepteur ullamco nisi velit amet laborum eiusmod amet consectetur sint dolore.
Minim pariatur consectetur sint pariatur amet ex sunt cupidatat nostrud nostrud quis nisi.
Aliquip Lorem magna voluptate voluptate cupidatat ex sit voluptate reprehenderit in proident.
Dolore tempor commodo eu deserunt aute occaecat in ipsum laborum magna officia aute nostrud consequat.
Officia elit ut nisi Lorem eu laboris reprehenderit ex aliqua enim voluptate. Excepteur in et aute incididunt elit.
Ipsum irure deserunt exercitation incididunt mollit officia non officia sunt do labore fugiat tempor ad.
Sunt cillum aliqua ex ad adipisicing. Reprehenderit id et labore laborum mollit.
Aliquip enim consequat anim in enim culpa nulla dolor amet in tempor.
Reprehenderit dolor irure proident mollit nostrud reprehenderit commodo.
Ipsum aliqua non commodo eiusmod ad in dolore consectetur amet.
Quis non officia occaecat cupidatat occaecat excepteur cupidatat exercitation dolore nostrud veniam irure adipisicing.
Exercitation pariatur irure consequat enim anim. Irure ea laboris sint consectetur.
Cillum irure et duis magna anim officia proident ex. Incididunt dolore eu esse aliquip duis dolore magna.
Duis minim laborum non excepteur officia exercitation sunt amet nostrud veniam excepteur.
Do elit minim commodo ea anim dolor laborum do sit laboris in quis.
Velit aute quis sit irure officia enim ut excepteur. Ipsum qui qui nulla sunt sit dolor nisi anim culpa officia.
Id deserunt labore excepteur sit elit non fugiat. Elit excepteur dolore voluptate anim cillum dolor commodo fugiat id nisi officia culpa.
Lorem exercitation proident id consectetur fugiat ex officia cillum.

Secondary Pane

The A12 widget library is part of the A12 Business Application Platform. Our A12 Widgets mission is to provide a wide range of web components that follow a consistent and attractive design and interaction concept (Plasma) to support business applications running on desktop, tablet and smart phone supporting keyboard, mouse and touch input. The components provide an easy to use, well documented, strongly typed API and are extendable and customizable. A12 Plasma is a design system mainly addressing business applications, by providing a better usage efficiency and predefined interaction patterns for common business use cases: A12 Plasma.

*chevron\_right*

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

Types

* `SupportingPanesLayoutProps.SecondaryPanePosition = "left" | "right"`

SupportingPanesLayoutProps.LayoutProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`htmlAttributes`

`HTMLAttributes<HTMLElement>`

Additional props that will be placed at the DOM element.
It should be used in case a user wants to access to native DOM properties but there's no property allows to do that.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`style`

`CSSProperties`

Additional styles.

`wrapperRef`

`RefCallback<HTMLElement>`

The reference of the element wrapping the main content if one exists.

SupportingPanesLayoutProps.PrimaryPaneProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`htmlAttributes`

`HTMLAttributes<HTMLElement>`

Additional props that will be placed at the DOM element.
It should be used in case a user wants to access to native DOM properties but there's no property allows to do that.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`style`

`CSSProperties`

Additional styles.

`wrapperRef`

`RefCallback<HTMLElement>`

The reference of the element wrapping the main content if one exists.

SupportingPanesLayoutProps.SecondaryPaneProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`collapsed`

`boolean`

This is used to control the collapse/expand state externally. For example, by clicking a button.
By default, the pane will take up 25% of the entire layout.

**@default** false

`hide`

`boolean`

Whether the pane should be hidden or not.

`htmlAttributes`

`HTMLAttributes<HTMLElement>`

Additional props that will be placed at the DOM element.
It should be used in case a user wants to access to native DOM properties but there's no property allows to do that.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`position*`

`SecondaryPanePosition`

Position to handle the resize behavior and animation. A secondary pane can be placed on the left or right side of the primary pane.

`resizeOptions`

`{ maxWidth: string | number, minWidth: string | number, onResize: (event: MouseEvent, payload: { resizedElementWidth: number, siblingElementWidth: number }) => void, onResizeStart: (event: MouseEvent) => void, onResizeStop: (event: MouseEvent, payload: { isAtCollapsedWidth: boolean, resizedElement: HTMLElement | "null", resizedElementWidth: number, siblingElement: HTMLElement | "null", siblingElementWidth: number }) => void }`

Resize options.

`style`

`CSSProperties`

Additional styles.

`widthConfig`

`{ collapsed: string | number, expanded: string | number }`

Width configurations.

A pane will be expanded by default with the given `expanded` .

`wrapperRef`

`RefCallback<HTMLElement>`

The reference of the element wrapping the main content if one exists.

`onToggleCollapsed`

`void`

Callback function to toggle the pane between collapsed and expanded states.

This function updates the pane's state based on its current state.
It is recommended to use this function to better manage the collapse/expand behavior and ensure smooth state transitions.

Theming configuration

The following theme variables can be used to customize the component:

```
1"supportingPanesLayout": {
2    "height": "100%",
3    "borderRadius": "8px",
4    "gap": "4px",
5    "width": "100%",
6    "primaryPane": {
7        "backgroundColor": "#fff",
8        "margin": "0",
9        "padding": "0"
10    },
11    "secondaryPane": {
12        "backgroundColor": "#fff",
13        "content": {
14            "padding": "0"
15        }
16    },
17    "transitionDuration": "0.4s"
18}
```

*content\_copy*
