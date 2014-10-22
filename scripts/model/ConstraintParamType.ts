/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./TypeParamType.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

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
	 * Type property: a constraint only apply on a specific type.
	 *
	 * @property _type
	 * @type TypeParamType
	 */
	private _type : TypeParamType;

	/**
	 * Lazy loading for Type property
	 *
	 * @property _type_loading
	 * @type boolean
	 */
	private _type_loading : boolean;

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {string} name - The ConstraintParamType's name.
	 * @param {number} id - The ConstraintParamType's ID.
	 */
	constructor(name : string, description : string = "", id : number = null) {
		super(id);

		this.setName(name);
		this.setDescription(description);

		this._type = null;
		this._type_loading = false;
	}

	/**
	 * Set the ConstraintParamType's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		if(!name) {
			throw new ModelException("A ConstraintParamType needs to have a name.");
		}

		this._name = name;
	}

	/**
	 * Set the ConstraintParamType's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string) {
		this._description = description;
	}

	/**
	 * Return the ConstraintParamType's name.
     *
     * @method name
	 */
	name() {
		return this._name;
	}

	/**
	 * Return the ConstraintParamType's description.
     *
     * @method description
	 */
	description() {
		return this._description;
	}

	/**
	 * Return the ConstraintParamType's type
     *
     * @method type
	 */
	type() {
		if (!this._type_loading) {
			var value = this.getUniquelyAssociatedObject(ConstraintParamType, TypeParamType);
			if (!!value) {
				this._type = value;
			}
			this._type_loading = true;
		}
		return this._type;
	}

	//////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Load all the lazy loading properties of the object.
	 * Useful when you want to get a complete object.
     *
     * @method loadAssociations
	 */
	loadAssociations() : void {
		this.type();
	}

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._type_loading = false;
	}

	/**
	 * Return a ConstraintParamType instance as a JSON Object
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
	 * Return a ConstraintParamType instance as a JSON Object including associated object.
	 * However the method should not be recursive due to cycle in the model.
	 *
	 * @method toCompleteJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toCompleteJSONObject() : Object {
		this.loadAssociations();
		var data = this.toJSONObject();
		data["type"] = (this.type() !== null) ? this.type().toJSONObject() : null;
		return data;
	}

	/**
	 * Set the type of the ConstraintParamType.
	 * As a ConstraintParamType can only have one type, if the value is already set, this method throws an exception: you need first to unset the type.
	 * Moreover the given type must be created in database.
	 *
     * @method setType
	 * @param {TypeParamType} t The type to associate with the ConstraintParamType.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setType(t : TypeParamType) : boolean {
		if (!t || !t.getId()) {
			throw new ModelException("The type must be an existing object to be associated.");
		}

		if (this.type() !== null) {
			throw new ModelException("The type is already set for this ConstraintParamType.");
		}

		if (this.associateObject(ConstraintParamType, TypeParamType, t.getId())) {
			t.desynchronize();
			this._type = t;
			this._type_loading = true;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Unset the current type from the constraintParamType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A type must have been set before using it, else an exception is thrown.
	 *
     * @method unsetType
	 * @returns {boolean} Returns true if the type is well unset and the association removed in database.
	 */
	unsetType() : boolean {
		if (this.type() === null) {
			throw new ModelException("No type has been set for this constraintParamType.");
		}

		if (this.deleteObjectAssociation(ConstraintParamType, TypeParamType, this.type().getId())) {
			this.type().desynchronize();
			this._type = null;
			return true;
		} else {
			return false;
		}
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
		if(!jsonObject.id) {
			throw new ModelException("A CallType object should have an ID.");
		}
		if(!jsonObject.name) {
			throw new ModelException("A CallType object should have a name.");
		}
		if(!jsonObject.description) {
			throw new ModelException("A CallType object should have a description.");
		}
		return new ConstraintParamType(jsonObject.name, jsonObject.description, jsonObject.id);
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