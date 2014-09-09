/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : ParamType
 *
 * @class ParamType
 * @extends ModelItf
 */
class ParamType extends ModelItf {

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
     * Type property.
     *
     * @property _type
     * @type string
     */
    private _type : string;

    /**
     * Constraint property.
     *
     * @property _constraint
     * @type string
     */
    private _constraint : string;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The ParamType's name.
     * @param {string} description - The ParamType's description.
     * @param {string} type - The ParamType's type.
     * @param {string} constraint - The ParamType's constraint.
     * @param {number} id - The ParamType's ID.
     */
    constructor(name : string, description : string, type : string, constraint : string, id : number = null) {
        super(id);

        if(this._name == null || this._name == "") {
            Logger.error("A ParamType needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;

        if(this._description == null || this._description == "") {
            Logger.error("A ParamType needs to have a description.");
            // TODO : Throw an Exception ?
        }

        this._description = description;

        if(this._type == null || this._type == "") {
            Logger.error("A ParamType needs to have a type.");
            // TODO : Throw an Exception ?
        }

        this._type = type;

        if(this._constraint == null || this._constraint == "") {
            Logger.error("A ParamType needs to have a constraint.");
            // TODO : Throw an Exception ?
        }

        this._constraint = constraint;
    }

    /**
     * Return the ParamType's name.
     */
    name() {
        return this._name;
    }

    /**
     * Return the ParamType's description.
     */
    description() {
        return this._description;
    }

    /**
     * Return the ParamType's type.
     */
    type() {
        return this._type;
    }

    /**
     * Return the ParamType's constraint.
     */
    constraint() {
        return this._constraint;
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
     * @return {ParamType} The model instance.
     */
    static read(id : number) : ParamType {
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
     * @return {Array<ParamType>} The model instances.
     */
    static all() : Array<ParamType> {
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