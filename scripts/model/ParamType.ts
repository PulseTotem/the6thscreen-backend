/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./TypeParamType.ts" />
/// <reference path="./ConstraintParamType.ts" />
/// <reference path="./ParamValue.ts" />
/// <reference path="./Source.ts" />

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
	 * @property _sources : The sources in which the paramType is used.
	 * @type Array<Source>
	 * @private
	 */
	private _sources : Array<Source>;

	/**
	 * @property _sources_loaded : lazy loading for sources
	 * @type boolean
	 * @private
	 */
	private _sources_loaded : boolean;

	/**
	 * @property _paramValues : paramvalues associated with this paramType
	 * @type Array<ParamValue>
	 * @private
	 */
	private _paramValues : Array<ParamValue>;

	/**
	 * @roperty _paramValues_loaded : lazy loading for paramValue
	 * @type boolean
	 * @private
	 */
	private _paramValues_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The ParamType's name.
     * @param {string} description - The ParamType's description.
     * @param {number} id - The ParamType's ID.
	 * @param {string} createdAt - The ParamType's createdAt.
	 * @param {string} updatedAt - The ParamType's updatedAt.
     */
    constructor(name : string = "", description : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

        this.setName(name);
	    this.setDescription(description);

	    this._constraint = null;
	    this._constraint_loaded = false;

	    this._default_value = null;
	    this._default_value_loaded = false;

	    this._type = null;
	    this._type_loaded = false;

		this._sources = new Array<Source>();
		this._sources_loaded = false;

		this._paramValues = new Array<ParamValue>();
		this._paramValues_loaded = false;
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
    loadType(successCallback : Function, failCallback : Function) {
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
    loadConstraint(successCallback : Function, failCallback : Function) {
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
    loadDefaultValue(successCallback : Function, failCallback : Function) {
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

            this.getUniquelyAssociatedObject(ParamType, ParamValue, success, fail, 0, "DefaultValues");
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

	/**
	 * Get sources of the paramtype
	 *
	 * @method sources
	 * @returns {Array<Source>}
     */
	sources() {
		return this._sources;
	}

	/**
	 * Load source for this param type
	 *
	 * @method loadSources
	 * @param successCallback
	 * @param failCallback
     */
	loadSources(successCallback : Function, failCallback : Function) {
		if (!this._sources_loaded) {
			var self = this;
			var success = function (sources) {
				self._sources = sources;
				self._sources_loaded = true;

				successCallback();
			};

			var fail = function (error) {
				failCallback(error);
			};

			this.getAssociatedObjects(ParamType, Source, success, fail);
		} else {
			successCallback();
		}
	}

	/**
	 * Get paramValue for this paramType
	 *
	 * @method paramValues
	 * @returns {Array<ParamValue>}
     */
	paramValues() {
		return this._paramValues;
	}

	/**
	 * Load paramValue for this paramType
	 *
	 * @method loadParamValues
	 * @param successCallback
	 * @param failCallback
     */
	loadParamValues(successCallback : Function, failCallback : Function) {
		if (!this._paramValues_loaded) {
			var self = this;

			var success = function (paramValues) {
				self._paramValues = paramValues;
				self._paramValues_loaded = true;

				successCallback();
			};

			var fail = function (error) {
				failCallback(error);
			};

			this.getAssociatedObjects(ParamType, ParamValue, success, fail);
		} else {
			successCallback();
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
            if(self._type_loaded && self._constraint_loaded && self._default_value_loaded && self._sources_loaded && self._paramValues_loaded) {
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
		this.loadSources(success, fail);
		this.loadParamValues(success, fail);
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

				var successAsso : Function = function () {
					self._complete = (self.type() !== null && self.type().isComplete());
					successCallback();
				};

				var fail:Function = function (error) {
					failCallback(error);
				};

                if (!self._type_loaded) {
                    self.loadType(successAsso, fail);
                } else {
                    successAsso();
                }

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
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
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
    toCompleteJSONObject(successCallback : Function, failCallback : Function, onlyId : boolean = false) {
        var self = this;

        var success : Function = function() {
            var data = self.toJSONObject();

	        if (onlyId) {
		        data["type"] = (self.type() !== null) ? self.type().getId() : null;
		        data["constraint"] = (self.constraint() !== null) ? self.constraint().getId() : null;
		        data["defaultValue"] = (self.defaultValue() !== null) ? self.defaultValue().getId() : null;
	        } else {
		        data["type"] = (self.type() !== null) ? self.type().toJSONObject() : null;
		        data["constraint"] = (self.constraint() !== null) ? self.constraint().toJSONObject() : null;
		        data["defaultValue"] = (self.defaultValue() !== null) ? self.defaultValue().toJSONObject() : null;
	        }

			data["sources"] = self.serializeArray(self.sources(), onlyId);
			data["paramValues"] = self.serializeArray(self.paramValues(), onlyId);
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
    linkType(typeID : number, successCallback : Function, failCallback : Function) {
        this.associateObject(ParamType, TypeParamType, typeID, successCallback, failCallback);
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
    unlinkType(typeID : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(ParamType, TypeParamType, typeID, successCallback, failCallback);
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
	linkConstraint(constraintID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(ParamType, ConstraintParamType, constraintID, successCallback, failCallback);
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
	unlinkConstraint(constraintID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(ParamType, ConstraintParamType, constraintID, successCallback, failCallback);
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
	linkDefaultValue(defaultValueId : number, successCallback : Function, failCallback : Function) {
        var self = this;
        var successReadParamValue = function (paramValue : ParamValue) {
            var successLinkParamType = function () {
                var successCheck = function () {
                    self.associateObject(ParamType, ParamValue, defaultValueId, successCallback, failCallback, 0, "DefaultValues");
                };

                paramValue.checkCompleteness(successCheck, failCallback);
            };

            paramValue.linkParamType(self.getId(), successLinkParamType, failCallback);
        };
        ParamValue.read(defaultValueId, successReadParamValue, failCallback);
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
	unlinkDefaultValue(defaultValueId : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(ParamType, ParamValue, defaultValueId, successCallback, failCallback, 0, "DefaultValues");
	}

	/**
	 * Add a source to the ParamType.
	 *
	 * @param sourceId : the id of the source to add
	 * @param successCallback
	 * @param failCallback
     */
	addSource(sourceId : number, successCallback : Function, failCallback : Function) {
		this.associateObject(ParamType, Source, sourceId, successCallback, failCallback);
	}

	/**
	 * Remove a source to the ParamType
	 *
	 * @param sourceId : the id of the source to remove
	 * @param successCallback
	 * @param failCallback
     */
	removeSource(sourceId : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(ParamType, Source, sourceId, successCallback, failCallback);
	}

	/**
	 * Add a paramValue to the paramType
	 *
	 * @param paramValueId : the id of the paramValue to add
	 * @param successCallback
	 * @param failCallback
     */
	addParamValue(paramValueId : number, successCallback : Function, failCallback : Function) {
		this.associateObject(ParamType, ParamValue, paramValueId, successCallback, failCallback);
	}

	/**
	 * Remove a paramValue from the paramType
	 *
	 * @param paramValueId: the id of the paramValue to remove
	 * @param successCallback
	 * @param failCallback
     */
	removeParamValue(paramValueId : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(ParamType, ParamValue, paramValueId, successCallback, failCallback);
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
    static read(id : number, successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
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
    update(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
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
    delete(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {

        var self = this;

        var successLoadAsso = function () {
			var successDeleteDefaultParamValue = function () {
				var nbSources = self.sources().length;

				var successRemoveSource = function () {
					nbSources--;

					if (nbSources <= 0) {
						var nbParamValues = self.paramValues().length;

						var successDeleteParamValue = function () {
							nbParamValues--;

							if (nbParamValues <= 0) {
								ModelItf.deleteObject(ParamType, self.getId(), successCallback, failCallback);
							}
						};

						if (nbParamValues == 0) {
							successDeleteParamValue();
						} else {
							self.paramValues().forEach(function (paramValue : ParamValue) {
								paramValue.delete(successDeleteParamValue, failCallback);
							});
						}
					}
				};

				if (nbSources == 0) {
					successRemoveSource();
				} else {
					self.sources().forEach( function (source : Source) {
						self.removeSource(source.getId(), successRemoveSource, failCallback);
					});
				}
			};

            if (self.defaultValue() == null) {
				successDeleteDefaultParamValue();
            } else {
                self.defaultValue().delete(successDeleteDefaultParamValue, failCallback);
            }
        };


        this.loadAssociations(successLoadAsso, failCallback);
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
		return new ParamType(jsonObject.name, jsonObject.description, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
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