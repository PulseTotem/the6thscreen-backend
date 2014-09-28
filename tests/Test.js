var colors = require('colors');

var Logger = (function () {
    function Logger() {
    }
    Logger.useColor = function (status) {
        Logger.color = status;
    };

    Logger.debug = function (msg) {
        if (Logger.color && msg != null && msg != undefined && typeof (msg.toString()) !== "string") {
            console.log(msg.green);
        } else {
            console.log(msg);
        }
    };

    Logger.info = function (msg) {
        if (Logger.color && msg != null && msg != undefined && typeof (msg.toString()) !== "string") {
            console.log(msg.blue);
        } else {
            console.log(msg);
        }
    };

    Logger.warn = function (msg) {
        if (Logger.color && msg != null && msg != undefined && typeof (msg.toString()) !== "string") {
            console.log(msg.orange);
        } else {
            console.log(msg);
        }
    };

    Logger.error = function (msg) {
        if (Logger.color && msg != null && msg != undefined && typeof (msg.toString()) !== "string") {
            console.log(msg.red);
        } else {
            console.log(msg);
        }
    };
    Logger.color = true;
    return Logger;
})();
var Client = require('node-rest-client').Client;

var deasync = require('deasync');

var RestClient = (function () {
    function RestClient() {
    }
    RestClient.getClient = function () {
        if (RestClient.client == null) {
            RestClient.client = new Client();
        }
        return RestClient.client;
    };

    RestClient.get = function (url, successCallback, failCallback) {
        if (typeof successCallback === "undefined") { successCallback = null; }
        if (typeof failCallback === "undefined") { failCallback = null; }
        var success = null;
        var fail = null;

        if (successCallback != null) {
            success = successCallback;
        } else {
            success = function () {
                Logger.info("RestClient : Success to send GET message to URL '" + url + "'.");
            };
        }

        if (failCallback != null) {
            fail = failCallback;
        } else {
            fail = function () {
                Logger.warn("RestClient : Fail to send GET message to URL '" + url + "'.");
            };
        }

        RestClient.getClient().get(url, success).on('error', fail);
    };

    RestClient.getSync = function (url) {
        var done = false;
        var result = null;

        var success = function (data, response) {
            result = new Object();
            result["success"] = true;
            result["data"] = JSON.parse(data);
            result["response"] = response;

            done = true;
        };

        var fail = function (error) {
            result = new Object();
            result["success"] = false;
            result["error"] = error;

            done = true;
        };

        RestClient.getClient().get(url, success).on('error', fail);

        while (!done) {
            deasync.sleep(5);
        }

        return result;
    };

    RestClient.post = function (url, args, successCallback, failCallback) {
        if (typeof successCallback === "undefined") { successCallback = null; }
        if (typeof failCallback === "undefined") { failCallback = null; }
        var success = null;
        var fail = null;

        if (successCallback != null) {
            success = successCallback;
        } else {
            success = function () {
                Logger.info("RestClient : Success to send POST message to URL '" + url + "'.");
            };
        }

        if (failCallback != null) {
            fail = failCallback;
        } else {
            fail = function () {
                Logger.warn("RestClient : Fail to send POST message to URL '" + url + "'.");
            };
        }

        RestClient.getClient().post(url, args, success).on('error', fail);
    };

    RestClient.postSync = function (url, data) {
        var done = false;
        var result = null;

        var args = new Object();
        args["data"] = data;
        args["headers"] = new Object();
        args["headers"]["Content-Type"] = "application/json";

        var success = function (data, response) {
            result = new Object();
            result["success"] = true;
            result["data"] = JSON.parse(data);
            result["response"] = response;

            done = true;
        };

        var fail = function (error) {
            result = new Object();
            result["success"] = false;
            result["error"] = error;

            done = true;
        };

        RestClient.getClient().post(url, args, success).on('error', fail);

        while (!done) {
            deasync.sleep(5);
        }

        return result;
    };

    RestClient.put = function (url, args, successCallback, failCallback) {
        if (typeof successCallback === "undefined") { successCallback = null; }
        if (typeof failCallback === "undefined") { failCallback = null; }
        var success = null;
        var fail = null;

        if (successCallback != null) {
            success = successCallback;
        } else {
            success = function () {
                Logger.info("RestClient : Success to send PUT message to URL '" + url + "'.");
            };
        }

        if (failCallback != null) {
            fail = failCallback;
        } else {
            fail = function () {
                Logger.warn("RestClient : Fail to send PUT message to URL '" + url + "'.");
            };
        }

        RestClient.getClient().put(url, args, success).on('error', fail);
    };

    RestClient.putSync = function (url, data) {
        var done = false;
        var result = null;

        var args = new Object();
        args["data"] = data;
        args["headers"] = new Object();
        args["headers"]["Content-Type"] = "application/json";

        var success = function (data, response) {
            result = new Object();
            result["success"] = true;
            result["data"] = JSON.parse(data);
            result["response"] = response;

            done = true;
        };

        var fail = function (error) {
            result = new Object();
            result["success"] = false;
            result["error"] = error;

            done = true;
        };

        RestClient.getClient().put(url, args, success).on('error', fail);

        while (!done) {
            deasync.sleep(5);
        }

        return result;
    };

    RestClient.patch = function (url, args, successCallback, failCallback) {
        if (typeof successCallback === "undefined") { successCallback = null; }
        if (typeof failCallback === "undefined") { failCallback = null; }
        var success = null;
        var fail = null;

        if (successCallback != null) {
            success = successCallback;
        } else {
            success = function () {
                Logger.info("RestClient : Success to send PATCH message to URL '" + url + "'.");
            };
        }

        if (failCallback != null) {
            fail = failCallback;
        } else {
            fail = function () {
                Logger.warn("RestClient : Fail to send PATCH message to URL '" + url + "'.");
            };
        }

        RestClient.getClient().patch(url, args, success).on('error', fail);
    };

    RestClient.patchSync = function (url, data) {
        var done = false;
        var result = null;

        var args = new Object();
        args["data"] = data;
        args["headers"] = new Object();
        args["headers"]["Content-Type"] = "application/json";

        var success = function (data, response) {
            result = new Object();
            result["success"] = true;
            result["data"] = JSON.parse(data);
            result["response"] = response;

            done = true;
        };

        var fail = function (error) {
            result = new Object();
            result["success"] = false;
            result["error"] = error;

            done = true;
        };

        RestClient.getClient().patch(url, args, success).on('error', fail);

        while (!done) {
            deasync.sleep(5);
        }

        return result;
    };

    RestClient.delete = function (url, successCallback, failCallback) {
        if (typeof successCallback === "undefined") { successCallback = null; }
        if (typeof failCallback === "undefined") { failCallback = null; }
        var success = null;
        var fail = null;

        if (successCallback != null) {
            success = successCallback;
        } else {
            success = function () {
                Logger.info("RestClient : Success to send PATCH message to URL '" + url + "'.");
            };
        }

        if (failCallback != null) {
            fail = failCallback;
        } else {
            fail = function () {
                Logger.warn("RestClient : Fail to send PATCH message to URL '" + url + "'.");
            };
        }

        RestClient.getClient().delete(url, success).on('error', fail);
    };

    RestClient.deleteSync = function (url) {
        var done = false;
        var result = null;

        var success = function (data, response) {
            result = new Object();
            result["success"] = true;
            result["data"] = JSON.parse(data);
            result["response"] = response;

            done = true;
        };

        var fail = function (error) {
            result = new Object();
            result["success"] = false;
            result["error"] = error;

            done = true;
        };

        RestClient.getClient().delete(url, success).on('error', fail);

        while (!done) {
            deasync.sleep(5);
        }

        return result;
    };
    RestClient.client = null;
    return RestClient;
})();
var fs = require('fs');

