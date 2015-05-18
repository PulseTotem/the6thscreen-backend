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
/// <reference path="./model/InfoType.ts" />
/// <reference path="./model/ParamValue.ts" />
/// <reference path="./model/ParamType.ts" />
/// <reference path="./model/TypeParamType.ts" />
/// <reference path="./model/ConstraintParamType.ts" />
/// <reference path="./model/Policy.ts" />
/// <reference path="./model/Renderer.ts"/>
/// <reference path="./model/Role.ts" />
/// <reference path="./model/Source.ts" />
/// <reference path="./model/Service.ts" />
/// <reference path="./model/User.ts" />
/// <reference path="./model/Behaviour.ts" />

var crypto : any = require('crypto');

/**
 * Class to clean and Initialise Database with some data.
 *
 * @class CleanAndInitDatabase
 */
class CleanAndInitDatabase {

    static toCleanSources : Array<any> = [Source, Service, ParamType, InfoType, TypeParamType, ConstraintParamType];
    static toCleanUsers : Array<any> = [User];
    static toCleanSDIs : Array<any> = [SDI, Zone, CallType, Behaviour, Renderer, Policy];
    static toCleanProfils : Array<any> = [ParamValue, Call, Profil, ZoneContent, RelativeTimeline, RelativeEvent];

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
                                self.cleanAndInitForSources(success, fail);
                                break;
                            case "users" :
                                self.cleanAndInitForUsers(success, fail);
                                break;
                            case "sdis" :
                                self.cleanAndInitForSDIs(success, fail);
                                break;
                            case "profils" :
                                self.cleanAndInitForProfils(success, fail);
                                break;
                            case "all" :
                                var successCleanAndInitForSDIs = function() {
                                    self.cleanAndInitForProfils(success, fail);
                                };

                                var successCleanAndInitForUsers = function() {
                                    self.cleanAndInitForSDIs(successCleanAndInitForSDIs, fail);
                                };

                                var successCleanAndInitForSources = function() {
                                    self.cleanAndInitForUsers(successCleanAndInitForUsers, fail);
                                };

