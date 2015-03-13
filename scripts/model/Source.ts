/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./InfoType.ts" />
/// <reference path="./ParamType.ts" />
/// <reference path="./ParamValue.ts" />
/// <reference path="./Service.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : Source
 *
 * @class Source
 * @extends ModelItf
 */
class Source extends ModelItf {

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
	 * Methode property.
	 *
	 * @property _method
	 * @type string
	 */
	private _method : string;

	/**
	 * Service property
	 *
	 * @property _service
	 * @type Service
	 */
	private _service : Service;

	/**
	 * Lazy loading for service property
	 *
	 * @property _service_loaded
	 * @type boolean
	 */
	private _service_loaded : boolean;

    /**
     * InfoType property.
     *
     * @property _info_type
     * @type InfoType
     */
    private _info_type : InfoType;

    /**
     * Lazy loading for InfoType property.
     *
     * @property _info_type_loaded
     * @type boolean
     */
    private _info_type_loaded : boolean;

    /**
     * ParamTypes property.
     *
     * @property _param_types
     * @type Array<ParamType>
     */
    private _param_types : Array<ParamType>;

    /**
     * Lazy loading for ParamTypes property.
     *
     * @property _param_types_loaded
     * @type boolean
     */
    private _param_types_loaded : boolean;

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
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Source's name.
     * @param {string} service - The Source's service.
     * @param {string} description - The Source's description.
     * @param {string} host - The Source's host.
     * @param {number} port - The Source's port.
     * @param {number} id - The Source's ID.
     */
    constructor(name : string = "", description : string = "", method : string = "", id : number = null, complete : boolean = false) {
        super(id, complete);

        this.setName(name);
	    this.setDescription(description);
	    this.setMethod(method);

	    this._service = null;
	    this._service_loaded = false;

        this._info_type = null;
        this._info_type_loaded = false;

        this._param_types = new Array<ParamType>();
        this._param_types_loaded = false;

        this._param_values = new Array<ParamValue>();
        this._param_values_loaded = false;
    }

	/**
	 * Set the Source's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

	/**
	 * Set the Source's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string = "") {
		this._description = description;
	}

	/**
	 * Set the Source's method.
	 *
	 * @method setMethod
	 */
	setMethod(method : string) {
		this._method = method;
	}

	/**
     * Return the Source's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Return the Source's description.
     *
     * @method description
     */
    description() {
        return this._description;
    }

	/**
	 * Return the Source's method.
	 *
	 * @method method
	 */
	method() {
		return this._method;
	}

	/**
	 * Return the Source's service.
	 *
	 * @method service
	 */
	service() {
		return this._service;
	}

	/**
	 * Load the Source's service.
	 *
	 * @method loadService
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadService(successCallback : Function = null, failCallback : Function = null) {
		if(! this._service_loaded) {
			var self = this;
			var success : Function = function(service) {
				if(!!service) {
					self._service = service;
				}
				self._service_loaded = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getUniquelyAssociatedObject(Source, Service, success, fail);
		} else {
			if(successCallback != null) {
				successCallback();
			}
		}
	}

    /**
     * Return the Source's infoType.
     *
     * @method infoType
     */
    infoType() {
        return this._info_type;
    }

    /**
     * Load the Source's infoType.
     *
     * @method loadInfoType
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadInfoType(successCallback : Function = null, failCallback : Function = null) {
        if(! this._info_type_loaded) {
            var self = this;
            var success : Function = function(infoType) {
                if(!!infoType) {
                    self._info_type = infoType;
                }
                self._info_type_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(Source, InfoType, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

    /**
     * Return the Source's paramTypes.
     *
     * @method paramTypes
     */
    paramTypes() {
        return this._param_types;
    }

    /**
     * Load the Source's paramTypes.
     *
     * @method loadParamTypes
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadParamTypes(successCallback : Function = null, failCallback : Function = null) {
        if(! this._param_types_loaded) {
            var self = this;
            var success : Function = function(paramTypes) {
                self._param_types = paramTypes;
                self._param_types_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getAssociatedObjects(Source, ParamType, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

    /**
     * Return the Source's paramValues.
     *
     * @method paramValues
     */
    paramValues() {
        return this._param_values;
    }

