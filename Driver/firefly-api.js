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

	// Get a school from a code
	static getHost(code) {
		if (!code) throw 'Invalid code';

		return new Promise(async (resolve, reject) => {
			axios.get('https://appgateway.fireflysolutions.co.uk/appgateway/school/' + code)
			.then(response => {
				try {
					response = xml.parse(response.data, { ignoreAttributes: false, allowBooleanAttributes: true })
				}
				catch (error) { return reject(error) }

				if ((!response.response) || response.response['@_exists'] === 'false') return resolve(null);

				return resolve({
					enabled: response.response['@_enabled'] === 'true',
					name: response.response.name,
					id: response.response.installationId,
					host: response.response.address['#text'],
					ssl: response.response.address['@_ssl'] === 'true'
				});
			})
			.catch(error => reject(error));
		});
	}

	// Get the host api version
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
				});
			})
			.catch(error => reject(error));
		});
	}
}

module.exports = Firefly;