---
source: https://geta12.com/docs/2025.06/ext5/overall/model_naming_conventions/index.html
category: overall
docid: model_naming_conventions
scraped: 2026-06-12
---

# Model Naming Conventions

This section is about guidelines for modelers on how to name their models and model elements (e.g. field names, groups names, validation rules, enumeration values, categories etc.).
Consistent naming is beneficial to keep a good readability for you and others and provides a better understanding of your project structure.

## Introduction

Every (technical) name should be meaningful and describe the element it represents.
Try to keep the names as short as possible yet as long as necessary.
For multi-word names, choose a case style and stay consistent.

|  |  |
| --- | --- |
|  | We recommend using Upper Camel Case (UpperCamelCase). |

If you have many models in your workspace, we recommend using subfolders to maintain a clear overview; for example, collect all models belonging to the same module in one folder.
Alternatively, if you use relationships, collect all generated Document Models or Binding Overviews in a separate subfolder.

![Workspace Modelnames](https://geta12.com/docs/2025.06/ext5/overall/model_naming_conventions/assets/Workspace-Modelnames.png)

## Naming of Document Model Elements

We recommend naming field names, group names, computation and validation rules, enumeration values, enumeration categories consistently in Upper Camel Case.
For field and group names be aware of the context and avoid redundancy (e.g. do not name a field "EmployeeFirstName", which is already in the group "Employee").
For validation rules, construct the name by combining the name of the error field with a description of the valid case (e.g., 'PassengerAgeOver18' for the error condition 'FieldFilled(PassengerAge) And DifferenceInYears(PassengerAge, Today) < 18').
For computation rules, append the suffix 'Comp' to the name of the computed field to easily associate the computation rule with its computed field.
For instance, the computed field is named "MyField", so the computation rule is named "MyFieldComp".

|  |  |
| --- | --- |
|  | We recommend naming fields and rules descriptively. If you find this approach unsuitable for your model, do not adhere rigidly, but still maintain naming consistency. |

The root group should be named like the Document Model (e.g. in Document Model "PassengerRequest\_DM" name the root group "PassengerRequest").

|  |  |
| --- | --- |
|  | If you use Heterogeneity and your Document Model is a Subtype, the root group must be named like the root group of its Supertype Document Model. |

## Naming of Models

Since modeling starts from the Document Model, we recommend using its name for all respective UI Models if there is only one model type per Document Model (e.g. Document Model "PassengerRequest\_DM" inherits its name to the Form Model "PassengerRequest\_FM" etc.).
For Relationship Models construct the name from the name of the two underlying Document Models.
See Table 1. for examples referring to the Document Model "PassengerRequest".

|  |  |
| --- | --- |
|  | It is beneficial to quickly recognize which model belongs to which Document Model. |

Table 1. Model names based on the Document Model "PassengerRequest\_DM"


| Model Type | Standardized Name | Example |
| --- | --- | --- |
| App Model | Name\_AM | PreviewApp\_AM |
| Composed Document Model | Name\_CDM | PassengerRequest\_CDM |
| Composed Form Model | Name\_CFM | PassengerRequest\_CFM |
| Composed Overview Model | Name\_COM | PassengerRequest\_COM |
| Document Model | Name\_DM | PassengerRequest\_DM |
| Form Model | Name\_FM | PassengerRequest\_FM |
| Overview Model | Name\_OM | PassengerRequest\_OM |
| Master Detail Module Model | Name\_MDM | PassengerRequest\_MDM |
| Model Graph Diagram | Name\_MGD |  |
| Print Model | Name\_PM | PassengerRequest\_PM |
| Relationship | Name(DM1)Name(DM2) | PassengerRequestAddress |
| Tree Model | Name\_TM | PassengerRequest\_TM |
| Type Definition Model | Name\_TDM | CommonFields\_TDM |

If you use Relationship Models, Heterogeneity or Bindings, there are some specific models necessary.
See Table 2 for examples for the Relationship Model "PassengerRequestAddress".

|  |  |
| --- | --- |
|  | Do not change the default name of generated Document Models. |

Table 2. Names of special model types used for Relationships, Heterogeneity or Bindings (based on the Document Model "PassengerRequest\_DM")


| Model Type | Standardized Name | Example |
| --- | --- | --- |
| Additional Fields Form | Relationship\_LinkFields\_FM | PassengerRequestAddress\_LinkFields\_FM |
| Binding Overview Model (Available Items) | PersonAddress\_Person\_AvailableItems\_OM | PassengerRequestAddress\_AvailableItems\_OM |
| Binding Overview Model (Selected Items) | PersonAddress\_Person\_SelectedItems\_OM | PassengerRequestAddress\_SelectedItems\_OM |
| Generated Document Model | Relationship\_Role\_\_\_\_generated | PassengerRequestAddress\_Address\_\_\_\_generated |
| Link Document Model | Relationship\_LinkFields\_DM | PassengerRequestAddress\_LinkFields\_DM |
| Supertype (Document Model) | Name\_DM | Person\_DM |
| Subtype (Document Model) | Name(Supertype)Name(Subtype)\_DM | PersonIntern\_DM, PersonExtern\_DM |
