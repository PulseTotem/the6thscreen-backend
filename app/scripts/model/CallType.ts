/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Source.ts" />
/// <reference path="./Renderer.ts" />
/// <reference path="./ReceivePolicy.ts" />
/// <reference path="./RenderPolicy.ts" />
/// <reference path="./Call.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : CallType
 *
 * @class CallType
 * @extends ModelItf
 */
class CallType extends ModelItf {

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
     * Renderer property.
     *
     * @property _renderer
     * @type Renderer
     */
    private _renderer : Renderer;

    /**
     * Lazy loading for Renderer property.
     *
     * @property _renderer_loaded
     * @type boolean
     */
    private _renderer_loaded : boolean;

    /**
     * ReceivePolicy property.
     *
     * @property _receive_policy
     * @type ReceivePolicy
     */
    private _receive_policy : ReceivePolicy;

    /**
     * Lazy loading for ReceivePolicy property.
     *
     * @property _receive_policy_loaded
     * @type boolean
     */
    private _receive_policy_loaded : boolean;

    /**
     * RenderPolicy property.
     *
     * @property _render_policy
     * @type RenderPolicy
     */
    private _render_policy : RenderPolicy;

    /**
     * Lazy loading for RenderPolicy property.
     *
     * @property _render_policy_loaded
     * @type boolean
     */
    private _render_policy_loaded : boolean;

    /**
     * Calls property.
     *
     * @property _calls
     * @type Array<Call>
     */
    private _calls : Array<Call>;

    /**
     * Lazy loading for Calls property.
     *
     * @property _calls_loaded
     * @type boolean
     */
    private _calls_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The CallType's name.
     * @param {string} description - The CallType's description.
     * @param {number} id - The CallType's ID.
     */
    constructor(name : string, description : string, id : number = null) {
        super(id);

        if(this._name == null || this._name == "") {
            Logger.error("A CallType needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;

        if(this._description == null || this._description == "") {
            Logger.error("A CallType needs to have a description.");
            // TODO : Throw an Exception ?
        }

        this._description = description;

        this._source = null;
        this._source_loaded = false;

        this._renderer = null;
        this._renderer_loaded = false;

        this._receive_policy = null;
        this._receive_policy_loaded = false;

        this._render_policy = null;
        this._render_policy_loaded = false;

        this._calls = new Array<Call>();
        this._calls_loaded = false;
    }

    /**
     * Return the CallType's name.
     */
    name() {
        return this._name;
    }

    /**
     * Return the CallType's description.
     */
    description() {
        return this._description;
    }

    /**
     * Return the CallType's source.
     */
    source() {
        if(! this._source_loaded) {
            // TODO : Retrieve from database.
            this._source_loaded = true;
        }
        return this._source;
    }

    /**
     * Return the CallType's renderer.
     */
    renderer() {
        if(! this._renderer_loaded) {
            // TODO : Retrieve from database.
            this._renderer_loaded = true;
        }
        return this._renderer;
    }

    /**
     * Return the CallType's receivePolicy.
     */
    receivePolicy() {
        if(! this._receive_policy_loaded) {
            // TODO : Retrieve from database.
            this._receive_policy_loaded = true;
        }
        return this._receive_policy;
    }

    /**
     * Return the CallType's renderPolicy.
     */
    renderPolicy() {
        if(! this._render_policy_loaded) {
            // TODO : Retrieve from database.
            this._render_policy_loaded = true;
        }
        return this._render_policy;
    }

    /**
     * Return the CallType's calls.
     */
    calls() {
        if(! this._calls_loaded) {
            // TODO : Retrieve from database.
            this._calls_loaded = true;
        }
        return this._calls;
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
     * @return {CallType} The model instance.
     */
    static read(id : number) : CallType {
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
     * @return {Array<CallType>} The model instances.
     */
    static all() : Array<CallType> {
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