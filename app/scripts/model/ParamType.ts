/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : ParamType
 *
 * @class ParamType
 * @extends ModelItf
 */
class ParamType extends ModelItf {

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
     * Type property.
     *
     * @property _type
     * @type string
     */
    private _type : string;

    /**
     * Constraint property.
     *
     * @property _constraint
     * @type string
     */
    private _constraint : string;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The ParamType's name.
     * @param {string} description - The ParamType's description.
     * @param {string} type - The ParamType's type.
     * @param {string} constraint - The ParamType's constraint.
     * @param {number} id - The ParamType's ID.
     */
    constructor(name : string, description : string, type : string, constraint : string, id : number = null) {
        super(id);

        if(this._name == null || this._name == "") {
            Logger.error("A ParamType needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;

        if(this._description == null || this._description == "") {
            Logger.error("A ParamType needs to have a description.");
            // TODO : Throw an Exception ?
        }

        this._description = description;

        if(this._type == null || this._type == "") {
            Logger.error("A ParamType needs to have a type.");
            // TODO : Throw an Exception ?
        }

        this._type = type;

        if(this._constraint == null || this._constraint == "") {
            Logger.error("A ParamType needs to have a constraint.");
            // TODO : Throw an Exception ?
        }

        this._constraint = constraint;
    }

    /**
     * Return the ParamType's name.
     */
    name() {
        return this._name;
    }

    /**
     * Return the ParamType's description.
     */
    description() {
        return this._description;
    }

    /**
     * Return the ParamType's type.
     */
    type() {
        return this._type;
    }

    /**
     * Return the ParamType's constraint.
     */
    constraint() {
        return this._constraint;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	toJSONObject() : Object {
		var data = {
			"name" : this.name(),
			"description": this.description(),
			"type": this.type(),
			"constraint": this.constraint()
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
       return this.createObject(ParamType, this.toJSONObject());
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {ParamType} The model instance.
     */
    static read(id : number) : ParamType {
        return this.readObject(ParamType, id);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        return this.updateObject(ParamType, this.toJSONObject());
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        return this.deleteObject(ParamType);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<ParamType>} The model instances.
     */
    static all() : Array<ParamType> {
        return this.allObjects(ParamType);
    }

	/**
	 * Return a ParamType instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Call} The model instance.
	 */
	static parseJSON(jsonString : string) : ParamType {
		return ParamType.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a ParamType instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Call} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : ParamType {
		if(typeof(jsonObject.name) == "undefined" || typeof(jsonObject.description) == "undefined" || typeof(jsonObject.type) == "undefined" || typeof(jsonObject.constraint) == "undefined" || typeof(jsonObject.id) == "undefined") {
			return null;
		} else {
			return new ParamType(jsonObject.name, jsonObject.description, jsonObject.type, jsonObject.constraint, jsonObject.id);
		}
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "ParamTypes";
    }
}