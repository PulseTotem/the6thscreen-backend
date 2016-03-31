/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Source.ts" />
/// <reference path="./Renderer.ts" />
/// <reference path="./RendererTheme.ts" />
/// <reference path="./Zone.ts" />
/// <reference path="./Policy.ts" />
/// <reference path="./Call.ts" />

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
	 * RendererTheme property.
	 *
	 * @property _rendererTheme
	 * @type RendererTheme
	 */
	private _rendererTheme : RendererTheme;

	/**
	 * Lazy loading for RendererTheme property.
	 *
	 * @property _rendererTheme_loaded
	 * @type boolean
	 */
	private _rendererTheme_loaded : boolean;

    /**
     * Policy property.
     *
     * @property _policy
     * @type Policy
     */
    private _policy : Policy;

    /**
     * Lazy loading for Policy property.
     *
     * @property _policy_loaded
     * @type boolean
     */
    private _policy_loaded : boolean;

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
     * Calls property
     *
     * @property _calls
     * @type Array<Call>
     */
    private _calls : Array<Call>;

    /**
     * Lazy loading for Calls property
     *
     * @property _calls_loaded
     * @type boolean
     */
    private _calls_loaded : boolean;

    /**
     * OrigineCallType if the current object is a clone
     *
     * @property _origineCallType
     * @type CallType
     */
    private _origineCallType : CallType;

    /**
     * Lazy loading for OrigineCallType property
     *
     * @property _origineCallType_loaded
     * @type boolean
     */
    private _origineCallType_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The CallType's name.
     * @param {string} description - The CallType's description.
     * @param {number} id - The CallType's ID.
	 * @param {string} createdAt - The CallType's createdAt.
	 * @param {string} updatedAt - The CallType's updatedAt.
     */
    constructor(name : string = "", description : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

		this.setName(name);
		this.setDescription(description);

        this._source = null;
        this._source_loaded = false;

        this._renderer = null;
        this._renderer_loaded = false;

		this._rendererTheme = null;
		this._rendererTheme_loaded = false;

        this._policy = null;
        this._policy_loaded = false;

	    this._zone = null;
	    this._zone_loaded = false;

        this._calls = new Array<Call>();
        this._calls_loaded = false;

        this._origineCallType = null;
        this._origineCallType_loaded = false;
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
	 * Return the CallType's rendererTheme.
	 *
	 * @method rendererTheme
	 */
	rendererTheme() {
		return this._rendererTheme;
	}

	/**
	 * Load the CallType's rendererTheme.
	 *
	 * @method loadRendererTheme
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadRendererTheme(successCallback : Function, failCallback : Function) {
		if(! this._rendererTheme_loaded) {
			var self = this;
			var success : Function = function(rendererTheme) {
				if(!!rendererTheme) {
					self._rendererTheme = rendererTheme;
				}
				self._rendererTheme_loaded = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getUniquelyAssociatedObject(CallType, RendererTheme, success, fail);
		} else {
			if(successCallback != null) {
				successCallback();
			}
		}
	}

    /**
     * Return the CallType's policy.
     *
     * @method policy
     */
    policy() {
        return this._policy;
    }

    /**
     * Load the CallType's policy.
     *
     * @method loadPolicy
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadPolicy(successCallback : Function, failCallback : Function) {
        if(! this._policy_loaded) {
            var self = this;
            var success : Function = function(policy) {
                if(!!policy) {
                    self._policy = policy;
                }
                self._policy_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(CallType, Policy, success, fail);
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

    /**
     * Return the CallType's calls.
     *
     * @method calls
     */
    calls() {
        return this._calls;
    }

    /**
     * Load the CallType's calls.
     *
     * @method loadCalls
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadCalls(successCallback : Function, failCallback : Function) {
        if(! this._calls_loaded) {
            var self = this;
            var success : Function = function(calls) {
                self._calls = calls;
                self._calls_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getAssociatedObjects(CallType, Call, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

    /**
     * Return the original callType if the current object is cloned
     *
     * @method origineCallType
     * @returns {CallType}
     */
    origineCallType() {
        return this._origineCallType;
    }

    /**
     * Load the original CallType if the current object is cloned
     *
     * @method loadOrigineCallType
     * @param successCallback
     * @param failCallback
     */
    loadOrigineCallType(successCallback : Function, failCallback : Function) {
        if ( !this._origineCallType_loaded) {
            var self = this;

            var successLoad = function (callType) {
                self._origineCallType = callType;
                self._origineCallType_loaded = true;

                if (successCallback != null) {
                    successCallback();
                }
            };

            var fail = function (error) {
                if (failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(CallType, CallType, successLoad, fail);
        } else {
            if (successCallback != null) {
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
            if(self._source_loaded && self._renderer_loaded && self._rendererTheme_loaded && self._policy_loaded && self._zone_loaded && self._calls_loaded) {
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
		this.loadRendererTheme(success, fail);
        this.loadPolicy(success, fail);
        this.loadZone(success, fail);
        this.loadCalls(success, fail);
    }

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._source_loaded = false;
		this._policy_loaded = false;
		this._renderer_loaded = false;
		this._rendererTheme_loaded = false;
		this._zone_loaded = false;
        this._calls_loaded = false;
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
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
		};
		return data;
	}

	/**
	 * Check whether the object is complete or not
	 *
	 * A CallType is complete if it has an ID, a name, a source, a renderer, a rendererTheme and a zone.
     * It is not necessary that the zone is complete yet.
	 *
	 * @param successCallback The function to call in case of success.
	 * @param failCallback The function to call in case of failure.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) {
		var self = this;
		var success : Function = function () {
			if (self.isComplete() && !!self.name()) {
				var success:Function = function () {
					if (self._renderer_loaded && self._rendererTheme_loaded && self._source_loaded && self._zone_loaded) {
						self._complete = (!!self.renderer() && self.renderer().isComplete()) && !!self.rendererTheme() && !!self.zone() && (!!self.source() && self.source().isComplete());
						successCallback();
					}
				};

				var fail:Function = function (error) {
					failCallback(error);
				};

                if (self._renderer_loaded && self._rendererTheme_loaded && self._source_loaded && self._zone_loaded) {
                    success();
                }

                if (!self._zone_loaded) {
                    self.loadZone(success, fail);
                }

                if (!self._source_loaded) {
                    self.loadSource(success, fail);
                }

                if (!self._renderer_loaded) {
                    self.loadRenderer(success, fail);
                }

				if (!self._rendererTheme_loaded) {
					self.loadRendererTheme(success, fail);
				}
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
    toCompleteJSONObject(successCallback : Function, failCallback : Function, onlyId : boolean = false) {
        var self = this;

        var success : Function = function() {
            var data = self.toJSONObject();
	        if (onlyId) {
		        data["source"] = (self.source() !== null) ? self.source().getId() : null;
		        data["renderer"] = (self.renderer() !== null) ? self.renderer().getId() : null;
				data["rendererTheme"] = (self.rendererTheme() !== null) ? self.rendererTheme().getId() : null;
		        data["zone"] = (self.zone() !== null) ? self.zone().getId() : null;
		        data["policy"] = (self.policy() !== null) ? self.policy().getId() : null;
	        } else {
		        data["source"] = (self.source() !== null) ? self.source().toJSONObject() : null;
		        data["renderer"] = (self.renderer() !== null) ? self.renderer().toJSONObject() : null;
				data["rendererTheme"] = (self.rendererTheme() !== null) ? self.rendererTheme().toJSONObject() : null;
		        data["zone"] = (self.zone() !== null) ? self.zone().toJSONObject() : null;
                data["policy"] = (self.policy() !== null) ? self.policy().toJSONObject() : null;
	        }

            data["calls"] = self.serializeArray(self.calls(), onlyId);
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
        var self = this;
        var successLoadCall = function () {
            if (self.calls().length > 0) {
                failCallback("You cannot replace a source of CallType owning calls.");
            } else {
                self.associateObject(CallType, Source, sourceId, successCallback, failCallback);
            }
        };

        this.loadCalls(successLoadCall, failCallback);
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
        var self = this;
        var successLoadCall = function () {
            if (self.calls().length > 0) {
                failCallback("You cannot unlink a source of CallType owning calls.");
            } else {
                self.deleteObjectAssociation(CallType, Source, sourceID, successCallback, failCallback);
            }
        };

        this.loadCalls(successLoadCall, failCallback);
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
	 * Set the RendererTheme of the CallType.
	 * As a CallType can only have one RendererTheme, if the value is already set, this method throws an exception: you need first to unset the RendererTheme.
	 * Moreover the given RendererTheme must be created in database.
	 *
	 * @method linkRendererTheme
	 * @param {number} rendererThemeId - The RendererTheme to associate with the CallType.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	linkRendererTheme(rendererThemeId : number, successCallback : Function, failCallback : Function) {
		this.associateObject(CallType, RendererTheme, rendererThemeId, successCallback, failCallback);
	}

	/**
	 * Unset the current RendererTheme from the CallType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A RendererTheme must have been set before using it, else an exception is thrown.
	 *
	 * @method unlinkRendererTheme
	 * @param {number} rendererThemeId - The RendererTheme to dissociate from the CallType.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkRendererTheme(rendererThemeId : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(CallType, RendererTheme, rendererThemeId, successCallback, failCallback);
	}

	/**
	 * Set the Policy of the CallType.
	 * As a CallType can only have one Policy, if the value is already set, this method throws an exception: you need first to unset the Policy.
	 * Moreover the given Policy must be created in database.
	 *
     * @method linkPolicy
	 * @param {number} policyId The policy id of the policy to associate with the CallType.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkPolicy(policyID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(CallType, Policy, policyID, successCallback, failCallback);
	}

	/**
	 * Unset the current Policy from the CallType.
	 * It both sets a null value for the object property and remove the association in database.
	 * A ReceivePolicy must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkPolicy
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkPolicy(policyID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(CallType, Policy, policyID, successCallback, failCallback);
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
     * Set the original CallType if current object is a clone
     *
     * @method linkOrigineCallType
     * @param callTypeId
     * @param successCallback
     * @param failCallback
     */
    linkOrigineCallType(callTypeId : number, successCallback : Function, failCallback : Function) {
        this.associateObject(CallType, CallType, callTypeId, successCallback, failCallback);
    }

    /**
     * Unset the original CallType
     *
     * @method unlinkOrigineCallType
     * @param callTypeId
     * @param successCallback
     * @param failCallback
     */
    unlinkOrigineCallType(callTypeId : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(CallType, CallType, callTypeId, successCallback, failCallback);
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

        var self = this;
        var successLoadCalls = function () {
            if (self.calls().length > 0) {
                failCallback("You cannot delete a CallBack which owns some calls. Delete the calls first.");
            } else {
                return ModelItf.deleteObject(CallType, self.getId(), successCallback, failCallback, attemptNumber);
            }
        };

        this.loadCalls(successLoadCalls, failCallback);
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
		return new CallType(jsonObject.name, jsonObject.description, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
	}

    /**
     * Clone a CallType keeping the same Source, the same Renderer and Policy. Zone and Calls are not set.
     *
     * @param successCallback
     * @param failCallback
     */
    clone(successCallback : Function, failCallback : Function) {
        var self = this;
        var successCloneCallType = function (clonedCallType : CallType) {
            var successLinkOrigine = function () {
                clonedCallType._origineCallType = self;
                clonedCallType._origineCallType_loaded = true;

                var isComplete = clonedCallType.isComplete();

                var successLoadAsso = function () {
                    var successLinkPolicy = function () {
                        var successLinkRenderer = function () {
							var successLinkRendererTheme = function () {
								var successLinkSource = function () {
									var successCheckComplete = function () {
										var finalSuccess = function () {
											successCallback(clonedCallType);
										};

										if (clonedCallType.isComplete() != isComplete) {
											clonedCallType.update(finalSuccess, failCallback);
										} else {
											finalSuccess();
										}
									};

									clonedCallType.checkCompleteness(successCheckComplete, failCallback);
								};

								clonedCallType.linkSource(self.source().getId(), successLinkSource, failCallback);
							};

							clonedCallType.linkRendererTheme(self.rendererTheme().getId(), successLinkRendererTheme, failCallback);
                        };

                        clonedCallType.linkRenderer(self.renderer().getId(), successLinkRenderer, failCallback);
                    };

                    clonedCallType.linkPolicy(self.policy().getId(), successLinkPolicy, failCallback);
                };

                self.loadAssociations(successLoadAsso, failCallback);
            };

            clonedCallType.linkOrigineCallType(self.getId(), successLinkOrigine, failCallback);
        };

        super.cloneObject(CallType, successCloneCallType, failCallback);
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