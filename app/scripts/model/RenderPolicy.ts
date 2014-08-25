/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : RenderPolicy
 *
 * @class RenderPolicy
 * @extends ModelItf
 */
class RenderPolicy extends ModelItf {

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
     * @param {string} name - The RenderPolicy's name.
     * @param {string} description - The RenderPolicy's description.
     * @param {number} id - The RenderPolicy's ID.
     */
    constructor(name : string, description : string, id : number = null) {
        super(id);

        if(this._name == null || this._name == "") {
            Logger.error("A RenderPolicy needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;

        if(this._description == null || this._description == "") {
            Logger.error("A RenderPolicy needs to have a description.");
            // TODO : Throw an Exception ?
        }

        this._description = description;
    }

    /**
     * Return the RenderPolicy's name.
     */
    name() {
        return this._name;
    }

    /**
     * Return the RenderPolicy's description.
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
     * @return {RenderPolicy} The model instance.
     */
    static read(id : number) : RenderPolicy {
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
     * @return {Array<RenderPolicy>} The model instances.
     */
    static all() : Array<RenderPolicy> {
        // TODO
        return null;
    }
}