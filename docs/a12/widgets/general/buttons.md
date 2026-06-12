---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/general/buttons
widget: general/buttons
scraped: 2026-06-12
---

# Widgets/General/Buttons/Button

Buttons

**Buttons** can be used to trigger different actions such as printing or exporting. As there are several use cases for buttons, A12 offers you a great variety to choose from.

Primary Buttons

This example is the default primary button along with its `active`, `destructive`, `inverted` and `disabled` variants.

*search*Default*visibility*Active*delete*Destructive*get\_app*Disabled

*code**center\_focus\_weak**bug\_report*

Secondary Buttons

This example is the default secondary button along with its `active`, `destructive` and `disabled` properties applied.

*search*Default*visibility*Active*delete*Destructive*get\_app*Disabled

*code**center\_focus\_weak**bug\_report*

Invert Buttons

It is recommended to invert the button on a dark background for better contrast. You can set the `invert` property to get this feature. Below is an example of what it looks like when combined with `primary` and `secondary` variants.

PrimarySecondary

*code**center\_focus\_weak**bug\_report*

Icon Buttons

This example is the default icon button along with its `active`, `destructive` and `disabled` properties applied. With `title` property, there will be a tooltip when hover the icon button.

Warning

*warning*

**NOTE**

For Accessibility, it is important to enable the interaction hint. Otherwise, the icon button name is not shown on tab focus and is therefore not A11Y conform.

Icon buttons

*search**visibility**delete**get\_app*

Secondary icon buttons

*search**visibility**delete**get\_app*

Primary icon buttons

*search**visibility**delete**get\_app*

*code**center\_focus\_weak**bug\_report*

Invert Icon Buttons

