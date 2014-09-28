/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Source.ts" />
/// <reference path="./Renderer.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : TypeParamType
 *
 * @class TypeParamType
 * @extends ModelItf
 */
class TypeParamType extends ModelItf {

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
	 * @param {string} name - The TypeParamType's name.
	 * @param {number} id - The TypeParamType's ID.
	 */
	constructor(name : string, id : number = null) {
		super(id);

		this.setName(name);
	}

	/**
	 * Set the Call's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		if(name == null || name == "") {
			Logger.error("A Call needs to have a name.");
			// TODO : Throw an Exception ?
		}

		this._name = name;
	}

	/**
	 * Return the TypeParamType's name.
	 */
	name() {
		return this._name;
	}

	//////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Private method to transform the object in JSON.
	 * It is used to create or update the object in database.
	 *
	 * @returns {{name: string}}
	 */
	toJSONObject() : Object {
		var data = {
			"name": this.name()
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
		return this.createObject(TypeParamType, this.toJSONObject())
	}

	/**
	 * Retrieve model description from database and create model instance.
	 *
	 * @method read
	 * @static
	 * @param {number} id - The model instance's id.
	 * @return {TypeParamType} The model instance.
	 */
	static read(id : number) : TypeParamType {
		return this.readObject(TypeParamType, id);
	}

	/**
	 * Update in database the model with current id.
	 *
	 * @method update
	 * @return {boolean} Update status
	 */
	update() : boolean {
		return this.updateObject(TypeParamType, this.toJSONObject())
	}

	/**
	 * Delete in database the model with current id.
	 *
	 * @method delete
	 * @return {boolean} Delete status
	 */
	delete() : boolean {
		return this.deleteObject(TypeParamType);
	}

	/**
	 * Retrieve all models from database and create corresponding model instances.
	 *
	 * @method all
	 * @return {Array<TypeParamType>} The model instances.
	 */
	static all() : Array<TypeParamType> {
		return this.allObjects(TypeParamType);
	}

	/**
	 * Return an TypeParamType instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Call} The model instance.
	 */
	static parseJSON(jsonString : string) : TypeParamType {
		return TypeParamType.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return an TypeParamType instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Call} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : TypeParamType {
		if(typeof(jsonObject.name) == "undefined" || typeof(jsonObject.id) == "undefined") {
			return null;
		} else {
			return new TypeParamType(jsonObject.name, jsonObject.id);
		}
	}

	/**
	 * Retrieve DataBase Table Name.
	 *
	 * @method getTableName
	 * @return {string} The DataBase Table Name corresponding to Model.
	 */
	static getTableName() : string {
		return "TypeParamTypes";
	}
}