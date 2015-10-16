/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Behaviour.ts" />
/// <reference path="./CallType.ts" />
/// <reference path="./ZoneContent.ts" />

/// <reference path="../customizedTypes/Percentage.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : Zone
 *
 * @class Zone
 * @extends ModelItf
 */
class Zone extends ModelItf {

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
     * Width property.
     *
     * @property _width
     * @type Percentage
     */
    private _width : Percentage;

	/**
	 * Height property.
	 *
	 * @property _height
	 * @type Percentage
	 */
	private _height : Percentage;

	/**
	 * PositionFromTop property.
	 *
	 * @property _position_from_top
	 * @type Percentage
	 */
	private _position_from_top : Percentage;

	/**
	 * PositionFromLeft property.
	 *
	 * @property _position_from_left
	 * @type Percentage
	 */
	private _position_from_left : Percentage;

	/**
	 * Behaviour property.
	 *
	 * @property _behaviour
	 * @type Behaviour
	 */
	private _behaviour : Behaviour;

	/**
	 * Lazy loading for behaviour.
	 *
	 * @property _behaviour_loaded
	 * @type boolean
	 */
	private _behaviour_loaded : boolean;

	/**
	 * CallTypes property.
	 *
	 * @property _callTypes
	 * @type Array<CallType>
	 */
	private _callTypes : Array<CallType>;

	/**
	 * Lazy loading for _callTypes property.
	 *
	 * @property _callTypes_loaded
	 * @type boolean
	 */
	private _callTypes_loaded : boolean;

	/**
	 * ZoneContents property.
	 *
	 * @property _zoneContents
	 * @type Array<ZoneContent>
	 */
	private _zoneContents : Array<ZoneContent>;

	/**
	 * Lazy loading for _zoneContents property.
	 *
	 * @property _zoneContents_loaded
	 * @type boolean
	 */
	private _zoneContents_loaded : boolean;

	/**
	 * Theme property.
	 *
	 * @property _theme
	 * @type ThemeZone
	 */
	private _theme : ThemeZone;

	/**
	 * Lazy loading for the Theme property
	 *
	 * @property _theme_loaded
	 * @type boolean
	 */
	private _theme_loaded : boolean;

	/**
	 * Original zone if current object is a clone
	 *
	 * @property _origineZone
	 * @type Zone
	 */
	private _origineZone : Zone;

	/**
	 * Lazy loading for the OrigineZone property
	 *
	 * @property _origineZone_loaded
	 * @type boolean
	 */
	private _origineZone_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Zone's name.
     * @param {string} description - The Zone's description.
     * @param {string} position - The Zone's position.
     * @param {number} id - The Zone's ID.
	 * @param {string} createdAt - The Zone's createdAt.
	 * @param {string} updatedAt - The Zone's updatedAt.
     */
    constructor(name : string = "", description : string = "", width : number = 0, height : number = 0, positionFromTop : number = 0, positionFromLeft : number = 0, id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

        this.setName(name);
	    this.setDescription(description);
	    this.setWidth(width);
	    this.setHeight(height);
	    this.setPositionFromTop(positionFromTop);
	    this.setPositionFromLeft(positionFromLeft);

	    this._behaviour = null;
	    this._behaviour_loaded = false;

	    this._callTypes = null;
	    this._callTypes_loaded = false;

		this._zoneContents = null;
		this._zoneContents_loaded = false;

	    this._theme = null;
	    this._theme_loaded = false;

	    this._origineZone = null;
	    this._origineZone_loaded = false;
    }

	/**
	 * Set the Zone's name
     *
     * @method setName
	 * @param name A new name
	 */
	setName(name : string) : void {
		this._name = name;
	}

	/**
	 * Set the Zone's description
     *
     * @method setDescription
	 * @param description a new description
	 */
	setDescription(description : string) : void {
		this._description = description;
	}

	/**
	 * Set the Zone's width
     *
     * @method setWidth
	 * @param width a new width
	 */
	setWidth(width : number) : void {
		this._width = new Percentage(width);
	}

	/**
	 * Set the Zone's height
     *
     * @method setHeight
	 * @param height a new height
	 */
	setHeight(height : number) : void {
		this._height = new Percentage(height);
	}

	/**
	 * Set the Zone's positionFromTop
     *
     * @method setPositionFromTop
	 * @param positionFromTop a new positionFromTop
	 */
	setPositionFromTop(positionFromTop : number) : void {
		this._position_from_top = new Percentage(positionFromTop);
	}

