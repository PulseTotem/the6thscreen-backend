/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="./ShareNamespaceManager.ts" />
/// <reference path="../model/User.ts" />
/// <reference path="../model/SDI.ts" />
/// <reference path="../model/Source.ts" />
/// <reference path="../model/CallType.ts" />
/// <reference path="../model/Service.ts" />
/// <reference path="../model/Zone.ts" />
/// <reference path="../model/OAuthKey.ts" />
/// <reference path="../model/Call.ts" />
/// <reference path="../model/Renderer.ts" />
/// <reference path="../model/Profil.ts" />
/// <reference path="../model/InfoType.ts" />
/// <reference path="../model/Policy.ts" />
/// <reference path="../model/Behaviour.ts" />
/// <reference path="../model/ThemeZone.ts" />
/// <reference path="../model/ThemeSDI.ts" />


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
		this.addListenerToSocket('RetrieveZoneContentDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(ZoneContent, "zoneContentId", description, "ZoneContentDescription"); });
		this.addListenerToSocket('RetrieveOAuthKeyDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(OAuthKey, "oauthKeyId", description, "OAuthKeyDescription_" + description.oauthKeyId); });
		this.addListenerToSocket('RetrieveCallDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(Call, "callId", description, "CallDescription"); });
		this.addListenerToSocket('RetrieveRendererDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(Renderer, "rendererId", description, "RendererDescription"); });
		this.addListenerToSocket('RetrieveRendererDescriptionOnlyId', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(Renderer, "rendererId", description, "RendererDescription", true); });
		this.addListenerToSocket('RetrieveProfilDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(Profil, "profilId", description, "ProfilDescription"); });
		this.addListenerToSocket('RetrieveInfoTypeDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(InfoType, "infoTypeId", description, "InfoTypeDescription"); });
		this.addListenerToSocket('RetrievePolicyDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(Policy, "PolicyId", description, "PolicyDescription"); });
		this.addListenerToSocket('RetrieveThemeZoneDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(ThemeZone, "themeZoneId", description, "ThemeZoneDescription"); });
		this.addListenerToSocket('RetrieveThemeSDIDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(ThemeSDI, "themeSDIId", description, "ThemeSDIDescription"); });

		// Retrieve all objects
	    this.addListenerToSocket('RetrieveAllSourceDescription', function() { self.sendAllObjectDescription(Source, "AllSourceDescription"); });
	    this.addListenerToSocket('RetrieveAllZoneDescription', function() { self.sendAllObjectDescription(Zone, "AllZoneDescription"); });
	    this.addListenerToSocket('RetrieveAllRendererDescription', function() { self.sendAllObjectDescription(Renderer, "AllRendererDescription"); });
	    this.addListenerToSocket('RetrieveAllCallTypeDescription', function() { self.sendAllObjectDescription(CallType, "AllCallTypeDescription"); });
	    this.addListenerToSocket('RetrieveAllInfoTypeDescription', function() { self.sendAllObjectDescription(InfoType, "AllInfoTypeDescription"); });
	    this.addListenerToSocket('RetrieveAllParamTypeDescription', function() { self.sendAllObjectDescription(ParamType, "AllParamTypeDescription"); });
	    this.addListenerToSocket('RetrieveAllServiceDescription', function() { self.sendAllObjectDescription(Service, "AllServiceDescription"); });
		this.addListenerToSocket('RetrieveAllBehaviourDescription', function() { self.sendAllObjectDescription(Behaviour, "AllBehaviourDescription"); });
		this.addListenerToSocket('RetrieveAllPolicyDescription', function() { self.sendAllObjectDescription(Policy, "AllPolicyDescription"); });
		this.addListenerToSocket('RetrieveAllThemeZoneDescription', function() { self.sendAllObjectDescription(ThemeZone, "AllThemeZoneDescription"); });
		this.addListenerToSocket('RetrieveAllThemeSDIDescription', function() { self.sendAllObjectDescription(ThemeSDI, "AllThemeSDIDescription"); });
		this.addListenerToSocket('RetrieveAllTimelineRunnerDescription', function() { self.sendAllObjectDescription(TimelineRunner, "AllTimelineRunnerDescription"); });
		this.addListenerToSocket('RetrieveAllSystemTriggerDescription', function() { self.sendAllObjectDescription(SystemTrigger, "AllSystemTriggerDescription"); });
		this.addListenerToSocket('RetrieveAllUserTriggerDescription', function() { self.sendAllObjectDescription(UserTrigger, "AllUserTriggerDescription"); });
		this.addListenerToSocket('RetrieveAllTypeParamTypeDescription', function() { self.sendAllObjectDescription(TypeParamType, "AllTypeParamTypeDescription"); });
		this.addListenerToSocket('RetrieveAllConstraintParamTypeDescription', function() { self.sendAllObjectDescription(ConstraintParamType, "AllConstraintParamTypeDescription"); });
		this.addListenerToSocket('RetrieveAllTypeParamTypeDescription', function() { self.sendAllObjectDescription(TypeParamType, "AllTypeParamTypeDescription"); });


		// Create object
		this.addListenerToSocket('CreateSDI', function(data) { self.createObject(SDI, data, "AnswerCreateSDI"); });
		this.addListenerToSocket('CreateZone', function(data) { self.createObject(Zone, data, "AnswerCreateZone"); });
		this.addListenerToSocket('CreateCallType', function(data) { self.createObject(CallType, data, "AnswerCreateCallType"); });
		this.addListenerToSocket('CreateCall', function(data) { self.createObject(Call, data, "AnswerCreateCall"); });
		this.addListenerToSocket('CreateRelativeEvent', function(data) { self.createObject(RelativeEvent, data, "AnswerCreateRelativeEvent"); });
		this.addListenerToSocket('CreateParamValue', function(data) { self.createObject(ParamValue, data, "AnswerCreateParamValue"); });
		this.addListenerToSocket('CreateZoneContent', function(data) { self.createObject(ZoneContent, data, "AnswerCreateZoneContent"); });
		this.addListenerToSocket('CreateRelativeTimeline', function(data) { self.createObject(RelativeTimeline, data, "AnswerCreateRelativeTimeline"); });
		this.addListenerToSocket('CreateProfil', function(data) { self.createObject(Profil, data, "AnswerCreateProfil"); });
		this.addListenerToSocket('CreateThemeZone', function(data) { self.createObject(ThemeZone, data, "AnswerCreateThemeZone"); });
		this.addListenerToSocket('CreateThemeSDI', function(data) { self.createObject(ThemeSDI, data, "AnswerCreateThemeSDI"); });
		this.addListenerToSocket('CreateParamType', function(data) { self.createObject(ParamType, data, "AnswerCreateParamType"); });
		this.addListenerToSocket('CreateTypeParamType', function(data) { self.createObject(TypeParamType, data, "AnswerCreateTypeParamType"); });
		this.addListenerToSocket('CreateInfoType', function(data) { self.createObject(InfoType, data, "AnswerCreateInfoType"); });
		this.addListenerToSocket('CreateService', function(data) { self.createObject(Service, data, "AnswerCreateService"); });
		this.addListenerToSocket('CreateSource', function(data) { self.createObject(Source, data, "AnswerCreateSource"); });
		this.addListenerToSocket('CreateRenderer', function(data) { self.createObject(Renderer, data, "AnswerCreateRenderer"); });
		this.addListenerToSocket('CreateBehaviour', function(data) { self.createObject(Behaviour, data, "AnswerCreateBehaviour"); });
		this.addListenerToSocket('CreatePolicy', function(data) { self.createObject(Policy, data, "AnswerCreatePolicy"); });

		// Update object
		this.addListenerToSocket('UpdateSDI', function(data) { self.updateObjectAttribute(SDI, data, "AnswerUpdateSDI"); });
		this.addListenerToSocket('UpdateZone', function(data) { self.updateObjectAttribute(Zone, data, "AnswerUpdateZone"); });
		this.addListenerToSocket('UpdateCallType', function(data) { self.updateObjectAttribute(CallType, data, "AnswerUpdateCallType"); });
		this.addListenerToSocket('UpdateCall', function(data) { self.updateObjectAttribute(Call, data, "AnswerUpdateCall"); });
		this.addListenerToSocket('UpdateRelativeEvent', function(data) { self.updateObjectAttribute(RelativeEvent, data, "AnswerUpdateRelativeEvent"); });
		this.addListenerToSocket('UpdateRelativeTimeline', function(data) { self.updateObjectAttribute(RelativeTimeline, data, "AnswerUpdateRelativeTimeline"); });
		this.addListenerToSocket('UpdateParamValue', function(data) { self.updateObjectAttribute(ParamValue, data, "AnswerUpdateParamValue"); });
		this.addListenerToSocket('UpdateZoneContent', function(data) { self.updateObjectAttribute(ZoneContent, data, "AnswerUpdateZoneContent"); });
		this.addListenerToSocket('UpdateProfil', function(data) { self.updateObjectAttribute(Profil, data, "AnswerUpdateProfil"); });
		this.addListenerToSocket('UpdateThemeZone', function(data) { self.updateObjectAttribute(ThemeZone, data, "AnswerUpdateThemeZone"); });
		this.addListenerToSocket('UpdateThemeSDI', function(data) { self.updateObjectAttribute(ThemeSDI, data, "AnswerUpdateThemeSDI"); });
		this.addListenerToSocket('UpdateParamType', function(data) { self.updateObjectAttribute(ParamType, data, "AnswerUpdateParamType"); });
		this.addListenerToSocket('UpdateTypeParamType', function(data) { self.updateObjectAttribute(TypeParamType, data, "AnswerUpdateTypeParamType"); });
		this.addListenerToSocket('UpdateInfoType', function(data) { self.updateObjectAttribute(InfoType, data, "AnswerUpdateInfoType"); });
		this.addListenerToSocket('UpdateService', function(data) { self.updateObjectAttribute(Service, data, "AnswerUpdateService"); });
		this.addListenerToSocket('UpdateSource', function(data) { self.updateObjectAttribute(Source, data, "AnswerUpdateSource"); });
		this.addListenerToSocket('UpdateRenderer', function(data) { self.updateObjectAttribute(Renderer, data, "AnswerUpdateRenderer"); });
		this.addListenerToSocket('UpdateBehaviour', function(data) { self.updateObjectAttribute(Behaviour, data, "AnswerUpdateBehaviour"); });
		this.addListenerToSocket('UpdatePolicy', function(data) { self.updateObjectAttribute(Policy, data, "AnswerUpdatePolicy"); });

		// Delete object
		this.addListenerToSocket('DeleteRelativeEvent', function(idRelativeEvent) { self.deleteObjectFromDescription(RelativeEvent, "relativeEventId", idRelativeEvent, "AnswerDeleteRelativeEvent"); });
		this.addListenerToSocket('DeleteZoneContent', function(idZoneContent) { self.deleteObjectFromDescription(ZoneContent, "zoneContentId", idZoneContent, "AnswerDeleteZoneContent"); });
		this.addListenerToSocket('DeleteProfil', function(idProfil) { self.deleteObjectFromDescription(Profil, "profilId", idProfil, "AnswerDeleteProfil"); });
		this.addListenerToSocket('DeleteThemeZone', function(idThemeZone) { self.deleteObjectFromDescription(ThemeZone, "themeZoneId", idThemeZone, "AnswerDeleteThemeZone"); });
		this.addListenerToSocket('DeleteThemeSDI', function(idThemeSDI) { self.deleteObjectFromDescription(ThemeSDI, "themeSDIId", idThemeSDI, "AnswerDeleteThemeSDI"); });
		this.addListenerToSocket('DeleteParamType', function(idParamType) { self.deleteObjectFromDescription(ParamType, "paramTypeId", idParamType, "AnswerDeleteParamType"); });
		this.addListenerToSocket('DeleteParamValue', function(idParamValue) { self.deleteObjectFromDescription(ParamValue, "paramValueId", idParamValue, "AnswerDeleteParamValue"); });
		this.addListenerToSocket('DeleteTypeParamType', function(idTypeParamType) { self.deleteObjectFromDescription(TypeParamType, "typeParamTypeId", idTypeParamType, "AnswerDeleteTypeParamType"); });
		this.addListenerToSocket('DeleteInfoType', function(idInfoType) { self.deleteObjectFromDescription(InfoType, "infoTypeId", idInfoType, "AnswerDeleteInfoType"); });
		this.addListenerToSocket('DeleteService', function(idService) { self.deleteObjectFromDescription(Service, "serviceId", idService, "AnswerDeleteService"); });
		this.addListenerToSocket('DeleteSource', function(idSource) { self.deleteObjectFromDescription(Source, "sourceId", idSource, "AnswerDeleteSource"); });
		this.addListenerToSocket('DeleteRenderer', function(idRenderer) { self.deleteObjectFromDescription(Renderer, "rendererId", idRenderer, "AnswerDeleteRenderer"); });
		this.addListenerToSocket('DeleteZone', function(idZone) { self.deleteObjectFromDescription(Zone, "zoneId", idZone, "AnswerDeleteZone"); });
		this.addListenerToSocket('DeleteCallType', function(idCallType) { self.deleteObjectFromDescription(CallType, "callTypeId", idCallType, "AnswerDeleteCallType"); });
		this.addListenerToSocket('DeleteOAuthKey', function(idOAuthKey) { self.deleteObjectFromDescription(OAuthKey, "oauthKeyId", idOAuthKey, "AnswerDeleteOAuthKey"); });
		this.addListenerToSocket('DeleteBehaviour', function(idBehaviour) { self.deleteObjectFromDescription(Behaviour, "behaviourId", idBehaviour, "AnswerDeleteBehaviour"); });
		this.addListenerToSocket('DeletePolicy', function(idPolicy) { self.deleteObjectFromDescription(Policy, "policyId", idPolicy, "AnswerDeletePolicy"); });

		this.addListenerToSocket('DeleteSDI', function(idSDI) { self.deleteObjectFromDescription(SDI, "sdiId", idSDI, "AnswerDeleteSDI"); });


		// Custom requests
		this.addListenerToSocket('RetrieveSourcesFromServiceId', function(serviceIdDescription) { self.sendSourcesFromServiceId(serviceIdDescription); });
		this.addListenerToSocket('RetrieveRenderersFromSourceId', function(sourceIdDescription) { self.sendRenderersFromSourceId(sourceIdDescription); });
		this.addListenerToSocket('RetrieveCallTypesFromZoneId', function(zoneIdDescription) { self.sendCallTypesFromZoneId(zoneIdDescription); });
		this.addListenerToSocket('RetrieveCompleteRelativeTimeline', function(timelineIdDescription) { self.sendCompleteRelativeTimeline(timelineIdDescription); });
		this.addListenerToSocket('RetrieveCompleteAbsoluteTimeline', function(timelineIdDescription) { self.sendCompleteAbsoluteTimeline(timelineIdDescription); });
		this.addListenerToSocket('RetrieveCompleteCallType', function(callTypeIdDescription) { self.sendCompleteCallType(callTypeIdDescription); });
		this.addListenerToSocket('RetrieveCompleteCall', function(callIdDescription) { self.sendCompleteCall(callIdDescription); });
		this.addListenerToSocket('UpdateZonePosition', function(data) { self.updateZonePosition(data); });
		this.addListenerToSocket('CreateEmptyParamValueForParamTypeId', function(paramTypeIdDescription) { self.createEmptyParamValue(paramTypeIdDescription); });
		this.addListenerToSocket('RetrieveOAuthKeysFromServiceAndUser', function(serviceUserDescription) { self.sendOAuthKeysFromServiceAndUser(serviceUserDescription); });
		this.addListenerToSocket('RetrieveCompleteProfilDescription', function(profilIdDescription) { self.sendCompleteProfil(profilIdDescription); });
		this.addListenerToSocket('RetrieveZoneContentsFromZoneId', function(zoneIdDescription) { self.sendZoneContentsFromZoneId(zoneIdDescription); });


		this.addListenerToSocket('RetrieveConnectedClientOfProfil', function (profilIdDescription) { self.sendConnectedClients(profilIdDescription); });
	    this.addListenerToSocket('RetrieveUserDescriptionFromToken', function(tokenDescription) { self.sendUserDescriptionFromToken(tokenDescription); });
	    this.addListenerToSocket('RetrieveAllZoneDescriptionFromSDI', function(description) { self.sendAllZoneDescriptionFromSDI(description); });
		this.addListenerToSocket('CreateOAuthKeyDescription', function(data) { self.createOAuthKey(data); });
		this.addListenerToSocket('RetrieveParamTypesFromCallType', function (callTypeDescription) { self.sendParamTypesDescriptionFromCallType(callTypeDescription); });
		this.addListenerToSocket('CreateParamValueDescription', function (paramValueDescription) { self.createParamValueDescription(paramValueDescription); });
		this.addListenerToSocket('RetrieveParamValuesFromCall', function (callDescription) { self.sendParamValuesDescriptionFromCall(callDescription); });

		// Remote control to the client
		this.addListenerToSocket('RefreshCommand', function (clientDescription) { self.sendRefreshCommandToClient(clientDescription); });
		this.addListenerToSocket('IdentifyCommand', function (clientDescription) { self.sendIdentifyCommandToClient(clientDescription); });

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

////////////////////// Begin: Manage sendSourcesFromServiceId //////////////////////

	/**
	 * Retrieve Sources from a given ServiceId.
	 * Send the result on the channel "SourcesDescriptionFromService"
	 *
	 * @param serviceIdDescription
	 */
	sendSourcesFromServiceId(serviceIdDescription : any) {
		// serviceIdDescription : { "serviceId": number }
		var self = this;

		var serviceId = serviceIdDescription.serviceId;

		var fail : Function = function(error) {
			self.socket.emit("SourcesDescriptionFromService", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - sendSourcesFromServiceId failed ");
		};

		var successRead = function (service) {

			var successLoadSources : Function = function () {
				var sources : Array<Source> = service.sources();
				self.socket.emit("SourcesDescriptionFromService", self.formatResponse(true, service.serializeArray(sources)));
			};

			service.loadSources(successLoadSources, fail);
		};

		Service.read(serviceId, successRead, fail);
	}

////////////////////// End: Manage sendSourcesFromServiceId //////////////////////

////////////////////// Begin: Manage sendRenderersFromSourceId //////////////////////

	/**
	 * Retrieve Renderers from a given Source ID.
	 * Send the result on the channel "RenderersDescriptionFromSource"
	 *
	 * @param sourceIdDescription
	 */
	sendRenderersFromSourceId(sourceIdDescription : any) {
		// sourceIdDescription : { "sourceId": number }
		var self = this;

		var sourceId = sourceIdDescription.sourceId;

		var fail : Function = function(error) {
			self.socket.emit("RenderersDescriptionFromSource", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - sendSourcesFromServiceId failed ");
		};

		var successRead = function (source : Source) {

			var successLoadInfoType : Function = function () {
				var infoType : InfoType = source.infoType();

				var successLoadRenderers : Function = function () {
					var renderers : Array<Renderer> = infoType.renderers();

					self.socket.emit("RenderersDescriptionFromSource", self.formatResponse(true, infoType.serializeArray(renderers)));
				};

				infoType.loadRenderers(successLoadRenderers, fail);

			};

			source.loadInfoType(successLoadInfoType, fail);
		};

		Source.read(sourceId, successRead, fail);
	}

////////////////////// End: Manage sendRenderersFromSourceId //////////////////////

////////////////////// Begin: Manage sendCallTypesFromZoneId //////////////////////

	/**
	 * Retrieve CallTypes from a given Zone ID and organize them by services, displaying sources and renderers informations.
	 * Send the result on the channel "CallTypesDescriptionFromZone"
	 *
	 * @param zoneIdDescription
	 */
	sendCallTypesFromZoneId(zoneIdDescription : any) {
		// zoneIdDescription : { "zoneId": number }
		var self = this;

		var zoneId = zoneIdDescription.zoneId;

		var fail : Function = function(error) {
			self.socket.emit("CallTypesDescriptionFromZone", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - sendCallTypesFromZoneId failed ");
		};

		var successRead = function (zone : Zone) {

			var successLoadCallTypes : Function = function (completeDesc) {
				var callTypes : Array<CallType> = zone.callTypes();

				var data : any = null;
				data = completeDesc;

				data.services = [];

				var sources : Array<Source> = new Array<Source>();

				var retrieveSource : Function = function (s : number) {
					for (var i = 0; i < sources.length; i++) {
						var elem = sources[i];
						if (elem.getId() === s) {
							return elem;
						}
					}
					return undefined;
				};

				var retrieveService : Function = function (s : number) {
					for (var i = 0; i < data.services.length; i++) {
						var elem = data.services[i];
						if (elem.id === s) {
							return elem;
						}
					}
					return undefined;
				};

				var indexCT = 0;
				var limit = callTypes.length;

				var saveCallType : Function = function (dataCT) {
					var service = dataCT.source.service;

					var serviceToPush = retrieveService(service.id);

					if (serviceToPush === undefined) {
						var index = data.services.push(dataCT.source.service);
						dataCT.source.service = null;
						index--;
						data.services[index].callTypes = [];
						serviceToPush = data.services[index];
					}
					serviceToPush.callTypes.push(dataCT);

					indexCT++;

					if (indexCT == limit) {
						self.socket.emit("CallTypesDescriptionFromZone", self.formatResponse(true, data));
					}
				};


				callTypes.forEach( function (callType : CallType) {

					var successLoadAssoCT : Function = function (dataCT) {
						if (dataCT.source == null) {
							var ctObject : CallType = CallType.fromJSONObject(dataCT);
							var successDelete = function () {
								Logger.debug("CallType deleted because the source is missing: "+JSON.stringify(dataCT));
							};

							var failDelete = function () {
								Logger.debug("Error during delete of "+JSON.stringify(dataCT));
							};
							ctObject.delete(successDelete, failDelete);
						} else {
							var sourceId : number = dataCT.source.id;

							var rSource = retrieveSource(sourceId);

							if (rSource === undefined) {
								var successReadSource : Function = function (source : Source) {

									var successLoadService : Function = function () {
										sources.push(source);
										dataCT.source.service = source.service().toJSONObject();
										saveCallType(dataCT);
									};

									source.loadService(successLoadService, fail);
								};


								Source.read(sourceId, successReadSource, fail);

							} else {
								dataCT.source.service = rSource.service().toJSONObject();
								saveCallType(dataCT);
							}
						}
					};

					callType.toCompleteJSONObject(successLoadAssoCT, fail);
				});

			};

			zone.toCompleteJSONObject(successLoadCallTypes, fail);

		};

		Zone.read(zoneId, successRead, fail);
	}

////////////////////// End: Manage sendCallTypesFromZoneId //////////////////////

////////////////////// Begin: Manage sendCompleteRelativeTimeline //////////////////////

	/**
	 * Retrieve a complete RelativeTimeline description.
	 * Send the result on the channel "CompleteRelativeTimelineDescription"
	 *
	 * @method sendCompleteRelativeTimeline
	 * @param {JSONObject} timelineIdDescription - Timeline description to retrieve
	 */
	sendCompleteRelativeTimeline(timelineIdDescription : any) {
		// timelineIdDescription : { "timelineId": number }
		var self = this;

		var timelineId = timelineIdDescription.timelineId;

		var fail : Function = function(error) {
			self.socket.emit("CompleteRelativeTimelineDescription", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - sendCompleteRelativeTimeline failed ");
		};

		var successRead = function (relTimeline : RelativeTimeline) {

			var successRelativeTimelineCompleteDescription = function(relTimelineDesc) {
				var timelineJSON = relTimelineDesc;

				timelineJSON["relativeEvents"] = [];

				if(relTimeline.relativeEvents().length > 0) {

					relTimeline.relativeEvents().forEach(function (relEvent:RelativeEvent) {
						var relEventJSON = relEvent.toJSONObject();

						var successEventLoadAssociations = function () {
							var successCallComplete = function (callComplete) {
								relEventJSON["call"] = callComplete;
								timelineJSON["relativeEvents"].push(relEventJSON);

								if (timelineJSON["relativeEvents"].length == relTimeline.relativeEvents().length) {
									var sortedRelativeEvents = self._sortRelativeEvents(timelineJSON["relativeEvents"]);
									timelineJSON["relativeEvents"] = sortedRelativeEvents;

									self.socket.emit("CompleteRelativeTimelineDescription", self.formatResponse(true, timelineJSON));
								}
							};

							relEvent.call().toCompleteJSONObject(successCallComplete, fail);
						};

						relEvent.loadAssociations(successEventLoadAssociations, fail);
					});
				} else {
					self.socket.emit("CompleteRelativeTimelineDescription", self.formatResponse(true, timelineJSON));
				}
			};

			relTimeline.toCompleteJSONObject(successRelativeTimelineCompleteDescription, fail);

		};

		RelativeTimeline.read(timelineId, successRead, fail);
	}

	/**
	 * Sort RelativeTimeline's events.
	 *
	 * @method _sortRelativeEvents
	 * @private
	 * @param {Array<RelativeEvent_JSON>} relativeEvents - RelativeEvents to sort
	 */
	private _sortRelativeEvents(relativeEvents : Array<any>) {
		var map = relativeEvents.map(function(e, i) {
			return { index: i, value: e.position };
		});

		map.sort(function(a, b) {
			return a.value - b.value;
		});

		var result = map.map(function(e){
			return relativeEvents[e.index];
		});

		return result;
	}

////////////////////// End: Manage sendCompleteRelativeTimeline //////////////////////

////////////////////// Begin: Manage sendCompleteAbsoluteTimeline //////////////////////

	/**
	 * Retrieve a complete AbsoluteTimeline description.
	 * Send the result on the channel "CompleteAbsoluteTimelineDescription"
	 *
	 * @method sendCompleteAbsoluteTimeline
	 * @param {JSONObject} timelineIdDescription - Timeline description to retrieve
	 */
	sendCompleteAbsoluteTimeline(timelineIdDescription : any) {
		// timelineIdDescription : { "timelineId": number }
		var self = this;

		var timelineId = timelineIdDescription.timelineId;

		var fail : Function = function(error) {
			self.socket.emit("CompleteAbsoluteTimelineDescription", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - sendCompleteAbsoluteTimeline failed ");
		};

		var successRead = function (absTimeline : AbsoluteTimeline) {
			var timelineJSON = absTimeline.toJSONObject();

			var successLoadAssociations = function() {
				timelineJSON["absoluteEvents"] = [];

				if(absTimeline.absoluteEvents().length > 0) {

					absTimeline.absoluteEvents().forEach(function (absEvent:AbsoluteEvent) {
						var absEventJSON = absEvent.toJSONObject();

						var successEventLoadAssociations = function () {
							absEventJSON["relativeTimeline"] = absEvent.relativeTimeline().toJSONObject();

							var successRelativeTimelineLoadAssociations = function () {
								absEventJSON["relativeTimeline"]["relativeEvents"] = [];

								if(absEvent.relativeTimeline().relativeEvents().length > 0) {

									absEvent.relativeTimeline().relativeEvents().forEach(function (relEvent:RelativeEvent) {
										var relEventJSON = relEvent.toJSONObject();

										var successRelEventLoadAssociations = function () {
											var successCallComplete = function (callComplete) {
												relEventJSON["call"] = callComplete;
												absEventJSON["relativeTimeline"]["relativeEvents"].push(relEventJSON);

												if (absEventJSON["relativeTimeline"]["relativeEvents"].length == absEvent.relativeTimeline().relativeEvents().length) {
													timelineJSON["absoluteEvents"].push(absEventJSON);

													if (timelineJSON["absoluteEvents"].length == absTimeline.absoluteEvents().length) {
														self.socket.emit("CompleteAbsoluteTimelineDescription", self.formatResponse(true, timelineJSON));
													}
												}
											};

											relEvent.call().toCompleteJSONObject(successCallComplete, fail);
										};

										relEvent.loadAssociations(successRelEventLoadAssociations, fail);
									});
								} else {
									timelineJSON["absoluteEvents"].push(absEventJSON);

									if (timelineJSON["absoluteEvents"].length == absTimeline.absoluteEvents().length) {
										self.socket.emit("CompleteAbsoluteTimelineDescription", self.formatResponse(true, timelineJSON));
									}
								}
							};

							absEvent.relativeTimeline().loadAssociations(successRelativeTimelineLoadAssociations, fail);
						};

						absEvent.loadAssociations(successEventLoadAssociations, fail);
					});
				} else {
					self.socket.emit("CompleteAbsoluteTimelineDescription", self.formatResponse(true, timelineJSON));
				}
			};

			absTimeline.loadAssociations(successLoadAssociations, fail);

		};

		AbsoluteTimeline.read(timelineId, successRead, fail);
	}

////////////////////// End: Manage sendCompleteAbsoluteTimeline //////////////////////

////////////////// Begin: Manage sendCompleteCallType //////////////////////

	/**
	 * Retrieve a complete CallType description.
	 * Send the result on the channel "CompleteCallTypeDescription"
	 *
	 * @method sendCompleteCallType
	 * @param {JSONObject} callTypeIdDescription - Represents CallType to retrieve
	 */
	sendCompleteCallType(callTypeIdDescription : any) {
		// callTypeIdDescription : { "callTypeId": number }
		var self = this;

		var callTypeId = callTypeIdDescription.callTypeId;

		var fail : Function = function(error) {
			self.socket.emit("CompleteCallTypeDescription", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - sendCompleteCallType failed ");
		};

		var successRead = function (callType : CallType) {
			var cTJSON = callType.toJSONObject();

			var successLoadAssociations = function() {

				var successSourceCompleteDescription = function(sourceCompleteDesc) {
					cTJSON["source"] = sourceCompleteDesc;

					cTJSON["source"]["paramTypes"] = [];
					cTJSON["source"]["paramValues"] = [];

					if(callType.source().paramTypes().length == 0 && callType.source().paramValues().length == 0) {
						self.socket.emit("CompleteCallTypeDescription", self.formatResponse(true, cTJSON));
					} else {
						callType.source().paramTypes().forEach(function (pT) {


							var successParamTypeCompleteDesc = function (pTCompleteDesc) {
								var pTJSON = pTCompleteDesc;

								pTJSON["constraint"] = null;

								if(pT.constraint() != null) {
									pTJSON["constraint"] = pT.constraint().toJSONObject();

									var successConstraintComplete = function (constraintDesc) {
										pTJSON["constraint"] = constraintDesc;

										cTJSON["source"]["paramTypes"].push(pTJSON);

										if (cTJSON["source"]["paramTypes"].length == callType.source().paramTypes().length && cTJSON["source"]["paramValues"].length == callType.source().paramValues().length) {
											self.socket.emit("CompleteCallTypeDescription", self.formatResponse(true, cTJSON));
										}
									};

									pT.constraint().toCompleteJSONObject(successConstraintComplete, fail);
								} else {
									cTJSON["source"]["paramTypes"].push(pTJSON);

									if (cTJSON["source"]["paramTypes"].length == callType.source().paramTypes().length && cTJSON["source"]["paramValues"].length == callType.source().paramValues().length) {
										self.socket.emit("CompleteCallTypeDescription", self.formatResponse(true, cTJSON));
									}
								}
							};


							pT.toCompleteJSONObject(successParamTypeCompleteDesc, fail);
						});

						callType.source().paramValues().forEach(function (pV) {

							var successParamValueComplete = function (pVDesc) {
								cTJSON["source"]["paramValues"].push(pVDesc);

								if (cTJSON["source"]["paramValues"].length == callType.source().paramValues().length && cTJSON["source"]["paramTypes"].length == callType.source().paramTypes().length) {
									self.socket.emit("CompleteCallTypeDescription", self.formatResponse(true, cTJSON));
								}
							};


							pV.toCompleteJSONObject(successParamValueComplete, fail);
						});

					}
				}

				callType.source().toCompleteJSONObject(successSourceCompleteDescription, fail);
			};

			callType.loadAssociations(successLoadAssociations, fail);
		};

		CallType.read(callTypeId, successRead, fail);
	}

////////////////////// End: Manage sendCompleteCallType //////////////////////

////////////////// Begin: Manage sendCompleteCall //////////////////////

	/**
	 * Retrieve a complete Call description.
	 * Send the result on the channel "CompleteCallDescription"
	 *
	 * @method sendCompleteCall
	 * @param {JSONObject} callIdDescription - Represents Call to retrieve
	 */
	sendCompleteCall(callIdDescription : any) {
		// callIdDescription : { "callId": number }
		var self = this;

		var callId = callIdDescription.callId;

		var fail : Function = function(error) {
			self.socket.emit("CompleteCallDescription", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - sendCompleteCall failed ");
		};

		var successRead = function (call : Call) {

			var successCallCompleteDescription = function(callComplete) {
				var callJSON = callComplete;
				callJSON["paramValues"] = [];

				if(call.paramValues().length > 0) {
					call.paramValues().forEach(function (pV:ParamValue) {

						var successParamValueCompleteDescription = function(pVComplete) {
							callJSON["paramValues"].push(pVComplete);

							if(callJSON["paramValues"].length == call.paramValues().length) {
								self.socket.emit("CompleteCallDescription", self.formatResponse(true, callJSON));
							}
						};

						pV.toCompleteJSONObject(successParamValueCompleteDescription, fail);
					});
				} else {
					self.socket.emit("CompleteCallDescription", self.formatResponse(true, callJSON));
				}
			};

			call.toCompleteJSONObject(successCallCompleteDescription, fail);
		};

		Call.read(callId, successRead, fail);
	}

////////////////////// End: Manage sendCompleteCallType //////////////////////

////////////////// Begin: Manage updateZonePosition //////////////////////

	/**
	 * Update Zone with the new position informations
	 * Send the result on the channel "CompleteCallDescription"
	 *
	 * @method updateZonePosition
	 * @param {JSONObject} zoneDescription - Represents Zone to update
	 */
	updateZonePosition(zoneDescription : any) {
		var self = this;

		var zoneId = zoneDescription.id;

		var fail : Function = function(error) {
			self.socket.emit("AnswerZoneUpdate", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - updateZonePosition failed ");
		};

		var successRead = function (zone : Zone) {
			zone.setPositionFromLeft(zoneDescription.positionFromLeft);
			zone.setPositionFromTop(zoneDescription.positionFromTop);
			zone.setWidth(zoneDescription.width);
			zone.setHeight(zoneDescription.height);

			var successUpdate = function () {
				self.socket.emit("AnswerZoneUpdate", zone.toJSONObject());
			};

			zone.update(successUpdate, fail);
		};

		Zone.read(zoneId, successRead, fail);
	}

////////////////////// End: Manage updateZonePosition //////////////////////

////////////////// Begin: Manage createEmptyParamValue //////////////////////

	/**
	 * Create an empty ParamValue and associate it to ParamType in param.
	 * Send the result on the channel "AnswerCreateEmptyParamValueForParamTypeId"
	 *
	 * @method createEmptyParamValue
	 * @param {JSONObject} paramTypeIdDescription - Represents Call to retrieve
	 */
	createEmptyParamValue(paramTypeIdDescription : any) {
		// paramTypeIdDescription : { "paramTypeId": number }
		var self = this;

		var paramTypeId = paramTypeIdDescription.paramTypeId;

		var fail : Function = function(error) {
			self.socket.emit("AnswerCreateEmptyParamValueForParamTypeId", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - createEmptyParamValue failed ");
		};

		var successReadParamType = function(paramType : ParamType) {

			var successLoadParamTypeAssociations = function() {
				var pV = new ParamValue();

				if(paramType.defaultValue() != null) {
					pV.setValue(paramType.defaultValue().value());
				}

				var successCreateParamValue = function() {

					var successlinkParamType = function() {
						self.socket.emit("AnswerCreateEmptyParamValueForParamTypeId", self.formatResponse(true, pV.toJSONObject()));
					}

					pV.linkParamType(paramTypeId, successlinkParamType, fail);
				}

				pV.create(successCreateParamValue, fail);
			};

			paramType.loadAssociations(successLoadParamTypeAssociations, fail);
		}

		ParamType.read(paramTypeId, successReadParamType, fail);


	}

////////////////////// End: Manage createEmptyParamValue //////////////////////

////////////////// Begin: Manage sendOAuthKeysFromServiceAndUser //////////////////////

	/**
	 * Create an empty ParamValue and associate it to ParamType in param.
	 * Send the result on the channel "OAuthKeysFromServiceAndUser"
	 *
	 * @method sendOAuthKeysFromServiceAndUser
	 * @param {JSONObject} serviceUserDescription - Represents OAuthKey to retrieve
	 */
	sendOAuthKeysFromServiceAndUser(serviceUserDescription : any) {
		// serviceUserDescription : { "userId": number, "serviceId": number }
		var self = this;

		var userId = serviceUserDescription.userId;
		var serviceId = serviceUserDescription.serviceId;

		var fail : Function = function(error) {
			self.socket.emit("OAuthKeysFromServiceAndUser", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - sendOAuthKeysFromServiceAndUser failed ");
		};

		var successReadUser = function(user : User) {

			var successLoadUserAssociations = function() {
				var oauthkeys = [];
				if(user.oauthkeys().length > 0) {
					var done = [];
					user.oauthkeys().forEach(function(oauthkey : OAuthKey) {
						var successLoadOAuthKeyCompleteDesc = function(oauthkeyDesc) {
							done.push(oauthkeyDesc);

							if(oauthkeyDesc.service.id == serviceId) {
								oauthkeys.push(oauthkeyDesc);
							}

							if(done.length == user.oauthkeys().length) {
								self.socket.emit("OAuthKeysFromServiceAndUser", self.formatResponse(true, oauthkeys));
							}
						};

						oauthkey.toCompleteJSONObject(successLoadOAuthKeyCompleteDesc, fail);
					});
				} else {
					self.socket.emit("OAuthKeysFromServiceAndUser", self.formatResponse(true, oauthkeys));
				}
			};

			user.loadAssociations(successLoadUserAssociations, fail);
		}

		User.read(userId, successReadUser, fail);


	}

////////////////////// End: Manage sendOAuthKeysFromServiceAndUser //////////////////////

////////////////////// Begin: Manage sendCompleteProfil //////////////////////

	/**
	 * Retrieve a complete Profil description.
	 * Send the result on the channel "CompleteProfilDescription"
	 *
	 * @method sendCompleteRelativeTimeline
	 * @param {JSONObject} profilIdDescription - Profil description to retrieve
	 */
	sendCompleteProfil(profilIdDescription : any) {
		// profilIdDescription : { "profilId": number }
		var self = this;

		var profilId = profilIdDescription.profilId;

		var fail : Function = function(error) {
			self.socket.emit("CompleteProfilDescription", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - sendCompleteProfil failed ");
		};

		var successRead = function (profil : Profil) {

			var successProfilCompleteDescription = function(profilDesc) {
				var profilJSON = profilDesc;
				profilJSON["zoneContents"] = [];

				if(profil.zoneContents().length > 0) {
					profil.zoneContents().forEach(function (zoneContent:ZoneContent) {

						var successZoneContentCompleteDescription = function(zcCompleteDesc) {
							profilJSON["zoneContents"].push(zcCompleteDesc);

							if(profilJSON["zoneContents"].length == profil.zoneContents().length) {
								self.socket.emit("CompleteProfilDescription", self.formatResponse(true, profilJSON));
							}
						};

						zoneContent.toCompleteJSONObject(successZoneContentCompleteDescription, fail);
					});
				} else {
					self.socket.emit("CompleteProfilDescription", self.formatResponse(true, profilJSON));
				}

			};

			profil.toCompleteJSONObject(successProfilCompleteDescription, fail);

		};

		Profil.read(profilId, successRead, fail);
	}

////////////////////// End: Manage sendCompleteProfil //////////////////////

////////////////////// Begin: Manage sendZoneContentsFromZoneId //////////////////////

	/**
	 * Retrieve ZoneContents from a given Zone ID.
	 * Send the result on the channel "ZoneContentsFromZoneId"
	 *
	 * @method sendZoneContentsFromZoneId
	 * @param {JSONObject} zoneIdDescription - Zone description to retrieve
	 */
	sendZoneContentsFromZoneId(zoneIdDescription : any) {
		// zoneIdDescription : { "zoneId": number }
		var self = this;

		var zoneId = zoneIdDescription.zoneId;

		var fail : Function = function(error) {
			self.socket.emit("ZoneContentsFromZoneId", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - sendZoneContentsFromZoneId failed ");
		};

		var successRead = function (zone : Zone) {

			var successZoneCompleteDescription : Function = function (zoneCompleteDesc) {
				var zoneJSON = zoneCompleteDesc;

				zoneJSON["zoneContents"] = [];

				if(zone.zoneContents().length > 0) {
					zone.zoneContents().forEach(function (zoneContent:ZoneContent) {

						var successZoneContentCompleteDescription = function(zcCompleteDesc) {
							zoneJSON["zoneContents"].push(zcCompleteDesc);

							if(zoneJSON["zoneContents"].length == zone.zoneContents().length) {
								self.socket.emit("ZoneContentsFromZoneId", self.formatResponse(true, zoneJSON));
							}
						};

						zoneContent.toCompleteJSONObject(successZoneContentCompleteDescription, fail);
					});
				} else {
					self.socket.emit("ZoneContentsFromZoneId", self.formatResponse(true, zoneJSON));
				}

			};

			zone.toCompleteJSONObject(successZoneCompleteDescription, fail);

		};

		Zone.read(zoneId, successRead, fail);
	}

////////////////////// End: Manage sendZoneContentsFromZoneId //////////////////////

////////////////////// Begin: Manage sendConnectedClients //////////////////////

	sendConnectedClients(profilIdDescription : any) {
		// profilIdDescription : { "profilId": number }

		var self = this;
		var profilId = profilIdDescription.profilId;

		var fail : Function = function (error) {
			self.socket.emit("ConnectedClientOfProfil", self.formatResponse(false, error));
		};

		var successRead : Function = function (profil : Profil) {

			var successLoad : Function = function () {
				self.socket.emit("ConnectedClientOfProfil", self.formatResponse(true, profil.serializeArray(profil.connectedClients())));
			};

			profil.loadConnectedClients(successLoad, fail);
		};

		Profil.read(profilId, successRead, fail);
	}

////////////////////// End: Manage sendConnectedClients //////////////////////

////////////////////// Begin: Manage sendRefreshCommandToClient //////////////////////

	sendRefreshCommandToClient(clientIdDescription : any) {
		// clientIdDescription : { "clientId": number }

		var self = this;
		var clientId = clientIdDescription.clientId;

		var fail : Function = function (error) {
			Logger.error("Error when refreshing the client : "+clientId);
			self.socket.emit("AnswerRefreshCommand", self.formatResponse(false, error));
		};

		var successRead : Function = function (client : Client) {

			var nms : NamespaceManager = self.server().retrieveNamespaceManagerFromSocketId(client.socketID());

			if (nms !== undefined && nms['refreshClient'] !== undefined) {
				Logger.debug("Send command to refresh client : "+clientId);
				self.socket.emit("AnswerRefreshCommand", self.formatResponse(true, ""));
				nms['refreshClient']();
			} else {
				fail("Unable to retrieve namespace manager associated to client, this one will be deleted.");

				var successDelete : Function = function () {
					Logger.debug("Client successfully deleted.");
				}
				client.delete(successDelete, fail);
			}
		};

		Client.read(clientId, successRead, fail);
	}

////////////////////// Begin: Manage sendRefreshCommandToClient //////////////////////

////////////////////// Begin: Manage sendIdentifyCommandToClient //////////////////////

	sendIdentifyCommandToClient(clientIdDescription : any) {
		// clientIdDescription : { "clientId": number }

		var self = this;
		var clientId = clientIdDescription.clientId;

		var fail : Function = function (error) {
			Logger.error("Error when identifying the client : "+clientId);
			self.socket.emit("AnswerIdentifyCommand", self.formatResponse(false, error));
		};

		var successRead : Function = function (client : Client) {

			var nms : NamespaceManager = self.server().retrieveNamespaceManagerFromSocketId(client.socketID());

			if (nms !== undefined && nms['identifyClient'] !== undefined) {
				Logger.debug("Send command to identify client : "+clientId);
				self.socket.emit("AnswerIdentifyCommand", self.formatResponse(true, ""));
				nms['identifyClient'](clientId);
			} else {
				fail("Unable to retrieve namespace manager associated to client, this one will be deleted.");

				var successDelete : Function = function () {
					Logger.debug("Client successfully deleted.");
				}
				client.delete(successDelete, fail);
			}
		};

		Client.read(clientId, successRead, fail);
	}

////////////////////// Begin: Manage sendIdentifyCommandToClient //////////////////////


}