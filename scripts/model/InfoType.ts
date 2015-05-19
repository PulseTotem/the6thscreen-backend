/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Renderer.ts" />
/// <reference path="./Source.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : InfoType
 *
 * @class InfoType
 * @extends ModelItf
 */
class InfoType extends ModelItf {

    /**
     * Name property.
     *
     * @property _name
     * @type string
     */
    private _name : string;

    /**
     * Sources property
     *
     * @property _sources
     * @type Array<Source>
     */
    private _sources : Array<Source>;

    /**
     * Lazy loading for sources property
     *
     * @property _sources_loaded
     * @type boolean
     */
    private _sources_loaded : boolean;

    /**
     * Renderers property
     *
     * @property _renderers
     * @type Array<Renderer>
     */
    private _renderers : Array<Renderer>;

    /**
     * Lazy loading for renderers property
     *
     * @property _renderers_loaded
     * @type boolean
     */
    private _renderers_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The InfoType's name.
     * @param {number} id - The InfoType's ID.
     */
    constructor(name : string = "", id : number = null, complete : boolean = false) {
        super(id, complete);

        this.setName(name);

        this._sources = new Array<Source>();
        this._sources_loaded = false;

        this._renderers = new Array<Renderer>();
        this._renderers_loaded = false;
    }

	/**
	 * Set the InfoType's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

    /**
     * Return the InfoType's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Return the Service's sources.
     *
     * @method sources
     */
    sources() {
        return this._sources;
    }

    /**
     * Load the InfoType's sources.
     *
     * @method loadSources
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadSources(successCallback : Function = null, failCallback : Function = null) {
        if(! this._sources_loaded) {
            var self = this;
            var success : Function = function(sources) {
                self._sources = sources;
                self._sources_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getAssociatedObjects(InfoType, Source, success, fail);
        }
    }

    /**
     * Return the InfoType's renderers.
     *
     * @method sources
     */
    renderers() {
        return this._renderers;
    }

    /**
     * Load the InfoType's renderers.
     *
     * @method loadRenderers
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadRenderers(successCallback : Function = null, failCallback : Function = null) {
        if(! this._renderers_loaded) {
            var self = this;
            var success : Function = function(renderers) {
                self._renderers = renderers;
                self._renderers_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getAssociatedObjects(InfoType, Renderer, success, fail);
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
            if(self._sources_loaded && self._renderers_loaded) {
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

        this.loadSources(success, fail);
        this.loadRenderers(success, fail);
    }

    /**
     * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
     */
    desynchronize() : void {
        super.desynchronize();
        this._sources_loaded = false;
        this._renderers_loaded = false;
    }

	/**
	 * Return a InfoType instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"complete": this.isComplete()
		};
		return data;
	}

	/**
	 * Compute the completeness of an InfoType.
	 * The completeness is given by the presence of an ID and a name.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) : void {

		var self = this;

		var success : Function = function () {
			self._complete = (self._complete && !!self.name());
			successCallback();
		};

		super.checkCompleteness(success, failCallback);
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
            data["sources"] = self.serializeArray(self.sources(), onlyId);
            data["renderers"] = self.serializeArray(self.renderers(), onlyId);
            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
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
        this.createObject(InfoType, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(InfoType, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(InfoType, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return ModelItf.deleteObject(InfoType, this.getId(), successCallback, failCallback, attemptNumber);
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
        return this.allObjects(InfoType, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return an InfoType instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Call} The model instance.
	 */
	static parseJSON(jsonString : string) : InfoType {
		return InfoType.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return an InfoType instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Call} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : InfoType {
		return new InfoType(jsonObject.name, jsonObject.id, jsonObject.complete);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "InfoTypes";
    }
}