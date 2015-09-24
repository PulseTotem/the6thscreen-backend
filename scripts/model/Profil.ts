/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Call.ts" />
/// <reference path="./ZoneContent.ts" />
/// <reference path="./SDI.ts" />
/// <reference path="./AuthorizedClient.ts" />
/// <reference path="./Client.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : Profil
 *
 * @class Profil
 * @extends ModelItf
 */
class Profil extends ModelItf {

    /**
     * Name property.
     *
     * @property _name
     * @type string
     */
    private _name : string;

    /**
     * Description property.
     *
     * @property _description
     * @type string
     */
    private _description : string;

    /**
     * ZoneContents property.
     *
     * @property _zoneContents
     * @type Array<ZoneContent>
     */
    private _zoneContents : Array<ZoneContent>;

    /**
     * Lazy loading for ZoneContents property.
     *
     * @property _zoneContents_loaded
     * @type boolean
     */
    private _zoneContents_loaded : boolean;

    /**
     * SDI Property
     *
     * @property _sdi
     * @type SDI
     */
    private _sdi : SDI;

    /**
     * Lazy loading for SDI property
     *
     * @property _sdi_loaded
     * @type boolean
     */
    private _sdi_loaded : boolean;

	/**
	 * AuthorizedClients property.
	 *
	 * @property _authorizedClients
	 * @type Array<AuthorizedClient>
	 */
	private _authorizedClients : Array<AuthorizedClient>;

	/**
	 * Lazy loading for authorizedClients property.
	 *
	 * @property _authorizedClients_loaded
	 * @type boolean
	 */
	private _authorizedClients_loaded : boolean;

	/**
	 * ConnectedClients property
	 *
	 * @property _connectedClients
	 * @type Array<Client>
	 */
	private _connectedClients : Array<Client>;

	/**
	 * Lazy loading for connectedClients property
	 *
	 * @property _connectedClients_loaded
	 * @type boolean
	 */
	private _connectedClients_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Profil's name.
     * @param {string} description - The Profil's description.
     * @param {number} id - The Profil's ID.
	 * @param {string} createdAt - The Profil's createdAt.
	 * @param {string} updatedAt - The Profil's updatedAt.
     */
    constructor(name : string = "", description : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

        this.setName(name);
        this.setDescription(description);

        this._zoneContents = new Array<ZoneContent>();
        this._zoneContents_loaded = false;

	    this._sdi = null;
	    this._sdi_loaded = false;

	    this._authorizedClients = new Array<AuthorizedClient>();
	    this._authorizedClients_loaded = false;

	    this._connectedClients = new Array<Client>();
	    this._connectedClients_loaded = false;
    }

    /**
     * Return the Profil's name.
     *
     * @method name
     * @return {string} The Profil's name.
     */
    name() {
        return this._name;
    }

    /**
     * Set the Profil's name.
     *
     * @method setName
     */
    setName(name : string) {
        this._name = name;
    }

    /**
     * Return the Profil's description.
     *
     * @method description
     * @return {string} The Profil's description.
     */
    description() : string {
        return this._description;
    }

    /**
     * Set the Profil's description.
     *
     * @method setDescription
     */
    setDescription(description : string) {
        this._description = description;
    }

    /**
     * Return the Profil's zoneContents.
     *
     * @method zoneContents
     * @return {Array<ZoneContent>} The Profil's zoneContents.
     */
    zoneContents() : Array<ZoneContent> {
        return this._zoneContents;
    }

    /**
     * Load the Profil's zoneContents.
     *
     * @method loadZoneContents
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadZoneContents(successCallback : Function, failCallback : Function) {
        if(! this._zoneContents_loaded) {
            var self = this;
            var success : Function = function(zoneContents) {
                self._zoneContents = zoneContents;
                self._zoneContents_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getAssociatedObjects(Profil, ZoneContent, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

	/**
	 * Return the Profil's sdi.
	 *
	 * @method sdi
	 */
	sdi() {
		return this._sdi;
	}

	/**
	 * Load the Profil's sdi.
	 *
	 * @method loadSDI
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadSDI(successCallback : Function, failCallback : Function) {
		if(! this._sdi_loaded) {
			var self = this;
			var success : Function = function(sdi) {
				if(!!sdi) {
					self._sdi = sdi;
				}
				self._sdi_loaded = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getUniquelyAssociatedObject(Profil, SDI, success, fail);
		} else {
			if(successCallback != null) {
				successCallback();
			}
		}
	}

	/**
	 * Return the Profil's authorizedClients.
	 *
	 * @method authorizedClients
	 * @return {Array<AuthorizedClient>} The Profil's authorizedClients.
	 */
	authorizedClients() : Array<AuthorizedClient> {
		return this._authorizedClients;
	}

