/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../core/DatabaseConnection.ts" />
/// <reference path="../core/BackendConfig.ts" />

/// <reference path="./ModelItf.ts" />
/// <reference path="./Role.ts" />
/// <reference path="./SDI.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

var crypto : any = require('crypto');

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
     * Email property.
     *
     * @property _email
     * @type string
     */
    private _email : string;

    /**
     * Token property.
     *
     * @property _token
     * @type string
     */
    private _token : string;

    /**
     * LastIp property.
     *
     * @property _lastIp
     * @type string
     */
    private _lastIp : string;

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
    constructor(username : string = "", email : string = "", id : number = null) {
        super(id);

        this.setUsername(username);
        this.setEmail(email);

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
     * Set the User's email.
     *
     * @method setEmail
     */
    setEmail(email : string) {
        if(!email) {
            throw new ModelException("The email is mandatory for a User.");
        }

        this._email = email;
    }

    /**
     * Return the User's email.
     *
     * @method email
     */
    email() {
        return this._email;
    }

    /**
     * Set the User's token.
     *
     * @method setToken
     */
    setToken(token : string) {
        this._token = token;
    }

    /**
     * Return the User's token.
     *
     * @method token
     */
    token() {
        return this._token;
    }

    /**
     * Set the User's lastIp.
     *
     * @method setLastIp
     */
    setLastIp(lastIp : string) {
        this._lastIp = lastIp;
    }

    /**
     * Return the User's lastIp.
     *
     * @method lastIp
     */
    lastIp() {
        return this._lastIp;
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
			"username": this.username(),
            "email": this.email(),
            "token": this.token(),
            "lastIp": this.lastIp()
		};
		return data;
	}

    /**
     * Return a User instance as a JSON Object with its password
     *
     * @method toJSONObjectWithPwd
     * @param {string} password - The password to set in JSON Object description
     * @returns {Object} a JSON Object representing the instance
     */
    private toJSONObjectWithPwd(password : string) : Object {
        var data = {
            "id": this.getId(),
            "username": this.username(),
            "password": password,
            "token": this.token(),
            "lastIp": this.lastIp()
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
     * Set a new password to the User and save it in the database.
     *
     * @method setPassword
     * @param {string} password - The new password.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    setPassword(password : string, successCallback : Function = null, failCallback : Function = null) {
        if(! (!!password)) {
            failCallback(new ModelException("The password must not be null or undefined or an empty string."));
            return;
        }

        // if the object does not exist yet, we need to create it instead updating!
        if(!this.getId()) {
            failCallback(new ModelException("The object does not exist yet. It can't be update. Datas: "+JSON.stringify(this.toJSONObject())));
            return;
        }

        var self = this;

        var success : Function = function(result) {
            var response = result.data();
            if(response.status == "success") {
                if(response.data === undefined || Object.keys(response.data).length == 0 || response.data.id === undefined) {
                    failCallback(new DataException("The response is a success but the data appears to be empty or does not have the right signature when updating an object with URL: "+urlUpdate+" and datas: "+this.toJSONObject()+"\nResponse data: "+JSON.stringify(response.data)));
                } else {
                    successCallback();
                }
            } else {
                failCallback(new ResponseException("The request failed on the server when trying to update an object with URL:"+urlUpdate+" and datas : "+JSON.stringify(this.toJSONObject())+".\nMessage : "+JSON.stringify(response)));
            }
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to update an object with URL:"+urlUpdate+" and datas : "+JSON.stringify(this.toJSONObject())+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()));
        };

        var urlUpdate = DatabaseConnection.getBaseURL() + DatabaseConnection.objectEndpoint(User.getTableName(), this.getId().toString());

        var encryptedPwd = crypto.createHash('sha256').update(BackendConfig.getJWTSecret() + password).digest("hex");

        RestClient.put(urlUpdate, this.toJSONObjectWithPwd(encryptedPwd), success, fail);
    }

    /**
     * Check password of the User against password retrieved from the database.
     *
     * @method checkPassword
     * @param {string} password - Password to check.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    checkPassword(password : string, successCallback : Function = null, failCallback : Function = null) {
        if(! (!!password)) {
            failCallback(new ModelException("The password must not be null or undefined or an empty string."));
            return;
        }

        // if the object does not exist yet, we need to create it instead updating!
        if(!this.getId()) {
            failCallback(new ModelException("The object does not exist yet. It can't be update. Datas: "+JSON.stringify(this.toJSONObject())));
            return;
        }

        var self = this;

        var success : Function = function(result) {
            var response = result.data();
            if(response.status == "success") {
                if(response.data === undefined || Object.keys(response.data).length == 0 ||response.data.id === undefined) {
                    failCallback(new DataException("The response is a success but the data appears to be empty or does not have the right signature when reading an object with URL: "+urlReadObject+"\nResponse data: "+JSON.stringify(response.data)));
                } else {
                    var encryptedGivenPwd = crypto.createHash('sha256').update(BackendConfig.getJWTSecret() + password).digest("hex");

                    if(!!response.data.password) {
                        if(encryptedGivenPwd == response.data.password) {
                            successCallback();
                        } else {
                            failCallback(new DataException("Given password is not correct."));
                        }
                    } else {
                        failCallback(new DataException("The response is a success but the data appears to be erroneous when reading an object with URL: "+urlReadObject+"\nResponse data: "+JSON.stringify(response.data)));
                    }
                }
            } else {
                failCallback(new ResponseException("The request failed on the server when trying to read an object with URL:"+urlReadObject+".\nMessage : "+JSON.stringify(response)));
            }
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to read an object with URL:"+urlReadObject+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()));
        };

        var urlReadObject = DatabaseConnection.getBaseURL() + DatabaseConnection.objectEndpoint(User.getTableName(), this.getId().toString());

        RestClient.get(urlReadObject, success, fail);
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
     * Find One User by username.
     *
     * @method findOneByUsername
     * @param {string} username - The User's username
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    static findOneByUsername(username : string, successCallback : Function = null, failCallback : Function = null) {
        return this.findOneBy(User, "username", username, successCallback, failCallback);
    }

    /**
     * Find One User by email.
     *
     * @method findOneByEmail
     * @param {string} email - The User's email
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    static findOneByEmail(email : string, successCallback : Function = null, failCallback : Function = null) {
        return this.findOneBy(User, "email", email, successCallback, failCallback);
    }

    /**
     * Find One User by token.
     *
     * @method findOneByToken
     * @param {string} token - The User's token
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    static findOneByToken(token : string, successCallback : Function = null, failCallback : Function = null) {
        return this.findOneBy(User, "token", token, successCallback, failCallback);
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

        if(!jsonObject.email) {
            throw new ModelException("A User object should have an email.");
        }

		var user = new User(jsonObject.username, jsonObject.email, jsonObject.id);

        if(!!jsonObject.token) {
            user.setToken(jsonObject.token);
        }

        if(!!jsonObject.lastIp) {
            user.setLastIp(jsonObject.lastIp);
        }

        return user;
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