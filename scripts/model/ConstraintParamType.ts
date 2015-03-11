/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./TypeParamType.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : ConstraintParamType
 *
 * @class ConstraintParamType
 * @extends ModelItf
 */
class ConstraintParamType extends ModelItf {

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
	 * Type property: a constraint only apply on a specific type.
	 *
	 * @property _type
	 * @type TypeParamType
	 */
	private _type : TypeParamType;

	/**
	 * Lazy loading for Type property
	 *
	 * @property _type_loading
	 * @type boolean
	 */
	private _type_loaded : boolean;

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {string} name - The ConstraintParamType's name.
	 * @param {number} id - The ConstraintParamType's ID.
	 */
	constructor(name : string = "", description : string = "", id : number = null, complete : boolean = false) {
		super(id, complete);

		this.setName(name);
		this.setDescription(description);

		this._type = null;
		this._type_loaded = false;
	}

	/**
	 * Set the ConstraintParamType's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

	/**
	 * Set the ConstraintParamType's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string) {
		this._description = description;
	}

	/**
	 * Return the ConstraintParamType's name.
     *
     * @method name
	 */
	name() {
		return this._name;
	}

	/**
	 * Return the ConstraintParamType's description.
     *
     * @method description
	 */
	description() {
		return this._description;
	}

	/**
	 * Return the ConstraintParamType's type
     *
     * @method type
	 */
	type() {
		return this._type;
	}

    /**
     * Load the ConstraintParamType's type
     *
     * @method loadType
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadType(successCallback : Function = null, failCallback : Function = null) {
        if(! this._type_loaded) {
            var self = this;
            var success : Function = function(type) {
                if(!!type) {
                    self._type = type;
                }
                self._type_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(ConstraintParamType, TypeParamType, success, fail);
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
            if(self._type_loaded) {
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

        this.loadType(success, fail);
    }

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._type_loaded = false;
	}

	/**
	 * Return a ConstraintParamType instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"description": this.description(),
			"complete": this.isComplete()
		};
		return data;
	}

	/**
	 * Check completeness of a ConstraintParamType.
	 *
	 * A ConstraintParamType is considered as complete if it has an ID, a name and a type.
	 */
	checkCompleteness(successCallback : Function = null, failCallback : Function = null) : void {
		super.checkCompleteness();

		if (this.isComplete()) {
			var self = this;

			var success:Function = function () {
				self._complete = (self._complete && !!self.name() && (self.type() !== undefined && self.type().isComplete()));
				successCallback();
			};

			var fail:Function = function (error) {
				failCallback(error);
			};

			this.loadAssociations(success, fail);
		}
	}

    /**
     * Return a ConstraintParamType instance as a JSON Object including associated object.
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
            data["type"] = (self.type() !== null) ? self.type().toJSONObject() : null;

            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

	/**
	 * Set the type of the ConstraintParamType.
	 * As a ConstraintParamType can only have one type, if the value is already set, this method throws an exception: you need first to unset the type.
	 * Moreover the given type must be created in database.
	 *
     * @method setType
	 * @param {TypeParamType} t The type to associate with the ConstraintParamType.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	setType(t : TypeParamType, successCallback : Function = null, failCallback : Function = null) {
		if (!t || !t.getId()) {
            failCallback(new ModelException("The type must be an existing object to be associated."));
            return;
		}

		if (this.type() !== null) {
            failCallback(new ModelException("The type is already set for this ConstraintParamType."));
            return;
		}

        var self = this;

        var success : Function = function() {
            t.desynchronize();
            self._type = t;
            self._type_loaded = true;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.associateObject(ConstraintParamType, TypeParamType, t.getId(), success, fail);
	}

	/**
	 * Unset the current type from the constraintParamType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A type must have been set before using it, else an exception is thrown.
	 *
     * @method unsetType
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unsetType(successCallback : Function = null, failCallback : Function = null) {
		if (this.type() === null) {
            failCallback(new ModelException("No type has been set for this constraintParamType."));
            return;
		}

        var self = this;

        var success : Function = function() {
            self.type().desynchronize();
            self._type = null;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(ConstraintParamType, TypeParamType, this.type().getId(), success, fail);
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
        this.createObject(ConstraintParamType, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(ConstraintParamType, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(ConstraintParamType, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return this.deleteObject(ConstraintParamType, successCallback, failCallback, attemptNumber);
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
        return this.allObjects(ConstraintParamType, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return an ConstraintParamType instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Call} The model instance.
	 */
	static parseJSON(jsonString : string) : ConstraintParamType {
		return ConstraintParamType.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return an ConstraintParamType instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Call} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : ConstraintParamType {
		if(!jsonObject.id) {
			throw new ModelException("A CallType object should have an ID.");
		}
		if(jsonObject.complete == null || jsonObject.complete == undefined) {
			throw new ModelException("A CallType object should have a complete attribute.");
		}

		return new ConstraintParamType(jsonObject.name, jsonObject.description, jsonObject.id, jsonObject.complete);
	}

	/**
	 * Retrieve DataBase Table Name.
	 *
	 * @method getTableName
	 * @return {string} The DataBase Table Name corresponding to Model.
	 */
	static getTableName() : string {
		return "ConstraintParamTypes";
	}
}