                                self.cleanAndInitForSources(successCleanAndInitForSources, fail);
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
    }

    /**
     * Method to clean and init database for sources.
     *
     * @method cleanAndInitForSources
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    cleanAndInitForSources(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var success = function() {
            successCallback();
        };

        var fail = function(err) {
            failCallback(err);
        };

        var successFulfillInfoTypes = function() {
            self.fulfillSources(success, fail);
        };

        var successFulfillServices = function() {
            self.fulfillServices(successFulfillInfoTypes, fail);
        };

        var successFulfillParamTypes = function() {
            self.fulfillInfoTypes(successFulfillServices, fail);
        };

        var successFulfillConstraints = function() {
            self.fulfillParamTypes(successFulfillParamTypes, fail);
        };

        var successFulfillTypeParamTypes = function() {
            self.fulfillConstraints(successFulfillConstraints, fail);
        };

        var successCleanAllSources = function() {
            self.fulfillTypeParamTypes(successFulfillTypeParamTypes, fail);
        };
        self.cleanAll(CleanAndInitDatabase.toCleanSources, successCleanAllSources, fail);
    }

    /**
     * Method to clean and init database for users.
     *
     * @method cleanAndInitForUsers
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    cleanAndInitForUsers(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var success = function() {
            successCallback();
        };

        var fail = function(err) {
            failCallback(err);
        };

        var successCleanAllUsers = function() {
            self.fulfillUsers(success, fail);
        };
        self.cleanAll(CleanAndInitDatabase.toCleanUsers, successCleanAllUsers, fail);
    }

    /**
     * Method to clean and init database for sdis.
     *
     * @method cleanAndInitForSDIs
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    cleanAndInitForSDIs(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var success = function() {
            successCallback();
        };

        var fail = function(err) {
            failCallback(err);
        };

        var successFulfillPolicies = function() {
            self.fulfillSDIs(success, fail);
        };

        var successFulfillRenderers = function() {
	        self.fulfillPolicies(successFulfillPolicies, fail);
        };

        var successFulfillBehaviours = function() {
            self.fulfillRenderers(successFulfillRenderers, fail);
        };

        var successCleanAllSDIs = function() {
            self.fulfillBehaviours(successFulfillBehaviours, fail);
        };

        self.cleanAll(CleanAndInitDatabase.toCleanSDIs, successCleanAllSDIs, fail);
    }

    /**
     * Method to clean and init database for profils.
     *
     * @method cleanAndInitForProfils
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    cleanAndInitForProfils(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var success = function() {
            successCallback();
        };

        var fail = function(err) {
            failCallback(err);
        };

        var successCleanAllProfils = function() {
            self.fulfillProfils(success, fail);
        }
        self.cleanAll(CleanAndInitDatabase.toCleanProfils, successCleanAllProfils, fail);
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
            var fail = function(err) {
                failCallback(err);
            };

            var source = new Source(sourceDesc.name, sourceDesc.description, sourceDesc.method);

            var retrievedParamTypes = new Array();

	        var successUpdate = function () {
		        Logger.info("Update source successfully.");
		        sourcesNb = sourcesNb + 1;

		        if(sourcesNb == sources.length) {
			        successCallback();
		        }
	        };

	        var successCheckCompleteness = function () {
		       Logger.info("Source check completeness successfully.");
		       source.update(successUpdate, fail);
	        };

            var successParamTypeRetrieve = function(newParamType) {
                retrievedParamTypes.push(newParamType);
                Logger.info("ParamType '" + retrievedParamTypes.length + "' retrieve successfully.");

                if(retrievedParamTypes.length == sourceDesc.paramTypes.length) {
                    var nbAssociation = 0;
                    var successParamTypeAssociation = function() {
                        nbAssociation = nbAssociation + 1;
                        Logger.info("ParamType associated to Source successfully.");

                        if(nbAssociation == retrievedParamTypes.length) {
                           source.checkCompleteness(successCheckCompleteness, fail);
                        }
                    };

                    retrievedParamTypes.forEach(function(paramType) {
                        source.addParamType(paramType.getId(), successParamTypeAssociation, fail);
                    });

                }
            };

            var successInfoTypeRetrieve = function(newInfoType) {
                Logger.info("InfoType retrieve successfully.");

                var successInfoTypeAssociation = function() {
                    Logger.info("InfoType associated to Source successfully.");
                    sourceDesc.paramTypes.forEach(function(paramType) {
                        self.retrieveParamType(paramType, successParamTypeRetrieve, fail);
                    });
                };

                source.linkInfoType(newInfoType.getId(), successInfoTypeAssociation, fail);
            };

            var successServiceRetrieve = function(newService) {
                Logger.info("Service retrieve successfully.");

                var successServiceAssociation = function() {
                    Logger.info("Service associated to Source successfully.");
                    self.retrieveInfoType(sourceDesc.infoType, successInfoTypeRetrieve, fail);
                };

                source.linkService(newService.getId(), successServiceAssociation, fail);
            };

            var successSourceCreate = function() {
                Logger.info("Source create successfully.");
                self.retrieveService(sourceDesc.service, successServiceRetrieve, fail);
            };

            source.create(successSourceCreate, fail);
        });
    }

    /**
     * Method to fulfill database with serices.
     *
     * @method fulfillServices
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    fulfillServices(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var servicesNb = 0;

        var services : any = require("../dbInitFiles/services.json");

        if(services.length == 0) {
            Logger.info("No Service to create.");
            successCallback();
            return;
        }

        services.forEach(function(serviceDesc) {
            var fail = function (err) {
                failCallback(err);
            };

            var service = new Service(serviceDesc.name, serviceDesc.description, serviceDesc.host, serviceDesc.oauth, serviceDesc.provider);

	        var successUpdate = function () {
		        Logger.info("Update service successfully.");
		        servicesNb = servicesNb + 1;

		        if(servicesNb == services.length) {
			        successCallback();
		        }
	        };

	        var successCompleteness = function () {
		        Logger.info("Check service completeness successfully.");
		        service.update(successUpdate, fail);
	        };

            var successServiceCreation = function() {
                Logger.info("Service created successfully.");
                service.checkCompleteness(successCompleteness, fail);
            };

            service.create(successServiceCreation, fail);

        });
    }

    /**
     * Method to fulfill database with infoTypes.
     *
     * @method fulfillInfoTypes
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    fulfillInfoTypes(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var infoTypesNb = 0;

        var infoTypes : any = require("../dbInitFiles/infotypes.json");

        if(infoTypes.length == 0) {
            Logger.info("No InfoType to create.");
            successCallback();
            return;
        }

        infoTypes.forEach(function(infoTypeDesc) {
            var fail = function (err) {
                failCallback(err);
            };

            var infoType = new InfoType(infoTypeDesc.name);

	        var successUpdate = function () {
		        Logger.info("Update infoType successfully.");
		        infoTypesNb = infoTypesNb + 1;

		        if(infoTypesNb == infoTypes.length) {
			        successCallback();
		        }
	        };

	        var successCompleteness = function () {
		        Logger.info("Check infoType completeness successfully.");
		        infoType.update(successUpdate, fail);
	        };

            var successInfoTypeCreation = function() {
                Logger.info("InfoType created successfully.");
                infoType.checkCompleteness(successCompleteness, fail);
            };

            infoType.create(successInfoTypeCreation, fail);

        });
    }

    /**
     * Method to fulfill database with paramTypes.
     *
     * @method fulfillParamTypes
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    fulfillParamTypes(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var paramTypesNb = 0;

        var paramTypes : any = require("../dbInitFiles/paramtypes.json");

        if(paramTypes.length == 0) {
            Logger.info("No ParamType to create.");
            successCallback();
            return;
        }

        paramTypes.forEach(function(paramTypeDesc) {
            var fail = function (err) {
                failCallback(err);
            };

            var paramType = new ParamType(paramTypeDesc.name, paramTypeDesc.description);

	        var successUpdate = function () {
		        Logger.info("Update ParamType successfully.");
		        paramTypesNb = paramTypesNb + 1;

		        if(paramTypesNb == paramTypes.length) {
			        successCallback();
		        }
	        };

	        var successCompleteness = function () {
		        Logger.info("Check paramType completeness successfully.");
		        paramType.update(successUpdate, fail);
	        };

            var successConstraintAssociation = function() {
                Logger.info("Constraint associated to ParamType successfully.");
	            paramType.checkCompleteness(successCompleteness, fail);
            }

            var successConstraintRetrieve = function(newConstraint) {
                Logger.info("Constraint retrieve successfully.");
                paramType.linkConstraint(newConstraint.getId(), successConstraintAssociation, fail);
            }

            var successTypeParamTypeAssociation = function() {
                Logger.info("TypeParamType associated to ParamType successfully.");
				if(paramTypeDesc.constraint != null) {
					self.retrieveConstraint(paramTypeDesc.constraint, successConstraintRetrieve, fail);
				} else {
					paramType.checkCompleteness(successCompleteness, fail);
				}
            };

            var successTypeParamTypeRetrieve = function(newTypeParamType) {
                Logger.info("TypeParamType retrieve successfully.");
                paramType.linkType(newTypeParamType.getId(), successTypeParamTypeAssociation, fail);
            };

            var successParamTypeCreate = function() {
                Logger.info("ParamType create successfully.");

                self.retrieveTypeParamType(paramTypeDesc.type, successTypeParamTypeRetrieve, fail);
            };

            paramType.create(successParamTypeCreate, fail);

        });
    }

    /**
     * Method to fulfill database with constraintParamTypes.
     *
     * @method fulfillConstraints
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    fulfillConstraints(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var constraintsNb = 0;

        var constraints : any = require("../dbInitFiles/constraints.json");

        if(constraints.length == 0) {
            Logger.info("No constraint to create.");
            successCallback();
            return;
        }

        constraints.forEach(function(constraintDesc) {
            var fail = function (err) {
                failCallback(err);
            };

            var constraint = new ConstraintParamType(constraintDesc.name, constraintDesc.description);

	        var successUpdate = function () {
		        Logger.info("Update ConstraintParamType successfully.");
		        constraintsNb = constraintsNb + 1;

		        if(constraintsNb == constraints.length) {
			        successCallback();
		        }
	        };

	        var successCompleteness = function () {
		        Logger.info("Check ConstraintParamType completeness successfully.");
		        constraint.update(successUpdate, fail);
	        };

            var successTypeParamTypeAssociation = function() {
                Logger.info("TypeParamType associated to Constraint successfully.");
	            constraint.checkCompleteness(successCompleteness, fail);
            };

            var successTypeParamTypeRetrieve = function(newTypeParamType) {
                Logger.info("TypeParamType retrieve successfully.");
                constraint.linkType(newTypeParamType.getId(), successTypeParamTypeAssociation, fail);
            };

            var successConstraintCreation = function() {
                Logger.info("Constraint create successfully.");

                self.retrieveTypeParamType(constraintDesc.type, successTypeParamTypeRetrieve, fail);
            };

            constraint.create(successConstraintCreation, fail);

        });
    }

    /**
     * Method to fulfill database with typeParamTypes.
     *
     * @method fulfillTypeParamTypes
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    fulfillTypeParamTypes(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var typeParamTypesNb = 0;

        var typeParamTypes : any = require("../dbInitFiles/typeparamtypes.json");

        if(typeParamTypes.length == 0) {
            Logger.info("No typeParamType to create.");
            successCallback();
            return;
        }

        typeParamTypes.forEach(function(typeParamTypeDesc) {
            var fail = function (err) {
                failCallback(err);
            };

            var typeParamType = new TypeParamType(typeParamTypeDesc.name);

	        var successUpdate = function () {
		        Logger.info("Update TypeParamType successfully.");
		        typeParamTypesNb = typeParamTypesNb + 1;

		        if(typeParamTypesNb == typeParamTypes.length) {
			        successCallback();
		        }
	        };

	        var successCompleteness = function () {
		        Logger.info("Check TypeParamType completeness successfully.");
		        typeParamType.update(successUpdate, fail);
	        };


	        var successTypeParamTypeCreation = function() {
                Logger.info("TypeParamType create successfully.");
		        typeParamType.checkCompleteness(successCompleteness, fail);
            };

            typeParamType.create(successTypeParamTypeCreation, fail);

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

            var fail = function (err) {
                failCallback(err);
            };

            var user = new User(userDesc.username, userDesc.email);

	        var successUpdate = function () {
		        Logger.info("Update user successfully.");
		        usersNb = usersNb + 1;

		        if(usersNb == users.length) {
			        successCallback();
		        }
	        };

	        var successCompleteness = function () {
		        Logger.info("Check user completeness successfully.");
		        user.update(successUpdate, fail);
	        };

            var successSetPassword = function() {
                Logger.info("User set password successfully.");
	            user.checkCompleteness(successCompleteness, fail);
            };

            var successUserCreate = function() {
                Logger.info("User create successfully.");

                var encryptedPwd = crypto.createHash('sha256').update(userDesc.password).digest("hex");

                user.setPassword(encryptedPwd, successSetPassword, fail);
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

            var fail = function (err) {
                failCallback(err);
            };

            var sdi = new SDI(sdiDesc.name, sdiDesc.description, sdiDesc.allowedHost);

            var nbCreatedCallTypes = 0;

	        var successUpdate = function () {
		        Logger.info("Update SDI successfully.");
		        sdisNb = sdisNb + 1;

		        if(sdisNb == sdis.length) {
			        Logger.info("Fulfill SDIs END !");
			        successCallback();
		        }
	        };

	        var successCompleteness = function () {
		        Logger.info("Check SDI completeness successfully.");
		        sdi.update(successUpdate, fail);
	        };


	        var successCallTypeCreate = function(newCallType) {
                Logger.info("CallType created successfully.");
                nbCreatedCallTypes = nbCreatedCallTypes + 1;

                if(nbCreatedCallTypes == sdiDesc.callTypes.length) {
	                sdi.checkCompleteness(successCompleteness, fail);
                }
            };

            var createdZones = new Array();

            var successZoneCreate = function(newZone) {
                createdZones.push(newZone);
                Logger.info("Zone created successfully.");

                if(createdZones.length == sdiDesc.zones.length) {
                    var nbAssociation = 0;
                    var successZoneAssociation = function() {
                        Logger.info("Zone associated to SDI successfully.");
                        nbAssociation = nbAssociation + 1;

                        if(nbAssociation == createdZones.length) {
                            sdiDesc.callTypes.forEach(function(callType) {
                                self.manageCallTypeCreation(callType, successCallTypeCreate, fail);
                            });
                        }
                    };

                    createdZones.forEach(function(zone) {
                        sdi.addZone(zone.getId(), successZoneAssociation, fail);
                    });
                }
            };

            var successUserRetrieve = function(user) {
                Logger.info("User retrieved successfully.");

                var successUserAssociation = function() {
                    Logger.info("SDI associated to User successfully.");
                    Logger.info("Begin loop for zones : " + sdiDesc.zones.length);
                    sdiDesc.zones.forEach(function(zone) {
                        self.manageZoneCreation(zone, successZoneCreate, fail);
                    });
                };

                user.addSDI(sdi.getId(), successUserAssociation, fail);
            };

            var successSDICreate = function() {
                Logger.info("SDI create successfully.");

                self.retrieveUser(sdiDesc.user, successUserRetrieve, fail);
            };

            sdi.create(successSDICreate, fail);

        });
    }

    /**
     * Method to fulfill database with Behaviours.
     *
     * @method fulfillBehaviours
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    fulfillBehaviours(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var behavioursNb = 0;

        var behaviours : any = require("../dbInitFiles/behaviours.json");

        if(behaviours.length == 0) {
            Logger.info("No Behaviour to create.");
            successCallback();
            return;
        }

        behaviours.forEach(function(behaviourDesc) {
            var fail = function (err) {
                failCallback(err);
            };

            var behaviour = new Behaviour(behaviourDesc.name, behaviourDesc.description);

	        var successUpdate = function () {
		        Logger.info("Update behaviour successfully.");
		        behavioursNb = behavioursNb + 1;

		        if(behavioursNb == behaviours.length) {
			        successCallback();
		        }
	        };

	        var successCompleteness = function () {
		        Logger.info("Check behaviour completeness successfully.");
		        behaviour.update(successUpdate, fail);
	        };


	        var successBehaviourCreation = function() {
                Logger.info("Behaviour created successfully.");
		        behaviour.checkCompleteness(successCompleteness, fail);
            };

            behaviour.create(successBehaviourCreation, fail);

        });
    }

    /**
     * Method to fulfill database with Renderers.
     *
     * @method fulfillRenderers
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    fulfillRenderers(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var renderersNb = 0;

        var renderers : any = require("../dbInitFiles/renderers.json");

        if(renderers.length == 0) {
            Logger.info("No Renderer to create.");
            successCallback();
            return;
        }

        renderers.forEach(function(rendererDesc) {
            var fail = function (err) {
                failCallback(err);
            };

            var renderer = new Renderer(rendererDesc.name, rendererDesc.description)

	        var successUpdate = function () {
		        Logger.info("Update renderer successfully.");
		        renderersNb = renderersNb + 1;

		        if(renderersNb == renderers.length) {
			        successCallback();
		        }
	        };

	        var successCompleteness = function () {
		        Logger.info("Check renderer completeness successfully.");
		        renderer.update(successUpdate, fail);
	        };


	        var successInfoTypeRetrieve = function(newInfotype) {
                Logger.info("InfoType retrieved successfully.");

                var successInfoTypeAssociation = function() {
                    Logger.info("InfoType associated to Renderer successfully.");
	                renderer.checkCompleteness(successCompleteness, fail);
                };

                renderer.linkInfoType(newInfotype.getId(), successInfoTypeAssociation, fail);
            };

            var successRendererCreation = function() {
                Logger.info("Renderer created successfully.");

                self.retrieveInfoType(rendererDesc.infoType, successInfoTypeRetrieve, fail);
            };

            renderer.create(successRendererCreation, fail);

        });
    }

    /**
     * Method to fulfill database with Policies.
     *
     * @method fulfillPolicies
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    fulfillPolicies(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var policiesNb = 0;

        var policies : any = require("../dbInitFiles/policies.json");

        if(policies.length == 0) {
            Logger.info("No Policy to create.");
            successCallback();
            return;
        }

	    policies.forEach(function(policyDesc) {
            var fail = function (err) {
                failCallback(err);
            };

            var policy = new Policy(policyDesc.name);

		    var successUpdate = function () {
			    Logger.info("Update Policy successfully.");
			    policiesNb = policiesNb + 1;

			    if(policiesNb == policies.length) {
				    successCallback();
			    }
		    };

		    var successCompleteness = function () {
			    Logger.info("Check Policy completeness successfully.");
			    policy.update(successUpdate, fail);
		    };


		    var successPolicyCreation = function() {
                Logger.info("Policy created successfully.");
			    policy.checkCompleteness(successCompleteness, fail);
            };

            policy.create(successPolicyCreation, fail);

        });
    }

    /**
     * Method to fulfill database with Profils.
     *
     * @method fulfillProfils
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    fulfillProfils(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var profilsNb = 0;

        var profils : any = require("../dbInitFiles/profils.json");

        if(profils.length == 0) {
            Logger.info("No profils to create.");
            successCallback();
            return;
        }

        profils.forEach(function(profilDesc : any) {

            var fail = function (err) {
                failCallback(err);
            };

            var profil = new Profil(profilDesc.name, profilDesc.description);

	        var successUpdate = function () {
		        Logger.info("Update Profil successfully.");
		        profilsNb = profilsNb + 1;

		        if(profilsNb == profils.length) {
			        successCallback();
		        }
	        };

	        var successCompleteness = function () {
		        Logger.info("Check Profil completeness successfully.");
		        profil.update(successUpdate, fail);
	        };


            var successSDIRetrieve = function(newSDI) {
                Logger.info("SDI retrieve successfully");

                var successSDIAssociation = function() {
                    Logger.info("Profil associated to SDI successfully.");
	                profil.checkCompleteness(successCompleteness, fail);
                }

                newSDI.addProfil(profil.getId(), successSDIAssociation, fail);
            };

            var createdZoneContents = new Array();

            var successZoneContentCreate = function(newZoneContent) {
	            createdZoneContents.push(newZoneContent);
                Logger.info("ZoneContent created successfully.");

                if(createdZoneContents.length == profilDesc.zoneContents.length) {
                    var nbAssociation = 0;
                    var successZoneContentAssociation = function() {
                        Logger.info("ZoneContent associated to Profil successfully.");
                        nbAssociation = nbAssociation + 1;

                        if (nbAssociation == createdZoneContents.length) {
                            self.retrieveSDI(profilDesc.sdi, successSDIRetrieve, fail);
                        }
                    };

	                createdZoneContents.forEach(function(zoneContent) {
                        profil.addZoneContent(zoneContent.getId(), successZoneContentAssociation, fail);
                    });
                }
            };

            var successProfilCreate = function() {
                Logger.info("Profil create successfully.");

                profilDesc.zoneContents.forEach(function(zoneContent) {
                    self.manageZoneContentCreation(zoneContent, successZoneContentCreate, fail);
                });
            };

            profil.create(successProfilCreate, fail);

        });
    }

    /**
     * Method to retrieve SDI.
     *
     * @method retrieveSDI
     * @param {JSON Object} sdiDesc - The SDI's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    retrieveSDI(sdiDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(allSDIs) {
            var sdi = null;
            allSDIs.forEach(function(sdiInstance) {
                if(sdiInstance.name() == sdiDesc.name) {
                    sdi = sdiInstance;
                }
            });

            if(sdi == null) {
                failCallback(new Error("The SDI '" + sdiDesc.name + "' doesn't exist !"));
            } else {
                successCallback(sdi);
            }
        };

        SDI.all(successAll, fail);
    }

    /**
     * Method to retrieve ParamType.
     *
     * @method retrieveParamType
     * @param {JSON Object} paramTypeDesc - The ParamType's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    retrieveParamType(paramTypeDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
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
                failCallback(new Error("The ParamType '" + paramTypeDesc.name + "' doesn't exist !"));
            } else {
                successCallback(paramType);
            }
        };

        ParamType.all(successAll, fail);
    }

    /**
     * Method to retrieve TypeParamType.
     *
     * @method retrieveTypeParamType
     * @param {JSON Object} typeParamTypeDesc - The TypeParamType's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    retrieveTypeParamType(typeParamTypeDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(allTypeParamTypes) {
            var typeParamType = null;
            allTypeParamTypes.forEach(function(tpt) {
                if(tpt.name() == typeParamTypeDesc.name) {
                    typeParamType = tpt;
                }
            });

            if(typeParamType == null) {
                failCallback(new Error("The TypeParamType '" + typeParamTypeDesc.name + "' doesn't exist !"));
            } else {
                successCallback(typeParamType);
            }
        };

        TypeParamType.all(successAll, fail);
    }

    /**
     * Method to retrieve Constraint.
     *
     * @method retrieveConstraint
     * @param {JSON Object} constraintDesc - The Constraint's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    retrieveConstraint(constraintDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(allConstraints) {
            var constraint = null;
            allConstraints.forEach(function(c) {
                if(c.name() == constraintDesc.name) {
                    constraint = c;
                }
            });

            if(constraint == null) {
                failCallback(new Error("The ConstraintParamType '" + constraintDesc.name + "' doesn't exist !"));
            } else {
                successCallback(constraint);
            }
        };

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
     * @param {JSON} zoneDesc - The Zone's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    manageZoneCreation(zoneDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var zone = new Zone(zoneDesc.name, zoneDesc.description, zoneDesc.width, zoneDesc.height, zoneDesc.positionFromTop, zoneDesc.positionFromLeft);


	    var successUpdate = function () {
		    Logger.info("Update zone successfully.");
		    successCallback(zone);
	    };

	    var successCompleteness = function () {
		    Logger.info("Check zone completeness successfully.");
		    zone.update(successUpdate, fail);
	    };

        var successBehaviourRetrieved = function(newBehaviour) {
            Logger.info("Behaviour retrieved successfully.");
            var successBehaviourAssociation = function() {
                Logger.info("Behaviour associated to Zone successfully.");
                zone.checkCompleteness(successCompleteness, fail);
            };

            zone.linkBehaviour(newBehaviour.getId(), successBehaviourAssociation, fail);
        };

        var successZoneCreation = function() {
            Logger.info("Zone created successfully.");
            self.retrieveBehaviour(zoneDesc.behaviour, successBehaviourRetrieved, fail);
        };

        zone.create(successZoneCreation, fail);

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


        var callType = new CallType(callTypeDesc.name, callTypeDesc.description);

	    var successUpdate = function () {
		    Logger.info("Update callType successfully.");
		    successCallback(callType);
	    };

	    var successCompleteness = function () {
		    Logger.info("Check callType completeness successfully.");
		    callType.update(successUpdate, fail);
	    };

        var successPolicyRetrieved = function(newPolicy) {
            Logger.info("Policy retrieved successfully.");

            var successPolicyAssociation = function() {
                Logger.info("Policy associated to CallType successfully.");
	            callType.checkCompleteness(successCompleteness, fail);
            };

            callType.linkPolicy(newPolicy.getId(), successPolicyAssociation, fail);
        };

        var successRendererRetrieved = function(newRenderer) {
            Logger.info("Renderer retrieved successfully.");

            var successRendererAssociation = function() {
                Logger.info("Renderer associated to CallType successfully.");
                self.retrievePolicy(callTypeDesc.policy, successPolicyRetrieved, fail);
            };

            callType.linkRenderer(newRenderer.getId(), successRendererAssociation, fail);
        };

        var successSourceRetrieve = function(newSource) {
            Logger.info("Source retrieved successfully.");

            var successSourceAssociation = function() {
                Logger.info("Source associated to CallType successfully.");
                self.retrieveRenderer(callTypeDesc.renderer, successRendererRetrieved, fail);
            };

            callType.linkSource(newSource.getId(), successSourceAssociation, fail);
        };

        var successZoneRetrieve = function(newZone) {
            Logger.info("Zone retrieved successfully.");

            var successZoneAssociation = function() {
                Logger.info("Zone associated to CallType successfully.");
                self.retrieveSource(callTypeDesc.source, successSourceRetrieve, fail);
            };

            callType.linkZone(newZone.getId(), successZoneAssociation, fail);
        };

        var successCallTypeCreation = function() {
            Logger.info("CallType created successfully.");
            self.retrieveZone(callTypeDesc.zone, successZoneRetrieve, fail);
        };

        callType.create(successCallTypeCreation, fail);

    }

	manageRelativeEventCreation(relativeEventDesc : any, successCallback : Function = null, failCallback : Function = null) {
		var self = this;

		var fail = function (err) {
			failCallback(err);
		};

		var relativeEvent = new RelativeEvent(relativeEventDesc.name, relativeEventDesc.position, relativeEventDesc.duration);

		var successUpdate = function() {
			Logger.info("RelativeEvent update successfully");

			successCallback(relativeEvent);
		};

		var successCheck = function () {
			Logger.info("RelativeEvent check sucessfully");

			relativeEvent.update(successUpdate, fail);
		};

		var successLinkCall = function () {
			Logger.info("Call linked successfully");

			relativeEvent.checkCompleteness(successCheck, fail);
		};

		var successCallCreation = function (call) {
			Logger.info("Call creation successfully");

			relativeEvent.linkCall(call.getId(), successLinkCall, fail);
		};

		var successRelativeEventCreation = function () {
			Logger.info("Relative event creation successfully");

			self.manageCallCreation(relativeEventDesc.call, successCallCreation, fail);
		};

		relativeEvent.create(successRelativeEventCreation, fail);
	}

	manageRelativeTimelineCreation(relativeTimelineDesc : any, successCallback : Function = null, failCallback : Function = null) {
		var self = this;

		var fail = function (err) {
			failCallback(err);
		};

		var relativeTL = new RelativeTimeline(relativeTimelineDesc.name);

		var linkedRelativeEvent = 0;

		var successUpdate = function () {
			Logger.info("Update successfully");
			successCallback(relativeTL);
		};

		var sucessCheckCompleteness = function () {
			Logger.info("Check completeness successfully");
			relativeTL.update(successUpdate, fail);
		};

		var successLinkRelativeEvent = function () {
			Logger.info("Relative Event added successfully");

			linkedRelativeEvent++;

			if (linkedRelativeEvent == relativeTimelineDesc.relativeEvents.length) {
				relativeTL.checkCompleteness(sucessCheckCompleteness, fail);
			}
		};

		var successRelativeEventCreation = function (relativeEvent) {
			Logger.info("Relative Event created successfully");

			relativeTL.addRelativeEvent(relativeEvent.getId(), successLinkRelativeEvent, fail);
		};

		var successRelativeTLCreation = function () {
			Logger.info("Relative TL created successfully");

			relativeTimelineDesc.relativeEvents.forEach( function (relativeEventDesc) {
				self.manageRelativeEventCreation(relativeEventDesc, successRelativeEventCreation, fail);
			});
		};

		relativeTL.create(successRelativeTLCreation, fail);
	}

	manageZoneContentCreation(zoneContentDesc : any, successCallback : Function = null, failCallback : Function = null) {
		var self = this;

		var fail = function (err) {
			failCallback(err);
		};

		var zonec = new ZoneContent(zoneContentDesc.name);

		var successUpdate = function () {
			Logger.info("ZoneCOntent Update successfully.");
			successCallback(zonec);
		};

		var successCheck = function () {
			Logger.info("ZoneContent Check completeness successfully.");
			zonec.update(successUpdate, fail);
		};

		var successLinkRelativeTimeline = function () {
			Logger.info("Relative timeline linked successfully.");
			zonec.checkCompleteness(successCheck, fail);
		};

		var successCreateRelativeTimeline = function (relativeTimeline) {
			Logger.info("Relative timeline created successfully.");
			zonec.linkRelativeTimeline(relativeTimeline.getId(), successLinkRelativeTimeline, fail);
		};

		var successLinkZone = function() {
			Logger.info("Zone linked successfully.");

			self.manageRelativeTimelineCreation(zoneContentDesc.relativeTimeline, successCreateRelativeTimeline, fail);
		};


		var sucessRetrieveZone = function (zone) {
			Logger.info("Zone retrieved successfully.");
			zonec.linkZone(zone.getId(), successLinkZone, fail);
		};


		var successZoneContentCreation = function() {
			Logger.info("ZoneContent created successfully.");

			self.retrieveZone(zoneContentDesc.zone, sucessRetrieveZone, fail);
		}
		zonec.create(successZoneContentCreation, fail);
	}

    /**
     * Method to manage creation of Call.
     *
     * @method manageCallCreation
     * @param {JSON Object} callDesc - The Call's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    manageCallCreation(callDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var call = new Call(callDesc.name);

	    var successUpdate = function () {
		    Logger.info("Update call successfully.");
		    successCallback(call);
	    };

	    var successCompleteness = function () {
		    Logger.info("Check call completeness successfully.");
		    call.update(successUpdate, fail);
	    };

        var createdParamValues = new Array();

        var successParamValueCreate = function(newParamValue) {
            createdParamValues.push(newParamValue);
            Logger.info("ParamValue created successfully.");

            if(createdParamValues.length == callDesc.paramValues.length) {
                var nbAssociation = 0;
                var successParamValueAssociation = function() {
                    Logger.info("ParamValue associated to Call successfully.");
                    nbAssociation = nbAssociation + 1;

                    if(nbAssociation == createdParamValues.length) {
	                    call.checkCompleteness(successCompleteness, fail);
                    }
                };

                createdParamValues.forEach(function(paramValue) {
                    call.addParamValue(paramValue.getId(), successParamValueAssociation, fail);
                });
            }
        };

        var successCallTypeRetrieved = function(newCallType) {
            Logger.info("CallType retrieved successfully.");
            var successCallTypeAssociation = function() {
                Logger.info("CallType associated to Call successfully.");

                callDesc.paramValues.forEach(function(paramValue) {
                    self.manageParamValueCreation(paramValue, successParamValueCreate, fail);
                });
            };

            call.linkCallType(newCallType.getId(), successCallTypeAssociation, fail);
        };

        var successCallCreation = function() {
            Logger.info("Call created successfully.");
            self.retrieveCallType(callDesc.callType, successCallTypeRetrieved, fail);
        };

        call.create(successCallCreation, fail);

    }

    /**
     * Method to manage creation of ParamValue.
     *
     * @method manageParamValueCreation
     * @param {JSON Object} paramValueDesc - The ParamValue's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    manageParamValueCreation(paramValueDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var paramValue = new ParamValue(paramValueDesc.value);

	    var successUpdate = function () {
		    Logger.info("Update paramValue successfully.");
		    successCallback(paramValue);
	    };

	    var successCompleteness = function () {
		    Logger.info("Check paramValue completeness successfully.");
		    paramValue.update(successUpdate, fail);
	    };

        var successParamTypeRetrieved = function(newParamType) {
            Logger.info("ParamType retrieved successfully.");
            var successParamTypeAssociation = function() {
                Logger.info("ParamType associated to ParamValue successfully.");
	            paramValue.checkCompleteness(successCompleteness, fail);
            };

            paramValue.linkParamType(newParamType.getId(), successParamTypeAssociation, fail);
        };

        var successParamValueCreation = function() {
            Logger.info("ParamValue created successfully.");
            self.retrieveParamType(paramValueDesc.paramType, successParamTypeRetrieved, fail);
        };

        paramValue.create(successParamValueCreation, fail);

    }

    /**
     * Method to retrieve CallType.
     *
     * @method retrieveCallType
     * @param {JSON Object} callTypeDesc - The CallType's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    retrieveCallType(callTypeDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
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
                failCallback(new Error("The CallType '" + callTypeDesc.name + "' doesn't exist !"));
            } else {
                successCallback(callType);
            }
        };

        CallType.all(successAll, fail);
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
     * Method to retrieve Service.
     *
     * @method retrieveService
     * @param {JSON Object} serviceDesc - The Service's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    retrieveService(serviceDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(allServices) {
            var service = null;
            allServices.forEach(function(s) {
                if(s.name() == serviceDesc.name) {
                    service = s;
                }
            });

            if(service == null) {
                failCallback(new Error("The Service '" + serviceDesc.name + "' doesn't exist !"));
            } else {
                successCallback(service);
            }
        };

        Service.all(successAll, fail);
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
     * Method to retrieve Policy.
     *
     * @method retrievePolicy
     * @param {JSON Object} receivePolicyDesc - The ReceivePolicy's description
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    retrievePolicy(policyDesc : any, successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var fail = function (err) {
            failCallback(err);
        };

        var successAll = function(allpolicies) {
            var policy = null;
	        allpolicies.forEach(function(rp) {
                if(rp.name() == policyDesc.name) {
	                policy = rp;
                }
            });

            if (policy == null) {
                failCallback(new Error("The ReceivePolicy '" + policyDesc.name + "' doesn't exist !"));
            } else {
                successCallback(policy);
            }
        };

        Policy.all(successAll, fail);
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
                }
				if(keyVal[0] == "dbhost") {
					process.env["T6S_DATABASE_HOST"] = keyVal[1];
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