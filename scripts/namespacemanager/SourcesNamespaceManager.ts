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
        // callDescription : {"callId" : string}
        if(self == null) {
            self = this;
        }

        var callId = callDescription.callId;

        var call = Call.read(parseInt(callId));
        Logger.debug(call.toCompleteJSONObject());
        self.socket.emit("CallDescription", call.toCompleteJSONObject());
    }

    /**
     * Retrieve CallType instance description and send it to sourcesServer.
     *
     * @method sendCallTypeDescription
     * @param {any} callTypeDescription - The CallType Description.
     * @param {SourcesNamespaceManager} self - The SourcesNamespaceManager instance.
     */
    sendCallTypeDescription(callTypeDescription : any, self : SourcesNamespaceManager = null) {
        // callTypeDescription : {"callTypeId" : string}
        if(self == null) {
            self = this;
        }

        var callTypeId = callTypeDescription.callTypeId;

        var callType = CallType.read(parseInt(callTypeId));
        Logger.debug(callType.toCompleteJSONObject());
        self.socket.emit("CallTypeDescription", callType.toCompleteJSONObject());
    }

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

        var sourceId = sourceDescription.sourceId;

        var source = Source.read(parseInt(sourceId));
        Logger.debug(source.toCompleteJSONObject());
        self.socket.emit("SourceDescription", source.toCompleteJSONObject());
    }

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

        var paramValueId = paramValueDescription.paramValueId;

        var paramValue = ParamValue.read(parseInt(paramValueId));
        Logger.debug(paramValue.toCompleteJSONObject());
        self.socket.emit("ParamValueDescription", paramValue.toCompleteJSONObject());
    }
}