/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="./BackendAuthNamespaceManager.ts" />
/// <reference path="../model/User.ts" />
/// <reference path="../model/SDI.ts" />
/// <reference path="../model/Source.ts" />
/// <reference path="../model/CallType.ts" />
/// <reference path="../model/Service.ts" />
/// <reference path="../model/Zone.ts" />
/// <reference path="../model/OAuthKey.ts" />
/// <reference path="../model/Call.ts" />
/// <reference path="../model/Renderer.ts" />
/// <reference path="../model/RendererTheme.ts" />
/// <reference path="../model/Profil.ts" />
/// <reference path="../model/InfoType.ts" />
/// <reference path="../model/Policy.ts" />
/// <reference path="../model/Behaviour.ts" />
/// <reference path="../model/ThemeZone.ts" />
/// <reference path="../model/ThemeSDI.ts" />
/// <reference path="../model/TimelineRunner.ts" />
/// <reference path="../model/Team.ts" />
/// <reference path="../model/Provider.ts" />


class AdminsNamespaceManager extends BackendAuthNamespaceManager {

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
		this.addListenerToSocket('RetrieveSystemTriggerDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(SystemTrigger, "systemTriggerId", description, "SystemTriggerDescription"); });
		this.addListenerToSocket('RetrieveUserTriggerDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(UserTrigger, "userTriggerId", description, "UserTriggerDescription"); });
		this.addListenerToSocket('RetrieveUserDescription', function(description) { self.sendObjectDescriptionFromJSONDescriptionWithID(User, "userId", description, "UserDescription"); });


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
		this.addListenerToSocket('RetrieveAllSystemTriggerDescription', function() { self.sendAllObjectDescription(SystemTrigger, "AllSystemTriggerDescription"); });
		this.addListenerToSocket('RetrieveAllUserTriggerDescription', function() { self.sendAllObjectDescription(UserTrigger, "AllUserTriggerDescription"); });
		this.addListenerToSocket('RetrieveAllUserDescription', function() { self.sendAllObjectDescription(User, "AllUserDescription"); });
		this.addListenerToSocket('RetrieveAllSDIDescription', function() { self.sendAllObjectDescription(SDI, "AllSDIDescription"); });
		this.addListenerToSocket('RetrieveAllProviderDescription', function() { self.sendAllObjectDescription(Provider, "AllProviderDescription"); });

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
		this.addListenerToSocket('CreateConstraintParamType', function(data) { self.createObject(ConstraintParamType, data, "AnswerCreateConstraintParamType"); });
		this.addListenerToSocket('CreateTypeParamType', function(data) { self.createObject(TypeParamType, data, "AnswerCreateTypeParamType"); });
		this.addListenerToSocket('CreateInfoType', function(data) { self.createObject(InfoType, data, "AnswerCreateInfoType"); });
		this.addListenerToSocket('CreateService', function(data) { self.createObject(Service, data, "AnswerCreateService"); });
		this.addListenerToSocket('CreateSource', function(data) { self.createObject(Source, data, "AnswerCreateSource"); });
		this.addListenerToSocket('CreateRenderer', function(data) { self.createObject(Renderer, data, "AnswerCreateRenderer"); });
		this.addListenerToSocket('CreateBehaviour', function(data) { self.createObject(Behaviour, data, "AnswerCreateBehaviour"); });
		this.addListenerToSocket('CreatePolicy', function(data) { self.createObject(Policy, data, "AnswerCreatePolicy"); });
		this.addListenerToSocket('CreateSystemTrigger', function(data) { self.createObject(SystemTrigger, data, "AnswerCreateSystemTrigger"); });
		this.addListenerToSocket('CreateUserTrigger', function(data) { self.createObject(UserTrigger, data, "AnswerCreateUserTrigger"); });
		this.addListenerToSocket('CreateTimelineRunner', function(data) { self.createObject(TimelineRunner, data, "AnswerCreateTimelineRunner"); });
		this.addListenerToSocket('CreateProvider', function(data) { self.createObject(Provider, data, "AnswerCreateProvider"); });


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
		this.addListenerToSocket('UpdateConstraintParamType', function(data) { self.updateObjectAttribute(ConstraintParamType, data, "AnswerUpdateConstraintParamType"); });
		this.addListenerToSocket('UpdateTypeParamType', function(data) { self.updateObjectAttribute(TypeParamType, data, "AnswerUpdateTypeParamType"); });
		this.addListenerToSocket('UpdateInfoType', function(data) { self.updateObjectAttribute(InfoType, data, "AnswerUpdateInfoType"); });
		this.addListenerToSocket('UpdateService', function(data) { self.updateObjectAttribute(Service, data, "AnswerUpdateService"); });
		this.addListenerToSocket('UpdateSource', function(data) { self.updateObjectAttribute(Source, data, "AnswerUpdateSource"); });
		this.addListenerToSocket('UpdateRenderer', function(data) { self.updateObjectAttribute(Renderer, data, "AnswerUpdateRenderer"); });
		this.addListenerToSocket('UpdateBehaviour', function(data) { self.updateObjectAttribute(Behaviour, data, "AnswerUpdateBehaviour"); });
		this.addListenerToSocket('UpdatePolicy', function(data) { self.updateObjectAttribute(Policy, data, "AnswerUpdatePolicy"); });
		this.addListenerToSocket('UpdateSystemTrigger', function(data) { self.updateObjectAttribute(SystemTrigger, data, "AnswerUpdateSystemTrigger"); });
		this.addListenerToSocket('UpdateUserTrigger', function(data) { self.updateObjectAttribute(UserTrigger, data, "AnswerUpdateUserTrigger"); });
		this.addListenerToSocket('UpdateTimelineRunner', function(data) { self.updateObjectAttribute(TimelineRunner, data, "AnswerUpdateTimelineRunner"); });
		this.addListenerToSocket('UpdateOAuthKey', function(data) { self.updateObjectAttribute(OAuthKey, data, "AnswerUpdateOAuthKey"); });
		this.addListenerToSocket('UpdateProvider', function(data) { self.updateObjectAttribute(Provider, data, "AnswerUpdateProvider"); });


		// Delete object
		this.addListenerToSocket('DeleteRelativeEvent', function(idRelativeEvent) { self.deleteObjectFromDescription(RelativeEvent, "relativeEventId", idRelativeEvent, "AnswerDeleteRelativeEvent"); });
		this.addListenerToSocket('DeleteZoneContent', function(idZoneContent) { self.deleteObjectFromDescription(ZoneContent, "zoneContentId", idZoneContent, "AnswerDeleteZoneContent"); });
		this.addListenerToSocket('DeleteProfil', function(idProfil) { self.deleteObjectFromDescription(Profil, "profilId", idProfil, "AnswerDeleteProfil"); });
		this.addListenerToSocket('DeleteThemeZone', function(idThemeZone) { self.deleteObjectFromDescription(ThemeZone, "themeZoneId", idThemeZone, "AnswerDeleteThemeZone"); });
		this.addListenerToSocket('DeleteThemeSDI', function(idThemeSDI) { self.deleteObjectFromDescription(ThemeSDI, "themeSDIId", idThemeSDI, "AnswerDeleteThemeSDI"); });
		this.addListenerToSocket('DeleteParamType', function(idParamType) { self.deleteObjectFromDescription(ParamType, "paramTypeId", idParamType, "AnswerDeleteParamType"); });
		this.addListenerToSocket('DeleteConstraintParamType', function(idConstraintParamType) { self.deleteObjectFromDescription(ConstraintParamType, "constraintParamTypeId", idConstraintParamType, "AnswerDeleteConstraintParamType"); });
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
		this.addListenerToSocket('DeleteSystemTrigger', function(idSystemTrigger) { self.deleteObjectFromDescription(SystemTrigger, "systemTriggerId", idSystemTrigger, "AnswerDeleteSystemTrigger"); });
		this.addListenerToSocket('DeleteUserTrigger', function(idUserTrigger) { self.deleteObjectFromDescription(UserTrigger, "userTriggerId", idUserTrigger, "AnswerDeleteUserTrigger"); });
		this.addListenerToSocket('DeleteSDI', function(idSDI) { self.deleteObjectFromDescription(SDI, "sdiId", idSDI, "AnswerDeleteSDI"); });
		this.addListenerToSocket('DeleteTimelineRunner', function(idTimelineRunner) { self.deleteObjectFromDescription(TimelineRunner, "timelineRunnerId", idTimelineRunner, "AnswerDeleteTimelineRunner"); });
		this.addListenerToSocket('DeleteProvider', function(idProvider) { self.deleteObjectFromDescription(Provider, "providerId", idProvider, "AnswerDeleteProvider"); });

		// Custom requests
		this.addListenerToSocket('RetrieveSourcesFromServiceId', function(serviceIdDescription) { self.sendSourcesFromServiceId(serviceIdDescription); });
		this.addListenerToSocket('RetrieveRenderersFromSourceId', function(sourceIdDescription) { self.sendRenderersFromSourceId(sourceIdDescription); });
		this.addListenerToSocket('RetrieveRendererThemesFromRendererId', function(rendererIdDescription) { self.sendRendererThemesFromRendererId(rendererIdDescription); });

		this.addListenerToSocket('RetrieveCallTypesFromZoneId', function(zoneIdDescription) { self.sendCallTypesFromZoneId(zoneIdDescription); });
		this.addListenerToSocket('RetrieveCompleteRelativeTimeline', function(timelineIdDescription) { self.sendCompleteRelativeTimeline(timelineIdDescription); });
		this.addListenerToSocket('RetrieveCompleteAbsoluteTimeline', function(timelineIdDescription) { self.sendCompleteAbsoluteTimeline(timelineIdDescription); });
		this.addListenerToSocket('RetrieveCompleteCallType', function(callTypeIdDescription) { self.sendCompleteCallType(callTypeIdDescription); });
		this.addListenerToSocket('RetrieveCompleteCall', function(callIdDescription) { self.sendCompleteCall(callIdDescription); });
		this.addListenerToSocket('UpdateZonePosition', function(data) { self.updateZonePosition(data); });
		this.addListenerToSocket('CreateEmptyParamValueForParamTypeId', function(paramTypeIdDescription) { self.createEmptyParamValue(paramTypeIdDescription); });
		this.addListenerToSocket('RetrieveOAuthKeysFromProviderAndSDI', function(providerSDIDescription) { self.sendOAuthKeysFromProviderAndSDI(providerSDIDescription); });
		this.addListenerToSocket('RetrieveCompleteProfilDescription', function(profilIdDescription) { self.sendCompleteProfil(profilIdDescription); });
		this.addListenerToSocket('RetrieveZoneContentsFromZoneId', function(zoneIdDescription) { self.sendZoneContentsFromZoneId(zoneIdDescription); });
		this.addListenerToSocket('AddThemeToRenderer', function(newThemeDescription) { self.addThemeToRenderer(newThemeDescription); });
		this.addListenerToSocket('RemoveThemeFromRenderer', function(themeDescription) { self.removeThemeFromRenderer(themeDescription); });

		this.addListenerToSocket('RetrieveConnectedClientOfProfil', function (profilIdDescription) { self.sendConnectedClients(profilIdDescription); });
	    this.addListenerToSocket('RetrieveAllZoneDescriptionFromSDI', function(description) { self.sendAllZoneDescriptionFromSDI(description); });

		this.addListenerToSocket('RetrieveAllTeamDescription', function() { self.sendAllTeamDescription(); });
		this.addListenerToSocket('RetrieveOAuthKeyDescriptionForTeam', function(teamId) { self.retrieveOAuthKeyDescriptionForTeam(teamId); });
		this.addListenerToSocket('CreateUser', function(data) { self.createUser(data); });
		this.addListenerToSocket('DeleteUser', function(idUser) { self.deleteUser(idUser["userId"]); });
		this.addListenerToSocket('UpdateUser', function(data) { self.updateUser(data); });
		this.addListenerToSocket('CreateTeam', function(data) { self.createTeam(data); });
		this.addListenerToSocket('DeleteTeam', function(idTeam) { self.deleteTeam(idTeam["teamId"]); });
		this.addListenerToSocket('UpdateTeam', function(data) { self.updateTeam(data); });


		this.addListenerToSocket('CreateOAuthKeyDescription', function(data) { self.createOAuthKey(data); });

		this.addListenerToSocket('RetrieveParamTypesFromCallType', function (callTypeDescription) { self.sendParamTypesDescriptionFromCallType(callTypeDescription); });
		this.addListenerToSocket('CreateParamValueDescription', function (paramValueDescription) { self.createParamValueDescription(paramValueDescription); });
		this.addListenerToSocket('RetrieveParamValuesFromCall', function (callDescription) { self.sendParamValuesDescriptionFromCall(callDescription); });
		this.addListenerToSocket('ResetUserPassword', function (passwordDescription) { self.resetUserPassword(passwordDescription); });

		this.addListenerToSocket('CloneProfil', function(data) { self.cloneProfil(data); });
		this.addListenerToSocket('CloneSDI', function(data) { self.cloneSDI(data); });
		this.addListenerToSocket('CloneRelativeEventAndLinkTimeline', function (data) { self.cloneRelativeEventAndLinkTimeline(data); });

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
		// oauthKeyDescription : {"userId" : string, "providerId" : string, "name" : string, "description" : string, "value" : any (JSONObject)}
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
			var successLinkProvider : Function = function() {
				var userId = oauthKeyDescription.userId;

				var successRetrieveUser : Function = function(user) {

					var successUserAssociation : Function = function() {

						var successOAuthKeyCompleteJSON : Function = function(oauthKeyCompleteJSON) {
							self.socket.emit("OAuthKeyDescription", self.formatResponse(true, oauthKeyCompleteJSON));
						};

						newOAuthKey.toCompleteJSONObject(successOAuthKeyCompleteJSON, fail);
					}

					user.addOAuthKey(newOAuthKey.getId(),successUserAssociation, fail);
				};

				User.read(userId, successRetrieveUser, fail);
			};
			newOAuthKey.linkProvider(oauthKeyDescription.providerId, successLinkProvider, fail);
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

////////////////////// Begin: Manage sendRendererThemesFromRendererId //////////////////////

	/**
	 * Retrieve RendererThemes from a given Renderer Id.
	 * Send the result on the channel "RendererThemesDescriptionFromRenderer"
	 *
	 * @method sendRendererThemesFromRendererId
	 * @param rendererIdDescription
	 */
	sendRendererThemesFromRendererId(rendererIdDescription : any) {
		// rendererIdDescription : { "rendererId": number }
		var self = this;

		var rendererId = rendererIdDescription.rendererId;

		var fail : Function = function(error) {
			self.socket.emit("RendererThemesDescriptionFromRenderer", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - sendRendererThemesFromRendererId failed ");
		};

		var successRead = function (renderer : Renderer) {

			var successLoadRendererThemes : Function = function () {
				var rendererThemes : Array<RendererTheme> = renderer.rendererThemes();

				self.socket.emit("RendererThemesDescriptionFromRenderer", self.formatResponse(true, renderer.serializeArray(rendererThemes)));
			};

			renderer.loadRendererThemes(successLoadRendererThemes, fail);
		};

		Renderer.read(rendererId, successRead, fail);
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

				cTJSON["renderer"] = (callType.renderer() !== null) ? callType.renderer().toJSONObject() : null;
				cTJSON["rendererTheme"] = (callType.rendererTheme() !== null) ? callType.rendererTheme().toJSONObject() : null;

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
					var finalSuccess = function () {
						self.socket.emit("AnswerCreateEmptyParamValueForParamTypeId", self.formatResponse(true, pV.toJSONObject()));
					};

					var successlinkParamType = function() {
						var successCheckCompleteness = function () {
							if (pV.isComplete()) {
								var successUpdate = function () {
									finalSuccess();
								};
								pV.update(successUpdate, fail);
							} else {
								finalSuccess();
							}
						};

						pV.checkCompleteness(successCheckCompleteness, fail);
					};

					pV.linkParamType(paramTypeId, successlinkParamType, fail);
				};

				pV.create(successCreateParamValue, fail);
			};

			paramType.loadAssociations(successLoadParamTypeAssociations, fail);
		};

		ParamType.read(paramTypeId, successReadParamType, fail);


	}

////////////////////// End: Manage createEmptyParamValue //////////////////////

////////////////// Begin: Manage sendOAuthKeysFromProviderAndSDI //////////////////////

