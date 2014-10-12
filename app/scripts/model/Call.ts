/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./ParamValue.ts" />
/// <reference path="./CallType.ts" />
/// <reference path="./Profil.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : Call
 *
 * @class Call
 * @extends ModelItf
 */
class Call extends ModelItf {

    /**
     * Name property.
     *
     * @property _name
     * @type string
     */
    private _name : string;

	/**
	 * CallType property.
	 *
	 * @property _call_type
	 * @type CallType
	 */
	private _call_type : CallType;

	/**
	 * Lazy loading for CallType property.
	 *
	 * @property _call_type_loaded
	 * @type boolean
	 */
	private _call_type_loaded : boolean;

	/**
	 * Profil property.
	 *
	 * @property _profil
	 * @type Profil
	 */
	private _profil : Profil;

	/**
	 * Lazy loading for Profil property.
	 *
	 * @property _profil_loaded
	 * @type boolean
	 */
	private _profil_loaded : boolean;

    /**
     * ParamValues property.
     *
     * @property _param_values
     * @type Array<ParamValue>
     */
    private _param_values : Array<ParamValue>;

    /**
     * Lazy loading for ParamValues property.
     *
     * @property _param_values_loaded
     * @type boolean
     */
    private _param_values_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Call's name.
     * @param {number} id - The Call's ID.
     */
    constructor(name : string, id : number = ModelItf.NULLID) {
        super(id);

        this.setName(name);

        this._param_values = new Array<ParamValue>();
        this._param_values_loaded = false;

	    this._call_type = null;
	    this._call_type_loaded = false;

	    this._profil = null;
	    this._profil_loaded = false;
    }

    /**
     * Return the Call's name.
     *
     * @method name
     */
    name() {
        return this._name;
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
     * Return the Call's paramValues.
     *
     * @method paramValues
     */
    paramValues() {
        if(! this._param_values_loaded) {
            this._param_values_loaded = this.getAssociatedObjects(Call, ParamValue, this._param_values);
        }
        return this._param_values;
    }

	/**
	 * Return the Call's profil.
     *
     * @method profil
	 */
	profil() {
		if(! this._profil_loaded) {
			var value = [];
			this._profil_loaded = this.getUniquelyAssociatedObject(Call, Profil, value);
			if (this._profil_loaded) {
				this._profil = value[0];
			}
		}
		return this._profil;
	}

	/**
	 * Return the Call's type.
     *
     * @method callType
	 */
	callType() {
		if(! this._call_type_loaded) {
			var value = [];
			this._call_type_loaded = this.getUniquelyAssociatedObject(Call, CallType, value);
			if (this._call_type_loaded) {
				this._call_type = value[0];
			}
		}
		return this._call_type;
	}

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Load all the lazy loading properties of the object.
	 * Useful when you want to get a complete object.
     *
     * @method loadAssociations
	 */
	loadAssociations() : void {
		this.paramValues();
		this.profil();
		this.callType();
	}

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._call_type_loaded = false;
		this._param_values_loaded = false;
		this._profil_loaded = false;
	}

