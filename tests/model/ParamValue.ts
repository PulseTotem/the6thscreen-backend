/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/ParamValue.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('ParamValue', function() {
	describe('#constructor', function () {
		it('should store the value', function () {
			var value = "false";
			var c = new ParamValue(value);
			assert.equal(c.value(), value, "The value is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new ParamValue("", 52);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function () {
			var c = new ParamValue("", 52, true);
			assert.equal(c.isComplete(), true, "The complete value is not stored.");
		});

		it('should assign a false complete value by default', function () {
			var c = new ParamValue();
			assert.equal(c.isComplete(), false, "The complete value is not stored.");
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 42,
				"value": "toto",
				"complete": true
			};

			var callRetrieve = ParamValue.fromJSONObject(json);
			var callExpected = new ParamValue("toto", 42, true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});

		it('should create the right object even if it is partial', function () {
			var json = {
				"id": 42,
				"value": null,
				"complete": false
			};

			var callRetrieve = ParamValue.fromJSONObject(json);
			var callExpected = new ParamValue(null, 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});
	});

	describe('#checkCompleteness', function() {
		it('should consider the object as complete if it has an ID, a name and a complete type', function(done) {
			var cpt = new ParamValue("test", 52);

			var response : any = {
					"id":12,
					"name": "type",
					"complete": true
				};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamValue.getTableName(), cpt.getId().toString(), ParamType.getTableName()))
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
			var cpt = new ParamValue("test", 52);

			var response : any = {
					"id":12,
					"name": "type",
					"complete": false
				};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamValue.getTableName(), cpt.getId().toString(), ParamType.getTableName()))
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

			var cpt = new ParamValue("test");

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

			var cpt = new ParamValue("", 52);

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

			var cpt = new ParamValue(null, 52);

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

			var cpt = new ParamValue();

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

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new ParamValue("toto", 52);
			var expected = {
				"value": "toto",
				"id": 52,
				"complete": false,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#linkParamType', function() {
		it('should call the right request', function(done) {
			var c = new ParamValue("toto", 52);
			var p = new ParamType("toto", "machin", 42);

			var response1 : any = [];

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamValue.getTableName(), c.getId().toString(), ParamType.getTableName()))
				.reply(200, JSON.stringify(response1));


            var success = function() {
                var paramType = c.paramType();
                assert.equal(paramType, null, "The paramType is not a null value: "+JSON.stringify(paramType));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramType");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(ParamValue.getTableName(), c.getId().toString(), ParamType.getTableName(), p.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));


                var success2 = function() {
                    //assert.ok(retour, "The return of the linkParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramValue in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkParamType(p.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadParamType(success, fail);
		});
	});

	describe('#unlinkParamType', function() {
		it('should call the right request', function(done) {
			var c = new ParamValue("toto", 52);
			var p = new ParamType("toto", "machin", 42);

			var response1 : any = p.toJSONObject();

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamValue.getTableName(), c.getId().toString(), ParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var paramType = c.paramType();
                assert.deepEqual(paramType, p, "The paramType is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramType");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(ParamValue.getTableName(), c.getId().toString(), ParamType.getTableName(), p.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));


                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramValue in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkParamType(p.getId(), success2, fail2);
            };

            var fail = function(err) {
                done();
            };

			c.loadParamType(success, fail);
		});
	});
});
