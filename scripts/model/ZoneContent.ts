/**
 * @author Simon Urli <simon@the6thscreen.fr>
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Zone.ts" />
/// <reference path="./Widget.ts" />
/// <reference path="./AbsoluteTimeline.ts" />
/// <reference path="./RelativeTimeline.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : ZoneContent
 *
 * @class ZoneContent
 * @extends ModelItf
 */
class ZoneContent extends ModelItf {

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
	 * Widget property
	 *
	 * @property _widget
	 * @type Widget
	 */
	private _widget : Widget;

	/**
	 * Lazy loading for Widget property
	 *
	 * @property _widget_loaded
	 * @type boolean
	 */
	private _widget_loaded : boolean;

	/**
	 * AbsoluteTimeline property
	 *
	 * @property _absoluteTimeline
	 * @type AbsoluteTimeline
	 */
	private _absoluteTimeline : AbsoluteTimeline;

	/**
	 * Lazy loading for AbsoluteTimeline property
	 *
	 * @property _absoluteTimeline_loaded
	 * @type boolean
	 */
	private _absoluteTimeline_loaded : boolean;

	/**
	 * RelativeTimeline property
	 *
	 * @property _relativeTimeline
	 * @type RelativeTimeline
	 */
	private _relativeTimeline : RelativeTimeline;

	/**
	 * Lazy loading for RelativeTimeline property
	 *
	 * @property _relativeTimeline_loaded
	 * @type boolean
	 */
	private _relativeTimeline_loaded : boolean;


    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The ZoneContent's name.
     * @param {string} description - The ZoneContent's description.
     * @param {number} id - The ZoneContent's ID.
     */
    constructor(name : string = "", description : string = "", id : number = null, complete : boolean = false) {
        super(id, complete);

		this.setName(name);
		this.setDescription(description);

	    this._zone = null;
	    this._zone_loaded = false;

	    this._widget = null;
	    this._widget_loaded = false;

	    this._absoluteTimeline = null;
	    this._absoluteTimeline_loaded = false;

	    this._relativeTimeline = null;
	    this._relativeTimeline_loaded = false;
    }

	/**
	 * Set the ZoneContent's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

	/**
	 * Set the ZoneContent's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string) {
		this._description = description;
	}

    /**
     * Return the ZoneContent's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Return the ZoneContent's description.
     *
     * @method description
     */
    description() {
        return this._description;
    }

	/**
	 * Return the ZoneContent's zone.
     *
     * @method zone
	 */
	zone() {
		return this._zone;
	}

    /**
     * Load the ZoneContent's zone.
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

            this.getUniquelyAssociatedObject(ZoneContent, Zone, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

	/**
	 * Return the ZoneContent's widget.
	 *
	 * @method widget
	 */
	widget() {
		return this._widget;
	}

	/**
	 * Load the ZoneContent's widget.
	 *
	 * @method loadWidget
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadWidget(successCallback : Function, failCallback : Function) {
		if(! this._widget_loaded) {
			var self = this;
			var success : Function = function(widget) {
				if(!!widget) {
					self._widget = widget;
				}
				self._widget_loaded = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getUniquelyAssociatedObject(ZoneContent, Widget, success, fail);
		} else {
			if(successCallback != null) {
				successCallback();
			}
		}
	}

	/**
	 * Return the ZoneContent's absoluteTimeline.
	 *
	 * @method absoluteTimeline
	 */
	absoluteTimeline() {
		return this._absoluteTimeline;
	}

