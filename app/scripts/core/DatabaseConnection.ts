/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
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
     * Return DataBase's BaseURL.
     *
     * @method getBaseURL
     * @static
     * @return {string} - DataBase's BaseURL.
     */
    static getBaseURL() : string {
        return "http://" + DatabaseConnection.getHost() + ":" + DatabaseConnection.getPort().toString() + "/api";
    }

}