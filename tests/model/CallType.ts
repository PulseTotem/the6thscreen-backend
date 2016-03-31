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

	});

	describe('#toJsonObject', function() {
		it('should create the expected JSON Object', function() {
			var c = new CallType("toto","blabla", 52);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"id": 52,
				"complete": false,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object ("+JSON.stringify(json)+") and the expected JSON ("+JSON.stringify(expected)+") do not match.");
		})
	});

	describe('#checkCompleteness', function() {
		it('should consider the object as complete if it has an ID, a name, a complete source, a complete renderer, a rendererTheme and a complete zone', function(done) {
			var cpt = new CallType("toto","blabla", 52);

			var responseSource : any = {
					"id":12,
					"name": "source",
					"method": "bla",
					"complete": true
				};

			var responseRenderer : any = {
					"id":12,
					"name": "renderer",
					"complete": true
				};

			var responseRendererTheme : any = {
				"id":12,
				"name": "rendererTheme",
				"complete": true
			};

			var responseZone : any = {
					"id":12,
					"name": "zone",
					"complete": true
				};

			var restClientMockS = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(responseSource));

			var restClientMockR = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Renderer.getTableName()))
				.reply(200, JSON.stringify(responseRenderer));

			var restClientMockRT = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), RendererTheme.getTableName()))
				.reply(200, JSON.stringify(responseRendererTheme));

			var restClientMockZ = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(responseZone));

			var success = function() {
				assert.ok(restClientMockS.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockR.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockRT.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockZ.isDone(), "The mock request has not been done to get the type");
				assert.equal(cpt.isComplete(), true, "The object should be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should consider the object as complete if it has an ID, a name, a complete source, a complete renderer and an incomplete zone', function(done) {
			var cpt = new CallType("toto","blabla", 52);

			var responseSource : any = {
					"id":12,
					"name": "source",
					"method": "bla",
					"complete": true
				};

			var responseRenderer : any = {
					"id":12,
					"name": "renderer",
					"complete": true
				};

			var responseRendererTheme : any = {
				"id":12,
				"name": "rendererTheme",
				"complete": true
			};

			var responseZone : any = {
					"id":12,
					"name": "zone",
					"complete": false
				};

			var restClientMockS = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(responseSource));

			var restClientMockR = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Renderer.getTableName()))
				.reply(200, JSON.stringify(responseRenderer));

			var restClientMockRT = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), RendererTheme.getTableName()))
				.reply(200, JSON.stringify(responseRendererTheme));

			var restClientMockZ = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(responseZone));

			var success = function() {
				assert.ok(restClientMockS.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockR.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockRT.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockZ.isDone(), "The mock request has not been done to get the type");
				assert.equal(cpt.isComplete(), true, "The object should be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has an ID, a name, a complete source, an incomplete renderer and an complete zone', function(done) {
			var cpt = new CallType("toto","blabla", 52);

			var responseSource : any = {
					"id":12,
					"name": "source",
					"method": "bla",
					"complete": true
				};

			var responseRenderer : any = {
					"id":12,
					"name": "renderer",
					"complete": false
				};

			var responseRendererTheme : any = {
				"id":12,
				"name": "rendererTheme",
				"complete": true
			};

			var responseZone : any = {
					"id":12,
					"name": "zone",
					"complete": true
				};

			var restClientMockS = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(responseSource));

			var restClientMockR = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Renderer.getTableName()))
				.reply(200, JSON.stringify(responseRenderer));

			var restClientMockRT = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), RendererTheme.getTableName()))
				.reply(200, JSON.stringify(responseRendererTheme));

			var restClientMockZ = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(responseZone));

			var success = function() {
				assert.ok(restClientMockS.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockR.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockRT.isDone(), "The mock request has not been done to get the type");
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

			var responseSource : any = {
					"id":12,
					"name": "source",
					"method": "bla",
					"complete": false
				};

			var responseRenderer : any = {
					"id":12,
					"name": "renderer",
					"complete": true
				};

			var responseRendererTheme : any = {
				"id":12,
				"name": "rendererTheme",
				"complete": true
			};

			var responseZone : any = {
					"id":12,
					"name": "zone",
					"complete": true
				};

			var restClientMockS = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(responseSource));

			var restClientMockR = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Renderer.getTableName()))
				.reply(200, JSON.stringify(responseRenderer));

			var restClientMockRT = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), RendererTheme.getTableName()))
				.reply(200, JSON.stringify(responseRendererTheme));

			var restClientMockZ = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), cpt.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(responseZone));

			var success = function() {
				assert.ok(restClientMockS.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockR.isDone(), "The mock request has not been done to get the type");
				assert.ok(restClientMockRT.isDone(), "The mock request has not been done to get the type");
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
		it('should call the right request', function(done) {
			var c = new CallType("toto","machin", 52);
			var s = new Source("toto", "machin","titi", 12, false, 42);

			var response1 : any = [];

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var source = c.source();
                assert.equal(source, null, "The source is not a null value: "+JSON.stringify(source));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the source");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Source.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

	            var responseCall : any = [];

	            var restClientMockCall = nock(DatabaseConnection.getBaseURL())
		            .get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Call.getTableName()))
		            .reply(200, JSON.stringify(responseCall));

                var success2 = function() {
                    //assert.ok(retour, "The return of the linkSource is false.");
	                assert.ok(restClientMockCall.isDone(), "The mock request has not been done to retrieve calls in database.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the source in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkSource(s.getId(), success2, fail2);

            };

            var fail = function(err) {
                done(err);
            };

			c.loadSource(success, fail);
		});
	});

	describe('#unlinkSource', function() {
		it('should  call the right request', function(done) {
			var c = new CallType("toto","machin", 52);
			var s = new Source("toto", "machin","titi", 12, false, 42);

			var response1 : any = s.toJSONObject();

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var source = c.source();
                assert.deepEqual(source, s, "The source is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the source");

	            var responseCall : any = [];

	            var restClientMockCall = nock(DatabaseConnection.getBaseURL())
		            .get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Call.getTableName()))
		            .reply(200, JSON.stringify(responseCall));

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Source.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkSource is false.");
	                assert.ok(restClientMockCall.isDone(), "The mock request has not been done.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkSource(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadSource(success, fail);
		});
	});

	describe('#linkRenderer', function() {
		it('should call the right request', function(done) {
			var c = new CallType("toto","machin", 52);
			var r = new Renderer("renderer","blop",12);

			var response1 : any = [];

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Renderer.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {

                var renderer = c.renderer();
                assert.equal(renderer, null, "The renderer is not a null value: "+JSON.stringify(renderer));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the renderer");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Renderer.getTableName(), r.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));


                var success2 = function() {
                    //assert.ok(retour, "The return of the linkRenderer is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the renderer in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkRenderer(r.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadRenderer(success, fail);

		});

	});

	describe('#unlinkRenderer', function() {
		it('should call the right request', function(done) {
			var c = new CallType("toto","machin", 52);
			var s = new Renderer("toto", "machin", 42);

			var response1 : any = s.toJSONObject();

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Renderer.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var renderer = c.renderer();
                assert.deepEqual(renderer, s, "The renderer is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the renderer.");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Renderer.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkRenderer is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkRenderer(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadRenderer(success, fail);
		});

	});

	describe('#linkPolicy', function() {
		it('should call the right request', function(done) {
			var c = new CallType("toto","machin", 52);
			var r = new Policy("policy", "", 12);

			var response1 : any = [];

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Policy.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var policy = c.policy();
                assert.equal(policy, null, "The policy is not a null value: "+JSON.stringify(policy));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the policy");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Policy.getTableName(), r.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the linkPolicy is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the policy in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkPolicy(r.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadPolicy(success, fail);
		});

	});

	describe('#unlinkPolicy', function() {
		it('should call the right request', function(done) {
			var c = new CallType("toto","machin", 52);
			var s = new Policy("toto", "", 42);

			var response1 : any = s.toJSONObject();

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Policy.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var policy = c.policy();
                assert.deepEqual(policy, s, "The policy is not the expected value");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Policy.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));


                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkPolicy is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkPolicy(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadPolicy(success, fail);
		});
	});

	describe('#linkZone', function() {
		it('should call the right request', function(done) {
			var c = new CallType("toto","machin", 52);
			var r = new Zone("zone","toto",2, 3, 4, 5, 12);

			var response1 : any = [];

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var zone = c.zone();
                assert.equal(zone, null, "The zone is not a null value: "+JSON.stringify(zone));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the zone");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Zone.getTableName(), r.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));


                var success2 = function() {
                    //assert.ok(retour, "The return of the linkZone is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the zone in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkZone(r.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadZone(success, fail);
		});

	});

	describe('#unlinkZone', function() {
		it('should call the right request', function (done) {
			var c = new CallType("toto", "machin", 52);
			var s = new Zone("toto","tata",2,3,4,5, 42);

			var response1 : any = s.toJSONObject();

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Zone.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {

                var zone = c.zone();
                assert.deepEqual(zone, s, "The zone is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the zone");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Zone.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkZone is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkZone(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadZone(success, fail);
		});
	});
});