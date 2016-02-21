/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

var fs = require('fs');

/**
 * Contains CMS Configuration information.
 *
 * @class CMSConfig
 */
class CMSConfig {

	/**
	 * Host.
	 *
	 * @property host
	 * @type string
	 * @static
	 */
	static host : string = "";

	/**
	 * Users path.
	 *
	 * @property usersPath
	 * @type string
	 * @static
	 */
	static usersPath : string = "users/";

	/**
	 * Retrieve CMS information from file description.
	 *
	 * @method retrieveCMSInformation
	 * @static
	 */
	static retrieveCMSInformation() {
		if(CMSConfig.host == "") {
			var file = __dirname + '/cms_config.json';

			try {
				var cmsInfos = JSON.parse(fs.readFileSync(file, 'utf8'));
				CMSConfig.host = cmsInfos.host;
			} catch (e) {
				Logger.error("CMS configuration file can't be read.");
				Logger.debug(e);
				//TODO ? Throw Exception ?
			}
		}
	}

	/**
	 * Return Host.
	 *
	 * @method getHost
	 * @static
	 * @return {string} - Host.
	 */
	static getHost() : string {
		CMSConfig.retrieveCMSInformation();
		return CMSConfig.host;
	}
}