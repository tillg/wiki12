---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-display/tree
widget: data-display/tree
scraped: 2026-06-12
---

# Widgets/Data display/Tree

Tree

The **Tree** Widget represents a hierarchical list. It can be used to display a file system including folders and files.

Basically, to create a tree, you can use our provided templates:

* `TreeContainer` to wrap the tree nodes.
* `TreeNode` to define a node.

Or use the `Tree` component and pass an object structure of nodes to the `root` property.

Basic

You can add more behaviors to a **Tree**. Currently, there are 4 built-in behaviors:

* Selectable
* Collapsible
* [Insertable](#/widgets/data-display/tree#insertable)
* [DragDrop](#/widgets/data-display/tree#drag-and-drop) (Drag & Drop)

These behaviors can be described as a chain. The first in the chain must be `TreeAdapter`. You must pass a tree template component to the `TreeAdapter` to obtain a component that has behavioral tree props, then you can continue to pass it to the behaviors that you want to add. You also have to write the functions to handle your added behaviors.

In this example, we show you how to create a selectable and collapsible tree by using the `Selectable` and `Collapsible` behaviors. We also provide the respective callbacks for handling:

* `onToggleSelection`: to update the selected node.
* `onToggleExpansion`: to update the expanded/collapsed state of a node.

In addition, we provide an ability to collapse/expand programmatically a node by its id after the **Tree** is rendered:

* `expandNodeHandler`: provides the collapse method.
* `collapseNodeHandler`: provides the expand method.

Selectable,

*expand\_more*

*computer*

My Computer

*edit*

Selectable,

*expand\_more*

*storage*

C:

*edit*

Selectable,

*folder*

Programs

*edit*

Selected,

*expand\_more*

*folder*

ZANS and quiet a long text, that it has to display multiline

*edit*

Selectable,

*expand\_more*

*folder*

System32

*edit*

Disabled,

*insert\_drive\_file*

sasser.dll

*edit*

Selectable,

*insert\_drive\_file*

swap.sys

*edit*

Selectable,

*storage*

D:

*edit*

Disabled,

*chevron\_right*

*storage*

E:

*edit*

*code**center\_focus\_weak**bug\_report*

Insertable

The `Insertable` behavior helps to insert new nodes into a **Tree**. We provide a handler called `onInsert(position, node)` to update the **Tree** based on the given inserted position and the node to insert.

Selectable,

*expand\_more*

1 Submission

**1 Submission

Selectable,

*expand\_more*

2 General Data

******2 General Data

Selectable,

3 Costs

******3 Costs

Selectable,

4 Time

******4 Time

Selectable,

*chevron\_right*

5 More Data

******5 More Data

Selectable,

*expand\_more*

7 Partner

******7 Partner

Selectable,

8 Client

******8 Client

Selectable,

9 Broker

******9 Broker

Selectable,

10 Subagent

******10 Subagent

Selectable,

11 Insurance Company

******11 Insurance Company

Selectable,

12 More Data

******12 More Data

*code**center\_focus\_weak**bug\_report*

Drag and Drop

This example demonstrates how to use the `DragDrop` behavior in a **Tree** with its specialized properties:

* `onDragDrop`: to define what will happen when you drag and drop a node.
* `canDrag`: whether the source can be dragged or not.
* `canDrop`: whether the target can be dropped in or not.
* `strictDnD`: whether the droppable area is limited.
  + If this property is set to `true`,
    - dropping one node **above** another is allowed if the hovered node is the first node in the current level.
    - dropping one node **below** another is allowed if the hovered node is collapsed or does not have children.
  + If this property is set to `false`, both dropping above and below a node will be allowed.
    - `precedingNode` will be returned in drop result that indicates you are going to drop a node **after** the node you are dragging over.
    - `subsequentNode` will be returned in drop result that indicates you are going to drop a node **before** the node you are dragging over.

Besides the `DragDrop` behavior, the **Tree** below also combines with other interactive behaviors:

* Selectable
* Collapsible

Selectable,

*expand\_more*

*computer*

My Computer

Selectable,

*expand\_more*

10 Entries10

C:

Selectable,

*folder*

Programs

Selectable,

9+ Entries9+

Temp

Selectable,

*expand\_more*

![](images/dnd_image.png)

ZANS and quiet a long text, that it has to display multiline

Selectable,

*expand\_more*

*folder*

System32

Selectable,

*insert\_drive\_file*

sasser.dll

Selectable,

3 Entries3*done*

swap.sys

Selectable,

*folder*

Locked

Selected,

*storage*

D:

Selectable,

*chevron\_right*

*storage*

E:

*code**center\_focus\_weak**bug\_report*

Accessibility

`tplTreeNode` property lets you customize the content of a tree node. When providing custom components, ensure accessibility is preserved by including the appropriate ARIA attributes and roles.

To expose node data to the screen reader (e.g. reading the node ID when an action button is focused), include it in the button's `title` or use a `HiddenText` linked via button's `aria-describedby`/`aria-labelledby`. See the Action Button in the example below.

Selectable,

*expand\_more*

*computer*

My Computer

*edit*Edit My Computer

Selectable,

*expand\_more*

*storage*

C:

*edit*

Selectable,

*folder*

Programs

*edit*

Selected,

*expand\_more*

*folder*

ZANS and quiet a long text, that it has to display multiline

*edit*

Selectable,

*expand\_more*

*folder*

System32

*edit*

Disabled,

*insert\_drive\_file*

sasser.dll

*edit*

Selectable,

*insert\_drive\_file*

swap.sys

*edit*

Selectable,

*storage*

D:

*edit*

Disabled,

*chevron\_right*

*storage*

E:

*edit*

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* This API section only displays some of the most remarkable properties of the **Tree** widget. To find a full set of properties, please make use of an IDE to explore the Widget's source code.
* `prop*` is required.
* `prop` is deprecated.

Tree Template

TreeTemplateProps

Property

Type

Description

`className`

`string`

Additional css class names.

`fitToParent`

`boolean`

Whether the tree fits 100% to the parent.

`getDOMRef`

`RefCallback<HTMLElement>`

Callback to get ref of the tree.

**@param** ref – the reference to the root node content element.

`hideRoot`

`boolean`

Whether the top-level node should be hidden.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`root*`

`TreeNodeTemplateModel`

Root of the tree.

`style`

`CSSProperties`

Additional styles.

`scrollToNode`

`(handler: string | number) => void`

Get a handler which helps to scroll to a node's position in the container.

**@param** handler – scroll to a node based on its id

Tree Behavior

CollapsibleTreeNodeModel

Property

Type

Description

`children`

`TreeNodeModel[]`

Defines sub-nodes.

`disabled`

`boolean`

Whether the node is disabled.

`highlightVariant`

`success`

Whether the node uses the background highlight color.

`icon`

`ReactNode`

Optional symbol of the node. Normally should be an Icon.

`id`

`any`

Identifier of a tree node, which is mainly used to distinct the node.

`initiallyExpanded`

`boolean`

Initial expansion state of the node.

**@default** false (collapsed).

`label`

`ReactNode`

Label of the node.

`onToggleExpansion`

`void`

Event that a change in expansion state has been requested.
Only defined, if the node is collapsible (has children).
This prop is populated by the component (you don't have to provide it).
However, it must be wired to the respective template method in `TreeAdapter` .

CollapsibleTreeProps

Property

Type

Description

`autoExpandOnDragOverTimeout`

`number`

Timeout (ms) to automatically expand a node when being dragged over.

`className`

`string`

Additional css class names.

`getDOMRef`

`RefCallback<HTMLElement>`

A callback to get the reference of the tree.

`hideRoot`

`boolean`

Whether the top-level node should be hidden.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`root*`

`CollapsibleTreeNodeModel`

Root of the tree.

`style`

`CSSProperties`

Additional styles.

`tplTreeNode`

`MapTreeNode`

Template mapping for the tree node.

`collapseNodeHandler`

`(handler: IdType) => void`

Handler for collapsing a node.

`expandNodeHandler`

`(handler: IdType) => void`

Handler for expanding a node.

`scrollToNode`

`(handler: string | number) => void`

Get a handler which helps to scroll to a node's position in the container.

**@param** handler – scroll to a node based on its id

DragAndDropTreeProps

Property

Type

Description

`className`

`string`

Additional css class names.

`getDOMRef`

`RefCallback<HTMLElement>`

A callback to get the reference of the tree.

`hideRoot`

`boolean`

Whether the top-level node should be hidden.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`root`

`TreeNodeModel`

Root of the tree.

`strictDnD`

`boolean`

Whether the droppable area is limited.

* If this prop is set to `true` ,
  + drop on top is allowed if the node is the first node at the current level.
  + drop at bottom is allowed if the node is collapsed or does not have children.
* If this prop is set to `false` , drop on top and bottom are both allowed on a node.

**@default** `true`

`style`

`CSSProperties`

Additional styles.

`tplTreeNode`

`MapTreeNode`

Template mapping for the tree node.

`type`

`string`

Type of the tree node.

`canDrag`

`(dragSource: DragItem) => boolean`

Whether the source item can be dragged or not.

**@param** dragSource – drag item

`canDrop`

`(hovering: any, dragging: any, isDropHint: boolean) => boolean`

Whether the position can be dropped or not.

**@param** hovering – hovering position.

**@param** dragging – dragging position.

**@param** isDropHint – has drop hint or not.

`onBeginDrag`

`(dragSource: DragItem) => void`

Handler when the dragging begins.

`onDragDrop*`

`(dragSource: DragItem, dropTarget: DropItem) => void`

Handler when the dropping is done.

`onEndDrag`

`(dragSource: DragItem) => void`

Handler when the dragging is finished.

`scrollToNode`

`(handler: string | number) => void`

Get a handler which helps to scroll to a node's position in the container.

**@param** handler – scroll to a node based on its id

SelectableTreeNodeModel

Property

Type

Description

`children`

`TreeNodeModel[]`

Defines sub-nodes.

`disabled`

`boolean`

Whether the node is disabled.

`highlightVariant`

`success`

Whether the node uses the background highlight color.

`icon`

`ReactNode`

Optional symbol of the node. Normally should be an Icon.

`id`

`any`

Identifier of a tree node, which is mainly used to distinct the node.

`label`

`ReactNode`

Label of the node.

`selected`

`boolean`

Whether the node is selected.

`onToggleSelection`

`void`

Request to change selection state of the node.
This prop is populated by the component (you don't have to provide it).
However, it must be wired to the respective template method in `TreeAdapter` .

SelectableTreeProps

Property

Type

Description

`className`

`string`

Additional css class names.

`getDOMRef`

`RefCallback<HTMLElement>`

A callback to get the reference of the tree.

`hideRoot`

`boolean`

Whether the top-level node should be hidden.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`root*`

`SelectableTreeNodeModel`

Root of the tree.

`scrollSelectedNodeIntoView`

`boolean`

Whether users can scroll to the selected node.

`style`

`CSSProperties`

Additional styles.

`tplTreeNode`

`MapTreeNode`

Template mapping for the tree node.

`onToggleSelection*`

`(node: TreeNodeModel) => void`

Callback if a change in selection has been requested.

`scrollToNode`

`(handler: string | number) => void`

Get a handler which helps to scroll to a node's position in the container.

**@param** handler – scroll to a node based on its id

TreeNodeModel

Property

Type

Description

`children`

`TreeNodeModel[]`

Defines sub-nodes.

`disabled`

`boolean`

Whether the node is disabled.

`highlightVariant`

`success`

Whether the node uses the background highlight color.

`icon`

`ReactNode`

Optional symbol of the node. Normally should be an Icon.

`id`

`any`

Identifier of a tree node, which is mainly used to distinct the node.

`label*`

`ReactNode`

Label of the node.

Insertable Tree

Types

* `InsertableTreeProps.InsertPosition = "top" | "bottom" | "asChild"`

InsertableTreeProps.TreeNodeModel

Property

Type

Description

`children`

`TreeNodeTemplateModel[]`

To define more nesting nodes.

`disabled`

`boolean`

Whether the node is disabled.

`highlightVariant`

`success`

Whether the node uses the background highlight color.

`icon`

`ReactNode`

Optional symbol of the node. Normally should be an Icon.

`id`

`any`

Identifier of a tree node, which is mainly used to distinct the node.

`label`

`ReactNode`

Label of the node.

`onInsert`

`(position: InsertPosition, node: TreeNodeTemplateModel) => void`

Handler to insert a new node.

**@param** position – where the new node will be placed.

**@param** node – that the position belongs to. The new node will be inserted at top/bottom or as a child of this node.

InsertableTreeProps

Property

Type

Description

`buttonTitles`

`Record<InsertPosition, string>`

Custom titles for the insert buttons.

`className`

`string`

Additional css class names.

`fitToParent`

`boolean`

Whether the tree fits 100% to the parent.

`getDOMRef`

`RefCallback<HTMLElement>`

Callback to get ref of the tree.

**@param** ref – the reference to the root node content element.

`hideRoot`

`boolean`

Whether the top-level node should be hidden.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`root*`

`TreeNodeModel`

Root of the Tree.

`style`

`CSSProperties`

Additional styles.

`onInsert`

`(position: InsertPosition, node: TreeNodeTemplateModel) => void`

Handler to insert a new node.

**@param** position – where the new node will be placed.

**@param** node – that the position belongs to. The new node will be inserted at top/bottom or as a child of this node.

`scrollToNode`

`(handler: string | number) => void`

Get a handler which helps to scroll to a node's position in the container.

**@param** handler – scroll to a node based on its id

Drag and Drop Tree

DnDTreeProps

Property

Type

Description

`className`

`string`

Additional css class names.

`fitToParent`

`boolean`

Whether the tree fits 100% to the parent.

`getDOMRef`

`RefCallback<HTMLElement>`

Callback to get ref of the tree.

**@param** ref – the reference to the root node content element.

`hideRoot`

`boolean`

Whether the top-level node should be hidden.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`root*`

`DnDTreeNode`

Root of the tree.

`style`

`CSSProperties`

Additional styles.

`type`

`string`

Type of the tree.

`scrollToNode`

`(handler: string | number) => void`

Get a handler which helps to scroll to a node's position in the container.

**@param** handler – scroll to a node based on its id

Theming configuration

The following theme variables can be used to customize the component:

```
1"tree": {
2    "actionButtons": {
3        "gap": "8px",
4        "padding": "0 8px"
5    },
6    "dropHint": {
7        "background": "rgba(0,88,159,0.5)",
8        "forbidden": {
9            "background": "rgba(198,40,40,0.5)",
10            "border": "1px solid #c62828"
11        },
12        "openedBorder": "1px solid #00589f"
13    },
14    "hintHeight": "8px",
15    "insertHint": {
16        "background": "rgba(0,88,159,0.5)",
17        "border": "1px solid #00589f",
18        "focus": {
19            "background": "rgba(213,0,117,0.5)",
20            "border": "1px solid #d50075"
21        }
22    },
23    "node": {
24        "indentPaddingLeft": 32,
25        "titleSpacingLeft": "8px"
26    },
27    "nodeActions": {
28        "margin": "0 16px"
29    },
30    "nodeArrow": {
31        "margin": "8px 0",
32        "marginLeft": "-40px",
33        "button": {
34            "active": {
35                "background": "#fff",
36                "color": "#00589f"
37            },
38            "focusBG": "#fff",
39            "fontSize": "1.5rem",
40            "iconFontWeight": 600,
41            "hover": {
42                "background": "#fff",
43                "color": "#00589f"
44            },
45            "size": "32px"
46        }
47    },
48    "nodeContent": {
49        "active": {
50            "background": "#f1f2f4",
51            "border": "2px solid #00589f"
52        },
53        "borderBottom": "1px solid #becfe2",
54        "disabled": {
55            "background": "#f1f2f4",
56            "color": "#a9b3bc",
57            "fontWeight": 400
58        },
59        "dragging": {
60            "activeBG": "#fff",
61            "hoverBG": "#fff"
62        },
63        "dragOver": {
64            "background": "#e5f4ff",
65            "borderLeft": "4px solid #00589f"
66        },
67        "dropForbidden": {
68            "background": "#fbeaea",
69            "borderLeft": "4px solid #c62828"
70        },
71        "focus": {
72            "background": "#f1f2f4",
73            "border": "2px solid #d50075",
74            "outline": "1px dotted #00589f"
75        },
76        "hover": {
77            "background": "#f1f2f4",
78            "border": "2px solid #00589f"
79        },
80        "minHeight": "48px",
81        "selected": {
82            "activeBorderLeft": "4px solid #00589f",
83            "background": "#f5fbff",
84            "borderLeft": "4px solid #00589f",
85            "focusBorderLeft": "4px solid #d50075",
86            "hoverBorderLeft": "4px solid #00589f"
87        },
88        "successBG": "#ecf9eb"
89    },
90    "nodeIcon": {
91        "fontSize": "1rem",
92        "maxHeight": "20px",
93        "minHeight": "48px",
94        "padding": "16px 0",
95        "width": "20px"
96    },
97    "nodeName": {
98        "fontFamily": "\"Open Sans\", sans-serif",
99        "fontSize": "0.75rem",
100        "marginLeft": "8px",
101        "padding": "16px 0"
102    },
103    "nodePreview": {
104        "background": "#fff",
105        "boxShadow": "0 1px 4px 0 rgba(22,25,29,0.4)",
106        "opacity": 0.1
107    }
108}
```

*content\_copy*
