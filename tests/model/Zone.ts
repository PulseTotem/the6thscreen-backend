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

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "type",
					"complete": true
				}
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

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "type",
					"complete": false
				}
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

		it('should throw an exception if the ID is undefined', function () {
			var json = {
				"name": "toto",
				"description": "blabla",
				"width": 10,
				"height": 20,
				"positionFromTop": 30,
				"positionFromLeft": 40,
				"complete": false
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function () {
			var json = {
				"id": null,
				"name": "toto",
				"description": "blabla",
				"width": 10,
				"height": 20,
				"positionFromTop": 30,
				"positionFromLeft": 40,
				"complete": false
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the complete attribute is undefined', function () {
			var json = {
				"id": 443,
				"name": "toto",
				"description": "blabla",
				"width": 10,
				"height": 20,
				"positionFromTop": 30,
				"positionFromLeft": 40
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the complete attribute is null', function () {
			var json = {
				"id": 34,
				"name": "toto",
				"description": "blabla",
				"width": 10,
				"height": 20,
				"positionFromTop": 30,
				"positionFromLeft": 40,
				"complete": null
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
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
				"complete": true
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#setBehaviour', function () {
		it('should set the given behaviour', function (done) {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var s = new Behaviour("toto", "machin", 42);
			var spy = sinon.spy(s, "desynchronize");

			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), Behaviour.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var behaviour = c.behaviour();
                assert.equal(behaviour, null, "The behaviour is not a null value: " + JSON.stringify(behaviour));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the behaviour");

                var response2:SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(Zone.getTableName(), c.getId().toString(), Behaviour.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the setBehaviour is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the behaviour in database.");

                    // normalement le lazy_loading est true : plus besoin de mock pour la requête
                    behaviour = c.behaviour();
                    assert.deepEqual(behaviour, s, "The behaviour() does not return the exact behaviour we give: " + JSON.stringify(behaviour));
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.setBehaviour(s, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadBehaviour(success, fail);
		});

		it('should not allow to add a null object', function (done) {
			nock.disableNetConnect();
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);

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

            c.setBehaviour(null, success, fail);
		});

		it('should not allow to add an undefined object', function (done) {
			nock.disableNetConnect();
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);

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

            c.setBehaviour(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function (done) {
			nock.disableNetConnect();
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var s = new Behaviour("toto","machin");

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

            c.setBehaviour(s, success, fail);
		});

		it('should not allow to set a behaviour if there is already one', function (done) {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var s = new Behaviour("toto","machin", 42);
			var s2 = new Behaviour("tutu","blabla", 89);


			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), Behaviour.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var behaviour = c.behaviour();

                assert.ok(!!behaviour, "The behaviour has false value.");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the behaviour");

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

                c.setBehaviour(s, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadBehaviour(success, fail);
		});

	});

	describe('#unsetBehaviour', function () {
		it('should unset the Behaviour', function (done) {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var s = new Behaviour("toto", "machin", 42);

			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), Behaviour.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var behaviour = c.behaviour();
                assert.deepEqual(behaviour, s, "The behaviour is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the behaviour");

                var spy = sinon.spy(behaviour, "desynchronize");

                var response2:SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(Zone.getTableName(), c.getId().toString(), Behaviour.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the unsetBehaviour is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

                    behaviour = c.behaviour();
                    assert.deepEqual(behaviour, null, "The behaviour() does not return a null value after unsetting");
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unsetBehaviour(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadBehaviour(success, fail);
		});

		it('should not allow to unset a profil if there is none', function (done) {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var s = new Behaviour("toto", "blabla", 42);

			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), Behaviour.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var behaviour = c.behaviour();

                assert.equal(behaviour, null, "The behaviour has a value not null: " + JSON.stringify(behaviour));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done");

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

                c.unsetBehaviour(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadBehaviour(success, fail);
		});

	});

	describe('#addCallType', function() {
		it('should put the new CallType inside the array', function(done) {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var ct = new CallType("mavaleur", "madescription", 12);
			var spy = sinon.spy(ct, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), CallType.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var callTypes = c.callTypes();

				assert.deepEqual(callTypes, [], "The callTypes is not an empty array: "+JSON.stringify(callTypes));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the callTypes");

				var response2 : SequelizeRestfulResponse = {
					"status": "success",
					"data": {}
				};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.put(DatabaseConnection.associatedObjectEndpoint(Zone.getTableName(), c.getId().toString(), CallType.getTableName(), ct.getId().toString()))
					.reply(200, JSON.stringify(response2));


				var success2 = function() {
					//assert.ok(retour, "The return of the addRole is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the CallType in database.");

					callTypes = c.callTypes();
					var expected = [ct];
					assert.deepEqual(callTypes, expected, "The callTypes is not an array containing only the added role: "+JSON.stringify(callTypes));
					assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.addCallType(ct, success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadCallTypes(success, fail);
		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);

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

			c.addCallType(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);

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

			c.addCallType(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var ct = new CallType("mavaleur", "madescription");

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

			c.addCallType(ct, success, fail);
		});

		it('should not allow to put an already existing object', function(done) {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var ct = new CallType("mavaleur", "madescription", 12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"id":12,
						"name": "mavaleur",
						"description": "madescription"
					},
					{
						"id": 14,
						"name": "titi",
						"description": "bidule"
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), CallType.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the callTypes");

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

				c.addCallType(ct, success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadCallTypes(success, fail);
		});

	});

	describe('#removeCallType', function() {
		it('should remove the CallType from the array', function(done) {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var ct = new CallType("mavaleur", "madescription", 12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"name": "mavaleur",
						"description": "madescription",
						"id": 12
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), CallType.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var callTypes = c.callTypes();

				assert.deepEqual(callTypes, [ct], "The callType array is not an array fill only with ct: "+JSON.stringify(callTypes));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the callTypes");

				var spy = sinon.spy(ct, "desynchronize");
				var response2 : SequelizeRestfulResponse = {
					"status": "success",
					"data": {}
				};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.delete(DatabaseConnection.associatedObjectEndpoint(Zone.getTableName(), c.getId().toString(), CallType.getTableName(), ct.getId().toString()))
					.reply(200, JSON.stringify(response2));

				var success2 = function() {
					//assert.ok(retour, "The return of the removeRole is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the CallType in database.");

					callTypes = c.callTypes();
					assert.deepEqual(callTypes, [], "The callTypes is not an empty array: "+JSON.stringify(callTypes));
					assert.ok(spy.calledOnce, "The desynchronize method was not used once.");

					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.removeCallType(ct, success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadCallTypes(success, fail);
		});

		it('should not allow to remove a null object', function(done) {
			nock.disableNetConnect();
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);

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

			c.removeCallType(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);

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

			c.removeCallType(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var ct = new CallType("mavaleur", "madescription");

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

			c.removeCallType(ct, success, fail);
		});

		it('should not allow to remove an object which is not linked', function(done) {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var ct = new CallType("mavaleur", "madescription", 12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), CallType.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the callTypes");

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

				c.removeCallType(ct, success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadCallTypes(success, fail);
		});

	});

});