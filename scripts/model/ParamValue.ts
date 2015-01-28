/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./ParamType.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : ParamValue
 *
 * @class ParamValue
 * @extends ModelItf
 */
class ParamValue extends ModelItf {

    /**
     * Value property.
     *
     * @property _value
     * @type string
     */
    private _value : string;

	/**
	 * ParamType property.
	 *
	 * @property _paramType
	 * @type ParamType
	 */
	private _paramType : ParamType;

	/**
	 * Lazy loading for ParamType property.
	 *
	 * @property _paramType_loaded
	 * @type boolean
	 */
	private _paramType_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} value - The ParamValue's value.
     * @param {number} id - The ParamValue's ID.
     */
    constructor(value : string, id : number = null) {
        super(id);

        this.setValue(value);

	    this._paramType = null;
	    this._paramType_loaded = false;
    }

	// TODO : Check the value type here?
	/**
	 * Set the ParamValue's value.
	 *
	 * @method setValue
	 */
	setValue(value : string) {
		if(!value) {
			throw new ModelException("A ParamValue needs a proper value.")
		}

		this._value = value;
	}

    /**
     * Return the ParamValue's value.
     *
     * @method value
     */
    value() {
        return this._value;
    }

	/**
	 * Return the ParamValue's ParamType.
     *
     * @method paramType
	 */
	paramType() {
		return this._paramType;
	}

    /**
     * Load the ParamValue's ParamType.
     *
     * @method loadParamType
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadParamType(successCallback : Function = null, failCallback : Function = null) {
        if(! this._paramType_loaded) {
            var self = this;
            var success : Function = function(paramType) {
                if(!!paramType) {
                    self._paramType = paramType;
                }
                self._paramType_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(ParamValue, ParamType, success, fail);
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
            if(self._paramType_loaded) {
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

        this.loadParamType(success, fail);
    }

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._paramType_loaded = false;
	}

	/**
	 * Return a ParamValue instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"value": this.value()
		};
		return data;
	}

    /**
     * Return a ParamValue instance as a JSON Object including associated object.
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
            data["paramType"] = (self.paramType() !== null) ? self.paramType().toJSONObject() : null;

            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

	/**
	 * Set the ParamType of the ParamValue.
	 * As a ParamValue can only have one type, if the value is already set, this method throws an exception: you need first to unset the ParamType.
	 * Moreover the given ParamType must be created in database.
	 *
     * @method setParamType
	 * @param {ParamType} t The ParamType to associate with the ParamValue.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	setParamType(p : ParamType, successCallback : Function = null, failCallback : Function = null) {
		if (!p || !p.getId()) {
            failCallback(new ModelException("The ParamType must be an existing object to be associated."));
            return;
		}

		if (this.paramType() !== null) {
            failCallback(new ModelException("The paramType is already set for this ParamValue."));
            return;
		}

        var self = this;

        var success : Function = function() {
            p.desynchronize();
            self._paramType = p;
            self._paramType_loaded = true;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.associateObject(ParamValue, ParamType, p.getId(), success, fail);
	}

	/**
	 * Unset the current ParamType from the ParamValue.
	 * It both sets a null value for the object property and remove the association in database.
	 * A ParamType must have been set before using it, else an exception is thrown.
	 *
     * @method unsetParamType
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unsetParamType(successCallback : Function = null, failCallback : Function = null) {
		if (this.paramType() === null) {
            failCallback(new ModelException("No ParamType has been set for this ParamValue."));
            return;
		}

        var self = this;

        var success : Function = function() {
            self.paramType().desynchronize();
            self._paramType = null;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(ParamValue, ParamType, this.paramType().getId(), success, fail);
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
        this.createObject(ParamValue, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(ParamValue, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(ParamValue, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return this.deleteObject(ParamValue, successCallback, failCallback, attemptNumber);
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
        return this.allObjects(ParamValue, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return a ParamValue instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {ParamValue} The model instance.
	 */
	static parseJSON(jsonString : string) : ParamValue {
		return ParamValue.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a ParamValue instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {ParamValue} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : ParamValue {
		if (!jsonObject.id) {
			throw new ModelException("A ParamValue object should have an ID.");
		}
		if(!jsonObject.value) {
			throw new ModelException("A ParamValue object should have a value.");
		}
		return new ParamValue(jsonObject.value, jsonObject.id);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "ParamValues";
    }
}