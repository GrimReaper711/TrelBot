# TrelBot - A Trello push bot that connects to Discord

TrelBot is a simple node.js bot  setup to allow a notifications to flow from trello boards to discord.
Once setup, it will work in private, team and public boards.

I'm not a js dev myself - I largely copied the work of ImStuartJones (https://github.com/imstuartjones/bitbot), made the appropriate modifications for it to work with trello.
Then spent a few hours troubleshooting and figuring out how things worked until I eventually got something working.

#1: Generate API Key & OAuth Secret
 - Go to https://trello.com/app-key and find your API Key (at the top of the page)
 - Also manually generate a token which will be needed to create the webhook. The link for which should be on the same page.

#2: Grab Board ID's by pulling them from the Trello API:
    -   I used PowerTrello module for PowerShell to do this, but you can use any other method you like to browse the Trello API. You need to get the board id's
    -   PowerTrello can be found here: https://github.com/adbertram/PowerTrello
    -   Once you have installed the PowerTrello module, run the following commands:

import-module PowerTrello
set-TrelloConfiguration -apiKey *API KEY FROM STEP 1* -AccessToken *Token ID also generated in Step 1*
get-TrelloConfiguration
get-trelloboard

Record the ID's of the boards you want to track from the list that is generated.

#3. Create or find your webhook inside discord 
    -Go to "Edit Channel" on one of your server's channels
    -> Webhooks -> Create Webhook or edit an existing to grab the Webhook URL.

#4. Setup config.js and start server.
    - Ensure Port and DiscordEndpoint has been added to the config.js file (name can be anything)
    - Run an `npm init` command to download the required npm packages. Run `npm start` to begin running Trelbot.

#4. Edit the ActivateWebhook.ps1 script and change the variables to match yours
    $description = "Description of the Bot/Anything"
    $callbackURL = "Where to send webhook data back to (URL/IP:PORT)". This needs to match the callbackURL in the config.js
    $idmodel = "id of the board to connect to, obtained from the api."
    $MemberToken = "The member token generated in step 1"
    $APIkey = "API Key obtained in step 1"

Once you run the script, a message should come through in discord indicating it's ready to go.