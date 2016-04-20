/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

var fs = require('fs');

/**
 * Contains Backend Configuration information.
 *
 * @class BackendConfig
 */
class BackendConfig {

    static backendConfig : any = null;

    /**
     * Retrieve configuration information from file description.
     *
     * @method retrieveConfigurationInformation
     * @static
     */
    static retrieveConfigurationInformation() {
        if(BackendConfig.backendConfig == null) {
            var file = __dirname + '/backend_config.json';

            try {
                BackendConfig.backendConfig = JSON.parse(fs.readFileSync(file, 'utf8'));
            } catch (e) {
                Logger.error("Backend configuration file can't be read.");
                Logger.debug(e);
                //TODO ? Throw Exception ?
            }
        }
    }

    /**
     * Return JWT Secret key.
     *
     * @method getJWTSecret
     * @static
     * @return {string} - JWT Secret key.
     */
    static getJWTSecret() : string {
        BackendConfig.retrieveConfigurationInformation();
        return BackendConfig.backendConfig.jwtSecret;
    }

    /**
     * Return DataBase host.
     *
     * @method getDBHost
     * @static
     * @return {string} - DataBase host.
     */
    static getDBHost() : string {
        BackendConfig.retrieveConfigurationInformation();
        return BackendConfig.backendConfig.database.host;
    }

    /**
     * Return DataBase port.
     *
     * @method getDBPort
     * @static
     * @return {number} - DataBase port.
     */
    static getDBPort() : number {
        BackendConfig.retrieveConfigurationInformation();
        return BackendConfig.backendConfig.database.port;
    }

    /**
     * Return DataBase's BaseURL.
     *
     * @method getDBBaseURL
     * @static
     * @return {string} - DataBase's BaseURL.
     */
    static getDBBaseURL() : string {
        return "http://" + BackendConfig.getDBHost() + ":" + BackendConfig.getDBPort().toString();
    }

    /**
     * Return Database endpoint to work on a specific model.
     *
     * @method modelEndpoint
     * @static
     * @param model
     * @returns {string}
     */
    static modelEndpoint(model : string) {
        return "/"+model;
    }

    /**
     * Return database endpoint to work on a specific object
     *
     * @method objectEndpoint
     * @static
     * @param objectType
     * @param objectID
     * @returns {string}
     */
    static objectEndpoint(objectType : string, objectID : string) {
        return "/"+objectType+"/"+objectID;
    }

    /**
     * Return database endpoint to work on a specific association
     *
     * @method associationEndpoint
     * @static
     * @param objectType
     * @param objectID
     * @param associatedType
     * @returns {string}
     */
    static associationEndpoint(objectType : string, objectID : string, associatedType : string) {
        return "/"+objectType+"/"+objectID+"/"+associatedType;
    }

    /**
     * Return database endpoint to work on associated objects
     *
     * @method associatedObjectEndpoint
     * @static
     * @param objectType
     * @param objectID
     * @param associatedType
     * @param associatedID
     * @returns {string}
     */
    static associatedObjectEndpoint(objectType : string, objectID : string, associatedType : string, associatedID : string) {
        return "/"+objectType+"/"+objectID+"/"+associatedType+"/"+associatedID;
    }

    /**
     * Return database endpoint to work on objects search
     *
     * @method searchEndpoint
     * @static
     * @param objectType
     * @param objectParamName
     * @param objectParamValue
     * @returns {string}
     */
    static searchEndpoint(objectType : string, objectParamName : string, objectParamValue : string) {
        return "/" + objectType + "?" + objectParamName + "=" + objectParamValue;
    }

    /**
     * Return Auth Login.
     *
     * @method getContactInfoAuthLogin
     * @static
     * @return {string} - Auth Login.
     */
    static getContactInfoAuthLogin() : string {
        BackendConfig.retrieveConfigurationInformation();
        return ContactConfig.authLogin;
    }

    /**
     * Return Auth Password.
     *
     * @method getContactInfoAuthPassword
     * @static
     * @return {string} - Auth Password.
     */
    static getContactInfoAuthPassword() : string {
        BackendConfig.retrieveConfigurationInformation();
        return BackendConfig.backendConfig.contacts.authPassword;
    }

    /**
     * Return Contact Email.
     *
     * @method getContactInfoContactEmail
     * @static
     * @return {string} - Contact Email.
     */
    static getContactInfoContactEmail() : string {
        BackendConfig.retrieveConfigurationInformation();
        return BackendConfig.backendConfig.contacts.contactEmail;
    }

    /**
     * Return Recaptcha Private Key.
     *
     * @method getContactInfoRecaptchaPrivateKey
     * @static
     * @return {string} - Recaptcha Private Key.
     */
    static getContactInfoRecaptchaPrivateKey() : string {
        BackendConfig.retrieveConfigurationInformation();
        return BackendConfig.backendConfig.contacts.recaptchaPrivateKey;
    }

    static getCMSHost() : string {
        BackendConfig.retrieveConfigurationInformation();
        return BackendConfig.backendConfig.CMS.host;
    }

    static getCMSUsersPath() : string {
        return "users/"
    }

    static getStatsHost() : string {
        BackendConfig.retrieveConfigurationInformation();
        return BackendConfig.backendConfig.stats.host;
    }

    static getStatsPort() : number {
        BackendConfig.retrieveConfigurationInformation();
        return BackendConfig.backendConfig.stats.port;
    }

    static getStatsEndpoint() : string {
        BackendConfig.retrieveConfigurationInformation();
        return BackendConfig.backendConfig.stats.endpoint;
    }

    static getStatsURL() : number {
        BackendConfig.retrieveConfigurationInformation();
        return "http://"+BackendConfig.getStatsHost()+":"+BackendConfig.getStatsPort()+"/"+BackendConfig.getStatsEndpoint()+"/";
    }

}