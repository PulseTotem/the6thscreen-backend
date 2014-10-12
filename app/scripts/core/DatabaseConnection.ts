/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../../libsdef/node.d.ts" />
/// <reference path="./Logger.ts" />
/// <reference path="./RestClient.ts" />

var fs = require('fs');

/**
 * Contains Database Connection information.
 *
 * @class DatabaseConnection
 */
class DatabaseConnection {

    /**
     * Host.
     *
     * @property host
     * @type string
     * @static
     */
    static host : string = "";

    /**
     * Port.
     *
     * @property port
     * @type number
     * @static
     */
    static port : number = -1;

	/**
	 * API Endpoint
	 *
	 * @property endpoint
	 * @type {string}
	 */
	static endpoint : string = "";

    /**
     * Retrieve connection information from file description.
     *
     * @method retrieveConnectionInformation
     * @static
     */
    static retrieveConnectionInformation() {
        if(DatabaseConnection.host == "" && DatabaseConnection.port == -1) {
            var file = __dirname + '/connection_infos.json';

            try {
                var connectionInfos = JSON.parse(fs.readFileSync(file, 'utf8'));
                DatabaseConnection.host = connectionInfos.host;
                DatabaseConnection.port = parseInt(connectionInfos.port);
	            DatabaseConnection.endpoint = connectionInfos.endpoint;
            } catch (e) {
                Logger.error("Connection configuration file can't be read.");
                //TODO ? Throw Exception ?
            }
        }
    }

    /**
     * Return DataBase host.
     *
     * @method getHost
     * @static
     * @return {string} - DataBase host.
     */
    static getHost() : string {
        DatabaseConnection.retrieveConnectionInformation();
        return DatabaseConnection.host;
    }

    /**
     * Return DataBase port.
     *
     * @method getPort
     * @static
     * @return {number} - DataBase port.
     */
    static getPort() : number {
        DatabaseConnection.retrieveConnectionInformation();
        return DatabaseConnection.port;
    }

	/**
	 * Return Database endpoint
	 *
	 * @method getEndpoint
	 * @static
	 * @returns {string} - Database endpoint
	 */
	static getEndpoint() : string {
		DatabaseConnection.retrieveConnectionInformation();
		return DatabaseConnection.endpoint;
	}

    /**
     * Return DataBase's BaseURL.
     *
     * @method getBaseURL
     * @static
     * @return {string} - DataBase's BaseURL.
     */
    static getBaseURL() : string {
        return "http://" + DatabaseConnection.getHost() + ":" + DatabaseConnection.getPort().toString();
    }

	/**
	 * Return Database endpoint to work on a specific model.
	 *
	 * @method modelEndpoint
	 * @static
	 * @param model
	 * @returns {string}
	 */
	static modelEndpoint(model : string) {
		return "/"+DatabaseConnection.getEndpoint()+"/"+model;
	}

	/**
	 * Return database endpoint to work on a specific object
	 *
	 * @method objectEndpoint
	 * @static
	 * @param objectType
	 * @param objectID
	 * @returns {string}
	 */
	static objectEndpoint(objectType : string, objectID : string) {
		return "/"+DatabaseConnection.getEndpoint()+"/"+objectType+"/"+objectID;
	}

	/**
	 * Return database endpoint to work on a specific association
	 *
	 * @method associationEndpoint
	 * @static
	 * @param objectType
	 * @param objectID
	 * @param associatedType
	 * @returns {string}
	 */
	static associationEndpoint(objectType : string, objectID : string, associatedType : string) {
		return "/"+DatabaseConnection.getEndpoint()+"/"+objectType+"/"+objectID+"/"+associatedType;
	}

	/**
	 * Return database endpoint to work on associated objects
	 *
	 * @method associatedObjectEndpoint
	 * @static
	 * @param objectType
	 * @param objectID
	 * @param associatedType
	 * @param associatedID
	 * @returns {string}
	 */
	static associatedObjectEndpoint(objectType : string, objectID : string, associatedType : string, associatedID : string) {
		return "/"+DatabaseConnection.getEndpoint()+"/"+objectType+"/"+objectID+"/"+associatedType+"/"+associatedID;
	}
}