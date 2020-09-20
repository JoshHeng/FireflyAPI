/*

Firefly API Driver

*/
const axios = require('axios');
const xml = require('fast-xml-parser');
const { v4: uuidv4 } = require('uuid');

class Firefly {
	constructor(host, appId = 'Firefly Node.JS Driver') {
		if (!host) throw 'Invalid host';

		this.host = host;
		this.appId = appId;
	}

	// Get a school from a code
	static getHost(code) {
		if (!code) throw 'Invalid code';

		return new Promise((resolve, reject) => {
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
		return new Promise((resolve, reject) => {
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

	// Set or create the device id
	setDeviceId(id = null) {
		if (!id) id = uuidv4();
		this.deviceId = id;
		return id;
	}

	// Get an authentication url
	get authUrl() {
		if (!this.deviceId) this.setDeviceId();
		let redirect = encodeURIComponent(`${this.host}/Login/api/gettoken?ffauth_device_id=${this.deviceId}&ffauth_secret=&device_id=${this.deviceId}&app_id=${this.appId}`);
		return `${this.host}/login/login.aspx?prelogin=${redirect}`;
	}

	authenticate() {
		console.log(`Please go to Firefly, login and paste 'document.documentElement.outerHTML' in the browser console (CTRL+SHIFT+I). Then add it's response in completeAuthentication() - it should be something like "<token>...</token>"`);
		console.log('Device ID: ' + this.deviceId);
		console.log(this.authUrl);
	}
	completeAuthentication(xmlResponse) {
		if (!xmlResponse) throw 'Invalid xml';
		if (xmlResponse.slice(0, 1) === '"') xmlResponse = xmlResponse.slice(1);
		if (xmlResponse.slice(-1, -0) === '"') xmlResponse = xmlResponse.slice(0, -1);
		xmlResponse = xmlResponse.replace(/\\/g, '');

		if (xml.validate(xmlResponse) !== true) throw 'Invalid xml';

		try {
			var json = xml.parse(xmlResponse, { ignoreAttributes: false });
		}
		catch (err) { throw 'Invalid xml' }

		this.secret = json.token.secret;
		this.user = {
			username: json.token.user['@_username'],
			fullname: json.token.user['@_fullname'],
			email: json.token.user['@_email'],
			role: json.token.user['@_role'],
			guid: json.token.user['@_guid'],
		}
		this.classes = json.token.user.classes.class.map(_class => ({ guid: _class['@_guid'], name: _class['@_name'], subject: _class['@_subject'] }));

		return true;
	}

	// Verify token
	verifyCredentials() {
		if (!this.deviceId) return false;
		if (!this.secret) return false;

		return new Promise((resolve, reject) => {
			axios.get(this.host + `/Login/api/verifytoken?ffauth_device_id=${this.deviceId}&ffauth_secret=${this.secret}`)
			.then(response => {
				return resolve(response.data.valid);
			})
			.catch(error => reject(error));
		});
	}

	graphQuery(query) {
		return axios.post(this.host + `/_api/1.0/graphql?ffauth_device_id=${this.deviceId}&ffauth_secret=${this.secret}`, 'data='+encodeURIComponent(query), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
	}

	// Get events
	getEvents(start, end) {
		if (!this.user) throw 'Not authenticated';

		return new Promise((resolve, reject) => {
			this.graphQuery(`query Query {
				events(start: "${start.toISOString().slice(0, -5)+'Z'}", for_guid: "${this.user.guid}", end: "${end.toISOString().slice(0, -5)+'Z'}") {
					end, location, start, subject, description, guild, attendees { role, principal { guid, name }}
				}
			}`)
			.then(response => resolve(response.data.data.events))
			.catch(err => reject(err));
		});
	}
}

module.exports = Firefly;