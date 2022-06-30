Param(
    [Parameter(Mandatory=$true)]
    [string]$dest,
    [Parameter(Mandatory=$true)]
    [string]$archivePath
)

$trSub="614f7a4f-e655-4593-94b6-37b4e7d75fba"
$trRg="rg_cascadia_dev_wus"
$trAppName="wapi-tr-cascadia-api"
$trAppSettings=@{
    "APPINSIGHTS_INSTRUMENTATIONKEY"="ff2df491-0fa1-4805-8e35-b5a1625fdfb2";
    "APPINSIGHTS_PROFILERFEATURE_VERSION"="1.0.0";
    "APPINSIGHTS_SNAPSHOTFEATURE_VERSION"="1.0.0";
    "APPLICATIONINSIGHTS_CONNECTION_STRING"="InstrumentationKey=ff2df491-0fa1-4805-8e35-b5a1625fdfb2;IngestionEndpoint=https://westus-0.in.applicationinsights.azure.com/";
    "ApplicationInsightsAgent_EXTENSION_VERSION"="~2";
    "ASPNETCORE_ENVIRONMENT"="Development";
    "DiagnosticServices_EXTENSION_VERSION"="~3";
    "EventHub:NotificationUrl"="https://cascadia-poc2.servicebus.windows.net/responses/messages";
    "EventHub:TokenPayload:client_id"="bde442e0-4ff2-4907-aea1-f02376c293af";
    "EventHub:TokenUrl"="https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token";
    "InstrumentationEngine_EXTENSION_VERSION"="disabled";
    "SnapshotDebugger_EXTENSION_VERSION"="disabled";
    "WEBSITE_NODE_DEFAULT_VERSION"="6.9.1";
    "XDT_MicrosoftApplicationInsights_BaseExtensions"="disabled";
    "XDT_MicrosoftApplicationInsights_Java"="1";
    "XDT_MicrosoftApplicationInsights_Mode"="recommended";
    "XDT_MicrosoftApplicationInsights_NodeJS"="1";
    "XDT_MicrosoftApplicationInsights_PreemptSdk"="disabled";
    "EventHub:TokenPayload:client_secret"="@Microsoft.KeyVault(SecretUri=https://cascadiakeyvault.vault.azure.net/secrets/eventHubClientSecret)}";
    "AzureAd:Instance"="https://login.microsoftonline.com/";
    "AzureAd:Domain"="microsoft.onmicrosoft.com";
    "AzureAd:ClientId"="6bc146cd-3ba0-4dbe-b63c-4748bbe33ef8";
    "AzureAd:TenantId"="72f988bf-86f1-41af-91ab-2d7cd011db47";
    "AzureAd:CallbackPath"="/signin-oidc";
    "DISABLE_AUTH"="True";
    "DISABLE_READ_ROLE"="True";
    "DISABLE_READWRITE_ROLE"="True";
}

$cestSub="e258612c-c13b-4c2a-b567-429faeb0fc4f"
$cestRg="CR22_Group1"
$cestAppName="wapi-cest-cascadia-api"
$cestAppSettings=@{
    "ASPNETCORE_ENVIRONMENT"="Development";
    "EventHub:NotificationUrl"="https://cascadia-poc2.servicebus.windows.net/responses/messages";
    "EventHub:TokenPayload:client_id"="bde442e0-4ff2-4907-aea1-f02376c293af";
    "EventHub:TokenUrl"="https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token";
    "EventHub:TokenPayload:client_secret"="@Microsoft.KeyVault(SecretUri=https://cest-cascadia-vault.vault.azure.net/secrets/eventHubClientSecret)";
    "AzureAd:Instance"="https://login.microsoftonline.com/";
    "AzureAd:Domain"="microsoft.onmicrosoft.com";
    "AzureAd:ClientId"="1cce739c-90e0-47f5-9453-d472468aebef";
    "AzureAd:TenantId"="9e5bfe83-2518-4260-bd9d-84845927a9bf";
    "AzureAd:CallbackPath"="/signin-oidc";
    "DISABLE_AUTH"="True";
    "DISABLE_READ_ROLE"="True";
    "DISABLE_READWRITE_ROLE"="True";
}

