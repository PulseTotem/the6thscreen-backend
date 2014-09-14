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

    static toClean = [Profil];

    /**
     * Method to clean and fulfill database with some data.
     *
     * @method run
     */
    run() {
        this.cleanAll();
        this.fulfill();
    }

    /**
     * Method to clean the database.
     *
     * @method cleanAll
     */
    cleanAll() {
        for(var i in CleanAndInitDatabase.toClean) {
            var modelToClean = CleanAndInitDatabase.toClean[i];
            var instances = modelToClean.all();
            for(var j in instances) {
                var toDelete = instances[j];
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

	    var s : SDI = new SDI("SDItruc", "*");
	    s.create();

	    s.associateUser(1);

        /*
        var p : Profil = new Profil("profil1", "description de profil1");
        p.create();

        p.setName("profil 5");

        p.update();

        var p2 : Profil = Profil.read(2);
        p2.delete();
        */

        Logger.debug(SDI.all());
    }
}

var caid = new CleanAndInitDatabase();
caid.run();
caid.fulfill();