var restify = require('restify');
var builder = require('botbuilder');
var Promise = require('bluebird');
var request = require('request-promise').defaults({ encoding: null });
var fs = require('fs');
var request = require('request');
//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log("server", server);
    console.log("process", process);
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

        builder.Prompts.text(session, "img");
        //builder.Prompts.choice(session, "Which region would you like sales for?", salesData); 
    },
    function (session, next) {
        var msg = session.message;
        if (msg.attachments.length) {
            // Message with attachment, proceed to download it.
            // Skype attachment URLs are secured by a JwtToken, so we need to pass the token from our bot.
            var attachment = msg.attachments[0];
            console.log(attachment.contentUrl + ".jpg");
            picURL = attachment.contentUrl;
            var postData = { "url": picURL };
            var npostData = JSON.stringify(postData);
            console.log("my json is !" + npostData);
            //builder.Prompts.text(session, attachment.contentUrl);
            var options = {
                uri: "https://api.projectoxford.ai/emotion/v1.0/recognize",
                headers: {
                    "Ocp-Apim-Subscription-Key": "94f9f2bdd86b4bffa775d4b35da04dfa",
                    "Content-Type": "application/json"
                },
                body: npostData
            };
            console.log("options", options);
            builder.Prompts.text(session, JSON.stringify(options));		             

            request.post(options, function (err, httpResponse, body){
                builder.Prompts.text(session, body);
                //console.log("Body: " + body.scores);
                var theBody = JSON.parse(body);
                console.log("aaaaa  aaa" + body);
                 console.log("aaaaa  bbb" + theBody);
                // console.log("aaaaa  ccc" + theBody[0]);
                // console.log("aaaaa  ddd" + theBody[0].scores);
                // console.log("aaaaa  eee" + theBody[0].scores.anger);
                
                  var angerScore = JSON.stringify(theBody[0].scores.anger);
                  builder.Prompts.text(session, angerScore);
                
                // var info = body[0].scores.happiness;
                // var ifHappy = body[0].scores.happiness + body[0].scores.surprise;
                // var ifSad = body[0].scores.anger + body[0].scores.contempt + body[0].scores.disgust + body[0].scores.fear + body[0].scores.sadness;
                // var result;
                // if(ifHappy >= 0.5 && ifSad < 0.5){
                //     result = "Happy";
                // }else if(ifHappy < 0.5 && ifSad >= 0.5){
                //     result = "Sad";
                // }else{
                //     result="OK";
                // }
                 builder.Prompts.text(session, "HAHAHAHA SADER");
                
            });
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

// Helper methods

// Request file with Authentication Header
var requestWithToken = function (url) {
    return obtainToken().then(function (token) {
        return request({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/octet-stream'
            }
        });
    });
};

// Promise for obtaining JWT Token (requested once)
var obtainToken = Promise.promisify(connector.getAccessToken.bind(connector));

var isSkypeMessage = function (message) {
    return message.source === 'skype';
};


// Read Synchrously
//  console.log("\n *START* \n");
//  var content = fs.readFileSync("test.json");
//  console.log("Output Content : \n"+ content);
//  console.log("\n *EXIT* \n");

// var data = JSON.parse(content)
// console.log(data['arr[]']);
// var body = JSON.parse(content);


// console.log(result);