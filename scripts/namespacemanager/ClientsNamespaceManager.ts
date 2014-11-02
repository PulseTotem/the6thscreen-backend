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
        this.addListenerToSocket('RetrieveCallTypeDescriptionWithCallId', this.sendCallTypeDescriptionWithCallId);
    }

    /**
     * Retrieve Profil instance description and send it to client.
     *
     * @method sendProfilDescription
     * @param {any} profilDescription - The Profil Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendProfilDescription(profilDescription : any, self : ClientsNamespaceManager = null) {
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
        // callDescription : {"callId" : string}
        if(self == null) {
            self = this;
        }

        var callId = callDescription.callId;

        var call = Call.read(parseInt(callId));
        self.socket.emit("CallDescription", call.toCompleteJSONObject());
    }

    /**
     * Retrieve CallType instance description and send it to client with attached CallId.
     *
     * @method sendCallTypeDescriptionWithCallId
     * @param {any} callTypeDescriptionWithCallId - The CallType Description
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendCallTypeDescriptionWithCallId(callTypeDescriptionWithCallId : any, self : ClientsNamespaceManager = null) {
        // callTypeDescription : {"callTypeId" : string, "callId" : string}
        if(self == null) {
            self = this;
        }

        var callTypeId = callTypeDescriptionWithCallId.callTypeId;
        var callId = callTypeDescriptionWithCallId.callId;

        var callType = CallType.read(parseInt(callTypeId));
        var withCallId = callType.toCompleteJSONObject();
        withCallId["callId"] = callId;
        self.socket.emit("CallTypeDescriptionWithCallId", withCallId);
    }
}