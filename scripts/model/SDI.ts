/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Team.ts" />
/// <reference path="./Zone.ts" />
/// <reference path="./Profil.ts" />
/// <reference path="./ThemeSDI.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : SDI
 *
 * @class SDI
 * @extends ModelItf
 */
class SDI extends ModelItf {

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
     * AllowedHost property.
     *
     * @property _allowedHost
     * @type string
     */
    private _allowedHost : string;

    /**
     * Zones property.
     *
     * @property _zones
     * @type Array<Zone>
     */
    private _zones : Array<Zone>;

    /**
     * Lazy loading for Zones property.
     *
     * @property _zones_loaded
     * @type boolean
     */
    private _zones_loaded : boolean;

    /**
     * Profils property.
     *
     * @property _profils
     * @type Array<Profil>
     */
    private _profils : Array<Profil>;

    /**
     * Lazy loading for Profils property.
     *
     * @property _profils_loaded
     * @type boolean
     */
    private _profils_loaded : boolean;

    /**
     * Theme property.
     *
     * @property _theme
     * @type ThemeSDI
     */
    private _theme : ThemeSDI;

    /**
     * Lazy loading for the Theme property
     *
     * @property _theme_loaded
     * @type boolean
     */
    private _theme_loaded : boolean;

    /**
     * @property _team : The team who manages this SDI
     * @type Team
     * @private
     */
    private _team : Team;

    /**
     * @property _team_loaded : lazy loading for team property
     * @type boolean
     * @private
     */
    private _team_loaded : boolean;

    /**
     * Origine SDI information if cloned
     *
     * @property _origineSDI
     * @type SDI
     */
    private _origineSDI : SDI;

    /**
     * Lazy loading for origineSDI property
     *
     * @property _origineSDI_loaded
     * @type boolean
     */
    private _origineSDI_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - the SDI's name.
     * @param {string} description - The SDI's description.
     * @param {string} allowedHost - The SDI's allowedHost.
     * @param {number} id - The SDI's ID.
	 * @param {string} createdAt - The SDI's createdAt.
	 * @param {string} updatedAt - The SDI's updatedAt.
     */
    constructor(name : string = "", description : string = "", allowedHost : string = "*", id : number = null, complete: boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

        this.setName(name);
	    this.setDescription(description);
	    this.setAllowedHost(allowedHost);

        this._zones = new Array<Zone>();
        this._zones_loaded = false;

        this._profils = new Array<Profil>();
        this._profils_loaded = false;

        this._theme = null;
        this._theme_loaded = false;

        this._team = null;
        this._team_loaded = false;

        this._origineSDI = null;
        this._origineSDI_loaded = false;
    }

	/**
	 * Set the SDI's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

	/**
	 * Set the SDI's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string) {
		this._description = description;
	}

	/**
	 * Set the SDI's allowedHost.
	 *
	 * @method setAllowedHost
	 */
	setAllowedHost(allowedHost : string) {
		this._allowedHost = allowedHost;
	}

	/**
	 * Return the SDI's name.
     *
     * @method name
	 */
	name() {
		return this._name;
	}

    /**
     * Return the SDI's description.
     *
     * @method description
     */
    description() {
        return this._description;
    }

    /**
     * Return the SDI's allowedHost.
     *
     * @method allowedHost
     */
    allowedHost() {
        return this._allowedHost;
    }

    /**
     * Return the zones
     *
     * @method zones
     */
    zones() {
        return this._zones;
    }

    /**
     * Load the SDI's zones.
     *
     * @method loadZones
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadZones(successCallback : Function, failCallback : Function) {
        if(! this._zones_loaded) {
            var self = this;
            var success : Function = function(zones) {
                self._zones = zones;
                self._zones_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getAssociatedObjects(SDI, Zone, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

    /**
     * Return the SDI's profils.
     *
     * @method profils
     */
    profils() {
        return this._profils;
    }

