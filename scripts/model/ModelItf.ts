/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/RestClient.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/RestClientResponse.ts" />
/// <reference path="../core/BackendConfig.ts" />
/// <reference path="../exceptions/DataException.ts" />
/// <reference path="../exceptions/RequestException.ts" />
/// <reference path="../exceptions/ModelException.ts" />

/**
 * Model Interface
 *
 * @class ModelItf
 */
class ModelItf {

    /**
     * ID property.
     *
     * @property _id
     * @type number
     */
    _id : number;

	/**
	 * Complete property : determine if a piece of information is complete or not.
	 *
	 * @property complete
	 * @type boolean
	 */
	_complete : boolean;

	/**
	 * CreatedAt property.
	 *
	 * @property _createdAt
	 * @type string
	 */
	_createdAt : string;

	/**
	 * UpdatedAt property.
	 *
	 * @property _updatedAt
	 * @type string
	 */
	_updatedAt : string;

    /**
     * Constructor.
     *
     * @param {number} id - The model ID.
	 * @param {boolean} complete - Indicates if model is complete or not.
	 * @param {string} createdAt - The model createdAt.
	 * @param {string} updatedAt - The model updatedAt.
     */
    constructor(id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
	    if (!id && id !== null) {
		    throw new ModelException("The ID cannot be undefined");
	    }
        this._id = id;
	    this._complete = complete;
		this._createdAt = createdAt;
		this._updatedAt = updatedAt;
    }

    /**
     * Returns ID of model.
     *
     * @method getId
     * @return {number} The model's ID.
     */
    getId() : number {
        return this._id;
    }

	/**
	 * Return if the model is complete or not.
	 *
	 * @returns {boolean}
	 */
	isComplete() : boolean {
		return this._complete;
	}

	/**
	 * Returns CreatedAt property of model.
	 *
	 * @method getCreatedAt
	 * @return {string} The model's CreatedAt property.
	 */
	getCreatedAt() : string {
		return this._createdAt;
	}

	/**
	 * Returns UpdatedAt property of model.
	 *
	 * @method getUpdatedAt
	 * @return {string} The model's UpdatedAt property.
	 */
	getUpdatedAt() : string {
		return this._updatedAt;
	}

