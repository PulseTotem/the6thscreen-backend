/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./CallType.ts" />
/// <reference path="./Call.ts" />

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
     * CallTypes property.
     *
     * @property _call_types
     * @type Array<CallType>
     */
    private _call_types : Array<CallType>;

    /**
     * Lazy loading for CallTypes property.
     *
     * @property _call_types_loaded
     * @type boolean
     */
    private _call_types_loaded : boolean;

    /**
     * Calls property.
     *
     * @property _calls
     * @type Array<Call>
     */
    private _calls : Array<Call>;

    /**
     * Lazy loading for Calls property.
     *
     * @property _calls_loaded
     * @type boolean
     */
    private _calls_loaded : boolean;

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

        this._call_types = new Array<CallType>();
        this._call_types_loaded = false;

        this._calls = new Array<Call>();
        this._calls_loaded = false;
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

    /**
     * Return the Zone's CallTypes.
     */
    callTypes() {
        if(! this._call_types_loaded) {
            this._call_types_loaded = this.getAssociatedObjects(Zone, CallType, this._call_types);
        }
        return this._call_types;
    }

    /**
     * Return the Zone's calls.
     */
    calls() {
        if(! this._calls_loaded) {
            this._calls_loaded = this.getAssociatedObjects(Zone, Call, this._calls);
        }
        return this._calls;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	loadAssociations() : void {
		this.calls();
		this.callTypes();
	}

	toJSONObject() : Object {
		var data = {
			"name": this.name(),
			"description": this.description(),
			"position": this.position()
		};
		return data;
	}

	addCallType(ct : CallType) : boolean {
		return this.associateObject(Zone, CallType, ct.getId());
	}

	addCall(c : Call) : boolean {
		return this.associateObject(Zone, Call, c.getId());
	}

    /**
     * Create model in database.
     *
     * @method create
     * @return {boolean} Create status
     */
    create() : boolean {
        return this.createObject(Zone, this.toJSONObject());
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {Zone} The model instance.
     */
    static read(id : number) : Zone {
        return this.readObject(Zone, id);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        return this.updateObject(Zone, this.toJSONObject());
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        return this.deleteObject(Zone);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<Zone>} The model instances.
     */
    static all() : Array<Zone> {
        return this.allObjects(Zone);
    }

	/**
	 * Return a Zone instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Zone} The model instance.
	 */
	static parseJSON(jsonString : string) : Zone {
		return Zone.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a Zone instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Zone} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : Zone {
		if(typeof(jsonObject.name) == "undefined" ||
			typeof(jsonObject.description) == "undefined" ||
			typeof(jsonObject.position) == "undefined" ||
			typeof(jsonObject.id) == "undefined") {
			return null;
		} else {
			return new Zone(jsonObject.name, jsonObject.description, jsonObject.position, jsonObject.id);
		}
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Zones";
    }
}