/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../model/Profil.ts" />
/// <reference path="../model/Call.ts" />
/// <reference path="../model/CallType.ts" />
/// <reference path="../model/User.ts" />
/// <reference path="../model/SDI.ts" />
/// <reference path="../model/Zone.ts" />

/**
 * Manage connection with Sources Server.
 *
 * @class SourcesServerManager
 */
class SourcesServerManager {

    /**
     * The 6th Screen SourcesServer's socket.
     *
     * @property _sourcesServerSocket
     * @type any
     */
    private _sourcesServerSocket : any;

    /**
     * Constructor.
     *
     * @constructor
     * @param {any} sourcesServerSocket - The SourcesServer's socket.
     */
    constructor(sourcesServerSocket : any) {
        this._sourcesServerSocket = sourcesServerSocket;
        this.listenSourcesServer();
    }

    /**
     * Prepare socket for orders from SourcesServer.
     *
     * @method listenSourcesServer
     */
    listenSourcesServer() {
        var self = this;

        this._sourcesServerSocket.on("RetrieveCallDescription", function(callDescription) {
            // callDescription : {"callId" : string}
            self.sendCallDescription(callDescription.callId);
        });

        this._sourcesServerSocket.on("RetrieveCallTypeDescription", function(callTypeDescription) {
            // callTypeDescription : {"callTypeId" : string}
            self.sendCallTypeDescription(callTypeDescription.callTypeId);
        });

        this._sourcesServerSocket.on("RetrieveSourceDescription", function(sourceDescription) {
            // sourceDescription : {"sourceId" : string}
            self.sendSourceDescription(sourceDescription.sourceId);
        });

        this._sourcesServerSocket.on("RetrieveParamValueDescription", function(paramValueDescription) {
            // paramValueDescription : {"paramValueId" : string}
            self.sendParamValueDescription(paramValueDescription.paramValueId);
        });
    }

    /**
     * Retrieve Call instance description and send it to sourcesServer.
     *
     * @method sendCallDescription
     * @param {string} callId - The Call Id.
     */
    sendCallDescription(callId : string) {
        var call = Call.read(parseInt(callId));
        Logger.debug(call.toCompleteJSONObject());
        this._sourcesServerSocket.emit("CallDescription", call.toCompleteJSONObject());
    }

    /**
     * Retrieve CallType instance description and send it to sourcesServer.
     *
     * @method sendCallTypeDescription
     * @param {string} callTypeId - The CallType Id.
     */
    sendCallTypeDescription(callTypeId : string) {
        var callType = CallType.read(parseInt(callTypeId));
        Logger.debug(callType.toCompleteJSONObject());
        this._sourcesServerSocket.emit("CallTypeDescription", callType.toCompleteJSONObject());
    }

    /**
     * Retrieve Source instance description and send it to sourcesServer.
     *
     * @method sendSourceDescription
     * @param {string} sourceId - The Source Id.
     */
    sendSourceDescription(sourceId : string) {
        var source = Source.read(parseInt(sourceId));
        Logger.debug(source.toCompleteJSONObject());
        this._sourcesServerSocket.emit("SourceDescription", source.toCompleteJSONObject());
    }

    /**
     * Retrieve ParamValue instance description and send it to sourcesServer.
     *
     * @method sendParamValueDescription
     * @param {string} sourceId - The ParamValue Id.
     */
    sendParamValueDescription(paramValueId : string) {
        var paramValue = ParamValue.read(parseInt(paramValueId));
        Logger.debug(paramValue.toCompleteJSONObject());
        this._sourcesServerSocket.emit("ParamValueDescription", paramValue.toCompleteJSONObject());
    }
}