/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

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

        if(this._value == null || this._value == "") {
            Logger.error("A ParamValue needs to have a value.");
            // TODO : Throw an Exception ?
        }

        this._value = value;
    }

    /**
     * Return the ParamValue's value.
     */
    value() {
        return this._value;
    }

	/**
	 * Set the ParamValue's value.
	 *
	 * @method setName
	 */
	setValue(value : string) {
		if(value == null || value == "") {
			Logger.error("A ParamValue needs to have a value.");
			// TODO : Throw an Exception ?
		}

		this._value = value;
	}

	/**
	 * Return the ParamValue's ParamType.
	 */
	paramType() {
		if(! this._paramType_loaded) {
			this._paramType_loaded = this.getUniquelyAssociatedObject(ParamValue, ParamType, this._paramType);
		}
		return this._paramType;
	}

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	loadAssociations() : void {
		this.paramType();
	}

	toJSONObject() : Object {
		var data = {
			"value": this.value()
		};

		return data;
	}

	setParamType(p : ParamType) : boolean {
		return this.associateObject(ParamValue, ParamType, p.getId());
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