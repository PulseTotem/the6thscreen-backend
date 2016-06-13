/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../core/BackendConfig.ts" />
/// <reference path="../core/BackendConfig.ts" />

/// <reference path="./ModelItf.ts" />
/// <reference path="./SDI.ts" />
/// <reference path="./OAuthKey.ts" />

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
	 * CmsId property.
	 *
	 * @property _cmsId
	 * @type string
	 */
	private _cmsId : string;

	/**
	 * CmsAuthkey property.
	 *
	 * @property _cmsAuthkey
	 * @type string
	 */
	private _cmsAuthkey : string;

    /**
     * OAuthKeys property.
     *
     * @property _oauthkeys
     * @type Array<OAuthKey>
     */
    private _oauthkeys : Array<OAuthKey>;

    /**
     * Lazy loading for OAuthKeys property.
     *
     * @property _oauthkeys_loaded
     * @type boolean
     */
    private _oauthkeys_loaded : boolean;


    /**
     * Constructor.
     *
     * @constructor
     * @param {string} username - The User's username.
     * @param {number} id - The User's ID.
	 * @param {string} cmsId - The User's cmsId.
	 * @param {string} cmsAuthkey - The User's cmsAuthkey.
	 * @param {string} createdAt - The User's createdAt.
	 * @param {string} updatedAt - The User's updatedAt.
     */
    constructor(username : string = "", email : string = "", cmsId : string = "", cmsAuthkey : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

        this.setUsername(username);
        this.setEmail(email);
		this.setCmsId(cmsId);
		this.setCmsAuthkey(cmsAuthkey);

	    this._token = null;
	    this._lastIp = null;

        this._oauthkeys = new Array<OAuthKey>();
        this._oauthkeys_loaded = false;
    }

	/**
	 * Set the User's username.
	 *
	 * @method setUsername
	 */
	setUsername(username : string) {
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
	 * Returns User's cmsId.
	 *
	 * @method cmsId
	 */
	cmsId() : string {
		return this._cmsId;
	}

	/**
	 * Set the User's cmsId.
	 *
	 * @method setCmsId
	 */
	setCmsId(cmsId : string) {
		this._cmsId = cmsId;
	}

	/**
	 * Returns User's cmsAuthkey.
	 *
	 * @method cmsAuthkey
	 */
	cmsAuthkey() : string {
		return this._cmsAuthkey;
	}

	/**
	 * Set the User's cmsAuthkey.
	 *
	 * @method setCmsAuthkey
	 */
	setCmsAuthkey(cmsAuthkey : string) {
		this._cmsAuthkey = cmsAuthkey;
	}

    /**
     * Return the OAuthKeys owned by the User.
     *
     * @method oauthkeys
     */
    oauthkeys() {
        return this._oauthkeys;
    }

    /**
     * Load the OAuthKeys owned by the User.
     *
     * @method loadOAuthKeys
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadOAuthKeys(successCallback : Function, failCallback : Function) {
        if(! this._oauthkeys_loaded) {
            var self = this;
            var success : Function = function(oauthkeys) {
                self._oauthkeys = oauthkeys;
                self._oauthkeys_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getAssociatedObjects(User, OAuthKey, success, fail);
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
            if(self._oauthkeys_loaded) {
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
        this.loadOAuthKeys(success, fail);
    }

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
        this._oauthkeys_loaded = false;
	}

	/**
	 * Check completeness of a user.
	 * The completeness is determined by the presence of a username, an email and an id.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) : void {
		var self = this;

		var success : Function = function () {
			self._complete = (self._complete && !!self.username() && !!self.email());
			successCallback();
		};

		super.checkCompleteness(success, failCallback);
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
            "lastIp": this.lastIp(),
			"cmsId": this.cmsId(),
			"cmsAuthkey": this.cmsAuthkey(),
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
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
        var data = this.toJSONObject();
	    data["password"] = password;
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
    toCompleteJSONObject(successCallback : Function, failCallback : Function, onlyId : boolean = false) {
        var self = this;

        var success : Function = function() {
            var data = self.toJSONObject();
			data["oauthkeys"] = self.serializeArray(self.oauthkeys(), onlyId);

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
    setPassword(password : string, successCallback : Function, failCallback : Function) {
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
			if(response === undefined || Object.keys(response).length == 0 || response.id === undefined) {
				failCallback(new DataException("The response is a success but the data appears to be empty or does not have the right signature when updating an object with URL: "+urlUpdate+" and datas: "+self.toJSONObject()+"\nResponse data: "+JSON.stringify(response)));
			} else {
				successCallback();
			}
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to update an object with URL:"+urlUpdate+" and datas : "+JSON.stringify(self.toJSONObject())+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()));
        };

        var urlUpdate = BackendConfig.getDBBaseURL() + BackendConfig.objectEndpoint(User.getTableName(), this.getId().toString());

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
    checkPassword(password : string, successCallback : Function, failCallback : Function) {
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
			if(response === undefined || Object.keys(response).length == 0 ||response.id === undefined) {
				failCallback(new DataException("The response is a success but the data appears to be empty or does not have the right signature when reading an object with URL: "+urlReadObject+"\nResponse data: "+JSON.stringify(response)));
			} else {
				var encryptedGivenPwd = crypto.createHash('sha256').update(BackendConfig.getJWTSecret() + password).digest("hex");

				if(!!response.password) {
					if(encryptedGivenPwd == response.password) {
						successCallback();
					} else {
						failCallback(new DataException("Given password is not correct."));
					}
				} else {
					failCallback(new DataException("The response is a success but the data appears to be erroneous when reading an object with URL: "+urlReadObject+"\nResponse data: "+JSON.stringify(response)));
				}
			}
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to read an object with URL:"+urlReadObject+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()));
        };

        var urlReadObject = BackendConfig.getDBBaseURL() + BackendConfig.objectEndpoint(User.getTableName(), this.getId().toString());

        RestClient.get(urlReadObject, success, fail);
    }

    /**
     * Add a new OAuthKey to the User and associate it in the database.
     * A OAuthKey can only be added once.
     *
     * @method addOAuthKey
     * @param {OAuthKey} oauthkeyID - The OAuthKey to link with the User. It cannot be a null value.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    addOAuthKey(oauthkeyID : number, successCallback : Function, failCallback : Function) {
        this.associateObject(User, OAuthKey, oauthkeyID, successCallback, failCallback);
    }

    /**
     * Remove a OAuthKey from the User: the association is removed both in the object and in database.
     * The OAuthKey can only be removed if it exists first in the list of associated OAuthKeys, else an exception is thrown.
     *
     * @method removeOAuthKey
     * @param {OAuthKey} oauthkeyID - The OAuthKey to remove from that User
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    removeOAuthKey(oauthkeyID : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(User, OAuthKey, oauthkeyID, successCallback, failCallback);
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
    static read(id : number, successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
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
    update(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
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
    delete(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        return ModelItf.deleteObject(User, this.getId(), successCallback, failCallback, attemptNumber);
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
    static findOneByUsername(username : string, successCallback : Function, failCallback : Function) {
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
    static findOneByEmail(email : string, successCallback : Function, failCallback : Function) {
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
    static findOneByToken(token : string, successCallback : Function, failCallback : Function) {
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
		var user = new User(jsonObject.username, jsonObject.email, jsonObject.cmsId, jsonObject.cmsAuthkey, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);

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