/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./User.ts" />
/// <reference path="./Zone.ts" />
/// <reference path="./Profil.ts" />
/// <reference path="./Timeline.ts" />

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
     * Timelines property.
     *
     * @property _timelines
     * @type Array<Timeline>
     */
    private _timelines : Array<Timeline>;

    /**
     * Lazy loading for Timelines property.
     *
     * @property _timelines_loaded
     * @type boolean
     */
    private _timelines_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - the SDI's name.
     * @param {string} description - The SDI's description.
     * @param {string} allowedHost - The SDI's allowedHost.
     * @param {number} id - The SDI's ID.
     */
    constructor(name : string, description : string = "", allowedHost : string = "*", id : number = null) {
        super(id);

        this.setName(name);
	    this.setDescription(description);
	    this.setAllowedHost(allowedHost);

        this._users = new Array<User>();
        this._users_loaded = false;

        this._zones = new Array<Zone>();
        this._zones_loaded = false;

        this._profils = new Array<Profil>();
        this._profils_loaded = false;

        this._timelines = new Array<Timeline>();
        this._timelines_loaded = false;
    }

	/**
	 * Set the SDI's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		if(!name) {
			throw new ModelException("A name is mandatory for a SDI.");
		}

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
    loadUsers(successCallback : Function = null, failCallback : Function = null) {
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
    loadZones(successCallback : Function = null, failCallback : Function = null) {
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
    loadProfils(successCallback : Function = null, failCallback : Function = null) {
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
     * Return the SDI's timelines.
     *
     * @method timelines
     */
    timelines() {
        return this._timelines;
    }

    /**
     * Load the SDI's timelines.
     *
     * @method loadTimelines
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadTimelines(successCallback : Function = null, failCallback : Function = null) {
        if(! this._timelines_loaded) {
            var self = this;
            var success : Function = function(timelines) {
                self._timelines = timelines;
                self._timelines_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getAssociatedObjects(SDI, Timeline, success, fail);
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
    loadAssociations(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var success : Function = function(models) {
            if(self._users_loaded && self._profils_loaded && self._zones_loaded && self._timelines_loaded) {
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
        this.loadTimelines(success, fail);
    }

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._profils_loaded = false;
		this._timelines_loaded = false;
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
			"allowedHost": this.allowedHost()
		};
		return data;
	}

    /**
     * Return a SDI instance as a JSON Object including associated object.
     * However the method should not be recursive due to cycle in the model.
     *
     * @method toCompleteJSONObject
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    toCompleteJSONObject(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var success : Function = function() {
            var data = self.toJSONObject();
            data["profils"] = self.serializeArray(self.profils());
            data["timelines"] = self.serializeArray(self.timelines());
            data["users"] = self.serializeArray(self.users());
            data["zones"] = self.serializeArray(self.zones());

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
	addUser(u : User, successCallback : Function = null, failCallback : Function = null) {
		if (!u || !u.getId()) {
			failCallback(new ModelException("The User must be an existing object to be associated."));
            return;
		}

		if (ModelItf.isObjectInsideArray(this.users(), u)) {
			failCallback(new ModelException("You cannot add twice a User for a SDI."));
            return;
		}

        var self = this;

        var success : Function = function() {
            u.desynchronize();
            self.users().push(u);

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.associateObject(SDI, User, u.getId(), success, fail);
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
	removeUser(u : User, successCallback : Function = null, failCallback : Function = null) {
		if (!u || !u.getId()) {
			failCallback(new ModelException("The User must be an existing object to be associated."));
            return;
		}

		if (!ModelItf.isObjectInsideArray(this.users(), u)) {
			failCallback(new ModelException("The User you try to remove has not been added to the current SDI"));
            return;
		}

        var self = this;

        var success : Function = function() {
            u.desynchronize();
            ModelItf.removeObjectFromArray(self.users(), u);

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(SDI, User, u.getId(), success, fail);
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
	addZone(z : Zone, successCallback : Function = null, failCallback : Function = null) {
		if (!z || !z.getId()) {
			failCallback(new ModelException("The Zone must be an existing object to be associated."));
            return;
		}

		if (ModelItf.isObjectInsideArray(this.zones(), z)) {
			failCallback(new ModelException("You cannot add twice a Zone for a SDI."));
            return;
		}

        var self = this;

        var success : Function = function() {
            z.desynchronize();
            self.zones().push(z);

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.associateObject(SDI, Zone, z.getId(), success, fail);
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
	removeZone(z : Zone, successCallback : Function = null, failCallback : Function = null) {
		if (!z || !z.getId()) {
			failCallback(new ModelException("The Zone must be an existing object to be associated."));
            return;
		}

		if (!ModelItf.isObjectInsideArray(this.zones(), z)) {
			failCallback(new ModelException("The Zone you try to remove has not been added to the current SDI"));
            return;
		}

        var self = this;

        var success : Function = function() {
            z.desynchronize();
            ModelItf.removeObjectFromArray(self.zones(), z);

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(SDI, Zone, z.getId(), success, fail);
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
	addProfil(p : Profil, successCallback : Function = null, failCallback : Function = null) {
		if (!p || !p.getId()) {
			failCallback(new ModelException("The Profil must be an existing object to be associated."));
            return;
		}

		if (ModelItf.isObjectInsideArray(this.profils(), p)) {
			failCallback(new ModelException("You cannot add twice a Profil for a SDI."));
            return;
		}

        var self = this;

        var success : Function = function() {
            p.desynchronize();
            self.profils().push(p);

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.associateObject(SDI, Profil, p.getId(), success, fail);
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
	removeProfil(p : Profil, successCallback : Function = null, failCallback : Function = null) {
		if (!p || !p.getId()) {
			failCallback(new ModelException("The Profil must be an existing object to be associated."));
            return;
		}

		if (!ModelItf.isObjectInsideArray(this.profils(), p)) {
			failCallback(new ModelException("The profil you try to remove is not linked with the SDI."));
            return;
		}

        var self = this;

        var success : Function = function() {
            p.desynchronize();
            ModelItf.removeObjectFromArray(self.profils(), p);

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(SDI, Profil, p.getId(), success, fail);
	}

	/**
	 * Add a new Timeline to the SDI and associate it in the database.
	 * A Timeline can only be added once.
	 *
     * @method addTimeline
	 * @param {Timeline} t The Timeline to add inside the SDI. It cannot be a null value.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	addTimeline(t : Timeline, successCallback : Function = null, failCallback : Function = null) {
		if (!t || !t.getId()) {
			failCallback(new ModelException("The Timeline must be an existing object to be associated."));
            return;
		}

		if (ModelItf.isObjectInsideArray(this.timelines(), t)) {
			failCallback(new ModelException("You cannot add twice a Timeline for a SDI."));
            return;
		}

        var self = this;

        var success : Function = function() {
            t.desynchronize();
            self.timelines().push(t);

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.associateObject(SDI, Timeline, t.getId(), success, fail);
	}

	/**
	 * Remove a Timeline from the SDI: the association is removed both in the object and in database.
	 * The Timeline can only be removed if it exists first in the list of associated Timelines, else an exception is thrown.
	 *
     * @method removeTimeline
	 * @param {Timeline} t The Timeline to remove from that SDI
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	removeTimeline(t : Timeline, successCallback : Function = null, failCallback : Function = null) {
		if (!t || !t.getId()) {
			failCallback(new ModelException("The Timeline must be an existing object to be associated."));
            return;
		}

		if (!ModelItf.isObjectInsideArray(this.timelines(), t)) {
			failCallback(new ModelException("The Timeline you try to remove is not linked with the SDI."));
            return;
		}

        var self = this;

        var success : Function = function() {
            t.desynchronize();
            ModelItf.removeObjectFromArray(self.timelines(), t);

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(SDI, Timeline, t.getId(), success, fail);
	}

	/**
     * Create model in database.
     *
     * @method create
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    create(successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
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
    static read(id : number, successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
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
    update(successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
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
    delete(successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
        return this.deleteObject(SDI, successCallback, failCallback, attemptNumber);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    static all(successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
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
		if(!jsonObject.id) {
			throw new ModelException("A SDI object should have an ID.");
		}
		if(!jsonObject.name) {
			throw new ModelException("A SDI object should have a name.");
		}
		if(!jsonObject.description) {
			throw new ModelException("A SDI object should have a description.");
		}
		if(!jsonObject.allowedHost) {
			throw new ModelException("A SDI object should have an allowedHost.");
		}
		return new SDI(jsonObject.name, jsonObject.description, jsonObject.allowedHost, jsonObject.id);
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