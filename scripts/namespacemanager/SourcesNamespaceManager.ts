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
     */
    sendCallDescription(callDescription : any, self : SourcesNamespaceManager = null) {
        // callDescription : {"zoneId" : string, "callId" : string}
        if(self == null) {
            self = this;
        }

        var zoneId = callDescription.zoneId;
        var callId = callDescription.callId;

        var call = Call.read(parseInt(callId));
        self.socket.emit("zones/" + zoneId + "/calls/" + callId + "/CallDescription", call.toCompleteJSONObject());
    }

    /**
     * Retrieve CallType instance description and send it to sourcesServer.
     *
     * @method sendCallTypeDescription
     * @param {any} callTypeDescription - The CallType Description.
     * @param {SourcesNamespaceManager} self - The SourcesNamespaceManager instance.
     */
    sendCallTypeDescription(callTypeDescription : any, self : SourcesNamespaceManager = null) {
        // callTypeDescription : {"zoneId" : string, "callId" : string, "callTypeId" : string}
        if(self == null) {
            self = this;
        }

        var zoneId = callTypeDescription.zoneId;
        var callId = callTypeDescription.callId;
        var callTypeId = callTypeDescription.callTypeId;

        var callType = CallType.read(parseInt(callTypeId));
        self.socket.emit("zones/" + zoneId + "/calls/" + callId + "/CallTypeDescription", callType.toCompleteJSONObject());
    }

    /**
     * Retrieve Source instance description and send it to sourcesServer.
     *
     * @method sendSourceDescription
     * @param {any} sourceDescription - The Source Description.
     * @param {SourcesNamespaceManager} self - The SourcesNamespaceManager instance.
     */
    sendSourceDescription(sourceDescription : any, self : SourcesNamespaceManager = null) {
        // sourceDescription : {"zoneId" : string, "callId" : string, "sourceId" : string}
        if(self == null) {
            self = this;
        }

        var zoneId = sourceDescription.zoneId;
        var callId = sourceDescription.callId;
        var sourceId = sourceDescription.sourceId;

        var source = Source.read(parseInt(sourceId));
        self.socket.emit("zones/" + zoneId + "/calls/" + callId + "/SourceDescription", source.toCompleteJSONObject());
    }

    /**
     * Retrieve ParamValue instance description and send it to sourcesServer.
     *
     * @method sendParamValueDescription
     * @param {any} paramValueDescription - The ParamValue Description.
     * @param {SourcesNamespaceManager} self - The SourcesNamespaceManager instance.
     */
    sendParamValueDescription(paramValueDescription : any, self : SourcesNamespaceManager = null) {
        // paramValueDescription : {"zoneId" : string, "callId" : string, "paramValueId" : string}
        if(self == null) {
            self = this;
        }

        var zoneId = paramValueDescription.zoneId;
        var callId = paramValueDescription.callId;
        var paramValueId = paramValueDescription.paramValueId;

        var paramValue = ParamValue.read(parseInt(paramValueId));
        self.socket.emit("zones/" + zoneId + "/calls/" + callId + "/ParamValueDescription", paramValue.toCompleteJSONObject());
    }
}