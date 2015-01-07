/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/server/NamespaceManager.ts" />

/// <reference path="../model/Call.ts" />
/// <reference path="../model/CallType.ts" />
/// <reference path="../model/Source.ts" />
/// <reference path="../model/ParamValue.ts" />

class SourcesNamespaceManager extends NamespaceManager {

    /**
     * Constructor.
     *
     * @constructor
     * @param {any} socket - The socket.
     */
    constructor(socket : any) {
        super(socket);
        var self = this;

        this.addListenerToSocket('RetrieveCallDescription', function(description) { self.sendCallDescription(description); });
        this.addListenerToSocket('RetrieveCallTypeDescription', function(description) { self.sendCallTypeDescription(description); });
        this.addListenerToSocket('RetrieveSourceDescription', function(description) { self.sendSourceDescription(description); });
        this.addListenerToSocket('RetrieveParamValueDescription', function(description) { self.sendParamValueDescription(description); });
    }

////////////////////// Begin: Manage SendCallDescription //////////////////////

    /**
     * Retrieve Call instance description and send it to client.
     *
     * @method sendCallDescription
     * @param {any} callDescription - The Call Description.
     * @param {SourcesNamespaceManager} self - The SourcesNamespaceManager instance.
     */
    sendCallDescription(callDescription : any, self : SourcesNamespaceManager = null) {
        // callDescription : {"callId" : string}
        if(self == null) {
            self = this;
        }

        Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription");

        var callId = callDescription.callId;

        Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription : callId " + callId.toString());

        Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription : retrieveCall");

        Call.read(parseInt(callId), function(call) { self.retrieveCallSuccess(call); }, function(error) { self.retrieveCallFail(error, callId); });
    }

    /**
     * Retrieve Call instance success, so send it to client.
     *
     * @method retrieveCallSuccess
     * @param {Call} call - The Call Description.
     */
    retrieveCallSuccess(call : Call) {
        var self = this;

        var success : Function = function(completeJSONObject) {
            Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription : completeJSON done.");

            self.socket.emit("CallDescription", completeJSONObject);

            Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription : send done.");
        };

        var fail : Function = function(error) {
            Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription : completeJSON fail.");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("CallDescriptionError", ???);
        };

        call.toCompleteJSONObject(success, fail);
    }

    /**
     * Retrieve Call instance fail, so retry or send an error.
     *
     * @method retrieveCallFail
     * @param {Error} error - The Error reason of fail.
     * @param {number} callId - The Call Id.
     * @param {number} attemptNumber - The attempt number.
     */
    retrieveCallFail(error : Error, callId : number, attemptNumber : number = 0) {
        if(attemptNumber >= 3) {
            Logger.debug("SocketId: " + this.socket.id + " - sendCallDescription : error");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("CallDescriptionError", ???);
        } else {
            Logger.debug("SocketId: " + this.socket.id + " - sendCallDescription : attemptNumber " + attemptNumber);
            Call.read(callId, this.retrieveCallSuccess, this.retrieveCallFail, attemptNumber+1);
        }
    }

////////////////////// End: Manage SendCallDescription //////////////////////

////////////////////// Begin: Manage SendCallTypeDescription //////////////////////

    /**
     * Retrieve CallType instance description and send it to client.
     *
     * @method sendCallTypeDescription
     * @param {any} callTypeDescription - The CallType Description
     * @param {SourcesNamespaceManager} self - The SourcesNamespaceManager instance.
     */
    sendCallTypeDescription(callTypeDescription : any, self : SourcesNamespaceManager = null) {
        // callTypeDescription : {"callTypeId" : string}
        if(self == null) {
            self = this;
        }

        Logger.debug("SocketId: " + self.socket.id + " - sendCallTypeDescription");

        var callTypeId = callTypeDescription.callTypeId;

        Logger.debug("SocketId: " + self.socket.id + " - sendCallTypeDescription : callTypeId " + callTypeId.toString());

        Logger.debug("SocketId: " + self.socket.id + " - sendCallTypeDescription : retrieveCallType");

        CallType.read(parseInt(callTypeId), function(callType) { self.retrieveCallTypeSuccess(callType); }, function(error) { self.retrieveCallTypeFail(error, callTypeId); });
    }

