---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/business-case/wizard
widget: business-case/wizard
scraped: 2026-06-12
---

# Widgets/Business case/Wizard

Wizard

The **Wizard** Widget can be used to demonstrate a complex business process by breaking it down into simpler pieces.

Basic

The **Wizard** comes with three main elements:

* **Step**: You can use this element to display a step in a Wizard.
* **PreviousStepButton**: You can use this element to display a step-navigation button on the left side of the Wizard.
* **NextStepButton**: You can use this element to display a step-navigation button on the right side of the Wizard.

The label of each **Step** element can be truncated by setting the `truncate` property of the **Wizard** to `true`. The `title` property should also be set for each `Step` element to make the **Step** readable when its label is truncated.

*keyboard\_arrow\_left*

*description*Preconditions

Further steps...*more\_horiz*

*keyboard\_arrow\_right*

*code**center\_focus\_weak**bug\_report*

States

There are two different **Step** behaviors besides the default:

* Non-interactive: You can make a **Step** element only accessible via navigation buttons by setting the `nonInteractive` property to `true`.
* Disabled: You can make a **Step** element disabled by setting the `disabled` property to `true`.

Moreover, there are four variants of a **Step** element: info (default), `finished`, `warning`, and `error`.

Non-interactive

*keyboard\_arrow\_left*

*description*Preconditions

Further steps...*more\_horiz*

*keyboard\_arrow\_right*


Disabled

*keyboard\_arrow\_left*

Preconditions

Further steps...*more\_horiz*

*keyboard\_arrow\_right*

*code**center\_focus\_weak**bug\_report*

Responsive

The wizard becomes responsive by setting the `responsive` property to `true`, and the advance options can be configurable via the `responsiveBehaviour` property.

In addition, it needs to set the `truncate` property to be `true`, and add the `title` property for steps to support accessibility.

**Current width:** 100%

Responsive Behaviour

Previous steps will be hidden first - focus on current step

Next steps will be hidden first - focus on current step

Previous steps will be hidden first - focus on start, end and current step

Next steps will be hidden first - focus on start, end and current step

Show navigation buttons

*keyboard\_arrow\_left*

*description*Preconditions

Further steps...*more\_horiz*

*keyboard\_arrow\_right*

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

WizardProps.ResponsiveBehaviour

Property

Type

Description

`focusOnBoundary`

`boolean`

If true, focus on start, end and current step. Otherwise, focus on current step.

`nextStepFirst`

`boolean`

If true, the next steps will be hidden first.

WizardNavigationButtonProps

Property

Type

Description

`className`

`string`

Additional css class names.

`disabled`

`boolean`

Specify whether the button is disabled.

`icon`

`ReactNode`

Additional icon for the button.

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

`onClick`

`void`

Click handler for the button.

WizardProps

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

`responsive`

`boolean`

When the total width of children is larger than the Wizard's width
the steps will be collapsed to left-out steps.

**@default** false

`responsiveBehaviour`

`ResponsiveBehaviour`

Config responsive behavior.

**@default** Previous steps will be hidden and focus on current step.

`style`

`CSSProperties`

Additional styles.

`truncate`

`boolean`

If true, the step labels can be truncated.
In this case, the step's `WizardStepProps.title` props should be set to make them readable.

WizardStepProps

Property

Type

Description

`className`

`string`

Additional css class names.

`disabled`

`boolean`

Specify whether the step is disabled.

`error`

`boolean`

Specify whether there is an error with a step.

`finished`

`boolean`

Specify whether a step is finished.

`icon`

`ReactNode`

Additional icon for a step.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`label`

`ReactNode`

Label is placed inside a step.

`leftOut`

`boolean`

Specify whether there is a left-out step.

`nonInteractive`

`boolean`

Set to true to create a non-interactive step.

`selected`

`boolean`

Specify whether the step is selected.

`style`

`CSSProperties`

Additional styles.

`title`

`string`

Specify the hint text that will be shown on mouse over.

`warning`

`boolean`

Specify whether there is a warning with a step.

`wrapperRef`

`RefCallback<HTMLElement>`

The reference of the element wrapping the main content if one exists.

`onClick`

`(event: MouseEvent<HTMLElement>) => void`

Click handler for the step.

Theming configuration

The **Wizard** contains [Icon](#/widgets/general/icon#icon-theme-configuration) widgets, therefore it inherits the style configuration of that component.

Additionally, the component provides built-in theme variables that can be used to customize itself:

```
1"wizard": {
2    "navigator": {
3        "active": {
4            "border": "2px solid #00589f",
5            "color": "#d50075"
6        },
7        "background": "#ebf1f7",
8        "color": "#00589f",
9        "disabledColor": "#a9b3bc",
10        "focus": {
11            "border": "2px solid #d50075",
12            "color": "#d50075",
13            "outline": "1px dotted #00589f"
14        },
15        "fontSize": "1.25rem",
16        "hover": {
17            "border": "2px solid #00589f",
18            "color": "#00589f"
19        },
20        "margin": "0 0 0 2px",
21        "padding": "0 24px"
22    },
23    "content": {
24        "wrapper": {
25            "nonIconPadding": "12px 0",
26            "padding": "10px 0"
27        },
28        "background": "#ebf1f7",
29        "color": "#00589f",
30        "fontFamily": "\"Open Sans\", sans-serif",
31        "fontSize": "0.75rem",
32        "fontWeight": 600,
33        "iconFontSize": "1.25rem",
34        "gap": "4px",
35        "margin": "4px 20px 4px 8px",
36        "nonInteractiveColor": "#333",
37        "padding": 0
38    },
39    "minHeight": "48px",
40    "step": {
41        "activeColor": "#d50075",
42        "border": "1px solid #a9b3bc",
43        "disabledColor": "#a9b3bc",
44        "focusColor": "#d50075",
45        "hover": {
46            "background": "#f1f2f4",
47            "color": "#00589f"
48        },
49        "leftOut": {
50            "background": "#f7fafc",
51            "padding": 0
52        },
53        "margin": "-1px -12px -1px 0",
54        "minWidth": "78px",
55        "selected": {
56            "active": {
57                "background": "#00589f",
58                "color": "#fff"
59            },
60            "background": "#00589f",
61            "color": "#fff",
62            "finishedBG": "#2e7d32",
63            "focus": {
64                "background": "#00589f",
65                "color": "#fff"
66            },
67            "hover": {
68                "background": "#00589f",
69                "color": "#fff"
70            }
71        }
72    },
73    "tip": {
74        "color": "#a9b3bc",
75        "width": "12px"
76    }
77}
```

*content\_copy*
