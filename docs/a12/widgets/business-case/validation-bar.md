---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/business-case/validation-bar
widget: business-case/validation-bar
scraped: 2026-06-12
---

# Widgets/Business case/Validation bar

Validation Bar

The **Validation Bar** Widget is a component that helps to display pieces of validation information.

The **ValidationBar** component is intentionally used for desktops and tablets, while the components under the **MobileValidation** namespace are for phones.

Variations

Besides the default `error` variant, `warning` and `info` can be used to demonstrate the corresponding validation level via the `variant` property.

One can set the titles of the bar using the `primaryTitle` and `secondaryTitle` properties, and add useful actions via the `quickAccessMenu` property, e.g. focus on the issued fields or expand the detailed message.

*info*

Info:

Info description: Id anim fugiat sint enim non nisi reprehenderit. Irure mollit sit et magna non dolor do. Ex pariatur excepteur tempor laborum eiusmod. Veniam do aliqua magna culpa ut excepteur cillum deserunt non exercitation dolor cupidatat cupidatat aliqua. Id Lorem esse Lorem laboris in qui amet labore ea aliquip consectetur in est commodo. Culpa sint laborum ex mollit consectetur. Sunt labore qui pariatur exercitation eiusmod tempor esse.

Path > to > the > cause > of > info

*location\_searching*

*arrow\_drop\_down*


*warning\_amber*

Warning:

Warning description: Enim aliqua ipsum mollit voluptate nostrud commodo aliquip proident ex amet consectetur. Eiusmod pariatur deserunt commodo aute excepteur pariatur. Irure aute ad exercitation Lorem commodo esse Lorem consequat quis Lorem eu esse nostrud consequat. Nulla cupidatat voluptate eu amet consequat. Ad excepteur amet irure Lorem veniam occaecat sint consequat dolore dolore elit ut. Nulla nulla enim ut aute dolor. Eiusmod est eiusmod occaecat et.

Path > to > the > cause > of > warning

*location\_searching*

*arrow\_drop\_down*


**

Error:

Error description: Nostrud voluptate ut dolore commodo nulla elit fugiat ad nostrud veniam incididunt laborum tempor. Eu anim nisi exercitation eiusmod ullamco ullamco elit esse irure sit sunt minim. Esse officia officia est Lorem sit. Cillum cupidatat cillum irure sit. Nostrud Lorem non esse irure esse exercitation. Irure do nisi dolor reprehenderit et. Enim veniam labore enim velit est mollit.

Path > to > the > cause > of > error

*location\_searching*

*arrow\_drop\_down*

*code**center\_focus\_weak**bug\_report*

Example

This is a registration form example where the **Validation Bar** is embedded in the **ActionContentBox** component with some mobile optimizations.

Using the **MobileValidation.Overview** component to have a quick look at how many issues to be resolved through the `leftElement` property, while detailed views can be shown by clicking it via the `onClick` handler property.

Then the **MobileValidation** component itself is used to render an overview and detailed view together with some utility components, e.g. `PreviewList`, `Actions`, `Content`, etc.

Sign up with email

**

Error:

Error

*03 issue(s)*

*unfold\_more*

*arrow\_drop\_down*

Full name, John Doe

Email, johndoe@mail.com

*Error*

Your email is invalid. Please provide a valid one.

Password

*warningWarning*

Your password is too easy to guess. Please use at least 8 characters with a mix of numbers, lower and upper letters.

*Error*

You have to agree to our terms to create the account.

