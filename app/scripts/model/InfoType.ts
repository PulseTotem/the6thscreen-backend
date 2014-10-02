/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

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
     * Constructor.
     *
     * @constructor
     * @param {string} name - The InfoType's name.
     * @param {number} id - The InfoType's ID.
     */
    constructor(name : string, id : number = null) {
        super(id);

        this.setName(name);
    }

	/**
	 * Set the InfoType's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		if(name == null || name == "") {
			Logger.error("An InfoType needs to have a name.");
			// TODO : Throw an Exception ?
		}

		this._name = name;
	}

    /**
     * Return the InfoType's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Return a InfoType instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name()
		};
		return data;
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