# Welcome to the unofficial Firefly API
[Firefly](https://www.fireflylearning.com) is a virtual learning environment for schools. This repository is formed from monitoring the API requests made by the mobile app to construct this repository.

This repository provides example code in Node.JS. You will also need to install the needed modules and libraries using `npm install`.
Please see the [wiki](https://github.com/JoshHeng/Firefly-API/wiki) for detailed information about the API.

## environment.json
You will need to configure `environment.json` with your own environment data. You can copy `environment.example.json` to do this.
* `"schoolCode": "SCHOOLCODE"` This is the code for the school which is provided by your school. It is needed to determine the host for all other requests, and is used within the mobile app to login.
* `"host": "https://host.fireflycloud.net"` This is the base API endpoint which is generally the main page of the Firefly instance. This can be obtained by a school code by submitting an API request - please see the misc section for details.
