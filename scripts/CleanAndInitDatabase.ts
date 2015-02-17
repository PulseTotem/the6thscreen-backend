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
    static toCleanSDIs : Array<any> = [SDI, Zone, CallType, Behaviour, RenderPolicy, ReceivePolicy];

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
            Logger.error("Une erreur est survenue...");

            if(err) {
                Logger.error(err);
            }

            process.exit(0);
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
                                var successCleanAllSDIs = function() {
                                    self.fulfillSDIs(success, fail);
                                };
                                self.cleanAll(CleanAndInitDatabase.toCleanSDIs, successCleanAllSDIs, fail);
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
     * Method to fulfill database with SDIs.
     *
     * @method fulfillSDIs
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    fulfillSDIs(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var sdisNb = 0;

        var sdis : any = require("../dbInitFiles/sdis.json");

        if(sdis.length == 0) {
            Logger.info("No sdis to create.");
            successCallback();
            return;
        }

        sdis.forEach(function(sdiDesc : any) {
            sdisNb = sdisNb + 1;

            var fail = function (err) {
                failCallback(err);
            };

            var sdi = new SDI(sdiDesc.name, sdiDesc.description, sdiDesc.allowedHost);

            var nbCreatedCallTypes = 0;

            var successCallTypeCreate = function(newCallType) {
                nbCreatedCallTypes = nbCreatedCallTypes + 1;
                Logger.info("CallType created successfully.");

                if(nbCreatedCallTypes == sdiDesc.callTypes.length && sdisNb == sdis.length) {
                    Logger.info("Fulfill SDIs END !");
                    successCallback();
                }
            };

            var nbCreatedReceivePolicies = 0;

            var successReceivePolicyCreate = function(newReceivePolicy) {
                Logger.info("ReceivePolicy created successfully.");
                nbCreatedReceivePolicies = nbCreatedReceivePolicies + 1;

                if(nbCreatedReceivePolicies == sdiDesc.receivePolicies.length) {
                    sdiDesc.callTypes.forEach(function(callType) {
                        self.manageCallTypeCreation(callType, successCallTypeCreate, fail);
                    });
                }
            };

            var nbCreatedRenderPolicies = 0;

            var successRenderPolicyCreate = function(newRenderPolicy) {
                Logger.info("RenderPolicy created successfully.");
                nbCreatedRenderPolicies = nbCreatedRenderPolicies + 1;

                if(nbCreatedRenderPolicies == sdiDesc.renderPolicies.length) {
                    sdiDesc.receivePolicies.forEach(function(receivePolicy) {
                        self.manageReceivePolicyCreation(receivePolicy, successReceivePolicyCreate, fail);
                    });
                }
            };

            var nbCreatedRenderers = 0;

            var successRendererCreate = function(newRenderer) {
                Logger.info("Renderer created successfully.");
                nbCreatedRenderers = nbCreatedRenderers + 1;

                if(nbCreatedRenderers == sdiDesc.renderers.length) {
                    sdiDesc.renderPolicies.forEach(function(renderPolicy) {
                        self.manageRenderPolicyCreation(renderPolicy, successRenderPolicyCreate, fail);
                    });
                }
            };

            var createdZones = new Array();

            var successZoneCreate = function(newZone) {
                createdZones.push(newZone);
                Logger.info("Zone created successfully.");

                if(createdZones.length == sdiDesc.zones.length) {
                    var nbAssociation = 0;
                    var successZoneAssociation = function() {
                        nbAssociation = nbAssociation + 1;
                        Logger.info("Zone associated to SDI successfully.");

                        if(nbAssociation == createdZones.length) {
                            sdiDesc.renderers.forEach(function(renderer) {
                                self.manageRendererCreation(renderer, successRendererCreate, fail);
                            });
                        }
                    };

                    createdZones.forEach(function(zone) {
                        sdi.addZone(zone, successZoneAssociation, fail);
                    });
                }
            }

            var nbCreatedBehaviours = 0;

            var successBehaviourCreate = function(newBehaviour) {
                Logger.info("Behaviour created successfully.");
                nbCreatedBehaviours = nbCreatedBehaviours + 1;

                if(sdiDesc.behaviours.length == nbCreatedBehaviours) {
                    sdiDesc.zones.forEach(function(zone) {
                        self.manageZoneCreation(zone, successZoneCreate, fail);
                    });
                }
            };

            var successUserRetrieve = function(user) {
                Logger.info("User retrieved successfully.");

                var successUserAssociation = function() {
                    Logger.info("SDI associated to User successfully.");
                    Logger.info("Begin loop for behaviours : " + sdiDesc.behaviours.length);
                    sdiDesc.behaviours.forEach(function(behaviour) {
                        self.manageBehaviourCreation(behaviour, successBehaviourCreate, fail);
                    });
                };

                user.addSDI(sdi, successUserAssociation, fail);
            };

            var successSDICreate = function() {
                Logger.info("SDI create successfully.");

                self.retrieveUser(sdiDesc.user, successUserRetrieve, fail);
            };

            sdi.create(successSDICreate, fail);

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
     * Method to retrieve User.
     *
     * @method retrieveUser
     * @param {JSON Object} userDesc - The User's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    retrieveUser(userDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(allUsers) {
            var user = null;
            allUsers.forEach(function(u) {
                if(u.username() == userDesc.username) {
                    user = u;
                }
            });

            if(user == null) {
                failCallback(new Error("The User '" + userDesc.username + "' doesn't exist !"));
            } else {
                successCallback(user);
            }
        };

        User.all(successAll, fail);
    }

    /**
     * Method to manage creation of Zone.
     *
     * @method manageZoneCreation
     * @param {JSON Object} zoneDesc - The Zone's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    manageZoneCreation(zoneDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function(err) {
            failCallback(err);
        };

        var successAll = function(allZones) {
            var zone = null;
            allZones.forEach(function(z) {
                if(z.name() == zoneDesc.name) {
                    zone = z;
                }
            });

            if(zone == null) {
                zone = new Zone(zoneDesc.name, zoneDesc.description, zoneDesc.width, zoneDesc.height, zoneDesc.positionFromTop, zoneDesc.positionFromLeft);

                var successBehaviourRetrieved = function(newBehaviour) {
                    Logger.info("Behaviour retrieved successfully.");
                    var successBehaviourAssociation = function() {
                        Logger.info("Behaviour associated to Zone successfully.");
                        successCallback(zone);
                    };

                    zone.setBehaviour(newBehaviour, successBehaviourAssociation, fail);
                };

                var successZoneCreation = function() {
                    Logger.info("Zone created successfully.");
                    self.retrieveBehaviour(zoneDesc.behaviour, successBehaviourRetrieved, fail);
                };

                zone.create(successZoneCreation, fail);

            } else {
                successCallback(zone);
            }
        };

        Zone.all(successAll, fail);

    }

    /**
     * Method to manage creation of CallType.
     *
     * @method manageCallTypeCreation
     * @param {JSON Object} callTypeDesc - The CallType's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    manageCallTypeCreation(callTypeDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function(err) {
            failCallback(err);
        };

        var successAll = function(allCallTypes) {
            var callType = null;
            allCallTypes.forEach(function(ct) {
                if(ct.name() == callTypeDesc.name) {
                    callType = ct;
                }
            });

            if(callType == null) {
                callType = new CallType(callTypeDesc.name, callTypeDesc.description);

                var successReceivePolicyRetrieved = function(newReceivePolicy) {
                    Logger.info("ReceivePolicy retrieved successfully.");

                    var successReceivePolicyAssociation = function() {
                        Logger.info("ReceivePolicy associated to CallType successfully.");
                        successCallback(callType);
                    };

                    callType.setReceivePolicy(newReceivePolicy, successReceivePolicyAssociation, fail);
                };

                var successRenderPolicyRetrieved = function(newRenderPolicy) {
                    Logger.info("RenderPolicy retrieved successfully.");

                    var successRenderPolicyAssociation = function() {
                        Logger.info("RenderPolicy associated to CallType successfully.");
                        self.retrieveReceivePolicy(callTypeDesc.receivePolicy, successReceivePolicyRetrieved, fail);
                    };

                    callType.setRenderPolicy(newRenderPolicy, successRenderPolicyAssociation, fail);
                };

                var successRendererRetrieved = function(newRenderer) {
                    Logger.info("Renderer retrieved successfully.");

                    var successRendererAssociation = function() {
                        Logger.info("Renderer associated to CallType successfully.");
                        self.retrieveRenderPolicy(callTypeDesc.renderPolicy, successRenderPolicyRetrieved, fail);
                    };

                    callType.setRenderer(newRenderer, successRendererAssociation, fail);
                };

                var successSourceRetrieve = function(newSource) {
                    Logger.info("Source retrieved successfully.");

                    var successSourceAssociation = function() {
                        Logger.info("Source associated to CallType successfully.");
                        self.retrieveRenderer(callTypeDesc.renderer, successRendererRetrieved, fail);
                    };

                    callType.setSource(newSource, successSourceAssociation, fail);
                };

                var successZoneRetrieve = function(newZone) {
                    Logger.info("Zone retrieved successfully.");

                    var successZoneAssociation = function() {
                        Logger.info("Zone associated to CallType successfully.");
                        self.retrieveSource(callTypeDesc.source, successSourceRetrieve, fail);
                    };

                    callType.setZone(newZone, successZoneAssociation, fail);
                };

                var successCallTypeCreation = function() {
                    Logger.info("CallType created successfully.");
                    self.retrieveZone(callTypeDesc.zone, successZoneRetrieve, fail);
                };

                callType.create(successCallTypeCreation, fail);

            } else {
                successCallback(callType);
            }
        };

        CallType.all(successAll, fail);

    }

    /**
     * Method to manage creation of Behaviour.
     *
     * @method manageBehaviourCreation
     * @param {JSON Object} behaviourDesc - The Behaviour's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    manageBehaviourCreation(behaviourDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(allBehaviours) {
            Logger.debug(allBehaviours);
            var behaviour = null;
            allBehaviours.forEach(function(b) {
                if(b.name() == behaviourDesc.name) {
                    behaviour = b;
                }
            });

            if(behaviour == null) {
                behaviour = new Behaviour(behaviourDesc.name, behaviourDesc.description);

                var successBehaviourCreation = function() {
                    Logger.info("Behaviour create successfully");
                    successCallback(behaviour);
                };

                behaviour.create(successBehaviourCreation, fail);
            } else {
                successCallback(behaviour);
            }
        };

        Behaviour.all(successAll, fail);
    }

    /**
     * Method to retrieve Behaviour.
     *
     * @method retrieveBehaviour
     * @param {JSON Object} behaviourDesc - The Behaviour's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    retrieveBehaviour(behaviourDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(allBehaviours) {
            var behaviour = null;
            allBehaviours.forEach(function(b) {
                if(b.name() == behaviourDesc.name) {
                    behaviour = b;
                }
            });

            if(behaviour == null) {
                failCallback(new Error("The Behaviour '" + behaviourDesc.name + "' doesn't exist !"));
            } else {
                successCallback(behaviour);
            }
        };

        Behaviour.all(successAll, fail);
    }

    /**
     * Method to retrieve Zone.
     *
     * @method retrieveZone
     * @param {JSON Object} zoneDesc - The Zone's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    retrieveZone(zoneDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(allZones) {
            var zone = null;
            allZones.forEach(function(z) {
                if(z.name() == zoneDesc.name) {
                    zone = z;
                }
            });

            if(zone == null) {
                failCallback(new Error("The Zone '" + zoneDesc.name + "' doesn't exist !"));
            } else {
                successCallback(zone);
            }
        };

        Zone.all(successAll, fail);
    }

    /**
     * Method to retrieve Source.
     *
     * @method retrieveSource
     * @param {JSON Object} sourceDesc - The Source's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    retrieveSource(sourceDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(allSources) {
            var source = null;
            allSources.forEach(function(s) {
                if(s.name() == sourceDesc.name) {
                    source = s;
                }
            });

            if(source == null) {
                failCallback(new Error("The Source '" + sourceDesc.name + "' doesn't exist !"));
            } else {
                successCallback(source);
            }
        };

        Source.all(successAll, fail);
    }

    /**
     * Method to manage creation of Renderer.
     *
     * @method manageRendererCreation
     * @param {JSON Object} rendererDesc - The Renderer's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    manageRendererCreation(rendererDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(allRenderers) {
            var renderer = null;
            allRenderers.forEach(function(r) {
                if(r.name() == rendererDesc.name) {
                    renderer = r;
                }
            });

            if(renderer == null) {
                renderer = new Renderer(rendererDesc.name, rendererDesc.description);

                var successInfoTypeRetrieve = function(newInfotype) {
                    Logger.info("InfoType retrieved successfully.");

                    var successInfoTypeAssociation = function() {
                        Logger.info("InfoType associated to Renderer successfully.");
                        successCallback(renderer);
                    };

                    renderer.setInfoType(newInfotype, successInfoTypeAssociation, fail);
                };

                var successRendererCreation = function() {
                    Logger.info("Renderer created successfully.");

                    self.retrieveInfoType(rendererDesc.infoType, successInfoTypeRetrieve, fail);
                };

                renderer.create(successRendererCreation, fail);
            } else {
                successCallback(renderer);
            }
        };

        Renderer.all(successAll, fail);
    }

    /**
     * Method to retrieve InfoType.
     *
     * @method retrieveInfoType
     * @param {JSON Object} infoTypeDesc - The InfoType's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    retrieveInfoType(infoTypeDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
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
                failCallback(new Error("The InfoType '" + infoTypeDesc.name + "' doesn't exist !"));
            } else {
                successCallback(infoType);
            }
        };

        InfoType.all(successAll, fail);
    }

    /**
     * Method to manage creation of RenderPolicy.
     *
     * @method manageRenderPolicyCreation
     * @param {JSON Object} renderPolicyDesc - The RenderPolicy's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    manageRenderPolicyCreation(renderPolicyDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(allRenderPolicys) {
            var renderPolicy = null;
            allRenderPolicys.forEach(function(rp) {
                if(rp.name() == renderPolicyDesc.name) {
                    renderPolicy = rp;
                }
            });

            if(renderPolicy == null) {
                renderPolicy = new RenderPolicy(renderPolicyDesc.name, renderPolicyDesc.description);

                var successRenderPolicyCreation = function() {
                    successCallback(renderPolicy);
                };

                renderPolicy.create(successRenderPolicyCreation, fail);
            } else {
                successCallback(renderPolicy);
            }
        };

        RenderPolicy.all(successAll, fail);
    }

    /**
     * Method to manage creation of ReceivePolicy.
     *
     * @method manageReceivePolicyCreation
     * @param {JSON Object} receivePolicyDesc - The ReceivePolicy's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    manageReceivePolicyCreation(receivePolicyDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(allReceivePolicys) {
            var receivePolicy = null;
            allReceivePolicys.forEach(function(rp) {
                if(rp.name() == receivePolicyDesc.name) {
                    receivePolicy = rp;
                }
            });

            if(receivePolicy == null) {
                receivePolicy = new ReceivePolicy(receivePolicyDesc.name);

                var successReceivePolicyCreation = function() {
                    successCallback(receivePolicy);
                };

                receivePolicy.create(successReceivePolicyCreation, fail);
            } else {
                successCallback(receivePolicy);
            }
        };

        ReceivePolicy.all(successAll, fail);
    }

    /**
     * Method to retrieve Renderer.
     *
     * @method retrieveRenderer
     * @param {JSON Object} rendererDesc - The Renderer's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    retrieveRenderer(rendererDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(allRenderers) {
            var renderer = null;
            allRenderers.forEach(function(r) {
                if(r.name() == rendererDesc.name) {
                    renderer = r;
                }
            });

            if(renderer == null) {
                failCallback(new Error("The Renderer '" + rendererDesc.name + "' doesn't exist !"));
            } else {
                successCallback(renderer);
            }
        };

        Renderer.all(successAll, fail);
    }

    /**
     * Method to retrieve RenderPolicy.
     *
     * @method retrieveRenderPolicy
     * @param {JSON Object} renderPolicyDesc - The RenderPolicy's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    retrieveRenderPolicy(renderPolicyDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(allRenderPolicies) {
            var renderPolicy = null;
            allRenderPolicies.forEach(function(rp) {
                if(rp.name() == renderPolicyDesc.name) {
                    renderPolicy = rp;
                }
            });

            if(renderPolicy == null) {
                failCallback(new Error("The RenderPolicy '" + renderPolicyDesc.name + "' doesn't exist !"));
            } else {
                successCallback(renderPolicy);
            }
        };

        RenderPolicy.all(successAll, fail);
    }

    /**
     * Method to retrieve ReceivePolicy.
     *
     * @method retrieveReceivePolicy
     * @param {JSON Object} receivePolicyDesc - The ReceivePolicy's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    retrieveReceivePolicy(receivePolicyDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(allReceivePolicies) {
            var receivePolicy = null;
            allReceivePolicies.forEach(function(rp) {
                if(rp.name() == receivePolicyDesc.name) {
                    receivePolicy = rp;
                }
            });

            if(receivePolicy == null) {
                failCallback(new Error("The ReceivePolicy '" + receivePolicyDesc.name + "' doesn't exist !"));
            } else {
                successCallback(receivePolicy);
            }
        };

        ReceivePolicy.all(successAll, fail);
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

            if(instances.length == 0) {
                Logger.info("Nothing to clean.");
                nbModels = nbModels + 1;

                if(nbModels == models.length) {
                    Logger.info("All models were clean.");
                    successCallback();
                }
            } else {

                var nbInstances = 0;
                instances.forEach(function (toDelete) {
                    var deleteSuccess = function () {
                        Logger.info("Instance delete successfully.");
                        nbInstances = nbInstances + 1;

                        if(nbInstances == instances.length) {
                            Logger.info("Model clean !");
                            nbModels = nbModels + 1;

                            if(nbModels == models.length) {
                                Logger.info("All models were clean.");
                                successCallback();
                            }
                        }
                    };

                    toDelete.delete(deleteSuccess, fail);
                });
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
