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

////////////////////// Begin: Manage sendObjectDescriptionFromId //////////////////////

    /**
     * Retrieve Model instance description and send it to client.
     *
     * @method sendObjectDescriptionFromId
     * @param {ModelItf Class} modelClass - The model.
     * @param {number} objectId - The Object's Id to retrieve.
     * @param {string} responseChannel - The channel to send response
     */
    sendObjectDescriptionFromId(modelClass : any, objectId : number, responseChannel : string, onlyId : boolean = false) {
        var self = this;

        Logger.debug("SocketId: " + self.socket.id + " - sendModelDescription - ModelTableName : " + modelClass.getTableName() + " - query ObjectId : " + objectId.toString());

        modelClass.read(objectId, function(obj) { self.retrieveObjectSuccess(obj, responseChannel, onlyId); }, function(error) { self.retrieveObjectFail(error, responseChannel); });
    }

    /**
     * Retrieve Object instance success, so send it to client.
     *
     * @method retrieveObjectSuccess
     * @param {ModelItf} object - The Object Description.
     * @param {string} responseChannel - The channel to send response
     */
    retrieveObjectSuccess(object : ModelItf, responseChannel : string, onlyId : boolean = false) {
        var self = this;

        var success : Function = function(completeJSONObject) {
            self.socket.emit(responseChannel, self.formatResponse(true, completeJSONObject));

            Logger.debug("SocketId: " + self.socket.id + " - sendModelDescription : send done with success status for Object with Id : " + object.getId());
        };

        var fail : Function = function(error) {
            self.socket.emit(responseChannel, self.formatResponse(false, error));
            Logger.debug("SocketId: " + self.socket.id + " - sendModelDescription : send done with fail status for Object with Id : " + object.getId() + " - Fail during completeJsonObject.");
        };

        object.toCompleteJSONObject(success, fail, onlyId);
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

////////////////////// Begin: Manage updateObjectAttribute //////////////////////

	/**
	 * Update an object attribute and send back the object to the client.
	 *
	 * @method updateObjectAttribute
	 * @param {ModelItf Class} modelClass - The model.
	 * @param {string} responseChannel - The channel to send response
	 */
	updateObjectAttribute(modelClass : any, informations : any, responseChannel : string) {
		var self = this;

		Logger.debug("SocketId: " + self.socket.id + " - updateObjectAttribute : updateObject of Model with TableName: " + modelClass.getTableName());

		var success = function () {
			self.sendObjectDescriptionFromId(modelClass, informations.id, responseChannel, true);
		};

		ModelItf.updateAttribute(modelClass, informations, success, function (error) { self.updateObjectAttributeFail(error, responseChannel); });
	}

	/**
	 * Update an object attribute fails, send an error.
	 *
	 * @method updateObjectAttributeFail
	 * @param {Error} error - The Error reason of fail.
	 * @param {string} responseChannel - The channel to send response
	 */
	updateObjectAttributeFail(error : Error, responseChannel : string) {
		var self = this;

		self.socket.emit(responseChannel, self.formatResponse(false, error));
		Logger.debug("SocketId: " + self.socket.id + " - updateObjectAttributeFail : send done with fail status - Fail during read all.");
	}

////////////////////// End: Manage updateObjectAttribute //////////////////////

////////////////////// Begin: Manage createObject //////////////////////

	/**
	 * Create an object and send it back to the client.
	 *
	 * @method createObject
	 * @param {ModelItf Class} modelClass - The model.
	 * @param {any} informations - The information used to create the object. It must be a JSON object.
	 * @param {string} responseChannel - The channel to send response
	 */
	createObject(modelClass : any, informations : any, responseChannel : string) {
		var self = this;

		Logger.debug("SocketId: " + self.socket.id + " - createObject : createObject of Model with TableName: " + modelClass.getTableName());

		var success = function (object) {
			self.sendObjectDescriptionFromId(modelClass, object.id, responseChannel, true);
		};

		var object = modelClass.fromJSONObject(informations);
		object.create(success, function (error) { self.createObjectFail(error, responseChannel); });
	}

	/**
	 * Create an object fails, send an error.
	 *
	 * @method createObjectFail
	 * @param {Error} error - The Error reason of fail.
	 * @param {string} responseChannel - The channel to send response
	 */
	createObjectFail(error : Error, responseChannel : string) {
		var self = this;

		self.socket.emit(responseChannel, self.formatResponse(false, error));
		Logger.debug("SocketId: " + self.socket.id + " - createObject : send done with fail status.");
	}

////////////////////// End: Manage updateObjectAttribute //////////////////////

////////////////////// Begin: Manage deleteObject //////////////////////

	/**
	 * Delete an object.
	 *
	 * @method deleteObject
	 * @param {ModelItf Class} modelClass - The model.
	 * @param {number} objectId - The id of the object to delete.
	 * @param {string} responseChannel - The channel to send response
	 */
	deleteObject(modelClass : any, objectId : number, responseChannel : string) {
		var self = this;

		Logger.debug("SocketId: " + self.socket.id + " - createObject : deleteObject of Model with TableName: " + modelClass.getTableName());

		var success = function (object) {
			self.socket.emit(responseChannel, self.formatResponse(true, null));
		};
		ModelItf.deleteObject(modelClass, objectId, success, function (error) { self.deleteObjectFail(error, responseChannel); });
	}

	/**
	 * Delete an object fails, send an error.
	 *
	 * @method deleteObjectFail
	 * @param {Error} error - The Error reason of fail.
	 * @param {string} responseChannel - The channel to send response
	 */
	deleteObjectFail(error : Error, responseChannel : string) {
		var self = this;

		self.socket.emit(responseChannel, self.formatResponse(false, error));
		Logger.debug("SocketId: " + self.socket.id + " - deleteObject : send done with fail status.");
	}

////////////////////// End: Manage updateObjectAttribute //////////////////////
}