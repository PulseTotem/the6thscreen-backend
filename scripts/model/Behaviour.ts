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
	 */
	constructor(name : string, description : string = "", id : number = null) {
		super(id);

		this.setName(name);
		this.setDescription(description);
	}

	/**
	 * Set the Behaviour's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		if(!name) {
			throw new ModelException("A name is mandatory for Behaviour.");
		}

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
	 * Return a Behaviour instance as a JSON Object
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
	 * Create model in database.
	 *
	 * @method create
	 * @return {boolean} Create status
	 */
	create() : boolean {
		return this.createObject(Behaviour, this.toJSONObject())
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
        ModelItf.readObject(Behaviour, id, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Update in database the model with current id.
	 *
	 * @method update
	 * @return {boolean} Update status
	 */
	update() : boolean {
		return this.updateObject(Behaviour, this.toJSONObject());
	}

	/**
	 * Delete in database the model with current id.
	 *
	 * @method delete
	 * @return {boolean} Delete status
	 */
	delete() : boolean {
		return this.deleteObject(Behaviour);
	}

	/**
	 * Retrieve all models from database and create corresponding model instances.
	 *
	 * @method all
	 * @return {Array<Behaviour>} The model instances.
	 */
	static all() : Array<Behaviour> {
		return this.allObjects(Behaviour);
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
		if(!jsonObject.id) {
			throw new ModelException("A Behaviour object should have an ID.");
		}
		if(!jsonObject.name) {
			throw new ModelException("A Behaviour object should have a name.");
		}
		if(!jsonObject.description) {
			throw new ModelException("A Behaviour object should have a description.");
		}
		return new Behaviour(jsonObject.name, jsonObject.description, jsonObject.id);
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