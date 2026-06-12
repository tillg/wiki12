---
source: https://geta12.com/docs/2025.06/ext5/overall/security/index.html
category: overall
docid: security
scraped: 2026-06-12
---

# Security Guidelines

|  |  |
| --- | --- |
|  | Disclaimer: This section provides hints and recommendations how to use and configure A12 securely in customer projects. There is no guarantee for completeness. Each customer project is responsible for its own security. |

## Introduction

This documentation summarizes the security best practices of A12. It contains pointers to product sections and serves as a starting point for new projects. The section about authorization is more detailed and supported by examples, since this is a very crucial topic which should be well understood.

### The A12 Releases and Their Expected Use Cases

The A12 team basically releases two different bundles containing all relevant products:

* The [A12 Modeling Environment Installer](https://geta12.com/docs/overall/installing_a12/index.html#_installation)
* The [Project Template](https://geta12.com/docs/PROJECT_TEMPLATE/project-template-documentation/index.html)

The A12 Installer is meant for business analysts to easily deploy a **local** version of A12 on their laptops, mainly for modeling. It is **not** meant to be deployed on any server, neither company internal nor internet facing, as it lacks fundamental security features.

In order to start working with a new project, developers are encouraged to check out the A12 Project Template. The following sections provide hints on a secure default configuration.

### Release Cycle and Security Patches

The [A12 Release Policies](https://geta12.com/#/releases/policies) explains in detail which release lines are supported. Our supported release lines get actively monitored with our in-house development ATLAS for known vulnerabilities in the third party libraries using OWASP and XRay dependency checks. Not every third party vulnerability causes A12 or A12-based projects to be vulnerable, i.e. we assess the issues and conclude on the severity in our context. Vulnerabilities with increased risk for A12 get mitigated by non-breaking patch releases:

* if our components define fixed dependencies, we apply the patch to all active release lines and provide A12 component releases
* if our components work with open range dependencies, we inform customer projects to apply the patch directly

For highly critical issues, we provide patches as soon as possible. For others, we release patches every 2 month (February, April, June, August, October, December). To benefit from these efforts, you should **ensure to always install the latest patch**.

### Security Contacts

When new A12-based projects are started, we ask for at least one security contact in the project. This contact gets informed actively by mgm in case of important security notes. Make sure to inform mgm in case of personal changes.

## Security Features

A12 is developed according the *Secure by Design* approach and shipped with *Secure by Default*. Developers get regular security training, code is automatically scanned for vulnerabilities, and on top, all frontend and backend components are regularly tested by penetration tests.

Now, let’s take a closer look at the built-in security features of A12.

### Frontend

On the high level, the frontend of an A12 application is described by models defined by a modeler. The client interprets the models and in combination with prebuild HTML components (Widgets) builds the DOM of your application. Plain HTML is never required.
On the low level, the frontend is based on React and therefore inherently well protected against Cross-Site-Scripting (XSS). User input is never returned as plain HTML. Where HTML is required by modelers, it gets sanitized with *dompurify*.
The A12 frontend is therefore generally protected against injection of HTML or JavaScript.

### Backend

The core backend components are UAA, Data Services, and Kernel. UAA enables secure authentication and authorization while Data Services provides the application models and documents. The Kernel takes over core functionality of models and documents, e.g. (de)serialization and validation.

Access to the database is solely performed via Hibernate and parameterized queries to ensure data consistency and to prevent injections, respectively.

File uploads as document attachments are stored in the Data Services Content Store. The component team provides examples on how to validate the file type and perform virus checks during upload. To enable maximum flexibility for projects, these checks are not built-in by default in A12.

### Authentication

A12 UAA (User Authentication and Authorization) is based on Spring Security and extends its functionality. It allows you to use the following authentication types:

* **OIDC** - OpenID Connect standard. External IdP is required.
* **SAML** - Standard SAML protocol. External IdP is required.
* **Active Directory/LDAP** - UAA acts as IdP, but credentials are validated by AD/LDAP server.
* **UAA\_ACCESS\_TOKEN** - UAA understand JWT token which is created by other instance.
* **Certificate** - Both client and server verify each other’s identity using certificates (mTLS), ensuring two-way authentication.
* **API\_KEY** - Client API key is used for authentication. Validated by root certificate.
* **Anonymous** - Anonymous access.
* **LOCAL** - UAA acts as IdP and implementor is responsible for credential validation. (*for testing purposes only!*)
* **Custom** - Open type to be implemented by an implementor.

The Project Template comes with Keycloak as IdP and is using the OIDC standard.

The majority of this authentication methods use a JSON Web Token (JWT) for request authentication to the backend. The token is always transported in the Authorization header. This makes the application inherently protected against Cross-Site Request-Forgery (CSRF) attacks.

UAA provides a token renewal mechanism. This allows you to keep the lifetime of the tokens short and automatically request a new token when required.

As a defense in depth measure, UAA is blocking the tokens of users that actively logged out from the application.

### Authorization

The authorization is one of the most important aspects in your application you want to create with A12. Every project has it’s very own business requirements to authorization. A12 allows you to use, combine and customized different concepts of authorization. As always, with great power comes great responsibility: It is the projects' responsibility to ensure, that the permissions defined in the authorization rules are as strict as possible.

It is highly recommended, to take sufficient time to study the authorization concepts of A12 and how to control them. Start with the simplest approach (RBAC only) and then proceed to the more complex scenarios (ABAC). An overview and basic introduction is provided here. For more details read the specific documentations of Data Services and UAA, and make use of the [UAA training](https://bitbucket.mgm-tp.com/projects/A12/repos/uaa_training/browse) (internal only) and [A12 e-learning](https://training.geta12.com/).

A12 offers Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC). You can use RBAC or ABAC solely, or in combination. In all cases, the authorization decision process always involves three components:

* Code (developer perspective)
* Authorization definition
* Model, roles and settings (modeler perspective)

This following graphic depicts the flow of the authorization decision from code, through the authorization definition, to the models and roles defined by the BA, on the example of checking the authorization for the `ADD_DOCUMENT` method.

![AuthorizationFlow](https://geta12.com/docs/2025.06/ext5/overall/security/assets/AuthorizationFlow.png)

Figure 1. Visualization of the authorization flow for the `ADD_DOCUMENT` method with the RBAC.

#### Code (Developer Perspective)

On the code level, the developer uses *scopes* to secure a certain functionality or method. A12 Data Services calls the [AuthorizationService](https://geta12.com/docs/uaa/uaa-documentation-src/index.html#authorization-java-base) from UAA by certain *PermissionEvaluators* (e.g. *DocumentPermissionEvaluator*). These calls define which scopes must be checked to grant access. The authorization can be bound to one or more scopes. To find the relevant scopes of an A12 Data Services method, check the [JSON-RPC 2.0 Core Operations](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#rpc-operations). There you find the call sequence for each method. The *security* blocks define the scopes that are checked. The following screenshot highlights the scopes ("Document Create" and "Model Read") of the `ADD_DOCUMENT` call sequence:

![sequence scope example](https://geta12.com/docs/2025.06/ext5/overall/security/assets/sequence_scope_example.png)

Figure 2. Call sequence of ADD\_DOCUMENT.

Note: Most of the A12 Data Services methods request the "Model Read" scope.

#### Authorization Definition

The authorization definition connects the developer perspective with the modeler perspective and mainly contains the core definitions for the authorization control. It assigns specific permissions to each scope. These permissions then reference to specific policies, which contain rules. The rules make use of Spring Expression Language (SpEL) to define conditions. Multiple conditions can be combined by logical operators (AND, OR, NOT). Each condition must result in a boolean `true` or `false`. The scope is granting access, when the overall condition of all rules yield to `true`. If a method requires multiple scopes, they must be considered as AND-connected, i.e. they all must result in `true`.

A12 Data Services comes with a well-defined and thoroughly tested authorization definition rendering the Role-Based Access Control (RBAC). If you need Attribute-Based Access Control, i.e. more complex authorization definitions, you define them in your project-specific child authorization definitions file and include that via the property `mgmtp.a12.uaa.authorization.childAuthorizationDefinitions`. These rules are then adding up the existing rules. Please check the respective documentation of [Data Service](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#_data_services_authorization) and [UAA](https://geta12.com/docs/uaa/uaa-documentation-src/index.html#authorization-authorizationDefintion).

|  |  |
| --- | --- |
|  | Overwriting the original authorization definition can result in severe authorization flaws in your application. A12 is not responsible for any authorization issues, if the default authorization definition gets overwritten. |

#### Model, Roles, and Settings (Modeler Perspective)

The modeler perspective focuses on the last component of the authorization flow. It connects the rules of the authorization definition with the models, roles, and settings of your application.

As a modeler you have control about the roles assigned to your models. Role definitions and assignment of access rights must be defined according to the business requirements, and environment settings too.

All the controls you have here, are basically settings that do not require a developer. They can be done by a modeler, business analyst, or by devops.

#### Role-Based Access Control (RBAC)

The Role-Based Access Control (RBAC) describes access based on roles. If you want use RBAC, you must assign roles to models. Each role contains a list of access rights, defined in a file `.yaml`-file referenced by the property `mgmtp.a12.uaa.authentication.user.access-rights-resource`. When using the A12 Project Template, it is the file `./import/data/roles.yaml`. These access rights eventually are checked in the rules defined in the authorization definition when the expression `hasAccessRight()` is called.

The role names are free to define. It is recommended to use self-explaining expressions. The names of the access rights depend on the authorization definition, and therefore on the corresponding scopes and methods. In the following some access rights for example roles are provided:

* role to read documents and list documents only: `MODEL_READ` and `QUERY`
* role to create documents: `MODEL_READ` and `DOCUMENT_CREATE`
* role to update documents: `MODEL_READ` and `DOCUMENT_UPDATE`

Custom scopes and access rights require suitable entries in the child authorization definition!

##### Example roles and access rights:

A read-only user gets assigned to a role named `guest`. The guest role has only the `MODEL_READ` and `QUERY` access rights. A document model named `Persons` gets the `guest` role attributed. Then, every user of the role `guest` can query and read all documents of the type `Persons`. In the image below, user 1 and user 2 have role `guest` assigned.
An additional role `creator` gets the same access rights as the role `guest` and additionally the `DOCUMENT_CREATE` access right. A user (user 3 in the image below) of this role is then allowed to create documents of type `Person`. However, modifications or deletion of documents is not allowed. This would require additional access rights.

|  |  |
| --- | --- |
|  | When using Role-Based Access Control (RBAC) all users of a certain role have the **same permissions to all documents** of the corresponding document models. |

![RBAC example](https://geta12.com/docs/2025.06/ext5/overall/security/assets/RBAC_example.png)

Figure 3. Example of RBAC on a document model named `Persons` for two different roles.

**Deep dive examples:** The [Authorization Definition Examples](https://geta12.com/docs/overall/authorization_examples/index.html#_rbac) describe the parts of the `authorizationDefinition.json` rendering the RBAC of A12 Data Services.

#### Authorization scopes and access rights of A12 components

The scopes and access rights mentioned here are defined by A12 Data Services and its `authorizationDefinition.json` file. Additionally, other A12 components define their own specific scopes and access rights. Detailed information can be found at the specific component documentation:

* Authorization scopes of [Data Services](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#_data_services_authorization)
* Authorization scopes of [Workflows](https://geta12.com/docs/workflows/dev-docs/index.html#anchor-workflows-extension-authz)
* Authorization scopes of [User Management](https://geta12.com/docs/user_management/um-documentation-src/index.html#_services_authorization)
* The Notification Center defines various scopes for [basic authorization](https://geta12.com/docs/notification_center/notificationcenter-documentation/index.html#_authorization), the [reminder job](https://geta12.com/docs/notification_center/notificationcenter-documentation/index.html#_reminder_job_authorization), [push notification management](https://geta12.com/docs/notification_center/notificationcenter-documentation/index.html#_push_notification_authorization), and [reminders](https://geta12.com/docs/notification_center/notificationcenter-documentation/index.html#_reminder_extension_authorization).

#### RBAC Security Hints

##### CRUD operations on documents

These following access rights control CRUD operations on documents and should be given to regular application users depending on the business cases:

* `QUERY`
* `DOCUMENT_CREATE`
* `DOCUMENT_UPDATE`
* `DOCUMENT_PARTIAL_UPDATE`
* `DOCUMENT_DELETE`

##### CRUD operations on models

Except for `MODEL_READ`, regular users usually never need to create, update and delete permissions for models. These can be granted with the following access rights:

* `MODEL_CREATE`
* `MODEL_UPDATE`
* `MODEL_DELETE`

With these access rights, the role must be assigned to the models. For modeler, it is recommended to use a role with the `MODEL_MANAGE` access right, which must not be assigned to any model. This keeps the models clean and modelers don’t have to care about permissions.

##### Customization of RBAC

You can customize the authorization on all three components: code, authorization definition and roles. You can add authorization on functions in the code by using `@PreAuthorize` or `@PostAuthorize` annotation with custom scopes, if required. Custom scopes must be defined in a project-specific child authorization definitions file (`mgmtp.a12.uaa.authorization.childAuthorizationDefinitions`) with corresponding permissions, policies and rules. There you can also add custom access rights which are assigned to roles.

Projects can either use the *PermissionEvaluators* from Data Services, or the basic Spring Security annotations `@PreAuthorize` or `@PostAuthorize`.

##### Assignment of multiple roles to users

It is possible to assign multiple roles to users. During authorization checks, it is verified, that only that roles are considered, that are attributed to the model. Other roles, that are assigned to the user, but not to the model, are not considered.

##### Project Template and RBAC

When you use the Project Template and want to use the Role-Based Access Control (RBAC) only, you have to remove the property `mgmtp.a12.uaa.authorization.childAuthorizationDefinitions`. The Project Template extends the rules defined in the Data Services `authorizationDefinition.json` to enable the concept of document ownership. The additional rules are defined in the file `childAuthorizationDefinition.json`. These rules only grant access when the requesting user equals the user created the document. This is realized by Attribute-Based Access Control (ABAC, see below).

##### Role-less Based Authorization

If needed, you can disable the authorization based on models with the property `mgmtp.a12.dataservices.authorization.roleBased.enabled = false`. You then need to define your own authorization rules for models via a custom child authorization definition. Otherwise, your application models will be highly vulnerable to unauthorized CRUD operations. Details [here](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#_role_less_based_authorization).

#### Attribute-Based Access Control (ABAC)

The Attribute-Based Access Control (ABAC) considers additional attributes into the decision whether access is granted. On a document level it also allows to control read and write permissions on single attributes. It can be used to extend the RBAC rules or used without role-based authorization.

##### Getting Started

Let’s assume you use the vanilla authorization definition (RBAC) of Data Services. With that, all users of one role have identical permissions to all models and all documents. This is a quite open authorization concept. With ABAC you extend the authorization definition by a `childAuthorizationDefinition` to control the permissions on a different level than just roles. For example, you could:

* control document access based on the document creator
* control document access based on an attribute match between document and user (e.g. document and user belongs to company A)
* control READ and WRITE permissions for single properties of a document (e.g. change name but not the email address)

##### Authorization Types

UAA denotes three authorization types used for ABAC:

* **Resource Authorization:** authorization for objects, e.g. models
* **Repository Authorization:** authorization for queries, e.g. the QUERY JSON-RPC method
* **Property Authorization:** control READ and WRITE permissions for resource objects

###### Resource Authorization

Resource authorization is used to control the permissions to an entire object. The object could an A12 document, but also endpoints or functionality, basically any arbitrary Java Objects (POJO). The access could be controlled based on roles or single properties of the document. Example: The document has the property `owner`. Regular users are only allowed to access the document, when they are the owner. Users of the admin role should always access the document.

If your project only uses RBAC, you basically use the simplest form of resource authorization, where the attribute to control the authorization are the roles assigned to the model.

Data Services uses resource authorization to control access to models. Document access is only possible via the Query API, which uses Repository Authorization.

###### Repository Authorization

Repository authorization is adding authentication rules to repository queries, e.g. searches. While resource authorization is evaluating access on individual objects, repository authorization is used when querying one or more objects. To apply attribute based authorization checks on each document, would require loading each document and perform the authorization checks. This would significantly reduce the performance. Repository authorization generates a query string suitable to the query language and injects this to the query.

|  |  |
| --- | --- |
|  | With the introduction of the Query API, document access is only possible via the `QUERY` JSON-RPC method using the *Query* scope. There is no difference between loading a single document or several documents. Technically, the Query API uses both, resource authorization to control access to the document model, and repository authorization to add attribute base authorization checks into the query. For the latter, rules are defined as `repositoryPolicies` in the project-specific child authorization definitions file (`mgmtp.a12.uaa.authorization.childAuthorizationDefinitions`) and use the same syntax as the constraints of the Query API. Before executing the query, Data Services injects the authorization rules into the query as additional constraints. |

|  |  |
| --- | --- |
|  | Before the Query API was introduced it was crucial to define suitable rules for resource authorization and repository authorization individually since GET\_DOCUMENT and LIST\_DOCUMENT were using different techniques. This is not required anymore with the Query API. |

###### Property Authorization

Property authorization is used together with resource authorization to control READ and WRITE permissions of single properties of an object. Example: Users should be able to read all properties of a document, but only write some of them. E.g. the contract ID should be read only.

##### Example for ABAC

Let’s assume an application enables agents to work on contracts. Each contract is represented by a suitable A12 document defined by the document model `contract_DM`. There are agents from different companies and each contract belongs to one of these companies. The authorization requirements are as follows:

* Agents should only read and update contracts that they created.
* Agents should be able to write the contract customer details, but the contract ID is read-only.

To achieve ABAC it is now required to define suitable rules in your project-specific child authorization definitions file. There you define a *repositoryPolicy* linked to the *Query* scope adding a constraint that only documents are returned, where the creator equals the current user.

Last, to control READ and WRITE permissions to single properties of the document you define suitable rules with property authorization. The contract customer details get READ and WRITE permissions, but the contract ID only gets READ.

**Deep dive example:** The [ABAC Authorization Definition Example](https://geta12.com/docs/overall/authorization_examples/index.html#_abac) shows details and explains an example of the authorization definition to enable ABAC.

## Available Endpoints

A12 as a multi-service platform provides a huge number of service endpoints. For the overall security, it is crucial to secure them appropriately. That means that

* some endpoints must only be accessible by other, i.e., internal, services but not by users or even publicly
* some endpoints should even be deactivated in the product’s configuration because they are not needed in production environments
* finally, the remaining endpoints need to be protected by strong authentication and strict authorization controls

### A12 Endpoints

A12 [Data Services](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#header) and [UAA](https://geta12.com/docs/uaa/uaa-documentation-src/index.html#headerUAA) offer the most important endpoints of your application, since they control authentication and access to models and documents. Therefore, it is crucial to configure the [authorization](#_authorization) rules correctly. In production environments, it is strongly recommended to generally prevent write access to models, i.e. update, create, delete, or import. Changes to the models should instead happen locally or in a test environment and be deployed to production after a thorough testing phase.

If your project does not need certain endpoints, you should disable them. With the A12 default configuration only a few mandatory endpoints are enabled, following the *Secure by default* approach.

If you start with the A12 Project Template, you will have the following endpoints exposed:

| Path | Description | Component |
| --- | --- | --- |
| `/api/modelgraph` | required, returns all models that the current user can access | DS |
| `/api/v2/rpc` | required, central JSON-RPC endpoint for Data Services | DS |
| `/api/v2/attachment` | upload path for attachments | DS |
| `/cs/download/<UUID>` | download path for attachments from the content server | DS |
| `/api/uaa-authentication/selfconfigure` | returns authentication configuration, e.g. IdP address | UAA |
| `/api/uaa-authentication/currentUser` | returns details of the current user | UAA |
| `/silent_renew.html?state=<id>&session_state=<uuid1.uuid2>` | required when performing token refresh with external IdP via OIDC | UAA |
| `/api/v2/models/installer-appmodel` | returns the application model | DS |
| `/api/v2/models/<modelName>` | returns the specified model | DS |
| `/api/v2/models/<modelName>/validationCode` | returns the validation code for the specified model | DS |
| `/api/v2/internal/seed-data` | endpoint to import (`POST`), export (`GET`), or delete (`DELETE`) Seed Data of a development environment | DS |

|  |  |  |  |
| --- | --- | --- | --- |
|  | The [Seed Data](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#_seed_data) endpoints are disabled by default and must only be enabled for development environments. Make sure, not accidentally enabling them on your production environment which must run with the following properties:  ``` |  |  | | --- | --- | | ``` 1 2 3 ``` | ``` mgmtp.a12.dataservices.seed-data.import.enabled=false mgmtp.a12.dataservices.seed-data.delete.enabled=false mgmtp.a12.dataservices.seed-data.export.enabled=false ``` | ```  Environments were the Seed Data endpoints are enabled provide every user the ability to download, upload or delete the entire data of the application. |

Endpoints of previous versions:

| Path | Description | Component |
| --- | --- | --- |
| `/api/v2/docs/<documentModelName>/<documentID>` | returns the document of the specified ID; dropped in 2024.06 release | DS |
| `/api/export` | download of all documents; requires DOCUMENT\_EXPORT permission; only of enabled; [more info](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#document-export-usage); dropped in 2024.06 release | DS |
| `/api/import` | import of documents; requires DOCUMENT\_IMPORT permission; only of enabled; [more info](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#document-import-usage); dropped in 2024.06 release | DS |

Further endpoint configurations, especially disabling or enabling of non-default endpoints can be found in the component specific documentation:

* [Data Services document related configuration](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#documents-configuration)
* [RPC endpoint](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#RPC-properties)
* [Actuator endpoint](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#documents-configuration)

#### Endpoints of components

A12 components can bring their own endpoints. More information can be found at the specific component documentation:

* endpoints of [Workflows](https://geta12.com/docs/workflows/dev-docs/index.html#_endpoints)
* endpoints of [Notificaton Center](https://geta12.com/docs/notification_center/notificationcenter-documentation/index.html#notification-center-api)
* endpoints of [User Management Service](https://geta12.com/docs/user_management/um-documentation-src/index.html#rest-api)

### Spring Actuator

The Spring Actuator endpoints can disclose internal information. Therefore, the endpoints should not be available to everyone. An overview about the configuration possibilities can be found in [Actuator Properties](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#actuator-properties).

The Project Template introduced the additional access right `ACCESS_ACTUATOR` to control access for certain roles.

### Third-Party Applications

Please bear in mind to configure the third-party applications appropriately. This means that all endpoints, which are not necessary should be disabled. Available endpoints should be hidden from public traffic and only made reachable to a local network if possible. All available endpoints - and particularly those exposed to the internet - must be protected by authentication and restricted by authorization rules. No endpoint must accept default credentials.

When configuring your endpoints, please do not forget [Hazelcast](https://hazelcast.com/open-source-projects/), Kubernetes (e.g., Ingress, Service Internal Traffic Policy, see [the kubernetes security concept](https://kubernetes.io/docs/concepts/security/), [the administrative tasks to secure a cluster](https://kubernetes.io/docs/tasks/administer-cluster/securing-a-cluster/), and [the OWASP Kubernetes Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html)), [Keycloak](https://www.keycloak.org/docs/latest/server_admin/) (see below for more details), [Camunda](https://camunda.com/best-practices/securing-camunda/), and [the Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html). Disclaimer: This list is not intended to be exhaustive.

## Logging

All A12 components using the SLF4J facade for logging with the logback framework. Projects can configure this according to their needs. In general, we recommend that you use logging level INFO for production environments (those environments dealing with productive data) and DEBUG for test environments. When using DEBUG in production, you may happen to log personally identifiable information (PII, see below) and potentially violate the GDPR.

Default logback logging (e.g. not providing a logback.xml file) is vulnerable to log injection. Log injection can be prevented by using suitable filters and encoding for regular log messages and exceptions. The default logback configuration also logs usernames. To avoid that, a suitable pattern must be defined. These should not use the `%user` and `%mdc` conversion words.

### Security Monitoring

Security-relevant events should be recorded in log files and provided to respective analysis tools. It depends on the respective application which events count as security relevant. Please consider, to also include the log of your external IdP (e.g. Keycloak) to the monitoring.

Please make sure to complete the logging with all respective functionally implemented in the project and to provide the logs to the customer’s monitoring appliance, e.g. SIEM. When collecting the logs from the A12 products, please do not forget those of the third-party components.

### Privacy & GDPR

While comprehensive logging is desirable from a security of view, there is a conflict of interest with the European privacy regulation, i.e., the GDPR. The A12 components do not log any PII (except when using DEBUG). As stated above, a suitable pattern in the logback configuration avoids logging of usernames.

## Towards Production Environment

### Checklist Environment

For applications based on the Project Template:

* application is placed behind a reverse proxy
* the correct spring profiles/application properties are used
* default secrets and passwords are changed
* log level is not DEBUG
* Postgres in file database is not used
* seed data configuration is disabled ([seed data configuration](#seed-data-anchor))

### Checklist Authorization

This checklist should help to identify coarse misconfigurations. Ideally, you should be able to answer all questions with *YES*. If not, you should check this issue or ask for support.

* Do you know which authorization model is used - RBAC, ABAC, or both in combination?
* The original `authorizationDefinition.json` file is not overwritten or deleted?
* Custom authorization rules are defined in a child authorization definition?
* If ABAC is used: The repository authorization rules match the resource authorization rules?
* Model based authorization is not disabled by property `mgmtp.a12.dataservices.authorization.roleBased.enabled=false` except this is explicitly intended?
* Only high-privileged roles have MODEL\_CREATE, MODEL\_UPDATE, MODEL\_DELETE, or MODEL\_MANAGE access rights?
* The access rights DOCUMENT\_CREATE, DOCUMENT\_UPDATE, DOCUMENT\_PARTIAL\_UPDATE, DOCUMENT\_DELETE are only assigned to roles that should perform CRUD operations on documents?
* The DOCUMENT\_EXPORT access right is not used except it is explicitly needed?
* All unnecessary endpoints are disabled?

### Checklist Keycloak

The default IdP of A12 is [Keycloak](https://www.keycloak.org/). Please double-check the following [security controls](https://www.keycloak.org/docs/latest/server_admin/#mitigating_security_threats) before putting Keycloak to production.

* Only the most recent version of Keycloak is supported with security patches. Please implement a workflow to be notified about new releases and apply them as soon as possible.
* Only the login needs to be available to application users. Other APIs and particularly the management interface don’t.
* Enforce a [strong password policy](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#implement-proper-password-strength-controls).
* Enable [brute-force detection](https://www.keycloak.org/docs/latest/server_admin/index.html#password-guess-brute-force-attacks).

  + Set the max login failures between 10 and 15 (30 default) - the lower, the weaker the password policy.
  + Set permanent lockout to "OFF", otherwise DoS risks attacks arise.
  + Remark: The user is not notified that the account was locked. This is a security feature and by design.
* Enable 2-factor authentication (2FA) for users with administrative privileges.

  + You may enable 2FA for all users.
* If appropriate, enforce re-authentication from users with an active session, i.e., users need to log into Keycloak each time they want to log into a service provider. If not enforced, users with an active session are redirected immediately back to the service provider. However, this allows every user or attacker with access to the browser to perform such logins on behalf of the user.
* Disable user (self-)registration if applicable. Otherwise, activate Google re-Captcha (or any self-developed approach) to prevent mass registration and respective attacks.
* Make sure that [Keycloak only accepts valid hostnames](https://www.keycloak.org/docs/latest/server_admin/#host) in order to prevent [host header injection attacks](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/17-Testing_for_Host_Header_Injection).
* Make sure that Keycloak issues the necessary security headers (see below). This can either be done by a proxy or in the [Keycloak configuration](https://www.keycloak.org/docs/latest/server_admin/#clickjacking).
* As Keycloak is a central component of A12’s security architecture, do not forget to collect logging data for security monitoring. You can [customize the logging behaviour of Keycloak](https://www.keycloak.org/docs/latest/server_admin/#configuring-auditing-to-track-events).
* Enforce TLS for [all requests](https://www.keycloak.org/docs/latest/server_admin/#_ssl_modes). Only then the secure flag is set for the cookies.
* If you have a key vault at hand, make sure that [make Keycloak use it](https://www.keycloak.org/docs/latest/server_admin/index.html#_vault-administration).
* Enable TLS (SSL) for [email delivery](https://www.keycloak.org/docs/latest/server_admin/index.html#_email).
* Make sure to define your service providers' *Redirect URIs* as strict as possible. While this is particularly important when using [OpenID Connect (OIDC)](https://www.keycloak.org/docs/latest/server_admin/index.html#_oidc_clients), it also applies to [SAML configurations](https://www.keycloak.org/docs/latest/server_admin/index.html#_client-saml-configuration).
* Enable the option [Revoke Refresh Token](https://www.keycloak.org/docs/latest/server_admin/index.html#_timeouts). This limits the number of times a refresh token can be used and also invalidates the refresh token if a new token was utilized. Limit the session duration to a reasonable value. There are various parameters determining the session length, the most relevant are "SSO Session Idle" and "SSO Session Max". Set short lifespans (minutes) for access tokens for clients and applications to refresh their access tokens after a short amount of time. Shortening these lifespans mitigates leaked access tokens. If an admin detects a leak, they can log out all user sessions to invalidate these refresh tokens or set up a revocation policy.
* Disable the insecure [implicit flow](https://www.keycloak.org/docs/latest/server_admin/index.html#_oidc_clients) and direct access grant. If the latter is necessary, use a technical user with a strong password. Instead, use the [Authorization Code Flow](https://www.keycloak.org/docs/latest/server_admin/index.html#_oidc-auth-flows-authorization) with PKCE enabled.
* Each client adapter must be configured to [use a truststore](https://www.keycloak.org/docs/latest/server_admin/index.html#sslhttps-requirement) in order to avoid DNS-based man-in-the-middle attacks.

Finally, ATLAS provides a Keycloak audit feature. It is highly recommended to apply it regularly in order to detect faults early.

|  |  |
| --- | --- |
|  | A local authentication mode is also available for A12. In contrast to the use of an IdP, the local authentication mode should only be used for quick development and prototyping. It is not suitable for production environments! |

### Checklist Security Headers

The A12-based application should - like all web apps - issue standard security headers in order to increase the communication
and application security. We document a number of generally advisable headers here. In most cases, the A12 app is not directly exposed to the Internet or Intranet but proxied by a web server (Apache, nginx), a load balancer, or a web application firewall (WAF). Some of the following headers may be issued by those reverse proxies instead of the application.

#### Cross-Origin Resource Sharing (CORS)

[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) weakens the same-origin policy and allows your application to share your users' data with third-party applications. Please only use CORS with high care because it may disclose private information publicly and
create a severe security hole by configuration. If in doubt, please approach a security expert before releasing a CORS policy.

**Recommendation:** Use only if absolutely necessary and make a security expert review the policy and implementation before going live. For a more tailored CORS policy, you can configure settings through UAA as described in [Cross-Origin Resource Sharing (CORS)](https://geta12.com/docs/UAA/uaa-documentation-src/index.html#cross_orgin).

#### Content Security Policy (CSP)

The [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) is a powerful feature to control the content sources of web applications. It defines a policy per web document, i.e. per HTML request/response, and makes the browser enforce the defined policy. The policy should at least define a framing policy, e.g. `Content-Security-Policy: frame-ancestors 'none';` to mitigate Click-jacking attacks. The stricter the policy, the better is the protection against injection attacks.

The following CSP is suitable for the Project Template running locally and could be used as a basis for the CSP of your application:

```
Content-Security-Policy: default-src 'self' localhost:8089; script-src 'unsafe-eval' 'self'; connect-src 'self' localhost:8089; img-src 'self' localhost:8082; style-src 'self' 'unsafe-inline'; frame-ancestors 'self'; form-action 'self'; font-src 'self' data:;
```

For productive usage you have to replace `localhost:8089` by the hostname of your IdP and `localhost:8082` by the hostname of your Content Store. If all services are behind a reverse proxy and reachable via the same domain, you can simply remove it from the CSP.

**Recommendation:** Always apply the strictest CSP suitable for your application.

#### Referrer Policy

The [Referrer Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) controls the amount of information sent by the browser upon loading page content like images, JavaScript files, style sheets and iframes. By default, browsers used to send the complete URL of the page including query parameters. The Referrer Policy can trim the information to the bare origin or even suppress the `Referer` header completely.

**Recommendation:** The Referrer Policy may increase the privacy level of your users. Please discuss with the customer and decide on project level whether to use it.

#### Strict Transport Security (HSTS)

[Strict Transport Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) is a basic security header to protect the communication link against so-called TLS-stripping attacks. The header expects a numeric parameter that defines its validity time.

**Recommendation:** Unless there are very good reasons not to do it, issue the header like `Strict-Transport-Security: max-age=31536000;`. You may add the `includeSubDomains` flag after making sure that you do not create negative side effects.

#### X-Content-Type-Options

The [X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options) header prevents the browser from misinterpreting the content type of served files.

**Recommendation:** Always issue `X-Content-Type-Options: nosniff` and be happy.

### Docker

With release 2024.06 A12 provides backend services as Docker images. If you want to run them in your environment, you want to be sure that it maintains the security level of your environment. Therefore, we explain which security best practices we apply in the [Docker Security chapter](https://geta12.com/docs/overall/docker_security/index.html).

Please also be referred to the component specific pages regarding Docker images:

* [Data Services Docker Image](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#dataservices-docker-images)

Please note, that the examples provided there, are not meant for productive usage. Secrets must be changed and `LOCAL` authentication must not be used.

## References

Security sections of A12 components:

* [Data Services](https://geta12.com/docs/data_services/dataservices-documentation-src/index.html#a12-security)
* [UAA](https://geta12.com/docs/uaa/uaa-documentation-src/index.html#_other_security_aspects)
* [Notification Center](https://geta12.com/docs/notification_center/notificationcenter-documentation/index.html#web-notification-authorization)
* [Workflows](https://geta12.com/docs/workflows/dev-docs/index.html#_security)
