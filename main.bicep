param location string = resourceGroup().location

param storageAccountName string = '${uniqueString(resourceGroup().id)}plan'

param serverName string = uniqueString('sql', resourceGroup().id)
param sqlDBName string = 'cascadia'
param dbUsername string
param dbPassword string


@description('The name of the function app that you wish to create.')
param appName string = 'fnapp${uniqueString(resourceGroup().id)}'
param cascadiaNamespace string


param eventhubConnectionString string
param responsesEHConnectionString string

//________________________STORAGE _____________________________________________
resource storageaccount 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Premium_LRS'
  }
}

resource blobStorage 'Microsoft.Storage/storageAccounts/blobServices@2021-09-01' = {
  name: 'default'
  parent: storageaccount
}

resource cascadiaContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2021-09-01' = {
  name: 'cascadia'
  parent: blobStorage
}

// //________________________DATABASE _____________________________________________
// resource server 'Microsoft.Sql/servers@2019-06-01-preview' = {
//   name: serverName
//   location: location
//   properties: {
//     administratorLogin: dbUsername
//     administratorLoginPassword: dbPassword
//   }
// }
// resource sqlDB 'Microsoft.Sql/servers/databases@2020-08-01-preview' = {
//   name: '${server.name}/${sqlDBName}'
//   location: location
//   sku: {
//     name: 'Basic'
//     tier: 'Basic'
//   }
// }

//______________________COMPUTE______________________________________
resource functionApp 'Microsoft.Web/sites@2021-03-01' = {
  name: appName
  location: location
  kind: 'functionapp,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    reserved: true
    siteConfig: {
      linuxFxVersion: 'python|3.7'
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageaccount.listKeys().keys[0].value}'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'python'
        }
        {
          name: 'cascadiaNamespace'
          value: cascadiaNamespace
        }
        {
          name: 'dbServer'
          value: serverName
        }
        {
          name: 'dbName'
          value: sqlDBName
        }
        {
          name: 'dbUsername'
          value: dbUsername
        }
        {
          name: 'dbPassword'
          value: dbPassword
        }
        {
          name: 'eventhubConnectionString'
          value: eventhubConnectionString
        }
        {
          name: 'responsesEHConnectionString'
          value: responsesEHConnectionString
        }
      ]
      ftpsState: 'FtpsOnly'
      minTlsVersion: '1.2'
    }
    httpsOnly: true
  }
}
