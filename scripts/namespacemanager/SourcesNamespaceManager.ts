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
     */
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
     */
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
     */
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
     */
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
    }
}