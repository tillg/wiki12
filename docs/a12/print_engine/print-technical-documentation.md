---
source: https://geta12.com/docs/2025.06/ext5/print_engine/print-technical-documentation/index.html
category: print_engine
docid: print-technical-documentation
scraped: 2026-06-12
---

# Print Engine

## Introduction

The *Print Engine* is a Java library used to generate fully functional PDF-documents from A12 Print Models, created with the A12 Print Model Editor.

### Who Should Read This Document?

This document serves as a reference for integrating the *Print Engine* into an existing Java application.
It is therefore intended for developers who work with a Java application that handles data from the A12 Platform to generate PDF-documents.
This document is not intended as a manual for the usage of the *Print Model Editor*.

## APIs

This chapter covers the APIs provided by the Print Engine.

### Print Engine API

This section covers the *Print Engine API*, a package that provides the core abstraction and API for the usage of the Print Engine in a Java application.

#### PrintJob

A `PrintJob` is a *job description* for the Print Engine that executes a specific print operation for a PrintModel.
The properties `locale` and `timezone` are needed for the localization of language specific content and dates.

PrintJob interface

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 ``` | ``` /*  * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial  *  * Copyright (c) 2012-2026 mgm technology partners GmbH  *  * Dual License  * ------------  * This source file is part of the mgm A12 Platform and available under  * a choice of two different licenses:  *  * 1. Open-Source License - EUPL v1.2  *    You may redistribute and/or modify this file under the terms of the  *    European Union Public License, version 1.2 - see https://eupl.eu/.  *  * 2. Commercial License  *    Alternatively, you may obtain a commercial license from  *    mgm technology partners GmbH, that permits use of this software  *    under different terms (including support and maintenance services).  *  *    Please contact a12-license@mgm-tp.com for more information.  *  * You must select and comply with exactly one of the above license options.  *  * Warranty Disclaimer (applies to either option)  * ----------------------------------------------  * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,  * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE  * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.  */ package com.mgmtp.a12.print.engine.api;   /**  * A job description for the PrintEngine to execute the print operation for a particular {@link com.mgmtp.a12.print.model.api.model.PrintModel}.  */ public interface PrintJob {  	PrintModelId getPrintModelId();  	PrintJob withProvider(@NonNull JobDependencyProvider provider) throws PrintException;  	PrintJob withLocale(@NonNull Locale locale);  	PrintJob withTimeZone(@NonNull TimeZone timeZone);  	PrintJob withRestriction(@NonNull JobRestriction restriction);  	@NonNull Locale getLocale() throws PrintJobConfigurationException;  	@NonNull TimeZone getTimeZone() throws PrintJobConfigurationException; } ``` |
```

#### JobManager

