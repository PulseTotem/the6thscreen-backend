/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

var fs = require('fs');

/**
 * Contains Contact Configuration information.
 *
 * @class ContactConfig
 */
class ContactConfig {

	/**
	 * Auth login.
	 *
	 * @property authLogin
	 * @type string
	 * @static
	 */
	static authLogin : string = "";

	/**
	 * Auth password.
	 *
	 * @property authPassword
	 * @type string
	 * @static
	 */
	static authPassword : string = "";

	/**
	 * Contact email.
	 *
	 * @property contactEmail
	 * @type string
	 * @static
	 */
	static contactEmail : string = "";

	/**
	 * Retrieve configuration information from file description.
	 *
	 * @method retrieveConfigurationInformation
	 * @static
	 */
	static retrieveConfigurationInformation() {
		if(ContactConfig.authLogin == "" && ContactConfig.authPassword == "" && ContactConfig.contactEmail == "") {
			var file = __dirname + '/contact_config.json';

			try {
				var configInfos = JSON.parse(fs.readFileSync(file, 'utf8'));
				ContactConfig.authLogin = configInfos.auth.login;
				ContactConfig.authPassword = configInfos.auth.password;
				ContactConfig.contactEmail = configInfos.contact;
			} catch (e) {
				Logger.error("Contact configuration file can't be read.");
				Logger.debug(e);
				//TODO ? Throw Exception ?
				}
		}
	}

	/**
	 * Return Auth Login.
	 *
	 * @method getAuthLogin
	 * @static
	 * @return {string} - Auth Login.
	 */
	static getAuthLogin() : string {
		ContactConfig.retrieveConfigurationInformation();
		return ContactConfig.authLogin;
	}

	/**
	 * Return Auth Password.
	 *
	 * @method getAuthPassword
	 * @static
	 * @return {string} - Auth Password.
	 */
	static getAuthPassword() : string {
		ContactConfig.retrieveConfigurationInformation();
		return ContactConfig.authPassword;
	}

	/**
	 * Return Contact Email.
	 *
	 * @method getContactEmail
	 * @static
	 * @return {string} - Contact Email.
	 */
	static getContactEmail() : string {
		ContactConfig.retrieveConfigurationInformation();
		return ContactConfig.contactEmail;
	}
}