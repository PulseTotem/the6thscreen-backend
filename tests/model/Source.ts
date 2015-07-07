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
	describe('constructor', function () {
		it('should store the name', function () {
			var name = "machin";
			var c = new Source(name);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function () {
			var desc = "machin";
			var c = new Source("", desc);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the method', function () {
			var method = "machin";
			var c = new Source("", "", method);
			assert.equal(c.method(), method, "The method is not stored correctly.");
		});

		it('should store the refresh time', function () {
			var refreshTime = 34;
			var c = new Source("", "", "", refreshTime);
			assert.equal(c.refreshTime(), refreshTime, "The refreshTime is not stored correctly.");
		});

		it('should store the isStatic value', function () {
			var isStatic = true;
			var c = new Source("", "", "", 0, isStatic);
			assert.equal(c.isStatic(), isStatic, "The isStatic is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new Source("", "", "", 12, true, id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function () {
			var c = new Source("a", "v", "c", 12, true, 234, true);
			assert.equal(c.isComplete(), true, "The complete value is not stored.");
		});

		it('should assign a default false complete value', function () {
			var c = new Source();
			assert.equal(c.isComplete(), false, "The complete value is not stored.");
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 28,
				"name": "machin",
				"description": "desc",
				"method": "method",
				"refreshTime": 42,
				"isStatic": true,
				"complete": true
			};

			var userRetrieve = Source.fromJSONObject(json);
			var userExpected = new Source("machin", "desc", "method", 42, true, 28, true);

			assert.deepEqual(userRetrieve, userExpected, "The retrieve Source (" + userRetrieve + ") does not match with the expected one (" + userExpected + ")");
		});

		it('should create the right object even if it is partial', function () {
			var json = {
				"id": 28,
				"name": null,
				"description": "desc",
				"method": "",
				"refreshTime": 10,
				"isStatic": false,
				"complete": false
			};

			var userRetrieve = Source.fromJSONObject(json);
			var userExpected = new Source(null, "desc", "", 10, false, 28, false);

			assert.deepEqual(userRetrieve, userExpected, "The retrieve Source (" + userRetrieve + ") does not match with the expected one (" + userExpected + ")");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new Source("machin", "desc", "method", 32, true, 28, true);
			var expected = {
				"id": 28,
				"name": "machin",
				"description": "desc",
				"method": "method",
				"complete": true,
				"refreshTime": 32,
				"isStatic": true,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#checkCompleteness', function() {
		it('should consider the object as complete if it has an ID, a name, a method, a complete infotype and a complete service', function(done) {
			var cpt = new Source("machin", null, "method", 42, false, 28);

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "type",
					"complete": true
				}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), cpt.getId().toString(), InfoType.getTableName()))
				.reply(200, JSON.stringify(response));

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), cpt.getId().toString(), Service.getTableName()))
				.reply(200, JSON.stringify(response));

			var success = function() {
				assert.ok(restClientMock.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMock2.isDone(), "The mock2 request has not been done to get the type");
				assert.equal(cpt.isComplete(), true, "The object should be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has an ID, a name, a method, a complete service and an infotype which is not complete itself', function(done) {
			var cpt = new Source("machin", null, "method", 42, false, 28);

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "type",
					"complete": false
				}
			};

			var response2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "service",
					"complete": true
				}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), cpt.getId().toString(), InfoType.getTableName()))
				.reply(200, JSON.stringify(response));

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), cpt.getId().toString(), Service.getTableName()))
				.reply(200, JSON.stringify(response2));

			var success = function() {
				assert.ok(restClientMock.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMock2.isDone(), "The mock2 request has not been done to get the type");
				assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has an ID, a name, a method, a complete infotype and a service which is not complete itself', function(done) {
			var cpt = new Source("machin", null, "method", 42, false, 28);

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "type",
					"complete": true
				}
			};

			var response2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "service",
					"complete": false
				}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), cpt.getId().toString(), InfoType.getTableName()))
				.reply(200, JSON.stringify(response));

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), cpt.getId().toString(), Service.getTableName()))
				.reply(200, JSON.stringify(response2));

			var success = function() {
				assert.ok(restClientMock.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMock2.isDone(), "The mock2 request has not been done to get the type");
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

			var cpt = new Source("machin", null, "method", 43, false);

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

			var cpt = new Source("", null, "method", 43, false, 28);

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

			var cpt = new Source(null, null, "method", 43, false, 28);

			var success = function() {
				assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has an empty method', function(done) {
			nock.disableNetConnect();

			var cpt = new Source("test", null, "", 43, false, 28);

			var success = function() {
				assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has a null method', function(done) {
			nock.disableNetConnect();

			var cpt = new Source("test", null, null, 43, false, 28);

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

			var cpt = new Source();

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

	describe('#linkService', function () {
		it('should call the right request', function (done) {
			var c = new Source("machin", "desc", "method", 43, false, 28);
			var s = new Service("toto", "machin", "blabla", true, "provider", "", 42);

			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), c.getId().toString(), Service.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function () {
				var service = c.service();
				assert.equal(service, null, "The service is not a null value: " + JSON.stringify(service));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the service");

				var response2:SequelizeRestfulResponse = {
					"status": "success",
					"data": {}
				};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.put(DatabaseConnection.associatedObjectEndpoint(Source.getTableName(), c.getId().toString(), Service.getTableName(), s.getId().toString()))
					.reply(200, JSON.stringify(response2));

				var success2 = function () {
					//assert.ok(retour, "The return of the setInfoType is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the service in database.");
					done();
				};

				var fail2 = function (err) {
					done(err);
				};

				c.linkService(s.getId(), success2, fail2);
			};

			var fail = function (err) {
				done(err);
			};

			c.loadService(success, fail);
		});

	});

	describe('#unlinkService', function () {
		it('should call the right request', function (done) {
			var c = new Source("machin", "desc", "method", 43, false, 28);
			var s = new Service("toto", "machin", "blabla", true, "provider","", 42);

			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), c.getId().toString(), Service.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var service = c.service();
				assert.deepEqual(service, s, "The service is not the expected value");
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the service");
				var spy = sinon.spy(service, "desynchronize");

				var response2:SequelizeRestfulResponse = {
					"status": "success",
					"data": {}
				};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.delete(DatabaseConnection.associatedObjectEndpoint(Source.getTableName(), c.getId().toString(), Service.getTableName(), s.getId().toString()))
					.reply(200, JSON.stringify(response2));


				var success2 = function() {
					//assert.ok(retour, "The return of the unsetInfoType is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.unlinkService(s.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadService(success, fail);
		});
	});

	describe('#linkInfoType', function () {
		it('should call the right request', function (done) {
			var c = new Source("machin", "desc", "method", 43, false, 28);
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
                    //assert.ok(retour, "The return of the linkInfoType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the infoType in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkInfoType(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadInfoType(success, fail);
		});

	});

	describe('#unlinkInfoType', function () {
		it('should call the right request', function (done) {
			var c = new Source("machin", "desc", "method", 43, false, 28);
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
                    //assert.ok(retour, "The return of the unlinkInfoType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkInfoType(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadInfoType(success, fail);
		});

	});

	describe('#addParamType', function() {
		it('should call the right request', function(done) {
			var c = new Source("machin", "desc", "method", 43, false, 28);
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
	                done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addParamType(pv.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadParamTypes(success, fail);
		});
	});

	describe('#removeParamType', function() {
		it('should call the right request', function(done) {
			var c = new Source("machin", "desc", "method", 43, false, 28);
			var pv = new ParamType("mavaleur", "machin", 12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"name": "mavaleur",
						"description": "machin",
						"id": 12,
						"complete": false
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
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeParamType(pv.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadParamTypes(success, fail);
		});
	});

    describe('#addParamValue', function() {
        it('should call the right request', function(done) {
	        var c = new Source("machin", "desc", "method", 43, false, 28);
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
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addParamValue(pv.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadParamValues(success, fail);
        });
    });

	describe('#removeParamValue', function() {
		it('should call the right request', function(done) {
			var c = new Source("machin", "desc", "method", 43, false, 28);
			var pv = new ParamValue("mavaleur", 12);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"value": "mavaleur",
						"id": 12,
						"complete": false
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
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeParamValue(pv.getId(), success2, fail2);

            };

            var fail = function(err) {
                done(err);
            };

            c.loadParamValues(success, fail);
		});
	});

	describe('#updateAttribute', function () {
		it('should update the service when asking but not the object as it remains not complete', function (done) {
			var model = new Source("toto", "bla", "method", 43, false, 12);
			var s = new Service("toto", "machin", "blabla", true, "provider","", 42);

			var newInfo = {
				'id' : model.getId(),
				'method': 'linkService',
				'value': s.getId()
			};

			var responseReadSource : SequelizeRestfulResponse = {
				"status": "success",
				"data": model.toJSONObject()
			};

			var restClientMockReadSource = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.objectEndpoint(Source.getTableName(), model.getId().toString()))
				.reply(200, JSON.stringify(responseReadSource));

			var responseUpdate : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMockUpdate = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(Source.getTableName(), model.getId().toString(), Service.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(responseUpdate));

			var responseCheckAsso : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMockAssoService = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), model.getId().toString(), Service.getTableName()))
				.reply(200, JSON.stringify(responseCheckAsso));

			var restClientMockAssoInfoType = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), model.getId().toString(), InfoType.getTableName()))
				.reply(200, JSON.stringify(responseCheckAsso));

			var success : Function = function () {
				assert.ok(restClientMockReadSource.isDone(), "The source object is not read.");
				assert.ok(restClientMockUpdate.isDone(), "The request update has not been done.");
				assert.ok(restClientMockAssoService.isDone(), "The request for checking asso service has not been done.");
				assert.ok(restClientMockAssoInfoType.isDone(), "The request for checking asso infotype has not been done.");
				done();
			};

			var fail : Function = function (error) {
				done(error);
			};

			ModelItf.updateAttribute(Source, newInfo, success, fail);
		});

		it('should update the source to link a service when asking and update the source if it becomes complete', function (done) {
			var model = new Source("toto", "bla", "method", 43, false, 12);
			var modelUpdated = new Source("toto", "bla", "method", 43, false, 12, true);
			var s = new Service("toto", "machin", "blabla", true, "provider","", 42);

			var newInfo = {
				'id' : model.getId(),
				'method': 'linkService',
				'value': s.getId()
			};

			var responseReadSource : SequelizeRestfulResponse = {
				"status": "success",
				"data": model.toJSONObject()
			};

			var restClientMockReadSource = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.objectEndpoint(Source.getTableName(), model.getId().toString()))
				.reply(200, JSON.stringify(responseReadSource));

			var responseUpdate : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMockUpdate = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(Source.getTableName(), model.getId().toString(), Service.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(responseUpdate));

			var responseCheckAsso : SequelizeRestfulResponse = {
				"status": "success",
				"data": {"id": 12, "name": "toto", "complete": true}
			};

			var restClientMockAssoService = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), model.getId().toString(), Service.getTableName()))
				.reply(200, JSON.stringify(responseCheckAsso));

			var restClientMockAssoInfoType = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), model.getId().toString(), InfoType.getTableName()))
				.reply(200, JSON.stringify(responseCheckAsso));

			var responseReadSource : SequelizeRestfulResponse = {
				"status": "success",
				"data": model.toJSONObject()
			};

			var restClientMockUpdateSource = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.objectEndpoint(Source.getTableName(), model.getId().toString()), modelUpdated.toJSONObject())
				.reply(200, JSON.stringify(responseReadSource));

			var success : Function = function () {
				assert.ok(restClientMockReadSource.isDone(), "The source object is not read.");
				assert.ok(restClientMockUpdate.isDone(), "The request update has not been done.");
				assert.ok(restClientMockAssoService.isDone(), "The request for checking asso service has not been done.");
				assert.ok(restClientMockAssoInfoType.isDone(), "The request for checking asso infotype has not been done.");
				assert.ok(restClientMockUpdateSource.isDone(), "The request for update source has not been done.");
				done();
			};

			var fail : Function = function (error) {
				done(error);
			};

			ModelItf.updateAttribute(Source, newInfo, success, fail);
		});

		it('should update the source to unlink a service when asking and do not update the source', function (done) {
			var model = new Source("toto", "bla", "method", 43, false, 12);
			var s = new Service("toto", "machin", "blabla", true, "provider","", 42);

			var newInfo = {
				'id' : model.getId(),
				'method': 'unlinkService',
				'value': s.getId()
			};

			var responseReadSource : SequelizeRestfulResponse = {
				"status": "success",
				"data": model.toJSONObject()
			};

			var restClientMockReadSource = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.objectEndpoint(Source.getTableName(), model.getId().toString()))
				.reply(200, JSON.stringify(responseReadSource));

			var responseUpdate : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMockUpdate = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(Source.getTableName(), model.getId().toString(), Service.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(responseUpdate));

			var responseCheckAsso : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMockAssoService = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), model.getId().toString(), Service.getTableName()))
				.reply(200, JSON.stringify(responseCheckAsso));

			var restClientMockAssoInfoType = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), model.getId().toString(), InfoType.getTableName()))
				.reply(200, JSON.stringify(responseCheckAsso));


			var success : Function = function () {
				assert.ok(restClientMockReadSource.isDone(), "The source object is not read.");
				assert.ok(restClientMockUpdate.isDone(), "The request update has not been done.");
				assert.ok(restClientMockAssoService.isDone(), "The request for checking asso service has not been done.");
				assert.ok(restClientMockAssoInfoType.isDone(), "The request for checking asso infotype has not been done.");
				done();
			};

			var fail : Function = function (error) {
				done(error);
			};

			ModelItf.updateAttribute(Source, newInfo, success, fail);
		});

		it('should launch an exception if the information method does not exist', function (done) {
			var model = new Source("toto", "bla", "method", 43, false, 12);

			var responseReadSource : SequelizeRestfulResponse = {
				"status": "success",
				"data": model.toJSONObject()
			};

			var restClientMockReadSource = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.objectEndpoint(Source.getTableName(), model.getId().toString()))
				.reply(200, JSON.stringify(responseReadSource));

			var success = function() {
				done(new Error("Test failed."));
			};

			var info = {
				"id": 12,
				"method": "setID"
			};

			var fail = function(err) {
				assert.ok(restClientMockReadSource.isDone(), "The source object is not read.");
				assert.throws(function() {
						if(err) {
							throw err;
						}
					},
					ModelException, "The DataException has not been thrown.");
				done();
			};

			ModelItf.updateAttribute(Source, info, success, fail);
		});

		it('should update the source to add a ParamType when asking', function (done) {
			var model = new Source("toto", "bla", "method", 43, false, 12);
			var s = new ParamType("toto", "machin", 42);

			var newInfo = {
				'id' : model.getId(),
				'method': 'addParamType',
				'value': s.getId()
			};

			var responseReadSource : SequelizeRestfulResponse = {
				"status": "success",
				"data": model.toJSONObject()
			};

			var restClientMockReadSource = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.objectEndpoint(Source.getTableName(), model.getId().toString()))
				.reply(200, JSON.stringify(responseReadSource));

			var responseUpdate : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMockUpdate = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(Source.getTableName(), model.getId().toString(), ParamType.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(responseUpdate));

			var responseCheckAsso : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMockAssoService = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), model.getId().toString(), Service.getTableName()))
				.reply(200, JSON.stringify(responseCheckAsso));

			var restClientMockAssoInfoType = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Source.getTableName(), model.getId().toString(), InfoType.getTableName()))
				.reply(200, JSON.stringify(responseCheckAsso));

			var success : Function = function () {
				assert.ok(restClientMockReadSource.isDone(), "The source object is not read.");
				assert.ok(restClientMockUpdate.isDone(), "The request update has not been done.");
				assert.ok(restClientMockAssoService.isDone(), "The request for checking asso service has not been done.");
				assert.ok(restClientMockAssoInfoType.isDone(), "The request for checking asso infotype has not been done.");
				done();
			};

			var fail : Function = function (error) {
				done(error);
			};

			ModelItf.updateAttribute(Source, newInfo, success, fail);
		});
	});
});