	/**
	 * Create an empty ParamValue and associate it to ParamType in param.
	 * Send the result on the channel "OAuthKeysFromProviderAndSDI"
	 *
	 * @method sendOAuthKeysFromProviderAndSDI
	 * @param {JSONObject} providerSDIDescription - Represents OAuthKey to retrieve
	 */
	sendOAuthKeysFromProviderAndSDI(providerSDIDescription : any) {
		// providerSDIDescription : { "sdiId": number, "providerId": number }
		var self = this;

		var sdiId = providerSDIDescription.sdiId;
		var providerId = providerSDIDescription.providerId;

		var fail : Function = function(error) {
			self.socket.emit("OAuthKeysFromProviderAndSDI", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - sendOAuthKeysFromProviderAndSDI failed ");
		};

		var successReadSDI = function(sdi : SDI) {

			var successLoadSDIAssociations = function() {
				var oauthkeys = [];
				if(sdi.team() != null) {
					var successLoadTeamAssociations = function() {
						if(sdi.team().oauthkeys().length > 0) {
							var done = [];
							sdi.team().oauthkeys().forEach(function(oauthkey : OAuthKey) {
								var successLoadOAuthKeyCompleteDesc = function(oauthkeyDesc) {
									done.push(oauthkeyDesc);

									if(oauthkeyDesc.provider.id == providerId && oauthkeyDesc.value != null && oauthkeyDesc.value != "") {
										oauthkeys.push(oauthkeyDesc);
									}

									if(done.length == sdi.team().oauthkeys().length) {
										self.socket.emit("OAuthKeysFromProviderAndSDI", self.formatResponse(true, oauthkeys));
									}
								};

								oauthkey.toCompleteJSONObject(successLoadOAuthKeyCompleteDesc, fail);
							});
						} else {
							self.socket.emit("OAuthKeysFromProviderAndSDI", self.formatResponse(true, oauthkeys));
						}
					};

					sdi.team().loadAssociations(successLoadTeamAssociations, fail);
				} else {
					self.socket.emit("OAuthKeysFromProviderAndSDI", self.formatResponse(true, oauthkeys));
				}
			};

			sdi.loadAssociations(successLoadSDIAssociations, fail);
		};

		SDI.read(sdiId, successReadSDI, fail);
	}

////////////////////// End: Manage sendOAuthKeysFromProviderAndSDI //////////////////////

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
		var onlineClients : Array<Object> = ClientsNamespaceManager.getClientsForProfil(profilId);

		self.socket.emit("ConnectedClientOfProfil", self.formatResponse(true, onlineClients));
	}

////////////////////// End: Manage sendConnectedClients //////////////////////

////////////////////// Begin: Manage sendRefreshCommandToClient //////////////////////

