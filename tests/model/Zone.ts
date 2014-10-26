///<reference path="../../scripts/core/DatabaseConnection.ts"/>
/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/Zone.ts" />
/// <reference path="../../scripts/core/DatabaseConnection.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('Zone', function() {
	describe('#constructor', function () {
		it('should throw an error if the name is undefined', function(){
			assert.throws(
				function() {
					new Zone(undefined, "", 1, 2, 3, 4);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the name is null', function(){
			assert.throws(
				function() {
					new Zone(null, "", 1, 2, 3, 4);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the name is empty', function(){
			assert.throws(
				function() {
					new Zone("", "", 1, 2, 3, 4);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the width is undefined', function(){
			assert.throws(
				function() {
					new Zone("toto", "", undefined, 2, 3, 4);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the width is null', function(){
			assert.throws(
				function() {
					new Zone("toto", "", null, 2, 3, 4);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the height is undefined', function(){
			assert.throws(
				function() {
					new Zone("toto", "", 1, undefined, 3, 4);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the height is null', function(){
			assert.throws(
				function() {
					new Zone("toto", "", 1, null, 3, 4);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the positionFromTop is undefined', function(){
			assert.throws(
				function() {
					new Zone("toto", "", 1,2, undefined, 4);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the positionFromTop is null', function(){
			assert.throws(
				function() {
					new Zone("toto", "", 1,2, null, 4);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

        it('should not throw an error if the positionFromTop is 0', function(){
            assert.doesNotThrow(
                function() {
                    new Zone("toto", "", 1,2, 0, 4);
                },
                ModelException,
                "The exception has been thrown."
            );
        });

		it('should throw an error if the positionFromLeft is undefined', function(){
			assert.throws(
				function() {
					new Zone("toto", "", 1,2,3, undefined);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the positionFromLeft is null', function(){
			assert.throws(
				function() {
					new Zone("toto", "", 1,2,3, null);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

        it('should not throw an error if the positionFromLeft is 0', function(){
            assert.doesNotThrow(
                function() {
                    new Zone("toto", "", 1,2, 3, 0);
                },
                ModelException,
                "The exception has been thrown."
            );
        });

		it('should store the name', function () {
			var name = "machin";
			var c = new Zone(name, "description", 10, 20, 30, 40);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function () {
			var desc = "machin";
			var c = new Zone("blurf", desc, 10, 20, 30, 40);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the width', function () {
			var width = 10;
			var c = new Zone("blurf", "description", width, 20, 30, 40);
			assert.equal(c.width(), width, "The width is not stored correctly.");
		});

		it('should store the height', function () {
			var height = 20;
			var c = new Zone("blurf", "description", 10, height, 30, 40);
			assert.equal(c.height(), height, "The height is not stored correctly.");
		});

		it('should store the positionFromTop', function () {
			var positionFromTop = 30;
			var c = new Zone("blurf", "description", 10, 20, positionFromTop, 40);
			assert.equal(c.positionFromTop(), positionFromTop, "The positionFromTop is not stored correctly.");
		});

		it('should store the positionFromLeft', function () {
			var positionFromLeft = 20;
			var c = new Zone("blurf", "description", 10, 20, 30, positionFromLeft);
			assert.equal(c.positionFromLeft(), positionFromLeft, "The positionFromLeft is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new Zone("bidule", "description", 10, 20, 30, 40, id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "blabla",
				"width": 10,
				"height": 20,
				"positionFromTop": 30,
				"positionFromLeft": 40
			};

			var callRetrieve = Zone.fromJSONObject(json);
			var callExpected = new Zone("toto", "blabla", 10, 20, 30, 40, 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve zone (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});

		it('should throw an exception if the ID is undefined', function () {
			var json = {
				"name": "toto",
				"description": "blabla",
				"width": 10,
				"height": 20,
				"positionFromTop": 30,
				"positionFromLeft": 40
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function () {
			var json = {
				"id": null,
				"name": "toto",
				"description": "blabla",
				"width": 10,
				"height": 20,
				"positionFromTop": 30,
				"positionFromLeft": 40
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is undefined', function () {
			var json = {
				"id": 42,
				"description": "blabla",
				"width": 10,
				"height": 20,
				"positionFromTop": 30,
				"positionFromLeft": 40
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is null', function () {
			var json = {
				"id": 42,
				"name": null,
				"description": "blabla",
				"width": 10,
				"height": 20,
				"positionFromTop": 30,
				"positionFromLeft": 40
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the description is undefined', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"width": 10,
				"height": 20,
				"positionFromTop": 30,
				"positionFromLeft": 40
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the description is null', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": null,
				"width": 10,
				"height": 20,
				"positionFromTop": 30,
				"positionFromLeft": 40
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the width is undefined', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "machin",
				"height": 20,
				"positionFromTop": 30,
				"positionFromLeft": 40
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the width is null', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "machin",
				"width": null,
				"height": 20,
				"positionFromTop": 30,
				"positionFromLeft": 40
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the height is undefined', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "machin",
				"width": 10,
				"positionFromTop": 30,
				"positionFromLeft": 40
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the height is null', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "machin",
				"width": 10,
				"height": null,
				"positionFromTop": 30,
				"positionFromLeft": 40
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the positionFromTop is undefined', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "machin",
				"width": 10,
				"height": 30,
				"positionFromLeft": 40
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the positionFromTop is null', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "machin",
				"width": 10,
				"height": 20,
				"positionFromTop": null,
				"positionFromLeft": 40
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the positionFromLeft is undefined', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "machin",
				"width": 10,
				"height": 30,
				"positionFromTop": 40
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the positionFromLeft is null', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "machin",
				"width": 10,
				"height": 20,
				"positionFromTop": 30,
				"positionFromLeft": null
			};

			assert.throws(function () {
					Zone.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new Zone("toto", "blabla", 10, 20, 30, 40, 42);
			var expected = {
				"id": 42,
				"name": "toto",
				"description": "blabla",
				"width": 10,
				"height": 20,
				"positionFromTop": 30,
				"positionFromLeft": 40
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#setBehaviour', function () {
		it('should set the given behaviour', function () {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var s = new Behaviour("toto", "machin", 42);
			var spy = sinon.spy(s, "desynchronize");

			var reponse1:SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), Behaviour.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var behaviour = c.behaviour();
			assert.equal(behaviour, null, "The behaviour is not a null value: " + JSON.stringify(behaviour));

			var reponse2:SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(Zone.getTableName(), c.getId().toString(), Behaviour.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.setBehaviour(s);
			assert.ok(retour, "The return of the setBehaviour is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the behaviour in database.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the behaviour");

			// normalement le lazy_loading est true : plus besoin de mock pour la requête
			behaviour = c.behaviour();
			assert.deepEqual(behaviour, s, "The behaviour() does not return the exact behaviour we give: " + JSON.stringify(behaviour));
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to add a null object', function () {
			nock.disableNetConnect();
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);

			assert.throws(function () {
					c.setBehaviour(null);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add an undefined object', function () {
			nock.disableNetConnect();
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);

			assert.throws(function () {
					c.setBehaviour(undefined);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add a object which is not yet created', function () {
			nock.disableNetConnect();
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var s = new Behaviour("toto","machin");

			assert.throws(function () {
					c.setBehaviour(s);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to set a behaviour if there is already one', function () {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var s = new Behaviour("toto","machin", 42);
			var s2 = new Behaviour("tutu","blabla", 89);


			var reponse1:SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), Behaviour.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var behaviour = c.behaviour();

			assert.ok(!!behaviour, "The behaviour has false value.");
			assert.throws(function () {
					c.setBehaviour(s);
				},
				ModelException,
				"The exception has not been thrown.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the behaviour");
		});

	});

	describe('#unsetBehaviour', function () {
		it('should unset the Behaviour', function () {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var s = new Behaviour("toto", "machin", 42);

			var reponse1:SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), Behaviour.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var behaviour = c.behaviour();
			assert.deepEqual(behaviour, s, "The behaviour is not the expected value");
			var spy = sinon.spy(behaviour, "desynchronize");

			var reponse2:SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(Zone.getTableName(), c.getId().toString(), Behaviour.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.unsetBehaviour();
			assert.ok(retour, "The return of the unsetBehaviour is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

			behaviour = c.behaviour();
			assert.deepEqual(behaviour, null, "The behaviour() does not return a null value after unsetting");
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to unset a profil if there is none', function () {
			var c = new Zone("bidule", "description", 10, 20, 30, 40, 13);
			var s = new Behaviour("toto", "blabla", 42);

			var reponse1:SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Zone.getTableName(), c.getId().toString(), Behaviour.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var behaviour = c.behaviour();

			assert.equal(behaviour, null, "The behaviour has a value not null: " + JSON.stringify(behaviour));
			assert.throws(function () {
					c.unsetBehaviour();
				},
				ModelException,
				"The exception has not been thrown.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done");
		});

	});
});