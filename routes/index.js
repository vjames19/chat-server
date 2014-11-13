var router = require('express').Router();

module.exports = function(app) {
  router.get('/*', function(req, res) {
    res.sendFile('dist/index.html', {root: app.get('rootDirectory')});
  });

  return router;
};
