/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/server/NamespaceManager.ts" />

/// <reference path="../model/Profil.ts" />
/// <reference path="../model/User.ts" />
/// <reference path="../model/SDI.ts" />
/// <reference path="../model/Zone.ts" />
/// <reference path="../model/Call.ts" />
/// <reference path="../model/CallType.ts" />

class ClientsNamespaceManager extends NamespaceManager {

    /**
     * Constructor.
     *
     * @constructor
     * @param {any} socket - The socket.
     */
    constructor(socket : any) {
        super(socket);
        this.addListenerToSocket('RetrieveProfilDescription', this.sendProfilDescription);
        this.addListenerToSocket('RetrieveUserDescription', this.sendUserDescription);
        this.addListenerToSocket('RetrieveSDIDescription', this.sendSDIDescription);
        this.addListenerToSocket('RetrieveZoneDescription', this.sendZoneDescription);
        this.addListenerToSocket('RetrieveCallDescription', this.sendCallDescription);
        this.addListenerToSocket('RetrieveCallTypeDescription', this.sendCallTypeDescription);
    }

    /**
     * Retrieve Profil instance description and send it to client.
     *
     * @method sendProfilDescription
     * @param {any} profilDescription - The Profil Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendProfilDescription(profilDescription : any, self : ClientsNamespaceManager = null) {
        Logger.debug("sendProfilDescription");
        // profilDescription : {"profilId" : string}
        if(self == null) {
            self = this;
        }

        var profilId = profilDescription.profilId;

        var profil = Profil.read(parseInt(profilId));
        self.socket.emit("ProfilDescription", profil.toCompleteJSONObject());
    }

    /**
     * Retrieve User instance description and send it to client.
     *
     * @method sendUserDescription
     * @param {any} userDescription - The User Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendUserDescription(userDescription : any, self : ClientsNamespaceManager = null) {
        Logger.debug("sendUserDescription");
        // userDescription : {"userId" : string}
        if(self == null) {
            self = this;
        }

        var userId = userDescription.userId;

        var user = User.read(parseInt(userId));
        self.socket.emit("UserDescription", user.toCompleteJSONObject());
    }

    /**
     * Retrieve SDI instance description and send it to client.
     *
     * @method sendSDIDescription
     * @param {any} sdiDescription - The SDI Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendSDIDescription(sdiDescription : any, self : ClientsNamespaceManager = null) {
        Logger.debug("sendSDIDescription");
        // sdiDescription : {"sdiId" : string}
        if(self == null) {
            self = this;
        }

        var sdiId = sdiDescription.sdiId;

        var sdi = SDI.read(parseInt(sdiId));
        self.socket.emit("SDIDescription", sdi.toCompleteJSONObject());
    }

    /**
     * Retrieve Zone instance description and send it to client.
     *
     * @method sendZoneDescription
     * @param {any} zoneDescription - The Zone Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendZoneDescription(zoneDescription : any, self : ClientsNamespaceManager = null) {
        Logger.debug("sendZoneDescription");
        // zoneDescription : {"zoneId" : string}
        if(self == null) {
            self = this;
        }

        var zoneId = zoneDescription.zoneId;

        var zone = Zone.read(parseInt(zoneId));
        self.socket.emit("ZoneDescription", zone.toCompleteJSONObject());
    }

    /**
     * Retrieve Call instance description and send it to client.
     *
     * @method sendCallDescription
     * @param {any} callDescription - The Call Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendCallDescription(callDescription : any, self : ClientsNamespaceManager = null) {
        Logger.debug("sendCallDescription");
        // callDescription : {"callId" : string}
        if(self == null) {
            self = this;
        }

        var callId = callDescription.callId;

        var call = Call.read(parseInt(callId));
        self.socket.emit("CallDescription", call.toCompleteJSONObject());
    }

    /**
     * Retrieve CallType instance description and send it to client.
     *
     * @method sendCallTypeDescription
     * @param {any} callTypeDescription - The CallType Description
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendCallTypeDescription(callTypeDescription : any, self : ClientsNamespaceManager = null) {
        Logger.debug("sendCallTypeDescription");
        // callTypeDescription : {"callTypeId" : string}
        if(self == null) {
            self = this;
        }

        var callTypeId = callTypeDescription.callTypeId;

        var callType = CallType.read(parseInt(callTypeId));
        self.socket.emit("CallTypeDescription", callType.toCompleteJSONObject());
    }
}