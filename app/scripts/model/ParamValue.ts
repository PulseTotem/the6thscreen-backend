/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : ParamValue
 *
 * @class ParamValue
 * @extends ModelItf
 */
class ParamValue extends ModelItf {

    /**
     * Value property.
     *
     * @property _value
     * @type string
     */
    private _value : string;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} value - The ParamValue's value.
     * @param {number} id - The ParamValue's ID.
     */
    constructor(value : string, id : number = null) {
        super(id);

        if(this._value == null || this._value == "") {
            Logger.error("A ParamValue needs to have a value.");
            // TODO : Throw an Exception ?
        }

        this._value = value;
    }

    /**
     * Return the ParamValue's value.
     */
    value() {
        return this._value;
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
     * @return {ParamValue} The model instance.
     */
    static read(id : number) : ParamValue {
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
     * @return {Array<ParamValue>} The model instances.
     */
    static all() : Array<ParamValue> {
        // TODO
        return null;
    }
}