/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="./ModelItf.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />


/**
 * Model : Behaviour
 *
 * @class Behaviour
 * @extends ModelItf
 */
class Behaviour extends ModelItf {

	/**
	 * Name property.
	 *
	 * @property _name
	 * @type string
	 */
	private _name:string;

	/**
	 * Description property.
	 *
	 * @property _description
	 * @type string
	 */
	private _description:string;

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {string} name - The Behaviour's name.
	 * @param {string} description - The Behaviour's description.
	 * @param {number} id - The Behaviour's ID.
	 * @param {string} createdAt - The Behaviour's createdAt.
	 * @param {string} updatedAt - The Behaviour's updatedAt.
	 */
	constructor(name : string = "", description : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

		this.setName(name);
		this.setDescription(description);
	}

	/**
	 * Set the Behaviour's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

	/**
	 * Set the Behaviour's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string) {
		this._description = description;
	}

	/**
	 * Return the Behaviour's name.
	 *
	 * @method name
	 */
	name() {
		return this._name;
	}

	/**
	 * Return the Behaviour's description.
	 *
	 * @method description
	 */
	description() {
		return this._description;
	}

	/**
	 * Check completeness of a behaviour.
	 * The completeness is determined by the presence of a name and an id.
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
	 * Return a Behaviour instance as a JSON Object
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
     * Create model in database.
     *
     * @method create
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    create(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
		this.createObject(Behaviour, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(Behaviour, id, successCallback, failCallback, attemptNumber);
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
	    return this.updateObject(Behaviour, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
		return ModelItf.deleteObject(Behaviour, this.getId(), successCallback, failCallback, attemptNumber);
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
		return this.allObjects(Behaviour, successCallback, failCallback, attemptNumber);
	}

	/**
	 * Return a Behaviour instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Behaviour} The model instance.
	 */
	static parseJSON(jsonString : string) : Behaviour {
		return Behaviour.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a Behaviour instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Behaviour} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : Behaviour {
		return new Behaviour(jsonObject.name, jsonObject.description, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
	}

	/**
	 * Retrieve DataBase Table Name.
	 *
	 * @method getTableName
	 * @return {string} The DataBase Table Name corresponding to Model.
	 */
	static getTableName() : string {
		return "Behaviours";
	}
}