	sendRefreshCommandToClient(clientIdDescription : any) {
		// clientIdDescription : { "clientId": number }

		var self = this;
		var clientId = clientIdDescription.socketId;

		var nms : NamespaceManager = self.server().retrieveNamespaceManagerFromSocketId(clientId);

		if (nms !== undefined && nms['refreshClient'] !== undefined) {
			Logger.debug("Send command to refresh client : "+clientId);
			self.socket.emit("AnswerRefreshCommand", self.formatResponse(true, ""));
			nms['refreshClient']();
		} else {
			Logger.error("Unable to retrieve namespace manager associated to client "+clientId);
			self.socket.emit("AnswerRefreshCommand", self.formatResponse(false, ""));
		}
	}

////////////////////// Begin: Manage sendRefreshCommandToClient //////////////////////

////////////////////// Begin: Manage sendIdentifyCommandToClient //////////////////////

	sendIdentifyCommandToClient(clientIdDescription : any) {
		// clientIdDescription : { "clientId": number }

		var self = this;
		var clientId = clientIdDescription.socketId;

		var nms : NamespaceManager = self.server().retrieveNamespaceManagerFromSocketId(clientId);

		if (nms !== undefined && nms['identifyClient'] !== undefined) {
			Logger.debug("Send command to identify client : "+clientId);
			self.socket.emit("AnswerIdentifyCommand", self.formatResponse(true, ""));
			nms['identifyClient'](clientId);
		} else {
			Logger.error("Unable to retrieve namespace manager associated to client "+clientId);
			self.socket.emit("AnswerIdentifyCommand", self.formatResponse(false, ""));
		}
	}

////////////////////// END: Manage sendIdentifyCommandToClient //////////////////////

////////////////////// Begin: Manage resetUserPassword //////////////////////

