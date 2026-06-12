---
source: https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/index.html
category: user_management
docid: um-documentation-src
scraped: 2026-06-12
---

# UAA - User Management

|  |  |
| --- | --- |
|  | This documentation belongs to an A12 Enterprise Component which is not part of the Open Source offering (A12 Community Edition). Please feel free to browse the documentation and learn more about how you can use this A12 component in your project. Learn more about the benefits from an A12 Enterprise Subscription on [the Editions & Licensing page](https://geta12.com/#/editions-licensing). |

## Introduction

**UAA User Management** is a library for managing user

It can be used as:

* stand-alone (A12 server application): Only models belong to User Management are store on database.
* embedded (A12 data service): The business and user models are store on the same database.

It allows to bidirectional synchronization user with Keycloak as default.

It provides an innovative UI to overcome the disadvantages of IDP (Keycloak) and extend other user management features.

**It is divided into several modules**

* [uaa-user-management-user](#user-management-user) - POJOs which are supported.
* [uaa-user-management-service](#user-management-service) - Documents, POJOs resource handling and resource sync with Keycloak.
* [uaa-user-management-keycloak-extension](#user-management-keycloak-extension) - Handling Keycloak event and data event sync with User Management Service.
* [uaa-user-management-rest-client](#user-management-rest-client) - Extensible JAVA REST client with UAA stack and support for UM end-points.
* [uaa-user-management-module](#user-management-module) - A12 javascript UM modules.
* [user-management-tool](#user-management-tool) - The helper tool for configuring user management keycloak extension.

|  |  |
| --- | --- |
|  | User Management Services is a Data Services extending, it uses Kernel library for data validation. It is good know how it works, see [GetA12 Kernel Docs](https://geta12.com/docs/kernel/kernel-documentation-dev/index.html#_getting_started_using_code_generated_by_kernel_at_runtime). |

## User Management User

This module provide complete structure of User object.
Use this object you can work with User APIs POJO from User Management Service or User Management Rest Client (e.g, CRUD for User).

The user object can be further extended. When it’s necessary to extend it’s recommended to extend from `ExtendedUser`.

### Overview

Following class diagram illustrates inheritance and all properties.

[![User class diagram](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/images/user_management/user-pojos.png)](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/images/user_management/user-pojos.png)

Figure 1. User class diagram

### Getting Started

Add following dependency to your POM:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` <dependency>     <groupId>com.mgmtp.a12.uaa</groupId>     <artifactId>uaa-user-management-user</artifactId>     <version>9.2.2</version> </dependency> ``` |
```

|  |  |
| --- | --- |
|  | Organization, Role and AccessRight does not support by default. |

### Custom User Structure

In the following example we create a new ProjectUser class which extends ExtendedUser for some new fields such as email, password, salt.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 ``` | ``` @JsonIgnoreProperties(ignoreUnknown = true) public class ProjectUser extends ExtendedUser {  	private String email; 	private String password; 	private String salt;  	public ExampleUser() { 	}  	public String getEmail() { 		return email; 	}  	public void setEmail(String email) { 		this.email = email; 	}  	public String getPassword() { 		return password; 	}  	public void setPassword(String password) { 		this.password = password; 	}  	public String getSalt() { 		return salt; 	}  	public void setSalt(String salt) { 		this.salt = salt; 	}  } ``` |
```

From now, it is possible to use this ProjectUser as a new type under User Management Service or User Management Rest Client.

## User Management Services

### Overview

uaa-user-management-service is an extended Data Services for User management domain.

### User Management Service Features Available

* Faster and more effective in searching user information.
* Default Document, Form, Overview models are provided.
* Basic CRUD function for User/Role/AccessRight.
* User/Role synchronization with Keycloak is provided.
* Download Realm Role Mapping data as Yaml file.
* Upload Realm Role Mapping data as Yaml file.
* Clone an existing Role.
* Rename an existing Role (Support when Data synchronization is disabled).
* Out of the box solution for managing user data extension.
* Multiple and dynamic realms support (authentication, data filtering).

### User Management Service Business Document Models

It supports 2 different User Structure

#### User, Role and AccessRight

![userAndOrgAndRoleAndAcessRight](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/images/user_management/userAndOrgAndRoleAndAcessRight.png)

* Document Model Structure

1. User is managed by document model [DomainUserManagement.json](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/organizationUnitRole/DomainUserManagement.json).
2. Role is managed by document model [Role-DM.json](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/organizationUnitRole/Role-DM.json).
3. AccessRight is managed by document model [AccessRight-DM.json](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/organizationUnitRole/AccessRight-DM.json).
4. Role and AccessRight of relationship is managed by relationship model. AccessRight is managed by document model [Role-AccessRight-RM.json](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/organizationUnitRole/Role-AccessRight-RM.json).
5. OrganizationUnit can bring more user case for project.
6. Role can belong to Client [OPTIONAL].

* Prepare your OrganizationUnit

UserManagementService does not introduce any models and documents relating to OrganizationUnit, you need to manage these document and model from your side.

To allow UserManagementService display OrganizationUnit document(s), you need following these steps:

1. From the header of your Document model. Provide an annotation `uaa_um_orga_unit_type` with value `true`.
2. Select a field which want to show on dropdown element. Provide an annotation `uaa_um_orga_unit_label` with value is `name`.

* Data assignment

1. AccessRight assignment to Role is done by selected/unselected element.
2. Role assignment to User is done by dropdown element.
3. OrganizationUnit assignment to User is done by dropdown element.
4. Client assignment to Role is done by dropdown element [OPTIONAL].

* Prepare your Client (Optional):

UserManagementService does not introduce any models or documents relating to Client, you need to manage these document and model from your side.

To allow UserManagementService display Client document(s), you need following these steps:

1. From the header of your Client Document model. Provide an annotation `uaa_um_client_role_document` with value `true`.
2. Select a field which want to show on dropdown element. Provide an annotation `uaa_um_client_name_label` with value is `name`.

See more at [User Management Service Configuration](#user-management-configuration-profiles-setup-model).

|  |  |
| --- | --- |
|  | 1. The AccessRight is managed by User Management Service, not by IDP 2. Due to ticket <https://github.com/keycloak/keycloak/issues/23199>, the assignment of bundle Role selection is not possible but does not affect to assignment of single Role selection. |

#### User

![userAndRole](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/images/user_management/userAndRole.png)

* Document Model Structure

User is managed by document model [DomainUserManagement.json](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/DomainUserManagement.json).

* Data assignment

Role assignment to User is done by text-box element.

See more at [User Management Service Configuration](#user-management-configuration-profiles-setup-user-model).

### User Management Security Applied

#### Services Authentication

User Management Service can be used with Oauth2 as default or Local authentication type.

Authentication is completely handled by UAA, so please refer to appropriate section of the UAA documentation.

#### Services Authorization

UM introduced a new `user-management-authorization.json` file for securing our APIs. It uses

```
mgmtp.a12.uaa.authorization.child-authorization-definitions
```

for integrating with UAA.

|  |  |
| --- | --- |
|  | If you have a custom configuration for the key `mgmtp.a12.uaa.authorization.child-authorization-definitions` then make sure our file `user-management-authorization.json` should be added as well. |

**user-management-authorization.json**

| Scope name | Description |
| --- | --- |
| `Query` | Check that current login user has proper role and attribute(s) compare with document fields (e.g, username, idp or realm’s identifier). |
| `Create User Data Model` | Check that current login user has proper role. |
| `Read User Data Model` | Check that current login user has proper role or attribute(s) compare with document fields (e.g, username, idp or realm’s identifier). |
| `Read User Document Spec` | Check that current login user has proper role or attribute(s) compare with document field (e.g, username). |
| `Update User Data Model` | Check that current login user has proper role. |
| `Delete User Data Model` | Check that current login user has proper role. |
| `Query User Data Model` | Check that current login user has proper role. |
| `Get User Document Model` | Check that current login user has proper role. |
| `Get User Model Validation Code` | Check that current login user has proper role. |
| `RelativePath` | Check that current login user has proper role. |
| `Create Role Document` | Check that current login user has proper role. |
| `Read Role Document` | Check that current login user has proper role. |
| `Update Role Document` | Check that current login user has proper role. |
| `Delete Role Document` | Check that current login user has proper role. |
| `Download Role AccessRight Mapping As Yaml File` | Check that current login user has proper role. |
| `Upload Role AccessRight Mapping Yaml File` | Check that current login user has proper role. |
| `Download Users As Yaml File` | Check that current login user has proper role. |
| `Upload Users Yaml File` | Check that current login user has proper role. |
| `Download User Document Model` | Check that current login user has proper role. |
| `Create Role Document` | Check that current login user has proper role. |
| `afterCreateUser` | Check that current login user is not idp user technical. |
| `afterUpdateUser` | Check that current login user is not idp user technical. |
| `afterDeleteUser` | Check that current login user is not idp user technical. |
| `afterCreateRole` | Check that current login user is not idp user technical. |
| `afterDeleteRole` | Check that current login user is not idp user technical. |

The authorization uses [dynamic realm selected](#multiple-realm-security-perspective) for filtering the data.

### User Management APIs

#### Public API

##### UserPOJOService

To provide methods to work with A12 repository by User Object.
Such as create, read, update, delete and query User.

##### RolePOJOService

To provide methods to work with A12 repository by Role Object.
Such as create, read, update, delete Role.

##### UserDocumentService

To provide methods to work with User Document Model `DomainUserManagement`
Such as initialize user document, read user document, get document model, get validation code, and download document model.

UAA User Management is supported to create the User Document by using document template by using:

```
mgmtp.a12.uaa.user-management.um.user-document-template-resource
```

In case the User Document resource is null it will initialize an empty User Document.

##### IUserDocumentConversionService

The interface supports converting the User object back and forth to the User Document (A12).

See details on how to implement and when you should use [IUserDocumentConversionService](#user-document-conversion).

##### IUserDocumentCustomizationService

The interface that provides the extension methods allows customer projects can use to customize the user document before and after saving them into the database.

See details on how to implement and when you should use [IUserDocumentCustomizationService](#user-document-customization).

##### IUserDocumentValidationService

The interface that provides the extension methods allows customer projects can use to validate the user document before saving them into the database.

See details on how to implement and when you should use [IUserDocumentValidationService](#user-document-validation).

##### ExtendedUserDocumentConversionService

The default implementation of extended User object and User Document conversion.
This class implements from the `IUserDocumentConversionService` interface, in case you have a custom user you can use this method to enrich your User object.

See example to use [ExtendedUserDocumentConversionService](#extended-user-document-conversion).

##### IDPTrustedIssuersStorage

To check the inputted issuerURI with data from this stored, UM will do the token verification flow or return 401 immediately.

By using `storageTrustedIssuer` or `removeTrustedIssuer` you can enable or disable the JWT verification from specific URI (realm).
By default, UM will enable the JWT verification to below URI(s) if it is defined.

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` spring.security.oauth2.resource-server.jwt.issuer-uri #OR mgmtp.a12.uaa.authentication.oauth2.resourceserver.tenants[{index}].jwt.issuer-uri ``` |
```

|  |  |
| --- | --- |
|  | The `loadAll` is trigger by every request for token verification then please make sure you are not fetching data directly from Database or file system in order to avoid performance issues. These data should be cached and stay forever until they are force to delete otherwise server will reject every request. |

##### IDPSynchronisationConfigurationStorage

By lookup the data from this storage UM can initialize a keycloakAdminClient which can work with Keycloak Server for synchronizing for user/role from UM and Keycloak.

By using `storeSyncConfiguration` or `removeSyncConfiguration` you can enable or disable the data synchronizing for specific IDP realm.

By default, UM will enable the data synchronizing to below IDP realm if it is defined.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.uaa.user-management.idp-registration.{idp-registration-key}.* ``` |
```

##### AllowedOriginsStorage

By lookup the data from this storage UM can allow or reject the request from specific origin.

By using `storeOrigin` or `removeOrigin`, you can allow or disable the request from specific origin.

By default, UM will enable the request from specific origin if it is defined.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.uaa.authentication.cors.allowed-origins ``` |
```

|  |  |
| --- | --- |
|  | In-case you provide a customize code then `loadAll` should not fetch data directly from Database or file system in order to avoid performance issues. |

##### IJwtDecoderConfiguration

To override the JWK Set URI which used to download the public key for token signature verifying
To override the algorithms for token signature verifying

|  |  |
| --- | --- |
|  | It only works with [Dynamic Realms Configuration feature](#user-management-run-time-configuration) |

##### MultipleRealmsConfiguration

If the UM service works with multiple realms then implement this class is required, by implement it you can allow what is data that user can see and what is realm that data will be sync.

* **getIdpRegistrationKey()** is a unique IDP information which current login user belong to.
* **getUserDocumentIdpIdentifierField()** is a field which contains the realm (idp) identifier value of User document model (e.g. user.tenantId).
* **getRoleDocumentIdpIdentifierField()** is a field which contains the realm (idp) identifier value of Role document model (e.g. root.tenantId).
* **getAccessRightDocumentIdpIdentifierField()** is a field which contains the realm (idp) identifier value of AccessRight document model (e.g. root.tenantId).
* Only documents which idp-identifier-field’s value equal {documentsIdpIdentifier} which resolved at run-time (by configuration) will be returned.

##### IIDPService

The interface that provides some required methods to work with user from IDP.

##### IIDPRoleService

The interface that provides some required methods to work with role from IDP.

##### IDPClientServiceRemoveEvent

When you are override UM default by implement `IDPSynchronisationConfigurationStorage` interface then this event should be fired inside `removeSyncConfiguration` method.

##### IIDPExceptionHandler

The interface that allows the customer projects to handle IDP exceptions.

##### IUserIDPConversionService

The interface that supports converting the User object to User IDP.

See details on how to implement and when you should use [IUserIDPConversionService](#user-idp-conversion).

##### IUserIDPCustomizationService

The interface that provides the extension methods allows customer projects can customize the User IDP after create and update user.

See details on how to implement and when you should use [IUserIDPCustomizationService](#user-idp-customization).

##### DefaultUserIDPCustomizationService

This class provides the default implementation of `IUserIDPCustomizationService` interface.

See example to use [DefaultUserIDPCustomizationService](#default-user-idp-customization).

##### ExceptionKeys

The interface extends *com.mgmtp.a12.dataservices.exception.ExceptionKeys* class from A12 Data Services.
This interface defines some keys for handling exception messages.

##### ExceptionMessages

This interface defines messages commonly for handling exception messages.

#### REST API

These APIs will be handled data sync from IDP and some of the requests from front-end side (e,g upload role access-right mapping yaml file)

|  |  |  |  |
| --- | --- | --- | --- |
|  | These methods are executed within a JPA transaction. Thus, if an error occurs during execution, all changes are rolled back in the database.  Please note that this does not apply to changes made to the Solr index. The Solr clean up could be effected to performance that why we do not supported it as out of the box The project must take care of cleaning up the Solr index in case an error occurred during execution.  You can integrate your code to provide a transaction wrapper for these APIs by following this approach (Just our suggestion example, but you can adjust it based on your scenario).  `RollbackPostProcessor` is a suggestion from DataServices team.  ``` |  |  | | --- | --- | | ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` @Component @Aspect public class UMPOJOApiDirtyHandler { 	@Inject 	private RollbackPostProcessor rollbackPostProcessor;  	@Around("execution(* com.mgmtp.a12.uaa.usermanagement.um.rest.*.*(..))") 	public Object handleMethodExecution(ProceedingJoinPoint joinPoint) throws Throwable { 		try { 			return joinPoint.proceed(); 		} catch (Exception e) { 			rollbackPostProcessor.execute(); 			throw e; 		} finally { 			rollbackPostProcessor.clearCaches(); 		} 	} } ``` | ``` |

##### UserPOJOController

The public APIs to provide CRUD methods for User document as POJO

UAA provides them as a [REST API](#rest-api).

###### Create user

|  |  |
| --- | --- |
| Name | Create a user from A12 Services by User object. |
| Description | Endpoint allows creating a user. |
| Method | POST |
| Url | /user/create |
| Headers | **Content-Type:** application/json  **Accept:** application/json |
| Request Body | ``` |  |  | | --- | --- | | ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 ``` | ``` {   "id": "fake user",   "username": "stanford83",   "firstName": "Lizzie",   "lastName": "Abbott",   "email": "dallas_dare@gmail.com",   "enabled": false,   "role": {     "uma_authorization": "CREATE",     "offline_access": "CREATE"   },   "extension": {     "department": "Beauty",     "job_title": "Regional Intranet Officer",     "branchName": "LLC",     "companyName": "Abbott LLC",     "rights": "userManagementAdmin:MODEL_READ,MODEL_WRITE,DOCUMENT_READ,DOCUMENT_WRITE"   } } ``` | ``` |
| Parameters |  |
| Notes | Id and username are required. This sample uses the `ExtendedUser`. |

###### Read user

|  |  |
| --- | --- |
| Name | Read a user from A12 Services as a User object. |
| Description | Endpoint allows loading a user by a username. |
| Method | GET |
| Url | /user/read/{username} |
| Headers | **Content-Type:** application/json  **Accept:** application/json |
| Parameters | **username:** Username |
| Notes |  |

###### Update user

|  |  |
| --- | --- |
| Name | Update a user from A12 Services by User object. |
| Description | Endpoint allows updating a user. |
| Method | PUT |
| Url | /user/update |
| Headers | **Content-Type:** application/json  **Accept:** application/json |
| Request Body | ``` |  |  | | --- | --- | | ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 ``` | ``` {   "id": "ce31206d-7aab-4fdc-aa6b-3320936c3e20",   "username": "stanford83",   "firstName": "Brycen",   "lastName": "Rohan",   "email": "angelina52@yahoo.com",   "enabled": true,   "role": {     "offline_access": "DELETE",     "uma_authorization": "DELETE",     "userManagementAdmin": "CREATE"   },   "extension": {     "department": "Books",     "job_title": "Legacy Research Specialist",     "branchName": "LLC",     "companyName": "Bayer LLC",     "rights": "userManagementAdmin:MODEL_READ,MODEL_WRITE,DOCUMENT_READ,DOCUMENT_WRITE"   } } ``` | ``` |
| Parameters |  |
| Notes | Id and username are required. This sample uses the `ExtendedUser`. |

###### Delete user

|  |  |
| --- | --- |
| Name | Read a user from A12 Services as a User object. |
| Description | Endpoint allows deleting a user by a username. Users can not delete themself |
| Method | DELETE |
| Url | /user/delete/{username} |
| Headers | **Accept:** \*/\* |
| Parameters | **username:** Username |
| Notes |  |

###### Query user

|  |  |
| --- | --- |
| Name | Query user by the path. |
| Description | Endpoint allows query users by the path. |
| Method | GET |
| Url | /user/query |
| Headers | **Content-Type:** application/json  **Accept:** application/json |
| Parameters | **path:** String path pattern: *parent.child1.child2*. E.g: user.username  **value:** String value needs to query. |
| Notes |  |

##### UserDocumentController

These are public APIs for User Management.
The customer projects can use this interface with default implementation or self-implementing it specifically.

UAA provides them as a [REST API](#rest-api).

###### Read a user from A12 Services.

|  |  |
| --- | --- |
| Name | Read a user from A12 Services. |
| Description | Endpoint allows loading a user from database with document id. |
| Method | GET |
| Url | /user-management/loadUserDocument/{userDocumentId} |
| Headers | **Content-Type:** application/json  **Accept:** application/json |
| Parameters | **userDocumentId:** DOCUMENT\_ID - User Document ID |
| Notes |  |

###### Get URL change password.

|  |  |
| --- | --- |
| Name | Read a user from A12 Services. |
| Description | The endpoint allows getting the password manager URL. |
| Method | GET |
| Url | /user-management/getChangePasswordUrl |
| Headers | **Accept:** \*/\* |
| Parameters |  |
| Notes |  |

###### Get document model.

|  |  |
| --- | --- |
| Name | Get document model. |
| Description | Endpoint allows getting the document model as a JSON. |
| Method | GET |
| Url | /user-management/getDocumentModel |
| Headers | **Content-Type:** application/json  **Accept:** application/json |
| Parameters |  |
| Notes |  |

###### Get validation code.

|  |  |
| --- | --- |
| Name | Get validation code. |
| Description | Endpoint allows getting the validation code as a Javascript. |
| Method | GET |
| Url | /user-management/getValidationCode |
| Headers | **Content-Type:** application/javascript  **Accept:** application/javascript |
| Parameters |  |
| Notes |  |

###### Download Document Model.

|  |  |
| --- | --- |
| Name | Download document model. |
| Description | Endpoint allows downloading the document model as a JSON file. |
| Method | GET |
| Url | /user-management/downloadDocumentModel |
| Headers | **Content-Type:** application/json  **Accept:** application/json |
| Parameters |  |
| Notes |  |

##### RolePOJOController

The public APIs to provide CRUD methods for Role document as POJO

###### Create role

|  |  |
| --- | --- |
| Name | Create a Role document from Role Pojo object |
| Description | Allow to create a Role document from Role Pojo object |
| Method | POST |
| Url | /role/create |
| Headers | **Content-Type:** application/json  **Accept:** application/json |
| Request Body | ``` |  |  | | --- | --- | | ``` 1 2 3 4 5 ``` | ``` {   "id": "{uuid}",   "name": "admin",   "description": "This is an administrator" } ``` | ``` |
| Parameters |  |
| Notes | name is required and name is unique. |

###### Update role

|  |  |
| --- | --- |
| Name | Update a current Role document from Role Pojo object |
| Description | Allow to update a current Role document from Role Pojo object |
| Method | PUT |
| Url | /role/update |
| Headers | **Content-Type:** application/json  **Accept:** application/json |
| Request Body | ``` |  |  | | --- | --- | | ``` 1 2 3 4 5 ``` | ``` {   "id": "{uuid}",   "name": "admin",   "description": "This is an update for administrator" } ``` | ``` |
| Parameters |  |
| Notes | name is required. |

###### Read role

|  |  |
| --- | --- |
| Name | Read a current Role document as a Role Pojo object |
| Description | Allow to read a current Role document as Role Pojo object by roleName |
| Method | GET |
| Url | /role/read/{roleName} |
| Headers | **Content-Type:** application/json  **Accept:** application/json |
| Parameters | **roleName:** roleName |
| Notes |  |

###### Delete role

|  |  |
| --- | --- |
| Name | Delete a current Role document |
| Description | Allow to delete a current Role document |
| Method | DELETE |
| Url | /role/delete |
| Request Body | ``` |  |  | | --- | --- | | ``` 1 2 3 4 5 6 ``` | ``` {   "id": "{uuid}",   "name": "admin",   "client": "name client",   "description": "This is a description" } ``` | ``` |
| Headers | **Accept:** \*/\* |
| Parameters |  |
| Notes |  |

###### Download role accessRights mapping as yaml file

|  |  |
| --- | --- |
| Name | download role accessRight mapping yaml file |
| Description | Allow to download role accessRight mapping as yaml file format |
| Method | GET |
| Url | /role/accessRightMapping |
| Headers |  |
| Parameters |  |
| Notes |  |

###### Upload role accessRights mapping yaml file

|  |  |
| --- | --- |
| Name | Upload role accessRight mapping yaml file |
| Description | Allow to upload role accessRight mapping yaml file |
| Method | PUT |
| Url | /role/accessRightMapping/upload |
| Headers | **Accept:** multipart/form-data |
| Parameters | **file:** roleMappingYaml |
| Notes |  |

|  |  |
| --- | --- |
|  | Because organizationUnit can be any models which come from customer project. We can’t have save/delete/edit organizationUnit in User Management service  Because accessRight and role is model as relationship. We can not have relationship assignment in User Management service. |

#### RPC Operations

The User Management also provides the JSON-RPC operations functionality: **ADD\_USER, DELETE\_USER, MODIFY\_USER, LIST\_USERS**.

#### Events

##### UserAfterCreateEvent

This event is triggered after the user is created or synchronized with the IDP if the IDP is enabled.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.uaa.usermanagement.um.a12uaa.events.UserAfterCreateEvent<U extends User>` |
| triggers | `com.mgmtp.a12.uaa.usermanagement.um.a12internal#afterCreateUser` |

##### UserAfterUpdateEvent

This event is triggered after the user is updated or synchronized with the IDP if the IDP is enabled.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.uaa.usermanagement.um.a12uaa.events.UserAfterUpdateEvent<U extends User>` |
| triggers | `com.mgmtp.a12.uaa.usermanagement.um.a12internal#afterUpdateUser` |

##### UserAfterDeleteEvent

This event is triggered after the user is deleted or synchronized with the IDP if the IDP is enabled.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.uaa.usermanagement.um.a12uaa.events.UserAfterDeleteEvent<U extends User>` |
| triggers | `com.mgmtp.a12.uaa.usermanagement.um.a12internal#afterDeleteUser` |

### Data flow Diagram

#### DataServices RPC Operations

You can manage the User Document by using DataServices Operations, here is a data flow and extend point for your custom code.

[![workflow for working with DS RPC](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/images/user_management/um_rpc_flow.png)](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/images/user_management/um_rpc_flow.png)

Figure 2. RPC Workflow

* (1) Customize User Document before saving.
  See [IUserDocumentCustomizationService](#user-document-customization).
* (2) Validate User Document before saving.
  See [IUserDocumentValidationService](#user-document-validation).
* (3) Convert User Document to User object.
  See [IUserDocumentConversionService](#user-document-conversion).
* (4) Convert User object to User IDP.
  See [IUserIDPConversionService](#user-idp-conversion).
* (5) Customize User IDP after create, update or delete the user in IDP is completed.
  See [IUserIDPCustomizationService](#user-idp-customization).
* (6) Customize User Document after saving.
  See [IUserDocumentCustomizationService](#user-document-customization).

#### UserManagementServices REST POJO APIs

You can manage the User Document by using UserManagement REST APIs, here is a data flow and extend point for your custom code.

[![workflow for working with rest api](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/images/user_management/um_rest_api_flow.png)](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/images/user_management/um_rest_api_flow.png)

Figure 3. Rest API Workflow

* (1) Convert User object to User Document.
  See [IUserDocumentConversionService](#user-document-conversion).
* (2) Customize User Document before saving.
  See [IUserDocumentCustomizationService](#user-document-customization).
* (3) Validate User Document before saving.
  See [IUserDocumentValidationService](#user-document-validation).
* (4) Convert User Document to User object.
  See [IUserDocumentConversionService](#user-document-conversion).
* (5) Convert User object to User IDP.
  See [IUserIDPConversionService](#user-idp-conversion).
* (6) Customize User IDP after create, update or delete the user in IDP is completed.
  See [IUserIDPCustomizationService](#user-idp-customization).
* (7) Customize User Document after saving.
  See [IUserDocumentCustomizationService](#user-document-customization).

### Getting Started With Local

If you intended to start the Service to see how the UI models and functions look like (bidirectional synchronize data between User Management Service and IDP (Keycloak) is ignored).
We suggest using LOCAL authentication from UAA.

|  |  |
| --- | --- |
|  | LOCAL authentication type is mainly intended for development purposes not for production usage! |

Do following steps:

* Download the jar file

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ```     <dependency>         <groupId>com.mgmtp.a12.uaa</groupId>         <artifactId>uaa-user-management-service</artifactId>         <version>9.2.2</version>     </dependency> ``` |
```

* Prepare admin user yaml

admin.yaml

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` username: "admin" password: "{{YOUR_PASSWORD}}" authorities:   - "userManagementAdmin" ``` |
```

* Prepare custom application properties

We assume that you followed [this](#integrate-a12-client) for user management client setup.

application.properties

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` # Spring boot server.port=8082  #Authentication mgmtp.a12.uaa.authentication.types=LOCAL mgmtp.a12.uaa.authentication.cors.allowed-origins=http://localhost:8081 mgmtp.a12.uaa.authentication.context-path=/api mgmtp.a12.uaa.authentication.user.local-config.user-resources={{YOUR_USER_YAML_FILE_RESOURCE}} mgmtp.a12.uaa.authentication.jwt.secret={{YOUR_JWT_SECRET}} mgmtp.a12.uaa.authentication.client-selfconfiguration.application-base.url=http://localhost:8082/api mgmtp.a12.uaa.authentication.client-selfconfiguration.uaa-base.url=http://localhost:8082/api #Data Services mgmtp.a12.dataservices.server.context-path=/api ``` |
```

* Start the UM service application

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` java -jar .\uaa-user-management-service-9.2.2.jar --spring.profiles.active=dataservices-uaa,dataservices-embedded_solr,dataservices-embedded_h2,dataservices-rpc,um_uaa,um ``` |
```

|  |  |
| --- | --- |
|  | The embedded h2 database is applied. |

### Getting Started With Oauth2

Oauth2 authentication will allow bidirectional data synchronization between User Management Service and IDP (Keycloak).

#### Prerequisites

1. Please make sure you have a right keycloak instance with proper realm setup. Refer to [keycloak](#keycloak) for more detail.
2. Please make sure you have a right client instance with proper configuration setup. Refer to [this](#integrate-a12-client) for more detail.

Do following steps:

* Prepare your application properties

application.properties

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 ``` | ``` # Spring boot server.port=8082  # UAA mgmtp.a12.uaa.authentication.cors.allowed-origins=http://localhost:8081 mgmtp.a12.uaa.authentication.context-path=/api # Configuration for downloading self-configure in front-end mgmtp.a12.uaa.authentication.client-selfconfiguration.application-base.url=http://localhost:8082/api mgmtp.a12.uaa.authentication.client-selfconfiguration.uaa-base.url=http://localhost:8082/api mgmtp.a12.uaa.authentication.client-selfconfiguration.oauth2.public-client.client-id=user_management_spa_client mgmtp.a12.uaa.authentication.client-selfconfiguration.oauth2.public-client.realm-name=user-management mgmtp.a12.uaa.authentication.client-selfconfiguration.oauth2.public-client.idp-base.url=http://localhost:9090 mgmtp.a12.uaa.authentication.client-selfconfiguration.oauth2.public-client.login-relative.url= mgmtp.a12.uaa.authentication.client-selfconfiguration.oauth2.public-client.login-redirect-relative.url= mgmtp.a12.uaa.authentication.client-selfconfiguration.oauth2.public-client.logout-redirect-relative.url= mgmtp.a12.uaa.authentication.client-selfconfiguration.oauth2.public-client.silent-redirect-relative.url=silent_renew.html mgmtp.a12.uaa.authentication.client-selfconfiguration.oauth2.public-client.token-exchange-relative.url=token mgmtp.a12.uaa.authentication.client-selfconfiguration.oauth2.public-client.sso-configuration.username-xpath=//input[@name='username'] mgmtp.a12.uaa.authentication.client-selfconfiguration.oauth2.public-client.sso-configuration.password-xpath=//input[@name='password'] mgmtp.a12.uaa.authentication.client-selfconfiguration.oauth2.public-client.sso-configuration.login-button-xpath=//input[@name='login'] #Data Services mgmtp.a12.dataservices.server.context-path=/api # UM mgmtp.a12.uaa.user-management.idp-registration.[user-management].idp-extension-technical.username={BASE_ON_YOUR_USER_TECHNICAL_SETUP} mgmtp.a12.uaa.user-management.idp-registration.[user-management].user-management-technical.username={BASE_ON_YOUR_USER_TECHNICAL_SETUP} mgmtp.a12.uaa.user-management.idp-registration.[user-management].user-management-technical.password={BASE_ON_YOUR_USER_TECHNICAL_SETUP} ``` |
```

* Start the UM service application

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` java -jar .\uaa-user-management-service-9.2.2.jar --spring.profiles.active=dataservices-uaa,dataservices-embedded_solr,dataservices-embedded_h2,dataservices-rpc,um_uaa,um ``` |
```

|  |  |
| --- | --- |
|  | For production setup, please get advice from the deployment team (e.g. do not use database as embedded application, etc). |

### Static Configuration

#### Configuration

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.user-management.idp-registration.[{idp-registration-key}].synchronize.enabled` | `true` | `Enable it, allow User Data be synchronized to IDP` |  |
| `mgmtp.a12.uaa.user-management.idp-registration.[{idp-registration-key}].documents-idp-identifier` | `user-management` | `This a unique for each realm or IDP. Only the documents which belong to the proper realm or IDP will be loaded by UM (security perspective)` | It is optional if IDP synchronize is disabled |
| `mgmtp.a12.uaa.user-management.idp-registration.[{idp-registration-key}].user-management.url` | `` | `IDP Server URL for synchronize data with IDP` | It is optional if IDP synchronize is disabled |
| `mgmtp.a12.uaa.user-management.idp-registration.[{idp-registration-key}].realm-name` | `` | `IDP Realm name for synchronize data with IDP` | It is optional if IDP synchronize is disabled |
| `mgmtp.a12.uaa.user-management.idp-registration.[{idp-registration-key}].idp-extension-technical.username` | `` | `This to avoid a cycle synchronization between IDP and UM.` | It is optional if IDP synchronize is disabled |
| `mgmtp.a12.uaa.user-management.idp-registration.[{idp-registration-key}].user-management-technical.username` | `` | `The UM technical for synchronize data with IDP` | It is optional if IDP synchronize is disabled |
| `mgmtp.a12.uaa.user-management.idp-registration.[{idp-registration-key}].user-management-technical.password` | `` | `The UM technical for synchronize data with IDP` | It is optional if IDP synchronize is disabled |
| `mgmtp.a12.uaa.user-management.um.extension-model-name` |  | `The name of custom project attribute model. Please be aware of this model will always be appended to core model when service starting up by userManagementModelMigration step, core model will also be overwritten.` | It is optional if IDP synchronize is disabled |
| `mgmtp.a12.uaa.user-management.um.edit-username.enabled` | `false` | `If enabled, the system will allow to edit username field.` | Some IDPs can enable *Edit username* by configuration then User Management should provide this as well. |
| `mgmtp.a12.uaa.user-management.um.duplicate-email.enabled` | `false` | `If enabled, the system will allow duplicate user email fields.` | Some IDPs can enable *Duplicate emails* by configuration then User Management should provide this as well. |
| `mgmtp.a12.uaa.user-management.um.user-document-template-resource` |  | `This property used to initialize the User Document template from the resource instead of an empty document.` | You can configure this value by your classpath or absolute path to a JSON/XML file. |
| `mgmtp.a12.uaa.user-management.um.organization-unit-role-structure.enabled` | `false` | `If enabled, the system will allow user to refer to Role through organizationUnit with corresponding Role and AccessRight management are provided.` |  |
| `mgmtp.a12.uaa.user-management.um.cached-storage.enabled` | `false` | `Memory data is provided by default in User Management. If you need cached data then it should be enabled. Cache can be replicated in cluster environment.` |  |
| `mgmtp.a12.uaa.user-management.um.role-access-right-mapping-yaml-attachment-file-name` | `access_rights` | `` The name of `role and access-right mapping `` download file.` |  |
| `mgmtp.a12.uaa.user-management.um.users-yaml-attachment-file-name` | `users` | `` The name of `users `` download file.` |  |

|  |  |
| --- | --- |
|  | Due to the limitation, even if you don’t want user data be synchronized from the IDP to the UM service, the `idp-extension-technical.username` must not be empty and equal with `user-management-technical.username` if `synchronize.enabled` is enabled |

### Configuration Profiles

We maintain a collection of pre-configured profiles that bundle commonly used properties with the intention to simplify the setup of UM by streamlining the configuration process.

#### Set up UAA

Set up default UAA configuration.

Profile name: um\_uaa

The content of application-um\_uaa.properties

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 ``` | ``` # Spring Actuator management.endpoints.enabled-by-default=false management.endpoint.health.enabled=true management.endpoint.info.enabled=true management.endpoints.web.exposure.exclude= #Authentication mgmtp.a12.uaa.authentication.types=OAUTH2 mgmtp.a12.uaa.authentication.cors.allowed-origins=http://localhost:5000 mgmtp.a12.uaa.authentication.user.access-rights-resource=classpath:/access_rights.yaml spring.security.oauth2.resource-server.jwt.jwk-set-uri=http://localhost:9090/realms/user-management/protocol/openid-connect/certs spring.security.oauth2.resource-server.jwt.issuer-uri=http://localhost:9090/realms/user-management #Authorization mgmtp.a12.uaa.authorization.child-authorization-definitions=classpath:user-management-authorization.json # Data Synchronize to IDP. It should be done by project #mgmtp.a12.uaa.user-management.idp-registration.[user-management].idp-extension-technical.username={BASE_ON_YOUR_SET_UP} #mgmtp.a12.uaa.user-management.idp-registration.[user-management].user-management-technical.username={BASE_ON_YOUR_SET_UP} #mgmtp.a12.uaa.user-management.idp-registration.[user-management].user-management-technical.password={BASE_ON_YOUR_SET_UP} ``` |
```

#### Set up models

Profile name: um

The content of application-um.properties

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` mgmtp.a12.dataservices.enumeration.rest-endpoint.enabled=true mgmtp.a12.uaa.user-management.um.organization-unit-role-structure.enabled=true mgmtp.a12.dataservices.initialization.import.models.path=classpath:/core-with-organization-unit/models ``` |
```

#### Set up User models

Profile name: um\_user

The content of application-um\_user.properties

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.dataservices.initialization.import.models.path=classpath:core/models ``` |
```

### Dynamic Realms Configuration

The service can retrieve configurations from a repository rather than a properties file. This means that you can add a new realm’s configuration to the repository.

Without restarting the server:

1. It can validate tokens generated by the new realm.
2. It can enable access for clients belonging to the new realm.
3. It can allow data to be synchronized with the new realm.

|  |  |
| --- | --- |
|  | This feature only available for OAUTH2 with JWT Token only not Opaque |

The flow to validate token:

[![authentication workflow](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/images/user_management/authentication_flow_for_run_time_realm_configuer.png)](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/images/user_management/authentication_flow_for_run_time_realm_configuer.png)

Figure 4. Authentication Workflow

#### Configuration

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.user-management.um.dynamic-realms-config-support.enabled` | `false` | `Enabled it, system will allow to verify the token by dynamic realms (IDP) by using IDPTrustedIssuersStorage.` |  |
| `mgmtp.a12.uaa.user-management.um.dynamic-cors-allowed-origins-config-support.enabled` | `false` | `Enabled it, system will allow to verify the request by dynamic origins by using AllowedOriginsStorage.` |  |

#### Register

After service started, you can refer below interface APIs dynamic to configure.

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` idpSyncConfigStorage.storeSyncConfiguration(String idpKey, IDP idp); trustedIssuersStorage.storageTrustedIssuer(String issuer); allowedOriginsStorage.storeOrigin(String origin); ``` |
```

Refer to [dynamic configure](#run-time-configuration-storage) for more detail.

|  |  |
| --- | --- |
|  | Due to limitation of security filter constructing. If `mgmtp.a12.uaa.user-management.um.dynamic-cors-allowed-origins-config-support.enabled` is `true` then `mgmtp.a12.uaa.authentication.cors.enable` should be set `false`. Currently, UM support for allowed-origins only. Other cors related (e,g allowed-method, allowed-headers, exposed-headers) are still static and support by UAA configuration. |

#### Override jwkSetUri

This jwkSerUri will be used to download the public key for token signature verifying.

By default, it will be the same hostname/IP as issuerUri

But if you want to have a difference hostname/IP you can do it by implementing [IJwtDecoderConfiguration](#IJwtDecoderConfiguration)

Below is an example:

Assume that your token’s issuer is `http://localhost:9090/realms/user-management`

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` public class ProjectJwtDecoderConfiguration implements IJwtDecoderConfiguration {  	@Override 	public String getJwkSetUri(String issuer) {         // By using the inputted issuer, you can understand what is current hostname/IP or realm name 		return "http://uaa_user_management-keycloak:8080/realms/user-management/protocol/openid-connect/certs"; 	} } ``` |
```

### Cluster support

To support dynamic configure, all configuration related to Trusted-Issuers, Cors-Origins and IDPSynchronisation will be added to simple in-memory storage (There is no persistent storage)
In a cluster environment the storage needs to be replicated. To replicate the storage it’s needed to enable cached storage. [see configuration](#user-management-service-configuration).
Then the cache needs to be replicated between nodes. User-Management is using spring caching abstraction, so it’s default cache manager.

Other Security Aspects
It depends on the cache type how to configure the system.
Here is the example for Hazelcast cache implementation in spring boot application.

Configure following properties.

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` spring.cache.type=hazelcast spring.hazelcast.config=classpath:hazelcast.xml spring.cache.cache-names=umAllowedOriginsConfigCache,umIDPSyncConfigurationCache,umTrustedIssuersConfigCache ``` |
```

[Spring boot documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-caching)

|  |  |
| --- | --- |
|  | 1. Our default only work with Hazelcast. IDPTrustedIssuersStorage, AllowedOriginsStorage and IDPSynchronisationConfigurationStorage should be implemented if you are using something else. 2. Please make sure the entries from the above cache will stay infinite (no expiration and eviction) otherwise your User Management Service will not have ability to verify and grant access to your client anymore. |

### Transaction within User Management

#### Transaction from User Management to Keycloak

The User Management Service is a back-end module that is based on A12 Services.
It inherited A12 Services transaction handling features related to CRUD functionalities.

The default implementation of `DocumentPersister` from A12 Services uses the `@Transactional` annotation specifies on to create, update, delete methods.
It supports computations, validations, visibility concept and events.

User Management handles Document events published by A12 Services as a component.
These are all methods of listening for Document events:

##### Before create user

Implement a method that listens to the `DocumentBeforeCreateEvent`.

This method executes the document validation, user existence, password match, and custom extended methods before saving the user into the database.
In the case of any exception errors thrown from them, the transaction will trigger a rollback.

##### After create user

Implement a method that listens to the `DocumentAfterCreateEvent`.

This method creates a user on IDP (Keycloak) and then save the user id into the user document.
All the errors thrown from IDP’s APIs will trigger a rollback of the transaction.

If the user is successfully created on both IDP (Keycloak) and User Management the transaction will end.

##### Before update user

Implement a method that listens to the `DocumentBeforeUpdateEvent`.

This method executes the document validation, validates the illegal id and username changes, and custom extended methods before saving the user into the database.
In the case of any exception errors thrown from them, the transaction will trigger a rollback.

##### After update user

Implement a method that listens to the `DocumentAfterUpdateEvent`.

This method updates a user on IDP (Keycloak).
All the errors throw from IDP’s APIs also will trigger a rollback of the transaction.

If the user is successfully updated on both IDP (Keycloak) and User Management the transaction will end.

##### Before delete user

Implement a method that listens to the `DocumentBeforeDeleteEvent`.

This method executes the document validation before removing it from the database and also check users are trying delete themself will throw InvalidInputException.
In the case got an error (except NotFoundException) throw by them the transaction will trigger a rollback.

##### After delete user

Implement a method that listens to the `DocumentAfterDeleteEvent`.

This method removes a user from IDP (Keycloak).

The transaction will end if the user is successfully deleted, if an error occurs the rollback transaction will be triggered.

#### Transaction from Keycloak to User Management

The transaction triggered by Keycloak also depends on the User Management responses.

Event listener in the Keycloak Extension provider supports **REGISTER**, **UPDATE\_PROFILE** events, and all operations with **USER**, **REALM\_ROLE\_MAPPING**.
When the error occurred from User Management, the transaction will be rollback all changes and throw an unknown exception from the Keycloak side.

However, in case the Keycloak Extension provider configures multiple systems, any errors below from per server will be ignored:

* **Connection timeout** probably means either that the host/port is firewalled, OR the host is "off".
* **Connection refused** probably means that the host is not running any service on the port you are trying to connect to.

The customer project should ensure that all Server configurations in the Keycloak Extension provider are correct.

### Actuator properties

* How to enable it.

  + Adding below dependency with your expected version

```
    <dependency>
        <groupId>com.mgmtp.a12.uaa</groupId>
        <artifactId>uaa-authorization-web-spring-boot-autoconfigure</artifactId>
        <version>9.2.2</version>
    </dependency>
```

* Enable the actuator support

| Configuration property | Default value | Usage |
| --- | --- | --- |
| `management.endpoints.enabled-by-default` | `false` | `The actuator’s endpoints enablement to be opt-in (inside properties) rather than opt-out` |
| `management.endpoint.health.enabled` | `true` | `Actuator’s health endpoint is available` |
| `management.endpoint.info.enabled` | `true` | `Actuator’s info endpoint is available` |
| `management.endpoints.web.exposure.exclude` |  | `Does not exclude any Actuator’s endpoint` |

|  |  |
| --- | --- |
|  | Make sure your login user should be granted a **userManagementAdmin** role for accessing. |

### How to custom the default User Document Model

Our core User Document Model (e.g. DomainUserManagement) contains some fields such as id, username, lastName, fistName, email, enabled, avatar, role.

To allow to custom User Document Model. You can choose one of below option.

#### Using extended model

The strategy is that you provide an Extended Document Model then User Management Service will help to include this Extended Document Model into our default User Document Model.

The advantages of this option is the conversion logic is provided out of the box.

|  |  |
| --- | --- |
|  | The Extended Document Model should be followed some below constraints:  1. Root group name should be `extend` 2. One nested level is allowed 3. Field elements type should be String |

Below is an example:

*1. Create DomainUserExtensionExample.json file.*

[DomainUserExtensionExample.json](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/DomainUserExtensionExample.json)

*2. Register to User Management Service.*

appplication.properties

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` #User Management mgmtp.a12.uaa.user-management.um.extension-model-name=DomainUserExtensionExample #Data Services mgmtp.a12.dataservices.initialization.import.models.path=classpath:{{USER_MANAGEMENT_DEFAULT_MODEL_PATH}},{{YOUR_PROJECT_MODEL_PATH}} ``` |
```

|  |  |
| --- | --- |
|  | Make sure DomainUserExtensionExample.json should stay in {{YOUR\_PROJECT\_MODEL\_PATH}}. |

See more at [User Management Service Configuration](#user-management-service-custom-configuration).

*3. Restart the application to apply.*

#### Update User Document Model directly

If the first option does not fully fix with your requirement then feel free update our core User Document Model.

|  |  |
| --- | --- |
|  | To keep the service and the out-of-the-box conversion logic still working:  1. Make sure download our default core model, please click ([here](#user-management-defaults-models)) to download the proper DomainUserManagement (base on your selected group models) 2. Please do not change anything about our default fields. Just adding your fields. |

*1. Update DomainUserManagement.json file.*

*2. Update User POJO.*

If User Document Model structure is updated. The User POJO should be updated as well.

Refer to [How to custom a User POJO](#custom-user-pojo).

*3. Update conversion logic.*

Refer to [How to custom a User conversion](#user-document-conversion).

*4. Restart the application to apply.*

|  |  |
| --- | --- |
|  | Make sure the updated User Document Model should stay in [YOUR\_PROJECT\_MODEL\_PATH]. |

### How to customize the default conversion.

If you decided to [update User Document Model directly](#update-user-document-model-directly). Y have to update the User conversion logic for your new added fields.

#### How to customize the User conversion

The customer projects use the UAA User Management and A12 need to convert their User object to the `IDocument` to fit with A12.

Depending on the business requirements of the customer projects, there can be different types of users with different structures.
So, UAA User Management provides an interface that supports generic type to allow they can convert their User object back and forth to User Document by their source code.

Besides, we also provide a default implementation class with extended user fit with a project using a simple user like Keycloak user.
The customer projects do not need to implement this interface if your user structure is similar to `ExtendedUser`.
In other cases, you can implement overriding these methods if you have users with different structures and want to make your converter.

Public interface: *IUserDocumentConversionService<U>*

Default implementation: *ExtendedUserDocumentConversionService<U extends ExtendedUser>*

|  |  |
| --- | --- |
|  | The `<U>` type is a generic type, you must define your user extends our user classes. |

Refer to [data flow diagram](#data-flow-pojo-apis) for more detail.

The Example is customer project want to convert their user object ([ProjectUser](#custom-user-pojo)) back and forth to the User Document.

*1. By using the interface*

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 ``` | ``` @Priority(1) @Service public class ExampleUserDocumentImplementConversionService implements IUserDocumentConversionService<ProjectUser> {  	@Override 	public IDocument convertUserToUserDocument(ProjectUser user, IDocument userDocument) { 		//... You need to implement the converter here to converting the User object to User Document. 		return userDocument; 	}  	@Override 	public ExampleUser convertUserDocumentToUser(IDocument userDocument, ProjectUser user) { 		//... You need to implement the converter here to converting the User Document to User object. 		return user; 	}  } ``` |
```

*2. By extend our default conversion*

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 ``` | ``` @Priority(1) @Service public class ExampleUserDocumentExtendConversionService extends ExtendedUserDocumentConversionService<ProjectUser> {  	@Override 	public IDocument convertUserToUserDocument(ProjectUser user, IDocument userDocument) { 		super.convertUserToUserDocument(user, userDocument); 		//... You need to add new converter here to extend converting the User object to User Document. 		return userDocument; 	}  	@Override 	public ProjectUser convertUserDocumentToUser(IDocument userDocument, ProjectUser user) { 		super.convertUserDocumentToUser(userDocument, user); 		//... You need to add new converter here to extend converting the User Document to User object. 		return user; 	}  } ``` |
```

|  |  |
| --- | --- |
|  | * We use [@Priority](https://docs.oracle.com/javaee/7/api/javax/annotation/Priority.html) annotation to overriding beans of the same type.   However, you also can use any other annotation to instead it, e.g: `@Primary`. * We mark beans with [@Service](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Primary.html) to indicate that for the business logic and register beans with `@Service` annotation.   You can register a new bean by yourself in configuration if don’t want to use this annotation. * You can reuse our public APIs and other A12 platforms to implement this feature in your project. |

#### How to customize the User Document customization

The User Management provides the extension points that allow the customer projects can customize the User Document before and after saving.

Public interface: *IUserDocumentCustomizationService*

For example, the customer projects want to add the temporary password, correct extension fields, trim blank space before saving User Document, or remove the temporary password and add more field after saving User Document into database.
In your project, you need to implement and apply your code in the before and after methods corresponding.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 ``` | ``` @Service public class ExampleUserDocumentImplementCustomizationService implements IUserDocumentCustomizationService {      @Override     public void customizeBeforeCreateUser(IDocument userDocument) {         //...You can add the customization User Document here. E.g: Add the temporary password,...     }      @Override     public void customizeBeforeUpdateUser(IDocument userDocument) {         //...You can add the customization User Document here.     }      @Override     public void customizeBeforeDeleteUser(IDocument userDocument) {         //...You can add the customization User Document here.     }      @Override     public void customizeAfterCreateUser(IDocument userDocument) {         //...You can add the customization User Document here. E.g: Remove the temporary password,...     }      @Override     public void customizeAfterUpdateUser(IDocument userDocument) {         //...You can add the customization User Document here.     }      @Override     public void customizeAfterDeleteUser(IDocument userDocument) {         //...You can add the customization User Document here.     }  } ``` |
```

|  |  |
| --- | --- |
|  | The user in User Management has the default customization of the `id`, `username`, and `email` (if the field exists) that are always lowercase. |

#### How to customize the User Document validation

We provide the extension points allows the customer projects can validate the User Document.

Public interface: *IUserDocumentValidationService*

For example, the customer projects want to validate the User Document before saving, such as validate the strength of the password, check pattern of the email.
You need to implement and apply your code in the `validateBeforeCreateUser`, `validateBeforeUpdateUser` or `validateBeforeDeleteUser` methods corresponding.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 ``` | ``` @Service public class ExampleUserDocumentValidationService implements IUserDocumentValidationService {      @Override     public void validateBeforeCreateUser(IDocument userDocument) {         //...You need to add the validation User Document here. E.g: Validate password, email, username,...     }      @Override     public void validateBeforeUpdateUser(IDocument userDocument) {         //...You need to add the validation User Document here.     }      @Override     public void validateBeforeDeleteUser(IDocument userDocument) {         //...You need to add the validation User Document here.     }  } ``` |
```

|  |  |
| --- | --- |
|  | The user in User Management has the default validation such as: Validate the password match (if `password` and `repeatPassword` are existence) and validate the email is unique (if the `email` field exists) before saving the User Document. |

#### How to customize the User IDP conversion

We provide the interface supports converting the User object to the User IDP.

Public interface: *IUserIDPConversionService<U, I>*

|  |  |
| --- | --- |
|  | The `<U> and <I>` type are generic types, you must define the user extends by User for <U> and the user IDP for <I>. For example, the `UserRepresentation` is a user type of IDP Keycloak: IUserIDPConversionService<ProjectUser, UserRepresentation> |

By the default implementation, if the user is an instance of `ExtendedUser` then User Management will convert all fields in ExtendedUser to new User IDP.

The customer projects can implement the `IUserIDPConversionService` to further convert other additional fields.

Example:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` @Service public class ExampleUserIDPImplementConversionService implements IUserIDPConversionService<ProjectUser, UserRepresentation> {  	@Override 	public UserRepresentation convertUserToUserIDP(ProjectUser user, UserRepresentation userIDP) { 	    //...You need to add new converter here to extend converting the User object to User IDP (UserRepresentation). E.g: Set the password, salt, email,... 		return userIDP; 	} } ``` |
```

#### How to customize the User IDP customization

These are extension points that allow the customer projects can customize the User IDP after create and update user.

Public interface: *IUserIDPCustomizationService<U, I>*

Default implementation: *DefaultUserIDPCustomizationService<U extends ExtendedUser, I extends Object>*

|  |  |
| --- | --- |
|  | The `<U> and <I>` type are generic types, you must define the user extends by User for <U> and the user IDP for <I>. |

You can follow 1 of 2 examples below to implement your customization feature.

Example 1: The customer projects want to add client roles, add groups or add more other attributes for User IDP when the creation or update the user in IDP is completed.
You need to implement and apply your code in the after method corresponding.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 ``` | ``` @Priority(1) @Service public class ExampleUserIDPImplementCustomizationService implements IUserIDPCustomizationService<ProjectUser, UserRepresentation> {      @Override     public void customizeAfterCreateUser(ProjectUser user, UserRepresentation userIDP) {         //...You can add the customization User IDP here. E.g: Add client roles, add groups,... 		addClientRoles(user); 		addGroups(user);     }      @Override     public void customizeAfterUpdateUser(ProjectUser user, UserRepresentation userIDP) {         //...You can add the customization User IDP here. 		addClientRoles(user); 		addGroups(user);     }  } ``` |
```

Example 2: The customer projects want reuse the default implementation and add more business logics such as add client roles, add groups.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` @Priority(1) @Service public class ExampleUserIDPExtendCustomizationService extends DefaultUserIDPCustomizationService<ProjectUser, UserRepresentation> {  	@Override 	public void customizeAfterCreateUser(ProjectUser user, UserRepresentation userIDP) { 		super.customizeAfterCreateUser(user, userIDP);         //...You can add the customize User IDP here. E.g: Add client roles, add groups,... 		addClientRoles(user); 		addGroups(user);     }      @Override     public void customizeAfterUpdateUser(ProjectUser user, UserRepresentation userIDP) { 		super.customizeAfterUpdateUser(user, userIDP);         //...You can add the customization User IDP here. 		addClientRoles(user); 		addGroups(user);     }  } ``` |
```

|  |  |
| --- | --- |
|  | Please be noticed that transaction errors may occur by using **customizeAfterCreateUser** and **customizeAfterUpdateUser** methods to customize data on the **keycloak**, these errors should be handled by implementing **IIDPExceptionHandler**. In case duplicated user error occurs an **InvalidInputException** will be thrown and will not be handled by **IIDPExceptionHandler**. |

Provides handling for standard IDP exceptions.

Public interface: *IIDPExceptionHandler*

Example:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` @Service public class ExampleIDPExceptionHandler implements IIDPExceptionHandler {  	@Override 	public RuntimeException handleException(Exception e) { 		throw new InvalidInputException("custom.error.key", "Custom exception", e); 	}  } ``` |
```

|  |  |
| --- | --- |
|  | The exception should have a standard structure for handling errors for the client. You can see the Error Handling of JSON-RPC operations provided by the Data Services documentation. |

### How to migrate current documents to new business models

By the default, User Management Service will import the business models into database when starting the application for the first time.
The models will be overwritten if they are already present in the database.

In case the document model content has changed (e.g: Upgrade to new A12 version, data model has changed to adapt new business requirement,…​) then it may be required to migrate existing user data in the repository to accommodate these changes, otherwise, the application may not startup.

* We have 3 below situations:

  + Import business models from the core models.
  + Import business models from the outside models.
  + Import business models from both core and outside models.

For example, the customer projects want to import the business models from their model directory by setting `mgmtp.a12.dataservices.initialization.import.models.path` with outside models path.

* Example of directory models structure:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` +- resources |  +- config |  +- models |  |  \- DomainUserExtensionExample.json |  |  \- DomainUserManagement.json |  |  \- User.json |  |  \- User_Create.json |  |  \- usermanagement.json |  |  \- UserManagementOverview.json ``` |
```

* How to implement User data migration:

In the case got an error with existing data and new document models.
You need to implement migration step refer to `Data migration support` section of [geta12.com - Data Services](https://geta12.com/docs/#content:asciidoc,product:data_services,artifact:dataservices-documentation-src,scene:Data_Services,anchor:data-migration-support).

Example migration steps:

1. Load the OLD MODEL from classpath to query all current user documents.
2. Query and migrate all existing user documents to accommodate NEW MODEL (the new model also loads before migrating documents).
3. Validate all user documents after migration.

## User Management Rest Client

### Overview

Based on UAA rest client infrastructure, it provides the accessing for some of User Management endpoints.

### User Management endpoints

* **createUser(Class<T> userType, T user)**
* **readUser(String username)** - Load user detail by username which return the default user type.
* **readUser(Class<T> userType, String username)** - Load user detail by username which return the custom of default user type.
* **updateUser(Class<T> userType, T user)**
* **deleteUser(String userName)**

### Getting Started

Add following dependency to your POM:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 ``` | ``` <dependency> 	<groupId>com.mgmtp.a12.uaa</groupId> 	<artifactId>uaa-user-management-rest-client</artifactId> 	<version>9.2.2</version> </dependency>  <dependency> 	<groupId>com.mgmtp.a12.uaa</groupId> 	<artifactId>uaa-user-management-user</artifactId> 	<version>9.2.2</version> </dependency> ``` |
```

### Configuration

In a Spring Boot application all configuration is handled for you in **autoconfigure** modules.
Everything is configured by a configuration properties.

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.user-management.client.rest.uaa-base.url` | `http://localhost:8080` | Base URL for the UAA server. |  |
| `mgmtp.a12.uaa.user-management.client.rest.service-base.url` | `http://localhost:8080` | Base URL for the User Management Service server. |  |
| `mgmtp.a12.uaa.user-management.client.rest.service-context-path` | `` | The User Management Service context path. |  |
| `mgmtp.a12.uaa.user-management.client.rest.cache.enabled` | `false` | Enable caching request. |  |
| `mgmtp.a12.uaa.user-management.client.rest.authentication-type` | `DELEGATED` | This rest client will use the existing token for working with User Management Service server. |  |

Because this UM rest client is based on the infrastructure from UAA rest client then please refer [UAA Java Rest Client](https://geta12.com/docs/UAA/uaa-documentation-src/index.html#rest-client)
to learn how to instantiate a REST client that works with each authentication type.

|  |  |
| --- | --- |
|  | `mgmtp.a12.uaa.user-management.client.rest.*` is for the configuration key prefix. The rest remains the same |

Below is an example for reading data from server.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` @Inject private UserManagementServiceRestClient userManagementServiceRestClient;  ProjectUser currentUser = userManagementServiceRestClient.readUser("admin"); ``` |
```

### ReadUser Caching support

`readUser` might be used quite often from project to fetch the user resource from User Management Service.
Since user resource data do not change frequently then provide the caching from rest will help to improve the performance.

For complete flow, see following screenshot:

[![User Management Rest Client workflow diagram](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/images/user_management/client_rest_with_caching.png)](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/images/user_management/client_rest_with_caching.png)

Figure 5. Workflow

#### Enable

You need to enable for used it, refer to [configuration](#rest-client-configuration)

The rest client is using spring caching abstraction, in a cluster environment the storage needs to be replicated.
To replicate the storage it’s needed to enable cached storage.

Here is the example for Hazelcast cache implementation in spring boot application.

Configure following properties.

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` spring.cache.type=hazelcast spring.hazelcast.config=classpath:hazelcast.xml spring.cache.cache-names=/api/user/read/ ``` |
```

#### Flush the cache

To remove item inside the caching, you can choose one of below option:

* By using spring cache configuration

Example:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` spring.cache.redis.time-to-live=10m ``` |
```

* By using the CacheFlushEvent

Example:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` @Inject private ApplicationEventPublisher applicationEventPublisher;  @Inject private UserManagementRestClientProperties restClientProperties;  applicationEventPublisher.publishEvent(new CacheFlushEvent(this, UserManagementEndPoint.READ.getFullPathIncludeContext(restClientProperties.getServiceContextPath()))); ``` |
```

## User Management Tool

This is a Command Line Interface tool that supports:

* Register multiple user management service configure information for User Management Keycloak Extension.
* Register multiple technical users.

**Usage:**

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` java -jar uaa-user-management-tool-cli-9.2.2.jar [OPTIONS] ARGUMENT_FILE_PATH ``` |
```

**Options:**

| Name, shorthand | Description |
| --- | --- |
| --config, -c | register new extension configs for the new systems |
| --user, -u | register new technical users |
| --help, -h | display help |

**Argument:**

|  |  |
| --- | --- |
|  | Below is our example that is fixed with the keycloak setup [here](#keycloak-getting-started) and user management server setup [here](#user-management-service-with-oauth2).  If you have a different setup (e.g, host, port). Please make the changes accordingly. |

argument.json

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 ``` | ``` {   "credentials": [     {       "url": "http://localhost:9090",       "contextPath": "",       "realmName": "master",       "clientId": "admin-cli",       "clientSecret": null,       "username": "admin",       "password": "{{YOUR_ADMIN_PASSWORD}}"     }   ],   "servers": [     {       "url": "http://localhost:10000",       "contextPath": "/api",       "realmName": "user-management",       "clientId": "uaa-auth-client",       "clientSecret": "{{YOUR_CLIENT_SECRET}}",       "tokenType": "Bearer",       "users": [         {           "username": "{{YOUR_USER_MANAGEMENT_SERVICE_USERNAME}}",           "password": "{{YOUR_USER_MANAGEMENT_SERVICE_PASSWORD}}"         },         {           "username": "{{YOUR_KEYCLOAK_EXTENSION_USERNAME}}",           "password": "{{YOUR_KEYCLOAK_EXTENSION_USER_PASSWORD}}"         }       ]     }   ] } ``` |
```

1. `credentials`: The credentials configuration required for the tool to authenticate and authorize with the Keycloak Extension through the endpoints.
   We support a list of user credentials, but we only use one successfully authenticated login.
   We also support admin users from the **master** realm with **admin-cli** to register for other realms.
   If you have users in your realm you are able to authenticate with your client and secret but note that it contains client roles:
   *manage-realm, manage-users, view-users* and *view-clients*.
2. `servers`: The servers configuration required for the tool to register multiple servers into Keycloak Extension.
   Besides, we support registering batch technical users from each server configuration for synchronization.
   It is important to note that the user of each server must have at least *2 users* (This is required of the Keycloak Extension).
   We will use the first technical user for User Management Server and the second for Keycloak Server.

## Keycloak

**Keycloak** is Open Source Identity and Access Management For Modern Applications and Services.

Add authentication to applications and secure services with minimum fuss.
No need to deal with storing users or authenticating users.
It is all available out of the box.

You will even get advanced features such as User Federation, Identity Brokering and Social Login.

All user management features from Keycloak can be found in <https://www.keycloak.org/docs/latest/server_admin/index.html>.

**Keycloak with UAA**: UAA uses Keycloak as IDP and relies on Keycloak User Management features which allows the project to freely define and manage their own users by using Keycloak.
UAA will provide the authentication method which talk with Keycloak via OpenIdConnect/Oauth2 and SAML.

### Getting Started

For general Keycloak getting started documentation can be found in <https://www.keycloak.org/guides#getting-started>.

But in scope of this guideline, we choose the `Get started with Keycloak on bare metal`.

|  |  |
| --- | --- |
|  | Please aware that `start-dev` which uses in this guideline is for development only should not use for production setup. |

* Download and extract the latest Keycloak (<https://github.com/keycloak/keycloak/releases/>)
* After extracting this file, you should have a directory with a name that starts with `keycloak-26.0.3`
* [Download](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/default-secure-user-management-realm.json) our default secure user management realm.
* Copy this default secure realm into directory `keycloak-26.0.3\data\import`
* From a terminal, open the `keycloak-26.0.3\bin` directory
* Create initial admin user by using environment variables (below is an example for window):

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` Set KEYCLOAK_ADMIN={{YOUR_ADMIN_USER}}  Set KEYCLOAK_ADMIN_PASSWORD={{YOUR_ADMIN_PASSWORD}} ``` |
```

* Start the Keycloak

Below is an example command for window:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` kc start-dev --http-port=9090 --import-realm ``` |
```

|  |  |
| --- | --- |
|  | If you want go with production setup. `start` should be used instated of `start-dev`.  But before to go with `start` then make sure you followed this guideline <https://www.keycloak.org/server/configuration-production>. |

### Keycloak clients configure

User Management Client Front End application and User Management Keycloak Extension library want to get the Access Token from Keycloak.

You should have proper client configure.

#### Access to clients

Refer below steps:

* Go to the Keycloak Admin Console (e.g. `http://localhost:9090/admin/`). Login by using your [credential](#keycloak-admin-credential).
* Go to "user-management" realm
* Go to "clients"

#### Generate the client secret for `uaa-auth-client`

This client will be used by User Management Keycloak Extension library.

* From `Client secret` click to `Generated` button

|  |  |
| --- | --- |
|  | Only generated in case the client secret is missing, or you want another secret. |

#### Update URI for `user_management_spa_client`

This client will be used by User Management Client Front End application.

|  |  |
| --- | --- |
|  | Below is our example that is fixed with the user management client setup [here](#integrate-a12-client).  If you have a different setup (e.g, host, port). Please make the changes accordingly. |

* From `Valid redirect URIs ` click to add 2 new items

  1. <http://localhost:8081/>
  2. <http://localhost:8081/silent_renew.html>
* From `Web origins` click to add 1 new item

  1. <http://localhost:8081>

### Create user-management-service admin user

This is an admin user who can access to system.

Refer below steps:

* Go to the Keycloak Admin Console (e.g. `http://localhost:9090/admin/`). Login by using your [credential](#keycloak-admin-credential).
* Go to "user-management" realm
* Do following `https://www.keycloak.org/getting-started/getting-started-zip#_create_a_user` to create users
* After user created, assign `userManagementAdmin` role for this user.

### Open Security Issues

#### Host Header Injection

##### What is the Host Header injection?

Host header injection is a web attack where the attacker provides a false Host header to the web application.
In an incoming HTTP request, web servers often dispatch the request to the target virtual host based on the value supplied in the Host header.
Without proper validation of the header value, the attacker can supply invalid input to cause the web server to:

* Cause a redirect to an attacker-controlled domain.
* Perform web cache poisoning.
* Manipulate password reset functionality.

##### How dangerous are Host Header Injection?

Host header injection can be used for these attack above.
An attacker can abuse it to redirect an attacker-controller domain.
Web cache poisoning lets an attacker serve poisoned content to anyone who requests pages.
Using password reset poisoning, the attacker can obtain a password reset token and reset another user’s password leak to take over the user account.

##### How to avoid Host Header Injection?

* Refer to the below link for proper keycloak hostname setup:

  + [Configuring the hostname](https://www.keycloak.org/server/hostname).

#### SMTP Server

Please aware of SMTP server data exported via Keycloak return plain text if you don’t configure anything.

Please follow document: <https://www.keycloak.org/docs/latest/server_admin/index.html#_vault-administration>.

## Bidirectional synchronization data between User Management Service and Keycloak

### Overview

![User Management](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/images/user_management/synchronization_diagram.png "User synchronization diagram")

### Technical users

Technical user uses for data-synchronization between `User Management Service` and `Keycloak`.

Due to round-trip issue, 2 different technical users need to be used.

One is [User Management Service](#user-management-service-configuration) and the other is [Keycloak extension](#register-keycloak-extension-configuration)

How to create a proper user:

* Go to the Keycloak Admin Console (e.g. `http://localhost:9090/admin/`). Login by using your [credential](#keycloak-admin-credential).
* Go to "user-management" realm
* Go to "Users"
* Click to "Add user"
* Assign credentials
* Assign following roles:

  + For user at User Management Service: `manage-realm`, `manage-clients`, `manage-users`
  + For user at Keycloak extension: `userManagementAdmin`

|  |  |
| --- | --- |
|  | 1. Make sure `userManagementAdmin` is created from `Realm roles` before doing the role assigning step 2. You can refer `https://www.keycloak.org/getting-started/getting-started-zip` for detail |

### How to deploy user management keycloak extension

|  |  |
| --- | --- |
|  | 1. If you do not have keycloak before then please refer to [keycloak getting start](#keycloak-getting-started) 2. Make sure have no keycloak instance is running. |

#### Prepare extension jar file

* Download user management keycloak extension

If you are inside mgm network click [uaa-user-management-keycloak-extension-9.2.2.jar](https://artifacts.mgm-tp.com:443/artifactory/a12-maven-releases/com/mgmtp/a12/uaa/uaa-user-management-keycloak-extension/9.2.2/uaa-user-management-keycloak-extension-9.2.2.jar) otherwise
[uaa-user-management-keycloak-extension-9.2.2.jar](https://artifacts.geta12.com/ui/repos/tree/General/a12-maven/com/mgmtp/a12/uaa/uaa-user-management-keycloak-extension/9.2.2/uaa-user-management-keycloak-extension-9.2.2.jar).

* Copied this file into [keycloak-26.0.3](#keycloak-getting-started)\providers

#### Start the Keycloak

Please refer to [how to start keycloak](#keycloak-getting-started)

#### Enable Events Listener

Make sure `user-management` event is enabled. If not please do following steps:

* Go to the Keycloak Admin Console (e.g. `http://localhost:9090/admin/master/console/#/user-management/realm-settings/events`).
* Click and assign `user-management`
* Click Save

#### Setup data configuration

Please refer to [how to set up](#register-keycloak-extension-configuration).

## User Management Keycloak Extension

### Overview

Whenever the keycloak event occurs, base on its resource type. This extension will create a proper payload (e,g User, Role) then sent it to User management service(s).
By using the realm name which resolved from this event it can make request to correct User management service(s).

### Getting Started

Refer to [how to deploy this](#how-to-deploy-user-managemt-keycloak-extension).

### A list of supported events

**For Normal User**

1. **EventType.REGISTER**
2. **EventType.UPDATE\_PROFILE**

**For Keycloak Admin**

1. **ResourceType.USER** - For CRUD
2. **ResourceType.REALM\_ROLE\_MAPPING** - For Assign or Remove
3. **ResourceType.CLIENT\_ROLE\_MAPPING** - For Assign or Remove
4. **ResourceType.REALM\_ROLE** - For CRUD
5. **ResourceType.CLIENT\_ROLE** - For CRUD

### Environment Name

1. **KEYCLOAK\_EXTENSION\_NAME** : the name of this extension (default is `user-management`)
2. **KEYCLOAK\_EXTENSION\_DESCRIPTION** : the description of this extension
3. **KEYCLOAK\_EXTENSION\_CONFIGURATION\_STORAGE\_TYPE** : default is `MEMORY`, but you can change it to `DISK` if you want to load from configuration file.
4. **KEYCLOAK\_EXTENSION\_DIRECTORY**: To where the configuration file(s) are stored.
5. **KEYCLOAK\_FILE\_ENCRYPTED\_PASSWORD**: The password is used for the file encryption process. If it is not specified, the configuration files are not encrypted and saved rawly.
6. **KEYCLOAK\_FILE\_ENCRYPTED\_SALT**: The salt is used for the file encryption process. If it is not specified, the password is used as the salt.
7. **IS\_UM\_ORGANIZATION\_UNIT\_ROLE\_ENABLE**: enable if your `user management service` is supported role management data (default is `false`)

### Configuration

This is a set of information:

1. `name` as a key (realm name) which uses for lookup configuration
2. user management service’s url
3. user management service’s context path
4. `auth` as credential for getting a token for communicating with user management service (technical user which assigned for this extension)
5. `technicalUser` as technical user which assigned for `user management service`

This can be loaded or persisted to file system if **KEYCLOAK\_EXTENSION\_CONFIGURATION\_STORAGE\_TYPE** is **DISK** and **KEYCLOAK\_EXTENSION\_DIRECTORY** is provided.

There are two options can be used.

#### File

One or multiple file(s) system which correct content and staying proper directory. Each file represents each User management service.

Below is an example:

user-management.00000000-0000-0000-0000-000000000000.config.json

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` {   "id": "00000000-0000-0000-0000-000000000000",   "name": "user-management",   "url": "http://localhost:8082",   "contextPath": "/api",   "auth": {     "username": "{{YOUR_KEYCLOAK_EXTENSION_USERNAME}}",     "password": "{{YOUR_KEYCLOAK_EXTENSION_USER_PASSWORD}}",     "oauth2": {       "realmName": "user-management",       "clientId": "uaa-auth-client",       "clientSecret": "{{YOUR_CLIENT_SECRET}}",       "tokenType": "Bearer"     }   },   "technicalUser": "{{YOUR_USER_MANAGEMENT_SERVICE_USERNAME}}",   "enabled": true } ``` |
```

|  |  |
| --- | --- |
|  | 1. File name should follow this pattern: {your-realm-name}.[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}.config.json 2. You need to restart the keycloak server to reload the information from these file(s) |

Because the credential will be stored as plain text then please consider it is security issue.

#### REST API

If you can not use file for storing config data due to security issue then just store it in memory. By doing like below steps you can add/update/delete

* Obtain access token

It can be done by using the technical user which assigned for this Keycloak extension

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` curl --location --request POST 'http://localhost:9090/realms/user-management/protocol/openid-connect/token' \ --header 'Content-Type: application/x-www-form-urlencoded' \ --data-urlencode 'client_id=uaa-auth-client' \ --data-urlencode 'client_secret={{YOUR_CLIENT_SECRET}}' \ --data-urlencode 'grant_type=password' \ --data-urlencode 'username={{YOUR_KEYCLOAK_EXTENSION_USERNAME}}' \ --data-urlencode 'password={{YOUR_KEYCLOAK_EXTENSION_USER_PASSWORD}}' ``` |
```

This request returns the `access_token`.

* Register Service configuration

Using the obtained `ACCESS_TOKEN` and sending body request to */realms/user-management/extension/registerConfigs* endpoint.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` curl --location --request POST 'http://localhost:9090/realms/user-management/extension/registerConfigs' \ --header 'Authorization: Bearer {{ACCESS_TOKEN}}' \ --header 'Content-Type: application/json' \ --data-raw '[     {         "url": "http://localhost:10000",         "contextPath": "/api",         "auth": {             "username": "{{YOUR_KEYCLOAK_EXTENSION_USERNAME}}",             "password": "{{YOUR_KEYCLOAK_EXTENSION_USER_PASSWORD}}",             "oauth2": {                 "realmName": "user-management",                 "clientId": "uaa-auth-client",                 "clientSecret": "{{YOUR_CLIENT_SECRET}}",                 "tokenType": "Bearer"             }         },         "technicalUser": "{{YOUR_USER_MANAGEMENT_SERVICE_USERNAME}}",         "enabled": true     } ]' ``` |
```

This request returns the Service configuration `ID` as a random UUID string.
You can store this ID to modify configs or unregister configs.
If one of the configurations fails, it returns `null`.

To modify your configuration you need to add `ID` field into body request.

* Unregister Service configuration

Using the obtained `ACCESS_TOKEN` and sending request to */realms/user-management/extension/unregisterConfigs/**ID*** endpoint.

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` curl --location --request POST 'http://localhost:9090/realms/user-management/extension/unregisterConfigs/{{ID}}' \ --header 'Authorization: Bearer {{ACCESS_TOKEN}}' ``` |
```

|  |  |
| --- | --- |
|  | 1. Any users which `manage-realm` in their role can access this endpoint. 2. Please check the keycloak log if these request does not successfully (e,g 400 bad request) for more information |

## User Management Module

### Overview

This package deliver a list of A12 modules (e.g. User, Role, AccessRight, Localization, ErrorHandling). Each module include our default id, model, view and saga implementation.
You can easily use it for integrating with A12 Client Application.

### API

#### Full Models

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` import Modules from "@com.mgmtp.a12.uaa/uaa-user-management-module"; ``` |
```

#### User Model

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` import Modules from "@com.mgmtp.a12.uaa/uaa-user-management-module"; ``` |
```

#### AUTH\_KEYS

It’s an interface that supports custom default language.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` import merge from "lodash/merge";  import UM_DEFAULT_TRANSLATIONS from "@com.mgmtp.a12.uaa/uaa-user-management-module"; import { UmResourceKeys } from "@com.mgmtp.a12.uaa/uaa-user-management-module";  const vi: UmResourceKeys = { /* Vietnam translations */ }; const YOUR_UM_CUSTOM_TRANSLATIONS: LocalizationTreeMap = { vi }; const localizer = createApplicationLocalizer(     locale,     documentModelMap,     dataFormats,     merge(UM_DEFAULT_TRANSLATIONS, YOUR_UM_CUSTOM_TRANSLATIONS, YOUR_PROJECT_TRANSLATIONS)   ); ``` |
```

### How to integrate with A12 Client

We suggest that you need to clone full-stack-project-template which include the client module inside.
Then modify the client module.

*1. Add the user management module dependency*

package.json

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` "dependencies": {    ...,   "@com.mgmtp.a12.uaa/uaa-user-management-module": 9.2.2 } ``` |
```

*2. Implement Module Registry.*

The correct Modules for registry you base on what are default Models that your UM Service are using. Refer to [User Management Default Models](#user-management-defaults-models)

The correct Modules for corresponding Models will be:

* [User](#User_Role_Kind)

```
import Modules from "@com.mgmtp.a12.uaa/uaa-user-management-module";
```

* [User, Role and AccessRight](#User_OrganizationUnit_Role_AccessRight_Kind)

```
import Modules from "@com.mgmtp.a12.uaa/uaa-user-management-module";
```

The full-stack-project-template’s client is supported Oauth2 Authentication by default.

If your user-management-service application uses Local authentication.
You need to change it to Local, see [UAA Docs](https://geta12.com/docs/UAA/uaa-documentation-src/index.html#_how_to_set_up) for detail.

*3. Start the application*
Open terminal as client directory.

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` npm run start ``` |
```

The credential to login into the application

* Click [here](#user-management-service-admin-user), if you are using Oauth2 authentication
* CLick [here](#user-management-service-local-admin-user), if you are using local authentication

|  |  |
| --- | --- |
|  | 1. By default, the client from full-stack-project-template will host on port 8081 and proxy to server on port 8082. 2. If you are using Oauth2 authentication click [how to configure valid uri from Keycloak](#user_management_spa_client-uri) for more detail. |

|  |  |
| --- | --- |
|  | For production setup, please get advice from the deployment team |

### How to allow A12 Client works with multiple realms

This is only valid for running with Oauth2 authentication type with Keycloak.

User Management Client application might support multiple tenants where tenant users are managed by corresponding to the tenant’s realm.

By default, the A12 Template application which used uaaClient will automatically download the configuration setup information from Data Services for setting up (It’s called an online self-configure).
But this feature only support for working with single tenant’s realm.

For this reason, you should use offline self-configure ([refer to uaa documentation](https://geta12.com/docs/?release=2022.06#content:asciidoc,product:UAA,artifact:uaa-documentation-src,scene:UAA,anchor:_self_configuration).) for setting up your application.

Below is a user-case and configuration example:

1. Your application is served for 2 domains `http://mycompany.abc.com/` and `http://yourcompany.abc.com/`.
2. Your IDP is provided 2 different realms are `mycompany` and `yourcompany` for 2 different domains

Your application will need 2 different self-configure configuration for 2 different domains.
It can be stored as files or simply defined as variables like below.

index.tsx

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 ``` | ``` import { SelfConfigure } from '@com.mgmtp.a12.uaa/uaa-authentication-client';  const myCompanyOfflineSelfConfigure: SelfConfigure = {   "tokens": [     {       "authorizationHeaderName": "Authorization",       "tokenType": "BEARER",       "generatedTokenHeaderName": null,       "generatedTokenExpirationHeaderName": null,       "allowCredentials": null     }   ],   "oauth2": {     "tokenType": "BEARER",     "clientId": "uaa-spa-client",     "realmName": "mycompany",     "idpBaseUrl": "http://localhost:9090",     "loginRedirectRelativeUrl": "callback",     "logoutRedirectRelativeUrl": "logout",     "silentRedirectRelativeUrl": "silent_renew.html"   },   "local": {},   "activeDirectoryLdap": {},   "saml": {} }  const yourCompanyOfflineSelfConfigure: SelfConfigure = {   "tokens": [     {       "authorizationHeaderName": "Authorization",       "tokenType": "BEARER",       "generatedTokenHeaderName": null,       "generatedTokenExpirationHeaderName": null,       "allowCredentials": null     }   ],   "oauth2": {     "tokenType": "BEARER",     "clientId": "uaa-spa-client",     "realmName": "yourcompany",     "idpBaseUrl": "http://localhost:9090",     "loginRedirectRelativeUrl": "callback",     "logoutRedirectRelativeUrl": "logout",     "silentRedirectRelativeUrl": "silent_renew.html"   },   "local": {},   "activeDirectoryLdap": {},   "saml": {} } ``` |
```

From the step create UaaClientConfiguration, we will dynamic switch the offlineSelfConfigure base on host name subDomain.

index.tsx

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` import { UaaClientConfiguration } from '@com.mgmtp.a12.uaa/uaa-authentication-client';  const subDomain = window.location.hostname.split('.')[0];  const uaaClientConfigure: UaaClientConfiguration = {   serverURL: "http://localhost:10000/",   offlineSelfConfigure: subDomain === "yourCompany" ? yourCompanyOfflineSelfConfigure : myCompanyOfflineSelfConfigure,   automaticallyLogin: true }  UaaClient.init(uaaClientConfigure).then(() => {   console.log("The Uaa has initialized."); }); ``` |
```

That’s it,now just pass the above uaaClientConfigure into uaaProvider:

index.tsx

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ```   root.render(     <UaaProvider store={store} clientConfigure={uaaClientConfigure}>         <MainAppComponent />     </UaaProvider>,   document.getElementById('root'), ); ``` |
```

## Docker Images

This section describes how to configure and run User Management for the client and server images using Local authentication for login.

|  |  |
| --- | --- |
|  | The examples below are just for development purposes and should never go to production. |

### Start User Management Instance By Docker

Before starting your containers, you need to create a custom Docker network.
This allows your containers to communicate with each other more easily.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` docker network create um-network ``` |
```

#### User Management Service

User Management provides the image named `com.mgmtp.a12.uaa:uaa-user-management-service`

To start a User Management Service Instance, the minimal UAA configuration needs to be provided via environment variables for the container to bootstrap successfully

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` docker run --name user-management-server -d -p 8080:8080 --network um-network \ -e SPRING_PROFILES_ACTIVE='um,dataservices-uaa,dataservices-embedded_postgres,dataservices-rpc' \ -e MGMTP_A12_UAA_AUTHENTICATION_TYPES='LOCAL' \ -e MGMTP_A12_UAA_AUTHENTICATION_CONTEXT-PATH='/api' \ -e MGMTP_A12_UAA_AUTHENTICATION_JWT_SECRET=${your-secret=} \ -e MGMTP_A12_UAA_AUTHENTICATION_PRINCIPAL_ACCESS-RIGHTS-RESOURCE='classpath:/access_rights.yaml' \ -e MGMTP_A12_UAA_AUTHENTICATION_PRINCIPAL_LOCAL-CONFIG_USER-RESOURCES='classpath:${your-users-yaml-file}' \ -e MGMTP_A12_UAA_AUTHORIZATION_CHILD_AUTHORIZATION_DEFINITIONS='classpath:user-management-authorization.json' \ -v ${your-users-yaml-file}:/var/lib/a12/BOOT-INF/classes/${your-users-yaml-file} \ a12-docker-local.dockerregistry.mgm-tp.com/com.mgmtp.a12.uaa/uaa-user-management-service:`9.2.2` ``` |
```

#### User Management Client

User Management provides the image named `com.mgmtp.a12.uaa:um-devapps-client`

As using Local authentication type so environment `idpHost, idpRealmName and idpClientId` are redundant.
However, the system still expects these fields to be configured, so you must enter placeholder text for each of them.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` docker run --name user-management-client -d -p 3000:80 --network um-network \   -e clientHost=http://localhost:3000 \   -e UAAServerHost=http://user-management-server:8080 \   -e idpHost=‘any-text’ \   -e idpRealmName=‘any-text’ \   -e idpClientId=‘any-text’ \   a12-docker-local.dockerregistry.mgm-tp.com/com.mgmtp.a12.uaa/um-devapps-client:9.2.2 ``` |
```

### Start User Management Instance By Docker-compose

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 ``` | ``` version: "3.9" services:   user_management-server:     image: a12-docker-local.dockerregistry.mgm-tp.com/com.mgmtp.a12.uaa/uaa-user-management-service:9.2.2     container_name: user_management-server     environment:       - SPRING_PROFILES_ACTIVE=um,dataservices-uaa,dataservices-embedded_postgres,dataservices-rpc       - MGMTP_A12_UAA_AUTHENTICATION_TYPES=LOCAL       - MGMTP_A12_UAA_AUTHENTICATION_CONTEXT-PATH=/api       - MGMTP_A12_UAA_AUTHENTICATION_JWT_SECRET=${your-secret}       - MGMTP_A12_UAA_AUTHENTICATION_PRINCIPAL_ACCESS-RIGHTS-RESOURCE=classpath:/access_rights.yaml       - MGMTP_A12_UAA_AUTHENTICATION_PRINCIPAL_LOCAL-CONFIG_USER-RESOURCES=classpath:users/*.yaml       - MGMTP_A12_UAA_AUTHORIZATION_CHILD_AUTHORIZATION_DEFINITIONS=classpath:user-management-authorization.json     volumes:       - ${your-users-yaml-file}:/var/lib/a12/BOOT-INF/classes/${your-users-yaml-file}     networks:       - um-network     ports:       - "8080:8080"    user_management-client:     image: a12-docker-local.dockerregistry.mgm-tp.com/com.mgmtp.a12.uaa/um-devapps-client:9.2.2     container_name: user_management-client     environment:       - clientHost=http://localhost:3000       - UAAServerHost=http://user_management-server:8080       - idpHost=any-text       - idpRealmName=any-text       - idpClientId=any-text     networks:       - um-network     ports:       - "3000:80"     depends_on:       - user_management-server  networks:   um-network:     name: um-network     driver: bridge ``` |
```

## Other Resources

* [JavaDoc](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/javadoc/index.html)
* [TypeDoc](https://geta12.com/docs/2025.06/ext5/user_management/um-documentation-src/assets/typedoc/index.html)

## Migration Instructions

### 2025.06

#### Breaking Changes

###### UserPOJOService

1. The function **queryUser** receives the parameter `filterPath` in slash form (Eg: /user/username) instead of dot form (Eg: user.username).
2. Introduce new overloaded function **queryUser** with extra parameter `isCaseSensitive` which determines whether the query would be executed in case-sensitive or not.

###### UserDocumentService

1. The function **getUserDocumentId** receives the parameter `List<ILogicOperator>` instead of List<String> filters

###### UMDocumentUtils

1. Remove function **queryDocuments**, use `UMQueryApiService` instead.

###### MultipleRealmsConfiguration

1. The functions **getUserDocumentIdpIdentifierField**, **getRoleDocumentIdpIdentifierField** and **getAccessRightDocumentIdpIdentifierField** of the `MultipleRealmsConfiguration` now must return the field path in slash form (Eg: /user/tenant) instead of dot form (Eg: user.tenant).

###### Document List scope

1. The scope **Document List** is replaced by scope **Query**
