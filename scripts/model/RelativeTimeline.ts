/**
 * @author Simon Urli <simon@the6thscreen.fr>
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./RelativeEvent.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : RelativeTimeline
 *
 * @class RelativeTimeline
 * @extends ModelItf
 */
class RelativeTimeline extends ModelItf {

    /**
     * Name property.
     *
     * @property _name
     * @type string
     */
    private _name : string;

    /**
     * AbsoluteEvents property
     *
     * @property _relativeEvents
     * @type Array<AbsoluteEvent>
     */
    private _relativeEvents : Array<RelativeEvent>;

    /**
     * Lazy loading for relativeEvents property
     *
     * @property _relativeEvents_loading
     * @type boolean
     */
    private _relativeEvents_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The RelativeTimeline's name.
     * @param {number} id - The RelativeTimeline's ID.
     */
    constructor(name : string = "", id : number = null, complete : boolean = false) {
        super(id, complete);

        this.setName(name);

	    this._relativeEvents = new Array();
	    this._relativeEvents_loaded = false;
    }

	/**
	 * Set the RelativeTimeline's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

    /**
     * Return the RelativeTimeline's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

	/**
	 * Return the RelativeTimeline's relativeEvents.
	 *
	 * @method relativeEvents
	 * @return {Array<Call>} The RelativeTimeline's relativeEvents.
	 */
	relativeEvents() : Array<RelativeEvent> {
		return this._relativeEvents;
	}

	/**
	 * Load the RelativeTimeline's relativeEvents.
	 *
	 * @method loadRelativeEvents
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadRelativeEvents(successCallback : Function, failCallback : Function) {
		if(! this._relativeEvents_loaded) {
			var self = this;
			var success : Function = function(relativeEvents) {
				self._relativeEvents = relativeEvents;
				self._relativeEvents_loaded = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getAssociatedObjects(RelativeTimeline, RelativeEvent, success, fail);
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
			if(self._relativeEvents_loaded) {
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

		this.loadRelativeEvents(success, fail);
	}

	/**
	 * Set the object as desynchronized given the different lazy properties.
	 *
	 * @method desynchronize
	 */
	desynchronize() : void {
		this._relativeEvents_loaded = false;
	}
	
	/**
	 * Return a RelativeTimeline instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"complete": this.isComplete()
		};
		return data;
	}

	/**
	 * Check completeness of an RelativeTimeline.
	 * The completeness is determined by the presence of a name, an id and the completeness of all relativeEvents.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) : void {
		var self = this;

		var success : Function = function () {
			if (self.isComplete() && !!self.name()) {
				var success:Function = function () {
					if (self._relativeEvents_loaded) {
						self._complete = (self._relativeEvents.length > 0);

						self._relativeEvents.forEach(function (relativeEvent : RelativeEvent) {
							self._complete = self._complete && relativeEvent.isComplete();
						});
						successCallback();
					}
				};

				var fail:Function = function (error) {
					failCallback(error);
				};

				self.loadRelativeEvents(success, fail);
			} else {
				self._complete = false;
				successCallback();
			}
		};
		super.checkCompleteness(success, failCallback);
	}

	/**
	 * Return an RelativeTimeline instance as a JSON Object including associated object.
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
			data["relativeEvents"] = self.serializeArray(self.relativeEvents(), onlyId);
			successCallback(data);
		};

		var fail : Function = function(error) {
			failCallback(error);
		};

		this.loadAssociations(success, fail);
	}

	/**
	 * Add a new RelativeEvent to the RelativeTimeline and associate it in the database.
	 * A RelativeEvent can only be added once.
	 *
	 * @method addRelativeEvent
	 * @param {RelativeEvent} c The RelativeEvent to add inside the RelativeTimeline. It cannot be a null value.
	 * @param {Function} successRelativeEventback - The callback function when success.
	 * @param {Function} failRelativeEventback - The callback function when fail.
	 */
	addRelativeEvent(relativeEventID : number, successRelativeEventback : Function, failRelativeEventback : Function) {
		this.associateObject(RelativeTimeline, RelativeEvent, relativeEventID, successRelativeEventback, failRelativeEventback);
	}

	/**
	 * Remove a RelativeEvent from the RelativeTimeline: the association is removed both in the object and in database.
	 * The RelativeEvent can only be removed if it exists first in the list of associated RelativeEvents, else an exception is thrown.
	 *
	 * @method removeRelativeEvent
	 * @param {RelativeEvent} c The RelativeEvent to remove from that RelativeTimeline
	 * @param {Function} successRelativeEventback - The callback function when success.
	 * @param {Function} failRelativeEventback - The callback function when fail.
	 */
	removeRelativeEvent(relativeEventID : number, successRelativeEventback : Function, failRelativeEventback : Function) {
		this.deleteObjectAssociation(RelativeTimeline, RelativeEvent, relativeEventID, successRelativeEventback, failRelativeEventback);
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
        this.createObject(RelativeTimeline, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(RelativeTimeline, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(RelativeTimeline, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return ModelItf.deleteObject(RelativeTimeline, this.getId(), successCallback, failCallback, attemptNumber);
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
        return this.allObjects(RelativeTimeline, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return a RelativeTimeline instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {RelativeTimeline} The model instance.
	 */
	static parseJSON(jsonString : string) : RelativeTimeline {
		return RelativeTimeline.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a RelativeTimeline instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {RelativeTimeline} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : RelativeTimeline {
		return new RelativeTimeline(jsonObject.name, jsonObject.id, jsonObject.complete);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "RelativeTimelines";
    }
}