/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./User.ts" />
/// <reference path="./Zone.ts" />
/// <reference path="./Profil.ts" />
/// <reference path="./Timeline.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : SDI
 *
 * @class SDI
 * @extends ModelItf
 */
class SDI extends ModelItf {

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
     * @param {string} name - the SDI's name.
     * @param {string} description - The SDI's description.
     * @param {string} allowedHost - The SDI's allowedHost.
     * @param {number} id - The SDI's ID.
     */
    constructor(name : string, description : string = "", allowedHost : string = "*", id : number = null) {
        super(id);

        this.setName(name);
	    this.setDescription(description);
	    this.setAllowedHost(allowedHost);

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
	 * Set the SDI's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		if(!name) {
			throw new ModelException("A name is mandatory for a SDI.");
		}

		this._name = name;
	}

	/**
	 * Set the SDI's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string) {
		this._description = description;
	}

	/**
	 * Set the SDI's allowedHost.
	 *
	 * @method setAllowedHost
	 */
	setAllowedHost(allowedHost : string) {
		this._allowedHost = allowedHost;
	}

	/**
	 * Return the SDI's name.
     *
     * @method name
	 */
	name() {
		return this._name;
	}

    /**
     * Return the SDI's description.
     *
     * @method description
     */
    description() {
        return this._description;
    }

    /**
     * Return the SDI's allowedHost.
     *
     * @method allowedHost
     */
    allowedHost() {
        return this._allowedHost;
    }

    /**
     * Return the Users
     *
     * @method users
     */
    users() {
        if(! this._users_loaded) {
	        this.getAssociatedObjects(SDI, User, this._users);

	        this._users_loaded = true;
        }
        return this._users;
    }

    /**
     * Return the zones
     *
     * @method zones
     */
    zones() {
        if(! this._zones_loaded) {
            this.getAssociatedObjects(SDI, Zone, this._zones);

	        this._zones_loaded = true;
        }
        return this._zones;
    }

    /**
     * Return the SDI's profiles.
     *
     * @method profils
     */
    profils() {
        if(! this._profils_loaded) {
            this.getAssociatedObjects(SDI, Profil, this._profils);

	        this._profils_loaded = true;
        }
        return this._profils;
    }

    /**
     * Return the SDI's timelines.
     *
     * @method timelines
     */
    timelines() {
        if(! this._timelines_loaded) {
            this.getAssociatedObjects(SDI, Timeline, this._timelines);

	        this._timelines_loaded = true;
        }
        return this._timelines;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Load all the lazy loading properties of the object.
	 * Useful when you want to get a complete object.
     *
     * @method loadAssociations
	 */
	loadAssociations() {
		this.users();
		this.profils();
		this.zones();
		this.timelines();
	}

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._profils_loaded = false;
		this._timelines_loaded = false;
		this._users_loaded = false;
		this._zones_loaded = false;
	}

	/**
	 * Return a SDI instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"description": this.description(),
			"allowedHost": this.allowedHost()
		};
		return data;
	}

	/**
	 * Return a SDI instance as a JSON Object including associated object.
	 * However the method should not be recursive due to cycle in the model.
	 *
	 * @method toCompleteJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toCompleteJSONObject() : Object {
		this.loadAssociations();
		var data = this.toJSONObject();
		data["profils"] = this.serializeArray(this.profils());
		data["timelines"] = this.serializeArray(this.timelines());
		data["users"] = this.serializeArray(this.users());
		data["zones"] = this.serializeArray(this.zones());
		return data;
	}

	/**
	 * Add a new User to the SDI and associate it in the database.
	 * A User can only be added once.
	 *
     * @method addUser
	 * @param {User} u The User to add inside the SDI. It cannot be a null value.
	 * @returns {boolean} Returns true if the association is realized in database.
	 */
	addUser(u : User) : boolean {
		if (!u || !u.getId()) {
			throw new ModelException("The User must be an existing object to be associated.");
		}

		if (ModelItf.isObjectInsideArray(this.users(), u)) {
			throw new ModelException("You cannot add twice a User for a SDI.");
		}

		if (this.associateObject(SDI, User, u.getId())) {
			u.desynchronize();
			this.users().push(u);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Remove a User from the SDI: the association is removed both in the object and in database.
	 * The User can only be removed if it exists first in the list of associated Users, else an exception is thrown.
	 *
     * @method removeUser
	 * @param {User} u The User to remove from that SDI
	 * @returns {boolean} Returns true if the association is deleted in database.
	 */
	removeUser(u : User) : boolean {
		if (!u || !u.getId()) {
			throw new ModelException("The User must be an existing object to be associated.");
		}

		if (!ModelItf.isObjectInsideArray(this.users(), u)) {
			throw new ModelException("The User you try to remove has not been added to the current SDI");
		}

		if (this.deleteObjectAssociation(SDI, User, u.getId())) {
			u.desynchronize();
			return ModelItf.removeObjectFromArray(this.users(), u);
		} else {
			return false;
		}
	}

	/**
	 * Add a new Zone to the SDI and associate it in the database.
	 * A Zone can only be added once.
	 *
     * @method addZone
	 * @param {Zone} z The Zone to add inside the SDI. It cannot be a null value.
	 * @returns {boolean} Returns true if the association is realized in database.
	 */
	addZone(z : Zone) : boolean {
		if (!z || !z.getId()) {
			throw new ModelException("The Zone must be an existing object to be associated.");
		}

		if (ModelItf.isObjectInsideArray(this.zones(), z)) {
			throw new ModelException("You cannot add twice a Zone for a SDI.");
		}

		if (this.associateObject(SDI, Zone, z.getId())) {
			z.desynchronize();
			this.zones().push(z);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Remove a Zone from the SDI: the association is removed both in the object and in database.
	 * The Zone can only be removed if it exists first in the list of associated Zones, else an exception is thrown.
	 *
     * @method removeZone
	 * @param {Zone} z The Zone to remove from that SDI
	 * @returns {boolean} Returns true if the association is deleted in database.
	 */
	removeZone(z : Zone) : boolean {
		if (!z || !z.getId()) {
			throw new ModelException("The Zone must be an existing object to be associated.");
		}

		if (!ModelItf.isObjectInsideArray(this.zones(), z)) {
			throw new ModelException("The Zone you try to remove has not been added to the current SDI");
		}

		if (this.deleteObjectAssociation(SDI, Zone, z.getId())) {
			z.desynchronize();
			return ModelItf.removeObjectFromArray(this.zones(), z);
		} else {
			return false;
		}
	}

	/**
	 * Add a new Profil to the SDI and associate it in the database.
	 * A Profil can only be added once.
	 *
     * @method addProfil
	 * @param {Profil} p The Profil to add inside the SDI. It cannot be a null value.
	 * @returns {boolean} Returns true if the association is realized in database.
	 */
	addProfil(p : Profil) : boolean {
		if (!p || !p.getId()) {
			throw new ModelException("The Profil must be an existing object to be associated.");
		}

		if (ModelItf.isObjectInsideArray(this.profils(), p)) {
			throw new ModelException("You cannot add twice a Profil for a SDI.");
		}

		if (this.associateObject(SDI, Profil, p.getId())) {
			p.desynchronize();
			this.profils().push(p);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Remove a Profil from the SDI: the association is removed both in the object and in database.
	 * The Profil can only be removed if it exists first in the list of associated Profils, else an exception is thrown.
	 *
     * @method removeProfil
	 * @param {Profil} p The Profil to remove from that SDI
	 * @returns {boolean} Returns true if the association is deleted in database.
	 */
	removeProfil(p : Profil) : boolean {
		if (!p || !p.getId()) {
			throw new ModelException("The Profil must be an existing object to be associated.");
		}

		if (!ModelItf.isObjectInsideArray(this.profils(), p)) {
			throw new ModelException("The profil you try to remove is not linked with the SDI.");
		}

		if (this.deleteObjectAssociation(SDI, Profil, p.getId())) {
			p.desynchronize();
			return ModelItf.removeObjectFromArray(this.profils(), p);
		} else {
			return false;
		}
	}

	/**
	 * Add a new Timeline to the SDI and associate it in the database.
	 * A Timeline can only be added once.
	 *
     * @method addTimeline
	 * @param {Timeline} t The Timeline to add inside the SDI. It cannot be a null value.
	 * @returns {boolean} Returns true if the association is realized in database.
	 */
	addTimeline(t : Timeline) : boolean {
		if (!t || !t.getId()) {
			throw new ModelException("The Timeline must be an existing object to be associated.");
		}

		if (ModelItf.isObjectInsideArray(this.timelines(), t)) {
			throw new ModelException("You cannot add twice a Timeline for a SDI.");
		}

		if (this.associateObject(SDI, Timeline, t.getId())) {
			t.desynchronize();
			this.timelines().push(t);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Remove a Timeline from the SDI: the association is removed both in the object and in database.
	 * The Timeline can only be removed if it exists first in the list of associated Timelines, else an exception is thrown.
	 *
     * @method removeTimeline
	 * @param {Timeline} t The Timeline to remove from that SDI
	 * @returns {boolean} Returns true if the association is deleted in database.
	 */
	removeTimeline(t : Timeline) : boolean {
		if (!t || !t.getId()) {
			throw new ModelException("The Timeline must be an existing object to be associated.");
		}

		if (!ModelItf.isObjectInsideArray(this.timelines(), t)) {
			throw new ModelException("The Timeline you try to remove is not linked with the SDI.");
		}

		if (this.deleteObjectAssociation(SDI, Timeline, t.getId())) {
			t.desynchronize();
			return ModelItf.removeObjectFromArray(this.timelines(), t);
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
        return this.createObject(SDI, this.toJSONObject());
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

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
	    return this.updateObject(SDI, this.toJSONObject());
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
		if(!jsonObject.id) {
			throw new ModelException("A SDI object should have an ID.");
		}
		if(!jsonObject.name) {
			throw new ModelException("A SDI object should have a name.");
		}
		if(!jsonObject.description) {
			throw new ModelException("A SDI object should have a description.");
		}
		if(!jsonObject.allowedHost) {
			throw new ModelException("A SDI object should have an allowedHost.");
		}
		return new SDI(jsonObject.name, jsonObject.description, jsonObject.allowedHost, jsonObject.id);
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