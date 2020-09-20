const Firefly = require('./firefly-api.js');
require('dotenv').config();

async function test() {
	const instance = new Firefly(process.env.HOST);

	console.log(await instance.apiVersion)
}
test();