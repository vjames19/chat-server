var env = process.env.NODE_ENV || 'development';
var config = {
  production: {
    level: 'info'
  },
  development: {
    level: 'trace'
  },
  test: {
    level: 'error'
  }
};

module.exports = config[env] || config['production'];
