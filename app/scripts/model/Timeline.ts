/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Profil.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : Timeline
 *
 * @class Timeline
 * @extends ModelItf
 */
class Timeline extends ModelItf {

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
     * Profils property.
     *
     * @property _profils
     * @type Array<Profil>
     */
    private _profils : Array<Profil>;

    /**
     * Lazy loading for Profils property.
     *
     * @property _profils_loaded
     * @type boolean
     */
    private _profils_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Timeline's name.
     * @param {string} description - The Timeline's description.
     * @param {number} id - The Timeline's ID.
     */
    constructor(name : string, description : string, id : number = null) {
        super(id);

        if(this._name == null || this._name == "") {
            Logger.error("A Timeline needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;

        if(this._description == null || this._description == "") {
            Logger.error("A Timeline needs to have a description.");
            // TODO : Throw an Exception ?
        }

        this._description = description;

        this._profils = new Array<Profil>();
        this._profils_loaded = false;
    }

    /**
     * Return the Timeline's name.
     */
    name() {
        return this._name;
    }

    /**
     * Return the Timeline's description.
     */
    description() {
        return this._description;
    }

    /**
     * Return the Timeline's profils.
     */
    profils() {
        if(! this._profils_loaded) {
            // TODO : Retrieve from database.
            this._profils_loaded = true;
        }
        return this._profils;
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
     * @return {Timeline} The model instance.
     */
    static read(id : number) : Timeline {
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
     * @return {Array<Timeline>} The model instances.
     */
    static all() : Array<Timeline> {
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