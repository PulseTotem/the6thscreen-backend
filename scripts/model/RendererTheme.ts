/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./InfoType.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />


/**
 * Model : RendererTheme
 *
 * @class RendererTheme
 * @extends ModelItf
 */
class RendererTheme extends ModelItf {

    /**
     * Name property.
     *
     * @property _name
     * @type string
     */
    private _name : string;

	/**
	 * Renderer property
	 *
	 * @property _renderer
	 * @type Renderer
	 */
	private _renderer : Renderer;

	/**
	 * Lazy loading for Renderer property
	 *
	 * @property _renderer_loaded
	 * @type boolean
	 */
	private _renderer_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The RendererTheme's name.
     * @param {number} id - The RendererTheme's ID.
	 * @param {string} createdAt - The RendererTheme's createdAt.
	 * @param {string} updatedAt - The RendererTheme's updatedAt.
     */
    constructor(name : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

        this.setName(name);

		this._renderer = null;
		this._renderer_loaded = false;
    }

	/**
	 * Set the RendererTheme's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

    /**
     * Return the RendererTheme's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

	/**
	 * Return the Renderer in which the theme is stored
	 *
	 * @method renderer
	 * @returns {Renderer}
     */
	renderer() {
		return this._renderer;
	}

	/**
	 * Load the renderer
	 *
	 * @method loadRenderer
	 * @param successCallback
	 * @param failCallback
     */
	loadRenderer(successCallback : Function, failCallback : Function) {
		if (! this._renderer_loaded) {
			var self = this;

			var successLoad = function (renderer) {
				self._renderer = renderer;
				self._renderer_loaded = true;

				successCallback();
			};

			var fail = function (error) {
				failCallback(error);
			};

			this.getUniquelyAssociatedObject(RendererTheme, Renderer, successLoad, fail);
		} else {
			successCallback();
		}
	}

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Return a RendererTheme instance as a JSON Object
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
	 * Check whether the object is complete or not
	 *
	 * A RendererTheme is complete if it has an ID, and a name.
	 *
	 * @param successCallback The function to call in case of success.
	 * @param failCallback The function to call in case of failure.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) {
		var self = this;

		var success : Function = function () {
			self._complete = (self._complete && !!self.name());
			successCallback();
		}

		super.checkCompleteness(success, failCallback);
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
        this.createObject(RendererTheme, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(RendererTheme, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(RendererTheme, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return ModelItf.deleteObject(RendererTheme, this.getId(), successCallback, failCallback, attemptNumber);
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
        return this.allObjects(RendererTheme, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return a RendererTheme instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {RendererTheme} The model instance.
	 */
	static parseJSON(jsonString : string) : RendererTheme {
		return RendererTheme.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a RendererTheme instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {RendererTheme} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : RendererTheme {
		return new RendererTheme(jsonObject.name, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
	}

	/**
	 * Determine if the object is an orphan or not. Sucesscallback return a boolean.
	 * @param successCallback
	 * @param failCallback
	 */
	isOrphan(successCallback, failCallback) {
		var self = this;

		var successLoadRenderer = function () {
			var result = (self.renderer() == null);
			successCallback(result);
		};

		this.loadRenderer(successLoadRenderer, failCallback);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "RendererThemes";
    }
}