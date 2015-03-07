/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/server/NamespaceManager.ts" />

class AdminsNamespaceManager extends NamespaceManager {

	private paramTypeLength : number;

    /**
     * Constructor.
     *
     * @constructor
     * @param {any} socket - The socket.
     */
    constructor(socket : any) {
        super(socket);

        var self = this;

        //Authentication
        this.addListenerToSocket('RetrieveUserDescriptionFromToken', function(tokenDescription) { self.sendUserDescriptionFromToken(tokenDescription); });
	    this.addListenerToSocket('RetrieveUserDescription', function(description) { self.sendUserDescription(description); });
	    this.addListenerToSocket('RetrieveSDIDescription', function(description) { self.sendSDIDescription(description); });
	    this.addListenerToSocket('RetrieveZoneDescription', function(description) { self.sendZoneDescription(description); });
	    this.addListenerToSocket('RetrieveAllSourceDescription', function() { self.sendAllSourceDescription(); });
	    this.addListenerToSocket('RetrieveAllInfoTypeDescription', function() { self.sendAllInfoTypeDescription(); });
	    this.addListenerToSocket('RetrieveAllParamTypeDescription', function() { self.sendAllParamTypeDescription(); });
	    this.addListenerToSocket('SaveSourceDescription', function(source) { self.saveSourceDescription(source); });
    }

    ////////////////////// Begin: Manage SendUserDescriptionFromToken //////////////////////

    /**
     * Retrieve User instance description from token and send it to client.
     *
     * @method sendUserDescriptionFromToken
     * @param {any} tokenDescription - The Token Description.
     * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
     */
    sendUserDescriptionFromToken(tokenDescription : any, self : AdminsNamespaceManager = null) {
        // tokenDescription : {"token" : string}
        if(self == null) {
            self = this;
        }
        Logger.debug("SocketId: " + self.socket.id + " - sendUserDescriptionFromToken");

        var token = tokenDescription.token;

        Logger.debug("SocketId: " + self.socket.id + " - sendUserDescriptionFromToken : token " + token);

        Logger.debug("SocketId: " + self.socket.id + " - sendUserDescriptionFromToken : retrieveUser");

        User.findOneByToken(token, function(user) { self.retrieveUserFromTokenSuccess(user); }, function(error) { self.retrieveUserFromTokenFail(error, token); });
    }

    /**
     * Retrieve User From Token instance success, so send it to client.
     *
     * @method retrieveUserFromTokenSuccess
     * @param {User} user - The User Description.
     * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
     */
    retrieveUserFromTokenSuccess(user : User, self : AdminsNamespaceManager = null) {
        var self = this;

        self.socket.emit("UserDescriptionFromToken", user.toJSONObject());
    }

    /**
     * Retrieve User From Token instance fail, so send an error.
     *
     * @method retrieveUserFromTokenFail
     * @param {Error} error - The Error reason of fail.
     * @param {string} token - The User Token.
     */
    retrieveUserFromTokenFail(error : Error, token : string) {
        Logger.debug("SocketId: " + this.socket.id + " - sendUserDescriptionFromToken : error");
        Logger.error(JSON.stringify(error));
        //self.socket.emit("UserDescriptionError", ???);
    }

    ////////////////////// End: Manage SendUserDescriptionFromToken //////////////////////

