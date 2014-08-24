/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../core/Logger.ts" />

/**
 * Model Interface
 *
 * @class ModelItf
 */
class ModelItf {

    /**
     * ID property.
     *
     * @property _id
     * @type number
     */
    _id : number;

    /**
     * Constructor.
     *
     * @param {number} id - The model ID.
     */
    constructor(id : number) {
        this._id = id;
    }

    /**
     * Returns ID of model.
     *
     * @return {number} The model's ID.
     */
    getId() : number {
        return this._id;
    }

    /**
     * Create model in database.
     */
    create() {
        Logger.error("ModelItf - create : Method need to be implemented.");
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @return {ModelItf} The model instance.
     */
    static read(id : number) : ModelItf {
        Logger.error("ModelItf - read : Method need to be implemented.");
        return null;
    }

    /**
     * Update in database the model with current id.
     */
    update() {
        Logger.error("ModelItf - update : Method need to be implemented.");
    }

    /**
     * Delete in database the model with current id.
     */
    delete() {
        Logger.error("ModelItf - delete : Method need to be implemented.");
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @return {Array<ModelItf>} The model instances.
     */
    static all() : Array<ModelItf> {
        Logger.error("ModelItf - all : Method need to be implemented.");
        return null;
    }
}