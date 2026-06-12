---
source: https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_workflows_encryption/index.html
category: overall
docid: dev_tutorial_workflows_encryption
scraped: 2026-06-12
---

# Task 4 - Data Encryption in Workflows

|  |  |
| --- | --- |
|  | This tutorial uses A12 version 2025.06-ext5 and is based on the Project Template version 202506.5.1. |

## Prerequisites

|  |  |
| --- | --- |
|  | If you are new to the development tutorials, make sure to first go through [Tutorials > General Information](https://geta12.com/docs/overall/dev_tutorial_general_information/index.html) and [Tutorials > Workflows > Introduction](https://geta12.com/docs/overall/dev_tutorial_workflows_intro/index.html) before continuing here. |

You can check out the tag **2025.06-ext5/workflows/task-4-start** to follow along.

If you get stuck at any point, you can check out the tag **2025.06-ext5/workflows/task-4-end** to see how your code differs from the solution.

## Use Case

Use extension points for variable serialization to implement variable encoding in the Customer Onboarding Process.

|  |  |
| --- | --- |
|  | In this task, for simplicity, you simply base64-**encode** variable values to demonstrate the extension points. This is **not encryption**.  However, you can use the same extension points to implement proper encryption. |

## End Result

Upon finishing this task, you will know:

* How to implement process variable encryption in A12 Workflows.
* How to query the CIB 7 database directly in tests.
* How to use the CIB 7 Testing API to programmatically create process models.

## Step-by-Step Instructions

### Understanding Encryption in A12 Workflows

A12 Workflows provides the `workflows-variable-encryption` configuration profile for the workflow engine. This profile enables publication of the following Spring events:

* `ProcessVariableBeforeSerializationEvent`

  + Can be used to modify a variable before persisting to the DB, e.g. to encrypt it
* `ProcessVariableBeforeDeserializationEvent`

  + Can be used to modify a variable after reading it from the DB, e.g. to decrypt it

**To modify the variable value, you must call `event.setVariable(…​)`.** The passed value will then be used for further processing within the engine.

|  |  |
| --- | --- |
|  | The name `ProcessVariableBeforeDeserializationEvent` might be misleading because the event is published after Java deserialization, a better name would be `ProcessVariableAfterDeserializationEvent` ("after"). You don’t need to worry about deserializing the event payload, it contains the value you passed before serialization. The event name will be fixed in the future. |

For details, read [A12 Workflows > Process Variable Serialization](https://geta12.com/docs/workflows/dev-docs/index.html#anchor-cib7-process-variable-serialization).

|  |  |
| --- | --- |
|  | The configuration profile `workflows-variable-encryption` is already included in the tutorial app’s default configuration. |

### Implementing Process Variable Encryption

Your task:

* Implement base64-encoding on variable serialization
* Implement base64-decoding on variable deserialization

Click to see solution

First, implement the Spring event listeners for both events.

File: `workflow-engine/src/main/java/com/mgmtp/a12/tutorial/workflow/engine/encryption/ProcessVariableEncryptionHandler.java`

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 ``` | ``` package com.mgmtp.a12.tutorial.workflow.engine.encryption;  import com.mgmtp.a12.workflows.engine.internal.serialization.ProcessVariableBeforeDeserializationEvent; import com.mgmtp.a12.workflows.engine.internal.serialization.ProcessVariableBeforeSerializationEvent; import org.springframework.context.event.EventListener;  import java.util.Base64;  public class ProcessVariableEncryptionHandler {      @EventListener     void handleEncryption(ProcessVariableBeforeSerializationEvent event) {         // Insert actual encryption logic here for production...          var encodedValue = Base64.getEncoder().encodeToString(event.getVariable().getBytes());          event.setVariable(encodedValue);     }      @EventListener     void handleDecryption(ProcessVariableBeforeDeserializationEvent event) {         byte[] decodedBytes = Base64.getDecoder().decode(event.getVariable());          // Insert actual decryption logic here for production...          event.setVariable(new String(decodedBytes));     } } ``` |
```

|  |  |
| --- | --- |
|  | If you have multiple transformation steps, e.g. encrypt then encode, you must naturally apply their counterparts in reverse order on deserialization, e.g. first decode, then decrypt. |

This class handles both events to encode and decode the variable by calling `event.setVariable(…​)`.

Next, register the class as a Spring bean.

File: `workflow-engine/src/main/java/com/mgmtp/a12/tutorial/workflow/engine/encryption/ProcessVariableEncryptionConfiguration.java`

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` package com.mgmtp.a12.tutorial.workflow.engine.encryption;  import org.springframework.context.annotation.Bean; import org.springframework.context.annotation.Configuration;  @Configuration public class ProcessVariableEncryptionConfiguration {      @Bean     ProcessVariableEncryptionHandler processVariableEncryptionHandler() {         return new ProcessVariableEncryptionHandler();     } } ``` |
```

### Testing Process Variable Encryption

#### Programmatic Process Model Creation

The CIB 7 Testing API allows you to create process models programmatically. This is useful for tests where you want to avoid loading BPMN files.

For details, read [CIB 7 > Fluent Builder API](https://docs.cibseven.org/manual/latest/user-guide/model-api/bpmn-model-api/fluent-builder-api/).

Once you have an instance of `BpmnModelInstance`, you can deploy it using with an injected `RepositoryService`.

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` repositoryService.createDeployment()         .addModelInstance("TestProcess.bpmn", myModelInstance)         .deploy(); ``` |
```

#### Querying the CIB 7 Database

When using the A12 Workflows events, CIB 7 stores the process variable values not directly in the `ACT_RU_VARIABLE` table, but serializes it into the `ACT_GE_BYTEARRAY` table.

The `ACT_RU_VARIABLE` table then contains a foreign key to the corresponding entry in the `ACT_GE_BYTEARRAY` table.

You can fetch the persisted byte array for a given process instance ID and variable name using the following SQL query:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` SELECT bytearray.BYTES_ FROM ACT_RU_VARIABLE variable JOIN ACT_GE_BYTEARRAY bytearray ON variable.BYTEARRAY_ID_ = bytearray.ID_ WHERE variable.PROC_INST_ID_ = ? AND variable.NAME_ = ? ``` |
```

To read more about the CIB 7 database schema, see [CIB 7 > Database Schema](https://docs.cibseven.org/manual/1.0/user-guide/process-engine/database/database-schema/).

Your task:

* Use the CIB 7 Testing API to programmatically create a process model and deploy it.
* Fetch the persisted variable value directly from the CIB 7 database and verify that the value is encoded as expected.

  + Loading the variable via regular CIB 7 API will go through decoding so it cannot be used.

|  |  |
| --- | --- |
|  | In practice, you could alternatively unit test the isolated encoding/encryption logic in the encryption handler and then test that the encryption handler bean is called when a variable is stored (via a spy). This would also deliver good confidence that the code works as expected. |

Hints

The solution uses the following method to load the variable value from the database:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 ``` | ``` private String getVariableFromDatabase(String processInstanceId, String variableName) { 	try (var connection = dataSource.getConnection()) { 		// When enabling encryption/eventing, CIB 7 stores variables as byte arrays 		var variableSql = """ 				SELECT bytearray.BYTES_ 				FROM ACT_RU_VARIABLE variable 				JOIN ACT_GE_BYTEARRAY bytearray ON variable.BYTEARRAY_ID_ = bytearray.ID_ 				WHERE variable.PROC_INST_ID_ = ? AND variable.NAME_ = ? 				"""; 		try (var stmt = connection.prepareStatement(variableSql)) { 			stmt.setString(1, processInstanceId); 			stmt.setString(2, variableName); 			var resultSet = stmt.executeQuery(); 			if (!resultSet.next()) { 				throw new RuntimeException("No variable found with name: " + variableName); 			} 			byte[] serializedData = resultSet.getBytes("BYTES_"); 			return (String) new ObjectInputStream(new ByteArrayInputStream(serializedData)).readObject(); 		} 	} catch (Exception e) { 		throw new RuntimeException("Failed to query database", e); 	} } ``` |
```

To programmatically create a BPMN model instance, you can use the following code snippet.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` var processModel = Bpmn.createExecutableProcess("TestProcess") 		.startEvent() 		.scriptTask("createSomeVariable") 			.scriptFormat("javascript") 			.scriptText("execution.setVariable(\"myVariable\", \"sensitive data\")") 		.intermediateCatchEvent("wait") 			.message("someMessage") 		.endEvent() 		.done(); ``` |
```

You can then deploy it via an injected `RepositoryService`.

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` repositoryService.createDeployment() 		.addModelInstance("TestProcess.bpmn", processModel) 		.deploy(); ``` |
```


Click to see solution

The test is implemented as a `@SpringBootTest` and injects all required CIB 7 beans.

It then uses the given SQL query to fetch a variable value from the database and verifies that it is base64-encoded.

File: `workflow-engine/src/test/java/com/mgmtp/a12/tutorial/workflow/engine/encryption/ProcessVariableEncryptionHandlerTest.java`

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 ``` | ``` package com.mgmtp.a12.tutorial.workflow.engine.encryption;  import org.cibseven.bpm.engine.RepositoryService; import org.cibseven.bpm.engine.RuntimeService; import org.cibseven.bpm.model.bpmn.Bpmn; import org.junit.jupiter.api.Test; import org.springframework.beans.factory.annotation.Autowired; import org.springframework.boot.test.context.SpringBootTest;  import javax.sql.DataSource; import java.io.ByteArrayInputStream; import java.io.ObjectInputStream; import java.util.Base64;  import static org.assertj.core.api.Assertions.assertThat; import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;  @SpringBootTest class ProcessVariableEncryptionHandlerTest {      @Autowired     private RuntimeService runtimeService;      @Autowired     private RepositoryService repositoryService;      @Autowired     private DataSource dataSource;      @Test     public void shouldEncryptProcessVariables() {         // given         var processModel = Bpmn.createExecutableProcess("TestProcess")                 .startEvent()                 .scriptTask("createSomeVariable")                 .scriptFormat("javascript")                 .scriptText("execution.setVariable(\"myVariable\", \"sensitive data\")")                 .intermediateCatchEvent("wait")                 .message("someMessage")                 .endEvent()                 .done();          repositoryService.createDeployment()                 .addModelInstance("TestProcess.bpmn", processModel)                 .deploy();          // when         var processInstance = runtimeService.startProcessInstanceByKey("TestProcess");          // then         var encodedValueFromDatabase = getVariableFromDatabase(processInstance.getId(), "myVariable");         assertThat(encodedValueFromDatabase).isNotNull();         assertThat(encodedValueFromDatabase).isNotEqualTo("sensitive data");          var decoded = assertDoesNotThrow(() -> Base64.getDecoder().decode(encodedValueFromDatabase));         var decodedString = new String(decoded);         assertThat(decodedString).isEqualTo("\"sensitive data\""); // In DB, string is stored as serialized TextNode, thus with quotes.     }      private String getVariableFromDatabase(String processInstanceId, String variableName) {         try (var connection = dataSource.getConnection()) {             // When enabling encryption/eventing, CIB 7 stores variables as byte arrays             var variableSql = """                     SELECT bytearray.BYTES_                     FROM ACT_RU_VARIABLE variable                     JOIN ACT_GE_BYTEARRAY bytearray ON variable.BYTEARRAY_ID_ = bytearray.ID_                     WHERE variable.PROC_INST_ID_ = ? AND variable.NAME_ = ?                     """;             try (var stmt = connection.prepareStatement(variableSql)) {                 stmt.setString(1, processInstanceId);                 stmt.setString(2, variableName);                 var resultSet = stmt.executeQuery();                 if (!resultSet.next()) {                     throw new RuntimeException("No variable found with name: " + variableName);                 }                 byte[] serializedData = resultSet.getBytes("BYTES_");                 return (String) new ObjectInputStream(new ByteArrayInputStream(serializedData)).readObject();             }         } catch (Exception e) {             throw new RuntimeException("Failed to query database", e);         }     } } ``` |
```

## Conclusion

You have learned how to inject encoding (or encryption) logic for process variables in A12 Workflows. You also learned how to programmatically create process models for tests and got in first contact with the relational schema of CIB 7.

**Key takeaways:**

* A12 Workflows publishes Spring events around CIB 7 process variable serialization.

  + These provide a simple way to fulfill data privacy requirements to encrypt data at rest.
* For tests, you can choose to create BPMN files or programmatically create BPMN models.

If something does not seem right, or you got stuck at any point, you can just check out **2025.06-ext5/workflows/task-4-end** to see differences between both implementations.

Now that you have completed the Workflows tutorial, we would also **really appreciate [your feedback](https://form.jotform.com/252681508457363).** If you have any ideas or wishes for additional tasks or tutorials, you can let us know there.

|  |  |
| --- | --- |
| [« Task 3: Java Delegates](https://geta12.com/docs/overall/dev_tutorial_workflows_java_delegates/index.html) |  |
