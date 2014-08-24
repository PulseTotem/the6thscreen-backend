/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : Renderer
 *
 * @class Renderer
 * @extends ModelItf
 */
class Renderer extends ModelItf {

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
     * @param {string} name - The Renderer's name.
     * @param {string} description - The Renderer's description.
     * @param {number} id - The Renderer's ID.
     */
    constructor(name : string, description : string, id : number = null) {
        super(id);

        if(this._name == null || this._name == "") {
            Logger.error("A Renderer needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;

        if(this._description == null || this._description == "") {
            Logger.error("A Renderer needs to have a description.");
            // TODO : Throw an Exception ?
        }

        this._description = description;
    }

    /**
     * Return the Renderer's name.
     */
    name() {
        return this._name;
    }

    /**
     * Return the Renderer's description.
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
     * @return {Renderer} The model instance.
     */
    static read(id : number) : Renderer {
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
     * @return {Array<Renderer>} The model instances.
     */
    static all() : Array<Renderer> {
        // TODO
        return null;
    }
}