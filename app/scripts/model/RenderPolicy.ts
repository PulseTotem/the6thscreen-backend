/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : RenderPolicy
 *
 * @class RenderPolicy
 * @extends ModelItf
 */
class RenderPolicy extends ModelItf {

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
     * Constructor.
     *
     * @constructor
     * @param {string} name - The RenderPolicy's name.
     * @param {string} description - The RenderPolicy's description.
     * @param {number} id - The RenderPolicy's ID.
     */
    constructor(name : string, description : string, id : number = null) {
        super(id);

        this.setName(name);
	    this.setDescription(description);
    }

	/**
	 * Set the RenderPolicy's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		if(name == null || name == "") {
			Logger.error("A RenderPolicy needs to have a name.");
			// TODO : Throw an Exception ?
		}

		this._name = name;
	}

	/**
	 * Set the RenderPolicy's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string) {
		if(description == null || description == "") {
			Logger.error("A RenderPolicy needs to have a description.");
			// TODO : Throw an Exception ?
		}

		this._description = description;
	}

    /**
     * Return the RenderPolicy's name.
     */
    name() {
        return this._name;
    }

    /**
     * Return the RenderPolicy's description.
     */
    description() {
        return this._description;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

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
     * Create model in database.
     *
     * @method create
     * @return {boolean} Create status
     */
    create() : boolean {
        return this.createObject(RenderPolicy, this.toJSONObject());
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {RenderPolicy} The model instance.
     */
    static read(id : number) : RenderPolicy {
        return this.readObject(RenderPolicy, id);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        return this.updateObject(RenderPolicy, this.toJSONObject());
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        return this.deleteObject(RenderPolicy);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<RenderPolicy>} The model instances.
     */
    static all() : Array<RenderPolicy> {
        return this.allObjects(RenderPolicy);
    }

	/**
	 * Return a RenderPolicy instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {RenderPolicy} The model instance.
	 */
	static parseJSON(jsonString : string) : RenderPolicy {
		return RenderPolicy.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a RenderPolicy instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {RenderPolicy} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : RenderPolicy {
		if(typeof(jsonObject.name) == "undefined" || typeof(jsonObject.description) == "undefined" || typeof(jsonObject.id) == "undefined") {
			return null;
		} else {
			return new RenderPolicy(jsonObject.name, jsonObject.description, jsonObject.id);
		}
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "RenderPolicys";
    }
}