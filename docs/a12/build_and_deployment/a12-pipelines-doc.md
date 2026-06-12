---
source: https://geta12.com/docs/2025.06/ext5/build_and_deployment/a12-pipelines-doc/index.html
category: build_and_deployment
docid: a12-pipelines-doc
scraped: 2026-06-12
---

# Build and Deployment Pipelines

## Introduction

The Build and Deployment Pipelines are a collection of pre-made Jenkins pipelines to help you build your application and create deployments on the TPI dev cluster using the Helm A12 Stack charts.

## Pipeline Overview

Currently, there are two main Jenkinsfile included at root level of `project-template` and `project-deployment-template` as describing below.

### Build Pipeline

The build pipeline creates Docker images of your application and publishes these images to a Docker registry.
For a successful build of the main branch, the deployment pipeline is triggered to deploy the application into `int` environment.

### Deployment Pipeline

This will help to create a job for provisioning an environment on TPI Dev Cluster and deploy an application including infrastructure into it.

## Pipeline Operation

The pipelines themselves are located in

* [project-template (mgm internal only)](https://bitbucket.mgm-tp.com/projects/A12/repos/full-stack-project-template/browse)
  or your *application repo* respectively for *Build Pipeline*.
* [project-deployment-template (mgm internal only)](https://bitbucket.mgm-tp.com/projects/A12/repos/full-stack-project-deployment-template/browse)
  or your *deployment repo* respectively for *Setup and Deployment Pipelines*.

The deployment pipeline uses the [Helm A12 Stack charts](https://geta12.com/docs/BUILD_AND_DEPLOYMENT/a12-stack/index.html) to deploy your application and infrastructure using the configuration from the
[project-deployment-template (mgm internal only)](https://bitbucket.mgm-tp.com/projects/A12/repos/full-stack-project-deployment-template/browse)
or your *deployment repo* respectively.

To use the pipeline, you need to perform the following tasks:

* Download the template projects (from [Getting Started with Project Template](https://geta12.com/docs/PROJECT_TEMPLATE/project-template-documentation/index.html#_getting_started_with_the_project))
* Adapt the Jenkinsfile following the instruction in the file and README.md in each of the projects
* Create Jenkins jobs to use the pipelines
* Adapt the deployment values in Project Deployment Template to deploy your application built based on Project Template

For a complete guide on how to set up the pipelines, please see the documentation in the `README.md` file in each template project.