    /**
     * Load the Source's paramValues.
     *
     * @method loadParamValues
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadParamValues(successCallback : Function = null, failCallback : Function = null) {
        if(! this._param_values_loaded) {
            var self = this;
            var success : Function = function(paramValues) {
                self._param_values = paramValues;
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

            this.getAssociatedObjects(Source, ParamValue, success, fail);
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
            if(self._param_types_loaded && self._param_values_loaded && self._info_type_loaded && self._service_loaded) {
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


        this.loadParamTypes(success, fail);
        this.loadParamValues(success, fail);
        this.loadInfoType(success, fail);
	    this.loadService(success, fail);
    }

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._info_type_loaded = false;
		this._param_types_loaded = false;
		this._param_values_loaded = false;
		this._service_loaded = false;
	}

	/**
	 * Return a Source instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"description": this.description(),
			"method": this.method(),
			"complete": this.isComplete()
		};
		return data;
	}

	/**
	 * Check whether the object is complete or not
	 *
	 * A Source is complete if it has an ID, a name, a method, a service and an infotype.
	 *
	 * @param successCallback The function to call in case of success.
	 * @param failCallback The function to call in case of failure.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) {
		var self = this;

		var success : Function = function () {
			if (self.isComplete() && !!self.name() && !!self.method()) {

				var success:Function = function () {
					if (self._info_type_loaded && self._service_loaded) {
						self._complete = (!!self.infoType() && self.infoType().isComplete() && !!self.service() && self.service().isComplete());
						successCallback();
					}
				};

				var fail:Function = function (error) {
					failCallback(error);
				};

				self.loadInfoType(success, fail);
				self.loadService(success, fail);
			} else {
				self._complete = false;
				successCallback();
			}
		};
		super.checkCompleteness(success, failCallback);
	}

	/**
     * Return a Source instance as a JSON Object including associated object.
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
	        data["service"] = (self.service() !== null) ? self.service().toJSONObject() : null;
            data["infoType"] = (self.infoType() !== null) ? self.infoType().toJSONObject() : null;
            data["paramTypes"] = self.serializeArray(self.paramTypes());
            data["paramValues"] = self.serializeArray(self.paramValues());

            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

	/**
	 * Set the Service of the Source.
	 *
	 * @method linkService
	 * @param {Service} it The Service to associate with the Source.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	linkService(serviceID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(Source, Service, serviceID, successCallback, failCallback);
	}

	/**
	 * Unset the current Service from the Source.
	 *
	 * @method unlinkService
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkService(successCallback : Function, failCallback : Function) {
		var self = this;

		var success : Function = function() {
			if (!!self._service) {
				self._service.desynchronize();
			}
			self._service = null;

			successCallback();
		};

		var fail : Function = function(error) {
			failCallback(error);
		};

		this.deleteUniqueObjectAssociation(Source, Service, success, fail);
	}

	/**
	 * Set the InfoType of the Source.
	 * As a Source can only have one InfoType, if the value is already set, this method throws an exception: you need first to unset the InfoType.
	 * Moreover the given type must be created in database.
	 *
     * @method linkInfoType
	 * @param {InfoType} it The InfoType to associate with the Source.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkInfoType(it : InfoType, successCallback : Function = null, failCallback : Function = null) {
		if (!it || !it.getId()) {
			failCallback(new ModelException("The InfoType must be an existing object to be associated."));
            return;
		}

		if (this.infoType() !== null) {
			failCallback(new ModelException("The InfoType is already set for this Source."));
            return;
		}

        var self = this;

        var success : Function = function() {
            it.desynchronize();
            self._info_type = it;
            self._info_type_loaded = true;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.associateObject(Source, InfoType, it.getId(), success, fail);
	}

	/**
	 * Unset the current InfoType from the Source.
	 * It both sets a null value for the object property and remove the association in database.
	 * An InfoType must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkInfoType
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkInfoType(successCallback : Function = null, failCallback : Function = null) {
		if (this.infoType() === null) {
			failCallback(new ModelException("No InfoType has been set for this Source."));
            return;
		}

        var self = this;

        var success : Function = function() {
            self.infoType().desynchronize();
            self._info_type = null;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(Source, InfoType, this.infoType().getId(), success, fail);
	}

	/**
	 * Add a new ParamType to the Source and associate it in the database.
	 * A ParamType can only be added once.
	 *
     * @method addParamType
	 * @param {ParamType} pt The ParamType to add inside the Source. It cannot be a null value.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	addParamType(paramID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(Source, ParamType, paramID, successCallback, failCallback);
	}

	/**
	 * Remove a ParamType from the Source: the association is removed both in the object and in database.
	 * The ParamType can only be removed if it exists first in the list of associated ParamTypes, else an exception is thrown.
	 *
     * @method removeParamType
	 * @param {ParamType} pt The ParamType to remove from that Source
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	removeParamType(pt : ParamType, successCallback : Function = null, failCallback : Function = null) {
		if (!pt  || !pt.getId()) {
			failCallback(new ModelException("The ParamType must be an existing object to be removed."));
            return;
		}

		if (!ModelItf.isObjectInsideArray(this.paramTypes(), pt)) {
			failCallback(new ModelException("The ParamType you try to remove is not yet associated."));
            return;
		}

        var self = this;

        var success : Function = function() {
            pt.desynchronize();
            ModelItf.removeObjectFromArray(self.paramTypes(), pt);

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(Source, ParamType, pt.getId(), success, fail);
	}

    /**
     * Add a new ParamValue to the Source and associate it in the database.
     * A ParamValue can only be added once.
     *
     * @method addParamValue
     * @param {ParamValue} p The ParamValue to add inside the source. It cannot be a null value.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    addParamValue(p : ParamValue, successCallback : Function = null, failCallback : Function = null) {
        if (!p || !p.getId()) {
            failCallback(new ModelException("The ParamValue must be an existing object to be associated."));
            return;
        }

        if (ModelItf.isObjectInsideArray(this.paramValues(), p)) {
            failCallback(new ModelException("You cannot add twice a parameter in a source."));
            return;
        }

        var self = this;

        var success : Function = function() {
            p.desynchronize();
            self.paramValues().push(p);

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.associateObject(Source, ParamValue, p.getId(), success, fail);
    }

    /**
     * Remove a ParamValue from the Source: the association is removed both in the object and in database.
     * The ParamValue can only be removed if it exists first in the list of associated ParamValue, else an exception is thrown.
     *
     * @method removeParamValue
     * @param {ParamValue} p The ParamValue to remove from that Source
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    removeParamValue(p : ParamValue, successCallback : Function = null, failCallback : Function = null) {
        if (!p || !p.getId()) {
            failCallback(new ModelException("The ParamValue must be an existing object to be removed."));
            return;
        }
        if (!ModelItf.isObjectInsideArray(this.paramValues(), p)) {
            failCallback(new ModelException("The ParamValue you try to remove has not been added to the current Source"));
            return;
        }

        var self = this;

        var success : Function = function() {
            p.desynchronize();
            ModelItf.removeObjectFromArray(self.paramValues(), p);

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(Source, ParamValue, p.getId(), success, fail);
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
        this.createObject(Source, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(Source, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(Source, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return this.deleteObject(Source, successCallback, failCallback, attemptNumber);
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
        return this.allObjects(Source, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return a Source instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Source} The model instance.
	 */
	static parseJSON(jsonString : string) : Source {
		return Source.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a Source instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Source} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : Source {
		if(!jsonObject.id) {
			throw new ModelException("A Source object should have an ID.");
		}
		if(jsonObject.complete == undefined || jsonObject.complete == null) {
			throw new ModelException("A Source object should have a complete attribute.");
		}
		return new Source(jsonObject.name, jsonObject.description, jsonObject.method, jsonObject.id, jsonObject.complete);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Sources";
    }
}