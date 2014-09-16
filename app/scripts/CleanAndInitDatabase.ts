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
        for(var i = 0; i < CleanAndInitDatabase.toClean.length; i++) {
            var modelToClean = CleanAndInitDatabase.toClean[i];
	        Logger.debug("Iterating on models to clean");
	        Logger.debug(modelToClean);
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

	    var u : User = new User("toto");
	    u.create();

	    Logger.debug("Associate user");
	    s.associateUser(u);
	    // to check if doublons are created
	    u.associateSDI(s);

	    s.loadAssociations();
	    Logger.debug(s);


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