    /**
     * Load the SDI's profils.
     *
     * @method loadProfils
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadProfils(successCallback : Function, failCallback : Function) {
        if(! this._profils_loaded) {
            var self = this;
            var success : Function = function(profils) {
                self._profils = profils;
                self._profils_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getAssociatedObjects(SDI, Profil, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

    /**
     * Return the SDI's theme.
     *
     * @method theme
     */
    theme() {
        return this._theme;
    }

    /**
     * Load the SDI's theme.
     *
     * @method loadTheme
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadTheme(successCallback : Function, failCallback : Function) {
        if(! this._theme_loaded) {
            var self = this;
            var success : Function = function(theme) {
                self._theme = theme;
                self._theme_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(SDI, ThemeSDI, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

    /**
     * Return the SDI team
     * @method team
     * @returns {Team}
     */
    team() {
        return this._team;
    }

    /**
     * Load the SDI's team
     *
     * @method loadTeam
     * @param successCallback
     * @param failCallback
     */
    loadTeam(successCallback : Function, failCallback : Function) {
        if (!this._team_loaded) {
            var self = this;
            var success = function (team) {
                self._team = team;
                self._team_loaded = true;

                successCallback();
            };

            var fail = function (error) {
                failCallback(error);
            };

            this.getUniquelyAssociatedObject(SDI, Team, success, fail);
        } else {
            successCallback();
        }
    }

    /**
     * Return the original SDI element
     *
     * @method origineSDI
     * @returns {SDI}
     */
    origineSDI() {
        return this._origineSDI;
    }

