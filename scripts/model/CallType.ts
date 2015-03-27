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
    constructor(name : string = "", description : string = "", id : number = null, complete : boolean = false) {
        super(id, complete);

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
    loadSource(successCallback : Function, failCallback : Function) {
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
    loadRenderer(successCallback : Function, failCallback : Function) {
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
    loadReceivePolicy(successCallback : Function, failCallback : Function) {
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
    loadRenderPolicy(successCallback : Function, failCallback : Function) {
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
    loadZone(successCallback : Function, failCallback : Function) {
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
    loadAssociations(successCallback : Function, failCallback : Function) {
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
			"description": this.description(),
			"complete": this.isComplete()
		};
		return data;
	}

	/**
	 * Check whether the object is complete or not
	 *
	 * A CallType is complete if it has an ID, a name, a source, a renderer and a zone.
	 *
	 * @param successCallback The function to call in case of success.
	 * @param failCallback The function to call in case of failure.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) {
		var self = this;
		var success : Function = function () {
			if (self.isComplete() && !!self.name()) {
				var success:Function = function () {
					if (self._renderer_loaded && self._source_loaded && self._zone_loaded) {
						self._complete = (!!self.renderer() && self.renderer().isComplete()) && (!!self.zone() && self.zone().isComplete()) && (!!self.source() && self.source().isComplete());
						successCallback();
					}
				};

				var fail:Function = function (error) {
					failCallback(error);
				};

				self.loadSource(success, fail);
				self.loadZone(success, fail);
				self.loadRenderer(success, fail);
			} else {
				self._complete = false;
				successCallback();
			}
		};
		super.checkCompleteness(success, failCallback);
	}

    /**
     * Return a CallType instance as a JSON Object including associated object.
     * However the method should not be recursive due to cycle in the model.
     *
     * @method toCompleteJSONObject
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    toCompleteJSONObject(successCallback : Function, failCallback : Function) {
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
     * @method linkSource
	 * @param {Source} s The Source to associate with the CallType.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkSource(sourceId : number, successCallback : Function, failCallback : Function) {
		this.associateObject(CallType, Source, sourceId, successCallback, failCallback);
	}

	/**
	 * Unset the current Source from the CallType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Source must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkSource
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkSource(sourceID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(CallType, Source, sourceID, successCallback, failCallback);
	}

	/**
	 * Set the Renderer of the CallType.
	 * As a CallType can only have one Renderer, if the value is already set, this method throws an exception: you need first to unset the Renderer.
	 * Moreover the given Renderer must be created in database.
	 *
     * @method linkRenderer
	 * @param {Renderer} r The Renderer to associate with the CallType.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkRenderer(rendererID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(CallType, Renderer, rendererID, successCallback, failCallback);
	}

	/**
	 * Unset the current Renderer from the CallType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Renderer must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkRenderer
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkRenderer(rendererID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(CallType, Renderer, rendererID, successCallback, failCallback);
	}

	/**
	 * Set the ReceivePolicy of the CallType.
	 * As a CallType can only have one ReceivePolicy, if the value is already set, this method throws an exception: you need first to unset the ReceivePolicy.
	 * Moreover the given ReceivePolicy must be created in database.
	 *
     * @method linkReceivePolicy
	 * @param {ReceivePolicy} rp The ReceivePolicy to associate with the CallType.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkReceivePolicy(rpID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(CallType, ReceivePolicy, rpID, successCallback, failCallback);
	}

	/**
	 * Unset the current ReceivePolicy from the CallType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A ReceivePolicy must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkReceivePolicy
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkReceivePolicy(rpID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(CallType, ReceivePolicy, rpID, successCallback, failCallback);
	}

	/**
	 * Set the RenderPolicy of the CallType.
	 * As a CallType can only have one RenderPolicy, if the value is already set, this method throws an exception: you need first to unset the RenderPolicy.
	 * Moreover the given RenderPolicy must be created in database.
	 *
     * @method linkRenderPolicy
	 * @param {RenderPolicy} rp The RenderPolicy to associate with the CallType.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkRenderPolicy(rpID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(CallType, RenderPolicy, rpID, successCallback, failCallback);
	}

	/**
	 * Unset the current RenderPolicy from the CallType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A RenderPolicy must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkRenderPolicy
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkRenderPolicy(rpID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(CallType, RenderPolicy, rpID, successCallback, failCallback);
	}

	/**
	 * Set the Zone of the CallType.
	 * As a CallType can only have one Zone, if the value is already set, this method throws an exception: you need first to unset the Zone.
	 * Moreover the given Zone must be created in database.
	 *
     * @method linkZone
	 * @param {Zone} z The Zone to associate with the CallType.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkZone(zoneID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(CallType, Zone, zoneID, successCallback, failCallback);
	}

	/**
	 * Unset the current Zone from the CallType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Zone must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkZone
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkZone(zoneID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(CallType, Zone, zoneID, successCallback, failCallback);
	}

    /**
     * Create model in database.
     *
     * @method create
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    create(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        this.createObject(CallType, this.toJSONObject(), successCallback, failCallback);
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
    static read(id : number, successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        ModelItf.readObject(CallType, id, successCallback, failCallback, attemptNumber);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    update(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        return this.updateObject(CallType, this.toJSONObject(), successCallback, failCallback, attemptNumber);
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    delete(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        return ModelItf.deleteObject(CallType, this.getId(), successCallback, failCallback, attemptNumber);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    static all(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        return this.allObjects(CallType, successCallback, failCallback, attemptNumber);
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

		if(jsonObject.complete == undefined || jsonObject.complete == null) {
			throw new ModelException("A CallType object should have a complete attribute.");
		}

		return new CallType(jsonObject.name, jsonObject.description, jsonObject.id, jsonObject.complete);
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