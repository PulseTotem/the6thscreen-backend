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
		it('should store the name', function(){
			var name = "machin";
			var c = new Call(name);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the ID', function() {
			var id = 52;
			var c = new Call("",52);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete attribute', function() {
			var c = new Call("",52,true);
			assert.equal(c.isComplete(), true, "The complete attribute is not stored.");
		});

		it('should assign false to the complete attribute by default', function() {
			var c = new Call();
			assert.equal(c.isComplete(), false, "The complete attribute is not stored.");
		});
	});

	describe('#checkCompleteness', function() {
		it('should consider the object as complete if it has an ID, a name, a complete callType', function(done) {
			var cpt = new Call("tete",52);

			var responseCallType : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "calltype",
					"complete": true
				}
			};

			var restClientMockCT = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), cpt.getId().toString(), CallType.getTableName()))
				.reply(200, JSON.stringify(responseCallType));

			var success = function() {
				assert.ok(restClientMockCT.isDone(), "The mock request has not been done to get the type");
				assert.equal(cpt.isComplete(), true, "The object should be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has an ID, a name and an incomplete calltype', function(done) {
			var cpt = new Call("tete",52);

			var responseCallType : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "calltype",
					"complete": false
				}
			};

			var restClientMockCT = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), cpt.getId().toString(), CallType.getTableName()))
				.reply(200, JSON.stringify(responseCallType));

			var success = function() {
				assert.ok(restClientMockCT.isDone(), "The mock request has not been done to get the type");
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

			var cpt = new Call("tete");

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

			var cpt = new Call("",52);

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

			var cpt = new Call(null,52);

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

			var cpt = new Call();

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

	describe('#fromJSONobject', function() {
		it('should create the right object', function() {
			var json = {
				"id": 42,
				"name": "toto",
				"complete": true
			};

			var callRetrieve = Call.fromJSONObject(json);
			var callExpected = new Call("toto",42,true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should create the right object even if it is not complete', function() {
			var json = {
				"id": 42,
				"name": "",
				"complete": false
			};

			var callRetrieve = Call.fromJSONObject(json);
			var callExpected = new Call("",42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});
	});

	describe('#toJsonObject', function() {
		it('should create the expected JSON Object', function() {
			var c = new Call("toto", 52);
			var expected = {
				"name": "toto",
				"id": 52,
				"complete": false,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object ("+JSON.stringify(json)+") and the expected JSON ("+JSON.stringify(expected)+") do not match.");
		})
	});

	describe('#addParamValue', function() {
		it('should call the right request', function(done) {
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
			var c = new Call("toto", 52);
			var pv = new ParamValue("mavaleur",12);

			var response1 : SequelizeRestfulResponse = {
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

	describe('#linkCallType', function() {
		it('should call the right request', function(done) {
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
                    //assert.ok(retour, "The return of the linkCallType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramValue in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkCallType(ct.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadCallType(success, fail);
		});

	});

	describe('#unlinkCallType', function() {
		it('should call the right request', function(done) {
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
                    //assert.ok(retour, "The return of the unlinkCallType is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramValue in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkCallType(ct.getId(), success2, fail2);

            };

            var fail = function(err) {
                done(err);
            };

			c.loadCallType(success, fail);
		});
	});
});