/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../model/Profil.ts" />
/// <reference path="../model/Call.ts" />
/// <reference path="../model/CallType.ts" />
/// <reference path="../model/User.ts" />
/// <reference path="../model/SDI.ts" />
/// <reference path="../model/Zone.ts" />

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
            // profilDescription : {"profilId" : string}
            self.sendProfilDescription(profilDescription.profilId);
        });

        this._clientSocket.on("RetrieveUserDescription", function(userDescription) {
            // userDescription : {"userId" : string}
            self.sendUserDescription(userDescription.userId);
        });

        this._clientSocket.on("RetrieveSDIDescription", function(sdiDescription) {
            // sdiDescription : {"sdiId" : string}
            self.sendSDIDescription(sdiDescription.sdiId);
        });

        this._clientSocket.on("RetrieveZoneDescription", function(zoneDescription) {
            // zoneDescription : {"zoneId" : string}
            self.sendZoneDescription(zoneDescription.zoneId);
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
     * @param {string} profilId - The Profil Id.
     */
    sendProfilDescription(profilId : string) {
        var profil = Profil.read(parseInt(profilId));
        Logger.debug(profil.toCompleteJSONObject());
        this._clientSocket.emit("ProfilDescription", profil.toCompleteJSONObject());
    }

    /**
     * Retrieve User instance description and send it to client.
     *
     * @method sendUserDescription
     * @param {string} userId - The User Id.
     */
    sendUserDescription(userId : string) {
        var user = User.read(parseInt(userId));
        Logger.debug(user.toCompleteJSONObject());
        this._clientSocket.emit("UserDescription", user.toCompleteJSONObject());
    }

    /**
     * Retrieve SDI instance description and send it to client.
     *
     * @method sendSDIDescription
     * @param {string} sdiId - The SDI Id.
     */
    sendSDIDescription(sdiId : string) {
        var sdi = SDI.read(parseInt(sdiId));
        Logger.debug(sdi.toCompleteJSONObject());
        this._clientSocket.emit("SDIDescription", sdi.toCompleteJSONObject());
    }

    /**
     * Retrieve Zone instance description and send it to client.
     *
     * @method sendZoneDescription
     * @param {string} zoneId - The Zone Id.
     */
    sendZoneDescription(zoneId : string) {
        var zone = Zone.read(parseInt(zoneId));
        Logger.debug(zone.toCompleteJSONObject());
        this._clientSocket.emit("ZoneDescription", zone.toCompleteJSONObject());
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