/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./InfoType.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : Renderer
 *
 * @class Renderer
 * @extends ModelItf
 */
class Renderer extends ModelItf {

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
     * InfoType property.
     *
     * @property _info_type
     * @type InfoType
     */
    private _info_type : InfoType;

    /**
     * Lazy loading for InfoType property.
     *
     * @property _info_type_loaded
     * @type boolean
     */
    private _info_type_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Renderer's name.
     * @param {string} description - The Renderer's description.
     * @param {number} id - The Renderer's ID.
     */
    constructor(name : string, description : string, id : number = null) {
        super(id);

        if(this._name == null || this._name == "") {
            Logger.error("A Renderer needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;

        if(this._description == null || this._description == "") {
            Logger.error("A Renderer needs to have a description.");
            // TODO : Throw an Exception ?
        }

        this._description = description;

        this._info_type = null;
        this._info_type_loaded = false;
    }

    /**
     * Return the Renderer's name.
     */
    name() {
        return this._name;
    }

    /**
     * Return the Renderer's description.
     */
    description() {
        return this._description;
    }

    /**
     * Return the Renderer's infoType.
     */
    infoType() {
        if(! this._info_type_loaded) {
            this._info_type_loaded = this.getUniquelyAssociatedObject(Renderer, InfoType, this._info_type);
        }
        return this._info_type;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	loadAssociations() : void {
		this.infoType();
	}

	toJSONObject() : Object {
		var data = {
			"name" : this.name(),
			"description": this.description()
		};

		return data;
	}

	setInfoType(i : InfoType) : boolean {
		return this.associateObject(Renderer, InfoType, i.getId());
	}

    /**
     * Create model in database.
     *
     * @method create
     * @return {boolean} Create status
     */
    create() : boolean {
        return this.createObject(Renderer, this.toJSONObject())
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {Renderer} The model instance.
     */
    static read(id : number) : Renderer {
        return this.readObject(Renderer, id);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        return this.updateObject(Renderer, this.toJSONObject());
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        return this.deleteObject(Renderer);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<Renderer>} The model instances.
     */
    static all() : Array<Renderer> {
        return this.allObjects(Renderer);
    }

	/**
	 * Return a Renderer instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Renderer} The model instance.
	 */
	static parseJSON(jsonString : string) : Renderer {
		return Renderer.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a Renderer instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Renderer} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : Renderer {
		if(typeof(jsonObject.name) == "undefined" || typeof(jsonObject.description) == "undefined" || typeof(jsonObject.id) == "undefined") {
			return null;
		} else {
			return new Renderer(jsonObject.name, jsonObject.description, jsonObject.id);
		}
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Renderers";
    }
}