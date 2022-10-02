# Disaster Response Data Sharing Accelerator - User Guide

The Disaster Response Data Sharing Accelerator was built from a US-based effort titled ‘Cascadia Disaster Response Exercise’.  Consequently, the documentation below uses codebase references under the ‘Cascadia’ title.  This document provides user guidance on installing / configuring the environment (Section I.), accessing / using the environment (Section II.), and extending the data sharing solution (Section III.).  Note that there is a separate document titled ‘Disaster Response Data Sharing Accelerator - Overview’ that should be referenced prior to utilizing the content below.  An Azure subscription is required.

## I. How to Install and Configure the Environment

## 1. Provisioning Infrastructure and API

* Clone the repository containing the Cascadia source code
* Create an Azure Resource Group called “Cascadia”
  * Additional details available here: https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal

![](images/create_azure_function.png)

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