The `JobManager` is an interface for the creation of new [PrintJobs](#print_job) for a given [*Print Model ID*](#print_model_id)
and the *preparation* of the Print Models.
Preparing a Print Model optimizes the Print Model beforehand, analyzing its Calculations, Conditions and other dynamic elements to optimize the print operations that use the given Print Model.

|  |  |
| --- | --- |
|  | The preparation is necessary for the execution of a PrintJob, but needs to be only done once for each Print Model. If not done manually beforehand, it will be automatically done before the start of the first PrintJob of a given Print Model. To optimize the calculation time of a PrintJob, is recommended to prepare all necessary Print Models manually before the PrintJob is started. |

JobManager interface

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 ``` | ``` /*  * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial  *  * Copyright (c) 2012-2026 mgm technology partners GmbH  *  * Dual License  * ------------  * This source file is part of the mgm A12 Platform and available under  * a choice of two different licenses:  *  * 1. Open-Source License - EUPL v1.2  *    You may redistribute and/or modify this file under the terms of the  *    European Union Public License, version 1.2 - see https://eupl.eu/.  *  * 2. Commercial License  *    Alternatively, you may obtain a commercial license from  *    mgm technology partners GmbH, that permits use of this software  *    under different terms (including support and maintenance services).  *  *    Please contact a12-license@mgm-tp.com for more information.  *  * You must select and comply with exactly one of the above license options.  *  * Warranty Disclaimer (applies to either option)  * ----------------------------------------------  * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,  * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE  * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.  */ package com.mgmtp.a12.print.engine.api;    /**  * Interface for the creation of new {@link PrintJob}s for a given {@link PrintModelId} and the preparation of {@link PrintModel}s.  */ public interface JobManager {  	/** 	 * Prepare needs to be called once when the printModel was added or changed during the lifetime of the manager. 	 * However, doing so every print is not required and will result in server performance penalties 	 * 	 * @param printModel Print model content to be print 	 */ 	PrintModelId prepare(String printModel) throws PrintException;  	/** 	 * Create a new {@link PrintJob} from the given {@link PrintModelId}. 	 * Compiles the print model if it has not already been compiled. 	 * 	 * @param printModelId Print model Id 	 */ 	PrintJob createNewJob(PrintModelId printModelId) throws PrintException;  } ``` |
```

#### PrintEngine

The `PrintEngine` is an interface for the execution of a given [PrintJob](#print_job), that returns a [PrintResult](#print_result).

PrintEngine interface

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 ``` | ``` /*  * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial  *  * Copyright (c) 2012-2026 mgm technology partners GmbH  *  * Dual License  * ------------  * This source file is part of the mgm A12 Platform and available under  * a choice of two different licenses:  *  * 1. Open-Source License - EUPL v1.2  *    You may redistribute and/or modify this file under the terms of the  *    European Union Public License, version 1.2 - see https://eupl.eu/.  *  * 2. Commercial License  *    Alternatively, you may obtain a commercial license from  *    mgm technology partners GmbH, that permits use of this software  *    under different terms (including support and maintenance services).  *  *    Please contact a12-license@mgm-tp.com for more information.  *  * You must select and comply with exactly one of the above license options.  *  * Warranty Disclaimer (applies to either option)  * ----------------------------------------------  * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,  * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE  * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.  */ package com.mgmtp.a12.print.engine.api;  import com.mgmtp.a12.print.engine.api.exception.PrintException;  /**  * Interface for the execution of a given {@link PrintJob}, that returns a {@link PrintResult}.  */ public interface PrintEngine<Result extends PrintResult> {  	/** 	 * Executing the given PrintJob and return the PrintResult. 	 */ 	Result execute(PrintJob printJob) throws PrintException;  	/** 	 * Get general config of the current job 	 */ 	PrintEngineConfig getConfig(); } ``` |
```

#### PdfBoxPrintEngine

The `PdfBoxPrintEngine` is an interface for the execution of a given [PrintJob](#print_job), that returns a [PdfPrintResult](#pdf_print_result).

PdfBoxPrintEngine interface

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 ``` | ``` /*  * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial  *  * Copyright (c) 2012-2026 mgm technology partners GmbH  *  * Dual License  * ------------  * This source file is part of the mgm A12 Platform and available under  * a choice of two different licenses:  *  * 1. Open-Source License - EUPL v1.2  *    You may redistribute and/or modify this file under the terms of the  *    European Union Public License, version 1.2 - see https://eupl.eu/.  *  * 2. Commercial License  *    Alternatively, you may obtain a commercial license from  *    mgm technology partners GmbH, that permits use of this software  *    under different terms (including support and maintenance services).  *  *    Please contact a12-license@mgm-tp.com for more information.  *  * You must select and comply with exactly one of the above license options.  *  * Warranty Disclaimer (applies to either option)  * ----------------------------------------------  * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,  * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE  * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.  */ package com.mgmtp.a12.print.engine.api;   /**  * Interface for the execution of a given {@link PrintJob}, that returns a {@link PdfPrintResult}.  */ public interface PdfBoxPrintEngine extends PrintEngine<PdfPrintResult> { } ``` |
```

#### PdfPrintEngine (Deprecated)

|  |  |
| --- | --- |
|  | Will be replaced with [PdfBoxPrintEngine](#pdf_box_print_engine) in 2026.06. |

The `PdfPrintEngine` is an interface for the execution of a given [PrintJob](#print_job), that returns a [PdfPrintResult](#pdf_print_result).

PdfPrintEngine interface

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 ``` | ``` /*  * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial  *  * Copyright (c) 2012-2026 mgm technology partners GmbH  *  * Dual License  * ------------  * This source file is part of the mgm A12 Platform and available under  * a choice of two different licenses:  *  * 1. Open-Source License - EUPL v1.2  *    You may redistribute and/or modify this file under the terms of the  *    European Union Public License, version 1.2 - see https://eupl.eu/.  *  * 2. Commercial License  *    Alternatively, you may obtain a commercial license from  *    mgm technology partners GmbH, that permits use of this software  *    under different terms (including support and maintenance services).  *  *    Please contact a12-license@mgm-tp.com for more information.  *  * You must select and comply with exactly one of the above license options.  *  * Warranty Disclaimer (applies to either option)  * ----------------------------------------------  * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,  * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE  * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.  */ package com.mgmtp.a12.print.engine.api;  /**  * Interface for the execution of a given {@link PrintJob}, that returns a {@link PdfPrintResult}.  * @deprecated since version 3.1.0  * Will be replaced with {@link PdfBoxPrintEngine} in 4.0.0 (2026.06)  */ @Deprecated(since = "3.1.0") public interface PdfPrintEngine extends PrintEngine<PdfPrintResult> { } ``` |
```

#### PrintModelId

PrintModelId interface

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 ``` | ``` /*  * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial  *  * Copyright (c) 2012-2026 mgm technology partners GmbH  *  * Dual License  * ------------  * This source file is part of the mgm A12 Platform and available under  * a choice of two different licenses:  *  * 1. Open-Source License - EUPL v1.2  *    You may redistribute and/or modify this file under the terms of the  *    European Union Public License, version 1.2 - see https://eupl.eu/.  *  * 2. Commercial License  *    Alternatively, you may obtain a commercial license from  *    mgm technology partners GmbH, that permits use of this software  *    under different terms (including support and maintenance services).  *  *    Please contact a12-license@mgm-tp.com for more information.  *  * You must select and comply with exactly one of the above license options.  *  * Warranty Disclaimer (applies to either option)  * ----------------------------------------------  * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,  * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE  * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.  */ package com.mgmtp.a12.print.engine.api;  import com.mgmtp.a12.print.engine.api.exception.PrintException;  /**  * The interface PrintModel Identifier  */ public interface PrintModelId {  	/** 	 * Gets the String that is used as id in the PrintModel JSON File 	 * 	 * @return the model header id 	 */ 	String getModelHeaderId();  	/** 	 * From string print model id. 	 * 	 * @param printModelHeaderId the print model header id 	 * @return the print model id 	 * @throws PrintException if the provided String is null empty or blank 	 */ 	static PrintModelId fromString(final String printModelHeaderId) throws PrintException {  		if(printModelHeaderId == null) { 			throw new PrintException("The provided printModelHeaderId is null"); 		} 		if(printModelHeaderId.isBlank()) { 			throw new PrintException("The provided printModelHeaderId is blank"); 		}  		return new PrintModelId() { 			@Override 			public String getModelHeaderId() { 				return printModelHeaderId; 			}  			@Override 			public int hashCode() { 				return getModelHeaderId().hashCode(); 			}  			@Override 			public boolean equals(Object obj) { 				if (obj instanceof PrintModelId) { 					return getModelHeaderId().equals( 						((PrintModelId) obj).getModelHeaderId() 					); 				} else { 					return false; 				} 			}  			@Override 			protected Object clone()  { 				return PrintModelId.fromString(getModelHeaderId()); 			}  			@Override 			public String toString() { 				return getModelHeaderId(); 			} 		}; 	}  } ``` |
```

#### PrintResult

A `PrintResult` is a general interface for the results of the [PrintEngine](#print_engine).
It provides the option to copy the resulting PDF directly into the serverless stream instead of copying the resulting data from buffer to buffer.

PrintResult interface

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 ``` | ``` /*  * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial  *  * Copyright (c) 2012-2026 mgm technology partners GmbH  *  * Dual License  * ------------  * This source file is part of the mgm A12 Platform and available under  * a choice of two different licenses:  *  * 1. Open-Source License - EUPL v1.2  *    You may redistribute and/or modify this file under the terms of the  *    European Union Public License, version 1.2 - see https://eupl.eu/.  *  * 2. Commercial License  *    Alternatively, you may obtain a commercial license from  *    mgm technology partners GmbH, that permits use of this software  *    under different terms (including support and maintenance services).  *  *    Please contact a12-license@mgm-tp.com for more information.  *  * You must select and comply with exactly one of the above license options.  *  * Warranty Disclaimer (applies to either option)  * ----------------------------------------------  * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,  * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE  * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.  */ package com.mgmtp.a12.print.engine.api;  /**  * General interface for the results of the {@link PrintEngine}.  */ public interface PrintResult {  	/** 	 * The content type of the resulting PDF 	 */ 	String getContentType();  	/** 	 * Copy the resulting PDF to the provided outputStream. 	 * 	 * @param outputStream The target stream 	 */ 	void copyTo(OutputStream outputStream) throws IOException, PrintException; } ``` |
```

#### PdfPrintResult

A `PdfPrintResult` is an interface for a PDF-based [PrintResult](#print_result).

PdfPrintResult interface

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 ``` | ``` /*  * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial  *  * Copyright (c) 2012-2026 mgm technology partners GmbH  *  * Dual License  * ------------  * This source file is part of the mgm A12 Platform and available under  * a choice of two different licenses:  *  * 1. Open-Source License - EUPL v1.2  *    You may redistribute and/or modify this file under the terms of the  *    European Union Public License, version 1.2 - see https://eupl.eu/.  *  * 2. Commercial License  *    Alternatively, you may obtain a commercial license from  *    mgm technology partners GmbH, that permits use of this software  *    under different terms (including support and maintenance services).  *  *    Please contact a12-license@mgm-tp.com for more information.  *  * You must select and comply with exactly one of the above license options.  *  * Warranty Disclaimer (applies to either option)  * ----------------------------------------------  * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,  * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE  * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.  */ package com.mgmtp.a12.print.engine.api;  /**  * Interface for PDF-based {@link PrintResult}.  */ public interface PdfPrintResult extends PrintResult {      static PdfPrintResult empty() {     	return e -> {}; 	};      @Override 	default String getContentType() { 		return "application/pdf"; 	} } ``` |
```

#### PdfBoxPrintEngineConfig

The `PdfBoxPrintEngineConfig` provides options for the configuration of the Print Engine. It currently only allows integrating custom fonts.

#### PrintEngineConfig (Deprecated)

|  |  |
| --- | --- |
|  | Will be replaced with [PdfBoxPrintEngineConfig](#pdf_box_print_engine_config) in 2026.06. |

The `PrintEngineConfig` provides options for the configuration of the Print Engine.
It allows integrating custom fonts, setting a default font and configuring the HTML-element and CSS-style whitelists.

PrintEngineConfig interface

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 ``` | ``` /*  * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial  *  * Copyright (c) 2012-2026 mgm technology partners GmbH  *  * Dual License  * ------------  * This source file is part of the mgm A12 Platform and available under  * a choice of two different licenses:  *  * 1. Open-Source License - EUPL v1.2  *    You may redistribute and/or modify this file under the terms of the  *    European Union Public License, version 1.2 - see https://eupl.eu/.  *  * 2. Commercial License  *    Alternatively, you may obtain a commercial license from  *    mgm technology partners GmbH, that permits use of this software  *    under different terms (including support and maintenance services).  *  *    Please contact a12-license@mgm-tp.com for more information.  *  * You must select and comply with exactly one of the above license options.  *  * Warranty Disclaimer (applies to either option)  * ----------------------------------------------  * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,  * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE  * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.  */ package com.mgmtp.a12.print.engine.api;   /**  * Configures the behavior of the PrintEngine.  * Allows integrating custom fonts, setting a default font and configuring the HTML-element and CSS-style whitelists.  * @deprecated since version 3.1.0  * Will be replaced with {@link PdfBoxPrintEngineConfig} in 4.0.0 (2026.06)  */ @Data @Builder(toBuilder = true) @NoArgsConstructor @AllArgsConstructor @Deprecated(since = "3.1.0") public class PrintEngineConfig {  	/** 	 * The HTML template file. e.g template.ftlx 	 */ 	protected String segmentEntryTemplateName;  	/** 	 * Template directory where template is located. e.g /ftl/ 	 */ 	protected String templateDirectory;  	/** 	 * Map of available fonts. Each font is registered with a key which can be used in the print model. As value a valid 	 * classpath ('classpath:/') resource of external resource ('file:/') has to be set (e.g. 	 * <code>classpath:/fonts/arial.ttf</code>) 	 */ 	protected Map<String, String> availableFonts;  	/** 	 * List of allowed HTML tags (e.g. li,ul). These tags can than be used to render HTML from a field or an expression. 	 * Tags which can lead to security concerns will be filtered and an exception will be thrown (script, iframe, object, embed, style). 	 */ 	protected List<String> allowedHtmlTags; 	/** 	 * List of allowed css styles (e.g. display, position, font-size). These styles can be used to apply css styles for 	 * HTML tags. Styles which can lead to security concerns (are not mentioned in this list) will be filtered out. 	 */ 	protected List<String> allowedStyles;  } ``` |
```

### Print Engine Runtime

This section covers the API for the *Print Engine Runtime*, a package that provides the core implementation behind the interfaces of the [Print Engine API](#print_engine_api).

#### PrintJobManager

The `PrintJobManager` is an implementation of the [JobManager](#job_manager), that facilitates the creation of [PrintJob](#print_job)s and the preparation of Print Models.

PrintJobManager implementation

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 ``` | ``` /**  * Used to create {@link PrintJob}s and compile {@link com.mgmtp.a12.print.model.api.model.PrintModel}s  */ public class PrintJobManager implements JobManager { 	private final PrintModelCompilerRuntime compiler;  	public PrintJobManager( 		@NonNull ExecutorService executorService, 		@NonNull PrintJobManagerApi api, 		@NonNull PrintJobConfig printJobConfig 	) { 		this.compiler = new PrintModelCompilerRuntime(executorService, api, printJobConfig, false); 	}  	public PrintJobManager( 		@NonNull ExecutorService executorService, 		@NonNull PrintJobManagerApi api, 		@NonNull PrintJobConfig printJobConfig, 		boolean usePdfBoxPrintProcess 	) { 		this.compiler = new PrintModelCompilerRuntime(executorService, api, printJobConfig, usePdfBoxPrintProcess); 	}  	/** 	 * Compiles a {@link com.mgmtp.a12.print.model.api.model.PrintModel}. 	 */ 	@Override 	public PrintModelId prepare(@NonNull String printModel) throws PrintCompilerException { 		return compiler.compile(printModel).getId(); 	}  	/** 	 * Creates a new {@link PrintJob} from the given {@link PrintModelId}. 	 * Compiles the {@link com.mgmtp.a12.print.model.api.model.PrintModel} if it has not already been compiled. 	 */ 	@Override 	public PrintJob createNewJob(@NonNull PrintModelId printModelId) throws PrintCompilerException { 		final var printJob = ManagedPrintJob.builder() 			.printModelCompilationContext(getCompiledPrintModel(printModelId)) 			.build(); 		printJob.withProvider(PrintModelProvider.fromLoader(this::getCompiledPrintModel)); 		return printJob; 	}  	private PrintModelCompilationContext getCompiledPrintModel(@NonNull PrintModelId printModelId) { 		final var context = compiler.get(printModelId); 		return context.orElseThrow( 			() -> new PrintCompilerException("PrintModel {} is not prepared.", printModelId) 		).awaitCompilation(); 	}  } ``` |
```

#### PrintJobManagerApi

The `PrintJobManagerApi` provides interfaces for the loading of Print Models and Document Models by given their IDs.

PrintJobManagerApi interface

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 ``` | ``` /**  * Provides interfaces that load print and document models by given IDs.  */ public interface PrintJobManagerApi {  	/** 	 * Load the Print model content by ID 	 */ 	String loadPrintModel(String id);  	/** 	 * Load the document model structure by ID 	 * 	 * @param id document model ID 	 */ 	IDocumentModel loadDocumentModel(String id);  } ``` |
```

#### PdfBoxPrintEngine

The `PdfBoxPrintEngine` is an implementation of [PdfBoxPrintEngine](#pdf_box_print_engine), that provides the ability to execute [PrintJob](#print_job)s.
This engine is able to work with Typesetting Models, which can be provided with the [TypesettingModelProvider](#typesetting_model_provider).

#### PdfPrintEngine (Deprecated)

|  |  |
| --- | --- |
|  | Will be replaced with [PdfBoxPrintEngine](#pdf_box_print_engine_runtime) in 2026.06. |

The `PdfPrintEngine` is an implementation of [PdfPrintEngine](#pdf_print_engine), that provides the ability to execute [PrintJob](#print_job)s.
There are noticable differences to the `PdfBoxPrintEngine` (see [Legacy Rendering Mode](https://geta12.com/docs/PRINT_ENGINE/print-modeling-documentation/index.html#legacy_rendering_mode)).

#### KernelDocumentV2Provider

`KernelDocumentV2Provider` is an interface for loading A12 Kernel *DocumentV2*.

KernelDocumentV2Provider interface

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 ``` | ``` /*  * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial  *  * Copyright (c) 2012-2026 mgm technology partners GmbH  *  * Dual License  * ------------  * This source file is part of the mgm A12 Platform and available under  * a choice of two different licenses:  *  * 1. Open-Source License - EUPL v1.2  *    You may redistribute and/or modify this file under the terms of the  *    European Union Public License, version 1.2 - see https://eupl.eu/.  *  * 2. Commercial License  *    Alternatively, you may obtain a commercial license from  *    mgm technology partners GmbH, that permits use of this software  *    under different terms (including support and maintenance services).  *  *    Please contact a12-license@mgm-tp.com for more information.  *  * You must select and comply with exactly one of the above license options.  *  * Warranty Disclaimer (applies to either option)  * ----------------------------------------------  * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,  * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE  * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.  */ package com.mgmtp.a12.print.engine.runtime;   /**  * Interface for loading A12 kernel {@link DocumentV2}s.  */ public interface KernelDocumentV2Provider extends JobDependencyProvider {  	IDocumentV1V2Converter CONVERTER = new DocumentServiceFactory( 		dmID -> null // dm resolver is not needed here 	).createDocumentV1V2Converter();  	static KernelDocumentV2Provider fromDocument(final @NonNull DocumentV2 document) {  		return new KernelDocumentV2Provider() { 			@Override 			public boolean supports(DocumentDependencyDescriptor documentDependencyDescriptor) { 				return documentDependencyDescriptor.getModelReference().getReference().equals(document.getDocumentModelId()); 			}  			@Override 			public DocumentV2 loadDocument(DocumentDependencyDescriptor descriptor) { 				return document; 			} 		}; 	}  	/** 	 * @return true, if the {@link com.mgmtp.a12.model.header.ModelReference} is supported by the provider. 	 */ 	boolean supports(DocumentDependencyDescriptor documentDependencyDescriptor);  	/** 	 * @return The supported document 	 */ 	DocumentV2 loadDocument(DocumentDependencyDescriptor descriptor);  	/** 	 * @return true, if the {@link com.mgmtp.a12.model.header.ModelReference} needed by the {@link JobDependency} is supported. 	 */ 	default boolean canProvide(JobDependency dependency) { 		if (!(dependency instanceof KernelDocumentJobDependency kernelDocumentDataDependency)) { 			return false; 		} 		var descriptor = kernelDocumentDataDependency.getDescriptor(); 		return supports(descriptor); 	}  	@Override 	default void provide(JobDependency dependency) throws PrintException { 		var kernelDocumentDataDependency = ((KernelDocumentJobDependency) dependency); 		final var documentV2 = loadDocument(kernelDocumentDataDependency.getDescriptor()); 		kernelDocumentDataDependency.setDocument(CONVERTER.toDocumentV1(documentV2)); 	}  } ``` |
```

#### KernelDocumentProvider (Deprecated)

|  |  |
| --- | --- |
|  | Will be replaced with [KernelDocumentV2Provider](#kernel_document_v2_provider) in 2026.06. |

`KernelDocumentProvider` is an interface for loading A12 Kernel *IDocument*.

KernelDocumentProvider interface

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 ``` | ``` /*  * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial  *  * Copyright (c) 2012-2026 mgm technology partners GmbH  *  * Dual License  * ------------  * This source file is part of the mgm A12 Platform and available under  * a choice of two different licenses:  *  * 1. Open-Source License - EUPL v1.2  *    You may redistribute and/or modify this file under the terms of the  *    European Union Public License, version 1.2 - see https://eupl.eu/.  *  * 2. Commercial License  *    Alternatively, you may obtain a commercial license from  *    mgm technology partners GmbH, that permits use of this software  *    under different terms (including support and maintenance services).  *  *    Please contact a12-license@mgm-tp.com for more information.  *  * You must select and comply with exactly one of the above license options.  *  * Warranty Disclaimer (applies to either option)  * ----------------------------------------------  * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,  * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE  * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.  */ package com.mgmtp.a12.print.engine.runtime;   /**  * Interface for loading A12 kernel {@link IDocument}s.  */ @Deprecated(since = "3.0.0") public interface KernelDocumentProvider extends JobDependencyProvider {  	static KernelDocumentProvider fromDocument(final @NonNull IDocument document) {  		return new KernelDocumentProvider() { 			@Override 			public boolean supports(DocumentDependencyDescriptor documentDependencyDescriptor) { 				return documentDependencyDescriptor.getModelReference().getReference().equals(document.getDocumentModelId()); 			}  			@Override 			public IDocument loadDocument(DocumentDependencyDescriptor descriptor) { 				return document; 			} 		}; 	}  	/** 	 * @return true, if the {@link com.mgmtp.a12.model.header.ModelReference} is supported by the provider. 	 */ 	boolean supports(DocumentDependencyDescriptor documentDependencyDescriptor);  	/** 	 * @return The supported document 	 */ 	IDocument loadDocument(DocumentDependencyDescriptor descriptor);  	/** 	 * @return true, if the {@link com.mgmtp.a12.model.header.ModelReference} needed by the {@link JobDependency} is supported. 	 */ 	default boolean canProvide(JobDependency dependency) { 		if (!(dependency instanceof KernelDocumentJobDependency)) { 			return false; 		} 		var kernelDocumentDataDependency = (KernelDocumentJobDependency) dependency; 		var descriptor = kernelDocumentDataDependency.getDescriptor(); 		return supports(descriptor); 	}  	@Override 	default void provide(JobDependency dependency) throws PrintException { 		var kernelDocumentDataDependency = ((KernelDocumentJobDependency) dependency); 		kernelDocumentDataDependency.setDocument( 			loadDocument(kernelDocumentDataDependency.getDescriptor()) 		); 	}  } ``` |
```

#### TypesettingModelProvider

`TypesettingModelProvider` is an interface for loading Typesetting Models. They can be created within the SME ([Typesetting Model Configuration](https://geta12.com/docs/PRINT_ENGINE/print-modeling-documentation/index.html#TypesettingModel)).

TypesettingModelProvider interface

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 ``` | ``` /*  * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial  *  * Copyright (c) 2012-2026 mgm technology partners GmbH  *  * Dual License  * ------------  * This source file is part of the mgm A12 Platform and available under  * a choice of two different licenses:  *  * 1. Open-Source License - EUPL v1.2  *    You may redistribute and/or modify this file under the terms of the  *    European Union Public License, version 1.2 - see https://eupl.eu/.  *  * 2. Commercial License  *    Alternatively, you may obtain a commercial license from  *    mgm technology partners GmbH, that permits use of this software  *    under different terms (including support and maintenance services).  *  *    Please contact a12-license@mgm-tp.com for more information.  *  * You must select and comply with exactly one of the above license options.  *  * Warranty Disclaimer (applies to either option)  * ----------------------------------------------  * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,  * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE  * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.  */ package com.mgmtp.a12.print.engine.runtime;   /**  * Interface for loading {@link TypesettingModel}s.  */ public interface TypesettingModelProvider extends JobDependencyProvider {  	static TypesettingModelProvider fromLoader(final @NonNull Function<String, TypesettingModel> loading) { 		return new TypesettingModelProvider() { 			@Override 			public boolean supports(TypesettingModelDependencyDescriptor typesettingModelDependencyDescriptor) { 				return true; 			}  			@Override 			public TypesettingModel loadTypesettingModel(TypesettingModelDependencyDescriptor descriptor) { 				return loading.apply(descriptor.getTypesettingModelId()); 			} 		}; 	}  	/** 	 * @return true, if the {@link TypesettingModel} referenced by the ID is supported by the provider. 	 */ 	boolean supports(TypesettingModelDependencyDescriptor typesettingModelDependencyDescriptor);  	TypesettingModel loadTypesettingModel(TypesettingModelDependencyDescriptor descriptor);  	/** 	 * @return true, if the {@link TypesettingModel} needed by the {@link JobDependency}. 	 */ 	default boolean canProvide(JobDependency dependency) { 		if (!(dependency instanceof TypesettingModelJobDependency)) { 			return false; 		} 		var typesettingModelJobDependency = (TypesettingModelJobDependency) dependency; 		var descriptor = typesettingModelJobDependency.getDescriptor(); 		return supports(descriptor); 	}  	@Override 	default void provide(JobDependency dependency) throws PrintException { 		var typesettingModelJobDependency = ((TypesettingModelJobDependency) dependency); 		typesettingModelJobDependency.setTypesettingModel(loadTypesettingModel(typesettingModelJobDependency.getDescriptor())); 	} } ``` |
```

#### AttachmentProvider

`AttachmentProvider` is an interface for loading Attachments as *ByteArrayInputStream*.

AttachmentProvider interface

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 ``` | ``` /*  * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial  *  * Copyright (c) 2012-2026 mgm technology partners GmbH  *  * Dual License  * ------------  * This source file is part of the mgm A12 Platform and available under  * a choice of two different licenses:  *  * 1. Open-Source License - EUPL v1.2  *    You may redistribute and/or modify this file under the terms of the  *    European Union Public License, version 1.2 - see https://eupl.eu/.  *  * 2. Commercial License  *    Alternatively, you may obtain a commercial license from  *    mgm technology partners GmbH, that permits use of this software  *    under different terms (including support and maintenance services).  *  *    Please contact a12-license@mgm-tp.com for more information.  *  * You must select and comply with exactly one of the above license options.  *  * Warranty Disclaimer (applies to either option)  * ----------------------------------------------  * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,  * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE  * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.  */ package com.mgmtp.a12.print.engine.runtime;  /**  * Interface for loading A12 Attachments.  */ public interface AttachmentProvider extends JobDependencyProvider {  	static AttachmentProvider fromLoader(final @NonNull Function<String, ByteArrayInputStream> loading) { 		return new AttachmentProvider() { 			@Override 			public boolean supports(AttachmentDependencyDescriptor attachmentDependencyDescriptor) { 				return true; 			}  			@Override 			public ByteArrayInputStream loadAttachment(AttachmentDependencyDescriptor descriptor) { 				return loading.apply(descriptor.getAttachmentId()); 			} 		}; 	}  	/** 	 * @return true, if the Attachment referenced by the ID is supported by the provider. 	 */ 	boolean supports(AttachmentDependencyDescriptor attachmentDependencyDescriptor);  	ByteArrayInputStream loadAttachment(AttachmentDependencyDescriptor descriptor);  	/** 	 * @return true, if the Attachment needed by the {@link JobDependency}. 	 */ 	default boolean canProvide(JobDependency dependency) { 		if (!(dependency instanceof AttachmentJobDependency attachmentJobDependency)) { 			return false; 		}         final var descriptor = attachmentJobDependency.getDescriptor(); 		return supports(descriptor); 	}  	@Override 	default void provide(JobDependency dependency) throws PrintException { 		final var attachmentJobDependency = ((AttachmentJobDependency) dependency); 		attachmentJobDependency.setAttachment(loadAttachment(attachmentJobDependency.getDescriptor())); 	} } ``` |
```

#### PageRangeRestriction

`PageRangeRestriction` is a `JobRestriction`, which is able to restrict the resulting pages in the PDF.
The user is able to use one of the auxiliary methods or the `Builder` to create a `PageRangeRestriction`.

A starting index must be defined.
The end index can be defined and is then to be understood as exclusive.
If no end index is defined, all pages after the starting index are in the output PDF.
The indices are zero-based.

It is only possible to define one `PageRangeRestriction`

PageRangeRestriction

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 ``` | ``` /*  * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial  *  * Copyright (c) 2012-2026 mgm technology partners GmbH  *  * Dual License  * ------------  * This source file is part of the mgm A12 Platform and available under  * a choice of two different licenses:  *  * 1. Open-Source License - EUPL v1.2  *    You may redistribute and/or modify this file under the terms of the  *    European Union Public License, version 1.2 - see https://eupl.eu/.  *  * 2. Commercial License  *    Alternatively, you may obtain a commercial license from  *    mgm technology partners GmbH, that permits use of this software  *    under different terms (including support and maintenance services).  *  *    Please contact a12-license@mgm-tp.com for more information.  *  * You must select and comply with exactly one of the above license options.  *  * Warranty Disclaimer (applies to either option)  * ----------------------------------------------  * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,  * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE  * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.  */ package com.mgmtp.a12.print.engine.api.restriction;   @Builder @AllArgsConstructor(access = AccessLevel.PACKAGE) public class PageRangeRestriction implements JobRestriction {  	private final Integer inclusiveStart; 	private final Integer exclusiveEnd;  	public static PageRangeRestriction of(final int inclusiveStart, final int exclusiveEnd) { 		if(inclusiveStart >= exclusiveEnd) { 			throw new PrintJobRestrictionException("Range may not be empty"); 		} 		if(exclusiveEnd < 1) { 			throw new PrintJobRestrictionException("End must be greater than zero"); 		} 		return new PageRangeRestriction(inclusiveStart, exclusiveEnd); 	}  	public static PageRangeRestriction skip(final int pageCount) { 		if(pageCount < 1) { 			throw new PrintJobRestrictionException("Page count must be greater than zero"); 		} 		return new PageRangeRestriction(pageCount, null); 	}  	public static PageRangeRestriction take(final int pageCount) { 		if(pageCount < 1) { 			throw new PrintJobRestrictionException("Page count must be greater than zero"); 		} 		return new PageRangeRestriction(0, pageCount); 	}  	public static PageRangeRestriction page(final int pageIndex) { 		return new PageRangeRestriction(pageIndex, pageIndex + 1); 	}  	@Override 	public void restrict(JobRestrictionContext context) { 		if (context instanceof SinglePageRangeRestrictionContext) { 			((SinglePageRangeRestrictionContext) context).setPageRange(inclusiveStart, exclusiveEnd); 		} else { 			throw new PrintJobRestrictionException("The given context does not implement SinglePageRangeRestrictionContext"); 		} 	} } ``` |
```

## Integration

This chapter describes the integration of the Print Engine into a Java application.

### Dependency

This section covers the dependencies necessary for integrating the Print Engine into a Maven or Gradle application.

For the usage with Maven, the following dependencies need to be added in the applications POM-file:

Maven plugin

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 ``` | ``` <dependency>     <groupId>com.mgmtp.a12.print</groupId>     <artifactId>print-engine-api</artifactId>     <version>{printEngineVersion}</version> </dependency>  <dependency>     <groupId>com.mgmtp.a12.print</groupId>     <artifactId>print-engine-runtime</artifactId>     <version>{printEngineVersion}</version> </dependency> ``` |
```

For the usage with Gradle, the following dependencies need to be added in the applications `build.gradle` file:

Gradle plugin

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` ... dependencies { 	... 	implementation("com.mgmtp.a12.print:print-engine-api:${printEngineVersion}") 	implementation("com.mgmtp.a12.print:print-engine-runtime:${printEngineVersion}") 	... } ``` |
```

### Configuration

This section covers the core configurations of the Print Engine, necessary for printing valid PDF-documents.

You can either create these configurations directly or if you are using Spring you can do so by using the `@Bean` annotation in the Configuration class.

#### Direct Configuration

##### Creating the PrintJobManagerApi

First of all, we need to define the PrintJobManagerApi.

|  |  |
| --- | --- |
|  | the PrintJobManagerApi may be called by any thread from the ExecutorService. These threads will not carry a `SecurityContext`. |

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 ``` | ``` var printJobManagerApi = new PrintJobManager.PrintJobManagerApi() { 	@Override 	public String loadPrintModel(String id) { 		if (id.equals("DINTemplatePM")) { (1) 			return PrintTestUtil.loadFromResources( 				"/data/dinTemplates/DINTemplatePM.json" 			); 		} 		throw new RuntimeException(); 	}  	@Override 	public IDocumentModel loadDocumentModel(String id) { 		if (id.equals(documentModelId)) { (2) 			return PrintTestUtil.loadDocumentModel(documentModel, documentModelId); 		} 		throw new RuntimeException(id); 	} }; ``` |
```

|  |  |
| --- | --- |
| **1** | This should be changed by your local service accordingly. |
| **2** | This should be changed by your local service accordingly. |

##### Creating the ExecutorService

The [Print Engine Runtime](#print_engine_runtime) provides a default implementation for the ExecutorService:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` ExecutorServiceFactory.getInstance(Runtime.getRuntime().availableProcessors(), "print-pool"); ``` |
```

Alternatively, you can declare your own ExecutorService:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 ``` | ``` return new ForkJoinPool( (1) 	Runtime.getRuntime().availableProcessors(), 	p -> { 		final ForkJoinWorkerThread worker = ForkJoinPool.defaultForkJoinWorkerThreadFactory.newThread(p); 		worker.setName("print-pool-" + worker.getPoolIndex()); 		return worker; 	}, 	null, 	true ); ``` |
```

##### Creating PrintJobManager and PrintEngine

Then we can create PrintJobManager and [PdfBoxPrintEngine](#pdf_box_print_engine_runtime) or [PdfPrintEngine (Deprecated)](#pdf_print_engine_runtime).

|  |  |
| --- | --- |
|  | Please be aware of using the `usePdfBoxPrintProcess` flag during the creation of the `PrintJobManager`. It is set to false by default, which means that Legacy Rendering Mode (see [Legacy Rendering Mode](https://geta12.com/docs/PRINT_ENGINE/print-modeling-documentation/index.html#legacy_rendering_mode)) will be used. For the default rendering mode, set it to be true. With the deprecation of the Legacy Rendering Mode in the 2026.06 release, this flag will be removed. |

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` var printJobManager = new PrintJobManager(pool, printJobManagerApi, PrintJobConfig.DEFAULT, usePdfBoxPrintProcess); var pdfPrintEngine = usePdfBoxPrintProcess 	? new PdfBoxPrintEngine(pool, PdfBoxPrintEngineConfig.DEFAULT) 	: new PdfPrintEngine(pool, PrintEngineConfig.DEFAULT, true); ``` |
```

The possibilities of the configs are described in [PdfBoxPrintEngineConfig](#pdf_box_print_engine_config) or [PrintEngineConfig (Deprecated)](#print_engine_config).

#### Using the `@Bean` Annotation

Example

Configuration class

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` package com.mgmtp.a12.print.shell.internal.configuration; ``` |
```

|  |  |
| --- | --- |
| **1** | Load Print Model content. The implementation should be changed by your local service accordingly. |
| **2** | Load IDocumentModel. The implementation should be changed by your local service accordingly. |
| **3** | Customization fonts could be set for the PrintEngineConfig. |

### Usage

#### Creating a PrintJob

Next step is the creation of a PrintJob, where document provider, locale, timezone are configured.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` var printJob = printJobManager.createNewJob(printModelId); printJob.withLocale(Locale.GERMAN); printJob.withTimeZone(timeZone); 	printJob.withProvider(new KernelDocumentProvider() { (1) 		@Override 		public boolean supports(DocumentDependencyDescriptor documentDependencyDescriptor) { 			return documentDependencyDescriptor.getModelReference().getReference().equals(documentModelId); 		}  		@Override 		public IDocument loadDocument(DocumentDependencyDescriptor descriptor) { 			return documentToPrint; (2) 		} 	}); ``` |
```

|  |  |
| --- | --- |
| **1** | This could be replaced with the KernelDocumentProvider implementation from the [Print Engine Runtime](#kernel_document_provider), where `documentToPrint` is an IDocument. Usage: `printJob.withProvider(KernelDocumentProvider.fromDocument(documentToPrint));` |
| **2** | This is the integration point for your own document provider. |

##### KernelDocumentV2Provider

Next to the `KernelDocumentProvider` it is possible to use the `KernelDocumentV2Provider` to print with a `DocumentV2` instead of the `IDocument`.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 ``` | ``` printJob.withProvider(new KernelDocumentV2Provider() { (1) 	@Override 	public boolean supports(DocumentDependencyDescriptor documentDependencyDescriptor) { 		return documentDependencyDescriptor.getModelReference().getReference().equals(documentModelId); 	}  	@Override 	public DocumentV2 loadDocument(DocumentDependencyDescriptor descriptor) { 		return documentToPrint; (2) 	} }); ``` |
```

|  |  |
| --- | --- |
| **1** | This could be replaced with the KernelDocumentV2Provider implementation from the [Print Engine Runtime](#kernel_document_v2_provider), where `documentToPrint` is an DocumentV2. Usage: `printJob.withProvider(KernelDocumentV2Provider.fromDocument(documentToPrint));` |
| **2** | This is the integration point for your own document provider. |

##### TypesettingModelProvider

Within the [TypesettingModelProvider](#typesetting_model_provider) it is possible to provide Typesetting Models to the [PdfBoxPrintEngine](#pdf_box_print_engine_runtime).

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 ``` | ``` final var objectMapper = ObjectMapperFactory.createTypesettingModelMapper(); final var typesettingModelObject = objectMapper.readValue(typesettingModel, TypesettingModelDto.class); printJob.withProvider(new TypesettingModelProvider() { 	@Override 	public boolean supports(TypesettingModelDependencyDescriptor typesettingModelDependencyDescriptor) { 		return typesettingModelDependencyDescriptor.getTypesettingModelId().equals(typesettingModelObject.getHeader().getId()); 	}  	@Override 	public TypesettingModel loadTypesettingModel(TypesettingModelDependencyDescriptor descriptor) { 		return typesettingModelObject; 	} }); ``` |
```

##### AttachmentProvider

The usage of the [AttachmentProvider](#attachment_provider) is similar to the KernelDocumentProvider, but in the AttachmentProvider the attachments needs to be provided as *ByteArrayInputStream*.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 ``` | ``` printJob.withProvider(new AttachmentProvider() { 	@Override 	public boolean supports(AttachmentDependencyDescriptor attachmentDependencyDescriptor) { 		return attachments.containsKey(attachmentDependencyDescriptor.getAttachmentId()); 	}  	@Override 	public ByteArrayInputStream loadAttachment(AttachmentDependencyDescriptor descriptor) { 		return attachments.get(descriptor.getAttachmentId()); 	} }); ``` |
```

##### PageRangeRestriction

Next to the Providers it is possible to define a [PageRangeRestriction](#page_range_restriction).

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` printJob.withRestriction( 	PageRangeRestriction.builder() 		.inclusiveStart(startIndex) 		.exclusiveEnd(endIndex) 		.build() ); ``` |
```

#### Executing a PrintJob

Once everything is [set up](#configuration).
You can print the provided Print Model by calling the `execute` method of the `PdfPrintEngine`.

Example

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` PdfPrintResult pdfPrintResult = pdfPrintEngine.execute(printJob); ``` |
```

## Integration Xml PrintEngine

This chapter describes the additional integration of the XmlPrintEngine and PdfWithXmlPrintEngine into a Java application.

### Additional Dependency

This section covers the additional dependencies necessary for integrating the XML PrintEngines into a Maven or Gradle application.
In both cases it is required to first follow the Instructions from the previous Chapter.

For the usage with Maven, the following additional dependencies need to be added in the applications POM-file:

Maven plugin

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` <dependency>     <groupId>com.mgmtp.a12.print</groupId>     <artifactId>print-engine-runtime-xml</artifactId>     <version>{printEngineVersion}</version> </dependency> ``` |
```

For the usage with Gradle, the following additional dependencies need to be added in the applications `build.gradle` file:

Gradle plugin

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` ... dependencies { 	... 	implementation("com.mgmtp.a12.print:print-engine-runtime-xml:${printEngineVersion}") 	... } ``` |
```

### Usage

#### Choosing the correct Xml Engine

There are two options available for generating Xml

* only the Xml String
* a Pdf where the Xml is embedded into the Pdf as a PdfAttachment

#### Usage of the relevant Classes

Import the package:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` package com.mgmtp.a12.print.engine.runtime.xml; ``` |
```

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 ``` | ``` /**  * Provides the ability to execute {@link PrintJob}s.  */ public class PdfWithXmlPrintEngine extends PrintEngine<PdfPrintResult> implements com.mgmtp.a12.print.engine.api.PdfPrintEngine { 	/** 	 * @param service the ExecutorService that is used for the execution of concurrent processes. 	 * @param config the relevant {@link PrintEngineConfig} 	 * @param resultType the relevant {@link ResultType} 	 */ 	public PdfWithXmlPrintEngine( 		@NonNull ExecutorService service, 		@NonNull PrintEngineConfig config, 		@NonNull ResultType resultType 	) { 		super(config); 		this.service = service; 		this.resultType = resultType; 	} ``` |
```

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 ``` | ``` /**  * Provides the ability to execute {@link PrintJob}s.  */ public class XmlPrintEngine extends PrintEngine<XmlPrintResult> implements com.mgmtp.a12.print.engine.api.XmlPrintEngine { 	/** 	 * @param service the ExecutorService that is used for the execution of concurrent processes. 	 * @param config the relevant {@link PrintEngineConfig} 	 */ 	public XmlPrintEngine( 		@NonNull ExecutorService service, 		@NonNull PrintEngineConfig config 	) { 		super(config); 		this.service = service; 	} ``` |
```

## Print Model Editor Light

This chapter describes the integration of the `PrintModelEditorLight` component into a React Frontend application.
It allows the creation of client applications where users can edit PrintModels.

|  |  |
| --- | --- |
|  | The PrintModelEditorLight is an **experimental** simplified version of the **Print Model Editor**, which itself is part of the standalone **Simple Model Editor** (SME) application. For most use cases, we strongly recommend using the SME as the standard tool for managing PrintModels. Integration of the PrintModelEditorLight into your own frontend application is generally not advised. |

If your want to integrate this component or if your project has other requirements, feel free to contact the A12 Print Engine team ([Discourse](https://discourse.geta12.com/c/engines-specific/print-engine))

### Dependency

This section outlines the dependencies required to integrate the `PrintModelEditorLight` component into a React application. The following module is required:

* `print-model-editor-component`

To install this module, use the following command:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` pnpm install @com.mgmtp.a12.print/print-model-editor-component ``` |
```

Note: This package depends on the peer dependencies listed in `package.json`. Ensure your project uses compatible versions.

### Usage

#### Using the PrintModelEditorLight Component

The `PrintModelEditorLight` component provides a simplified API for editing PrintModels. The example below shows how to integrate the component into a React application.

Please note that a Localization Context is required to provide localization for the component.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 ``` | ``` import { PrintModelEditorLight } from "@com.mgmtp.a12.print/print-model-editor-component/lib/app/PrintModelEditorLight"; import { Locale, DefaultLocalizerContextProvider } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";  const App = () => {   const locale: Locale = { language: "en", country: "US" };    return (     <DefaultLocalizerContextProvider locale={locale}>       <PrintModelEditorLight         printModel={printModel}         documentModel={documentModel}         customFonts={customFonts}         onChange={(updatedModel, dirty) => {           console.log("Model updated:", updatedModel, dirty);         }}       />     </DefaultLocalizerContextProvider>   ); }; ``` |
```

##### Props

The `PrintModelEditorLight` component accepts the following props:

printModel (required)
:   The PrintModel to be edited. This must be a deserialized PrintModel instance.
    Utils for deserialisation can be found in the module `@com.mgmtp.a12.print/print-model-api-utils`.

documentModel (required)
:   The associated DocumentModel. This must also be a deserialized DocumentModel instance.
    Utils for deserialisation can be found in the module `@com.mgmtp.a12.kernel/kernel-md-facade`.

onChange (required)
:   A callback function triggered when the PrintModel changes. The function receives two parameters:

    * `printModel`: The updated, deserialized PrintModel instance.
    * `dirty`: A boolean indicating whether there are unsaved changes. In practice, this means `dirty` is false when the user has clicked the save button. In this case you need to handle saving these changes on your side. `dirty` is true when the user has just made a change in the model. You can use this to handle temporary changes, for example, saving them temporarily.

customFonts (optional)
:   A map of custom fonts. The map should follow the `FontResourceMap` format. Each entry in the map consists of:

    * `Key`: The name of the font.
    * `Value`: An object with the following properties:

      + `src`: Specifies the font source. This can either be:

        - A URL pointing to an accessible font file in your application.
        - A Data URI that encodes the font file inline.
      + `format`: The format of the font. Currently, only `ttf` (TrueType Font) is supported.

Custom Fonts

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 ``` | ``` const customFonts: FontResourceMap = {   "CustomFont1": {     src: "./assets/fonts/custom-font-1.ttf",     format: "ttf",   },   "CustomFont2": {     src: "https://my-cdn.com/fonts/custom-font-2.ttf",     format: "ttf",   },   "CustomFont3": {     src: "data:application/octet-stream;base64,...",     format: "ttf",   }, }; ``` |
```

To override default fonts, provide a key matching the specific default font name.
You find the available default fonts in our modelling documentation: [Available Default Fonts](https://geta12.com/docs/PRINT_ENGINE/print-modeling-documentation/index.html#DefaultFonts).

Override Default Fonts

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` const customFonts: FontResourceMap = {   "Open Sans": {     src: "./assets/fonts/custom-open-sans.ttf",     format: "ttf",   }, }; ``` |
```

##### Differences Compared to the Simple Model Editor

The `PrintModelEditorLight` component differs from the full Print Model Editor which is integrated in the SME in the following ways:

* **Schema Tab**: The `PrintModelEditorLight` does not include a Schema tab. This is because it does not allow selecting different Document Models. Instead, a fixed Document Model is passed via the `documentModel` prop.
* **Commit Changes Tab**: The `PrintModelEditorLight` does not support partial commits of selected changes. Users can only choose to save all changes.

## Breaking Change Management

Here, we define the A12 Print Engine public API and define which changes to this API we consider breaking and non-breaking.

### Definition of Version

The Print Engine component defines a single version. All artifacts (Java and Javascript) that belong to the Print Engine share the same version.

### Definition / distinction of different APIs

| Public API | internal |
| --- | --- |
| - All sources that are not `internal`.  - Everything that is mentioned in the documentation. | - All sources in folders named `internal` or sub-folders thereof, or for Java sources in packages named `internal` or sub-packages thereof.  - Also all sources in modules whose `artifactId` contains `internal`. |

Code changes which do not affect the Public API type surface and change broken features (i.e. features that did not work like expected) which are fixed are not regarded as Breaking Changes.

### Breaking Changes

| Area | Breaking | Non-breaking |
| --- | --- | --- |
| PDF | - Layout changes in the output PDF.  - Changes that require manual user migration. | - Adding new features / new components.  - Fully automated migration that does not result in layout changes. |
| libraries | - Adding new base interfaces.  - Changing function signature. | - Adding a new interface.  - Adding an optional function definition / signature. |

## Migration Instructions

### 2025.06-ext5

#### Deprecations

##### Print Model Api Utils

* The `ElementDefinitionMarshaller` is deprecated and will be removed within the 2026.06 release.
* The `PrintElementValidator` is deprecated and will be removed within the 2026.06 release.

##### Print Model Api

* `com.mgmtp.a12.print.model.api.model.element.base.DisplayOptions.DisplayType.HTML` is no longer deprecated and working as intended again.

### 2025.06-ext4

#### Deprecations

##### Print Shell

* The `--useExperimentalRendering` flag ("-x") is deprecated and will be removed within the 2026.06 release. Currently, the default behavior of the print shell will default to the Legacy Rendering Mode (see [Legacy Rendering Mode](https://geta12.com/docs/PRINT_ENGINE/print-modeling-documentation/index.html#legacy_rendering_mode).) With the removal of this flag, the print shell will use the current experimental rendering mode as the default rendering mode.

##### Java

* The `com.mgmtp.a12.print.model.api.model.element.base.DisplayOptions.DisplayType.HTML` is deprecated and will be removed within the 2026.06 release. This removal has no effect because all content is evaluated as HTML now.
* The `com.mgmtp.a12.print.model.api.model.element.structure.General.getTitle()` method is deprecated and will be removed within the 2026.06 release. Use `com.mgmtp.a12.print.model.api.model.metadata.Metadata.getTitleComputation()` instead.
* The `com.mgmtp.a12.print.model.api.model.element.structure.General.getDetails()` method is deprecated and will be removed within the 2026.06 release. Use `com.mgmtp.a12.print.model.api.model.element.structure.General.getMetadata()` instead.
* The `com.mgmtp.a12.print.model.api.model.element.structure.Details` interface is deprecated and will be removed within the 2026.06 release. Use `com.mgmtp.a12.print.model.api.model.metadata.Metadata` with `getAuthorComputation()` and `getLanguageComputation()` instead.

##### TypeScript

* The `PrintModelContentGeneral.title` property deprecated and will be removed within the 2026.06 release. Use `Metadata.titleComputation` instead.
* The `PrintModelContentGeneral.details` property deprecated and will be removed within the 2026.06 release. Use `PrintModelContentGeneral.metadata` to access metadata fields.
* The `Details` interface deprecated and will be removed within the 2026.06 release. Use `authorComputation` and `languageComputation` from `Metadata` instead.
* The `Details.author` property deprecated and will be removed within the 2026.06 release. Use `Metadata.authorComputation` instead.
* The `Details.language` property deprecated and will be removed within the 2026.06 release. Use `Metadata.languageComputation` instead.
* The `Language` enum deprecated and will be removed within the 2026.06 release. Use any string to represent a language.

###### Deep Level Imports

Deep-level imports for the public API in print packages will be deprecated in this release and removed within the 2026.06 release.
Instead we will enforce top-level imports only.

Top-level imports are favorable, because they obscure the package internals, which makes them less prone to breaking changes.
Additionally they also minimize the amount of import statements needed and allows us to precisely control the public API of our packages.

As an example, take the following deep-level imports:

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` import { PossibleInputSource } from "@com.mgmtp.a12.print/print-model-api/lib/input-source/input-source.js"; import { InputSourceGenerator } from "@com.mgmtp.a12.print/print-model-api-utils/lib/input-source/input-source-generator.js"; import { InputValueSourceResolver } from "@com.mgmtp.a12.print/print-engine-core/lib/input-source/input-source-resolver.js"; import { DeepPartialErrorMap } from "@com.mgmtp.a12.print/print-model-api-utils/lib/errors/deep-partial-error-map.js";  import { PrintModelMarshaller } from "@com.mgmtp.a12.print/print-model-api-utils/lib/marshaller/model-marshaller.js"; import { ElementDefinitionMarshaller } from "@com.mgmtp.a12.print/print-model-api-utils/lib/marshaller/element-definition-marshaller.js"; ``` |
```

Following the deprecation, these imports must be replaced with top-level imports:

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 ``` | ``` import { 	PossibleInputSource, 	InputValueSourceResolver, 	InputSourceGenerator } from "@com.mgmtp.a12.print/print-model-api/input-source"; import { DeepPartialErrorMap } from "@com.mgmtp.a12.print/print-model-api-utils/errors";  import { 	PrintModelMarshaller, 	ElementDefinitionMarshaller } from "@com.mgmtp.a12.print/print-model-api-utils/marshaller"; ``` |
```

For this migration, we provide a codemod tool that automatically replaces deep-level imports with top-level imports.
Please refer to the [Codemod](#Codemod) chapter for instructions on how to use the codemod tool.

##### Limitations

The deprecated APIs `getTitle()`, `getDetails()` remain functional only if the metadata contains exactly one computation alternative with a string literal operation.
Using multiple computation alternatives or non-literal operations will cause the deprecated APIs to throw an `IllegalStateException`.

The new `Metadata` fields `titleComputation`, `authorComputation`, `languageComputation`, `descriptionComputation` use `ComputationAlternative` arrays instead of simple strings.
Existing Print Models are automatically migrated by wrapping the old string values in a single computation alternative with a quoted string literal as operation.

### 2025.06-ext2

#### Deprecations

##### Java

* `com.mgmtp.a12.print.engine.api.PdfPrintEngine` is deprecated and will be removed within the 2026.06 release. Please use `com.mgmtp.a12.print.engine.api.PdfBoxPrintEngine` instead.
* `com.mgmtp.a12.print.engine.api.PrintEngineConfig` is deprecated and will be removed within the 2026.06 release. Please use `com.mgmtp.a12.print.engine.api.PdfBoxPrintEngineConfig` instead. In the new config, it is only possible to configure custom fonts.
* `com.mgmtp.a12.print.engine.runtime.pdf.PdfPrintEngine` is deprecated and will be removed within the 2026.06 release. Please use `com.mgmtp.a12.print.engine.runtime.pdfBox.PdfBoxPrintEngine` instead. The new engine is not able to provide HTML anymore and the PDF output differs ([Noticeable Differences](https://geta12.com/docs/PRINT_ENGINE/print-modeling-documentation/index.html#noticeable_differences)).
* `com.mgmtp.a12.print.engine.runtime.pdf.MarkupCombiner` is deprecated and will be removed within the 2026.06 release. It is not needed anymore, because the new `com.mgmtp.a12.print.engine.runtime.pdfBox.PdfBoxPrintEngine` does not output HTML anymore.

#### Migration from `PdfPrintEngine` to `PdfBoxPrintEngine`

|  |  |
| --- | --- |
|  | We strongly recommend to migrate from `PdfPrintEngine` to `PdfBoxPrintEngine` as soon as possible, because the old engine is going to be removed within the 2026.06 release. The experimental flag of `PdfBoxPrintEngine` is going to be removed with the 2025.06-ext4 release. It only allows us to react to project feedback with smaller breaking changes until then. The feature itself is completely stable and ready for production use.  Feel free to contact the A12 Print Engine team ([Discourse](https://discourse.geta12.com/c/engines-specific/print-engine)) in case of problems or unexpected behavior changes. |

Usage of `PdfPrintEngine`

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` PrintJobManager printJobManager = new PrintJobManager(pool, printJobManagerApi, PrintJobConfig.DEFAULT); PdfPrintEngine pdfPrintEngine = new PdfPrintEngine(pool, PrintEngineConfig.DEFAULT); ``` |
```

Usage of `PdfBoxPrintEngine`

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` PrintJobManager printJobManager = new PrintJobManager(pool, printJobManagerApi, PrintJobConfig.DEFAULT, true); PdfBoxPrintEngine pdfBoxPrintEngine = new PdfBoxPrintEngine(pool, PdfBoxPrintEngineConfig.DEFAULT); ``` |
```

### 2025.06

#### Breaking Changes

##### Input Value Source

Due to the introduction of the Input Value Source for certain fields, these fields now represent breaking changes at the API level. The value of each field depends on its source. To retrieve the value, please use the Input Value Source’s API

**Java usage**

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` // Old model api String title = chart.getChartProperties().getTitle();  // New model api Optional<String> title = InputValueSourceResolver.getInputValue(chart.getChartProperties().getTitle()) ``` |
```

**Typescript usage**

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` // Old model api const title = lineChart.title;  // New model api const title = InputValueSourceResolver.getSourceInputValue(lineChart.title, lineChart, "lineChart.title") ``` |
```

Table 1. Fields that have an input source applied


| Element | Field |
| --- | --- |
| **Table** | maxRowCount |
| sumLabel |
| columns.label |
| columns.width |
| **Listing** | columns.label |
| columns.width |
| **Table Layout** | rowProperties.minHeight |
| columnProperties.width |
| **Line Chart** | title |
| labelX |
| labelY |
| **Bar Chart** | title |
| labelX |
| labelY |
| **Pie Chart** | title |

The following elements contain text properties that need to be adapted to the new API:

* Text: Text properties
* Expression: Text properties
* Table: Text properties, header text properties
* Listing: Text properties, header text properties, column’s text properties

Table 2. Text Properties – Input Source Fields


| Element | Field |
| --- | --- |
| **Text Properties** | textStyleId |
| color |
| backgroundColor |
| bold |
| italic |
| underlined |
| alignment |

##### Move the description to the header

The description field used to belong to `content.general` is moved to header of the model.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` { 	"header": { 		"id": "print-model", 		"modelType": "print", 		"modelVersion": "3.0.0", 		"description": "Description" 	}, 	"content": { ... } } ``` |
```

##### Roles Annotations in the SME are now separated by comma instead of semicolon

In versions prior to 3.0.0 creating a Print Model with roles in the SME would generate an annotation with
each role being separated with a semicolon.
Now a comma-separated list is created instead, bringing it in line with the rest of the A12 ecosystem.

```
|  |  |
| --- | --- |
| ```  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 ``` | ``` { 	"header": { 		"id": "print-model", 		"modelType": "print", 		"modelVersion": "3.0.0", 		"description": "Description", 		"annotations": [ 			{ 				"name": "roles", 				"value": "admin,modeler,tester,reviewer" 			} 		] 	}, 	"content": { ... } } ``` |
```

##### Move the Marshaller to model-api-utils package and validating model references

In versions prior to 3.0.0, the Marshaller lived in the`@com.mgmtp.a12.print/print-model-api`, in version 3.0.0, it has been moved to package `@com.mgmtp.a12.print/print-model-api-utils`.

To use the Marshaller, import it from the new package and pass document models when calling serialize/deserialize to ensure that referenced document models can be validated correctly.

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 ``` | ``` import { PrintModelMarshaller } from "@com.mgmtp.a12.print/print-model-api-utils/lib/marshaller/index.js";  const printModelMarshaller = new PrintModelMarshaller(); const deserializedResult = printModelMarshaller.deserialize(printModel, documentModels); ``` |
```

To skip reference validation, pass the `SKIP_REFERENCES` mode to the serialize/deserialize function

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` const deserializedResult = printModelMarshaller.deserialize(printModel, [], PrintValidationMode.SKIP_REFERENCES); ``` |
```

##### Move serialization package to model-api-utils module

In version 3.0.0, the `model-impl` module has been removed. The serialization package was moved to the `model-api-utils` module.

To use the serialization package, update all references and imports accordingly.

```
|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` - com.mgmtp.a12.print.model.impl.serialization + com.mgmtp.a12.print.model.api.utils.serialization ``` |
```

#### Deprecation

##### Java

* Since the migration to Document V2, the Document V1 provider `KernelDocumentProvider` has been deprecated. Please use `KernelDocumentV2Provider` instead.
* The `migration` command of the `print-shell` tool is deprecated since version 3.0.0. Use the [Node Based Tool](#migration-with-node) from this version onwards.

### Migration Tool

#### For Print Model Version 2.1.0 and Later

To migrate Print Model files, first install the latest version of the migration tool

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` pnpm install -g @com.mgmtp.a12.print/print-model-migration ``` |
```

Then run the following command to perform the migration

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` print-model-migration <path to print model file or directory> --backup ``` |
```

*Examples*

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` # file print-model-migration my-print-model.json --backup  # current folder print-model-migration . --backup ``` |
```

**Note**

* If `<path to print model file or directory>` is a directory, the migration tool will recursively search for Print Model files to migrate.
* If Print Model files are not under version control, use `--backup` (alias `-b`) flag to create backups for model files. This flag is optional.
* Use `--help` (alias `-h`) flag to show all available options.

#### For Print Model Version Earlier Than 2.1.0

##### Step 1: Migrate Model to Version 2.1.0 Using Java Based Tool

To migrate Print Model, first download the Java based tool

|  |  |
| --- | --- |
|  | Since with release 2.1.0 we introduce a new typescript based migration tool to align with overall A12 standards. The print-shell migration will no longer validate and pretty print starting from version 3.0.0. To ensure the same output as prior versions, you need to run the print-shell migration and then the typescript migration in order to migrate to the latest version. In releases after 2.1.0, only the typescript migration will be relevant. |

Then migrate Print Model by executing the downloaded tool as follows

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` java -jar print-shell-2.1.3.jar migrate [OPTIONS] ``` |
```

*Examples*

```
|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` # relative path java -jar print-shell-2.1.3.jar migrate --workspace foldername --overwrite false  # absolute path java -jar print-shell-2.1.3.jar migrate --workspace C:\Test\check\foldername --overwrite false ``` |
```

**Note**

* Use `migrate --help` (alias `-h`) flag to show all available options.
* If Print Model files are not under version control, use `--overwrite false` (alias `-b`) flag to keep the original model files. This flag is optional.
* You can use the print-shell in interactive mode by just running the jar file and entering commands after startup. You can find more about the features of the print-shell in the modeling documentation of Print Engine.

##### Step 2: Migrate Model to Current Version Using Node Based Tool

See [migrate model with Node](#migration-with-node).

### Codemod

Codemods are automated scripts that help you update your codebase to accommodate breaking changes introduced in new versions of a library or framework. They can save you significant time and effort by automating repetitive tasks involved in code migration.

We provide a codemod tool to assist you in migrating your Print Engine related code.

At the moment, we only provide a recipe to replace deep-level imports with top-level imports in TypeScript projects.

#### How to Use the Codemod

The codemod package is available via npx, so you don’t need to install it globally. You’ll need access to the mgm npm registry
to use it.

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx @com.mgmtp.a12.print/print-engine-codemod [recipe-id-or-version] [tsconfig-path] ``` |
```

Parameters

* `recipe-id-or-version`: The ID of a specific recipe to run, or a target version to run all matching recipes. To see a list of available recipes, run `npx @com.mgmtp.a12.print/print-engine-codemod@latest --list`.
* tsconfig-path: The path to your `tsconfig.json` file or a folder containing one. The settings of the tsconfig will be used to determine which files to migrate.

For example, to run the codemod for replacing deep-level imports with top-level imports, you would execute:

```
|  |  |
| --- | --- |
| ``` 1 ``` | ``` npx @com.mgmtp.a12.print/print-engine-codemod prefer-top-level-imports ./tsconfig.json ``` |
```