	resetUserPassword(passwordDescription : any) {
		// passwordDescription : { 'userId': number, 'password': encryptedPassword }
		var userId = passwordDescription.userId;
		var encryptedPassword = passwordDescription.password;
		var self = this;

		var fail : Function = function (error) {
			Logger.error("Error when identifying the user : "+userId);
			self.socket.emit("AnswerResetUserPassword", self.formatResponse(false, error));
		};

		var successReadUser = function (user : User) {
			var successSetPassword = function () {
				self.socket.emit("AnswerResetUserPassword", self.formatResponse(true, {}));
			};

			user.setPassword(encryptedPassword, successSetPassword, fail);
		};

		User.read(userId, successReadUser, fail);
	}

////////////////////// END: Manage resetUserPassword //////////////////////

////////////////////// Begin: Manage cloneProfil //////////////////////

	cloneProfil(profilDescription : any) {
		// profilDescription : { 'profilId': number }
		var profilId = profilDescription.profilId;
		var self = this;

		var fail : Function = function (error) {
			Logger.error("Error when reading the profil "+profilId);
			Logger.error(error);
			self.socket.emit("AnswerCloneProfil", self.formatResponse(false, error));
		};

		var successReadProfil = function (profil : Profil) {
			var successCloneProfil = function (clonedProfil : Profil) {
				Logger.debug("Answer to admin for cloning profil");
				self.socket.emit("AnswerCloneProfil", self.formatResponse(true, clonedProfil.toJSONObject()));
			};

			profil.clone(successCloneProfil, fail, null);
		};

		Profil.read(profilId, successReadProfil, fail);
	}

////////////////////// END: Manage cloneProfil //////////////////////

////////////////////// Begin: Manage cloneSDI //////////////////////

