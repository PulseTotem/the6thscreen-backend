/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../app/scripts/model/CallType.ts" />

var assert = require("assert");
var nock = require("nock");
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

	/*describe('#unsetSource', function() {
		it('should unset the Profil', function() {
			var c = new Call("toto", 52);
			var p = new Profil("toto", "machin", 42);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": p.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), Profil.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var profil = c.profil();
			assert.deepEqual(profil, p, "The profil is not the expected value");
			var spy = sinon.spy(profil, "desynchronize");

			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(Call.getTableName(), c.getId().toString(), Profil.getTableName(), p.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.unsetProfil();
			assert.ok(retour, "The return of the unsetProfil is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramValue in database.");

			profil = c.profil();
			assert.deepEqual(profil, null, "The profil() does not return a null value after unsetting");
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to unset a profil if there is none', function() {
			var c = new Call("toto", 52);
			var p = new Profil("toto","machin", 13);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), Profil.getTableName()))
				.times(2)
				.reply(200, JSON.stringify(reponse1));

			var profil = c.profil();

			assert.equal(profil, null, "The profil has a value not null: "+JSON.stringify(profil));
			assert.throws(function() {
					c.unsetProfil();
				},
				ModelException,
				"The exception has not been thrown.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the profil");
		});

	});*/
});