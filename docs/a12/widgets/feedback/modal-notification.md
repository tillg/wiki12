---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/feedback/modal-notification
widget: feedback/modal-notification
scraped: 2026-06-12
---

# Widgets/Feedback/Modal notification

Modal Notification

The **Modal Notification** Widget is a type of modal window that appears in front of app content to inform users about a task and can contain critical information, require decisions, or involve multiple tasks. **Modal Notifications** disable all app functionality when they appear, and remain on screen until confirmed, dismissed, or a required action has been taken.

Basic

Since the **Modal Notification** extends all properties and behaviors of the [Modal Overlay](#/widgets/layout/modal-overlay), by providing `onClose`callback, you can close the modal by pressing `ESC`. To disable this behavior, set the `closeOnEsc` property to false.

You can set the `enableCloseButton` property to true along with a `onClose` callback to display a close button on the top-right of the modal.

Show Modal

*code**center\_focus\_weak**bug\_report*

Variants

There are three additional variants besides the default `info` variant: `success`, `warning` and `error`.

Choose variant

Info (default)

Success

Warning

Error

Show info modal

*code**center\_focus\_weak**bug\_report*

Customization

This example customizes the **Modal Notification** by using the `headingButtons`, `footer`, `padding` and `closeOnOutsideClick` properties.

Show customized Modal

*code**center\_focus\_weak**bug\_report*

Accessibility

By default, the **Modal Notification** sets the `aria-labelledby` attribute using the ID of the heading title. You can also provide additional HTML attributes for the container element via the `containerAttributes` property.

In the example below, the `aria-label` is added and shown in the container through the `containerAttributes` property.

Warning

*warning*

**NOTE**

To fully support accessibility, each **Modal Notification** should have its own `id`. It will be used to generate the heading title's id and linked to the **aria-labelledby** attribute, allowing screen readers to provide complete information to users.

Show Modal

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

ModalNotificationProps

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

`contentRef`

`RefCallback<HTMLDivElement>`

Reference of the content box's content.

`enableCloseButton`

`boolean`

Specifies whether the close button is displayed.

**Note:** This property requires `ModalOverlayProps.onClose` .

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

`footer`

`ReactNode`

The footer of the content box.

`fullscreen`

`boolean`

If true, the modal overlay will be fullscreen.

`headingButtons`

`ReactNode`

Elements to display as the heading suffixes along with the close/back button.

`htmlAttributes`

`HTMLAttributes<HTMLElement>`

Additional props that will be placed at the DOM element.
It should be used in case a user wants to access to native DOM properties but there's no property allows to do that.

`icon`

`ReactNode`

Icon of notification.

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

`padding`

`string | number | boolean`

Specified padding for Content box's content.

* If set to true, there will be padding left, right and bottom (no padding top).
* If set to false, there's no padding applied.
* You can also set your custom value for padding. For example: **padding="12px 24px"** or **padding=24**.

**@default** true

`preventScroll`

`boolean`

If true, the modal overlay will prevent the scroll event.

`style`

`CSSProperties`

Additional styles.

`title`

`ReactNode`

Title of notification.

`variant`

`"info" | "error" | "warning" | "success"`

Variant of notification.

**@default** "info"

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
1"modalNotification": {
2    "closeButton": {
3        "background": "transparent",
4        "color": {
5            "info": "#fff",
6            "error": "#fff",
7            "success": "#fff",
8            "warning": "#16191d"
9        }
10    },
11    "icon": {
12        "fontSize": "1.25rem"
13    },
14    "variant": {
15        "error": "#c62828",
16        "info": "#0277bd",
17        "success": "#2e7d32",
18        "warning": "#fcce34",
19        "text": {
20            "error": "#fff",
21            "info": "#fff",
22            "success": "#fff",
23            "warning": "#16191d"
24        }
25    }
26}
```

*content\_copy*
