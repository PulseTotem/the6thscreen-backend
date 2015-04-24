/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="./ShareNamespaceManager.ts" />

/// <reference path="../model/Profil.ts" />
/// <reference path="../model/User.ts" />
/// <reference path="../model/SDI.ts" />
/// <reference path="../model/Zone.ts" />
/// <reference path="../model/Call.ts" />
/// <reference path="../model/CallType.ts" />

class ClientsNamespaceManager extends ShareNamespaceManager {

    /**
     * Constructor.
     *
     * @constructor
     * @param {any} socket - The socket.
     */
    constructor(socket : any) {
        super(socket);

        var self = this;

        this.addListenerToSocket('RetrieveProfilDescription', function(description) { self.sendProfilDescription(description); });
        this.addListenerToSocket('RetrieveUserDescription', function(description) { self.sendUserDescription(description); });
        this.addListenerToSocket('RetrieveSDIDescription', function(description) { self.sendSDIDescription(description); });
        this.addListenerToSocket('RetrieveZoneDescription', function(description) { self.sendZoneDescription(description); });
        this.addListenerToSocket('RetrieveCallDescription', function(description) { self.sendCallDescription(description); });
        this.addListenerToSocket('RetrieveCallTypeDescription', function(description) { self.sendCallTypeDescription(description); });
    }

////////////////////// Begin: Manage SendProfilDescription //////////////////////

    /**
     * Retrieve Profil instance description and send it to client.
     *
     * @method sendProfilDescription
     * @param {any} profilDescription - The Profil Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendProfilDescription(profilDescription : any, self : ClientsNamespaceManager = null) {
        // profilDescription : {"profilId" : string}
        var self = this;

        var profilId = profilDescription.profilId;

        self.sendObjectDescriptionFromId(Profil, profilId, "ProfilDescription");
    }

////////////////////// End: Manage SendProfilDescription //////////////////////

////////////////////// Begin: Manage SendUserDescription //////////////////////

    /**
     * Retrieve User instance description and send it to client.
     *
     * @method sendUserDescription
     * @param {any} userDescription - The User Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendUserDescription(userDescription : any, self : ClientsNamespaceManager = null) {
        // userDescription : {"userId" : string}
        var self = this;

        var userId = userDescription.userId;

        self.sendObjectDescriptionFromId(User, userId, "UserDescription");
    }

////////////////////// End: Manage SendUserDescription //////////////////////

////////////////////// Begin: Manage SendSDIDescription //////////////////////

    /**
     * Retrieve SDI instance description and send it to client.
     *
     * @method sendSDIDescription
     * @param {any} sdiDescription - The SDI Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendSDIDescription(sdiDescription : any, self : ClientsNamespaceManager = null) {
        // sdiDescription : {"sdiId" : string}
        var self = this;

        var sdiId = sdiDescription.sdiId;

        self.sendObjectDescriptionFromId(SDI, sdiId, "SDIDescription");
    }

////////////////////// End: Manage SendSDIDescription //////////////////////

////////////////////// Begin: Manage SendZoneDescription //////////////////////

    /**
     * Retrieve Zone instance description and send it to client.
     *
     * @method sendZoneDescription
     * @param {any} zoneDescription - The Zone Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendZoneDescription(zoneDescription : any, self : ClientsNamespaceManager = null) {
        // zoneDescription : {"zoneId" : string}
        var self = this;

        var zoneId = zoneDescription.zoneId;

        self.sendObjectDescriptionFromId(Zone, zoneId, "ZoneDescription");
    }

////////////////////// End: Manage SendZoneDescription //////////////////////

////////////////////// Begin: Manage SendCallDescription //////////////////////

    /**
     * Retrieve Call instance description and send it to client.
     *
     * @method sendCallDescription
     * @param {any} callDescription - The Call Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendCallDescription(callDescription : any, self : ClientsNamespaceManager = null) {
        // callDescription : {"callId" : string}
        var self = this;

        var callId = callDescription.callId;

        self.sendObjectDescriptionFromId(Call, callId, "CallDescription");
    }

////////////////////// End: Manage SendCallDescription //////////////////////

////////////////////// Begin: Manage SendCallTypeDescription //////////////////////

    /**
     * Retrieve CallType instance description and send it to client.
     *
     * @method sendCallTypeDescription
     * @param {any} callTypeDescription - The CallType Description
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendCallTypeDescription(callTypeDescription : any, self : ClientsNamespaceManager = null) {
        // callTypeDescription : {"callTypeId" : string}
        var self = this;

        var callTypeId = callTypeDescription.callTypeId;

        self.sendObjectDescriptionFromId(CallType, callTypeId, "CallTypeDescription");
    }

////////////////////// End: Manage SendCallTypeDescription //////////////////////



}