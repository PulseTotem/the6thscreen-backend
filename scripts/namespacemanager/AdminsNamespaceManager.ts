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
}