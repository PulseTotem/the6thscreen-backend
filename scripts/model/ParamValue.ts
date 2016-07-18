/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr>
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
     * Origine paramValue if the current object is a clone
     *
     * @property _origineParamValue
     * @type ParamValue
     */
    private _origineParamValue : ParamValue;

    /**
     * Lazy loading for origineParamValue attribute
     *
     * @property _origineParamValue_loaded
     * @type boolean
     */
    private _origineParamValue_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} value - The ParamValue's value.
     * @param {number} id - The ParamValue's ID.
	 * @param {string} createdAt - The ParamValue's createdAt.
	 * @param {string} updatedAt - The ParamValue's updatedAt.
     */
    constructor(value : string = null, id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

        this.setValue(value);

	    this._paramType = null;
	    this._paramType_loaded = false;

        this._origineParamValue = null;
        this._origineParamValue_loaded = false;
    }

	// TODO : Check the value type here?
	/**
	 * Set the ParamValue's value.
	 *
	 * @method setValue
	 */
	setValue(value : string) {
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
    loadParamType(successCallback : Function, failCallback : Function) {
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

    /**
     * Return the origineParamValue attribute
     *
     * @method origineParamValue
     * @returns {ParamValue}
     */
    origineParamValue() {
        return this._origineParamValue;
    }

    /**
     * Load the origine ParamValue attribute
     *
     * @method loadOrigineParamValue
     * @param successCallback
     * @param failCallback
     */
    loadOrigineParamValue(successCallback : Function, failCallback : Function) {
        if (! this._origineParamValue_loaded) {
            var self = this;

            var successLoad = function (origineParamValue) {
                self._origineParamValue = origineParamValue;
                self._origineParamValue_loaded = true;

                if (successCallback != null) {
                    successCallback();
                }
            };

            var fail = function (error) {
                if (failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(ParamValue, ParamValue, successLoad, fail);
        } else {
            if (successCallback != null) {
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
        this._origineParamValue_loaded = false;
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
			"value": this.value(),
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
		};
		return data;
	}

	/**
	 * Check if the object is complete or not.
	 * A ParamValue is complete if it has an ID, a value and a type.
	 *
	 * @param successCallback The function to call when success.
	 * @param failCallback The function to call when fail.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) : void {
		var self = this;

		var success : Function = function () {
			if (self.isComplete() && self.value() != null) {
				var successLoad:Function = function () {
					self._complete = (self.paramType() !== null && self.paramType().isComplete());
					successCallback();
				};

				var fail:Function = function (error) {
					failCallback(error);
				};

                if (!self._paramType_loaded) {
                    self.loadParamType(successLoad, fail);
                } else {
                    successLoad();
                }

			} else {
				self._complete = false;
				successCallback();
			}
		};

		super.checkCompleteness(success, failCallback);
	}

    /**
     * Return a ParamValue instance as a JSON Object including associated object.
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
		        data["paramType"] = (self.paramType() !== null) ? self.paramType().getId() : null;
	        } else {
		        data["paramType"] = (self.paramType() !== null) ? self.paramType().toJSONObject() : null;
	        }


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
     * @method linkParamType
	 * @param {ParamType} t The ParamType to associate with the ParamValue.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkParamType(typeID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(ParamValue, ParamType, typeID, successCallback, failCallback);
	}

	/**
	 * Unset the current ParamType from the ParamValue.
	 * It both sets a null value for the object property and remove the association in database.
	 * A ParamType must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkParamType
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkParamType(typeID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(ParamValue, ParamType, typeID, successCallback, failCallback);
	}

    /**
     * Set the origineParamValue of the current object if it is a clone
     *
     * @method linkOrigineParamValue
     * @param origineParamValueId
     * @param successCallback
     * @param failCallback
     */
    linkOrigineParamValue(origineParamValueId : number, successCallback : Function, failCallback : Function) {
        this.associateObject(ParamValue, ParamValue, origineParamValueId, successCallback, failCallback);
    }

    /**
     * Unset the origineParamValue
     *
     * @method unlinkOrigineParamValue
     * @param origineParamValueId
     * @param successCallback
     * @param failCallback
     */
    unlinkOrigineParamValue(origineParamValueId : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(ParamValue, ParamValue, origineParamValueId, successCallback, failCallback);
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
    static read(id : number, successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
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
    update(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
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
    delete(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        return ModelItf.deleteObject(ParamValue, this.getId(), successCallback, failCallback, attemptNumber);
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
		return new ParamValue(jsonObject.value, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
	}

    /**
     * Clone a ParamValue: it clones value information, and keep the same ParamType
     * @param modelClass
     * @param successCallback
     * @param failCallback
     */
    clone(successCallback : Function, failCallback : Function) {
        Logger.debug("Start cloning ParamValue with id "+this.getId());
        var self = this;

        var successCloneParamValue = function (clonedParamValue : ParamValue) {
            Logger.debug("Obtained clonedParamValue :"+JSON.stringify(clonedParamValue));

            var successLinkOrigine = function () {
                clonedParamValue._origineParamValue = self;
                clonedParamValue._origineParamValue_loaded = true;

                var completeParamValue = clonedParamValue.isComplete();

                var successLoadAsso = function () {

                    var successLinkParamType = function () {

                        var successCheckCompleteness = function () {
                            if (clonedParamValue.isComplete() != completeParamValue) {

                                var successUpdate = function () {
                                    successCallback(clonedParamValue);
                                };

                                clonedParamValue.update(successUpdate, failCallback);
                            } else {
                                successCallback(clonedParamValue);
                            }
                        };
                        clonedParamValue.desynchronize();
                        clonedParamValue.checkCompleteness(successCheckCompleteness, failCallback);
                    };

                    clonedParamValue.linkParamType(self.paramType().getId(), successLinkParamType, failCallback);
                };

                self.loadAssociations(successLoadAsso, failCallback);
            };

            clonedParamValue.linkOrigineParamValue(self.getId(), successLinkOrigine, failCallback);
        };
        super.cloneObject(ParamValue, successCloneParamValue, failCallback);
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