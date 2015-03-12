/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/ParamType.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('ParamType', function() {
	describe('#constructor', function () {
		it('should store the name', function () {
			var name = "machin";
			var c = new ParamType(name, "");
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function () {
			var desc = "machin";
			var c = new ParamType("", desc);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new ParamType("", "", id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function () {
			var c = new ParamType("tets", "test", 23, true);
			assert.equal(c.isComplete(), true, "The complete value is not stored.");
		});

		it('should assign a false default complete value', function () {
			var c = new ParamType();
			assert.equal(c.isComplete(), false, "The complete value is not stored.");
		});
	});

	describe('#checkCompleteness', function() {
		it('should consider the object as complete if it has an ID, a name and a complete type', function(done) {
			var cpt = new ParamType("test","", 52);

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "type",
					"complete": true
				}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), cpt.getId().toString(), TypeParamType.getTableName()))
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
			var cpt = new ParamType("test","", 52);

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "type",
					"complete": false
				}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), cpt.getId().toString(), TypeParamType.getTableName()))
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

			var cpt = new ParamType("test","");

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

			var cpt = new ParamType("","", 52);

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

			var cpt = new ParamType(null,"", 52);

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

			var cpt = new ParamType();

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
				"complete": true
			};

			var callRetrieve = ParamType.fromJSONObject(json);
			var callExpected = new ParamType("toto", "blabla", 42, true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve paramType (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});

		it('should create the right object even if it is partial', function () {
			var json = {
				"id": 42,
				"name": "",
				"description": null,
				"complete": false
			};

			var callRetrieve = ParamType.fromJSONObject(json);
			var callExpected = new ParamType("", null, 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve paramType (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});

		it('should throw an exception if the ID is undefined', function () {
			var json = {
				"name": "toto",
				"description": "blabla",
				"complete": false
			};

			assert.throws(function () {
					ParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function () {
			var json = {
				"name": "toto",
				"description": "blabla",
				"complete": false,
				"id": null
			};

			assert.throws(function () {
					ParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the complete value is undefined', function () {
			var json = {
				"name": "toto",
				"description": "blabla",
				"id": 12
			};

			assert.throws(function () {
					ParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the complete value is null', function () {
			var json = {
				"name": "toto",
				"description": "blabla",
				"complete": null,
				"id": 12
			};

			assert.throws(function () {
					ParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new ParamType("toto", "blabla", 52,true);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"id": 52,
				"complete": true
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

    describe('#linkType', function() {
        it('should set the given type', function(done) {
            var c = new ParamType("toto","machin", 52);
            var s = new TypeParamType("toto", 42);
            var spy = sinon.spy(s, "desynchronize");

            var response1 : SequelizeRestfulResponse = {
                "status": "success",
                "data": []
            };

            var restClientMock1 = nock(DatabaseConnection.getBaseURL())
                .get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName()))
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
                    .put(DatabaseConnection.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the linkTypeParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the type in database.");

                    type = c.type();
                    assert.deepEqual(type, s, "The type() does not return the exact type we give: "+JSON.stringify(type));
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkType(s, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadType(success, fail);
        });

        it('should not allow to add a null object', function(done) {
            nock.disableNetConnect();
            var c = new ParamType("toto","machin", 52);

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

            c.linkType(null, success, fail);
        });

        it('should not allow to add an undefined object', function(done) {
            nock.disableNetConnect();
            var c = new ParamType("toto","machin", 52);

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

            c.linkType(undefined, success, fail);
        });

        it('should not allow to add a object which is not yet created', function(done) {
            nock.disableNetConnect();
            var c = new ParamType("toto","machin", 52);
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

            c.linkType(s, success, fail);
        });

        it('should not allow to set a type if there is already one', function(done) {
            var c = new ParamType("toto","machin", 52);
            var s = new TypeParamType("toto", 42);
            var s2 = new TypeParamType("tutu", 89);


            var response1 : SequelizeRestfulResponse = {
                "status": "success",
                "data": s2.toJSONObject()
            };

            var restClientMock1 = nock(DatabaseConnection.getBaseURL())
                .get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName()))
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

                c.linkType(s, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadType(success, fail);
        });

    });

    describe('#unlinkType', function() {
        it('should unset the TypeParamType', function(done) {
            var c = new ParamType("toto","machin", 52);
            var s = new TypeParamType("toto", 42);

            var response1 : SequelizeRestfulResponse = {
                "status": "success",
                "data": s.toJSONObject()
            };

            var restClientMock1 = nock(DatabaseConnection.getBaseURL())
                .get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName()))
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
                    .delete(DatabaseConnection.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkTypeParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

                    type = c.type();
                    assert.deepEqual(type, null, "The type() does not return a null value after unsetting");
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkType(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadType(success, fail);
        });

        it('should not allow to unset a type if there is none', function(done) {
            var c = new ParamType("toto","machin", 52);
            var s = new TypeParamType("toto", 42);

            var response1 : SequelizeRestfulResponse = {
                "status": "success",
                "data": []
            };

            var restClientMock1 = nock(DatabaseConnection.getBaseURL())
                .get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName()))
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

                c.unlinkType(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadType(success, fail);
        });

    });

	describe('#linkConstraint', function() {
		it('should set the given constraint', function(done) {
			var c = new ParamType("toto","machin", 52);
			var s = new ConstraintParamType("toto","tata" ,42);
			var spy = sinon.spy(s, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ConstraintParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var constraint = c.constraint();
                assert.equal(constraint, null, "The constraint is not a null value: "+JSON.stringify(constraint));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the constraint");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), ConstraintParamType.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the linkConstraintParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the constraint in database.");

                    constraint = c.constraint();
                    assert.deepEqual(constraint, s, "The constraint() does not return the exact constraint we give: "+JSON.stringify(constraint));
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkConstraint(s, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadConstraint(success, fail);
		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new ParamType("toto","machin", 52);

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

            c.linkConstraint(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new ParamType("toto","machin", 52);

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

            c.linkConstraint(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new ParamType("toto","machin", 52);
			var s = new ConstraintParamType("toto","tata");

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

            c.linkConstraint(s, success, fail);
		});

		it('should not allow to set a constraint if there is already one', function(done) {
			var c = new ParamType("toto","machin", 52);
			var s = new ConstraintParamType("toto", "tata", 42);
			var s2 = new ConstraintParamType("tutu", "tata", 89);


			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ConstraintParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var constraint = c.constraint();

                assert.ok(!!constraint, "The constraint has false value.");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the constraint");

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

                c.linkConstraint(s, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadConstraint(success, fail);
		});

	});

	describe('#unlinkConstraint', function() {
		it('should unset the ConstraintParamType', function(done) {
			var c = new ParamType("toto","machin", 52);
			var s = new ConstraintParamType("toto","tata", 42);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ConstraintParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var constraint = c.constraint();
                assert.deepEqual(constraint, s, "The constraint is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the constraint");
                var spy = sinon.spy(constraint, "desynchronize");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), ConstraintParamType.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkConstraintParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

                    constraint = c.constraint();
                    assert.deepEqual(constraint, null, "The constraint() does not return a null value after unsetting");
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkConstraint(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadConstraint(success, fail);
		});

		it('should not allow to unset a constraint if there is none', function(done) {
			var c = new ParamType("toto","machin", 52);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ConstraintParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var constraint = c.constraint();

                assert.equal(constraint, null, "The constraint has a value not null: "+JSON.stringify(constraint));
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

                c.unlinkConstraint(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadConstraint(success, fail);
		});

	});

	describe('#linkDefaultValue', function() {
		it('should set the given defaultValue', function(done) {
			var c = new ParamType("toto","machin", 52);
			var s = new ParamValue("toto" ,42);
			var spy = sinon.spy(s, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var defaultValue = c.defaultValue();
                assert.equal(defaultValue, null, "The defaultValue is not a null value: "+JSON.stringify(defaultValue));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the defaultValue");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), ParamValue.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the setParamValue is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the defaultValue in database.");

                    defaultValue = c.defaultValue();
                    assert.deepEqual(defaultValue, s, "The defaultValue() does not return the exact defaultValue we give: "+JSON.stringify(defaultValue));
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkDefaultValue(s, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadDefaultValue(success, fail);
		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new ParamType("toto","machin", 52);

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

            c.linkDefaultValue(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new ParamType("toto","machin", 52);

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

            c.linkDefaultValue(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new ParamType("toto","machin", 52);
			var s = new ParamValue("toto");

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

            c.linkDefaultValue(s, success, fail);
		});

		it('should not allow to set a defaultValue if there is already one', function(done) {
			var c = new ParamType("toto","machin", 52);
			var s = new ParamValue("toto", 42);
			var s2 = new ParamValue("tutu", 89);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var defaultValue = c.defaultValue();

                assert.ok(!!defaultValue, "The defaultValue has false value.");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the defaultValue");

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

                c.linkDefaultValue(s, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadDefaultValue(success, fail);
		});

	});

	describe('#unlinkDefaultValue', function() {
		it('should unset the defaultValue', function(done) {
			var c = new ParamType("toto","machin", 52);
			var s = new ParamValue("toto",42);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var defaultValue = c.defaultValue();
                assert.deepEqual(defaultValue, s, "The defaultValue is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the defaultValue");

                var spy = sinon.spy(defaultValue, "desynchronize");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), ParamValue.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the unsetParamValue is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

                    defaultValue = c.defaultValue();
                    assert.deepEqual(defaultValue, null, "The defaultValue() does not return a null value after unsetting");
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
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

                c.unlinkDefaultValue(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadDefaultValue(success, fail);
		});

		it('should not allow to unset a defaultValue if there is none', function(done) {
			var c = new ParamType("toto","machin", 52);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var defaultValue = c.defaultValue();

                assert.equal(defaultValue, null, "The defaultValue has a value not null: "+JSON.stringify(defaultValue));
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

                c.unlinkDefaultValue(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadDefaultValue(success, fail);
		});

	});
});