    /**
     * Retrieve CallType instance success, so send it to client.
     *
     * @method retrieveCallTypeSuccess
     * @param {CallType} calltype - The CallType Description.
     */
    retrieveCallTypeSuccess(calltype : CallType) {
        var self = this;

        var success : Function = function(completeJSONObject) {
            Logger.debug("SocketId: " + self.socket.id + " - sendCallTypeDescription : completeJSON done.");

            self.socket.emit("CallTypeDescription", completeJSONObject);

            Logger.debug("SocketId: " + self.socket.id + " - sendCallTypeDescription : send done.");
        };

        var fail : Function = function(error) {
            Logger.debug("SocketId: " + self.socket.id + " - sendCallTypeDescription : completeJSON fail.");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("CallTypeDescriptionError", ???);
        };

        calltype.toCompleteJSONObject(success, fail);
    }

    /**
     * Retrieve CallType instance fail, so retry or send an error.
     *
     * @method retrieveCallTypeFail
     * @param {Error} error - The Error reason of fail.
     * @param {number} callTypeId - The CallType Id.
     * @param {number} attemptNumber - The attempt number.
     */
    retrieveCallTypeFail(error : Error, callTypeId : number, attemptNumber : number = 0) {
        if(attemptNumber >= 3) {
            Logger.debug("SocketId: " + this.socket.id + " - sendCallTypeDescription : error");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("CallTypeDescriptionError", ???);
        } else {
            Logger.debug("SocketId: " + this.socket.id + " - sendCallTypeDescription : attemptNumber " + attemptNumber);
            CallType.read(callTypeId, this.retrieveCallTypeSuccess, this.retrieveCallTypeFail, attemptNumber+1);
        }
    }

////////////////////// End: Manage SendCallTypeDescription //////////////////////

////////////////////// Begin: Manage SendSourceDescription //////////////////////

    /**
     * Retrieve Source instance description and send it to sourcesServer.
     *
     * @method sendSourceDescription
     * @param {any} sourceDescription - The Source Description.
     * @param {SourcesNamespaceManager} self - The SourcesNamespaceManager instance.
     */
    sendSourceDescription(sourceDescription : any, self : SourcesNamespaceManager = null) {
        // sourceDescription : {"sourceId" : string}
        if(self == null) {
            self = this;
        }

        Logger.debug("SocketId: " + self.socket.id + " - sendSourceDescription");

        var sourceId = sourceDescription.sourceId;

        Logger.debug("SocketId: " + self.socket.id + " - sendSourceDescription : sourceId " + sourceId.toString());

        Logger.debug("SocketId: " + self.socket.id + " - sendSourceDescription : retrieveSource");

        Source.read(parseInt(sourceId), function(source) { self.retrieveSourceSuccess(source); }, function(error) { self.retrieveSourceFail(error, sourceId); });
    }

    /**
     * Retrieve Source instance success, so send it to client.
     *
     * @method retrieveSourceSuccess
     * @param {Source} source - The Source Description.
     */
    retrieveSourceSuccess(source : Source) {
        var self = this;

        var success : Function = function(completeJSONObject) {
            Logger.debug("SocketId: " + self.socket.id + " - sendSourceDescription : completeJSON done.");

            self.socket.emit("SourceDescription", completeJSONObject);

            Logger.debug("SocketId: " + self.socket.id + " - sendSourceDescription : send done.");
        };

        var fail : Function = function(error) {
            Logger.debug("SocketId: " + self.socket.id + " - sendSourceDescription : completeJSON fail.");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("SourceDescriptionError", ???);
        };

        source.toCompleteJSONObject(success, fail);
    }

