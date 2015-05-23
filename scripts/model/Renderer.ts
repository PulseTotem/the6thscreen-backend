/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./InfoType.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />


/**
 * Model : Renderer
 *
 * @class Renderer
 * @extends ModelItf
 */
class Renderer extends ModelItf {

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
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Renderer's name.
     * @param {string} description - The Renderer's description.
     * @param {number} id - The Renderer's ID.
	 * @param {string} createdAt - The Renderer's createdAt.
	 * @param {string} updatedAt - The Renderer's updatedAt.
     */
    constructor(name : string = "", description : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

        this.setName(name);
	    this.setDescription(description);

        this._info_type = null;
        this._info_type_loaded = false;
    }

	/**
	 * Set the Renderer's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

	/**
	 * Set the Renderer's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string) {
		this._description = description;
	}

    /**
     * Return the Renderer's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Return the Renderer's description.
     *
     * @method description
     */
    description() {
        return this._description;
    }

    /**
     * Return the Renderer's infoType.
     *
     * @method infoType
     */
    infoType() {
        return this._info_type;
    }

    /**
     * Load the Renderer's infoType.
     *
     * @method loadInfoType
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadInfoType(successCallback : Function, failCallback : Function) {
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

            this.getUniquelyAssociatedObject(Renderer, InfoType, success, fail);
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
            if(self._info_type_loaded) {
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

        this.loadInfoType(success, fail);
    }

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._info_type_loaded = false;
	}

	/**
	 * Return a Renderer instance as a JSON Object
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
	 * Check whether the object is complete or not
	 *
	 * A Renderer is complete if it has an ID, a name and an infotype.
	 *
	 * @param successCallback The function to call in case of success.
	 * @param failCallback The function to call in case of failure.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) {
		var self = this;

		var success : Function = function () {
			if (self.isComplete() && !!self.name()) {

				var successAsso : Function = function () {
					self._complete = (!!self.infoType() && self.infoType().isComplete());
					successCallback();
				};

				var fail:Function = function (error) {
					failCallback(error);
				};

				self.loadInfoType(successAsso, fail);
			} else {
				self._complete = false;
				successCallback();
			}
		}

		super.checkCompleteness(success, failCallback);

	}

    /**
     * Return a Renderer instance as a JSON Object including associated object.
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
		        data["infoType"] = (self.infoType() !== null) ? self.infoType().getId() : null;
	        } else {
		        data["infoType"] = (self.infoType() !== null) ? self.infoType().toJSONObject() : null;
	        }
            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

	/**
	 * Set the InfoType of the Renderer.
	 * As a Renderer can only have one InfoType, if the value is already set, this method throws an exception: you need first to unset the InfoType.
	 * Moreover the given type must be created in database.
	 *
     * @method linkInfoType
	 * @param {InfoType} it The InfoType to associate with the Renderer.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkInfoType(typeID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(Renderer, InfoType, typeID, successCallback, failCallback);
	}

	/**
	 * Unset the current InfoType from the Renderer.
	 * It both sets a null value for the object property and remove the association in database.
	 * An InfoType must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkInfoType
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkInfoType(typeID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(Renderer, InfoType, typeID, successCallback, failCallback);
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
        this.createObject(Renderer, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(Renderer, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(Renderer, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return ModelItf.deleteObject(Renderer, this.getId(), successCallback, failCallback, attemptNumber);
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
        return this.allObjects(Renderer, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return a Renderer instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Renderer} The model instance.
	 */
	static parseJSON(jsonString : string) : Renderer {
		return Renderer.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a Renderer instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Renderer} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : Renderer {
		return new Renderer(jsonObject.name, jsonObject.description, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Renderers";
    }
}