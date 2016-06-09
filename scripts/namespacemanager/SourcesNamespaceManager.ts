/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="./ShareNamespaceManager.ts" />

/// <reference path="../model/Call.ts" />
/// <reference path="../model/CallType.ts" />
/// <reference path="../model/Source.ts" />
/// <reference path="../model/ParamValue.ts" />

class SourcesNamespaceManager extends ShareNamespaceManager {

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
        var self = this;

        var callId = callDescription.callId;

		var fail : Function = function(error) {
			self.socket.emit("CallDescription", self.formatResponse(false, error));
			Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription : send done with fail status for Object with Id : " + callId);
		};

		var successRead : Function = function(call : Call) {

			var successCallComplete : Function = function(callCompleteDesc) {
				var callDesc = callCompleteDesc;

				var successCallTypeComplete : Function = function(callTypeCompleteDesc) {
					callDesc["callType"] = callTypeCompleteDesc;

					var successSourceComplete : Function = function(sourceCompleteDesc) {
						callDesc["callType"]["source"] = sourceCompleteDesc;

						callDesc["paramValues"] = [];

						var successParamValueComplete = function(paramValueComplete) {
							callDesc["paramValues"].push(paramValueComplete);

							if(callDesc["paramValues"].length == call.paramValues().length) {
								self.socket.emit("CallDescription", self.formatResponse(true, callDesc));
							}
						};


						if(call.paramValues().length > 0) {
							call.paramValues().forEach(function (paramValue:ParamValue) {
								paramValue.toCompleteJSONObject(successParamValueComplete, fail);
							});
						} else {
							self.socket.emit("CallDescription", self.formatResponse(true, callDesc));
						}
					};

					call.callType().source().toCompleteJSONObject(successSourceComplete, fail);
				};

				call.callType().toCompleteJSONObject(successCallTypeComplete, fail);
			}

			call.toCompleteJSONObject(successCallComplete, fail);
		};

		Call.read(callId, successRead, fail);
    }

////////////////////// End: Manage SendCallDescription //////////////////////

}