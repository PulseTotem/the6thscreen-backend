/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : Role
 *
 * @class Role
 * @extends ModelItf
 */
class Role extends ModelItf {

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
     * @param {string} name - The Role's name.
     * @param {number} id - The Role's ID.
     */
    constructor(name : string, id : number = null) {
        super(id);

        this.setName(name);
    }

	/**
	 * Set the Role's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		if(name == null || name == "") {
			Logger.error("A Role needs to have a name.");
			// TODO : Throw an Exception ?
		}

		this._name = name;
	}

    /**
     * Return the Role's name.
     */
    name() {
        return this._name;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Private method to transform the object in JSON.
	 * It is used to create or update the object in database.
	 *
	 * @returns {{name: string}}
	 */
	toJSONObject() : Object {
		var data = {
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
        return this.createObject(Role, this.toJSONObject());
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {Role} The model instance.
     */
    static read(id : number) : Role {
        return this.readObject(Role, id);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        return this.updateObject(Role, this.toJSONObject());
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        return this.deleteObject(Role);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<Role>} The model instances.
     */
    static all() : Array<Role> {
        return this.allObjects(Role);
    }

	/**
	 * Return a Role instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Role} The model instance.
	 */
	static parseJSON(jsonString : string) : Role {
		return Role.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a Role instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Role} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : Role {
		if(typeof(jsonObject.name) == "undefined" || typeof(jsonObject.id) == "undefined") {
			return null;
		} else {
			return new Role(jsonObject.name, jsonObject.id);
		}
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Roles";
    }
}