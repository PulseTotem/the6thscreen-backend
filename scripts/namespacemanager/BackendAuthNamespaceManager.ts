/**
 * @author Simon Urli <simon@pulsetotem.fr>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="./ShareNamespaceManager.ts" />
/// <reference path="../model/User.ts" />
/// <reference path="../model/Token.ts" />

class BackendAuthNamespaceManager extends ShareNamespaceManager {

    /**
     * Constructor.
     *
     * @constructor
     * @param {any} socket - The socket.
     */
    constructor(socket : any) {
        super(socket);
        var self = this;

        this.addListenerToSocket('RetrieveUserDescriptionFromToken', function(tokenDescription) { self.sendUserDescriptionFromToken(tokenDescription); });
    }

    ////////////////////// Begin: Manage SendUserDescriptionFromToken //////////////////////

    /**
     * Retrieve User instance description from token and send it to client.
     *
     * @method sendUserDescriptionFromToken
     * @param {any} tokenDescription - The Token Description.
     * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
     */
    sendUserDescriptionFromToken(tokenDescription : any, self : BackendAuthNamespaceManager = null) {
        // tokenDescription : {"token" : string}
        if(self == null) {
            self = this;
        }
        Logger.debug("SocketId: " + self.socket.id + " - sendUserDescriptionFromToken");

        var token = tokenDescription.token;

        Logger.debug("SocketId: " + self.socket.id + " - sendUserDescriptionFromToken : token " + token);

        Logger.debug("SocketId: " + self.socket.id + " - sendUserDescriptionFromToken : retrieveUser");

        var failRetrieveToken = function (error) {
            self.retrieveUserFromTokenFail(error, token);
        };

        var successRetrieveToken = function (token : Token) {

            var successLoadUser = function () {
                self.retrieveUserFromTokenSuccess(token.user(), self);
            };

            token.loadUser(successLoadUser, failRetrieveToken);
        };

        Token.findOneByValue(token, successRetrieveToken, failRetrieveToken);
    }

    /**
     * Retrieve User From Token instance success, so send it to client.
     *
     * @method retrieveUserFromTokenSuccess
     * @param {User} user - The User Description.
     * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
     */
    retrieveUserFromTokenSuccess(user : User, self : BackendAuthNamespaceManager = null) {
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
}