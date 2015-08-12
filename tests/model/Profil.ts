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

			var zoneContentRetrieve = Profil.fromJSONObject(json);
			var zoneContentExpected = new Profil("toto", "blabla", 42, true);

			assert.deepEqual(zoneContentRetrieve, zoneContentExpected, "The retrieve profil (" + zoneContentRetrieve + ") does not match with the expected one (" + zoneContentExpected + ")");
		});

		it('should create the right object even if it is partial', function () {
			var json = {
				"id": 42,
				"name": null,
				"description": "blabla",
				"complete": false
			};

			var zoneContentRetrieve = Profil.fromJSONObject(json);
			var zoneContentExpected = new Profil(null, "blabla", 42);

			assert.deepEqual(zoneContentRetrieve, zoneContentExpected, "The retrieve profil (" + zoneContentRetrieve + ") does not match with the expected one (" + zoneContentExpected + ")");
		});

	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new Profil("toto", "blabla", 52, true);
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

		it('should return true if the object has a name and an ID but no description and number of ZoneContent equals to number of SDI\'s zones', function(done) {
			var b = new Profil("toto", null, 52);

			var responseSDI : any = {
					"id": 42,
					"name": null,
					"description": "blabla",
					"allowedHost": "",
					"complete": true
				};

			var restClientMockSDI = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Profil.getTableName(), b.getId().toString(), SDI.getTableName()))
				.reply(200, JSON.stringify(responseSDI));

			var responseZoneContents : any = [{
					"id": 32,
					"name": null,
					"description": "blabla",
					"complete": true
				}];

			var restClientMockZoneContents = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Profil.getTableName(), b.getId().toString(), ZoneContent.getTableName()))
				.reply(200, JSON.stringify(responseZoneContents));

			var responseZones : any = [{
					"id": 22,
					"name": null,
					"description": "blabla",
					"complete": true
				}];

			var restClientMockZones = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), "42", Zone.getTableName()))
				.reply(200, JSON.stringify(responseZones));

			var success = function () {
				assert.ok(restClientMockSDI.isDone(), "The mock request has not been done to retrieve the SDI in database.");
				assert.ok(restClientMockZoneContents.isDone(), "The mock request has not been done to retrieve zoneContents in database.");
				assert.ok(restClientMockZones.isDone(), "The mock request has not been done to retrieve zones in database.");
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

	describe('#addZoneContent', function() {
		it('should zoneContent the right request', function(done) {
			var c = new Profil("toto", "blabla", 52);
			var pv = new ZoneContent("mavaleur", "", 12);
			var spy = sinon.spy(pv, "desynchronize");

			var response1 : any = [];

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Profil.getTableName(), c.getId().toString(), ZoneContent.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var zoneContents = c.zoneContents();

                assert.deepEqual(zoneContents, [], "The zoneContent is not an empty array: "+JSON.stringify(zoneContents));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the zoneContents");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(Profil.getTableName(), c.getId().toString(), ZoneContent.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the addZoneContent is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the zoneContent in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addZoneContent(pv.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadZoneContents(success, fail);
		});
	});

	describe('#removeZoneContent', function() {
		it('should zoneContent the right request', function(done) {
			var c = new Profil("toto", "blabla", 52);
			var pv = new ZoneContent("mavaleur", "", 12);

			var response1 : any = [
					{
						"name": "mavaleur",
						"id": 12,
						"complete": false
					}
				];

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Profil.getTableName(), c.getId().toString(), ZoneContent.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var zoneContents = c.zoneContents();

                assert.deepEqual(zoneContents, [pv], "The zoneContent array is not an array fill only with PV: "+JSON.stringify(zoneContents));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the zoneContents");

                var spy = sinon.spy(pv, "desynchronize");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(Profil.getTableName(), c.getId().toString(), ZoneContent.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the removeZoneContent is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the zoneContent in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeZoneContent(pv.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadZoneContents(success, fail);
		});

	});
});