/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./TypeParamType.ts" />
/// <reference path="./ConstraintParamType.ts" />
/// <reference path="./ParamValue.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : ParamType
 *
 * @class ParamType
 * @extends ModelItf
 */
class ParamType extends ModelItf {

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
	 * Type property
	 *
	 * @property _type
	 * @type TypeParamType
	 */
	private _type : TypeParamType;

	/**
	 * Lazy loading for Type property
	 *
	 * @property _type_loaded
	 * @type boolean
	 */
	private _type_loaded : boolean;


	/**
	 * Constraint property
	 *
	 * @property _constraint
	 * @type ConstraintParamType
	 */
	private _constraint : ConstraintParamType;


	/**
	 * Lazy loading for Constraint property
	 *
	 * @property _constraint_loaded
	 * @type boolean
	 */
	private _constraint_loaded : boolean;


	/**
	 * DefaultValue property
	 *
	 * @property _default_value
	 * @type ParamValue
	 */
	private _default_value : ParamValue;

	/**
	 * Lazy loading for DefaultValue property
	 *
	 * @property _default_value_property
	 * @type boolean
	 */
	private _default_value_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The ParamType's name.
     * @param {string} description - The ParamType's description.
     * @param {number} id - The ParamType's ID.
     */
    constructor(name : string = "", description : string = "", id : number = null, complete : boolean = false) {
        super(id, complete);

        this.setName(name);
	    this.setDescription(description);

	    this._constraint = null;
	    this._constraint_loaded = false;

	    this._default_value = null;
	    this._default_value_loaded = false;

	    this._type = null;
	    this._type_loaded = false;
    }

	/**
	 * Set the ParamType's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

	/**
	 * Set the ParamType's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string) {
		this._description = description;
	}

    /**
     * Return the ParamType's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Return the ParamType's description.
     *
     * @method description
     */
    description() {
        return this._description;
    }

    /**
     * Return the ParamType's type.
     *
     * @method type
     */
	type() {
	    return this._type;
    }

    /**
     * Load the ParamType's type
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

            this.getUniquelyAssociatedObject(ParamType, TypeParamType, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

    /**
     * Return the ParamType's constraint.
     *
     * @method constraint
     */
    constraint() {
	    return this._constraint;
    }

    /**
     * Load the ParamType's constraint
     *
     * @method loadConstraint
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadConstraint(successCallback : Function = null, failCallback : Function = null) {
        if(! this._constraint_loaded) {
            var self = this;
            var success : Function = function(constraint) {
                if(!!constraint) {
                    self._constraint = constraint;
                }
                self._constraint_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(ParamType, ConstraintParamType, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

	/**
	 * Return the ParamType's default value.
     *
     * @method defaultValue
	 */
	defaultValue() {
		return this._default_value;
	}

