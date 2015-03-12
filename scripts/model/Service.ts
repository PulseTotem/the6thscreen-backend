/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : Service
 *
 * @class Service
 * @extends ModelItf
 */
class Service extends ModelItf {

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
	 * Host property.
	 *
	 * @property _host
	 * @type string
	 */
	private _host : string;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @param name The name of the service
	 * @param description A description of the service
	 * @param host The host to reach the service
	 * @param id The DB id of the service
	 */
	constructor(name : string = "", description : string = "", host : string = "", id : number = null, complete : boolean = false) {
		super(id, complete);
		this.setName(name);
		this.setDescription(description);
		this.setHost(host);
	}

	/**
	 * Set the Service's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

	/**
	 * Set the Service's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string = "") {
		this._description = description;
	}

	/**
	 * Set the Service's host.
	 *
	 * @method setHost
	 */
	setHost(host : string) {
		this._host = host;
	}

	/**
	 * Return the Service's name.
	 *
	 * @method name
	 */
	name() {
		return this._name;
	}

	/**
	 * Return the Service's description.
	 *
	 * @method description
	 */
	description() {
		return this._description;
	}

	/**
	 * Return the Service's host.
	 *
	 * @method host
	 */
	host() {
		return this._host;
	}

	//////////////////// Methods managing model. Connections to database. ///////////////////////////


	/**
	 * Return a Service instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"description": this.description(),
			"host": this.host(),
			"complete": this.isComplete()
		};
		return data;
	}

	/**
	 * Check if the object is complete or not.
	 *
	 * For a Service, it means it has an ID, a name and a host.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) : void {
		var self = this;

		var succces : Function = function () {
			self._complete = (self._complete && !!self.name() && !!self.host());
			successCallback();
		};

		super.checkCompleteness(succces, failCallback);
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
		this.createObject(Service, this.toJSONObject(), successCallback, failCallback);
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
		ModelItf.readObject(Service, id, successCallback, failCallback, attemptNumber);
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
		return this.updateObject(Service, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
		return this.deleteObject(Service, successCallback, failCallback, attemptNumber);
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
		return this.allObjects(Service, successCallback, failCallback, attemptNumber);
	}

	/**
	 * Return a Source instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Source} The model instance.
	 */
	static parseJSON(jsonString : string) : Service {
		return Service.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a Service instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Service} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : Service {
		if (!jsonObject.id) {
			throw new ModelException("A Service object should have an ID.");
		}
		if (jsonObject.complete == undefined || jsonObject.complete == null) {
			throw new ModelException("A Service object should have a complete attribute.");
		}
		return new Service(jsonObject.name, jsonObject.description, jsonObject.host, jsonObject.id, jsonObject.complete);
	}

	/**
	 * Retrieve DataBase Table Name.
	 *
	 * @method getTableName
	 * @return {string} The DataBase Table Name corresponding to Model.
	 */
	static getTableName() : string {
		return "Services";
	}

}