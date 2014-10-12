/**
 * @author Christian Brel <brel@i3s.unice.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../app/scripts/model/ConstraintParamType.ts" />
/// <reference path="../../app/scripts/model/TypeParamType.ts" />

var assert = require("assert");
var nock = require("nock");
var sinon : SinonStatic = require("sinon");

describe('ConstraintParamType', function(){
    describe('#constructor', function() {
        it('should store the name', function(){
            var name = "machin";
            var cpt = new ConstraintParamType(name, "Description de machin");
            assert.equal(cpt.name(), name, "The name is not stored correctly.");
        });

        it('should store the description', function(){
            var description = "Description de chouette";
            var cpt = new ConstraintParamType("chouette", description);
            assert.equal(cpt.description(), description, "The description is not stored correctly.");
        });

        it('should store the ID', function() {
            var id = 52;
            var cpt = new ConstraintParamType("bidule", "Description de bidule", id);
            assert.equal(cpt.getId(), id, "The ID is not stored.");
        });
    });

    describe('#fromJSONobject', function() {
        it('should create the right object', function() {
            var json =
            {
                "id" : 42,
                "name" : "toto",
                "description" : "Description de toto"
            };

            var cptRetrieve = ConstraintParamType.fromJSONObject(json);
            var cptExpected = new ConstraintParamType("toto", "Description de toto", 42);

            assert.deepEqual(cptRetrieve, cptExpected, "The retrieve ConstraintParamType ("+cptRetrieve+") does not match with the expected one ("+cptExpected+")");
        });

        it('should throw an exception if the ID is undefined', function() {
            var json =
            {
                "name" : "toto",
                "description" : "Description de toto"
            };

            assert.throws(function() {
                    ConstraintParamType.fromJSONObject(json);
                },
                ModelException, "The exception has not been thrown.");
        });

        it('should throw an exception if the ID is null', function() {
            var json =
            {
                "id" : null,
                "name" : "toto",
                "description" : "Description de toto"
            };

            assert.throws(function() {
                    ConstraintParamType.fromJSONObject(json);
                },
                ModelException, "The exception has not been thrown.");
        });

        it('should throw an exception if the name is undefined', function() {
            var json =
            {
                "id" : 42,
                "description" : "Description de toto"
            };

            assert.throws(function() {
                    ConstraintParamType.fromJSONObject(json);
                },
                ModelException, "The exception has not been thrown.");
        });

        it('should throw an exception if the name is null', function() {
            var json =
            {
                "id" : 42,
                "name" : null,
                "description" : "Description de toto"
            };

            assert.throws(function() {
                    ConstraintParamType.fromJSONObject(json);
                },
                ModelException, "The exception has not been thrown.");
        });

        it('should throw an exception if the description is undefined', function() {
            var json =
            {
                "id" : 42,
                "name" : "toto"
            };

            assert.throws(function() {
                    ConstraintParamType.fromJSONObject(json);
                },
                ModelException, "The exception has not been thrown.");
        });

        it('should throw an exception if the description is null', function() {
            var json =
            {
                "id" : 42,
                "name" : "toto",
                "description" : null
            };

            assert.throws(function() {
                    ConstraintParamType.fromJSONObject(json);
                },
                ModelException, "The exception has not been thrown.");
        });
    });

    describe('#toJsonObject', function() {
        var cpt = new ConstraintParamType("toto", "Description de toto", 52);
        var expected =
        {
            "id" : 52,
            "name" : "toto",
            "description" : "Description de toto"
        };
        var json = cpt.toJSONObject();

        assert.deepEqual(json, expected, "The JSON object ("+JSON.stringify(json)+") and the expected JSON ("+JSON.stringify(expected)+") do not match.");
    });

    describe("#type", function() {
       it('should be null at initialization', function() {
           var cpt = new ConstraintParamType("bidule", "Description de bidule", 52);

           var reponse : SequelizeRestfulResponse = {
               "status": "success",
               "data": []
           };

           var restClientMock = nock(DatabaseConnection.getBaseURL())
               .get(DatabaseConnection.associationEndpoint(ConstraintParamType.getTableName(), cpt.getId().toString(), TypeParamType.getTableName()))
               .reply(200, JSON.stringify(reponse));

           var type = cpt.type();

           assert.deepEqual(type, null, "The type is not null: "+JSON.stringify(type));
           assert.ok(restClientMock.isDone(), "The mock request has not been done to get the type");
       });
    });

    describe('#setType', function() {
        it('should set the new TypeParamType to ConstraintParamType', function() {
            var cpt = new ConstraintParamType("bidule", "Description de bidule", 52);
            var tpt = new TypeParamType("Entier",12);
            var spy = sinon.spy(tpt, "desynchronize");

            var reponse : SequelizeRestfulResponse = {
                "status": "success",
                "data": {}
            };

            var restClientMock = nock(DatabaseConnection.getBaseURL())
                .put(DatabaseConnection.associatedObjectEndpoint(ConstraintParamType.getTableName(), cpt.getId().toString(), TypeParamType.getTableName(), tpt.getId().toString()))
                .reply(200, JSON.stringify(reponse));

            var retour = cpt.setType(tpt);
            assert.ok(retour, "The return of the setType is false.");
            assert.ok(restClientMock.isDone(), "The mock request has not been done to associate the TypeParamType in database.");
            assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

            var type = cpt.type();
            var expected = tpt;
            assert.deepEqual(type, expected, "The result of type function ("+JSON.stringify(type)+") and the expected result ("+JSON.stringify(expected)+") do not match.");
        });

        it('should not allow to set a null object', function() {
            nock.disableNetConnect();
            var cpt = new ConstraintParamType("bidule", "Description de bidule", 52);

            assert.throws(function() {
                    cpt.setType(null);
                },
                ModelException,
                "The exception has not been thrown.");
        });

        it('should not allow to add an undefined object', function() {
            nock.disableNetConnect();
            var cpt = new ConstraintParamType("bidule", "Description de bidule", 52);

            assert.throws(function() {
                    cpt.setType(undefined);
                },
                ModelException,
                "The exception has not been thrown.");
        });

        it('should not allow to add a object which is not yet created', function() {
            nock.disableNetConnect();
            var cpt = new ConstraintParamType("bidule", "Description de bidule", 52);
            var tpt = new TypeParamType("Entier");

            assert.throws(function() {
                    cpt.setType(tpt);
                },
                ModelException,
                "The exception has not been thrown.");
        });

        it('should not allow to set a type if a previous one was set', function() {
            var cpt = new ConstraintParamType("bidule", "Description de bidule", 52);
            var tptEntier = new TypeParamType("Entier",12);

            cpt.setType(tptEntier);

            var tptString = new TypeParamType("string",24);

            assert.throws(function() {
                    cpt.setType(tptString);
                },
                ModelException,
                "The exception has not been thrown.");
        });

    })
});