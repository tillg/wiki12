---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/utils/resize-detector
widget: utils/resize-detector
scraped: 2026-06-12
---

# Widgets/Utils/Resize detector

Resize Detector

This example demonstrates how you can make use of a **useWindowSize** hook to create a component that can detect the window's size change.

Detected window's size: `md`

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

Types

* `SizeDetectorProps.Size = "xs" | "sm" | "md" | "lg" | "null"`

SizeDetectorProps.BreakPoint

Property

Type

Description

`size*`

`Size`

Name of the breakpoint.

`width*`

`number`

Upper bound of this breakpoint.

ElementSizeDetectorProps

Property

Type

Description

`breakPoints`

`BreakPoint[]`

A list of breakpoints to calculate the size.

**@default** [{ width: 575, size: "xs" },

{ width: 767, size: "sm" },

{ width: 991, size: "md" },

{ width: Number.POSITIVE\_INFINITY, size: "lg" }]

`handleHeight`

`boolean`

Trigger onResize on height change

**@default** false

`handleWidth`

`boolean`

Trigger onResize on width change

**@default** true

`targetRef*`

`MutableRefObject<HTMLElement | "null">`

React reference of the element to observe.
Pass a reference to the element you want to attach resize handlers to.
It must be an instance of React.useRef or React.createRef functions.

SizeDetectorComponentProps

Property

Type

Description

`breakPoints`

`BreakPoint[]`

A list of breakpoints to calculate the size.

**@default** [{ width: 575, size: "xs" },

{ width: 767, size: "sm" },

{ width: 991, size: "md" },

{ width: Number.POSITIVE\_INFINITY, size: "lg" }]

`onSizeChange`

`(breakPoint: BreakPoint) => void`

A callback will be triggered when the size is changed leading to changing the breakpoint.

SizeDetectorProps

Property

Type

Description

`breakPoints`

`BreakPoint[]`

A list of breakpoints to calculate the size.

**@default** [{ width: 575, size: "xs" },

{ width: 767, size: "sm" },

{ width: 991, size: "md" },

{ width: Number.POSITIVE\_INFINITY, size: "lg" }]

WindowSizeDetectorProps

Property

Type

Description

`breakPoints`

`BreakPoint[]`

A list of breakpoints to calculate the size.

**@default** [{ width: 575, size: "xs" },

{ width: 767, size: "sm" },

{ width: 991, size: "md" },

{ width: Number.POSITIVE\_INFINITY, size: "lg" }]
