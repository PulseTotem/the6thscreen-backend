/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./TypeParamType.ts" />
/// <reference path="./ConstraintParamType.ts" />
/// <reference path="./ParamValue.ts" />

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
	 * Type property
	 *
	 * @property _type
	 * @type TypeParamType
	 */
	private _type : TypeParamType;

	/**
	 * Lazy loading for Type property
	 *
	 * @property _type_loaded
	 * @type boolean
	 */
	private _type_loaded : boolean;


	/**
	 * Constraint property
	 *
	 * @property _constraint
	 * @type ConstraintParamType
	 */
	private _constraint : ConstraintParamType;


	/**
	 * Lazy loading for Constraint property
	 *
	 * @property _constraint_loaded
	 * @type boolean
	 */
	private _constraint_loaded : boolean;


	/**
	 * DefaultValue property
	 *
	 * @property _default_value
	 * @type ParamValue
	 */
	private _default_value : ParamValue;

	/**
	 * Lazy loading for DefaultValue property
	 *
	 * @property _default_value_property
	 * @type boolean
	 */
	private _default_value_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The ParamType's name.
     * @param {string} description - The ParamType's description.
     * @param {number} id - The ParamType's ID.
     */
    constructor(name : string, description : string, id : number = null) {
        super(id);

        this.setName(name);
	    this.setDescription(description);

	    this._constraint = null;
	    this._constraint_loaded = false;

	    this._default_value = null;
	    this._default_value_loaded = false;

	    this._type = null;
	    this._type_loaded = false;
    }

	/**
	 * Set the ParamType's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		if(name == null || name == "") {
			Logger.error("A ParamType needs to have a name.");
			// TODO : Throw an Exception ?
		}

		this._name = name;
	}

	/**
	 * Set the ParamType's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string) {
		if(description == null || description == "") {
			Logger.error("A ParamType needs to have a description.");
			// TODO : Throw an Exception ?
		}

		this._description = description;
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
	    if(! this._type_loaded) {
		    this._type_loaded = this.getUniquelyAssociatedObject(ParamType, TypeParamType, this._type);
	    }
	    return this._type;
    }

    /**
     * Return the ParamType's constraint.
     */
    constraint() {
	    if(! this._constraint_loaded) {
		    this._constraint_loaded = this.getUniquelyAssociatedObject(ParamType, ConstraintParamType, this._constraint);
	    }
	    return this._constraint;
    }

	/**
	 * Return the ParamType's default value.
	 */
	defaultValue() {
		if(! this._default_value_loaded) {
			this._default_value_loaded = this.getUniquelyAssociatedObject(ParamType, ParamValue, this._default_value);
		}
		return this._default_value;
	}

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Load all the lazy loading properties of the object.
	 * Useful when you want to get a complete object.
	 */
	loadAssociations() : void {
		this.type();
		this.constraint();
		this.defaultValue();
	}

	/**
	 * Set the object as desynchronized given the different lazy properties.
	 */
	desynchronize() : void {
		this._type_loaded = false;
		this._constraint_loaded = false;
		this._default_value_loaded = false;
	}

	/**
	 * /**
	 * Private method to transform the object in JSON.
	 * It is used to create or update the object in database.
	 *
	 * @returns {{name: string, description: string}}
	 */
	toJSONObject() : Object {
		var data = {
			"name" : this.name(),
			"description": this.description()
		};

		return data;
	}

	/**
	 * Set the Type of the ParamType.
	 * As a ParamType can only have one Type, if the value is already set, this method throws an exception: you need first to unset the Type.
	 * Moreover the given Type must be created in database.
	 *
	 * @param {TypeParamType} t The Type to associate with the ParamType.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setType(t : TypeParamType) : boolean {
		if (this.type() !== null) {
			throw new Error("The type is already set for this CallType.");
		}

		if (t === null || t.getId() === undefined || t.getId() === null) {
			throw new Error("The source must be an existing object to be associated.");
		}

		if (this.associateObject(ParamType, TypeParamType, t.getId())) {
			t.desynchronize();
			this._type = t;
			this._type_loaded = true;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Unset the current Type from the ParamType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Type must have been set before using it, else an exception is thrown.
	 *
	 * @returns {boolean} Returns true if the Type is well unset and the association removed in database.
	 */
	unsetType() : boolean {
		if (this.type() === null) {
			throw new Error("No Type has been set for this ParamType.");
		}

		if (this.deleteObjectAssociation(ParamType, TypeParamType, this.type().getId())) {
			this.type().desynchronize();
			this._type = null;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Set the Constraint of the ParamType.
	 * As a ParamType can only have one Constraint, if the value is already set, this method throws an exception: you need first to unset the Constraint.
	 * Moreover the given Constraint must be created in database.
	 *
	 * @param {ConstraintParamType} t The Constraint to associate with the ParamType.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setConstraint(c : ConstraintParamType) : boolean {
		if (this.constraint() !== null) {
			throw new Error("The constraint is already set for this CallType.");
		}

		if (c === null || c.getId() === undefined || c.getId() === null) {
			throw new Error("The constraint must be an existing object to be associated.");
		}

		if (this.associateObject(ParamType, ConstraintParamType, c.getId())) {
			c.desynchronize();
			this._constraint = c;
			this._constraint_loaded = true;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Unset the current Constraint from the ParamType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Constraint must have been set before using it, else an exception is thrown.
	 *
	 * @returns {boolean} Returns true if the Constraint is well unset and the association removed in database.
	 */
	unsetConstraint() : boolean {
		if (this.constraint() === null) {
			throw new Error("No constraint has been set for this ParamType.");
		}

		if (this.deleteObjectAssociation(ParamType, ConstraintParamType, this.constraint().getId())) {
			this.constraint().desynchronize();
			this._constraint = null;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Set the DefaultValue of the ParamType.
	 * As a ParamType can only have one DefaultValue, if the value is already set, this method throws an exception: you need first to unset the DefaultValue.
	 * Moreover the given DefaultValue must be created in database.
	 *
	 * @param {ParamValue} t The DefaultValue to associate with the ParamType.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setDefaultValue(d : ParamValue) : boolean {
		if (this.defaultValue() !== null) {
			throw new Error("The defaultValue is already set for this CallType.");
		}

		if (d === null || d.getId() === undefined || d.getId() === null) {
			throw new Error("The defaultValue must be an existing object to be associated.");
		}

		if (this.associateObject(ParamType, ParamValue, d.getId())) {
			d.desynchronize();
			this._default_value = d;
			this._default_value_loaded = true;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Unset the current DefaultValue from the ParamType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A DefaultValue must have been set before using it, else an exception is thrown.
	 *
	 * @returns {boolean} Returns true if the DefaultValue is well unset and the association removed in database.
	 */
	unsetDefaultValue() : boolean {
		if (this.defaultValue() === null) {
			throw new Error("No defaultValue has been set for this ParamType.");
		}

		if (this.deleteObjectAssociation(ParamType, ParamValue, this.defaultValue().getId())) {
			this.defaultValue().desynchronize();
			this._default_value = null;
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
		if(typeof(jsonObject.name) == "undefined" || typeof(jsonObject.description) == "undefined" || typeof(jsonObject.id) == "undefined") {
			return null;
		} else {
			return new ParamType(jsonObject.name, jsonObject.description, jsonObject.id);
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