/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../libsdef/node-rest-client.d.ts" />

/// <reference path="./Logger.ts" />

var Client = require('node-rest-client').Client;

var deasync = require('deasync');

/**
 * Represents a REST client.
 *
 * @class RestClient
 */
class RestClient {

    /**
     * Client.
     *
     * @property client
     * @type any
     * @static
     */
    static client : any = null;

    /**
     * Return the REST client from lib.
     *
     * @method getClient
     * @static
     */
    static getClient() {
        if(RestClient.client == null) {
            RestClient.client = new Client();
        }
        return RestClient.client;
    }

    /**
     * Send a GET message to URL in parameter, in an asynchronous way.
     *
     * @method get
     * @static
     * @param {string} url - The url to get.
     * @param {any} successCallback - The callback function when success.
     * @param {any} failCallback - The callback function when fail.
     */
    static get(url : string, successCallback : any = null, failCallback : any = null) {
        var success = null;
        var fail = null;

        if(successCallback != null) {
            success = successCallback;
        } else {
            success = function() {
                Logger.info("RestClient : Success to send GET message to URL '" + url + "'.");
            };
        }

        if(failCallback != null) {
            fail = failCallback;
        } else {
            fail = function() {
                Logger.warn("RestClient : Fail to send GET message to URL '" + url + "'.");
            };
        }

        RestClient.getClient().get(url, success).on('error',fail);
    }

    /**
     * Send a GET message to URL in parameter, in a synchronous way.
     *
     * @method getSync
     * @static
     * @param {string} url - The url to get.
     */
    static getSync(url : string) {

            var done = false;
            var result = null;

            var success = function(data, response) {
                result = new Object();
                result["success"] = true;
                result["data"] = JSON.parse(data);
                result["response"] = response;

                done = true;
            };

            var fail = function(error) {
                result = new Object();
                result["success"] = false;
                result["error"] = error;

                done = true;
            };

            RestClient.getClient().get(url, success).on('error',fail);

            while(!done) {
                deasync.sleep(5);
            }

            return result;
    }

    /**
     * Send a POST message to URL in parameter, in an asynchronous way.
     *
     * @method post
     * @static
     * @param {string} url - The url to post.
     * @param {JSONObject} args - The arguments for POST message. Schema for this JSON Object is :
     *  {
     *      data: { test: "hello" },
     *      headers:{"Content-Type": "application/json"}
     *  };
     * @param {any} successCallback - The callback function when success.
     * @param {any} failCallback - The callback function when fail.
     */
    static post(url : string, args : any, successCallback : any = null, failCallback : any = null) {
        var success = null;
        var fail = null;

        if(successCallback != null) {
            success = successCallback;
        } else {
            success = function() {
                Logger.info("RestClient : Success to send POST message to URL '" + url + "'.");
            };
        }

        if(failCallback != null) {
            fail = failCallback;
        } else {
            fail = function() {
                Logger.warn("RestClient : Fail to send POST message to URL '" + url + "'.");
            };
        }

        RestClient.getClient().post(url, args, success).on('error',fail);
    }

    /**
     * Send a POST message to URL in parameter, in a synchronous way.
     *
     * @method postSync
     * @static
     * @param {string} url - The url to post.
     * @param {JSONObject} data - The data for POST message.
     */
    static postSync(url : string, data : any) {

        var done = false;
        var result = null;

        var args = new Object();
        args["data"] = data;
        args["headers"] = new Object();
        args["headers"]["Content-Type"] = "application/json";

        var success = function(data, response) {
            result = new Object();
            result["success"] = true;
            result["data"] = JSON.parse(data);
            result["response"] = response;

            done = true;
        };

        var fail = function(error) {
            result = new Object();
            result["success"] = false;
            result["error"] = error;

            done = true;
        };

        RestClient.getClient().post(url, args, success).on('error',fail);

        while(!done) {
            deasync.sleep(5);
        }

        return result;
    }

    /**
     * Send a PUT message to URL in parameter, in an asynchronous way.
     *
     * @method put
     * @static
     * @param {string} url - The url to post.
     * @param {JSONObject} args - The arguments for PUT message. Schema for this JSON Object is :
     *  {
     *      data: { test: "hello" },
     *      headers:{"Content-Type": "application/json"}
     *  };
     * @param {any} successCallback - The callback function when success.
     * @param {any} failCallback - The callback function when fail.
     */
    static put(url : string, args : any, successCallback : any = null, failCallback : any = null) {
        var success = null;
        var fail = null;

        if(successCallback != null) {
            success = successCallback;
        } else {
            success = function() {
                Logger.info("RestClient : Success to send PUT message to URL '" + url + "'.");
            };
        }

        if(failCallback != null) {
            fail = failCallback;
        } else {
            fail = function() {
                Logger.warn("RestClient : Fail to send PUT message to URL '" + url + "'.");
            };
        }

        RestClient.getClient().put(url, args, success).on('error',fail);
    }

