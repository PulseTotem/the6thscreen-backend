/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/CallType.ts" />
/// <reference path="../../scripts/core/DatabaseConnection.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('CallType', function(){
	describe('#constructor', function() {
				it('should store the name', function(){
			var name = "machin";
			var c = new CallType(name,"");
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function(){
			var desc = "machin";
			var c = new CallType("",desc);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the ID', function() {
			var id = 52;
			var c = new CallType("","",id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function() {
			var c = new CallType("t","a",34, true);
			assert.equal(c.isComplete(), true, "The complete value is not stored.");
		});

		it('should assign a default false value for complete', function() {
			var c = new CallType();
			assert.equal(c.isComplete(), false, "The complete value is not stored.");
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

			var callRetrieve = CallType.fromJSONObject(json);
			var callExpected = new CallType("toto","blabla",42,true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve callType ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should create the right object even if it is partial', function() {
			var json = {
				"id": 42,
				"name": null,
				"description": "blabla",
				"complete": false
			};

			var callRetrieve = CallType.fromJSONObject(json);
			var callExpected = new CallType(null,"blabla",42,false);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve callType ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should throw an exception if the ID is undefined', function() {
			var json = {
				"name": "toto",
				"description": "blabla",
				"complete": false
			};

			assert.throws(function() {
					CallType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function() {
			var json = {
				"name": "toto",
				"description": "blabla",
				"id": null,
				"complete": false
			};

			assert.throws(function() {
					CallType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the complete value is undefined', function() {
			var json = {
				"name": "toto",
				"description": "blabla",
				"id": 34
			};

			assert.throws(function() {
					CallType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the complete value is null', function() {
			var json = {
				"name": "toto",
				"description": "blabla",
				"id": 343,
				"complete": null
			};

			assert.throws(function() {
					CallType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

	});

	describe('#toJsonObject', function() {
		it('should create the expected JSON Object', function() {
			var c = new CallType("toto","blabla", 52);
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

	describe('#checkCompleteness', function() {
		it('should consider the object as complete if it has an ID, a name, a complete source, a complete renderer and a complete zone', function(done) {
			var cpt = new CallType("toto","blabla", 52);

			var responseSource : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "source",
					"method": "bla",
					"complete": true
				}
			};

			var responseRenderer : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "renderer",
					"complete": true
				}
			};

			var responseZone : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "zone",
					"complete": true
				}
			};

			var restClientMockS = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(responseSource));

			var restClientMockR = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Renderer.getTableName()))
				.reply(200, JSON.stringify(responseRenderer));

			var restClientMockZ = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(responseZone));

			var success = function() {
				assert.ok(restClientMockS.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockR.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockZ.isDone(), "The mock request has not been done to get the type");
				assert.equal(cpt.isComplete(), true, "The object should be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has an ID, a name, a complete source, a complete renderer and an incomplete zone', function(done) {
			var cpt = new CallType("toto","blabla", 52);

			var responseSource : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "source",
					"method": "bla",
					"complete": true
				}
			};

			var responseRenderer : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "renderer",
					"complete": true
				}
			};

			var responseZone : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "zone",
					"complete": false
				}
			};

			var restClientMockS = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(responseSource));

			var restClientMockR = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Renderer.getTableName()))
				.reply(200, JSON.stringify(responseRenderer));

			var restClientMockZ = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(responseZone));

			var success = function() {
				assert.ok(restClientMockS.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockR.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockZ.isDone(), "The mock request has not been done to get the type");
				assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has an ID, a name, a complete source, an incomplete renderer and an complete zone', function(done) {
			var cpt = new CallType("toto","blabla", 52);

			var responseSource : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "source",
					"method": "bla",
					"complete": true
				}
			};

			var responseRenderer : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "renderer",
					"complete": false
				}
			};

			var responseZone : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "zone",
					"complete": true
				}
			};

			var restClientMockS = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(responseSource));

			var restClientMockR = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Renderer.getTableName()))
				.reply(200, JSON.stringify(responseRenderer));

			var restClientMockZ = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(responseZone));

			var success = function() {
				assert.ok(restClientMockS.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockR.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockZ.isDone(), "The mock request has not been done to get the type");
				assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has an ID, a name, an incomplete source, a complete renderer and an complete zone', function(done) {
			var cpt = new CallType("toto","blabla", 52);

			var responseSource : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "source",
					"method": "bla",
					"complete": false
				}
			};

			var responseRenderer : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "renderer",
					"complete": true
				}
			};

			var responseZone : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "zone",
					"complete": true
				}
			};

			var restClientMockS = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(responseSource));

			var restClientMockR = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Renderer.getTableName()))
				.reply(200, JSON.stringify(responseRenderer));

			var restClientMockZ = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(responseZone));

			var success = function() {
				assert.ok(restClientMockS.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockR.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockZ.isDone(), "The mock request has not been done to get the type");
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

			var cpt = new CallType("toto","blabla");

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

			var cpt = new CallType("","blabla", 52);

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

			var cpt = new CallType(null,"blabla", 52);

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

			var cpt = new CallType();

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

	describe('#linkSource', function() {
		it('should set the given source', function(done) {
			var c = new CallType("toto","machin", 52);
			var s = new Source("toto", "machin","titi", 42);
			var spy = sinon.spy(s, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var source = c.source();
                assert.equal(source, null, "The source is not a null value: "+JSON.stringify(source));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the source");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Source.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the linkSource is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the source in database.");

                    source = c.source();
                    assert.deepEqual(source, s, "The source() does not return the exact source we give: "+JSON.stringify(source));
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkSource(s, success2, fail2);

            };

            var fail = function(err) {
                done(err);
            };

			c.loadSource(success, fail);
		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);

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

            c.linkSource(null, success, fail);

		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);

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

            c.linkSource(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);
			var s = new Source("toto", "machin","titi");

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

            c.linkSource(s, success, fail);
		});

		it('should not allow to set a source if there is already one', function(done) {
			var c = new CallType("toto","machin", 52);
			var s = new Source("toto", "machin","titi", 42);
			var s2 = new Source("toto", "machin","titi", 89);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {

                var source = c.source();

                assert.ok(!!source, "The source has false value.");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the source");

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

                c.linkSource(s, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadSource(success, fail);
		});

	});

	describe('#unlinkSource', function() {
		it('should unset the Source', function(done) {
			var c = new CallType("toto","machin", 52);
			var s = new Source("toto", "machin","titi", 42);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var source = c.source();
                assert.deepEqual(source, s, "The source is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the source");
                var spy = sinon.spy(source, "desynchronize");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Source.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkSource is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

                    source = c.source();
                    assert.deepEqual(source, null, "The source() does not return a null value after unsetting");
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkSource(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadSource(success, fail);
		});

		it('should not allow to unset a Source if there is none', function(done) {
			var c = new CallType("toto","machin", 52);
			var s = new Source("toto", "machin","titi", 42);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var source = c.source();

                assert.equal(source, null, "The source has a value not null: "+JSON.stringify(source));
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

                c.unlinkSource(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadSource(success, fail);
		});

	});

	describe('#linkRenderer', function() {
		it('should set the given renderer', function(done) {
			var c = new CallType("toto","machin", 52);
			var r = new Renderer("renderer","blop",12);
			var spy = sinon.spy(r, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Renderer.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {

                var renderer = c.renderer();
                assert.equal(renderer, null, "The renderer is not a null value: "+JSON.stringify(renderer));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the renderer");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Renderer.getTableName(), r.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the linkRenderer is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the renderer in database.");
                    renderer = c.renderer();
                    assert.deepEqual(renderer, r, "The renderer() does not return the exact renderer we give: "+JSON.stringify(renderer));
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkRenderer(r, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadRenderer(success, fail);

		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);

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

            c.linkRenderer(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);

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

            c.linkRenderer(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);
			var s = new Renderer("toto", "machin");

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

            c.linkRenderer(s, success, fail);
		});

		it('should not allow to set a renderer if there is already one', function(done) {
			var c = new CallType("toto","machin", 52);
			var s = new Renderer("toto", "machin", 42);
			var s2 = new Renderer("tutu", "blop", 89);


			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Renderer.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var renderer = c.renderer();

                assert.ok(!!renderer, "The renderer has false value.");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the renderer");

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

                c.linkRenderer(s, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadRenderer(success, fail);
		});

	});

	describe('#unlinkRenderer', function() {
		it('should unset the Renderer', function(done) {
			var c = new CallType("toto","machin", 52);
			var s = new Renderer("toto", "machin", 42);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Renderer.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var renderer = c.renderer();
                assert.deepEqual(renderer, s, "The renderer is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the renderer.");
                var spy = sinon.spy(renderer, "desynchronize");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Renderer.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkRenderer is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

                    renderer = c.renderer();
                    assert.deepEqual(renderer, null, "The renderer() does not return a null value after unsetting");
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkRenderer(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadRenderer(success, fail);
		});

		it('should not allow to unset a Renderer if there is none', function(done) {
			var c = new CallType("toto","machin", 52);
			var s = new Renderer("toto", "machin",42);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Renderer.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var renderer = c.renderer();

                assert.equal(renderer, null, "The renderer has a value not null: "+JSON.stringify(renderer));
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

                c.unlinkRenderer(success2, fail2);

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

            c.loadRenderer(success, fail);
		});

	});

	describe('#linkReceivePolicy', function() {
		it('should set the given receivePolicy', function(done) {
			var c = new CallType("toto","machin", 52);
			var r = new ReceivePolicy("receivePolicy",12);
			var spy = sinon.spy(r, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), ReceivePolicy.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var receivePolicy = c.receivePolicy();
                assert.equal(receivePolicy, null, "The receivePolicy is not a null value: "+JSON.stringify(receivePolicy));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the receivePolicy");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), ReceivePolicy.getTableName(), r.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the linkReceivePolicy is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the receivePolicy in database.");


                    // normalement le lazy_loading est true : plus besoin de mock pour la requête
                    receivePolicy = c.receivePolicy();
                    assert.deepEqual(receivePolicy, r, "The receivePolicy() does not return the exact receivePolicy we give: "+JSON.stringify(receivePolicy));
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkReceivePolicy(r, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadReceivePolicy(success, fail);
		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);

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

            c.linkReceivePolicy(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);

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

            c.linkReceivePolicy(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);
			var s = new ReceivePolicy("toto");

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

            c.linkReceivePolicy(s, success, fail);
		});

		it('should not allow to set a receivePolicy if there is already one', function(done) {
			var c = new CallType("toto","machin", 52);
			var s = new ReceivePolicy("toto", 42);
			var s2 = new ReceivePolicy("tutu", 89);


			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), ReceivePolicy.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var receivePolicy = c.receivePolicy();

                assert.ok(!!receivePolicy, "The receivePolicy has false value.");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the receivePolicy");

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

                c.linkReceivePolicy(s, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadReceivePolicy(success, fail);

		});

	});

	describe('#unlinkReceivePolicy', function() {
		it('should unset the ReceivePolicy', function(done) {
			var c = new CallType("toto","machin", 52);
			var s = new ReceivePolicy("toto", 42);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), ReceivePolicy.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var receivePolicy = c.receivePolicy();
                assert.deepEqual(receivePolicy, s, "The receivePolicy is not the expected value");
                var spy = sinon.spy(receivePolicy, "desynchronize");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), ReceivePolicy.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkReceivePolicy is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

                    receivePolicy = c.receivePolicy();
                    assert.deepEqual(receivePolicy, null, "The receivePolicy() does not return a null value after unsetting");
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkReceivePolicy(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadReceivePolicy(success, fail);
		});

		it('should not allow to unset a ReceivePolicy if there is none', function(done) {
			var c = new CallType("toto","machin", 52);
			var s = new ReceivePolicy("toto",42);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), ReceivePolicy.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var receivePolicy = c.receivePolicy();

                assert.equal(receivePolicy, null, "The receivePolicy has a value not null: "+JSON.stringify(receivePolicy));
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

                c.unlinkReceivePolicy(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadReceivePolicy(success, fail);
		});

	});

	describe('#linkRenderPolicy', function() {
		it('should set the given renderPolicy', function(done) {
			var c = new CallType("toto","machin", 52);
			var r = new RenderPolicy("renderPolicy","toto",12);
			var spy = sinon.spy(r, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), RenderPolicy.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var renderPolicy = c.renderPolicy();
                assert.equal(renderPolicy, null, "The renderPolicy is not a null value: "+JSON.stringify(renderPolicy));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the renderPolicy");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), RenderPolicy.getTableName(), r.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the linkRenderPolicy is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the renderPolicy in database.");

                    renderPolicy = c.renderPolicy();
                    assert.deepEqual(renderPolicy, r, "The renderPolicy() does not return the exact renderPolicy we give: "+JSON.stringify(renderPolicy));
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkRenderPolicy(r, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadRenderPolicy(success, fail);

		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);

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

            c.linkRenderPolicy(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);

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

            c.linkRenderPolicy(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);
			var s = new RenderPolicy("toto","t");

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

            c.linkRenderPolicy(s, success, fail);
		});

		it('should not allow to set a renderPolicy if there is already one', function(done) {
			var c = new CallType("toto","machin", 52);
			var s = new RenderPolicy("toto","tata", 42);
			var s2 = new RenderPolicy("tutu","tata", 89);


			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), RenderPolicy.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var renderPolicy = c.renderPolicy();
                assert.ok(!!renderPolicy, "The renderPolicy has false value: "+JSON.stringify(renderPolicy)+" .");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the renderPolicy");

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

                c.linkRenderPolicy(s, success2, fail2);
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

            c.loadRenderPolicy(success, fail);

		});

	});

	describe('#unlinkRenderPolicy', function() {
		it('should unset the RenderPolicy', function (done) {
			var c = new CallType("toto", "machin", 52);
			var s = new RenderPolicy("toto","tata", 42);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), RenderPolicy.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var renderPolicy = c.renderPolicy();
                assert.deepEqual(renderPolicy, s, "The renderPolicy is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the renderPolicy");
                var spy = sinon.spy(renderPolicy, "desynchronize");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), RenderPolicy.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkRenderPolicy is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

                    renderPolicy = c.renderPolicy();
                    assert.deepEqual(renderPolicy, null, "The renderPolicy() does not return a null value after unsetting");
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkRenderPolicy(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadRenderPolicy(success, fail);
		});

		it('should not allow to unset a renderPolicy if there is none', function (done) {
			var c = new CallType("toto", "machin", 52);
			var s = new RenderPolicy("toto", "tata", 42);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), RenderPolicy.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var renderPolicy = c.renderPolicy();

                assert.equal(renderPolicy, null, "The renderPolicy has a value not null: " + JSON.stringify(renderPolicy));
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

                c.unlinkRenderPolicy(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadRenderPolicy(success, fail);
		});
	});

	describe('#linkZone', function() {
		it('should set the given zone', function(done) {
			var c = new CallType("toto","machin", 52);
			var r = new Zone("zone","toto",2, 3, 4, 5, 12);
			var spy = sinon.spy(r, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var zone = c.zone();
                assert.equal(zone, null, "The zone is not a null value: "+JSON.stringify(zone));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the zone");

                var reponse2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Zone.getTableName(), r.getId().toString()))
                    .reply(200, JSON.stringify(reponse2));


                var success2 = function() {
                    //assert.ok(retour, "The return of the linkZone is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the zone in database.");

                    zone = c.zone();
                    assert.deepEqual(zone, r, "The zone() does not return the exact zone we give: "+JSON.stringify(zone));
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkZone(r, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadZone(success, fail);
		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);

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

            c.linkZone(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);

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

            c.linkZone(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);
			var s = new Zone("toto","t",2,3,4,5);

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

            c.linkZone(s, success, fail);
		});

		it('should not allow to set a zone if there is already one', function(done) {
			var c = new CallType("toto","machin", 52);
			var s = new Zone("toto","tata",2,3,4,5, 42);
			var s2 = new Zone("tutu","tata",2,3,4,5, 89);


			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var zone = c.zone();

                assert.ok(!!zone, "The zone has false value: "+JSON.stringify(zone)+" .");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the zone");

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

                c.linkZone(s, success2, fail2);

            };

            var fail = function(err) {
                done(err);
            };

            c.loadZone(success, fail);
		});

	});

	describe('#unlinkZone', function() {
		it('should unset the Zone', function (done) {
			var c = new CallType("toto", "machin", 52);
			var s = new Zone("toto","tata",2,3,4,5, 42);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {

                var zone = c.zone();
                assert.deepEqual(zone, s, "The zone is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the zone");
                var spy = sinon.spy(zone, "desynchronize");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Zone.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkZone is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

                    zone = c.zone();
                    assert.deepEqual(zone, null, "The zone() does not return a null value after unsetting");
                    assert.ok(spy.calledOnce, "The desynchronize method was not called once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkZone(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadZone(success, fail);
		});

		it('should not allow to unset a zone if there is none', function (done) {
			var c = new CallType("toto", "machin", 52);
			var s = new Zone("toto", "tata",2,3,4,5, 42);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var zone = c.zone();

                assert.equal(zone, null, "The zone has a value not null: " + JSON.stringify(zone));
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

                c.unlinkZone(success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadZone(success, fail);
		});
	});
});