`invert` is also applied to the icon button, similar to [Invert Buttons](#/widgets/general/buttons/button#invert-buttons).

This example demonstrates what the **regular**, `primary`, `secondary`, and `active` variants look like when they are inverted.

**Note:** The inverted primary button's color is inherited from its parent's color property, not the background color property.

Regular

*fullscreen\_exit*

Primary

*get\_app*

Secondary

*search*

Activated

*visibility*

*code**center\_focus\_weak**bug\_report*

Vertical Buttons

Set the `vertical` property that vertically align icon and text of Button in the center.

**Note:** Use `vertical` only when both the icon and text are present.

*search*Default*search*Primary*search*Secondary

*code**center\_focus\_weak**bug\_report*

With Progress Bar

To show Button with [Progress Bar](#/widgets/feedback/progress-bar), you can pass the completed percentage of the process to `processedPercentage` property.

PrimarySecondary

*code**center\_focus\_weak**bug\_report*

With Loading

If an action takes longer than expected to finish, loading button will be shown so that users know that their request is being processed. Set `loading` property to true for showing loading button.

PrimaryLoading LoadingSecondaryLoading Loading*delete*Loading Loading

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

ButtonProps

Property

Type

Description

`active`

`boolean`

Whether the button is activated. If true, the background color will be changed.

`badge`

`ReactNode`

Specify a badge for the button. It is only shown with the icon button.

`block`

`boolean`

Make the width and height of the button (width and height) fit its parent.

**@default** false

`buttonAttributes`

`HTMLAttributes<HTMLButtonElement>`

Specify the additional props that will be placed at the real button attributes Element.
It should be used in case a user want to access to the native DOM properties of the original button element but there's no property allows to do that.

`buttonRef`

`RefCallback<HTMLButtonElement>`

The reference of the button.

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

`destructive`

`boolean`

Specify whether the button represents a destructive action.

`disabled`

`boolean`

Specify whether the button is disabled.

`icon`

`ReactNode`

Specify an additional icon for the button. If no label is given, the button will be considered as an icon button.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`invert`

`boolean`

If true, an inverted color will be set. It's useful in case the background is dark.
For the secondary button, an additional outline will be displayed to make it more visible to the user.

**@requires** primary

**@requires** secondary

`label`

`ReactNode`

The label of the button.

`labelHidden`

`boolean`

If the `label` is defined and this property is set to true, the label will be hidden but still be used as the item text in the responsive button group.

**@requires** label

`loading`

`boolean`

Specify whether the button is a loading button. If true, a progress indicator will be shown inside the button.

`primary`

`boolean`

Specify whether the button is a primary button.

`processedPercentage`

`number`

Specify the progressed percentage of the process that represents the width of ProgressBar widget.
Recommend using when a user is in the action which needs to visualize the progression (ex: downloading, installing...).

`secondary`

`boolean`

Specify whether the button is a secondary button.
It's default for the normal button. For the icon button, this flag has to be set explicitly to make it secondary.

`style`

`CSSProperties`

Additional styles.

`tabIndex`

`number`

Specify the tabIndex attribute for the button.

`title`

`string`

Specify the title attribute that will be shown when hovering the button.

`type`

`"button" | "submit" | "reset"`

Specify the type of the button.

**@default** button

`vertical`

`boolean`

Aligns the button's icon and text vertically at the center.

**Note:** This property should only be used when both the icon and text are present.

`onBlur`

`(event: FocusEvent<HTMLElement>) => void`

Blur handler for the button.

**@param** event – HTML focus event

`onClick`

`(event: MouseEvent<HTMLElement>) => void`

Click handler for the button.

**@param** event – HTML mouse event.

`onFocus`

`(event: FocusEvent<HTMLElement>) => void`

Focus handler for the button.

**@param** event – HTML focus event

`onKeyDown`

`(event: KeyboardEvent<HTMLElement>) => void`

Key down handler for the button.

**@param** event – HTML key event.

`onKeyPress`

`(event: KeyboardEvent<HTMLElement>) => void`

Key press handler for the button.

**@param** event – HTML key event.

`onKeyUp`

`(event: KeyboardEvent<HTMLElement>) => void`

Key up handler for the button.

**@param** event – HTML key event.

`onMouseDown`

`(event: MouseEvent<HTMLElement>) => void`

Mouse down handler for the button.

**@param** event – HTML mouse event.

`onMouseLeave`

`(event: MouseEvent<HTMLElement>) => void`

Mouse leave handler for the button.

**@param** event – HTML mouse event.

`onMouseOver`

`(event: MouseEvent<HTMLElement>) => void`

Mouse over handler for the button.

**@param** event – HTML mouse event.

Theming configuration

The following theme variables can be used to customize the component:

```
1"button": {
2    "border": "2px solid transparent",
3    "borderWidth": "2px",
4    "fontFamily": "\"Open Sans\", sans-serif",
5    "fontSize": "0.75rem",
6    "fontWeight": "700",
7    "minHeight": "32px",
8    "textTransform": "uppercase",
9    "primary": {
10        "activated": {
11            "background": "#d50075",
12            "color": "#fff",
13            "interaction": {
14                "active": {
15                    "background": "#fff",
16                    "color": "#00589f",
17                    "border": "2px solid #00589f",
18                    "textDecoration": "none"
19                },
20                "focus": {
21                    "background": "#fff",
22                    "color": "#d50075",
23                    "border": "2px solid #d50075",
24                    "textDecoration": "none"
25                },
26                "hover": {
27                    "background": "#fff",
28                    "color": "#00589f",
29                    "border": "2px solid #00589f",
30                    "textDecoration": "none"
31                }
32            }
33        },
34        "background": "#00589f",
35        "borderRadius": "16px",
36        "boxShadow": "none",
37        "color": "#fff",
38        "destructive": {
39            "background": "#c62828",
40            "color": "#fff",
41            "interaction": {
42                "active": {
43                    "background": "#fff",
44                    "color": "#00589f",
45                    "border": "2px solid #00589f",
46                    "textDecoration": "none"
47                },
48                "focus": {
49                    "background": "#fff",
50                    "color": "#d50075",
51                    "border": "2px solid #d50075",
52                    "textDecoration": "none"
53                },
54                "hover": {
55                    "background": "#fff",
56                    "color": "#00589f",
57                    "border": "2px solid #00589f",
58                    "textDecoration": "none"
59                }
60            }
61        },
62        "disabled": {
63            "boxShadow": "none",
64            "background": "#e2e6e9",
65            "color": "#a9b3bc"
66        },
67        "interaction": {
68            "active": {
69                "background": "#fff",
70                "color": "#00589f",
71                "border": "2px solid #00589f",
72                "textDecoration": "none"
73            },
74            "focus": {
75                "background": "#fff",
76                "color": "#d50075",
77                "border": "2px solid #d50075",
78                "outline": "1px dotted #00589f",
79                "textDecoration": "none"
80            },
81            "hover": {
82                "background": "#fff",
83                "color": "#00589f",
84                "border": "2px solid #00589f",
85                "textDecoration": "none"
86            }
87        },
88        "padding": "0 16px"
89    },
90    "invertPrimary": {
91        "background": "#fff",
92        "boxShadow": "none",
93        "borderWidth": "2px",
94        "color": "inherit",
95        "disabled": {
96            "background": "#e2e6e9",
97            "boxShadow": "none",
98            "color": "#a9b3bc"
99        },
100        "interaction": {
101            "active": {
102                "background": "rgba(0,0,0,0.2)",
103                "border": "2px solid #fff",
104                "color": "#fff",
105                "textDecoration": "none",
106                "borderColor": "#fff"
107            },
108            "focus": {
109                "background": "rgba(0,0,0,0.2)",
110                "border": "2px solid #fff",
111                "color": "#fff",
112                "outline": "1px dotted #fff",
113                "textDecoration": "none"
114            },
115            "hover": {
116                "background": "rgba(0,0,0,0.2)",
117                "border": "2px solid #fff",
118                "color": "#fff",
119                "textDecoration": "none",
120                "borderColor": "#fff"
121            }
122        }
123    },
124    "secondary": {
125        "activated": {
126            "background": "#ebf1f7",
127            "color": "#d50075",
128            "interaction": {
129                "active": {
130                    "background": "#ebf1f7",
131                    "color": "#00589f",
132                    "border": "2px solid #00589f",
133                    "textDecoration": "none"
134                },
135                "focus": {
136                    "background": "#ebf1f7",
137                    "color": "#d50075",
138                    "border": "2px solid #d50075",
139                    "textDecoration": "none"
140                },
141                "hover": {
142                    "background": "#ebf1f7",
143                    "color": "#00589f",
144                    "border": "2px solid #00589f",
145                    "textDecoration": "none"
146                }
147            }
148        },
149        "background": "#ebf1f7",
150        "border": "2px solid transparent",
151        "borderRadius": "16px",
152        "color": "#00589f",
153        "destructive": {
154            "background": "#ebf1f7",
155            "color": "#c62828",
156            "interaction": {
157                "active": {
158                    "background": "#ebf1f7",
159                    "color": "#00589f",
160                    "border": "2px solid #00589f",
161                    "textDecoration": "none"
162                },
163                "focus": {
164                    "background": "#ebf1f7",
165                    "color": "#d50075",
166                    "border": "2px solid #d50075",
167                    "textDecoration": "none"
168                },
169                "hover": {
170                    "background": "#ebf1f7",
171                    "color": "#00589f",
172                    "border": "2px solid #00589f",
173                    "textDecoration": "none"
174                }
175            }
176        },
177        "disabled": {
178            "background": "transparent",
179            "borderColor": "transparent",
180            "boxShadow": "none",
181            "color": "#a9b3bc"
182        },
183        "interaction": {
184            "active": {
185                "background": "#ebf1f7",
186                "color": "#00589f",
187                "border": "2px solid #00589f",
188                "textDecoration": "none"
189            },
190            "focus": {
191                "background": "#ebf1f7",
192                "color": "#d50075",
193                "border": "2px solid #d50075",
194                "outline": "1px dotted #00589f",
195                "textDecoration": "none"
196            },
197            "hover": {
198                "background": "#ebf1f7",
199                "color": "#00589f",
200                "border": "2px solid #00589f",
201                "textDecoration": "none"
202            }
203        },
204        "padding": "0 16px"
205    },
206    "invertSecondary": {
207        "background": "transparent",
208        "border": "1px solid #fff",
209        "borderRadius": "16px",
210        "boxShadow": "none",
211        "color": "#fff",
212        "disabled": {
213            "boxShadow": "none",
214            "background": "transparent",
215            "borderColor": "#e2e6e9",
216            "color": "#a9b3bc"
217        },
218        "interaction": {
219            "active": {
220                "background": "rgba(0,0,0,0.2)",
221                "border": "2px solid #fff",
222                "color": "#fff",
223                "textDecoration": "none",
224                "borderColor": "#fff"
225            },
226            "focus": {
227                "background": "rgba(0,0,0,0.2)",
228                "border": "2px solid #fff",
229                "color": "#fff",
230                "outline": "1px dotted #fff",
231                "textDecoration": "none"
232            },
233            "hover": {
234                "background": "rgba(0,0,0,0.2)",
235                "border": "2px solid #fff",
236                "color": "#fff",
237                "textDecoration": "none",
238                "borderColor": "#fff"
239            }
240        }
241    },
242    "iconButton": {
243        "activated": {
244            "background": "transparent",
245            "color": "#d50075",
246            "interaction": {
247                "active": {
248                    "background": "transparent",
249                    "color": "#00589f",
250                    "border": "2px solid #00589f"
251                },
252                "focus": {
253                    "background": "transparent",
254                    "color": "#d50075",
255                    "border": "2px solid #d50075"
256                },
257                "hover": {
258                    "background": "transparent",
259                    "color": "#00589f",
260                    "border": "2px solid #00589f"
261                }
262            }
263        },
264        "background": "transparent",
265        "borderRadius": "50%",
266        "color": "#00589f",
267        "destructive": {
268            "background": "transparent",
269            "color": "#c62828",
270            "interaction": {
271                "active": {
272                    "background": "transparent",
273                    "color": "#00589f",
274                    "border": "2px solid #00589f"
275                },
276                "focus": {
277                    "background": "transparent",
278                    "color": "#d50075",
279                    "border": "2px solid #d50075"
280                },
281                "hover": {
282                    "background": "transparent",
283                    "color": "#00589f",
284                    "border": "2px solid #00589f"
285                }
286            }
287        },
288        "disabled": {
289            "background": "transparent",
290            "boxShadow": "none",
291            "color": "#a9b3bc"
292        },
293        "fontSize": "1.125rem",
294        "minHeight": "0",
295        "interaction": {
296            "active": {
297                "background": "transparent",
298                "color": "#00589f",
299                "border": "2px solid #00589f"
300            },
301            "focus": {
302                "background": "transparent",
303                "color": "#d50075",
304                "border": "2px solid #d50075",
305                "outline": "1px dotted #00589f"
306            },
307            "hover": {
308                "background": "transparent",
309                "color": "#00589f",
310                "border": "2px solid #00589f"
311            }
312        },
313        "size": "2rem"
314    },
315    "vertical": {
316        "activated": {
317            "background": "transparent",
318            "color": "#d50075",
319            "interaction": {
320                "active": {
321                    "background": "#fff",
322                    "color": "#00589f",
323                    "border": "2px solid #00589f"
324                },
325                "focus": {
326                    "background": "#fff",
327                    "color": "#d50075",
328                    "border": "2px solid #d50075"
329                },
330                "hover": {
331                    "background": "#fff",
332                    "color": "#00589f",
333                    "border": "2px solid #00589f"
334                }
335            }
336        },
337        "background": "transparent",
338        "borderRadius": "2px",
339        "color": "#00589f",
340        "destructive": {
341            "background": "transparent",
342            "color": "#c62828",
343            "interaction": {
344                "active": {
345                    "background": "#fff",
346                    "color": "#00589f",
347                    "border": "2px solid #00589f"
348                },
349                "focus": {
350                    "background": "#fff",
351                    "color": "#d50075",
352                    "border": "2px solid #d50075"
353                },
354                "hover": {
355                    "background": "#fff",
356                    "color": "#00589f",
357                    "border": "2px solid #00589f"
358                }
359            }
360        },
361        "disabled": {
362            "background": "transparent",
363            "boxShadow": "none",
364            "color": "#a9b3bc"
365        },
366        "fontSize": "0.625rem",
367        "iconFontSize": "1.5rem",
368        "minHeight": "48px",
369        "padding": "4px 4px",
370        "interaction": {
371            "active": {
372                "background": "#fff",
373                "color": "#00589f",
374                "border": "2px solid #00589f"
375            },
376            "focus": {
377                "background": "#fff",
378                "color": "#d50075",
379                "border": "2px solid #d50075",
380                "outline": "1px dotted #00589f"
381            },
382            "hover": {
383                "background": "#fff",
384                "color": "#00589f",
385                "border": "2px solid #00589f"
386            }
387        }
388    },
389    "verticalPrimary": {
390        "activated": {
391            "background": "#d50075",
392            "color": "#fff",
393            "interaction": {
394                "active": {
395                    "background": "#fff",
396                    "color": "#00589f",
397                    "border": "2px solid #00589f"
398                },
399                "focus": {
400                    "background": "#fff",
401                    "color": "#d50075",
402                    "border": "2px solid #d50075"
403                },
404                "hover": {
405                    "background": "#fff",
406                    "color": "#00589f",
407                    "border": "2px solid #00589f"
408                }
409            }
410        },
411        "background": "#00589f",
412        "boxShadow": "none",
413        "color": "#fff",
414        "destructive": {
415            "background": "#c62828",
416            "color": "#fff",
417            "interaction": {
418                "active": {
419                    "background": "#fff",
420                    "color": "#00589f",
421                    "border": "2px solid #00589f"
422                },
423                "focus": {
424                    "background": "#fff",
425                    "color": "#d50075",
426                    "border": "2px solid #d50075"
427                },
428                "hover": {
429                    "background": "#fff",
430                    "color": "#00589f",
431                    "border": "2px solid #00589f"
432                }
433            }
434        },
435        "disabled": {
436            "boxShadow": "none",
437            "background": "#e2e6e9",
438            "color": "#a9b3bc"
439        },
440        "interaction": {
441            "active": {
442                "background": "#fff",
443                "color": "#00589f",
444                "border": "2px solid #00589f"
445            },
446            "focus": {
447                "background": "#fff",
448                "color": "#d50075",
449                "border": "2px solid #d50075"
450            },
451            "hover": {
452                "background": "#fff",
453                "color": "#00589f",
454                "border": "2px solid #00589f"
455            }
456        }
457    },
458    "verticalSecondary": {
459        "activated": {
460            "background": "#ebf1f7",
461            "color": "#d50075",
462            "interaction": {
463                "active": {
464                    "background": "#fff",
465                    "color": "#00589f",
466                    "border": "2px solid #00589f"
467                },
468                "focus": {
469                    "background": "#fff",
470                    "color": "#d50075",
471                    "border": "2px solid #d50075"
472                },
473                "hover": {
474                    "background": "#fff",
475                    "color": "#00589f",
476                    "border": "2px solid #00589f"
477                }
478            }
479        },
480        "background": "#ebf1f7",
481        "border": "2px solid transparent",
482        "boxShadow": "none",
483        "color": "#00589f",
484        "destructive": {
485            "background": "#ebf1f7",
486            "color": "#c62828",
487            "interaction": {
488                "active": {
489                    "background": "#fff",
490                    "color": "#00589f",
491                    "border": "2px solid #00589f"
492                },
493                "focus": {
494                    "background": "#fff",
495                    "color": "#d50075",
496                    "border": "2px solid #d50075"
497                },
498                "hover": {
499                    "background": "#fff",
500                    "color": "#00589f",
501                    "border": "2px solid #00589f"
502                }
503            }
504        },
505        "disabled": {
506            "boxShadow": "none",
507            "background": "transparent",
508            "borderColor": "transparent",
509            "color": "#a9b3bc"
510        },
511        "interaction": {
512            "active": {
513                "background": "#fff",
514                "color": "#00589f",
515                "border": "2px solid #00589f"
516            },
517            "focus": {
518                "background": "#fff",
519                "color": "#d50075",
520                "border": "2px solid #d50075"
521            },
522            "hover": {
523                "background": "#fff",
524                "color": "#00589f",
525                "border": "2px solid #00589f"
526            }
527        }
528    },
529    "invertIcon": {
530        "activated": {
531            "background": "rgba(0,0,0,0.4)",
532            "borderRadius": "2px",
533            "color": "#fff",
534            "interaction": {
535                "active": {
536                    "background": "rgba(0,0,0,0.2)",
537                    "color": "#fff",
538                    "border": "2px solid #00589f",
539                    "borderColor": "#fff"
540                },
541                "hover": {
542                    "background": "rgba(0,0,0,0.2)",
543                    "color": "#fff",
544                    "border": "2px solid #00589f",
545                    "borderColor": "#fff"
546                },
547                "focus": {
548                    "background": "rgba(0,0,0,0.2)",
549                    "color": "#fff",
550                    "border": "2px solid #d50075",
551                    "borderColor": "#fff",
552                    "outline": "1px dotted #fff"
553                }
554            }
555        },
556        "background": "transparent",
557        "borderRadius": "50%",
558        "color": "#fff",
559        "disabled": {
560            "background": "transparent",
561            "boxShadow": "none",
562            "color": "#a9b3bc"
563        },
564        "interaction": {
565            "active": {
566                "background": "rgba(0,0,0,0.2)",
567                "color": "#fff",
568                "border": "2px solid #00589f",
569                "borderColor": "#fff"
570            },
571            "hover": {
572                "background": "rgba(0,0,0,0.2)",
573                "color": "#fff",
574                "border": "2px solid #00589f",
575                "borderColor": "#fff"
576            },
577            "focus": {
578                "background": "rgba(0,0,0,0.2)",
579                "color": "#fff",
580                "border": "2px solid #d50075",
581                "borderColor": "#fff",
582                "outline": "1px dotted #fff"
583            }
584        }
585    },
586    "primaryIcon": {
587        "activated": {
588            "background": "#d50075",
589            "color": "#fff",
590            "interaction": {
591                "active": {
592                    "background": "#fff",
593                    "color": "#00589f",
594                    "border": "2px solid #00589f"
595                },
596                "focus": {
597                    "background": "#fff",
598                    "color": "#d50075",
599                    "border": "2px solid #d50075"
600                },
601                "hover": {
602                    "background": "#fff",
603                    "color": "#00589f",
604                    "border": "2px solid #00589f"
605                }
606            }
607        },
608        "background": "#00589f",
609        "borderRadius": "50%",
610        "boxShadow": "none",
611        "color": "#fff",
612        "destructive": {
613            "background": "#c62828",
614            "color": "#fff",
615            "interaction": {
616                "active": {
617                    "background": "#fff",
618                    "color": "#00589f",
619                    "border": "2px solid #00589f"
620                },
621                "focus": {
622                    "background": "#fff",
623                    "color": "#d50075",
624                    "border": "2px solid #d50075"
625                },
626                "hover": {
627                    "background": "#fff",
628                    "color": "#00589f",
629                    "border": "2px solid #00589f"
630                }
631            }
632        },
633        "disabled": {
634            "boxShadow": "none",
635            "background": "#e2e6e9",
636            "color": "#a9b3bc"
637        },
638        "interaction": {
639            "active": {
640                "background": "#fff",
641                "color": "#00589f",
642                "border": "2px solid #00589f"
643            },
644            "focus": {
645                "background": "#fff",
646                "color": "#d50075",
647                "border": "2px solid #d50075"
648            },
649            "hover": {
650                "background": "#fff",
651                "color": "#00589f",
652                "border": "2px solid #00589f"
653            }
654        }
655    },
656    "secondaryIcon": {
657        "activated": {
658            "background": "#ebf1f7",
659            "color": "#d50075",
660            "interaction": {
661                "active": {
662                    "background": "#ebf1f7",
663                    "color": "#00589f",
664                    "border": "2px solid #00589f"
665                },
666                "focus": {
667                    "background": "#ebf1f7",
668                    "color": "#d50075",
669                    "border": "2px solid #d50075"
670                },
671                "hover": {
672                    "background": "#ebf1f7",
673                    "color": "#00589f",
674                    "border": "2px solid #00589f"
675                }
676            }
677        },
678        "background": "#ebf1f7",
679        "border": "2px solid transparent",
680        "borderRadius": "50%",
681        "boxShadow": "none",
682        "color": "#00589f",
683        "destructive": {
684            "background": "#ebf1f7",
685            "color": "#c62828",
686            "interaction": {
687                "active": {
688                    "background": "#ebf1f7",
689                    "color": "#00589f",
690                    "border": "2px solid #00589f"
691                },
692                "focus": {
693                    "background": "#ebf1f7",
694                    "color": "#d50075",
695                    "border": "2px solid #d50075"
696                },
697                "hover": {
698                    "background": "#ebf1f7",
699                    "color": "#00589f",
700                    "border": "2px solid #00589f"
701                }
702            }
703        },
704        "disabled": {
705            "boxShadow": "none",
706            "background": "transparent",
707            "borderColor": "transparent",
708            "color": "#a9b3bc"
709        },
710        "interaction": {
711            "active": {
712                "background": "#ebf1f7",
713                "color": "#00589f",
714                "border": "2px solid #00589f"
715            },
716            "focus": {
717                "background": "#ebf1f7",
718                "color": "#d50075",
719                "border": "2px solid #d50075"
720            },
721            "hover": {
722                "background": "#ebf1f7",
723                "color": "#00589f",
724                "border": "2px solid #00589f"
725            }
726        }
727    },
728    "loading": {
729        "background": "#fff",
730        "circle": {
731            "borderWidth": "2px",
732            "color": {
733                "default": "#00589f",
734                "destructive": "#c62828"
735            },
736            "size": "20px"
737        }
738    }
739}
```

*content\_copy*