    /**
     * Send a PUT message to URL in parameter, in a synchronous way.
     *
     * @method putSync
     * @static
     * @param {string} url - The url to put.
     * @param {JSONObject} data - The data for PUT message.
     */
    static putSync(url : string, data : any) {

        var done = false;
        var result = null;

        var args = new Object();
        args["data"] = data;
        args["headers"] = new Object();
        args["headers"]["Content-Type"] = "application/json";

        var success = function(data, response) {
            result = new Object();
            result["success"] = true;
            result["data"] = JSON.parse(data);
            result["response"] = response;

            done = true;
        };

        var fail = function(error) {
            result = new Object();
            result["success"] = false;
            result["error"] = error;

            done = true;
        };

        RestClient.getClient().put(url, args, success).on('error',fail);

        while(!done) {
            deasync.sleep(5);
        }

        return result;
    }

    /**
     * Send a PATCH message to URL in parameter, in an asynchronous way.
     *
     * @method patch
     * @static
     * @param {string} url - The url to post.
     * @param {JSONObject} args - The arguments for PATCH message. Schema for this JSON Object is :
     *  {
     *      data: { test: "hello" },
     *      headers:{"Content-Type": "application/json"}
     *  };
     * @param {any} successCallback - The callback function when success.
     * @param {any} failCallback - The callback function when fail.
     */
    static patch(url : string, args : any, successCallback : any = null, failCallback : any = null) {
        var success = null;
        var fail = null;

        if(successCallback != null) {
            success = successCallback;
        } else {
            success = function() {
                Logger.info("RestClient : Success to send PATCH message to URL '" + url + "'.");
            };
        }

        if(failCallback != null) {
            fail = failCallback;
        } else {
            fail = function() {
                Logger.warn("RestClient : Fail to send PATCH message to URL '" + url + "'.");
            };
        }

        RestClient.getClient().patch(url, args, success).on('error',fail);
    }

    /**
     * Send a PATCH message to URL in parameter, in a synchronous way.
     *
     * @method patchSync
     * @static
     * @param {string} url - The url to patch.
     * @param {JSONObject} data - The data for PATCH message.
     */
    static patchSync(url : string, data : any) {

        var done = false;
        var result = null;

        var args = new Object();
        args["data"] = data;
        args["headers"] = new Object();
        args["headers"]["Content-Type"] = "application/json";

        var success = function(data, response) {
            result = new Object();
            result["success"] = true;
            result["data"] = JSON.parse(data);
            result["response"] = response;

            done = true;
        };

        var fail = function(error) {
            result = new Object();
            result["success"] = false;
            result["error"] = error;

            done = true;
        };

        RestClient.getClient().patch(url, args, success).on('error',fail);

        while(!done) {
            deasync.sleep(5);
        }

        return result;
    }

    /**
     * Send a DELETE message to URL in parameter, in an asynchronous way.
     *
     * @method delete
     * @static
     * @param {string} url - The url to post.
     * @param {any} successCallback - The callback function when success.
     * @param {any} failCallback - The callback function when fail.
     */
    static delete(url : string, successCallback : any = null, failCallback : any = null) {
        var success = null;
        var fail = null;

        if(successCallback != null) {
            success = successCallback;
        } else {
            success = function() {
                Logger.info("RestClient : Success to send PATCH message to URL '" + url + "'.");
            };
        }

        if(failCallback != null) {
            fail = failCallback;
        } else {
            fail = function() {
                Logger.warn("RestClient : Fail to send PATCH message to URL '" + url + "'.");
            };
        }

        RestClient.getClient().delete(url, success).on('error',fail);
    }

    /**
     * Send a DELETE message to URL in parameter, in a synchronous way.
     *
     * @method deleteSync
     * @static
     * @param {string} url - The url to patch.
     */
    static deleteSync(url : string) {

        var done = false;
        var result = null;

        var success = function(data, response) {
            result = new Object();
            result["success"] = true;
            result["data"] = JSON.parse(data);
            result["response"] = response;

            done = true;
        };

        var fail = function(error) {
            result = new Object();
            result["success"] = false;
            result["error"] = error;

            done = true;
        };

        RestClient.getClient().delete(url, success).on('error',fail);

        while(!done) {
            deasync.sleep(5);
        }

        return result;
    }

}