/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Provider.ts" />
/// <reference path="./Team.ts" />

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
     * @property _provider : the Provider associated to the oauthKey
     * @type Provider
     */
    private _provider : Provider;

    /**
     * Lazy loading for Provider property.
     *
     * @property _provider_loaded
     * @type boolean
     */
    private _provider_loaded : boolean;

    /**
     * @property _teams: the teams in which the oAuth is used
     * @type Array<Team>
     * @private
     */
    private _teams : Array<Team>;

    /**
     * @property _teams_loaded: lazy loading for teams property
     * @type boolean
     * @private
     */
    private _teams_loaded : boolean;

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

        this._provider = null;
        this._provider_loaded = false;

        this._teams = new Array<Team>();
        this._teams_loaded = false;
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
     * Return the OAuthKey's provider.
     *
     * @method provider
     */
    provider() {
        return this._provider;
    }

    /**
     * Load the OAuthKey's provider.
     *
     * @method loadProvider
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadProvider(successCallback : Function, failCallback : Function) {
        if(! this._provider_loaded) {
            var self = this;
            var success : Function = function(provider) {
                if(!!provider) {
                    self._provider = provider;
                }
                self._provider_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getUniquelyAssociatedObject(OAuthKey, Provider, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
        }
    }

    /**
     * Return the OAuthKeys teams
     *
     * @method teams
     * @returns {Array<Team>}
     */
    teams() {
        return this._teams;
    }

    /**
     * Load the oAuthkey teams
     *
     * @method loadTeams
     * @param successCallback
     * @param failCallback
     */
    loadTeams(successCallback : Function, failCallback : Function) {
        if (!this._teams_loaded) {
            var self = this;
            var success = function (teams) {
                self._teams = teams;
                self._teams_loaded = true;

                successCallback();
            };

            var fail = function (error) {
                failCallback(error);
            };

            this.getAssociatedObjects(OAuthKey, Team, success, fail);
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
            if(self._provider_loaded && self._teams_loaded) {
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

        this.loadProvider(success, fail);
        this.loadTeams(success, fail);
    }

    /**
     * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
     */
    desynchronize() : void {
        this._provider_loaded = false;
        this._teams_loaded = false;
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
            if (self.isComplete() && !!self.name() && !!self.value()) {

                var successAsso : Function = function () {
                    self._complete = (!!self.provider() && self.provider().isComplete());
                    successCallback();
                };

                var fail:Function = function (error) {
                    failCallback(error);
                };

                self.loadProvider(successAsso, fail);
            } else {
                self._complete = false;
                successCallback();
            }
        };

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
    toCompleteJSONObject(successCallback : Function, failCallback : Function, onlyId : boolean = false) {
        var self = this;

        var success : Function = function() {
            var data = self.toJSONObject();
            if (onlyId) {
                data["provider"] = (self.provider() !== null) ? self.provider().getId() : null;
            } else {
                data["provider"] = (self.provider() !== null) ? self.provider().toJSONObject() : null;
            }
            data["teams"] = self.serializeArray(self.teams(), onlyId);

            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

    /**
     * Set the Provider of the OAuthKey.
     *
     * @method linkProvider
     * @param {number} providerID - The provider to associate with the OAuthKey.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    linkProvider(providerID : number, successCallback : Function, failCallback : Function) {
        this.associateObject(OAuthKey, Provider, providerID, successCallback, failCallback);
    }

    /**
     * Unset the current Provider from the OAuthKey.
     *
     * @method unlinkProvider
     * @param {number} providerID - The provider to dissociate with the OAuthKey.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    unlinkProvider(providerID : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(OAuthKey, Provider, providerID, successCallback, failCallback);
    }

    /**
     * Associate the oauthkey with a team
     *
     * @method addTeam
     * @param {number} teamID - The team to associate with the OAuthKey.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    addTeam(teamID : number, successCallback : Function, failCallback : Function) {
        this.associateObject(OAuthKey, Team, teamID, successCallback, failCallback);
    }

    /**
     * Remove the association between the oauthkey and a team
     *
     * @method removeTeam
     * @param {number} teamID - The team to dissociate with the OAuthKey.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    removeTeam(teamID : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(OAuthKey, Team, teamID, successCallback, failCallback);
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
        var self = this;

        var successLoadTeams = function () {
            var nbTeams = self.teams().length;

            var successRemoveTeam = function() {
                nbTeams--;

                if (nbTeams == 0) {
                    ModelItf.deleteObject(OAuthKey, self.getId(), successCallback, failCallback);
                }
            };

            self.teams().forEach(function (team : Team) {
                self.removeTeam(team.getId(), successRemoveTeam, failCallback);
            });
        };

        this.loadTeams(successLoadTeams, failCallback);
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