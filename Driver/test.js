const Firefly = require('./firefly-api.js');
require('dotenv').config();

async function test() {
	// Fetch school from code
	//console.log(await Firefly.getHost(process.env.CODE));

	// Create instance
	const instance = new Firefly(process.env.HOST);
	instance.setDeviceId(process.env.DEVICE_ID);

	// API version
	//console.log(await instance.apiVersion);

	// Authentication URL
	//console.log(instance.authUrl);
	//instance.authenticate();
	instance.completeAuthentication(process.env.XML);

	//console.log(await instance.verifyCredentials());

	// Events/timetable
	//let finalDate = new Date();
	//finalDate.setFullYear(2021);
	//console.log(await instance.getEvents(new Date(), finalDate));

	// Messages
	//console.log(await instance.messages);

	// Bookmarks
	//console.log(await instance.bookmarks);

	// Groups
	//console.log(await instance.groups);
}

test();