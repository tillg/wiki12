---
source: https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_workflows_java_delegates/index.html
category: overall
docid: dev_tutorial_workflows_java_delegates
scraped: 2026-06-12
---

# Task 3 - Creating Java Delegates

|  |  |
| --- | --- |
|  | This tutorial uses A12 version 2025.06-ext5 and is based on the Project Template version 202506.5.1. |

## Prerequisites

|  |  |
| --- | --- |
|  | If you are new to the development tutorials, make sure to first go through [Tutorials > General Information](https://geta12.com/docs/overall/dev_tutorial_general_information/index.html) and [Tutorials > Workflows > Introduction](https://geta12.com/docs/overall/dev_tutorial_workflows_intro/index.html) before continuing here. |

You can check out the tag **2025.06-ext5/workflows/task-3-start** to follow along.

If you get stuck at any point, you can check out the tag **2025.06-ext5/workflows/task-3-end** to see how your code differs from the solution.

## Use Case

Send a "Welcome Gift Card" to new VIP customers via a Java delegate. This delegate illustrates how to create Java-based service tasks that integrate with A12 APIs, external services, and run business logic in-engine.

## End Result

Upon finishing this task, you will know:

* How to implement Java delegates
* How to inject Spring dependencies into delegates
* How to access and manipulate process variables in Java
* How to test Java delegates

  + How to use Testcontainers for higher-level integration tests

## Step-by-Step Instructions

### Understanding Java Delegates

Java delegates provide a powerful way to implement service tasks with full access to:

* Java ecosystem

  + Developers stay in the "Java world", no language switching
* Workflow engine application context and dependency injection.

  + CIB 7 Java API to manage processes, tasks, jobs, history etc.
  + A12 APIs and other Java ecosystem libraries.
  + Good testability.
* External systems and databases.
* Transaction management and error recovery.

### Implementing the Send Gift Card Delegate

The "Send Welcome Gift Card" delegate needs to:

1. Retrieve customer and gift card information from process variables
2. Send an email with the gift card code to the customer

#### Implementing a Delegate

To create a delegate, you simply implement the interface `org.cibseven.bpm.engine.delegate.JavaDelegate` and override `execute(DelegateExecution execution)`.

Next, you must expose a Spring bean of the delegate, e.g. via a `@Configuration` class with a `@Bean`-annotated method that constructs an instance of the delegate.

#### Accessing Process Variables

Inside the delegate’s `execute(DelegateExecution execution)` method, you have access to the engine `execution` to access process variables:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` var customerEmail = execution.getVariable("customerEmail").toString(); ``` |
```

#### Available Process Variables

Via the `availableInProcessAs` annotation in the `Contact_DM` model, the following process variables are available:

* `customerEmail`
* `customerFirstName`
* `customerLastName`
* `giftCardCode`

You can access them from a delegate via `execution.getVariable("variableName")`.

#### BPMN Integration

The BPMN service task definition for the "Send welcome gift card" task is as follows:

![java delegate service task bpmn](https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_workflows_java_delegates/assets/java-delegate-service-task-bpmn.png)

The delegate expression `${sendGiftCardDelegate}` means that it will search for a Spring bean **named exactly `sendGiftCardDelegate`** and call its `execute` method.

#### Emailing

The solution will use the Spring email integration. See [Spring Boot > Sending Email](https://docs.spring.io/spring-boot/reference/io/email.html) and [Spring Framework > Email](https://docs.spring.io/spring-framework/reference/integration/email.html).

As a dev email server, the solution will use [maildev](https://github.com/maildev/maildev). The README contains suggested configuration properties for Spring Email.

#### Troubleshooting

If you get a Freemarker-related error when starting the application,
you can exclude the following dependency because we do not use Freemarker templating in this tutorial:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` implementation (a12Libs.workflows.engine) {     exclude group: "org.cibseven.template-engines", module: "cibseven-template-engines-freemarker" } ``` |
```

Your task:

* Implement the `SendGiftCardDelegate` class.

  + Read the rather brief email-related Spring documentation linked above.
  + Add the necessary dependencies.
  + Start a maildev container.
  + Add the necessary email configuration to connect to maildev into your `application.properties`.
  + Set up configuration and dependency injection.

Hints

**Dependencies**

For this task, you will need the `spring-boot-starter-mail` dependency.

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` // libs { library('spring-boot-starter-mail', 'org.springframework.boot', 'spring-boot-starter-mail').versionRef('spring-boot') ``` |
```

**Maildev**

To start maildev, you can run:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` docker run -p 1025:1025 -p 1080:1080 maildev/maildev ``` |
```

**Configuration**

The following Spring configuration takes care of connecting Spring Email to maildev:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` # ... # Email spring.mail.host=localhost spring.mail.port=1025 spring.mail.username=no-reply@acme.org spring.mail.properties.mail.smtp.connectiontimeout=5000 spring.mail.properties.mail.smtp.timeout=5000 spring.mail.properties.mail.smtp.writetimeout=5000 ``` |
```


Click to see solution

First, add the required dependencies.

File: `settings.gradle`

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` // libs { library('spring-boot-starter-mail', 'org.springframework.boot', 'spring-boot-starter-mail').versionRef('spring-boot') ``` |
```

File: `workflow-engine/build.gradle`

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` dependencies {     // Spring Boot     // ...     implementation libs.spring.boot.starter.mail      // A12 Workflows     implementation (a12Libs.workflows.engine) {         exclude group: "org.cibseven.template-engines", module: "cibseven-template-engines-freemarker"     } } ``` |
```

Then, configure the required and suggested email properties as per the Spring docs.

File: `workflow-engine/src/main/resources/application-dev.properties`

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` # Email spring.mail.host=localhost spring.mail.port=1025 spring.mail.username=no-reply@acme.org spring.mail.properties.mail.smtp.connectiontimeout=5000 spring.mail.properties.mail.smtp.timeout=5000 spring.mail.properties.mail.smtp.writetimeout=5000 ``` |
```

All that is left to do is to implement the delegate itself.

File: `workflow-engine/src/main/java/com/mgmtp/a12/tutorial/workflow/engine/delegates/SendGiftCardDelegate.java`

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 ``` | ``` package com.mgmtp.a12.tutorial.workflow.engine.delegates;  import org.cibseven.bpm.engine.delegate.DelegateExecution; import org.cibseven.bpm.engine.delegate.JavaDelegate; import org.springframework.mail.MailException; import org.springframework.mail.MailSender; import org.springframework.mail.SimpleMailMessage;  public class SendGiftCardDelegate implements JavaDelegate {      private final MailSender mailSender;      public SendGiftCardDelegate(MailSender mailSender) {         this.mailSender = mailSender;     }      @Override     public void execute(DelegateExecution execution) throws MailException {         var fromEmail = execution.getVariable("salesRep").toString();         var customerEmail = execution.getVariable("customerEmail").toString();         var customerFirstName = execution.getVariable("customerFirstName").toString();         var customerLastName = execution.getVariable("customerLastName").toString();         var giftCardCode = execution.getVariable("giftCardCode").toString();          SimpleMailMessage email = new SimpleMailMessage();         email.setFrom(fromEmail);         email.setTo(customerEmail);         email.setSubject("Your welcome gift from ACME");         email.setText("""                         Dear %s %s,                          As a little welcome gift, you can redeem the following gift card in our shop: %s                 """.formatted(customerFirstName, customerLastName, giftCardCode));          this.mailSender.send(email);     } } ``` |
```

|  |  |
| --- | --- |
|  | By throwing a `org.cibseven.bpm.engine.delegate.BpmnError(errorCode)` from your delegate, you could trigger error boundary events in BPMN. This allows you to implement error handling and recovery at the process level. This is only useful for errors that can be fixed in the process. For instance, if the email cannot be sent because the recipient address is invalid, you could catch the `MailException` and throw a BPMN error instead. This would allow the process to continue in an alternative flow, e.g., asking the user to provide a different email address. |

You could annotate this class with `@Component` and a bean named `sendGiftCardDelegate` would be created automatically.

However, we want to decouple the bean creation (configuration) from the business logic to improve testability. Also, this allows extracting configuration into a separate module if desired.

File: `workflow-engine/src/main/java/com/mgmtp/a12/tutorial/workflow/engine/delegates/DelegatesConfiguration.java`

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` package com.mgmtp.a12.tutorial.workflow.engine.delegates;  import org.springframework.context.annotation.Bean; import org.springframework.context.annotation.Configuration; import org.springframework.mail.MailSender;  @Configuration public class DelegatesConfiguration {      @Bean     public SendGiftCardDelegate sendGiftCardDelegate(MailSender mailSender) {         return new SendGiftCardDelegate(mailSender);     } } ``` |
```

**Your onboarding process is now fully functional!**

To test it end to end, run maildev in Docker (see Hints from above) and make sure that the external workers are up and running. Then, once you trigger an onboarding, it will be processed, and you should see an email in maildev (`http://localhost:1080/`) with the generated gift card code.

### Testing Java Delegates

#### Testcontainers

For integration testing, the solution will use [Testcontainers](https://testcontainers.com/) to start a [maildev](https://github.com/maildev/maildev) email server via Docker.

We cover this because, with A12 Workflows, you will likely want Docker-based tests sooner or later. For instance, to start Data Services as well as the A12 Workflow Engine.

See also [Testcontainers > JUnit 5 Quickstart](https://java.testcontainers.org/quickstart/junit_5_quickstart/).

Your task:

* Implement a test using the CIB 7 Testing API to verify the service task is wired up correctly (similar to the script task test).
* Implement an integration test using Testcontainers to verify that emails are sent successfully.

  + The first test verifies that the delegate will be called, while the second verifies that the delegate does what it is supposed to.

Hints

**Dependencies**

For this task, you will need the Testcontainers dependency.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` // testCatalogLibs { version('testcontainers', '1.19.8')  library('testcontainers-junit5', 'org.testcontainers', 'junit-jupiter').versionRef('testcontainers') ``` |
```

**1st Test — Delegate Wiring**

To test that the delegate is wired up correctly in BPMN, you can use a `@SpringBootTest` (so that the delegate bean is initialized). You can then inject a `RuntimeService` directly instead of getting it from a `ProcessEngine` object.

Also, you want to mock the delegate bean to avoid actually calling the `MailSender` and to verify that its `execute` method was called.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 ``` | ``` @SpringBootTest public class SendGiftCardDelegateTest {      @MockitoBean     private final SendGiftCardDelegate sendGiftCardDelegate = null;      @Autowired     private final RuntimeService runtimeService = null;  	// ... } ``` |
```

**2nd Test — Delegate Behavior**

For the Testcontainers test, the test class must be annotated with `@Testcontainers` and you need to define a static `GenericContainer` field annotated with `@Container`.

This instructs Testcontainers to start the container before test execution and stop it after test execution.

To re-configure the Spring Boot application after the container has started, you can use a static method annotated with `@DynamicPropertySource`.

This way, Testcontainers ensures proper lifecycle management of containers and config.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` @Testcontainers @SpringBootTest class SendGiftCardDelegateIT {  	// ...      // IMPORTANT: mgm-internal users must use image name "dockerregistry.mgm-tp.com/maildev/maildev"     @Container     static GenericContainer<?> maildev = new GenericContainer<>("artifacts.geta12.com/artifactory/a12-docker/maildev/maildev")             .withExposedPorts(1025, 1080)             .waitingFor(Wait.forListeningPorts(1025, 1080));       @DynamicPropertySource     static void configureProperties(DynamicPropertyRegistry registry) {         registry.add("spring.mail.host", maildev::getHost);         registry.add("spring.mail.port", () -> maildev.getMappedPort(1025));     }  	// ... } ``` |
```

**Working with maildev**

You can view the email inbox at `http://localhost:<MAPPED_PORT_FOR_PORT_1080>`. To get the port, you can run `maildev.getMappedPort(1080)` in a debugger while the maildev container is still up.

![maildev inbox](https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_workflows_java_delegates/assets/maildev-inbox.png)

Alternatively, while developing the tests, you can run the container outside the test using `docker run -p 1080:1080 -p 1025:1025 maildev/maildev` and introduce Testcontainers later.

To *fetch* emails from maildev, you can use a `RestTemplate` to call `localhost:<YOUR_MAILDEV_PORT>/email`. This endpoint simply returns all emails as JSON.


Click to see solution

First, add the Testcontainers dependency to the version catalog and include it in the engine module:

File: `settings.gradle`

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` // testCatalogLibs { version('testcontainers', '1.19.8')  library('testcontainers-junit5', 'org.testcontainers', 'junit-jupiter').versionRef('testcontainers') ``` |
```

File: `workflow-engine/build.gradle`

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` dependencies {     // Testing     // ...     testImplementation testCatalogLibs.testcontainers.junit5 } ``` |
```

To test that the delegate is wired up correctly in BPMN, you can mock the delegate bean itself, start a process instance at the delegate service task, and verify that the delegate’s `execute` method was called.

File: `workflow-engine/src/test/java/com/mgmtp/a12/tutorial/workflow/engine/delegates/SendGiftCardDelegateTest.java`

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 ``` | ``` package com.mgmtp.a12.tutorial.workflow.engine.delegates;  import org.cibseven.bpm.engine.RuntimeService; import org.cibseven.bpm.engine.delegate.DelegateExecution; import org.junit.jupiter.api.Test; import org.mockito.Mockito; import org.springframework.beans.factory.annotation.Autowired; import org.springframework.boot.test.context.SpringBootTest; import org.springframework.test.context.bean.override.mockito.MockitoBean;  import static org.mockito.ArgumentMatchers.any;  @SpringBootTest public class SendGiftCardDelegateTest {      @MockitoBean     private final SendGiftCardDelegate sendGiftCardDelegate = null;      @Autowired     private final RuntimeService runtimeService = null;      private void executeSendGiftCardServiceTask() {         this.runtimeService                 .createProcessInstanceByKey("CustomerOnboardingProcess")                 .startBeforeActivity("sendWelcomeGiftCardActivity")                 .execute();     }      @Test     void shouldCallSendGiftCardDelegate() {         // when         executeSendGiftCardServiceTask();          // then         Mockito.verify(sendGiftCardDelegate).execute(any(DelegateExecution.class));     } } ``` |
```

This is a regular Spring and Mockito test. The only CIB 7 specific code is using the `RuntimeService` to start a process instance at the delegate service task.

|  |  |
| --- | --- |
|  | This is actually an integration test because it uses `@SpringBootTest` to initialize the entire Spring context. To differentiate it from the higher-level Docker-based tests, this class has `Test` suffix and the Docker-based test has `IT` suffix. In your project, we recommend agreeing on a naming schema to differentiate all these test types and separating them into separate Gradle source sets, e.g. via [Gradle JVM test suites](https://docs.gradle.org/current/userguide/jvm_test_suite_plugin.html). |

Next, we want to test the actual behavior of the delegate, i.e., that it sends an email. For this, we use Testcontainers to start a maildev server in Docker.

File: `workflow-engine/src/test/java/com/mgmtp/a12/tutorial/workflow/engine/delegates/SendGiftCardDelegateIT.java`

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 ``` | ``` package com.mgmtp.a12.tutorial.workflow.engine.delegates;  import org.cibseven.bpm.engine.delegate.DelegateExecution; import org.junit.jupiter.api.BeforeAll; import org.junit.jupiter.api.Test; import org.springframework.beans.factory.annotation.Autowired; import org.springframework.boot.test.context.SpringBootTest; import org.springframework.http.ResponseEntity; import org.springframework.mail.MailException; import org.springframework.mail.MailSender; import org.springframework.mail.SimpleMailMessage; import org.springframework.test.context.DynamicPropertyRegistry; import org.springframework.test.context.DynamicPropertySource; import org.springframework.test.context.bean.override.mockito.MockitoSpyBean; import org.springframework.web.client.RestTemplate; import org.testcontainers.containers.GenericContainer; import org.testcontainers.containers.wait.strategy.Wait; import org.testcontainers.junit.jupiter.Container; import org.testcontainers.junit.jupiter.Testcontainers;  import static org.assertj.core.api.Assertions.assertThat; import static org.mockito.Mockito.*;  @Testcontainers @SpringBootTest class SendGiftCardDelegateIT {      private final SendGiftCardDelegate delegate;     private static final DelegateExecution mockExecution = mock(DelegateExecution.class);      @Autowired     SendGiftCardDelegateIT(SendGiftCardDelegate delegate) {         this.delegate = delegate;     }      @MockitoSpyBean     private MailSender mailSender;      // IMPORTANT: mgm-internal users must use image name "dockerregistry.mgm-tp.com/maildev/maildev"     @Container     static GenericContainer<?> maildev = new GenericContainer<>("artifacts.geta12.com/artifactory/a12-docker/maildev/maildev")             .withExposedPorts(1025, 1080)             .waitingFor(Wait.forListeningPorts(1025, 1080));      @DynamicPropertySource     static void configureProperties(DynamicPropertyRegistry registry) {         registry.add("spring.mail.host", maildev::getHost);         registry.add("spring.mail.port", () -> maildev.getMappedPort(1025));     }      @BeforeAll     static void setUpMocks() {         when(mockExecution.getVariable("salesRep")).thenReturn("mock@from.com");         when(mockExecution.getVariable("customerEmail")).thenReturn("mock@value.com");         when(mockExecution.getVariable("customerFirstName")).thenReturn("Cus");         when(mockExecution.getVariable("customerLastName")).thenReturn("Tomer");         when(mockExecution.getVariable("giftCardCode")).thenReturn("VIP-56789");     }      @Test     public void shouldCallMailSender() throws MailException {         // when         delegate.execute(mockExecution);          // then         verify(mailSender).send(any(SimpleMailMessage.class));     }      @Test     void shouldSuccessfullySendEmailToMailServer() throws MailException {         // given         String maildevUrl = "http://%s:%d".formatted(maildev.getHost(), maildev.getMappedPort(1080));         RestTemplate restTemplate = new RestTemplate();          // when         delegate.execute(mockExecution);          // then         ResponseEntity<String> emailsOnServer = restTemplate.getForEntity(maildevUrl + "/email", String.class);          assertThat(emailsOnServer.getBody())                 .contains("mock@value.com")                 .contains("Cus")                 .contains("Tomer")                 .contains("VIP-56789");     } } ``` |
```

This test class has two test cases.

The first one uses the `@MockitoSpyBean` of the `MailSender` to verify that the delegate calls `MailSender.send`.

|  |  |
| --- | --- |
|  | `@MockitoSpyBean` is used to spy on calls to the actual `MailSender` bean. It is not a mock so emails are actually sent to the maildev server. |

The second test case verifies that the email was actually received by the maildev server.

|  |  |
| --- | --- |
|  | In order to successfully execute this test class, make sure that you are using the correct docker image name for `maildev` (see also the comment right above of the instantiation of this variable). |

|  |  |
| --- | --- |
|  | You must use `RestTemplate` here instead of `TestRestTemplate` because you want to call a service outside the Spring Boot web environment. |

|  |  |
| --- | --- |
|  | If you have an actual email server to send outbound emails, you can try sending an email to your actual email address. Adjust your `application.properties` to use your email server and enter your email in the tutorial app, then complete a process instance (or do it via a test run). |

#### Troubleshooting

When you run the build from the terminal on Windows with Rancher Desktop (for example, via `gradle build`), the Testcontainers-based integration test may fail with the following error, even though `docker ps` works fine in the same shell:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` java.lang.IllegalStateException: Could not find a valid Docker environment. Please see logs and check configuration     ...     NpipeSocketClientProviderStrategy: failed with exception RuntimeException     (MalformedChunkCodingException: Bad chunk header: ). ``` |
```

This error is caused by an incompatibility between the Testcontainers HTTP client and the Rancher Desktop Docker engine when they communicate over the Windows named pipe `\\.\pipe\docker_engine`.
Restarting Rancher Desktop, or running `wsl --shutdown` and starting Rancher Desktop again, does not always resolve the issue.

As a workaround, you can bridge the Docker Unix socket inside the `rancher-desktop` Windows Subsystem for Linux distribution to a local TCP port and point Testcontainers at that port.

1. Open a dedicated PowerShell window and start a `socat` bridge that forwards a local TCP port to the Docker Unix socket inside the `rancher-desktop` distribution.
   Keep this window open while you run the tests.

   ```
   |  |  |
   | --- | --- |
   | ``` 1 ``` | ``` wsl -d rancher-desktop -- socat TCP-LISTEN:2375,reuseaddr,fork,bind=0.0.0.0 UNIX-CONNECT:/var/run/docker.sock ``` |
   ```
2. Open a second PowerShell window, set the `DOCKER_HOST` environment variable so Testcontainers uses the TCP bridge instead of the named pipe, and run the build.

   ```
   |  |  |
   | --- | --- |
   | ``` 1 2 ``` | ``` $env:DOCKER_HOST = "tcp://localhost:2375" gradle build ``` |
   ```
3. When the build is finished, close the first PowerShell window or press Ctrl+C in it to stop the bridge.

|  |  |
| --- | --- |
|  | Exposing the Docker daemon on `localhost:2375` is unauthenticated and unencrypted. Any process on the machine can control the Docker engine while the bridge is running. Use this workaround only on a single-user development machine, and stop the bridge after the build. |

## Conclusion

You have successfully implemented a Java delegate that handles business logic involving an external service. Java delegates are probably the most natural way to implement service tasks in most A12 projects because they stay in the JVM ecosystem.

|  |  |
| --- | --- |
|  | A12 Workflows also uses Java Delegates to provide the out-of-the-box automations that can be selected as templates for service tasks. |

**Key takeaways:**

* Java delegates provide full access to the Spring ecosystem and A12 Java APIs.

  + Dependency injection makes delegates well testable and maintainable.
* Proper error handling with BPMN errors enables process-level error recovery via `BpmnError` and error boundary events.
* You can use Testcontainers to test behavior across service boundaries such as between Data Services and CIB 7, or other services orchestrated by your workflows.

If something does not seem right, or you got stuck at any point, you can just check out **2025.06-ext5/workflows/task-3-end** to see differences between both implementations.

|  |  |
| --- | --- |
| [« Task 2: External Workers](https://geta12.com/docs/overall/dev_tutorial_workflows_external_workers/index.html) | [Task 4: Encrypting Process Variables »](https://geta12.com/docs/overall/dev_tutorial_workflows_encryption/index.html) |
