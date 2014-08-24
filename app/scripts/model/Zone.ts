/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : Zone
 *
 * @class Zone
 * @extends ModelItf
 */
class Zone extends ModelItf {

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
     * Position property.
     *
     * @property _position
     * @type string
     */
    private _position : string;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Zone's name.
     * @param {string} description - The Zone's description.
     * @param {string} position - The Zone's position.
     * @param {number} id - The Zone's ID.
     */
    constructor(name : string, description : string, position : string, id : number = null) {
        super(id);

        if(this._name == null || this._name == "") {
            Logger.error("A Zone needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;

        if(this._description == null || this._description == "") {
            Logger.error("A Zone needs to have a description.");
            // TODO : Throw an Exception ?
        }

        this._description = description;

        if(this._position == null || this._position == "") {
            Logger.error("A Zone needs to have a position.");
            // TODO : Throw an Exception ?
        }

        this._position = position;
    }

    /**
     * Return the Zone's name.
     */
    name() {
        return this._name;
    }

    /**
     * Return the Zone's description.
     */
    description() {
        return this._description;
    }

    /**
     * Return the Zone's position.
     */
    position() {
        return this._position;
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
     * @return {Zone} The model instance.
     */
    static read(id : number) : Zone {
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
     * @return {Array<Zone>} The model instances.
     */
    static all() : Array<Zone> {
        // TODO
        return null;
    }
}