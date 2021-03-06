/**
 * @author Simon Urli <simon@pulsetotem.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/Provider.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('Provider', function() {
	describe('#constructor', function () {
		it('should store the name', function () {
			var name = "machin";
			var c = new Provider(name, "");
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function () {
			var desc = "machin";
			var c = new Provider("", desc);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the logo', function () {
			var logo = "machin";
			var c = new Provider("", "", logo);
			assert.equal(c.logo(), logo, "The logo is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new Provider("", "", "", id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function () {
			var c = new Provider("test", "ba", "", 34, true);
			assert.equal(c.isComplete(), true, "The complete value is not stored.");
		});

		it('should assign a default false complete value', function () {
			var c = new Provider("test", "ba", "", 34);
			assert.equal(c.isComplete(), false, "The complete value is not stored.");
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "blabla",
				"logo": "bidule",
				"complete": true
			};

			var callRetrieve = Provider.fromJSONObject(json);
			var callExpected = new Provider("toto", "blabla", "bidule", 42, true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve Provider (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});

		it('should create the right object even if it is partial', function () {
			var json = {
				"id": 42,
				"name": "",
				"description": null,
				"logo": "toto",
				"complete": false
			};

			var callRetrieve = Provider.fromJSONObject(json);
			var callExpected = new Provider("", null, "toto", 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve Provider (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new Provider("toto", "blabla", "titi", 52, true);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"logo": "titi",
				"id": 52,
				"complete": true,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#checkCompleteness()', function() {
		it('should return false if the object is empty', function(done) {
			var b =  new Provider();
			var success = function () {
				assert.equal(b.isComplete(), false, "The provider should not be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return true if the object has a name, a description and an ID', function(done) {
			var b = new Provider("toto", "bla", "", 52);
			var success = function () {
				assert.equal(b.isComplete(), true, "The provider should be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return false if the object has an empty name, a description and an ID', function(done) {
			var b = new Provider("", "bla", "toto", 52);
			var success = function () {
				assert.equal(b.isComplete(), false, "The provider should be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return false if the object has a null name, a description and an ID', function(done) {
			var b = new Provider(null, "bla", "toto", 52);
			var success = function () {
				assert.equal(b.isComplete(), false, "The provider should be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return true if the object has a name, an empty description and an ID', function(done) {
			var b = new Provider("test", "", "toto", 52);
			var success = function () {
				assert.equal(b.isComplete(), true, "The provider should be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return true if the object has a name, a null description and an ID', function(done) {
			var b = new Provider("test", null, "toto", 52);
			var success = function () {
				assert.equal(b.isComplete(), true, "The provider should be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return false if the object has a name, a description and no ID', function(done) {
			var b = new Provider("test", "test", "toto");
			var success = function () {
				assert.equal(b.isComplete(), false, "The provider should not be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});
	});

	describe('#addSource', function () {
		it('should call the right request', function (done) {
			var c = new Provider("toto", "machin", "toto", 52);
			var s = new Source("toto", "titi", "method", 45, true, 123);

			var response1:any = [];

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(Provider.getTableName(), c.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var sources = c.sources();
                assert.deepEqual(sources, [], "The sources is not an empty array: " + JSON.stringify(sources));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the sources");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
                    .put(BackendConfig.associatedObjectEndpoint(Provider.getTableName(), c.getId().toString(), Source.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the linkInfoType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the sources in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addSource(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadSources(success, fail);
		});
	});

	describe('#removeSource', function () {
		it('should call the right request', function (done) {
			var c = new Provider("toto", "machin", "toto", 52);
			var s = new Source("toto", "titi", "method", 45, true, 123);

			var response1:any = [
				s.toJSONObject()
			];

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(Provider.getTableName(), c.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var sources = c.sources();
                assert.deepEqual(sources, [s], "The array of sources does not correspond to an array containing only s : "+JSON.stringify(sources));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the sources");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
                    .delete(BackendConfig.associatedObjectEndpoint(Provider.getTableName(), c.getId().toString(), Source.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));


                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkInfoType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeSource(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadSources(success, fail);
		});

	});

});