	/**
	 * Return a Call instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name()
		};
		return data;
	}

	/**
	 * Return a Call instance as a JSON Object including associated object.
	 * However the method should not be recursive due to cycle in the model.
	 *
	 * @method toCompleteJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toCompleteJSONObject() : Object {
		this.loadAssociations();
		var data = this.toJSONObject();
		data["callType"] = (this.callType() !== null) ? this.callType().toJSONObject() : null;
		data["profil"] = (this.profil() !== null) ? this.callType().toJSONObject() : null;
		data["paramValues"] = this.serializeArray(this.paramValues());
		return data;
	}

	/**
	 * Add a new ParamValue to the Call and associate it in the database.
	 * A ParamValue can only be added once.
	 *
     * @method addParamValue
	 * @param {ParamValue} p The ParamValue to add inside the call. It cannot be a null value.
	 * @returns {boolean} Returns true if the association is realized in database.
	 */
	addParamValue(p : ParamValue) : boolean {
		if (!p || !p.getId()) {
			throw new ModelException("The ParamValue must be an existing object to be associated.");
		}

		if (ModelItf.isObjectInsideArray(this.paramValues(), p)) {
			throw new ModelException("You cannot add twice a parameter in a call.");  // TODO: cannot it be useful sometimes?
		}

		if (this.associateObject(Call, ParamValue, p.getId())) {
			p.desynchronize();
			this.paramValues().push(p);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Remove a ParamValue from the Call: the association is removed both in the object and in database.
	 * The ParamValue can only be removed if it exists first in the list of associated ParamValue, else an exception is thrown.
	 *
     * @method removeParamValue
	 * @param {ParamValue} p The ParamValue to remove from that Call
	 * @returns {boolean} Returns true if the association is deleted in database.
	 */
	removeParamValue(p : ParamValue) : boolean {
		if (!p || !p.getId()) {
			throw new ModelException("The ParamValue must be an existing object to be removed.");
		}
		if (!ModelItf.isObjectInsideArray(this.paramValues(), p)) {
			throw new ModelException("The ParamValue you try to remove has not been added to the current Call");
		}

		if (this.deleteObjectAssociation(Call, ParamValue, p.getId())) {
			p.desynchronize();
			return ModelItf.removeObjectFromArray(this.paramValues(), p);
		} else {
			return false;
		}
	}

	/**
	 * Set the Profil of the Call.
	 * As a Call can only have one Profil, if the value is already set, this method throws an exception: you need first to unset the profil.
	 * Moreover the given Profil must be created in database.
	 *
     * @method setProfil
	 * @param {Profil} p The Profil to associate with the Call.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setProfil(p : Profil) : boolean {
		if (!p || !p.getId()) {
			throw new ModelException("The Profil must be an existing object to be associated.");
		}

		if (this.profil() !== null) {
			throw new ModelException("The profil is already set for the call: "+JSON.stringify(this.profil())+".");
		}

		if (this.associateObject(Call, Profil, p.getId())) {
			p.desynchronize();
			this._profil = p;
			this._profil_loaded = true;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Unset the current Profil from the Call.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Profil must have been set before using it, else an exception is thrown.
	 *
     * @method unsetProfil
	 * @returns {boolean} Returns true if the profil is well unset and the association removed in database.
	 */
	unsetProfil() : boolean {
		if (this.profil() === null) {
			throw new Error("No profil has been set for this call.");
		}

		if (this.deleteObjectAssociation(Call, Profil, this.profil().getId())) {
			this.profil().desynchronize();
			this._profil = null;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Set the CallType of the Call.
	 * As a Call can only have one CallType, if the value is already set, this method throws an exception: you need first to unset the CallType.
	 * Moreover the given CallType must be created in database.
	 *
     * @method setCallType
	 * @param {CallType} ct The CallType to associate with the Call.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setCallType(ct : CallType) : boolean {
		if (this.callType() !== null) {
			throw new Error("The CallType is already set for the call : "+this+".");
		}
		if (ct === null || ct.getId() === undefined || ct.getId() === null) {
			throw new Error("The CallType must be an existing object to be associated.");
		}

		if (this.associateObject(Call, CallType, ct.getId())) {
			ct.desynchronize();
			this._call_type = ct;
			this._call_type_loaded = true;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Unset the current CallType from the Call.
	 * It both sets a null value for the object property and remove the association in database.
	 * A CallType must have been set before using it, else an exception is thrown.
	 *
     * @method unsetCallType
	 * @returns {boolean} Returns true if the CallType is well unset and the association removed in database.
	 */
	unsetCallType() : boolean {
		if (this.callType() === null) {
			throw new ModelException("No CallType has been set for this call.");
		}

		if (this.deleteObjectAssociation(Call, CallType, this.callType().getId())) {
			this.callType().desynchronize();
			this._call_type = null;
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
        return this.createObject(Call, this.toJSONObject());
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {Call} The model instance.
     */
    static read(id : number) : Call {
        return this.readObject(Call, id);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        return this.updateObject(Call, this.toJSONObject());
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        return this.deleteObject(Call);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<Call>} The model instances.
     */
    static all() : Array<Call> {
        return this.allObjects(Call);
    }

    /**
     * Return a Call instance from a JSON string.
     *
     * @method parseJSON
     * @static
     * @param {string} json - The JSON string
     * @return {Call} The model instance.
     */
    static parseJSON(jsonString : string) : Call {
        return Call.fromJSONObject(JSON.parse(jsonString));
    }

    /**
     * Return a Call instance from a JSON Object.
     *
     * @method fromJSONObject
     * @static
     * @param {JSONObject} json - The JSON Object
     * @return {Call} The model instance.
     */
    static fromJSONObject(jsonObject : any) : Call {
	    if (!jsonObject.id) {
		    throw new ModelException("A Call object should have an ID.");
	    }
        if(!jsonObject.name) {
	        throw new ModelException("A Call object should have a name.");
        }
	    return new Call(jsonObject.name, jsonObject.id);
    }

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Calls";
    }
}