/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Source.ts" />
/// <reference path="./Renderer.ts" />
/// <reference path="./ReceivePolicy.ts" />
/// <reference path="./RenderPolicy.ts" />
/// <reference path="./Call.ts" />

/// <reference path="../core/Logger.ts" />

/**
 * Model : CallType
 *
 * @class CallType
 * @extends ModelItf
 */
class CallType extends ModelItf {

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
     * Source property.
     *
     * @property _source
     * @type Source
     */
    private _source : Source;

    /**
     * Lazy loading for Source property.
     *
     * @property _source_loaded
     * @type boolean
     */
    private _source_loaded : boolean;

    /**
     * Renderer property.
     *
     * @property _renderer
     * @type Renderer
     */
    private _renderer : Renderer;

    /**
     * Lazy loading for Renderer property.
     *
     * @property _renderer_loaded
     * @type boolean
     */
    private _renderer_loaded : boolean;

    /**
     * ReceivePolicy property.
     *
     * @property _receive_policy
     * @type ReceivePolicy
     */
    private _receive_policy : ReceivePolicy;

    /**
     * Lazy loading for ReceivePolicy property.
     *
     * @property _receive_policy_loaded
     * @type boolean
     */
    private _receive_policy_loaded : boolean;

    /**
     * RenderPolicy property.
     *
     * @property _render_policy
     * @type RenderPolicy
     */
    private _render_policy : RenderPolicy;

    /**
     * Lazy loading for RenderPolicy property.
     *
     * @property _render_policy_loaded
     * @type boolean
     */
    private _render_policy_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The CallType's name.
     * @param {string} description - The CallType's description.
     * @param {number} id - The CallType's ID.
     */
    constructor(name : string, description : string, id : number = null) {
        super(id);

		this.setName(name);
		this.setDescription(description);

        this._source = null;
        this._source_loaded = false;

        this._renderer = null;
        this._renderer_loaded = false;

        this._receive_policy = null;
        this._receive_policy_loaded = false;

        this._render_policy = null;
        this._render_policy_loaded = false;
    }

	/**
	 * Set the CallType's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		if(name == null || name == "") {
			Logger.error("A CallType needs to have a name.");
			// TODO : Throw an Exception ?
		}

		this._name = name;
	}

	/**
	 * Set the CallType's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string) {
		if(description == null || description == "") {
			Logger.error("A CallType needs to have a description.");
			// TODO : Throw an Exception ?
		}

		this._description = description;
	}

    /**
     * Return the CallType's name.
     */
    name() {
        return this._name;
    }

    /**
     * Return the CallType's description.
     */
    description() {
        return this._description;
    }

    /**
     * Return the CallType's source.
     */
    source() {
        if(! this._source_loaded) {
            this._source_loaded = this.getUniquelyAssociatedObject(CallType, Source, this._source);
        }
        return this._source;
    }

    /**
     * Return the CallType's renderer.
     */
    renderer() {
        if(! this._renderer_loaded) {
            this._renderer_loaded = this.getUniquelyAssociatedObject(CallType, Renderer, this._renderer);
        }
        return this._renderer;
    }

    /**
     * Return the CallType's receivePolicy.
     */
    receivePolicy() {
        if(! this._receive_policy_loaded) {
            this._receive_policy_loaded = this.getUniquelyAssociatedObject(CallType, ReceivePolicy, this._receive_policy);
        }
        return this._receive_policy;
    }

