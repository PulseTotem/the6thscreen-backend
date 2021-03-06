/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Call.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : RelativeEvent
 *
 * @class RelativeEvent
 * @extends ModelItf
 */
class RelativeEvent extends ModelItf {

    /**
     * Name property.
     *
     * @property _name
     * @type string
     */
    private _name : string;

    /**
     * This property describes the position of the event in the timeline
     * 
     * @property _position
     * @type number
     */
    private _position : number;

    /**
     * This property describes the duration of the event in seconds
     * 
     * @property _duration
     * @type number
     */
    private _duration : number;

    /**
     * Call property
     *
     * @property _call
     * @type Call
     */
    private _call : Call;

    /**
     * Lazy loading for the call property
     *
     * @property _call_loaded
     * @type boolean
     */
    private _call_loaded : boolean;

    /**
     * The origine relativeEvent if the current object is a clone
     *
     * @property _origineRelativeEvent
     * @type RelativeEvent
     */
    private _origineRelativeEvent : RelativeEvent;

    /**
     * Lazy loading for the origineRelativeEvent property
     *
     * @property _origineRelativeEvent_loaded
     * @type boolean
     */
    private _origineRelativeEvent_loaded : boolean;

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
     * Constructor.
     *
     * @constructor
     * @param {string} name - The RelativeEvent's name.
     * @param {number} id - The RelativeEvent's ID.
	 * @param {string} createdAt - The RelativeEvent's createdAt.
	 * @param {string} updatedAt - The RelativeEvent's updatedAt.
     */
    constructor(name : string = "", position : number = 0, duration : number = 0, id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

        this.setName(name);
        this.setPosition(position);
        this.setDuration(duration);

        this._call = null;
        this._call_loaded = false;

        this._origineRelativeEvent = null;
        this._origineRelativeEvent_loaded = false;

        this._relativeTimeline = null;
        this._relativeTimeline_loaded = false;
    }

	/**
	 * Set the RelativeEvent's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

    /**
     * Return the RelativeEvent's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Set the RelativeEvent's position.
     *
     * @method setPosition
     */
    setPosition(position : number) {
        this._position = position;
    }

    /**
     * Return the RelativeEvent's position.
     *
     * @method position
     */
    position() {
        return this._position;
    }

    /**
     * Set the RelativeEvent's duration.
     *
     * @method setDuration
     */
    setDuration(duration : number) {
        this._duration = duration;
    }

    /**
     * Return the RelativeEvent's duration.
     *
     * @method duration
     */
    duration() {
        return this._duration;
    }

    /**
     * Return the CallType's call.
     *
     * @method call
     */
    call() {
        return this._call;
    }

    /**
     * Load the RelativeEvent's call.
     *
     * @method loadCall
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadCall(successCallback : Function, failCallback : Function) {
        if(! this._call_loaded) {
            var self = this;
            var success : Function = function(call) {
                if(!!call) {
                    self._call = call;
                }
                self._call_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(RelativeEvent, Call, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

    /**
     * Return the original relativeEvent if the current object is a clone
     *
     * @method origineRelativeEvent
     * @returns {RelativeEvent}
     */
    origineRelativeEvent() {
        return this._origineRelativeEvent;
    }

