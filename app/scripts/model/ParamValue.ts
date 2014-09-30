/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./ParamType.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : ParamValue
 *
 * @class ParamValue
 * @extends ModelItf
 */
class ParamValue extends ModelItf {

    /**
     * Value property.
     *
     * @property _value
     * @type string
     */
    private _value : string;

	/**
	 * ParamType property.
	 *
	 * @property _paramType
	 * @type ParamType
	 */
	private _paramType : ParamType;

	/**
	 * Lazy loading for ParamType property.
	 *
	 * @property _paramType_loaded
	 * @type boolean
	 */
	private _paramType_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} value - The ParamValue's value.
     * @param {number} id - The ParamValue's ID.
     */
    constructor(value : string, id : number = null) {
        super(id);

        this.setValue(value);

	    this._paramType = null;
	    this._paramType_loaded = false;
    }

	// TODO : Check the value type here?
	/**
	 * Set the ParamValue's value.
	 *
	 * @method setValue
	 */
	setValue(value : string) {
		if(value == null || value == "") {
			Logger.error("A ParamValue needs a proper value.");
			// TODO : Throw an Exception ?
		}

		this._value = value;
	}

    /**
     * Return the ParamValue's value.
     *
     * @method value
     */
    value() {
        return this._value;
    }

	/**
	 * Return the ParamValue's ParamType.
     *
     * @method paramType
	 */
	paramType() {
		if(! this._paramType_loaded) {
			this._paramType_loaded = this.getUniquelyAssociatedObject(ParamValue, ParamType, this._paramType);
		}
		return this._paramType;
	}

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Load all the lazy loading properties of the object.
	 * Useful when you want to get a complete object.
     *
     * @method loadAssociations
	 */
	loadAssociations() : void {
		this.paramType();
	}

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._paramType_loaded = false;
	}

	/**
	 * Private method to transform the object in JSON.
	 * It is used to create or update the object in database.
	 *
     * @method toJSONObject
	 * @returns {{value: string}}
	 */
	toJSONObject() : Object {
		var data = {
			"value": this.value()
		};

		return data;
	}

    /**
     * To transform ParamValue to JSON object containing
     * description of associations.
     *
     * @method toJSONObjectWithAssociations
     */
    toJSONObjectWithAssociations() : Object {
        this.loadAssociations();

        var data = {
            "value": this.value()
        };

        data["paramType"] = this.paramType().toJSONObjectWithAssociations();

        return data;
    }

	/**
	 * Set the ParamType of the ParamValue.
	 * As a ParamValue can only have one type, if the value is already set, this method throws an exception: you need first to unset the ParamType.
	 * Moreover the given ParamType must be created in database.
	 *
     * @method setParamType
	 * @param {ParamType} t The ParamType to associate with the ParamValue.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setParamType(p : ParamType) : boolean {
		if (this.paramType() !== null) {
			throw new Error("The paramType is already set for this ParamValue.");
		}

		if (p === null || p.getId() === undefined || p.getId() === null) {
			throw new Error("The ParamType must be an existing object to be associated.");
		}

		if (this.associateObject(ParamValue, ParamType, p.getId())) {
			p.desynchronize();
			this._paramType = p;
			this._paramType_loaded = true;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Unset the current ParamType from the ParamValue.
	 * It both sets a null value for the object property and remove the association in database.
	 * A ParamType must have been set before using it, else an exception is thrown.
	 *
     * @method unsetParamType
	 * @returns {boolean} Returns true if the ParamType is well unset and the association removed in database.
	 */
	unsetParamType() : boolean {
		if (this.paramType() === null) {
			throw new Error("No ParamType has been set for this ParamValue.");
		}

		if (this.deleteObjectAssociation(ParamValue, ParamType, this.paramType().getId())) {
			this.paramType().desynchronize();
			this._paramType = null;
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
        return this.createObject(ParamValue, this.toJSONObject());
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {ParamValue} The model instance.
     */
    static read(id : number) : ParamValue {
        return this.readObject(ParamValue, id);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        return this.updateObject(ParamValue, this.toJSONObject());
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        return this.deleteObject(ParamValue);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<ParamValue>} The model instances.
     */
    static all() : Array<ParamValue> {
        return this.allObjects(ParamValue);
    }

	/**
	 * Return a ParamValue instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {ParamValue} The model instance.
	 */
	static parseJSON(jsonString : string) : ParamValue {
		return ParamValue.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a ParamValue instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {ParamValue} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : ParamValue {
		if(typeof(jsonObject.value) == "undefined" || typeof(jsonObject.id) == "undefined") {
			return null;
		} else {
			return new ParamValue(jsonObject.value, jsonObject.id);
		}
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "ParamValues";
    }
}