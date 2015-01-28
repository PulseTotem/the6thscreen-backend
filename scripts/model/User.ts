/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Role.ts" />
/// <reference path="./SDI.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : User
 *
 * @class User
 * @extends ModelItf
 */
class User extends ModelItf {

    /**
     * Username property.
     *
     * @property _username
     * @type string
     */
    private _username : string;

    /**
     * Roles property.
     *
     * @property _roles
     * @type Array<Role>
     */
    private _roles : Array<Role>;

    /**
     * Lazy loading for Roles property.
     *
     * @property _roles_loaded
     * @type boolean
     */
    private _roles_loaded : boolean;

    /**
     * SDIs property.
     *
     * @property _sdis
     * @type Array<SDI>
     */
    private _sdis : Array<SDI>;

    /**
     * Lazy loading for SDIs property.
     *
     * @property _sdis_loaded
     * @type boolean
     */
    private _sdis_loaded : boolean;


    /**
     * Constructor.
     *
     * @constructor
     * @param {string} username - The User's username.
     * @param {number} id - The User's ID.
     */
    constructor(username : string, id : number = null) {
        super(id);

        this.setUsername(username);

        this._roles = new Array<Role>();
        this._roles_loaded = false;

        this._sdis = new Array<SDI>();
        this._sdis_loaded = false;
    }

	/**
	 * Set the User's username.
	 *
	 * @method setUsername
	 */
	setUsername(username : string) {
		if(!username) {
			throw new ModelException("The username is mandatory for a User.");
		}

		this._username = username;
	}

    /**
     * Return the User's username.
     *
     * @method username
     */
    username() {
        return this._username;
    }

    /**
     * Return the User's roles.
     *
     * @method roles
     */
    roles() {
        return this._roles;
    }

    /**
     * Load the User's roles.
     *
     * @method loadRoles
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadRoles(successCallback : Function = null, failCallback : Function = null) {
        if(! this._roles_loaded) {
            var self = this;
            var success : Function = function(roles) {
                self._roles = roles;
                self._roles_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getAssociatedObjects(User, Role, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

    /**
     * Return the SDIs owned by the User.
     *
     * @method sdis
     */
    sdis() {
        return this._sdis;
    }

    /**
     * Load the SDIs owned by the User.
     *
     * @method loadSdis
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadSdis(successCallback : Function = null, failCallback : Function = null) {
        if(! this._sdis_loaded) {
            var self = this;
            var success : Function = function(sdis) {
                self._sdis = sdis;
                self._sdis_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getAssociatedObjects(User, SDI, success, fail);
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
            if(self._roles_loaded && self._sdis_loaded) {
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

        this.loadRoles(success, fail);
        this.loadSdis(success, fail);
    }

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._roles_loaded = false;
		this._sdis_loaded = false;
	}

	/**
	 * Return a User instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"username": this.username()
		};
		return data;
	}

    /**
     * Return a User instance as a JSON Object including associated object.
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
            data["roles"] = self.serializeArray(self.roles());
            data["sdis"] = self.serializeArray(self.sdis());

            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

	/**
	 * Add a new SDI to the User and associate it in the database.
	 * A SDI can only be added once.
	 *
     * @method addSDI
	 * @param {SDI} s The SDI to link with the User. It cannot be a null value.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	addSDI(s : SDI, successCallback : Function = null, failCallback : Function = null) {
		if (!s || !s.getId()) {
            failCallback(new ModelException("The SDI must be an existing object to be associated."));
            return;
		}

		if (ModelItf.isObjectInsideArray(this.sdis(),s)) {
            failCallback(new ModelException("You cannot add twice a SDI for a User."));
            return;
		}

        var self = this;

        var success : Function = function() {
            s.desynchronize();
            self.sdis().push(s);

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.associateObject(User, SDI, s.getId(), success, fail);
	}

	/**
	 * Remove a SDI from the User: the association is removed both in the object and in database.
	 * The SDI can only be removed if it exists first in the list of associated SDIs, else an exception is thrown.
	 *
     * @method removeSDI
	 * @param {SDI} s The SDI to remove from that User
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	removeSDI(s : SDI, successCallback : Function = null, failCallback : Function = null) {
		if (!s || !s.getId()) {
            failCallback(new ModelException("The SDI must be an existing object to be removed."));
            return;
		}

		if (!ModelItf.isObjectInsideArray(this.sdis(),s)) {
            failCallback(new ModelException("The SDI you try to remove is not yet associated."));
            return;
		}

        var self = this;

        var success : Function = function() {
            s.desynchronize();
            ModelItf.removeObjectFromArray(self.sdis(), s);

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(User, SDI, s.getId(), success, fail);
	}

	/**
	 * Add a new Role to the User and associate it in the database.
	 * A Role can only be added once.
	 *
     * @method addRole
	 * @param {Role} r The Role to link with the User. It cannot be a null value.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	addRole(r : Role, successCallback : Function = null, failCallback : Function = null) {
		if (!r || !r.getId()) {
            failCallback(new ModelException("The Role must be an existing object to be associated."));
            return;
		}

		if (ModelItf.isObjectInsideArray(this.roles(),r)) {
            failCallback(new ModelException("You cannot add twice a Role for a User."));
            return;
		}

        var self = this;

        var success : Function = function() {
            r.desynchronize();
            self.roles().push(r);

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.associateObject(User, Role, r.getId(), success, fail);
	}

	/**
	 * Remove a Role from the User: the association is removed both in the object and in database.
	 * The Role can only be removed if it exists first in the list of associated Roles, else an exception is thrown.
	 *
     * @method removeRole
	 * @param {Role} r The Role to remove from that User
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	removeRole(r : Role, successCallback : Function = null, failCallback : Function = null) {
		if (!r || !r.getId()) {
            failCallback(new ModelException("The Role must be an existing object to be removed."));
            return;
		}

		if (!ModelItf.isObjectInsideArray(this.roles(),r)) {
            failCallback(new ModelException("The Role you try to remove is not yet associated."));
            return;
		}

        var self = this;

        var success : Function = function() {
            r.desynchronize();
            ModelItf.removeObjectFromArray(self.roles(),r);

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(User, Role, r.getId(), success, fail);
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
        this.createObject(User, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(User, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(User, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return this.deleteObject(User, successCallback, failCallback, attemptNumber);
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
        return this.allObjects(User, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return a User instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {SDI} The model instance.
	 */
	static parseJSON(jsonString : string) : User {
		return User.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a User instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {SDI} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : User {
		if (!jsonObject.id) {
			throw new ModelException("A User object should have an ID.");
		}
		if(!jsonObject.username) {
			throw new ModelException("A User object should have a name.");
		}
		return new User(jsonObject.username, jsonObject.id);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Users";
    }
}