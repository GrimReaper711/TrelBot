// Basic express server to listen for Trello webhooks.
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

// Used to push message to chat services.
var request = require('request');

// See config.js for server ports and chat webhook configuration.
var config = require('./config');

// Create Discord-formatted message and send it to the Discord webhook.
const discordPost = (Formatmessage) => {
    let newMessage = {
        "username": config.name,
        "content": ' ',
        "embeds": [{
            title: Formatmessage.boardname,
            description: Formatmessage.desc,
            url: Formatmessage.link,
            footer: {
                text: Formatmessage.footer
            }
        }]
    }
    request({
        url: config.discordEndpoint,
        method: 'POST',
        json: true,
        body: newMessage
    }, function(error, response, body) {
        console.log('Discord message sent.');
        //console.log(response);
    });
}

// Figure out which endpoints are configured.
const post = (Formatmessage) => {
    console.log('Posting message...');
    discordPost(Formatmessage);
}

// Listen for HTTP POST requests in whatever folder you run this app in.
app.post('/', function(req,res) {
    res.end();
    console.log('Trello change recieved!');

    //Useful debug Lines:
    //console.log(req.body);
    //console.log(req.body.action.display.translationKey);
    //console.log('---------------------');
    //var Object = JSON.parse(req.body.action.data.old)
    //console.log(req.body.action.data);
    
    //Default Entries:
    var TrelloUser = req.body.action.memberCreator.fullName
    var Description = '**A change has been made in Trello by ' + TrelloUser + '**'
    var Footer = "I haven't coded a response for this type of change. I'll get to it."

    //Customized responses:

    if (req.body.action.display.translationKey === 'action_added_list_to_board') {
        var Footer = 'Nice list, very nice'
        var Description = '**List: \n' + req.body.action.data.list.name + '\n\nCreated by: \n' + TrelloUser + '**'
    }

    if (req.body.action.display.translationKey === 'action_moved_list_left') {
        var Footer = '--'
        var Description = '**List: \n' + req.body.action.data.list.name + '\n\nMoved to the left by: \n' + TrelloUser + '**'
    }

    if (req.body.action.display.translationKey === 'action_archived_list') {
        var Footer = 'Later Bro'
        var Description = '**List: \n' + req.body.action.data.list.name + '\n\nArchived by: \n' + TrelloUser + '**'
    }

    if (req.body.action.display.translationKey === 'action_moved_list_right') {
        var Footer = '--'
        var Description = '**List: \n' + req.body.action.data.list.name + '\n\nMoved to the right by: \n' + TrelloUser + '**'
    }

    if (req.body.action.display.translationKey === 'action_create_card') {
        var Footer = 'Get on it'
        var Description = '**Card: \n' + req.body.action.data.card.name + '\n\nCreated in list: \n' + req.body.action.data.list.name + '\n\nBy:\n' + TrelloUser + '**'
    }

    if (req.body.action.display.translationKey === 'action_renamed_card') {
        var Footer = 'Sweet'
        var Description = '**Card: \n' + req.body.action.data.old.name + '\n\nRenamed to: \n' + req.body.action.data.card.name + '\n\nBy:\n' + TrelloUser +'**'
    }

    if (req.body.action.display.translationKey === 'action_move_card_from_list_to_list') {
        var Footer = 'Nice'
        var Description = '**Card: \n' + req.body.action.data.card.name + '\n\nMoved from list: \n' + req.body.action.data.listBefore.name + '\n\nTo:\n' + req.body.action.data.listAfter.name + '\n\nBy:\n' + TrelloUser + '**'
    }

    if (req.body.action.display.translationKey === 'action_added_a_due_date') {
        var NewDate = new Date(req.body.action.data.card.due).toLocaleString('en-US')
        var Footer = 'Due Date added'
        var Description = '**User: \n' + TrelloUser + '\n\nSet A Due Date on Card: \n' + req.body.action.data.card.name + '\n\nDate:\n' + NewDate + '**'
    }
    
    if (req.body.action.display.translationKey === 'action_changed_a_due_date') {
        var OldDate = new Date(req.body.action.data.old.due).toLocaleString('en-US')
        var NewDate = new Date(req.body.action.data.card.due).toLocaleString('en-US')
        var Footer = 'Due Date Changed'
        var Description = '**User: \n' + TrelloUser + '\n\Changed A Due Date on Card: \n' + req.body.action.data.card.name + '\n\nDate:\n' + OldDate + '\n\nTo:\n' + NewDate + '**'
    }

    if (req.body.action.display.translationKey === 'action_member_joined_card') {
        var Footer = 'Get to work'
        var Description = '**User: \n' + req.body.action.data.member.name + '\n\Added to card: \n' + req.body.action.data.card.name + '\n\nBy:\n' + TrelloUser + '**'
    }

    if (req.body.action.display.translationKey === 'action_member_left_card') {
        var Footer = ':('
        var Description = '**User: \n' + req.body.action.data.member.name + '\n\nRemoved From card: \n' + req.body.action.data.card.name + '\n\nBy:\n' + TrelloUser + '**'
    }

    if (req.body.action.display.translationKey === 'action_sent_card_to_board') {
        var Card = req.body.action.data.card.name
        var Footer = 'Probably from the archive if this message was generated'
        var Description = '**User: \n' + TrelloUser + '\n\nMoved card: \n' + req.body.action.data.card.name + '\n\nTo: \n' + req.body.action.data.list.name + '** \n(Probably from the Archive)'
    }

    if (req.body.action.display.translationKey === 'action_delete_card') {
        var Footer = 'Goodbye sweet prince'
        var Description = '**User: \n' + TrelloUser + '\n\nDeleted card: \n' + req.body.action.data.card.id + '**'
    }

    if (req.body.action.display.translationKey === 'action_archived_card') {
        var Footer = 'Away you go'
        var Description = '**User: \n' + TrelloUser + '\n\Archived card: \n' + req.body.action.data.card.name + '**'
    }

    if (req.body.action.display.translationKey === 'action_changed_description_of_card') {
        var Footer = 'Make sure you read it real good'
        var Description = '**User: \n' + TrelloUser + '\n\nModified description on card: \n' + req.body.action.data.card.name + '\n\nTo: ' + req.body.action.data.card.desc + '**'
    }

    if (req.body.action.display.translationKey === 'action_comment_on_card') {
        var Footer = 'Hope it\`s a good one'
        var Description = '**User: \n' + TrelloUser + '\n\nCommented on card: \n' + req.body.action.data.card.name + '\n\n: ' + req.body.action.data.text + '**'
    }

    //Build a message from above and pass through to be sent to discord
    var Formatmessage = {
        'boardname': req.body.action.data.board.name,
        'desc': Description,
        'link': req.body.model.url,
        'footer' : Footer
    }
    //console.log(Description)
    //console.log(Formatmessage);
    post(Formatmessage);
});

app.head('/', function (req, res,next) {
    console.log(req.body);
    console.log("A header Request received - probably to enable the webhook");
    var Formatmessage = {
        'boardname': 'TreBot Online',
        'desc': 'If this message comes through, TrelBot is online',
        'link': 'https://github.com/GrimReaper711/TrelBot',
        'footer' : 'Huzzah'
    }
    post(Formatmessage);
    res.end();
})

// Start listening on the configured port.
app.listen(config.port, function () {
  console.log(config.name + ' running on port' + config.port + '.');
});