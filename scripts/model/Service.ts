/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Source.ts" />
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
	 * Logo property.
	 *
	 * @property _logo
	 * @type string
	 */
	private _logo : string;

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
	 * Constructor
	 *
	 * @constructor
	 * @param name The name of the service
	 * @param description A description of the service
	 * @param host The host to reach the service
	 * @param {boolean} oauth - To set if Service needs authentication or not
	 * @param {string} provider - The OAuthD provider's name
	 * @param id The DB id of the service
	 * @param {string} createdAt - The Service's createdAt.
	 * @param {string} updatedAt - The Service's updatedAt.
	 */
	constructor(name : string = "", description : string = "", host : string = "", logo : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

		this.setName(name);
		this.setDescription(description);
		this.setHost(host);
		this.setLogo(logo);

		this._sources = new Array<Source>();
		this._sources_loaded = false;
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
	 * Set the Service's logo.
	 *
	 * @method setLogo
	 */
	setLogo(logo : string) {
		this._logo = logo;
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

	/**
	 * Return the Service's logo.
	 *
	 * @method logo
	 */
	logo() {
		return this._logo;
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
	 * Load the Service's sources.
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

			this.getAssociatedObjects(Service, Source, success, fail);
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
			if(self._sources_loaded) {
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
	}


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
			"logo": this.logo(),
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
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
	static read(id : number, successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
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
	update(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
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
	delete(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
		return ModelItf.deleteObject(Service, this.getId(), successCallback, failCallback, attemptNumber);
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
		return new Service(jsonObject.name, jsonObject.description, jsonObject.host, jsonObject.logo, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
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