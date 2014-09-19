/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./User.ts" />
/// <reference path="./Zone.ts" />
/// <reference path="./Profil.ts" />
/// <reference path="./Timeline.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : SDI
 *
 * @class SDI
 * @extends ModelItf
 */
class SDI extends ModelItf {

    /**
     * Description property.
     *
     * @property _description
     * @type string
     */
    private _description : string;

    /**
     * AllowedHost property.
     *
     * @property _allowedHost
     * @type string
     */
    private _allowedHost : string;

    /**
     * Users property.
     *
     * @property _users
     * @type Array<User>
     */
    private _users : Array<User>;

    /**
     * Lazy loading for Users property.
     *
     * @property _users_loaded
     * @type boolean
     */
    private _users_loaded : boolean;

    /**
     * Zones property.
     *
     * @property _zones
     * @type Array<Zone>
     */
    private _zones : Array<Zone>;

    /**
     * Lazy loading for Zones property.
     *
     * @property _zones_loaded
     * @type boolean
     */
    private _zones_loaded : boolean;

    /**
     * Profils property.
     *
     * @property _profils
     * @type Array<Profil>
     */
    private _profils : Array<Profil>;

    /**
     * Lazy loading for Profils property.
     *
     * @property _profils_loaded
     * @type boolean
     */
    private _profils_loaded : boolean;

    /**
     * Timelines property.
     *
     * @property _timelines
     * @type Array<Timeline>
     */
    private _timelines : Array<Timeline>;

    /**
     * Lazy loading for Timelines property.
     *
     * @property _timelines_loaded
     * @type boolean
     */
    private _timelines_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} description - The SDI's description.
     * @param {string} allowedHost - The SDI's allowedHost.
     * @param {number} id - The SDI's ID.
     */
    constructor(description : string, allowedHost : string, id : number = null) {
        super(id);

        if(this._description == null || this._description == "") {
            Logger.error("A SDI needs to have a description.");
            // TODO : Throw an Exception ?
        }

        this._description = description;

        if(this._allowedHost == null || this._allowedHost == "") {
            Logger.error("A SDI needs to have allowedHost property.");
            // TODO : Throw an Exception ?
        }

        this._allowedHost = allowedHost;

        this._users = new Array<User>();
        this._users_loaded = false;

        this._zones = new Array<Zone>();
        this._zones_loaded = false;

        this._profils = new Array<Profil>();
        this._profils_loaded = false;

        this._timelines = new Array<Timeline>();
        this._timelines_loaded = false;
    }

    /**
     * Return the SDI's description.
     */
    description() {
        return this._description;
    }

    /**
     * Return the SDI's allowedHost.
     */
    allowedHost() {
        return this._allowedHost;
    }

    /**
     * Return the Users
     */
    users() {
        if(! this._users_loaded) {
	        this._users_loaded = this.getAssociatedObjects(SDI, User, this._users);
        }
        return this._users;
    }

    /**
     * Return the zones
     */
    zones() {
        if(! this._zones_loaded) {
            this._zones_loaded = this.getAssociatedObjects(SDI, Zone, this._zones);
        }
        return this._zones;
    }

    /**
     * Return the SDI's profiles.
     */
    profils() {
        if(! this._profils_loaded) {
            this._profils_loaded = this.getAssociatedObjects(SDI, Profil, this._profils);
        }
        return this._profils;
    }

    /**
     * Return the SDI's timelines.
     */
    timelines() {
        if(! this._timelines_loaded) {
            this._timelines_loaded = this.getAssociatedObjects(SDI, Timeline, this._timelines);
        }
        return this._timelines;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

    /**
     * Create model in database.
     *
     * @method create
     * @return {boolean} Create status
     */
    create() : boolean {
        var data = {
	        "description": this.description(),
	        "allowedHost": this.allowedHost()
        };

        return this.createObject(SDI, data);
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {SDI} The model instance.
     */
    static read(id : number) : SDI {
        return this.readObject(SDI, id);
    }

	loadAssociations() {
		this.users();
		this.profils();
		this.zones();
		this.timelines();
	}

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
	    var data = {
		    "description": this.description(),
		    "allowedHost": this.allowedHost()
	    };

	    return this.updateObject(SDI, data);
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        return this.deleteObject(SDI);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<SDI>} The model instances.
     */
    static all() : Array<SDI> {
        return this.allObjects(SDI);
    }

	/**
	 * Return a SDI instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {SDI} The model instance.
	 */
	static parseJSON(jsonString : string) : SDI {
		return SDI.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a SDI instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {SDI} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : SDI {
		if(typeof(jsonObject.description) == "undefined" || typeof(jsonObject.allowedHost) == "undefined" || typeof(jsonObject.id) == "undefined") {
			return null;
		} else {
			return new SDI(jsonObject.description, jsonObject.allowedHost, jsonObject.id);
		}
	}

	associateUser(u : User) : boolean {
		return this.associateObject(SDI, User, u.getId());
	}

	/**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "SDIs";
    }


}