/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../core/Logger.ts" />
/// <reference path="../model/Profil.ts" />
/// <reference path="../model/Call.ts" />
/// <reference path="../model/CallType.ts" />

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
            // profilDescription : {"userId" : string, "sdiId" : string, "profilId" : string}
            self.sendProfilDescription(profilDescription.userId, profilDescription.sdiId, profilDescription.profilId);
        });

        this._clientSocket.on("RetrieveCallDescription", function(callDescription) {
            // callDescription : {"callId" : string}
            self.sendCallDescription(callDescription.callId);
        });

        this._clientSocket.on("RetrieveCallTypeDescription", function(callTypeDescription) {
            // callTypeDescription : {"callTypeId" : string}
            self.sendCallTypeDescription(callTypeDescription.callTypeId);
        });




    }

    /**
     * Retrieve Profil instance description and send it to client.
     *
     * @method sendProfilDescription
     * @param {string} userId - The User Id.
     * @param {string} sdiId - The SDI Id.
     * @param {string} profilId - The Profil Id.
     */
    sendProfilDescription(userId : string, sdiId : string, profilId : string) {
        var profil = Profil.read(parseInt(profilId));
        Logger.debug(profil.toCompleteJSONObject());
        this._clientSocket.emit("ProfilDescription", profil.toCompleteJSONObject());
    }

    /**
     * Retrieve Call instance description and send it to client.
     *
     * @method sendCallDescription
     * @param {string} callId - The Call Id.
     */
    sendCallDescription(callId : string) {
        var call = Call.read(parseInt(callId));
        Logger.debug(call.toCompleteJSONObject());
        this._clientSocket.emit("CallDescription", call.toCompleteJSONObject());
    }

    /**
     * Retrieve CallType instance description and send it to client.
     *
     * @method sendCallTypeDescription
     * @param {string} callTypeId - The CallType Id.
     */
    sendCallTypeDescription(callTypeId : string) {
        var callType = CallType.read(parseInt(callTypeId));
        Logger.debug(callType.toCompleteJSONObject());
        this._clientSocket.emit("CallTypeDescription", callType.toCompleteJSONObject());
    }
}