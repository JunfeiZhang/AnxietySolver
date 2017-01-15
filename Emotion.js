var https = require('https');
var fs = require('fs');

var options = {
    host: "api.projectoxford.ai",
    port: 443,
    path: '/emotion/v1.0/recognize',
    method: 'POST',
    headers: {
        "Ocp-Apim-Subscription-Key": "ae677e2ca7bf470294d8ba60a788ab4a"
    }
};

var postData = { "url": "http://static4.businessinsider.com/image/56c640526e97c625048b822a-480/donald-trump.jpg" };

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
        fs.writeFile("/Users/apple/Desktop/AnxietySolver/test.js",chunk, function(err) {
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


// console.log("result is ",result);


// write data to request body
// fs.writeFile("/Users/apple/Desktop/AnxietySolver/test.js",postData, function(err) {
//     if(err) {
//         return console.log(err);
//     }

//     console.log("The file was saved!");
// }); 
req.write(JSON.stringify(postData));
req.end();
