/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Call.ts" />
/// <reference path="./ZoneContent.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : Profil
 *
 * @class Profil
 * @extends ModelItf
 */
class Profil extends ModelItf {

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
     * ZoneContents property.
     *
     * @property _zoneContents
     * @type Array<ZoneContent>
     */
    private _zoneContents : Array<ZoneContent>;

    /**
     * Lazy loading for ZoneContents property.
     *
     * @property _zoneContents_loaded
     * @type boolean
     */
    private _zoneContents_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Profil's name.
     * @param {string} description - The Profil's description.
     * @param {number} id - The Profil's ID.
     */
    constructor(name : string = "", description : string = "", id : number = null, complete : boolean = false) {
        super(id, complete);

        this.setName(name);
        this.setDescription(description);

        this._zoneContents = new Array<ZoneContent>();
        this._zoneContents_loaded = false;
    }

    /**
     * Return the Profil's name.
     *
     * @method name
     * @return {string} The Profil's name.
     */
    name() {
        return this._name;
    }

    /**
     * Set the Profil's name.
     *
     * @method setName
     */
    setName(name : string) {
        this._name = name;
    }

    /**
     * Return the Profil's description.
     *
     * @method description
     * @return {string} The Profil's description.
     */
    description() : string {
        return this._description;
    }

    /**
     * Set the Profil's description.
     *
     * @method setDescription
     */
    setDescription(description : string) {
        this._description = description;
    }

    /**
     * Return the Profil's zoneContents.
     *
     * @method zoneContents
     * @return {Array<ZoneContent>} The Profil's zoneContents.
     */
    zoneContents() : Array<ZoneContent> {
        return this._zoneContents;
    }

    /**
     * Load the Profil's zoneContents.
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

            this.getAssociatedObjects(Profil, Call, success, fail);
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
            if(self._zoneContents_loaded) {
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

        this.loadZoneContents(success, fail);
	}

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._zoneContents_loaded = false;
	}

	/**
	 * Return a Profil instance as a JSON Object
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
	 * Check completeness of a Profil.
	 * The completeness is determined by the presence of a name and an id.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) : void {
		var self = this;

		var success : Function = function () {
			self._complete = (self._complete && !!self.name());
			successCallback();
		};
		super.checkCompleteness(success, failCallback);
	}

    /**
     * Return a Profil instance as a JSON Object including associated object.
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
            data["zoneContents"] = self.serializeArray(self.zoneContents(), onlyId);
            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

	/**
	 * Add a new ZoneContent to the Profil and associate it in the database.
	 * A ZoneContent can only be added once.
	 *
     * @method addCall
	 * @param {Call} c The ZoneContent to add inside the Profil. It cannot be a null value.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	addZoneContent(zoneContentID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(Profil, Call, zoneContentID, successCallback, failCallback);
	}

	/**
	 * Remove a ZoneContent from the Profil: the association is removed both in the object and in database.
	 * The ZoneContent can only be removed if it exists first in the list of associated ZoneContents, else an exception is thrown.
	 *
     * @method removeCall
     * @param {Call} c The ZoneContent to remove from that Profil
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
	 */
	removeZoneContent(zoneContentID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(Profil, Call, zoneContentID, successCallback, failCallback);
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
        this.createObject(Profil, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(Profil, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(Profil, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return ModelItf.deleteObject(Profil, this.getId(), successCallback, failCallback, attemptNumber);
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
        return this.allObjects(Profil, successCallback, failCallback, attemptNumber);
    }

    /**
     * Return a Profil instance from a JSON string.
     *
     * @method parseJSON
     * @static
     * @param {string} json - The JSON string
     * @return {Profil} The model instance.
     */
    static parseJSON(jsonString : string) : Profil {
        return Profil.fromJSONObject(JSON.parse(jsonString));
    }

    /**
     * Return a Profil instance from a JSON Object.
     *
     * @method fromJSONObject
     * @static
     * @param {JSONObject} json - The JSON Object
     * @return {Profil} The model instance.
     */
    static fromJSONObject(jsonObject : any) : Profil {
	    return new Profil(jsonObject.name, jsonObject.description, jsonObject.id, jsonObject.complete);
    }

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Profils";
    }
}