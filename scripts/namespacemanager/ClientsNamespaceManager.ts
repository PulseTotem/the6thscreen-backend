/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/server/NamespaceManager.ts" />

/// <reference path="../model/Profil.ts" />
/// <reference path="../model/User.ts" />
/// <reference path="../model/SDI.ts" />
/// <reference path="../model/Zone.ts" />
/// <reference path="../model/Call.ts" />
/// <reference path="../model/CallType.ts" />

class ClientsNamespaceManager extends NamespaceManager {

    /**
     * Constructor.
     *
     * @constructor
     * @param {any} socket - The socket.
     */
    constructor(socket : any) {
        super(socket);

        var self = this;

        this.addListenerToSocket('RetrieveProfilDescription', function(description) { self.sendProfilDescription(description); });
        this.addListenerToSocket('RetrieveUserDescription', function(description) { self.sendUserDescription(description); });
        this.addListenerToSocket('RetrieveSDIDescription', function(description) { self.sendSDIDescription(description); });
        this.addListenerToSocket('RetrieveZoneDescription', function(description) { self.sendZoneDescription(description); });
        this.addListenerToSocket('RetrieveCallDescription', function(description) { self.sendCallDescription(description); });
        this.addListenerToSocket('RetrieveCallTypeDescription', function(description) { self.sendCallTypeDescription(description); });
    }

////////////////////// Begin: Manage SendProfilDescription //////////////////////

    /**
     * Retrieve Profil instance description and send it to client.
     *
     * @method sendProfilDescription
     * @param {any} profilDescription - The Profil Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendProfilDescription(profilDescription : any, self : ClientsNamespaceManager = null) {
        // profilDescription : {"profilId" : string}
        if(self == null) {
            self = this;
        }
        Logger.debug("SocketId: " + self.socket.id + " - sendProfilDescription");

        var profilId = profilDescription.profilId;

        Logger.debug("SocketId: " + self.socket.id + " - sendProfilDescription : profilId " + profilId.toString());

        Logger.debug("SocketId: " + self.socket.id + " - sendProfilDescription : retrieveProfil");

        Profil.read(parseInt(profilId), function(profil) { self.retrieveProfilSuccess(profil); }, function(error) { self.retrieveProfilFail(error, profilId); });
    }

    /**
     * Retrieve Profil instance success, so send it to client.
     *
     * @method retrieveProfilSuccess
     * @param {Profil} profil - The Profil Description.
     */
    retrieveProfilSuccess(profil : Profil) {
        var self = this;

        var success : Function = function(completeJSONObject) {
            Logger.debug("SocketId: " + self.socket.id + " - sendProfilDescription : completeJSON done.");

            self.socket.emit("ProfilDescription", completeJSONObject);

            Logger.debug("SocketId: " + self.socket.id + " - sendProfilDescription : send done.");
        };

        var fail : Function = function(error) {
            Logger.debug("SocketId: " + self.socket.id + " - sendProfilDescription : completeJSON fail.");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("ProfilDescriptionError", ???);
        };

        profil.toCompleteJSONObject(success, fail);
    }

    /**
     * Retrieve Profil instance fail, so retry or send an error.
     *
     * @method retrieveProfilFail
     * @param {Error} error - The Error reason of fail.
     * @param {number} profilId - The Profil Id.
     * @param {number} attemptNumber - The attempt number.
     */
    retrieveProfilFail(error : Error, profilId : number, attemptNumber : number = 0) {
        if(attemptNumber >= 3) {
            Logger.debug("SocketId: " + this.socket.id + " - sendProfilDescription : error");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("ProfilDescriptionError", ???);
        } else {
            Logger.debug("SocketId: " + this.socket.id + " - sendProfilDescription : attemptNumber " + attemptNumber);
            Profil.read(profilId, this.retrieveProfilSuccess, this.retrieveProfilFail, attemptNumber+1);
        }
    }

////////////////////// End: Manage SendProfilDescription //////////////////////

////////////////////// Begin: Manage SendUserDescription //////////////////////

