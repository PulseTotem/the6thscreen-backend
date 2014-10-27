/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Behaviour.ts" />

/// <reference path="../customizedTypes/Percentage.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : Zone
 *
 * @class Zone
 * @extends ModelItf
 */
class Zone extends ModelItf {

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
     * Width property.
     *
     * @property _width
     * @type Percentage
     */
    private _width : Percentage;

	/**
	 * Height property.
	 *
	 * @property _height
	 * @type Percentage
	 */
	private _height : Percentage;

	/**
	 * PositionFromTop property.
	 *
	 * @property _position_from_top
	 * @type Percentage
	 */
	private _position_from_top : Percentage;

	/**
	 * PositionFromLeft property.
	 *
	 * @property _position_from_left
	 * @type Percentage
	 */
	private _position_from_left : Percentage;

	/**
	 * Behaviour property.
	 *
	 * @property _behaviour
	 * @type Behaviour
	 */
	private _behaviour : Behaviour;

	/**
	 * Lazy loading for behaviour.
	 *
	 * @property _behaviour_loaded
	 * @type boolean
	 */
	private _behaviour_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Zone's name.
     * @param {string} description - The Zone's description.
     * @param {string} position - The Zone's position.
     * @param {number} id - The Zone's ID.
     */
    constructor(name : string, description : string, width : number, height : number, positionFromTop : number, positionFromLeft : number, id : number = null) {
        super(id);

        this.setName(name);
	    this.setDescription(description);
	    this.setWidth(width);
	    this.setHeight(height);
	    this.setPositionFromTop(positionFromTop);
	    this.setPositionFromLeft(positionFromLeft);

	    this._behaviour = null;
	    this._behaviour_loaded = false;
    }

	/**
	 * Set the Zone's name
     *
     * @method setName
	 * @param name A new name
	 */
	setName(name : string) : void {
		if(!name) {
			throw new ModelException("A name is mandatory for a Zone.");
		}

		this._name = name;
	}

	/**
	 * Set the Zone's description
     *
     * @method setDescription
	 * @param description a new description
	 */
	setDescription(description : string) : void {
		this._description = description;
	}

	/**
	 * Set the Zone's width
     *
     * @method setWidth
	 * @param width a new width
	 */
	setWidth(width : number) : void {
		if(!width) {
			throw new ModelException("A width is mandatory for a Zone.");
		}

		this._width = new Percentage(width);
	}

	/**
	 * Set the Zone's height
     *
     * @method setHeight
	 * @param height a new height
	 */
	setHeight(height : number) : void {
		if(!height) {
			throw new ModelException("A height is mandatory for a Zone.");
		}

		this._height = new Percentage(height);
	}

	/**
	 * Set the Zone's positionFromTop
     *
     * @method setPositionFromTop
	 * @param positionFromTop a new positionFromTop
	 */
	setPositionFromTop(positionFromTop : number) : void {
		if(!positionFromTop && positionFromTop != 0) {
			throw new ModelException("The positionFromTop attribute is mandatory for a Zone.");
		}

		this._position_from_top = new Percentage(positionFromTop);
	}

	/**
	 * Set the Zone's positionFromLeft
     *
     * @method setPositionFromLeft
	 * @param positionFromTop a new positionFromTop
	 */
	setPositionFromLeft(positionFromLeft : number) : void {
		if(!positionFromLeft && positionFromLeft != 0) {
			throw new ModelException("The positionFromTop attribute is mandatory for a Zone.");
		}

		this._position_from_left = new Percentage(positionFromLeft);
	}

    /**
     * Return the Zone's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Return the Zone's description.
     *
     * @method description
     */
    description() {
        return this._description;
    }

	/**
	 * Return the Zone's width
     *
     * @method width
	 */
    width() {
		return this._width.value();
    }

	/**
	 * Return the Zone's height
     *
     * @method height
	 */
	height() {
		return this._height.value();
	}

	/**
	 * Return the Zone's positionFromTop
     *
     * @method positionFromTop
	 */
	positionFromTop() {
		return this._position_from_top.value();
	}

	/**
	 * Return the Zone's positionFromLeft
     *
     * @method positionFromLeft
	 */
	positionFromLeft() {
		return this._position_from_left.value();
	}

