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
	    this.addListenerToSocket('RetrieveZoneDescription', function(description) { self.sendZoneDescription(description); });
	    this.addListenerToSocket('RetrieveAllSourceDescription', function() { self.sendAllSourceDescription(); });
	    this.addListenerToSocket('RetrieveAllInfoTypeDescription', function() { self.sendAllInfoTypeDescription(); });
	    this.addListenerToSocket('RetrieveAllParamTypeDescription', function() { self.sendAllParamTypeDescription(); });
	    this.addListenerToSocket('CreateSourceDescription', function(data) { self.sendCreateSourceDescription(data); });
	    this.addListenerToSocket('UpdateSourceDescription', function(data) { self.sendUpdateSourceDescription(data); });
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

////////////////////// Begin: Manage SendAllSourceDescription //////////////////////

	/**
	 * Retrieve all Source instances description and send it to client.
	 *
	 * @method sendAllSourceDescription
	 */
	sendAllSourceDescription() {
		var self = this;

		Logger.debug("SocketId: " + self.socket.id + " - sendAllSourceDescription : retrieveAllSource");

        self.sendAllObjectDescription(Source, "AllSourceDescription");
	}

////////////////////// End: Manage SendAllSourceDescription //////////////////////

////////////////////// Begin: Manage SendAllInfoTypeDescription //////////////////////

	/**
	 * Retrieve all InfoType instances description and send it to client.
	 *
	 * @method sendAllInfoTypeDescription
	 * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
	 */
	sendAllInfoTypeDescription(self : AdminsNamespaceManager = null) {
		var self = this;

        Logger.debug("SocketId: " + self.socket.id + " - sendAllInfoTypeDescription : retrieveAllInfoType");

        self.sendAllObjectDescription(InfoType, "AllInfoTypeDescription");
	}

////////////////////// End: Manage SendAllInfoTypeDescription //////////////////////

////////////////////// Begin: Manage SendAllParamTypeDescription //////////////////////

	/**
	 * Retrieve all ParamType instances description and send it to client.
	 *
	 * @method sendAllParamTypeDescription
	 * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
	 */
	sendAllParamTypeDescription(self : AdminsNamespaceManager = null) {
		var self = this;

        Logger.debug("SocketId: " + self.socket.id + " - sendAllParamTypeDescription : retrieveAllParamType");

        self.sendAllObjectDescription(ParamType, "AllParamTypeDescription");
	}

////////////////////// End: Manage sendAllParamTypeDescription //////////////////////

////////////////////// Begin: Manage saveSourceDescription //////////////////////

	sendCreateSourceDescription(sourceInfo : any) {
		var self = this;

		Logger.debug("SocketId: " + self.socket.id + " - sendCreateSourceDescription");
		self.createObject(Source, sourceInfo, "SourceDescription");
	}

	sendUpdateSourceDescription(updateInfo : any) {
		var self = this;

		Logger.debug("SocketId: " + self.socket.id + " - sendUpdateSourceDescription");
		self.updateObjectAttribute(Source, updateInfo, "SourceDescription");
	}

////////////////////// End: Manage saveSourceDescription //////////////////////

}