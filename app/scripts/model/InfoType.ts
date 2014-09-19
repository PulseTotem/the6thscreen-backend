/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Source.ts" />
/// <reference path="./Renderer.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : InfoType
 *
 * @class InfoType
 * @extends ModelItf
 */
class InfoType extends ModelItf {

    /**
     * Name property.
     *
     * @property _name
     * @type string
     */
    private _name : string;

    /**
     * Sources property.
     *
     * @property _sources
     * @type Array<Source>
     */
    private _sources : Array<Source>;

    /**
     * Lazy loading for Sources property.
     *
     * @property _sources_loaded
     * @type boolean
     */
    private _sources_loaded : boolean;

    /**
     * Renderers property.
     *
     * @property _renderers
     * @type Array<Renderer>
     */
    private _renderers : Array<Renderer>;

    /**
     * Lazy loading for Renderers property.
     *
     * @property _renderers_loaded
     * @type boolean
     */
    private _renderers_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The InfoType's name.
     * @param {number} id - The InfoType's ID.
     */
    constructor(name : string, id : number = null) {
        super(id);

        if(this._name == null || this._name == "") {
            Logger.error("A InfoType needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;

        this._sources = new Array<Source>();
        this._sources_loaded = false;

        this._renderers = new Array<Renderer>();
        this._renderers_loaded = false;
    }

    /**
     * Return the InfoType's name.
     */
    name() {
        return this._name;
    }

    /**
     * Return the InfoType's sources.
     */
    sources() {
        if(! this._sources_loaded) {
            this._sources_loaded = this.getAssociatedObjects(InfoType, Source, this._sources);
        }
        return this._sources;
    }

    /**
     * Return the InfoType's renderers.
     */
    renderers() {
        if(! this._renderers_loaded) {
            this._renderers_loaded = this.getAssociatedObjects(InfoType, Renderer, this._renderers);
        }
        return this._renderers;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	loadAssociations() : void {
		this.renderers();
		this.sources();
	}

	toJSONObject() : Object {
		var data = {
			"name": this.name()
		};

		return data;
	}

	addSource(s : Source) : boolean {
		return this.associateObject(InfoType, Source, s.getId());
	}

	addRenderer(r : Renderer) : boolean {
		return this.associateObject(InfoType, Renderer, r.getId());
	}

    /**
     * Create model in database.
     *
     * @method create
     * @return {boolean} Create status
     */
    create() : boolean {
        return this.createObject(InfoType, this.toJSONObject())
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {InfoType} The model instance.
     */
    static read(id : number) : InfoType {
        return this.readObject(InfoType, id);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        return this.updateObject(InfoType, this.toJSONObject())
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        return this.deleteObject(InfoType);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<InfoType>} The model instances.
     */
    static all() : Array<InfoType> {
       return this.allObjects(InfoType);
    }

	/**
	 * Return an InfoType instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Call} The model instance.
	 */
	static parseJSON(jsonString : string) : InfoType {
		return InfoType.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return an InfoType instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Call} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : InfoType {
		if(typeof(jsonObject.name) == "undefined" || typeof(jsonObject.id) == "undefined") {
			return null;
		} else {
			return new InfoType(jsonObject.name, jsonObject.id);
		}
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "InfoTypes";
    }
}