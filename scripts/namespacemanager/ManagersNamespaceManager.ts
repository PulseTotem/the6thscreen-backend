/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="./BackendAuthNamespaceManager.ts" />
/// <reference path="../model/Team.ts" />

class ManagersNamespaceManager extends BackendAuthNamespaceManager {

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {any} socket - The socket.
	 */
	constructor(socket : any) {
		super(socket);

		var self = this;

		this.addListenerToSocket('ManageTeams', function() { self.manageExistingTeams(); });

		this.addListenerToSocket('RetrieveUserByUsername', function(data) { self.retrieveUserByUsername(data); });
		this.addListenerToSocket('RetrieveTeamByName', function(data) { self.retrieveTeamByName(data); });
	}

////////////////////// Begin: Manage retrieveUserByUsername //////////////////////

	/**
	 * Retrieve a User from given data.
	 * Send the result on the channel "AnswerRetrieveUserByUsername"
	 *
	 * @method retrieveUserByUsername
	 * @param {JSONObject} userDescription - User description to retrieve
	 */
	retrieveUserByUsername(userDescription : any) {
		var self = this;

		var fail = function(error) {
			self.socket.emit("AnswerRetrieveUserByUsername", self.formatResponse(false, error));
			Logger.error("SocketId: " + self.socket.id + " - retrieveUserByUsername : send done with fail status.");
		};

		var successUserCompleteDesc = function(userCompleteDesc) {
			self.socket.emit("AnswerRetrieveUserByUsername", self.formatResponse(true, userCompleteDesc));
			Logger.debug("SocketId: " + self.socket.id + " - retrieveUserByUsername : send done with success status.");
		};

		var successFind = function(user : User) {
			user.toCompleteJSONObject(successUserCompleteDesc, fail);
		};

		var username : string = userDescription.username;

		User.findOneByUsername(username, successFind, fail);
	}

////////////////////// End: Manage retrieveUserByUsername //////////////////////

////////////////////// Begin: Manage retrieveTeamByName //////////////////////

	/**
	 * Retrieve a Team from given data.
	 * Send the result on the channel "AnswerRetrieveTeamByName"
	 *
	 * @method retrieveTeamByName
	 * @param {JSONObject} teamDescription - Team description to retrieve
	 */
	retrieveTeamByName(teamDescription : any) {
		var self = this;

		var fail = function(error) {
			self.socket.emit("AnswerRetrieveTeamByName", self.formatResponse(false, error));
			Logger.error("SocketId: " + self.socket.id + " - retrieveTeamByName : send done with fail status.");
		};

		var successTeamCompleteDesc = function(teamCompleteDesc) {
			self.socket.emit("AnswerRetrieveTeamByName", self.formatResponse(true, teamCompleteDesc));
			Logger.debug("SocketId: " + self.socket.id + " - retrieveTeamByName : send done with success status.");
		};

		var successFind = function(team : Team) {
			team.toCompleteJSONObject(successTeamCompleteDesc, fail);
		};

		var teamname : string = teamDescription.name;

		Team.findOneByName(teamname, successFind, fail);
	}

////////////////////// End: Manage retrieveTeamByName //////////////////////





	/**
	 * Temp method
	 *
	 * @method manageExistingTeams
	 */
	manageExistingTeams() {
		//
		var self = this;

		var fail = function (error) {
			self.socket.emit("ManageTeamsAnswer", self.formatResponse(false, error));
			Logger.error("SocketId: "+self.socket.id+" - manageExistingTeams failed");
			Logger.debug(error);
		};

		var successAllTeams = function (teams : Array<Team>) {

			var successManageTeams = function () {
				self.socket.emit("ManageTeamsAnswer", self.formatResponse(true, teams.length));
			};


			if(teams.length > 0) {
				var teamIndex = 0;
				var manageTeam = function() {
					if(teamIndex == teams.length) {
						successManageTeams();
					} else {
						var team = teams[teamIndex];

						var successLoadUsers = function () {
							if (team.users().length > 0) {
								var userIndex = 0;

								var manageUser = function() {

									if(userIndex == team.users().length) {
										teamIndex++;

										manageTeam();
									} else {
										var user = team.users()[userIndex];

										var successAddUserToTeam = function () {
											userIndex++;

											manageUser();
										};

										if (user.cmsId() != "") {
											var addUserToTeamUrl = BackendConfig.getCMSHost() + BackendConfig.getCMSTeamsPath() + team.cmsId() + '/' + BackendConfig.getCMSUsersPath() + user.cmsId();

											var data = {};

											RestClient.put(addUserToTeamUrl, data, successAddUserToTeam, fail, self.socket.connectedUser.cmsAuthkey());
										} else {
											successAddUserToTeam();
										}
									}
								};

								manageUser();

							} else {
								teamIndex++;

								manageTeam();
							}
						};

						var successUpdateTeam = function () {
							team.loadUsers(successLoadUsers, fail);
						};

						var successCreateTeam = function (cmsTeamResponse:any) {
							var cmsTeam = cmsTeamResponse.data();

							var teamCMSId = cmsTeam.id;

							team.setCmsId(teamCMSId);

							team.update(successUpdateTeam, fail);
						};

						var createTeamUrl = BackendConfig.getCMSHost() + BackendConfig.getCMSTeamsPath();

						var data = {
							"name": team.name()
						};

						RestClient.post(createTeamUrl, data, successCreateTeam, fail, self.socket.connectedUser.cmsAuthkey());
					}
				};

				manageTeam();
			} else {
				successManageTeams();
			}
		};

		Team.all(successAllTeams, fail);
	}
}