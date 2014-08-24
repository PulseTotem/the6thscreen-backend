/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Call.ts" />
/// <reference path="./Timeline.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : Profil
 *
 * @class Profil
 * @extends ModelItf
 */
class Profil extends ModelItf {

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
     * Timelines property.
     *
     * @property _timelines
     * @type Array<Timeline>
     */
    private _timelines : Array<Timeline>;

    /**
     * Lazy loading for Timelines property.
     *
     * @property _timelines_loaded
     * @type boolean
     */
    private _timelines_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Profil's name.
     * @param {string} description - The Profil's description.
     * @param {number} id - The Profil's ID.
     */
    constructor(name : string, description : string, id : number = null) {
        super(id);

        if(this._name == null || this._name == "") {
            Logger.error("A Profil needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;

        if(this._description == null || this._description == "") {
            Logger.error("A Profil needs to have a description.");
            // TODO : Throw an Exception ?
        }

        this._description = description;

        this._calls = new Array<Call>();
        this._calls_loaded = false;

        this._timelines = new Array<Timeline>();
        this._timelines_loaded = false;
    }

    /**
     * Return the Profil's name.
     */
    name() {
        return this._name;
    }

    /**
     * Return the Profil's description.
     */
    description() {
        return this._description;
    }

    /**
     * Return the Profil's calls.
     */
    calls() {
        if(! this._calls_loaded) {
            // TODO : Retrieve from database.
            this._calls_loaded = true;
        }
        return this._calls;
    }

    /**
     * Return the Profil's timelines.
     */
    timelines() {
        if(! this._timelines_loaded) {
            // TODO : Retrieve from database.
            this._timelines_loaded = true;
        }
        return this._timelines;
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
     * @return {Profil} The model instance.
     */
    static read(id : number) : Profil {
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
     * @return {Array<Profil>} The model instances.
     */
    static all() : Array<Profil> {
        // TODO
        return null;
    }
}