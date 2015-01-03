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
     * Retrieve Profil instance fail, so ...
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

    /**
     * Retrieve User instance description and send it to client.
     *
     * @method sendUserDescription
     * @param {any} userDescription - The User Description.
     * @param {ClientsNamespaceManager} self - The ClientsNamespaceManager instance.
     * @param {number} attemptNumber - The attempt number.
     */
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
     */
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
     */
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
     */
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
     */
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
    }
}