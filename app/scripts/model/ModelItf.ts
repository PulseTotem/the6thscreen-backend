/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../core/Logger.ts" />
/// <reference path="../core/RestClient.ts" />
/// <reference path="../core/RestClientResponse.ts" />
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

	// TODO : In all following methods, we need to log errors!
    /**
     * Create model object in database.
     *
     * @method createObject
     * @param {ModelItf Class} modelClass - The model to create.
     * @param {Object} data - The data necessary to create object.
     * @return {boolean} Create status
     */
    createObject(modelClass : any, data : any) : boolean {

	    if (!modelClass || !data) {
		    throw new ModelException("To create an object the modelClass and the data of the object must be given.");
	    }

	    // if the object already exists we throw an error
        if (!!this.getId()) {
            throw new ModelException("Trying to create an already existing object with ID:"+this.getId()+", tableName: '"+modelClass.getTableName()+"' and data: "+JSON.stringify(data));
        }

	    var urlCreateObject = DatabaseConnection.getBaseURL() + DatabaseConnection.modelEndpoint(modelClass.getTableName());
	    Logger.debug("[ModelItf] Create a new object : "+urlCreateObject+" with data : "+JSON.stringify(data));

        var result : RestClientResponse = RestClient.postSync(urlCreateObject, data);

        if(result.success()) {
            var response = result.data();
            if(response.status == "success") {
                if(response.data === undefined || Object.keys(response.data).length == 0 || response.data.id === undefined) {
	                throw new DataException("The response is a success but the data appears to be empty or does not have the right signature when creating an object with URL: "+urlCreateObject+" and datas: "+JSON.stringify(data)+"\nResponse data: "+JSON.stringify(response.data));
                } else {
                    this._id = response.data.id;
                    return true;
                }
            } else {
	            throw new ResponseException("The request failed on the server when trying to create an object with URL:"+urlCreateObject+" and datas : "+JSON.stringify(data)+".\nMessage : "+JSON.stringify(response));
            }
        } else {
	        throw new RequestException("The request failed when trying to create an object with URL:"+urlCreateObject+" and datas : "+JSON.stringify(data)+".\nCode : "+result.statusCode()+"\nMessage : "+result.response());
        }
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method readObject
     * @static
     * @param {ModelItf Class} modelClass - The model to retrieve.
     * @param {number} id - The model instance's id.
     */
    static readObject(modelClass : any, id : number) {
	    if (!modelClass || !id) {
		    throw new ModelException("To read an object the modelClass and the id must be given.");
	    }

	    var urlReadObject = DatabaseConnection.getBaseURL() + DatabaseConnection.objectEndpoint(modelClass.getTableName(), id.toString());
	    Logger.debug("[ModelItf] Read an object : "+urlReadObject);

        var result : RestClientResponse = RestClient.getSync(urlReadObject);

        if(result.success()) {
            var response = result.data();
            if(response.status == "success") {
                if(response.data === undefined || Object.keys(response.data).length == 0 ||response.data.id === undefined) {
	                throw new DataException("The response is a success but the data appears to be empty or does not have the right signature when reading an object with URL: "+urlReadObject+"\nResponse data: "+JSON.stringify(response.data));
                } else {
                    return modelClass.fromJSONObject(response.data);
                }
            } else {
	            throw new ResponseException("The request failed on the server when trying to read an object with URL:"+urlReadObject+".\nMessage : "+JSON.stringify(response));
            }
        } else {
	        throw new RequestException("The request failed when trying to read an object with URL:"+urlReadObject+".\nCode : "+result.statusCode()+"\nMessage : "+result.response());
        }
    }

    /**
     * Update model object in database.
     *
     * @method updateObject
     * @param {ModelItf Class} modelClass - The model to update.
     * @param {Object} data - The data necessary to update object.
     * @return {boolean} Update status
     */
     updateObject(modelClass : any, data : any) : boolean {

	    if (!modelClass || !data) {
		    throw new ModelException("To update an object, the modelClass and the datas must be given.");
	    }

	    // if the object does not exist yet, we need to create it instead updating!
        if(!this.getId()) {
            throw new ModelException("The object does not exist yet. It can't be update. Datas: "+JSON.stringify(data));
        }

	    var urlUpdate = DatabaseConnection.getBaseURL() + DatabaseConnection.objectEndpoint(modelClass.getTableName(), this.getId().toString());
	    Logger.debug("[ModelItf] Update an object with the URL : "+urlUpdate+" and data : "+JSON.stringify(data));

        var result : RestClientResponse = RestClient.putSync(urlUpdate, data);

        if(result.success()) {
            var response = result.data();
	        if(response.status == "success") {
		        if(response.data === undefined || Object.keys(response.data).length == 0 || response.data.id === undefined) {
			        throw new DataException("The response is a success but the data appears to be empty or does not have the right signature when updating an object with URL: "+urlUpdate+" and datas: "+JSON.stringify(data)+"\nResponse data: "+JSON.stringify(response.data));
		        } else {
			        return true;
		        }
	        } else {
		        throw new ResponseException("The request failed on the server when trying to update an object with URL:"+urlUpdate+" and datas : "+JSON.stringify(data)+".\nMessage : "+JSON.stringify(response));
	        }
        } else {
	        throw new RequestException("The request failed when trying to update an object with URL:"+urlUpdate+" and datas : "+JSON.stringify(data)+".\nCode : "+result.statusCode()+"\nMessage : "+result.response());
        }
    }

    /**
     * Delete model object in database.
     *
     * @method deleteObject
     * @param {ModelItf Class} modelClass - The model to delete.
     * @return {boolean} Delete status
     */
    deleteObject(modelClass : any) : boolean {
	    if (!modelClass) {
		    throw new ModelException("To delete an object, the modelClass must be given.");
	    }

        if (!this.getId()) {
	        throw new ModelException("The object does not exist yet. It can't be delete in database.");
        }

	    var urlDelete = DatabaseConnection.getBaseURL() + DatabaseConnection.objectEndpoint(modelClass.getTableName(), this.getId().toString());
	    Logger.debug("[ModelItf] Delete an object with the URL : "+urlDelete);

        var result : RestClientResponse = RestClient.deleteSync(urlDelete);

        if(result.success()) {
            var response = result.data();
            if(response.status == "success") {
                this._id = null;
                return true;
            } else {
	            throw new ResponseException("The request failed on the server when trying to delete an object with URL:"+urlDelete+".\nMessage : "+JSON.stringify(response));
            }
        } else {
	        throw new RequestException("The request failed when trying to delete an object with URL:"+urlDelete+".\nCode : "+result.statusCode()+"\nMessage : "+result.response());
        }
    }

	/**
	 * Retrieve all model objects in database.
	 *
	 * @method allObjects
	 * @static
	 * @param {ModelItf Class} modelClass - The model to retrieve all instances.
	 * @return {Array<ModelItf>} The model instances.
	 */
	static allObjects(modelClass : any) {
		if (!modelClass) {
			throw new ModelException("To retrieve all objects, the modelClass must be given.");
		}

		var allModelItfs : any = new Array();

		var urlAll = DatabaseConnection.getBaseURL() + DatabaseConnection.modelEndpoint(modelClass.getTableName());
		Logger.debug("[ModelItf] Read all objects with the URL: "+urlAll);

		var result : RestClientResponse = RestClient.getSync(urlAll);

		if(result.success()) {
			var response = result.data();
			if(response.status == "success") {
				if(response.data === undefined || !(response.data instanceof Array)) {
					throw new DataException("The data appears to be empty or does not have the right signature when retrieving all objects with URL: "+urlAll+"\nResponse data: "+JSON.stringify(response.data));
				} else {
					for(var i = 0; i < response.data.length; i++) {
						var obj = response.data[i];
						if (obj.id === undefined) {
							throw new DataException("One data does not have any ID when retrieving all objects with URL: "+urlAll+"\nResponse data: "+JSON.stringify(response.data));
						} else {
							allModelItfs.push(modelClass.fromJSONObject(obj));
						}
					}
				}
				return allModelItfs;
			} else {
				throw new ResponseException("The request failed on the server when trying to retrieve all objects with URL:"+urlAll+".\nMessage : "+JSON.stringify(response));
			}
		} else {
			throw new RequestException("The request failed when trying to retrieve all objects with URL:"+urlAll+".\nCode : "+result.statusCode()+"\nMessage : "+result.response());
		}
	}

	/**
	 * Associate two objects in database.
	 *
	 * @method associateObject
	 * @param {ModelItf Class} modelClass1 - the first model class
	 * @param {ModelItf Class} modelClass2 - the second model class
	 * @param {number} id2 - the ID of the second object
	 * @return {boolean} Association status
	 */
	associateObject(modelClass1 : any, modelClass2: any, id2 : number) : boolean {
		if (!this.getId()) {
			throw new ModelException("The object to be associated does not exist yet. The association can't be created.");
		}
		if (!modelClass1 || !modelClass2 || !id2) {
			throw new ModelException("The two modelClasses and the ID of the second objects must be given to create the association.");
		}

		var associationURL = DatabaseConnection.getBaseURL() + DatabaseConnection.associatedObjectEndpoint(modelClass1.getTableName(), this.getId().toString(), modelClass2.getTableName(), id2.toString());
		Logger.debug("[ModelItf] Associate an object with the following URL: "+associationURL);

		var result : RestClientResponse = RestClient.putSync(associationURL, {});

		if(result.success()) {
			var response = result.data();
			if(response.status == "success") {
				return true;
			} else {
				throw new ResponseException("The request failed on the server when trying to associate objects with URL:"+associationURL+".\nMessage : "+JSON.stringify(response));
			}
		} else {
			throw new RequestException("The request failed when trying to associate objects with URL:"+associationURL+".\nCode : "+result.statusCode()+"\nMessage : "+result.response());
		}
	}

	/**
	 * Remove an association between two objects in database.
	 *
     * @method deleteObjectAssociation
	 * @param {ModelItf Class} modelClass1 the model class of the first object
	 * @param {ModelItf Class} modelClass2 the model class of the second object
	 * @param {number} id2 the ID of the second object
	 * @returns {boolean} returns true if the deletion works well.
	 */
	deleteObjectAssociation(modelClass1 : any, modelClass2 : any, id2 : number) : boolean {
		if (!this.getId()) {
			throw new ModelException("An association can't be deleted if the object does not exist.");
		}
		if (!modelClass1 || !modelClass2 || !id2) {
			throw new ModelException("The two modelClasses and the ID of the second objects must be given to delete the association.");
		}
		var deleteAssoURL = DatabaseConnection.getBaseURL() + DatabaseConnection.associatedObjectEndpoint(modelClass1.getTableName(), this.getId().toString(), modelClass2.getTableName(), id2.toString());
		Logger.debug("[ModelItf] Delete Association between Objects with the following URL: "+deleteAssoURL);

		var result : RestClientResponse = RestClient.deleteSync(deleteAssoURL);

		if(result.success()) {
			var response = result.data();
			if(response.status == "success") {
				return true;
			} else {
				throw new ResponseException("The request failed on the server when trying to delete an association between objects with URL:"+deleteAssoURL+".\nMessage : "+JSON.stringify(response));
			}
		} else {
			throw new RequestException("The request failed when trying to delete an association between objects with URL:"+deleteAssoURL+".\nCode : "+result.statusCode()+"\nMessage : "+result.response());
		}
	}

	/**
	 * Retrieve all associated objects
	 *
     * @method getAssociatedObjects
	 * @param modelClass - the first model class, corresponding to the object responsible to get associated objects
	 * @param modelClassAssociated - the second model class, corresponding to the objects retrieved
	 * @param assoName - the array in which the objects have to be pushed
	 * @returns {boolean}
	 */
	getAssociatedObjects(modelClass : any, modelClassAssociated : any, assoName : Array<ModelItf>) : boolean {
		if (this.getId() == undefined) {
			return false;
		}

		var urlAssociatedObjects = DatabaseConnection.getBaseURL() + DatabaseConnection.associationEndpoint(modelClass.getTableName(), this.getId().toString(), modelClassAssociated.getTableName());
		Logger.debug("[ModelItf] Get associated objects with the URL: "+urlAssociatedObjects);

		var result : RestClientResponse = RestClient.getSync(urlAssociatedObjects);

		if(result.success()) {
			var response = result.data();
			if(response.status == "success") {
				if(Object.keys(response.data).length > 0) {
					for(var i = 0; i < response.data.length; i++) {
						var object = response.data[i];
						assoName.push(modelClassAssociated.fromJSONObject(object));
					}
					return true;
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	/**
	 * Retrieve all associated objects
	 *
	 * @method getUniquelyAssociatedObject
	 * @param modelClass - the first model class, corresponding to the object responsible to get associated objects
	 * @param modelClassAssociated - the second model class, corresponding to the objects retrieved
	 * @param assoName - where the object have to be saved
	 * @returns {boolean}
	 */
	getUniquelyAssociatedObject(modelClass : any, modelClassAssociated : any, assoName : Array<ModelItf>) : boolean {
		if (this.getId() == undefined) {
			return false;
		}
		var urlUniqueAssociatedOject = DatabaseConnection.getBaseURL() + DatabaseConnection.associationEndpoint(modelClass.getTableName(), this.getId().toString(), modelClassAssociated.getTableName());
		Logger.debug("[ModelItf] Get a uniquely associated object with the URL: "+urlUniqueAssociatedOject);

		var result : RestClientResponse = RestClient.getSync(urlUniqueAssociatedOject);

		if(result.success()) {
			var response = result.data();
			if(response.status == "success") {
				var object = response.data;
				assoName.push(modelClassAssociated.fromJSONObject(object));
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}



    //////////////////// Methods managing model. Connections to database. ///////////////////////////

	/**
	 * Load all the lazy loading properties of the object.
	 * Useful when you want to get a complete object.
     *
     * @method loadAssociations
	 */
	loadAssociations() : void {}

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
     * @return {boolean} Create status
     */
    create() : boolean {
        Logger.error("ModelItf - create : Method need to be implemented.");
        return false;
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {ModelItf} The model instance.
     */
    static read(id : number) : ModelItf {
        Logger.error("ModelItf - read : Method need to be implemented.");
        return null;
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        Logger.error("ModelItf - update : Method need to be implemented.");
        return false;
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        Logger.error("ModelItf - delete : Method need to be implemented.");
        return false;
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<ModelItf>} The model instances.
     */
    static all() : Array<ModelItf> {
        Logger.error("ModelItf - all : Method need to be implemented.");
        return null;
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
	 * @returns {Object} a JSON Object representing the instance
	 */
	toCompleteJSONObject() : Object {
		return this.toJSONObject();
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
        Logger.error("ModelItf - parseJSON : Method need to be implemented. It will look like : 'return \"ModelItf\".fromJSONObject(JSON.parse(jsonString));'");
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
        Logger.error("ModelItf - fromJSONObject : Method need to be implemented.");
        return new ModelItf(jsonObject.id); // for passing the tests with modelItf
    }

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        Logger.error("ModelItf - getTableName : Method need to be implemented.");
        return "";
    }
}