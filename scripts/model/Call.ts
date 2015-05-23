/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./ParamValue.ts" />
/// <reference path="./CallType.ts" />
/// <reference path="./Profil.ts" />
/// <reference path="./OAuthKey.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : Call
 *
 * @class Call
 * @extends ModelItf
 */
class Call extends ModelItf {

    /**
     * Name property.
     *
     * @property _name
     * @type string
     */
    private _name : string;

	/**
	 * CallType property.
	 *
	 * @property _call_type
	 * @type CallType
	 */
	private _call_type : CallType;

	/**
	 * Lazy loading for CallType property.
	 *
	 * @property _call_type_loaded
	 * @type boolean
	 */
	private _call_type_loaded : boolean;

    /**
     * ParamValues property.
     *
     * @property _param_values
     * @type Array<ParamValue>
     */
    private _param_values : Array<ParamValue>;

    /**
     * Lazy loading for ParamValues property.
     *
     * @property _param_values_loaded
     * @type boolean
     */
    private _param_values_loaded : boolean;

	/**
	 * OAuthKey property.
	 *
	 * @property _oauthkey
	 * @type OAuthKey
	 */
	private _oauthkey : OAuthKey;

	/**
	 * Lazy loading for OAuthKey property.
	 *
	 * @property _oauthkey_loaded
	 * @type boolean
	 */
	private _oauthkey_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Call's name.
     * @param {number} id - The Call's ID.
	 * @param {string} createdAt - The Call's createdAt.
	 * @param {string} updatedAt - The Call's updatedAt.
     */
    constructor(name : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

        this.setName(name);

        this._param_values = new Array<ParamValue>();
        this._param_values_loaded = false;

	    this._call_type = null;
	    this._call_type_loaded = false;

		this._oauthkey = null;
		this._oauthkey_loaded = false;
    }

    /**
     * Return the Call's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Set the Call's name.
     *
     * @method setName
     */
    setName(name : string) {
        this._name = name;
    }

    /**
     * Return the Call's paramValues.
     *
     * @method paramValues
     */
    paramValues() {
        return this._param_values;
    }

    /**
     * Load the Profil's paramValues.
     *
     * @method loadParamValues
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadParamValues(successCallback : Function = null, failCallback : Function = null) {
        if(! this._param_values_loaded) {
            var self = this;
            var success : Function = function(param_values) {
                self._param_values = param_values;
                self._param_values_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getAssociatedObjects(Call, ParamValue, success, fail);
        }
    }

	/**
	 * Return the Call's type.
     *
     * @method callType
	 */
	callType() {
		return this._call_type;
	}

    /**
     * Load the Call's type.
     *
     * @method loadCallType
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadCallType(successCallback : Function = null, failCallback : Function = null) {
        if(! this._call_type_loaded) {
            var self = this;
            var success : Function = function(call_type) {
                if(!!call_type) {
                    self._call_type = call_type;
                }
                self._call_type_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(Call, CallType, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

	/**
	 * Return the Call's oAuthKey.
	 *
	 * @method oAuthKey
	 */
	oAuthKey() {
		return this._oauthkey;
	}

