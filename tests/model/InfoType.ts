
/**
* @author Simon Urli <simon@the6thscreen.fr>
*/

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />

/// <reference path="../../app/scripts/core/DatabaseConnection.ts" />
/// <reference path="../../app/scripts/model/InfoType.ts" />

var assert = require("assert");
var nock = require("nock");

describe('InfoType', function(){

	describe('#constructor', function() {
		it('should have a defined name', function() {
			assert.throws(function() {
					new InfoType("");
				},
				Error);
		}),

		it('should store the name', function() {
			var name = "toto";
			var info = new InfoType(name);

			assert.equal(info.name(), name, "The name is stored.");
		})
	}),

	describe('#create()', function() {
		it('should get an id when built', function() {
			var info = new InfoType("toto");
			var mockID = 42;

			var reponse : SequelizeRestfulResponse = {
				"status": "success",
				"data": info.toJSONObject()
			};

			reponse.data["id"] = mockID;

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.post(DatabaseConnection.modelEndpoint(InfoType.getTableName()), info.toJSONObject())
				.reply(200, JSON.stringify(reponse));

			var retour = info.create();

			assert.ok(retour, "The creation worked well");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
			assert.equal(info.getId(), mockID, "The ID is not recorded in the object.");
		}),

		it('should throw an error when trying to built an existing object', function() {
			var info = new InfoType("toto", 42);

			assert.throws(function() {
				info.create();
			}, ModelException);
		})
	}),

	describe('#update()', function() {
		it('should send the proper request', function() {
			var id = 42;
			var info = new InfoType("blabla", id);

			var reponse : SequelizeRestfulResponse = {
				"status": "success",
				"data": info.toJSONObject()
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.objectEndpoint(InfoType.getTableName(), id.toString()), info.toJSONObject())
				.reply(200, JSON.stringify(reponse));

			var retour = info.update();

			assert.ok(retour, "The update worked well");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		})
	})

});