	/**
	 * Return the Zone's behaviour.
	 *
	 * @method behaviour
	 */
	behaviour() {
		if(! this._behaviour_loaded) {
			var value = this.getUniquelyAssociatedObject(Zone, Behaviour);
			if (!!value) {
				this._behaviour = value;
			}
			this._behaviour_loaded = true;
		}
		return this._behaviour;
	}

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Load all the lazy loading properties of the object.
	 * Useful when you want to get a complete object.
	 *
	 * @method loadAssociations
	 */
	loadAssociations() : void {
		this.behaviour();
	}

	/**
	 * Set the object as desynchronized given the different lazy properties.
	 *
	 * @method desynchronize
	 */
	desynchronize() : void {
		this._behaviour_loaded = false;
	}


	/**
	 * Return a Renderer instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"description": this.description(),
			"width": this.width(),
			"height": this.height(),
			"positionFromTop": this.positionFromTop(),
			"positionFromLeft": this.positionFromLeft()
		};
		return data;
	}

    /**
     * To transform Zone to JSON object containing
     * description of associations.
     *
     * @method toJSONObjectWithAssociations
     */
    toJSONObjectWithAssociations() : Object {
	    this.loadAssociations();
        var data = this.toJSONObject();
	    data["behaviour"] = (this.behaviour() !== null) ? this.behaviour().toJSONObject() : null;
        return data;
    }

	/**
	 * Set the Behaviour of the Zone.
	 * As a Zone can only have one Behaviour, if the value is already set, this method throws an exception: you need first to unset the Behaviour.
	 * Moreover the given type must be created in database.
	 *
	 * @method setBehaviour
	 * @param {Behaviour} beha The Behaviour to associate with the Zone.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setBehaviour(beha : Behaviour) : boolean {
		if (!beha || !beha.getId()) {
			throw new ModelException("The Behaviour must be an existing object to be associated.");
		}

		if (this.behaviour() !== null) {
			throw new ModelException("The Behaviour is already set for this Zone.");
		}

		if (this.associateObject(Zone, Behaviour, beha.getId())) {
			beha.desynchronize();
			this._behaviour = beha;
			this._behaviour_loaded = true;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Unset the current Behaviour from the Zone.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Behaviour must have been set before using it, else an exception is thrown.
	 *
	 * @method unsetBehaviour
	 * @returns {boolean} Returns true if the Behaviour is well unset and the association removed in database.
	 */
	unsetBehaviour() : boolean {
		if (this.behaviour() === null) {
			throw new ModelException("No Behaviour has been set for this Source.");
		}

		if (this.deleteObjectAssociation(Zone, Behaviour, this.behaviour().getId())) {
			this.behaviour().desynchronize();
			this._behaviour = null;
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
        return this.createObject(Zone, this.toJSONObject());
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {Zone} The model instance.
     */
    static read(id : number) : Zone {
        return this.readObject(Zone, id);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        return this.updateObject(Zone, this.toJSONObject());
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        return this.deleteObject(Zone);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<Zone>} The model instances.
     */
    static all() : Array<Zone> {
        return this.allObjects(Zone);
    }

	/**
	 * Return a Zone instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Zone} The model instance.
	 */
	static parseJSON(jsonString : string) : Zone {
		return Zone.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a Zone instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Zone} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : Zone {
		if (!jsonObject.id) {
			throw new ModelException("A Zone object should have an ID.");
		}
		if(!jsonObject.name) {
			throw new ModelException("A Zone object should have a name.");
		}
		if(!jsonObject.description) {
			throw new ModelException("A Zone object should have a description.");
		}
		if(!jsonObject.width) {
			throw new ModelException("A Zone object should have a width.");
		}
		if(!jsonObject.height) {
			throw new ModelException("A Zone object should have a height.");
		}
		if(!jsonObject.positionFromTop && jsonObject.positionFromTop != 0) {
			throw new ModelException("A Zone object should have a positionFromTop.");
		}
		if(!jsonObject.positionFromLeft && jsonObject.positionFromLeft != 0) {
			throw new ModelException("A Zone object should have a positionFromLeft.");
		}
		return new Zone(jsonObject.name, jsonObject.description, jsonObject.width, jsonObject.height, jsonObject.positionFromTop, jsonObject.positionFromLeft, jsonObject.id);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Zones";
    }
}