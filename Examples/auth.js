// Require modules
const request = require("request");
const parseString = require("xml2js").parseString;
const environment = require("./environment.json");

// Verify the token
function VerifyToken() {
    request({
        method: 'GET',
        uri: environment.host + '/Login/api/verifytoken',
        qs: {
            ffauth_device_id: environment.deviceID,
            ffauth_secret: environment.secret
        },
        headers: {
            'User-Agent': 'test'
        }
    }, function (error, response, body) {
        result = JSON.parse(body);
        console.log("\nToken Validity:")
        if (result.valid) {
            console.log("Valid Token");
        }
        else {
            console.log("Invalid Token");
        }
    });
}
VerifyToken();

function DeleteToken(app_id) {
    request({
        method: 'GET',
        uri: environment.host + '/login/api/deletetoken',
        qs: {
            ffauth_device_id: environment.deviceID,
            ffauth_secret: environment.secret,
            app_id: app_id
        },
        headers: {
            'User-Agent': 'test'
        }
    }, function (error, response, body) {
        console.log("\nToken Deletion:")
        if (body == 'OK') {
            console.log("Success");
        }
        else {
            console.log("Failed");
        }
    });
}
//DeleteToken('app_id');

