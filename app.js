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
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//var intents = new builder.IntentDialog();

// // Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
// var model = 'https://api.projectoxford.ai/luis/v2.0/apps/e1a8acae-662e-4837-bf0a-c531b2fdafcc?subscription-key=fd596b70161840649483bf6f3e2ae354&verbose=true';
// var recognizer = new builder.LuisRecognizer(model);
// var iDialog = new builder.IntentDialog({ recognizers: [recognizer] });



bot.dialog('/', [
    function (session, args, next) {
        builder.Prompts.text(session, 'Do you wanna take a small test?(Upload a photo of you)');
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
            //builder.Prompts.text(session, JSON.stringify(options));		             

            request.post(options, function (err, httpResponse, body){
                //builder.Prompts.text(session, body);
                body = JSON.parse(body);
                // var angerScore = body[0].scores.anger.toString();
                // builder.Prompts.text(session, angerScore);
                var info = body[0].scores.happiness;
                var ifHappy = body[0].scores.happiness + body[0].scores.surprise;
                var ifSad = body[0].scores.anger + body[0].scores.contempt + body[0].scores.disgust + body[0].scores.fear + body[0].scores.sadness;
                var result;
                if(ifHappy >= 0.5 && ifSad < 0.5){
                    result = "You are looking great";
                }else if(ifHappy < 0.5 && ifSad >= 0.5){
                    result = "It seems that you are not very happy";
                }else{
                    result="You look fine";
                }
                 builder.Prompts.text(session, result);
                //  session.beginDialog('/img');
                
            });
        }},
        function (session, next) {
        // builder.Prompts.text(session, "img");
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Cute Images")
                    .subtitle("")
                    .text("Life is colorful! Do you feel any better?")
                    .images([
                        builder.CardImage.create(session, "http://d13yacurqjgara.cloudfront.net/users/925514/screenshots/2612233/egg_new-01.jpg")
                    ])
                    .tap(builder.CardAction.openUrl(session, ""))
            ]);
            session.send(msg);
        builder.Prompts.choice(session, "Do you like it?", "Yes,show me more|No, anything else?"); 
        
    },
    // function (session, next) {
    //     // builder.Prompts.text(session, "img");
    //     var joke = jokes[0];
    //     session.send("%(content)s", joke); 
    //     builder.Prompts.choice(session, "Do you like it?", "Yes,show me more|No, anything else?"); 
    // },
    function(session, next){
        msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.VideoCard(session)
                    .title("Anxiety Relief Music")
                    .subtitle("YouTube")
                    .text("This is a anxiety relief music that helps you relax and refresh yourself. Help you enjoy!")
                    .media([
                        builder.CardMedia.create(session, "https://r6---sn-p5qlsnll.googlevideo.com/videoplayback?sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cnh%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cupn%2Cexpire&expire=1484518291&ipbits=0&lmt=1471441162439184&initcwndbps=1161250&source=youtube&ms=au&mv=m&mt=1484496653&dur=7120.817&requiressl=yes&id=o-ADb1T11pcWZl1hKSiOx7XOFFngrbEfFW9xq8wCBLg29Q&pl=24&mn=sn-p5qlsnll&mm=31&upn=ipC97u5-lDg&ratebypass=yes&ei=Mp97WJXHO4rV8gS3xa2QCw&signature=79812792DE2A6F80701D45853A4C7D253ACE116A.DF83CBFBC5D98BA8CEEC5967801773405A24AA56&key=yt6&itag=22&mime=video%2Fmp4&nh=IgpwcjAzLmlhZDA3Kg0xOTguMjcuNzMuMTA0&ip=192.99.209.145&signature=&title=2%20HOURS%20OF%20CAT%20MUSIC%20-%20RELAXING%20MUSIC%20FOR%20CATS%20-%202%20HORA%20GATO%20M%C3%9ASICA%20-%20RELAXING%20SOUNDS&filename=2%20HOURS%20OF%20CAT%20MUSIC%20-%20RELAXING%20MUSIC%20FOR%20CATS%20-%202%20HORA%20GATO%20M%C3%9ASICA%20-%20RELAXING%20SOUNDS.mp4")
                    ])
                    .autoloop(true)
                    .autostart(false)
                    .shareable(true)                    
            ]);
        session.send(msg);
        builder.Prompts.choice(session, "Do you like it?", "Yes,show me more|No, anything else?"); 
    },
    function (session, next) {
         var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.ThumbnailCard(session)
                    .title("Relaxing Game")
                    .subtitle("Go ahead and have fun!")
                    .images([
                        builder.CardImage.create(session, "http://d13yacurqjgara.cloudfront.net/users/44967/screenshots/365048/i-will-never-lego.jpg")
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session, "http://www.shaunthesheep.com/games", "Play Game"),
                    ]),
            ]);
        //session.endDialog(msg);
        session.Prompts.text(session, "byebye");
}
    ]);

