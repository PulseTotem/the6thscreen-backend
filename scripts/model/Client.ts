/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Profil.ts" />
/// <reference path="./SDI.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : NodeRestClient
 *
 * @class NodeRestClient
 * @extends ModelItf
 */
class Client extends ModelItf {

    /**
     * IP property.
     *
     * @property _ip
     * @type string
     */
    private _ip : string;

    /**
     * SocketID property
     *
     * @property _socketID
     * @type string
     */
    private _socketID : string;

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
     * @param {string} ip - The NodeRestClient's socketID.
     * @param {number} id - The NodeRestClient's ID.
	 * @param {string} createdAt - The NodeRestClient's createdAt.
	 * @param {string} updatedAt - The NodeRestClient's updatedAt.
     */
    constructor(ip : string = "", socketID : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

        this.setIP(ip);
        this.setSocketID(socketID);

        this._profil = null;
        this._profil_loaded = false;
    }

	/**
	 * Set the NodeRestClient's ip.
	 *
	 * @method setIP
	 */
	setIP(ip : string) {
		this._ip = ip;
	}

    /**
     * Return the NodeRestClient's ip.
     *
     * @method socketID
     */
    IP() {
        return this._ip;
    }

    /**
     * Set the NodeRestClient' socketID
     *
     * @method setName
     * @param socketID the socketID
     */
    setSocketID(socketID : string) {
        this._socketID = socketID;
    }

    /**
     * Return the NodeRestClient' socketID
     * @method socketID
     * @returns {string}
     */
    socketID() {
        return this._socketID;
    }

    /**
     * Return the NodeRestClient's profil.
     *
     * @method profil
     */
    profil() {
        return this._profil;
    }

    /**
     * Load the NodeRestClient's profil.
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

            this.getUniquelyAssociatedObject(Client, Profil, success, fail);
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
            if(self._profil_loaded) {
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
    }

    /**
     * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
     */
    desynchronize() : void {
        super.desynchronize();
        this._profil_loaded = false;
    }

	/**
	 * Return a NodeRestClient instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"ip": this.IP(),
            "socketId": this.socketID(),
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
		};
		return data;
	}

	/**
	 * Compute the completeness of an NodeRestClient.
	 * The completeness is given by the presence of an ID and a socketID.
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
                data["profil"] = (self.profil() !== null) ? self.profil().getId() : null;
            } else {
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
     * Set the Profil of the NodeRestClient.
     * As a NodeRestClient can only have one Profil, if the value is already set, this method throws an exception: you need first to unset the Profil.
     * Moreover the given type must be created in database.
     *
     * @method linkProfil
     * @param {Profil} it The Profil to associate with the NodeRestClient.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    linkProfil(typeID : number, successCallback : Function, failCallback : Function) {
        this.associateObject(Client, Profil, typeID, successCallback, failCallback);
    }

    /**
     * Unset the current Profil from the NodeRestClient.
     * It both sets a null value for the object property and remove the association in database.
     * An Profil must have been set before using it, else an exception is thrown.
     *
     * @method unlinkProfil
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    unlinkProfil(typeID : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(Client, Profil, typeID, successCallback, failCallback);
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
        this.createObject(Client, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(Client, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(Client, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return ModelItf.deleteObject(Client, this.getId(), successCallback, failCallback, attemptNumber);
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
        return this.allObjects(Client, successCallback, failCallback, attemptNumber);
    }

    /**
     * Find One Client by socketId.
     *
     * @method findOneBySocketId
     * @param {string} socketId - The Client's socketId
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    static findOneBySocketId(socketId : string, successCallback : Function, failCallback : Function) {
        return this.findOneBy(Client, "socketId", socketId, successCallback, failCallback);
    }

	/**
	 * Return an NodeRestClient instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Call} The model instance.
	 */
	static parseJSON(jsonString : string) : Client {
		return Client.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return an NodeRestClient instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Call} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : Client {
		return new Client(jsonObject.IP, jsonObject.socketID, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Clients";
    }
}