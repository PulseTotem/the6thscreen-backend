/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Service.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : OAuthKey
 *
 * @class OAuthKey
 * @extends ModelItf
 */
class OAuthKey extends ModelItf {

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
     * Value property.
     *
     * @property _value
     * @type string
     */
    private _value : string;

    /**
     * Service property.
     *
     * @property _service
     * @type Service
     */
    private _service : Service;

    /**
     * Lazy loading for Service property.
     *
     * @property _service_loaded
     * @type boolean
     */
    private _service_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The OAuthKey's name.
     * @param {string} description - The OAuthKey's description.
     * @param {string} value - The OAuthKey's value.
     * @param {number} id - The OAuthKey's ID.
	 * @param {string} createdAt - The OAuthKey's createdAt.
	 * @param {string} updatedAt - The OAuthKey's updatedAt.
     */
    constructor(name : string = "", description : string = "", value : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

        this.setName(name);
        this.setDescription(description);
        this.setValue(value);

        this._service = null;
        this._service_loaded = false;
    }

    /**
     * Set the OAuthKey's name.
     *
     * @method setName
     */
    setName(name : string) {
        this._name = name;
    }

    /**
     * Set the OAuthKey's description.
     *
     * @method setDescription
     */
    setDescription(description : string) {
        this._description = description;
    }

    /**
     * Set the OAuthKey's value.
     *
     * @method setValue
     */
    setValue(value : string) {
        this._value = value;
    }

    /**
     * Return the OAuthKey's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Return the OAuthKey's description.
     *
     * @method description
     */
    description() {
        return this._description;
    }

    /**
     * Return the OAuthKey's value.
     *
     * @method value
     */
    value() {
        return this._value;
    }

    /**
     * Return the OAuthKey's service.
     *
     * @method service
     */
    service() {
        return this._service;
    }

    /**
     * Load the OAuthKey's service.
     *
     * @method loadService
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadService(successCallback : Function, failCallback : Function) {
        if(! this._service_loaded) {
            var self = this;
            var success : Function = function(service) {
                if(!!service) {
                    self._service = service;
                }
                self._service_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(OAuthKey, Service, success, fail);
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
            if(self._service_loaded) {
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

        this.loadService(success, fail);
    }

    /**
     * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
     */
    desynchronize() : void {
        this._service_loaded = false;
    }

    /**
     * Return a OAuthKey instance as a JSON Object
     *
     * @method toJSONObject
     * @returns {Object} a JSON Object representing the instance
     */
    toJSONObject() : Object {
        var data = {
            "id": this.getId(),
            "name": this.name(),
            "description": this.description(),
            "value": this.value(),
            "complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
        };
        return data;
    }

    /**
     * Check whether the object is complete or not
     *
     * A OAuthKey is complete if it has an ID, a name and a service.
     *
     * @param successCallback The function to call in case of success.
     * @param failCallback The function to call in case of failure.
     */
    checkCompleteness(successCallback : Function, failCallback : Function) {
        var self = this;

        var success : Function = function () {
            if (self.isComplete() && !!self.name()) {

                var successAsso : Function = function () {
                    self._complete = (!!self.service() && self.service().isComplete());
                    successCallback();
                };

                var fail:Function = function (error) {
                    failCallback(error);
                };

                self.loadService(successAsso, fail);
            } else {
                self._complete = false;
                successCallback();
            }
        }

        super.checkCompleteness(success, failCallback);

    }

    /**
     * Return a OAuthKey instance as a JSON Object including associated object.
     * However the method should not be recursive due to cycle in the model.
     *
     * @method toCompleteJSONObject
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    toCompleteJSONObject(successCallback : Function, failCallback : Function) {
        var self = this;

        var success : Function = function() {
            var data = self.toJSONObject();
            data["service"] = (self.service() !== null) ? self.service().toJSONObject() : null;
            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

    /**
     * Set the Service of the OAuthKey.
     * As a OAuthKey can only have one Service, if the value is already set, this method throws an exception: you need first to unset the Service.
     * Moreover the given service must be created in database.
     *
     * @method linkService
     * @param {Service} serviceID - The Service to associate with the OAuthKey.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    linkService(serviceID : number, successCallback : Function, failCallback : Function) {
        this.associateObject(OAuthKey, Service, serviceID, successCallback, failCallback);
    }

    /**
     * Unset the current Service from the OAuthKey.
     * It both sets a null value for the object property and remove the association in database.
     * A Service must have been set before using it, else an exception is thrown.
     *
     * @method unlinkService
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    unlinkService(serviceID : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(OAuthKey, Service, serviceID, successCallback, failCallback);
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
        this.createObject(OAuthKey, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(OAuthKey, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(OAuthKey, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return ModelItf.deleteObject(OAuthKey, this.getId(), successCallback, failCallback, attemptNumber);
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
        return this.allObjects(OAuthKey, successCallback, failCallback, attemptNumber);
    }

    /**
     * Return a OAuthKey instance from a JSON string.
     *
     * @method parseJSON
     * @static
     * @param {string} json - The JSON string
     * @return {OAuthKey} The model instance.
     */
    static parseJSON(jsonString : string) : OAuthKey {
        return OAuthKey.fromJSONObject(JSON.parse(jsonString));
    }

    /**
     * Return a OAuthKey instance from a JSON Object.
     *
     * @method fromJSONObject
     * @static
     * @param {JSONObject} json - The JSON Object
     * @return {OAuthKey} The model instance.
     */
    static fromJSONObject(jsonObject : any) : OAuthKey {
        return new OAuthKey(jsonObject.name, jsonObject.description, jsonObject.value, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
    }

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "OAuthKeys";
    }
}