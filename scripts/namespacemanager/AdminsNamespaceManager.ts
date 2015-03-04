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
	    this.addListenerToSocket('RetrieveAllSDIs', function(userDescription) { self.sendAllSDIDescription(userDescription); });
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

////////////////////// End: Manage SendProfilDescription //////////////////////

	////////////////////// Begin: Manage sendAllSDIDescription //////////////////////

	/**
	 * Retrieve all SDI instances description from user ID and send it to client.
	 *
	 * @method sendAllSDIDescription
	 * @param {any} userDescription - The userID
	 * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
	 */
	sendAllSDIDescription(userDescription : any, self : AdminsNamespaceManager = null) {
		// userDescription : {"userID" : string}
		if(self == null) {
			self = this;
		}

		Logger.debug("SocketId: " + self.socket.id + " - sendAllSDIDescription");

		var userId = userDescription.userID;

		Logger.debug("SocketId: " + self.socket.id + " - sendAllSDIDescription : userId " + userId.toString());

		Logger.debug("SocketId: " + self.socket.id + " - sendAllSDIDescription : retrieveSDI");
		User.read(parseInt(userId), function(user) { self.retrieveAllSDISuccess(user); }, function(error) { self.retrieveAllSDIFail(error, userId); });
	}

	/**
	 * Retrieve All SDI instance success, so send it to client.
	 *
	 * @method retrieveSDISuccess
	 * @param {User} user - The User who owns SDI.
	 */
	retrieveAllSDISuccess(user : User) {
		var self = this;

		var success : Function = function(completeJSONObject) {
			Logger.debug("SocketId: " + self.socket.id + " - sendAllSDIDescription : completeJSON done.");

			self.socket.emit("listSDI", completeJSONObject);

			Logger.debug("SocketId: " + self.socket.id + " - sendAllSDIDescription : send done.");
		};

		var fail : Function = function(error) {
			Logger.debug("SocketId: " + self.socket.id + " - sendAllSDIDescription : completeJSON fail.");
			Logger.error(JSON.stringify(error));
			//self.socket.emit("SDIDescriptionError", ???);
		};

		user.toCompleteJSONObject(success, fail);
	}

	/**
	 * Retrieve SDI instance fail, so retry or send an error.
	 *
	 * @method retrieveAllSDIFail
	 * @param {Error} error - The Error reason of fail.
	 * @param {number} userId - The User Id.
	 * @param {number} attemptNumber - The attempt number.
	 */
	retrieveAllSDIFail(error : Error, sdiId : number, attemptNumber : number = 0) {
		if(attemptNumber >= 3) {
			Logger.debug("SocketId: " + this.socket.id + " - sendAllSDIDescription : error");
			Logger.error(JSON.stringify(error));
			//self.socket.emit("SDIDescriptionError", ???);
		} else {
			Logger.debug("SocketId: " + this.socket.id + " - sendAllSDIDescription : attemptNumber " + attemptNumber);
			User.read(sdiId, this.retrieveAllSDISuccess, this.retrieveAllSDIFail, attemptNumber+1);
		}
	}

////////////////////// End: Manage SendSDIDescription //////////////////////
}