/**
 * @author Simon Urli <simon@the6thscreen.fr>
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : RelativeTimeline
 *
 * @class RelativeTimeline
 * @extends ModelItf
 */
class RelativeTimeline extends ModelItf {

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
     * @param {string} name - The RelativeTimeline's name.
     * @param {number} id - The RelativeTimeline's ID.
     */
    constructor(name : string = "", id : number = null, complete : boolean = false) {
        super(id, complete);

        this.setName(name);
    }

	/**
	 * Set the RelativeTimeline's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

    /**
     * Return the RelativeTimeline's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Return a RelativeTimeline instance as a JSON Object
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
	 * Compute the completeness of a RelativeTimeline.
	 * The completeness is given by the presence of an ID and a name.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) : void {
		var self = this;

		var success : Function = function () {
			self._complete = (self._complete && !!self.name());
			successCallback();
		}

		super.checkCompleteness(success,failCallback);
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
        this.createObject(RelativeTimeline, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(RelativeTimeline, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(RelativeTimeline, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return ModelItf.deleteObject(RelativeTimeline, this.getId(), successCallback, failCallback, attemptNumber);
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
        return this.allObjects(RelativeTimeline, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return a RelativeTimeline instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {RelativeTimeline} The model instance.
	 */
	static parseJSON(jsonString : string) : RelativeTimeline {
		return RelativeTimeline.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a RelativeTimeline instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {RelativeTimeline} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : RelativeTimeline {
		return new RelativeTimeline(jsonObject.name, jsonObject.id, jsonObject.complete);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "RelativeTimelines";
    }
}