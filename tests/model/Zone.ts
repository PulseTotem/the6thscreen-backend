///<reference path="../../scripts/core/DatabaseConnection.ts"/>
/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/Zone.ts" />
/// <reference path="../../scripts/core/DatabaseConnection.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('Zone', function() {
	describe('#constructor', function () {
		it('should store the name', function () {
			var name = "machin";
			var c = new Zone(name);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function () {
			var desc = "machin";
			var c = new Zone("", desc);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the width', function () {
			var width = 10;
			var c = new Zone("", "", width);
			assert.equal(c.width(), width, "The width is not stored correctly.");
		});

		it('should store the height', function () {
			var height = 20;
			var c = new Zone("", "", 10, height);
			assert.equal(c.height(), height, "The height is not stored correctly.");
		});

		it('should store the positionFromTop', function () {
			var positionFromTop = 30;
			var c = new Zone("", "", 10, 20, positionFromTop);
			assert.equal(c.positionFromTop(), positionFromTop, "The positionFromTop is not stored correctly.");
		});

		it('should store the positionFromLeft', function () {
			var positionFromLeft = 20;
			var c = new Zone("", "", 10, 20, 30, positionFromLeft);
			assert.equal(c.positionFromLeft(), positionFromLeft, "The positionFromLeft is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new Zone("bidule", "description", 10, 20, 30, 40, id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function () {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 34, true);
			assert.equal(c.isComplete(), true, "The complete value is not stored.");
		});

		it('should assign a default false value for complete attribute', function () {
			var c = new Zone();
			assert.equal(c.isComplete(), false, "The complete value is not stored.");
		});
	});

	describe('#checkCompleteness', function() {
		it('should consider the object as complete if it has an ID, a name and a complete behaviour', function(done) {
			var cpt = new Zone("bidule", "description", 10, 20, 30, 40, 43);

			var response : any = {
					"id":12,
					"name": "type",
					"complete": true
				};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), cpt.getId().toString(), Behaviour.getTableName()))
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

		it('should not consider the object as complete if it has an ID, a name and a behaviour which is not complete itself', function(done) {
			var cpt = new Zone("bidule", "description", 10, 20, 30, 40, 43);

			var response : any = {
					"id":12,
					"name": "type",
					"complete": false
				};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), cpt.getId().toString(), Behaviour.getTableName()))
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

			var cpt = new Zone("bidule", "description", 10, 20, 30, 40);

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

			var cpt = new Zone("", "description", 10, 20, 30, 40, 43);

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

			var cpt = new Zone(null, "description", 10, 20, 30, 40, 43);

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

			var cpt = new Zone();

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

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "blabla",
				"width": 10,
				"height": 20,
				"positionFromTop": 30,
				"positionFromLeft": 40,
				"complete": true
			};

			var callRetrieve = Zone.fromJSONObject(json);
			var callExpected = new Zone("toto", "blabla", 10, 20, 30, 40, 42, true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve zone (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});

		it('should create the right object even if it is partial', function () {
			var json = {
				"id": 42,
				"name": "",
				"description": "blabla",
				"width": 10,
				"height": 0,
				"positionFromTop": 0,
				"positionFromLeft": 40,
				"complete": false
			};

			var callRetrieve = Zone.fromJSONObject(json);
			var callExpected = new Zone("", "blabla", 10, 0, 0, 40, 42, false);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve zone (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new Zone("toto", "blabla", 10, 20, 30, 40, 42, true);
			var expected = {
				"id": 42,
				"name": "toto",
				"description": "blabla",
				"width": 10,
				"height": 20,
				"positionFromTop": 30,
				"positionFromLeft": 40,
				"complete": true,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#linkBehaviour', function () {
		it('should call the right request', function (done) {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var s = new Behaviour("toto", "machin", 42);

			var response1:any = [];

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), Behaviour.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var behaviour = c.behaviour();
                assert.equal(behaviour, null, "The behaviour is not a null value: " + JSON.stringify(behaviour));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the behaviour");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(Zone.getTableName(), c.getId().toString(), Behaviour.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));


                var success2 = function() {
                    //assert.ok(retour, "The return of the linkBehaviour is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the behaviour in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkBehaviour(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadBehaviour(success, fail);
		});
	});

	describe('#unlinkBehaviour', function () {
		it('should call the right request', function (done) {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var s = new Behaviour("toto", "machin", 42);

			var response1:any = s.toJSONObject();

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), Behaviour.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var behaviour = c.behaviour();
                assert.deepEqual(behaviour, s, "The behaviour is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the behaviour");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(Zone.getTableName(), c.getId().toString(), Behaviour.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkBehaviour is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkBehaviour(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadBehaviour(success, fail);
		});
	});

	describe('#addCallType', function() {
		it('should call the right request', function(done) {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var ct = new CallType("mavaleur", "madescription", 12);

			var response1 : any = [];

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), CallType.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var callTypes = c.callTypes();

				assert.deepEqual(callTypes, [], "The callTypes is not an empty array: "+JSON.stringify(callTypes));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the callTypes");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.put(DatabaseConnection.associatedObjectEndpoint(Zone.getTableName(), c.getId().toString(), CallType.getTableName(), ct.getId().toString()))
					.reply(200, JSON.stringify(emptyResponse));


				var success2 = function() {
					//assert.ok(retour, "The return of the addRole is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the CallType in database.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.addCallType(ct.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadCallTypes(success, fail);
		});

	});

	describe('#removeCallType', function() {
		it('should call the right request', function(done) {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var ct = new CallType("mavaleur", "madescription", 12);

			var response1 : any = [
					{
						"name": "mavaleur",
						"description": "madescription",
						"id": 12,
						"complete": false
					}
				];

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), CallType.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var callTypes = c.callTypes();

				assert.deepEqual(callTypes, [ct], "The callType array is not an array fill only with ct: "+JSON.stringify(callTypes));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the callTypes");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.delete(DatabaseConnection.associatedObjectEndpoint(Zone.getTableName(), c.getId().toString(), CallType.getTableName(), ct.getId().toString()))
					.reply(200, JSON.stringify(emptyResponse));

				var success2 = function() {
					//assert.ok(retour, "The return of the removeRole is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the CallType in database.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.removeCallType(ct.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadCallTypes(success, fail);
		});

	});

	describe('#addZoneContent', function() {
		it('should call the right request', function(done) {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var zc = new ZoneContent("mavaleur", "madescription", 12);

			var response1 : any = [];

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), ZoneContent.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var zoneContents = c.zoneContents();

				assert.deepEqual(zoneContents, [], "The zoneContents is not an empty array: "+JSON.stringify(zoneContents));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the zoneContents");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.put(DatabaseConnection.associatedObjectEndpoint(Zone.getTableName(), c.getId().toString(), ZoneContent.getTableName(), zc.getId().toString()))
					.reply(200, JSON.stringify(emptyResponse));


				var success2 = function() {
					//assert.ok(retour, "The return of the addRole is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the ZoneContent in database.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.addZoneContent(zc.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadZoneContents(success, fail);
		});

	});

	describe('#removeZoneContent', function() {
		it('should call the right request', function(done) {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var zc = new ZoneContent("mavaleur", "madescription", 12);

			var response1 : any = [
					{
						"name": "mavaleur",
						"description": "madescription",
						"id": 12,
						"complete": false
					}
				];

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), ZoneContent.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var zoneContents = c.zoneContents();

				assert.deepEqual(zoneContents, [zc], "The zoneContent array is not an array fill only with zc: "+JSON.stringify(zoneContents));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the zoneContents");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.delete(DatabaseConnection.associatedObjectEndpoint(Zone.getTableName(), c.getId().toString(), ZoneContent.getTableName(), zc.getId().toString()))
					.reply(200, JSON.stringify(emptyResponse));

				var success2 = function() {
					//assert.ok(retour, "The return of the removeRole is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the ZoneContent in database.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.removeZoneContent(zc.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadZoneContents(success, fail);
		});

	});

	describe('#linkTheme', function () {
		it('should call the right request', function (done) {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var s = new ThemeZone("toto", "truc", true, "http://example.com/background.png", "http://example.com/backgroundVideo.png", "black", "arial","black", "89%", "14px", 2, 52);

			var response1:any = [];

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), ThemeZone.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function () {
				var themeZone = c.theme();
				assert.equal(themeZone, null, "The themeZone is not a null value: " + JSON.stringify(themeZone));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the service");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.put(DatabaseConnection.associatedObjectEndpoint(Zone.getTableName(), c.getId().toString(), ThemeZone.getTableName(), s.getId().toString()))
					.reply(200, JSON.stringify(emptyResponse));

				var success2 = function () {
					//assert.ok(retour, "The return of the setInfoType is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the service in database.");
					done();
				};

				var fail2 = function (err) {
					done(err);
				};

				c.linkTheme(s.getId(), success2, fail2);
			};

			var fail = function (err) {
				done(err);
			};

			c.loadTheme(success, fail);
		});

	});

	describe('#unlinkTheme', function () {
		it('should call the right request', function (done) {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var s = new ThemeZone("toto", "truc", true, "http://example.com/background.png", "http://example.com/backgroundVideo.png", "black", "arial","black", "89%", "14px", 2, 52);

			var response1:any = s.toJSONObject();

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), ThemeZone.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var themeZone = c.theme();
				assert.deepEqual(themeZone, s, "The themeZone is not the expected value");
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the service");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.delete(DatabaseConnection.associatedObjectEndpoint(Zone.getTableName(), c.getId().toString(), ThemeZone.getTableName(), s.getId().toString()))
					.reply(200, JSON.stringify(emptyResponse));


				var success2 = function() {
					//assert.ok(retour, "The return of the unsetInfoType is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.unlinkTheme(s.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadTheme(success, fail);
		});
	});

});