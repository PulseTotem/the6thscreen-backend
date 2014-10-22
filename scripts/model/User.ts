/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Role.ts" />
/// <reference path="./SDI.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

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

        this.setUsername(username);

        this._roles = new Array<Role>();
        this._roles_loaded = false;

        this._sdis = new Array<SDI>();
        this._sdis_loaded = false;
    }

	/**
	 * Set the User's username.
	 *
	 * @method setUsername
	 */
	setUsername(username : string) {
		if(!username) {
			throw new ModelException("The username is mandatory for a User.");
		}

		this._username = username;
	}

    /**
     * Return the User's username.
     *
     * @method username
     */
    username() {
        return this._username;
    }

    /**
     * Return the User's roles.
     *
     * @method roles
     */
    roles() {
        if(! this._roles_loaded) {
            this.getAssociatedObjects(User, Role, this._roles);

	        this._roles_loaded = true;
        }
        return this._roles;
    }

    /**
     * Return the SDIs owned by the User.
     *
     * @method sdis
     */
    sdis() {
        if(! this._sdis_loaded) {
            this.getAssociatedObjects(User, SDI, this._sdis);

	        this._sdis_loaded = true;
        }
        return this._sdis;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Load all the lazy loading properties of the object.
	 * Useful when you want to get a complete object.
     *
     * @method loadAssociations
	 */
	loadAssociations() : void {
		this.roles();
		this.sdis();
	}

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._roles_loaded = false;
		this._sdis_loaded = false;
	}

	/**
	 * Return a User instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"username": this.username()
		};
		return data;
	}

	/**
	 * Return a User instance as a JSON Object including associated object.
	 * However the method should not be recursive due to cycle in the model.
	 *
	 * @method toCompleteJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toCompleteJSONObject() : Object {
		this.loadAssociations();
		var data = this.toJSONObject();
		data["roles"] = this.serializeArray(this.roles());
		data["sdis"] = this.serializeArray(this.sdis());
		return data;
	}

	/**
	 * Add a new SDI to the User and associate it in the database.
	 * A SDI can only be added once.
	 *
     * @method addSDI
	 * @param {SDI} s The SDI to link with the User. It cannot be a null value.
	 * @returns {boolean} Returns true if the association is realized in database.
	 */
	addSDI(s : SDI) : boolean {
		if (!s || !s.getId()) {
			throw new ModelException("The SDI must be an existing object to be associated.");
		}

		if (ModelItf.isObjectInsideArray(this.sdis(),s)) {
			throw new ModelException("You cannot add twice a SDI for a User.");
		}

		if (this.associateObject(User, SDI, s.getId())) {
			s.desynchronize();
			this.sdis().push(s);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Remove a SDI from the User: the association is removed both in the object and in database.
	 * The SDI can only be removed if it exists first in the list of associated SDIs, else an exception is thrown.
	 *
     * @method removeSDI
	 * @param {SDI} s The SDI to remove from that User
	 * @returns {boolean} Returns true if the association is deleted in database.
	 */
	removeSDI(s : SDI) : boolean {
		if (!s || !s.getId()) {
			throw new ModelException("The SDI must be an existing object to be removed.");
		}

		if (!ModelItf.isObjectInsideArray(this.sdis(),s)) {
			throw new ModelException("The SDI you try to remove is not yet associated.");
		}

		if (this.deleteObjectAssociation(User, SDI, s.getId())) {
			s.desynchronize();
			return ModelItf.removeObjectFromArray(this.sdis(), s);
		} else {
			return false;
		}
	}

	/**
	 * Add a new Role to the User and associate it in the database.
	 * A Role can only be added once.
	 *
     * @method addRole
	 * @param {Role} r The Role to link with the User. It cannot be a null value.
	 * @returns {boolean} Returns true if the association is realized in database.
	 */
	addRole(r : Role) : boolean {
		if (!r || !r.getId()) {
			throw new ModelException("The Role must be an existing object to be associated.");
		}

		if (ModelItf.isObjectInsideArray(this.roles(),r)) {
			throw new ModelException("You cannot add twice a Role for a User.");
		}

		if (this.associateObject(User, Role, r.getId())) {
			r.desynchronize();
			this.roles().push(r);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Remove a Role from the User: the association is removed both in the object and in database.
	 * The Role can only be removed if it exists first in the list of associated Roles, else an exception is thrown.
	 *
     * @method removeRole
	 * @param {Role} r The Role to remove from that User
	 * @returns {boolean} Returns true if the association is deleted in database.
	 */
	removeRole(r : Role) : boolean {
		if (!r || !r.getId()) {
			throw new ModelException("The Role must be an existing object to be removed.");
		}

		if (!ModelItf.isObjectInsideArray(this.roles(),r)) {
			throw new ModelException("The Role you try to remove is not yet associated.");
		}

		if (this.deleteObjectAssociation(User, Role, r.getId())) {
			r.desynchronize();
			return ModelItf.removeObjectFromArray(this.roles(),r);
		} else {
			return false;
		}
	}

	/**
     * Create model in database.
     *
     * @method create
     * @return {boolean} Create status
     */
    create() : boolean {
        return this.createObject(User, this.toJSONObject());
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
       return this.updateObject(User, this.toJSONObject());
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        return this.deleteObject(User);
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
		if (!jsonObject.id) {
			throw new ModelException("A User object should have an ID.");
		}
		if(!jsonObject.username) {
			throw new ModelException("A User object should have a name.");
		}
		return new User(jsonObject.username, jsonObject.id);
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