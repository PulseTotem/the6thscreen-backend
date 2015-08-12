/**
 * @author Christian Brel <brel@i3s.unice.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/ConstraintParamType.ts" />
/// <reference path="../../scripts/model/TypeParamType.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('ConstraintParamType', function() {
	describe('#constructor', function () {
		it('should store the name', function(){
			var name = "machin";
			var c = new ConstraintParamType(name,"");
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function(){
			var desc = "machin";
			var c = new ConstraintParamType("",desc);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the ID', function() {
			var id = 52;
			var c = new ConstraintParamType("","",id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function() {
			var c = new ConstraintParamType("tze","tete",42,true);
			assert.equal(c.isComplete(), true, "The complete value is not stored.");
		});

		it('should assign a default false value to complete', function() {
			var c = new ConstraintParamType();
			assert.equal(c.isComplete(), false, "The complete value is not stored.");
		});
	});

	describe('#checkCompleteness', function() {
		it('should consider the object as complete if it has an ID, a name and a complete type', function(done) {
			var cpt = new ConstraintParamType("bidule", null, 52);

			var response : any = {
					"id":12,
					"name": "type",
					"complete": true
				};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ConstraintParamType.getTableName(), cpt.getId().toString(), TypeParamType.getTableName()))
				.reply(200, JSON.stringify(response));

			var success = function() {
				assert.ok(restClientMock.isDone(), "The mock request has not been done to get the type");
				assert.equal(cpt.isComplete(), true, "The object should be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has an ID, a name and a type which is not complete itself', function(done) {
			var cpt = new ConstraintParamType("bidule", "Description de bidule", 52);

			var response : any = {
					"id":12,
					"name": "type",
					"complete": false
				};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ConstraintParamType.getTableName(), cpt.getId().toString(), TypeParamType.getTableName()))
				.reply(200, JSON.stringify(response));

			var success = function() {
				assert.ok(restClientMock.isDone(), "The mock request has not been done to get the type");
				assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has no id', function(done) {
			nock.disableNetConnect();

			var cpt = new ConstraintParamType("bidule", "Description de bidule");

			var success = function() {
				assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has an empty name', function(done) {
			nock.disableNetConnect();

			var cpt = new ConstraintParamType("", "Description de bidule",24);

			var success = function() {
				assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has a null name', function(done) {
			nock.disableNetConnect();

			var cpt = new ConstraintParamType(null, "Description de bidule",24);

			var success = function() {
				assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it is empty', function(done) {
			nock.disableNetConnect();

			var cpt = new ConstraintParamType();

			var success = function() {
				assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});
	});

    describe("#type", function() {
        it('should be null at initialization', function(done) {
            var cpt = new ConstraintParamType("bidule", "Description de bidule", 52);

            var response : any = [];

            var restClientMock = nock(DatabaseConnection.getBaseURL())
                .get(DatabaseConnection.associationEndpoint(ConstraintParamType.getTableName(), cpt.getId().toString(), TypeParamType.getTableName()))
                .reply(200, JSON.stringify(response));

            var success = function() {
                var type = cpt.type();

                assert.deepEqual(type, null, "The type is not null: "+JSON.stringify(type));
                assert.ok(restClientMock.isDone(), "The mock request has not been done to get the type");

                done();
            };

            var fail = function(err) {
                done(err);
            }

            cpt.loadType(success, fail);
        });
    });

	describe('#fromJSONobject', function() {
		it('should create the right object', function() {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "blabla",
				"complete": true
			};

			var callRetrieve = ConstraintParamType.fromJSONObject(json);
			var callExpected = new ConstraintParamType("toto","blabla",42,true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve constraintParamType ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should create the right object even if it is partial', function() {
			var json = {
				"id": 42,
				"name": "",
				"description": null,
				"complete": false
			};

			var callRetrieve = ConstraintParamType.fromJSONObject(json);
			var callExpected = new ConstraintParamType("",null,42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve constraintParamType ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});
	});

	describe('#toJsonObject', function() {
		it('should create the expected JSON Object', function() {
			var c = new ConstraintParamType("toto","blabla", 52);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"id": 52,
				"complete": false,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object ("+JSON.stringify(json)+") and the expected JSON ("+JSON.stringify(expected)+") do not match.");
		})
	});

	describe('#linkType', function() {
		it('should call the right request', function(done) {
			var c = new ConstraintParamType("toto","machin", 52);
			var s = new TypeParamType("toto", 42);

			var response1 : any = [];

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ConstraintParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var type = c.type();
                assert.equal(type, null, "The type is not a null value: "+JSON.stringify(type));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the type");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(ConstraintParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the linkTypeParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the type in database.");
					done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkType(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadType(success, fail);
		});

	});

	describe('#unlinkType', function() {
		it('should call the right request', function(done) {
			var c = new ConstraintParamType("toto","machin", 52);
			var s = new TypeParamType("toto", 42);

			var response1 : any = s.toJSONObject();

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ConstraintParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var type = c.type();
                assert.deepEqual(type, s, "The type is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the type");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(ConstraintParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkTypeParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkType(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadType(success, fail);
		});

	});
});