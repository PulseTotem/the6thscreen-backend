/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : ReceivePolicy
 *
 * @class ReceivePolicy
 * @extends ModelItf
 */
class ReceivePolicy extends ModelItf {

    /**
     * Name property.
     *
     * @property _name
     * @type string
     */
    private _name : string;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The ReceivePolicy's name.
     * @param {number} id - The ReceivePolicy's ID.
     */
        constructor(name : string, id : number = null) {
        super(id);

        if(this._name == null || this._name == "") {
            Logger.error("A ReceivePolicy needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;
    }

    /**
     * Return the ReceivePolicy's name.
     */
    name() {
        return this._name;
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
     * @return {ReceivePolicy} The model instance.
     */
    static read(id : number) : ReceivePolicy {
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
     * @return {Array<ReceivePolicy>} The model instances.
     */
    static all() : Array<ReceivePolicy> {
        // TODO
        return null;
    }
}