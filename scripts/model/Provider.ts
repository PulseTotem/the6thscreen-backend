/**
 * @author Simon Urli <simon@pulsetotem.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Source.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Provider represents a provider to an external service (e.g. Twitter, Facebook, etc). It is used to manage oAuthKeys.
 *
 * @class Provider
 * @extends ModelItf
 */
class Provider extends ModelItf {

    /**
     * @property _name : The name of the povider
     * @private
     * @type string
     */
    private _name : string;

    /**
     * @property _description : a description for this provider
     * @private
     * @type string
     */
    private _description : string;

    /**
     * @property _sources : all sources available for this provider
     * @private
     * @type Array<Source>
     */
    private _sources : Array<Source>;

    /**
     * @property _sources_loaded : lazy loading for sources property
     * @private
     * @type boolean
     */
    private _sources_loaded : boolean;

    /**
     * Constructor of a provider.
     *
     * @param name
     * @param description
     * @param id
     * @param complete
     * @param createdAt
     * @param updatedAt
     */
    constructor(name : string = "", description : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
        super(id, complete, createdAt, updatedAt);

        this.setName(name);
        this.setDescription(description);

        this._sources = new Array<Source>();
        this._sources_loaded = false;
    }

    /**
     * Get the name of the provider
     * @method name
     * @returns {string}
     */
    name() {
        return this._name;
    }

    /**
     * Set the name of the provider
     *
     * @method setName
     * @param name
     */
    setName(name : string) {
        this._name = name;
    }

    /**
     * Get the description of the provider
     * @method description
     * @returns {string}
     */
    description() {
        return this._description;
    }

    /**
     * Set the description of the provider
     * @method setDescription
     * @param description
     */
    setDescription(description : string) {
        this._description = description;
    }

    /**
     * Get the sources of the provider
     * @method sources
     * @returns {Array<Source>}
     */
    sources() {
        return this._sources;
    }

    /**
     * Load the sources associated with this provider
     *
     * @method loadSources
     * @param successCallback
     * @param failCallback
     */
    loadSources(successCallback : Function, failCallback : Function) {
        if (!this._sources_loaded) {
            var self = this;
            var success = function (sources) {
                self._sources = sources;
                self._sources_loaded = true;

                successCallback();
            };

            var fail = function (error) {
                failCallback(error);
            };

            this.getAssociatedObjects(Provider, Source, success, fail);
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
            if(self._sources_loaded) {
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

        this.loadSources(success, fail);
    }

    /**
     * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
     */
    desynchronize() : void {
        this._sources_loaded = false;
    }

    /**
     * Return a Provider instance as a JSON Object
     *
     * @method toJSONObject
     * @returns {Object} a JSON Object representing the instance
     */
    toJSONObject() : Object {
        var data = {
            "id": this.getId(),
            "name": this.name(),
            "description": this.description(),
            "complete": this.isComplete(),
            "createdAt" : this.getCreatedAt(),
            "updatedAt" : this.getUpdatedAt()
        };
        return data;
    }

    /**
     * Check completeness of a Provider.
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
     * Return a Provider instance as a JSON Object including associated object.
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

            data["sources"] = self.serializeArray(self.sources(), onlyId);
            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

    /**
     * Add a new Source to the Provider and associate it in the database.
     * A Source can only be added once.
     *
     * @method addSource
     * @param {number} sourceID - The source to add inside the provider. It cannot be a null value.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    addSource(sourceID : number, successCallback : Function, failCallback : Function) {
        this.associateObject(Provider, Source, sourceID, successCallback, failCallback);
    }

    /**
     * Remove a Source from the Provider: the association is removed both in the object and in database.
     *
     * @method removeSource
     * @param {number} sourceID - The source to remove from that Provider
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    removeSource(sourceID : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(Provider, Source, sourceID, successCallback, failCallback);
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
        this.createObject(Provider, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(Provider, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(Provider, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return ModelItf.deleteObject(Provider, this.getId(), successCallback, failCallback, attemptNumber);
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
        return this.allObjects(Provider, successCallback, failCallback, attemptNumber);
    }

    /**
     * Return a Provider instance from a JSON string.
     *
     * @method parseJSON
     * @static
     * @param {string} json - The JSON string
     * @return {Provider} The model instance.
     */
    static parseJSON(jsonString : string) : Provider {
        return Provider.fromJSONObject(JSON.parse(jsonString));
    }

    /**
     * Return a Provider instance from a JSON Object.
     *
     * @method fromJSONObject
     * @static
     * @param {JSONObject} json - The JSON Object
     * @return {Provider} The model instance.
     */
    static fromJSONObject(jsonObject : any) : Provider {
        return new Provider(jsonObject.name, jsonObject.description, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
    }

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Providers";
    }
}