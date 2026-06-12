---
source: https://geta12.com/docs/2025.06/ext5/base/base-documentation-bundle/index.html
category: base
docid: base-documentation-bundle
scraped: 2026-06-12
---

# Base

## Introduction

This is the documentation for A12 Base.

Base contains basic A12 libraries with APIs and low level functionality. These libraries are described in the following sections.

## Model API

### Getting Started

The model API library is provided in TypeScript and Java. In TypeScript you can use the library like any other npm package and install it as follows:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm install --save-dev @com.mgmtp.a12.base/base-model-api ``` |
```

The Java library can for example be included in your Maven dependencies like this:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` <dependency> 	<groupId>com.mgmtp.a12.base</groupId> 	<artifactId>base-model-api</artifactId> 	<version>BASE_VERSION</version> </dependency> ``` |
```

### General

This library contains basic model interfaces, that are used for all A12 models, independently of the model type.

Every A12 model consists of a header object, that contains general information like the type, name or version of the model, and a content object.

The structure of the content fully depends on the model type and is therefore not defined in this package.

Please refer to the [API documentation](https://geta12.com/docs/2025.06/ext5/base/base-documentation-bundle/assets/typedoc/index.html) for further information about the provided model interfaces.

## Model Consistency

### Getting Started

The model consistency library can be added to your Maven dependencies as follows:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` <dependency> 	<groupId>com.mgmtp.a12.base</groupId>     <artifactId>base-model-consistency</artifactId> 	<version>BASE_VERSION</version> </dependency> ``` |
```

### General

The library provides interfaces and general functionality to perform consistency checks on A12 models.

The following sections will briefly cover the most important interfaces and classes of the library.