	/**
	 * Check the completeness of an object.
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) : void {
		this._complete = (this._id !== null);
		successCallback();
	}

    /**
     * Create model object in database.
     *
     * @method createObject
     * @param {ModelItf Class} modelClass - The model to create.
     * @param {Object} data - The data necessary to create object.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
     createObject(modelClass : any, data : any, successCallback : Function, failCallback : Function, attemptNumber : number = 0) {

        var self = this;

	    if (!modelClass || !data) {
            failCallback(new ModelException("To create an object the modelClass and the data of the object must be given."), attemptNumber);
            return;
	    }

	    if (this.getId() !== null) {
		    failCallback(new ModelException("This object already exists."), attemptNumber);
		    return;
	    }

        var success : Function = function(result) {
            var response = result.data();

			if(response === undefined || Object.keys(response).length == 0 || response.id === undefined) {
				failCallback(new DataException("The response is a success but the data appears to be empty or does not have the right signature when creating an object with URL: "+urlCreateObject+" and datas: "+JSON.stringify(data)+"\nResponse data: "+JSON.stringify(response)), attemptNumber);
			} else {
				self._id = response.id;
				self._createdAt = response.createdAt;
				self._updatedAt = response.updatedAt;
				successCallback(response);
			}
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to create an object with URL:"+urlCreateObject+" and datas : "+JSON.stringify(data)+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()), attemptNumber);
        };

	    var urlCreateObject = BackendConfig.getDBBaseURL() + BackendConfig.modelEndpoint(modelClass.getTableName());

		delete(data["id"]);
		delete(data["createdAt"]);
		delete(data["updatedAt"]);

        RestClient.post(urlCreateObject, data, success, fail);
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method readObject
     * @static
     * @param {ModelItf Class} modelClass - The model to retrieve.
     * @param {number} id - The model instance's id.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    static readObject(modelClass : any, id : number, successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        if (!modelClass || !id) {
            failCallback(new ModelException("To read an object the modelClass and the id must be given."), id, attemptNumber);
            return;
        }

        var success : Function = function(result) {
            var response = result.data();
			if(response === undefined || Object.keys(response).length == 0 ||response.id === undefined) {
				failCallback(new DataException("The response is a success but the data appears to be empty or does not have the right signature when reading an object with URL: "+urlReadObject+"\nResponse data: "+JSON.stringify(response)), id, attemptNumber);
			} else {
				successCallback(modelClass.fromJSONObject(response));
			}
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to read an object with URL:"+urlReadObject+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()), id, attemptNumber);
        };

        var urlReadObject = BackendConfig.getDBBaseURL() + BackendConfig.objectEndpoint(modelClass.getTableName(), id.toString());

        RestClient.get(urlReadObject, success, fail);
    }

    /**
     * Retrieve model descriptions from database by search and create model instances.
     *
     * @method findBy
     * @static
     * @param {ModelItf Class} modelClass - The model to retrieve.
     * @param {string} paramName - The model param's name.
     * @param {string} paramValue - The model param's value.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    static findBy(modelClass : any, paramName : string, paramValue : string, successCallback : Function, failCallback : Function) {
        if (!modelClass || !paramName || !paramValue) {
            failCallback(new ModelException("To find an object the modelClass, the paramName and the paramValue must be given."));
            return;
        }

        var success : Function = function(result) {
            var response = result.data();
			if(response === undefined || Object.keys(response).length == 0 || !(response instanceof Array) ) {
				failCallback(new DataException("The response is a success but the data appears to be empty or does not have the right signature when searching an object with URL: "+urlSearchObject+"\nResponse data: "+JSON.stringify(response)));
			} else {
				var allModelItfs : any = new Array();

				if(response.length > 0) {
					for (var i = 0; i < response.length; i++) {
						var obj = response[i];
						if (obj.id === undefined) {
							failCallback(new DataException("One data does not have any ID when searching objects with URL: " + urlSearchObject + "\nResponse data: " + JSON.stringify(response)));
							return;
						} else {
							allModelItfs.push(modelClass.fromJSONObject(obj));
						}
					}
				}

				successCallback(allModelItfs);
			}
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to find an object with URL:"+urlSearchObject+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()));
        };

        var urlSearchObject = BackendConfig.getDBBaseURL() + BackendConfig.searchEndpoint(modelClass.getTableName(), paramName, paramValue);

        RestClient.get(urlSearchObject, success, fail);
    }

    /**
     * Retrieve model description from database by search and create model instance.
     * Fail if there is more than one.
     *
     * @method findOneBy
     * @static
     * @param {ModelItf Class} modelClass - The model to retrieve.
     * @param {number} id - The model instance's id.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    static findOneBy(modelClass : any, paramName : string, paramValue : string, successCallback : Function, failCallback : Function) {
        if (!modelClass || !paramName || !paramValue) {
            failCallback(new ModelException("To find an object the modelClass, the paramName and the paramValue must be given."));
            return;
        }

        var success : Function = function(result) {
            var response = result.data();
			if(response === undefined || Object.keys(response).length == 0 || !(response instanceof Array) ) {
				failCallback(new DataException("The response is a success but the data appears to be empty or does not have the right signature when searching an object with URL: "+urlSearchObject+"\nResponse data: "+JSON.stringify(response)));
			} else {
				if(response.length > 0) {
					if(response.length == 1) {
						var obj = response[0];
						if (obj.id === undefined) {
							failCallback(new DataException("Found data does not have any ID when searching objects with URL: " + urlSearchObject + "\nResponse data: " + JSON.stringify(response)));
							return;
						} else {
							successCallback(modelClass.fromJSONObject(obj));
						}
					} else {
						failCallback(new DataException("More than one object was found: " + urlSearchObject + "\nResponse data: " + JSON.stringify(response)));
					}
				} else {
					failCallback(new DataException("No object was found with URL: " + urlSearchObject + "\nResponse data: " + JSON.stringify(response)));
				}
			}
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to find an object with URL:"+urlSearchObject+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()));
        };

        var urlSearchObject = BackendConfig.getDBBaseURL() + BackendConfig.searchEndpoint(modelClass.getTableName(), paramName, paramValue);

        RestClient.get(urlSearchObject, success, fail);
    }

    /**
     * Update model object in database.
     *
     * @method updateObject
     * @param {ModelItf Class} modelClass - The model to update.
     * @param {Object} data - The data necessary to update object.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
     updateObject(modelClass : any, data : any, successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
		var self = this;

        if (!modelClass || !data) {
            failCallback(new ModelException("To update an object, the modelClass and the datas must be given."), attemptNumber);
            return;
	    }

	    // if the object does not exist yet, we need to create it instead updating!
        if(!this.getId()) {
            failCallback(new ModelException("The object does not exist yet. It can't be update. Datas: "+JSON.stringify(data)), attemptNumber);
            return;
        }

        var success : Function = function(result) {
            var response = result.data();
			if(response === undefined || Object.keys(response).length == 0 || response.id === undefined) {
				failCallback(new DataException("The response is a success but the data appears to be empty or does not have the right signature when updating an object with URL: "+urlUpdate+" and datas: "+JSON.stringify(data)+"\nResponse data: "+JSON.stringify(response)), attemptNumber);
			} else {
				self._updatedAt = response.updatedAt;
				successCallback();
			}
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to update an object with URL:"+urlUpdate+" and datas : "+JSON.stringify(data)+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()), attemptNumber);
        };

	    var urlUpdate = BackendConfig.getDBBaseURL() + BackendConfig.objectEndpoint(modelClass.getTableName(), this.getId().toString());
	    //Logger.debug("[ModelItf] Update an object with the URL : "+urlUpdate+" and data : "+JSON.stringify(data));

        RestClient.put(urlUpdate, data, success, fail);
    }

    /**
     * Delete model object in database.
     *
     * @method deleteObject
     * @param {ModelItf Class} modelClass - The model to delete.
     * @param {number} objectId - The id of the object to delete.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    static deleteObject(modelClass : any, objectId : number, successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
	    if (!modelClass) {
            failCallback(new ModelException("To delete an object, the modelClass must be given."), attemptNumber);
            return;
	    }

        if (!objectId) {
            failCallback(new ModelException("You must give an objectId. It can't be delete in database."), attemptNumber);
            return;
        }

        var success : Function = function(result) {
            var response = result.data();
			successCallback();
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to delete an object with URL:"+urlDelete+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()), attemptNumber);
        };

	    var urlDelete = BackendConfig.getDBBaseURL() + BackendConfig.objectEndpoint(modelClass.getTableName(), objectId.toString());
	    //Logger.debug("[ModelItf] Delete an object with the URL : "+urlDelete);

        RestClient.delete(urlDelete, success, fail);
    }

	/**
	 * Retrieve all model objects in database.
	 *
	 * @method allObjects
	 * @static
	 * @param {ModelItf Class} modelClass - The model to retrieve all instances.
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
	 */
	static allObjects(modelClass : any, successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
		if (!modelClass) {
            failCallback(new ModelException("To retrieve all objects, the modelClass must be given."), attemptNumber);
            return;
		}

        var success : Function = function(result) {
            var response = result.data();
			var allModelItfs : any = new Array();
			if(response === undefined || !(response instanceof Array)) {
				failCallback(new DataException("The data appears to be empty or does not have the right signature when retrieving all objects with URL: "+urlAll+"\nResponse data: "+JSON.stringify(response)), attemptNumber);
			} else {
				if(response.length > 0) {
					for (var i = 0; i < response.length; i++) {
						var obj = response[i];
						if (obj.id === undefined) {
							failCallback(new DataException("One data does not have any ID when retrieving all objects with URL: " + urlAll + "\nResponse: " + JSON.stringify(response)), attemptNumber);
							return;
						} else {
							allModelItfs.push(modelClass.fromJSONObject(obj));
						}
					}
				}
				successCallback(allModelItfs);
			}
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to retrieve all objects with URL:"+urlAll+".\nCode : "+result.statusCode()+"\nMessage : " + result.response()+"\nData : "+JSON.stringify(result.data())), attemptNumber);
        };

		var urlAll = BackendConfig.getDBBaseURL() + BackendConfig.modelEndpoint(modelClass.getTableName());

		RestClient.get(urlAll, success, fail);
	}

