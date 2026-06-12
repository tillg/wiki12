---
source: https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/index.html
category: data_distribution
docid: datadistribution-documentation
scraped: 2026-06-12
---

# Data Distribution

|  |  |
| --- | --- |
|  | This documentation belongs to an A12 Enterprise Component which is not part of the Open Source offering (A12 Community Edition). Please feel free to browse the documentation and learn more about how you can use this A12 component in your project. Learn more about the benefits from an A12 Enterprise Subscription on [the Editions & Licensing page](https://geta12.com/#/editions-licensing). |

## Introduction

A12 **D**ata**D**istribution (A12 DD) is a component which provides capabilities that data between nodes can be synchronized. A node can be a browser or a server process. This functionality can be used to store data in the client (browser) so that operations can be done faster (as no round trip to the server is required), or to work offline, in case all required data is already available in the client. The solution is already used in production with more than 10.000 clients and 1.000 server nodes.

The A12 DataDistribution component consists of client and server libraries. The component itself is not providing REST endpoints or a A12 based client. It is only providing functionality, which can be used in the server or client in order to enable the data synchronization.

The data provided by the application has to be send to the DataDistribution server component in order to make the data available there. From there, the data is synchronized to the client. Changes made on the client are synchronized with the server, which relays the changes to the application through messages. Data can be created or updated on either the client or the server. All changes are synchronized with the respective other communication partner. The data can be stored locally encrypted. The client application can still communicate directly with various services in the backend.

The following key features are available:

* Data Distribution is a technical service used to distribute data and propagate changes across servers and clients
* It is provided as an A12 Component which can be included in an A12 project as a library
* Focus on scaling and offline capabilities
* Can be used device independent
* DataDistribution is just a transport layer
* Application or clients submit data (payload) for distribution
* Applications / clients receive events about data updates (including the payload)

The power of using synchronization rather than track individual changes is that in case the synchronization is blocked for a longer time, only the latest version of each changed document is synchronized. If e. g. a field, like price is updated on a document 10 times in between, only the latest state (latest price) is synchronized with the client in case the data connection is back. This is reducing the amount of data to the minimum necessary.

**DataDistribution is NOT a distributed database (no query capabilities)**

The approach of data synchronization enables several use cases that are helpful beyond just offline availability:

* **Initial Synchronization**: When logging in for the first time on a client that hasn’t received any data yet, all necessary data for the current user is loaded into the browser’s indexedDB. From there, the data is periodically compared with the server’s data repository when online. The user can log in from a different browser and once again load the data with an initial synchronization.
* **Delta synchronization**: After an initial synchronization has been performed, the data is compared using a delta synchronization. It doesn’t matter whether the client is online or the connection was interrupted for several weeks.
* **Backup**: In this case, the server can also be seen as a "backup medium." As long as an online connection exists, the most up-to-date data is always stored on the server. In the event of a computer crash, the data can be retrieved from another computer via the server, and work can be resumed.
* **Push mechanism**: The data synchronization approach allows sending data from the server to the client (push). This informs the client about new data, and it can react accordingly (e.g., through a modal dialog).
* **Data exchange between clients**: Through the synchronization of data between the client and the server, communication between two clients is also possible (via a shared server). This enables a different approach, such as optimistic locks, where a user is informed about activities of other users.
* **Event-driven architectural pattern**: This design pattern has the advantage that the client reacts to data that is changed in the background. For example, this allows for modal dialogs in the case of changes from "external" sources or updating displayed lists.
* **Additional information**: In addition to JSON documents, further information can be "appended." For instance, comments, notes, tags, or log information can be attached to a data record. These pieces of information are concatenated in the backend across different clients and are not overwritten individually. For example, notes about a current case can be created by multiple users. These notes are concatenated together on the server and can be viewed by other users as well.
* **Attachments**: Documents can be provided with attachments, such as PDF files or images. These attachments can then be loaded by the client application from a server for display or stored locally on the mobile device in encrypted form (storage can be implemented using service workers).
* **Responsiveness**: Due to holding the data on the client, no loading times are necessary when switching views (e.g., from a master view to a detail view). Since the data is already present on the client, no requests to the server are required. The pages are displayed significantly faster and more visibly.
* **Deferred loading**: It’s also possible to load data that was excluded by the specified filter during synchronization at a later time.

To accurately represent data changes from multiple users or changes in both the client and the server for the same data record, version vectors are employed. These version vectors enable conflicts to be automatically resolved or identified as true conflicts that need resolution by a user. Additionally, in the frontend, finer-grained changes, such as at the field level, can be captured and merged using version vectors.

By consistently implementing the event-driven architectural pattern, asynchronous processing can also be supported in the backend, facilitating the transmission of data from third-party systems (such as GeCo) to the client. This approach also supports an Offline-First architecture and, in conjunction with Service Workers, Progressive Web App (PWA) applications.

![Offline First Architecture](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/offline-first_architecture.png)

If offline operation is supported, it’s important to consider that certain validations and state transitions (e.g., completing tasks) must be feasible while offline. By utilizing A12 validation rules and calculations, it becomes possible to execute the same logic both in the client and on the server. This approach enables validation rules and state transitions even in offline scenarios.

The offline data storage in the client’s IndexedDB is often limited by the browser on mobile devices. If the decision is made to use the A12 DataDistribution libraries, a detailed analysis should determine whether a limitation of IndexedDB primarily exists on mobile devices, and potentially, an external form of persistence needs to be considered.

If the prerequisites for exclusive online operation cannot be met or are not achieved quickly enough, the proposed approach offers a solid solution. Additionally, it brings forth further advantages and safeguards against situations where internet connectivity might unexpectedly become unavailable on-site. As part of an architectural decision, we recommend documenting the functional and non-functional requirements (including data volume estimates) in detail and defining the specific implementation approach.

You can find a simple example of how the data is synchronized: [Example](https://geta12.com/docs/2025.06/ext5/data_distribution/example/index.html)

### DD\_ENTRY

The main entity for data synchronization is the dd\_entry data type.

### Get started

Central questions before implementing data distribution:

* What is the maximum amount of data to be synchronized?
* Which clients need to be serviced, and is the data volume manageable in terms of transmission and processing on the client side?
* What entities do I have, and how are they related to each other?
* How is visibility established for the data, users, org units, etc.?

## Example of data synchronization

In the following scenario it is illustrated how the DataDistribution component can be used. The first picture shows teh A12 client server communication without DataDistribution. The communication to the server components is done synchronously with REST:

![Synchronization Example - Starting Point](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/sync_example/sync_example_1.png)

In order to use the DataDistribution components a client library and server library have to be integrated. The client library is synchronizing the data with the Redux Store. From there the data can be used in the client. For the server, the REST end points and JMS integration have to be defined (see demo application). The data from A12 DataServices has to be imported in the DataDistribution (e. g. the models and documents which should be handled by the DataDistribution component). The DataDistribution will take care of synchronizing the data to the client.

![DataDistribution integration](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/sync_example/sync_example_2.png)

Once the DataDistribution is integrated, it can be used for data synchronization. In the first scenario a document is created or updated in the client (browser).

![DataDistribution - Create document in the client](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/sync_example/sync_example_4.png)

The new document is synchronized with the server.

![DataDistribution - Synchronized with the server](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/sync_example/sync_example_5.png)

A document can be also created or updated on the server:

![DataDistribution - Synchronized with the server](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/sync_example/sync_example_6.png)

1. it will be synchronized with the client.

![DataDistribution - Synchronized with the server](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/sync_example/sync_example_7.png)

Synchronization means that any changes on both sides (client or server) will be synchronized.

![DataDistribution - Synchronized with the server](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/sync_example/sync_example_8.png)

## Client

### General concepts

The main technologies of the A12 Client are redux, sagas, react and the higher order technologies A12 Widgets and Form- and Overview Engines. One main concept of the Client is the application model and using activities to define the state of the application on wich the ui can "react" on.

The Datadispatcher is a central server and client component to handle synchonisation, dispatching and storing data. By the usage of redux, both concepts work perfectly together on client side. There are mainly two ways to use the datadistribution client within the A12 Client.

#### Directly Connected Views

One main feature of A12 datdistribution is displaying "live" data. This was one of its first features, for example to display different datasets on a dashboard to give the user an overview of business key figures.

We do not have to use the dataloader or dataprovider concept from A12 Client, but can connect our data directly to components and engines, wich is the standard redux way. This is because the dataloaders and dataproviders are not designed to handle real time data that is already in the store. It is a concept to load data form external sources into activities. An activity is seen as datacontainer that provides all the data needed in a business use case. If we have multipe views where we need data of different types to display it in for example a dashboard, this data can automatically be updated in the background by the datadispatcher.

![Client connected view](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/client_connected_view.png)

#### DD Connected Dataprovider

Nevertheless the datadispatcher can also be used with A12 Client dataproviders and activities. You can select data from the in memory db and copy it to the activity data and store it when needed. This can be done by a dataprovider implementing the A12 standard activity actions.

It is also possible to update activity data if there is new data on the datahub, but this is not the main idea of activities that are seen as a isolated use case implementation. If you update data in the background, you have always be aware of the usability. Useres normaly never expect that theri input is changed in the background without any notification.

![Client connected data provider](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/client_connected_data_provider.png)

#### The datadistribution flow in redux

The Datadispatcher (DD) is a central component that hosts and synchronizes data between client and backend where the backend can have two stages. The client part of the datadispatcher is an in memory database that is kept in sync with the connected server and stores data locally to provide offline usage to the application.

The following diagram illustrates the DD-implementation in redux. A main requirement of the DD is the optional persistence. The DD should be fully working without local persistence, keeping all information in memory. The optional persistence layer is used for buffering not synced outbound data and initialization of the datahub to avoid initial synchronisation.

The in memory data is stored as normalized data tables in the redux store, organized by type and id as suggested in the redux documentation (<https://redux.js.org/usage/structuring-reducers/normalizing-state-shape#designing-a-normalized-state>).

![Client redux data flow](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/client_redux_data_flow.png)

| Action | Description |
| --- | --- |
| **Sync Call (simplified)** |  |
| **1** DDSync/EXECUTE\_SYNC | Executes a new sync cycle if no sync call is running. Is called by a sheduler or manually. |
| **2** Sync Rest Call | The sync Rest-Call is executed against the current sync partner. Set the sync call state to RUNNING via DDSync/SET\_SYNC\_STATE |
| **3** DDHub/RECEIVE\_DATA | Puts the received data of a successful sync into the inbound buffer, executes version updates and deletes on the data hub, stores inbound data to the indexedDB, updates the sync meta information like timestamp, seen timestamps, last sync. |
| **4** DDHub/PROCESS\_INBOUND\_DATA | Triggered by the sync saga to proccess the data in inbound,. In inbound the payload of DDEntries contains the transferable and persistable format which might be converted for the usage in the ui. |
| **5** Execute DDReducer | Execute type specific reducers that write the data to the data hub and remove it from inbound. DefaultReducers are available. |
| **6** DDHub/PUT\_DATA | Type specific sagas might be called to process inbound data which use PUT\_DATA to put the data into the Hub which is the in memory represantation of DDEntries that are used by applications. |
| **7** Use Data in View | The Data of the Datadispatcher might be directly connected in views to implement live updates. It can of cource also be used in activities and updated if needed. |
| **8** DDSync/FINISH\_SYNC | Finish the sync, clear outbound and reset the call state. |
| **Storing Data** |  |
| **1** DDHub/STORE\_DATA | Called by applications to store data into the datadispatcher. The payload of the DDEntries has to be in the transferable format. |
| **2** DDHub/WRITE\_TO\_CHANNELS | Writes the dirty data to the outbound and inbound buffer and stored in the indexedDB. We do optimistic writing because we do not know when the data is transferred to the backend. Therefore and because the backend might only deliver new timestamps and versions we need to write the data to inbound.If the data is rejected ore changed by another sync partner the data might be changed later. Managing concurrent data is not a direct feature of the dd but there are several concepts build on top of it. |
| **3** DDHub/PROCESS\_INBOUND\_DATA | For the data that is stored by the STORE\_DATA action PROCESS\_INBOUND\_DATA is called to update the data in the data hub in the correct format. |
| **Initialize User** |  |
| **1** Init User | Call the initialization of data in the user initialization process |
| **2** DDHub/RECEIVE\_DATA | Call receive data with the persisted inbound data |
| **3** DDHub/STORE\_DATA | Call store data with the persisted outbound data to restore not synchronized data. |
| **Collect Garbage** |  |
| **1** DDGC/EXEC\_GARBAGE\_COLLECTION | Executes a new gc cycle if no gc or sync is running. Is called by a sheduler or manually. |
| **2** Read data from Hub | Iterates over the data in the hub to detect outdated entries. |
| **3** DDGC/PROCESS\_GARBAGE | The outdated data is removed from persistence |

### Integration

The integration and use of the data distribution client can vary greatly depending on the project. There are various requirements that can be implemented through customization. However, the basic functionality is quite simple. This documentation describes the necessary steps for configuration and the use of the client.
To integrate the client into your client project you nedd to call "npm install @com.mgmtp.a12.datadistribution/data-distribution-client"

#### Minimal Integration

The following steps need to be taken to integrate the data distribution client into the a12 client. This is an minmalistic integration that makes sence to test if the datadistribution communikation to the backend is up and running.
To implement a client solution based on datadistribution see module integration.

##### Configure middleware and datareducers

simple appsetup

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 ``` | ``` import "./config";  import { ApplicationFactories, ApplicationSetup } from "@com.mgmtp.a12.client/client-core/lib/core/application"; import * as appModel from "./appmodel.json"; import { 	createDDMiddlewares, 	createDDReducer, 	createDefaultDataReducer } from "@com.mgmtp.a12.datadistribution/data-distribution-client";  export const config: ApplicationSetup = ApplicationFactories.createApplicationSetup({ 	model: appModel, 	modelLoader: { 		name: "emptyLoader", 		load: (modelDescriptors, existingModels = {}) => { 			return Promise.resolve(existingModels); 		} 	}, 	dataHandlers: [], 	additionalMiddlewares: [...createDDMiddlewares(() => [{ type: "my-data-type" }])], 	reducerMap: { 		dd: createDDReducer(() => [createDefaultDataReducer("my-data-type")]) 	} }); ``` |
```

This will configure the synchronization of the data type "my-data-type"

##### Initialize

Optional dispatch DDInitializationActions.initialize if there is anything to configure, for example the syncInterval (Default is 60000ms) or the backend urls.

Then inititalize the User on Login and deinititalize on logout.

initialization

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 ``` | ``` import { Middleware } from "redux";  import { UaaActions, UaaOidcUser } from "@com.mgmtp.a12.uaa/uaa-authentication-client"; import { DDInitializationActions } from "@com.mgmtp.a12.datadistribution/data-distribution-client"; import { Logger } from "@com.mgmtp.a12.utils/utils-logging/api"; import { LoggerFactory } from "@com.mgmtp.a12.utils/utils-logging";  const log: Logger = LoggerFactory.getLogger("dd.demo.middleware");  export function createDDInitializationMiddleware(): Middleware { 	return api => next => async action => { 		const result = next(action); 		if (UaaActions.loggedIn.match(action)) { 			const user = action.payload.user as UaaOidcUser; 			if (user.profile.preferred_username) { 				api.dispatch( 					DDInitializationActions.initializeUser({ 						identifier: { 							syncClient: "my-sync-client-id" 						}, 						session: { 							userId: user?.profile.preferred_username, 							userPermissions: DDInitializationActions.allUserPermissions 						} 					}) 				); 			} else { 				log.error("Cannot initialize dd, missing username!"); 			} 		}  		if (UaaActions.loggedOut.match(action)) { 			api.dispatch(DDInitializationActions.deinitializeUser()); 		}  		return result; 	}; } ``` |
```

where my-sync-client-id has to replaces by anything to identify the sync\_client.

#### Module Integration

The recommended way to integreate the datadistribution client into the A12 client is to make use of the A12 client modules.

First we need a datadistribution specific module

initialization

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 ``` | ``` import { Reducer } from "redux";  import { Module } from "@com.mgmtp.a12.client/client-core/lib/core/application"; import { Selector } from "@com.mgmtp.a12.client/client-core/lib/core/store"; import { DDTypeConfig, DataHubStore } from "@com.mgmtp.a12.datadistribution/data-distribution-client";  export interface DDModule extends Module { 	readonly ddTypeConfig: Selector<DDTypeConfig[]>;  	ddReducer?(): Reducer<DataHubStore>[]; } ``` |
```

Then we create a module for the integration of the datadisribution client, which has to be loaded on client bootstrap.

initialization

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 ``` | ``` import { Reducer } from "redux";  import { 	createDDMiddlewares, 	createDDReducer, 	DataHubStore, 	DDEnvironment, 	generateUniqueID } from "@com.mgmtp.a12.datadistribution/data-distribution-client"; import { Module, ModuleRegistryProvider } from "@com.mgmtp.a12.client/client-core/lib/core/application"; import { DDTypeConfig } from "@com.mgmtp.a12.datadistribution/data-distribution-client/lib/dd/internal/init/types";  import { DDModule } from "../ddModule";  import { createDDInitializationMiddleware } from "./middleware";  class DDInitModule implements Module { 	public instanceId; 	id = "dd";  	private reducersMapObject = { 		dd: createDDReducer(() => { 			let result: Reducer<DataHubStore>[] = []; 			// Collect reducers from modules 			for (const module of ModuleRegistryProvider.getInstance().getAllModules()) { 				const ddModule = module as DDModule; 				if (ddModule.ddReducer) { 					result = [...result, ...ddModule.ddReducer()]; 				} 			} 			return result; 		}) 	};  	constructor() { 		DDEnvironment.featureToggle.persistenceEnabled = true;  		// Generate and store an instance id for this client 		const storage: Storage = window.localStorage; 		let instanceId = storage.getItem("DD_INSTANCE_ID"); 		if (!instanceId) { 			instanceId = generateUniqueID(); 			storage.setItem("DD_INSTANCE_ID", instanceId); 		} 		this.instanceId = instanceId; 	}  	reducersMap() { 		return this.reducersMapObject; 	}  	middlewares(state: object) { 		return [ 			...createDDMiddlewares(() => { 				const result: DDTypeConfig[] = []; 				// Collect dd configs from modules 				for (const module of ModuleRegistryProvider.getInstance().getAllModules()) { 					const ddModule: DDModule = module as DDModule; 					if (ddModule.ddTypeConfig) { 						result.push(...ddModule.ddTypeConfig(state)); 					} 				} 				return result; 			}), 			createDDInitializationMiddleware(this.instanceId) 		]; 	} }  export default () => new DDInitModule(); ``` |
```

This code can be copied and reused, maybe you want to implement another id for client identification, this is project dependend.
The next step is to implement a middleware that handles the user initialization. Here is an example based on uaa:

initialization

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 ``` | ``` import { Middleware } from "redux";  import { UaaActions, UaaOidcUser } from "@com.mgmtp.a12.uaa/uaa-authentication-client"; import { 	DDInitializationActions, 	generateKey, 	generateUniqueID } from "@com.mgmtp.a12.datadistribution/data-distribution-client"; import { Logger } from "@com.mgmtp.a12.utils/utils-logging/api"; import { LoggerFactory } from "@com.mgmtp.a12.utils/utils-logging";  const log: Logger = LoggerFactory.getLogger("dd.demo.middleware");  export function createDDInitializationMiddleware(instanceId: string): Middleware { 	return api => next => async action => { 		const result = next(action); 		if (UaaActions.loggedIn.match(action)) { 			const user = action.payload.user as UaaOidcUser;  			// Username has to be unique, alt least on this client 			if (user.profile.preferred_username && user.profile.secret) { 				const userName = user.profile.preferred_username;  				// Secret is stored as a User Extension in Keycloak 				const secret = user.profile.secret as string;  				// Generate and store a salt for encryption on demand 				const storage: Storage = window.localStorage; 				let salt = storage.getItem("DD_SALT_" + userName); 				if (!salt) { 					salt = generateUniqueID(); 					storage.setItem("DD_SALT_" + userName, salt); 				}  				// Generate the enctryption key from secret and salt 				const key = await generateKey(secret, salt); 				api.dispatch( 					DDInitializationActions.initializeUser({ 						identifier: { 							// Use a Kombination of the instance id and the user to identify this sync client 							syncClient: instanceId + "_" + userName 						}, 						session: { 							userId: userName, 							userName, 							key, 							userPermissions: DDInitializationActions.allUserPermissions 						} 					}) 				); 			} else { 				log.error("Cannot initialize dd, missing username!"); 			} 		} 		if (UaaActions.loggedOut.match(action)) { 			api.dispatch(DDInitializationActions.deinitializeUser()); 		} 		return result; 	}; } ``` |
```

Now we can add business modules to our application that are base on one or more data types

initialization

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 ``` | ``` import { createDefaultDataReducer } from "@com.mgmtp.a12.datadistribution/data-distribution-client";  import { DDModule } from "../ddModule";  const DD_ENTRY_TYPES = ["person"];  class PersonModule implements DDModule { 	id = "person";  	ddTypeConfig = () => DD_ENTRY_TYPES.map(type => ({ type }));  	ddReducer = () => DD_ENTRY_TYPES.map(type => createDefaultDataReducer(type)); }  export default () => new PersonModule(); ``` |
```

This kind of integration is also used in the datadistribution demo app.

#### Check Integration

To check if your dd integration was successful, you can do the following:

* Check if the redux dd state is created in the store and that there are data tables for each configured type under dd.hub.data
* Check the following values in dd.sync

  + initializationState === "FINISHED"
  + state === "RUNNING"
  + syncFailed === false
  + erros === []
* Check if the sync call is answered with HTTP 200

### Usage

The Datahub is the in-memory database of the datadistribution client.

For a trivial integration, only two things are actually necessary: reading DDEntries from the Datahub using selectors and writing DDEntries using the StoreAction.

#### Transfer Format

When writing data into the Datahub, it is important to note that the payload of the entries must be in the transfer format.

In the Concepts chapter, it is described how the datadistribution client writes data into the hub. Before data is written into the hub, it is always in the inbound state, and before being persisted or synchronized to the backend, it is in the outbound state. Inbound and outbound data are always in the transfer format, meaning they are serialized in this format. The data in the Datahub doesn’t necessarily have to be in the same format.
Writing data into the hub is done through a reducer created using createDDDefaultReducer, but it can also be implemented manually. In the payload of StoreData, the data needs to be converted from its in-memory format back into the transfer format.

#### API

[Client API](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/source/client/api/index.html)

##### Reading Data

Data can be easily read from the DataHub using various selectors. However, when reading directly from the DataHub in a view, it should be noted that the data could be altered due to synchronization.

initialization

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 ``` | ``` import { useSelector } from "react-redux";  import { DataHubSelectors } from "@com.mgmtp.a12.datadistribution/data-distribution-client"; import React from "react"; import { DataTable } from "@com.mgmtp.a12.datadistribution/data-distribution-client"; import { DDEntry } from "@com.mgmtp.a12.datadistribution/data-distribution-client";  export function DDView() { 	const personDataTable: DataTable = useSelector(DataHubSelectors.dataTable("person"));  	const personEntry: DDEntry | null = useSelector(DataHubSelectors.getEntry("person", "12345"));  	const personEntryById = useSelector(DataHubSelectors.getEntryById("12345"));  	if (personDataTable?.byId["12345"] === personEntry && personEntry === personEntryById) { 		return <div>all equal</div>; 	}  	return <div>{personEntry?.payload?.name}</div>; } ``` |
```

##### Writing Data

###### Modify

When modifying data, usually only the payload of an entry is changed, and the record is saved again in the transfer format.

initialization

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 ``` | ``` import { useDispatch, useSelector } from "react-redux";  import { DataHubActions, DataHubSelectors } from "@com.mgmtp.a12.datadistribution/data-distribution-client"; import { Button } from "@com.mgmtp.a12.widgets/widgets-core";  import React from "react";  export function DDView() { 	const dispatch = useDispatch(); 	const personEntry = useSelector(DataHubSelectors.getEntry("person", "12345"));  	const onNameChanged = (name: string) => { 		if (personEntry) { 			const updatedPersonEntry = { 				...personEntry, 				payload: { 					...personEntry?.payload, 					name 				} 			};  			dispatch( 				DataHubActions.storeData({ 					changeSet: [updatedPersonEntry] 				}) 			); 		} 	};  	return <Button onClick={() => onNameChanged("John")}></Button>; } ``` |
```

###### Create

There is a helper function available for creating an empty DDEntry. However, some attributes still need to be set depending on the domain expertise.

initialization

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 ``` | ``` import { useDispatch } from "react-redux";  import { 	BasicDDEntry, 	DataHubActions, 	SyncType, 	createSkeletonDDEntry } from "@com.mgmtp.a12.datadistribution/data-distribution-client"; import { Button } from "@com.mgmtp.a12.widgets/widgets-core"; import React from "react";  export function DDView() { 	const dispatch = useDispatch();  	const createPerson = (name: string) => { 		const newPersonEntry: BasicDDEntry = { 			...createSkeletonDDEntry(), 			type: "person", 			orgaUnitId: "MyOrgaUnit", 			recipients: ["*"], 			status: "NEW", 			syncType: SyncType.BACKEND.getStringValue(), 			changeUser: "MyUserId", 			payload: { 				name 			} 		};  		dispatch( 			DataHubActions.storeData({ 				changeSet: [newPersonEntry] 			}) 		); 	};  	return <Button onClick={() => createPerson("John")}></Button>; } ``` |
```

## Backend

### Integration

The Data Distribution (DD) service is presently distributed as a Java library (bean archive), which can be integrated into an existing or dedicated web application that implements the DD interfaces.
Spring Boot or Jakarta EE-capable containers are supported as runtime environments.

#### Artifacts

##### Data Distribution Service

Coordinates: `com.mgmtp.a12.datadistribution:data-distribution-service`

* This must be added as dependency to your application
* Provides a Java API for all `DataDistributionServer` operations, see [DataDistributionServer](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/source/server/api/com/mgmtp/a12/datadistribution/server/DataDistributionServer.html)
* Provides a Java API for `DataDistributionClient` operations, see [DataDistributionClient](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/source/server/api/com/mgmtp/a12/datadistribution/client/DataDistributionClient.html)

The embedding application must implement DD server REST endpoints required by DD clients (using the Java API).

##### Data Distribution DTO

Coordinates: `com.mgmtp.a12.datadistribution:data-distribution-dto`

* Contains DD DTO (data transfer objects) that can be used for data de-/serialization.
* Relevant only to backend applications using the DD JMS API, those applications embedding the Data Distribution service library can utilize the Java API directly.

##### Data Distribution Server Example App

Coordinates: `com.mgmtp.a12.datadistribution:server-example-app`

* Provides a reference implementation of an web application which integrates Data Distribution service.
* Based on the "Project Template".

#### Data Distribution Server

A web application that integrates the Data Distribution service must provide a configuration of the infrastructure components required by this service.
Different configurations are required for different containers (Spring Boot, Jakarta EE).
The following description applies to Spring Boot.

First, it needs to be ensured that DD components provided in the library are detected through component scanning.
Use the `@ComponentScan` annotation or include the DD base package in the `@DataServicesApplication` if your application is based on Data Services.
Scheduling and asynchronous processing must also be enabled as shown in the following example.

SpringApplication example

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` @DataServicesApplication(scanBasePackages = { DataServicesApplication.DATASERVICES_BASE_PACKAGE, 	DataDistribution.DATA_DISTRIBUTION_BASE_PACKAGE, ProjectTemplateServerApplication.TEMPLATE_SERVER_BASE_PACKAGE }) @EnableJms public class ProjectTemplateServerApplication { 	public static final String TEMPLATE_SERVER_BASE_PACKAGE = "com.mgmtp.a12.template.server"; 	public static void main(String[] args) { 		SpringApplication.run(ProjectTemplateServerApplication.class, args); 	} } ``` |
```

##### Repository Configuration

The repository configuration activates the JPA repositories contained in the bean archive and provides settings for the `EntityManager`, `TransactionManager`, the `DataSource` and Liquibase.
You can copy the implementation provided within the example server application.
Since DD service depends on these settings, it is strongly recommended not to change it.
The example configuration sets `NoOpEncryptionServiceImpl` implementation which disables payload encryption in the database.
If encryption is required in your project, a custom implementation of [EncryptionService](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/source/server/api/com/mgmtp/a12/datadistribution/encryption/EncryptionService.html) can be set.

DataDistributionRepositoryConfiguration

```
|  |  |
| --- | --- |
| ```   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49  50  51  52  53  54  55  56  57  58  59  60  61  62  63  64  65  66  67  68  69  70  71  72  73  74  75  76  77  78  79  80  81  82  83  84  85  86  87  88  89  90  91  92  93  94  95  96  97  98  99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127 128 129 130 131 132 133 134 135 136 137 138 139 140 141 142 143 144 145 146 147 148 149 ``` | ``` @Import({ DataDistributionRepositoryConfiguration.LiquibaseConfiguration.class, 	DataDistributionRepositoryConfiguration.JpaConfiguration.class, 	DataDistributionRepositoryConfiguration.DataSourceConfiguration.class }) @EnableTransactionManagement @EnableJpaRepositories(basePackages = "com.mgmtp.a12.datadistribution", 	entityManagerFactoryRef = "ddEntityManagerFactory", 	transactionManagerRef = "ddTransactionManager") @EntityScan(basePackageClasses = DDEntity.class) @Configuration(proxyBeanMethods = false) public class DataDistributionRepositoryConfiguration {  	public static final String DD_DATASOURCE_PROPERTY_BASE = "spring.datasources.datadistribution";  	@Autowired 	private ObjectMapper objectMapper;  	@Bean 	public ObjectMapper ddObjectMapper() { 		// Do not override the original object mapper directly, in case some other libs need it OOB 		ObjectMapper customMapper = objectMapper.copy();  		if (!customMapper.getRegisteredModuleIds().contains("jackson-datatype-jsr310")) { 			customMapper.registerModule(new JavaTimeModule()); 		}  		// The DD client sends dates as timestamp (changeDateAtClient, for example) 		customMapper.configOverride(Instant.class).setFormat(JsonFormat.Value.forShape(JsonFormat.Shape.NUMBER)); 		customMapper.disable(SerializationFeature.WRITE_DATE_TIMESTAMPS_AS_NANOSECONDS); 		customMapper.disable(DeserializationFeature.READ_DATE_TIMESTAMPS_AS_NANOSECONDS); 		return customMapper; 	}  	@Bean 	public PlatformTransactionManager ddTransactionManager( 		@Qualifier("ddEntityManagerFactory") LocalContainerEntityManagerFactoryBean ddEntityManagerFactory) { 		return new JpaTransactionManager(Objects.requireNonNull(ddEntityManagerFactory.getObject())); 	}  	@Configuration(proxyBeanMethods = false) 	protected static class DataSourceConfiguration {  		@ConfigurationProperties(DD_DATASOURCE_PROPERTY_BASE) 		@Bean 		public DataSourceProperties ddDatasourceProperties() { 			return new DataSourceProperties(); 		}  		@Bean 		public DataSource ddDataSource( 			@Qualifier("ddDatasourceProperties") DataSourceProperties ddDatasourceProperties) { 			return ddDatasourceProperties.initializeDataSourceBuilder().build(); 		} 	}  	@Configuration(proxyBeanMethods = false) 	protected static class JpaConfiguration {  		@ConfigurationProperties(prefix = DD_DATASOURCE_PROPERTY_BASE + ".jpa") 		@Bean 		public JpaProperties ddJpaProperties() { 			return new JpaProperties(); 		}  		@Bean 		public JpaVendorAdapter ddJpaVendorAdapter( 			@Qualifier("ddJpaProperties") JpaProperties ddJpaProperties) { 			AbstractJpaVendorAdapter adapter = new HibernateJpaVendorAdapter(); 			adapter.setShowSql(ddJpaProperties.isShowSql()); 			if (ddJpaProperties.getDatabase() != null) { 				adapter.setDatabase(ddJpaProperties.getDatabase()); 			} 			if (ddJpaProperties.getDatabasePlatform() != null) { 				adapter.setDatabasePlatform(ddJpaProperties.getDatabasePlatform()); 			} 			adapter.setGenerateDdl(ddJpaProperties.isGenerateDdl()); 			return adapter; 		}  		@Bean 		public EntityManagerFactoryBuilder ddEntityManagerFactoryBuilder( 			@Qualifier("ddJpaVendorAdapter") JpaVendorAdapter ddJpaVendorAdapter, 			ObjectProvider<PersistenceUnitManager> persistenceUnitManager, 			ObjectProvider<EntityManagerFactoryBuilderCustomizer> customizers, 			@Qualifier("ddJpaProperties") JpaProperties ddJpaProperties) { 			EntityManagerFactoryBuilder builder = 				new EntityManagerFactoryBuilder(ddJpaVendorAdapter, 					dataSource -> ddJpaProperties.getProperties(), 					persistenceUnitManager.getIfAvailable()); 			customizers.orderedStream().forEach((customizer) -> customizer.customize(builder)); 			return builder; 		}  		@DependsOn("ddLiquibase") 		@Bean 		public LocalContainerEntityManagerFactoryBean ddEntityManagerFactory( 			@Qualifier("ddDataSource") DataSource ddDataSource, 			@Qualifier("ddJpaProperties") JpaProperties ddJpaProperties, 			@Qualifier("ddEntityManagerFactoryBuilder") EntityManagerFactoryBuilder ddEntityManagerFactoryBuilder) { 			return ddEntityManagerFactoryBuilder 				.dataSource(ddDataSource) 				.properties(ddJpaProperties.getProperties()) 				.packages("com.mgmtp.a12.datadistribution") 				.persistenceUnit("ddPersistenceUnit") 				.build(); 		} 	}  	@Configuration(proxyBeanMethods = false) 	protected static class LiquibaseConfiguration {  		@ConfigurationProperties(prefix = DD_DATASOURCE_PROPERTY_BASE + ".liquibase") 		@Bean 		public LiquibaseProperties ddLiquibaseProperties() { 			return new LiquibaseProperties(); 		}  		@Bean 		public SpringLiquibase ddLiquibase( 			@Qualifier("ddDataSource") DataSource ddDataSource, 			@Qualifier("ddLiquibaseProperties") LiquibaseProperties ddLiquibaseProperties) { 			SpringLiquibase liquibase = new SpringLiquibase(); 			liquibase.setDataSource(ddDataSource); 			liquibase.setChangeLog(ddLiquibaseProperties.getChangeLog()); 			liquibase.setContexts(Optional.ofNullable(ddLiquibaseProperties.getContexts()) 				.map(contexts -> contexts.stream().collect(Collectors.joining(","))).orElse(null)); 			liquibase.setDefaultSchema(ddLiquibaseProperties.getDefaultSchema()); 			liquibase.setDropFirst(ddLiquibaseProperties.isDropFirst()); 			liquibase.setShouldRun(ddLiquibaseProperties.isEnabled()); 			liquibase.setChangeLogParameters(ddLiquibaseProperties.getParameters()); 			liquibase.setRollbackFile(ddLiquibaseProperties.getRollbackFile()); 			return liquibase; 		} 	}  	/** 	 * Provides an {@link EncryptionService} implementation which encrypts the data payload 	 * before it is written to the database. 	 */ 	@Configuration(proxyBeanMethods = false) 	protected static class EncryptionServiceProvider {  		@Bean 		public EncryptionService getEncryptionService() { 			// the NoOpEncryptionServiceImpl disables the encryption of the payload 			// provide your own EncryptionService implementation if required 			return new NoOpEncryptionServiceImpl(); 		} 	} } ``` |
```

Additionally, this class must be plugged into the Spring Boot auto configuration by creating the file `org.springframework.boot.autoconfigure.AutoConfiguration.imports` in the `META-INF/spring` resource folder.
Put the class name of your configuration class as a new line:

`com.mgmtp.a12.template.server.datadistribution.config.DataDistributionRepositoryConfiguration`

##### Scheduler

The DD module implements processes, like garbage collection, that need to be started by the application via a scheduler.
Simply copy the `com.mgmtp.a12.datadistribution.scheduler.DataDistributionScheduler` class from the sample application into your application to activate these tasks.

Scheduler configuration

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 ``` | ``` /**  * Scheduler for Data Distribution related tasks  */ @Component public class DataDistributionScheduler {  	@Autowired 	private DataDistributionServer ddServer;  	/** 	 * Starts garbage collection every day at midnight 	 */ 	@Scheduled(cron = "0 0 0 * * *") 	@Transactional("ddTransactionManager") 	public void startGarbageCollection() {  		// define the garbage collection retention time for finished DD entries 		// for every DDEntry type different retention time can be specified 		ddServer 			.performGC(GarbageCollectionRequest 				.newBuilder() 				.withRetentionTimeForType("notification", 30) 				.withDefaultRetentionTime(60).build()); 	}  	/** 	 * Starts archiving every day at 3 am 	 */ 	@Scheduled(cron = "0 0 3 * * *") 	@Transactional("ddTransactionManager") 	public void startArchiving() { 		ddServer.performArchiving(); 	}  	/** 	 * Reminds the DD Server to take a new lowerBoundTimestamp snapshot every 10 minutes. 	 */ 	@Scheduled(fixedRate = 10, timeUnit = TimeUnit.MINUTES) 	@Transactional("ddTransactionManager") 	public void createNewLowerBoundSnapshot() { 		ddServer.takeLowerBoundTimestampSnapshot(); 	} } ``` |
```

##### Data Distribution Endpoints

The application must implement REST endpoints required by the DD client to synchronize with the server.
This approach allows the application to implement various aspects such as authorization, validation, logging, etc. in accordance with the project requirements.
The following example illustrates a possible implementation of a `RestController` that uses A12 UAA for user authorization.
The specified context paths also need to be passed to the DD client, either as constants in the client code or through a service registry if one is used.

Data Distribution REST endpoints

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 ``` | ``` /**  * Data Distribution REST API.  */ @RestController @SecuredController @RequestMapping("${mgmtp.a12.dataservices.server.context-path}/v1") public class DataDistributionController {  	// standard header for operation performance insights, supported by many browsers 	public static final String SERVER_TIMING_RESPONSE_HEADER = "Server-Timing";  	@Autowired 	private DataDistributionServerFacade ddServerFacade;  	@PostMapping 	@RequestMapping("/sync/user") 	public ResponseEntity<SyncResponseTO> syncUser(@RequestBody SyncRequestTO syncRequestTO) { 		SyncResponseTO syncResponse = ddServerFacade.synchronizeUser(syncRequestTO); 		return ResponseEntity.ok() 			.header(SERVER_TIMING_RESPONSE_HEADER, getSyncStatMetricsHeader(syncResponse)) 			.body(syncResponse); 	}  	@PostMapping 	@RequestMapping("/fill-in") 	public ResponseEntity<FillInResponseTO> fillIn(@RequestBody FillInRequestTO fillInRequestTO) { 		FillInResponseTO fillInResponseTO = ddServerFacade.fillIn(fillInRequestTO); 		return ResponseEntity.ok().body(fillInResponseTO); 	}  	// creates performance statistics for a sync request processing 	private String getSyncStatMetricsHeader(SyncResponseTO syncResponse) { 		if (syncResponse.getPerfStat() != null) { 			return String.format( 				"a;dur=%d;desc=\"BE Sync total\", " + 					"b;dur=%d;desc=\"Get data for client\", " + 					"c;dur=%d;desc=\"Write client's data\", " + 					"d;dur=%d;desc=\"Misc\"", 				syncResponse.getPerfStat().getSyncTotal(), 				syncResponse.getPerfStat().getSyncGetServerChangedEntries(), 				syncResponse.getPerfStat().getSyncWriteClientChangedEntries(), 				syncResponse.getPerfStat().getMisc());  		} else { 			return null; 		} 	}  	@ExceptionHandler(value = AbstractDataDistributionCodifiedException.class) 	@ResponseBody 	public Object handleDataDistributionException(AbstractDataDistributionCodifiedException exception) { 		HttpHeaders headers = new HttpHeaders(); 		headers.setContentType(MediaType.APPLICATION_JSON); 		return new ResponseEntity<Object>( 			DataDistributionCodifiedExceptionClientDetails.fromCodifiedException(exception, exception.getMessage()), 			headers, 			HttpStatus.INTERNAL_SERVER_ERROR); 	} } ``` |
```

##### Data Distribution Server Facade

The actual request processing takes place in a server facade.
Here, the DD Java API is used, and additional validations are implemented that can be customized to meet the project requirements.
The facade marks the transactional boundaries of the single DD operations.
The `@Transactional("ddTransactionManager")` annotation is necessary to start a Java transaction managed by the `"ddTransactionManager"` defined in the `DataDistributionRepositoryConfiguration`

|  |  |
| --- | --- |
|  | Currently, only one DD operation must be executed within a database transaction. If multiple DD operations are to be executed within a client request, these must be transactionally decoupled. |

DD Server Facade Example

```
|  |  |
| --- | --- |
| ```   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49  50  51  52  53  54  55  56  57  58  59  60  61  62  63  64  65  66  67  68  69  70  71  72  73  74  75  76  77  78  79  80  81  82  83  84  85  86  87  88  89  90  91  92  93  94  95  96  97  98  99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118 ``` | ``` /**  * This facade is responsible for executing Data Distribution operations.  * It calls {@link DataDistributionServer} methods to process the request,  * but also implements custom request validations rules.  */ @Component public class DataDistributionServerFacade { 	private static final Logger LOGGER = LoggerFactory.getLogger(DataDistributionServerFacade.class);  	@Autowired 	private DataDistributionServer ddServer;  	/** 	 * Validates the user SYNC request and performs the user device synchronization. 	 * 	 * @param syncRequestTO the incoming synchronization request 	 * @return the synchronization response for the client 	 */ 	@Transactional("ddTransactionManager") 	public SyncResponseTO synchronizeUser(SyncRequestTO syncRequestTO) {  		// Set user attributes to the request, don't trust the info set in the request 		final Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 		if (authentication.getPrincipal() instanceof UserDetails user) { 			syncRequestTO.setSyncChannel(SyncChannel.USER); 			syncRequestTO.setUserId(user.getUsername()); 			syncRequestTO.setRoles( 				user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));  			// Do sync and return data to the user client 			return performUserSync(syncRequestTO); 		} else { 			LOGGER.error("Wrong type for 'user', should be {}, but was {}.", UserDetails.class, 				Optional.ofNullable(authentication.getPrincipal()).map(Object::getClass).orElse(null)); 			throw new IllegalStateException("Could not extract current user's details."); 		} 	}  	/** 	 * The FILL-IN operation allows the clients to fetch data as part of a sync scope enhancement 	 * 	 * @param fillInRequestTO The FILL-IN request 	 * @return the FILL-IN response 	 */ 	@Transactional("ddTransactionManager") 	public FillInResponseTO fillIn(FillInRequestTO fillInRequestTO) { 		final Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 		UserDetails user = (UserDetails) authentication.getPrincipal(); 		fillInRequestTO.setUserId(user.getUsername()); 		fillInRequestTO.setRoles(user.getAuthorities() 			.stream() 			.map(GrantedAuthority::getAuthority) 			.collect(Collectors.toList())); 		return ddServer.fillIn(fillInRequestTO); 	}  	private SyncResponseTO performUserSync(SyncRequestTO syncRequestTO) {  		// Validate syncRequest, filter invalid entries and generate failedEntryInfos 		Set<FailedEntryInfo> failedEntryInfos = validateUserChangeSet(syncRequestTO.getChangeSet(), 			syncRequestTO.getOrgaUnitId(), syncRequestTO.getUserId());  		// remove invalid entries from request 		Set<String> invalidEntryIds = failedEntryInfos.stream().map(FailedEntryInfo::getId).collect(Collectors.toSet()); 		if (!invalidEntryIds.isEmpty()) { 			Set<DDEntry> validEntries = syncRequestTO.getChangeSet().stream() 				.filter(entry -> !invalidEntryIds.contains(entry.getId())).collect(Collectors.toSet()); 			syncRequestTO.setChangeSet(validEntries); 		}  		// Execute sync 		SyncResponseTO syncResponseTO = ddServer.synchronize(syncRequestTO);  		// Add custom failedEntryInfos to the sync response 		if (!failedEntryInfos.isEmpty()) { 			final Set<FailedEntryInfo> failedEntryInfosFromResponse = syncResponseTO.getFailedEntryInfos(); 			if (failedEntryInfosFromResponse != null) { 				failedEntryInfos.addAll(failedEntryInfosFromResponse); 			} 			syncResponseTO = 				new SyncResponseTO.Builder().from(syncResponseTO).failedEntryInfos(failedEntryInfos).build(); 		}  		return syncResponseTO; 	}  	/** 	 * Example of how to implement a custom validation of user changeSet. 	 * This method checks the changeSet of the user SYNC request and filters out DD entries which 	 * do not belong to the user organizational unit, thus preventing changing "foreign" data. 	 * !!! Notice that the Data Distribution Service performs no authorization of data modifications 	 * performed during the user device synchronization. Implement custom authorization rules according to 	 * your project requirements !!! 	 */  	private Set<FailedEntryInfo> validateUserChangeSet(final Set<DDEntry> changeSet, String userOrgaUnit, 		String userId) {  		Set<FailedEntryInfo> failedEntryInfos = new HashSet<>(); 		for (DDEntry entry : changeSet) { 			// accept only those incoming entries which are addressed to the organization unit of the user 			// to prevent changes on data which the current user is not allowed to change 			if (!userOrgaUnit.equals(entry.getOrgaUnitId())) {  				// DO NOT throw exceptions for invalid entries since it would result in sync transaction rollback! 				// Instead, provide an FailedEntryInfo object for every invalid entry 				failedEntryInfos.add(new FailedEntryInfo(entry.getId(), 					FailedEntryInfo.Reason.CANT_CHANGE_FOREIGN_ENTRY)); 				if (LOGGER.isWarnEnabled()) { 					LOGGER.warn("User {} wants to sync entry ({}) to the orga unit {}." 						+ " But this entry belongs to orga unit {}", userId, entry, userOrgaUnit, 						entry.getOrgaUnitId()); 				} 			} 		} 		return failedEntryInfos; 	} } ``` |
```

##### Data Distribution exceptions and client handling

There are a few common exceptions that can occur in Data Distribution, which extend `AbstractDataDistributionCodifiedException`. These are:

* `ChangeNumberInconsistencyException`
* `SyncStateInconsistencyException`
* `FaultException`

Each of these exception classes has a specific error code associated to it, `AbstractDataDistributionCodifiedException#errorCode#code`.
The frontend library offers a customized error handling for these exceptions, provided the Response returned to them contains that errorCode.

To use the frontend library’s exception handling, the Response can use the `DataDistributionCodifiedExceptionClientDetails` class, or extend it. The other attributes (timestamp, description, title) are optional, but used in logs.
For SpringBoot, an example of how to create a ResponseEntity that will trigger the DD frontend error handling is shown in `com.mgmtp.a12.template.server.datadistribution.syncserver.DataDistributionController`.

#### JMS configuration

The integrating application has the option to implement the DD JMS API, enabling other backend applications to access the DD service.
Aligned with the DD Java API, the DD JMS API adheres to the pub-sub model and includes a `DISPATCH_MESSAGE_QUEUE` JMS queue for transmitting data to the DD service, along with a `DISPATCH_EVENT_MESSAGE_TOPIC` JMS topic that conveys messages related to data updates.

|  |  |
| --- | --- |
|  | For implementing the JMS API, you will need a message broker. For simplicity, the reference implementation uses the embedded message broker integrated into Spring Boot, which is not suitable for production scenarios. We recommend using an external message broker such as Apache ActiveMQ, which must be installed and configured according to the project requirements. In a production setup, the configuration for both the queue and topic should support durable subscriptions. This enables listeners to process messages at a later time, even if they are temporarily unavailable or disconnected from the message broker. |

Implementing the JMS API requires additional configuration of the application, which is exemplified in the following illustration.
To begin, we will activate the embedded message broker and enable the pub-sub messaging domain in the `application.properties` file.
Additionally, we initialize the `DISPATCH_MESSAGE_QUEUE` and the `DISPATCH_EVENT_MESSAGE_TOPIC`.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` # Message broker configuration spring.jms.pub-sub-domain=true spring.artemis.mode=embedded spring.artemis.embedded.queues=DISPATCH_MESSAGE_QUEUE spring.artemis.embedded.topics=DISPATCH_EVENT_MESSAGE_TOPIC ``` |
```

Next, a JMS listener is needed to receive incoming data from the `DISPATCH_MESSAGE_QUEUE` and forward the decoded `DispatchMessage` to the `DataDistributionServer` for further processing.

DispatchMessageListener

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 ``` | ``` /**  * This listener receives and and processes {@link DispatchMessage}s from the dispatch queue to enable the DD JMS API.  */ @Component public class DispatchMessageListener {  	private static final Logger LOGGER = LoggerFactory.getLogger(DispatchMessageListener.class); 	private static final ObjectMapper objectMapper = ObjectMapperProvider.getObjectMapper();  	@Autowired 	private DataDistributionServer dataDistributionServer;  	@JmsListener(destination = JmsConfiguration.DISPATCH_MESSAGE_QUEUE) 	@Transactional("ddTransactionManager") 	public void receiveDispatchMessage(String message) { 		LOGGER.info("Received a new message from {}: {}", JmsConfiguration.DISPATCH_MESSAGE_QUEUE, message); 		dataDistributionServer.dispatch(toDispatchMessage(message)); 	}  	private DispatchMessage toDispatchMessage(String message) { 		try { 			return objectMapper.readValue(message, DispatchMessage.class); 		} catch (JsonProcessingException e) { 			throw new RuntimeException("Unable to deserialize DispatchMessage from incoming text message!", e); 		} 	} } ``` |
```

Finally, events generated by the `DataDistributionServer` need to be sent to the `DISPATCH_EVENT_MESSAGE_TOPIC` by a JMS publisher.
To enable message filtering based on the data type on the receiver side, we set the JMS property 'type' as metadata of the message.
If routing rules need to be implemented in the message broker, the `JMSType` message header should also be set.

DispatchEventMessagePublisher

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 ``` | ``` /**  * This publisher sends {@link DispatchEventMessage} to the DISPATCH_EVENT_MESSAGE_TOPIC which is part of the DD JMS  * API.  */ @Component public class DispatchEventMessagePublisher {  	private static final ObjectMapper objectMapper = ObjectMapperProvider.getObjectMapper();  	@Autowired 	private JmsTemplate jmsTemplate;  	@EventListener 	public void onDispatchEvent(DispatchEventMessage dispatchEventMessage) { 		jmsTemplate.convertAndSend(JmsConfiguration.DISPATCH_EVENT_MESSAGE_TOPIC, 			serialize(dispatchEventMessage), 			message -> { 				// set the 'type' property to enable filtering via JMS selectors on the subscriber side 				message.setStringProperty("type", dispatchEventMessage.getType()); 				// additionally set the JMSType header, if it's required for routing 				message.setJMSType(dispatchEventMessage.getType()); 				return message; 			}); 	}  	private String serialize(DispatchEventMessage message) { 		try { 			return objectMapper.writeValueAsString(message); 		} catch (JsonProcessingException e) { 			throw new RuntimeException("Unable to serialize DispatchEventMessage", e); 		} 	} } ``` |
```

This basic configuration is adequate to demonstrate the utilization of the DD JMS API in [JMS API](#_jms_api).

#### Configuration properties

The Data Distribution service offers configuration options that can be set using the `application.properties` of your application in Spring or by system properties in Jakarta EE.
Alternatively a custom `com.mgmtp.a12.datadistribution.config.ConfigurationProvider` can be implemented to provide settings required by the module.
Most of the Data Distribution configuration keys start with the prefix `mgmtp.a12.dd`.
See [ConfigurationProperties](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/source/server/api/com/mgmtp/a12/datadistribution/config/ConfigurationProperties.html) for all available properties.

##### Datasource configuration

The Data Distribution service requires a datasource that is configured using the following keys.
At the current time, only Oracle(19c) and PostgreSQL databases are supported.

`spring.datasources.datadistribution.liquibase.change-log` = `classpath:com/mgmtp/a12/datadistribution/liquibase/db.changelog-datadistribution.xml`

Liquibase change log configuration.

**DD depends on this property not being changed therefore it is strongly recommended not to change it.**

`spring.datasources.datadistribution.jpa.database-platform` = `org.hibernate.dialect.PostgreSQLDialect`

JPA Dialect

`spring.datasources.datadistribution.driver-class-name` = `org.postgresql.Driver`

Driver must be on the classpath.

`spring.datasources.datadistribution.jpa.database` = `POSTGRESQL`

The database system in use.

`spring.datasources.datadistribution.url` = `jdbc:postgresql://localhost:8083/datadistribution`

Connection string to the database.

`spring.datasources.datadistribution.username` = `postgres`

The username for the connection.

`spring.datasources.datadistribution.password`=`secret`

The password for the connection.

`spring.jpa.hibernate.ddlAuto` = `validate`

Validates the db schema created by Liquibase against the JPA entity model.

**should not be changed**

##### Server configuration

`mgmtp.a12.dd.server.appendix.gc_retention_time.days` = `30`

Specifies the retention period for deleted DD entry appendices before it will be physically removed by server.
Within the retention period deleted appendices are kept in the appendix array with `deleted=true` flag.

##### Archive configuration

The archiving process can be configured with the following properties.

`mgmtp.a12.dd.server.archive.mode` = `ERASE`

Specifies the archiving mode [BACKUP, ERASE].
If `BACKUP` is set, the finalized DD entries, previously marked as deleted by the GC process, will be moved (archived) into a separate archive schema.
If `ERASE` is set, the deleted DD entries will be irrevocably erased from the main database schema.

`mgmtp.a12.dd.server.archive.schema.name` = `archive`

The name of the archive database schema.

**Only required if `BACKUP` mode is set.**

`mgmtp.a12.dd.server.archive.retention_time` = `90`

The number of days that deleted entries remain in the database before they are archived.
Values < 1 will be ignored.

`mgmtp.a12.dd.server.archive.processing.limit` = `10000`

The maximum number of entries that can be archived in a process execution.

`mgmtp.a12.dd.server.archive.parallel_query` = `0`

Specifies the maximum number of parallel database queries to be used by the archiving process.
If the value is < 0, no parallel queries are used.
If the value is 0, the DB selects the optimum number.
If the value is > 0, the given number of parallel queries are used.

### Usage

This section contains examples that can be realised using the Data Distribution Server [Java API](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/source/server/api/index.html).
The source code can be found in the Server Example Application in the [Data Distribution Project](https://bitbucket.mgm-tp.com/projects/A12/repos/datadistribution).

#### Java API

##### SYNC, FILL-IN, GC, ARCHIVE

The `SYNC`, `FILL-IN`, `GC` and `ARCHIVE` are technical processes implemented in `DataDistributionServer` and `DataDistributionClient`.
The execution of those operations on the server side has already been explained in section [Data Distribution Server](#_data_distribution_server) as part of the application setup; no additional application code is required.

##### DISPATCH

In contrast to a DD client, which can bidirectionally synchronize all its data with the server via the `SYNC` operation, application backends typically do not synchronize with a DD server.
Instead a publisher/subscriber pattern is used.
The following [example](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/source/server/examples/com/mgmtp/a12/template/server/datadistribution/DispatchExampleIT.java) demonstrates, how data entries can be created and published by the application using the Java API.

Dispatch Example

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 ``` | ``` @SpringBootTest(classes = { TestApplication.class }) @ActiveProfiles(value = "test") public class DispatchExampleIT {  	private static final Logger LOGGER = LoggerFactory.getLogger(DispatchExampleIT.class);  	@Autowired 	private DataDistributionServer ddServer;  	@Test 	@Transactional("ddTransactionManager") 	public void dispatch() {  		DDEntry orderEntry = new DDEntry(); 		// set entry id to an uuid or a constant id 		orderEntry.setId(UUID.randomUUID().toString()); 		// set the type according to the entry content 		orderEntry.setType("order"); 		// address the entry to an organizational unit 		orderEntry.setOrgaUnitId("target-orga-unit-id"); 		// at least one user role or user id must be set 		// address entry to one or multiple user roles 		orderEntry.setRoleRecipients(List.of("target-user-role1", "target-user-role2")); 		// additionally, single users can be addressed by userId 		// '*' can be used as wildcard to address all users inside the target OrgaUnit 		orderEntry.setRecipients(List.of("target-user-id")); 		// set the payload of the entry 		// the payload must be converted as String, use the ObjectMapper for that 		Order orderPayload = new Order("1943-CD", 10); 		orderEntry.setPayload(serializePayload(orderPayload));  		// create a DispatchMessage and publish it to the server 		DispatchMessage message = new DispatchMessage(); 		message.addEntry(orderEntry); 		LOGGER.info("Publish order ddEntry to the server: {}", orderEntry); 		ddServer.dispatch(message); 	}  	private String serializePayload(Order orderPayload) { 		try { 			ObjectMapper objectMapper = new ObjectMapper(); 			return objectMapper.writeValueAsString(orderPayload); 		} catch (Exception e) { 			throw new FaultException("Unable to serialize Order payload", e); 		} 	}  	/** 	 * Example payload representing a JSON object 	 */ 	public record Order(String articleNumber, Integer orderAmount) { 	} } ``` |
```

##### SUBSCRIBE

An application can subscribe to `DispatchEventMessage` events to be informed about data updates that occur as a result of the SYNC or DISPATCH operation on the server.
The application can react on these events and trigger internal processing tasks.
The following implementation example shows how to subscribe and to process `DispatchEventMessage` in the application code.

Subscribe Example

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 ``` | ``` /**  * EventListener for Data Distribution events.  * DD Events are generated on every update performed on the database and provide updated entries.  * See {@link DispatchEventMessage}  */ @Component public class DataDistributionEventListener {  	private static final Logger LOGGER = LoggerFactory.getLogger(DataDistributionEventListener.class);  	// the asynchronous event processing ensures transactional decoupling from the underlying DD transaction 	// use conditional event listeners to observe events for the relevant DDEntry types only 	@Async 	@EventListener(condition = "#event?.type == 'order'") 	public void onDispatchEvent(DispatchEventMessage event) { 		// listen to Data Distribution events and react on data changes 		event.getEntries().forEach(entry -> { 			// implement your code here 			LOGGER.info("Received DDEntry: {}", entry); 		}); 	} } ``` |
```

|  |  |
| --- | --- |
|  | The processing of the `DispatchEventMessage` must be carried out within a separate transaction to prevent exceptions thrown during processing from rolling back the underlying DD transaction. |

A straightforward way to achieve this is through asynchronous event processing.
Since Spring transactions are thread-bound, the `@Async` annotation ensures that the listener code is executed outside of the underlying DD transaction.
Asynchronous processing must be enabled with the `@EnableAsync` annotation in the application configuration.

Conditional event listeners can be used for selecting relevant data, filtering messages based on the `DDEntry` type.

#### JMS API

##### PUBLISH / SUBSCRIBE

To illustrate the usage of the JMS API, let’s define a test class that sends data to the `DISPATCH_MESSAGE_QUEUE` and listens for update events from the `DISPATCH_EVENT_MESSAGE_TOPIC` created in [JMS configuration](#_jms_configuration).
This test class will utilize a custom Notification object as the payload, defined within the test case.
Below is an example of how you can create such a test class.
The source code can be found in the Server Example Application in the [Data Distribution Project](https://bitbucket.mgm-tp.com/projects/A12/repos/datadistribution).

Publish-Subscribe Example

```
|  |  |
| --- | --- |
| ```   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49  50  51  52  53  54  55  56  57  58  59  60  61  62  63  64  65  66  67  68  69  70  71  72  73  74  75  76  77  78  79  80  81  82  83  84  85  86  87  88  89  90  91  92  93  94  95  96  97  98  99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127 128 129 130 131 132 133 134 135 136 137 138 139 140 141 142 143 144 145 146 147 148 ``` | ``` /**  * This test demonstrates the usage of the DD JMS API.  */ @SpringBootTest(classes = { TestApplication.class }) @ActiveProfiles(value = "test") public class JmsApiExamplesIT {  	private static final Logger LOGGER = LoggerFactory.getLogger(JmsApiExamplesIT.class); 	private static final ObjectMapper objectMapper;  	static { 		ObjectMapper customMapper = new ObjectMapper(); 		// unknown properties must be ignored, because DD server may introduce it anytime 		customMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES); 		objectMapper = customMapper; 	}  	@Autowired 	private JmsTemplate jmsTemplate; 	// remember the last message received from the events topic 	private DispatchEventMessage dispatchEventMessage;  	// creates a DDEntry with a notification payload 	private static DDEntry createNotificationDDEntry(Notification notification) {  		try {  			return DDEntry.newBuilder() 				// set entry id to an uuid or a constant id 				.withId(notification.id()) 				// set the type according to the entry content 				.withType("notification") 				// address the entry to an organizational unit 				.withOrgaUnitId("target-orga-unit-id") 				// at least one user role or userId must be set 				.withRoleRecipients(List.of("target-user-role")) 				// '*' can be used as wildcard to address all users inside the target OrgaUnit 				.withRecipients(List.of("target-user-id")) 				// set the payload, it can be any data object 				.withPayload(notification) 				// set a hint for the clients consuming the entry, what is the version of the payload schema 				.withPayloadSchemaVersion("1.0.0") 				// indicates that the update is made by your application (and not by a real user) 				.withChangeUser("your-application-id") 				// set the date on which the entry can be deleted by the garbage collector. 				// in this example the entry expires immediately after publication 				.withExpirationDate(Instant.EPOCH) 				.build();  		} catch (InvalidEntryException e) { // will be thrown, if provided data is invalid or incomplete 			throw new RuntimeException("Created entry is invalid!", e); 		} 	}  	// use Jackson or any other tool to serialize the message 	private static String toString(DispatchMessage message) { 		try { 			return objectMapper.writeValueAsString(message); 		} catch (JsonProcessingException e) { 			throw new RuntimeException("Unable to serialize DispatchMessage", e); 		} 	}  	// use Jackson or any other tool to deserialize the message 	private static DispatchEventMessage toDispatchEventMessage(String message) { 		try { 			return objectMapper.readValue(message, DispatchEventMessage.class); 		} catch (JsonProcessingException e) { 			throw new RuntimeException("Unable to deserialize DispatchEventMessage", e); 		} 	}  	/** 	 * This test illustrates how to publish an entry to DD server. 	 * A dispatch message is sent to the dispatch queue, and a JMS listener receives the corresponding update event 	 * resulting from the DISPATCH operation. 	 */ 	@Test 	public void testJmsPublisherSubscriber() {  		// publish a DDEntry with notification as payload 		String notificationId = createAndSendNotificationDDEntry();  		// wait until the dispatch event was published to the event topic 		waitUntilMessageWasDeliveredButMaxSec(5);  		// check the content of the message 		assertEquals("notification", dispatchEventMessage.getType()); 		assertEquals(1, dispatchEventMessage.getEntries().size());  		DDEntry entry = dispatchEventMessage.getEntries().iterator().next(); 		assertEquals(notificationId, entry.getId()); 		assertEquals("your-application-id", entry.getChangeUser());  	}  	private String createAndSendNotificationDDEntry() { 		// create an entry with the data to be published 		String notificationId = UUID.randomUUID().toString(); 		DDEntry notification = 			createNotificationDDEntry(new Notification(notificationId, "Hello World!"));  		// create a DispatchMessage 		DispatchMessage message = new DispatchMessage(); 		message.addEntry(notification);  		// serialize and publish the message to the dispatch queue 		LOGGER.info("Send DispatchMessage to {}: {}", JmsConfiguration.DISPATCH_MESSAGE_QUEUE, message); 		jmsTemplate.convertAndSend(JmsConfiguration.DISPATCH_MESSAGE_QUEUE, toString(message));  		return notificationId; 	}  	/** 	 * Subscribe to the DISPATCH_EVENT_MESSAGE_TOPIC and listen to the update events generated by the DD server. 	 * We use a JMS selector for filtering the messages by data type. 	 * 	 * @param message the serialized {@link DispatchEventMessage} 	 */ 	@JmsListener(destination = JmsConfiguration.DISPATCH_EVENT_MESSAGE_TOPIC, subscription = "JmsPubSubExampleIT", 		selector = "type = 'notification'") 	public void receiveFromTopic(String message) { 		LOGGER.info("Received message from {}: {}", JmsConfiguration.DISPATCH_EVENT_MESSAGE_TOPIC, message); 		dispatchEventMessage = toDispatchEventMessage(message); 	}  	private void waitUntilMessageWasDeliveredButMaxSec(int timeout) { 		Awaitility.await() 			.pollInSameThread() 			.pollInterval(500, TimeUnit.MILLISECONDS) 			.atMost(timeout, TimeUnit.SECONDS) 			.until(this::isDispatchEventMessageDelivered); 	}  	private boolean isDispatchEventMessageDelivered() { 		return dispatchEventMessage != null; 	}  	private void resetLastEventMessageDelivered() { 		// reset the last message received 		this.dispatchEventMessage = null; 	}  	/** 	 * Example payload representing a JSON object 	 */ 	public record Notification(String id, String text) {} } ``` |
```

In this example, data transfer objects from the `dto.messaging.*` package, which are part of the `data-distribution-dto` library, are employed.
This choice is made because the application lacks direct access to the Java API offered by the `data-distribution-service`.
These DTOs are straightforward POJOs designed for the purpose of message encoding and decoding.
The main entity is the [DDEntry](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/source/server/dto/com/mgmtp/a12/datadistribution/dto/messaging/DDEntry.html) object, which can be instantiated using a builder that validates the entry for completeness and, if necessary, generates an `InvalidEntryException`.
After the data entry has been created and validated, it is encapsulated within a [DispatchMessage](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/source/server/dto/com/mgmtp/a12/datadistribution/dto/messaging/DispatchMessage.html) and sent to the `DISPATCH_MESSAGE_QUEUE` using Spring’s `JmsTemplate`.

A `DispatchMessage` is not limited to a single record; you can add as many `DDEntries` as needed.
These entries are then processed on the server side within a single `DISPATCH` operation.
To limit the scope of the operation, a chunking approach with multiple messages can be used, especially when a very large number of entries needs to be transmitted.

In the second part of this test, a `JmsListener` subscribes to the update events generated and sent by the DD server to the `DISPATCH_EVENT_MESSAGE_TOPIC`.
`DispatchEventMessage` can contain one or more `DDEntry` instances of the same data type, which were processed during a `DISPATCH` or `SYNC` operation.
The server generates `DispatchEventMessage` as a `TextMessage`, and to deserialize it, a tool of choice such as Jackson can be used.

|  |  |
| --- | --- |
|  | It is imperative to ensure the graceful handling of unknown attributes during deserialization using the DTO library. This practice helps maintain the stability of the application code, even when facing significant server changes, as new attributes may be introduced to the `DispatchEventMessage` in subsequent releases. |

For a business application, it’s generally impractical, and often a security concern, to receive and process all server event messages.
To filter the data, you can use a JMS selector that allows only messages containing a specific data type to pass through.
In the above example, the `JmsListener` is configured to receive and process only messages with the data type 'notification'.
Another approach can be implemented on the message broker side by setting up an individual topic for each application and routing only messages containing types relevant to that application to it.
To enable such routing, event messages are assigned a `JMSType` header, which is set based on the contained entry data type.

Often, an application must discern between updates initiated by clients, typically stemming from user interactions, and those originating from the backend system itself.
This distinction can be established using the `changeUser` attribute, which the application should manually configure for backend updates and which will be automatically populated by clients with the userId of the logged-in user.

##### SCRIPT UPDATE

In the previous section, we demonstrated how a DDEntry can be created or updated using the JMS API.
In this example, the complete entry is transferred from an application’s backend to the DD Server.
While this method is suitable when the application intends to completely replace the entry’s content, it may not always be the most practical choice for two primary reasons.
Firstly, the application’s backend frequently lacks real-time knowledge of the entry’s current state since clients can also perform updates, and the backend often does not maintain a log of these modifications.
This can lead to discrepancies in data accuracy.
Secondly, when dealing with large data payloads, transmitting the entire content incurs additional overhead, even if only a small portion of the payload has undergone changes.
This inefficiency can impact performance and resource utilization.

The DD JMS API offers an alternative approach to update an entry without requiring prior knowledge of its current content, known as `SCRIPT UPDATE`.
In this method, the application’s backend transmits a JavaScript update function to the DD Server, along with entry identifiers.
This function is subsequently executed on the found entries, enabling the selective modification of specific payload content.

Let’s build upon the previous pub-sub test case, where we created and sent a notification.
In this upgraded version, we will introduce a script update message that leverages JavaScript to modify the text of the notification after its initial creation.

Script Update Example

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 ``` | ``` 	/** 	 * This test illustrates how to update an existing entry via script update 	 */ 	@Test 	public void testScriptUpdate() {  		resetLastEventMessageDelivered();  		// publish a DDEntry with notification as payload 		String notificationId = createAndSendNotificationDDEntry();  		// wait until the dispatch event was published to the event topic 		waitUntilMessageWasDeliveredButMaxSec(5);  		// check the content of the received event message 		assertEquals("notification", dispatchEventMessage.getType()); 		assertEquals(1, dispatchEventMessage.getEntries().size());  		resetLastEventMessageDelivered();  		// define an update script to change the notification text 		String updateFn = "function update(ddEntry) {" + 			" var payload = JSON.parse(ddEntry.getPayload());" + 			" payload.text = \"Greetings!\";" + 			" ddEntry.setPayload(JSON.stringify(payload));" + 			" return true;" + 			"}";  		// create and send a message with an update specification 		// the notificationId is set as entry identifier 		DispatchMessage updateMessage = new DispatchMessage(); 		DispatchMessage.UpdateSpecification updateSpecification = 			new DispatchMessage.UpdateSpecification(null, List.of(notificationId), updateFn); 		updateMessage.setUpdateSpecification(updateSpecification); 		LOGGER.info("Send DispatchMessage to {}: {}", JmsConfiguration.DISPATCH_MESSAGE_QUEUE, updateMessage); 		jmsTemplate.convertAndSend(JmsConfiguration.DISPATCH_MESSAGE_QUEUE, toString(updateMessage));  		// wait until the dispatch event was published to the event topic 		waitUntilMessageWasDeliveredButMaxSec(5);  		// check the content of the event message 		assertEquals("notification", dispatchEventMessage.getType()); 		assertEquals(1, dispatchEventMessage.getEntries().size());  		// decode the payload and check the updated notification text 		DDEntry entry = dispatchEventMessage.getEntries().iterator().next(); 		HashMap payload = (LinkedHashMap) entry.getPayload(); 		Notification updatedNotification = objectMapper.convertValue(payload, Notification.class); 		assertEquals("Greetings!", updatedNotification.text()); 	} ``` |
```

The `DispatchMessage.UpdateSpecification` is initialized with three parameters: a `correlationId` (which may be null), a list of entry `ids` and the JS update function.
The ids serve as identifiers for the entries targeted for update by the script.
In situations where the backend lacks information about the IDs of all existing entries, a `correlationId` can be employed in place of individual IDs.
Similar to the `id`, the `correlationId` is an attribute of the `DDEntry` that can be employed to associate (correlate) multiple related entries with a single key, such as a well-known business case identifier.
The IDs and the correlationId are applied additively using the OR operator.

The update script is a JavaScript function that is invoked with a found `DDEntry` object and can make modifications to it.
In the given example, the payload of the entry is parsed as JSON object, and the 'text' attribute is set to the value 'Greetings!'.
Naturally, the logic can be more intricate, including the use of conditional statements to assess the state of the existing entry and execute calculations on the attributes of the DDEntry and its payload.
The function may return a boolean value indicating whether the script made modifications to the entry or not.
This allows the DD server to receive advice on whether to update the entry in its persistence.
If no boolean value is returned, the server will automatically update the entry following the successful execution of the update function.

|  |  |
| --- | --- |
|  | While the script has the capability to access all DDEntry header attributes and make modifications, it’s important to note that the server may reject the resulting entry from being updated if update rules are enforced on the server side. It’s advisable to monitor the server log for any potential error messages during the testing of your function. |

##### REDELIVERY

The REDELIVERY mechanism provides a way to request the re-delivery of previously published data from the DD Server.
The `DispatchMessage` includes a `QuerySpecification`, which, similar to the `UpdateSpecification`, includes a `correlationId` and a list of entry `id` as parameters.
The difference lies in the fact that no data update occurs on the server.
Instead, the server is called upon to generate events for the requested data, thereby providing an application with the opportunity to determine the current state of the entries.
We are extending our test to demonstrate this functionality.

Redelivery Example

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 ``` | ``` 	/** 	 * This test illustrate how to send a redelivery request for a single entry to DD server. 	 */ 	@Test 	public void testRedelivery() {  		resetLastEventMessageDelivered();  		// publish a DDEntry with notification as payload 		String notificationId = createAndSendNotificationDDEntry();  		// wait until the dispatch event was published to the event topic 		waitUntilMessageWasDeliveredButMaxSec(5);  		// check the content of the event message 		assertEquals("notification", dispatchEventMessage.getType()); 		assertEquals(1, dispatchEventMessage.getEntries().size()); 		// remember when the entry was updated on server 		Instant lastUpdatedAtServer = dispatchEventMessage.getEntries().iterator().next().getChangeDateAtServer();  		resetLastEventMessageDelivered();  		// create an redelivery request and send it within a DispatchMessage 		DispatchMessage redeliveryRequestMessage = new DispatchMessage(); 		DispatchMessage.QuerySpecification querySpecification = 			new DispatchMessage.QuerySpecification(null, List.of(notificationId), null); 		redeliveryRequestMessage.setQuerySpecification(querySpecification); 		LOGGER.info("Send DispatchMessage to {}: {}", JmsConfiguration.DISPATCH_MESSAGE_QUEUE, 			redeliveryRequestMessage); 		jmsTemplate.convertAndSend(JmsConfiguration.DISPATCH_MESSAGE_QUEUE, toString(redeliveryRequestMessage));  		// wait until the dispatch event was published to the event topic 		waitUntilMessageWasDeliveredButMaxSec(5);  		// check the content of the event message 		assertEquals("notification", dispatchEventMessage.getType()); 		assertEquals(1, dispatchEventMessage.getEntries().size()); 		// ensure that the entry wasn't updated during the redelivery operation 		assertEquals(lastUpdatedAtServer, dispatchEventMessage.getEntries().iterator().next().getChangeDateAtServer()); 	} ``` |
```

Please note that the entry was not updated during the redelivery operation, as confirmed in our test.

|  |  |
| --- | --- |
|  | As A12 Data Distribution is not a database in the traditional sense but rather a data transport mechanism, it does not provide a Query API for data retrieval. The REDELIVERY mechanism should not be understood or massively used as a Query API, especially because it does not meet the corresponding performance requirements. |

## API documentation

The full java documentation can be found [here](https://geta12.com/docs/2025.06/ext5/data_distribution/datadistribution-documentation/assets/source/server/api/index.html).

## Infrastructure Dependencies

In the table below, the infrastructure dependencies required by Data Distribution are listed with their purpose, supported versions, resource recommendations, and configuration links.

| Dependency | Purpose | Supported Versions | Configuration Reference | Minimum Resource Recommendation | Notes |
| --- | --- | --- | --- | --- | --- |
| PostgreSQL | Stores persistent data (DD entries, etc.) | 15,16,17 | Please refer to [Datasource Configuration](#datasource-configuration) | - |  |
| Oracle | Stores persistent data (DD entries, etc.) | 19c | Please refer to [Datasource Configuration](#datasource-configuration) | - |  |

|  |  |
| --- | --- |
|  | Currently, Data Distribution supports both PostgreSQL and Oracle. However, functional tests are only performed against PostgreSQL version 15. There are no defined minimum resource requirements; for production setup recommendations, please contact the Data Distribution team. |

## Migration Instructions

The following documentation contains all migration instructions and hints needed to update Data Distribution versions.

### Migration to version 2.0.0

#### Update of com.faster.xml library version

Data Distribution now requires version 2.16.2 or above.

#### Replacing java.util.Date by java.time.Instant

Existing attributes of type java.util.Date in the DTO objects and services, have been converted into java.time.Instant.
No DB migration is needed as for the moment, since the internal attributes are still using the java.util.Date type.
This might change in a future release.

##### Migration steps

###### Marshalling/Unmarshalling DDEntries

Our recommended way to transfer DD objects is to use Jackson ObjectMapper.
In order to work with the Instant type correctly, you will need to enable the module 'jackson-datatype-jsr310` with

ObjectMapper configuraton

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` objectMapper.registerModule(new JavaTimeModule()); objectMapper.setTimeZone(TimeZone.getDefault()); // adjust accordingly to your needs ``` |
```

###### DDEntry.builder

The main entrypoint for creating DDEntries, com.mgmtp.a12.datadistribution.dto.messaging.DDEntry.builder, has been updated.
The methods withChangeDateAtClient, withChangeDateAtServer, withFinishedDate and withExpirationDate, now take an Instant
as parameter, instead of Date.

### Migration to version 2.1.0

#### DDEntry appendix array cleanup

Appendix objects flagged as deleted by the client will be automatically removed from the appendix array by the server after a configurable retention period.
During this retention period, deleted appendices remain in the appendix array marked with the `deleted=true` flag.

#### Configuration changes

A new application property specifies the retention period (in days) for deleted DD entry appendices before it will be physically removed by server.
Default = 30 days.

`mgmtp.a12.dd.server.appendix.gc_retention_time.days` = `30`

### Migration to version 4.0.0

#### SyncScope ORGA\_UNIT has been removed

The `syncScope` property has been removed from the `SYNC` request. By default, the regular sync scope now includes all DD-Entries addressed to the user’s organizational unit, but only those specifically assigned to the user via userId or user roles. Previously, it was possible to bypass user identity verification by setting `syncScope=ORGA_UNIT` within the `SYNC` request, but this is no longer supported.

#### Configuration changes

Following application properties are no longer supported:

`mgmtp.a12.dd.server.sync.scope.orgaunit.enabled`
