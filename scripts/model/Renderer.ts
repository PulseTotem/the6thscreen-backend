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
     */
    constructor(name : string, description : string = "", id : number = null) {
        super(id);

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
		if(!name) {
			throw new ModelException("A name is mandatory for Renderer.");
		}

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
	 * /
	loadAssociations() : void {
		this.infoType();
	}*/

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
			"description": this.description()
		};
		return data;
	}

	/**
	 * Return a Renderer instance as a JSON Object including associated object.
	 * However the method should not be recursive due to cycle in the model.
	 *
	 * @method toCompleteJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 * /
	toCompleteJSONObject() : Object {
		this.loadAssociations();
		var data = this.toJSONObject();
		data["infoType"] = (this.infoType() !== null) ? this.infoType().toJSONObject() : null;
		return data;
	}*/

    /**
     * Return a Renderer instance as a JSON Object including associated object.
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
            data["infoType"] = (self.infoType() !== null) ? self.infoType().toJSONObject() : null;
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
     * @method setInfoType
	 * @param {InfoType} it The InfoType to associate with the Renderer.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setInfoType(it : InfoType) : boolean {
		if (!it || !it.getId()) {
			throw new ModelException("The InfoType must be an existing object to be associated.");
		}

		if (this.infoType() !== null) {
			throw new ModelException("The InfoType is already set for this Renderer.");
		}

		if (this.associateObject(Renderer, InfoType, it.getId())) {
			it.desynchronize();
			this._info_type = it;
			this._info_type_loaded = true;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Unset the current InfoType from the Renderer.
	 * It both sets a null value for the object property and remove the association in database.
	 * An InfoType must have been set before using it, else an exception is thrown.
	 *
     * @method unsetInfoType
	 * @returns {boolean} Returns true if the InfoType is well unset and the association removed in database.
	 */
	unsetInfoType() : boolean {
		if (this.infoType() === null) {
			throw new ModelException("No InfoType has been set for this Renderer.");
		}

		if (this.deleteObjectAssociation(Renderer, InfoType, this.infoType().getId())) {
			this.infoType().desynchronize();
			this._info_type = null;
			return true;
		} else {
			return false;
		}
	}

    /**
     * Create model in database.
     *
     * @method create
     * @return {boolean} Create status
     */
    create() : boolean {
        return this.createObject(Renderer, this.toJSONObject())
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {Renderer} The model instance.
     * /
    static read(id : number) : Renderer {
        return this.readObject(Renderer, id);
    }*/

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
        ModelItf.readObject(Renderer, id, successCallback, failCallback, attemptNumber);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        return this.updateObject(Renderer, this.toJSONObject());
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        return this.deleteObject(Renderer);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<Renderer>} The model instances.
     */
    static all() : Array<Renderer> {
        return this.allObjects(Renderer);
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
		if(!jsonObject.id) {
			throw new ModelException("A Renderer object should have an ID.");
		}
		if(!jsonObject.name) {
			throw new ModelException("A Renderer object should have a name.");
		}
		if(!jsonObject.description) {
			throw new ModelException("A Renderer object should have a description.");
		}
		return new Renderer(jsonObject.name, jsonObject.description, jsonObject.id);
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