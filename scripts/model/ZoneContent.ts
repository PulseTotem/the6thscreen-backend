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
	 * Profils property.
	 *
	 * @property _profils
	 * @type Array<Profil>
	 */
	private _profils : Array<Profil>;

	/**
	 * Lazy loading for Profils property.
	 *
	 * @property _profils_loaded
	 * @type boolean
	 */
	private _profils_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The ZoneContent's name.
     * @param {string} description - The ZoneContent's description.
     * @param {number} id - The ZoneContent's ID.
	 * @param {string} createdAt - The ZoneContent's createdAt.
	 * @param {string} updatedAt - The ZoneContent's updatedAt.
     */
    constructor(name : string = "", description : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

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

		this._profils = new Array<Profil>();
		this._profils_loaded = false;
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
				self._absoluteTimeline_loaded = true;
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

	/**
	 * Return the ZoneContent's relativeTimeline.
	 *
	 * @method relativeTimeline
	 */
	relativeTimeline() {
		return this._relativeTimeline;
	}

	/**
	 * Load the ZoneContent's relativeTimeline.
	 *
	 * @method loadRelativeTimeline
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadRelativeTimeline(successCallback : Function, failCallback : Function) {
		if(! this._relativeTimeline_loaded) {
			var self = this;
			var success : Function = function(relativeTimeline) {
				if(!!relativeTimeline) {
					self._relativeTimeline = relativeTimeline;
				}
				self._relativeTimeline_loaded = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getUniquelyAssociatedObject(ZoneContent, RelativeTimeline, success, fail);
		} else {
			if(successCallback != null) {
				successCallback();
			}
		}
	}

	/**
	 * Return the ZoneContent's profils.
	 *
	 * @method profils
	 */
	profils() {
		return this._profils;
	}

	/**
	 * Load the ZoneContent's profils.
	 *
	 * @method loadProfils
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadProfils(successCallback : Function, failCallback : Function) {
		if(! this._profils_loaded) {
			var self = this;
			var success : Function = function(profils) {
				self._profils = profils;
				self._profils_loaded = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getAssociatedObjects(ZoneContent, Profil, success, fail);
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
            if(self._absoluteTimeline_loaded && self._relativeTimeline_loaded && self._widget_loaded && self._zone_loaded && self._profils_loaded) {
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

        this.loadAbsoluteTimeline(success, fail);
        this.loadRelativeTimeline(success, fail);
        this.loadWidget(success, fail);
        this.loadZone(success, fail);
		this.loadProfils(success, fail);
    }

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._absoluteTimeline_loaded = false;
		this._relativeTimeline_loaded = false;
		this._widget_loaded = false;
		this._zone_loaded = false;
		this._profils_loaded = false;
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
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
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
					if (self._zone_loaded && self._widget_loaded && self._absoluteTimeline_loaded && self._relativeTimeline_loaded) {
						var link : ModelItf = null;
						if (!!self.widget()) {
							link = self.widget();
						} else if (!!self.absoluteTimeline()) {
							link = self.absoluteTimeline();
						} else if (!!self.relativeTimeline()) {
							link = self.relativeTimeline();
						} else {
							self._complete = false;
							successCallback();
						}
						self._complete = (!!self.zone()) && (link.isComplete());
						successCallback();
					}
				};

				var fail:Function = function (error) {
					failCallback(error);
				};

				self.loadZone(success, fail);
				self.loadAbsoluteTimeline(success, fail);
				self.loadRelativeTimeline(success, fail);
				self.loadWidget(success, fail);
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
		        data["zone"] = (self.zone() !== null) ? self.zone().getId() : null;
		        data["widget"] = (self.widget() !== null) ? self.widget().getId() : null;
		        data["absoluteTimeline"] = (self.absoluteTimeline() !== null) ? self.absoluteTimeline().getId() : null;
		        data["relativeTimeline"] = (self.relativeTimeline() !== null) ? self.relativeTimeline().getId() : null;
	        } else {
		        data["zone"] = (self.zone() !== null) ? self.zone().toJSONObject() : null;
		        data["widget"] = (self.widget() !== null) ? self.widget().toJSONObject() : null;
		        data["absoluteTimeline"] = (self.absoluteTimeline() !== null) ? self.absoluteTimeline().toJSONObject() : null;
		        data["relativeTimeline"] = (self.relativeTimeline() !== null) ? self.relativeTimeline().toJSONObject() : null;
	        }

			data["profils"] = self.serializeArray(self.profils(), onlyId);

            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

	/**
	 * Set the Zone of the ZoneContent.
	 *
     * @method linkZone
	 * @param {Zone} zoneID The Zone to associate with the ZoneContent.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkZone(zoneID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(ZoneContent, Zone, zoneID, successCallback, failCallback);
	}

	/**
	 * Unset the current Zone from the ZoneContent.
	 *
     * @method unlinkZone
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkZone(zoneID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(ZoneContent, Zone, zoneID, successCallback, failCallback);
	}

	/**
	 * Set the Widget of the ZoneContent.
	 *
	 * @method linkWidget
	 * @param {number} widgetID The widget ID of the widget to associate with the ZoneContent.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	linkWidget(widgetID : number, successCallback : Function, failCallback : Function) {
		if (this.isComplete()) {
			throw new ModelException("This ZoneContent is already complete ! You cannot link a widget.");
		}
		this.associateObject(ZoneContent, Widget, widgetID, successCallback, failCallback);
	}

	/**
	 * Unset the current Widget from the ZoneContent.
	 *
	 * @method unlinkWidget
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkWidget(widgetID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(ZoneContent, Widget, widgetID, successCallback, failCallback);
	}

	/**
	 * Set the Absolute timeline of the ZoneContent.
	 *
	 * @method linkAbsoluteTimeline
	 * @param {number} absoluteTimelineID The absolute timeline ID of the absolute timeline to associate with the ZoneContent.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	linkAbsoluteTimeline(absoluteTimelineID : number, successCallback : Function, failCallback : Function) {
		if (this.isComplete()) {
			throw new ModelException("This ZoneContent is already complete ! You cannot link an absolute timeline.");
		}
		this.associateObject(ZoneContent, AbsoluteTimeline, absoluteTimelineID, successCallback, failCallback);
	}

	/**
	 * Unset the absolute timeline from the ZoneContent.
	 *
	 * @method unlinkAbsoluteTimeline
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkAbsoluteTimeline(absoluteTimelineID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(ZoneContent, AbsoluteTimeline, absoluteTimelineID, successCallback, failCallback);
	}

	/**
	 * Set the relative timeline of the ZoneContent.
	 *
	 * @method linkRelativeTimeline
	 * @param {number} relativeTimelineID The absolute timeline ID of the absolute timeline to associate with the ZoneContent.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	linkRelativeTimeline(relativeTimelineID : number, successCallback : Function, failCallback : Function) {
		if (this.isComplete()) {
			throw new ModelException("This ZoneContent is already complete ! You cannot link a relative timeline.");
		}
		this.associateObject(ZoneContent, RelativeTimeline, relativeTimelineID, successCallback, failCallback);
	}

	/**
	 * Unset the relative timeline from the ZoneContent.
	 *
	 * @method unlinkRelativeTimeline
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkRelativeTimeline(relativeTimelineID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(ZoneContent, RelativeTimeline, relativeTimelineID, successCallback, failCallback);
	}

	/**
	 * Add a new Profil to the ZoneContent and associate it in the database.
	 * A Profil can only be added once.
	 *
	 * @method addProfil
	 * @param {number} profilId - The Profil Id to add inside the ZoneContent. It cannot be a null value.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	addProfil(profilID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(ZoneContent, Profil, profilID, successCallback, failCallback);
	}

	/**
	 * Remove a Profil from the ZoneContent: the association is removed both in the object and in database.
	 * The Profil can only be removed if it exists first in the list of associated Profils, else an exception is thrown.
	 *
	 * @method removeProfil
	 * @param {number} profilId - The Profil to remove from that ZoneContent
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	removeProfil(profilID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(ZoneContent, Profil, profilID, successCallback, failCallback);
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
		return new ZoneContent(jsonObject.name, jsonObject.description, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
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