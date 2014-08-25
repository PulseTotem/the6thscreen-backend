/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Source.ts" />
/// <reference path="./Renderer.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : InfoType
 *
 * @class InfoType
 * @extends ModelItf
 */
class InfoType extends ModelItf {

    /**
     * Name property.
     *
     * @property _name
     * @type string
     */
    private _name : string;

    /**
     * Sources property.
     *
     * @property _sources
     * @type Array<Source>
     */
    private _sources : Array<Source>;

    /**
     * Lazy loading for Sources property.
     *
     * @property _sources_loaded
     * @type boolean
     */
    private _sources_loaded : boolean;

    /**
     * Renderers property.
     *
     * @property _renderers
     * @type Array<Renderer>
     */
    private _renderers : Array<Renderer>;

    /**
     * Lazy loading for Renderers property.
     *
     * @property _renderers_loaded
     * @type boolean
     */
    private _renderers_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The InfoType's name.
     * @param {number} id - The InfoType's ID.
     */
    constructor(name : string, id : number = null) {
        super(id);

        if(this._name == null || this._name == "") {
            Logger.error("A InfoType needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;

        this._sources = new Array<Source>();
        this._sources_loaded = false;

        this._renderers = new Array<Renderer>();
        this._renderers_loaded = false;
    }

    /**
     * Return the InfoType's name.
     */
    name() {
        return this._name;
    }

    /**
     * Return the InfoType's sources.
     */
    sources() {
        if(! this._sources_loaded) {
            // TODO : Retrieve from database.
            this._sources_loaded = true;
        }
        return this._sources;
    }

    /**
     * Return the InfoType's renderers.
     */
    renderers() {
        if(! this._renderers_loaded) {
            // TODO : Retrieve from database.
            this._renderers_loaded = true;
        }
        return this._renderers;
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
     * @return {InfoType} The model instance.
     */
    static read(id : number) : InfoType {
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
     * @return {Array<InfoType>} The model instances.
     */
    static all() : Array<InfoType> {
        // TODO
        return null;
    }
}