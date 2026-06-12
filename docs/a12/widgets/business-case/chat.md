---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/business-case/chat
widget: business-case/chat
scraped: 2026-06-12
---

# Widgets/Business case/Chat

Chat

The **Chat** Widget is used for displaying virtual conversations.

Basic

In the **Chat** Widget, the **Container** is used to wrap a stack of **MessageGroup** elements. Each **MessageGroup** may include:

* `userInfo`: allows you to use the **UserInfo** widget to provide information about the user such as their username and avatar.
* `position`: allows for specifying whether the **MessageGroup** should be aligned to the `left` or `right`. This property is set to `left` by default.

You can add multiple **Message** elements to a **MessageGroup** as its children. You can use the `status` property of each **Message** to shows its additional information such as date, time, sent/received status, etc. that is displayed at the bottom of a message.

To display additional content besides the main Message, please use the `SecondaryContent` element.

![Peter Avatar](images/user-avatar.png)

Peter

Hello, my name is Peter. How can I help you?

11:11 am

Me:

Hello! I have a question about room service.

11:13 am

![Peter Avatar](images/user-avatar.png)

Peter

Regarding this, Susan is in charge. Hi **@Susan**, could you give us a hand, please?

11:13 am

*account\_circle*

Susan

Hello, I'm Susan. Could you please tell me which service you're asking about?

For example: Delivery, pet services, wake-up call,...

11:11 am

Me:

It's about pet services.

11:14 am

My puppies are staying with me and I would like to request food and in-room cleaning services.

11:15 am

*account\_circle*

Susan

Yes, sure. Please check the attached files with all the information about our pet services.

11:16 am

Pet Services Policy and Agreement *attachment*

11:16 am

Pet Services Registration *attachment*

11:16 am

Me:

Great. I'll take a look.

11:17 am

*code**center\_focus\_weak**bug\_report*

Date Markers and Notifications

We provide elements for you to decorate and add additional information to the **Chat**:

* **DateMarker**: this element helps to group messages according to the date they were sent. You should put it before the **MessageGroup** elements that you want to group.
* **Notification**: this element helps to display notifications that come in from the chat. You can change its variant via the `variant` property (there are 4 variants available: info, success, warning, and error).

The example below uses the **DateMarker** and all variants of the **Notification** element.

Mo, 2019-04-22

Susan has joined this space

Peter has joined this space

*account\_circle*

Peter

Hello, my name is Peter. Nice to meet you!

11:11 am

*account\_circle*

Susan

Hello, I'm Susan. Nice to meet you, too!

11:11 am

Today

You have joined this space

Me:

Hello everyone, my name is Jasmine. I'm looking forward to having a nice chat with you all later!

11:14 am

Janina has joined this space

*account\_circle*

Janina

Hi all, you can call me Janina

11:15 am

Hope we have a good talk

11:15 am

*code**center\_focus\_weak**bug\_report*

Typing Marker

To indicate whether the user is typing, you can make use of the **TypingMarker** element.