	/**
	 * Load the Profil's authorizedClients.
	 *
	 * @method loadAuthorizedClients
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadAuthorizedClients(successCallback : Function, failCallback : Function) {
		if(! this._authorizedClients_loaded) {
			var self = this;
			var success : Function = function(authorizedClients) {
				self._authorizedClients = authorizedClients;
				self._authorizedClients_loaded = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getAssociatedObjects(Profil, AuthorizedClient, success, fail);
		} else {
			if(successCallback != null) {
				successCallback();
			}
		}
	}

	/**
	 * Return the Profil's connectedClients.
	 *
	 * @method connectedClients
	 * @return {Array<Client>} The Profil's connectedClients.
	 */
	connectedClients() : Array<Client> {
		return this._connectedClients;
	}

	/**
	 * Load the Profil's connectedClients.
	 *
	 * @method loadConnectedClients
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadConnectedClients(successCallback : Function, failCallback : Function) {
		if(! this._connectedClients_loaded) {
			var self = this;
			var success : Function = function(connectedClients) {
				self._connectedClients = connectedClients;
				self._connectedClients_loaded = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getAssociatedObjects(Profil, Client, success, fail);
		} else {
			if(successCallback != null) {
				successCallback();
			}
		}
	}

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Load all the lazy loading properties of the object except statuses
	 * Useful when you want to get a complete object.
     *
     * @method loadAssociations
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	loadAssociations(successCallback : Function, failCallback : Function) {
        var self = this;

        var success : Function = function(models) {
            if(self._zoneContents_loaded && self._sdi_loaded) {
                if (successCallback != null) {
                    successCallback();
                } // else //Nothing to do ?
            }
        };

        var fail : Function = function(error) {
            if(failCallback != null) {
                failCallback(error);
            } else {
                Logger.error(JSON.stringify(error));
            }
        };

        this.loadZoneContents(success, fail);
		this.loadSDI(success, fail);
	}

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._zoneContents_loaded = false;
		this._sdi_loaded = false;
	}

	/**
	 * Return a Profil instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"description": this.description(),
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
		};
		return data;
	}

	/**
	 * Check completeness of a Profil.
	 * The completeness is determined by the presence of a name and an id.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) : void {
		var self = this;

		var success : Function = function () {
			if (self.isComplete() && !!self.name()) {
				var fail:Function = function (error) {
					failCallback(error);
				};

				var success:Function = function () {
					if (self._zoneContents_loaded && self._sdi_loaded ) {
						self._complete = self.isComplete() && self.sdi() != null;

						var successSDILoadZones:Function = function () {
							self._complete = self.isComplete() && self.sdi().zones().length == self.zoneContents().length;
							successCallback();
						}

						if(self.isComplete()) {
							self.sdi().loadZones(successSDILoadZones, fail);
						} else {
							successCallback();
						}
					}
				};



				self.loadZoneContents(success, fail);
				self.loadSDI(success, fail);
			} else {
				self._complete = false;
				successCallback();
			}
		};
		super.checkCompleteness(success, failCallback);

	}

    /**
     * Return a Profil instance as a JSON Object including associated object.
     * However the method should not be recursive due to cycle in the model.
     *
     * @method toCompleteJSONObject
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    toCompleteJSONObject(successCallback : Function, failCallback : Function, onlyId : boolean = false) {
        var self = this;

        var success : Function = function() {
            var data = self.toJSONObject();
            data["zoneContents"] = self.serializeArray(self.zoneContents(), onlyId);
            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

	/**
	 * Add a new ZoneContent to the Profil and associate it in the database.
	 * A ZoneContent can only be added once.
	 *
     * @method addCall
	 * @param {Call} c The ZoneContent to add inside the Profil. It cannot be a null value.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	addZoneContent(zoneContentID : number, successCallback : Function, failCallback : Function) {
		var successReadZC = function (zc : ZoneContent) {
			if (zc.isComplete()) {
				this.associateObject(Profil, ZoneContent, zoneContentID, successCallback, failCallback);
			} else {
				var successCheckCompleteness = function () {
					this.associateObject(Profil, ZoneContent, zoneContentID, successCallback, failCallback);
				};

				zc.checkCompleteness(successCheckCompleteness, failCallback);
			}
		};

		ZoneContent.read(zoneContentID, successReadZC, failCallback);

	}

	/**
	 * Remove a ZoneContent from the Profil: the association is removed both in the object and in database.
	 * The ZoneContent can only be removed if it exists first in the list of associated ZoneContents, else an exception is thrown.
	 *
     * @method removeCall
     * @param {Call} c The ZoneContent to remove from that Profil
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	removeZoneContent(zoneContentID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(Profil, ZoneContent, zoneContentID, successCallback, failCallback);
	}


	/**
	 * Set the SDI of the Profil.
	 *
	 * @method linkSDI
	 * @param {number} sdiId - The SDI's Id to associate with the Profil.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	linkSDI(sdiId : number, successCallback : Function, failCallback : Function) {
		this.associateObject(Profil, SDI, sdiId, successCallback, failCallback);
	}

	/**
	 * Unset the current SDI from the Profil.
	 * It both sets a null value for the object property and remove the association in database.
	 * A SDI must have been set before using it, else an exception is thrown.
	 *
	 * @method unlinkSDI
	 * @param {number} sdiId - The SDI's Id to unset from the Profil.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkSDI(sdiId : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(Profil, SDI, sdiId, successCallback, failCallback);
	}

    /**
     * Create model in database.
     *
     * @method create
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    create(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        this.createObject(Profil, this.toJSONObject(), successCallback, failCallback);
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    static read(id : number, successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        ModelItf.readObject(Profil, id, successCallback, failCallback, attemptNumber);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    update(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        return this.updateObject(Profil, this.toJSONObject(), successCallback, failCallback, attemptNumber);
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    delete(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        var self = this;

		var fail : Function = function(error) {
			failCallback(error);
		};

		var successLoadZoneContents = function() {
			if(self.zoneContents().length > 0) {
				var zoneContentsUnlinkNumber = 0;
				var zoneContentsNumber = self.zoneContents().length;

				self.zoneContents().forEach(function(zoneContent : ZoneContent) {
					 var successUnlink = function() {
						 zoneContentsUnlinkNumber++;

						 if(zoneContentsUnlinkNumber == zoneContentsNumber) {
							 ModelItf.deleteObject(Profil, self.getId(), successCallback, failCallback, attemptNumber);
						 }
					 };

					self.removeZoneContent(zoneContent.getId(), successUnlink, fail);
				});
			} else {
				ModelItf.deleteObject(Profil, self.getId(), successCallback, failCallback, attemptNumber);
			}
		};

		this.loadZoneContents(successLoadZoneContents, fail);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    static all(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        return this.allObjects(Profil, successCallback, failCallback, attemptNumber);
    }

    /**
     * Return a Profil instance from a JSON string.
     *
     * @method parseJSON
     * @static
     * @param {string} json - The JSON string
     * @return {Profil} The model instance.
     */
    static parseJSON(jsonString : string) : Profil {
        return Profil.fromJSONObject(JSON.parse(jsonString));
    }

