/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/stats/StatObject.ts" />

/// <reference path="../core/StatsClient.ts" />
/// <reference path="../core/OnlineClient.ts" />
/// <reference path="./ShareNamespaceManager.ts" />

/// <reference path="../model/Profil.ts" />
/// <reference path="../model/User.ts" />
/// <reference path="../model/SDI.ts" />
/// <reference path="../model/Zone.ts" />
/// <reference path="../model/Call.ts" />
/// <reference path="../model/CallType.ts" />

class ClientsNamespaceManager extends ShareNamespaceManager {

	static onlineClients : Array<OnlineClient> = [];

	private _client : OnlineClient = null;

    /**
     * Constructor.
     *
     * @constructor
     * @param {any} socket - The socket.
     */
    constructor(socket : any) {
        super(socket);

        var self = this;

		this.addListenerToSocket('HashDescription', function(description) { self.manageHashDescription(description); });

	    this.createClient();
    }

	private pushStat(status: string) : void {
		var result : StatObject = new StatObject();

		result.setCollection("clients");
		result.setIp(this._client.getIP());
		result.setSocketId(this.socket.id);

		result.setProfilId(this._client.getProfilId());
		result.setSDIId(this._client.getSDIId());
		result.setHash(this._client.getHash());

		var data = {};
		data["status"] = status;
		result.setData(data);

		StatsClient.pushStats(result);
	}


	private createClient() {
		var self = this;
		var ip : string = this.getIP();
		var socketId : string = this.socket.id;

		this._client = new OnlineClient();
		this._client.setIp(ip);
		this._client.setSocketId(socketId);

		ClientsNamespaceManager.onlineClients.push(this._client);

		self.pushStat("Connection");
	}

	public static getClientsForProfil(profilId : number) : Array<Object> {
		var clients = ClientsNamespaceManager.onlineClients.filter(function (client : OnlineClient) {
			return (client.getProfilId() == profilId.toString());
		});

		var result = [];
		for (var i = 0; i < clients.length; i++) {
			result.push(clients[i].toJSON());
		}
		return result;
	}

	public onDisconnection() {
		var self = this;

		self.pushStat("Disconnection");

		if (this._client) {
			for (var i = 0; i < ClientsNamespaceManager.onlineClients.length; i++) {
				var client = ClientsNamespaceManager.onlineClients[i];
				if (client) {
					if (client.getSocketId() == this._client.getSocketId()) {
						delete ClientsNamespaceManager.onlineClients[i];
					}
				}
			}
		}
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

		this._client.setHashValue(hash);

		var fail = function (err) {
			Logger.debug("SocketId: " + self.socket.id + " - manageHashDescription : send done with fail status for Profil with Hash : " + hash + " : "+err);
			Logger.debug(err);
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

						if (behaviour == null) {
							fail("No behaviour is associated to zone: "+zone.name()+" (id : "+zone.getId()+")");
						} else {
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
											self._client.setSDIid(sdi.getId());
											self.pushStat("Send SDI Description");
										}
									}
								};

								callType.toCompleteJSONObject(successCallTypeToCompleteJSON, fail);
							})
						}

					};
					zone.loadAssociations(successLoadAssoZone, fail);
				});
			};

			sdi.theme().toCompleteJSONObject(successThemeCompleteDescription, fail);
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
											callDesc["rendererTheme"] = (call.rendererTheme() !== null) ? call.rendererTheme().toJSONObject() : null;

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

																		self.pushStat("Send Profil description");
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
																self.pushStat("Send Profil description");
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
															self.pushStat("Send Profil description");
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
			self._client.setProfilId(pro.getId());
			profil.loadAssociations(successLoadAssoProfil, fail);
		};

		//Profil.read(hash, successReadProfil, fail);

		Profil.findOneByHash(hash, successReadProfil, fail);
	}

////////////////////// End: Manage HashDescription //////////////////////

	/**
	 * Send command to refresh the client
	 */
	refreshClient() {
		// callTypeDescription : {"callTypeId" : string}
		var self = this;

		self.socket.emit("RefreshClient", self.formatResponse(true, ""));
		self.pushStat("Refresh client");
	}

	/**
	 * Send command to identify the client
	 */
	identifyClient(clientId : string) {
		// callTypeDescription : {"callTypeId" : string}
		var self = this;

		self.socket.emit("IdentifyClient", self.formatResponse(true, clientId.toString()));
		self.pushStat("Identify client");
	}




}