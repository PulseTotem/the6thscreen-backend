/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="./ShareNamespaceManager.ts" />

/// <reference path="../model/Profil.ts" />
/// <reference path="../model/User.ts" />
/// <reference path="../model/SDI.ts" />
/// <reference path="../model/Zone.ts" />
/// <reference path="../model/Call.ts" />
/// <reference path="../model/CallType.ts" />
/// <reference path="../model/Client.ts" />

class ClientsNamespaceManager extends ShareNamespaceManager {

	/**
	 * Client attribute of the ClientNameSpaceManager
	 *
	 * @property _client
	 * @type Client
	 */
	private _client : Client;

    /**
     * Constructor.
     *
     * @constructor
     * @param {any} socket - The socket.
     */
    constructor(socket : any) {
        super(socket);

        var self = this;
	    this._client = null;

        /*
		this.addListenerToSocket('RetrieveProfilDescription', function(description) { self.sendProfilDescription(description); });
        this.addListenerToSocket('RetrieveUserDescription', function(description) { self.sendUserDescription(description); });
        this.addListenerToSocket('RetrieveSDIDescription', function(description) { self.sendSDIDescription(description); });
        this.addListenerToSocket('RetrieveZoneDescription', function(description) { self.sendZoneDescription(description); });
        this.addListenerToSocket('RetrieveCallDescription', function(description) { self.sendCallDescription(description); });
        this.addListenerToSocket('RetrieveCallTypeDescription', function(description) { self.sendCallTypeDescription(description); });
		*/

		this.addListenerToSocket('HashDescription', function(description) { self.manageHashDescription(description); });

	    this.createClient();
    }


	private createClient() {
		var self = this;
		var ip : string = this.socket.request.connection.remoteAddress;
		var socketId : string = this.socket.id;
		this._client = new Client(ip, socketId);
		var success : Function = function () {
			Logger.debug("Client save : ");
			Logger.debug(JSON.stringify(self._client.toJSONObject()));
		};

		var fail : Function = function () {
			Logger.error("Error while creating the client : "+JSON.stringify(self._client.toJSONObject()));
		};

		this._client.create(success, fail);
	}

