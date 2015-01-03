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
        this.addListenerToSocket('RetrieveProfilDescription', this.sendProfilDescription);
        this.addListenerToSocket('RetrieveUserDescription', this.sendUserDescription);
        this.addListenerToSocket('RetrieveSDIDescription', this.sendSDIDescription);
        this.addListenerToSocket('RetrieveZoneDescription', this.sendZoneDescription);
        this.addListenerToSocket('RetrieveCallDescription', this.sendCallDescription);
        this.addListenerToSocket('RetrieveCallTypeDescription', this.sendCallTypeDescription);
    }

    /**
     * Retrieve Profil instance description and send it to client.
     *
     * @method sendProfilDescription
     * @param {any} profilDescription - The Profil Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     * @param {number} attemptNumber - The attempt number.
     * /
    sendProfilDescription(profilDescription : any, self : ClientsNamespaceManager = null, attemptNumber : number = 0) {
        // profilDescription : {"profilId" : string}
        if(self == null) {
            self = this;
        }
        Logger.debug("SocketId: " + self.socket.id + " - sendProfilDescription");

        var profilId = profilDescription.profilId;
        try {

            var profil = Profil.read(parseInt(profilId));
            self.socket.emit("ProfilDescription", profil.toCompleteJSONObject());

            Logger.debug("SocketId: " + self.socket.id + " - sendProfilDescription : send done.");
        } catch(e) {
            if(e.name == "ResponseTimeoutException") {
                if(attemptNumber >= 3) {
                    Logger.debug("SocketId: " + self.socket.id + " - sendProfilDescription : error");
                    Logger.error(e.message);
                } else {
                    Logger.debug("SocketId: " + self.socket.id + " - sendProfilDescription : attemptNumber " + attemptNumber);
                    self.sendProfilDescription(profilDescription, self, attemptNumber+1);
                }
            } else {
                Logger.debug("SocketId: " + self.socket.id + " - sendProfilDescription : error");
                Logger.error(e.message);
            }
        }
    }

    /**
     * Retrieve User instance description and send it to client.
     *
     * @method sendUserDescription
     * @param {any} userDescription - The User Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     * @param {number} attemptNumber - The attempt number.
     * /
    sendUserDescription(userDescription : any, self : ClientsNamespaceManager = null, attemptNumber : number = 0) {
        // userDescription : {"userId" : string}
        if(self == null) {
            self = this;
        }
        Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription");

        var userId = userDescription.userId;

        Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription : userId " + userId.toString());

        try {
            Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription : retrieveUser");
            var user = User.read(parseInt(userId));
            Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription : userOK with username " + user.username());
            self.socket.emit("UserDescription", user.toCompleteJSONObject());
            Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription : send done.");
        } catch(e) {
            if(e.name == "ResponseTimeoutException") {
                if(attemptNumber >= 3) {
                    Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription : error");
                    Logger.error(e.message);
                } else {
                    Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription : attemptNumber " + attemptNumber);
                    self.sendUserDescription(userDescription, self, attemptNumber+1);
                }
            } else {
                Logger.debug("SocketId: " + self.socket.id + " - sendUserDescription : error");
                Logger.error(e.message);
            }
        }
    }

    /**
     * Retrieve SDI instance description and send it to client.
     *
     * @method sendSDIDescription
     * @param {any} sdiDescription - The SDI Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     * @param {number} attemptNumber - The attempt number.
     * /
    sendSDIDescription(sdiDescription : any, self : ClientsNamespaceManager = null, attemptNumber : number = 0) {
        // sdiDescription : {"sdiId" : string}
        if(self == null) {
            self = this;
        }

        Logger.debug("SocketId: " + self.socket.id + " - sendSDIDescription");

        var sdiId = sdiDescription.sdiId;

        try {
            var sdi = SDI.read(parseInt(sdiId));
            self.socket.emit("SDIDescription", sdi.toCompleteJSONObject());

            Logger.debug("SocketId: " + self.socket.id + " - sendSDIDescription : send done.");
        } catch(e) {
            if(e.name == "ResponseTimeoutException") {
                if(attemptNumber >= 3) {
                    Logger.debug("SocketId: " + self.socket.id + " - sendSDIDescription : error");
                    Logger.error(e.message);
                } else {
                    Logger.debug("SocketId: " + self.socket.id + " - sendSDIDescription : attemptNumber " + attemptNumber);
                    self.sendSDIDescription(sdiDescription, self, attemptNumber+1);
                }
            } else {
                Logger.debug("SocketId: " + self.socket.id + " - sendSDIDescription : error");
                Logger.error(e.message);
            }
        }
    }

    /**
     * Retrieve Zone instance description and send it to client.
     *
     * @method sendZoneDescription
     * @param {any} zoneDescription - The Zone Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     * @param {number} attemptNumber - The attempt number.
     * /
    sendZoneDescription(zoneDescription : any, self : ClientsNamespaceManager = null, attemptNumber : number = 0) {
        // zoneDescription : {"zoneId" : string}
        if(self == null) {
            self = this;
        }

        Logger.debug("SocketId: " + self.socket.id + " - sendZoneDescription");

        var zoneId = zoneDescription.zoneId;

        try {
            var zone = Zone.read(parseInt(zoneId));
            self.socket.emit("ZoneDescription", zone.toCompleteJSONObject());

            Logger.debug("SocketId: " + self.socket.id + " - sendZoneDescription : send done.");
        } catch(e) {
            if(e.name == "ResponseTimeoutException") {
                if(attemptNumber >= 3) {
                    Logger.debug("SocketId: " + self.socket.id + " - sendZoneDescription : error");
                    Logger.error(e.message);
                } else {
                    Logger.debug("SocketId: " + self.socket.id + " - sendZoneDescription : attemptNumber " + attemptNumber);
                    self.sendZoneDescription(zoneDescription, self, attemptNumber+1);
                }
            } else {
                Logger.debug("SocketId: " + self.socket.id + " - sendZoneDescription : error");
                Logger.error(e.message);
            }
        }
    }

    /**
     * Retrieve Call instance description and send it to client.
     *
     * @method sendCallDescription
     * @param {any} callDescription - The Call Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     * @param {number} attemptNumber - The attempt number.
     * /
    sendCallDescription(callDescription : any, self : ClientsNamespaceManager = null, attemptNumber : number = 0) {
        // callDescription : {"callId" : string}
        if(self == null) {
            self = this;
        }

        Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription");

        var callId = callDescription.callId;

        try {
            var call = Call.read(parseInt(callId));
            self.socket.emit("CallDescription", call.toCompleteJSONObject());

            Logger.debug("SocketId: " + self.socket.id + " - sendCallDescription : send done.");
        } catch(e) {
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
     * Retrieve CallType instance description and send it to client.
     *
     * @method sendCallTypeDescription
     * @param {any} callTypeDescription - The CallType Description
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     * @param {number} attemptNumber - The attempt number.
     * /
    sendCallTypeDescription(callTypeDescription : any, self : ClientsNamespaceManager = null, attemptNumber : number = 0) {
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
    }*/


