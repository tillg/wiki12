---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-entry/pickers
widget: data-entry/pickers
scraped: 2026-06-12
---

# Widgets/Data entry/Pickers/Date picker

Date Picker

The **Date Picker** Widget is an input component that allows users to select a date. It was built on top of the [react-day-picker*open\_in\_new*](https://react-day-picker.js.org/ "Leave Page") library.

The **Date Picker** uses the **Text Field**, therefore it inherits some general features from the Text Field such as states, messages, helper text, etc. Visit the [Text Field](#/widgets/data-entry/text-field) showcase to see these common features demoed.

Basic

We provide the **DateInput** widget which is enhanced to receive an input in a "smart" way that a user can specify a date quickly without using the picker. Besides, a button is also provided to open the picker dialog.

If users enter a valid value, it will be converted to a date which is handled in the `dateConverter` and `dateFormatter`. Otherwise, an `errorMessage` will be displayed.

Date Picker, MM/DD/YYYY

*event*, Select a date

You haven't chosen a date yet.

*code**center\_focus\_weak**bug\_report*

Additional Properties

Use the `datePickerProps` to access the [library's properties*open\_in\_new*](https://react-day-picker.js.org/api/interfaces/DayPickerBase "Leave Page"), such as:

* `disabled`: to set the days as disabled.
* `modifiers`: to modify the aspect of the days, then a user can change the inline-style of the cell with `modifiersStyles` or with `modifiersClassNames`.
* `yearRange`: to modify the range of year.
* etc.

In the example below, we've customized the available range of years, and disabled Saturdays/Sundays. Disabled days (easily identifiable due to their lighter colors), cannot be selected or interacted with via the picker. If you try to enter a disabled date using the input, an error message will be shown.

Additionally, with the recent upgrade to **React DayPicker v9**, locale customization now requires using `DateTimeContext.Provider`. This means the `locale` is no longer passed directly via `datePickerProps`, but must be provided through context using **date-fns** locale objects.

Warning

*warning*

**NOTE**

Starting from **React DayPicker v9**, `modifiersStyles` and `modifiersClassNames` now target the outer table cell (`<td />`) instead of the inner interactive elements like `<button />`. As a result, custom styles applied to our **Date Picker** Widget using these options may not behave as expected and can lead to styling issues for date modifiers (e.g., highlighted or booked days, as shown in the example below).

To work around this, we recommend continuing to use `modifiersClassNames`, but target the inner interactive elements using CSS selectors.
For example:

```
.booked-classname > button {
  /* custom styles */
}
```

Custom with datePickerProps, MM/DD/YYYY

*event*, Select a date

You haven't chosen a date yet.

*code**center\_focus\_weak**bug\_report*

Date Range

This example shows how to select a range of days by using the **DateInput** widget. Here are some important properties that should be noted:

* `useRangePicker` to enable this feature.
* `dateConverter` to convert the range in string to be a range in your format. It returns an object `{from, to}` which contains the start date and end date.
* `errorMessage` to display a message when the value is invalid.

If you'd like to implement the Date Range Picker by yourself, use the **DatePicker** widget and some main properties below:

* `selected={{ from, to }}` to display a range of days as selected.
* `onDateRangeChange(range)` with the given selected `range` as an argument to handle the selected range.
* `footer` to pass a custom footer or the labels for the submit and clear buttons in the default one.

  **Note:** On touch devices, we use the `DatePickerDialog` component, so the `footer` property will be ignored. Instead, we have the `submitButton` and `clearButton` to submit and clear the date. To handle these two functionalities, use the `onDateRangeChange` mentioned above.

In this example, you can either enter or select a range. The dates selected should not be disabled and the range should conform to the following format: **MM/DD/YYYY - MM/DD/YYYY** (e.g. 11/12/2021 - 11/22/2021). If the entry is invalid, an error message will be shown.

Date Range Picker, MM/DD/YYYY - MM/DD/YYYY

*event*, Select a date

You haven't chosen a date yet.

*code**center\_focus\_weak**bug\_report*

Timezone

The date will be returned according to the given `timezone` from the `datePickerProps`. When using `timezone`, you should adjust `dateFormatter` and `dateConverter` to be consistent with `timezone` value.

The value of the `timezone` property should be one of those listed in the [Timezone Database Name*open\_in\_new*](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List "Leave Page").

**Note:** If the `timezone` is not specified, the input date will be handled according to the Coordinated Universal Time (UTC).

Timezone America/New\_York, MM/DD/YYYY

*event*, Select a date

Chosen date is *2026-06-12T04:53:55.488-04:00*

Timezone Europe/Berlin, MM/DD/YYYY

*event*, Select a date

Chosen date is *2026-06-12T10:53:55.493+02:00*

*code**center\_focus\_weak**bug\_report*

Accessibility

To ensure proper accessibility for screen readers, you can use:

* On desktop: `datePickerProps` property. This will apply attributes to `data-role="date-picker"` element.
* On mobile: `htmlAttributes` in `datePickerDialogProps` property. This will apply attributes to the picker's modal overlay container element.

Warning

*warning*

**NOTE**

For desktop, since it uses the **DayPicker** component from the **react-day-picker** library, you can only use the properties which provided in `datePickerProps` to pass the accessibility attributes.

Accessible Date Picker, MM/DD/YYYY

*event*, Select a date

You haven't chosen a date yet.

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* This API section only displays some of the most remarkable properties of the **Date Picker** widget. To find a full set of properties, please make use of an IDE to explore the Widget's source code.
* `prop*` is required.
* `prop` is deprecated.

DateInputProps

Property

Type

Description

`addonAfter`

`ReactNode | ReactNode[]`

Specifies the addons that will be placed after the input wrapper.

`addonBefore`

`ReactNode | ReactNode[]`

Specifies the addons that will be placed before the input wrapper.

`ariaDescribedby`

`string`

aria-describedby attribute for the input.

`autoComplete`

`string`

Specifies whether autocomplete is enabled.

`autoFocus`

`boolean`

Specifies whether the input should automatically get focus after rendering.

**@default** false

`buttonRef`

`RefCallback<HTMLButtonElement>`

Reference of the picker button

`className`

`string`

Additional css class names.

`customInputProps`

`CustomInputProps`

Additional non-standard props that will be added to the real HTML Input Element.

`customInputWrapperProps`

`Omit<HTMLProps<HTMLDivElement>, "ref" | "as">`

Additional props that will be placed at the Wrapper of the real HTML Input Element.

`customPickerButtonIcon`

`ReactNode`

Custom icon for the picker button

`datePickerDialogProps`

`{ clearLabel: string, htmlAttributes: HTMLAttributes<HTMLDivElement>, okLabel: string, title: string }`

Props for Date Picker on touch devices

`datePickerProps`

`DatePickerProps`

Props for Date Picker on desktop

`defaultValue`

`Date | DateRange`

Default value of Date Input.

`disabled`

`boolean`

Specifies whether the input is disabled.

`error`

`boolean`

Error state for the input widget.

`errorMessage`

`ReactNode`

Additional element that will be shown as the Error message for the input.

`fitToParent`

`boolean`

Make input's width fits to parent's width.

**@default** true

`helperText`

`ReactNode`

Additional content displayed below the inputs.

`helperTextRef`

`RefCallback<HTMLDivElement>`

The reference of the helper text.

`hideLabel`

`boolean`

Visually hides the label while keeping it accessible to screen readers.
Requires a `label` to be provided. The label text will still be announced by assistive technologies.

**@default** false

`hidePickerButton`

`boolean`

If true, the date picker button will be hidden

**@default** false

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`info`

`boolean`

Info state for the input widget.

`infoMessage`

`ReactNode`

Additional element that will be shown as the Info message for the input.

`inputProps`

`HTMLProps<HTMLInputElement>`

Additional props that will be placed at the real HTML Input Element.

`inputRef`

`RefCallback<HTMLInputElement>`

The reference of the Date Input.

**@param** instance – the input element instance.

`inputWrapperRef`

`RefCallback<HTMLDivElement>`

The reference of the input wrapper.

`label`

`ReactNode`

The input widget's label.

`labelGraphic`

`ReactNode`

Additional element that will be shown on the left of the input's label.

`labelRef`

`RefCallback<HTMLLabelElement>`

The reference of the label.

`pickerButtonTitle`

`string`

Title attribute for the picker button

`placeholder`

`string`

Specifies the placeholder that is shown in the input when it's empty.

`prefixes`

`ReactNode | ReactNode[]`

Specifies the prefixes that will be placed in front of the html-input.

`readonly`

`boolean`

Specifies whether the input is readonly.

`role`

`string`

Specifies the role attribute for the input wrapper, in order to support Accessibility.

See [Roles*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles "Leave Page")

`spellCheck`

`boolean`

Specifies whether spellCheck is enabled.

`style`

`CSSProperties`

Additional styles.

`suffixes`

`ReactNode | ReactNode[]`

Specifies the suffixes that will be placed at the end of the html-input.

`textAlignment`

`"right" | "left"`

Specifies the text alignment.

**@default** left

`tooltips`

`ReactNode`

Additional Tooltip for the input widget.

`useRangePicker`

`boolean`

If true, the date picker will have the ability to select a range of days.

**@default** false

`value`

`string`

Value of the input.

`warning`

`boolean`

Warning state for the input widget.

`warningMessage`

`ReactNode`

Additional element that will be shown as the Warning message for the input.

`clearHandler`

`(handler: void) => void`

To get the handler in order to clear all current values

**@deprecated** from 36.0.0, please use `valueChangeHandler` instead

`dateConverter*`

`(value: string) => Date | DateRange | undefined`

To convert a string to a date or returns undefined if `value` is invalid.
If so, `onInputValidationError` will be triggered.

`dateFormatter*`

`(date: Date) => string`

Date format

`onBlur`

`(ev: FocusEvent<HTMLInputElement>) => void`

Handler function when the input is blurred.

`onChange`

`(ev: ChangeEvent<HTMLInputElement>) => void`

Handler function when the value of the input is changed.

`onClick`

`(event: MouseEvent) => void`

The click handler for the input field.

`onDoubleClick`

`(event: MouseEvent<HTMLInputElement>) => void`

The handler that will be invoked when the input field is clicked twice.

`onFocus`

`(ev: FocusEvent<HTMLInputElement>) => void`

Handler function when the input is focused.

`onInput`

`(event: ChangeEvent<HTMLInputElement>) => void`

The input event is fired when the value has been changed.

`onInputChange`

`(value: string) => void`

Whether the input value is changed when typing or picking

`onInputValidationError`

`(value: string) => void`

Callback is triggered when the value is invalid.

`onKeyDown`

`(ev: KeyboardEvent<HTMLInputElement>) => void`

The key down handler for the input.

`onKeyUp`

`(ev: KeyboardEvent<HTMLInputElement>) => void`

The key up handler for the input.

`onSelectedDayChange`

`(selectedDay: Date | undefined) => void`

Whether a date is selected from the picker

`onWrapperClick`

`(event: MouseEvent<HTMLElement>) => void`

A callback will be triggered when the input wrapper has been clicked.

`onWrapperKeyDown`

`(event: KeyboardEvent<HTMLElement>) => void`

The key down handler for the input wrapper.

`onWrapperKeyPress`

`(event: KeyboardEvent<HTMLElement>) => void`

The key press handler for the input wrapper.

`onWrapperMouseDown`

`(event: MouseEvent<HTMLElement>) => void`

Mouse down handler for the input wrapper.

`valueChangeHandler`

`(handler: React.RefCallback<DateRange>) => void`

Used for updating the value of the selected date from outside the DateInput widget.
handler - Used for updating the value of the input/selected date.
value - If the value being passed to the handler is defined, it will be set as the input's/selected date's new value. If the value being passed is undefined, the input and selected date values will be cleared.

DatePickerProps

Property

Type

Description

`footer`

`PickerFooter`

If it's a date-range picker which means the range `{from, to}` in `selected` or `onDateRangeChange` is defined, a default footer
will be rendered which has the following buttons with the labels will be passed by users by using `PickerFooter` .

* A button to save the acceptable date
* A button to clear the selected date

In addition, users can pass any elements to replace the default one.

To use a picker without footer, pass an empty element into this prop.

`months`

`string[]`

A string array that can be used to customize month names.

`selected`

`Matcher | Matcher[]`

A value or an array that can be used to define selected days.

`timezone`

`string`

Timezone database name e.g.: America/New\_York

See [Timezone Database*open\_in\_new*](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List "Leave Page")

`value`

`Date`

Set the selected date.

`wrapperRef`

`RefCallback<HTMLElement>`

The reference of the element wrapping the main content if one exists.

`yearRange`

`YearRange`

Override the year selection range.

`onChange`

`(value: Date) => void`

Trigger when the date is selected.

`onDateRangeChange`

`(range?: DateRange) => void`

Callback that is called when the date range is selected.

Theming configuration

The following theme variables can be used to customize the component:

```
1"datePicker": {
2    "wrapper": {
3        "boxShadow": "0 1px 2px 0 rgba(22,25,29,0.4)"
4    },
5    "navBar": {
6        "background": "#fff"
7    },
8    "navButton": {
9        "size": "32px"
10    },
11    "month": {
12        "background": "#fff",
13        "borderRadius": "0",
14        "fontSize": "0.875rem"
15    },
16    "caption": {
17        "fontWeight": 700,
18        "height": "48px",
19        "fieldSelect": {
20            "firstChildMargin": "0 16px 0 0",
21            "arrowIcon": {
22                "color": "#00589f",
23                "fontSize": "1.25rem",
24                "width": "32px"
25            }
26        },
27        "selectInput": {
28            "background": "#ebf1f7",
29            "border": "2px solid transparent",
30            "borderRadius": "2px",
31            "color": "#00589f",
32            "height": "32px",
33            "padding": "0 32px 0 8px",
34            "active": {
35                "background": "#00589f",
36                "border": "2px solid #00589f"
37            },
38            "hover": {
39                "background": "rgba(0,0,0,0.2)",
40                "border": "2px solid #00589f"
41            },
42            "focus": {
43                "background": "#ebf1f7",
44                "border": "2px solid #d50075",
45                "color": "#00589f"
46            }
47        },
48        "selectOption": {
49            "background": "#fff",
50            "color": "#333",
51            "active": {
52                "background": "#00589f",
53                "color": "#fff"
54            },
55            "hover": {
56                "background": "#00589f",
57                "color": "#fff"
58            }
59        }
60    },
61    "week": {
62        "margin": "4px 0 0 0"
63    },
64    "weekday": {
65        "color": "#333",
66        "fontSize": "0.875rem",
67        "fontWeight": 700,
68        "padding": "24.5px 0 calc(25px / 2)",
69        "width": "32px"
70    },
71    "body": {
72        "color": "#333",
73        "padding": "0 14px 24px",
74        "horizontalCellSpacing": "4px",
75        "verticalCellSpacing": "0"
76    },
77    "day": {
78        "border": "2px solid transparent",
79        "fontSize": "0.75rem",
80        "size": "32px",
81        "margin": "0",
82        "active": {
83            "background": "#fff",
84            "border": "2px solid #00589f"
85        },
86        "hover": {
87            "background": "#fff",
88            "border": "2px solid #00589f"
89        },
90        "focus": {
91            "background": "#fff",
92            "border": "2px solid #d50075"
93        },
94        "today": {
95            "background": "#e2e6e9",
96            "borderRadius": "50%",
97            "fontWeight": 700
98        },
99        "outside": {
100            "color": "#e2e6e9"
101        },
102        "selected": {
103            "background": "#00589f",
104            "color": "#fff",
105            "range": {
106                "background": "#f5fbff",
107                "color": "#00589f",
108                "disabled": {
109                    "background": "#e2e6e9",
110                    "color": "#a9b3bc"
111                }
112            },
113            "interaction": {
114                "active": {
115                    "background": "#fff",
116                    "border": "2px solid #00589f",
117                    "color": "#00589f"
118                },
119                "focus": {
120                    "background": "#fff",
121                    "border": "2px solid #d50075",
122                    "color": "#d50075"
123                },
124                "hover": {
125                    "background": "#fff",
126                    "border": "2px solid #00589f",
127                    "color": "#00589f"
128                }
129            }
130        },
131        "disabled": {
132            "color": "#a9b3bc"
133        }
134    },
135    "root": {
136        "boxShadow": "0 1px 2px 0 rgba(22,25,29,0.4)"
137    },
138    "footer": {
139        "background": "#f1f2f4",
140        "minHeight": "48px",
141        "padding": "0 16px"
142    },
143    "mobile": {
144        "container": {
145            "borderRadius": "0"
146        },
147        "header": {
148            "background": "#fff",
149            "height": "48px",
150            "padding": "0 16px",
151            "icon": {
152                "color": "#00589f",
153                "fontSize": "2.25rem"
154            },
155            "title": {
156                "color": "#333",
157                "fontSize": "0.875rem",
158                "fontWeight": 700
159            }
160        },
161        "navBar": {
162            "background": "#f1f2f4"
163        },
164        "fieldSelect": {
165            "firstChildMargin": "0 8px 0 0",
166            "background": "#fff",
167            "color": "#333",
168            "fontSize": "1rem",
169            "focusBoxShadow": "0 0 2px 0 #d50075"
170        },
171        "day": {
172            "size": "40px"
173        },
174        "footer": {
175            "borderTop": "none"
176        }
177    }
178}
```

*content\_copy*
