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
            // TODO : Retrieve from database.
            this._info_type_loaded = true;
        }
        return this._info_type;
    }

    /**
     * Return the Source's paramTypes.
     */
    paramTypes() {
        if(! this._param_types_loaded) {
            // TODO : Retrieve from database.
            this._param_types_loaded = true;
        }
        return this._param_types;
    }

    /**
     * Return the Source's paramValues.
     */
    paramValues() {
        if(! this._param_values_loaded) {
            // TODO : Retrieve from database.
            this._param_values_loaded = true;
        }
        return this._param_values;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

    /**
     * Create model in database.
     *
     * @method create
     * @return {boolean} Create status
     */
    create() : boolean {
        // TODO
        return false;
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
        // TODO
        return null;
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        // TODO
        return false;
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        // TODO
        return false;
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<Source>} The model instances.
     */
    static all() : Array<Source> {
        // TODO
        return null;
    }

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        // TODO
        return "";
    }
}