    /**
     * Retrieve User instance description and send it to client.
     *
     * @method sendUserDescription
     * @param {any} userDescription - The User Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendUserDescription(userDescription : any, self : ClientsNamespaceManager = null) {
        // userDescription : {"userId" : string}
        if(self == null) {
            self = this;
        }
        Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription");

        var userId = userDescription.userId;

        Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription : userId " + userId.toString());

        Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription : retrieveUser");
        User.read(parseInt(userId), function(user) { self.retrieveUserSuccess(user); }, function(error) { self.retrieveUserFail(error, userId); });
    }

    /**
     * Retrieve User instance success, so send it to client.
     *
     * @method retrieveUserSuccess
     * @param {User} user - The User Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    retrieveUserSuccess(user : User, self : ClientsNamespaceManager = null) {
        var self = this;

        var success : Function = function(completeJSONObject) {
            Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription : completeJSON done.");

            self.socket.emit("UserDescription", completeJSONObject);

            Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription : send done.");
        };

        var fail : Function = function(error) {
            Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription : completeJSON fail.");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("UserDescriptionError", ???);
        };

        user.toCompleteJSONObject(success, fail);
    }

    /**
     * Retrieve User instance fail, so retry or send an error.
     *
     * @method retrieveUserFail
     * @param {Error} error - The Error reason of fail.
     * @param {number} userId - The User Id.
     * @param {number} attemptNumber - The attempt number.
     */
    retrieveUserFail(error : Error, userId : number, attemptNumber : number = 0) {
        if(attemptNumber >= 3) {
            Logger.debug("SocketId: " + this.socket.id + " - sendUserDescription : error");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("UserDescriptionError", ???);
        } else {
            Logger.debug("SocketId: " + this.socket.id + " - sendUserDescription : attemptNumber " + attemptNumber);
            User.read(userId, this.retrieveUserSuccess, this.retrieveUserFail, attemptNumber+1);
        }
    }

////////////////////// End: Manage SendUserDescription //////////////////////

////////////////////// Begin: Manage SendSDIDescription //////////////////////

    /**
     * Retrieve SDI instance description and send it to client.
     *
     * @method sendSDIDescription
     * @param {any} sdiDescription - The SDI Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendSDIDescription(sdiDescription : any, self : ClientsNamespaceManager = null) {
        // sdiDescription : {"sdiId" : string}
        if(self == null) {
            self = this;
        }

        Logger.debug("SocketId: " + self.socket.id + " - sendSDIDescription");

        var sdiId = sdiDescription.sdiId;

        Logger.debug("SocketId: " + self.socket.id + " - sendSDIDescription : sdiId " + sdiId.toString());

        Logger.debug("SocketId: " + self.socket.id + " - sendSDIDescription : retrieveSDI");
        SDI.read(parseInt(sdiId), function(sdi) { self.retrieveSDISuccess(sdi); }, function(error) { self.retrieveSDIFail(error, sdiId); });
    }

    /**
     * Retrieve SDI instance success, so send it to client.
     *
     * @method retrieveSDISuccess
     * @param {SDI} sdi - The SDI Description.
     */
    retrieveSDISuccess(sdi : SDI) {
        var self = this;

        var success : Function = function(completeJSONObject) {
            Logger.debug("SocketId: " + self.socket.id + " - sendSDIDescription : completeJSON done.");

            self.socket.emit("SDIDescription", completeJSONObject);

            Logger.debug("SocketId: " + self.socket.id + " - sendSDIDescription : send done.");
        };

        var fail : Function = function(error) {
            Logger.debug("SocketId: " + self.socket.id + " - sendSDIDescription : completeJSON fail.");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("SDIDescriptionError", ???);
        };

        sdi.toCompleteJSONObject(success, fail);
    }

