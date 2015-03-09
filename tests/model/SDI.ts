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
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "blabla",
				"allowedHost": "localhost"
			};

			var userRetrieve = SDI.fromJSONObject(json);
			var userExpected = new SDI("toto", "blabla", "localhost", 42);

			assert.deepEqual(userRetrieve, userExpected, "The retrieve SDI (" + userRetrieve + ") does not match with the expected one (" + userExpected + ")");
		});

		it('should throw an exception if the ID is undefined', function () {
			var json = {
				"name": "toto",
				"description": "blabla",
				"allowedHost": "toto"
			};

			assert.throws(function () {
					SDI.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function () {
			var json = {
				"name": "toto",
				"description": "blabla",
				"id": null,
				"allowedHost": "toto"
			};

			assert.throws(function () {
					SDI.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new SDI("toto", "blabla", "tata", 52);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"allowedHost": "tata",
				"id": 52
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#addUser', function() {
		it('should put the new User inside the array', function(done) {
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

                    users = c.users();
                    var expected = [pv];
                    assert.deepEqual(users, expected, "The users is not an array containing only the added user: "+JSON.stringify(users));
                    assert.ok(spy.calledOnce, "The desynchronize method was not usered once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addUser(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadUsers(success, fail);
		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.addUser(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.addUser(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);
			var p = new User("bidule");

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.addUser(p, success, fail);
		});

		it('should not allow to put an already existing object', function(done) {
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new User("toto", "", 13);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"id":13,
						"username": "toto"
					},
					{
						"id": 14,
						"username": "titi"
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), User.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var users = c.users();

                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the users");

                var success2 = function() {
                    done(new Error("Test failed."));
                };

                var fail2 = function(err) {
                    assert.throws(function() {
                            if(err) {
                                throw err;
                            }
                        },
                        ModelException, "The ModelException has not been thrown.");
                    done();
                };

                c.addUser(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadUsers(success, fail);
		});

	});

	describe('#removeUser', function() {
		it('should remove the User from the array', function(done) {
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new User("mavaleur", "", 12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"username": "mavaleur",
						"id": 12
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

                    users = c.users();
                    assert.deepEqual(users, [], "The users is not an empty array: "+JSON.stringify(users));
                    assert.ok(spy.calledOnce, "The desynchronize method was not usered once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeUser(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadUsers(success, fail);
		});

		it('should not allow to remove a null object', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.removeUser(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.removeUser(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);
			var p = new User("bidule", "");

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.removeUser(p, success, fail);
		});

		it('should not allow to remove an object which is not linked', function(done) {
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new User("toto", "", 12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), User.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var users = c.users();

                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the users");

                var success2 = function() {
                    done(new Error("Test failed."));
                };

                var fail2 = function(err) {
                    assert.throws(function() {
                            if(err) {
                                throw err;
                            }
                        },
                        ModelException, "The ModelException has not been thrown.");
                    done();
                };

                c.removeUser(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadUsers(success, fail);
		});

	});

	describe('#addZone', function() {
		it('should put the new Zone inside the array', function(done) {
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

                    zones = c.zones();
                    var expected = [pv];
                    assert.deepEqual(zones, expected, "The zones is not an array containing only the added zone: "+JSON.stringify(zones));
                    assert.ok(spy.calledOnce, "The desynchronize method was not zoneed once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addZone(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadZones(success, fail);
		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.addZone(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.addZone(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new Zone("mavaleur","toto",2,3,4,5);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.addZone(pv, success, fail);
		});

		it('should not allow to put an already existing object', function(done) {
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
						"positionFromLeft": 5
					},
					{
						"id":43,
						"name": "blabla",
						"description": "tutu",
						"width": 2,
						"height": 3,
						"positionFromTop": 4,
						"positionFromLeft": 5
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var zones = c.zones();

                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the zones");

                var success2 = function() {
                    done(new Error("Test failed."));
                };

                var fail2 = function(err) {
                    assert.throws(function() {
                            if(err) {
                                throw err;
                            }
                        },
                        ModelException, "The ModelException has not been thrown.");
                    done();
                };

                c.addZone(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadZones(success, fail);
		});

	});

	describe('#removeZone', function() {
		it('should remove the Zone from the array', function(done) {
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
						"positionFromLeft": 5
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

                    zones = c.zones();
                    assert.deepEqual(zones, [], "The zones is not an empty array: "+JSON.stringify(zones));
                    assert.ok(spy.calledOnce, "The desynchronize method was not zoneed once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeZone(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadZones(success, fail);
		});

		it('should not allow to remove a null object', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.removeZone(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.removeZone(undefined, success, fail);
		});

		it('should not allow to remove an object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new Zone("mavaleur","toto",2,3,4,5);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.removeZone(pv, success, fail);
		});

		it('should not allow to remove an object which is not linked', function(done) {
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new Zone("mavaleur","toto",2,3,4,5,12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var zones = c.zones();

                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the zones");

                var success2 = function() {
                    done(new Error("Test failed."));
                };

                var fail2 = function(err) {
                    assert.throws(function() {
                            if(err) {
                                throw err;
                            }
                        },
                        ModelException, "The ModelException has not been thrown.");
                    done();
                };

                c.removeZone(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadZones(success, fail);

		});

	});

	describe('#addProfil', function() {
		it('should put the new Profil inside the array', function(done) {
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

                    profils = c.profils();
                    var expected = [pv];
                    assert.deepEqual(profils, expected, "The profils is not an array containing only the added profil: "+JSON.stringify(profils));
                    assert.ok(spy.calledOnce, "The desynchronize method was not profiled once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addProfil(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadProfils(success, fail);
		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.addProfil(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.addProfil(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);
			var p = new Profil("bidule","truc");

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.addProfil(p, success, fail);
		});

		it('should not allow to put an already existing object', function(done) {
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new Profil("toto","bidule",13);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"id":13,
						"name": "toto",
						"description": "bidule"
					},
					{
						"id": 14,
						"name": "titi",
						"description": "machin"
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), Profil.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var profils = c.profils();

                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the profils");

                var success2 = function() {
                    done(new Error("Test failed."));
                };

                var fail2 = function(err) {
                    assert.throws(function() {
                            if(err) {
                                throw err;
                            }
                        },
                        ModelException, "The ModelException has not been thrown.");
                    done();
                };

                c.addProfil(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadProfils(success, fail);
		});

	});

	describe('#removeProfil', function() {
		it('should remove the Profil from the array', function(done) {
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new Profil("mavaleur","uneautre",12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"name": "mavaleur",
						"description": "uneautre",
						"id": 12
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

                    profils = c.profils();
                    assert.deepEqual(profils, [], "The profils is not an empty array: "+JSON.stringify(profils));
                    assert.ok(spy.calledOnce, "The desynchronize method was not profiled once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeProfil(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadProfils(success, fail);
		});

		it('should not allow to remove a null object', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.removeProfil(null, success, fail);

		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.removeProfil(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);
			var p = new Profil("bidule","machin");

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.removeProfil(p, success, fail);
		});

		it('should not allow to remove an object which is not linked', function(done) {
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new Profil("toto","blop",12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), Profil.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var profils = c.profils();

                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the profils");

                var success2 = function() {
                    done(new Error("Test failed."));
                };

                var fail2 = function(err) {
                    assert.throws(function() {
                            if(err) {
                                throw err;
                            }
                        },
                        ModelException, "The ModelException has not been thrown.");
                    done();
                };

                c.removeProfil(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadProfils(success, fail);
		});

	});

	describe('#addTimeline', function() {
		it('should put the new Timeline inside the array', function(done) {
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new Timeline("mavaleur", "toto", 12);
			var spy = sinon.spy(pv, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), Timeline.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var timelines = c.timelines();

                assert.deepEqual(timelines, [], "The timeline is not an empty array: "+JSON.stringify(timelines));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the timelines");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(SDI.getTableName(), c.getId().toString(), Timeline.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the addTimeline is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the timeline in database.");

                    timelines = c.timelines();
                    var expected = [pv];
                    assert.deepEqual(timelines, expected, "The timelines is not an array containing only the added timeline: "+JSON.stringify(timelines));
                    assert.ok(spy.calledOnce, "The desynchronize method was not timelineed once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addTimeline(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadTimelines(success, fail);
		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.addTimeline(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.addTimeline(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);
			var p = new Timeline("bidule","truc");

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.addTimeline(p, success, fail);
		});

		it('should not allow to put an already existing object', function(done) {
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new Timeline("toto","bidule",13);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"id":13,
						"name": "toto",
						"description": "bidule"
					},
					{
						"id": 14,
						"name": "titi",
						"description": "machin"
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), Timeline.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var timelines = c.timelines();

                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the timelines");

                var success2 = function() {
                    done(new Error("Test failed."));
                };

                var fail2 = function(err) {
                    assert.throws(function() {
                            if(err) {
                                throw err;
                            }
                        },
                        ModelException, "The ModelException has not been thrown.");
                    done();
                };

                c.addTimeline(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadTimelines(success, fail);
		});

	});

	describe('#removeTimeline', function() {
		it('should remove the Timeline from the array', function(done) {
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new Timeline("mavaleur","uneautre",12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"name": "mavaleur",
						"description": "uneautre",
						"id": 12
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), Timeline.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var timelines = c.timelines();

                assert.deepEqual(timelines, [pv], "The timeline array is not an array fill only with PV: "+JSON.stringify(timelines));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the timelines");

                var spy = sinon.spy(pv, "desynchronize");
                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(SDI.getTableName(), c.getId().toString(), Timeline.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the removeTimeline is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the timeline in database.");

                    timelines = c.timelines();
                    assert.deepEqual(timelines, [], "The timelines is not an empty array: "+JSON.stringify(timelines));
                    assert.ok(spy.calledOnce, "The desynchronize method was not timelineed once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeTimeline(pv, success2, fail2);

            };

            var fail = function(err) {
                done(err);
            };

			c.loadTimelines(success, fail);
		});

		it('should not allow to remove a null object', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.removeTimeline(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.removeTimeline(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new SDI("toto", "blabla", "toto", 52);
			var p = new Timeline("bidule","machin");

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.removeTimeline(p, success, fail);
		});

		it('should not allow to remove an object which is not linked', function(done) {
			var c = new SDI("toto", "blabla", "toto", 52);
			var pv = new Timeline("toto","blop",12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDI.getTableName(), c.getId().toString(), Timeline.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var timelines = c.timelines();

                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the timelines");

                var success2 = function() {
                    done(new Error("Test failed."));
                };

                var fail2 = function(err) {
                    assert.throws(function() {
                            if(err) {
                                throw err;
                            }
                        },
                        ModelException, "The ModelException has not been thrown.");
                    done();
                };

                c.removeTimeline(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadTimelines(success, fail);

		});

	});
});