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
     *
     * @method name
     */
    name() {
        return this._name;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Return a Role instance as a JSON Object
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
		if (!jsonObject.id) {
			throw new ModelException("A Role object should have an ID.");
		}
		if(!jsonObject.name) {
			throw new ModelException("A Role object should have a name.");
		}
		return new Role(jsonObject.name, jsonObject.id);
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