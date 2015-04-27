/**
 * @author Simon Urli <simon@the6thscreen.fr>
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : Policy
 *
 * @class Policy
 * @extends ModelItf
 */
class Policy extends ModelItf {

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
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Policy's name.
     * @param {string} description - The Policy's description.
     * @param {number} id - The RenderPolicy's ID.
     */
    constructor(name : string = "", description : string = "", id : number = null, complete : boolean = false) {
        super(id, complete);

        this.setName(name);
	    this.setDescription(description);
    }

	/**
	 * Set the Policy's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

	/**
	 * Set the Policy's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string) {
		this._description = description;
	}

    /**
     * Return the Policy's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Return the Policy's description.
     *
     * @method description
     */
    description() {
        return this._description;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Return a Policy instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"description": this.description(),
			"complete": false
		};
		return data;
	}

	/**
	 * Check if the object is complete.
	 *
	 * A Policy is complete if it has an ID and a name.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) : void {
		var self = this;

		var success : Function = function() {
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
        this.createObject(RenderPolicy, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(RenderPolicy, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(RenderPolicy, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return ModelItf.deleteObject(RenderPolicy, this.getId(), successCallback, failCallback, attemptNumber);
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
        return this.allObjects(RenderPolicy, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return a Policy instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {RenderPolicy} The model instance.
	 */
	static parseJSON(jsonString : string) : RenderPolicy {
		return RenderPolicy.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a Policy instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {RenderPolicy} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : RenderPolicy {
		return new RenderPolicy(jsonObject.name, jsonObject.description, jsonObject.id, jsonObject.complete);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Policies";
    }
}