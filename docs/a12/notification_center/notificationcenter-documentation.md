---
source: https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/index.html
category: notification_center
docid: notificationcenter-documentation
scraped: 2026-06-12
---

# Notification Center

|  |  |
| --- | --- |
|  | This documentation belongs to an A12 Enterprise Component which is not part of the Open Source offering (A12 Community Edition). Please feel free to browse the documentation and learn more about how you can use this A12 component in your project. Learn more about the benefits from an A12 Enterprise Subscription on [the Editions & Licensing page](https://geta12.com/#/editions-licensing). |

![nc title image](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/nc_title_image.png)

## Introduction

The Notification Center is an A12 component which can be integrated by various projects in order to support the user performing his workflow tasks within A12.

The purpose of the Notification Center is to manage A12 document-related tasks and events resulting in different kinds of notifications presented to the user.

The Notification Center supports 2 major types: Web Notifications and Push Notifications.

Web Notifications can be shown to the users as toast messages or browser notifications.
They are collected and managed in the Notification Center which is accessible via the header bar of the A12 application.

![nc overview image](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/nc_overview_image.png)

Figure 1. Web Notifications in the Notification Center from a birds eye view

Beside Web Notifications, users can also receive task updates via mobile Push Notifications. Leveraging the native notification system ensures notifications reach users, even when they are not actively using the app.

![push notification overview](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/push_notification_overview.png)

Figure 2. Push Notifications in the Notification Center from a birds eye view

### Technologies

The Notification Center is based solely on A12 technologies.
It consists of a client based on the [A12 Client library](https://geta12.com/docs/CLIENT/client-documentation-bundle/index.html) and [React](https://reactjs.org/), written in [TypeScript](https://www.typescriptlang.org/).

The communication layer uses [A12 Data Distribution](https://geta12.com/docs/DATA_DISTRIBUTION/datadistribution-documentation/index.html).

The **Notification Center Services** is build upon [A12 Data Services](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html).

The **Push Notification Services** is build upon [Capacitor Push Notification Plugin](https://capacitorjs.com/docs/apis/push-notifications), [pushy](https://pushy-apns.org/) and [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging).

### Breaking Change Management

#### Definition Of Version

The Notification Center defines a single version. All artifacts (Java and Javascript) that belong to the Notification Center share the same version.

We are using semantic versioning for our product releases. All public classes and their public members, that are not within internal packages, will be considered public APIs. These public APIs will remain unchanged within a major version release of the product.

#### What Is Breaking Change?

A change is deemed breaking if:

* Project compilation encounters failure.
* There is a change in application behavior.
* Code adaptation becomes necessary.
* Manual model adaptation is required.

Only happen in Major releases. Migration instructions will always be provided to facilitate easier integration.

#### What Is Non-Breaking Change?

A change is deemed non-breaking if:

* Migration is provided without necessitating any manual steps from customer projects.
* Modifications occur in the internal API. Please note that migration steps are public, they are considered valid only for the corresponding release line. Therefore, any changes in the next release line are not considered breaking.
* Deprecation events take place.

These occurrences are confined to minor and patch releases.

#### Breaking and Non-Breaking Interpretation

|  | Breaking | Non-breaking |
| --- | --- | --- |
| **Public API** | **Client libraries**  Incompatible change of API signatures that cause compile errors:  * Adding required properties to NC components * Removal/Rename of NC components properties * Removing exported definitions  **Java libraries**  * New config properties with a default value that changes behavior | **Client libraries**  * Adding new exported definitions * Changing exported definitions compatibly:  + Adding new optional properties to components |
| **Internal** | * Changes of application behaviour which may affect client projects | * Everything apart from Public API points is considered internal * All Internal APIs are considered non-breaking * Any changes in this section are always considered non-breaking * All changes preserving the behaviour are considered non-breaking |
| **Configuration** | * Add mandatory configuration * Rename configuration * Remove configuration * Change the default value * Change meaning or behavior of configuration | * Add optional configurations keys or values * Add new value to existing configuration |
| **Dependencies** | **Client libraries**  * Change of TypeScript version. * Change of React version. * Change of any peer dependency (range).  **Java libraries**  * Change of Spring major releases (include all Spring-related libraries) | **Client libraries**  * Update of 3rd devDependencies  **Java libraries**  * Update of internal dependencies with minor, patch versions |

#### How We Mark Deprecation?

A deprecated API will be:

* Removed in the major releases.
* Marked with @Deprecated (java) @deprecated (typescript) annotations.
* Commented properly with new version usage properly described.
* A documentation of Deprecated APIs will be delivered within the release notes.

## Glossary

| No | Term | Definition |
| --- | --- | --- |
| 1 | Appointment (Notification Type) | Appointment is a notification created when the Appointment Time of the Reminder document is reached |
| 2 | Appointment Time | A required field inside the base Reminder Document Model. If this time has expired, an appointment notification will be sent to the user |
| 3 | Artifact | An artifact is any product, byproduct, or deliverable part of the software. For example a docker image, a npm, or a jar package/library |
| 4 | Autoconfiguration | Spring Boot autoconfiguration attempts to automatically configure your Spring application based on the jar dependencies that you have added |
| 5 | Browser Notification | Browser Notification is the pop-up displayed on the system level when the webpage is in the background |
| 6 | Chunk | Chunk in the Notification Center is the number to configure the number of notifications sent in one request to prevent the server error |
| 8 | ComponentMap | Component Map (or NotificationCenter Component Map ) is an interface provided by the Notification Center for UI customizations |
| 9 | Custom Notification Type | Besides default notification types provided by the Notification Center, you can create your own Notification Type to fit your requirements |
| 10 | Data Distribution | A12 DataDistribution (A12 DD) is an A12 component that enables data synchronization between different nodes and clients. In the Notification Center, Data Distribution is used to create, store, and synchronize notifications between clients. |
| 11 | Data Distribution Entry | Data Distribution Entry is the main entity in the Data Distribution. Notifications are created as a Data Distribution Entries |
| 12 | EncryptionService | EncryptionService is an interface provided by Data Distribution that provides encryption and decryption methods to secure sensitive data |
| 13 | Entry (Notification Type) | Entry is one of the default types in the Notification Center |
| 14 | Garbage Collection | In the Notification Center, Garbage Collection takes care of closing finished Data Distribution entries based on their retention time |
| 15 | Helm | Helm is a package manager that simplifies the process of packaging, deploying, and managing applications on Kubernetes clusters |
| 16 | JobDataMap | JobDataMap is a part of Quartz, and can be used to hold state information for Job instances |
| 17 | Kubernetes | Kubernetes, also known as K8s, is an open-source system for automating the deployment, scaling, and management of containerized applications |
| 18 | Liquibase | Liquibase is an open-source database-independent library for tracking, managing, and applying database schema changes |
| 19 | Message (Notification Type) | Message notification can be used to inform the user about system events or messages |
| 20 | Notification Center Client | The client library which supports integrating projects to simplify the setup of the A12 Data Distribution and A12 Reminder module in the A12 Client application |
| 21 | Notification Center Core | The UI components used by the Notification Center which also be used separately as a UI library |
| 22 | Notification Center Portal (Compact View) | Compact View is the place where the user can quickly access their latest notifications. The Compact View only shows a limited number of notifications (10 by default) |
| 23 | Notification Center Portal (Detail View) | Detail View is the place where the user can view all notifications with additional filter options, and perform actions on these notifications |
| 24 | Notification Center Reminder Extension | The (java) library which is installed inside A12 Data Services to handle the logic of the reminder document |
| 25 | Notification Center Reminder Job | The (java) library used by the Notification Center Service to handle the reminder scheduling logic on the server side |
| 26 | Notification Center REST Client | The (java) client library which provides the API to interact with the Notification Center Services from other services |
| 27 | Notification Center Services | The artifact that provides the backend services for the Notification Center |
| 29 | Notification Status "Read" | Read is the status of the notification when the user reads the notification and clicks on the `Mark as Read` button to change the status |
| 30 | Notification Status "Unread" | Unread is the initial status of a new notification |
| 31 | Notification Status "Deleted" | Deleted is the status of a notification when the user clicks on the `Delete` button. The deleted notification is not removed instantaneously from the database but instead, a finished flag is set on it (soft-delete) |
| 32 | Notification | Notification is a piece of information that can be sent to the user |
| 33 | NotificationHubModule | The Notification Module is the module provided by the Notification Center to configure the sync notification action |
| 34 | Oracle | Oracle Database (commonly referred to as Oracle DBMS, Oracle Autonomous Database, or simply as Oracle) is a proprietary multi-model database management system produced and marketed by Oracle Corporation. |
| 35 | Postgres | PostgreSQL, also known as Postgres, is an open-source object-relational database management system |
| 36 | Push Notification | Push Notifications are the messages that pop up on a mobile device, sent by the backend module to the target users. These notifications are displayed similarly to browser notifications but can appear even when the application is not actively in use. |
| 37 | Quartz Job | Quartz is an open-source job scheduling library. It’s used to schedule and execute jobs e.g. creating time-based notifications in the Notification Center |
| 38 | Reminder DONE (status) | DONE is the status when the user marks the reminder as done |
| 39 | Reminder DUE (status) | DUE is the status when all notifications derived from this reminder have been created and sent to the user |
| 40 | Reminder Migration | Reminder migration is the process of migrating reminder data from the older to the newer version based on the Reminder document model |
| 41 | Reminder Time | A required field inside the base Reminder Document Model. When the time has expired, a Reminder notification will be sent to the user |
| 42 | Reminder TO\_BE\_DONE (status) | TO\_BE\_DONE is the initial status of the newly created Reminder |
| 43 | Reminder (Notification Type) | A notification is created when the Reminder Time of the Reminder document is reached |
| 44 | Simple Model Editor (SME) | Simple Model Editor (SME) is the application used to prepare all the related models (Application, Form, Overview Models, and screens) |
| 45 | Spring | Spring Framework (Spring) is an open-source software development framework that provides infrastructure support for building Java-based applications on any deployment platform |
| 46 | Stacked Notification View | Incoming notifications will be displayed on top of the user’s current application context. If there is more than one notification, the popup will automatically turn into the stacked notification view |
| 47 | Theme | A website theme, often referred to as a website template, is a ready-made design template for websites that defines the look, layout, and often also certain functions of a website |
| 48 | UAA | User Authentication Authorization (UAA) is a library for handling security aspects of your application. It can be used as a standalone library or inside the Spring Boot application |

## Basic Ideas

### Web Notifications

#### General Description

Web Notifications are pieces of information that can be sent to the user. Web Notifications are displayed on the web page.
They contain text, icons and can perform contextual actions like e.g. linking to a document,
updating the status of the notification or deleting themselves.

Web Notifications are presented to the user of the application in the form of:

* Toast messages in the application: The toasts displayed on the web page when it is in foreground.
* Browser notifications: The pop-up displayed on the system level when the webpage is in background.
* Entries in the Notification Center: The notifications displayed when opening the notification bell.

depending on the settings of the user and the Web Notification type.

#### Web Notification Types

##### Default Types

By default, the Notification Center comes with the following Web Notification types:

| Web Notification Type | Usage |
| --- | --- |
| Reminder | Based on a Reminder document, a notification of type Reminder is shown to the recipients, when the `reminderTime` is reached. |
| Appointment | Based on a Reminder document, a notification of type Appointment is shown to the recipients, when the `appointmentTime` is reached. |
| Entry | Can be used by workflows to notify the user about an incoming workflow / application. |
| Message | Can be used to inform the user about a system event or message. |

#### Web Notification Statuses

The possible Web Notification statuses:

* Read/Unread: Initially, the notification is in `Unread` status. In the Notification Center, users can change this
  status by clicking on the `Mark as Read/Unread` button (Eye icon).
* Deleted: In the Notification Center, users can delete a notification by clicking on the `Delete` button.
  The deleted notification is not removed instantaneously from database but instead a finished flag is set on it (soft-delete). It will only be completely deleted from database by a [scheduled clean-up job](#_completed_clean_up_the_notification).

### Reminders

The Notification Center provides the general user interface for creating, reading, updating and deleting reminders.

It comes with a base/general `Reminder Document Model`. It contains the two DateTime fields `reminderTime` and `appointmentTime`.

When a user creates a new Reminder document and the time that is set in one of these fields is reached, a notification is sent to the recipients set in the Reminder document.
If `appointmentTime` is set, the notification is rendered as an Appointment, otherwise, it is rendered as a Reminder.

Depending on the project’s use cases, the modelers can create special Document and Form Models, that are based on the base/general `Reminder Document Model` but have additional fields.
(See [Prepare Reminder Document Model](#_prepare_reminder_document_model)).

![reminder flow](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/reminder_flow.png)

Figure 3. Reminder workflow

### Push Notifications

#### General Description

Push Notifications are the messages that pop up on a mobile device, sent by the backend module to the target users. These notifications are displayed similarly to browser notifications but can appear even when the application is not actively in use.

![Push Notification](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/feature_push_notification.png)

## Features

### Web Notifications

#### Notification Portal Compact View

The user can quickly access their latest notifications. The compact view only shows a limited number of
notifications (by default at 10). By clicking on the `Show All` button at the footer, users can open the detail view.

![Compact View](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/features_compact_view.png)

#### Notification Portal Detail View

In this view, users can:

* Filter notifications by status and type.
* Perform the action (toggle read/unread, delete) on selected notifications with the `Bulk Operation feature`.
* Expand the list of notifications by clicking on the `Show more` button at the bottom. Initially,
  there are only 10 notifications in the table.

![Detail view](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/features_detail_view.png)

#### Popup Notifications

Incoming notifications will be displayed on top of the user’s current application context. If there is more than one notification,
the popup will automatically turn into the stacked notification view (screenshot).

![Popup notification](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/features_popup_noti.png)

#### Browser Notification

The user can be notified about new notifications even when the web application is not actively in use. For example, the user opens other browser tabs or applications.

![Browser notification](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/features_browser_notification.png)

#### Notification Center User Preferences

This feature allows users to configure Notification Center features, including:

* Toggle on/off the browser notification feature.
* Allow/Disallow the popup notification for specific notification types.

![User preferences](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/features_user_settings.png)

#### Reminder

Users can use this feature to remind themselves or a group of users to work on specific tasks.

![Reminder](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/features_reminder.png)

### Push Notifications

Notifications are displayed on the users mobile device even if the related app is currently not open or - depending on the users settings on his mobile device - are also shown if the device is locked optionally combined with audio/vibrating signal.
If the user taps on the notification, he is directly routed to the corresponding application.

![Push Notification](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/feature_push_notification.png)

## How It Works

### Web Notifications

![nc architecture overview](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/nc_architecture_overview.png)

Figure 4. Web Notifications Architectural Overview

#### Main Components

* **Notification Center Services (notificationcenter-service-distribution)**: The artifact which provides the backend services for the **Notification Center**.
* **Notification Center REST client (notificationcenter-rest-client)**: The (java) client library which provides the APIs for interacting with **Notification Center Services** from other backend services.
* **Notification Center Client (notificationcenter-client)**: The client library which support integrator to simplify the setup of **A12 Data Distribution** and
  A12 Reminder module in A12 Client application.
* **Notification Center Reminder Extension (notificationcenter-reminder-extension)**: The (java) library which is installed inside **A12 Data Services** to handle Reminder Document logics.
* **Notification Center Reminder Job (notificationcenter-reminder-job)**: The (java) library which is installed inside **Notification Center Services** to handle Reminder Job logics.
* **Notification Center Core (notificationcenter-core)**: The UI components which are used by the Notification Center and can also be used separately like a UI library.

|  |  |
| --- | --- |
|  | The artifact URLs for the above components are described in the [Artifacts](#_artifacts) section. |

Besides that, the Notification Center uses the following other components/technologies:

* **A12 Data Distribution**: We use this component internally to store notifications, user settings and handle data synchronization between client and server side.
* **Data storage**: The Notification Center stores data in two places:

  + A12 Reminder documents will be stored in the **A12 Data Services**.
  + The notifications and other data will be stored in the Notification Center database.
* **Quartz Jobs**: The open source job scheduling library that the Notification Center uses to schedule jobs to generate the notifications.
  It also schedules jobs to execute the background tasks of the **A12 Data Distribution**.

#### User Flow

##### Send Notification From Other Backend Services

As an example, we want to send a Web Notification from **A12 Data Services** (other backend service) to a user in web client (frontend) side. The flow is:

**Backend**

* Call `NotificationPublisher.publish` method from the **Notification Center REST client**
  package with the corresponding notification data.
* **Notification Center Services** reads the notification data from the request and stores the data into database using **A12 Data Distribution** APIs.

**Frontend**

* The **A12 Data Distribution Client** retrieves the latest data from the backend and stores them into the Redux store.
* The **Notification Center Core** reflects the changes in Redux store to the UI.

##### Interact With Notifications From Web Client

User are be able to toggle read/unread and delete their notifications.

**Frontend**

* User interacts with notifications via **Notification Center Core** UI components.
* The accordingly notifications in the **A12 Data Distribution** Redux store will be changed and synced automatically to
  the backend by using the `sync` request.

**Backend**

* **Notification Center Services** reads the `sync` request’s payload and stores changes into the database.

##### Schedule a Reminder

**Frontend**

* User fills the reminder form (A12 Form Engine) and clicks submit button.
* **Notification Center Client** sends CRUD requests to **A12 Data Services**.

**Backend**

* In **A12 Data Services**, **Notification Center Reminder Extension** reads the request data from frontend side and send necessary information to **Notification Center Services** to schedule [Reminder jobs](#_reminder_job_scheduler).
* In **Notification Center Services**, **Notification Center Reminder Job** reads the data from **Notification Center Reminder Extension** and schedule [Reminder jobs](#_reminder_job_scheduler) to send notifications
  at the designated reminder time/appointment time specified in the form.
* **A12 Data Services** stores `A12 Reminder document` into its database.

### Push Notifications

![push notification architecture overview](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/push_notification_architecture_overview.png)

Figure 5. Push Notification Architectural Overview

#### Main Components

* **Push Notification Service (notificationcenter-push-notification-service)**: The artifact which provides the backend services for the **Push Notification Service**.
* **Push Notification Rest Client (notificationcenter-push-notification-rest-client)**: The (java) library that provides the APIs to interact with the **Push Notification Service** from the other backend services.

|  |  |
| --- | --- |
|  | The artifact URLs for the above components are described in the [Artifacts](#_artifacts) section. |

Besides that, the Push Notification uses the following other components/technologies:

* **OpenAPI specification**: Programming language-agnostic interface description for **Push Notification Service** HTTP APIs,
  which is provided at [nc-push-notification-api.json](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/nc-push-notification-api.json) in **notificationcenter-push-notification-api-specification**.
* **Cloud push providers (Firebase Cloud Messaging / Apple Push Notification service)**: The cloud provider for sending Push Notifications
  to target mobile platforms.
* [**Capacitor Push Notification Plugin**](https://capacitorjs.com/docs/apis/push-notifications) (optional): The plugin for subscribe mobile Push Notifications.

#### User Flows

##### Register/Deregister for the Push Notifications

**Frontend**

* The mobile application prompts the user whether they want to receive Push Notifications or not.
* If the user accepts the permission prompt of the OS, the application sends a request to the **Push Notification Service** with the `accountId`, `deviceId` and the current `platform` of the device.

**Backend**

* The **Push Notification Service** receives the data from the mobile application and processes the request to either save or remove data from the database.

##### Send Push Notifications From A12 Data Services

* After configuring the [UAA Rest Client](https://geta12.com/docs/UAA/uaa-documentation-src/index.html#rest-client), the integrator can send a Push Notification to a specific user by calling
  the `notificationApiConnector.createPushNotification` method from the **Push Notification Rest Client** package.
* Based on the information saved in the database and the targeted platform, the **Push Notification Service** connects to
  the cloud push providers to send notifications to the target devices.

##### Send Push Notifications From a Non-A12 Backend Services

* For non-A12 backend services, the integrator can use the [UAA Certificate Authentication](https://geta12.com/docs/UAA/uaa-documentation-src/index.html#CertificateAuthentication) for authentication and authorization.
* After configuring the [UAA Certificate Authentication](https://geta12.com/docs/UAA/uaa-documentation-src/index.html#CertificateAuthentication) in the project, the integrator can send Push Notifications
  by using methods from **Push Notification Rest Client** as described above.

## Getting Started

### Artifacts

All backend artifacts are Spring Boot applications. As such, they are configurable via standard [Spring Boot means](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config).
As we package `application.properties` files with default settings into our artifacts, it is mandatory to use a superseding property source if you wish to overwrite these settings.
Check the provided link above for an ordered precedence list.

#### Backend

| Artifact | Artifact ID | Description |
| --- | --- | --- |
| **notificationcenter-service-distribution** | `com.mgmtp.a12.notificationcenter:notificationcenter-service-distribution` | The artifact which provides the backend services for the **Notification Center Services**. |
| **notificationcenter-rest-client** | `com.mgmtp.a12.notificationcenter:notificationcenter-rest-client` | The (java) client library which provides the APIs for interacting with **Notification Center Services** from other backend services. |
| **notificationcenter-reminder-extension** | `com.mgmtp.a12.notificationcenter:notificationcenter-reminder-extension` | The (java) library which is installed inside **A12 Data Services** to handle Reminder Document logics. |
| **notificationcenter-reminder-job** | `com.mgmtp.a12.notificationcenter:notificationcenter-reminder-job` | The (java) library which is installed inside **Notification Center Services** to handle Reminder Job logics. |
| **notificationcenter-push-notification-rest-client** | `com.mgmtp.a12.notificationcenter:notificationcenter-push-notification-rest-client` | The (java) library that provides the APIs to interact with **Push Notification Service** from the other backend services. |
| **notificationcenter-push-notification-rest-client-spring-boot-autoconfigure** | `com.mgmtp.a12.notificationcenter:notificationcenter-push-notification-rest-client-spring-boot-autoconfigure` | The (java) library that provides the APIs to interact with **Push Notification Service** from the other backend services which use Spring Boot. |
| **notificationcenter-push-notification-api-specification** | `com.mgmtp.a12.notificationcenter:notificationcenter-push-notification-api-specification` | The openapi-spec for the API of the **Push Notification Service**. |
| **notificationcenter-push-notification-service** | `com.mgmtp.a12.notificationcenter:notificationcenter-push-notification-service` | The artifact which provides the backend services for the **Push Notification Service**. |

#### Frontend

| Artifact | Artifact ID | Description |
| --- | --- | --- |
| **notificationcenter-core** | `@com.mgmtp.a12.notificationcenter/notificationcenter-core` | The UI components which are used by the Notification Center and can also be used separately like a UI library. |
| **notificationcenter-client** | `@com.mgmtp.a12.notificationcenter/notificationcenter-client` | The client library which can integrated to your A12 Client application as a module. |
| **notificationcenter-bap-example** | `@com.mgmtp.a12.notificationcenter/notificationcenter-bap-example` (only in Source Code Repository, not published) | The example of integrating Notification Center into A12 web application. |
| **notificationcenter-mobile-app-example** | `com.mgmtp.a12.notificationcenter.mobile.app` (only in Source Code Repository, not published) | The example of integrating Notification Center into mobile application. |

### Web Notifications

This guide shows how to integrate the core functionalities of Notification Center Web Notifications into an A12 based project.

For advance configurations, please go to the [Notification Center Services](#web-notification-configuration) section.

|  |  |
| --- | --- |
|  | * On the frontend, the Notification Center is especially designed to run as a module inside the A12 Client application.   It is not designed to run in any other web / single page application by itself. * On the backend, the **Notification Center Services** run in parallel on your existing application. |

#### Backend

##### A12 Data Services

`Reminder Document Model` and its related logics (HTTP API endpoints, events, validators, …​) needs to be available inside **A12 Data Services**.

###### Prepare Reminder Document Model

We provide a base `Reminder Document Model` with required fields under [A12Reminder\_DM.json](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/A12Reminder_DM.json).

This model can be used directly in your application as provided. If you need to add more fields to the reminder
document model to meet your specific requirements, you can follow these steps:

* Create your own `Reminder Document Model` by using the **Simple Model Editor (SME)**.
* Add `A12Reminder_DM.json` as an include and name it `a12Reminder`.

|  |  |
| --- | --- |
|  | * The `A12Reminder_DM.json` include must be called **a12Reminder**. * We recommend to not directly modify the base Document Model, as doing so could potentially break   the reminder feature and require more effort to migrate to new base Document Models of future major releases of the   Notification Center. |

* Create a second root group and add the needed fields to it.

As an example, in our showcase application, we create a [ShowCaseReminder-document](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/ShowCaseReminder-document.json)
model with 2 root groups `a12Reminder` and `extraProps`.

###### Load the Reminder Document Model Into A12 Data Services

After creating your own A12 Reminder, you need to load it into **A12 Data Services**.

###### Configure Notification Center Reminder Extension Package in A12 Data Services

* Install our **Notification Center Reminder Extension** package:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` implementation "com.mgmtp.a12.notificationcenter:notificationcenter-reminder-extension:<VERSION>" ``` |
```

* Import `NotificationCenterReminderExtensionConfiguration` to your `DataServiceApplication`:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` @Import({NotificationCenterReminderExtensionConfiguration.class}) @DataServicesApplication(scanBasePackages = {DataServicesApplication.DATASERVICES_BASE_PACKAGE, "com.mgmtp.a12.*"}) public class DataServiceApplication {     public static void main(String[] args) {         SpringApplication.run(DataServiceApplication.class, args);     } } ``` |
```

* Configure application properties as follows:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.notificationcenter.reminder.model-name=<YOUR_CUSTOM_A12_REMINDER_NAME> ``` |
```

* Configure UAA:

Our REST endpoints in **Notification Center Reminder Extension** are secured using UAA, so you have to assign the appropriate access rights for user roles in your
application. Please refer to the [Notification Center Reminder Extension Authorization](#reminder-extension-authorization) section for more details.

##### Configure Notification Center REST Client

If your backend service, such as **A12 Data Services**, needs to send notifications to users, you can utilize the
**Notification Center REST Client** package. This package allows a service to programmatically create and send notifications
by calling Notification Center’s REST APIs from the backend code.

* Install our rest-client package into your service:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` implementation "com.mgmtp.a12.notificationcenter:notificationcenter-rest-client:<VERSION>" ``` |
```

* Import configurations `NotificationCenterClientConfiguration` as follows:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` @Import({NotificationCenterClientConfiguration.class}) @DataServicesApplication(scanBasePackages = {DataServicesApplication.DATASERVICES_BASE_PACKAGE, "com.mgmtp.a12.*"}) public class DataServiceApplication {     public static void main(String[] args) {         SpringApplication.run(DataServiceApplication.class, args);     } } ``` |
```

* Configure [UAA Rest Client](https://geta12.com/docs/UAA/uaa-documentation-src/index.html#rest-client).
* Configure the **Notification Center Services** URL:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.notificationcenter.client.service-url=http://localhost:8080 ``` |
```

##### Notification Center Services

###### Configure Notification Center Services

* Create a Spring boot application for **Notification Center Services**.
* Install the distribution package:

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` implementation "com.mgmtp.a12.notificationcenter:notificationcenter-service-distribution:<VERSION>" implementation "org.postgresql:postgresql:42.5.6" ``` |
```

* Add the annotation `@EnableNotificationServer` into the main application:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` @SpringBootApplication @EnableNotificationServer public class NotificationCenterServiceApplication {   public static void main(String[] args) {     SpringApplication.run(NotificationcenterApplication.class, args);   } } ``` |
```

* Configure application properties as follows:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` # Notification center datasource config spring.datasources.notificationcenter.url=<JDBC_URL> spring.datasources.notificationcenter.username=<USERNAME> spring.datasources.notificationcenter.password=<USERNAME> spring.datasources.notificationcenter.driver-class-name=org.postgresql.Driver spring.datasources.notificationcenter.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect spring.quartz.properties.org.quartz.jobStore.driverDelegateClass=org.quartz.impl.jdbcjobstore.PostgreSQLDelegate ``` |
```

|  |  |
| --- | --- |
|  | The above database configurations are for Postgres database. Please change the driver and dependency to match your Database engine. |

* Configure UAA:

Our REST endpoints in **Notification Center Services** are secured using UAA, so you have to assign the appropriate access rights for user roles in your
application. Please refer to the [Notification Center Services Security](#web-notification-security) section for more details.

###### Customize A12 Data Distribution’s Database Configuration

If you would like to separate the configuration properties for **A12 Data Distribution**, please follow these steps:

* **Override beans** with your own properties' prefix (See `DDRepositoryConfiguration` for the **A12 Data Distribution** repository beans). Below is an example overriding `"spring.datasources.datadistribution"` for `ddDatasourceProperties` bean.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` @ConfigurationProperties("spring.datasources.datadistribution") @Bean public DataSourceProperties ddDatasourceProperties() {   return new DataSourceProperties(); } ``` |
```

* **Declare the properties** at the property file

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` spring.datasources.datadistribution.url=<JDBC_URL> spring.datasources.datadistribution.username=<USERNAME> spring.datasources.datadistribution.password=<PASSWORD> spring.datasources.datadistribution.liquibase.database-change-log-lock-table=NC_DATABASECHANGELOGLOCK spring.datasources.datadistribution.liquibase.database-change-log-table=NC_DATABASECHANGELOG ``` |
```

|  |  |  |  |
| --- | --- | --- | --- |
|  | The configured changelog is `notificationcenter_model.xml`, which includes **A12 Data Distribution**'s changelog and **Reminder Quartz Job**'s changelog.  To update **A12 Data Distribution**'s database changelog:  * Override the `ddLiquibaseProperties`. * Configure the liquibase changelog as follows:  ``` |  |  | | --- | --- | | ``` 1 2 ``` | ``` spring.datasources.notificationcenter.liquibase.change-log=classpath:database/nc_quartz_model.xml spring.datasources.datadistribution.liquibase.change-log=classpath:database/nc_datadistribution_model.xml ``` | ``` |

###### Configure Notification Center Reminder Job Package in Notification Center Services

* Install our **Notification Center Reminder Job** package:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` implementation "com.mgmtp.a12.notificationcenter:notificationcenter-reminder-job:<VERSION>" ``` |
```

* Import `NotificationCenterReminderJobConfiguration` to your `NotificationCenterServiceApplication`:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` @SpringBootApplication @EnableNotificationServer @Import({NotificationCenterReminderJobConfiguration.class}) public class NotificationCenterServiceApplication {   public static void main(String[] args) {     SpringApplication.run(NotificationcenterApplication.class, args);   } } ``` |
```

* Configure application properties as follows:

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` mgmtp.a12.notificationcenter.dataservices.base-url=<YOUR_DATA_SERVICES_URL> mgmtp.a12.notificationcenter.reminder.model-name=<YOUR_CUSTOM_A12_REMINDER_NAME> ``` |
```

* Configure UAA:

Our REST endpoints in **Notification Center Reminder Job** are secured using UAA, so you have to assign the appropriate access rights for user roles in your
application. Please refer to the [Notification Center Reminder Job Authorization](#reminder-job-authorization) section for more details.

#### Frontend

##### Dependencies

Add the below dependencies into your `package.json` in the A12 Client application:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` {   "@com.mgmtp.a12.notificationcenter/notificationcenter-client": "<VERSION>",   "@com.mgmtp.a12.notificationcenter/notificationcenter-core": "<VERSION>",   "@com.mgmtp.a12.datadistribution/data-distribution-client": "^4.0.0" } ``` |
```

##### App Setup

Register the custom sagas and reducers into your `appsetup`:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` {     ...NotificationCenterSagas }  {     NotificationCenterReducers } ``` |
```

Or using `withNotificationCenter` in A12 composable application setup:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` import { withNotificationCenter } from "@com.mgmtp.a12.notificationcenter/notificationcenter-core";  const {store, initialActions, Component} = createA12ApplicationSetup(   combineFeatures(     ...      withNotificationCenter,      ... )(initialConfig) ``` |
```

##### Styled Component Configurations

* Add the additional theme configurations:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` const newTheme = {      ...flatTheme,      notificationCenter: notificationCenterFlatThemeConfig(flatTheme) }  <ThemeProvider theme={newTheme} /> ``` |
```

* Add the Notification Center global styles:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` <ThemeProvider theme={newTheme}>     <GlobalStyles />     <NotificationCenterGlobalStyles />     <WidgetsRoot>         <ResizeablePage />     </WidgetsRoot> </ThemeProvider> ``` |
```

##### The Notification Bell Component

Add the `HeaderItem` into the `ApplicationFrameLayout`:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` <FrameViews.ApplicationFrameLayout     {...props}     additionalHeaderItems={[       {item: <HeaderItem overflowCount={19} />,       orientation: "rightSlots-left"     }] /> ``` |
```

##### Popup Notifications

Wrap the application by the `NotificationFrame` component as follows:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` <NotificationFrame>     <AuthenticatedPage/> </NotificationFrame> ``` |
```

##### Configure the A12 Modules

###### Sync Module

Register the `NotificationHubModule` into the A12 Modules:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` const ddModuleInstance = createNotificationHubModule(); const moduleRegistry = ModuleRegistryProvider.getInstance();  moduleRegistry.addModule(ddModuleInstance);  /**  * On login, registers all modules that current user has access to.  */ const registerModulesOnLoginMiddleware = StoreFactories.createMiddleware((api, next, action) => {   if (UaaActions.loggedIn.match(action)) {     // Register all other modules except ddModuleInstance   }   return next(action); }); ``` |
```

|  |  |  |  |
| --- | --- | --- | --- |
|  | By default, we only support UAA `Local` and `OAuth2` authentication types. For other types, you need to provide the custom middleware to initialize **A12 Data Distribution**'s user as follows:  ``` |  |  | | --- | --- | | ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 ``` | ``` createNotificationHubModule({   initializeMiddleware: (ddConfig, ddContext) =>     StoreFactories.createMiddleware((api, next, action) => {       if (UaaActions.loggedIn.match(action)) {         api.dispatch(DDInitializationActions.initialize(ddConfig));          const ddContextWithUserInfo = merge(           {             session: {               userId, // Your mapped userId               username // Your mapped username             }           },           DEFAULT_DD_CONTEXT         );          api.dispatch(DDInitializationActions.initializeUser(merge(ddContextWithUserInfo, ddContext)));       }        if (UaaActions.loggedOut.match(action)) {         api.dispatch(DDInitializationActions.deinitializeUser());       }        return next(action);     }) }) ``` | ``` |

###### A12 Reminder Module

* Prepare the related models (Application, Form, Overview Models and screens) by using SME.
* Register the reminder module to A12 Modules without customization:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` export const reminderModule = (): Module => ({     ...ReminderFactories.createModule(),   model: () => model as ApplicationModel }); ``` |
```

* Register the reminder module to A12 Modules with customization:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` export const reminderModule = (): Module => ({   ...ReminderFactories.createModule(),   model: () => model as ApplicationModel,   sagas: () => [...sagas, ...ReminderFactories.createSagas()],   middlewares: () => [...ReminderFactories.createMiddlewares(), ...middlewares],   views: () => viewProvider,   dataReducers: () => [...reminderFormDataReducer, ...ReminderFactories.createDataReducers()] }); ``` |
```

##### Configure Webpack

* Forward any requests matching the following patterns to the **Notification Center Services**:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 ``` | ``` {   [       {         context: ["/api/v2/sync"],         target: "http://localhost:8089",         secure: false,         changeOrigin: true,         logLevel: "debug"       }   ] } ``` |
```

* Resolve ES module:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` [     // ... other modules     {         test: /\.m?js$/,         resolve: {             fullySpecified: false         }     } ] ``` |
```

#### Showcase Examples

##### Sending Notification From Backend Services

###### A12 Data Services on A12 Document Update Event

* Include [ShowCaseReminder-document.](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/ShowCaseReminder-document.json)
* Pushing a notification form **A12 Data Services**: [PersonDocumentListener.java](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/PersonDocumentListener.java).

In this example, we push the notification on the Person document model events (DocumentAfterCreateEvent, DocumentAfterUpdateEvent).

###### Camunda Event

* Pushing a notification from camunda service: [SendReassignmentNotificationListener.java](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/SendReassignmentNotificationListener.java).

##### Customize the Reminder Job Data Based on Reminder’s Events

* Adding additional data to the notification before a job is created (ReminderBeforeScheduleJobEvent, [ReferenceModelDataShowcase.java](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/ReferenceModelDataShowCase.java)).
  In this example, we add the `docRef` into the `Notification data`. On the A12 Client application, we can get the `docRef` from the notification
  data and opens the corresponding Reminder form.
* Adding additional data to the notification before a job is executed (ReminderJobDataBeforeExecuteEvent, [RecipientsShowCase.java](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/RecipientsShowCase.java)).
  In this example, before sending the notification to the user, we add one more `technical` user into the recipient list.

Please have a look at [Working With Reminder Jobs](#reminder-jobs-how-to) section for list of events.

##### Custom Notification Types

You can create your own `Notification Type` based on your requirements.

###### Backend

**Spring properties**

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| mgmtp.a12.notificationcenter.notification.additional-types | - | A Spring property define list of additional types for notification | The value must be an array and each element must be separated by "," character. |

This example shows how you can create the **VALIDATION\_RESULT** and **REASSIGNMENT** as your own notification types:

* Provide the list of additional types in the backend:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.notificationcenter.notification.additional-types=VALIDATION_RESULT,REASSIGNMENT ``` |
```

* Set the corresponding notification type when publishing new notification:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` customNotification.setType("VALIDATION_RESULT"); ``` |
```

###### Frontend

* Define the basic UI configurations for these new notification types in the **A12 Client** application by using
  the interface `NotificationTypeConfig` in `notificationcenter-core/src/internal/configuration/types.ts`.

**Example:**

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 ``` | ``` ... import { NotificationCenterContainer, rebound } from "@com.mgmtp.a12.notificationcenter/notificationcenter-core"; ...  rebound(NotificationCenterContainer.identifier.NotificationTypes, {   ...DefaultNotificationTypes,     VALIDATION_RESULT: {         id: CustomNotificationType.VALIDATION_RESULT,         nameI18nKey: RESOURCE_KEYS.notificationConfig.notificationType.validationResult.name,         pluralNameI18nKey: RESOURCE_KEYS.notificationConfig.notificationType.validationResult.pluralName,         variant: "warning",         iconName: "warning_amber",         iconTheme: "outlined",         filterOptions: getDefaultFilterOptionsByType(CustomNotificationType.VALIDATION_RESULT)     },     REASSIGNMENT: {         id: CustomNotificationType.REASSIGNMENT,         nameI18nKey: RESOURCE_KEYS.notificationConfig.notificationType.reassignment.name,         pluralNameI18nKey: RESOURCE_KEYS.notificationConfig.notificationType.reassignment.pluralName,         iconName: "info"     } }); ``` |
```

* For further UI customizations (show extra data, custom renderer, etc.) on the notification UI components,
  you can do it by register your own UI components into our `ComponentMap`. All supported `Notification Center`
  components are exposed under **DefaultNotificationComponentMap**. For example:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` rebound(NotificationCenterContainer.identifier.ComponentMap, {   ...DefaultNotificationComponentMap,   NotificationToast: CustomNotificationToast,   NotificationItemCompact: CustomNotificationItemCompact,   NotificationTableContent: CustomNotificationTableContent,   NotificationActionItems: CustomNotificationActionItems }); ``` |
```

In the below example, we want to render the **German Id Number** in the Notification toast instead of the created date.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` export const CustomNotificationToast = (props: NotificationToastProps) => {   const localizer = useLocalizer();    switch (props.notification.type) {     case CustomNotificationType.VALIDATION_RESULT:       return <ValidationResultNotificationToast {...props} />;     case CustomNotificationType.REASSIGNMENT:       return (         <DefaultNotificationComponentMap.NotificationToast           {...props}           additionalInfo={<span>{getIdNumberFromExtraData(props.notification)}</span> || null}           title={localizer(RESOURCE_KEYS.notificationConfig.notificationType.reassignment.title)}         />       );     default:       return <DefaultNotificationComponentMap.NotificationToast {...props} />;   } }; ``` |
```

##### Sync Notification Configurations

###### Configure How Frequent of the Sync Request

By default, we will pull the user’s notifications every `60s`. You can configure it when creating the NotificationHub module with the following parameters.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` import {   createNotificationHubModule,   NotificationHubConfiguration } from "@com.mgmtp.a12.notificationcenter/notificationcenter-client";  const exampleDDConfig: NotificationHubConfiguration = {   ddConfig: {     parameter: {       syncInterval: 20000     }   } };  createNotificationHubModule(exampleDDConfig) ``` |
```

###### Limit the Number of Notifications to Be Synced to Backend in a Single Sync Request

In case the user marks read/unread/delete a big amount of notifications, it is possible that the user will receive the `HTTP 413` error since the request’s body is too big.
To fix the issue, instead sending all changes at once, we send them by chunks to the backend.

Depending on your web server configuration, you can adjust the chunk size by using following code (by default: **300 notifications** per chunk).

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` rebound(NotificationCenterContainer.identifier.NotificationProcessChunkLength, {     delete: 100,     update: 100 }) ``` |
```

###### Change the Browser Tab Title Based on the Number of Unread Notifications

To show the number of unread notifications in the browser tab title, you can add our custom hook `useTabTitleNotifications` into your
code:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` import { useTabTitleNotifications } from "@com.mgmtp.a12.notificationcenter/notificationcenter-core";  export const AuthenticatedPage = (): React.JSX.Element=> {   useTabTitleNotifications();    return (     <RegionUi ... />   ); }; ``` |
```

##### Send Email Notification After Notification Publication

In some cases, you may want to send an email notification to the user after a notification is published.

**Backend**

You can listen to the `NotificationAfterPublishEvent` event in the backend and trigger the email sending logic in the event listener. Please refer to [EmailNotificationShowCase.java](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/EmailNotificationShowCase.java) for full code example.

The list of all available events are described in [Notification Publish Events](#_notification_publish_events).

**Frontend**

It is possible to register a custom Email Toggle component inside UserSettings in Notification Center frontend, so that the user can decide whether to receive email notifications or not.

The approach is to override the `NotificationSettingMainContent` in `DefaultNotificationComponentMap`.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` import {   DefaultNotificationComponentMap,   NotificationCenterContainer,   rebound } from "@com.mgmtp.a12.notificationcenter/notificationcenter-core";  rebound(NotificationCenterContainer.identifier.ComponentMap, {   ...DefaultNotificationComponentMap,   NotificationSettingMainContent: CustomNotificationSettingMainContent }); ``` |
```

In the `CustomNotificationSettingMainContent` component, you can add your custom email toggle component as below:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 ``` | ``` export const CustomNotificationSettingMainContent = (props?: NotificationSettingMainContentProps) => {   const emailEnabled = props?.draftExtraData?.emailEnabled === true;    const handleChangeEmailEnabled = (value: boolean) => {     props?.changeExtraData?.({       ...(props?.draftExtraData || {}),       emailEnabled: value     });   };    return (     <>       <SystemNotificationSettings />       <Switch         label="Enable email notifications"         checked={emailEnabled}         onChange={handleChangeEmailEnabled}       />       <ToastSettings />     </>   ); }; ``` |
```

Refer to [NotificationSettingMainContent.tsx](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/NotificationSettingMainContent.tsx) for the full code example.

### Push Notifications

This guide shows how to integrate the core functionalities of Notification Center Push Notifications into an A12 based project.

For advance configurations, please go to the [Push Notification Services](#push-notification-configuration) section.

#### Backend

* Configure UAA:

Our REST endpoints in **Push Notification Services** are secured using UAA, so you have to assign the appropriate access rights for user roles in your
application. Please refer to the [Push Notification Authorization](#push-notification-authorization) section for more details.

##### Push Notification Services

* Create a new Spring Boot application for **Push Notification Services** or use your existing Spring Boot application.
* Install the service package by adding the following dependencies to your build.gradle:

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` implementation "com.mgmtp.a12.notificationcenter:notificationcenter-push-notification-service:<VERSION>" implementation "org.postgresql:postgresql:42.5.6" ``` |
```

* Add the annotation `@EnablePushNotificationServer` to the spring boot application class:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` @SpringBootApplication @EnablePushNotificationServer public class NotificationCenterServiceApplication {   public static void main(String[] args) {     SpringApplication.run(NotificationcenterApplication.class, args);   } } ``` |
```

* Prepare the required credentials for the Apple Push Notification service:

  + Go to [Account > Keys page](https://developer.apple.com/account/resources/authkeys/list), click on plus button as belows:

    ![apns create p8 key](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/apns_create_p8_key.png)
  + Enter the auth key’s name and check the APNs checkbox.

    ![apns create p8 token](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/apns_create_p8_token.png)
  + Click the **Register** button.

    ![apns create p8 register](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/apns_create_p8_register.png)
  + Download the auth key file and store the information about **TeamId** and **KeyId**. Later on,
    you will need them to configure the Push Notification service.

    ![apns create p8 download](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/apns_create_p8_download.png)
* Prepare the required credentials for Firebase Cloud Messaging.

  + Access **Firebase console** at <https://console.firebase.google.com> and create a new project.
  + Open the created project in **Firebase > Project settings**.

    ![fcm service account project settings](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/fcm_service_account_project_settings.png)
  + Go to Project settings > Service account > Firebase Admin SDK > Generate new private key.

    ![fcm service account generate private](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/resources/img/fcm_service_account_generate_private.png)
* Configure the application properties as follows:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` # Push Notification datasource configuration spring.datasources.pushnotification.url=<JDBC_URL> spring.datasources.pushnotification.username=<USERNAME> spring.datasources.pushnotification.password=<USERNAME> spring.datasources.pushnotification.driver-class-name=org.postgresql.Driver spring.datasources.pushnotification.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect  # Push Notification configuration mgmtp.a12.notificationcenter.pushnotification.apns.bundle-id=<YOUR_APP_BUNDLE_ID> mgmtp.a12.notificationcenter.pushnotification.apns.pkcs8-file-path=<THE_PATH_TO_P8_TOKEN> mgmtp.a12.notificationcenter.pushnotification.apns.team-id=<TEAM_ID> mgmtp.a12.notificationcenter.pushnotification.apns.key-id=<KEY_ID> mgmtp.a12.notificationcenter.pushnotification.fcm.service-account-credential-path=<THE_PATH_TO_SERVICE_ACCOUNT_CREDENTIAL> ``` |
```

##### Configure Push Notification REST Client

If your backend service, such as **A12 Data Services**, needs to send notifications to users, you can utilize the
**Push Notification Rest Client** package. This package allows a service to programmatically register, deregister the user devices and send Push Notifications
by calling Push Notification service’s REST APIs from the backend code.

* Install our `notificationcenter-push-notification-rest-client` package into your service by adding the following dependency to your build.gradle:

  ```
  |  |  |
  | --- | --- |
  | ``` 1 ``` | ``` implementation "com.mgmtp.a12.notificationcenter:notificationcenter-push-notification-rest-client:<VERSION>" ``` |
  ```
* Import configurations `PushNotificationClientConfiguration` as follows:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` @Import(PushNotificationClientConfiguration.class) @DataServicesApplication(scanBasePackages = {DataServicesApplication.DATASERVICES_BASE_PACKAGE, "com.mgmtp.a12.*", "com.mgmtp.a12.notificationcenter.dataservice"}) public class DataServiceApplication {     public static void main(String[] args) {         SpringApplication.run(DataServiceApplication.class, args);     } } ``` |
```

* Configure [UAA Rest Client](https://geta12.com/docs/UAA/uaa-documentation-src/index.html#rest-client).
* Configure the **Push Notification Service** URL:

  ```
  |  |  |
  | --- | --- |
  | ``` 1 ``` | ``` mgmtp.a12.notificationcenter.pushnotification.client.base-url=http://localhost:8089/api/push-notification ``` |
  ```
* Example of sending a Push Notification on the Person document model event (DocumentAfterCreateEvent):

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 ``` | ``` @Component @AllArgsConstructor public class PersonDocumentListener {     private final NotificationApiConnector notificationApiConnector;    @EventListener   public void listenCreatingPerson(DocumentAfterCreateEvent event) {     DocumentV2 document = event.getDataServicesDocument().getKernelDocument();     if (isPersonDocument(document)) {             CreatePushNotificationRequest request = new CreatePushNotificationRequest();              PushNotification pushNotification = new PushNotification();             pushNotification.setTitle("Push Notification");             pushNotification.setBody("A new user has been created");              request.setNotification(pushNotification);             request.setAccountId("example-account-id");              pushNotification(createPushNotificationRequest);     }   }    private void pushNotification(CreatePushNotificationRequest notification) {         notificationApiConnector.createPushNotification(notification);     } } ``` |
```

##### Configure Register/Deregister Devices Endpoints

In case the mobile application doesn’t have UAA user context, you can create the wrapper for our endpoints as below:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 ``` | ``` @RestController @RequestMapping("/api/push-notification/sample") @RequiredArgsConstructor public class PushNotificationController {      private final PushNotificationService pushNotificationService;      @PostMapping("/devices")     public void registerDevice(@RequestBody RegisterDeviceRequest registerDeviceRequest) {         pushNotificationService.registerDevice(registerDeviceRequest);     }      @DeleteMapping("/devices/{deviceId}")     public void deregisterDevice(@PathVariable("deviceId") String deviceId) {         pushNotificationService.deregisterDevice(deviceId);     } } ``` |
```

The endpoint paths might vary, you must ensure the payload contains sufficient data for the register/deregister process.

With the data received from the frontend side, call the requests to the **Push Notification Service**:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 ``` | ``` /**  * Sample service, just a simple service to handle request to Push Notification features from sample controller  */ @Service @RequiredArgsConstructor public class PushNotificationService {     private final DeviceApiConnector deviceApiConnector;     private final NotificationApiConnector notificationApiConnector;      /**      * Register device to receive Push Notifications from Notification Center services      * @param registerDeviceRequest Request to register device      */     public void registerDevice(RegisterDeviceRequest registerDeviceRequest) {         deviceApiConnector.registerDevice(registerDeviceRequest);     }      /**      * Deregister a device. This device will no longer receive Push Notifications from Notification Center services      * @param deviceId Device id of device to deregister      */     public void deregisterDevice(String deviceId) {         deviceApiConnector.deregisterDevice(deviceId);     } } ``` |
```

#### Frontend

|  |  |
| --- | --- |
|  | Pushing notification on the client side could be implemented by various ways. In this guide, we will use [Capacitor](https://capacitorjs.com/) as the platform of choice |

##### Dependencies

* Add the [Capacitor Push Notifications Plugin](https://capacitorjs.com/docs/apis/push-notifications) into your project and configure it accordingly:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` yarn add @capacitor/push-notifications ``` |
```

* To configure the Google Push Service on Android, place the **google-services.json** to `android/app` folder

##### Configure Webpack Dev Server for Local Development

Forward any requests matching the following patterns to the **Push Notification Service**:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` module.exports = {   devServer: {         proxy: [       {         context: ["/api/push-notification"],         target: "http://localhost:8086",         secure: false,         changeOrigin: true,         logLevel: "debug"       }     ]     } } ``` |
```

##### Set up API Requests

Depends on your project’s API Client library, you must set up the authentication method for your API client instance to request to the exposed backend endpoint in the [previous steps](#_configure_webpack_dev_server_for_local_development).

For example, using axios:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` let AxiosInstance: AxiosInstance = axios.create();  export const registerUser = async (config: PushConfig): Promise<void> => {   return AxiosInstance.post("devices", config); };  export const unregisterUser = async (deviceId: PushConfig["deviceId"]): Promise<void> => {   return AxiosInstance.delete(`devices/${deviceId}`); }; ``` |
```

You can also use [Utils Server Connector](https://geta12.com/docs/UTILS_SERVER_CONNECTOR/server-connector-documentation-src/index.html) and [UAA JavaScript Client](https://geta12.com/docs/UAA/uaa-documentation-src/index.html#javascript-client):

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` const uaaLocalClient: UaaLocalClient = UaaFactories.localClientSetup({   timeout: 10000,   serverURL: "/api" }); uaaLocalClient.initConnector(); ``` |
```

then:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` import { ConnectorLocator,RestRequestPayload,RestServerConnector } from "@com.mgmtp.a12.utils/utils-connector"; import { PushConfig } from "./push-config";  export async function fetchData(requestPayload:  RestRequestPayload): Promise<Response> {   return (ConnectorLocator.getInstance().getServerConnector() as RestServerConnector).fetchData(requestPayload); }  export const registerUser = async (config: PushConfig): Promise<void> => {   await fetchData({         relativeUrl: "devices",         method: "POST",         body: config     }); };  export const unregisterUser = async (deviceId: PushConfig["deviceId"]): Promise<void> => {   await fetchData({         relativeUrl: `devices/${deviceId}`,         method: "DELETE"     }); }; ``` |
```

##### Register the Device for the Push Notifications

In your React app, use the `@capacitor/push-notifications` to register the device:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 ``` | ``` import { PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';  useEffect(() => {   // Request permission from the user to receive push notifications   let permStatus = await PushNotifications.checkPermissions();   if (permStatus.receive === 'prompt') {     permStatus = await PushNotifications.requestPermissions();   }   if (permStatus.receive !== 'granted') {     throw new Error('User denied permissions!');   }   await PushNotifications.register();      const onRegistration = (data: Token) => {     // After starting the mobile app, we will receive a registration ID from the push notification provider     // You can store this registration ID to register/deregister the device to/from the Push Notification Service   };    const onNotification = (notificationSchema: PushNotificationSchema) => {     // Handle logic when a push notification is received   };    const onError = (data: RegistrationError) => {     // handle logic when an error occurs during registration   };    PushNotifications.addListener("registration", onRegistration);   PushNotifications.addListener("pushNotificationReceived", onNotification);   PushNotifications.addListener("registrationError", onError);    return () => {     PushNotifications.removeAllListeners()   }; }, []); ``` |
```

With the registration data from the plugin, you can now register/deregister the device to the Push Notifications:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 ``` | ``` const enablePushNotification = useCallback(() => {     if (registrationData?.value) {         registerUser({             accountId: userId,             deviceId: registrationData.value,             platform         })             .then(() => {                 setPushEnabled(true);             })             .catch(error => {                 console.error("Error when enabling Push Notifications", error);             });     } }, [enablePushNotificationMutate, userId, registrationData?.value]);  const disablePushNotification = useCallback(() => {     if (registrationData?.value) {         unregisterUser(registrationData.value)             .then(() => {                 setPushEnabled(false);             })             .catch(error => {                 console.error("Error when disabling Push Notifications", error);             });     } }, [disablePushNotificationMutate, registrationData?.value]); ``` |
```

## Build and Deployment

### Build and Publish Docker Image

This section describe how to build and publish an application’s docker image which uses A12 Notification Center components.

#### Customize Gradle Build

In `build.gradle`:

* Add [Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/docs/current/gradle-plugin/reference/htmlsingle/#introduction).

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` id 'org.springframework.boot' version '<VERSION>' ``` |
```

* Set `duplicatesStrategy` property’s value of task named **bootJar**.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` tasks.named("bootJar") {    enabled = true    duplicatesStrategy = DuplicatesStrategy.EXCLUDE } ``` |
```

* Customize the task named **bootBuildImage** (reference Spring Boot Gradle plugin).

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` tasks.named("bootBuildImage") {     builder = "<BUILER_IMAGE_NAME_TO_USE>"     runImage = "<RUN_IMAGE_TO_USE>"     imageName = "<GENERATED_IMAGE_NAME>"     docker {         builderRegistry {             username = <AUTHENTICATION_BUILDER_REGISTRY_USERNAME>             password = <AUTHENTICATION_BUILDER_REGISTRY_PASSWORD>             url = "${pullRegistry}/v1/"          }         publishRegistry {             username = project.findProperty("username")             password = project.findProperty("password")             url = "${registry}/v1/"         }     } } ``` |
```

Below is an example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` def registry = project.findProperty("dockerRegistryForPublish") def pullRegistry = project.findProperty("dockerRegistryForRead")  bootBuildImage {     builder = "${pullRegistry}/paketobuildpacks/builder-jammy-base:latest"     runImage = "${pullRegistry}/paketobuildpacks/run-jammy-base:latest"     imageName = "${fullTag}"     docker {         builderRegistry {             username = project.findProperty("username")             password = project.findProperty("password")             url = "${pullRegistry}/v1/"          }         publishRegistry {             username = project.findProperty("username")             password = project.findProperty("password")             url = "${registry}/v1/"         }     } } ``` |
```

We suggest to use tasks for multiple purposes like below:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` tasks.register("buildImage") {     dependsOn bootBuildImage }  tasks.register("pushImage") {     bootBuildImage.publish = true     dependsOn buildImage } ``` |
```

#### Execution

* To build image, run:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` gradle buildImage ``` |
```

* To publish image, run:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` gradle publishImage ``` |
```

### Deploy in Kubernetes Environment

The A12 Notification Center chart supports you
in deploying an A12 Notification Center application in the Kubernetes environment.

#### Artifact

| Artifact | Artifact ID | Description |
| --- | --- | --- |
| **a12-notificationcenter-service** | `a12-notificationcenter-service` | The artifact which provides the backend for the **Notification Center Services**. |

#### Prerequisites

* Kubernetes 1.19+
* Helm 3.5.0+

#### Usage Examples

The chart could be used as a dependency:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` dependencies:     - name: a12-notificationcenter-service       version: <VERSION>       repository: "@helm-repos" ``` |
```

or deploy directly by using helm command:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` export KUBECONFIG=/path/to/your/.kube/config helm upgrade a12-notificationcenter helm-repos/a12-notificationcenter-service \     -f values.yaml \     -n namespace ``` |
```

In both cases, you need to define the **Notification Center Services** configuration values under `a12-notificationcenter-service` scope.

The example below shows some minimum values you would need to deploy the Notification Center service:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 ``` | ``` a12-notificationcenter-service:   image:     repository: $dockerImage     version: $dockerImageVersion   models:     reminder: ShowCaseReminder-document    ingress:     default:       host: "a12-client.{{ .Release.Namespace }}.{{ .Values.global.cluster.domainName }}"     extraPaths: |     - path: /(api/v2/sync.*)       pathType: ImplementationSpecific       backend:         service:           name: a12-nc-showcase           port:             number: 8080     annotations: |-       kubernetes.io/ingress.class: nginx       nginx.ingress.kubernetes.io/rewrite-target: /\$1       nginx.ingress.kubernetes.io/proxy-body-size: 10m     management:       enabled: true    uaa:     enabled: true     restClient:       enabled: true       baseUrl: "http://a12-nc-showcase:8080/api"     database:     connectionURI: 'jdbc:postgresql://{{ .Values.global.infrastructure.name }}-postgresql.{{ .Release.Namespace }}.svc.cluster.local:5432/a12-notificationcenter-service'     driverClassName: "org.postgresql.Driver"    secret:     enabled: true     pushNotification:       enabled: true    extraEnvVars: |     - name: MGMTP_A12_UAA_AUTHENTICATION_CORS_ALLOWEDORIGINS       value: "*"     - name: MGMTP_A12_UAA_AUTHENTICATION_JWT_HEADERNAME       value: Authorization     - name: MGMTP_A12_UAA_AUTHORIZATION_CHILDAUTHORIZATIONDEFINITIONS       value: "classpath:uaa/additionalAuthorizationDefinition.json"     - name: SPRING_DATASOURCE_DRIVERCLASSNAME       value: "org.postgresql.Driver"     - name: SPRING_JPA_DATABASEPLATFORM       value: "org.hibernate.dialect.PostgreSQL9Dialect"     - name: MGMTP_A12_UAA_AUTHENTICATION_CLIENT_REST_GENERATEDTOKENEXPIRATIONHEADERNAME       value: "id_token_expiration"     - name: SPRING_APPLICATION_JSON       value: '{ "spring.quartz.properties.org.quartz.jobStore.driverDelegateClass": "org.quartz.impl.jdbcjobstore.PostgreSQLDelegate" }'     - name: MGMTP_A12_UAA_AUTHENTICATION_USER_ACCESSRIGHTSRESOURCE       value: "classpath:uaa/roles.yaml"     - name: MGMTP_A12_UAA_AUTHORIZATION_AUTHORIZATIONDEFINITION       value: "classpath:uaa/authorizationDefinition.json"     - name: MGMTP_A12_UAA_AUTHENTICATION_USER_LOCALCONFIG_USERRESOURCES       value: "classpath:users/admin.yaml,classpath:users/guest.yaml,classpath:users/test.yaml,classpath:users/technical.yaml" ``` |
```

|  |  |  |  |
| --- | --- | --- | --- |
|  | * In order to work with **A12 Data Distribution**, the **Notification Center** needs an extra path and an annotation in the `K8s ingress` configuration values:  ``` |  |  | | --- | --- | | ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` extraPaths: | - path: /(api/v2/sync.*)   pathType: ImplementationSpecific   backend:     service:       name: a12-nc-showcase       port:         number: 8080 annotations: |-   nginx.ingress.kubernetes.io/rewrite-target: /\$1 ``` | ```  The purpose is to forward all requests coming with path `/(api/v2/sync.*)` to the **Notification Center Services** component to perform the sync request. |

##### Use Fullname for K8s Objects

By default, we set the value for `fullnameOverride` in our Helm chart value file as follows:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` fullnameOverride: a12-notificationcenter-service ``` |
```

If you want to use fullname (format as Release.Name-Chart.Name) for all K8s objects, you must override
the `fullnameOverride`, `commonLabels` and `podLabels` as follows:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` fullnameOverride: "" commonLabels:   app.kubernetes.io/name: '{{ include "common.names.fullname" . }}-nc' podLabels:   app.kubernetes.io/name: '{{ include "common.names.fullname" . }}-nc' ``` |
```

##### Working with ingress in TPI Cluster

In the latest ingress controller running on the TPI Cluster, the validation enforces character restrictions for paths with the Exact or Prefix types.

To include a rewrite configuration in the ingress path, the path type must be set to `ImplementationSpecific`.

```
...
- path: /(api/v2/sync.*)
  pathType: ImplementationSpecific
...
```

##### Secret

The A12 Notification Center requires some Kubernetes Secrets objects that reference credentials in the system, such as database passwords and private keys, etc. There are two main ways to handle secrets:

* Manually create Kubernetes Secrets
  You can manually create Kubernetes Secrets and configure the A12 Notification Center Helm chart to reference the created objects using `secretRef`.
* Use the Kubernetes Secrets template from the A12 Notification Center chart:

  + **Step 1**: Enable Secrets creation for each feature
    By default, Secrets creation is disabled for all features in the chart. You must explicitly enable it for each feature if needed.
    This configures the chart to create Secret objects for the Push Notification feature.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` secret:   enabled: true   pushNotification:     enabled: true ``` |
```

* **Step 2**: Specify raw credentials in the secret values file
  For example, you can specify the Pkcs8 token for Push Notification feature as follows:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` a12-notificationcenter-service:   secret:     pushNotification:       apns:         pkcs8Base64: Sample_base64       fcm:         serviceAccountCredentialBase64: Sample_base64 ``` |
```

## Notification Center Services

### Web Notifications

#### Database Configuration

Due to the limitations in **A12 Data Distribution**, our dependency, so we are only able to support two specific database types:

* Postgres: PostgreSQLDialect.
* Oracle: OracleDialect, Oracle9iDialect, Oracle10gDialect.

##### Embedded Postgres

The Notification Center service supports an embedded Postgres instance for **local development and testing without requiring an external database server**.
This is powered by [io.zonky.test:embedded-postgres](https://github.com/zonkyio/embedded-postgres).

Activate the `notificationcenter-embedded_postgres` Spring profile, or set the property directly:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` spring.datasources.notificationcenter.embedded-postgres.enabled=true ``` |
```

All embedded Postgres configuration properties:

| Property | Default value | Description |
| --- | --- | --- |
| `spring.datasources.notificationcenter.embedded-postgres.enabled` | `false` | Enables the embedded Postgres instance. |
| `spring.datasources.notificationcenter.embedded-postgres.port` | `5434` | TCP port for the embedded instance. |
| `spring.datasources.notificationcenter.embedded-postgres.path` | `null` (system temp dir) | Path to a directory for persisting data across restarts. When `null`, data is stored in a temporary directory. |
| `spring.datasources.notificationcenter.embedded-postgres.clean-data-directory` | `false` | Deletes the data directory on startup. Set to `true` in tests for isolation.  WARNING: Never set this to `true` in production — all data will be deleted on startup. |
| `spring.datasources.notificationcenter.embedded-postgres.locale-c-type` | `en_US.UTF-8` | Locale option set during `initdb`. |
| `spring.datasources.notificationcenter.embedded-postgres.connect-config.*` | `-` | JDBC/driver connection parameters. |
| `spring.datasources.notificationcenter.embedded-postgres.postgres-config.*` | `-` | Options passed to the `pg_ctl` command. |
| `spring.datasources.notificationcenter.embedded-postgres.override-working-directory` | `null` | Override directory for extracted Postgres binaries. Useful for persisting binaries across runs. |

#### Spring Configuration

##### Database Configurations

| Property | Default value | Required | Description |
| --- | --- | --- | --- |
| `spring.datasources.notificationcenter.url` | - | true | Database connection string. |
| `spring.datasources.notificationcenter.username` | - | true | Database username. |
| `spring.datasources.notificationcenter.password` | - | true | Database password. |
| `spring.datasources.notificationcenter.driver-class-name` | - | true | The database driver classname. For example: `org.postgresql.Driver`. |
| `spring.datasources.notificationcenter.jpa.database-platform` | - | true | The database platform. For example: `org.hibernate.dialect.PostgreSQLDialect`. |
| `spring.datasources.notificationcenter.jpa.hibernate.ddl-auto` | none | false | Disable auto ddl auto generation of Spring JPA. |
| `spring.datasources.notificationcenter.jpa.open-in-view` | false | false | disable default transaction of Spring JPA. |
| `spring.datasources.notificationcenter.liquibase.change-log` | classpath:database/notificationcenter\_model.xml | false | liquibase change log file path. |
| `spring.quartz.properties.org.quartz.jobStore.driverDelegateClass` | Spring managed | true | Spring target should be auto-detected, but not working for Postgres, so there is more secure to configure DB type for Quartz manually. Should be class of type org.quartz.impl.jdbcjobstore.StdJDBCDelegate (one of org.quartz.impl.jdbcjobstore.StdJDBCDelegate, org.quartz.impl.jdbcjobstore.PostgreSQLDelegate, org.quartz.impl.jdbcjobstore.oracle.OracleDelegate). |

**Notes:**

* There are additional tuning properties depending on the connection pool implementation. By default, Spring uses `com.zaxxer.hikari.HikariDataSource`.

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` #Timeout 30 seconds. See https://github.com/brettwooldridge/HikariCP#frequently-used spring.datasources.notificationcenter.hikari.connection-timeout=30000 ``` |
```

* If you want to change the Quartz job database related configurations (Liquibase), you can set the following properties:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` spring.quartz.properties.org.quartz.jobStore.tablePrefix=nc_qrtz_ spring.datasources.notificationcenter.liquibase.parameters.table_prefix=NC_QRTZ_ spring.datasources.notificationcenter.liquibase.database-change-log-lock-table=NC_DATABASECHANGELOGLOCK spring.datasources.notificationcenter.liquibase.database-change-log-table=NC_DATABASECHANGELOG ``` |
```

##### Connection Pool Configuration

The Notification Center service uses [HikariCP](https://github.com/brettwooldridge/HikariCP) as the database connection pool implementation.
You can tune the connection pool settings based on your application’s requirements:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` # Maximum number of connections in the pool (default: 10) spring.datasources.notificationcenter.hikari.maximum-pool-size=5  # Minimum number of idle connections maintained by HikariCP (default: same as maximum-pool-size) spring.datasources.notificationcenter.hikari.minimum-idle=2  # Maximum time (in milliseconds) to wait for a connection from the pool (default: 30000) spring.datasources.notificationcenter.hikari.connection-timeout=30000  # Maximum time (in milliseconds) that a connection can sit idle in the pool (default: 600000) spring.datasources.notificationcenter.hikari.idle-timeout=600000  # Maximum lifetime (in milliseconds) of a connection in the pool (default: 1800000) spring.datasources.notificationcenter.hikari.max-lifetime=1800000 ``` |
```

|  |  |
| --- | --- |
|  | For optimal performance, consider the following guidelines:  * **maximum-pool-size**: Set based on your database’s connection limit and application load. The default value of 10 may be higher than necessary for low-traffic applications. Consider reducing it to 5 or lower if your application handles fewer concurrent requests. * **minimum-idle**: Setting this lower than `maximum-pool-size` allows the pool to shrink during periods of low activity, freeing up resources. A common practice is to set it to about 20-50% of the maximum pool size. * For more information on HikariCP configuration, refer to the [HikariCP Configuration Documentation](https://github.com/brettwooldridge/HikariCP#configuration-knobs-baby). |

##### Transaction Manager

Specify the **transactionManager**'s value for `@Transactional`.

* By default, the `@Transactional` annotation uses the **default** `ncTransactionManager`, to make it explicit:

  + For logic related to **Reminder**, specify `@Transactional("ncTransactionManager")`.
  + For logic related to **A12 Data Distribution** , specify `@Transactional("ddTransactionManager")`.

##### Notification Related Configurations

| Property | Default value | Required | Description |
| --- | --- | --- | --- |
| `mgmtp.a12.notificationcenter.notification.additional-types` | - | false | Additional notification types. The value must be an array and each element must be separated by "," character. |
| `mgmtp.a12.notificationcenter.notification.expiration.expiration-date` | - | false | The notification will be expired (deleted) in how many days. If it’s empty, the notifications will never be deleted. |
| `mgmtp.a12.notificationcenter.notification.expiration.enable-clean-up-job` | false | false | Enable/disable the cleanup job, when the job enabled, you must provide the expression for scheduler the clean up job. |
| `mgmtp.a12.notificationcenter.notification.expiration.clean-up-notification-scheduler-expression` | - | false | The Quartz expression for the execution time of the notification garbage collection job. See <http://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/crontrigger.html>. |
| `mgmtp.a12.notificationcenter.notification.expiration.garbage-collection-scheduler-expression` | - | false | The Quartz expression for the cleanup notification scheduler, which specifies the execution time for the notification cleanup cron job See <http://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/crontrigger.html>. |
| `mgmtp.a12.dd.server.archive.retention_time` ` | 30 | false | How many days should deleted-entries remain in the database before they will be archived. |
| `mgmtp.a12.dd.server.archive.processing.limit` | 10000 | false | Specifies the maximum number of entries to be archived in a single run. The value < 0 stands for no limit. |
| `mgmtp.a12.dd.server.archive.schema.name` | NO\_ARCHIVE\_SCHEMA | false | Name of the archive database schema. By default, we don’t create the archive schema. |

#### Spring Profiles

We offer the following configuration profiles for the Notification Center Service.

##### A12 Data Distribution Configuration

* Profile name:

  + notificationcenter-datadistribution
* Profile contents:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` mgmtp.a12.dd.server.archive.retention_time=30 mgmtp.a12.dd.server.archive.processing.limit=10000 mgmtp.a12.dd.server.archive.schema.name=NO_ARCHIVE_SCHEMA ``` |
```

##### Datasources Configuration

* Profile name:

  + notificationcenter-datasources
* Profile contents:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` spring.datasources.notificationcenter.jpa.open-in-view=false spring.datasources.notificationcenter.jpa.hibernate.ddl-auto=none spring.datasources.notificationcenter.liquibase.change-log=classpath:database/notificationcenter_model.xml ``` |
```

##### Embedded Postgres Configuration

* Profile name:

  + notificationcenter-embedded\_postgres
* Profile contents:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` spring.datasources.notificationcenter.embedded-postgres.enabled=true spring.datasources.notificationcenter.driver-class-name=org.postgresql.Driver spring.datasources.notificationcenter.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect ``` |
```

|  |  |
| --- | --- |
|  | Activate this profile together with `notificationcenter-datasources` for local development or tests without an external database. ===== Quartz Configuration |

* Profile name:

  + notificationcenter-quartz
* Profile contents:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` spring.quartz.job-store-type=jdbc spring.quartz.properties.org.quartz.scheduler.instanceId=AUTO spring.quartz.jdbc.initialize-schema=never spring.quartz.overwrite-existing-jobs=true ``` |
```

##### UAA Configuration

* Profile name:

  + notificationcenter-uaa
* Profile contents:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.uaa.authorization.authorization-definition=classpath:uaa/authorizationDefinition.json ``` |
```

#### Security

##### Authentication

Authentication is completely handled by UAA, refer to [their documentation](https://geta12.com/docs/uaa/uaa-documentation-src/index.html#authentication) for more information.

##### Authorization

Notification Center Services introduces a new [authorizationDefinition.json](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/authorizationDefinition.json) file for securing our APIs.
It uses `mgmtp.a12.uaa.authorization.authorizationDefinition` for integrating with UAA.

|  |  |
| --- | --- |
|  | Do not replace our `authorizationDefinition.json`, otherwise you disable our authorization completely, meaning that there is no guarantee that your code will work as expected. Instead, use `mgmtp.a12.uaa.authorization.childAuthorizationDefinitions` to introduce your own authorization rules on top of the already existing ones. |

You are free to define your own (additional) permissions and policies, and organize them as you want.
You may define permission for following scopes:

| Scope name | Description |
| --- | --- |
| Push Notification | Check that the user has access right to push a notification. |
| Endpoint | You can control endpoint security inside this scope. Each endpoint is defined by its class name/method name. Returns always true. |

**Authorization scopes used in the code:**

| Method name and arguments | Scope name | Description |
| --- | --- | --- |
| `NotificationController.create`  notification  *com.mgmtp.a12.notificationcenter.shared.notification.data.Notification* | *PreAuthorize*  `PushNotification` | Check that the user has access right to push a notification. |

#### Encryption

##### A12 Data Distribution Entry Encryption

In the Notification Center, we also provided the ability to encrypting the sensitive data in the notification or either user setting entry:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` public interface EncryptionService {     EncryptedContent encrypt(String var1);      String decrypt(EncryptedContent var1) throws UnsupportedEncryptionMethodException;     ... } ``` |
```

There is an **EncryptionService** interface which provides encrypt and decrypt methods.
Here you could implement your own way to secure the sensitive data.

The interface **EncryptionServiceProvider** is used to register the **EncryptionService**:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` public interface EncryptionServiceProvider {     EncryptionService getEncryptionService();      boolean isEncryptionEnabled(); } ``` |
```

##### JobDataMap Encryption

The notification content is also stored in **JobDataMap** - which is used to generate the notification.
In order to encrypt that data, you can use the **ReminderJobDataBeforeScheduleEvent** - the events will be published before scheduling the job:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` /**  * Event published before a reminder job data is used to schedule a job  */ @Getter @AllArgsConstructor public class ReminderJobDataBeforeScheduleEvent {     private JobDataMap jobDataMap; } ``` |
```

To decrypt the data in the JobDataMap, you can use the event **ReminderJobDataBeforeExecuteEvent** - which will be published before job execution:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` /**  * Event published before a reminder job data is used to execute  */ @Getter @AllArgsConstructor public class ReminderJobDataBeforeExecuteEvent {     private JobDataMap jobDataMap; } ``` |
```

#### Notification Lifecycle

The Notification Center provides a property to configure how long the notification is active:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.notificationcenter.notification.expiration.expiration-date ``` |
```

* If the property **is not specified**, the notifications will **never be deleted**.
* If the property is **specified**, the value will apply for all notifications published by the Notification Center.
  Each notification will have an expiration date - **count by the current time plus the number provided in days**.
  This date is set during the creation of the notification based on the configured calculation at that time.
  When the date is reached, the notification will be marked as finished and a finished date will be set.
  Finished notifications will not be visible in the client application.

In the life cycle of notification, we have introduced another configuration **retention-time-in-days** with default value is **30** days. The number represents for how long we want to keep the expired notifications.
The value can be adjusted by using the property from the **A12 Data Distribution**.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.dd.server.archive.retention_time ``` |
```

##### Publish Events

The Notification Center publishes lifecycle events around `NotificationPublisher.pushNotification(…​)`.

| Event | Trigger time | Usage |
| --- | --- | --- |
| `NotificationBeforePublishEvent` | Before the dispatch request is sent to Data Distribution | Validate or enrich integration-specific processing before publication |
| `NotificationAfterPublishEvent` | After the dispatch request is successfully sent to Data Distribution | Trigger post-publish integrations such as email notification hooks |

Example listener:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` @Configuration public class EmailNotificationShowCase {      @EventListener     public void listenNotificationAfterPublishEvent(NotificationAfterPublishEvent event) {         // Integration-specific handling     } } ``` |
```

|  |  |
| --- | --- |
|  | The `NotificationPublisher.pushNotification` is called within a transaction, and the notification is persisted when the transaction commits. Therefore, if you want to query related information from database such as User Settings in the listener, you would need to use `@TransactionalEventListener` instead of `@EventListener`.  Please have a look at the showcase example section for more details. |

##### Garbage Collection

**GarbageCollectionScheduler** triggers the garbage collection process.
You can change the trigger time by below configuration:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.notificationcenter.notification.expiration.garbage-collection-scheduler-expression ``` |
```

When the **GarbageCollectionScheduler** runs, it will:

* mark all notifications whose `expiration-date` is in the past as `finished` and set the `finished date` date to the current timestamp.
* mark all Notifications whose `finished date` is further in the past as the current date minus the `retention-time-in-days` as `deleted`.

We will remove these deleted notifications completely later by using **CleanUpNotificationScheduler**.

##### Completed Clean up the Notification

The Garbage Collection only marks notifications as Deleted. They still remain on the database. You can use the **CleanUpNotificationScheduler** to remove them completely.

In order to delete the notifications, the schema name must be set to **NO\_ARCHIVE\_SCHEMA**, it means deleted without archive the notifications into another table.
The default value of this property is `NO_ARCHIVE_SCHEMA` as follow:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.dd.server.archive.schema.name=NO_ARCHIVE_SCHEMA ``` |
```

The **CleanUpNotificationScheduler** is disabled by default.
So if you want to completed clean up the notification, you must enable the job with the property:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.notificationcenter.notification.expiration.enable-clean-up-job ``` |
```

The limit number of entries to be cleaned up in a single run can be adjusted by the property provided by **A12 Data Distribution** (The default value is **10000**). If the value ⇐0, it means cleaning up notifications without limit.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.dd.server.archive.processing.limit ``` |
```

|  |  |
| --- | --- |
|  | * If you configure the expiration-date property, you must provide the spring expression for scheduling the garbage collection and cleanup notification job, otherwise, the application will not able to be start up. * Only the notification has the expiration time, while the user setting doesn’t. |

#### Timezone

The default timezone of the **Notification Center Services** is **Europe/Berlin**, but you can override this by implement the interface [**TimezoneResolver**](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/TimezoneResolver.java).

See the default implementation [**DefaultTimezoneResolver**](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/DefaultTimezoneResolver.java).

#### Notification Reminder Job

The (java) library, which needs to be installed inside **Notification Center Services** to handle Reminder Job logics.

##### Artifact

| Artifact | Artifact ID | Description |
| --- | --- | --- |
| **notificationcenter-reminder-job** | `com.mgmtp.a12.notificationcenter:notificationcenter-reminder-job` | The (java) library, which is installed inside **Notification Center Services** to handle Reminder Job logics. |

##### Configurations

**Autoconfiguration**

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` @Import({NotificationCenterReminderJobConfiguration.class}) // Use this annotation to enable autoconfiguration public class NotificationCenterServiceApplication {   public static void main(String[] args) {     final SpringApplication application = new SpringApplication(NotificationCenterServiceApplication.class);     application.run(args).start();   } } ``` |
```

**Spring properties**

| Property | Default value | Required | Description |
| --- | --- | --- | --- |
| `mgmtp.a12.notificationcenter.reminder.model-name` | - | true | Your custom A12 Reminder Model name. |
| `mgmtp.a12.notificationcenter.dataservices.base-url` | - | true | Base **A12 Data Services** URL. |
| `mgmtp.a12.notificationcenter.reminder.job.mark-due.enabled` | false | false | Enable/disable the reminder mark DUE cron job. |
| `mgmtp.a12.notificationcenter.reminder.job.mark-due.scheduler-expression` | - | false | The Quartz expression for reminder mark due job, to define the execution time for the garbage collection job. See: <http://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/crontrigger.html>. |
| `mgmtp.a12.notificationcenter.reminder.job.mark-due.limit` | 100 | false | Specifies the maximum number of reminders to be processed in a single run. |

**Spring Profiles**

We offer the following configuration profile for the Reminder Job package.

* UAA configuration:

  + Profile name:

    - notificationcenter-reminderjob-uaa
  + Profile contents:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.uaa.authorization.child-authorization-definitions=classpath:uaa/ncReminderJobAuthorizationDefinition.json ``` |
```

##### Authorization

Notification Center Reminder Job introduces a new [ncReminderJobAuthorizationDefinition.json](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/ncReminderJobAuthorizationDefinition.json) file for securing our APIs.
It uses `mgmtp.a12.uaa.authorization.child-authorization-definitions` for integrating with UAA.

|  |  |
| --- | --- |
|  | If you have a custom configuration for the key `mgmtp.a12.uaa.authorization.child-authorization-definitions` then make sure our file `ncReminderJobAuthorizationDefinition.json` should be added as well. |

You are free to define your own (additional) permissions and policies, and organize them as you want.
You may define permission for following scopes:

| Scope name | Description |
| --- | --- |
| Schedule Reminder Job | Check that the user has access right to schedule a reminder job. |
| Reschedule Reminder Job | Check that the user has access right to reschedule a reminder job. |
| Delete Reminder Job | Check that the user has access right to delete a reminder job. |

**Authorization scopes used in the code:**

| Method name and arguments | Scope name | Description |
| --- | --- | --- |
| `ReminderJobService.scheduleJob`  document  *com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2* | *PreAuthorize*  `ScheduleReminderJob` | Check that the user has access right to schedule a reminder job. |
| `ReminderJobService.rescheduleJob`  document  *com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2* | *PreAuthorize*  `RescheduleReminderJob` | Check that the user has access right to reschedule a reminder job. |
| `ReminderJobService.deleteJob`  documentId  *java.lang.String* | *PreAuthorize*  `DeleteReminderJob` | Check that the user has access right to delete a reminder job. |

##### Working With Reminder Jobs

###### Events

List of events supported by **Notification Center Reminder Job**:

| No | Event function name | Policy Description |
| --- | --- | --- |
| 1 | **ReminderBeforeScheduleJobEvent** | The event is published before the computation of a new cron job to trigger notification. |
| 2 | **ReminderJobDataBeforeScheduleEvent** | The event is published before scheduling a cron job. |
| 3 | **ReminderJobDataBeforeExecuteEvent** | The event is published before executing a cron job. |

|  |  |
| --- | --- |
|  | The DocumentV2 is **immutable**. Therefore, if you want to modify the document included in the event, you must use the setter method provided in the event to make changes. |

###### Examples

How to set fields of the reminder document before a cron job is created from the reminder document:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` @EventListener public void listenReminderBeforeScheduleJobEvent(ReminderBeforeScheduleJobEvent reminderBeforeScheduleJobEvent) {     DocumentV2 document = reminderBeforeScheduleJobEvent.getReminderDocumentBeforeScheduleJob();     // Modify some field of reminder document before it is mapped to notification     // Call setter methods to modify the included document in the event     reminderBeforeScheduleJobEvent.setReminderDocumentBeforeScheduleJob(document); } ``` |
```

###### Reminder Job Scheduler

We use the Quartz as the scheduler to schedule the reminder jobs which will then push the corresponding notification to the client when the time comes.
The default configurations `service/src/main/resources/autoconfig/core.properties` for quartz are defined as below:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` spring.quartz.job-store-type=jdbc spring.quartz.properties.org.quartz.scheduler.instanceId=AUTO spring.quartz.jdbc.initialize-schema=never spring.quartz.overwrite-existing-jobs=true ``` |
```

We save the jobs to the database to avoid losing them due to server failure.
Because Quartz doesn’t recognize the DB type correctly for PostgresDB, you must define the DB type as described in the configurations section.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` spring.quartz.properties.org.quartz.jobStore.driverDelegateClass ``` |
```

For testing purpose, you can save jobs to memory by configuring `spring.quartz.job-store-type=memory`.

###### Reminder Mark DUE Cron Job

To keep the expired reminders having the correct status, we already have a job to move the status to `DUE` immediately after the notification was published but the job is not robust.

If a problem happens when the Notification Center marks an entry as `DUE`, then this entry will be the status `TO_BE_DONE` forever or until a user marks it as `DONE`. The scheduler will not recheck the reminder if an error happens.

Therefore, to make sure all expired reminders have the correct status. We introduced a new cron job which could be executed in a period.

The job is not enabled by default, you can enable it by the following property:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.notificationcenter.reminder.job.mark-due.enabled ``` |
```

The trigger time can be configured by the property. The value must be a Quartz scheduler expression.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.notificationcenter.reminder.job.mark-due.scheduler-expression ``` |
```

The limited number of reminders performed at 1 execution time could be specified by the below property. The default value is 100 reminders.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.notificationcenter.reminder.job.mark-due.limit ``` |
```

##### Reminder Job HTTP API

**List of Contents**

* [Schedule Reminder Job](#_schedule_reminder_job)
* [Reschedule Reminder Job](#_reschedule_reminder_job)
* [Delete Reminder Job](#_delete_reminder_job)

###### Schedule Reminder Job

|  |  |
| --- | --- |
| **Name** | Schedule a reminder job. |
| **Description** | Endpoint allows scheduling reminder job. |
| **Method** | POST |
| **URL** | /api/reminder-jobs/schedule |
| **Headers** | **Content-type**  application/json |
| **Parameters** | **documentJson**  Reminder document with JSON format, which is used to schedule a reminder job. |
| **Authorization Scopes** | Schedule Reminder Job |
| **Success response** | **200 OK**  A reminder job has been scheduled. |

###### Reschedule Reminder Job

|  |  |
| --- | --- |
| **Name** | Reschedule a reminder job. |
| **Description** | Endpoint allows rescheduling a reminder job. |
| **Method** | POST |
| **URL** | /api/reminder-jobs/reschedule |
| **Headers** | **Content-type**  application/json |
| **Parameters** | **documentJson**  Reminder document with JSON format, which is used to reschedule a reminder job. |
| **Authorization Scopes** | Reschedule Reminder Job |
| **Success response** | **200 OK**  A reminder job has been rescheduled. |

###### Delete Reminder Job

|  |  |
| --- | --- |
| **Name** | Delete a reminder job. |
| **Description** | Endpoint allows deleting a reminder job by id of a document, which was used to schedule a reminder job. |
| **Method** | DELETE |
| **URL** | /api/reminder-jobs/{documentId} |
| **Headers** | **Content-type**  application/json |
| **Parameters** | **documentId**  Document id, which was used to schedule a reminder job. |
| **Authorization Scopes** | Delete Reminder Job |
| **Success response** | **200 OK**  A reminder job with the provided reminder document id has been deleted. |

#### Notification REST Client

The (java) client library which provides the APIs for interacting with **Notification Center Services** from other backend services.

##### Artifact

| Artifact | Artifact ID | Description |
| --- | --- | --- |
| **notificationcenter-rest-client** | `com.mgmtp.a12.notificationcenter:notificationcenter-rest-client` | The (java) client library which provides the APIs for interacting with **Notification Center Services** from other backend services. |

##### Configurations

**Autoconfiguration**

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` @Import(NotificationCenterClientConfiguration.class) // Use this annotation to enable autoconfiguration class ProjectTemplateServerApplication {   public static void main(String[] args) {     SpringApplication.run(ProjectTemplateServerApplication.class, args);   } } ``` |
```

**Spring properties**

| Property | Default value | Required | Description |
| --- | --- | --- | --- |
| `mgmtp.a12.notificationcenter.client.service-url` | - | true | Base **Notification Center Service** URL |

|  |  |
| --- | --- |
|  | Since the **Notification Center Services** uses UAA for authentication, all properties of the [UAA Rest Client](https://geta12.com/docs/UAA/uaa-documentation-src/index.html#rest-client) must be configured. |

#### Web Notifications HTTP API

Web Notifications in **Notification Center Services** is reachable via the following endpoints:

##### Notification API

**List of Contents**

* [Create Notification](#_create_notification)

###### Create Notification

|  |  |
| --- | --- |
| **Name** | Create Notification. |
| **Description** | Endpoint allows creating a notification. |
| **Method** | POST |
| **URL** | /api/notifications |
| **Headers** | **Content-type**  application/json |
| **Parameters** | A JSON structure represents for the notification `com.mgmtp.a12.notificationcenter.shared.notification.data.Notification`. |
| **Authorization Scopes** | Push Notification |
| **Success response** | **200 OK**  A notification has been created. |

##### Sync Notification API

**List of Contents**

* [Sync Notification](#_sync_notification)

###### Sync Notification

|  |  |
| --- | --- |
| **Name** | Sync Notification. |
| **Description** | Long polling **A12 Data Distribution** entries endpoints. This endpoint can be used in both case:  - Update changed entries from frontend to database.  - Retrieve new entries created in backend. |
| **Method** | POST |
| **URL** | /api/v2/sync |
| **Headers** | **Content-type**  application/json |
| **Parameters** | An object that presents the request to sync entries `com.mgmtp.a12.datadistribution.dto.sync.SyncRequestTO` |
| **Success response** | **200 OK**  A object that holds all data that gets sent to client of sync request `com.mgmtp.a12.datadistribution.dto.sync.SyncResponseTO` |

#### Spring Actuator

Spring Actuator contains many endpoints which expose information about the running application like health metrics, configuration information, etc…​

By default, all actuator endpoints (`/actuator/*`) are secured. If needed, you have the possibility to explicitly open certain endpoints for public usage.

##### Configuration of Actuator Endpoint

The configuration actuator provides information about the currently applied configuration on the running Notification Center Services server.
The actuator is accessible via GET request to the `/actuator/configuration` resource.

This actuator gives information on configuration changes and on warnings concerning the configuration of the Notification Center Services server.

To enable this endpoint, provide the properties below:

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` management.endpoints.web.exposure.include="configuration" management.endpoint.configuration.access=read_only ``` |
```

Example response from 'GET /actuator/configuration'

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 ``` | ``` {   "changes": {     "mgmtp.a12.notificationcenter.notification.expiration.garbageCollectionSchedulerExpression": {       "default": "null",       "current": "0 0 * * * ?"     },     "mgmtp.a12.notificationcenter.notification.additionalTypes": {       "default": "null",       "current": "VALIDATION_RESULT,REASSIGNMENT,FORWARD_FOR_SIGNATURE"     },     "mgmtp.a12.notificationcenter.notification.expiration.cleanUpNotificationSchedulerExpression": {       "default": "null",       "current": "0 0 * * * ?"     },     "mgmtp.a12.notificationcenter.reminder.job.mark-due.enabled": {       "default": "false",       "current": "true"     },     "mgmtp.a12.notificationcenter.reminder.job.mark-due.schedulerExpression": {       "default": "null",       "current": "0 0 0 * * ?"     },     "mgmtp.a12.notificationcenter.reminder.job.mark-due.limit": {       "default": "100",       "current": "50"     },     "mgmtp.a12.notificationcenter.notification.expiration.enableCleanUpJob": {       "default": "false",       "current": "true"     },     "mgmtp.a12.notificationcenter.reminder.modelName": {       "default": "null",       "current": "ShowCaseReminder-document"     },     "mgmtp.a12.notificationcenter.dataservices.baseUrl": {       "default": "null",       "current": "http://localhost:9090/api"     },     "mgmtp.a12.notificationcenter.notification.expiration.expirationDate": {       "default": "null",       "current": "1"     }   } } ``` |
```

### Push Notifications

#### Supported Databases

Supported type of database: All relational database types are supported.

##### Embedded Postgres

The Push Notification service supports an embedded Postgres instance for **local development and testing without requiring an external database server**.
This is powered by [io.zonky.test:embedded-postgres](https://github.com/zonkyio/embedded-postgres).

Activate the `notificationcenter-pushnotification-embedded_postgres` Spring profile, or set the property directly:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` spring.datasources.pushnotification.embedded-postgres.enabled=true ``` |
```

All embedded Postgres configuration properties:

| Property | Default value | Description |
| --- | --- | --- |
| `spring.datasources.pushnotification.embedded-postgres.enabled` | `false` | Enables the embedded Postgres instance. |
| `spring.datasources.pushnotification.embedded-postgres.port` | `5435` | TCP port for the embedded instance. |
| `spring.datasources.pushnotification.embedded-postgres.path` | `null` (system temp dir) | Path to a directory for persisting data across restarts. When `null`, data is stored in a temporary directory. |
| `spring.datasources.pushnotification.embedded-postgres.clean-data-directory` | `false` | Deletes the data directory on startup. Set to `true` in tests for isolation.  WARNING: Never set this to `true` in production — all data will be deleted on startup. |
| `spring.datasources.pushnotification.embedded-postgres.locale-c-type` | `en_US.UTF-8` | Locale option set during `initdb`. |
| `spring.datasources.pushnotification.embedded-postgres.connect-config.*` | `-` | JDBC/driver connection parameters. |
| `spring.datasources.pushnotification.embedded-postgres.postgres-config.*` | `-` | Options passed to the `pg_ctl` command. |
| `spring.datasources.pushnotification.embedded-postgres.override-working-directory` | `null` | Override directory for extracted Postgres binaries. Useful for persisting binaries across runs. |

#### Spring Configuration

##### Database Configuration

| Property | Default value | Required | Description |
| --- | --- | --- | --- |
| *spring.datasources.pushnotification.url* | - | true | Database connection string |
| *spring.datasources.pushnotification.username* | - | true | Database username |
| *spring.datasources.pushnotification.password* | - | true | Database password |
| *spring.datasources.pushnotification.driver-class-name* | - | true | The database driver classname. For example: `org.postgresql.Driver` |
| *spring.datasources.pushnotification.liquibase.change-log* | classpath:database/db.changelog-push-notification.xml | false | Liquibase change log file path |

* If you want to change database related configurations (Liquibase), you can set the following properties

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` spring.datasources.pushnotification.liquibase.database-change-log-lock-table=PN_DATABASECHANGELOGLOCK spring.datasources.pushnotification.liquibase.database-change-log-table=PN_DATABASECHANGELOG ``` |
```

##### Connection Pool Configuration

The Push Notification service uses [HikariCP](https://github.com/brettwooldridge/HikariCP) as the database connection pool implementation.
You can tune the connection pool settings based on your application’s requirements:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` # Maximum number of connections in the pool (default: 10) spring.datasources.pushnotification.hikari.maximum-pool-size=5  # Minimum number of idle connections maintained by HikariCP (default: same as maximum-pool-size) spring.datasources.pushnotification.hikari.minimum-idle=2  # Maximum time (in milliseconds) to wait for a connection from the pool (default: 30000) spring.datasources.pushnotification.hikari.connection-timeout=30000  # Maximum time (in milliseconds) that a connection can sit idle in the pool (default: 600000) spring.datasources.pushnotification.hikari.idle-timeout=600000  # Maximum lifetime (in milliseconds) of a connection in the pool (default: 1800000) spring.datasources.pushnotification.hikari.max-lifetime=1800000 ``` |
```

|  |  |
| --- | --- |
|  | For optimal performance, consider the following guidelines:  * **maximum-pool-size**: Set based on your database’s connection limit and application load. The default value of 10 may be higher than necessary for low-traffic applications. Consider reducing it to 5 or lower if your application handles fewer concurrent requests. * **minimum-idle**: Setting this lower than `maximum-pool-size` allows the pool to shrink during periods of low activity, freeing up resources. A common practice is to set it to about 20-50% of the maximum pool size. * For more information on HikariCP configuration, refer to the [HikariCP Configuration Documentation](https://github.com/brettwooldridge/HikariCP#configuration-knobs-baby). |

##### Push Provider Configurations

In order to let the app interacts with the push providers like APNs for FCM, you must configure those properties:

| Property | Required | Default | Description |
| --- | --- | --- | --- |
| *mgmtp.a12.notificationcenter.pushnotification.apns.bundle-id* | true | - | iOS app bundle id. |
| *mgmtp.a12.notificationcenter.pushnotification.apns.pkcs8-file-path* | true | - | APNs p8 token file path. |
| *mgmtp.a12.notificationcenter.pushnotification.apns.team-id* | true | - | The Apple team Id. |
| \_mgmtp.a12.notificationcenter.pushnotification.apns.key-id | true | - | The Apple key Id. |
| *mgmtp.a12.notificationcenter.pushnotification.apns.production* | false | false | If the value is true, ApnsClient will connect to the APNs production server. |
| *mgmtp.a12.notificationcenter.pushnotification.apns.alternative-server-port* | false | false | Should use the alternative server port (2129) or not. By default, the ApnsClient will connect the APNs server under port 443 |
| *mgmtp.a12.notificationcenter.pushnotification.apns.connection-timeout* | false | 30s | Connection timeout in second. |
| *mgmtp.a12.notificationcenter.pushnotification.fcm.service-account-credential-path* | true | - | The Google service account credential file absolute path. |
| *mgmtp.a12.notificationcenter.pushnotification.fcm.connection-timeout* | false | 30s | Connection timeout in second. |
| *mgmtp.a12.notificationcenter.pushnotification.mobile-platform* | false | cordova | The target mobile platform. This option is required to handle specific logic for the target platform. The available options: cordova, capacitor, native. |

##### Transaction Manager

Push Notification’s repository configuration is declared particularly in `PNRepsitoryConfiguration`:

* **TransactionManager** bean:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` @Bean public PlatformTransactionManager pnTransactionManager(     @Qualifier("pnEntityManagerFactory") LocalContainerEntityManagerFactoryBean pnEntityManagerFactory){     return new JpaTransactionManager(Objects.requireNonNull(pnEntityManagerFactory.getObject())); } ``` |
```

* **DataSource** bean:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` @ConfigurationProperties(PN_DATASOURCE_HIKARI_PROPERTY_BASE) @Bean public HikariDataSource pnDataSource(     @Qualifier("pnDatasourceProperties") DataSourceProperties pnDatasourceProperties) {      HikariDataSource dataSource= pnDatasourceProperties.initializeDataSourceBuilder()         .type(HikariDataSource.class)         .build();     if(StringUtils.hasText(pnDatasourceProperties.getName())){         dataSource.setPoolName(pnDatasourceProperties.getName());     }     return dataSource; } ``` |
```

|  |  |  |  |
| --- | --- | --- | --- |
|  | Above configurations are default, to specify explicitly Push Notification’s transaction context for your logic, use @Transactional("pnTransactionManager"). For example:  ``` |  |  | | --- | --- | | ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` @Transactional("pnTransactionManager") @PreAuthorize(AuthConstants.UAA_PUSH_NOTIFICATION_REGISTER_DEVICE_PERMISSION) public ResponseEntity<Void> registerDevice(RegisterDeviceRequest registerDeviceRequest) {     try {         // Logic of Push Notification component         logger.info("Registered new device successfully, request: [{}]", registerDeviceRequest);         return ResponseEntity.status(HttpStatus.OK).build();     } catch (Exception e) {         logger.info("Fail to register new device, request: [{}], exception message: [{}]", registerDeviceRequest, e.getMessage());         throw e;     } } ``` | ``` |

##### Test Mode Configuration

| Property | Default value | Required | Description |
| --- | --- | --- | --- |
| *mgmtp.a12.notificationcenter.pushnotification.test-mode* | false | false | Flag to enable/disable the test mode the Push Notification API |

##### Secure Logger Configuration

The Push Notification service uses a secure logger to log sensitive information to comply with GDPR regulations, including AccountId, DeviceId and other relevant information.
By default, we use DEBUG level for logging sensitive information. You can customize the secure logger by defining a bean of type `SecureLoggerService` as below:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 ``` | ``` public class CustomSecureLoggerServiceImpl implements SecureLoggerService {   /**    * Change the default log level to INFO.    */   @Override   public void log(Logger logger, LogCategory category, String message, Object... var) {     logger.info(message, var);   }    /**    * Hash sensitive information using SHA-256 algorithm.    */   @Override   public String calculateHash(String content) {     return HashingUtil.calculateHashSha256(content);   } } ``` |
```

Then, register the custom secure logger service as a bean in the Spring context:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` @Configuration public class ShowcaseLoggerConfiguration {   @Bean   public SecureLoggerService secureLoggerService() {     return new CustomSecureLoggerServiceImpl();   } } ``` |
```

#### Spring Profiles

We offer the following configuration profiles for the Push Notification Service.

##### UAA Configuration

* Profile name:

  + notificationcenter-pushnotification-uaa
* Profile contents:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.uaa.authorization.child-authorization-definitions=classpath:uaa/ncPushNotificationAuthorizationDefinition.json ``` |
```

##### Datasources Configuration

* Profile name:

  + notificationcenter-pushnotification-datasources
* Profile contents:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` spring.datasources.pushnotification.liquibase.database-change-log-lock-table=PN_DATABASECHANGELOGLOCK spring.datasources.pushnotification.liquibase.database-change-log-table=PN_DATABASECHANGELOG spring.datasources.pushnotification.liquibase.change-log=classpath:database/db.changelog-push-notification.xml ``` |
```

##### Embedded Postgres Configuration

* Profile name:

  + notificationcenter-pushnotification-embedded\_postgres
* Profile contents:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` spring.datasources.pushnotification.embedded-postgres.enabled=true spring.datasources.pushnotification.driver-class-name=org.postgresql.Driver spring.datasources.pushnotification.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect ``` |
```

|  |  |
| --- | --- |
|  | Activate this profile together with `notificationcenter-pushnotification-datasources` for local development or tests without an external database. |

#### Authorization

Push Notification Service introduces a new [ncPushNotificationAuthorizationDefinition.json](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/ncPushNotificationAuthorizationDefinition.json) file for securing our APIs.
It uses `mgmtp.a12.uaa.authorization.child-authorization-definitions` for integrating with UAA.

|  |  |
| --- | --- |
|  | If you have a custom configuration for the key `mgmtp.a12.uaa.authorization.child-authorization-definitions` then make sure our file `ncPushNotificationAuthorizationDefinition.json` should be added as well. |

You are free to define your own (additional) permissions and policies, and organize them as you want.
You may define permission for following scopes:

| Scope name | Description |
| --- | --- |
| Push Notification Register Device | Check that the user has access right to register a device for Push Notification. |
| Push Notification Deregister Device | Check that the user has access right to deregister a device for Push Notification. |
| Push Notification Create Notification | Check that the user has access right to create Push Notification for their devices. |
| Push Notification Delete Account | Check that the user has access right to delete an account and its related data. |
| Push Notification Delete Test Accounts | Check that the user has access right to delete test accounts and their related data. |

**Authorization scopes used in the code:**

| Method name and arguments | Scope name | Description |
| --- | --- | --- |
| `DeviceApiDelegate.registerDevice`  registerDeviceRequest  *com.mgmtp.a12.notificationcenter.pushnotification.model.RegisterDeviceRequest* | *PreAuthorize*  `PushNotificationRegisterDevice` | Check that the user has access right to register a device for Push Notification. |
| `DeviceApiDelegate.deregisterDevice`  id  *java.lang.String*  deviceId  *java.lang.String* | *PreAuthorize*  `PushNotificationDeregisterDevice` | Check that the user has access right to deregister a device for Push Notification. |
| `PushNotificationService.createNotification`  createPushNotificationRequest  *com.mgmtp.a12.notificationcenter.pushnotification.model.CreatePushNotificationRequest* | *PreAuthorize*  `PushNotificationCreateNotification` | Check that the user has access right to create Push Notification for their devices. |
| `AccountApiDelegate.deleteAccount`  accountId  *java.lang.String* | *PreAuthorize*  `PushNotificationDeleteAccount` | Check that the user has access right to delete an account and its related data. |
| `AccountApiDelegate.deleteTestAccounts`  timestamp  *java.lang.String* | *PreAuthorize*  `PushNotificationDeleteTestAccounts` | Check that the user has access right to delete test accounts and their related data. |

#### Events

List of events supported by Push Notification service:

| No | Event function name | Description |
| --- | --- | --- |
| 1 | **PushProviderApnsBeforeSendEvent** | Event published before a notification is sent to APNs. |
| 2 | **PushProviderFcmBeforeSendEvent** | Event published before a notification is sent to FCM. |

You are able to update the APNs/FCM properties before sending notification to the cloud provider.

For example, you can change
the color of notification by using the `AndroidNotificationBuilder` as follows:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` @Component public class FcmListener {   @EventListener   void useGreenColorForAllPushNotifications(PushProviderFcmBeforeSendEvent event) {     event.getAndroidNotificationBuilder().setColor("#94c502");   } } ``` |
```

#### Push Notification REST Client

##### Working With Spring Application

###### Artifact

| Artifact | Artifact ID | Description |
| --- | --- | --- |
| **notificationcenter-push-notification-rest-client** | [`com.mgmtp.a12.notificationcenter:notificationcenter-push-notification-rest-client`](https://artifacts.geta12.com/ui/repos/tree/General/a12-maven-releases/com/mgmtp/a12/notificationcenter/notificationcenter-push-notification-rest-client) | The (java) library that provides the APIs to interact with **Push Notification Service** from the other backend services. |

###### Configurations

**Example of configuration**

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 ``` | ``` @Configuration public class UaaRestClientConfiguration {    private UAARestClientFactory uaaRestClientFactory;    private static final String PUSH_NOTIFICATION_BASE_URL = "http://localhost:8089/api/push-notification";    @PostConstruct   void initialize() {     UrlProperty uaaBaseUrlProperty = new UrlProperty("http://localhost:8089/api");     UAARestClientProperties restClientProperties = new UAARestClientProperties();     restClientProperties.setAuthorizationHeaderName("Authorization");     restClientProperties.setUaaBase(uaaBaseUrlProperty);     restClientProperties.setAuthenticationType(AuthenticationType.CERTIFICATE);     restClientProperties.getAuthenticationConfiguration().setCertificate(certificateProperties);     uaaRestClientFactory = UAARestClientFactoryBuilder       .withConfiguration(restClientProperties)       .withOkHttpClient(new OkHttpClient().newBuilder()         .connectTimeout(5000, TimeUnit.MILLISECONDS)         .readTimeout(5000, TimeUnit.MILLISECONDS)         .writeTimeout(5000, TimeUnit.MILLISECONDS)         .build())       .build();   }    @Bean   public AuthenticationRestClient authenticationRestClient() {     return uaaRestClientFactory.getAuthenticationRestClient();   }    @Bean   public AuthorizationRestClient authorizationRestClient() {     return uaaRestClientFactory.getAuthorizationRestClient();   }    @Bean   public DeviceApiConnector deviceApiConnector() {     return new DeviceApiConnector(PUSH_NOTIFICATION_BASE_URL,         uaaRestClientFactory.getPostConnector(),         uaaRestClientFactory.getDeleteConnector());   }    @Bean   public NotificationApiConnector notificationApiConnector() {     return new NotificationApiConnector(PUSH_NOTIFICATION_BASE_URL,         uaaRestClientFactory.getPostConnector());   }    @Bean   public AccountApiConnector accountApiConnector() {    return new AccountApiConnector(PUSH_NOTIFICATION_BASE_URL,        uaaRestClientFactory.getDeleteConnector());   }    @Bean   public HealthApiConnector healthApiConnector() {    return new HealthApiConnector(PUSH_NOTIFICATION_BASE_URL, uaaRestClientFactory.getGetConnector());   } } ``` |
```

|  |  |
| --- | --- |
|  | Since the **Push Notification Service** uses UAA for authentication, all properties of the [UAA Rest Client](https://geta12.com/docs/UAA/uaa-documentation-src/index.html#rest-client) must be configured. |

##### Working With Spring Boot Application

###### Artifact

| Artifact | Artifact ID | Description |
| --- | --- | --- |
| **notificationcenter-push-notification-rest-client-spring-boot-autoconfigure** | [`com.mgmtp.a12.notificationcenter:notificationcenter-push-notification-rest-client-spring-boot-autoconfigure`](https://artifacts.geta12.com/ui/repos/tree/General/a12-maven-releases/com/mgmtp/a12/notificationcenter/notificationcenter-push-notification-rest-client-spring-boot-autoconfigure) | The (java) library that provides the APIs to interact with **Push Notification Service** from the other backend services which use Spring Boot |

###### Configurations

**Autoconfiguration**

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` @Import(PushNotificationClientConfiguration.class) @SpringBootApplication public class SampleBackendServiceApplication {     public static void main(String[] args) {         final SpringApplication application = new SpringApplication(SampleBackendServiceApplication.class);         application.run(args).start();     } } ``` |
```

**Spring properties**

| Property | Default value | Required | Description |
| --- | --- | --- | --- |
| `mgmtp.a12.notificationcenter.pushnotification.client.base-url` | - | true | Base **Push Notification Service** URL |

|  |  |
| --- | --- |
|  | Since the **Push Notification Service** uses UAA for authentication, all properties of the [UAA Rest Client](https://geta12.com/docs/UAA/uaa-documentation-src/index.html#rest-client) must be configured. |

#### Push Notifications HTTP API

We provide an OpenAPI specification at [nc-push-notification-api.json](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/nc-push-notification-api.json).

Push Notifications in **Notification Center Services** is reachable via the following endpoints:

##### Account

**List of Contents**

* [Delete Account](#_delete_account)
* [Delete Test Accounts](#_delete_test_accounts)
* [Schema Definition](#_schema_definition)

  + [DeleteAccountRequest](#_deleteaccountrequest)

###### Delete Account

|  |  |
| --- | --- |
| **Name** | Delete account |
| **Description** | Delete an account and their associated device from system. |
| **Method** | DELETE |
| **URL** | /api/push-notification/accounts/{accountId} |
| **Parameters** | `accountId` **(string)**: The account ID  [DeleteAccountRequest](#_deleteaccountrequest) |
| **Authorization Scopes** | `PushNotificationDeleteAccount` |
| **Success response** | **200 OK**  Delete account successfully. |
| **Error response** | **404 NOT\_FOUND**  The account does not exist.  **500 INTERNAL\_SERVER\_ERROR**  Internal server error happens.  **403 FORBIDDEN**  The user doesn’t have permission to access the API. |
| **Test Marker** | NOT\_FOUND  INTERNAL\_SERVER\_ERROR |

###### Delete Test Accounts

|  |  |
| --- | --- |
| **Name** | Delete test accounts |
| **Description** | Delete test accounts and their associated devices from system |
| **Method** | DELETE |
| **URL** | /api/push-notification/test-accounts/{timestamp} |
| **Parameters** | `timestamp` **(long)**: The timestamp specifies the cutoff for deleting pre-existing accounts in milliseconds, example: `1638485634567` |
| **Authorization Scopes** | `PushNotificationDeleteTestAccounts` |
| **Success response** | **200 OK**  Delete test accounts successfully. |
| **Error response** | **500 INTERNAL\_SERVER\_ERROR**  Internal server error happens.  **403 FORBIDDEN**  The user doesn’t have permission to access the API. |

##### Device

**List of Contents**

* [Register Device](#_register_device)
* [Deregister Device](#_deregister_device)
* [Schema Definition](#_schema_definition)

  + [RegisterDeviceRequest](#_registerdevicerequest)
  + [DeregisterDeviceRequest](#_deregisterdevicerequest)

###### Register Device

|  |  |
| --- | --- |
| **Name** | Register device. |
| **Description** | Register device to receive Push Notifications from Notification Center services.  If the device already exists, it will be overwritten |
| **Method** | POST |
| **URL** | /api/push-notification/devices |
| **Headers** | **Content-type**  application/json |
| **Parameters** | [RegisterDeviceRequest](#_registerdevicerequest) |
| **Authorization Scopes** | `PushNotificationRegisterDevice` |
| **Success response** | **200 OK**  Device is registered successfully.  **304 NOT\_MODIFIED**  Device is not modified. |
| **Error response** | **403 FORBIDDEN**  The user doesn’t have permission to access the API.  **500 INTERNAL\_SERVER\_ERROR**  Internal server error happens. |
| **Test Marker** | INTERNAL\_SERVER\_ERROR |

###### Deregister Device

|  |  |
| --- | --- |
| **Name** | Deregister device |
| **Description** | Deregister a device. This device will no longer receive Push Notifications from Notification Center services. |
| **Method** | DELETE |
| **URL** | /api/push-notification/devices/{deviceId} |
| **Parameters** | `deviceId` **(string)**: The device ID |
| **Authorization Scopes** | `PushNotificationDeregisterDevice` |
| **Success response** | **200 OK**  Device is deregistered successfully. |
| **Error response** | **403 FORBIDDEN**  The user doesn’t have permission to access the API.  **404 NOT\_FOUND**  The device is not registered.  **500 INTERNAL\_SERVER\_ERROR**  Internal server error happens. |
| **Test Marker** | NOT\_FOUND  INTERNAL\_SERVER\_ERROR |

##### Push

**List of Contents**

* [Push a New Notification](#_push_a_new_notification)
* [Schema Definition](#_schema_definition)

  + [CreatePushNotificationRequest](#_createpushnotificationrequest)
  + [PushNotification](#_pushnotification)
  + [PlatformSpecific](#_platformspecific)

###### Push a New Notification

|  |  |
| --- | --- |
| **Name** | Push a New Notification |
| **Description** | Create a Push Notification for devices of a specific account. |
| **Method** | POST |
| **URL** | /api/push-notification/notifications |
| **Headers** | **Content-type**  application/json |
| **Parameters** | [CreatePushNotificationRequest](#_createpushnotificationrequest) |
| **Authorization Scopes** | `PushNotificationCreateNotification` |
| **Success response** | **200 OK**  Notification is sent successfully |
| **Error response** | **403 FORBIDDEN**  The user doesn’t have permission to access the API.  **404 NOT\_FOUND**  The account is not registered, or the account doesn’t have any registered devices.  **500 INTERNAL\_SERVER\_ERROR**  Internal server error happens.  **502 BAD\_GATEWAY**  All the push notification requests failed. |
| **Test Marker** | NOT\_FOUND  INTERNAL\_SERVER\_ERROR  PROVIDER\_ERROR |

##### Health

**List of Contents**

* [Health Check](#_health_check)

###### Health Check

|  |  |
| --- | --- |
| **Name** | Health check |
| **Description** | Health check status for Push Notification including status of services and UAA integration. |
| **Method** | GET |
| **URL** | /api/push-notification/health |
| **Parameters** | None |
| **Authorization Scopes** | - |
| **Success response** | **200 OK**  The service is healthy and the UAA integration is working properly. |
| **Error response** | **401 UNAUTHORIZED**  Authentication failed or missing scope.  **500 INTERNAL\_SERVER\_ERROR**  Internal server error happens. |
| **Test Marker** | Not available for this endpoint. |

##### Schema Definition

###### DeleteAccountRequest

| Name | Type | Description |
| --- | --- | --- |
| `testMarker` | string | The test marker value. `"NOT_FOUND"` or `"INTERNAL_SERVER_ERROR"` |

###### RegisterDeviceRequest

| Name | Type | Description |
| --- | --- | --- |
| `accountId*` | string | The account ID of the user ID. |
| `deviceId*` | string | The device ID. |
| `platform*` | Enum: `"ANDROID"` or `"IOS"`. | The device platform. |
| `testMarker` | string | The test marker value. `"INTERNAL_SERVER_ERROR"` |
| `isTestDevice` | boolean | When set to true, the account will be marked as a test account. The default value is false. |

###### DeregisterDeviceRequest

| Name | Type | Description |
| --- | --- | --- |
| `testMarker` | string | The test marker value. `"NOT_FOUND"` or `"INTERNAL_SERVER_ERROR"` |

###### CreatePushNotificationRequest

| Name | Type | Description |
| --- | --- | --- |
| `accountId*` | string | The account ID of the user ID. |
| `notification*` | [PushNotification](#_pushnotification) | The notification data. |
| `platform` | Enum: `"ANDROID"` or `"IOS"` | The device platform. Please use `"null"` or without the key if you want to push for both device platforms. |
| `testMarker` | string | The test marker value. `"NOT_FOUND"` or `"INTERNAL_SERVER_ERROR"` or `"BAD_GATEWAY"`. |

###### PushNotification

| Name | Type | Description |
| --- | --- | --- |
| `title` | string | The notification title. |
| `body` | string | The notification body. |
| `customData` | object | This data will be included in the notification payload to the mobile application. |
| `platformSpecific` | [PlatformSpecific](#_platformspecific) | The data which is used to customize the notification in different platforms. |

###### PlatformSpecific

| Name | Type | Description |
| --- | --- | --- |
| `ios` | [PlatformSpecificIOS](#_platformspecificios) | Additional notification configurations for iOS. |
| `android` | [PlatformSpecificAndroid](#_platformspecificandroid) | Additional notification configurations for Android. |

###### PlatformSpecificIOS

| Name | Type | Description |
| --- | --- | --- |
| `notificationSubtitle` | string | The notification subtitle. |
| `badgeNumber` | integer | The mobile application badge number. |
| `deliveryPriority` | Enum: "IMMEDIATE" or "CONSERVE\_POWER" | The priority of the notification. By default, APNs sets the notification priority to 10 (IMMEDIATELY). |
| `collapseId` | string | An identifier you use to merge multiple notifications into a single notification for the user. Typically, each notification request displays a new notification on the user’s device. When sending the same notification more than once, use the same value in this header to merge the requests. The value of this key must not exceed 64 bytes. |

###### PlatformSpecificAndroid

| Name | Type | Description |
| --- | --- | --- |
| `notificationImageUrl` | string | The image Url in the notification. |
| `notificationCount` | integer | The number of notification counts will be added to the mobile application’s badge number. |
| `sticky` | boolean | When set to true, the notification persists even when the user clicks it. |
| `deliveryPriority` | Enum: "NORMAL" or "HIGH" | The priority of the notification. By default, FCM uses NORMAL priority. |
| `collapseId` | string | The collapse key serves as an identifier for a group of messages that can be collapsed, so that only the last message gets sent when delivery can be resumed. A maximum of 4 different collapse keys may be active at any given time. |

###### TestMarker

| Name | Type | Description | Values |
| --- | --- | --- | --- |
| `TestMarkerEnum` | Enum | The test marker value | NOT\_FOUND  INTERNAL\_SERVER\_ERROR  PROVIDER\_ERROR |

#### Spring Actuator

Spring Actuator contains many endpoints which expose information about the running application like health metrics, configuration information, etc…​

By default, all actuator endpoints (`/actuator/*`) are secured. If needed, you have the possibility to explicitly open certain endpoints for public usage.

##### Configuration of Actuator Endpoint

The configuration actuator provides information about the currently applied configuration on the running Push Notification Services server.
The actuator is accessible via GET request to the `/actuator/pushNotificationConfiguration` resource.

This actuator gives information on configuration changes and on warnings concerning the configuration of the Push Notification Services server.

To enable this endpoint, provide the properties below:

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` management.endpoints.web.exposure.include="pushNotificationConfiguration" management.endpoint.pushNotificationConfiguration.access=read_only ``` |
```

Example response from 'GET /actuator/pushNotificationConfiguration'

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` {   "changes": {     "mgmtp.a12.notificationcenter.pushnotification.apns.bundleId": {       "current": "com.mgmtp.a12.notificationcenter.mobile.sample",       "default": "null"     }   } } ``` |
```

#### Test Mode

When the test mode is enabled, a test marker value can be added to the request to simulate the different use/error cases that can occur during usage of the API.

The supported test marker value is different for each API. You can find these values under [Push Notification API](#push-notification-api) sections.

This is an example request for registering device API with test marker value is INTERNAL\_SERVER\_ERROR:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` POST /api/push-notification/devices  {   "accountId" "",   "deviceId": "",   "platform": "",   "testMarker": "INTERNAL_SERVER_ERROR" } ``` |
```

|  |  |
| --- | --- |
|  | If an **unsupported** or **invalid** test marker value is used, the request will return a **NOT\_IMPLEMENTED** error.  If the test marker is **omitted**. The request will be delegated to the controller and process normally. |

## Notification Reminder Extension

The (java) library, which needs to be installed inside **A12 Data Services** to handle Reminder Document logics.

### Artifact

| Artifact | Artifact ID | Description |
| --- | --- | --- |
| **notificationcenter-reminder-extension** | `com.mgmtp.a12.notificationcenter:notificationcenter-reminder-extension` | The (java) library which is installed inside **A12 Data Services** to handle Reminder Document logics. |

### Configurations

Since this is an extension for **A12 Data Services**, please also refer to [A12 Data Services configuration](https://geta12.com/docs/DATA_SERVICES/dataservices-documentation-src/index.html#dataservices-configuration).

**Autoconfiguration**

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` @Import(NotificationCenterReminderExtensionConfiguration.class) // Use this annotation to enable autoconfiguration class DataServiceApplication extends ServerApplication {   public static void main(String[] args) {     SpringApplication.run(DataServiceApplication.class);   } } ``` |
```

**Spring properties**

| Property | Default value | Required | Description |
| --- | --- | --- | --- |
| `mgmtp.a12.notificationcenter.reminder.model-name` | - | true | Your custom A12 Reminder Model name. |

**Spring Profiles**

We offer the following configuration profile for the Reminder Extension package.

* UAA configuration:

  + Profile name:

    - notificationcenter-reminderextension-uaa
  + Profile contents:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.uaa.authorization.child-authorization-definitions=classpath:uaa/ncExtensionAuthorizationDefinition.json ``` |
```

### Authorization

Notification Center Reminder Extension introduces a new [ncReminderExtensionAuthorizationDefinition.json](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/ncReminderExtensionAuthorizationDefinition.json) file for securing our APIs.
It uses `mgmtp.a12.uaa.authorization.child-authorization-definitions` for integrating with UAA.

|  |  |
| --- | --- |
|  | If you have a custom configuration for the key `mgmtp.a12.uaa.authorization.child-authorization-definitions` then make sure our file `ncReminderExtensionAuthorizationDefinition.json` should be added as well. |

You are free to define your own (additional) permissions and policies, and organize them as you want.
You may define permission for following scopes:

| Scope name | Description |
| --- | --- |
| Create Reminder | Check that the user has access right to create a [Reminder](#notification-center-reminders). |
| Update Reminder | Check that the user has access right to update a [Reminder](#notification-center-reminders). |
| Get Reminder | Check that the user has access right to get a [Reminder](#notification-center-reminders). |
| Query Reminder | Check that the user has access right to query [Reminders](#notification-center-reminders). |
| Delete Reminder | Check that the user has access right to delete a [Reminder](#notification-center-reminders). |
| Mark Done Reminder | Check that the user has access right to mark a [Reminder](#notification-center-reminders) as done. |
| Mark Due Reminder | Check that the user has access right to mark a [Reminder](#notification-center-reminders) as due. |

**Authorization scopes used in the code:**

| Method name and arguments | Scope name | Description |
| --- | --- | --- |
| `ReminderDocumentService.createReminder`  reminderRequest  *com.mgmtp.a12.notificationcenter.extension.document.ReminderRequest* | *PreAuthorize*  `CreateReminder` | Check that the user has access right to create a [Reminder](#notification-center-reminders). |
| `ReminderDocumentService.updateReminder`  id  *java.lang.String*  reminderRequest  *com.mgmtp.a12.notificationcenter.extension.document.ReminderRequest* | *PreAuthorize*  `UpdateReminder` | Check that the user has access right to update a [Reminder](#notification-center-reminders). |
| `ReminderDocumentService.getReminder`  id  *java.lang.String* | *PreAuthorize*  `GetReminder` | Check that the user has access right to get a [Reminder](#notification-center-reminders). |
| `ReminderDocumentService.queryReminders`  filterSpec  *com.mgmtp.a12.dataservices.rpc.query.FilterSpec*  sortSpecs  *java.util.List<com.mgmtp.a12.dataservices.rpc.query.SortSpec>*  pageSpec  *com.mgmtp.a12.dataservices.rpc.query.PageSpec* | *PreAuthorize*  `QueryReminders` | Check that the user has access right to query [Reminders](#notification-center-reminders). |
| `ReminderDocumentService.deleteReminder`  id  *java.lang.String* | *PreAuthorize*  `DeleteReminder` | Check that the user has access right to delete a [Reminder](#notification-center-reminders). |
| `ReminderDocumentService.markDone`  id  *java.lang.String* | *PreAuthorize*  `MarkDone` | Check that the user has access right to mark a [Reminder](#notification-center-reminders) as done. |
| `ReminderDocumentService.markDue`  id  *java.lang.String* | *PreAuthorize*  `MarkDue` | Check that the user has access right to mark a [Reminder](#notification-center-reminders) as due. |

### Working With Reminders

#### Events

List of events supported by **Notification Center Reminder Extension**:

| No | Event function name | Policy Description |
| --- | --- | --- |
| 1 | **ReminderBeforeCreateEvent** | The event is published before the computation and validation of a newly created reminder document. |
| 2 | **ReminderBeforeUpdateEvent** | The event is published before validation and computation of an updated reminder document. |

|  |  |
| --- | --- |
|  | The DocumentV2 is **immutable**. Therefore, if you want to modify the document included in the event, you must use the setter method provided in the event to make changes. |

#### Examples

How to set fields of the reminder document before the reminder document is created:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` @EventListener public void listenReminderBeforeCreatedEvent(ReminderBeforeCreateEvent reminderBeforeCreateEvent) {         DocumentV2 document = reminderBeforeCreateEvent.getCreatedReminderDocument();         // Modify some field of reminder document         reminderBeforeCreateEvent.setCreatedReminderDocument(document); } ``` |
```

#### Reminder Validation

In the **A12 Data Services**, you can implement your own way of validation before a reminder is updated:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` /**  * Interface for validation when updating reminder document  */ public interface BeforeUpdateReminderValidator {     /**      * Validate reminder document      *      * @param updatedDocument   the updated reminder document to be validated      * @param persistedDocument the persisted reminder document to be validated      * @throws ReminderValidationException exception including error message      */     void validate(DocumentV2 updatedDocument, DocumentV2 persistedDocument) throws ReminderValidationException; } ``` |
```

Table 1. Enabled validators


| Validator | Classpath |
| --- | --- |
| ReminderCreatorInformationValidator | `extension/src/main/java/com/mgmtp/a12/notificationcenter/extension/validator/internal/ReminderCreatorInformationValidator.java` |
| ReminderExpirationValidator | `extension/src/main/java/com/mgmtp/a12/notificationcenter/extension/validator/internal/ReminderExpirationValidator.java` |
| ReminderStatusValidator | `extension/src/main/java/com/mgmtp/a12/notificationcenter/extension/validator/internal/ReminderStatusValidator.java` |

|  |  |
| --- | --- |
|  | The [ReminderValidationException](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/sources/ReminderValidationException.java) contains the localisation key, it will be used by the client. |

#### Search Capabilities

In Notification Center **A12Reminder\_DM**, we enable the **case-insensitive** and **approximate match** search in filters for the following fields:

* title
* description
* updatedBy

#### Reminder Migration

* Add the migration package:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` dependencies {   implementation "com.mgmtp.a12.notificationcenter:notificationcenter-data-migration:<VERSION>"    // other dependencies } ``` |
```

* Import a migration script that matches with your model version and call `migrate` with your document content that
  contains our `A12Reminder_DM` in XML format:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 ``` | ``` import com.mgmtp.a12.notificationcenter.migration.versions.A12ReminderModelMigration_0_5_0;  @MigrationStep(version = "0.5.0", name = "Migrate A12Reminder documents") @RequiredArgsConstructor public class ShowCaseReminderDocumentMigration_0_5_0 {     private final MigrationScript a12ReminderMigrationScript = new A12ReminderModelMigration_0_5_0();      @Transactional     @MigrationTask(name = "Migrate A12Reminder document fields")     public void migrateA12ReminderDocuments() {         String migratedDocument = loadDocumentXml();          // Migrate A12Reminder document fields         a12ReminderMigrationScript.migrate(migratedDocument);     } } ``` |
```

### Reminder Extension HTTP API

**List of Contents**

* [Get Reminder](#_get_reminder)
* [Create Reminder](#_create_reminder)
* [Update Reminder](#_update_reminder)
* [Delete Reminder](#_delete_reminder)
* [Query Reminders](#_query_reminders)
* [Mark Done](#_mark_done)
* [Mark Due](#_mark_due)

#### Get Reminder

|  |  |
| --- | --- |
| **Name** | Get a reminder by id. |
| **Description** | Endpoint allows fetching a reminder document by id. |
| **Method** | GET |
| **URL** | /api/reminders/{id} |
| **Headers** | **Content-type**  application/json |
| **Parameters** | **id**  Reminder document id. |
| **Authorization Scopes** | - Get Reminder |
| **Success response** | **200 OK**  Loaded reminder document. |

#### Create Reminder

|  |  |
| --- | --- |
| **Name** | Create a reminder. |
| **Description** | Endpoint allows creating a reminder document. |
| **Method** | POST |
| **URL** | /api/reminders |
| **Headers** | **Content-type**  application/json |
| **Parameters** | **reminderRequest**  Reminder request contains content with validations and computations of the document.  `com.mgmtp.a12.notificationcenter.extension.document.ReminderRequest` |
| **Authorization Scopes** | - Create Reminder |
| **Success response** | **200 OK**  DocumentReference of the created reminder document. |
| **Note** | The `ReminderBeforeCreateEvent` will be published before the document is created. |

#### Update Reminder

|  |  |
| --- | --- |
| **Name** | Update a reminder. |
| **Description** | Endpoint allows updating a reminder document. |
| **Method** | PUT |
| **URL** | /api/reminders/{id} |
| **Headers** | **Content-type**  application/json |
| **Parameters** | **reminderRequest**  Reminder request contains content with validations and computations of the document `com.mgmtp.a12.notificationcenter.service.web.requestbody.ReminderRequest`  **id**  Id of requested reminder document. |
| **Authorization Scopes** | - Update Reminder |
| **Success response** | **200 OK**  Reminder document has been updated. |
| **Note** | The `ReminderBeforeUpdateEvent` will be published before the document is updated. |

#### Delete Reminder

|  |  |
| --- | --- |
| **Name** | Delete a reminder by id. |
| **Description** | Endpoint allows deleting a reminder document by id. |
| **Method** | DELETE |
| **URL** | /api/reminders/{id} |
| **Headers** | **Content-type**  application/json |
| **Parameters** | **id**  Reminder document id. |
| **Authorization Scopes** | - Delete Reminder |
| **Success response** | **200 OK**  The reminder document has been deleted. |
| **Note** | If the document does not exist, the action will silently finish without errors. |

#### Query Reminders

|  |  |
| --- | --- |
| **Name** | Query reminders. |
| **Description** | Endpoint allows fetching a list of reminder documents with partition configuration (filtering, sorting, paging). |
| **Method** | POST |
| **URL** | /api/reminders/query |
| **Headers** | **Content-type**  application/json |
| **Parameters** | **filter** `com.mgmtp.a12.dataservices.rpc.query.FilterSpec`  A filter definition.  **sort**  A list of sort definitions.  **page** `com.mgmtp.a12.dataservices.rpc.query.PageSpec`  Pagination specification. |
| **Authorization Scopes** | - Query Reminders |
| **Success response** | **200 OK**  A list of reminder documents. |

#### Mark Done

|  |  |
| --- | --- |
| **Name** | Mark a reminder as done. |
| **Description** | Endpoint allows changing status of a reminder document to `DONE`. |
| **Method** | PUT |
| **URL** | /api/reminders/{id}/done |
| **Headers** | **Content-type**  application/json |
| **Parameters** | **id**  Reminder document id. |
| **Authorization Scopes** | - Mark Done |
| **Success response** | **200 OK**  Status of the reminder document has been updated to `DONE`. |

#### Mark Due

|  |  |
| --- | --- |
| **Name** | Mark a reminder as due. |
| **Description** | Endpoint allows changing status of a reminder document to `DUE`. |
| **Method** | PUT |
| **URL** | /api/reminders/{id}/due |
| **Headers** | **Content-type**  application/json |
| **Parameters** | **id**  Reminder document id. |
| **Authorization Scopes** | - Mark Due |
| **Success response** | **200 OK**  Status of the reminder document has been updated to `DUE`. |

## Automatic Migration

Since 2024.06, A12 components should provide consuming projects with artifacts for automatic migration where possible,
to make migrations faster and less error-prone.

### Migrating Client with Codemod

This codemod CLI helps automate repetitive code transformations required during Notification Center version upgrades.
It uses AST-based transformations to safely and accurately modify your TypeScript codebase.

#### How To Use

Run command:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx @com.mgmtp.a12.notificationcenter/notificationcenter-codemod@latest <recipe-id> <source-directory-containing-tsconfig-file> ``` |
```

Or via pnpm:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` pnpm dlx @com.mgmtp.a12.notificationcenter/notificationcenter-codemod@latest <recipe-id> <source-directory-containing-tsconfig-file> ``` |
```

**Example**

Run the `prefer-top-level-imports` recipe on your project:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx @com.mgmtp.a12.notificationcenter/notificationcenter-codemod prefer-top-level-imports ./client ``` |
```

#### Available Recipes

##### `prefer-top-level-imports`

**Supported versions:** `^3.2.0`

Migrates deep path imports from `@com.mgmtp.a12.notificationcenter/notificationcenter-*` to top-level imports.

**Before**

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` import {   NotificationFrame } from "@com.mgmtp.a12.notificationcenter/notificationcenter-core/lib/internal/components/NotificationFrame/NotificationFrame.js"; import {   NotificationCenterGlobalStyles } from "@com.mgmtp.a12.notificationcenter/notificationcenter-core/lib/internal/theme/global-styles.js"; ``` |
```

**After**

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` import {   NotificationCenterGlobalStyles,   NotificationFrame } from "@com.mgmtp.a12.notificationcenter/notificationcenter-core"; ``` |
```

## Infrastructure Dependencies

In the table below, the infrastructure dependencies required by Notification Center are listed with their purpose,
supported versions, resource recommendations, and configuration links.

| Dependency | Purpose | Supported Versions | Configuration Reference | Minimum Resource Recommendation | Notes |
| --- | --- | --- | --- | --- | --- |
| PostgreSQL | Stores persistent data (notifications, reminder documents, etc.) | 15,16,17 | Please use the links for the Web Notification  [connection configurations](#web-notification-database) and the Push Notification [connection configurations](#push-notification-database) | - | An embedded Postgres option is available for local development and tests — see [Web Notification](#web-notification-embedded-postgres) and [Push Notification](#push-notification-embedded-postgres) embedded Postgres sections. |

Due to the limitations of **A12 Data Services** and **A12 Data Distribution**, the PostgreSQL database is required to support all features of Notification Center,
especially the [Reminder feature](#notification-center-reminder-extension).

Currently, all Notification Center functional tests are executed against PostgreSQL version 17.

|  |  |
| --- | --- |
|  | For local development and testing without a running database server, both the Notification Center service and the Push Notification service support an embedded Postgres instance via the `notificationcenter-embedded_postgres` and `notificationcenter-pushnotification-embedded_postgres` Spring profiles respectively. See [Web Notification Embedded Postgres](#web-notification-embedded-postgres) and [Push Notification Embedded Postgres](#push-notification-embedded-postgres) for details. |

## Migration Instructions

|  |  |
| --- | --- |
|  | Please have a look at [Migration to latest A12](https://geta12.com/docs/overall/migration_guide/index.html) chapter for an explanation of general steps on how to upgrade before starting with the component migration. |

### 2025.06-ext5

Version: 3.3.0

#### Notification Publish Lifecycle Events

The Notification Center service now provides publish lifecycle events for web notifications:

* `NotificationBeforePublishEvent`
* `NotificationAfterPublishEvent`

These events are emitted around `NotificationPublisher.pushNotification(…​)` and are intended as integration hooks.

If your project currently overrides the Notification Publisher bean only to attach custom logic (for example, email integration), migrate to Spring event listeners instead.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` @Configuration public class EmailIntegrationListener {      @EventListener     public void onAfterPublish(NotificationAfterPublishEvent event) {         // Integration-specific logic     } } ``` |
```

#### Embedded Postgres Support for Notification Center and Push Notification Services

Both the Notification Center service and the Push Notification service now support running an embedded Postgres instance for local development and tests without requiring an external database server.
This is powered by [io.zonky.test:embedded-postgres](https://github.com/zonkyio/embedded-postgres).

##### What’s New

* New Spring profile `notificationcenter-embedded_postgres` for the Notification Center service.
* New Spring profile `notificationcenter-pushnotification-embedded_postgres` for the Push Notification service.
* New configuration for activating embedded Postgres:

```
# Notification Center service
spring.datasources.notificationcenter.embedded-postgres.enabled=true=true

# Push Notification service
spring.datasources.pushnotification.embedded-postgres.enabled=true=true
```

For tests that should run in isolation (clean database on each startup), add:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` # Notification Center service spring.datasources.notificationcenter.embedded-postgres.clean-data-directory=true  # Push Notification service spring.datasources.pushnotification.embedded-postgres.clean-data-directory=true ``` |
```

For full configuration reference, see the
[Web Notification Embedded Postgres](#web-notification-embedded-postgres) and
[Push Notification Embedded Postgres](#push-notification-embedded-postgres) sections.

#### Discontinuation of the Notificationcenter-Rewrite Package

As of version 3.3.0, the **notificationcenter-rewrite** package has been discontinued due to licensing issues.
This package automated the migration of Notification Center to newer versions in backend applications.

If you are on version 2.x, you can still use **notificationcenter-rewrite 3.2.1** for automating the migration to version 3.2.1.
For any future migrations beyond that, you will need to apply the necessary code changes manually.

### 2025.06-ext4

Version: 3.2.1

#### Migrate Push Notification Mobile Showcase to Capacitor Platform

We have migrated the Push Notification Mobile Showcase from Cordova to Capacitor platform to simplify the development and testing of Push Notification features on mobile devices.
By doing so, we switch to use Capacitor Push Notification plugin for handling push notifications and updated the related code accordingly.

#### Support Composable A12 Client Application

We have migrated the showcase application to use the new composable A12 Client application API. In Notification Center Core package, we have provided the `withNotificationCenter` function to simplify the integration of Notification Center in A12 Client application setup.

#### Configurable Http Client for Push Notification REST Client

It is now possible to configure `OkHttpClient` for Push Notification REST client by configuring the `UaaRestClientFactory` in the consuming application. You can set the desired configurations such as connection timeout, read timeout, and other settings for the HTTP client used by the Push Notification REST client.

For more details, please refer to the [Push Notification REST Client](#push-notification-rest-client) documentation.

#### Configurable Hikari Connection Pool Configuration

It is now possible to configure Hikari connection pool settings for Notification Center service and Push Notification service.

For more details, please refer to the [Web Notification Connection Pool](#web-notification-connection-pool) for Web Notification or [Push Notification Connection Pool](#push-notification-connection-pool) for Push Notification documentation.

#### Introduce Codemod for Frontend Migrations

We have introduced a Codemod CLI tool to help automate repetitive code transformations required during Notification Center version upgrades.

* Recipes:

Prefer Top Level Import

Nested imports from the npm package @com.mgmtp.a12.notificationcenter/notificationcenter-core (e.g. @com.mgmtp.a12.notificationcenter/notificationcenter-core/lib/internal/applicationFactory.js)
are deprecated in favor of top-level imports to avoid unnecessary breaking changes and reduce ongoing maintenance effort.

Please refer to the [Migrating Client with Codemod](#migrating_client_with_codemod) section for more details on how to use the Codemod tool and the available recipes.

#### Push Notification Service Health Check Endpoint

We have added a new health check endpoint to the Push Notification service to provide better visibility into the health status of the service.
This endpoint can be used to verify that the service is healthy and that UAA integration is working properly.

The endpoint is accessible at `/api/push-notification/health`.

#### Push Notification Service Secure Logger

We have implemented a secure logger for the Push Notification service to enhance security and compliance when logging sensitive information.

For further details on how to customize the secure logger for different use cases, please refer to the [Push Notification Secure Logger](#push-notification-secure-logger) documentation.

### 2025.06-ext2

Version: 3.1.0

#### Push Notification on Capacitor Platform

We have introduced a new property to enable push notification support on the Capacitor mobile platform:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.notificationcenter.pushnotification.mobile-platform=cordova|capacitor|native ``` |
```

The default value of this property is `cordova`.

### 2025.06

Version: 3.0.0

#### Replace the IDocument With the DocumentV2

We have replaced the `IDocument` interface with the new `DocumentV2` interface from Kernel for access and manipulation of data in the documents.

The overall information about the `DocumentV2` can be found at Kernel document at [DocumentV2](https://geta12.com/#/docs/2025.06/ext0/kernel/kernel-documentation-dev%23document_api_v2_java).

#### Actuator Endpoint Migration

In Spring boot 3.0 and newer, the `management.endpoint.<endpoint>.enabled` property has been deprecated and replaced with a new model using `management.endpoint.<endpoint>.access`.

The access property uses a more structured access control model with the following values:

* `none` – The endpoint is disabled for all access.
* `read_only` – The endpoint is accessible only for read operations (typically used for safe operations like GET).
* `unrestricted` – The endpoint is fully accessible (subject to global actuator security settings).

#### Removal of the Deprecated Appendix ID

We have dropped support for notifications with appendix ID `Notification`. From now on, only appendices with the ID
`metaData` (the default implementation) are supported.

If you are manipulating the notification metadata (read/unread/delete) manually, you must migrate your code to use `NotificationDDAppendix.APPENDIX_ID` instead of `NotificationDDAppendix.DEPRECATED_APPENDIX_ID`.

#### Removal of Query API Switch

The Query API is now the default mechanism for querying Reminder documents, consistent with other A12 components.

##### Backend

All related Spring properties and profiles have been removed.

* Affected Spring property: `mgmtp.a12.notificationcenter.reminder.queryapi.enabled`
* Affected Spring profiles: `notificationcenter-reminderextension-queryapi`, `notificationcenter-reminderjob-queryapi`

|  |  |
| --- | --- |
|  | We have provided an [OpenRewrite recipe](#notification-center-automatic-migration) to help remove the affected Spring properties. However, due to the complexity of the Spring profiles structure, we were unable to automate the removal of affected Spring profiles. As a result, you will need to remove them manually. |

##### Frontend

In **Notification Client** package, we have removed the Query API switch from the `ReminderFactories.createModule` method.
You will need to update your code accordingly by removing the `{ queryAPI: true }` parameter, as shown below:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` export const reminderModule = (): Module => ({     ...ReminderFactories.createModule(),   model: () => model as ApplicationModel }); ``` |
```

#### Removal of Outdated Reminder Migration Code

According to the supported A12 release lines, we have removed the outdated migration code including:

* Migration for A12 Reminder documents in version 0.5.0 (`A12ReminderModelMigration_0_5_0`)
* OpenRewrite recipe for version 2.0.0 (`com.mgmtp.a12.notificationcenter.UpgradeNotificationCenter_2_0_0`)

#### Deployment

##### Migrate the Ingress Path Type to ImplementationSpecific

In the latest Ingress controller running on the TPI Cluster, the validation enforces character restrictions for paths with the Exact or Prefix types.

To include a rewrite configuration in the ingress path, the path type must be set to `ImplementationSpecific`.

```
...
- path: /(api/v2/sync.*)
  pathType: ImplementationSpecific
...
```

## References

### JavaDoc

* [Notification Center javadoc](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/javadoc/index.html)

### TypeDoc

* [notificationcenter-core](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/typedoc/notificationcenter-core/index.html)
* [notificationcenter-client](https://geta12.com/docs/2025.06/ext5/notification_center/notificationcenter-documentation/assets/typedoc/notificationcenter-client/index.html)
