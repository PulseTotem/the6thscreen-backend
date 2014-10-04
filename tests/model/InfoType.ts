
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

	it('should have a defined name', function(){
		assert.throws(function() {
			new InfoType("");
		},
		Error);
	}),

	it('should get an id when built', function() {
		var info = new InfoType("toto");
		var mockID = 42;

		var reponse : SequelizeRestfulResponse = {
			"status": "success",
			"data": info.toJSONObject()
		};

		reponse.data["id"] = mockID;

		var restClientMock = nock("http://"+DatabaseConnection.getHost()+":"+DatabaseConnection.getPort())
							 .post("/api/" + InfoType.getTableName(), info.toJSONObject())
							 .reply(200, JSON.stringify(reponse));
		info.create();
		assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		assert.equal(info.getId(), mockID, "The ID is not recorded in the object.");
	});
});