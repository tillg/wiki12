---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/general/popup-menu
widget: general/popup-menu
scraped: 2026-06-12
---

# Widgets/General/Popup menu

Popup Menu

The **Popup Menu** Widget is designed for you to use when there are more than a few options to choose from. By clicking on the trigger, a dropdown menu will appear, which allows you to choose an option and execute the relevant action.

Basic

The **Popup Menu** Widget typically displays a "3-dots" button when closed and a "close" button when opened. You can use the [List](#/widgets/data-display/list) widget for menu items.

We've integrated the `PopupMenuConfigContext` with a default value of `enableA11YMobileDesign` set to `true`, prioritizing accessibility support on mobile and tablet devices. If you prefer to disabled this feature, you can simply set `enableA11YMobileDesign` to `false` when configuring the context.

Note that the `closeOnOutsideClick` property is only enabled by default on desktop or when`enableA11YMobileDesign` is set to `false` within the configuration of the `PopupMenuConfigContext`.

Show the Header on Mobile

List with more info

*more\_vert*

Customized trigger Icon

*arrow\_drop\_down*

Disabled

*more\_vert*

*code**center\_focus\_weak**bug\_report*

Custom Trigger Element With Header Trigger

You can customize the trigger element by using the `triggerElement` property. In this example, we use the `HeaderTrigger` widget.

The `HeaderTrigger` allows you to display additional information, such as an icon or label. You can refer to the API definition to better understand how to use it.

Warning

*warning*

**NOTE**

**Accessibility**: If the selected option is displayed in the `HeaderTrigger` element, the hidden text **Selected** will be made visible to screen readers. Otherwise, this hidden text can be removed by setting the `hideHiddenText` property to **true**.

With Hidden Text

*public*Selected EN*arrow\_drop\_down*

Without Hidden Text

*info*P. Parker*keyboard\_arrow\_down*

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

PopUpMenuProps

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

Specifies whether the portal should be closed when the ESC key is hit.

**@default** true

`closeOnOutsideClick`

`boolean | { exception: HTMLElement[] }`

Specifies if the portal should close on outer click.
If set the exception, portal will be closed when clicking outside but won't be closed if click on exception.

**Note:** This flag will be true on desktop or when "enableA11YMobileDesign" is false, or if there is no `headerTitle`

`dataRole`

`string`

data-role attribute.

`disabled`

`boolean`

Specifies that this widget is disabled.

`focusOnOpen`

`boolean`

If true, the focus will be set to the popup container when it's opened.

**@default** true

`focusOnTriggerElementAfterClose`

`boolean`

Specifies whether the focus should be set back to the trigger element when the popup is closed.

**@default** true

**Note:**

* Only works with mouse when clicking outside to close the popup menu. Using the keyboard (ESC and SPACE) will keep the behaviors as normal.
* Set to `false` if you want to manually handle the focus after closing the popup menu by clicking a popup item.

`headerTitle`

`ReactNode`

The title for the header of the popup menu.
To show the header in the popup menu, you must provide a value for headerTitle.

**Note:** It only supports for mobile usage.

`htmlTag`

`string`

Specifies the HTML tag that will wrap the Popup.

**@default** "div"

`icon`

`ReactNode`

Contains Icon for button in popup menu.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`menuClassName`

`string`

The additional class names for the popup menu list.

`orientation`

`keyof OrientationMap<any>`

Dictates the portal's position relative to the `triggerElement` .

`popupListAttributes`

`HTMLAttributes<HTMLElement>`

Additional props that will be placed at the popup list DOM element.
It should be used in case a user wants to access to native DOM properties but there's no property allows to do that.

`portalClassName`

`string`

The additional class names for the Attached Portal.

`style`

`CSSProperties`

Additional styles.

`triggerButtonCloseTitle`

`string`

Specifies a custom close title for the original trigger button when the popup is opened.
By default, it will be "Close menu" in English, and "Menü schließen" in German.

`triggerButtonTitle`

`string`

Specifies a custom title for the original trigger button when the popup is closed.
By default, it will be "Open menu" in English, and "Menü öffnen" in German.

`triggerElement`

`ReactElement<unknown, string | JSXElementConstructor<any>>`

Specifies the element to trigger the menu. It should be an interactive ReactElement, such as a button.

`triggerElementRef`

`RefCallback<HTMLElement>`

The reference of the custom trigger element.

`wrapperRef`

`RefCallback<HTMLDivElement>`

The reference of the element wrapping the main content if one exists.

`close`

`(handler: void) => void`

Returns a handler for closing the popup.

`onTriggerElementClick`

`(event: MouseEvent<HTMLElement>) => void`

A callback will be triggered when clicking the trigger element by mouse.

`onVisibilityChange`

`(isPopupVisible: boolean) => void`

A callback will be triggered when the visibility of the popup has changed.

**@param** isPopupVisible – whether the popup is shown or not.

HeaderTriggerProps

Property

Type

Description

`active`

`boolean`

Whether HeaderTrigger is activated,
if true, background color will be changed.

`buttonRef`

`RefCallback<HTMLButtonElement>`

The ref to the button.

**@param** instance – the button element instance.

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`dataRole`

`string`

data-role attribute.

`disabled`

`boolean`

Specifies whether the HeaderTrigger is disabled.

`graphic`

`string`

Graphic Icon of HeaderTrigger

`hideHiddenText`

`boolean`

Specifies whether the hidden text placed before the header content should be hidden from screen readers or not.

If this property is set to:

* `undefined` (default) or `false` - show the default hidden text that indicates the header content as a selected option:
  + English: "Selected "
  + German: "Gewählt "
* `true` - the hidden text will be removed.

To customize the hidden text, use `A11YLanguageContext` (see Accessibility in Widgets Showcase).

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`light`

`boolean`

Specifies whether the multilingual header trigger has a light background.

**@requires** multilingual

`meta`

`string`

Meta Icon of HeaderTrigger

`multilingual`

`boolean`

Specifies whether the header trigger is used as trigger element for multilingual popup.

`style`

`CSSProperties`

Additional styles.

`text`

`string`

Text of HeaderTrigger

`textTitle`

`string`

Title of `text` to support accessibility

`vertical`

`boolean`

Specifies whether the icon and text of the multilingual header trigger align vertically in the center.

**@requires** multilingual

`onClick`

`(event: MouseEvent<HTMLElement>) => void`

Click handler for HeaderTrigger.

**@param** event – mouse event.

`onKeyUp`

`(event: KeyboardEvent) => void`

Handle key up event for HeaderTrigger.

**@param** event – keyboard event.

Theming configuration

The **Popup Menu** uses our [Button](#/widgets/general/buttons/button#buttons-theme-configuration) widget, so it inherits the style configuration of that component.

Additionally, the component provides built-in theme variables that can be used to customize itself:

```
1"popupMenu": {
2    "button": {
3        "color": "#333",
4        "disabled": {
5            "background": "#e2e6e9",
6            "color": "#a9b3bc"
7        },
8        "font": "\"Open Sans\", sans-serif",
9        "fontSize": "1rem",
10        "fontWeight": 400,
11        "icon": {
12            "color": "#333",
13            "fontSize": "1.25rem",
14            "height": "24px"
15        },
16        "padding": "16px 24px",
17        "textAlign": "left"
18    },
19    "item": {
20        "active": {
21            "background": "none",
22            "boxShadow": "inset 0 0 0 2px #00589f"
23        },
24        "borderBottom": "1px solid #e2e6e9",
25        "height": "52px",
26        "hover": {
27            "background": "none",
28            "boxShadow": "inset 0 0 0 2px #00589f"
29        },
30        "paddingLeft": "48px"
31    },
32    "menu": {
33        "background": "#fff",
34        "borderLeft": "none",
35        "borderTop": "none",
36        "boxShadow": "0 1px 2px 0 rgba(22,25,29,0.4)",
37        "maxHeight": "252px",
38        "maxWidth": "100%",
39        "minWidth": "168px",
40        "borderRadius": "8px 8px 0 0",
41        "boxShadowModal": "0 2px 8px 2px rgba(22,25,29,0.4)",
42        "width": "320px"
43    },
44    "header": {
45        "minHeight": "48px",
46        "padding": "2px 8px 2px 16px",
47        "fontWeight": 700
48    }
49}
```

*content\_copy*