    /**
     * Load the ParamType's default value.
     *
     * @method loadDefaultValue
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadDefaultValue(successCallback : Function = null, failCallback : Function = null) {
        if(! this._default_value_loaded) {
            var self = this;
            var success : Function = function(defaultValue) {
                if(!!defaultValue) {
                    self._default_value = defaultValue;
                }
                self._default_value_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(ParamType, ParamValue, success, fail);
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
            if(self._type_loaded && self._constraint_loaded && self._default_value_loaded) {
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
        this.loadConstraint(success, fail);
        this.loadDefaultValue(success, fail);
    }

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._type_loaded = false;
		this._constraint_loaded = false;
		this._default_value_loaded = false;
	}

	/**
	 * Check if the given object is complete or not.
	 *
	 * A ParamType is complete if it has an ID, a name and a type.
	 *
	 * @param successCallback The function to call in case of success.
	 * @param failCallback The function to call in case of fail.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) {

		var self = this;

		var success : Function = function () {
			if (self.isComplete() && !!self.name()) {

				var success:Function = function () {
					self._complete = (self.type() !== null && self.type().isComplete());
					successCallback();
				};

				var fail:Function = function (error) {
					failCallback(error);
				};

				this.loadType(success, fail);
			} else {
				self._complete = false;
				successCallback();
			}
		};

		super.checkCompleteness(success, failCallback);

	}

	/**
	 * Return a ParamType instance as a JSON Object
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
     * Return a ParamType instance as a JSON Object including associated object.
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
            data["constraint"] = (self.constraint() !== null) ? self.constraint().toJSONObject() : null;
            data["defaultValue"] = (self.defaultValue() !== null) ? self.defaultValue().toJSONObject() : null;

            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

	/**
	 * Set the Type of the ParamType.
	 * As a ParamType can only have one Type, if the value is already set, this method throws an exception: you need first to unset the Type.
	 * Moreover the given Type must be created in database.
	 *
     * @method linkType
	 * @param {TypeParamType} t The Type to associate with the ParamType.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
    linkType(t : TypeParamType, successCallback : Function = null, failCallback : Function = null) {
        if (!t || !t.getId()) {
            failCallback(new ModelException("The type must be an existing object to be associated."));
            return;
        }

        if (this.type() !== null) {
            failCallback(new ModelException("The type is already set for this ParamType."));
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

        this.associateObject(ParamType, TypeParamType, t.getId(), success, fail);
    }

	/**
	 * Unset the current Type from the ParamType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Type must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkType
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    unlinkType(successCallback : Function = null, failCallback : Function = null) {
        if (this.type() === null) {
            failCallback(new ModelException("No type has been set for this ParamType."));
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

        this.deleteObjectAssociation(ParamType, TypeParamType, this.type().getId(), success, fail);
    }

	/**
	 * Set the Constraint of the ParamType.
	 * As a ParamType can only have one Constraint, if the value is already set, this method throws an exception: you need first to unset the Constraint.
	 * Moreover the given Constraint must be created in database.
	 *
     * @method linkConstraint
	 * @param {ConstraintParamType} t The Constraint to associate with the ParamType.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkConstraint(c : ConstraintParamType, successCallback : Function = null, failCallback : Function = null) {
		if (!c || !c.getId()) {
            failCallback(new ModelException("The constraint must be an existing object to be associated."));
            return;
		}

		if (this.constraint() !== null) {
            failCallback(new ModelException("The constraint is already set for this CallType."))
            return;
		}

        var self = this;

        var success : Function = function() {
            c.desynchronize();
            self._constraint = c;
            self._constraint_loaded = true;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.associateObject(ParamType, ConstraintParamType, c.getId(), success, fail);
	}

	/**
	 * Unset the current Constraint from the ParamType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Constraint must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkConstraint
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkConstraint(successCallback : Function = null, failCallback : Function = null) {
		if (this.constraint() === null) {
            failCallback(new ModelException("No constraint has been set for this ParamType."));
            return;
		}

        var self = this;

        var success : Function = function() {
            self.constraint().desynchronize();
            self._constraint = null;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(ParamType, ConstraintParamType, this.constraint().getId(), success, fail);
	}

	/**
	 * Set the DefaultValue of the ParamType.
	 * As a ParamType can only have one DefaultValue, if the value is already set, this method throws an exception: you need first to unset the DefaultValue.
	 * Moreover the given DefaultValue must be created in database.
	 *
     * @method linkDefaultValue
	 * @param {ParamValue} t The DefaultValue to associate with the ParamType.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkDefaultValue(d : ParamValue, successCallback : Function = null, failCallback : Function = null) {
		if (!d || !d.getId()) {
            failCallback(new ModelException("The defaultValue must be an existing object to be associated."));
            return;
		}

		if (this.defaultValue() !== null) {
            failCallback(new ModelException("The defaultValue is already set for this CallType."));
            return;
		}

        var self = this;

        var success : Function = function() {
            d.desynchronize();
            self._default_value = d;
            self._default_value_loaded = true;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.associateObject(ParamType, ParamValue, d.getId(), success, fail);
	}

	/**
	 * Unset the current DefaultValue from the ParamType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A DefaultValue must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkDefaultValue
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkDefaultValue(successCallback : Function = null, failCallback : Function = null) {
		if (this.defaultValue() === null) {
            failCallback(new ModelException("No defaultValue has been set for this ParamType."));
            return;
		}

        var self = this;

        var success : Function = function() {
            self.defaultValue().desynchronize();
            self._default_value = null;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(ParamType, ParamValue, this.defaultValue().getId(), success, fail);
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
        this.createObject(ParamType, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(ParamType, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(ParamType, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return this.deleteObject(ParamType, successCallback, failCallback, attemptNumber);
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
        return this.allObjects(ParamType, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return a ParamType instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Call} The model instance.
	 */
	static parseJSON(jsonString : string) : ParamType {
		return ParamType.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a ParamType instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Call} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : ParamType {
		if(!jsonObject.id) {
			throw new ModelException("A ParamType object should have an ID.");
		}
		if(jsonObject.complete == undefined || jsonObject.complete == null) {
			throw new ModelException("A ParamType object should have a complete attribute.");
		}
		return new ParamType(jsonObject.name, jsonObject.description, jsonObject.id, jsonObject.complete);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "ParamTypes";
    }
}