    /**
     * Return a Profil instance from a JSON Object.
     *
     * @method fromJSONObject
     * @static
     * @param {JSONObject} json - The JSON Object
     * @return {Profil} The model instance.
     */
    static fromJSONObject(jsonObject : any) : Profil {
	    return new Profil(jsonObject.name, jsonObject.description, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
    }

	/**
	 * Clone a profil: it clones profil information, keeping the same SDI, and cloning ZoneContents.
	 * However it does not keep information on AuthorizedClient or Clients.
	 * @param modelClass
	 * @param successCallback
	 * @param failCallback
	 */
	cloneObject(modelClass : any, successCallback : Function, failCallback : Function) {

		var self = this;

		var successCloneProfil = function (clonedProfil : Profil) {

			var successLoad = function () {
				Logger.debug("Obtained clonedProfil :"+JSON.stringify(clonedProfil));
				var successAssociateSDI = function () {
					var nbZoneContents = self.zoneContents().length;

					var counterClonedZC = 0;

					var successCloneZoneContent = function (clonedZC : ZoneContent) {
						var successAssociateZoneContent = function () {
							counterClonedZC++;

							if (counterClonedZC == nbZoneContents) {
								successCallback(clonedProfil);
							}
						};

						clonedProfil.addZoneContent(clonedZC.getId(), successAssociateZoneContent, failCallback);
					};

					self.zoneContents().forEach(function (zoneContent : ZoneContent) {
						zoneContent.cloneObject(ZoneContent, successCloneZoneContent, failCallback);
					});
				};

				clonedProfil.linkSDI(self.sdi().getId(), successAssociateSDI, failCallback);
			};

			self.loadAssociations(successLoad, failCallback);
		};

		super.cloneObject(Profil, successCloneProfil, failCallback);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Profils";
    }
}