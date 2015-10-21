/**
 * @author Simon Urli <simon@the6thscreen.fr>
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./RelativeEvent.ts" />
/// <reference path="./TimelineRunner.ts" />
/// <reference path="./SystemTrigger.ts" />
/// <reference path="./UserTrigger.ts" />

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
     * @property _relativeEvents_loaded
     * @type boolean
     */
    private _relativeEvents_loaded : boolean;

	/**
	 * TimelineRunner property
	 *
	 * @property _timelineRunner
	 * @type TimelineRunner
	 */
	private _timelineRunner : TimelineRunner;

	/**
	 * Lazy loading for timelineRunner property
	 *
	 * @property _timelineRunner_loaded
	 * @type boolean
	 */
	private _timelineRunner_loaded : boolean;

	/**
	 * SystemTrigger property
	 *
	 * @property _systemTrigger
	 * @type SystemTrigger
	 */
	private _systemTrigger : SystemTrigger;

	/**
	 * Lazy loading for SystemTrigger property
	 *
	 * @property _systemTrigger_loaded
	 * @type boolean
	 */
	private _systemTrigger_loaded : boolean;

	/**
	 * UserTrigger property
	 *
	 * @property _userTrigger
	 * @type UserTrigger
	 */
	private _userTrigger : UserTrigger;

	/**
	 * Lazy loading for UserTrigger property
	 *
	 * @property _userTrigger_loaded
	 * @type boolean
	 */
	private _userTrigger_loaded : boolean;

	/**
	 * The origine relativeTimeline if the current object is a clone
	 *
	 * @property _origineRelativeTimeline
	 * @type RelativeTimeline
	 */
	private _origineRelativeTimeline : RelativeTimeline;

	/**
	 * Lazy loading for the origine relativeTimeline attribute
	 *
	 * @property _origineRelativeTimeline_loaded
	 * @type boolean
	 */
	private _origineRelativeTimeline_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The RelativeTimeline's name.
     * @param {number} id - The RelativeTimeline's ID.
	 * @param {string} createdAt - The RelativeTimeline's createdAt.
	 * @param {string} updatedAt - The RelativeTimeline's updatedAt.
     */
    constructor(name : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

        this.setName(name);

	    this._relativeEvents = new Array();
	    this._relativeEvents_loaded = false;

	    this._timelineRunner = null;
	    this._timelineRunner_loaded = false;

	    this._systemTrigger = null;
	    this._systemTrigger_loaded = false;

	    this._userTrigger = null;
	    this._userTrigger_loaded = false;

	    this._origineRelativeTimeline = null;
	    this._origineRelativeTimeline_loaded = false;
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

	/**
	 * Return the RelativeTimeline's timelineRunner.
	 *
	 * @method timelineRunner
	 * @returns {TimelineRunner} The RelativeTimeline's timelineRunner
	 */
	timelineRunner() : TimelineRunner {
		return this._timelineRunner;
	}

	/**
	 * Load the RelativeTimeline's timelineRunner.
	 *
	 * @method loadTimelineRunner
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadTimelineRunner(successCallback : Function, failCallback : Function) {
		if(! this._timelineRunner_loaded) {
			var self = this;
			var success : Function = function(timelineRunner) {
				if(!!timelineRunner) {
					self._timelineRunner = timelineRunner;
				}
				self._timelineRunner_loaded = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getUniquelyAssociatedObject(RelativeTimeline, TimelineRunner, success, fail);
		} else {
			if(successCallback != null) {
				successCallback();
			}
		}
	}

	/**
	 * Return the RelativeTimeline's systemTrigger.
	 *
	 * @method systemTrigger
	 * @returns {SystemTrigger} The RelativeTimeline's systemTrigger
	 */
	systemTrigger() : SystemTrigger {
		return this._systemTrigger;
	}

	/**
	 * Load the RelativeTimeline's systemTrigger.
	 *
	 * @method loadSystemTrigger
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadSystemTrigger(successCallback : Function, failCallback : Function) {
		if(! this._systemTrigger_loaded) {
			var self = this;
			var success : Function = function(systemTrigger) {
				if(!!systemTrigger) {
					self._systemTrigger = systemTrigger;
				}
				self._systemTrigger_loaded = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getUniquelyAssociatedObject(RelativeTimeline, SystemTrigger, success, fail);
		} else {
			if(successCallback != null) {
				successCallback();
			}
		}
	}

	/**
	 * Return the RelativeTimeline's userTrigger.
	 *
	 * @method userTrigger
	 * @returns {UserTrigger} The RelativeTimeline's userTrigger
	 */
	userTrigger() : UserTrigger {
		return this._userTrigger;
	}

	/**
	 * Load the RelativeTimeline's userTrigger.
	 *
	 * @method loadUserTrigger
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadUserTrigger(successCallback : Function, failCallback : Function) {
		if(! this._userTrigger_loaded) {
			var self = this;
			var success : Function = function(userTrigger) {
				if(!!userTrigger) {
					self._userTrigger = userTrigger;
				}
				self._userTrigger_loaded = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getUniquelyAssociatedObject(RelativeTimeline, UserTrigger, success, fail);
		} else {
			if(successCallback != null) {
				successCallback();
			}
		}
	}

	/**
	 * Return the origine relativeTimeline if the current object is a clone
	 *
	 * @method origineRelativeTimeline
	 * @returns {RelativeTimeline}
	 */
	origineRelativeTimeline() {
		return this._origineRelativeTimeline;
	}

	/**
	 * Lazy loading for the origine relativeTimeline attribute
	 *
	 * @method loadOrigineRelativeTimeline
	 * @param successCallback
	 * @param failCallback
	 */
	loadOrigineRelativeTimeline(successCallback : Function, failCallback : Function) {
		if (! this._origineRelativeTimeline_loaded) {
			var self = this;

			var successLoad = function (origineRelativeTimeline) {
				self._origineRelativeTimeline = origineRelativeTimeline;
				self._origineRelativeTimeline_loaded = true;

				if (successCallback != null) {
					successCallback();
				}
			};

			var fail = function (error) {
				if (failCallback != null) {
					failCallback(error);
				}
			};

			this.getUniquelyAssociatedObject(RelativeTimeline, RelativeTimeline, successLoad, fail);
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
			if(self._relativeEvents_loaded && self._timelineRunner_loaded && self._systemTrigger_loaded && self._userTrigger_loaded) {
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
		this.loadTimelineRunner(success, fail);
		this.loadSystemTrigger(success, fail);
		this.loadUserTrigger(success, fail);
	}

	/**
	 * Set the object as desynchronized given the different lazy properties.
	 *
	 * @method desynchronize
	 */
	desynchronize() : void {
		this._relativeEvents_loaded = false;
		this._timelineRunner_loaded = false;
		this._userTrigger_loaded = false;
		this._systemTrigger_loaded = false;
		this._origineRelativeTimeline_loaded = false;
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
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
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
				var successLoad:Function = function () {
					if (self._relativeEvents_loaded && self._systemTrigger_loaded && self._timelineRunner_loaded) {
						self._complete = (self._relativeEvents.length > 0) && self._systemTrigger != null && self._timelineRunner != null && self._systemTrigger.isComplete() && self._timelineRunner.isComplete();

						self._relativeEvents.forEach(function (relativeEvent : RelativeEvent) {
							self._complete = self._complete && relativeEvent.isComplete();
						});
						successCallback();
					}
				};

				var fail:Function = function (error) {
					failCallback(error);
				};

				if (self._relativeEvents_loaded && self._systemTrigger_loaded && self._timelineRunner_loaded) {
					successLoad();
				}

				if (!self._relativeEvents_loaded) {
					self.loadRelativeEvents(successLoad, fail);
				}

				if (!self._timelineRunner_loaded) {
					self.loadTimelineRunner(successLoad, fail);
				}

				if (!self._systemTrigger_loaded) {
					self.loadSystemTrigger(successLoad, fail);
				}

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
			if (onlyId) {
				data["systemTrigger"] = (self.systemTrigger() !== null) ? self.systemTrigger().getId() : null;
				data["userTrigger"] = (self.userTrigger() !== null) ? self.userTrigger().getId() : null;
				data["timelineRunner"] = (self.timelineRunner() !== null) ? self.timelineRunner().getId() : null;
			} else {
				data["systemTrigger"] = (self.systemTrigger() !== null) ? self.systemTrigger().toJSONObject() : null;
				data["userTrigger"] = (self.userTrigger() !== null) ? self.userTrigger().toJSONObject() : null;
				data["timelineRunner"] = (self.timelineRunner() !== null) ? self.timelineRunner().toJSONObject() : null;
			}

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
	 * Set the TimelineRunner of the RelativeTimeline.
	 *
	 * @method linkTimelineRunner
	 * @param {TimelineRunner} it The TimelineRunner to associate with the RelativeTimeline.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	linkTimelineRunner(runnerID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(RelativeTimeline, TimelineRunner, runnerID, successCallback, failCallback);
	}

	/**
	 * Unset the current TimelineRunner from the RelativeTimeline.
	 *
	 * @method unlinkTimelineRunner
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkTimelineRunner(runnerID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(RelativeTimeline, TimelineRunner, runnerID, successCallback, failCallback);
	}

	/**
	 * Set the UserTrigger of the RelativeTimeline.
	 *
	 * @method linkUserTrigger
	 * @param {UserTrigger} it The UserTrigger to associate with the RelativeTimeline.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	linkUserTrigger(runnerID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(RelativeTimeline, UserTrigger, runnerID, successCallback, failCallback);
	}

	/**
	 * Unset the current UserTrigger from the RelativeTimeline.
	 *
	 * @method unlinkUserTrigger
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkUserTrigger(runnerID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(RelativeTimeline, UserTrigger, runnerID, successCallback, failCallback);
	}

	/**
	 * Set the SystemTrigger of the RelativeTimeline.
	 *
	 * @method linkSystemTrigger
	 * @param {SystemTrigger} it The SystemTrigger to associate with the RelativeTimeline.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	linkSystemTrigger(runnerID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(RelativeTimeline, SystemTrigger, runnerID, successCallback, failCallback);
	}

	/**
	 * Unset the current SystemTrigger from the RelativeTimeline.
	 *
	 * @method unlinkSystemTrigger
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkSystemTrigger(runnerID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(RelativeTimeline, SystemTrigger, runnerID, successCallback, failCallback);
	}

	/**
	 * Set the origine relativeTimeline if the current object is a clone
	 *
	 * @method linkOrigineRelativeTimeline
	 * @param relativeTLID
	 * @param successCallback
	 * @param failCallback
	 */
	linkOrigineRelativeTimeline(relativeTLID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(RelativeTimeline, RelativeTimeline, relativeTLID, successCallback, failCallback);
	}

	/**
	 * Unset the origine relativeTimeline attribute
	 *
	 * @method unlinkOrigineRelativeTimeline
	 * @param relativeTLID
	 * @param successCallback
	 * @param failCallback
	 */
	unlinkOrigineRelativeTimeline(relativeTLID : number, successCallback: Function, failCallback : Function) {
		this.deleteObjectAssociation(RelativeTimeline, RelativeTimeline, relativeTLID, successCallback, failCallback);
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
		var self = this;

		var fail : Function = function(error) {
			failCallback(error);
		};

		var successLoadRelativeEvents = function() {

			if(self.relativeEvents().length > 0) {
				var nbDeletedRelEvents = 0;
				var nbTotal = self.relativeEvents().length;

				self.relativeEvents().forEach(function (relativeEvent) {

					var successDeleteRelEvent = function () {
						nbDeletedRelEvents++;

						if(nbDeletedRelEvents == nbTotal) {
							ModelItf.deleteObject(RelativeTimeline, self.getId(), successCallback, failCallback, attemptNumber);
						}
					}

					relativeEvent.delete(successDeleteRelEvent, fail);
				});
			} else {
				ModelItf.deleteObject(RelativeTimeline, self.getId(), successCallback, failCallback, attemptNumber);
			}
		};

		this.loadRelativeEvents(successLoadRelativeEvents, fail);
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
		return new RelativeTimeline(jsonObject.name, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
	}

	/**
	 * Clone a RelativeTimeline: it clones RelativeTL information, keeping the same TimelineRunner and User/System Triggers, but cloning the RelativeEvents.
	 *
	 * @method clone
	 * @param modelClass
	 * @param successCallback
	 * @param failCallback
	 */
	clone(successCallback : Function, failCallback : Function, profilInfo : any) {
		Logger.debug("Start cloning RelativeTimeline with id "+this.getId());

		var self = this;

		var successCloneRelativeTL = function (clonedRelativeTL : RelativeTimeline) {
			Logger.debug("Obtained clonedRelativeTL :"+JSON.stringify(clonedRelativeTL));

			var successLinkOrigine = function () {
				clonedRelativeTL._origineRelativeTimeline = self;
				clonedRelativeTL._origineRelativeTimeline_loaded = true;

				var completeRelativeTL = clonedRelativeTL.isComplete();

				var successLoadAssociations = function () {

					var successAssoSystemTrigger = function () {

						var successAssoUserTrigger = function () {

							var successAssoTLRunner = function () {
								var nbRelativeEvent = self.relativeEvents().length;
								var counterRelativeEvent = 0;

								var successCloneRelativeEvent = function (clonedRelativeEvent:RelativeEvent) {

									var successAssoRelativeEvent = function () {
										counterRelativeEvent++;

										if (counterRelativeEvent == nbRelativeEvent) {

											var successCheckCompleteness = function () {
												if (clonedRelativeTL.isComplete() != completeRelativeTL) {

													var successUpdate = function () {
														successCallback(clonedRelativeTL);
													};

													clonedRelativeTL.update(successUpdate, failCallback);
												} else {
													successCallback(clonedRelativeTL);
												}
											};
											clonedRelativeTL.desynchronize();
											clonedRelativeTL.checkCompleteness(successCheckCompleteness, failCallback);
										}
									};

									clonedRelativeTL.addRelativeEvent(clonedRelativeEvent.getId(), successAssoRelativeEvent, failCallback);
								};

								self.relativeEvents().forEach(function (relativeEvent:RelativeEvent) {
									relativeEvent.clone(successCloneRelativeEvent, failCallback, profilInfo);
								});
							};

							clonedRelativeTL.linkTimelineRunner(self.timelineRunner().getId(), successAssoTLRunner, failCallback);
						};

						clonedRelativeTL.linkUserTrigger(self.userTrigger().getId(), successAssoUserTrigger, failCallback);
					};

					clonedRelativeTL.linkSystemTrigger(self.systemTrigger().getId(), successAssoSystemTrigger, failCallback);
				};

				self.loadAssociations(successLoadAssociations, failCallback);
			};

			clonedRelativeTL.linkOrigineRelativeTimeline(self.getId(), successLinkOrigine, failCallback);
		};

		super.cloneObject(RelativeTimeline, successCloneRelativeTL, failCallback);
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