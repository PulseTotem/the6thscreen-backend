/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="./ShareNamespaceManager.ts" />

class AdminsNamespaceManager extends ShareNamespaceManager {

	private paramTypeLength : number;

    /**
     * Constructor.
     *
     * @constructor
     * @param {any} socket - The socket.
     */
    constructor(socket : any) {
        super(socket);

        var self = this;

        //Authentication
        this.addListenerToSocket('RetrieveUserDescriptionFromToken', function(tokenDescription) { self.sendUserDescriptionFromToken(tokenDescription); });
	    this.addListenerToSocket('RetrieveUserDescription', function(description) { self.sendUserDescription(description); });
	    this.addListenerToSocket('RetrieveSDIDescription', function(description) { self.sendSDIDescription(description); });
	    this.addListenerToSocket('RetrieveSourceDescription', function(description) { self.sendSourceDescription(description); });
	    this.addListenerToSocket('RetrieveSourceDescriptionOnlyId', function(description) { self.sendSourceDescription(description, true); });
	    this.addListenerToSocket('RetrieveCallTypeDescription', function(description) { self.sendCallTypeDescription(description); });
	    this.addListenerToSocket('RetrieveCallTypeDescriptionOnlyId', function(description) { self.sendCallTypeDescription(description, true); });
	    this.addListenerToSocket('RetrieveServiceDescription', function(description) { self.sendServiceDescription(description); });
	    this.addListenerToSocket('RetrieveServiceDescriptionOnlyId', function(description) { self.sendServiceDescription(description, true); });
	    this.addListenerToSocket('RetrieveZoneDescription', function(description) { self.sendZoneDescription(description); });
		this.addListenerToSocket('RetrieveOAuthKeyDescription', function(description) { self.sendOAuthKeyDescription(description); });
	    this.addListenerToSocket('RetrieveAllSourceDescription', function() { self.sendAllObjectDescription(Source, "AllSourceDescription"); });
	    this.addListenerToSocket('RetrieveAllZoneDescription', function() { self.sendAllObjectDescription(Zone, "AllZoneDescription"); });
	    this.addListenerToSocket('RetrieveAllRendererDescription', function() { self.sendAllObjectDescription(Renderer, "AllRendererDescription"); });
	    this.addListenerToSocket('RetrieveAllCallTypeDescription', function() { self.sendAllObjectDescription(CallType, "AllCallTypeDescription"); });
	    this.addListenerToSocket('RetrieveAllInfoTypeDescription', function() { self.sendAllObjectDescription(InfoType, "AllInfoTypeDescription"); });
	    this.addListenerToSocket('RetrieveAllParamTypeDescription', function() { self.sendAllObjectDescription(ParamType, "AllParamTypeDescription"); });
	    this.addListenerToSocket('RetrieveAllServiceDescription', function() { self.sendAllObjectDescription(Service, "AllServiceDescription"); });
	    this.addListenerToSocket('CreateSourceDescription', function(data) { self.createObject(Source, data, "SourceDescription"); });
	    this.addListenerToSocket('UpdateSourceDescription', function(data) { self.updateObjectAttribute(Source, data, "SourceDescription"); });
	    this.addListenerToSocket('DeleteSource', function(idSource) { self.deleteSource(idSource); });
	    this.addListenerToSocket('CreateCallTypeDescription', function(data) { self.createObject(CallType, data, "CallTypeDescription"); });
	    this.addListenerToSocket('UpdateCallTypeDescription', function(data) { self.updateObjectAttribute(CallType, data, "CallTypeDescription"); });
	    this.addListenerToSocket('DeleteCallType', function(idCallType) { self.deleteCallType(idCallType); });
	    this.addListenerToSocket('CreateServiceDescription', function(data) { self.createObject(Service, data, "ServiceDescription"); });
	    this.addListenerToSocket('UpdateServiceDescription', function(data) { self.updateObjectAttribute(Service, data, "ServiceDescription"); });
	    this.addListenerToSocket('DeleteService', function(idService) { self.deleteService(idService); });
		this.addListenerToSocket('CreateOAuthKeyDescription', function(data) { self.createOAuthKey(data); });
		this.addListenerToSocket('DeleteOAuthKey', function(idOAuthKey) { self.deleteOAuthKey(idOAuthKey); });
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

////////////////////// Begin: Manage SendUserDescription //////////////////////

	/**
	 * Retrieve User instance description and send it to client.
	 *
	 * @method sendUserDescription
	 * @param {any} userDescription - The User Description.
	 */
	sendUserDescription(userDescription : any) {
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
	 */
	sendSDIDescription(sdiDescription : any) {
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
	 * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
	 */
	sendZoneDescription(zoneDescription : any, self : AdminsNamespaceManager = null) {
		// zoneDescription : {"zoneId" : string}
		var self = this;

		var zoneId = zoneDescription.zoneId;

        self.sendObjectDescriptionFromId(Zone, zoneId, "ZoneDescription");
	}

////////////////////// End: Manage SendZoneDescription //////////////////////

////////////////////// Begin: Manage SendOAuthKeyDescription //////////////////////

	/**
	 * Retrieve OAuthKey instance description and send it to client.
	 *
	 * @method sendOAuthKeyDescription
	 * @param {any} oauthKeyDescription - The Zone Description.
	 * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
	 */
	sendOAuthKeyDescription(oauthKeyDescription : any, self : AdminsNamespaceManager = null) {
		// oauthKeyDescription : {"oauthKeyId" : string}
		var self = this;

		var oauthKeyId = oauthKeyDescription.oauthKeyId;

		self.sendObjectDescriptionFromId(OAuthKey, oauthKeyId, "OAuthKeyDescription_" + oauthKeyId);
	}

////////////////////// End: Manage SendOAuthKeyDescription //////////////////////

////////////////////// Begin: Manage SendSourceDescription //////////////////////

	/**
	 * Retrieve Source instance description and send it to client.
	 *
	 * @method SendSourceDescription
	 * @param {any} sourceDescription - The SDI Description.
	 */
	sendSourceDescription(sourceDescription : any, onlyId : boolean = false) {
		// sourceDescription : {"sourceId" : string}
		var self = this;

		var sourceId = sourceDescription.sourceId;

		self.sendObjectDescriptionFromId(Source, sourceId, "SourceDescription", onlyId);
	}

////////////////////// End: Manage SendSourceDescription //////////////////////

////////////////////// Begin: Manage SendCallTypeDescription //////////////////////

	/**
	 * Retrieve CallType instance description and send it to client.
	 *
	 * @method SendCallTypeDescription
	 * @param {any} callTypeDescription - The callType Description.
	 */
	sendCallTypeDescription(callTypeDescription : any, onlyId : boolean = false) {
		// callTypeDescription : {"callTypeId" : string}
		var self = this;

		var callTypeId = callTypeDescription.callTypeId;

		self.sendObjectDescriptionFromId(CallType, callTypeId, "CallTypeDescription", onlyId);
	}

////////////////////// End: Manage SendCallTypeDescription //////////////////////

////////////////////// Begin: Manage SendServiceDescription //////////////////////

	/**
	 * Retrieve Service instance description and send it to client.
	 *
	 * @method sendServiceDescription
	 * @param {any} callTypeDescription - The callType Description.
	 */
	sendServiceDescription(serviceDescription : any, onlyId : boolean = false) {
		// serviceDescription : {"serviceId" : string}
		var self = this;

		var serviceId = serviceDescription.serviceId;

		self.sendObjectDescriptionFromId(Service, serviceId, "ServiceDescription", onlyId);
	}

////////////////////// End: Manage SendServiceDescription //////////////////////


////////////////////// Begin: Manage DeleteSource //////////////////////

	/**
	 * Delete a source of the given id.
	 *
	 * @method deleteSource
	 * @param {any} sourceDescription - The information containing ID of the source to delete.
	 * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
	 */
	deleteSource(sourceDescription : any, self : AdminsNamespaceManager = null) {
		// sourceId : {"sourceId" : string}
		var self = this;

		var sourceId = sourceDescription.sourceId;

		self.deleteObject(Source, sourceId, "deletedSource");
	}

////////////////////// End: Manage DeleteSource //////////////////////

////////////////////// Begin: Manage deleteCallType //////////////////////

	/**
	 * Delete a callType of the given id.
	 *
	 * @method deleteCallType
	 * @param {any} callTypeDescription - The information containing ID of the callType to delete.
	 * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
	 */
	deleteCallType(callTypeDescription : any, self : AdminsNamespaceManager = null) {
		// callTypeId : {"callTypeId" : string}
		var self = this;

		var callTypeId = callTypeDescription.callTypeId;

		self.deleteObject(CallType, callTypeId, "deletedCallType");
	}

////////////////////// End: Manage deleteCallType //////////////////////

////////////////////// Begin: Manage deleteService //////////////////////

	/**
	 * Delete a Service of the given id.
	 *
	 * @method deleteService
	 * @param {any} serviceDescription - The information containing ID of the service to delete.
	 * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
	 */
	deleteService(serviceDescription : any, self : AdminsNamespaceManager = null) {
		// serviceId : {"serviceId" : string}
		var self = this;

		var serviceId = serviceDescription.serviceId;

		self.deleteObject(Service, serviceId, "deletedService");
	}

////////////////////// End: Manage deleteService //////////////////////

////////////////////// Begin: Manage OAuthKey - create and delete //////////////////////

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

	/**
	 * Delete an OAuthKey of the given id.
	 *
	 * @method deleteOAuthKey
	 * @param {any} oauthKeyDescription - The information containing ID of the OAuthKey to delete.
	 * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
	 */
	deleteOAuthKey(oauthKeyDescription : any, self : AdminsNamespaceManager = null) {
		// oauthKeyDescription : {"oauthKeyId" : string}
		var self = this;

		var oauthKeyId = oauthKeyDescription.oauthKeyId;

		self.deleteObject(OAuthKey, oauthKeyId, "deletedOAuthKey");
	}

////////////////////// End: Manage OAuthKey - create and delete //////////////////////


}