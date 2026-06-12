---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/layout/master-detail
widget: layout/master-detail
scraped: 2026-06-12
---

# Widgets/Layout/Master detail

Master Detail

The **Master Detail Layout** Widget is a responsive layout that has a list of items on the left side (called the Master View) and has the selected item’s detail info on the right side (called the Detail View). Please check out the [Master Detail Example](#/examples/master-detail) to see how it works.

The **Master Detail Layout** works best on large devices since the user can see both the master list and the detail view at the same time. If the screen is small, the user will only be able to see one view at a time and will be forced to switch back and forth.

Template

We use a 12-column grid system so you can set the view width of any given pane from 1 to 12 columns. By default, panes will automatically adjust to be equal widths. In this showcase, however, pane 2 has a preferred width of 5 columns. For that reason, pane 1 adjusts by becoming wider and taking up 7 columns.

Based on the window scale, if the width is less than or equal to the `sm` breakpoint (767px), only 1 component should be displayed at a time. To do that, use `onSizeChange` to handle anything on window's size changed with the current `breakpoint`. You can customize `breakpoints` to calculate the size as well.

If you'd like to listen to the parent's size instead of the window's, set the `listenToWindowSize` property to `false`.

To control the resizing behavior, use the `resizableOptions` property for each view, such as setting `minWidth` and `maxWidth`, as well as handling resize events for precise control.
Additionally, the `firstViewResizableOptions` property provides a convenient way to specifically configure the resizing behavior of the `Master Detail` component. If provided, this will override the corresponding options defined in `resizableOptions` for the first view only.
The resizing feature currently supports a maximum of two views. For practical examples, refer to the [Master Detail Example](#/examples/master-detail).

For detailed guidance on customizing resizing behavior, refer to the [Resize Handler](#/widgets/layout/resize-handler).

Master Detail Layout Title

PANE 1

*fullscreen*

Sample Textline

The Master Detail Layout allows you to display additional information (Detail View) to any item listed in the previous Detail View or Master View.

In this example the Master View is represented by Component 1. After selecting an item (by clicking on “here”) its Detail View will be opened (represented by Component 2). Clicking on an item in this Detail View will open the next one (Component 3). The master view will be minimized to a "chip" above the first view. Clicking on an item in the 2nd detail view will open the 3rd detail view, etc. Detail views not shown will be minimized next to the master “chip”. Clicking on this "chip" will provide a shortcut back to the related view.
On mobile devices each view will be displayed full screen. Views not shown will be grouped in a select above.

For better usability we recommend that the height of the views doesn’t exceed the height of the viewport. The Master and Detail views altogether should take up 100% of the viewport’s height. This guarantees that the user has access to all actions of a view, executable via buttons in the view’s content box header and/or footer, without any page scrolling.

**This is just a dummy text.** Ad ad pariatur sunt ad sunt eu commodo minim ad Lorem exercitation anim irure. Laborum adipisicing Lorem laborum fugiat voluptate consequat incididunt qui laboris consequat labore Lorem excepteur sit. Ea consequat commodo cillum tempor magna. Eiusmod voluptate qui eiusmod pariatur laboris in deserunt. Ut sint nulla occaecat officia culpa voluptate culpa. Reprehenderit nostrud ex et velit quis commodo voluptate veniam ad duis eiusmod dolor excepteur officia. Sunt enim consectetur tempor ullamco ullamco tempor cupidatat duis exercitation.
Excepteur aute proident occaecat ut quis. Incididunt fugiat officia quis id do ullamco id ullamco nostrud exercitation magna Lorem ut. Aute ad ipsum sunt nisi. Excepteur excepteur reprehenderit in labore aute irure pariatur. Nostrud exercitation proident incididunt do nulla minim sint id aliquip adipisicing amet voluptate.
Ea ad culpa sint culpa est aute pariatur est. Laboris Lorem enim excepteur excepteur veniam cillum sunt duis id adipisicing ea minim qui laboris. Sit dolore irure voluptate nostrud cillum deserunt tempor nulla do amet amet pariatur minim. Sunt sint non id exercitation excepteur sint. Incididunt incididunt culpa sint sint velit qui labore nisi sint esse enim ex eu. Eu adipisicing quis eiusmod et exercitation.
Nisi labore ea mollit eiusmod nostrud eu cillum incididunt. Esse eiusmod reprehenderit laboris Lorem cupidatat do deserunt duis nostrud. Reprehenderit dolore labore esse pariatur sunt est elit ullamco. Id ullamco enim anim incididunt est quis laborum dolor. Proident adipisicing minim do ex incididunt excepteur elit velit aliquip officia magna. Cillum minim mollit nisi anim commodo in minim id.
Nisi nostrud ullamco ex sint laboris labore. Aliqua elit excepteur duis eu amet. Id excepteur esse laborum Lorem nostrud occaecat. Ut labore irure fugiat excepteur ullamco mollit id dolor nulla ullamco aute laboris consequat ipsum.

PANE 2

*fullscreen*

*close*

Click  here  to open the next detail.

Sample Textline

The Master Detail Layout allows you to display additional information (Detail View) to any item listed in the previous Detail View or Master View.

In this example the Master View is represented by Component 1. After selecting an item (by clicking on “here”) its Detail View will be opened (represented by Component 2). Clicking on an item in this Detail View will open the next one (Component 3). The master view will be minimized to a "chip" above the first view. Clicking on an item in the 2nd detail view will open the 3rd detail view, etc. Detail views not shown will be minimized next to the master “chip”. Clicking on this "chip" will provide a shortcut back to the related view.
On mobile devices each view will be displayed full screen. Views not shown will be grouped in a select above.

For better usability we recommend that the height of the views doesn’t exceed the height of the viewport. The Master and Detail views altogether should take up 100% of the viewport’s height. This guarantees that the user has access to all actions of a view, executable via buttons in the view’s content box header and/or footer, without any page scrolling.

**This is just a dummy text.** Eu commodo ad adipisicing mollit reprehenderit ea in officia velit aliqua. Cupidatat id duis nulla occaecat dolore ea veniam anim reprehenderit irure fugiat elit. Do quis ipsum ea ea nisi irure. Laboris pariatur magna proident id.
Duis officia reprehenderit sit qui deserunt velit. Tempor labore do enim cillum. Aliqua ipsum proident eiusmod voluptate exercitation. Lorem et commodo mollit amet. Culpa consequat deserunt quis anim cupidatat tempor et ad enim dolore qui sit do ex.
Aliqua enim sint enim sint excepteur. Elit velit non veniam consequat labore adipisicing sit esse consequat consectetur irure labore. Irure non sunt eu do duis.
Ipsum tempor in do voluptate elit tempor minim eiusmod culpa. Veniam enim magna Lorem nulla duis anim sit pariatur eu in velit tempor labore. Reprehenderit non et adipisicing ullamco ut. Esse reprehenderit ad dolor adipisicing veniam qui officia magna dolore velit cillum minim in deserunt. Eiusmod duis veniam nulla non nulla excepteur nostrud duis aliqua aute exercitation Lorem nisi. Esse voluptate mollit laborum esse.
Aliqua sit esse incididunt dolore amet ut nulla. Sit dolore duis esse labore qui tempor veniam ex dolor. Ea ad eiusmod occaecat minim ex sint elit eu ullamco anim anim.

*code**center\_focus\_weak**bug\_report*

Managed

This **Managed Master Detail** Widget is a behavioral wrapper of the Template Master Detail Widget. Its required properties are a `title` and a list of `views`.

Based on the window scale, if the width is greater than the `sm` breakpoint (767px), the number of displayed components depends on the value users pass to the `columnCount` property. Otherwise, only 1 component can be displayed at a time. Use the `onSizeChange` property to handle anything on window's size changed with the current breakpoint. You can customize the`breakpoints` to calculate the size as well.

If you'd like to listen to the parent's size instead of the window's, set the `listenToWindowSize` property to `false`.

Maximum number of visible views

1 Columns2 Columns3 Columns4 Columns

Managed Master Detail Layout

Pane 1

*fullscreen*

Click  here  to open the next detail.

Replaced by

Pane 1Pane 2Pane 3Pane 4

Sample Textline

The Master Detail Layout allows you to display additional information (Detail View) to any item listed in the previous Detail View or Master View.

In this example the Master View is represented by Component 1. After selecting an item (by clicking on “here”) its Detail View will be opened (represented by Component 2). Clicking on an item in this Detail View will open the next one (Component 3). The master view will be minimized to a "chip" above the first view. Clicking on an item in the 2nd detail view will open the 3rd detail view, etc. Detail views not shown will be minimized next to the master “chip”. Clicking on this "chip" will provide a shortcut back to the related view.
On mobile devices each view will be displayed full screen. Views not shown will be grouped in a select above.

For better usability we recommend that the height of the views doesn’t exceed the height of the viewport. The Master and Detail views altogether should take up 100% of the viewport’s height. This guarantees that the user has access to all actions of a view, executable via buttons in the view’s content box header and/or footer, without any page scrolling.

**This is just a dummy text.** Irure magna quis tempor do non velit aute eiusmod nostrud culpa cillum sunt. Eiusmod ullamco exercitation est ipsum cupidatat nisi nulla laborum minim fugiat nisi ea deserunt. Aliqua exercitation laborum tempor velit do est velit esse elit tempor nulla in enim magna. Nostrud ullamco proident cillum ullamco et. Tempor cupidatat et voluptate deserunt voluptate dolor ex. Irure ea incididunt ut excepteur veniam duis adipisicing laborum Lorem. Cupidatat sunt sunt adipisicing do cillum et labore voluptate sit reprehenderit dolor ullamco.
Ullamco in elit cillum incididunt incididunt laboris eu in velit. Aute labore cupidatat eu elit dolore. Commodo laborum duis consectetur id consequat eu quis aliqua excepteur. Fugiat reprehenderit in culpa mollit.
Aliqua occaecat aute magna veniam sint dolore eu commodo proident ullamco consectetur aliqua exercitation excepteur. Ipsum in amet duis eu sit ipsum ad ex ipsum. Dolore ad nostrud enim ipsum id quis commodo eiusmod velit.
Amet sit in sit excepteur irure ad. Magna minim enim proident consequat mollit ea sit. Lorem eiusmod duis commodo aute eiusmod irure consectetur ea incididunt id deserunt amet. Occaecat exercitation exercitation cillum quis commodo laborum ipsum id duis dolore adipisicing magna enim. Enim velit consectetur aute et. Velit cupidatat elit veniam Lorem.
Cillum laborum laboris pariatur labore aliqua quis magna fugiat deserunt minim quis est sunt. Non occaecat amet est nulla adipisicing pariatur qui exercitation ullamco sint incididunt qui fugiat aliquip. Dolor irure deserunt voluptate nisi minim sint voluptate esse aliqua cillum.

Pane 2

*fullscreen*

*close*

Click  here  to open the next detail.

Replaced by

Pane 1Pane 2Pane 3Pane 4

Sample Textline

The Master Detail Layout allows you to display additional information (Detail View) to any item listed in the previous Detail View or Master View.

In this example the Master View is represented by Component 1. After selecting an item (by clicking on “here”) its Detail View will be opened (represented by Component 2). Clicking on an item in this Detail View will open the next one (Component 3). The master view will be minimized to a "chip" above the first view. Clicking on an item in the 2nd detail view will open the 3rd detail view, etc. Detail views not shown will be minimized next to the master “chip”. Clicking on this "chip" will provide a shortcut back to the related view.
On mobile devices each view will be displayed full screen. Views not shown will be grouped in a select above.

For better usability we recommend that the height of the views doesn’t exceed the height of the viewport. The Master and Detail views altogether should take up 100% of the viewport’s height. This guarantees that the user has access to all actions of a view, executable via buttons in the view’s content box header and/or footer, without any page scrolling.

**This is just a dummy text.** Dolor elit et id dolore eiusmod ea ullamco esse dolor ad sunt sunt consectetur et. Aliquip esse dolore et aliqua amet elit anim sint ullamco. Ad mollit ullamco mollit minim commodo eiusmod sint cupidatat proident duis consequat. Commodo fugiat commodo veniam proident esse reprehenderit ullamco in ut esse laborum ad aliquip dolor.
Lorem dolore ullamco amet ut ut nostrud. Do pariatur qui cupidatat minim. Do id eu magna cillum reprehenderit reprehenderit ullamco commodo.
Cupidatat ea irure est dolore esse tempor reprehenderit eu aliqua aliqua commodo nulla tempor. Aliqua deserunt tempor sit qui nostrud esse sunt consectetur tempor cupidatat do. Reprehenderit esse veniam et veniam. Cillum ut ullamco nostrud ea laboris exercitation nulla irure. Aute laborum eiusmod ipsum nulla consectetur cupidatat dolore ullamco elit et exercitation duis officia.
Pariatur nulla ea cillum aliquip esse aliqua consequat est laboris ea. Exercitation consequat commodo eu culpa laboris ea esse aliqua nisi. Est pariatur duis do enim dolore consequat irure culpa sint consequat veniam. Elit irure ad in sit ullamco aliqua proident sit.
Eiusmod ipsum anim voluptate reprehenderit exercitation commodo exercitation proident est aute. Tempor ex labore do officia aute enim excepteur laborum ea. Occaecat eiusmod Lorem enim elit laborum aliqua proident elit ipsum laboris ipsum voluptate esse mollit. Voluptate veniam anim incididunt Lorem excepteur ipsum nulla consectetur ex in est adipisicing.

*code**center\_focus\_weak**bug\_report*

Accessibility

For *Accessibility (A11y)*, each view should have an **id** which is passed by users, then the focus will occur based on these scenarios that are possible below, otherwise, it will focus on the current view:

* *Add:* The focus will be on the added view. The **id** of the trigger open element should be provided in **onNext(options?: {triggerElementId?: string})** so that this trigger element will be focused when removing the added view.
  e.g.: `[1,2,3,4] -> [1,2,3,4,5]`. The added view 5 will be focused.
* *Remove:* The focus will be on the trigger open element if its id is defined, otherwise, the last visible view will be focused.
  e.g.: `[1,2,3,4,5] -> [1,2,3,4]`. Click on HERE button of view 4 to open view 5. Close view 5, that button will be focused.
* *Replace:* The focus will be on the new view. If the new view is closed, the focus will go back to the last visible view.
  e.g.: `[1,2,3,4] -> [1,2,3,5]`. View 5 will be focused. Close view 5, view 3 will be focused.
* *Minimize/Maximize:* The focus will be on the minimize/maximize button. The **id** of that trigger button should be provided in **onFullscreenToggled(fullscreenButtonId?: string)**.

You can see [Managed](#/widgets/layout/master-detail#managed) example above.

API

**Note:**

* This API section only displays some of the most remarkable properties of the **Master Detail** widget. To find a full set of properties, please make use of an IDE to explore the Widget's source code.
* `prop*` is required.
* `prop` is deprecated.

Types

* `ViewWidth = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12"`

Animation

Property

Type

Description

`animateSingleItem`

`"ltr" | "rtl"`

In case a single item is visible, the animation direction must be passed.

`enabled`

`boolean`

Set to false to disable animations.

`onAnimationEnd`

`void`

Callback triggered when the animation ends.

`onAnimationStart`

`void`

Callback triggered when the animation starts.

Layoutable

Property

Type

Description

`preferredWidth`

`ViewWidth`

The Layoutable can provide a preferred width similar to a column in a 12-column grid.

LayoutResult

Property

Type

Description

`items*`

`LayoutResultItem<T>[]`

All items for the layout result.

LayoutResultItem

Property

Type

Description

`layoutable*`

`T`

Layoutable of this layout result item.

`width`

`ViewWidth`

Width of this layout result item.

MasterDetailBodyProps

Property

Type

Description

`animation`

`Animation`

Config for animation (enabled by default).

`className`

`string`

Additional css class names.

`firstViewResizableOptions`

`ResizeOptions`

Resizing options specifically for the first view in the `Master Detail` layout.

Use this prop to control how the first view behaves during resizing.
When provided, it overrides the corresponding options defined in the general `VisibleView.resizableOptions`
for the first view only, allowing for more precise and independent control over its resizing behavior.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`style`

`CSSProperties`

Additional styles.

`visibleViews*`

`VisibleView[]`

List of views that are visible.

MasterDetailHeaderProps

Property

Type

Description

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

`title`

`string`

An (optional) string used as caption.

MasterDetailLayout

Property

Type

Description

`layout*`

`LayoutResult<T>`

Layout of MasterDetailLayout.

MasterDetailProps

Property

Type

Description

`animation`

`Animation`

Config for animation (enabled by default).

`breakPoints`

`BreakPoint[]`

A list of breakpoints to calculate the size.

**@default** [{ width: 575, size: "xs" },

{ width: 767, size: "sm" },

{ width: 991, size: "md" },

{ width: Number.POSITIVE\_INFINITY, size: "lg" }]

`className`

`string`

Additional css class names.

`firstViewResizableOptions`

`ResizeOptions`

Resizing options specifically for the first view in the `Master Detail` layout.

Use this prop to control how the first view behaves during resizing.
When provided, it overrides the corresponding options defined in the general `VisibleView.resizableOptions`
for the first view only, allowing for more precise and independent control over its resizing behavior.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`listenToWindowSize`

`boolean`

Listen to the size of browser window instead of parent element

**@default** true

`onSizeChange`

`BreakPoint`

A callback will be triggered when the size is changed leading to changing the breakpoint.

`style`

`CSSProperties`

Additional styles.

`title`

`string`

An (optional) string used as caption.

`visibleViews`

`VisibleView[]`

List of views that are visible.

VisibleView

Property

Type

Description

`element*`

`ReactNode`

Element of this visibleView.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`key`

`string`

Key of VisibleView

`resizableOptions`

`ResizeOptions`

Specifies the options for resizing the view.

`width`

`ViewWidth`

Width of this VisibleView.

ResizeOptions

Property

Type

Description

`maxWidth`

`string | number`

The maximum width that the resizable element can be resized to.

`minWidth`

`string | number`

The minimum width that the resizable element can be resized to.

`onResize`

`ResizeEventHandler`

A callback triggered continuously as the resize is happening.
Receives the resize event and a data object with information on the current size and
changes in width/height as the user drags.

`onResizeStart`

`ResizeEventHandler`

A callback triggered when the resize action starts (i.e., when the user begins dragging).
Receives the resize event and a data object containing initial size and position data.

`onResizeStop`

`ResizeEventHandler`

A callback triggered when the resize action stops (i.e., when the user stops dragging).
Receives the resize event and a data object containing information such as the element's
final size and the difference in dimensions since the resize began.

Types

* `ManagedMasterDetailType = ManagedMasterDetailProps & Partial<MasterDetailProps>`

ContentProps

Property

Type

Description

`fullScreen`

`boolean`

To be called to handle the component is collapsed or fullscreen

`fullScreenable`

`boolean`

To be called to decide the component should have fullscreen feature or not

**@default** false

`tabIndex`

`number`

Specify the tabIndex attribute.

`onFullscreenToggled*`

`(index: number, fullscreenButtonId?: string) => void`

To be called to modify the screen of each component.

**@param** index – that let you know which component view is being toggled

**@param** fullscreenButtonId – is the id of the fullscreen button which will be focused after toggling

`onGoTo*`

`(index: number) => void`

To be called to switch to a specific view.

`onNext*`

`(options?: { triggerElementId: string }) => void`

Callback that will be called when switching to next view.

`onPrevious*`

`void`

To be called to switch to the previous view.

`onReplace`

`(currentId: string, replacerId: string) => void`

Handle the replacement of 2 components.

ManagedMasterDetailProps

Property

Type

Description

`className`

`string`

Additional css class names.

`columnCount`

`number`

Number of columns to display (at most).

**@default** 1

`fullscreen`

`boolean`

To be called to initialize fullscreen

**@default** false

`fullScreenable`

`boolean`

To be called to decide the component should have fullscreen feature or not

**@default** false

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`startIndex`

`number`

Index of the right most column to show.

**@default** 0

`style`

`CSSProperties`

Additional styles.

`title*`

`string`

The title displayed above the columns.

`views*`

`ManagedMasterDetailView[]`

The list of views to be managed by the widget.

`viewTabIndex`

`number`

The tabindex attribute of view

ManagedMasterDetailView

Property

Type

Description

`content*`

`ComponentType<ContentProps>`

The component displayed in a column, receiving `ContentProps` .

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`key`

`string`

Specify the key attribute.

`label*`

`string`

The label displayed above a column.

`preferredWidth`

`ViewWidth`

The Layoutable can provide a preferred width similar to a column in a 12-column grid.

`resizableOptions`

`ResizeOptions`

Specifies the options for resizing the view.

Theming configuration

The following theme variables can be used to customize the component:

```
1"masterDetailLayout": {
2    "background": "none",
3    "borderRadius": 0,
4    "spacingBetweenPanes": "2px 2px",
5    "spacingForBoxShadow": "1px",
6    "contentBoxHeaderPadding": "0 40px",
7    "header": {
8        "padding": "16px 40px"
9    },
10    "title": {
11        "fontFamily": "\"Open Sans\", sans-serif",
12        "fontSize": "1.25rem",
13        "fontWeight": 700,
14        "lineHeight": "24px",
15        "margin": "0",
16        "padding": "4px 0",
17        "width": "100%"
18    },
19    "body": {
20        "margin": "0"
21    },
22    "pane": {
23        "animationDuration": "0.35s",
24        "secondChildLeftBorder": "none",
25        "nonFirstChildLeftBorder": "none"
26    }
27}
```

*content\_copy*
