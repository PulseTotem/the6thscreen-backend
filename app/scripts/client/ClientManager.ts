/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../core/Logger.ts" />
/// <reference path="../model/Profil.ts" />

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
     *
     * @method listenClient
     */
    listenClient() {
        var self = this;

        this._clientSocket.on("RetrieveProfilDescription", function(profilDescription) {
            // profilDescription : {"userID" : string, "sdiID" : string, "profilID" : string}
            self.sendProfilDescription(profilDescription.userID, profilDescription.sdiID, profilDescription.profilID);
        });

        this._clientSocket.on("RetrieveCallDescription", function(callDescription) {
            // callDescription : {"callID" : string}
            self.sendCallDescription(callDescription.callID);
        });


    }

    /**
     * Retrieve Profil instance description and send it to client.
     *
     * @method sendProfilDescription
     * @param {string} userID - The User ID.
     * @param {string} sdiID - The SDI ID.
     * @param {string} profilID - The Profil ID.
     */
    sendProfilDescription(userID : string, sdiID : string, profilID : string) {
        var profil = Profil.read(parseInt(profilID));
        Logger.debug(profil.toCompleteJSONObject());
        this._clientSocket.emit("ProfilDescription", profil.toCompleteJSONObject());
    }

    /**
     * Retrieve Call instance description and send it to client.
     *
     * @method sendCallDescription
     * @param {string} callID - The Call ID.
     */
    sendCallDescription(callID : string) {
        var call = Call.read(parseInt(callID));
        Logger.debug(call.toCompleteJSONObject());
        this._clientSocket.emit("CallDescription", call.toCompleteJSONObject());
    }
}