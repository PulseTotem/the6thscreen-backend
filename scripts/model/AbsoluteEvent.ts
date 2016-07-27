/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./RelativeTimeline.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : AbsoluteEvent
 *
 * @class AbsoluteEvent
 * @extends ModelItf
 */
class AbsoluteEvent extends ModelItf {

    /**
     * Name property.
     *
     * @property _name
     * @type string
     */
    private _name : string;

    /**
     * This property describes the beginning date of the event in the timeline
     * 
     * @property _begin
     * @type Date
     */
    private _begin : Date;

    /**
     * This property describes the duration of the event in seconds
     * 
     * @property _duration
     * @type number
     */
    private _duration : number;

    /**
     * RelativeTimeline property
     *
     * @property _relativeTimeline
     * @type RelativeTimeline
     */
    private _relativeTimeline : RelativeTimeline;

    /**
     * Lazy loading for the relativeTimeline property
     *
     * @property _relativeTimeline_loaded
     * @type boolean
     */
    private _relativeTimeline_loaded : boolean;

	/**
	 * AbsoluteTimeline property
	 *
	 * @property _absoluteTimeline
	 * @type AbsoluteTimeline
	 */
	private _absoluteTimeline : AbsoluteTimeline;

	/**
	 * Lazy loading for the absoluteTimeline property
	 *
	 * @property _absoluteTimeline_loaded
	 * @type boolean
	 */
	private _absoluteTimeline_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The AbsoluteEvent's name.
     * @param {number} id - The AbsoluteEvent's ID.
	 * @param {string} createdAt - The AbsoluteEvent's createdAt.
	 * @param {string} updatedAt - The AbsoluteEvent's updatedAt.
     */
    constructor(name : string = "", begin : Date = new Date(), duration : number = 0, id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

        this.setName(name);
        this.setBegin(begin);
        this.setDuration(duration);

	    this._relativeTimeline = null;
	    this._relativeTimeline_loaded = false;

		this._absoluteTimeline = null;
		this._absoluteTimeline_loaded = false;
    }

	/**
	 * Set the AbsoluteEvent's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

    /**
     * Return the AbsoluteEvent's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Set the AbsoluteEvent's begin.
     *
     * @method setBegin
     */
    setBegin(begin : Date) {
        this._begin = begin;
    }

    /**
     * Return the AbsoluteEvent's begin.
     *
     * @method begin
     */
    begin() {
        return this._begin;
    }

    /**
     * Set the AbsoluteEvent's duration.
     *
     * @method setDuration
     */
    setDuration(duration : number) {
        this._duration = duration;
    }

    /**
     * Return the AbsoluteEvent's duration.
     *
     * @method duration
     */
    duration() {
        return this._duration;
    }

	/**
	 * Return the CallType's relativeTimeline.
	 *
	 * @method relativeTimeline
	 */
	relativeTimeline() {
		return this._relativeTimeline;
	}

	/**
	 * Load the AbsoluteEvent's relativeTimeline.
	 *
	 * @method loadRelativeTimeline
	 * @param {Function} successCallback - The relativeTimelineback function when success.
	 * @param {Function} failCallback - The relativeTimelineback function when fail.
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

			this.getUniquelyAssociatedObject(AbsoluteEvent, RelativeTimeline, success, fail);
		} else {
			if(successCallback != null) {
				successCallback();
			}
		}
	}

	/**
	 * Return the AbsoluteTimeline in which the event is stored
	 *
	 * @method absoluteTimeline
	 * @returns {AbsoluteTimeline}
     */
	absoluteTimeline() {
		return this._absoluteTimeline;
	}

