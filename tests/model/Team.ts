/**
 * @author Simon Urli <simon@the6thscreen.fr>
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/Team.ts" />
/// <reference path="../../scripts/model/SDI.ts" />
/// <reference path="../../scripts/model/User.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('Team', function() {
	describe('#constructor', function () {
		it('should store the name', function () {
			var name = "machin";
			var c = new Team(name);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the cmsId', function () {
			var cmsId = "cmsId42";
			var c = new Team("", cmsId);
			assert.equal(c.cmsId(), cmsId, "The cmsId is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new Team("afd", "", id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function () {
			var c = new Team("afd", "", 34, true);
			assert.equal(c.isComplete(), true, "The complete value is not stored.");
		});

		it('should assign a default complete value', function () {
			var c = new Team();
			assert.equal(c.isComplete(), false, "The complete value is not stored.");
		});
	});

	describe('#checkCompleteness()', function() {
		it('should return false if the object is empty', function(done) {
			var b =  new Team();
			var success = function () {
				assert.equal(b.isComplete(), false, "The Team should not be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return true if the object has a name and an ID', function(done) {
			var b = new Team("tret", "", 34);
			var success = function () {
				assert.equal(b.isComplete(), true, "The Team should be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return false if the object has an empty name and an ID', function(done) {
			var b = new Team("", "", 34);
			var success = function () {
				assert.equal(b.isComplete(), false, "The Team should not be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"cmsId": "cmsId42",
				"complete": true
			};

			var teamRetrieve = Team.fromJSONObject(json);
			var teamExpected = new Team("toto", "cmsId42", 42, true);

			assert.deepEqual(teamRetrieve, teamExpected, "The retrieve Team (" + teamRetrieve + ") does not match with the expected one (" + teamExpected + ")");
		});

		it('should create the right object even if it is partial', function () {
			var json = {
				"id": 42,
				"name": null,
				"cmsId": "cmsId42",
				"complete": false
			};

			var teamRetrieve = Team.fromJSONObject(json);
			var teamExpected = new Team(null, "cmsId42", 42);

			assert.deepEqual(teamRetrieve, teamExpected, "The retrieve Team (" + teamRetrieve + ") does not match with the expected one (" + teamExpected + ")");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new Team("toto", "cmsId52", 52, true);
			var expected = {
				"name": "toto",
				"cmsId": "cmsId52",
				"id": 52,
				"complete": true,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#addUser', function() {
		it('should call the right request', function(done) {
			var c = new Team("toto", "cmsId52", 52);
			var pv = new User("mavaleur", "", "", "","", false, null, 12);

			var response1 : any = [];

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(Team.getTableName(), c.getId().toString(), User.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var users = c.users();

                assert.deepEqual(users, [], "The user is not an empty array: "+JSON.stringify(users));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the users");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
                    .put(BackendConfig.associatedObjectEndpoint(Team.getTableName(), c.getId().toString(), User.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));


                var success2 = function() {
                    //assert.ok(retour, "The return of the addUser is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the user in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addUser(pv.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadUsers(success, fail);
		});
	});

	describe('#removeUser', function() {
		it('should call the right request', function(done) {
			var c = new Team("toto", "cmsId52", 52);
			var pv = new User("mavaleur", "", "", "","", false, null, 12);

			var response1 : any = [
					{
						"username": "mavaleur",
						"id": 12,
						"complete": false
					}
				];

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(Team.getTableName(), c.getId().toString(), User.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var users = c.users();

                assert.deepEqual(users, [pv], "The user array is not an array fill only with PV: "+JSON.stringify(users));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the users");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
                    .delete(BackendConfig.associatedObjectEndpoint(Team.getTableName(), c.getId().toString(), User.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));


                var success2 = function() {
                    //assert.ok(retour, "The return of the removeUser is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the user in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeUser(pv.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadUsers(success, fail);
		});

	});

	describe('#addSDI', function() {
		it('should call the right request', function(done) {
			var t = new Team("blurp", "cmsId123", 123);
			var c = new SDI("toto", "blabla", "toto", 52);

			var response1 : any = [];

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(Team.getTableName(), t.getId().toString(), SDI.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var sdis = t.sdis();

                assert.deepEqual(sdis, [], "The zone is not an empty array: "+JSON.stringify(sdis));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the zones");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
                    .put(BackendConfig.associatedObjectEndpoint(Team.getTableName(), t.getId().toString(), SDI.getTableName(), c.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the addZone is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the zone in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                t.addSDI(c.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            t.loadSDIS(success, fail);
		});
	});

	describe('#removeSDI', function() {
		it('should call the right request', function(done) {
			var t = new Team("blurp", "cmsId123", 123);
			var c = new SDI("toto", "blabla", "toto", 52);

			var response1 : any = [
					{
						"id":52,
						"name": "toto",
						"description": "blabla",
						"allowedHost": "toto",
						"complete": false
					}
				];

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(Team.getTableName(), t.getId().toString(), SDI.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var sdis = t.sdis();

                assert.deepEqual(sdis, [c], "The sdis array is not an array fill only with c: "+JSON.stringify(c));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the zones");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
                    .delete(BackendConfig.associatedObjectEndpoint(Team.getTableName(), t.getId().toString(), SDI.getTableName(), c.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the removeZone is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the zone in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                t.removeSDI(c.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            t.loadSDIS(success, fail);
		});

	});

	describe('#linkOwner', function () {
		it('should call the right request', function (done) {
			var c = new Team("toto", "cmsId52", 52);
			var pv = new User("mavaleur", "", "", "","", false, null, 12);
			var linkName = "Owners";

			var response1:any = [];

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(Team.getTableName(), c.getId().toString(), linkName))
				.reply(200, JSON.stringify(response1));

			var success = function () {
				var owner = c.owner();
				assert.equal(owner, null, "The owner is not a null value: " + JSON.stringify(owner));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the service");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
					.put(BackendConfig.associatedObjectEndpoint(Team.getTableName(), c.getId().toString(), linkName, pv.getId().toString()))
					.reply(200, JSON.stringify(emptyResponse));

				var success2 = function () {
					//assert.ok(retour, "The return of the setInfoType is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the service in database.");
					done();
				};

				var fail2 = function (err) {
					done(err);
				};

				c.linkOwner(pv.getId(), success2, fail2);
			};

			var fail = function (err) {
				done(err);
			};

			c.loadOwner(success, fail);
		});

	});

	describe('#unlinkOwner', function () {
		it('should call the right request', function (done) {
			var c = new Team("toto", "cmsId52", 52);
			var pv = new User("mavaleur", "", "", "","", false, null, 12);
			var linkName = "Owners";

			var response1:any = pv.toJSONObject();

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(Team.getTableName(), c.getId().toString(), linkName))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var owner = c.owner();
				assert.deepEqual(owner, pv, "The owner is not the expected value");
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the service");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
					.delete(BackendConfig.associatedObjectEndpoint(Team.getTableName(), c.getId().toString(), linkName, pv.getId().toString()))
					.reply(200, JSON.stringify(emptyResponse));


				var success2 = function() {
					//assert.ok(retour, "The return of the unsetInfoType is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.unlinkOwner(pv.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadOwner(success, fail);
		});
	});

	describe('#addOAuthKey', function() {
		it('should call the right request', function(done) {
			var t = new Team("blurp", "cmsId123", 123);
			var c = new OAuthKey("toto", "blabla", "toto", 52);

			var response1 : any = [];

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(Team.getTableName(), t.getId().toString(), OAuthKey.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var oauthkeys = t.oauthkeys();

				assert.deepEqual(oauthkeys, [], "The oauthkeys is not an empty array: "+JSON.stringify(oauthkeys));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the oauthkeys");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
					.put(BackendConfig.associatedObjectEndpoint(Team.getTableName(), t.getId().toString(), OAuthKey.getTableName(), c.getId().toString()))
					.reply(200, JSON.stringify(emptyResponse));

				var success2 = function() {
					//assert.ok(retour, "The return of the addZone is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the oauthkey in database.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				t.addOAuthKey(c.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			t.loadOAuthKeys(success, fail);
		});
	});

	describe('#removeOAuthKey', function() {
		it('should call the right request', function(done) {
			var t = new Team("blurp", "cmsId123", 123);
			var c = new OAuthKey("toto", "blabla", "toto", 52);

			var response1 : any = [
				{
					"id":52,
					"name": "toto",
					"description": "blabla",
					"value": "toto",
					"complete": false
				}
			];

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(Team.getTableName(), t.getId().toString(), OAuthKey.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var oauthkeys = t.oauthkeys();

				assert.deepEqual(oauthkeys, [c], "The oauthkeys array is not an array fill only with c: "+JSON.stringify(c));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the oauthkeys");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
					.delete(BackendConfig.associatedObjectEndpoint(Team.getTableName(), t.getId().toString(), OAuthKey.getTableName(), c.getId().toString()))
					.reply(200, JSON.stringify(emptyResponse));

				var success2 = function() {
					//assert.ok(retour, "The return of the removeZone is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the oauthkey in database.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				t.removeOAuthKey(c.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			t.loadOAuthKeys(success, fail);
		});

	});
});