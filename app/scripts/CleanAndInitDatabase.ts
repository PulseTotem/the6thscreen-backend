/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./core/Logger.ts" />

/// <reference path="./model/ModelItf.ts" />
/// <reference path="./model/SDI.ts" />
/// <reference path="./model/Zone.ts" />
/// <reference path="./model/Call.ts" />
/// <reference path="./model/CallType.ts" />
/// <reference path="./model/Profil.ts" />
/// <reference path="./model/Timeline.ts" />
/// <reference path="./model/InfoType.ts" />
/// <reference path="./model/ParamValue.ts" />
/// <reference path="./model/ParamType.ts" />
/// <reference path="./model/ReceivePolicy.ts" />
/// <reference path="./model/Renderer.ts"/>
/// <reference path="./model/RenderPolicy.ts" />
/// <reference path="./model/Role.ts" />
/// <reference path="./model/Source.ts" />
/// <reference path="./model/User.ts" />

/**
 * Class to clean and Initialise Database with some data.
 *
 * @class CleanAndInitDatabase
 */
class CleanAndInitDatabase {

    static toClean = [Role, User];

    /**
     * Method to clean and fulfill database with some data.
     *
     * @method run
     */
    run() {
        cleanAll();
        fulfill();
    }

    /**
     * Method to clean the database.
     *
     * @method cleanAll
     */
    cleanAll() {
        for(var i in CleanAndInitDatabase.toClean) {
            var modelToClean = CleanAndInitDatabase.toClean[i];
            var instances : Array<ModelItf> = modelToClean.all();
            for(var j in instances) {
                var toDelete : ModelItf = instances[j];
                toDelete.delete();
            }
        }
    }

    /**
     * Method to fulfill database with some data.
     *
     * @method fulfill
     */
    fulfill() {
        //TODO
    }
}

var caid = new CleanAndInitDatabase();
caid.run();