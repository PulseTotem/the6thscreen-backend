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

			var response : any = {
					"id":12,
					"name": "type",
					"complete": true
				};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(ParamType.getTableName(), cpt.getId().toString(), TypeParamType.getTableName()))
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

			var response : any = {
					"id":12,
					"name": "type",
					"complete": false
				};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(ParamType.getTableName(), cpt.getId().toString(), TypeParamType.getTableName()))
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
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new ParamType("toto", "blabla", 52,true);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"id": 52,
				"complete": true,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

    describe('#linkType', function() {
        it('should call the right request', function(done) {
            var c = new ParamType("toto","machin", 52);
            var s = new TypeParamType("toto", 42);

            var response1 : any = [];

            var restClientMock1 = nock(BackendConfig.getDBBaseURL())
                .get(BackendConfig.associationEndpoint(ParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName()))
                .reply(200, JSON.stringify(response1));

            var success = function() {
                var type = c.type();
                assert.equal(type, null, "The type is not a null value: "+JSON.stringify(type));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the type");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
                    .put(BackendConfig.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the linkTypeParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the type in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkType(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadType(success, fail);
        });
    });

    describe('#unlinkType', function() {
        it('should call the right request', function(done) {
            var c = new ParamType("toto","machin", 52);
            var s = new TypeParamType("toto", 42);

            var response1 : any = s.toJSONObject();

            var restClientMock1 = nock(BackendConfig.getDBBaseURL())
                .get(BackendConfig.associationEndpoint(ParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName()))
                .reply(200, JSON.stringify(response1));

            var success = function() {
                var type = c.type();
                assert.deepEqual(type, s, "The type is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the type");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
                    .delete(BackendConfig.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkTypeParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkType(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadType(success, fail);
        });

    });

	describe('#linkConstraint', function() {
		it('should call the right request', function(done) {
			var c = new ParamType("toto","machin", 52);
			var s = new ConstraintParamType("toto","tata" , "bla", 42);

			var response1 : any = [];

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ConstraintParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var constraint = c.constraint();
                assert.equal(constraint, null, "The constraint is not a null value: "+JSON.stringify(constraint));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the constraint");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
                    .put(BackendConfig.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), ConstraintParamType.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));


                var success2 = function() {
                    //assert.ok(retour, "The return of the linkConstraintParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the constraint in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkConstraint(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadConstraint(success, fail);
		});

	});

	describe('#unlinkConstraint', function() {
		it('should call the right request', function(done) {
			var c = new ParamType("toto","machin", 52);
			var s = new ConstraintParamType("toto","tata","", 42);

			var response1 : any = s.toJSONObject();

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ConstraintParamType.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var constraint = c.constraint();
                assert.deepEqual(constraint, s, "The constraint is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the constraint");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
                    .delete(BackendConfig.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), ConstraintParamType.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));


                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkConstraintParamType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkConstraint(s.getId(), success2, fail2);
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

			var response1 : any = [];

			var restClientMockAsso = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var defaultValue = c.defaultValue();
                assert.equal(defaultValue, null, "The defaultValue is not a null value: "+JSON.stringify(defaultValue));
                assert.ok(restClientMockAsso.isDone(), "The mock request has not been done to get the defaultValue");

	            var responseRead : any = s.toJSONObject();

	            var responseReadAsso : any = c.toJSONObject();

	            var restClientMockReadParamValue = nock(BackendConfig.getDBBaseURL())
		            .get(BackendConfig.associationEndpoint(ParamValue.getTableName(), s.getId().toString(), ParamType.getTableName()))
		            .reply(200, JSON.stringify(responseReadAsso));

	            var restClientMockRead = nock(BackendConfig.getDBBaseURL())
		            .get(BackendConfig.objectEndpoint(ParamValue.getTableName(), s.getId().toString()))
		            .reply(200, JSON.stringify(responseRead));

				var emptyResponse : any = {};

				var restClientMockAssoType = nock(BackendConfig.getDBBaseURL())
		            .put(BackendConfig.associatedObjectEndpoint(ParamValue.getTableName(), s.getId().toString(), ParamType.getTableName(), c.getId().toString()))
		            .reply(200, JSON.stringify(emptyResponse));

	            var restClientMockAssoDefaultValue = nock(BackendConfig.getDBBaseURL())
		            .put(BackendConfig.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), ParamValue.getTableName(), s.getId().toString()))
		            .reply(200, JSON.stringify(emptyResponse));



                var success2 = function() {
                    //assert.ok(retour, "The return of the setParamValue is false.");
                    assert.ok(restClientMockRead.isDone(), "The mock request has not been done to associate the defaultValue in database.");
	                assert.ok(restClientMockAssoType.isDone(), "The mock request has not been done to associate the defaultValue in database.");
	                assert.ok(restClientMockAssoDefaultValue.isDone(), "The mock request has not been done to associate the defaultValue in database.");
	                assert.ok(restClientMockReadParamValue.isDone(), "The mock request has not been done to associate the defaultValue in database.");
	                done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkDefaultValue(s.getId(), success2, fail2);
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

			var response1 : any = s.toJSONObject();

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var defaultValue = c.defaultValue();
                assert.deepEqual(defaultValue, s, "The defaultValue is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the defaultValue");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
                    .delete(BackendConfig.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), ParamValue.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));


                var success2 = function() {
                    //assert.ok(retour, "The return of the unsetParamValue is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
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

                c.unlinkDefaultValue(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadDefaultValue(success, fail);
		});
	});
});