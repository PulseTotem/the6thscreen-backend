/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./TypeParamType.ts" />
/// <reference path="./ConstraintParamType.ts" />
/// <reference path="./ParamValue.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

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
    constructor(name : string, description : string = "", id : number = null) {
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
		if(!name) {
			throw new ModelException("A ParamType needs to have a name.");
		}

		this._name = name;
	}

	/**
	 * Set the ParamType's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string) {
		this._description = description;
	}

    /**
     * Return the ParamType's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Return the ParamType's description.
     *
     * @method description
     */
    description() {
        return this._description;
    }

    /**
     * Return the ParamType's type.
     *
     * @method type
     */
	type() {
	    if(! this._type_loaded) {
		    var value = this.getUniquelyAssociatedObject(ParamType, TypeParamType);
		    if (!!value) {
			    this._type = value;
		    }
		    this._type_loaded = true;
	    }
	    return this._type;
    }

    /**
     * Return the ParamType's constraint.
     *
     * @method constraint
     */
    constraint() {
	    if(! this._constraint_loaded) {
		    var value = this.getUniquelyAssociatedObject(ParamType, ConstraintParamType);
		    if (!!value) {
			    this._constraint = value;
		    }
		    this._constraint_loaded = true;
	    }
	    return this._constraint;
    }

	/**
	 * Return the ParamType's default value.
     *
     * @method defaultValue
	 */
	defaultValue() {
		if(! this._default_value_loaded) {
			var value = this.getUniquelyAssociatedObject(ParamType, ParamValue);
			if (!!value) {
				this._default_value = value;
			}
			this._default_value_loaded = true;
		}
		return this._default_value;
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
		this.constraint();
		this.defaultValue();
	}

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._type_loaded = false;
		this._constraint_loaded = false;
		this._default_value_loaded = false;
	}

	/**
	 * Return a ParamType instance as a JSON Object
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
	 * Return a ParamType instance as a JSON Object including associated object.
	 * However the method should not be recursive due to cycle in the model.
	 *
	 * @method toCompleteJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toCompleteJSONObject() : Object {
		this.loadAssociations();
		var data = this.toJSONObject();
		data["type"] = (this.type() !== null) ? this.type().toJSONObject() : null;
		data["constraint"] = (this.constraint() !== null) ? this.constraint().toJSONObject() : null;
		data["defaultValue"] = (this.defaultValue() !== null) ? this.defaultValue().toJSONObject() : null;
		return data;
	}

	/**
	 * Set the Type of the ParamType.
	 * As a ParamType can only have one Type, if the value is already set, this method throws an exception: you need first to unset the Type.
	 * Moreover the given Type must be created in database.
	 *
     * @method setType
	 * @param {TypeParamType} t The Type to associate with the ParamType.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setType(t : TypeParamType) : boolean {
		if (!t  || !t.getId()) {
			throw new ModelException("The type must be an existing object to be associated.");
		}

		if (this.type() !== null) {
			throw new ModelException("The type is already set for this CallType.");
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
     * @method unsetType
	 * @returns {boolean} Returns true if the Type is well unset and the association removed in database.
	 */
	unsetType() : boolean {
		if (this.type() === null) {
			throw new ModelException("No Type has been set for this ParamType.");
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
     * @method setConstraint
	 * @param {ConstraintParamType} t The Constraint to associate with the ParamType.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setConstraint(c : ConstraintParamType) : boolean {
		if (!c || !c.getId()) {
			throw new ModelException("The constraint must be an existing object to be associated.");
		}

		if (this.constraint() !== null) {
			throw new ModelException("The constraint is already set for this CallType.");
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
     * @method unsetConstraint
	 * @returns {boolean} Returns true if the Constraint is well unset and the association removed in database.
	 */
	unsetConstraint() : boolean {
		if (this.constraint() === null) {
			throw new ModelException("No constraint has been set for this ParamType.");
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
     * @method setDefaultValue
	 * @param {ParamValue} t The DefaultValue to associate with the ParamType.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setDefaultValue(d : ParamValue) : boolean {
		if (!d || !d.getId()) {
			throw new ModelException("The defaultValue must be an existing object to be associated.");
		}

		if (this.defaultValue() !== null) {
			throw new ModelException("The defaultValue is already set for this CallType.");
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
     * @method unsetDefaultValue
	 * @returns {boolean} Returns true if the DefaultValue is well unset and the association removed in database.
	 */
	unsetDefaultValue() : boolean {
		if (this.defaultValue() === null) {
			throw new ModelException("No defaultValue has been set for this ParamType.");
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
		if(!jsonObject.id) {
			throw new ModelException("A ParamType object should have an ID.");
		}
		if(!jsonObject.name) {
			throw new ModelException("A ParamType object should have a name.");
		}
		if(!jsonObject.description) {
			throw new ModelException("A ParamType object should have a description.");
		}
		return new ParamType(jsonObject.name, jsonObject.description, jsonObject.id);
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