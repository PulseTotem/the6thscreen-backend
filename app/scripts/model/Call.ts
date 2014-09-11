/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Source.ts" />
/// <reference path="./ParamValue.ts" />

/// <reference path="../core/Logger.ts" />
/// <reference path="../core/RestClient.ts" />
/// <reference path="../core/DatabaseConnection.ts" />

/**
 * Model : Call
 *
 * @class Call
 * @extends ModelItf
 */
class Call extends ModelItf {

    /**
     * Name property.
     *
     * @property _name
     * @type string
     */
    private _name : string;

    /**
     * Source property.
     *
     * @property _source
     * @type Source
     */
    private _source : Source;

    /**
     * Lazy loading for Source property.
     *
     * @property _source_loaded
     * @type boolean
     */
    private _source_loaded : boolean;

    /**
     * ParamValues property.
     *
     * @property _param_values
     * @type Array<ParamValue>
     */
    private _param_values : Array<ParamValue>;

    /**
     * Lazy loading for ParamValues property.
     *
     * @property _param_values_loaded
     * @type boolean
     */
    private _param_values_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Call's name.
     * @param {number} id - The Call's ID.
     */
    constructor(name : string, id : number = null) {
        super(id);

        this.setName(name);

        this._source = null;
        this._source_loaded = false;

        this._param_values = new Array<ParamValue>();
        this._param_values_loaded = false;
    }

    /**
     * Return the Call's name.
     */
    name() {
        return this._name;
    }

    /**
     * Set the Call's name.
     *
     * @method setName
     */
    setName(name : string) {
        if(name == null || name == "") {
            Logger.error("A Call needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;
    }

    /**
     * Return the Call's source.
     */
    source() {
        if(! this._source_loaded) {
            // TODO : Retrieve from database.
            this._source_loaded = true;
        }
        return this._source;
    }

    /**
     * Return the Call's paramValues.
     */
    paramValues() {
        if(! this._param_values_loaded) {
            // TODO : Retrieve from database.
            this._param_values_loaded = true;
        }
        return this._param_values;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

    /**
     * Create model in database.
     *
     * @method create
     * @return {boolean} Create status
     */
    create() : boolean {
        var data = new Object();
        data["name"] = this.name();

        return this.createObject(Call, data);
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {Call} The model instance.
     */
    static read(id : number) : Call {
        return ModelItf.readObject(Call, id);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        var data = new Object();
        data["name"] = this.name();

        return this.updateObject(Call, data);
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        return this.deleteObject(Call);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<Call>} The model instances.
     */
    static all() : Array<Call> {
        return ModelItf.allObjects(Call);
    }

    /**
     * Return a Call instance from a JSON string.
     *
     * @method parseJSON
     * @static
     * @param {string} json - The JSON string
     * @return {Call} The model instance.
     */
    static parseJSON(jsonString : string) : Call {
        return Call.fromJSONObject(JSON.parse(jsonString));
    }

    /**
     * Return a Call instance from a JSON Object.
     *
     * @method fromJSONObject
     * @static
     * @param {JSONObject} json - The JSON Object
     * @return {Call} The model instance.
     */
    static fromJSONObject(jsonObject : any) : Call {
        if(typeof(jsonObject.name) == "undefined" || typeof(jsonObject.id) == "undefined") {
            return null;
        } else {
            return new Call(jsonObject.name, jsonObject.id);
        }
    }

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Calls";
    }
}