The example below uses the **TypingMarker** and shows how it works when combined with the [Progress Indicator](#/widgets/feedback/progress-indicator) widget.

Loading with:

Progress Indicator as dots

Progress Indicator as spinner

*account\_circle*

Peter

Hello, my name is Peter. How can I help you?

11:11 am

Me:

Hello! I have a question about room service.

11:13 am

*account\_circle*

Peter

Could you please tell me which service you're asking about?

For example: Delivery, pet services, wake-up call,...

11:11 am

Me:

It's about pet services.

11:14 am

My puppies are staying with me and I would like to request food and in-room cleaning services.

11:15 am

*account\_circle*

Peter

Yes, sure. Please check the attached files with all the information about our pet services.

11:16 am

Pet Services Policy and Agreement *attachment*

11:16 am

Pet Services Registration *attachment*

11:16 am

Me:

Great. I'll take a look.

11:17 am

Peter is typing

*code**center\_focus\_weak**bug\_report*

Scroll Handling

The Container element of the **Chat** Widget can automatically scroll to the bottom if the scrollbar is at the bottom when new message come in.

It also provides the following properties to handle scroll events:

* `onScroll`: a handler function that will be fired continuously while the scrollbar is scrolling.
  Use the param `isAutomaticallyScrolling` to detect whether the scroll event is triggered manually or programmatically.
* `onScrollStart`: a handler function that will be fired when the user start scrolling the scrollbar.
* `onScrollEnd`: a handler function that will be fired when the user stop scrolling the scrollbar for a time interval defined by the `scrollEndDetectingTime` property.
* `scrollEndDetectingTime`: the amount of time (in milliseconds) between the scroll event stopping and the `onScrollEnd` event starting. The default value is 250ms.
* `ref`: a React Reference instance of the Container that includes additional utility functions such as: `scrollTo`, `scrollToBottom`, and `isScrollbarAtBottom`.

The example below uses the `onScrollEnd` of the Container to handle the visibility of the "Scroll to bottom" Notification element when you scroll. By clicking the Notification or sending a new message, the Container's `scrollToBottom` will be triggered.

Chat with expandable input

*account\_circle*

Peter

Hello, my name is Peter. How can I help you?

11:11 am

Me:

Hello! I have a question about room service.

11:13 am

*account\_circle*

Peter

Could you please tell me which service you're asking about?

11:13 am

Me:

It's about pet services.

11:14 am

My puppies are staying with me and I would like to request food and in-room cleaning services.

11:15 am

*account\_circle*

Peter

Yes, sure. Please check the attached files with all the information about our pet services.

11:16 am

Pet Services Policy and Agreement

11:17 am

Pet Services Registration

11:17 am

Me:

Great. I'll take a look.

11:17 am

Scroll to bottom *arrow\_downward*

Action Section

Type anything...

*send*

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

Types

* `ChatProps.MessagePosition = "left" | "right"`
* `ChatProps.NotificationVariant = "info" | "success" | "warning" | "error"`

ChatProps.AvatarProps

Property

Type

Description

`alt`

`string`

Specifies an alternate text for an image if the image cannot be displayed.

**@default** ""

`className`

`string`

Additional css class names.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`imageUrl*`

`string`

Specifies the URL of the image.

`style`

`CSSProperties`

Additional styles.

ChatProps.ContainerProps

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

`innerChatContainerRef`

`RefCallback<HTMLElement>`

The reference of the chat container element.

`scrollEndDetectingTime`

`number`

The amount of time (in milliseconds) for firing the onScrollEnd event after the scroll event stop.

**@default** 250

`style`

`CSSProperties`

Additional styles.

`onScroll`

`(event: UIEvent<HTMLElement>, isScrolledToBottom?: boolean, isAutomaticallyScrolling?: boolean) => void`

The scroll event handler for the Chat Container.

**@param** event – scroll event

**@param** isScrolledToBottom – Notifies that the scrollbar is scrolled to the bottom.
Deprecated since 28.3.0 - It is extracted to isScrollbarAtBottom prop

**@param** isAutomaticallyScrolling – Notifies that the scrolling is automatically or not

`onScrollEnd`

`(lastScrollEvent: UIEvent<HTMLElement>) => void`

The event handler for the Chat Container after the last scrolling event fired.

`onScrollStart`

`(firstScrollEvent: UIEvent<HTMLElement>) => void`

The event handler for the Chat Container when the first scrolling event fired.

ChatProps.DateMarkerProps

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

ChatProps.MessageGroupProps

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

`position`

`MessagePosition`

Specifies the position of Messages inside the Message Group.

**@default** left

`style`

`CSSProperties`

Additional styles.

`userInfo`

`ReactNode`

Specifies the user information.

ChatProps.MessageProps

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

`position`

`MessagePosition`

**@deprecated** - will base on position of `MessageGroupProps`
Position of Message in the Chat Container.

**@default** left

`status`

`ReactNode`

The additional information that is displayed at the bottom of the Message.
Example: Date, Time, sent/received status, etc.

`style`

`CSSProperties`

Additional styles.

`wrapperRef`

`RefCallback<HTMLDivElement>`

The reference of the element wrapping the main content if one exists.

ChatProps.NotificationProps

Property

Type

Description

`children`

`ReactNode`

The component's content.

`className`

`string`

Additional css class names.

`fixedToBottom`

`boolean`

Specifies whether the Notification is fixed to the bottom of the Chat Container.

**@default** false

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`show`

`boolean`

Specifies whether the Notification is visible.

**@default** true

`style`

`CSSProperties`

Additional styles.

`variant`

`NotificationVariant`

Specifies the variant of the Notification.

**@default** "info"

`onClick`

`(event: MouseEvent<HTMLElement>) => void`

A callback will be triggered when the Notification is clicked by mouse.

`onKeyDown`

`(event: KeyboardEvent<HTMLElement>) => void`

A callback will be triggered when the Notification receives a KeyDown event.

ChatProps.SecondaryContentProps

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

`wrapperRef`

`RefCallback<HTMLDivElement>`

The reference of the element wrapping the main content if one exists.

ChatProps.TypingMarkerProps

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

ChatProps.UserInfo

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

`position`

`MessagePosition`

**@deprecated** - will base on position of `MessageGroupProps`
Position of UserInfo in the Chat Container.

**@default** left

`style`

`CSSProperties`

Additional styles.

`userAvatar`

`ReactNode`

The avatar of the user.

**@default** 'account\_circle' Icon

`userName`

`ReactNode`

The display name of the user.

Theming configuration

The following theme variables can be used to customize the component:

```
1"chat": {
2    "container": {
3        "inner": {
4            "padding": "24px 24px 0 24px"
5        }
6    },
7    "messageGroup": {
8        "padding": "8px 0 0",
9        "lastChildPadding": "8px 0"
10    },
11    "message": {
12        "background": {
13            "left": "#fff",
14            "right": "#f7fafc"
15        },
16        "borderColor": {
17            "left": "#b5e4fd",
18            "right": "#f7fafc"
19        },
20        "wrapper": {
21            "padding": "4px 0 0",
22            "lastChildPaddingBottom": "8px"
23        },
24        "bubble": {
25            "borderRadius": "4px",
26            "minHeight": "24px",
27            "padding": "2px 4px",
28            "horizontalMargin": "6px"
29        },
30        "content": {
31            "fontFamily": "\"Open Sans\", sans-serif",
32            "fontSize": "0.75rem",
33            "fontWeight": 400,
34            "lineHeight": "1.125rem"
35        },
36        "status": {
37            "fontFamily": "\"Open Sans\", sans-serif",
38            "fontSize": "0.625rem",
39            "fontWeight": 400,
40            "lineHeight": "1.125rem",
41            "color": "#333",
42            "paddingLeft": "16px"
43        }
44    },
45    "userInfo": {
46        "paddingTop": "8px",
47        "avatar": {
48            "wrapper": {
49                "spacing": "4px"
50            },
51            "image": {
52                "borderRadius": "50%",
53                "size": "1rem"
54            }
55        },
56        "name": {
57            "fontFamily": "\"Open Sans\", sans-serif",
58            "fontSize": "0.75rem",
59            "fontWeight": 600,
60            "lineHeight": "1rem"
61        }
62    },
63    "date": {
64        "marker": {
65            "padding": "0 8px"
66        },
67        "content": {
68            "background": "#616f7c",
69            "borderRadius": "12px",
70            "color": "#fff",
71            "fontFamily": "\"Open Sans\", sans-serif",
72            "fontSize": "0.75rem",
73            "padding": "4px 16px",
74            "margin": "8px 0"
75        }
76    },
77    "notification": {
78        "margin": "8px auto",
79        "width": "75%",
80        "background": {
81            "error": "#c62828",
82            "success": "#2e7d32",
83            "warning": "#fcce34"
84        },
85        "content": {
86            "background": "#0277bd",
87            "borderRadius": "12px",
88            "fontFamily": "\"Open Sans\", sans-serif",
89            "fontSize": "0.75rem",
90            "padding": "4px 16px",
91            "icon": {
92                "margin": "0 0 0 8px"
93            },
94            "variant": {
95                "text": {
96                    "info": "#fff",
97                    "success": "#fff",
98                    "warning": "#16191d",
99                    "error": "#fff"
100                }
101            }
102        },
103        "fixedToBottom": {
104            "margin": "0 0 4px 0",
105            "width": "70%"
106        }
107    },
108    "typing": {
109        "padding": "8px 0",
110        "width": "75%"
111    },
112    "secondaryContent": {
113        "color": "#616f7c",
114        "fontFamily": "\"Open Sans\", sans-serif",
115        "fontSize": "1em",
116        "fontStyle": "italic",
117        "margin": "12px 0 0"
118    }
119}
```

*content\_copy*
