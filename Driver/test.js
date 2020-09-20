const Firefly = require('./firefly-api.js');
require('dotenv').config();

async function test() {
	// Fetch school from code
	console.log(await Firefly.getHost(process.env.CODE));

	// Create instance
	const instance = new Firefly(process.env.HOST);

	// Test API version
	console.log(await instance.apiVersion)
}
test();