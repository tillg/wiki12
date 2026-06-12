# A12 Documentation Mirror

> ## ⚠️ START HERE for any new A12 Widgets–based project
> **Follow the A12 Widgets Quick Start guide _first_:**
> <https://www.mgm-tp.com/a12.htmlshowcase/#/get-started/quick-start>
> (in-repo mirror: [`widgets/get-started/quick-start.md`](widgets/get-started/quick-start.md))
>
> Setting up the environment, packages, and providers per the Quick Start before writing widget code avoids re-deriving the bootstrapping by hand. Don't skip it.

In-repo mirror of the [geta12.com](https://geta12.com/docs/2025.06/ext5/overall/what_is_a12/index.html) A12 platform documentation, **version 2025.06 / edition ext5**.

- **Scraped:** 2026-06-12
- **Source:** `https://geta12.com/docs/2025.06/ext5/<category>/<docid>/index.html`
- **Pages:** 104 across 29 categories
- **Tool:** `src/scrape_geta12/` (re-runnable; see its README)

Each page is Markdown converted from the original Asciidoctor HTML; front-matter records the `source` URL and scrape date. Images/links point back at geta12.com (absolutized), so they need network to render.

## Sections

### Overall (concepts, tutorials, modeling/dev guides) — `overall/`

- [Modeling](overall/a12_modeling.md)
- [Accessing A12 Artifacts](overall/access_artifacts.md)
- [Authorization Definition Examples](overall/authorization_examples.md)
- [How We Handle Breaking Changes](overall/breaking_change_management.md)
- [Cloud Modeling Environment](overall/cloudmodelingenv.md)
- [Modeling Support for Role Based Access Control](overall/comprehensive_features_rbac.md)
- [Task 4 - Custom Endpoint](overall/dev_tutorial_backend_custom_endpoint.md)
- [Task 1 - Document Access](overall/dev_tutorial_backend_document_access.md)
- [Task 2 - Document Manipulation](overall/dev_tutorial_backend_document_manipulation.md)
- [Backend Tutorial](overall/dev_tutorial_backend_intro.md)
- [Task 3 - Unit Testing](overall/dev_tutorial_backend_unit_testing.md)
- [Task 1 - Application Frame](overall/dev_tutorial_frontend_application_frame.md)
- [Task 4 - Data in Activities](overall/dev_tutorial_frontend_data_in_activities.md)
- [Task 3 - Form Customization](overall/dev_tutorial_frontend_form_customization.md)
- [Frontend Tutorial](overall/dev_tutorial_frontend_intro.md)
- [Task 2 - Overview Customization](overall/dev_tutorial_frontend_overview_customization.md)
- [Task 6 - Unit Testing](overall/dev_tutorial_frontend_unit_testing.md)
- [General Information](overall/dev_tutorial_general_information.md)
- [Intro Tutorial](overall/dev_tutorial_intro_intro.md)
- [Task 1 - Modeling](overall/dev_tutorial_intro_modeling.md)
- [Task 2 - Project Template](overall/dev_tutorial_intro_project_template.md)
- [Task 2 - Discovering Queries](overall/dev_tutorial_query_discovering_queries.md)
- [Task 1 - First Steps](overall/dev_tutorial_query_first_steps.md)
- [Query API Tutorial](overall/dev_tutorial_query_intro.md)
- [Task 3 - Migration](overall/dev_tutorial_query_migration.md)
- [Task 4 - Data Encryption in Workflows](overall/dev_tutorial_workflows_encryption.md)
- [Task 2 - External Worker Implementation](overall/dev_tutorial_workflows_external_workers.md)
- [Workflows Tutorial](overall/dev_tutorial_workflows_intro.md)
- [Task 3 - Creating Java Delegates](overall/dev_tutorial_workflows_java_delegates.md)
- [Task 1 - Implementing Script Tasks](overall/dev_tutorial_workflows_script_tasks.md)
- [Docker Security of A12 Vanilla Docker Images](overall/docker_security.md)
- [Modeling Heterogeneous Data](overall/heterogeneity.md)
- [Installing A12](overall/installing_a12.md)
- [A12 License Information](overall/license.md)
- [Migrating to Latest A12 Release Line](overall/migration_guide.md)
- [Model Naming Conventions](overall/model_naming_conventions.md)
- [Tutorial: Basic Modeling](overall/modeling_tutorial_basics.md)
- [Tutorial: Heterogeneity Modeling](overall/modeling_tutorial_heterogeneity.md)
- [Tutorial: Kernel Language](overall/modeling_tutorial_kernel_language.md)
- [Tutorial: Print Modeling](overall/modeling_tutorial_print_engine.md)
- [Tutorial: Relationship Modeling](overall/modeling_tutorial_relationships.md)
- [Tutorial: How To Put It Together](overall/modeling_tutorial_super1.md)
- [Tutorial: Tree Modeling](overall/modeling_tutorial_tree.md)
- [Tutorial: Workflows Modeling](overall/modeling_tutorial_workflows.md)
- [Preview App](overall/preview_app.md)
- [Introduction to the Innovated Query API](overall/qapi_introduction.md)
- [Get Started with Modeling](overall/quick_start_guide.md)
- [Relationship Modeling](overall/relationships_for_bas.md)
- [Security Guidelines](overall/security.md)
- [Types of Models](overall/types_of_models.md)
- [Introduction](overall/what_is_a12.md)

### Data Services — `data_services/`

- [Data Services](data_services/dataservices-documentation-src.md)

### CRUD — `crud/`

- [CRUD](crud/crud-dev-docs.md)

### Content Engine — `content_engine/`

- [Content Engine](content_engine/contentengine-dev-docs.md)
- [Content Modeling](content_engine/contentengine-user-docs.md)

### Form Engine — `form_engine/`

- [Form Engine](form_engine/formengine-documentation-bundle.md)

### Kernel — `kernel/`

- [Kernel Language](kernel/kernel-documentation-ba-en.md)
- [Kernel](kernel/kernel-documentation-dev.md)

### Simple Model Editor (SME) — `sme/`

- [Application Modeling](sme/sme-am-ba-docs.md)
- [Simple Model Editor (SME)](sme/sme-ba-docs.md)
- [Form Modeling – Binding](sme/sme-binding-ba-docs.md)
- [Creating an A12 Document by Using a Combination Model](sme/sme-cmm-ba-docs.md)
- [Content Modeling](sme/sme-content-ba-docs.md)
- [Workspace Data](sme/sme-data-ba-docs.md)
- [SME (Module) Development](sme/sme-dev-docs.md)
- [Model Graph Diagrams and the Data Modeling Perspective](sme/sme-diagram-ba-docs.md)
- [Document Modeling](sme/sme-dm-ba-docs.md)
- [Form Modeling](sme/sme-fm-ba-docs.md)
- [Master Detail Modeling](sme/sme-mdmm-ba-docs.md)
- [Modeling an A12 Document to A12 Document Mapping](sme/sme-mm-ba-docs.md)
- [Overview Modeling](sme/sme-om-ba-docs.md)
- [Query Modeling](sme/sme-qm-ba-docs.md)
- [Transformer Modeling](sme/sme-tfm-ba-docs.md)
- [Tree Modeling](sme/sme-tm-ba-docs.md)

### Client — `client/`

- [A12 Client](client/client-documentation-bundle.md)

### Expression Language — `expression/`

- [Expressions](expression/expression-docs.md)

### Relationship Engine — `relationship_engine/`

- [Relationship Engine & CDM](relationship_engine/relationshipengine-dev-docs.md)

### Overview Engine — `overview_engine/`

- [Overview Engine](overview_engine/overviewengine-dev-docs.md)

### Tree Engine — `tree_engine/`

- [Tree Engine](tree_engine/treeengine-dev-docs.md)

### Diagram Editor — `diagram_editor/`

- [Introduction](diagram_editor/de-dev-docs.md)

### Transformer — `transformer/`

- [Transformer](transformer/transformer-documentation.md)

### Data Distribution — `data_distribution/`

- [Data Distribution](data_distribution/datadistribution-documentation.md)

### Notification Center — `notification_center/`

- [Notification Center](notification_center/notificationcenter-documentation.md)

### User Management — `user_management/`

- [UAA - User Management](user_management/um-documentation-src.md)

### UAA (auth) — `uaa/`

- [User Authentication and Authorization](uaa/uaa-documentation-src.md)

### CMS — `cms/`

- [Content Management System for Developers](cms/cms-dev-docs.md)
- [Content Management System for Content Managers](cms/cms-user-docs.md)

### Plasma (design system) — `plasma/`

- [Accessibility](plasma/accessibility.md)
- [Plasma – The Design System](plasma/plasma-concept-documentation.md)
- [Toolkit](plasma/toolkits.md)
- [Tutorials](plasma/tutorials.md)

### Print Engine — `print_engine/`

- [Print Modeling](print_engine/print-modeling-documentation.md)
- [Print Engine](print_engine/print-technical-documentation.md)

### Workflows — `workflows/`

- [Workflow Modeling](workflows/ba-docs.md)
- [Workflows](workflows/dev-docs.md)

### Base — `base/`

- [Base](base/base-documentation-bundle.md)

### Project Template — `project_template/`

- [Project Template](project_template/project-template-documentation.md)

### Build & Deployment — `build_and_deployment/`

- [Build and Deployment Pipelines](build_and_deployment/a12-pipelines-doc.md)
- [Helm A12 Stack](build_and_deployment/a12-stack.md)

### Test Data Generator — `tdg/`

- [Test Data Generator](tdg/tdg-docs-public.md)

### Utils — Server Connector — `utils_server_connector/`

- [Server Connector](utils_server_connector/server-connector-documentation-src.md)

### Utils — Localization — `utils_localization/`

- [Localization](utils_localization/utils-localization-documentation-bundle.md)

### Utils — Logging & Collections — `utils_logging_collections/`

- [Collections](utils_logging_collections/utils-collections-documentation.md)
- [Logging](utils_logging_collections/utils-logging-documentation.md)

## Widgets Showcase

Mirror of the [A12 Widgets Showcase](https://www.mgm-tp.com/a12.htmlshowcase/#/) (`@com.mgmtp.a12.widgets/widgets-core`) — 65 component pages. Tool: `src/scrape_showcase/`.

### Widgets — Basics — `widgets/basics/`

- [Basics/Accessibility](widgets/basics/accessibility.md)
- [Basics/Theme/Theming](widgets/basics/theme.md)
- [Basics/Utility classes](widgets/basics/utility-classes.md)

### Widgets — Business Case — `widgets/business-case/`

- [Widgets/Business case/Chat](widgets/business-case/chat.md)
- [Widgets/Business case/Comment/Comment template](widgets/business-case/comment.md)
- [Widgets/Business case/Faceted search/Filter bar](widgets/business-case/faceted-search.md)
- [Widgets/Business case/Login layout](widgets/business-case/login-layout.md)
- [Widgets/Business case/Validation bar](widgets/business-case/validation-bar.md)
- [Widgets/Business case/Wizard](widgets/business-case/wizard.md)

### Widgets — Data Display — `widgets/data-display/`

- [Widgets/Data display/Bullet list/Ordered list](widgets/data-display/bullet-list.md)
- [Widgets/Data display/Card](widgets/data-display/card.md)
- [Widgets/Data display/Counter](widgets/data-display/counter.md)
- [Widgets/Data display/Deprecated charts/Deprecated bar chart](widgets/data-display/deprecated-charts.md)
- [Widgets/Data display/Interaction hint](widgets/data-display/interaction-hint.md)
- [Widgets/Data display/Interactive tile](widgets/data-display/interactive-tile.md)
- [Widgets/Data display/List](widgets/data-display/list.md)
- [Widgets/Data display/Pagination](widgets/data-display/pagination.md)
- [Widgets/Data display/Table](widgets/data-display/table.md)
- [Widgets/Data display/Tag](widgets/data-display/tag.md)
- [Widgets/Data display/Tooltip](widgets/data-display/tooltip.md)
- [Widgets/Data display/Tree table](widgets/data-display/tree-table.md)
- [Widgets/Data display/Tree](widgets/data-display/tree.md)

### Widgets — Data Entry — `widgets/data-entry/`

- [Widgets/Data entry/Autocomplete](widgets/data-entry/autocomplete.md)
- [Widgets/Data entry/Checkbox](widgets/data-entry/checkbox.md)
- [Widgets/Data entry/File upload](widgets/data-entry/file-upload.md)
- [Widgets/Data entry/Icon picker](widgets/data-entry/icon-picker.md)
- [Widgets/Data entry/Multiselect](widgets/data-entry/multiselect.md)
- [Widgets/Data entry/Pickers/Date picker](widgets/data-entry/pickers.md)
- [Widgets/Data entry/Rich text editor](widgets/data-entry/rich-text-editor.md)
- [Widgets/Data entry/Rich text editor](widgets/data-entry/rich-text-editor/default.md)
- [Widgets/Data entry/Rich text editor](widgets/data-entry/rich-text-editor/plugin-creation.md)
- [Widgets/Data entry/Rich text editor](widgets/data-entry/rich-text-editor/pre-built-plugins.md)
- [Widgets/Data entry/Select](widgets/data-entry/select.md)
- [Widgets/Data entry/Text area](widgets/data-entry/text-area.md)
- [Widgets/Data entry/Text field](widgets/data-entry/text-field.md)

### Widgets — Experimental — `widgets/experimental/`

- [Experimental/Calendar](widgets/experimental/calendar.md)
- [Experimental/Diagram shapes](widgets/experimental/diagram-shapes.md)
- [Experimental/Slider](widgets/experimental/slider.md)
- [Experimental/Supporting panes layout](widgets/experimental/supporting-panes-layout.md)

### Widgets — Feedback — `widgets/feedback/`

- [Widgets/Feedback/Modal notification](widgets/feedback/modal-notification.md)
- [Widgets/Feedback/Progress bar](widgets/feedback/progress-bar.md)
- [Widgets/Feedback/Progress indicator](widgets/feedback/progress-indicator.md)
- [Widgets/Feedback/Toasts/Toast](widgets/feedback/toasts.md)

### Widgets — General — `widgets/general/`

- [Widgets/General/Buttons/Button](widgets/general/buttons.md)
- [Widgets/General/Icon](widgets/general/icon.md)
- [Widgets/General/Link](widgets/general/link.md)
- [Widgets/General/Popup menu](widgets/general/popup-menu.md)

### Widgets — Get Started — `widgets/get-started/`

- [Get started/Quick start](widgets/get-started/quick-start.md)

### Widgets — Layout — `widgets/layout/`

- [Widgets/Layout/Collapsible panel](widgets/layout/collapsible-panel.md)
- [Widgets/Layout/Content box](widgets/layout/content-box.md)
- [Widgets/Layout/Layout grid/Template](widgets/layout/layout-grid.md)
- [Widgets/Layout/Master detail](widgets/layout/master-detail.md)
- [Widgets/Layout/Modal overlay](widgets/layout/modal-overlay.md)
- [Widgets/Layout/Resize handler](widgets/layout/resize-handler.md)
- [Widgets/Layout/Split view](widgets/layout/split-view.md)

### Widgets — Navigation — `widgets/navigation/`

- [Widgets/Navigation/Accordion](widgets/navigation/accordion.md)
- [Widgets/Navigation/Dropdown](widgets/navigation/dropdown.md)
- [Widgets/Navigation/Menu/Flyout menu](widgets/navigation/menu.md)
- [Widgets/Navigation/Tab panel](widgets/navigation/tab-panel.md)

### Widgets — Utils — `widgets/utils/`

- [Widgets/Utils/Css ellipsis](widgets/utils/css-ellipsis.md)
- [Widgets/Utils/Lines ellipsis](widgets/utils/lines-ellipsis.md)
- [Widgets/Utils/Message](widgets/utils/message.md)
- [Widgets/Utils/Portals/Attached portal](widgets/utils/portals.md)
- [Widgets/Utils/Resize detector](widgets/utils/resize-detector.md)
- [Widgets/Utils/Typography](widgets/utils/typography.md)
