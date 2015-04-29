/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./User.ts" />
/// <reference path="./Zone.ts" />
/// <reference path="./Profil.ts" />

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
     * Constructor.
     *
     * @constructor
     * @param {string} name - the SDI's name.
     * @param {string} description - The SDI's description.
     * @param {string} allowedHost - The SDI's allowedHost.
     * @param {number} id - The SDI's ID.
     */
    constructor(name : string = "", description : string = "", allowedHost : string = "*", id : number = null, complete: boolean = false) {
        super(id, complete);

        this.setName(name);
	    this.setDescription(description);
	    this.setAllowedHost(allowedHost);

        this._users = new Array<User>();
        this._users_loaded = false;

        this._zones = new Array<Zone>();
        this._zones_loaded = false;

        this._profils = new Array<Profil>();
        this._profils_loaded = false;
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

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

    /**
     * Load all the lazy loading properties of the object.
     * Useful when you want to get a complete object.
     *
     * @method loadAssociations
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadAssociations(successCallback : Function, failCallback : Function) {
        var self = this;

        var success : Function = function(models) {
            if(self._users_loaded && self._profils_loaded && self._zones_loaded) {
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
			"complete": this.isComplete()
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
		return new SDI(jsonObject.name, jsonObject.description, jsonObject.allowedHost, jsonObject.id, jsonObject.complete);
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