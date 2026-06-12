---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/experimental/diagram-shapes
widget: experimental/diagram-shapes
scraped: 2026-06-12
---

# Experimental/Diagram shapes

Diagram Shapes

Widgets provides a set of components in different shapes that are designed to be used inside a diagram.

Node

The **DiagramNode** Widget contains the following properties:

* `useAsLink`: If this property is set to `true`, the node will be treated as if it were a link and will have a dashed border.
* `selected`: Whether the node is selected or not.
* `readonly`: Whether the node is readonly or not.
* `nodeAttributes`: You can use this property to provide additional props to the **DiagramNode** element.

Default

Node

This-is-a-very-long-node-name-that-cannot-be-shown-here-please-hover-to-see

Grundstücksverkehrsgenehmigungszuständigkeitsübertragungsverordnung


Selected

Node


Link Documentation

Link Node


Selected Link Documentation

Link Node


Readonly

Node

Link Node

*code**center\_focus\_weak**bug\_report*

Label

The **DiagramLabel** Widget contains the following properties:

* `type`:
  + *main* (default): Contains main information.
  + *sub*: Contains additional information. It has smaller font-size, height and lighter than the main label.
* `text`: Main/sub information.
* `subText`: Additional information that is placed next to the main/sub information.
* `selected`: Whether the label is selected or not.
* `readonly`: Whether the label is readonly or not.
* `labelAttributes`: You can use this property to provide additional props to the **DiagramLabel** element.

Relationship name

role name

1

{ duplicable, orderable }

Selected Label

role name

Readonly Label

Readonly Sub Label

*code**center\_focus\_weak**bug\_report*

Port

The **DiagramPort** Widget is a draggable point that can be placed on a **DiagramNode** or the relationship line.

* `cornerPoint`: A kind of port to display on the corner of the relationship line. It's smaller than a default port.
* `selected`: Whether the port is selected or not.
* `readonly`: Whether the port is readonly or not.
* `portAttributes`: You can use this property to provide additional props to the **DiagramPort** element.

Default:

Selected:

Corner point:

Readonly:

*code**center\_focus\_weak**bug\_report*

Grid

A grid is created by assembling multiple sub-grids together. We provide 2 types of points called **GridMainPoint** and **GridSubPoint** to create a sub-grid. While the **GridMainPoint** represents the start/end point of a sub grid, the **GridSubPoint** represents the smaller point displayed inside.

The **GridSubPoint** contains the `isBeforeMainPoint` property to indicate whether the sub-point is the last point in a grid. This type of point must stand before the main point on a row in order to have an appropriate distance from the main point.

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* This API section only displays some of the most remarkable properties of the **Diagram Shapes** widget. To find a full set of properties, please make use of an IDE to explore the Widget's source code.
* `prop*` is required.
* `prop` is deprecated.

Types

* `DiagramLabelType = "main" | "sub"`

ModelDiagramGridSubPointProps

Property

Type

Description

`isBeforeMainPoint`

`boolean`

Whether it is the last sub-point in a grid or not.
This type of point must stand before the main point on a row in order to have an appropriate distance from the main point.

ModelDiagramLabelProps

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

`labelAttributes`

`HTMLAttributes<HTMLDivElement>`

Additional props of a div element.

`readOnly`

`boolean`

Whether the shape is in readonly mode or not.

`selected`

`boolean`

Whether the label is selected or not.

`style`

`CSSProperties`

Additional styles.

`subText`

`ReactNode`

Additional information that is placed next to the main/sub information `text` .

`text*`

`ReactNode`

Main/Sub information.

`type`

`DiagramLabelType`

* Type "main": label contains main information and has a big size
* Type "sub": label contains sub information and has a small size

**@default** main

ModelDiagramNodeProps

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

`nodeAttributes`

`HTMLAttributes<HTMLDivElement>`

Additional props of a div element.

`readOnly`

`boolean`

Whether the shape is in readonly mode or not.

`selected`

`boolean`

Whether the node is selected or not.

`style`

`CSSProperties`

Additional styles.

`useAsLink`

`boolean`

If specified, the node will have some specific styles that make it looks like a "link".

ModelDiagramPortProps

Property

Type

Description

`className`

`string`

Additional css class names.

`cornerPoint`

`boolean`

Whether the port is displayed as a corner point of edge that is treated like a port but with a half size.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`portAttributes`

`HTMLAttributes<HTMLDivElement>`

Additional props of a div element.

`readOnly`

`boolean`

Whether the shape is in readonly mode or not.

`selected`

`boolean`

Whether the port is selected or not.

`style`

`CSSProperties`

Additional styles.

Theming configuration

The following theme variables can be used to customize the component:

```
1"diagramConfig": {
2    "node": {
3        "background": "#fff",
4        "border": "2px solid #00589f",
5        "color": "#202e5d",
6        "height": "80px",
7        "width": "160px",
8        "fontFamily": "\"Open Sans\", sans-serif",
9        "fontSize": "0.85rem",
10        "fontWeight": 600,
11        "padding": "8px",
12        "selectedBG": "#CDEDFE",
13        "selectedColor": "#202e5d",
14        "leftEdgeBorder": "4px solid #00589f",
15        "boxShadow": "0 1px 2px 0 rgba(32,46,93,0.4)",
16        "hoverBorderColor": "#00589f",
17        "focusBorderColor": "#d50075",
18        "link": {
19            "border": "2px dashed #00589f"
20        },
21        "readOnly": {
22            "borderColor": "#a9b3bc"
23        }
24    },
25    "label": {
26        "background": "#ebf1f7",
27        "border": "2px solid transparent",
28        "boxShadow": "0 1px 2px 0 rgba(32,46,93,0.4)",
29        "color": "#202e5d",
30        "fontFamily": "\"Open Sans\", sans-serif",
31        "gap": "8px",
32        "mainLabel": {
33            "borderRadius": "13px",
34            "fontSize": "0.85rem",
35            "fontWeight": 600,
36            "height": "26px"
37        },
38        "subLabel": {
39            "borderRadius": "10px",
40            "fontSize": "0.75rem",
41            "fontWeight": 400,
42            "height": "20px"
43        },
44        "padding": "0 8px",
45        "selected": {
46            "background": "#CDEDFE",
47            "borderColor": "#0573ad",
48            "color": "#202e5d",
49            "leftEdge": {
50                "border": "4px solid #0573ad",
51                "mainLabel": {
52                    "top": "5px",
53                    "height": "16px"
54                },
55                "subLabel": {
56                    "top": "3px",
57                    "height": "14px"
58                }
59            }
60        },
61        "hoverBorderColor": "#00589f",
62        "focusBorderColor": "#d50075",
63        "readOnly": {
64            "background": "#f1f2f4"
65        }
66    },
67    "port": {
68        "background": "#079ae9",
69        "boxShadow": "inset 0 0 2px 0 #fff",
70        "size": "8px",
71        "cornerPoint": {
72            "size": "4px"
73        },
74        "interactiveBoxShadow": "0 1px 2px 0 rgba(32,46,93,0.4)",
75        "hoverBG": "#00589f",
76        "selectedBG": "#0573ad",
77        "readOnly": {
78            "background": "#616f7c"
79        }
80    },
81    "grid": {
82        "point": {
83            "circleBackground": "#D9EBFA",
84            "innerShapeBackground": "#9FCBF0"
85        }
86    }
87}
```

*content\_copy*
