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
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "blabla"
			};

			var callRetrieve = ParamType.fromJSONObject(json);
			var callExpected = new ParamType("toto", "blabla", 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve paramType (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});

		it('should throw an exception if the ID is undefined', function () {
			var json = {
				"name": "toto",
				"description": "blabla"
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
				"id": null
			};

			assert.throws(function () {
					ParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new ParamType("toto", "blabla", 52);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"id": 52
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

    describe('#setType', function() {
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

            c.setType(null, success, fail);
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

            c.setType(undefined, success, fail);
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

            c.setType(s, success, fail);
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

                c.unsetType(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadType(success, fail);
        });

    });

	describe('#setConstraint', function() {
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
                    //assert.ok(retour, "The return of the setConstraintParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the constraint in database.");

                    constraint = c.constraint();
                    assert.deepEqual(constraint, s, "The constraint() does not return the exact constraint we give: "+JSON.stringify(constraint));
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.setConstraint(s, success2, fail2);
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

            c.setConstraint(null, success, fail);
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

            c.setConstraint(undefined, success, fail);
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

            c.setConstraint(s, success, fail);
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

                c.setConstraint(s, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadConstraint(success, fail);
		});

	});

	describe('#unsetConstraint', function() {
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
                    //assert.ok(retour, "The return of the unsetConstraintParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

                    constraint = c.constraint();
                    assert.deepEqual(constraint, null, "The constraint() does not return a null value after unsetting");
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unsetConstraint(success2, fail2);
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

                c.unsetConstraint(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadConstraint(success, fail);
		});

	});

	describe('#setDefaultValue', function() {
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

                c.setDefaultValue(s, success2, fail2);
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

            c.setDefaultValue(null, success, fail);
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

            c.setDefaultValue(undefined, success, fail);
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

            c.setDefaultValue(s, success, fail);
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

                c.setDefaultValue(s, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadDefaultValue(success, fail);
		});

	});

	describe('#unsetDefaultValue', function() {
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

                c.unsetDefaultValue(success2, fail2);
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

                c.unsetDefaultValue(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadDefaultValue(success, fail);
		});

	});
});