param skuName string = 'F1'
param skuCapacity int = 1
param location string = resourceGroup().location
param appName string = uniqueString(resourceGroup().id)

param keyVaultUrl string
param sqlConnectionType string = 'SQLServer'

param ehNotificationUrl string = 'https://cascadia-poc2.servicebus.windows.net/responses/messages'
param ehTokenUrl string = 'https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token'
param ehClientId string = 'bde442e0-4ff2-4907-aea1-f02376c293af'

var appServicePlanName = toLower('asp-${appName}')
var webSiteName = toLower('wapi-${appName}')

var eventHubClientSecretRef = '@Microsoft.KeyVault(SecretUri=${keyVaultUrl}/secrets/eventHubClientSecret)'
var sqlConnectionStringRef = '@Microsoft.KeyVault(SecretUri=${keyVaultUrl}/secrets/sqlConnectionString)'

resource appServicePlan 'Microsoft.Web/serverfarms@2020-06-01' = {
  name: appServicePlanName // app serivce plan name
  location: location // Azure Region
  sku: {
    name: skuName
    capacity: skuCapacity
  }
  tags: {
    displayName: 'HostingPlan'
    ProjectName: appName
  }
}

resource appService 'Microsoft.Web/sites@2020-06-01' = {
  name: webSiteName // Globally unique app serivce name
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  tags: {
    displayName: 'WebApi'
    ProjectName: appName
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      minTlsVersion: '1.2'
      appSettings: [
        {
          name: 'EventHub:NotificationUrl'
          value: ehNotificationUrl
        }
        {
          name: 'EventHub:TokenPayload:client_id'
          value: ehClientId
        }
        {
          name: 'EventHub:TokenPayload:client_secret'
          value: eventHubClientSecretRef
        }
        {
          name: 'EventHub:TokenUrl'
          value: ehTokenUrl
        }
      ]
    }
  }
}

resource appServiceLogging 'Microsoft.Web/sites/config@2020-06-01' = {
  name: '${appService.name}/logs'
  properties: {
    applicationLogs: {
      fileSystem: {
        level: 'Information'
      }
    }
    httpLogs: {
      fileSystem: {
        retentionInMb: 40
        enabled: true
      }
    }
    failedRequestsTracing: {
      enabled: true
    }
    detailedErrorMessages: {
      enabled: true
    }
  }
}

resource appServiceConnectionStrings 'Microsoft.Web/sites/config@2020-06-01' = {
  name: '${appService.name}/connectionstrings'
  properties: {
    DefaultConnection: {
      value: sqlConnectionStringRef
      type: sqlConnectionType
    }
  }
}
