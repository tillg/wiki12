---
source: https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/index.html
category: data_services
docid: dataservices-documentation-src
scraped: 2026-06-12
---

# Data Services

## Introduction

Data Services specialize on performant, extendable, configurable and scalable data access (documents + links = data). Data Services provide access to all A12 models, including relationship ones.

Data can be accessed in multiple ways:

1. directly via HTTP requests
2. via typescript client: `com.mgmtp.a12.dataservices:dataservices-access`
3. via java client: `com.mgmtp.a12.dataservices:dataservices-client`
4. via command line client: `com.mgmtp.a12.dataservices:dataservices-client-cli`

|  |  |
| --- | --- |
|  | Data Services use Kernel library for data validation, refer to [their documentation](https://geta12.com/docs/kernel/kernel-documentation-dev/index.html#_getting_started_using_code_generated_by_kernel_at_runtime) for more information. |

## Breaking Change Management

### Versioning

[Semantic versioning](https://semver.org) is used.

### How Do We Treat Breaking Changes?

We ensure a thorough evaluation of every modification, scrutinizing its potential impact on system integrity. Our initial strategy involves diligently striving to prevent any disruptive alterations by identifying alternative approaches that can be implemented seamlessly without causing disruptions.

In cases where avoiding a breaking change proves unfeasible or where compelling reasons necessitate a departure from non-breaking practices, we meticulously plan such changes for incorporation into a major release, in accordance with our A12 Versioning Schema.

It’s crucial to note that our minor releases and patch releases adhere to a policy of backward compatibility, meaning they are designed to introduce enhancements without introducing breaking changes. This commitment provides our users with a stable and reliable framework for their ongoing projects.

Employing the A12 deprecation guidelines is a deliberate approach aimed at affording our customers greater flexibility when planning their migration strategies. By following these guidelines, we empower our users to manage transitions smoothly and efficiently.

To ensure transparency and ease of reference, all breaking changes and deprecations are meticulously documented in our [migration notes](#migration-notes). This serves as a comprehensive resource for users navigating these modifications, fostering a clear understanding of the adjustments made during each release.

### What is Public and Internal API?

The Internal API consistently resides within the internal package, with the sole exception being autoconfiguration (found in the autoconfigure module) classes. While these autoconfiguration classes are deemed internal, they are not housed in the internal package.

Anything outside the internal scope is regarded as public and is assured not to undergo changes throughout a single major release version.

### What is Breaking Change?

A change is deemed breaking if:

* Project compilation encounters failure.
* There is a change in application behavior.
* Code adaptation becomes necessary.
* Manual model adaptation is required.

Only happen in Major releases. Migration instructions will always be provided to facilitate easier integration.

### What is Non-Breaking Change?

A change is deemed non-breaking if:

* Migration is provided without necessitating any manual steps from customer projects.
* Modifications occur in the internal API. Please note that migration steps are public, they are considered valid only for the corresponding release line. Therefore, any changes in the next release line are not considered breaking.
* Deprecation events take place.

These occurrences are confined to minor and patch releases.

|  | Breaking | Non-breaking |
| --- | --- | --- |
| **Public API** | * Eliminate public signature * Introduce an incompatible alteration to the public signature * Modify code behavior * Add a public signature to the interface without providing default implementation * For JSON-RPC: Include or modify a mandatory field in the request or remove/change a field in the response | * Providing new public API |
| **Internal** | * Changes of application behaviour which may affect client projects | * All changes preserving the behaviour are considered non-breaking |
| **Configuration** | * Introduce mandatory configuration: Implement a feature that cannot be disabled via configuration. * Remove configuration * Rename configuration * Change the default value for a configuration key * Change the behavior of the configuration | * Introduce a new mandatory configuration key with a default value that maintains the existing behavior. * Integrate a feature that is initially disabled by default * Expand the configuration key by adding a new enumeration value |
| **Server initialization sequence** | * Changes in the order of the initialization sequence. This applies also to the sequence in which events are published * Changes in results of the initialization sequence. No extension points can be removed or changed * Changes in transaction handling * Changes in error handling * Removal of information | * Changes in logging |
| **Dependencies** | * Upgrade to a new major version of A12 dependencies * Upgrade to a new major version of 3rd party dependencies | * Upgrade to a new minor or patch versions of A12 dependencies * Upgrading to a new version of 3rd party libraries involves the execution of integration and regression tests. If the behavior remains satisfactory and the change does not induce modifications to the Public API, we retain the right to upgrade, even to a major version. Such upgrades are typically prompted by security considerations |
| **Other** | * Modifications necessitating re-indexing * Significant performance degradation | * All changes to the DB or search index. |

|  |  |
| --- | --- |
|  | The Data Services team understands that client projects are currently dependent on the DB structure, and therefore we will **try to avoid making any changes to the DB in minor or patch versions**, but we reserve a right to do so if it would be necessary. We also ask client projects to not rely on the DB structure and try to find different solutions because of the future plans. |

### How We Mark Deprecation?

* Identified with @Deprecated (Java) or @deprecated (TypeScript) annotations.
* Accompanied by thorough comments specifying the recommended new version usage.
* Documentation outlining Deprecated APIs will be included in the release notes.
* Scheduled for removal in major releases

### "Only For Usage" and Customizable Interfaces

Within the application, we make extensive use of interfaces. These interfaces serve two primary purposes: some are meant to enhance customization, while others are exclusively designated for usage. To streamline distinction, we have established a simple guideline - if an interface is prefixed with the letter "I", it is meant for implementation; otherwise, it is designed for usage only.

## Environment Setup

### PostgreSQL Setup

This section contains recommendations to configure a PostgreSQL instance.

#### Locale Settings

By default, PostgreSQL will use the so-called "locale provider" provided by the operating system (especially if running PostgreSQL on Linux). This can potentially lead to problems if the corresponding library of the operating system is updated, resulting in differences when comparing text values in the database. Such a change can potentially break (unique) indexes in the database leading to wrong results or even corrupted indexes. Details on this problem can be found in the [PostgreSQL wiki](https://wiki.postgresql.org/wiki/Locale_data_changes).

To avoid problems with the locale provider it is recommended to initialize the PostgreSQL instance (aka ["cluster"](https://www.postgresql.org/docs/current/app-initdb.html)) using the builtin locale provider which will not be affected by updates to the operating system.

This possibility was introduced in PostgreSQL 17 and there are two levels where a built-in provider and locale can be selected.

* When running `initdb` to set up the PostgreSQL instance ("cluster")
* When creating a new database using `CREATE DATABASE`

The collation and collation provider of a database, can *not* be changed, once a database is created.

##### Parameters for initdb

When initializing a new PostgreSQL cluster using `initdb` the default locale and locale provider can be set as a default for all databases. It is recommended to use the UTF-8 encoding.

The following command will initialize a PostgreSQL cluster using the builtin "C.UTF-8" locale which is independent of the locale provider of the operating system.

```
initdb --locale-provider=builtin --builtin-locale="C.UTF-8" -E UTF8 ....
```

It is highly recommended to initialize the cluster with these settings to avoid and problems with databases created in the future.

##### Creating a new database

When creating a new database, the locale and locale provider can be specified:

Creating a new database with builtin locale provider

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` CREATE DATABASE new_database    LOCALE_PROVIDER = builtin    BUILTIN_LOCALE = 'C.UTF-8'; ``` |
```

If the cluster was initialized with e.g. the `libc` provider this will result in an error (*"new locale provider (builtin) does not match locale provider of the template database (libc)"*). In that case, use the `template0` database:

Creating a new database with builtin locale provider using template0

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` CREATE DATABASE new_database    LOCALE_PROVIDER = builtin    BUILTIN_LOCALE = 'C.UTF-8'    TEMPlATE template0; ``` |
```

#### Monitoring

Starting with PostgreSQL 15, the collation version during creation of database objects is tracked.

##### Postgres log file

If there is a mismatch between the collation version used to create a database object and the current version in the operating system, PostgreSQL will log an error message. It is recommended to monitor the PostgreSQL log file for messages that contain:

```
WARNING:  collation "..." has version mismatch
```

The `"…​"` will contain the name of the affected collation.

##### Manual Checking

The version in use and the current version of the operating system’s library can be monitored proactively with the following query [from the PostgreSQL manual](https://www.postgresql.org/docs/current/sql-altercollation.html#SQL-ALTERCOLLATION-NOTES):

The query should be run every for each database, every time updates to the operating system were applied.

Check for collation version mismatches

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` SELECT pg_describe_object(refclassid, refobjid, refobjsubid) AS "Collation",        pg_describe_object(classid, objid, objsubid) AS "Object" FROM pg_depend d   JOIN pg_collation c     ON refclassid = 'pg_collation'::regclass    AND refobjid = c.oid WHERE c.collversion <> pg_collation_actual_version(c.oid) ORDER BY 1, 2; ``` |
```

|  |  |
| --- | --- |
|  | If the above query returns any results, all indexes using such a collation (i.e. those on text/varchar columns) must be rebuilt immediately before continuing to use the system. Otherwise, data loss or corrupt data might be possible. |

The safest option is to run `REINDEX DATABASE;` which rebuilds all indexes in the database, not only those that would require a rebuild. However in an A12 database, nearly all indexes would be affected, so only rebuilding affected indexes might not make a big difference.

To reduce the impact of reindexing, the following query [from the PostgreSQL wiki](https://wiki.postgresql.org/wiki/Locale_data_changes#What_indexes_are_affected) can be used to identify only those indexes that do require a rebuild:

Find indexes that require a rebuild

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` SELECT DISTINCT          indrelid::regclass::text as table_name,          indexrelid::regclass::text as index_name,          collname,          pg_get_indexdef(indexrelid) as index_definition FROM (   SELECT indexrelid, indrelid, indcollation[i] coll   FROM pg_index     CROSS JOIN generate_subscripts(indcollation, 1) g(i) ) s   JOIN pg_collation c ON coll=c.oid WHERE c.collprovider IN ('d', 'c')   AND c.collname NOT IN ('C', 'POSIX') ORDER BY 1,2 ``` |
```

Once all affected indexes are rebuilt, the recorded collation version can be updated using `ALTER DATABASE …​ REFRESH COLLATION VERSION`.

This needs to be done for **every** affected database.

### Hibernate L2C and Spring Cache

DS application uses two caching strategies: Hibernate 2nd Level Cache to optimize database access and reduce load, and Spring’s generic cache for other objects. In practice, all cacheable data is managed by Spring caches, so you may experiment with disabling Hibernate caching to assess performance impact.

Hazelcast manages caching in Data Services. While switching the caching provider at the Spring configuration level is theoretically possible, it is not officially supported or tested. Any alternative implementation and its validation are the responsibility of the implementer.

Needed dependencies (provided by Data Services application):

* `com.hazelcast:hazelcast:5.5.0`
* `com.hazelcast:hazelcast-spring:5.5.0`
* `com.hazelcast:hazelcast-hibernate53:5.2.0`.

#### Hazelcast Cache Eviction Mechanism

Hazelcast cache eviction is governed by the `USED_HEAP_SIZE` policy, which limits the maximum heap memory (in megabytes) allocated per map instance.

|  |  |
| --- | --- |
|  | The `USED_HEAP_SIZE` policy is ineffective when the in-memory format is set to `OBJECT`, as Hazelcast cannot accurately measure the memory footprint of object data. |

By default, Data Services restrict the combined `USED_HEAP_SIZE` for all Hazelcast maps to approximately 200Mb. Ensure your application’s minimum memory allocation accounts for this limit.

The default eviction strategy is Least Frequently Used (`LFU`), combined with the `USED_HEAP_SIZE` max-size policy. If you adjust these settings, thoroughly test to prevent `OutOfMemory` errors and application instability.

Default Hazelcast configuration in [application.properties](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/caching/hazelcast.properties)

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` spring.datasources.dataservices.jpa.properties.hibernate.cache.use_second_level_cache=false spring.datasources.dataservices.jpa.properties.hibernate.cache.use_query_cache=false  spring.cache.type=hazelcast spring.hazelcast.config=classpath:hazelcast.xml spring.hazelcast.instance.name=A12S  spring.datasources.dataservices.jpa.properties.hibernate.cache.region.factory_class=com.hazelcast.hibernate.HazelcastCacheRegionFactory spring.datasources.dataservices.jpa.properties.hibernate.cache.hazelcast.instance_name=A12S ``` |
```

Default Hazelcast configuration in [hazelcast.xml](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/caching/hazelcast.xml)

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 ``` | ``` <?xml version="1.0" encoding="UTF-8"?> <hazelcast xmlns="http://www.hazelcast.com/schema/config" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 		   xsi:schemaLocation="http://www.hazelcast.com/schema/config https://www.hazelcast.com/schema/config/hazelcast-config-5.4.xsd">  	<instance-name>A12S</instance-name>  	<network> 		<join> 			<auto-detection enabled="false"/> 			<multicast enabled="false"/> 			<kubernetes enabled="false"/> 			<gcp enabled="false"/> 			<eureka enabled="false"/> 		</join> 	</network>  	<import resource="hazelcast-caches.xml"/>  </hazelcast> ``` |
```

|  |  |
| --- | --- |
|  | The file `classpath:hazelcast-caches.xml` is provided by the application and contains all needed cache configurations. It includes a default cache configuration with the key `name="default"`. Any cache usage without explicit configuration will apply the default settings. |

Default Hazelcast cache configurations in [hazelcast-caches.xml](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/caching/hazelcast-caches.xml)

```
|  |  |
| --- | --- |
| ```   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49  50  51  52  53  54  55  56  57  58  59  60  61  62  63  64  65  66  67  68  69  70  71  72  73  74  75  76  77  78  79  80  81  82  83  84  85  86  87  88  89  90  91  92  93  94  95  96  97  98  99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127 128 129 130 131 132 133 134 135 ``` | ``` <?xml version="1.0" encoding="UTF-8"?> <hazelcast xmlns="http://www.hazelcast.com/schema/config" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 		   xsi:schemaLocation="http://www.hazelcast.com/schema/config https://www.hazelcast.com/schema/config/hazelcast-config-5.4.xsd">  	<map name="default"> 		<statistics-enabled>true</statistics-enabled> 		<time-to-live-seconds>1200</time-to-live-seconds> 		<eviction size="4" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 		<backup-count>0</backup-count> 		<async-backup-count>0</async-backup-count> 	</map>  	<map name="validationCache"> 		<time-to-live-seconds>3600</time-to-live-seconds> 		<eviction size="20" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 		<backup-count>0</backup-count> 		<async-backup-count>0</async-backup-count> 	</map>  	<map name="securedModelReadCache"> 		<time-to-live-seconds>36000</time-to-live-seconds> 		<eviction size="15" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 		<backup-count>0</backup-count> 		<async-backup-count>0</async-backup-count> 	</map>  	<map name="com.mgmtp.a12.dataservices.model.GenericModel"> 		<time-to-live-seconds>36000</time-to-live-seconds> 		<eviction size="5" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 		<backup-count>0</backup-count> 		<async-backup-count>0</async-backup-count> 	</map>  	<map name="com.mgmtp.a12.kernel.md.model.api.IDocumentModel"> 		<time-to-live-seconds>36000</time-to-live-seconds> 		<eviction size="5" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 		<backup-count>0</backup-count> 		<async-backup-count>0</async-backup-count> 	</map>  	<map name="com.mgmtp.a12.dataservices.relationship.model.RelationshipModel"> 		<time-to-live-seconds>36000</time-to-live-seconds> 		<eviction size="5" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 		<backup-count>0</backup-count> 		<async-backup-count>0</async-backup-count> 	</map>  	<map name="com.mgmtp.a12.dataservices.cdd.jms.internal.ComposeDocumentModel"> 		<time-to-live-seconds>36000</time-to-live-seconds> 		<eviction size="10" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 		<backup-count>0</backup-count> 		<async-backup-count>0</async-backup-count> 	</map>  	<map name="documentModelIndexedFieldsCache"> 		<time-to-live-seconds>0</time-to-live-seconds> 		<eviction size="5" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 		<backup-count>0</backup-count> 		<async-backup-count>0</async-backup-count> 	</map>  	<map name="documentModelIsIndexedFieldCache"> 		<time-to-live-seconds>0</time-to-live-seconds> 		<eviction size="10" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 		<backup-count>0</backup-count> 		<async-backup-count>0</async-backup-count> 	</map>  	<map name="modelGraphCache"> 		<time-to-live-seconds>86400</time-to-live-seconds> 		<eviction size="5" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 	</map>  	<map name="modelSubTypesMapCache"> 		<time-to-live-seconds>86400</time-to-live-seconds> 		<eviction size="5" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 		<backup-count>0</backup-count> 		<async-backup-count>0</async-backup-count> 	</map>  	<map name="userCache"> 		<time-to-live-seconds>0</time-to-live-seconds> 		<eviction size="5" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 	</map>  	<map name="tokenCache"> 		<time-to-live-seconds>86400</time-to-live-seconds> 		<eviction size="1" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 	</map>  	<map name="roleMapping"> 		<time-to-live-seconds>86400</time-to-live-seconds> 		<eviction size="4" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 	</map>  	<map name="com.mgmtp.a12.dataservices.document.internal.entity.DocumentEntity"> 		<time-to-live-seconds>3600</time-to-live-seconds> 		<eviction size="50" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 		<backup-count>0</backup-count> 		<async-backup-count>0</async-backup-count> 	</map>  	<map name="com.mgmtp.a12.dataservices.relationship.persistence.internal.jpa.entity.RelationshipLinkEntity"> 		<time-to-live-seconds>3600</time-to-live-seconds> 		<eviction size="20" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 		<backup-count>0</backup-count> 		<async-backup-count>0</async-backup-count> 	</map>  	<map name="com.mgmtp.a12.dataservices.relationship.persistence.internal.jpa.entity.RelationshipRoleEntity"> 		<time-to-live-seconds>3600</time-to-live-seconds> 		<eviction size="20" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 		<backup-count>0</backup-count> 		<async-backup-count>0</async-backup-count> 	</map>  	<map name="com.mgmtp.a12.dataservices.model.persistence.internal.jpa.entity.ModelEntity"> 		<time-to-live-seconds>0</time-to-live-seconds> 		<eviction size="15" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 		<backup-count>0</backup-count> 		<async-backup-count>0</async-backup-count> 	</map>  	<map name="com.mgmtp.a12.dataservices.model.persistence.internal.jpa.entity.ModelHeaderEntity"> 		<time-to-live-seconds>0</time-to-live-seconds> 		<eviction size="5" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 		<backup-count>0</backup-count> 		<async-backup-count>0</async-backup-count> 	</map> 	<map name="com.mgmtp.a12.dataservices.query.indexing.internal.persistence.entity.ModelFieldEntity"> 		<time-to-live-seconds>0</time-to-live-seconds> 		<eviction size="20" eviction-policy="LFU" max-size-policy="USED_HEAP_SIZE"/> 	</map>  </hazelcast> ``` |
```

#### Hazelcast Data Persistency

By default, Hazelcast enables synchronous backups for cached data (`<backup-count>1</backup-count>`), which impacts performance due to required data serialization and blocking thread transfers between nodes.

In Data Services, caching is used solely for performance, not persistence. Therefore, all backups for cached data are disabled to maximize throughput:

Disabling Hazelcast backups in hazelcast-caches.xml

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` <backup-count>0</backup-count> <async-backup-count>0</async-backup-count> ``` |
```

To restore the default behavior, set `<backup-count>1</backup-count>`, noting the negative impact on performance. Alternatively, enable asynchronous backups with `<async-backup-count>1</async-backup-count>` to avoid blocking.

### Java BIO / NIO / NIO2 / APR

BIO (Blocking I/O):

* Stream-oriented, assigns a thread per request, blocks during read/write.
* Simple and easy to use.
* Blocks file access during operations, no support for virtual files or symbolic links.

NIO (Non-blocking I/O):

* Buffer-oriented, uses channels and selectors for concurrent access.
* Supports asynchronous operations and better performance for large/many files.
* Less efficient for small files due to cache orientation.

NIO2:

* Extends NIO with advanced file and directory management (Path, FileSystem, FileStore).
* Recommended for complex directory/file operations.

APR (Apache Portable Runtime):

* Native library for enhanced performance and scalability, often used with Tomcat.
* Relevant for high-performance scenarios.

#### Usage

* Tomcat uses NIO protocol by default.
* To enable NIO2: set protocol to `org.apache.coyote.http11.Http11Nio2Protocol`.

#### Performance

* For small files (\<1 MB): BIO (100%) > NIO2 (109%) > NIO (190%).
* NIO is cache-oriented, so slower for small files; NIO2 improves file management.
* For large files: NIO outperforms BIO and NIO2 due to better concurrency.

#### Recommendation

* Use BIO for simple, blocking file access (DS recommends this setup).
* Use NIO for scalable, concurrent file operations.
* Use NIO2 for advanced file management.
* Consider APR for native performance needs.

### Manual Database Setup

Normally, this step is done automatically by the server, but in case you want to execute it manually e.g. as a different user, you can execute steps to install and update the database manually.

|  |  |
| --- | --- |
|  | This will not generate scripts that can be run against any database without modification. This only provides queries from the Liquibase migration scripts.  These scripts contain `preconditions` which are evaluated during runtime, and based on the result of these preconditions the query is either executed or not. These preconditions cannot be expressed in the generated scripts without Liquibase. |

#### Prerequisites

1. You have to have Liquibase command line tool version 4.33.0 available. Be careful about the version. Different versions of Liquibase are not interchangeable.
   You can download it here: <https://github.com/liquibase/liquibase/releases/tag/v4.33.0>. Download `liquibase-4.33.0.zip` and unzip it to a directory of your choice, let’s say `/tmp/a12dataservices_db/`.
2. You have to have Data Services artifact: `dataservices-server-app-38.4.2-fatjar.jar`.

   Unpack dataservices-core jar, Quartz jar, and DB driver from artifact.

```
jar xf dataservices-server-app-38.4.2-fatjar.jar BOOT-INF/lib/
mv BOOT-INF/lib/dataservices-core-38.4.2.jar BOOT-INF/lib/quartz-2.5.0.jar BOOT-INF/lib/postgresql-42.7.7.jar .
```

Now you should have in your directory (`/tmp/a12dataservices_db/`)

* the liquibase distribution (`liquibase`, liquibase.jar`),
* the dataservices-core jar (`dataservices-core-38.4.2.jar`),
* the Quartz jar(`quartz-2.5.0`), and
* the DB driver (`postgresql-42.7.7.jar`).

You can delete `BOOT-INF` now.

#### Running DB Upgrade

* To install or upgrade DB structure for Data Services, run

```
./liquibase --classpath dataservices-core-38.4.2.jar:quartz-2.5.0.jar:postgresql-42.7.7.jar --changeLogFile=database/project_model.xml --url jdbc:postgresql://localhost:5432/DB_NAME --username DB_USER --password DB_PASSWORD update
```

* If you just want to get update SQL run

```
./liquibase --classpath dataservices-core-38.4.2.jar:quartz-2.5.0.jar:postgresql-42.7.7.jar --changeLogFile=database/project_model.xml --url jdbc:postgresql://SERVER_HOST:5432/DB_NAME --username DB_USER --password DB_PASSWORD updateSQL
```

The `--changeLogFile=database/project_model.xml` is always the same as it points to path inside `dataservices-core-38.4.2.jar`.

For detailed help you can run `./liquibase` without parameters to see available commands, options and examples. Additionally, refer to the [Liquibase documentation](https://www.liquibase.org/get-started) for the detailed information.

#### Possible Problems

##### Database Lock

Liquibase would run its migration only once. It handles this by creating a lock in the table `DATABASECHANGELOGLOCK`.

If the application is killed during a Liquibase migration, it may happen that the lock is not released,
so that the application can show "Waiting for changelog lock…​." for an indefinite time in the logs.

To solve this, you can run the following SQL command against the database:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` UPDATE DATABASECHANGELOGLOCK SET LOCKED=0, LOCKGRANTED=null, LOCKEDBY=null where ID=1; ``` |
```

|  |  |
| --- | --- |
|  | Depending on the DBMS, you may need to replace LOCKED=0 with LOCKED=FALSE. |

See more: <https://stackoverflow.com/questions/15528795/liquibase-lock-reasons>

### Spring Actuator Support

Spring Actuator provides endpoints that expose runtime application details such as health, metrics and configuration.

All standard Spring Actuator endpoints are supported in this application. Endpoints are secured using access rights, configurable by name. You can assign existing access rights or define custom ones as needed.

By default, all actuator endpoints (`/actuator/*`) require authentication. Specific endpoints can be made public through configuration (see [Actuator properties](#actuator-properties)).

Endpoints can also be remapped to a custom root path or exposed on a different port.

#### Initialization Finished Health Indicator

The server has a custom health indicator, which can be checked at `/actuator/health` or at `actuator/health/initializationFinished`. This indicator gives information about whether the server initialization is finished or not.

Example response from 'GET /actuator/health'

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 ``` | ``` {     "status": "UP",     "components": {         "db": {             "status": "UP",             "details": {                 "database": "H2",                 "validationQuery": "isValid()"             }         },         "diskSpace": {             "status": "UP",             "details": {                 "total": 511091388416,                 "free": 294934315008,                 "threshold": 10485760,                 "exists": true             }         },         "ping": {             "status": "UP"         },         "initializationFinished": {             "status": "UP",             "details": {                 "dataServicesInitialization": "Finished"             }         }     } } ``` |
```

In this case, in the JSON, `components.initializationFinished.status` equals `UP` means initialization is finished. Otherwise, the initialization is not finished yet.

Example response from 'GET /actuator/health/initializationFinished'

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` {     "status": "UP",     "details": {         "dataServicesInitialization": "Finished"     } } ``` |
```

In this case, the JSON returned is only about the desired endpoint `initializationFinished`, where the `status` property already tells you whether the initialization is finished (`UP`) or not.

Check [Configuration options](#actuator-properties) for instructions on how to configure an actuator.

#### Configuration of Actuator Endpoint

The configuration actuator provides information about the currently applied configuration on the running DS server.
The actuator is accessible via GET request to the `/actuator/configuration` resource.

This actuator gives information on configuration changes and on warnings concerning the configuration of the Data Services server.

To enable this endpoint, provide the properties below:

Enable configuration actuator endpoint

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` management.endpoints.web.exposure.include="configuration" management.endpoint.configuration.enabled=true ``` |
```

Example response from 'GET /actuator/configuration'

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 ``` | ``` {     "changes": {         "mgmtp.a12.dataservices.documents.validation.skipForModels": {             "current": "[SkippedValidationModel]",             "default": "null"         },         "mgmtp.a12.dataservices.jsonRpc.spel.enabled": {             "current": "true",             "default": "false"         },         "mgmtp.a12.dataservices.initialization.import.models.overwrite.models": {             "current": "{DomainProduct=false, DomainBrand=false}",             "default": "null"         }     },     "warnings": [] } ``` |
```

The `/actuator/configuration/changes` endpoint will print a list of all configuration changes, so you can compare this list with the output of the previous version.

Example response from 'GET /actuator/configuration/changes'

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 ``` | ``` {     "changes": {         "mgmtp.a12.dataservices.documents.validation.skipForModels": {             "current": "[SkippedValidationModel]",             "default": "null"         },         "mgmtp.a12.dataservices.jsonRpc.spel.enabled": {             "current": "true",             "default": "false"         },         "mgmtp.a12.dataservices.initialization.import.models.overwrite.models": {             "current": "{DomainProduct=false, DomainBrand=false}",             "default": "null"         }     } } ``` |
```

With the help of the `/actuator/configuration/warnings` endpoint possible problems of your current configuration are reported.

##### Extending the Configuration Endpoint With Custom Properties

|  |  |
| --- | --- |
|  | Refer to the [DS examples section](#data-services-examples) for an example of adding a custom configuration to the actuator endpoint. |

It is possible to make the actuator endpoint scan your custom configuration (together with its default values) so any changes to it will be reported in `/actuator/configuration/changes`.
To enable this feature, you need to map your configuration keys and its default values to the Java class using the [ConfigurationProperties](https://docs.spring.io/spring-boot/3.5.9/reference/features/external-config.html#features.external-config.typesafe-configuration-properties) annotation. Then, simply annotate your class by `@ExposePropertiesToActuator` annotation provided by Data Services to expose it to the actuator.

Example:

Expose custom configuration properties to actuator

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` @ExposePropertiesToActuator @ConfigurationProperties("customProperties") public class CustomConfigurationProperties { 	// custom configuration keys  } ``` |
```

## Initialization Phase

|  |  |
| --- | --- |
|  | Refer to [DS examples section](#data-services-examples) for an example of custom initialization. |

Data Services uses multiple persistence stores that need to be synchronized. Synchronization between search index, database and other parts can be achieved in 2 ways:

1. Using `initialization` phase of `dataservices-server-app`

   * This option is mainly used for development and demonstration purposes.
2. Using `dataservices-server-init-app`

   * For production purposes it is not desired to run `initialization` phase every time the server is started. For those purposes, Data Services provide initialization/migration application. This application can be used from migration/development scripts.

### Initialization Sequence

Even though `initialization` sequence is enabled by default, we recommend to disable it for the production environments and move all migration and initialization logic to `dataservices-server-init-app` instead.
Initialization sequence is the same in both for `dataservices-server-server-app` and `dataservices-server-init-app`.

Table 1. Initialization sequence


| Step | Fail on error | Intended use | Trigger |
| --- | --- | --- | --- |
| Database migration | yes | Should be run just in case of database changes. It can be executed multiple times because it remembers previous runs. | Triggered by unexecuted changesets from Liquibase |
| Model import | yes | Should be run just in case of models change or for the first time. | Triggered by configuration key `mgmtp.a12.dataservices.initialization.import.models.path` by pointing to the path where are the models located. |
| Data migration | yes | Migration by `MigrationSteps` extension points. It can run multiple times because it remembers previous runs. | Existence of the `MigrationStep` implementation that was not executed yet or marked as always to be executed |
| Index synchronization | yes, but documents which cannot be deserialized will be ignored. Only other errors will fail the process | Should be executed just in case the index and the DB are not in sync. This scenario is very unlikely since index is a set of Database tables as well. It might happen when manual changes in the documents have been done while index update was not executed. | Triggered by configuration key `mgmtp.a12.dataservices.query.reindexing.mode` |
| Custom initialization logic | yes | Depends on custom code. | [`DataServicesCustomInitializationEvent`](#event_com.mgmtp.a12.dataservices.initialization.events.dataservicescustominitializationevent) |
| Execution of custom JSON-RPC requests | yes | Depends on custom code. May be used e.g. for document import. |  |

All the steps mentioned above ignore security because security can only be applied once all models and documents are accessible from the database and from the search engine.

Every step from the table above is executed in its own transaction and is committed right after the step passes.

Keep in mind that Database migration and security is initialized on `ContextRefreshedEvent`.
This event is not fired automatically but must be thrown manually. We do it during initialization:

Example of starting Spring application with initialization

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` final SpringApplication application = new SpringApplication(ServerApplication.class); application.run(args).start(); ``` |
```

In case that you initialize your application manually you have to call `start()` method on application context explicitly.

#### Database Migration

Database migration is done using [Liquibase](https://www.liquibase.org). You can see all defined changesets in the `dataservices-core/src/main/resources/database/project_model.xml`

#### Model Import

This phase allows importing models to the server before any other code will be executed.

If the models are already uploaded in a proper version, please point beneath-mentioned configuration properties to empty directories so no unnecessary model overwriting will be done.

Models will be preloaded by enabling `mgmtp.a12.dataservices.initialization.import.models.enabled` and setting `mgmtp.a12.dataservices.initialization.import.models.path`. This property contains comma separated list of paths where Models will be searched. Base path could be in one of the forms:

`classpath:/SOMEPATH`

Models are searched in the classpath of the server from the base of SOMEPATH.

`file:/SOMEPATH`

Models are searched in the filesystem from the base of SOMEPATH.

`file:/SOMEPATH/SOMEFILE.zip`

Models are searched in the zip file SOMEFILE.zip.

Example: `mgmtp.a12.dataservices.initialization.import.models.path=classpath:/businessmodels,file:/usr/local/share/businessmodels,file:/usr/local/share/businessmodels.zip`

Includes in document models are resolved on load and can be either name reference of a model in the database or a name reference of a model in the bulk.
Bulk means the set of document models in one base path or archive.

It is possible to set rules for model overwriting.
See `mgmtp.a12.dataservices.import.models.*` properties in [model overwriting section](#model-overwriting-configuration).

|  |  |
| --- | --- |
|  | Changing of the model type is not permitted during the model import, `IntegrityException` with message `Changing of model [MODEL_NAME] type is not permitted` will be thrown. |

##### Full Model Import

Full model import provides an option to delete all models stored in a database.
It can be used in case of changing specific model type as changing of model types is not allowed by Data Services.
We allow to delete models of specific type by providing list of model types that should be deleted from a database.

Example configuration for full model import

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` //For deleting all models: --mgmtp.a12.dataservices.initialization.import.models.typesToClear=*  //For deleting specific models: --mgmtp.a12.dataservices.initialization.import.models.typesToClear=modelType1,modelType2 ``` |
```

|  |  |
| --- | --- |
|  | Bulk of document models for importing must be encoded with UTF-8 charset, otherwise unexpected characters will be displayed instead. |

|  |  |
| --- | --- |
|  | Please be aware of adding JVM argument `-Dfile.encoding=utf-8` when running Data Services application by using JAR artifact, this argument is mandatory for the application to handle file encoding properly. |

#### Data Migration

One of the very first initialization steps is the migration.
More information can be found on [migration page](#data-migration-support).

#### Index Synchronization

DS is using custom database tables to store the documents redundantly for search purposes. These tables are automatically updated by the Data Services core when documents are created, updated or deleted. However, in some cases it is necessary to synchronize the search index with the database. There are configuration options available to rebuild the search index from the database. For more info please see [query configuration options](#query-configuration) documentation for further information.

### Custom Logic

#### DataServicesCustomInitializationEvent

A custom logic can be triggered during the server initialization by [`DataServicesCustomInitializationEvent`](#event_com.mgmtp.a12.dataservices.initialization.events.dataservicescustominitializationevent). It is fired after the server initialization is done but before JSON-RPC initializer is executed.

#### ContextRefreshedEvent

If you need to have a listener for the Spring’s `ContextRefreshedEvent`, be aware that our `DataServicesInitializationListener` has `@Order` with value `100`. So, put the `@Order` value on your listener to be less than 100 if you want it to be handled before the `DataServicesCoreInitializationListener`.

### Execution of Custom JSON-RPC Requests

During server initialization phase any JSON-RPC request can be executed.

This feature needs to be activated using the property `mgmtp.a12.dataservices.initialization.scripts.jsonRpc.enabled=true`.

JSON-RPC requests may be located in any path specified via `mgmtp.a12.dataservices.initialization.scripts.jsonRpc.paths`. Files are executed in ascending order by file name.

Since custom JSON-RPC requests are executed after model import during initialization phase, they can be used e.g. for document import using the `ADD_DOCUMENT` RPC method.

#### Validation Code Cache Preloading

All document models stored in the persistent store will be asynchronously loaded to the cache after the server `initialization` phase is finished. This is done to improve the performance of the first requests to the server. Cache preloading is triggered by `DataServicesInitializationFinishedEvent`.

It is possible to disable cache preloading for certain (or all models) by configuration key `mgmtp.a12.dataservices.initialization.preCompile.enabledForModels`

### Cluster-safe Configuration

The initialization sequence of the server is by default enabled. All initialization steps are therefore performed during every server initialization, which might cause issues during restarts of production servers (restart of servers should not result in importing models or migration of database, etc).

In special cases you may want to split the initialization sequence of the application and common application runtime (e.g. with clusters, where the initialization steps should
be performed just once and runtime workers should just run and handle requests).

In such cases you can run init application (you can find it in the `dataservices-server-init-app`) to perform the `initialization` steps and then configure server workers to bypass the `initialization` steps. For example:

Example configuration to disable initialization sequence

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` # Disable initialization of database schema import spring.liquibase.enabled=false  # Disable initialization data import mgmtp.a12.dataservices.initialization.import.models.enabled=false mgmtp.a12.dataservices.initialization.import.documents.enabled=false mgmtp.a12.dataservices.initialization.migration.enabled=false ``` |
```

For more convenient configuration please consider using [cluster configuration profile](#spring-profile-dataservices-cluster).

## Configuration

|  |  |
| --- | --- |
|  | Refer to the [DS examples section](#data-services-examples) for an example of DS configuration. |

Data Services are using Spring for all configuration needs. All Data Services configuration keys start with the `mgmtp.a12.dataservices` prefix.

DS is a multi-module project, so we defined the following rule: **Configuration from higher modules should be able to override configuration from lower modules**.

Our default configuration is defined in property files prefixed with `data_services` and is by default applied via `@PropertySource` annotations which makes it overridable by `application.properties` or other alternatives.
For more information, see the [Spring documentation](https://docs.spring.io/spring-boot/3.5.9/reference/features/external-config.html).

Exceptions are the following modules:

* dataservices-core-tooling
* dataservices-client-cli

For these modules, using `application.properties` in a root of resources folder to configure them is not possible, it will result in a bad property ordering. Please, place your `application.properties` under `config` directory which will give your properties required precedence.

For more convenient configuration please see [Configuration Profiles](#configuration-profiles).

|  |  |
| --- | --- |
|  | Spring Boot allows flexible naming when binding environment or properties values: you don’t have to match names exactly the property name (e.g. `firstName`) — alternative forms like `first-name`, `first_name`, uppercase variants, etc. are all accepted. For more information, see the [Spring documentation](https://docs.spring.io/spring-boot/3.5.9/reference/features/external-config.html#features.external-config.typesafe-configuration-properties.relaxed-binding). |

### Configuration Options

#### Permanent Configuration

This configuration keys are required for Data Services to run normally and thus should not be changed.

`liquibase.changeLog` = `classpath:/database/project_model.xml`
:   Liquibase change log configuration

`spring.data.jpa.repositories.enabled` = `true`
:   Spring JPA repositories switch.

`spring.datasources.dataservices.jpa.hibernate.ddlAuto` = `none`
:   Database schema generation

#### Changeable Configuration

This block of configuration options focuses on database connections:

`spring.datasources.dataservices.url` = `jdbc:postgresql://localhost:5432/a12database`
:   Database connection string

`spring.datasources.dataservices.name` = `postgresql`
:   Database name

`spring.datasources.dataservices.username` = `username`
:   Username for database connection

`spring.datasources.dataservices.password`
:   Password for database connection

You can define your own Liquibase migration datasource by providing a bean with LiquibaseDatasource annotation like:

Example of custom Liquibase migration datasource

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` @LiquibaseDataSource @Bean public DataSource dsMigrationDataSource(Object... params) { 	// your implementation } ``` |
```

If custom liquibase migration datasource is not provided, this block of configuration options focuses on liquibase datasource for database migration:

`spring.datasources.dataservices.liquibase.url`
:   The database connection string to apply liquibase migration, if this property is provided, the following **user** and password below are required, if not this connection will be ignored and Data Services datasource will be applied instead.

`spring.datasources.dataservices.liquibase.user`
:   The username which liquibase will use on behalf, while performing migration, if this property is provided but above liquibase **url** is missing then Data Services **url** will be used instead.

`spring.datasources.dataservices.liquibase.password`
:   The password of liquibase **user**

`spring.datasources.dataservices.liquibase.driver-class-name`
:   Database driver

There are additional tuning properties depending on the connection pool implementation. By default, Spring (and thus Data Services) uses `com.zaxxer.hikari.HikariDataSource`.

`spring.datasources.dataservices.hikari.connectionTimeout` = `30000` *(30 seconds)*
:   See the [Hikari FAQ](https://github.com/brettwooldridge/HikariCP#frequently-used)

|  |  |
| --- | --- |
|  | If another connection pool implementation should be used (i.e., if client project overrides `spring.datasource.type` property), configuration of DataSources (for DataServices and ContentStore) need to be provided also by client project. |

`spring.quartz.properties.org.quartz.jobStore.driverDelegateClass` = *Spring managed*
:   Spring target should be auto-detected, but this is not working for Postgres,
    so it is more secure to configure DB type for Quartz manually. It should be class of type `org.quartz.impl.jdbcjobstore.StdJDBCDelegate` (one of
    `org.quartz.impl.jdbcjobstore.StdJDBCDelegate`, `org.quartz.impl.jdbcjobstore.PostgreSQLDelegate`,).

For more convenient configuration please consider using [postgres](#spring-profile-dataservices-external_postgres) configuration profiles.

If the connection to the database server is lost, after `connectionTimeout`, Data Services server starts to respond with server error until the connection is restored.
Then it continues to respond to HTTP requests regularly.

### Cache Configuration

By default, the cache is enabled by the following properties:

`spring.datasources.dataservices.jpa.properties.hibernate.cache.useSecondLevelCache` = `true`
:   Enables use of second level cache.
    Data Services performance is dependent on this cache. Therefore, using this feature is recommended.

`spring.datasources.dataservices.jpa.properties.hibernate.cache.useQueryCache` = `false`
:   Database queries are not cached currently.
    DataServices performance relies on avoiding of DB queries rather than caching them.

`spring.datasources.dataservices.jpa.properties.hibernate.cache.region.factoryClass` = `org.hibernate.cache.jcache.JCacheRegionFactory`
:   Please note that no other Factory class has been tested.

`spring.datasources.dataservices.jpa.properties.hibernate.javax.cache.provider` = `org.ehcache.jsr107.EhcacheCachingProvider`
:   EHCache JSR107 integration. See [ehcache documentation](https://www.ehcache.org/documentation/3.0/107.html).

`spring.cache.jcache.config` = `classpath:ehcache.xml`
:   Allows to change EHCache configuration.
    Please keep in mind that the *ehcache.xml* must contain cache regions defined in the code.

Data Services is using `Hazelcast` as a default cache provider for its replication options and cloud support. No other cache providers are tested.

#### Custom Caches

`mgmtp.a12.dataservices.cache.modelGraph.enabled` = `true`: *boolean*
:   Switch on for better production performance for LIST\_\* operations.

The Data services server uses Database and Search index to store documents.

### Query Configuration

Query is configured with the following configuration properties:

`mgmtp.a12.dataservices.query.aggregation.defaultPrecision` = `2`: *int*
:   Default precision for aggregation functions.

`mgmtp.a12.dataservices.query.aggregation.listSize` = `10`: *int*
:   Fixed page size for aggregation endpoint. In aggregation endpoint it is not possible to have pagination, so this value is used to limit the number of results returned.

`mgmtp.a12.dataservices.query.disabledOperators` = empty list: *java.util.List<java.lang.String>*
:   List of disabled operators. If a query contains one of the disabled operators, an `InvalidInputException` is thrown.
    Possible values are:

    * and
    * or
    * not
    * exact\_match
    * simple\_search
    * has
    * undefined match
    * date\_range
    * datefragment\_range
    * double\_range

`mgmtp.a12.dataservices.query.exactMatch.enumerationValueMatch.enabled` = `false`: *boolean*
:   Enumeration value matching is only performed if the Accept-Language header is absent in the request.
    If the header is present, exact matching for enumeration values is disabled by default.
    This property enables additional matching for enumeration values when the header is provided.
    If enabled, matching will occur on both the provided language and the enumeration value.

    Note: Enabling this will negatively impact performance for all queries using the `exact_match` operator on enumeration fields.

`mgmtp.a12.dataservices.query.exactMatch.maxInputValueLength` = : *int*
:   The maximum allowed length (in characters) for an input value
    provided in a `exact_match` operation.
    This limit helps to prevent excessively long inputs that could
    negatively impact PostgreSQL regular expression search.
    Any input value exceeding this configured length will result in an error
    response from the API.

`mgmtp.a12.dataservices.query.maxAndOperands` = `1000`: *int*
:   Hard limit for the number of operands of an `or` operator. If this limit is exceeded, an `InvalidInputException` is thrown.

`mgmtp.a12.dataservices.query.maxAndOperators` = `1000`: *int*
:   Hard limit for the number of `and` operators per query. If this limit is exceeded, an `InvalidInputException` is thrown.

`mgmtp.a12.dataservices.query.maxLinksSize` = `10_000`: *int*
:   Hard limit for the result of each `links` section. If this limit is exceeded, an `InvalidInputException` is thrown.

`mgmtp.a12.dataservices.query.maxOrOperands` = `1000`: *int*
:   Hard limit for the number of operands of an `or` operator. If this limit is exceeded, an `InvalidInputException` is thrown.

`mgmtp.a12.dataservices.query.maxOrOperators` = `1000`: *int*
:   Hard limit for the number of `or` operators per query. If this limit is exceeded, an `InvalidInputException` is thrown.

`mgmtp.a12.dataservices.query.maxQueryDepth` = `10`: *int*
:   Hard limit for query depth. If this limit is exceeded, an `InvalidInputException` is thrown.

`mgmtp.a12.dataservices.query.pageRequest.pageNumberLimit` = `100`: *int*
:   Hard limit for query page number. If this limit is exceeded, an `InvalidInputException` is thrown.

`mgmtp.a12.dataservices.query.pageRequest.pageSizeLimit` = `100`: *int*
:   Hard limit for query page size. If this limit is exceeded, an `InvalidInputException` is thrown.

`mgmtp.a12.dataservices.query.reindexing.applyToModels` = `*` meaning that all models are considered: *java.util.List<java.lang.String>*
:   A list of model names to which the reindexing operation will be applied.
    Setting the value to "\*" permits all existing models. Note: If "\*" isn’t the only string in the list, no special meaning will be applied.

`mgmtp.a12.dataservices.query.reindexing.batchSize` = `2_000`: *int*
:   Number of documents to reindex in a single batch. Batches are processed in parallel in #numberOfThreads threads.

`mgmtp.a12.dataservices.query.reindexing.ignoreErrors` = `false`: *boolean*
:   A switch to allow ignoring errors during re-indexing. If an error occurs, it will be logged,
    but the server initialization will continue without interruption.

    |  |  |
    | --- | --- |
    |  | DS by default skips documents that can not be deserialized during reindexing. This property does not change this behavior. |

`mgmtp.a12.dataservices.query.reindexing.mode` = `DISABLED`: *enum*
:   A switch that allows index manipulation operations to be performed during the DS initialization.

    Possible values:

    * `REBUILD_INDEX`: Deletes the complete content of the index and reconstructs it based on the current documents in the system.
    * `INDEX_NEW_ONLY`: Indexes only the documents that have not been indexed yet.
    * `DISABLED`: No index operations are performed on initialization.

    Note that it is possible to control indexing on per-model basis using `mgmtp.a12.dataservices.query.reindexing.applyToModels` property.

`mgmtp.a12.dataservices.query.reindexing.modelFields.enabled` = `true`: *boolean*
:   Controls whether the `model index fields` should be re-indexed.

`mgmtp.a12.dataservices.query.reindexing.numberOfThreads` = `5`: *int*
:   Number of threads to use for reindexing.

`mgmtp.a12.dataservices.query.reindexing.vacuum.enabled` = `true`: *boolean*
:   Controls whether the `VACUUM ANALYZE` should be executed after index rebuild.

`mgmtp.a12.dataservices.query.simpleSearch.excludingMetadata.enabled` = `false`: *boolean*
:   Whether to exclude metadata from the search

`mgmtp.a12.dataservices.query.simpleSearch.maxInputValueLength` = : *int*
:   The maximum allowed length (in characters) for an input value
    provided in a `simple_search` operation.
    This limit helps to prevent excessively long inputs that could
    negatively impact PostgreSQL regular expression search.
    Any input value exceeding this configured length will result in an error
    response from the API.

`mgmtp.a12.dataservices.query.simpleSearch.minSearchableTokenSize` = `3`: *int*
:   The minimum size of a token that can be included in the search. Tokens smaller than this size will be ignored in the search process.
    A value less than 3 is not recommended because it can degrade performance by increasing the number of irrelevant matches.

`mgmtp.a12.dataservices.query.validation.enabled` = `true`: *boolean*
:   This is a switch to enable/disable query validation. Please read documentation about validation phase of
    Query API. This property should not be used in productional environments there are performance and security
    concerns. In version 39.0.0 we will change a default value of this property to `false`.

`mgmtp.a12.dataservices.client.configuration.query.scanPackages` = Data Services package: com.mgmtp.a12.dataservices: *java.util.List<java.lang.String>*
:   Packages for scanning to custom json mapping.

### Document Related Configuration

`mgmtp.a12.dataservices.documents.computation.cleanupErrorAndNotComputedValue.enabled` = `false`: *boolean*
:   If `true`, we apply kernel API for cleaning up error and not computed field after computation.

`mgmtp.a12.dataservices.documents.computation.enabledForModels` = `null`: *java.util.List<java.lang.String>*
:   Enable computation for provided document models on save.

`mgmtp.a12.dataservices.documents.delete.cascadeLinks.disabledForModels` = `null`: *java.util.List<java.lang.String>*
:   Contains a list of document model names for which links must not be deleted.
    To disable deletion for all models, use "\*". If a model name is specified in this list, deletion of any links belonging to that
    model will not be performed.

`mgmtp.a12.dataservices.documents.multiDelete.limit` = `50`.: *int*
:   Hard limit for maximum amount of documents to be deleted in com.mgmtp.a12.dataservices.document.operation.internal.MultiDeleteDocumentsOperation.

`mgmtp.a12.dataservices.documents.persistTransientFields.enabled` = `false`: *boolean*
:   Switch for enabling/disabling persistence (consequently indexing) of transient fields

`mgmtp.a12.dataservices.documents.validation.enabled` = `true`: *boolean*
:   If `true`, documents are fully validated by default on save. Only documents of models listed
    in #partialForModels and #skipForModels are handled differently.

`mgmtp.a12.dataservices.documents.validation.partialForModels` = `null`: *java.util.List<java.lang.String>*
:   For documents of these models validate just fields which are set.

`mgmtp.a12.dataservices.documents.validation.skipForModels` = `null`: *java.util.List<java.lang.String>*
:   Skip validation of these models on save.

`mgmtp.a12.dataservices.initialization.import.documents.computation.cleanupErrorAndNotComputedValue.enabled` = `false`: *boolean*
:   If `true`, we apply kernel API for cleaning up error and not computed field after computation.

`mgmtp.a12.dataservices.initialization.import.documents.computation.enabledForModels` = `null`: *java.util.List<java.lang.String>*
:   Enable computation for provided document models on save.

`mgmtp.a12.dataservices.initialization.import.documents.delete.cascadeLinks.disabledForModels` = `null`: *java.util.List<java.lang.String>*
:   Contains a list of document model names for which links must not be deleted.
    To disable deletion for all models, use "\*". If a model name is specified in this list, deletion of any links belonging to that
    model will not be performed.

`mgmtp.a12.dataservices.initialization.import.documents.multiDelete.limit` = `50`.: *int*
:   Hard limit for maximum amount of documents to be deleted in com.mgmtp.a12.dataservices.document.operation.internal.MultiDeleteDocumentsOperation.

`mgmtp.a12.dataservices.initialization.import.documents.persistTransientFields.enabled` = `false`: *boolean*
:   Switch for enabling/disabling persistence (consequently indexing) of transient fields

`mgmtp.a12.dataservices.initialization.import.documents.validation.enabled` = `true`: *boolean*
:   If `true`, documents are fully validated by default on save. Only documents of models listed
    in #partialForModels and #skipForModels are handled differently.

`mgmtp.a12.dataservices.initialization.import.documents.validation.partialForModels` = `null`: *java.util.List<java.lang.String>*
:   For documents of these models validate just fields which are set.

`mgmtp.a12.dataservices.initialization.import.documents.validation.skipForModels` = `null`: *java.util.List<java.lang.String>*
:   Skip validation of these models on save.

### CDD Related Configuration

`mgmtp.a12.dataservices.cdd.export.charset` = `UTF-8`: *java.lang.String*
:   Specifies the canonical name of the character set that is used to encode the content saved to the storage.
    Allowed values depend on the JDK in use. Most common encodings (canonical names) are

    * ISO-8859-1: ISO-8859-1, Latin Alphabet No. 1
    * UTF-8: Eight-bit Unicode (or UCS) Transformation Format
    * US-ASCII: American Standard Code for Information Interchange

`mgmtp.a12.dataservices.cdd.export.csv.delimiter` = `;`: *java.lang.Character*
:   The delimiter used in exported csv file

`mgmtp.a12.dataservices.cdd.export.maxRowSize` = `65536`: *int*
:   Hard limit for max export row size for list cdd.

`mgmtp.a12.dataservices.cdd.model.modificationAfterInitialization.enabled` = false: *boolean*
:   Enables/disables CDM readonly after initialization.

### RPC Properties

`mgmtp.a12.dataservices.jsonRpc.allowedOperations` = `A12_INTERNAL_OPERATIONS`: *java.util.Set<java.lang.String>*
:   Allows using specified RPC operations or group of operation. You can set the value to "\*" to allow all existing RPC operation.
    Note that in case "\*" wouldn’t be the only string in the list, no special meaning would be applied.
    Other pre-defined operation groups are:

    * `DOCUMENT_OPERATIONS`: All document operations (excluding CDD handling, relationships and attachments).
    * `CDD_OPERATIONS` : All CDD operations (without potentially needed document and link operations).
    * `LINK_OPERATIONS` : All relationship (aka link) operations (without potentially needed document operations).
    * `ATTACHMENT_OPERATIONS` : All attachment and thumbnail operations (without potentially needed document operations).

    By default, the `A12_INTERNAL_OPERATIONS` group is enabled because these operations are mandatory for projects that have a12-client as
    frontend application. Please make sure to enable this group if you have your own configuration.

`mgmtp.a12.dataservices.jsonRpc.enabled` = `false`: *boolean*
:   Enables/disables JSON-RPC endpoint.

`mgmtp.a12.dataservices.jsonRpc.maxMethodCallsPerRequest` = 100: *int*
:   Limit for maximum number of method calls per single RPC request

`mgmtp.a12.dataservices.jsonRpc.spel.enabled` = `false`: *boolean*
:   Enables use of placeholder resolution in JSON-RPC requests.

### Model & Document Initialization Import

During the Data Services initialization phase, it is possible to configure the server to import models. The following properties point to the location on the filesystem from where the models should be loaded as JSON during initialization.

The resources (rpc-requests or models) location resolution on the Data Services initialization uses expression language which can use an absolute or relative path, as well as wildcards,…

`mgmtp.a12.dataservices.initialization.import.models.enabled` = `true`: *boolean*
:   Enables import of business models on system initialization.

`mgmtp.a12.dataservices.initialization.import.models.path` = : *java.lang.String[]*
:   Specifies the path where imported models are located.

    Examples:

    * file:/path/to/folder/
    * classpath:/jsonRpc/

    Comments:

    * Prefix `file:` or `classpath:` is mandatory here.
    * For `classpath` prefix, leading and trailing slashes are optional.
    * On Windows `/path/to/folder` represents the directory `C:\path\to\folder`.
    * Wildcards are not supported here.

`mgmtp.a12.dataservices.initialization.import.models.typesToClear` = `null`: *java.util.List<java.lang.String>*
:   Enables full import of models during initialization.

    This property specifies which model types should be deleted. To delete all models, use "\*".
    Only model definitions are removed; the underlying data remains. Links and documents without a model become inaccessible via the API.
    Models must be re-added to access data via API. Otherwise, the data will be accessible only in the database. In case no model type is
    provided, no deleting is done.

    Related configurations: `mgmtp.a12.dataservices.models.relationship.validation.enabled`, `mgmtp.a12.dataservices.models.relationship.safe-delete.enabled`

### Other Initialization Properties

`mgmtp.a12.dataservices.initialization.cleanUpRequestId.enabled` = `false`: *boolean*
:   Enables clean up of table REQUEST\_ID on system initialization.

`mgmtp.a12.dataservices.initialization.migration.enabled` = `true`: *boolean*
:   Enables migration of custom tasks (e.g. Document or Model migration) on system initialization.

`mgmtp.a12.dataservices.initialization.preCompile.enabledForModels` = `*`: *java.util.List<java.lang.String>*
:   Allows whitelisting specific models while disabling all others.
    Setting the value to "\*" permits all existing models. Note: If "\*" isn’t the only string in the list, no special meaning will be applied.

`mgmtp.a12.dataservices.initialization.scripts.jsonRpc.enabled` = `false`: *boolean*
:   Enables the execution of JSON-RPC requests on server initialization.

`mgmtp.a12.dataservices.initialization.scripts.jsonRpc.paths` = empty list.: *java.util.List<java.lang.String>*
:   Pattern indicating the resources as JSON-RPC requests to be executed on initialization. Supports providing multiple paths.

    Path examples:

    * file:/path/to/folder/\*
    * file:/path/to/folder/\*.json
    * file:/path/to/folder/singleRequest.json
    * classpath:/jsonRpc/\*
    * classpath:/jsonRpc/\*.json
    * classpath:/jsonRpc/singleRequest.json

    Comments:

    * Prefix `file:` or `classpath:` is mandatory here.
    * For `classpath` prefix, leading slashes are optional.
    * It will be executed ordered by file name ASC.
    * On Windows `/path/to/folder` represents the directory `C:\path\to\folder`.
    * Double asterisks (`**`) are not supported here.
    * The property is ignored if the `mgmtp.a12.dataservices.initialization.scripts.jsonRpc.enabled` property is `false`.

`mgmtp.a12.dataservices.models.list.hardLimit` = `50`: *int*
:   Hard limit for result size of the com.mgmtp.a12.dataservices.model.operation.internal.ListModelsOperation. How many models can a single user fetch.

`mgmtp.a12.dataservices.models.metadata.document.path` = `/com/mgmtp/a12/platform/model/document-meta-data.json`: *java.lang.String*
:   Path to the document metadata JSON file within the classpath resources folder.
    The file must be located in the resources directory of the project (e.g., `src/main/resources`).
    Use absolute paths starting with `/` for files in the root of the resources folder.

`mgmtp.a12.dataservices.models.relationship.safeDelete.enabled` = `true`: *boolean*
:   If `true`, relationship models are checked for links when deleting. If links exist, the deletion is aborted and an error is returned.

`mgmtp.a12.dataservices.models.relationship.validation.enabled` = `true`: *boolean*
:   If `true`, relationship models are fully validated when saving

### Jobs Configurations

See the [job scheduling section](#job-scheduling).

`mgmtp.a12.dataservices.jobs.attachments.cleanup.schedule` = "0 \*/5 \* \* \* ?": *java.lang.String*
:   Cron expression to plan attachment cleanup job. See the [Quartz Trigger tutorial](https://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/crontrigger.html).

`mgmtp.a12.dataservices.jobs.attachments.cleanUpDirtyAttachments.schedule` = "0 \*/5 \* \* \* ?": *java.lang.String*
:   Cron expression to plan attachment cleanup job. See the [Quartz Trigger tutorial](https://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/crontrigger.html).

`mgmtp.a12.dataservices.jobs.attachments.cleanUpStaleAttachments.schedule` = "0 \*/5 \* \* \* ?": *java.lang.String*
:   Cron expression to plan attachment cleanup job. See the [Quartz Trigger tutorial](https://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/crontrigger.html).

`mgmtp.a12.dataservices.jobs.attachments.temporary.contextExpireHours` = `null`: *java.util.Map<java.lang.String,java.lang.Integer>*
:   A map that holds the time in hours after which a temporary attachments in specified context will be deleted.

`mgmtp.a12.dataservices.jobs.attachments.temporary.expireHours` = `48`: *int*
:   Time in hours after which a temporary attachment will be deleted

`mgmtp.a12.dataservices.jobs.enabled` = `true`: *boolean*
:   Enable All jobs. See [Quartz documentation](https://www.quartz-scheduler.org/).

`mgmtp.a12.dataservices.jobs.relationships.rankRecalculation.enabled` = false: *boolean*
:   Enables/disables the rank reorder scheduler job.

`mgmtp.a12.dataservices.jobs.relationships.rankRecalculation.rmsToReorder` = `null`: *java.util.List<java.lang.String>*
:   List of relationship model names whose document’s ranks should be reordered by the job.

`mgmtp.a12.dataservices.jobs.relationships.rankRecalculation.schedule` = `null`: *java.lang.String*
:   Cron schedule to trigger recalculation of all assigned link ranks.

`mgmtp.a12.dataservices.jobs.requests.cleanupRequestId.expireHours` = `720` (i.e. one month): *int*
:   The amount of time in hours after which an idempotence id (entry in table request\_id) will be deleted.

`mgmtp.a12.dataservices.jobs.requests.cleanupRequestId.schedule` = "0 \*/5 \* \* \* ?": *java.lang.String*
:   Cron expression to plan request\_id cleanup job. See the [Quartz Trigger tutorial](https://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/crontrigger.html).

#### Model Overwriting Configuration

Via this configuration it is possible to choose if models should be overwritten on initialization: `mgmtp.a12.dataservices.initialization.import.models.overwrite.enabled`.

`mgmtp.a12.dataservices.initialization.import.models.overwrite.documentModels.enabled` = `true`: *boolean*
:   Enables overwriting of document models on application initialization. Applies on importing business models by
    `mgmtp.a12.dataservices.initialization.import.models.path`.

`mgmtp.a12.dataservices.initialization.import.models.overwrite.enabled` = `true`: *boolean*
:   Configures default for model overwriting on application initialization and bulk import. Applies on importing business models by
    `mgmtp.a12.dataservices.initialization.import.models.path`.

`mgmtp.a12.dataservices.initialization.import.models.overwrite.models` = `null`: *java.util.Map<java.lang.String,java.lang.Boolean>*
:   Enables model overwriting by particular type of model on application initialization and bulk import. When not provided, value `mgmtp.a12.dataservices.initialization.import.models.overwrite.enabled` will be used. For example: `mgmtp.a12.dataservices.initialization.import.models.overwrite.models.my-custom-model-type=false` will deny overwriting models of type "my-custom-model-type" on application initialization.
    Applies on importing user models by `mgmtp.a12.dataservices.initialization.import.models.path`.

### Attachment Properties

`mgmtp.a12.dataservices.attachments.cleanup.retry.delay` = `"5 min"`: *java.lang.String*
:   Delay before retry after recoverable error. See com.mgmtp.a12.dataservices.common.quantity.internal.QuantityParsers#parseTimeQuantity(String) for possible values.

`mgmtp.a12.dataservices.attachments.cleanup.retry.max` = `5`: *int*
:   Maximum count of retries for recoverable errors.

`mgmtp.a12.dataservices.attachments.enabled` = `true`: *boolean*
:   Switch for enabling/disabling attachment handling.

`mgmtp.a12.dataservices.attachments.ext.contentstore.embedded.enabled` = `true`: *boolean*
:   Switch for using content store embedded mode

`mgmtp.a12.dataservices.attachments.ext.contentstore.ticketTimeout` = `300`: *long*
:   Ticket expiration time in seconds.

`mgmtp.a12.dataservices.attachments.ext.fs.location` = `${user.home}/a12/dataservices/attachments`: *java.io.File*
:   Attachment location on file system (from version V1.5 on). Prefix `file:` is always mandatory for value.
    *Example:* `file:/var/lib/a12/dataservices/attachments`

`mgmtp.a12.dataservices.attachments.mimeType.inMemoryTemp.enabled` = `false`: *boolean*
:   If enabled, enforces probing mime type to use in-memory JimFs as temporary storage during detection.

`mgmtp.a12.dataservices.attachments.mimeType.probeMimeType.enabled` = `false`: *boolean*
:   Enable/disable Data Services probes mime type by itself or delegate to Content Store.

`mgmtp.a12.dataservices.attachments.restEndpoint.enabled` = `false`: *boolean*
:   Switch for enabling/disabling attachment REST endpoint.

`mgmtp.a12.dataservices.attachments.thumbnail.generation.imageDiskCache.enabled` = `false`: *boolean*
:   Sets a flag indicating whether `ImageIO` should use disk-based cache when creating ImageInputStreams and ImageOutputStreams.
    Setting this property to false disallows the use of disk for future streams, which may be advantageous when working with small images,
    as the overhead of creating and destroying files is removed.
    By default, this property is false.

`mgmtp.a12.dataservices.attachments.thumbnail.generation.thumbnailator.conserveMemoryWorkaround.enabled` = `false`: *boolean*
:   This property is disabled by default, if enabled, the workaround solution provided by `Thumbnailator` will be applied by setting system argument `-Dthumbnailator.conserveMemoryWorkaround=true`.
    Both height and width of image have dimensions larger than 1800 pixels `Thumbnailator` will invoke code to load a smaller image to memory from the
    source image when creating a thumbnail.
    This property is only applied if mgmtp.a12.dataservices.attachments.thumbnail.optimization.performance.enabled=false

`mgmtp.a12.dataservices.attachments.thumbnail.optimization.baseUrl` = : *java.lang.String*
:   Base url for thumbnail for optimization

`mgmtp.a12.dataservices.attachments.thumbnail.optimization.performance.enabled` = `false`: *boolean*
:   Try to use `java.awt.Graphics2D` for generating thumbnail to increase performance.
    If enabled `Graphics2D` will be used to generate thumbnail. By default, it’s disabled, `Thumbnailator` will be used.

`mgmtp.a12.dataservices.attachments.thumbnail.optimization.url.enabled` = `false`: *boolean*
:   Thumbnail url is auto-computed on Data Services side. If enabling this config, we must config base thumbnail url: `mgmtp.a12.dataservices.attachments.thumbnail.optimization.baseUrl`.

`mgmtp.a12.dataservices.attachments.thumbnail.preview.enabled` = `false`: *boolean*
:   Switch for load thumbnail functionality

`mgmtp.a12.dataservices.attachments.thumbnail.sizeBig` = `64`: *int*
:   Size in pixels for big thumbnail.

`mgmtp.a12.dataservices.attachments.thumbnail.sizeSmall` = `32`: *int*
:   Size in pixels for small thumbnail.

`mgmtp.a12.dataservices.attachments.type.publicType.models` = empty list: *java.util.List<java.lang.String>*
:   List of Document Models which attachments will be public.

`mgmtp.a12.dataservices.filesystem.write.enabled` = `true`: *boolean*
:   Enable/disable writes to the File system. Disabling file system writes will disable the file based attachment persister, loader, and document import functionality.

    ;
    *deprecated*: *The switch is not used anywhere since the introduction of the content store. It will be dropped without replacement.*

Data services uses Content store for storage of attachments. Please also read [Content Store Configuration](#content-store-configuration) for more information.

### Java Client Properties

`mgmtp.a12.dataservices.client.configuration.baseUrl` = `null`: *String*
:   Base URL of the server.

### Authorization Properties

`mgmtp.a12.dataservices.authorization.backendJob.principal.username` = `superUser`: *java.lang.String*
:   Configuration for defining backend job username.
    This user is used in the following places:

    * initialization of the application.
    * link rank defragmentation.
    * kernel cache preloader.

    This implies that the user must have at least permissions to modify documents and models.
    Additionally, it must have permission to all actions
    executed in the events handlers provided as customization and also to all actions executed from RPC initializer if provided.

    So, the recommended set of permissions is at least:

    * `Model Read`
    * `Model Create`
    * `Model Update`
    * `Query`
    * `Document Create`
    * `Document Update`
    * `Document Delete`

`mgmtp.a12.dataservices.authorization.roleBased.enabled` = `true`: *boolean*
:   Configuration for role based authorization.
    If value is false, DS will disable all model based authorization.

### Actuator Properties

`management.endpoints.access.default` = `none`
:   By default, access to all endpoints (except for `shutdown` and `heapdump`) is unrestricted, so you can configure the permitted access to an endpoint with the `management.endpoint.<id>.access` property (example: management.endpoint.shutdown.access=unrestricted).
    When `none`, all endpoints are restricted, and you may use the individual `access` properties to opt back in (example: management.endpoint.env.access=read-only). See [spring documentation](https://docs.spring.io/spring-boot/3.5.9/reference/) for the details.
    Note that the only exposed endpoints by default are /health and /info although others are enabled.

`management.endpoints.web.exposure.include` = `health,info`
:   Sets the list of endpoints to be exposed via web. If you want to expose all, set the value to `*`. See [spring documentation](https://docs.spring.io/spring-boot/3.5.9/reference/) for the details. Note that 'exposed endpoint' does not mean 'enabled endpoint', so make sure to expose and enable the ones you want.

`management.health.defaults.enabled` = `false`
:   Enables Spring’s default health indicators. If you need to check their health during initialization, set it to `true` (globally via this property, or individually). See [spring documentation](https://docs.spring.io/spring-boot/3.5.9/reference/) for the details.

`management.server.port`
:   Custom port for actuator if different from the app.

`management.endpoints.web.basePath`
:   Custom actuator name if it needs to be changed.
    Change context name like `http://localhost/actuator` → `http://localhost/newName`.

`management.endpoint.health.showDetails`
:   Show details of the health endpoint.
    Use the value `always` or `when-authorized` to check status for the server initialization finished, for example.

### Logger Anonymizer

`mgmtp.a12.dataservices.logging.anonymization.enabled` = `true`: *boolean*
:   Control whether to render anonymous sensitive data for logging.

When logging, we protect sensitive data by replacing it by asterisks by default. You can disable this behavior by configuration property `mgmtp.a12.dataservices.logging.anonymization.enabled=false`,
or you can toggle it at runtime by JMX managed bean `com.mgmtp.a12.dataservices.utils.RuntimeSwitchingAnonymizer`.
To enable JMX, start server with the following properties:

Example JVM options to enable JMX

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` com.sun.management.jmxremote com.sun.management.jmxremote.port=9010 com.sun.management.jmxremote.rmi.port=9010 com.sun.management.jmxremote.local.only=false com.sun.management.jmxremote.authenticate=false com.sun.management.jmxremote.ssl=false ``` |
```

and then connect to it by jconsole.
Under tab "MBeans" you can view all available managed beans and if allowed, you can modify its properties.

### Other Properties

`mgmtp.a12.dataservices.documents.validation.language` = `en`: *java.lang.String*
:   Default validation locale when there is no validation locale provided in request.

`mgmtp.a12.dataservices.initialization.import.documents.validation.language` = `en`: *java.lang.String*
:   Default validation locale when there is no validation locale provided in request.

`mgmtp.a12.dataservices.server.contextPath` = `/api`: *java.lang.String*
:   Mappings in Data Services have the following structure: SPRING\_CONTEXT\_PATH/DATA\_SERVICES\_CONTEXT\_PATH/…​
    This property should be used to set DATA\_SERVICES\_CONTEXT\_PATH (if you want to set SPRING\_CONTEXT\_PATH use `server.servlet.contextPath instead`).
    Its purpose is to give an ability to differentiate with DATA\_SERVICES\_CONTEXT\_PATH by introducing your own context path variable.
    NOTES:
    1. Don’t put leading '/' if SPRING\_CONTEXT\_PATH has trailing '/'. It will result in '//' prefix in the mappings.
    2. There is a configuration called `mgmtp.a12.uaa.authentication.contextPath`. It should be equal to this property for the application to function properly.

`mgmtp.a12.dataservices.server.exceptionMapping.shouldAddExceptionToHeader` = `false`: *boolean*
:   Defines whether the exception should be added to the header
    of responses in the exception mappers.

### Configuration Profiles

We maintain a collection of pre-configured profiles that bundle commonly used properties with the intention to simplify the setup of DS by streamlining the configuration process.

There are three primary mechanisms for configuring profiles in the Spring Framework: `spring.profiles.active`, `spring.profiles.include`, and `spring.config.import`.

The recommended and straightforward method is leveraging `spring.profiles.active`. This property takes precedence over any underlying activated profiles, ensuring that only the explicitly defined list remains active. By setting `spring.profiles.active`, you precisely dictate which profiles should be in effect.

Contrastingly, `spring.profiles.include` appends additional profiles to the set of active ones rather than replacing them. This allows for a more cumulative approach, combining configurations from multiple profiles.

The `spring.config.import` property serves the purpose of importing externalized configurations through a specified location pattern. However, it’s essential to note that files imported this way are not treated as profiles. Consequently, they cannot be employed for profile-specific features such as the `@Profile` annotation, nor influenced by the `spring.profiles.active` setting. In essence, `spring.config.import` operates independently of the profile-based configuration mechanisms in Spring, focusing solely on incorporating externalized configuration from designated locations.

For comprehensive guidance on their application and utilization, please consult the [spring profile documentation](https://docs.spring.io/spring-boot/reference/features/profiles.html).

* [Actuators](#spring-profile-contentstore-actuators) • [H2 database](#spring-profile-contentstore-embedded_h2) • [Embedded Postgres Database](#spring-profile-contentstore-embedded_postgres) • [Postgres database](#spring-profile-contentstore-external_postgres) • [Activate HTTP/1 Support Only for Server Application](#spring-profile-contentstore-http1-only) • [Disable cache](#spring-profile-contentstore-no_cache) • [Disable Liquibase](#spring-profile-contentstore-no_liquibase) • [UAA](#spring-profile-contentstore-uaa) • [Actuators](#spring-profile-dataservices-actuators) • [Cluster](#spring-profile-dataservices-cluster) • [Embedded Content Store](#spring-profile-dataservices-embedded_contentstore) • [Embedded Postgres Database](#spring-profile-dataservices-embedded_postgres) • [External Postgres Database](#spring-profile-dataservices-external_postgres) • [Activate HTTP/1 Support Only for Server Application](#spring-profile-dataservices-http1-only) • [Enable Initialization Scripts](#spring-profile-dataservices-initscripts) • [Disable Attachments](#spring-profile-dataservices-no_attachments) • [Disable Caching](#spring-profile-dataservices-no_cache) • [Disable Jobs](#spring-profile-dataservices-no_jobs) • [Disable Liquibase](#spring-profile-dataservices-no_liquibase) • [Enable RPC](#spring-profile-dataservices-rpc) • [Active Content Store Standalone Mode Integration](#spring-profile-dataservices-standalone_contentstore) • [Set Up UAA](#spring-profile-dataservices-uaa)

#### Actuators

Enable Spring Boot Actuators for all endpoints.
See [actuator properties](#actuator-properties) for additional information.

|  |  |  |  |
| --- | --- | --- | --- |
|  | This profile will apply to both data services and content stores. So use just in case of the standalone mode.  If you don’t use LDAP, but you enable all actuators by wildcard, you can get this error:  ``` |  |  | | --- | --- | | ``` 1 2 3 4 5 6 7 8 ``` | ``` {     "ldap": {         "status": "DOWN",         "details": {             "error": "org.springframework.ldap.CommunicationException: localhost:389; nested exception is javax.naming.CommunicationException: localhost:389 [Root exception is java.net.ConnectException: Connection refused: connect]"         }     } } ``` | ```  You can avoid this error by adding `management.health.ldap.enabled=false` property. |

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` contentstore-actuators ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` management.endpoints.access.default=read-only management.endpoints.web.exposure.include=* management.endpoint.health.showDetails=always management.health.defaults.enabled=true management.health.ldap.enabled=false ``` |
```

#### H2 database

Set up the application to use embedded H2 in-memory database.

To specify different datasource use these additional properties:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` spring.datasources.contentstore.url=jdbc:h2:LOCATION:DB; spring.datasources.contentstore.username=USERNAME spring.datasources.contentstore.password=PASSWORD ``` |
```

Additionally, you can change timeout by:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` spring.datasources.contentstore.hikari.connectionTimeout= ``` |
```

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` contentstore-embedded_h2 ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` spring.datasources.contentstore.url=jdbc:h2:mem:contentstore; spring.datasources.contentstore.driver-class-name=org.h2.Driver spring.datasources.contentstore.name=contentstore spring.datasources.contentstore.username=sa spring.datasources.contentstore.password= spring.datasources.contentstore.jpa.database=H2 spring.h2.console.enabled=true spring.h2.console.path=/console/ ``` |
```

##### Embedded Postgres Database

Set up the application to use embedded file-based Postgres database. Default superuser is `postgres` and db name is `postgres`.
If `spring.datasources.dataservices.embedded-postgres.path` is not provided, temp folder will be used to persist data.
Temp folder will depend on OS:

* Linux and MacOS: `/tmp/embedded-pg`
* Windows: `${user.home}\AppData\Local\Temp`

Set `spring.datasources.contentstore.embedded-postgres.override-working-directory` to a directory to cache the extracted PostgreSQL binaries (e.g. initdb, postgres) across application runs instead of the default temporary location.

|  |  |
| --- | --- |
|  | This embedded postgres profile should be used only for development or testing purpose only. Persistent data might be lost after restarting server. |

##### Additional Possible Configuration:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` spring.datasources.contentstore.embedded-postgres.path=file:./cs-embedded-postgres spring.datasources.contentstore.embedded-postgres.port=5439 spring.datasources.contentstore.embedded-postgres.connect-config.autosave=always spring.datasources.contentstore.embedded-postgres.locale-c-type=en_US.UTF-8 spring.datasources.contentstore.embedded-postgres.override-working-directory=file:./postgres-bin ``` |
```

For more `connect-config` configuration, please refer to `org.postgresql.PGProperty` or the Postgres official documentation.

For more `postgres-config` configuration, please refer to the Postgres documentation on [pg\_ctl](https://www.postgresql.org/docs/16/app-pg-ctl.html).

To ensure a graceful shutdown of the embedded Postgres database, please be aware of the following considerations.

When you use the IDE’s (e.g., IntelliJ, Visual Studio Code) Stop button (Red Square), the system attempts a graceful shutdown.
This process allows EmbeddedPostgres to rely on a shutdown hook for proper cleanup, resource release, and database stopping.
However, in some environments, particularly on Windows and macOS, the shutdown hook may not execute as expected, preventing the embedded Postgres database from shutting down properly.
Even if you delete the Postgres data folder, the Postgres process might still be running in the background, which can lead to residual old data.
Consequently, restarting the application may lead to errors indicating the Postgres instance is already running, or you may face port binding issues.

If this issue occurs, you must manually stop the Postgres process and delete the temporary postgres folder. Methods include:

* Using Task Manager (Windows) or Activity Monitor (macOS).
* Using the command line to kill the process.

To ensure a reliable graceful shutdown, consider the following alternative:

**Use the following properties to enable the Actuator shutdown endpoint:**

```
management.endpoint.shutdown.access=unrestricted
management.endpoints.web.exposure.include=shutdown
```

**Then, send a POST request to the shutdown endpoint to properly trigger the application exit procedure:**

```
curl --location --request POST '{YOUR_HOST_URL}/actuator/shutdown'
```

**Your application will then shut down properly. Note that this method should only be used in your local environment. In production or other environments where the application is run as a standard Java process, this issue typically does not occur, and the application will shut down gracefully. Remember, embedded Postgres is only for development purposes.**

**Note: If you cannot gracefully shut down the embedded Postgres database, you must manually kill the Postgres process to avoid data corruption, as the graceful shutdown method fails in this scenario.**

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` contentstore-embedded_postgres ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` spring.datasources.contentstore.embedded-postgres.enabled=true spring.datasources.contentstore.embedded-postgres.port=5435 spring.datasources.contentstore.jpa.database=postgresql ``` |
```

#### Postgres database

Set up the application to use Postgres database.

List of most used optional configurations you may need:

To specify datasource use these additional properties:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` spring.datasources.contentstore.url=jdbc:postgresql://HOST:PORT/DB spring.datasources.contentstore.username=USERNAME spring.datasources.contentstore.password=PASSWORD ``` |
```

Additionally, you can change timeout by:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` spring.datasources.contentstore.hikari.connectionTimeout= ``` |
```

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` contentstore-external_postgres ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` spring.datasources.contentstore.jpa.database=postgresql spring.datasources.contentstore.driver-class-name=org.postgresql.Driver ``` |
```

#### Activate HTTP/1 Support Only for Server Application

With this profile enabled, server application will support HTTP/1 protocol only.

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` contentstore-http1-only ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` server.http2.enabled=false ``` |
```

#### Disable cache

Disable caching completely.

|  |  |
| --- | --- |
|  | This profile is discouraged in production environment, because it could cause big performance drop. Use only if you know what you do. |

This profile will apply to both data services and content stores.
So use just in case of the standalone mode.

See [cache properties](#cache-configuration) for additional information.

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` contentstore-no_cache ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` spring.cache.type=none ``` |
```

#### Disable Liquibase

Disables initial database creation/migration. this is useful especially for cluster-safe setup of multi instance servers.

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` contentstore-no_liquibase ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` spring.datasources.contentstore.liquibase.enabled=false ``` |
```

#### UAA

Setup default UAA configuration.

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` contentstore-uaa ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` mgmtp.a12.uaa.authentication.cors.enable=true mgmtp.a12.uaa.authentication.context-path=/cs/api ``` |
```

#### Actuators

Enable Spring Boot Actuators for all endpoints.
See the [Actuator Properties](#actuator-properties) for additional information.

|  |  |  |  |
| --- | --- | --- | --- |
|  | If you don’t use LDAP, but you enable all actuators by wildcard, you can get this error:  ``` |  |  | | --- | --- | | ``` 1 2 3 4 5 6 7 8 ``` | ``` {     "ldap": {         "status": "DOWN",         "details": {             "error": "org.springframework.ldap.CommunicationException: localhost:389; nested exception is javax.naming.CommunicationException: localhost:389 [Root exception is java.net.ConnectException: Connection refused: connect]"         }     } } ``` | ```  You can avoid this error by adding `management.health.ldap.enabled=false` property. |

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` dataservices-actuators ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` management.endpoints.access.default=read-only management.endpoints.web.exposure.include=* management.endpoint.health.showDetails=always management.health.defaults.enabled=true management.health.ldap.enabled=false ``` |
```

#### Cluster

Configure server to bypass initialization steps. Includes disabling of initialization of database schema, data import and index manipulation. It is intended to be used in clustered setup with multiple replicas where you don’t want initializations steps to be executed by each replica. See [cluster-safe configuration](#cluster-safe-configuration) for additional information.

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` dataservices-cluster ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` spring.datasources.dataservices.liquibase.enabled=false mgmtp.a12.dataservices.initialization.import.models.enabled=false mgmtp.a12.dataservices.initialization.scripts.jsonRpc.enabled=false mgmtp.a12.dataservices.initialization.migration.enabled=false ``` |
```

#### Embedded Content Store

Enable/disable embedded Content Store server.

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` dataservices-embedded_contentstore ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` mgmtp.a12.dataservices.attachments.ext.contentstore.embedded.enabled=true mgmtp.a12.dataservices.contentstore.server.api.enabled=false mgmtp.a12.dataservices.contentstore.server.contextPath=/cs mgmtp.a12.dataservices.contentstore.base-url=http://localhost:${server.port:8080} mgmtp.a12.dataservices.attachments.thumbnail.optimization.baseUrl=${mgmtp.a12.dataservices.contentstore.base-url}${mgmtp.a12.dataservices.contentstore.server.contextPath} ``` |
```

##### Embedded Postgres Database

Set up the application to use an embedded file-based Postgres database. Default superuser is `postgres` and db name is `postgres`.
If `spring.datasources.dataservices.embedded-postgres.path` is not provided, a temp folder will be used to persist data.
Temp folder will depend on OS:

* Linux and MacOS: `/tmp/embedded-pg`
* Windows: `${user.home}\AppData\Local\Temp`

Set `spring.datasources.dataservices.embedded-postgres.override-working-directory` to a directory to cache the extracted PostgreSQL binaries (e.g. initdb, postgres) across application runs instead of the default temporary location.

|  |  |
| --- | --- |
|  | This embedded Postgres profile should be used only for development or testing purposes. Persistent data might be lost after restarting the server. |

##### Additional Possible Configuration:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` spring.datasources.dataservices.embedded-postgres.path=file:./ds-embedded-postgres spring.datasources.dataservices.embedded-postgres.port=5434 spring.datasources.dataservices.embedded-postgres.connect-config.autosave=always spring.datasources.dataservices.embedded-postgres.locale-c-type=en_US.UTF-8 spring.datasources.dataservices.embedded-postgres.override-working-directory=file:./postgres-bin ``` |
```

For more `connect-config` configuration, please refer to `org.postgresql.PGProperty` or the Postgres official documentation.

For more `postgres-config` configuration, please refer to the Postgres documentation on [pg\_ctl](https://www.postgresql.org/docs/16/app-pg-ctl.html).

To ensure a graceful shutdown of the embedded Postgres database, please be aware of the following considerations.

When you use the IDE’s (e.g., IntelliJ, Visual Studio Code) Stop button (Red Square), the system attempts a graceful shutdown.
This process allows EmbeddedPostgres to rely on a shutdown hook for proper cleanup, resource release, and database stopping.
However, in some environments, particularly on Windows and macOS, the shutdown hook may not execute as expected, preventing the embedded Postgres database from shutting down properly.
Even if you delete the Postgres data folder, the Postgres process might still be running in the background, which can lead to residual old data.
Consequently, restarting the application may lead to errors indicating the Postgres instance is already running, or you may face port binding issues.

If this issue occurs, you must manually stop the Postgres process and delete the temporary postgres folder. Methods include:

* Using Task Manager (Windows) or Activity Monitor (macOS).
* Using the command line to kill the process.

To ensure a reliable graceful shutdown, consider the following alternative:

**Use the following properties to enable the Actuator shutdown endpoint:**

```
management.endpoint.shutdown.access=unrestricted
management.endpoints.web.exposure.include=shutdown
```

**Then, send a POST request to the shutdown endpoint to properly trigger the application exit procedure:**

```
curl --location --request POST '{YOUR_HOST_URL}/actuator/shutdown'
```

**Your application will then shut down properly. Note that this method should only be used in your local environment. In production or other environments where the application is run as a standard Java process, this issue typically does not occur, and the application will shut down gracefully. Remember, embedded Postgres is only for development purposes.**

**Note: If you cannot gracefully shut down the embedded Postgres database, you must manually kill the Postgres process to avoid data corruption, as the graceful shutdown method fails in this scenario.**

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` dataservices-embedded_postgres ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` spring.datasources.dataservices.embedded-postgres.enabled=true spring.datasources.dataservices.jpa.database=postgresql spring.quartz.properties.org.quartz.jobStore.driverDelegateClass=org.quartz.impl.jdbcjobstore.PostgreSQLDelegate ``` |
```

#### External Postgres Database

Set up the application to use Postgres database.

List of most used optional configurations you may need:

To specify datasource use these additional properties:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` spring.datasources.dataservices.url=jdbc:postgresql://HOST:PORT/DB spring.datasources.dataservices.username=USERNAME spring.datasources.dataservices.password=PASSWORD ``` |
```

Additionally, you can change timeout by:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` spring.datasources.dataservices.hikari.connectionTimeout= ``` |
```

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` dataservices-external_postgres ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` spring.datasources.dataservices.jpa.database=postgresql spring.datasources.dataservices.driver-class-name=org.postgresql.Driver spring.quartz.properties.org.quartz.jobStore.driverDelegateClass=org.quartz.impl.jdbcjobstore.PostgreSQLDelegate ``` |
```

#### Activate HTTP/1 Support Only for Server Application

With this profile enabled, server application will support HTTP1 protocol only.

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` dataservices-http1-only ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` server.http2.enabled=false ``` |
```

#### Enable Initialization Scripts

Enable execution of server initialization scripts, like RPC requests and import of models.

See [import initialization properties](#models-and-document-upload-on-server-initialization) and
[other initialization properties](#Other-initialization-properties) for additional information.

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` dataservices-initscripts ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.dataservices.initialization.scripts.jsonRpc.enabled=true ``` |
```

#### Disable Attachments

Disables Data Services attachments including Content Store.

See [attachments properties](#attachment-properties) for advanced configuration.

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` dataservices-no_attachments ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.dataservices.attachments.enabled=false ``` |
```

#### Disable Caching

Disable caching completely.

|  |  |
| --- | --- |
|  | This profile is discouraged in production environment, because it could cause big performance drop. Use only if you know what you do. |

In case of embedded mode, this profile will apply to both data services and content stores.

See [cache properties](#cache-configuration) for additional information.

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` dataservices-no_cache ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` spring.cache.type=none spring.datasources.dataservices.jpa.properties.hibernate.cache.use_second_level_cache=false spring.datasources.dataservices.jpa.properties.hibernate.cache.use_query_cache=false spring.datasources.dataservices.jpa.properties.hibernate.cache.region.factory_class=none spring.datasources.dataservices.jpa.properties.hibernate.cache.hazelcast.instance_name=none ``` |
```

#### Disable Jobs

Disables Data Services jobs **but not the scheduler itself**. It means that you can still add your custom jobs.

See [jobs properties](#jobs-configuration) for advanced configuration.

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` dataservices-no_jobs ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.dataservices.jobs.enabled=false ``` |
```

#### Disable Liquibase

Disables initial database creation/migration. this is useful especially for cluster-safe setup of multi instance servers.

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` dataservices-no_liquibase ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` spring.datasources.dataservices.liquibase.enabled=false ``` |
```

#### Enable RPC

Enable all available RPC operations and usage of SpEL expressions in them. For information about available operations see [this link](#json-rpc-endpoint).

You may want to disable some of RPC operations or enable custom ones. For this case override following property with list of desired operations:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.dataservices.json-rpc.allowed-operations= ``` |
```

In case you would want just prohibit SpEL expressions from RPC operations use following property:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` mgmtp.a12.dataservices.json-rpc.spel.enabled=false ``` |
```

See [RPC Properties](#RPC-properties) for additional information.

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` dataservices-rpc ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` mgmtp.a12.dataservices.jsonRpc.enabled=true mgmtp.a12.dataservices.json-rpc.spel.enabled=true mgmtp.a12.dataservices.json-rpc.allowed-operations=* ``` |
```

#### Active Content Store Standalone Mode Integration

With this profile enabled, `Dataservices` attachment repository will choose standalone-mode implementation, including all properties for supporting communication between `Dataservices` and standalone `Content Store` service.

Please note that, this profile also includes required UAA properties to initialize `Content Store Client`

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` dataservices-standalone_contentstore ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` mgmtp.a12.dataservices.attachments.ext.contentstore.embedded.enabled=false mgmtp.a12.dataservices.contentstore.server.api.enabled=true mgmtp.a12.dataservices.contentstore.client.configuration.remote-url=http://${config.contentstore.host:localhost}:${config.contentstore.port:9090}/cs mgmtp.a12.dataservices.attachments.thumbnail.optimization.baseUrl=${mgmtp.a12.dataservices.contentstore.client.configuration.remote-url} ``` |
```

#### Set Up UAA

Set up default UAA configuration.

Profile Name

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` dataservices-uaa ``` |
```

Profile Content

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` mgmtp.a12.uaa.authorization.authorizationDefinition=classpath:/uaa/authorizationDefinition.json mgmtp.a12.uaa.authentication.backend.enabled=true mgmtp.a12.uaa.authentication.backend.grant-super-user-privileges.enabled=true mgmtp.a12.uaa.authentication.unsecured.urls=/api/attachment/thumbnail/**,/cs/download/**,/api/monitored-properties ``` |
```

## JSON-RPC Endpoint

* [Operation Overview](#json-rpc-processing-operation)
* [JSON-RPC 2.0 Methods](#rpc-operations)

### JSON-RPC Endpoint and Operations

With the JSON-RPC endpoint you can send multiple operations to the server that will be executed in a sequence in a single transaction.

### Idempotency

JSON-RPC operations are executed in non-idempotent mode by default because otherwise it may have impact on performance. By providing the HTTP header `Request-Id` (see [Header of the Request](#header-of-the-request)) the endpoint is instructed to execute every request with the same `Request-Id` only once (which is sort of idempotency) but the return code is different for the executing request (`200` if success) and the rejected ones (`409 Conflict`).
The cleanup of `Request-Id` entries that remained due to server shut-down can be enforced by the server initialization configuration (see [Other Initialization Properties](#Other-initialization-properties)).

### Header of the Request

The JSON-RPC endpoint reads non-mandatory `Request-Id` HTTP request header which should contain unique request id. It is recommended to use
UUID but DS does not enforce it. If the `Request-Id` is present the request will be executed in (quasi) idempotent mode.

### Body of the Request

The body of the request for the JSON-RPC endpoint follows the specification of the JSON-RPC 2.0. Please check the [JSON-RPC specification](https://www.jsonrpc.org/specification).

* `request`: Array with elements of type:

  + `jsonrpc`: The version of the JSON-RPC implementation. If present, must be set to "2.0"
  + `id` (required): A string that is a unique identification in the operation.
  + `method` (required): Operation type identification.
  + `params` (required): Type, dependent on operation.

The substructure of the `params` attribute is completely defined by its operation.

The structure of `parameter` is defined by the specific operation type.

### Response of the JSON-RPC Request

The JSON-RPC endpoint returns responses according to the JSON-RPC 2.0 specification. For full details, refer to the [JSON-RPC specification](https://www.jsonrpc.org/specification).

Operations may return a result, but for commands that do not produce data, the result will be `null`.

### Common JSON Types

Common JSON Types are JSON structures that can be found in several core operations. These structures provide data which is commonly needed in the operations.

**Simple Types**

ModelRef and DocumentReference are strings.

`LinkDescriptor` type describes the link but not in the unique way.

* `relationshipModel` : ModelRef
* `entities` : Array (of size 2) of structure

  + `role` : String
  + `docRef` : DocumentReference
* `linkDocumentDocRef`: The document reference of the link document, if any.
* `predecessorLinkRef`: A string that represents the link that should be the predecessor of this link.
* `position`: The link position (`TOP` or `BOTTOM`) defines that the link will be added at the top or at the bottom of the list of links. If `predecessorLinkRef` is passed, `position` is ignored. If neither `predecessorLinkRef` nor `position` are passed, the position will be considered to be `TOP` by default.

Example of LinkDescriptor

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 ``` | ``` {     "relationshipModel": "ProductCampaign",     "entities": [         {             "role": "Product",             "docRef": "Product/10"         },         {             "role": "Campaign",             "docRef": "Campaign/7"         }     ],     "linkDocumentDocRef": "BusinessPartner/23",     "predecessorLinkRef": "linkId",     "position": "BOTTOM" } ``` |
```

`RelationshipLinkSpec` type is used to reference a link.

* `linkDescriptor`: LinkDescriptor type.
* `id`: A string which is a unique identification of the link.

### Operation

An Operation is any JAVA class annotated with `@RemoteOperation` that has a public method named `rpc`.

The `@RemoteOperation` annotation defines the mandatory attribute `name` that is a unique string, e.g. `ADD_LINK`, referencing the Operation to be called.

All Operations in a request are executed in the same transaction. DS does not support other transaction handling for JSON-RPC requests.

#### Versioning

You can annotate a method in an Operation by `@JsonRpcMethod` where the `value` attribute is a numeric value of the version of the method. Then you can call this version of the Operation by appending `:VERSION_NUMBER`. See following example:

Example of default and versioned method

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` @RemoteOperation(name = "EXAMPLE") public class ExampleOperation {     public String rpc() {     }      @JsonRpcMethod("2") public String rpcV2() {     } } ``` |
```

|  |  |
| --- | --- |
|  | The `@RemoteOperation` annotation does not contain the `@Component` annotation. So, you should either add `@Component` to your implementation or initialize it as a Java `@Bean`. |

Example of calling default and versioned method

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` [     {         "jsonrpc": "2.0",         "id": "defaultVersion",         "method": "EXAMPLE"     },     {         "jsonrpc": "2.0",         "id": "version2",         "method": "EXAMPLE:2"     } ] ``` |
```

In our example, calling the Operation with method name `EXAMPLE` will imply default behavior which is calling method named `rpc` with matching parameters.

On the other side, calling method named `EXAMPLE:2` will lead to lookup for method annotated by `@JsonRpcMethod("2")` where `2` is the version.

#### Operation Execution

Operation execution is driven by the `JsonRpcOperationDispatcher` class which is responsible for the complete execution process.

##### Accepting an Execution Request

The request for executing one or more Operations is represented by a `JsonRpc2Message` object.
This is an entry point object which holds the complete request.

The Operations are executed in the order they were received. If one Operation fails, the whole transaction will fail.
The request will also fail if one of the Operations called is not present in the list of allowed Operations or if it is not defined.

Example of multiple *Operations* that should follow the ordering of *Operations*

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 ``` | ``` [     {         "jsonrpc": "2.0",         "id": "addAirJordanToBreakASweatCampaign",         "method": "ADD_LINK",         "params": {...}     },     {         "jsonrpc": "2.0",         "id": "listLinks",         "method": "QUERY",         "params": {...}     },     {         "jsonrpc": "2.0",         "id": "addTonerToPrintCampaign",         "method": "ADD_LINK",         "params": {...}     } ] ``` |
```

##### Execution

The input parameters of an Operation are defined in the section `params`. These parameters are provided to the bean
that is looked up based on the identifier in the `method` parameter.

Input parameters are deserialized into input types,
and the Operation is executed afterwards. When all Operations have been executed, a map of Operation ids and results is returned.
There is no need to serialize result objects because they will be serialized on higher level into a respective format.

|  |  |
| --- | --- |
|  | An input parameter need to be de-serializable from JSON, whereas results need to be serializable into JSON. Otherwise, it would not be possible to read input parameters from JSON and create response as JSON in a generic way. |

##### Error Handling

When an exception is thrown during the execution of an Operation, an error object is created with all necessary
information, the subsequent Operations are skipped, and the whole transaction is rollbacked.

There are 2 different error types:

###### Known Error

Represented by `RpcException`.

This exception contains the data structure `OperationError` which contains the Operation id and uses it in the error object.
It is recommended to use `RpcException` for all custom Operations because the client already knows the error structure.

You can use utility class `RpcExceptionSupport` which simplifies the exception creation.

###### Unknown Error

Represented by a checked or unchecked exception, which is unknown to the system.

Since this does not provide any detail about the problem, it is converted to a generic error object.

#### Transaction Handling

Before processing the request, the main transaction is started.

If an Operation doesn’t define any transactional behavior
then it will simply join the transaction.

If you need to start nested transaction for example, you just annotate the Operation’s execute method with `@Transactional` annotation and respective propagation flag.

|  |  |
| --- | --- |
|  | Nesting of the transaction is currently not recommended because there are pre-commit checks and rollback processors. Those are in place to validate deferred constraints and to maintain data integrity. Using nested transactions must be done in a way that does not corrupt those mechanisms. |

#### Data Integrity Constraints

Link mutations might result in an inconsistent database state regarding the Relationship Model (RM):

Relationship models define lower and upper limits on the number of documents of a certain model, that can participate in a particular relationship.
These constraints cannot be checked during the execution of a single Operation because it is only required that the whole JSON-RPC request should bring a DB from one valid state to another.

This means: The validations of separated Operations do not matter, only the final state of the transaction must be valid.

Example:
In one JSON-RPC request there might be a couple of `ADD_LINKS` Operations and a couple of `DELETE_LINKS` Operations.
Some of the `ADD_LINK` Operations might violate an upper limit defined in the RM, but those limit violations could be fixed with subsequent `DELETE_LINK` Operations.

Lower and upper limits are implemented as deferred constraints.
The JSON-RPC processing will collect the information about which links have been added and which have been deleted, and the final state will be validated after all Operations have been executed and before the transaction will be committed.

The transaction will be committed if there are no violations, otherwise a rollback ot the transaction will be issued.

|  |  |
| --- | --- |
|  | Links that are added and deleted by `ADD_LINK` or `DELETE_LINK` Operations will be collected in a `LinkRefs` collection. The `LinkRefs` are validated after all Operations have been executed and are available only in the scope of an JSON-RPC request.  Therefore, a direct call of the `ADD_LINK` or `DELETE_LINK` Operation is not recommended because in this case no deferred constraints validation will be performed, and the collections might get corrupted. Validation would either have to be called later, or the collections need to be cleared after such a call. |

|  |  |
| --- | --- |
|  | Due to multiple problems with the data integrity checks, the first iteration of relationship will not support `lower limit` feature. |

#### Implementing a Custom Operation

JSON-RPC methods are extendable, and client projects can implement their own Operations.

Artifact `examples-extending-server` contains 2 custom Operation examples (`ECHO` & `GERMAN_BUSINESS_PARTNERS`) which will become available via JSON-RPC Endpoint if the artifact will be available on the classpath.
Those Operations serve as an example of how to implement custom Operations.

The example code is available in `examples-extending-server`:

* `com.mgmtp.a12.dataservices.examples.operation.ExampleEchoOperation`
* `com.mgmtp.a12.examples.query.GermanBusinessPartnersOperation`

|  |  |
| --- | --- |
|  | It is necessary to add the custom Operation to the list of allowed Operations in [`mgmtp.a12.dataservices.jsonRpc.allowedOperations`](#RPC-properties). |

#### Placeholder Resolution

Data Services JSON-RPC enables referencing results from previous Operations to build complex requests. This uses SpEL expressions, restricted for security, allowing only access to properties stored in the request context by earlier Operations using their ids.

Example of referencing the result of a previous Operation

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 ``` | ``` [     {         "jsonrpc": "2.0",         "method": "ADD_DOCUMENT",         "id": "AddBrand",         "params": {             "document": {                 "Brand": {                     "name": "Adidas",                     "taxId": "123456789"                 }             },             "documentModelName": "DomainBrand",             "locale": "en"         }     },     {         "jsonrpc": "2.0",         "id": "AddAddidasToProduct",         "method": "ADD_LINK",         "params": {             "linkDescriptor": {                 "relationshipModel": "ProductBrand",                 "entities": [                     {                         "role": "ProductRole",                         "docRef": "Product/123"                     },                     {                         "role": "BrandRole",                         "docRef": "#{#AddBrand.metadata.docRef}"                     }                 ]             }         }     } ] ``` |
```

The result of the `AddBrand` Operation is `docRef` which is used inside the `AddAddidasToProduct` Operation by the statement `#{#AddBrand.metadata.docRef}`, where
`AddBrand` is a reference to the Operation id (must be executed in the same request) and `docRef` is the identification of the created document.
Each Operation has a different result set, therefore the creator of the request must make sure that the content for a field and the resolved SpEL expression match the requirement.

By default, SpEL functionality is disabled. To enable it you need to use the configuration property `mgmtp.a12.dataservices.jsonRpc.spel.enabled`.

##### Exception Handling

If there is a syntax error, or the placeholder can’t be resolved, we will throw the error of SpEL to the client.
The following code snippet shows the error case when placeholder can’t be resolved.

Example of SpEL error

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` {     "title": {         "key": "rpc.operation.error",         "default": "JSON-RPC request failed and rollback was performed"     },     "description": {         "key": "error.convert.json",         "default": "SpEL evaluation error occurred!"     } } ``` |
```

##### SpEL Example

Let’s assume we have two Operations which are called `ADD_OBJECT` and `ADD_OBJECT_REFERENCE`.

The responses of these Operations are just the created ids, which means that the response object of the Operation outcome would be of type String. But the result of `ADD_OBJECT`, which will be stored in the context, will be an object that holds the object id in the field `docRef` of type String and the creation date in the field `createdAt` of type Date.

This means that the Operation `ADD_OBJECT_REFERENCE` has access to the attributes `docRef` and `createdAt` of the object created by the Operation `ADD_OBJECT`.

Example of SpEL usage

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 ``` | ``` [     {         "jsonrpc": "2.0",         "id": "createFirstObject",         "method": "ADD_OBJECT",         "params": {             "object": {                 "value": "some Text"             }         }     },     {         "jsonrpc": "2.0",         "id": "createSecondObject",         "method": "ADD_OBJECT_REFERENCE",         "params": {             "object": {                 "value": "regularValue",                 "referencedObjectId": "#{#createFirstObject.metadata.docRef}",                 "referencedObjectCreation": "#{#createFirstObject.metadata.createdAt}"             }         }     } ] ``` |
```

##### Implementation

The Java class `AddDocumentOperation` has to put an object of type `DataServicesDocument` in the context, and this is how it should be done:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` OperationContextHolder.put(dataservicesDocument); ``` |
```

With the help of SpEL we then have access to all the fields of the result object and can get the id (docRef) of the object.

#### Dispatching Requests From The Client-Side

Data Services provides a convenience wrapper for dispatching requests in a type-safe way. Both REST and JSON-RPC requests are supported.

|  |  |
| --- | --- |
|  | Using this API always assumes a configured `ServerConnector` (provided by the `@com.mgmtp.a12.utils/utils-connector` package). |

##### REST

When dispatching any kind of rest request, the method `Dispatcher.rest(<request>, <typeguard>)` can be used, e.g. like so:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` import { Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/dispatch/index.js"; import type { RestRequestPayload } from "@com.mgmtp.a12.utils/utils-connector/lib/main/index.js";  const myRequest: RestRequestPayload = { ... }  type MyResponseType = { ... } const isMyResponse = (value: unknown): value is MyResponseType => ...  const myResponse = await Dispatcher.rest(myRequest, isMyResponse); ``` |
```

The wrapper will fetch the request via the server connector and assert that the given typeguard matches the response before returning it.

|  |  |
| --- | --- |
|  | Because any kind of request can be made here (as long as it matches the `RestRequestPayload` type), you are responsible for providing the correct typeguard for the response, e.g. the wrapper does not stop you from passing a request of type `A` with a typeguard for response `B` (which probably always fails at runtime). |

##### JSON-RPC

When dispatching standard rpc requests provided by Data Services, the method `Dispatcher.rpc(<language>, [<request>,…​])` can be used. Consider the following example:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` import { Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/dispatch/index.js"; import type { DocumentJsonRpc2Request } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Document/index.js";  const currentLanguage = "<language of current user>"  const addDocumentRequest: DocumentJsonRpc2Request.AddJsonRpc2Request = { ... } const [addDocumentResponse] = await Dispatcher.rpc(currentLanguage, [addDocumentRequest]); ``` |
```

Like above, the wrapper will fetch all given requests and assert the type of each response according to its corresponding request.
Since we’re dispatching a single request of type `ADD_DOCUMENT`, typescript is able to infer the response typing for it:

* the return value of the wrapper call is an array with length 1 (a single response)
* the single element of the array has a specific type (because the request also had a specific type)

This also works when you want to dispatch multiple requests and/or the typing of the request can be one of multiple. Consider this example:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` import { Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/dispatch/index.js"; import type { DocumentJsonRpc2Request } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Document/index.js";  // some logic here that decides which type of request to do const addOrModifyRequest: DocumentJsonRpc2Request.AddJsonRpc2Request | DocumentJsonRpc2Request.ModifyJsonRpc2Request = { ... } const deleteRequest: DocumentJsonRpc2Request.DeleteJsonRpc2Request = { ... }  const [addOrModifyResponse, deleteResponse] = await Dispatcher.rpc(currentLanguage, [addOrModifyRequest, deleteRequest]); ``` |
```

Again, both responses are typed correctly: The first one is either a `ADD_DOCUMENT` or `MODIFY_DOCUMENT` response (as the request might have been either one), whereas the second response is definitely a `DELETE_DOCUMENT` response (because here the request was specific).

|  |  |
| --- | --- |
|  | To be able to infer the correct response typing for a request, typescript needs to know about every typing. For this reason, the rpc dispatcher only supports passing the request typings provided by Data Services. Trying to use custom requests here will produce compile and runtime errors. |

#### Modifying / Replacing Rpc Requests From The Client-Side

The `RequestFilter` API of the `ServerConnector` from the `@com.mgmtp.a12.utils/utils-connector` package provides low-level access to request modifications (from modifying single parameters of an operation to completely replacing them). Consider the following example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 ``` | ``` import { JsonRpc2Request } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/json-rpc/index.js"; import type { QueryJsonRpc2Request } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/query/Request.js"; import type { RequestFilter } from "@com.mgmtp.a12.utils/utils-connector/lib/main/index.js";  export const MyCustomRequestFilter: RequestFilter = { 	canHandleRequest({ request }) { 		if (typeof request.body !== "string") { 			return false; 		}  		const json = JSON.parse(request.body);          // we only want to change requests where the body contains rpc requests 		return Array.isArray(json) && json.every(JsonRpc2Request.isInstance); 	}, 	doRequestFilter({ request }) {          // this assertion is "allowed" because we check the type above 		const rpcArray = JSON.parse(request.body as string) as JsonRpc2Request[];  		const customizedRpcs = rpcArray.map(rpc => (isQueryRequest(rpc) ? customizeQuery(rpc) : rpc));  		return { 			request: { 				...request, 				body: JSON.stringify(customizedRpcs) 			}, 			continue: true 		}; 	} };  // the typeguard that defines which kind of requests we want to look at function isQueryRequest(value: JsonRpc2Request): value is QueryJsonRpc2Request { 	return JsonRpc2Request.isInstance(value) && value.method === "QUERY"; }  // the actual customization function customizeQuery(rpc: QueryJsonRpc2Request) { 	return { 		...rpc, 		params: { 			...rpc.params, 			query: { 				...rpc.params.query, 				customized: "yes" 			} 		} 	}; } ``` |
```

In this code snippet, a `RequestFilter` is defined that will customize any rpc operation of type "QUERY" it encounters.

Here, the actual customization is just adding a property "customized" for illustration purposes. In reality, you could transform the request in any way you like (for example, remove certain parameters, or add new ones).

Instead of modifying the request, you can also replace it with a different one (for example, to replace all rpc operations of type "METHOD" with your own operation type "MY\_CUSTOM\_METHOD").
In the same way, you could also transform the header of the request.

|  |  |
| --- | --- |
|  | When heavily modifying or replacing requests, make sure to still return the correct response! Since the caller does not know about your modification, it might break when you violate its assumptions about how the response will look like.  For example, client-side code that dispatches some kind of `"LIST_THINGS"` request will probably expect an array of "things" to be returned in the response. If your custom filter modifies this request in such a way that the response now includes only a single "thing", it would break when the calling client-side code accesses the response. |

With your filter defined, make sure to pass it into your `ServerConnector` during initialization.

For example, when defining your own connector, it could look like this:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` import { 	ConnectorLocator, 	RestServerConnector } from "@com.mgmtp.a12.utils/utils-connector/lib/main/index.js";  // passing the filter from the example above const serverConnector = new RestServerConnector("./myApi", [MyCustomRequestFilter, /* other request filters you might have */]); ConnectorLocator.createInstance(serverConnector); ``` |
```

When using a configuration mechanism that sets up the `ServerConnector` for you (for example, using UAA), look for a configuration setting that allows providing request filters (e.g. a property called `additionalRequestFilters`) and pass your custom filter there.

|  |  |
| --- | --- |
|  | While this approach is powerful in the sense that it allows modification of all requests (that are dispatched through the `ServerConnector`), its low-level nature also means that request modification based on certain conditions may not be possible (for example, when adding a certain request parameter depends on who dispatched the request on the client-side). |

### JSON-RPC 2.0 Core Operations

|  |  |
| --- | --- |
|  | Parameters marked with  are mandatory and should not be omitted nor `null`. Other parameters (marked with ) can be bypassed or set to `null`. |

* [RELINK\_DOCUMENT](#rpc_relink_document) • [ADD\_LINK](#rpc_add_link) • [DELETE\_LINK](#rpc_delete_link) • [MODIFY\_LINK](#rpc_modify_link) • [LOAD\_ATTACHMENT\_HEADER](#rpc_load_attachment_header) • [LOAD\_THUMBNAIL\_URL](#rpc_load_thumbnail_url) • [LOAD\_ATTACHMENT\_URL](#rpc_load_attachment_url) • [MODIFY\_DOCUMENT](#rpc_modify_document) • [PARTIAL\_MODIFY\_DOCUMENT](#rpc_partial_modify_document) • [MULTI\_DELETE\_DOCUMENTS](#rpc_multi_delete_documents) • [GET\_DOCUMENT](#rpc_get_document) • [ADD\_DOCUMENT](#rpc_add_document) • [DELETE\_DOCUMENT](#rpc_delete_document) • [VALIDATE\_DOCUMENT](#rpc_validate_document) • [COPY\_DOCUMENT](#rpc_copy_document) • [QUERY](#rpc_query)

#### RELINK\_DOCUMENT

Change the link assignment for a specific document. It deletes the link by `linkRef` reference and adds a new link which
is defined by `linkDescriptor`.

* The operation reports an error if the `linkRef` references a link that does not exist,
  because the link document must be reused for newly created link.
* The operation reports an error if the `linkDocument` is required in the new relationship,
  but it is not present in the old link.

The operation fires the following events: [`RelationshipLinkAfterCreateEvent, RelationshipLinkAfterDeleteEvent`](#events).

For `relationshipModel` parameter, the error response will different for null and empty value.

##### Parameters

*linkDescriptor*: `com.mgmtp.a12.dataservices.relationship.spec.LinkDescriptor`
:   Descriptor of the new link (must contain the desired document reference of linkRef).

*linkRef*: `java.lang.String`
:   The reference to the link that needs to be moved.

##### Result

`com.mgmtp.a12.dataservices.relationship.spec.RelationshipLinkSpec`: The `RelationshipLinkSpec` of a new link.

##### Call sequence

![link relinkDocumentOperationSequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/images/link_relinkDocumentOperationSequence.svg)

Figure 1. Sequence of RELINK\_DOCUMENT calls.

|  |  |
| --- | --- |
|  | This sequence is compliant with the default settings without caches and with rpc enabled which should show most of the events and security checks. Using different configuration could lead to different results. |

#### ADD\_LINK

Link two documents together.

To add a link you need to have a Relationship Model (`link.linkDescriptor.relationshipModel`) which defines the document models and their
subtypes that can be linked together.

Additionally, you should specify exactly two roles, each of which consist of the role name (`link.linkDescriptor.entities.role`)
and the DocumentReference of the linked document (`link.linkDescriptor.entities.docRef`).

You can also add a link document which contains the link metadata.

If the `unbounded` field in the RM is false, the RM can also define an upper limit of links for
a document of a role. Then the number of links for a document must not be exceeded for this role. This maximum number is defined
in the RM under `upperLimit`.

This operation does not ensure the deferred data integrity constraints (upper limit). Instead, the ADD LINK operation fires
events that fill a ThreadLocal collection, which is used by `RelationshipLinkOperationValidator` only after all the operations are finished.
Calling this operation directly therefore might corrupt link integrity and cause issues with subsequent RPC operations due to the usage of
ThreadLocal collections for validation.

##### Parameters

*linkDescriptor*: `com.mgmtp.a12.dataservices.relationship.spec.LinkDescriptor`
:   The LinkDescriptor.

*linkDocument*: `com.fasterxml.jackson.databind.JsonNode`
:   An object of type JsonNode that represents the document.

##### Result

`com.mgmtp.a12.dataservices.relationship.spec.RelationshipLinkSpec`: The result is the RelationshipLinkSpec of the newly created link.

##### Call sequence

![link addLinkOperationSequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/images/link_addLinkOperationSequence.svg)

Figure 2. Sequence of ADD\_LINK calls.

|  |  |
| --- | --- |
|  | This sequence is compliant with the default settings without caches and with rpc enabled which should show most of the events and security checks. Using different configuration could lead to different results. |

#### DELETE\_LINK

Delete one link of the relationship.

If the link doesn’t exist, the operation silently finishes without error to achieve idempotent behavior.

If there is no error the result will always return the status code 200 regardless if the link has been found or not.

Deletes a relationship link as specified by the given RelationshipLinkSpec.
If a non-existing link id is provided in `relationshipLinkSpec.getId()`, authorization will not be applied because there is no authorization for a non-existing link.

`relationshipLinkSpec.getLinkDescriptor().getRelationshipModel()` will not be evaluated for authorization until a valid link id is provided in `relationshipLinkSpec`.

##### Parameters

*linkRef*: `com.mgmtp.a12.dataservices.relationship.spec.RelationshipLinkSpec`
:   the specification containing all link information

##### Result

`void`:

##### Call sequence

![link deleteLinkOperationSequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/images/link_deleteLinkOperationSequence.svg)

Figure 3. Sequence of DELETE\_LINK calls.

|  |  |
| --- | --- |
|  | This sequence is compliant with the default settings without caches and with rpc enabled which should show most of the events and security checks. Using different configuration could lead to different results. |

#### MODIFY\_LINK

Modify the `linkDocument` of a link.

The operation fires the following events: [`ModelAfterLoadEvent`,`RelationshipLinkAfterUpdateEvent`](#events).

The `linkDocument` must be null when the link document model is null, but it must be provided if the model is specified.
Otherwise RelationshipLinkDocumentNotAllowedException or RelationshipLinkDocumentMissingException will be thrown.

For `relationshipModel` parameter, the error response will different for null and empty value.

##### Parameters

*linkRef*: `com.mgmtp.a12.dataservices.relationship.spec.RelationshipLinkSpec`
:   The `RelationshipLinkSpec` that contains all link information.

*linkDocument*: `com.fasterxml.jackson.databind.JsonNode`
:   An object of type `JsonNode` that represents the link document.

##### Result

`void`:

##### Call sequence

![link modifyLinkOperationSequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/images/link_modifyLinkOperationSequence.svg)

Figure 4. Sequence of MODIFY\_LINK calls.

|  |  |
| --- | --- |
|  | This sequence is compliant with the default settings without caches and with rpc enabled which should show most of the events and security checks. Using different configuration could lead to different results. |

#### LOAD\_ATTACHMENT\_HEADER

Get AttachmentHeader of the attachment by attachmentId.

##### Parameters

*attachmentId*: `java.lang.String`
:   The attachment id.

*docRef*: `com.mgmtp.a12.dataservices.document.DocumentReference`
:   The reference of the document to which the attachment is assigned.

##### Result

`com.mgmtp.a12.dataservices.attachment.AttachmentHeaderSpec`: Object of type AttachmentHeader.

##### Call sequence

![attachment loadAttachmentHeaderOperationSequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/images/attachment_loadAttachmentHeaderOperationSequence.svg)

Figure 5. Sequence of LOAD\_ATTACHMENT\_HEADER calls.

|  |  |
| --- | --- |
|  | This sequence is compliant with the default settings without caches and with rpc enabled which should show most of the events and security checks. Using different configuration could lead to different results. |

#### LOAD\_THUMBNAIL\_URL

Get AttachmentThumbnailUrl which contains all thumbnail URLs of an attachment.

##### Parameters

*attachmentId*: `java.lang.String`
:   The attachment id.

##### Result

`com.mgmtp.a12.dataservices.attachment.AttachmentThumbnailUrl`: Object of type AttachmentThumbnailUrl with properties:
`smallThumbnailUrl`:: type String,
`bigThumbnailUrl`:: type String.

##### Call sequence

![attachment loadThumbnailUrlOperationSequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/images/attachment_loadThumbnailUrlOperationSequence.svg)

Figure 6. Sequence of LOAD\_THUMBNAIL\_URL calls.

|  |  |
| --- | --- |
|  | This sequence is compliant with the default settings without caches and with rpc enabled which should show most of the events and security checks. Using different configuration could lead to different results. |

#### LOAD\_ATTACHMENT\_URL

Get URL of attachment from Data Services. The link should be considered to be secure, which means that it should be unpredictable and only temporarily accessible.

##### Parameters

*attachmentId*: `java.lang.String`
:   The attachment id.

*docRef*: `com.mgmtp.a12.dataservices.document.DocumentReference`
:   The reference of the document to which the attachment is assigned.

##### Result

`com.mgmtp.a12.dataservices.attachment.DataServicesAttachmentURL`: Object of type DataServicesAttachmentURL.

##### Call sequence

![attachment loadAttachmentUrlOperationSequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/images/attachment_loadAttachmentUrlOperationSequence.svg)

Figure 7. Sequence of LOAD\_ATTACHMENT\_URL calls.

|  |  |
| --- | --- |
|  | This sequence is compliant with the default settings without caches and with rpc enabled which should show most of the events and security checks. Using different configuration could lead to different results. |

#### MODIFY\_DOCUMENT

Update the content of the document.

The operation fires the following events during document modification: [`DocumentBeforeUpdateEvent, DocumentAfterUpdateEvent, DocumentAfterRepositoryLoadEvent`](#events).

##### Parameters

*docRef*: `com.mgmtp.a12.dataservices.document.DocumentReference`
:   The reference to the document that should be updated in the format `DocumentModel/DocumentId`.

*document*: `com.fasterxml.jackson.databind.JsonNode`
:   A document in JSON format.

*locale*: `java.util.Locale`
:   The locale against which the document will be validated (language of the locale must be present in
    the language definition of the document model).

##### Result

`void`:

##### Call sequence

![document modifyDocumentOperationSequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/images/document_modifyDocumentOperationSequence.svg)

Figure 8. Sequence of MODIFY\_DOCUMENT calls.

|  |  |
| --- | --- |
|  | This sequence is compliant with the default settings without caches and with rpc enabled which should show most of the events and security checks. Using different configuration could lead to different results. |

#### PARTIAL\_MODIFY\_DOCUMENT

Modify an existing document by specifying the parts that will be added, modified, or deleted.

Possible changes are:

* Altering the value of an existing field, including setting it to null.
* Adding a new field within an existing group.
* Adding a new field within a non-existent group, which implicitly creates all missing groups.
* Deleting a group or field.

The operation fires the following events during modification of the document: [`DocumentBeforeUpdateEvent, DocumentAfterUpdateEvent,
DocumentAfterRepositoryLoadEvent`](#events).

##### Parameters

*docRef*: `com.mgmtp.a12.dataservices.document.DocumentReference`
:   The reference to the document that should be updated in the format `DocumentModel/DocumentId`.

*documentPart*: `java.util.List`
:   A Set of DocumentPart describing the entity instances to be changed.
    A DocumentPart encapsulates information about a specific segment or attribute within a document, defining how it should be altered.

It consists of:

* path: The path to the segment or attribute within the document structure.
* value: The new value to be assigned to the specified segment or attribute. This can be null, indicating deletion or removal.
* repetitions: An optional array specifying the repetition indices for multivalued attributes.

Example:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` "documentPart": [     {         "path": "/Person/PersonalData/Nationality",         "value": "German",         "repetitions": [1,1,1]     } ] ``` |
```

*locale*: `java.util.Locale`
:   The locale against which the document will be validated (language of the locale must be present in
    the language definition of the document model).

##### Result

`void`:

##### Call sequence

![document partialModifyDocumentOperationSequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/images/document_partialModifyDocumentOperationSequence.svg)

Figure 9. Sequence of PARTIAL\_MODIFY\_DOCUMENT calls.

|  |  |
| --- | --- |
|  | This sequence is compliant with the default settings without caches and with rpc enabled which should show most of the events and security checks. Using different configuration could lead to different results. |

#### MULTI\_DELETE\_DOCUMENTS

Efficiently deletes multiple documents in a single operation. It is designed to optimize multiple calls to com.mgmtp.a12.dataservices.document.operation.internal.DeleteDocumentOperation.
This optimization is achieved by avoiding the retrieval of documents from the database, eliminating the associated performance overhead.

If the document is absent, the operation gracefully concludes without triggering any errors, maintaining an idempotent process.
Before removing the document itself, all associated relationship links are deleted. However, it’s important to note that if the document is used as a link document within a relationship, the operation will encounter a failure.

It’s important to be aware that this approach comes with trade-offs. Firstly, it bypasses the standard document Attribute-Based Access Control (ABAC) checks, and secondly, it does
not provide fine-grained control for selecting the appropriate document repository through the com.mgmtp.a12.dataservices.document.persistence.IDocumentRepository#supports(DocumentV2) method. Instead, it is required
to use com.mgmtp.a12.dataservices.document.persistence.IDocumentRepository#supports(String, Optional).

##### Parameters

*docRefs*: `java.util.Collection`
:   A collection of document references to be deleted.

##### Result

`void`:

##### Call sequence

![document multiDeleteDocumentsOperationSequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/images/document_multiDeleteDocumentsOperationSequence.svg)

Figure 10. Sequence of MULTI\_DELETE\_DOCUMENTS calls.

|  |  |
| --- | --- |
|  | This sequence is compliant with the default settings without caches and with rpc enabled which should show most of the events and security checks. Using different configuration could lead to different results. |

#### GET\_DOCUMENT

Get DocumentSpec of the document by its DocumentReference.
This operation is designed especially for getting the content of a single document.

##### Parameters

*docRef*: `com.mgmtp.a12.dataservices.document.DocumentReference`
:   The DocumentReference of requested document.

##### Result

`com.mgmtp.a12.dataservices.document.DocumentSpec`: An object of type DocumentSpec with properties:
`docRef`:: type DocumentReference,
`documentModelName`:: type String,
`document`:: type Document.

##### Call sequence

![document getDocumentOperationSequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/images/document_getDocumentOperationSequence.svg)

Figure 11. Sequence of GET\_DOCUMENT calls.

|  |  |
| --- | --- |
|  | This sequence is compliant with the default settings without caches and with rpc enabled which should show most of the events and security checks. Using different configuration could lead to different results. |

#### ADD\_DOCUMENT

Create a new document of particular model. The handling of the document could vary depending on the model, where
the com.mgmtp.a12.dataservices.document.DocumentService will find all implementations of
the com.mgmtp.a12.dataservices.document.persistence.IDocumentRepository and take the first one which supports the document
model of the persisted document.

The operation fires the following events during document creation: [`DocumentBeforeCreateEvent,DocumentAfterCreateEvent`](#events).

|  |  |
| --- | --- |
|  | This operation is now used to create a document using JSON format instead of formerly used `/docs/:DOCUMENT_MODEL` endpoint. |

##### Parameters

*documentModelName*: `java.lang.String`
:   Model of the document.

*document*: `com.fasterxml.jackson.databind.JsonNode`
:   Content of the document.

*locale*: `java.util.Locale`
:   The locale for document validations and computations.

##### Result

`com.mgmtp.a12.dataservices.document.DocumentReference`: In case no error occurs the response will contain the docRef of the newly created document.

##### Call sequence

![document addDocumentOperationSequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/images/document_addDocumentOperationSequence.svg)

Figure 12. Sequence of ADD\_DOCUMENT calls.

|  |  |
| --- | --- |
|  | This sequence is compliant with the default settings without caches and with rpc enabled which should show most of the events and security checks. Using different configuration could lead to different results. |

#### DELETE\_DOCUMENT

Delete an existing document. If the document doesn’t exist, the operation silently finishes without error to achieve idempotent behavior.

All relationship links in which the document participates will be deleted before the deletion of the document itself.

The operation fires the following events during document deletion: [`DocumentBeforeDeleteEvent, DocumentAfterDeleteEvent, DocumentAfterRepositoryLoadEvent`](#events).

##### Parameters

*docRef*: `com.mgmtp.a12.dataservices.document.DocumentReference`
:   Reference to the document that should be updated in format `DocumentModel/DocumentId`.

*locale*: `java.util.Locale`
:   The locale against which the document will be validated.

##### Result

`void`:

##### Call sequence

![document deleteDocumentOperationSequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/images/document_deleteDocumentOperationSequence.svg)

Figure 13. Sequence of DELETE\_DOCUMENT calls.

|  |  |
| --- | --- |
|  | This sequence is compliant with the default settings without caches and with rpc enabled which should show most of the events and security checks. Using different configuration could lead to different results. |

#### VALIDATE\_DOCUMENT

Validate the JSON document.

|  |  |
| --- | --- |
|  | This operation results in the Data Services JSON version of the Kernel validation result IDocumentValidationResult from artifact `kernel-md-runtime-api`. This is done so that the result of the operation will not be directly dependent on the Kernel API. This means that any change of the kernel interfaces will not lead to breaking changes in the result of the operation. |

|  |  |
| --- | --- |
|  | It is possible to also include a custom condition to the validation by implementing `com.mgmtp.a12.kernel.md.rt.api.ICustomConditionFactory` interface as a bean. Spring will discover all beans of `ICustomConditionFactory` interface and inject them to the Kernel validation engine. For more information about Custom conditions please see Kernel documentation. |

##### Parameters

*documentModelName*: `java.lang.String`
:   The document model name of the document to validate.

*document*: `com.fasterxml.jackson.databind.JsonNode`
:   A document in JSON format.

*partial*: `java.lang.Boolean`
:   Non-mandatory boolean flag indicating that the document has been provided partially, which is supposed
    to be considered during validation. By default, full document validation will be executed.

*locale*: `java.util.Locale`
:   The locale against which the document will be validated (language of the locale must be present in
    the language definition of the document model).

##### Result

`java.util.List`: The result is a list of `DocumentValidationError` which contains:

`errorText`
:   a string mapped from Kernel error text,

`errorCode`
:   a string mapped from Kernel error code,

`messageType`
:   a string mapped from Kernel message type,

`rulePath`
:   a string mapped from Kernel rule path,

`referencedFields`
:   a list of referenced field.

##### Call sequence

![document validateDocumentOperationSequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/images/document_validateDocumentOperationSequence.svg)

Figure 14. Sequence of VALIDATE\_DOCUMENT calls.

|  |  |
| --- | --- |
|  | This sequence is compliant with the default settings without caches and with rpc enabled which should show most of the events and security checks. Using different configuration could lead to different results. |

#### COPY\_DOCUMENT

Copy the document together with its attachments to a new one with the new DocumentReference.
The attachment IDs stay the same for the new document, but the attachment content is duplicated to be independent of the source document.

The operation fires the following events during document creation: [`DocumentBeforeCreateEvent, DocumentAfterCreateEvent, DocumentBeforeRepositorySaveEvent, DocumentAfterLoadEvent`](#events).

##### Parameters

*docRef*: `com.mgmtp.a12.dataservices.document.DocumentReference`
:   The DocumentReference of the source document.

*locale*: `java.util.Locale`
:   The locale for document validations and computations.

##### Result

`com.mgmtp.a12.dataservices.document.DocumentReference`: In case no error occurs the response will contain the docRef of the newly created document.

##### Call sequence

![document copyDocumentOperationSequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/images/document_copyDocumentOperationSequence.svg)

Figure 15. Sequence of COPY\_DOCUMENT calls.

|  |  |
| --- | --- |
|  | This sequence is compliant with the default settings without caches and with rpc enabled which should show most of the events and security checks. Using different configuration could lead to different results. |

#### QUERY

RPC operation for all requests that use the Data Services Query API.

Executes the query operation to fetch document tree results based on the provided query parameters.

##### Parameters

*query*: `com.mgmtp.a12.dataservices.query.topology.QueryRoot`
:   The query parameters for fetching document results.

##### Result

`com.mgmtp.a12.dataservices.rpc.query.PagedResultSet`: The result set of document tree results.

##### Call sequence

![document queryOperationSequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/images/document_queryOperationSequence.svg)

Figure 16. Sequence of QUERY calls.

|  |  |
| --- | --- |
|  | This sequence is compliant with the default settings without caches and with rpc enabled which should show most of the events and security checks. Using different configuration could lead to different results. |

## Query API

### Glossary

| Term | Explanation | Remark |
| --- | --- | --- |
| index | DS internal structure which holds data for querying. | Data is stored in un-encrypted manner in `document_search` and `document_fields` tables. |
| to index a field | Make a field available for querying, sorting and CDD construction. | By default, all fields are indexed. |
| query selection | Defines constraints using operators defining what data should be loaded. | If no selection is applied all documents from `targetDocumentModel` are matched. |
| query projection | Query projection specifies how the data should be retrieved (complete load of documents, just metadata,…​) and what additional data should be retrieved (add links to selected documents or result should be in the form of CDD instead of a plain document) |  |

### High-level Overview

The Query API is a secure and efficient data retrieval API that allows you to load data from Data Services via various methods, including the JSON-RPC `QUERY` operation, a Java client, a TypeScript client, or direct service calls. The query specification is represented as a JSON object (or Java POJO), with the properties of this object defining the query parameters. The Query API also provides an A12 abstraction, which is used to generate SQL statements for a PostgreSQL database.

The query operation and its underlying search layer are the only secure methods for retrieving documents and links from DS. Each query consists of two main components: selection and projection. Selection determines which documents should be retrieved, while projection adds additional data to the selected documents.

The `QUERY` operation is a query protocol, meaning no default values will be applied if a property is missing (e.g., `paging`, `sort`, …) The client is responsible for providing all required properties. However, the client can define default values for these properties and use them across all queries made to the DS.

![query API high level overview](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/uml/query_API_high_level_overview.svg)

Figure 17. High-level overview

There are two clients of the Query API:

1. "External Client"—This client is external to the DS server. Communication can occur either directly via HTTP or through a proxy, such as the TypeScript or Java client.
2. "Internal Client"—This client runs within the same process as the DS server. It can call the `QueryService` directly, bypassing the HTTP/JSON-RPC overhead.

Both internal and external clients use the same lower-level APIs. The only difference lies in how the Query API is accessed.

The Query API specification is validated, enriched, and then transformed into one or more SQL statements. The number of SQL statements generated depends on the query’s complexity and the selected projection. The results of these SQL queries are mapped to the query result, which is then returned to the client.

#### QUERY JSON-RPC

The `QUERY` operation will address all data retrieval needs for external clients.

Both Java and TypeScript clients are provided for the `QUERY` operation, which handle the mapping of requests and responses for the `QUERY` operation. Some queries require a localization specification, as they work with localized enumerations. In such cases, the localization must be provided via the `Accept-Language` header in the HTTP request.

|  |  |
| --- | --- |
|  | The `Accept-Language` header has to be set to a valid A12 locale, e.g. using the locale of the current A12 user, because it is checked if the provided locale is present as a locale in the queried document model (DM). If the language is not present, the query will fail with an error. Currently, this check is performed case-insensitively, meaning that `en` and `EN` are treated the same. However, with a locale in upper case no results are found for a query on localized fields. |

##### Request

All DS query capabilities are accessible via the `QUERY` JSON-RPC operation, which accepts a single parameter, `query`, containing the full query specification. The `query` parameter includes the following properties:

1. `targetDocumentModel` (Mandatory): A reference to the document model (DM) type for the root document. Heterogeneity and security rules will be applied (see the Authorization section below).

   1. This property is mandatory because query construction depends on introspection of the model graph, and results must always produce heterogeneous lists based on a single DM root.
2. `sort` (Optional): A specification for sorting the root documents. (See the Sorting section below for more details.)

   1. Sorting is optional because the underlying storage does not require it. However, DS does not apply any default sorting. It is strongly recommended to include a sorting specification in the query. Paging is mandatory, and paging without sorting may lead to inconsistent results.
3. `paging` (Mandatory): Specify the pagination of the query results. (See the Paging section below for more information.)
4. `constraint` (Optional): Defines an expression that limits the query results based on specific operators. (See the Selection section below for more details.)
5. `fields` (Optional): Specifies which subset of fields should be returned for the `document` projection. (See the Projection section below for more details.)
6. `links` (Optional): Specifies which links/documents should be included in the query results. (See the Projection section below for more details.)
7. `projectionName` (Mandatory): A reference to the type of query projection. (See the Projection section below.)

   1. The projection type determines the shape of the result without specification what type we cannot derive the data result shape.
8. `aggregation` (Optional): Allows aggregation functions to be applied on the grouped result set. (See the Aggregation section below for more details.)
9. `exclude` (Optional): This is a flag used for excluding `ROOT` documents from current `document` projection. By default, its value is `false` means `ROOT` documents are included in `query` response `entries` section.

Queries can include nested specifications. At every level, a `targetDocumentModel` must be defined—either directly (as in the root query) or indirectly (via the `links` property or the `has` operator). The `targetDocumentModel` from a higher level serves as the source for the `targetDocumentModel` at the next, lower level in the query.

##### Response

The response contains the following properties:

1. `fullSize` The total count of results matching the query.
2. `page` The pagination object received from the client.

   1. DS does not modify this object.
3. `entries` The root documents returned from the selection.
4. `links` The linked documents and link documents returned from the projection.
5. `otherResults` The other result returned from the projection.

#### Query In the Service Layer

The `query` JSON parameter from the JSON-RPC operation is deserialized into a `QueryRoot` object, which serves as the parameter for the `QueryService`. Additionally, the service layer requires a language parameter, as the HTTP layer sits above the service layer in the architecture.

#### Selection

Selection is specified by the `constraint` property of the `query` (or by the `linkDocumentConstraint` in the `has` operator or in `links` property). The query selection specification is achieved through a combination of nestable operators. Each operator represents a condition that must be satisfied for the query to match results. There are three types of operators available in the Query API:

1. field-aware operators

   1. These operators require a document model (DM) and field references.
2. `has` operator

   1. This operator uses information from the relationship model (RM) and the `relationship_link` table.
3. logic operators

   1. Logical operators combine field-aware and `has` operators into logical expressions.

Example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 ``` | ``` {   "query": {     "targetDocumentModel": "BusinessPartner",     "constraint": {       "operator": "or",       "operands": [         {           "operator": "exact_match",           "field": "/BusinessPartnerRoot/Name",           "value": "Ludovici"         },         {         "operator": "has",         "relationshipModel": "PolicyHolder",         "targetRole": "Contract"         }       ]     }   } } ``` |
```

The `or` logic operator will match if at least one of its operands matches.

1. The `exact_match` operator will match if the value `Ludovici` is found in the field `/BusinessPartnerRoot/Name` of the `BusinessPartner` document model (DM).
2. The `has` operator will match if there is a link between a `BusinessPartner` document and a document of the DM defined in the `Contract` role for the `PolicyHolder` relationship model (RM).

##### Field-Aware Operators

Field-aware operators expect fields from document models (DMs) to construct a query. The DM is not explicitly provided in the parameters of these operators because it is inferred from the query context where the operator is used. If the operator appears in the `constraint`, the DM is the `targetDocumentModel`. The `has` operator, however, can change the DM for its sub-constraints. For more details, refer to the section on the `has` operator.

A field-aware operator for a repeatable field will match if at least one of the repeatable fields satisfies the condition specified by the operator. There is no option right now to change this behavior to match all repeatable fields.

###### Exact Match Operator

The `exact_match` operator matches results based on the following specification:

1. `field` (Mandatory): A kernel path reference to the field.

   1. All kernel data types are supported, except for ranges, as there are specialized operators for those.
   2. `ICustomFieldType` values will be serialized to strings during indexing, and these string values will be used for matching.
2. `value` (Mandatory): Value that matches the field value exactly. There is no substring or partial matching available. For partial matching, use the `simple_search` operator.

   1. The value must not be null or empty. To check for null or empty values, use the `undefined_match` operator.
3. `caseSensitive` (Optional): A boolean flag that specifies whether the match is case-sensitive. (Default is `true`.)

   1. This property is only applicable for `IStringType`, `IEnumerationType` and `ICustomFieldType` fields.
   2. `caseSensitive = true` also means that the locale (i.e., the value of the `Accept-Language` HTTP header of the query request) is interpreted case-sensitively, so that an exact match search on a localized field with `Accept-Language = EN` will return no rows because Kernel prohibits locales that cannot be validated by `LocaleUtils.toLocale(String localeString)`. Data Services therefore strongly recommend to always use locales in the format accepted by `LocaleUtils.toLocale(String localeString)` (i.e. lower case language, upper case country, like `en_US` or `de-BY`).

For example, to match a field `/Fields/Price` must exactly match the value `3000`.

Example of exact\_match operator

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` {     "operator": "exact_match",     "field": "/Fields/price",     "value": "3000" } ``` |
```

The `/Fields/sport` field will match the value `BaSkEtBAlL` without considering case sensitivity. The field type definition is not explicitly specified in the query; it is inferred from the document model (DM).

Example of exact\_match operator with case insensitive

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` {     "operator": "exact_match",     "caseSensitive": false,     "field": "/Fields/sport",     "value": "BaSkEtBAlL" } ``` |
```

The `/BusinessPartnerRoot/CustomerDiscount` field is of type `IEnumerationType`, and the value `90%` must exactly match the localization text specified in the JSON-RPC header. The value is compared based on the localized string, and the match must be exact. If the localization is not provided in the header, localization value will be used for matching instead.

Example of exact\_match operator with enumeration type

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` {     "operator": "exact_match",     "field": "/BusinessPartnerRoot/CustomerDiscount",     "value": "90%" } ``` |
```

**Limitation**:

To avoid issues with overly complicated or lengthy regular expression patterns that databases may reject, a configurable size restriction has been implemented.
This limit is managed via the `mgmtp.a12.dataservices.query.exactMatch.maxInputValueLength=100` property.

|  |  |
| --- | --- |
|  | A note on partial dates:  For the `exact_match` operator partial dates look exactly as they are passed into the database, i.e. a partial date of precision `MONTH_OPTIONAL` has a value of e.g. "2025-00-00". Therefore, it is found if and only if the `value` of the `exact_match` operator is also in this partial date format ("2025-00-00" in the example, searching with a value "2025-01-01" will not return this item). |

###### Range Operators

Range operators match if the value of the indexed field falls within the bounds defined by the `from` and `to` parameters.

Each range operator includes three parameters:

* `field` (Mandatory): A kernel reference to the field.
* `from` (Optional): The lower bound of the range.
* `to` (Optional): The upper bound of the range.

Both `from` and `to` are optional, but at least one must be specified. The range is considered open on the lower end if `from` is not present, and similarly, the range is open on the upper end if `to` is not provided.

Different range operators expect specific types for the `from` and `to` parameters:

* The `double_range` operator expects `INumberType`.
* The `date_range` operator expects `IDateType` or `IDateRangeType`.
* The `datefragment_range` operator expects `IDateFragmentType`.

###### Double Range Operator

The `double_range` operator has the following parameters:

* `from` (Optional, Inclusive): A numeric value representing the lower bound of the range.
* `to` (Optional, Inclusive): A numeric value representing the upper bound of the range.

The operator matches values that fall within the range defined by `from` and `to`.

###### Date Range Operator

The `date_range` operator has the following parameters:

* `from` (Optional, Inclusive): A date value serialized to a string based on the format defined in the document model (DM).
* `to` (Optional, Inclusive): A date value serialized to a string based on the format defined in the DM.
* `value` (Optional, Inclusive): A kernel-formatted value of type `IDateRangeType`, which contains the complete range.

  + This parameter is **mutually exclusive** with the `from` and `to` parameters.

The accepted types for this operator are:

* `IDateType`
* `ITimeType`
* `IDateTimeType`
* `IDateRangeType`

For a match to occur, the value of the `DateRange` must be fully contained within the range specified by the `date_range` operator.

Example of date\_range operator with open upper bound

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` {     "operator": "date_range",     "field": "/Contract/SignedAt",     "from": "2020-01-01" } ``` |
```

Example of date\_range operator with complete range in value property

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` {     "operator": "date_range",     "field": "/Contract/SignedAt",     "value": "2015-01-01/2020-12-31" } ``` |
```

|  |  |
| --- | --- |
|  | A note on partial dates:  The `date_range` operator sees partial date values filled up with defaults. For example, if you pass a value of "2025-00-00" as a partial date with precision `MONTH_OPTIONAL` to the database, it is filled up to "2025-01-01".  Correspondingly, the `from` and `to` values of a `range_operator` on a field with a partial date are also filled up with defaults. Therefore, the same result will be returned when you pass "2025-00-00" or "2025-01-00" or "2025-00-01" or "2025-01-01". |

###### Date Fragment Range Operator

The `datefragment_range` operator has the following parameters:

* `from` (Optional, Inclusive): A date fragment as defined in the document model (DM).
* `to` (Optional, Inclusive): A date fragment as defined in the DM.
* `value` (Optional, Inclusive): A kernel-formatted value of type `IDateFragmentType`, which contains the complete range.

  + This parameter is **mutually exclusive** with the `from` and `to` parameters.

###### Undefined Match Operator

The `undefined_match` operator matches, if the field is either `null`, `empty`, or it is not indexed. DS does not distinguish between these states, as this behavior is determined by the kernel’s (de)serialization configuration and by the fact that empty values (or not indexed values) are not propagated to index for better performance. The `undefined_match` operator has just one parameter:

* `field` (Mandatory): A kernel path reference to the field. If the supplied field value points to a group, the query validation will reject the query. If validation is turned off, and the field points to a group, the behavior of the operator is undetermined.

For example, the `undefined_match` operator matches if `/Fields/sport` is either `null` or `empty`.

Example of undefined\_match operator

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` {     "operator": "undefined_match",     "field": "/Fields/sport" } ``` |
```

##### Simple Search Operator

The `simple_search` operator searches across all **indexed** fields of a document model (DM). It is called "simple" because it provides an easy-to-use interface (one field) for users who are unsure which field contains the searched term. The operator is using substring case-insensitive match algorithm.

###### Parameters

1. `fields` (optional): Specifies the fields to be searched. This is **optional**; by default, the `simple_search` operator will search all available indexed fields of the DM.

   * All kernel data types are included. `INumberType`, `IStringType`, and `IEnumerationType` fields of the DM are included in the search.

     1. `IEnumerationType` fields require localization to be present in the HTTP header of the JSON-RPC request or provided via the service layer. Only localization text matching the query’s locale will be considered for `simple_search` if the `fields` property is specified. Otherwise, the search will be performed on all localized labels.
     2. The operator searches for **enumeration labels**, not enumeration values, since the labels are displayed to the user, not the underlying values.
   * `IDateType` fields be searched, but only in the format defined in DM.
   * **Other field types**, such as `IBooleanType` and `IConfirmType` fields, or `ICustomType` fields are turned into strings.
2. `value` (optional): The search term to be queried. This is a **mandatory** field if `values` is not provided.

   1. There is no query-time or index-time preprocessing applied to the values used in `simple_search`. There is no special handling of any characters (whitespace included). What is specified in the `value` field will be expected to be found in the index (case is ignored).
   2. It must be at least 3 characters long.

      1. While technically possible, querying for terms shorter than 3 characters is blocked by DS to prevent potential DoS (Denial of Service) attacks. DS have a configuration key `mgmtp.a12.dataservices.query.simpleSearch.minSearchableTokenSize` that allows changing this behavior, although it is not recommended. The default value is 3. Searching for smaller characters in larger data sets will cause performance issues.
      2. **Special characters** have no special handling. There is no query parser attached to `value` field.

         1. There is only one exception `~`, which is removed from the value because it is necessary in the underling implementation
3. `values` (optional): A list of search terms to be queried. This is a **mandatory** field if `value` is not provided. This is an alternative to the `value` parameter, allowing multiple terms to be searched simultaneously. The behavior is similar to `value`, but it matches documents containing any of the specified terms (logical OR).

This operator provides a flexible and user-friendly search interface, especially when the exact field containing the searched term is not known. However, it comes with some restrictions, especially regarding the types of fields and the minimum term length.

###### Properties of Simple Search

* **Case insensitivity**: The search is case-insensitive, meaning the case in the document does not need to match the case in the search `value`. For example, searching for "contract" will match "Contract", "CONTRACT", or any another case variation. This also applies to the locale which is passed with the `Accept-Language` HTTP header of the query request: The locales `en` and `EN` are treated identically. But please note, that this will change in future when Data Services will introduce a more strict locale validation. Therefore, it is strongly recommended to always use a locale that can be validated by `LocaleUtils.toLocale(String localeString)`, which demands lower case language and upper case country, like `en_US`.
* **Substring match**: The input string must be a substring of the value in the field being searched. This allows for partial matches within indexed fields.
* **Minimum length**: The search term must be at least 3 characters long. This is to prevent performance issues and potential DoS attacks.
* **No Composed Data Documents (CDD) in the index**: Since `simple_search` does not operate on Composed Data Documents (CDDs), repeatable groups of CDM (Composed Document Models) cannot be included in the search. Only the fields of the `queryRoot` document (CRD) are available for searching.
* **No special character handling**: The search term is treated as a simple string, and no special handling is applied to characters. For example, searching for "contract&name" will not yield results if the indexed field contains "contract name" or "name contract". The `&` character is treated as part of the string.

  + `~` is an exception. I.e. term `Somet~hing` will be changed to `Something`

This is a default search option for search toolbar in Overview, Relationship and Tree Engines.

###### Limitation

To avoid issues with overly complicated or lengthy regular expression patterns that databases may reject, a configurable size restriction has been implemented.

This limit is managed via the `mgmtp.a12.dataservices.query.simpleSearch.maxInputValueLength` property.

###### Behavior Example

This section demonstrates the expected results of a default `simple_search` configuration, providing justifications for what results will be returned based on sample data. For simplicity, we assume the following conditions for our example data:

* **Only simple documents without links**: The data consists of simple documents without any links. Querying for linked documents is done using the `has` operator, which is not relevant for `simple_search`. Therefore, links are excluded from this example.
* **No repeatable groups**: The example data does not contain repeatable groups. While content in repeatable groups would be searchable, we omit these fields for simplicity in this example. This does not affect the results, as the content of repeatable groups is still searchable via `simple_search`.
* **No CDMs (Composed Data Documents)**: `simple_search` operates only on the root group fields of CDMs in the same way it works for regular DMs (Document Models). Since there are no CDMs in this example, this factor does not impact the demonstration.
* **No heterogeneity**: The example assumes that heterogeneity has been resolved during the query enrichment phase, meaning the query will operate against a single **DM**. Therefore, we do not need to consider heterogeneity in this case.

###### Example Data

Enumeration values from the model

| Enum key | Enum en | Enum de |
| --- | --- | --- |
| IT | IT | Informationstechnologie |
| Banking | Banking | Bankwesen |
| Accountancy | Accountancy | Buchhaltung |
| Healthcare | Healthcare | Gesundheitswesen |
| Legal | Legal | Gesetzlich |

Documents and their fields

| DocRef | ContractName (TEXT) | LengthOfContract (NUMBER) | Industry (ENUM) | createdAt (DateTimeType - `yyyy-MM-dd’T’HH:mm:ss`) |
| --- | --- | --- | --- | --- |
| 1 | ContractName | 013 | IT | 2021-10-01T12:00:00 |
| 2 | contract&Name | 012 | Banking | 2022-10-01T12:00:00 |
| 3 | This contr@ct has a ridiculously long contract name without any particular reason | 66.6 | Healthcare | 2023-10-01T12:00:00 |
| 4 | Ludovici Cole Est Frigus | 1 | Legal | 2024-10-01T12:00:00 |
| 5 | tracol | 301200 | Accountancy | 2025-10-01T12:00:00 |
| 6 | Name contract | 012 | IT | 2026-10-01T12:00:00 |

Queries:

| Use-case number | Search term | Documents returned | Justification | Remark |
| --- | --- | --- | --- | --- |
| 1 | `Contract` | 1,2,6 | Not matched documents contain no fields with a value that contains `Contract` search term. | - |
| 2 | `Contract&` | 2 | `&` is a regular character, and the literal `contract&` can only be found in document 2. | Searching for `ract&` will also match only document 2. |
| 3 | `Contract Name` | 3 | Only document 3 contains the searched term `contract name`. | 1,2,4,5,6 do not contain the term completely. |
| 4 | `Name Contract` | 6 | Only document 6 contain a searched term `name contract`. | 1,2,3,4,5 do not contain the term |
| 5 | `Con` | 1,2,3,6 | 1,2,3,6 contain the term. | 4,5 do not contain the term. |
| 6 | Either "Col" or "COL" or "cOL" etc. | 4,5 | 4,5 contain the term. | 1,2,3,6 do not contain the term. |
| 7 | `ridiculously has a` | - | No documents will be matched. For document 3 the search terms are correct but in a wrong order. | - |
| 8 | `Hi I am Al` | - | There is no string like this in the index. | - |
| 9 | `012` | 2,5,6 | 1,6 matched completely, 5 was found in value `301200`. |  |
| 10 | Either "66.6" or "66." or "66" or "6.6" | 3 | `.` is not considered special characters, therefore it can be used in search as is. | - |
| 11 | ` 301 ` | - | Because whitespaces are handled as regular characters. | - |
| 12 | `2021-` | 1 | This value is found in the field `createdAt` of document 1. | - |
| 13 | `01-10-2024` | 0 | Searched term does not have the same format as it was created in. Therefore, document 4 is not matched. | - |
| 14 | `Wes` | 2,3 | The term `Wes` would be found in the localization values `Bankwesen` and in `Gesundheitswesen`, which are assigned via `Banking` and `Healthcare` to documents 2,3, if the `fields` property refers to the `Industry` field and German localization was provided for the Query RPC request.  If `fields` is missing, the documents would match regardless of the localization of the user. | Even US localized user would get match from `de` localized enumeration if `fields` would be missing. |

##### Logic Operators

In the Query API, there are three logic operators available to combine different conditions in a query:

1. `and`: The `and` operator takes two or more operands, and **all** operands must match for the query to match. It is used when you want to enforce multiple conditions that must all be satisfied.
2. `or`:
   The `or` operator also takes two or more operands, but **at least one** operand must match for the query to match. It is used when you want to allow any of the conditions to satisfy the query.
3. `not`: The `not` operator takes a single operand, and the operand must **not** match for the query to match. This is used for negation, where you want to exclude certain results.

Below is an example of a complex query that combines logic operators (`and`, `or`, `not`) with field-aware operators. These examples illustrate how you can build queries that require multiple conditions to be matched or excluded.

In this example, we want to find all **BusinessPartner** documents where:

* The **Name** is equal to "Ludovici".
* The **Industry** is "Technology".
* The **Country** is "Italy".

We use the `and` operator because all conditions must match.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 ``` | ``` {   "query": {     "targetDocumentModel": "BusinessPartner",     "constraint": {       "operator": "and",       "operands": [         {           "operator": "exact_match",           "field": "/BusinessPartnerRoot/Name",           "value": "Ludovici"         },         {           "operator": "exact_match",           "field": "/BusinessPartnerRoot/Industry",           "value": "Technology"         },         {           "operator": "exact_match",           "field": "/BusinessPartnerRoot/Country",           "value": "Italy"         }       ]     },     "projectionName": "document",     "paging": {       "pageSize": 10,       "pageNumber": 1     }   } } ``` |
```

**Explanation**: This query will return documents where the **Name** field matches "Ludovici", the **Industry** field matches "Technology", and the **Country** field matches "Italy". All three conditions must be true for the document to be returned.

Now, let’s say we want to find **BusinessPartner** documents where:

* The **Industry** is either "Technology" **or** "Healthcare".
* The **Country** is not "Italy".

We use the **`or`**, **and**, **not** operators to create a query:

Example of complex query with and, or, not operators

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 ``` | ``` {   "query": {     "targetDocumentModel": "BusinessPartner",     "constraint": {       "operator": "and",       "operands": [         {           "operator": "or",           "operands": [             {               "operator": "exact_match",               "field": "/BusinessPartnerRoot/Industry",               "value": "Technology"             },             {               "operator": "exact_match",               "field": "/BusinessPartnerRoot/Industry",               "value": "Healthcare"             }           ]         },         {           "operator": "not",           "operand": {             "operator": "exact_match",             "field": "/BusinessPartnerRoot/Country",             "value": "Italy"           }         }       ]     },     "projectionName": "document",     "paging": {       "pageSize": 10,       "pageNumber": 1     }   } } ``` |
```

**Explanation**: This query will return documents where the **Industry** is either "Technology" or "Healthcare" **and** the **Country** is not "Italy". The **`or`** operator allows flexibility in the condition, and the **`and`** operator ensures that the **Country** is never "Italy".

The `exact_match` operator was used in all queries for simplicity but any field-aware operator could be used instead.

##### Has Operator

The `has` operator is used to find documents that are linked to other documents through a relationship model (RM) at the current level. This operator is helpful when working with documents that have links to other documents in the system, and it allows querying based on the properties of these linked documents.

The `has` operator operates on the following parameters:

1. `relationshipModel` (Mandatory): This is a reference to the relationship model (RM) that defines the link between two document models (DMs). The user must have the necessary permissions to use this RM.
2. `targetRole` (Mandatory): This refers to the role of the target document in the relationship model (RM). It specifies which side of the relationship is being queried. The `targetRole` points to the document model (DM) of the target side of the relationship. This DM will be enriched by actual DMs from the model graph, and the enriched model will be used as the `targetDocumentModel` of the parent for constraints in the query.
3. `constraint` (Optional): The main query constraint is applied to the target documents identified by the `targetRole` in the RM. This constraint can be any logic or field-aware operator, such as `exact_match`, that applies to the fields of the target document model (DM).
4. `linkDocumentConstraint` (Optional): This constraint is applied to the link document itself, i.e., the document that represents the relationship between the two linked documents. The `linkDocumentConstraint` can also include field-aware operators that apply to the fields of the link document. The `targetDocumentModel` for the `linkDocumentConstraint` is automatically determined based on the `relationshipModel` and is set to the DM specified in the RM for the link document.

The following example illustrates how the `has` operator is used in a query to find **BusinessPartner** documents that are linked to **HomeInsurance** documents (through the `PolicyHolder` relationship model), where the insurer’s name is "ING" and the link document has a non-null `TerminatedAt` field.

Example of has operator

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 ``` | ``` {   "targetDocumentModel": "BusinessPartner",   "constraint": {     "operator": "and",     "operands": [       {         "operator": "exact_match",         "field": "/BusinessPartner/Name",         "value": "Tomas"       },       {         "operator": "has",         "relationshipModel": "PolicyHolder",         "targetRole": "Contract",         "constraint": {           "operator": "exact_match",           "field": "/HomeInsurance/Insurer/Name",           "value": "ING"         },         "linkDocumentConstraint": {           "operator": "undefined_match",           "field": "/InsuranceLinkFields/TerminatedAt"         }       }     ]   } } ``` |
```

Explanation of the Example:

* `targetDocumentModel`: The root document model is `BusinessPartner`. All the fields in the query must be from this model (or its subtypes).
* First Operand of `and` Operator (`exact_match`): The first operand checks if the **Name** of the **BusinessPartner** document is equal to `Tomas`. The query will match only documents from the `BusinessPartner` DM (or its subtypes).
* Second Operand of `and` Operator (`has`): The second operand uses the `has` operator to find linked **HomeInsurance** documents through the `PolicyHolder` relationship model. Specifically, it looks for linked documents where:

  + The `/HomeInsurance/Insurer/Name` of the **HomeInsurance** document is `ING`.
  + The **link document** (represented by the `InsuranceLinkFields` model) has a non-null `/InsuranceLinkFields/TerminatedAt` field. In this example, the `linkDocumentConstraint` is checking this field.

The **`has`** operator cannot create relationships between link documents (e.g., `InsuranceLinkFields`) and other document models (e.g., **HomeInsurance**) outside of the relationship model. Therefore, the `linkDocumentConstraint` cannot apply to relationships that involve link documents directly connected to other DMs.

##### Exclude Option

The `exclude` property in the query root is used to **exclude all root documents** from being included in the selection results while still allowing those documents to be included in projections if defined. This property offers flexibility when constructing complex queries where certain root documents are not required in the selection but may still be relevant for linked data in projections.

By default `exclude` is set to `false`. If it is set to `true` means there is no `ROOT` document in `query` response `entries` section, and pagination in `query` request will be applied to `CHILD` documents in `query` response `links` section. (See the Paging section below for more information.)

Example `query` request with `exclude` is `true`:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 ``` | ``` [     {         "jsonrpc": "2.0",         "id": "QueryLink",         "method": "QUERY",         "params": {             "query": {                 "projectionName": "document",                 "exclude": true,                 "targetDocumentModel": "Contract",                 "constraint": {                     "operator": "exact_match",                     "field": "/__meta/docRef",                     "value": "$(CONTRACT_DOC_REF)"                 },                 "links": [                     {                         "relationshipModel": "ContractCoInsuredPartner",                         "targetRole": "Partner"                     }                 ],                 "paging": {                     "pageNumber": 0,                     "pageSize": 2                 }             }         }     } ] ``` |
```

Example `query` response with pagination is applied to `links` section when `exclude` is `true`. Full size is three but there are only two `CHILD` nodes and related two `LINK` documents in `links` list while `entries` property is empty:

```
|  |  |
| --- | --- |
| ```   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49  50  51  52  53  54  55  56  57  58  59  60  61  62  63  64  65  66  67  68  69  70  71  72  73  74  75  76  77  78  79  80  81  82  83  84  85  86  87  88  89  90  91  92  93  94  95  96  97  98  99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127 128 129 130 131 132 133 134 135 136 137 138 139 140 141 142 143 144 145 146 147 148 149 150 151 152 153 154 155 156 157 158 159 160 161 162 163 164 165 166 167 168 169 170 171 172 173 174 175 176 177 178 179 180 181 182 ``` | ``` [   {     "jsonrpc": "2.0",     "id": "QueryLink",     "result": {       "fullSize": 3,       "page": {         "pageNumber": 0,         "pageSize": 2       },       "entries": [        ],       "links": [         {           "docRef": "BusinessPartner/c04ae5d6-285a-40d7-94f3-9e42a8375fe0",           "relationshipModel": "ContractCoInsuredPartner",           "sourceRole": "Contract",           "sourceDocRef": "Contract/777f9273-575d-4181-8a2f-2021fa4796a3",           "targetRole": "Partner",           "targetDocRef": "BusinessPartner/c04ae5d6-285a-40d7-94f3-9e42a8375fe0",           "document": {             "BusinessPartnerRoot": {               "Industry": "IT",               "PersonOrEntity": "Natural Person",               "TimeOfContractSignature": "23:59:59",               "StartOfRelationship": "2022-06-01",               "CustomerDiscount": "90%",               "Name": "Eva",               "Employment": {                 "income": 3333.33,                 "signingDateTime": "2020-12-31T23:59:59"               },               "SubtypeGroup": {                 "Company": "None"               },               "Attachment": [                 {                   "original_filename": "Attachment4",                   "size": 100,                   "mime_type": "image/jpg",                   "internal_filename": "AttachmentInternal4",                   "description": "Category empty string",                   "category": "",                   "content": "content"                 },                 {                   "original_filename": "ExpectedAttachment",                   "size": 100,                   "mime_type": "image/jpg",                   "internal_filename": "ExpectedAttachment4",                   "description": "Expected attachment to be found",                   "category": "Expected Category",                   "content": "ExpectedContent"                 }               ]             },             "__meta": {               "createdAt": "2025-04-22T06:19:06",               "creator": "admin",               "docRef": "BusinessPartner/c04ae5d6-285a-40d7-94f3-9e42a8375fe0",               "modelReference": "BusinessPartner",               "modelVersion": null,               "modifiedAt": "2025-04-22T06:19:06",               "modifier": "admin"             }           },           "type": "CHILD",           "linkId": "44391b72-ef33-4926-aeda-8ccd03cd6bce",           "depth": 0,           "documentModelName": "BusinessPartner"         },         {           "docRef": "BusinessPartner/194d55bb-7c19-4061-8b70-dfba3edd8e1e",           "relationshipModel": "ContractCoInsuredPartner",           "sourceRole": "Contract",           "sourceDocRef": "Contract/777f9273-575d-4181-8a2f-2021fa4796a3",           "targetRole": "Partner",           "targetDocRef": "BusinessPartner/194d55bb-7c19-4061-8b70-dfba3edd8e1e",           "document": {             "BusinessPartnerRoot": {               "Industry": "IT",               "PersonOrEntity": "Natural Person",               "PremiumPartner": true,               "TimeOfContractSignature": "15:00:00",               "StartOfRelationship": "2022-07-01",               "CustomerDiscount": "90%",               "Name": "Konstantin",               "Employment": {                 "income": 0.01,                 "signingDateTime": "2021-06-30T15:00:00"               },               "SubtypeGroup": {                 "Company": "None"               },               "Attachment": [                 {                   "original_filename": "Attachment2",                   "size": 300,                   "mime_type": "image/jpg",                   "internal_filename": "AttachmentInternal2",                   "description": "Category equals null",                   "category": null,                   "content": "content"                 }               ]             },             "__meta": {               "createdAt": "2025-04-22T06:19:06",               "creator": "admin",               "docRef": "BusinessPartner/194d55bb-7c19-4061-8b70-dfba3edd8e1e",               "modelReference": "BusinessPartner",               "modelVersion": null,               "modifiedAt": "2025-04-22T06:19:06",               "modifier": "admin"             }           },           "type": "CHILD",           "linkId": "002a66fc-9528-4238-8d91-ad6e896d08ed",           "depth": 0,           "documentModelName": "BusinessPartner"         },         {           "docRef": "CoInsuredAdditionalFields/1bac1274-c252-4299-967f-19d05ca1a9b5",           "relationshipModel": "ContractCoInsuredPartner",           "sourceRole": "Contract",           "sourceDocRef": "Contract/777f9273-575d-4181-8a2f-2021fa4796a3",           "targetRole": "Partner",           "targetDocRef": "CoInsuredAdditionalFields/1bac1274-c252-4299-967f-19d05ca1a9b5",           "document": {             "CoInsuredRoot": {               "Name": "Alexander"             },             "__meta": {               "createdAt": "2025-04-22T06:19:12",               "creator": "admin",               "docRef": "CoInsuredAdditionalFields/1bac1274-c252-4299-967f-19d05ca1a9b5",               "modelReference": "CoInsuredAdditionalFields",               "modelVersion": null,               "modifiedAt": "2025-04-22T06:19:12",               "modifier": "admin"             }           },           "type": "LINK",           "linkId": "44391b72-ef33-4926-aeda-8ccd03cd6bce",           "depth": 0,           "documentModelName": "CoInsuredAdditionalFields"         },         {           "docRef": "CoInsuredAdditionalFields/659252c5-919f-4f57-b0ca-1894d918a103",           "relationshipModel": "ContractCoInsuredPartner",           "sourceRole": "Contract",           "sourceDocRef": "Contract/777f9273-575d-4181-8a2f-2021fa4796a3",           "targetRole": "Partner",           "targetDocRef": "CoInsuredAdditionalFields/659252c5-919f-4f57-b0ca-1894d918a103",           "document": {             "CoInsuredRoot": {               "Role": "EXP",               "Name": "Otto"             },             "__meta": {               "createdAt": "2025-04-22T06:19:12",               "creator": "admin",               "docRef": "CoInsuredAdditionalFields/659252c5-919f-4f57-b0ca-1894d918a103",               "modelReference": "CoInsuredAdditionalFields",               "modelVersion": null,               "modifiedAt": "2025-04-22T06:19:12",               "modifier": "admin"             }           },           "type": "LINK",           "linkId": "002a66fc-9528-4238-8d91-ad6e896d08ed",           "depth": 0,           "documentModelName": "CoInsuredAdditionalFields"         }       ],       "otherResults": {        }     }   } ] ``` |
```

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` {   "query": {     "targetDocumentModel": "BusinessPartner",     "exclude": true,     "links": [       {         "relationshipModel": "PolicyHolder",         "targetRole": "Contract"       }     ]   } } ``` |
```

The `exclude` property is particularly useful in scenarios where:
. **Root documents** are required for projection purposes but should not clutter the selection results.
. **Query performance optimization**: By excluding unnecessary root documents from the selection, the query performance can be optimized, especially when the root documents are large or numerous, but their inclusion in the result set isn’t needed.
. **Links need to be paged**. Enabling this property will push `paging` specification to `links` property because it is unnecessary for `entries` since they are skipped.

The exclusion affects only the selection phase of the query. If the excluded documents are referenced in projections (via linked relationships or other document dependencies), they will still appear in those projections.

#### Projection

Once the root documents are resolved, the **projection specification** defines the additional data that should be loaded alongside the root document metadata. Additionally, the projection allows you to customize the structure of the query results by specifying which parts of the data to retrieve, whether it’s the complete document, a subset of fields, or even a custom data graph.

There are several options for projecting data:

1. **Complete Documents**: You can choose to load the full root documents. This is also applicable in nested `links` properties.
2. **Subset of Fields**: Instead of loading the entire document, you can specify which fields of the document should be returned. This is useful when you only need specific pieces of information from a document, reducing the payload size and improving query performance.
3. **Constructing CDD (Composed Data Document)**: Projection can be used to construct a CDD based on the CDM (Composed Document Model) definition. This allows you to retrieve a structured document that conforms to the CDM, with links between related documents represented according to the CDM.
4. **Custom Data Graph**: For more complex use cases, projection allows the creation of a custom data graph. This means you can retrieve documents linked together by relationship definitions other than those specified in the CDM, offering a flexible way to represent the data structure in the query results.

It is possible to write a custom projection. See the extension points section below for more info.

##### Pagination and Projection

It’s important to note that pagination is applied only to the selection phase of the query (i.e., determining which documents are included in the result set). The projection, on the other hand, does not involve pagination. All projected data will be returned in full, regardless of the number of documents selected. This ensures that the query result contains all the necessary data linked to the root documents, without the additional complexity of paginating the projected content. Number of links and documents projected must be restricted in `entityCharacteristics#upperLimit` property of a relationship model.

The Query API enables various projections for the selected roots. DS provides four built-in projections:

* **Document projection**: Offers different methods for loading selected documents. To use this projection set `projectionName` to `document` value.
* **CDD projection**: Generates CDDs as the query result instead of a data graph. To use this projection set `projectionName` to `cdd` value.
* **Document-graph projection**: Utilizes CDM to create a targeted data graph. To use this projection set `projectionName` to `document-graph` value.
* **Export CDD projection**: Generates a link to CSV export stored in content store based on the query specification. The query must be based on the CDM. To use this projection set `projectionName` to `exportCddCsv` value.

##### Document Projection

Document projection defines how the data related to a root document is retrieved. It can either involve loading the entire document from the persistent store during the Post-execution phase, or constructing the document using specific fields from the `document_search` table. This flexibility allows for more efficient data retrieval based on the query’s needs.

The document projection is enabled by providing `document` value in the `projectionName` property in the query root.

###### Fields Property

One way to optimize the query and reduce a data load is by using **Fields property**. Instead of loading the entire document, you can specify a subset of fields to be returned. This is achieved by providing the `fields` property in the query root.

Key characteristics of Fields property:

1. **Indexed Fields**: Only fields that are indexed can be used in fields projection.

   1. By default, all fields are indexed.
2. **Subset of Fields**: The `fields` property allows you to specify exactly which fields from the root document (or its subtypes) should be included in the result. This approach reduces the amount of data returned, optimizing performance and avoiding over-fetching data. This is particularly useful when you want to retrieve a specific portion of the data from the document without the overhead of loading the entire document.
3. **Subtypes and Field Availability**: If you specify fields in a subtype of the `targetDocumentModel`, some documents might not contain those fields due to different subtype could be defined for those documents.

Imagine a query where you only need the name and address of a customer from a larger `BusinessPartner` document. Instead of retrieving the entire document (which might include orders, payment details, etc.), you can specify the `fields` property to only load the `name`, `id` and `Company` fields:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` {   "targetDocumentModel": "Customer",   "fields": ["/BusinessPartnerRoot/Name", "/BusinessPartnerRoot/id", "/BusinessPartnerRoot/SubtypeGroup/Company"] } ``` |
```

In this case, the query will return just the name and id of the `BusinessPartner`, reducing the amount of data retrieved and improving performance. If a matched document will be of `BusinessPartnerCompany` DM (subtype of `BusinessPartner` DM), the field `/BusinessPartnerRoot/SubtypeGroup/Company` will be projected to the result as well.

The implementation expects the values to be un-encrypted. If the field is encrypted, the query will return encrypted values. The custom code in the post-execution phase needs to decrypt the value.

###### Links Property

When using the `links` property in a query, the goal is to return additional related documents, connected through a relationship model (RM) and target role defined in the query. These additional documents (links) are retrieved based on the selection of a root document and its relationships. The `links` property is used to specify how documents should be linked, and any constraints or restrictions to be applied on those links.

Each link definition in the `links` property has the following parameters:

1. `relationshipModel` (Mandatory): Specifies the relationship model (RM) that should be used to find related documents. This value must be a valid string that refers to a specific RM.
2. `targetRole` (Mandatory): Defines the target role in the relationship that should be linked to the root document. Due to self-referencing relationships, this role cannot be inferred from the context and must be explicitly provided for all RMs
3. `constraint` (Optional): Defines the constraints that should be applied to the links (target document). This is similar to the `constraint` property in the root query and allows you to filter links based on specific conditions. If no `constraint` is provided, all links will be returned without restrictions.
4. `linkDocumentConstraint` (Optional): Defines the constraint that should be applied to a link document of a link. If no `linkDocumentConstraint` is provided, all links will be returned without restrictions. This property is only allowed if the relationship defined in `relationshipModel` has a Link Document Model defined.
5. `fields` (Optional): The property allows partially loading document fields without a need to load a complete document. The fields property is applicable to the target documents of the link. The behavior is the same as in the Query Root.
6. `linkDocumentFields` (Optional): The property allows partially loading only desired fields from a link document (if the relationship allows it). The behavior is the same as in the Query Root.
7. `links` (Optional): Allows for further linking to additional documents from the already retrieved links. This creates a recursive or nested linking structure where additional links can be specified for the previously linked documents.

In this example, we retrieve all documents of type `Contract` and their related documents through the `Partner` role of the `PolicyHolder` RM:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 ``` | ``` {   "query": {     "targetDocumentModel": "Contract",     "links": [       {         "relationshipModel": "PolicyHolder",         "targetRole": "Partner"       }     ]   } } ``` |
```

This query will return the first page of all `Contract` documents and all their associated `Partner` documents, based on the `PolicyHolder` RM. The links will be established between the `Contract` documents and the related `BusinessPartner` documents defined by the `Partner` role in the `PolicyHolder` relationship model.

In a more complex scenario, you might want to apply specific constraints to both the root document and the linked documents. In the example below, we first select `Contract` documents and link to `Partner` documents where the `/BusinessPartner/Name` field is `"Ludovici"`. Then, for the related `Partner` documents, we link further documents through the `PermanentAddress` RM where the `Address/City` is `"Berlin"`:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 ``` | ``` {   "query": {     "targetDocumentModel": "Contract",     "links": [       {         "relationshipModel": "PolicyHolder",         "targetRole": "Partner",         "constraint" : {           "operator": "exact_match",           "field": "/BusinessPartner/Name",           "value": "Ludovici"         },         "links" : [           {             "relationshipModel": "PermanentAddress",             "targetRole": "Address",             "constraint" : {               "operator": "exact_match",               "field": "/Address/City",               "value": "Berlin"             }           }         ]       }     ]   } } ``` |
```

1. First, the query retrieves all `Contract` documents from the database.
2. Then, it finds all `Partner` documents related to the `Contract` documents through the `PolicyHolder` RM, but only those `Partner` documents where the `/BusinessPartner/Name` field is `"Ludovici"`.
3. Next, for each of the `Partner` documents that were retrieved, the query finds the related `Address` documents via the `PermanentAddress` RM where the `/Address/City` field is `"Berlin"`.

It is also possible to select only certain fields from the documents retrieved by links projections.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` {   "query": {     "targetDocumentModel": "Contract",     "projectionName" : "document",     "fields": ["/Contract/Name", "/__meta/docRef"],     "links": [       {         "relationshipModel": "PolicyHolder",         "targetRole": "Partner",         "fields": ["/PartnerInfo/Name", "/__meta/docRef"],         "links" : [           {             "relationshipModel": "PermanentAddress",             "targetRole": "Address",             "fields": ["/Address/City", "/Address/Street", "/Address/ZIP"]           }         ]       }     ]   } } ``` |
```

In this example, only a few properties from the `Contract`, `Partner`, and `Address` documents will be loaded. The `fields` must be defined for each `link` definition; otherwise, the entire document will be loaded, potentially impacting query performance.

###### Dynamic Link Retrieval

In the `links` section, it is possible to define self-referencing relationship models. For such link definitions, DS requires the `maxDepth` property to be specified, as it will recursively traverse the relationship. To prevent potential DoS attacks, DS enforces a hard limit on the maximum depth that can be loaded in a single query. The `maxDepth` provided in the query must be below this limit to pass the validation phase.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 ``` | ``` {   "jsonrpc": "2.0",   "id": "LOAD_ALL_AMENDMENTS_OF_CONTRACT",   "method": "QUERY",   "params": {     "query": {       "targetDocumentModel": "Contract",       "projectionName": "document",       "constraint":{         "operator": "exact_match",         "field": "/__meta/docRef",         "value": "Contract/1"       },       "links": [         {           "relationshipModel": "ContractAmendment",           "targetRole": "Amendment",           "maxDepth" : 10         }       ],       "paging": {         "pageNumber": 0,         "pageSize": 1       }     }   } } ``` |
```

The query above will generate a tree starting with `Contract/1` and extending up to a maximum depth of 10. It’s important to note that more than 10 links may be found, each level of the tree could contain many amendments, depending on how many documents are linked via `ContractAmendment` RM. Besides several amendments, the query may return also link documents (if the relationship model allows them).

Additionally, the `paging` specification in the query only applies to the root selection and not the projection. Therefore, specifying a `pageSize` of 1 ensures that only a single root is selected, but it does not limit the number of documents loaded through the `links` section.

Queries using dynamic link projections can potentially load huge results. To ensure acceptable query performance, DS recommends the following best practices:

* **Know your data**: DS cannot predict the data structure in customer projects. If your trees are deep but narrow, you may not experience issues. However, if you have vast trees, consider loading 2–3 levels at a time or avoid loading entire trees at once.
* **Avoid loading forests**: The query’s selection section allows you to specify (or omit) which roots will be selected. By executing a query like this, you’re loading trees for each root selected. Ensure your selection is as specific as possible to meet your use case. For larger trees, consider issuing multiple queries per root.
* **Avoid over-fetching**: Use the `fields` property to load only the necessary fields for your use case, rather than loading complete documents. For most tree overviews, complete documents are unnecessary. You can load the full document later if the user requests it.

##### Document Graph Projection

The Document Graph projection leverages the CDM feature in conjunction with the `fields` property to load document graphs, which can then be used on the client side to construct CDDs. This projection provides a single document graph for the form engine. Technically, it is possible to load more than one graph, but there is no known use-case so far.

The document projection is enabled by providing `document-graph` value in the `projectionName` property in the query root.

Example of document-graph projection

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 ``` | ``` {   "query": {     "projectionName": "document-graph",     "targetDocumentModel": "ContractCDM",     "fields": ["/ContractBusinessPartner"],     "constraint" : {       "operator": "exact_match",       "field": "/__meta/docRef",       "value": "Contract/169c57d2-ad32-4bf8-b533-c108c0f5c6cf"     },     "paging": {       "pageNumber": 0,         "pageSize": 1     }   } } ``` |
```

The projection will transform the query into one that utilizes `links` properties, based on the CDM specification provided in the `targetDocumentModel`. The following transformations will occur:

1. **`targetDocumentModel` will be adjusted**:

   1. If the `fields` property is empty, the model will be set to the **Root Document Model of the CDM**.
   2. If the `fields` property is defined, the model will be set to the **Document Model (DM) of the target role** found in the `fields` property.
2. **`fields` property**: The `fields` property will be removed. The selected fields will be determined from the CDM specified in the original `targetDocumentModel`. The `fields` property of `document-graph` projection does not expect document fields but groups which are filled via CDM relationship annotations.
3. **`links` section**: This section will be added based on the CDM specification from the original `targetDocumentModel`. If the underlying relationship is of self-referencing type, the `maxDepth` property of this link is programmatically set to 1. `links` can also be added to the query by the caller. For more info about the implications please see [this](#cdd-links) section.

It’s important to note that the constraints apply to the Contract document, not the CDD, even though the `targetDocumentModel` refers to the CDM. This is because the constraints are enforced after the transformation, which occurs during the initial step of query execution (executed in the `preprocess` method of the projection implementation). Ensure that the constraints applied will still be valid after the transformation.

To optimize performance, unnecessary root documents can be excluded from the query using the `exclude` option, preventing unnecessary data from being loaded.

##### CDD Projection

The CDD projection expects a CDM in the `targetDocumentModel` and constructs CDDs instead of a document graph. The query below will load the first 100 `ContractCDM` CDDs that have a `Health Insurance` value in `/ContractRoot/Type`. The result will not include any documents in the `links` section. Only the root entries will be returned, as a CDD will be constructed for each root that matches the query, based on the CDM specification.

Example of CDD projection

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 ``` | ``` {   "jsonrpc": "2.0",   "id": "LIST_CDDS_USE_CASE",   "method": "QUERY",   "params": {     "query": {       "targetDocumentModel": "ContractCDM",       "projectionName": "cdd",       "constraint": {         "operator": "exact_match",         "field": "/ContractRoot/Type",         "value": "Health Insurance"       },       "paging": {         "pageNumber": 0,         "pageSize": 100       }     }   } } ``` |
```

The CDD projection is activated by specifying the `cdd` value in the `projectionName` property within the query root. Using `links` and `fields` is possible but not necessary, as the CDD will be constructed based on the CDM definition. For more information please see the [documentation below](#cdd-links).

The CDD projections have the following restrictions:

* **Sorting is only possible on non-repeatable fields**: In CDD projections, every group mapped via a relationship is repeatable. Fields within a repeatable group will have multiple values for a single document. As a result, it is not possible to sort based on any fields of repeatable groups. This same restriction applies to other projections as well, but in the case of CDD, linked documents are also affected.
* **Projection for mapped documents must use the `has` operator**: The Query API does not allow CDM field paths. To restrict access to linked documents, the `has` operator must be used with the original field path. Since overviews do not support filtering by repeatable fields (including mapped fields), this is a feature parity issue. Refer to the example below for clarification. Using `exact_match` operator on the field defined in CDM will not work in this case without `has` operator because the query API is not aware of CDM field paths. This implies that the caller needs to provide the original field path.
* **Self-referencing relationships are followed to the first level only**: If a relationship inside a CDM is of self-referencing type (i.e. source model and target model are the same), only the first child document is added to the CDD.

Constraint on linked document

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 ``` | ``` {   "jsonrpc": "2.0",   "id": "CONSTRAINT_ON_LINKED_DOCUMENT_IN_CDD",   "method": "QUERY",   "params": {     "query": {       "targetDocumentModel": "ContractCDM",       "projectionName": "cdd",       "constraint": {         "operator": "has",         "relationshipModel": "PolicyHolder",         "targetRole": "Partner",         "constraint": {           "operator": "exact_match",           "field" : "/Partner/FirstName",           "value": "Ludovici"         }       },       "paging": {         "pageNumber": 0,         "pageSize": 100       }     }   } } ``` |
```

* **The `SIMPLE_SEARCH` operator only works on root documents**: The `has` operator must be used in combination with the `SIMPLE_SEARCH` operator to match results on the complete CDD, especially when using the `or` operator. Refer to the example below for details.

SIMPLE\_SEARCH on complete CDD

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 ``` | ``` {   "jsonrpc": "2.0",   "id": "SIMPLE_SEARCH_COMPLETE_CDD",   "method": "QUERY",   "params": {     "query": {       "targetDocumentModel": "ContractCDM",       "projectionName": "cdd",       "constraint": {         "operator": "or",         "operands": [           {             "operator": "simple_search",             "value": "Ludovici"           },           {             "operator": "has",             "relationshipModel": "PoliciyHolder",             "targetRole": "Partner",             "constraint": {               "operator": "or",               "operands": [                 {                   "operator": "simple_search",                   "value": "Ludovici"                 },                 {                   "operator": "has",                   "relationshipModel": "PermanentAddress",                   "targetRole": "Address",                   "constraint": {                     "operator": "simple_search",                     "value": "Ludovici"                   }                 }               ]             }           }         ]       },       "paging": {         "pageNumber": 0,         "pageSize": 100       }     }   } } ``` |
```

* **Computed fields cannot be used in sorting or in constraints**: Computed fields are not filled by default in `cdd` projection. This can be changed using `mgmtp.a12.dataservices.query.cdd.computation.enabledForModels` configuration key. Mentioned configuration key will fill computed values in the `postprocess` method of the `cdd` projection, therefore these values will not be available during query time. This means that computed values cannot be used in constraints or in sorting specifications. Non-transient computed fields can be still used in constraints and sorting in root document models of `cdd` projection.

You can specify `links` in the `cdd` projection, but they must exactly match the links defined in the CDM. This feature allows you to define constraints on linked documents in your query, since constraints cannot be set directly in the CDM. Note that the `links` section in the `cdd` projection does not load additional documents; it is used solely to apply constraints to the linked documents as defined by the CDM. DS will not validate these links. If they do not match the CDM, the query will still execute, but the results may not be as expected.

##### `links` Property In `cdd` and `document-graph` Projections

If you explicitly provide a `links` section, DS uses it verbatim. If you omit it, DS derives the `links` section from the CDM during preprocessing.

Typical reasons to define `links` manually:

* Omit relationship groups you do not need (to reduce payload & latency) without creating a new CDM.
* Add constraints to specific linked documents or link documents to limit which data goes to the client.
* Restrict loaded fields via `fields` / `linkDocumentFields` to avoid full document loading.

  + This is mainly needed for the `cdd` projection to keep performance acceptable. The `document-graph` projection loads full documents by default.

When defining `links` manually, ensure they align with the CDM. If a relationship present in the CDM is omitted, it will not appear in the result. For each link specified in this way DS will require property `backReference to be filled. This property defines how the link is referenced in the parent document. The value must point to the group in the CDM where the relationship is defined. DS cannot guest this value reliably because the same relationship model could be used in multiple groups in the CDM.

Example of `links` property in `cdd` projection

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 ``` | ``` {         "jsonrpc": "2.0",         "id": "CddWithLinksRestricted",         "method": "QUERY",         "params": {             "query": {                 "projectionName": "cdd",                 "targetDocumentModel": "ContractCDM",                 "constraint": {                     "operator": "exact_match",                     "field": "/__meta/docRef",                     "value": "Contract/777f9273-575d-4181-8a2f-2021fa4796a3"                 },                 "links": [                     {                         "relationshipModel": "ContractBusinessPartner",                         "targetDocumentModel": "BusinessPartnerSuper",                         "targetRole": "Partner",                         "backReference": "/ContractBusinessPartner",                         "links": [                             {                                 "relationshipModel": "PartnerPostalAddress",                                 "targetDocumentModel": "Address",                                 "sourceRole": "Partner",                                 "targetRole": "Address",                                 "backReference": "/ContractBusinessPartner/PartnerPostalAddress"                             }                         ]                     },                     {                         "relationshipModel": "ContractCoInsuredPartner",                         "targetDocumentModel": "BusinessPartnerSuper",                         "targetRole": "Partner",                         "backReference": "/ContractCoInsuredPartner"                     }                 ],                 "paging": {                     "pageSize": 100,                     "pageNumber": 0                 }             }         }     } ``` |
```

In the example above we see that `ContractCDM` has 2 root level relationships defined: `ContractBusinessPartner` and `ContractCoInsuredPartner`. Both are included in the `links` section. The `ContractBusinessPartner` relationship has a nested relationship `PartnerPostalAddress`, which is also included in the `links` section. The `backReference` properties point to the corresponding groups in the CDM where these relationships are defined.

Caution: DS does not validate that supplied `links` match the CDM. Incorrect or partial specifications will still execute but may yield incomplete or misleading results. Validation of correctness is the caller’s responsibility.

##### Export CDD Projection

The `exportCddCsv` projection expects a CDM in the `targetDocumentModel`, constructs CDDs with supporting `sort` and `constraint`, converts them to a file, and saves the file to the Content Store. It then returns a `downloadUrl` in `otherResults`.
Refer to the example below for details.

Export CDD

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 ``` | ``` {   "jsonrpc": "2.0",   "id": "EXPORT_CDD_CSV",   "method": "QUERY",   "params": {     "query": {       "targetDocumentModel": "ContractCDM",       "projectionName": "exportCddCsv",       "paging": {         "pageNumber": 0,         "pageSize": 100       }     }   } } ``` |
```

##### Overwriting Existing Projections

If project requirements necessitate changing the behavior of existing projections or adding new ones, implement the `IQueryProjection` interface and define a `projectionName`. A non‑existing `projectionName` registers a new projection (clients must then explicitly request it). To override an existing projection, reuse its `projectionName` and supply a higher precedence (e.g. lower numeric value) via the `@Order` annotation—your implementation will take precedence. Overriding is discouraged because it can introduce unexpected client behavior and block upstream fixes and improvements.

Prefer adding a new projection unless you fully control all consumers. See the examples module for a reference implementation.

#### Aggregations

The Query API supports aggregations for two main use cases:

1. **Query Construction Support**: The engines provide a smooth user experience for users creating queries in the browser. Aggregation functions assist in constructing constraints that generate meaningful results, preventing the creation of constraints that would eliminate all results from the result set. Fast suggestions as users type are crucial. To achieve this, DS introduces a separate endpoint, `POST /api/aggregation`, which takes the query as the request body. This endpoint is optimized for performance, as it avoids complicated transactional handling, batching, or JSON-RPC wrappers.

|  |  |
| --- | --- |
|  | The query result may be improper, if any of the aggregation function fields or grouping fields specified in the query request do not exist in the target model. If a field is misspelled, or if it has been renamed, or it does not exist in the model, the query execution will return incorrect result. |

1. **Statistical Information About Results**: The engines allow the retrieval of additional statistical information about the current result set. This data can be displayed in dashboards or simple charts for analysis.

Currently, Query API aggregations are not designed for large-scale aggregations over massive datasets intended for complex reporting use cases. The full reporting use case has not been considered for the Query API at this time.

There are five aggregation functions available in DS:

* **avg**: Computes the average value for a field. This function is available for `INumberType`.
* **min**: Computes the minimum value for a field. This function is available for `INumberType`, `IDateType`, `IDateTimeType`, and `ITimeType`.
* **max**: Computes the maximum value for a field. This function is available for `INumberType`, `IDateType`, `IDateTimeType`, and `ITimeType`.
* **sum**: Computes the sum of all values for a field, allowed only for `INumberType`.
* **count**: Counts unique occurrences of a value in a field. This aggregation function is supported for all kernel data types.

To provide specific aggregated results, the query may group the results by fields.

Aggregation example

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` {   "query": {     "targetDocumentModel": "Contract",     "aggregation": {       "aggregations": [         {           "function": "sum",           "field": "/ContractRoot/Liability"         }       ],       "group": [         {           "field": "/ContractRoot/Type"         }       ]     }   } } ``` |
```

In the example, the results are grouped by field `/ContractRoot/Type` and for each group the sum of the values in `/ContractRoot/Costs` is provided. Result will contain generated document with the group.

If the group property is not specified, the aggregation will be applied to the entire result set, and the result will contain a single document with the aggregated value.

##### Restrictions

* **One-Level Support**: Aggregations currently do not support nesting. This means that only a single level of aggregation is allowed. However, constraints from grouped results can be passed as query constraints to simulate additional levels of aggregation. In the case of more complex, multi-level aggregations, JSON-RPC can be used to issue multiple `QUERY` operations in a single request, effectively simulating multi-level aggregation.
* **No `has` Operator Support**: Aggregations do not work over linked documents, which means it is not possible to group by properties of links or linked documents. The aggregation is limited to the fields of the root documents and cannot traverse or aggregate based on linked data.
* **Cannot Be Combined with Regular Queries**: Aggregations work by grouping results, and as a result, they cannot be combined with regular queries that are not grouped. This limitation means that aggregation results must be handled separately from queries that retrieve ungrouped or non-aggregated data.
* **No links property is allowed**: The `links` property requires roots that can be used in links. Aggregated results do not contain the root documents but rather aggregations. Currently it is not possible to join any data to the aggregated result.

##### Endpoint /api/aggregation Support

The `aggregation` endpoint can be accessed via the **POST** HTTP method, with the query definition provided in the request body. The response is a two-dimensional array, returning both the groups and their corresponding aggregation function results.

This endpoint is designed specifically for aggregation use cases and does not support any other query functionality. Its main purpose is to facilitate faster query construction in the client UI. For more complex queries or additional features, users should utilize the `QUERY` JSON-RPC operation.

#### Paging

When working with the Query API, there are important considerations regarding **pagination** and **fields**. These help in managing performance, ensuring that query results are efficiently returned, and preventing overloading both the client and server with excessively large datasets. Here’s a breakdown of how pagination works and why projection data is handled differently:

##### Pagination in Selection

1. **Mandatory Pagination**: The query selection (the root documents being queried) must always include pagination parameters in the request. These parameters are:

   1. `pageNumber`: Specifies the page number to retrieve.
   2. `pageSize`: Specifies the number of results per page.
   3. These parameters are mandatory for the query to be considered valid. If either is missing, the query will fail during the validation phase. There are no default values applied by the Data Services — the client is required to explicitly set these values.
2. **Hard Limits**:

   * Both `pageNumber` and `pageSize` have **configurable hard limits**. The query will fail validation if either of these values exceeds the defined thresholds.

     1. These limits help ensure that the system remains scalable and performs well under a heavy load, preventing large and unmanageable queries that could impact both server performance and stability.
     2. The configuration of these limits is managed within the Query configuration.
     3. **Result of Selection**: The **result of selection** will always be paged, meaning only a subset of root documents (based on `pageSize`) will be returned for each request. The client is expected to handle pagination by specifying the appropriate page to retrieve.
     4. Pagination works on the selection of documents themselves and not on the projection data (linked documents or custom data graphs).

##### Pagination in Projection

1. **No Pagination on Projection**: The result of projection **cannot** be paged because the projection data is derived from the relationship models (RM), not directly from the root document set.

   1. Projection queries often request the entire document graph in order to fully construct **Composed Data Document (CDD)**. The projection request will retrieve all necessary related documents (linked by relationships), and paging them would not be useful in this context.

      1. Only exception is usage of `exclude` property. Please see Exclude option section for more details.
2. **Complete Document Graph**: Projection needs to load the full set of documents, including the root documents and all related documents, to form a complete graph. Trying to page, this would impose complicated code on the client, which would have to issue multiple queries to load complete data to construct CDD.
3. **Upper Limit for Projection**: For the projection, especially for **CDD** projection, an **upperLimit** value is used to control the number of documents and relationships allowed.

   1. Setting the `upperLimit` value too high, or using `unbounded` as a value, can result in unmanageable result sets. This could lead to performance issues both on the client and server side.
   2. Therefore, it is advised that **customer projects set a reasonable `upperLimit`** for projection queries to balance the need for complete data with performance considerations.

Example request:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` "paging": {     "pageNumber": 5,     "pageSize": 100 } ``` |
```

Example response:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` "fullSize": 9000, "paging": {     "pageNumber": 5,     "pageSize": 100 } ``` |
```

Paging object is copied from the request. `fullSize` property should be used to count the number of pages on the client side.

#### Sorting

The **Query API** allows for sorting of results based on indexed fields only. Sorting helps organize the returned documents in a way that matches the client’s requirements, and each sorting specification consists of multiple properties:

1. `field` (Mandatory): Specifies the field path that should be used for sorting the results.
2. `direction` (Mandatory): Determines the direction of the sorting. This property can have one of two values:

   1. `ASC`: Ascending order (from lowest to highest)
   2. `DESC`: Descending order (from highest to lowest)
3. `nullHandling` (Mandatory): This property determines how null values should be handled in the sorting result. Possible values:

   1. `NULLS_FIRST`: Null values appear first in the result set.
   2. `NULLS_LAST`: Null values appear last in the result set.
4. `ignoreCase` (Mandatory): This boolean is used to switch between **case-insensitive sorting** and **case-sensitive sorting** for `IStringType` fields (string-based fields).

   1. If set to `true`, the case will be ignored.
   2. If set to `false`, the case will be considered when sorting string values.

Sorting example:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` {   "query": {     "targetDocumentModel": "Contract",     "sort": [       {         "field": "/Contract/name",         "direction": "ASC",         "nullHandling": "NULLS_FIRST",         "ignoreCase": true       }     ]   } } ``` |
```

##### Properties of Sorting

* Query API supports multi-level sort specification.
* Sorting is only supported for indexed fields. If a field is not indexed, it cannot be used in the sorting specification.
* Sorting is applied to the root documents selected by the query. Sorting by fields of links or of link documents is not supported.
* Sorting is only possible on non-repeatable fields, this especially applies to CDDs where every group mapped via a relationship is repeatable.

#### Query Execution Overview

Every query execution follows the predefined number of steps which ensure the most efficient evaluation of the query.

![query execution phases](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/uml/query_execution_phases.svg)

Figure 18. Query Execution Overview

##### Handle Projection

Every query requires a valid projection specified in the `projectionName` property. Each projection consists of both `preprocess` and `postprocess` methods.

The projection look-up is initiated first, followed by the execution of the `preprocess` method. This `preprocess` method enables the mutation of the query, allowing for modifications or adjustments before the query is executed. These mutations are crucial for ensuring that the query conforms to the specific requirements and behaviors defined by the projection.

##### Validation Phase

The validation phase in DS ensures that all required properties and fields are correctly specified in the query before it is processed. This validation occurs at two levels: Query Root Validation and Operator Completeness Validation. The purpose is to guarantee that the query is structured correctly, adheres to required constraints, and does not contain any missing or incompatible fields.

The primary goal of the validation phase is not to fail quickly but to provide a comprehensive list of all errors found in the query.

However, it’s important to note that the richness of the validation response is mutually exclusive with localization. Since server-side validation has not yet been implemented, it’s not possible to provide localized validation messages. Therefore, the validation phase is intended to be used by developers and customer projects integrating the DS query feature, not by end users.

Queries constructed using our TypeScript and Java clients will always result in valid JSON. However, the query itself can still be invalid in terms of logic or functionality. Developers can use the validation phase to identify and correct these issues. End users, however, should never encounter validation errors directly. The user interface should always prevent the creation of invalid queries by guiding users to build valid queries from the start.

DS recommends not using validation in the production environment. The validation phase is primarily intended for development and testing purposes, where developers can identify and correct issues in the query structure before deploying it to production. The validation phase does not affect security, as invalid queries will produce invalid results. Furthermore, the more complex validations will consume resources and execution time which should be avoided in production.

Validation of the fields might also show information about non-existing fields of the models user cannot see. This might pose a security issue if used in the production environment. This is because DS aggregates the error messages and returns them all at once. If a user queries for fields they do not have access to, the validation error will indicate that the field does not exist, potentially revealing information about the data model that the user should not be aware of.

|  |  |
| --- | --- |
|  | If query validation is disabled in the configuration, invalid queries will still be executed. This can lead to hard-to-interpret errors, because the system does not expect such input. Generic errors like `Unexpected error during query execution` may be returned. |

###### Query Root Validation

This level checks the integrity of the query root and ensures that all mandatory properties are specified.

1. **Mandatory Properties**: All mandatory properties must be present in the query root. For example, properties like `targetDocumentModel` and `paging` must be provided, depending on the query’s structure.

   1. **Paging**: The query must include valid pagination properties (`pageNumber`, `pageSize`). There are configurable hard limits for these values (e.g., `pageSize` has a maximum configurable limit), and the query will fail validation if they exceed these limits.

      * **Mutually Exclusive Properties**: Certain properties are **mutually exclusive**. For example, `aggregations` and `links` are mutually exclusive and cannot appear in the same query. If a query includes both, it will fail validation.

###### Operator Completeness Validation

Once the query root has been validated, DS moves on to operator completeness validation. This phase recursively checks each operator in the query and validates that the operator’s properties are correctly defined. Each operator defines its own set of validation checks.

1. **Field-Aware Operators**: These operators (such as `exact_match`, `range`, etc.) must refer to fields that are valid within the target document model defined in the query. If an operator refers to an invalid or non-existent field, the validation will fail.

   1. For instance, an `exact_match` operator must reference an existing field in the `targetDocumentModel`. If the field does not exist in the DM, an error will be raised.
2. **Recursive Validation**: The validation process is recursive, meaning that for every operator, the system will check its properties, ensuring that each condition is satisfied. If an operator refers to another operator (such as using `has` with constraints), these will also be recursively validated to ensure that they are well-formed and valid.
3. **Valid Operators for Specific Data Types**: The validation ensures that only valid operators are applied to fields of the correct data type. For example:

   1. A `double_range` operator should only be applied to fields of type `INumberType`.
   2. A `date_range` operator should only be applied to fields of type `IDateType` or `IDateRangeType`.

##### Enrichment Phase

The enrichment phase is a crucial step in the query execution process. It takes place after the query validation but before the actual query execution (which involves SQL or other low-level operations). This phase is responsible for enhancing the query context by adding additional data and applying logic that prepares the query for efficient execution. Key tasks in the enrichment phase include handling heterogeneity, authorization and other data transformations such as date formatting.

Here is a breakdown of the main functions of the enrichment phase:

###### Heterogeneity Resolution

In the context of a multi-model environment, heterogeneity refers to situations where different DMs (e.g., BusinessPartner, BusinessPartnerLegalEntity, AbstractPartner) might be used in a single query. The enrichment phase addresses these complexities by transforming the query so that it can work seamlessly across different DMs.

During enrichment, the system resolves references to multiple data models, transforming them into a unified query context that is consistent across all involved models. This allows the system to treat heterogeneous data as if they belong to a single logical structure. The model graph plays an essential role in resolving heterogeneity. It maps the relationships and dependencies between different document models, ensuring that the query can properly traverse them and retrieve the necessary data.

###### Authorization and Security

During the enrichment phase, the system also evaluates authorization rules to ensure that users are allowed to query certain data. This process involves verifying the user’s access rights and applying any necessary restrictions based on security policies.

1. **Access Control**: The system checks the user’s permissions to ensure they are authorized to access the document models and fields referenced in the query.
2. **Enrichment with Security Context**: The query may be modified to exclude any data the user is not authorized to view, ensuring that the results respect the user’s access control settings. This also includes checking the user’s ability to access certain RMs.

Authorization in the enrichment phase is critical for ensuring that sensitive or restricted data is not included in query results, protecting user privacy and data security.

###### Date and Other Data Preparations

Another task in the enrichment phase is the pre-formatting of dates and other data types to ensure that they are compatible with the query operators used later in the execution phase.

1. **Date Pre-formatting**: Dates may need to be converted into a specific format that can be used by the query operators, such as `date_range` or `exact_match`. For instance, dates could be serialized into ISO 8601 format, or another format defined by the data model (DM).
2. **Data Transformation**: Other transformations, such as standardizing numerical values, handling enumerations, and ensuring that fields are properly indexed for efficient search, may also take place during enrichment.

For instance, the system may take a `DateTime` field and pre-format it into a string representation that can be used more efficiently with a range query.

###### Avoiding SQL Execution in Enrichment Phase

It’s important to note that during the enrichment phase, **no SQL queries** are executed. Instead, this phase is focused entirely on preparing the query and resolving all model-specific logic, relationships and security concerns. This is a preparatory phase that happens entirely within the application’s internal logic and works with the model graph, security configurations, and various other A12 concepts.

Once the enrichment phase is complete, the system is ready to execute the query, which typically involves translating the enriched query into SQL to retrieve the relevant data from the underlying database.

##### Execution Phase

While the enrichment phase prepares the query context, it’s important to note that at this point in the process, no A12-specific concepts are directly involved in query execution. Instead, this phase essentially focuses on preparing SQL statements for execution based on the query’s requirements. Once the enrichment phase concludes, SQL queries are generated and executed to retrieve data.

The generation of SQL queries depends on the complexity of the query and the specific operators and projections defined. The process can be broken down into a series of steps that result in **one or more SQL statements**. Here are the main types of SQL statements that might be generated based on the query:

1. **Query to Load Root Documents** If the query involves selecting root documents (e.g., documents of type `Contract` or `BusinessPartner`), **one SQL statement** will typically be generated to select the root documents based on the query criteria, including any filtering conditions specified (e.g., `exact_match`, `range`, etc.). If complete documents should be loaded additionally, another SQL query will be executed to load them from document persistent store.
2. **SQL for Complex Projections (CDD)** When a **CDD** projection is requested, the system must load not only the root documents but also any related documents that form part of the complete CDD. The number of SQL statements generated will vary depending on the number of linked documents and the complexity of the relationships. For a query that retrieves `n` root documents with a `pageSize` of `m`, the number of SQL statements generated for linked documents will be approximately `n * m`.

##### Post-execution Phase

After all SQL statements have been executed, the result of the query is being prepared. This phase will vary for different projections, but its goal is to prepare the result of the query either by loading additional data (loading full documents from the persistence store), mutating data (creating CDDs from the document graph) or mutating the page content (see section Black-box authorization).

The `postprocess` method of the selected `IQueryProjection` implementation will be executed in this phase.

### Model-ability

In DS, efficient querying is crucial for performance and scalability. As such, indexing plays a critical role in determining which fields from DMs can be used in queries and projections. The goal is to ensure that only relevant fields are indexed, helping optimize the query execution process. .

**Field Annotation**: Every field is by default indexed. To remove field from the index, please annotate the field with `indexed` annotation with value `false`. In the example below we demonstrate how to remove field "Notes" from indexing:

Example of field annotation to remove field from indexing

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 ``` | ``` { 	"type": "Field", 	"id": "field_b83ff", 	"name": "Notes", 	"annotations": [ 		{ 			"name": "indexed", 			"value": "false" 		} 	], 	"Field": { 		"fieldType": { 			"type": "StringType" 		}, 		"label": [ 			{ 				"locale": "en", 				"text": "Notes" 			} 		] 	} } ``` |
```

DS will only accept value `false` in the annotation `indexed` all other values will be ignored. This annotation can be only placed
on the fields (not groups).

**CDMs** inherit field definitions from their underlying DMs. However, cdds are not redundantly indexed. Therefore, **DS will ignore the indexed annotation in CDMs**. Only fields from the underlying DMs that are indexed will be considered available for querying, even within CDMs. No additional indexing is required or performed for CDMs. The underlying DM must already have the necessary indexing for fields to be used in queries. CDDs are constructed during query execution, and therefore it is not possible to load complete documents and provide good performance. DS will expect all DMs fields participating in CDMs to be properly annotated, construction of the CDD for `cdd` projection will fail otherwise. This is only true for `cdd` projection. `document-graph` projection will always load complete documents because the client needs complete documents to construct CDDs on the client-side.

**Document Metadata**: DS maintains a special model for document metadata, which is referred to as `document-meta-data`. DS will automatically index all fields from this model, which means that they will be available for querying and projection without any need for additional annotations. Customer projects are free to remove some of those fields from indexing by adding `indexed` annotations with value `false`. But fields like `/__meta/docRef` are particularly important because they help DS locate documents within the system. If you add the `indexed=false` annotation from such fields, **those documents may no longer be available** for querying.

To optimize query performance, it’s **strongly recommended** to only index fields that are actively used in queries. Indexing unnecessary fields will slow down query execution and negatively impact system scalability. If fields that are never used in queries are indexed, it can increase the **size of the index**, which may make queries slower due to the larger data volume in the index. Larger indexes require more time to maintain and query. Over-indexing fields that aren’t used will increase the load on the database and reduce overall query speed.

#### Heterogeneity Support

Modelers must ensure that the subtypes are semantically consistent with their parent DM. This principle has already been applied to the definitions of groups and fields, and it also extends to the data types of fields and rules. The same approach should be followed when defining `indexed` fields. If a field is designated for indexing in the parent type, the same definition must be replicated across all subtypes. Failing to do so constitutes a modeling error. This could lead to query failures (if the field is not found in the DM) or incomplete results (if some subtypes lack the `indexed` annotation).

#### Model Changes

Runtime model changes (RM and DM) can potentially corrupt the internal index table. Therefore, modifications to the DM and RM should be made during downtime, not while the system is running. If needed, the index can be rebuilt using the re-indexing feature. Please note that runtime re-indexing is not supported due to missing document locking features on the DS side.

On the other hand, CDM models can be modified during runtime because they are not involved in indexing but only in query execution.

### Query API Authorization

Authorization is automatically applied, when using `QUERY` operation or underlying service layer.

#### Data Read Authorization Scopes

All data read functionality will be checked with `Query` authorization scope, which will have a resource of the Document model name. This scope will be applied:

1. on Query root `targetDocumentModel`
2. on all `links` properties on the `targetRole` DM
3. on `has` operator `targetRole` DM

#### Model Authorization and Heterogeneity

When a model reference is provided to the query — either directly through the `targetDocumentModel` property or indirectly via the RM — it will be translated into a list of model names in `IN` statement based on the model graph. There are two possible scenarios:

1. **User has permissions to load by reference**: In this case, the model graph is consulted, and all available non-abstract subtypes are included in the query recursively (subtypes, subtypes of subtypes, and so on). A subtype and its subtypes will be excluded from the query if the user does not have permission to read a particular DM. If no non-abstract DMs are available due to permission restrictions, the system will respond with an empty result.
2. **User lacks permissions to load the model**: There are 2 possible variations of this scenario:

   1. **The user has no permission to load root query targetDocumentModel or Relationship model**. DS will consider this query invalid because the model graph cannot be resolved. In this scenario, DS will respond with a `QueryValidationException` with message `Access Denied`, as the query cannot be completed due to the lack of required permissions.
   2. **The user lacks permissions of some subtypes**. In this case, the query will be executed, but the results will be filtered to exclude the subtypes the user is not allowed to see. The user will not be able to see the filtered results, but the query will still return a response. If all subtypes are filtered out, the query will return an empty result.

#### ABAC and Repository Access

All access to the data (documents & links) will be controlled via single scope `Query` with resource of document model reference. Customer project can define repository access policies per model, and DS will inject these constraints to the query automatically.

ABAC and repository access authorizations rely on the document fields that are readily available for querying. If those fields are not present in the index, they cannot be used. The modeler should not be forced to put `indexed` annotations on the fields because of security requirements. Furthermore, the user might not be allowed to see the fields which are used in authorization checks. Customer projects must take care of this situation and make sure that all fields that are relevant for security concerns are indexed.

This authorization will be applied for all documents that are matching `target` expression in `authorizationDefinition`.

Everytime targetDocument model is resolved during enrichment phase, DS will consult `authorizationDefinition` to check if there are any repository policies that should be applied. If there are, DS will inject the constraints defined in the policy into the query. Original query constraints will be moved to operands of the newly introduced `and` operator and injected constraints will be added as additional operands.

UAA will resolve SpEL expressions that are used inside the constraint. Please note, that UAA does not provide defaults for non-existing additional properties. So, all users for which an ABAC rule applies must have a value for all properties that are used in SpEL.

##### Example

Let’s consider the following authorization definition:

Example of ABAC authorization

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 ``` | ``` {   "repositoryPolicies": [     {       "name": "Contract_MaxContractValueFilter_Policy_forNonManager",       "description": "Add constraint to the query for non-manager users when listing contracts",       "target": "!hasRole('manager') && #resource == 'Contract'",       "templates": [         {           "operator": "double_range",           "field": "/ContractRoot/ContractValue",           "to": "principal.additionalProperties['maxContractValue']"         }       ]     },     {       "name": "BusinessPartnerSuper_IndustryMustMatch_Policy",       "description": "Add Industry constraint to the query for BusinessPartnerSuper",       "target": "#resource == 'BusinessPartnerSuper'",       "templates": [         {           "operator": "exact_match",           "field": "/BusinessPartnerSuper/Industry",           "value": "principal.additionalProperties['Industry']"         }       ]     }   ],   "permissions": [     {       "name": "Query Data",       "description": "Allows the user to query the data securely",       "repository-refs": [         "Contract_MaxContractValueFilter_Policy_forNonManager",         "BusinessPartnerSuper_IndustryMustMatch_Policy"       ],       "call-parent-scope": false,       "scopes": [         "Query"       ]     }   ] } ``` |
```

This example defines two repository policies: `Contract_MaxContractValueFilter_Policy_forNonManager` and `BusinessPartnerSuper_IndustryMustMatch_Policy`.
The first policy adds a double range constraint to the query for non-manager users when listing contracts. The second policy adds an industry constraint to the query for `BusinessPartnerSuper`. The `permissions` section defines a permission that allows the user to query the data securely. The permission references the two repository policies.

Now let’s consider the following query:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 ``` | ``` {   "jsonrpc": "2.0",   "id": "QueryWithABACNotYetApplied",   "method": "QUERY",   "params": {     "query": {       "projectionName": "document",       "targetDocumentModel": "BusinessPartner",       "constraint": {         "operator": "not",         "operand": {           "operator": "has",           "relationshipModel": "ContractCoInsuredPartner",           "targetRole": "Contract",           "targetDocumentModel": "Contract",           "constraint": {             "operator": "exact_match",             "field": "/__meta/docRef",             "value": "Contract/1"           }         }       },       "links": [         {           "relationshipModel": "PartnerAddresses",           "targetRole": "Address"         }       ],       "sort": [         {           "field": "/BusinessPartnerRoot/Name",           "direction": "DESC",           "nullHandling": "NATIVE",           "ignoreCase": true         }       ],       "paging": {         "pageNumber": 0,         "pageSize": 20       }     }   } } ``` |
```

The query above will have to be extended by the ABAC authorization policies. The resulting query will look like this for a non-manager user with a `maxContractValue` of 1000 and an `Industry` of `IT`:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 ``` | ``` {   "jsonrpc": "2.0",   "id": "QueryWithNonMangerUser",   "method": "QUERY",   "params": {     "query": {       "projectionName": "document",       "targetDocumentModel": "BusinessPartner",       "constraint": {         "operator": "and",         "operands": [           {             "operator": "exact_match",             "field": "/BusinessPartnerSuper/Industry",             "value": "IT"           },           {             "operator": "not",             "operand": {               "operator": "has",               "relationshipModel": "ContractCoInsuredPartner",               "targetRole": "Contract",               "targetDocumentModel": "Contract",               "constraint": {                 "operator": "and",                 "operands": [                   {                     "operator": "double_range",                     "field": "/ContractRoot/ContractValue",                     "to": 1000                   },                   {                     "operator": "exact_match",                     "field": "/__meta/docRef",                     "value": "Contract/1"                   }                 ]               }             }           }         ]       },       "links": [         {           "relationshipModel": "PartnerAddresses",           "targetRole": "Address"         }       ],       "sort": [         {           "field": "/BusinessPartnerRoot/Name",           "direction": "DESC",           "nullHandling": "NATIVE",           "ignoreCase": true         }       ],       "paging": {         "pageNumber": 0,         "pageSize": 20       }     }   } } ``` |
```

The root `not` constraint in line 10 was moved to one operand of newly introduced `and` operator. The other operand is an `exact_match` injected from authorizationDefinition file. Additionally, `exact_match` operator of the `has` constraint was similarly moved to the new `and` operator. The `double_range` operator was added to the `and` operator as well. This `double_range` would not be injected for manager users.

For running example please see `example-abac` configuration profile in examples module.

##### Black-box Authorization

For projects that cannot define their authorization requirements through expressions or queries, DS offers an alternative: authorization can be applied after the query is executed. In this case, the customer project can implement the `IQueryResultAuthorization` interface to filter the results based on the current user’s access rights, effectively limiting the entries in the paged results to only those the user is permitted to see. However, this approach will disrupt paging, and it is essential that all fields involved in the authorization process are indexed to avoid loading of the complete document.

The authorization happens after the SQL statements are executed and before `postprocess` method of the selected projection is executed. For custom projections, the customer projects must handle their security by themselves if they decide to load more data in `postprocess` method.

Please see `black-box-authorization` in examples module.

### Extensions Points

Query API provides several extension points to allow for customization and enhancement of the query functionality. These extension points are designed to be used by customer projects to implement specific use cases or to extend the capabilities of the Query API.

#### Projection Extension Points

`IQueryProjection` interface provides extension points for custom projections. These projections can be used to modify the query results or to provide additional data that is not available in the default projections. Custom projections can be implemented by extending the `IQueryProjection` interface and providing the necessary logic in the `preprocess` and `postprocess` methods.

Example how to do that can be found in example module in class `BusinessPartnerTaxAuthorityRegistrationStatus`.

#### Event Extension Points

The Query API publishes four additional events to support advanced extension and customization:

1. **QueryBeforeOperationEvent**: Triggered before the query is processed by `QueryService`. This event allows you to modify the query before execution.

   1. Note: It is only fired for `QUERY` operations and not when calling `QueryService` or `QueryRepository` directly.
2. **QueryAfterOperationEvent**: Published after the query has been evaluated but before the results are returned to the caller.

   1. This event is sent from the RPC layer and is not triggered for direct calls to `QueryService` or `QueryRepository`.
3. **QueryAfterPostProcessPhaseEvent**: Emitted after the query has been executed and post-processed. The results are available in the `QueryPage` and can be further modified by event listeners. Use this event to adjust query results system-wide, not just for JSON-RPC operations.
4. **QueryBeforeExecutionPhaseEvent**: Published from `QueryService` to allow bypassing the call to `QueryRepository`. Listeners for this event must provide the query results themselves, as `QueryRepository` will not be invoked.

If you are considering implementing a listener for `QueryBeforeExecutionPhaseEvent`, please contact the DS team. DS team aims to natively support all customer use cases to minimize the need for custom extension points, as extensive custom code can complicate future migrations.

#### Simple Search

The default `simple_search` implementation is not using any PostgreSQL full-text feature. It is a simple string search that will match the input string with the field value. The search is case-insensitive and will match any part of the field value. This means that if the input string is found anywhere in the field value, it will be considered a match.

PostgreSQL full-text search is a powerful feature that allows for more sophisticated searching capabilities. It can handle stemming, synonyms, and other linguistic features that can improve the search experience. However, it is not used by default in DS because it can lead to unexpected results and may not be suitable for all use cases. DS will evaluate options to switch `SIMPLE_SEARCH` to PostgreSQL full-text search in the future based on a configuration key with ticket A12S-5373. This change will degrade the performance, because DS will need to fill another column with redundant data that will be pre-processed.

### Performance

This section focuses on known performance pitfalls and ways how to avoid them.

|  |  |
| --- | --- |
|  | Please be noticed that we support `Postgres 15` but all our Performance/Load tests are not performed on this version. We’re performing Performance/Load tests against `Postgres 16.3.0`. |

#### Which Queries Will Be Slow?

##### Large Result Sets

Large result sets will cause PostgreSQL to store many rows into the memory because sorting will have to be applied on those rows. The more data in the result set the slower the query will be.

Additionally, such queries will cause spike in

1. memory consumption by PostgreSQL

   1. potentially also disc space usage if PostgreSQL decides to swap.
2. CPU usage because sorting a large results sets will require CPU usage.

In our Performance/Load tests we have created vague queries that resulted in result sets in millions. Such a queries were rarely executed below 20 seconds.

**How to avoid this problem?**

1. Overview engine, Tree engine and Relationship engines provide modellable option to not load data to fill first pages on the page reload. The user will have to provide constraints to execute the query to load what actually needs to be loaded. This will allow customer projects to have options to configure this model by model.

   1. `Skip data loading` toggle exists in Application model to prevent the first page from loading all data.
2. Restrict queries by extension points/ABAC/client side request intercepts/modelling. Loading huge result sets for users to dig through is not a great UX. We should aim and providing more complex queries that will provide fewer results of higher precision to the user.

   1. Please see [Model-ability](#_model_ability) section for details.

##### Simple\_search

###### Short Input Length

By default, DS comes with limitation of the `simple_search` operator input length (3 characters minimum). This was created for performance and security concerns with too broad searches causing slow queries or even DoS attacks.

**How to avoid this problem?**

Increasing the value of `mgmtp.a12.dataservices.query.simpleSearch.minSearchableTokenSize` to at least 4 should prevent the worst issues. It is also recommended to remove as many irrelevant fields from search as possible.
Doing this will make the data in which DS searches smaller. Less data means faster queries and less resources used by PostgreSQL to resolve queries.

###### Efficient Usage of the `simple_search` Operator

Performance tests show that the `simple_search` operator is one of the slowest in DS. This is mainly due to its use of regular expressions, which are computationally expensive, especially on large datasets.

**How to optimize usage:**

1. **Choose the right operator.** Use `exact_match` instead of `simple_search` when searching for a specific value in a field. This is much faster.
2. **Avoid combining with the `or` operator.** Using `simple_search` together with `or` can significantly slow down queries. If you need to match multiple values, use the `values` property instead of multiple `simple_search` operands within an `or`.
3. **Limit the number of fields.** The more fields you specify for `simple_search`, the more complex and slower the query becomes, as each field adds another `or` clause to the internal regular expression. If you do not need to restrict the search to specific fields, omit the `fields` property for better performance.

##### Queries Using the `or` Operator

The `or` operator is generally slower than the `and` operator because PostgreSQL must evaluate each condition separately and then merge the results. This increases CPU and memory usage, especially with large datasets.

**How to mitigate this issue**

While you cannot fully avoid the performance impact of the `or` operator, you can reduce it by minimizing its use. Where possible, replace `or` with `and` using De Morgan’s law. Additionally, apply more specific constraints to limit the result set, which can further improve query performance.

#### Performance Optimizations By Modeling

##### Removing Irrelevant Fields

Please see [Model-ability](#_model_ability) section for details on how to remove irrelevant fields from indexing. This will help to reduce the size of the index and improve query performance.

##### CDM Modelling For Better Performance

There are two primary use cases for Composed Data Documents (CDDs) in A12:

1. **Single CDD Mutation**: This scenario involves working with a single document and its related documents. The complete documents are loaded, allowing the client to construct the CDD on the client side. CDMs for this use case can be easily built in SME by including the necessary underlying DMs to ensure all required data and relationships are present.

   1. The form engine retrieves data using the `document-graph` projection, which always loads all documents and links in full. In this context, the `fields` property serves a different purpose then other projections.
   2. Performance is generally not a concern for this use case.
2. **Listing Multiple CDDs**: In this scenario, the goal is to retrieve multiple root documents and their related documents, typically for overviews or listings. Only a subset of fields from the CDM is needed, usually for display in forms. Constraints are applied to filter results, and the `cdd` projection is used to load the CDDs. For optimal performance, CDMs should be tailored specifically for the overview, containing only the fields relevant for display rather than all fields from the underlying DMs. Any link or field not removed from the CDM will be filled by DS, which can negatively impact performance.

   1. DS must load all documents and links defined in the CDM. Such CDMs cannot be created directly in SME, as DM includes are hardwired. Instead, these models must be created manually by editing the CDM annotations in JSON and then opening them in SME, or by manual modification without SME support.
   2. Performance is critical when using the `cdd` projection for this use case, so the following section focuses on performance optimization strategies. All fields used in `cdd` projection must be indexed in the underlying DMs. DS will not index fields in CDMs, it will only use the fields from the underlying DMs that are already indexed.

When creating CDMs for overviews, keep performance in mind:

1. Remove all validation rules and computations that are not relevant for the overview from the CDM. This reduces the amount of data loaded and processed, improving performance.

   1. Computation fields present in the underlying DMs can remain as long as they are not transient. Computed fields defined only in CDMs (not present in the underlying DMs) should be avoided, as they are not computed by DS by default.
      Computation can be enabled via configuration, but these fields will only be computed after the query is resolved, which slows down execution and prevents their use in constraints and sorting.
   2. DS will not execute validation aftere construction of CDD therefore validation rules would only make sense for the client-side validation.
2. Avoid repeatable fields, as overviews do not support them. While DS queries can operate on repeatable fields in CDMs, overviews cannot construct such queries, and the results cannot be displayed in the UI.

   1. Some repeatable fields may be useful in the UI (e.g., Policyholder of the Contract), but others, such as all addresses assigned to a Business Partner, are not useful for overviews. Construct CDMs based on the specific use case rather than relying on the default CDM.
3. The closer the CDM is to the root document model, the better the performance. Include only the fields necessary for the overview, not all fields from the underlying DMs. The more fields included, the more data DS must load and process, which can slow down query execution.

   1. Ideally, each overview should have its own CDM tailored to the specific use case, containing only the fields that are relevant for that overview. This will help to reduce the amount of data loaded and processed, improving performance.
   2. It is recommended to create a CDM for each overview that is used in the system. This will help to reduce the amount of data loaded and processed, improving performance.
   3. These models can be even provided during runtime since they do not require any special handling by DS.

#### Client-side Performance Optimizations

The queries that engines generate might not be the fastest queries for your use-case. The Query API is designed to be flexible and extensible, allowing for client-side optimizations. This means that you can modify the JSON-RPC requests on the client side to improve performance. The query coming from the client can be modified to include additional constraints, sorting, or can be replaced by custom operation or by other extension points. This allows you to optimize the query for your specific use case and improve performance.

For more info please see a [guide](#json-rpc-modifying-requests) how to replace JSON-RPC requests on the client side.

#### Sorting Performance

Sorting is computationally expensive, especially on large result sets. When **pagination** is combined with **sorting**, sorting is always performed first and pagination is applied afterwards, because the system must know the globally sorted order before it can determine which items belong to a particular page.

#### Database Performance Optimizations

This section describes possible database tuning measures to improve the search performance of the Query API.

Not all presented options will be applicable for all workloads. As with every tuning measure, this should
be accompanied by baseline tests to be able to measure the effect of each step.

Except for the memory settings, the tuning measures presented here should be considered an exception, rather
than the rule.

|  |  |
| --- | --- |
|  | All links to the PostgreSQL manual use the "current" version which always refers to the most recent PostgreSQL version. Especially system catalogs and views change between PostgreSQL releases. If an older PostgreSQL version is used, that version should be selected in the manual’s navigation bar to see the manual that matches the PostgreSQL version in use. |

#### Configuration Changes

Changing configuration properties should not be done blindly. The resources available to the PostgreSQL instance,
as well as the expected load have to be taken into account. This has to be coordinated with the DBA.

##### Memory Settings

The SQL queries generated by the Query API will benefit from increasing PostgreSQL’s
default values of the properties controlling memory usage.

[`work_mem`](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-WORK-MEM)
:   Search queries will typically result in a `Bitmap Index Scan` on the indexes of the `document_search` table
    which will be more efficient if enough (work) memory is available.

    Increasing `work_mem` to at least 32MB is recommended, 64MB might improve performance further.

    A single query can allocate this amount of memory multiple times while its running. This recommendation
    assumes that the PostgreSQL instance has enough (physical) memory to use this memory without hitting an
    out-of-memory error given the expected workload.

[`temp_buffers`](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-TEMP-BUFFERS)
:   Increasing the value of `temp_buffers` will avoid spilling large intermediate results to disk.
    A value of `250MB` is recommended.

[`shared_buffers`](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-SHARED-BUFFERS)
:   Increasing shared buffers will improve caching of data during retrieval. PostgreSQL relies on an efficient
    file system cache. Increasing this value isn’t as important with PostgresSQL as with other database systems.

    As of PostgreSQL 17, a good starting point for this value is roughly 30%-40% of the available RAM of the system.
    Higher values rarely show further improvement due to double-caching between the file system and PostgreSQL.

    The PostgreSQL development team is in the process of using direct and asynchronous I/O
    for data retrieval which will put more importance on `shared_buffers` in the future (PostgreSQL 18 and beyond).

##### Parallel Query

To support queries using the "simple search" and "exact match" operators, [GIN indexes](https://www.postgresql.org/docs/current/gin.html) are created on the `document_search` table.

While PostgreSQL can use parallel query to process B-Tree indexes, this is not the case
with other index types. Tuning parallel query (e.g. by adjusting `max_parallel_workers_per_gather` or `max_parallel_workers`)
is therefor not necessary.

One situation where this would make a difference is if the query optimizer keeps using "Seq Scan" operations.
In that case parallel query can mitigate the performance problems to a certain extent, assuming the system
is able to support the additional load and I/O that parallel query imposes.

##### Compression

PostgreSQL compresses values automatically that are larger than approximately 2kB.
The method used to compress the values can be configured.

If the majority of the documents in the database is larger than 2kB, then using `lz4` instead of `pglz`
can improve query performance as the `lz4` algorithm (available since Postgres 14) is faster
than the "old" algorithm `pglz`.

Setting the default compression algorithm to `lz4` through [`default_toast_compression`](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DEFAULT-TOAST-COMPRESSION)
to `lz4` is highly recommended.

If changing this setting system-wide is not an option, the compression algorithm can be changed just
for the columns containing document data:

Changing compression algorithm for document content and search data

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` ALTER TABLE document    ALTER content SET compression lz4;  ALTER TABLE document_search    ALTER value SET compression lz4,    ALTER original_value SET compression lz4,    ALTER search_data SET compression lz4; ``` |
```

Changing this (or the global configuration) will not rewrite the table (nor "re-compress" the values),
so this is a very quick operation. The new compression algorithm will only be applied for new or updated values.

If the table `document_search` was partitioned *before* changing the compression method, the above needs to be repeated for each partition.

If the compression method is set directly when creating the partitioned table, then this will be applied to all
partitions automatically.

#### Database Indexes

The "simple search" operator uses a regular expression to match the search value against the fields in the document.
The performance of this operation depends on the size of the documents and thus the size of the value in the
column `search_value`. By reducing the number of indexed fields, the "search value" and the corresponding
index will be smaller, potentially making the regular expression evaluation faster.

Queries involving document models where only few documents exist (compared to the total number of documents),
might benefit from filtered indexes (aka "partial indexes").

In general, filtered indexes (on the `document_search` table) aren’t expected to make a huge performance difference.
The default index uses `model_name` as the leading column and all queries include conditions on the model name.

If filtered indexes are created, the model\_name column does not need to be part of the index.

By default, there is one GIN index on the column `original_value` that is used for exact matches and one
GIN/trigram index on the column `search_value` which is used for simple search queries.

Depending on what kind of queries need improvement, one or both indexes can be created as filtered indexes:

Filtered Indexes for Contract documents

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` -- Index for "exact_match" queries on Contract documents CREATE INDEX idx_document_search_orginal_value_contract     ON document_search USING GIN (original_value); WHERE model_name = 'Contract';  -- Index for "simple_search" queries on Contract documents CREATE INDEX idx_document_search_data_contract     ON document_search USING GIN (search_data gin_trgm_ops) WHERE model_name = 'Contract'; ``` |
```

When using many queries that combine the exact\_match and the simple\_search operators, a combined index helps as well:

Combined Filtered Index for Contract documents

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` -- Index for queries on Contract documents using "exact_match" and "simple_search" operators CREATE INDEX idx_document_search_contract     ON document_search USING GIN (original_value, search_data gin_trgm_ops); WHERE model_name = 'Contract'; ``` |
```

If these indexes are substantially smaller than the default indexes, it is likely that
the PostgreSQL query optimizer will use them, which should lead to quicker responses.

It is recommended to validate the usage of the index using `explain (analyze)`. If the optimizer doesn’t use it,
it is recommended to drop it again, as it will slow down updates to documents and the re-indexing process.

If filtered indexes for **every** data model are created, the default indexes can (and should) be dropped.

##### Required PostgreSQL Extension: pg\_trgm (TRGM)

Data Services requires the `pg_trgm` extension in PostgreSQL for `simple_search` and related features. By default, Data Services enables this extension via a Liquibase changeset. If you are not using Data Services Liquibase migrations, ensure the extension is installed manually:

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` -- As a user with sufficient privileges CREATE EXTENSION IF NOT EXISTS pg_trgm; ``` |
```

#### Partitioning

An efficient index based access to the search data might not always be possible. Depending on the actual queries,
the PostgreSQL query planner might select a sequential scan ("Seq Scan") on the entire table instead.

This can be mitigated by partitioning the `document_search` table by data model. While this will not get rid of the
"Seq Scan", it will limit this to just the partition for that specific data model. This will help if the documents
are distributed across all models equally. If most of the documents are base on one or two models, then partitioning will
not make a substantial difference.

Using partitioning will require more (and manual) administrative work, e.g. the partitions for **all** data models
must be present *before* the re-indexing is started. Before deploying new models, the necessary partitions must
be created manually.

|  |  |
| --- | --- |
|  | While the Liquibase schema migration provided by Data Services are in theory independent of an existing partitioning scheme, it might be possible in the future that manual steps will be needed when deploying a new Data Services version to a database that uses partitioning. |

An existing table can not be "converted" into a partitioned table. It is necessary to create a new partitioned table
and copy the data from the existing one to the partitioned table.

The GIN indexes that support the "simple search" and "exact match" operators do not need to include the `model_name`
column anymore, so they need to be re-created with a different definition.

The following example will convert an existing document\_search table to a partitioned one:

First the existing table is renamed and the constraints and indexes are dropped to avoid naming conflicts:

Renaming existing table and dropping constraints and indexes

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` ALTER TABLE document_search RENAME TO document_search_old; ALTER TABLE document_search_old DROP CONSTRAINT document_search_pkey;  DROP INDEX idx_document_search_original_value; DROP INDEX ix_jsonb_search_data; ``` |
```

Then a new `document_search` table can be created as a partitioned table:

Creating new partitioned table

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` CREATE TABLE document_search (   LIKE document_search_old,   PRIMARY KEY (model_name,doc_ref) ) PARTITION BY list (model_name); ``` |
```

Then one partition needs to be created for each document model:

Creating partitions for each document model

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` CREATE TABLE document_search_model_one   PARTITION OF document_search   FOR VALUES IN ('ModelOne');  CREATE TABLE document_search_model_two   PARTITION OF document_search   FOR VALUES IN ('ModelTwo');  -- do this for every possible data model ... ``` |
```

When using `psql`, this step can be automated by generating the necessary DDL statement based on the existing documents
and execute them directly using psql’s `\gexec` command that runs the result of a query as a script:

Creating partitions for each document model automatically

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` SELECT format('create table %I partition of document_search for values in (%L);',                concat('document_search_',translate(lower(model_name), ' -', '__')),                model_name) as ddl FROM (   SELECT DISTINCT model_name   FROM document ) t \gexec ``` |
```

Once the table and all partitions are created, the existing search data can be copied:

Copying existing search data to new partitioned table

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` INSERT INTO document_search (model_name, doc_ref, value, fulltext_string, original_value, search_data) SELECT model_name, doc_ref, value, fulltext_string, original_value, search_data FROM document_search_old; ``` |
```

The GIN indexes to support the search don’t need to include the model\_name column anymore. To recreate them, use:

Creating indexes on partitioned table

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` CREATE INDEX ON document_search USING GIN (original_value, search_data gin_trgm_ops); CREATE INDEX ON document_search USING GIN (search_data gin_trgm_ops); ``` |
```

If it can’t be guaranteed that new partitions are created before deploying new document models, it is recommended
to create a default partition. This will avoid failures when creating new documents for models, where no partition is
available.

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` CREATE TABLE document_search_model_default   PARTITION OF document_search   FOR VALUES DEFAULT; ``` |
```

#### Monitoring Options

PostgreSQL offers several monitoring tools to investigate performance bottlenecks and slow queries.

Queries generated by Data Services can get quite long. To make sure the logged queries are not cut off in `pg_stat_statements` or when
written to the log file, the propery [`track_activity_query_size`](https://www.postgresql.org/docs/current/runtime-config-statistics.html#GUC-TRACK-ACTIVITY-QUERY-SIZE)
should be increased to (at least) 16kB. The memory required by this value is determined
by `max_connections * track_activity_query_size`. With a default setting 100 for connections, this will allocate
roughly 2 MB memory during startup. If the query text is still cut off in `pg_stat_statements`, consider increasing
this value even more.

##### Logging Slow Queries

If performance problems can not be reproduced in a reliable way, enabling the logging of slow queries
(in the PostgreSQL log file) can help identifying the problematic query.

[`log_min_duration_statement`](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-MIN-DURATION-STATEMENT)
:   This property can be used to log all statements that are slower than the threshold to the PostgreSQL logfile.

    Once this is enabled, the log can be analyzed regularly to detect performance problems with specific queries.
    The execution plan of those queries can then be investigated.

    It is recommended to start with a higher value, then lower it subsequently if no problematic queries are logged.

[`auto_explain`](https://www.postgresql.org/docs/current/auto-explain.html)
:   The auto-explain extension is an alternative to `log_min_duration_statement`. It can be configured to automatically
    log the execution plan of a query if its runtime exceeds a threshold.

    By enabling this, the (slow) query plan is available immediately rather than having to run `explain` manually on the query.

##### pg\_stat\_statements extension

The extension [`pg_stat_statements`](https://www.postgresql.org/docs/current/pgstatstatements.html) provides a more fine-grained log of all queries in the database compared to the approach using `log_min_duration_statement`.

|  |  |
| --- | --- |
|  | Enabling this extension is highly recommended, even if there are no immediate performance problems. It’s an invaluable tool for every DBA. |

The extension will store details about the resource usage of each query, e.g. time spent in I/O,
or the number of blocks fetched from the cache.

Values to investigate in the view `pg_stat_statements`:

| Column Name | Description |
| --- | --- |
| `temp_blks_written` | High values indicate that `temp_buffers` (and possibly `work_mem`) should be increased. This can also be determined when logging temp file usage through [log\_temp\_files](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-TEMP-FILES). |
| `shared_blks_hit` | The total number of blocks found in the buffer cache. Low values indicate that increasing `shared_buffers` might improve performance. |
| `blk_read_time` | The total amount of time spent reading data from disk. High values indicate that `shared_buffers` should be increased (named `shared_blk_read_time` in PostgreSQL 17 and later). |

Note that pg\_stat\_statements normalizes the query text, replacing constant values with parameter placeholders.
To analyze the runtime based on the original query text (including the parameter values), using `log_min_duration_statement` as described above can be used.

##### Temp File Usage

It is recommended to set [log\_temp\_files](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-TEMP-FILES)
to `0` to log all usages of temp files. With sufficient memory allocated to PostgreSQL, temp files (buffers) should
not be used at all.

This is a bit more detailed than `pg_stat_statements.temp_blks_written` as it logs this on a per-query basis.

##### Index Usage

When creating indexes specifically for certain workloads it is recommended to validate their usage.

The system views [pg\_stat\_user\_indexes](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-INDEXES-VIEW)
and [pg\_statio\_user\_indexes](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-INDEXES-VIEW) will
contain usage details about each index. By monitoring changes to these system views, the usage can be tracked over time.

If some custom indexes are not used, they should be dropped, in order to speed up (re)indexing of documents.

#### Other Database Tuning Options

##### Upgrade to the latest PostgreSQL version

Almost all PostgreSQL releases improve performance. Either by improving I/O throughput, data processing or the query
optimizer to find better execution plans.

The performance tests for the Query API run approximately 5%-10% faster on PostgreSQL 17
compared to PostgreSQL 16.

## Data Migration Support

### Predefined migrations

Data Services (DS) provides predefined migration steps for common use cases. It is important to note that these migration steps are valid for a **single release line only**. For more information, refer to the section on [breaking change management](#breaking-changes).

All predefined migration steps provided by Data Services are associated with public classes that extend the `com.mgmtp.a12.dataservices.migration.AbstractMigrationStepConfiguration` which provide values for configurable parameters such as number of threads, batch size…​ Each migration step includes a default implementation for its associated configuration, which you can customize by simply defining your own bean using `@Bean` and `@Primary` annotations. Once defined, your configuration will be automatically detected and applied.

For instance, the `com.mgmtp.a12.dataservices.migration.AbstractMigrationStepConfiguration` class includes a field called `errorHandling`, which controls the error handling behavior. Here’s an example of how this configuration can be changed:

Example of custom migration step configuration

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` @Primary @Bean public ExampleMigrationStepConfiguration exampleMigrationStepConfiguration() { 	return new ExampleMigrationStepConfiguration(ErrorHandling.CONTINUE); } ``` |
```

### Custom migration

|  |  |
| --- | --- |
|  | Refer to the [DS examples section](#data-services-examples) for an example of custom migration. |

Data Services support data migration with a simple framework which allows you to mark a class which is responsible for the data migration with `@MigrationStep` annotation.
The migration can be executed during application initialization or via `dataservices-server-init-app`.
After the execution, we persist the information about all executed migration tasks.

To implement a migration you have to mark a class which is responsible for the migration, which in the most cases will be a migration of documents or models but, in fact, it can be any kind of migration.
It automatically publishes this class to a Spring container and processes all injects.

A migration class (i.e. a class annotate with `@MigrationStep`) doesn’t have any specific constraints.
All migration tasks defined in a migration step (see [Migration Task](#migration_task)) will be executed.
The order of the method execution is not guaranteed.
If you need a strict ordering, you have to handle it on migration step level (see [Migration Execution](#migration_execution)).

### Migration Step

The base unit of a migration is a `@MigrationStep` annotation which has a couple of properties.

Required properties:

|  |  |
| --- | --- |
| `name` | Human readable step name. Usually should express what the step is good for. |
| `version` | The Data Services version which the step belongs to. It is highly recommended to use DS versioning here to make sure that the step will be executed in the correct order. |

Optional properties:

|  |  |
| --- | --- |
| `author` | Username or full name. |
| `description` | Brief description what the step is doing. |
| `runAlways` | Indicates if the step should be executed with every migration execution. Default is `false`. |
| `onFailure` | Defines the error handling for the step. Default is `HALT`. For more info see section [Error Handling](#migration_error_handling). |
| `executedClassName` | The name of the class that is annotated with `@MigrationStep` is part of the migration step identifier. Thus, moving this class or changing its name will change the id of the migration step which will cause the migration step to be executed again. To avoid this problem you may use this optional parameter to use the previous class name to match already executed migration step. |

A migration step represented by a class annotated with `@MigrationStep`. Each migration step has one or many migration tasks. A migration task is a public/protected method in the migration step class which has no arguments and which is annotated with `@MigrationTask`.

The creation of a custom annotation by composition of `@MigrationStep` and other annotations is possible. For an example, please refer to the `examples-dataservices-init-app` artifact.

### Migration Task

A migration task is a visible (not private) method of the class annotated by `@MigrationStep`. The method must have no parameters and must be annotated by the `@MigrationTask` annotation.

Properties of `@MigrationTask` (all optional):

|  |  |
| --- | --- |
| `name` | Migration step name, default is "[unassigned]". |
| `runAlways` | Defines if the step should run with each migration or only once, default = `false`. |
| `onFailure` | Defines the error handling in case of migration step failure, default = `HALT`. For more info see section [Error Handling](#migration_error_handling). |

|  |  |
| --- | --- |
|  | There is no implicit migration task concept anymore. All methods which should be executed must be annotated by `@MigrationTask`. |

### Migration Execution

When the migration process is started, all migration steps are loaded.
After loading, they are grouped by their `version`.
In case that `version` doesn’t follow semantic versioning, an exception is thrown, the server stops to initialize and terminates.

In the next step we sort the versions in ascending order and start executing all steps which belong to a version. All steps which belongs to a particular version are executed based on their `@Order` annotation, if any. Steps without `@Order` annotation are executed after those with `@Order` annotation.

Based on the error handling we persist information about executed step/tasks into the table `migration_step`.

### Error Handling

Each step or task can have defined an error handling in case of failure.
There are 3 possible cases:

|  |  |
| --- | --- |
| `CONTINUE` | Ignore the error and continue with the execution. Don’t store the information that the migration step or task has been executed. |
| `HALT` | Stop the migration process. Don’t store the information that the migration step or task has been executed. |
| `MARK_RUN` | Ignore the error and continue with the execution. Store the information that the migration step or task has been executed. |

### Example Usage

Let’s consider as an example that you have two models `Model1` and `Model2`.
For both models you need to always check that a new (optional) field `/Partner/name` is filled in all documents. If the field is missing or empty just report it. Then, you need to upgrade both models to a new version and fill the new optional field.

This leads to 3 migration classes which need to be ordered. First, we have to execute the model migration and then the field check.
In the `MigrationStepOne` you can see an application of the `@MigrationTask` annotation where it is used for redefining the task name.

To inspect this example you can check `com.mgmtp.a12.dataservices.example.migrations.MigrationStepOne`, `com.mgmtp.a12.dataservices.example.migrations.MigrationStepTwo` and `com.mgmtp.a12.dataservices.example.migrations.MigrationStepThree` in `examples-dataservices-init-app`.

All steps belong to a single version which means that we have to order them by the `@Order` annotation.

The `MigrationStepOne` and `MigrationStepTwo` will be executed only once.
After the execution there will be a new row for each step in the table `migration_step`.

The `MigrationStepThree` will be executed (as last step because it is not annotated with `@Order`) with each migration (since the flag `runAlways=true`), and after each execution there will be again a new row in the table `migration_step`.

## Documents

Documents are the core data entity in Data Services, consisting of document data and document metadata.

As modeling and other aspects are described elsewhere, this section focuses on metadata.

Two models control the structure of a document:

* The document model, which is specific to each document type. Multiple document models may exist in the application, defining documents of different structures. This model is used for validation and computation when a document is uploaded to Data Services.
* The document metadata model, which is singular across the application. Documents are enriched with metadata upon upload. Metadata is generated automatically by the application and should not be provided by the client. When a document is downloaded, metadata is already included, so the downloaded document contains additional metadata fields compared to the uploaded one.

The metadata model is bundled with the application and cannot be updated by users.

|  |  |
| --- | --- |
|  | Metadata fields are included by default in the `simple_search` operator, but can be excluded by setting the `mgmtp.a12.dataservices.query.simple-search.excluding-metadata.enabled=false` configuration property. |

## Attachments

An attachment is any file which can be attached to an A12 document.

* Attachments are stored in a configurable store and the document contains only references to those attachments.
* An attachment API is used for handling of attachments, Document API is used for handling the attachment assignments (reference management).
* Data Services provide extension points (see [here](#attachment-extension-points)).

### Attachment Definition and Usage

All attachments are defined by a group with `"usageType": "attachment"`.

Example of an attachment group definition

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 ``` | ``` {     "type": "Group",     "id": "G2",     "name": "MyAttachment",     "externalDescription": [         {             "locale": "en",             "text": "External Description Text"         }     ],     "internalDescription": [         {             "locale": "en",             "text": "Internal Description Text"         }     ],     "Group": {         "repeatability": 10,         "required": false,         "usageType": "attachment",         "elements": [             {                 "type": "Field",                 "id": "F3",                 "name": "original_filename",                 "Field": {                     "fieldType": {                         "type": "StringType",                         "StringType": {}                     }                 }             },             {                 "type": "Field",                 "id": "F4",                 "name": "internal_filename",                 "Field": {                     "fieldType": {                         "type": "StringType",                         "StringType": {}                     },                     "required": true                 }             },             {                 "type": "Field",                 "id": "F6",                 "name": "attachment_id",                 "Field": {                     "fieldType": {                         "type": "StringType",                         "StringType": {}                     }                 }             },             {                 "type": "Field",                 "id": "F8",                 "name": "mime_type",                 "Field": {                     "fieldType": {                         "type": "StringType",                         "StringType": {}                     },                     "required": true                 }             },             {                 "type": "Field",                 "id": "F9",                 "name": "category",                 "Field": {                     "fieldType": {                         "type": "StringType",                         "StringType": {}                     }                 }             },             {                 "type": "Field",                 "id": "F10",                 "name": "description",                 "Field": {                     "fieldType": {                         "type": "StringType",                         "StringType": {}                     }                 }             }         ]     } } ``` |
```

The only required field in this group is `attachment_id`, which references an existing attachment.

Other fields in the group may be used by Kernel logic to improve user experience during rendering. Data Services processes this group like any other in the document. The attachment model is not persisted in DS, so validation must be handled in SME by reviewing model validation rules. DS relies solely on the `attachment_id` field for groups with `usageType=attachment`.

Example of a document with an attachment group

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` {     "MyAttachment": {         "original_filename": "",         "internal_filename": "internal",         "attachment_id": "1bcf66bf-fc49-48a3-b386-c07b5563924f",         "mime_type": "jpg",         "category": "",         "description": ""     } } ``` |
```

### Attachment Upload

Attachments can be uploaded to the server using the endpoint

Attachment upload endpoint

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` POST v2/attachment?filename=&documentModelName=&pathToField= ``` |
```

which will add attachment metadata to the `ATTACHMENT_HEADER` table and the attachment itself will be stored in the Content Store (Attachment Store). For attachments of types: `JPEG`, `PNG`, `BMP`, `WBMP` , `GIF` or `SVG`, thumbnails will be generated with `.png` extension in 2 configurable sizes. It is also possible to generate custom thumbnails which will overwrite DS thumbnail generation using extension points.

|  |  |
| --- | --- |
|  | SVG is only supported for Thumbnailator. Enabling `mgmtp.a12.dataservices.attachments.thumbnail.optimization.url.enabled` would return an empty url. |

All `filename`, `documentModelName` and `pathToField` are mandatory query parameters.

* `filename` is not only attachment identifier the user knows but also with correct file extension might be a hint for supporting attachment mime type detection more precisely, therefore it is vital for attachment handling.
* `documentModelName` is needed for security purposes. The user of this endpoint must have `MODEL_READ` permissions because the attachment is always meant for some document, and the user needs read access to the model of this document.
* `pathToField` Not yet implemented, but it is mandatory parameter. Empty string could be used.

|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | There is no attachment update available. To change attachment create new attachment and un-assign old one.  For more information on the attachment storing and downloading please see [Content store section](#content-store).  The table below shows the differences in mime type detection between uploading attachments with and without correct `filename`.   |  |  |  | | --- | --- | --- | | File Type | File Name | Detected Mime Type | | Json | Attachment | text/plain | | Json | Attachment.json | application/json | | csv | Attachment | text/plain | | csv | Attachment.csv | text/csv |   There are differences in mime type detection for MS Word doc and docx files. Based on the [official Microsoft MimeType formats](https://www.askingbox.com/info/mime-types-of-microsoft-office-file-formats), MS Word doc file will have mime type application/msword and MS Word docx file will have mime type application/vnd.openxmlformats-officedocument.wordprocessingml.document. |

### Attachment Download

Before an attachment or a thumbnail can be downloaded it must become available via `LOAD_ATTACHMENT_URL` (for attachments) or via `LOAD_THUMBNAIL_URL` (for thumbnails).

* `LOAD_THUMBNAIL_URL` will return stable public URLs (no security will be applied during download) which will contain caching instructions for the browser.

  + Only one parameter `attachmentId` is mandatory which will be used to load the thumbnail ids.
* `LOAD_ATTACHMENT_URL` will generate expirable public URLs (no security will be applied during download) with instruction for the browser not to cache. The expiration period is configurable.

  + `attachmentId` is mandatory because it is needed to locate the attachment in the system.
  + `docRef` of the document where the `attachmentId` is assigned. The URL will be provided only for attachments that are already assigned to a document. This check ensures that attachments will be available only to users that have permissions to see the document. This parameter is mandatory for security reasons.
* The diagram below shows how attachment can be retrieved from Data Services and Content Store:

![load attachment url sequence impl](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/uml/load_attachment_url_sequence_impl.svg)

Figure 19. Content download diagram

### Attachment Deletion

There is no API to delete attachments from the store directly. An attachment is marked for deletion if the document has unassigned this attachment from its references.

Attachments marked for deletion are then picked up by `CleanUpDirtyAttachmentsJob` which will delete them from the system if there are no existing references for the respective attachment. This behavior can be [extended](#extending-api-attachments) by adding `IDirtyAttachmentCleanupCondition` bean to add additional decision logic.

Attachments that have been created but not assigned will be picked up by `CleanUpStaleAttachmentsJob` which will remove attachments with no references that has been created a configurable amount of time ago.

### Attachment Assignment

All attachments of a document are synchronized everytime the document is saved (`ADD_DOCUMENT`, `MODIFY_DOCUMENT`, `PARTIAL_MODIFY_DOCUMENT`). All attachments referenced from a document must exist before the document can be saved. All attachments that are no longer used in the document will be marked as dirty and deleted in due time.

Attachment assignment is transactional. Multiple attachment assignments in multiple document update operations in a single `JSON-RPC` will transition from one consistent state to the next for all assignments.

### Attachment Extension Points

|  |  |
| --- | --- |
|  | Refer to [DS examples section](#data-services-examples) for an example of using attachment extension points. |

Attachment handling is separated between DS code (metadata, extension points) and Content Store code (content, extension code). See diagram to see what can be used for extensions. There are also examples available (encryption of attachments,..).

![attachment v2 class diagram](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/uml/attachment_v2_class_diagram.svg)

Figure 20. Attachment V2 diagram

### Attachment Mime Type Probing Improvement

Data Services introduces properties to improve contents mime type probing.

* `mgmtp.a12.dataservices.attachments.mimeType.probeMimeType.enabled` for enable/disable probing mime type for attachments feature. If enabled, Data Services will probe attachments mime type and send the result to Content Store while persisting attachments, in other case mime type will be probed by Content Store during attachments persistence.
* `mgmtp.a12.dataservices.attachments.mimeType.inMemoryTemp.enabled` for enable/disable using in-memory temporary file while probing attachments mime type. If enabled, we will use in-memory temporary file for probing attachments mime type, in other case temporary file will be located on File System, this will require hard disk write permission.

Data Services and Content Store properties compatibility matrix:

|  |  |  |
| --- | --- | --- |
| Data services probeMimeType.enabled | Content Store trustExternalMimeType.enabled | Description |
| false(default) | false(default) | This is default behavior as previous versions, Content Store will probe content mime type. |
| false | true | This setup makes no sense, since Content Store requires `mimeType` but Data Service will never probe it this will cause Invalid Input Error. |
| true | false | This setup is wasting performance, Data Services will handle attachments mime type probing and send result to Content Store but Content Store will still probe mime type again. |
| true | true | Data Services will handle attachments mime type probing and send result to Content Store, the result is trusted and accepted. |

## Relationships

* [Model Graph](#model-graph)
* [Relationship Model](#relationship-model)
* [Relationship Migration](#relationship-migration)

### Abbreviations

|  |  |
| --- | --- |
| RM | Relationship Model |
| DM | Document Model |
| LM | Link Document Model |
| RL | Relationship Link |

### Overview and Definitions

An association between 2 documents is called a `Relationship Link` (RL). This RL refers to a source and a target document and can contain additional information about the relationship . Every RL needs a `Relationship Model` (RM) which contains, amongst others, the source DM, the target DM, and the LM. This structure of the RM is defined in the `Relationship Meta Model`. A RL contains references (docRefs) of the documents which implement the source and target DM in the RM. Furthermore, it may contain the id of the document that implements the LM of the RM. In case the RM does not provide a LM then the docRef of the LM document has to be blank as well.

### Document Model CRUD

* Creation of a new DM does not affect existing relationships in any way.
* Update of a DM might affect relationships in the following ways:

  + Changed permissions ⇒ The DM is now not visible to some users and therefore relationship might disappear from the model graph as well.

    - Since the model graph is not cached the current value would be calculated on the fly. So no changes are needed on an update of a DM.
  + Content of the DM may conflict with documents already present in the DB.

    - We currently have this situation, and it is not a responsibility of Data Services team to handle it. It is a migration topic.
* Deletion of a DM would have the same effect as a change of the permission and therefore should be treated in the same way.

The update or deletion of a DM might result in changes of a model graph which could be possibly already loaded on client startup. This can be considered a minor issue since we do not support model changes at runtime. We would suggest having a mechanism on client side to load model graph from the server every x minutes if this is a problem.

### Document CRUD

* Creation of a document does not affect relationships in any way.
* Update of a document might affect relationships feature in the following way:

  + Paged candidates-lists based on some filter might get corrupted by updating a document that is in that result set in a way that the document would be excluded from the result set (or the other way round).

    - This is currently the case for the overview engine, too, and could be solved by the introduction of cursors.
  + The same applies for the deletion of a document that should be displayed in a paged result set.
* Deletion of a document using the `DELETE_DOCUMENT` operation will remove links associated with the deleted document first.

### Model Graph

The model graph is a representation of the relationships between various DMs stored in the persistent store and visible to the currently logged-in user. The model graph contains the following information:

* List of available DMs.

  + For each DM in the list there is:

    - A section for other DMs which are in a relationship with it.
    - A section for subTypes of the DM.
    - Information whether the model is `abstract`. Abstract model means that there is no possibility to create documents of that model. Abstract models are intended just to be parents of its subtypes. To create a model as abstract add `abstract` annotation to it with no value (`""`) or value of `"true"`. Other values will be considered NOT abstract.

      * This information is taken from the document model `subTypes` annotation. Each super type needs to specify its closest subtypes (comma separated list). These annotations will be recursively introspected during the model graph generation.

        |  |  |
        | --- | --- |
        |  | Please note that Data Services is not able to detect cyclic type definitions. Therefore, the following state will be considered invalid leading to runtime errors: MODEL1 is a subType of MODEL2 and MODEL2 is a subtype of MODEL1. |
* List of all RMs in JSON representation.
* List of available CDMs (i.e. the CDMs where the current user is allowed to see all included DMs).
* List of all other relevant models (if any) and their references, except the ones supported by Data Services (no Document models and Relationship models here).

#### Relationship Model Availability

|  |  |
| --- | --- |
|  | Refer to the [Relationship Model](#relationship-model) to see detailed structure of Relationship Model. |

The availability of the RM is related to the current user because in order to determine if the RM is valid we need to check the permissions of all DMs that are used in the RM.

We consider a RM accessible if:

* The `entityCharacteristics` group has exactly 2 entries (there are no 3-way relationships allowed).
* The current user has permissions to read RelationshipMetaModel.
* The current user has permissions to read all DMs specified in `entityCharacteristics` entries.
* The current user has permissions to read the DM assigned to the `linkDocumentModel` property.

#### DMs Displayed in a Model Graph

* All DMs which the current user is allowed to see and which are not part of any RM.
* All DMs that are part of a RM if the RM is accessible for the currently logged-in user.

  + This includes the DMs in the `entityCharacteristics`, LM and generated models.

#### Structure

The model graph JSON contains the following main properties:

* `documentModels`: Contains all available Document Models (DMs). Each entry provides the model’s ID (`modelId`), display labels (`displayLabels`), relationships to other models (`relations`), subtypes (`subTypes`) and whether the model is abstract (`abstractModel`).
* `composeDocumentModels`: Lists all Compose Document Models (CDMs) that the current user can access. Each entry includes the model’s ID (`modelId`) and display labels (`displayLabels`).
* `relationshipModels`: Describes all Relationship Models (RMs) in detail. Each entry contains metadata (`header`) and the structure of the relationship (`content`), including roles (`role`), link constraints (`linkConstraints`), and associated document models (`documentModel`).
* `genericModels`: Lists all other relevant models. Each entry has the model’s ID (`modelId`), display labels (`displayLabels`), model type (`modelType`) and all references to other models (`modelReferences`).

#### Dataservices Core Tooling

Data Services provide a tool for generating model graphs from your models. Its basic usage is as follows:

* `java -jar dataservices-core-tooling-38.4.2-fatjar.jar ARGUMENTS` or simply
* `./dataservices-core-tooling-38.4.2-fatjar.jar ARGUMENTS`

`ARGUMENTS` should specify the path to the models folder from which you wish to generate the model graph.

Example: `java -jar dataservices-core-tooling-38.4.2-fatjar.jar file:/Users/a12/resources/models`

**Note**
Use `--help` (alias `-h`) flag to show all available options.

### Relationship Model

The Relationships feature is based on the Relationship models defined in the `RelationshipMetaModel`, which can be found
in `dataservice-models` module.

Security for relationship models is provided in the same way as for all other models:
The user must have `MODEL_READ` access right for the RM, the source and target DMs, and the LM (this might not be present in the RM) to
be able to read the RM.

The following properties of RMs are currently used. They all are mandatory and split into `header` and `content`:

Relationship model structure

```
@startjson
{
	"header": {
		"id": "ContractBusinessPartner",
		"modelType": "relationship",
		"modelVersion": "3.0.0",
		"locales": [
			{
				"code": "en"
			},
			{
				"code": "en_US"
			}
		],
		"labels": [
			{
				"locale": "en",
				"text": "ContractBusinessPartner"
			}
		],
		"annotations": [
			{
				"name": "roles",
				"value": "guest,admin,systemAdmin"
			}
		],
		"modelReferences": [
			{
				"purpose": "Document model",
				"modelType": "document",
				"alias": "Contract",
				"reference": "Contract"
			},
			{
				"purpose": "Document model",
				"modelType": "document",
				"alias": "BusinessPartnerSuper",
				"reference": "BusinessPartnerSuper"
			}
		]
	},
	"content": {
		"duplicatesAllowed": false,
		"associationType": "SHARED",
		"storage": "EXTERNAL",
		"labels": [
			{
				"locale": "en",
				"text": "ContractBusinessPartner"
			}
		],
		"entityCharacteristics": [
			{
				"ordered": false,
				"navigable": true,
				"linkConstraints": {
					"multiplicity": {
						"lowerLimit": 0,
						"unbounded": true,
						"upperLimit": null
					}
				},
				"candidateConstraints": {},
				"labels": [
					{
						"locale": "en",
						"text": "Contract"
					}
				],
				"role": "Contract",
				"documentModel": "Contract"
			},
			{
				"ordered": false,
				"navigable": true,
				"linkConstraints": {
					"multiplicity": {
						"lowerLimit": 0,
						"unbounded": false,
						"upperLimit": 1
					}
				},
				"candidateConstraints": {},
				"labels": [
					{
						"locale": "en",
						"text": "Main Policy Holder"
					}
				],
				"role": "Partner",
				"documentModel": "BusinessPartnerSuper"
			}
		]
	}
}
@endjson
```

Header:

`/header/id`
:   Relationship name.

`/header/modelType`
:   Model type must be specified as `relationship`.

`/header/annotations`
:   Roles annotation must be provided.

`/header/locales`
:   At least one locale must be provided.

`/header/modelReferences/modelType`
:   The type of the referenced model must be specified as `document`.

`/header/modelReferences/reference`
:   Reference of model must be provided.

Content:

`/content/labels`
:   Display label has to contain `locale` and `text` fields.

`/content/linkDocumentModel`
:   Name of the LM, where model must exist and user must have permission to read.

`/content/duplicatesAllowed`
:   Switch for `LIST_CANDIDATES` operation which filters out already assigned links.

`/content/entityCharacteristics`
:   Group for definition of characteristics of the relationships.

`/content/entityCharacteristics/role`
:   Role identification. All operations are using this property to identify which side of the relationship is being referred to.

`/content/entityCharacteristics/ordered`
:   Boolean switch that defines if a user-specified ordering should be applied or the default one (the oldest links first).

`/content/entityCharacteristics/documentModel`
:   Reference to the DM which should be used for the document for the respective side of the relationship.

`/content/entityCharacteristics/linkConstraints/multiplicity`
:   Group for multiplicity constraints of links.

`/content/entityCharacteristics/linkConstraints/multiplicity/lowerLimit`
:   Minimal number of occurrences of the entity in the relationship. `DELETE_LINK` operation will not allow deletion if after the deletion this limit would be breached.

`/content/entityCharacteristics/linkConstraints/multiplicity/upperLimit`
:   Maximal number of occurrences of the entity in the relationship. `ADD_LINK` operation will not allow creation if after the creation this limit would be breached.

`/content/entityCharacteristics/linkConstraints/multiplicity/unbounded`
:   Switches off `lowerLimit` and `upperLimit` functionality.

### Relationship Migration

To migrate Relationship Model files, first install or update the migration tool with:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm install -g @com.mgmtp.a12.dataservices/dataservices-relationship-model-migration ``` |
```

Then, run the following command to perform the migration:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` relationship-model-migration <path to relationship model file or directory> --backup ``` |
```

Examples:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` # file relationship-model-migration my-relationship-model.json --backup  # folder reltionship-model-migration . --backup ``` |
```

**Note**

1. If `<path to relationship model file or directory>` is a directory, the migration tool will recursively search for Relationship Model files to migrate.
2. If Relationship Model files are not under version control, use `--backup` (alias `-b`) flag to create backups for model files. This flag is optional.
3. Use `--help` (alias `-h`) flag to show all available options.

## Compose Documents

### Setup Server for CDD

DS natively support CDM feature there is no additional setup needed to use it.

|  |  |
| --- | --- |
|  | The use of CDMs in conjunction with "unbounded" multiplicity of relationship models presents a security risk, enabling client to retrieve documents and links for a CDM bypassing Links.pageLimit and Documents.pageLimit. Consequently, there exists the room for DoS attack by incorporating a CDM containing a root document with an extensive array of linked documents. It is recommended to reduce the multiplicity of the roles in the Relationship Model to a value that aligns with the project’s contextual requirements. |

### CDM Handling

A CDM is a document model which contains CDM annotations and is used by Data Services in `QUERY` operation using `cdd` and `document-graph` projections.

![cdm](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/uml/cdd/cdm.svg)

Figure 21. Example of CDM structure

#### Load CDM

Similarly, as with relationship models, we only allow access to a CDM if the user has permissions to see all document models and relationship models included in this CDM. The computation of these permission checks is very costly and for this reason we are caching the result of permission checks.

User is allowed to load CDM if

* (s)he is allowed to load the model itself as well as it’s `cdm.queryRoot` document model.
* (s)he is allowed to load all relationships in the groups annotated with `cdm.relationship`. Authorization check for each RM consists of authorization check of the RM model itself and authorization checks of source, target, and link document model.

A CDM reference will be included in the `modelGraph` if the current user is allowed to load the CDM. This means we should have 3 root nodes in the model graph now: `documentModels`, `relationshipModels` and `CDMs`.

### CDD Handling

Compose documents (CDDs) are the documents of the CDM models. These documents are not regular documents and therefore they are not persisted together with the regular documents, and they cannot be retrieved using `document` or `document-graph` projection from `QUERY` operation.

DS provides only one API to load constructed CDDs based on the query specificaiton. To achieve this please use `cdd` projection of the `QUERY` operation or underlying service layer.

#### document-graph Projection

A CDM defines how links and documents can be organized into a composed data document (CDD). A document graph contains all documents and links which are needed to construct a CDD.

When loading a document graph the server will apply the following principles:

* Complete documents are always loaded from the persistent store
* The access to the links and documents will be secured. The access to the models and documents will be checked in a fail fast way. So, in order for the operation to succeed the user must have all permissions as described below :

  + All models will be loaded for the CDM to check if the user has permissions to see the CDM.
  + All links and documents will be loaded using repository access injection.

    - This means that the missing link or document authorization violation will create the same result: Less data in the document graph

Standard `QUERY` response is provided for this projection. The root documents are stored in `entries` property where target and link documents are stored in `links` property of the Query response.

#### cdd Projection

For overview use cases it is necessary to be able to search in the CDDs securely with full support of pagination, filtering and sorting. To address these use-cases we introduced the `cdd` projection of `QUERY` operation. This projection is a very similar to `document` without `links`. There are however couple of differences in the following aspects:

* There is no heterogeneity allowed for `cdd` projection. A12 does not support CDM heterogeneity only heterogeneity in the DMs used in CDM
* `cdd` projection works only for the `CDM` models. Using regular DMs will cause an error.
* Repository access is not required for the CDM fields but the existing repository access constraints will be constructed bottom up from existing constraints on included models. I.e.: ContractCDM using BusinessPartner and Address DM will result in `cdd` projections where repository access constraints will be added to the query from Contract, BusinessPartner and Address DM. See more examples in Security section
* CDDs are constructed during runtime therefore make sure that only data needed for Overview or Tree engine are requested from DS. The bigger the CDM, the more data needs to be loaded and the slower the `QUERY` response.
* Root constraint (constraint in the root query) of the `cdd` projection can only work for Root DM of the CDM. Using linked DM is possible but `has` operator must be used.

  + Using CDM fields for linked DM will not work. The field names from the linked DM must be used.
* CDD projection may produce empty objects in the output. This is valid and does not affect the underlying data; it only represents empty values. For performance reasons we do not prune all empty objects. Doing so would require a full traversal of the entire object graph, which is inefficient.

## Java API

There are two ways how to use Data Services Java API:

* call its functionality to get or modify data
* extend the functionality and behavior of Data Services which is a more advanced topic.

Let’s learn about both approaches in the next two chapters.

### Calling Data Services functionality

Data Services exposes several functional areas via its Java API, including model management, document operations, and supporting utilities. You can fetch, update, and search models and documents, leverage helper classes, and handle exceptions according to defined rules. This chapter introduces these capabilities.

#### Model API

To work with models, use `ModelService`. This service handles generic models, including Document Models, Relationship Models, and others. When you load a model with this service, you receive a `GenericModel` type.

To obtain a specific model type (document, relationship, or CDM), use the dedicated loaders:

* `DocumentModelLoader`
* `ComposeDocumentModelLoader`
* `RelationshipModelLoader`

![model api](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/uml/model_api.svg)

Figure 22. Model API class diagram

##### IModelRepository

A model repository enables client projects to implement custom behavior for model CRUD operations.

`ModelService` uses the `supports` method of `IModelRepository` to find a repository implementation for a given model. If multiple implementations are found, the first one is loaded. Custom repository developers must define the order in which repositories are loaded.

See the `IModelRepository` interface for details.

The `save`, `load`, and `update` methods return a `GenericModel`, representing any model type and containing both the header and string content. To obtain another type, such as `IDocumentModel`, pass the string content of the `GenericModel` to a suitable deserializer function.

#### Document API

##### DocumentService

`DocumentService` is the entrypoint for document persistence and supports multiple document repositories. The service selects the appropriate repository implementation for each request, allowing customization by implementing `IDocumentRepository`. For details, see [document repository customizations](#iDocumentRepository).

![document api](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/uml/document_api.svg)

Figure 23. Document API class diagram

##### Document Querying

All data retrieval operations are performed by `QueryService`. For more information, see [Query API](#queryAPI).

##### IDocumentRepository

`IDocumentRepository` enables client projects to implement custom persistence behavior for specific documents. `DocumentService` uses the `supports` method to determine the appropriate repository for a given document. Multiple implementations are allowed, but only one repository must be selected per document. The `supports` method accepts a `DocumentV2` and returns a boolean indicating support. For example, repositories can be separated by model name: one implementation for `documentModel1`, another for `documentModel2`. Each document must reside in a single repository to prevent duplication.

During persistence, `DocumentService` iterates through all repository implementations and selects one using the following logic:

Selecting the appropriate repository

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` 	private IDocumentRepository getDocumentRepository(DocumentV2 document) { 		return documentRepositories.stream() 			.filter(repository -> repository.supports(document)) 			.findFirst() 			.orElseThrow(() -> { 				log.error(String.format(REPOSITORY_NOT_FOUND, document.getDocumentModelId())); 				return new NotFoundException(String.format(REPOSITORY_NOT_FOUND, document.getDocumentModelId())); 			}); 	} ``` |
```

If multiple implementations support a document, only the first is used. Developers must define the repository loading order. We recommend separating `IDocumentRepository` implementations by document model to avoid duplicate `DocumentReference` values, which is invalid.

The first supporting repository is chosen, so ordering is crucial. Use the `org.springframework.core.annotation.Order` annotation to specify precedence. For example, the default implementation `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentRepository` is assigned the lowest precedence, ensuring custom implementations are checked first.

Repositories can also target specific documents regardless of model. The `supports` method allows selection based on any document field. To ensure a specific implementation is always checked first, use:

Setting repository precedence

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` @Order(Ordered.HIGHEST_PRECEDENCE) ``` |
```

|  |  |
| --- | --- |
|  | `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentRepository` is internal and not intended for extension. |

#### Attachment API

The `AttachmentService` allows you to:

* create attachments with thumbnails
* retrieve download URLs for attachments and thumbnails

The `AttachmentHeaderService` can be used to:

* create, load, and delete an `AttachmentHeader`
* assign and unassign an attachment to or from a `GenericReference`, typically a `DocumentReference`
* retrieve a list of stale attachments (attachments unassigned longer than a configurable period)

The `AttachmentHeaderRepository` provides the repository layer for the `AttachmentHeaderService`.

![attachment service](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/uml/attachment_service.svg)

Figure 24. Attachment service class diagram

Attachments and thumbnails are stored using the [Content Store](#content-store), which can run in embedded or standalone mode, depending on the configuration property `mgmtp.a12.dataservices.attachments.extension.embedded.enabled`.

When creating an attachment via `AttachmentService#createAttachment`, the provided `documentModelName` is used to:

* check `ModelRead` permission
* determine if the attachment should be stored as public or private content, based on the configuration property `mgmtp.a12.dataservices.attachments.type.publicType.models`

#### Relationship API

With the Relationship API, you can establish and maintain relationship links between documents. Relationships are defined between exactly two documents: the source and the target. Optionally, a relationship can include additional information in a link document.

![relationship api](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/uml/relationship_api.svg)

Figure 25. Relationship Link API class diagram

The `RelationshipLinkService` provides functionality to create, load, update, and delete relationships between documents, including the associated link document.

A `LinkDescriptor` specifies the link to be created or updated.

Links are identified by their link ID for operations such as loading or deleting.

There are two methods to change an existing link:

* `update`:

  + Creates a new link document and assigns it to the link
  + Deletes the old link document
  + Does not change the link itself
* `relink`:

  + Creates a new link using the provided `LinkDescriptor`
  + Deletes the old link after un-assigning its link document
  + Does not change the link document

#### Utility classes

##### Document Utility

![document utility class diagram](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/uml/document_utility_class_diagram.svg)

Figure 26. Document Utility class diagram

#### Exceptions and its Mapping

Data Services defines a set of core exceptions (see [Figure 27](#exceptionclassdiagram)) to ensure proper logging and accurate HTTP status code mapping when exceptions propagate to the HTTP layer.

All major exception types are centrally handled by `com.mgmtp.a12.dataservices.server.rest.exception.mapping.DataServicesExceptionsHandler`, which maps them to appropriate responses.

![Security](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/uml/exceptions.svg)

Figure 27. Exceptions class diagram

### Extending the Server

This section contains guidelines how to extend the Data Services server.

#### Data Services BOMs

In your external project, you should apply Data Services BOM to align dependencies with the Data Services, by specifying:

Gradle example

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` 	api enforcedPlatform("com.mgmtp.a12.dataservices:dataservices-parent:${DS_VERSION}") ``` |
```

Then you can omit version for Data Services artifacts like:

Gradle example alternative

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` 	implementation 'com.mgmtp.a12.dataservices:dataservices-server-app' 	api 'com.mgmtp.a12.dataservices.common:dataservices-common-lib' 	api 'com.mgmtp.a12.dataservices.common:dataservices-common-api' ``` |
```

#### Events

Data Services are publishing events which can be used by client projects to hook in custom code before or after operations, or during the server initialization.
All those events are annotated with the `@EventDocumentation` annotation. Additionally, we offer the `com.mgmtp.a12.dataservices.common.events.CommonDataServicesEventListener` annotation which may be used instead of `org.springframework.context.event.EventListener`, enabling to exclusively track events published within the same context.

There are several examples in `examples-extending-server`:

* `com.mgmtp.a12.dataservices.examples.relationship.RelationshipLinkListener`
* `com.mgmtp.a12.dataservices.examples.document.model.migration.DocumentModelMigration`
* `com.mgmtp.a12.dataservices.examples.document.extensions.ContactModelValidationExtension`
* `com.mgmtp.a12.dataservices.examples.document.encryption.EncryptionListeners`
* `com.mgmtp.a12.dataservices.examples.attachment.encryption.AttachmentEncryptionSyncListeners`
* `com.mgmtp.a12.dataservices.examples.attachment.encryption.AttachmentEncryptionAsyncListeners`
* `com.mgmtp.a12.examples.attachment.thumbnails.CustomThumbnailListener`
* `com.mgmtp.a12.examples.attachment.mime.CustomZipTypeListener`

###### Data Services Events

###### CddsAfterLoadByQueryEvent

Triggered from the `LIST_CDDS` operation once the CDDs are completely loaded.

Modification of the payload will only be displayed to the user. No changes will be persisted.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.document.events.CddsAfterLoadByQueryEvent` |

###### QueryAfterPostProcessPhaseEvent

The QueryAfterPostProcessPhaseEvent is published after the query has been executed and post-processed. Results are available in the QueryPage and can be modified by the event listeners.
This event should be used if the query results need to be modified in all system not just in the JSON-RPC operation like QueryAfterOperationEvent which is only used in the JSON-RPC operation.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.query.events.QueryAfterPostProcessPhaseEvent` |

###### QueryBeforeExecutionPhaseEvent

The com.mgmtp.a12.dataservices.query.QueryService publishes this event to allow bypassing a call to the
com.mgmtp.a12.dataservices.query.QueryRepository. This enables listeners to provide alternative means to resolve the query.

Event listeners must provide results in their implementation because com.mgmtp.a12.dataservices.query.QueryRepository is never called.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.query.events.QueryBeforeExecutionPhaseEvent` |

###### QueryAfterOperationEvent

Published after a query is evaluated and before the results are returned to the caller.
This event is sent from the RPC layer; it is not published when com.mgmtp.a12.dataservices.query.QueryService or
com.mgmtp.a12.dataservices.query.QueryRepository are called directly.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.query.operation.events.QueryAfterOperationEvent` |

###### QueryBeforeOperationEvent

Allows changes to the query before it is processed by QueryService.
This event is triggered with every QUERY operation. It is not triggered if
QueryService or QueryRepository are called directly.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.query.operation.events.QueryBeforeOperationEvent` |

###### AttachmentBeforeCreateEvent

Triggered before the attachment is created.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.attachment.events.AttachmentBeforeCreateEvent` |

###### AttachmentThumbnailBeforeSaveEvent

Triggered before the attachment thumbnail is saved.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.attachment.events.AttachmentThumbnailBeforeSaveEvent` |

###### AttachmentAfterCreateEvent

Triggered after the attachment is created.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.attachment.events.AttachmentAfterCreateEvent` |

###### AttachmentBeforeDeleteEvent

Published before an attachment is deleted. Mutating the AttachmentHeader is not supported at this stage.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.attachment.events.AttachmentBeforeDeleteEvent` |

###### AttachmentAfterDeleteEvent

Triggered after the attachment is deleted.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.attachment.events.AttachmentAfterDeleteEvent` |

###### AttachmentThumbnailAfterSaveEvent

Triggered after the attachment thumbnail is saved.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.attachment.events.AttachmentThumbnailAfterSaveEvent` |

###### ContentTypeDetectedEvent

Event published after a content type has been successfully detected.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.common.events.ContentTypeDetectedEvent` |

###### DocumentBeforeIndexEvent

The event is published before the document is indexed.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.document.events.DocumentBeforeIndexEvent` |

###### DocumentBeforeUpdateEvent

|  |  |
| --- | --- |
|  | Any data modifications are persisted with the updated document.To update updatedDocument and persistedDocument, you must reassign the updated document because DocumentV2 is immutable. |

The event is published before computation and validation of the updated document.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.document.events.DocumentBeforeUpdateEvent` |
| triggers | `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentService#update`, `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentService#update`, `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentService#update`, `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentService#update` |

###### DocumentAfterDeleteEvent

The event is published after document deletion but before the transaction is committed.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.document.events.DocumentAfterDeleteEvent` |
| triggers | `com.mgmtp.a12.dataservices.document.operation.internal.DeleteDocumentOperation#rpc`, `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentService#delete` |

###### DocumentAfterControllerLoadEvent

The event is published after the document is loaded over the REST API.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.document.events.DocumentAfterControllerLoadEvent` |

###### DocumentBeforeRepositorySaveEvent

The event is published before the document is stored into the repository.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.document.events.DocumentBeforeRepositorySaveEvent` |
| triggers | `com.mgmtp.a12.dataservices.document.operation.internal.ModifyDocumentOperation#rpc`, `com.mgmtp.a12.dataservices.document.operation.internal.PartialModifyDocumentOperation#rpc`, `com.mgmtp.a12.dataservices.document.operation.internal.AddDocumentOperation#rpc`, `com.mgmtp.a12.dataservices.document.operation.internal.CopyDocumentOperation#rpc`, `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentRepository#create`, `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentRepository#update` |

###### DocumentAfterUpdateEvent

|  |  |
| --- | --- |
|  | No data modifications are persisted with the updated document. |

The event is published after a document is updated, but before the transaction is committed.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.document.events.DocumentAfterUpdateEvent` |
| triggers | `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentService#update`, `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentService#update`, `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentService#update`, `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentService#update` |

###### DocumentBeforeDeleteEvent

|  |  |
| --- | --- |
|  | To update persistedDocument, you must reassign the updated document because DocumentV2 is immutable. |

The event is published before the document is deleted.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.document.events.DocumentBeforeDeleteEvent` |
| triggers | `com.mgmtp.a12.dataservices.document.operation.internal.DeleteDocumentOperation#rpc`, `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentService#delete` |
| listeners | `com.mgmtp.a12.dataservices.relationship.internal.DocumentDeletionListener#onDeleteDocument` order: 2147483647 |

###### DocumentAfterRepositoryLoadEvent

Triggered after the document is loaded from repository.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.document.events.DocumentAfterRepositoryLoadEvent` |
| triggers | `com.mgmtp.a12.dataservices.document.operation.internal.ModifyDocumentOperation#rpc`, `com.mgmtp.a12.dataservices.document.operation.internal.PartialModifyDocumentOperation#rpc`, `com.mgmtp.a12.dataservices.document.operation.internal.DeleteDocumentOperation#rpc`, `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentRepository#findByDocumentReference`, `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentRepository#findDocumentsByDocRefs` |

###### DocumentBeforeCreateEvent

|  |  |
| --- | --- |
|  | Any data modifications are persisted with the document.To update createdDocument, you must reassign the updated document because DocumentV2 is immutable. |

The event is published before validation and computation of a newly created document.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.document.events.DocumentBeforeCreateEvent` |
| triggers | `com.mgmtp.a12.dataservices.document.operation.internal.AddDocumentOperation#rpc`, `com.mgmtp.a12.dataservices.document.operation.internal.CopyDocumentOperation#rpc`, `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentService#create`, `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentService#create` |

###### DocumentAfterLoadEvent

|  |  |
| --- | --- |
|  | No data modifications are persisted.To update the document, you must reassign the updated instance because DocumentV2 is immutable. |

The event is published after the document is loaded.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.document.events.DocumentAfterLoadEvent` |
| triggers | `com.mgmtp.a12.dataservices.document.operation.internal.GetDocumentOperation#rpc`, `com.mgmtp.a12.dataservices.document.operation.internal.CopyDocumentOperation#rpc`, `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentService#load` |

###### DocumentAfterCreateEvent

|  |  |
| --- | --- |
|  | No data modifications are persisted with the document. |

The event is published after a document is created, but before the transaction is committed.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.document.events.DocumentAfterCreateEvent` |
| triggers | `com.mgmtp.a12.dataservices.document.operation.internal.AddDocumentOperation#rpc`, `com.mgmtp.a12.dataservices.document.operation.internal.CopyDocumentOperation#rpc`, `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentService#create`, `com.mgmtp.a12.dataservices.document.persistence.internal.DefaultDocumentService#create` |

###### DataServicesCustomInitializationEvent

The event is published after all models are imported. It can be used to run reindexing just before the JSON-RPC initialization is called.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.initialization.events.DataServicesCustomInitializationEvent` |
| triggers | `com.mgmtp.a12.dataservices.initialization.internal.DataServicesInitializationService#runInitialization` |

###### DataServicesInitializationFinishedEvent

The event is published when the initialization is completed, and when all models and documents are loaded and indexed.
It also indicates that the Data Services server is ready to be used.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.initialization.events.DataServicesInitializationFinishedEvent` |
| listeners | `com.mgmtp.a12.dataservices.utils.internal.CachePreloader#onApplicationEvent`, `com.mgmtp.a12.dataservices.server.util.KernelCachesPreloader#listenOnServicesInitializationFinished`, `com.mgmtp.a12.dataservices.server.actuator.internal.InitializationFinishedHealthIndicator#onApplicationEvent` order: 2147483647 |

###### DataServicesDocumentModelCachesPreloadedEvent

Event indicating that document model caches have been preloaded.
Consumers may use this to warm dependent caches or start operations that rely on preloaded model metadata.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.initialization.events.DataServicesDocumentModelCachesPreloadedEvent` |
| triggers | `com.mgmtp.a12.dataservices.server.util.KernelCachesPreloader#listenOnServicesInitializationFinished` |

###### GetDocumentAfterEvent

The event is published after the `GET_DOCUMENT` operation is executed.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.document.operation.events.GetDocumentAfterEvent` |
| triggers | `com.mgmtp.a12.dataservices.document.operation.internal.GetDocumentOperation#rpc` |

###### GetDocumentBeforeEvent

The event is published before the `GET_DOCUMENT` operation is executed.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.document.operation.events.GetDocumentBeforeEvent` |
| triggers | `com.mgmtp.a12.dataservices.document.operation.internal.GetDocumentOperation#rpc` |

###### ModelAfterRepositoryLoadEvent

The event is published after the model is loaded from the repository.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.model.events.ModelAfterRepositoryLoadEvent` |

###### ModelBeforeDeleteEvent

The event is published before the model is deleted.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.model.events.ModelBeforeDeleteEvent` |

###### ModelsAfterLoadEvent

The event is published after the models are loaded.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.model.events.ModelsAfterLoadEvent` |

###### ModelAfterUpdateEvent

The event is published after the model is updated.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.model.events.ModelAfterUpdateEvent` |

###### ModelBeforeRepositorySaveEvent

The event is published before the model is saved to the repository.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.model.events.ModelBeforeRepositorySaveEvent` |

###### ModelBeforeUpdateEvent

The event is published before the model is updated.
It is composed of the persisted header, the persisted model content, and the updated model content.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.model.events.ModelBeforeUpdateEvent` |

###### ModelAfterCreateEvent

The event is published after the model is created.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.model.events.ModelAfterCreateEvent` |

###### ModelAfterDeleteEvent

The event is published after the model is deleted.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.model.events.ModelAfterDeleteEvent` |

###### ModelAfterLoadEvent

The event is published after the model is loaded.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.model.events.ModelAfterLoadEvent` |
| triggers | `com.mgmtp.a12.dataservices.model.persistence.internal.AbstractModelLoader#loadModel` |

###### ModelsAfterImportEvent

The event is published after model import, so that custom code can be executed.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.model.events.ModelsAfterImportEvent` |
| triggers | `com.mgmtp.a12.dataservices.model.bulkload.ModelBulkImporter#doImport` |

###### ModelBeforeCreateEvent

The event is published before the model is created.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.model.events.ModelBeforeCreateEvent` |

###### RelationshipLinkAfterUpdateEvent

The event is published after the link changes are persisted.

RelationshipLinkAfterUpdateEvent represents the update of the link document.
Ome RelationshipLinkAfterUpdateEvent instance could be shared between multiple instances of event consumers, therefore it must not be mutable.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.relationship.events.RelationshipLinkAfterUpdateEvent` |

###### RelationshipLinkAfterDeleteEvent

The event is published after the link is successfully deleted.

The RelationshipLinkAfterDeleteEvent represents the deletion of the link for a relationship model
between the entities described in the linkDescriptor of the RelationshipLinkSpec.
One RelationshipLinkAfterDeleteEvent instance could be shared between multiple instances of event consumers, therefore it must not be mutable.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.relationship.events.RelationshipLinkAfterDeleteEvent` |
| listeners | `com.mgmtp.a12.dataservices.relationship.internal.RelationshipLinkValidationListener#linkDeletedEventListener` order: 100 |

###### RelationshipLinkAfterCreateEvent

The event is published after the link is successfully created.

RelationshipLinkAfterCreateEvent represents the creation of the new link for Relationship model
between the entities described in the linkDescriptor of the RelationshipLinkSpec.
One RelationshipLinkAfterCreateEvent instance could be shared between multiple instances of event consumers,
therefore it must not be mutable.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.relationship.events.RelationshipLinkAfterCreateEvent` |
| listeners | `com.mgmtp.a12.dataservices.relationship.internal.RelationshipLinkValidationListener#linkAddedEventListener` order: 100 |

###### Listeners for Other than Data Services Events

###### ContextRefreshedEvent

|  |  |
| --- | --- |
| event | `org.springframework.context.event.ContextRefreshedEvent` |

---

* `com.mgmtp.a12.dataservices.initialization.DataServicesInitializationListener#onApplicationInitialization`

  |  |  |
  | --- | --- |
  | order | 100 |
  | description | Handles application initialization on ContextRefreshedEvent. Ensures this listener runs before UAA re-enables security bypass (ordered with Order 100). |

---

* `com.mgmtp.a12.dataservices.rpc.internal.JsonRpcOperationDispatcher#handleContextRefresh`

  |  |  |
  | --- | --- |
  | order | -100 |
  | description | Order -100 was chosen to be executed before the initialization listener (DataServicesCoreInitializationListener), which has 100 as its Order value. To execute your listener between this and the initialization, choose a value from -99 to 99. |

---

* `com.mgmtp.a12.contentstore.initialization.ContentStoreInitializationListener#onApplicationInitialization`

  |  |  |
  | --- | --- |
  | order | 101 |
  | description | UAA also listens to the ContextRefreshedEvent and disables security bypass in the listener with order HIGHEST\_PRECEDENCE. Therefore, we need to make sure that our listeners will be executed before UAA disables security bypass → @Order(101) And if someone wants their ContextRefreshedEvent listener to be executed before this method, for example, they need to set an Order lower than 100. Be aware that the listener DataServicesInitializationListener#onApplicationInitialization, which listens also to the ContextRefreshedEvent, is executed with @Order(100). |

---

###### AbstractModelEvent

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.dataservices.model.events.AbstractModelEvent` |

---

* `com.mgmtp.a12.dataservices.model.document.internal.ExpandIncludesListener#expandIncludesForDocumentModel`

  |  |  |
  | --- | --- |
  | order | 0 |

---

#### Application Custom Metadata

If you want to add your custom metadata to the document, you must extend the document metadata model.
It’s bundled in the application and is located at `classpath:com/mgmtp/a12/platform/model/document-meta-data.json`.
To provide your own, replace this resource by the extended one.
All existing fields from the existing one must be present also in the new one.

As soon as the metadata model is extended and expect new fields,
you can add metadata to the document in the [`DocumentBeforeUpdateEvent`](#event_com.mgmtp.a12.dataservices.document.events.documentbeforeupdateevent) and [`DocumentBeforeCreateEvent`](#event_com.mgmtp.a12.dataservices.document.events.documentbeforecreateevent).
Document in this event already contains the code metadata like Document Reference,
Model Name, timestamps of creation or update and related users.
You can add extra fields described by your model to this document.

#### Custom Operations

There is also the possibility to extend operations or create custom ones.
For more details please see the chapter on [JSON-RPC operations](#json-rpc-processing-operation).

|  |  |
| --- | --- |
|  | Refer to the [DS examples section](#data-services-examples) for an example of a custom operation. |

##### Custom Exceptions and its Mapping

If you want to implement your custom exception mapping, follow the common processing in Spring MVC.

|  |  |
| --- | --- |
|  | Refer to the [DS examples section](#data-services-examples) for an example of custom exceptions. |

In the [Figure 27](#exceptionclassdiagram) you can see exception inheritance.

#### Custom Types and Conditions

There is also the possibility to add custom types and conditions for validating documents.

To use a custom condition, just implement the `com.mgmtp.a12.kernel.md.rt.api.ICustomConditionFactory` interface and provide this implementation as a Spring bean.
The name of the condition must be returned by the `#getSupportedConditionNames()` method.
Then you can refer to this condition in validations by that name.

To use a custom type, just implement the `com.mgmtp.a12.kernel.core.customfieldtype.ICustomFieldTypeFactory` interface and provide this implementation as a Spring bean.
The name of the type must be returned by the `#getSupportedTypeNames()` method.
Then you can use a type of that name in your models.

For more details, please refer to [custom type section](https://geta12.com/docs/kernel/kernel-documentation-dev/index.html#_custom_field_type) and [custom conditon section](https://geta12.com/docs/kernel/kernel-documentation-dev/index.html#_custom_condition) in A12 Kernel documentation.

|  |  |
| --- | --- |
|  | Refer to the [DS examples section](#data-services-examples) for an example of custom types and conditions. |

#### Attachment Clean-up

The `CleanUpDirtyAttachmentsJob` can be extended by adding a bean of type `com.mgmtp.a12.dataservices.attachment.IDirtyAttachmentCleanupCondition` which could prevent the deletion of the attachment depending on your condition.

If the bean is not present, the attachment is always deleted if it applies to the rules for deletion.

|  |  |
| --- | --- |
|  | Refer to the [DS examples section](#data-services-examples) for an example of a custom cleanup condition. |

If you add this bean, the attachment is deleted only if it applies to the rules for the deletion and the `IDirtyAttachmentCleanupCondition.canBeDeleted` method implementation returns `true` for the attachment header.

If `IDirtyAttachmentCleanupCondition.canBeDeleted` returns `false` for an attachment header, it means you decide to keep the corresponding attachment.

|  |  |
| --- | --- |
|  | In this case Data Services will not track this attachment anymore, which means that it is your responsibility to take care of the remaining life-cycle of this attachment. |

#### Job Scheduling

Data Services uses [Quartz scheduler](https://www.quartz-scheduler.org/) to trigger scheduled jobs.

By default, it is configured to support clustering and to use JDBC store.

```
spring.quartz.job-store-type=jdbc
spring.quartz.properties.org.quartz.jobStore.isClustered=true
spring.quartz.properties.org.quartz.scheduler.instanceId=AUTO
```

##### Provided Jobs

The following jobs are preconfigured in the Data Services vanilla application:

1. Scheduler ID: cleanUpRequestIdJob:

   * Schedule: `${mgmtp.a12.dataservices.jobs.requests.cleanUpRequestId.schedule}`
   * Description: Job to clean up table REQUEST\_ID by deleting entries which are older than the time configured in `mgmtp.a12.dataservices.jobs.requests.cleanupRequestId.expireHours`.
     See CleanUpRequestIdJob.
2. Scheduler ID: defragmentRanksJob:

   * Schedule: `${mgmtp.a12.dataservices.link.rankRecalculateScheduler.defragmentSchedule}`
   * Description: Job to defragment ranks for relationship links.
3. Scheduler ID: cleanUpDirtyAttachmentsJob:

   * Schedule: `${mgmtp.a12.dataservices.jobs.attachments.cleanUpDirtyAttachments.schedule}`
   * Description: Job to clean up files in the attachment storage location which are not referenced by any GenericReference.
     See CleanUpDirtyAttachmentsJob.
4. Scheduler ID: cleanUpStaleAttachmentsJob:

   * Schedule: `${mgmtp.a12.dataservices.jobs.attachments.cleanUpStaleAttachments.schedule}`
   * Description: Job to clean up files in the attachment storage location which were never referenced by any GenericReference
     and which are older than the time configured in `mgmtp.a12.dataservices.jobs.attachments.temporary.expireHours`.
     See CleanUpStaleAttachmentsJob.

##### Custom Jobs

You can schedule your own job by creating a bean of type `org.quartz.Trigger` and providing a `org.quartz.Job` implementation which will be executed, for example:

Example Job implementation and configuration

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 ``` | ``` public class MyJob implements Job {  	@Override 	public void execute(JobExecutionContext context) throws JobExecutionException { 		JobDataMap mergedJobDataMap = context.getMergedJobDataMap(); 		LOGGER.info("My job triggered with params: {}, {}", mergedJobDataMap.getString("myCustomStringParameter"), mergedJobDataMap.getInt("myCustomIntParameter")); 		doSomething(mergedJobDataMap.getString("myCustomStringParameter"), mergedJobDataMap.getInt("myCustomIntParameter")); 	}  	public void doSomething(String myCustomStringParameter, int myCustomIntParameter) { 		... 	} }  @Configuraion public class JobConfig {  	@Bean 	public JobDetail myJobDetail() { 		return JobBuilder.newJob() 			.ofType(MyJob.class) 			.withIdentity("myJob", "myJobGroup") 			.withDescription("My example job.") 			.storeDurably() 			.build(); 	}  	@Bean 	public Trigger myTrigger(JobDetail myJobDetail){ 		return TriggerBuilder.newTrigger() 			.forJob(myJobDetail) 			.withIdentity("myTriggerId", "myJobGroup") 			.withDescription("My trigger description.") 			.withSchedule(CronScheduleBuilder.cronSchedule("0 */5 * * ?")) 			.usingJobData("myCustomStringParameter", "Param value") 			.usingJobData("myCustomIntParameter", 6) 			.startNow() 			.build(); 	} } ``` |
```

#### ExternalEnumerationLoader

To create your own external enumeration loader you have to implement the `ExternalEnumerationLoader` interface. You have to annotate the class as a `@Component` and implement the `isModelSupported(String)` and `loadEnumeration(Document)` methods. The API to load all external enumerations for a model can be found [here](#rest_external_enumeration_rest_api).

|  |  |
| --- | --- |
|  | Refer to the [DS examples section](#data-services-examples) for an example of a custom external enumeration loader. |

##### Document Serialization and Deserialization in DataServices

DataServices leverages Kernel library for document serialization and deserialization. The process is highly
configurable though extension points, allowing you to tailor the serialization and deserialization behavior to meet
specific requirements.

* `DocumentSerializationConfig`: This extension point allows you to customize how documents are serialized.
* `DocumentDeserializationConfig`: This extension point enables customization of the document deserialization process.

By creating new Spring beans for these two classes, you can ensure that DataServices handles document serialization and deserialization in a manner that aligns with your application’s requirements, providing both flexibility and control over your data processing workflows.

|  |  |
| --- | --- |
|  | Refer to the [DS examples section](#data-services-examples) for an example of configuring Kernel document serialization and deserialization. |

## Data Services Security

### Data Services Authentication

Authentication is completely handled by UAA, refer to [their documentation](https://geta12.com/docs/uaa/uaa-documentation-src/index.html#authentication) for more information.

### Data Services Authorization

|  |  |
| --- | --- |
|  | Data Services provide authorizationDefinition file via `mgmtp.a12.uaa.authorization.authorizationDefinition` property. Do not replace it, otherwise you disable DS authorization completely, meaning that there is no guarantee that your code will work as expected. Instead, use `mgmtp.a12.uaa.authorization.childAuthorizationDefinitions` to introduce your own authorization rules on top of the already existing ones. |

|  |  |
| --- | --- |
|  | Refer to the [DS examples section](#data-services-examples) for an example of custom authorization. |

Authorization is handled by UAA. For general UAA concepts and configuration, refer to [their documentation](https://geta12.com/docs/uaa/uaa-documentation-src/index.html#authorization).
In this chapter we will focus on Data Services related UAA usage.

Access to models is governed by roles assigned to each model. To read a model like `Product`, a user must possess at least one role with the `MODEL_READ` permission, and that role must be listed among the model’s allowed roles. This mechanism ensures model access is restricted by a single permission.

Document access is derived from model permissions. For example, to create a document for the `Product` model, a user must:
. Have at least one role with the `MODEL_READ` permission, and that role must be listed in the `Product` model’s roles.
. Possess the `DOCUMENT_CREATE` permission in any of their roles.

Authorization is implemented via UAA.

Authorization rules reside in `uaa/authorizationDefinition.json`, using policies defined with SPEL expressions. Permissions reference these policies to validate access to specific scopes.

You may define additional permissions and policies as needed, organizing them according to your requirements. Permissions can be defined for the following scopes:

|  |  |
| --- | --- |
| Model Create | Check that the user has access right to create models. com.mgmtp.a12.model.header.Header is referenced as #resource. |
| Model Update | Check that the user has access right to update provided model. com.mgmtp.a12.model.header.Header is referenced as #resource. |
| Model Read | Check that the user has access right to read provided model. com.mgmtp.a12.model.header.Header is referenced as #resource. |
| Model Delete | Check that the user has access right to delete provided model. com.mgmtp.a12.model.header.Header is referenced as #resource. |
| Document Create | Check that the user has access right to create documents. com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2 is referenced as #resource. |
| Document Update | Check that the user has access right to update documents. com.mgmtp.a12.dataservices.authorization.DocumentUpdateResource is referenced as #resource. |
| Document Partial Update | Check that the user has access right to partially update documents. com.mgmtp.a12.dataservices.authorization.DocumentUpdateResource is referenced as #resource. |
| Document Delete | Check that the user has access right to delete documents. com.mgmtp.a12.dataservices.document.DataServicesDocument is referenced as #resource. |
| Document Multi Delete | Check that user has access right to multi delete documents. |
| Manage Caches | Check that the user has a role which has access right to manage caches. |
| Endpoint | You can control endpoint security inside this scope. Each endpoint is defined by its class name/method name. Returns always true. |
| RelativePath | You can control actuator security by a relative URL. Default is: Allow all. |
| Attachment Upload | You can define permission rules for uploading a file. com.mgmtp.a12.dataservices.attachment.AttachmentHeader is referenced as #resource. |
| Export List CDD | You can define permission rules for export document. |
| Query | You can define permission rules for executing queries. |

#### Authorization Scopes Used in the Code

| Method name and arguments | Scope name | Description |
| --- | --- | --- |
| `ModelsV2ControllerImpl.loadModel`  modelId  *java.lang.String* | *code*  `Model Read` | Check that the user has access right to read provided model. com.mgmtp.a12.model.header.Header is referenced as #resource. |
| `ModelsV2ControllerImpl.updateModel`  modelContent  *java.lang.String* | *code*  `Model Update` | Check that the user has access right to update provided model. com.mgmtp.a12.model.header.Header is referenced as #resource. |
| `ModelsV2ControllerImpl.createModel`  modelContent  *java.io.Reader* | *code*  `Model Create` | Check that the user has access right to create models. com.mgmtp.a12.model.header.Header is referenced as #resource. |
| `ModelsV2ControllerImpl.deleteModel`  modelId  *java.lang.String* | *code*  `Model Delete` | Check that the user has access right to delete provided model. com.mgmtp.a12.model.header.Header is referenced as #resource. |
| `ModelsV2ControllerImpl.generateValidationCode`  modelName  *java.lang.String* | *code*  `Model Read` | Check that the user has access right to read provided model. com.mgmtp.a12.model.header.Header is referenced as #resource. |
| `ModelsV2ControllerImpl.importModelBulk`  modelBulk  *java.io.InputStream* | *code*  `Model Update` | Check that the user has access right to update provided model. com.mgmtp.a12.model.header.Header is referenced as #resource. |
| *code*  `Model Create` | Check that the user has access right to create models. com.mgmtp.a12.model.header.Header is referenced as #resource. |
| `AttachmentV2ControllerImpl.upload`  content  *org.springframework.core.io.InputStreamResource*  filename  *java.lang.String*  documentModelName  *java.lang.String*  pathToField  *java.lang.String*  annotations  *java.lang.String[]* | *code*  `Model Read` | Check that the user has access right to read provided model. com.mgmtp.a12.model.header.Header is referenced as #resource. |
| *code*  `Attachment Upload` | You can define permission rules for uploading a file. com.mgmtp.a12.dataservices.attachment.AttachmentHeader is referenced as #resource. |
| `RelationshipControllerImpl.getModelGraph` | *code*  `Model Read` | Check that the user has access right to read provided model. com.mgmtp.a12.model.header.Header is referenced as #resource. |
| `ExternalEnumerationControllerImpl.loadExternalEnumerationForModel`  modelName  *java.lang.String* | *code*  `Model Read` | Check that the user has access right to read provided model. com.mgmtp.a12.model.header.Header is referenced as #resource. |
| *code*  `Query` | You can define permission rules for executing queries. |

#### Model Authorization

The `Model Read` scope is enforced for all Data Services APIs. Whenever a model is loaded for operations such as deserialization or validation, access is securely checked against this scope.

The `QUERY` operation supports heterogeneous models, but user permissions may restrict visibility of certain subtypes.

Access to subtypes is also governed by the `Model Read` scope. The `GET /modelgraph` endpoint returns all document and relationship models visible to the current user, ensuring that subsequent operations respect these visibility constraints.

Due to these requirements, not all security logic can be delegated to other scopes.

#### Role-less Based Authorization

Data Services introduces the configuration key `mgmtp.a12.dataservices.authorization.roleBased.enabled`, which defaults to `true`. This setting controls authorization for the operations: `MODEL_CREATE`, `MODEL_UPDATE`, `MODEL_READ`, and `MODEL_DELETE`.

* If set to `true`, model header roles are required and compared against the user’s roles for access.
* If set to `false`, authorization for these operations is disabled.

Clients can extend model authorization by specifying custom rules using the property:
`mgmtp.a12.uaa.authorization.child-authorization-definitions=classpath:additionalAuthorizationDefinition.json`.

### Support Only HTTP/1 Protocol

By default, DS is supporting both HTTP/2 and HTTP/1 protocols, therefore if project team want to enable supporting for HTTP1 only please use DS new profile `dataservices-http1-only` and `contentstore-http1-only` for supporting application server HTTP/1 protocol only. In the `examples` DS introduce `dataservices-example-http1-env` and `contentstore-example-http1-env` group profile to start up server with HTTP/1 protocol supporting only.

### Log Injection

We discovered that users could control single lines of log by crafting special requests with Unicode characters for line breaks. For example, attackers could inject a new line of log by sending a request like this:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` {     "jsonrpc": "2.0",     "method": "ADD_DOCUMENT",     "id": "AddComputedDocument",     "params": {         "document": {             "BusinessPartnerRoot": {                 "PersonalData[] - please check\n\r2026-06-26 06:33:33,666 [#{7*7}][%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36}][This is a injected log entry #{7*7}] - user controlled log entry #{7*7} T(java.lang.System).getenv()[0]\n\r2026-06-26 06:33:33,666 [foobar][WARN ][error when parsing RPC request] - error in ": {       "FirstName": "firstname",       "LastName": "lastname",       "Email": "mail@mail.com"     }             }         },         "documentModelName": "BusinessPartner",         "locale": "en"     } } ``` |
```

The result would be in the log:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` 2026-06-26 06:33:33,666 [foobar][WARN ][error when parsing RPC request] - error in [1]', the corresponding entity was not found in the corresponding document model. [ERROR,L0,s0,e0], For the entity instance '/BusinessPartnerRoot[1]/PersonalData[] - please check 2026-06-26 06:33:33,666 [#{7*7}][%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36}][This is a injected log entry #{7*7}] - user controlled log entry #{7*7} T(java.lang.System).getenv()[0] ``` |
```

This exposes a potential risk when subsequent monitoring systems use automatic rules based on log entries, such as blocking an IP address or a user. For manual log reviews, this would likely only cause confusion.

To prevent this attach, configure your logging implementation to escape special characters before they are included in log entries. This includes characters such as newlines, carriage returns, and delimiters.

## Data Services Artifacts

Data Services deliver several artifacts to support different use cases.

### Runnable Artifacts

The DS vanilla Spring Boot applications can be found in the artifactory under the following IDs:

#### Jar Application

|  |  |
| --- | --- |
|  | Artifact does not contain any additional dependencies or features. |

|  |  |
| --- | --- |
| **Group ID** | com.mgmtp.a12.dataservices |
| **Artifact ID** | dataservices-server-app |

The artifact is also available with fatjar, sources and javadoc classifiers.

The other three artifacts that Data Services deliver are maintenance tools.

#### Relationship Migration Tool in Typescript

The relationship model migration tool is a TS tool that should be used to migrate relationship models to the newest version.

|  |  |
| --- | --- |
| **Group ID** | com.mgmtp.a12.dataservices |
| **Artifact ID** | dataservices-relationship-model-migration |

|  |  |
| --- | --- |
|  | Migration is supported only from the last major version to the current major version. If you need to migrate older versions please migrate step by step. |

#### Data Services Client CLI

The Data Services command line tool is a jar file which uses a Java client to communicate with a running Data Services instance. Please use the `--help` option to learn more about the jar application.

|  |  |
| --- | --- |
| **Group ID** | com.mgmtp.a12.dataservices |
| **Artifact ID** | dataservices-client-cli |

The artifact is also available with fatjar, sources and javadoc classifiers.

#### DataServices Initialization App

Data Services provide an initialization jar application which can execute the initialization sequence of the Data Services server without starting any HTTP servlets.

This application does not take any parameters, only the `application.properties` which are identical to the `application.properties` of the server.

The application was created to support a clustered deployment where the initialization sequence (rebuilding index, migration of database, migration of data, upload of models) should happen only once and not during the actual server star-up.

This tool should make the maintenance of the Data Services deployments easier by splitting migration/configuration from the server initialization.

|  |  |
| --- | --- |
| **Group ID** | com.mgmtp.a12.dataservices |
| **Artifact ID** | dataservices-server-init-app |

The artifact is also available with fatjar, sources and javadoc classifiers.

### Data Services BOM

There is a way to build your own artifact. For this, we offer a BOM artifact.

When you build your custom artifact you can easily change the versions of main A12 libraries:

* a12.validation.version
* a12.dataservices.version

If you need a custom artifact, you need to extend from main Data Services BOM artifact:

|  |  |
| --- | --- |
| **Group ID** | com.mgmtp.a12.dataservices |
| **Artifact ID** | dataservices-parent |

then, you have to define the artifact packaging.

This is the recommended way how to extend DS because it allows the most flexibility while not enforcing any target extension (war, jar, fatjar,…​).

### ModelGraphGenerator

For customer projects that cannot use the Data Services server but need to generate the model graph, we provide a standalone jar artifact.
This artifact can be used to generate the model graph from the command line. It does not have any dependencies to Spring Boot or other server components.

The ModelGraphGenerator can be found in the artifactory under the following ID:

|  |  |
| --- | --- |
| **Group ID** | com.mgmtp.a12.dataservices |
| **Artifact ID** | dataservices-core-tooling |

For more information please see `ModelGraphGenerator` javadoc.

### Data Services Helm Charts

Data Services provide Helm charts to deploy Data Services on Kubernetes clusters.

The Helm charts can be found in the artifactory under the following ID:

|  |  |
| --- | --- |
| **Group ID** | com.mgmtp.a12.dataservices |
| **Chart ID** | a12-data-services |

Please note that helm version is different from Data Services version, current chart version is 7.4.2.

## HTTP API Documentation

The HTTP API of the Data Services server is reachable via the following endpoints:

|  |  |
| --- | --- |
|  | Parameters marked with  are mandatory and should not be omitted nor `null`. Other parameters (marked with ) can be bypassed or set to `null`. |

### Attachments

| Documentation | URL | Description |
| --- | --- | --- |
| [Attachments REST API V2](#rest_attachments_rest_api_v2) | #{@dataServicesCoreProperties.server.contextPath}/v2/attachment | This API provides the ability to create attachments V2 (potentially with thumbnails). |

### Documents

| Documentation | URL | Description |
| --- | --- | --- |
| [External Enumeration REST API](#rest_external_enumeration_rest_api) | #{@dataServicesCoreProperties.server.contextPath}/enum/ext | API to retrieve external enumerations for a model. |

### Models

| Documentation | URL | Description |
| --- | --- | --- |
| [Models REST API V2](#rest_models_rest_api_v2) | #{@dataServicesCoreProperties.server.contextPath}/v2/models | API to create, read, update and delete models. |

### Monitoring

| Documentation | URL | Description |
| --- | --- | --- |
| [Monitor Configuration Properties REST API](#rest_monitor_configuration_properties_rest_api) | #{@dataServicesCoreProperties.server.contextPath} | API to retrieve monitored configuration properties. |

### Query API

| Documentation | URL | Description |
| --- | --- | --- |
| [Query Aggregations REST API](#rest_query_aggregations_rest_api) | #{@dataServicesCoreProperties.server.contextPath}/aggregation | Endpoint to load aggregations. |

### Relationships

| Documentation | URL | Description |
| --- | --- | --- |
| [Relationship REST API](#rest_relationship_rest_api) | #{@dataServicesCoreProperties.server.contextPath}/ | Endpoint to receive a model graph. |

### Seed Data (Internal API): For testing and demo purposes only. Not intended for production use.

| Documentation | URL | Description |
| --- | --- | --- |
| [Internal Seed Data Import REST API](#rest_internal_seed_data_import_rest_api) | #{@dataServicesCoreProperties.server.contextPath}/internal/seed-data | This API provides the ability to import Seed Data |
| [Internal Seed Data Export REST API](#rest_internal_seed_data_export_rest_api) | #{@dataServicesCoreProperties.server.contextPath}/internal/seed-data | This API provides the ability to export Seed Data. |
| [Internal Seed Data Delete REST API](#rest_internal_seed_data_delete_rest_api) | #{@dataServicesCoreProperties.server.contextPath}/internal/seed-data | This API provides the ability to delete models, documents, relationship links, attachments. |

All URLs in the above documentation are relative. You need to prepend the context to the URL where your application is deployed.

### Common Request Headers

Commonly used headers in most requests:

| Key | Value |
| --- | --- |
| Authorization | UAABearer {token} |

#### Common Error Responses

Commonly appearing errors in most requests:

| Response Status | Description |
| --- | --- |
| 401 Unauthorized | Authorization exception, e.g. user not signed in. |
| 403 Forbidden | User does not have proper permissions for the operation. |
| 404 Not Found | *Resource* not found in database or *Endpoint* does not exist. |
| 405 Method Not Allowed | Using wrong method (e.g., POST instead of GET when calling */modelgraph* endpoint). |
| 406 Not Acceptable | *Accept* header might not be set properly (e.g., application/xml). |
| 415 Unsupported Media Type | *Content-Type* header might not be set properly (e.g., application/xml). |
| 500 Internal Server Error | Unknown server problem, probably bug. |

#### Attachments REST API V2

This API provides the ability to create attachments V2 (potentially with thumbnails).

List of Contents
:   * [Upload Attachment as Stream V2](#rest_upload_attachment_as_stream_v2)

##### Upload Attachment as Stream V2

|  |  |
| --- | --- |
| Name | Upload Attachment as Stream V2 |
| Description | Endpoint allowing the upload of attachments. Big and small thumbnails are generated if the attachment is of type: JPEG, PNG, BMP, WBMP, GIF or SVG. An attachment can also be of text type (e.g. JSON, XML, TXT). NOTE: SVG is only supported for Thumbnailator. Enabling `mgmtp.a12.dataservices.attachments.thumbnail.optimization.url.enabled` would return an empty url for SVG. |
| Method | POST |
| URL | #{@dataServicesCoreProperties.server.contextPath}/v2/attachment |
| Headers | Accept  application/json |
| Parameters | content  Attachment content.  filename  Desired filename of attachment.  documentModelName  Document model name of uploaded document.  pathToField  Not yet implemented, but it is mandatory parameter. Empty string could be used.  annotations  List of attachment annotations. |
| Authorization Scopes | * Model Read * Attachment Upload |
| Success response | 200 OK  Attachment has been uploaded. |

#### External Enumeration REST API

API to retrieve external enumerations for a model.
Java definition of /enum/ext which provides mappings between business specified document names and document ids. There can be only one mapping defined per
document model.

List of Contents
:   * [Get External Enumeration for Document Model](#rest_get_external_enumeration_for_document_model)

##### Get External Enumeration for Document Model

|  |  |
| --- | --- |
| Name | Get External Enumeration for Document Model |
| Description | Loads external enumeration per document model. The external enumeration has to be implemented as for document model via extension point. |
| Method | GET |
| URL | #{@dataServicesCoreProperties.server.contextPath}/enum/ext/{document-model-name} |
| Headers | Accept  application/json |
| Parameters | modelName  Queried Document Model to retrieve External Enumeration. |
| Authorization Scopes | * Model Read * Query |
| Success response | 200 OK  Loaded External Enumeration. |
| Error response | 412 Precondition Failed  Validation code could not be generated. |
| Notes | * HTTP response will have cache-related headers modified. For the cache information see NoCache its usage. |

#### Models REST API V2

API to create, read, update and delete models.
All below-mentioned endpoints work only with JSON, and they share context path `/v2/models`. All models that adhere to the
metadata definition can be persisted and served via following REST endpoints. No other models will be accepted.

All below-mentioned CRUD operations are extensible via [IModelRepository](#i-model-repository) concept.

List of Contents
:   * [Load Model](#rest_load_model)
    * [Update Model](#rest_update_model)
    * [Create Model](#rest_create_model)
    * [Delete Model](#rest_delete_model)
    * [Generate Validation Code](#rest_generate_validation_code)
    * [Import Models](#rest_import_models)

##### Load Model

| Name | Load Model |
| --- | --- |
| Method | GET |
| URL | #{@dataServicesCoreProperties.server.contextPath}/v2/models/{model-id} |
| Parameters | modelId  Required Model to load. |
| Authorization Scopes | * Model Read |
| Success response | 200 OK  The response contains a body with the persisted model. |

##### Update Model

| Name | Update Model |
| --- | --- |
| Method | PUT |
| URL | #{@dataServicesCoreProperties.server.contextPath}/v2/models, #{@dataServicesCoreProperties.server.contextPath}/v2/models/ |
| Parameters | modelContent  Content of the model to update. |
| Authorization Scopes | * Model Update |
| Success response | 200 OK  The response contains the persisted model. Please note that this model might be different to the model that was sent because of custom extensions which are able to change the model before saving. |
| Error response | 400 Bad Request  Model validation failed. Model is not acceptable → The payload of the request is not a valid A12 model. |
| Notes | * The roles annotation of the model is mandatory. Without a role definition the server will not be able to   persist the model. |

##### Create Model

| Name | Create Model |
| --- | --- |
| Method | POST |
| URL | #{@dataServicesCoreProperties.server.contextPath}/v2/models, #{@dataServicesCoreProperties.server.contextPath}/v2/models/ |
| Parameters | modelContent  Content of the model to create. |
| Authorization Scopes | * Model Create |
| Success response | 200 OK  The response contains the persisted model. Please note that this model might be different to the model that was send because of custom extensions which are able to change the model before saving. |
| Error response | 400 Bad Request  Model validation failed. Model is not acceptable → The payload of the request is not a valid A12 model.  409 Conflict  Model creating failure → Model might be already created. |
| Notes | * The roles annotation of the model is mandatory. Without a role definition the server will not be able to   persist the model. |

##### Delete Model

| Name | Delete Model |
| --- | --- |
| Method | DELETE |
| URL | #{@dataServicesCoreProperties.server.contextPath}/v2/models/{model-id} |
| Parameters | modelId  Required Model to delete. |
| Authorization Scopes | * Model Delete |
| Success response | 200 OK  If model was deleted or if model with `model-id` does not exist anymore. |
| Example | `Product` |

##### Generate Validation Code

| Name | Generate Validation Code |
| --- | --- |
| Method | GET |
| URL | #{@dataServicesCoreProperties.server.contextPath}/v2/models/{model-id}/validationCode |
| Parameters | modelName  The model to be validated. |
| Authorization Scopes | * Model Read |

##### Import Models

|  |  |
| --- | --- |
| Name | Import Models |
| Description | Endpoint allowing a bulk import of models to database. |
| Method | PUT |
| URL | #{@dataServicesCoreProperties.server.contextPath}/v2/models, #{@dataServicesCoreProperties.server.contextPath}/v2/models/ |
| Headers | Content-type  `application/octet-stream` |
| Parameters | modelBulk  Stream of zip of models. |
| Authorization Scopes | * Model Update * Model Create |
| Success response | 200 OK  The response contains list of the names of all created models. |
| Error response | 400 Bad Request::Model validation failed. Model is not acceptable → The payload of the request is not a valid A12 model. |

#### Monitor Configuration Properties REST API

API to retrieve monitored configuration properties.

List of Contents
:   * [Get Monitored Configuration Properties](#rest_get_monitored_configuration_properties)

##### Get Monitored Configuration Properties

|  |  |
| --- | --- |
| Name | Get Monitored Configuration Properties |
| Description | Retrieves monitored configuration properties and their current values. This endpoint exposes specific configuration properties that clients may need to know, returning the currently effective value for each property (either from configuration sources or the default value if not overridden). Please note this endpoint is public and does not require authentication. |
| Method | GET |
| URL | #{@dataServicesCoreProperties.server.contextPath}/monitored-properties |
| Parameters |  |
| Success response | 200 OK  The response contains a body with the map of monitoring properties. |

#### Query Aggregations REST API

Endpoint to load aggregations.

List of Contents
:   * [Load Aggregations](#rest_load_aggregations)

##### Load Aggregations

|  |  |
| --- | --- |
| Name | Load Aggregations |
| Description | Returns aggregated values as a 2-dim object array with the values of the group by columns first, and the aggregated values behind them. The number of returned rows is controlled by configuration.  Example:  ``` |  |  | | --- | --- | | ``` 1 2 3 4 5 ``` | ``` [   ["Household", 1, 50000.0],   ["Liability", 1, 1000000.0],   ["Travel", 3, 1350000.0] ] ``` | ``` |
| Method | POST |
| URL | #{@dataServicesCoreProperties.server.contextPath}/aggregation |
| Parameters | queryRoot  A query that contains aggregations. No links and no paging are allowed. |

#### Relationship REST API

Endpoint to receive a model graph.

List of Contents
:   * [Get Model Graph](#rest_get_model_graph)

##### Get Model Graph

|  |  |
| --- | --- |
| Name | Get Model Graph |
| Description | Get a model graph containing document models, CDMs, and relationship models. |
| Method | GET |
| URL | #{@dataServicesCoreProperties.server.contextPath}/modelgraph |
| Parameters |  |
| Authorization Scopes | * Model Read |
| Success response | 200 OK  The response contains the ModelGraphRoot object. |

#### Internal Seed Data Import REST API

This API provides the ability to import Seed Data

List of Contents
:   * [Import Seed Data as Stream](#rest_import_seed_data_as_stream)

##### Import Seed Data as Stream

|  |  |
| --- | --- |
| Name | Import Seed Data as Stream |
| Description | Endpoint allowing import seed data, encapsulated within tar compressed with gzip archive **Crucially, the directories and their contents within the archive must strictly adhere to a predefined processing order** to ensure correct data dependencies and integrity during import. Folder example:  * /data/meta/seed\_metadata.json * /data/models/Contract.json * /data/models/BusinessPartner.json * /data/models/ContractBusinessPartner.json * /data/attachments/e4csdw43-6a00-418a-a7d6-d9f5b7f82df2.jpg * /data/attachments/e4cbe2wa-2efd-418a-12ed-d9f5b7fd3wf0.cert * /data/documents/Contract/8ed0be43-bd0c-438c-a0de-c8e8712c83b1.json * /data/documents/BusinessPartner/8ed0b2eds-2csa-2wsa-asf2-c8e8712c83b1.json * /data/links/ContractBusinessPartner/8fd0b2eds-2csa-2wsa-asf2-c8e8712c83b2.json * /data/links/ContractBusinessPartner/8ad0b2eds-2csa-2wsa-asf2-c8e8712c83b3.json * /data/user/users.yaml  Importing seed data is specifically designed for empty databases. Attempting to import into a non-empty database may result in unexpected errors or data corruption. |
| Method | POST |
| URL | #{@dataServicesCoreProperties.server.contextPath}/internal/seed-data, #{@dataServicesCoreProperties.server.contextPath}/internal/seed-data/ |
| Parameters | content  the compressed archive of the seed data |
| Success response | 204 No Content  Import Seed Data successfully. |

#### Internal Seed Data Export REST API

This API provides the ability to export Seed Data.

List of Contents
:   * [Export Seed Data Content](#rest_export_seed_data_content)

##### Export Seed Data Content

|  |  |
| --- | --- |
| Name | Export Seed Data Content |
| Description | Endpoint allows downloading the compressed archive of the seed data, exported folder example:  * /data/meta/seed\_metadata.json * /data/models/Contract.json * /data/models/BusinessPartner.json * /data/models/ContractBusinessPartner.json * /data/attachments/e4csdw43-6a00-418a-a7d6-d9f5b7f82df2.jpg * /data/attachments/e4cbe2wa-2efd-418a-12ed-d9f5b7fd3wf0.cert * /data/documents/Contract/8ed0be43-bd0c-438c-a0de-c8e8712c83b1.json * /data/documents/BusinessPartner/8ed0b2eds-2csa-2wsa-asf2-c8e8712c83b1.json * /data/links/ContractBusinessPartner/8fd0b2eds-2csa-2wsa-asf2-c8e8712c83b2.json * /data/links/ContractBusinessPartner/8ad0b2eds-2csa-2wsa-asf2-c8e8712c83b3.json * /data/user/users.yaml |
| Method | GET |
| URL | #{@dataServicesCoreProperties.server.contextPath}/internal/seed-data, #{@dataServicesCoreProperties.server.contextPath}/internal/seed-data/ |
| Parameters | includeModels |
| Success response | 200 OK  File is ready to be downloaded. |

#### Internal Seed Data Delete REST API

This API provides the ability to delete models, documents, relationship links, attachments.

List of Contents
:   * [Delete Seed Data](#rest_delete_seed_data)

##### Delete Seed Data

|  |  |
| --- | --- |
| Name | Delete Seed Data |
| Description | Endpoint allowing delete seed data. |
| Method | DELETE |
| URL | #{@dataServicesCoreProperties.server.contextPath}/internal/seed-data, #{@dataServicesCoreProperties.server.contextPath}/internal/seed-data/ |
| Headers | Accept  application/json |
| Parameters |  |
| Success response | 204 No Content  Delete Seed Data successfully. |

## Data Services Clients

### Java Client

To connect any Java application to the server, use our Java API — no manual HTTP handling required. The client manages both communication and authentication for you. Configuration is flexible to suit different environments. While the client is Spring-based, it also supports usage in non-Spring contexts.

#### Main Initialization

The main entry point for connecting your Java application is the `ClientFactory`.

For Spring applications, configure the property `mgmtp.a12.dataservices.client.configuration.base-url` with your server URL, then inject the factory into your class. You can also use the autoconfigured project as a dependency to inject client interfaces directly.

For non-Spring applications, instantiate `ClientFactory` using its default constructor.

Prefer a single factory instance per application to minimize authentication overhead. Multiple factories are only needed for scenarios like using separate technical users.

In Spring, one factory is created automatically via classpath scanning; additional instances must be created by your infrastructure. The factory supports both single-threaded and multithreaded environments.

To add custom request interceptors (e.g., for modifying headers), create a `ClientFactory` instance as a Spring bean or via your DI framework. Use the builder to supply a list of custom `ClientHttpRequestInterceptor`.

#### Manual Configuration

Manual configuration is suitable when you need full control over authentication and server settings, or want to customize request handling.

To do this, instantiate `ClientConfiguration` and `UaaRestClientConfiguration` with your desired properties. Use `ClientFactory#builder(…​)` to obtain a `ClientFactoryBuilder`, customize as needed, and call `build()` to create the factory.

Once initialized, you can retrieve any client interface from the factory, such as `ClientFactory#getRestModelsClient()`, and begin interacting with the server.

#### Autoconfiguration

For autoconfiguration, you can depend on the autoconfigure library: `com.mgmtp.a12.dataservices:dataservices-client-spring-boot-autoconfigure`

By doing this, you can use the beans of the client interfaces by injecting them to your code. For example:

Example usage of ModelsClient

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` class YourClass {     @Inject     private ModelsClient modelsClient;      public void run(String model) {         [...]         modelsClient.createModel(new StringReader(model));         [...]     } } ``` |
```

|  |  |
| --- | --- |
|  | The server must be configured properly, otherwise it will not work. (see configuration properties with prefix `mgmtp.a12.dataservices.client`) |

For all properties see the [Configuration details](#dataservices-configuration).

##### Exception Handling

The client API provides three main runtime exceptions for type-safe error handling. When a specific exception cannot be thrown, a generic exception is used. All exceptions are unchecked and do not need to be declared in API signatures.

|  |  |
| --- | --- |
| `A12ClientException` | Generic exception used for any kind of error where we can’t use a specific exception. Parent of all other client exceptions. |
| `MissingAccessRightException` | This exception will be thrown when the user has no access right to a document or model. |
| `MissingDataException` | This exception will be thrown when the requested document or model is not found. |

You can use the `getErrorDetail()` method on each exception to get details:

Example usage of getErrorDetail()

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` public ErrorDetail getErrorDetail() {     return errorDetail; } ``` |
```

`ErrorDetail` is just a marker interface. See the example from the Java client implementation.

Example implementation of ErrorDetail

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` public class RestErrorDetail {     private int responseCode;     private String response; } ``` |
```

##### Usage Scenarios

The client can be used in different scenarios. This section describes the most common ones.

###### Fat Client AKA Tools

In this case you just need a single user which is configured in the application settings. The usage is single thread. Authentication is handled by the client itself and credentials are stored at runtime by the client.

###### Client With Multiple (Technical) Users

This case is similar to the previous one with the only difference that you need to have multiple factories. Credentials are bound to each factory.

##### Client Interfaces

After all configuration is done, you can use the client interfaces to interact with the rest endpoints in your Java application. These are the classes:

* `com.mgmtp.a12.dataservices.client.attachment.RestAttachmentV2Client`
* `com.mgmtp.a12.dataservices.client.rpc.RestRpcOperationsClient`
* `com.mgmtp.a12.dataservices.client.enumeration.rest.RestEnumerationClient`
* `com.mgmtp.a12.dataservices.client.model.rest.RestModelsClient`
* `com.mgmtp.a12.dataservices.client.relationship.rest.RestRelationshipClient`

Detailed explanations how to call these interface methods can be found in the respective Javadoc.

### Data Services Command Line Interface (CLI)

The CLI is a tool used to interact with the running Data Services server from scripts or command line, so make sure your Data Services server is up and running.

Basic usage is:

* `java -jar dataservices-client-cli-38.4.2-fatjar.jar COMMAND OPTIONS ARGUMENTS` or just
* `./dataservices-client-cli-38.4.2-fatjar.jar COMMAND OPTIONS ARGUMENTS`
  If you are using POSIX shell and have set the executable flag to fatjar and have at least Java 11 version configured.

|  |  |
| --- | --- |
|  | If you call an executable jar, the current directory is set to the location of the jar, so relative paths are resolved relatively to the jar location. |

The application returns exit code 0 if all has been executed without problems. In case of an error it returns exit code 1. In case of help requested it returns exit code 2.

When you run it just with `-h` argument, help is displayed (also listing all available commands and their syntax).

For the tool to work properly, you have to configure it.

A path can be provided by using OS specific absolute or relative path, or by a valid URI. Files should not have spaces in the name. Currently, we support only directories with spaces but not files.

Examples for acceptable paths:

* `c:\data\mymodel.json`
* `/home/user/mydata/mymodel.json`
* `file:/c:/data/mymodel.json`
* `classpath:/mymodel.json`
* `data\mymodel.json`
* `mydata/mymodel.json`

#### Configuration

The tool is configured using the Java properties read from command line or from the file `application.properties`, which should be placed in the same directory as the fatjar, or in a subdirectory called `config`, as it is common in Spring.

## Data Services - Content Store

### Introduction

Attachments and thumbnails are managed by the Data Services module Content Store (CS). Data Services interacts with Content Store to upload these files, while only the content itself is stored in Content Store; attachment metadata resides in the `attachment_header` table. All uploaded content sharing the same Persistent Type is handled uniformly (see [Persistent Type section](#content-store-persistent-type)).

Content Store operates in two modes:

* **Embedded Mode:**:

  + The default mode, running within the Data Services component.
  + Only the Download Content API is exposed; other APIs are restricted.
  + No separate Content Store instance is required for client projects.
* **Standalone Mode:**

  + Runs as an independent service, exposing APIs for uploading, deleting, and generating downloadable URLs via `ContentStoreTicketController` and `ContentStorePrivateController`.
  + Data Services communicates with Content Store using the [Content-store-client](#content-store-client-module) module.
  + Attachment and thumbnail processing is decoupled from Data Services performance.
  + Standalone Content Store can also operate independently of Data Services.

Content Store supports both file system and database storage, configurable with file system as the default.

Content Store uses its own `Datasource`. This requires configuring `Datasource` properties for Content Store in any mode, enabling seamless switching between standalone and embedded operation.

The following diagram illustrates the relationship between Data Services and Content Store classes, useful for extension.

![attachment v2 class diagram](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/uml/attachment_v2_class_diagram.svg)

Figure 28. Attachment V2 diagram

#### Content Store Persistent Type

We introduce the Persistent Type concept. Currently, we have two types: `private` and `public`, each type has a different process to download content.

* `private`:

  + Content of this type cannot be downloaded directly from Content Store. Instead, one has to register a download ticket for the desired `contentId`. The response contains a download URL which doesn’t include the `contentId` so that `contentId` isn’t exposed.
  + By default, `private` content can only be downloaded once.
* `public`:

  + Content of this type has a static download URL, which remains the same for every request to get a download URL for this `public` content.

### Content Store Sub Modules

Content Store module includes 6 sub modules:

1. `dataservices-content-store-client`: The Java clients used for communicating with standalone-mode Content Store, reference: [Content Store client module](#content-store-client-module).
2. `dataservices-content-store-core`: This module is the Java core of Content Store.
3. `dataservices-content-store-core-spring-boot-autoconfigure`: This module helps to initialize the core module with Spring application automatically.
4. `dataservices-content-store-server`: This module defines the standalone Content Store API.
5. `dataservices-content-store-server-app`: This module helps to run `dataservices-content-store-server` as Spring application.
6. `dataservices-content-store-server-spring-boot-autoconfigure`: This module helps to initialize the server as Spring application automatically.

### Content Store Configuration

Content Store uses Spring for configuration management. All configuration keys are prefixed with `mgmtp.a12.dataservices.contentstore`.
In embedded mode, configuration from higher-level modules can override settings from lower-level modules to ensure flexible integration.

#### Configuration Options

##### Permanent Configuration

The following configuration keys should not be changed because Content Store rely on a certain state of database and configuration of repositories:

`spring.datasources.contentstore.liquibase.enabled` = `true`
:   For enabling liquibase.

`spring.datasources.contentstore.liquibase.change-log` = `classpath:/contentstore_db/project_model.xml`
:   Liquibase change log configuration.

`spring.jta.enabled` = `true`
:   JTA is enabled by default.

`spring.datasources.contentstore.jpa.hibernate.ddl-auto` = `validate`
:   Enables the validation of DDL statements.

##### Changeable Configuration

The example values are those for an H2 in memory database. Keep in mind that for production usage you should use a persistent database. Content store supports H2 database but Data services server does not support it.

`spring.datasources.contentstore.url` = `jdbc:h2:mem:contentstore;`
:   Connection string to DB

`spring.datasources.contentstore.driver-class-name` = `org.h2.Driver`
:   Driver must be on the classpath

`spring.datasources.contentstore.name` = `contentstore`
:   Database name

`spring.datasources.contentstore.username` = `sa`
:   Username for the connection

`spring.datasources.contentstore.password` =
:   Password for the connection

`spring.datasources.contentstore.jpa.database` = `H2`
:   Spring target DB, can be auto-detected

You can define your own Liquibase migration datasource by providing a bean with LiquibaseDatasource annotation like:

Custom Liquibase Migration DataSource

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` @LiquibaseDataSource @Bean public DataSource contentstoreMigrationDataSource(Object... params) { 	// your implementation } ``` |
```

If custom liquibase migration datasource is not provided, this block of configuration options focuses on liquibase datasource for database migration:

`spring.datasources.contentstore.liquibase.url`
:   The database connection string to apply liquibase migration, if this property is provided, the following **user** and password below are required, if not this connection will be ignored and Content Store datasource will be applied instead.

`spring.datasources.contentstore.liquibase.user`
:   The username which liquibase will use on behalf, while performing migration, if this property is provided but above liquibase **url** is missing then Content Store **url** will be used instead.

`spring.datasources.contentstore.liquibase.password`
:   The password of liquibase **user**

`spring.datasources.contentstore.liquibase.driver-class-name`
:   Database driver

###### Cache Configuration

By default, the Content Store has second-level caching enabled, but no data is currently configured for caching.

`spring.datasources.contentstore.jpa.properties.hibernate.cache.useSecondLevelCache` = `true`
:   Enables use of second level cache.

`spring.datasources.contentstore.jpa.properties.hibernate.cache.useQueryCache` = `false`
:   Database queries are not cached currently.
    Content Store performance relies on avoiding of DB queries rather than caching them.

`spring.datasources.contentstore.jpa.properties.hibernate.cache.region.factoryClass` = `com.hazelcast.hibernate.HazelcastCacheRegionFactory`
:   Content Store prefers using Hazelcast by default. Please note that no other Factory class has been tested.

`mgmtp.a12.dataservices.contentstore.cache.timeout` = `3600`: *int*
:   Cache timeout for default value of request public url of content parameter.
    Acceptable configuration unit is: Second.
    *Example:* 3600 means the public url of content will be expired after 1 hour.

###### Extension Configuration

`mgmtp.a12.dataservices.contentstore.extensions.tika.inMemoryTemp.enabled` = `false`: *boolean*
:   If enabled, enforces Tika to use in-memory JimFs as temporary storage during Mime-Type detection.

###### Server Configuration

`mgmtp.a12.dataservices.contentstore.server.api.enabled` = `false`: *boolean*
:   Enable/disable exposing of API controllers.
    By default it’s enabled, but you could disable it if you use Content Store in embedded mode.

`mgmtp.a12.dataservices.contentstore.server.api.mimeType.trustExternalMimeType.enabled` = `false`: *boolean*
:   Enable/disable mandatory request parameter `mimeType` in content uploading API: "POST /api/content".
    By default, it’s disabled, this means Content Store will probe mime type from the uploading content, the request parameter is ignored.
    If this property is enabled, the request parameter is mandatory and Content Store will take it as content mime type.

`mgmtp.a12.dataservices.contentstore.server.contextPath` = `/cs`: *java.lang.String*
:   Mappings in Content Store have the following structure: SPRING\_CONTEXT\_PATH/CONTENT\_STORE\_CONTEXT\_PATH/…​
    This property should be used to set CONTENT\_STORE\_CONTEXT\_PATH.
    Its purpose is to give an ability to differentiate with DATA\_SERVICES\_CONTEXT\_PATH by introducing your own prefix variable.

    NOTES:
    1. Don’t put leading '/' if SPRING\_CONTEXT\_PATH has trailing '/'. It will result in '//' prefix in the mappings.
    2. There is a configuration called `mgmtp.a12.uaa.authentication.context-path`.
    It should be equal to this property for the application to function properly.

`mgmtp.a12.dataservices.contentstore.server.pub.enabled` = `true`: *boolean*
:   Enable/disable exposing of public controllers.
    By default it’s enabled, but you could disable it if you use Content Store as library
    of your application, and you handle in your way.

###### Storage Configuration

`mgmtp.a12.dataservices.contentstore.storage.contentStorage` = 'FS' content will be persisted to file system.: *enum*
:   Default implementation of content storage.
    Can be one of `FS` for filesystem storage, `DB` for database storage or `OTHER` - in this case none
    of the bundled content storages is used, and you must provide your own implementation.

`mgmtp.a12.dataservices.contentstore.storage.fs.location` = `${user.home}/a12/dataservices/contentstore/contents`: *java.io.File*
:   Content location on file system (Prefix `file:` is mandatory).
    *Example:* `file:/var/lib/a12/dataservices/contentstore/contents`

###### Other Properties

`spring.datasources.contentstore.jpa.show-sql` = `false`
:   By default, queries from Content Store to the database are not logged.

`mgmtp.a12.dataservices.contentstore.baseUrl` = : *java.lang.String*
:   This is the base URL of Content Store which is used for public access.
    Downloadable URLs requested by a client (Web Browser) will point to this host.
    Therefore, the host here should be public-domain that is accessible from the internet.
    If Content Store is deployed on a cluster behind a load balancer, please make sure that this host is pointing to your Content Store public domain name.
    This base-url is required, for setting up relative path please use "/".
    This property is mandatory for starting up Content Store application:
    1. For embedded mode by default this base-url property is set to localhost:8080 which works well for development mode,
    please be aware of setting this property properly in your production.
    Because this property is used to construct downloadable URLs for content, this means end users will never be able to download the content by using the default property localhost:8080.
    Please set this property by using your public domain which points to Data Services server and can be accessed from the internet.

    1. For the standalone mode please consider the same situation. Set base-url property by using your public domain which points to Content Store server and can be accessed from the internet.

`mgmtp.a12.dataservices.contentstore.contentWaitReadyTimeout` = : *long*
:   This is the timeout for waiting until content stream is ready for downloading.

`mgmtp.a12.dataservices.contentstore.enableDefaultDownloadListener` = : *boolean*
:   This is for enabling download ready field by default, it’ll set contentStream.ready = true.
    In case you turn off default listener here, you must set ready = true to enable downloading.

`mgmtp.a12.dataservices.contentstore.limitSize` = `10 MiB`: *java.lang.String*
:   Limit size of content (value is case-insensitive). Acceptable configuration unit is: Kb(Kilobytes),
    Mb(Megabytes), Gb(Gigabytes).
    *Example:* `10 MiB` limited content size 10 Megabytes.

`mgmtp.a12.dataservices.contentstore.ticketDuration` = `5 min`: *java.lang.String*
:   Expired time for available ticket (value is case-insensitive). Acceptable configuration unit is: H(hour),
    M(Minute), S(second).
    *Example:* `5 min` ticket will be considered as unavailable after 5 minutes.

`mgmtp.a12.dataservices.contentstore.ticketMultiDownload.enabled` = `false`: *boolean*
:   Property to allow client downloading content from ticket multiple times until it’s expired.
    This is disabled by default.

##### Content Store Client Properties

These properties should be applied when Data Services is configured to communicate with standalone-mode Content Store.

`mgmtp.a12.dataservices.contentstore.client.configuration.remoteUrl` = : *String*
:   This is the Content Store remote URL that Data Services will use to communicate with the Content Store HTTP APIs.
    Please note that if Content Store is running on a cluster, then the host should be the Load Balancer domain name or service name,
    which Data Services can access within the intranet.

`mgmtp.a12.dataservices.contentstore.client.content.baseUrl` = : *java.lang.String*
:   Base URL to use as prefix of content relative download URL.
    If download URL is relative and this property is configured properly,
    Content Store will concatenate this property with relative download URL to have a full download URL.

    E.g:

    * baseUrl = "http://localhost:8080"
    * relativeUrl = "/cs/api/content/93ebef0f-b034-4547-afb9-2ab51ab314ba"
    * expected downloadUrl = "http://localhost:8080/cs/api/content/93ebef0f-b034-4547-afb9-2ab51ab314ba"

`mgmtp.a12.uaa.authentication.client.rest.authentication-configuration.relative-login.url` = `user/local/login`
:   Content Store Client uses the `UAA Rest Client Connector`. This property is for re-authenticating the currently logged-in session when making a HTTP call from Content Store Client to standalone-mode Content Store.

`mgmtp.a12.dataservices.contentstore.client.content.base-url`
:   Set a valid URL to define the base endpoint for downloadable content. Data Services uses this property to construct full download URLs by appending the relative content path from Content Store standalone mode. By default, this property is empty.

### How to Start the Content Store Module

Content Store can be started in two modes: embedded mode and standalone mode.

#### Embedded Mode

By default, Data Services operates with Content Store in embedded mode, where the Private API for uploading and requesting downloadable URLs is disabled. Only the Public API for downloading content is exposed. For details on Public and Private API capabilities, see [here](#content-store-persistent-type).

#### Standalone Mode

For using Data Services with standalone-mode Content Store please follow these steps:

* Start your Content Store as a standalone application by running this gradle task:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` ./gradlew :content-store:dataservices-content-store-server-app:bootRun ``` |
```

* This Gradle task starts the Content Store Spring application with built-in `uaa` profile. If you want to change UAA configuration please refer to the [UAA documentation](https://geta12.com/docs/uaa/uaa-documentation-src/index.html#authentication).
* Data Services uses the client from `dataservices-content-store-client` to communicate with Content Store. You should set up UAA configuration for this client to retrieve an authentication token (please use the same UAA configuration for both Data Services and Content Store).
  Currently, we provide authentication for standalone-mode Content Store. This means only authenticated users can send request to Content Store for manipulating content.
  Content Store is designed as an internal service. In any case you want to publish the Content Store APIs, please extend the APIs and apply suitable UAA-Authorization for your content protection.
* You may create your own `uaa` profiles to adapt with your project needs.
* Please take a look at the [configuration properties for Content Store](#content-store-configuration). For any `JPA` custom properties configuration please override the default:

Default JPA configuration for Content Store

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` spring.datasources.contentstore.jpa.show-sql=false spring.datasources.contentstore.jpa.properties.hibernate.cache.use_second_level_cache=false spring.datasources.contentstore.jpa.properties.hibernate.cache.use_query_cache=false spring.datasources.contentstore.jpa.properties.hibernate.cache.region.factory_class=com.hazelcast.hibernate.HazelcastCacheRegionFactory spring.datasources.contentstore.jpa.properties.hibernate.cache.hazelcast.instance_name=A12S spring.datasources.contentstore.jpa.properties.hibernate.physical_naming_strategy=org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy spring.datasources.contentstore.jpa.properties.hibernate.implicit_naming_strategy=org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy ``` |
```

* In this mode please be sure to have enabled Content Store Private API because Data Services need to communicate with Content Store via this API. By default, Content Store Private API is enabled for the standalone mode.

### Content Store HTTP API

When running in standalone-mode, Content Store publishes an API to manipulate content using 3 controllers:

|  |  |
| --- | --- |
|  | Parameters marked with  are mandatory and should not be omitted nor `null`. Other parameters (marked with ) can be bypassed or set to `null`. |

#### Content Store Private HTTP API

| Documentation | URL | Description |
| --- | --- | --- |
| [Content Store Ticket Controller REST API](#rest_content_store_ticket_controller_rest_api) | #{@contentStoreProperties.server.contextPath}/api/ticket | This API provides the ability to create a ticket for downloading private content. |
| [Content Store Private Controller REST API](#rest_content_store_private_controller_rest_api) | #{@contentStoreProperties.server.contextPath}/api/content | This API provides the ability to upload, delete content, or request download URL for public content. |

#### Content Store Public HTTP API

| Documentation | URL | Description |
| --- | --- | --- |
| [Content Store Public Controller REST API](#rest_content_store_public_controller_rest_api) | #{@contentStoreProperties.server.contextPath}/download | This API provides the ability to download content. |

`ContentStoreTicketController` and `ContentStorePrivateController` are secured; only authenticated users can access these controllers.

|  |  |
| --- | --- |
|  | By default, there is no authorization applying to them. This means, for the current architecture Data Services should be the only one who can communicate directly with these controllers for data security. |

#### Content Store Ticket Controller REST API

This API provides the ability to create a ticket for downloading private content.

List of Contents
:   * [Request Ticket to Download Private Content](#rest_request_ticket_to_download_private_content)

##### Request Ticket to Download Private Content

|  |  |
| --- | --- |
| Name | Request Ticket to Download Private Content |
| Description | Endpoint that allows generating a download URL of private content. |
| Method | GET |
| URL | #{@contentStoreProperties.server.contextPath}/api/ticket/{contentId} |
| Parameters | contentId  contentId to get download url.  duration  Input string for transferring to seconds in long number, input case is insensitive. |
| Success response | 200 OK  Return downloadable URL with ticket id. The client can use this URL to download the content and can add parameter "filename" to set the file name for the downloaded file. |

#### Content Store Private Controller REST API

This API provides the ability to upload, delete content, or request download URL for public content.

List of Contents
:   * [Upload Content](#rest_upload_content)
    * [Delete Content](#rest_delete_content)
    * [Get Download URL](#rest_get_download_url)

##### Upload Content

|  |  |
| --- | --- |
| Name | Upload Content |
| Description | Endpoint that allows uploading of content file. |
| Method | POST |
| URL | #{@contentStoreProperties.server.contextPath}/api/content |
| Parameters | content  Content upload data.  contentId  The contentId to save.  persistentType  Persistent Type for Content, public or private.  filename  The name of content.  mimeType  The mime type of uploading content, this mime type will only be accepted if `mgmtp.a12.dataservices.contentstore.server.api.mimeType.trustExternalMimeType.enabled` is true |
| Success response | 200 OK  Content has been uploaded to file system. |

##### Delete Content

|  |  |
| --- | --- |
| Name | Delete Content |
| Description | Endpoint that allows deleting content by id. |
| Method | DELETE |
| URL | #{@contentStoreProperties.server.contextPath}/api/content/{id} |
| Parameters | id  Path variable for deleting content by id. |
| Success response | 204 NO\_CONTENT  Content has been deleted. |

##### Get Download URL

|  |  |
| --- | --- |
| Name | Get Download URL |
| Description | Endpoint for requesting downloadable URL for public content by id. |
| Method | GET |
| URL | #{@contentStoreProperties.server.contextPath}/api/content/{id} |
| Parameters | id  The public content id for requesting url. |
| Success response | 200 OK  Return downloadable URL from content id. The client can add the parameter "filename" to set the file name for the downloaded file. |

#### Content Store Public Controller REST API

This API provides the ability to download content.

List of Contents
:   * [Get Content](#rest_get_content)

##### Get Content

|  |  |
| --- | --- |
| Name | Get Content |
| Description | Endpoint allows downloading a content file. |
| Method | GET |
| URL | #{@contentStoreProperties.server.contextPath}/download/{id} |
| Parameters | id  contentId of public content or ticketId of private content.  filename  The content file name of the response, if it’s empty the id would be used.  cacheDuration  The duration of cache config in seconds and 0 is disabled cache, negative number is maximum cache duration - 2147483647 seconds. Default value can be configure through key `mgmtp.a12.dataservices.contentstore.cache.timeout`. |
| Success response | 200 OK  File is ready to be downloaded. |

### Content Store Client Module

This is a Java client library used for communication with Content Store.

There are 3 Content Store clients within this module related to the corresponding 3 Content Store controllers (see [here](#content-store-api)):

* `ContentStorePrivateClient`
* `ContentStorePublicClient`
* `ContentStoreTicketClient`.

They are provided as Spring beans. Data Services will automatically scan them if it is configured to communicate with standalone-mode Content Store.

* Please be aware of the Content Store Client configuration mentioned in the section about [Content Store Client Properties](#content-store-client-properties)

### Sequence Diagram

These diagrams below will show how Content requests and responses are handled:

![content save sequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/uml/content-save-sequence.svg)

Figure 29. Content save diagram

Content Store publishes events

* before content is saved
* after content is saved.

Please take a look at the [Content Store Events section](#content-store-events) for further information.

![content download sequence](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/uml/content-download-sequence.svg)

Figure 30. Content download diagram

Content Store publishes events when

* the content download URL is created
* the content is loaded from storage system
* the content is ready for downloading
* the content is downloaded.

Please take a look at the [Content Store Events section](#content-store-events) for further information.

|  |  |
| --- | --- |
|  | This sequence diagram applies for downloading private content. When downloading public content the flow is easier: we don’t have to register download ticket to Content Store but all events are still published. |

### Content Store Events

##### ContentBeforeDownloadEvent

Triggered before the content is going to be downloaded.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.contentstore.events.ContentBeforeDownloadEvent` |
| listeners | `com.mgmtp.a12.contentstore.autoconfigure.internal.listener.DefaultContentDownloadEventListener#listenOnContentBeforeDownload` order: 2147483647 |

##### ContentAfterRequestEvent

Triggered after the request for downloading the content is created.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.contentstore.events.ContentAfterRequestEvent` |

##### ContentBeforeCreateEvent

Triggered before persisting the content to the storage system.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.contentstore.events.ContentBeforeCreateEvent` |

##### ContentAfterCreateEvent

Triggered after the content is created.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.contentstore.events.ContentAfterCreateEvent` |

##### ContentAfterDownloadEvent

Triggered after the private content stream is downloaded successfully. This event is not published when downloading public content.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.contentstore.events.ContentAfterDownloadEvent` |

##### ContentStoreInitializationFinishedEvent

Published when Content Store initialization completes and all models and documents are loaded and indexed.
It also indicates that the Content Store server is ready to be used.

|  |  |
| --- | --- |
| event | `com.mgmtp.a12.contentstore.initialization.events.ContentStoreInitializationFinishedEvent` |
| listeners | `com.mgmtp.a12.contentstore.server.actuator.ContentStoreInitializationFinishedHealthIndicator#onApplicationEvent` order: 2147483647 |

### Content Store Artifacts

#### Jar Application

|  |  |
| --- | --- |
| **Group ID** | com.mgmtp.a12.dataservices.contentstore |
| **Artifact ID** | dataservices-content-store-server-app |

#### Content Store BOM

There is a way to build your own artifact. For this, we offer a BOM artifact.

If you need a custom artifact, you need to extend from main Data Services BOM artifact:

|  |  |
| --- | --- |
| **Group ID** | com.mgmtp.a12.dataservices.contentstore |
| **Artifact ID** | content-store |

then, you have to define the artifact packaging.

This is the recommended way how to extend Content Store because it allows the most flexibility while not enforcing any target extension (war, jar, fatjar,…​).

#### Content Store Helm Charts

We provide Helm charts to deploy the Content Store application on Kubernetes clusters.
The Helm charts can be found in the artifactory under the following ID:

|  |  |
| --- | --- |
| **Group ID** | com.mgmtp.a12.dataservices |
| **Chart ID** | a12-content-store |

Please note that helm version is different from Data Services version, current chart version is 7.4.2.

### Content Store Probing Content Mime Type

#### Content Mime Type Probing Mechanism

Mime-type probing for content is implemented in the modules `dataservices-common/dataservices-common-lib` and `dataservices-common/dataservices-common-api`. The `dataservices-common/dataservices-common-api` module provides the `ContentTypeDetector` interface, with its default implementation `TikaContentTypeDetector` located in `dataservices-common/dataservices-common-lib` and leveraging the Tika library for detection. When a mime type is successfully detected, a `ContentTypeDetectedEvent` is published.

Client projects can listen for the `ContentTypeDetectedEvent` to customize mime-type detection. The listeners `JsonContentTypeListener` and `MsWordContentTypeListener` offer custom handling for `application/json` and `application/msword` mime types in text content.

In Content Store, the `DefaultContentStoreService` uses the default `TikaContentTypeDetector` for probing. In Data Services, both `EmbeddedContentStoreAttachmentRepository` and `StandaloneContentStoreAttachmentRepository` rely on the same default detector.

Custom implementations of `ContentTypeDetector` are discouraged unless strictly necessary. If customization is required, it should be handled in the client project or by publishing the `ContentTypeDetectedEvent` to utilize the default listeners.

![content mime type probing class diagram](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/uml/content-mime-type-probing-class-diagram.svg)

Figure 31. Content probing mime type class diagram

## Examples

Data Services offer three artifacts that serve as examples of customized DS implementations.

### Extending Server

For the examples listed below, refer to the code found in the `com.mgmtp.a12.dataservices:examples:examples-extending-server` artifact.

1. Authorization examples

   1. Custom authorization of methods
   2. Additional ABAC rules for Query
   3. Black box authorization for Query
2. Kernel extension examples

   1. Custom kernel types and conditions
   2. Static validation code configuration
   3. Custom serialization of documents
3. Misc

   1. Custom exceptions
   2. Custom event listeners (e.g attachments encryption and decryption)
   3. Custom attachment cleanup condition
   4. Custom in memory document read repository
   5. Custom external enumeration
   6. Custom document model migration
   7. Custom operation
   8. DS configuration
   9. Adding custom configuration properties to actuator via @ExposePropertiesToActuator annotation
   10. Custom configuration for probing attachments in Data Services and sending mime-type to Content Store when creating content. The Content Store will trust the mime-type or not (also depends on Content Store configuration, please refer to [Content Store example profiles](#content-store-server-example)).
   11. Implementation of `com.mgmtp.a12.dataservices.migration.IDocumentMetadataMigrator`
       Custom definition of `com.mgmtp.a12.dataservices.migration.DefaultDocumentMetadataMigrationStepConfiguration`.
   12. Custom Query projection
   13. public attachments for certain document models
   14. Custom document metadata by using `mgmtp.a12.dataservices.models.metadata.document.path`.

#### Initialization Application

For examples listed below, refer to the code found in the `com.mgmtp.a12.dataservices:examples:examples-dataservices-init-app` artifact.

1. Usage of init application
2. Configuration of init application
3. Custom migration in init application
4. Custom annotation composing @MigrationStep annotation

### Content Store Server Example

For examples listed below, refer to the code found in the `com.mgmtp.a12.dataservices:examples:dataservices-content-store-server-example` artifact.

1. Custom UAA authentication
2. Custom configuration to accept external mime type for content in uploading content API.

## Docker Images

This section guide describes how to configure and run the Data Services container images efficiently.

Data Services provides following images:

1. `com.mgmtp.a12.dataservices/dataservices-server-app`

   * The main application that provides all functionalities.
2. `com.mgmtp.a12.dataservices/dataservices-server-init-app`

   * The application which should be used for initialization and migration purposes in production environments.
3. `com.mgmtp.a12.dataservices/dataservices-content-store-server-app`

   * The application for a dedicated standalone Content Store server.

### How to use the image

|  |  |
| --- | --- |
|  | The examples below are just for development purposes and should never go to production. |

#### Start A Data Services Instance

To run the Data Services image, additional configurations are required.
The minimal UAA configuration needs to be provided via environment variables for the container to bootstrap successfully.

### How To Configure The Image

Since Data Services is using Spring for all configurations needs,
all built-in profiles and properties could be used to configure the container via environment variables.

* For the built-in profiles, please see [Configuration Profiles](#configuration-profiles).
* For the configuration properties, please see [Configuration](#dataservices-configuration).

### Extension Points

The image is built for usage with configuration. Extension points are not supported for this version.

## Troubleshooting Common Problems

### Javadoc is not properly rendered in IDE

DS uses Asciidoctor syntax for Javadoc, which is not natively supported by all IDEs. For proper rendering in IntelliJ IDEA, install the Asciidoclet plugin or use a suitable alternative for your IDE.

Without the plugin, Javadoc will display in IntelliJ IDEA, but indentation and JSON formatting may be incorrect.

Eclipse supports rendering Javadoc in Asciidoc format with available plugins, but Visual Studio Code currently lacks native support for this feature.

### Error `org.quartz.SchedulerException: Job instantiation failed`

This is typically caused by the existing job definitions stored in the database at table `qrtz_job_details` column `job_class_name`.
Spring Quartz fails to initialize the job beans because of the changes of class path or class name.

This is just a warning log, it won’t crash the application from bootstrapping and requires migration effort to adapt the classpath changes.

**Quartz job may run when disabling**

By default, we configure that Quartz stores all job information in the database, and we set the property `spring.quartz.jdbc.initialize-schema=never`, it prevents automatic table creation on startup.
This can lead to unexpected behavior when disabling jobs.

#### Here’s Why:

* If you set `mgmtp.a12.dataservices.jobs.enabled=false` to disable jobs after they have already been run, the job information will still be present in the database.
* Since the `initialize-schema` property is set to `never`, the Quartz job manager won’t automatically clean up old job data upon disabling them.
* Therefore, the job may still run even though you disabled it.

To completely turn off jobs and remove their data, you need to combine both properties:

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` mgmtp.a12.dataservices.jobs.enabled=false spring.quartz.jdbc.initialize-schema=always ``` |
```

#### Explanation:

* Setting mgmtp.a12.dataservices.jobs.enabled=false ensures jobs are disabled.
* Setting spring.quartz.jdbc.initialize-schema=always forces the job manager to create tables on startup, which will also clean up any existing data for disabled jobs.
  This combined approach guarantees that jobs are truly disabled, and their information is removed from the database.

### Dynamic Gradle Versions

Please note that our application currently does not support dynamic Gradle versioning.
Attempting to utilize dynamic versioning may lead to unexpected errors or incompatibilities.
For stable performance, we recommend using static Gradle versions and explicit dependency definitions in your projects.

### Hazelcast Warnings In Logs

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` [main                ][WARN ][com.hazelcast.cp.CPSubsystem            ][u:] - [10.54.100.19]:64622 [a12s_it_17320995465710.5125543610423723] [5.4.0] CP Subsystem is not enabled. CP data structures will operate in UNSAFE mode! Please note that UNSAFE mode will not provide strong consistency guarantees. [main                ][WARN ][com.hazelcast.instance.impl.Node        ][u:] - [10.54.100.19]:64622 [a12s_it_17320995465710.5125543610423723] [5.4.0] No join method is enabled! Starting standalone. ``` |
```

These logs are related to standalone mode.
They will disappear when you run Hazelcast in cluster mode and configure the CP Subsystem.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` [main                ][WARN ][org.hibernate.orm.deprecation           ][u:] - HHH90000025: PostgreSQLDialect does not need to be specified explicitly using 'hibernate.dialect' (remove the property setting and it will be selected by default) ``` |
```

This log is related to the configuration of the Postgres database, as Data Services explicitly set the Postgres driver and dialect.

### Spring Boot Issues When Upgrading From 3.3.x to 3.4.x

During Spring Boot upgrade to version 3.4.x we observed several problems with resource resolution in fatjars.
It happens just in several projects.
If you’re one of them, downgrade Spring Boot to version 3.3.x by something like: `implementation enforcedPlatform('org.springframework.boot:spring-boot-dependencies:3.3.7')`.
Unfortunately, we didn’t find the cause and have a better solution yet.

### Configuration Change Does Not Apply In Spring Boot Integration Tests For Data Services

We use Spring Boot conditions to create specific beans based on configuration. To achieve this, values from the `ConfigurationProperties` annotated class (`com.mgmtp.a12.dataservices.configuration.DataServicesCoreProperties`) are propagated to `com.mgmtp.a12.dataservices.configuration.internal.validation.condition.AbstractDataServicesCondition`.

However, as noted in the [Spring Boot issue tracker](https://github.com/spring-projects/spring-boot/issues/2282), there is no direct support for this. Consequently, we bind these properties from the application context to a static map in the `AbstractDataServicesCondition` class. This approach introduces a limitation: since static fields persist for the duration of a JVM execution, configuration changes will not take effect when multiple tests with different configurations are executed in the same JVM unless the map is refreshed. The solution involves resetting the static dependency manually, as shown below:

Resetting static dependency in AbstractDataServicesCondition

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` /**  * Since we have the "boundProperties" in {@link AbstractDataServicesCondition} as static dependency, which makes  * running test with multiple instances fail because the static dependency won't reset its default value.  */ private void reboundDataServicesCoreProperties() {     ReflectionTestUtils.setField(AbstractDataServicesCondition.class, "boundProperties", Optional.empty()); } ``` |
```

Consider the following test case that illustrates the issue with static bound properties:

Example test case demonstrating static bound properties issue

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 ``` | ``` @SpringBootTest class StaticBoundPropertiesIssueExplorationTest {      @Nested     @TestPropertySource(properties = "mgmtp.a12.dataservices.query.reindexing.mode=DISABLED")     class GivenReindexingModeDisabled {          @Autowired private DataServicesCoreProperties coreProperties;          @Test void shouldBindProperty() {             // then             assertThat(coreProperties.getQuery().getReIndexing().getMode()).isEqualTo(DataServicesCoreProperties.Query.Reindexing.Mode.DISABLED);         }     }      @Nested     @TestPropertySource(properties = "mgmtp.a12.dataservices.query.reindexing.mode=REBUILD_INDEX")     class GivenQueryReindexingModeRebuildIndex {          @Autowired private DataServicesCoreProperties coreProperties;          @Test void shouldBindProperty() {             // then             assertThat(coreProperties.getQuery().getReIndexing().getMode()).isEqualTo(DataServicesCoreProperties.Query.Reindexing.Mode.REBUILD_INDEX);         }     } } ``` |
```

In this example, the `GivenQueryReindexingModeRebuildIndex` test would fail because the static dependency in `AbstractDataServicesCondition` retains stale values from the `GivenReindexingModeDisabled` test. To ensure the configuration change is applied, you must invoke the `reboundDataServicesCoreProperties` method before running `GivenQueryReindexingModeRebuildIndex`.

### Server Fails to Start with Actuator Misconfiguration

When both properties `management.endpoints.enabled-by-default` and `management.endpoints.access.default` are present in the configuration the server will fail to start with an error like

Example error log

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` *************************** APPLICATION FAILED TO START ***************************  Description:  The following configuration properties are mutually exclusive:  	management.endpoints.access.default 	management.endpoints.enabled-by-default ``` |
```

This may happen when configuration of the actuators by helm chart is used because Helm does not support the property `management.endpoints.access.default` of Spring Boot 3.4.
We recommend to use the DataServices actuator profile until Helm is updates to the new Spring Boot version.

### OOMKilled Errors for Kubernetes Deployments

By default, when an application runs inside a container, the JVM is unaware of the container’s memory limit and may attempt to use more memory than allocated. If this occurs, Kubernetes will terminate the container with an OOMKilled error. To prevent this, add the `-XX:MaxRAMPercentage=80`. This tells the JVM: "Use a maximum of 80% of the container’s assigned memory for the Java heap.

### Using `com.mgmtp.a12.uaa.authentication.backend.BackendAuthenticationService` with Asynchronous Tasks

Data Services currently uses the `MODE_INHERITABLETHREADLOCAL` strategy for `SecurityContextHolder`. This means changes made by a child thread affect the main thread.

`BackendAuthenticationService.executeWithBackendAuthentication` attempts to preserve the original authentication instance in the security context and restore it after execution. This behavior is incompatible with asynchronous execution. To use backend authentication in asynchronous contexts, we recommend using `DelegatingSecurityContextTaskExecutor`.

Example of using BackendAuthenticationService with asynchronous tasks

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 ``` | ``` @Async @CommonDataServicesEventListener public void listenOnServicesInitializationFinished(DataServicesInitializationFinishedEvent dataServicesInitializationFinishedEvent) {     DelegatingSecurityContextTaskExecutor executor =         new DelegatingSecurityContextTaskExecutor(new SyncTaskExecutor(), SecurityContextHolder.createEmptyContext());     Runnable originalRunnable = () -> backendAuthenticationService.executeWithBackendAuthentication(         "superAdmin",         () -> {             // run your codes             return null;         });     executor.execute(originalRunnable); } ``` |
```

Explanation: In an asynchronous event listener, `DelegatingSecurityContextTaskExecutor` uses a new security context, which `backendAuthenticationService` modifies. This prevents changes from affecting the main security context.

### Missing Locale `en-US.UTF8`

Some Linux distributions do not have the `en-US.UTF8` locale installed by default. This may lead to issues when running Data Services, as it expects this locale to be available.

#### Symptoms

When trying to start the PAC or the Project Template start fails with the following error message:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'dsDataSource' defined in class path resource [com/mgmtp/a12/dataservices/autoconfigure/DSEmbeddedPostgresDatasourceConfiguration.class]: Failed to instantiate [javax.sql.DataSource]: Factory method 'dsDataSource' threw exception with message: Process [/tmp/embedded-pg/PG-eeb889eb8aa39ea3cb783f5a8b3fbe01/bin/initdb, -A, trust, -U, postgres, -D, ../postgres/ds-embedded-postgres, -E, UTF-8, --lc-ctype=en_US.UTF-8] failed ``` |
```

#### Workaround

Install the `en_US.UTF8` locale.

For Debian-based distributions (like Ubuntu), you can do this by running:

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` sudo locale-gen en_US.UTF-8 sudo update-locale ``` |
```

For Red Hat-based distributions (like CentOS), you can do this by running:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` localedef -i en_US -f UTF-8 en_US.UTF-8 ``` |
```

After installing the locale, restart your terminal or system to apply the changes.

### Embedded PostgreSQL Fails to Initialize on Windows (Missing Visual C++ Redistributable)

When running the Server with embedded PostgreSQL on Windows, the initialization may fail if the required Visual C++ Redistributable is not installed or if an incorrect version is installed.

#### Symptoms

The application fails to start with an error indicating that the `initdb.exe` process failed:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` Caused by: java.lang.IllegalStateException: Process [C:\Users\...\AppData\Local\Temp\embedded-pg\PG-...\bin\initdb.exe, -A, trust, -U, postgres, -D, ..., -E, UTF-8, --lc-ctype=en_US.UTF-8] failed ``` |
```

This generic error message can have multiple root causes:

* Missing UTF-8 locale (en\_US.UTF-8) - see the previous section
* Missing Visual C++ Redistributable (covered in this section)
* Wrong version of Visual C++ Redistributable installed

#### Root Cause

The embedded PostgreSQL binaries for Windows depend on specific Microsoft Visual C++ Runtime DLLs.
When these DLLs are not present on the system, `initdb.exe` cannot load and fails silently with the generic error shown above.

The specific DLL often missing is `msvcr120.dll`, which is part of the Visual C 2013 Redistributable (v12).
However, installing the latest Visual C Redistributable (v14) is recommended as it provides backward compatibility and better long-term support.

#### Solution

Install the latest Microsoft Visual C++ Redistributable from the official Microsoft download page:

<https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist>

Download and install both the x86 and x64 versions if you are on a 64-bit Windows system to ensure compatibility with all application components.

After installation, restart your terminal or IDE and retry starting the application.

#### Diagnostic Steps

To confirm that this is indeed a Visual C++ Redistributable issue, you can manually run `initdb.exe` to see the specific error:

1. Locate the embedded PostgreSQL directory in your temp folder:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 ``` | ``` C:\Users\<YourUsername>\AppData\Local\Temp\embedded-pg\PG-<hash>\bin\ ``` |
   ```
2. Open a command prompt or PowerShell in that directory and run:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 ``` | ``` .\initdb.exe --version ``` |
   ```
3. If the Visual C++ Redistributable is missing, you will see an error like:

   ```
   |  |  |
   | --- | --- |
   | ``` 1 ``` | ``` error while loading shared libraries: msvcr120.dll: cannot open shared object file: no such file or directory ``` |
   ```

This confirms that the Visual C++ Redistributable installation is required.

### Shared Memory Limit Reached on macOS (`shmget` failed)

When running multiple instances of Data Services or embedded PostgreSQL on macOS, the system may fail to initialize the database due to restrictive kernel limits on shared memory.

#### Symptoms

The application fails to start with an error log indicating a failure in the `initdb` process:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` Process [.../initdb, -A, trust, -U, postgres, -D, ..., -E, UTF-8, --lc-ctype=en_US.UTF-8] failed: FATAL:  could not create shared memory segment: No space left on device DETAIL:  Failed system call was shmget(key=19597448, size=56, 03600). HINT:  This error does *not* mean that you have run out of disk space. It occurs either if all available shared memory IDs have been taken... or because the system's overall limit for shared memory has been reached. ``` |
```

#### Root Cause

macOS has low default limits for System V shared memory segments (`SHMMNI`) and total shared memory (`SHMALL`). Each PostgreSQL instance requires its own segment; once the system limit is reached, `initdb` cannot allocate the memory required for verification.

#### Workaround

You must increase the kernel’s shared memory limits via `sysctl`.

1. **Create or edit the configuration file:**

   ```
   |  |  |
   | --- | --- |
   | ``` 1 ``` | ``` sudo nano /etc/sysctl.conf ``` |
   ```
2. **Add the following parameters:**

   ```
   |  |  |
   | --- | --- |
   | ``` 1 2 3 4 5 6 7 8 ``` | ``` # Increase maximum number of shared memory segments (e.g., to 128) kern.sysv.shmmni=128  # Increase maximum shared memory segment size (e.g., to 1GB - 1073741824 bytes) kern.sysv.shmmax=1073741824  # Increase total shared memory system-wide (e.g., to 4GB - 4194304 kbytes) kern.sysv.shmall=4194304 ``` |
   ```
3. **Apply the changes:**

   Since macOS `sysctl` does not support the `-p` flag, you should **restart your system** to ensure the changes persist.

### Liquibase Checksum Invalid Errors in Version 4.33.0

#### Symptoms

Some deployments using Liquibase version **4.33.0** may fail with a checksum mismatch (e.g., "checksum invalid") **even though the changeSets have not been modified**. This behavior is due to a known issue in the checksum calculation logic that can surface across environments or after minor formatting changes.

#### Previous Workaround

Historically, the issue was bypassed by using the **`validCheckSum`** attribute to explicitly accept the previously calculated checksum:

```
|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` <changeSet id="my-change" author="ds">     <validCheckSum>7:abcdef1234567890</validCheckSum> </changeSet> ``` |
```

While effective, this approach is **fragile**, **obscures real database drift**, and introduces **unnecessary maintenance overhead**.

#### Resolution / Recommended Action

Upgrade Liquibase to **version 5.0.1** (or newer). This version contains fixes that resolve the underlying checksum calculation issue.

## References

### JavaDoc

* [aggregated Javadoc for all Data Services and Content Store artifacts](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/javadoc/index.html)

### TypeDoc

* [dataservices-access](https://geta12.com/docs/2025.06/ext5/data_services/dataservices-documentation-src/assets/typedoc/dataservices-access/index.html)

## Infrastructure Dependencies

In the table below, the infrastructure dependencies required by Data Services are listed with their purpose, supported versions, resource recommendations, and configuration links.

| Dependency | Purpose | Supported Versions | Configuration Reference | Minimum Resource Recommendation | Notes |
| --- | --- | --- | --- | --- | --- |
| Postgres | Stores persistent data (all DS managed data) | 15,16,17 | Please use the link for connection [configuration](#postgres-configuration) and use the following link for [Postgres Setup](#postgres-setup). | 2 CPUs, 8 GB RAM, 100 GB storage |  |

|  |  |
| --- | --- |
|  | Recommendation based on performance and load tests with defined document counts, link complexity, and model complexity. |

Only PostgreSQL is supported as the database for Data Services.

* All DS functional tests are executed against PostgreSQL versions 15, 16, and 17.
* Performance tests are executed only on PostgreSQL version 16.

DS requires Hazelcast 5.5.0 for efficient operation in a clustered setup.

* If DS is run as a single node, no additional Hazelcast instances are needed.

See [PostgreSQL Setup](#postgres-setup) for recommended PostgreSQL configuration.

## Migration Instructions

|  |  |
| --- | --- |
|  | Please have a look at [Migration to latest A12](https://geta12.com/docs/overall/migration_guide/index.html) chapter for an explanation of general steps on how to upgrade before starting with the component migration to 2025.06. |

### 2025.06-ext5

#### Configuration changes

* Hibernate second-level cache (L2 cache) has been disabled by default. The property `spring.datasources.dataservices.jpa.properties.hibernate.cache.use_second_level_cache` is now set to `false` across all configuration files.
* The `spring.jpa.open-in-view` property has been changed from `true` to `false` to align with best practices and avoid potential performance issues with lazy-loaded entities.

#### Breaking changes

* The `com.hazelcast:hazelcast-hibernate53` dependency (version 5.2.0) has been removed from all Data Services modules. This dependency was only used for Hibernate L2 cache integration, which is now disabled.

  If your project explicitly relies on Hibernate L2 cache, you need to:

  1. Add the dependency back to your project’s `build.gradle`:

     ```
     |  |  |
     | --- | --- |
     | ``` 1 ``` | ``` implementation 'com.hazelcast:hazelcast-hibernate53:5.2.0' ``` |
     ```
  2. Enable L2 cache in your configuration:

     ```
     |  |  |
     | --- | --- |
     | ``` 1 ``` | ``` spring.datasources.dataservices.jpa.properties.hibernate.cache.use_second_level_cache=true ``` |
     ```

     |  |  |
     | --- | --- |
     |  | Hibernate L2 cache is disabled due to the questionable license of the `hazelcast-hibernate53` library and limited performance benefits in typical Data Services usage patterns. We recommend using Spring Cache for application-level caching instead. |

#### Information

* The `com.github.junrar:junrar` library has been excluded from Data Services artifacts due to its GPL-3.0 license incompatibility. This library was a transitive dependency of Apache Tika used for RAR archive parsing capabilities.

  |  |  |
  | --- | --- |
  |  | RAR file MIME type detection is NOT affected by this change. Tika continues to detect RAR files correctly using signature-based detection: |

  + RAR 4.x files are detected as `application/x-rar-compressed; version=4`
  + RAR 5.0 files are detected as `application/x-rar-compressed; version=5`

    The junrar library was only needed for parsing the actual contents of RAR archives, which Data Services never performed.

    If your project requires full RAR archive parsing capabilities (beyond MIME type detection) and accepts the GPL-3.0 license terms, you can re-add the library by adding the following dependency to your project’s `build.gradle`:

    ```
    |  |  |
    | --- | --- |
    | ``` 1 ``` | ``` implementation 'com.github.junrar:junrar:7.5.5' ``` |
    ```

    |  |  |
    | --- | --- |
    |  | By adding this dependency, you accept the terms of the GPL-3.0 license. Consult your legal team before proceeding. |

### 2025.06-ext4

#### Configuration changes

* `mgmtp.a12.dataservices.attachments.ext.defaultAttachmentStorage` is removed because it is no longer in use.

#### Deprecations

* `com.mgmtp.a12.dataservices.configuration.DataServicesCoreProperties.Filesystem.Write#enabled` *(field)* — Will be removed without replacement. The switch is not used anywhere since the introduction of the content store. Since 38.2.0, `forRemoval = true`.
* `com.mgmtp.a12.dataservices.relationship.RelationshipMigration` *(class)* — Will be removed. Use `dataservices-relationship-model-migration` npm package instead.
* `com.mgmtp.a12.dataservices.relationship.migrator.model.v2.RelationshipModelMigratorV2ToV3` *(class)* — Will be removed. Use `dataservices-relationship-model-migration` npm package instead.
* `com.mgmtp.a12.dataservices.relationship.migrator.model.v2.RelationshipModelV2` *(class)* — Will be removed. Use `dataservices-relationship-model-migration` npm package instead.
* `com.mgmtp.a12.dataservices.relationship.migrator.model.v3.RelationshipModelV3` *(class)* — Will be removed. Use `dataservices-relationship-model-migration` npm package instead.
* `com.mgmtp.a12.dataservices.relationship.migrator.model.v1.RelationshipModelWrapperV1` *(class)* — Will be removed without replacement. Not used anymore.
* `com.mgmtp.a12.dataservices.relationship.RelationshipModelChangeValidatingListeners` *(class)* — Will be moved to internal package in a future release. No replacement needed; do not depend on this class.

#### Top Level Imports in TS

* Nested imports from the npm package `@com.mgmtp.a12.dataservices/dataservices-access` (e.g. `@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js`)
  are deprecated in favor of top-level imports to avoid unnecessary breaking changes and reduce ongoing maintenance effort.
  To migrate, run: `npx @com.mgmtp.a12.dataservices/dataservices-codemod prefer-top-level-imports <your-source-directory-containing-ts-config-json-file>`.
  For further details, run the command with the `--help` flag.

#### Information

* Since `2025.06` Data Services requires the `pg_trgm` extension in PostgreSQL for `simple_search` and related features. By default, Data Services enables this extension via a Liquibase changeset. If you are not using Data Services Liquibase migrations, ensure the extension is installed manually
* PostgreSQL version 15 will no longer be supported in `2026.06`. Please plan to upgrade to PostgreSQL 16 or higher before upgrading to Data Services `2026.06`.

### 2025.06-ext2

#### Behavior changes

* The `LIST_DOCUMENT_VALIDATION_CODES_INTERNAL` operation now ignores models not present in the validation list. This internal change improves error handling and aligns behavior with `LIST_MODELS_INTERNAL`, making validation more robust and consistent.
* Both the Java `RestAttachmentV2Client#uploadAttachment` and TypeScript clients automatically handle URL encoding for all attachment upload parameters.

#### Configuration changes

* `mgmtp.a12.dataservices.relationship.terminatingLinks.maxResultsPerPage` was removed because it was only used in `LIST_TERMINATING_LINKS` operation which is removed in 2025.06. The change is not considered breaking because the operation is removed as well.

#### Deprecations

* `com.mgmtp.a12.dataservices.relationship.RelationshipModelChangeValidatingListeners` is deprecated and will be moved to internal package. The class is en event listener that should not be called directly from customer projects. Functionality of the listener is still supported.
* `com.mgmtp.a12.dataservices.query.validation.ValidationItem#valid(String[] path)` is deprecated, please use `ValidationItem#valid(String[], String)` instead. The method does not contain message which is needed for better error reporting.
* `com.mgmtp.a12.dataservices.document.DocumentGraphService` is deprecated and will be removed completely. The class was used only for `LOAD_DOCUMENT_GRAPH` operation which is replaced by `QueryAPI` `document-graph` projection.
* `com.mgmtp.a12.dataservices.document.graph.DocumentGraph` is deprecated and will be removed completely. The class was used only for `LOAD_DOCUMENT_GRAPH` operation which is replaced by `QueryAPI` `document-graph` projection.
* `com.mgmtp.a12.dataservices.export.DocumentExportService` is deprecated now and will be removed completely in next major release. The class is not usable anymore because it was used only for Solr queries.
* Every class in package `com.mgmtp.a12.dataservices.relationship.migrator` is deprecated and will be removed completely. Relationship model migration is now part of `dataservices-relationship-model-migration` npm package.
* `com.mgmtp.a12.dataservices.search.SearchUtils` is deprecated and will be removed completely. The class contains constants and utility methods for Solr only. Please use QueryAPI instead.
* `com.mgmtp.a12.dataservices.document.graph.DocumentGraphLink` is deprecated and will be removed completely. Please use `QueryService` with `documentGraph` projection instead.
* `com.mgmtp.a12.dataservices.attachment.AttachmentHeaderSpec#AttachmentHeaderSpec(final String attachmentId, final String filename, final String mimeType, final Long size, final List<AttachmentAnnotation> annotations)`: Use {@link #AttachmentHeaderSpec(String, String, String, Long, List)} or {@link #AttachmentHeaderSpec()} instead.
* `com.mgmtp.a12.dataservices.attachment.ThumbnailType#getNameSuffix()`: This is not used anymore and will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.attachment.UploadedAttachmentDetail`: This is not used anymore and will be removed in next breaking version.
* `com.mgmtp.a12.dataservices.document.Document`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.document.DocumentDetail`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionCodes#LIST_TERMINATING_LINKS_MAX_RESULT_LIMIT_EXCEEDED_EXCEPTION_CODE`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionCodes#SEARCH_SERVICE_EXCEPTION_CODE`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionCodes#RPC_ROLLBACK_FAILED_EXCEPTION_CODE`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionCodes#QUERY_PROJECTION_NOT_FOUND_ERROR_CODE`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionCodes#QUERY_ACCESS_DENIED_ERROR_CODE`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionCodes#QUERY_VALIDATION_ERROR_CODE`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionCodes#QUERY_FUNCTIONALITY_DISABLED_ERROR_CODE`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionCodes#DOCUMENT_CONVERSION_ERROR_CODE`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionCodes#RELATIONSHIP_LINK_ROLE_MISSING_ERROR_CODE`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionCodes#RELATIONSHIP_LINK_ADD_PREDECESSOR_LINK_NOT_FOUND_ERROR_CODE`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionCodes#RELATIONSHIP_RELINK_DOCUMENT_NOT_COMPATIBLE_ERROR_CODE`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_CREATE_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_UPDATE_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_DELETE_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_UNIQUENESS_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_MISMATCH_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_ASSIGNED_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_UNAVAILABLE_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_IN_USE_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_MODEL_MISMATCH_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_IMPORT_DISABLED_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_COMPUTATION_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_SEARCH_QUERY_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_SEARCH_FILTER_UNSUPPORTED_LANG_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_SEARCH_UPDATE_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_FIELD_MISMATCH_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#RPC_ROLLBACK_FAILED_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#OPERATION_DISABLED_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#ATTACHMENT_THUMBNAIL_INVALID_LOCATION_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#ATTACHMENT_THUMBNAIL_INCOMPLETE_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#ATTACHMENT_IO_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#ATTACHMENT_THUMBNAIL_GENERATION_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#ATTACHMENT_CORRUPTED_DATA_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_IMPORT_IO_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_IMPORT_MODEL_RESOLUTION_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#DOCUMENT_IMPORT_SERIALIZATION_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#QUERY_TOPOLOGY_INVALID_AGGREAGATION_AND_FIELDS_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#QUERY_DEPTH_LIMIT_EXCEEDED_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#UNSUPPORTED_TYPE_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#TOKEN_NOT_FOUND_ERROR_KEY`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#NO_PERSISTER_FOUND`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.exception.ExceptionKeys#NOT_FOUND`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#DECIMAL_TYPE`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#NULLIF`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#ROW_KEYWORD`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#CASE_KEYWORD`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#WHEN_KEYWORD`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#THEN_KEYWORD`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#END_KEYWORD`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#UNION_KEYWORD`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#LEFT_KEYWORD`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#SPLIT_PART_KEYWORD`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#LIKE_REGEX_KEYWORD`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#JSON_PATH_KEYWORD`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#TERNARY_FUNCTION`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#NOT_EQUALS_OPERATOR`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#NUMRANGE_TYPE`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#MINUS_ONE_VALUE`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#REGEX_BEGIN_WITH`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#BYTEA_TYPE`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#JSON_OBJECT_AGGREGATE_FUNCTION`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#JSONB_LEFT_CONTAINS_OPERATOR`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#JSONB_BUILD_OBJECT_FUNCTION`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#JSON_ROOT_KEYWORD`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#JSON_FIELD_KEYWORD`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#JSON_FIELD_TYPE_NAME`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#JSONB_PATH_QUERY_FIRST_FUNCTION`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#Model`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#PATH_ELEMENT_LABEL`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#VALUES_COLUMN_NAME`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#DOC_COUNT_COLUMN_ALIAS`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#FULLTEXT_STRING_COLUMN_NAME`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.query.generator.sql.QueryGeneratorConstants#MODEL_FIELDS_TABLE_ALIAS`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.relationship.exception.RelationshipInvalidDocumentModelException`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.relationship.exception.RelationshipInvalidIdException`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.relationship.exception.RelationshipLinkDocumentModelMissingException`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.relationship.exception.RelationshipLinkDocumentSerializationException`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.relationship.spec.LinkResultEntry`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.relationship.spec.RoleDocDescriptor`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.relationship.migrator.model.v1.RelationshipModelMigratorV1ToV3`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.relationship.migrator.model.v1.RelationshipModelV1`: Not used anymore, will be removed in the next breaking release.
* `com.mgmtp.a12.dataservices.relationship.migrator.model.v1.RelationshipModelWrapperV1`: Not used anymore, will be removed in the next breaking release.
* Typescript mapping of `ExactMatchOperator#lang` has been marked as deprecated and will be removed in the next breaking release. The property was introduced by mistake and has no use.

### 2025.06-ext1

#### Behavior changes

* `com.mgmtp.a12.dataservices.document.DataServicesDocumentFactory#newDataServicesDocument` will generate metadata if the document does not contain it already
* Hard limit on number of `and`, `or` operators and their operands have been introduced into `QueryService` and `QUERY` operation. There are 4 new configuration keys that control these hard limits. These hard limits have been introduced to prevent too complex queries that can lead to performance issues or even application crashes. The limits are as follows:

  + `mgmtp.a12.dataservices.query.max-and-operands` (default 1000)
  + `mgmtp.a12.dataservices.query.max-and-operators` (default 1000)
  + `mgmtp.a12.dataservices.query.max-or-operands` (default 1000)
  + `mgmtp.a12.dataservices.query.max-or-operators` (default 1000)
  + Please note that previously working queries might not work anymore because they might violate these limits. Error messages like these: `Only 2 operands are allowed for an and operator` or `Maximum number of and operators [=2] exceeded` will be thrown if the limits are violated.

#### Deprecations

* `com.mgmtp.a12.dataservices.document.DocumentService#load` is deprecated, please use directly method `query` from `com.mgmtp.a12.dataservices.query.QueryService` instead.
* `com.mgmtp.a12.dataservices.export.DocumentExportService` is deprecated and will be removed completely. The class is not usable anymore because it was used only for Solr queries.
* `com.mgmtp.a12.dataservices.rpc.query.FilterSpec` is deprecated and will be removed completely. Please use `QueryRoot` and its `constraint` property instead.
* `com.mgmtp.a12.dataservices.search.SearchUtils` is deprecated and will be removed completely. Please use QueryAPI instead.
* `com.mgmtp.a12.dataservices.rpc.query.PageSpec` is deprecated and will be removed completely. Please use `com.mgmtp.a12.dataservices.query.Paging` property instead.
* `com.mgmtp.a12.dataservices.rpc.query.SortSpec` is deprecated and will be removed completely. Please use `com.mgmtp.a12.dataservices.query.Order` property instead.
* `com.mgmtp.a12.dataservices.rpc.query.ResultSet` is deprecated and will be removed completely. Please use `com.mgmtp.a12.dataservices.query.QueryPage` property instead.
* `com.mgmtp.a12.dataservices.document.search.facets.request.AbstractFacetQuery` is deprecated and will be dropped. The class was used for Solr API only. Please use Query API instead.
* `com.mgmtp.a12.dataservices.document.search.facets.request.AbstractNestableFacetQuery` is deprecated and will be dropped. The class was used for Solr API only. Please use Query API instead.
* `com.mgmtp.a12.dataservices.document.search.facets.request.AbstractStatsFacetQuery` is deprecated and will be dropped. The class was used for Solr API only. Please use Query API instead.
* `com.mgmtp.a12.dataservices.document.search.facets.request.AvgFacetQuery` is deprecated and will be dropped. The class was used for Solr API only. Please use Query API instead.
* `com.mgmtp.a12.dataservices.document.search.facets.request.MaxFacetQuery` is deprecated and will be dropped. The class was used for Solr API only. Please use Query API instead.
* `com.mgmtp.a12.dataservices.document.search.facets.request.MinFacetQuery` is deprecated and will be dropped. The class was used for Solr API only. Please use Query API instead.
* `com.mgmtp.a12.dataservices.document.search.facets.request.RangeFacetQuery` is deprecated and will be dropped. The class was used for Solr API only. Please use Query API instead.
* `com.mgmtp.a12.dataservices.document.search.facets.request.SumFacetQuery` is deprecated and will be dropped. The class was used for Solr API only. Please use Query API instead.
* `com.mgmtp.a12.dataservices.document.search.facets.request.TermFacetQuery` is deprecated and will be dropped. The class was used for Solr API only. Please use Query API instead.
* `com.mgmtp.a12.dataservices.document.search.facets.request.UnknownFacetQuery` is deprecated and will be dropped. The class was used for Solr API only. Please use Query API instead.
* `com.mgmtp.a12.dataservices.document.search.facets.response.BucketContent` is deprecated and will be dropped. The class was used for Solr API only. Please use Query API instead.
* `com.mgmtp.a12.dataservices.document.search.facets.response.BucketedFacetResult` is deprecated and will be dropped. The class was used for Solr API only. Please use Query API instead.
* `com.mgmtp.a12.dataservices.document.search.facets.response.IFacetResult` is deprecated and will be dropped. The class was used for Solr API only. Please use Query API instead.
* `com.mgmtp.a12.dataservices.document.search.facets.response.PrimitiveFacetResult` is deprecated and will be dropped. The class was used for Solr API only. Please use Query API instead.
* `com.mgmtp.a12.dataservices.search.exception.InvalidFacetException` is deprecated and will be dropped. The class was used for Solr API only. Please use Query API instead.
* `FilterSpec` from `dataservices-access` npm package is deprecated. The class was used for Solr API only. Please use `QueryRoot` and its `constraint` property instead.
* `PageSpec` from `dataservices-access` npm package is deprecated. The class was used for Solr API only. Please use `QueryAPI` property instead.
* `QueryPageSpec` from `dataservices-access` npm package is deprecated. The class was used for Solr API only. Please use `QueryAPI` property instead.
* `SortSpec` from `dataservices-access` npm package is deprecated. The class was used for Solr API only Please use `QueryAPI` property instead.

#### Other changes

* Internal module `dataservices-data-pump-tool` is removed. This module was obsolete and served no purpose for Data Services anymore.

### 2025.06

#### Breaking changes

##### Migration to ESM

The npm artifacts `@com.mgmtp.a12.dataservices/dataservices-access` and `@com.mgmtp.a12.dataservices/dataservices-relationship-model-migration` were migrated from CommonJS to [ESM](https://nodejs.org/api/esm.html#modules-ecmascript-modules). When using Node `22.12+` and modern build tools, there should be no changes necessary to your bundler setup. Migrating your own application to ESM is not required, but recommended. Consult the documentation of your bundler for specifics.

##### Updating to ES2024

The javascript output of the npm artifacts was updated from `ES2020` to `ES2024` to be able to use latest language features. When using supported browsers, there is no change necessary. If support for older browsers is required, make sure to include necessary polyfills.

##### Migration to Query API

Successful migration to `2025.06` is dependent on the migration of API (JSON-RPC, Service layer, Extension point), Data (Model, Index structure), Infrastructure (Pods) and Authorization (authorization definitions).
The sections below will address all these in separated sections.

###### Feature Parity

DS aims to provide feature parity for the previous API. To large extend this can be achieved, but there are some exceptions.

###### Facets

Solr offered a rich facet features previously used by the client and engines to assist in query creation. In 2025.06,
a custom DS solution replaces Solr’s facet functionality for generating field-aware operators. This new solution relies
on database aggregation functions, which, while effective, will not provide as many features as the facets in DS 2024.06.
For more details, refer to the [Aggregations](#aggregations) section.

Original LIST\_DOCUMENT query with facets

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 ``` | ``` { 	"jsonrpc": "2.0", 	"id": "FacetQuery", 	"method": "LIST_DOCUMENTS", 	"params": { 		"documentModelName": "BusinessPartnerSuper", 		"filter": { 			"filters": [ 				"BusinessPartnerRoot.Employment.income:[3000 TO 8000]" 			] 		}, 		"facets": [ 			{ 				"id": "max_income", 				"field": "BusinessPartnerRoot.Employment.income", 				"type": "max" 			}, 			{ 				"id": "min_income", 				"field": "BusinessPartnerRoot.Employment.income", 				"type": "min" 			}, 			{ 				"id": "avg_income", 				"field": "BusinessPartnerRoot.Employment.income", 				"type": "avg" 			}, 			{ 				"id": "sum_income", 				"field": "BusinessPartnerRoot.Employment.income", 				"type": "sum" 			} 		] 	} } ``` |
```

QUERY LIST\_DOCUMENT replacement with facet-like functionality

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 ``` | ``` { 	"jsonrpc": "2.0", 	"id": "Facet_Query", 	"method": "QUERY", 	"params": { 		"query": { 			"projectionName": "document", 			"targetDocumentModel": "BusinessPartnerSuper", 			"constraint": { 				"operator": "date_range", 				"field": "/BusinessPartnerRoot/Employment/income", 				"from": "3000", 				"to": "8000" 			}, 			"aggregation": { 				"aggregations": [ 					{ 						"field": "/BusinessPartnerRoot/Employment/income", 						"function": "min", 						"alias": "min_of_income" 					}, 					{ 						"field": "/BusinessPartnerRoot/Employment/income", 						"function": "max", 						"alias": "max_of_income" 					}, 					{ 						"field": "/BusinessPartnerRoot/Employment/income", 						"function": "avg", 						"alias": "avg_of_income" 					}, 					{ 						"field": "/BusinessPartnerRoot/Employment/income", 						"function": "sum", 						"alias": "sum_of_income" 					} 				] 			}, 			"paging": { 				"pageNumber": 0, 				"pageSize": 100 			} 		} 	} } ``` |
```

Range facets are no longer supported. Instead, the `range` operator can be used to filter documents based on a range of values. The range operators are available for all fields that support range queries, such as date and numeric fields. Multiple queries will be needed to achieve the same functionality as range facets. For example, if you want to filter documents based on a date range, you can use the `date_range` operator in the `constraint` of the query.

Multiple queries will also be needed to achieve bucket facets functionality.

###### Pagination

Previously, APIs used paging based on `offset` and `limit`, whereas the `QUERY` operation and its service layer now use paging based on `pageNumber` and `pageSize`. This change aligns the DS with the paging approach used by Spring, making it easier to map results into objects at the repository layer.

The following configuration keys introduce hard limits for loading of documents and links:

1. `mgmtp.a12.dataservices.query.maxLinksSize = 10 000`

   1. Links specified in `links` property are not paged and will be loaded in full, up to the limit specified in this configuration key. The number of links should be restricted by Relationship models to avoid loading too many links being loaded. If there are more links in DB only first links will be loaded and there will be no exception thrown.
2. `mgmtp.a12.dataservices.query.maxQueryDepth = 10`

   1. This configuration key limits the depth of the query. The default value is 10, which means that the query will be limited to 10 levels of depth. This is a hard limit and cannot be changed during query time. If the query definition will specify `maxDepth` above 10, DS will throw an `InvalidInputException` because the query cannot be executed as is.
3. `mgmtp.a12.dataservices.query.pageRequest.pageNumberLimit = 100`

   1. This configuration key limits the maximum page number that can be requested. The default value is 100, which means that the query will be limited to 100 pages. This is a hard limit and cannot be changed during query time. If the query definition will specify `pageNumber` above 100, DS will throw an `InvalidInputException` because the query cannot be executed as is.
4. `mgmtp.a12.dataservices.query.pageRequest.pageSizeLimit = 100`

   1. This configuration key limits the maximum page size that can be requested. The default value is 100, which means that the query will be limited to 100 items per page. This is a hard limit and cannot be changed during query time. If the query definition will specify `pageSize` above 100, DS will throw an `InvalidInputException` because the query cannot be executed as is.

###### Full-text Support

Solr previously offered a flexible stack of analyzers configurable via the `schema.xml` file, allowing customer projects to tailor text analysis to their needs. In 2025.06, the `simple_search` operator now uses a fixed, non-configurable analyzer stack. This means `simple_search` operates only on the original text, not on analyzed fields, and its behavior cannot be changed.

Currently, the `simple_search` operator uses hardcoded regular expressions for matching. Two extension points are planned to increase flexibility:

* Support for custom SQL generation for `simple_search` operator.

  + Note: Implementing this will require a significant rework of `simple_search` operator.
* Option to use PostgreSQL full-text search for `simple_search` queries.

  + This was previously prototyped, but not adopted due to several limitations:

    - PostgreSQL configuration is less flexible than Solr’s; changes require a pod restart and re-indexing. Only a subset of analyzers can be selected, and custom stacks require PostgreSQL extensions.
    - PostgreSQL full-text search only works with text fields, not with serialized dates or numbers, so `simple_search` would not support those field types.
    - PostgreSQL does not support field path-based queries for non-analyzed fields, making it unsuitable for repeatable field queries without major changes to the DS codebase and database schema.

As a result, the `simple_search` operator will return results that differ from full-text searches in the previous `LIST_DOCUMENTS` and `LIST_CDDS` operations. Due to fundamental differences between Solr and PostgreSQL, it is not feasible to replicate the exact previous behavior. For a detailed description of the new behavior, see: [simple\_search operator](#simple-search-operator).

###### CDD Support

CDDs are no longer created as materialized views through asynchronous processes; instead, they are generated at query time. This change has several implications for feature parity:

* There is no longer any logic in DS to compute CDDs during data mutation operations. Dirty documents, queues, and processors have been removed.

  + All document and link changes are immediately reflected in the `cdd` projection.
* There is no need to build or maintain additional indexes.
* CDM models can now be updated at runtime, as security concerns related to ABAC have been resolved. Previously, authorization definitions had to be updated with each CDM because authorization was constructed at the CDM level. In the new version, ABAC is applied bottom-up from the DMs, not from the CDMs.
* Computed fields are not filled automatically.

  + Field computation is an expensive operation and is not performed by default for CDDs. To enable computation for the `cdd` projection, add the CDM model to `mgmtp.a12.dataservices.documents.computation.enabledForModels`. Enabling this will significantly impact performance, as it requires converting JSON to a Kernel Document, applying computation, and serializing back to JSON.

    - Consider whether computed fields are truly needed in overviews, or if computation can be handled on the client side to avoid unnecessary (de)serialization cycles.
* Computed fields in the CDM are not available for constraints or sorting, as they are not present before the query is constructed.

  + Computed fields from underlying DMs are available if they are not transient. This restriction applies only to computed fields defined in the CDM itself, not those from underlying DMs.
* All operators work only on root documents.

  + For example, when using the `simple_search` operator in the constraint of a `cdd` or `document_graph` projection, only fields of the root document model are considered. To search linked documents, use the `has` operator and nest `simple_search` within it for each relevant relationship model.
* Self-referencing relationships are followed only to the first level.

  + To include more levels, please include each level explicitly in the CDM definition.

For more details about these restrictions, see the [CDD Projection](#_cdd_projection) documentation.

Using or operator and has to search in the linkd documents

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 ``` | ``` { 	"jsonrpc": "2.0", 	"id": "FindLudoviciInContractOrInPartner", 	"method": "QUERY", 	"params": { 		"query": { 			"targetDocumentModel": "ContractCDM", 			"projectionName": "document", 			"constraint": { 				"operator": "or", 				"operands": [ 					{ 						"operator": "simple_search", 						"value": "Ludovici" 					}, 					{ 						"operator": "has", 						"relationshipModel": "ContractBusinessPartner", 						"targetRole": "Partner", 						"constraint": { 							"operator": "simple_search", 							"value": "Ludovici" 						} 					} 				] 			}, 			"paging": { 				"pageNumber": 0, 				"pageSize": 100 			} 		} 	} } ``` |
```

In the example above, the term `Ludovici` will be searched in both the `Contract` DM and the `BusinessPartner` DM (for the role `Partner`), which is linked via the `ContractBusinessPartner` relationship. If there are multiple relationships between `Contract` and `BusinessPartner`, each relationship must be specified separately to include it in the search. The same approach applies to the `exact_match` operator or any other operator that needs to evaluate fields outside the root document.

###### Other

* Range search on range fields in repeatable groups now returns a document if for one of the members of the group the date range lies inside the queried range (With Solr the ranges of all members of the group had to lie inside the queried range)

###### Data Migration

###### Model Migration

There are no model changes needed to start the application but there are some changes that will be needed to be done in the customer projects to make sure that the application works as expected.

1. Annotations `enable_approximate_match_search` and `enable_case_insensitive_search` are no longer required by DS

   1. Annotations are still being used by overview engine. Therefore, they should not be removed if you are using overview engine. This means that the change of these annotations does not require reindexing of the documents anymore.
2. All fields of all models are automatically added to the index. The customer projects will however need to identify fields that are not needed during querying and remove them from the index but using annotation with the `indexed=false`.

   1. Note that `indexed` annotations in CDMs will be ignored. However, all fields of DMs that participate in the CDM must be indexed.
   2. Every field that will be removed will not be available to be used in `constraint` or `fields` property of the query. These fields can still be loaded if the load of complete documents is selected.

      1. Fields containing huge text and repeatable fields which are not used are good candidates for being removed by `indexed` annotation. For more information please see [model-ability section](#_model_ability) in the documentation.
3. DMs with the suffix `__generated`, which were previously used to construct responses for `LIST_LINKS` and `LIST_CANDIDATES`, are no longer required by DS.

   1. Relationship engine is still using these models and SME still supports generation of those models. DS just has no code anymore bound to those models so they can be changed during runtime.
4. CDMs can be changed during runtime, as there are no security issues related to authorization definitions anymore. This means that the CDM can be changed without reindexing the documents.

###### Data Migration

The documents and links can be used without any changes. The data migration is not needed to start the application. However, there are some changes that will be needed to be done in the customer projects to make sure that the application works as expected.

The index needs to be reconstructed using the following configuration properties:

* `mgmtp.a12.dataservices.query.reindexing.applyToModels`: A list of model names to which the reindexing operation will be applied.
* `mgmtp.a12.dataservices.query.reindexing.batchSize`: Number of documents to reindex in a single batch.
* `mgmtp.a12.dataservices.query.reindexing.ignoreErrors`: A switch to allow ignoring errors during re-indexing
* `mgmtp.a12.dataservices.query.reindexing.mode`

  + `DISABLED (default)`: Re-indexing is disabled.
  + `INDEX_NEW_ONLY`: Indexes only the documents that have not been indexed yet.
  + `REBUILD_INDEX`: Rebuilds the index for all documents, regardless of whether they have been indexed before.
* `mgmtp.a12.dataservices.query.reindexing.numberOfThreads`: Number of threads to use for reindexing.

Re-indexing should only be called from init app or during the application initialization (if not run in cluster mode). There is no API to call re-indexing from the client side. The re-indexing will be done automatically during the application initialization if the `mgmtp.a12.dataservices.query.reindexing.mode` is set to `REBUILD_INDEX` or `INDEX_NEW_ONLY`.

Reindexing is a heavy operation that can take some time to finish. The performance is comparable to previous version of DS, but it is recommended to run reindexing in a separate pod (init-app) to avoid performance issues during the application startup.

For more info please see [query configuration](#query-configuration) section in the documentation.

###### API Migration

###### JSON-RPC Migration

The following operations have been dropped from support in 2025.06:

1. `LIST_DOCUMENTS`
2. `LIST_CDDS`
3. `LIST_LINKS`
4. `LIST_CANDIDATES`
5. `LIST_TERMINATING_LINKS`
6. `LOAD_DOCUMENT_GRAPH`

Examples of the changes are below.

###### LIST\_DOCUMENTS

Original LIST\_DOCUMENT query

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 ``` | ``` { 	"jsonrpc": "2.0", 	"id": "listContracts", 	"method": "LIST_DOCUMENTS", 	"params": { 		"documentModelName": "Contract", 		"filter": { 			"filters": [ 				"ContractRoot.ContractValue:100", 				"-ContractRoot.CostToCustomer:0" 			], 			"lang": "de" 		}, 		"sort": [ 			{ 				"order": "ContractRoot.ContractValue DESC", 				"lang": "en" 			} 		], 		"page": { 			"offset": 0, 			"limit": 20 		} 	} } ``` |
```

QUERY LIST\_DOCUMENT replacement

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 ``` | ``` { 	"jsonrpc": "2.0", 	"id": "LIST_DOCUMENTS_REPLACEMENT", 	"method": "QUERY", 	"params": { 		"targetDocumentModel": "Contract", 		"projection" : "document", 		"constraint": { 			"operator": "and", 			"operands": [ 				{ 					"operator": "exact_match", 					"field": "/ContractRoot/ContractValue", 					"value": 100 				}, 				{ 					"operator": "not", 					"operand": { 						"operator": "exact_match", 						"field": "/ContractRoot/CostToCustomer", 						"value": 0 					} 				} 			] 		}, 		"paging": { 			"pageNumber": 1, 			"pageSize": 20 		}, 		"sort": [ 			{ 				"direction": "DESC", 				"field": "/ContractRoot/ContractValue", 				"ignoreCase": false, 				"nullHandling": "NULLS_LAST" 			} 		] 	} } ``` |
```

###### LIST\_LINKS

The query does not return links in the format defined by the `__generated` DM. If the client requires this specific format, it must be constructed on the client side using the query result.

LIST\_LINKS did not support constraints or sort definitions.

Original LIST\_LINKS query

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 ``` | ``` { 	"jsonrpc": "2.0", 	"id": "assignedBusinessPartnersOfContracts", 	"method": "LIST_LINKS", 	"params": { 		"source": { 			"relationshipModel": "PolicyHolder", 			"role": "Partner", 			"docRef": "BusinessPartner/24" 		}, 		"page": { 			"offset": 0, 			"limit": 20 		} 	} } ``` |
```

QUERY LIST\_LINKS replacement

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 ``` | ``` [ 	{ 		"jsonrpc": "2.0", 		"id": "LIST_LINKS_REPLACEMENT", 		"method": "QUERY", 		"params": { 			"targetDocumentModel": "BusinessPartner", 			"projection" : "document", 			"exclude": true, 			"constraint": { 				"operator": "exact_match", 				"field": "/__meta/docRef", 				"value": "BusinessPartner/24" 			}, 			"links" : [ 				{ 					"relationshipModel": "PolicyHolder", 					"targetRole": "Contract" 				} 			], 			"paging": { 				"pageNumber": 1, 				"pageSize": 20 			}, 			"sort": [ 				] 		} 	} ] ``` |
```

###### LIST\_CANDIDATES

The query does not return links in the format defined by the `__generated` DM. If the client requires this specific format, it must be constructed on the client side using the query result.

Original LIST\_CANDIDATES query

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 ``` | ``` { 	"jsonrpc": "2.0", 	"id": "PolicyHolderCandidatesForContract", 	"method": "LIST_CANDIDATES", 	"params": { 		"source": { 			"relationshipModel": "PolicyHolder", 			"role": "Contract", 			"docRef": "Contract/32418" 		}, 		"filter": { 			"filters": [ 				"ContractRoot.ContractValue:100", 				"-ContractRoot.CostToCustomer:0" 			], 			"lang": "de" 		}, 		"sort": [ 			{ 				"order": "ContractRoot.ContractValue DESC", 				"lang": "en" 			} 		], 		"page": { 			"offset": 0, 			"limit": 20 		} 	} } ``` |
```

QUERY LIST\_CANDIDATES replacement

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 ``` | ``` { 	"jsonrpc": "2.0", 	"id": "LIST_CANDIDATE_REPLACEMENT", 	"method": "QUERY", 	"params": { 		"targetDocumentModel": "BusinessPartner", 		"projection" : "document", 		"links": [ 			{ 				"relationshipModel": "PolicyHolder", 				"targetRole": "Contract", 				"constraint" : { 					"operator": "and", 					"operands": [ 						{ 							"operator": "exact_match", 							"field": "/__meta/docRef", 							"value": "Contract/32418" 						}, 						{ 							"operator": "exact_match", 							"field": "/ContractRoot/ContractValue", 							"value": 100 						}, 						{ 							"operator": "not", 							"operand": { 								"operator": "exact_match", 								"field": "/ContractRoot/CostToCustomer", 								"value": 0 							} 						} 					] 				} 			} 		], 		"paging": { 			"pageNumber": 1, 			"pageSize": 20 		}, 		"sort": [ 			{ 				"direction": "DESC", 				"field": "/BusinessPartnerRoot/Employment/income", 				"nullHandling": "NULLS_LAST" 			} 		] 	} } ``` |
```

###### LIST\_CDDS

Original LIST\_CDDS query

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 ``` | ``` { 	"jsonrpc": "2.0", 	"id": "listContractsWithBusinessPartners", 	"method": "LIST_CDDS", 	"params": { 		"cdm": "ContractCDM", 		"filter": { 			"filters": [ 				"ContractRoot.ContractValue:100", 				"-ContractRoot.CostToCustomer:0" 			], 			"lang": "de" 		}, 		"sort": [ 			{ 				"order": "ContractRoot.ContractValue DESC", 				"lang": "en" 			} 		], 		"page": { 			"offset": 0, 			"limit": 20 		} 	} } ``` |
```

QUERY LIST\_CDDS replacement

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 ``` | ``` [ 	{ 		"jsonrpc": "2.0", 		"id": "LIST_CDD_REPLACEMENT", 		"method": "QUERY", 		"params": { 			"query": { 				"projectionName": "cdd", 				"targetDocumentModel": "ContractCDM", 				"constraint": { 					"operator": "and", 					"operands": [ 						{ 							"operator": "exact_match", 							"field": "/ContractRoot/ContractValue", 							"value": 100 						}, 						{ 							"operator": "not", 							"operand": { 								"operator": "exact_match", 								"field": "/ContractRoot/CostToCustomer", 								"value": 0 							} 						} 					] 				}, 				"paging": { 					"pageNumber": 0, 					"pageSize": 20 				}, 				"sort": [ 					{ 						"direction": "DESC", 						"field": "/ContractRoot/ContractValue", 						"ignoreCase": false, 						"nullHandling": "NULLS_LAST" 					} 				] 			} 		} 	} ] ``` |
```

###### LIST\_TERMINATING\_LINKS

Original LIST\_TERMINATING\_LINKS query

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` {   "jsonrpc": "2.0",   "id": "ListRoots",   "method": "LIST_TERMINATING_LINKS",   "params": {     "relationshipModelName": "ProductTree",     "terminatingRoleName": "Parent"   } } ``` |
```

QUERY LIST\_TERMINATING\_LINKS replacement

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 ``` | ``` {   "jsonrpc": "2.0",   "id": "LIST_TERMINATING_LINKS_REPLACEMENT",   "method": "QUERY",   "params": {     "query": {       "projectionName": "document",       "targetDocumentModel": "ProductTree",       "constraint": {         "operator": "and",         "operands": [           {             "operator": "has",             "relationshipModel": "ProductTree",             "targetRole": "Child"           },           {             "operator": "not",             "operand": {               "operator": "has",               "relationshipModel": "ProductTree",               "targetRole": "Parent"             }           }         ]       },       "links": [         {           "relationshipModel": "ProductTree",           "sourceRole": "Parent"         }       ],       "paging": {         "pageNumber": 0,         "pageSize": 100       }     }   } } ``` |
```

###### LOAD\_DOCUMENT\_GRAPH

Original LOAD\_DOCUMENT\_GRAPH query

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` {   "jsonrpc": "2.0",   "id": "LoadDocumentGraph",   "method": "LOAD_DOCUMENT_GRAPH",   "params": {     "cdm": "ContractCDM",     "docRef": "Contract/169c57d2-ad32-4bf8-b533-c108c0f5c6cf",     "path" : "/ContractBusinessPartner"   } } ``` |
```

QUERY LOAD\_DOCUMENT\_GRAPH replacement

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 ``` | ``` [   {     "jsonrpc": "2.0",     "id": "LOAD_DOCUMENT_GRAPH_REPLACEMENT",     "method": "QUERY",     "params": {       "query": {         "projectionName": "document-graph",         "targetDocumentModel": "ContractCDM",         "fields": ["/ContractBusinessPartner"],         "constraint" : {           "operator": "exact_match",           "field": "/__meta/docRef",           "value": "Contract/169c57d2-ad32-4bf8-b533-c108c0f5c6cf"         },         "paging": {           "pageNumber": 0,           "pageSize": 1         }       }     }   } ] ``` |
```

###### Service Layer Migration

`QueryService` is the only public and secure way to access data from the DS. While it is possible to use the repository layer, it does not offer the following features:

1. **Query capabilities**: Access via the repository layer is based solely on the identification of the entity (e.g., `docRef`, `id`), without support for complex queries.
2. **Authorization**: The repository layer assumes that security has already been applied, so it does not enforce authorization again.
3. **Heterogeneity support**: The repository layer requires final DMs to be provided, rather than abstract, higher-level DMs.
4. **Extension points**: Some extension points are exposed by the repository layer, but those published by the `QueryService` are not.

As a result, the following APIs will be removed and replaced by `QueryService`:

1. Package `com.mgmtp.a12.dataservices.search`: This package supports legacy APIs built on Solr.
2. `CddQueryService`: Dependent on Solr, this service will be removed.
3. `DocumentQueryService`: Previously provided authorization and heterogeneity support to `SearchService`, but will now be replaced by `QueryService`.
4. `load` methods in `RelationshipLinkService`: All `load` methods will be removed.
5. `CddDirtyDocumentsJmsConsumer`: There will be no queue or asynchronous processing of CDDs, so this service will be removed.
6. `DocumentGraphService`: This service was only used in the `LOAD_DOCUMENT_GRAPH` operation and will be removed.

###### QueryRepository

DS provides the `QueryRepository`, which directly transforms the current state of the query into SQL statements and executes them. This API does not perform Projection preprocessing and postprocessing, Validation, Authorization, or Enrichment. As such, it should be used with caution to ensure it is not accessed from secured contexts.

The primary purpose of the `QueryRepository` API is to offer querying capabilities for jobs or other processes that do not require an authorized user. Because it bypasses security checks, it is critical to ensure that it is only used in trusted, non-sensitive environments.

Please keep in mind that `QueryRepository` does not support projections since it is resolved in `QueryService` only. The result set will always contain all indexed fields for a loaded document. Projection `postprocess` method would have to be called explicitly if needed.

###### Extension Point Migration

The `QUERY` operation replaces the following APIs: `LIST_DOCUMENTS`, `GET_DOCUMENT`, `LIST_CDDS`, `LIST_LINKS`, `LIST_CANDIDATES`, `LIST_TERMINATING_LINKS`, and `LOAD_DOCUMENT_GRAPH`. While the extension points from these operations have been removed, their use cases are still supported. The following section details how extension points are replaced or modified in the new `QUERY` operation.

There are several important changes every project should be aware of:

1. **Query results are now included in most event payloads instead of full documents.** Full documents are only present if the query uses a projection that loads complete documents. Otherwise, events will contain partial documents.

   1. The `cdd` projection never loads full documents, while the `document-graph` projection always does.
   2. The `document` projection loads full documents only if the `fields` property is not set in the query.
2. **Not all events are published for every query.** For example, `DocumentAfterRepositoryLoadEvent` and `DocumentAfterLoadEvent` are only published for queries that load complete documents via projection.

   1. These events are required for document decryption when loading full documents. Document fragments in the `document_fields` and `document_search` index tables are stored unencrypted, so these events are not needed in those cases.
3. **Single events now cover multiple use cases.** For instance, `QueryBeforeOperationEvent` is published for all queries, not just for `LIST_DOCUMENTS` or `LIST_CDDS`.

   1. Event listeners must determine the query type and decide when to handle or ignore the event.

###### GET\_DOCUMENT Extension Points

Event `GetDocumentBeforeEvent` contained just a `DocumentReference` of the document to be loaded. This event will be replaced by `QueryBeforeOperationEvent` which will have Query as payload. This event will be published for all queries in DS. Query can be modified by a modification of the payload of the event.

Events `DocumentAfterRepositoryLoadEvent` and `DocumentAfterLoadEvent` will still be published for the queries with projection to load complete documents. Queries that use `fields` property or `cdd` projection will load the data from the index tables (`document_fields` and `document_search`) and will not publish these events.

Event `DocumentAfterLoadEvent` is replaced by `QueryAfterOperationEvent` which contains full query and result of the query. This event can still modify query result.

###### LIST\_DOCUMENTS Extension Points

Event `ListDocumentsBeforeEvent` is replaced by `QueryBeforeOperationEvent`.

Event `DocumentAfterRepositoryLoadEvent` will still be published for the queries with projection to load complete documents.

New event `QueryAfterOperationEvent` will be published after execution and before JSON-RPC Operation returns the result.

###### LIST\_CDDS Extension Points

Event `CddsAfterLoadByQueryEvent` contained loaded CDDs. This event is replaced by `QueryAfterOperationEvent` which also contain the loaded CDDs.

Additionally `QueryBeforeOperationEvent` is now published for LIST\_CDDS use-cases

###### LIST\_LINKS Extension Points

Operation `LIST_LINKS` did not publish any link-specific events, only the document events when the documents are loaded.

Events `DocumentAfterRepositoryLoadEvent` and `DocumentAfterLoadEvent` will still be published for the queries with projection to load complete documents. Queries that use `fields` property or `cdd` projection will load the data from the index tables (`document_fields` and `document_search`) and will not publish these events

New `QueryBeforeOperationEvent` and `QueryAfterOperationEvent` events will be published for this case.

###### LIST\_TERMINATING\_LINKS Extension Points

Operation `LIST_TERMINATING_LINKS` did not publish any link-specific events, only the document events when the documents are loaded.

Events `DocumentAfterRepositoryLoadEvent` and `DocumentAfterLoadEvent` will still be published for the queries with projection to load complete documents. Queries that use `fields` property or `cdd` projection will load the data from the index tables (`document_fields` and `document_search`) and will not publish these events

New `QueryBeforeOperationEvent` and `QueryAfterOperationEvent` events will be published for this case.

###### LIST\_CANDIDATES Extension Points

Operation `LIST_CANDIDATES` did not publish any link specific events, only the document events when the documents are loaded.

Events `DocumentAfterRepositoryLoadEvent` and `DocumentAfterLoadEvent` will still be published for the queries with projection to load complete documents. Queries that use `fields` property or `cdd` projection will load the data from the index tables (`document_fields` and `document_search`) and will not publish these events

New `QueryBeforeOperationEvent` and `QueryAfterOperationEvent` events will be published for this case.

###### LOAD\_DOCUMENT\_GRAPH Extension Points

Operation `LOAD_DOCUMENT_GRAPH` did not publish any link specific events, only the document events when the documents are loaded.

Events `DocumentAfterRepositoryLoadEvent` and `DocumentAfterLoadEvent` will still be published for the queries with projection to load complete documents. Queries that use `fields` property or `cdd` projection will load the data from the index tables (`document_fields` and `document_search`) and will not publish these events

New `QueryBeforeOperationEvent` and `QueryAfterOperationEvent` events will be published for this case.

Event `LoadDocumentGraphAfterEvent` is no longer published. Its responsibilities (post-load cleanup or pruning of loaded data) are now handled by `QueryAfterOperationEvent`. To influence a `document-graph` or `cdd` projection **before** execution, define the `links` section explicitly in the query. If omitted, DS auto-populates `links` during preprocessing. Providing `links` manually enables you to:

* Omit entire relationship groups you do not need
* Add constraints to specific links to reduce result size
* Limit traversal depth and improve performance

This approach offers equal or greater control than the removed `LoadDocumentGraphAfterEvent`. DS does not validate that provided `links` match the CDM definition; correctness of the query remains the client’s responsibility.

###### Other Changes in Events

DS sometimes needs to execute a query to check permissions. For example to check if the user is allowed to load an attachment we need to try to load a document. If the query returns empty result, the document is either not present or the user is not allowed to load it. In this case, the `QueryBeforeOperationEvent`, `QueryBeforeOperationEvent` , `DocumentAfterRepositoryLoadEvent` and `DocumentAfterLoadEvent` events will not be published but `QueryAfterPostProcessPhaseEvent` will be published instead.

###### Solr Related Typescript Removal

* Namespace `Facets` and interface `LinkWithDocumentResultSet`, `CandidateResultSet` in `typescript/dataservices-access/src/json-rpc/index.ts` will be removed.
* Namespace `DocumentGraph`, `ExportListComposedDataDocumentsJsonRpc2Response`, `ListComposedDataDocumentsJsonRpc2Response`, `ListDocumentsJsonRpc2Response` in `typescript/dataservices-access/src/Document/index.ts` will be removed.
* Interface `ListDocumentsJsonRpc2Request`, `ListComposedDataDocumentsJsonRpc2Request`,`ExportListComposedDataDocumentsJsonRpc2Request`, `LoadDocumentGraphJsonRpc2Request`, `ListDocumentsJsonRpc2Response`, `LoadDocumentGraphJsonRpc2Response`, `ListComposedDataDocumentsJsonRpc2Response`, `ExportListComposedDataDocumentsJsonRpc2Response` will be removed.

All above namespaces and interfaces are removed without replacement, please consider using `Query/api` for query documents and cdds with [projections](#projection) `document`, `cdd`, `document-graph`, `exportCddCsv` for feature parity.

###### Remaining Migrations

1. Solr is no longer required for any DS functionality. If you’re not using it, you can safely remove Solr from your infrastructure.

   1. Zookeeper was needed by Solr only. For this reason it can be safely removed from your infrastructure as well.
2. JMS is also no longer needed for any DS functionality. You can remove JMS implementations (such as Artemis, ActiveMQ, etc.) from your infrastructure if they are not in use.

   1. A12 Workflows component still relies on JMS. Make sure you do not remove any infrastructure that is required for its proper functionality.
3. Oracle and H2 databases are no longer supported. For local development, please switch to using embedded or local **PostgreSQL**.
4. However, Data Services will not force clients to have a local PostgreSQL database. We have already provided new profiles, `dataservices-embedded_postgres` and `contentstore-embedded_postgres`, for use with embedded PostgreSQL. For more detail, please view [Embedded Postgres Profile](#spring-profile-dataservices-embedded_postgres)
5. For ContentStore you can continue use H2 database.
6. Since `LIST_LINKS` and `LIST_DOCUMENTS` are dropped, the `dataservices-skip_non_loadable` profile is removed.

###### Authorization

The option to skip non-loadable documents is removed, as this will become the default behavior. Document loading failures will no longer abort the query if the document is to be loaded additionally via projection.

The `DOCUMENT_READ` authorization scope will be replaced by a repository access alternative `QUERY`, as there will no longer be an API for securely loading documents from DS that bypasses the `QueryService`. `DocumentService#load` is using `QueryService` internally, so it will not be affected by this change.

A new authorization scope `Query` is introduced, but it will only serve as a repository access scope since there will be no direct, secure load of a single document. This scope will be used to inject authorization operators into the query. The resource of the `Query` is String reference to base Document Model similarly as it was before for `Document List` scope from previous releases.

All existing repository policies should be rewritten to use the `Query` scope instead of the `Document List` scope. The resource of the `Query` scope will be the name of the base Document Model, which is used in the query. This means that all queries will be authorized based on the base Document Model.

This also means that DS will silently return an empty result if the user has no access right to any of the subtypes of an abstract model (No return code 403 will be given).

Also in case of missing access right to the target document model of a query, DS will not return code 403 anymore but provide a `QueryValidationException` with message `Access Denied`.

Repository policy in 2024.06 (37.2 and earlier)

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` { 	"name": "Location in Brno", 	"description": "Checks if the address is not in Hamburg", 	"target": "#resource == Address", 	"templates": [ 		"'-AddressRoot.city:Hamburg'" 	] } ``` |
```

The repository policy from the version above will be rewritten to the following policy in 2025.06:

Repository policy in 2025.06

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 ``` | ``` { 	"name": "Location in Brno", 	"description": "Checks if the address is not in Hamburg", 	"target": "#resource == 'Address'", 	"templates": [ 		{ 			"operator": "not", 			"operand": { 				"operator": "exact_match", 				"field": "/AddressRoot/City", 				"value": "Hamburg" 			} 		} 	] } ``` |
```

Policies bound to the `Document Read` scope can be dropped because they are not used anymore.

Each time the model changes (either directly or via the `has` operator), the authorization resources will remain the same, based on the Data Model (DM), in a manner consistent with previous implementations.

For more info please see `example-abac` profile in our example modules which shows how to use the new `Query` scope in the repository policies.

###### Other Scope Changes

The `Document Create` scope now uses `DocomentV2` as `#resource` instead of `IDocument`.

For more details, please refer to [DocumentV2 section](https://geta12.com/docs/kernel/kernel-documentation-dev/index.html#document_api_v2_java) in A12 Kernel documentation.

All other scopes should remain unchanged.

###### Removal of Solr

###### Modules Changes

* `dataservices-cdd-job` has been removed. There is no asynchronous CDD processing anymore. CDDs are constructed during query-time.

  + All configuration, classes, and tests have been removed.

###### Infrastructure

* JMS configuration and all consumers have been removed. There is no JMS communication anymore.

  + `CddDirtyDocumentsJmsConsumer` has been removed without replacement.

###### PostgreSQL pod

PostgreSQL will now resolve all the queries in the system which means that resources allocated to the Solr should be now moved to PostgreSQL for better performance.

1. **Disc Space:** PostgreSQL pod will now require roughly 3-4 times more disc space than in the previous DS version. The disc space needed is related to the size of the documents table and to the number of fields indexed. The more fields are removed, the less disc space will be needed. Most of this disc space will be consumed during re-indexing because we create temp tables for better performance.
2. **Memory Usage:** PostgreSQL might need more memory if the result sets which are returned by queries are bigger (in 10 000s). Larger result sets will mean slower queries regardless of the memory assigned, so the aim should be to provide more fine-grained queries. If this cannot be avoided more memory might avoid swapping to file system which would slow down queries even further.
3. **CPU usage:** How much CPU will be needed by PostgreSQL is hard to answer because it is dependent on number of links, number and size documents and their indexed fields and the queries that will be executed. PostgreSQL will ,however, require more CPU than in previous releases. Please monitor CPU usage of PostgreSQL in your pre-production environments and see if you need more.

For more information about fine-tuning performance please see our regular documentation section on DB performance optimizations.

###### Dependencies Changes

* `org.apache.solr:solr-solrj` and `org.apache.solr:solr-core` dependencies have been removed. Both dependencies brought into DS a lot of transitive dependencies which have been dropped as well. The customer projects should not depend on those transitive dependencies without declaring them explicitly.
* `jakarta.jms:jakarta.jms-api`, `org.apache.activemq:artemis-jakarta-client` and `org.apache.activemq:artemis-jakarta-server` dependencies have been removed.

  + These dependencies brought into DS a lot of transitive dependencies which have been dropped as well. The customer projects should not depend on those transitive dependencies without declaring them explicitly.

###### API Changes

* `DocumentQueryService` has been removed, please use `QueryService` instead. The parameters and return types for the methods of the classes are so different that it is not possible to provide rewrite rule. For more information how to migrate from `DocumentQueryService` to `QueryService` please refer to the Query API migration guide.
* `CddQueryService` Has been removed, please use `QueryService` instead. For more information how to migrate from `CddQueryService` to `QueryService` please refer to the Query API migration guide.
* `SearchService` has been removed, please use `QueryRepository` instead. The parameters and return types for the methods of the classes are so different that it is not possible to provide rewrite rule. For more information how to migrate from `SearchService` to `QueryRepository` please refer to the Query API migration guide.
* All API used in `SearchService`, `DocumentQueryService` and `CddQueryService` have been removed as well. The new Query API has different parameters which will be described in the migration of Query API as well as in the regular documentation.

  + `IndexDocument`, `QueryResult`, `SearchConstants`, `SearchUtils`, `CddDirtyDocumentsJmsConsumer`
  + `SearchConstants` constants have been moved to
  + `IndexInitializer`, `SearchIndexLoader` and `SearchInitializer` have been removed. There is no direct replacement because the Query API no longer requires a separate reindexing call. To update documents, please use `DocumentService#update`

    - To trigger re-indexing from a custom call please use `QueryIndexManager`. Index is always automatically updated when using `DocumentService` therefore it should not be needed to call `QueryIndexManager` directly.

###### Configuration Changes

* All configuration keys starting with prefix `mgmtp.a12.dataservices.search` are removed.

  + `mgmtp.a12.dataservices.search.analysis.fullText.escapeSpecialCharacters.enabled`: all special characters are searchable now directly using `SIMPLE_SEARCH` operator. There is no pre-processing of input
  + `mgmtp.a12.dataservices.search.analysis.fullText.filterFallback.enabled`: there is no fallback available anymore. For simple search feature in multiple fields please use `fields` property of `SIMPLE_SEARCH` for exact matches please use `EXACT_MATCH` operator, and for ranges please use dedicated range operator.
  + `mgmtp.a12.dataservices.search.analysis.fullText.ngrams.enabled` : `SIMPLE_SEARCH` operator allows by default searching by substrings of length greater than 2.
  + `mgmtp.a12.dataservices.search.facet.stats.defaultPrecision` please use `mgmtp.a12.dataservices.query.aggregation.defaultPrecision` instead.
  + `mgmtp.a12.dataservices.search.index.initialization.mode`: Please use `mgmtp.a12.dataservices.query.reindexing.mode` instead.
  + `mgmtp.a12.dataservices.search.paging.documents.offsetLimit`: Please use `mgmtp.a12.dataservices.query.pageRequest.pageNumberLimit` instead.
  + `mgmtp.a12.dataservices.search.paging.documents.pageLimit`: Please use `mgmtp.a12.dataservices.query.pageRequest.pageSizeLimit` instead.
  + `mgmtp.a12.dataservices.search.paging.facets.offsetLimit`
  + `mgmtp.a12.dataservices.search.paging.facets.pageLimit`: Please use `mgmtp.a12.dataservices.query.aggregationListSize` instead.
  + `mgmtp.a12.dataservices.search.paging.links.offsetLimit` Limit is unrestricted if `exclude` is not set, Otherwise `mgmtp.a12.dataservices.query.pageRequest.pageNumberLimit` is used.
  + `mgmtp.a12.dataservices.search.paging.links.pageLimit`: Limit is unrestricted if `exclude` is not set, Otherwise `mgmtp.a12.dataservices.query.pageRequest.pageSizeLimit` is used. Please see related configuration `mgmtp.a12.dataservices.query.maxLinksSize` for max number of links allowed to be returned.
  + `mgmtp.a12.dataservices.search.solr.cloud.enabled` Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.search.solr.collection.name` Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.search.solr.commitPerUpdate.enabled` Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.search.solr.embedded.enabled` Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.search.solr.embedded.inMemory` Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.search.solr.embedded.location`: Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.search.solr.initialization.batchSize`: Please use `mgmtp.a12.dataservices.query.reindexing.batchSize` instead.
  + `mgmtp.a12.dataservices.search.solr.initialization.commitBypass.enabled`: Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.search.solr.parallelUpdates.enabled`: Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.search.solr.timeout.connection`: Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.search.solr.timeout.socket`: Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.search.solr.urls`: Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.search.solr.zookeeper.enabled`: Zoopeker is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.search.solr.zookeeper.hosts`: Zoopeker is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.search.solr.zookeeper.root`: Zoopeker is not used anymore. This property is not used.
* All configuration keys starting with prefix `mgmtp.a12.dataservices.cdd` are removed.

  + `mgmtp.a12.dataservices.cdd.dirtyDocuments.async.consumer.enabled`: CDDs are not processed asynchronously anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.dirtyDocuments.async.producer.enabled`: CDDs are not processed asynchronously anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.dirtyDocuments.dirtyDocumentsQueue`: CDDs are not processed asynchronously anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.dirtyDocuments.sync.enabled`: CDDs are not processed asynchronously anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.model.modificationAfterInitialization.enabled`: CDM models can be changed during run-time now because there are no security issues anymore related to authorizationDefinitions. This property is not used anymore. For more info please see Query API migration notes, subsection Authorization
  + `mgmtp.a12.dataservices.cdd.solr.cloud.enabled`: Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.solr.collection.name`: Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.solr.commitPerUpdate.enabled`: Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.solr.embedded.enabled`: Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.solr.embedded.inMemory`: Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.solr.embedded.location`: Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.solr.initialization.batchSize`: CDDs are not redundantly indexed anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.solr.initialization.commitBypass.enabled`: Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.solr.parallelUpdates.enabled`: Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.solr.timeout.connection`: Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.solr.timeout.socket`: Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.solr.urls`: Solr is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.solr.zookeeper.enabled`: Zoopeker is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.solr.zookeeper.hosts`: Zoopeker is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.cdd.solr.zookeeper.root`: Zoopeker is not used anymore. This property is not used.
  + `mgmtp.a12.dataservices.documents.computation.enabledForModels`: In previous version, this property was used for applying computation to CDD while indexing to Solr, Solr is not used anymore, this property is now used for applying computation to CDD in `cdd` projection post-processing, this means computed fields will not be accepted in the queries because their content will be computed after the result is retrieved from DB. (No usage in the constraints or sort definitions is allowed for computed fields in CDMs only)
  + `mgmtp.a12.dataservices.jsonRpc.listDocuments.additionalReadScopeCheck.enabled`: `LIST_DOCUMENTS` operation is removed, This property is not used.
  + `mgmtp.a12.dataservices.jsonRpc.listDocuments.skipNonLoadableDocuments.enabled`: `LIST_DOCUMENTS` operation is removed, This property is not used.
  + `mgmtp.a12.dataservices.jsonRpc.listLinks.skipNonLoadableLinkDocuments.enabled`: `LIST_LINKS` operation is removed, This property is not used.
  + `mgmtp.a12.dataservices.jsonRpc.listLinks.skipNonLoadableTerminatingLinkDocuments.enabled`: `LIST_LINKS` operation is removed, This property is not used.
  + All `ContentStore` related configuration properties are now exposed to the actuator endpoint

###### Bean Configuration Classes

* The following bean configuration classes have been removed since the beans they configure have been removed:

  + `CddConfiguration`
  + `AbstractCddDirtyDocumentsCondition`
  + `CddDirtyDocumentsConsumerCondition`
  + `CddDirtyDocumentsJmsConsumerCondition`
  + `CddDirtyDocumentsManagerCondition`
  + `OnCddSupportEnableCondition`
  + `AbstractSolrClientCondition`
  + `CloudSolrClientCondition`
  + `EmbeddedSolrCondition`
  + `SolrClientCondition`
  + `ZookeeperSolrClientCondition`
* `ServerApplication` does not enable JMS by default.

###### Endpoints Removed

* `/actuator/cddDirtyDocuments` has been removed. There is no CDD processing anymore.

  + `DirtyDocumentsEndpoint` class was providing this feature and has been removed as well.

###### Event Listener

All related events `DocumentAfterLoadEvent`, `DocumentBeforeCreateEvent`, `DocumentBeforeDeleteEvent`, `DocumentBeforeUpdateEvent` will contain `DocumentV2` object instead of `IDocument`
Because of `DocumentV2` is immutable we add new setter method for `DocumentAfterLoadEvent`, `DocumentBeforeCreateEvent`, `DocumentBeforeUpdateEvent` in case you want to update document content.

* DocumentBeforeCreateEvent add `setCreatedDocument(DocumentV2 createdDocument)` method.
* DocumentBeforeUpdateEvent add `setPersistedDocument(DocumentV2 persistedDocument)`, `setUpdatedDocument(final DocumentV2 updatedDocument)` methods.
* DocumentAfterLoadEvent add `setDocument(DocumentV2 document)` method.
* DocumentBeforeDeleteEvent add `setPersistedDocument(DocumentV2 document)` method.

Drop `IDocumentSearchService#getDocumentSearchService()` because with DocumentV2, we can get and set value for document directly.

###### Authorization

The `Document Create` scope now uses `DocomentV2` as `#resource` instead of `IDocument`.

The `DOCUMENT_READ` permission will be dropped. Please use `QUERY` permission with resource document model instead.

For more details, please refer to [DocumentV2 section](https://geta12.com/docs/kernel/kernel-documentation-dev/index.html#document_api_v2_java) in A12 Kernel documentation.

##### Upgrade to DocumentV2

###### Public Api

Data Services has been upgraded to use `DocumentV2` from Kernel. We have migrated all public APIs from `IDocument` to `DocumentV2` and removed all related `IDocument` dependencies.

In the classes below, all method related to `IDocument` will be changed to `DocumentV2`

* DocumentService
* DocumentSupport
* IDocumentRepository
* DataServicesDocument
* DocumentMapper
* IDataServicesDocumentMetadataExtractor
* DataServicesDocumentFactory
* DataServicesDocumentMetadata
* DocumentUpdateResource
* DocumentPermissionEvaluator

##### Other Breaking changes

###### Behavior change

###### ResourcePatternResolver

Internal primary bean override of ResourcePatternResolver is removed, so default Spring Boot bean is in charge of resolving resources.

This has an impact on ModelGraphGenerator who doesn’t accept wildcards in filesystem paths now.
Instead of specifying `file:/path/to/models/*/.json` you can simply specify just `file:/path/to/models/` and all `*.json` files will be processed recursively.

Pattern resolver has no tweaks anymore, so it requires a scheme at the beginning of resource path. Instead of `/path/to/resource` you must specify `file:/path/to/resource`.

###### RelationshipModelSerializer

The class `RelationshipModelSerializer` was replaced by an interface of the same name. Implementation is not public anymore.

##### Removal of Deprecated Code

* All classes related to document metadata migration step are removed:

  + com.mgmtp.a12.dataservices.migration.DocumentMetadataMigrationStep
  + com.mgmtp.a12.dataservices.migration.DocumentMetadataMigrationStepConfiguration
  + com.mgmtp.a12.dataservices.migration.IDocumentMetadataMigrator
  + com.mgmtp.a12.dataservices.autoconfigure.MigrationStepsConfiguration

###### Redundant Constructors

Please use remaining constructors in the classes where deprecated constructors have been removed.

Constructors removed from the following classes:

* `ContentStorePrivateClient`
* `ContentStoreErrorHandler`
* `AttachmentAfterCreateEvent`
* `AttachmentBeforeCreateEvent` redundnat properties were also removed. Please use `DataServicesAttachment` instead.
* `DocumentAfterRepositoryLoadEvent`
* `ContentStoreInitializationListener`
* `ClientFactory` please use builder instead of using constructor
* `ModelGraphService`
* `ModelGraphDocumentModelElement`
* `ModelGraphComposeDocumentModelElement`
* `ModelGraphElement`
* `DataServicesInitializationListener`
* `AttachmentV2ControllerImpl`

##### Method Removal

* 2 `uploadContent` methods have been removed from `ContentStorePrivateClient` please use remaining `uploadContent` method.
* `ModelGraphService#constructModelGraph` has been removed. Please use `constructModelGraph()` or `constructModelGraph(String)` instead.
* Method `ContentStoreService#saveContent(@NonNull String contentId, String persistentType, @NonNull InputStream inputStream)` have been removed please use `ContentStoreService#saveContent(@NonNull String contentId, String persistentType, @NonNull InputStream inputStream, String filename)` instead.
* Setter `AttachmentBeforeDeleteEvent#setAttachmentHeader(AttachmentHeader attachmentHeader)` has been removed because attachmentHeader is immutable.
* Method `DocumentExportService#exportDocuments(@NonNull String baseDocumentModel, @NonNull FilterSpec filterSpec, @NonNull String format)` has been removed. Please use `DocumentExportService#exportDocuments(@NonNull String baseDocumentModel, @NonNull FilterSpec filterSpec, @NonNull List<SortSpec> sortSpec, @NonNull String format)` instead.
* Getter `DataServicesDocument#getDocRef` has been removed. Please use `DataServicesDocument#DataServicesDocument#getDocRef` instead.

  + SPeL statements in JSON-RPC requests that refer to docRef directly will not work anymore. Please use `.metata.docRef` instead.
  + Example Change `#{#AddContract3.docRef}` to `#{#AddContract3.metadata.docRef}`
* Getter/Setter for `ModelGraphRoot#relationshipModelMap` have been removed. Please use `ModelGraphRoot#relationshipModels` instead.
* Method `ServerApplication#configure` have been removed because parent `configure` should be called instead.
* We’ve removed the `supported` method from `IDocumentIdGenerator`. For custom ID generation, please implement a new `IDocumentIdGenerator` with a higher priority that inspects the document.
* We are introducing a new interface 'InitializationService', which includes the `runInitialization` method for handling initialization. Additionally, 'DataServicesInitializationService' has been moved to an internal package and now implements 'InitializationService'. Clients can override the 'dataServicesInitializationService' bean to customize the initialization process.
* We’ve removed method `findDocumentsByDocRefsSkipNonLoadable(List<DocumentReference> docRefs)` from `com.mgmtp.a12.dataservices.document.persistence.IDocumentRepository` interface because there is no concept of `skipNonLoadable` anymore.
* `RelationshipRoleJpaRepository#findComplementaryRoleOrder(String, String, DocumentReference)` has been removed. Please use `RelationshipRoleJpaRepository#findComplementaryRoleOrder(String, String, String, DocumentReference)` instead.

##### Class Removal

* Class `DocumentClient` has been removed. Please use `RpcOperationsClient` to create documents
* Class `ContentValidator` has been removed because it was not intended for public usage.
* Class `ModelUtils` has been removed because it is not intended for public usage.
* Class `OperationDispatchedEvent` has been removed because it was not intended for public usage.

##### Class renaming

###### Replacement for `RootQueryPage`

Description: Class `RootQueryPage` has been moved to a public package and renamed.

| Original fully-qualified name | New fully-qualified name |
| --- | --- |
| `com.mgmtp.a12.dataservices.query.internal.RootQueryPage` | `com.mgmtp.a12.dataservices.query.QueryPage` |

Impact: Update imports to the new package. Remove any remaining references to the `query.internal` package.

[Covered by automatic migration](#dataservices-rewrite-recipes)

##### Method signature changes

###### Link identifier type migration

Description: The link identifier (`link id`) is changed from numeric type `Long`
to `String` across the entire API.

Table 2. API parameter changes


| Class | Original signature | New signature |
| --- | --- | --- |
| `RelationshipLinkService` | `update(Long id, LinkDescriptor linkDescriptor, String linkDocument)` | `update(String id, LinkDescriptor linkDescriptor, String linkDocument)` |
| `RelationshipLinkService` | `delete(Long id)` | `delete(String id)` |
| `RelationshipLinkService` | `deleteAllByIds(Set<Long> ids)` | `deleteAllByIds(Set<String> ids)` |
| `RelationshipLinkService` | `load(Long id)` | `load(String id)` |
| `RelationshipLinkService` | `relink(LinkDescriptor linkDescriptor, Long linkId)` | `relink(LinkDescriptor linkDescriptor, String linkId)` |

Return type changes

* `RelationshipLink.getId()` → `String`
* `IDocumentIdGenerator.generateId()` → `Optional<String>`

New method variant

`IDocumentIdGenerator.generateId(DocumentV2 document)`

Constructor changes

* `RelationshipModelMismatchException(Long …)` → `RelationshipModelMismatchException(String …)`
* `RelationshipRoleMismatchException(Long/String …)` → first parameter is now `String`

Impact: Every invocation of the methods and constructors listed above has to be adapted
to use `String` instead of `Long`.

[Covered by automatic migration](#dataservices-rewrite-recipes)

###### Interface `IDocumentExporter`

Description: The second parameter of method `export` now accepts `JsonNode`
instead of the domain class `DataServicesDocument`.

| Original | New |
| --- | --- |
| `export(IDocumentModel documentModel, List<DataServicesDocument> documents)` | `export(IDocumentModel documentModel, List<JsonNode> documents)` |

Impact: Pass instances of
`com.fasterxml.jackson.databind.JsonNode` instead of `DataServicesDocument`.

[Covered by automatic migration](#dataservices-rewrite-recipes)

##### Bean Configuration

* Bean `dsTaskScheduler` of type `TaskExecutor` is no longer created by DS because it is not necessary anymore.

##### Configuration Changes

* `mgmtp.a12.dataservices.initialization.scripts.jsonRpc.path` was removed please use `mgmtp.a12.dataservices.initialization.scripts.jsonRpc.paths`

##### Deprecations
