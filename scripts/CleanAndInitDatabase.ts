/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../t6s-core/core-backend/scripts/LoggerLevel.ts" />

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
/// <reference path="./model/TypeParamType.ts" />
/// <reference path="./model/ConstraintParamType.ts" />
/// <reference path="./model/ReceivePolicy.ts" />
/// <reference path="./model/Renderer.ts"/>
/// <reference path="./model/RenderPolicy.ts" />
/// <reference path="./model/Role.ts" />
/// <reference path="./model/Source.ts" />
/// <reference path="./model/User.ts" />
/// <reference path="./model/Behaviour.ts" />

/**
 * Class to clean and Initialise Database with some data.
 *
 * @class CleanAndInitDatabase
 */
class CleanAndInitDatabase {

    static toCleanSources : Array<any> = [Source];
    static toCleanUsers : Array<any> = [User];

    /**
     * Method to clean and fulfill database with some data.
     *
     * @method run
     * @param (Array<String>) runParams - Params to configure steps to do during Database Initialization
     */
    run(runParams : Array<string>) {
        var self = this;

        var success = function() {
            Logger.info("Good job Rogue group!");
        };

        var fail = function(err) {
            if(err) {
                Logger.error(err);
            }
        };

        if(runParams.length > 2) {
            for(var i = 2; i < runParams.length; i++) {
                var param = runParams[i];
                var keyVal = param.split("=");
                if (keyVal.length > 1) {
                    if (keyVal[0] == "step") {
                        switch (keyVal[1]) {
                            case "sources" :
                                var successCleanAllSources = function() {
                                    self.fulfillSources(success, fail);
                                };
                                self.cleanAll(CleanAndInitDatabase.toCleanSources, successCleanAllSources, fail);

                                break;
                            case "users" :
                                var successCleanAllUsers = function() {
                                    self.fulfillUsers(success, fail);
                                };
                                self.cleanAll(CleanAndInitDatabase.toCleanUsers, successCleanAllUsers, fail);
                                break;
                            case "sdis" :
                                //TODO : Clean and Init SDIs
                                break;
                            case "profils" :
                                //TODO : Clean and Init Profils
                                break;
                            default :
                                Logger.info("Nothing to do !?");
                        }
                        break;
                    }
                }
            }
        } else {
            Logger.error("Missing some arguments !?");
        }

        /*this.cleanAll();
        this.fulfill();*/
    }