	/**
	 * Load the ZoneContent's absoluteTimeline.
	 *
	 * @method loadAbsoluteTimeline
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadAbsoluteTimeline(successCallback : Function, failCallback : Function) {
		if(! this._absoluteTimeline_loaded) {
			var self = this;
			var success : Function = function(absoluteTimeline) {
				if(!!absoluteTimeline) {
					self._absoluteTimeline = absoluteTimeline;
				}
				self._absoluteTimeline = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getUniquelyAssociatedObject(ZoneContent, AbsoluteTimeline, success, fail);
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
            if(self._source_loaded && self._renderer_loaded && self._receive_policy_loaded && self._render_policy_loaded && self._zone_loaded && self._calls_loaded) {
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
        this.loadCalls(success, fail);
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
        this._calls_loaded = false;
	}

	/**
	 * Return a ZoneContent instance as a JSON Object
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
	 * A ZoneContent is complete if it has an ID, a name, a source, a renderer and a zone.
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
     * Return a ZoneContent instance as a JSON Object including associated object.
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
		        data["zone"] = (self.zone() !== null) ? self.zone().getId() : null;
		        data["receivePolicy"] = (self.receivePolicy() !== null) ? self.receivePolicy().getId() : null;
		        data["renderPolicy"] = (self.renderPolicy() !== null) ? self.renderPolicy().getId() : null;
	        } else {
		        data["source"] = (self.source() !== null) ? self.source().toJSONObject() : null;
		        data["renderer"] = (self.renderer() !== null) ? self.renderer().toJSONObject() : null;
		        data["zone"] = (self.zone() !== null) ? self.zone().toJSONObject() : null;
		        data["receivePolicy"] = (self.receivePolicy() !== null) ? self.receivePolicy().toJSONObject() : null;
		        data["renderPolicy"] = (self.renderPolicy() !== null) ? self.renderPolicy().toJSONObject() : null;
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
	 * Set the Source of the ZoneContent.
	 * As a ZoneContent can only have one Source, if the value is already set, this method throws an exception: you need first to unset the Source.
	 * Moreover the given Source must be created in database.
	 *
     * @method linkSource
	 * @param {Source} s The Source to associate with the ZoneContent.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkSource(sourceId : number, successCallback : Function, failCallback : Function) {
		this.associateObject(ZoneContent, Source, sourceId, successCallback, failCallback);
	}

	/**
	 * Unset the current Source from the ZoneContent.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Source must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkSource
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkSource(sourceID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(ZoneContent, Source, sourceID, successCallback, failCallback);
	}

	/**
	 * Set the Renderer of the ZoneContent.
	 * As a ZoneContent can only have one Renderer, if the value is already set, this method throws an exception: you need first to unset the Renderer.
	 * Moreover the given Renderer must be created in database.
	 *
     * @method linkRenderer
	 * @param {Renderer} r The Renderer to associate with the ZoneContent.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkRenderer(rendererID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(ZoneContent, Renderer, rendererID, successCallback, failCallback);
	}

	/**
	 * Unset the current Renderer from the ZoneContent.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Renderer must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkRenderer
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkRenderer(rendererID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(ZoneContent, Renderer, rendererID, successCallback, failCallback);
	}

	/**
	 * Set the ReceivePolicy of the ZoneContent.
	 * As a ZoneContent can only have one ReceivePolicy, if the value is already set, this method throws an exception: you need first to unset the ReceivePolicy.
	 * Moreover the given ReceivePolicy must be created in database.
	 *
     * @method linkReceivePolicy
	 * @param {ReceivePolicy} rp The ReceivePolicy to associate with the ZoneContent.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkReceivePolicy(rpID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(ZoneContent, ReceivePolicy, rpID, successCallback, failCallback);
	}

	/**
	 * Unset the current ReceivePolicy from the ZoneContent.
	 * It both sets a null value for the object property and remove the association in database.
	 * A ReceivePolicy must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkReceivePolicy
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkReceivePolicy(rpID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(ZoneContent, ReceivePolicy, rpID, successCallback, failCallback);
	}

	/**
	 * Set the RenderPolicy of the ZoneContent.
	 * As a ZoneContent can only have one RenderPolicy, if the value is already set, this method throws an exception: you need first to unset the RenderPolicy.
	 * Moreover the given RenderPolicy must be created in database.
	 *
     * @method linkRenderPolicy
	 * @param {RenderPolicy} rp The RenderPolicy to associate with the ZoneContent.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkRenderPolicy(rpID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(ZoneContent, RenderPolicy, rpID, successCallback, failCallback);
	}

	/**
	 * Unset the current RenderPolicy from the ZoneContent.
	 * It both sets a null value for the object property and remove the association in database.
	 * A RenderPolicy must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkRenderPolicy
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkRenderPolicy(rpID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(ZoneContent, RenderPolicy, rpID, successCallback, failCallback);
	}

	/**
	 * Set the Zone of the ZoneContent.
	 * As a ZoneContent can only have one Zone, if the value is already set, this method throws an exception: you need first to unset the Zone.
	 * Moreover the given Zone must be created in database.
	 *
     * @method linkZone
	 * @param {Zone} z The Zone to associate with the ZoneContent.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkZone(zoneID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(ZoneContent, Zone, zoneID, successCallback, failCallback);
	}

	/**
	 * Unset the current Zone from the ZoneContent.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Zone must have been set before using it, else an exception is thrown.
	 *
     * @method unlinkZone
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkZone(zoneID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(ZoneContent, Zone, zoneID, successCallback, failCallback);
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
        this.createObject(ZoneContent, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(ZoneContent, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(ZoneContent, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return ModelItf.deleteObject(ZoneContent, this.getId(), successCallback, failCallback, attemptNumber);
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
        return this.allObjects(ZoneContent, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return a ZoneContent instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {ZoneContent} The model instance.
	 */
	static parseJSON(jsonString : string) : ZoneContent {
		return ZoneContent.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a ZoneContent instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {ZoneContent} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : ZoneContent {
		return new ZoneContent(jsonObject.name, jsonObject.description, jsonObject.id, jsonObject.complete);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "ZoneContents";
    }
}