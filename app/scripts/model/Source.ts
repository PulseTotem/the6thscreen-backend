/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./InfoType.ts" />
/// <reference path="./ParamType.ts" />
/// <reference path="./ParamValue.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : Source
 *
 * @class Source
 * @extends ModelItf
 */
class Source extends ModelItf {

    /**
     * Name property.
     *
     * @property _name
     * @type string
     */
    private _name : string;

    /**
     * Service property.
     *
     * @property _service
     * @type string
     */
    private _service : string;

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
     * Port property.
     *
     * @property _port
     * @type number
     */
    private _port : number;

    /**
     * InfoType property.
     *
     * @property _info_type
     * @type InfoType
     */
    private _info_type : InfoType;

    /**
     * Lazy loading for InfoType property.
     *
     * @property _info_type_loaded
     * @type boolean
     */
    private _info_type_loaded : boolean;

    /**
     * ParamTypes property.
     *
     * @property _param_types
     * @type Array<ParamType>
     */
    private _param_types : Array<ParamType>;

    /**
     * Lazy loading for ParamTypes property.
     *
     * @property _param_types_loaded
     * @type boolean
     */
    private _param_types_loaded : boolean;

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
     * @param {string} name - The Source's name.
     * @param {string} service - The Source's service.
     * @param {string} description - The Source's description.
     * @param {string} host - The Source's host.
     * @param {number} port - The Source's port.
     * @param {number} id - The Source's ID.
     */
    constructor(name : string, service : string, description : string, host : string, port : number, id : number = null) {
        super(id);

        this.setName(name);
	    this.setService(service);
	    this.setDescription(description);
	    this.setHost(host);
	    this.setPort(port);

        this._info_type = null;
        this._info_type_loaded = false;

        this._param_types = new Array<ParamType>();
        this._param_types_loaded = false;

        this._param_values = new Array<ParamValue>();
        this._param_values_loaded = false;
    }

	/**
	 * Set the Source's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		if(name == null || name == "") {
			Logger.error("A Source needs to have a name.");
			// TODO : Throw an Exception ?
		}

		this._name = name;
	}

	/**
	 * Set the Source's service.
	 *
	 * @method setService
	 */
	setService(service : string) {
		if(service == null || service == "") {
			Logger.error("A Source needs to have a service.");
			// TODO : Throw an Exception ?
		}

		this._service = service;
	}

	/**
	 * Set the Source's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string) {
		if(description == null || description == "") {
			Logger.error("A Source needs to have a description.");
			// TODO : Throw an Exception ?
		}

		this._description = description;
	}

	/**
	 * Set the Source's host.
	 *
	 * @method setHost
	 */
	setHost(host : string) {
		if(host == null || host == "") {
			Logger.error("A Source needs to have a host.");
			// TODO : Throw an Exception ?
		}

		this._host = host;
	}

	/**
	 * Set the Source's port.
	 *
	 * @method setPort
	 */
	setPort(port : number) {
		if(port == null) {
			Logger.error("A Source needs to have a port.");
			// TODO : Throw an Exception ?
		}

		this._port = port;
	}

	/**
     * Return the Source's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Return the Source's service.
     *
     * @method service
     */
    service() {
        return this._service;
    }

    /**
     * Return the Source's description.
     *
     * @method description
     */
    description() {
        return this._description;
    }

    /**
     * Return the Source's host.
     *
     * @method host
     */
    host() {
        return this._host;
    }

    /**
     * Return the Source's port.
     *
     * @method port
     */
    port() {
        return this._port;
    }

    /**
     * Return the Source's infoType.
     *
     * @method infoType
     */
    infoType() {
        if(! this._info_type_loaded) {
	        var value = [];
            this._info_type_loaded = this.getUniquelyAssociatedObject(Source, InfoType, value);
	        if (this._info_type_loaded) {
		        this._info_type = value[0];
	        }
        }
        return this._info_type;
    }

    /**
     * Return the Source's paramTypes.
     *
     * @method paramTypes
     */
    paramTypes() {
        if(! this._param_types_loaded) {
            this._param_types_loaded = this.getAssociatedObjects(Source, ParamType, this._param_types);
        }
        return this._param_types;
    }

    /**
     * Return the Source's paramValues.
     *
     * @method paramValues
     */
    paramValues() {
        if(! this._param_values_loaded) {
            this._param_values_loaded = this.getAssociatedObjects(Source, ParamValue, this._param_values);
        }
        return this._param_values;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Load all the lazy loading properties of the object.
	 * Useful when you want to get a complete object.
     *
     * @method loadAssociations
	 */
	loadAssociations() : void {
		this.paramTypes();
		this.paramValues();
		this.infoType();
	}

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._info_type_loaded = false;
		this._param_types_loaded = false;
		this._param_values_loaded = false;
	}

