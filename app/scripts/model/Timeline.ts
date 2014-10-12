/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Profil.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : Timeline
 *
 * @class Timeline
 * @extends ModelItf
 */
class Timeline extends ModelItf {

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
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Timeline's name.
     * @param {string} description - The Timeline's description.
     * @param {number} id - The Timeline's ID.
     */
    constructor(name : string, description : string = "", id : number = null) {
        super(id);

        this.setName(name);
	    this.setDescription(description);

        this._profils = new Array<Profil>();
        this._profils_loaded = false;
    }

	/**
	 * Set the Timeline's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		if(!name) {
			throw new ModelException("The name is mandatory for a Timeline");
		}

		this._name = name;
	}

	/**
	 * Set the Timeline's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string) {
		this._description = description;
	}

    /**
     * Return the Timeline's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Return the Timeline's description.
     *
     * @method description
     */
    description() {
        return this._description;
    }

    /**
     * Return the Timeline's profils.
     *
     * @method profils
     */
    profils() {
        if(! this._profils_loaded) {
            this.getAssociatedObjects(Timeline, Profil, this._profils);

	        this._profils_loaded = true;
        }
        return this._profils;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Load all the lazy loading properties of the object.
	 * Useful when you want to get a complete object.
     *
     * @method loadAssociations
	 */
	loadAssociations() : void {
		this.profils();
	}

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._profils_loaded = false;
	}

	/**
	 * Return a Timeline instance as a JSON Object
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
	 * Return a Timeline instance as a JSON Object including associated object.
	 * However the method should not be recursive due to cycle in the model.
	 *
	 * @method toCompleteJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toCompleteJSONObject() : Object {
		this.loadAssociations();
		var data = this.toJSONObject();
		data["profils"] = this.serializeArray(this.profils());
		return data;
	}
	/**
	 * Add a new Profil to the Timeline and associate it in the database.
	 * A Profil can only be added once.
	 *
     * @method addProfil
	 * @param {Profil} p The Profil to add inside the Timeline. It cannot be a null value.
	 * @returns {boolean} Returns true if the association is realized in database.
	 */
	addProfil(p : Profil) : boolean {
		if (!p || !p.getId()) {
			throw new ModelException("The Profil must be an existing object to be associated.");
		}

		if (ModelItf.isObjectInsideArray(this.profils(), p)) {
			throw new ModelException("You cannot add twice a Profil for a Timeline.");
		}

		if (this.associateObject(Timeline, Profil, p.getId())) {
			p.desynchronize();
			this.profils().push(p);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Remove a Profil from the Timeline: the association is removed both in the object and in database.
	 * The Profil can only be removed if it exists first in the list of associated Profils, else an exception is thrown.
	 *
     * @method removeProfil
	 * @param {Profil} p The Profil to remove from that Timeline
	 * @returns {boolean} Returns true if the association is deleted in database.
	 */
	removeProfil(p : Profil) : boolean {
		if (!p || !p.getId()) {
			throw new ModelException("The Profil must be an existing object to be removed.");
		}

		if (!ModelItf.isObjectInsideArray(this.profils(), p)) {
			throw new ModelException("The Profil you try to remove is not yet associated.");
		}

		if (this.deleteObjectAssociation(Timeline, Profil, p.getId())) {
			p.desynchronize();
			return ModelItf.removeObjectFromArray(this.profils(), p);
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
        return this.createObject(Timeline, this.toJSONObject());
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {Timeline} The model instance.
     */
    static read(id : number) : Timeline {
        return this.readObject(Timeline, id);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        return this.updateObject(Timeline, this.toJSONObject());
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        return this.deleteObject(Timeline);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<Timeline>} The model instances.
     */
    static all() : Array<Timeline> {
        return this.allObjects(Timeline);
    }

	/**
	 * Return a Timeline instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Timeline} The model instance.
	 */
	static parseJSON(jsonString : string) : Timeline {
		return Timeline.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a Timeline instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Timeline} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : Timeline {
		if(!jsonObject.id) {
			throw new ModelException("A Timeline object should have an ID.");
		}
		if(!jsonObject.name) {
			throw new ModelException("A Timeline object should have a name.");
		}
		if(!jsonObject.description) {
			throw new ModelException("A Timeline object should have a description.");
		}
		return new Timeline(jsonObject.name, jsonObject.description, jsonObject.id);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Timelines";
    }
}