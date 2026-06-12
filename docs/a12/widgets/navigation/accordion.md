---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/navigation/accordion
widget: navigation/accordion
scraped: 2026-06-12
---

# Widgets/Navigation/Accordion

Accordion

The **Accordion** Widget is a great option if you need to squeeze a lot of content into a small space. It is comprised of different sections that can be toggled open and closed.

Accordions contain interactive `Section`. By wrapping these sections inside of a `Container`, it's possible to use the up/down arrows or tab keys to navigate.

Each section contains a:

* `Summary`: element that displays the title of the section.
* `Details`: element that displays the section's content which will be shown when it's clicked or after pressing the Enter key while focused on the title.
* `tabIndex`: which indicates the content that can be focused on for keyboard navigation.

Basic Accordion

It's possible to set a maximum height for elements (see Section 2), and/or use the `graphic` property to display icons, images or other elements in front of a section's title.

You can also use the `expandIcon` and `collapseIcon` properties to customize an individual section's trailing icon based on whether the section is expanded or collapsed.

Alternatively, you can customize the collapse/expand icons of all sections by passing the icons you'd like to use to the Container's `expandIcon` and `collapseIcon` properties. To see an example usage of customizing an entire Container's icons, check out the [Controlled Accordion](#/widgets/navigation/accordion#controlled-accordion) showcase below.

*cake*

Section 1

*add*

*card\_giftcard*

Section 2

*expand\_more*

*local\_florist*

Section 3

*add*

*code**center\_focus\_weak**bug\_report*

Variant Accordion

Besides allowing to pass an icon by the `graphic` property, the **Accordion** also provides a set of variants to indicate the status of a section.

You can use the `variant` property to select your desired status: `open`, `info`, `error`, `warning`, `inProgress`, or `done`. Once it is defined, a specific icon corresponding to that variant will be shown.

*radio\_button\_unchecked*

Open Section - Open

*add*

*info*

Info Section - Info

*add*

**

Error Section - Error

*add*

*warning*

Warning Section - Warning

*add*

*pending*

In Progress Section - In progress

*add*

*check\_circle*

Done Section - Done

*add*

*code**center\_focus\_weak**bug\_report*

Nested Accordion

You can build a nested accordion by wrapping sections inside of other sections.

*dvr*

1

*add*

2

3

4 with a very long label that is too long to be able to fit on a single line

*remove*

First

Second

*remove*

2.1st Menu

2.2nd Menu

K Menu

*add*

*settings*

*screen\_lock\_portrait*

Z Menu

*add*

*code**center\_focus\_weak**bug\_report*

Controlled Accordion

By default, the collapse/expand state of sections is controlled by the Accordion itself. If you'd like to control the state yourself (perhaps to open/close multiple sections at the same time amongst other possibilities), you can do so by setting the Container's `controlled` property to true and then handling the Sections' following properties:

* `expanded`: determines whether the content should be shown. The default value is `false`.
* `onClick`: handles the event when a user clicks the section.

Section 1

*expand\_more*

Section 2

*expand\_less*

The A12 widget library is part of the A12 Business Application Platform.
Sit ut in ipsum tempor non dolor labore. Ex exercitation aute sit fugiat duis consectetur eu occaecat eiusmod sit.
Incididunt excepteur ullamco nisi velit amet laborum eiusmod amet consectetur sint dolore.
Minim pariatur consectetur sint pariatur amet ex sunt cupidatat nostrud nostrud quis nisi.
Aliquip Lorem magna voluptate voluptate cupidatat ex sit voluptate reprehenderit in proident.
Dolore tempor commodo eu deserunt aute occaecat in ipsum laborum magna officia aute nostrud consequat.
Officia elit ut nisi Lorem eu laboris reprehenderit ex aliqua enim voluptate. Excepteur in et aute incididunt elit.
Ipsum irure deserunt exercitation incididunt mollit officia non officia sunt do labore fugiat tempor ad.
Sunt cillum aliqua ex ad adipisicing. Reprehenderit id et labore laborum mollit.
Aliquip enim consequat anim in enim culpa nulla dolor amet in tempor.
Reprehenderit dolor irure proident mollit nostrud reprehenderit commodo.
Ipsum aliqua non commodo eiusmod ad in dolore consectetur amet.
Quis non officia occaecat cupidatat occaecat excepteur cupidatat exercitation dolore nostrud veniam irure adipisicing.
Exercitation pariatur irure consequat enim anim. Irure ea laboris sint consectetur.
Cillum irure et duis magna anim officia proident ex. Incididunt dolore eu esse aliquip duis dolore magna.
Duis minim laborum non excepteur officia exercitation sunt amet nostrud veniam excepteur.
Do elit minim commodo ea anim dolor laborum do sit laboris in quis.
Velit aute quis sit irure officia enim ut excepteur. Ipsum qui qui nulla sunt sit dolor nisi anim culpa officia.
Id deserunt labore excepteur sit elit non fugiat. Elit excepteur dolore voluptate anim cillum dolor commodo fugiat id nisi officia culpa.
Lorem exercitation proident id consectetur fugiat ex officia cillum.

