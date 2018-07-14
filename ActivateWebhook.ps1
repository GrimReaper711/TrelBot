$description = "TrelBot"
$callbackURL = "http://myserver:6969"
$idmodel = "id of the trello board to connect to"
$MemberToken = "ID of token"
$APIkey = "API Key"

$postParams = @{description=$description;callbackURL=$callbackURL;idModel=$idmodel}
$uri = "https://api.trello.com/1/tokens/" + $MemberToken + "/webhooks/?key=" + $APIkey
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Method POST  -Uri $uri -Body $postParams