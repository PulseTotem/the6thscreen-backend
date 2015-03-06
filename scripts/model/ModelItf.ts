/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/RestClient.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/RestClientResponse.ts" />
/// <reference path="../core/DatabaseConnection.ts" />
/// <reference path="../exceptions/DataException.ts" />
/// <reference path="../exceptions/RequestException.ts" />
/// <reference path="../exceptions/ResponseException.ts" />
/// <reference path="../exceptions/ModelException.ts" />

/**
 * Model Interface
 *
 * @class ModelItf
 */
class ModelItf {

	static NULLID = null;

    /**
     * ID property.
     *
     * @property _id
     * @type number
     */
    _id : number;

    /**
     * Constructor.
     *
     * @param {number} id - The model ID.
     */
    constructor(id : number) {
	    if (!id && id !== ModelItf.NULLID) {
		    throw new ModelException("The ID cannot be undefined");
	    }
        this._id = id;
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
     * Create model object in database.
     *
     * @method createObject
     * @param {ModelItf Class} modelClass - The model to create.
     * @param {Object} data - The data necessary to create object.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    createObject(modelClass : any, data : any, successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {

        var self = this;

	    if (!modelClass || !data) {
            failCallback(new ModelException("To create an object the modelClass and the data of the object must be given."), attemptNumber);
            return;
	    }

	    // if the object already exists we throw an error
        if (!!this.getId()) {
            failCallback(new ModelException("Trying to create an already existing object with ID:"+this.getId()+", tableName: '"+modelClass.getTableName()+"' and data: "+JSON.stringify(data)), attemptNumber);
            return;
        }

        var success : Function = function(result) {
            var response = result.data();
            if(response.status == "success") {
                if(response.data === undefined || Object.keys(response.data).length == 0 || response.data.id === undefined) {
                    failCallback(new DataException("The response is a success but the data appears to be empty or does not have the right signature when creating an object with URL: "+urlCreateObject+" and datas: "+JSON.stringify(data)+"\nResponse data: "+JSON.stringify(response.data)), attemptNumber);
                } else {
                    self._id = response.data.id;
                    successCallback();
                }
            } else {
                failCallback(new ResponseException("The request failed on the server when trying to create an object with URL:"+urlCreateObject+" and datas : "+JSON.stringify(data)+".\nMessage : "+JSON.stringify(response)), attemptNumber);
            }
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to create an object with URL:"+urlCreateObject+" and datas : "+JSON.stringify(data)+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()), attemptNumber);
        };

	    var urlCreateObject = DatabaseConnection.getBaseURL() + DatabaseConnection.modelEndpoint(modelClass.getTableName());

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
    static readObject(modelClass : any, id : number, successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
        if (!modelClass || !id) {
            failCallback(new ModelException("To read an object the modelClass and the id must be given."), id, attemptNumber);
            return;
        }

        var success : Function = function(result) {
            var response = result.data();
            if(response.status == "success") {
                if(response.data === undefined || Object.keys(response.data).length == 0 ||response.data.id === undefined) {
                    failCallback(new DataException("The response is a success but the data appears to be empty or does not have the right signature when reading an object with URL: "+urlReadObject+"\nResponse data: "+JSON.stringify(response.data)), id, attemptNumber);
                } else {
                    successCallback(modelClass.fromJSONObject(response.data));
                }
            } else {
                failCallback(new ResponseException("The request failed on the server when trying to read an object with URL:"+urlReadObject+".\nMessage : "+JSON.stringify(response)), id, attemptNumber);
            }
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to read an object with URL:"+urlReadObject+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()), id, attemptNumber);
        };

        var urlReadObject = DatabaseConnection.getBaseURL() + DatabaseConnection.objectEndpoint(modelClass.getTableName(), id.toString());

        RestClient.get(urlReadObject, success, fail);
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
     updateObject(modelClass : any, data : any, successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
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
            if(response.status == "success") {
                if(response.data === undefined || Object.keys(response.data).length == 0 || response.data.id === undefined) {
                    failCallback(new DataException("The response is a success but the data appears to be empty or does not have the right signature when updating an object with URL: "+urlUpdate+" and datas: "+JSON.stringify(data)+"\nResponse data: "+JSON.stringify(response.data)), attemptNumber);
                } else {
                    successCallback();
                }
            } else {
                failCallback(new ResponseException("The request failed on the server when trying to update an object with URL:"+urlUpdate+" and datas : "+JSON.stringify(data)+".\nMessage : "+JSON.stringify(response)), attemptNumber);
            }
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to update an object with URL:"+urlUpdate+" and datas : "+JSON.stringify(data)+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()), attemptNumber);
        };

	    var urlUpdate = DatabaseConnection.getBaseURL() + DatabaseConnection.objectEndpoint(modelClass.getTableName(), this.getId().toString());
	    //Logger.debug("[ModelItf] Update an object with the URL : "+urlUpdate+" and data : "+JSON.stringify(data));

        RestClient.put(urlUpdate, data, success, fail);
    }

    /**
     * Delete model object in database.
     *
     * @method deleteObject
     * @param {ModelItf Class} modelClass - The model to delete.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    deleteObject(modelClass : any, successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
	    var self = this;

        if (!modelClass) {
            failCallback(new ModelException("To delete an object, the modelClass must be given."), attemptNumber);
            return;
	    }

        if (!this.getId()) {
            failCallback(new ModelException("The object does not exist yet. It can't be delete in database."), attemptNumber);
            return;
        }

        var success : Function = function(result) {
            var response = result.data();
            if(response.status == "success") {
                self._id = null;
                successCallback();
            } else {
                failCallback(new ResponseException("The request failed on the server when trying to delete an object with URL:"+urlDelete+".\nMessage : "+JSON.stringify(response)), attemptNumber);
            }
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to delete an object with URL:"+urlDelete+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()), attemptNumber);
        };

	    var urlDelete = DatabaseConnection.getBaseURL() + DatabaseConnection.objectEndpoint(modelClass.getTableName(), this.getId().toString());
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
	static allObjects(modelClass : any, successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
		if (!modelClass) {
            failCallback(new ModelException("To retrieve all objects, the modelClass must be given."), attemptNumber);
            return;
		}

        var success : Function = function(result) {
            var response = result.data();
            if(response.status == "success") {
                var allModelItfs : any = new Array();
                if(response.data === undefined || !(response.data instanceof Array)) {
                    failCallback(new DataException("The data appears to be empty or does not have the right signature when retrieving all objects with URL: "+urlAll+"\nResponse data: "+JSON.stringify(response.data)), attemptNumber);
                } else {
                    for(var i = 0; i < response.data.length; i++) {
                        var obj = response.data[i];
                        if (obj.id === undefined) {
                            failCallback(new DataException("One data does not have any ID when retrieving all objects with URL: "+urlAll+"\nResponse data: "+JSON.stringify(response.data)), attemptNumber);
                            return;
                        } else {
                            allModelItfs.push(modelClass.fromJSONObject(obj));
                        }
                    }
                    successCallback(allModelItfs);
                }

            } else {
                failCallback(new ResponseException("The request failed on the server when trying to retrieve all objects with URL:"+urlAll+".\nMessage : "+JSON.stringify(response)), attemptNumber);
            }
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to retrieve all objects with URL:"+urlAll+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()), attemptNumber);
        };

		var urlAll = DatabaseConnection.getBaseURL() + DatabaseConnection.modelEndpoint(modelClass.getTableName());

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
	associateObject(modelClass1 : any, modelClass2: any, id2 : number, successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
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
            if(response.status == "success") {
                successCallback();
            } else {
                failCallback(new ResponseException("The request failed on the server when trying to associate objects with URL:"+associationURL+".\nMessage : "+JSON.stringify(response)), attemptNumber);
            }
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to associate objects with URL:"+associationURL+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()), attemptNumber);
        };

		var associationURL = DatabaseConnection.getBaseURL() + DatabaseConnection.associatedObjectEndpoint(modelClass1.getTableName(), this.getId().toString(), modelClass2.getTableName(), id2.toString());

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
	deleteObjectAssociation(modelClass1 : any, modelClass2 : any, id2 : number, successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
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
            if(response.status == "success") {
                successCallback();
            } else {
                failCallback(new ResponseException("The request failed on the server when trying to delete an association between objects with URL:"+deleteAssoURL+".\nMessage : "+JSON.stringify(response)), attemptNumber);
            }
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to delete an association between objects with URL:"+deleteAssoURL+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()), attemptNumber);
        };

		var deleteAssoURL = DatabaseConnection.getBaseURL() + DatabaseConnection.associatedObjectEndpoint(modelClass1.getTableName(), this.getId().toString(), modelClass2.getTableName(), id2.toString());

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
    getAssociatedObjects(modelClass : any, modelClassAssociated : any, successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
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
            if(response.status == "success") {
                if(response.data === undefined || !(response.data instanceof Array)) {
                    failCallback(new DataException("The data appears to be empty or does not have the right signature when retrieving all objects with URL: "+urlAssociatedObjects+"\nResponse data: "+JSON.stringify(response.data)), attemptNumber);
                } else {
                    var assoName : Array<ModelItf> = new Array<ModelItf>();
                    for(var i = 0; i < response.data.length; i++) {
                        var object = response.data[i];
                        if (object.id === undefined) {
                            failCallback(new DataException("One data does not have any ID when retrieving all objects with URL: "+urlAssociatedObjects+"\nResponse data: "+JSON.stringify(response.data)), attemptNumber);
                            return;
                        } else {
                            assoName.push(modelClassAssociated.fromJSONObject(object));
                        }
                    }
                    successCallback(assoName);
                }
            } else {
                failCallback(new ResponseException("The request failed on the server when trying to retrieve all objects with URL:"+urlAssociatedObjects+".\nMessage : "+JSON.stringify(response)), attemptNumber);
            }
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to retrieve all associated objects with URL:"+urlAssociatedObjects+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()), attemptNumber);
        };

        var urlAssociatedObjects = DatabaseConnection.getBaseURL() + DatabaseConnection.associationEndpoint(modelClass.getTableName(), this.getId().toString(), modelClassAssociated.getTableName());

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
    getUniquelyAssociatedObject(modelClass : any, modelClassAssociated : any, successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
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
            if(response.status == "success") {

                // in that case there is no data to retrieve
                if ((response.data instanceof Array) && (response.data.length == 0)) {
                    successCallback(null);
                    return;
                }
                if(response.data === undefined || response.data.id === undefined) {
                    failCallback(new DataException("The response is a success but the data does not have the right signature when retrieving a uniquely associated object with URL: "+urlUniqueAssociatedOject+"\nResponse data: "+JSON.stringify(response.data)), attemptNumber);
                } else {
                    successCallback(modelClassAssociated.fromJSONObject(response.data));
                }
            } else {
                failCallback(new ResponseException("The request failed on the server when trying to retrieve a uniquely associated objects with URL:"+urlUniqueAssociatedOject+".\nMessage : "+JSON.stringify(response)), attemptNumber);
            }
        };

        var fail : Function = function(result) {
            failCallback(new RequestException("The request failed when trying to retrieve a uniquely associated objects with URL:"+urlUniqueAssociatedOject+".\nCode : "+result.statusCode()+"\nMessage : "+result.response()), attemptNumber);
        };

        var urlUniqueAssociatedOject = DatabaseConnection.getBaseURL() + DatabaseConnection.associationEndpoint(modelClass.getTableName(), this.getId().toString(), modelClassAssociated.getTableName());

        RestClient.get(urlUniqueAssociatedOject, success, fail);
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
    create(successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
        Logger.error("ModelItf - create : Method need to be implemented.");
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
    static read(id : number, successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
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
    update(successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
        Logger.error("ModelItf - update : Method need to be implemented.");
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    delete(successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
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
    static all(successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
        Logger.error("ModelItf - all : Method need to be implemented.");
    }

	/**
	 * Serialize an array of ModelItf instances to a JSON Object.
	 * It is used in some implementation of "toCompleteJSONObject"
	 *
	 * @param {Array<ModelItf>} tableau an array of ModelItf instances
	 * @returns {Array} an array of JSON Objects
	 */
	serializeArray(tableau : Array<ModelItf>) : Object {
		var data = [];
		for (var i = 0; i < tableau.length; i++) {
			data.push(tableau[i].toJSONObject());
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
	static completeArraySerialization(tableau : Array<ModelItf>, successCallback : Function = null, failCallback : Function = null) {
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
	toJSONObject() : Object {
		var data = { "id": this.getId() };
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
    toCompleteJSONObject(successCallback : Function = null, failCallback : Function = null) {
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
        return new ModelItf(jsonObject.id); // for passing the tests with modelItf
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