	cloneSDI(SDIDescription : any) {
		// SDIDescription : { 'SDIId': number }
		var sdiId = SDIDescription.SDIId;
		var self = this;

		var fail : Function = function (error) {
			Logger.error("Error when reading the SDI "+sdiId);
			Logger.error(error);
			self.socket.emit("AnswerCloneSDI", self.formatResponse(false, error));
		};

		var successReadSDI = function (sdi : SDI) {
			var successCloneSDI = function (clonedSDI : SDI) {
				Logger.debug("Answer to admin for cloning sdi");
				self.socket.emit("AnswerCloneSDI", self.formatResponse(true, clonedSDI.toJSONObject()));
			};

			sdi.clone(successCloneSDI, fail);
		};

		SDI.read(sdiId, successReadSDI, fail);
	}

////////////////////// END: Manage cloneSDI //////////////////////

////////////////////// Begin: Manage updateUser //////////////////////

	/**
	 * Update User from given data.
	 * Save new User in CMS.
	 * Send the result on the channel "AnswerUpdateUser"
	 *
	 * @method updateUser
	 * @param {JSONObject} userDescription - User description to update
	 */
	updateUser(userDescription : any) {
		var self = this;

		var fail = function(error) {
			self.socket.emit("AnswerUpdateUser", self.formatResponse(false, error));
			Logger.error("SocketId: " + self.socket.id + " - updateUser : send done with fail status.");
		};

		var successUserCompleteDesc = function(userCompleteDesc) {
			self.socket.emit("AnswerUpdateUser", self.formatResponse(true, userCompleteDesc));
			Logger.debug("SocketId: " + self.socket.id + " - updateUser : send done with success status.");
		};

		var successUserRead = function(user : User) {

			if(user.username() != "" && user.email() != "") {
				var successCompleteUser = function (userCompleteDesc) {

					var successUpdateTeamName = function(newTeam : Team) {

						var failCMS = function(failResponse : RestClientResponse) {
							fail(failResponse.data());
						};

						var data = {
							"username": user.username(),
							"email": user.email()
						};

						if(user.cmsId() != "" && user.cmsAuthkey() != "") {

							var successUpdateCMS = function() {
								successUserCompleteDesc(userCompleteDesc);
							};

							var updateUserUrl = BackendConfig.getCMSHost() + BackendConfig.getCMSUsersPath() + user.cmsId();
							RestClient.put(updateUserUrl, data, successUpdateCMS, failCMS, self.socket.connectedUser.cmsAuthkey());
						} else {
							var successCreateCMS = function(createResponse : RestClientResponse) {
								var data : any = createResponse.data();

								user.setCmsId(data.id);
								user.setCmsAuthkey(data.authkey);

								var successAddCMSUserToCMSTeam = function() {
									successUserCompleteDesc(userCompleteDesc);
								};

								var successUpdate = function() {
									userCompleteDesc.cmsId = user.cmsId();
									userCompleteDesc.cmsAuthkey = user.cmsAuthkey();

									var addUserToTeamUrl = BackendConfig.getCMSHost() + BackendConfig.getCMSTeamsPath() + newTeam.cmsId() + '/' + BackendConfig.getCMSUsersPath() + user.cmsId();

									Logger.debug(addUserToTeamUrl);

									var data = {};

									RestClient.put(addUserToTeamUrl, data, successAddCMSUserToCMSTeam, failCMS, self.socket.connectedUser.cmsAuthkey());
								};

								user.update(successUpdate, fail);
							};

							var createUserUrl = BackendConfig.getCMSHost() + BackendConfig.getCMSUsersPath();
							RestClient.post(createUserUrl, data, successCreateCMS, fail, self.socket.connectedUser.cmsAuthkey());
						}
					};

					var team = user.defaultTeam();
					if (team == null) {
						Logger.error("The following error has no default team: "+user.username()+" ("+user.getId()+")");
						fail("The following error has no default team: "+user.username()+" ("+user.getId()+")");
					} else {
						var newTeamName = user.username()+"Team";
						team.setName(newTeamName);
						var teamDescription = {
							"id" : team.getId(),
							"method" : "setName",
							"value" : newTeamName
						};
						self.updateTeamObject(teamDescription, successUpdateTeamName, fail);
					}
				};

				user.toCompleteJSONObject(successCompleteUser, fail);
			} else {
				user.toCompleteJSONObject(successUserCompleteDesc, fail);
			}
		};

		var successUpdateUser = function() {
			User.read(userDescription.id, successUserRead, fail);
		};

		ModelItf.updateAttribute(User, userDescription, successUpdateUser, fail, self.socket.connectedUser.cmsAuthkey());
	}

////////////////////// End: Manage updateUser //////////////////////

////////////////////// Begin: Manage deleteUser //////////////////////

