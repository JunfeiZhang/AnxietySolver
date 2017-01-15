var fs = require('fs');
var request = require('request');

var options = {
    uri: "https://api.projectoxford.ai/emotion/v1.0/recognize",
    headers: {
        "Ocp-Apim-Subscription-Key": "ae677e2ca7bf470294d8ba60a788ab4a",
        "Content-Type": "application/octet-stream"
    },
    body: fs.readFileSync('trump.jpg')
};

request.post(options, function (err, httpResponse, body){
    console.log("Error: " + err);
    console.log("Body: " + body);
});

/*
function emotionDetection(picURL) {
    var readStream = fs.createReadStream('trump.jpg');
    var imgData = "";
    readStream
        .on('data', function (chunk) {
            imgData += chunk;
        })
        .on('end', function () {
            console.log(imgData);
            console.log("image file read.");
            beginDetection(imgData);
        });
}

function beginDetection(imgData) {
    

    var result;

    var req = https.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            // result = chunk;
            // console.log(`BODY: ${chunk}`);
            result = JSON.parse(chunk);
            console.log(`BODY:`, chunk);
            fs.writeFile("/Users/apple/Desktop/AnxietySolver/test.json",chunk, function(err) {
                if(err) {
                    return console.log(err);
            }
                console.log("The file was saved!");
            }); 
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });


    req.write(imgData);
    req.end();
}*/

//emotionDetection("http://static4.businessinsider.com/image/56c640526e97c625048b822a-480/donald-trump.jpg");