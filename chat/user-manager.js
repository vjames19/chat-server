var UserManager = function() {
  this.usernames = {};
};

UserManager.prototype.isAvailable = function(username) {
  return this.usernames[username];
};

UserManager.prototype.addUser = function(username) {
  if (this.isAvailable(username)) {
    this.usernames[username] = true;
    return true;
  }

  return false;
};

UserManager.prototype.removeUser = function(username) {
  delete this.usernames[username];
};

UserManager.prototype.getUsernames = function() {
  return Object.keys(this.usernames);
};

modulex.exports = UserManager;
