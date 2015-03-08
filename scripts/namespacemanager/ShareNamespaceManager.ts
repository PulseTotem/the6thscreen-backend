/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/server/NamespaceManager.ts" />

class ShareNamespaceManager extends NamespaceManager {

    /**
     * Constructor.
     *
     * @constructor
     * @param {any} socket - The socket.
     */
    constructor(socket : any) {
        super(socket);
    }

    /**
     * Format response before emit to SocketIo Socket.
     *
     * @method formatResponse
     * @param {boolean} successStatus - The success status.
     * @param {any} response - The response
     */
    formatResponse(successStatus : boolean, response : any) {
        return {
            "success" : successStatus,
            "response" : response
        };
    }

////////////////////// Begin: Manage sendObjectDescriptionFromId //////////////////////

    /**
     * Retrieve Model instance description and send it to client.
     *
     * @method sendObjectDescriptionFromId
     * @param {ModelItf Class} modelClass - The model.
     * @param {number} objectId - The Object's Id to retrieve.
     * @param {string} responseChannel - The channel to send response
     */
    sendObjectDescriptionFromId(modelClass : any, objectId : number, responseChannel : string) {
        var self = this;

        Logger.debug("SocketId: " + self.socket.id + " - sendModelDescription - ModelTableName : " + modelClass.getTableName() + " - query ObjectId : " + objectId.toString());

        modelClass.read(objectId, function(obj) { self.retrieveObjectSuccess(obj, responseChannel); }, function(error) { self.retrieveObjectFail(error, responseChannel); });
    }

    /**
     * Retrieve Object instance success, so send it to client.
     *
     * @method retrieveObjectSuccess
     * @param {ModelItf} object - The Object Description.
     * @param {string} responseChannel - The channel to send response
     */
    retrieveObjectSuccess(object : ModelItf, responseChannel : string) {
        var self = this;

        var success : Function = function(completeJSONObject) {
            self.socket.emit(responseChannel, self.formatResponse(true, completeJSONObject));

            Logger.debug("SocketId: " + self.socket.id + " - sendModelDescription : send done with success status for Object with Id : " + object.getId());
        };

        var fail : Function = function(error) {
            self.socket.emit(responseChannel, self.formatResponse(false, error));
            Logger.debug("SocketId: " + self.socket.id + " - sendModelDescription : send done with fail status for Object with Id : " + object.getId() + " - Fail during completeJsonObject.");
        };

        object.toCompleteJSONObject(success, fail);
    }

    /**
     * Retrieve Object instance fail, send an error.
     *
     * @method retrieveObjectFail
     * @param {Error} error - The Error reason of fail.
     * @param {string} responseChannel - The channel to send response
     */
    retrieveObjectFail(error : Error, responseChannel : string) {
        var self = this;

        self.socket.emit(responseChannel, self.formatResponse(false, error));
        Logger.debug("SocketId: " + self.socket.id + " - sendModelDescription : send done with fail status - Fail during read.");
    }

////////////////////// End: Manage sendObjectDescriptionFromId //////////////////////

////////////////////// Begin: Manage sendAllObjectDescription //////////////////////

    /**
     * Retrieve all Object instances description and send it to client.
     *
     * @method sendAllObjectDescription
     * @param {ModelItf Class} modelClass - The model.
     * @param {string} responseChannel - The channel to send response
     */
    sendAllObjectDescription(modelClass : any, responseChannel : string) {
        var self = this;

        Logger.debug("SocketId: " + self.socket.id + " - SendAllObjectDescription : retrieveAllObject of Model with TableName: " + modelClass.getTableName());

        modelClass.all(function (arrayModelItf) { self.retrieveAllObjectSuccess(arrayModelItf, responseChannel); }, function (error) { self.retrieveAllObjectFail(error, responseChannel); });
    }

    /**
     * Retrieve all Objects success, so send it to client.
     *
     * @method retrieveAllObjectSuccess
     * @param {Array} objects - The Objects Description.
     * @param {string} responseChannel - The channel to send response
     */
    retrieveAllObjectSuccess(objects : Array<ModelItf>, responseChannel : string) {
        var self = this;

        var success : Function = function(completeJSONObject) {
            Logger.debug("SocketId: " + self.socket.id + " - sendAllObjectDescription : send done with success status");
            self.socket.emit(responseChannel, self.formatResponse(true, completeJSONObject));
        };

        var fail : Function = function(error) {
            self.socket.emit(responseChannel, self.formatResponse(false, error));
            Logger.debug("SocketId: " + self.socket.id + " - sendAllObjectDescription : send done with fail status - Fail during completeJsonObject.");
        };

        ModelItf.completeArraySerialization(objects, success, fail);
    }

    /**
     * Retrieve all Objects fail, send an error.
     *
     * @method retrieveAllObjectFail
     * @param {Error} error - The Error reason of fail.
     * @param {string} responseChannel - The channel to send response
     */
    retrieveAllObjectFail(error : Error, responseChannel : string) {
        var self = this;

        self.socket.emit(responseChannel, self.formatResponse(false, error));
        Logger.debug("SocketId: " + self.socket.id + " - sendAllSourceDescription : send done with fail status - Fail during read all.");
    }

////////////////////// End: Manage sendAllObjectDescription //////////////////////
}