Section 3

*expand\_more*

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* This API section only displays some of the most remarkable properties of the **Accordion** widget. To find a full set of properties, please make use of an IDE to explore the Widget's source code.
* `prop*` is required.
* `prop` is deprecated.

AccordionProps.ContainerProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`collapseIcon`

`ReactNode`

Default icon for collapsing for the accordion.

**@default** remove

`controlled`

`boolean`

Determines if the Accordion will be controlled manually by the user with the `SectionProps.expanded` property.

`expandIcon`

`ReactNode`

Default icon for expanding for the accordion.

**@default** add

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`role`

`string`

Custom role

**@default** "navigation"

`style`

`CSSProperties`

Additional styles.

`wrapperRef`

`RefCallback<HTMLDivElement>`

The reference of the element wrapping the main content if one exists.

AccordionProps.DetailsProps

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

`tabIndex`

`number`

Specify the tabIndex attribute.

AccordionProps.SectionProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`collapseIcon`

`ReactNode`

Icon for collapsing. Has priority over the icon set by the surrounding accordion.

`expanded`

`boolean`

The initial state of the section.

If `ContainerProps.controlled` is set to true, this property determines the state of the section.

`expandIcon`

`ReactNode`

Icon for expanding. Has priority over the icon set by the surrounding accordion.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`selected`

`boolean`

Whether the accordion is selected.

`style`

`CSSProperties`

Additional styles.

`onClick`

`(event: MouseEvent<HTMLElement>) => void`

Click handler for custom behaviour

**@param** event – HTML mouse event.

AccordionProps.SummaryProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`graphic`

`ReactNode`

Additional icon will be shown on the left of the title.

**Note:** If the `variant` is set, the icon from that property will take priority.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`style`

`CSSProperties`

Additional styles.

`variant`

`AccordionVariant`

Variant of an accordion. There are 6 values: `open` , `info` , `error` , `warning` , `done` , and `inProgress` .
If it is defined, a specific icon corresponding to that variant will be displayed.

Theming configuration

The following theme variables can be used to customize the component:

```
1"accordion": {
2    "details": {
3        "background": "#f7fafc",
4        "fontSize": "0.75rem",
5        "menu": {
6            "paddingLeft": "32px"
7        }
8    },
9    "fontFamily": "\"Open Sans\", sans-serif",
10    "graphic": {
11        "color": "#00589f",
12        "fontSize": "1.25rem",
13        "padding": "0 16px 0 0"
14    },
15    "summary": {
16        "active": {
17            "border": "2px solid #00589f"
18        },
19        "border": "1px solid #e2e6e9",
20        "borderRadius": "0",
21        "focus": {
22            "border": "2px solid #d50075",
23            "outline": "1px dotted #00589f"
24        },
25        "hover": {
26            "border": "2px solid #00589f"
27        },
28        "minHeight": "48px",
29        "padding": "8px 2px 8px 24px",
30        "selected": {
31            "background": "#fff",
32            "borderLeft": {
33                "active": "4px solid #00589f",
34                "focus": "4px solid #d50075",
35                "hover": "4px solid #00589f",
36                "nonActive": "4px solid #00589f"
37            },
38            "color": "#00589f"
39        },
40        "icon": {
41            "variant": {
42                "open": "#333",
43                "info": "#0277bd",
44                "error": "#c62828",
45                "warning": "#ad7d04",
46                "inProgress": "#0277bd",
47                "done": "#2e7d32"
48            }
49        }
50    },
51    "text": {
52        "color": "#00589f",
53        "fontFamily": "\"Open Sans\", sans-serif",
54        "fontSize": "0.75rem",
55        "fontWeight": 600,
56        "padding": "0",
57        "expanded": {
58            "fontWeight": 600
59        }
60    }
61}
```

*content\_copy*