	/**
	 * Delete User from given id.
	 * Delete User in CMS.
	 * Delete oAuthKeys and defaultTeam.
	 * Send the result on the channel "AnswerDeleteUser"
	 *
	 * @method deleteUser
	 * @param {number} userId - User's Id to delete
	 */
	deleteUser(userId : number) {
		var self = this;

		var fail = function (error) {
			self.socket.emit("AnswerDeleteUser", self.formatResponse(false, error));
			Logger.error("SocketId: "+self.socket.id+" - DeleteUser failed");
		};

		var successReadUser = function (user : User) {

			var successDeleteUser = function () {
				self.socket.emit("AnswerDeleteUser", self.formatResponse(true, userId));
			};

			if(!!user.cmsId()) {
				var deleteUserUrl = BackendConfig.getCMSHost() + BackendConfig.getCMSUsersPath() + user.cmsId();

				var successDeleteCMSUser = function() {
					user.delete(successDeleteUser, fail);
				};

				RestClient.delete(deleteUserUrl, successDeleteCMSUser, fail, self.socket.connectedUser.cmsAuthkey());
			} else {
				user.delete(successDeleteUser, fail);
			}
		};

		User.read(userId, successReadUser, fail);
	}

////////////////////// End: Manage deleteUser //////////////////////

////////////////////// Begin: Manage createTeam //////////////////////

	/**
	 * Create Team from given data.
	 * Save new Team in CMS.
	 * Send the result on the channel "AnswerCreateTeam"
	 *
	 * @method createTeam
	 * @param {JSONObject} teamDescription - Team description to update
	 */
	createTeam(teamDescription : any) {
		var self = this;

		var fail = function(error) {
			self.socket.emit("AnswerCreateTeam", self.formatResponse(false, error));
			Logger.error("SocketId: " + self.socket.id + " - createTeam : send done with fail status.");
		};

		var successCompleteTeamDescription = function(teamCompleteDescription) {
			self.socket.emit("AnswerCreateTeam", self.formatResponse(true, teamCompleteDescription));
		};

		var successCreateTeam = function(team : Team) {
			team.toCompleteJSONObject(successCompleteTeamDescription, fail);
		};

		self.createTeamObject(teamDescription, successCreateTeam, fail);
	}

	/**
	 * Create Team Object from given data and return it.
	 *
	 * @method createTeamObject
	 * @param {JSONObject} teamDescription - Team description to update
	 * @param {Function} successCB - Success callback.
	 * @param {Function} failCB - Fail callback.
	 */
	createTeamObject(teamDescription : any, successCB : Function, failCB : Function) {
		var self = this;

		var fail = function(error) {
			Logger.error("SocketId: " + self.socket.id + " - createTeamObject : fail.");
			failCB(error);
		};

		var team : Team = Team.fromJSONObject(teamDescription);

		var successUpdateTeam = function() {
			successCB(team);
		};

		var successCreateTeam = function() {
			if(team.name() == "") {
				team.setName("Team" + team.getId());
			}

			team.update(successUpdateTeam, fail);
		};

		team.create(successCreateTeam, fail);
	}

////////////////////// End: Manage createTeam //////////////////////

////////////////////// Begin: Manage updateTeam //////////////////////

	/**
	 * Update Team from given data.
	 * Save new Team in CMS.
	 * Send the result on the channel "AnswerUpdateTeam"
	 *
	 * @method updateTeam
	 * @param {JSONObject} teamDescription - Team description to update
	 */
	updateTeam(teamDescription : any) {
		var self = this;

		var fail = function(error) {
			self.socket.emit("AnswerUpdateTeam", self.formatResponse(false, error));
			Logger.error("SocketId: " + self.socket.id + " - updateTeam : send done with fail status.");
		};

		var successTeamCompleteDesc = function(teamCompleteDesc) {
			self.socket.emit("AnswerUpdateTeam", self.formatResponse(true, teamCompleteDesc));
			Logger.debug("SocketId: " + self.socket.id + " - updateTeam : send done with success status.");
		};

		var successUpdateTeam = function(team : Team) {
			team.toCompleteJSONObject(successTeamCompleteDesc, fail);
		};

		self.updateTeamObject(teamDescription, successUpdateTeam, fail);
	}

	/**
	 * Update Team Object from given data and return it.
	 *
	 * @method updateTeamObject
	 * @param {JSONObject} teamDescription - Team description to update
	 * @param {Function} successCB - Success callback.
	 * @param {Function} failCB - Fail callback.
	 */
	updateTeamObject(teamDescription : any, successCB : Function, failCB : Function) {
		var self = this;

		var fail = function(error) {
			failCB(error);
			Logger.error("SocketId: " + self.socket.id + " - updateTeamObject : fail.");
		};

		var successTeamRead = function(team : Team) {
			var data = {
				"name": team.name()
			};

			if(team.cmsId() != "") {
				var successUpdateCMS = function() {
					successCB(team);
				};

				var updateTeamUrl = BackendConfig.getCMSHost() + BackendConfig.getCMSTeamsPath() + team.cmsId();
				RestClient.put(updateTeamUrl, data, successUpdateCMS, fail, self.socket.connectedUser.cmsAuthkey());
			} else {
				var successCreateCMS = function(createResponse : RestClientResponse) {
					var cmsdata = createResponse.data();
					team.setCmsId(cmsdata.id);

					var successUpdate = function() {
						successCB(team);
					};

					team.update(successUpdate, fail);
				};

				var createTeamUrl = BackendConfig.getCMSHost() + BackendConfig.getCMSTeamsPath();
				RestClient.post(createTeamUrl, data, successCreateCMS, fail, self.socket.connectedUser.cmsAuthkey());
			}
		};

		var successUpdateTeam = function() {
			Team.read(teamDescription.id, successTeamRead, fail);
		};

		ModelItf.updateAttribute(Team, teamDescription, successUpdateTeam, fail, self.socket.connectedUser.cmsAuthkey());
	}

////////////////////// End: Manage updateTeam //////////////////////

////////////////////// Begin: Manage deleteTeam //////////////////////