	/**
	 * Return a Source instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"service": this.service(),
			"description": this.description(),
			"host": this.host(),
			"port": this.port()
		};
		return data;
	}

	/**
	 * Return a Source instance as a JSON Object including associated object.
	 * However the method should not be recursive due to cycle in the model.
	 *
	 * @method toCompleteJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toCompleteJSONObject() : Object {
		this.loadAssociations();
		var data = this.toJSONObject();
		data["infoType"] = (this.infoType() !== null) ? this.infoType().toJSONObject() : null;
		data["paramTypes"] = this.serializeArray(this.paramTypes());
		data["paramValues"] = this.serializeArray(this.paramValues());
		return data;
	}

	/**
	 * Set the InfoType of the Source.
	 * As a Source can only have one InfoType, if the value is already set, this method throws an exception: you need first to unset the InfoType.
	 * Moreover the given type must be created in database.
	 *
     * @method setInfoType
	 * @param {InfoType} it The InfoType to associate with the Source.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setInfoType(it : InfoType) : boolean {
		if (this.infoType() !== null) {
			throw new Error("The InfoType is already set for this Source.");
		}

		if (it === null || it.getId() === undefined || it.getId() === null) {
			throw new Error("The InfoType must be an existing object to be associated.");
		}

		if (this.associateObject(Source, InfoType, it.getId())) {
			it.desynchronize();
			this._info_type = it;
			this._info_type_loaded = true;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Unset the current InfoType from the Source.
	 * It both sets a null value for the object property and remove the association in database.
	 * An InfoType must have been set before using it, else an exception is thrown.
	 *
     * @method unsetInfoType
	 * @returns {boolean} Returns true if the InfoType is well unset and the association removed in database.
	 */
	unsetInfoType() : boolean {
		if (this.infoType() === null) {
			throw new Error("No InfoType has been set for this Source.");
		}

		if (this.deleteObjectAssociation(Source, InfoType, this.infoType().getId())) {
			this.infoType().desynchronize();
			this._info_type = null;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Add a new ParamType to the Source and associate it in the database.
	 * A ParamType can only be added once.
	 *
     * @method addParamType
	 * @param {ParamType} pt The ParamType to add inside the Source. It cannot be a null value.
	 * @returns {boolean} Returns true if the association is realized in database.
	 */
	addParamType(pt : ParamType) : boolean {
		if (this.paramTypes().indexOf(pt) !== -1) {
			throw new Error("You cannot add twice a ParamType for a SDI.");
		}
		if (pt === null || pt.getId() === undefined || pt.getId() === null) {
			throw new Error("The ParamType must be an existing object to be associated.");
		}

		if (this.associateObject(Source, ParamType, pt.getId())) {
			pt.desynchronize();
			this.paramTypes().push(pt);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Remove a ParamType from the Source: the association is removed both in the object and in database.
	 * The ParamType can only be removed if it exists first in the list of associated ParamTypes, else an exception is thrown.
	 *
     * @method removeParamType
	 * @param {ParamType} pt The ParamType to remove from that Source
	 * @returns {boolean} Returns true if the association is deleted in database.
	 */
	removeParamType(pt : ParamType) : boolean {
		var indexValue = this.paramTypes().indexOf(pt);
		if (indexValue === -1) {
			throw new Error("The ParamType you try to remove has not been added to the current Source");
		}

		if (this.deleteObjectAssociation(Source, ParamType, pt.getId())) {
			pt.desynchronize();
			this.paramTypes().splice(indexValue, 1);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Add a new ParamValue to the Source and associate it in the database.
	 * A ParamValue can only be added once.
	 *
     * @method addParamValue
	 * @param {ParamValue} pv The ParamValue to add inside the Source. It cannot be a null value.
	 * @returns {boolean} Returns true if the association is realized in database.
	 */
	addParamValue(pv : ParamValue) : boolean {
		if (this.paramValues().indexOf(pv) !== -1) {
			throw new Error("You cannot add twice a ParamValue for a SDI.");
		}
		if (pv === null || pv.getId() === undefined || pv.getId() === null) {
			throw new Error("The ParamValue must be an existing object to be associated.");
		}

		if (this.associateObject(Source, ParamValue, pv.getId())) {
			pv.desynchronize();
			this.paramValues().push(pv);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Remove a ParamValue from the Source: the association is removed both in the object and in database.
	 * The ParamValue can only be removed if it exists first in the list of associated ParamValues, else an exception is thrown.
	 *
     * @method removeParamValue
	 * @param {ParamValue} pv The ParamValue to remove from that Source
	 * @returns {boolean} Returns true if the association is deleted in database.
	 */
	removeParamValue(pv : ParamValue) : boolean {
		var indexValue = this.paramValues().indexOf(pv);
		if (indexValue === -1) {
			throw new Error("The ParamValue you try to remove has not been added to the current Source");
		}

		if (this.deleteObjectAssociation(Source, ParamValue, pv.getId())) {
			pv.desynchronize();
			this.paramValues().splice(indexValue, 1);
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
        return this.createObject(Source, this.toJSONObject());
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {Source} The model instance.
     */
    static read(id : number) : Source {
        return this.readObject(Source, id);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        return this.updateObject(Source, this.toJSONObject());
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        return this.deleteObject(Source);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<Source>} The model instances.
     */
    static all() : Array<Source> {
        return this.allObjects(Source);
    }

	/**
	 * Return a Source instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Source} The model instance.
	 */
	static parseJSON(jsonString : string) : Source {
		return Source.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a Source instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Source} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : Source {
		if(typeof(jsonObject.name) == "undefined" ||
			typeof(jsonObject.service) == "undefined" ||
			typeof(jsonObject.description) == "undefined" ||
			typeof(jsonObject.host) == "undefined" ||
			typeof(jsonObject.port) == "undefined" ||
			typeof(jsonObject.id) == "undefined") {
			return null;
		} else {
			return new Source(jsonObject.name, jsonObject.service, jsonObject.description, jsonObject.host, jsonObject.port, jsonObject.id);
		}
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Sources";
    }
}