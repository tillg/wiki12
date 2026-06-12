---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/utils/portals
widget: utils/portals
scraped: 2026-06-12
---

# Widgets/Utils/Portals/Attached portal

Attached Portal

The **Attached Portal** Widget positions a given element relative to a reference element, so that if possible, the element will be fully visible inside the current browser viewport.

There are several remarkable properties:

* `referenceElement`: the element that is used to align the Attached Portal. It can be undefined if the `position` property is defined.
* `position`: opens the Attached Portal at a given position.
* `orientation`: aligns the portal to the `referenceElement`. The default value of this property is **bottom-start**. However, this property does not take effect on mobile devices. Instead, the Attached Portal will automatically select the orientation that best fits the screen.
* `referenceElementRect`: a DOMRect object provides information about the trigger element's size and its position relative to the viewport. It is useful for recalculating the orientation of the **Attached Portal** when the reference element is overlapped by other elements.

**Note:** When applying the **Attached Portal** in other places where the triggering element might be overlapped by other elements, you should use the `IntersectionObserverHelper` utility. This function will observe and get the visible element's position, then pass it in the `referenceElementRect` property which will help the **Attached Portal** to be displayed in correct orientation according to the triggering element. You can check out the code below to see how to do the observation when the mouse is over the button **SHOW/HIDE**, and when the mouse leaves.

Orientation

Position


Attached Portal Orientation

top-starttoptop-endright-startrightright-endbottom-startbottombottom-endleft-startleftleft-end


Top Position, Top

Left Position, Left

Show/hide

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

AttachedPortalProps

Property

Type

Description

`adjustPositionToScreen`

`boolean`

If the new element's position that depends on `referenceElement`
is still covered by the screen, it will try to adjust the element's position
to show full element's rectangle if possible.

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`closeOnClickReferenceElement`

`boolean`

Specifies whether the Portal closes when clicking the `referenceElement` .

**@default** true

`closeOnEsc`

`boolean`

Should the portal close when the ESC key is hit.

**@default** true

`closeOnOutsideClick`

`boolean | { exception: HTMLElement | "null"[] }`

If the portal closes on outer clicks.
If set the exception, portal will be closed when clicking outside but won't be closed if click on exception.

`fixedOrientation`

`boolean`

As fixedOrientation is set to true, the attached portal will remain element's position at the preferred
`orientation` or only adjust the position to the orientations that belongs to `orientationList`
when screen's space is not enough to show the full-size element

`focusOnOpen`

`boolean`

If the portal is opened, it will be focused automatically.

**@default** true

`focusOnReferenceElementAfterClose`

`boolean`

The reference element will be focused after close the portal.

**@default** false

`focusOnReferenceElementAfterEsc`

`boolean`

The reference element will be focused after the user pressed esc.

**@default** true

`hideOnReferenceElementPositionChange`

`boolean`

Specifies whether the Portal hides when the position of the referenceElement changes.

`htmlAttributes`

`HTMLAttributes<HTMLElement>`

Additional props that will be placed at the DOM element.
It should be used in case a user wants to access to native DOM properties but there's no property allows to do that.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`orientation`

`keyof OrientationMap<any>`

Aligns the portal to the `referenceElement` .

**@default** "bottom-start"

**Note:** Does not take effect on mobile devices.

`orientationList`

`keyof OrientationMap[]`

List of preferred orientations

* If both orientationList and `orientation` are defined, the AttachedPortal will
  prioritize the orientationList
* The priority of orientations decrease from left to right (the first orientation of the list
  has the highest priority)

`position`

`{ left: number, top: number }`

Opens the Portal at a given position.

`referenceElement`

`HTMLElement`

The element that is used to align the Portal element.
Undefined signals that the dom was not rendered yet.

Can be undefined if the `position` is defined.

`referenceElementRect`

`DOMRect`

A DOMRect object provides information about the trigger element's size and its position relative to the viewport.
It is useful for recalculating the orientation of the Attached Portal when the reference element is overlapped by other elements.

`selfSizing`

`boolean`

Set selfSizing to true when the children of the attached portal have its own method for calculating size

`style`

`CSSProperties`

Additional styles.

`wrapperRef`

`RefCallback<HTMLDivElement>`

The reference of the element wrapping the main content if one exists.

`onClick`

`(event: MouseEvent<HTMLElement>) => void`

Handle event when click on the portal.

`onClickOutside`

`(event: Event) => void`

Callback when click outside the portal.

`onKeyDown`

`(event: KeyboardEvent<HTMLElement>) => void`

Handle event when key down on the portal.

`onMouseDown`

`(event: MouseEvent<HTMLElement>) => void`

Handle event when mouse down on the portal.

`onMouseLeave`

`(event: MouseEvent<HTMLElement>) => void`

Handle event when mouse leave on the portal.

`onMouseOver`

`(event: MouseEvent<HTMLElement>) => void`

Handle event when mouse over on the portal.

`onOrientationChange`

`(orientation: keyof OrientationMap) => void`

Callback will be triggered when the orientation has changed.

`onSizeChange`

`(maxWidth: number, maxHeight: number) => void`

Callback will be triggered when the size has changed.

`onVisibilityChange`

`(isVisible: boolean) => void`

Notifies that the visibility of the portal is changed.

**@param** isVisible – true if the portal is shown and false if not.

`updateElementPosition`

`(handler: void) => void`

Handle update element position.

Theming configuration

This component has no theme configuration (yet).
