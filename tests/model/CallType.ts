/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../app/scripts/model/CallType.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('Call', function(){
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
	});

	describe('#fromJSONobject', function() {
		it('should create the right object', function() {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "blabla"
			};

			var callRetrieve = CallType.fromJSONObject(json);
			var callExpected = new CallType("toto","blabla",42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve callType ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should throw an exception if the ID is undefined', function() {
			var json = {
				"name": "toto",
				"description": "blabla"
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
				"id": null
			};

			assert.throws(function() {
					CallType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is undefined', function() {
			var json = {
				"id": 52,
				"description": "blabla"
			};

			assert.throws(function() {
					CallType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is null', function() {
			var json = {
				"name": null,
				"description": "blabla",
				"id": 42
			};

			assert.throws(function() {
					CallType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the description is undefined', function() {
			var json = {
				"id": 52,
				"name": "blabla"
			};

			assert.throws(function() {
					CallType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the description is null', function() {
			var json = {
				"description": null,
				"name": "blabla",
				"id": 42
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
				"id": 52
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object ("+JSON.stringify(json)+") and the expected JSON ("+JSON.stringify(expected)+") do not match.");
		})
	});

	describe('#setSource', function() {
		it('should set the given source', function() {
			var c = new CallType("toto","machin", 52);
			var s = new Source("toto", "machin","titi","tata", 12, 42);
			var spy = sinon.spy(s, "desynchronize");

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Source.getTableName()))
				.times(2)  // un appel juste en dessous et un deuxieme dans la methode setProfil vu que le lazy loading reste false
				.reply(200, JSON.stringify(reponse1));

			var source = c.source();
			assert.equal(source, null, "The source is not a null value: "+JSON.stringify(source));

			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Source.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.setSource(s);
			assert.ok(retour, "The return of the setSource is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the source in database.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the source");

			// normalement le lazy_loading est true : plus besoin de mock pour la requête
			source = c.source();
			assert.deepEqual(source, s, "The source() does not return the exact source we give: "+JSON.stringify(source));
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to add a null object', function() {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);

			assert.throws(function() {
					c.setSource(null);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add an undefined object', function() {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);

			assert.throws(function() {
					c.setSource(undefined);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add a object which is not yet created', function() {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);
			var s = new Source("toto", "machin","titi","tata", 12);

			assert.throws(function() {
					c.setSource(s);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to set a source if there is already one', function() {
			var c = new CallType("toto","machin", 52);
			var s = new Source("toto", "machin","titi","tata", 12, 42);
			var s2 = new Source("tutu", "blop","truc","much", 19, 89);


			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var source = c.source();

			assert.ok(!!source, "The source has false value.");
			assert.throws(function() {
					c.setSource(s);
				},
				ModelException,
				"The exception has not been thrown.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the source");
		});

	});

	describe('#unsetSource', function() {
		it('should unset the Source', function() {
			var c = new CallType("toto","machin", 52);
			var s = new Source("toto", "machin","titi","tata", 12, 42);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Source.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var source = c.source();
			assert.deepEqual(source, s, "The source is not the expected value");
			var spy = sinon.spy(source, "desynchronize");

			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Source.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.unsetSource();
			assert.ok(retour, "The return of the unsetSource is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

			source = c.source();
			assert.deepEqual(source, null, "The source() does not return a null value after unsetting");
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to unset a profil if there is none', function() {
			var c = new CallType("toto","machin", 52);
			var s = new Source("toto", "machin","titi","tata", 12, 42);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Source.getTableName()))
				.times(2)
				.reply(200, JSON.stringify(reponse1));

			var source = c.source();

			assert.equal(source, null, "The source has a value not null: "+JSON.stringify(source));
			assert.throws(function() {
					c.unsetSource();
				},
				ModelException,
				"The exception has not been thrown.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done");
		});

	});

	describe('#setRenderer', function() {
		it('should set the given renderer', function() {
			var c = new CallType("toto","machin", 52);
			var r = new Renderer("renderer","blop",12);
			var spy = sinon.spy(r, "desynchronize");

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Renderer.getTableName()))
				.times(2)  // un appel juste en dessous et un deuxieme dans la methode setProfil vu que le lazy loading reste false
				.reply(200, JSON.stringify(reponse1));

			var renderer = c.renderer();
			assert.equal(renderer, null, "The renderer is not a null value: "+JSON.stringify(renderer));

			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Renderer.getTableName(), r.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.setRenderer(r);
			assert.ok(retour, "The return of the setRenderer is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the renderer in database.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the renderer");

			// normalement le lazy_loading est true : plus besoin de mock pour la requête
			renderer = c.renderer();
			assert.deepEqual(renderer, r, "The renderer() does not return the exact renderer we give: "+JSON.stringify(renderer));
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to add a null object', function() {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);

			assert.throws(function() {
					c.setRenderer(null);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add an undefined object', function() {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);

			assert.throws(function() {
					c.setRenderer(undefined);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add a object which is not yet created', function() {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);
			var s = new Renderer("toto", "machin");

			assert.throws(function() {
					c.setRenderer(s);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to set a renderer if there is already one', function() {
			var c = new CallType("toto","machin", 52);
			var s = new Renderer("toto", "machin", 42);
			var s2 = new Renderer("tutu", "blop", 89);


			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Renderer.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var renderer = c.renderer();

			assert.ok(!!renderer, "The renderer has false value.");
			assert.throws(function() {
					c.setRenderer(s);
				},
				ModelException,
				"The exception has not been thrown.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the renderer");
		});

	});

	describe('#unsetRenderer', function() {
		it('should unset the Renderer', function() {
			var c = new CallType("toto","machin", 52);
			var s = new Renderer("toto", "machin", 42);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Renderer.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var renderer = c.renderer();
			assert.deepEqual(renderer, s, "The renderer is not the expected value");
			var spy = sinon.spy(renderer, "desynchronize");

			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), Renderer.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.unsetRenderer();
			assert.ok(retour, "The return of the unsetRenderer is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

			renderer = c.renderer();
			assert.deepEqual(renderer, null, "The renderer() does not return a null value after unsetting");
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to unset a profil if there is none', function() {
			var c = new CallType("toto","machin", 52);
			var s = new Renderer("toto", "machin",42);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), Renderer.getTableName()))
				.times(2)
				.reply(200, JSON.stringify(reponse1));

			var renderer = c.renderer();

			assert.equal(renderer, null, "The renderer has a value not null: "+JSON.stringify(renderer));
			assert.throws(function() {
					c.unsetRenderer();
				},
				ModelException,
				"The exception has not been thrown.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done");
		});

	});

	describe('#setReceivePolicy', function() {
		it('should set the given receivePolicy', function() {
			var c = new CallType("toto","machin", 52);
			var r = new ReceivePolicy("receivePolicy",12);
			var spy = sinon.spy(r, "desynchronize");

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), ReceivePolicy.getTableName()))
				.times(2)  // un appel juste en dessous et un deuxieme dans la methode setProfil vu que le lazy loading reste false
				.reply(200, JSON.stringify(reponse1));

			var receivePolicy = c.receivePolicy();
			assert.equal(receivePolicy, null, "The receivePolicy is not a null value: "+JSON.stringify(receivePolicy));

			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), ReceivePolicy.getTableName(), r.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.setReceivePolicy(r);
			assert.ok(retour, "The return of the setReceivePolicy is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the receivePolicy in database.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the receivePolicy");

			// normalement le lazy_loading est true : plus besoin de mock pour la requête
			receivePolicy = c.receivePolicy();
			assert.deepEqual(receivePolicy, r, "The receivePolicy() does not return the exact receivePolicy we give: "+JSON.stringify(receivePolicy));
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to add a null object', function() {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);

			assert.throws(function() {
					c.setReceivePolicy(null);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add an undefined object', function() {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);

			assert.throws(function() {
					c.setReceivePolicy(undefined);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add a object which is not yet created', function() {
			nock.disableNetConnect();
			var c = new CallType("toto","machin", 52);
			var s = new ReceivePolicy("toto");

			assert.throws(function() {
					c.setReceivePolicy(s);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to set a receivePolicy if there is already one', function() {
			var c = new CallType("toto","machin", 52);
			var s = new ReceivePolicy("toto", 42);
			var s2 = new ReceivePolicy("tutu", 89);


			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), ReceivePolicy.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var receivePolicy = c.receivePolicy();

			assert.ok(!!receivePolicy, "The receivePolicy has false value.");
			assert.throws(function() {
					c.setReceivePolicy(s);
				},
				ModelException,
				"The exception has not been thrown.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the receivePolicy");
		});

	});

	describe('#unsetReceivePolicy', function() {
		it('should unset the ReceivePolicy', function() {
			var c = new CallType("toto","machin", 52);
			var s = new ReceivePolicy("toto", 42);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), ReceivePolicy.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var receivePolicy = c.receivePolicy();
			assert.deepEqual(receivePolicy, s, "The receivePolicy is not the expected value");
			var spy = sinon.spy(receivePolicy, "desynchronize");

			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(CallType.getTableName(), c.getId().toString(), ReceivePolicy.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.unsetReceivePolicy();
			assert.ok(retour, "The return of the unsetReceivePolicy is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

			receivePolicy = c.receivePolicy();
			assert.deepEqual(receivePolicy, null, "The receivePolicy() does not return a null value after unsetting");
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to unset a profil if there is none', function() {
			var c = new CallType("toto","machin", 52);
			var s = new ReceivePolicy("toto",42);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(CallType.getTableName(), c.getId().toString(), ReceivePolicy.getTableName()))
				.times(2)
				.reply(200, JSON.stringify(reponse1));

			var receivePolicy = c.receivePolicy();

			assert.equal(receivePolicy, null, "The receivePolicy has a value not null: "+JSON.stringify(receivePolicy));
			assert.throws(function() {
					c.unsetReceivePolicy();
				},
				ModelException,
				"The exception has not been thrown.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done");
		});

	});
});