	/**
	 * Delete Team from given id.
	 * Delete Team in CMS.
	 * Send the result on the channel "AnswerDeleteTeam"
	 *
	 * @method deleteTeam
	 * @param {number} teamId - Team's Id to delete
	 */
	deleteTeam(teamId : number) {
		var self = this;

		var fail = function (error) {
			self.socket.emit("AnswerDeleteTeam", self.formatResponse(false, error));
			Logger.error("SocketId: "+self.socket.id+" - DeleteTeam failed");
		};

		var successReadTeam = function (team : Team) {

			var successDeleteTeam = function () {
				self.socket.emit("AnswerDeleteTeam", self.formatResponse(true, teamId));
			};

			if(!!team.cmsId()) {
				var deleteTeamUrl = BackendConfig.getCMSHost() + BackendConfig.getCMSTeamsPath() + team.cmsId();

				var successDeleteCMSTeam = function() {
					team.delete(successDeleteTeam, fail);
				};

				RestClient.delete(deleteTeamUrl, successDeleteCMSTeam, fail, self.socket.connectedUser.cmsAuthkey());
			} else {
				team.delete(successDeleteTeam, fail);
			}
		};

		Team.read(teamId, successReadTeam, fail);
	}

////////////////////// End: Manage deleteTeam //////////////////////

////////////////////// Begin: Manage RendererThemes of Renderer //////////////////////

