/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Role.ts" />
/// <reference path="./SDI.ts" />

/// <reference path="../core/Logger.ts" />

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
     * Roles property.
     *
     * @property _roles
     * @type Array<Role>
     */
    private _roles : Array<Role>;

    /**
     * Lazy loading for Roles property.
     *
     * @property _roles_loaded
     * @type boolean
     */
    private _roles_loaded : boolean;

    /**
     * SDIs property.
     *
     * @property _sdis
     * @type Array<SDI>
     */
    private _sdis : Array<SDI>;

    /**
     * Lazy loading for SDIs property.
     *
     * @property _sdis_loaded
     * @type boolean
     */
    private _sdis_loaded : boolean;


    /**
     * Constructor.
     *
     * @constructor
     * @param {string} username - The User's username.
     * @param {number} id - The User's ID.
     */
    constructor(username : string, id : number = null) {
        super(id);

        if(this._username == null || this._username == "") {
            Logger.error("A User needs to have a username.");
            // TODO : Throw an Exception ?
        }

        this._username = username;
        this._roles = new Array<Role>();
        this._roles_loaded = false;
        this._sdis = new Array<SDI>();
        this._sdis_loaded = false;
    }

    /**
     * Return the User's username.
     */
    username() {
        return this._username;
    }

    /**
     * Return the User's roles.
     */
    roles() {
        if(! this._roles_loaded) {
            // TODO : Retrieve from database.
            this._roles_loaded = true;
        }
        return this._roles;
    }

    /**
     * Return the SDIs owned by the User.
     */
    sdis() {
        if(! this._sdis_loaded) {
            // TODO : Retrieve from database.
            this._sdis_loaded  =true;
        }
        return this._sdis;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

    /**
     * Create model in database.
     *
     * @method create
     * @return {boolean} Create status
     */
    create() : boolean {
        var data = { "username": this.username() };
        return this.createObject(User, data);
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {User} The model instance.
     */
    static read(id : number) : User {
        return this.readObject(User, id);
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
     * @return {Array<User>} The model instances.
     */
    static all() : Array<User> {
        return this.allObjects(User);
    }

	/**
	 * Associate a SDI to the user
	 * @param s
	 * @returns {boolean}
	 */
	associateSDI(s : SDI) : boolean {
		return this.associateObject(User, SDI, s.getId());
	}

	/**
	 * Return a User instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {SDI} The model instance.
	 */
	static parseJSON(jsonString : string) : User {
		return User.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a User instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {SDI} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : User {
		if(typeof(jsonObject.username) == "undefined" || typeof(jsonObject.id) == "undefined") {
			return null;
		} else {
			return new User(jsonObject.username, jsonObject.id);
		}
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Users";
    }
}