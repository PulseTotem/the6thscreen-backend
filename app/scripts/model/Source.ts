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

        if(this._name == null || this._name == "") {
            Logger.error("A Source needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;

        if(this._service == null || this._service == "") {
            Logger.error("A Source needs to have a service.");
            // TODO : Throw an Exception ?
        }

        this._service = service;

        if(this._description == null || this._description == "") {
            Logger.error("A Source needs to have a description.");
            // TODO : Throw an Exception ?
        }

        this._description = description;

        if(this._host == null || this._host == "") {
            Logger.error("A Source needs to have a host.");
            // TODO : Throw an Exception ?
        }

        this._host = host;

        if(this._port == null || this._port < 0) {
            Logger.error("A Source needs to have a correct port number.");
            // TODO : Throw an Exception ?
        }

        this._port = port;

        this._info_type = null;
        this._info_type_loaded = false;

        this._param_types = new Array<ParamType>();
        this._param_types_loaded = false;

        this._param_values = new Array<ParamValue>();
        this._param_values_loaded = false;
    }

    /**
     * Return the Source's name.
     */
    name() {
        return this._name;
    }

    /**
     * Return the Source's service.
     */
    service() {
        return this._service;
    }

    /**
     * Return the Source's description.
     */
    description() {
        return this._description;
    }

    /**
     * Return the Source's host.
     */
    host() {
        return this._host;
    }

    /**
     * Return the Source's port.
     */
    port() {
        return this._port;
    }

    /**
     * Return the Source's infoType.
     */
    infoType() {
        if(! this._info_type_loaded) {
            this._info_type_loaded = this.getUniquelyAssociatedObject(Source, InfoType, this._info_type);
        }
        return this._info_type;
    }

    /**
     * Return the Source's paramTypes.
     */
    paramTypes() {
        if(! this._param_types_loaded) {
            this._param_types_loaded = this.getAssociatedObjects(Source, ParamType, this._param_types);
        }
        return this._param_types;
    }

    /**
     * Return the Source's paramValues.
     */
    paramValues() {
        if(! this._param_values_loaded) {
            this._param_values_loaded = this.getAssociatedObjects(Source, ParamValue, this._param_values);
        }
        return this._param_values;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	loadAssociations() : void {
		this.paramTypes();
		this.paramValues();
		this.infoType();
	}

	toJSONObject() : Object {
		var data = {
			"name": this.name(),
			"service": this.service(),
			"description": this.description(),
			"host": this.host(),
			"port": this.port()
		};

		return data;
	}

	setInfoType(i : InfoType) : boolean {
		return this.associateObject(Source, InfoType, i.getId());
	}

	addParamType(p : ParamType) : boolean {
		return this.associateObject(Source, ParamType, p.getId());
	}

	addParamValue(p : ParamValue) : boolean {
		return this.associateObject(Source, ParamValue, p.getId());
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