I agree to the [Terms of Services](#) and [Privacy Policy](#)

Create account

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

ValidationBar

Types

* `ValidationBarVariant = "warning" | "error" | "info"`

ValidationBarProps

Property

Type

Description

`autoFocus`

`boolean`

Autofocus when ValidationBar is mounted.

**@default** true

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`icon`

`ReactNode`

Icon on the header of Validation Bar.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`pagination`

`ReactNode`

Pagination for the bar.

`primaryTitle`

`ReactNode`

Primary title will display on the header.

`quickAccessMenu`

`ReactNode`

Menu for quick access actions.

`secondaryTitle`

`ReactNode`

Secondary title will display below primary title.

`style`

`CSSProperties`

Additional styles.

`titleRef`

`RefCallback<HTMLDivElement>`

Callback to get ref of the title.

`variant`

`ValidationBarVariant`

Variant of the Validation Bar.

**@default** error.

`wrapperRef`

`RefCallback<HTMLElement>`

The reference of the element wrapping the main content if one exists.

MobileValidationBar

Types

* `MobileValidationProps.ActionsItemProps = BaseProps`
* `MobileValidationProps.ActionsProps = BaseProps`
* `MobileValidationProps.ContentProps = BaseProps`
* `MobileValidationProps.PreviewListProps = BaseProps`

MobileValidationProps.BaseProps

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

MobileValidationProps.GraphicProps

Property

Type

Description

`a11yTitleSupport`

`boolean`

* Whether a hidden text is added after the graphic's text.
* The supported texts are suitable only for the Overview.
  Error: "Fehler, Klicken für Übersicht" (German) and "Errors, click to show list" (English)
  Warning: "Warnungen, Klicken für Übersicht" (German) and "Warnings, click to show list" (English)

**@default** false

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`icon`

`ReactNode`

The icon of the graphic.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`style`

`CSSProperties`

Additional styles.

`variant`

`ValidationBarVariant`

Variant of the Validation Bar.

**@default** error.

MobileValidationProps.OverviewProps

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

`leftElement`

`ReactNode`

Element on the left of the Overview's title.

`rightElement`

`ReactNode`

Element on the right of the Overview's title.

`style`

`CSSProperties`

Additional styles.

`variant`

`ValidationBarVariant`

Variant of the Mobile Validation Bar Overview.

**@default** error.

`onClick`

`(event: MouseEvent) => void`

A click handler usually uses to open the Overview.

`onKeyDown`

`(event: KeyboardEvent<HTMLElement>) => void`

A handler will be triggered on keydown event.

MobileValidationProps.PreviewListItemProps

Property

Type

Description

`className`

`string`

Additional css class names.

`icon`

`ReactNode`

Icon for the preview item.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`maxLineOfText`

`number`

Max line for the text.

**@default** 3

`meta`

`ReactNode`

Meta item to render.

`style`

`CSSProperties`

Additional styles.

`text*`

`string`

Text for the preview item.

`variant`

`ValidationBarVariant`

Variant of the item.

**@default** error

`onClick`

`(event?: MouseEvent<HTMLElement, MouseEvent>) => void`

Click handler for the preview item.

MobileValidationProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`footer`

`ReactNode`

Footer of the view.

`headingPrefixes`

`ReactNode`

Prefix elements are placed before the title.

`headingSuffixes`

`ReactNode`

Suffix elements are placed after the title.

`headingTitle*`

`ReactNode`

Title of the heading.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`style`

`CSSProperties`

Additional styles.

`variant`

`ValidationBarVariant`

Variant of the Mobile Validation Bar.

**@default** error.

`wrapperRef`

`RefCallback<HTMLDivElement>`

The reference of the element wrapping the main content if one exists.

`onClose`

`void`

If specified, render a close button.

Theming configuration

The **Validation Bar** contains a [List](#/widgets/data-display/list#list-theme-configuration) widget, therefore it inherits the style configuration of that component.

Additionally, the component provides built-in theme variables that can be used to customize itself:

```
1"validationBar": {
2    "padding": 0,
3    "variant": {
4        "error": "#c62828",
5        "info": "#0277bd",
6        "warning": "#fcce34",
7        "text": {
8            "error": "#fff",
9            "info": "#fff",
10            "warning": "#16191d"
11        }
12    },
13    "graphic": {
14        "padding": 0,
15        "margin": "0 8px 0 0",
16        "fontSize": "1.25rem"
17    },
18    "pagination": {
19        "margin": "0 0 0 16px"
20    },
21    "header": {
22        "padding": "2px 24px",
23        "minHeight": "48px"
24    },
25    "title": {
26        "lineHeight": "1rem",
27        "padding": "0 2px",
28        "margin": "0 0 0 16px"
29    },
30    "primaryTitle": {
31        "fontFamily": "\"Open Sans\", sans-serif",
32        "fontSize": "0.75rem",
33        "fontWeight": 800
34    },
35    "secondaryTitle": {
36        "fontFamily": "\"Open Sans\", sans-serif",
37        "fontSize": "0.75rem",
38        "fontWeight": 400
39    },
40    "content": {
41        "background": "#fff",
42        "borderRadius": "3px",
43        "color": "#333",
44        "fontSize": "0.75rem",
45        "fontWeight": 400,
46        "margin": "0 2px 2px",
47        "height": "180px",
48        "padding": "24px 24px 0",
49        "spacingBottom": "8px"
50    },
51    "mobile": {
52        "borderRadius": "8px",
53        "overview": {
54            "minHeight": "48px",
55            "padding": "0 24px",
56            "right": {
57                "fontSize": "1.25rem"
58            }
59        },
60        "graphic": {
61            "gap": "16px",
62            "icon": {
63                "margin": "0 8px 0 0",
64                "fontSize": "1.25rem"
65            },
66            "content": {
67                "fontFamily": "\"Open Sans\", sans-serif",
68                "fontSize": "0.75rem",
69                "fontWeight": 700
70            }
71        },
72        "content": {
73            "background": "#fff",
74            "padding": "24px 24px 0",
75            "height": "24px"
76        },
77        "previewList": {
78            "background": "#fff",
79            "item": {
80                "padding": "16px 24px",
81                "borderBottom": "1px solid #e2e6e9",
82                "graphicHeight": "24px",
83                "graphicMargin": "0 8px 0 0",
84                "graphicFontSize": "1.25rem",
85                "textFontSize": "0.75rem",
86                "metaFontSize": "1.5rem",
87                "metaMargin": "0 0 0 8px"
88            }
89        }
90    }
91}
```

*content\_copy*
