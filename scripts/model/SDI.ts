/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./User.ts" />
/// <reference path="./Zone.ts" />
/// <reference path="./Profil.ts" />
/// <reference path="./ThemeSDI.ts" />
/// <reference path="./AuthorizedClient.ts" />

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
     * Users property.
     *
     * @property _users
     * @type Array<User>
     */
    private _users : Array<User>;

    /**
     * Lazy loading for Users property.
     *
     * @property _users_loaded
     * @type boolean
     */
    private _users_loaded : boolean;

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
     * AuthorizedClients property
     *
     * @property _authorizedClients
     * @type Array<AuthorizedClient>
     */
    private _authorizedClients : Array<AuthorizedClient>;

    /**
     * Lazy loading for authorizedClients property
     *
     * @property _authorizedClients_loaded
     * @type boolean
     */
    private _authorizedClients_loaded : boolean;

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

        this._users = new Array<User>();
        this._users_loaded = false;

        this._zones = new Array<Zone>();
        this._zones_loaded = false;

        this._profils = new Array<Profil>();
        this._profils_loaded = false;

        this._theme = null;
        this._theme_loaded = false;

        this._authorizedClients = new Array<AuthorizedClient>();
        this._authorizedClients_loaded = false;

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
     * Return the Users
     *
     * @method users
     */
    users() {
        return this._users;
    }

    /**
     * Load the SDI's users.
     *
     * @method loadUsers
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadUsers(successCallback : Function, failCallback : Function) {
        if(! this._users_loaded) {
            var self = this;
            var success : Function = function(users) {
                self._users = users;
                self._users_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getAssociatedObjects(SDI, User, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
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
     * Return the SDI's authorized clients.
     *
     * @method authorizedClients
     */
    authorizedClients() {
        return this._authorizedClients;
    }

    /**
     * Load the SDI's authorizedClients.
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

            this.getAssociatedObjects(SDI, AuthorizedClient, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
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
            if(self._users_loaded && self._profils_loaded && self._zones_loaded && self._theme_loaded) {
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

        this.loadUsers(success, fail);
        this.loadProfils(success, fail);
        this.loadZones(success, fail);
        this.loadTheme(success, fail);
    }

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._profils_loaded = false;
		this._users_loaded = false;
		this._zones_loaded = false;
        this._theme_loaded = false;
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

		var success : Function = function () {
			self._complete = (self._complete && !!self.name());
			successCallback();
		}
		super.checkCompleteness(success, failCallback);
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
            } else {
                data["theme"] = (self.theme() !== null) ? self.theme().toJSONObject() : null;
            }

            data["profils"] = self.serializeArray(self.profils(), onlyId);
            data["users"] = self.serializeArray(self.users(), onlyId);
            data["zones"] = self.serializeArray(self.zones(), onlyId);

            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

	/**
	 * Add a new User to the SDI and associate it in the database.
	 * A User can only be added once.
	 *
     * @method addUser
	 * @param {User} u The User to add inside the SDI. It cannot be a null value.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	addUser(userID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(SDI, User, userID, successCallback, failCallback);
	}

	/**
	 * Remove a User from the SDI: the association is removed both in the object and in database.
	 * The User can only be removed if it exists first in the list of associated Users, else an exception is thrown.
	 *
     * @method removeUser
	 * @param {User} u The User to remove from that SDI
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	removeUser(userID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(SDI, User, userID, successCallback, failCallback);
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
     * Delete in database the model with current id.
     *
     * @method delete
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    delete(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        return ModelItf.deleteObject(SDI, this.getId(), successCallback, failCallback, attemptNumber);
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
    cloneObject(modelClass : any, successCallback : Function, failCallback : Function) {

        var self = this;

        var successCloneSDI = function (clonedSDI : SDI) {

            var successLinkOrigineSDI = function () {

                var successLoadAsso = function () {

                    var successLinkThemeSDI = function () {

                        var userSize = self.users().length;
                        var counterUsers = 0;

                        var successAddUser = function () {
                            counterUsers++;
                            if (counterUsers >= userSize) {

                                var zoneSize = self.zones().length;
                                var counterZones = 0;

                                var successCloneZone = function (clonedZone : Zone) {
                                    var successAssoZone = function () {
                                        counterZones++;

                                        if (counterZones >= zoneSize) {

                                            var profilSize = self.profils().length;
                                            var counterProfil = 0;

                                            var successCloneProfil = function (clonedProfil : Profil) {

                                                var successAssoProfil = function () {
                                                    counterProfil++;

                                                    if (counterProfil >= profilSize) {
                                                        successCallback(clonedSDI);
                                                    }
                                                };

                                                clonedSDI.addProfil(clonedProfil.getId(), successAssoProfil, failCallback);
                                            };

                                            if (profilSize > 0) {
                                                self.profils().forEach(function (profil : Profil) {
                                                    // TODO : Manage cloneObject with the clonedSDI as parameter
                                                    profil.cloneObject(Profil, successCloneProfil, failCallback);
                                                });
                                            } else {
                                                successCallback(clonedSDI);
                                            }
                                        }
                                    };


                                    clonedSDI.addZone(clonedZone.getId(), successAssoZone, failCallback);
                                };

                                if (zoneSize > 0) {
                                    self.zones().forEach(function (zone : Zone) {
                                        zone.cloneObject(Zone, successCloneZone, failCallback);
                                    });
                                } else {
                                    successCallback(clonedSDI);
                                }

                            }
                        };

                        if (userSize > 0) {
                            self.users().forEach( function (user : User) {
                                clonedSDI.addUser(user.getId(), successAddUser, failCallback);
                            });
                        } else {
                            successAddUser();
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