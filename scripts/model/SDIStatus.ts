/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Profil.ts" />
/// <reference path="./SDI.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : SDIStatus
 *
 * @class SDIStatus
 * @extends ModelItf
 */
class SDIStatus extends ModelItf {

    /**
     * IP property.
     *
     * @property _ip
     * @type string
     */
    private _ip : string;

    /**
     * SDI property
     *
     * @property _sdi
     * @type SDI
     */
    private _sdi : SDI;

    /**
     * Lazy loading for SDI property
     *
     * @property _sdi_loaded
     * @type boolean
     */
    private _sdi_loaded : boolean;

    /**
     * Profil property
     *
     * @property _profil
     * @type Profil
     */
    private _profil : Profil;

    /**
     * Lazy loading for profil property
     *
     * @property _profil_loaded
     * @type boolean
     */
    private _profil_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} ip - The SDIStatus's name.
     * @param {number} id - The SDIStatus's ID.
	 * @param {string} createdAt - The SDIStatus's createdAt.
	 * @param {string} updatedAt - The SDIStatus's updatedAt.
     */
    constructor(ip : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

        this.setIP(ip);

        this._sdi = null;
        this._sdi_loaded = false;

        this._profil = null;
        this._profil_loaded = false;
    }

	/**
	 * Set the SDIStatus's ip.
	 *
	 * @method setIP
	 */
	setIP(ip : string) {
		this._ip = ip;
	}

    /**
     * Return the SDIStatus's ip.
     *
     * @method name
     */
    IP() {
        return this._ip;
    }

    /**
     * Return the SDIStatus's SDI.
     *
     * @method sdi
     */
    sdi() {
        return this._sdi;
    }

    /**
     * Load the SDIStatus's sdi.
     *
     * @method loadSDI
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadSDI(successCallback : Function = null, failCallback : Function = null) {
        if(! this._sdi_loaded) {
            var self = this;
            var success : Function = function(sdi) {
                self._sdi = sdi;
                self._sdi_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(SDIStatus, SDI, success, fail);
        }
    }

    /**
     * Return the SDIStatus's profil.
     *
     * @method profil
     */
    profil() {
        return this._profil;
    }

    /**
     * Load the SDIStatus's profil.
     *
     * @method loadProfil
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadProfil(successCallback : Function = null, failCallback : Function = null) {
        if(! this._profil_loaded) {
            var self = this;
            var success : Function = function(profil) {
                self._profil = profil;
                self._profil_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(SDIStatus, Profil, success, fail);
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
    loadAssociations(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var success : Function = function(models) {
            if(self._sdi_loaded && self._profil_loaded) {
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

        this.loadProfil(success, fail);
        this.loadSDI(success, fail);
    }

    /**
     * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
     */
    desynchronize() : void {
        super.desynchronize();
        this._sdi_loaded = false;
        this._profil_loaded = false;
    }

	/**
	 * Return a SDIStatus instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"IP": this.IP(),
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
		};
		return data;
	}

	/**
	 * Compute the completeness of an SDIStatus.
	 * The completeness is given by the presence of an ID and a name.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) : void {

		var self = this;

		var success : Function = function () {
			self._complete = (self._complete && !!self.IP());
			successCallback();
		};

		super.checkCompleteness(success, failCallback);
	}

    /**
     * Return a Call instance as a JSON Object including associated object.
     * However the method should not be recursive due to cycle in the model.
     *
     * @method toCompleteJSONObject
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    toCompleteJSONObject(successCallback : Function, failCallback : Function, onlyId : boolean = false) {
        var self = this;
        var data = this.toJSONObject();

        var success : Function = function() {
            if (onlyId) {
                data["SDI"] = (self.sdi() !== null) ? self.sdi().getId() : null;
                data["profil"] = (self.profil() !== null) ? self.profil().getId() : null;
            } else {
                data["SDI"] = (self.sdi() !== null) ? self.sdi().toJSONObject() : null;
                data["profil"] = (self.profil() !== null) ? self.profil().toJSONObject() : null;
            }
            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

    /**
     * Set the SDI of the SDIStatus.
     * As a SDIStatus can only have one SDI, if the value is already set, this method throws an exception: you need first to unset the SDI.
     * Moreover the given type must be created in database.
     *
     * @method linkSDI
     * @param {SDI} it The SDI to associate with the SDIStatus.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    linkSDI(typeID : number, successCallback : Function, failCallback : Function) {
        this.associateObject(SDIStatus, SDI, typeID, successCallback, failCallback);
    }

    /**
     * Unset the current SDI from the SDIStatus.
     * It both sets a null value for the object property and remove the association in database.
     * An SDI must have been set before using it, else an exception is thrown.
     *
     * @method unlinkSDI
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    unlinkSDI(typeID : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(SDIStatus, SDI, typeID, successCallback, failCallback);
    }

    /**
     * Set the Profil of the SDIStatus.
     * As a SDIStatus can only have one Profil, if the value is already set, this method throws an exception: you need first to unset the Profil.
     * Moreover the given type must be created in database.
     *
     * @method linkProfil
     * @param {Profil} it The Profil to associate with the SDIStatus.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    linkProfil(typeID : number, successCallback : Function, failCallback : Function) {
        this.associateObject(SDIStatus, Profil, typeID, successCallback, failCallback);
    }

    /**
     * Unset the current Profil from the SDIStatus.
     * It both sets a null value for the object property and remove the association in database.
     * An Profil must have been set before using it, else an exception is thrown.
     *
     * @method unlinkProfil
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    unlinkProfil(typeID : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(SDIStatus, Profil, typeID, successCallback, failCallback);
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
        this.createObject(SDIStatus, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(SDIStatus, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(SDIStatus, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return ModelItf.deleteObject(SDIStatus, this.getId(), successCallback, failCallback, attemptNumber);
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
        return this.allObjects(SDIStatus, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return an SDIStatus instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Call} The model instance.
	 */
	static parseJSON(jsonString : string) : SDIStatus {
		return SDIStatus.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return an SDIStatus instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Call} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : SDIStatus {
		return new SDIStatus(jsonObject.IP, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "SDIStatuses";
    }
}