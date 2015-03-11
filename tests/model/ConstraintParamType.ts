/**
 * @author Christian Brel <brel@i3s.unice.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/ConstraintParamType.ts" />
/// <reference path="../../scripts/model/TypeParamType.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('ConstraintParamType', function() {
	describe('#constructor', function () {
		it('should store the name', function(){
			var name = "machin";
			var c = new ConstraintParamType(name,"");
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function(){
			var desc = "machin";
			var c = new ConstraintParamType("",desc);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the ID', function() {
			var id = 52;
			var c = new ConstraintParamType("","",id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function() {
			var c = new ConstraintParamType("tze","tete",42,true);
			assert.equal(c.isComplete(), true, "The complete value is not stored.");
		});

		it('should assign a default false value to complete', function() {
			var c = new ConstraintParamType();
			assert.equal(c.isComplete(), false, "The complete value is not stored.");
		});
	});

	describe('#checkCompleteness', function() {
		it('should consider the object as complete if it has an ID, a name and a complete type', function(done) {
			var cpt = new ConstraintParamType("bidule", null, 52);

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "type",
					"complete": true
				}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ConstraintParamType.getTableName(), cpt.getId().toString(), TypeParamType.getTableName()))
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
			var cpt = new ConstraintParamType("bidule", "Description de bidule", 52);

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "type",
					"complete": false
				}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ConstraintParamType.getTableName(), cpt.getId().toString(), TypeParamType.getTableName()))
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

			var cpt = new ConstraintParamType("bidule", "Description de bidule");

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

			var cpt = new ConstraintParamType("", "Description de bidule",24);

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

			var cpt = new ConstraintParamType(null, "Description de bidule",24);

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

			var cpt = new ConstraintParamType();

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

    describe("#type", function() {
        it('should be null at initialization', function(done) {
            var cpt = new ConstraintParamType("bidule", "Description de bidule", 52);

            var response : SequelizeRestfulResponse = {
                "status": "success",
                "data": []
            };

            var restClientMock = nock(DatabaseConnection.getBaseURL())
                .get(DatabaseConnection.associationEndpoint(ConstraintParamType.getTableName(), cpt.getId().toString(), TypeParamType.getTableName()))
                .reply(200, JSON.stringify(response));

            var success = function() {
                var type = cpt.type();

                assert.deepEqual(type, null, "The type is not null: "+JSON.stringify(type));
                assert.ok(restClientMock.isDone(), "The mock request has not been done to get the type");

                done();
            };

            var fail = function(err) {
                done(err);
            }

            cpt.loadType(success, fail);
        });
    });

	describe('#fromJSONobject', function() {
		it('should create the right object', function() {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "blabla",
				"complete": true
			};

			var callRetrieve = ConstraintParamType.fromJSONObject(json);
			var callExpected = new ConstraintParamType("toto","blabla",42,true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve constraintParamType ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should create the right object even if it is partial', function() {
			var json = {
				"id": 42,
				"name": "",
				"description": null,
				"complete": false
			};

			var callRetrieve = ConstraintParamType.fromJSONObject(json);
			var callExpected = new ConstraintParamType("",null,42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve constraintParamType ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should throw an exception if the ID is undefined', function() {
			var json = {
				"name": "toto",
				"description": "blabla",
				"complete": false
			};

			assert.throws(function() {
					ConstraintParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function() {
			var json = {
				"name": "toto",
				"description": "blabla",
				"complete": false,
				"id": null
			};

			assert.throws(function() {
					ConstraintParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the complete is undefined', function() {
			var json = {
				"name": "toto",
				"description": "blabla",
				"id": 2
			};

			assert.throws(function() {
					ConstraintParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the complete is null', function() {
			var json = {
				"name": "toto",
				"description": "blabla",
				"id": 23,
				"complete": null
			};

			assert.throws(function() {
					ConstraintParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});
	});

	describe('#toJsonObject', function() {
		it('should create the expected JSON Object', function() {
			var c = new ConstraintParamType("toto","blabla", 52);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"id": 52,
				"complete": false
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object ("+JSON.stringify(json)+") and the expected JSON ("+JSON.stringify(expected)+") do not match.");
		})
	});

	describe('#setType', function() {
		it('should set the given type', function(done) {
			var c = new ConstraintParamType("toto","machin", 52);
			var s = new TypeParamType("toto", 42);
			var spy = sinon.spy(s, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ConstraintParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var type = c.type();
                assert.equal(type, null, "The type is not a null value: "+JSON.stringify(type));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the type");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(ConstraintParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the setTypeParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the type in database.");

                    type = c.type();
                    assert.deepEqual(type, s, "The type() does not return the exact type we give: "+JSON.stringify(type));
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.setType(s, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadType(success, fail);
		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new ConstraintParamType("toto","machin", 52);

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

            c.setType(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new ConstraintParamType("toto","machin", 52);

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

            c.setType(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new ConstraintParamType("toto","machin", 52);
			var s = new TypeParamType("toto");

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

            c.setType(s, success, fail);
		});

		it('should not allow to set a type if there is already one', function(done) {
			var c = new ConstraintParamType("toto","machin", 52);
			var s = new TypeParamType("toto", 42);
			var s2 = new TypeParamType("tutu", 89);


			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ConstraintParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var type = c.type();

                assert.ok(!!type, "The type has false value.");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the type");

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

                c.setType(s, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadType(success, fail);
		});

	});

	describe('#unsetType', function() {
		it('should unset the TypeParamType', function(done) {
			var c = new ConstraintParamType("toto","machin", 52);
			var s = new TypeParamType("toto", 42);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ConstraintParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var type = c.type();
                assert.deepEqual(type, s, "The type is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the type");
                var spy = sinon.spy(type, "desynchronize");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(ConstraintParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the unsetTypeParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

                    type = c.type();
                    assert.deepEqual(type, null, "The type() does not return a null value after unsetting");
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unsetType(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadType(success, fail);
		});

		it('should not allow to unset a type if there is none', function(done) {
			var c = new ConstraintParamType("toto","machin", 52);
			var s = new TypeParamType("toto", 42);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ConstraintParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var type = c.type();

                assert.equal(type, null, "The type has a value not null: "+JSON.stringify(type));
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

                c.unsetType(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadType(success, fail);
		});

	});
});