	public onDisconnection() {
		var self = this;

		var successDelete : Function = function () {
			Logger.debug("Delete the client for socketId "+self._client.socketID());
		};

		var fail : Function = function () {
			Logger.error("Error while deleting the client for the following socketId: "+self._client.socketID());
		};

		this._client.delete(successDelete, fail);
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

		var fail = function (err) {
			Logger.debug("SocketId: " + self.socket.id + " - manageHashDescription : send done with fail status for Profil with Hash : " + hash + " : "+err);
			self.socket.emit("SDIDescription", self.formatResponse(false, err));
		};

		var profil : Profil = null;
		var sdiDesc = {};
		var sdi : SDI = null;
		var profilDesc = {};

		var successLoadAssoSDI = function () {

			var successThemeCompleteDescription = function(themeCompleteDesc) {
				sdiDesc["theme"] = themeCompleteDesc;

				var zones : Array<Zone> = sdi.zones();

				var nbZones = 0;

				zones.forEach(function (zone) {
					var zoneDesc = zone.toJSONObject();

					var successLoadAssoZone = function () {
						zoneDesc["theme"] = null;

						if(zone.theme() != null) {
							zoneDesc["theme"] = zone.theme().toJSONObject();
						}

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

			sdi.theme().toCompleteJSONObject(successThemeCompleteDescription, fail);
		};

		var successLinkProfil : Function = function () {
			Logger.debug("Link Client object with Profil successfully");
		};

		var successLoadAssoProfil = function () {
			self._client.linkProfil(profil.getId(), successLinkProfil, fail);
			sdi = profil.sdi();

			sdiDesc = sdi.toJSONObject();
			sdiDesc["zones"] = [];

			sdi.loadAssociations(successLoadAssoSDI, fail);

			profilDesc = profil.toJSONObject();
			profilDesc["zoneContents"] = [];

			var zoneContents : Array<ZoneContent> = profil.zoneContents();
			var nbZC = 0;

			if(zoneContents.length > 0) {

				zoneContents.forEach(function (zoneContent) {
					var zcDesc = zoneContent.toJSONObject();


					var successZCLoadAsso = function () {
						zcDesc["zone"] = zoneContent.zone().toJSONObject();
						zcDesc["widget"] = null;
						zcDesc["absoluteTimeline"] = null;

						var relativeTL:RelativeTimeline = zoneContent.relativeTimeline();

						zcDesc["relativeTimeline"] = relativeTL.toJSONObject();
						zcDesc["relativeTimeline"]["relativeEvents"] = [];

						var successRelativeTLLoadAsso = function () {
							zcDesc["relativeTimeline"]["timelineRunner"] = relativeTL.timelineRunner().toJSONObject();
							zcDesc["relativeTimeline"]["systemTrigger"] = relativeTL.systemTrigger().toJSONObject();
							zcDesc["relativeTimeline"]["userTrigger"] = relativeTL.userTrigger().toJSONObject();

							var relativeEvents:Array<RelativeEvent> = relativeTL.relativeEvents();

							var nbRelEv = 0;

							if (relativeEvents.length > 0) {

								relativeEvents.forEach(function (relativeEvent) {

									var relEvDesc = relativeEvent.toJSONObject();

									var successRelativeEventLoadAsso = function () {
										var call:Call = relativeEvent.call();

										var callDesc = call.toJSONObject();

										var successCallLoadAsso = function () {

											var successCallTypeLoadAsso = function () {
												callDesc["callType"] = {
													"id": call.callType().getId()
												};

												if (call.callType().source().isStatic()) {
													callDesc["paramValues"] = [];

													if (call.paramValues().length > 0) {
														var successParamValueComplete = function (paramValueComplete) {
															callDesc["paramValues"].push(paramValueComplete);

															if (callDesc["paramValues"].length == call.paramValues().length) {

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
															}
														};

														call.paramValues().forEach(function (paramValue:ParamValue) {
															paramValue.toCompleteJSONObject(successParamValueComplete, fail);
														});
													} else {
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
													}
												} else {
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
												}
											};

											call.callType().loadAssociations(successCallTypeLoadAsso, fail);
										};

										call.loadAssociations(successCallLoadAsso, fail);
									};

									relativeEvent.loadAssociations(successRelativeEventLoadAsso, fail);
								});
							} else {
								fail(new Error("RelativeTimeline have NO events !"));
							}
						};

						relativeTL.loadAssociations(successRelativeTLLoadAsso, fail);
					};

					zoneContent.loadAssociations(successZCLoadAsso, fail);
				});
			} else {
				fail(new Error("Profil has NO ZoneContent !"));
			}
		};

		var successReadProfil = function (pro : Profil) {
			profil = pro;

			profil.loadAssociations(successLoadAssoProfil, fail);
		};

		//Profil.read(hash, successReadProfil, fail);

		Profil.findOneByHash(hash, successReadProfil, fail);
	}

////////////////////// End: Manage HashDescription //////////////////////

/*
////////////////////// Begin: Manage SendProfilDescription //////////////////////

    /**
     * Retrieve Profil instance description and send it to client.
     *
     * @method sendProfilDescription
     * @param {any} profilDescription - The Profil Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     * /
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
     * /
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
     * /
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
     * /
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
     * /
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
     * /
    sendCallTypeDescription(callTypeDescription : any, self : ClientsNamespaceManager = null) {
        // callTypeDescription : {"callTypeId" : string}
        var self = this;

        var callTypeId = callTypeDescription.callTypeId;

        self.sendObjectDescriptionFromId(CallType, callTypeId, "CallTypeDescription");
    }

////////////////////// End: Manage SendCallTypeDescription //////////////////////

*/

	/**
	 * Send command to refresh the client
	 */
	refreshClient() {
		// callTypeDescription : {"callTypeId" : string}
		var self = this;

		self.socket.emit("RefreshClient", self.formatResponse(true, ""));
	}

	/**
	 * Send command to identify the client
	 */
	identifyClient(clientId : string) {
		// callTypeDescription : {"callTypeId" : string}
		var self = this;

		self.socket.emit("IdentifyClient", self.formatResponse(true, clientId.toString()));
	}




}