	/**
	 * Load the Call's oAuthKey.
	 *
	 * @method loadOAuthKey
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadOAuthKey(successCallback : Function = null, failCallback : Function = null) {
		if(! this._oauthkey_loaded) {
			var self = this;
			var success : Function = function(oAuthKey) {
				if(!!oAuthKey) {
					self._oauthkey = oAuthKey;
				}
				self._oauthkey_loaded = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getUniquelyAssociatedObject(Call, OAuthKey, success, fail);
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
            if(self._param_values_loaded && self._call_type_loaded && self._oauthkey_loaded) {
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

        this.loadParamValues(success, fail);
        this.loadCallType(success, fail);
		this.loadOAuthKey(success, fail);
    }

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		super.desynchronize();
		this._call_type_loaded = false;
		this._param_values_loaded = false;
		this._oauthkey_loaded = false;
	}

	/**
	 * Check whether the object is complete or not
	 *
	 * A Call is complete if it has an ID, a name, a calltype and a profil.
	 *
	 * @param successCallback The function to call in case of success.
	 * @param failCallback The function to call in case of failure.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) {

		var self = this;
		var success = function () {
			if (self.isComplete() && !!self.name()) {
				var success : Function = function () {
					if (self._call_type_loaded) {
						self._complete = (!!self.callType() && self.callType().isComplete());
						successCallback();
					}
				};

				var fail : Function = function (error) {
					failCallback(error);
				};

				self.loadCallType(success,fail);
			} else {
				self._complete = false;
				successCallback();
			}
		};

		super.checkCompleteness(success, failCallback);
	}

	/**
	 * Return a Call instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
		};
		return data;
	}

    /**
     * Return a Call instance as a JSON Object including associated object.
     * However the method should not be recursive due to cycle in the model.
     *
     * @method toCompleteJSONObject
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    toCompleteJSONObject(successCallback : Function, failCallback : Function, onlyId : boolean = false) {
        var self = this;
	    var data = this.toJSONObject();

        var success : Function = function() {

	        if (onlyId) {
		        data["callType"] = (self.callType() !== null) ? self.callType().getId() : null;
				data["oAuthKey"] = (self.oAuthKey() !== null) ? self.oAuthKey().getId() : null;
	        } else {
		        data["callType"] = (self.callType() !== null) ? self.callType().toJSONObject() : null;
				data["oAuthKey"] = (self.oAuthKey() !== null) ? self.oAuthKey().toJSONObject() : null;
	        }
	        data["paramValues"] = self.serializeArray(self.paramValues(), onlyId);

            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

	/**
	 * Add a new ParamValue to the Call and associate it in the database.
	 * A ParamValue can only be added once.
	 *
     * @method addParamValue
	 * @param {ParamValue} p The ParamValue to add inside the call. It cannot be a null value.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	addParamValue(paramValueId : number, successCallback : Function, failCallback : Function) {
        this.associateObject(Call, ParamValue, paramValueId, successCallback, failCallback);
	}

	/**
	 * Remove a ParamValue from the Call: the association is removed both in the object and in database.
	 * The ParamValue can only be removed if it exists first in the list of associated ParamValue, else an exception is thrown.
	 *
     * @method removeParamValue
	 * @param {ParamValue} p The ParamValue to remove from that Call
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	removeParamValue(paramValueId : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(Call, ParamValue, paramValueId, successCallback, failCallback);
	}

	/**
	 * Set the CallType of the Call.
	 * As a Call can only have one CallType, if the value is already set, this method throws an exception: you need first to unset the CallType.
	 * Moreover the given CallType must be created in database.
	 *
     * @method linkCallType
	 * @param {CallType} ct The CallType to associate with the Call.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkCallType(callTypeId : number, successCallback : Function, failCallback : Function) {
		this.associateObject(Call, CallType, callTypeId, successCallback, failCallback);
	}

	/**
	 * Unset the current CallType from the Call.
	 * It both sets a null value for the object property and remove the association in database.
	 * A CallType must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkCallType
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkCallType(callTypeId : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(Call, CallType, callTypeId, successCallback, failCallback);
	}

	/**
	 * Set the OAuthKey of the Call.
	 * As a Call can only have one OAuthKey, if the value is already set, this method throws an exception: you need first to unset the OAuthKey.
	 * Moreover the given OAuthKey must be created in database.
	 *
	 * @method linkOAuthKey
	 * @param {number} oAuthKeyId - The OAuthKey to associate with the Call.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	linkOAuthKey(oAuthKeyId : number, successCallback : Function, failCallback : Function) {
		this.associateObject(Call, OAuthKey, oAuthKeyId, successCallback, failCallback);
	}

	/**
	 * Unset the current OAuthKey from the Call.
	 * It both sets a null value for the object property and remove the association in database.
	 * A OAuthKey must have been set before using it, else an exception is thrown.
	 *
	 * @method unlinkOAuthKey
	 * @param {number} oAuthKeyId - The OAuthKey to unset from the Call.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkOAuthKey(oAuthKeyId : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(Call, OAuthKey, oAuthKeyId, successCallback, failCallback);
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
        this.createObject(Call, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(Call, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(Call, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return ModelItf.deleteObject(Call, this.getId(), successCallback, failCallback, attemptNumber);
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
        return this.allObjects(Call, successCallback, failCallback, attemptNumber);
    }

    /**
     * Return a Call instance from a JSON string.
     *
     * @method parseJSON
     * @static
     * @param {string} json - The JSON string
     * @return {Call} The model instance.
     */
    static parseJSON(jsonString : string) : Call {
        return Call.fromJSONObject(JSON.parse(jsonString));
    }

    /**
     * Return a Call instance from a JSON Object.
     *
     * @method fromJSONObject
     * @static
     * @param {JSONObject} json - The JSON Object
     * @return {Call} The model instance.
     */
    static fromJSONObject(jsonObject : any) : Call {
	    return new Call(jsonObject.name, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
    }

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Calls";
    }
}