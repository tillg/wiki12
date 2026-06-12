---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/basics/accessibility
widget: basics/accessibility
scraped: 2026-06-12
---

# Basics/Accessibility

Accessibility

Localization of accessibility hidden text

The CSS class [-u-unseenButRead](#/basics/utility-classes#unseen-but-read) is provided by Widgets to hide a specific content, which is only useful for the screen reader users.
However, having to supply those texts is not an easy task and repetitive in every project. We also don't see the big need to customize those texts. Therefore, Widgets provides localized hidden texts that make project using Widgets accessible by screen reader out of the box.

Currently, we have texts in **English(en)** and **German(de)** for the following widgets:

* Accordion
* Application Frame
* Autocomplete
* Badge
* Base Input
  + Clear Text Button
  + Close Modal Button
  + Error Icon
  + Info Icon
  + Warning Icon
* Breadcrumb
* Button Group
* Chat
* Connected Toast
* Collapsible Panel
* Content Box
* Counter
* File Upload
* Filter
* Filter Bar
* Filter Selector
* Global Message Box
* Header Trigger
* Icon Picker
* Link
* List (mobile only)
* Menus
  + Flyout Menu
  + Sliding Menu
  + Popup Menu
* Message Box
* Modal Notification
* Quick Access Button
* Pagination
* Pickers
  + Date Picker
  + Time Picker
  + Date Time Picker
* Plugin Editor
* Progress Indicator
* Table
* Tab Panel
* Tag
* Tag Input
* Toast
* Toggle (mobile only)
* Tooltip
* Tree
* Tree Table
* Typography (headline and mobile only)
* Validation Bar
* Wizard

and on the way to provide more texts for other widgets.

In addition, there are some widgets in the list above need customization or additional text from your project to make it fully support Accessibility.
The text should have meaning depends on your needs or actions. You can easily find the instruction about the Accessibility in the showcase of each widget.

If your project is pure English, then there is no need to do anything. The text is already provided in English by default.

To enable it for other languages, simply wrap your application in our language provider and give it your current locale string:

```
```
1import {
2	A11YLanguageContext,
3	getA11yResource
4} from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/a11y-localization";
5
6const App = () => <A11YLanguageContext.Provider value={getA11yResource(CURRENT_LOCALE)}>
7        <Application />
8    </A11YLanguageContext.Provider>;
9
```

content_copy
```

To disable the provided text, simply pass an empty object to the provider.

The text is **strongly typed** with Typescript. Therefore, customizing is really easy and safe. The IDE should provide you with all type of hinting you need.

To customize the texts, create an object with the type of `A11yResourceTypeDefinition`, and the `mergeA11yResource` that we provided to merge your values with the default from Widgets.

```
```
1const extendedA11YValue: A11yResourceTypeDefinition = mergeA11yResource({
2    de: {
3         a11yMenuTitles: {
4             selectedParent: "Your text of choice, in German... "
5         }
6    }
7});
8
9
10<A11YLanguageContext.Provider value={extendedA11YValue[CURRENT_LOCALE]}>
11  {
12	// Your component goes here
13  }
14</A11YLanguageContext.Provider>
```

content_copy
```

Or use it directly and ignore the default value.

```
```
1// Define your own text, in a non-localized application
2
3const myCompletelyNewDefinition: A11yResourceTypeDefinition = {
4    a11yMenuTitles: {
5        selectedParent: "Your text of choice ",
6        //...
7    }
8};
9
10<A11YLanguageContext.Provider value={myCompletelyNewDefinition}>
11  {
12    // Your component goes here
13  }
14</A11YLanguageContext.Provider>
```

content_copy
```
