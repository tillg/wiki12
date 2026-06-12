---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/layout/split-view
widget: layout/split-view
scraped: 2026-06-12
---

# Widgets/Layout/Split view

Split View

The **Split View** Widget manages the presentation of multiple adjacent panes of content, each of which can contain a variety of components, including tables, images, and so on. It works as a container for `SplitView.Area`. We can easily make an `Area` hidden using React state.

Providing a `resizableOptions` object enables customization to control the resizing behavior, including specifying minimum and maximum widths, as well as handling resize events effectively.

To control the resizing behavior, use the `resizableOptions` property. Setting it to `true` enables the default resizing functionality. Alternatively, providing a `resizableOptions` object allows for advanced customization, such as setting `minWidth` and `maxWidth`, as well as handling resize events for precise control.

For detailed guidance on customizing resizing behavior, refer to the [Resize Handler](#/widgets/layout/resize-handler).

Left Area

*menu*

Magna proident cillum qui velit esse minim do incididunt non non deserunt. Velit cupidatat commodo dolor enim dolore laborum laboris commodo irure est. Occaecat deserunt reprehenderit exercitation ex quis adipisicing enim laboris nulla tempor Lorem aliqua voluptate.
Ullamco deserunt velit magna veniam deserunt exercitation in irure nulla sint est incididunt proident. Dolore occaecat non enim nisi sit deserunt ullamco ullamco ut et ad. Do quis voluptate labore ut aliquip. Esse sunt id quis voluptate sit laborum reprehenderit non eu nulla voluptate. Incididunt excepteur occaecat irure aliqua dolor et eu deserunt proident nisi aute tempor. Eiusmod qui culpa commodo nostrud dolor.

Right Area

Enim veniam occaecat laborum deserunt ex nisi qui duis voluptate. Do ut eiusmod deserunt occaecat sit incididunt incididunt. Laborum labore ipsum amet labore quis mollit. Ut consequat velit voluptate veniam.

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

Types

* `SplitViewProps.ResizeOptions = MakeRequired<ResizeHandlerOptions, "minWidth" | "maxWidth">`

SplitViewProps.AreaProps

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

`resizableOptions`

`ResizeOptions`

Specifies the options for resizing the area.

`style`

`CSSProperties`

Additional styles.

`width`

`string | number`

Set the width of an area.

SplitViewProps

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
1"splitView": {
2    "padding": 0
3}
```

*content\_copy*
