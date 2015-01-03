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
        this.addListenerToSocket('RetrieveCallDescription', this.sendCallDescription);
        this.addListenerToSocket('RetrieveCallTypeDescription', this.sendCallTypeDescription);
        this.addListenerToSocket('RetrieveSourceDescription', this.sendSourceDescription);
        this.addListenerToSocket('RetrieveParamValueDescription', this.sendParamValueDescription);
    }

    /**
     * Retrieve Call instance description and send it to sourcesServer.
     *
     * @method sendCallDescription
     * @param {any} callDescription - The Call Description.
     * @param {SourcesNamespaceManager} self - The SourcesNamespaceManager instance.
     * @param {number} attemptNumber - The attempt number.
     * /
    sendCallDescription(callDescription : any, self : SourcesNamespaceManager = null, attemptNumber : number = 0) {
        // callDescription : {"callId" : string}
        if(self == null) {
            self = this;
        }

        Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription");

        var callId = callDescription.callId;

        Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription :callId " + callId.toString());

        try {
            Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription : retrieveCall");
            var call = Call.read(parseInt(callId));
            Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription : callOK with name -> " + call.name());
            Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription : callJSON -> ");
            Logger.debug(call.toCompleteJSONObject());
            self.socket.emit("CallDescription", call.toCompleteJSONObject());

            Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription : send done.");
        } catch(e) {
            Logger.debug(e);
            if(e.name == "ResponseTimeoutException") {
                if(attemptNumber >= 3) {
                    Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription : error");
                    Logger.error(e.message);
                } else {
                    Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription : attemptNumber " + attemptNumber);
                    self.sendCallDescription(callDescription, self, attemptNumber+1);
                }
            } else {
                Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription : error");
                Logger.error(e.message);
            }
        }
    }

    /**
     * Retrieve CallType instance description and send it to sourcesServer.
     *
     * @method sendCallTypeDescription
     * @param {any} callTypeDescription - The CallType Description.
     * @param {SourcesNamespaceManager} self - The SourcesNamespaceManager instance.
     * @param {number} attemptNumber - The attempt number.
     * /
    sendCallTypeDescription(callTypeDescription : any, self : SourcesNamespaceManager = null, attemptNumber : number = 0) {
        // callTypeDescription : {"callTypeId" : string}
        if(self == null) {
            self = this;
        }

        Logger.debug("SocketId: " + self.socket.id + " - sendCallTypeDescription");

        var callTypeId = callTypeDescription.callTypeId;

        try {
            var callType = CallType.read(parseInt(callTypeId));
            self.socket.emit("CallTypeDescription", callType.toCompleteJSONObject());

            Logger.debug("SocketId: " + self.socket.id + " - sendCallTypeDescription : send done.");
        } catch(e) {
            if(e.name == "ResponseTimeoutException") {
                if(attemptNumber >= 3) {
                    Logger.debug("SocketId: " + self.socket.id + " - sendCallTypeDescription : error");
                    Logger.error(e.message);
                } else {
                    Logger.debug("SocketId: " + self.socket.id + " - sendCallTypeDescription : attemptNumber " + attemptNumber);
                    self.sendCallTypeDescription(callTypeDescription, self, attemptNumber+1);
                }
            } else {
                Logger.debug("SocketId: " + self.socket.id + " - sendCallTypeDescription : error");
                Logger.error(e.message);
            }
        }
    }

    /**
     * Retrieve Source instance description and send it to sourcesServer.
     *
     * @method sendSourceDescription
     * @param {any} sourceDescription - The Source Description.
     * @param {SourcesNamespaceManager} self - The SourcesNamespaceManager instance.
     * @param {number} attemptNumber - The attempt number.
     * /
    sendSourceDescription(sourceDescription : any, self : SourcesNamespaceManager = null, attemptNumber : number = 0) {
        // sourceDescription : {"sourceId" : string}
        if(self == null) {
            self = this;
        }

        Logger.debug("SocketId: " + self.socket.id + " - sendSourceDescription");

        var sourceId = sourceDescription.sourceId;

        try {
            var source = Source.read(parseInt(sourceId));
            self.socket.emit("SourceDescription", source.toCompleteJSONObject());

            Logger.debug("SocketId: " + self.socket.id + " - sendSourceDescription : send done.");
        } catch(e) {
            if(e.name == "ResponseTimeoutException") {
                if(attemptNumber >= 3) {
                    Logger.debug("SocketId: " + self.socket.id + " - sendSourceDescription : error");
                    Logger.error(e.message);
                } else {
                    Logger.debug("SocketId: " + self.socket.id + " - sendSourceDescription : attemptNumber " + attemptNumber);
                    self.sendSourceDescription(sourceDescription, self, attemptNumber+1);
                }
            } else {
                Logger.debug("SocketId: " + self.socket.id + " - sendSourceDescription : error");
                Logger.error(e.message);
            }
        }
    }

    /**
     * Retrieve ParamValue instance description and send it to sourcesServer.
     *
     * @method sendParamValueDescription
     * @param {any} paramValueDescription - The ParamValue Description.
     * @param {SourcesNamespaceManager} self - The SourcesNamespaceManager instance.
     * @param {number} attemptNumber - The attempt number.
     * /
    sendParamValueDescription(paramValueDescription : any, self : SourcesNamespaceManager = null, attemptNumber : number = 0) {
        // paramValueDescription : {"paramValueId" : string}
        if(self == null) {
            self = this;
        }

        Logger.debug("SocketId: " + self.socket.id + " - sendParamValueDescription");

        var paramValueId = paramValueDescription.paramValueId;

        try {
            var paramValue = ParamValue.read(parseInt(paramValueId));
            self.socket.emit("ParamValueDescription", paramValue.toCompleteJSONObject());

            Logger.debug("SocketId: " + self.socket.id + " - sendParamValueDescription : send done.");
        } catch(e) {
            if(e.name == "ResponseTimeoutException") {
                if(attemptNumber >= 3) {
                    Logger.debug("SocketId: " + self.socket.id + " - sendParamValueDescription : error");
                    Logger.error(e.message);
                } else {
                    Logger.debug("SocketId: " + self.socket.id + " - sendParamValueDescription : attemptNumber " + attemptNumber);
                    self.sendParamValueDescription(paramValueDescription, self, attemptNumber+1);
                }
            } else {
                Logger.debug("SocketId: " + self.socket.id + " - sendParamValueDescription : error");
                Logger.error(e.message);
            }
        }
    }*/