    loadOrigineSDI(successCallback : Function, failCallback : Function) {
        if (!this._origineSDI_loaded) {
            var self = this;

            var successLoad : Function = function(origineSDI) {
                self._origineSDI = origineSDI;
                self._origineSDI_loaded = true;

                if (successCallback != null){
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(SDI, SDI, successLoad, fail);
        } else {
            if (successCallback != null) {
                successCallback();
            }
        }
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

    /**
     * Load all the lazy loading properties of the object except statuses.
     * Useful when you want to get a complete object.
     *
     * @method loadAssociations
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadAssociations(successCallback : Function, failCallback : Function) {
        var self = this;

        var success : Function = function(models) {
            if(self._profils_loaded && self._zones_loaded && self._theme_loaded && self._team_loaded) {
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

        this.loadProfils(success, fail);
        this.loadZones(success, fail);
        this.loadTheme(success, fail);
        this.loadTeam(success, fail);
    }

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._profils_loaded = false;
		this._zones_loaded = false;
        this._theme_loaded = false;
        this._team_loaded = false;
        this._origineSDI_loaded = false;
	}

	/**
	 * Return a SDI instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"description": this.description(),
			"allowedHost": this.allowedHost(),
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
		};
		return data;
	}

	/**
	 * Check completeness of a SDI.
	 * The completeness is determined by the presence of a name and an id.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) : void {
		var self = this;

		var successCheckSuper : Function = function () {
            if (self.isComplete() && !!self.name()) {
                var successLoadAsso = function () {
                    if (self._profils_loaded && self._team_loaded && self._theme_loaded && self._zones_loaded) {
                        for (var i = 0; i < self.profils().length; i++) {
                            var profil : Profil = self.profils()[i];
                            self._complete = self._complete && (!!profil && profil.isComplete());
                        }

                        for (var i = 0; i < self.zones().length; i++) {
                            var zone : Zone = self.zones()[i];
                            self._complete = self._complete && (!!zone && zone.isComplete());
                        }

                        self._complete = self._complete && (!!self.team() && self.team().isComplete()) && (!!self.theme() && self.theme().isComplete());
                        successCallback();
                    }
                };

                if (!self._profils_loaded || !self._team_loaded || !self._zones_loaded || !self._theme_loaded) {
                    self.loadAssociations(successLoadAsso, failCallback);
                } else {
                    successLoadAsso();
                }
            } else {
                self._complete = false;
                successCallback();
            }
		};
		super.checkCompleteness(successCheckSuper, failCallback);
	}

    /**
     * Return a SDI instance as a JSON Object including associated object.
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

            if (onlyId) {
                data["theme"] = (self.theme() !== null) ? self.theme().getId() : null;
                data["team"] = (self.team() !== null) ? self.team().getId() : null;
            } else {
                data["theme"] = (self.theme() !== null) ? self.theme().toJSONObject() : null;
                data["team"] = (self.team() !== null) ? self.team().toJSONObject() : null;
            }

            data["profils"] = self.serializeArray(self.profils(), onlyId);
            data["zones"] = self.serializeArray(self.zones(), onlyId);

            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

	/**
	 * Add a new Zone to the SDI and associate it in the database.
	 * A Zone can only be added once.
	 *
     * @method addZone
	 * @param {Zone} z The Zone to add inside the SDI. It cannot be a null value.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	addZone(zoneID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(SDI, Zone, zoneID, successCallback, failCallback);
	}

	/**
	 * Remove a Zone from the SDI: the association is removed both in the object and in database.
	 * The Zone can only be removed if it exists first in the list of associated Zones, else an exception is thrown.
	 *
     * @method removeZone
	 * @param {Zone} z The Zone to remove from that SDI
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	removeZone(zoneID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(SDI, Zone, zoneID, successCallback, failCallback);
	}

	/**
	 * Add a new Profil to the SDI and associate it in the database.
	 * A Profil can only be added once.
	 *
     * @method addProfil
	 * @param {Profil} p The Profil to add inside the SDI. It cannot be a null value.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	addProfil(profilID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(SDI, Profil, profilID, successCallback, failCallback);
	}

	/**
	 * Remove a Profil from the SDI: the association is removed both in the object and in database.
	 * The Profil can only be removed if it exists first in the list of associated Profils, else an exception is thrown.
	 *
     * @method removeProfil
	 * @param {Profil} p The Profil to remove from that SDI
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	removeProfil(profilID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(SDI, Profil, profilID, successCallback, failCallback);
	}

    /**
     * Set the Theme of the SDI.
     *
     * @method linkTheme
     * @param {ThemeSDI} it The Theme to associate with the SDI.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    linkTheme(themeSDIID : number, successCallback : Function, failCallback : Function) {
        this.associateObject(SDI, ThemeSDI, themeSDIID, successCallback, failCallback);
    }

    /**
     * Unset the current Theme from the SDI.
     *
     * @method unlinkTheme
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    unlinkTheme(themeSDIID : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(SDI, ThemeSDI, themeSDIID, successCallback, failCallback);
    }

    /**
     * Set the Team of the SDI.
     *
     * @method linkTeam
     * @param {number} teamID The id of the team  to associate with the SDI.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    linkTeam(teamID : number, successCallback : Function, failCallback : Function) {
        this.associateObject(SDI, Team, teamID, successCallback, failCallback);
    }

    /**
     * Unset the current Team from the SDI.
     *
     * @method unlinkTeam
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    unlinkTeam(teamID : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(SDI, Team, teamID, successCallback, failCallback);
    }

    /**
     * Set the origineSDI of the current SDI
     *
     * @param origineSDIID
     * @param successCallback
     * @param failCallback
     */
    linkOrigineSDI(origineSDIID : number, successCallback : Function, failCallback : Function) {
        this.associateObject(SDI, SDI, origineSDIID, successCallback, failCallback);
    }

    /**
     * Unset the origineSDI for the current SDI
     *
     * @param origineSDIID
     * @param successCallback
     * @param failCallback
     */
    unlinkOrigineSDI(origineSDIID : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(SDI, SDI, origineSDIID, successCallback, failCallback);
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
        this.createObject(SDI, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(SDI, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(SDI, this.toJSONObject(), successCallback, failCallback, attemptNumber);
    }

    /**
     * Delete the SDI and all associated zone.
     * You cannot delete a SDI containing at least one profil.
     *
     * @method delete
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    delete(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {

        var self = this;

        var successLoadAsso = function () {
            if (self.profils().length > 0) {
                failCallback("You cannot a SDI containing some profiles.");
            } else {

                var finalSuccess = function () {
                    ModelItf.deleteObject(SDI, self.getId(), successCallback, failCallback, attemptNumber);
                };

                var nbZone = self.zones().length;

                var successDeleteZone = function () {
                    nbZone--;

                    if (nbZone == 0) {
                        finalSuccess();
                    }
                };

                if (nbZone > 0) {
                    self.zones().forEach(function (zone : Zone) {
                        zone.delete(successDeleteZone, failCallback);
                    });
                } else {
                    finalSuccess();
                }
            }
        };

        self.loadAssociations(successLoadAsso, failCallback);
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
        return this.allObjects(SDI, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return a SDI instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {SDI} The model instance.
	 */
	static parseJSON(jsonString : string) : SDI {
		return SDI.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a SDI instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {SDI} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : SDI {
		return new SDI(jsonObject.name, jsonObject.description, jsonObject.allowedHost, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
	}

    /**
     * Clone the SDI creating new clone for every element contained inside the SDI.
     * @param modelClass
     * @param successCallback
     * @param failCallback
     */
    clone(cloneProfil : boolean, successCallback : Function, failCallback : Function) {

        var self = this;

        var successCloneSDI = function (clonedSDI : SDI) {
            Logger.debug("Success clone SDI for SDI : "+self.getId());

            var successRenameSDI = function () {
                Logger.debug("Success rename SDI");
                var successLinkOrigineSDI = function () {
                    Logger.debug("Success link SDI with origine");
                    clonedSDI._origineSDI = self;
                    clonedSDI._origineSDI_loaded = true;

                    var isComplete = clonedSDI.isComplete();

                    var successLoadAsso = function () {
                        Logger.debug("Success load asso for SDI");

                        var successLinkThemeSDI = function () {
                            Logger.debug("Success link theme SDI");

                            var successLinkTeam = function () {
                                Logger.debug("Success link team");

                                var zoneSize = self.zones().length;
                                var counterZones = 0;

                                var profilInfo = {
                                    "SDI": clonedSDI.getId(),
                                    "ZoneContents": {},
                                    "Calls": {}
                                };

                                var successCloneZone = function (clonedZone:Zone) {
                                    Logger.debug("Success clone zone ");

                                    var successLoadOrigineZone = function () {
                                        Logger.debug("Success clone zone ");

                                        var successLoadZAsso = function () {
                                            Logger.debug("Success load zone asso");

                                            var successLoadCT = function () {
                                                Logger.debug("Success load CT ");

                                                var successLoadOrigineCT = function () {
                                                    var successLoadCall = function () {

                                                        var successAssoZone = function () {
                                                            counterZones++;

                                                            if (counterZones >= zoneSize) {

                                                                var profilSize = self.profils().length;
                                                                var counterProfil = 0;

                                                                var successCheckComplete = function () {
                                                                    var finalSuccess = function () {
                                                                        successCallback(clonedSDI);
                                                                    };

                                                                    if (clonedSDI.isComplete() != isComplete) {
                                                                        clonedZone.update(finalSuccess, failCallback);
                                                                    } else {
                                                                        finalSuccess();
                                                                    }
                                                                };

                                                                var successCloneProfil = function (clonedProfil:Profil) {

                                                                    var successAssoProfil = function () {
                                                                        counterProfil++;

                                                                        if (counterProfil >= profilSize) {
                                                                            clonedSDI.desynchronize();
                                                                            clonedSDI.checkCompleteness(successCheckComplete, failCallback);
                                                                        }
                                                                    };

                                                                    clonedSDI.addProfil(clonedProfil.getId(), successAssoProfil, failCallback);
                                                                };

                                                                if (profilSize > 0 && cloneProfil) {
                                                                    Logger.debug("Profil info : " + JSON.stringify(profilInfo));
                                                                    self.profils().forEach(function (profil:Profil) {
                                                                        profil.clone(successCloneProfil, failCallback, profilInfo);
                                                                    });
                                                                } else {
                                                                    clonedSDI.desynchronize();
                                                                    clonedSDI.checkCompleteness(successCheckComplete, failCallback);
                                                                }
                                                            }
                                                        };

                                                        counterCTCall++;

                                                        if (counterCTCall >= nbCTs) {
                                                            for (var i = 0; i < nbCTs; i++) {
                                                                var callType = clonedZone.callTypes()[i];
                                                                var callTypeOrigine = callType.origineCallType();

                                                                for (var j = 0; j < callTypeOrigine.calls().length; j++) {
                                                                    var call = callTypeOrigine.calls()[j];
                                                                    profilInfo["Calls"][call.getId()] = callType.getId();
                                                                }
                                                            }
                                                            clonedSDI.addZone(clonedZone.getId(), successAssoZone, failCallback);
                                                        }

                                                    };

                                                    counterCTs++;
                                                    var counterCTCall = 0;

                                                    if (nbCTs == 0) {
                                                        successLoadCall();
                                                    } else {
                                                        if (counterCTs >= nbCTs) {
                                                            for (var i = 0; i < nbCTs; i++) {
                                                                var callType = clonedZone.callTypes()[i];
                                                                var callTypeOrigine = callType.origineCallType();

                                                                Logger.debug("Obtained callType : " + callType.getId());
                                                                Logger.debug("Obtained origine : " + JSON.stringify(callTypeOrigine));

                                                                callTypeOrigine.loadCalls(successLoadCall, failCallback);
                                                            }
                                                        }
                                                    }


                                                };

                                                for (var i = 0; i < clonedZone.origineZone().zoneContents().length; i++) {
                                                    var zoneContent = clonedZone.origineZone().zoneContents()[i];

                                                    profilInfo["ZoneContents"][zoneContent.getId()] = clonedZone.getId();
                                                }

                                                var nbCTs = clonedZone.callTypes().length;
                                                var counterCTs = 0;

                                                Logger.debug("NBCTS : " + nbCTs);

                                                if (nbCTs == 0) {
                                                    successLoadOrigineCT();
                                                } else {
                                                    for (var i = 0; i < nbCTs; i++) {
                                                        Logger.debug("Loop loadOrigine :" + i);
                                                        var ct = clonedZone.callTypes()[i];
                                                        Logger.debug("Clone : load origine for callType : " + ct.getId());
                                                        ct.loadOrigineCallType(successLoadOrigineCT, failCallback);
                                                    }
                                                }
                                            };

                                            clonedZone.desynchronize();
                                            clonedZone.loadCallTypes(successLoadCT, failCallback);
                                        };

                                        clonedZone.origineZone().desynchronize();
                                        clonedZone.origineZone().loadAssociations(successLoadZAsso, failCallback);
                                    };

                                    clonedZone.loadOrigineZone(successLoadOrigineZone, failCallback);
                                };

                                self.zones().forEach(function (zone:Zone) {
                                    zone.clone(successCloneZone, failCallback);
                                });
                            };

                            if (self.team() != null) {
                                clonedSDI.linkTeam(self.team().getId(), successLinkTeam, failCallback);
                            } else {
                                successLinkTeam();
                            }

                        };

                        if (self.theme() != null) {
                            clonedSDI.linkTheme(self.theme().getId(), successLinkThemeSDI, failCallback);
                        } else {
                            successLinkThemeSDI();
                        }
                    };

                    self.loadAssociations(successLoadAsso, failCallback);
                };

                clonedSDI.linkOrigineSDI(self.getId(), successLinkOrigineSDI, failCallback);
            };

            clonedSDI.setName(self.name()+"clone");
            clonedSDI.update(successRenameSDI, failCallback);
        };

        super.cloneObject(SDI, successCloneSDI, failCallback);
    }

	/**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "SDIs";
    }


}