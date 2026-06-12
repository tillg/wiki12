---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/layout/modal-overlay
widget: layout/modal-overlay
scraped: 2026-06-12
---

# Widgets/Layout/Modal overlay

Modal Overlay

The **Modal Overlay** Widget provides a pop-up container to display information without navigating away from the current page.
It can hold any kind of content, the most common of which is the [Content Box](#/widgets/layout/content-box) Widget. The content of the **ModalOverlay** is displayed centered on the screen and blocks interacting with the current page.

Basic

By default, you can close the modal via the **ESC** key, or by clicking outside if you set the `closeOnOutsideClick` property to true. To disable the ability of closing by ESC key, you can set the `closeOnEsc` property to `false`.

Warning

*warning*

**NOTE**

Since closing and opening the modal is user-controlled, the default values of `closeOnEsc` and `closeOnOutsideClick` only take effect when used with the `onClose` callback.

Show Modal

*code**center\_focus\_weak**bug\_report*

Max Width

A modal can have a custom maximum width by setting the `maxWidth` property.

Max width: 720px

Show Modal

*code**center\_focus\_weak**bug\_report*

Fullscreen with no gutter

"Gutter" is the spacing around the modal container that you can see clearly when the modal reaches its maximum height or width. To remove that gutter, use the `noGutter` property.

In addition, you can make the modal fullscreen by using the `fullscreen` property.

Fullscreen

No Gutter

Show Modal

*code**center\_focus\_weak**bug\_report*

Fit To Parent

Set the `fitToParent` property to **true** to display the Modal Overlay within the parent element. The rest of behaviors remains the same, only the size of the modal is fitted.

Warning

*warning*

**NOTE**

The parent's `position` attribute will be changed to `relative` so that the Modal Overlay can be aligned. Be aware that if the parent is positioned relative to another element (e.g.: fixed), the UI may break.

Content Box

Show Modal

Cillum ad est deserunt excepteur deserunt est. Nostrud officia occaecat deserunt enim consectetur laboris excepteur sunt esse deserunt ex sit esse. Labore nostrud sit adipisicing nulla laborum laboris Lorem irure occaecat sunt elit. Occaecat fugiat duis duis dolore velit dolore culpa tempor pariatur esse est laborum magna. Veniam quis dolor pariatur eu exercitation commodo labore exercitation consectetur pariatur. Veniam et fugiat fugiat aliqua quis ut est non non velit. Cupidatat occaecat nisi nulla incididunt proident mollit. Lorem eu labore ea occaecat consectetur pariatur ut ullamco ipsum est sint ullamco proident incididunt. Aliquip ipsum sit elit ipsum tempor culpa ad in velit enim consequat. Anim eu eiusmod Lorem voluptate aliquip duis officia nulla proident excepteur duis ea quis fugiat. Minim officia et id ullamco veniam quis nostrud anim labore. Labore magna elit commodo aliquip reprehenderit proident fugiat ipsum tempor ullamco. Laborum sint incididunt ullamco nostrud fugiat cupidatat enim fugiat aliqua cupidatat nostrud proident laboris Lorem. Ad sint tempor occaecat minim reprehenderit sit reprehenderit in. Esse cupidatat enim fugiat ex. Et est aliqua aliquip ad. Ut amet sunt duis deserunt labore eu ea. Non ex nisi Lorem aliqua consectetur. Nisi voluptate ut sunt ullamco. Nisi amet ipsum in aute et quis est esse. Exercitation tempor magna magna reprehenderit aute in elit labore culpa minim aliqua velit. Officia officia reprehenderit dolor nostrud sunt nostrud. Pariatur ullamco esse pariatur deserunt ad ad magna. Occaecat aute magna in minim reprehenderit sunt sit qui. Veniam sunt excepteur consequat sunt excepteur fugiat aliquip enim. Occaecat labore in nulla consequat velit pariatur. Eiusmod ut proident ex id do quis do dolor reprehenderit velit. Anim et consequat consectetur consequat cillum. Eiusmod tempor proident adipisicing eu. Voluptate aliquip adipisicing fugiat aute anim laborum ipsum et exercitation labore aliqua dolore officia. In aliquip ea voluptate ipsum ad voluptate non consequat pariatur aute amet. Anim occaecat exercitation laborum in adipisicing fugiat anim. Nisi pariatur in labore irure laboris dolore est minim aute. Et fugiat ad do esse qui ex minim ullamco. Ex cillum est culpa laboris commodo sint elit. Quis occaecat minim ut incididunt commodo excepteur dolor amet et nulla eu magna cillum. Nostrud sit do duis consequat eu magna. Ut aliqua incididunt irure ullamco magna. Aliquip magna ut magna reprehenderit esse nulla. Occaecat ut consequat dolor laborum non voluptate culpa. Est labore officia id nostrud eiusmod. Nulla adipisicing id veniam amet Lorem eu mollit excepteur esse adipisicing adipisicing quis. Qui cillum proident duis voluptate commodo ad culpa non quis ipsum. Sit voluptate aliqua ullamco magna minim quis non dolore nisi cillum qui anim in pariatur. Esse aute ipsum occaecat ullamco nostrud. Adipisicing ea anim pariatur nulla nulla ipsum labore ullamco commodo laborum elit. Id cillum ea in et adipisicing ad eiusmod dolore tempor. Nostrud occaecat esse sint sint Lorem sunt reprehenderit aliqua dolor commodo mollit deserunt. Esse eiusmod non est in ullamco velit magna minim velit. Elit aliquip velit tempor amet dolore laboris cillum ullamco in dolore laboris.

*code**center\_focus\_weak**bug\_report*

Accessibility

To ensure proper accessibility for screen readers, you can use the`containerAttributes` property to pass the necessary attributes to the modal container.

In the example below, the modal includes `aria-labelledby` which references the header title id. When opened, screen readers will announce with the title, helping users understand the context and purpose of the modal.

Show Modal

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

ModalOverlayProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`closeOnEsc`

`boolean`

If true, the modal overlay can be closed by the key ESC key.

**@default** true

**@requires** `onClose`

`closeOnOutsideClick`

`boolean`

If true, the modal overlay can be closed by clicking outside.

**@requires** `onClose`

**Note:** This option can cause issues when used with other modals or portals (e.g. DatePicker).
This is because clicking inside them will be treated as clicking outside of this modal, causing it to close.
In such cases, set this option to false.

`containerAttributes`

`HTMLAttributes<HTMLDivElement>`

Additional HTML attributes for the modal container.

`fitToParent`

`boolean`

Whether the modal should be displayed within the parent.

**@default** false

`focusBack`

`boolean`

Focus back to the trigger element when the modal is closed.

**@default** true

`focusOnOpen`

`boolean`

Focus on the modal container when it is opened.

**@default** true

`fullscreen`

`boolean`

If true, the modal overlay will be fullscreen.

`htmlAttributes`

`HTMLAttributes<HTMLElement>`

Additional props that will be placed at the DOM element.
It should be used in case a user wants to access to native DOM properties but there's no property allows to do that.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`maxWidth`

`string | number`

Set the maximum width of the modal overlay.
Either a number of pixels or a string (for example "70%") can be applied.

`noGutter`

`boolean`

If true, the modal overlay will not have gutter.

**@default** false

`preventScroll`

`boolean`

If true, the modal overlay will prevent the scroll event.

`style`

`CSSProperties`

Additional styles.

`wrapperRef`

`RefCallback<HTMLDivElement>`

The reference of the element wrapping the main content if one exists.

`onClose`

`void`

This callback triggered to close the modal.

**Note:** Required when using `closeOnEsc` or `closeOnOutsideClick` .

`onOpen`

`void`

This callback is called if the modal overlay opens.

Theming configuration

The following theme variables can be used to customize the component:

```
1"modalOverlay": {
2    "background": "rgba(22,25,29,0.4)",
3    "container": {
4        "background": "#fff",
5        "maxWidth": "756px"
6    },
7    "contentBoxContentPadding": "0 40px 24px",
8    "contentBox": {
9        "fontSize": "0.75rem"
10    },
11    "gutterMargin": "24px 24px",
12    "gutterHorizontalMargin": "24px",
13    "mobileContentboxHeaderMinHeight": "48px",
14    "width": "calc(100% - 48px)"
15}
```

*content\_copy*
