/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../core/Logger.ts" />

/**
 * Manage connection with client.
 *
 * @class ClientManager
 */
class ClientManager {

    /**
     * The 6th Screen Client's socket.
     *
     * @property _clientSocket
     * @type any
     */
    private _clientSocket : any;

    /**
     * Constructor.
     *
     * @constructor
     * @param {any} clientSocket - The Client's socket.
     */
    constructor(clientSocket : any) {
        this._clientSocket = clientSocket;
        this.listenClient();
    }

    /**
     * Prepare socket for orders from Client.
     */
    listenClient() {
        var self = this;

        this._clientSocket.on("RetrieveSDIDescription", function(sdiInformation) {
            // sdiInformation : {"userID" : string, "sdiID" : string, "timelineID" : string}
            self.sendSDIDescription(sdiInformation.userID, sdiInformation.sdiID, sdiInformation.timelineID);
        });
    }

    /**
     * Retrieve SDI instance description and send it to client.
     *
     * @param {string} userID - The User ID.
     * @param {string} sdiID - The SDI ID.
     * @param {string} timelineID - The Timeline ID.
     */
    sendSDIDescription(userID : string, sdiID : string, timelineID : string) {
        //TODO Retrieve information from model
        this._clientSocket.emit("SDIDescription", {"test" : "super!"});
    }
}