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
    constructor(name : string, description : string, id : number = null) {
        super(id);

        if(this._name == null || this._name == "") {
            Logger.error("A Timeline needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;

        if(this._description == null || this._description == "") {
            Logger.error("A Timeline needs to have a description.");
            // TODO : Throw an Exception ?
        }

        this._description = description;

        this._profils = new Array<Profil>();
        this._profils_loaded = false;
    }

    /**
     * Return the Timeline's name.
     */
    name() {
        return this._name;
    }

    /**
     * Return the Timeline's description.
     */
    description() {
        return this._description;
    }

    /**
     * Return the Timeline's profils.
     */
    profils() {
        if(! this._profils_loaded) {
            this._profils_loaded = this.getAssociatedObjects(Timeline, Profil, this._profils);
        }
        return this._profils;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	loadAssociations() : void {
		this.profils();
	}

	toJSONObject() : Object {
		var data = {
			"name": this.name(),
			"description": this.description()
		};
		return data;
	}

	addProfil(p : Profil) : boolean {
		return this.associateObject(Timeline, Profil, p.getId());
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
		if(typeof(jsonObject.name) == "undefined" || typeof(jsonObject.description) == "undefined" || typeof(jsonObject.id) == "undefined") {
			return null;
		} else {
			return new Timeline(jsonObject.name, jsonObject.description, jsonObject.id);
		}
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