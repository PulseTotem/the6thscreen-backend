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
			"description": this.description(),
			"complete": this.isComplete()
		};
		return data;
	}

	/**
	 * Check whether the object is complete or not
	 *
	 * A Renderer is complete if it has an ID, a name, a source, a renderer and a zone.
	 *
	 * @param successCallback The function to call in case of success.
	 * @param failCallback The function to call in case of failure.
	 */
	checkCompleteness(successCallback : Function = null, failCallback : Function = null) {
		super.checkCompleteness();

		if (this.isComplete() && !!this.name()) {
			var self = this;

			var success : Function = function () {
				if (self._renderer_loaded && self._source_loaded && self._zone_loaded) {
					self._complete = (!!self.renderer() && self.renderer().isComplete()) && (!!self.zone() && self.zone().isComplete()) && (!!self.source() && self.source().isComplete());
					successCallback();
				}
			};

			var fail : Function = function (error) {
				failCallback(error);
			};

			this.loadSource(success,fail);
			this.loadZone(success,fail);
			this.loadRenderer(success,fail);
		} else {
			this._complete = false;
			successCallback();
		}
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
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	setSource(s : Source, successCallback : Function = null, failCallback : Function = null) {
		if (!s || !s.getId()) {
            failCallback(new ModelException("The source must be an existing object to be associated."));
            return;
		}

		if (this.source() !== null) {
            failCallback(new ModelException("The source is already set for this CallType."));
            return;
		}

        var self = this;

        var success : Function = function() {
            s.desynchronize();
            self._source = s;
            self._source_loaded = true;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.associateObject(CallType, Source, s.getId(), success, fail);
	}

	/**
	 * Unset the current Source from the CallType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Source must have been set before using it, else an exception is thrown.
	 *
     * @method unsetSource
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unsetSource(successCallback : Function = null, failCallback : Function = null) {
		if (this.source() === null) {
            failCallback(new ModelException("No source has been set for this callType."));
            return;
		}

        var self = this;

        var success : Function = function() {
            self.source().desynchronize();
            self._source = null;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(CallType, Source, this.source().getId(), success, fail);
	}

	/**
	 * Set the Renderer of the CallType.
	 * As a CallType can only have one Renderer, if the value is already set, this method throws an exception: you need first to unset the Renderer.
	 * Moreover the given Renderer must be created in database.
	 *
     * @method setRenderer
	 * @param {Renderer} r The Renderer to associate with the CallType.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	setRenderer(r : Renderer, successCallback : Function = null, failCallback : Function = null) {
		if (!r || !r.getId()) {
            failCallback(new ModelException("The renderer must be an existing object to be associated."));
            return;
		}

		if (this.renderer() !== null) {
            failCallback(new ModelException("The renderer is already set for this CallType."));
            return;
		}

        var self = this;

        var success : Function = function() {
            r.desynchronize();
            self._renderer = r;
            self._renderer_loaded = true;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.associateObject(CallType, Renderer, r.getId(), success, fail);
	}

	/**
	 * Unset the current Renderer from the CallType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Renderer must have been set before using it, else an exception is thrown.
	 *
     * @method unsetRenderer
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unsetRenderer(successCallback : Function = null, failCallback : Function = null) {
		if (this.renderer() === null) {
            failCallback(new ModelException("No renderer has been set for this callType."));
            return;
		}

        var self = this;

        var success : Function = function() {
            self.renderer().desynchronize();
            self._renderer = null;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(CallType, Renderer, this.renderer().getId(), success, fail);
	}

	/**
	 * Set the ReceivePolicy of the CallType.
	 * As a CallType can only have one ReceivePolicy, if the value is already set, this method throws an exception: you need first to unset the ReceivePolicy.
	 * Moreover the given ReceivePolicy must be created in database.
	 *
     * @method setReceivePolicy
	 * @param {ReceivePolicy} rp The ReceivePolicy to associate with the CallType.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	setReceivePolicy(rp : ReceivePolicy, successCallback : Function = null, failCallback : Function = null) {
		if (!rp || !rp.getId()) {
            failCallback(new ModelException("The receivePolicy must be an existing object to be associated."));
            return;
		}

		if (this.receivePolicy() !== null) {
            failCallback(new ModelException("The receivePolicy is already set for this CallType."));
            return;
		}

        var self = this;

        var success : Function = function() {
            rp.desynchronize();
            self._receive_policy = rp;
            self._receive_policy_loaded = true;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.associateObject(CallType, ReceivePolicy, rp.getId(), success, fail);
	}

	/**
	 * Unset the current ReceivePolicy from the CallType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A ReceivePolicy must have been set before using it, else an exception is thrown.
	 *
     * @method unsetReceivePolicy
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unsetReceivePolicy(successCallback : Function = null, failCallback : Function = null) {
		if (this.receivePolicy() === null) {
            failCallback(new ModelException("No receivePolicy has been set for this callType."));
            return;
		}

        var self = this;

        var success : Function = function() {
            self.receivePolicy().desynchronize();
            self._receive_policy = null;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(CallType, ReceivePolicy, this.receivePolicy().getId(), success, fail);
	}

	/**
	 * Set the RenderPolicy of the CallType.
	 * As a CallType can only have one RenderPolicy, if the value is already set, this method throws an exception: you need first to unset the RenderPolicy.
	 * Moreover the given RenderPolicy must be created in database.
	 *
     * @method setRenderPolicy
	 * @param {RenderPolicy} rp The RenderPolicy to associate with the CallType.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	setRenderPolicy(rp : RenderPolicy, successCallback : Function = null, failCallback : Function = null) {
		if (!rp || !rp.getId()) {
            failCallback(new ModelException("The renderPolicy must be an existing object to be associated."));
            return;
		}

		if (this.renderPolicy() !== null) {
            failCallback(new ModelException("The renderPolicy is already set for this CallType."));
            return;
		}

        var self = this;

        var success : Function = function() {
            rp.desynchronize();
            self._render_policy = rp;
            self._render_policy_loaded = true;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.associateObject(CallType, RenderPolicy, rp.getId(), success, fail);
	}

	/**
	 * Unset the current RenderPolicy from the CallType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A RenderPolicy must have been set before using it, else an exception is thrown.
	 *
     * @method unsetRenderPolicy
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unsetRenderPolicy(successCallback : Function = null, failCallback : Function = null) {
		if (this.renderPolicy() === null) {
            failCallback(new ModelException("No RenderPolicy has been set for this callType."));
            return;
		}

        var self = this;

        var success : Function = function() {
            self.renderPolicy().desynchronize();
            self._render_policy = null;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(CallType, RenderPolicy, this.renderPolicy().getId(), success, fail);
	}

	/**
	 * Set the Zone of the CallType.
	 * As a CallType can only have one Zone, if the value is already set, this method throws an exception: you need first to unset the Zone.
	 * Moreover the given Zone must be created in database.
	 *
     * @method setZone
	 * @param {Zone} z The Zone to associate with the CallType.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	setZone(z : Zone, successCallback : Function = null, failCallback : Function = null) {
		if (!z || !z.getId()) {
            failCallback(new ModelException("The zone must be an existing object to be associated."));
            return;
		}

		if (this.zone() !== null) {
            failCallback(new ModelException("The zone is already set for this CallType."));
            return;
		}

        var self = this;

        var success : Function = function() {
            z.desynchronize();
            self._zone = z;
            self._zone_loaded = true;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.associateObject(CallType, Zone, z.getId(), success, fail);
	}

	/**
	 * Unset the current Zone from the CallType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Zone must have been set before using it, else an exception is thrown.
	 *
     * @method unsetZone
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unsetZone(successCallback : Function = null, failCallback : Function = null) {
		if (this.zone() === null) {
            failCallback(new ModelException("No Zone has been set for this callType."));
            return;
		}

        var self = this;

        var success : Function = function() {
            self.zone().desynchronize();
            self._zone = null;

            successCallback();
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.deleteObjectAssociation(CallType, Zone, this.zone().getId(), success, fail);
	}

    /**
     * Create model in database.
     *
     * @method create
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    create(successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
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
    static read(id : number, successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
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
    update(successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
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
    delete(successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
        return this.deleteObject(CallType, successCallback, failCallback, attemptNumber);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    static all(successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
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