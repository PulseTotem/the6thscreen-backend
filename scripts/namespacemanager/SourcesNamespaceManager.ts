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
        this.addListenerToSocket('RetrieveCallTypeDescription', function(description) { self.sendCallTypeDescription(description); });
        this.addListenerToSocket('RetrieveSourceDescription', function(description) { self.sendSourceDescription(description); });
        this.addListenerToSocket('RetrieveParamValueDescription', function(description) { self.sendParamValueDescription(description); });
		this.addListenerToSocket('RetrieveOAuthKeyDescription', function(description) { self.sendOAuthKeyDescription(description); });
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

        self.sendObjectDescriptionFromId(Call, callId, "CallDescription");
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
        var self = this;

        var callTypeId = callTypeDescription.callTypeId;

        self.sendObjectDescriptionFromId(CallType, callTypeId, "CallTypeDescription");
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
        var self = this;

        var sourceId = sourceDescription.sourceId;

        self.sendObjectDescriptionFromId(Source, sourceId, "SourceDescription");
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
        var self = this;

        var paramValueId = paramValueDescription.paramValueId;

        self.sendObjectDescriptionFromId(ParamValue, paramValueId, "ParamValueDescription");
    }

////////////////////// End: Manage SendParamValueDescription //////////////////////

////////////////////// Begin: Manage SendOAuthKeyDescription //////////////////////

	/**
	 * Retrieve OAuthKey instance description and send it to sourcesServer.
	 *
	 * @method sendOAuthKeyDescription
	 * @param {any} oauthKeyDescription - The OAuthKey Description.
	 * @param {SourcesNamespaceManager} self - The SourcesNamespaceManager instance.
	 */
	sendOAuthKeyDescription(oauthKeyDescription : any, self : SourcesNamespaceManager = null) {
		// oauthKeyDescription : {"userId" : string, "serviceId" : string}
		var self = this;

		var fail = function(error) {
			self.socket.emit("OAuthKeyDescription", self.formatResponse(false, error));
		};

		var successUser = function(user) {

			var successUserComplete = function(userComplete) {
				var serviceId = oauthKeyDescription.serviceId;

				userComplete.oauthkeys.forEach(function(oauthKeyJSON) {

					var successOAuthKey = function(oauthKey) {
						var successOAuthKeyComplete = function(oauthKeyComplete) {
							if(oauthKeyComplete.service.id == serviceId) {
								self.socket.emit("OAuthKeyDescription", self.formatResponse(true, oauthKeyComplete));
							}
						};

						oauthKey.toCompleteJSONObject(successOAuthKeyComplete, fail);
					};

					OAuthKey.read(oauthKeyJSON.id, successOAuthKey, fail);

				});
			};

			user.toCompleteJSONObject(successUserComplete, fail);
		};

		var userId = oauthKeyDescription.userId;

		User.read(userId, successUser, fail);
	}

////////////////////// End: Manage SendOAuthKeyDescription //////////////////////

}