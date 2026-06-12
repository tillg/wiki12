---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/experimental/calendar
widget: experimental/calendar
scraped: 2026-06-12
---

# Experimental/Calendar

Calendar

A calendar is a tool that displays dates and helps organize events, schedules, and time-related information.

* Month View
* Week View
* *more\_horiz*

Month View

A calendar month view displays all days of a month in a grid format, providing a clear overview to easily manage events and schedules. To utilize the calendar month view, set the `view` property of the `Calendar` component to "month" or directly use the `CalendarMonthView` component.

The month will be displayed based on the `date` property provided.

You can customize the display of each day using the `monthViewComponentRenderers` property with the `Calendar` component, or the `componentRenderers` property with the `CalendarMonthView` component. Both `monthViewComponentRenderers` and `componentRenderers` use the same property to customize each part of the day layout:

* `dayHeaderRenderer`: Renders day's header. By default, it shows the date, which can be formatted with `dateFormat`.
* `dayItemContentRenderer`: Renders the content of each item in a day. If not provided, the day item will be displayed without any content.
* `dayContentRenderer`: Renders the content of each day. If provided, item rendering must also be handled here, as `dayItemContentRenderer` will be ignored.
* `dayFooterRenderer`: Renders the footer of each day.

The Calendar **locale** is affected by `DateTimeContext`, which means you can change the **locale** by passing it to the `DateTimeContext` provider, similar to the [Date Picker](#/widgets/data-entry/pickers/date-picker#additional-properties).

Sunday

Monday

Tuesday

Wednesday

Thursday

Friday

Saturday

27-04

28-04

*infoInfo*

29-04

Marketing Meeting

Product Brainstorming

*infoInfo**check\_circleSuccess*

30-04

*infoInfo**check\_circleSuccess**warningWarning*

01-05

*infoInfo**check\_circleSuccess**warningWarning**errorError*

02-05

*infoInfo**check\_circleSuccess**warningWarning**errorError*

03-05

*infoInfo**check\_circleSuccess**warningWarning**errorError*

04-05

05-05

Marketing Meeting

Product Brainstorming

*infoInfo*

06-05

*infoInfo**check\_circleSuccess*

07-05

Checkpoint Calendar Widget (Another checkpoint for the basic calendar widget)

*infoInfo**check\_circleSuccess**warningWarning*

08-05

*infoInfo**check\_circleSuccess**warningWarning**errorError*

09-05

Code Review

*infoInfo**check\_circleSuccess**warningWarning**errorError*

10-05

*infoInfo**check\_circleSuccess**warningWarning**errorError*

11-05

12-05

Project Deadline

*infoInfo*

13-05

Daily Standup

Happy Hour

Project Deadline

English Class

End of Sprint

*infoInfo**check\_circleSuccess*

14-05

*infoInfo**check\_circleSuccess**warningWarning*

15-05

Project Deadline

End of Sprint

*infoInfo**check\_circleSuccess**warningWarning**errorError*

16-05

*infoInfo**check\_circleSuccess**warningWarning**errorError*

17-05

*infoInfo**check\_circleSuccess**warningWarning**errorError*

18-05

Team Building Event

19-05

*infoInfo*

20-05

Quarterly Review

Customer Feedback Analysis

*infoInfo**check\_circleSuccess*

21-05

*infoInfo**check\_circleSuccess**warningWarning*

22-05

Security Audit

*infoInfo**check\_circleSuccess**warningWarning**errorError*

23-05

*infoInfo**check\_circleSuccess**warningWarning**errorError*

24-05

*infoInfo**check\_circleSuccess**warningWarning**errorError*

25-05

26-05

Design Sprint

UX Review

*infoInfo*

27-05

Infrastructure Upgrade

*infoInfo**check\_circleSuccess*

28-05

Daily Standup

Happy Hour

End of Sprint

*infoInfo**check\_circleSuccess**warningWarning*

29-05

*infoInfo**check\_circleSuccess**warningWarning**errorError*

30-05

Daily Standups

Happy Hour

End of Sprint

English Class

Yoga Session

Hackathon Planning

Customer Success Workshop

Customer Success Workshop part 2

*infoInfo**check\_circleSuccess**warningWarning**errorError*

31-05

Monthly Wrap-Up

Retrospective Meeting

*infoInfo**check\_circleSuccess**warningWarning**errorError*

*code**center\_focus\_weak**bug\_report*