	/**
	 * Associate two objects in database.
	 *
	 * @method associateObject
	 * @param {ModelItf Class} modelClass1 - the first model class
	 * @param {ModelItf Class} modelClass2 - the second model class
	 * @param {number} id2 - the ID of the second object
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
	 */
	associateObject(modelClass1 : any, modelClass2: any, id2 : number, successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
		if (!this.getId()) {
            failCallback(new ModelException("The object to be associated does not exist yet. The association can't be created."), attemptNumber);
            return;
		}

		if (!modelClass1 || !modelClass2 || !id2) {
            failCallback(new ModelException("The two modelClasses and the ID of the second objects must be given to create the association."), attemptNumber);
            return;
		}

        var success : Function = function(result) {
            var response = result.data();
			successCallback();
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to associate objects with URL:"+associationURL+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()), attemptNumber);
        };

		var associationURL = BackendConfig.getDBBaseURL() + BackendConfig.associatedObjectEndpoint(modelClass1.getTableName(), this.getId().toString(), modelClass2.getTableName(), id2.toString());

		RestClient.put(associationURL, {}, success, fail);
	}

	/**
	 * Remove an association between two objects in database.
	 *
     * @method deleteObjectAssociation
	 * @param {ModelItf Class} modelClass1 the model class of the first object
	 * @param {ModelItf Class} modelClass2 the model class of the second object
	 * @param {number} id2 the ID of the second object
	 * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
	 */
	deleteObjectAssociation(modelClass1 : any, modelClass2 : any, id2 : number, successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
		if (!this.getId()) {
            failCallback(new ModelException("An association can't be deleted if the object does not exist."), attemptNumber);
            return;
		}

		if (!modelClass1 || !modelClass2 || !id2) {
            failCallback(new ModelException("The two modelClasses and the ID of the second objects must be given to delete the association."), attemptNumber);
            return;
		}

        var success : Function = function(result) {
            var response = result.data();
			successCallback();
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to delete an association between objects with URL:"+deleteAssoURL+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()), attemptNumber);
        };

		var deleteAssoURL = BackendConfig.getDBBaseURL() + BackendConfig.associatedObjectEndpoint(modelClass1.getTableName(), this.getId().toString(), modelClass2.getTableName(), id2.toString());

		RestClient.delete(deleteAssoURL, success, fail);
	}

