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
		var profilId = hash;

		//TODO : self.sendObjectDescriptionFromId(SDI, sdiId, "SDIDescription");

		var fail = function (err) {
			Logger.debug("SocketId: " + self.socket.id + " - manageHashDescription : send done with fail status for Profil with Id : " + profilId + " : "+err);
			self.socket.emit("SDIDescription", self.formatResponse(false, err));
		};




		var profil : Profil = null;
		var sdiDesc = {};
		var sdi : SDI = null;
		var profilDesc = {};

		var successLoadAssoSDI = function () {
			var zones : Array<Zone> = sdi.zones();

			var nbZones = 0;

			zones.forEach(function (zone) {
				var zoneDesc = zone.toJSONObject();

				var successLoadAssoZone = function () {
					var behaviour : Behaviour = zone.behaviour();

					zoneDesc["behaviour"] = behaviour.toJSONObject();

					zoneDesc["callTypes"] = [];

					var callTypes : Array<CallType> = zone.callTypes();
					var nbCT = 0;

					callTypes.forEach( function (callType) {

						var successCallTypeToCompleteJSON = function (data) {
							zoneDesc["callTypes"].push(data);
							nbCT++;
							if (nbCT == callTypes.length) {
								nbZones++;

								sdiDesc["zones"].push(zoneDesc);

								if (nbZones == zones.length) {
									self.socket.emit("SDIDescription", self.formatResponse(true, sdiDesc));
								}
							}
						};

						callType.toCompleteJSONObject(successCallTypeToCompleteJSON, fail);
					})
				};
				zone.loadAssociations(successLoadAssoZone, fail);
			});
		};

		var successLoadAssoProfil = function () {
			sdi = profil.sdi();

			sdiDesc = sdi.toJSONObject();
			sdiDesc["zones"] = [];

			sdi.loadAssociations(successLoadAssoSDI, fail);

			profilDesc = profil.toJSONObject();
			profilDesc["zoneContents"] = [];

			var zoneContents : Array<ZoneContent> = profil.zoneContents();
			var nbZC = 0;

			zoneContents.forEach(function (zoneContent) {
				var zcDesc = zoneContent.toJSONObject();


				var successZCLoadAsso = function () {
					zcDesc["zone"] = zoneContent.zone().toJSONObject();
					zcDesc["widget"] = null;
					zcDesc["absoluteTimeline"] = null;

					var relativeTL : RelativeTimeline = zoneContent.relativeTimeline();

					zcDesc["relativeTimeline"] = relativeTL.toJSONObject();
					zcDesc["relativeTimeline"]["relativeEvents"] = [];

					var successRelativeTLLoadAsso = function () {

						var relativeEvents : Array<RelativeEvent> = relativeTL.relativeEvents();

						var nbRelEv = 0;
						relativeEvents.forEach(function (relativeEvent) {

							var relEvDesc = relativeEvent.toJSONObject();

							var successRelativeEventLoadAsso = function () {
								var call : Call = relativeEvent.call();

								var callDesc = call.toJSONObject();

								var successCallLoadAsso = function () {
									callDesc["callType"] = {
										"id": call.callType().getId()
									};

									relEvDesc["call"] = callDesc;
									zcDesc["relativeTimeline"]["relativeEvents"].push(relEvDesc);
									nbRelEv++;

									if (nbRelEv == relativeEvents.length) {
										profilDesc["zoneContents"].push(zcDesc);
										nbZC++;

										if (nbZC == zoneContents.length) {
											self.socket.emit("ProfilDescription", self.formatResponse(true, profilDesc));
										}
									}
								};

								call.loadAssociations(successCallLoadAsso, fail);
							}

							relativeEvent.loadAssociations(successRelativeEventLoadAsso, fail);
						});
					};

					relativeTL.loadAssociations(successRelativeTLLoadAsso, fail);
				};

				zoneContent.loadAssociations(successZCLoadAsso, fail);
			});
		};

		var successReadProfil = function (pro : Profil) {
			profil = pro;

			profil.loadAssociations(successLoadAssoProfil, fail);
		};

		Profil.read(profilId, successReadProfil, fail);

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