	/**
	 * Load the AbsoluteEvent's absoluteTimeline
	 *
	 * @method loadAbsoluteTimeline
	 * @param successCallback
	 * @param failCallback
     */
	loadAbsoluteTimeline(successCallback : Function, failCallback : Function) {
		if (! this._absoluteTimeline_loaded) {
			var self = this;

			var success = function (absoluteTimeline) {
				self._absoluteTimeline = absoluteTimeline;
				self._absoluteTimeline_loaded = true;

				successCallback();
			};

			var fail = function (error) {
				failCallback(error);
			};

			this.getUniquelyAssociatedObject(AbsoluteEvent, AbsoluteTimeline, success, fail);
		} else {
			successCallback();
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
			if(self._relativeTimeline_loaded) {
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

		this.loadRelativeTimeline(success, fail);
	}

	/**
	 * Set the object as desynchronized given the different lazy properties.
	 *
	 * @method desynchronize
	 */
	desynchronize() : void {
		this._relativeTimeline_loaded = false;
	}

	/**
	 * Return a AbsoluteEvent instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
            "begin": this.begin(),
            "duration": this.duration(),
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
		};
		return data;
	}

	/**
	 * Compute the completeness of an AbsoluteEvent.
	 * The completeness is given by the presence of an ID and a name.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) : void {

		var self = this;

		var success : Function = function () {
			if (self.isComplete() && !!self.name()) {
				var success:Function = function () {
					if (self._relativeTimeline_loaded) {
						self._complete = (!!self.relativeTimeline() && self.relativeTimeline().isComplete());
						successCallback();
					}
				};

				var fail:Function = function (error) {
					failCallback(error);
				};

				if (!self._relativeTimeline_loaded) {
					self.loadRelativeTimeline(success, fail);
				} else {
					success();
				}

			} else {
				self._complete = false;
				successCallback();
			}
		};

		super.checkCompleteness(success, failCallback);
	}

	/**
	 * Return a RelativeEvent instance as a JSON Object including associated object.
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
				data["relativeTimeline"] = (self.relativeTimeline() !== null) ? self.relativeTimeline().getId() : null;
			} else {
				data["relativeTimeline"] = (self.relativeTimeline() !== null) ? self.relativeTimeline().toJSONObject() : null;
			}

			successCallback(data);
		};

		var fail : Function = function(error) {
			failCallback(error);
		};

		this.loadAssociations(success, fail);
	}

	/**
	 * Set the RelativeTimeline of the AbsoluteEvent.
	 *
	 * @method linkRelativeTimeline
	 * @param {RelativeTimeline} s The RelativeTimeline to associate with the AbsoluteEvent.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	linkRelativeTimeline(sourceId : number, successCallback : Function, failCallback : Function) {
		this.associateObject(AbsoluteEvent, RelativeTimeline, sourceId, successCallback, failCallback);
	}

	/**
	 * Unset the current RelativeTimeline from the AbsoluteEvent.
	 * It both sets a null value for the object property and remove the association in database.
	 * A RelativeTimeline must have been set before using it, else an exception is thrown.
	 *
	 * @method unlinkRelativeTimeline
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkRelativeTimeline(sourceID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(AbsoluteEvent, RelativeTimeline, sourceID, successCallback, failCallback);
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
        this.createObject(AbsoluteEvent, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(AbsoluteEvent, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(AbsoluteEvent, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return ModelItf.deleteObject(AbsoluteEvent, this.getId(), successCallback, failCallback, attemptNumber);
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
        return this.allObjects(AbsoluteEvent, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return an AbsoluteEvent instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Call} The model instance.
	 */
	static parseJSON(jsonString : string) : AbsoluteEvent {
		return AbsoluteEvent.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return an AbsoluteEvent instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Call} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : AbsoluteEvent {
		return new AbsoluteEvent(jsonObject.name, jsonObject.begin, jsonObject.duration, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
	}

	/**
	 * Determine if the object is an orphan or not. Sucesscallback return a boolean.
	 * @param successCallback
	 * @param failCallback
	 */
	isOrphan(successCallback, failCallback) {
		var self = this;

		var successLoadAbsoluteTL = function () {
			var result = (self.absoluteTimeline() == null);
			successCallback(result);
		};

		this.loadAbsoluteTimeline(successLoadAbsoluteTL, failCallback);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "AbsoluteEvents";
    }
}