////////////////////// WITH CALLBACKS ////////////

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

        Profil.read(parseInt(profilId), self.retrieveProfilSuccess, self.retrieveProfilFail);
    }

    /**
     * Retrieve Profil instance success, so send it to client.
     *
     * @method retrieveProfilSuccess
     * @param {Profil} profil - The Profil Description.
     */
    retrieveProfilSuccess(profil : Profil) {
        this.socket.emit("ProfilDescription", profil.toCompleteJSONObject());

        Logger.debug("SocketId: " + this.socket.id + " - sendProfilDescription : send done.");
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
        User.read(parseInt(userId), self.retrieveUserSuccess, self.retrieveUserFail);
    }

    /**
     * Retrieve User instance success, so send it to client.
     *
     * @method retrieveUserSuccess
     * @param {User} user - The User Description.
     */
    retrieveUserSuccess(user : User) {
        this.socket.emit("UserDescription", user.toCompleteJSONObject());

        Logger.debug("SocketId: " + this.socket.id + " - sendUserDescription : send done.");
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
        SDI.read(parseInt(sdiId), self.retrieveSDISuccess, self.retrieveSDIFail);
    }

    /**
     * Retrieve SDI instance success, so send it to client.
     *
     * @method retrieveSDISuccess
     * @param {SDI} sdi - The SDI Description.
     */
    retrieveSDISuccess(sdi : SDI) {
        this.socket.emit("SDIDescription", sdi.toCompleteJSONObject());

        Logger.debug("SocketId: " + this.socket.id + " - sendSDIDescription : send done.");
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

        Zone.read(parseInt(zoneId), self.retrieveZoneSuccess, self.retrieveZoneFail);
    }

    /**
     * Retrieve Zone instance success, so send it to client.
     *
     * @method retrieveZoneSuccess
     * @param {Zone} zone - The Zone Description.
     */
    retrieveZoneSuccess(zone : Zone) {
        this.socket.emit("ZoneDescription", zone.toCompleteJSONObject());

        Logger.debug("SocketId: " + this.socket.id + " - sendZoneDescription : send done.");
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

}