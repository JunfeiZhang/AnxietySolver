var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
//var intents = new builder.IntentDialog();

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://api.projectoxford.ai/luis/v2.0/apps/e1a8acae-662e-4837-bf0a-c531b2fdafcc?subscription-key=fd596b70161840649483bf6f3e2ae354&verbose=true';
var recognizer = new builder.LuisRecognizer(model);
var iDialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', iDialog);

server.post('/api/messages', connector.listen());

// Add intent handlers
iDialog.matches('skipIntro', [
    function (session, args, next) {
        
        builder.Prompts.choice(session, "Which region would you like sales for?", salesData); 
    },
    function (session, results) {
        if (results.response) {
            var region = salesData[results.response.entity];
            session.send("We sold %(units)d units for a total of %(total)s.", region); 
        } else {
            session.send("ok");
        }
    }
]);

iDialog.matches('beHappy', [
    function (session, args, next) {
        builder.Prompts.text(session, 'beHappy');
        
    },
    function (session, results) {
       builder.Prompts.text(session, 'beHappy2');
    }
]);

iDialog.onDefault(builder.DialogAction.send("How are you today?"));

var salesData = {
    "west": {
        units: 200,
        total: "$6,000"
    },
    "central": {
        units: 100,
        total: "$3,000"
    },
    "east": {
        units: 300,
        total: "$9,000"
    }
};

// Very simple alarm scheduler
// var alarms = {};
// setInterval(function () {
//     var now = new Date().getTime();
//     for (var key in alarms) {
//         var alarm = alarms[key];
//         if (now >= alarm.timestamp) {
//             var msg = new builder.Message()
//                 .address(alarm.address)
//                 .text("Here's your '%s' alarm.", alarm.title);
//             bot.send(msg);
//             delete alarms[key];
//         }
//     }
// }, 15000);

//=========================================================
// Bots Dialogs
//=========================================================

// bot.dialog('/', [
//     function (session, args, next) {
//         if (session.userData.name) {
//             session.beginDialog('/profil');
//         } else {
//             next();
//         }
//     },
//     function (session, results) {
//         session.send('Hello %s!', session.userData.name);
//     }
// ]);

// bot.dialog('/profil', [
//     function (session) {
//         builder.Prompts.text(session, 'Hi! What is your name?');
//     },
//     function (session, results) {
//         console.log("test: "+results.response);
//         session.userData.name = results.response;
//         session.endDialog();
//     }
// ]);