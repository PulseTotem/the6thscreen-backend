/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../app/scripts/model/Zone.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('Zone', function() {
	describe('#constructor', function () {
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
});