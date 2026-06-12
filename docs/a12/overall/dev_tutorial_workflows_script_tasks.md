---
source: https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_workflows_script_tasks/index.html
category: overall
docid: dev_tutorial_workflows_script_tasks
scraped: 2026-06-12
---

# Task 1 - Implementing Script Tasks

|  |  |
| --- | --- |
|  | This tutorial uses A12 version 2025.06-ext5 and is based on the Project Template version 202506.5.1. |

## Prerequisites

|  |  |
| --- | --- |
|  | If you are new to the development tutorials, make sure to first go through [Tutorials > General Information](https://geta12.com/docs/overall/dev_tutorial_general_information/index.html) and [Tutorials > Workflows > Introduction](https://geta12.com/docs/overall/dev_tutorial_workflows_intro/index.html) before continuing here. |

You can check out the tag **2025.06-ext5/workflows/task-1-start** to follow along.

If you get stuck at any point, you can check out the tag **2025.06-ext5/workflows/task-1-end** to see how your code differs from the solution.

## Use Case

Implement the "Assign Sales Representative" script task in the Customer Onboarding Process.

This script task will demonstrate how to write JavaScript code that executes within the CIB 7 engine, how to access process variables, interact with A12 APIs, and set workflow variables for subsequent tasks.

## End Result

Upon finishing this task, you will know:

* How to implement JavaScript-based script tasks in BPMN
* How to access and manipulate process variables in scripts
* How to bundle external JavaScript libraries for use in scripts

## Step-by-Step Instructions

### Understanding Script Tasks

Script tasks in CIB 7 allow you to execute code in a [JSR 223](https://docs.oracle.com/javase/8/docs/technotes/guides/scripting/prog_guide/api.html)-compliant script engine. Such script engines exist for Python, JavaScript, and Groovy among others.

|  |  |
| --- | --- |
|  | CIB 7 uses [GraalJS](https://www.graalvm.org/latest/reference-manual/js/) to execute JavaScript code. GraalJS is a JavaScript implementation built on top of GraalVM. It does not require GraalVM JDK. |

Script tasks can be a good choice for:

* Logic that requires a library only available in the scripting language
* Projects where developers are proficient in the used scripting language

**Key characteristics of script tasks:**

* Execute synchronously within the engine
* Have access to process variables and execution context
* Require a corresponding JSR 223-compliant script engine dependency on the classpath

  + CIB 7 then autoconfigures it

### Implementing the Sales Rep Assignment Script

The "Assign Sales Rep" task needs to:

1. Use the customer type as input
2. Assign an appropriate sales representative

#### Data Exchange and Getting Inputs

The `Contact_DM` has a field called `CustomerType` which contains the required input data. This field is annotated with `availableInProcessAs` with value `customerType`.

Additionally, the config profile `workflows-automatic-sync` is applied in the `server` module. Because of this, the Workflows Extension synchronizes all such annotated document fields to the process engine.

**So the current value of `/Contact/PersonalData/CustomerType` is available in the process as `customerType` at all times.**

We don’t focus on modeling here, so the BPMN model already defines the script task input as follows:

![script task inputs](https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_workflows_script_tasks/assets/script-task-inputs.png)

This is not strictly required. But it’s good practice to make clear what inputs and outputs a task has.

**Inside the script task, you can access the variable simply as `customerType`.**

Possible values of the customer type enum are:

* `vip`
* `partner`
* `lead`
* `inactive`
* `suspended`

#### Running Data Services and the Client

You can run the client (A12 Client) and server (A12 Data Services) via the provided run configurations for IntelliJ and VS Code.

#### Running the Workflow Engine

In addition to the services available on the main variant of the tutorial app, there is a `workflow-engine` module that contains the CIB 7 engine.

To run the engine, you can do any of the following:

* Use the `workflow engine start` run configuration in IntelliJ or VS Code.
* Run the class `WorkflowEngineTutorialApplication` from any IDE. In this case, you must set `workflow-engine` as the working directory.
* Run `gradle :workflow-engine:bootRun` from the project root directory.

|  |  |
| --- | --- |
|  | When you modify code or resources in `workflow-engine`, the engine must restart for changes to take effect.  For automatic restarts via the Spring devtools, run  ``` gradle :workflow-engine:build --continuous ```  **from the project root directory**. This triggers a rebuild on file change, which in turn triggers a restart of the engine. |

|  |  |
| --- | --- |
|  | When you create or modify BPMN models, you can deploy them directly from the Modeler. So no restart is required.  However, be aware that existing process instances will continue running on the process definition version they were started on. |

#### Manual Testing

After you start a new process instance via the tutorial app frontend, visit `http://localhost:8088/camunda/` to access the CIB 7 Admin UI. This shows the state of process instances, any incidents that occurred, which process variables exist and more.

|  |  |
| --- | --- |
|  | In the tutorial app, you can **log into the Cockpit using `admin` / `admin`**. |

For details, read [Modeling > Workflow Modeling > CIB 7 Cockpit](https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_workflows_script_tasks/assets/docs/workflows/ba-docs/index.html#anchor-bpmn-troubleshooting).

#### Script Resolving

The BPMN model expects the script at `scripts/assignSalesRep.js`. The path is relative to the engine’s resources directory. Thus, you must place the scripts in `workflow-engine/src/main/resources/scripts`.

#### Documentation

For details regarding scripting in CIB 7, read [CIB 7 > Scripting](https://docs.cibseven.org/manual/latest/user-guide/process-engine/scripting/).

#### Troubleshooting

If you encounter unexpected UAA authentication errors (check developer tools console in your browser), try manually restarting the server and/or engine.

Your task:

* Create a file `scripts/assignSalesRep.js` in the `workflow-engine` resources
* Implement sales rep assignment logic. The variable `salesRep` should get a value according to the following cases:

  + If the customer is a VIP, assign a special sales rep, e.g. `vip@acme.org`
  + If the customer is a regular customer, assign a general sales rep, e.g. `sales@acme.org`
  + If the customer type is suspended or inactive, assign no sales rep (`null`)

Click to see solution

Create the JavaScript script file:

File: `workflow-engine/src/main/resources/scripts/assignSalesRep.js`

Here’s one way to implement a solution in pure JavaScript:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` console.log("Customer type: " + customerType);  let salesRep = undefined;  switch (customerType) {     case "vip": {         salesRep = "vip@acme.org";         break;     }     case "suspended":     case "inactive": {         salesRep = null;         break;     }     default: {         salesRep = "sales@acme.org"     } }  execution.setVariable("salesRep", salesRep); ``` |
```

Note that this task could be solved in a number of different ways in A12. For instance, via DMN (Decision Model and Notation) or Kernel computations. Here, we choose this solution to demonstrate the use of script tasks.

#### Using TypeScript

If you want to use TypeScript, you must tell the compiler that the execution context provides the used objects and variables:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` declare const customerType: string; declare const execution: ExecutionEntity;  export declare interface ExecutionEntity {     getVariable(variableName: string): any;     setVariable(variableName: string, value: any): void     // If you want to declare more, see org.cibseven.bpm.engine.impl.persistence.entity.ExecutionEntity }  // Script task logic as above... ``` |
```

Next, you must bundle the TypeScript to a standalone executable JavaScript file without any imports.

For simplicity, in this task, you can use `bun` and run the following in the `scripts` directory:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx bun@1.2.22 build --entrypoint assignSalesRep.ts --outdir . --sourcemap=linked ``` |
```

This generates `assignSalesRep.js` and `assignSalesRep.js.map`. The former can be referenced for execution in the workflow engine. The latter provides mappings between TypeScript and JavaScript for debugging.

|  |  |
| --- | --- |
|  | This does **not** mean we recommend using `bun` for productive use cases. We have not analyzed it thoroughly. |

|  |  |
| --- | --- |
|  | Alternatively, you can use a more mature tool like `esbuild` or `webpack` which require a build config file. |

After implementing the script task, when you trigger an onboarding process, you should see that the corresponding process instance now moves on to the "Generate new gift card" task that you will implement in the next task:

![cockpit process instances](https://geta12.com/docs/2025.06/ext5/overall/dev_tutorial_workflows_script_tasks/assets/cockpit-process-instances.png)

|  |  |
| --- | --- |
|  | In this picture, two process instances are started. One is still in the form-based user task while one has already completed the script task and chosen the "VIP path" through the process. |

### Testing Script Tasks

For the Camunda Testing API, refer to the following resources:

* [CIB 7 > Testing](https://docs.cibseven.org/manual/latest/user-guide/testing/)
* [CIB 7 > Start a Process Instance at Any Set of Activities](https://docs.cibseven.org/manual/latest/user-guide/process-engine/process-engine-concepts/#start-a-process-instance-at-any-set-of-activities)
* [Camunda > SimpleTestCase.java](https://github.com/camunda/camunda-engine-unittest/blob/master/src/test/java/org/camunda/bpm/unittest/SimpleTestCase.java) template (CIB 7 API is equivalent)

Your task:

* Implement integration tests using the CIB 7 Testing API
* **Optionally**, create unit tests for your isolated script logic (in your favorite JavaScript or TypeScript test library)

Hints

**Initializing a Process Engine**

For JUnit 5, you can create an in-memory process engine for testing as described at the end of the JUnit 5 section in the [CIB 7 Testing](https://docs.cibseven.org/manual/latest/user-guide/testing/) documentation:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` public class MyBusinessProcessTest {    public ProcessEngine myProcessEngine = ProcessEngineConfiguration       .createStandaloneInMemProcessEngineConfiguration()       .setJdbcUrl("jdbc:h2:mem:camunda;DB_CLOSE_DELAY=-1")       .buildProcessEngine();    @RegisterExtension   ProcessEngineExtension extension = ProcessEngineExtension.builder()       .useProcessEngine(myProcessEngine)       .build();  } ``` |
```

With this, you can inject a `ProcessEngine` object into your test methods:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` @Test public void testSomething(ProcessEngine processEngine) { 	// Use the process engine for testing } ``` |
```

**Starting a Process Instance**

To start an instance of the CustomerOnboardingProcess, you can use the `ProcessEngine` API:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` ProcessInstanceWithVariables processInstance = processEngine.getRuntimeService() 	.createProcessInstanceByKey("CustomerOnboardingProcess") 	.startBeforeActivity("assignSalesRepActivity") 	.setVariableLocal("customerType", customerType) 	.executeWithVariablesInReturn(); ``` |
```

Using `startBeforeActivity`, the CIB 7 Testing API allows skipping other process steps and directly start the activity under test.

Expected process variables at that point can be set via `setVariable` or `setVariableLocal`, depending on whether the variable should be local to the task or a global process instance variable.

For details, read [CIB 7 > Variable Scopes and Variable Visibility](https://docs.cibseven.org/manual/latest/user-guide/process-engine/variables/#variable-scopes-and-variable-visibility).

Use `executeWithVariablesInReturn` instead of `execute` to assert on the variable you expect to be set by the script task.


Click to see solution

We leave the unit testing in the script language to the reader, this tutorial focuses on the CIB 7 Testing API.

---

In this solution, we use JUnit 5 and AssertJ.

We already extract the basic setup into an abstract base class:

File: `workflow-engine/src/test/java/com/mgmtp/a12/tutorial/workflow/engine/AbstractProcessEngineTest.java`

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 ``` | ``` package com.mgmtp.a12.tutorial.workflow.engine;  import org.cibseven.bpm.engine.ProcessEngine; import org.cibseven.bpm.engine.ProcessEngineConfiguration; import org.cibseven.bpm.engine.test.junit5.ProcessEngineExtension; import org.junit.jupiter.api.extension.RegisterExtension;  public class AbstractProcessEngineTest {      private final ProcessEngine inMemProcessEngine = ProcessEngineConfiguration             .createStandaloneInMemProcessEngineConfiguration()             .setJdbcUrl("jdbc:h2:mem:cibseven;DB_CLOSE_DELAY=-1")             .setDatabaseSchemaUpdate(ProcessEngineConfiguration.DB_SCHEMA_UPDATE_TRUE) // prevent re-create             .buildProcessEngine();      @RegisterExtension     ProcessEngineExtension extension = ProcessEngineExtension.builder()             .useProcessEngine(inMemProcessEngine)             .build(); } ``` |
```

File: `workflow-engine/src/test/java/com/mgmtp/a12/tutorial/workflow/engine/CustomerOnboardingProcessScriptTaskTest.java`

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 ``` | ``` package com.mgmtp.a12.tutorial.workflow.engine;  import org.cibseven.bpm.engine.ProcessEngine; import org.cibseven.bpm.engine.runtime.ProcessInstanceWithVariables; import org.cibseven.bpm.engine.test.Deployment; import org.junit.jupiter.api.Test; import org.junit.jupiter.params.ParameterizedTest; import org.junit.jupiter.params.provider.ValueSource;  import static org.assertj.core.api.Assertions.assertThat; import static org.assertj.core.api.Assertions.entry;  @Deployment(resources = "bpmn/CustomerOnboardingProcess.bpmn") public class CustomerOnboardingProcessScriptTaskTest extends AbstractProcessEngineTest {      private static ProcessInstanceWithVariables executeAssignSalesRepScriptTask(ProcessEngine processEngine, String customerType) {         return processEngine.getRuntimeService()                 .createProcessInstanceByKey("CustomerOnboardingProcess")                 .startBeforeActivity("assignSalesRepActivity")                 .setVariableLocal("customerType", customerType)                 .executeWithVariablesInReturn();     }      @Test     void givenVip_shouldAssignVipSalesRep(ProcessEngine processEngine) {         // given         String customerType = "vip";          // when         var processInstance = executeAssignSalesRepScriptTask(processEngine, customerType);          // then         assertThat(processInstance.getVariables()).contains(entry("salesRep", "vip@acme.org"));     }      @ParameterizedTest     @ValueSource(strings = { "partner", "lead" })     void givenNonVip_shouldAssignRegularSalesRep(String customerType, ProcessEngine processEngine) {         // when         var processInstance = executeAssignSalesRepScriptTask(processEngine, customerType);          // then         assertThat(processInstance.getVariables()).contains(entry("salesRep", "sales@acme.org"));     }      @ParameterizedTest     @ValueSource(strings = { "inactive", "suspended" })     void givenInactiveOrSuspended_shouldAssignNoSalesRep(String customerType, ProcessEngine processEngine) {         // when         var processInstance = executeAssignSalesRepScriptTask(processEngine, customerType);          // then         assertThat(processInstance.getVariables()).contains(entry("salesRep", null));     } } ``` |
```

### Recommendations

For script tasks, we recommend the following practices:

* Keep scripts lightweight

  + Avoid long-running CPU-intensive operations (use external workers instead)
* Test the isolated script logic in a script language test framework of your choice (e.g. vitest for JS, pytest for Python)
* Test the workflow (incl. script tasks) using CIB 7 testing API in Java
* Do not overuse scripts on listeners. These are hidden in the BPMN model. Instead, use explicit script tasks where possible.
* Avoid inline scripts (even for simple scripts). These are untested and hard-coupled to the BPMN model without proper tooling.

## Conclusion

You have implemented a simple JavaScript script task that handles sales representative assignment.

**Key takeaways:**

* Script tasks are a valid choice for fast-running business logic
* Script tasks allow polyglot programming to some extent

  + However, we recommend minimizing the number of used technologies
* Be sure to test script tasks thoroughly, covering both normal operation and potential error scenarios
* Keep scripts focused and avoid CPU-intensive operations

If something does not seem right, or you got stuck at any point, you can just check out **2025.06-ext5/workflows/task-1-end** to see differences between both implementations.

|  |  |
| --- | --- |
| [« Introduction](https://geta12.com/docs/overall/dev_tutorial_workflows_intro/index.html) | [Task 2: External Workers »](https://geta12.com/docs/overall/dev_tutorial_workflows_external_workers/index.html) |
