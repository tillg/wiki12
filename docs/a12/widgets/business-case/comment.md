---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/business-case/comment
widget: business-case/comment
scraped: 2026-06-12
---

# Widgets/Business case/Comment/Comment template

Comment Template

The **Comment** and **Comment List** Widgets are components that allows users to create a list of comments.

Basic

Each **Comment** requires `commentMeta` that represents the additional information about the comment such as its author, date, and action. You can either pass a React element to this property or an object of type `CommentMeta`.

* *person*

  Matt

  wrote

  Fri Jun 12 2026

  This is a short comment.
* *person*

  *Antoinette Watsica*

  wrote

  ***Fri Jun 12 2026***

  *insert\_emoticon**insert\_emoticon**insert\_emoticon*
  This is a long comment. Velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt. Aliquip deserunt velit aliquip deserunt velit aliquip. Velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt. Aliquip deserunt velit aliquip deserunt velit aliquip. Velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt. Aliquip deserunt velit aliquip deserunt velit aliquip. Velit aliquip deserunt velit aliquip deserunt minim culpa cillum.

*code**center\_focus\_weak**bug\_report*

Comment Tag

Use the `commentTags` property to display tags below the comment text. To create a tag, you can refer to our [Tag](#/widgets/data-display/tag) widget.

*account\_circle*

Laverna Kassulke

wrote

Wed May 05 2027

Facere sophismata decet certe vir suscipit absconditus alveus. Civis cumque terminatio considero vespillo suppellex ipsam attollo. Tenax vulariter aer appono taedium triumphus.

*phone\_iphone*

iOS phone

Windows phone

Linux desktop

*desktop\_mac*

macOS desktop

*desktop\_windows*

Windows desktop

Velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt. Aliquip deserunt velit aliquip deserunt velit aliquip. Velit aliquip deserunt velit aliquip deserunt minim culpa cillum.

*code**center\_focus\_weak**bug\_report*

Inactive Comment

A **Comment** can also be displayed as inactive by setting the `inactive` property to `true`. In addition, you can add further information for this mode using the `inactiveCommentMeta` property.

If a comment with a large amount of content is inactive, a button will be shown to minimize/maximize the text when you provide the `showAllText` and `minimiseText` properties.

*account\_circle*

Matt

wrote

Fri Jun 12 2026

*account\_circle*

Louis

archived

Fri Jun 12 2026

This is a comment in inactive mode.
Velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt. Aliquip deserunt velit aliquip deserunt velit aliquip. Velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt. Aliquip deserunt velit aliquip deserunt velit aliquip. Velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt. Aliquip deserunt velit aliquip deserunt velit aliquip. Velit aliquip deserunt velit aliquip deserunt minim culpa cillum.

Show all

*code**center\_focus\_weak**bug\_report*

Actions

To add more actions to a comment, you can use these properties:

* `actionButtons`: to display buttons below a comment.
* `combinedActionButton`: to group buttons in a popup-menu and display it on the right.

This example shows you how to create replies and how they display. We provide the `NewComment.Input` component that represents an input for entering a comment. It should be placed in `NewComment` to guarantee the best UI experience. Click the **REPLY** button to see how it looks.
After adding a comment, to make it have the appearance of a reply, set the `isReply` property to `true`. Do note that for demonstration purposes, we've added some non-functional action buttons as well.

* *account\_circle*

  Laverne Johnston

  wrote

  Fri Mar 27 2026

  *more\_vert*

  Temptatio ducimus certus congregatio supellex voveo colligo campana.

  *account\_circle*

  Laverna Kassulke

  wrote

  Fri Feb 05 2027

  *more\_vert*

  Ciminatio bestia circumvenio. Inflammatio tutis voveo administratio campana sed. Usus blandior talis solitudo.

  Reply
* *account\_circle*

  Laverne Johnston

  wrote

  Fri Mar 27 2026

  *more\_vert*

  Damno conduco tantum tamquam at defaeco. Vinculum cruciamentum tumultus coniuratio aqua tabula delectus adeo demulceo carus. Concedo summopere amor impedit coruscus deficio.

  *phone\_iphone*

  iOS phone

  Windows phone

  *desktop\_mac*

  macOS desktop

  SHOW OLDER REPLIES (2)

  *account\_circle*

  Laverne Johnston

  wrote

  Fri Jun 12 2026

  *more\_vert*

  Ocer tandem una temeritas sublime. Commodi speciosus defendo creber cunctatio cuius cometes quasi curtus. Spiritus avarus curso coniecto thema utrum venio somnus centum casus. Eum thorax mollitia tabella earum tepidus modi deleniti conicio. Crapula ager vomito.

  Reply
* *account\_circle*

  Laverne Johnston

  wrote

  Fri Mar 27 2026

  *more\_vert*

  Corrumpo sustineo stillicidium cometes repudiandae defluo contego speculum.

  Reply

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

Comment

CommentMeta

Property

Type

Description

`action`

`ReactNode`

The action that user do with the comment.

`author`

`ReactNode`

The author's name.

`avatar`

`ReactNode`

The author's avatar.

`date`

`ReactNode`

The date that the action was done.

CommentProps

Property

Type

Description

`actionButtonPosition`

`"right" | "left"`

The action button's position.

**@default** right

`actionButtons`

`ReactNode`

The comment's action buttons.

`children`

`ReactNode`

The comment's content.

`className`

`string`

Additional css class names.

`combinedActionButton`

`ReactElement<PopUpMenuProps, string | JSXElementConstructor<any>>`

The given action buttons will be placed in a pop-up menu.

`commentMeta*`

`ReactNode | CommentMeta`

The comment's information.

`commentTags`

`ReactNode`

The comment's tags.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`inactive`

`boolean`

Whether the comment is in inactive mode.

`inactiveCommentMeta`

`ReactNode | CommentMeta`

The inactive comment's information.

`isReply`

`boolean`

If true, the comment will be displayed as a reply.

**@default** false

`minimiseText`

`string`

Customized text for the MINIMISE button.

**Note**: Only works if `inactive` is true.

`replies`

`ReactNode`

A list of replies.

`showAllText`

`string`

Customized text for the SHOW ALL button.

**Note**: Only works if `inactive` is true.

`style`

`CSSProperties`

Additional styles.

Comment List

CommentListProps

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

`scrollToBottom`

`boolean`

Scroll to the bottom of list.

`style`

`CSSProperties`

Additional styles.

New Comment

Types

* `NewCommentInputProps = TextAreaStatelessProps`

NewCommentMeta

Property

Type

Description

`author`

`ReactNode`

The author's name.

`avatar`

`ReactNode`

The author's avatar.

NewCommentProps

Property

Type

Description

`actionButtons`

`ReactNode`

The new comment's action buttons.

`children`

`ReactNode`

The new comment's content.

`className`

`string`

Additional css class names.

`commentMeta`

`ReactNode | NewCommentMeta`

The new comment's information.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`isReply`

`boolean`

If true, the comment will be displayed as a reply.

**@default** false

`style`

`CSSProperties`

Additional styles.

Theming configuration

The following theme variables can be used to customize the component:

```
1"comment": {
2    "padding": "16px 8px 16px 16px",
3    "meta": {
4        "action": {
5            "color": "#616f7c",
6            "margin": "0 4px 0 0"
7        },
8        "containerMargin": "0 24px 8px",
9        "dateColor": "#616f7c",
10        "inactive": {
11            "destructive": {
12                "margin": "0 0 0 20px",
13                "color": "#c62828"
14            },
15            "margin": "0 16px 0 0",
16            "color": "#616f7c",
17            "avatarColor": "#a9b3bc"
18        },
19        "newComment": {
20            "color": "#333",
21            "fontFamily": "\"Open Sans\", sans-serif",
22            "fontSize": "0.75rem",
23            "fontWeight": 400,
24            "containerMargin": "0 0 8px 24px",
25            "avatar": {
26                "fontSize": "1rem",
27                "size": "16px",
28                "left": "-20px"
29            },
30            "author": {
31                "fontWeight": 600,
32                "margin": "0 4px 0 0"
33            }
34        }
35    },
36    "actions": {
37        "margin": "4px 0 0 24px",
38        "replies": {
39            "item": {
40                "background": "#f1f2f4",
41                "padding": " 4px 4px",
42                "borderBottom": "1px solid #fff"
43            }
44        },
45        "newCommentMargin": "16px 24px 8px",
46        "replyCommentMargin": "0 -8px 0 8px"
47    },
48    "content": {
49        "fontFamily": "\"Open Sans\", sans-serif",
50        "fontSize": "0.75rem",
51        "fontWeight": 400,
52        "padding": "4px 24px",
53        "childrenMargin": "0 0 8px 0",
54        "newCommentMargin": "4px 0",
55        "replyCommentPadding": "0 24px",
56        "replyNewCommentMargin": "0 24px"
57    },
58    "text": {
59        "color": "#333"
60    },
61    "newComment": {
62        "background": "#fff"
63    },
64    "replies": {
65        "margin": "16px 0 4px 24px",
66        "actionMargin": "16px 24px 8px 0"
67    },
68    "replyComment": {
69        "background": "#f1f2f4",
70        "padding": "8px 8px",
71        "inputBG": "#fff"
72    }
73},
74"commentList": {
75    "background": "#fff",
76    "minHeight": "84px",
77    "children": {
78        "left": "16px",
79        "right": "16px",
80        "bottom": 0,
81        "borderBottom": "1px solid #e2e6e9"
82    }
83},
84
```

*content\_copy*