    /**
     * Retrieve all associated objects
     *
     * @method getAssociatedObjects
     * @param modelClass - the first model class, corresponding to the object responsible to get associated objects
     * @param modelClassAssociated - the second model class, corresponding to the objects retrieved
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    getAssociatedObjects(modelClass : any, modelClassAssociated : any, successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        if (!this.getId()) {
            failCallback(new ModelException("You cannot retrieve associated objects if the object does not exist."), attemptNumber);
            return;
        }

        if (!modelClass || !modelClassAssociated) {
            failCallback(new ModelException("The two modelClasses must be given as arguments to retrieve objects."), attemptNumber);
            return;
        }

        var success : Function = function(result) {
            var response = result.data();
			if(response === undefined || !(response instanceof Array)) {
				failCallback(new DataException("The data appears to be empty or does not have the right signature when retrieving all objects with URL: "+urlAssociatedObjects+"\nResponse data: "+JSON.stringify(response)), attemptNumber);
			} else {
				var assoName : Array<ModelItf> = new Array<ModelItf>();
				for(var i = 0; i < response.length; i++) {
					var object = response[i];
					if (object.id === undefined) {
						failCallback(new DataException("One data does not have any ID when retrieving all objects with URL: "+urlAssociatedObjects+"\nResponse data: "+JSON.stringify(response)), attemptNumber);
						return;
					} else {
						assoName.push(modelClassAssociated.fromJSONObject(object));
					}
				}
				successCallback(assoName);
			}
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to retrieve all associated objects with URL:"+urlAssociatedObjects+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()), attemptNumber);
        };

        var urlAssociatedObjects = BackendConfig.getDBBaseURL() + BackendConfig.associationEndpoint(modelClass.getTableName(), this.getId().toString(), modelClassAssociated.getTableName());

        RestClient.get(urlAssociatedObjects, success, fail);
    }

    /**
     * Retrieve unique associated object
     *
     * @method getUniquelyAssociatedObject
     * @param modelClass - the first model class, corresponding to the object responsible to get associated object
     * @param modelClassAssociated - the second model class, corresponding to the object retrieved
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    getUniquelyAssociatedObject(modelClass : any, modelClassAssociated : any, successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        if (!this.getId()) {
            failCallback(new ModelException("You cannot retrieve uniquely associated object if the object does not exist."), attemptNumber);
            return;
        }

        if (!modelClass || !modelClassAssociated) {
            failCallback(new ModelException("The two modelClasses arguments must be given to retrieve a uniquely associated object."), attemptNumber);
            return;
        }

        var success : Function = function(result) {
            var response = result.data();

			// in that case there is no data to retrieve
			if (((response instanceof Array) && (response.length == 0)) || JSON.stringify(response) == "{}") {
				successCallback(null);
				return;
			}
			if(response === undefined || response.id === undefined) {
				failCallback(new DataException("The response is a success but the data does not have the right signature when retrieving a uniquely associated object with URL: "+urlUniqueAssociatedOject+"\nResponse data: "+JSON.stringify(response)), attemptNumber);
			} else {
				successCallback(modelClassAssociated.fromJSONObject(response));
			}
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to retrieve a uniquely associated objects with URL:"+urlUniqueAssociatedOject+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()), attemptNumber);
        };

        var urlUniqueAssociatedOject = BackendConfig.getDBBaseURL() + BackendConfig.associationEndpoint(modelClass.getTableName(), this.getId().toString(), modelClassAssociated.getTableName());

        RestClient.get(urlUniqueAssociatedOject, success, fail);
    }

	/**
	 * Update an attribute, add or remove a link.
	 * This method always check comleteness and keep update value of it in database.
	 *
	 * @param modelClass The modelClass of the object to update.
	 * @param informations The informations for the update with the following format : {'id': 12, 'method':'setName', 'value':'toto'}. Only method starting by the name 'set', 'add', 'link', 'unlink' or 'remove' are allowed.
	 * @param successCallback The function to call if the object is successfully updated.
	 * @param failCallback The function to call in case of failure.
	 */
	static updateAttribute(modelClass : any, informations : any, successCallback : Function, failCallback : Function) {
		if (!modelClass) {
			failCallback(new ModelException("You must specify the modelClass in order to update one of its attribute."));
			return;
		}
		if (!informations) {
			failCallback(new ModelException("You must specify a proper piece of information to update attribute."));
			return;
		}
		if (!informations.id) {
			failCallback(new ModelException("You must specify the object ID in order to update one of its attribute."));
			return;
		}
		if (!informations.method) {
			failCallback(new ModelException("You must specify the object method in order to update one of its attribute."));
			return;
		}
		if (!(informations.method.indexOf('set') === 0 || informations.method.indexOf('add') === 0 || informations.method.indexOf('link') === 0 || informations.method.indexOf('unlink') === 0 || informations.method.indexOf('remove') === 0 )) {
			failCallback(new ModelException("You can only call set, unset, add or remove method in order to update an attribute."));
			return;
		}

		var successRead : Function = function (object) {
			var self = object;
			var wasComplete = self.isComplete();

			var doUpdate : Function = function () {
				self.update(successCallback,failCallback);
			};

			var doUpdateOnlyIfCompleteDifferent : Function = function () {
				if (self.isComplete() != wasComplete) {
					self.update(successCallback,failCallback);
				} else {
					successCallback();
				}
			};

			var successCheck : Function = function () {
				self.checkCompleteness(doUpdateOnlyIfCompleteDifferent, failCallback);
			};

			try {
				if (informations.method.indexOf('set') === 0) {
					self[informations.method](informations.value);
					self.checkCompleteness(doUpdate, failCallback);
				} else {
					self[informations.method](informations.value, successCheck, failCallback);
				}
			} catch (error) {
				if (error instanceof TypeError) {
					failCallback(new ModelException("The method you specify ("+informations.method+") has not been recognized for the model "+modelClass.getTableName()+". (Original error : "+error+")"));
					return;
				} else {
					failCallback(error);
					return;
				}
			}
		};

		modelClass.read(informations.id, successRead, failCallback);
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
	    successCallback();
    }

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {}

