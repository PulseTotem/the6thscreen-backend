/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : ReceivePolicy
 *
 * @class ReceivePolicy
 * @extends ModelItf
 */
class ReceivePolicy extends ModelItf {

    /**
     * Name property.
     *
     * @property _name
     * @type string
     */
    private _name : string;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The ReceivePolicy's name.
     * @param {number} id - The ReceivePolicy's ID.
     */
    constructor(name : string = "", id : number = null) {
        super(id);
	    this.setName(name);
    }

	/**
	 * Set the ReceivePolicy's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

    /**
     * Return the ReceivePolicy's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Return a ReceivePolicy instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name()
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
    create(successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
        this.createObject(ReceivePolicy, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(ReceivePolicy, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(ReceivePolicy, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return this.deleteObject(ReceivePolicy, successCallback, failCallback, attemptNumber);
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
        return this.allObjects(ReceivePolicy, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return a ReceivePolicy instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {ReceivePolicy} The model instance.
	 */
	static parseJSON(jsonString : string) : ReceivePolicy {
		return ReceivePolicy.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a ReceivePolicy instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {ReceivePolicy} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : ReceivePolicy {
		if (!jsonObject.id) {
			throw new ModelException("A ReceivePolicy object should have an ID.");
		}
		return new ReceivePolicy(jsonObject.name, jsonObject.id);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "ReceivePolicies";
    }
}