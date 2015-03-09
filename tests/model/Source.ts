/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/Source.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('Source', function() {
		it('should store the name', function () {
			var name = "machin";
			var c = new Source(name, "ser", "desc", "host", 4242, 12);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the service', function () {
			var service = "machin";
			var c = new Source("machin", service, "desc", "host", 4242, 12);
			assert.equal(c.service(), service, "The service is not stored correctly.");
		});

		it('should store the description', function () {
			var desc = "machin";
			var c = new Source("machin", "ser", desc, "host", 4242, 12);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the host', function () {
			var host = "machin";
			var c = new Source("machin", "ser", "desc", host, 4242, 12);
			assert.equal(c.host(), host, "The host is not stored correctly.");
		});

		it('should store the port', function () {
			var port = 12;
			var c = new Source("machin", "ser", "desc", "host", port, 12);
			assert.equal(c.port(), port, "The port is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new Source("machin", "ser", "desc", "host", 4242, id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 28,
				"name": "machin",
				"service": "ser",
				"description": "desc",
				"host": "host",
				"port": 4242
			};

			var userRetrieve = Source.fromJSONObject(json);
			var userExpected = new Source("machin", "ser", "desc", "host", 4242, 28);

			assert.deepEqual(userRetrieve, userExpected, "The retrieve Source (" + userRetrieve + ") does not match with the expected one (" + userExpected + ")");
		});

		it('should throw an exception if the ID is undefined', function () {
			var json = {
				"name": "machin",
				"service": "ser",
				"description": "desc",
				"host": "host",
				"port": 4242
			};

			assert.throws(function () {
					Source.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function () {
			var json = {
				"id": null,
				"name": "machin",
				"service": "ser",
				"description": "desc",
				"host": "host",
				"port": 4242
			};

			assert.throws(function () {
					Source.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is undefined', function () {
			var json = {
				"id": 28,
				"service": "ser",
				"description": "desc",
				"host": "host",
				"port": 4242
			};

			assert.throws(function () {
					Source.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is null', function () {
			var json = {
				"id": 28,
				"name": null,
				"service": "ser",
				"description": "desc",
				"host": "host",
				"port": 4242
			};

			assert.throws(function () {
					Source.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the service is undefined', function () {
			var json = {
				"id": 28,
				"name": "machin",
				"description": "desc",
				"host": "host",
				"port": 4242
			};

			assert.throws(function () {
					Source.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the service is null', function () {
			var json = {
				"id": 28,
				"name": "machin",
				"service": null,
				"description": "desc",
				"host": "host",
				"port": 4242
			};

			assert.throws(function () {
					Source.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the description is undefined', function () {
			var json = {
				"id": 28,
				"name": "machin",
				"service": "ser",
				"host": "host",
				"port": 4242
			};

			assert.throws(function () {
					Source.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the description is null', function () {
			var json = {
				"id": 28,
				"name": "machin",
				"service": "ser",
				"description": null,
				"host": "host",
				"port": 4242
			};

			assert.throws(function () {
					Source.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the host is undefined', function () {
			var json = {
				"id": 28,
				"name": "machin",
				"service": "ser",
				"description": "desc",
				"port": 4242
			};

			assert.throws(function () {
					Source.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the host is null', function () {
			var json = {
				"id": 28,
				"name": "machin",
				"service": "ser",
				"description": "desc",
				"host": null,
				"port": 4242
			};

			assert.throws(function () {
					Source.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the port is undefined', function () {
			var json = {
				"id": 28,
				"name": "machin",
				"service": "ser",
				"description": "desc",
				"host": "machin"
			};

			assert.throws(function () {
					Source.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the port is null', function () {
			var json = {
				"id": 28,
				"name": "machin",
				"service": "ser",
				"description": "desc",
				"host": "machin",
				"port": null
			};

			assert.throws(function () {
					Source.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new Source("machin", "ser", "desc", "host", 4242, 28);
			var expected = {
				"id": 28,
				"name": "machin",
				"service": "ser",
				"description": "desc",
				"host": "host",
				"port": 4242
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#setInfoType', function () {
		it('should set the given infoType', function (done) {
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);
			var s = new InfoType("toto", 42);
			var spy = sinon.spy(s, "desynchronize");

			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), c.getId().toString(), InfoType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var infoType = c.infoType();
                assert.equal(infoType, null, "The infoType is not a null value: " + JSON.stringify(infoType));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the infoType");

                var response2:SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(Source.getTableName(), c.getId().toString(), InfoType.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the setInfoType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the infoType in database.");

                    infoType = c.infoType();
                    assert.deepEqual(infoType, s, "The infoType() does not return the exact infoType we give: " + JSON.stringify(infoType));
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.setInfoType(s, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadInfoType(success, fail);
		});

		it('should not allow to add a null object', function (done) {
			nock.disableNetConnect();
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);

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

            c.setInfoType(null, success, fail);
		});

		it('should not allow to add an undefined object', function (done) {
			nock.disableNetConnect();
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);

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

            c.setInfoType(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function (done) {
			nock.disableNetConnect();
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);
			var s = new InfoType("toto");

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

            c.setInfoType(s, success, fail);
		});

		it('should not allow to set a infoType if there is already one', function (done) {
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);
			var s = new InfoType("toto", 42);
			var s2 = new InfoType("tutu", 89);


			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), c.getId().toString(), InfoType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var infoType = c.infoType();

                assert.ok(!!infoType, "The infoType has false value.");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the infoType");

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

                c.setInfoType(s, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadInfoType(success, fail);
		});

	});

	describe('#unsetInfoType', function () {
		it('should unset the InfoType', function (done) {
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);
			var s = new InfoType("toto", 42);

			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), c.getId().toString(), InfoType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var infoType = c.infoType();
                assert.deepEqual(infoType, s, "The infoType is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the infoType");
                var spy = sinon.spy(infoType, "desynchronize");

                var response2:SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(Source.getTableName(), c.getId().toString(), InfoType.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the unsetInfoType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

                    infoType = c.infoType();
                    assert.deepEqual(infoType, null, "The infoType() does not return a null value after unsetting");
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unsetInfoType(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadInfoType(success, fail);
		});

		it('should not allow to unset a profil if there is none', function (done) {
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);
			var s = new InfoType("toto", 42);

			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), c.getId().toString(), InfoType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var infoType = c.infoType();

                assert.equal(infoType, null, "The infoType has a value not null: " + JSON.stringify(infoType));
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

                c.unsetInfoType(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadInfoType(success, fail);
		});

	});

	describe('#addParamType', function() {
		it('should put the new ParamType inside the array', function(done) {
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);
			var pv = new ParamType("mavaleur", "toto", 12);
			var spy = sinon.spy(pv, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), c.getId().toString(), ParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var paramTypes = c.paramTypes();

                assert.deepEqual(paramTypes, [], "The paramType is not an empty array: "+JSON.stringify(paramTypes));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramTypes");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(Source.getTableName(), c.getId().toString(), ParamType.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the addParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramType in database.");

                    paramTypes = c.paramTypes();
                    var expected = [pv];
                    assert.deepEqual(paramTypes, expected, "The paramTypes is not an array containing only the added paramType: "+JSON.stringify(paramTypes));
                    assert.ok(spy.calledOnce, "The desynchronize method was not paramTypeed once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addParamType(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadParamTypes(success, fail);
		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);

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

            c.addParamType(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);

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

            c.addParamType(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);
			var p = new ParamType("bidule","machin");

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

            c.addParamType(p, success, fail);
		});

		it('should not allow to put an already existing object', function(done) {
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);
			var pv = new ParamType("toto", "machin", 13);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"id":13,
						"name": "toto",
						"description": "machin"
					},
					{
						"id": 14,
						"name": "titi",
						"description": "blop"
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), c.getId().toString(), ParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var paramTypes = c.paramTypes();

                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramTypes");

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

                c.addParamType(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadParamTypes(success, fail);
		});

	});

	describe('#removeParamType', function() {
		it('should remove the ParamType from the array', function(done) {
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);
			var pv = new ParamType("mavaleur", "machin", 12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"name": "mavaleur",
						"description": "machin",
						"id": 12
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), c.getId().toString(), ParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var paramTypes = c.paramTypes();

                assert.deepEqual(paramTypes, [pv], "The paramType array is not an array fill only with PV: "+JSON.stringify(paramTypes));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramTypes");

                var spy = sinon.spy(pv, "desynchronize");
                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(Source.getTableName(), c.getId().toString(), ParamType.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the removeParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramType in database.");

                    paramTypes = c.paramTypes();
                    assert.deepEqual(paramTypes, [], "The paramTypes is not an empty array: "+JSON.stringify(paramTypes));
                    assert.ok(spy.calledOnce, "The desynchronize method was not paramTypeed once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeParamType(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadParamTypes(success, fail);
		});

		it('should not allow to remove a null object', function(done) {
			nock.disableNetConnect();
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);

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

            c.removeParamType(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);

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

            c.removeParamType(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);
			var p = new ParamType("bidule","la");

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

            c.removeParamType(p, success, fail);
		});

		it('should not allow to remove an object which is not linked', function(done) {
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);
			var pv = new ParamType("toto", "machn", 12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), c.getId().toString(), ParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var paramTypes = c.paramTypes();

                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramTypes");

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

                c.removeParamType(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadParamTypes(success, fail);
		});

	});

    describe('#addParamValue', function() {
        it('should put the new ParamValue inside the array', function(done) {
            var c = new Source("bidule", "ser", "desc", "host", 4242, 12);
            var pv = new ParamValue("mavaleur",12);
            var spy = sinon.spy(pv, "desynchronize");

            var response1 : SequelizeRestfulResponse = {
                "status": "success",
                "data": []
            };

            var restClientMock1 = nock(DatabaseConnection.getBaseURL())
                .get(DatabaseConnection.associationEndpoint(Source.getTableName(), c.getId().toString(), ParamValue.getTableName()))
                .reply(200, JSON.stringify(response1));

            var success = function() {
                var paramValues = c.paramValues();
                assert.deepEqual(paramValues, [], "The paramValue is not an empty array: "+JSON.stringify(paramValues));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramValues");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(Source.getTableName(), c.getId().toString(), ParamValue.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the addParamValue is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramValue in database.");

                    paramValues = c.paramValues();
                    var expected = [pv];
                    assert.deepEqual(paramValues, expected, "The paramValues is not an array containing only the added paramValue: "+JSON.stringify(paramValues));
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addParamValue(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadParamValues(success, fail);
        });

        it('should not allow to add a null object', function(done) {
            nock.disableNetConnect();
            var c = new Source("bidule", "ser", "desc", "host", 4242, 12);

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

            c.addParamValue(null, success, fail);
        });

        it('should not allow to add an undefined object', function(done) {
            nock.disableNetConnect();
            var c = new Source("bidule", "ser", "desc", "host", 4242, 12);

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

            c.addParamValue(undefined, success, fail);

        });

        it('should not allow to add a object which is not yet created', function(done) {
            nock.disableNetConnect();
            var c = new Source("bidule", "ser", "desc", "host", 4242, 12);
            var p = new ParamValue("bidule");

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

            c.addParamValue(p, success, fail);
        });

        it('should not allow to put an already existing object', function(done) {
            var c = new Source("bidule", "ser", "desc", "host", 4242, 12);
            var pv = new ParamValue("toto",13);

            var response1 : SequelizeRestfulResponse = {
                "status": "success",
                "data": [
                    {
                        "id":13,
                        "value": "toto"
                    },
                    {
                        "id": 14,
                        "value": "titi"
                    }
                ]
            };

            var restClientMock1 = nock(DatabaseConnection.getBaseURL())
                .get(DatabaseConnection.associationEndpoint(Source.getTableName(), c.getId().toString(), ParamValue.getTableName()))
                .reply(200, JSON.stringify(response1));

            var success = function() {
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramValues");

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

                c.addParamValue(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadParamValues(success, fail);


        });

    });

	describe('#removeParamValue', function() {
		it('should remove the ParamValue from the array', function(done) {
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);
			var pv = new ParamValue("mavaleur", 12);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"value": "mavaleur",
						"id": 12
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(reponse1));

            var success = function() {
                var paramValues = c.paramValues();

                assert.deepEqual(paramValues, [pv], "The paramValue array is not an array fill only with PV: "+JSON.stringify(paramValues));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramValues");

                var spy = sinon.spy(pv, "desynchronize");
                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(Source.getTableName(), c.getId().toString(), ParamValue.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the removeParamValue is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramValue in database.");

                    paramValues = c.paramValues();
                    assert.deepEqual(paramValues, [], "The paramValues is not an empty array: "+JSON.stringify(paramValues));
                    assert.ok(spy.calledOnce, "The desynchronize method was not paramValueed once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeParamValue(pv, success2, fail2);

            };

            var fail = function(err) {
                done(err);
            };

            c.loadParamValues(success, fail);
		});

		it('should not allow to remove a null object', function(done) {
			nock.disableNetConnect();
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);

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

            c.removeParamValue(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);

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

            c.removeParamValue(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);
			var p = new ParamValue("bidule");

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

            c.removeParamValue(p, success, fail);
		});

		it('should not allow to remove an object which is not linked', function(done) {
			var c = new Source("bidule", "ser", "desc", "host", 4242, 12);
			var pv = new ParamValue("toto", 12);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(reponse1));

            var success = function() {
                var paramValues = c.paramValues();

                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramValues");

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

                c.removeParamValue(pv, success2, fail2);

            };

            var fail = function(err) {
                done(err);
            };

            c.loadParamValues(success, fail);
		});

	});
});