    /**
     * Create model in database.
     *
     * @method create
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    create(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        Logger.error("ModelItf - create : Method need to be implemented.");
        this.createObject(ModelItf, this.toJSONObject(), successCallback, failCallback);
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
        Logger.error("ModelItf - read : Method need to be implemented.");
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
        Logger.error("ModelItf - update : Method need to be implemented.");
	    // for tests
	    if (successCallback != null) {
		    successCallback();
	    }
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
        Logger.error("ModelItf - delete : Method need to be implemented.");
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
        Logger.error("ModelItf - all : Method need to be implemented.");
    }

	/**
	 * Serialize an array of ModelItf instances to a JSON Object.
	 * It is used in some implementation of "toCompleteJSONObject"
	 *
	 * @param {Array<ModelItf>} tableau an array of ModelItf instances
	 * @returns {Array} an array of JSON Objects
	 */
	serializeArray(tableau : Array<ModelItf>, onlyId : boolean = false) : Object {
		var data = [];
		for (var i = 0; i < tableau.length; i++) {
			var value : any;

			if (onlyId) {
				value = tableau[i].getId();
			} else {
				value = tableau[i].toJSONObject();
			}
			data.push(value);
		}
		return data;
	}

	/**
	 * Serialize an array of ModelItf instances using the function toCompleteJSONObject.
	 * It is used when reading all objects of a ModelItf.
	 *
	 * TODO : Test that method !
	 *
	 * @param {Array<ModelItf>} tableau an array of ModelItf instances
	 * @param {Function} successCallback The callback function when success
	 * @param {Function} failCallback The callback function when fail.
	 */
	static completeArraySerialization(tableau : Array<ModelItf>, successCallback : Function, failCallback : Function) {
		var data = [];
		var numberProcessedInfo = 0;
		var totalInfo = tableau.length;

		var success : Function = function(json) {
			data.push(json);

			numberProcessedInfo++;

			if (numberProcessedInfo == totalInfo)  {
				successCallback(data);
			}
		};

		var fail : Function = function(error) {
			failCallback(error);
		};

		for (var i = 0; i < tableau.length; i++) {
			var objet : ModelItf = tableau[i];

			objet.toCompleteJSONObject(success, fail);
		}
	}

