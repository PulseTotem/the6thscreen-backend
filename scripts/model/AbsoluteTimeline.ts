/**
 * @author Simon Urli <simon@the6thscreen.fr>
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./AbsoluteEvent.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : AbsoluteTimeline
 *
 * @class AbsoluteTimeline
 * @extends ModelItf
 */
class AbsoluteTimeline extends ModelItf {

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
     * @property _absoluteEvents
     * @type Array<AbsoluteEvent>
     */
    private _absoluteEvents : Array<AbsoluteEvent>;

    /**
     * Lazy loading for absoluteEvents property
     *
     * @property _absoluteEvents_loading
     * @type boolean
     */
    private _absoluteEvents_loaded : boolean;


    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The AbsoluteTimeline's name.
     * @param {number} id - The AbsoluteTimeline's ID.
	 * @param {string} createdAt - The AbsoluteTimeline's createdAt.
	 * @param {string} updatedAt - The AbsoluteTimeline's updatedAt.
     */
    constructor(name : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

        this.setName(name);

        this._absoluteEvents = new Array();
        this._absoluteEvents_loaded = false;
    }

	/**
	 * Set the AbsoluteTimeline's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

    /**
     * Return the AbsoluteTimeline's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Return the AbsoluteTimeline's absoluteEvents.
     *
     * @method absoluteEvents
     * @return {Array<Call>} The AbsoluteTimeline's absoluteEvents.
     */
    absoluteEvents() : Array<AbsoluteEvent> {
        return this._absoluteEvents;
    }

    /**
     * Load the AbsoluteTimeline's absoluteEvents.
     *
     * @method loadAbsoluteEvents
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadAbsoluteEvents(successCallback : Function, failCallback : Function) {
        if(! this._absoluteEvents_loaded) {
            var self = this;
            var success : Function = function(absoluteEvents) {
                self._absoluteEvents = absoluteEvents;
                self._absoluteEvents_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getAssociatedObjects(AbsoluteTimeline, AbsoluteEvent, success, fail);
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
            if(self._absoluteEvents_loaded) {
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

        this.loadAbsoluteEvents(success, fail);
    }

    /**
     * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
     */
    desynchronize() : void {
        this._absoluteEvents_loaded = false;
    }

	/**
	 * Return a AbsoluteTimeline instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
		};
		return data;
	}

    /**
     * Check completeness of an AbsoluteTimeline.
     * The completeness is determined by the presence of a name, an id and the completeness of all absoluteEvents.
     */
    checkCompleteness(successCallback : Function, failCallback : Function) : void {
        var self = this;

        var success : Function = function () {
            if (self.isComplete() && !!self.name()) {
                var success:Function = function () {
                    if (self._absoluteEvents_loaded) {
                        self._complete = (self._absoluteEvents.length > 0);

                        self._absoluteEvents.forEach(function (absoluteEvent : AbsoluteEvent) {
                            self._complete = self._complete && absoluteEvent.isComplete();
                        });
                        successCallback();
                    }
                };

                var fail:Function = function (error) {
                    failCallback(error);
                };

                if (!self._absoluteEvents_loaded) {
                    self.loadAbsoluteEvents(success, fail);
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
     * Return an AbsoluteTimeline instance as a JSON Object including associated object.
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
            data["absoluteEvents"] = self.serializeArray(self.absoluteEvents(), onlyId);
            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

    /**
     * Add a new AbsoluteEvent to the AbsoluteTimeline and associate it in the database.
     * A AbsoluteEvent can only be added once.
     *
     * @method addAbsoluteEvent
     * @param {AbsoluteEvent} c The AbsoluteEvent to add inside the AbsoluteTimeline. It cannot be a null value.
     * @param {Function} successAbsoluteEventback - The callback function when success.
     * @param {Function} failAbsoluteEventback - The callback function when fail.
     */
    addAbsoluteEvent(absoluteEventID : number, successAbsoluteEventback : Function, failAbsoluteEventback : Function) {
        this.associateObject(AbsoluteTimeline, AbsoluteEvent, absoluteEventID, successAbsoluteEventback, failAbsoluteEventback);
    }

    /**
     * Remove a AbsoluteEvent from the AbsoluteTimeline: the association is removed both in the object and in database.
     * The AbsoluteEvent can only be removed if it exists first in the list of associated AbsoluteEvents, else an exception is thrown.
     *
     * @method removeAbsoluteEvent
     * @param {AbsoluteEvent} c The AbsoluteEvent to remove from that AbsoluteTimeline
     * @param {Function} successAbsoluteEventback - The callback function when success.
     * @param {Function} failAbsoluteEventback - The callback function when fail.
     */
    removeAbsoluteEvent(absoluteEventID : number, successAbsoluteEventback : Function, failAbsoluteEventback : Function) {
        this.deleteObjectAssociation(AbsoluteTimeline, AbsoluteEvent, absoluteEventID, successAbsoluteEventback, failAbsoluteEventback);
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
        this.createObject(AbsoluteTimeline, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(AbsoluteTimeline, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(AbsoluteTimeline, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return ModelItf.deleteObject(AbsoluteTimeline, this.getId(), successCallback, failCallback, attemptNumber);
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
        return this.allObjects(AbsoluteTimeline, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return a AbsoluteTimeline instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {AbsoluteTimeline} The model instance.
	 */
	static parseJSON(jsonString : string) : AbsoluteTimeline {
		return AbsoluteTimeline.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a AbsoluteTimeline instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {AbsoluteTimeline} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : AbsoluteTimeline {
		return new AbsoluteTimeline(jsonObject.name, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "AbsoluteTimelines";
    }
}