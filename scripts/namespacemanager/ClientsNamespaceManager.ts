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


		this.addListenerToSocket('HashDescription', function(description) { self.manageHashDescription(description); });
    }


////////////////////// Begin: Manage HashDescription //////////////////////

	/**
	 * Manage Hash description and send corresponding SDI structure and Profil description to client.
	 *
	 * @method manageHashDescription
	 * @param {any} hashDescription - The Hash Description.
	 * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
	 */
	manageHashDescription(hashDescription : any, self : ClientsNamespaceManager = null) {
		// hashDescription : {"hash" : string}
		var self = this;

		var hash = hashDescription.hash;

		//TODO : Manage Hash
		var sdiId = 1;
		var profilId = 1;

		//TODO : self.sendObjectDescriptionFromId(SDI, sdiId, "SDIDescription");

		//TODO : self.sendObjectDescriptionFromId(Profil, profilId, "ProfilDescription");

		var sdiDesc = {
			"id": 1,
			"name": "MySDI",
			"description": "My awesome SDI !"
		};
		sdiDesc["zones"] = [];
		var zoneDesc = {
			"id": 1,
			"name": "Central Zone",
			"description": "Only one zone",
			"width": 100,
			"height": 100,
			"positionFromTop": 0,
			"positionFromLeft": 0
		};
		zoneDesc["behaviour"] = {
			"id": 1,
			"name": "AppearanceBehaviour",
			"description": "No transition effect."
		};
		zoneDesc["callTypes"] = [];
		var callTypeDesc = {
			"id": 1,
			"name": "TwitterSearch in Central Zone",
			"description": ""
		};
		callTypeDesc["renderer"] = {
			"id": 1,
			"name": "TweetRenderer",
			"description": "Renderer pour les tweets."
		};
		callTypeDesc["policy"] = {
			"id": 1,
			"name": "BasicPolicy",
			"description": ""
		};
		zoneDesc["callTypes"].push(callTypeDesc);
		sdiDesc["zones"].push(zoneDesc);

		self.socket.emit("SDIDescription", self.formatResponse(true, sdiDesc));

		var profilDesc = {};
		profilDesc["zoneContents"] = [];
		var zoneContent = {
			"id": 1,
			"name": "Central Zone Content",
			"description": ""
		};
		zoneContent["zone"] = {
			"id" : 1
		};
		zoneContent["widget"] = null;
		zoneContent["relativeTimeline"] = {
			"id" : 1,
			"name": "Timeline for Central Zone"
		};
		zoneContent["relativeTimeline"]["relativeEvents"] = [];
		var relativeEvent = {
			"id" : 1,
			"name": "Tweet Search Event",
			"position" : 0,
			"duration" : 60*5
		};
		relativeEvent["call"] = {
			"id" : 1,
			"name": "My Super Tweet Search Call"
		};
		zoneContent["relativeTimeline"]["relativeEvents"].push(relativeEvent);
		zoneContent["absoluteTimeline"] = null;

		profilDesc["zoneContents"].push(zoneContent);

		self.socket.emit("ProfilDescription", self.formatResponse(true, profilDesc));

	}

////////////////////// End: Manage HashDescription //////////////////////

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