/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Source.ts" />
/// <reference path="./Renderer.ts" />
/// <reference path="./ReceivePolicy.ts" />
/// <reference path="./RenderPolicy.ts" />
/// <reference path="./Call.ts" />
/// <reference path="./CallType.ts" />

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
     * Calls property.
     *
     * @property _calls
     * @type Array<Call>
     */
    private _calls : Array<Call>;

    /**
     * Lazy loading for Calls property.
     *
     * @property _calls_loaded
     * @type boolean
     */
    private _calls_loaded : boolean;

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

        if(this._name == null || this._name == "") {
            Logger.error("A CallType needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;

        if(this._description == null || this._description == "") {
            Logger.error("A CallType needs to have a description.");
            // TODO : Throw an Exception ?
        }

        this._description = description;

        this._source = null;
        this._source_loaded = false;

        this._renderer = null;
        this._renderer_loaded = false;

        this._receive_policy = null;
        this._receive_policy_loaded = false;

        this._render_policy = null;
        this._render_policy_loaded = false;

        this._calls = new Array<Call>();
        this._calls_loaded = false;
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

    /**
     * Return the CallType's calls.
     */
    calls() {
        if(! this._calls_loaded) {
            this._calls_loaded = this.getAssociatedObjects(CallType, Call, this._calls);
        }
        return this._calls;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	loadAssociations() : void {
		this.source();
		this.renderer();
		this.receivePolicy();
		this.renderPolicy();
		this.calls();
	}

	toJSONObject() : Object  {
		var data = {
			"name" : this.name(),
			"description" : this.description()
		};

		return data;
	}

	// TODO : consider associated elements as loaded ?
	setSource(s : Source) : boolean {
		if (this.associateObject(CallType, Source, s.getId())) {
			this._source = s;
			this._source_loaded = true;
			return true;
		} else {
			return false;
		}
	}

	setRenderer(r : Renderer) : boolean {
		return this.associateObject(CallType, Renderer, r.getId());
	}

	setReceivePolicy(rp : ReceivePolicy) : boolean {
		return this.associateObject(CallType, ReceivePolicy, rp.getId());
	}

	setRenderPolicy(rp : RenderPolicy) : boolean {
		return this.associateObject(CallType, RenderPolicy, rp.getId());
	}

	addCall(c : Call) : boolean {
		return this.associateObject(CallType, Call, c.getId());
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