	/**
	 * Retrieve User instance description and send it to client.
	 *
	 * @method sendUserDescription
	 * @param {any} userDescription - The User Description.
	 * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
	 */
	sendUserDescription(userDescription : any, self : AdminsNamespaceManager = null) {
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
	 * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
	 */
	retrieveUserSuccess(user : User, self : AdminsNamespaceManager = null) {
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
	 * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
	 */
	sendSDIDescription(sdiDescription : any, self : AdminsNamespaceManager = null) {
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
	 * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
	 */
	sendZoneDescription(zoneDescription : any, self : AdminsNamespaceManager = null) {
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

////////////////////// Begin: Manage SendAllSourceDescription //////////////////////

	/**
	 * Retrieve all Source instances description and send it to client.
	 *
	 * @method sendAllSourceDescription
	 * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
	 */
	sendAllSourceDescription(self : AdminsNamespaceManager = null) {
		if(self == null) {
			self = this;
		}

		Logger.debug("SocketId: " + self.socket.id + " - sendAllSourceDescription");

		Logger.debug("SocketId: " + self.socket.id + " - sendAllSourceDescription : retrieveAllSource");

		Source.all(function (arraySource) { self.retrieveAllSourceSuccess(arraySource); }, function (error) { self.retrieveAllSourceFail(error); });
	}

	/**
	 * Retrieve all Source instance success, so send it to client.
	 *
	 * @method retrieveAllSourceSuccess
	 * @param {Array} sources - The Sources Description.
	 */
	retrieveAllSourceSuccess(sources : Array<Source>) {
		var self = this;

		var success : Function = function(completeJSONObject) {
			Logger.debug("SocketId: " + self.socket.id + " - sendAllSourceDescription : completeJSON done.");

			self.socket.emit("AllSourceDescription", completeJSONObject);

			Logger.debug("SocketId: " + self.socket.id + " - sendAllSourceDescription : send done.");
		};

		var fail : Function = function(error) {
			Logger.debug("SocketId: " + self.socket.id + " - sendAllSourceDescription : completeJSON fail.");
			Logger.error(JSON.stringify(error));
			//self.socket.emit("ZoneDescriptionError", ???);
		};

		Logger.debug("SocketId: " + self.socket.id + " - sendAllSourceDescription : read all sources : ");
		ModelItf.completeArraySerialization(sources, success, fail);
	}

	/**
	 * Retrieve all Source instance fail, so retry or send an error.
	 *
	 * @method retrieveAllSourceFail
	 * @param {Error} error - The Error reason of fail.
	 * @param {number} attemptNumber - The attempt number.
	 */
	retrieveAllSourceFail(error : Error, attemptNumber : number = 0) {
		if(attemptNumber >= 3) {
			Logger.debug("SocketId: " + this.socket.id + " - sendAllSourceDescription : error");
			Logger.error(JSON.stringify(error));
		} else {
			var self = this;
			Logger.debug("SocketId: " + this.socket.id + " - sendAllSourceDescription : attemptNumber " + attemptNumber);
			Source.all(function (arraySource) { self.retrieveAllSourceSuccess(arraySource); }, function (error) { self.retrieveAllSourceFail(error); }, attemptNumber+1);
		}
	}

////////////////////// End: Manage SendAllSourceDescription //////////////////////

////////////////////// Begin: Manage SendAllInfoTypeDescription //////////////////////

	/**
	 * Retrieve all InfoType instances description and send it to client.
	 *
	 * @method sendAllInfoTypeDescription
	 * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
	 */
	sendAllInfoTypeDescription(self : AdminsNamespaceManager = null) {
		if(self == null) {
			self = this;
		}

		Logger.debug("SocketId: " + self.socket.id + " - sendAllInfoTypeDescription");

		Logger.debug("SocketId: " + self.socket.id + " - sendAllInfoTypeDescription : retrieveAllInfoType");

		InfoType.all(function (arrayInfoType) { self.retrieveAllInfoTypeSuccess(arrayInfoType); }, function (error) { self.retrieveAllInfoTypeFail(error); });
	}

	/**
	 * Retrieve all InfoType instance success, so send it to client.
	 *
	 * @method retrieveAllInfoTypeSuccess
	 * @param {Array} infoTypes - The InfoType Description.
	 */
	retrieveAllInfoTypeSuccess(infoTypes : Array<InfoType>) {
		var self = this;

		var success : Function = function(completeJSONObject) {
			Logger.debug("SocketId: " + self.socket.id + " - sendAllInfoTypeDescription : completeJSON done.");

			self.socket.emit("AllInfoTypeDescription", completeJSONObject);

			Logger.debug("SocketId: " + self.socket.id + " - sendAllInfoTypeDescription : send done.");
		};

		var fail : Function = function(error) {
			Logger.debug("SocketId: " + self.socket.id + " - sendAllInfoTypeDescription : completeJSON fail.");
			Logger.error(JSON.stringify(error));
			//self.socket.emit("ZoneDescriptionError", ???);
		};

		Logger.debug("SocketId: " + self.socket.id + " - sendAllInfoTypeDescription : read all InfoType");
		ModelItf.completeArraySerialization(infoTypes, success, fail);
	}

	/**
	 * Retrieve all InfoType instance fail, so retry or send an error.
	 *
	 * @method retrieveAllInfoTypeFail
	 * @param {Error} error - The Error reason of fail.
	 * @param {number} attemptNumber - The attempt number.
	 */
	retrieveAllInfoTypeFail(error : Error, attemptNumber : number = 0) {
		if(attemptNumber >= 3) {
			Logger.debug("SocketId: " + this.socket.id + " - sendAllInfoTypeDescription : error");
			Logger.error(JSON.stringify(error));
		} else {
			var self = this;
			Logger.debug("SocketId: " + this.socket.id + " - sendAllInfoTypeDescription : attemptNumber " + attemptNumber);
			InfoType.all(function (arrayInfoType) { self.retrieveAllInfoTypeSuccess(arrayInfoType); }, function (error) { self.retrieveAllInfoTypeFail(error); }, attemptNumber+1);
		}
	}

////////////////////// End: Manage SendAllInfoTypeDescription //////////////////////

////////////////////// Begin: Manage SendAllParamTypeDescription //////////////////////

	/**
	 * Retrieve all ParamType instances description and send it to client.
	 *
	 * @method sendAllParamTypeDescription
	 * @param {AdminsNamespaceManager} self - The AdminsNamespaceManager instance.
	 */
	sendAllParamTypeDescription(self : AdminsNamespaceManager = null) {
		if(self == null) {
			self = this;
		}

		Logger.debug("SocketId: " + self.socket.id + " - sendAllParamTypeDescription");

		Logger.debug("SocketId: " + self.socket.id + " - sendAllParamTypeDescription : retrieveAllParamType");

		ParamType.all(function (arrayParamType) { self.retrieveAllParamTypeSuccess(arrayParamType); }, function (error) { self.retrieveAllParamTypeFail(error); });
	}

	/**
	 * Retrieve all ParamType instance success, so send it to client.
	 *
	 * @method retrieveAllParamTypeSuccess
	 * @param {Array} paramTypes - The ParamType Description.
	 */
	retrieveAllParamTypeSuccess(paramTypes : Array<ParamType>) {
		var self = this;

		var success : Function = function(completeJSONObject) {
			Logger.debug("SocketId: " + self.socket.id + " - sendAllParamTypeDescription : completeJSON done.");

			self.socket.emit("AllParamTypeDescription", completeJSONObject);

			Logger.debug("SocketId: " + self.socket.id + " - sendAllParamTypeDescription : send done.");
		};

		var fail : Function = function(error) {
			Logger.debug("SocketId: " + self.socket.id + " - sendAllParamTypeDescription : completeJSON fail.");
			Logger.error(JSON.stringify(error));
			//self.socket.emit("ZoneDescriptionError", ???);
		};

		Logger.debug("SocketId: " + self.socket.id + " - sendAllParamTypeDescription : read all InfoType : ");
		ModelItf.completeArraySerialization(paramTypes, success, fail);
	}

	/**
	 * Retrieve all ParamType instance fail, so retry or send an error.
	 *
	 * @method retrieveAllParamTypeFail
	 * @param {Error} error - The Error reason of fail.
	 * @param {number} attemptNumber - The attempt number.
	 */
	retrieveAllParamTypeFail(error : Error, attemptNumber : number = 0) {
		if(attemptNumber >= 3) {
			Logger.debug("SocketId: " + this.socket.id + " - sendAllParamTypeDescription : error");
			Logger.error(JSON.stringify(error));
		} else {
			var self = this;
			Logger.debug("SocketId: " + this.socket.id + " - sendAllParamTypeDescription : attemptNumber " + attemptNumber);
			ParamType.all(function (arrayParamType) { self.retrieveAllParamTypeSuccess(arrayParamType); }, function (error) { self.retrieveAllParamTypeFail(error); }, attemptNumber+1);
		}
	}

////////////////////// End: Manage sendAllParamTypeDescription //////////////////////

////////////////////// Begin: Manage saveSourceDescription //////////////////////

	saveSourceDescription(sourceInfo : any) {
		var self = this;
		Logger.debug("SocketId: " + this.socket.id + " - saveSourceDescription");
		Logger.debug("SocketId: " + this.socket.id + " - saveSourceDescription - JSON : "+JSON.stringify(sourceInfo));

		var source : Source = new Source(sourceInfo.name, sourceInfo.service, sourceInfo.description, sourceInfo.host, sourceInfo.port);

		source.create(function () { self.createSourceCallbackSuccess(sourceInfo, source); }, function (error) { self.createSourceCallbackFail(error); })
	}

	createSourceCallbackSuccess(sourceInfo : any, source : Source) {
		var self = this;
		if (!!sourceInfo.infoType) {
			Logger.debug("SocketId: " + this.socket.id + " - saveSourceDescription - save infotype : "+sourceInfo.infoType);
			Logger.debug("SocketId: " + this.socket.id + " - saveSourceDescription - save infotype - source : "+JSON.stringify(source));
			var infoTypeId : string = sourceInfo.infoType;
			InfoType.read(parseInt(infoTypeId), function(infoType) { self.associateInfoTypeAndSource(source, infoType, sourceInfo); }, function(error) { self.createSourceCallbackFail(error); });
		} else {
			self.createSourceCallbackFail(new DataException("A source must have a type info."));
		}
	}

	associateInfoTypeAndSource(source: Source, infoType : InfoType, sourceInfo: any) {
		var self = this;

		Logger.debug("SocketId: " + this.socket.id + " - saveSourceDescription - association infotype and source");
		source.setInfoType(infoType, function () { self.checkParamTypesOrSuccess(source, sourceInfo); }, function (error) { self.createSourceCallbackFail(error); });
	}

	checkParamTypesOrSuccess(source : Source, sourceInfo : any) {
		var self = this;
		if (!!!sourceInfo.paramType) {
			Logger.debug("SocketId: " + this.socket.id + " - saveSourceDescription - No param types return success");
			self.socket.emit("sourceSaved", {"status": "success", "msg": source.toJSONObject()});
		} else {
			if (!!sourceInfo.paramType && sourceInfo.paramType.length > 0) {
				self.paramTypeLength = sourceInfo.paramType.length;

				for (var i = 0;i < sourceInfo.paramType.length; i++)
				{
					Logger.debug("SocketId: " + this.socket.id + " - saveSourceDescription - Iterate on param types return success");
					var paramTypeId : string = sourceInfo.paramType[i];

					ParamType.read(parseInt(paramTypeId), function (paramType) { self.associateParamTypeAndSource(paramType, source); }, function (error) { self.createSourceCallbackFail(error); });
				}
			} else {
				self.createSourceCallbackFail(new DataException("ParamTypes must be an array !"));
			}
		}
	}

	associateParamTypeAndSource(paramType : ParamType, source : Source) {
		var self = this;
		source.addParamType(paramType, function () { self.successLinkParamType(source); } , function (error) { self.createSourceCallbackFail(error); });
	}

	successLinkParamType(source : Source) {
		var self = this;
		this.paramTypeLength--;

		if (this.paramTypeLength == 0) {
			self.socket.emit("sourceSaved", {"status": "success", "msg": source.toJSONObject()});
		}
	}

	createSourceCallbackFail(error : Error, attemptNumber : number = 0) {
		this.socket.emit("sourceSaved", {'status': 'error', 'msg': error});
	}

////////////////////// End: Manage saveSourceDescription //////////////////////

}