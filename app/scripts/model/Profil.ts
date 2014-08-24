/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

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