    /**
     * Load the origine relativeEvent attribute
     *
     * @method loadOrigineRelativeEvent
     * @param successCallback
     * @param failCallback
     */
    loadOrigineRelativeEvent(successCallback : Function, failCallback : Function) {
        if (! this._origineRelativeEvent_loaded) {
            var self = this;

            var successLoad = function (origineRelativeEvent) {
                self._origineRelativeEvent = origineRelativeEvent;
                self._origineRelativeEvent_loaded = true;

                if (successCallback != null) {
                    successCallback();
                }
            };

            var fail = function (error) {
                if (failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(RelativeEvent, RelativeEvent, successLoad, fail);
        } else {
            if (successCallback != null) {
                successCallback();
            }
        }
    }

    /**
     * Return the relativeTimeline of the event
     *
     * @method relativeTimeline
     * @returns {RelativeTimeline}
     */
    relativeTimeline() {
        return this._relativeTimeline;
    }

    /**
     * Load the relativeTimeline attribute
     *
     * @method loadRelativeTimeline
     * @param successCallback
     * @param failCallback
     */
    loadRelativeTimeline(successCallback : Function, failCallback : Function) {
        if (! this._relativeTimeline_loaded) {
            var self = this;

            var successLoad = function (relativeTimeline) {
                self._relativeTimeline = relativeTimeline;
                self._relativeTimeline_loaded = true;

                successCallback();
            };

            var fail = function (error) {
                failCallback(error);
            };

            this.getUniquelyAssociatedObject(RelativeEvent, RelativeTimeline, successLoad, fail);
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
            if(self._call_loaded) {
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

        this.loadCall(success, fail);
    }

    /**
     * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
     */
    desynchronize() : void {
        this._call_loaded = false;
        this._origineRelativeEvent_loaded = false;
    }


    /**
	 * Return a RelativeEvent instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
            "position": this.position(),
            "duration": this.duration(),
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
		};
		return data;
	}

	/**
	 * Compute the completeness of an RelativeEvent.
	 * The completeness is given by the presence of an ID and a name.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) : void {

		var self = this;

		var success : Function = function () {
            if (self.isComplete() && !!self.name()) {
                var successLoad:Function = function () {
                    if (self._call_loaded) {
                        self._complete = (!!self.call() && self.call().isComplete());
                        successCallback();
                    }
                };

                var fail:Function = function (error) {
                    failCallback(error);
                };

                if (self._call_loaded) {
                    successLoad();
                } else {
                    self.loadCall(successLoad, fail);
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
                data["call"] = (self.call() !== null) ? self.call().getId() : null;
            } else {
                data["call"] = (self.call() !== null) ? self.call().toJSONObject() : null;
            }

            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

    /**
     * Set the Call of the RelativeEvent.
     *
     * @method linkCall
     * @param {Call} s The Call to associate with the RelativeEvent.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    linkCall(sourceId : number, successCallback : Function, failCallback : Function) {
        this.associateObject(RelativeEvent, Call, sourceId, successCallback, failCallback);
    }

    /**
     * Unset the current Call from the RelativeEvent.
     * It both sets a null value for the object property and remove the association in database.
     * A Call must have been set before using it, else an exception is thrown.
     *
     * @method unlinkCall
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    unlinkCall(sourceID : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(RelativeEvent, Call, sourceID, successCallback, failCallback);
    }

    /**
     * Set the origine relativeEvent if the current object is a clone
     *
     * @method linkOrigineRelativeEvent
     * @param relativeEventId
     * @param successCallback
     * @param failCallback
     */
    linkOrigineRelativeEvent(relativeEventId : number, successCallback : Function, failCallback : Function) {
        this.associateObject(RelativeEvent, RelativeEvent, relativeEventId, successCallback, failCallback);
    }

    /**
     * Unset the origine relativeEvent attribute
     *
     * @method unlinkOrigineRelativeEvent
     * @param relativeEventId
     * @param successCallback
     * @param failCallback
     */
    unlinkOrigineRelativeEvent(relativeEventId : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(RelativeEvent, RelativeEvent, relativeEventId, successCallback, failCallback);
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
        this.createObject(RelativeEvent, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(RelativeEvent, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(RelativeEvent, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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

		var fail : Function = function(error) {
			failCallback(error);
		};

		var successLoadCall = function() {
			var successDeleteCall = function() {
				ModelItf.deleteObject(RelativeEvent, self.getId(), successCallback, failCallback, attemptNumber);
			};

			self.call().delete(successDeleteCall, fail);
		};

		this.loadCall(successLoadCall, fail);
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
        return this.allObjects(RelativeEvent, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return an RelativeEvent instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Call} The model instance.
	 */
	static parseJSON(jsonString : string) : RelativeEvent {
		return RelativeEvent.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return an RelativeEvent instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Call} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : RelativeEvent {
		return new RelativeEvent(jsonObject.name, jsonObject.position, jsonObject.duration, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
	}

    /**
     * Clone a RelativeEvent: it clones RelativeEvent information, cloning the Call.
     *
     * @method clone
     * @param modelClass
     * @param successCallback
     * @param failCallback
     */
    clone(successCallback : Function, failCallback : Function, profilInfo : any) {
        Logger.debug("Start cloning RelativeEvent with id "+this.getId());
        var self = this;

        var successCloneRelativeEvent = function (clonedRelativeEvent : RelativeEvent) {
            Logger.debug("Obtained clonedRelativeEvent :"+JSON.stringify(clonedRelativeEvent));

            var successLinkOrigine = function () {
                Logger.debug("Success link relativeEvent to origine");
                clonedRelativeEvent._origineRelativeEvent = self;
                clonedRelativeEvent._origineRelativeEvent_loaded = true;

                var completeRelativeEvent = clonedRelativeEvent.isComplete();

                var successLoadAsso = function () {
                    var successCloneCall = function (clonedCall:Call) {
                        var successLinkCall = function () {

                            var successCheckCompleteness = function () {
                                if (clonedRelativeEvent.isComplete() != completeRelativeEvent) {

                                    var successUpdate = function () {
                                        successCallback(clonedRelativeEvent);
                                    };

                                    clonedRelativeEvent.update(successUpdate, failCallback);
                                } else {
                                    successCallback(clonedRelativeEvent);
                                }
                            };
                            clonedRelativeEvent.desynchronize();
                            clonedRelativeEvent.checkCompleteness(successCheckCompleteness, failCallback);

                        };

                        clonedRelativeEvent.linkCall(clonedCall.getId(), successLinkCall, failCallback);
                    };

                    self.call().clone(successCloneCall, failCallback, profilInfo);
                };

                self.loadAssociations(successLoadAsso, failCallback);
            };
            clonedRelativeEvent.linkOrigineRelativeEvent(self.getId(), successLinkOrigine, failCallback);
        };

        super.cloneObject(RelativeEvent, successCloneRelativeEvent, failCallback);
    }

    /**
     * Determine if the object is an orphan or not. Sucesscallback return a boolean.
     * @param successCallback
     * @param failCallback
     */
    isOrphan(successCallback, failCallback) {
        var self = this;

        var successLoadRelativeTL = function () {
            var result = (self.relativeTimeline() == null);
            successCallback(result);
        };

        this.loadRelativeTimeline(successLoadRelativeTL, failCallback);
    }

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "RelativeEvents";
    }
}