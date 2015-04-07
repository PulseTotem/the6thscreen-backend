/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="./ShareNamespaceManager.ts" />

class AdminsNamespaceManager extends ShareNamespaceManager {

	/**
     * Constructor.
     *
     * @constructor
     * @param {any} socket - The socket.
     */
    constructor(socket : any) {
        super(socket);

        var self = this;

        // Retrieve unique object from ID
	    this.addListenerToSocket('RetrieveUserDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(User, "userId", description, "UserDescription"); });
	    this.addListenerToSocket('RetrieveSDIDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(SDI, "sdiId", description, "SDIDescription"); });
	    this.addListenerToSocket('RetrieveSourceDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(Source, "sourceId", description, "SourceDescription"); });
	    this.addListenerToSocket('RetrieveSourceDescriptionOnlyId', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(Source, "sourceId", description, "SourceDescription", true); });
	    this.addListenerToSocket('RetrieveCallTypeDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(CallType, "callTypeId", description, "CallTypeDescription"); });
	    this.addListenerToSocket('RetrieveCallTypeDescriptionOnlyId', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(CallType, "callTypeId", description, "CallTypeDescription", true); });
	    this.addListenerToSocket('RetrieveServiceDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(Service, "serviceId", description, "ServiceDescription"); });
	    this.addListenerToSocket('RetrieveServiceDescriptionOnlyId', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(Service, "serviceId", description, "ServiceDescription", true); });
	    this.addListenerToSocket('RetrieveZoneDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(Zone, "zoneId", description, "ZoneDescription"); });
		this.addListenerToSocket('RetrieveZoneDescriptionOnlyId', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(Zone, "zoneId", description, "ZoneDescription", true); });
		this.addListenerToSocket('RetrieveOAuthKeyDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(OAuthKey, "oauthKeyId", description, "OAuthKeyDescription_" + description.oauthKeyId); });
		this.addListenerToSocket('RetrieveCallDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(Call, "callId", description, "CallDescription"); });
		this.addListenerToSocket('RetrieveRendererDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(Renderer, "rendererId", description, "RendererDescription"); });
		this.addListenerToSocket('RetrieveRendererDescriptionOnlyId', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(Renderer, "rendererId", description, "RendererDescription", true); });
		this.addListenerToSocket('RetrieveProfilDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(Profil, "profilId", description, "ProfilDescription"); });


		// Retrieve all objects
	    this.addListenerToSocket('RetrieveAllSourceDescription', function() { self.sendAllObjectDescription(Source, "AllSourceDescription"); });
	    this.addListenerToSocket('RetrieveAllZoneDescription', function() { self.sendAllObjectDescription(Zone, "AllZoneDescription"); });
	    this.addListenerToSocket('RetrieveAllRendererDescription', function() { self.sendAllObjectDescription(Renderer, "AllRendererDescription"); });
	    this.addListenerToSocket('RetrieveAllCallTypeDescription', function() { self.sendAllObjectDescription(CallType, "AllCallTypeDescription"); });
	    this.addListenerToSocket('RetrieveAllInfoTypeDescription', function() { self.sendAllObjectDescription(InfoType, "AllInfoTypeDescription"); });
	    this.addListenerToSocket('RetrieveAllParamTypeDescription', function() { self.sendAllObjectDescription(ParamType, "AllParamTypeDescription"); });
	    this.addListenerToSocket('RetrieveAllServiceDescription', function() { self.sendAllObjectDescription(Service, "AllServiceDescription"); });
		this.addListenerToSocket('RetrieveAllBehaviourDescription', function() { self.sendAllObjectDescription(Behaviour, "AllBehaviourDescription"); });

		// Create object
	    this.addListenerToSocket('CreateSourceDescription', function(data) { self.createObject(Source, data, "SourceDescription"); });
	    this.addListenerToSocket('CreateCallTypeDescription', function(data) { self.createObject(CallType, data, "CallTypeDescription"); });
	    this.addListenerToSocket('CreateServiceDescription', function(data) { self.createObject(Service, data, "ServiceDescription"); });
		this.addListenerToSocket('CreateSDIDescription', function(data) { self.createObject(SDI, data, "SDIDescription"); });
		this.addListenerToSocket('CreateZoneDescription', function(data) { self.createObject(Zone, data, "ZoneDescription"); });
		this.addListenerToSocket('CreateCallDescription', function(data) { self.createObject(Call, data, "CallDescription"); });
		this.addListenerToSocket('CreateRendererDescription', function(data) { self.createObject(Renderer, data, "RendererDescription"); });
		this.addListenerToSocket('CreateProfilDescription', function(data) { self.createObject(Profil, data, "ProfilDescription"); });

		// Update object
	    this.addListenerToSocket('UpdateSourceDescription', function(data) { self.updateObjectAttribute(Source, data, "SourceDescription"); });
	    this.addListenerToSocket('UpdateCallTypeDescription', function(data) { self.updateObjectAttribute(CallType, data, "CallTypeDescription"); });
	    this.addListenerToSocket('UpdateServiceDescription', function(data) { self.updateObjectAttribute(Service, data, "ServiceDescription"); });
		this.addListenerToSocket('UpdateSDIDescription', function(data) { self.updateObjectAttribute(SDI, data, "SDIDescription"); });
		this.addListenerToSocket('UpdateZoneDescription', function(data) { self.updateObjectAttribute(Zone, data, "ZoneDescription"); });
		this.addListenerToSocket('UpdateCallDescription', function(data) { self.updateObjectAttribute(Call, data, "CallDescription"); });
		this.addListenerToSocket('UpdateParamValueDescription', function(data) { self.updateObjectAttribute(ParamValue, data, "ParamValueDescription"); });
		this.addListenerToSocket('UpdateRendererDescription', function(data) { self.updateObjectAttribute(Renderer, data, "RendererDescription"); });
		this.addListenerToSocket('UpdateProfilDescription', function(data) { self.updateObjectAttribute(Profil, data, "ProfilDescription"); });


		// Delete object
	    this.addListenerToSocket('DeleteSource', function(idSource) { self.deleteObjectFromDescription(Source, "sourceId", idSource, "deletedSource"); });
	    this.addListenerToSocket('DeleteCallType', function(idCallType) { self.deleteObjectFromDescription(CallType, "callTypeId", idCallType, "deletedCallType"); });
	    this.addListenerToSocket('DeleteService', function(idService) { self.deleteObjectFromDescription(Service, "serviceId", idService, "deletedService"); });
		this.addListenerToSocket('DeleteSDI', function(idSDI) { self.deleteObjectFromDescription(SDI, "sdiId", idSDI, "deletedSDI"); });
		this.addListenerToSocket('DeleteOAuthKey', function(idOAuthKey) { self.deleteObjectFromDescription(OAuthKey, "oauthKeyId", idOAuthKey, "deletedOAuthKey"); });
		this.addListenerToSocket('DeleteZone', function(idZone) { self.deleteObjectFromDescription(Zone, "zoneId", idZone, "deletedZone"); });
		this.addListenerToSocket('DeleteCall', function(idCall) { self.deleteObjectFromDescription(Call, "callId", idCall, "deletedCall"); });
		this.addListenerToSocket('DeleteRenderer', function(idRenderer) { self.deleteObjectFromDescription(Renderer, "rendererId", idRenderer, "deletedRenderer"); });
		this.addListenerToSocket('DeleteProfil', function(idProfil) { self.deleteObjectFromDescription(Profil, "profilId", idProfil, "deletedProfil"); });


		// Custom requests
	    this.addListenerToSocket('RetrieveUserDescriptionFromToken', function(tokenDescription) { self.sendUserDescriptionFromToken(tokenDescription); });
	    this.addListenerToSocket('RetrieveAllZoneDescriptionFromSDI', function(description) { self.sendAllZoneDescriptionFromSDI(description); });
		this.addListenerToSocket('CreateOAuthKeyDescription', function(data) { self.createOAuthKey(data); });
		this.addListenerToSocket('RetrieveParamTypesFromCallType', function (callTypeDescription) { self.sendParamTypesDescriptionFromCallType(callTypeDescription); });
		this.addListenerToSocket('CreateParamValueDescription', function (paramValueDescription) { self.createParamValueDescription(paramValueDescription); });
		this.addListenerToSocket('RetrieveParamValuesFromCall', function (callDescription) { self.sendParamValuesDescriptionFromCall(callDescription); });

	}

	/**
	 * Retrieve an object of the defined modelClass from the ID given in jsonDescription under the propertyName. Send it back through the channelResponse.
	 * It is possible to specify to return only IDs for associated objects.
	 *
	 * @method sendObjectDescriptionFromJSONDescriptionWithID
	 * @param modelClass - The model for the object to return.
	 * @param propertyName - The property name of the ID to retrieve from the jsonDescription.
	 * @param jsonDescription - A JSON containing the ID of the object to retrieve.
	 * @param channelResponse - The channel to return the object.
	 * @param onlyId - If true it only returns IDs for associated objects. It is false by defaults (complete objects are returned).
	 */
	sendObjectDescriptionFromJSONDescriptionWithID(modelClass : any, propertyName : string, jsonDescription : any, channelResponse : string, onlyId : boolean = false) {
		var self = this;
		var objectId = jsonDescription[propertyName];
		self.sendObjectDescriptionFromId(modelClass, objectId, channelResponse, onlyId);
	}

	/**
	 * Retrieve the ID of an object from its description and delete it.
	 *
	 * @method deleteObjectFromDescription
	 * @param modelClass - The model of the object to delete
	 * @param propertyName - The property name of the ID to retrieve from jsonDescription.
	 * @param jsonDescription - The description of the object containing the ID.
	 * @param channelResponse - The channel to give the result of the request.
	 */
	deleteObjectFromDescription(modelClass : any, propertyName : string, jsonDescription : any, channelResponse : string) {
		var self = this;
		var objectId = jsonDescription[propertyName];
		self.deleteObject(modelClass, objectId, channelResponse);
	}


////////////////////// Begin: Manage SendUserDescriptionFromToken //////////////////////

    /**
     * Retrieve User instance description from token and send it to client.
     *
     * @method sendUserDescriptionFromToken
     * @param {any} tokenDescription - The Token Description.
     * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
     */
    sendUserDescriptionFromToken(tokenDescription : any, self : AdminsNamespaceManager = null) {
        // tokenDescription : {"token" : string}
        if(self == null) {
            self = this;
        }
        Logger.debug("SocketId: " + self.socket.id + " - sendUserDescriptionFromToken");

        var token = tokenDescription.token;

        Logger.debug("SocketId: " + self.socket.id + " - sendUserDescriptionFromToken : token " + token);

        Logger.debug("SocketId: " + self.socket.id + " - sendUserDescriptionFromToken : retrieveUser");

        User.findOneByToken(token, function(user) { self.retrieveUserFromTokenSuccess(user); }, function(error) { self.retrieveUserFromTokenFail(error, token); });
    }

    /**
     * Retrieve User From Token instance success, so send it to client.
     *
     * @method retrieveUserFromTokenSuccess
     * @param {User} user - The User Description.
     * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
     */
    retrieveUserFromTokenSuccess(user : User, self : AdminsNamespaceManager = null) {
        var self = this;

        Logger.debug("SocketId: " + this.socket.id + " - sendUserDescriptionFromToken : success");

		var success : Function = function(completeJSONObject) {
			self.socket.emit("UserDescriptionFromToken", self.formatResponse(true, completeJSONObject));

			Logger.debug("SocketId: " + self.socket.id + " - sendUserDescriptionFromToken : send done with success status for User with Id : " + user.getId());
		};

		var fail : Function = function(error) {
			self.socket.emit("UserDescriptionFromToken", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - sendUserDescriptionFromToken : send done with fail status for User with Id : " + user.getId() + " - Fail during completeJsonObject.");
		};

		user.toCompleteJSONObject(success, fail);
    }

    /**
     * Retrieve User From Token instance fail, so send an error.
     *
     * @method retrieveUserFromTokenFail
     * @param {Error} error - The Error reason of fail.
     * @param {string} token - The User Token.
     */
    retrieveUserFromTokenFail(error : Error, token : string) {
        var self = this;

        Logger.debug("SocketId: " + this.socket.id + " - sendUserDescriptionFromToken : error");
        self.socket.emit("UserDescriptionFromToken", self.formatResponse(false, error));
    }

////////////////////// End: Manage SendUserDescriptionFromToken //////////////////////

////////////////////// Begin: Manage sendAllZoneDescriptionFromSDI //////////////////////

	sendAllZoneDescriptionFromSDI(sdiDescription : any) {
		// sdiDescription : {"sdiId" : number}
		var self = this;

		Logger.debug("SocketId: " + self.socket.id + " - sendAllZoneDescriptionFromSDI");

		var sdiId = sdiDescription.sdiId;

		Logger.debug("SocketId: " + self.socket.id + " - sendAllZoneDescriptionFromSDI : sdiId " + sdiId);

		SDI.read(sdiId, function (sdi) { self.readSDI(sdi); }, function (error) { self.retrieveSDIFromIdToSendZonesFail(error, sdiId); });
	}

	readSDI (sdi : SDI) {
		var self = this;
		sdi.loadZones(function() { self.retrieveSDIFromIdToSendZonesSuccess(sdi); }, function (error) { self.retrieveSDIFromIdToSendZonesFail(error, sdi.getId()); });
	}

	retrieveSDIFromIdToSendZonesSuccess(sdi : SDI) {
		var self = this;
		Logger.debug("SocketId: " + this.socket.id + " - sendAllZoneDescriptionFromSDI : success");
		self.socket.emit("ZonesDescriptionFromSDI", self.formatResponse(true, sdi.serializeArray(sdi.zones())));
	}

	retrieveSDIFromIdToSendZonesFail(error : Error, sdiId : number) {
		var self = this;

		Logger.debug("SocketId: " + this.socket.id + " - sendAllZoneDescriptionFromSDI : error");
		self.socket.emit("ZonesDescriptionFromSDI", self.formatResponse(false, error));
	}

////////////////////// End: Manage sendAllZoneDescriptionFromSDI //////////////////////

////////////////////// Begin: Manage createOAuthKey //////////////////////

	/**
	 * Create an OAuthKey with the given description.
	 *
	 * @method createOAuthKey
	 * @param {any} oauthKeyDescription - The information containing info of the OAuthKey to create.
	 * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
	 */
	createOAuthKey(oauthKeyDescription : any, self : AdminsNamespaceManager = null) {
		// oauthKeyDescription : {"userId" : string, "serviceId" : string, "name" : string, "description" : string, "value" : any (JSONObject)}
		var self = this;

		var fail : Function = function(error) {
			self.socket.emit("OAuthKeyDescription", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - createOAuthKey failed ");
		};

		var informations = {
			"id" : null,
			"name" : oauthKeyDescription.name,
			"description" : oauthKeyDescription.description,
			"value" : oauthKeyDescription.value,
			"complete" : false
		};

		var newOAuthKey = OAuthKey.fromJSONObject(informations);

		var successCreateOAuthKey : Function = function(oauthKeyResult) {
			var successLinkService : Function = function() {
				var userId = oauthKeyDescription.userId;

				var successRetrieveUser : Function = function(user) {

					var successUserAssociation : Function = function() {

						var successOAuthKeyCompleteJSON : Function = function(oauthKeyCompleteJSON) {
							self.socket.emit("OAuthKeyDescription", self.formatResponse(true, oauthKeyCompleteJSON));
							Logger.debug("SocketId: " + self.socket.id + " - createOAuthKey : send done with success status for OAuthKey with Id : " + newOAuthKey.getId());
						};

						newOAuthKey.toCompleteJSONObject(successOAuthKeyCompleteJSON, fail);
					}

					user.addOAuthKey(newOAuthKey.getId(),successUserAssociation, fail);


				};

				User.read(userId, successRetrieveUser, fail);
			};
			newOAuthKey.linkService(oauthKeyDescription.serviceId, successLinkService, fail);
		};

		newOAuthKey.create(successCreateOAuthKey, function (error) { self.createObjectFail(error, "OAuthKeyDescription"); });
	}

////////////////////// End: Manage createOAuthKey //////////////////////

////////////////////// Begin: Manage sendParamTypesDescriptionFromCallType //////////////////////

	/**
	 * Retrieve ParamTypes from a given CallType id.
	 * Send the result on the channel "ParamTypesDescription"
	 *
	 * @param callTypeDescription
	 */
	sendParamTypesDescriptionFromCallType(callTypeDescription : any) {
		var self = this;

		var callTypeId = callTypeDescription.callTypeId;

		var fail : Function = function(error) {
			self.socket.emit("ParamTypesDescription", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - sendParamTypesDescriptionFromCallType failed ");
		};

		var successRead = function (callType) {

			var successLoadSource : Function = function () {
				var source : Source = callType.source();

				var successLoadParamTypes : Function = function () {

					var successCompleteLoad = function (data) {
						self.socket.emit("ParamTypesDescription", self.formatResponse(true, data));
					};

					for (var i = 0; i < source.paramTypes().length; i++) {
						source.paramTypes()[i].toCompleteJSONObject(successCompleteLoad, fail);
					}
				};

				source.loadParamTypes(successLoadParamTypes, fail);
			};

			callType.loadSource(successLoadSource, fail);
		};

		CallType.read(callTypeId, successRead, fail);
	}

////////////////////// End: Manage sendParamTypesDescriptionFromCallType //////////////////////

////////////////////// Begin: Manage sendParamValuesDescriptionFromCall //////////////////////

	/**
	 * Retrieve ParamValues from a given Call id.
	 * Send the result on the channel "ParamValuesDescription"
	 *
	 * @param callTypeDescription
	 */
	sendParamValuesDescriptionFromCall(callDescription : any) {
		var self = this;

		var callId = callDescription.callId;

		var fail : Function = function(error) {
			self.socket.emit("ParamValuesDescription", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - sendParamValuesDescriptionFromCall failed ");
		};

		var successRead = function (call) {

			var successLoadParamValues : Function = function () {

				var successCompleteLoad = function (data) {
					self.socket.emit("ParamValuesDescription", self.formatResponse(true, data));
				};

				for (var i = 0; i < call.paramValues().length; i++) {
						call.paramValues()[i].toCompleteJSONObject(successCompleteLoad, fail);
					}
				};

			call.loadParamValues(successLoadParamValues, fail);
		};

		Call.read(callId, successRead, fail);
	}

////////////////////// End: Manage sendParamTypesDescriptionFromCallType //////////////////////

////////////////////// Begin: Manage sendParamValuesDescriptionFromCall //////////////////////

	createParamValueDescription(paramValueDescription : any) {
		var self = this;

		var value = paramValueDescription.paramValue;
		var paramTypeId = paramValueDescription.paramTypeId;

		var paramValue : ParamValue = new ParamValue(value);

		var fail : Function = function(error) {
			self.socket.emit("ParamValueCreationDescription", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - createParamValueDescription failed ");
		};

		var successCreate : Function = function () {

			var successLinkParamType : Function = function () {
				var data = { "paramValueId": paramValue.getId(), "paramTypeId": paramTypeId };
				self.socket.emit("ParamValueCreationDescription", self.formatResponse(true, data));
			};

			paramValue.linkParamType(paramTypeId, successLinkParamType, fail);
		};


		paramValue.create(successCreate, fail);
	}

////////////////////// End: Manage createParamValueDescription //////////////////////
}