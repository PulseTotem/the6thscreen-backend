/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/ParamValue.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('ParamValue', function() {
	describe('#constructor', function () {
		it('should throw an error if the name is undefined', function(){
			assert.throws(
				function() {
					new ParamValue(undefined);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the name is null', function(){
			assert.throws(
				function() {
					new ParamValue(null);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the name is empty', function(){
			assert.throws(
				function() {
					new ParamValue("");
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should store the value', function () {
			var value = "false";
			var c = new ParamValue(value);
			assert.equal(c.value(), value, "The value is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new ParamValue("bidule", 52);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {"id": 42,
				"value": "toto"
			};

			var callRetrieve = ParamValue.fromJSONObject(json);
			var callExpected = new ParamValue("toto", 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});

		it('should throw an exception if the ID is undefined', function () {
			var json = {"value": "toto"
			};

			assert.throws(function () {
					ParamValue.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function () {
			var json = {
				"value": "toto",
				"id": null
			};

			assert.throws(function () {
					ParamValue.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the value is undefined', function () {
			var json = {"id": 52
			};

			assert.throws(function () {
					ParamValue.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the value is null', function () {
			var json = {
				"value": null,
				"id": 42
			};

			assert.throws(function () {
					ParamValue.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new ParamValue("toto", 52);
			var expected = {
				"value": "toto",
				"id": 52
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#setParamType', function() {
		it('should set the given ParamType', function(done) {
			var c = new ParamValue("toto", 52);
			var p = new ParamType("toto", "machin", 42);
			var spy = sinon.spy(p, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamValue.getTableName(), c.getId().toString(), ParamType.getTableName()))
				.reply(200, JSON.stringify(response1));


            var success = function() {
                var paramType = c.paramType();
                assert.equal(paramType, null, "The paramType is not a null value: "+JSON.stringify(paramType));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramType");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(ParamValue.getTableName(), c.getId().toString(), ParamType.getTableName(), p.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the setParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramValue in database.");

                    paramType = c.paramType();
                    assert.deepEqual(paramType, p, "The paramType() does not return the exact paramType we give: "+JSON.stringify(paramType));
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.setParamType(p, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadParamType(success, fail);
		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new ParamValue("toto", 52);

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

            c.setParamType(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new ParamValue("toto", 52);

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

            c.setParamType(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new ParamValue("toto", 52);
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

            c.setParamType(p, success, fail);
		});

		it('should not allow to set a paramType if there is already one', function(done) {
			var c = new ParamValue("toto", 52);
			var p = new ParamType("toto","machin", 13);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id": 1,
					"name": "toto",
					"description": "truc"
				}
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamValue.getTableName(), c.getId().toString(), ParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var paramType = c.paramType();

                assert.ok(!!paramType, "The paramType has false value.");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramType");

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

                c.setParamType(p, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadParamType(success, fail);
		});

	});

	describe('#unsetParamType', function() {
		it('should unset the ParamType', function(done) {
			var c = new ParamValue("toto", 52);
			var p = new ParamType("toto", "machin", 42);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": p.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamValue.getTableName(), c.getId().toString(), ParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var paramType = c.paramType();
                assert.deepEqual(paramType, p, "The paramType is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramType");

                var spy = sinon.spy(paramType, "desynchronize");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(ParamValue.getTableName(), c.getId().toString(), ParamType.getTableName(), p.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the unsetParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramValue in database.");

                    paramType = c.paramType();
                    assert.deepEqual(paramType, null, "The paramType() does not return a null value after unsetting");
                    assert.ok(spy.calledOnce, "The desynchronize method was not paramValueed once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unsetParamType(success2, fail2);
            };

            var fail = function(err) {
                done();
            };

			c.loadParamType(success, fail);
		});

		it('should not allow to unset a paramType if there is none', function(done) {
			var c = new ParamValue("toto", 52);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamValue.getTableName(), c.getId().toString(), ParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var paramType = c.paramType();

                assert.equal(paramType, null, "The paramType has a value not null: "+JSON.stringify(paramType));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramType");

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

                c.unsetParamType(success2, fail2);

            };

            var fail = function(err) {
                done(err);
            };

			c.loadParamType(success, fail);
		});

	});
});
