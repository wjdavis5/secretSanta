$previewNamespaceId = "51144b53a8654b1ab4e57727ef389993" 
$productionNamespaceId = "4d1ebcc717eb49bfb731f7172059fe63"
$NAMESPACE_ID = "4d1ebcc717eb49bfb731f7172059fe63" 

$keys = npx wrangler kv:key list --namespace-id $NAMESPACE_ID | ConvertFrom-Json
$keyNames = $keys | ForEach-Object { $_.name }
$keyNames | ConvertTo-Json -Depth 100 | Set-Content -Path "keys_to_delete.json"
npx wrangler kv:bulk delete --namespace-id $NAMESPACE_ID .\keys_to_delete.json
Remove-Item .\keys_to_delete.json -Force