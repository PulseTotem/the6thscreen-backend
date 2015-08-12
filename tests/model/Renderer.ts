/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/Renderer.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('Renderer', function() {
	describe('#constructor', function () {
		it('should store the name', function () {
			var name = "machin";
			var c = new Renderer(name, "");
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function () {
			var desc = "machin";
			var c = new Renderer("", desc);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new Renderer("", "", id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function () {
			var c = new Renderer("test", "ba", 34, true);
			assert.equal(c.isComplete(), true, "The complete value is not stored.");
		});

		it('should assign a default false complete value', function () {
			var c = new Renderer("test", "ba", 34);
			assert.equal(c.isComplete(), false, "The complete value is not stored.");
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

			var callRetrieve = Renderer.fromJSONObject(json);
			var callExpected = new Renderer("toto", "blabla", 42, true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve renderer (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});

		it('should create the right object even if it is partial', function () {
			var json = {
				"id": 42,
				"name": "",
				"description": null,
				"complete": false
			};

			var callRetrieve = Renderer.fromJSONObject(json);
			var callExpected = new Renderer("", null, 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve renderer (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new Renderer("toto", "blabla", 52, true);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"id": 52,
				"complete": true,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#checkCompleteness', function() {
		it('should consider the object as complete if it has an ID, a name and a complete infotype', function(done) {
			var cpt = new Renderer("test","", 52);

			var response : any = {
					"id":12,
					"name": "type",
					"complete": true
				};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Renderer.getTableName(), cpt.getId().toString(), InfoType.getTableName()))
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

		it('should not consider the object as complete if it has an ID, a name and an infotype which is not complete itself', function(done) {
			var cpt = new Renderer("test","", 52);

			var response : any = {
					"id":12,
					"name": "type",
					"complete": false
				};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Renderer.getTableName(), cpt.getId().toString(), InfoType.getTableName()))
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

			var cpt = new Renderer("test","");

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

			var cpt = new Renderer("","", 52);

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

			var cpt = new Renderer(null,"", 52);

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

			var cpt = new Renderer();

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

	describe('#linkInfoType', function () {
		it('should call the right request', function (done) {
			var c = new Renderer("toto", "machin", 52);
			var s = new InfoType("toto", 42);

			var response1:any = [];

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Renderer.getTableName(), c.getId().toString(), InfoType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var infoType = c.infoType();
                assert.equal(infoType, null, "The infoType is not a null value: " + JSON.stringify(infoType));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the infoType");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(Renderer.getTableName(), c.getId().toString(), InfoType.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the linkInfoType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the infoType in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkInfoType(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadInfoType(success, fail);
		});
	});

	describe('#unlinkInfoType', function () {
		it('should call the right request', function (done) {
			var c = new Renderer("toto", "machin", 52);
			var s = new InfoType("toto", 42);

			var response1:any = s.toJSONObject();

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Renderer.getTableName(), c.getId().toString(), InfoType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var infoType = c.infoType();
                assert.deepEqual(infoType, s, "The infoType is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the infoType");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(Renderer.getTableName(), c.getId().toString(), InfoType.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));


                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkInfoType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkInfoType(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadInfoType(success, fail);
		});

	});

});