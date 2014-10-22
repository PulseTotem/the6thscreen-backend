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
		it('should throw an error if the name is undefined', function(){
			assert.throws(
				function() {
					new ParamType(undefined);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the name is null', function(){
			assert.throws(
				function() {
					new ParamType(null);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the name is empty', function(){
			assert.throws(
				function() {
					new ParamType("");
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should store the name', function () {
			var name = "machin";
			var c = new ParamType(name, "");
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function () {
			var desc = "machin";
			var c = new ParamType("toto", desc);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new ParamType("titi", "", id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "blabla"
			};

			var callRetrieve = ParamType.fromJSONObject(json);
			var callExpected = new ParamType("toto", "blabla", 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve paramType (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});

		it('should throw an exception if the ID is undefined', function () {
			var json = {
				"name": "toto",
				"description": "blabla"
			};

			assert.throws(function () {
					ParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function () {
			var json = {
				"name": "toto",
				"description": "blabla",
				"id": null
			};

			assert.throws(function () {
					ParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is undefined', function () {
			var json = {
				"id": 52,
				"description": "blabla"
			};

			assert.throws(function () {
					ParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is null', function () {
			var json = {
				"name": null,
				"description": "blabla",
				"id": 42
			};

			assert.throws(function () {
					ParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the description is undefined', function () {
			var json = {
				"id": 52,
				"name": "blabla"
			};

			assert.throws(function () {
					ParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the description is null', function () {
			var json = {
				"description": null,
				"name": "blabla",
				"id": 42
			};

			assert.throws(function () {
					ParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new ParamType("toto", "blabla", 52);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"id": 52
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#setType', function() {
		it('should set the given type', function() {
			var c = new ParamType("toto","machin", 52);
			var s = new TypeParamType("toto", 42);
			var spy = sinon.spy(s, "desynchronize");

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var type = c.type();
			assert.equal(type, null, "The type is not a null value: "+JSON.stringify(type));

			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.setType(s);
			assert.ok(retour, "The return of the setTypeParamType is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the type in database.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the type");

			// normalement le lazy_loading est true : plus besoin de mock pour la requête
			type = c.type();
			assert.deepEqual(type, s, "The type() does not return the exact type we give: "+JSON.stringify(type));
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to add a null object', function() {
			nock.disableNetConnect();
			var c = new ParamType("toto","machin", 52);

			assert.throws(function() {
					c.setType(null);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add an undefined object', function() {
			nock.disableNetConnect();
			var c = new ParamType("toto","machin", 52);

			assert.throws(function() {
					c.setType(undefined);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add a object which is not yet created', function() {
			nock.disableNetConnect();
			var c = new ParamType("toto","machin", 52);
			var s = new TypeParamType("toto");

			assert.throws(function() {
					c.setType(s);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to set a type if there is already one', function() {
			var c = new ParamType("toto","machin", 52);
			var s = new TypeParamType("toto", 42);
			var s2 = new TypeParamType("tutu", 89);


			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var type = c.type();

			assert.ok(!!type, "The type has false value.");
			assert.throws(function() {
					c.setType(s);
				},
				ModelException,
				"The exception has not been thrown.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the type");
		});

	});

	describe('#unsetType', function() {
		it('should unset the TypeParamType', function() {
			var c = new ParamType("toto","machin", 52);
			var s = new TypeParamType("toto", 42);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var type = c.type();
			assert.deepEqual(type, s, "The type is not the expected value");
			var spy = sinon.spy(type, "desynchronize");

			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.unsetType();
			assert.ok(retour, "The return of the unsetTypeParamType is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

			type = c.type();
			assert.deepEqual(type, null, "The type() does not return a null value after unsetting");
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to unset a profil if there is none', function() {
			var c = new ParamType("toto","machin", 52);
			var s = new TypeParamType("toto", 42);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), TypeParamType.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var type = c.type();

			assert.equal(type, null, "The type has a value not null: "+JSON.stringify(type));
			assert.throws(function() {
					c.unsetType();
				},
				ModelException,
				"The exception has not been thrown.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done");
		});

	});

	describe('#setConstraint', function() {
		it('should set the given constraint', function() {
			var c = new ParamType("toto","machin", 52);
			var s = new ConstraintParamType("toto","tata" ,42);
			var spy = sinon.spy(s, "desynchronize");

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ConstraintParamType.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var constraint = c.constraint();
			assert.equal(constraint, null, "The constraint is not a null value: "+JSON.stringify(constraint));

			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), ConstraintParamType.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.setConstraint(s);
			assert.ok(retour, "The return of the setConstraintParamType is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the constraint in database.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the constraint");

			// normalement le lazy_loading est true : plus besoin de mock pour la requête
			constraint = c.constraint();
			assert.deepEqual(constraint, s, "The constraint() does not return the exact constraint we give: "+JSON.stringify(constraint));
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to add a null object', function() {
			nock.disableNetConnect();
			var c = new ParamType("toto","machin", 52);

			assert.throws(function() {
					c.setConstraint(null);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add an undefined object', function() {
			nock.disableNetConnect();
			var c = new ParamType("toto","machin", 52);

			assert.throws(function() {
					c.setConstraint(undefined);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add a object which is not yet created', function() {
			nock.disableNetConnect();
			var c = new ParamType("toto","machin", 52);
			var s = new ConstraintParamType("toto","tata");

			assert.throws(function() {
					c.setConstraint(s);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to set a constraint if there is already one', function() {
			var c = new ParamType("toto","machin", 52);
			var s = new ConstraintParamType("toto", "tata", 42);
			var s2 = new ConstraintParamType("tutu", "tata", 89);


			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ConstraintParamType.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var constraint = c.constraint();

			assert.ok(!!constraint, "The constraint has false value.");
			assert.throws(function() {
					c.setConstraint(s);
				},
				ModelException,
				"The exception has not been thrown.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the constraint");
		});

	});

	describe('#unsetConstraint', function() {
		it('should unset the ConstraintParamType', function() {
			var c = new ParamType("toto","machin", 52);
			var s = new ConstraintParamType("toto","tata", 42);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ConstraintParamType.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var constraint = c.constraint();
			assert.deepEqual(constraint, s, "The constraint is not the expected value");
			var spy = sinon.spy(constraint, "desynchronize");

			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), ConstraintParamType.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.unsetConstraint();
			assert.ok(retour, "The return of the unsetConstraintParamType is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

			constraint = c.constraint();
			assert.deepEqual(constraint, null, "The constraint() does not return a null value after unsetting");
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to unset a profil if there is none', function() {
			var c = new ParamType("toto","machin", 52);
			var s = new ConstraintParamType("toto","tata", 42);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ConstraintParamType.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var constraint = c.constraint();

			assert.equal(constraint, null, "The constraint has a value not null: "+JSON.stringify(constraint));
			assert.throws(function() {
					c.unsetConstraint();
				},
				ModelException,
				"The exception has not been thrown.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done");
		});

	});

	describe('#setDefaultValue', function() {
		it('should set the given defaultValue', function() {
			var c = new ParamType("toto","machin", 52);
			var s = new ParamValue("toto" ,42);
			var spy = sinon.spy(s, "desynchronize");

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var defaultValue = c.defaultValue();
			assert.equal(defaultValue, null, "The defaultValue is not a null value: "+JSON.stringify(defaultValue));

			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), ParamValue.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.setDefaultValue(s);
			assert.ok(retour, "The return of the setParamValue is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the defaultValue in database.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the defaultValue");

			// normalement le lazy_loading est true : plus besoin de mock pour la requête
			defaultValue = c.defaultValue();
			assert.deepEqual(defaultValue, s, "The defaultValue() does not return the exact defaultValue we give: "+JSON.stringify(defaultValue));
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to add a null object', function() {
			nock.disableNetConnect();
			var c = new ParamType("toto","machin", 52);

			assert.throws(function() {
					c.setDefaultValue(null);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add an undefined object', function() {
			nock.disableNetConnect();
			var c = new ParamType("toto","machin", 52);

			assert.throws(function() {
					c.setDefaultValue(undefined);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add a object which is not yet created', function() {
			nock.disableNetConnect();
			var c = new ParamType("toto","machin", 52);
			var s = new ParamValue("toto");

			assert.throws(function() {
					c.setDefaultValue(s);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to set a defaultValue if there is already one', function() {
			var c = new ParamType("toto","machin", 52);
			var s = new ParamValue("toto", 42);
			var s2 = new ParamValue("tutu", 89);


			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var defaultValue = c.defaultValue();

			assert.ok(!!defaultValue, "The defaultValue has false value.");
			assert.throws(function() {
					c.setDefaultValue(s);
				},
				ModelException,
				"The exception has not been thrown.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the defaultValue");
		});

	});

	describe('#unsetDefaultValue', function() {
		it('should unset the ParamValue', function() {
			var c = new ParamType("toto","machin", 52);
			var s = new ParamValue("toto",42);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var defaultValue = c.defaultValue();
			assert.deepEqual(defaultValue, s, "The defaultValue is not the expected value");
			var spy = sinon.spy(defaultValue, "desynchronize");

			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(ParamType.getTableName(), c.getId().toString(), ParamValue.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.unsetDefaultValue();
			assert.ok(retour, "The return of the unsetParamValue is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

			defaultValue = c.defaultValue();
			assert.deepEqual(defaultValue, null, "The defaultValue() does not return a null value after unsetting");
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to unset a profil if there is none', function() {
			var c = new ParamType("toto","machin", 52);
			var s = new ParamValue("toto", 42);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ParamType.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var defaultValue = c.defaultValue();

			assert.equal(defaultValue, null, "The defaultValue has a value not null: "+JSON.stringify(defaultValue));
			assert.throws(function() {
					c.unsetDefaultValue();
				},
				ModelException,
				"The exception has not been thrown.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done");
		});

	});
});