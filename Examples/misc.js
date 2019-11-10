// Require modules
const request = require("request");
const parseString = require("xml2js").parseString;
const environment = require("./environment.json");

// Get a school instance
function GetSchoolInstance() {
    request.get("https://appgateway.fireflysolutions.co.uk/appgateway/school/" + environment.schoolCode, function (error, response, body) {
        parseString(body, function (error, result) {
            console.log("\nSchool Instance");
            console.log(`Exists - ${result.response.$.exists}`);
            console.log(`Enabled - ${result.response.$.enabled}`);
            console.log(`School Name - ${result.response.name}`);
            console.log(`SSL - ${result.response.address[0].$.ssl}`);
            console.log(`Host - ${result.response.address[0]._}`);
            console.log(`Installation ID - ${result.response.installationId}`);
        })
    })
}
GetSchoolInstance();

// Get the API version
function GetAPIVersion() {
    request.get(environment.host + "/login/api/version", function (error, response, body) {
        parseString(body, function (error, result) {
            console.log("\nFirefly API Version")
            console.log(`Firefly Version 6 - ${result.version.$.firefly6}`);
            console.log(`Version - ${result.version.majorVersion}.${result.version.minorVersion}.${result.version.incrementVersion}`);
        });
    });
}
GetAPIVersion();