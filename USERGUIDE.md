# Disaster Response Data Sharing Accelerator - User Guide

The Disaster Response Data Sharing Accelerator was built from a US-based effort titled ‘Cascadia Disaster Response Exercise’.  Consequently, the documentation below uses codebase references under the ‘Cascadia’ title.  This document provides user guidance on installing / configuring the environment (Section I.), accessing / using the environment (Section II.), and extending the data sharing solution (Section III.).  Note that there is a separate document titled ‘Disaster Response Data Sharing Accelerator - Overview’ that should be referenced prior to utilizing the content below.  An Azure subscription is required.

## I. How to Install and Configure the Environment

## 1. Provisioning Infrastructure and API

* Clone the repository containing the Cascadia source code
* Create an Azure Resource Group called “Cascadia”
  * Additional details available here: https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal

![](images/create_resource_group.png)

* Go to the root folder containing the Cascadia cloned file and execute the main .bicep file
  * Additional details available here: https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview?tabs=bicep 

![](images/bicep.png)

* This bicep script will request 4 parameters, that includes:
  * DbUsername: The username of your Database.
  * DbPassword: The password of your Database.
  * CascadiaNamespace: The partner's name on the network.
  * requestEHConnectionString: The connection string of the Request’s EventHub on the network
  * responseEHConnectionString: The connection string of the Response’s EventHub on the network

## 2. Deploying Infrastructure

* From the Overview section within the Cascadia Resource Group, click on the Function App Resource link under the ‘Resources’ list. 

![](images/function_app_resource.png)

* From the screen that appears, under the ‘Functions’ menu on the left, click ‘Functions’.

![](images/functions.png)

* Click on ‘Create’ and follow the list of instructions up until the point that says ‘Create an Azure Function’ – **do not follow any instructions from that point-on**.

![](images/create_azure_function.png)

* After following these steps, open your Visual Studio Code.
* Click on ‘File’, then ‘Open Folder’ and select the folder "azureFunctions” under the repository folder.
* Choose the ‘Azure’ menu icon on the left which will display available Azure Subscriptions.

![](images/azure_subscriptions.png)

* Select the ‘Workspace’ menu option and click the ‘deploy’ icon to the right then choose ‘Deploy to Function App’ from the pop-up.

![](images/deploy_to_function_app.png)

* From the list of available subscriptions that appears, choose your Azure subscription, and deploy it.

![](images/deploy.png)

## 3. Deploying an API component

* 1. Build required source code (assumes that a .net environment is installed):
  * a)	Clone the Git Repository
  * b)	Navigate to CascadiaAPI directory inside Git Repository
  * c)	Build Cascadia API (see commands below)
    * i.	dotnet restore
    * ii.	dotnet publish -c Release
* 2.	Zip the Cascadia API build artifacts:
  * a)	Compress-Archive -path .\bin\Release\netcoreapp3.1\publish\* -destinationpath .\cascadia-api.zip -Force
  * Take note of the path to the zip file as this will be referenced in **Step 3** immediately below
* 3.	Deploy Cascadia API to Azure:
  * a)	Follow the instructions via this hyperlink to deploy the Cascadia API: [Deploy files to App Service - Azure App Service | Microsoft Docs](https://learn.microsoft.com/en-us/azure/app-service/deploy-zip?tabs=powershell#deploy-a-zip-package)

## 4. Provisioning and Deploying a UI Component

* Prerequisites
  * NodeJS
  * An M365 account
  * [Teams Toolkit Visual Studio Code Extension](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension) version after 1.55 or [TeamsFx CLI](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/teamsfx-cli)

* User Configurations
  * 1.	Reference Cascadia App source code file via GitHub (.env.teamsfx.dev)
    * REACT_APP_VIEW_NAME=
    * REACT_APP_PARTNER_NAME=
    * REACT_APP_STORAGE_CONNECTION_STRING=
    * REACT_APP_API_ENDPOINT= 
    * a.	Set View Name = to Requestor or Provider, depending on your status
    * b.	Set Partner Name = to match how your organization is listed in the database
    * c.	Set Connection String = to SaaS Token for Data Lake Storage (only applies to requestors)
    * d.	Set API Endpoint = to match the Endpoint URL that results from GitHub actions
  * 2.	Reference Cascadia App source code file via GitHub (config.dev.json)
    * a)	Reference line "reportendpoint" : "<PowerBI URI>"
    * b)	Set <PowerBI URI> = (Get this URI from your PowerBI administrator and reference the section at the end of this document on implementing the PowerBI service).


