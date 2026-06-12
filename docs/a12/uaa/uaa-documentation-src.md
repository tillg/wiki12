---
source: https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/index.html
category: uaa
docid: uaa-documentation-src
scraped: 2026-06-12
---

# User Authentication and Authorization

## Introduction

User Authentication Authorization (UAA) is a library for handling security aspects of your application. It can be used as a standalone library or inside Spring Boot application. See respective parts for detailed documentation.
The library is divided to separated modules.

**Security is divided into several modules**

* [Authentication](#authentication) - Authenticating users with various protocols and providing user principal.
* [Authorization](#authorization) - Resource, property and repository authorization.
* [Backend Authentication](#backend-authentication) - Authentication for back-end jobs.
* [Principal Extension](#uaa-principal-extension) - Authentication extension module providing customizable principal handling with many default implementations.
* [Rest Client](#rest-client) - Extensible JAVA REST client with UAA stack and support for UAA end-points.
* [Javascript Client](#javascript-client) - Client library for java-script applications.

There are two usage scenarios of the libraries:

* **A12 full stack**: The libraries are integrated in the A12 client (A12 client) and server component (A12 DataServices) in order to enable authentication and authorization in the A12 stack.
* **Project specific**: The libraries can also be used separate in custom client or server implementations.

UAA is providing mainly libraries and therefore no standalone server. The Java libraries have to be integrated in a Spring based application. The server side modules are tightly integrated with Spring Security.

## Authentication

`uaa-authentication` is a Spring module which is tightly integrated with Spring Security. It supports multiple authentication protocols (types) simultaneously. It has a side module `uaa-authentication-spring-boot-autoconfigure` for Spring Boot configuration support.

**UAA Feature Matrix**

[![Uaa Feature Matrix](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/uaa_feature_matrix.png "Uaa Feature Matrix")](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/uaa_feature_matrix.png)

A12 uses KeyCloak as IDP (Identity Provider). In this set-up KeyCloak is configured to provide functionality in regard to token management and password management. The A12 default set-up is supporting the following configuration.

[![Uaa Feature Matrix keycloak](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/uaa_feature_matrix_keycloak.png "Uaa Feature Matrix Keycloak")](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/uaa_feature_matrix_keycloak.png)

### Overview

UAA is built on Spring Security with extended functionality. It simplifies and standardizes most common authentication types.

* **LOCAL** - UAA acts as IDP (provides login endpoint) and is responsible for credential validation.
* **Active Directory
  LDAP** - UAA acts as IDP (provides login endpoint) but credentials are validated by AD server.
* **SAML** - Standard SAML protocol. External IDP is required.
* **UAA\_ACCESS\_TOKEN** - UAA understands JWT token which is created by other instance.
* **OAUTH2** - Standard OpenIDConnect/OAUTH2 protocol. External IDP is required.
* **CERTIFICATE** - Both client and server verify each other’s identity using certificates, ensuring two-way authentication.
* **API\_KEY** - Client api key is used for authentication. Validated by Root certificate.
* **Anonymous** - Anonymous access.
* **Custom** - Open type to be implemented by an Implementor.

#### Spring Security Architecture

Following diagram illustrates Spring Security architecture and all actors.

![Spring Authentication Architecture](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/spring_security_authentication_architecture.png)

Figure 1. Spring Authentication Architecture

Authentication starts in a respective filter where the payload is accepted and Authentication token is created. The token is used in authentication manager which is responsible to pick proper `AuthenticationProvider` based on the `AuthenticationToken` type.
The created token is **NOT** authenticated then the selected `AuthenticationProvider` will perform authentication.

|  |  |
| --- | --- |
|  | Here the Authentication means either verifying username/password or understanding a UAABearer/Bearer token. |

#### Authentication Handling

Each authentication type has dedicated `AuthenticationProvider` which is responsible for credential validation and providing final `AuthenticationToken` with principal which will be put into `SpringSecurityContext`.

The following diagram illustrates UAA `AuthenticationProvider`(s) and respective `AuthenticationToken`(s) which they handles.

![UAA Authentication Providers](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/authentication_providers.png "UAA Authentication Providers")

The result of the authentication process is a Spring Security `AuthenticationToken` which contains the following fields.

* `Principal` - An object which implements `UserDetails`.
* `Granted Authorities` - A collection of assigned roles to the user. Optional property and can be empty.

The Spring Security `AuthenticationToken` is stored into `SecurityContext` (Spring Security Context object) and used by a Java application during request processing.

|  |  |
| --- | --- |
|  | The `principal` also contains `granted authorities`. During further user processing those fields might differ because only the `principal` is updated. The `AuthenticationToken` stays untouched. Due to this fact it’s strongly recommended to use only `principal.authorities` in the code or during authorization. |

![Tokens](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/tokens.png "Tokens in the application")

#### Implementing Authentication Type

Each authentication type has its own configurer class named `<type>SecurityConfigurer`. The configurer class must extend the `UAASecurityConfigurer`. Each configurer class is annotated with respective authentication type `@ConditionalOnAuthentication(AuthenticationType.<Type>)`

Example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 ``` | ``` @Configuration @ConditionalOnAuthentication(AuthenticationType.CUSTOM) public class CustomSecurityConfigurer extends UAASecurityConfigurer<CustomSecurityConfigurer> { 	public void configure(HttpSecurity http) throws Exception { 	... 	}  	public void configureHttpSecurity(HttpSecurity http) throws Exception { 	... 	} } ``` |
```

On bootstrap time only the configured authentications are loaded and others are ignored.
The UAA provides main configuration class named `UAAGlobalSecurityConfiguration`.
The class is responsible for shared set-up and calling all loaded authentications based on `UAASecurityConfigurer`.

#### UAA security context configuration

UAA stack has main `context-path` which is secured and all endpoints are registered.
The configuration property is: `mgmtp.a12.uaa.authentication.context-path`.
Additionally, it’s possible to secure more context(s) of an application by defining list of those contexts in configuration: `mgmtp.a12.uaa.authentication.secured-contexts`

|  |  |  |  |
| --- | --- | --- | --- |
|  | The configuration is working together with standard spring context configuration `server.servlet.context-path`. The UAA `context-path` is a child of spring `context-path`. For example:  ``` |  |  | | --- | --- | | ``` 1 2 ``` | ``` server.servlet.context-path=/api mgmtp.a12.uaa.authentication.context-path=/xyz ``` | ```  This configuration leads that the UAA stack is registered to `/api/xyz` context. |

#### Configuration

Global UAA configurations:

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.types` | `LOCAL` | List authentication types used by the server |  |
| `mgmtp.a12.uaa.authentication.context-path` | `/` | UAA context where all endpoints are registered |  |
| `mgmtp.a12.uaa.authentication.secured-contexts` | `` | List of context(s) secured by UAA. Complementary to context-path |  |
| `mgmtp.a12.uaa.authentication.unauthorized-code` | `404` | Status code sent by the server when user is unauthorized. |  |

### Getting Started

Authentication can be used in Spring or Spring Boot applications. Choose proper section below for the required application type.

|  |  |  |  |
| --- | --- | --- | --- |
|  | For easier dependency management it’s possible to use UAA BOM  ``` |  |  | | --- | --- | | ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` 	<dependencyManagement> 		<dependencies> 			<dependency> 				<groupId>com.mgmtp.a12.uaa</groupId> 				<artifactId>uaa-bom</artifactId> 				<version>9.3.3</version> 				<type>pom</type> 				<scope>import</scope> 			</dependency>             <dependency> 				<groupId>com.mgmtp.a12.uaa</groupId> 				<artifactId>uaa-catalog</artifactId> 				<version>9.3.3</version> 				<type>pom</type> 				<scope>import</scope> 			</dependency> 		</dependencies> 	</dependencyManagement> ``` | ``` |

#### Security Information Preparing

There are certain security related configuration properties which need to be manually configured in order to make UAA working.

##### UAA Access Token

Authentication types which use [UAA Access Token](#uaa-token) requires JWT secret configuration `mgmtp.a12.uaa.authentication.jwt.secret`.
See [configuration](#token-generation-configuration)

|  |  |
| --- | --- |
|  | LOCAL, ACTIVE\_DIRECTORY\_LDAP, and SAML are authentication types that use UAA Access Token. |

##### SAML Authentication Type

With authentication type is SAML, private key/ certificate pairs for signing and encryption must be configured:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` spring.security.saml2.relyingparty.registration.uaa.signing.credentials[0].certificate-location spring.security.saml2.relyingparty.registration.uaa.signing.credentials[0].private-key-location  spring.security.saml2.relyingparty.registration.uaa.decryption.credentials[0].certificate-location spring.security.saml2.relyingparty.registration.uaa.decryption.credentials[0].private-key-location ``` |
```

Follows these steps to generate the private/public key for encryption and signing. During the private key encryption it’s needed to provide the password for the key.
After generating the key it’s possible to deploy it with the application and reference it from `classpath:` or as regular file `file:`. See the [Spring documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources-implementations) how to refer different resources.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` Generate private key: openssl genpkey  -out private.key -algorithm RSA -pkeyopt rsa_keygen_bits:4096  Generate certificate request openssl req -new -x509 -key private.key -out certificate.crt -days 1825   Validate pair: openssl pkey -in private.key -pubout -outform pem | sha256sum openssl x509 -in certificate.crt -pubkey -noout -outform pem | sha256sum ``` |
```

#### Spring Application

In a Spring application the following dependency needs to be added:

Maven:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` <dependency> 	<groupId>com.mgmtp.a12.uaa</groupId> 	<artifactId>uaa-authentication</artifactId> 	<version>9.3.3</version> </dependency> ``` |
```

Gradle:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` dependencies {     implementation "com.mgmtp.a12.uaa:uaa-authentication:9.3.3" } ``` |
```

Next step is to create a configuration class which loads proper authentication type and instantiates required beans.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 ``` | ``` @Configuration @Import([LocalSecurityConfigurer | ActiveDirectoryLdapSecurityConfigurer | SamlSecurityConfigurer | Oauth2SecurityConfigurer | Oauth2ClientSecurityConfigurer].class) public class AuthenticationConfiguration {  	@Inject 	private AuthenticationAutoconfigProperties authenticationAutoconfigProperties;  	@Bean 	public DataEncoder bypassingEncoder() { 		boolean isCompressUserEnable = authenticationAutoconfigProperties.getAuthentication().getJwt().getCompressUser().isEnabled(); 		if (isCompressUserEnable) { 			return new HuffmanEncoder(); 		} 		return new BypassingEncoder(); 	}  	@Bean 	public AnonymousPrincipalAdapter anonymousPrincipalAdapter() { 		return new PlainAnonymousPrincipalAdapter(); 	}  	@Bean 	public AuthenticationController createAuthenticationController() { 		return new AuthenticationController(); 	}  	@Bean 	public AuthenticationProperties authenticationProperties() { 		return authenticationAutoconfigProperties.getAuthentication(); 	} } ``` |
```

Last step is to implement the `LocalAuthenticationService<T extends UserDetails>`. The implementation is responsible for verifying user credentials.
See [LocalAuthenticationService](#local-authentication-service)

#### Spring Boot Application

In a Spring Boot application the following dependencies need to be added:

Maven:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` <dependency> 	<groupId>com.mgmtp.a12.uaa</groupId> 	<artifactId>uaa-authentication-spring-boot-autoconfigure</artifactId> 	<version>9.3.3</version> </dependency> ``` |
```

Gradle:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` dependencies {     implementation "com.mgmtp.a12.uaa:uaa-authentication-spring-boot-autoconfigure:9.3.3" } ``` |
```

Complete initialization is handled by the `uaa-authentication-spring-boot-autoconfigure` module.
No need to provide any additional configuration. The UAA uses default authentication type: LOCAL.
If you need different authentication type please check the respective section(s) below.

### Access Token

Access token is an encoded string which contains user identification, validity timestamp and optionally other user related data.
The **Access Token** is generated after successful authentication called login flow.
A client which initiated login flow stores the token and sends it with each request as an `Authorization` header.

**UAA supports three different types of Access Tokens**

* **UAA Access Token** - The token is generated by the UAA and used by authentication types **LOCAL, SAML, ACTIVE\_DIRECTORY\_LDAP**
* **IDP Access Token** - The token is generated by an IDP used by authentication type **OAUTH2**
* **API Key** - The certificate string base is used by authentication type **CERTIFICATE**

Each token is identified its own type in `Authorization` header

* `UAABearer` - UAA JWT token
* `Bearer` - OAUTH2 token
* `APIKey` - API\_Key

See the Authorization header format example for each type:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` Authorization: UAABearer <Token> Authorization: Bearer <Token> Authorization: APIKey <APIKey> ``` |
```

[![Token handling](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/token_handling.png "Token handling")](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/token_handling.png)

An access token contains user information which is used to reconstruct Spring Security [AuthenticationToken](#authentication-handling).

#### UAA Access Token

UAA generates and handles a standard [JWT token](https://jwt.io/).

UAA is capable for Access Token generation, renewal and validation.

##### Token Generation

The token contains a few required fields and optionally it can contain any key/value pair.

**Token contains those required fields**

* `userName` - login name
* `expiration time` - Token expiration timestamp.
* `initial login time` - Time when user logged in.

In basic set-up the Access token contains just the `username` and `authorities`. The server is responsible to reconstruct a principal object from the token. There are several extension points which helps to achieve that.

Another strategy is to serialize complete principal object to the token. The principal is serialized right after the login flow is finished. Only at that time the system has all necessary data for full principal object.
This strategy doesn’t require any user data stored locally. It can be (only) based on a response from an IDP which contains user data. Another advantage is when user data are gathered from remote data sources.
That means there is just one remote request compared to basic set-up which requires all remote requests at the beginning of each HTTP request coming to a server.

|  |  |
| --- | --- |
|  | When the principal is serialized in the token then the `authorization` are not serialized in the token separate field. Since they are part of the principal object. |

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
|  | UAA token with signing, encryption processes and serialization UserDetails into the token. It’s possible that the generated token will reach beyond the limit of header size. Please configure your environment in case you encounter the issue of header size is too big. In case you are running the application directly, you may need to configure Spring Boot/Tomcat properties to allow larger headers, for example:  ``` |  |  | | --- | --- | | ``` 1 2 ``` | ``` server.tomcat.maxHttpResponseHeaderSize=32KB server.max-http-request-header-size=48KB ``` | ```  If your application is deployed behind a reverse proxy (e.g., Nginx), you also need to increase proxy buffer sizes to avoid “header too large” errors. Example Nginx configuratio  ``` |  |  | | --- | --- | | ``` 1 2 3 4 5 ``` | ``` client_header_buffer_size 16k; large_client_header_buffers 8 48k; proxy_buffer_size 32k; proxy_buffers 4 32k; proxy_busy_buffers_size 64k; ``` | ```  Make sure to configure both the application server and the proxy consistently. |

When the principal is serialized it might be encoded. UAA supports concept of `DataEncoder` which might be used to compress the data.

UAA provides 2 implementations:

* `BypassingEncoder` - Don’t modify the input data. (Used by default)
* `HuffmanEncoder` - Compress the input data. (Enabled by configuration)

|  |  |
| --- | --- |
|  | When the complete user is stored in the token, it is serialized to json. Due to the limitation of Spring Security objects, there is a need to serialize class names into the data. This strategy prolongs serialized data and there might be a need to compress the data. `HuffmanEncoder` is the only one that is suitable for small data sizes with effective performance. |

Serialization and compression can be enabled by a [configuration option](#token-generation-configuration)

The token is secured by using RS256 (RSA Signature with SHA-256) where a private key is used for signing the JWT,
and HS256 (HMAC with SHA-256) where the same secret key (256 bits) is used for encrypting the JWT.

|  |  |
| --- | --- |
|  | UAA Authentication will return the token, its expiration time and expiration seconds in the response header by the name `access_token and token_renew_in_seconds`. |

|  |  |
| --- | --- |
|  | When you use with UAA Access Token and receive a `502 Bad Gateway` status in the response, you might need to increase the size of the response header. |

##### Token processing

The overview flow:

[![UAA Token processing](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/uaa_token_processing.png "UAA Token processing and extension points")](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/uaa_token_processing.png)

UAA has standard token processing which supports several extension points where implementors can hook their code and provide required data.
When the token is retrieved in the request by a header, it is a base data to reconstruct the principal for Spring `SecurityContext`.

###### Token Location

First step is to locate the token.
An implementation of the `JwtTokenLocator` is used.

UAA provides the default implementation which lookups the token in the request header.

###### Principal Creation

The Second step is to create a principal.
The principal object must implement Spring Security interface `UserDetails`.
The `principal` is created by an implementation of a `PrincipalCreator` interface. The implementation is responsible for converting a `token` string into `UserDetails` object.

UAA provides default implementation which handles principal creation from [UAA access token](#uaa-token).
It has several steps which will be processed.

* **Token Validation:** Check encrypted JWT pattern, the token signature to make sure that token wasn’t changed by public key, the token is still valid by the expiration date/time encoded in the token, and token’s blacklist.
* **Unpack Token:** Load all data from a token. Locate standard `subject` field which contains `userName` and `authorities` field which contains list of granted authorities.
  Check if the token contains complete serialized **userDetails** object.
  If the object is present, then deserialize and use it as the `principal`, the extraction is finished.
* **Create Principal:** This step is skipped if the `pricipal` from previous one is present, otherwise it is used to create standard `UAAPrincipal` object.
  The final principal contains username and an empty list of roles and extended data if provided.
  The extended data is loaded by implementation of the interface `UAAExtendedPrincipalDataLoader`.
  You also can implement `PrincipalAdapter` to create principal on your own.

|  |  |
| --- | --- |
|  | Principal creation can be customized, but please ensure you use @org.springframework.context.annotation.Primary together with @org.springframework.stereotype.Component to override it. |

##### Token renewal

For security reasons, it’s recommended to keep the access token lifetime short.
So the question is:

> How can we renew the user’s session without initiating the login flow using their credentials again and again?

To answer this question, UAA Authentication supports a token renewal feature, extending the amount of time it can be used with access tokens nearly expired.
In other words, it’s the token renewal.

###### Renewal mechanism

UAA Authentication uses the Authorization Code Flow with Proof Key for Code Exchange (PKCE) in conjunction with Silent Authentication to renew sessions.

###### How token renewal works

[![UAA Token renewal](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/silent_renew.png "UAA Token renewal")](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/silent_renew.png)

1. The client side creates a cryptographically-random `code_verifier` and from this generates a `code_challenge`.
2. Before redirecting a request to the Authorization Server, have the app generate `state` as a secured random string.
3. Store the `state` and `code_verifier` locally.
4. Request to the Authorization Server (`/uaa-authentication/authorize` [endpoint](#Authorize user)) with `state`, `code_challenge` and `id_token_hint`.
5. The server side verifies the `id_token_hint`.
6. Store the `code_challenge`, `id_token_hint` and responds back to the application with `state` and `code`, which is good for one use.
7. The client side verifies locally `state` with the `state` (created in step 2).
8. Sends the `code` and the `code_verifier` (created in step 1) to the Authorization Server (`/uaa-authentication/token` [endpoint](#Request tokens)).
9. The server side verifies the `code` and `code_verifier`.
10. The server side responds with an `access_token` and `token_renew_in_seconds` in the header.

|  |  |
| --- | --- |
|  | Initial login time remains unchanged after token refresh. |

**Response**

If all goes well, you’ll receive an HTTP 200 response with access\_token and token\_renew\_in\_seconds in the header:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` HTTP/1.1 200 OK access_token: eyJlbmABcdJBMjU2REfghiwiYWxnIjoiZGlyHn0... token_renew_in_seconds: 300 ``` |
```

##### Token Endpoints

UAA offers a bunch of token related endpoints.

* `tokenValid`
* `token`
* `authorize`
* `exchangeAuthorizationCodeToToken`
* `/user/logout`
* `/user/<auth type>/login`

There might be a situation that on some cluster nodes those endpoints should not be available. It can be switched of by [configuration](#token-generation-configuration).

##### Utility service

UAA provides a `JwtTokenService` for operations with UAA Access Token

* `generateToken`
* `isTokenValid`
* `invalidToken`
* `unpackToken`

##### Configuration

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.jwt.expiration-seconds` | `1800` | Token expiration time in seconds |  |
| `mgmtp.a12.uaa.authentication.jwt.token-renew-threshold-in-seconds` | `15` | How many seconds before token expiration to start silent renewal |  |
| `mgmtp.a12.uaa.authentication.jwt.secret` | `` | Token secret used for encryption and decryption. It must be 32 bytes length and Base64 encoded string | You need to change this default empty value |
| `mgmtp.a12.uaa.authentication.jwt.private-key-location` | `` | It is used for creating token signature. It is private RSA key resource file location | If you do not provide then use the default private RSA key was generating at runtime by UAA |
| `mgmtp.a12.uaa.authentication.jwt.public-key-location` | `` | It is used for verifying token signature. It is public RSA key resource file location | If you do not provide then use the default public RSA key was generating at runtime by UAA |
| `mgmtp.a12.uaa.authentication.jwt.header-name` | `Authorization` | Header name when token is stored in the header. |  |
| `mgmtp.a12.uaa.authentication.jwt.store-user-in-token.enabled` | `false` | Specify if user resolved after login should be stored in the token. |  |
| `mgmtp.a12.uaa.authentication.jwt.compress-user.enabled` | `false` | Specify if user should be compressed before it’s stored in the token. |  |
| `mgmtp.a12.uaa.authentication.jwt.user-lifetime-seconds` | `` | Specify allowed maximum time from first login until user is validated. Token refresh preserve initial login time. |  |
| `mgmtp.a12.uaa.authentication.jwt.token-endpoints.enabled` | `true` | Enable/disable a bunch of token related endpoints. |  |
| `mgmtp.a12.uaa.authentication.jwt.token-signature.enabled` | `true` | Enable/disable a creating and verifying token signature. | You think the token encrypted is enough for securing, and do not want the size of token is too big then you can disable (it’s not recommended) |

|  |  |
| --- | --- |
|  | In a cluster environment and token-signature is enabled, you have to provide the value for below keys:  1. `mgmtp.a12.uaa.authentication.jwt.private-key-location` 2. `mgmtp.a12.uaa.authentication.jwt.public-key-location` |

#### IDP Access Token

Access Token generated by an IDP server and UAA is able to read it. IDP is responsible for the token lifecycle and renewal.

Only **OAUTH2** authentication method supports the token generated by IDP.

##### Token handling

The token is retrieved in the request from a header and verified. It contains a base data to reconstruct the principal for Spring `SecurityContext`.
We support 2 types of token validation by [JWTDecode](#oauth2-rs-sequence-jwt-token-support) or [TokenIntrospector](#oauth2-rs-sequence-token-introspection-support).

The extraction is processed by the Spring Security.
Due to an Authorization paradigm we need to convert the principal which is based on the `UserDetails` interface.

###### Principal Conversion

**To convert Access Token to required principal we need converters.**

* **Oauth2ClaimsExtractor** - Convert Access Token to `UserDetails` principal.
* **Oauth2GrantedAuthorityConverter** - Extract collection of `GrantedAuthority` from the access token.

###### Oauth2ClaimsExtractor

The `Oauth2ClaimsExtractor` must be implemented by the client project because only the project knows how to convert data stored in Access Token into the principal based on `UserDetails`.

###### Oauth2GrantedAuthorityConverter

UAA provides a default implementation of `Oauth2GrantedAuthorityConverter`. The implementation just delegates to a Spring implementation which extract roles stored in well-known claims:

* scope
* scp

|  |  |
| --- | --- |
|  | The [Principal Extension](#uaa-principal-extension) provides complete OAUTH2 access token conversion logic out of the box. |

### LOCAL

LOCAL authentication type is used in the simple scenario where the application also acts as the Identity Provider (IDP).
This means that UAA provide login endpoint which verifies user credentials.
In this mode application is responsible for storing user data and validating user password.

LOCAL is using standard UAA `JWT Token` [generation](#token-generation) and [processing](#uaa-token-processing).

The authentication type provides an [extension points](#local-sequence) which allows connecting the application’s user data to UAA infrastructure.

|  |  |
| --- | --- |
|  | LOCAL authentication type is mainly intended for development purposes not for production usage! |

#### Login Flow

Initially it’s necessary to send a standard POST request to `/user/local/login` endpoint.
When the credentials are validated, UAA Access Token is generated and sent back as a response header.

For complete communication flow, see following screenshot:

![Local](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/flow_local.png "Local authentication flow")

#### Sequence Diagram

Login flow starts by sending a standard POST request to `/user/local/login` endpoint.
The credentials are validated in `LocalAuthenticationService` which returns user data.
In the success handler the UAA access token is generated based on user data.

For complete flow see following sequence diagram:

[![LOCAL sequence diagram](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/local.png "LOCAL sequence diagram")](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/local.png)

#### LocalAuthenticationService

The UAA has no notion where users are stored. An implementor is responsible for creating the user repository.

The UAA provides an interface `LocalAuthenticationService<T extends UserDetails>` which verify credentials and returns user object. The interface is required to be implemented by an implementor.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 ``` | ``` @Component public class ExampleLocalAuthenticationService implements LocalAuthenticationService<UserDetails> {  	@Override 	public UserDetails authenticate(String username, String rawPassword) { 		UserDetails loadedUser = loadUserFromRepository(username); 		if ((loadedUser == null) || (!rawPassword.equals(loadedUser.getPassword()))) { 			throw new BadCredentialsException(String.format("Invalid credentials for %s", userName)); 		} 		return new UAAPrincipal<>(username, "***", loadedUser.getAuthorities()); 	}  	private UserDetails loadUserFromRepository(String username) { 		// code 	}  } ``` |
```

#### Endpoints

UAA provides several endpoints for handling user-related requests.

##### Login

**user/<authentication\_type>/login** - POST endpoint for logging user

Example payload:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` {"username":"***", "password":"***"} ``` |
```

##### Logout

**user/logout** POST endpoint for logging out the user. After the logout, the token is stored to the token blacklist.

In production, It’s recommended that using cached storage to store blacklist tokens by configuration:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.uaa.authentication.cached-token-storage.enabled=true ``` |
```

|  |  |
| --- | --- |
|  | In case that the redirect configuration redirect to a different domain than front-end is running there might be problem with the CORS. |

#### Redirection

UAA has possibility to trigger redirects after successful and failure login. The configuration is unified for each authentication type where it’s possible.
Each redirect URL is validated by respective validation pattern. The `pattern` configuration is only required when respective redirect is validated.

|  |  |
| --- | --- |
|  | OAUTH2 is not supported because the `login/logout` flow is independent on UAA. |

The redirection can be triggered in two ways:

* statically - by the [configuration](#redirect-configuration).
* dynamically - enclose parameters `uaa_success` and `uaa_failure` within login/logout Http request using either query parameters or cookies.
  For example, with SAML, you can set the login redirect URL as a query parameter by appending those parameters to the login URL (self-configuration):

  ```
  |  |  |
  | --- | --- |
  | ``` 1 ``` | ``` mgmtp.a12.uaa.authentication.client-selfconfiguration.saml.login-relative.url=saml2/authenticate/uaa?uaa_success=http://localhost:3000&uaa_failure=http://localhost:3000/silent_renew ``` |
  ```

##### SameSite setting

The cookie needs to set `SameSite` parameter. This `SameSite` value can be configured by the properties.

Overview how `SameSite` cookie is working in a browser with combination of secured/un-secured connection and `Secured` attribute.
The below tables illustrate cookie values how it’s handled by a browser.

```
Application running on a domain (http://test.xx) over HTTP connection
```

| SameSite | Secured | Remark |
| --- | --- | --- |
| `UNSET` | ` ` | Working. |
| `NONE` | ` ` | NOT Working. |
| `NONE` | `Secured` | NOT Working. |

```
Application running on a localhost (http://localhost) over HTTP connection
```

| SameSite | Secured | Remark |
| --- | --- | --- |
| `UNSET` | ` ` | Working. |
| `NONE` | ` ` | NOT Working. |
| `NONE` | `Secured` | Working. |

```
Application running on a domain (https://test.xx) over HTTPS connection
```

| SameSite | Secured | Remark |
| --- | --- | --- |
| `NONE` | `Secured` | Working. |

|  |  |
| --- | --- |
|  | When the `SameSite` and `Secured` flag is not set browser keeps the cookies about 2 minutes and then drop them. |

##### Enable property

This can be configured in two ways:

* If client application uses the online self-configuration

| Configuration property | Value |
| --- | --- |
| `mgmtp.a12.uaa.authentication.cors.allow-credentials` | `true` |

* If client application uses the offline self-configuration

  + [From UAABEARER token add new field `allowCredentials` with value `true`](#offline-self-config)

##### Configuration

See in the following example:

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.logout.redirect.success.url` | `` | URL which will be redirected to after successful logout. | Optional |
| `mgmtp.a12.uaa.authentication.logout.redirect.url-pattern` |  | Validation pattern for success and failure logout redirect URLs | You need to change this default empty value |
| `mgmtp.a12.uaa.authentication.login.redirect.success.url` | `` | URL which will be redirected to after successful login. | Optional |
| `mgmtp.a12.uaa.authentication.login.redirect.failure.url` | `` | URL which will be redirected to after failed login. | Optional. Only available with Saml authentication |
| `mgmtp.a12.uaa.authentication.login.redirect.url-pattern` |  | Validation pattern for success and failure login redirect URLs | You need to change this default empty value |
| `mgmtp.a12.uaa.authentication.cookie.http-only.enabled` | `false` | Configure HttpOnly for SAML cookies. |  |
| `mgmtp.a12.uaa.authentication.cookie.same-site` | `NONE` | Configure Same site option for SAML cookies. Available values `NONE, UNSET, LAX, STRICT` |  |
| `mgmtp.a12.uaa.authentication.cookie.secured.enabled` | `false` | Configure secured for SAML cookies. |  |
| `mgmtp.a12.uaa.authentication.cookie.lifetime-seconds` | `180` | Define the lifetime for `redirect url` SAML cookie for after login success or failure. | If the login process might take time from the IDP login page (e.g, using ID card login method) then this value should be increase. |

### Active Directory (LDAP)

Active directory protocol is based on LDAP but with different semantics. It supports Microsoft Active Directory implementation as well as Samba (<https://www.samba.org/samba/>). AD is used to validate user credentials and store any kind of user data.
In this mode UAA acts also as the Identity Provider (IDP) and provide login endpoint.
After authentication the framework allows to convert data received from AD into a principal.

Active Directory uses standard UAA `JWT Token` [generation](#token-generation) and [processing](#uaa-token-processing).

#### Login Flow

Initially it’s necessary to send a standard POST request to `/user/active_directory_ldap/login` endpoint and the UAA acts as a proxy and contacts the AD controller.
When the credentials are validated, then the user data are processed from LDAP response and UAA Access Token is generated and sent back as a response header.

For complete communication flow, see following screenshot:

![Active Directory](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/flow_ad_ldap.png "Active Directory with header")

#### Sequence Diagram

After accepting login `POST` request the credentials are validated by the Spring Security infrastructure. When the credentials are validated an LDAP response converter is called. Implementor can provide an implementation of `UserDetailsContextMapper`. If there is no custom implementation then one from Spring security is used.

For complete interaction, see the following sequence diagram:

[![Active Directory sequence diagram](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/ad_ldap.png "Active Directory sequence diagram")](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/ad_ldap.png)

#### Endpoints

UAA provides several endpoints for handling user-related requests.

##### Login

**user/<authentication\_type>/login** - POST endpoint for logging user

Example payload:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` {"username":"***", "password":"***"} ``` |
```

##### Logout

**user/logout** POST endpoint for logging out the user. After the logout, the token is stored to the token blacklist.

In production, It’s recommended that using cached storage to store blacklist tokens by configuration:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.uaa.authentication.cached-token-storage.enabled=true ``` |
```

|  |  |
| --- | --- |
|  | In case that the redirect configuration redirect to a different domain than front-end is running there might be problem with the CORS. |

#### Redirection

UAA has possibility to trigger redirects after successful and failure login. The configuration is unified for each authentication type where it’s possible.
Each redirect URL is validated by respective validation pattern. The `pattern` configuration is only required when respective redirect is validated.

|  |  |
| --- | --- |
|  | OAUTH2 is not supported because the `login/logout` flow is independent on UAA. |

The redirection can be triggered in two ways:

* statically - by the [configuration](#redirect-configuration).
* dynamically - enclose parameters `uaa_success` and `uaa_failure` within login/logout Http request using either query parameters or cookies.
  For example, with SAML, you can set the login redirect URL as a query parameter by appending those parameters to the login URL (self-configuration):

  ```
  |  |  |
  | --- | --- |
  | ``` 1 ``` | ``` mgmtp.a12.uaa.authentication.client-selfconfiguration.saml.login-relative.url=saml2/authenticate/uaa?uaa_success=http://localhost:3000&uaa_failure=http://localhost:3000/silent_renew ``` |
  ```

##### SameSite setting

The cookie needs to set `SameSite` parameter. This `SameSite` value can be configured by the properties.

Overview how `SameSite` cookie is working in a browser with combination of secured/un-secured connection and `Secured` attribute.
The below tables illustrate cookie values how it’s handled by a browser.

```
Application running on a domain (http://test.xx) over HTTP connection
```

| SameSite | Secured | Remark |
| --- | --- | --- |
| `UNSET` | ` ` | Working. |
| `NONE` | ` ` | NOT Working. |
| `NONE` | `Secured` | NOT Working. |

```
Application running on a localhost (http://localhost) over HTTP connection
```

| SameSite | Secured | Remark |
| --- | --- | --- |
| `UNSET` | ` ` | Working. |
| `NONE` | ` ` | NOT Working. |
| `NONE` | `Secured` | Working. |

```
Application running on a domain (https://test.xx) over HTTPS connection
```

| SameSite | Secured | Remark |
| --- | --- | --- |
| `NONE` | `Secured` | Working. |

|  |  |
| --- | --- |
|  | When the `SameSite` and `Secured` flag is not set browser keeps the cookies about 2 minutes and then drop them. |

##### Enable property

This can be configured in two ways:

* If client application uses the online self-configuration

| Configuration property | Value |
| --- | --- |
| `mgmtp.a12.uaa.authentication.cors.allow-credentials` | `true` |

* If client application uses the offline self-configuration

  + [From UAABEARER token add new field `allowCredentials` with value `true`](#offline-self-config)

##### Configuration

See in the following example:

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.logout.redirect.success.url` | `` | URL which will be redirected to after successful logout. | Optional |
| `mgmtp.a12.uaa.authentication.logout.redirect.url-pattern` |  | Validation pattern for success and failure logout redirect URLs | You need to change this default empty value |
| `mgmtp.a12.uaa.authentication.login.redirect.success.url` | `` | URL which will be redirected to after successful login. | Optional |
| `mgmtp.a12.uaa.authentication.login.redirect.failure.url` | `` | URL which will be redirected to after failed login. | Optional. Only available with Saml authentication |
| `mgmtp.a12.uaa.authentication.login.redirect.url-pattern` |  | Validation pattern for success and failure login redirect URLs | You need to change this default empty value |
| `mgmtp.a12.uaa.authentication.cookie.http-only.enabled` | `false` | Configure HttpOnly for SAML cookies. |  |
| `mgmtp.a12.uaa.authentication.cookie.same-site` | `NONE` | Configure Same site option for SAML cookies. Available values `NONE, UNSET, LAX, STRICT` |  |
| `mgmtp.a12.uaa.authentication.cookie.secured.enabled` | `false` | Configure secured for SAML cookies. |  |
| `mgmtp.a12.uaa.authentication.cookie.lifetime-seconds` | `180` | Define the lifetime for `redirect url` SAML cookie for after login success or failure. | If the login process might take time from the IDP login page (e.g, using ID card login method) then this value should be increase. |

#### Configuration

UAA provides configuration keys for successful connection to AD server.

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.ldap.domain` | `mgm` | Server domain. | For MGM controller use 'mgm' as domain |
| `mgmtp.a12.uaa.authentication.ldap.url` | `ldap://localhost:389/` | Server URL |  |
| `mgmtp.a12.uaa.authentication.ldap.root-dn` | `DC=sambaad,DC=local` | Server root DN | For MGM controller use 'DC=mgm-edv,DC=de'. |
| `mgmtp.a12.uaa.authentication.ldap.search-filter` | `(&(objectClass=user)(sAMAccountName={1}))` | Template based search filter for user |  |

#### Example Local set-up

Default configuration is configured for local AD instance. The easiest way to set it up is to use docker. You can use the pre-configured image.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` docker pull sonohara/samba4-ad-dc ``` |
```

After the image is downloaded, you can start it by using your own command based on Docker run documentation ([link](https://docs.docker.com/engine/reference/commandline/run/)) - here is an example:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` sudo docker run --privileged -it -p 389:389 -e "DOCKER_DEBUG=1" -e "DNS_FORWARD=8.8.8.8" -e "DNS_DOMAIN=sambaad.local" -e "AD_PASSWORD=PASS0rd123" -e "AD_REALM=sambaad.local" -e "AD_DOMAIN=SAMBAAD" --restart=always sonohara/samba4-ad-dc ``` |
```

After the image is started, you need to create new user. Just connect to the running container with:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` docker exec -it $containerId /bin/bash ``` |
```

You can change policy for password with following command:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` samba-tool domain passwordsettings set <option> ``` |
```

We encourage you to set your own password policy.

* --complexity: Password complexity: on, off (default is on)
* --store-plaintext: Store plaintext passwords: on, off (default is off)
* --history-length: Password history length (default is 24)
* --min-pwd-length: Minimum password length (default is 7)
* --min-pwd-age: Minimum password age (default is 1)
* --account-lockout-duration: Account lockout duration (default is 30)
* --account-lockout-threshold: Account lockout threshold (default is 0)
* --reset-account-lockout-after: Reset account lockout after (default is 30)

Example:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` samba-tool domain passwordsettings set --complexity=off --history-length=0 --min-pwd-length=0 --min-pwd-age=0 --max-pwd-age=0 ``` |
```

and execute following shell command:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` samba-tool user create <user> <password> ``` |
```

### SAML

Security Assertion Markup Language (SAML) is an XML-based framework for authentication and authorization between two entities: a Service Provider and an Identity Provider (IDP). The Service Provider agrees to trust the IDP to authenticate users.
After successful authentication the IDP generates an authentication assertion, which indicates that a user has been authenticated. The assertion usually contains username, roles and optionally another custom data.
The assertion is sent back to the server which initiates the login.

SAML is a standard single sign-on (SSO) format. Authentication information exchanges through digitally signed XML documents. It is a complex single sign-on (SSO) implementation that enables seamless authentication.

For implementation, it’s used standard spring Saml2 integration with custom changes.

See [Spring SAML2 documentation](https://docs.spring.io/spring-security/reference/servlet/saml2/login/overview.html)

SAML uses standard UAA `JWT Token` [generation](#token-generation) and [processing](#uaa-token-processing).

#### Login Flow

SAML login flow starts with `GET` request to a Service Provider which generates a login request to the IDP.
When a credential is validated by the IDP the user data from IDP response are processed. Server creates a principal object and a UAA Access Token is generated.
It’s not sent back with the response but an authorization code is sent back in a redirect URL as a query parameter.
Using PKCE flow, the client needs to exchange the code to the token.

More details are described in the complete login flow diagram:

![SAML flow](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/flow_saml.png "SAML flow")

|  |  |
| --- | --- |
|  | Please be aware of that the login flow can be used for DDoS attack to make a lot of JWT Tokens. It’s necessary to limit request/seconds for avoiding this attack. |

#### Sequence Diagram

After successful credentials validation the IDP sends a user data called `Assertions` back to the Service Provider. Data are accepted by the `SamlAuthenticationConverter` which is responsible for creating an authentication token object.
The Assertions are processed by an implementation of `SamlAssertionExtractor` which create a principal object.
It’s a recommended practice that the `SamlAssertionExtractor` implementation uses `SamlGrantedAuthorityConverter` to extract authorities from the Assertions.
When principal is created the server generates, stores JWT token and sends back authentication code to the client.

For complete flow, see following sequence diagram:

[![SAML sequence diagram](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/saml.png "SAML sequence diagram")](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/saml.png)

#### Redirection

UAA has possibility to trigger redirects after successful and failure login. The configuration is unified for each authentication type where it’s possible.
Each redirect URL is validated by respective validation pattern. The `pattern` configuration is only required when respective redirect is validated.

|  |  |
| --- | --- |
|  | OAUTH2 is not supported because the `login/logout` flow is independent on UAA. |

The redirection can be triggered in two ways:

* statically - by the [configuration](#redirect-configuration).
* dynamically - enclose parameters `uaa_success` and `uaa_failure` within login/logout Http request using either query parameters or cookies.
  For example, with SAML, you can set the login redirect URL as a query parameter by appending those parameters to the login URL (self-configuration):

  ```
  |  |  |
  | --- | --- |
  | ``` 1 ``` | ``` mgmtp.a12.uaa.authentication.client-selfconfiguration.saml.login-relative.url=saml2/authenticate/uaa?uaa_success=http://localhost:3000&uaa_failure=http://localhost:3000/silent_renew ``` |
  ```

##### SameSite setting

The cookie needs to set `SameSite` parameter. This `SameSite` value can be configured by the properties.

Overview how `SameSite` cookie is working in a browser with combination of secured/un-secured connection and `Secured` attribute.
The below tables illustrate cookie values how it’s handled by a browser.

```
Application running on a domain (http://test.xx) over HTTP connection
```

| SameSite | Secured | Remark |
| --- | --- | --- |
| `UNSET` | ` ` | Working. |
| `NONE` | ` ` | NOT Working. |
| `NONE` | `Secured` | NOT Working. |

```
Application running on a localhost (http://localhost) over HTTP connection
```

| SameSite | Secured | Remark |
| --- | --- | --- |
| `UNSET` | ` ` | Working. |
| `NONE` | ` ` | NOT Working. |
| `NONE` | `Secured` | Working. |

```
Application running on a domain (https://test.xx) over HTTPS connection
```

| SameSite | Secured | Remark |
| --- | --- | --- |
| `NONE` | `Secured` | Working. |

|  |  |
| --- | --- |
|  | When the `SameSite` and `Secured` flag is not set browser keeps the cookies about 2 minutes and then drop them. |

##### Enable property

This can be configured in two ways:

* If client application uses the online self-configuration

| Configuration property | Value |
| --- | --- |
| `mgmtp.a12.uaa.authentication.cors.allow-credentials` | `true` |

* If client application uses the offline self-configuration

  + [From UAABEARER token add new field `allowCredentials` with value `true`](#offline-self-config)

##### Configuration

See in the following example:

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.logout.redirect.success.url` | `` | URL which will be redirected to after successful logout. | Optional |
| `mgmtp.a12.uaa.authentication.logout.redirect.url-pattern` |  | Validation pattern for success and failure logout redirect URLs | You need to change this default empty value |
| `mgmtp.a12.uaa.authentication.login.redirect.success.url` | `` | URL which will be redirected to after successful login. | Optional |
| `mgmtp.a12.uaa.authentication.login.redirect.failure.url` | `` | URL which will be redirected to after failed login. | Optional. Only available with Saml authentication |
| `mgmtp.a12.uaa.authentication.login.redirect.url-pattern` |  | Validation pattern for success and failure login redirect URLs | You need to change this default empty value |
| `mgmtp.a12.uaa.authentication.cookie.http-only.enabled` | `false` | Configure HttpOnly for SAML cookies. |  |
| `mgmtp.a12.uaa.authentication.cookie.same-site` | `NONE` | Configure Same site option for SAML cookies. Available values `NONE, UNSET, LAX, STRICT` |  |
| `mgmtp.a12.uaa.authentication.cookie.secured.enabled` | `false` | Configure secured for SAML cookies. |  |
| `mgmtp.a12.uaa.authentication.cookie.lifetime-seconds` | `180` | Define the lifetime for `redirect url` SAML cookie for after login success or failure. | If the login process might take time from the IDP login page (e.g, using ID card login method) then this value should be increase. |

SAML supports server side logout. In this scenario user is logged-out on IDP and IDP calls back application server.
In order to make it run it’s necessary to configure following options:

[![SAML Logout configuration](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/saml_config_logout.png "SAML Logout configuration")](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/saml_config_logout.png)

|  |  |
| --- | --- |
|  | In order to make SAML flow work with token exchange it’s necessary to have active `success` redirect either from parameter or configuration for both cases login and logout with IDP. |

#### Custom data in AuthnRequest

SAML `AuthnRequest` can be customized with a custom data. UAA supports 2 extension points for a customization.

##### Extensions

Data can be customized in the `Extensions` segment. There can be an arbitrary data defined in each request. It’s necessary to provide a spring bean which implements the `RequestExtensionsDataGenerator`.
It generates tree structure of the `RequestExtension` objects
See following example.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` <saml2p:Extensions> 	<akdb:AuthenticationRequest 		xmlns:akdb="https://www.akdb.de/request/2018/09" Version="2"> 		<akdb:AuthnMethods> 			<akdb:Benutzername> 				<akdb:Enabled>true</akdb:Enabled> 			</akdb:Benutzername> 		</akdb:AuthnMethods> 		<akdb:RequestedAttributes> 			<akdb:RequestedAttribute 				Name="urn:oid:1.2.40.0.10.2.1.1.261.94" RequiredAttribute="false" /> 			<akdb:RequestedAttribute 				Name="urn:oid:1.3.6.1.4.1.25484.494450.3" RequiredAttribute="false" /> 			<akdb:RequestedAttribute 				Name="urn:oid:2.5.4.4" RequiredAttribute="true" /> 		</akdb:RequestedAttributes> 	</akdb:AuthenticationRequest> </saml2p:Extensions> ``` |
```

Below is the example of implementation of `RequestExtensionsDataGenerator`. Each object can have its namespace, prefix, children’s and attributes.

See example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 ``` | ``` @Component public class BundIdRequestExtensionsDataGenerator implements RequestExtensionsDataGenerator {  	private static final String PREFIX = "akdb"; 	private static final String NAMESPACE = "https://www.akdb.de/request/2018/09";  	@Override 	public List<RequestExtension> generateExtensionData() {  		RequestExtension enabled = new RequestExtension.Builder("Enabled", PREFIX, "true").withNamespace(NAMESPACE).build(); 		RequestExtension benutzername = new RequestExtension.Builder("Benutzername", PREFIX, null).addChild(enabled).withNamespace(NAMESPACE).build();  		RequestExtension attribute1 = createAttribute("urn:oid:1.2.40.0.10.2.1.1.261.94", "false"); 		RequestExtension attribute2 = createAttribute("urn:oid:1.3.6.1.4.1.25484.494450.3", "false");  		RequestExtension attribute3 = createAttribute("urn:oid:2.5.4.4", "true");  		RequestExtension attributes = new RequestExtension.Builder("RequestedAttributes", PREFIX, null) 			.withNamespace(NAMESPACE) 			.addChild(attribute1) 			.addChild(attribute2) 			.addChild(attribute3) 			.build();  		RequestExtension authnMethods = new RequestExtension.Builder("AuthnMethods", PREFIX, null) 			.withNamespace(NAMESPACE) 			.addChild(benutzername) 			.build(); 		RequestExtension authRequest = 			new RequestExtension.Builder("AuthenticationRequest", PREFIX, null) 				.withNamespace(NAMESPACE) 				.addAttribute(new RequestExtension.Builder("Version", null, "2").build()) 				.addChild(authnMethods) 				.addChild(attributes) 				.build();  		return Arrays.asList(authRequest);  	}  	private RequestExtension createAttribute(String version, String required) { 		return new RequestExtension.Builder("RequestedAttribute", PREFIX, "") 			.withNamespace(NAMESPACE) 			.addAttribute(new RequestExtension.Builder("Name", "", version).build()) 			.addAttribute(new RequestExtension.Builder("RequiredAttribute", "", required).build()) 			.build(); 	}  } ``` |
```

##### RequestedAuthnContext

Another extension point is the `RequestedAuthnContext` element. It’s necessary to provide a spring bean of the `RequestContextDataGenerator` type.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` 	<saml2p:RequestedAuthnContext Comparison="minimum"> 		<saml2:AuthnContextClassRef 			xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">STORK-QAA-Level-1</saml2:AuthnContextClassRef> 		<saml2:AuthnContextClassRef 			xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">STORK-QAA-Level-2</saml2:AuthnContextClassRef> 		<saml2:AuthnContextDeclRef 			xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">Ref1-1</saml2:AuthnContextDeclRef> 		<saml2:AuthnContextDeclRef 			xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">Ref-2</saml2:AuthnContextDeclRef> 	</saml2p:RequestedAuthnContext> ``` |
```

Context data are just plain stings exept the comparison level as illustrated in the following code example.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 ``` | ``` @Component public class BundIdRequestContextDataGenerator implements RequestContextDataGenerator {  	@Override 	public List<String> generateClassReferenceData() { 		return Arrays.asList("STORK-QAA-Level-1", "STORK-QAA-Level-2"); 	}  	@Override 	public List<String> generateDeclarationReferenceData() { 		return Arrays.asList("Ref-1", "Ref-2"); 	}  	@Override 	public AuthnContextComparisonTypeEnumeration comparisonLevel() { 		return AuthnContextComparisonTypeEnumeration.MINIMUM; 	}   } ``` |
```

#### Custom data in assertion

SAML response can contain attributes with custom data in the assertion. The data has its own DTD type and can be processed with own un-marshaller.

See such attribute in the example:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` <saml2:Attribute Name="AddressInformation"> 	<saml2:AttributeValue 		xmlns:attr="http://www.domain.io/schema/saml/extensions" 		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="attr:AdresseType"> 		<attr:Street>Marienstr.</attr:Street> 		<attr:Number>12 a</attr:Number> 		<attr:Postalcode>06618</attr:Postalcode> 	</saml2:AttributeValue> </saml2:Attribute> ``` |
```

For each type it’s possible to register an un-marshaller and OpenSAML will process those types automatically.
There are multiple steps required for un-marshaller registration.

First it’s needed to hook own initializer which provide configuration file into `XMLObjectProviderRegistry`. see [Open SAML documentation](https://wiki.shibboleth.net/confluence/display/OS30/Initialization+and+Configuration).

The configuration will register new ObjectProvider(s) to process the custom attribute data.
See example configuration:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 ``` | ``` <XMLTooling xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 			xmlns="http://www.opensaml.org/xmltooling-config" xmlns:attr="http://www.domain.io/schema/saml/extensions">  	<ObjectProviders>  		<ObjectProvider qualifiedName="attr:AdresseType"> 			<BuilderClass className="<path to class extends org.opensaml.core.xml.io.AbstractSAMLObjectBuilder>"/> 			<MarshallingClass className="org.opensaml.core.xml.schema.impl.XSAnyMarshaller"/> 			<UnmarshallingClass className="<path to class extends org.opensaml.core.xml.io.AbstractXMLObjectUnmarshaller>"/> 		</ObjectProvider>   	</ObjectProviders>  </XMLTooling> ``` |
```

The configuration will register un-marshaller for `attr:AdresseType` which is referenced in the attribute by a `<saml2:AttributeValue xsi:type="attr:AdresseType">`. When it’s registered then attribute will be returned as deserialized POJO.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` public UserDetails extractAssertion(ResponseToken samlResponse) { 	Assertion assertion = CollectionUtils.firstElement(samlResponse.getResponse().getAssertions()); 	Map<String, List<Object>> attributes = SamlAssertionUtils.getAssertionAttributes(assertion); 	Optional<AddressInformationObject> address = SamlAssertionUtils.getAttributeValue(attributes, "AddressInformation", AddressInformationObject.class); } ``` |
```

|  |  |
| --- | --- |
|  | `AddressInformationObject` is an interface that extends from `org.opensaml.saml.common.SAMLObject`. It’s NOT recommended to serialize that such object into JWT token since it might contain a huge object graph! |

#### Custom SAML Assertion Extractor

Implement custom SAML Assertion Extractor require these conditions:

* Return type: SamlPrincipal (required by interface)
* Keep registration party ID (principal.setRelayingPartyRegistration(samlResponse.getToken().getRelyingPartyRegistration().getRegistrationId());
* it’s required to have the user serialized in the token otherwise user can’t be reconstructed from username

An example code:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` public class SampleSamlAssertionExtractor implements SamlAssertionExtractor {  	.............................  	@Override 	public SamlPrincipal extractAssertion(ResponseToken samlResponse) { 		............................. 		principal.setRelayingPartyRegistration(samlResponse.getToken().getRelyingPartyRegistration().getRegistrationId()); 		return principal; 	}  } ``` |
```

#### Example Local set-up

If you don’t have Keycloak yet, let create and start Keycloak: [Keycloak Setup](#keycloak-setup)

Then create Client: [Saml Client Login](#local-saml-client)

#### Configuration

SAML configuration is using the standard configuration from [Spring](https://docs.spring.io/spring-security/site/docs/current/reference/html5/#specifying-identity-provider-metadata).

See in the following example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` spring.security.saml2.relyingparty.registration.uaa.entity-id=urn:com:mgm:UAA spring.security.saml2.relyingparty.registration.uaa.assertingparty.metadata-uri=classpath:saml/saml-config.xml spring.security.saml2.relyingparty.registration.uaa.signing.credentials[0].private-key-location=classpath:encryption/sign_private.key spring.security.saml2.relyingparty.registration.uaa.signing.credentials[0].certificate-location=classpath:encryption/sign_certificate.crt spring.security.saml2.relyingparty.registration.uaa.decryption.credentials[0].private-key-location=classpath:encryption/enc_private.key spring.security.saml2.relyingparty.registration.uaa.decryption.credentials[0].certificate-location=classpath:encryption/enc_certificate.crt  spring.security.saml2.relyingparty.registration.uaa.singlelogout.response-url={baseUrl}/logout/saml2/slo spring.security.saml2.relyingparty.registration.uaa.singlelogout.binding=post  mgmtp.a12.uaa.authentication.saml.force-auth.enabled=true mgmtp.a12.uaa.authentication.saml.signing-algorithm.url=http://www.w3.org/2007/05/xmldsig-more#sha256-rsa-MGF1 ``` |
```

Where:

1. `uaa` is an arbitrary value that you choose for differentiating between registrations.
2. `urn:com:mgm:UAA`, `metadata-uri`, `signing.private-key-location`, `certificate.private-key-location`, `decryption.private-key-location`,
   `decryptiondecryption.private-key-location`, `baseUrl` depend on your setup.

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.saml.login.url` | `` | URL to be used to generate request to SAML server | Example: `http://localhost:8080/saml2/authenticate/{registrationId}?uaa_success=http://localhost:3000` |
| `mgmtp.a12.uaa.authentication.saml.idp-logout.enabled` | `true` | Define if logout from IDP will be performed during logout handling. | [idp config should enable too](#saml-idp-logout-config) |
| `mgmtp.a12.uaa.authentication.principal.saml-config.assertion-user-property` | `UserID` | Assertion property which holds username. |  |
| `mgmtp.a12.uaa.authentication.saml.signing-algorithm.url` | `` | Custom signing algorithm URN otherwise RSA\_SHA256 is used. |  |
| `mgmtp.a12.uaa.authentication.saml.force-auth.enabled` | `false` | Force require credentials after each login attempt. |  |
| `mgmtp.a12.uaa.authentication.saml.authorization-code-expiration-seconds` | `5` | Time when the saml authorizationCode is expired. | If your server or network is slow then the login flow might be failure then you need increase this value. |
| `mgmtp.a12.uaa.authentication.saml.assertion-lifetime-minutes` | `5` | Assertion lifetime after login time. Useful when clock are not precisely synchronized between app server and IDP. |  |
| `mgmtp.a12.uaa.authentication.cookie.lifetime-seconds` | `180` | Define the lifetime for `saml request id` SAML cookie. This cookie uses for verification to avoid an attacker-controlled account via CSRF | If the login process might take time from the IDP login page (e.g, using ID card login method) then this value should be increase. |

### Oauth2

From the definition <https://openid.net/connect/>
OpenID Connect 1.0 is a simple identity layer on top of the OAuth 2.0 protocol. It allows Clients to verify the identity of the End-User based on the authentication performed by an Authorization Server (IDP),
as well as to obtain basic profile information about the End-User in an interoperable and REST-like manner.

OpenID Connect allows clients of all types, including Web-based, mobile, and JavaScript clients, to request and receive information about authenticated sessions and end-users.
The specification suite is extensible, allowing participants to use optional features such as encryption of identity data, discovery of OpenID Providers, and session management, when it makes sense for them.

For developers, it provides a secure and verifiable answer to the question “What is the identity of the person currently using the browser or mobile app that is connected?”
Best of all, it removes the responsibility of setting, storing, and managing passwords which is frequently associated with credential-based data breaches.

#### Get An OAuth2 Access Token

OAuth defines two client types, based on their ability to authenticate securely with the IDP

##### Public

The OAUTH2 Public Login flow starts with GET request directly to the IDP server. After filling a credentials in a form the flow proceed to several call-backs which result is a access token.

For more details see following diagram:

![OAUTH2 Login Flow](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/flow_oauth2_public.png)

Figure 2. Oauth2 public Login Flow

##### Confidential

The OAUTH2 Confidential login flow is simpler than public, because with initial request the **client secret** is sent to the server.

For more details see following diagram:

![Security](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/flow_oauth2_confidential.png)

Figure 3. Oauth2 confidential authentication flow

#### Oauth2 Resource Server

The Oauth2 Resource Server features provide support for the Resource Server role as defined in the [OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749#section-1.1).

There are two types of token verify: JWT or Token Introspection.

These token validation are mutually exclusive and can’t be used simultaneously.

##### JWT

Server uses the public keys from IDP, and subsequently validate incoming JWTs.

For complete flow see following sequence diagram:
[![OAUTH2 RS sequence diagram](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/oauth2_rs.png "OAUTH2 RS sequence diagram")](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/oauth2_rs.png)

|  |  |
| --- | --- |
|  | JWT tokens are typically valid for a set period of time, and there is no built-in mechanism for [revoking](https://datatracker.ietf.org/doc/html/rfc7009) tokens before they expire, meaning that a compromised token may remain valid until it expires. |

###### Configuration

Enable Oauth2 authentication type.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.uaa.authentication.types=OAUTH2 ``` |
```

Realm configurations:

###### Single Realm - Spring Based

* Only IssuerUri

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` spring.security.oauth2.resourceserver.jwt.issuer-uri={baseUrl}/realms/{realmName} ``` |
```

1. Server does not require IDP for startup
2. Server requires IDP for token decoding for the first time
3. From decoding, token will be verified base on signatures, validity and issuer

* Only JwkSetUri

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` spring.security.oauth2.resourceserver.jwt.jwk-set-uri={baseUrl}/realms/{realmName}/protocol/openid-connect/certs spring.security.oauth2.resourceserver.jwt.jws-algorithms=RS256 ``` |
```

1. Server does not require IDP for startup
2. Server requires IDP for token decoding for the first time
3. From decoding, token will be verified base on signatures and validity

* Only PublicKey

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` spring.security.oauth2.resource-server.jwt.public-key-location=classpath:{realmRS256PublicKeyName}.pub spring.security.oauth2.resource-server.jwt.jws-algorithms=RS256 ``` |
```

1. Server does not require IDP for startup
2. Server does not require IDP for token decoding
3. From decoding, token will be verified base on signatures and validity

* Audience verification

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` spring.security.oauth2.resourceserver.jwt.audiences={client_id_1},{client_id_2} ``` |
```

It is recommended that resource server should verify all audiences it allows to access

By specifying this property, server will verify the `aud` claim in the upcoming token. At least one audience in the claim needs to be included in configured property so that the verification is success

Make sure IDP is configured to enclose `aud` claim within token

###### Multiple Tenants - UAA based

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` mgmtp.a12.uaa.authentication.oauth2.resourceserver.tenants[0].jwt.issuer-uri={idpBaseUrl}/realms/{realmName} mgmtp.a12.uaa.authentication.oauth2.resourceserver.tenants[0].jwt.jwk-set-uri={idpBaseUrl}/realms/{realmName}/protocol/openid-connect/certs mgmtp.a12.uaa.authentication.oauth2.resourceserver.tenants[0].jwt.jws-algorithms=RS256 mgmtp.a12.uaa.authentication.oauth2.resourceserver.tenants[0].jwt.public-key-location=classpath:{RealmPublicKey}.pub mgmtp.a12.uaa.authentication.oauth2.resourceserver.tenants[0].jwt.audiences={client_id} mgmtp.a12.uaa.authentication.oauth2.resourceserver.tenants[1].jwt.issuer-uri={idpBaseUrl}/realms/{realmName} mgmtp.a12.uaa.authentication.oauth2.resourceserver.tenants[1].jwt.jwk-set-uri={idpBaseUrl}/realms/{realmName}/protocol/openid-connect/certs mgmtp.a12.uaa.authentication.oauth2.resourceserver.tenants[1].jwt.jws-algorithms=RS256 mgmtp.a12.uaa.authentication.oauth2.resourceserver.tenants[1].jwt.public-key-location=classpath:{RealmPublicKey}.pub mgmtp.a12.uaa.authentication.oauth2.resourceserver.tenants[1].jwt.audiences={client_id} ``` |
```

If only the issuer-uri is configured, the Resource Server will use this property to further self-configure and discover the authorization server’s public keys. This process is triggered at startup.

If the jwk-set-uri is configured, the issuer-uri is used to validate the "iss" claim in the access token if the issuer-uri is configured.

The public-key-location is used if neither issuer-uri nor jwk-set-uri is configured.

It is recommended to enable audience verification by specifying `audiences` property per tenant.

##### Token Introspection

Server make a separate call to the introspection endpoint that host by IDP, and subsequently validate incoming JWTs.

Introspection endpoint response to the information that includes whether the token is currently active or not (it has expired or otherwise been [revoked](https://datatracker.ietf.org/doc/html/rfc7009)),
what rights of access the token carries (usually conveyed through OAuth 2.0 scopes), and the authorization context in which the token
was granted (including who authorized the token and which client it was issued to)

For complete flow see following sequence diagram:

[![OAUTH2 RS sequence diagram](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/oauth2_rs_online_token_check.png "OAUTH2 RS sequence diagram")](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/oauth2_rs_online_token_check.png)

|  |  |
| --- | --- |
|  | Introspection require additional network calls to the IDP for token validation and user information retrieval, which can affect performance. |

###### Configuration

###### Spring Based (single realm)

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` spring.security.oauth2.resourceserver.opaquetoken.introspection-uri={baseUrl}/realms/{realmName}/protocol/openid-connect/token/introspect spring.security.oauth2.resourceserver.opaquetoken.client-id={clientId} spring.security.oauth2.resourceserver.opaquetoken.client-secret={clientSecret} ``` |
```

1. Server does not require IDP for startup
2. Server requires IDP for token introspection

###### Multiple Tenants - UAA Based

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` mgmtp.a12.uaa.authentication.oauth2.resourceserver.tenants[0].opaquetoken.introspection-uri={baseUrl}/realms/{realmNameA}/protocol/openid-connect/token/introspect mgmtp.a12.uaa.authentication.oauth2.resourceserver.tenants[0].opaquetoken.client-id={clientId} mgmtp.a12.uaa.authentication.oauth2.resourceserver.tenants[0].opaquetoken.client-secret={clientSecret} mgmtp.a12.uaa.authentication.oauth2.resourceserver.tenants[1].opaquetoken.introspection-uri={baseUrl}/realms/{realmNameB}/protocol/openid-connect/token/introspect mgmtp.a12.uaa.authentication.oauth2.resourceserver.tenants[1].opaquetoken.client-id={clientId} mgmtp.a12.uaa.authentication.oauth2.resourceserver.tenants[1].opaquetoken.client-secret={clientSecret} ``` |
```

1. Server does not require IDP for startup
2. Server requires IDP for token introspection

##### Example Local Set-up

If you don’t have Keycloak yet

* Refer [here](#keycloak-setup) to create a Keycloak
* Refer [here](#local-oauth2-client-public-login) to create a Public client
* Refer [here](#local-oauth2-client-confidential-login) to create a Confidential client

#### Oauth2 Client

The OAuth2 Client features provide support for the Client role as defined in the [OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749#section-1.1).

It uses the authorization code grant to obtain an access token from IDP when process finished it will insert the user details from the token into the Spring Security context so that you are authenticated.

The cookie will be used for storing the session between the browser and this Client application.

##### Sequence Diagram

For complete flow, see the following sequence diagram:

[![OAUTH2 SSR sequence diagram](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/oauth2_ssr.png "OAUTH2 SSR sequence diagram")](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/oauth2_ssr.png)

##### Example Local Set-up

If you don’t have Keycloak yet

* Refer [here](#keycloak-setup) to create a Keycloak
* Refer [here](#local-ouath2-client-ssr-login) to create a Confidential client

##### Configuration

Enable Oauth2 authentication type.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.uaa.authentication.types=OAUTH2,OAUTH2_CLIENT ``` |
```

|  |  |
| --- | --- |
|  | Due to limitation of extracting JWT-TOKEN in UAA. For Oauth2 Client (OAUTH2\_CLIENT) but you have to turn on the Oauth2 Resource Server type (OAUTH2) also. It means by default your server always acts as Resource Server. We will keep you updated for further fixes. |

Realm(s) configurations for Client or for [Resource Server](#oauth2-resource-configuration)

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` spring.security.oauth2.client.registration.uaa.client-id={clientId} spring.security.oauth2.client.registration.uaa.client-secret={clientSecret} spring.security.oauth2.client.registration.uaa.authorization-grant-type=authorization_code spring.security.oauth2.client.registration.uaa.client-name={clientName} spring.security.oauth2.client.registration.uaa.scope=openid spring.security.oauth2.client.provider.uaa.issuer-uri={baseUrl}/realms/{realmName} ``` |
```

1. Server does not require IDP for startup
2. Server requires IDP for grant the access token

Where:

1. `uaa` is an arbitrary value that you choose for differentiating between registrations.
2. `clientId`, `clientSecret`, `clientName`, `baseUrl`, `realmName` these value are dependent on IDP setup.

Finally, for the logout

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` mgmtp.a12.uaa.authentication.oauth2.idp-logout.enabled=true mgmtp.a12.uaa.authentication.oauth2.post-logout.url={baseUrl} ``` |
```

### Certificate

Certificate is used for the authentication.
It can be useful for backend jobs.
Such jobs are executed just in the backend without user interaction (any credentials).
The strategy will avoid creating technical users in a IDP or somewhere else.

Each system or service is issued an X.509 certificate by our Root Certificate Authority (CA), which contains relevant information such as the system’s name and roles.
During authentication, the server verifies the client’s certificate (the “certificate”) to confirm its identity and permissions.

#### Sequence Diagram

![certificate](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/resources/images/certificate_sequence.png "Certificate authentication flow")

#### Preparing Steps

It’s recommended to install [OpenSSL](https://www.openssl.org/) tool.

* Certificate Authority (CA)

  + Create a configuration for CA certificate `openssl_ca.cnf`.

    ```
    |  |  |
    | --- | --- |
    | ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 ``` | ``` [ req ] distinguished_name = req_distinguished_name prompt = no  [ req_distinguished_name ] countryName             = AB stateOrProvinceName     = CD localityName            = EFG_HIJ organizationName        = MyOrg organizationalUnitName  = MyOrgUnit commonName              = mycommname emailAddress            = emailaddress@myemail.com  [ v3_ca ] basicConstraints = critical,CA:true,pathlen:0 keyUsage         = critical,keyCertSign,cRLSign ``` |
    ```
  + Generate rootCA (private) key:

    ```
    |  |  |
    | --- | --- |
    | ``` 1 ``` | ``` openssl genrsa -out ca.key 2048 ``` |
    ```

    1. Generates a 2048-bit RSA private key named ca.key
    2. This private key is used later to sign client/server certificates.
  + Create a self-signed CA certificate

    ```
    |  |  |
    | --- | --- |
    | ``` 1 ``` | ``` openssl req -x509 -new -nodes -key ca.key -sha256 -days 365 -out ca.pem -config openssl_ca.cnf -extensions v3_ca ``` |
    ```

    1. Creates a new certificate request and immediately self-signs it (-x509).
    2. Uses the CA’s private key (ca.key) to sign.
    3. Valid for 365 days.
    4. Outputs the CA’s certificate as ca.pem.
  + Import the CA certificate into a Truststore (If you only use one CA certificate)

    ```
    |  |  |
    | --- | --- |
    | ``` 1 ``` | ``` keytool -import -file ca.pem -alias "ca" -keystore truststore.p12 -storetype PKCS12 ``` |
    ```

    1. Imports the ca.pem certificate into a Java-compatible .p12 truststore.
    2. You must enter the password and keep it secret (Example: `kspassword`).
    3. The truststore is what your application (or other applications) will use to trust this CA when validating certificates.
  + Import the CA certificates into a Truststore (If you use more than one CA certificates)

    - Merge all CA certificates into one file

      ```
      |  |  |
      | --- | --- |
      | ``` 1 ``` | ``` cat ca1.pem ca2.pem > mergedCAs.pem ``` |
      ```

      1. Simply concatenates multiple PEM files into a single mergedCAs.pem file.
    - Create a temporary Java KeyStore (.jks)

      ```
      |  |  |
      | --- | --- |
      | ``` 1 2 3 4 5 ``` | ``` keytool -genkey -alias temp \   -keystore truststore.jks \   -storepass tspassword \   -keyalg RSA \   -dname "CN=dname" ``` |
      ```

      1. Generates a new (temporary) private key entry in a .jks keystore named truststore.jks and the password is tspassword.
      2. We’ll remove this entry immediately afterward.
         The purpose here is just to initialize an empty keystore file in .jks format.
    - Remove the temporary alias

      ```
      |  |  |
      | --- | --- |
      | ``` 1 2 3 ``` | ``` keytool -delete -alias temp \   -keystore truststore.jks \   -storepass tspassword ``` |
      ```
    - Import the merged CA certificates

      ```
      |  |  |
      | --- | --- |
      | ``` 1 2 3 4 5 6 ``` | ``` keytool -import -trustcacerts \   -alias rootCAs \   -file mergedCAs.pem \   -keystore truststore.jks \   -storepass tspassword \   -noprompt ``` |
      ```

      1. Imports all the CA certificates contained in mergedCAs.pem into truststore.jks.
    - Convert the .jks truststore to PKCS12

      ```
      |  |  |
      | --- | --- |
      | ``` 1 2 3 4 5 6 ``` | ``` keytool -importkeystore \   -srckeystore truststore.jks \   -srcstorepass tspassword \   -destkeystore truststore.p12 \   -deststorepass tspassword \   -deststoretype pkcs12 ``` |
      ```

      1. Converts truststore.jks to a PKCS12 file named truststore.p12.
* Client Certificate

  + Create a configuration for CA certificate `openssl_client.cnf`.
    In the client certificate it’s required to have custom attributes (those properties are identified by it’s own unique OID(s)):

    1. Roles (OID=1.2.276.128) - Required
    2. Country (OID=1.2.276.256) - Optional

       ```
       |  |  |
       | --- | --- |
       | ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 ``` | ``` oid_section = new_oids  [req] distinguished_name = req_distinguished_name prompt = no        # Stop confirmation prompts. All information is contained below. eq_extensions = uaa_extension   [ new_oids ] UserRoles=1.2.276.128       # 2=country,276=DE Country=1.2.276.256   [ req_distinguished_name ] stateOrProvinceName = Some-State localityName = Munich organizationName = MGM organizationalUnitName = Development commonName = admin  [ uaa_extension ] #UserRoles = ASN1:UTF8String:Admin,Manager 1.2.276.128=ASN1:UTF8String:Admin,Manager 1.2.276.256=ASN1:UTF8String:VN ``` |
       ```
  + Generate the client’s private key:

    ```
    |  |  |
    | --- | --- |
    | ``` 1 ``` | ``` openssl genrsa -out client.key 2048 ``` |
    ```

    1. Creates a 2048-bit RSA private key for the client.
  + Create the client’s CSR (Certificate Signing Request):

    ```
    |  |  |
    | --- | --- |
    | ``` 1 ``` | ``` openssl req -new -key client.key -out client.csr -config openssl_client.cnf -extensions uaa_extension ``` |
    ```

    1. Generates a CSR named client.csr using client.key.
    2. Reads additional certificate details/fields from openssl\_client.cnf and uses the extension named uaa\_extension.
  + Sign the client’s certificate with the CA:

    ```
    |  |  |
    | --- | --- |
    | ``` 1 ``` | ``` openssl x509 -req -in client.csr -CA ca.pem -CAkey ca.key -CAcreateserial -out client.crt -days 365 -extfile openssl_client.cnf -extensions uaa_extension ``` |
    ```

    1. Uses the CA’s key (ca.key) and certificate (ca.pem) to sign the client CSR.
    2. Creates client.crt, valid for 365 days.
    3. Adds extra extensions defined under uaa\_extension in your openssl\_client.cnf.
  + Export the client key and certificate to PKCS12

    ```
    |  |  |
    | --- | --- |
    | ``` 1 ``` | ``` openssl pkcs12 -export -out client.p12 -name "client" -inkey client.key -in client.crt -certfile ca.pem ``` |
    ```

    1. You must enter the password and keep it secret (Example: `clpassword`).
    2. Bundles the client’s private key and certificate (plus the CA certificate for the chain) into a single .p12 file.
    3. This .p12 can be used by your client-side application to present its certificate to the server.
* Server Certificate

  + Create a configuration for CA certificate `openssl_server.cnf`.

    ```
    |  |  |
    | --- | --- |
    | ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 ``` | ``` [req] distinguished_name = req_distinguished_name req_extensions = v3_req prompt = no  [req_distinguished_name] CN = localhost  # Set Common Name as localhost  [v3_req] keyUsage = keyEncipherment, dataEncipherment, digitalSignature extendedKeyUsage = serverAuth subjectAltName = @alt_names  [alt_names] DNS.0 = myexampleclient.com  # Include myexampleclient.com as a valid domain DNS.1 = localhost  # Include localhost as a valid domain ``` |
    ```
  + Generate the server’s private key:

    ```
    |  |  |
    | --- | --- |
    | ``` 1 ``` | ``` openssl genrsa -out server.key 2048 ``` |
    ```

    1. Creates a 2048-bit RSA private key for the server.
  + Create the server’s CSR

    ```
    |  |  |
    | --- | --- |
    | ``` 1 ``` | ``` openssl req -new -key server.key -out server.csr -config openssl_server.cnf -extensions v3_req ``` |
    ```

    1. Generates a CSR named server.csr using server.key.
    2. Reads certificate details/fields from openssl\_server.cnf and uses the v3\_req extension.
  + Sign the server’s certificate with the CA

    ```
    |  |  |
    | --- | --- |
    | ``` 1 ``` | ``` openssl x509 -req -in server.csr -CA ca.pem -CAkey ca.key -CAcreateserial -out server.crt -days 365 -extfile openssl_server.cnf -extensions v3_req ``` |
    ```

    1. Uses the CA’s key (ca.key) and certificate (ca.pem) to sign the server CSR.
    2. Creates server.crt, valid for 365 days.
    3. Includes your specified SAN (Subject Alternative Name) and Extended Key Usage
  + Export the server key and certificate to PKCS12

    ```
    |  |  |
    | --- | --- |
    | ``` 1 ``` | ``` openssl pkcs12 -export -out server.p12 -name "server" -inkey server.key -in server.crt -certfile ca.pem ``` |
    ```

    1. You must enter the password and keep it secret (Example: `svpassword`).
    2. Packages the server’s private key and certificate (plus the CA certificate) into one .p12 file.
    3. You can use this .p12 in a Spring Boot application as your server keystore for TLS.

##### Certificate Validator

In case you want to validate your own business you can implement `CertificateValidator` interface.

Below is an example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` @Component public class ProjectCertificateValidator implements CertificateValidator { 	private static final Logger LOGGER = LoggerFactory.getLogger(ProjectCertificateValidator.class);  	@Override 	public boolean validate(X509Certificate certificateToVerify) { 		// Your custom code here. 	}  } ``` |
```

##### Certificate Converter (principal)

Certificate needs to be converted to the principal object.

Below is example.
We will get the name, country and userRole attribute from the certificate for user principal creating.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 ``` | ``` public class CertificatePrincipalConverter implements CertificateConverter {  	private static final Logger LOGGER = LoggerFactory.getLogger(CertificatePrincipalConverter.class);  	private static final String COMMON_NAME = "CN"; // standard certificate attribute 	private static final String COUNTRY = "1.2.276.256"; // standard certificate attribute 	private static final String USER_ROLE = "1.2.276.128"; // our custom attribute  	@Inject 	private PrincipalProcessor principalProcessor;  	@Override 	public UserDetails convert(X509Certificate certificate) { 		String userNameValue = getAttributeValueFromCertificatePrincipal(certificate, COMMON_NAME); 		String roles = CertificateUtils.getAttributeValueFromCertificateExtension(certificate, USER_ROLE); 		String country = CertificateUtils.getAttributeValueFromCertificateExtension(certificate, COUNTRY);  		Set<GrantedAuthority> grantedAuthorities = Arrays.asList(roles.split(",")).stream() 			.map(roleName -> new SimpleGrantedAuthority(roleName)) 			.collect(Collectors.toSet()); 		AbstractExtendedPrincipal<?> user = principalProcessor.createPrincipal(userNameValue, grantedAuthorities, certificate); 		return user;  	}   	private String getAttributeValueFromCertificatePrincipal(X509Certificate certificate, String attributeName) { 		try { 			String subjectName = certificate.getSubjectX500Principal().getName(); 			LdapName ldapName = new LdapName(subjectName); 			return ldapName.getRdns() 				.stream() 				.filter(rdn -> rdn.getType().equals(attributeName)) 				.findFirst().get().getValue().toString(); 		} catch (InvalidNameException e) { 			LOGGER.error("Has error when get attribute value from certificate subject name", e); 		} 		return null; 	}  } ``` |
```

#### Configuration

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `server.ssl.key-store` |  | Path to the KeyStore (.p12 file) containing the server’s own private key and certificate chain. | The server must present this certificate to prove its identity to clients. |
| `server.ssl.key-store-password` |  | Password used to unlock the KeyStore file. | Without it, Spring Boot cannot load the server’s private key at startup. |
| `server.ssl.key-store-type` |  | Lets Spring Boot know how to parse the keystore file. |  |
| `server.ssl.client-auth` |  | Determines whether the server requires, wants, or disables client authentication. Values: NEED, WANT, NONE. | - NONE (just TLS): The server doesn’t ask for a client certificate at all. One-way TLS; any browser or app can connect.  - WANT (optional mTLS): The server requests a client certificate but won’t fail the handshake if it’s missing. If the client sends one, the server verifies it; if not, the connection still works.  - NEED (strict mTLS): A valid client certificate is mandatory. If the client can’t present one that chains to the server’s trust-store, the handshake is terminated. |
| `server.ssl.trust-store` |  | Path to the TrustStore containing CA certificates that the server trusts for validating client certs. | Without a trust store, the server cannot verify incoming client certificates during the TLS handshake. |
| `server.ssl.trust-store-password` |  | Password to unlock the TrustStore. | Required if the trust‑store file is password‑protected. |
| `server.ssl.trust-store-type` |  | Format of the TrustStore. | Ensures Spring Boot reads the trust‑store correctly so it can validate client certs. |
| `mgmtp.a12.uaa.authentication.principal.certificateConfig.user-name-field` | `/**` | Define field where to find username in distinguished names. |  |
| `mgmtp.a12.uaa.authentication.principal.certificateConfig.user-role-field` | `/**` | Define field where to find user roles. Comma separated list. |  |
| `mgmtp.a12.uaa.authentication.certificate-white-list-access-url-patterns` |  | Define what are urls pattern can be use the Certificate authentication. | The url should be specific as the security advise. Then this default configure should be changed by project, you can provide one or multiple urls pattern separated by commas. |

|  |  |
| --- | --- |
|  | * Certificate authentication is meant to be used as communication between services e.g.: technical users.   We don’t recommend to it for real users. * The attributed user role(s) within the client certificate should be specific for its purpose and follow the principle of least privilege. * Keep certificates secret and be aware that disclosure of the certificates would require recreation of a new rootCA and client certificates. * Always configure mgmtp.a12.uaa.authentication.certificate-white-list-access-url-patterns for the dedicated endpoints supporting certificate-based authentication. |

### API Key

An Api Key is used for the authentication. It can be useful for backend jobs. Such jobs are executed just in the backend without user interaction (any credentials).
The strategy will avoid creating technical users in a IDP or somewhere else.

The api key will be issued by Root Certificate (CA) and contains some information likes system’s name and system’s roles.

#### Sequence Diagram

![apikey](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/apikey_sequence.png "APIKey authentication flow")

#### Preparing Steps

##### Generate X.509 key

For API Key generation. It’s recommended to install [OpenSSL](https://www.openssl.org/) tool.

Two keys are generated. One for server and second for client.

###### Create a custom openSSL configuration

In order to add new key attributes, do the following steps:

Create a configuration for server key `openssl_server.cnf`.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` [req] distinguished_name = req_distinguished_name prompt = no        # Stop confirmation prompts. All information is contained below.   [ req_distinguished_name ]  stateOrProvinceName = Some-State localityName = Munich organizationName = MGM organizationalUnitName = Development commonName = UAA-Server ``` |
```

Create a configuration for client key `openssl_client.cnf`. In the client key it’s required to have custom attributes:

1. Roles (OID=1.2.276.128) - Required
2. Country (OID=1.2.276.256) - Optional

Those properties are identified by its own unique OID(s). They are put to key extension.

|  |  |
| --- | --- |
|  | The `username` is taken from `commonName` in distinguished name section. |

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 ``` | ``` oid_section = new_oids  [req] distinguished_name = req_distinguished_name prompt = no        # Stop confirmation prompts. All information is contained below. req_extensions = uaa_extension   [ new_oids ] UserRoles=1.2.276.128       # 2=country,276=DE Country=1.2.276.256   [ req_distinguished_name ] stateOrProvinceName = Some-State localityName = Munich organizationName = MGM organizationalUnitName = Development commonName = admin   [ uaa_extension ] #UserRoles = ASN1:UTF8String:Admin,Manager 1.2.276.128=ASN1:UTF8String:Admin,Manager 1.2.276.256=ASN1:UTF8String:VN ``` |
```

###### API Key Generation

1. **Generate rootCA (private) key:**

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` openssl genpkey -out rootCA.key -algorithm RSA -pkeyopt rsa_keygen_bits:4096 ``` |
```

* **Generate rootCA certificate:**

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` openssl req -new -x509 -key rootCA.key -out rootCA.crt -days 4096 -config ./openssl_server.cnf ``` |
```

* **Generate client key:**

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` openssl req -newkey rsa:4096 -keyout client.key -out client.csr -config ./openssl_client.cnf -extensions uaa_extension ``` |
```

It will request creates a new key request and a new private key. You must type in 4 to 1023 characters.

* **Sign the client key with our root CA authority:**

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` openssl x509 -req -CA rootCA.crt -CAkey rootCA.key -in client.csr -out client.crt -days 4096 -CAcreateserial -extfile ./openssl_client.cnf -extensions uaa_extension ``` |
```

|  |  |  |  |
| --- | --- | --- | --- |
|  | In order to print generated key you can use following command:  ``` |  |  | | --- | --- | | ``` 1 ``` | ``` openssl x509 -in <name>.crt -text -noout ``` | ``` |

|  |  |
| --- | --- |
|  | The rootCA.crt (Step 2) is used by UAA Server to verify the client.crt (Step 4). |

**Example:**
![open ssl](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/uaa_apikey.png "Gennerate key")

##### APIKey Validator

UAA provides default implementation to check the time to live and was correct signature.
In case you want to change this default validator you can create a custom `APIKeyValidator` implementation.

Below is an example:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` @Component public class ProjectAPIKeyValidator implements APIKeyValidator { 	private static final Logger LOGGER = LoggerFactory.getLogger(ProjectAPIKeyValidator.class);  	@Override 	public boolean validate(X509Certificate certToVerify, List<X509Certificate> rootCAs) { 		// Your custom code here. 	} } ``` |
```

##### API Key Converter (principal)

API Key needs to be converted to the principal object.

Below is example. We will get the name, country and userRole attribute from the key for user principal creating.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 ``` | ``` @Component public class APIKeyPrincipalConverter implements CertificateConverter {  	private static final Logger LOGGER = LoggerFactory.getLogger(ProjectAPIKeyPrincipalCreator.class);  	private static final String COMMON_NAME = "CN"; // standard certificate attribute 	private static final String COUNTRY = "1.2.276.256"; // standard certificate attribute 	private static final String USER_ROLE = "1.2.276.128"; // our custom attribute  	@Inject 	private PrincipalProcessor principalProcessor;  	@Override 	public UserDetails convert(X509Certificate certificate) { 		String userNameValue = getAttributeValueFromCertificatePrincipal(certificate, COMMON_NAME); 		String roles = CertificateUtils.getAttributeValueFromCertificateExtension(certificate, USER_ROLE); 		String country = CertificateUtils.getAttributeValueFromCertificateExtension(certificate, COUNTRY);  		Set<GrantedAuthority> grantedAuthorities = Arrays.asList(roles.split(",")).stream() 			.map(roleName -> new SimpleGrantedAuthority(roleName)) 			.collect(Collectors.toSet()); 		AbstractExtendedPrincipal<?> user = principalProcessor.createPrincipal(userNameValue, grantedAuthorities, certificate); 		return user;  	}   	private String getAttributeValueFromCertificatePrincipal(X509Certificate certificate, String attributeName) { 		try { 			String subjectName = certificate.getSubjectX500Principal().getName(); 			LdapName ldapName = new LdapName(subjectName); 			return ldapName.getRdns() 				.stream() 				.filter(rdn -> rdn.getType().equals(attributeName)) 				.findFirst().get().getValue().toString(); 		} catch (InvalidNameException e) { 			LOGGER.error("Has error when get attribute value from certificate subject name", e); 		} 		return null; 	}  } ``` |
```

#### Configuration

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.api-key-authority-resources` |  | This is rootCA which is generated [here](#ca_generate) (step 2) by project (For example: classpath:/certificate/rootCA.crt or 'file:///absolute\_path/rootCA.crt') | You can provide one or multiple resources separated by commas. |
| `mgmtp.a12.uaa.authentication.api-key-white-list-access-url-patterns` |  | Define what are urls pattern can be use the certificate authentication. | The url should be specific as the security advise. There is no default value so that it must be provided by project, you can provide one or multiple urls pattern separated by commas. |
| `mgmtp.a12.uaa.authentication.principal.apiKeyConfig.user-name-field` | `/**` | Define field where to find username in distinguished names. |  |
| `mgmtp.a12.uaa.authentication.principal.apiKeyConfig.user-role-field` | `/**` | Define field where to find user roles. Comma separated list. |  |

|  |  |
| --- | --- |
|  | * API Key authentication is intended for service-to-service communication (e.g., technical users). It is not recommended for authenticating real end users. * The attributed user role(s) within the API Key should be specific for its purpose and follow the principle of least privilege. * Keep the API Key confidential. If the key is disclosed, you must recreate the root CA and client key. * Always configure mgmtp.a12.uaa.authentication.api-key-white-list-access-url-patterns to specify the dedicated endpoints that support API Key-based authentication. |

### Anonymous

UAA supports **Anonymous** access. The anonymous access can be configured for certain URLs. Those URLs will be accessible to outside world and no authentication is needed.
`AnonymousAuthenticationToken` is created automatically with configured roles.

|  |  |
| --- | --- |
|  | Principal type is aligned with all other authentication type(s). |

|  |  |
| --- | --- |
|  | In SpEL you can identify the user by following expressions:  * isAnonymous() * hasRole([configured role]) |

|  |  |
| --- | --- |
|  | The principal is processed in the same way like in other authentication types. If the principal extension is used, the object is filled with configured Access Rights. There is possibility to register custom principal instance by implementing the `AnonymousPrincipalAdapter` interface. |

#### Configuration

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.anonymous.access.urls` | `` | Comma separated list of URLs. Wildcards are allowed like /models/\*\* |  |
| `mgmtp.a12.uaa.authentication.anonymous.roles` | `ROLE_ANONYMOUS` | Comma separated list of roles. |  |

### UAA Access Token

UAA access token authentication is a mode where UAA doesn’t offer any login endpoint (to generate token), but understands the UAA access token generated by different service.

|  |  |
| --- | --- |
|  | UAA access token can be unpacked only if the secret is configured to the same value like in a service which creates the token. |

For more information about visit [JWT token section](#uaa-token)

### Client Self Configuration

Self configuration means client (JavaScript or JavaRestClient) will download configurations from server and configure it instead of keeping configuration on client side.
This would allow more flexible on deployment in different environment for both java-script and java-rest clients.

The server configuration has following the below properties:

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.application-base.url` | `http://localhost:8080` | Base url of the application. | You should change to your application domain. |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.uaa-base.url` | `http://localhost:8080` | Base url of the UAA application. | You should change to your uaa application domain. |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.authorization-data-store` | `` | Spring `resource` where the authorization token is persisted. |  |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.excluded-delegated-contexts` | `` | Excluded context patterns. | Only valid with `DELEGATED` mode. If you work with un-secure urls then you should ignore it by this config. |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.saml.login-relative.url` | `` | Relative url pattern "saml2/authenticate/{clientId}". | You have to provide this url (e.g saml2/authenticate/uaa). |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.saml.sso-configuration.username-xpath` | `` | Xpath for Login name field on the IDP page. |  |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.saml.sso-configuration.password-xpath` | `` | Xpath for password field on the IDP page. |  |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.saml.sso-configuration.login-button-xpath` | `` | Xpath for login button on the IDP page. |  |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.oidc.confidential-client.idp-base.url` | `http://localhost:9090` | Base url of the IDP. | You should change to your IDP domain. |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.oidc.idp-logout.enabled` | `true` | Client logout also trigger logout IDP. | Change to 'false' if you just want logout your application, IDP session will be remained. |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.oidc.confidential-client.client-id` | `` | OAUTH2 client ID for confidential client type. |  |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.oidc.confidential-client.realm-name` | `` | Realm name on the IDP. |  |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.oidc.public-client.idp-base.url` | `http://localhost:9090` | Base url of the IDP. | You should change to your IDP domain. |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.oidc.public-client.client-id` | `` | OAUTH2 client ID for public client type. |  |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.oidc.public-client.realm-name` | `` | Realm name on the IDP. |  |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.oidc.public-client.login-redirect-relative.url` | `callback` | The relative url uses to redirect after the authentication request (above) successfully. |  |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.oidc.public-client.silent-redirect-relative.url` | `silent_renew.html` | The relative url uses to redirect after the token renew successfully". |  |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.oidc.public-client.logout-redirect-relative.url` | `logout` | The relative url uses to redirect to client after the logout successfully. |  |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.oidc.public-client.currentUserUrl` | `` | If set, the library calls this URL to load the current user. If omitted, defaults to `${baseUrl}uaa-authentication/currentUser`. |  |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.oidc.public-client.enable-refresh-token-grant` | `false` | If true, the library exchanges the stored refresh token for a new access token and skips the silent renew HTML page. | WARNING: If you set this property to `true`, you must follow [Using OIDC Refresh Token](#using-oidc-refresh-token). |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.oidc.public-client.sso-configuration.username-xpath` | `` | Xpath for Login name field on the IDP page. |  |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.oidc.public-client.sso-configuration.username-xpath` | `` | Xpath for Login name field on the IDP page. |  |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.oidc.public-client.sso-configuration.password-xpath` | `` | Xpath for password field on the IDP page. |  |
| `mgmtp.a12.uaa.authentication.client-selfconfiguration.oidc.public-client.sso-configuration.login-button-xpath` | `` | Xpath for login button on the IDP page. |  |

UAA provides end-point to get this self-configuration info

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` YOUR_DOMAIN/<context>/uaa-authentication/selfconfigure ``` |
```

(The end-point is un-secured).

The data output will depend on what authentication types are running on UAA server and what you provided by `mgmtp.a12.uaa.authentication.client-selfconfiguration.` above.

Below is an example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 ``` | ``` {    "applicationBaseUrl":"http://localhost:8080",    "uaaBaseUrl":"http://localhost:8080",    "authorizationDataStore":"",    "excludedDelegatedContexts":null,    "local":{       "loginRelativeUrl":"user/local/login",       "logoutRelativeUrl":"user/logout",       "logoutMethod":"POST",       "tokenType":"UAABEARER"    },    "activeDirectoryLdap":{       "loginRelativeUrl":"user/active_directory_ldap/login",       "logoutRelativeUrl":"user/logout",       "logoutMethod":"POST",       "tokenType":"UAABEARER"    },    "saml":{       "loginRelativeUrl":"saml2/authenticate/uaa?uaa_success=http://localhost:3000",       "logoutRelativeUrl":"user/logout?uaa_success=http://localhost:3000",       "logoutMethod":"POST",       "tokenType":"UAABEARER",       "ssoConfiguration":{          "userNameXpath":"//input[@name='username']",          "passwordXpath":"//input[@name='password']",          "loginButtonXpath":"//button[@name='login']"       }    },    "oidc":{       "tokenType":"BEARER",       "confidentialClient":{          "loginRelativeUrl":"token",          "clientId":"uaa-auth-client",          "realmName":"UAARealm",          "idpBaseUrl":"http://localhost:9090"       },       "publicClient":{          "loginRelativeUrl":"auth",          "clientId":"uaa-spa-client",          "realmName":"UAARealm",          "idpBaseUrl":"http://localhost:9090",          "tokenExchangeRelativeUrl":"token",          "loginRedirectRelativeUrl":"callback",          "logoutRedirectRelativeUrl":"logout",          "silentRedirectRelativeUrl":"silent_renew.html",          "ssoConfiguration":{             "userNameXpath":"//input[@name='username']",             "passwordXpath":"//input[@name='password']",             "loginButtonXpath":"//button[@name='login']"          }       }    },    "tokens":[       {          "authorizationHeaderName":"Authorization",          "tokenType":"UAABEARER",          "generatedTokenHeaderName":"access_token"       },       {          "authorizationHeaderName":"Authorization",          "tokenType":"BEARER"       },       {          "authorizationHeaderName":"Authorization",          "tokenType":"CERT"       }    ] } ``` |
```

|  |  |
| --- | --- |
|  | * **applicationBaseUrl**: This is the base URL for the application that provide the protected resource. * **uaaBaseUrl**: This is the base URL for the application that provide the authentication flow and token. * **authorizationDataStore**: this is a location where persistent authorization data into file system (only valid for java-rest-client). * **excludedDelegatedContexts**: this is for exclude some urls with DELEGATED mode (only valid for java-rest-client). * **local, activeDirectoryLdap, saml, oauth2**: contains the detail information for create the login, logout flow for each authentication types. * **tokens**: this contains the detail information for get token and send to token to server for each TokenType. |

### Other Security Aspects

Authentication module covers also security aspects which are not tightly bound to the Authentication

#### Unsecured for Urls support

Ignore the security check from UAA for any matching endpoints.

These endpoints will not go through any security filters, including Cors filter, meanwhile the `permitAll` (security matcher of Spring Framework) endpoints are still affected by security filters

Configuration:

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.unsecured.urls` |  | List of unsecured urls that Spring security would completely ignore all security filters, headers, CSRF,…​ | Example: /actuator/health,/user/\*\*. Note: By specifying this property, Spring will give you some warning logs, please configure your log system to ignore them if you don’t want to see |

#### Actuator support

Actuator shares authentication type with other endpoints. In order to access actuator endpoints you need to authenticate and then it’s possible to use authorization in the scope `RelativePath`.
Other option is to add actuator endpoint to unsecured URLs and keep them open.

#### Cross-Origin Resource Sharing (CORS)

Cross-Origin Resource Sharing (CORS) is a mechanism that uses additional HTTP headers to tell browsers to give a web application running at one origin, access to selected resources from a different origin.
A web application executes a cross-origin HTTP request when it requests a resource that has a different origin (domain, protocol, or port) from its own.

For security reasons, browsers prohibit AJAX calls to resources residing outside the current origin.

UAA support global CORS configuration based on Spring Framework out-of-the-box, giving you an easier and more powerful way to configure it than typical filter based solutions.

By default, all origins and GET, HEAD and POST methods are allowed.

Configuration:

| Configuration property | Default value | Description |
| --- | --- | --- |
| `mgmtp.a12.uaa.authentication.cors.enabled` | true | Turn on or off CORS.  - CORS is on. you can control the cross resource requests with configurations and default value configurations are taken into account.  - CORS is off, default security is applied in browser that means cross-origin requests are prohibited. |
| `mgmtp.a12.uaa.authentication.cors.allowed-origins` | <http://localhost:3000> | List of origin parameters specifying URIs that may access the resource. Its value is placed in the Access-Control-Allow-Origin header of both the pre-flight response and the actual response.  - `"*"` means that all origins are allowed.  - If undefined, all origins are allowed.  - If you want all the three origins to be set, then you need to pass them as comma separated strings. |
| `mgmtp.a12.uaa.authentication.cors.allowed-methods` | GET,POST,OPTIONS,DELETE,PUT,PATCH | List of method parameters indicating which HTTP methods can be used when making the actual request.  - If undefined, methods defined by RequestMapping annotation are used. |
| `mgmtp.a12.uaa.authentication.cors.allowed-headers` | X-Requested-With,Origin,Content-Type,Accept,Authorization | List of request headers that can be used during the actual request. Value is used in preflight’s response header Access-Control-Allow-Headers.  - `"*"` – means that all headers requested by the client are allowed.  - If undefined, all requested headers are allowed.  - The name of a supported request header. The header may list any number of headers, separated by commas. |
| `mgmtp.a12.uaa.authentication.cors.exposed-headers` | access\_token, token\_renew\_in\_seconds | List of header parameters indicating request headers that browsers are allowed to access. Value is set in actual response header Access-Control-Expose-Headers.  - If undefined, an empty exposed header list is used. |
| `mgmtp.a12.uaa.authentication.cors.allow-credentials` |  | Define if user credentials are supported. By default, it’s `null` which means that user credentials are not supported.  - If you configure origin to `"*"` then \*allow-credentials\* setting is not allowed to be `true`. |

|  |  |
| --- | --- |
|  | In case you use any Proxy in your production setup, you should pay attention to check the CORS on Proxy settings. In case you use Nginx for that then follow [CORS on Nginx](https://enable-cors.org/server_nginx.html). |

#### Headers

UAA supports a common security aspect which is solved by HTTP headers. Header values are added into each and every response. Their value are based on configuration - see below.

##### MIME Sniffing

The X-Content-Type-Options response HTTP header is a marker used by the server to indicate that the MIME types advertised in the Content-Type headers should not be changed and be followed. This is a way to opt out of MIME type sniffing, or, in other words, to say that the MIME types are deliberately configured.

[See documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options)

##### Click Jacking

The X-Frame-Options HTTP response header can be used to indicate whether or not a browser should be allowed to render a page in a <frame>, <iframe>, <embed> or <object>. Sites can use this to avoid click-jacking attacks, by ensuring that their content is not embedded into other sites.

[See documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)

##### Content Security Policy

The HTTP Content-Security-Policy response header allows website administrators to control resources the user agent is allowed to load for a given page. With a few exceptions, policies mostly involve specifying server origins and script endpoints. This helps guard against cross-site scripting attacks (XSS).

[See documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)

UAA supports just `frame-ancestors <source1> <source2>…​` which is used in case when frames from other origins are allowed. This means that [X-Frame-Options](#http-headers-click) is empty.

##### Configuration

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.header-configuration.x-content-type` | `nosniff` | Value of the `X-Content-Type-Options` response header |  |
| `mgmtp.a12.uaa.authentication.header-configuration.x-frame-options` | `DENY` | Value of the `X-Frame-Options` response header |  |
| `mgmtp.a12.uaa.authentication.header-configuration.content-security-policy-sources` | `` | Value of the `Content-Security-Policy` response header. |  |

#### JWT token logging

In some cases complete JWT token is written to the log. This is only in the situations when the application unable to unpack the token.
This means that the token is arbitrary string for the application. Since the token is encrypted it might happen that the token might be a valid token for a different application or server/environment.
This is corner case and it’s better to log it because it might be used to attack the system. When the token itself would not be logged it would be hard to detect attack(s).

Here it’s the example of the log message:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` 2021-01-08 23:14:59,893 [http-nio-9090-exec-1][INFO ][wt.internal.JwtTokenAuthenticationFilter][u:] - Invalid token org.springframework.security.authentication.BadCredentialsException: Invalid JWT token: <token> 	at com.mgmtp.a12.uaa.authentication.jwt.internal.JwtTokenPrincipalCreator.createPrincipal(JwtTokenPrincipalCreator.java:31) ``` |
```

#### Cluster support

UAA requires much information depending on how you configure your application especially Authentication Types.
For each data we need we always provide:

* memory data which is suitable for single instance running application.
* cache region using Spring caching abstraction (default cache manager) for Production, Cluster environment.

It’s responsibility of the project to configure caching correctly so that UAA can work across different instances. UAA does not provide any persistence layer.

Here is the example for JSR-107 cache implementation in spring boot application.

Configure following properties.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` spring.cache.type=jcache spring.cache.jcache.provider=org.ehcache.jsr107.EhcacheCachingProvider spring.cache.cache-names=tokenCache,authorizationCodeCache,samlLogoutRequestCache,roleMapping,codeChallengeCache,codeCache,tokenHintCache,samlAuthenticationRequestCache,samlJwtTokenCache mgmtp.a12.uaa.authentication.cached-token-storage.enabled=true ``` |
```

[Spring boot documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-caching)

### Troubleshooting

|  |  |
| --- | --- |
|  | In case of issues with configuration look into the log file for messages with pattern `.*UAA_Config.*`. It prints all information about actual runtime configuration.  Example:  `INFO 28084 --- [ restartedMain] c.m.a.u.a.s.i.U.UAA_Config : Configuring Spring Security with authentication: LOCAL` |

### Development environment issues

1. *Silent renew not work on Chrome from version 85 and above?*

   (It always returns login\_required even the request has the correct token)

   * By SameSite cookie attribute definition, the origin’s registrable domain is an exact match for the request’s client’s "site for cookies". And from Chrome version 85 to the latest, the Samesite cookie attribute will be enabled by default with the value Samesite=None. It makes the silent renew doesn’t work if you use a different domain. But it still works for the subdomain. The valid domain, for example, could be client: client.application.com and Keycloak server keycloak.application.com.
   * In case, you want to use a local client and remote IDP server. You can by-pass by mapping localhost with an address that has the same domain name.

## Authorization

Authorization is a process to check if a logged user has access to (a) `resource(s)`. This is done by defining rules which resolve to "true" in case of access granted.
The concept behind the authorization mechanism is based on policy enforcement point and policy decision point. In order to make a decision if access is granted (user is authorized) the following input is required:

* object / resource
* principal / user
* environment (like current date, role / access right mapping)
* policies (rules)

In the **p**olicy **d**ecision **p**oint (PEP) the above information is taken and processed in order to grant access.

![Authorization](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/authorization/uaa_decision_context.png)

Figure 4. Policy enforcement and decision point

The authorization logic is based on **A**ttribute-**B**ased **A**ccess **C**ontrol (ABAC). ABAC is represented by an expressions which can use functions and compare properties of a user and resource object. With ABAC, **R**oled **B**ased **A**ccess **C**ontrol (RBAC) can be implemented. In this case, one "attribute" is the role.

The authorization functionality can be used in Java to grant access to Java Objects (POJOS) or in A12 DataServices to grant access to A12 documents (see authorization documentation in DataServices).

|  |  |
| --- | --- |
|  | The resource can be any object in the system or even an URL. |

### Overview

UAA supports different type of the authorization.

* Resource Authorization
* Repository Authorization
* Property Authorization

![Authorization](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/authorization/Authorization.png)

Figure 5. Authorization Concepts

#### Resource Authorization

Checking the user permission on a `Resource`. The process will **grant** or **deny** permission based on ABAC rules executed during evaluation process. This authorization type is the most important type.
The resource authorization is only evaluating access to individual objects / documents.

#### Repository Authorization

Repository authorization is used to intercept repository query with generated authorization filter.
The process is using a **template** which generates a language **agnostic** query criteria. During the generation process there is same execution environment
like in resource authorization. It’s possible to reference principal/resource or any other decision context variable(s).

Note: Due to performance reason the resource authorization is not executed in a list query. For authorization on lists (repository queries), only repository authorization is used.

|  |  |
| --- | --- |
|  | There is no consistency check between resource and repository authorization. It is in the responsibility of the developer to make sure that the two authorization definitions are consistent. The same authorization rules should be applied in both The Resource Authorization and The Repository Authorization enable the consistency between these 2 types. |

#### Property Authorization

Property authorization is granting a READ and WRITE permission on a `Resource` object. It’s intended to be used together with `Resource Authorization`.
The Property Authorization is working in two modes.

##### Read Mode

The **read** mode is used when the object is read from a repository and returned to the client. In this mode authorization process will not
reject the access to an `resource`. The process will **mask** all properties which has no read access.

|  |  |
| --- | --- |
|  | Masking process will replace all property values with `null` for which a user has no READ permission. |

|  |  |
| --- | --- |
|  | Masking is not working on **primitive** types! |

##### Write Mode

The **write** mode is used when the object is updated on client side and changed data are written to the repository. The authorization process will compare **persisted** and **updated** resource.
When there is a change to a property for which user has no permission then the change is rejected.

|  |  |
| --- | --- |
|  | To compare **persisted** and **updated** resource system needs full objects. |

### Authorization strategy

UAA uses Attribute-Based Access Control (ABAC) techniques to grant method access to a `Resource` or `Property`.
A rule can use a User, Resource or Environment objects and it’s properties.

* **User** is Spring Security principal. Its attributes could be a username, authorities…​. The principal object must inherit `UserDetails` interface.
* **Resource** represents protected data. Any kind of data.
* **Environment** is optional additional data. Any kind of data.

### Spring Expression Language (SpEL)

[The Spring Expression Language (“SpEL” for short)](https://docs.spring.io/spring-framework/docs/5.3.x/reference/html/core.html#expressions) is a powerful expression language
that supports querying and manipulating an object graph at runtime.

UAA provides some expression functions integrated into SpEL.

#### hasAccessRight

|  |  |  |  |
| --- | --- | --- | --- |
| Signature | ``` |  |  | | --- | --- | | ``` 1 ``` | ``` hasAccessRight(String accessRight):boolean ``` | ``` |
| Description | Check if principal accessRights contains give accessRight. |
| Example | ``` |  |  | | --- | --- | | ``` 1 ``` | ``` "hasAccessRight('READ')" ``` | ``` |

#### containsAnyRole

|  |  |  |  |
| --- | --- | --- | --- |
| Signature | ``` |  |  | | --- | --- | | ``` 1 ``` | ``` containsAnyRole(Collection<String> roles):boolean ``` | ``` |
| Description | Check if principal roles contains any of given role(s). |
| Example | ``` |  |  | | --- | --- | | ``` 1 ``` | ``` "containsAnyRole({'Reviewer', 'Admin'}))" ``` | ``` |

#### isResourceName

|  |  |  |  |
| --- | --- | --- | --- |
| Signature | ``` |  |  | | --- | --- | | ``` 1 ``` | ``` isResourceName(Object resource, String name):boolean ``` | ``` |
| Description | Check if resource type object is matching with give name. |
| Example | ``` |  |  | | --- | --- | | ``` 1 ``` | ``` "isResourceName(#resource,'string')" ``` | ``` |

#### hasObjectWithPropertyValue

|  |  |  |  |
| --- | --- | --- | --- |
| Signature | ``` |  |  | | --- | --- | | ``` 1 ``` | ``` hasObjectWithPropertyValue(Collection<Object> collection, String propertyName, String propertyValue):boolean ``` | ``` |
| Description | Check if object inside collection is matching with propertyValue. |
| Example | ``` |  |  | | --- | --- | | ``` 1 ``` | ``` "hasObjectWithPropertyValue(principal.authorities, 'role', 'ADMIN')" ``` | ``` |

#### hasNestedObjectWithPropertyValue

|  |  |  |  |
| --- | --- | --- | --- |
| Signature | ``` |  |  | | --- | --- | | ``` 1 ``` | ``` hasNestedObjectWithPropertyValue(Collection<? extends Object> collection, String collectionName, String propertyName, String propertyValue):boolean ``` | ``` |
| Description | Check if nested collection object inside collection is matching with propertyValue. |
| Example | ``` |  |  | | --- | --- | | ``` 1 ``` | ``` "hasNestedObjectWithPropertyValue(principal.authorities, 'accessRights', 'name', 'READ')" ``` | ``` |

#### print

|  |  |  |  |
| --- | --- | --- | --- |
| Signature | ``` |  |  | | --- | --- | | ``` 1 ``` | ``` print(Object message):boolean ``` | ``` |
| Description | Print the input message to the console log. |
| Example | ``` |  |  | | --- | --- | | ``` 1 ``` | ``` "print('Preload for:' + #resource)" ``` | ``` |

|  |  |  |  |
| --- | --- | --- | --- |
|  | The `print(…​)` method is using DEBUG level logger to write the message to a log file.  The correct log level must be enabled.  ``` |  |  | | --- | --- | | ``` 1 ``` | ``` logging.level.com.mgmtp.a12.uaa.authorization.security.spel=DEBUG ``` | ``` |

### Decision Context Variables

The decision context used to evaluate UAA policies require a resource object and optionally other variables.

UAA provide custom annotation which ease this task.
Annotation **@DecisionContext("<variable name>")** is used in method parameter(s) to put a parameter into decision context.
The variable can be referenced in an expression with `#<variable_name>`

See the difference between 2 approaches.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` @PreAuthorize("hasUAAPermission('Scope'") public void aMethod(@DecisionContext('resource') Company company, @DecisionContext("anObject") String parameter) {...}  @PreAuthorize("hasUAAPermission('Scope', #company") public void aMethod(Company company, @DecisionContext("anObject") String parameter) {...} ``` |
```

|  |  |
| --- | --- |
|  | Inside the decision context it’s possible to use any method parameter in the expression with following syntax `#<prameter name>`. Advantage of the `@DecisionContext("<variable name>")` annotation is that you can give custom name to it and it’s explicitly visible. |

### Getting Started

#### Setting Up project example

Expand to see the example application is using following classes. The Company is a domain object and User represents logged user. They will be used in authorization file.

Details

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` public class Company {  	private Long id; 	private String name; 	private String taxNumber; 	private Country country; }  public class Country {  	private String code; 	private String name; }  public class User implements UserDetails {  	private String password; 	private String username; 	private String nationality; 	private Set<SimpleGrantedAuthority> authorities; } ``` |
```

First step is to define authorization file where all security rules are defined for the application.

Expand to see the example authorization definition file:

Details

```
|  |  |
| --- | --- |
| ```   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49  50  51  52  53  54  55  56  57  58  59  60  61  62  63  64  65  66  67  68  69  70  71  72  73  74  75  76  77  78  79  80  81  82  83  84  85  86  87  88  89  90  91  92  93  94  95  96  97  98  99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127 128 129 130 131 132 133 134 135 136 137 138 139 140 141 142 143 144 145 146 147 148 149 150 151 152 153 154 155 156 157 158 159 160 161 162 163 164 165 166 167 168 169 170 171 172 173 174 175 176 177 178 179 180 181 182 183 184 185 186 187 ``` | ``` {   "name": "Example Definition File",   "description": "",   "policies": [     {       "name": "load company rest endpoint policy",       "description": "Everyone with admin or guest can load company",       "target": "#resource == 'CompanyController.loadCompany'",       "rules": [         "containsAnyRole({'Guest', 'Admin'})"       ]     },     {       "name": "save company rest endpoint policy",       "description": "Only admin can save company",       "target": "#resource == 'CompanyController.saveCompany'",       "rules": [         "containsAnyRole('Admin')"       ]     },     {       "name": "company saving policy",       "description": "Regular user must provide valid data for country and tax number",       "dataPreload": [         "#country = @countryRepository.findByCountryCode(#resource.country.code)"       ],       "rules": [         "#country.name == principal.nationality",         "@taxService.isValid(#resource.taxNumber)"       ]     },     {       "name": "administrator policy",       "description": "Admin can always save even with invalid data",       "rules": [         "containsAnyRole('Admin')"       ]     },     {       "name": "guest policy",       "description": "User has guest role",       "rules": [         "containsAnyRole('Guest')"       ]     },     {       "name": "company reading policy",       "description": "Only apply for a user which roles has not contains 'Admin'. Rule explain: the company's country name should valid",       "target": "!containsAnyRole({'Admin'})",       "dataPreload": [         "#country = @countryRepository.findByCountryCode(#resource.country.code)"       ],       "rules": [         "#country.name == principal.nationality"       ]     },     {       "name": "Company Domain Object",       "rules": [         "#resource instanceof T(com.mgmtp.a12.uaa.authorization.integration.documentation.Company)"       ]     }   ],   "repositoryPolicies": [     {       "name": "companies data filter policy",       "description": "only company which name equal principal's nationality is display",       "templates": [         "'name = ''' +  principal.nationality + ''''"       ]     }   ],   "permissions": [     {       "name": "allow access rest endpoint",       "description": "a description",       "policy-refs": [         "(load company rest endpoint policy && save company rest endpoint policy)"       ],       "scopes": [         "rest endpoint"       ]     },     {       "name": "allow read companies",       "description": "a description",       "repository-refs": [         "companies data filter policy"       ],       "scopes": [         "load companies"       ]     },     {       "name": "allow read company",       "description": "a description",       "policy-refs": [         "company reading policy"       ],       "scopes": [         "load company"       ]     },     {       "name": "allow save company",       "description": "a description",       "policy-refs": [         "administrator policy || company saving policy"       ],       "scopes": [         "save company"       ]     }   ],   "propertyPermissions": [     {       "name": "Company Properties Admin",       "description": "",       "policy-refs": [         "Company Domain Object",         "administrator policy"       ],       "rights-refs": [         "Company Entity For Admin"       ]     },     {       "name": "Permission for Guest user",       "description": "",       "policy-refs": [         "Company Domain Object",         "guest policy"       ],       "rights-refs": [         "Company Entity For Guest User"       ]     }   ],   "propertyRights": [     {       "name": "Company Entity For Guest User",       "description": "",       "rights": {         "READ": [           "id",           "name",           "taxNumber",           "country.name",           "offices",           "offices[].code"         ],         "MASK": [           "country.code::'Access Denied'",           "taxNumber::'masked:['+taxNumber.substring(0,3)+'...]'"         ],         "WRITE": [           "country.name"         ]       }     },     {       "name": "Company Entity For Admin",       "description": "",       "rights": {         "READ": [           "id",           "name",           "branchName",           "taxNumber",           "country.code",           "country.name",           "offices",           "offices[].code",           "offices[].name"         ],         "WRITE": [           "id",           "name",           "branchName",           "country.code",           "country.name",           "taxNumber"         ]       }     }   ] } ``` |
```

|  |  |
| --- | --- |
|  | `Company` can be read by a user which has `Admin` role **OR** his nationality is the same as Company’s country.  `Company` can be updated by a user which has `Admin` role **AND** his nationality is the same as Company’s country **AND** Company must contains valid tax number. |

Next step is to update source code to use those rights. In the following example there are demonstrated simple example with REST controller and service class.

See the following example

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 ``` | ``` @RestController public class CompanyController {  	@Inject 	private CompanyService companyService;  	@PreAuthorize("hasUAAPermission('rest endpoint')") 	@GetMapping("/loadCompany") 	@ResponseBody 	public Company loadCompany(String companyId) { 		return companyService.loadCompany(companyId); 	}  	@PreAuthorize("hasUAAPermission('rest endpoint')") 	@GetMapping("/saveCompany") 	@ResponseBody 	public String saveCompany(Company company) { 		return companyService.saveCompany(company); 	} }  @Service public class CompanyService {  	@PostAuthorize("hasUAAPermission('load company', returnObject)") 	public Company loadCompany(String companyId) { 		// code 	}  	@PreAuthorize("hasUAAPermission('save company')") 	public String saveCompany(@DecisionContext('resource') Company company) { 		// code 	} } ``` |
```

|  |  |
| --- | --- |
|  | The REST endpoint is using default `#resource` object.  Second is a service class which secures reading and writing with a concrete `#resource` object for decision context. |

Authorization can be used in plain Spring or Spring Boot application. Choose proper section below for Spring or Spring Boot application.

|  |  |  |  |
| --- | --- | --- | --- |
|  | For an easier dependency management it’s possible to use UAA BOM  ``` |  |  | | --- | --- | | ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` 	<dependencyManagement> 		<dependencies> 			<dependency> 				<groupId>com.mgmtp.a12.uaa</groupId> 				<artifactId>uaa-bom</artifactId> 				<version>9.3.3</version> 				<type>pom</type> 				<scope>import</scope> 			</dependency>             <dependency> 				<groupId>com.mgmtp.a12.uaa</groupId> 				<artifactId>uaa-catalog</artifactId> 				<version>9.3.3</version> 				<type>pom</type> 				<scope>import</scope> 			</dependency> 		</dependencies> 	</dependencyManagement> ``` | ``` |

#### Spring Application

Add following dependency:

Maven:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` <dependency> 	<groupId>com.mgmtp.a12.uaa</groupId> 	<artifactId>uaa-authorization</artifactId> 	<version>9.3.3</version> </dependency> ``` |
```

Gradle:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` dependencies {     implementation "com.mgmtp.a12.uaa:uaa-authorization:9.3.3" } ``` |
```

You need to initialize two beans for UAA impl. For example in a configuration class.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` @Configuration @ComponentScan("com.mgmtp.a12.uaa.authorization")  public class AuthorizationConfiguration { 	@Bean 	public AuthorizationDefinitionService createAuthorizationDefinitionService() { 		return new AuthorizationDefinitionService(<mainDefinitionResource>,[additionalDefinitionResources:List]); 	}  	@Bean 	public UAASecurityBypass createUaaSecurityBypass() { 		return new UAASecurityBypass(<disableSecurityOnStartUp>); 	} } ``` |
```

#### Spring Boot Application

Spring Boot handles complete initialization of the module.

Add following dependency:

Maven:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 ``` | ``` <dependency> 	<groupId>com.mgmtp.a12.uaa</groupId> 	<artifactId>uaa-authorization-spring-boot-autoconfigure</artifactId> 	<version>9.3.3</version> </dependency> <!-- optional dependency --> <dependency> 	<groupId>com.mgmtp.a12.uaa</groupId> 	<artifactId>uaa-authorization-web-spring-boot-autoconfigure</artifactId> 	<version>9.3.3</version> </dependency> ``` |
```

Gradle:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` dependencies {     implementation "com.mgmtp.a12.uaa:uaa-authorization-spring-boot-autoconfigure:9.3.3"     implementation "com.mgmtp.a12.uaa:uaa-authorization-web-spring-boot-autoconfigure:9.3.3" } ``` |
```

Configure authorization definition file:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.uaa.authorization.authorization-definition=<file path> ``` |
```

|  |  |
| --- | --- |
|  | `authorization-spring-boot-autoconfigure` handles configuration loading and module initialization. `authorization-web-spring-boot-autoconfigure` brings a web controller which allows controlling the authorization module like reloading the rules on runtime. |

### Authorization Definition

Authorization Definition (AD) file is a JSON file which contains the structure of an Authorization logic.
The authorization file is verified and loaded on application start-up.
An application requires to have configured `authorization-definition` (parent authorization definition) which contains authorization rules.
Optionally an application can have several `child-authorization-definitions` which can extend(s) scopes from `authorization-definition` or define new scopes.

See class diagram of the authorization definition object model representation.

![Authorization Class Diagram](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/authorization/policies_class_diagram.png)

Figure 6. Authorization Class Diagram

JSON document:
*authorization-definition.json*

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` {   "name": "Example Authorization Definition",   "description": "",   "policies": [...],   "repositoryPolicies": [...],   "permissions": [...],   "propertyRights": [...],   "propertyPermissions": [...] } ``` |
```

| Field | Description | Type | Consistency |
| --- | --- | --- | --- |
| **name** | The title of the AD file | String | * Mandatory * None-empty String |
| **description** | A brief description of the AD file | String | * Optional |
| **policies** | A list of polices that can be referenced from [Permission](#_permission) and [Property Permission](#_property_permission). | Array<[Policy](#authorization-policy)> | * This field will be mandatory if there are any references from [Permission](#_permission) or [PropertyPermission](#_property_permission). |
| **repositoryPolicies** | A list of repository policies that can be referenced from [Permission](#_permission). | Array<[RepositoryPolicy](#_repository_policy)> | * This field will be mandatory if there are any references from [Permission](#_permission) |
| **permissions** | A list of permissions that define what actions a user can perform. | Array<[Permission](#_permission)> |  |
| **propertyRights** | A list of property rights that ca be referenced from [PropertyPermission](#_property_permission). | Array<[PropertyRight](#property_rights)> | * This field will be mandatory if there are any references from [PropertyPermission](#_property_permission) |
| **propertyPermissions** | A list of property permissions that specify which properties a user can access and what actions they can perform. | Array<[PropertyPermission](#_property_permission)> |  |

#### Policy

Policy is defined in the `policies` element.
Policies contain list of individual policies.
The policy must be referenced in a permission(s) otherwise it’s orphan.

JSON document:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` {   "name": "policy 1",   "description": "Everyone with admin or guest can load company",   "type": "SpEL",   "target": "#resource == 'CompanyController.loadCompany'",   "dataPreload": ["#country = @countryRepository.findByCountryCode(#resource.country.code)"],   "rules": [     "containsAnyRole({'Guest', 'Admin'})"   ] } ``` |
```

| Field | Description | Type | Consistency |
| --- | --- | --- | --- |
| **name** | The identifier of the Policy. | String | * Unique * Mandatory * None-empty String |
| **description** | A brief description of Policy. | String | * Optional |
| **type** | The Execution type of the Policy. | Enum<SpEL> | * Optional * Default value is **SpEL** |
| **target** | A quick expression used to filter out the Policy if it matches or not. | StringExpression | * Optional * None-empty String |
| **dataPreload** | An array of expressions used to prepare all data which can be referenced in rule execution. | Array<StringExpression> | * Optional * Unique Items * None-empty Array * Item: None-empty String |
| **rules** | A set of rules that will be executed when the Policy is evaluated. | Array<StringExpression> | * Optional * Unique Items * None-empty Array * Item: None-empty String |

Example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 ``` | ``` "policies": [   {     "name": "load company rest endpoint policy",     "description": "Everyone with admin or guest can load company",     "target": "#resource == 'CompanyController.loadCompany'",     "rules": [       "containsAnyRole({'Guest', 'Admin'})"     ]   },   {     "name": "save company rest endpoint policy",     "description": "Only admin can save company",     "target": "#resource == 'CompanyController.saveCompany'",     "rules": [       "containsAnyRole('Admin')"     ]   },   {     "name": "company saving policy",     "description": "Regular user must provide valid data for country and tax number",     "dataPreload": [       "#country = @countryRepository.findByCountryCode(#resource.countryCode)"     ],     "rules": [       "#country.name == principal.nationality",       "@taxService.isValid(#resource.taxNumber)"     ]   },   {     "name": "administrator policy",     "description": "Admin can always save even with invalid data",     "rules": [       "containsAnyRole('Admin')"     ]   },   {     "name": "company reading policy",     "description": "Only apply for a user which roles has not contains 'Admin'. Rule explain: the company's country name should valid",     "target": "!containsAnyRole({'Admin'})",     "dataPreload": [       "#country = @countryRepository.findByCountryCode(#resource.countryCode)"     ],     "rules": [       "#country.name == principal.nationality"     ]   } ] ``` |
```

|  |  |
| --- | --- |
|  | Target filter can be used to filter out the policy. When the policy is filtered out it evaluates as it would pass. This means that whole policy will be evaluated as **true**.  When more rules are defined, then the default logical expression between them is AND. |

#### Repository Policy

A RepositoryPolicy is defined inside a `RepositoryPolicies` element.
A Repository Policy is similar to a Policy.
It shares few properties as illustrated in the [class diagram](#authorization-class-diagram).
It contains in-line template(s) in the `templates`.
The template could be either an [SpEL](#authorization-SpEL) expression string or a json object (which also can contain SpEL expression inside).
Therefore, you can inject any valid placeholder(s) which are resolved during the execution.

|  |  |
| --- | --- |
|  | The template is language agnostic and implementor must know the target repository language syntax. |

|  |  |
| --- | --- |
|  | During the execution:  - If the **template** is an invalid expression string (syntax error, null references,…​), UAA will throw exception immediately.  - If a json object, however, contains invalid expression inside, UAA still resolve that object but keep the raw value of those invalid placeholders. |

JSON document:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` {   "name": "repository policy 1",   "description": "only company which name equal principal's nationality is display",   "dataPreload": ["#country = @countryRepository.findByCountryCode(#resource.country.code)"],   "templates": [     "'name = ''' +  principal.nationality + ''''",     {       "operator": "exact_match",       "field": "/Address/City",       "value": "principal.nationality"     }   ] } ``` |
```

| Field | Description | Type | Consistency |
| --- | --- | --- | --- |
| **name** | The identifier of RepositoryPolicy. | String | * Mandatory * None-empty String |
| **description** | A brief description of RepositoryPolicy | String | * Optional |
| **target** | A quick expression used to filter out the RepositoryPolicy if it matches or not. | StringExpression | * Optional * None-empty String |
| **dataPreload** | An array of expressions used to prepare all data which can be referenced in rule execution. | Array<StringExpression> | * Optional * Unique Items * None-empty Array * Item: None-empty String |
| **templates** | Variables can be used in repos. | Array<StringExpression> | * Mandatory * Unique Items * None-empty Array * Item: None-empty String |

Example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 ``` | ``` "repositoryPolicies": [   {     "name": "companies data filter policy",     "description": "only company which name equal principal's nationality is display",     "templates": [       "'name = ''' +  principal.nationality + ''''"     ]   },   {     "name": "Region_Manager_Repository_Domain_Business_Policy",     "description": "Repos",     "target": "hasRole('REGION_MANAGER')",     "templates": [       "'Application.region:' +  #resource.region + ' OR Application.createdBy:' + principal.username"     ]   },   {     "name": "Guest_Repository_Domain_Business_Policy",     "description": "Repos",     "target": "hasRole('GUEST')",     "templates": [       "'Application.createdBy:' + principal.username"     ]   } ] ``` |
```

The output of the first Repository Policy in the example above:

The list with one String item **name = 'VietNam'** is generated from

`templates: ["'name = ''' + principal.nationality + ''''"]`.

If a list of elements is defined inside templates then UAA will generate a list of String items.

#### Permission

Permission is defined in a `permissions` section.
A Policy can be referenced in a `policy-refs`/`repository-refs` or defined inline in `policies` section.
It also contains one or more scope(s).

JSON document:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` {   "name": "allow access rest endpoint",   "description": "a description",   "call-parent-scope": true,   "policy-refs": [     "(load company rest endpoint policy && save company rest endpoint policy)"   ],   "policies": ["true"],   "repository-refs": ["repository Policy 1"],   "scopes": [     "rest endpoint"   ] } ``` |
```

| Field | Description | Type | Consistency |
| --- | --- | --- | --- |
| **name** | The identifier of Permission. | String | * Mandatory * Non-empty String |
| **description** | A brief description of Permission | String | * Optional |
| **call-parent-scope** | This flag indicates whether parent permissions with the same scope as those in the parent authorization definition file should be executed. | StringExpression | * Optional * Default value is **true** |
| **policy-refs** | An array of Policy name references. | Array<StringExpression> | * References to the names defined in the [Policies](#authorization-policy). * Can contain logical expression `&&`, `||` |
| **policies** | Inline policy template definition. | Array<StringExpression> | * Optional * Direct SpEL expression(s), same like a **rule** in a [Policy](#authorization-policy) |
| **repository-refs** | An array of RepositoryPolicy name references. | Array<String> | * Optional. * References to the names defined in the [RepositoryPolicies](#_repository_policy). |
| **scopes** | An array of scope names that can be referenced from the business code. | Array<String> | * Mandatory * Not-empty Array |

Example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 ``` | ``` "permissions": [   {     "name": "allow access rest endpoint",     "description": "a description",     "policy-refs": [       "(load company rest endpoint policy && save company rest endpoint policy)"     ],     "scopes": [       "rest endpoint"     ]   },   {     "name": "allow read companies",     "description": "a description",     "repository-refs": [       "companies data filter policy"     ],     "scopes": [       "load companies"     ]   },   {     "name": "allow read company",     "description": "a description",     "policy-refs": [       "company reading policy"     ],     "scopes": [       "load company"     ]   },   {     "name": "allow save company",     "description": "a description",     "policy-refs": [       "administrator policy || company saving policy"     ],     "scopes": [       "save company"     ]   } ] ``` |
```

|  |  |
| --- | --- |
|  | When writing script using Spring Expression Language, please be aware that the bean name by default is the name of the implementation class but not the interface’s name. |

##### Permission Hierarchy

Permissions inside authorization definition file(s) which are configured at `authorization-definition` and `child-authorization-definitions` are processed as parent-child.
The permission from `authorization-definition` is the parent and permissions from `child-authorization-definitions` are the children.
There is no additional parent-child relation inside Authorization Definition files.
The parent-child relation is only valid for permissions with the **same scope**.

When child permission(s) has/have the flag **"call-parent-scope" = false** then only child permission will be executed.
Otherwise, the parent and child permission will be executed.

Please refer to the examples below in order to know how to use the permission hierarchy correctly:

* Example 1:
  With scope name **rest endpoint** only one permission which name **project custom allow access rest endpoint** is executed.

On parent-definition-file.json:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` "permissions": [   {     "name": "allow access rest endpoint",     "description": "Combine a set of policies into one single policy by using logical operator",     "policy-refs": [       "(load company rest endpoint policy || save company rest endpoint policy)"     ],     "scopes": [       "rest endpoint"     ]   } ] ``` |
```

On child-definition-file.json:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` "permissions": [   {     "name": "project custom allow access rest endpoint",     "description": "",     "policies": [       "'VN' == principal.nationality"     ],     "scopes": [       "rest endpoint"     ],     "call-parent-scope": false   } ] ``` |
```

* Example 2:
  With scope name **rest endpoint** 3 permissions (The parent and child permission(s)) are executed.

On parent-definition file:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` "permissions": [   {     "name": "allow access rest endpoint",     "description": "Combine a set of policies into one single policy by using logical operator",     "policy-refs": [       "(load company rest endpoint policy || save company rest endpoint policy)"     ],     "scopes": [       "rest endpoint"     ]   } ] ``` |
```

On child-definition-file-1.json:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` "permissions": [   {     "name": "project custom allow access rest endpoint permission 1",     "description": "",     "policies": [       "'CZ' == principal.nationality"     ],     "scopes": [       "rest endpoint"     ],     "call-parent-scope": false   } ] ``` |
```

On child-definition-file-2.json:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` "permissions": [   {     "name": "project custom allow access rest endpoint permission 2",     "description": "",     "policies": [       "containsAnyRole('SuperAdmin')"     ],     "scopes": [       "rest endpoint"     ],     "call-parent-scope": true   } ] ``` |
```

This will avoid replace/override by mistake since it WILL NOT enable as global configuration.
You have to check and set **"call-parent-scope" = false** for every permission on `child-authorization-definitions` if you ready one to replace/override the permission(s) for the same scope from `authorization-definition`.

|  |  |
| --- | --- |
|  | When a list of permission(s) are executed then AND operator is applied to get the final result. |

#### Property Permission

Property permission is defined in a `propertyPermission` section.
It’s similar to the `Permission` definition as it contains references to a [Policy](#authorization-policy) and in-line policy.

JSON document:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` {   "name": "Resource Properties User",   "description": "",   "policy-refs": [     "Test Resource Object",     "User"   ],   "policies": ["true"],   "rights-refs": [     "User Data"   ] } ``` |
```

| Field | Description | Type | Consistency |
| --- | --- | --- | --- |
| **name** | The identifier of PropertyPermission. | String | * Mandatory * None-empty String |
| **description** | A brief description of PropertyPermission | String | * Optional |
| **policy-refs** | An array of Policy name references. | Array<StringExpression> | * If any `policies` or `rights-refs` fields exist, then this field is optional. * The values of `policy-refs` field must match the names of policies defined at the root level in the [Policies](#authorization-policy) field. * Unique Items * None-empty Array * Item: None-empty String |
| **policies** | Inline policy template definition. | Array<StringExpression> | * If any `policy-refs` or `rights-refs` fields exist, then this field is optional. * Unique Items * None-empty Array * Item: None-empty String |
| **rights-refs** | An array of PropertyRight name references. | Array<String> | * If any `policies` or `policy-refs` fields exist, then this field is optional. * The values of `rights-refs` field must match the names of property rights defined at the root level in the [propertyRights](#property_rights) field. * Unique Items * None-empty Array * Item: None-empty String |

Example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 ``` | ``` "propertyPermissions": [   {     "name": "Company Properties Admin",     "description": "",     "policy-refs": [       "Company Domain Object",       "administrator policy"     ],     "rights-ref": [       "Company Entity For Admin"     ]   },   {     "name": "Permission for Guest user",     "description": "",     "policy-refs": [       "Company Domain Object",       "guest policy"     ],     "rights-refs": [       "Company Entity For Guest User"     ]   } ] ``` |
```

#### Property Rights

Property rights defines READ/WRITE access right to individual resource properties.
Additionally, it’s possible to define custom MASKing behaviour.

JSON document:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` {   "name": "User Data",   "description": "",   "rights": {     "READ": [       "id",       "name",       "description",       "nested",       "nested.id"     ],     "WRITE": [       "id",       "name",       "description"     ],     "MASK": [       "nestedCollection[].name::Empty"     ]   } } ``` |
```

| Field | Description | Type | Consistency |
| --- | --- | --- | --- |
| **name** | The identifier of PropertyRight. | String | * Mandatory * None-empty String |
| **description** | A brief description of PropertyRight. | String | * Optional |
| **rights** | The right that user actions can perform on properties | Array<Right> | * Mandatory |

`Right` Elements:

| Field | Description | Type | Consistency |
| --- | --- | --- | --- |
| **READ** | A list of property paths that the user is allowed to read. | Array<String> | * This field is optional if any of the `WRITE` exist. * Unique Items * None-empty Array * Item: None-empty String |
| **WRITE** | A list of property paths that the user is allowed to write. | Array<String> | * This field is optional if any of the `READ` exist. * Unique Items * None-empty Array * Item: None-empty String |
| **MASK** | A list of expressions that will be used to replace the actual data in the properties that the user does not have permission to view. The expressions return masking data that will be displayed instead of the actual data. | Array<PropertyReferenceExpression::ValueExpression> | * Optional |

|  |  |
| --- | --- |
|  | It’s possible to define access rights to an object tree. To reference nested property in a referenced object the standard dot notation is used.  Example: `manufacturer.name`  The `resource` object has property `manufacturer` which is reference to an Manufacturer object. The Manufacturer object has a property `name`. |

##### Property Rights Syntax

Properties are referenced by their names and nested properties are referenced by dot notation: `property.nested.nested`

Collection is referenced with suffix `[]`: `property[]`

Nested property inside a collection is referenced by dot notation: `property[].nested`

|  |  |
| --- | --- |
|  | In order to grant access to collection elements like `offices[].code` you need to grant access to the collection itself `offices`. |

|  |  |
| --- | --- |
|  | It’s possible to use A12 documents in the property authorization in the same way as ordinary POJO with [uaa-authorization-a12-extension](#authorization_a12_document). |

Example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 ``` | ``` "propertyRights": [   {     "name": "Company Entity For Guest User",     "description": "",     "rights": {       "READ": [         "id",         "name",         "taxNumber",         "country.name",         "offices",         "offices[].code"       ],       "MASK": [         "country.code::'Access Denied'",         "taxNumber::'masked:['+taxNumber.substring(0,3)+'...]'"       ],       "WRITE": [         "country.name"       ]     }   },   {     "name": "Company Entity For Admin",     "description": "",     "rights": {       "READ": [         "id",         "name",         "branchName",         "taxNumber",         "country.code",         "country.name",         "offices",         "offices[].code",         "offices[].name"       ],       "WRITE": [         "id",         "name",         "branchName",         "country.code",         "country.name",         "taxNumber"       ]     }   } ] ``` |
```

|  |  |
| --- | --- |
|  | To ensure correct detection of object data changes, the hashcode and equals functions must be properly implemented in the POJO object. |

#### Custom Masking

Custom masking behaviour is defined by several SpEL expressions: `<property reference SpEL>::<value SpEL>`.
For each expression the SpEL root object is the `resource` object thus it’s possible to reference it’s properties.

For example the expression:

`taxNumber::'masked:['taxNumber.substring(0,3)'…​]'`

masks the `taxNumber` property with substring of original value with leading and trailing value.

|  |  |
| --- | --- |
|  | The `taxNumber` property must have **READ** access, otherwise it’s value is `null` during custom masking processing. |

#### Consistency Error Messages

| Consistency | Error Message |
| --- | --- |
| **Unique** | * File: classpath:authorization-definition.json, Line: 12, Column: 3. Error: The identity [name] with value ["policy 1"] of the item must be unique. * File: classpath:child-definition.json, Line: 4, Column: 3. Error: The identity [name] with value ["policy 1"] in the [classpath:child-definition.json] file is a duplicate of the one in the [classpath:authorization-definition.json] file. |
| **Unique Items** | * File: classpath:authorization-definition.json, Line: 12, Column: 19. Error: the items in the array must be unique. |
| **Mandatory** | * File: classpath:authorization-definition.json, Line: 5, Column: 3. Error: Missing required property [name]. |
| **Reference** | * File: classpath:authorization-definition.json, Line: 148, Column: 5. Error: The reference ["policy 1"] does not exist in Authorization Definition files. |
| **None-empty String** | * File: classpath:authorization-definition.json, Line: 6, Column: 12. Error: must be at least 1 characters long. |
| **None-empty Array** | * File: classpath:authorization-definition.json, Line: 8, Column: 13. Error: there must be a minimum of 1 items in the array. |
| **Enum<x,y,z>** | * File: classpath:authorization-definition.json, Line: 8, Column: 12. Error: does not have a value in the enumeration [x,y,z]. |
| **String Expression** | * File: classpath:authorization-definition.json, Line: 9, Column: 5. Error: ["value is true"] is a wrong expression syntax, Compile error: EL1041E: After parsing a valid expression, there is still more data in the expression: 'is'. |
| **Data type** | * File: classpath:authorization-definition.json, Line: 6, Column: 12. Error: boolean found, string expected. |

#### IDE Syntax and Formatting Supporting

We also provide the Authorization Definition Schema in compliance with JSON Schema version 7. You can add it to the JSON plugin in your IDE.
This allows for code completion and validation of your Authorization Definition JSON files.

* Download [authorization-definition-schema-v7.zip](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/files/authorization/authorization-definition-schema-v7.zip), and extract it.

##### IntelliJ IDEA

* Current version: **2024.1.4** (other versions might have different UI)
* In the **Settings** (Windows) or **Preferences** (macOS), go to **Languages & Frameworks** → **Schemas and DTDs** → **JSON Schema Mappings**
* In the central pane, click ![add](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/authorization/schema/add.svg) on the toolbar.
* Specify the name of the schema and select the **Schema version** as **JSON Schema version 7**.
  In the **Schema file or URL** field, provide the path of `authorization-definition-schema.json` file which is in the folder that was extracted from the downloaded zip file earlier.

![json mapping](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/authorization/schema/json-mapping.png)

* Create a list of files or folders that you want to validate against the schema.
  The list may contain the names of specific files, entire directories, and filename patterns.
  IntelliJ IDEA will internally detect the files to be validated based on the list you provide.

![file mapping](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/authorization/schema/file-mapping.png)

##### Visual Studio Code

* Current version: **1.91**
* Follow these instructions [JSON schemas and settings](https://code.visualstudio.com/docs/languages/json#_json-schemas-and-settings) and [Mapping to a schema in the workspace](https://code.visualstudio.com/docs/languages/json#_mapping-to-a-schema-in-the-workspace). Then, in the `url` field, provide the path to the `authorization-definition-schema.json` file, which is in the folder that was extracted from the downloaded zip file earlier.

### Permission evaluation

> Main paradigm for an execution can be expressed: The permission is checked on secured resource object.

UAA checks a method access based on given **scope** and one or more policies wrapped into permission.
To make a decision it’s necessary to create a permission which will be evaluated in the **decision context**.

Permission is defined by four main actors:

1. **Scope** - define access context for a permission.
2. **Policy** - set of rules which are evaluated in decision context. The [Spring SpEL](#authorization-SpEL) language is used.
3. **Resource** -A protected object for which permissions are evaluated. It can be an REST endpoint, method in the system or domain object (any data structure).
4. **Data Objects** - Optional map of data object used in decision context

Before each property permission evaluation a **decision context** is created. The decision context contains common environment for rule execution, resource object and other optional data object(s).

All permission(s) are loaded for given `Scope`. The permission can have in-line policy expression inside the `policies` element or contains reference(s) to a `Policy` inside `policy-refs` element. The reference is to a policy name and can contains logical expression.
The expression can use && (AND), || (OR) between Policy Names.

|  |  |
| --- | --- |
|  | If no `Permissions` are defined in the `Scope` then evaluation result is `false`.  If no `Policies` are defined in a `Permission` then evaluation result is `true`. |

Permission check can be executed in two different ways.

#### Spring Security Annotations

Annotation approach is a preferred approach. All Spring Security annotations can be used with UAA SpEL methods.

See: [specify decision context variables](#decision-context-variables)

UAA provides a set methods to execute a permissions in a given scope.

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` hasUAAPermission(String scope):boolean  hasUAAPermission(String scope, Object resource):boolean ``` |
```

|  |  |
| --- | --- |
|  | **Resource** is a variable like any other. If no resource is passed into **hasUAAPermission(…​)**, default one is generated: `<Class name>.<method name>` |

|  |  |
| --- | --- |
|  | The method **hasUAAPermission(…​)** must be presented only once in the annotation, otherwise the results are unpredictable. Even technically it’s possible to write expression like: `hasUAAPermission(…​) and hasUAAPermission(…​)`. |

#### Java API

An `AuthorizationService` provides the same methods which are available in the annotation approach.

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` checkPermissions(Object resource, String scopeName):PermissionCheckResult<Permission>  checkPermissions(Object resource, String scopeName, Map<String, Object> variables):PermissionCheckResult<Permission> ``` |
```

### Property Authorization Execution

Property authorization is defined by a list of property permissions. Each permission contains reference to a policy/in-line policy and property rights.
During the evaluation all property permission’s polices are evaluated. Those which pass their property rights are applied to a **resource** object.

|  |  |
| --- | --- |
|  | If no `Permissions` are defined for property permission then evaluation result is `true`.  If no `Policies` are defined in a `Permission` then evaluation result is `true`. |

#### Custom Property Right

By default, property right is defined in the `authorization file`. It’s possible to reference a property and define R/W right.
It’s impossible to implement any custom and more complicated logic. For this UAA introduced an interface `JavaPropertyRight`.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 ``` | ``` public interface JavaPropertyRight<T, V extends UserDetails> {  	/** 	 * Check properties with custom logic. It's also possible to mask the properties with custom logic. 	 * 	 * NOTE: return object must be the same instance as #resource parameter! It's returned to make it clear that the object is changed. 	 * 	 * @return modified object 	 */ 	T maskData(T resource, V principal);  	/** 	 * Compare persisted object with changed objects and return <code>true</code> when permissions are fulfilled. 	 */ 	boolean checkPropertyChanges(T persistedResource, T updatedResource, V principal); } ``` |
```

To make an implementation active it’s required to register it as a Spring bean. Then it will be executed during property authorization.
In the `Read Mode` the `checkProperies` method will be called.
In the `Write Mode` the `checkPropertyChanges` method will be called.

#### Spring Security Annotations

Preferred approach is annotation based. All UAA SpEL methods can be used with Spring Security annotations.

See: [specify decision context variables](#decision-context-variables)

#### Read Mode

UAA provides a method to execute a `Property Authorization` in `Read Mode`

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` hasUAAPropertyPermission(Object resource):boolean ``` |
```

|  |  |
| --- | --- |
|  | The method always returns `true` since it’s not rejecting permissions. |

|  |  |
| --- | --- |
|  | `Custom Property Right` is executed as last step after standard processing. |

#### Write Mode

UAA provides a method to execute a `Property Authorization` in `Write Mode`

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` hasUAAPropertyPermission(Object persistedResource, Object updatedResource):boolean ``` |
```

|  |  |
| --- | --- |
|  | `Custom Property Right` is executed as last step after standard processing. |

#### Java API

An `AuthorizationService` provides the same methods which are available in the annotation approach.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` 	//Read Mode 	public checkPropertyPermissionsAndMaskData(Object resource): PermissionCheckResult<PropertyPermission> 	public checkPropertyPermissionsAndMaskData(Object resource, Map<String, Object> variables): PermissionCheckResult<PropertyPermission>  	//Write Mode 	public checkPropertyPermissionsForChanges(Object persistedResource, Object updatedResource): Boolean 	public checkPropertyPermissionsForChanges(Object persistedResource, Object updatedResource, Map<String, Object> variables): Boolean ``` |
```

### Security by-pass at start up

If you want to execute your code to process some data at the project starting up (boostrap), and the data are retrieved via services which has authorization check, you need to disable security check by configuration.

`mgmtp.a12.uaa.authorization.security-on-startup.enabled=false`

All security checks during start-up will be ignored when turning on this configuration.
In order to enable security again, UAA listens to Spring Event `org.springframework.context.event.ContextRefreshedEvent` within `ApplicationContext` which
enables security back.

### Repository Authorization Execution

The execution joins to the existing @PreAuthorize annotation and all required data are stored to Security Context.
That’s the reason why @PostFilter will not work and will not be supported.

Execution flow is illustrated on the diagram. As well as data service integration.

![Repository Authorization execution](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/authorization/repository_authorization.png)

Figure 7. Repository Authorization execution

#### Java Service Based

Repository Authorization is executed from Java code by calling `AuthorizationService`.

AuthorizationService supports 2 methods:

* **generateRepositoryPermissions(): String** - most common method used in cooperation with @PreAuthorize annotation. All data are loaded from decision context.
* **generateRepositoryPermissions(Object resource, String scopeName, Map<String, Object> variables): String** - Java API for repository

|  |  |
| --- | --- |
|  | Preferred way is to use the method `generateRepositoryPermissions()` unless it’s necessary to execute repository authorization from different scope. |

#### Java Annotation Based

Annotation based execution supports the same functionality as Java execution but the generated result is propagated to optional `RepositoryAuthorizationCallback` implementation.

UAA supports following methods:

* **generateRepositoryPermissions()** - recommended way to use repository permission. The scope is used from last method in the call stack which define a `scope`.
* **generateRepositoryPermissions(String scope)** - optional method if it’s necessary to call from custom scope.
* **generateRepositoryPermissions(String scope, Object resource)** - optional method if it’s necessary to call from custom scope and with custom resource.

Each method above has also version with `RepositoryAuthorizationCallback` as last parameter. Example: `generateRepositoryPermissions(RepositoryAuthorizationCallback callback)`.
The callback can be sent as method parameter to get generated templates as illustrated in the following example:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` public class Repository {  	@PreAuthorize("generateRepositoryPermissions(#callback)") 	public String repositoryPermission(RepositoryAuthorizationCallback callback) { 		Set<String> templateFilters = callback.getFilters(); 		// project code will use the templateFilters 	} } ``` |
```

### A12 Document Object Support

UAA supports A12 Documents in Authorization in the same way as POJO. In any Rule expression, the same dot notation syntax is applied for both POJO and A12 Documents.

Declare the dependency:

Maven:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` <dependency> 	<groupId>com.mgmtp.a12.uaa</groupId> 	<artifactId>uaa-authorization-a12-extension</artifactId> 	<version>9.3.3</version> </dependency> ``` |
```

Gradle:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` dependencies {     implementation "com.mgmtp.a12.uaa:uaa-authorization-a12-extension:9.3.3" } ``` |
```

How to express Authorization rules with A12 Documents. Here are examples:

![A12 model](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/authorization/a12_model.png)

Figure 8. A12 Model

#### Resource Authorization

In the `Resource Authorization` it’s possible to use `A12 Document` in the same way as regular POJO. For example to check if `age > 18` you write expression:

`person.age > 18`

#### Property Authorization

A12 documents(s) can be used out of the box with property authorization. Existing path notation is working with A12 documents and there is no need to use any special notation.

Let’s say that you would like to give access right to following properties (Kernel notation):

* `/person/job/companies/name`
* `/person/job/Name`
* `/person/addresses/street`

In the [Property Rights](#property_rights) you define following paths:

* `person.job[].companies[].name`
* `person.job[].Name`
* `person.addresses[].street`

#### Limitations

Custom masking is not working yet.

### Authorization web support

UAA supports to secure any context path in the application and also provides an endpoint for reloading authorization rules.

#### Secure by URL path

This approach can be particularly helpful when you don’t have access to the source code, making it impossible to add Spring Security annotations to methods.
This is often the case when an application has a dependency on an external library that registers its own endpoint(s).

For instance: Actuator endpoints cannot be secured with method-level security since they are not in the UAA or project scope. Therefore in the Application Properties file, you can configure:

```
`mgmtp.a12.uaa.authorization.web.uri-secured-contexts`
```

to enable authorization based on the URL path with pattern `<uri path>::<scope name>`.

For instance, you can configure it like this:

```
`mgmtp.a12.uaa.authorization.web.uri-secured-contexts=/actuator/**::MyActuatorScope`.
```

* The `MyActuatorScope` is the scope name that you will use in the `permission` of Authorization Definition file.
* The `"/actuator/**"` is the endpoint which you want to apply authorization.
* The `HttpServletRequest` object representation of the request is passed as the environment variable `#resource`.

|  |  |
| --- | --- |
|  | In some cases, a single request may correspond to multiple scope names based on the configured paths. Such as:  * In case the paths are set to `mgmtp.a12.uaa.authorization.web.uri-secured-contexts=loadCompany/**::MyLoadCompanyScope,loadCompany/abc::MyLoadCompanyABCScope` * the `http://localhost:8080/loadCompany/abc` request must pass **at least one** of the permissions associated with `MyLoadCompanyScope` **or** `MyLoadCompanyABCScope` in case the `/loadCompany/abc` endpoint is reached. |

##### Custom handling

1. It’s possible to register custom filters which will be applied for each actuator endpoints. Add `FilterRegistration` bean to your application context. The bean needs to have proper actuator context. By default, it’s `/actuator/**`.
2. Not only for Actuator endpoints, but you also secure any endpoints base on their URL path with the same mechanism.

#### Reload Authorization rules

Reloading Authorization Rules follows these steps:

* UAA loads the authorization file on start-up
* Authorization structure is stored in-memory.

Therefore, follow these steps to reload authorization definition at runtime:

* Update Authorization Definition file in the place which is configured in your project.
* Trigger an endpoint `/uaa-authorization/reloadRules` which reloads the authorization file back to memory.

|  |  |
| --- | --- |
|  | * The endpoint `/uaa-authorization/reloadRules` is bound to the scope `Reload Rules`. * The context path is handled by mgmtp.a12.uaa.authorization.web.context-path. * When the application is executed from an archive and file is loaded from a class-path inside the archive it’s impossible to change the authorization file. * **UAA has no cluster support!** When an application is running in a cluster it’s an application responsibility to reload the authorization file in each cluster node. * This endpoint will change the whole authorization object in the memory, so please make sure the file is properly tested before it’s uploaded as the new authorization definition file at runtime. * It’s highly recommended to use system user with higher privileges to reload authorization file. |

### Limitation

1. UAA uses annotations from Spring (**@PreAuthorize** and **@PostAuthorize** etc.) - which are basically implemented by using Spring AOP.
   These annotations are put on method level. This has to be done by Developers.
2. You cannot call one method (with Spring annotation) within another method (with Spring annotation) in same Class. This is not possible with [Spring AOP](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#aop-proxying).

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` public class ExampleService  {   @PostAuthorize("hasUAAPermission('read_submission_one', returnObject)")   public SubmissionTO securityMethodOne(String id) {     securityMethodTwo(id);   }   @PostAuthorize("hasUAAPermission('read_submission_two', returnObject)")   public SubmissionTO securityMethodTwo(String id) {    } } ``` |
```

The above example will not work. In order to make it work you have to split the second method into a different Service.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` public class ExampleService  {   private AnotherExampleService anotherExampleService;   @PostAuthorize("hasUAAPermission('read_submission_one', returnObject)")   public SubmissionTO securityMethodOne(String id) {     anotherExampleService.securityMethodTwo(id);   } } public class AnotherExampleService  {   @PostAuthorize("hasUAAPermission('read_submission_two', returnObject)")   public SubmissionTO securityMethodTwo(String id) {   } } ``` |
```

### Configuration

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authorization.authorization-definition` |  | Spring `resource` notation for main definition authorization resource. | The system will not starts if it is empty, or the resource could not be found |
| `mgmtp.a12.uaa.authorization.child-authorization-definitions` |  | list of spring `resource` notations for complementary definitions to main definition authorization. | This is optional but in case providing. The system will not start if one of each resource could not be found |
| `mgmtp.a12.uaa.authorization.security-on-startup.enabled` | `false` | Authorization is bypassed on startup when `true`. This is useful for data pre-loading for example. |  |
| `mgmtp.a12.uaa.authorization.scan-entity-packages` | `com.mgmtp` | List of entity packages to scan, also use for introspections scanning. | Entities need to be scanned in order to make property changes detection working properly. |
| `mgmtp.a12.uaa.authorization.web.context-path` | `/` | UAA context where all authorization admin endpoints are registered |  |
| `mgmtp.a12.uaa.authorization.web.uri-secured-contexts` | `${management.endpoints.web.base-path:/actuator}/**::RelativePath` | URLs-based authorization | Pattern: `<Context Path>::<Scope Name>` |

### Local Development

It’s a fact that using json for authorization configuration makes it hard for development debugging.
Uaa recognizes that and providers some callback functions in authorization java models:

#### Policy

Java model class: `com.mgmtp.a12.uaa.authorization.model.AbstractPolicy`

Callback function:

* `policyExecuted(String name, Object result)`:

  + name: name of the policy
  + result: result after the policy is executed (true/false/repository template/…​)
* `targetExecuted(String name, boolean result)`

  + name: name of the policy
  + result: result after the target of policy is executed

#### Permission

Java model class: `com.mgmtp.a12.uaa.authorization.model.PolicyAware`

Callback function:

* `permissionExecuted(String name, Object result)`:

  + name: name of the permission
  + result: result after the permission is executed (true/false/repository template/…​)

#### Property permission

Java model class: `com.mgmtp.a12.uaa.authorization.model.PropertyPermission`

Callback function:

* `rightExecuted(String name, boolean result, Set<String> updatedProperties, Set<String> invalidProperties)`:

  + name: name of the property permission
  + updatedProperties: `Set` of all updated properties
  + invalidProperties: `Set` of properties not allowed to modify

### Authorization introspection

Along with UAA authorization configurations, there are many security points which are sometimes accidentally overlooked by developers.
To raise the awareness of them, Uaa provides a set of introspectors which run at the boot time of applications.

#### Scopes introspection

As [Permission definition](#_permission), each permission comes along with a set of scopes used to configure authorization.
In reality, the number of scopes might become enormous and makes it hard to know which scopes are never used anywhere (orphan scopes).

With scopes introspection, UAA will automatically scan all project’s authorization configurations and detect orphan scopes.
All these scopes are warned by uaa through warning logs.

|  |  |
| --- | --- |
|  | The introspector only scans the configurations setup by security annotations (PreAuthorize, PostAuthorize, PreFilter, PostFilter). If you are using java functions, uaa cannot scan them. |

#### Endpoints introspection

To enable endpoints introspection, firstly you need to add dependency:

Maven:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` <dependency> 	<groupId>com.mgmtp.a12.uaa</groupId> 	<artifactId>uaa-authorization-introspector</artifactId> 	<version>9.3.3</version> </dependency> ``` |
```

Gradle:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` dependencies {     implementation "com.mgmtp.a12.uaa:uaa-authorization-introspector:9.3.3" } ``` |
```

Next, you need to register all rest endpoints you have, they might originate from other library/framework project depends on,
example property:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.uaa.authorization.web.introspection.whitelist-endpoints=/uaa-authentication/authorize,/uaa-authentication/currentUser ``` |
```

The endpoint introspector will stop the application from starting if there’s any endpoint:

* NOT configured by any of spring security annotation (PreAuthorize, PostAuthorize, PreFilter, PostFilter)
* NOT included in `mgmtp.a12.uaa.authorization.web.introspection.whitelist-endpoints` property
* NOT included in `mgmtp.a12.uaa.authorization.web.uri-secured-contexts` property

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
|  | The introspector only scans one level of interface inheritance and also one level of composed annotation. Let check below examples:  Controller inheritance:  ``` |  |  | | --- | --- | | ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 ``` | ``` @PreAuthorize("rule") @RequestMapping("api") interface ControllerA {     void endpoint(); }  @AnyAnnotation() interface ExtendedControllerA extends ControllerA { }  @RestController public class ExtendedControllerAImpl implements ExtendedControllerA { 	// This endpoint will NOT be marked as authorized because inherited interface ExtendedControllerA is not authorized 	// => only one level of inheritance is considered 	void endpoint() { 	} }  @RestController public class ControllerAImpl implements ControllerA { 	// This endpoint will be marked as authorized because ControllerA is authorized by @PreAuthorize 	void endpoint() { 	} } ``` | ```  Composed annotation:  ``` |  |  | | --- | --- | | ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 ``` | ``` @Target({ ElementType.TYPE }) @Retention(RetentionPolicy.RUNTIME) @Controller @PreAuthorize("rule") public @interface SecuredController { }  @Target({ ElementType.TYPE }) @Retention(RetentionPolicy.RUNTIME) @SecuredController() public @interface ExtendedSecuredController { }  @RestController public class ControllerClass { 	// This endpoint will NOT be marked as authorized because annotation ExtendedSecuredController is not an authorized annotation 	// => only one level of composed annotation is considered so annotation SecuredController is NOT authorized in this context 	@ExtendedSecuredController 	void endpointA() { 	}  	// This endpoint will be marked as authorized because annotation SecuredController is a composed annotation which includes @PreAuthorize 	@SecuredController 	void endpointB() { 	} } ``` | ``` |

### Authorization Language Server

UAA provides a tool that makes writing authorization definition files easier by offering features such as code completion, syntax coloring, go-to-definition, validations, and more.

If you want to use it, you have to follow the steps:

* Install `uaa-authorization-language-server` in your temporary (or any) client project:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm i @com.mgmtp.a12.uaa/uaa-authorization-language-server ``` |
```

After installation, in `node_modules` package, follow the path `${YOUR_PROJECT_PATH}/node_modules/@com.mgmtp.a12.uaa/uaa-authorization-language-server/main/uaa-authorization-language-server`.
There is a file named `uaa-authorization-language-server` used to run LSP.

* Create new metadata file follow the structure:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 ``` | ``` {   "principal": "...",   "A12Models": "...",   "resource": [     {       "path": "..."     },     {       "path": "..."     },     {       "path": "..."     }   ] } ``` |
```

|  |  |
| --- | --- |
|  | * **principal**: Absolute Path to the class of the principal.   Based on this class, you can access all its properties and methods.   However, it has one limitation: It cannot access nested data through object references  + When you type the word “principal.” in one of the [“target", "dataPreload", "rules", "policies”] properties in json file, it will provide a list of suggestions, including the fields and methods of the class.   + When you type either “READ” or “WRITE” in the propertyRights property, it will suggest the name of this class along with ".**" symbol.     Example: The name of class is Principal.java, it will suggest “Principal.**”, and when you processed with it, it will list all the fields of this class. * **resource**\*: Absolute Path class of resource.   Based on this class, you can access all its properties and methods.   However, it has one limitation: It cannot access nested data though object references  + When you type the word “#resource.” in one of [“target", "dataPreload", "rules", "policies”] properties in json file, it will suggest all the fields and methods of all resources.   + When you the either “READ” or “WRITE” in the propertyRights, it will suggest the name of this class along with ".**" symbol.     Example: The names of classes are Company.java and Employee.java, it will suggest "Company.**" and "Employee.\*", and when you processed with it, it will list all its fields. * **A12Models**\*: Absolute Path to the models.   When you type either “READ” or “WRITE” in propertyRights property, it will provide the name of document model along with ".**" symbol.   Example: The name of document model is UserManagement, it will suggest “UserManagement.**”, and when you processed with it, it will list all its fields. |

Use with Intellij:

* Install plugin lsp4ij from Redhat (requires IntelliJ version 2023.2+).
* Go to `Preferences` → `Languages & Frameworks` → `Language Servers` → `Add Language Server`:

  + `Server`:

    - `Name`: name it up to you
    - `Command`:

      * MacOS

        ```
        |  |  |
        | --- | --- |
        | ``` 1 2 ``` | ``` ${YOUR_PROJECT_PATH}/node_modules/@com.mgmtp.a12.uaa/uaa-authorization-language-server/main/uaa-authorization-language-server --metadataPath=${METADATA_PATH}/metadata.json --node-ipc ${YOUR_PROJECT_PATH}/node_modules/@com.mgmtp.a12.uaa/uaa-authorization-language-server/main/uaa-authorization-language-server --metadataPath=${METADATA_PATH}/metadata.json --stdio ``` |
        ```
      * Windows

        ```
        |  |  |
        | --- | --- |
        | ``` 1 2 ``` | ``` node ${YOUR_PROJECT_PATH}/node_modules/@com.mgmtp.a12.uaa/uaa-authorization-language-server/main/uaa-authorization-language-server --metadataPath=${METADATA_PATH}/metadata.json --node-ipc node ${YOUR_PROJECT_PATH}/node_modules/@com.mgmtp.a12.uaa/uaa-authorization-language-server/main/uaa-authorization-language-server --metadataPath=${METADATA_PATH}/metadata.json --stdio ``` |
        ```

![Authorization](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/authorization/lsp/lsp4j-server.png)

Figure 9. LSP4j Server

* `Mappings`: Add new `Json` language

![Authorization](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/authorization/lsp/lsp4j-mapping.png)

Figure 10. LSP4j Mapping

Use with VSCode:

* Install extension named `Generic LSP Client`
* Goto `setting.json` file
* Add more this configuration into it

  + MacOS

    ```
    |  |  |
    | --- | --- |
    | ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ```   ..........,   "glspc.languageId": "json",   "glspc.serverCommandArguments": [     "--stdio",     "--node-ipc",     "--metadataPath=${METADATA_PATH}/metadata.json"   ],   "glspc.serverCommand": "${YOUR_PROJECT_PATH}/node_modules/@com.mgmtp.a12.uaa/uaa-authorization-language-server/main/uaa-authorization-language-server",   "workbench.settings.applyToAllProfiles": [     "glspc.serverCommand",     "glspc.languageId",     "glspc.serverCommandArguments"   ] ``` |
    ```
  + Windows

    ```
    |  |  |
    | --- | --- |
    | ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ```   ..........,   "glspc.languageId": "json",   "glspc.serverCommandArguments": [     "{YOUR_PROJECT_PATH}/node_modules/@com.mgmtp.a12.uaa/uaa-authorization-language-server/main/uaa-authorization-language-server",     "--stdio",     "--node-ipc",     "--metadataPath=${METADATA_PATH}/metadata.json"   ],   "glspc.serverCommand": "node",   "workbench.settings.applyToAllProfiles": [     "glspc.serverCommand",     "glspc.languageId",     "glspc.serverCommandArguments"   ] ``` |
    ```

List function we support:

* **Validation**:

  + Notify error when wrong structure json file
  + Notify error when there is more than one instance of the same name in each property
  + Warning wrong Spring Expression syntax in ["target", "dataPreload", "rules", "policies"] properties
  + Warning if Policy, Repository Policy or Property Right is unused
  + Warning if policy-refs, rights-refs or repository-refs cannot be found
* **Recommendation**:

  + Template structure json file
  + Template properties in json file
  + In ["target", "dataPreload", "rules", "policies"] properties:

    - List function of UAA Security Expression
    - Any word that starts with "#resource." will list all methods and properties, which be declared at metadata json file.
    - Any the word starts with "principal." will list all methods and properties, which be declared at metadata json file.
  + In ["READ", "WRITE"] properties: Suggest class names and document model names along with ".\*" symbol based on the metadata file provided above.
    When you select, it will list all its fields.
  + In ["policy-refs", "rights-refs", "repository-refs"] properties: List all the corresponding property names.
* **Go to definition**:

  + In ["policies", "repositoryPolicies", "propertyRights"] properties: When click on one of its names, it will list all positions where it is used (described by name).
  + In ["policy-refs", "rights-refs", "repository-refs"] properties: When click on one of its value, you will be redirected to position where it is defined.
* **Hover**: Hover over the key or value of properties will display the description of its usage
* **Color**: There are some colors in authorization file to detect expressions, keywords and operators.
* **Save**: Automatically format json file when type save

## Backend Authentication

An application might have back-end job(s) which are started by a scheduler without user interaction.
The code which is called from those jobs applies authorization and requires a user set-up in a Spring `SecurityContext`.
For this purpose UAA offers the `uaa-authentication-backend` module. It’s rather simple with few configuration options.
The module creates a user and set-up Spring `SecurityContext. It also provides an extension point for custom user creation implementation.

|  |  |
| --- | --- |
|  | The module is dependent on `uaa-authorization` in order to be able to give super user privileges to created user. |

### Getting Started

Backend authentication can be uses as plain spring application or full-featured Spring Boot application.

#### Spring Application

In a Spring application the following dependency needs to be added:

Maven:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` <dependency> 	<groupId>com.mgmtp.a12.uaa</groupId> 	<artifactId>uaa-authentication-backend</artifactId> 	<version>9.3.3</version> </dependency> ``` |
```

Gradle:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` dependencies {     implementation "com.mgmtp.a12.uaa:uaa-authentication-backend:9.3.3" } ``` |
```

Next step is to create a configuration class which loads proper authentication type and instantiates required beans.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 ``` | ``` @Configuration public class BackendAuthenticationConfiguration {   	@Bean 	public BackendAuthenticationService createBackendAuthenticationService() { 		return new BackendAuthenticationService(true); 	}  	@Bean 	@ConditionalOnMissingBean 	public AuthenticatedUserLoader createBackendUserLoader() { 		return new BackendUserLoader(<true/false>); 	} } ``` |
```

#### Spring Boot Application

With Spring Boot all configuration is handled by properties and the following dependencies needs to be added:

Maven:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` <dependency> 	<groupId>com.mgmtp.a12.uaa</groupId> 	<artifactId>uaa-authentication-backend-spring-boot-autoconfigure</artifactId> 	<version>9.3.3</version> </dependency> ``` |
```

Gradle:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` dependencies {     implementation "com.mgmtp.a12.uaa:uaa-authentication-backend-spring-boot-autoconfigure:9.3.3" } ``` |
```

### Setting up a backend user

A backend user is set by annotating respective job method with annotation `@Authenticated`. Annotation parameter user name is required.
A code which is called within the annotation (method) has given user in the `SecurityContext`. After the method is finished the `SecurityContext` is cleaned-up.

Based on the configuration the module will create a use with given username with regular privileges or all privileges.

See scheduled job example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` @Component public class BackendJob {  	@Inject 	private BackendTask backendTask;  	@Scheduled(cron = "*/10 * * * * *") 	@Authenticated(username = "superUser") 	public void backendJob() { 		backendTask.executeTask(); 	}  } ``` |
```

Optionally it’s possible to use JAVA API to set backend user.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 ``` | ``` @Component public class BackendJob {  	@Inject 	private BackendTask backendTask;  	@Inject 	private BackendAuthenticationService backendAuthenticationService;  	@Scheduled(cron = "*/10 * * * * *") 	public void backendJob() { 		backendAuthenticationService.executeWithBackendAuthentication("superUser", () -> { 			backendTask.executeTask(); 			return null; 		});  	}  } ``` |
```

|  |  |
| --- | --- |
|  | Preferred approach is annotation based. |

### Custom user loader implementation

It’s possible to provide custom implementation for user used for backend authentication. It’s necessary to create a class which implements the `AuthenticatedUserLoader` interface.

In case that an application uses the `uaa-authentication-principal-extension` it’s possible to use the module and load users from [YAML files](#uaa-principal-extension)

See following example which loads a user from YAML file(s)

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` @Component public class YamlBackendUserLoader implements AuthenticatedUserLoader {  	@Inject 	private LocalUserManager localUserManager;  	@Override 	public UserDetails loadUser(String username) { 		return localUserManager.createUser(username); 	}  } ``` |
```

|  |  |
| --- | --- |
|  | When custom implementation is used the module configuration `mgmtp.a12.uaa.authentication.backend.grant-super-user-privileges.enabled` is ignored. |

#### Configuration:

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.backend.enabled` | `false` | Enable backend authentication handling |  |
| `mgmtp.a12.uaa.authentication.backend.grant-super-user-privileges.enabled` | `false` | Create a user which has all privileges in the system |  |

## Principal Extension

IDP maintains `users` and (usually) roles assigned to the user.
UAA provides a universal **Principal Extension** which provides coherent functionality for converting data from IDP response into a principal stored in `SpringSecurityContext`
The extension provides an abstraction in principal processing which is independent of authentication type.
UAA supports principals containing `roles` with `ACCESS RIGHT(s)` assigned to the role.
The mapping between role and access right(s) can be defined in the file and it’s managed by the **Principal Extension**

### Overview

The Principal Extension module provides complete structure of User object. On top of the user object it also provides a `Role` which represents an `GrantedAuthority` with set of `AccessRight(s)`.

Following class diagram illustrates inheritance and all properties.

[![User class diagram](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/user_classes.png)](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/user_classes.png)

Figure 11. Principal class diagram

The principal object can be further extended. When it’s necessary to extend it’s recommended to extend from `AbstractExtendedPrincipal<T>`.

|  |  |
| --- | --- |
|  | When it’s required to serialize the extended principal type into JWT token please add the `@UAAJsonSerialization` annotation to a new type. |

### Getting Started

Add following dependencies to your POM:

Maven:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` <dependency> 	<groupId>com.mgmtp.a12.uaa</groupId> 	<artifactId>uaa-authentication-principal-extension-spring-boot-autoconfigure</artifactId> 	<version>9.3.3</version> </dependency> ``` |
```

Gradle:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` dependencies {     implementation "com.mgmtp.a12.uaa:uaa-authentication-principal-extension-spring-boot-autoconfigure:9.3.3" } ``` |
```

Based on authentication type the Spring boot configuration module will register proper beans for principal processing.

### Principal Processing

The principal processing contains several steps. Each section below will describe the step in details. Most of the steps contain extension points and standard behaviours can be changed.
The process is usually started after data is received from IDP after login. The result of the process is a principal object which is put to `SpringSecurityContext`.
The flow is implemented in the `PrincipalProcessor` class.

### Extended Data Loading

A principal object can contain an extended data. The data object is a generic data type so it can be any data.
An implementation of the `UAAExtendedPrincipalDataLoader` must is provided by an implementation.

|  |  |
| --- | --- |
|  | The loader is optional and it’s not required to implement it. |

### Create Principal

Principal creation is abstracted by the interface `PrincipalFactory`. It contains few convenient methods for principal creation. The **Principal Extension** provides a standard implementation which create a principal object of a type `ExtendedPrincipal`.
In order to provide different implementation just instantiate a Spring bean implementing the `PrincipalFactory`.

|  |  |
| --- | --- |
|  | Authorities are required for the principal and created beforehand because they strongly depend on the used authentication type. |

### Authority Mapping

As stated in previous step the authorities are created beforehand. Based on the data from IDP authorities might be complete (with AccessRights) or just authority names.
This section is only interesting for incomplete authority objects which can be populated with remaining data.

[![Authority mapping diagram](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/authority_mapping.png)](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/authority_mapping.png)

Figure 12. Authority mapping diagram

The granted authority object is first converted to a `Role` object. After that AccessRight for that role is loaded.
The mapping between `Role` and `AccessRight` is loaded by a mapper which is an implementation of `RoleMappingLoader<T>` interface.

The principal extension provides two implementations. First is a default implementation which is fallback when no implementation for concrete payload is found.
The implementation loads mapping from a YAML file.

`RoleMappingLoader<T>` is an interface which provides a way to load role mapping to access right. A mapper loads a mapping based on the payload type (depending on authentication type).

Principal Extension provides two different role mapping loaders. First is specific to [OAUTH2 JWT](#role-mapping-jwt) token and second is [generic file-based](#role-mapping-yaml) for all authentication types.

|  |  |
| --- | --- |
|  | Specific role mapping loader has precedence over generic one. |

#### JWT Token Role Mapping (Support for Oauth2 only)

Role mapping can be also stored (encoded) as a property in OAUTH2 claims.

The format is

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` <Role Name_1>:<Access Right Name_1>,<Access Right Name_2>;... ``` |
```

The example definition is:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ```  Role1:Right1,Right2;Role2:Right1,Right2 ``` |
```

The implementation is activated by a configuration where the field name is specified.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.uaa.authentication.principal.oauth2Config.role-mapping-from-token.field-name=<name> ``` |
```

#### YAML Role Mapping (fallback implementation all authentication types)

YAML file based role mapping is generic fallback implementation where role mapping is defined in YAML file.
The initial mapping is configured on startup.
Later on it can be changed by using the endpoint `<UAA context>/principal-extension/roleMapping`.
The endpoint is a simple POST which accepts YAML in the body.

|  |  |
| --- | --- |
|  | The endpoint `/principal-extension/roleMapping` is bound to the scope `Upload Role Access Rights Mapping Rule` |

|  |  |
| --- | --- |
|  | **UAA has no cluster support!** When an application is running in a cluster it’s an application responsibility to reload the authorization file in each cluster node. |

|  |  |
| --- | --- |
|  | This endpoint will accept the role access right mapping as yaml string format then update the whole role mapping data holder object in the memory. |

|  |  |
| --- | --- |
|  | It’s highly recommended to use system user with higher privileges to change Access Right file. |

The implementation is activated by a configuration where a YAML file is referenced.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.uaa.authentication.principal.access-rights-resource=classpath:/access_rights.yaml ``` |
```

Example Data File:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 ``` | ``` roles:   - name: Reviewer     description: Reviewer role     accessRights:       - right1       - right2   - name: Admin     description: Admin role     accessRights:       - READ       - WRITE   - name: Manager     description: Manager role     accessRights:       - READ       - WRITE ``` |
```

|  |  |
| --- | --- |
|  | 1. Once the access-rights-resource property is configured, the application will fail to start if in these cases:  * invalid resource loading (Path is empty or wrong path)    * invalid resource parsing 2. Once the access-rights-resource property is configured, the original roles will be removed if these roles have no access rights for mapping |

### Add Custom Attributes

This is the very last step which allows to map a data received from an IDP into created principal object without modifying the principal object. The module provides an interface `PropertyExtractor<T>` and dedicated implementation for each authentication type.
In order to customize the implementation it’s possible to provide specific implementation of the above interface into spring container. In this case the default implementation is ignored.

The properties which will be extracted are specified in the configuration.

When the property is extracted from IDP response there are two possibilities where it’s stored in the principal object.

* Custom principal type is provided which contains the property
* Property is store into default `additionalProperties` map.

#### Configuration:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.uaa.authentication.principal.additional-properties=<list of property names> ``` |
```

### Local User (UAA Acts as IDP)

In case of `LOCAL` authentication type there is no IDP and it’s required to store user data with credentials locally.
The user is then converted to a proper principal. The users are loaded from a file system resource(s).
There are several steps needed to use local users.

Local user is defined by a type `LocalUser` which contains basic set of properties.
In the default implementation it’s enough to define data files and reference them by a configuration.

Please see a configuration and data file example.

#### Configuration

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.uaa.authentication.principal.local-config.user-resources=classpath:/users/admin.yaml,classpath:/users/tom.yaml ``` |
```

|  |  |
| --- | --- |
|  | Currently, we do not support to provide list of user in single yaml file, you need to keep it in separate files. In-case you have a lot of user files then you can use the wildcard for loading. Below is an example:  mgmtp.a12.uaa.authentication.principal.local-config.user-resources=classpath:users/\*.yaml |

Example Data File:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` username: "admin" password: "admin" authorities: - "Reviewer" - "Admin" - "Manager" email: admin@a.com firstname: Ad lastname: Min ``` |
```

|  |  |
| --- | --- |
|  | Password is not encoded because LOCAL authentication type is intended just for development use. |

For other authentication type(s) it’s not needed because the user is loaded form IDP.

### Custom Attributes for Local User

#### LOCAL

Local user also provides a way to load custom attributes into a `principal`

It’s needed to provide an custom type which contains all the attributes and instantiate a loader with that type.

In the following example we use a `nationality` property.

First it’s needed to provide a custom local user type:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` public class ExampleLocalUser extends LocalUser {  	private String nationality;  	public String getNationality() { 		return nationality; 	}  	public void setNationality(String nationality) { 		this.nationality = nationality; 	}  } ``` |
```

Next step is to instantiate a loaded with proper type into Spring container:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` @Bean @ConditionalOnAuthentication(AuthenticationType.LOCAL) public LocalUserLoader<ExampleLocalUser> userLoader() {     return new UAALocalUserLoader<ExampleLocalUser>(ExampleLocalUser.class); } ``` |
```

From now it' possible to use the new structure in the YAML file

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` username: "admin" password: "admin" authorities: - "Reviewer" - "Admin" - "Manager" email: admin@a.com firstname: Ad lastname: Min nationality: VN ``` |
```

With the following configuration the `nationality` property will be transferred into user object.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.uaa.authentication.principal.additional-properties=nationality ``` |
```

#### LDAP

LDAP response extraction is not yet implemented

## Java Rest Client

UAA provides an infrastructure for client side JAVA API which allows connecting to the server end-points.
The infrastructure simplifies the development of a client and completely handles the security aspects of the connection.

UAA REST Client is built on top of the **REST Connector** from Utils.
The REST Connector provides JAVA API for all HTTP methods.
UAA intercepts a connection and it’s responsible for the following aspects:

* Initiate login flow when the token is missing.
* Store the token in runtime or persistent storage.
* Handle token exchange with the server as header.
* Automatically renew tokens in the background.

[![REST Connector & UAA infrastructure](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/rest-connector.png)](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/rest-connector.png)

Figure 13. REST Connector & UAA infrastructure

|  |  |
| --- | --- |
|  | UAA also provides REST connectors to all its end-points. |

**UAA Endpoints**

* **currentUser** - Load current authenticated user.
* **tokenValid** - Validate JWT token issued by UAA.
* **logout** - Logout a user then invalidate JWT token (if any).
* **reloadRules** - Reload authorization rules from a persistent resource.

### Authentication Types

UAA REST Client supports multiple authentication types. Those types can’t operate simultaneously and must be specified on initialization phase.
The configuration values are the same as for the server:

**All Types**

* [LOCAL](#local-flow) [Login flow will be trigger if authentication data (token) is missing]
* [ACTIVE\_DIRECTORY\_LDAP](#ad-flow) [Login flow will be trigger if authentication data (token) is missing]
* [SAML](#saml-flow) [Login flow will be trigger if authentication data (token) is missing]
* [OAUTH2](#oauth2) [Login flow will be trigger if authentication data (token) is missing]
* [CERTIFICATE](#CertificateAuthentication) [no login flow is needed]
* [API\_KEY](#APIKeyAuthentication) [no login flow is needed]
* DELEGATED [no login flow is needed]

#### LOCAL,ACTIVE\_DIRECTORY\_LDAP,SAML,OAUTH2

Those authentication types require configuration for login flow with credentials.

**You can check the login flow overview for each authentication type here:**

* [LOCAL](#local-flow)
* [ACTIVE\_DIRECTORY\_LDAP](#ad-flow)
* [SAML](#saml-flow)
* [OAUTH2\_PUBLIC](#oauth2-public-flow)
* [OAUTH2\_CONFIDENTIAL](#oauth2-confidential-flow)

#### DELEGATED

Delegated authentication type is a special type which can be described:

> Communication is done on behalf of the logged user.

The authentication can be used only when a rest client is used in the back-end application which needs to communicate to other service(s).
The REST client shares the same authentication token with a request from web browser. It expects that the browser will obtain the token on its own.
There is possibility to exclude contexts by a pattern lists see configuration `excluded-contexts` below.

|  |  |
| --- | --- |
|  | To make the `DELEGATED` it’s needed to register `DelegatingAuthenticationFilter` in the web container. This is done in **uaa-rest-client-spring-boot-autoconfigure** module based on configuration. |

#### CERTIFICATE

The client and server have the TLS handshake to authenticate each other, agree on encryption standards, and establish a secure channel for transferring data.

#### API\_KEY

The client sends an [Api Key](#APIKeyAuthentication) in Authentication header instead of token. API Key is encoded to base64 string.

### Token renewal

UAA REST Client runs token renewal in the background once after the user successfully login.
It will have totally no effect on performance.

The token renewal job will stop when the user logout.

|  |  |
| --- | --- |
|  | The token renewal does not support DELEGATED, CERTIFICATE and API\_KEY modes where it’s not needed. |

### Getting Started

UAA REST client is a plain Java application to allow easy integration for NON Spring applications.
UAA also provides seamless integration with Spring Boot by own configuration modules.

#### Working With Plain Java

Add following dependency to your POM:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` <dependency> 	<groupId>com.mgmtp.a12.uaa</groupId> 	<artifactId>uaa-rest-client</artifactId> 	<version>9.3.3</version> </dependency> ``` |
```

In plain Java you need to instantiate REST Connector and UAA REST Client manually by provided factories.
First it’s needed to create a configuration class: `UAARestClientProperties`
With the configuration it’s possible to instantiate a factory `UAARestClientFactory`.
Only necessary object is the configuration.
All others are optional.

|  |  |
| --- | --- |
|  | Not only for Plain Java application, for any reason if you want to have another rest instance with difference behaviour than default then you can use this UAARestClientFactory also. |

From `UAARestClientFactory` you can get AuthenticationRestClient instance which contains set functions to work with set of UAA authentication end points.

`UAARestClientFactory` also wraps all REST Connector classes, so you can get them from the factory.

Below is a set of examples for each authentication types:

##### LOCAL

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 ``` | ``` public class ProjectLocalRestClientFactory { 	private UAARestClientFactory factory = createFactory();  	public static restClientFactory() { 		return factory; 	}  	private UAARestClientFactory createFactory() { 		// Create Rest Properties 		UAARestClientProperties restClientProperties = new UAARestClientProperties(); 		restClientProperties.setAuthorizationHeaderName("Authorization"); 		restClientProperties.setUaaBase(new UrlProperty("{http}://{uaa-server-host}/{uaa-context-path}")); 		restClientProperties.setAuthenticationType(AuthenticationType.LOCAL); 		restClientProperties.setGeneratedTokenHeaderName("access_token"); 		restClientProperties.setGeneratedTokenExpirationSecondsHeaderName("token_renew_in_seconds");  		// Create Rest Authentication 		UAARestClientAuthenticationProperties authenticationProperties = new UAARestClientAuthenticationProperties(); 		authenticationProperties.setUsername("{username}"); 		authenticationProperties.setPassword("{password}");  		UrlProperty relativeLoginUrlProperty = new UrlProperty("user/local/login"); 		authenticationProperties.setLoginRelative(relativeLoginUrlProperty);  		// Set Rest Authentication for Rest Properties 		restClientProperties.setAuthenticationConfiguration(authenticationProperties);  		UAARestClientFactory uaaRestClientFactory = UAARestClientFactoryBuilder.withConfiguration(restClientProperties).build();  		return uaaRestClientFactory; 	}  }  public class ProjectUsage { 	private AuthenticationRestClient authClient =  ProjectLocalRestClientFactory.restClientFactory().getAuthenticationRestClient();  	public void aMethod() { 		CurrentUser currentUser = authClient.currentUser(); 	} } ``` |
```

##### ACTIVE\_DIRECTORY\_LDAP

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 ``` | ``` public class ProjectLdapRestClientFactory { 	private UAARestClientFactory factory = createFactory();  	public static restClientFactory() { 		return factory; 	}  	private UAARestClientFactory createFactory() { 		// Create Rest Properties 		UAARestClientProperties restClientProperties = new UAARestClientProperties(); 		restClientProperties.setAuthorizationHeaderName("Authorization"); 		restClientProperties.setUaaBase(new UrlProperty("{http}://{uaa-server-host}/{uaa-context-path}")); 		restClientProperties.setAuthenticationType(AuthenticationType.ACTIVE_DIRECTORY_LDAP); 		restClientProperties.setGeneratedTokenHeaderName("access_token"); 		restClientProperties.setGeneratedTokenExpirationSecondsHeaderName("token_renew_in_seconds");  		// Create Rest Authentication 		UAARestClientAuthenticationProperties authenticationProperties = new UAARestClientAuthenticationProperties(); 		authenticationProperties.setUsername("{username}"); 		authenticationProperties.setPassword("{password}");  		UrlProperty relativeLoginUrlProperty = new UrlProperty("user/active_directory_ldap/login"); 		authenticationProperties.setLoginRelative(relativeLoginUrlProperty);  		// Set Rest Authentication for Rest Properties 		restClientProperties.setAuthenticationConfiguration(authenticationProperties);  		UAARestClientFactory uaaRestClientFactory = UAARestClientFactoryBuilder.withConfiguration(restClientProperties).build();  		return uaaRestClientFactory; 	}  }  public class ProjectUsage { 	private AuthenticationRestClient authClient =  ProjectLdapRestClientFactory.restClientFactory().getAuthenticationRestClient();  	public void aMethod() { 		CurrentUser currentUser = authClient.currentUser(); 	} } ``` |
```

##### SAML

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 ``` | ``` public class ProjectSamlRestClientFactory { 	private UAARestClientFactory factory = createFactory();  	public static restClientFactory() { 		return factory; 	}  	private UAARestClientFactory createFactory() { 		// Create Rest Properties 		UAARestClientProperties restClientProperties = new UAARestClientProperties(); 		restClientProperties.setAuthorizationHeaderName("Authorization"); 		restClientProperties.setUaaBase(new UrlProperty("{http}://{uaa-server-host}/{uaa-context-path}")); 		restClientProperties.setAuthenticationType(AuthenticationType.SAML); 		restClientProperties.setGeneratedTokenHeaderName("access_token"); 		restClientProperties.setGeneratedTokenExpirationSecondsHeaderName("token_renew_in_seconds");  		// Create Rest Authentication 		UAARestClientAuthenticationProperties authenticationProperties = new UAARestClientAuthenticationProperties(); 		authenticationProperties.setUsername("{username}"); 		authenticationProperties.setPassword("{password}");  		UrlProperty relativeLoginUrlProperty = new UrlProperty("saml2/authenticate/{registrationId}?uaa_success={http}://{uaa-server-host}/{uaa-context-path}"); 		UrlProperty relativeLogoutUrlProperty = new UrlProperty("/user/logout"); 		SamlProperties saml = new SamlProperties(); 		saml.setLoginRelative(relativeLoginUrlProperty); 		saml.setLogoutRelative(relativeLogoutUrlProperty); 		SsoProperties sso = new SsoProperties(); 		sso.setUsernameXpath("//input[@name='username']"); 		sso.setPasswordXpath("//input[@name='password']"); 		sso.setLoginButtonXpath("//button[@name='login']"); 		saml.setSsoConfiguration(sso); 		authenticationProperties.setSaml(saml);  		// Set Rest Authentication for Rest Properties 		restClientProperties.setAuthenticationConfiguration(authenticationProperties);  		UAARestClientFactory uaaRestClientFactory = UAARestClientFactoryBuilder.withConfiguration(restClientProperties).build();  		return uaaRestClientFactory; 	}  }  public class ProjectUsage { 	private AuthenticationRestClient authClient =  ProjectSamlRestClientFactory.restClientFactory().getAuthenticationRestClient();  	public void aMethod() { 		CurrentUser currentUser = authClient.currentUser(); 	} } ``` |
```

##### OAUTH2 (CONFIDENTIAL)

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 ``` | ``` public class ProjectOauth2RestClientFactory { 	private UAARestClientFactory factory = createFactory();  	public static restClientFactory() { 		return factory; 	}  	private UAARestClientFactory createFactory() { 		// Create Rest Properties 		UAARestClientProperties restClientProperties = new UAARestClientProperties(); 		restClientProperties.setAuthorizationHeaderName("Authorization"); 		restClientProperties.setUaaBase(new UrlProperty("{http}://{uaa-server-host}/{uaa-context-path}")); 		restClientProperties.setAuthenticationType(AuthenticationType.OAUTH2);  		// Create Rest Authentication 		UAARestClientAuthenticationProperties authenticationProperties = new UAARestClientAuthenticationProperties(); 		authenticationProperties.setUsername("{username}"); 		authenticationProperties.setPassword("{password}");  		// Create Oauth2 Confidential Credential 		Oauth2Properties oauth2Properties = new Oauth2Properties(); 		UrlProperty idpBaseUrl = new UrlProperty("{http}://{keycloak-server-host}/{keycloak-context-path}"); 		Oauth2Properties.ConfidentialClientProperties confidentialClientProperties = new Oauth2Properties.ConfidentialClientProperties(); 		confidentialClientProperties.setClientSecret("{client-secret}"); 		confidentialClientProperties.setClientId("{confidential-client-id}"); 		confidentialClientProperties.setRealmName("{realm-name}"); 		confidentialClientProperties.setIdpBase(idpBaseUrl); 		UrlProperty loginRelativeUrl = new UrlProperty("token"); 		confidentialClientProperties.setLoginRelative(loginRelativeUrl); 		oauth2Properties.setConfidentialClient(confidentialClientProperties);  		// Set Oauth2 Confidential Credential For Rest Authentication 		authenticationProperties.setOauth2(oauth2Properties);  		// Set Rest Authentication for Rest Properties 		restClientProperties.setAuthenticationConfiguration(authenticationProperties);  		UAARestClientFactory uaaRestClientFactory = UAARestClientFactoryBuilder.withConfiguration(restClientProperties).build();  		return uaaRestClientFactory; 	}  }  public class ProjectUsage { 	private AuthenticationRestClient authClient =  ProjectOauth2RestClientFactory.restClientFactory().getAuthenticationRestClient();  	public void aMethod() { 		CurrentUser currentUser = authClient.currentUser(); 	} } ``` |
```

##### OAUTH2 (PUBLIC)

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 ``` | ``` public class ProjectOauth2RestClientFactory { 	private UAARestClientFactory factory = createFactory();  	public static restClientFactory() { 		return factory; 	}  	private UAARestClientFactory createFactory() { 		// Create Rest Properties 		UAARestClientProperties restClientProperties = new UAARestClientProperties(); 		restClientProperties.setAuthorizationHeaderName("Authorization"); 		restClientProperties.setUaaBase(new UrlProperty("{http}://{uaa-server-host}/{uaa-context-path}")); 		restClientProperties.setAuthenticationType(AuthenticationType.OAUTH2);  		// Create Rest Authentication 		UAARestClientAuthenticationProperties authenticationProperties = new UAARestClientAuthenticationProperties(); 		authenticationProperties.setUsername("{username}"); 		authenticationProperties.setPassword("{password}");  		// Create Oauth2 Public 		Oauth2Properties oauth2Properties = new Oauth2Properties(); 		UrlProperty idpBaseUrl = new UrlProperty("{http}://{keycloak-server-host}/{keycloak-context-path}"); 		oauth2Properties.setClientType(ClientType.PUBLIC);  		PublicClientProperties publicClientProperties = new PublicClientProperties(); 		publicClientProperties.setClientId("{public-client-id}"); 		publicClientProperties.setRealmName("{realm-name}"); 		publicClientProperties.setIdpBase(idpBaseUrl);         UrlProperty loginRelativeUrl = new UrlProperty("auth"); 		SsoProperties sso = new SsoProperties(); 		sso.setUsernameXpath("//input[@name='username']"); 		sso.setPasswordXpath("//input[@name='password']"); 		sso.setLoginButtonXpath("//button[@name='login']");         publicClientProperties.setLoginRelative(loginRelativeUrl); 		publicClientProperties.setSsoConfiguration(sso);  		oauth2Properties.setPublicClient(publicClientProperties);  		// Set Oauth2 Confidential Credential For Rest Authentication 		authenticationProperties.setOauth2(oauth2Properties);  		// Set Rest Authentication for Rest Properties 		restClientProperties.setAuthenticationConfiguration(authenticationProperties);  		UAARestClientFactory uaaRestClientFactory = UAARestClientFactoryBuilder.withConfiguration(restClientProperties).build();  		return uaaRestClientFactory; 	}  }  public class ProjectUsage { 	private AuthenticationRestClient authClient =  ProjectOauth2RestClientFactory.restClientFactory().getAuthenticationRestClient();  	public void aMethod() { 		CurrentUser currentUser = authClient.currentUser(); 	} } ``` |
```

##### CERTIFICATE

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 ``` | ``` public class ProjectCertificateRestClientFactory { 	private UAARestClientFactory factory = createFactory();  	public static restClientFactory() { 		return factory; 	}  	private UAARestClientFactory createFactory() { 		CertificateProperties certificateProperties = new CertificateProperties(); 		certificateProperties.setKeyStore("classpath:${KeyStorePath}"); 		certificateProperties.setkeyStorePassword("${KeyStorePassword}"); 		certificateProperties.settrustStore("classpath:${TrustStorePath}"); 		certificateProperties.settrustStorePassword("${TrustStorePassword}");  		UAARestClientAuthenticationProperties authConfig = new UAARestClientAuthenticationProperties(); 		authConfig.setCertificate(certificateProperties);  		UrlProperty uaaBaseUrlProperty = new UrlProperty("{http}://{uaa-server-host}/{uaa-context-path}"); 		UAARestClientProperties uaaRestConfig = new UAARestClientProperties(); 		uaaRestConfig.setUaaBase(uaaBaseUrlProperty);  		uaaRestConfig.setAuthenticationType(AuthenticationType.CERTIFICATE); 		uaaRestConfig.setAuthenticationConfiguration(authConfig);  		return UAARestClientFactoryBuilder 				.withConfiguration(uaaRestConfig) 				.build(); 	}  }  public class ProjectUsage { 	private AuthenticationRestClient authClient =  ProjectCertificateRestClientFactory.restClientFactory().getAuthenticationRestClient();  	public void aMethod() { 		CurrentUser currentUser = authClient.currentUser(); 	} } ``` |
```

##### API\_KEY

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 ``` | ``` public class ProjectAPIKeyRestClientFactory { 	private UAARestClientFactory factory = createFactory();  	public static restClientFactory() { 		return factory; 	}  	private UAARestClientFactory createFactory() { 		UrlProperty uaaBaseUrlProperty = new UrlProperty("{http}://{uaa-server-host}/{uaa-context-path}"); 		UAARestClientProperties restClientProperties = new UAARestClientProperties(); 		restClientProperties.setAuthorizationHeaderName("Authorization"); 		restClientProperties.setUaaBase(uaaBaseUrlProperty); 		restClientProperties.setAuthenticationType(AuthenticationType.API_KEY); 		restClientProperties.setAPIKeyResource("classpath:/{path}/{apikey-name}.crt"); 		UAARestClientFactory uaaRestClientFactory = UAARestClientFactoryBuilder                     .withConfiguration(restClientProperties)                     .build(); 	}  }  public class ProjectUsage { 	private AuthenticationRestClient authClient =  ProjectAPIKeyRestClientFactory.restClientFactory().getAuthenticationRestClient();  	public void aMethod() { 		CurrentUser currentUser = authClient.currentUser(); 	} } ``` |
```

##### DELEGATED

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 ``` | ``` public class ProjectDelegatedRestClientFactory { 	private UAARestClientFactory factory = createFactory();  	public static restClientFactory() { 		return factory; 	}  	private UAARestClientFactory createFactory() { 		UrlProperty uaaBaseUrlProperty = new UrlProperty("{http}://{uaa-server-host}/{uaa-context-path}"); 		UAARestClientProperties restClientProperties = new UAARestClientProperties(); 		restClientProperties.setAuthorizationHeaderName("Authorization"); 		restClientProperties.setUaaBase(uaaBaseUrlProperty); 		restClientProperties.setAuthenticationType(AuthenticationType.DELEGATED); 		UAARestClientFactory uaaRestClientFactory = UAARestClientFactoryBuilder                     .withConfiguration(restClientProperties)                     .build(); 	}  }  public class ProjectUsage { 	private AuthenticationRestClient authClient =  ProjectDelegatedRestClientFactory.restClientFactory().getAuthenticationRestClient();  	public void aMethod() { 		CurrentUser currentUser = authClient.currentUser(); 	} } ``` |
```

|  |  |
| --- | --- |
|  | It makes no sense to instantiate the rest client again. Once the `UAARestClientFactory` is created it’s recommended to keep the reference for application lifetime. |

|  |  |  |  |
| --- | --- | --- | --- |
|  | Optionally you can provide custom user object to the REST client.  ``` |  |  | | --- | --- | | ``` 1 2 ``` | ``` CustomCurrentUser currentUser = authClient.currentUser(CustomCurrentUser.class); ``` | ``` |

From the project side, besides the default UAA authentication end points. If you want to connect to your end-point then you can do it by using the connector below:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` public class CustomConnector {  	private static final String ENDPOINT_URL = "readData";  	private RestGetConnector getConnector; 	private UrlBuilderSupport urlBuilderSupport;  	public CustomConnector(String baseUrl, RestGetConnector getConnector) { 		this.getConnector = getConnector; 		this.urlBuilderSupport = UrlBuilderSupport.withBaseUrl(baseUrl); 	}  	public String readData() { 		String url = urlBuilderSupport.createBuilder().pathSegment(ENDPOINT_URL).toUriString(); 		return getConnector.callServer(url, RestServerRequest.empty(), String.class).getData(); 	}  } ``` |
```

#### Working With Spring Application

Add following dependency to your POM:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` <dependency> 	<groupId>com.mgmtp.a12.uaa</groupId> 	<artifactId>uaa-rest-client</artifactId> 	<version>9.3.3</version> </dependency> ``` |
```

Usage in Spring application is similar to plain Java.
You need to instantiate the UAA REST Client manually.
It’s recommended to do it in a `@Configuration` class and provide a `@Bean` (UAA clients/connectors) to the application context which can be injected when necessary.
`UAARestClientFactory` also wraps all REST Connector classes, so you can get them from the factory.
As you can see in last lines in the example if you need `Connector` beans in the application context you can propagate them from the factory.

To create UAARestClientProperties instance (on below Configuration example) for each authentication type. Please refer ([link](#rest-client-usage-java)).

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 ``` | ``` @Configuration public class UaaRestClientConfiguration {  	private UAARestClientFactory uaaRestClientFactory;  	@PostConstruct 	void initialize() { 		UAARestClientProperties restClientProperties = new UAARestClientProperties(); 		uaaRestClientFactory = UAARestClientFactoryBuilder 			.withConfiguration(restClientProperties) 			.withErrorHandlers(...) 			.withInterceptors(...) 			.withMessageConverters(...) 			.build();  	}  	@Bean 	public AuthenticationRestClient authenticationRestClient() { 		return uaaRestClientFactory.getAuthenticationRestClient(); 	}  	@Bean 	public AuthorizationRestClient authorizationRestClient() { 		return uaaRestClientFactory.getAuthorizationRestClient(); 	}  	//Optionally you can create a @Bean for each connector 	@Bean 	public RestGetConnector restGetConnector() { 		return uaaRestClientFactory.getGetConnector(); 	}  } ``` |
```

#### Working With Spring Boot Application

Add following dependency to your POM:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` <!-- contains utils-rest-server-connector --> <dependency> 	<groupId>com.mgmtp.a12.utils</groupId> 	<artifactId>utils-rest-server-connector-spring-boot-autoconfigure</artifactId> 	<version>8.2.1</version> </dependency>  <dependency> 	<groupId>com.mgmtp.a12.uaa</groupId> 	<artifactId>uaa-rest-client</artifactId> 	<version>9.3.3</version> </dependency>  <dependency> 	<groupId>com.mgmtp.a12.uaa</groupId> 	<artifactId>uaa-rest-client-spring-boot-autoconfigure</artifactId> 	<version>9.3.3</version> </dependency> ``` |
```

In a Spring Boot application all configuration is handled for you in **autoconfigure** modules.
Everything is configured by a configuration properties.

##### LOCAL/ACTIVE\_DIRECTORY\_LDAP

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.client.rest.uaa-base.url` | `http://localhost:8080` | Base URL for UAA related endpoints, e.g, `login/logout/currentUser`. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-type` | `LOCAL` | The authentication type you want to use to communicate with the server. | `LOCAL` or `ACTIVE_DIRECTORY_LDAP` should be specified properly, depending on the specific authentication type. |
| `mgmtp.a12.uaa.authentication.client.rest.generated-token-header-name` | `access_token` | Header name in the login server response where token is expected. | Only valid with `LOCAL`, `ACTIVE_DIRECTORY_LDAP` or `SAML` mode. |
| `mgmtp.a12.uaa.authentication.client.rest.authorization-data-store` | `` | String `resource` where the authorization token is persisted. | Notice that it will not work on `CERTIFICATE` mode. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.login-relative.url` | `user/local/login` | The login url. | You need to change the default value to `user/active_directory_ldap/login` based on the `ACTIVE_DIRECTORY_LDAP` authentication type. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.username` | `` | The login credentials required to access to the server. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.password` | `` | The login credentials required to access to the server. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authorization-header-name` | `Authorization` | Header name which is used to send `authorization token` to server. |  |

##### SAML

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.client.rest.uaa-base.url` | `http://localhost:8080` | Base URL for UAA related endpoints, e.g, `login/logout/currentUser`. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-type` | `LOCAL` | The authentication type you want to use to communicate with the server. | You need to change the default value to `SAML` for using. |
| `mgmtp.a12.uaa.authentication.client.rest.generated-token-header-name` | `access_token` | Header name in the login server response where token is expected. | Only valid with `LOCAL`, `ACTIVE_DIRECTORY_LDAP` or `SAML` mode. |
| `mgmtp.a12.uaa.authentication.client.rest.authorization-data-store` | `` | String `resource` where the authorization token is persisted. | Notice that it will not work on `CERTIFICATE` mode. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.username` | `` | The login credentials required to access to the server. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.password` | `` | The login credentials required to access to the server. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.saml.login-relative.url` | `` | The relative login url for saml, e.g `saml2/authenticate/uaa?uaa_success=http://http://{the_server_domain_which_include_this_rest_client}`. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.saml.logout-relative.url` | `` | The relative logout url for saml . |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.saml.sso-configuration.username-xpath` | `` | Xpath for login name field on the IDP page. | e.g, `//input[@name='username']` |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.saml.sso-configuration.password-xpath` | `` | Xpath for password field on the IDP page. | e.g, `//input[@name='password']` |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.saml.sso-configuration.login-button-xpath` | `` | Xpath for login button on the IDP page. | e.g, `//button[@name='login']` |
| `mgmtp.a12.uaa.authentication.client.rest.authorization-header-name` | `Authorization` | Header name which is used to send `authorization token` to server. |  |

##### OAUTH2 (PUBLIC)

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-type` | `LOCAL` | The authentication type you want to use to communicate with the server. | You need to change the default value to `OAUTH2` for using. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.client-type` | `CONFIDENTIAL` | The applications are not able to securely authenticate | You need to change the default value to `PUBLIC` for using. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.public-client.client-id` | `` |  |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.public-client.realm-name` | `` | Realm name which contains this client id on the IDP. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.public-client.idp-base.url` | `http://localhost:9090/` | Base url of the IDP. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.public-client.login-relative.url` | `auth` | This is standard endpoint for openid authentication flow. | Incase your IDP provides a different url otherwise please do not change this. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.public-client.login-redirect-relative.url` | `callback` | The relative url uses to redirect after the authentication request (above) successfully. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.public-client.token-exchange-relative.url` | `token` | This is standard endpoint for openid authentication flow. | Incase your IDP provides a different url otherwise please do not change this. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.public-client.logout-relative.url` | `logout` | This is standard endpoint for openid logout. | Incase your IDP provides a different url otherwise please do not change this. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.public-client.token-renew-threshold-in-seconds` | `60` | How many seconds before token expiration to start silent renewal. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.username` | `` | The login credentials required to access to the server. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.password` | `` | The login credentials required to access to the server. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.public-client.sso-configuration.username-xpath` | `` | Xpath for login name field on the IDP page. | e.g, `//input[@name='username']` |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.public-client.sso-configuration.password-xpath` | `` | Xpath for password field on the IDP page. | e.g, `//input[@name='password']` |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.public-client.sso-configuration.login-button-xpath` | `` | path for login button on the IDP page. | e.g, `//button[@name='login']` |
| `mgmtp.a12.uaa.authentication.client.rest.uaa-base.url` | `http://localhost:8080` | Base URL for UAA related endpoints, e.g, `currentUser`. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authorization-header-name` | `Authorization` | Header name which is used to send `authorization token` to server. |  |

##### OAUTH2 (CONFIDENTIAL)

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-type` | `LOCAL` | The authentication type you want to use to communicate with the server. | You need to change the default value to `OAUTH2` for using. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.client-type` | `CONFIDENTIAL` | The applications are able to securely authenticate |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.public-client.client-id` | `` | OAUTH2 client ID. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.public-client.realm-name` | `` | Realm name which contains this client id on the IDP. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.public-client.idp-base.url` | `http://localhost:9090/` | Base url of the IDP. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.confidential-client.login-relative.url` | `token` | This is standard endpoint for oidc login flow. | Incase your IDP provides a different url otherwise please do not change this. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.confidential-client.logout-relative.url` | `logout` | This is standard endpoint for oidc logout. | Incase your IDP provides a different url otherwise please do not change this. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.confidential-client.client-secret` | `` | IDP client secret. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.confidential-client.token-renew-threshold-in-seconds` | `60` | How many seconds before token expiration to start silent renewal. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.username` | `` | The login credentials required to access to the server. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.password` | `` | The login credentials required to access to the server. |  |
| `mgmtp.a12.uaa.authentication.client.rest.uaa-base.url` | `http://localhost:8080` | Base URL for UAA related endpoints, e.g, `currentUser`. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authorization-header-name` | `Authorization` | Header name which is used to send `authorization token` to server. |  |

##### CERTIFICATE

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-type` | `LOCAL` | The authentication type you want to use to communicate with the server. | You need to change the default value to `CERTIFICATE` for using. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.certificate.key-store` |  | Classpath file-system path to the PKCS#12 (.p12) KeyStore that contains the REST client’s private key and certificate chain. | The client must present this certificate to prove its identity to clients. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.certificate.key-store-password` |  | Password that unlocks the KeyStore above. | Client needs this password to load the client’s private key when building the SSLContext, without it the secure client cannot start. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.certificate.trust-store` |  | Path to the trust store (.p12) holding the CA certificates that the client trusts. | Enables the client to verify the server’s certificate chain and establish a secure connection. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.certificate.trust-store-password` |  | Password that unlocks the trust store. | Required so client can read the trusted certificates list during RestTemplate initialization. |

##### API\_KEY

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-type` | `LOCAL` | The authentication type you want to use to communicate with the server. | You need to change the default value to `API_KEY` for using. |
| `mgmtp.a12.uaa.authentication.client.rest.api-key-resource` | `` | The api\_key required to authenticate access to the server. | Support for single file. |
| `mgmtp.a12.uaa.authentication.client.rest.uaa-base.url` | `http://localhost:8080` | Base URL for UAA related endpoints, e.g, `currentUser`. |  |

##### DELEGATED

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-type` | `LOCAL` | The authentication type is depend on incoming request. | You need to change the default value to `DELEGATED` for using. |
| `mgmtp.a12.uaa.authentication.client.rest.delegated-mode-configuration.excluded-contexts` | `` | Excluded context patterns. | **UAA will not manipulate the authentication tokens of these un-secure urls.** |
| `mgmtp.a12.uaa.authentication.client.rest.uaa-base.url` | `http://localhost:8080` | Base URL for UAA related endpoints, e.g, `currentUser`. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authorization-header-name` | `Authorization` | Header name which is used to send `certificate` to server. |  |

### Client With Self Configuration

The UAA REST Client supports self configuration.
If configured, the client downloads configuration from the server.
On the rest client just a few configuration settings are needed.

**Self configuration settings**

* Self Configuration URL [Required for all authentication types]
* UserName [Required for all authentication types]
* Password [Required for all authentication types]
* Oauth2 ClientType [Required for oauth2 type only]
* Oauth2 ClientSecret [Required for oauth2 type which client type is confidential only]
* Certificate [Required for key-store, key-store-password, trust-store and trust-store-password]
* Api\_key Resource [Required for api\_key type only]

#### In plain Java or Spring application

instantiate the UAA REST Client manually.

Below is a set of examples for each authentication types:

##### LOCAL

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 ``` | ``` public class ProjectLocalRestClientFactory { 	private UAARestClientFactory factory = createFactory();  	public static restClientFactory() { 		return factory; 	}  	private UAARestClientFactory createFactory() { 				UAARestClientProperties uaaRestConfig = new UAARestClientProperties(); 		uaaRestConfig.setSelfconfiguration(new UrlProperty("{http}://{uaa-server-host}/{uaa-context-path}/uaa-authentication/selfconfigure")); 		uaaRestConfig.setAuthenticationType(AuthenticationType.LOCAL); 		UAARestClientAuthenticationProperties authConfig = new UAARestClientAuthenticationProperties(); 		authConfig.setUsername(username); 		authConfig.setPassword(password); 		uaaRestConfig.setAuthenticationConfiguration(authConfig); 		return UAARestClientFactoryBuilder.withConfiguration(uaaRestConfig).build(); 	}  }  public class ProjectUsage { 	private AuthenticationRestClient authClient =  ProjectLocalRestClientFactory.restClientFactory().getAuthenticationRestClient();  	public void aMethod() { 		CurrentUser currentUser = authClient.currentUser(); 	} } ``` |
```

##### ACTIVE\_DIRECTORY\_LDAP

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 ``` | ``` public class ProjectLdapRestClientFactory { 	private UAARestClientFactory factory = createFactory();  	public static restClientFactory() { 		return factory; 	}  	private UAARestClientFactory createFactory() { 		UAARestClientProperties uaaRestConfig = new UAARestClientProperties(); 		uaaRestConfig.setSelfconfiguration(new UrlProperty("{http}://{uaa-server-host}/{uaa-context-path}/uaa-authentication/selfconfigure")); 		uaaRestConfig.setAuthenticationType(AuthenticationType.ACTIVE_DIRECTORY_LDAP); 		UAARestClientAuthenticationProperties authConfig = new UAARestClientAuthenticationProperties(); 		authConfig.setUsername("{username}"); 		authConfig.setPassword("{password}"); 		uaaRestConfig.setAuthenticationConfiguration(authConfig); 		return UAARestClientFactoryBuilder.withConfiguration(uaaRestConfig).build(); 	}  }  public class ProjectUsage { 	private AuthenticationRestClient authClient =  ProjectLdapRestClientFactory.restClientFactory().getAuthenticationRestClient();  	public void aMethod() { 		CurrentUser currentUser = authClient.currentUser(); 	} } ``` |
```

##### SAML

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 ``` | ``` public class ProjectSamlRestClientFactory { 	private UAARestClientFactory factory = createFactory();  	public static restClientFactory() { 		return factory; 	}  	private UAARestClientFactory createFactory() { 		UAARestClientProperties uaaRestConfig = new UAARestClientProperties(); 		uaaRestConfig.setSelfconfiguration(new UrlProperty("{http}://{uaa-server-host}/{uaa-context-path}/uaa-authentication/selfconfigure")); 		uaaRestConfig.setAuthenticationType(AuthenticationType.SAML); 		UAARestClientAuthenticationProperties authConfig = new UAARestClientAuthenticationProperties(); 		authConfig.setUsername("{username}"); 		authConfig.setPassword("{password}"); 		uaaRestConfig.setAuthenticationConfiguration(authConfig); 		return UAARestClientFactoryBuilder.withConfiguration(uaaRestConfig).build(); 	}  }  public class ProjectUsage { 	private AuthenticationRestClient authClient =  ProjectSamlRestClientFactory.restClientFactory().getAuthenticationRestClient();  	public void aMethod() { 		CurrentUser currentUser = authClient.currentUser(); 	} } ``` |
```

##### OAUTH2 (PUBLIC)

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 ``` | ``` public class ProjectOauth2RestClientFactory { 	private UAARestClientFactory factory = createFactory();  	public static restClientFactory() { 		return factory; 	}  	private UAARestClientFactory createFactory() { 		UAARestClientProperties uaaRestConfig = new UAARestClientProperties(); 		uaaRestConfig.setSelfconfiguration(new UrlProperty("{http}://{uaa-server-host}/{uaa-context-path}/uaa-authentication/selfconfigure")); 		uaaRestConfig.setAuthenticationType(AuthenticationType.OAUTH2); 		UAARestClientAuthenticationProperties authConfig = new UAARestClientAuthenticationProperties(); 		authConfig.setUsername("{username}"); 		authConfig.setPassword("{password}"); 		Oauth2Properties oauth2Properties = new Oauth2Properties(); 		oauth2Properties.setClientType(ClientType.PUBLIC); 		authConfig.setOauth2(oauth2Properties); 		uaaRestConfig.setAuthenticationConfiguration(authConfig); 		return UAARestClientFactoryBuilder 				.withConfiguration(uaaRestConfig) 				.build(); 	}  }  public class ProjectUsage { 	private AuthenticationRestClient authClient =  ProjectOauth2RestClientFactory.restClientFactory().getAuthenticationRestClient();  	public void aMethod() { 		CurrentUser currentUser = authClient.currentUser(); 	} } ``` |
```

##### OAUTH2 (CONFIDENTIAL)

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 ``` | ``` public class ProjectOauth2RestClientFactory { 	private UAARestClientFactory factory = createFactory();  	public static restClientFactory() { 		return factory; 	}  	private UAARestClientFactory createFactory() { 		UAARestClientProperties uaaRestConfig = new UAARestClientProperties(); 		uaaRestConfig.setSelfconfiguration(new UrlProperty("{http}://{uaa-server-host}/{uaa-context-path}/uaa-authentication/selfconfigure")); 		uaaRestConfig.setAuthenticationType(AuthenticationType.OAUTH2); 		UAARestClientAuthenticationProperties authConfig = new UAARestClientAuthenticationProperties(); 		authConfig.setUsername("{username}"); 		authConfig.setPassword("{password}"); 		Oauth2Properties oauth2Properties = new Oauth2Properties(); 		Oauth2Properties.ConfidentialClientProperties confidentialClientProperties = new Oauth2Properties.ConfidentialClientProperties(); 		confidentialClientProperties.setClientSecret("{client-secret}"); 		oauth2Properties.setConfidentialClient(confidentialClientProperties); 		authConfig.setOauth2(oauth2Properties); 		uaaRestConfig.setAuthenticationConfiguration(authConfig); 		return UAARestClientFactoryBuilder 				.withConfiguration(uaaRestConfig) 				.build(); 	}  }  public class ProjectUsage { 	private AuthenticationRestClient authClient =  ProjectOauth2RestClientFactory.restClientFactory().getAuthenticationRestClient();  	public void aMethod() { 		CurrentUser currentUser = authClient.currentUser(); 	} } ``` |
```

##### CERTIFICATE

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 ``` | ``` public class ProjectCertificateRestClientFactory { 	private UAARestClientFactory factory = createFactory();  	public static restClientFactory() { 		return factory; 	}  	private UAARestClientFactory createFactory() { 		CertificateProperties certificateProperties = new CertificateProperties(); 		certificateProperties.setKeyStore("classpath:${KeyStorePath}"); 		certificateProperties.setkeyStorePassword("${KeyStorePassword}"); 		certificateProperties.settrustStore("classpath:${TrustStorePath}"); 		certificateProperties.settrustStorePassword("${TrustStorePassword}"); 		UAARestClientAuthenticationProperties authConfig = new UAARestClientAuthenticationProperties(); 		authConfig.setCertificate(certificateProperties); 		UAARestClientProperties uaaRestConfig = new UAARestClientProperties(); 		uaaRestConfig.setSelfconfiguration(new UrlProperty("{http}://{uaa-server-host}/{uaa-context-path}/uaa-authentication/selfconfigure")); 		uaaRestConfig.setAuthenticationType(AuthenticationType.CERTIFICATE); 		uaaRestConfig.setAuthenticationConfiguration(authConfig); 		return UAARestClientFactoryBuilder 				.withConfiguration(uaaRestConfig) 				.build(); 	}  }  public class ProjectUsage { 	private AuthenticationRestClient authClient =  ProjectCertificateRestClientFactory.restClientFactory().getAuthenticationRestClient();  	public void aMethod() { 		CurrentUser currentUser = authClient.currentUser(); 	} } ``` |
```

##### API\_KEY

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 ``` | ``` public class ProjectAPIKeyRestClientFactory { 	private UAARestClientFactory factory = createFactory();  	public static restClientFactory() { 		return factory; 	}  	private UAARestClientFactory createFactory() { 		UAARestClientProperties uaaRestConfig = new UAARestClientProperties(); 		uaaRestConfig.setSelfconfiguration(new UrlProperty("{http}://{uaa-server-host}/{uaa-context-path}/uaa-authentication/selfconfigure")); 		uaaRestConfig.setAuthenticationType(AuthenticationType.API_KEY); 		uaaRestConfig.setAPIKeyResource("classpath:/{path}/{apikey-name}.crt"); 		return UAARestClientFactoryBuilder 				.withConfiguration(uaaRestConfig) 				.build(); 	}  }  public class ProjectUsage { 	private AuthenticationRestClient authClient =  ProjectAPIKeyRestClientFactory.restClientFactory().getAuthenticationRestClient();  	public void aMethod() { 		CurrentUser currentUser = authClient.currentUser(); 	} } ``` |
```

#### In a Spring Boot application

Everything is configured by a configuration properties.

##### LOCAL/ACTIVE\_DIRECTORY\_LDAP/SAML

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-type` | `LOCAL` | The authentication type you want to use to communicate with the server. | `LOCAL` or `ACTIVE_DIRECTORY_LDAP` or `SAML` should be specified properly, depending on the specific authentication type. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.username` | `` | The login credentials required to access to the server. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.password` | `` | The login credentials required to access to the server. |  |
| `mgmtp.a12.uaa.authentication.client.rest.selfconfiguration.url` | `` | Specify it, the rest of configurations will be automatically downloaded from server . | e.g, <http://localhost:8080/uaa-authentication/selfconfigure> |

##### OAUTH2 (PUBLIC)

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-type` | `LOCAL` | The authentication type you want to use to communicate with the server. | You need to change the default value to `OAUTH2` for using. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oauth2.client-type` | `CONFIDENTIAL` | The applications are not able to securely authenticate | You need to change the default value to `PUBLIC` for using. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.username` | `` | The login credentials required to access to the server. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.password` | `` | The login credentials required to access to the server. |  |
| `mgmtp.a12.uaa.authentication.client.rest.selfconfiguration.url` | `` | Specify it, the rest of configurations will be automatically downloaded from server . | e.g, <http://localhost:8080/uaa-authentication/selfconfigure> |

##### OAUTH2 (CONFIDENTIAL)

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-type` | `LOCAL` | The authentication type you want to use to communicate with the server. | You need to change the default value to `OAUTH2` for using. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.oidc.confidential-client.client-secret=` | `` | IDP client secret. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.username` | `` | The login credentials required to access to the server. |  |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.password` | `` | The login credentials required to access to the server. |  |
| `mgmtp.a12.uaa.authentication.client.rest.selfconfiguration.url` | `` | Specify it, the rest of configurations will be automatically downloaded from server . | e.g, <http://localhost:8080/uaa-authentication/selfconfigure> |

##### CERTIFICATE

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-type` | `LOCAL` | The authentication type you want to use to communicate with the server. | You need to change the default value to `CERTIFICATE` for using. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.certificate.key-store` |  | Classpath file-system path to the PKCS#12 (.p12) KeyStore that contains the REST client’s private key and certificate chain. | The client must present this certificate to prove its identity to clients. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.certificate.key-store-password` |  | Password that unlocks the KeyStore above. | Client needs this password to load the client’s private key when building the SSLContext, without it the secure client cannot start. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.certificate.trust-store` |  | Path to the trust store (.p12) holding the CA certificates that the client trusts. | Enables the client to verify the server’s certificate chain and establish a secure connection. |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.certificate.trust-store-password` |  | Password that unlocks the trust store. | Required so client can read the trusted certificates list during RestTemplate initialization. |
| `mgmtp.a12.uaa.authentication.client.rest.selfconfiguration.url` | `` | Specify it, the rest of configurations will be automatically downloaded from server . | e.g, <http://localhost:8080/uaa-authentication/selfconfigure> |

##### API\_KEY

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-type` | `LOCAL` | The authentication type you want to use to communicate with the server. | You need to change the default value to `API_KEY` for using. |
| `mgmtp.a12.uaa.authentication.client.rest.api-key-resource` | `` | The certificate resource which uses to authenticate with server. | Support for single file. |
| `mgmtp.a12.uaa.authentication.client.rest.selfconfiguration.url` | `` | Specify it, the rest of configurations will be automatically downloaded from server . | e.g, <http://localhost:8080/uaa-authentication/selfconfigure> |

##### DELEGATED

| Configuration property | Default value | Usage | Remark |
| --- | --- | --- | --- |
| `mgmtp.a12.uaa.authentication.client.rest.authentication-type` | `LOCAL` | The authentication type is depend on incoming request. | You need to change the default value to `DELEGATED` for using. |
| `mgmtp.a12.uaa.authentication.client.rest.selfconfiguration.url` | `` | Specify it, the rest of configurations will be automatically downloaded from server . | e.g, <http://localhost:8080/uaa-authentication/selfconfigure> |

#### Working With Spring Boot Application

Beside default endpoints supported by UAA REST Client, you can make your own requests to any others endpoints.
Let check the example bellow

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 ``` | ``` public class ExampleCustomRestClient {  	private static final String CONTEXT = "context"; 	private static final String POST_ENDPOINT = "postPath"; 	private static final String GET_ENDPOINT = "getPath";  	private RestGetConnector getConnector; 	private RestPostConnector postConnector; 	private UrlBuilderSupport urlBuilderSupport;  	public ExampleCustomRestClient(String baseUrl, RestGetConnector getConnector, RestPostConnector postConnector) { 		this.getConnector = getConnector; 		this.postConnector = postConnector; 		this.urlBuilderSupport = UrlBuilderSupport.withBaseUrl(baseUrl, CONTEXT); 	}  	/** 	 * Make get request 	 */ 	public <T> T getRequest(Class<T> userType) { 		String url = urlBuilderSupport.createBuilder().pathSegment(GET_ENDPOINT).toUriString(); 		return getConnector.callServer(url, RestServerRequest.empty(), userType).getData(); 	}  	/** 	 * Make post request 	 */ 	public boolean postRequest(String body) { 		String url = urlBuilderSupport.createBuilder().pathSegment(POST_ENDPOINT).toUriString(); 		try { 			RestServerRequest<String> request = RestServerRequest.withPayload(body); 			return postConnector.callServer(url, request, Boolean.class).getData(); 		} catch (Exception e) { 			//do something 		} 		return false; 	}  } ``` |
```

Based on the request method, you can use respective built-in helper classes to make the request calling, such as `RestGetConnector` for get method, `RestPostConnector` for post method.

Using helper `UrlBuilderSupport` class to easily build the complete url.

## JavaScript Client

### Introduction

The **UAA-Authentication-Client** is a library that provides some way to integrate authentication for application clients. It supports 4 types of authentication:

* **LOCAL**
* **SAML**,
* **ACTIVE DIRECTORY LDAP**
* **OAUTH2**

and include these features:

* Integrate a single authenticate type.
* Integrate multiple authenticate types.
* Simplify and quickly integration through a self-configure.
* Restore authentication automatically.
* Automatically renew tokens.
* Support localization.
* UAA components customization.
* Register Service Worker for token injection

This is flow diagram of uaa-authentication-client:

[![Basic flow diagram](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/javascript-client/basicFlow.png "Basic flow diagram")](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/javascript-client/basicFlow.png)

### Features

#### Integrate with UAA Client

##### How to set up

To build an application integration with UAA, follow these general steps:

* Determine the configuration of authentication types that is used
* Determine the `UaaClientConfiguration` including the authentication types as determined above
* Add UaaReducer, UaaMiddlewares to redux
* Initialize your client by one of the following two ways:

  + Wrapper the main react component by UaaProvider with `UaaClientConfiguration`

    - The `automaticallyLogin` option will be applied to all authentication types when used in this way.
  + Manually initialize the UaaClient using `UaaClient.init(UaaClientConfiguration)`

    - The `automaticallyLogin` option will only be applied to the `OAUTH2` authentication type, while the rest of the authentication types will be managed by `restoreAuthenticationState`.

|  |  |
| --- | --- |
|  | Do not use both ways simultaneously. |

You can follow these instructions

Example determine the configuration of Local authentication:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` // Create one local configure const localConfigure: UaaLocalConfiguration = {     timeout?: 3000,     serverURL: "{your_uaa_server_domain}/{uaa-context-path}",     serverConnector?: "{your_server_connector}",     additionalRequestFilter?: [],     additionalResponseFilter?: [],     logoutMethod?: "{method_logout}",     tokenType?: "{token_type}",     loginRelativeUrl?: "{login_relative_url}",     logoutRelativeUrl?: "{logout_relative_url}" }; ``` |
```

Example determine the configuration of Ldap authentication:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` // Create one ldap configuration const ldapConfigure: UaaLdapConfiguration = {     timeout?: 3000,     serverURL: "{your_uaa_server_domain}/{uaa-context-path}",     serverConnector?: "{your_server_connector}",     additionalRequestFilter?: [],     additionalResponseFilter?: [],     logoutMethod?: "{method_logout}",     tokenType?: "{token_type}",     loginRelativeUrl?: "{login_relative_url}",     logoutRelativeUrl?: "{logout_relative_url}" }; ``` |
```

Example determine the configuration of Saml authentication:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` // Create one saml configure const samlConfigure: UaaSamlConfiguration = {     timeout?: 3000,     serverURL: "{your_uaa_server_domain}/{uaa-context-path}",     serverConnector?: "{your_server_connector}",     additionalRequestFilter?: [],     additionalResponseFilter?: [],     logoutMethod?: "{method_logout}",     tokenType?: "{token_type}",     loginRelativeUrl?: "{login_relative_url}",     logoutRelativeUrl?: "{logout_relative_url}",     logoutIDP?: true | false,     showTargetPageAfterTokenExchangeHandler?(url: string): void }; ``` |
```

1. ***timeout***: (Optional) The timeout of restoring authentication state
2. ***serverURL***: (Optional) Your server domain url (which contains uaa server authentication context also).
3. ***serverConnector***: (Optional) replace default connector
4. ***additionalRequestFilter***: (Optional) add more request filters to the connector
5. ***additionalResponseFilter***: (Optional) add more response filters to the connector
6. ***logoutMethod***: (Optional) The method logout
7. ***tokenType***: (Optional) Token Type.
   It can be UAABearer or regular Bearer
8. ***loginRelativeUrl***: (Optional) Login Relative url
9. ***logoutRelativeUrl***: (Optional) Logout Relative url
10. ***logoutIDP***: (Optional) Also logout IDP when the user logging out.
    Default value is true
11. ***showTargetPageAfterTokenExchangeHandler***: (Optional) Change the behaviour to show the page after saml token exchange process, default is browser redirect

Example determine the configuration of Oidc authentication:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 ``` | ``` // Create one oidc configure const oidcConfigure: UaaOidcConfiguration = {     serverURL: "{your_uaa_server_domain}/{uaa-context-path}",     tokenType?: [],     serverConnector?: "{your_server_connector}",     additionalRequestFilter?: [],     additionalResponseFilter?: [],     authority: "{your_idp_domain}/realms/{realm_name}",     client_id: "uaa-spa-client",     redirect_uri: `{your_client_domain}/callback`,     post_logout_redirect_uri: `{your_client_domain}/logout`,     silent_redirect_uri: `{your_client_domain}/silent_renew.html`,     automaticallyLogin: true,     popupAuthentication: false, }; ``` |
```

1. ***serverURL***: your server domain url ( include mgmtp.a12.uaa.authentication.context-path )
2. ***serverConnector***: (Optional) replace default connector
3. ***tokenType***: (Optional) token Type. It can be UAABearer or regular Bearer
4. ***additionalRequestFilter***: (Optional) add more request filters to the connector
5. ***additionalResponseFilter***: (Optional) add more response filters to the connector
6. ***authority***: configuration to your Realm URL.
7. ***client\_id***: configuration to your client
8. ***redirect\_uri***: your callback URL this has to be configured in your Authorization Server.
9. ***post\_logout\_redirect\_uri***: after logout Authorization server. here is redirect URI.
10. ***silent\_redirect\_uri***: please make sure you configure your application to serve silent\_renew page.
11. ***automaticallyLogin***: this would allow UAA to automatically login for you if your SSO session is available in Authorization Server.
12. ***popupAuthentication***: this would allow UAA to trigger login process within a popup with Authorization Server.

Example determine `UaaClientConfiguration`:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` const uaaClientConfiguration: UaaClientConfiguration = {     serverURL: `{your_server_url}`,     overrideClientConfigures: {         local?: localConfigure,         ldap?: ldapConfigure,         saml?: samlConfigure,         oidc?: oidcConfigure     },     .......................... } ``` |
```

1. ***serverURL***: (Optional) Your server domain url (which contains uaa server authentication context also).
2. ***overrideClientConfigures***: (Optional) override just a specific property in the application.

Example setting up `UaaReducer`, `UaaMiddlewares`:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 ``` | ``` // Setting up reducer by include UaaReducer and UaaMiddlewares const createRootReducer = (history: History<unknown>) => combineReducers({     router: connectRouter(history),     uaa: UaaReducer }); const reduxStore = createStore(     createRootReducer(history),     compose(         applyMiddleware(             routerMiddleware(history),             ...UaaMiddlewares(),         _)_     ) ); ``` |
```

Initialize your client by one of the following two ways:

* Example use API `UaaClient.init(UaaClientConfiguration)`

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` UaaClient.init(uaaClientConfigure); ``` |
```

* Example wrapper the main react component by `UaaProvider` component:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` <UaaProvider store={reduxStore} clientConfigure={uaaClientConfiguration}> 	<App /> </UaaProvider> ``` |
```

##### How to use after setup

###### LOCAL

1. Login:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 ``` | ``` UaaClient.getLocalClient().login(username: string, password: string) ``` |
   ```
2. Logout:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 ``` | ``` UaaClient.getLocalClient().logout() ``` |
   ```
3. Get access token:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 ``` | ``` const accessTokenFromStore = yield select(UaaSelectors.accessToken); ``` |
   ```
4. Request APIs with tokens:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 2 3 4 5 6 7 ``` | ``` const requestInit: RequestInit = {     method: "GET",     headers: {         Authorization: `${token}`     } }; yield call(fetch, `[your_api_url]`, requestInit); ``` |
   ```

###### LDAP

1. Login:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 ``` | ``` UaaClient.getLdapClient().login(username: string, password: string) ``` |
   ```
2. Logout:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 ``` | ``` UaaClient.getLdapClient().logout() ``` |
   ```
3. Get access token:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 ``` | ``` const accessTokenFromStore = yield select(UaaSelectors.accessToken); ``` |
   ```
4. Request APIs with tokens:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 2 3 4 5 6 7 ``` | ``` const requestInit: RequestInit = {     method: "GET",     headers: {         Authorization: `${token}`     } }; yield call(fetch, `[your_api_url]`, requestInit); ``` |
   ```

###### SAML

1. Login:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 ``` | ``` UaaClient.getSamlClient().login(url?: string); ``` |
   ```
2. Logout:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 ``` | ``` UaaClient.getSamlClient().logout() ``` |
   ```
3. Get access token:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 ``` | ``` const accessTokenFromStore = yield select(UaaSelectors.accessToken); ``` |
   ```
4. Request APIs with tokens:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 2 3 4 5 6 7 ``` | ``` const requestInit: RequestInit = {     method: "GET",     headers: {         Authorization: `${token}`     } }; yield call(fetch, `[your_api_url]`, requestInit); ``` |
   ```

###### OIDC

**processLoginCallback**:

YourSignInRedirect example:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` const successCallback = (_user: UaaOidcUser) => {     if (_user) {         window.location.href = window.location.origin;     } }); ``` |
```

YourSignInPopupRedirect example:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` UaaClient.getOidcClient().processLoginCallbackPopup(); ``` |
```

**processLogoutCallback**: You need to implement YourSignInRedirect in your project:

YourSignOutRedirect example:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` const successCallback = (_response: UaaSignoutResponse) => {     if (_response) {         window.location.href = window.location.origin;     } }); uaaOidcClient.processLogoutCallback().then(successCallback); ``` |
```

YourSignOutPopupRedirect example:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` UaaClient.getOidcClient().processLoginCallbackPopup() ``` |
```

1. Login:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 ``` | ``` UaaClient.getOidcClient().login(signinArgs?: SigninRedirectArgs | SigninPopupArgs) ``` |
   ```
2. Logout:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 ``` | ``` UaaClient.getOidcClient().logout() ``` |
   ```
3. Get access token:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 ``` | ``` const accessTokenFromStore = yield select(UaaSelectors.accessToken); ``` |
   ```
4. Request APIs with tokens:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 2 3 4 5 6 7 ``` | ``` const requestInit: RequestInit = {     method: "GET",     headers: {         Authorization: `${token}`     } }; yield call(fetch, `[your_api_url]`, requestInit); ``` |
   ```

#### Self configuration

The main idea when implementing the self-configuration is to simplify the way to integrate UAA.

##### Flow diagram

[![Basic flow diagram](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/javascript-client/selfConfigure.png "Basic flow diagram")](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/javascript-client/selfConfigure.png)

##### Initialization

With this new feature, the client is able to initiate all authenticate types through the **SelfConfigure** that get from:

* Local JSON file system
  Example

  ```
  |  |  |
  | --- | --- |
  | ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 ``` | ``` const offlineSelfConfigure: SelfConfigure = { 	"tokens": [ 		{ 			"authorizationHeaderName": "Authorization", 			"tokenType": "UAABEARER", 			"generatedTokenHeaderName": "access_token", 			"allowCredentials": true 		}, 		{ 			"authorizationHeaderName": "Authorization", 			"tokenType": "BEARER"         } 	], 	"local": { 		"loginRelativeUrl": "user/local/login", 		"logoutRelativeUrl": "user/logout", 		"logoutMethod": "POST", 		"tokenType": "UAABEARER" 	}, 	"activeDirectoryLdap": { 		"loginRelativeUrl": "user/active_directory_ldap/login", 		"logoutRelativeUrl": "user/logout", 		"logoutMethod": "POST", 		"tokenType": "UAABEARER" 	}, 	"saml": { 		"loginRelativeUrl": "saml2/authenticate/uaa?uaa_success=http://localhost:3000", 		"logoutRelativeUrl": "user/logout?uaa_success=http://localhost:3000", 		"logoutMethod": "POST", 		"tokenType": "UAABEARER" 	}, 	"oidc": { 		"tokenType": "BEARER", 		"clientId": "uaa-spa-client", 		"realmName": "UAARealm", 		"idpBaseUrl": "http://localhost:9090",         "enableRefreshTokenGrant": false, 		"loginRedirectRelativeUrl": "callback", 		"logoutRedirectRelativeUrl": "logout", 		"silentRedirectRelativeUrl": "silent_renew.html" 	} } const uaaClientConfigure: UaaClientConfiguration = { 	serverURL: `{your_server_url}`, 	offlineSelfConfigure: offlineSelfConfigure, 	automaticallyLogin: true, } ``` |
  ```

If you set `enableRefreshTokenGrant` property is `true`, you must follow [Using OIDC Refresh Token](#using-oidc-refresh-token)

* Fetching from serve (the UAA server that have an endpoint /selfConfigure to get self-configure)
  Example

  ```
  |  |  |
  | --- | --- |
  | ``` 1 2 3 4 5 6 7 ``` | ``` import { UaaClient, UaaClientConfiguration, SelfConfigure } from '@com.mgmtp.a12.uaa/uaa-authentication-client'; const uaaClientConfigure: UaaClientConfiguration = {     serverURL: `{your_server_url}`,     serverConfigureUrl: `{your_server_configure_url}`,     automaticallyLogin: true, } ``` |
  ```

#### Restore authentication automatically

Restore authentication state can be done in 2 ways:

* Manually by `restoreAuthenticationState` API from authenticate client with all authentication types;

Example manually:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` // Create one local client const uaaClientConfiguration: UaaClientConfiguration = {     serverURL: `{your_server_url}`,     serverConfigureUrl: `{your_server_configure_url}`,     automaticallyLogin: false }  UaaClient.init(uaaClientConfiguration); const uaaLocalClient = UaaClient.getLocalClient();  // calling restoreAuthenticationState to restore uaaLocalClient.restoreAuthenticationState(store.dispatch).then(     .......{your_component} )) ``` |
```

* Automatically using `UaaProvider` with `UaaClientConfiguration` and config props `automaticallyLogin` is true

Example automatically:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` // Setting a client configuration. const uaaClientConfigure: UaaClientConfiguration = {     serverURL: `{your_server_url}`,     serverConfigureUrl: `{your_server_configure_url}`,     automaticallyLogin: true, }  <UaaProvider store={reduxStore} clientConfigure={uaaClientConfigure}>     ......... </UaaProvider> ); ``` |
```

|  |  |
| --- | --- |
|  | Do not use both methods simultaneously, as it may result in errors. If you need to use both methods, please discuss it with member of the UAA |

|  |  |
| --- | --- |
|  | With the OAuth2 authentication type, using UaaProvider will result in automatic login. |

#### Automatically renew tokens

##### For not OIDC authentication

Token renewal is started by default.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` import { TokenManagement } from "@com.mgmtp.a12.uaa/uaa-authentication-client";  TokenManagement.getInstance().startService(); TokenManagement.getInstance().stopService(); ``` |
```

##### For OIDC authentication

###### Using hidden iframe

* Create your own html and reference to UAA silent\_renew.js file.
* `silent_renew.js` can be found from "node\_modules", "@com.mgmtp.a12", "uaa-authentication-client", "resources", "silent\_renew.js"
* Due to security reason, the `silent_renew.js` file need to be reference in your `silent_renew.html` entry file.

It’s completely dependent on project to set this up.
Here is example:

* Serve additional html file eg: silent\_renew.html with content:

Example:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ```     <!DOCTYPE html>     <html><head>         <script type="text/javascript" src="[your path to silent_renew.js]"></script>         </body>     </head>     <body>     <div></div>     </body>     </html> ``` |
```

* Configure your webpack to serve it as separate resource:

Example:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` new HtmlWebpackPlugin({     minify: true,     filename: "silent_renew.html",     template: [directory_to_your_silent_renew.html] }), entry: {     silent_renew: [your path to silent_renew.js] } ``` |
```

###### Using refresh token

When `enableRefreshTokenGrant` is set to true, the UAA library renews access tokens via the OAuth 2.0 refresh\_token grant.
This replaces the default silent-renew mechanism that uses a hidden iframe

**IDP Configuration Requirements**

* One-time revoke refresh token.
* Refresh Token Rotation
* Short time Refresh Token lifetime - for example, 5 minutes.

For Keycloak settings: [Keycloak Revoke Refresh Token](#keycloak-revoke-refresh-token)

|  |  |
| --- | --- |
|  | All security configurations from IDP must be applied otherwise the application will be exposed to potential security risks |

#### Localization

##### Login Page

The localization will be done by the external side.
The UAA will get one Localizer from @com.mgmtp.a12.utils/utils-localization as *localizer* props or by *useContext*

##### Example

1. Create locale resource

   ```
   |  |  |
   | --- | --- |
   | ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 ``` | ``` export const localeJsonResource: LocalizationTreeMap = {   de_DE: {     label: "Sprache",     auth: {       form: {         title: "Anmelden",         username: {           label: "Benutzername",           error: "Geben Sie bitte den Benutzernamen an"         },         password: {           label: "Passwort",           error: "Geben Sie bitte das Passwort an",           reset: {             label: "Passwort vergessen"           }         },         submit: {           label: "Anmelden"         }       },       error: {         authenticationfailed: "Authentifizierung ist fehlgeschlagen! Evtl. falsche Benutzer und/oder Passwort-Eingabe?",         logoutfailed: "Abmeldung fehlgeschlagen!"       }     }   },   en_US: {     label: "Language",     auth: {       form: {         title: "Login",         username: {           label: "Username",           error: "Username is required"         },         password: {           label: "Password",           error: "Password is required",           reset: {             label: "Password forgotten"           }         },         submit: {           label: "Login"         }       },       error: {         authenticationfailed: "Authentication failed! Maybe wrong username password combination?",         logoutfailed: "Logout failed"       }     }   } }; ``` |
   ```
2. Create localizer

   ```
   |  |  |
   | --- | --- |
   | ``` 1 2 3 4 5 6 ``` | ``` const localizer = defaultLocalizerFactory({     locale: Locale.fromString("de_DE"),     translationSource: defaultTranslationFinderFactory(         createTextResolverForTreeMap(localeJsonResource)     ) }); ``` |
   ```
3. Passing localizer as props or wrap localizer by LocalizerContext Provider

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` <LocalizerContext.Provider value={{ localizer ...otherProps }}>     <LoginPage ...props /> </LocalizerContext.Provider> ``` |
```

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` <LoginPage localizer={localizer} ... otherProps></LoginPage>; ``` |
```

#### How to customize UAA components

To override some default components provided by UAA

##### UserInfoHeader

* In order to customize this component, UAA team introduce property named **customUserInfoHeader** in **UserInfoHeader** component.
  You can customize the menu login (logout).
* By default, if this property is not defined, UserInfoHeader will be added automatically with a "Sign In as" and a logout button.
  In this case project should provide their own value for some properties need to render default UserInfoHeader:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` readonly logoutButtonLabel?: string; readonly loggedInAsLabel?: string; readonly mobileMode?: boolean; readonly additionalItems?: {     readonly orientation: "top" | "bottom";     readonly element: React.ReactNode; }[]; ``` |
```

|  |  |
| --- | --- |
|  | The "Sign In as" is the username of current logged-in user and is derived from:  * Oauth2: the response of the IDP (Keycloak) login api. * Other auth types: the response of the UAA login api when the first time logging in and the **/uaa-authentication/currentUser** api when the page is refresh.   The api **/uaa-authentication/currentUser** is also used to fetch the user roles and access rights information for Oauth2 type. |

|  |  |
| --- | --- |
|  | * By default, if you are using Oauth2, you will see the api **/userinfo** is called after the login success.   This api is made by `oidc-client-ts` lib and UAA do nothing with that so if you want to disablse that api, let set `false` on `UaaOidcConfiguration` inside` overrideClientConfigures` of `UaaClientConfiguration` (client-side).   Setting it as a backend property has no effect. |

* If project want to pass their own implementation for UserInfoHeader, please set your JSX.Element as value of property **customUserInfoHeader**.
  The default UAA implementation will be totally overwritten by this custom property value.
* Example:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` <UserInfoHeader     customUserInfoHeader={         <div>Hello</div>     } /> ``` |
```

#### Service Worker for token injection

UAA provide a Service Worker to inject token for each request you register. Have 2 facilities: `register` and `unregister`

* `Register`: register(urls: string[])
* `Unregister`: unregister()

##### Configure your webpack to serve uaa-service-worker.js file

There are serveral ways how to register UAA javascript file to your application.
Below is an example registering uaa-service-worker.js via webpack.
Feel free to adapt with your project.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 ``` | ``` const serviceWorker: webpack.Configuration = { 	mode: "development", 	devtool: "eval-source-map", 	entry: {             service_worker: Path.resolve(                 __dirname,                 "node_modules",                 "@com.mgmtp.a12.uaa",                 "uaa-authentication-client",                 "resources",                 "uaa-service-worker.js"             ) 	}, 	plugins: [             new HtmlWebpackPlugin({                 inject: "head",                 filename: 'index.html',                 template: "public/index.html"             }),  	] } ``` |
```

##### Importing:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` import {  UAAServiceWorker } from "@com.mgmtp.a12.uaa/uaa-authentication-client"; ``` |
```

##### Register:

Example: You want to inject token in request have url "http://localhost:8080/image"

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` const urls: string[] = ["http://localhost:8080/image"];  UAAServiceWorker.register(urls); ``` |
```

##### Unregister

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` UAAServiceWorker.unregister(); ``` |
```

### API

#### UaaClient

For integration with UAA, following API is used to init client for all authentication types

* **init**: This method used to initialize **UaaClient**.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` const uaaClientconfigure: UaaClientConfiguration = {     serverURL: `YOUR_SERVER_URL`,     offlineSelfConfigure?: selfConfigure;     overrideClientConfigures: {         local?: localConfigure,         ldap?: ldapConfigure,         saml?: samlConfigure,         oidc?: oidcConfigure     },     automaticallyLogin?: true,     store?: store }  UaaClient.init(uaaClientConfigure); ``` |
```

* **fetchSelfConfigure**: Manual fetching **SelfConfigure** from serverURL
* **getLocalClient**: Return an instance of UaaLocalClient.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` const uaaLocalClient = UaaClient.getLocalClient(); ``` |
```

* **getLdapClient**: Return an instance of UaaLdapClient.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` const uaaLdapClient = UaaClient.getLdapClient(); ``` |
```

* **getOidcClient**: Return an instance of UaaOidcClient.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` const uaaOidcClient = UaaClient.getOidcClient(); ``` |
```

* **getSamlClient**: Return an instance of UaaSamlClient.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` const uaaSamlClient = UaaClient.getSamlClient(); ``` |
```

* **getLocalConfiguration**: Return Local configuration

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` const localConfiguration = UaaClient.getLocalConfiguration(); ``` |
```

* **getLdapConfiguration**: Return Ldap configuration

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` const ldapConfiguration = UaaClient.getLdapConfiguration(); ``` |
```

* **getSamlConfiguration**: Return Saml configuration

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` const samlConfiguration = UaaClient.getSamlConfiguration(); ``` |
```

* **getOidcConfiguration**: Return Oidc configuration

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` const oidcConfiguration = UaaClient.getOidcConfiguration(); ``` |
```

#### UaaActions

| Properties | Payload | Action |
| --- | --- | --- |
| loggingInSAML |  | ***UAA/SAML/LOGGING\_IN*** |
| loggingInOIDC | ``` |  |  | | --- | --- | | ``` 1 ``` | ``` signinArgs?: SigninRedirectArgs | SigninPopupArgs ``` | ``` | ***UAA/OIDC/LOGGING\_IN*** |
| loggingInLDAP | ``` |  |  | | --- | --- | | ``` 1 2 3 4 5 ``` | ``` {  username: string;  password: string;  loginRelativeUrl?: string; } ``` | ``` | ***UAA/LDAP/LOGGING\_IN*** |
| loggingInLocal | ``` |  |  | | --- | --- | | ``` 1 2 3 4 5 ``` | ``` {  username: string;  password: string;  loginRelativeUrl?: string; } ``` | ``` | ***UAA/LOCAL/LOGGING\_IN*** |
| restoreProcessing | ``` |  |  | | --- | --- | | ``` 1 2 3 4 ``` | ``` {  authenticationType: AuthenticationType;  error?: Error; } ``` | ``` | ***UAA/RESTORE\_PROCESSING*** |
| restoreFailed | ``` |  |  | | --- | --- | | ``` 1 2 3 4 ``` | ``` {  authenticationType: AuthenticationType;  error?: Error; } ``` | ``` | ***UAA/RESTORE\_FAILED*** |
| restoreSuccess | ``` |  |  | | --- | --- | | ``` 1 2 3 4 ``` | ``` {  authenticationType: AuthenticationType;  error?: Error; } ``` | ``` | ***UAA/RESTORE\_SUCCESS*** |
| loggedIn | ``` |  |  | | --- | --- | | ``` 1 2 3 4 5 ``` | ``` {  user: UaaOidcUser | UaaUser | UaaExtendedUser | UaaOidcModifiedUser;  type: AuthenticationType;  access_token?: string; } ``` | ``` | ***UAA/LOGGED\_IN*** |
| loggingOut |  | ***UAA/LOGGING\_OUT*** |
| loggedOut |  | ***UAA/LOGGED\_OUT*** |
| loginFailed | ``` |  |  | | --- | --- | | ``` 1 2 3 4 5 ``` | ``` {  errorCode: string;  statusText?: string;  status?: number; } ``` | ``` | ***UAA/LOGIN\_FAILED*** |
| logoutRequested |  | ***UAA/LOGOUT\_REQUESTED*** |
| logoutIdp |  | ***UAA/LOGOUT\_IDP*** |
| logoutFailed | ``` |  |  | | --- | --- | | ``` 1 2 3 4 5 ``` | ``` {  errorCode: string;  statusText?: string;  status?: number; } ``` | ``` | ***UAA/LOGOUT\_FAILED***˝ |
| silentRenewError |  | ***redux-oidc/SILENT\_RENEW\_ERROR*** |
| oidc\_userFound |  | ***redux-oidc/USER\_FOUND*** |
| updateAccessToken | ``` |  |  | | --- | --- | | ``` 1 2 3 4 ``` | ``` {  access_token: string;  authenticationType?: AuthenticationType; } ``` | ``` | ***UAA/UPDATE\_ACCESS\_TOKEN*** |
| updateUserInfo | ``` |  |  | | --- | --- | | ``` 1 2 3 ``` | ``` {  user: UaaOidcUser | UaaUser | UaaExtendedUser | UaaOidcModifiedUser; } ``` | ``` | ***UAA/UPDATE\_USER\_INFO*** |
| unauthorized | ``` |  |  | | --- | --- | | ``` 1 2 3 ``` | ``` {  url: string; } ``` | ``` | ***UAA/UNAUTHORIZED*** |
| modifyingOidcUser | ``` |  |  | | --- | --- | | ``` 1 ``` | ``` UaaOidcUser ``` | ``` | ***UAA/MODIFYING\_OIDC\_USER*** |
| modifiedOidcUser | ``` |  |  | | --- | --- | | ``` 1 ``` | ``` UaaOidcModifiedUser ``` | ``` | ***UAA/MODIFIED\_OIDC\_USER*** |
| modifyOidcUserFailed | ``` |  |  | | --- | --- | | ``` 1 2 3 4 ``` | ``` {  statusText?: string;  status?: number; } ``` | ``` | ***UAA/MODIFY\_OIDC\_USER\_FAILED*** |

* **Login Redux Actions**

|  |  |
| --- | --- |
| Type: LOCAL, SAML, ACTIVE\_DIRECTORY\_LDAP Login flowchart | Type: OAUTH2 Login flowchart |

* **Restore Redux Actions**

|  |  |
| --- | --- |
| Type: LOCAL, SAML, ACTIVE\_DIRECTORY\_LDAP Restore flowchart | Type: OAUTH2 Restore flowchart |

* **Silent Renew Redux Actions**

|  |  |
| --- | --- |
| Type: LOCAL, SAML, ACTIVE\_DIRECTORY\_LDAP Silent renew flowchart | Type: OAUTH2 Silent renew flowchart |

* **Logout Redux Actions**

|  |  |
| --- | --- |
| Type: LOCAL, SAML, ACTIVE\_DIRECTORY\_LDAP Logout flowchart | Type: OAUTH2 Logout flowchart |

#### UaaSelectors

The UaaSelectors can be used by 2 ways:

* With UseSelector from Redux

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` const authenticatedState = useSelector(UaaSelectors.state); ``` |
```

* Get state from Slide

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` const state = useSelector(slide => {   return UaaSelectors.state(slide); }); ``` |
```

List API:

* ***state***: current authenticate state.
* ***user***: user logged in (UaaUser | UaaOidcUser).
* ***username***: username logged in.
* ***error***: the error message.
* ***authenticationType***: the type of authenticating which be used.
* ***accessToken***: accessToken.
* ***roles***: List the roles of the currently logged-in user.
  If you want to obtain access rights based on a role, use this API to retrieve the roles.
  Then, use the retrieved roles to determine the appropriate access rights.
* ***accessRights***: List all access rights of the currently logged-in user, and this list is merged.

UAA also provides selectors with a default value, which can be further configured using `withConfig`.

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` const authenticationSTate = useSelector(UaaSelectors.state.withConfig({     defaultValue: AuthenticationState.NOT_AUTHENTICATED   })) ``` |
```

#### UaaFilter

UAA provides some default request/response filters to use with ServerConnector.

* Request filters:

  + ***AuthorizationHeaderFilter***: Get token from sessionStorage or redux store and push it to request Headers
  + ***CredentialsFilter***: This will help uaa server to response with cookie enable to be carried on cross-origin requests (Needed for SAML IDP logout request)
* Response filters:

  + ***ResponseFilter401***: return new NotAuthorizedError() if the status is 401.
  + ***TokenResponseFilter***: If the response header has access\_token then it will be saved to sessionStorage and dispatch an action to update token to redux store.

##### Example:

This is example for user can configure filters like default filters UAA with ServerConnector login with type Local

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 ``` | ``` import {   AuthenticationType,   TokenManagement,   UaaLocalConfiguration,   UaaSelectors,   UaaFilters, } from "@com.mgmtp.a12.uaa/uaa-authentication-client";  const tokenConfigure = TokenManagement.getInstance().getTokenConfiguration(AuthenticationType.LOCAL);  // AuthorizationHeaderFilter is required const requestFilter = [   new UaaFilters.AuthorizationHeaderFilter(     () => store.getState() as { uaa: UaaSelectors.UaaSlice },     tokenConfigure   ), ]; const responseFilters = [   new UaaFilters.TokenResponseFilter(tokenConfigure),   new UaaFilters.ResponseFilter401(), ]; const newServerConnector = new RestServerConnector(   `${process.env.SERVER_URL || window.uaaConfiguration.serverURL}`,   requestFilter,   responseFilters ); ``` |
```

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` const localConfiguration: UaaLocalConfiguration = {   .....   serverConnector: newServerConnector   ..... }; ``` |
```

#### UaaProvider

UaaProvider is a React component.
The application needs to wrap the main component by 2 steps:

*1. Create redux store*

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 ``` | ``` const createRootReducer = (history: History) =>   combineReducers({     router: connectRouter(history),     appReducer,     uaa: UaaReducer,   });  const store = createStore(   createRootReducer(history),   compose(     applyMiddleware(       routerMiddleware(history),       ...UaaMiddlewares([logoutIDP()]),       clientMiddleware()     )   ) ); ``` |
```

*2. Wrap the main component by UaaProvider*

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` <UaaProvider store={store}>     <ConnectedRouter history={history}>         <Switch>             <Route exact path="/" component={App} />         </Switch>     </ConnectedRouter> </UaaProvider> ``` |
```

#### UaaReducer

It’s a redux reducers of all authentication types.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` const createRootReducer = (history: History<unknown>) => combineReducers({   // Key must is uaa   uaa: UaaReducer }) ``` |
```

#### UaaMiddlewares

It’s a redux middlewares of all authenticate types.

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` export function UaaMiddlewares(   overrideSagas?: UaaSagaDescriptor[] ): Middleware[] ``` |
```

**overrideSagas**: Array of UaaSagaDescriptor.
It’s used to override the default middleware.
When one action is processed in one saga middleware then the other next middleware is skipped.

Example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 ``` | ``` function logoutIDP(): UaaSagaDescriptor {   return {     canHandle(action: AnyAction) {       return UaaActions.logoutRequested.match(action);     },     *handle() {       yield putResolve(UaaActions.loggingOut());     }   }; }  const store = createStore(   createRootReducer(history),   compose(      applyMiddleware(        ...UaaMiddlewares[logoutIDP()]      ),   ), ) ``` |
```

#### UaaSecureStorage

UAA use sessionStorage to store information so if you want transfer information between tabs you can use this API: `UaaSecureStorage.getInstance().initShareSecuredData(keys: string[], isSharingAllowed?: () ⇒ boolean);` This API includes event registration and start sharing actions.

* **keys**: The key to the information stored in sessionStorage.
* **isSharingAllowed**: The condition for starting sharing.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` UaaSecureStorage.getInstance().initShareSecuredData([ 	"access_token", 	"token_renew_in_seconds", 	"authenticationType" ], () => !sessionStorage.getItem("access_token")); ``` |
```

While sharing tokens between other tabs, UAA dispatches an action `UaaActions.sessionStorageSharingData()` and, upon completion, UAA dispatches an action `UaaActions.sessionStorageSharedData()`

|  |  |
| --- | --- |
|  | The process can only finish once the DOM is rendered. |

#### AUTH\_KEYS

It’s an interface that supports custom default language.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` import { AUTH_KEYS } from "@com.mgmtp.a12.uaa/uaa-authentication-client"  const de: typeof AUTH_KEYS = { /* German translations */ }; const en: typeof AUTH_KEYS = { /* English translations */ }; const vi: typeof AUTH_KEYS = { /* Vietnam translations */ };  export const YOUR_CUSTOM_TRANSLATIONS: LocalizationTreeMap = { de, en, vi }; ``` |
```

## JavaScript A12 Client

### Introduction

The **A12 UAA Authentication Client** (`uaa-authentication-a12-client`) is a small integration module that reuses all capabilities of the base **UAA-Authentication-Client** and wires them into the A12 **client-core** runtime.

Instead of using the lower-level `uaa-authentication-client` API directly, A12 applications consume UAA features through the A12 application setup mechanism. This module provides the `withUaa` feature, which can be passed to `createA12ApplicationSetup(combineFeatures(…​))`.

By adding `withUaa` to the feature list, an application automatically gets the default UAA integration for A12:

* Registers the UAA-specific reducers in the A12 Redux store.
* Adds the UAA middleware and sagas to the A12 runtime.
* Connects the UAA configuration (endpoints, authentication types, client IDs, etc.) from the A12 application config.
* Exposes the full UAA-Authentication-Client behavior (authentication flow, token handling, localization, etc.) through the A12 application shell.

In short, `uaa-authentication-a12-client` acts as a dependency bridge between **client-core** and **uaa-authentication-client** and offers a single, A12-style entry point `withUaa` that makes it easy to plug UAA authentication into an A12 React application using:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` const { store, Component, initialActions } = createA12ApplicationSetup(   combineFeatures(     .........     withUaa,     ........   ), ); ``` |
```

## Keycloak

**Keycloak** is an Open Source Identity and Access Management solution for modern Applications and Services.

Add authentication to applications and secure services with minimum fuss.
No need to deal with storing users or authenticating users.
It is all available out of the box.

You will even get advanced features such as User Federation, Identity Brokering and Social Login.

### Getting Started

Keycloak getting started documentation can be found in <https://www.keycloak.org/guides#getting-started>.

If you are running the Keycloak with docker.
The Keycloak will use the **standalone-ha.xml** file instead of **standalone.xml** file that why all the modifications from **standalone.xml** will not apply.

### Configuration

* Basic configuration:

  + Client ID: The alphanumeric ID string that is used in OIDC requests and in the Keycloak database to identify the client.
  + Valid redirect URIs: Required field.
    Valid URI pattern a browser can redirect to after a successful login.
    You can use wildcards at the end of the URL pattern.
    For example [http://host.com/\*](http://host.com/*)
  + Valid post logout redirect URIs: Valid URI pattern a browser can redirect to after a successful logout.

You can find more information basic configure in <https://www.keycloak.org/docs/latest/server_admin/#con-basic-settings_server_administration_guide>

* Advanced configuration:

  + Assertion Consumer Service POST Binding URL: POST Binding URL for the Assertion Consumer Service.
  + Logout Service POST Binding URL: POST Binding URL for the Logout Service.

You can find more information advanced configure in <https://www.keycloak.org/docs/latest/server_admin/#con-advanced-settings_server_administration_guide>

### Keycloak Setup

The easiest way to set it up is to use docker.
After the image starts, you need to set up the UAARealm.
The first step is to create a keycloak admin user.
The easiest way is to pass it in the variables.
Example for username is `admin` and password is `admin`:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` docker run -p 9090:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev ``` |
```

|  |  |
| --- | --- |
|  | When executing the command above, if it’s required login by quay.io, probably you need to register a new user in order to download it in case you don’t have one. Then you need to login via command `docker login quay.io` and then enter your `username` and `password`. |

|  |  |
| --- | --- |
|  | UAA does not provide any Keycloak images, all these standard images are published by other parties. |

Then you can use `admin/admin` to login to the keycloak instance `http://localhost:9090`

After login, you need to create a new realm:

* Manual:

  + In the top left section on the Keycloak page click on *master* realm and create a new one named `UAARealm`.
  + The next step is to create a new Client.
  + For each login method, there will be different clients.
* Import:

  + Download json file [UAARealm.json](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/UAARealm.json) which is the standard secured realm configuration provided by UAA.**\* In the top left section on the Keycloak page click on *master* realm and click the button \*Create realm**.
  + In the top left section on the Keycloak page click on *master* realm and click the button **Create realm**.
  + With **Resource file**, browse the `UAARealm.json` file (step 1) on your device then click the button **Create**.

#### Create Client For User Authentication With SAML

For Saml login, the easiest way is to create the client from configuration file.
The configuration file is generated by the UAA server. Let sure you configured your server ([SAML Authentication Type](#authentication-getting-started-configuration-saml)) and run it.

* Go to URL `http://localhost:8080/saml2/service-provider-metadata/uaa`,
  where uaa is configured registrationId.
* Save the configuration and click "Import client" then upload it.

Another way, you can create by manually.

* Click on **Clients** in the left menu and then create.
* Next select `SAML` in the `Client type` drop down box.
  .3 Create new client with `Client ID` is `urn:com:mgm:UAA` (example for you) and click `Save`.

After it is created change the settings based on the screenshot (this is example for you):

![SAML client configuration settings](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/saml_config_settings.png "SAML client configuration setting")

Valid Redirect URL = <http://localhost:8080/login/saml2/sso/uaa> where uaa is registration ID.

Then change the settings in the advanced tab on the screenshot (this is example for you):

![SAML client configuration advanced](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/saml_config_advanced.png "SAML client configuration advanced")

The final step is to create a mapper.
The mapper encodes property into SAML assertion.
We need to have at least `user name` in the token.
In "Client scopes" tab, click "urn:com:mgm:UAA-dedicated" to create mapper, then click "Configure a new mapper".
In here, choose "User Property".
See the following screenshots on how to create such a mappers.
Those properties are then encoded in the access token.

![SAML client configuration - User Mapper](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/saml_create_mapper.png "SAML client configuration - User Mapper")

After that you can create users.

* On the left side you will find the **Manage** section and click on **Users**.
* Create a user with username **admin** and click save.
* After that you need to go to **credentials** tab and click "Set password".
* Then type your password and remove the switch with Temporary.

After that, you are able to log in.

#### Create Client For User Authentication With Oauth2

##### Create Public Client (OAuth2 Resource Server)

* Click on **Clients** in the left menu and then create.
* Next select `Openid Connect` in the `Client type` drop down box.
* Create new client with `Client ID` is `uaa-spa-client` (example for you) and click `Next`.
* Unchecked `Direct access grants` and Save.

Then change the settings based on the screenshot:

![Login Oauth2 public client configuration settings](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/oauth2_rs_public_config_setting.png "Oauth2 client configuration setting")

##### Create Confidential Client (OAuth2 Resource Server)

* Click on **Clients** in the left menu and then create.
* Next select `Openid Connect` in the `Client type` drop down box.
* Create new client with `Client ID` is `uaa-auth-client` and click `Next`.
* Turn on `Client authentication`, checked `Direct access grants` and `Service accounts roles`.

Then change the settings based on the screenshot:

![Login Oauth2 confidential client configuration settings](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/oauth2_rs_confidential_config_setting.png "Oauth2 client configuration setting")

##### Create Confidential Client (Oauth2 Client)

* Click on **Clients** in the left menu and then create.
* Next select `Openid Connect` in the `Client type` drop down box.
* Create new client with `CLient ID` is `uaa-ssr-client` (example for you) and click `Next`.
* Turn on `Client authentication` and checked `Direct access grants`.
  Then change the settings based on the screenshot:

![Oauth2 client configuration settings](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/oauth2_ssr_config_setting.png "Oauth2 client configuration setting")

After you save change the settings, you will see 2 tab appear near Settings: Key and Credentials.
Based on that you can get `Client secret` to config your application.

### Open Security issues

You should take care about this session because attacker can attack your website.

#### Host header Injection

##### What is the Host Header injection?

Host header injection is a web attack where the attacker provides a false Host header to the web application.
In an incoming HTTP request, web servers often dispatch the request to the target virtual host based on the value supplied in the Host header.
Without proper validation of the header value, the attacker can supply invalid input to cause the web server to:

* Cause a redirect to an attacker-controlled domain.
* Perform web cache poisoning.
* Manipulate password reset functionality.

##### How dangerous are Host Header Injection?

Host header injection can be used for these attack above. An attacker can abuse it to redirect an attacker-controller domain. Web cache poisoning lets an attacker serve poisoned content to anyone who requests pages.
Using password reset poisoning, the attacker can obtain a password reset token and reset another user’s password leak to take over the user account.

##### How to avoid Host Header Injection?

* Refer to the below link for proper keycloak hostname setup:

  + [Configuring the hostname](https://www.keycloak.org/server/hostname).

#### SMTP Server

Please aware of SMTP server data exported via Keycloak return plain text if you don’t configure anything.

Please follow document: <https://www.keycloak.org/docs/latest/server_admin/index.html#_vault-administration>.

For other security problems, you can see more here: [Mitigating security threats](https://www.keycloak.org/docs/latest/server_admin/index.html#mitigating-security-threats).

#### Enable Revoke Refresh Token

Choose the realm in Keycloak → Realm settings → Tokens → Enable Revoke Refresh Token → Set `Refresh Token Max Reuse` = 0

![Enable Revoke Refresh Token](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/images/revoke_refresh_token.png "Enable Revoke Refresh Token")

### Keycloak Upgrade

#### Version 20.0.1

* From version 20.0.0. They fixed this issue ([link](https://github.com/keycloak/keycloak/issues/14184/)).
* This makes the application that uses the OAuth2 Client mode has a problem when doing the login flow with keycloak.
* To fix this problem, either added the default scope with name **openid** into the client by Keycloak setting ([link](https://www.keycloak.org/docs/latest/authorization_services/index.html#_resource_server_create_client/)) or by spring configuration [(link)](#oauth2-ssr-required-property)

## GDPR

The GDPR section documents information which might be related to GDPR.

### Logging

After login we log a message which contains authenticated user name.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` User [<name>] has been authenticated ``` |
```

## Breaking and Non-breaking Interpretation

### Definition of Version

The UAA product defines a single version. All artifacts (Java and Javascript) that belong to the UAA product share the same version.

The following definition of breaking changes only applies to specified functionality of libraries that we provide.

Furthermore, any change is only guaranteed to be non-breaking if all artifacts of a product are used in exactly the same version.

### Definition of Documented Functionality

* All functions which are NOT mentioned in Documentation are considered internal.
* All EXPERIMENTAL functions will not followed breaking changes management.
* Modules (Javascript) in the "experimental" folder are also not considered regarding breaking changes.
* All blocker tickets regarding Security Fixes with evaluation from SP are not follow breaking changes.

| Breaking | Non breaking |
| --- | --- |
| Public API | |
| * Incompatible change of API signatures - cause compile errors. * Change in functionality. * Change Rest Endpoints. | * Compatible change of API signatures * Change of experimental functionality * Change of unspecified method signatures * Change of experimental method signatures * Change of internal method signatures * Addition of optional new functionality * Correction of functionality that does not fulfil the specification - fixing bugs * Change of unspecified functionality |
| Internal | |
|  | * Everything apart from Public API points are consider internal * All Internal is consider non-breaking * Any changes in this section is always consider non-breaking |
| Configuration | |
| * Changing default value of all configurations and changing default behaviour. * Removing configuration * Rename configuration. | * Java:  + All new configurations will be turn off by default.   + Changing default value of all configurations and WITHOUT changing default behaviour. * Javascript:  + All new configurations will be turn off by default. |
| Dependencies | |
| * Javascript:  + Change of TypeScript version   + Change of React version (currently fixed version, but might be a range soon)   + Change of any peer dependency (range) * Java:  + Change of Spring major releases (include all Spring related libraries)   + Change of any third party major libraries. | * Update of internal dependencies with minor, patches versions. * Update of internal dependencies with major to make UAA works with latest Keycloak version. |

## Runtime Configuration

In a project using UAA there are multiple ways to run the application and pass the configuration to UAA.
Main configuration place should be the `application.properies` or `application.yml` file.
This method overrides the default configuration provided by individual modules.
For more detailed information see [Spring documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-external-config).
The default configuration is stored in `uaa-authentication.properties` and `uaa-authorization.properties`.
It’s possible to create those files in a project, but in this case it overrides the default configuration provided by the modules.

### Gradle

An application can be run by gradle spring boot plugin.
It’s possible to pass the parameter from command line.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` ./gradlew bootRun --args='--spring.profiles.active=$PROFILES' ``` |
```

### Eclipse plugin

An application can be run inside the Eclipse IDE via STS plugin.
In this case just add configuration options to `VM arguments`

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` -Dmgmtp.a12.uaa.authentication.jwt.secret=[your_secret_key] ``` |
```

## API Documentation

The API Documentation can be found here:

* [JavaDoc](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/javadoc/index.html)
* [TypeDoc](https://geta12.com/docs/2025.06/ext5/uaa/uaa-documentation-src/assets/typedoc/index.html)

## UAA Training

To enhance your understanding and usage of this library,
we recommend referring to our [Training Guide](https://geta12.com/docs/UAA/uaa-training-documentation-src/index.html).

This documentation contains a follow along tutorial to enable Authentication and Authorization by using UAA libraries.

## Infrastructure Dependencies

UAA supports multiple authentication types.

* For LOCAL and LDAP authentication, UAA does not require additional identity providers.
* For OIDC or SAML authentication, UAA relies on an external Identity Provider (such as Keycloak or another compliant IDP).

In the table below, the infrastructure dependencies required by UAA are listed with their purpose, supported versions, resource recommendations, and configuration links.

| Dependency | Purpose | Supported Versions | Configuration Reference | Minimum Resource Recommendation | Notes |
| --- | --- | --- | --- | --- | --- |
| Keycloak / Other IDP (only for OIDC/SAML) | Provides identity federation and single sign-on for OIDC or SAML login flows. | Keycloak 24.x, 25.x, 26.x. Other OIDC/SAML-compliant IDPs | Please use the links for connection: [SAML configuration](#saml) - [OIDC configuration](#oauth2), and use the following link for [Keycloak Setup](#keycloak-setup). | None | Only required if customer projects configure OIDC or SAML authentication. |

## Migration Instructions

|  |  |
| --- | --- |
|  | Please have a look at [Migration to latest A12](https://geta12.com/docs/overall/migration_guide/index.html) chapter for an explanation of general steps on how to upgrade before starting with the component migration. |

### 2025.06

#### uaa-authentication-client

##### Migration to ESM

The npm artifact `@com.mgmtp.a12.uaa/uaa-authentication-client` was migrated
from CommonJS to [ESM](https://nodejs.org/api/esm.html#modules-ecmascript-modules).
When using Node `22.12+` and modern build tools, there should be no changes necessary to your bundler setup.

Migrating your own application to ESM is not required, but recommended. Consult the documentation of your bundler for specifics.

##### React 19 upgrade

We dropped the support for React 18 and older and now require React 19 as our peerDependency.
This means you have to perform the React 19 migration, which is described in great detail in the official
[React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide). They have codemods that should make the transition straightforward.

Additionally, we have decided to not also include a Redux update, to minimize the migration effort.
The "react-redux" library does not have React 19 as a peerDependency, but still works fine with it.
One solution is to override the dependency in your package.json. You also have to update the corresponding "@types/react-redux" typings to at least 7.1.34.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` { 	"overrides": { 		"react-redux": { 			"react": "^19" 		} 	}, 	"devDependencies": { 		"@types/react-redux": "^7.1.34" 	} } ``` |
```

#### uaa-authentication

* **PrincipalCreator** api is now only responsible for creating principal, neither token verification nor token unpacking need to be involved.

  + The input of the api **createPrincipal()** in **PrincipalCreator** is changed to **JwtTokenData** which is extracted and verified priorly by UAA.
* **LocalUserManager** has a new api **reloadUsers()** which is responsible for reloading the persisted Local users at runtime.

  + Input is the String representing the list of users in format of JSON or Yaml
  + The default implementation does nothing but returns an empty collection.
* UAA provides the default implementation of **LocalUserManager** that includes **LocalUserLoader** for producing the Local user in desired type.
  Therefore, comes along with **reloadUsers()** of **LocalUserManager**, **LocalUserLoader** also has a new api **loadUsers()**:

  + Responsible for producing the list of Local users in the desired type.
  + The default implementation does nothing but returns an empty collection.
* New rest api for uploading Local users at run time

  + The endpoint `<UAA context>/local-user/upload` is bound to the scope `Upload Local User Rule` so it is required to specify the new authorization rule for this scope.
* Move **RoleMappingProcessor** to a12internal package so that it can be used by order A12 modules (covered by automatic migration).
* Move **UAALocalUserLoader** to internal package (covered by automatic migration).
* The `Certificate` authentication type has been changed to `API_KEY`.

  + The header at request has been changed from `Cert` to `APIKey`
  + The name of authentication type has been changed from `CERTIFICATE` to `API_KEY`
  + Old properties

    ```
    |  |  |
    | --- | --- |
    | ``` 1 2 3 4 5 6 7 8 ``` | ``` // For uaa-authentication mgmtp.a12.uaa.authentication.certificate-authority-resources mgmtp.a12.uaa.authentication.certificate-white-list-access-url-patterns mgmtp.a12.uaa.authentication.principal.certificate.user-name-field mgmtp.a12.uaa.authentication.principal.certificate.user-role-field  // For uaa-rest-client mgmtp.a12.uaa.authentication.client.rest.certificate-resource ``` |
    ```
  + New properties (covered by automatic migration)

    ```
    |  |  |
    | --- | --- |
    | ``` 1 2 3 4 5 6 7 8 ``` | ``` // For uaa-authentication mgmtp.a12.uaa.authentication.api-key-authority-resources mgmtp.a12.uaa.authentication.api-key-white-list-access-url-patterns mgmtp.a12.uaa.authentication.principal.api-key-config.user-name-field mgmtp.a12.uaa.authentication.principal.api-key-config.user-role-field  // For uaa-rest-client mgmtp.a12.uaa.authentication.client.rest.api-key-resource ``` |
    ```

#### Deprecation

##### uaa-authentication

* `geteMail()` function of `ExternalPrincipalImpl` is deprecated, use `getEmail()` instead.
* `seteMail()` function of `ExternalPrincipalImpl` is deprecated, use `setEmail()` instead.
* `withEMail()` function of `ExternalPrincipalImpl.Builder` is deprecated, use `withEmail()` instead.
* The property `template-refs` of `repositoryPolicies` in authorization definition file is deprecated and will be removed completedly in the next major version.
  In the consequence, the attribute `templateRefs` and its getter and setter are also deprecated.

We implemented the new timer calculation for the silent renewal process based on the TOKEN\_RENEW\_IN\_SECONDS value (the amount of time before the process starts).
As the result, some keys/codes are no longer used and will be removed in the next major release:

* The header `access_token_expiration` in the default value of `mgmtp.a12.uaa.authentication.cors.exposed-headers` will be removed and replaced by `token_renew_in_seconds`.
* The header `access_token_expiration` will be removed out of the response of apis:

  + Login api of LOCAL and LDAP, replaced by `token_renew_in_seconds`.
  + `/uaa-authentication/exchangeAuthorizationCodeToToken`, replaced by `token_renew_in_seconds`.
  + `/uaa-authentication/token`, replaced by `token_renew_in_seconds`.
* The attribute `generatedTokenExpirationHeaderName` and its getter and setter of class `TokenConfiguration` are unusable.
  As the result, the client self-configuration no longer contains that attribute.
* The function `withGeneratedTokenExpirationHeaderName()` of class `TokenConfiguration.Builder` is unusable.
* The attribute `loginTime` and its getter of class `JwtTokenData` are replaced by `issuedTime` and its corresponding getter and setter.
* The function `withLoginTime` of class `JwtTokenData.Builder` is replaced by `withIssuedTime()`.
* The attribute `expirationTime` and its setter of class `JwtTokenData` are unusable,
  the getter `getExpirationTime()` is now computed by attributes `issuedTime` and `expirationSeconds`.
* The function `withExpirationTime` of class `JwtTokenData.Builder` is unusable.

##### uaa-authentication-client

* `SessionStorageKeys.ACCESS_TOKEN_EXPIRATION` is not used anymore, use `SessionStorageKeys.TOKEN_RENEW_TIMESTAMP` instead to get the start time of renewal process.
* `SessionStorageKeys.TOKEN_RENEW_IN_SECONDS` is not used anymore, use `SessionStorageKeys.TOKEN_RENEW_TIMESTAMP` instead to get the start time of renewal process.

##### uaa-rest-client

* The attribute `authenticationTokenExpiration` and its getter of class `AuthorizationData` are replaced by `tokenRenewInSeconds` and its corresponding getter.
* All `` AuthorizationData’s constructors having the parameter `authenticationTokenExpiration `` are replaced by ones containing parameter `tokenRenewInSeconds`.
* `mgmtp.a12.uaa.authentication.client.rest.generated-token-expiration-header-name` is unusable and will be removed.
* The attribute `generatedTokenExpirationHeaderName` and its getter and setter of class `UAARestClientProperties` are unusable.
* The attribute `generatedTokenExpirationHeaderName` and its getter and setter of class `TokenConfiguration` are unusable.

### 2025.06-ext2

#### Deprecation

##### uaa-rest-client

* All public constructors of `UAARestClientFactory` are deprecated, please Use `UAARestClientFactoryBuilder` to create instances instead.

### 2025.06-ext4

#### Deprecation

##### uaa-authentication-client

* Deep path imports from `@com.mgmtp.a12.uaa/uaa-authentication-client` are deprecated and will be removed in a future release.

  All exports are now available from the top-level package entry point.

  Before

  ```
  |  |  |
  | --- | --- |
  | ``` 1 2 3 4 5 ``` | ``` import { 	UaaClient, 	UaaOidcUser, 	UaaSignoutResponse, } from "@com.mgmtp.a12.uaa/uaa-authentication-client/lib/index.js"; ``` |
  ```

  After

  ```
  |  |  |
  | --- | --- |
  | ``` 1 2 3 4 5 ``` | ``` import { 	UaaClient, 	UaaOidcUser, 	UaaSignoutResponse, } from "@com.mgmtp.a12.uaa/uaa-authentication-client"; ``` |
  ```

  |  |  |
  | --- | --- |
  |  | Use `uaa-authentication-client-codemod` with recipe `top-level-imports` to migrate automatically. |

  ```
  |  |  |
  | --- | --- |
  | ``` 1 ``` | ``` npx @com.mgmtp.a12.uaa/uaa-authentication-client-codemod top-level-imports <path-to-tsconfig> ``` |
  ```