$cest2Sub="e258612c-c13b-4c2a-b567-429faeb0fc4f"
$cest2Rg="CR22_Group2"
$cest2AppName="wapi-cest2-cascadia-api"
$cest2AppSettings=@{
    "ASPNETCORE_ENVIRONMENT"="Development";
    "EventHub:NotificationUrl"="https://cascadia-poc2.servicebus.windows.net/responses/messages";
    "EventHub:TokenPayload:client_id"="bde442e0-4ff2-4907-aea1-f02376c293af";
    "EventHub:TokenUrl"="https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token";
    "EventHub:TokenPayload:client_secret"="@Microsoft.KeyVault(SecretUri=https://cest-cascadia-vault.vault.azure.net/secrets/eventHubClientSecret)";
    "AzureAd:Instance"="https://login.microsoftonline.com/";
    "AzureAd:Domain"="microsoft.onmicrosoft.com";
    "AzureAd:ClientId"="796a90c1-01a5-4ba5-9e4b-8c8269e8f63b";
    "AzureAd:TenantId"="9e5bfe83-2518-4260-bd9d-84845927a9bf";
    "AzureAd:CallbackPath"="/signin-oidc";
    "DISABLE_AUTH"="True";
    "DISABLE_READ_ROLE"="True";
    "DISABLE_READWRITE_ROLE"="True";
}

$wckSub="5c0fa230-3d02-4d6a-a213-f46e3ade2cfb"
$wckRg="WCK-MS-RG"
$wckAppName="wapi-wck-cascadia-api"
$wckAppSettings=@{
    "ASPNETCORE_ENVIRONMENT"="Development";
    "EventHub:NotificationUrl"="https://cascadia-poc2.servicebus.windows.net/responses/messages";
    "EventHub:TokenPayload:client_id"="bde442e0-4ff2-4907-aea1-f02376c293af";
    "EventHub:TokenUrl"="https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token";
    "EventHub:TokenPayload:client_secret"="@Microsoft.KeyVault(SecretUri=https://wck-cascadia-keyvault.vault.azure.net/secrets/eventHubClientSecret)";
    "AzureAd:Instance"="https://login.microsoftonline.com/";
    "AzureAd:Domain"="microsoft.onmicrosoft.com";
    "AzureAd:ClientId"="cd16e505-0f76-4e62-be25-85394f83f06e";
    "AzureAd:TenantId"="3414e006-a4eb-4c14-9876-ff35c184e672";
    "AzureAd:CallbackPath"="/signin-oidc";
    "DISABLE_AUTH"="True";
    "DISABLE_READ_ROLE"="True";
    "DISABLE_READWRITE_ROLE"="True";
}

$clarkedSub="77fc08c3-d69a-42b5-bc10-fe85dd7193c0"
$clarkedRg="cascadia-rg"
$clarkedAppName="wapi-wz34enfjxvcsk"
$clarkedAppSettings=@{
    "ASPNETCORE_ENVIRONMENT"="Development";
    "EventHub:NotificationUrl"="https://cascadia-poc2.servicebus.windows.net/responses/messages";
    "EventHub:TokenPayload:client_id"="bde442e0-4ff2-4907-aea1-f02376c293af";
    "EventHub:TokenUrl"="https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token";
    "EventHub:TokenPayload:client_secret"="@Microsoft.KeyVault(SecretUri=https://wck-cascadia-keyvault.vault.azure.net/secrets/eventHubClientSecret)";
    "AzureAd:Instance"="https://login.microsoftonline.com/";
    "AzureAd:Domain"="microsoft.onmicrosoft.com";
    "AzureAd:ClientId"="";
    "AzureAd:TenantId"="";
    "AzureAd:CallbackPath"="/signin-oidc";
    "DISABLE_AUTH"="True";
    "DISABLE_READ_ROLE"="True";
    "DISABLE_READWRITE_ROLE"="True";
}

function deploy([String]$sub, [String]$rg, [String]$appName, [String]$archivePath, [hashtable]$appSettings) {
    Connect-AzAccount -subscription $sub
    if (!$?) {
        Write-Error "Connect-AzAccount failed"
        exit 1
    }
    publish-azwebapp -resourcegroupname $rg -name $appName -archivepath $archivePath -Force
    set-azwebapp -resourcegroupname $rg -name $appName -AppSettings $appSettings
}

if ($dest -ieq "tr") {
    deploy $trSub $trRg $trAppName $archivePath $trAppSettings
} elseif ($dest -ieq "cest") {
    deploy $cestSub $cestRg $cestAppName $archivePath $cestAppSettings
} elseif ($dest -ieq "cest2") {
    deploy $cest2Sub $cest2Rg $cest2AppName $archivePath $cest2AppSettings
} elseif ($dest -ieq "wck") {
    deploy $wckSub $wckRg $wckAppName $archivePath $wckAppSettings
} elseif ($dest -ieq "build") {
    dotnet publish -c Release
    Compress-Archive -path .\CascadiaWeb\bin\Release\netcoreapp3.1\publish\* -destinationpath $archivePath -Force
} else  {
    Write-Host "Unknown destination"
}