    /**
     * Method to fulfill database with sources.
     *
     * @method fulfillSources
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    fulfillSources(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var sourcesNb = 0;

        var sources : any = require("../dbInitFiles/sources.json");

        if(sources.length == 0) {
            Logger.info("No sources to create.");
            successCallback();
            return;
        }

        sources.forEach(function(sourceDesc) {
            sourcesNb = sourcesNb + 1;

            var fail = function(err) {
                failCallback(err);
            };

            var source = new Source(sourceDesc.name, sourceDesc.service, sourceDesc.description, sourceDesc.host, sourceDesc.port);

            var createdParamTypes = new Array();

            var successParamTypeCreate = function(newParamType) {
                createdParamTypes.push(newParamType);
                Logger.info("ParamType '" + createdParamTypes.length + "' create successfully.");

                if(createdParamTypes.length == sourceDesc.paramTypes.length) {
                    var nbAssociation = 0;
                    var successParamTypeAssociation = function() {
                        nbAssociation = nbAssociation + 1;
                        Logger.info("ParamType associated to Source successfully.");

                        if(nbAssociation == createdParamTypes.length && sourcesNb == sources.length) {
                            successCallback();
                        }
                    };

                    createdParamTypes.forEach(function(paramType) {
                        source.addParamType(paramType, successParamTypeAssociation, fail);
                    });

                }
            };

            var successInfoTypeCreate = function(newInfoType) {
                Logger.info("InfoType create successfully.");

                var successInfoTypeAssociation = function() {
                    Logger.info("InfoType associated to Source successfully.");
                    sourceDesc.paramTypes.forEach(function(paramType) {
                        self.manageParamTypeCreation(paramType, successParamTypeCreate, fail);
                    });
                };

                source.setInfoType(newInfoType, successInfoTypeAssociation, fail);
            };

            var successSourceCreate = function() {
                Logger.info("Source create successfully.");
                self.manageInfoTypeCreation(sourceDesc.infoType, successInfoTypeCreate, fail);
            };

            source.create(successSourceCreate, fail);
        });
    }

    /**
     * Method to fulfill database with users.
     *
     * @method fulfillUsers
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    fulfillUsers(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var usersNb = 0;

        var users : any = require("../dbInitFiles/users.json");

        if(users.length == 0) {
            Logger.info("No users to create.");
            successCallback();
            return;
        }

        users.forEach(function(userDesc) {
            usersNb = usersNb + 1;

            var fail = function (err) {
                failCallback(err);
            };

            var user = new User(userDesc.username);

            var successUserCreate = function() {
                Logger.info("User create successfully.");
                if(usersNb == users.length) {
                    successCallback();
                }
            };

            user.create(successUserCreate, fail);

        });
    }

    /**
     * Method to manage creation of InfoType.
     *
     * @method manageInfoTypeCreation
     * @param {JSON Object} infoTypeDesc - The InfoType's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    manageInfoTypeCreation(infoTypeDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function(err) {
            failCallback(err);
        };

        var successAll = function(allInfoTypes) {
            var infoType = null;
            allInfoTypes.forEach(function(it) {
                if(it.name() == infoTypeDesc.name) {
                    infoType = it;
                }
            });

            if(infoType == null) {
                infoType = new InfoType(infoTypeDesc.name);

                var successInfoTypeCreation = function() {
                    successCallback(infoType);
                };

                infoType.create(successInfoTypeCreation, fail);

            } else {
                successCallback(infoType);
            }
        };

        InfoType.all(successAll, fail);

    }

    /**
     * Method to manage creation of ParamType.
     *
     * @method manageParamTypeCreation
     * @param {JSON Object} paramTypeDesc - The ParamType's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    manageParamTypeCreation(paramTypeDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function(err) {
            failCallback(err);
        };

        var successAll = function(allParamTypes) {
            var paramType = null;
            allParamTypes.forEach(function(pt) {
                if(pt.name() == paramTypeDesc.name) {
                    paramType = pt;
                }
            });

            if(paramType == null) {
                paramType = new ParamType(paramTypeDesc.name, paramTypeDesc.description);

                var successConstraintAssociation = function() {
                    Logger.info("Constraint associated to ParamType successfully.");
                    successCallback(paramType);
                }

                var successConstraintCreate = function(newConstraint) {
                    Logger.info("Constraint create successfully.");
                    paramType.setConstraint(newConstraint, successConstraintAssociation, fail);
                }

                var successTypeParamTypeAssociation = function() {
                    Logger.info("TypeParamType associated to ParamType successfully.");
                    self.manageConstraintCreation(paramTypeDesc.constraint, successConstraintCreate, fail);
                };

                var successTypeParamTypeCreate = function(newTypeParamType) {
                    Logger.info("TypeParamType create successfully.");
                    paramType.setType(newTypeParamType, successTypeParamTypeAssociation, fail);
                };

                var successParamTypeCreate = function() {
                    Logger.info("ParamType create successfully.");
                    self.manageTypeParamTypeCreation(paramTypeDesc.type, successTypeParamTypeCreate, fail);
                };

                paramType.create(successParamTypeCreate, fail);

            } else {
                successCallback(paramType);
            }
        };

        ParamType.all(successAll, fail);

    }

    /**
     * Method to manage creation of TypeParamType.
     *
     * @method manageTypeParamTypeCreation
     * @param {JSON Object} typeParamTypeDesc - The TypeParamType's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    manageTypeParamTypeCreation(typeParamTypeDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(allTypeParamTypes) {
            var typeParamType = null;
            allTypeParamTypes.forEach(function(pt) {
                if(pt.name() == typeParamTypeDesc.name) {
                    typeParamType = pt;
                }
            });

            if(typeParamType == null) {
                typeParamType = new TypeParamType(typeParamTypeDesc.name);

                var successTypeParamTypeCreation = function() {
                    successCallback(typeParamType);
                };

                typeParamType.create(successTypeParamTypeCreation, fail);
            } else {
                successCallback(typeParamType);
            }
        }

        TypeParamType.all(successAll, fail);
    }

    /**
     * Method to manage creation of Constraint.
     *
     * @method manageParamTypeCreation
     * @param {JSON Object} constraintDesc - The Constraint's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    manageConstraintCreation(constraintDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(constraintParamTypes) {
            var constraint = null;
            constraintParamTypes.forEach(function(c) {
                if(c.name() == constraintDesc.name) {
                    constraint = c;
                }
            });

            if(constraint == null) {
                constraint = new ConstraintParamType(constraintDesc.name, constraintDesc.description);

                var successTypeParamTypeAssociation = function() {
                    Logger.info("TypeParamType associated to Constraint successfully.");
                    successCallback(constraint);
                };

                var successTypeParamTypeCreate = function(newTypeParamType) {
                    Logger.info("TypeParamType create successfully.");
                    constraint.setType(newTypeParamType, successTypeParamTypeAssociation, fail);
                };

                var successConstraintCreation = function() {
                    Logger.info("Constraint create successfully.");
                    self.manageTypeParamTypeCreation(constraintDesc.type, successTypeParamTypeCreate, fail);
                };

                constraint.create(successConstraintCreation, fail);
            } else {
                successCallback(constraint);
            }
        }

        ConstraintParamType.all(successAll, fail);

    }

    /**
     * Method to clean selected tables in database.
     *
     * @method cleanAll
     * @params (Array<any>) models - models to clean.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    cleanAll(models : Array<any>, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        if(models.length == 0) {
            Logger.info("No models to clean.");
            successCallback();
            return;
        }

        var nbModels = 0;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(instances) {
            nbModels = nbModels + 1;
            var nbInstances = 0;
            instances.forEach(function(toDelete) {
                var deleteSuccess = function() {
                    Logger.info("Instance delete successfully.");
                    nbInstances = nbInstances + 1;
                    if(nbModels == models.length && nbInstances == instances.length) {
                        successCallback();
                    }
                };

                toDelete.delete(deleteSuccess, fail);
            });

            if(nbModels == models.length && instances.length == 0) {
                Logger.info("Nothing to clean.");
                successCallback();
            }
        };

        Logger.info("Iterating on models to clean");
        models.forEach(function(modelToClean) {
            Logger.info("Cleaning : " + modelToClean.getTableName());

            modelToClean.all(successAll, fail);
        });
    }

    /**
     * Method to fulfill database with some data.
     *
     * @method fulfill
     */
    fulfill() {
/*
	    var s : SDI = new SDI("SDItruc", "Un super SDI de test ! ", "*");
	    s.create();

	    var u : User = new User("toto");
	    u.create();

	    Logger.debug("Associate user");
	    //s.addUser(u);
	    // to check if doublons are created
	    u.addSDI(s);

	    s.loadAssociations(); // ???
	    Logger.debug(s);

        var z : Zone = new Zone("MainZone", "Zone principale de SDItruc", 50, 100, 0, 0);
        z.create();

        s.addZone(z);

        var b : Behaviour = new Behaviour("Appearance", "Défilement des informations sans effet.");
        b.create();

        z.setBehaviour(b);

        var ct : CallType = new CallType("RSSMainZone","Display RSS feeds in the main zone with a specific renderer");
        ct.create();
	    ct.setZone(z);
        ct.setSource(rss_feed_reader);

        var renderer : Renderer = new Renderer("FeedNodeRendererGeneric", "Renderer générique pour les infos de type FeedNode.");
        renderer.create();

        renderer.setInfoType(feed_content);

        ct.setRenderer(renderer);

        //Receive : La politique de réception => ???
        //var rp : ReceivePolicy = new ReceivePolicy("Last");
        var rp : ReceivePolicy = new ReceivePolicy("DumbReceivePolicy");
        rp.create();

        ct.setReceivePolicy(rp);

        //Render : La politique d'affichage => ???
        //var renderP : RenderPolicy = new RenderPolicy("Ordered","Alphabetically sort the informations");
        var renderP : RenderPolicy = new RenderPolicy("FeedContentDumbRenderPolicy","Dumb render policy for FeedContent.");
        renderP.create();

        ct.setRenderPolicy(renderP);

        var p : Profil = new Profil("ProfilSDItruc1", "Profil n°1 de SDItruc");
        p.create();

        s.addProfil(p);

        var c : Call = new Call("FilUNS");
        c.create();

        c.setCallType(ct);

        var feedUrl_pv : ParamValue = new ParamValue("http://filuns.unice.fr/accueil/atom.xml");
        feedUrl_pv.create();
        feedUrl_pv.setParamType(url_rss_feed_reader);

        var limit_pv : ParamValue = new ParamValue("10");
        limit_pv.create();
        limit_pv.setParamType(limit_rss_feed_reader);

        c.addParamValue(feedUrl_pv);
        c.addParamValue(limit_pv);

        p.addCall(c);

        //Enlever le lien call -> source
        //Enlever le lien call -> zone

        //

        Logger.debug(SDI.all());*/
    }
}

try {
    var logLevel = LoggerLevel.Error;

    if(process.argv.length > 2) {
        for(var i = 2; i < process.argv.length; i++) {
            var param = process.argv[i];
            var keyVal = param.split("=");
            if (keyVal.length > 1) {
                if (keyVal[0] == "loglevel") {
                    switch (keyVal[1]) {
                        case "error" :
                            logLevel = LoggerLevel.Error;
                            break;
                        case "warning" :
                            logLevel = LoggerLevel.Warning;
                            break;
                        case "info" :
                            logLevel = LoggerLevel.Info;
                            break;
                        case "debug" :
                            logLevel = LoggerLevel.Debug;
                            break;
                        default :
                            logLevel = LoggerLevel.Error;
                    }
                    break;
                }
            }
        }
    }

    Logger.setLevel(logLevel);

	var caid = new CleanAndInitDatabase();
	caid.run(process.argv);
} catch (e) {
	console.log(e);
	throw e;
}
