---
source: https://www.mgm-tp.com/a12.htmlshowcase/#/widgets/data-display/deprecated-charts
widget: data-display/deprecated-charts
scraped: 2026-06-12
---

# Widgets/Data display/Deprecated charts/Deprecated bar chart

Deprecated Bar Chart

The **Bar Chart** Widget offers the possibility to display multi-dimensional data in your model by using an X/Y-plane to display a bar for each data point. The height of a bar provides information about the value of the corresponding data point.

Warning

*warning*

**NOTE**

Since version **38.1.1**, Chart Widgets are deprecated. We recommend using [Recharts*open\_in\_new*](https://recharts.org/ "Leave Page") directly for any charting needs.
For the detailed migration guide, please refer to [Chart Widgets to Recharts](#/get-started/migration-instructions/chart-widgets-to-recharts).

Basic

The **BarChart** receives an array of information of all the rectangles `data`. To make the chart adapts to the size of the parent container, the BarChart needs to be wrapped inside `ResponsiveChartContainer` component.

In addition, it can be drawn the horizontal and vertical grid lines by using `cartesianGridProps` property.

*code**center\_focus\_weak**bug\_report*

Simple Bar Chart

The **YAxis** will not display in the chart if set `hide` to `true` for the `yAxisProps` property.

*code**center\_focus\_weak**bug\_report*

Legend Position

You can choose the options to display the Legend of **BarChart** by passing the properties of the `legendProps`:

* **align**: Align the legend horizontally, default is `right`;
* **verticalAlign**: Align the legend vertically, default is `top`.
* **layout**: Legend's layout, default is `vertical`.

When you hover or click any cells, the cell and the corresponding legend item will be highlighted, all other cells and legend items will be blurred. This also works when you hover or click any legend items.

**Position support for a vertical legend**

Left

Center

Right

Above

*cancel*

*cancel*

*cancel*

Top

*check\_circle*

*cancel*

*check\_circle*

Middle

*check\_circle*

*cancel*

*check\_circle*

Bottom

*cancel*

*cancel*

*cancel*

Below

*check\_circle*

*check\_circle*

*check\_circle*

*check\_circle* Suggested

*cancel* Not suggested

Legend horizontal align

right (default)

center

left


Legend vertical align

above

top (default)

middle

bottom

below

* Jan:123
* Feb:150
* Mar:90
* Apr:80
* May:100
* Jun:70
* Jul:107
* Aug:96

*code**center\_focus\_weak**bug\_report*

Different Styles for Bars

You can customize the color of the bars and respective legends corresponding by defining an array of `fill` for the `cellPropsList` property.

You can also use the HTML SVG `pattern`, `rect`, and `mask` elements to customize stripes for the bar.

* The `pattern` element defines a graphics object which can be redrawn at repeated x- and y-coordinate intervals ("tiled") to cover an area.
* The `rect` element is used to create a rectangle and variations of a rectangle shape.
* The `mask` element defines an alpha mask for compositing the current object into the background.

* Apple:120
* Peach:150
* Banana:90
* Figs:80
* Grapes:100

*code**center\_focus\_weak**bug\_report*

Hideable Legend

The legend will be hidden as a popup if you set the `hideable` of the `legendProps` property to true and you can click on the trigger button to toggle it open/close.
 Widgets also provide the customized click event handler for the bars and legend.

*info*

*code**center\_focus\_weak**bug\_report*

Negative Values

* Jan:145
* Feb:-150
* Mar:90
* Apr:80
* May:-50
* Jun:130
* Jul:140

*code**center\_focus\_weak**bug\_report*

Threshold

Thresholds can be used to filter values in a chart, which can be useful for analyzing data. In this example, values that do not meet a threshold have a red color.

* Jan:90
* Feb:145
* Mar:70
* Apr:80
* May:75
* Jun:130
* Jul:140
* threshold

*code**center\_focus\_weak**bug\_report*

Percentage Dimension

In this showcase, the width of the chart container is 600px on desktop and 320px on mobile. Change the slider to see how the legend and chart change.

The width of Chart: **50%** (300px)

The width of Legend: **50%** (300px)

* Jan:145
* Feb:150
* Mar:90
* Apr:80
* May:50
* Jun:130
* Jul:140

*code**center\_focus\_weak**bug\_report*

API

**Note:**

* `prop*` is required.
* `prop` is deprecated.

Types

* `BarChartProps.Align = ChartProps.Align`
* `BarChartProps.Layout = ChartProps.Layout`
* `BarChartProps.LegendProps = ChartProps.LegendProps`
* `BarChartProps.ThresholdProps = AreaProps & { hide: boolean }`
* `BarChartProps.VerticalAlign = ChartProps.VerticalAlign`

BarChartProps

Property

Type

Description

`aboveThresholdStyle`

`object`

Specify styling for the bars that meet a threshold.

**@deprecated** since version 38.1.1. Use Recharts instead.

See [Cell*open\_in\_new*](https://recharts.github.io/en-US/api/Cell/ "Leave Page")

`barPropsMap*`

`{ [dataKey: string]: Props }`

The configuration of bars.

**@deprecated** since version 38.1.1. Use Recharts instead.

See [Bar*open\_in\_new*](https://recharts.github.io/en-US/api/Bar/ "Leave Page")

`belowThresholdStyle`

`object`

Specify styling for the bars that do not meet a threshold.

**@deprecated** since version 38.1.1. Use Recharts instead.

See [Cell*open\_in\_new*](https://recharts.github.io/en-US/api/Cell/ "Leave Page")

`cartesianGridProps`

`Props`

The horizontal and vertical lines of Cartesian Grid are displayed when the configuration is passed in.

**@deprecated** since version 38.1.1. Use Recharts instead.

See [CartesianGrid*open\_in\_new*](https://recharts.github.io/en-US/api/CartesianGrid/ "Leave Page")

`cellPropsList`

`Props[]`

Customize the cells of the BarChart. e.g. fill

**@deprecated** since version 38.1.1. Use Recharts instead.

See [Cell*open\_in\_new*](https://recharts.github.io/en-US/api/Cell/ "Leave Page")

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`labelKey*`

`string`

The label of data displayed in the custom x-axis legend.

**@deprecated** since version 38.1.1. Use Recharts instead.

See [Legend*open\_in\_new*](https://recharts.github.io/en-US/api/Legend/ "Leave Page")

`legendProps`

`LegendProps`

The configuration of the legend when `showLegend` is set to true.

**@deprecated** since version 38.1.1. Use Recharts instead.

See [Legend*open\_in\_new*](https://recharts.github.io/en-US/api/Legend/ "Leave Page")

`showLegend*`

`boolean`

If set true, the legend is displayed.

**@deprecated** since version 38.1.1. If you want to display a legend, define a Recharts `Legend` instead.

`showTooltip*`

`boolean`

If set true, the tooltip is displayed

**@default** true

**@deprecated** since version 38.1.1. If you want to display a tooltip, define a Recharts `Tooltip` instead.

`thresholdProps`

`ThresholdProps`

The threshold will be displayed if the configuration is passed in.

**@deprecated** since version 38.1.1. Use Recharts instead

See [Area*open\_in\_new*](https://recharts.github.io/en-US/api/Area/ "Leave Page")

See [ComposedChart*open\_in\_new*](https://recharts.github.io/en-US/api/ComposedChart/ "Leave Page")

`tooltipProps`

`TooltipProps<string | number, string | number>`

The configuration of the tooltip when `showTooltip` is set to true.

**@deprecated** since version 38.1.1. Use Recharts instead.

See [Tooltip*open\_in\_new*](https://recharts.github.io/en-US/api/Tooltip/ "Leave Page")

`xAxisDataKey`

`DataKey<string | number>`

The configuration of the x-axis.

**@deprecated** since version 38.1.1. Use Recharts instead.

See [XAxis dataKey*open\_in\_new*](https://recharts.github.io/en-US/api/YAxis/#dataKey "Leave Page")

`xAxisLabel`

`string | number`

The label displayed in the axis. Use Recharts instead.

**@deprecated** since version 38.1.1.

See [XAxis label*open\_in\_new*](https://recharts.github.io/en-US/api/XAxis/#label "Leave Page")

`xAxisLabelProps`

`Props`

The configuration of the `xAxisLabel` .

**@deprecated** since version 38.1.1. Use Recharts instead.

See [Label*open\_in\_new*](https://recharts.github.io/en-US/api/Label/ "Leave Page")

`xAxisProps`

`Props`

The configuration of the x-axis.

**@deprecated** since version 38.1.1. Use Recharts instead.

See [XAxis*open\_in\_new*](https://recharts.github.io/en-US/api/XAxis/ "Leave Page")

`yAxisLabel`

`string | number`

The label displayed in the axis.

**@deprecated** since version 38.1.1. Use Recharts instead.

See [YAxis label*open\_in\_new*](undefined "Leave Page")

`yAxisLabelProps`

`Props`

The configuration of the `yAxisLabel` .

**@deprecated** since version 38.1.1. Use Recharts instead.

See [Label*open\_in\_new*](https://recharts.github.io/en-US/api/Label/ "Leave Page")

`yAxisProps`

`Props`

The configuration of the y-axis.

**@deprecated** since version 38.1.1. Use Recharts instead.

See [YAxis*open\_in\_new*](https://recharts.github.io/en-US/api/YAxis/ "Leave Page")

`onLegendClick`

`(event: MouseEvent<HTMLElement>, index: number) => void`

The customized event handler of click on the items in this group.

**@deprecated** since version 38.1.1. Use Recharts instead.

See [Legend onClick*open\_in\_new*](https://recharts.github.io/en-US/api/Legend/#onClick "Leave Page")

**@param** event – the mouse event triggered by the legend item click.

**@param** index – the index of the clicked legend item.

ItemProps

Property

Type

Description

`cellProps`

`Props`

Customize the cell of the BarChart. e.g. fill

`className`

`string`

Additional css class names.

`hoveringLine`

`number | "null"`

Defines which line is hovering.

`id`

`string`

Specifies an id that is used for html id attribute.

See [MDN*open\_in\_new*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id "Leave Page")

`index*`

`number`

Index of item.

`label`

`string`

The label of item.

`style`

`CSSProperties`

Additional styles.

`threshold`

`boolean`

If set true, the threshold is displayed.

`value`

`string | number`

The value of item.

`onLegendClick`

`(event: MouseEvent<HTMLElement>, index: number) => void`

The customized event handler of click on the items in this group.

**@param** event – the mouse event triggered by the legend item click.

**@param** index – the index of the clicked legend item.

`onMouseEnter`

`(event: MouseEvent<HTMLElement>, index: number) => void`

The customized event handler of mouseenter.

**@param** event – the mouse event triggered by the interaction.

**@param** index – the index of the item being interacted with.

`onMouseLeave`

`void`

The customized event handler of mouseleave.

LegendProps

Property

Type

Description

`cellPropsList`

`Props[]`

Customize the cell of the legend. e.g. fill

`data`

`ReadonlyArray<object>`

The data of legend.

`dataKey*`

`string`

The key of data displayed.

`hideable`

`boolean`

If set true, the legend can be hideable.

`hoveringLine`

`number | "null"`

Defines which line is hovering.

`labelKey*`

`string`

The label of data displayed.

`verticalAlign`

`VerticalAlign`

Sets the vertical alignment of the legend in chart.

**@deprecated** since version 38.1.1. Use Recharts instead.

See [Legend verticalAlign*open\_in\_new*](https://recharts.github.io/en-US/api/Legend/#verticalAlign "Leave Page")

`onLegendClick`

`(event: MouseEvent<HTMLElement>, index: number) => void`

The customized event handler of click on the items in this group.

**@param** event – the mouse event triggered by the legend item click.

**@param** index – the index of the clicked legend item.

`onMouseEnter`

`(event: MouseEvent<HTMLElement>, index: number) => void`

The customized event handler of mouseenter.

**@param** event – the mouse event triggered by the interaction.

**@param** index – the index of the item being interacted with.

`onMouseLeave`

`void`

The customized event handler of mouseleave.

LineInteractionProps

Property

Type

Description

`hoveringLine`

`number | "null"`

Defines which line is hovering.

`onLegendClick`

`(event: MouseEvent<HTMLElement>, index: number) => void`

The customized event handler of click on the items in this group.

**@param** event – the mouse event triggered by the legend item click.

**@param** index – the index of the clicked legend item.

`onMouseEnter`

`(event: MouseEvent<HTMLElement>, index: number) => void`

The customized event handler of mouseenter.

**@param** event – the mouse event triggered by the interaction.

**@param** index – the index of the item being interacted with.

`onMouseLeave`

`void`

The customized event handler of mouseleave.

Theming configuration

The following theme variables can be used to customize the component:

```
1"charts": {
2    "fontSize": "0.75rem",
3    "fontFamily": "\"Open Sans\", sans-serif",
4    "fontWeight": 700,
5    "textColor": "#333",
6    "barChart": {
7        "spacing": "24px",
8        "spacingMinWidth": "12px"
9    },
10    "pieChart": {
11        "border": "1px solid #d50075",
12        "size": "12px",
13        "hideableBG": "rgba(255,255,255,0.8)",
14        "legend": {
15            "background": "#fff"
16        }
17    },
18    "legend": {
19        "background": "#fff",
20        "boxShadow": "0 0 0 1px #a9b3bc",
21        "item": {
22            "activeAndHoverBG": "#f1f2f4",
23            "padding": "8px 16px"
24        },
25        "baseSpacing": "16px",
26        "surface": {
27            "minWidth": "32px",
28            "margin": "0 4px 0 0"
29        }
30    }
31}
```

*content\_copy*