var DatabaseConnection = (function () {
    function DatabaseConnection() {
    }
    DatabaseConnection.retrieveConnectionInformation = function () {
        if (DatabaseConnection.host == "" && DatabaseConnection.port == -1) {
            var file = __dirname + '/connection_infos.json';

            try  {
                var connectionInfos = JSON.parse(fs.readFileSync(file, 'utf8'));
                DatabaseConnection.host = connectionInfos.host;
                DatabaseConnection.port = parseInt(connectionInfos.port);
            } catch (e) {
                Logger.error("Connection configuration file can't be read.");
            }
        }
    };

    DatabaseConnection.getHost = function () {
        DatabaseConnection.retrieveConnectionInformation();
        return DatabaseConnection.host;
    };

    DatabaseConnection.getPort = function () {
        DatabaseConnection.retrieveConnectionInformation();
        return DatabaseConnection.port;
    };

    DatabaseConnection.getBaseURL = function () {
        return "http://" + DatabaseConnection.getHost() + ":" + DatabaseConnection.getPort().toString() + "/api";
    };
    DatabaseConnection.host = "";

    DatabaseConnection.port = -1;
    return DatabaseConnection;
})();
var ModelItf = (function () {
    function ModelItf(id) {
        this._id = id;
    }
    ModelItf.prototype.getId = function () {
        return this._id;
    };

    ModelItf.prototype.createObject = function (modelClass, data) {
        if (this.getId() != undefined) {
            return this.update();
        }

        var result = RestClient.postSync(DatabaseConnection.getBaseURL() + "/" + modelClass.getTableName(), data);

        if (result.success) {
            var response = result.data;
            if (response.status == "success") {
                if (Object.keys(response.data).length == 0) {
                    return false;
                } else {
                    this._id = response.data.id;
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    ModelItf.readObject = function (modelClass, id) {
        var result = RestClient.getSync(DatabaseConnection.getBaseURL() + "/" + modelClass.getTableName() + "/" + id.toString());

        if (result.success) {
            var response = result.data;
            if (response.status == "success") {
                if (Object.keys(response.data).length == 0) {
                    return null;
                } else {
                    return modelClass.fromJSONObject(response.data);
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    };

    ModelItf.prototype.updateObject = function (modelClass, data) {
        if (this.getId() == undefined) {
            return this.create();
        }

        var result = RestClient.putSync(DatabaseConnection.getBaseURL() + "/" + modelClass.getTableName() + "/" + this.getId().toString(), data);

        if (result.success) {
            var response = result.data;
            if (response.status == "success") {
                if (Object.keys(response.data).length == 0) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    ModelItf.prototype.deleteObject = function (modelClass) {
        if (this.getId() == undefined) {
            return false;
        }

        var result = RestClient.deleteSync(DatabaseConnection.getBaseURL() + "/" + modelClass.getTableName() + "/" + this.getId().toString());

        if (result.success) {
            var response = result.data;
            if (response.status == "success") {
                if (Object.keys(response.data).length == 0) {
                    this._id = undefined;
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    ModelItf.prototype.associateObject = function (modelClass1, modelClass2, id2) {
        if (this.getId() == undefined || id2 == undefined) {
            return false;
        }
        var associationURL = DatabaseConnection.getBaseURL() + "/" + modelClass1.getTableName() + "/" + this.getId().toString() + "/" + modelClass2.getTableName() + "/" + id2.toString();
        Logger.debug("ModelItf Associate Object with the following URL: " + associationURL);
        var result = RestClient.putSync(associationURL, {});

        if (result.success) {
            var response = result.data;
            if (response.status == "success") {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    ModelItf.prototype.deleteObjectAssociation = function (modelClass1, modelClass2, id2) {
        if (this.getId() == undefined || id2 == undefined) {
            return false;
        }
        var deleteAssoURL = DatabaseConnection.getBaseURL() + "/" + modelClass1.getTableName() + "/" + this.getId().toString() + "/" + modelClass2.getTableName() + "/" + id2.toString();
        Logger.debug("ModelItf Delete Association between Objects with the following URL: " + deleteAssoURL);
        var result = RestClient.deleteSync(deleteAssoURL);

        if (result.success) {
            var response = result.data;
            if (response.status == "success") {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    ModelItf.prototype.getAssociatedObjects = function (modelClass, modelClassAssociated, assoName) {
        if (this.getId() == undefined) {
            return false;
        }

        var result = RestClient.getSync(DatabaseConnection.getBaseURL() + "/" + modelClass.getTableName() + "/" + this.getId().toString() + "/" + modelClassAssociated.getTableName());

        if (result.success) {
            var response = result.data;
            if (response.status == "success") {
                if (Object.keys(response.data).length > 0) {
                    for (var i = 0; i < response.data.length; i++) {
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
    };

    ModelItf.prototype.getUniquelyAssociatedObject = function (modelClass, modelClassAssociated, assoName) {
        if (this.getId() == undefined) {
            return false;
        }

        var result = RestClient.getSync(DatabaseConnection.getBaseURL() + "/" + modelClass.getTableName() + "/" + this.getId().toString() + "/" + modelClassAssociated.getTableName());

        if (result.success) {
            var response = result.data;
            if (response.status == "success") {
                if (Object.keys(response.data).length === 1) {
                    for (var i = 0; i < response.data.length; i++) {
                        var object = response.data[i];
                        assoName = modelClassAssociated.fromJSONObject(object);
                    }
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    ModelItf.allObjects = function (modelClass) {
        var allModelItfs = new Array();

        var result = RestClient.getSync(DatabaseConnection.getBaseURL() + "/" + modelClass.getTableName());

        if (result.success) {
            var response = result.data;
            if (response.status == "success") {
                if (Object.keys(response.data).length > 0) {
                    for (var i = 0; i < response.data.length; i++) {
                        var obj = response.data[i];
                        allModelItfs.push(modelClass.fromJSONObject(obj));
                    }
                }
                return allModelItfs;
            } else {
                return null;
            }
        } else {
            return null;
        }
    };

    ModelItf.prototype.loadAssociations = function () {
    };

    ModelItf.prototype.create = function () {
        Logger.error("ModelItf - create : Method need to be implemented.");
        return false;
    };

    ModelItf.read = function (id) {
        Logger.error("ModelItf - read : Method need to be implemented.");
        return null;
    };

    ModelItf.prototype.update = function () {
        Logger.error("ModelItf - update : Method need to be implemented.");
        return false;
    };

    ModelItf.prototype.delete = function () {
        Logger.error("ModelItf - delete : Method need to be implemented.");
        return false;
    };

    ModelItf.all = function () {
        Logger.error("ModelItf - all : Method need to be implemented.");
        return null;
    };

    ModelItf.parseJSON = function (jsonString) {
        Logger.error("ModelItf - parseJSON : Method need to be implemented. It will look like : 'return \"ModelItf\".fromJSONObject(JSON.parse(jsonString));'");
        return null;
    };

    ModelItf.fromJSONObject = function (jsonObject) {
        Logger.error("ModelItf - fromJSONObject : Method need to be implemented.");
        return null;
    };

    ModelItf.getTableName = function () {
        Logger.error("ModelItf - getTableName : Method need to be implemented.");
        return "";
    };
    return ModelItf;
})();
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ParamValue = (function (_super) {
    __extends(ParamValue, _super);
    function ParamValue(value, id) {
        if (typeof id === "undefined") { id = null; }
        _super.call(this, id);

        if (this._value == null || this._value == "") {
            Logger.error("A ParamValue needs to have a value.");
        }

        this._value = value;
    }
    ParamValue.prototype.value = function () {
        return this._value;
    };

    ParamValue.prototype.setValue = function (value) {
        if (value == null || value == "") {
            Logger.error("A ParamValue needs to have a value.");
        }

        this._value = value;
    };

    ParamValue.prototype.paramType = function () {
        if (!this._paramType_loaded) {
            this._paramType_loaded = this.getUniquelyAssociatedObject(ParamValue, ParamType, this._paramType);
        }
        return this._paramType;
    };

    ParamValue.prototype.loadAssociations = function () {
        this.paramType();
    };

    ParamValue.prototype.toJSONObject = function () {
        var data = {
            "value": this.value()
        };

        return data;
    };

    ParamValue.prototype.setParamType = function (p) {
        return this.associateObject(ParamValue, ParamType, p.getId());
    };

    ParamValue.prototype.create = function () {
        return this.createObject(ParamValue, this.toJSONObject());
    };

    ParamValue.read = function (id) {
        return this.readObject(ParamValue, id);
    };

    ParamValue.prototype.update = function () {
        return this.updateObject(ParamValue, this.toJSONObject());
    };

    ParamValue.prototype.delete = function () {
        return this.deleteObject(ParamValue);
    };

    ParamValue.all = function () {
        return this.allObjects(ParamValue);
    };

    ParamValue.parseJSON = function (jsonString) {
        return ParamValue.fromJSONObject(JSON.parse(jsonString));
    };

    ParamValue.fromJSONObject = function (jsonObject) {
        if (typeof (jsonObject.value) == "undefined" || typeof (jsonObject.id) == "undefined") {
            return null;
        } else {
            return new ParamValue(jsonObject.value, jsonObject.id);
        }
    };

    ParamValue.getTableName = function () {
        return "ParamValues";
    };
    return ParamValue;
})(ModelItf);
var Renderer = (function (_super) {
    __extends(Renderer, _super);
    function Renderer(name, description, id) {
        if (typeof id === "undefined") { id = null; }
        _super.call(this, id);

        if (this._name == null || this._name == "") {
            Logger.error("A Renderer needs to have a name.");
        }

        this._name = name;

        if (this._description == null || this._description == "") {
            Logger.error("A Renderer needs to have a description.");
        }

        this._description = description;

        this._info_type = null;
        this._info_type_loaded = false;
    }
    Renderer.prototype.name = function () {
        return this._name;
    };

    Renderer.prototype.description = function () {
        return this._description;
    };

    Renderer.prototype.infoType = function () {
        if (!this._info_type_loaded) {
            this._info_type_loaded = this.getUniquelyAssociatedObject(Renderer, InfoType, this._info_type);
        }
        return this._info_type;
    };

    Renderer.prototype.loadAssociations = function () {
        this.infoType();
    };

    Renderer.prototype.toJSONObject = function () {
        var data = {
            "name": this.name(),
            "description": this.description()
        };

        return data;
    };

    Renderer.prototype.setInfoType = function (i) {
        return this.associateObject(Renderer, InfoType, i.getId());
    };

    Renderer.prototype.create = function () {
        return this.createObject(Renderer, this.toJSONObject());
    };

    Renderer.read = function (id) {
        return this.readObject(Renderer, id);
    };

    Renderer.prototype.update = function () {
        return this.updateObject(Renderer, this.toJSONObject());
    };

    Renderer.prototype.delete = function () {
        return this.deleteObject(Renderer);
    };

    Renderer.all = function () {
        return this.allObjects(Renderer);
    };

    Renderer.parseJSON = function (jsonString) {
        return Renderer.fromJSONObject(JSON.parse(jsonString));
    };

    Renderer.fromJSONObject = function (jsonObject) {
        if (typeof (jsonObject.name) == "undefined" || typeof (jsonObject.description) == "undefined" || typeof (jsonObject.id) == "undefined") {
            return null;
        } else {
            return new Renderer(jsonObject.name, jsonObject.description, jsonObject.id);
        }
    };

    Renderer.getTableName = function () {
        return "Renderers";
    };
    return Renderer;
})(ModelItf);
var InfoType = (function (_super) {
    __extends(InfoType, _super);
    function InfoType(name, id) {
        if (typeof id === "undefined") { id = null; }
        _super.call(this, id);

        this.setName(name);

        this._sources = new Array();
        this._sources_loaded = false;

        this._renderers = new Array();
        this._renderers_loaded = false;
    }
    InfoType.prototype.setName = function (name) {
        if (name == null || name == "") {
            Logger.error("An InfoType needs to have a name.");
        }

        this._name = name;
    };

    InfoType.prototype.name = function () {
        return this._name;
    };

    InfoType.prototype.sources = function () {
        if (!this._sources_loaded) {
            this._sources_loaded = this.getAssociatedObjects(InfoType, Source, this._sources);
        }
        return this._sources;
    };

    InfoType.prototype.renderers = function () {
        if (!this._renderers_loaded) {
            this._renderers_loaded = this.getAssociatedObjects(InfoType, Renderer, this._renderers);
        }
        return this._renderers;
    };

    InfoType.prototype.loadAssociations = function () {
        this.renderers();
        this.sources();
    };

    InfoType.prototype.toJSONObject = function () {
        var data = {
            "name": this.name()
        };

        return data;
    };

    InfoType.prototype.addSource = function (s) {
        return this.associateObject(InfoType, Source, s.getId());
    };

    InfoType.prototype.addRenderer = function (r) {
        return this.associateObject(InfoType, Renderer, r.getId());
    };

    InfoType.prototype.create = function () {
        return this.createObject(InfoType, this.toJSONObject());
    };

    InfoType.read = function (id) {
        return this.readObject(InfoType, id);
    };

    InfoType.prototype.update = function () {
        return this.updateObject(InfoType, this.toJSONObject());
    };

    InfoType.prototype.delete = function () {
        return this.deleteObject(InfoType);
    };

    InfoType.all = function () {
        return this.allObjects(InfoType);
    };

    InfoType.parseJSON = function (jsonString) {
        return InfoType.fromJSONObject(JSON.parse(jsonString));
    };

    InfoType.fromJSONObject = function (jsonObject) {
        if (typeof (jsonObject.name) == "undefined" || typeof (jsonObject.id) == "undefined") {
            return null;
        } else {
            return new InfoType(jsonObject.name, jsonObject.id);
        }
    };

    InfoType.getTableName = function () {
        return "InfoTypes";
    };
    return InfoType;
})(ModelItf);
var TypeParamType = (function (_super) {
    __extends(TypeParamType, _super);
    function TypeParamType(name, id) {
        if (typeof id === "undefined") { id = null; }
        _super.call(this, id);

        if (this._name == null || this._name == "") {
            Logger.error("A TypeParamType needs to have a name.");
        }

        this._name = name;
    }
    TypeParamType.prototype.name = function () {
        return this._name;
    };

    TypeParamType.prototype.toJSONObject = function () {
        var data = {
            "name": this.name()
        };

        return data;
    };

    TypeParamType.prototype.create = function () {
        return this.createObject(TypeParamType, this.toJSONObject());
    };

    TypeParamType.read = function (id) {
        return this.readObject(TypeParamType, id);
    };

    TypeParamType.prototype.update = function () {
        return this.updateObject(TypeParamType, this.toJSONObject());
    };

    TypeParamType.prototype.delete = function () {
        return this.deleteObject(TypeParamType);
    };

    TypeParamType.all = function () {
        return this.allObjects(TypeParamType);
    };

    TypeParamType.parseJSON = function (jsonString) {
        return TypeParamType.fromJSONObject(JSON.parse(jsonString));
    };

    TypeParamType.fromJSONObject = function (jsonObject) {
        if (typeof (jsonObject.name) == "undefined" || typeof (jsonObject.id) == "undefined") {
            return null;
        } else {
            return new TypeParamType(jsonObject.name, jsonObject.id);
        }
    };

    TypeParamType.getTableName = function () {
        return "TypeParamTypes";
    };
    return TypeParamType;
})(ModelItf);
var ConstraintParamType = (function (_super) {
    __extends(ConstraintParamType, _super);
    function ConstraintParamType(name, description, id) {
        if (typeof id === "undefined") { id = null; }
        _super.call(this, id);

        this.setName(name);
        this.setDescription(description);

        this._type = null;
        this._type_loading = false;
    }
    ConstraintParamType.prototype.setName = function (name) {
        if (name == null || name == "") {
            Logger.error("A ConstraintParamType needs to have a name.");
        }

        this._name = name;
    };

    ConstraintParamType.prototype.setDescription = function (description) {
        if (description == null || description == "") {
            Logger.error("A ConstraintParamType needs to have a description.");
        }

        this._description = description;
    };

    ConstraintParamType.prototype.name = function () {
        return this._name;
    };

    ConstraintParamType.prototype.description = function () {
        return this._description;
    };

    ConstraintParamType.prototype.type = function () {
        if (!this._type_loading) {
            this._type_loading = this.getUniquelyAssociatedObject(ConstraintParamType, TypeParamType, this._type);
        }
        return this._type;
    };

    ConstraintParamType.prototype.loadAssociations = function () {
        this.type();
    };

    ConstraintParamType.prototype.toJSONObject = function () {
        var data = {
            "name": this.name(),
            "description": this.description()
        };

        return data;
    };

    ConstraintParamType.prototype.setType = function (t) {
        if (this.type() !== null) {
            throw new Error("The type is already set for this ConstraintParamType.");
        }

        if (t === null || t.getId() === undefined) {
            throw new Error("The type must be an existing object to be associated.");
        }

        if (this.associateObject(ConstraintParamType, TypeParamType, t.getId())) {
            this._type = t;
            this._type_loading = true;
            return true;
        } else {
            return false;
        }
    };

    ConstraintParamType.prototype.unsetType = function () {
        if (this.type() === null) {
            throw new Error("No type has been set for this constraintParamType.");
        }

        if (this.deleteObjectAssociation(ConstraintParamType, TypeParamType, this.type().getId())) {
            this._type = null;
            this._type_loading = false;
            return true;
        } else {
            return false;
        }
    };

    ConstraintParamType.prototype.create = function () {
        return this.createObject(ConstraintParamType, this.toJSONObject());
    };

    ConstraintParamType.read = function (id) {
        return this.readObject(ConstraintParamType, id);
    };

    ConstraintParamType.prototype.update = function () {
        return this.updateObject(ConstraintParamType, this.toJSONObject());
    };

    ConstraintParamType.prototype.delete = function () {
        return this.deleteObject(ConstraintParamType);
    };

    ConstraintParamType.all = function () {
        return this.allObjects(ConstraintParamType);
    };

    ConstraintParamType.parseJSON = function (jsonString) {
        return ConstraintParamType.fromJSONObject(JSON.parse(jsonString));
    };

    ConstraintParamType.fromJSONObject = function (jsonObject) {
        if (typeof (jsonObject.name) == "undefined" || typeof (jsonObject.id) == "undefined") {
            return null;
        } else {
            return new ConstraintParamType(jsonObject.name, jsonObject.id);
        }
    };

    ConstraintParamType.getTableName = function () {
        return "ConstraintParamTypes";
    };
    return ConstraintParamType;
})(ModelItf);
var ParamType = (function (_super) {
    __extends(ParamType, _super);
    function ParamType(name, description, id) {
        if (typeof id === "undefined") { id = null; }
        _super.call(this, id);

        if (this._name == null || this._name == "") {
            Logger.error("A ParamType needs to have a name.");
        }

        this._name = name;

        if (this._description == null || this._description == "") {
            Logger.error("A ParamType needs to have a description.");
        }

        this._description = description;
    }
    ParamType.prototype.name = function () {
        return this._name;
    };

    ParamType.prototype.description = function () {
        return this._description;
    };

    ParamType.prototype.type = function () {
        if (!this._type_loaded) {
            this._type_loaded = this.getUniquelyAssociatedObject(ParamType, TypeParamType, this._type);
        }
        return this._type;
    };

    ParamType.prototype.constraint = function () {
        if (!this._constraint_loaded) {
            this._constraint_loaded = this.getUniquelyAssociatedObject(ParamType, ConstraintParamType, this._constraint);
        }
        return this._constraint;
    };

    ParamType.prototype.defaultValue = function () {
        if (!this._default_value_loaded) {
            this._default_value_loaded = this.getUniquelyAssociatedObject(ParamType, ParamValue, this._default_value);
        }
        return this._default_value;
    };

    ParamType.prototype.loadAssociations = function () {
        this.type();
        this.constraint();
        this.defaultValue();
    };

    ParamType.prototype.toJSONObject = function () {
        var data = {
            "name": this.name(),
            "description": this.description()
        };

        return data;
    };

    ParamType.prototype.setType = function (t) {
        return this.associateObject(ParamType, TypeParamType, t.getId());
    };

    ParamType.prototype.setConstraint = function (c) {
        return this.associateObject(ParamType, ConstraintParamType, c.getId());
    };

    ParamType.prototype.setDefaultValue = function (d) {
        return this.associateObject(ParamType, ParamValue, d.getId());
    };

    ParamType.prototype.create = function () {
        return this.createObject(ParamType, this.toJSONObject());
    };

    ParamType.read = function (id) {
        return this.readObject(ParamType, id);
    };

    ParamType.prototype.update = function () {
        return this.updateObject(ParamType, this.toJSONObject());
    };

    ParamType.prototype.delete = function () {
        return this.deleteObject(ParamType);
    };

    ParamType.all = function () {
        return this.allObjects(ParamType);
    };

    ParamType.parseJSON = function (jsonString) {
        return ParamType.fromJSONObject(JSON.parse(jsonString));
    };

    ParamType.fromJSONObject = function (jsonObject) {
        if (typeof (jsonObject.name) == "undefined" || typeof (jsonObject.description) == "undefined" || typeof (jsonObject.id) == "undefined") {
            return null;
        } else {
            return new ParamType(jsonObject.name, jsonObject.description, jsonObject.id);
        }
    };

    ParamType.getTableName = function () {
        return "ParamTypes";
    };
    return ParamType;
})(ModelItf);
var Source = (function (_super) {
    __extends(Source, _super);
    function Source(name, service, description, host, port, id) {
        if (typeof id === "undefined") { id = null; }
        _super.call(this, id);

        if (this._name == null || this._name == "") {
            Logger.error("A Source needs to have a name.");
        }

        this._name = name;

        if (this._service == null || this._service == "") {
            Logger.error("A Source needs to have a service.");
        }

        this._service = service;

        if (this._description == null || this._description == "") {
            Logger.error("A Source needs to have a description.");
        }

        this._description = description;

        if (this._host == null || this._host == "") {
            Logger.error("A Source needs to have a host.");
        }

        this._host = host;

        if (this._port == null || this._port < 0) {
            Logger.error("A Source needs to have a correct port number.");
        }

        this._port = port;

        this._info_type = null;
        this._info_type_loaded = false;

        this._param_types = new Array();
        this._param_types_loaded = false;

        this._param_values = new Array();
        this._param_values_loaded = false;
    }
    Source.prototype.name = function () {
        return this._name;
    };

    Source.prototype.service = function () {
        return this._service;
    };

    Source.prototype.description = function () {
        return this._description;
    };

    Source.prototype.host = function () {
        return this._host;
    };

    Source.prototype.port = function () {
        return this._port;
    };

    Source.prototype.infoType = function () {
        if (!this._info_type_loaded) {
            this._info_type_loaded = this.getUniquelyAssociatedObject(Source, InfoType, this._info_type);
        }
        return this._info_type;
    };

    Source.prototype.paramTypes = function () {
        if (!this._param_types_loaded) {
            this._param_types_loaded = this.getAssociatedObjects(Source, ParamType, this._param_types);
        }
        return this._param_types;
    };

    Source.prototype.paramValues = function () {
        if (!this._param_values_loaded) {
            this._param_values_loaded = this.getAssociatedObjects(Source, ParamValue, this._param_values);
        }
        return this._param_values;
    };

    Source.prototype.loadAssociations = function () {
        this.paramTypes();
        this.paramValues();
        this.infoType();
    };

    Source.prototype.toJSONObject = function () {
        var data = {
            "name": this.name(),
            "service": this.service(),
            "description": this.description(),
            "host": this.host(),
            "port": this.port()
        };

        return data;
    };

    Source.prototype.setInfoType = function (i) {
        return this.associateObject(Source, InfoType, i.getId());
    };

    Source.prototype.addParamType = function (p) {
        return this.associateObject(Source, ParamType, p.getId());
    };

    Source.prototype.addParamValue = function (p) {
        return this.associateObject(Source, ParamValue, p.getId());
    };

    Source.prototype.create = function () {
        return this.createObject(Source, this.toJSONObject());
    };

    Source.read = function (id) {
        return this.readObject(Source, id);
    };

    Source.prototype.update = function () {
        return this.updateObject(Source, this.toJSONObject());
    };

    Source.prototype.delete = function () {
        return this.deleteObject(Source);
    };

    Source.all = function () {
        return this.allObjects(Source);
    };

    Source.parseJSON = function (jsonString) {
        return Source.fromJSONObject(JSON.parse(jsonString));
    };

    Source.fromJSONObject = function (jsonObject) {
        if (typeof (jsonObject.name) == "undefined" || typeof (jsonObject.service) == "undefined" || typeof (jsonObject.description) == "undefined" || typeof (jsonObject.host) == "undefined" || typeof (jsonObject.port) == "undefined" || typeof (jsonObject.id) == "undefined") {
            return null;
        } else {
            return new Source(jsonObject.name, jsonObject.service, jsonObject.description, jsonObject.host, jsonObject.port, jsonObject.id);
        }
    };

    Source.getTableName = function () {
        return "Sources";
    };
    return Source;
})(ModelItf);
var ReceivePolicy = (function (_super) {
    __extends(ReceivePolicy, _super);
    function ReceivePolicy(name, id) {
        if (typeof id === "undefined") { id = null; }
        _super.call(this, id);

        if (this._name == null || this._name == "") {
            Logger.error("A ReceivePolicy needs to have a name.");
        }

        this._name = name;
    }
    ReceivePolicy.prototype.name = function () {
        return this._name;
    };

    ReceivePolicy.prototype.toJSONObject = function () {
        var data = {
            "name": this.name()
        };

        return data;
    };

    ReceivePolicy.prototype.create = function () {
        return this.createObject(ReceivePolicy, this.toJSONObject());
    };

    ReceivePolicy.read = function (id) {
        return this.readObject(ReceivePolicy, id);
    };

    ReceivePolicy.prototype.update = function () {
        return this.updateObject(ReceivePolicy, this.toJSONObject());
    };

    ReceivePolicy.prototype.delete = function () {
        return this.deleteObject(ReceivePolicy);
    };

    ReceivePolicy.all = function () {
        return this.allObjects(ReceivePolicy);
    };

    ReceivePolicy.parseJSON = function (jsonString) {
        return ReceivePolicy.fromJSONObject(JSON.parse(jsonString));
    };

    ReceivePolicy.fromJSONObject = function (jsonObject) {
        if (typeof (jsonObject.name) == "undefined" || typeof (jsonObject.id) == "undefined") {
            return null;
        } else {
            return new ReceivePolicy(jsonObject.name, jsonObject.id);
        }
    };

    ReceivePolicy.getTableName = function () {
        return "ReceivePolicys";
    };
    return ReceivePolicy;
})(ModelItf);
var RenderPolicy = (function (_super) {
    __extends(RenderPolicy, _super);
    function RenderPolicy(name, description, id) {
        if (typeof id === "undefined") { id = null; }
        _super.call(this, id);

        if (this._name == null || this._name == "") {
            Logger.error("A RenderPolicy needs to have a name.");
        }

        this._name = name;

        if (this._description == null || this._description == "") {
            Logger.error("A RenderPolicy needs to have a description.");
        }

        this._description = description;
    }
    RenderPolicy.prototype.name = function () {
        return this._name;
    };

    RenderPolicy.prototype.description = function () {
        return this._description;
    };

    RenderPolicy.prototype.toJSONObject = function () {
        var data = {
            "name": this.name(),
            "description": this.description()
        };
        return data;
    };

    RenderPolicy.prototype.create = function () {
        return this.createObject(RenderPolicy, this.toJSONObject());
    };

    RenderPolicy.read = function (id) {
        return this.readObject(RenderPolicy, id);
    };

    RenderPolicy.prototype.update = function () {
        return this.updateObject(RenderPolicy, this.toJSONObject());
    };

    RenderPolicy.prototype.delete = function () {
        return this.deleteObject(RenderPolicy);
    };

    RenderPolicy.all = function () {
        return this.allObjects(RenderPolicy);
    };

    RenderPolicy.parseJSON = function (jsonString) {
        return RenderPolicy.fromJSONObject(JSON.parse(jsonString));
    };

    RenderPolicy.fromJSONObject = function (jsonObject) {
        if (typeof (jsonObject.name) == "undefined" || typeof (jsonObject.description) == "undefined" || typeof (jsonObject.id) == "undefined") {
            return null;
        } else {
            return new RenderPolicy(jsonObject.name, jsonObject.description, jsonObject.id);
        }
    };

    RenderPolicy.getTableName = function () {
        return "RenderPolicys";
    };
    return RenderPolicy;
})(ModelItf);
var CallType = (function (_super) {
    __extends(CallType, _super);
    function CallType(name, description, id) {
        if (typeof id === "undefined") { id = null; }
        _super.call(this, id);

        this.setName(name);
        this.setDescription(description);

        this._source = null;
        this._source_loaded = false;

        this._renderer = null;
        this._renderer_loaded = false;

        this._receive_policy = null;
        this._receive_policy_loaded = false;

        this._render_policy = null;
        this._render_policy_loaded = false;

        this._calls = new Array();
        this._calls_loaded = false;
    }
    CallType.prototype.setName = function (name) {
        if (name == null || name == "") {
            Logger.error("A CallType needs to have a name.");
        }

        this._name = name;
    };

    CallType.prototype.setDescription = function (description) {
        if (description == null || description == "") {
            Logger.error("A CallType needs to have a description.");
        }

        this._description = description;
    };

    CallType.prototype.name = function () {
        return this._name;
    };

    CallType.prototype.description = function () {
        return this._description;
    };

    CallType.prototype.source = function () {
        if (!this._source_loaded) {
            this._source_loaded = this.getUniquelyAssociatedObject(CallType, Source, this._source);
        }
        return this._source;
    };

    CallType.prototype.renderer = function () {
        if (!this._renderer_loaded) {
            this._renderer_loaded = this.getUniquelyAssociatedObject(CallType, Renderer, this._renderer);
        }
        return this._renderer;
    };

    CallType.prototype.receivePolicy = function () {
        if (!this._receive_policy_loaded) {
            this._receive_policy_loaded = this.getUniquelyAssociatedObject(CallType, ReceivePolicy, this._receive_policy);
        }
        return this._receive_policy;
    };

    CallType.prototype.renderPolicy = function () {
        if (!this._render_policy_loaded) {
            this._render_policy_loaded = this.getUniquelyAssociatedObject(CallType, RenderPolicy, this._render_policy);
        }
        return this._render_policy;
    };

    CallType.prototype.calls = function () {
        if (!this._calls_loaded) {
            this._calls_loaded = this.getAssociatedObjects(CallType, Call, this._calls);
        }
        return this._calls;
    };

    CallType.prototype.loadAssociations = function () {
        this.source();
        this.renderer();
        this.receivePolicy();
        this.renderPolicy();
        this.calls();
    };

    CallType.prototype.toJSONObject = function () {
        var data = {
            "name": this.name(),
            "description": this.description()
        };

        return data;
    };

    CallType.prototype.setSource = function (s) {
        if (this.source() !== null) {
            throw new Error("The source is already set for this CallType.");
        }

        if (s === null || s.getId() === undefined) {
            throw new Error("The source must be an existing object to be associated.");
        }

        if (this.associateObject(CallType, Source, s.getId())) {
            this._source = s;
            this._source_loaded = true;
            return true;
        } else {
            return false;
        }
    };

    CallType.prototype.unsetSource = function () {
        if (this.source() === null) {
            throw new Error("No source has been set for this callType.");
        }

        if (this.deleteObjectAssociation(CallType, Source, this.source().getId())) {
            this._source = null;
            this._source_loaded = false;
            return true;
        } else {
            return false;
        }
    };

    CallType.prototype.setRenderer = function (r) {
        if (this.renderer() !== null) {
            throw new Error("The renderer is already set for this CallType.");
        }

        if (r === null || r.getId() === undefined) {
            throw new Error("The renderer must be an existing object to be associated.");
        }

        if (this.associateObject(CallType, Renderer, r.getId())) {
            this._renderer = r;
            this._renderer_loaded = true;
            return true;
        } else {
            return false;
        }
    };

    CallType.prototype.unsetRenderer = function () {
        if (this.renderer() === null) {
            throw new Error("No renderer has been set for this callType.");
        }

        if (this.deleteObjectAssociation(CallType, Renderer, this.renderer().getId())) {
            this._renderer = null;
            this._renderer_loaded = false;
            return true;
        } else {
            return false;
        }
    };

    CallType.prototype.setReceivePolicy = function (rp) {
        if (this.receivePolicy() !== null) {
            throw new Error("The receivePolicy is already set for this CallType.");
        }

        if (rp === null || rp.getId() === undefined) {
            throw new Error("The receivePolicy must be an existing object to be associated.");
        }

        if (this.associateObject(CallType, ReceivePolicy, rp.getId())) {
            this._receive_policy = rp;
            this._receive_policy_loaded = true;
            return true;
        } else {
            return false;
        }
    };

    CallType.prototype.unsetReceivePolicy = function () {
        if (this.receivePolicy() === null) {
            throw new Error("No receivePolicy has been set for this callType.");
        }

        if (this.deleteObjectAssociation(CallType, ReceivePolicy, this.receivePolicy().getId())) {
            this._receive_policy = null;
            this._receive_policy_loaded = false;
            return true;
        } else {
            return false;
        }
    };

    CallType.prototype.setRenderPolicy = function (rp) {
        if (this.renderPolicy() !== null) {
            throw new Error("The renderPolicy is already set for this CallType.");
        }

        if (rp === null || rp.getId() === undefined) {
            throw new Error("The renderPolicy must be an existing object to be associated.");
        }

        if (this.associateObject(CallType, RenderPolicy, rp.getId())) {
            this._render_policy = rp;
            this._render_policy_loaded = true;
            return true;
        } else {
            return false;
        }
    };

    CallType.prototype.unsetRenderPolicy = function () {
        if (this.renderPolicy() === null) {
            throw new Error("No RenderPolicy has been set for this callType.");
        }

        if (this.deleteObjectAssociation(CallType, RenderPolicy, this.renderPolicy().getId())) {
            this._render_policy = null;
            this._render_policy_loaded = false;
            return true;
        } else {
            return false;
        }
    };

    CallType.prototype.addCall = function (c) {
        if (this.calls().indexOf(c) !== -1) {
            throw new Error("You cannot add twice a call in a call.");
        }
        if (c === null || c.getId() === undefined) {
            throw new Error("The call must be an existing object to be associated.");
        }

        if (this.associateObject(CallType, Call, c.getId())) {
            this.calls().push(c);
            return true;
        } else {
            return false;
        }
    };

    CallType.prototype.create = function () {
        return this.createObject(CallType, this.toJSONObject());
    };

    CallType.read = function (id) {
        return this.readObject(CallType, id);
    };

    CallType.prototype.update = function () {
        return this.updateObject(CallType, this.toJSONObject());
    };

    CallType.prototype.delete = function () {
        return this.deleteObject(CallType);
    };

    CallType.all = function () {
        return this.allObjects(CallType);
    };

    CallType.parseJSON = function (jsonString) {
        return CallType.fromJSONObject(JSON.parse(jsonString));
    };

    CallType.fromJSONObject = function (jsonObject) {
        if (typeof (jsonObject.name) == "undefined" || typeof (jsonObject.description) == "undefined" || typeof (jsonObject.id) == "undefined") {
            return null;
        } else {
            return new CallType(jsonObject.name, jsonObject.description, jsonObject.id);
        }
    };

    CallType.getTableName = function () {
        return "CallTypes";
    };
    return CallType;
})(ModelItf);
var Timeline = (function (_super) {
    __extends(Timeline, _super);
    function Timeline(name, description, id) {
        if (typeof id === "undefined") { id = null; }
        _super.call(this, id);

        if (this._name == null || this._name == "") {
            Logger.error("A Timeline needs to have a name.");
        }

        this._name = name;

        if (this._description == null || this._description == "") {
            Logger.error("A Timeline needs to have a description.");
        }

        this._description = description;

        this._profils = new Array();
        this._profils_loaded = false;
    }
    Timeline.prototype.name = function () {
        return this._name;
    };

    Timeline.prototype.description = function () {
        return this._description;
    };

    Timeline.prototype.profils = function () {
        if (!this._profils_loaded) {
            this._profils_loaded = this.getAssociatedObjects(Timeline, Profil, this._profils);
        }
        return this._profils;
    };

    Timeline.prototype.loadAssociations = function () {
        this.profils();
    };

    Timeline.prototype.toJSONObject = function () {
        var data = {
            "name": this.name(),
            "description": this.description()
        };
        return data;
    };

    Timeline.prototype.addProfil = function (p) {
        return this.associateObject(Timeline, Profil, p.getId());
    };

    Timeline.prototype.create = function () {
        return this.createObject(Timeline, this.toJSONObject());
    };

    Timeline.read = function (id) {
        return this.readObject(Timeline, id);
    };

    Timeline.prototype.update = function () {
        return this.updateObject(Timeline, this.toJSONObject());
    };

    Timeline.prototype.delete = function () {
        return this.deleteObject(Timeline);
    };

    Timeline.all = function () {
        return this.allObjects(Timeline);
    };

    Timeline.parseJSON = function (jsonString) {
        return Timeline.fromJSONObject(JSON.parse(jsonString));
    };

    Timeline.fromJSONObject = function (jsonObject) {
        if (typeof (jsonObject.name) == "undefined" || typeof (jsonObject.description) == "undefined" || typeof (jsonObject.id) == "undefined") {
            return null;
        } else {
            return new Timeline(jsonObject.name, jsonObject.description, jsonObject.id);
        }
    };

    Timeline.getTableName = function () {
        return "Timelines";
    };
    return Timeline;
})(ModelItf);
var Profil = (function (_super) {
    __extends(Profil, _super);
    function Profil(name, description, id) {
        if (typeof id === "undefined") { id = null; }
        _super.call(this, id);

        this.setName(name);

        this.setDescription(description);

        this._calls = new Array();
        this._calls_loaded = false;

        this._timelines = new Array();
        this._timelines_loaded = false;
    }
    Profil.prototype.name = function () {
        return this._name;
    };

    Profil.prototype.setName = function (name) {
        if (name == null || name == "") {
            Logger.error("A Profil needs to have a name.");
        }

        this._name = name;
    };

    Profil.prototype.description = function () {
        return this._description;
    };

    Profil.prototype.setDescription = function (description) {
        if (description == null || description == "") {
            Logger.error("A Profil needs to have a description.");
        }

        this._description = description;
    };

    Profil.prototype.calls = function () {
        if (!this._calls_loaded) {
            this._calls_loaded = this.getAssociatedObjects(Profil, Call, this._calls);
        }
        return this._calls;
    };

    Profil.prototype.timelines = function () {
        if (!this._timelines_loaded) {
            this._timelines_loaded = this.getAssociatedObjects(Profil, Timeline, this._timelines);
        }
        return this._timelines;
    };

    Profil.prototype.loadAssociations = function () {
        this.calls();
        this.timelines();
    };

    Profil.prototype.toJSONObject = function () {
        var data = {
            "name": this.name(),
            "description": this.description()
        };
        return data;
    };

    Profil.prototype.addCall = function (c) {
        return this.associateObject(Profil, Call, c.getId());
    };

    Profil.prototype.addTimeline = function (t) {
        return this.associateObject(Profil, Timeline, t.getId());
    };

    Profil.prototype.create = function () {
        return this.createObject(Profil, this.toJSONObject());
    };

    Profil.read = function (id) {
        return ModelItf.readObject(Profil, id);
    };

    Profil.prototype.update = function () {
        return this.updateObject(Profil, this.toJSONObject());
    };

    Profil.prototype.delete = function () {
        return this.deleteObject(Profil);
    };

    Profil.all = function () {
        return ModelItf.allObjects(Profil);
    };

    Profil.parseJSON = function (jsonString) {
        return Profil.fromJSONObject(JSON.parse(jsonString));
    };

    Profil.fromJSONObject = function (jsonObject) {
        if (typeof (jsonObject.name) == "undefined" || typeof (jsonObject.description) == "undefined" || typeof (jsonObject.id) == "undefined") {
            return null;
        } else {
            return new Profil(jsonObject.name, jsonObject.description, jsonObject.id);
        }
    };

    Profil.getTableName = function () {
        return "Profils";
    };
    return Profil;
})(ModelItf);
var Call = (function (_super) {
    __extends(Call, _super);
    function Call(name, id) {
        if (typeof id === "undefined") { id = null; }
        _super.call(this, id);

        this.setName(name);

        this._param_values = new Array();
        this._param_values_loaded = false;

        this._call_type = null;
        this._call_type_loaded = false;

        this._profil = null;
        this._profil_loaded = false;
    }
    Call.prototype.name = function () {
        return this._name;
    };

    Call.prototype.setName = function (name) {
        if (name == null || name == "") {
            Logger.error("A Call needs to have a name.");
        }

        this._name = name;
    };

    Call.prototype.paramValues = function () {
        if (!this._param_values_loaded) {
            this._param_values_loaded = this.getAssociatedObjects(Call, ParamValue, this._param_values);
        }
        return this._param_values;
    };

    Call.prototype.profil = function () {
        if (!this._profil_loaded) {
            this._profil_loaded = this.getUniquelyAssociatedObject(Call, Profil, this._profil);
        }
        return this._profil;
    };

    Call.prototype.callType = function () {
        if (!this._call_type_loaded) {
            this._call_type_loaded = this.getUniquelyAssociatedObject(Call, CallType, this._call_type);
        }
        return this._call_type;
    };

    Call.prototype.loadAssociations = function () {
        this.paramValues();
        this.profil();
        this.callType();
    };

    Call.prototype.toJSONObject = function () {
        var data = { "name": this.name() };
        return data;
    };

    Call.prototype.addParamValue = function (p) {
        if (this.paramValues().indexOf(p) !== -1) {
            throw new Error("You cannot add twice a parameter in a call.");
        }
        if (p === null || p.getId() === undefined) {
            throw new Error("The ParamValue must be an existing object to be associated.");
        }

        if (this.associateObject(Call, ParamValue, p.getId())) {
            this.paramValues().push(p);
            return true;
        } else {
            return false;
        }
    };

    Call.prototype.removeParamValue = function (p) {
        var indexValue = this.paramValues().indexOf(p);
        if (indexValue === -1) {
            throw new Error("The ParamValue you try to remove has not been added to the current Call");
        }

        if (this.deleteObjectAssociation(Call, ParamValue, p.getId())) {
            this.paramValues().splice(indexValue, 1);
            return true;
        } else {
            return false;
        }
    };

    Call.prototype.setProfil = function (p) {
        if (this.profil() !== null) {
            throw new Error("The profil is already set for the call : " + this + ".");
        }
        if (p === null || p.getId() === undefined) {
            throw new Error("The Profil must be an existing object to be associated.");
        }

        if (this.associateObject(Call, Profil, p.getId())) {
            this._profil = p;
            this._profil_loaded = true;
            return true;
        } else {
            return false;
        }
    };

    Call.prototype.unsetProfil = function () {
        if (this.profil() === null) {
            throw new Error("No profil has been set for this call.");
        }

        if (this.deleteObjectAssociation(Call, Profil, this.profil().getId())) {
            this._profil = null;
            this._profil_loaded = false;
            return true;
        } else {
            return false;
        }
    };

    Call.prototype.setCallType = function (ct) {
        if (this.callType() !== null) {
            throw new Error("The CallType is already set for the call : " + this + ".");
        }
        if (ct === undefined || ct === null) {
            throw new Error("The CallType must be an existing object to be associated.");
        }

        if (this.associateObject(Call, CallType, ct.getId())) {
            this._call_type = ct;
            this._call_type_loaded = true;
            return true;
        } else {
            return false;
        }
    };

    Call.prototype.unsetCallType = function () {
        if (this.callType() === null) {
            throw new Error("No CallType has been set for this call.");
        }

        if (this.deleteObjectAssociation(Call, CallType, this.callType().getId())) {
            this._call_type = null;
            this._call_type_loaded = false;
            return true;
        } else {
            return false;
        }
    };

    Call.prototype.create = function () {
        return this.createObject(Call, this.toJSONObject());
    };

    Call.read = function (id) {
        return this.readObject(Call, id);
    };

    Call.prototype.update = function () {
        return this.updateObject(Call, this.toJSONObject());
    };

    Call.prototype.delete = function () {
        return this.deleteObject(Call);
    };

    Call.all = function () {
        return this.allObjects(Call);
    };

    Call.parseJSON = function (jsonString) {
        return Call.fromJSONObject(JSON.parse(jsonString));
    };

    Call.fromJSONObject = function (jsonObject) {
        if (typeof (jsonObject.name) == "undefined" || typeof (jsonObject.id) == "undefined") {
            return null;
        } else {
            return new Call(jsonObject.name, jsonObject.id);
        }
    };

    Call.getTableName = function () {
        return "Calls";
    };
    return Call;
})(ModelItf);
var assert = require("assert");

describe('Call', function () {
    it('should have right name', function () {
        var c = new Call("A name!");
        assert.equal(c.name(), "A name!");
    });
});
