/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Source.ts" />
/// <reference path="./ParamValue.ts" />

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
     * Source property.
     *
     * @property _source
     * @type Source
     */
    private _source : Source;

    /**
     * Lazy loading for Source property.
     *
     * @property _source_loaded
     * @type boolean
     */
    private _source_loaded : boolean;

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
    constructor(name : string, id : number = null) {
        super(id);

        if(this._name == null || this._name == "") {
            Logger.error("A Call needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;

        this._source = null;
        this._source_loaded = false;

        this._param_values = new Array<ParamValue>();
        this._param_values_loaded = false;
    }

    /**
     * Return the Call's name.
     */
    name() {
        return this._name;
    }

    /**
     * Return the Call's source.
     */
    source() {
        if(! this._source_loaded) {
            // TODO : Retrieve from database.
            this._source_loaded = true;
        }
        return this._source;
    }

    /**
     * Return the Call's paramValues.
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
     */
    create() {
        // TODO
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @return {Call} The model instance.
     */
    static read(id : number) : Call {
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
     * @return {Array<Call>} The model instances.
     */
    static all() : Array<Call> {
        // TODO
        return null;
    }
}