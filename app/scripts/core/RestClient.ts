/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../libsdef/node-rest-client.d.ts" />
/// <reference path="./Logger.ts" />

var Client = require('node-rest-client').Client;

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
     * Send a GET message to URL in parameter.
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
     * Send a POST message to URL in parameter.
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
     * Send a PUT message to URL in parameter.
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
     * Send a PATCH message to URL in parameter.
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

}