---
source: https://geta12.com/docs/2025.06/ext5/utils_server_connector/server-connector-documentation-src/index.html
category: utils_server_connector
docid: server-connector-documentation-src
scraped: 2026-06-12
---

# Server Connector

Server connector is a generic component for request/response server communication.

## Server Connector API

API for server connector which contains Interfaces for main connector components.

* ServerConnector
* ServerRequest
* ServerResponse

## JAVA REST Server connector

REST Server Connector is a connector implementation which uses HTTP REST as communication protocol.
The implementation uses Spring’s `RestTemplte` and it’s interceptor mechanism.

See class diagram for key components:

The REST Server Connector provides implementation for most commons HTTP methods:

* `RestGetConnector`
* `RestPostConnector`
* `RestPutConnector`
* `RestDeleteConnector`
* `RestOptionsConnector`
* `RestHeadConnector`

Internally it’s implemented with single `GenericRestConnector` which is not made public and above classes are type wrappers.

|  |  |
| --- | --- |
|  | If there is need to create implementations for connector(s) it has to be implemented by an implementor. |

The REST Server Connector behaviour can be extended from outside.
All components are illustrated in the following Class Diagram.

[![resttemplate class diagram](https://geta12.com/docs/2025.06/ext5/utils_server_connector/server-connector-documentation-src/assets/images/resttemplate_class_diagram.png)](https://geta12.com/docs/2025.06/ext5/utils_server_connector/server-connector-documentation-src/assets/images/resttemplate_class_diagram.png)

Figure 1. RestTemplate Class Diagram

REST Server Connector internal architecture and flow are illustrated in the following diagram:

[![restclient architecture](https://geta12.com/docs/2025.06/ext5/utils_server_connector/server-connector-documentation-src/assets/images/restclient_architecture.png)](https://geta12.com/docs/2025.06/ext5/utils_server_connector/server-connector-documentation-src/assets/images/restclient_architecture.png)

Figure 2. Rest Server Connector Architecture

### Extensions

REST Server Connector can be extended in many aspects from outside.
All extensions can be supplied to the implementation during initialization time.

#### Interceptors

Before an HTTP/HTTPS request is performed the interceptors are called.
This allows request customization.
Most common use-case is header modification.
See in following example.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` public class AcceptHeaderInterceptor implements ClientHttpRequestInterceptor {  	@Override 	public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException { 		HttpHeaders headers = request.getHeaders(); 		List<MediaType> accept = headers.getAccept(); 		if (accept.isEmpty()) { 			headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));  		} 		return execution.execute(request, body); 	}  } ``` |
```

#### ErrorHandler

Error handler is and implementation of the `ResponseErrorHandler`.
It can customize behaviour how the connector detects an error and what data are extracted from the server response.
REST Server Connector itself doesn’t extend standard spring behaviour and uses spring `DefaultResponseErrorHandler` implementation.

#### MessageConverter

Message converter is used to convert HTTP request/response to an Object and vice versa.
Implementation is picked based on content type.
REST Server Connector uses default message converters supplied by Spring implementation.

### Initialization

In order to use the REST Server Connector it needs to be initialized.
There is `RestServerConnectorFactoryBuilder` which builds `RestServerConnectorFactory` with all necessary extensions.
After the `RestServerConnectorFactory` is created it contains factory method for all available connectors.
After a connector is obtained from the factory it’s initialized and ready to use.
The connector is intended to live for all application lifetime and there is no need to call factory multiple times.

### SpringBoot

REST Server Connector provide SpringBoot module which introduce property based configuration.
After initialization it provides initialized connectors as spring beans to the application context.
If there is a need for extending the implementation it’s enough to provide all extensions as spring beans and the module will pick them up.

See the expected extension beans injects into the spring boot configuration:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` @Inject private Optional<List<ClientHttpRequestInterceptor>> interceptors; @Inject private Optional<List<ResponseErrorHandler>> errorHandlers; @Inject private Optional<List<HttpMessageConverter<?>>> messageConvertes; ``` |
```

## JS Connector Client

Connector Client is a javascript library which helps you to setup, communicate to Rest Server Connector in the backend.
The library provides the setup classes and filters.

* `ServerConnector` is an interface which allows you to provide your own implementation for connect and fetch.
* `RestServerConnector` is out of the box implementation `ServerConnector` which help you to connect to the backend using REST.
  During the construction of connector it’s default (you can’t change) that add some request and response filters.
  You can add more additional request and response filters by your own.

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` const additionalRequestFilter: RequestFilter[] = [...]; const responseFilters: ResponseFilter[] = [...]; const serverConnector = new RestServerConnector(serverURL, requestFilters, responseFilters); ``` |
```

* `ConnectorLocator` will help you holds and provides access to a single instance of a `ServerConnector`

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` ConnectorLocator.createInstance(serverConnector);  const baseUrl = (ConnectorLocator.getInstance().getServerConnector() as RestServerConnector).getBaseUrl(); ``` |
```

* `Filters` are the convenient ways for you to intercept the Request and Response according to your needs.

## Other Resources

* [JavaDoc](https://geta12.com/docs/2025.06/ext5/utils_server_connector/server-connector-documentation-src/assets/javadoc/index.html)
* [TypeDoc](https://geta12.com/docs/2025.06/ext5/utils_server_connector/server-connector-documentation-src/assets/typedoc/index.html)

## Migration Instructions

|  |  |
| --- | --- |
|  | Please have a look at [Migration to latest A12](https://geta12.com/docs/overall/migration_guide/index.html) chapter for an explanation of general steps on how to upgrade before starting with the component migration. |

|  |  |
| --- | --- |
|  | UAA provides Hypermod (utils-connector-codemod) for automatic migration of breaking changes of utils-connector-client. Please read [how to apply Hypermod recipes](https://geta12.com/docs/overall/migration_guide/index.html#_usage_of_hypermod_for_frontend_components) in A12 frontend components. |

### 2025.06-ext4

#### Deprecation

##### utils-connector

* Deep path imports from `@com.mgmtp.a12.utils/utils-connector` are deprecated and will be removed in a future release.

  All exports are now available from the top-level package entry point.

  Before

  ```
  |  |  |
  | --- | --- |
  | ``` 1 2 ``` | ``` import { RestServerConnector } from "@com.mgmtp.a12.utils/utils-connector/lib/main/internal/connector/RestServerConnector.js"; import { FilterChain } from "@com.mgmtp.a12.utils/utils-connector/lib/main/index.js"; ``` |
  ```

  After

  ```
  |  |  |
  | --- | --- |
  | ``` 1 ``` | ``` import { RestServerConnector, FilterChain } from "@com.mgmtp.a12.utils/utils-connector"; ``` |
  ```

  |  |  |
  | --- | --- |
  |  | Use `utils-connector-codemod` with recipe `top-level-imports` to migrate automatically. |

  ```
  |  |  |
  | --- | --- |
  | ``` 1 ``` | ``` npx @com.mgmtp.a12.utils/utils-connector-codemod top-level-imports <path-to-tsconfig> ``` |
  ```
