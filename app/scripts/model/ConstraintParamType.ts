/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Source.ts" />
/// <reference path="./Renderer.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : ConstraintParamType
 *
 * @class ConstraintParamType
 * @extends ModelItf
 */
class ConstraintParamType extends ModelItf {

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
	 * @param {string} name - The ConstraintParamType's name.
	 * @param {number} id - The ConstraintParamType's ID.
	 */
	constructor(name : string, description : string, id : number = null) {
		super(id);

		if(this._name == null || this._name == "") {
			Logger.error("A ConstraintParamType needs to have a name.");
			// TODO : Throw an Exception ?
		}

		this._name = name;

		if(this._description == null || this._description == "") {
			Logger.error("A ConstraintParamType needs to have a description.");
			// TODO : Throw an Exception ?
		}

		this._description = description;
	}

	/**
	 * Return the ConstraintParamType's name.
	 */
	name() {
		return this._name;
	}

	/**
	 * Return the ConstraintParamType's description.
	 */
	description() {
		return this._description;
	}

	//////////////////// Methods managing model. Connections to database. ///////////////////////////

	toJSONObject() : Object {
		var data = {
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
		return this.createObject(ConstraintParamType, this.toJSONObject())
	}

	/**
	 * Retrieve model description from database and create model instance.
	 *
	 * @method read
	 * @static
	 * @param {number} id - The model instance's id.
	 * @return {ConstraintParamType} The model instance.
	 */
	static read(id : number) : ConstraintParamType {
		return this.readObject(ConstraintParamType, id);
	}

	/**
	 * Update in database the model with current id.
	 *
	 * @method update
	 * @return {boolean} Update status
	 */
	update() : boolean {
		return this.updateObject(ConstraintParamType, this.toJSONObject())
	}

	/**
	 * Delete in database the model with current id.
	 *
	 * @method delete
	 * @return {boolean} Delete status
	 */
	delete() : boolean {
		return this.deleteObject(ConstraintParamType);
	}

	/**
	 * Retrieve all models from database and create corresponding model instances.
	 *
	 * @method all
	 * @return {Array<ConstraintParamType>} The model instances.
	 */
	static all() : Array<ConstraintParamType> {
		return this.allObjects(ConstraintParamType);
	}

	/**
	 * Return an ConstraintParamType instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Call} The model instance.
	 */
	static parseJSON(jsonString : string) : ConstraintParamType {
		return ConstraintParamType.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return an ConstraintParamType instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Call} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : ConstraintParamType {
		if(typeof(jsonObject.name) == "undefined" || typeof(jsonObject.id) == "undefined") {
			return null;
		} else {
			return new ConstraintParamType(jsonObject.name, jsonObject.id);
		}
	}

	/**
	 * Retrieve DataBase Table Name.
	 *
	 * @method getTableName
	 * @return {string} The DataBase Table Name corresponding to Model.
	 */
	static getTableName() : string {
		return "ConstraintParamTypes";
	}
}