/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/SDI.ts" />
/// <reference path="../../scripts/model/User.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('SDI', function() {
	describe('#constructor', function () {
		it('should store the name', function () {
			var name = "machin";
			var c = new SDI(name);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function () {
			var desc = "machin";
			var c = new SDI("", desc);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the allowedHost', function () {
			var allowedHost = "machin";
			var c = new SDI("", "", allowedHost);
			assert.equal(c.allowedHost(), allowedHost, "The allowedHost is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new SDI("afd", "adfd", "afdd", id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function () {
			var c = new SDI("afd", "adfd", "afdd", 34, true);
			assert.equal(c.isComplete(), true, "The complete value is not stored.");
		});

		it('should assign a default complete value', function () {
			var c = new SDI();
			assert.equal(c.isComplete(), false, "The complete value is not stored.");
		});
	});

	describe('#checkCompleteness()', function() {
		it('should return false if the object is empty', function(done) {
			var b =  new SDI();
			var success = function () {
				assert.equal(b.isComplete(), false, "The SDI should not be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return true if the object has a name and an ID but no description', function(done) {
			var b = new SDI("tret", "adfd", "afdd", 34);
			var success = function () {
				assert.equal(b.isComplete(), true, "The SDI should be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return false if the object has an empty name and an ID but no description', function(done) {
			var b = new SDI("", null, "afdd", 34);
			var success = function () {
				assert.equal(b.isComplete(), false, "The SDI should not be complete.");
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
				"description": "blabla",
				"allowedHost": "localhost",
				"complete": true
			};

			var userRetrieve = SDI.fromJSONObject(json);
			var userExpected = new SDI("toto", "blabla", "localhost", 42, true);

			assert.deepEqual(userRetrieve, userExpected, "The retrieve SDI (" + userRetrieve + ") does not match with the expected one (" + userExpected + ")");
		});

		it('should create the right object even if it is partial', function () {
			var json = {
				"id": 42,
				"name": null,
				"description": "blabla",
				"allowedHost": "",
				"complete": false
			};

			var userRetrieve = SDI.fromJSONObject(json);
			var userExpected = new SDI(null, "blabla", "", 42);

			assert.deepEqual(userRetrieve, userExpected, "The retrieve SDI (" + userRetrieve + ") does not match with the expected one (" + userExpected + ")");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new SDI("toto", "blabla", "tata", 52, true);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"allowedHost": "tata",
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
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new User("mavaleur", "", 12);
			var spy = sinon.spy(pv, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), User.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var users = c.users();

                assert.deepEqual(users, [], "The user is not an empty array: "+JSON.stringify(users));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the users");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(SDI.getTableName(), c.getId().toString(), User.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));


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
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new User("mavaleur", "", 12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"username": "mavaleur",
						"id": 12,
						"complete": false
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), User.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var users = c.users();

                assert.deepEqual(users, [pv], "The user array is not an array fill only with PV: "+JSON.stringify(users));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the users");

                var spy = sinon.spy(pv, "desynchronize");
                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(SDI.getTableName(), c.getId().toString(), User.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));


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

	describe('#addZone', function() {
		it('should call the right request', function(done) {
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new Zone("mavaleur","toto",2,3,4,5,12);
			var spy = sinon.spy(pv, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var zones = c.zones();

                assert.deepEqual(zones, [], "The zone is not an empty array: "+JSON.stringify(zones));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the zones");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(SDI.getTableName(), c.getId().toString(), Zone.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the addZone is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the zone in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addZone(pv.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadZones(success, fail);
		});
	});

	describe('#removeZone', function() {
		it('should call the right request', function(done) {
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new Zone("mavaleur","toto",2,3,4,5,12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"id":12,
						"name": "mavaleur",
						"description": "toto",
						"width": 2,
						"height": 3,
						"positionFromTop": 4,
						"positionFromLeft": 5,
						"complete": false
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var zones = c.zones();

                assert.deepEqual(zones, [pv], "The zone array is not an array fill only with PV: "+JSON.stringify(zones));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the zones");

                var spy = sinon.spy(pv, "desynchronize");
                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(SDI.getTableName(), c.getId().toString(), Zone.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the removeZone is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the zone in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeZone(pv.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadZones(success, fail);
		});

	});

	describe('#addProfil', function() {
		it('should call the right request', function(done) {
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new Profil("mavaleur", "toto", 12);
			var spy = sinon.spy(pv, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), Profil.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var profils = c.profils();

                assert.deepEqual(profils, [], "The profil is not an empty array: "+JSON.stringify(profils));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the profils");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(SDI.getTableName(), c.getId().toString(), Profil.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the addProfil is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the profil in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addProfil(pv.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadProfils(success, fail);
		});
	});

	describe('#removeProfil', function() {
		it('should call the right request', function(done) {
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new Profil("mavaleur","uneautre",12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"name": "mavaleur",
						"description": "uneautre",
						"id": 12,
						"complete": false
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), Profil.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var profils = c.profils();

                assert.deepEqual(profils, [pv], "The profil array is not an array fill only with PV: "+JSON.stringify(profils));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the profils");

                var spy = sinon.spy(pv, "desynchronize");
                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(SDI.getTableName(), c.getId().toString(), Profil.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the removeProfil is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the profil in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeProfil(pv.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadProfils(success, fail);
		});
	});

	describe('#linkTheme', function () {
		it('should call the right request', function (done) {
			var c = new SDI("toto", "blabla", "toto", 52);
			var s = new ThemeSDI("toto", "truc", true, "http://example.com/background.png","http://example.com/backgroundVideo.png", "black", "arial","black", "89%", 52);

			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), ThemeSDI.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function () {
				var themeSDI = c.theme();
				assert.equal(themeSDI, null, "The themeZone is not a null value: " + JSON.stringify(themeSDI));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the service");

				var response2:SequelizeRestfulResponse = {
					"status": "success",
					"data": {}
				};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.put(DatabaseConnection.associatedObjectEndpoint(SDI.getTableName(), c.getId().toString(), ThemeSDI.getTableName(), s.getId().toString()))
					.reply(200, JSON.stringify(response2));

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

	describe('#unlinkThemeZone', function () {
		it('should call the right request', function (done) {
			var c = new SDI("toto", "blabla", "toto", 52);
			var s = new ThemeSDI("toto", "truc", true, "http://example.com/background.png", "http://example.com/backgroundVideo.png", "black", "arial","black", "89%", 52);

			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), ThemeSDI.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var themeSDI = c.theme();
				assert.deepEqual(themeSDI, s, "The themeSDI is not the expected value");
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the service");
				var spy = sinon.spy(themeSDI, "desynchronize");

				var response2:SequelizeRestfulResponse = {
					"status": "success",
					"data": {}
				};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.delete(DatabaseConnection.associatedObjectEndpoint(SDI.getTableName(), c.getId().toString(), ThemeSDI.getTableName(), s.getId().toString()))
					.reply(200, JSON.stringify(response2));


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