/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/server/NamespaceManager.ts" />

class AdminsNamespaceManager extends NamespaceManager {

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
        this.addListenerToSocket('SignIn', function(userDescription) { self.checkUserAuthentication(userDescription); });
	    this.addListenerToSocket('RetrieveUserDescription', function(description) { self.sendUserDescription(description); });
	    this.addListenerToSocket('RetrieveSDIDescription', function(description) { self.sendSDIDescription(description); });
	    this.addListenerToSocket('RetrieveZoneDescription', function(description) { self.sendZoneDescription(description); });

    }

    ////////////////////// Begin: Manage SendProfilDescription //////////////////////

    /**
     * Check User authentication and send authentication token to Customizer.
     *
     * @method checkUserAuthentication
     * @param {any} userDescription - The User Description.
     * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
     */
    checkUserAuthentication(userDescription : any, self : AdminsNamespaceManager = null) {
        // userDescription : ???
        //TODO
        if(self == null) {
            self = this;
        }
        Logger.debug("SocketId: " + self.socket.id + " - checkUserAuthentication");

        self.socket.emit("SingInStatus", {"SingInStatus" : "OK!"});

        //TODO

        /*var profilId = profilDescription.profilId;

        Logger.debug("SocketId: " + self.socket.id + " - sendProfilDescription : profilId " + profilId.toString());

        Logger.debug("SocketId: " + self.socket.id + " - sendProfilDescription : retrieveProfil");

        Profil.read(parseInt(profilId), function(profil) { self.retrieveProfilSuccess(profil); }, function(error) { self.retrieveProfilFail(error, profilId); });*/
    }

    /**
     * Retrieve Profil instance success, so send it to client.
     *
     * @method retrieveProfilSuccess
     * @param {Profil} profil - The Profil Description.
     */
    checkUserAuthenticationSuccess(profil : Profil) {
        /*var self = this;

        var success : Function = function(completeJSONObject) {
            Logger.debug("SocketId: " + self.socket.id + " - sendProfilDescription : completeJSON done.");

            self.socket.emit("ProfilDescription", completeJSONObject);

            Logger.debug("SocketId: " + self.socket.id + " - sendProfilDescription : send done.");
        };

        var fail : Function = function(error) {
            Logger.debug("SocketId: " + self.socket.id + " - sendProfilDescription : completeJSON fail.");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("ProfilDescriptionError", ???);
        };

        profil.toCompleteJSONObject(success, fail);
        */
    }

    /**
     * Retrieve Profil instance fail, so retry or send an error.
     *
     * @method retrieveProfilFail
     * @param {Error} error - The Error reason of fail.
     * @param {number} profilId - The Profil Id.
     * @param {number} attemptNumber - The attempt number.
     */
    checkUserAuthenticationFail(error : Error, profilId : number, attemptNumber : number = 0) {
        /*if(attemptNumber >= 3) {
            Logger.debug("SocketId: " + this.socket.id + " - sendProfilDescription : error");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("ProfilDescriptionError", ???);
        } else {
            Logger.debug("SocketId: " + this.socket.id + " - sendProfilDescription : attemptNumber " + attemptNumber);
            Profil.read(profilId, this.retrieveProfilSuccess, this.retrieveProfilFail, attemptNumber+1);
        }*/
    }

	/**
	 * Retrieve User instance description and send it to client.
	 *
	 * @method sendUserDescription
	 * @param {any} userDescription - The User Description.
	 * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
	 */
	sendUserDescription(userDescription : any, self : AdminsNamespaceManager = null) {
		// userDescription : {"userId" : string}
		if(self == null) {
			self = this;
		}
		Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription");

		var userId = userDescription.userId;

		Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription : userId " + userId.toString());

		Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription : retrieveUser");
		User.read(parseInt(userId), function(user) { self.retrieveUserSuccess(user); }, function(error) { self.retrieveUserFail(error, userId); });
	}

	/**
	 * Retrieve User instance success, so send it to client.
	 *
	 * @method retrieveUserSuccess
	 * @param {User} user - The User Description.
	 * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
	 */
	retrieveUserSuccess(user : User, self : AdminsNamespaceManager = null) {
		var self = this;

		var success : Function = function(completeJSONObject) {
			Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription : completeJSON done.");

			self.socket.emit("UserDescription", completeJSONObject);

			Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription : send done.");
		};

		var fail : Function = function(error) {
			Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription : completeJSON fail.");
			Logger.error(JSON.stringify(error));
			//self.socket.emit("UserDescriptionError", ???);
		};

		user.toCompleteJSONObject(success, fail);
	}

	/**
	 * Retrieve User instance fail, so retry or send an error.
	 *
	 * @method retrieveUserFail
	 * @param {Error} error - The Error reason of fail.
	 * @param {number} userId - The User Id.
	 * @param {number} attemptNumber - The attempt number.
	 */
	retrieveUserFail(error : Error, userId : number, attemptNumber : number = 0) {
		if(attemptNumber >= 3) {
			Logger.debug("SocketId: " + this.socket.id + " - sendUserDescription : error");
			Logger.error(JSON.stringify(error));
			//self.socket.emit("UserDescriptionError", ???);
		} else {
			Logger.debug("SocketId: " + this.socket.id + " - sendUserDescription : attemptNumber " + attemptNumber);
			User.read(userId, this.retrieveUserSuccess, this.retrieveUserFail, attemptNumber+1);
		}
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
	sendSDIDescription(sdiDescription : any, self : AdminsNamespaceManager = null) {
		// sdiDescription : {"sdiId" : string}
		if(self == null) {
			self = this;
		}

		Logger.debug("SocketId: " + self.socket.id + " - sendSDIDescription");

		var sdiId = sdiDescription.sdiId;

		Logger.debug("SocketId: " + self.socket.id + " - sendSDIDescription : sdiId " + sdiId.toString());

		Logger.debug("SocketId: " + self.socket.id + " - sendSDIDescription : retrieveSDI");
		SDI.read(parseInt(sdiId), function(sdi) { self.retrieveSDISuccess(sdi); }, function(error) { self.retrieveSDIFail(error, sdiId); });
	}

	/**
	 * Retrieve SDI instance success, so send it to client.
	 *
	 * @method retrieveSDISuccess
	 * @param {SDI} sdi - The SDI Description.
	 */
	retrieveSDISuccess(sdi : SDI) {
		var self = this;

		var success : Function = function(completeJSONObject) {
			Logger.debug("SocketId: " + self.socket.id + " - sendSDIDescription : completeJSON done.");

			self.socket.emit("SDIDescription", completeJSONObject);

			Logger.debug("SocketId: " + self.socket.id + " - sendSDIDescription : send done.");
		};

		var fail : Function = function(error) {
			Logger.debug("SocketId: " + self.socket.id + " - sendSDIDescription : completeJSON fail.");
			Logger.error(JSON.stringify(error));
			//self.socket.emit("SDIDescriptionError", ???);
		};

		sdi.toCompleteJSONObject(success, fail);
	}

	/**
	 * Retrieve SDI instance fail, so retry or send an error.
	 *
	 * @method retrieveSDIFail
	 * @param {Error} error - The Error reason of fail.
	 * @param {number} sdiId - The SDI Id.
	 * @param {number} attemptNumber - The attempt number.
	 */
	retrieveSDIFail(error : Error, sdiId : number, attemptNumber : number = 0) {
		if(attemptNumber >= 3) {
			Logger.debug("SocketId: " + this.socket.id + " - sendSDIDescription : error");
			Logger.error(JSON.stringify(error));
			//self.socket.emit("SDIDescriptionError", ???);
		} else {
			Logger.debug("SocketId: " + this.socket.id + " - sendSDIDescription : attemptNumber " + attemptNumber);
			SDI.read(sdiId, this.retrieveSDISuccess, this.retrieveSDIFail, attemptNumber+1);
		}
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
	sendZoneDescription(zoneDescription : any, self : AdminsNamespaceManager = null) {
		// zoneDescription : {"zoneId" : string}
		if(self == null) {
			self = this;
		}

		Logger.debug("SocketId: " + self.socket.id + " - sendZoneDescription");

		var zoneId = zoneDescription.zoneId;

		Logger.debug("SocketId: " + self.socket.id + " - sendZoneDescription : zoneId " + zoneId.toString());

		Logger.debug("SocketId: " + self.socket.id + " - sendZoneDescription : retrieveZone");

		Zone.read(parseInt(zoneId), function(zone) { self.retrieveZoneSuccess(zone); }, function(error) { self.retrieveZoneFail(error, zoneId); });
	}

	/**
	 * Retrieve Zone instance success, so send it to client.
	 *
	 * @method retrieveZoneSuccess
	 * @param {Zone} zone - The Zone Description.
	 */
	retrieveZoneSuccess(zone : Zone) {
		var self = this;

		var success : Function = function(completeJSONObject) {
			Logger.debug("SocketId: " + self.socket.id + " - sendZoneDescription : completeJSON done.");

			self.socket.emit("ZoneDescription", completeJSONObject);

			Logger.debug("SocketId: " + self.socket.id + " - sendZoneDescription : send done.");
		};

		var fail : Function = function(error) {
			Logger.debug("SocketId: " + self.socket.id + " - sendZoneDescription : completeJSON fail.");
			Logger.error(JSON.stringify(error));
			//self.socket.emit("ZoneDescriptionError", ???);
		};

		zone.toCompleteJSONObject(success, fail);
	}

	/**
	 * Retrieve Zone instance fail, so retry or send an error.
	 *
	 * @method retrieveZoneFail
	 * @param {Error} error - The Error reason of fail.
	 * @param {number} zoneId - The Zone Id.
	 * @param {number} attemptNumber - The attempt number.
	 */
	retrieveZoneFail(error : Error, zoneId : number, attemptNumber : number = 0) {
		if(attemptNumber >= 3) {
			Logger.debug("SocketId: " + this.socket.id + " - sendZoneDescription : error");
			Logger.error(JSON.stringify(error));
			//self.socket.emit("ZoneDescriptionError", ???);
		} else {
			Logger.debug("SocketId: " + this.socket.id + " - sendZoneDescription : attemptNumber " + attemptNumber);
			Zone.read(zoneId, this.retrieveZoneSuccess, this.retrieveZoneFail, attemptNumber+1);
		}
	}

////////////////////// End: Manage SendZoneDescription //////////////////////

}