    /**
     * Retrieve Source instance fail, so retry or send an error.
     *
     * @method retrieveSourceFail
     * @param {Error} error - The Error reason of fail.
     * @param {number} sourceId - The Source Id.
     * @param {number} attemptNumber - The attempt number.
     */
    retrieveSourceFail(error : Error, sourceId : number, attemptNumber : number = 0) {
        if(attemptNumber >= 3) {
            Logger.debug("SocketId: " + this.socket.id + " - sendSourceDescription : error");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("SourceDescriptionError", ???);
        } else {
            Logger.debug("SocketId: " + this.socket.id + " - sendSourceDescription : attemptNumber " + attemptNumber);
            Source.read(sourceId, this.retrieveSourceSuccess, this.retrieveSourceFail, attemptNumber+1);
        }
    }

////////////////////// End: Manage SendSourceDescription //////////////////////

////////////////////// Begin: Manage SendParamValueDescription //////////////////////

    /**
     * Retrieve ParamValue instance description and send it to sourcesServer.
     *
     * @method sendParamValueDescription
     * @param {any} paramValueDescription - The ParamValue Description.
     * @param {SourcesNamespaceManager} self - The SourcesNamespaceManager instance.
     */
    sendParamValueDescription(paramValueDescription : any, self : SourcesNamespaceManager = null) {
        // paramValueDescription : {"paramValueId" : string}
        if(self == null) {
            self = this;
        }

        Logger.debug("SocketId: " + self.socket.id + " - sendParamValueDescription");

        var paramValueId = paramValueDescription.paramValueId;

        Logger.debug("SocketId: " + self.socket.id + " - sendParamValueDescription : paramValueId " + paramValueId.toString());

        Logger.debug("SocketId: " + self.socket.id + " - sendParamValueDescription : retrieveParamValue");

        ParamValue.read(parseInt(paramValueId), function(paramValue) { self.retrieveParamValueSuccess(paramValue); }, function(error) { self.retrieveParamValueFail(error, paramValueId); });
    }

    /**
     * Retrieve ParamValue instance success, so send it to client.
     *
     * @method retrieveParamValueSuccess
     * @param {ParamValue} paramValue - The ParamValue Description.
     */
    retrieveParamValueSuccess(paramValue : ParamValue) {
        var self = this;

        var success : Function = function(completeJSONObject) {
            Logger.debug("SocketId: " + self.socket.id + " - sendParamValueDescription : completeJSON done.");

            self.socket.emit("ParamValueDescription", completeJSONObject);

            Logger.debug("SocketId: " + self.socket.id + " - sendParamValueDescription : send done.");
        };

        var fail : Function = function(error) {
            Logger.debug("SocketId: " + self.socket.id + " - sendParamValueDescription : completeJSON fail.");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("ParamValueDescriptionError", ???);
        };

        paramValue.toCompleteJSONObject(success, fail);
    }

    /**
     * Retrieve ParamValue instance fail, so retry or send an error.
     *
     * @method retrieveParamValueFail
     * @param {Error} error - The Error reason of fail.
     * @param {number} paramValueId - The ParamValue Id.
     * @param {number} attemptNumber - The attempt number.
     */
    retrieveParamValueFail(error : Error, paramValueId : number, attemptNumber : number = 0) {
        if(attemptNumber >= 3) {
            Logger.debug("SocketId: " + this.socket.id + " - sendParamValueDescription : error");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("ParamValueDescriptionError", ???);
        } else {
            Logger.debug("SocketId: " + this.socket.id + " - sendParamValueDescription : attemptNumber " + attemptNumber);
            ParamValue.read(paramValueId, this.retrieveParamValueSuccess, this.retrieveParamValueFail, attemptNumber+1);
        }
    }

////////////////////// End: Manage SendParamValueDescription //////////////////////

}