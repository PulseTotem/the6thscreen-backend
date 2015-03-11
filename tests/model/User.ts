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

		it('should store the ID', function () {
			var id = 52;
			var c = new User("", "", 52);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function () {
			var c = new User("test", "bla", 52, true);
			assert.equal(c.isComplete(), true, "The complete value is not stored.");
		});

		it('should assign a default false value to complete', function () {
			var c = new User();
			assert.equal(c.isComplete(), false, "The complete value is not stored.");
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 42,
				"username": "toto",
				"email": "blabla",
				"complete": true
			};

			var userRetrieve = User.fromJSONObject(json);
			var userExpected = new User("toto", "blabla", 42, true);

			assert.deepEqual(userRetrieve, userExpected, "The retrieve user (" + userRetrieve + ") does not match with the expected one (" + userExpected + ")");
		});

		it('should throw an exception if the ID is undefined', function () {
			var json = {
				"username": "toto",
				"email": "blabla",
				"complete": false
			};

			assert.throws(function () {
					User.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function () {
			var json = {
				"username": "toto",
				"email": "blabla",
				"id": null,
				"complete": false
			};

			assert.throws(function () {
					User.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the complete is undefined', function () {
			var json = {
				"username": "toto",
				"email": "blabla",
				"id": 34
			};

			assert.throws(function () {
					User.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the complete is null', function () {
			var json = {
				"username": "toto",
				"email": "blabla",
				"id": 34,
				"complete": null
			};

			assert.throws(function () {
					User.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new User("toto", "bla", 52);
			var expected = {
				"id": 52,
				"username": "toto",
				"email": "bla",
				"token": null,
				"lastIp": null,
				"complete": false
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#checkCompleteness()', function() {
		it('should return false if the object is empty', function() {
			var b =  new User();
			b.checkCompleteness();
			assert.equal(b.isComplete(), false, "The behaviour should not be complete.");
		});

		it('should return true if the object has a name, an email and an ID', function() {
			var b = new User("toto", "bla", 52);
			b.checkCompleteness();
			assert.equal(b.isComplete(), true, "The behaviour should be complete.");
		});

		it('should return false if the object has an empty name, an email and an ID', function() {
			var b = new User("", "bla", 52);
			b.checkCompleteness();
			assert.equal(b.isComplete(), false, "The behaviour should be complete.");
		});

		it('should return false if the object has a null name, an email and an ID', function() {
			var b = new User(null, "bla", 52);
			b.checkCompleteness();
			assert.equal(b.isComplete(), false, "The behaviour should be complete.");
		});

		it('should return false if the object has a name, an empty email and an ID', function() {
			var b = new User("test", "", 52);
			b.checkCompleteness();
			assert.equal(b.isComplete(), false, "The behaviour should be complete.");
		});

		it('should return false if the object has a name, a null email and an ID', function() {
			var b = new User("test", null, 52);
			b.checkCompleteness();
			assert.equal(b.isComplete(), false, "The behaviour should be complete.");
		});

		it('should return false if the object has a name, an email and no ID', function() {
			var b = new User("test", "test");
			b.checkCompleteness();
			assert.equal(b.isComplete(), false, "The behaviour should be complete.");
		});
	});

	describe('#addRole', function() {
		it('should put the new Role inside the array', function(done) {
			var c = new User("toto", "bla", 52);
			var pv = new Role("mavaleur",12);
			var spy = sinon.spy(pv, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(User.getTableName(), c.getId().toString(), Role.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var roles = c.roles();

                assert.deepEqual(roles, [], "The role is not an empty array: "+JSON.stringify(roles));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the roles");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(User.getTableName(), c.getId().toString(), Role.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the addRole is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the role in database.");

                    roles = c.roles();
                    var expected = [pv];
                    assert.deepEqual(roles, expected, "The roles is not an array containing only the added role: "+JSON.stringify(roles));
                    assert.ok(spy.calledOnce, "The desynchronize method was not usered once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addRole(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadRoles(success, fail);
		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new User("toto", "bla", 52);

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

            c.addRole(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new User("toto", "bla", 52);

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

            c.addRole(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new User("toto", "bla", 52);
			var p = new Role("bidule");

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

            c.addRole(p, success, fail);
		});

		it('should not allow to put an already existing object', function(done) {
			var c = new User("toto", "bla", 52);
			var pv = new Role("toto",13);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"id":13,
						"name": "toto",
						"complete": false
					},
					{
						"id": 14,
						"name": "titi",
						"complete": false
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(User.getTableName(), c.getId().toString(), Role.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the roles");

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

                c.addRole(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadRoles(success, fail);
		});

	});

	describe('#removeRole', function() {
		it('should remove the Role from the array', function(done) {
			var c = new User("toto", "bla", 52);
			var pv = new Role("mavaleur",12);

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
				.get(DatabaseConnection.associationEndpoint(User.getTableName(), c.getId().toString(), Role.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var roles = c.roles();

                assert.deepEqual(roles, [pv], "The role array is not an array fill only with PV: "+JSON.stringify(roles));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the roles");

                var spy = sinon.spy(pv, "desynchronize");
                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(User.getTableName(), c.getId().toString(), Role.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the removeRole is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the role in database.");

                    roles = c.roles();
                    assert.deepEqual(roles, [], "The roles is not an empty array: "+JSON.stringify(roles));
                    assert.ok(spy.calledOnce, "The desynchronize method was not usered once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeRole(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadRoles(success, fail);
		});

		it('should not allow to remove a null object', function(done) {
			nock.disableNetConnect();
			var c = new User("toto", "bla", 52);

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

            c.removeRole(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new User("toto", "bla", 52);

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

            c.removeRole(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new User("toto", "bla", 52);
			var p = new Role("bidule");

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

            c.removeRole(p, success, fail);
		});

		it('should not allow to remove an object which is not linked', function(done) {
			var c = new User("toto", "bla", 52);
			var pv = new Role("toto",12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(User.getTableName(), c.getId().toString(), Role.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the roles");

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

                c.removeRole(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadRoles(success, fail);
		});

	});

	describe('#addSDI', function() {
		it('should put the new SDI inside the array', function(done) {
			var c = new User("toto", "bla", 52);
			var pv = new SDI("mavaleur", "bidule", "host", 12);
			var spy = sinon.spy(pv, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(User.getTableName(), c.getId().toString(), SDI.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var sdis = c.sdis();

                assert.deepEqual(sdis, [], "The role is not an empty array: "+JSON.stringify(sdis));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the sdis");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(User.getTableName(), c.getId().toString(), SDI.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the addSDI is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the role in database.");

                    sdis = c.sdis();
                    var expected = [pv];
                    assert.deepEqual(sdis, expected, "The sdis is not an array containing only the added role: "+JSON.stringify(sdis));
                    assert.ok(spy.calledOnce, "The desynchronize method was not usered once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addSDI(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadSdis(success, fail);
		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new User("toto", "bla", 52);

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

            c.addSDI(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new User("toto", "bla", 52);

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

            c.addSDI(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new User("toto", "bla", 52);
			var p = new SDI("bidule", "machin", "otot");

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

            c.addSDI(p, success, fail);
		});

		it('should not allow to put an already existing object', function(done) {
			var c = new User("toto", "bla", 52);
			var pv = new SDI("toto", "machin", "host", 13);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"id":13,
						"name": "toto",
						"description": "machin",
						"allowedHost": "host",
						"complete": false
					},
					{
						"id": 14,
						"name": "titi",
						"description": "blop",
						"allowedHost": "tata",
						"complete": false
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(User.getTableName(), c.getId().toString(), SDI.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the sdis");

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

                c.addSDI(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadSdis(success, fail);
		});

	});

	describe('#removeSDI', function() {
		it('should remove the SDI from the array', function(done) {
			var c = new User("toto", "bla", 52);
			var pv = new SDI("mavaleur", "blup", "truc", 12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"name": "mavaleur",
						"description": "blup",
						"allowedHost": "truc",
						"complete": false,
						"id": 12
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(User.getTableName(), c.getId().toString(), SDI.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var sdis = c.sdis();

                assert.deepEqual(sdis, [pv], "The sdis array is not an array fill only with PV: "+JSON.stringify(sdis));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the sdis");

                var spy = sinon.spy(pv, "desynchronize");
                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(User.getTableName(), c.getId().toString(), SDI.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the removeSDI is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the role in database.");

                    sdis = c.sdis();
                    assert.deepEqual(sdis, [], "The sdis is not an empty array: "+JSON.stringify(sdis));
                    assert.ok(spy.calledOnce, "The desynchronize method was not usered once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeSDI(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadSdis(success, fail);
		});

		it('should not allow to remove a null object', function(done) {
			nock.disableNetConnect();
			var c = new User("toto", "bla", 52);

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

            c.removeSDI(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new User("toto", "bla", 52);

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

            c.removeSDI(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new User("toto", "bla", 52);
			var p = new SDI("bidule","truc","tata");

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

            c.removeSDI(p, success, fail);
		});

		it('should not allow to remove an object which is not linked', function(done) {
			var c = new User("toto", "bla", 52);
			var pv = new SDI("toto", "bidule", "blabla",12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(User.getTableName(), c.getId().toString(), SDI.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the sdis");

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

                c.removeSDI(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadSdis(success, fail);
		});

	});
});