/**
 * @author Christian Brel <brel@i3s.unice.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/Call.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('Call', function(){
	describe('#constructor', function() {
		it('should throw an error if the name is undefined', function(){
			assert.throws(
				function() {
					new Call(undefined);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the name is null', function(){
			assert.throws(
				function() {
					new Call(null);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the name is empty', function(){
			assert.throws(
				function() {
					new Call("");
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should store the name', function(){
			var name = "machin";
			var c = new Call(name);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the ID', function() {
			var id = 52;
			var c = new Call("bidule",52);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});
	});

	describe('#fromJSONobject', function() {
		it('should create the right object', function() {
			var json = {"id": 42,
				"name": "toto"
			};

			var callRetrieve = Call.fromJSONObject(json);
			var callExpected = new Call("toto",42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should throw an exception if the ID is undefined', function() {
			var json = {"name": "toto"
			};

			assert.throws(function() {
				Call.fromJSONObject(json);
			},
			ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function() {
			var json = {
				"name": "toto",
				"id": null
			};

			assert.throws(function() {
					Call.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is undefined', function() {
			var json = {"id": 52
			};

			assert.throws(function() {
					Call.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is null', function() {
			var json = {
				"name": null,
				"id": 42
			};

			assert.throws(function() {
					Call.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});
	});

	describe('#toJsonObject', function() {
		it('should create the expected JSON Object', function() {
			var c = new Call("toto", 52);
			var expected = {
				"name": "toto",
				"id": 52
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object ("+JSON.stringify(json)+") and the expected JSON ("+JSON.stringify(expected)+") do not match.");
		})
	});

	describe('#addParamValue', function() {
		it('should put the new ParamValue inside the array', function(done) {
			var c = new Call("toto", 52);
			var pv = new ParamValue("mavaleur",12);
			var spy = sinon.spy(pv, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), ParamValue.getTableName()))
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
                    .put(DatabaseConnection.associatedObjectEndpoint(Call.getTableName(), c.getId().toString(), ParamValue.getTableName(), pv.getId().toString()))
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
			var c = new Call("toto", 52);

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
			var c = new Call("toto", 52);

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
			var c = new Call("toto", 52);
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
			var c = new Call("toto", 52);
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
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), ParamValue.getTableName()))
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
			var c = new Call("toto", 52);
			var pv = new ParamValue("mavaleur",12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"value": "mavaleur",
						"id": 12
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(response1));

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
                    .delete(DatabaseConnection.associatedObjectEndpoint(Call.getTableName(), c.getId().toString(), ParamValue.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the removeParamValue is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramValue in database.");

                    paramValues = c.paramValues();
                    assert.deepEqual(paramValues, [], "The paramValues is not an empty array: "+JSON.stringify(paramValues));
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

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
			var c = new Call("toto", 52);

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
			var c = new Call("toto", 52);

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
			var c = new Call("toto", 52);
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
			var c = new Call("toto", 52);
			var pv = new ParamValue("toto",12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(response1));

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

	describe('#setProfil', function() {
		it('should set the given Profil', function(done) {
			var c = new Call("toto", 52);
			var p = new Profil("toto", "machin", 42);
			var spy = sinon.spy(p, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), Profil.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var profil = c.profil();
                assert.equal(profil, null, "The profil is not a null value: "+JSON.stringify(profil));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the profil");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(Call.getTableName(), c.getId().toString(), Profil.getTableName(), p.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the setProfil is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramValue in database.");

                    // normalement le lazy_loading est true : plus besoin de mock pour la requête
                    profil = c.profil();
                    assert.deepEqual(profil, p, "The profil() does not return the exact profil we give: "+JSON.stringify(profil));
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.setProfil(p, success2, fail2);

            };

            var fail = function(err) {
                done(err);
            };

            c.loadProfil(success, fail);

		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new Call("toto", 52);

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

            c.setProfil(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new Call("toto", 52);

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

            c.setProfil(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new Call("toto", 52);
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

            c.setProfil(p, success, fail);
		});

		it('should not allow to set a profil if there is already one', function(done) {
			var c = new Call("toto", 52);
			var p = new Profil("toto","machin", 13);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id": 1,
					"name": "toto",
					"description": "truc"
				}
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), Profil.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {

                var profil = c.profil();

                assert.ok(!!profil, "The profil has false value.");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the profil");

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

                c.setProfil(p, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadProfil(success, fail);
		});

	});

	describe('#unsetProfil', function() {
		it('should unset the Profil', function(done) {
			var c = new Call("toto", 52);
			var p = new Profil("toto", "machin", 42);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": p.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), Profil.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {

                var profil = c.profil();
                assert.deepEqual(profil, p, "The profil is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the profil");

                var spy = sinon.spy(profil, "desynchronize");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(Call.getTableName(), c.getId().toString(), Profil.getTableName(), p.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the unsetProfil is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramValue in database.");

                    profil = c.profil();
                    assert.deepEqual(profil, null, "The profil() does not return a null value after unsetting");
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unsetProfil(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadProfil(success, fail);

		});

		it('should not allow to unset a profil if there is none', function(done) {
			var c = new Call("toto", 52);

            var response1 : SequelizeRestfulResponse = {
                "status": "success",
                "data": []
            };

            var restClientMock1 = nock(DatabaseConnection.getBaseURL())
                .get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), Profil.getTableName()))
                .reply(200, JSON.stringify(response1));

            var success = function() {

                var profil = c.profil();

                assert.equal(profil, null, "The profil has a value not null: "+JSON.stringify(profil));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the profil");

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

                c.unsetProfil(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadProfil(success, fail);
		});

	});

	describe('#setCallType', function() {
		it('should set the given CallType', function(done) {
			var c = new Call("toto", 52);
			var ct = new CallType("tptp", "blabla",12)
			var spy = sinon.spy(ct, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), CallType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var calltype = c.callType();
                assert.equal(calltype, null, "The callType is not a null value: "+JSON.stringify(calltype));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the callType");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(Call.getTableName(), c.getId().toString(), CallType.getTableName(), ct.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the setCallType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramValue in database.");

                    calltype = c.callType();
                    assert.deepEqual(calltype, ct, "The calltype() does not return the exact calltype we give: "+JSON.stringify(calltype));
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.setCallType(ct, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadCallType(success, fail);
		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new Call("toto", 52);

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

            c.setCallType(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new Call("toto", 52);

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

            c.setCallType(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new Call("toto", 52);
			var ct = new CallType("machin","bidule")

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

            c.setCallType(ct, success, fail);
		});

		it('should not allow to set a callType if there is already one', function(done) {
			var c = new Call("toto", 52);
			var ct = new CallType("machin","bidule");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id": 1,
					"name": "toto",
					"description": "truc"
				}
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), CallType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {

                var calltype = c.callType();

                assert.ok(!!calltype, "The calltype has false value.");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the calltype");

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

                c.setCallType(ct, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadCallType(success, fail);
		});

	});

	describe('#unsetCallType', function() {
		it('should unset the Profil', function(done) {
			var c = new Call("toto", 52);
			var ct = new CallType("toto", "machin", 42);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": ct.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), CallType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var calltype = c.callType();
                assert.deepEqual(calltype, ct, "The calltype is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the calltype");
                var spy = sinon.spy(calltype, "desynchronize");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(Call.getTableName(), c.getId().toString(), CallType.getTableName(), ct.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the unsetCallType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramValue in database.");

                    calltype = c.callType();
                    assert.deepEqual(calltype, null, "The calltype() does not return a null value after unsetting");
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unsetCallType(success2, fail2);

            };

            var fail = function(err) {
                done(err);
            };

			c.loadCallType(success, fail);
		});

		it('should not allow to unset a profil if there is none', function(done) {
			var c = new Call("toto", 52);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), CallType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var calltype = c.callType();

                assert.equal(calltype, null, "The calltype has a value not null: "+JSON.stringify(calltype));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the calltype");

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

                c.unsetCallType(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadCallType(success, fail);


		});

	});
});