/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Call.ts" />
/// <reference path="./Timeline.ts" />

/// <reference path="../core/Logger.ts" />
/// <reference path="../core/RestClient.ts" />
/// <reference path="../core/DatabaseConnection.ts" />

/**
 * Model : Profil
 *
 * @class Profil
 * @extends ModelItf
 */
class Profil extends ModelItf {

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
     * @param {string} name - The Profil's name.
     * @param {string} description - The Profil's description.
     * @param {number} id - The Profil's ID.
     */
    constructor(name : string, description : string, id : number = null) {
        super(id);

        this.setName(name);
        this.setDescription(description);

        this._calls = new Array<Call>();
        this._calls_loaded = false;

        this._timelines = new Array<Timeline>();
        this._timelines_loaded = false;
    }

    /**
     * Return the Profil's name.
     *
     * @method name
     * @return {string} The Profil's name.
     */
    name() {
        return this._name;
    }

    /**
     * Set the Profil's name.
     *
     * @method setName
     */
    setName(name : string) {
        if(name == null || name == "") {
            Logger.error("A Profil needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;
    }

    /**
     * Return the Profil's description.
     *
     * @method description
     * @return {string} The Profil's description.
     */
    description() : string {
        return this._description;
    }

    /**
     * Set the Profil's description.
     *
     * @method setDescription
     */
    setDescription(description : string) {
        if(description == null || description == "") {
            Logger.error("A Profil needs to have a description.");
            // TODO : Throw an Exception ?
        }

        this._description = description;
    }

    /**
     * Return the Profil's calls.
     *
     * @method calls
     * @return {Array<Call>} The Profil's calls.
     */
    calls() : Array<Call> {
        if(! this._calls_loaded) {
            this._calls_loaded = this.getAssociatedObjects(Profil, Call, this._calls);
        }
        return this._calls;
    }

    /**
     * Return the Profil's timelines.
     *
     * @method timelines
     * @return {Array<Timeline>} The Profil's timelines.
     */
    timelines() : Array<Timeline> {
        if(! this._timelines_loaded) {
            this._timelines_loaded = this.getAssociatedObjects(Profil, Timeline, this._timelines);
        }
        return this._timelines;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Load all the lazy loading properties of the object.
	 * Useful when you want to get a complete object.
	 */
	loadAssociations() : void {
		this.calls();
		this.timelines();
	}

	/**
	 * Private method to transform the object in JSON.
	 * It is used to create or update the object in database.
	 *
	 * @returns {{name: string, description: string}}
	 */
	toJSONObject() : Object {
		var data = {
			"name": this.name(),
			"description": this.description()
		};
		return data;
	}

	/**
	 * Add a new Call to the Profil and associate it in the database.
	 * A Call can only be added once.
	 *
	 * @param {Call} c The Call to add inside the Profil. It cannot be a null value.
	 * @returns {boolean} Returns true if the association is realized in database.
	 */
	addCall(c : Call) : boolean {
		if (this.calls().indexOf(c) !== -1) {
			throw new Error("You cannot add twice a Call in a Profil.");  // TODO: cannot it be useful sometimes?
		}
		if (c === null || c.getId() === undefined || c.getId() === null) {
			throw new Error("The Call must be an existing object to be associated.");
		}

		if (this.associateObject(Profil, Call, c.getId())) {
			this.calls().push(c);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Remove a Call from the Profil: the association is removed both in the object and in database.
	 * The Call can only be removed if it exists first in the list of associated Calls, else an exception is thrown.
	 *
	 * @param {Call} c The Call to remove from that Profil
	 * @returns {boolean} Returns true if the association is deleted in database.
	 */
	removeCall(c : Call) : boolean {
		var indexValue = this.calls().indexOf(c);
		if (indexValue === -1) {
			throw new Error("The Call you try to remove has not been added to the current Profil");
		}

		if (this.deleteObjectAssociation(Profil, Call, c.getId())) {
			this.calls().splice(indexValue, 1);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Add a new Timeline to the Profil and associate it in the database.
	 * A Timeline can only be added once.
	 *
	 * @param {Timeline} t The Timeline to add inside the Profil. It cannot be a null value.
	 * @returns {boolean} Returns true if the association is realized in database.
	 */
	addTimeline(t : Timeline) : boolean {
		if (this.timelines().indexOf(t) !== -1) {
			throw new Error("You cannot add twice a Timeline in a Profil.");  // TODO: cannot it be useful sometimes?
		}
		if (t === null || t.getId() === undefined || t.getId() === null) {
			throw new Error("The Timeline must be an existing object to be associated.");
		}

		if (this.associateObject(Profil, Timeline, t.getId())) {
			this.timelines().push(t);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Remove a Timeline from the Profil: the association is removed both in the object and in database.
	 * The Timeline can only be removed if it exists first in the list of associated Timelines, else an exception is thrown.
	 *
	 * @param {Timeline} t The Timeline to remove from that Profil
	 * @returns {boolean} Returns true if the association is deleted in database.
	 */
	removeTimeline(t : Timeline) : boolean {
		var indexValue = this.timelines().indexOf(t);
		if (indexValue === -1) {
			throw new Error("The Timeline you try to remove has not been added to the current Profil");
		}

		if (this.deleteObjectAssociation(Profil, Timeline, t.getId())) {
			this.timelines().splice(indexValue, 1);
			return true;
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
        return this.createObject(Profil, this.toJSONObject());
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {Profil} The model instance.
     */
    static read(id : number) : Profil {
        return ModelItf.readObject(Profil, id);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        return this.updateObject(Profil, this.toJSONObject());
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        return this.deleteObject(Profil);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @static
     * @return {Array<Profil>} The model instances.
     */
    static all() : Array<Profil> {
        return ModelItf.allObjects(Profil);
    }

    /**
     * Return a Profil instance from a JSON string.
     *
     * @method parseJSON
     * @static
     * @param {string} json - The JSON string
     * @return {Profil} The model instance.
     */
    static parseJSON(jsonString : string) : Profil {
        return Profil.fromJSONObject(JSON.parse(jsonString));
    }

    /**
     * Return a Profil instance from a JSON Object.
     *
     * @method fromJSONObject
     * @static
     * @param {JSONObject} json - The JSON Object
     * @return {Profil} The model instance.
     */
    static fromJSONObject(jsonObject : any) : Profil {
        if(typeof(jsonObject.name) == "undefined" || typeof(jsonObject.description) == "undefined" || typeof(jsonObject.id) == "undefined") {
            return null;
        } else {
            return new Profil(jsonObject.name, jsonObject.description, jsonObject.id);
        }
    }

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Profils";
    }
}