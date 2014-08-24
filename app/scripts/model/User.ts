/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

/**
 * Model : User
 *
 * @class User
 * @extends ModelItf
 */
class User extends ModelItf {

    /**
     * Username property.
     *
     * @property _username
     * @type string
     */
    private _username : string;


    /**
     * Constructor.
     *
     * @constructor
     * @param {any} clientSocket - The Client's socket.
     */
    constructor(username : string, id : number = null) {
        super(id);
        this._username = username;
    }

    /**
     * Create model in database.
     */
    create() {
        // TODO
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @return {ModelItf} The model instance.
     */
    static read(id : number) : ModelItf {
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
}