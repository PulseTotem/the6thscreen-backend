/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Source.ts" />
/// <reference path="./Renderer.ts" />
/// <reference path="./ReceivePolicy.ts" />
/// <reference path="./RenderPolicy.ts" />
/// <reference path="./Zone.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

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
	 * Zone property
	 *
	 * @property _zone
	 * @type Zone
	 */
	private _zone : Zone;

	/**
	 * Lazy loading for Zone property
	 *
	 * @property _zone_loaded
	 * @type boolean
	 */
	private _zone_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The CallType's name.
     * @param {string} description - The CallType's description.
     * @param {number} id - The CallType's ID.
     */
    constructor(name : string, description : string = "", id : number = null) {
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

	    this._zone = null;
	    this._zone_loaded = false;
    }

	/**
	 * Set the CallType's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		if(!name) {
			throw new ModelException("A CallType need a proper name.");
		}

		this._name = name;
	}

	/**
	 * Set the CallType's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string) {
		this._description = description;
	}

    /**
     * Return the CallType's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Return the CallType's description.
     *
     * @method description
     */
    description() {
        return this._description;
    }

    /**
     * Return the CallType's source.
     *
     * @method source
     */
    source() {
        return this._source;
    }

    /**
     * Load the CallType's source.
     *
     * @method loadSource
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadSource(successCallback : Function = null, failCallback : Function = null) {
        if(! this._source_loaded) {
            var self = this;
            var success : Function = function(source) {
                if(!!source) {
                    self._source = source;
                }
                self._source_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(CallType, Source, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

    /**
     * Return the CallType's renderer.
     *
     * @method renderer
     */
    renderer() {
        return this._renderer;
    }

    /**
     * Load the CallType's renderer.
     *
     * @method loadRenderer
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadRenderer(successCallback : Function = null, failCallback : Function = null) {
        if(! this._renderer_loaded) {
            var self = this;
            var success : Function = function(renderer) {
                if(!!renderer) {
                    self._renderer = renderer;
                }
                self._renderer_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(CallType, Renderer, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

    /**
     * Return the CallType's receivePolicy.
     *
     * @method receivePolicy
     */
    receivePolicy() {
        return this._receive_policy;
    }

    /**
     * Load the CallType's receivePolicy.
     *
     * @method loadReceivePolicy
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadReceivePolicy(successCallback : Function = null, failCallback : Function = null) {
        if(! this._receive_policy_loaded) {
            var self = this;
            var success : Function = function(receivePolicy) {
                if(!!receivePolicy) {
                    self._receive_policy = receivePolicy;
                }
                self._receive_policy_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(CallType, ReceivePolicy, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

    /**
     * Return the CallType's renderPolicy.
     *
     * @method renderPolicy
     */
    renderPolicy() {
        return this._render_policy;
    }

    /**
     * Load the CallType's renderPolicy.
     *
     * @method loadRenderPolicy
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadRenderPolicy(successCallback : Function = null, failCallback : Function = null) {
        if(! this._render_policy_loaded) {
            var self = this;
            var success : Function = function(renderPolicy) {
                if(!!renderPolicy) {
                    self._render_policy = renderPolicy;
                }
                self._render_policy_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(CallType, RenderPolicy, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

	/**
	 * Return the CallType's zone.
     *
     * @method zone
	 */
	zone() {
		return this._zone;
	}

    /**
     * Load the CallType's zone.
     *
     * @method loadZone
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadZone(successCallback : Function = null, failCallback : Function = null) {
        if(! this._zone_loaded) {
            var self = this;
            var success : Function = function(zone) {
                if(!!zone) {
                    self._zone = zone;
                }
                self._zone_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(CallType, Zone, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

    /**
     * Load all the lazy loading properties of the object.
     * Useful when you want to get a complete object.
     *
     * @method loadAssociations
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadAssociations(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var success : Function = function(models) {
            if(self._source_loaded && self._renderer_loaded && self._receive_policy_loaded && self._render_policy_loaded && self._zone_loaded) {
                if (successCallback != null) {
                    successCallback();
                } // else //Nothing to do ?
            }
        };

        var fail : Function = function(error) {
            if(failCallback != null) {
                failCallback(error);
            } else {
                Logger.error(JSON.stringify(error));
            }
        };

        this.loadSource(success, fail);
        this.loadRenderer(success, fail);
        this.loadReceivePolicy(success, fail);
        this.loadRenderPolicy(success, fail);
        this.loadZone(success, fail);
    }

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._source_loaded = false;
		this._receive_policy_loaded = false;
		this._render_policy_loaded = false;
		this._renderer_loaded = false;
		this._zone_loaded = false;
	}

	/**
	 * Return a CallType instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"description": this.description()
		};
		return data;
	}

    /**
     * Return a CallType instance as a JSON Object including associated object.
     * However the method should not be recursive due to cycle in the model.
     *
     * @method toCompleteJSONObject
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    toCompleteJSONObject(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var success : Function = function() {
            var data = self.toJSONObject();
            data["source"] = (self.source() !== null) ? self.source().toJSONObject() : null;
            data["renderer"] = (self.renderer() !== null) ? self.renderer().toJSONObject() : null;
            data["zone"] = (self.zone() !== null) ? self.zone().toJSONObject() : null;
            data["receivePolicy"] = (self.receivePolicy() !== null) ? self.receivePolicy().toJSONObject() : null;
            data["renderPolicy"] = (self.renderPolicy() !== null) ? self.renderPolicy().toJSONObject() : null;

            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

	/**
	 * Set the Source of the CallType.
	 * As a CallType can only have one Source, if the value is already set, this method throws an exception: you need first to unset the Source.
	 * Moreover the given Source must be created in database.
	 *
     * @method setSource
	 * @param {Source} s The Source to associate with the CallType.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setSource(s : Source) : boolean {
		if (!s || !s.getId()) {
			throw new ModelException("The source must be an existing object to be associated.");
		}

		if (this.source() !== null) {
			throw new ModelException("The source is already set for this CallType.");
		}



		if (this.associateObject(CallType, Source, s.getId())) {
			s.desynchronize();
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
     * @method unsetSource
	 * @returns {boolean} Returns true if the source is well unset and the association removed in database.
	 */
	unsetSource() : boolean {
		if (this.source() === null) {
			throw new ModelException("No source has been set for this callType.");
		}

		if (this.deleteObjectAssociation(CallType, Source, this.source().getId())) {
			this.source().desynchronize();
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
     * @method setRenderer
	 * @param {Renderer} r The Renderer to associate with the CallType.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setRenderer(r : Renderer) : boolean {
		if (!r || !r.getId()) {
			throw new ModelException("The renderer must be an existing object to be associated.");
		}

		if (this.renderer() !== null) {
			throw new ModelException("The renderer is already set for this CallType.");
		}

		if (this.associateObject(CallType, Renderer, r.getId())) {
			r.desynchronize();
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
     * @method unsetRenderer
	 * @returns {boolean} Returns true if the renderer is well unset and the association removed in database.
	 */
	unsetRenderer() : boolean {
		if (this.renderer() === null) {
			throw new ModelException("No renderer has been set for this callType.");
		}

		if (this.deleteObjectAssociation(CallType, Renderer, this.renderer().getId())) {
			this.renderer().desynchronize();
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
     * @method setReceivePolicy
	 * @param {ReceivePolicy} rp The ReceivePolicy to associate with the CallType.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setReceivePolicy(rp : ReceivePolicy) : boolean {
		if (!rp || !rp.getId()) {
			throw new ModelException("The receivePolicy must be an existing object to be associated.");
		}

		if (this.receivePolicy() !== null) {
			throw new ModelException("The receivePolicy is already set for this CallType.");
		}



		if (this.associateObject(CallType, ReceivePolicy, rp.getId())) {
			rp.desynchronize();
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
     * @method unsetReceivePolicy
	 * @returns {boolean} Returns true if the ReceivePolicy is well unset and the association removed in database.
	 */
	unsetReceivePolicy() : boolean {
		if (this.receivePolicy() === null) {
			throw new ModelException("No receivePolicy has been set for this callType.");
		}

		if (this.deleteObjectAssociation(CallType, ReceivePolicy, this.receivePolicy().getId())) {
			this.receivePolicy().desynchronize();
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
     * @method setRenderPolicy
	 * @param {RenderPolicy} rp The RenderPolicy to associate with the CallType.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setRenderPolicy(rp : RenderPolicy) : boolean {
		if (!rp || !rp.getId()) {
			throw new ModelException("The renderPolicy must be an existing object to be associated.");
		}

		if (this.renderPolicy() !== null) {
			throw new ModelException("The renderPolicy is already set for this CallType.");
		}

		if (this.associateObject(CallType, RenderPolicy, rp.getId())) {
			rp.desynchronize();
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
     * @method unsetRenderPolicy
	 * @returns {boolean} Returns true if the RenderPolicy is well unset and the association removed in database.
	 */
	unsetRenderPolicy() : boolean {
		if (this.renderPolicy() === null) {
			throw new ModelException("No RenderPolicy has been set for this callType.");
		}

		if (this.deleteObjectAssociation(CallType, RenderPolicy, this.renderPolicy().getId())) {
			this.renderPolicy().desynchronize();
			this._render_policy = null;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Set the Zone of the CallType.
	 * As a CallType can only have one Zone, if the value is already set, this method throws an exception: you need first to unset the Zone.
	 * Moreover the given Zone must be created in database.
	 *
     * @method setZone
	 * @param {Zone} z The Zone to associate with the CallType.
	 * @returns {boolean} Returns true if the association has been created in database.
	 */
	setZone(z : Zone) : boolean {
		if (!z || !z.getId()) {
			throw new ModelException("The zone must be an existing object to be associated.");
		}

		if (this.zone() !== null) {
			throw new ModelException("The zone is already set for this CallType.");
		}

		if (this.associateObject(CallType, Zone, z.getId())) {
			z.desynchronize();
			this._zone = z;
			this._zone_loaded = true;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Unset the current Zone from the CallType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Zone must have been set before using it, else an exception is thrown.
	 *
     * @method unsetZone
	 * @returns {boolean} Returns true if the Zone is well unset and the association removed in database.
	 */
	unsetZone() : boolean {
		if (this.zone() === null) {
			throw new ModelException("No Zone has been set for this callType.");
		}

		if (this.deleteObjectAssociation(CallType, Zone, this.zone().getId())) {
			this.zone().desynchronize();
			this._zone = null;
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
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    static read(id : number, successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
        ModelItf.readObject(CallType, id, successCallback, failCallback, attemptNumber);
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
	 * @return {CallType} The model instance.
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
	 * @return {CallType} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : CallType {
		if(!jsonObject.id) {
			throw new ModelException("A CallType object should have an ID.");
		}
		if(!jsonObject.name) {
			throw new ModelException("A CallType object should have a name.");
		}
		if(!jsonObject.description) {
			throw new ModelException("A CallType object should have a description.");
		}
		return new CallType(jsonObject.name, jsonObject.description, jsonObject.id);
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