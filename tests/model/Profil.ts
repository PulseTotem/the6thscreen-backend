/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/Profil.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('Profil', function() {
	describe('#constructor', function () {
		it('should store the name', function () {
			var name = "machin";
			var c = new Profil(name, "");
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function () {
			var desc = "machin";
			var c = new Profil("", desc);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new Profil("", "", id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete attribute', function () {
			var c = new Profil("test", "t", 34, true);
			assert.equal(c.isComplete(), true, "The complete attribute is not stored.");
		});

		it('should assign a false value by default to complete', function () {
			var c = new Profil();
			assert.equal(c.isComplete(), false, "The complete attribute is not stored.");
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "blabla",
				"complete": true
			};

			var callRetrieve = Profil.fromJSONObject(json);
			var callExpected = new Profil("toto", "blabla", 42, true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve profil (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});

		it('should create the right object even if it is partial', function () {
			var json = {
				"id": 42,
				"name": null,
				"description": "blabla",
				"complete": false
			};

			var callRetrieve = Profil.fromJSONObject(json);
			var callExpected = new Profil(null, "blabla", 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve profil (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});

		it('should throw an exception if the ID is undefined', function () {
			var json = {
				"name": "toto",
				"description": "blabla",
				"complete": false
			};

			assert.throws(function () {
					Profil.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function () {
			var json = {
				"name": "toto",
				"description": "blabla",
				"id": null,
				"complete": false
			};

			assert.throws(function () {
					Profil.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the complete attribute is undefined', function () {
			var json = {
				"name": "toto",
				"description": "blabla",
				"id": 34
			};

			assert.throws(function () {
					Profil.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the complete value is null', function () {
			var json = {
				"name": "toto",
				"description": "blabla",
				"id": 34,
				"complete": null
			};

			assert.throws(function () {
					Profil.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new Profil("toto", "blabla", 52, true);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"id": 52,
				"complete": true
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#checkCompleteness()', function() {
		it('should return false if the object is empty', function (done) {
			var b =  new Profil();
			var success = function () {
				assert.equal(b.isComplete(), false, "The Profil should not be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return true if the object has a name and an ID but no description', function(done) {
			var b = new Profil("toto", null, 52);
			var success = function () {
				assert.equal(b.isComplete(), true, "The Profil should be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return false if the object has an empty name and an ID but no description', function(done) {
			var b = new Profil("", "blabla", 52);
			var success = function () {
				assert.equal(b.isComplete(), false, "The Profil should not be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});
	});

	describe('#addCall', function() {
		it('should call the right request', function(done) {
			var c = new Profil("toto", "blabla", 52);
			var pv = new Call("mavaleur",12);
			var spy = sinon.spy(pv, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Profil.getTableName(), c.getId().toString(), Call.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var calls = c.calls();

                assert.deepEqual(calls, [], "The call is not an empty array: "+JSON.stringify(calls));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the calls");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(Profil.getTableName(), c.getId().toString(), Call.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the addCall is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the call in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addCall(pv.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadCalls(success, fail);
		});
	});

	describe('#removeCall', function() {
		it('should call the right request', function(done) {
			var c = new Profil("toto", "blabla", 52);
			var pv = new Call("mavaleur",12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"name": "mavaleur",
						"id": 12,
						"complete": false
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Profil.getTableName(), c.getId().toString(), Call.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var calls = c.calls();

                assert.deepEqual(calls, [pv], "The call array is not an array fill only with PV: "+JSON.stringify(calls));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the calls");

                var spy = sinon.spy(pv, "desynchronize");
                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(Profil.getTableName(), c.getId().toString(), Call.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the removeCall is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the call in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeCall(pv.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadCalls(success, fail);
		});

	});
});