    /**
     * Return the CallType's renderPolicy.
     */
    renderPolicy() {
        if(! this._render_policy_loaded) {
            this._render_policy_loaded = this.getUniquelyAssociatedObject(CallType, RenderPolicy, this._render_policy);
        }
        return this._render_policy;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Load all the lazy loading properties of the object.
	 * Useful when you want to get a complete object.
	 */
	loadAssociations() : void {
		this.source();
		this.renderer();
		this.receivePolicy();
		this.renderPolicy();
	}

	/**
	 * Private method to transform the object in JSON.
	 * It is used to create or update the object in database.
	 *
	 * @returns {{name: string, description: string}}
	 */
	toJSONObject() : Object  {
		var data = {
			"name" : this.name(),
			"description" : this.description()
		};

		return data;
	}

	/**
	 * Set the Source of the CallType.
	 * As a CallType can only have one Source, if the value is already set, this method throws an exception: you need first to unset the Source.
	 * Moreover the given Source must be created in database.
	 *
	 * @param {Source} s The Source to associate with the CallType.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setSource(s : Source) : boolean {
		if (this.source() !== null) {
			throw new Error("The source is already set for this CallType.");
		}

		if (s === null || s.getId() === undefined || s.getId() === null) {
			throw new Error("The source must be an existing object to be associated.");
		}

		if (this.associateObject(CallType, Source, s.getId())) {
			this._source = s;
			this._source_loaded = true;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Unset the current Source from the CallType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Source must have been set before using it, else an exception is thrown.
	 *
	 * @returns {boolean} Returns true if the source is well unset and the association removed in database.
	 */
	unsetSource() : boolean {
		if (this.source() === null) {
			throw new Error("No source has been set for this callType.");
		}

		if (this.deleteObjectAssociation(CallType, Source, this.source().getId())) {
			this._source = null;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Set the Renderer of the CallType.
	 * As a CallType can only have one Renderer, if the value is already set, this method throws an exception: you need first to unset the Renderer.
	 * Moreover the given Renderer must be created in database.
	 *
	 * @param {Renderer} r The Renderer to associate with the CallType.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setRenderer(r : Renderer) : boolean {
		if (this.renderer() !== null) {
			throw new Error("The renderer is already set for this CallType.");
		}

		if (r === null || r.getId() === undefined || r.getId() === null) {
			throw new Error("The renderer must be an existing object to be associated.");
		}

		if (this.associateObject(CallType, Renderer, r.getId())) {
			this._renderer = r;
			this._renderer_loaded = true;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Unset the current Renderer from the CallType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Renderer must have been set before using it, else an exception is thrown.
	 *
	 * @returns {boolean} Returns true if the renderer is well unset and the association removed in database.
	 */
	unsetRenderer() : boolean {
		if (this.renderer() === null) {
			throw new Error("No renderer has been set for this callType.");
		}

		if (this.deleteObjectAssociation(CallType, Renderer, this.renderer().getId())) {
			this._renderer = null;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Set the ReceivePolicy of the CallType.
	 * As a CallType can only have one ReceivePolicy, if the value is already set, this method throws an exception: you need first to unset the ReceivePolicy.
	 * Moreover the given ReceivePolicy must be created in database.
	 *
	 * @param {ReceivePolicy} rp The ReceivePolicy to associate with the CallType.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setReceivePolicy(rp : ReceivePolicy) : boolean {
		if (this.receivePolicy() !== null) {
			throw new Error("The receivePolicy is already set for this CallType.");
		}

		if (rp === null || rp.getId() === undefined || rp.getId() === null) {
			throw new Error("The receivePolicy must be an existing object to be associated.");
		}

		if (this.associateObject(CallType, ReceivePolicy, rp.getId())) {
			this._receive_policy = rp;
			this._receive_policy_loaded = true;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Unset the current ReceivePolicy from the CallType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A ReceivePolicy must have been set before using it, else an exception is thrown.
	 *
	 * @returns {boolean} Returns true if the ReceivePolicy is well unset and the association removed in database.
	 */
	unsetReceivePolicy() : boolean {
		if (this.receivePolicy() === null) {
			throw new Error("No receivePolicy has been set for this callType.");
		}

		if (this.deleteObjectAssociation(CallType, ReceivePolicy, this.receivePolicy().getId())) {
			this._receive_policy = null;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Set the RenderPolicy of the CallType.
	 * As a CallType can only have one RenderPolicy, if the value is already set, this method throws an exception: you need first to unset the RenderPolicy.
	 * Moreover the given RenderPolicy must be created in database.
	 *
	 * @param {RenderPolicy} rp The RenderPolicy to associate with the CallType.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setRenderPolicy(rp : RenderPolicy) : boolean {
		if (this.renderPolicy() !== null) {
			throw new Error("The renderPolicy is already set for this CallType.");
		}

		if (rp === null || rp.getId() === undefined || rp.getId() === null) {
			throw new Error("The renderPolicy must be an existing object to be associated.");
		}

		if (this.associateObject(CallType, RenderPolicy, rp.getId())) {
			this._render_policy = rp;
			this._render_policy_loaded = true;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Unset the current RenderPolicy from the CallType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A RenderPolicy must have been set before using it, else an exception is thrown.
	 *
	 * @returns {boolean} Returns true if the RenderPolicy is well unset and the association removed in database.
	 */
	unsetRenderPolicy() : boolean {
		if (this.renderPolicy() === null) {
			throw new Error("No RenderPolicy has been set for this callType.");
		}

		if (this.deleteObjectAssociation(CallType, RenderPolicy, this.renderPolicy().getId())) {
			this._render_policy = null;
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
        return this.createObject(CallType, this.toJSONObject());
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {CallType} The model instance.
     */
    static read(id : number) : CallType {
        return this.readObject(CallType, id);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        return this.updateObject(CallType, this.toJSONObject());
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        return this.deleteObject(CallType);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<CallType>} The model instances.
     */
    static all() : Array<CallType> {
        return this.allObjects(CallType);
    }

	/**
	 * Return a CallType instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Call} The model instance.
	 */
	static parseJSON(jsonString : string) : CallType {
		return CallType.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a CallType instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Call} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : CallType {
		if(typeof(jsonObject.name) == "undefined" || typeof(jsonObject.description) == "undefined" || typeof(jsonObject.id) == "undefined") {
			return null;
		} else {
			return new CallType(jsonObject.name, jsonObject.description, jsonObject.id);
		}
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "CallTypes";
    }
}