    /**
     * Retrieve SDI instance fail, so retry or send an error.
     *
     * @method retrieveSDIFail
     * @param {Error} error - The Error reason of fail.
     * @param {number} sdiId - The SDI Id.
     * @param {number} attemptNumber - The attempt number.
     */
    retrieveSDIFail(error : Error, sdiId : number, attemptNumber : number = 0) {
        if(attemptNumber >= 3) {
            Logger.debug("SocketId: " + this.socket.id + " - sendSDIDescription : error");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("SDIDescriptionError", ???);
        } else {
            Logger.debug("SocketId: " + this.socket.id + " - sendSDIDescription : attemptNumber " + attemptNumber);
            SDI.read(sdiId, this.retrieveSDISuccess, this.retrieveSDIFail, attemptNumber+1);
        }
    }

////////////////////// End: Manage SendSDIDescription //////////////////////

////////////////////// Begin: Manage SendZoneDescription //////////////////////

    /**
     * Retrieve Zone instance description and send it to client.
     *
     * @method sendZoneDescription
     * @param {any} zoneDescription - The Zone Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendZoneDescription(zoneDescription : any, self : ClientsNamespaceManager = null) {
        // zoneDescription : {"zoneId" : string}
        if(self == null) {
            self = this;
        }

        Logger.debug("SocketId: " + self.socket.id + " - sendZoneDescription");

        var zoneId = zoneDescription.zoneId;

        Logger.debug("SocketId: " + self.socket.id + " - sendZoneDescription : zoneId " + zoneId.toString());

        Logger.debug("SocketId: " + self.socket.id + " - sendZoneDescription : retrieveZone");

        Zone.read(parseInt(zoneId), function(zone) { self.retrieveZoneSuccess(zone); }, function(error) { self.retrieveZoneFail(error, zoneId); });
    }

    /**
     * Retrieve Zone instance success, so send it to client.
     *
     * @method retrieveZoneSuccess
     * @param {Zone} zone - The Zone Description.
     */
    retrieveZoneSuccess(zone : Zone) {
        var self = this;

        var success : Function = function(completeJSONObject) {
            Logger.debug("SocketId: " + self.socket.id + " - sendZoneDescription : completeJSON done.");

            self.socket.emit("ZoneDescription", completeJSONObject);

            Logger.debug("SocketId: " + self.socket.id + " - sendZoneDescription : send done.");
        };

        var fail : Function = function(error) {
            Logger.debug("SocketId: " + self.socket.id + " - sendZoneDescription : completeJSON fail.");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("ZoneDescriptionError", ???);
        };

        zone.toCompleteJSONObject(success, fail);
    }

    /**
     * Retrieve Zone instance fail, so retry or send an error.
     *
     * @method retrieveZoneFail
     * @param {Error} error - The Error reason of fail.
     * @param {number} zoneId - The Zone Id.
     * @param {number} attemptNumber - The attempt number.
     */
    retrieveZoneFail(error : Error, zoneId : number, attemptNumber : number = 0) {
        if(attemptNumber >= 3) {
            Logger.debug("SocketId: " + this.socket.id + " - sendZoneDescription : error");
            Logger.error(JSON.stringify(error));
            //self.socket.emit("ZoneDescriptionError", ???);
        } else {
            Logger.debug("SocketId: " + this.socket.id + " - sendZoneDescription : attemptNumber " + attemptNumber);
            Zone.read(zoneId, this.retrieveZoneSuccess, this.retrieveZoneFail, attemptNumber+1);
        }
    }

////////////////////// End: Manage SendZoneDescription //////////////////////

////////////////////// Begin: Manage SendCallDescription //////////////////////

    /**
     * Retrieve Call instance description and send it to client.
     *
     * @method sendCallDescription
     * @param {any} callDescription - The Call Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendCallDescription(callDescription : any, self : ClientsNamespaceManager = null) {
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
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     */
    sendCallTypeDescription(callTypeDescription : any, self : ClientsNamespaceManager = null) {
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

}