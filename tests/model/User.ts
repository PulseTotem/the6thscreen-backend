/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />

/// <reference path="../../scripts/model/User.ts" />

var assert = require("assert");
var nock : any = require("nock");

describe('User', function() {
	describe('#constructor', function () {
		it('should store the username', function () {
			var username = "machin";
			var c = new User(username);
			assert.equal(c.username(), username, "The username is not stored correctly.");
		});

		it('should store the email', function () {
			var email = "machin@toto.fr";
			var c = new User("", email);
			assert.equal(c.email(), email, "The email is not stored correctly.");
		});

		it('should store the cmsId', function () {
			var cmsId = "cmsId42";
			var c = new User("", "", cmsId);
			assert.equal(c.cmsId(), cmsId, "The cmsId is not stored correctly.");
		});

		it('should store the cmsAuthkey', function () {
			var cmsAuthkey = "authkey";
			var c = new User("", "", "", cmsAuthkey);
			assert.equal(c.cmsAuthkey(), cmsAuthkey, "The cmsAuthkey is not stored correctly.");
		});

		it('should store the lastIP', function () {
			var lastIP = "lastIP";
			var c = new User("", "", "", "", lastIP);
			assert.equal(c.lastIp(), lastIP, "The lastIP is not stored correctly.");
		});

		it('should store the isAdmin', function () {
			var isAdmin = true;
			var c = new User("", "", "", "", "", isAdmin);
			assert.equal(c.isAdmin(), isAdmin, "The isAdmin is not stored correctly.");
		});

		it('should store the lastConnection', function () {
			var lastConnection = new Date();
			var c = new User("", "", "", "", "", false, lastConnection);
			assert.equal(c.lastConnection(), lastConnection, "The lastConnection is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new User("", "", "", "", "", false, null, 52);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function () {
			var c = new User("test", "bla", "", "", "", false, null, 52, true);
			assert.equal(c.isComplete(), true, "The complete value is not stored.");
		});

		it('should assign a default false value to complete', function () {
			var c = new User();
			assert.equal(c.isComplete(), false, "The complete value is not stored.");
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var date = new Date();
			var json = {
				"id": 42,
				"username": "toto",
				"email": "blabla",
				"cmsId": "theid",
				"cmsAuthkey": "authkey",
				"lastIp": "localhost",
				"isAdmin": true,
				"lastConnection": date,
				"complete": true
			};

			var userRetrieve = User.fromJSONObject(json);
			var userExpected = new User("toto", "blabla", "theid", "authkey", "localhost", true, date, 42, true);

			assert.deepEqual(userRetrieve, userExpected, "The retrieve user (" + userRetrieve + ") does not match with the expected one (" + userExpected + ")");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var date = new Date();
			var c = new User("toto", "bla", "theid", "authkey", "local", false, date, 52);
			var expected = {
				"id": 52,
				"username": "toto",
				"email": "bla",
				"cmsId": "theid",
				"cmsAuthkey": "authkey",
				"lastIp": "local",
				"isAdmin": false,
				"lastConnection": date,
				"complete": false,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#checkCompleteness()', function() {
		it('should return false if the object is empty', function(done) {
			var b =  new User();
			var success = function () {
				assert.equal(b.isComplete(), false, "The behaviour should not be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return true if the object has a name, an email and an ID', function(done) {
			var b = new User("toto", "bla", "", "","", false, null, 52);
			var success = function () {
				assert.equal(b.isComplete(), true, "The behaviour should be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return false if the object has an empty name, an email and an ID', function(done) {
			var b = new User("", "bla", "", "","", false, null, 52);
			var success = function () {
				assert.equal(b.isComplete(), false, "The behaviour should be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return false if the object has a null name, an email and an ID', function(done) {
			var b = new User(null, "bla", "", "","", false, null, 52);
			var success = function () {
				assert.equal(b.isComplete(), false, "The behaviour should be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return false if the object has a name, an empty email and an ID', function(done) {
			var b = new User("test", "", "", "","", false, null, 52);
			var success = function () {
				assert.equal(b.isComplete(), false, "The behaviour should be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return false if the object has a name, a null email and an ID', function(done) {
			var b = new User("test", null, "", "","", false, null, 52);
			var success = function () {
				assert.equal(b.isComplete(), false, "The behaviour should be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return false if the object has a name, an email and no ID', function(done) {
			var b = new User("test", "test");
			var success = function () {
				assert.equal(b.isComplete(), false, "The behaviour should be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});
	});

    describe('#addOAuthKey', function() {
        it('should call the right request', function(done) {
            var c = new User("toto", "bla", "", "","", false, null, 52);
            var pv = new OAuthKey("mavaleur", "bidule", "maValeur", 12);

            var response1 : any = [];

            var restClientMock1 = nock(BackendConfig.getDBBaseURL())
                .get(BackendConfig.associationEndpoint(User.getTableName(), c.getId().toString(), OAuthKey.getTableName()))
                .reply(200, JSON.stringify(response1));

            var success = function() {
                var oauthkeys = c.oauthkeys();

                assert.deepEqual(oauthkeys, [], "The oauthkeys is not an empty array: "+JSON.stringify(oauthkeys));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the oauthkeys");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
                    .put(BackendConfig.associatedObjectEndpoint(User.getTableName(), c.getId().toString(), OAuthKey.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the OAuthKey in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addOAuthKey(pv.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadOAuthKeys(success, fail);
        });

    });

    describe('#removeOAuthKey', function() {
        it('should call the right request', function(done) {
            var c = new User("toto", "bla", "", "","", false, null, 52);
            var pv = new OAuthKey("mavaleur", "blup", "ouepKey", 12);

            var response1 : any = [
                    {
                        "name": "mavaleur",
                        "description": "blup",
                        "value": "ouepKey",
                        "complete": false,
                        "id": 12
                    }
                ];

            var restClientMock1 = nock(BackendConfig.getDBBaseURL())
                .get(BackendConfig.associationEndpoint(User.getTableName(), c.getId().toString(), OAuthKey.getTableName()))
                .reply(200, JSON.stringify(response1));

            var success = function() {
                var oauthkeys = c.oauthkeys();

                assert.deepEqual(oauthkeys, [pv], "The oauthkeys array is not an array fill only with PV: "+JSON.stringify(oauthkeys));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the oauthkeys");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
                    .delete(BackendConfig.associatedObjectEndpoint(User.getTableName(), c.getId().toString(), OAuthKey.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the removeOAuthKey is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the OAuthKey in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeOAuthKey(pv.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadOAuthKeys(success, fail);
        });
    });

	describe('#addTeam', function() {
		it('should call the right request', function(done) {
			var c = new User("toto", "bla", "", "","", false, null, 52);
			var pv = new Team("mavaleur", 12);

			var response1 : any = [];

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(User.getTableName(), c.getId().toString(), Team.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var teams = c.teams();

				assert.deepEqual(teams, [], "The teams is not an empty array: "+JSON.stringify(teams));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the teams");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
					.put(BackendConfig.associatedObjectEndpoint(User.getTableName(), c.getId().toString(), Team.getTableName(), pv.getId().toString()))
					.reply(200, JSON.stringify(emptyResponse));

				var success2 = function() {
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the team in database.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.addTeam(pv.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadTeams(success, fail);
		});

	});

	describe('#removeTeam', function() {
		it('should call the right request', function(done) {
			var c = new User("toto", "bla", "", "","", false, null, 52);
			var pv = new Team("mavaleur", 12);

			var response1 : any = [
				{
					"name": "mavaleur",
					"complete": false,
					"id": 12
				}
			];

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(User.getTableName(), c.getId().toString(), Team.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var teams = c.teams();

				assert.deepEqual(teams, [pv], "The team array is not an array fill only with PV: "+JSON.stringify(teams));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the teams");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
					.delete(BackendConfig.associatedObjectEndpoint(User.getTableName(), c.getId().toString(), Team.getTableName(), pv.getId().toString()))
					.reply(200, JSON.stringify(emptyResponse));

				var success2 = function() {
					//assert.ok(retour, "The return of the removeOAuthKey is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the team in database.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.removeTeam(pv.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadTeams(success, fail);
		});
	});

	describe('#linkDefaultTeam', function() {
		it('should call the right request', function(done) {
			var c = new User("toto", "bla", "", "","", false, null, 52);
			var pv = new Team("mavaleur", 12);
			var linkName = "DefaultTeams";

			var response1 : any = [];

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(User.getTableName(), c.getId().toString(), linkName))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var defaultTeam = c.defaultTeam();

				assert.deepEqual(defaultTeam, null, "The default team is not null: "+JSON.stringify(defaultTeam));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the defaultTeam");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
					.put(BackendConfig.associatedObjectEndpoint(User.getTableName(), c.getId().toString(), linkName, pv.getId().toString()))
					.reply(200, JSON.stringify(emptyResponse));

				var success2 = function() {
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the default in database.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.linkDefaultTeam(pv.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadDefaultTeam(success, fail);
		});

	});

	describe('#unlinkDefaultTeam', function() {
		it('should call the right request', function(done) {
			var c = new User("toto", "bla", "", "","", false, null, 52);
			var pv = new Team("mavaleur", 12);
			var linkName = "DefaultTeams";

			var response1 : any =
				{
					"name": "mavaleur",
					"complete": false,
					"id": 12
				};

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(User.getTableName(), c.getId().toString(), linkName))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var defaultTeam = c.defaultTeam();

				assert.deepEqual(defaultTeam, pv, "The default team is not  PV: "+JSON.stringify(defaultTeam));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the default team");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
					.delete(BackendConfig.associatedObjectEndpoint(User.getTableName(), c.getId().toString(), linkName, pv.getId().toString()))
					.reply(200, JSON.stringify(emptyResponse));

				var success2 = function() {
					//assert.ok(retour, "The return of the removeOAuthKey is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the default team in database.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.unlinkDefaultTeam(pv.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadDefaultTeam(success, fail);
		});
	});
});