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
        this.addListenerToSocket('RetrieveUserDescriptionFromToken', function(tokenDescription) { self.sendUserDescriptionFromToken(tokenDescription); });
	    this.addListenerToSocket('RetrieveUserDescription', function(description) { self.sendUserDescription(description); });
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

        self.socket.emit("UserDescriptionFromToken", user.toJSONObject());
    }

    /**
     * Retrieve User From Token instance fail, so send an error.
     *
     * @method retrieveUserFromTokenFail
     * @param {Error} error - The Error reason of fail.
     * @param {string} token - The User Token.
     */
    retrieveUserFromTokenFail(error : Error, token : string) {
        Logger.debug("SocketId: " + this.socket.id + " - sendUserDescriptionFromToken : error");
        Logger.error(JSON.stringify(error));
        //self.socket.emit("UserDescriptionError", ???);
    }

    ////////////////////// End: Manage SendUserDescriptionFromToken //////////////////////

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