////////////// WITH CALLBACKS //////

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

        Call.read(parseInt(callId), self.retrieveCallSuccess, self.retrieveCallFail);
    }

    /**
     * Retrieve Call instance success, so send it to client.
     *
     * @method retrieveCallSuccess
     * @param {Call} call - The Call Description.
     */
    retrieveCallSuccess(call : Call) {
        this.socket.emit("CallDescription", call.toCompleteJSONObject());

        Logger.debug("SocketId: " + this.socket.id + " - sendCallDescription : send done.");
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

        CallType.read(parseInt(callTypeId), self.retrieveCallTypeSuccess, self.retrieveCallTypeFail);
    }

    /**
     * Retrieve CallType instance success, so send it to client.
     *
     * @method retrieveCallTypeSuccess
     * @param {CallType} calltype - The CallType Description.
     */
    retrieveCallTypeSuccess(calltype : CallType) {
        this.socket.emit("CallTypeDescription", calltype.toCompleteJSONObject());

        Logger.debug("SocketId: " + this.socket.id + " - sendCallTypeDescription : send done.");
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

        Source.read(parseInt(sourceId), self.retrieveSourceSuccess, self.retrieveSourceFail);
    }

    /**
     * Retrieve Source instance success, so send it to client.
     *
     * @method retrieveSourceSuccess
     * @param {Source} source - The Source Description.
     */
    retrieveSourceSuccess(source : Source) {
        this.socket.emit("SourceDescription", source.toCompleteJSONObject());

        Logger.debug("SocketId: " + this.socket.id + " - sendSourceDescription : send done.");
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

        ParamValue.read(parseInt(paramValueId), self.retrieveParamValueSuccess, self.retrieveParamValueFail);
    }

    /**
     * Retrieve ParamValue instance success, so send it to client.
     *
     * @method retrieveParamValueSuccess
     * @param {ParamValue} paramValue - The ParamValue Description.
     */
    retrieveParamValueSuccess(paramValue : ParamValue) {
        this.socket.emit("ParamValueDescription", paramValue.toCompleteJSONObject());

        Logger.debug("SocketId: " + this.socket.id + " - sendParamValueDescription : send done.");
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