---
source: https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_frontend_data_in_activities/index.html
category: overall
docid: dev_tutorial_frontend_data_in_activities
scraped: 2026-06-12
---

# Task 4 - Data in Activities

|  |  |
| --- | --- |
|  | This tutorial uses A12 version 2025.06-ext5 and is based on the Project Template version 202506.5.1. |

## Prerequisites

|  |  |
| --- | --- |
|  | If you are new to the development tutorials, make sure to first go through [Tutorials > General Information](https://geta12.com/docs/overall/dev_tutorial_general_information/index.html) and [Tutorials > Frontend > Introduction](https://geta12.com/docs/overall/dev_tutorial_frontend_intro/index.html) before continuing here. |

You can then check out the tag **2025.06-ext5/frontend/task-4-start** to follow along this tutorial.

If you get stuck at any point, you can check out the tag **2025.06-ext5/frontend/task-4-end** to see how your code differs from the solution.

## Use-Case

Our customer has requested to further extend the CRM system to see statistics about their contacts in a new module.
Specifically, they want to see the types of contacts in the system, e.g. VIP, in a pie chart.

The focus of this task is on how we can get the data from an external source into the activity associated with the module.
We will also add a new module that includes various components from Widgets and the recharts library to display this data in a pie chart.
The external source in this case will be our local server, but the same principles apply for making a request to any other server to get data.

## End Result

Upon finishing this task, you will know:

* How data loading is handled in A12.
* How to use data handlers to customize the loading of data.
* How to send a request to Data Services backend using the `Dispatcher` util of Data Services frontend libs.

In the end, we should have a dashboard in our application containing a pie chart that looks similar to this:

![final result](https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_frontend_data_in_activities/assets/final_result.png)

## Step-by-Step Instructions

Until now, A12 took care of the data loading for our activities. For example, when we added the contact overview, we did not have to worry about how we would get a list of contacts to fill it. This was handled for us.

For the custom statistics, we now need to do this ourselves by getting the necessary data from the server and loading it into the relevant activity. But first, we need to create the module where the pie chart should be displayed.

### Dashboard Module

Adding a new module for the dashboard to our application works similarly to the contact module in [Tutorials > Intro > Modeling > Application Model](https://geta12.com/docs/overall/dev_tutorial_intro_modeling/index.html#_application_model) and the help module in [Tutorials > Frontend > Application Frame > Modules](https://geta12.com/docs/overall/dev_tutorial_frontend_application_frame/index.html#_modules).
As you already got some practice on how to do this in those tutorial tasks, you can now try this yourself.

Your task:

* Create and register a new module for the dashboard in the client.

  + Define a custom view component for the pie charts in this module.
  + You can use the `PieChart` and `PieChartContainer` components that are provided in the `helper-files/task4` folder.
* Extend the `Tutorial_AM` Application Model by modeling this dashboard module.

  + Set the layout `Null` in the content region for this module.
  + Use the `PieChartContainer` as the view component for the `VIEW_ADD` directive.

|  |  |
| --- | --- |
|  | We are not using the `Dashboard` layout provided by the Client, as it is intended for displaying multiple views as tiles in a grid format, which is unnecessary for our single view. |

Click to see solution

1. In `client/src/modules`, create a new folder called "dashboard" with a subfolder "components".
2. Copy the files `PieChart.tsx` and `PieChartContainer.tsx` into this subfolder `client/src/modules/dashboard/components`.
3. Create another folder "types" in `client/src/modules/dashboard` and copy the file `PieChartData.ts` there, as it is needed in `PieChartContainer.tsx`.
4. Create another folder "store" in `client/src/modules/dashboard` and copy the file `pieChartSelectors.ts` there, as it is needed to select the chart data in `PieChartContainer.tsx`.
5. Add the following file into `client/src/modules/dashboard` to create the dashboard module with the `PieChartContainer` custom view component:

   File: `client/src/modules/dashboard/index.ts`

   ```
   |  |  |
   | --- | --- |
   | ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 ``` | ``` import type { Module, View } from "@com.mgmtp.a12.client/client-core";  import PieChartContainer from "./components/PieChartContainer";  const VIEWS: { [name: string]: View.ViewComponent } = {     PieChartContainer };  function viewComponentProvider(name: string) {     return VIEWS[name]; } const module: Module = {     id: "DashboardModule",     views: () => viewComponentProvider };  export default module; ``` |
   ```
6. Register the new dashboard module with the Client.
   The build process automatically discovers any module placed in a subfolder of `client/src/modules/`, so no further action is required.
7. Add a new module to the `Tutorial_AM` Application Model with the following configurations:

   ![dashboard module](https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_frontend_data_in_activities/assets/dashboard_module.png)

   * To this module, add a flow:

     ![dashboard flow](https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_frontend_data_in_activities/assets/dashboard_flow.png)
   * In this flow, define the following scene:

     ![dashboard scene](https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_frontend_data_in_activities/assets/dashboard_scene.png)
   * This scene should contain these two scene changes in the following order:

     ![dashboard region clear](https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_frontend_data_in_activities/assets/dashboard_region_clear.png)

     ![dashboard view add](https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_frontend_data_in_activities/assets/dashboard_view_add.png)
8. Save the model changes. Then you can deploy the Application Model or restart the server.

If you now look at the application running in the browser, you will see a new menu item named "Dashboard".
When you click on it, you should see the following:

![starting state](https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_frontend_data_in_activities/assets/starting_state.png)

With this, you have successfully created your own module. However, the pie chart is not displaying any helpful information yet as we are still missing the data for it. This is what we will take care of next.

### Data in Activities

When discussing how to get data into an activity, it is important to distinguish if the data is already available when starting the activity or if it needs to be loaded later.
For our dashboard, the latter is the case. However, we will introduce both approaches to give you a better overview.

#### Starting an Activity With Data

|  |  |
| --- | --- |
|  | This section is unrelated to the dashboard module and does not require you to do anything but read and understand the concepts involved. |

If you already have data at the time of creating an activity you can pass it as part of the action that creates it.
This will not be used in our dashboard module, since we do not readily have the data to fill the chart.
However, let us see an example to better understand how this works.

We can create a new activity with `ActivityActions.create` in our application and pass a `data` property:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 ``` | ``` import { useDispatch } from "react-redux";  import { ActivityActions } from "@com.mgmtp.a12.client/client-core";  const createMyActivityWithData = () => {     const dispatch = useDispatch();     dispatch(         ActivityActions.create({             activityDescriptor: {                 your: "activity"             },             data: {                 hello: "world"             }         })     ); }; ``` |
```

Now anywhere in the application where we have access to the redux store, for example in a component, we can access all information provided in that activity.

In the following example we select the default data of that activity:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 ``` | ``` import { useSelector } from "react-redux";  import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core"; import type { View } from "@com.mgmtp.a12.client/client-core";  export default function MyPage(props: View) {     // Selects the data of the default DataHolder of the activity,     const activityData = useSelector(         ActivitySelectors.data(props.activityId)     ) as // A12 cannot know the type of this data, so you will have to manually type it. Data can be undefined.     { hello: string } | undefined;      // when defined return MyPage     return activityData ? <p>{activityData.hello}</p> : null; } ``` |
```

Data added to an activity, as seen in the example, is stored in a data holder.
Since an activity might require multiple pieces of data, each data source should have its own data holder attached to the activity.
This data holder consists of:

* A descriptor to identify what data it contains.
* Additional properties to keep track of the data.

When creating a new activity, it is always initialized creating a single default data holder containing the activity’s descriptor as data holder descriptor.
But the activity can of course be extended with additional data holders.
For more information about data holders, you can take a look at [Client > Activity Data Structure > DataHolder](https://geta12.com/docs/client/client-documentation-bundle/index.html#/basics/activity/data-holder).

The additional properties can then be used to give feedback to the user about the data, for example if it is currently in a loading state or has an error.
This can help inform the user about what is happening via loading spinners, or an error notification.

In our example above, we create the activity and directly pass the data, so it will never be in a loading or error state. However, when data is loaded asynchronously these properties will be useful. This is the case for our dashboard data.

#### Starting an Activity With "Missing" Data

When we start an activity and know it must load data, we use one of these additional properties to indicate this.
Specifically, we can set the property `loadingState` to `missing` while creating the activity, which can look like this:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` import { useDispatch } from "react-redux";  import { ActivityActions } from "@com.mgmtp.a12.client/client-core";  const createMyActivityWithExternalData = () => {     dispatch(         ActivityActions.create({             activityDescriptor: {                 your: "activity"             },             loadingState: "missing"         })     ); }; ``` |
```

This `loadingState` property monitors the progress and outcome of the data loading.
By setting it to `missing`, we tell the Client that the data for the activity is required but not available, prompting the runtime to load it.
You can find an overview of all available values for this `loadingState` in [Client > Activity Data Structure > Data Loading](https://geta12.com/docs/client/client-documentation-bundle/index.html#/basics/activity/data-loading).

In our dashboard example, the activity will be created by selecting the "Dashboard" menu item. We can add this information to our Application Model to inform the Client that the activity requires data.
For this, we extend the `VIEW_ADD` directive of the dashboard module in our `Tutorial_AM` Application Model to indicate that we want to trigger the data loading.

You can do this in the `VIEW_ADD` directive of a scene change by ticking the "Load Data" checkbox.
This is an optional boolean flag that determines if the runtime should automatically trigger data loading for the scene.
Therefore, we can now tick this checkbox for the `VIEW_ADD` directive of the scene in our dashboard module:

![dashboard loaddata checkbox](https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_frontend_data_in_activities/assets/dashboard_loaddata_checkbox.png)

Save the model changes. Then you can deploy the Application Model or restart the server.

|  |  |
| --- | --- |
|  | Enabling this flag is only required if data should be loaded without having any A12 models specified.  Conversely, having models defined for the view and setting this flag to false, will not stop data from loading. To prevent data loading, you would need to either not define any models and leave the flag unchecked, or manually set the `loadingState` in the activity to `without`. |

### Data Loading

The Client checks if data loading is required for every scene that gets activated for an activity.
You can find more information on how this evaluation works in [Client > Data Loading](https://geta12.com/docs/client/client-documentation-bundle/index.html#/basics/data-loading).
For the activity of our dashboard module for example, the Client will determine that data loading is necessary based on the `loadData` flag and the `loadingState` property being set to `missing` as a result.

If it is determined that data needs to be loaded, the runtime will try to find a matching data handler to do this which is the approach for all data operations. There are three kinds of data handlers:

| Type of data handler | Supported actions | Usage |
| --- | --- | --- |
| Data loader | * load * save * delete | Exchange of business data with external systems. |
| Data editor | * read * write | Exchange of business data between activities. |
| Data provider | * load * save * delete | Exchange of business data with external systems **and** between activities. |

The runtime evaluates each of these for a given activity in the same order as they are listed in the table above. The first matching instance is then used.
To learn more about the different kinds of data handlers and how they are selected, you can read [Client > DataHandlers](https://geta12.com/docs/client/client-documentation-bundle/index.html#/basics/data-handler).

The data operations can be customized by providing the necessary data handler.
For our dashboard, we therefore need to implement a data handler to load the data for the chart.
Since we only need to retrieve data from an external system - specifically the server - and not from another activity, we will set up a data loader for this.

If we also needed to dispatch actions or fetch data from the Redux store, a data provider would be needed instead.
However, since this is unnecessary for the dashboard, a data loader is sufficient.

This data loader needs to specify the types of activity that can be handled and a function to call for loading the data.
We can now see what this looks like with the data loader for the pie chart.

Create a folder called "data" in `client/src/modules/dashboard` and add a new file `PieChartDataLoader.ts` into it. Then you can copy the following code snippet into this file:

File: `client/src/modules/dashboard/data/PieChartDataLoader.ts`

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 ``` | ``` import type { Activity, DataLoader } from "@com.mgmtp.a12.client/client-core";  import type { PieChartData } from "../types/PieChartData";  export class PieChartDataLoader implements DataLoader<PieChartData> {     readonly name: string = "PieChartDataLoader";      canHandle(activityDescriptor: Activity.Descriptor): boolean {         return activityDescriptor.module === "Dashboard";     }      async load(): Promise<PieChartData> {         // This is where you would make a request for your data.         return {             // "customerType.vip" is a localization key.             contactsByType: [{ name: "customerType.vip", fill: "#00589F", value: 10 }]         };     }      save(): Promise<PieChartData> {         throw new Error("Method not implemented.");     }      delete(): Promise<void> {         throw new Error("Method not implemented.");     } } ``` |
```

You can see that the data loader can be divided into three parts:

* A `name` to help debugging.
* A `canHandle` function to decide if we should handle the data loading for the current activity.

  + It checks if the descriptor property matches the one described in the Application Model.
  + This allows us to ensure that we are watching and loading data for the correct activity.
* Three operations to do the actual handling logic: `load`, `save` and `delete`.

After implementing the data loader, it must be added to the application setup to register it with the Client:

File: `client/src/appsetup.ts`

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` //... import { addDataHandlers } from "@com.mgmtp.a12.client/client-core"; import { PieChartDataLoader } from "./modules/dashboard/data/PieChartDataLoader"; //...  const applicationFeatures = combineFeatures(     //...     addDataHandlers(new PieChartDataLoader()) ); ``` |
```

Now when you try clicking the "Dashboard" menu item, you should see some data being displayed:

![simple data provider](https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_frontend_data_in_activities/assets/simple_data_provider.png)

Our data loader is loading the data for our activity. Currently, it uses the hardcoded `contactsByType` defined within the loader itself. Next, we will explore how to fetch real customer data from Data Services.

#### Sending a Request to Data Services

To request data from the server, we need to send an authenticated JSON-RPC request to Data Services.
You can see examples of such requests by opening the network tab in the browser developer tools and clicking the "Contact" menu item.
One of these requests should be called "rpc" with a body similar to the following:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 ``` | ``` [    {       "jsonrpc":"2.0",       "method":"QUERY",       "id":"OverviewEngineDataProvider-4-0",       "params":{          "query":{             "projectionName":"document",             "targetDocumentModel":"Contact_DM",             "paging":{                "pageSize":50,                "pageNumber":0             },             "sort":[                //...             ],             "fields":[                //...             ]          }       }    },    //... ] ``` |
```

This request therefore contains the following properties:

* `jsonrpc`: This is the version of JSON-RPC, in our case it is always `2.0`.
* `id`: An identification for the request. With multiple requests you can track down the one you want by knowing its id.
* `method`: What we want the server to do for us, specified by the server endpoint that we send the request to. You can find an overview over all available JSON-RPC operations in [Data Services > JSON-RPC 2.0 Core Operations](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#rpc-operations).
* `params`: Extra information to get the server to do exactly what we want. This depends on what endpoint is set in `method`.

The request above is sent from the Overview Engine to Data Services to retrieve the documents displayed in the contact overview.
Specifically, the method `QUERY` is used which is the RPC operation for sending requests to the Data Services Query API.

The Query API is a data retrieval API that allows you to load data from Data Services via various methods, including this JSON-RPC `QUERY` operation.
It supports a wide range of features, from projection to aggregation.
If you want to learn more about the Query API, you can take a look at [Tutorials > Query API](https://geta12.com/docs/overall/dev_tutorial_query_intro/index.html) and [Data Services > Query API](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#_query_api).

For our case, we just want to get all the contact documents and aggregate them based on their customer type.
Therefore, we just need the aggregated results, and no further information or processing.
While this is possible with the `QUERY` operation, Data Services also provides a dedicated HTTP endpoint for aggregation: `POST /api/aggregation`.

This endpoint accepts the query definition in the request body and returns a two-dimensional array containing the groups and their corresponding aggregation function results.
It is optimized for performance, avoiding complicated transactional handling, batching, or JSON-RPC wrappers. However, it is limited to aggregation use cases and does not support more advanced query features.
But since our use case only involves basic aggregation, this endpoint is a suitable choice.
For more information on aggregation and this endpoint, you can take a look at [Data Services > Query API > Aggregations](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#aggregations).

Now, we just need to determine how we can send such a request to the server to fetch the data for our chart into the activity.

##### Authenticated Requests

Since we don’t want our customers' data to be exposed haphazardly, authentication will be required to request data from Data Services.
Each of the requests that is sent in A12 behind-the-scenes, contains an authentication token to prove to the server that we are a logged-in user with the required rights to access a resource.

Therefore, we will also need to pass this authentication token with our request, just as it is done for the "built-in" requests from A12.

To easily connect to your backend A12 offers two libraries. At first there is a connector library that is responsible for configuring the requests (for example adding the authentication). In addition, there is a wrapper library for the connector that offers a convenient way to send requests to a Data Services backend.

###### Connector Library (ServerConnector of utils-connector package)

Specifically, we can use the `ConnectorLocator` class of this library to obtain an instance of the `RestServerConnector`, which implements the `ServerConnector` interface.
This gives us the required infrastructure to make requests to the server from the client, without needing to manage authentication manually.
You can find more information on how this works in [Server Connector > JS Connector Client](https://geta12.com/docs/utils_server_connector/server-connector-documentation-src/index.html#_js_connector_client).

Below is an example of making a request using the functionality from the Server Connector component.
When making a request like this, the user’s authentication token is passed, helping to avoid any `401 Unauthorized` errors.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` import { ConnectorLocator, RestServerConnector } from "@com.mgmtp.a12.utils/utils-connector";  export async function makeRequest(): Promise<void> {     const serverConnector = ConnectorLocator.getInstance().getServerConnector() as RestServerConnector;      const response = await serverConnector.fetchData({         // A request object.     });      const result = await response.json();      // The result of the request:     console.log(result); } ``` |
```

###### Convenience Wrapper (Dispatcher of dataservices-access package)

Wrapper of server connector for convenient dispatching requests in a type-safe way. The Dispatcher provides a method for `REST` requests and a method to handle `rpc` requests.

You can find more information on how this works in [Data Services > Dispatching Requests From The Client-Side](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#json-rpc-dispatching-requests).

Below is an example of making a request using the functionality from the Dispatcher.
The underlying usage of Server Connector ensures that the user’s authentication token is passed on each request.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 ``` | ``` import { Aggregation, Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access"; import type { RestRequestPayload } from "@com.mgmtp.a12.utils/utils-connector";  export async function makeRequest(): Promise<void> {     // A RestRequestPayload object.     const request: RestRequestPayload = {/*...*/};      // A TypeGuard to check if the provided responses is of expected type     // (A12 offers a lot of type guards but also custom one can be used)     const responseChecker = Aggregation.Response.isInstance;      // Will throw if responseChecker will fail     const result = await Dispatcher.rest(request, responseChecker);      // The result of the request of the correct type provided by type guard:     console.log(result); } ``` |
```

##### Request for Contact Data

Now that we have seen how we can make our request to the server and what the request should look like, we can put this together for our chart data. To do this, we will need to:

* Construct a REST request object for an aggregation query to Data Services via the `POST /aggregation` endpoint.
  You can find an example on how to use this endpoint in [Tutorials > Query API > Discovering Queries > Aggregation](https://geta12.com/docs/overall/dev_tutorial_query_discovering_queries/index.html#_aggregation).
  With this, we want to group all `Contact_DM` documents by their customer type and get a count for each group.

  + Use `"Contact_DM"` as the target document model.
  + In the aggregation specification:

    - Group by the field `/Contact/PersonalData/CustomerType`.
    - Apply the `count` function to the `/Contact/PersonalData/CustomerType` field.
  + Remember to `JSON.stringify` the body of the request before sending
  + It is necessary to adapt the custom headers for the request since the endpoint expects an `Accept`, `Accept-Language`, and `Content-Type` header where `Accept-Language` matches a single locale as defined in the A12 Document Model:

    ```
    |  |  |
    | --- | --- |
    | ``` 1 2 3 4 5 ``` | ``` customHeaders: [     ["Accept", "application/json"],     ["Accept-Language", "en"],     ["Content-Type", "application/json;charset=utf8"] ] ``` |
    ```
* Use the `Aggregation.Response.isInstance` TypeGuard provided by `dataservices-access` library.
* Send this as authenticated request to Data Services using the `Dispatcher`.
* Get the typed data from the response and return it.

You can see how this can be implemented below:

File: `client/src/modules/dashboard/data/PieChartDataLoader.ts`

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 ``` | ``` //... import { Aggregation, Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access"; import type { RestRequestPayload } from "@com.mgmtp.a12.utils/utils-connector"; //...  async function getContactsByType(): Promise<Aggregation.AggregationTuple[]> {     // Define query root for aggregation request     const queryRoot = {         // The document model we are interested in         targetDocumentModel: "Contact_DM",         // We want to group our contacts by type         aggregation: {             aggregations: [                 {                     function: "count",                     field: "/Contact/PersonalData/CustomerType"                 }             ],             group: [                 {                     field: "/Contact/PersonalData/CustomerType",                     alias: "customerType"                 }             ]         }     };      // Create Aggregation REST Request Payload     const request: RestRequestPayload = {         method: "POST",         relativeUrl: `/aggregation`,         body: JSON.stringify(queryRoot),         customHeaders: [             ["Accept", "application/json"],             ["Accept-Language", "en"],             ["Content-Type", "application/json;charset=utf8"]         ]     };      // Request the data via DS request dispatcher then return it or throw     return await Dispatcher.rest(         request,         // Guard to check if we get the required response         Aggregation.Response.isInstance     ); } ``` |
```

#### Loading the Data

You can now finish this feature by implementing the last open points in the data loader.

Your task:

* Call the `getContactsByType` function within `load`.
* Convert the data into the `PieChartData` type, which the component expects.
* Replace the previously hardcoded chart data return.

Click to see solution

File: `client/src/modules/dashboard/data/PieChartDataLoader.ts`

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 ``` | ``` //...  // Some colors for our pie chart segments, feel free to change these. const colors = ["#00589F", "#0081BD", "#00A8BD", "#00CAA3", "#8AE682", "#F9F871"];  export class PieChartDataLoader implements DataLoader<PieChartData> {     //...      async load(): Promise<PieChartData> {         const contactsByType: Aggregation.AggregationTuple[] = await getContactsByType();         return {             contactsByType: contactsByType.map(([name, value], index) => ({                 name: `customerType.${name}`,                 value: value,                 fill: colors[index % colors.length]!             }))         };     }      //... } //... ``` |
```

With the data loader providing us real data about our customers, you can try adding a few new contacts to the CRM system.
Or alternatively, you can extend the `import/data/request/ContactRequest.json` file to create multiple contacts by running the `init` application.
To do this, you can use the `ContactRequest.json` file provided in the `helper-files/task4` folder, which contains additional contacts.
You can also have a look at [Tutorials > Intro > Project Template > Creating new Contacts on Start-up](https://geta12.com/docs/overall/dev_tutorial_intro_project_template/index.html#_creating_new_contacts_on_start_up).

The chart in the dashboard should then look similar to this:

![final result](https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_frontend_data_in_activities/assets/final_result.png)

## Conclusion

In this task, we have looked at some ways to get data into activities and how to load data from the server into the client. You have also created your first module by yourself.
If you got stuck at any point, you can check out the tag **2025.06-ext5/frontend/task-4-end**, in order to see how your code looks compared to ours.

With that, you have completed the frontend tutorial. We have used many of A12’s core client-side features in combination with some custom code to improve the functionality of our CRM application.

Now that you have worked through the frontend tutorial, we would also really appreciate [your feedback](https://geta12.com/docs/overall/dev_tutorial_frontend_intro/index.html#_feedback). If you have any ideas or wishes for additional tasks or tutorials, you can let us know there.

While we covered a lot, there are still many topics we didn’t touch on, such as Tree Models, Composed Data Models, and more. However, having grasped the fundamental concepts for building the application, you will find it easier to explore these topics.
You can also take a look at [Tutorials > General Information > Structure](https://geta12.com/docs/overall/dev_tutorial_general_information/index.html#_tutorials_structure) for the other available tutorials if you are interested in learning about other A12 topics, such as backend customization.

|  |  |
| --- | --- |
| [« Task 3: Form Customization](https://geta12.com/docs/overall/dev_tutorial_frontend_form_customization/index.html) | [Task 5: Middleware and Saga »](https://geta12.com/docs/overall/dev_tutorial_frontend_middleware_and_saga/index.html) |
