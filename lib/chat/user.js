var _ = require('lodash');

var User = function(username, socket) {
  this.username = username;
  this.socket = socket;
};

var UserManager = function() {
  this.users = {};
};

UserManager.prototype.isAvailable = function(username) {
  return !_.has(this.users, username);
};

UserManager.prototype.add = function(user) {
  if (this.isAvailable(user.username)) {
    this.users[user.username] = user;
  }
};

UserManager.prototype.remove = function(user) {
  delete this.users[user.username];
};

UserManager.prototype.getUsernames = function() {
  return _.keys(this.users);
};

exports.User = User;
exports.UserManager = UserManager;


