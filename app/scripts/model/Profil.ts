/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Call.ts" />
/// <reference path="./Timeline.ts" />

/// <reference path="../core/Logger.ts" />

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
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Profil's name.
     * @param {string} description - The Profil's description.
     * @param {number} id - The Profil's ID.
     */
    constructor(name : string, description : string = "", id : number = null) {
        super(id);

        this.setName(name);
        this.setDescription(description);

        this._calls = new Array<Call>();
        this._calls_loaded = false;
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
        if(!name) {
            throw new ModelException("A profil needs a name.")
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
            this.getAssociatedObjects(Profil, Call, this._calls);
	        this._calls_loaded = true;
        }
        return this._calls;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Load all the lazy loading properties of the object.
	 * Useful when you want to get a complete object.
     *
     * @method loadAssociations
	 */
	loadAssociations() : void {
		this.calls();
	}

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._calls_loaded = false;
	}

	/**
	 * Return a Profil instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"description": this.description()
		};
		return data;
	}

	/**
	 * Return a Profil instance as a JSON Object including associated object.
	 * However the method should not be recursive due to cycle in the model.
	 *
	 * @method toCompleteJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toCompleteJSONObject() : Object {
		var data = this.toJSONObject();
		data["calls"] = this.serializeArray(this.calls());
		return data;
	}

	/**
	 * Add a new Call to the Profil and associate it in the database.
	 * A Call can only be added once.
	 *
     * @method addCall
	 * @param {Call} c The Call to add inside the Profil. It cannot be a null value.
	 * @returns {boolean} Returns true if the association is realized in database.
	 */
	addCall(c : Call) : boolean {
		if (!c || !c.getId()) {
			throw new ModelException("The Call must be an existing object to be associated.");
		}

		if (ModelItf.isObjectInsideArray(this.calls(), c)) {
			throw new ModelException("You cannot add twice a Call in a Profil.");
		}

		if (this.associateObject(Profil, Call, c.getId())) {
			c.desynchronize();
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
     * @method removeCall
     * @param {Call} c The Call to remove from that Profil
	 * @returns {boolean} Returns true if the association is deleted in database.
	 */
	removeCall(c : Call) : boolean {
		if (!c || !c.getId()) {
			throw new ModelException("The Call must be an existing object to be removed.");
		}

		if (!ModelItf.isObjectInsideArray(this.calls(), c)) {
			throw new ModelException("The Call you try to remove has not been added to the current Profil");
		}

		if (this.deleteObjectAssociation(Profil, Call, c.getId())) {
			c.desynchronize();
			return ModelItf.removeObjectFromArray(this.calls(), c);
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
	    if(!jsonObject.id) {
		    throw new ModelException("A Profil object should have an ID.");
	    }
	    if(!jsonObject.name) {
		    throw new ModelException("A Profil object should have a name.");
	    }
	    if(!jsonObject.description) {
		    throw new ModelException("A Profil object should have a description.");
	    }
	    return new Profil(jsonObject.name, jsonObject.description, jsonObject.id);
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