	/**
	 * Add a new RendererTheme to a given Renderer Id.
	 * Send the result on the channel "AnswerUpdateRenderer"
	 *
	 * @method addThemeToRenderer
	 * @param {JSONObject} newThemeDescription - new RendererTheme description
	 */
	addThemeToRenderer(newThemeDescription : any) {
		// newThemeDescription : { "name": string, "id" : number }
		var self = this;

		var rendererId = newThemeDescription.id;

		var fail : Function = function(error) {
			self.socket.emit("AnswerUpdateRenderer", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - addThemeToRenderer failed ");
		};

		var successRead = function (renderer : Renderer) {

			var themeName = newThemeDescription.name;

			var newTheme : RendererTheme = new RendererTheme(themeName);

			var successCreateTheme = function() {

				var successAddRendererTheme = function() {
					self.sendObjectDescriptionFromId(Renderer, rendererId, "AnswerUpdateRenderer", false);
				};

				renderer.addRendererTheme(newTheme.getId(), successAddRendererTheme, fail);
			};

			newTheme.create(successCreateTheme, fail);
		};

		Renderer.read(rendererId, successRead, fail);
	}

	/**
	 * Remove RendererTheme from a given Renderer Id.
	 * Send the result on the channel "AnswerUpdateRenderer"
	 *
	 * @method removeThemeFromRenderer
	 * @param {JSONObject} newThemeDescription - new RendererTheme description
	 */
	removeThemeFromRenderer(themeDescription : any) {
		// themeDescription : { "themeId": number, "id" : number }
		var self = this;

		var themeId = themeDescription.themeId;
		var rendererId = themeDescription.id;

		var fail:Function = function (error) {
			self.socket.emit("AnswerUpdateRenderer", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - removeThemeFromRenderer failed ");
		};

		var successReadRT = function(rendererTheme : RendererTheme) {
			var successRead = function(renderer : Renderer) {

				var successRemoveRendererTheme = function () {

					var successDelete = function() {
						self.sendObjectDescriptionFromId(Renderer, rendererId, "AnswerUpdateRenderer", false);
					};

					rendererTheme.delete(successDelete, fail);
				};

				renderer.removeRendererTheme(rendererTheme.getId(), successRemoveRendererTheme, fail);
			};

			Renderer.read(rendererId, successRead, fail);
		};

		RendererTheme.read(themeId, successReadRT, fail)
	}

////////////////////// End: Manage RendererThemes of Renderer //////////////////////

////////////////////// Begin: Manage retrieving all teams with information on defaultTeam //////////////////////

	sendAllTeamDescription() {
		var self = this;

		var fail = function (error) {
			self.socket.emit("AllTeamDescription", self.formatResponse(false, error));
			Logger.error("SocketId: "+self.socket.id+" - sendAllTeamDescription failed");
			Logger.debug(error);
		};

		var successReadAllTeams = function (allTeams : Array<Team>) {
			var result = [];
			var nbTeam = allTeams.length;

			var successCompleteWithDefault = function (data : any) {
				result.push(data);
				nbTeam--;

				if (nbTeam == 0) {
					self.socket.emit("AllTeamDescription", self.formatResponse(true, result));
				}
			};

			allTeams.forEach(function (team : Team) {
				team.toCompleteJSONObjectWithDefaultTeam(successCompleteWithDefault, fail);
			});
		};

		Team.all(successReadAllTeams, fail);
	}

////////////////////// End: Manage retrieving all teams with information on defaultTeam //////////////////////
////////////////////// Begin: Manage creating user and her default team //////////////////////

	createUser(dataUser) {
		var self = this;

		var fail = function (error) {
			self.socket.emit("AnswerCreateUser", self.formatResponse(false, error));
			Logger.error("SocketId: "+self.socket.id+" - createUser failed");
			Logger.debug(error);
		};

		var user = User.fromJSONObject(dataUser);

		var successCreateUser = function (userData) {

			var successUpdateUser = function() {

				var successCreateTeam = function (team : Team) {

					var successLinkDefaultTeam = function () {
						var successLinkOwner = function () {
							var successAddUser = function () {
								var successCompleteJSONObject = function (data) {
									self.socket.emit("AnswerCreateUser", self.formatResponse(true, data));
								};

								user.toCompleteJSONObject(successCompleteJSONObject, fail);
							};

							team.addUser(user.getId(), successAddUser, fail);
						};

						team.linkOwner(user.getId(), successLinkOwner, fail);
					};

					user.linkDefaultTeam(team.getId(), successLinkDefaultTeam, fail);
				};

				var teamDescription = {
					"name" : user.username()+" team"
				};

				self.createTeamObject(teamDescription, successCreateTeam, fail);
			};

			if(user.username() == "") {
				user.setUsername("User" + user.getId());
			}

			if(user.email() == "") {
				user.setEmail("User" + user.getId() + "@pulsetotem.fr");
			}

			user.update(successUpdateUser, fail);
		};

		user.create(successCreateUser, fail);
	}
////////////////////// END: Manage creating user and her default team //////////////////////


	/**
	 * Return all oauthKeys of users of the team
	 * @param teamId: information on the form {"teamId": numer}
     */
	retrieveOAuthKeyDescriptionForTeam(teamIdData) {
		var self = this;
		var teamId = teamIdData.teamId;

		var fail = function (error) {
			self.socket.emit("OAuthKeyDescriptionForTeam", self.formatResponse(false, error));
			Logger.error("SocketId: "+self.socket.id+" - retrieveOAuthKeyDescriptionForTeam failed");
			Logger.debug(error);
		};

		var finalSuccess = function (oauthKeys) {
			self.socket.emit("OAuthKeyDescriptionForTeam", self.formatResponse(true, oauthKeys));
		};

		var successRead = function (team : Team) {
			var successLoadAsso = function () {
				var oAutKeys = [];
				var nbUsers = team.users().length;

				if (nbUsers == 0) {
					finalSuccess(oAutKeys);
				} else {
					var successLoadOAuth = function () {
						nbUsers--;

						if (nbUsers == 0) {
							var nbOAuth = 0;

							for (var i = 0; i < team.users().length; i++) {
								nbOAuth += team.users()[i].oauthkeys().length;
							}

							var successCompleteJSON = function (oauthData) {
								nbOAuth--;
								oAutKeys.push(oauthData);

								if (nbOAuth == 0) {
									finalSuccess(oAutKeys);
								}
							};

							team.users().forEach(function (user : User) {
								user.oauthkeys().forEach(function (oauth : OAuthKey) {
									oauth.toCompleteJSONObject(successCompleteJSON, fail);
								});
							});
						}
					};

					team.users().forEach(function (user : User) {
						user.loadOAuthKeys(successLoadOAuth, fail);
					});
				}
			};

			team.loadAssociations(successLoadAsso, fail);
		};

		Team.read(teamId, successRead, fail);
	}

	/**
	 * Clone a relativeEvent and its call. Change position of the relativeEvent (+1 from original position). Link the newly created relativeEvent to the relativeTimeline
	 *
	 * @param eventAndTlData: id of the relativeEvent to clone and the relativeTimeline to link with. (e.g. : {'relativeEventId': 12, 'timelineId' : 15})
     */
	cloneRelativeEventAndLinkTimeline(eventAndTlData : any) {
		var self = this;

		var relativeEventId = eventAndTlData.relativeEventId;
		var timelineId = eventAndTlData.timelineId;

		var fail = function (error) {
			self.socket.emit("AnswerCloneRelativeEventAndLinkTimeline", self.formatResponse(false, error));
			Logger.error("SocketId: "+self.socket.id+" - cloneRelativeEventAndLinkTimeline failed");
			Logger.debug(error);
		};

		var successReadRelativeEvent = function (relativeEvent : RelativeEvent) {
			var successCloneRelativeEvent = function (clonedRelativeEvent : RelativeEvent) {
				var successUpdateRelativeEvent = function () {
					var successReadRelativeTimeline = function (relativeTimeline : RelativeTimeline) {
						var successLinkRelativeEvent = function () {
							self.socket.emit("AnswerCloneRelativeEventAndLinkTimeline", self.formatResponse(true,{"cloneId": clonedRelativeEvent.getId()}));
						};

						relativeTimeline.addRelativeEvent(clonedRelativeEvent.getId(), successLinkRelativeEvent, fail);
					};

					RelativeTimeline.read(timelineId, successReadRelativeTimeline, fail);
				};

				var position = clonedRelativeEvent.position();
				clonedRelativeEvent.setPosition(position+1);

				var name = clonedRelativeEvent.name();
				clonedRelativeEvent.setName(name+" clone");
				clonedRelativeEvent.update(successUpdateRelativeEvent, fail);
			};

			relativeEvent.clone(successCloneRelativeEvent, fail, null);
		};

		RelativeEvent.read(relativeEventId, successReadRelativeEvent, fail);
	}
}