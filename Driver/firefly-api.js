/*

Firefly API Driver

*/
const axios = require('axios');
const xml = require('fast-xml-parser');

class Firefly {
	constructor(host, appId = 'FireFly Node.JS Driver') {
		if (!host) throw 'Invalid host';
		this.host = host;
		this.appId = appId;
	}

	get apiVersion() {
		return new Promise(async (resolve, reject) => {
			axios.get(this.host + '/login/api/version')
			.then(response => {
				try {
					response = xml.parse(response.data)
				}
				catch (error) { return reject(error) }

				return resolve({
					major: response.version.majorVersion,
					minor: response.version.minorVersion,
					increment: response.version.incrementVersion
				})
			})
			.catch(error => reject(error));
		});
	}
}

module.exports = Firefly;