var env = process.env.NODE_ENV || 'development';
var config = {
  production: {
    level: 'info'
  },
  development: {
    level: 'trace'
  }
};

module.exports = config[env] || config['production'];
