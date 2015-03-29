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
	    this.addListenerToSocket('RetrieveZoneDescription', function(description) { self.sendZoneDescription(description); });
	    this.addListenerToSocket('RetrieveAllSourceDescription', function() { self.sendAllObjectDescription(Source, "AllSourceDescription"); });
	    this.addListenerToSocket('RetrieveAllCallTypeDescription', function() { self.sendAllObjectDescription(CallType, "AllCallTypeDescription"); });
	    this.addListenerToSocket('RetrieveAllInfoTypeDescription', function() { self.sendAllObjectDescription(InfoType, "AllInfoTypeDescription"); });
	    this.addListenerToSocket('RetrieveAllParamTypeDescription', function() { self.sendAllObjectDescription(ParamType, "AllParamTypeDescription"); });
	    this.addListenerToSocket('RetrieveAllServiceDescription', function() { self.sendAllObjectDescription(Service, "AllServiceDescription"); });
	    this.addListenerToSocket('CreateSourceDescription', function(data) { self.createObject(Source, data, "SourceDescription"); });
	    this.addListenerToSocket('UpdateSourceDescription', function(data) { self.updateObjectAttribute(Source, data, "SourceDescription"); });
	    this.addListenerToSocket('DeleteSource', function(idSource) { self.deleteSource(idSource); });
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

        self.socket.emit("UserDescriptionFromToken", self.formatResponse(true, user.toJSONObject()));
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

////////////////////// End: Manage SendSDIDescription //////////////////////

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

////////////////////// End: Manage SendZoneDescription //////////////////////


}