	/**
	 * Set the Zone's positionFromLeft
     *
     * @method setPositionFromLeft
	 * @param positionFromTop a new positionFromTop
	 */
	setPositionFromLeft(positionFromLeft : number) : void {
		this._position_from_left = new Percentage(positionFromLeft);
	}

    /**
     * Return the Zone's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Return the Zone's description.
     *
     * @method description
     */
    description() {
        return this._description;
    }

	/**
	 * Return the Zone's width
     *
     * @method width
	 */
    width() {
		return this._width.value();
    }

	/**
	 * Return the Zone's height
     *
     * @method height
	 */
	height() {
		return this._height.value();
	}

	/**
	 * Return the Zone's positionFromTop
     *
     * @method positionFromTop
	 */
	positionFromTop() {
		return this._position_from_top.value();
	}

	/**
	 * Return the Zone's positionFromLeft
     *
     * @method positionFromLeft
	 */
	positionFromLeft() {
		return this._position_from_left.value();
	}

	/**
	 * Return the Zone's behaviour.
	 *
	 * @method behaviour
	 */
	behaviour() {
		return this._behaviour;
	}

    /**
     * Load the Zone's behaviour.
     *
     * @method loadBehaviour
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadBehaviour(successCallback : Function, failCallback : Function) {
        if(! this._behaviour_loaded) {
            var self = this;
            var success : Function = function(behaviour) {
                if(!!behaviour) {
                    self._behaviour = behaviour;
                }
                self._behaviour_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(Zone, Behaviour, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

	/**
	 * Return the CallTypes owned by the Zone.
	 *
	 * @method callTypes
	 */
	callTypes() {
		return this._callTypes;
	}

	/**
	 * Load the CallTypes owned by the Zone.
	 *
	 * @method loadCallTypes
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadCallTypes(successCallback : Function, failCallback : Function) {
		if(! this._callTypes_loaded) {
			var self = this;
			var success : Function = function(callTypes) {
				self._callTypes = callTypes;
				self._callTypes_loaded = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getAssociatedObjects(Zone, CallType, success, fail);
		} else {
			if(successCallback != null) {
				successCallback();
			}
		}
	}

	/**
	 * Return the ZoneContents owned by the Zone.
	 *
	 * @method zoneContents
	 */
	zoneContents() {
		return this._zoneContents;
	}

	/**
	 * Load the ZoneContents owned by the Zone.
	 *
	 * @method loadZoneContents
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadZoneContents(successCallback : Function, failCallback : Function) {
		if(! this._zoneContents_loaded) {
			var self = this;
			var success : Function = function(zoneContents) {
				self._zoneContents = zoneContents;
				self._zoneContents_loaded = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getAssociatedObjects(Zone, ZoneContent, success, fail);
		} else {
			if(successCallback != null) {
				successCallback();
			}
		}
	}

	/**
	 * Return the Zone's theme.
	 *
	 * @method theme
	 */
	theme() {
		return this._theme;
	}

	/**
	 * Load the Zone's theme.
	 *
	 * @method loadTheme
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadTheme(successCallback : Function, failCallback : Function) {
		if(! this._theme_loaded) {
			var self = this;
			var success : Function = function(theme) {
				self._theme = theme;
				self._theme_loaded = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getUniquelyAssociatedObject(Zone, ThemeZone, success, fail);
		} else {
			if(successCallback != null) {
				successCallback();
			}
		}
	}

	/**
	 * Return the original zone if the current object is a clone
	 *
	 * @method origineZone
	 * @returns {Zone}
	 */
	origineZone() {
		return this._origineZone;
	}

