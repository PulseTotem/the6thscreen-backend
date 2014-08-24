/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

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

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

    /**
     * Create model in database.
     */
    create() {
        // TODO
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @return {Source} The model instance.
     */
    static read(id : number) : Source {
        // TODO
        return null;
    }

    /**
     * Update in database the model with current id.
     */
    update() {
        // TODO
    }

    /**
     * Delete in database the model with current id.
     */
    delete() {
        // TODO
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @return {Array<Source>} The model instances.
     */
    static all() : Array<Source> {
        // TODO
        return null;
    }
}