	/**
	 * Return a ModelItf instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : any {
		var data = {
			"id": this.getId(),
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
		};
		return data;
	}

    /**
     * Return a ModelItf instance as a JSON Object including associated object.
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
            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

    /**
     * Return a ModelItf instance from a JSON string.
     *
     * @method parseJSON
     * @static
     * @param {string} json - The JSON string
     * @return {ModelItf} The model instance.
     */
    static parseJSON(jsonString : string) : ModelItf {
        Logger.warn("ModelItf - parseJSON : Method need to be implemented. It will look like : 'return \"ModelItf\".fromJSONObject(JSON.parse(jsonString));'");
        return null;
    }

    /**
     * Return a ModelItf instance from a JSON Object.
     *
     * @method fromJSONObject
     * @static
     * @param {JSONObject} json - The JSON Object
     * @return {ModelItf} The model instance.
     */
    static fromJSONObject(jsonObject : any) : ModelItf {
        Logger.warn("ModelItf - fromJSONObject : Method need to be implemented.");
        var model = new ModelItf(jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt); // for passing the tests with modelItf
	    return model;
    }

    cloneObject(modelClass : any, successCallbackModelItf : Function, failCallback : Function) {
	    Logger.debug("Clone de modelITF avec "+this.getId());
        if (!modelClass) {
            failCallback(new ModelException("The modelClasse argument must be given to clone the object."));
            return;
        }

	    if (!this.isComplete()) {
		    Logger.error("Error when cloning with object: "+JSON.stringify(this));
		    failCallback(new ModelException("The model must be complete in order to be cloned. ModelClass : "+modelClass.getTableName()));
		    return;
	    }

	    var self = this;
        var jsonInfo : any = this.toJSONObject();
        jsonInfo.id = null;
	    jsonInfo.complete = false;
        var clone = modelClass.fromJSONObject(jsonInfo);

	    var successUpdateModelItf = function () {
		    Logger.debug("Success update model itf ! "+self.getId());
		    successCallbackModelItf(clone);
	    };

	    var successCheckCompletenessModelItf = function () {
		    Logger.debug("Success check completeness model itf ! "+self.getId());

		    if (clone.isComplete()) {
			    clone.update(successUpdateModelItf, failCallback);
		    } else {
			    successUpdateModelItf();
		    }
	    };

	    var successCreateModelItf = function (data : any) {
		    Logger.debug("Success create model itf ! "+self.getId());
		    clone.checkCompleteness(successCheckCompletenessModelItf, failCallback);
	    };

        clone.create(successCreateModelItf, failCallback);
    }

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        Logger.warn("ModelItf - getTableName : Method need to be implemented.");
        return "";
    }

	static isObjectInsideArray(tableau : Array<ModelItf>, object : ModelItf) : boolean {
		for (var i = 0; i < tableau.length; i++) {
			if (tableau[i].getId() === object.getId()) {
				return true;
			}
		}
		return false;
	}

	static removeObjectFromArray(tableau : Array<ModelItf>, object : ModelItf) : boolean {
		for (var i = 0; i < tableau.length; i++) {
			if (tableau[i].getId() === object.getId()) {
				tableau.splice(i, 1);
				return true;
			}
		}
		return false;
	}
}