	/**
	 * Load the original zone if the current object is a clone
	 *
	 * @param successCallback
	 * @param failCallback
	 */
	loadOrigineZone(successCallback : Function, failCallback : Function) {
		if (! this._origineZone_loaded) {
			var self = this;

			var successLoad = function (zone) {
				self._origineZone = zone;
				self._origineZone_loaded = true;

				if (successCallback != null) {
					successCallback();
				}
			};

			var fail = function (error) {
				if (failCallback != null) {
					failCallback(error);
				}
			};


			this.getUniquelyAssociatedObject(Zone, Zone, successLoad, fail);
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
            if(self._behaviour_loaded && self._callTypes_loaded && self._zoneContents_loaded && self._theme_loaded) {
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

        this.loadBehaviour(success, fail);
	    this.loadCallTypes(success, fail);
		this.loadZoneContents(success, fail);
	    this.loadTheme(success, fail);
    }

	/**
	 * Set the object as desynchronized given the different lazy properties.
	 *
	 * @method desynchronize
	 */
	desynchronize() : void {
		this._behaviour_loaded = false;
		this._callTypes_loaded = false;
		this._zoneContents_loaded = false;
		this._theme_loaded = false;
		this._origineZone_loaded = false;
	}


	/**
	 * Return a Renderer instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"description": this.description(),
			"width": this.width(),
			"height": this.height(),
			"positionFromTop": this.positionFromTop(),
			"positionFromLeft": this.positionFromLeft(),
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
		};
		return data;
	}

	/**
	 * Check whether the object is complete or not
	 *
	 * // TODO: check that with user POV
	 * A Zone is complete if it has an ID, a name, and a behaviour (we assume that it always has a width, height, positionFromTop / positionFromLeft as they are Percentage).
	 *
	 * @param successCallback The function to call in case of success.
	 * @param failCallback The function to call in case of failure.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) {
		var self = this;

		var success : Function = function () {
			if (self.isComplete() && !!self.name()) {

				var success:Function = function () {
					self._complete = (!!self.behaviour() && self.behaviour().isComplete());
					successCallback();
				};

				var fail:Function = function (error) {
					failCallback(error);
				};

				self.loadBehaviour(success, fail);
			} else {
				self._complete = false;
				successCallback();
			}
		}

		super.checkCompleteness(success, failCallback);
	}

    /**
     * Return a User instance as a JSON Object including associated object.
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
		        data["behaviour"] = (self.behaviour() !== null) ? self.behaviour().getId() : null;
		        data["theme"] = (self.theme() !== null) ? self.theme().getId() : null;
	        } else {
		        data["behaviour"] = (self.behaviour() !== null) ? self.behaviour().toJSONObject() : null;
		        data["theme"] = (self.theme() !== null) ? self.theme().toJSONObject() : null;
	        }
            data["callTypes"] = self.serializeArray(self.callTypes(), onlyId);
			data["zoneContents"] = self.serializeArray(self.zoneContents(), onlyId);

            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

	/**
	 * Set the Behaviour of the Zone.
	 * As a Zone can only have one Behaviour, if the value is already set, this method throws an exception: you need first to unset the Behaviour.
	 * Moreover the given type must be created in database.
	 *
	 * @method linkBehaviour
	 * @param {Behaviour} beha The Behaviour to associate with the Zone.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	linkBehaviour(behaID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(Zone, Behaviour, behaID, successCallback, failCallback);
	}

	/**
	 * Unset the current Behaviour from the Zone.
	 * It both sets a null value for the object property and remove the association in database.
	 * A Behaviour must have been set before using it, else an exception is thrown.
	 *
	 * @method unlinkBehaviour
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkBehaviour(behaID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(Zone, Behaviour, behaID, successCallback, failCallback);
	}

	/**
	 * Add a new CallType to the Zone and associate it in the database.
	 * A CallType can only be added once.
	 *
	 * @method addCallType
	 * @param {CallType} ct The CallType to link with the Zone. It cannot be a null value.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	addCallType(ctID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(Zone, CallType, ctID, successCallback, failCallback);
	}

	/**
	 * Remove a CallType from the Zone: the association is removed both in the object and in database.
	 * The CallType can only be removed if it exists first in the list of associated CallTypes, else an exception is thrown.
	 *
	 * @method removeCallType
	 * @param {CallType} ct The CallType to remove from that Zone
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	removeCallType(ctID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(Zone, CallType, ctID, successCallback, failCallback);
	}

	/**
	 * Add a new ZoneContent to the Zone and associate it in the database.
	 * A ZoneContent can only be added once.
	 *
	 * @method addZoneContent
	 * @param {ZoneContent} zcID The ZoneContent's id to link with the Zone. It cannot be a null value.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	addZoneContent(zcID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(Zone, ZoneContent, zcID, successCallback, failCallback);
	}

	/**
	 * Remove a ZoneContent from the Zone: the association is removed both in the object and in database.
	 * The ZoneContent can only be removed if it exists first in the list of associated ZoneContents, else an exception is thrown.
	 *
	 * @method removeZoneContent
	 * @param {ZoneContent} zcID The ZoneContent to remove from that Zone
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	removeZoneContent(zcID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(Zone, ZoneContent, zcID, successCallback, failCallback);
	}

	/**
	 * Set the Theme of the Zone.
	 *
	 * @method linkTheme
	 * @param {ThemeZone} it The Theme to associate with the Zone.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	linkTheme(themeZoneID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(Zone, ThemeZone, themeZoneID, successCallback, failCallback);
	}

	/**
	 * Unset the current Theme from the Zone.
	 *
	 * @method unlinkTheme
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkTheme(themeZoneID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(Zone, ThemeZone, themeZoneID, successCallback, failCallback);
	}

	/**
	 * Set the origine zone of the cloned object
	 * @param origineZoneId
	 * @param successCallback
	 * @param failCallback
	 */
	linkOrigineZone(origineZoneId : number, successCallback : Function, failCallback : Function) {
		this.associateObject(Zone, Zone, origineZoneId, successCallback, failCallback);
	}

	/**
	 * Unset the origine zone property
	 * @param origineZoneId
	 * @param successCallback
	 * @param failCallback
	 */
	unlinkOrigineZone(origineZoneId : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(Zone, Zone, origineZoneId, successCallback, failCallback);
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
        this.createObject(Zone, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(Zone, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(Zone, this.toJSONObject(), successCallback, failCallback, attemptNumber);
    }

    /**
     * Delete in database the Zone with current id.
     * This method also deletes all the containing CallTypes of the Zone.
     * If the Zone contains some ZoneContents it fails with a message.
     *
     * @method delete
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    delete(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
	    var self = this;

	    var successLoadZone : Function = function () {
		    if (self.zoneContents().length > 0) {
			    failCallback("You can't delete a zone containing some zone contents.");
		    } else {
			    var sizeCT = self.callTypes().length;
			    var deleted = 0;

			    var successDeleteCT:Function = function () {
				    deleted++;

				    if (deleted == sizeCT) {
					    ModelItf.deleteObject(Zone, self.getId(), successCallback, failCallback, attemptNumber);
				    }
			    };

			    if (sizeCT == 0) {
				    deleted = -1;
				    successDeleteCT();
			    }

			    for (var ctIndex in self.callTypes()) {
				    var ct:CallType = self.callTypes()[ctIndex];

				    ct.delete(successDeleteCT, failCallback);
			    }
		    }
	    };

	    this.loadAssociations(successLoadZone, failCallback);
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
        return this.allObjects(Zone, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return a Zone instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Zone} The model instance.
	 */
	static parseJSON(jsonString : string) : Zone {
		return Zone.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a Zone instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Zone} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : Zone {
		return new Zone(jsonObject.name, jsonObject.description, jsonObject.width, jsonObject.height, jsonObject.positionFromTop, jsonObject.positionFromLeft, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
	}

	/**
	 * Clone a Zone keeping the same Theme, the same Behaviour, but cloning CallTypes. ZoneContents are cloned inside Profil.
	 *
	 * @param modelClass
	 * @param successCallback
	 * @param failCallback
	 */
	clone(successCallback : Function, failCallback : Function) {
		var self = this;

		var successCloneZone = function (clonedZone : Zone) {
			var successOrigineZone = function () {
				clonedZone._origineZone = self;
				clonedZone._origineZone_loaded = true;

				var successLoadAsso = function () {
					var successLinkBehaviour = function () {
						var successLinkTheme = function () {
							var callTypesSize = self.callTypes().length;
							var callTypeCounter = 0;

							var successCloneCallType = function (clonedCallType : CallType) {

								var successLinkCallType = function () {
									callTypeCounter++;

									if (callTypeCounter >= callTypesSize) {
										successCallback(clonedZone);
									}
								};

								clonedZone.addCallType(clonedCallType.getId(), successLinkCallType, failCallback);
							};

							self.callTypes().forEach( function (callType : CallType) {
								callType.clone(successCloneCallType, failCallback);
							});
						};

						if (self.theme() != null) {
							clonedZone.linkTheme(self.theme().getId(), successLinkTheme, failCallback);
						} else {
							successLinkTheme();
						}

					};

					clonedZone.linkBehaviour(self.behaviour().getId(), successLinkBehaviour, failCallback);
				};

				self.loadAssociations(successLoadAsso, failCallback);
			};


			clonedZone.linkOrigineZone(self.getId(), successOrigineZone, failCallback);
		};

		super.cloneObject(Zone, successCloneZone, failCallback);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Zones";
    }
}