bot.dialog('/img', [
    function (session, args, next) {
        // builder.Prompts.text(session, "img");
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Cute Images")
                    .subtitle("")
                    .text("Life is colorful! Do you feel any better?")
                    .images([
                        builder.CardImage.create(session, "http://d13yacurqjgara.cloudfront.net/users/925514/screenshots/2612233/egg_new-01.jpg")
                    ])
                    .tap(builder.CardAction.openUrl(session, ""))
            ]);
            session.send(msg);
        builder.Prompts.choice(session, "Do you like it?", "Yes,show me more|No, anything else?"); 
    },
    function (session, result) {
        if (results.response) {
            if(results.response.entity == 1){
                session.beginDialog('/img');
            } else {
                session.beginDialog('/joke');
            }
        } else {
            session.send("ok");
        }
    }
])

bot.dialog('/joke', [
    function (session, args, next) {
        // builder.Prompts.text(session, "img");
        var joke = jokes[0];
        session.send("%(content)s", joke); 
        builder.Prompts.choice(session, "Do you like it?", "Yes,show me more|No, anything else?"); 
    },
    function (session, result) {
        if (results.response) {
            if(results.response.entity == 2){
                session.beginDialog('/img');
            } else {
                session.beginDialog('/joke');
            }
        } else {
            session.send("ok");
        }
    }
])



// Add intent handlers

// bot.dialog('skipIntro', [
//     function (session, args, next) {
//         // builder.Prompts.text(session, "img");
//         var msg = new builder.Message(session)
//             .textFormat(builder.TextFormat.xml)
//             .attachments([
//                 new builder.HeroCard(session)
//                     .title("Cute Images")
//                     .subtitle("")
//                     .text("Life is colorful! Do you feel any better?")
//                     .images([
//                         builder.CardImage.create(session, "http://d13yacurqjgara.cloudfront.net/users/925514/screenshots/2612233/egg_new-01.jpg")
//                     ])
//                     .tap(builder.CardAction.openUrl(session, ""))
//             ]);
//             session.send(msg);
//         builder.Prompts.choice(session, "Do you like it?", "Yes,show me more|No, anything else?"); 
//     },
//     function (session, result) {
//         if (results.response) {
//             if(results.response.entity == 1){
//                 session.beginDialog("/img");
//             } else {
//                 session.beginDialog("/joke");
//             }
//         } else {
//             session.send("ok");
//         }
//     }
// ]);

// iDialog.matches('beHappy', [
//     function (session, args, next) {
//         builder.Prompts.text(session, 'Do you wanna take a small test?(Upload a photo of you)');
//     },
//     function (session, next) {
//         var msg = session.message;
//         if (msg.attachments.length) {
//             // Message with attachment, proceed to download it.
//             // Skype attachment URLs are secured by a JwtToken, so we need to pass the token from our bot.
//             var attachment = msg.attachments[0];
//             console.log(attachment.contentUrl + ".jpg");
//             picURL = attachment.contentUrl;
//             var postData = { "url": picURL };
//             var npostData = JSON.stringify(postData);
//             console.log("my json is !" + npostData);
//             //builder.Prompts.text(session, attachment.contentUrl);
//             var options = {
//                 uri: "https://api.projectoxford.ai/emotion/v1.0/recognize",
//                 headers: {
//                     "Ocp-Apim-Subscription-Key": "94f9f2bdd86b4bffa775d4b35da04dfa",
//                     "Content-Type": "application/json"
//                 },
//                 body: npostData
//             };
//             console.log("options", options);
//             //builder.Prompts.text(session, JSON.stringify(options));		             

//             request.post(options, function (err, httpResponse, body){
//                 //builder.Prompts.text(session, body);
//                 body = JSON.parse(body);
//                 // var angerScore = body[0].scores.anger.toString();
//                 // builder.Prompts.text(session, angerScore);
//                 var info = body[0].scores.happiness;
//                 var ifHappy = body[0].scores.happiness + body[0].scores.surprise;
//                 var ifSad = body[0].scores.anger + body[0].scores.contempt + body[0].scores.disgust + body[0].scores.fear + body[0].scores.sadness;
//                 var result;
//                 if(ifHappy >= 0.5 && ifSad < 0.5){
//                     result = "You are looking great";
//                 }else if(ifHappy < 0.5 && ifSad >= 0.5){
//                     result = "It seems that you are not very happy";
//                 }else{
//                     result="You look fine";
//                 }
//                  builder.Prompts.text(session, result);
//                  session.beginDialog("/img");
//             });
//         }
//     }
// ]);

// iDialog.onDefault(builder.DialogAction.send("How are you today?"));

// Helper methods

var jokes = {
    "one": {
        content: "Q: how many programmers does it take to change a light bulb? A: none, that's a hardware problem"
    }

}

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