Please refer to the [API documentation](https://geta12.com/docs/2025.06/ext5/base/base-documentation-bundle/assets/typedoc/index.html) for further information about the provided interfaces.

### Model Resolver

A `ModelResolver` can be used to resolve models based on their name.
To write your own `ModelResolver` you need implement a single method `getModel`:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` Optional<Model> getModel(String modelName); ``` |
```

The method takes the model name and returns the model for the given name or empty if the model could not be resolved.
Note, that all models must be identifiable by their name.

### Consistency Categories

Consistency categories indicate which types of problems exist in your model.
The following example shows how you can use the `ConsistencyCategory` interface to implement an enumeration of error codes.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` public enum TestCategory implements ConsistencyCategory { 	SOME_ERROR_1("some.error.1"), 	SOME_ERROR_2("some.error.2");  	private String keyValue;  	TestCategory(final String keyValue) { 		this.keyValue = keyValue; 	}  	@Override 	public String getKeyValue() { 		return keyValue; 	}  	@Override 	public String getLocalizedMessage(final Locale locale, final String keyValue) { 		final String errorMessage = // get localized error message 		return errorMessage; 	} } ``` |
```

These error codes can then be used to create consistency problems by using the `ConsistencyProblem` class.
To create a problem you need to provide the model name, a consistency category, and an object describing the source of the problem.

Additionally, you can also provide a severity for the problem (`Severity.INFO`, `Severity.WARNING` or `Severity.ERROR`) as well as additional parameters.
The additional parameters could contain information about the problematic model element to use it in an error message later.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` Problem problem = new Problem( 	modelName, 	TestCategory.SOME_ERROR_1, 	"problem source string", 	Severity.ERROR, 	// additional parameters here ); ``` |
```

Consistency problems are used in consistency rules to represent the result of a model validation.

### Rules

You can define your own model consistency rules for a specific model type by implementing the generic `ModelConsistencyRule` interface.
The interface consists of a single method `executeRule`, which takes a model of the specified type and returns a list of consistency problems.

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` public interface ModelConsistencyRule<T extends Model> { 	List<Problem> executeRule(T model); } ``` |
```

Rules can be executed in different ways.
They can be executed directly, by calling the `executeRule` method, but it is recommended to execute rules by using the `ConsistencyValidator`.
To provide your rules to the `ConsistencyValidator` you should write a rule provider by implementing the `ModelConsistencyRulesProvider` interface.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` public interface ModelConsistencyRulesProvider<T extends Model> { 	Class<T> modelType(); 	boolean supports(Class<?> clazz); 	List<ModelConsistencyRule<T>> getRules(); } ``` |
```

Every rule provider handles the rules for a specific model type.
The method `supports` should return true if the given class is supported by this provider, i.e. if the corresponding rules can be applied to this class.
If the class is supported, you can retrieve the rules via `getRules`.

#### Consistency Validator

The `ConsistencyValidator` class is the main entry point, that should be used for performing consistency checks for all kinds of A12 models.
It provides two methods to perform a validation:

* `ConsistencyStatus validate(final Model model)`: Perform a consistency check on a single model
* `ConsistencyStatus validateSet(final Collection<Model> models)`: Perform a consistency check on a set of models

Internally, the `ConsistencyValidator` uses all available `ModelConsistencyRulesProvider` implementations to retrieve the relevant rules for a given model.

The constructor takes two arguments - a `ModelResolver` and a list of additional rules, that are not covered by any rule provider.
A minimal example of how to use the `ConsistencyValidator` can be seen below:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` ModelResolver modelResolver = new TestModelResolver(); ConsistencyValidator validator = new ConsistencyValidator(modelResolver, Collections.emptyList());  MODEL_TYPE model = // load your model here ConsistencyStatus statusSingleModel = validator.validate(model);  Collection<MODEL_TYPE> modelCollection = // load your models here ConsistencyStatus statusSetOfModels = validator.validateSet(modelCollection); ``` |
```

The `ConsistencyStatus` object contains the list of problems as well as a boolean flag, which indicates if the validation has been successful or not.
This flag will be set to true if no problems were found during validation.
Otherwise it will be set to false.
All required information can be retrieved via one of the following methods:

* problems()
* isValid()
* isInvalid()
* hasError()

## Breaking Change Management

All base libraries follow the general [A12 breaking change interpretation](https://geta12.com/docs/overall/breaking_change_management).

## Migration Instructions

### 2026.06

#### Breaking Changes

##### Drop Java 17 Support

The Base Java libraries are now compiled with and for Java 21. Support for Java 25 is also guaranteed.

### 2025.06-ext4

#### Deprecation

##### Deep import paths of A12 Base npm packages

Nested imports from the npm packages `@com.mgmtp.a12.base/base-model-api` and `@com.mgmtp.a12.base/base-model-migration-api` (e.g. `@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js`)
are now deprecated in favor of top-level imports to avoid unnecessary breaking changes and reduce ongoing maintenance effort.

The ability to use the old-style ("long") imports will be removed in the next breaking release.

To migrate, first install or update the codemod with your preferred package manager, e.g. with `pnpm`:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` pnpm install -g @com.mgmtp.a12.base/base-codemod ``` |
```

Then run the specific recipe:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` base-codemod preferTopLevel <path to directory with tsconfig.json>  // or as a single command pnpx @com.mgmtp.a12.base/base-codemod preferTopLevel <path to directory with tsconfig.json> ``` |
```

For further details, run the codemod with the `--help` flag.

##### Deprecation of base-parent

The `base-parent` Java artifact has been deprecated.
Please use the new artifact `base-bom` as Gradle Java platform / Maven bom, when you want to manage the versions of used base libraries.

In the new `base-bom`, the versions for apache.commons.lang3 and apache.commons.io are no longer managed compared to `base-parent`.

This was done because apache.commons.lang3 is actually only a runtime dependency of the base libraries, that is currently provided with compile-time scope only by accident.
The apache.commons.io library is not used by any base library at all anymore.

If you use these apache libraries in your project, please add them as direct dependencies with the versions you need.

##### Deprecation of base-bundle

The `base-bundle` Java artifact has been deprecated without replacement.

If you used it as Java-platform / bom in your build setup, please also use the new `base-bom` now.

If you have used it to get access to the bundled base libraries, now please configure the specific base libraries you need as direct dependency.

##### Future Scope Changes of Base Library Dependencies

As a heads-up, in a future breaking release we plan to correct the scope of the following dependencies of the base libraries to better reflect their actual usage:

| base library | dependency | scope change |
| --- | --- | --- |
| base-fs-model-repository | base-model-marshalling | compile-time → runtime |
| apache.commons.lang3 | compile-time → test-time |
| base-model-api | apache.commons.lang3 | compile-time → runtime |
| base-model-consistency | apache.commons.lang3 | compile-time → runtime |
| base-model-marshalling | apache.commons.lang3 | compile-time → dependency will be removed, since it isn’t used here. |

If you use one of these base libraries, you might rely on the fact, that the listed dependencies are currently made available via base at compile-time.
Maybe you use them without declaring them as your own dependencies.
Please consider adding them directly to your dependency configuration now.

### 2025.06

#### Breaking Changes

##### Migration to ESM

The npm artifacts `@com.mgmtp.a12.base/base-model-api` and `@com.mgmtp.a12.base/base-model-migration-api` were migrated from CommonJS to [ESM](https://nodejs.org/api/esm.html#modules-ecmascript-modules).
When using Node `22.12+` and modern build tools, there should be no changes necessary to your bundler setup.

Migrating your own application to ESM is not required, but recommended.
Consult the documentation of your bundler for specifics.

##### Updating to ES2024

The JavaScript output of the npm artifacts was updated from `ES2020` to `ES2024` to be able to use latest language features.
When using supported browsers, there is no change necessary.
If support for older browsers is required, make sure to include necessary polyfills.

##### Drop Java 17 Support

The Base Java libraries are now compiled with and for Java 21.

##### Removed Severity

The deprecated class `com.mgmtp.a12.model.consistency.Severity` has been removed now and can be replaced with `com.mgmtp.a12.model.notification.Severity`.

##### Problem Code Restructuring

The class `com.mgmtp.a12.model.consistency.Problem` was renamed to `com.mgmtp.a12.model.consistency.ConsistencyProblem`.

This was done to allow for a new interface `com.mgmtp.a12.model.consistency.Problem`, which has the `ConsistencyProblem` class as its default implementation.

This interface, resembling the functionality of the former `Problem` class, now extends the interface `com.mgmtp.a12.model.notification.RankedNotification`.

With this, classes implementing the new `com.mgmtp.a12.model.consistency.Problem` interface now have the new property `source` of type Object, which allows to describe the source of the Problem.
Also, for the severity property, the type `com.mgmtp.a12.model.notification.Severity` is used now.

The constructors of `ConsistencyProblem`(former class `Problem`) have been adapted and now require the source as third parameter.

If you referred to `Problem` as type in your code, nothing should change.

If you however extended the former class `Problem` or created new `Problem` instances, you now could use `ConsistencyProblem` and provide the problem source as third constructor parameter.

There is no code mod provided, since we assume there is no wide usage of this code.

##### ConsistencyStatus Converted to Record

The class `com.mgmtp.a12.model.consistency.ConsistencyStatus` was converted to a Java Record.

With this, the getter for the `problems` property is changed from `getProblems()` to just `problems()`.

There is no code mod provided, since we assume internal usage only.
